import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, BookMarked, Check, Copy, ExternalLink, FileCheck, Filter, Pill, Search } from 'lucide-react';
import type { PcdtDetalhe, PcdtResumo, SecaoPcdt } from '../types';
import { listarPcdtConitec, normalizarTexto, obterPcdtConitec } from '../api';
import { LISTA_PCDT_OFICIAL_MS } from '../data/pcdt_oficial_ms';
import { LinkMedicamento } from './LinkMedicamento';

// Ordem das abas: o que o prescritor procura primeiro
const ORDEM_SECOES = [
  'esquemas',
  'medicamentos',
  'tempo_tratamento',
  'criterios_interrupcao',
  'inclusao',
  'exclusao',
  'casos_especiais',
  'monitoramento',
  'cid',
  'tratamento',
];

const dataBr = (iso: string) => (/^\d{4}-\d{2}-\d{2}/.test(iso) ? iso.slice(0, 10).split('-').reverse().join('/') : iso);
// "Asma (Anexo alterado em 04/09/2026)" -> "asma": casa com o nome da lista antiga do MS
const nomeBase = (titulo: string) => normalizarTexto(titulo.replace(/\(.*?\)/g, ' ')).replace(/\s+/g, ' ').trim();

type FiltroPcdt = 'todos' | 'esquemas' | 'sem_texto';

interface PcdtConitecViewProps {
  /** Id do PCDT, ou um título para filtrar (busca global) */
  selecao?: { id: number | string; versao: number } | null;
  onAbrirMonografia?: (idMonografia: number) => void;
}

