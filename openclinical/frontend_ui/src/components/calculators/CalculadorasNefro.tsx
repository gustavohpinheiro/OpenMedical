import React, { useState, useEffect, useMemo } from 'react';
import { Droplet, Activity, FlaskConical, Scale, Stethoscope } from 'lucide-react';
import {
  ResultadoGasometria,
  ResultadoCorrecaoSodio,
  ResultadoMetabolicoCad,
  ResultadoFenaFeureia,
  ResultadoTfg,
} from '../../types';
import { executarCalculoClinico } from '../../api';
import { CardCalculadora, ChipSegmentado } from './CalculadoraShared';
import { CATALOGO_CALCULADORAS } from './catalogo';

interface Props {
  calculadoraAtiva: string;
  isFavorito: (id: string) => boolean;
  onToggleFavorito: (id: string) => void;
  onNavegarCalculadora: (id: string) => void;
}

export const CalculadorasNefro: React.FC<Props> = ({
  calculadoraAtiva,
  isFavorito,
  onToggleFavorito,
  onNavegarCalculadora,
}) => {
  // 1. Gasometria
  const [gasoPh, setGasoPh] = useState<number>(7.25);
  const [gasoPaco2, setGasoPaco2] = useState<number>(28);
  const [gasoHco3, setGasoHco3] = useState<number>(12);
  const [gasoSodio, setGasoSodio] = useState<number>(140);
  const [gasoCloro, setGasoCloro] = useState<number>(100);
  const [gasoAlb, setGasoAlb] = useState<number>(3.0);
  const [gasoPao2, setGasoPao2] = useState<number>(85);
  const [gasoFio2, setGasoFio2] = useState<number>(0.21);
  const [resGaso, setResGaso] = useState<ResultadoGasometria | null>(null);

  useEffect(() => {
    if (calculadoraAtiva !== 'gasometria') return;
    executarCalculoClinico<ResultadoGasometria>('gasometria', {
      ph: gasoPh,
      paco2: gasoPaco2,
      hco3: gasoHco3,
      sodio: gasoSodio,
      cloro: gasoCloro,
      albumina: gasoAlb,
      pao2: gasoPao2,
      fio2_fracao: gasoFio2 > 1 ? gasoFio2 / 100 : gasoFio2,
    })
      .then(setResGaso)
      .catch(() => setResGaso(null));
  }, [calculadoraAtiva, gasoPh, gasoPaco2, gasoHco3, gasoSodio, gasoCloro, gasoAlb, gasoPao2, gasoFio2]);

  const textoProntuarioGaso = useMemo(() => {
    if (!resGaso) return '';
    return `[GASOMETRIA ARTERIAL COMPLETA]\npH: ${gasoPh} | PaCO2: ${gasoPaco2} mmHg | HCO3: ${gasoHco3} mEq/L | Na+: ${gasoSodio} | Cl-: ${gasoCloro} | Alb: ${gasoAlb} g/dL\n- Distúrbio Primário: ${resGaso.disturbio_primario}\n- Anion Gap Bruto: ${resGaso.anion_gap_bruto.toFixed(1)} | Corrigido p/ Albumina: ${resGaso.anion_gap_corrigido.toFixed(1)} mEq/L\n- Resposta Compensatória: ${resGaso.compensacao_respiratoria}\n- Relação PaO2/FiO2: ${resGaso.relacao_pafo2.toFixed(0)} (${resGaso.classificacao_oxigenacao_sdra})\nCondutas: ${resGaso.condutas_sugeridas.join('; ')}`;
  }, [resGaso, gasoPh, gasoPaco2, gasoHco3, gasoSodio, gasoCloro, gasoAlb]);

  // 2. Correção de Sódio
  const [naAtual, setNaAtual] = useState<number>(118);
  const [pesoNa, setPesoNa] = useState<number>(70);
  const [sexoFemNa, setSexoFemNa] = useState<boolean>(false);
  const [idosoNa, setIdosoNa] = useState<boolean>(false);
  const [solucaoNa, setSolucaoNa] = useState<number>(513);
  const [resNa, setResNa] = useState<ResultadoCorrecaoSodio | null>(null);

  useEffect(() => {
    if (calculadoraAtiva !== 'correcao_sodio') return;
    executarCalculoClinico<ResultadoCorrecaoSodio>('correcao_sodio', {
      sodio_atual: naAtual,
      peso_kg: pesoNa,
      sexo_feminino: sexoFemNa,
      idoso: idosoNa,
      solucao_meq_l: solucaoNa,
    })
      .then(setResNa)
      .catch(() => setResNa(null));
  }, [calculadoraAtiva, naAtual, pesoNa, sexoFemNa, idosoNa, solucaoNa]);

  const textoProntuarioNa = useMemo(() => {
    if (!resNa) return '';
    return `[CORREÇÃO DE SÓDIO (ADROGUÉ-MADIAS)]\nNa+ Inicial: ${naAtual} mEq/L | Peso: ${pesoNa} kg | Solução: ${solucaoNa} mEq/L\n- Água Corporal Total: ${resNa.agua_corporal_total_litros.toFixed(1)} L\n- Variação estimada por 1L da solução: ${resNa.variacao_sodio_1l.toFixed(2)} mEq/L\n- Volume seguro recomendado em 24h: ${resNa.volume_recomendado_24h_ml.toFixed(0)} mL (Vazão em BIC: ${resNa.vazao_bic_ml_h.toFixed(1)} mL/h)\nAlerta de Segurança: ${resNa.alerta_seguranca}`;
  }, [resNa, naAtual, pesoNa, solucaoNa]);

  // 3. CAD / Calemia
  const [sodioCad, setSodioCad] = useState<number>(130);
  const [glicemiaCad, setGlicemiaCad] = useState<number>(450);
  const [kCad, setKCad] = useState<number>(3.2);
  const [caCad, setCaCad] = useState<number>(8.0);
  const [albCad, setAlbCad] = useState<number>(3.0);
  const [resCad, setResCad] = useState<ResultadoMetabolicoCad | null>(null);

  useEffect(() => {
    if (calculadoraAtiva !== 'cad_calemia') return;
    executarCalculoClinico<ResultadoMetabolicoCad>('metabolico_cad', {
      sodio: sodioCad,
      glicemia_mg_dl: glicemiaCad,
      potassio: kCad,
      calcio_total: caCad,
      albumina: albCad,
    })
      .then(setResCad)
      .catch(() => setResCad(null));
  }, [calculadoraAtiva, sodioCad, glicemiaCad, kCad, caCad, albCad]);

  const textoProntuarioCad = useMemo(() => {
    if (!resCad) return '';
    return `[CAD / EHH - DISTÚRBIOS METABÓLICOS]\nNa+ Medido: ${sodioCad} mEq/L | Glicemia: ${glicemiaCad} mg/dL | K+: ${kCad} mEq/L | Ca Total: ${caCad} mg/dL | Albumina: ${albCad} g/dL\n- Sódio Corrigido Katz: ${resCad.sodio_corrigido_katz.toFixed(1)} mEq/L | Hillier: ${resCad.sodio_corrigido_hillier.toFixed(1)} mEq/L\n- Osmolaridade Efetiva: ${resCad.osmolaridade_efetiva_m_osm_kg.toFixed(1)} mOsm/kg (${resCad.classificacao_osmolaridade})\n- Cálcio Corrigido Payne: ${resCad.calcio_corrigido_payne.toFixed(2)} mg/dL\n- Protocolo de Insulina/K+: ${resCad.conduta_insulina_e_potassio}`;
  }, [resCad, sodioCad, glicemiaCad, kCad, caCad, albCad]);

  // 4. FENa & FEUreia
  const [naPlas, setNaPlas] = useState<number>(140);
  const [crPlas, setCrPlas] = useState<number>(2.5);
  const [urPlas, setUrPlas] = useState<number>(90);
  const [naUrin, setNaUrin] = useState<number>(15);
  const [crUrin, setCrUrin] = useState<number>(60);
  const [urUrin, setUrUrin] = useState<number>(1200);
  const [usaDiuretico, setUsaDiuretico] = useState<boolean>(false);
  const [resFena, setResFena] = useState<ResultadoFenaFeureia | null>(null);

  useEffect(() => {
    if (calculadoraAtiva !== 'fena_feureia') return;
    executarCalculoClinico<ResultadoFenaFeureia>('fena_feureia', {
      na_plasmatico: naPlas,
      cr_plasmatica: crPlas,
      ureia_plasmatica: urPlas,
      na_urinario: naUrin,
      cr_urinaria: crUrin,
      ureia_urinaria: urUrin || undefined,
      usa_diuretico: usaDiuretico,
    })
      .then(setResFena)
      .catch(() => setResFena(null));
  }, [calculadoraAtiva, naPlas, crPlas, urPlas, naUrin, crUrin, urUrin, usaDiuretico]);

  const textoProntuarioFena = useMemo(() => {
    if (!resFena) return '';
    return `[DIAGNÓSTICO DIFERENCIAL DE IRA - FENa & FEUreia]\nCr Plasmática: ${crPlas} | Na+ Plasmático: ${naPlas} | Uso de diurético: ${usaDiuretico ? 'SIM' : 'NÃO'}\n- FENa: ${resFena.fena_percentual !== undefined && resFena.fena_percentual !== null ? `${resFena.fena_percentual.toFixed(2)}%` : 'N/A'}\n- FEUreia: ${resFena.feureia_percentual !== undefined && resFena.feureia_percentual !== null ? `${resFena.feureia_percentual.toFixed(2)}%` : 'N/A'}\n- Diagnóstico Provável: ${resFena.diagnostico_provavel}\nInterpretação: ${resFena.interpretacao_clinica}`;
  }, [resFena, crPlas, naPlas, usaDiuretico]);

  // 5. CKD-EPI 2021
  const [crCkd, setCrCkd] = useState<number>(1.2);
  const [idadeCkd, setIdadeCkd] = useState<number>(55);
  const [sexoFemCkd, setSexoFemCkd] = useState<boolean>(false);
  const [resCkd, setResCkd] = useState<ResultadoTfg | null>(null);

  useEffect(() => {
    if (calculadoraAtiva !== 'ckd_epi') return;
    executarCalculoClinico<ResultadoTfg>('ckd_epi_2021', {
      creatinina: crCkd,
      idade: idadeCkd,
      sexo_feminino: sexoFemCkd,
    })
      .then(setResCkd)
      .catch(() => setResCkd(null));
  }, [calculadoraAtiva, crCkd, idadeCkd, sexoFemCkd]);

  const textoProntuarioCkd = useMemo(() => {
    if (!resCkd) return '';
    return `[TAXA DE FILTRAÇÃO GLOMERULAR - CKD-EPI 2021 (LIVRE DE RAÇA)]\nIdade: ${idadeCkd} anos | Sexo: ${sexoFemCkd ? 'Feminino' : 'Masculino'} | Creatinina: ${crCkd} mg/dL\n- TFG Estimada: ${resCkd.taxa_filtracao_glomerular.toFixed(1)} mL/min/1.73m²\n- Estágio DRC: ${resCkd.estagio_drc}\nConduta: ${resCkd.recomendacao_geral}`;
  }, [resCkd, idadeCkd, sexoFemCkd, crCkd]);

  // 6. Cockcroft-Gault
  const [crCock, setCrCock] = useState<number>(1.2);
  const [pesoCock, setPesoCock] = useState<number>(70);
  const [idadeCock, setIdadeCock] = useState<number>(55);
  const [sexoFemCock, setSexoFemCock] = useState<boolean>(false);
  const [resCock, setResCock] = useState<number | null>(null);

  useEffect(() => {
    if (calculadoraAtiva !== 'cockcroft') return;
    executarCalculoClinico<{ clearance_creatinina_ml_min: number }>('cockcroft_gault', {
      creatinina: crCock,
      peso_kg: pesoCock,
      idade: idadeCock,
      sexo_feminino: sexoFemCock,
    })
      .then((r) => setResCock(r.clearance_creatinina_ml_min))
      .catch(() => setResCock(null));
  }, [calculadoraAtiva, crCock, pesoCock, idadeCock, sexoFemCock]);

  const textoProntuarioCock = useMemo(() => {
    if (resCock === null) return '';
    return `[CLEARANCE DE CREATININA - COCKCROFT-GAULT (AJUSTE DE BULA)]\nIdade: ${idadeCock} anos | Peso: ${pesoCock} kg | Sexo: ${sexoFemCock ? 'Feminino' : 'Masculino'} | Creatinina: ${crCock} mg/dL\nClearance Estimado: ${resCock.toFixed(1)} mL/min\nUtilizado para checagem de faixas de ajuste posológico de medicamentos.`;
  }, [resCock, idadeCock, pesoCock, sexoFemCock, crCock]);

  const metaGaso = CATALOGO_CALCULADORAS.find((c) => c.id === 'gasometria')!;
  const metaNa = CATALOGO_CALCULADORAS.find((c) => c.id === 'correcao_sodio')!;
  const metaCad = CATALOGO_CALCULADORAS.find((c) => c.id === 'cad_calemia')!;
  const metaFena = CATALOGO_CALCULADORAS.find((c) => c.id === 'fena_feureia')!;
  const metaCkd = CATALOGO_CALCULADORAS.find((c) => c.id === 'ckd_epi')!;
  const metaCock = CATALOGO_CALCULADORAS.find((c) => c.id === 'cockcroft')!;

  return (
    <>
      {/* 1. GASOMETRIA */}
      {calculadoraAtiva === 'gasometria' && (
        <CardCalculadora
          meta={metaGaso}
          icone={Droplet}
          corDestaque="sky"
          isFavorito={isFavorito('gasometria')}
          onToggleFavorito={onToggleFavorito}
          onNavegarCalculadora={onNavegarCalculadora}
          textoProntuario={textoProntuarioGaso}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">pH</label>
              <input
                type="number"
                step="0.01"
                value={gasoPh}
                onChange={(e) => setGasoPh(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">PaCO2 (mmHg)</label>
              <input
                type="number"
                value={gasoPaco2}
                onChange={(e) => setGasoPaco2(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">HCO3 (mEq/L)</label>
              <input
                type="number"
                value={gasoHco3}
                onChange={(e) => setGasoHco3(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Sódio Na+ (mEq/L)</label>
              <input
                type="number"
                value={gasoSodio}
                onChange={(e) => setGasoSodio(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Cloro Cl- (mEq/L)</label>
              <input
                type="number"
                value={gasoCloro}
                onChange={(e) => setGasoCloro(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Albumina (g/dL)</label>
              <input
                type="number"
                step="0.1"
                value={gasoAlb}
                onChange={(e) => setGasoAlb(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">PaO2 (mmHg)</label>
              <input
                type="number"
                value={gasoPao2}
                onChange={(e) => setGasoPao2(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">FiO2 (ex: 0.21 ou 21)</label>
              <input
                type="number"
                step="0.01"
                value={gasoFio2}
                onChange={(e) => setGasoFio2(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
          </div>

          {resGaso && (
            <div className="space-y-3">
              <div className="p-4 bg-slate-900 border border-sky-500/20 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Distúrbio Primário</span>
                  <div className="text-xl font-bold text-sky-400">{resGaso.disturbio_primario}</div>
                  <div className="text-xs text-slate-300 mt-0.5">{resGaso.compensacao_respiratoria}</div>
                </div>
                <div className="text-right text-xs">
                  <div className="font-mono text-slate-300">
                    Anion Gap Corrigido: <strong>{resGaso.anion_gap_corrigido.toFixed(1)}</strong> mEq/L
                  </div>
                  <div className="font-mono text-slate-300 mt-1">
                    PaO2/FiO2: <strong>{resGaso.relacao_pafo2.toFixed(0)}</strong> ({resGaso.classificacao_oxigenacao_sdra})
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardCalculadora>
      )}

      {/* 2. CORREÇÃO DE SÓDIO */}
      {calculadoraAtiva === 'correcao_sodio' && (
        <CardCalculadora
          meta={metaNa}
          icone={Droplet}
          corDestaque="teal"
          isFavorito={isFavorito('correcao_sodio')}
          onToggleFavorito={onToggleFavorito}
          onNavegarCalculadora={onNavegarCalculadora}
          textoProntuario={textoProntuarioNa}
        >
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Sódio Atual (mEq/L)</label>
              <input
                type="number"
                value={naAtual}
                onChange={(e) => setNaAtual(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Peso (kg)</label>
              <input
                type="number"
                value={pesoNa}
                onChange={(e) => setPesoNa(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Perfil do Paciente</label>
              <div className="flex gap-2">
                <ChipSegmentado<boolean>
                  valor={sexoFemNa}
                  opcoes={[
                    { valor: false, rotulo: 'Homem' },
                    { valor: true, rotulo: 'Mulher' },
                  ]}
                  onChange={setSexoFemNa}
                  corAtiva="bg-teal-600"
                />
                <ChipSegmentado<boolean>
                  valor={idosoNa}
                  opcoes={[
                    { valor: false, rotulo: 'Jovem' },
                    { valor: true, rotulo: 'Idoso' },
                  ]}
                  onChange={setIdosoNa}
                  corAtiva="bg-teal-600"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Solução Utilizada</label>
              <select
                value={solucaoNa}
                onChange={(e) => setSolucaoNa(parseFloat(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
              >
                <option value={513}>NaCl 3% (513 mEq/L)</option>
                <option value={154}>SF 0.9% (154 mEq/L)</option>
                <option value={130}>Ringer Lactato (130 mEq/L)</option>
              </select>
            </div>
          </div>

          {resNa && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Variação por 1L</span>
                  <strong className="text-xl font-bold text-teal-400 font-mono">
                    +{resNa.variacao_sodio_1l.toFixed(2)} mEq/L
                  </strong>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Volume Recomendado 24h</span>
                  <strong className="text-xl font-bold text-white font-mono">
                    {resNa.volume_recomendado_24h_ml.toFixed(0)} mL
                  </strong>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Vazão Sugerida em BIC</span>
                  <strong className="text-xl font-bold text-teal-300 font-mono">
                    {resNa.vazao_bic_ml_h.toFixed(1)} mL/h
                  </strong>
                </div>
              </div>

              <div className="p-3 bg-rose-950/40 border border-rose-800/40 rounded-xl text-xs text-rose-200">
                <strong>Alerta de Segurança (Evitar Mielinólise Pontina):</strong> {resNa.alerta_seguranca}
              </div>
            </div>
          )}
        </CardCalculadora>
      )}

      {/* 3. CAD / CALEMIA */}
      {calculadoraAtiva === 'cad_calemia' && (
        <CardCalculadora
          meta={metaCad}
          icone={Activity}
          corDestaque="amber"
          isFavorito={isFavorito('cad_calemia')}
          onToggleFavorito={onToggleFavorito}
          onNavegarCalculadora={onNavegarCalculadora}
          textoProntuario={textoProntuarioCad}
        >
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Na+ Medido (mEq/L)</label>
              <input
                type="number"
                value={sodioCad}
                onChange={(e) => setSodioCad(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Glicemia (mg/dL)</label>
              <input
                type="number"
                value={glicemiaCad}
                onChange={(e) => setGlicemiaCad(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono text-amber-300"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Potássio K+ (mEq/L)</label>
              <input
                type="number"
                step="0.1"
                value={kCad}
                onChange={(e) => setKCad(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Cálcio Total (mg/dL)</label>
              <input
                type="number"
                step="0.1"
                value={caCad}
                onChange={(e) => setCaCad(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Albumina (g/dL)</label>
              <input
                type="number"
                step="0.1"
                value={albCad}
                onChange={(e) => setAlbCad(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
          </div>

          {resCad && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Na+ Corrigido Katz</span>
                  <strong className="text-xl font-bold text-amber-300 font-mono">
                    {resCad.sodio_corrigido_katz.toFixed(1)} mEq/L
                  </strong>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Na+ Corrigido Hillier</span>
                  <strong className="text-xl font-bold text-amber-300 font-mono">
                    {resCad.sodio_corrigido_hillier.toFixed(1)} mEq/L
                  </strong>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Osmolaridade Efetiva</span>
                  <strong className="text-xl font-bold text-sky-400 font-mono">
                    {resCad.osmolaridade_efetiva_m_osm_kg.toFixed(1)} mOsm/kg
                  </strong>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Cálcio Corrigido Payne</span>
                  <strong className="text-xl font-bold text-teal-400 font-mono">
                    {resCad.calcio_corrigido_payne.toFixed(2)} mg/dL
                  </strong>
                </div>
              </div>

              <div
                className={`p-3 rounded-xl border text-xs ${
                  resCad.alerta_critico_bloqueio_insulina
                    ? 'bg-rose-950/60 border-rose-700 text-rose-200'
                    : 'bg-slate-900 border-slate-800 text-slate-200'
                }`}
              >
                <strong>Protocolo de Insulina & Potássio:</strong> {resCad.conduta_insulina_e_potassio}
              </div>
            </div>
          )}
        </CardCalculadora>
      )}

      {/* 4. FENA & FEUREIA */}
      {calculadoraAtiva === 'fena_feureia' && (
        <CardCalculadora
          meta={metaFena}
          icone={FlaskConical}
          corDestaque="teal"
          isFavorito={isFavorito('fena_feureia')}
          onToggleFavorito={onToggleFavorito}
          onNavegarCalculadora={onNavegarCalculadora}
          textoProntuario={textoProntuarioFena}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Na+ Plasmático (mEq/L)</label>
              <input
                type="number"
                value={naPlas}
                onChange={(e) => setNaPlas(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Cr Plasmática (mg/dL)</label>
              <input
                type="number"
                step="0.1"
                value={crPlas}
                onChange={(e) => setCrPlas(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Ureia Plasmática (mg/dL)</label>
              <input
                type="number"
                value={urPlas}
                onChange={(e) => setUrPlas(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Na+ Urinário (mEq/L)</label>
              <input
                type="number"
                value={naUrin}
                onChange={(e) => setNaUrin(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Cr Urinária (mg/dL)</label>
              <input
                type="number"
                value={crUrin}
                onChange={(e) => setCrUrin(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Ureia Urinária (mg/dL)</label>
              <input
                type="number"
                value={urUrin}
                onChange={(e) => setUrUrin(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
          </div>

          <div className="flex gap-2 text-xs">
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={usaDiuretico} onChange={(e) => setUsaDiuretico(e.target.checked)} />
              <span>Paciente em uso recente de diurético de alça / tiazídico (Priorizar FEUreia)</span>
            </label>
          </div>

          {resFena && (
            <div className="p-4 bg-slate-900 border border-teal-500/20 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex gap-6">
                  {resFena.fena_percentual !== undefined && resFena.fena_percentual !== null && (
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">FENa</span>
                      <span className="text-2xl font-bold text-teal-400 font-mono">
                        {resFena.fena_percentual.toFixed(2)}%
                      </span>
                    </div>
                  )}
                  {resFena.feureia_percentual !== undefined && resFena.feureia_percentual !== null && (
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">FEUreia</span>
                      <span className="text-2xl font-bold text-sky-400 font-mono">
                        {resFena.feureia_percentual.toFixed(2)}%
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-100">{resFena.diagnostico_provavel}</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 border-t border-slate-800 pt-2">{resFena.interpretacao_clinica}</p>
            </div>
          )}
        </CardCalculadora>
      )}

      {/* 5. CKD-EPI 2021 */}
      {calculadoraAtiva === 'ckd_epi' && (
        <CardCalculadora
          meta={metaCkd}
          icone={Scale}
          corDestaque="teal"
          isFavorito={isFavorito('ckd_epi')}
          onToggleFavorito={onToggleFavorito}
          onNavegarCalculadora={onNavegarCalculadora}
          textoProntuario={textoProntuarioCkd}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Creatinina Sérica (mg/dL)</label>
              <input
                type="number"
                step="0.05"
                value={crCkd}
                onChange={(e) => setCrCkd(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Idade (anos)</label>
              <input
                type="number"
                value={idadeCkd}
                onChange={(e) => setIdadeCkd(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Sexo Biológico</label>
              <ChipSegmentado<boolean>
                valor={sexoFemCkd}
                opcoes={[
                  { valor: false, rotulo: 'Masculino' },
                  { valor: true, rotulo: 'Feminino' },
                ]}
                onChange={setSexoFemCkd}
                corAtiva="bg-teal-600"
              />
            </div>
          </div>

          {resCkd && (
            <div className="p-4 bg-slate-900 border border-teal-500/20 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">TFG Estimada (CKD-EPI)</span>
                <span className="text-3xl font-extrabold text-teal-400 font-mono">
                  {resCkd.taxa_filtracao_glomerular.toFixed(1)}
                </span>
                <span className="text-xs text-slate-400 ml-1">mL/min/1.73m²</span>
              </div>
              <div className="text-right text-xs">
                <div className="font-bold text-slate-200">Estágio: {resCkd.estagio_drc}</div>
                <div className="text-slate-400 mt-1">{resCkd.recomendacao_geral}</div>
              </div>
            </div>
          )}
        </CardCalculadora>
      )}

      {/* 6. COCKCROFT-GAULT */}
      {calculadoraAtiva === 'cockcroft' && (
        <CardCalculadora
          meta={metaCock}
          icone={Stethoscope}
          corDestaque="teal"
          isFavorito={isFavorito('cockcroft')}
          onToggleFavorito={onToggleFavorito}
          onNavegarCalculadora={onNavegarCalculadora}
          textoProntuario={textoProntuarioCock}
        >
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Creatinina (mg/dL)</label>
              <input
                type="number"
                step="0.05"
                value={crCock}
                onChange={(e) => setCrCock(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Peso Real (kg)</label>
              <input
                type="number"
                value={pesoCock}
                onChange={(e) => setPesoCock(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Idade (anos)</label>
              <input
                type="number"
                value={idadeCock}
                onChange={(e) => setIdadeCock(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Sexo Biológico</label>
              <ChipSegmentado<boolean>
                valor={sexoFemCock}
                opcoes={[
                  { valor: false, rotulo: 'Masc (x 1.0)' },
                  { valor: true, rotulo: 'Fem (x 0.85)' },
                ]}
                onChange={setSexoFemCock}
                corAtiva="bg-teal-600"
              />
            </div>
          </div>

          {resCock !== null && (
            <div className="p-4 bg-slate-900 border border-teal-500/20 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">Clearance de Creatinina</span>
              <span className="text-3xl font-extrabold text-teal-400 font-mono">{resCock.toFixed(1)}</span>
              <span className="text-xs text-slate-400 ml-1">mL/min</span>
              <div className="text-xs text-slate-400 mt-1">Utilizado para checagem de faixas de bula de medicamentos.</div>
            </div>
          )}
        </CardCalculadora>
      )}
    </>
  );
};
