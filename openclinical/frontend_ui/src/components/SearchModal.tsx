import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Pill, Stethoscope, BookOpen, ArrowRight, FileCheck, Tag, AlertTriangle, BookMarked } from 'lucide-react';
import { ItemBuscaFts } from '../types';
import { buscarGeral } from '../api';

interface SearchModalProps {
  aberto: boolean;
  onFechar: () => void;
  onSelecionarMedicamento: (id: number) => void;
  onSelecionarProtocolo: (id: string) => void;
  onSelecionarBasePublica: (tipo: 'cmed' | 'pcdt', id: number) => void;
  onSelecionarFormulario: (idMonografia: number) => void;
}

const ROTULO_TIPO: Record<ItemBuscaFts['tipo_registro'], string> = {
  ftn_monografia: 'Formulário',
  medicamento: 'Bula',
  protocolo: 'Protocolo',
  diagnostico: 'CID / CIAP',
  pcdt_governo: 'PCDT MS',
  cmed_comercial: 'CMED',
};

const ESTILO_TIPO: Record<ItemBuscaFts['tipo_registro'], { icone: string; selo: string }> = {
  ftn_monografia: { icone: 'bg-teal-500/10 text-teal-300', selo: 'bg-teal-950 text-teal-200 border-teal-600/60' },
  medicamento: { icone: 'bg-teal-500/10 text-teal-400', selo: 'bg-teal-900/60 text-teal-300 border-teal-700/50' },
  protocolo: { icone: 'bg-indigo-500/10 text-indigo-400', selo: 'bg-indigo-900/60 text-indigo-300 border-indigo-700/50' },
  diagnostico: { icone: 'bg-amber-500/10 text-amber-400', selo: 'bg-amber-900/60 text-amber-300 border-amber-700/50' },
  pcdt_governo: { icone: 'bg-sky-500/10 text-sky-400', selo: 'bg-sky-900/60 text-sky-300 border-sky-700/50' },
  cmed_comercial: { icone: 'bg-emerald-500/10 text-emerald-400', selo: 'bg-emerald-900/60 text-emerald-300 border-emerald-700/50' },
};

const ICONE_TIPO: Record<ItemBuscaFts['tipo_registro'], React.ComponentType<{ className?: string }>> = {
  ftn_monografia: BookMarked,
  medicamento: Pill,
  protocolo: BookOpen,
  diagnostico: Stethoscope,
  pcdt_governo: FileCheck,
  cmed_comercial: Tag,
};

