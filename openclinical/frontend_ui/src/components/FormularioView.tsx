import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Store, Baby, BookMarked, Check, ClipboardCopy, Copy, FileText, Search, ShieldAlert, Stethoscope, Pill, Info } from 'lucide-react';
import type { EsquemaAdministracaoFtn, MonografiaFtn } from '../data/formulario_terapeutico';
import {
  apresentacoesDisponiveis,
  capitalizar,
  carregarFormulario,
  componentesSus,
  filtrarMonografias,
  montarReceita,
} from '../formulario_utils';
import { MarkdownSimples } from './MarkdownSimples';
import { ApresentacoesComerciaisFtn } from './ApresentacoesComerciaisFtn';
import { esquemasPediatricos, interpretarEsquemaPediatrico } from '../pediatria_ftn';
import { LinkMedicamento } from './LinkMedicamento';

interface FormularioViewProps {
  /** Monografia aberta pela busca global (id_monografia); `versao` muda a cada clique */
  selecao?: { id: number; versao: number } | null;
  onAbrirCalculadoraPediatrica: (
    nome: string,
    doseMin: number | undefined,
    conc: number | null,
    teto: number | null,
    fracionamento?: number,
    referencia?: string,
    idMonografia?: number
  ) => void;
  /** Abre a apresentação CMED (registro, bula oficial, preço) */
  onAbrirProdutoCmed?: (idCmed: number) => void;
}

/** Esquema pediátrico com dose em mg/kg legível pela calculadora */
const doseCalculavel = (monografia: MonografiaFtn, item: EsquemaAdministracaoFtn) =>
  esquemasPediatricos(monografia).includes(item) ? interpretarEsquemaPediatrico(item) : null;
const temDoseCalculavel = (monografia: MonografiaFtn) =>
  esquemasPediatricos(monografia).some((item) => interpretarEsquemaPediatrico(item) !== null);

type Aba = 'posologia' | 'comerciais' | 'clinica' | 'seguranca' | 'orientacoes';
type FiltroLista = 'todos' | 'pediatricos' | 'rename';

const LIMITE_LISTA = 200;

