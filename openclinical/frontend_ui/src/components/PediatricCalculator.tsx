import React, { useState, useEffect, useMemo } from 'react';
import { Baby, AlertTriangle, ShieldCheck, Copy, Check, Search, X } from 'lucide-react';
import { ResultadoDosePediatrica } from '../types';
import { adicionarItemPrescricaoModular, obterPacienteAtivo } from '../storage_clinico';
import { Plus } from 'lucide-react';
import { apresentacoesComerciaisDoFarmaco, executarCalculoClinico } from '../api';
import type { EsquemaAdministracaoFtn, MonografiaFtn } from '../data/formulario_terapeutico';
import { carregarFormulario, capitalizar, filtrarMonografias } from '../formulario_utils';
import { mgPorMl, mgPorMlPrimeiroComponente, type ApresentacaoComercialLiquida } from '../pediatria_ftn';
import { viaApresentacaoCmed } from '../ligacao_ftn';
import {
  esquemaParenteral,
  esquemasPediatricos,
  faixaDoPeso,
  faixasDePeso,
  formulacoesLiquidas,
  formulacoesSolidas,
  fracionamentoSugerido,
  lerFaixaDoEsquema,
  type FaixaPesoDose,
  type FormulacaoDisponivel,
  type FormulacaoSolida,
  type ModoDose,
} from '../pediatria_ftn';

interface PediatricCalculatorProps {
  pesoInicial?: number;
  doseAlvoInicial?: number;
  /** mg/mL da formulação líquida; null quando o produto de origem não é líquido e o usuário deve informar. */
  concentracaoInicial?: number | null;
  fracionamentoInicial?: number;
  tetoMaximoInicial?: number | null;
  nomeMedicamento?: string;
  /** Texto do esquema de origem (ex.: posologia do FTN), mostrado para o médico escolher a dose dentro da faixa */
  referenciaDose?: string;
  /** Monografia do FTN de origem: a calculadora a seleciona e relê o esquema de `referenciaDose` */
  idMonografiaInicial?: number;
  /** false no app Android só da calculadora, que não tem o módulo de receita */
  permitirAdicionarReceita?: boolean;
}

const lerNumero = (valor: string): number | null => {
  const numero = parseFloat(valor.replace(',', '.'));
  return Number.isFinite(numero) ? numero : null;
};

const OPCOES_FRACIONAMENTO = [
  { tomadas: 6, label: '4/4 h' },
  { tomadas: 4, label: '6/6 h' },
  { tomadas: 3, label: '8/8 h' },
  { tomadas: 2, label: '12/12 h' },
  { tomadas: 1, label: '1x/dia' },
];

const formatar = (valor: number) => (Number.isInteger(valor) ? String(valor) : valor.toFixed(2).replace(/\.?0+$/, ''));

/** Faixa de dose do esquema escolhido, em mg/kg (por dia ou por tomada, conforme o modo). */
interface FaixaRecomendada {
  min: number;
  max: number;
  /** modo dito pelo esquema; null quando o texto não diz se é por dia ou por tomada */
  modo: ModoDose | null;
}

// Tolerância de arredondamento ao comparar a dose digitada com a faixa
const EPSILON_FAIXA = 1e-6;
const CHAVE_ULTRAPASSAR = 'openclinical_pediatria_permitir_ultrapassar';

