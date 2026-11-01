import React, { useState, useMemo, useEffect } from 'react';
import {
  Calculator,
  Search,
  Star,
  X,
  Flame,
  Activity,
  Wind,
  Droplet,
  Brain,
  GitCommit,
  Scissors,
} from 'lucide-react';
import {
  CATALOGO_CALCULADORAS,
  CATEGORIAS_CALCULADORAS,
  CategoriaCalculadora,
  MetaCalculadora,
} from './calculators/catalogo';
import { CalculadorasSalaVermelha } from './calculators/CalculadorasSalaVermelha';
import { CalculadorasCardio } from './calculators/CalculadorasCardio';
import { CalculadorasPneumo } from './calculators/CalculadorasPneumo';
import { CalculadorasNefro } from './calculators/CalculadorasNefro';
import { CalculadorasNeuro } from './calculators/CalculadorasNeuro';
import { CalculadorasGastroCirurgia } from './calculators/CalculadorasGastroCirurgia';

const STORAGE_FAVORITOS_KEY = 'openclinical_fav_calcs';
const FAVORITOS_PADRAO = ['sri', 'dengue_ms', 'heart_score', 'gasometria', 'trombolise_avc', 'wells_tep'];

export const ClinicalCalculators: React.FC = () => {
  const [calculadoraAtiva, setCalculadoraAtiva] = useState<string>('sri');
  const [categoriaAtiva, setCategoriaAtiva] = useState<CategoriaCalculadora>('todos');
  const [busca, setBusca] = useState<string>('');

  // Gerenciamento de Favoritos via localStorage
  const [favoritos, setFavoritos] = useState<string[]>(() => {
    try {
      const salvo = localStorage.getItem(STORAGE_FAVORITOS_KEY);
      if (salvo) {
        const parsed = JSON.parse(salvo);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignorar erro de leitura do localStorage
    }
    return FAVORITOS_PADRAO;
  });

  const toggleFavorito = (id: string) => {
    setFavoritos((prev) => {
      const novo = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem(STORAGE_FAVORITOS_KEY, JSON.stringify(novo));
      } catch {
        // Ignorar erro de gravação
      }
      return novo;
    });
  };

  const isFavorito = (id: string) => favoritos.includes(id);

  // Filtragem Dinâmica
  const calculadorasFiltradas = useMemo(() => {
    let lista = CATALOGO_CALCULADORAS;

    if (categoriaAtiva === 'favoritos') {
      lista = lista.filter((c) => favoritos.includes(c.id));
    } else if (categoriaAtiva !== 'todos') {
      lista = lista.filter((c) => c.categoria === categoriaAtiva);
    }

    if (busca.trim()) {
      const termo = busca.toLowerCase().trim();
      lista = lista.filter(
        (c) =>
          c.nome.toLowerCase().includes(termo) ||
          c.sigla.toLowerCase().includes(termo) ||
          c.id.toLowerCase().includes(termo) ||
          c.descricao.toLowerCase().includes(termo) ||
          c.tags.some((t) => t.toLowerCase().includes(termo))
      );
    }

    return lista;
  }, [categoriaAtiva, busca, favoritos]);

  // Se a calculadora ativa não estiver na lista filtrada e houver resultados, selecionar a primeira
  useEffect(() => {
    if (calculadorasFiltradas.length > 0) {
      const ativaPresente = calculadorasFiltradas.some((c) => c.id === calculadoraAtiva);
      if (!ativaPresente && busca.trim()) {
        setCalculadoraAtiva(calculadorasFiltradas[0].id);
      }
    }
  }, [calculadorasFiltradas, calculadoraAtiva, busca]);

  const metaAtiva = useMemo(
    () => CATALOGO_CALCULADORAS.find((c) => c.id === calculadoraAtiva) || CATALOGO_CALCULADORAS[0],
    [calculadoraAtiva]
  );

  const getCategoriaIcon = (cat: CategoriaCalculadora) => {
    switch (cat) {
      case 'sala_vermelha':
        return <Flame className="w-3.5 h-3.5 text-rose-400" />;
      case 'cardio':
        return <Activity className="w-3.5 h-3.5 text-emerald-400" />;
      case 'pneumo_tev':
        return <Wind className="w-3.5 h-3.5 text-sky-400" />;
      case 'nefro_gaso':
        return <Droplet className="w-3.5 h-3.5 text-teal-400" />;
      case 'neuro':
        return <Brain className="w-3.5 h-3.5 text-purple-400" />;
      case 'gastro_hepato':
        return <GitCommit className="w-3.5 h-3.5 text-amber-400" />;
      case 'cirurgia_aps':
        return <Scissors className="w-3.5 h-3.5 text-indigo-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-6">
      {/* 1. Header do Command Hub */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-100">
                Command Hub &bull; Calculadoras Clínicas (36 Módulos)
              </h3>
              <span className="hidden sm:inline-block px-2 py-0.5 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-full text-[10px] font-bold">
                OpenClinical 2.1
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Fricção zero no plantão: recálculo reativo instantâneo e cópia direta estruturada para o prontuário.
            </p>
          </div>
        </div>

        {/* Barra de Busca Rápida */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome, sigla, sintoma ou cálculo..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 focus:border-teal-500 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-100 placeholder-slate-500 transition focus:outline-none"
          />
          {busca && (
            <button
              type="button"
              onClick={() => setBusca('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Pílulas de Categoria Superior */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950/70 rounded-xl border border-slate-800 text-xs font-semibold overflow-x-auto">
        {CATEGORIAS_CALCULADORAS.map((cat) => {
          const ativo = categoriaAtiva === cat.id;
          const contagem =
            cat.id === 'favoritos'
              ? favoritos.length
              : cat.id === 'todos'
              ? CATALOGO_CALCULADORAS.length
              : CATALOGO_CALCULADORAS.filter((c) => c.categoria === cat.id).length;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoriaAtiva(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                ativo
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {cat.id === 'favoritos' ? <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> : null}
              <span>{cat.rotulo}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  ativo ? 'bg-black/20 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {contagem}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Seletor Rápido de Calculadoras da Categoria Selecionada */}
      <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
        {calculadorasFiltradas.length > 0 ? (
          calculadorasFiltradas.map((calc: MetaCalculadora) => {
            const ativa = calculadoraAtiva === calc.id;
            const fav = isFavorito(calc.id);

            return (
              <button
                key={calc.id}
                type="button"
                onClick={() => setCalculadoraAtiva(calc.id)}
                className={`group flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-left ${
                  ativa
                    ? 'bg-slate-800 border-teal-500 text-white shadow ring-1 ring-teal-500/40'
                    : 'bg-slate-950/60 border-slate-800/90 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 hover:border-slate-700'
                }`}
              >
                {getCategoriaIcon(calc.categoria)}
                <span className="truncate max-w-[190px]">{calc.sigla}</span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorito(calc.id);
                  }}
                  className={`p-0.5 rounded transition ${
                    fav ? 'text-amber-400' : 'text-slate-600 group-hover:text-slate-400'
                  }`}
                  title={fav ? 'Remover dos favoritos' : 'Favoritar'}
                >
                  <Star className={`w-3 h-3 ${fav ? 'fill-amber-400' : ''}`} />
                </span>
              </button>
            );
          })
        ) : (
          <div className="w-full p-4 bg-slate-950/40 border border-slate-800/80 rounded-xl text-center text-xs text-slate-400">
            Nenhuma calculadora encontrada para &ldquo;{busca}&rdquo;. Tente buscar por outros termos como{' '}
            <button
              type="button"
              onClick={() => setBusca('dengue')}
              className="text-teal-400 underline hover:text-teal-300"
            >
              dengue
            </button>
            ,{' '}
            <button
              type="button"
              onClick={() => setBusca('glasgow')}
              className="text-teal-400 underline hover:text-teal-300"
            >
              glasgow
            </button>
            ,{' '}
            <button
              type="button"
              onClick={() => setBusca('heart')}
              className="text-teal-400 underline hover:text-teal-300"
            >
              heart
            </button>{' '}
            ou limpe a busca.
          </div>
        )}
      </div>

      {/* 4. Renderizador do Módulo da Calculadora Ativa */}
      <div className="pt-2">
        {metaAtiva.categoria === 'sala_vermelha' && (
          <CalculadorasSalaVermelha
            calculadoraAtiva={calculadoraAtiva}
            isFavorito={isFavorito}
            onToggleFavorito={toggleFavorito}
            onNavegarCalculadora={setCalculadoraAtiva}
          />
        )}
        {metaAtiva.categoria === 'cardio' && (
          <CalculadorasCardio
            calculadoraAtiva={calculadoraAtiva}
            isFavorito={isFavorito}
            onToggleFavorito={toggleFavorito}
            onNavegarCalculadora={setCalculadoraAtiva}
          />
        )}
        {metaAtiva.categoria === 'pneumo_tev' && (
          <CalculadorasPneumo
            calculadoraAtiva={calculadoraAtiva}
            isFavorito={isFavorito}
            onToggleFavorito={toggleFavorito}
            onNavegarCalculadora={setCalculadoraAtiva}
          />
        )}
        {metaAtiva.categoria === 'nefro_gaso' && (
          <CalculadorasNefro
            calculadoraAtiva={calculadoraAtiva}
            isFavorito={isFavorito}
            onToggleFavorito={toggleFavorito}
            onNavegarCalculadora={setCalculadoraAtiva}
          />
        )}
        {metaAtiva.categoria === 'neuro' && (
          <CalculadorasNeuro
            calculadoraAtiva={calculadoraAtiva}
            isFavorito={isFavorito}
            onToggleFavorito={toggleFavorito}
            onNavegarCalculadora={setCalculadoraAtiva}
          />
        )}
        {(metaAtiva.categoria === 'gastro_hepato' || metaAtiva.categoria === 'cirurgia_aps') && (
          <CalculadorasGastroCirurgia
            calculadoraAtiva={calculadoraAtiva}
            isFavorito={isFavorito}
            onToggleFavorito={toggleFavorito}
            onNavegarCalculadora={setCalculadoraAtiva}
          />
        )}
      </div>
    </div>
  );
};
