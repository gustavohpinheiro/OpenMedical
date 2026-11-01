import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  X,
  Pill,
  Stethoscope,
  BookOpen,
  ArrowRight,
  FileCheck,
  Tag,
  AlertTriangle,
  BookMarked,
  FileText,
  Layers,
  Filter,
} from 'lucide-react';
import { ItemBuscaFts } from '../types';
import { buscarGeral } from '../api';

export type FiltroCategoriaBusca =
  | 'todos'
  | 'formularios'
  | 'medicamentos'
  | 'cmed'
  | 'protocolos'
  | 'diagnosticos';

interface SearchModalProps {
  aberto: boolean;
  onFechar: () => void;
  onSelecionarMedicamento: (id: number) => void;
  onSelecionarProtocolo: (id: string) => void;
  onSelecionarBasePublica: (tipo: 'cmed' | 'pcdt' | 'bula', id: number | string) => void;
  onSelecionarFormulario: (idMonografia: number) => void;
  /** Termo já digitado ao abrir (clique em um nome de medicamento sem bula própria) */
  termoInicial?: string;
}

const ROTULO_TIPO: Record<ItemBuscaFts['tipo_registro'], string> = {
  ftn_monografia: 'Formulário FTN',
  medicamento: 'Bula Oficial',
  protocolo: 'Protocolo Clínico',
  diagnostico: 'CID / CIAP',
  pcdt_governo: 'PCDT MS',
  cmed_comercial: 'CMED Comercial',
  bula_importada: 'Bula PDF',
  pcdt_conitec: 'PCDT CONITEC',
};

const ESTILO_TIPO: Record<ItemBuscaFts['tipo_registro'], { icone: string; selo: string }> = {
  ftn_monografia: {
    icone: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
    selo: 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-600/60',
  },
  medicamento: {
    icone: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
    selo: 'bg-cyan-50 text-cyan-700 border-cyan-300 dark:bg-cyan-900/60 dark:text-cyan-300 dark:border-cyan-700/50',
  },
  protocolo: {
    icone: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    selo: 'bg-indigo-50 text-indigo-700 border-indigo-300 dark:bg-indigo-900/60 dark:text-indigo-300 dark:border-indigo-700/50',
  },
  diagnostico: {
    icone: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    selo: 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-900/60 dark:text-amber-300 dark:border-amber-700/50',
  },
  pcdt_governo: {
    icone: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    selo: 'bg-sky-50 text-sky-700 border-sky-300 dark:bg-sky-900/60 dark:text-sky-300 dark:border-sky-700/50',
  },
  cmed_comercial: {
    icone: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    selo: 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-900/60 dark:text-amber-300 dark:border-amber-700/50',
  },
  bula_importada: {
    icone: 'bg-sky-500/10 text-sky-600 dark:text-sky-300',
    selo: 'bg-sky-50 text-sky-700 border-sky-300 dark:bg-sky-950 dark:text-sky-200 dark:border-sky-600/60',
  },
  pcdt_conitec: {
    icone: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    selo: 'bg-sky-50 text-sky-700 border-sky-300 dark:bg-sky-900/60 dark:text-sky-300 dark:border-sky-700/50',
  },
};

const ICONE_TIPO: Record<ItemBuscaFts['tipo_registro'], React.ComponentType<{ className?: string }>> = {
  ftn_monografia: BookMarked,
  medicamento: Pill,
  protocolo: BookOpen,
  diagnostico: Stethoscope,
  pcdt_governo: FileCheck,
  cmed_comercial: Tag,
  bula_importada: FileText,
  pcdt_conitec: FileCheck,
};

interface CategoriaConfig {
  id: FiltroCategoriaBusca;
  rotulo: string;
  rotuloCurto: string;
  icone: React.ComponentType<{ className?: string }>;
}

const CATEGORIAS_BUSCA: CategoriaConfig[] = [
  { id: 'todos', rotulo: 'Todos os Registros', rotuloCurto: 'Todos', icone: Layers },
  { id: 'formularios', rotulo: 'Formulários FTN', rotuloCurto: 'Formulários', icone: BookMarked },
  { id: 'medicamentos', rotulo: 'Medicamentos & Bulas', rotuloCurto: 'Medicamentos', icone: Pill },
  { id: 'cmed', rotulo: 'Preços & CMED', rotuloCurto: 'Comercial/CMED', icone: Tag },
  { id: 'protocolos', rotulo: 'Protocolos & PCDT', rotuloCurto: 'Protocolos', icone: BookOpen },
  { id: 'diagnosticos', rotulo: 'CIDs & Diagnósticos', rotuloCurto: 'CIDs/CIAP', icone: Stethoscope },
];

