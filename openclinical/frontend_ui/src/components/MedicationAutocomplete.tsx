import React, { useState, useEffect, useRef, useId } from 'react';
import { Pill, AlertOctagon, Tag, ShieldAlert, Sparkles, Check } from 'lucide-react';
import { buscarSugestoesMedicamentos, type SugestaoMedicamento } from '../medication_autocomplete_service';

export interface MedicationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (sugestao: SugestaoMedicamento) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  modoAlergia?: boolean;
  className?: string;
  inputClassName?: string;
  required?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  id?: string;
}

export const MedicationAutocomplete: React.FC<MedicationAutocompleteProps> = ({
  value,
  onChange,
  onSelect,
  onKeyDown,
  placeholder,
  modoAlergia = false,
  className = '',
  inputClassName = '',
  required = false,
  autoFocus = false,
  disabled = false,
  id,
}) => {
  const [sugestoes, setSugestoes] = useState<SugestaoMedicamento[]>([]);
  const [aberto, setAberto] = useState(false);
  const [indiceAtivo, setIndiceAtivo] = useState(-1);
  const [carregando, setCarregando] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const defaultId = useId();
  const inputId = id || defaultId;

  // Carrega sugestões quando o valor ou o modo mudam
  useEffect(() => {
    let cancelado = false;

    // Se estiver em modoAlergia e input vazio, carrega classes principais
    if (!value.trim() && !modoAlergia) {
      setSugestoes([]);
      setIndiceAtivo(-1);
      return;
    }

    setCarregando(true);
    buscarSugestoesMedicamentos(value, { modoAlergia, limite: 14 })
      .then((resultados) => {
        if (!cancelado) {
          setSugestoes(resultados);
          setIndiceAtivo(-1);
          setCarregando(false);
        }
      })
      .catch((e) => {
        console.error('Erro no autocomplete de medicamentos:', e);
        if (!cancelado) setCarregando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [value, modoAlergia]);

  // Listener para fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickFora = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setAberto(false);
        setIndiceAtivo(-1);
      }
    };
    document.addEventListener('mousedown', handleClickFora);
    return () => document.removeEventListener('mousedown', handleClickFora);
  }, []);

  // Mantém o item ativo no scroll visível
  useEffect(() => {
    if (indiceAtivo >= 0 && itemRefs.current[indiceAtivo]) {
      itemRefs.current[indiceAtivo]?.scrollIntoView({ block: 'nearest' });
    }
  }, [indiceAtivo]);

  const handleSelect = (sugestao: SugestaoMedicamento) => {
    onChange(sugestao.nome);
    if (onSelect) {
      onSelect(sugestao);
    }
    setAberto(false);
    setIndiceAtivo(-1);
  };

  const handleKeyDownInternal = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (aberto && sugestoes.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setIndiceAtivo((prev) => (prev < sugestoes.length - 1 ? prev + 1 : 0));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setIndiceAtivo((prev) => (prev > 0 ? prev - 1 : sugestoes.length - 1));
        return;
      }
      if (e.key === 'Enter') {
        if (indiceAtivo >= 0 && sugestoes[indiceAtivo]) {
          e.preventDefault();
          handleSelect(sugestoes[indiceAtivo]);
          return;
        }
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setAberto(false);
        setIndiceAtivo(-1);
        return;
      }
    }

    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <input
        ref={inputRef}
        id={inputId}
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          if (!aberto) setAberto(true);
        }}
        onFocus={() => {
          setAberto(true);
        }}
        onKeyDown={handleKeyDownInternal}
        placeholder={placeholder}
        required={required}
        autoFocus={autoFocus}
        disabled={disabled}
        autoComplete="off"
        className={inputClassName}
      />

      {/* Dropdown com as sugestões */}
      {aberto && (sugestoes.length > 0 || (modoAlergia && !value.trim())) && (
        <div
          className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto animate-in fade-in-50 duration-150"
          style={{ minWidth: '300px' }}
        >
          {/* Cabeçalho do menu de sugestões */}
          <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950/70 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              {modoAlergia ? (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                  <span>Classes Alérgicas & Medicamentos Oficiais</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-teal-500" />
                  <span>Base FTN / RENAME & Nomes Comerciais</span>
                </>
              )}
            </span>
            <span className="text-[10px] text-slate-400">↑↓ navegar · Enter seleciona</span>
          </div>

          <div className="p-1 space-y-0.5">
            {sugestoes.map((sugestao, idx) => {
              const selecionado = idx === indiceAtivo;
              const isAlergia = sugestao.tipo === 'classe_alergica';
              const isPrincipio = sugestao.tipo === 'principio_ativo';
              const isComercial = sugestao.tipo === 'comercial';

              return (
                <button
                  key={sugestao.id || `${sugestao.nome}_${idx}`}
                  ref={(el) => {
                    itemRefs.current[idx] = el;
                  }}
                  type="button"
                  onMouseDown={(e) => {
                    // Evita perder foco antes de registrar clique
                    e.preventDefault();
                    handleSelect(sugestao);
                  }}
                  onMouseEnter={() => setIndiceAtivo(idx)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-start gap-2.5 ${
                    selecionado
                      ? 'bg-teal-50 dark:bg-teal-950/40 text-slate-900 dark:text-slate-100'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {/* Ícone por tipo */}
                  <div className="pt-0.5 flex-shrink-0">
                    {isAlergia && (
                      <div className="p-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-md">
                        <AlertOctagon className="w-3.5 h-3.5" />
                      </div>
                    )}
                    {isPrincipio && (
                      <div className="p-1 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-md">
                        <Pill className="w-3.5 h-3.5" />
                      </div>
                    )}
                    {isComercial && (
                      <div className="p-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md">
                        <Tag className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  {/* Detalhes do item */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 dark:text-slate-100 truncate">
                        {sugestao.nome}
                      </span>

                      {/* Tag de tipo */}
                      {isAlergia && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30 rounded">
                          Classe Alérgica
                        </span>
                      )}
                      {isPrincipio && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/30 rounded">
                          Princípio Ativo (FTN)
                        </span>
                      )}
                      {isComercial && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/30 rounded">
                          Comercial
                        </span>
                      )}

                      {/* Tag regulatória */}
                      {sugestao.detalhes?.tipo_receituario === 'controle_especial_c1' && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/40 rounded">
                          Port. 344 (C1)
                        </span>
                      )}
                      {sugestao.detalhes?.tipo_receituario === 'antimicrobiano' && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/40 rounded">
                          RDC 20 (ATB)
                        </span>
                      )}
                      {sugestao.detalhes?.tipo_receituario === 'notificacao_b_azul' && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 bg-sky-500/15 text-sky-700 dark:text-sky-400 border border-sky-500/40 rounded">
                          Notif. B (Azul)
                        </span>
                      )}
                    </div>

                    {sugestao.subtitulo && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {sugestao.subtitulo}
                      </p>
                    )}
                  </div>

                  {selecionado && (
                    <div className="pt-1 flex-shrink-0 text-teal-600 dark:text-teal-400">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