const LinkExterno: React.FC<{ href: string; children: React.ReactNode; destaque?: boolean }> = ({ href, children, destaque }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
      destaque
        ? 'bg-sky-950/70 hover:bg-sky-900 border-sky-600/50 text-sky-200'
        : 'bg-slate-950 hover:bg-slate-850 border-slate-700 text-slate-300'
    }`}
  >
    {children}
    <ExternalLink className="w-3 h-3 opacity-70" />
  </a>
);

/** Lista oficial de PCDT da CONITEC com CIDs, fármacos e esquemas de administração extraídos dos PDFs. */
export const PcdtConitecView: React.FC<PcdtConitecViewProps> = ({ selecao, onAbrirMonografia }) => {
  const [lista, setLista] = useState<PcdtResumo[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [termo, setTermo] = useState('');
  const [filtro, setFiltro] = useState<FiltroPcdt>('todos');
  const [idSelecionado, setIdSelecionado] = useState<number | null>(null);
  const [detalhe, setDetalhe] = useState<PcdtDetalhe | null>(null);
  const [aba, setAba] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    listarPcdtConitec()
      .then((itens) => {
        setLista(itens);
        setIdSelecionado((atual) => atual ?? itens.find((p) => p.secoes_disponiveis.includes('esquemas'))?.id_pcdt ?? itens[0]?.id_pcdt ?? null);
      })
      .catch((e) => setErro(e instanceof Error ? e.message : String(e)));
  }, []);

  useEffect(() => {
    if (!selecao) return;
    if (typeof selecao.id === 'number') {
      setIdSelecionado(selecao.id);
      setTermo('');
      setFiltro('todos');
    } else {
      setTermo(selecao.id);
    }
  }, [selecao]);

  useEffect(() => {
    if (idSelecionado === null) return;
    let cancelado = false;
    obterPcdtConitec(idSelecionado)
      .then((d) => {
        if (cancelado) return;
        setDetalhe(d);
        const primeira = d && ORDEM_SECOES.find((chave) => d.secoes.some((s) => s.chave === chave && s.texto));
        setAba(primeira ?? null);
      })
      .catch((e) => !cancelado && setErro(e instanceof Error ? e.message : String(e)));
    return () => {
      cancelado = true;
    };
  }, [idSelecionado]);

  const filtrados = useMemo(() => {
    const t = normalizarTexto(termo);
    return (lista ?? []).filter((p) => {
      if (filtro === 'esquemas' && !p.secoes_disponiveis.includes('esquemas')) return false;
      if (filtro === 'sem_texto' && p.tem_texto) return false;
      if (!t) return true;
      return (
        normalizarTexto(p.titulo).includes(t) ||
        normalizarTexto(p.cids.join(' ')).includes(t) ||
        normalizarTexto(p.farmacos.map((f) => f.nome).join(' ')).includes(t)
      );
    });
  }, [lista, termo, filtro]);

  const curado = useMemo(() => {
    if (!detalhe) return null;
    const nome = nomeBase(detalhe.titulo);
    return LISTA_PCDT_OFICIAL_MS.find((p) => p.conteudo_curado && nomeBase(p.nome_protocolo) === nome) ?? null;
  }, [detalhe]);

  const secoesOrdenadas: SecaoPcdt[] = detalhe
    ? ORDEM_SECOES.flatMap((chave) => detalhe.secoes.filter((s) => s.chave === chave && s.texto))
    : [];
  const secao = secoesOrdenadas.find((s) => s.chave === aba) ?? secoesOrdenadas[0];
  const comEsquemas = (lista ?? []).filter((p) => p.secoes_disponiveis.includes('esquemas')).length;

  const copiar = (texto: string) =>
    navigator.clipboard
      .writeText(texto)
      .then(() => {
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
      })
      .catch(() => window.alert('Não foi possível acessar a área de transferência. Selecione o texto e copie manualmente.'));

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-teal-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            placeholder="Filtrar por doença, CID (ex.: J45) ou medicamento..."
            className="w-full bg-slate-950 border border-slate-750 focus:border-teal-500 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto text-xs scrollbar-none">
          <span className="text-slate-400 font-semibold text-[11px] flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Mostrar:
          </span>
          {(
            [
              { id: 'todos', label: `Todos (${lista?.length ?? 0})` },
              { id: 'esquemas', label: `Com esquemas de administração (${comEsquemas})` },
              { id: 'sem_texto', label: 'Só o PDF' },
            ] as { id: FiltroPcdt; label: string }[]
          ).map((s) => (
            <button
              key={s.id}
              onClick={() => setFiltro(s.id)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                filtro === s.id ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {erro && (
        <div role="alert" className="p-3 bg-rose-950/50 border border-rose-700/60 rounded-xl text-xs text-rose-200">
          {erro}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2.5 max-h-[760px] overflow-y-auto">
          <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800 text-slate-300 font-bold uppercase tracking-wider">
            <span>Protocolos ({filtrados.length})</span>
            {termo && (
              <button onClick={() => setTermo('')} className="text-teal-400 hover:text-teal-300 text-[11px]">
                Limpar
              </button>
            )}
          </div>
          {lista === null && !erro && <div className="py-8 text-center text-xs text-slate-400">Carregando os PCDT...</div>}
          {lista && filtrados.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">Nenhum PCDT corresponde ao filtro.</div>
          )}
          {filtrados.map((p) => {
            const ativo = p.id_pcdt === idSelecionado;
            return (
              <button
                key={p.id_pcdt}
                onClick={() => setIdSelecionado(p.id_pcdt)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  ativo
                    ? 'bg-teal-950/70 border-teal-500 shadow-lg shadow-teal-950/50 ring-1 ring-teal-500/40'
                    : 'bg-slate-850/60 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-[10px] mb-1">
                  <span className="font-mono text-slate-400">{p.data_portaria ? `Portaria de ${dataBr(p.data_portaria)}` : 'PCDT'}</span>
                  {p.secoes_disponiveis.includes('esquemas') ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-bold">
                      Esquemas
                    </span>
                  ) : (
                    !p.tem_texto && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-bold">Só PDF</span>
                    )
                  )}
                </div>
                <div className="text-xs font-bold text-slate-100 leading-snug mb-1.5">{p.titulo}</div>
                <div className="flex flex-wrap gap-1">
                  {p.cids.slice(0, 4).map((cid) => (
                    <span key={cid} className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-px rounded font-mono">
                      {cid}
                    </span>
                  ))}
                  {p.cids.length > 4 && <span className="text-[9px] text-slate-500">+{p.cids.length - 4}</span>}
                </div>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
          {!detalhe ? (
            <div className="py-12 text-center text-slate-400 text-xs">Selecione um protocolo da lista.</div>
          ) : (
            <>
              <div className="space-y-3 pb-4 border-b border-slate-800">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs bg-indigo-900/60 text-indigo-300 border border-indigo-700/60 px-2 py-0.5 rounded font-mono font-bold">
                    PCDT · CONITEC
                  </span>
                  {detalhe.portaria && (
                    <span className="text-[11px] text-slate-400">
                      {detalhe.portaria}
                      {detalhe.data_portaria && ` · publicada em ${dataBr(detalhe.data_portaria)}`}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-100 leading-tight">{detalhe.titulo}</h3>
                <div className="flex flex-wrap gap-2">
                  <LinkExterno href={detalhe.url_pdf} destaque>
                    <FileCheck className="w-4 h-4" /> PDF oficial{detalhe.paginas ? ` (${detalhe.paginas} p.)` : ''}
                  </LinkExterno>
                  {detalhe.url_resumido && <LinkExterno href={detalhe.url_resumido}>PCDT resumido</LinkExterno>}
                  {detalhe.url_portaria && <LinkExterno href={detalhe.url_portaria}>Portaria</LinkExterno>}
                  {detalhe.url_publicacao_ms && <LinkExterno href={detalhe.url_publicacao_ms}>Publicação MS</LinkExterno>}
                </div>
              </div>

              {detalhe.conteudo_desatualizado && (
                <div className="flex gap-2 p-3 bg-amber-950/40 border border-amber-700/50 rounded-xl text-[11px] text-amber-200">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-400" />
                  <span>
                    A CONITEC publicou um PDF novo deste protocolo depois da última extração. O texto abaixo pode estar
                    desatualizado: confira o PDF oficial.
                  </span>
                </div>
              )}

              {detalhe.cids.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">CID-10</span>
                  <div className="flex flex-wrap gap-1.5">
                    {detalhe.cids.map((cid) => (
                      <span key={cid} className="bg-slate-800/90 border border-slate-700 text-teal-300 px-2 py-0.5 rounded text-xs font-mono font-bold">
                        {cid}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {detalhe.farmacos.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Medicamentos do protocolo (Termo de Esclarecimento)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {detalhe.farmacos.map((f) => (
                      <span
                        key={f.chave}
                        className="bg-slate-800 text-slate-200 border border-slate-700/80 px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5"
                      >
                        <Pill className="w-3 h-3 text-teal-400 opacity-80" />
                        <LinkMedicamento nome={f.nome} />
                        {f.no_rename && (
                          <span className="text-[9px] px-1.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-bold" title="Na RENAME 2024">
                            SUS
                          </span>
                        )}
                        {f.id_monografia_ftn !== null && onAbrirMonografia && (
                          <button
                            onClick={() => onAbrirMonografia(f.id_monografia_ftn as number)}
                            className="text-teal-300 hover:text-teal-200"
                            title="Abrir a monografia do Formulário Terapêutico Nacional"
                            aria-label={`Monografia FTN de ${f.nome}`}
                          >
                            <BookMarked className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {secoesOrdenadas.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1" role="tablist" aria-label="Seções do PCDT">
                    {secoesOrdenadas.map((s) => (
                      <button
                        key={s.chave}
                        role="tab"
                        aria-selected={s.chave === secao?.chave}
                        onClick={() => setAba(s.chave)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap ${
                          s.chave === secao?.chave
                            ? 'bg-teal-700 text-white'
                            : 'bg-slate-850 text-slate-300 hover:bg-slate-800 border border-slate-800'
                        }`}
                      >
                        {s.titulo}
                      </button>
                    ))}
                  </div>
                  {secao && (
                    <div role="tabpanel" className="space-y-2">
                      <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line max-h-[460px] overflow-y-auto pr-1 p-4 bg-slate-950 border border-slate-800 rounded-xl">
                        {secao.texto}
                        {secao.completo === false && '\n[...]'}
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                        <span className="text-slate-500">
                          Texto extraído automaticamente do PDF oficial. Quadros e tabelas podem sair desalinhados.
                          {secao.completo === false && ' Trecho inicial: o texto completo está no PDF e no app desktop.'}
                        </span>
                        {secao.pagina > 0 && (
                          <a
                            href={`${detalhe.url_pdf}#page=${secao.pagina}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sky-300 hover:text-sky-200 font-semibold"
                          >
                            Ver no PDF (p. {secao.pagina}) <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed">
                  {detalhe.tem_texto
                    ? 'Não foi possível separar as seções deste PDF (formato antigo ou diferente do modelo atual).'
                    : 'Este PDF não tem texto selecionável (documento digitalizado) ou ainda não foi processado.'}{' '}
                  Consulte o documento oficial pelo botão "PDF oficial".
                </div>
              )}

              {curado && (
                <details className="p-4 bg-slate-950 border border-amber-800/40 rounded-xl text-xs space-y-3">
                  <summary className="cursor-pointer font-bold text-amber-200">
                    Resumo e modelo de prescrição do projeto OpenClinical (não oficial)
                  </summary>
                  <p className="text-[11px] text-amber-200/80">
                    Redigido pelo projeto e pendente de revisão clínica. Em caso de divergência, vale o PCDT oficial acima.
                  </p>
                  <p className="text-slate-300 leading-relaxed">{curado.conduta_clinica}</p>
                  {curado.bloco_prescricao_copiavel && (
                    <div className="space-y-2">
                      <pre className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-teal-300 font-mono whitespace-pre-wrap">
                        {curado.bloco_prescricao_copiavel}
                      </pre>
                      <button
                        onClick={() => copiar(curado.bloco_prescricao_copiavel)}
                        className="inline-flex items-center gap-1.5 bg-teal-700 hover:bg-teal-600 text-white px-3 py-1.5 rounded-lg font-bold"
                      >
                        {copiado ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiado ? 'Copiado!' : 'Copiar modelo'}
                      </button>
                    </div>
                  )}
                </details>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

let cacheLista: Promise<PcdtResumo[]> | null = null;

/** "PCDT que citam este medicamento", na monografia do FTN (cruzamento pela chave do princípio ativo). */
export const PcdtsDoFarmaco: React.FC<{ nomeMonografia: string; idMonografia: number; onAbrirPcdt?: (idPcdt: number) => void }> = ({
  nomeMonografia,
  idMonografia,
  onAbrirPcdt,
}) => {
  const [pcdts, setPcdts] = useState<PcdtResumo[]>([]);

  useEffect(() => {
    let cancelado = false;
    cacheLista ??= listarPcdtConitec().catch((erro) => {
      cacheLista = null;
      throw erro;
    });
    Promise.all([cacheLista, import('../ligacao_ftn')])
      .then(([lista, { chavesMonografia, chaveSubstanciaCmed }]) => {
        if (cancelado) return;
        const chaves = new Set(chavesMonografia(nomeMonografia));
        setPcdts(
          lista.filter((p) =>
            p.farmacos.some((f) => f.id_monografia_ftn === idMonografia || chaves.has(chaveSubstanciaCmed(f.nome)))
          )
        );
      })
      .catch(() => !cancelado && setPcdts([]));
    return () => {
      cancelado = true;
    };
  }, [nomeMonografia, idMonografia]);

  if (pcdts.length === 0) return null;
  return (
    <div className="text-xs text-slate-300 flex flex-wrap items-center gap-1.5">
      <span className="font-semibold text-slate-400">Citado nos PCDT (CONITEC): </span>
      {pcdts.map((p) => (
        <button
          key={p.id_pcdt}
          onClick={() => onAbrirPcdt?.(p.id_pcdt)}
          disabled={!onAbrirPcdt}
          className="px-2 py-0.5 rounded-full border bg-sky-950/60 text-sky-200 border-sky-700/60 hover:bg-sky-900 font-semibold"
        >
          {p.titulo.replace(/\s*\(Anexo.*?\)/, '')}
        </button>
      ))}
    </div>
  );
};