export const PediatricCalculator: React.FC<PediatricCalculatorProps> = ({
  pesoInicial = 12.0,
  doseAlvoInicial,
  concentracaoInicial = null,
  fracionamentoInicial,
  tetoMaximoInicial = null,
  nomeMedicamento,
  referenciaDose,
  idMonografiaInicial,
  permitirAdicionarReceita = true,
}) => {
  const [nome, setNome] = useState<string>(nomeMedicamento ?? '');
  const [referencia, setReferencia] = useState<string | undefined>(referenciaDose);
  const [peso, setPeso] = useState<number | null>(pesoInicial);
  const [modo, setModo] = useState<ModoDose | null>(doseAlvoInicial !== undefined ? 'dia' : null);
  const [dose, setDose] = useState<number | null>(doseAlvoInicial ?? null);
  const [concentracao, setConcentracao] = useState<number | null>(concentracaoInicial);
  const [fracionamento, setFracionamento] = useState<number | null>(fracionamentoInicial ?? null);
  const [doseUnica, setDoseUnica] = useState(false);
  const [tetoMaximo, setTetoMaximo] = useState<number | null>(tetoMaximoInicial);
  // Gotas só fazem sentido em soluções gotejadoras (20 gotas/mL); suspensões são medidas em mL
  const [formulacaoEmGotas, setFormulacaoEmGotas] = useState<boolean>(/gota/i.test(nomeMedicamento ?? ''));
  // Comprimido/cápsula: não há concentração em mg/mL, o resultado é só em mg (e em unidades, se a dose do comprimido for conhecida)
  const [formaSolida, setFormaSolida] = useState(false);
  const [solida, setSolida] = useState<FormulacaoSolida | null>(null);
  const mgPorUnidade = solida?.mgPorUnidade ?? null;
  // A faixa do esquema limita a dose; o médico pode ultrapassá-la marcando a caixa
  const [faixa, setFaixa] = useState<FaixaRecomendada | null>(null);
  const [faixasPeso, setFaixasPeso] = useState<FaixaPesoDose[]>([]);
  // Preferência do médico, guardada no aparelho: com ela marcada, dose fora da faixa só gera aviso
  const [ultrapassarFaixa, setUltrapassarFaixaEstado] = useState<boolean>(() => {
    try {
      return localStorage.getItem(CHAVE_ULTRAPASSAR) === '1';
    } catch {
      return false;
    }
  });
  const setUltrapassarFaixa = (valor: boolean) => {
    setUltrapassarFaixaEstado(valor);
    try {
      localStorage.setItem(CHAVE_ULTRAPASSAR, valor ? '1' : '0');
    } catch {
      // sem armazenamento: vale só nesta sessão
    }
  };
  const [resultado, setResultado] = useState<ResultadoDosePediatrica | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [adicionadoPrescricao, setAdicionadoPrescricao] = useState(false);

  // Auto-preenche peso do paciente ativo se disponível
  useEffect(() => {
    const pac = obterPacienteAtivo();
    if (pac?.peso_kg && peso === null) {
      setPeso(pac.peso_kg);
    }
  }, []);

  // Comprimidos por tomada; só é prescrito assim quando dá inteiro ou meio comprimido
  const unidadesPorTomada = resultado && formaSolida && mgPorUnidade ? resultado.dose_por_tomada_mg / mgPorUnidade : null;
  const fracaoPratica =
    unidadesPorTomada !== null && unidadesPorTomada >= 0.5 && Math.abs(unidadesPorTomada * 2 - Math.round(unidadesPorTomada * 2)) < 0.05;
  const unidadeSolida = solida?.unidade ?? 'comprimido';

  const quantidadePorTomada = (r: ResultadoDosePediatrica) => {
    const volume = r.volume_ml_por_tomada;
    if (volume !== null) return formulacaoEmGotas ? `${r.numero_gotas_por_tomada} gotas (${volume.toFixed(1)} mL)` : `${volume.toFixed(1)} mL`;
    if (fracaoPratica && unidadesPorTomada !== null) {
      const n = Math.round(unidadesPorTomada * 2) / 2;
      return `${formatar(n).replace('.', ',')} ${unidadeSolida}${n > 1 ? 's' : ''} (${formatar(r.dose_por_tomada_mg)} mg)`;
    }
    return `${formatar(r.dose_por_tomada_mg)} mg`;
  };
  const apresentacaoTexto = formaSolida
    ? mgPorUnidade !== null
      ? ` ${formatar(mgPorUnidade)} mg ${unidadeSolida}`
      : ''
    : concentracao !== null
      ? ` ${formatar(concentracao)} mg/mL`
      : '';

  const adicionarReceitaPediatrica = () => {
    if (!resultado) return;
    const quantidade = quantidadePorTomada(resultado);
    const posologia = `Dar ${quantidade} por via oral ${doseUnica ? 'em dose única' : `a cada ${resultado.intervalo_horas} horas`}.\n(Dose por tomada: ${resultado.dose_por_tomada_mg.toFixed(1)} mg | Peso: ${resultado.peso_kg} kg | Teto de segurança diário: ${resultado.dose_teto_aplicada_mg_dia.toFixed(1)} mg)`;

    adicionarItemPrescricaoModular(
      'medicamento',
      `${nome || 'Medicamento Pediátrico'}${apresentacaoTexto}`,
      posologia,
      {
        id: `ped_${Date.now()}`,
        nome_medicamento: nome || 'Medicamento Pediátrico',
        principio_ativo: (nome || 'FÁRMACO').toUpperCase(),
        apresentacao: apresentacaoTexto ? `${apresentacaoTexto.trim()}${formaSolida ? '' : ' Suspensão/Gotas'}` : 'Uso Oral',
        posologia,
        quantidade_embalagens: 1,
        tipo_receituario: 'simples',
        preco_pmc: 20.0,
      },
      referenciaDose || 'Calculadora Pediátrica OpenClinical',
      ['Pediatria', 'Dose por Peso']
    );
    setAdicionadoPrescricao(true);
    setTimeout(() => setAdicionadoPrescricao(false), 2200);
  };
  const [erroCalculo, setErroCalculo] = useState<string | null>(null);

  // Seletor de medicamento (Formulário Terapêutico Nacional)
  const [monografias, setMonografias] = useState<MonografiaFtn[]>([]);
  const [termo, setTermo] = useState('');
  const [selecionada, setSelecionada] = useState<MonografiaFtn | null>(null);
  const [esquemaAtivo, setEsquemaAtivo] = useState<EsquemaAdministracaoFtn | null>(null);

  const sugestoes = useMemo(() => {
    if (!termo.trim()) return [];
    const encontradas = filtrarMonografias(monografias, termo);
    // Fármacos com esquema pediátrico primeiro
    return [...encontradas]
      .sort((a, b) => Number(esquemasPediatricos(b).length > 0) - Number(esquemasPediatricos(a).length > 0))
      .slice(0, 8);
  }, [monografias, termo]);

  const esquemas = useMemo(() => (selecionada ? esquemasPediatricos(selecionada) : []), [selecionada]);
  // Apresentações comerciais líquidas de uso oral (CMED), além das do SUS (RENAME) e do FTN
  const [comerciais, setComerciais] = useState<ApresentacaoComercialLiquida[]>([]);
  useEffect(() => {
    let cancelado = false;
    setComerciais([]);
    if (!selecionada) return;
    apresentacoesComerciaisDoFarmaco(selecionada)
      .then((lista) => {
        if (cancelado) return;
        const liquidasOrais = lista.filter(
          (item) =>
            viaApresentacaoCmed(item.apresentacao) === 'oral' &&
            (mgPorMlPrimeiroComponente(item.apresentacao) ?? mgPorMl(item.apresentacao)) !== null
        );
        setComerciais(liquidasOrais.map((item) => ({ nome_produto: item.nome_produto, apresentacao: item.apresentacao })));
      })
      .catch(() => !cancelado && setComerciais([]));
    return () => {
      cancelado = true;
    };
  }, [selecionada]);
  const formulacoes = useMemo<FormulacaoDisponivel[]>(
    () => (selecionada ? formulacoesLiquidas(selecionada, comerciais) : []),
    [selecionada, comerciais]
  );
  const formulacoesSolidasDisponiveis = useMemo<FormulacaoSolida[]>(
    () => (selecionada ? formulacoesSolidas(selecionada) : []),
    [selecionada]
  );
  const componenteDose = formulacoes[0]?.componente ?? (selecionada?.nome.includes('+') ? selecionada.nome.split('+')[0].trim() : null);

  const legivel = (esquema: EsquemaAdministracaoFtn) => lerFaixaDoEsquema(esquema) !== null || faixasDePeso(esquema).length > 0;

  const aplicarEsquema = (esquema: EsquemaAdministracaoFtn, monografia: MonografiaFtn | null = selecionada) => {
    setEsquemaAtivo(esquema);
    setReferencia(
      `${esquema.populacao}${esquema.indicacao ? ` · ${esquema.indicacao}` : ''}: ${esquema.texto}` +
        (monografia ? ` (FTN 2010, p. ${monografia.pagina})` : '')
    );
    // Tabela por faixa de peso (ex.: dipirona): dose fixa em mg por tomada, relida a cada mudança de peso
    const tabela = faixasDePeso(esquema);
    setFaixasPeso(tabela);
    if (tabela.length > 0) {
      setModo('tomada');
      setFracionamento(esquema.fracionamento_diario ?? fracionamentoSugerido(esquema.texto));
      setTetoMaximo(esquema.dose_maxima_diaria_mg);
      setDoseUnica(false);
      return;
    }
    const lido = lerFaixaDoEsquema(esquema);
    setFaixa(lido ? { min: lido.limiteMin, max: lido.limiteMax, modo: lido.modo } : null);
    setDose(lido ? lido.doseMin : null);
    setModo(lido ? lido.modo : null);
    // Intervalo em faixa no texto ("a cada 4 a 6 horas"): já vem marcado o mais longo
    setFracionamento(lido ? (lido.fracionamento ?? (lido.doseUnica ? 1 : fracionamentoSugerido(esquema.texto))) : null);
    setTetoMaximo(lido ? lido.tetoDiarioMg : null);
    setDoseUnica(lido?.doseUnica ?? false);
  };

  const escolherLiquida = (f: FormulacaoDisponivel | null) => {
    setFormaSolida(false);
    setConcentracao(f?.mgPorMl ?? null);
    setFormulacaoEmGotas(f?.gotas ?? false);
  };

  const escolherSolida = (f: FormulacaoSolida | null) => {
    setFormaSolida(true);
    setSolida(f);
    setFormulacaoEmGotas(false);
  };

  // Uma lista só: apresentações padrão (SUS/FTN, líquidas e sólidas) primeiro; marcas da CMED no fim
  const padraoLiquidas = formulacoes.filter((f) => f.origem !== 'comercial');
  const comerciaisLiquidas = formulacoes.filter((f) => f.origem === 'comercial');
  const valorApresentacao = formaSolida
    ? solida
      ? `s:${formulacoesSolidasDisponiveis.indexOf(solida)}`
      : 'mg'
    : formulacoes.some((f) => f.mgPorMl === concentracao)
      ? `l:${concentracao}`
      : 'outra';
  const concentracaoDigitada = valorApresentacao === 'outra';

  const escolherApresentacao = (valor: string) => {
    if (valor === 'mg') escolherSolida(null);
    else if (valor === 'outra') escolherLiquida(null);
    else if (valor.startsWith('s:')) escolherSolida(formulacoesSolidasDisponiveis[Number(valor.slice(2))] ?? null);
    else escolherLiquida(formulacoes.find((f) => `l:${f.mgPorMl}` === valor) ?? null);
  };

  const escolherMonografia = (monografia: MonografiaFtn) => {
    setSelecionada(monografia);
    setNome(capitalizar(monografia.nome));
    setTermo('');
    const liquidas = formulacoesLiquidas(monografia);
    const solidas = formulacoesSolidas(monografia);
    // Líquida primeiro (é o que se prescreve para criança); comprimido só se o fármaco não tiver forma líquida oral
    if (liquidas.length > 0 || solidas.length === 0) escolherLiquida(liquidas[0] ?? null);
    else escolherSolida(solidas[0]);
    const primeiro = esquemasPediatricos(monografia).find(legivel) ?? null;
    if (primeiro) aplicarEsquema(primeiro, monografia);
    else {
      setEsquemaAtivo(null);
      setReferencia(undefined);
      setFaixa(null);
      setFaixasPeso([]);
      setDose(null);
      setModo(null);
      setFracionamento(null);
      setTetoMaximo(null);
    }
  };

  const limparMedicamento = () => {
    setSelecionada(null);
    setEsquemaAtivo(null);
    setNome('');
    setReferencia(undefined);
    setFaixa(null);
    setFaixasPeso([]);
    setSolida(null);
  };

  // Tabela por peso: a linha do peso atual define a dose (em mg/kg por tomada, para o motor de cálculo)
  const linhaTabela = faixasPeso.length > 0 && peso !== null ? faixaDoPeso(faixasPeso, peso) : null;
  useEffect(() => {
    if (faixasPeso.length === 0) return;
    if (!linhaTabela || peso === null) {
      setFaixa(null);
      setDose(null);
      return;
    }
    const doseMgKg = Math.round((linhaTabela.doseMg / peso) * 1e4) / 1e4;
    setFaixa({ min: doseMgKg, max: doseMgKg, modo: 'tomada' });
    // A dose da tabela acompanha o peso; com a preferência de ultrapassar, o médico ainda pode editá-la
    setDose(doseMgKg);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faixasPeso, linhaTabela, peso]);

  const foraDaFaixa =
    faixa !== null && dose !== null && (dose < faixa.min - EPSILON_FAIXA || dose > faixa.max + EPSILON_FAIXA);
  // Fora da faixa só calcula com a caixa marcada pelo médico
  const bloqueadoPelaFaixa = foraDaFaixa && !ultrapassarFaixa;
  const unidadeModo = modo === 'tomada' ? 'por tomada' : 'por dia';

  useEffect(() => {
    carregarFormulario()
      .then(({ MONOGRAFIAS_FTN }) => {
        setMonografias(MONOGRAFIAS_FTN);
        // Aberta a partir de uma monografia: seleciona o fármaco e relê o esquema escolhido lá
        const alvo = MONOGRAFIAS_FTN.find((m) => m.id_monografia === idMonografiaInicial);
        if (!alvo) return;
        setSelecionada(alvo);
        const esquema = esquemasPediatricos(alvo).find((e) => referenciaDose?.endsWith(e.texto));
        if (esquema) aplicarEsquema(esquema, alvo);
        if (concentracaoInicial === null) {
          const liquida = formulacoesLiquidas(alvo)[0];
          const solidaInicial = formulacoesSolidas(alvo)[0];
          if (liquida || !solidaInicial) escolherLiquida(liquida ?? null);
          else escolherSolida(solidaInicial);
        }
      })
      .catch(() => setMonografias([]));
    // Só na montagem: a App recria o componente (key) quando a origem muda
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // mg/kg/dia enviado ao motor: dose por tomada × tomadas quando a fonte é por tomada
  const doseDiaria = dose !== null && fracionamento !== null && modo !== null ? (modo === 'tomada' ? dose * fracionamento : dose) : null;

  useEffect(() => {
    setErroCalculo(null);
    const concentracaoCalculo = formaSolida ? null : concentracao;
    if (peso === null || doseDiaria === null || fracionamento === null || bloqueadoPelaFaixa || (!formaSolida && concentracao === null)) {
      setResultado(null);
      return;
    }
    executarCalculoClinico<ResultadoDosePediatrica>('dose_pediatrica', {
      peso_kg: peso,
      dose_alvo_mg_kg_dia: doseDiaria,
      concentracao_mg_ml: concentracaoCalculo,
      fracionamento_diario: fracionamento,
      // Com a faixa ultrapassada por decisão do médico, o teto também deixa de cortar a dose (o alerta continua)
      dose_maxima_diaria_mg: ultrapassarFaixa ? null : tetoMaximo,
    })
      .then(setResultado)
      .catch((e) => {
        setResultado(null);
        setErroCalculo(e instanceof Error ? e.message : String(e));
      });
  }, [peso, doseDiaria, concentracao, formaSolida, fracionamento, tetoMaximo, bloqueadoPelaFaixa, ultrapassarFaixa]);

  const pendencias = [
    dose === null && (faixasPeso.length > 0 && !linhaTabela ? 'a dose em mg/kg (o peso está fora da tabela do FTN)' : 'a dose em mg/kg'),
    modo === null && 'se a dose é por dia ou por tomada',
    fracionamento === null && 'o intervalo entre as tomadas',
    peso === null && 'o peso',
    !formaSolida && concentracao === null && 'a concentração da formulação líquida (mg/mL)',
  ].filter(Boolean) as string[];

  const tetoExcedidoAoUltrapassar =
    ultrapassarFaixa && tetoMaximo !== null && resultado !== null && resultado.dose_total_calculada_mg_dia > tetoMaximo;

  const copiarReceitaPediatrica = () => {
    if (!resultado) return;
    const quantidade = quantidadePorTomada(resultado);
    const texto = `${nome || 'Medicamento'}${apresentacaoTexto ? ` -${apresentacaoTexto}` : ''}
Dar ${quantidade} ${doseUnica ? 'em dose única' : `a cada ${resultado.intervalo_horas} horas`}.
(Dose por tomada: ${resultado.dose_por_tomada_mg.toFixed(1)} mg | Peso: ${resultado.peso_kg} kg${doseUnica ? '' : ` | Dose diária: ${resultado.dose_teto_aplicada_mg_dia.toFixed(1)} mg`})`;

    navigator.clipboard
      .writeText(texto)
      .then(() => {
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
      })
      .catch(() => window.alert('Não foi possível acessar a área de transferência. Selecione o texto e copie manualmente.'));
  };

  const classeCampo =
    'w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm focus:border-teal-500 focus:outline-none';
  const classeBotao = (ativo: boolean) =>
    `py-2 px-1 text-center text-xs rounded-xl border transition-all ${
      ativo
        ? 'bg-teal-600/90 border-teal-500 text-white font-bold shadow-md shadow-teal-900/40'
        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
    }`;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
        <div className="p-2.5 bg-teal-500/10 text-teal-400 rounded-xl">
          <Baby className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-100">Calculadora de Dose Pediátrica</h3>
          <p className="text-xs text-slate-400">
            Qualquer medicamento: dose por peso, volume por tomada (formulações líquidas) e teto diário de segurança
          </p>
        </div>
      </div>

      {/* Medicamento */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-300">Medicamento</label>
        {nome ? (
          <div className="flex items-center justify-between gap-2 bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2">
            <span className="text-sm font-semibold text-slate-100">{nome}</span>
            <button
              type="button"
              onClick={limparMedicamento}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" /> Trocar
            </button>
          </div>
        ) : (
          <div className="relative">
            <Search className="w-4 h-4 text-teal-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={termo}
              onChange={(e) => setTermo(e.target.value)}
              placeholder="Buscar no Formulário Terapêutico Nacional (ex.: paracetamol, ibuprofeno, azitromicina)"
              className={`${classeCampo} pl-9 font-sans`}
            />
            {sugestoes.length > 0 && (
              <ul className="absolute z-20 mt-1 w-full bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
                {sugestoes.map((m) => {
                  const pediatricos = esquemasPediatricos(m).length;
                  return (
                    <li key={m.id_monografia}>
                      <button
                        type="button"
                        onClick={() => escolherMonografia(m)}
                        className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center justify-between gap-2"
                      >
                        <span className="text-xs text-slate-100">{capitalizar(m.nome)}</span>
                        <span className="flex items-center gap-2">
                          <span
                            className={`text-[9px] px-1.5 py-px rounded border font-semibold ${
                              m.rename_2024.length > 0
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-700/60'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}
                          >
                            {m.rename_2024.length > 0 ? 'SUS' : 'Fora do SUS'}
                          </span>
                          <span className={`text-[10px] font-mono ${pediatricos ? 'text-teal-300' : 'text-slate-500'}`}>
                            {pediatricos ? `${pediatricos} esquema(s) pediátrico(s)` : 'sem esquema pediátrico'}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
            <p className="text-[11px] text-slate-500 mt-1">
              Ou preencha os campos abaixo manualmente para um medicamento fora do FTN.
            </p>
          </div>
        )}

        {selecionada && esquemas.length === 0 && (
          <p className="text-[11px] text-amber-300/90">
            O FTN não traz esquema pediátrico para este fármaco: informe a dose conforme a bula ou o protocolo.
          </p>
        )}
        {esquemas.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[11px] text-slate-400">Esquemas pediátricos do FTN (clique para usar):</span>
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {esquemas.map((esquema, i) => {
                const lido = legivel(esquema);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => aplicarEsquema(esquema)}
                    className={`w-full text-left text-[11px] leading-snug px-3 py-2 rounded-lg border transition-colors ${
                      esquemaAtivo === esquema
                        ? 'bg-teal-950/70 border-teal-500 text-slate-100'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <span className="text-teal-300 font-semibold">
                      {esquema.populacao}
                      {esquema.indicacao ? ` · ${esquema.indicacao}` : ''}:
                    </span>{' '}
                    {esquema.texto}
                    {!lido && <span className="block text-slate-500 mt-0.5">Dose não estruturada: preencha manualmente.</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {referencia && (
        <div className="bg-slate-950/60 border border-slate-700 rounded-xl p-3 text-xs text-slate-300">
          <span className="font-semibold text-teal-300">Posologia de referência: </span>
          {referencia}
          {faixasPeso.length === 0 && faixa && faixa.max > faixa.min && (
            <span className="block mt-1 text-[11px] text-slate-400">
              A dose começa no menor valor da faixa: ajuste conforme a gravidade e a indicação.
            </span>
          )}
        </div>
      )}

      {/* Faixa recomendada já convertida para o peso: muda junto com o peso */}
      {(faixa || faixasPeso.length > 0) && (
        <div className="bg-teal-950/40 border border-teal-700/60 rounded-xl p-3 text-xs text-slate-200 space-y-1">
          {faixasPeso.length > 0 ? (
            linhaTabela ? (
              <p>
                <span className="font-semibold text-teal-300">Dose do FTN para {peso} kg: </span>
                {formatar(linhaTabela.doseMg)} mg por tomada (faixa de {formatar(linhaTabela.pesoMin)} a{' '}
                {formatar(linhaTabela.pesoMax)} kg da tabela)
              </p>
            ) : (
              <p className="text-amber-300">
                O peso informado está fora da tabela do FTN ({formatar(faixasPeso[0].pesoMin)} a{' '}
                {formatar(faixasPeso[faixasPeso.length - 1].pesoMax)} kg): informe a dose manualmente.
              </p>
            )
          ) : (
            faixa && (
              <p>
                <span className="font-semibold text-teal-300">Faixa recomendada: </span>
                {faixa.max > faixa.min ? `${formatar(faixa.min)} a ${formatar(faixa.max)}` : formatar(faixa.min)} mg/kg{' '}
                {modo ? unidadeModo : ''}
                {peso !== null && (
                  <>
                    {' '}
                    → para {peso} kg:{' '}
                    <strong>
                      {faixa.max > faixa.min
                        ? `${formatar(faixa.min * peso)} a ${formatar(faixa.max * peso)}`
                        : formatar(faixa.min * peso)}{' '}
                      mg {modo ? unidadeModo : ''}
                    </strong>
                  </>
                )}
              </p>
            )
          )}
          {esquemaAtivo && faixasPeso.length > 0 && esquemaParenteral(esquemaAtivo) && (
            <p className="text-amber-300/90 text-[11px]">
              A tabela do FTN é para via intramuscular ou intravenosa. Para via oral, confira a dose na bula do produto.
            </p>
          )}
          {tetoMaximo !== null && (
            <p className="text-[11px] text-slate-400">Teto diário do esquema: {formatar(tetoMaximo)} mg/dia.</p>
          )}
        </div>
      )}

      {/* Grid de Entradas Clínicas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Peso da Criança (kg)</label>
          <div className="relative">
            <input
              type="number"
              step="0.5"
              min="1"
              max="150"
              value={peso ?? ''}
              onChange={(e) => setPeso(lerNumero(e.target.value))}
              className={classeCampo}
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">kg</span>
          </div>
          <div className="flex gap-1.5 mt-2">
            {[8, 12, 16, 20, 28].map((kg) => (
              <button
                key={kg}
                type="button"
                onClick={() => setPeso(kg)}
                className={`text-[11px] px-2 py-0.5 rounded border transition-colors ${
                  peso === kg ? 'bg-teal-600 border-teal-500 text-white font-medium' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                {kg}kg
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Dose (mg/kg)</label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              value={dose ?? ''}
              onChange={(e) => setDose(lerNumero(e.target.value))}
              className={classeCampo}
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">
              {modo === 'tomada' ? 'mg/kg/dose' : 'mg/kg/dia'}
            </span>
          </div>
          {faixa && faixa.max > faixa.min && (
            <input
              type="range"
              aria-label="Dose dentro da faixa recomendada"
              min={faixa.min}
              max={faixa.max}
              step={(faixa.max - faixa.min) / 100}
              value={dose === null ? faixa.min : Math.min(Math.max(dose, faixa.min), faixa.max)}
              onChange={(e) => setDose(Math.round(parseFloat(e.target.value) * 100) / 100)}
              className="w-full mt-2 accent-teal-500"
            />
          )}
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            <button
              type="button"
              onClick={() => setModo('dia')}
              disabled={faixa?.modo != null && !ultrapassarFaixa}
              className={classeBotao(modo === 'dia')}
            >
              por dia
            </button>
            <button
              type="button"
              onClick={() => setModo('tomada')}
              disabled={faixa?.modo != null && !ultrapassarFaixa}
              className={classeBotao(modo === 'tomada')}
            >
              por tomada
            </button>
          </div>
          {/* Sempre visível: mesmo sem faixa no esquema a preferência fica salva para os próximos medicamentos */}
          <label className="flex items-start gap-2 mt-2 text-[11px] text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={ultrapassarFaixa}
              onChange={(e) => {
                setUltrapassarFaixa(e.target.checked);
                // Ao desmarcar, a dose volta para dentro da faixa do esquema
                if (!e.target.checked && faixa) {
                  if (faixa.modo) setModo(faixa.modo);
                  if (dose === null || dose < faixa.min || dose > faixa.max) setDose(dose !== null && dose > faixa.max ? faixa.max : faixa.min);
                }
              }}
              className="accent-amber-500 mt-0.5"
            />
            Permitir ultrapassar a faixa recomendada (só avisa)
          </label>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Formulação{componenteDose && !formaSolida ? ` (concentração de ${componenteDose})` : ''}
          </label>
          <select
            value={valorApresentacao}
            onChange={(e) => escolherApresentacao(e.target.value)}
            className={`${classeCampo} font-sans text-xs mb-2`}
          >
            {padraoLiquidas.map((f) => (
              <option key={`l${f.mgPorMl}`} value={`l:${f.mgPorMl}`}>
                {f.origem === 'sus' ? 'SUS · ' : 'FTN · '}
                {f.rotulo} ({formatar(f.mgPorMl)} mg/mL{f.componente ? ` de ${f.componente}` : ''})
              </option>
            ))}
            {formulacoesSolidasDisponiveis.map((f, i) => (
              <option key={`s${i}`} value={`s:${i}`}>
                {f.origem === 'sus' ? 'SUS · ' : 'FTN · '}
                {f.rotulo}
              </option>
            ))}
            {comerciaisLiquidas.length > 0 && (
              <optgroup label="Outras marcas (CMED)">
                {comerciaisLiquidas.map((f) => (
                  <option key={`l${f.mgPorMl}`} value={`l:${f.mgPorMl}`}>
                    {f.rotulo} ({formatar(f.mgPorMl)} mg/mL{f.componente ? ` de ${f.componente}` : ''})
                  </option>
                ))}
              </optgroup>
            )}
            <option value="outra">Outra concentração líquida (digitar)</option>
            <option value="mg">Comprimido/cápsula: resultado só em mg</option>
          </select>
          {concentracaoDigitada && (
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={concentracao ?? ''}
                placeholder="concentração"
                onChange={(e) => setConcentracao(lerNumero(e.target.value))}
                className={classeCampo}
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">mg/mL</span>
            </div>
          )}
          {!formaSolida && (
            <label className="flex items-center gap-2 mt-2 text-[11px] text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formulacaoEmGotas}
                onChange={(e) => setFormulacaoEmGotas(e.target.checked)}
                className="accent-teal-500"
                disabled={concentracao === null}
              />
              Solução em gotas (20 gotas/mL)
            </label>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Intervalo entre as tomadas</label>
          <div className="grid grid-cols-5 gap-2">
            {OPCOES_FRACIONAMENTO.map((f) => (
              <button
                key={f.tomadas}
                type="button"
                onClick={() => {
                  setFracionamento(f.tomadas);
                  setDoseUnica(false);
                }}
                className={classeBotao(fracionamento === f.tomadas && !doseUnica)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Teto Diário de Segurança (mg/dia)</label>
          <div className="relative">
            <input
              type="number"
              value={tetoMaximo ?? ''}
              onChange={(e) => setTetoMaximo(lerNumero(e.target.value))}
              placeholder="Opcional (ex: 3000 mg)"
              className={classeCampo}
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">mg/dia</span>
          </div>
        </div>
      </div>

      {pendencias.length > 0 && (
        <div role="status" className="bg-sky-950/50 border border-sky-700/60 rounded-xl p-3 text-xs text-sky-200">
          Para calcular, informe {pendencias.join(', ')}.
        </div>
      )}

      {bloqueadoPelaFaixa && faixa && (
        <div role="alert" className="bg-red-950/50 border border-red-600/60 rounded-xl p-3 text-xs text-red-200">
          A dose de {formatar(dose ?? 0)} mg/kg está fora da faixa recomendada (
          {faixa.max > faixa.min ? `${formatar(faixa.min)} a ${formatar(faixa.max)}` : formatar(faixa.min)} mg/kg
          {faixa.modo ? ` ${unidadeModo}` : ''}). Ajuste a dose ou marque "Permitir ultrapassar a faixa recomendada".
        </div>
      )}

      {ultrapassarFaixa && (foraDaFaixa || tetoExcedidoAoUltrapassar) && (
        <div className="bg-amber-950/60 border border-amber-600/60 rounded-xl p-3 flex items-start gap-2 text-xs text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <span>
            <strong className="text-amber-300">
              {foraDaFaixa && faixa && dose !== null && dose < faixa.min ? 'Abaixo' : 'Acima'} do recomendado pelo FTN.
            </strong>
            {foraDaFaixa && faixa && (
              <>
                {' '}
                A faixa é de {faixa.max > faixa.min ? `${formatar(faixa.min)} a ${formatar(faixa.max)}` : formatar(faixa.min)} mg/kg
                {faixa.modo ? ` ${unidadeModo}` : ''}
                {peso !== null ? ` (até ${formatar(faixa.max * peso)} mg para ${peso} kg)` : ''}, e a dose digitada é de{' '}
                {formatar(dose ?? 0)} mg/kg.
              </>
            )}
            {tetoExcedidoAoUltrapassar && tetoMaximo !== null && ` A dose diária passa do teto de ${formatar(tetoMaximo)} mg/dia.`}
          </span>
        </div>
      )}

      {erroCalculo && (
        <div className="bg-red-950/50 border border-red-600/60 rounded-xl p-4 text-xs text-red-200">
          <p className="font-bold text-red-300">Cálculo não realizado</p>
          <p className="mt-0.5">{erroCalculo}</p>
        </div>
      )}

      {/* Alerta de Segurança se o Teto for Ultrapassado */}
      {resultado?.alerta_teto_ultrapassado && (
        <div className="bg-amber-950/60 border border-amber-600/60 rounded-xl p-4 flex items-start space-x-3 text-amber-200 animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-amber-300">Teto Máximo de Segurança Diário Excedido!</p>
            <p>{resultado.justificativa_seguranca}</p>
          </div>
        </div>
      )}

      {/* Painel de Resultados Formatados */}
      {resultado && (
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {resultado.volume_ml_por_tomada !== null && (
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase font-medium">Volume p/ Tomada</span>
                <div className="text-2xl font-extrabold text-teal-400 mt-1">
                  {resultado.volume_ml_por_tomada.toFixed(1)} <span className="text-sm text-slate-400">mL</span>
                </div>
              </div>
            )}

            {formulacaoEmGotas && resultado.numero_gotas_por_tomada !== null && (
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase font-medium">Gotas p/ Tomada</span>
                <div className="text-2xl font-extrabold text-sky-400 mt-1">
                  {resultado.numero_gotas_por_tomada} <span className="text-sm text-slate-400">gotas</span>
                </div>
              </div>
            )}

            {unidadesPorTomada !== null && fracaoPratica && (
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase font-medium">{unidadeSolida}s p/ Tomada</span>
                <div className="text-2xl font-extrabold text-teal-400 mt-1">
                  {formatar(Math.round(unidadesPorTomada * 2) / 2).replace('.', ',')}{' '}
                  <span className="text-sm text-slate-400">de {formatar(mgPorUnidade ?? 0)} mg</span>
                </div>
              </div>
            )}

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase font-medium">Dose p/ Tomada</span>
              <div className="text-2xl font-extrabold text-slate-100 mt-1">
                {resultado.dose_por_tomada_mg.toFixed(1)} <span className="text-sm text-slate-400">mg</span>
              </div>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase font-medium">Intervalo</span>
              <div className="text-2xl font-extrabold text-indigo-400 mt-1">
                {doseUnica ? (
                  <span className="text-lg">dose única</span>
                ) : (
                  <>
                    {resultado.intervalo_horas} <span className="text-sm text-slate-400">horas</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {unidadesPorTomada !== null && !fracaoPratica && (
            <p className="text-[11px] text-amber-300/90">
              {formatar(resultado.dose_por_tomada_mg)} mg equivalem a {formatar(unidadesPorTomada).replace('.', ',')}{' '}
              {unidadeSolida} de {formatar(mgPorUnidade ?? 0)} mg, que não dá para fracionar com segurança: prefira a forma
              líquida.
            </p>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800">
            <div className="text-xs text-slate-400 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>
                {doseUnica ? 'Dose total' : 'Dose diária efetiva'}:{' '}
                <strong className="text-slate-200">
                  {resultado.dose_teto_aplicada_mg_dia.toFixed(1)} {doseUnica ? 'mg' : 'mg/dia'}
                </strong>
                {modo === 'tomada' && doseDiaria !== null && !doseUnica && (
                  <span className="text-slate-500"> ({formatar(doseDiaria)} mg/kg/dia)</span>
                )}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {permitirAdicionarReceita && (
                <button
                  onClick={adicionarReceitaPediatrica}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-teal-900/30"
                >
                  <Plus className="w-4 h-4 text-white" />
                  <span>{adicionadoPrescricao ? 'Adicionado à Receita ✓' : 'Adicionar à Receita'}</span>
                </button>
              )}
              <button
                onClick={copiarReceitaPediatrica}
                className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-all border border-slate-700"
              >
                {copiado ? <Check className="w-4 h-4 text-teal-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiado ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
