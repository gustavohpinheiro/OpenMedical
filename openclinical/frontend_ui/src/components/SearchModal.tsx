import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Pill, Stethoscope, BookOpen, ArrowRight } from 'lucide-react';
import { ItemBuscaFts } from '../types';
import { buscarGeral } from '../api';

interface SearchModalProps {
  aberto: boolean;
  onFechar: () => void;
  onSelecionarMedicamento: (id: number) => void;
  onSelecionarProtocolo: (id: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  aberto,
  onFechar,
  onSelecionarMedicamento,
  onSelecionarProtocolo,
}) => {
  const [termo, setTermo] = useState('');
  const [resultados, setResultados] = useState<ItemBuscaFts[]>([]);
  const [carregando, setCarregando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (aberto) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setTermo('');
      setResultados([]);
    }
  }, [aberto]);

  useEffect(() => {
    if (!termo.trim()) {
      setResultados([]);
      return;
    }

    const timer = setTimeout(async () => {
      setCarregando(true);
      try {
        const dados = await buscarGeral(termo);
        setResultados(dados);
      } finally {
        setCarregando(false);
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [termo]);

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Barra de entrada de busca */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-850">
          <Search className="w-5 h-5 text-teal-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            placeholder="Buscar por fármaco, marca comercial, CID-10, CIAP-2 ou conduta..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-base focus:outline-none"
          />
          {termo && (
            <button
              onClick={() => setTermo('')}
              className="text-slate-400 hover:text-slate-200 p-1 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-mono bg-slate-800 text-slate-400 border border-slate-700 rounded">
            ESC
          </kbd>
        </div>

        {/* Lista de Resultados */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-800/60">
          {carregando && (
            <div className="py-8 text-center text-slate-400 text-sm">
              <span className="inline-block animate-spin mr-2">⏳</span> Buscando na base clínica...
            </div>
          )}

          {!carregando && termo && resultados.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm">Nenhum registro encontrado para &ldquo;{termo}&rdquo;.</p>
              <p className="text-xs text-slate-500 mt-1">Verifique a ortografia ou consulte pela denominação genérica (DCB).</p>
            </div>
          )}

          {!carregando && !termo && (
            <div className="p-4 text-xs text-slate-400 space-y-2">
              <div className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">Dicas Rápidas de Consulta:</div>
              <div className="flex flex-wrap gap-2">
                <span className="bg-slate-800 text-teal-300 px-2 py-1 rounded cursor-pointer hover:bg-slate-750" onClick={() => setTermo('Amoxicilina')}>Amoxicilina</span>
                <span className="bg-slate-800 text-teal-300 px-2 py-1 rounded cursor-pointer hover:bg-slate-750" onClick={() => setTermo('Dipirona')}>Dipirona</span>
                <span className="bg-slate-800 text-teal-300 px-2 py-1 rounded cursor-pointer hover:bg-slate-750" onClick={() => setTermo('Noradrenalina')}>Noradrenalina</span>
                <span className="bg-slate-800 text-amber-300 px-2 py-1 rounded cursor-pointer hover:bg-slate-750" onClick={() => setTermo('N39.0')}>CID N39.0 (ITU)</span>
                <span className="bg-slate-800 text-indigo-300 px-2 py-1 rounded cursor-pointer hover:bg-slate-750" onClick={() => setTermo('Dengue')}>Dengue MS</span>
              </div>
            </div>
          )}

          {resultados.map((item, idx) => (
            <div
              key={`${item.tipo_registro}-${item.id_referencia}-${idx}`}
              onClick={() => {
                if (item.tipo_registro === 'medicamento') {
                  onSelecionarMedicamento(Number(item.id_referencia));
                } else if (item.tipo_registro === 'protocolo') {
                  const chaveProtocolo = isNaN(Number(item.id_referencia))
                    ? String(item.id_referencia)
                    : item.titulo_primario;
                  onSelecionarProtocolo(chaveProtocolo);
                }
                onFechar();
              }}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/80 cursor-pointer transition-colors group"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className={`p-2 rounded-lg flex-shrink-0 ${
                  item.tipo_registro === 'medicamento' ? 'bg-teal-500/10 text-teal-400' :
                  item.tipo_registro === 'diagnostico' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-indigo-500/10 text-indigo-400'
                }`}>
                  {item.tipo_registro === 'medicamento' && <Pill className="w-4 h-4" />}
                  {item.tipo_registro === 'diagnostico' && <Stethoscope className="w-4 h-4" />}
                  {item.tipo_registro === 'protocolo' && <BookOpen className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-100 text-sm truncate">{item.titulo_primario}</span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      item.tipo_registro === 'medicamento' ? 'bg-teal-900/60 text-teal-300 border border-teal-700/50' :
                      item.tipo_registro === 'diagnostico' ? 'bg-amber-900/60 text-amber-300 border border-amber-700/50' :
                      'bg-indigo-900/60 text-indigo-300 border border-indigo-700/50'
                    }`}>
                      {item.tipo_registro}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{item.subtitulo}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
            </div>
          ))}
        </div>

        {/* Rodapé informativo */}
        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-500 flex justify-between items-center">
          <span>Banco Local FTS5 &bull; Busca em tempo real offline</span>
          <span>Navegue com setas &bull; Pressione Enter para selecionar</span>
        </div>
      </div>
    </div>
  );
};