export const FormularioView: React.FC<FormularioViewProps> = ({ selecao, onAbrirCalculadoraPediatrica, onAbrirProdutoCmed }) => {
  const [monografias, setMonografias] = useState<MonografiaFtn[]>([]);
  const [fonte, setFonte] = useState('');
  const [erroCarga, setErroCarga] = useState<string | null>(null);
  const [termo, setTermo] = useState('');
  const [filtro, setFiltro] = useState<FiltroLista>('todos');
  const [selecionada, setSelecionada] = useState<MonografiaFtn | null>(null);
  const [aba, setAba] = useState<Aba>('posologia');
  const [apresentacao, setApresentacao] = useState('');
  const [esquema, setEsquema] = useState<EsquemaAdministracaoFtn | null>(null);
  const [textoReceita, setTextoReceita] = useState('');
  const [copiado, setCopiado] = useState(false);
  const painelReceitaRef = useRef<HTMLDivElement>(null);
  const painelDetalheRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    carregarFormulario()
      .then((modulo) => {
        setMonografias(modulo.MONOGRAFIAS_FTN);
        setFonte(modulo.FONTE_FTN);
        setSelecionada((atual) => atual ?? modulo.MONOGRAFIAS_FTN.find((m) => m.nome === 'amoxicilina') ?? modulo.MONOGRAFIAS_FTN[0]);
      })
      .catch((e) => setErroCarga(e instanceof Error ? e.message : String(e)));
  }, []);

  useEffect(() => {
    if (!selecao || monografias.length === 0) return;
    const achada = monografias.find((m) => m.id_monografia === selecao.id);
    if (achada) {
      setTermo('');
      setFiltro('todos');
      setSelecionada(achada);
      // Em telas estreitas o detalhe fica abaixo da lista: leva direto à monografia aberta de fora
      if (window.innerWidth < 1024) {
        setTimeout(() => painelDetalheRef.current?.scrollIntoView({ block: 'start' }), 0);
      }
    }
  }, [selecao, monografias]);

  // Ao trocar de fármaco, recomeça a receita com a primeira apresentação e sem esquema escolhido
  useEffect(() => {
    if (!selecionada) return;
    setAba('posologia');
    setApresentacao(apresentacoesDisponiveis(selecionada)[0] ?? capitalizar(selecionada.nome));
    setEsquema(null);
  }, [selecionada]);

  useEffect(() => {
    if (selecionada) setTextoReceita(montarReceita(selecionada, apresentacao, esquema));
  }, [selecionada, apresentacao, esquema]);

  const listaFiltrada = useMemo(() => {
    const porTermo = filtrarMonografias(monografias, termo);
    if (filtro === 'pediatricos') return porTermo.filter(temDoseCalculavel);
    if (filtro === 'rename') return porTermo.filter((m) => m.rename_2024.length > 0);
    return porTermo;
  }, [monografias, termo, filtro]);

  const esquemasPorPopulacao = useMemo(() => {
    const grupos: { populacao: string; esquemas: EsquemaAdministracaoFtn[] }[] = [];
    for (const item of selecionada?.esquemas ?? []) {
      const grupo = grupos.find((g) => g.populacao === item.populacao);
      if (grupo) grupo.esquemas.push(item);
      else grupos.push({ populacao: item.populacao, esquemas: [item] });
    }
    return grupos;
  }, [selecionada]);

  const selecionarMonografia = (m: MonografiaFtn) => {
    setSelecionada(m);
    if (window.innerWidth < 1024) {
      setTimeout(() => painelDetalheRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
    }
  };

  const usarEsquema = (item: EsquemaAdministracaoFtn) => {
    setEsquema(item);
    setTimeout(() => painelReceitaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 0);
  };

  const abrirNaCalculadora = (item: EsquemaAdministracaoFtn) => {
    if (!selecionada) return;
    const lido = doseCalculavel(selecionada, item);
    if (!lido) return;
    // A calculadora relê o esquema e oferece as formulações líquidas do FTN/RENAME
    onAbrirCalculadoraPediatrica(
      capitalizar(selecionada.nome),
      lido.modo === 'dia' ? lido.doseMin : undefined,
      null,
      lido.tetoDiarioMg,
      lido.fracionamento ?? undefined,
      `${item.populacao}${item.indicacao ? ` · ${item.indicacao}` : ''}: ${item.texto}`,
      selecionada.id_monografia
    );
  };

  const copiarReceita = () => {
    navigator.clipboard
      .writeText(textoReceita)
      .then(() => {
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
      })
      .catch(() => window.alert('Não foi possível acessar a área de transferência. Selecione o texto e copie manualmente.'));
  };

  if (erroCarga) {
    return (
      <div role="alert" className="p-4 bg-rose-950/50 border border-rose-700/60 rounded-2xl text-sm text-rose-200">
        Não foi possível carregar o Formulário Terapêutico Nacional: {erroCarga}
      </div>
    );
  }

  if (monografias.length === 0) {
    return <div className="py-16 text-center text-sm text-slate-400">Carregando o Formulário Terapêutico Nacional...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col xl:flex-row gap-4 xl:items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-teal-500/10 text-teal-400 rounded-xl">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex flex-wrap items-center gap-2">
                Formulário Terapêutico Nacional
                <span className="text-[10px] bg-teal-900/60 text-teal-300 border border-teal-700/60 px-2 py-0.5 rounded-full font-mono font-semibold">
                  {monografias.length} medicamentos
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Posologia oficial do Ministério da Saúde para montar a receita: escolha a apresentação e o esquema.
              </p>
            </div>
          </div>
          <div className="relative w-full xl:w-96">
            <Search className="w-4 h-4 text-teal-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={termo}
              onChange={(e) => setTermo(e.target.value)}
              placeholder="Buscar medicamento, apresentação ou indicação..."
              aria-label="Buscar no Formulário Terapêutico"
              className="w-full bg-slate-950 border border-slate-750 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
          {(
            [
              { id: 'todos', label: `Todos (${monografias.length})` },
              { id: 'pediatricos', label: 'Com dose pediátrica em mg/kg' },
              { id: 'rename', label: 'Na RENAME 2024 (SUS)' },
            ] as { id: FiltroLista; label: string }[]
          ).map((opcao) => (
            <button
              key={opcao.id}
              onClick={() => setFiltro(opcao.id)}
              aria-pressed={filtro === opcao.id}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                filtro === opcao.id ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-800/80 border border-slate-750 text-slate-300 hover:bg-slate-750'
              }`}
            >
              {opcao.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Lista */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-xl space-y-1.5 max-h-[420px] lg:max-h-[820px] overflow-y-auto">
          <div className="px-2 pb-2 border-b border-slate-800 text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            {listaFiltrada.length} encontrado(s)
          </div>
          {listaFiltrada.length === 0 && (
            <div className="py-10 text-center text-xs text-slate-400">Nenhum medicamento do FTN corresponde à busca.</div>
          )}
          {listaFiltrada.slice(0, LIMITE_LISTA).map((m) => {
            const ativo = selecionada?.id_monografia === m.id_monografia;
            const temPediatrico = temDoseCalculavel(m);
            return (
              <button
                key={m.id_monografia}
                onClick={() => selecionarMonografia(m)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  ativo
                    ? 'bg-teal-950/60 border-teal-500 ring-1 ring-teal-500/40'
                    : 'bg-slate-850/60 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold text-slate-100 leading-snug">{capitalizar(m.nome)}</div>
                <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{m.apresentacoes.join(' · ')}</div>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {m.rename_2024.length > 0 ? (
                    <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-700/60 px-1.5 py-px rounded font-semibold">
                      SUS · {componentesSus(m)}
                    </span>
                  ) : (
                    <span className="text-[9px] bg-slate-800 text-slate-400 border border-slate-700 px-1.5 py-px rounded font-semibold">
                      Fora do SUS
                    </span>
                  )}
                  {temPediatrico && (
                    <span className="text-[9px] bg-sky-950 text-sky-300 border border-sky-700/60 px-1.5 py-px rounded font-semibold">
                      Pediátrico mg/kg
                    </span>
                  )}
                  {m.tipo_receituario !== 'Receituário simples' && (
                    <span className="text-[9px] bg-amber-950 text-amber-300 border border-amber-700/60 px-1.5 py-px rounded font-semibold">
                      Receita especial
                    </span>
                  )}
                </div>
              </button>
            );
          })}
          {listaFiltrada.length > LIMITE_LISTA && (
            <div className="pt-2 text-center text-[11px] text-slate-400">Refine a busca para ver os demais.</div>
          )}
        </div>

        {/* Detalhe */}
        {selecionada && (
          <div ref={painelDetalheRef} className="lg:col-span-8 space-y-5 scroll-mt-28">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-5 border-b border-slate-800 space-y-3">
                <h2 className="text-xl font-extrabold text-slate-100 leading-tight">{capitalizar(selecionada.nome)}</h2>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  <span
                    className={`px-2 py-0.5 rounded-full border font-semibold ${
                      selecionada.tipo_receituario === 'Receituário simples'
                        ? 'bg-slate-800 text-slate-300 border-slate-700'
                        : 'bg-amber-950 text-amber-300 border-amber-700/60'
                    }`}
                  >
                    {selecionada.tipo_receituario}
                  </span>
                  {selecionada.rename_2024.length > 0 ? (
                    <span
                      title="Princípio ativo na RENAME 2024: as apresentações dispensadas pelo SUS estão na lista de apresentações (RENAME 2024)."
                      className="px-2 py-0.5 rounded-full border bg-emerald-950 text-emerald-300 border-emerald-700/60 font-semibold"
                    >
                      Disponível no SUS (RENAME 2024 · {componentesSus(selecionada)})
                    </span>
                  ) : (
                    <span
                      title="Não consta da RENAME 2024 (lista ambulatorial). Medicamentos de uso hospitalar ou oncológico podem ser fornecidos por outras vias do SUS."
                      className="px-2 py-0.5 rounded-full border bg-slate-800 text-slate-300 border-slate-700"
                    >
                      Fora do SUS ambulatorial (não está na RENAME 2024)
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-full border bg-slate-800 text-slate-400 border-slate-700 font-mono">
                    FTN 2010 · p. {selecionada.pagina}
                  </span>
                </div>
                <div className="text-xs text-slate-300">
                  <span className="font-semibold text-slate-400">Apresentações: </span>
                  {selecionada.apresentacoes.join(' · ') || 'não informadas no FTN'}
                </div>
              </div>

              {/* Abas */}
              <div className="flex border-b border-slate-800 px-3 overflow-x-auto scrollbar-none">
                {(
                  [
                    { id: 'posologia', label: 'Posologia & Receita', icone: Stethoscope },
                    { id: 'comerciais', label: 'Apresentações comerciais', icone: Store },
                    { id: 'clinica', label: 'Indicações & Contraindicações', icone: FileText },
                    { id: 'seguranca', label: 'Efeitos adversos & Interações', icone: ShieldAlert },
                    { id: 'orientacoes', label: 'Orientações & Farmacêutica', icone: Info },
                  ] as { id: Aba; label: string; icone: React.ComponentType<{ className?: string }> }[]
                ).map((item) => {
                  const Icone = item.icone;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setAba(item.id)}
                      className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                        aba === item.id ? 'border-teal-500 text-teal-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icone className="w-4 h-4" />
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <div className="p-5 space-y-5">
                {aba === 'posologia' && (
                  <>
                    {esquemasPorPopulacao.length === 0 && (
                      <p className="text-xs text-slate-400">
                        O FTN não traz esquema de administração estruturado para este item. Consulte a monografia completa
                        (p. {selecionada.pagina}).
                      </p>
                    )}
                    {esquemasPorPopulacao.map((grupo) => (
                      <div key={grupo.populacao} className="space-y-2">
                        <h3 className="text-xs font-bold text-teal-300 uppercase tracking-wider">{grupo.populacao}</h3>
                        {grupo.esquemas.map((item, indice) => {
                          const ativo = esquema === item;
                          return (
                            <div
                              key={indice}
                              className={`p-3 rounded-xl border text-xs space-y-2 ${
                                ativo ? 'bg-teal-950/50 border-teal-600/70' : 'bg-slate-950/60 border-slate-800'
                              }`}
                            >
                              {item.indicacao && <div className="font-semibold text-slate-200">{item.indicacao}</div>}
                              <p className="text-slate-300 leading-relaxed">{item.texto}</p>
                              <div className="flex flex-wrap gap-2">
                                <button
                                  onClick={() => usarEsquema(item)}
                                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-600/90 hover:bg-teal-500 text-white font-semibold"
                                >
                                  <ClipboardCopy className="w-3.5 h-3.5" />
                                  {ativo ? 'Na receita' : 'Usar na receita'}
                                </button>
                                {(() => {
                                  const lido = doseCalculavel(selecionada, item);
                                  if (!lido) return null;
                                  const faixa = lido.doseMax !== lido.doseMin ? `${lido.doseMin}–${lido.doseMax}` : `${lido.doseMin}`;
                                  const unidade = lido.modo === 'tomada' ? 'mg/kg/dose' : lido.modo === 'dia' ? 'mg/kg/dia' : 'mg/kg';
                                  return (
                                    <button
                                      onClick={() => abrirNaCalculadora(item)}
                                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-700/80 hover:bg-sky-600 text-white font-semibold"
                                    >
                                      <Baby className="w-3.5 h-3.5" />
                                      Calcular dose ({faixa} {unidade})
                                    </button>
                                  );
                                })()}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </>
                )}

                {aba === 'comerciais' && (
                  <ApresentacoesComerciaisFtn monografia={selecionada} onAbrirProduto={onAbrirProdutoCmed} />
                )}

                {aba === 'clinica' && (
                  <div className="space-y-5">
                    <Secao titulo="Indicações" conteudo={selecionada.indicacoes} />
                    <Secao titulo="Contraindicações" conteudo={selecionada.contraindicacoes} />
                    <Secao titulo="Precauções" conteudo={selecionada.precaucoes} />
                  </div>
                )}

                {aba === 'seguranca' && (
                  <div className="space-y-5">
                    <Secao titulo="Efeitos adversos" conteudo={selecionada.efeitos_adversos} />
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                        Interações de medicamentos ({selecionada.interacoes.length})
                      </h3>
                      {selecionada.interacoes.length === 0 && <p className="text-xs text-slate-400">Nenhuma descrita no FTN.</p>}
                      {selecionada.interacoes.map((item, indice) => (
                        <div key={indice} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs">
                          <span className="font-semibold text-amber-300">
                            <LinkMedicamento nome={item.farmaco} />:{' '}
                          </span>
                          <span className="text-slate-300">{item.texto}</span>
                        </div>
                      ))}
                    </div>
                    <Secao titulo="Aspectos farmacocinéticos" conteudo={selecionada.farmacocinetica} />
                  </div>
                )}

                {aba === 'orientacoes' && (
                  <div className="space-y-5">
                    <Secao titulo="Orientações aos pacientes" conteudo={selecionada.orientacoes_pacientes} />
                    <Secao titulo="Aspectos farmacêuticos (armazenamento, preparo)" conteudo={selecionada.aspectos_farmaceuticos} />
                  </div>
                )}
              </div>
            </div>

            {/* Montador de receita */}
            <div ref={painelReceitaRef} className="bg-slate-950 border-2 border-teal-800/60 rounded-2xl p-5 space-y-3 shadow-inner scroll-mt-28">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
                  <Pill className="w-4 h-4" /> Receita pronta para o prontuário
                </div>
                <button
                  onClick={copiarReceita}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-lg"
                >
                  {copiado ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiado ? 'Receita copiada!' : 'Copiar receita'}
                </button>
              </div>
              <label className="block text-[11px] text-slate-400">
                Apresentação
                <select
                  value={apresentacao}
                  onChange={(e) => setApresentacao(e.target.value)}
                  className="mt-1 w-full rounded-lg border px-2 py-2 text-xs"
                >
                  {apresentacoesDisponiveis(selecionada).map((opcao) => (
                    <option key={opcao} value={opcao}>
                      {opcao}
                    </option>
                  ))}
                </select>
              </label>
              {!esquema && (
                <p className="text-[11px] text-amber-300/90">
                  Escolha um esquema em "Posologia & Receita" (botão "Usar na receita") para preencher a posologia.
                </p>
              )}
              <textarea
                value={textoReceita}
                onChange={(e) => setTextoReceita(e.target.value)}
                rows={12}
                aria-label="Texto da receita (editável)"
                className="w-full rounded-xl border p-3 font-mono text-xs leading-relaxed"
              />
              <p className="text-[10px] text-slate-500">
                Texto editável. Fonte: {fonte}. Reprodução permitida citando a fonte, sem fins comerciais. Ajuste dose,
                quantidade e duração ao paciente.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Secao: React.FC<{ titulo: string; conteudo: string }> = ({ titulo, conteudo }) => (
  <div className="space-y-2">
    <h3 className="text-xs font-bold text-teal-300 uppercase tracking-wider">{titulo}</h3>
    {conteudo ? <MarkdownSimples conteudo={conteudo} /> : <p className="text-xs text-slate-400">Não descrito no FTN.</p>}
  </div>
);
