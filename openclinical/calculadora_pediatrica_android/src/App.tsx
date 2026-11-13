import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { PediatricCalculator } from '@openclinical/components/PediatricCalculator';
import { aplicarTema, obterTemaAtual, type TemaClinico } from '@openclinical/tema';

aplicarTema(obterTemaAtual());

export const App: React.FC = () => {
  const [tema, setTema] = useState<TemaClinico>(obterTemaAtual());

  const alternar = () => {
    const novo = tema === 'escuro' ? 'claro' : 'escuro';
    aplicarTema(novo);
    setTema(novo);
  };

  return (
    <main className="area-segura min-h-screen px-3 sm:px-6 max-w-3xl mx-auto space-y-4">
      <header className="flex items-center justify-between">
        <span className="text-sm font-bold text-slate-100">OpenClinical · Dose Pediátrica</span>
        <button
          type="button"
          onClick={alternar}
          aria-label={tema === 'escuro' ? 'Usar tema claro' : 'Usar tema escuro'}
          className="p-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300"
        >
          {tema === 'escuro' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </header>

      <PediatricCalculator permitirAdicionarReceita={false} />

      <p className="text-[11px] leading-snug text-slate-500 text-center px-2">
        Apoio à decisão clínica com base no Formulário Terapêutico Nacional (FTN 2010) e no catálogo CMED. Confira sempre a
        dose na bula e no protocolo vigente antes de prescrever.
      </p>
    </main>
  );
};
