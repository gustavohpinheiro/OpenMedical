import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  BookOpen,
  Copy,
  Check,
  Calendar,
  Search,
  Pill,
  ShieldCheck,
  Filter,
  FileText,
  AlertTriangle,
  Globe,
  ExternalLink,
  ArrowRightLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldAlert,
  Info,
  Layers,
} from 'lucide-react';
import { ProtocoloClinico } from '../types';
import { listarProtocolos, normalizarTexto } from '../api';
import { FARMACOS_POR_PROTOCOLO, CATEGORIAS_POR_PROTOCOLO } from '../catalog_protocolos';
import { MarkdownSimples } from './MarkdownSimples';
import { LinkMedicamento } from './LinkMedicamento';

/** "Atencao_Primaria_e_Urgencia" -> "Atenção Primária e Urgência" */
function formatarNivelAtencao(nivel: string): string {
  const acentos: Record<string, string> = {
    Atencao: 'Atenção',
    Primaria: 'Primária',
    Secundaria: 'Secundária',
    Terciaria: 'Terciária',
    Urgencia: 'Urgência',
    Emergencia: 'Emergência',
    Especializada: 'Especializada',
    Hospitalar: 'Hospitalar',
  };
  return nivel
    .split('_')
    .map((palavra) => acentos[palavra] ?? palavra)
    .join(' ');
}

type CategoriaFiltro =
  | 'todos'
  | 'dipirona'
  | 'infecto'
  | 'cardio'
  | 'respiratorio'
  | 'gastro'
  | 'endocrino'
  | 'neuro'
  | 'urgencia';

type FiltroJurisdicao = 'todas' | 'BR_SUS' | 'UK_NICE' | 'US_CDC_FDA' | 'GLOBAL_WHO' | 'CA_HEALTH';

type AbaVisualizacao = 'diretriz' | 'comparativo' | 'prescricao';

const CATEGORIAS_FILTRO: {
  id: CategoriaFiltro;
  label: string;
  destaque?: boolean;
  matches: (cat: string) => boolean;
}[] = [
  { id: 'todos', label: 'Todas as Especialidades', matches: () => true },
  { id: 'dipirona', label: '⭐ Dor & Febre (Dipirona)', destaque: true, matches: () => false },
  {
    id: 'infecto',
    label: 'Infectologia & Arboviroses',
    matches: (cat) =>
      cat.includes('infecto') ||
      cat === 'ginecologia' ||
      cat.includes('tropical') ||
      cat.includes('zoonoses') ||
      cat.includes('ist'),
  },
  {
    id: 'cardio',
    label: 'Cardio & Nefro',
    matches: (cat) => cat.includes('cardio') || cat.includes('nefro'),
  },
  {
    id: 'respiratorio',
    label: 'Pneumologia & Asma',
    matches: (cat) => cat.includes('pneumo') || cat.includes('respiratorio'),
  },
  {
    id: 'gastro',
    label: 'Gastroenterologia',
    matches: (cat) => cat.includes('gastro'),
  },
  {
    id: 'endocrino',
    label: 'Endócrino & Reumato',
    matches: (cat) =>
      cat.includes('endocrin') ||
      cat.includes('reumato') ||
      cat.includes('metabol') ||
      cat.includes('dor'),
  },
  {
    id: 'neuro',
    label: 'Neurologia & Saúde Mental',
    matches: (cat) =>
      cat.includes('neuro') ||
      cat.includes('mental') ||
      cat.includes('psiquiatria'),
  },
  {
    id: 'urgencia',
    label: 'Urgência & Obstetrícia',
    matches: (cat) =>
      cat.includes('urgencia') ||
      cat.includes('pediatria') ||
      cat.includes('obstetricia'),
  },
];

const FILTROS_JURISDICAO: {
  id: FiltroJurisdicao;
  label: string;
  bandeira: string;
}[] = [
  { id: 'todas', label: 'Todas as Origens', bandeira: '🌍' },
  { id: 'BR_SUS', label: 'SUS / Brasil (PCDT)', bandeira: '🇧🇷' },
  { id: 'UK_NICE', label: 'NICE (Reino Unido)', bandeira: '🇬🇧' },
  { id: 'US_CDC_FDA', label: 'CDC / FDA (EUA)', bandeira: '🇺🇸' },
  { id: 'GLOBAL_WHO', label: 'OMS (Global)', bandeira: '🌐' },
  { id: 'CA_HEALTH', label: 'Canadá (Health Canada)', bandeira: '🇨🇦' },
];

