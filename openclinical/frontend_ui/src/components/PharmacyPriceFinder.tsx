import React, { useEffect, useState } from 'react';
import { AlertCircle, Check, Copy, ExternalLink, Info, Pill, Search, ShieldCheck, Store } from 'lucide-react';
import type { AnalisePrecoMedicamento, ApresentacaoCmedResumo } from '../types';
import { analisarPrecoMedicamento, buscarApresentacoesPreco, isTauri } from '../api';
import { LinkMedicamento } from './LinkMedicamento';

interface PharmacyPriceFinderProps {
  /** Nome para pesquisar ou id_cmed de uma apresentação já escolhida */
  medicamentoInicial?: string | number;
  onSelecionarMedicamento?: (id: number) => void;
}

const SUGESTOES = ['Losartana', 'Metformina', 'Sinvastatina', 'Dipirona', 'Amoxicilina', 'Omeprazol', 'Salbutamol', 'Levotiroxina'];

const moeda = (valor: number) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const PharmacyPriceFinder: React.FC<PharmacyPriceFinderProps> = ({ medicamentoInicial }) => {
  const [termo, setTermo] = useState(
    typeof medicamentoInicial === 'string' ? medicamentoInicial : medicamentoInicial === undefined ? 'Losartana' : ''
  );
  const [apresentacoes, setApresentacoes] = useState<ApresentacaoCmedResumo[]>([]);
  const [idSelecionado, setIdSelecionado] = useState<number | null>(
    typeof medicamentoInicial === 'number' ? medicamentoInicial : null
  );
  const [analise, setAnalise] = useState<AnalisePrecoMedicamento | null>(null);
  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  // Busca das apresentações (com atraso para não consultar a cada tecla)
  useEffect(() => {
    if (!termo.trim()) {
      setApresentacoes([]);
      return;
    }
    let obsoleta = false;
    const temporizador = setTimeout(() => {
      setBuscando(true);
      buscarApresentacoesPreco(termo)
        .then((lista) => {
          if (obsoleta) return;
          setApresentacoes(lista);
          setErro(null);
          // Sem escolha explícita, mostra a primeira apresentação encontrada
          setIdSelecionado((atual) => atual ?? lista[0]?.id_cmed ?? null);
        })
        .catch((e) => !obsoleta && setErro(e instanceof Error ? e.message : String(e)))
        .finally(() => !obsoleta && setBuscando(false));
    }, 200);
    return () => {
      obsoleta = true;
      clearTimeout(temporizador);
    };
  }, [termo]);

  useEffect(() => {
    if (idSelecionado === null) {
      setAnalise(null);
      return;
    }
    let obsoleta = false;
    analisarPrecoMedicamento(idSelecionado)
      .then((resultado) => {
        if (!obsoleta) {
          setAnalise(resultado);
          setErro(null);
        }
      })
      .catch((e) => !obsoleta && setErro(e instanceof Error ? e.message : String(e)));
    return () => {
      obsoleta = true;
    };
  }, [idSelecionado]);

  const copiarParaPaciente = () => {
    if (!analise) return;
    const linhas = [
      `Medicamento: ${analise.nome_comercial} (${analise.substancia})`,
      `Apresentação: ${analise.apresentacao}`,
      analise.preco_pmc_teto !== null
        ? `Preço máximo permitido (PMC/CMED, ICMS 18%): ${moeda(analise.preco_pmc_teto)} - a farmácia não pode cobrar acima disso.`
        : 'Sem preço máximo (PMC) publicado pela CMED para esta apresentação.',
      analise.farmacia_popular.gratuito
        ? `GRATUITO no Farmácia Popular: leve a receita e um documento com foto a uma farmácia com o selo "Aqui tem Farmácia Popular".`
        : '',
      `Compare preços em: ${analise.links_pesquisa[0]?.url ?? ''}`,
    ].filter(Boolean);
    navigator.clipboard
      .writeText(linhas.join('\n'))
      .then(() => {
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2500);
      })
      .catch(() => window.alert('Não foi possível copiar. Selecione o texto manualmente.'));
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho e busca */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">Preço máximo, Farmácia Popular e onde pesquisar</h2>
            <p className="text-xs text-slate-400">
              Teto legal de preço (PMC da CMED/ANVISA), gratuidade pelo Farmácia Popular e links para conferir o preço nas
              farmácias.
            </p>
          </div>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-teal-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={termo}
            onChange={(e) => {
              setTermo(e.target.value);
              setIdSelecionado(null);
            }}
            placeholder="Nome do remédio, substância ou código de barras (EAN)..."
            aria-label="Buscar medicamento"
            className="w-full rounded-xl border pl-9 pr-4 py-2 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SUGESTOES.map((sugestao) => (
            <button
              key={sugestao}
              onClick={() => {
                setTermo(sugestao);
                setIdSelecionado(null);
              }}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-750"
            >
              {sugestao}
            </button>
          ))}
        </div>
        {!isTauri() && (
          <p className="text-[11px] text-slate-500">
            No navegador a busca usa uma amostra offline da tabela CMED; o app desktop pesquisa as 26.635 apresentações.
          </p>
        )}
      </div>

      {erro && (
        <div role="alert" className="p-3 bg-rose-950/50 border border-rose-700/60 rounded-xl text-xs text-rose-200">
          {erro}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Apresentações encontradas */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-xl space-y-1.5 max-h-[420px] lg:max-h-[720px] overflow-y-auto">
          <div className="px-2 pb-2 border-b border-slate-800 text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            {buscando ? 'Buscando...' : `${apresentacoes.length} apresentação(ões)`}
          </div>
          {!buscando && termo.trim() && apresentacoes.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">Nenhuma apresentação encontrada na tabela CMED.</div>
          )}
          {apresentacoes.map((item) => (
            <button
              key={item.id_cmed}
              onClick={() => setIdSelecionado(item.id_cmed)}
              className={`w-full text-left p-3 rounded-xl border transition-all ${
                idSelecionado === item.id_cmed
                  ? 'bg-emerald-950/50 border-emerald-500 ring-1 ring-emerald-500/40'
                  : 'bg-slate-850/60 border-slate-800 hover:bg-slate-800/80'
              }`}
            >
              <div className="text-xs font-bold text-slate-100 leading-snug">{item.titulo}</div>
              <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{item.subtitulo}</div>
            </button>
          ))}
        </div>

        {/* Análise da apresentação */}
        <div className="lg:col-span-7 space-y-4">
          {!analise && !erro && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-sm text-slate-400">
              Escolha uma apresentação para ver o preço máximo e a situação no Farmácia Popular.
            </div>
          )}

          {analise && (
            <>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-1">
                      {analise.tipo_produto && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-teal-900/60 text-teal-300 border border-teal-700/60">
                          {analise.tipo_produto}
                        </span>
                      )}
                      {analise.codigo_ean && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">EAN {analise.codigo_ean}</span>
                      )}
                    </div>
                    <h3 className="text-lg font-black text-white">{analise.nome_comercial}</h3>
                    <p className="text-xs text-slate-400">
                      <LinkMedicamento nome={analise.substancia} /> &bull; {analise.apresentacao}
                    </p>
                  </div>
                  <button
                    onClick={copiarParaPaciente}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 flex-shrink-0"
                  >
                    {copiado ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    {copiado ? 'Copiado!' : 'Copiar para o paciente'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-slate-950/70 border border-amber-700/40 rounded-xl">
                    <div className="text-[11px] font-semibold text-amber-300 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Preço máximo (PMC)
                    </div>
                    <div className="text-2xl font-black text-amber-200 mt-1">
                      {analise.preco_pmc_teto !== null ? moeda(analise.preco_pmc_teto) : '—'}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {analise.preco_pmc_teto !== null
                        ? 'Teto legal CMED com ICMS de 18%; a farmácia não pode cobrar acima.'
                        : 'A CMED não publica PMC para esta apresentação (ex.: uso hospitalar).'}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
                    <div className="text-[11px] font-semibold text-cyan-300 flex items-center gap-1">
                      <Pill className="w-3.5 h-3.5" /> PMC por unidade
                    </div>
                    <div className="text-2xl font-black text-cyan-200 mt-1">
                      {analise.pmc_por_unidade !== null ? moeda(analise.pmc_por_unidade) : '—'}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {analise.quantidade_unidades
                        ? `${analise.quantidade_unidades} unidades na embalagem`
                        : 'Quantidade não identificada na embalagem'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Farmácia Popular */}
              <div
                className={`rounded-2xl p-4 border flex items-start gap-3 ${
                  analise.farmacia_popular.gratuito
                    ? 'bg-emerald-950/50 border-emerald-500/50'
                    : analise.farmacia_popular.substancia_no_programa
                    ? 'bg-amber-950/40 border-amber-600/50'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                {analise.farmacia_popular.gratuito ? (
                  <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="text-xs space-y-1">
                  <div className="font-bold text-slate-100">
                    Farmácia Popular:{' '}
                    {analise.farmacia_popular.gratuito
                      ? 'GRATUITO'
                      : analise.farmacia_popular.substancia_no_programa
                      ? 'só em outra dose'
                      : 'não incluído'}
                  </div>
                  <p className="text-slate-300">{analise.farmacia_popular.mensagem}</p>
                  <a
                    href="https://www.gov.br/saude/pt-br/composicao/sectics/farmacia-popular"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-teal-300 hover:text-teal-200"
                  >
                    Regras e farmácias credenciadas (gov.br) <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Onde pesquisar o preço */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Search className="w-4 h-4 text-emerald-400" /> Pesquisar o preço nas farmácias
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {analise.links_pesquisa.map((link) => (
                    <a
                      key={link.nome_farmacia}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-teal-500/50"
                    >
                      <span>
                        <span className="block text-xs font-bold text-slate-100">{link.nome_farmacia}</span>
                        <span className="block text-[10px] text-slate-400">{link.descricao}</span>
                      </span>
                      <ExternalLink className="w-4 h-4 text-teal-400 flex-shrink-0" />
                    </a>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-px" />
                  O OpenClinical não consulta preços das farmácias: os links abrem a busca de cada site, onde o valor real
                  aparece. O PMC varia com o ICMS do estado; aqui é exibida a coluna de 18%.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
