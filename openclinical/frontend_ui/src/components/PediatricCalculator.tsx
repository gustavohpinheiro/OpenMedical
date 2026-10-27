import React, { useState, useEffect } from 'react';
import { Baby, AlertTriangle, ShieldCheck, Copy, Check, Calculator } from 'lucide-react';
import { ResultadoDosePediatrica } from '../types';
import { executarCalculoClinico } from '../api';

interface PediatricCalculatorProps {
  pesoInicial?: number;
  doseAlvoInicial?: number;
  concentracaoInicial?: number;
  fracionamentoInicial?: number;
  tetoMaximoInicial?: number | null;
  nomeMedicamento?: string;
}

export const PediatricCalculator: React.FC<PediatricCalculatorProps> = ({
  pesoInicial = 12.0,
  doseAlvoInicial = 50.0,
  concentracaoInicial = 50.0,
  fracionamentoInicial = 3,
  tetoMaximoInicial = 3000.0,
  nomeMedicamento = 'Amoxicilina 250mg/5mL',
}) => {
  const [peso, setPeso] = useState<number>(pesoInicial);
  const [doseAlvo, setDoseAlvo] = useState<number>(doseAlvoInicial);
  const [concentracao, setConcentracao] = useState<number>(concentracaoInicial);
  const [fracionamento, setFracionamento] = useState<number>(fracionamentoInicial);
  const [tetoMaximo, setTetoMaximo] = useState<number | null>(tetoMaximoInicial);
  const [resultado, setResultado] = useState<ResultadoDosePediatrica | null>(null);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (peso > 0 && doseAlvo > 0 && concentracao > 0 && fracionamento > 0) {
      executarCalculoClinico<ResultadoDosePediatrica>('dose_pediatrica', {
        peso_kg: peso,
        dose_alvo_mg_kg_dia: doseAlvo,
        concentracao_mg_ml: concentracao,
        fracionamento_diario: fracionamento,
        dose_maxima_diaria_mg: tetoMaximo,
      }).then(setResultado).catch(console.error);
    }
  }, [peso, doseAlvo, concentracao, fracionamento, tetoMaximo]);

  const copiarReceitaPediatrica = () => {
    if (!resultado) return;
    const texto = `${nomeMedicamento}
Dar ${resultado.volume_ml_por_tomada.toFixed(1)} mL (${resultado.numero_gotas_por_tomada} gotas) por via oral a cada ${resultado.intervalo_horas} horas.
(Dose por tomada: ${resultado.dose_por_tomada_mg.toFixed(1)} mg | Peso estimado: ${resultado.peso_kg} kg)`;

    navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-teal-500/10 text-teal-400 rounded-xl">
            <Baby className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Calculadora de Dose Pediátrica Líquida</h3>
            <p className="text-xs text-slate-400">Verificação automática de teto de segurança e cálculo de gotas (20 gotas/mL)</p>
          </div>
        </div>
        <div className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
          {nomeMedicamento}
        </div>
      </div>

      {/* Grid de Entradas Clínicas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Peso da Criança (kg)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.5"
              min="1"
              max="150"
              value={peso}
              onChange={(e) => setPeso(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm focus:border-teal-500 focus:outline-none"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">kg</span>
          </div>
          <div className="flex gap-1.5 mt-2">
            {[8, 12, 16, 20, 28].map((kg) => (
              <button
                key={kg}
                type="button"
                onClick={() => setPeso(kg)}
                className={`text-[11px] px-2 py-0.5 rounded border transition-colors ${
                  peso === kg ? 'bg-teal-600 border-teal-500 text-white font-medium' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                {kg}kg
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Dose Alvo (mg/kg/dia)
          </label>
          <div className="relative">
            <input
              type="number"
              step="1"
              value={doseAlvo}
              onChange={(e) => setDoseAlvo(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm focus:border-teal-500 focus:outline-none"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">mg/kg/d</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Concentração (mg/mL)
          </label>
          <div className="relative">
            <input
              type="number"
              step="1"
              value={concentracao}
              onChange={(e) => setConcentracao(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm focus:border-teal-500 focus:outline-none"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">mg/mL</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Fracionamento (Tomadas ao Dia)
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { tomadas: 4, label: '6/6 h (4x)' },
              { tomadas: 3, label: '8/8 h (3x)' },
              { tomadas: 2, label: '12/12 h (2x)' },
              { tomadas: 1, label: '24/24 h (1x)' },
            ].map((f) => (
              <button
                key={f.tomadas}
                type="button"
                onClick={() => setFracionamento(f.tomadas)}
                className={`py-2 px-1 text-center text-xs rounded-xl border transition-all ${
                  fracionamento === f.tomadas
                    ? 'bg-teal-600/90 border-teal-500 text-white font-bold shadow-md shadow-teal-900/40'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Teto Diário de Segurança (mg/dia)
          </label>
          <div className="relative">
            <input
              type="number"
              value={tetoMaximo ?? ''}
              onChange={(e) => setTetoMaximo(e.target.value ? parseFloat(e.target.value) : null)}
              placeholder="Opcional (ex: 3000 mg)"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm focus:border-teal-500 focus:outline-none"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">mg/dia</span>
          </div>
        </div>
      </div>

      {/* Alerta de Segurança se o Teto for Ultrapassado */}
      {resultado?.alerta_teto_ultrapassado && (
        <div className="bg-amber-950/60 border border-amber-600/60 rounded-xl p-4 flex items-start space-x-3 text-amber-200 animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-amber-300">Teto Máximo de Segurança Diário Excedido!</p>
            <p>{resultado.justificativa_seguranca}</p>
          </div>
        </div>
      )}

      {/* Painel de Resultados Formatados */}
      {resultado && (
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase font-medium">Volume p/ Tomada</span>
              <div className="text-2xl font-extrabold text-teal-400 mt-1">
                {resultado.volume_ml_por_tomada.toFixed(1)} <span className="text-sm text-slate-400">mL</span>
              </div>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase font-medium">Gotas p/ Tomada</span>
              <div className="text-2xl font-extrabold text-sky-400 mt-1">
                {resultado.numero_gotas_por_tomada} <span className="text-sm text-slate-400">gotas</span>
              </div>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase font-medium">Dose p/ Tomada</span>
              <div className="text-2xl font-extrabold text-slate-100 mt-1">
                {resultado.dose_por_tomada_mg.toFixed(1)} <span className="text-sm text-slate-400">mg</span>
              </div>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase font-medium">Intervalo</span>
              <div className="text-2xl font-extrabold text-indigo-400 mt-1">
                {resultado.intervalo_horas} <span className="text-sm text-slate-400">horas</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <div className="text-xs text-slate-400 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Dose diária efetiva: <strong className="text-slate-200">{resultado.dose_teto_aplicada_mg_dia.toFixed(1)} mg/dia</strong></span>
            </div>

            <button
              onClick={copiarReceitaPediatrica}
              className="flex items-center space-x-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-teal-900/30"
            >
              {copiado ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              <span>{copiado ? 'Copiado para o Prontuário!' : 'Copiar para Prontuário'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