function obterInfoJurisdicao(jurisdicao?: string) {
  switch (jurisdicao) {
    case 'UK_NICE':
      return {
        bandeira: '🇬🇧',
        rotuloCurto: 'NICE · Reino Unido',
        agenciaPadrao: 'NICE (National Institute for Health and Care Excellence)',
        pais: 'Reino Unido',
        badgeClasses: 'bg-sky-950/80 text-sky-300 border border-sky-700/60',
        pillClasses: 'text-sky-400 bg-sky-950/90 border-sky-800',
        destaqueBorda: 'border-sky-500/70',
        gradienteFundo: 'from-sky-950/40 via-slate-900 to-slate-900',
      };
    case 'US_CDC_FDA':
      return {
        bandeira: '🇺🇸',
        rotuloCurto: 'CDC / FDA · EUA',
        agenciaPadrao: 'CDC / FDA (Estados Unidos)',
        pais: 'Estados Unidos',
        badgeClasses: 'bg-purple-950/80 text-purple-300 border border-purple-700/60',
        pillClasses: 'text-purple-400 bg-purple-950/90 border-purple-800',
        destaqueBorda: 'border-purple-500/70',
        gradienteFundo: 'from-purple-950/40 via-slate-900 to-slate-900',
      };
    case 'GLOBAL_WHO':
      return {
        bandeira: '🌐',
        rotuloCurto: 'OMS · Global',
        agenciaPadrao: 'OMS / WHO (World Health Organization)',
        pais: 'Global',
        badgeClasses: 'bg-blue-950/80 text-blue-300 border border-blue-700/60',
        pillClasses: 'text-blue-400 bg-blue-950/90 border-blue-800',
        destaqueBorda: 'border-blue-500/70',
        gradienteFundo: 'from-blue-950/40 via-slate-900 to-slate-900',
      };
    case 'CA_HEALTH':
      return {
        bandeira: '🇨🇦',
        rotuloCurto: 'Canadá · CCS',
        agenciaPadrao: 'Health Canada / Canadian Cardiovascular Society',
        pais: 'Canadá',
        badgeClasses: 'bg-rose-950/80 text-rose-300 border border-rose-700/60',
        pillClasses: 'text-rose-400 bg-rose-950/90 border-rose-800',
        destaqueBorda: 'border-rose-500/70',
        gradienteFundo: 'from-rose-950/40 via-slate-900 to-slate-900',
      };
    case 'BR_SUS':
    default:
      return {
        bandeira: '🇧🇷',
        rotuloCurto: 'SUS · Brasil (PCDT)',
        agenciaPadrao: 'Ministério da Saúde / CONITEC (Brasil)',
        pais: 'Brasil',
        badgeClasses: 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60',
        pillClasses: 'text-emerald-400 bg-emerald-950/90 border-emerald-800',
        destaqueBorda: 'border-emerald-500/70',
        gradienteFundo: 'from-emerald-950/40 via-slate-900 to-slate-900',
      };
  }
}

function protocoloNaCategoria(p: ProtocoloClinico, categoria: CategoriaFiltro): boolean {
  if (categoria === 'todos') return true;
  if (categoria === 'dipirona') {
    const farmacos = (FARMACOS_POR_PROTOCOLO[p.id_protocolo] || []).join(' ').toLowerCase();
    return farmacos.includes('dipirona') || p.bloco_prescricao_copiavel.toLowerCase().includes('dipirona');
  }
  const definicao = CATEGORIAS_FILTRO.find((c) => c.id === categoria);
  if (!definicao) return true;
  const catProtocolo = CATEGORIAS_POR_PROTOCOLO[p.id_protocolo] || p.categoria || '';
  return definicao.matches(catProtocolo);
}

function protocoloNaJurisdicao(p: ProtocoloClinico, jurisdicao: FiltroJurisdicao): boolean {
  if (jurisdicao === 'todas') return true;
  const jur = p.jurisdicao || 'BR_SUS';
  return jur === jurisdicao;
}

interface ProtocolsViewProps {
  protocoloSelecionadoId?: string | null;
}

