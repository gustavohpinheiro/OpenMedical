import React, { useState } from 'react';
import { Calculator, Activity, Stethoscope, Droplet, HeartPulse } from 'lucide-react';
import { ResultadoTfg, ResultadoCurb65, ResultadoWells } from '../types';
import { executarCalculoClinico } from '../api';

export const ClinicalCalculators: React.FC = () => {
  const [calculadoraAtiva, setCalculadoraAtiva] = useState<'ckd_epi' | 'cockcroft' | 'curb65' | 'wells' | 'infusao'>('ckd_epi');

  // Estados: CKD-EPI
  const [creatinina, setCreatinina] = useState<number>(1.2);
  const [idade, setIdade] = useState<number>(55);
  const [sexoFeminino, setSexoFeminino] = useState<boolean>(false);
  const [resultadoTfg, setResultadoTfg] = useState<ResultadoTfg | null>(null);

  // Estados: Cockcroft
  const [pesoCockcroft, setPesoCockcroft] = useState<number>(70);
  const [resultadoCockcroft, setResultadoCockcroft] = useState<number | null>(null);

  // Estados: CURB-65
  const [confusao, setConfusao] = useState(false);
  const [ureia, setUreia] = useState(false);
  const [fr, setFr] = useState(false);
  const [hipotensao, setHipotensao] = useState(false);
  const [idade65, setIdade65] = useState(false);
  const [resultadoCurb, setResultadoCurb] = useState<ResultadoCurb65 | null>(null);

  // Estados: Wells TEP
  const [wellsTvp, setWellsTvp] = useState(false);
  const [wellsAlt, setWellsAlt] = useState(false);
  const [wellsFc, setWellsFc] = useState(false);
  const [wellsImob, setWellsImob] = useState(false);
  const [wellsHist, setWellsHist] = useState(false);
  const [wellsHemo, setWellsHemo] = useState(false);
  const [wellsMalign, setWellsMalign] = useState(false);
  const [resultadoWells, setResultadoWells] = useState<ResultadoWells | null>(null);

  // Estados: Vazão de Infusão
  const [doseInfusao, setDoseInfusao] = useState<number>(0.1); // mcg/kg/min
  const [pesoInfusao, setPesoInfusao] = useState<number>(70);
  const [concInfusao, setConcInfusao] = useState<number>(0.064); // mg/mL (16mg em 250mL)
  const [resultadoVazao, setResultadoVazao] = useState<number | null>(null);

  const calcularCkdEpi = async () => {
    try {
      const res = await executarCalculoClinico<ResultadoTfg>('ckd_epi_2021', {
        creatinina,
        idade,
        sexo_feminino: sexoFeminino,
      });
      setResultadoTfg(res);
    } catch (e) {
      console.error(e);
    }
  };

  const calcularCockcroft = async () => {
    try {
      const res = await executarCalculoClinico<{ clearance_creatinina_ml_min: number }>('cockcroft_gault', {
        creatinina,
        peso_kg: pesoCockcroft,
        idade,
        sexo_feminino: sexoFeminino,
      });
      setResultadoCockcroft(res.clearance_creatinina_ml_min);
    } catch (e) {
      console.error(e);
    }
  };

  const calcularCurb = async () => {
    try {
      const res = await executarCalculoClinico<ResultadoCurb65>('curb65', {
        confusao,
        ureia_maior_50: ureia,
        fr_maior_30: fr,
        hipotensao,
        idade_maior_65: idade65,
      });
      setResultadoCurb(res);
    } catch (e) {
      console.error(e);
    }
  };

  const calcularWells = async () => {
    try {
      const res = await executarCalculoClinico<ResultadoWells>('wells_tep', {
        sinais_clinicos_tvp: wellsTvp,
        diagnostico_alternativo_menos_provavel: wellsAlt,
        fc_maior_100: wellsFc,
        imobilizacao_ou_cirurgia_recente: wellsImob,
        historico_previo_tep_tvp: wellsHist,
        hemoptise: wellsHemo,
        malignidade_ativa: wellsMalign,
      });
      setResultadoWells(res);
    } catch (e) {
      console.error(e);
    }
  };

  const calcularInfusao = async () => {
    try {
      const res = await executarCalculoClinico<{ vazao_ml_h: number }>('vazao_infusao', {
        dose_mcg_kg_min: doseInfusao,
        peso_kg: pesoInfusao,
        concentracao_mg_ml: concInfusao,
      });
      setResultadoVazao(res.vazao_ml_h);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 space-y-6">
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
        <div className="p-2.5 bg-teal-500/10 text-teal-400 rounded-xl">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-100">Calculadoras Clínicas & Escores de Risco</h3>
          <p className="text-xs text-slate-400">Algoritmos determinísticos auditáveis sem uso de LLMs para suporte imediato ao médico</p>
        </div>
      </div>

      {/* Menu das Calculadoras */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'ckd_epi', label: 'CKD-EPI 2021 (TFG)', icon: Activity },
          { id: 'cockcroft', label: 'Cockcroft-Gault', icon: Activity },
          { id: 'curb65', label: 'CURB-65 (Pneumonia)', icon: Stethoscope },
          { id: 'wells', label: 'Wells (Suspeita TEP)', icon: HeartPulse },
          { id: 'infusao', label: 'Vazão de Infusão (Drogas Vasoativas)', icon: Droplet },
        ].map((item) => {
          const Icone = item.icon;
          const ativo = calculadoraAtiva === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCalculadoraAtiva(item.id as any)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                ativo
                  ? 'bg-teal-600 text-white border-teal-500 shadow-md shadow-teal-950/40'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <Icone className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. CKD-EPI 2021 */}
      {calculadoraAtiva === 'ckd_epi' && (
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Equação CKD-EPI 2021 (Sem viés racial - Padrão SBN / KDIGO)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Creatinina Sérica (mg/dL)</label>
              <input
                type="number"
                step="0.05"
                value={creatinina}
                onChange={(e) => setCreatinina(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Idade (anos)</label>
              <input
                type="number"
                min="18"
                max="125"
                value={idade}
                onChange={(e) => setIdade(parseInt(e.target.value, 10) || 18)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Sexo Biológico</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSexoFeminino(false)}
                  className={`flex-1 py-2 text-xs rounded-xl border font-bold ${!sexoFeminino ? 'bg-teal-600 border-teal-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                >
                  Masculino
                </button>
                <button
                  type="button"
                  onClick={() => setSexoFeminino(true)}
                  className={`flex-1 py-2 text-xs rounded-xl border font-bold ${sexoFeminino ? 'bg-teal-600 border-teal-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                >
                  Feminino
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={calcularCkdEpi}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow"
          >
            Calcular TFG Estimada
          </button>

          {resultadoTfg && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center space-y-1">
              <div className="text-3xl font-extrabold text-teal-400 font-mono">
                {resultadoTfg.taxa_filtracao_glomerular}{' '}
                <span className="text-sm text-slate-400">mL/min/1.73m²</span>
              </div>
              <div className="text-xs font-bold text-slate-200">{resultadoTfg.estagio_drc}</div>
              <p className="text-xs text-slate-400 pt-1">{resultadoTfg.recomendacao_geral}</p>
            </div>
          )}
        </div>
      )}

      {/* 2. Cockcroft-Gault */}
      {calculadoraAtiva === 'cockcroft' && (
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Clearance de Creatinina Estimado (Cockcroft-Gault 1976)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Creatinina (mg/dL)</label>
              <input
                type="number"
                step="0.05"
                value={creatinina}
                onChange={(e) => setCreatinina(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Peso (kg)</label>
              <input
                type="number"
                value={pesoCockcroft}
                onChange={(e) => setPesoCockcroft(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Idade (anos)</label>
              <input
                type="number"
                value={idade}
                onChange={(e) => setIdade(parseInt(e.target.value, 10) || 18)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Sexo</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSexoFeminino(false)}
                  className={`flex-1 py-2 text-xs rounded-xl border font-bold ${!sexoFeminino ? 'bg-teal-600 border-teal-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                >
                  M
                </button>
                <button
                  type="button"
                  onClick={() => setSexoFeminino(true)}
                  className={`flex-1 py-2 text-xs rounded-xl border font-bold ${sexoFeminino ? 'bg-teal-600 border-teal-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                >
                  F (0.85)
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={calcularCockcroft}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow"
          >
            Calcular Clearance Cockcroft-Gault
          </button>

          {resultadoCockcroft !== null && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-3xl font-extrabold text-teal-400 font-mono">
                {resultadoCockcroft.toFixed(2)} <span className="text-sm text-slate-400">mL/min</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Utilizado como referência clássica para ajustes de posologia em bula.</p>
            </div>
          )}
        </div>
      )}

      {/* 3. CURB-65 */}
      {calculadoraAtiva === 'curb65' && (
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Escore CURB-65 para Pneumonia Adquirida na Comunidade (PAC)
          </div>

          <div className="space-y-2 text-xs">
            {[
              { id: 'c', label: 'C - Confusão Mental aguda (AMTS <= 8 ou desorientação temporal/espacial)', valor: confusao, set: setConfusao },
              { id: 'u', label: 'U - Ureia sérica > 50 mg/dL (ou > 7 mmol/L / BUN > 19 mg/dL)', valor: ureia, set: setUreia },
              { id: 'r', label: 'R - Frequência Respiratória >= 30 incursões por minuto', valor: fr, set: setFr },
              { id: 'b', label: 'B - Pressão arterial Sistólica < 90 mmHg ou Diastólica <= 60 mmHg', valor: hipotensao, set: setHipotensao },
              { id: '65', label: '65 - Idade cronológica >= 65 anos', valor: idade65, set: setIdade65 },
            ].map((c) => (
              <label key={c.id} className="flex items-center space-x-3 p-2.5 bg-slate-900 border border-slate-800 rounded-xl cursor-pointer hover:bg-slate-850">
                <input
                  type="checkbox"
                  checked={c.valor}
                  onChange={(e) => c.set(e.target.checked)}
                  className="rounded text-teal-500 focus:ring-teal-500 w-4 h-4 bg-slate-800 border-slate-700"
                />
                <span className="text-slate-200">{c.label}</span>
              </label>
            ))}
          </div>

          <button
            onClick={calcularCurb}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow"
          >
            Avaliar CURB-65
          </button>

          {resultadoCurb && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center space-y-1">
              <div className="text-3xl font-extrabold text-amber-400 font-mono">
                {resultadoCurb.pontuacao} <span className="text-sm text-slate-400">pontos</span>
              </div>
              <div className="text-xs font-bold text-slate-200">{resultadoCurb.estrato_mortalidade}</div>
              <p className="text-xs text-slate-300 pt-1 font-medium">{resultadoCurb.recomendacao_local_tratamento}</p>
            </div>
          )}
        </div>
      )}

      {/* 4. Wells TEP */}
      {calculadoraAtiva === 'wells' && (
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Escore de Wells para Tromboembolismo Pulmonar (TEP)
          </div>

          <div className="space-y-2 text-xs">
            {[
              { label: 'Sinais ou sintomas clínicos de TVP (edema assimétrico, dor) (+3.0 pts)', valor: wellsTvp, set: setWellsTvp },
              { label: 'Diagnóstico alternativo é menos provável que TEP (+3.0 pts)', valor: wellsAlt, set: setWellsAlt },
              { label: 'Frequência Cardíaca > 100 bpm (+1.5 pts)', valor: wellsFc, set: setWellsFc },
              { label: 'Imobilização >= 3 dias ou cirurgia nas últimas 4 semanas (+1.5 pts)', valor: wellsImob, set: setWellsImob },
              { label: 'Histórico prévio documentado de TVP ou TEP (+1.5 pts)', valor: wellsHist, set: setWellsHist },
              { label: 'Hemoptise (+1.0 pt)', valor: wellsHemo, set: setWellsHemo },
              { label: 'Neoplasia maligna ativa ou tratada nos últimos 6 meses (+1.0 pt)', valor: wellsMalign, set: setWellsMalign },
            ].map((w, idx) => (
              <label key={idx} className="flex items-center space-x-3 p-2.5 bg-slate-900 border border-slate-800 rounded-xl cursor-pointer hover:bg-slate-850">
                <input
                  type="checkbox"
                  checked={w.valor}
                  onChange={(e) => w.set(e.target.checked)}
                  className="rounded text-teal-500 focus:ring-teal-500 w-4 h-4 bg-slate-800 border-slate-700"
                />
                <span className="text-slate-200">{w.label}</span>
              </label>
            ))}
          </div>

          <button
            onClick={calcularWells}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow"
          >
            Avaliar Probabilidade de Wells
          </button>

          {resultadoWells && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center space-y-1">
              <div className="text-3xl font-extrabold text-sky-400 font-mono">
                {resultadoWells.pontuacao_total.toFixed(1)} <span className="text-sm text-slate-400">pontos</span>
              </div>
              <div className="text-xs font-bold text-slate-200">{resultadoWells.categoria_risco} ({resultadoWells.probabilidade_clinica_percentual})</div>
              <p className="text-xs text-slate-300 pt-1">{resultadoWells.conduta_propedêutica}</p>
            </div>
          )}
        </div>
      )}

      {/* 5. Vazão de Infusão */}
      {calculadoraAtiva === 'infusao' && (
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Vazão de Infusão Contínua (Bomba de Infusão - mL/h)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Dose Alvo (mcg/kg/min)</label>
              <input
                type="number"
                step="0.01"
                value={doseInfusao}
                onChange={(e) => setDoseInfusao(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm"
              />
              <span className="text-[10px] text-slate-500">Ex: Noradrenalina 0.05 a 0.2</span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Peso do Paciente (kg)</label>
              <input
                type="number"
                value={pesoInfusao}
                onChange={(e) => setPesoInfusao(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Concentração da Solução (mg/mL)</label>
              <input
                type="number"
                step="0.001"
                value={concInfusao}
                onChange={(e) => setConcInfusao(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm"
              />
              <span className="text-[10px] text-slate-500">16mg em 250mL = 0.064 mg/mL</span>
            </div>
          </div>

          <button
            onClick={calcularInfusao}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow"
          >
            Calcular Vazão na Bomba (mL/h)
          </button>

          {resultadoVazao !== null && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-3xl font-extrabold text-teal-400 font-mono">
                {resultadoVazao.toFixed(2)} <span className="text-sm text-slate-400">mL/h</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Programar na bomba infusora volumétrica dedicada em acesso venoso central.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