export const SearchModal: React.FC<SearchModalProps> = ({
  aberto,
  onFechar,
  onSelecionarMedicamento,
  onSelecionarProtocolo,
  onSelecionarBasePublica,
  onSelecionarFormulario,
}) => {
  const [termo, setTermo] = useState('');
  const [resultados, setResultados] = useState<ItemBuscaFts[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [indiceAtivo, setIndiceAtivo] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (aberto) {
      inputRef.current?.focus();
    } else {
      setTermo('');
      setResultados([]);
      setErro(null);
    }
  }, [aberto]);

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

  useEffect(() => {
    const item = listaRef.current?.querySelector<HTMLElement>(`[data-indice="${indiceAtivo}"]`);
    item?.scrollIntoView({ block: 'nearest' });
  }, [indiceAtivo]);

  if (!aberto) return null;

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
      case 'pcdt_governo':
        onSelecionarBasePublica('pcdt', Number(item.id_referencia));
        break;
      case 'cmed_comercial':
        onSelecionarBasePublica('cmed', Number(item.id_referencia));
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
    } else if (e.key === 'ArrowDown' && resultados.length > 0) {
      e.preventDefault();
      setIndiceAtivo((i) => Math.min(i + 1, resultados.length - 1));
    } else if (e.key === 'ArrowUp' && resultados.length > 0) {
      e.preventDefault();
      setIndiceAtivo((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && resultados[indiceAtivo]) {
      e.preventDefault();
      selecionar(resultados[indiceAtivo]);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-slate-950/80 backdrop-blur-sm p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onFechar();
      }}
      onKeyDown={aoPressionarTecla}
      role="dialog"
      aria-modal="true"
      aria-label="Busca clínica"
    >
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-fade-in">
        {/* Barra de entrada de busca */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-850">
          <Search className="w-5 h-5 text-teal-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            autoFocus
            type="text"
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            placeholder="Fármaco, marca, CID-10, CIAP-2, protocolo ou PCDT..."
            aria-label="Termo de busca"
            className="w-full rounded-lg border px-2 py-1 text-slate-100 placeholder-slate-400 text-base focus:outline-none"
          />
          {termo && (
            <button
              onClick={() => {
                setTermo('');
                inputRef.current?.focus();
              }}
              className="text-slate-400 hover:text-slate-200 p-1 mr-2"
              aria-label="Limpar busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onFechar}
            className="px-2 py-0.5 text-xs font-mono bg-slate-800 text-slate-400 border border-slate-700 rounded hover:text-slate-200"
            aria-label="Fechar busca"
          >
            ESC
          </button>
        </div>

        {/* Lista de Resultados */}
        <div ref={listaRef} className="flex-1 overflow-y-auto p-2">
          {carregando && resultados.length === 0 && (
            <div className="py-8 text-center text-slate-400 text-sm">Buscando na base clínica...</div>
          )}

          {erro && (
            <div role="alert" className="m-2 p-3 flex items-start gap-2 bg-rose-950/50 border border-rose-700/60 rounded-xl text-xs text-rose-200">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Falha na busca: {erro}</span>
            </div>
          )}

          {!carregando && !erro && termo && resultados.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm">Nenhum registro encontrado para &ldquo;{termo}&rdquo;.</p>
              <p className="text-xs text-slate-500 mt-1">Verifique a ortografia ou consulte pela denominação genérica (DCB).</p>
            </div>
          )}

          {!termo && (
            <div className="p-4 text-xs text-slate-400 space-y-2">
              <div className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">Sugestões de consulta:</div>
              <div className="flex flex-wrap gap-2">
                {[
                  { termo: 'Amoxicilina', cor: 'text-teal-300' },
                  { termo: 'Dipirona', cor: 'text-teal-300' },
                  { termo: 'Noradrenalina', cor: 'text-teal-300' },
                  { termo: 'N39.0', rotulo: 'CID N39.0 (ITU)', cor: 'text-amber-300' },
                  { termo: 'Dengue', cor: 'text-indigo-300' },
                  { termo: 'Hipertensão', cor: 'text-indigo-300' },
                ].map((sugestao) => (
                  <button
                    key={sugestao.termo}
                    onClick={() => setTermo(sugestao.termo)}
                    className={`bg-slate-800 ${sugestao.cor} px-2 py-1 rounded hover:bg-slate-750`}
                  >
                    {sugestao.rotulo ?? sugestao.termo}
                  </button>
                ))}
              </div>
            </div>
          )}

          {resultados.map((item, idx) => {
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
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors group ${
                  ativo ? 'bg-slate-800/90 ring-1 ring-teal-600/40' : 'hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${estilo.icone}`}>
                    <Icone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-semibold text-slate-100 text-sm truncate">{item.titulo_primario}</span>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded uppercase tracking-wider border flex-shrink-0 ${estilo.selo}`}>
                        {ROTULO_TIPO[item.tipo_registro] ?? item.tipo_registro}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{item.subtitulo}</p>
                  </div>
                </div>
                <ArrowRight
                  className={`w-4 h-4 flex-shrink-0 ml-2 transition-all ${ativo ? 'text-teal-400 translate-x-0.5' : 'text-slate-500'}`}
                />
              </div>
            );
          })}
        </div>

        {/* Rodapé informativo */}
        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-500 flex justify-between items-center gap-3">
          <span>{resultados.length > 0 ? `${resultados.length} resultado(s)` : 'Busca local, sem acentos'}</span>
          <span className="hidden sm:inline">↑ ↓ para navegar &bull; Enter para abrir &bull; Esc para fechar</span>
        </div>
      </div>
    </div>
  );
};