function itemPertenceAoFiltro(item: ItemBuscaFts, filtro: FiltroCategoriaBusca): boolean {
  if (filtro === 'todos') return true;
  if (filtro === 'formularios') {
    return item.tipo_registro === 'ftn_monografia';
  }
  if (filtro === 'medicamentos') {
    return item.tipo_registro === 'medicamento' || item.tipo_registro === 'bula_importada';
  }
  if (filtro === 'cmed') {
    return item.tipo_registro === 'cmed_comercial';
  }
  if (filtro === 'protocolos') {
    return (
      item.tipo_registro === 'protocolo' ||
      item.tipo_registro === 'pcdt_conitec' ||
      item.tipo_registro === 'pcdt_governo'
    );
  }
  if (filtro === 'diagnosticos') {
    return item.tipo_registro === 'diagnostico';
  }
  return true;
}

const SUGESTOES_POR_FILTRO: Record<FiltroCategoriaBusca, { termo: string; rotulo?: string; cor: string }[]> = {
  todos: [
    { termo: 'Amoxicilina', cor: 'text-teal-600 dark:text-teal-300' },
    { termo: 'Dipirona', cor: 'text-teal-600 dark:text-teal-300' },
    { termo: 'Noradrenalina', cor: 'text-teal-600 dark:text-teal-300' },
    { termo: 'N39.0', rotulo: 'CID N39.0 (ITU)', cor: 'text-amber-600 dark:text-amber-300' },
    { termo: 'Dengue', cor: 'text-indigo-600 dark:text-indigo-300' },
    { termo: 'Hipertensão', cor: 'text-indigo-600 dark:text-indigo-300' },
  ],
  formularios: [
    { termo: 'Amoxicilina', rotulo: 'Amoxicilina (FTN)', cor: 'text-emerald-600 dark:text-emerald-300' },
    { termo: 'Dipirona', rotulo: 'Dipirona (FTN)', cor: 'text-emerald-600 dark:text-emerald-300' },
    { termo: 'Omeprazol', rotulo: 'Omeprazol (FTN)', cor: 'text-emerald-600 dark:text-emerald-300' },
    { termo: 'Ceftriaxona', rotulo: 'Ceftriaxona (FTN)', cor: 'text-emerald-600 dark:text-emerald-300' },
    { termo: 'Azitromicina', rotulo: 'Azitromicina (FTN)', cor: 'text-emerald-600 dark:text-emerald-300' },
    { termo: 'Paracetamol', rotulo: 'Paracetamol (FTN)', cor: 'text-emerald-600 dark:text-emerald-300' },
  ],
  medicamentos: [
    { termo: 'Amoxil', rotulo: 'Amoxil (Bula)', cor: 'text-cyan-600 dark:text-cyan-300' },
    { termo: 'Novalgina', rotulo: 'Novalgina (Bula)', cor: 'text-cyan-600 dark:text-cyan-300' },
    { termo: 'Glifage', rotulo: 'Glifage (Bula)', cor: 'text-cyan-600 dark:text-cyan-300' },
    { termo: 'Rivotril', rotulo: 'Rivotril (Bula)', cor: 'text-cyan-600 dark:text-cyan-300' },
    { termo: 'Dipirona', rotulo: 'Dipirona Gotas', cor: 'text-cyan-600 dark:text-cyan-300' },
  ],
  cmed: [
    { termo: 'Losartana Potássica', rotulo: 'Losartana (CMED/PMC)', cor: 'text-amber-600 dark:text-amber-300' },
    { termo: 'Atenolol', rotulo: 'Atenolol (CMED/PMC)', cor: 'text-amber-600 dark:text-amber-300' },
    { termo: 'Metformina', rotulo: 'Metformina (CMED/PMC)', cor: 'text-amber-600 dark:text-amber-300' },
    { termo: 'Sinvastatina', rotulo: 'Sinvastatina (CMED/PMC)', cor: 'text-amber-600 dark:text-amber-300' },
    { termo: 'Enalapril', rotulo: 'Enalapril (CMED/PMC)', cor: 'text-amber-600 dark:text-amber-300' },
  ],
  protocolos: [
    { termo: 'Hipertensão', rotulo: 'Hipertensão Arterial PCDT', cor: 'text-indigo-600 dark:text-indigo-300' },
    { termo: 'Dengue', rotulo: 'Dengue MS 6ª Ed.', cor: 'text-indigo-600 dark:text-indigo-300' },
    { termo: 'Diabetes', rotulo: 'Diabetes Mellitus PCDT', cor: 'text-indigo-600 dark:text-indigo-300' },
    { termo: 'Sepse', rotulo: 'Protocolo de Sepse / Choque', cor: 'text-indigo-600 dark:text-indigo-300' },
    { termo: 'NICE', rotulo: 'Diretrizes Internacionais NICE', cor: 'text-indigo-600 dark:text-indigo-300' },
  ],
  diagnosticos: [
    { termo: 'I10', rotulo: 'CID I10 (Hipertensão Primária)', cor: 'text-amber-600 dark:text-amber-300' },
    { termo: 'E11', rotulo: 'CID E11 (DM2 Não Insulinodependente)', cor: 'text-amber-600 dark:text-amber-300' },
    { termo: 'N39.0', rotulo: 'CID N39.0 (Infecção do Trato Urinário)', cor: 'text-amber-600 dark:text-amber-300' },
    { termo: 'A90', rotulo: 'CID A90 (Dengue Clássica)', cor: 'text-amber-600 dark:text-amber-300' },
    { termo: 'J06', rotulo: 'CID J06 (IVAS Não Especificada)', cor: 'text-amber-600 dark:text-amber-300' },
  ],
};

