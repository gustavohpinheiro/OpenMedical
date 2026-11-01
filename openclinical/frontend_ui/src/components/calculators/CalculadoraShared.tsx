import React, { useState } from 'react';
import { Star, Copy, Check, ArrowRight, LucideIcon, Plus } from 'lucide-react';
import { adicionarItemPrescricaoModular } from '../../storage_clinico';
import { MetaCalculadora } from './catalogo';

interface CardCalculadoraProps {
  meta: MetaCalculadora;
  icone: LucideIcon;
  corDestaque?: string; // ex: 'rose', 'teal', 'sky', 'amber', 'emerald', 'purple'
  isFavorito: boolean;
  onToggleFavorito: (id: string) => void;
  onNavegarCalculadora: (id: string) => void;
  textoProntuario: string;
  children: React.ReactNode;
}

export const CardCalculadora: React.FC<CardCalculadoraProps> = ({
  meta,
  icone: Icone,
  corDestaque = 'teal',
  isFavorito,
  onToggleFavorito,
  onNavegarCalculadora,
  textoProntuario,
  children,
}) => {
  const [copiado, setCopiado] = useState(false);
  const [adicionadoReceita, setAdicionadoReceita] = useState(false);

  const adicionarReceita = () => {
    if (!textoProntuario) return;
    adicionarItemPrescricaoModular(
      'orientacao',
      `Escore: ${meta.nome}`,
      textoProntuario,
      undefined,
      'Calculadora Clínica OpenClinical',
      ['Calculadora', meta.sigla]
    );
    setAdicionadoReceita(true);
    setTimeout(() => setAdicionadoReceita(false), 2200);
  };

  const copiarProntuario = async () => {
    try {
      await navigator.clipboard.writeText(textoProntuario);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2200);
    } catch {
      // Falha silenciosa de permissão de clipboard
    }
  };

  const getCorClasses = () => {
    switch (corDestaque) {
      case 'rose':
        return { badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20', icone: 'text-rose-400' };
      case 'sky':
        return { badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20', icone: 'text-sky-400' };
      case 'amber':
        return { badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icone: 'text-amber-400' };
      case 'emerald':
        return { badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icone: 'text-emerald-400' };
      case 'purple':
        return { badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icone: 'text-purple-400' };
      case 'indigo':
        return { badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', icone: 'text-indigo-400' };
      default:
        return { badge: 'bg-teal-500/10 text-teal-400 border-teal-500/20', icone: 'text-teal-400' };
    }
  };

  const cores = getCorClasses();

  return (
    <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-5 transition-all shadow-lg">
      {/* Cabeçalho da Calculadora */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${cores.badge}`}>
            <Icone className={`w-5 h-5 ${cores.icone}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-bold text-slate-100">{meta.nome}</h4>
              <button
                type="button"
                onClick={() => onToggleFavorito(meta.id)}
                title={isFavorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                className={`p-1 rounded-md transition-colors ${
                  isFavorito ? 'text-amber-400 hover:text-amber-300' : 'text-slate-600 hover:text-slate-400'
                }`}
              >
                <Star className={`w-4 h-4 ${isFavorito ? 'fill-amber-400' : ''}`} />
              </button>
            </div>
            <p className="text-xs text-slate-400">{meta.descricao}</p>
          </div>
        </div>

        {/* Botões de Ação: Adicionar à Receita e Copiar */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={adicionarReceita}
            disabled={!textoProntuario}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-sm transition disabled:opacity-40"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{adicionadoReceita ? 'Na Receita ✓' : 'Adicionar à Receita'}</span>
          </button>
          <button
            type="button"
            onClick={copiarProntuario}
            disabled={!textoProntuario}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition shadow-sm ${
              copiado
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 hover:border-slate-600'
            }`}
          >
            {copiado ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-teal-400" />}
            <span>{copiado ? 'Copiado!' : 'Copiar'}</span>
          </button>
        </div>
      </div>

      {/* Conteúdo Interativo da Calculadora */}
      {children}

      {/* Pontes Clínicas Pareadas */}
      {meta.pontesClinicas && meta.pontesClinicas.length > 0 && (
        <div className="border-t border-slate-800/80 pt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
            Pontes Clínicas Relacionadas:
          </span>
          {meta.pontesClinicas.map((ponte) => (
            <button
              key={ponte.id}
              type="button"
              onClick={() => onNavegarCalculadora(ponte.id)}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-teal-300 border border-slate-800 hover:border-teal-500/30 rounded-lg transition text-[11px]"
            >
              <span>{ponte.rotulo}</span>
              <ArrowRight className="w-3 h-3 text-slate-500" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface ChipSegmentadoProps<T> {
  valor: T;
  opcoes: { valor: T; rotulo: string; pontos?: string }[];
  onChange: (novoValor: T) => void;
  corAtiva?: string;
}

export function ChipSegmentado<T extends string | number | boolean>({
  valor,
  opcoes,
  onChange,
  corAtiva = 'bg-teal-600',
}: ChipSegmentadoProps<T>) {
  return (
    <div className="flex flex-wrap gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
      {opcoes.map((op, idx) => {
        const ativo = valor === op.valor;
        return (
          <button
            key={idx}
            type="button"
            onClick={() => onChange(op.valor)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all font-medium ${
              ativo ? `${corAtiva} text-white shadow` : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span>{op.rotulo}</span>
            {op.pontos && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  ativo ? 'bg-black/20 text-white font-bold' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {op.pontos}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