export const ProtocolsView: React.FC<ProtocolsViewProps> = ({ protocoloSelecionadoId }) => {
  const [protocolos, setProtocolos] = useState<ProtocoloClinico[]>([]);
  const [selecionado, setSelecionado] = useState<ProtocoloClinico | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [termoFiltro, setTermoFiltro] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState<CategoriaFiltro>('todos');
  const [jurisdicaoAtiva, setJurisdicaoAtiva] = useState<FiltroJurisdicao>('todas');
  const [abaAtiva, setAbaAtiva] = useState<AbaVisualizacao>('diretriz');
  const [erroCarga, setErroCarga] = useState<string | null>(null);

  const painelDetalheRef = useRef<HTMLDivElement>(null);
  const listaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listarProtocolos()
      .then((lista) => {
        setProtocolos(lista);
        setErroCarga(null);
        const achado = protocoloSelecionadoId
          ? lista.find((p) => p.id_protocolo === protocoloSelecionadoId || p.titulo === protocoloSelecionadoId)
          : undefined;
        if (achado) {
          setTermoFiltro('');
          setCategoriaAtiva('todos');
          setJurisdicaoAtiva('todas');
          setSelecionado(achado);
        } else if (lista.length > 0) {
          setSelecionado((atual) => atual ?? lista[0]);
        }
      })
      .catch((e) => setErroCarga(e instanceof Error ? e.message : String(e)));
  }, [protocoloSelecionadoId]);

  // Mantém o item selecionado visível na lista lateral
  useEffect(() => {
    if (!selecionado) return;
    const item = listaRef.current?.querySelector<HTMLElement>(`[data-protocolo="${selecionado.id_protocolo}"]`);
    item?.scrollIntoView({ block: 'nearest' });
  }, [selecionado]);

  const selecionarProtocolo = (p: ProtocoloClinico) => {
    setSelecionado(p);
    // Se o protocolo tiver prescrição e estiver na aba de prescrição, mantém; se não tiver, garante aba de diretriz
    if (abaAtiva === 'prescricao' && !p.bloco_prescricao_copiavel) {
      setAbaAtiva('diretriz');
    }
    if (window.innerWidth < 1024) {
      setTimeout(() => painelDetalheRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
    }
  };

  const selecionarPorId = (idProtocolo: string) => {
    const p = protocolos.find((item) => item.id_protocolo === idProtocolo);
    if (p) {
      selecionarProtocolo(p);
      // Se a jurisdição ativa estava filtrando e esconderia esse protocolo, abrimos para todas
      if (jurisdicaoAtiva !== 'todas' && (p.jurisdicao || 'BR_SUS') !== jurisdicaoAtiva) {
        setJurisdicaoAtiva('todas');
      }
    }
  };

  const copiarPrescricao = () => {
    if (!selecionado || !selecionado.bloco_prescricao_copiavel) return;
    navigator.clipboard
      .writeText(selecionado.bloco_prescricao_copiavel)
      .then(() => {
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
      })
      .catch(() =>
        window.alert('Não foi possível acessar a área de transferência. Selecione o texto e copie manualmente.')
      );
  };

  const filtrarPorTexto = (p: ProtocoloClinico, t: string) => {
    if (!t) return true;
    const farmacos = normalizarTexto((FARMACOS_POR_PROTOCOLO[p.id_protocolo] || []).join(' '));
    const exclusivas = normalizarTexto((p.medicamentos_exclusivos_estrangeiros || []).join(' '));
    const divergencias = normalizarTexto((p.divergencias_relevantes_vs_sus || []).join(' '));
    const agencia = normalizarTexto(p.agencia || '');
    const pais = normalizarTexto(p.pais || '');
    const codigo = normalizarTexto(p.codigo_diretriz || '');

    return (
      normalizarTexto(p.titulo).includes(t) ||
      normalizarTexto(p.id_protocolo).includes(t) ||
      normalizarTexto(p.cids_relacionados.join(' ')).includes(t) ||
      normalizarTexto(p.bloco_prescricao_copiavel).includes(t) ||
      farmacos.includes(t) ||
      agencia.includes(t) ||
      pais.includes(t) ||
      codigo.includes(t) ||
      exclusivas.includes(t) ||
      divergencias.includes(t)
    );
  };

  // Filtragem combinada por termo, categoria e jurisdição
  const protocolosFiltrados = useMemo(() => {
    const t = normalizarTexto(termoFiltro);
    return protocolos.filter(
      (p) =>
        filtrarPorTexto(p, t) &&
        protocoloNaCategoria(p, categoriaAtiva) &&
        protocoloNaJurisdicao(p, jurisdicaoAtiva)
    );
  }, [protocolos, termoFiltro, categoriaAtiva, jurisdicaoAtiva]);

  const contagemPorCategoria = useMemo(() => {
    const contagem: Partial<Record<CategoriaFiltro, number>> = {};
    for (const categoria of CATEGORIAS_FILTRO) {
      contagem[categoria.id] = protocolos.filter((p) => protocoloNaCategoria(p, categoria.id)).length;
    }
    return contagem;
  }, [protocolos]);

  const contagemPorJurisdicao = useMemo(() => {
    const contagem: Record<FiltroJurisdicao, number> = {
      todas: protocolos.length,
      BR_SUS: 0,
      UK_NICE: 0,
      US_CDC_FDA: 0,
      GLOBAL_WHO: 0,
      CA_HEALTH: 0,
    };
    for (const p of protocolos) {
      const jur = (p.jurisdicao || 'BR_SUS') as FiltroJurisdicao;
      if (jur in contagem) {
        contagem[jur] += 1;
      }
    }
    return contagem;
  }, [protocolos]);

  // Relacionamentos para o comparativo SUS <-> Internacional
  const relacaoProtocolos = useMemo(() => {
    if (!selecionado) return { equivalenteSus: null, contrapartesInternacionais: [] };

    const jur = selecionado.jurisdicao || 'BR_SUS';

    if (jur === 'BR_SUS') {
      const contrapartes = protocolos.filter((p) => p.equivalente_sus_id === selecionado.id_protocolo);
      return { equivalenteSus: null, contrapartesInternacionais: contrapartes };
    } else {
      const equivalente = selecionado.equivalente_sus_id
        ? protocolos.find((p) => p.id_protocolo === selecionado.equivalente_sus_id) || null
        : null;
      return { equivalenteSus: equivalente, contrapartesInternacionais: [] };
    }
  }, [selecionado, protocolos]);

  const infoJurisdicaoSelecionado = useMemo(() => {
    return obterInfoJurisdicao(selecionado?.jurisdicao);
  }, [selecionado?.jurisdicao]);

  const temComparativo = useMemo(() => {
    if (!selecionado) return false;
    const jur = selecionado.jurisdicao || 'BR_SUS';
    if (jur !== 'BR_SUS') return true; // Qualquer protocolo internacional tem lente comparativa
    return relacaoProtocolos.contrapartesInternacionais.length > 0;
  }, [selecionado, relacaoProtocolos]);

  return (
    <div className="space-y-6">
      {/* Barra de Filtro, Busca Rápida e Seletores de Jurisdição */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="p-2.5 bg-teal-500/10 text-teal-400 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Central de Protocolos & Diretrizes Clínicas
                <span className="text-[10px] bg-teal-900/60 text-teal-300 border border-teal-700/60 px-2 py-0.5 rounded-full font-mono font-semibold">
                  {protocolos.length} diretrizes
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                PCDT / SUS soberano como conduta primária, integrado a diretrizes de referência internacional (NICE, CDC, OMS e Canadá)
              </p>
            </div>
          </div>

          {/* Campo de Busca Rápida */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-teal-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={termoFiltro}
              onChange={(e) => setTermoFiltro(e.target.value)}
              placeholder="Buscar por doença, remédio, CID, NICE, CDC, OMS..."
              className="w-full bg-slate-950 border border-slate-750 focus:border-teal-500 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Linha 1: Filtro de Jurisdição / Origem da Diretriz */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs border-t border-slate-800/80 pt-3">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Globe className="w-3.5 h-3.5 text-teal-400" /> Origem:
          </span>
          {FILTROS_JURISDICAO.map((jur) => {
            const ativa = jurisdicaoAtiva === jur.id;
            return (
              <button
                key={jur.id}
                onClick={() => setJurisdicaoAtiva(jur.id)}
                aria-pressed={ativa}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  ativa
                    ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-950/40 ring-1 ring-white/20'
                    : 'bg-slate-800/80 border border-slate-750 text-slate-300 hover:bg-slate-750 hover:text-white'
                }`}
              >
                <span>{jur.bandeira}</span>
                <span>{jur.label}</span>
                <span className="ml-0.5 text-[10px] opacity-75 font-mono">
                  ({contagemPorJurisdicao[jur.id] ?? 0})
                </span>
              </button>
            );
          })}
        </div>

        {/* Linha 2: Chips de Categorias Clínicas Rápidas */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" /> Áreas:
          </span>
          {CATEGORIAS_FILTRO.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoriaAtiva(cat.id)}
              aria-pressed={categoriaAtiva === cat.id}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                categoriaAtiva === cat.id
                  ? cat.destaque
                    ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-950/40 ring-1 ring-white/20'
                    : 'bg-teal-600 text-white shadow-md shadow-teal-950/40'
                  : 'bg-slate-800/80 border border-slate-750 text-slate-300 hover:bg-slate-750 hover:text-white'
              }`}
            >
              {cat.label} ({contagemPorCategoria[cat.id] ?? 0})
            </button>
          ))}
        </div>
      </div>

      {erroCarga && (
        <div role="alert" className="p-4 bg-rose-950/50 border border-rose-700/60 rounded-2xl text-sm text-rose-200">
          Não foi possível carregar os protocolos: {erroCarga}
        </div>
      )}

      {/* Grid Principal: Lista Lateral e Visualizador */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Coluna 1: Lista de Receitas e Diretrizes */}
        <div
          ref={listaRef}
          className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2.5 max-h-[460px] lg:max-h-[820px] overflow-y-auto"
        >
          <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-800 text-xs">
            <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span>Diretrizes Listadas</span>
              <span className="text-[10px] bg-slate-800 text-teal-300 px-1.5 py-0.5 rounded font-mono">
                {protocolosFiltrados.length}
              </span>
            </span>
            {(termoFiltro || categoriaAtiva !== 'todos' || jurisdicaoAtiva !== 'todas') && (
              <button
                onClick={() => {
                  setTermoFiltro('');
                  setCategoriaAtiva('todos');
                  setJurisdicaoAtiva('todas');
                }}
                className="text-teal-400 hover:text-teal-300 text-[11px] font-semibold"
              >
                Limpar filtros
              </button>
            )}
          </div>

          {protocolosFiltrados.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs space-y-1">
              <p className="font-semibold text-slate-300">Nenhuma diretriz encontrada para os filtros atuais.</p>
              <p className="text-slate-500">
                Tente buscar por &ldquo;Hipertensão&rdquo;, &ldquo;NICE&rdquo;, &ldquo;Lyme&rdquo; ou selecione &ldquo;Todas as Origens&rdquo;.
              </p>
            </div>
          )}

          {protocolosFiltrados.map((p) => {
            const ativo = selecionado?.id_protocolo === p.id_protocolo;
            const farmacos = FARMACOS_POR_PROTOCOLO[p.id_protocolo] || [];
            const infoJur = obterInfoJurisdicao(p.jurisdicao);
            const eInternacional = (p.jurisdicao || 'BR_SUS') !== 'BR_SUS';
            const temEquivSus = p.tem_equivalente_sus;

            return (
              <div
                key={p.id_protocolo}
                data-protocolo={p.id_protocolo}
                onClick={() => selecionarProtocolo(p)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selecionarProtocolo(p);
                  }
                }}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                  ativo
                    ? 'bg-teal-950/60 border-teal-500 shadow-lg shadow-teal-950/50 ring-1 ring-teal-500/40'
                    : 'bg-slate-850/60 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Linha Superior: Origem Jurisdicional e CIDs */}
                <div className="flex items-start justify-between gap-2 text-xs font-semibold mb-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 ${infoJur.badgeClasses}`}
                    >
                      <span>{infoJur.bandeira}</span>
                      <span>{infoJur.rotuloCurto}</span>
                    </span>
                    {eInternacional && !temEquivSus && (
                      <span className="text-[9px] bg-amber-950/90 text-amber-300 border border-amber-700/60 px-1.5 py-0.5 rounded font-medium">
                        Sem PCDT SUS
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap justify-end gap-1">
                    {p.cids_relacionados.slice(0, 3).map((cid) => (
                      <span key={cid} className="bg-slate-800 text-slate-300 px-1.5 py-px rounded text-[10px] font-mono">
                        {cid}
                      </span>
                    ))}
                    {p.cids_relacionados.length > 3 && (
                      <span className="text-slate-500 text-[10px] font-mono">
                        +{p.cids_relacionados.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-xs font-bold text-slate-100 leading-snug mb-2">
                  {p.titulo}
                </div>

                {/* Linha Inferior: Nível de Atenção e Fármacos */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/50">
                  <span className="text-teal-400/90 uppercase tracking-wider font-semibold">
                    {formatarNivelAtencao(p.nivel_atencao)}
                  </span>
                  {p.codigo_diretriz && (
                    <span className="font-mono text-slate-400 truncate max-w-[170px]" title={p.codigo_diretriz}>
                      {p.codigo_diretriz}
                    </span>
                  )}
                </div>

                {/* Chips de Medicamentos da Receita (se houver) */}
                {farmacos.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {farmacos.slice(0, 4).map((f, i) => {
                      const eDipirona = f.toLowerCase().includes('dipirona');
                      return (
                        <span
                          key={i}
                          className={`text-[9px] px-1.5 py-0.5 rounded-md font-medium flex items-center gap-1 ${
                            eDipirona
                              ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-700/60 font-semibold'
                              : 'bg-slate-800/90 text-slate-300 border border-slate-750'
                          }`}
                        >
                          <Pill className="w-2.5 h-2.5 opacity-70" />
                          <LinkMedicamento nome={f} />
                        </span>
                      );
                    })}
                    {farmacos.length > 4 && (
                      <span className="text-[9px] text-slate-500 self-center">
                        +{farmacos.length - 4} fármacos
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Coluna 2: Visualizador da Diretriz / Protocolo Selecionado */}
        <div
          ref={painelDetalheRef}
          className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5 scroll-mt-28"
        >
          {selecionado ? (
            <>
              {/* Cabeçalho do Protocolo / Metadados */}
              <div className="border-b border-slate-800 pb-4 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2 flex-1">
                    {/* Badge da Jurisdição e Agência */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 ${infoJurisdicaoSelecionado.badgeClasses}`}
                      >
                        <span className="text-base">{infoJurisdicaoSelecionado.bandeira}</span>
                        <span>{selecionado.agencia || infoJurisdicaoSelecionado.agenciaPadrao}</span>
                      </span>

                      {selecionado.codigo_diretriz && (
                        <span className="text-[11px] bg-slate-800 text-slate-300 border border-slate-750 px-2 py-0.5 rounded-md font-mono">
                          {selecionado.codigo_diretriz}
                        </span>
                      )}

                      {selecionado.url_fonte && (
                        <a
                          href={selecionado.url_fonte}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] bg-teal-950/80 hover:bg-teal-900 text-teal-300 border border-teal-700/60 px-2.5 py-0.5 rounded-md font-semibold inline-flex items-center gap-1 transition-all"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Fonte Governamental ↗</span>
                        </a>
                      )}
                    </div>

                    <h2 className="text-xl font-extrabold text-slate-100 leading-tight">
                      {selecionado.titulo}
                    </h2>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-[11px] bg-slate-800 text-slate-300 border border-slate-750 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        Publicado/Revisado em {selecionado.data_publicacao || selecionado.data_revisao}
                      </span>
                      <span className="text-[11px] bg-indigo-950 text-indigo-300 border border-indigo-700/50 px-2 py-0.5 rounded-full font-mono">
                        CIDs: {selecionado.cids_relacionados.join(', ')}
                      </span>
                      <span className="text-[11px] bg-teal-950/80 text-teal-300 border border-teal-700/60 px-2 py-0.5 rounded-full font-semibold">
                        {formatarNivelAtencao(selecionado.nivel_atencao)}
                      </span>
                    </div>
                  </div>

                  {/* Botão de Copiar Prescrição se houver receita */}
                  {selecionado.bloco_prescricao_copiavel ? (
                    <button
                      onClick={copiarPrescricao}
                      className="flex items-center space-x-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-teal-950/40 flex-shrink-0"
                    >
                      {copiado ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-white" />}
                      <span>{copiado ? 'Prescrição Copiada!' : 'Copiar Prescrição'}</span>
                    </button>
                  ) : (
                    selecionado.url_fonte && (
                      <a
                        href={selecionado.url_fonte}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-750 text-teal-300 border border-teal-700/40 rounded-xl text-xs font-semibold transition-all flex-shrink-0"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Abrir Link Oficial</span>
                      </a>
                    )
                  )}
                </div>

                {/* Banners Informativos de Contexto Governamental */}
                {(selecionado.jurisdicao || 'BR_SUS') !== 'BR_SUS' ? (
                  <div className="bg-slate-950/90 border border-sky-800/60 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-start gap-2.5 text-xs text-sky-200">
                      <Globe className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-sky-300">
                          <span>Diretriz Governamental Internacional ({selecionado.pais || 'Exterior'})</span>
                          <span className="text-[10px] bg-sky-950 text-sky-300 border border-sky-700/60 px-1.5 py-px rounded">
                            Referência Comparada
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          No Brasil, os <strong>Protocolos Clínicos e Diretrizes Terapêuticas (PCDT) do Ministério da Saúde / SUS</strong> permanecem a conduta oficial soberana para a rede pública. Esta diretriz estrangeira serve para enriquecer o raciocínio clínico, atualizar alternativas baseadas em evidências mundiais e balizar casos sem PCDT brasileiro específico.
                        </p>
                      </div>
                    </div>

                    {relacaoProtocolos.equivalenteSus && (
                      <div className="flex items-center justify-between bg-slate-900/90 border border-teal-800/60 rounded-lg p-2.5 mt-2">
                        <div className="text-xs text-slate-300 flex items-center gap-2">
                          <span className="text-base">🇧🇷</span>
                          <span>
                            Equivalente Oficial no SUS:{' '}
                            <strong className="text-teal-300">{relacaoProtocolos.equivalenteSus.titulo}</strong>
                          </span>
                        </div>
                        <button
                          onClick={() => selecionarPorId(relacaoProtocolos.equivalenteSus!.id_protocolo)}
                          className="px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-md shadow-teal-950/30"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                          <span>Ver PCDT do SUS</span>
                        </button>
                      </div>
                    )}

                    {!selecionado.tem_equivalente_sus && (
                      <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-950/50 border border-amber-700/60 rounded-lg p-2.5 mt-2">
                        <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        <span>
                          <strong>Sem PCDT Homologado na Atenção Primária do SUS:</strong> Condição com indicação terapêutica guiada primordialmente por consensos de sociedades médicas ou diretrizes internacionais.
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  // Caso o protocolo selecionado seja do SUS: se houver contrapartes internacionais, avisa o médico
                  relacaoProtocolos.contrapartesInternacionais.length > 0 && (
                    <div className="bg-slate-950/80 border border-teal-800/60 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Sparkles className="w-4 h-4 text-teal-400 flex-shrink-0" />
                        <span>
                          Diretrizes Internacionais Disponíveis:{' '}
                          <span className="text-teal-300 font-semibold">
                            {relacaoProtocolos.contrapartesInternacionais
                              .map((c) => `${obterInfoJurisdicao(c.jurisdicao).bandeira} ${c.agencia}`)
                              .join(' · ')}
                          </span>
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {relacaoProtocolos.contrapartesInternacionais.map((c) => {
                          const info = obterInfoJurisdicao(c.jurisdicao);
                          return (
                            <button
                              key={c.id_protocolo}
                              onClick={() => selecionarPorId(c.id_protocolo)}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-all flex items-center gap-1"
                            >
                              <span>{info.bandeira}</span>
                              <span>{info.rotuloCurto}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )
                )}

                {/* Seletor de Sub-Abas do Detalhe */}
                <div className="flex items-center gap-2 border-b border-slate-800 pt-2 text-xs">
                  <button
                    onClick={() => setAbaAtiva('diretriz')}
                    className={`pb-2 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                      abaAtiva === 'diretriz'
                        ? 'border-teal-500 text-teal-300'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Diretriz Clínica</span>
                  </button>

                  <button
                    onClick={() => setAbaAtiva('comparativo')}
                    className={`pb-2 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                      abaAtiva === 'comparativo'
                        ? 'border-teal-500 text-teal-300'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>Comparativo SUS vs. Internacional</span>
                    {temComparativo && (
                      <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                    )}
                  </button>

                  <button
                    onClick={() => setAbaAtiva('prescricao')}
                    className={`pb-2 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                      abaAtiva === 'prescricao'
                        ? 'border-teal-500 text-teal-300'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Receituário Prático</span>
                    {selecionado.bloco_prescricao_copiavel && (
                      <span className="text-[10px] bg-teal-950 text-teal-300 border border-teal-800 px-1.5 py-px rounded font-mono">
                        e-SUS
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* ABA 1: DIRETRIZ CLÍNICA (MARKDOWN) */}
              {abaAtiva === 'diretriz' && (
                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400" /> Conduta Clínica & Sinais de Alarme
                    </h3>
                    {selecionado.bloco_prescricao_copiavel && (
                      <button
                        onClick={copiarPrescricao}
                        className="text-xs text-teal-300 hover:text-white flex items-center space-x-1 font-semibold"
                      >
                        {copiado ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiado ? 'Copiado!' : 'Copiar Receita'}</span>
                      </button>
                    )}
                  </div>
                  <MarkdownSimples conteudo={selecionado.conteudo_markdown} />
                </div>
              )}

              {/* ABA 2: COMPARATIVO SUS vs. INTERNACIONAL */}
              {abaAtiva === 'comparativo' && (
                <div className="space-y-4">
                  {/* Se o protocolo ativo for internacional: mostra a análise comparada com o Brasil */}
                  {(selecionado.jurisdicao || 'BR_SUS') !== 'BR_SUS' ? (
                    <div className="space-y-4">
                      {/* Semáforo de Disponibilidade de Fármacos no SUS (RENAME) */}
                      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                          <Layers className="w-4 h-4 text-teal-400" /> Disponibilidade dos Fármacos na RENAME / Brasil
                        </h4>

                        {selecionado.disponibilidade_farmacos_rename_sus === 'total' && (
                          <div className="p-3.5 bg-emerald-950/60 border border-emerald-700/60 rounded-xl flex items-start gap-3 text-xs text-emerald-200">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <div className="space-y-1">
                              <span className="font-bold text-emerald-300 block">
                                Padronização Total na RENAME / Farmácia Básica
                              </span>
                              <p className="text-slate-300">
                                Todos os princípios ativos recomendados nesta diretriz estrangeira encontram-se incorporados ao SUS e estão disponíveis nas Unidades Básicas de Saúde do Brasil (ex: Doxiciclina, Ceftriaxona, Amoxicilina, etc.).
                              </p>
                            </div>
                          </div>
                        )}

                        {selecionado.disponibilidade_farmacos_rename_sus === 'parcial' && (
                          <div className="p-3.5 bg-amber-950/60 border border-amber-700/60 rounded-xl flex items-start gap-3 text-xs text-amber-200">
                            <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                            <div className="space-y-1">
                              <span className="font-bold text-amber-300 block">
                                Disponibilidade Parcial na RENAME / SUS
                              </span>
                              <p className="text-slate-300">
                                Parte dos medicamentos citados é disponibilizada no SUS (muitas vezes restrita a faixas etárias ou serviços especializados com LME), enquanto fármacos ou apresentações de última geração exigem prescrição comercial ou processo de excepcionalidade.
                              </p>
                            </div>
                          </div>
                        )}

                        {selecionado.disponibilidade_farmacos_rename_sus === 'ausente_no_sus' && (
                          <div className="p-3.5 bg-rose-950/60 border border-rose-700/60 rounded-xl flex items-start gap-3 text-xs text-rose-200">
                            <ShieldAlert className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                            <div className="space-y-1">
                              <span className="font-bold text-rose-300 block">
                                Fármacos Não Incorporados à RENAME
                              </span>
                              <p className="text-slate-300">
                                Os tratamentos de 1ª linha recomendados internacionalmente nesta condição não são distribuídos gratuitamente pela farmácia básica do SUS (exigem aquisição comercial privada na farmácia ou trâmite administrativo estadual).
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Lista de Fármacos / Tecnologias Exclusivas do Exterior */}
                        {selecionado.medicamentos_exclusivos_estrangeiros &&
                          selecionado.medicamentos_exclusivos_estrangeiros.length > 0 && (
                            <div className="space-y-2 pt-2">
                              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                                Medicamentos ou Tecnologias Diferenciais do Exterior:
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {selecionado.medicamentos_exclusivos_estrangeiros.map((med, idx) => (
                                  <div
                                    key={idx}
                                    className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 flex items-start gap-2"
                                  >
                                    <Pill className="w-3.5 h-3.5 text-teal-400 mt-0.5 flex-shrink-0" />
                                    <span>{med}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>

                      {/* Quadro de Divergências Relevantes vs. SUS */}
                      {selecionado.divergencias_relevantes_vs_sus &&
                        selecionado.divergencias_relevantes_vs_sus.length > 0 && (
                          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                              <ArrowRightLeft className="w-4 h-4 text-sky-400" /> Principais Divergências de Conduta vs. SUS
                            </h4>
                            <div className="space-y-2.5">
                              {selecionado.divergencias_relevantes_vs_sus.map((div, idx) => (
                                <div
                                  key={idx}
                                  className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed flex items-start gap-2.5"
                                >
                                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-sky-950 text-sky-300 border border-sky-800 flex items-center justify-center font-bold text-[11px]">
                                    {idx + 1}
                                  </span>
                                  <p>{div}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Botão de Alternância Direta para o SUS */}
                      {relacaoProtocolos.equivalenteSus && (
                        <div className="p-4 bg-gradient-to-r from-teal-950/40 via-slate-900 to-slate-900 border border-teal-700/60 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                              <span>🇧🇷 Protocolo Nacional Oficial Disponível</span>
                            </span>
                            <p className="text-xs text-slate-400">
                              Deseja visualizar a diretriz brasileira do Ministério da Saúde com receitas pré-formatadas para o SUS?
                            </p>
                          </div>
                          <button
                            onClick={() => selecionarPorId(relacaoProtocolos.equivalenteSus!.id_protocolo)}
                            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-teal-950/40 flex-shrink-0"
                          >
                            <ArrowRightLeft className="w-4 h-4" />
                            <span>Abrir Diretriz do SUS</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Caso o protocolo selecionado seja do SUS: lista as diretrizes internacionais alternativas
                    <div className="space-y-4">
                      {relacaoProtocolos.contrapartesInternacionais.length > 0 ? (
                        <div className="space-y-3">
                          <div className="p-4 bg-slate-950 border border-teal-800/60 rounded-2xl space-y-2">
                            <h4 className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                              <Globe className="w-4 h-4 text-teal-400" /> Diretrizes de Outros Governos para este Diagnóstico
                            </h4>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              O SUS é a conduta primária obrigatória no Brasil. No entanto, para fins de comparação acadêmica, pacientes com seguro internacional ou condutas refratárias, consulte as recomendações emitidas por outras autoridades de saúde de prestígio:
                            </p>
                          </div>

                          {relacaoProtocolos.contrapartesInternacionais.map((c) => {
                            const info = obterInfoJurisdicao(c.jurisdicao);
                            return (
                              <div
                                key={c.id_protocolo}
                                className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-md"
                              >
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span
                                        className={`text-xs px-2 py-0.5 rounded-md font-bold flex items-center gap-1 ${info.badgeClasses}`}
                                      >
                                        <span>{info.bandeira}</span>
                                        <span>{c.agencia}</span>
                                      </span>
                                      {c.codigo_diretriz && (
                                        <span className="text-[11px] font-mono text-slate-400">
                                          ({c.codigo_diretriz})
                                        </span>
                                      )}
                                    </div>
                                    <h5 className="text-sm font-bold text-slate-100">{c.titulo}</h5>
                                  </div>

                                  <button
                                    onClick={() => selecionarPorId(c.id_protocolo)}
                                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-teal-300 border border-teal-700/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0"
                                  >
                                    <span>Visualizar Diretriz Completa</span>
                                    <span>→</span>
                                  </button>
                                </div>

                                {c.divergencias_relevantes_vs_sus && c.divergencias_relevantes_vs_sus.length > 0 && (
                                  <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
                                    <span className="text-[11px] font-bold text-sky-300 uppercase tracking-wider block">
                                      O que esta diretriz propõe de diferente do SUS:
                                    </span>
                                    <ul className="space-y-1.5 text-xs text-slate-300">
                                      {c.divergencias_relevantes_vs_sus.map((div, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                          <span className="text-sky-400 font-bold">•</span>
                                          <span>{div}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-8 bg-slate-950 border border-slate-800 rounded-2xl text-center space-y-2">
                          <CheckCircle2 className="w-8 h-8 text-teal-400 mx-auto" />
                          <h4 className="text-sm font-bold text-slate-200">
                            Protocolo Soberano do SUS (Ministério da Saúde)
                          </h4>
                          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                            Esta diretriz segue rigorosamente os consensos do Ministério da Saúde, CONITEC e Sociedades Brasileiras Especializadas, sem divergências internacionais cadastradas no momento.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ABA 3: RECEITUÁRIO MÉDICO PRÁTICO */}
              {abaAtiva === 'prescricao' && (
                <div className="space-y-4">
                  {selecionado.bloco_prescricao_copiavel ? (
                    <div className="bg-slate-950 border-2 border-teal-800/60 rounded-2xl p-5 space-y-3 shadow-inner">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                        <div className="flex items-center space-x-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
                          <ShieldCheck className="w-4 h-4 text-teal-400" />
                          <span>Modelo de Prescrição Médica para Prontuário / e-SUS</span>
                        </div>
                        <button
                          onClick={copiarPrescricao}
                          className="text-xs text-teal-300 hover:text-white flex items-center space-x-1 font-semibold"
                        >
                          {copiado ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiado ? 'Copiado!' : 'Copiar Texto'}</span>
                        </button>
                      </div>

                      <pre className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl text-slate-200 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed selection:bg-teal-500 selection:text-white">
                        {selecionado.bloco_prescricao_copiavel}
                      </pre>
                    </div>
                  ) : (
                    <div className="p-8 bg-slate-950 border border-slate-800 rounded-2xl text-center space-y-3">
                      <Info className="w-8 h-8 text-sky-400 mx-auto" />
                      <h4 className="text-sm font-bold text-slate-200">
                        Prescrição Direta Estruturada na Diretriz Clínica
                      </h4>
                      <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                        As diretrizes internacionais fornecem posologias e escalonamento na aba{' '}
                        <strong className="text-slate-300">Diretriz Clínica</strong>. Modelos de receituário médico formatados para prontuário brasileiro / e-SUS estão atrelados aos protocolos oficiais do SUS.
                      </p>

                      {relacaoProtocolos.equivalenteSus && (
                        <button
                          onClick={() => {
                            selecionarPorId(relacaoProtocolos.equivalenteSus!.id_protocolo);
                            setAbaAtiva('prescricao');
                          }}
                          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-2 shadow-lg shadow-teal-950/40"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Ir para Receituário do SUS ({relacaoProtocolos.equivalenteSus.titulo})</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="p-16 text-center text-slate-400 text-sm space-y-2">
              <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="font-semibold text-slate-300">Selecione uma diretriz à esquerda para visualizar.</p>
              <p className="text-xs text-slate-500">
                Utilize as abas de jurisdição acima para alternar entre o SUS (Brasil), NICE (Reino Unido), CDC (EUA), OMS e Canadá.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};