export const SearchModal: React.FC<SearchModalProps> = ({
  aberto,
  onFechar,
  onSelecionarMedicamento,
  onSelecionarProtocolo,
  onSelecionarBasePublica,
  onSelecionarFormulario,
  termoInicial,
}) => {
  const [termo, setTermo] = useState('');
  const [resultados, setResultados] = useState<ItemBuscaFts[]>([]);
  const [filtroAtivo, setFiltroAtivo] = useState<FiltroCategoriaBusca>('todos');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [indiceAtivo, setIndiceAtivo] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (aberto) {
      if (termoInicial) setTermo(termoInicial);
      setFiltroAtivo('todos');
      inputRef.current?.focus();
    } else {
      setTermo('');
      setResultados([]);
      setErro(null);
      setFiltroAtivo('todos');
    }
  }, [aberto, termoInicial]);

  useEffect(() => {
    if (!termo.trim()) {
      setResultados([]);
      setErro(null);
      setCarregando(false);
      return;
    }

    // Descarta respostas de buscas antigas que cheguem depois de uma busca mais recente
    let obsoleta = false;
    const timer = setTimeout(async () => {
      setCarregando(true);
      try {
        const dados = await buscarGeral(termo);
        if (!obsoleta) {
          setResultados(dados);
          setErro(null);
          setIndiceAtivo(0);
        }
      } catch (e) {
        if (!obsoleta) {
          setResultados([]);
          setErro(e instanceof Error ? e.message : String(e));
        }
      } finally {
        if (!obsoleta) setCarregando(false);
      }
    }, 120);

    return () => {
      obsoleta = true;
      clearTimeout(timer);
    };
  }, [termo]);

  // Contagem de itens por categoria
  const contagensPorCategoria = useMemo(() => {
    const contagens: Record<FiltroCategoriaBusca, number> = {
      todos: resultados.length,
      formularios: 0,
      medicamentos: 0,
      cmed: 0,
      protocolos: 0,
      diagnosticos: 0,
    };
    for (const item of resultados) {
      if (item.tipo_registro === 'ftn_monografia') contagens.formularios++;
      else if (item.tipo_registro === 'medicamento' || item.tipo_registro === 'bula_importada') contagens.medicamentos++;
      else if (item.tipo_registro === 'cmed_comercial') contagens.cmed++;
      else if (item.tipo_registro === 'protocolo' || item.tipo_registro === 'pcdt_conitec' || item.tipo_registro === 'pcdt_governo') contagens.protocolos++;
      else if (item.tipo_registro === 'diagnostico') contagens.diagnosticos++;
    }
    return contagens;
  }, [resultados]);

  // Resultados filtrados pela categoria selecionada
  const resultadosFiltrados = useMemo(() => {
    if (filtroAtivo === 'todos') return resultados;
    return resultados.filter((item) => itemPertenceAoFiltro(item, filtroAtivo));
  }, [resultados, filtroAtivo]);

  useEffect(() => {
    const item = listaRef.current?.querySelector<HTMLElement>(`[data-indice="${indiceAtivo}"]`);
    item?.scrollIntoView({ block: 'nearest' });
  }, [indiceAtivo]);

  if (!aberto) return null;

  const trocarFiltro = (novoFiltro: FiltroCategoriaBusca) => {
    setFiltroAtivo(novoFiltro);
    setIndiceAtivo(0);
  };

  const selecionar = (item: ItemBuscaFts) => {
    switch (item.tipo_registro) {
      case 'ftn_monografia':
        onSelecionarFormulario(Number(item.id_referencia));
        break;
      case 'medicamento':
        onSelecionarMedicamento(Number(item.id_referencia));
        break;
      case 'protocolo':
        onSelecionarProtocolo(String(item.id_referencia));
        break;
      case 'pcdt_conitec':
        onSelecionarBasePublica('pcdt', Number(item.id_referencia));
        break;
      case 'pcdt_governo':
        // Lista antiga do MS (banco de versões anteriores): abre a lista atual filtrada pelo nome
        onSelecionarBasePublica('pcdt', item.titulo_primario);
        break;
      case 'cmed_comercial':
        onSelecionarBasePublica('cmed', Number(item.id_referencia));
        break;
      case 'bula_importada':
        // id "registro:tipo"
        onSelecionarBasePublica('bula', String(item.id_referencia).split(':')[0]);
        break;
      case 'diagnostico': {
        // Um código diagnóstico não tem tela própria: refaz a busca pelo CID para listar protocolos relacionados
        const cid = item.titulo_primario.split('/')[0].trim();
        setTermo(cid);
        return;
      }
    }
    onFechar();
  };

  const aoPressionarTecla = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onFechar();
    } else if (e.key === 'ArrowDown' && resultadosFiltrados.length > 0) {
      e.preventDefault();
      setIndiceAtivo((i) => Math.min(i + 1, resultadosFiltrados.length - 1));
    } else if (e.key === 'ArrowUp' && resultadosFiltrados.length > 0) {
      e.preventDefault();
      setIndiceAtivo((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && resultadosFiltrados[indiceAtivo]) {
      e.preventDefault();
      selecionar(resultadosFiltrados[indiceAtivo]);
    }
  };

  const sugestoesAtuais = SUGESTOES_POR_FILTRO[filtroAtivo] || SUGESTOES_POR_FILTRO.todos;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-16 bg-slate-950/80 backdrop-blur-sm p-3 sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onFechar();
      }}
      onKeyDown={aoPressionarTecla}
      role="dialog"
      aria-modal="true"
      aria-label="Busca clínica"
    >
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-fade-in text-slate-800 dark:text-slate-100">
        {/* Barra de entrada de busca */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
          <Search className="w-5 h-5 text-teal-600 dark:text-teal-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            autoFocus
            type="text"
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            placeholder="Buscar por fármaco, marca CMED, CID-10, CIAP-2, protocolo ou PCDT..."
            aria-label="Termo de busca"
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50"
          />
          {termo && (
            <button
              onClick={() => {
                setTermo('');
                inputRef.current?.focus();
              }}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 ml-1 mr-2 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 transition"
              aria-label="Limpar busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onFechar}
            className="px-2 py-1 text-xs font-mono bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 rounded-lg hover:text-slate-900 dark:hover:text-slate-200 transition shrink-0 ml-1"
            aria-label="Fechar busca"
          >
            ESC
          </button>
        </div>

        {/* Barra de Filtros de Categoria */}
        <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-100/90 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 mr-1 shrink-0 uppercase tracking-wider">
            <Filter className="w-3 h-3 text-teal-600 dark:text-teal-400" />
            <span className="hidden sm:inline">Filtrar:</span>
          </div>
          {CATEGORIAS_BUSCA.map((cat) => {
            const IconeCat = cat.icone;
            const ativo = filtroAtivo === cat.id;
            const qtd = contagensPorCategoria[cat.id];
            const temResultadosTermo = Boolean(termo && resultados.length > 0);
            const semMatchesNesteFiltro = temResultadosTermo && qtd === 0;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => trocarFiltro(cat.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all whitespace-nowrap shrink-0 border ${
                  ativo
                    ? 'bg-teal-600 text-white border-teal-600 font-semibold shadow-sm'
                    : semMatchesNesteFiltro
                    ? 'bg-slate-50 dark:bg-slate-900/40 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-800/50 hover:border-slate-300'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-750'
                }`}
                title={`Filtrar por ${cat.rotulo}`}
              >
                <IconeCat className={`w-3.5 h-3.5 ${ativo ? 'text-white' : 'text-teal-600 dark:text-teal-400'}`} />
                <span>{cat.rotuloCurto}</span>
                {temResultadosTermo && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      ativo
                        ? 'bg-white/25 text-white'
                        : semMatchesNesteFiltro
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                        : 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300'
                    }`}
                  >
                    {qtd}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Lista de Resultados */}
        <div ref={listaRef} className="flex-1 overflow-y-auto p-2">
          {carregando && resultados.length === 0 && (
            <div className="py-8 text-center text-slate-400 text-sm">Buscando na base clínica oficial...</div>
          )}

          {erro && (
            <div role="alert" className="m-2 p-3 flex items-start gap-2 bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-700/60 rounded-xl text-xs text-rose-700 dark:text-rose-200">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Falha na busca: {erro}</span>
            </div>
          )}

          {!carregando && !erro && termo && resultados.length === 0 && (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              <p className="text-sm font-medium">Nenhum registro encontrado para &ldquo;{termo}&rdquo;.</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Verifique a ortografia ou consulte pela denominação genérica (DCB).</p>
            </div>
          )}

          {/* Quando há resultados gerais mas nenhum no filtro atual */}
          {!carregando && !erro && termo && resultados.length > 0 && resultadosFiltrados.length === 0 && (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400 space-y-2">
              <p className="text-sm">
                Nenhum item de <strong className="text-slate-800 dark:text-slate-200">{CATEGORIAS_BUSCA.find(c => c.id === filtroAtivo)?.rotulo}</strong> para &ldquo;{termo}&rdquo;.
              </p>
              <p className="text-xs text-slate-400">
                Há {resultados.length} resultado(s) disponíveis em outras categorias.
              </p>
              <button
                type="button"
                onClick={() => trocarFiltro('todos')}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold shadow transition"
              >
                <Layers className="w-3.5 h-3.5" /> Ver todos os {resultados.length} resultados
              </button>
            </div>
          )}

          {!termo && (
            <div className="p-4 text-xs text-slate-600 dark:text-slate-400 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                  Sugestões ({CATEGORIAS_BUSCA.find(c => c.id === filtroAtivo)?.rotulo}):
                </span>
                <span className="text-[10px] text-slate-400">Selecione um filtro acima para refinar</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sugestoesAtuais.map((sugestao) => (
                  <button
                    key={sugestao.termo}
                    onClick={() => setTermo(sugestao.termo)}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/80 transition flex items-center gap-1.5"
                  >
                    <span className={sugestao.cor}>{sugestao.rotulo ?? sugestao.termo}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {resultadosFiltrados.map((item, idx) => {
            const Icone = ICONE_TIPO[item.tipo_registro] ?? BookOpen;
            const estilo = ESTILO_TIPO[item.tipo_registro] ?? ESTILO_TIPO.protocolo;
            const ativo = idx === indiceAtivo;
            return (
              <div
                key={`${item.tipo_registro}-${item.id_referencia}-${idx}`}
                data-indice={idx}
                onClick={() => selecionar(item)}
                onMouseMove={() => setIndiceAtivo(idx)}
                role="option"
                aria-selected={ativo}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors group mb-1 ${
                  ativo
                    ? 'bg-teal-50/80 dark:bg-slate-800/90 ring-1 ring-teal-500/50 shadow-sm'
                    : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${estilo.icone}`}>
                    <Icone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm truncate">
                        {item.titulo_primario}
                      </span>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded uppercase tracking-wider border flex-shrink-0 ${estilo.selo}`}>
                        {ROTULO_TIPO[item.tipo_registro] ?? item.tipo_registro}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{item.subtitulo}</p>
                  </div>
                </div>
                <ArrowRight
                  className={`w-4 h-4 flex-shrink-0 ml-2 transition-all ${
                    ativo ? 'text-teal-600 dark:text-teal-400 translate-x-0.5' : 'text-slate-400 dark:text-slate-600'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Rodapé informativo */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex justify-between items-center gap-3">
          <span>
            {resultados.length > 0
              ? `${resultadosFiltrados.length} de ${resultados.length} resultado(s) exibidos`
              : 'Busca rápida e segura offline'}
          </span>
          <span className="hidden sm:inline">↑ ↓ para navegar &bull; Enter para abrir &bull; Esc para fechar</span>
        </div>
      </div>
    </div>
  );
};
