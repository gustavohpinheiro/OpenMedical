import React, { useState } from 'react';
import {
  Calculator,
  Activity,
  Stethoscope,
  Droplet,
  HeartPulse,
  Wind,
  Flame,
  Baby,
  RefreshCw,
} from 'lucide-react';
import {
  ResultadoTfg,
  ResultadoCurb65,
  ResultadoWells,
  ResultadoIntubacaoSri,
  ResultadoEmergenciaPediatrica,
  ResultadoGasometria,
  ResultadoCorrecaoSodio,
  ResultadoCha2ds2Va,
  ResultadoQsofa,
} from '../types';
import { executarCalculoClinico } from '../api';

const DROGAS_VASOATIVAS_PRESET = [
  { nome: 'Noradrenalina (Padrão)', dosePadrao: 0.1, concPadrao: 0.064, desc: '16 mg em 250 mL SG 5% (0.064 mg/mL)' },
  { nome: 'Noradrenalina (Concentrada 4x)', dosePadrao: 0.1, concPadrao: 0.256, desc: '64 mg em 250 mL SG 5% (0.256 mg/mL)' },
  { nome: 'Adrenalina', dosePadrao: 0.05, concPadrao: 0.04, desc: '10 mg em 250 mL SG 5% (0.04 mg/mL)' },
  { nome: 'Dobutamina', dosePadrao: 5.0, concPadrao: 1.0, desc: '250 mg em 250 mL SG 5% (1.0 mg/mL)' },
  { nome: 'Dopamina', dosePadrao: 5.0, concPadrao: 1.0, desc: '250 mg em 250 mL SG 5% (1.0 mg/mL)' },
  { nome: 'Nitroprussiato de Sódio', dosePadrao: 0.5, concPadrao: 0.2, desc: '50 mg em 250 mL SG 5% (0.2 mg/mL - Fotoprotetor)' },
  { nome: 'Nitroglicerina', dosePadrao: 0.3, concPadrao: 0.2, desc: '50 mg em 250 mL SF 0.9% (0.2 mg/mL)' },
  { nome: 'Fentanil (Sedoanalgesia)', dosePadrao: 0.03, concPadrao: 0.05, desc: '50 mcg/mL puro (0.05 mg/mL)' },
  { nome: 'Midazolam (Sedação contínua)', dosePadrao: 0.1, concPadrao: 1.0, desc: '50 mg em 50 mL SF 0.9% (1.0 mg/mL)' },
  { nome: 'Propofol 1%', dosePadrao: 1.5, concPadrao: 10.0, desc: '10 mg/mL puro em frasco de 20 mL ou 50 mL' },
];

export const ClinicalCalculators: React.FC = () => {
  const [calculadoraAtiva, setCalculadoraAtiva] = useState<
    'ckd_epi' | 'cockcroft' | 'curb65' | 'wells' | 'infusao' | 'sri' | 'gasometria' | 'pals' | 'cardio_sepse'
  >('sri');

  const [erroCalculo, setErroCalculo] = useState<string | null>(null);

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

  // Estados: Vazão de Infusão e Dose Reversa
  const [modoInfusao, setModoInfusao] = useState<'direto' | 'reverso'>('direto');
  const [doseInfusao, setDoseInfusao] = useState<number>(0.1); // mcg/kg/min
  const [vazaoInfusao, setVazaoInfusao] = useState<number>(6.56); // mL/h
  const [pesoInfusao, setPesoInfusao] = useState<number>(70);
  const [concInfusao, setConcInfusao] = useState<number>(0.064);
  const [resultadoVazao, setResultadoVazao] = useState<number | null>(null);
  const [resultadoDoseReversa, setResultadoDoseReversa] = useState<number | null>(null);

  // Estados: Intubação em Sequência Rápida (SRI)
  const [pesoSri, setPesoSri] = useState<number>(70);
  const [alturaSri, setAlturaSri] = useState<number>(175);
  const [sexoFemSri, setSexoFemSri] = useState<boolean>(false);
  const [perfilSri, setPerfilSri] = useState<string>('choque_instavel');
  const [resultadoSri, setResultadoSri] = useState<ResultadoIntubacaoSri | null>(null);

  // Estados: Gasometria e Sódio
  const [gasoPh, setGasoPh] = useState<number>(7.25);
  const [gasoPaco2, setGasoPaco2] = useState<number>(28);
  const [gasoHco3, setGasoHco3] = useState<number>(12);
  const [gasoSodio, setGasoSodio] = useState<number>(140);
  const [gasoCloro, setGasoCloro] = useState<number>(100);
  const [gasoAlbumina, setGasoAlbumina] = useState<number>(3.0);
  const [gasoPao2, setGasoPao2] = useState<number>(85);
  const [gasoFio2, setGasoFio2] = useState<number>(0.21);
  const [resultadoGaso, setResultadoGaso] = useState<ResultadoGasometria | null>(null);

  // Correção de Sódio
  const [sodioAtual, setSodioAtual] = useState<number>(118);
  const [pesoSodio, setPesoSodio] = useState<number>(70);
  const [sexoFemSodio, setSexoFemSodio] = useState<boolean>(false);
  const [idosoSodio, setIdosoSodio] = useState<boolean>(false);
  const [solucaoSodio, setSolucaoSodio] = useState<number>(513); // NaCl 3% = 513 mEq/L
  const [resultadoSodio, setResultadoSodio] = useState<ResultadoCorrecaoSodio | null>(null);

  // Estados: Emergência Pediátrica PALS
  const [pesoPals, setPesoPals] = useState<number>(20);
  const [idadePals, setIdadePals] = useState<number>(6);
  const [resultadoPals, setResultadoPals] = useState<ResultadoEmergenciaPediatrica | null>(null);

  // Estados: CHA2DS2-VA e qSOFA
  const [chaIc, setChaIc] = useState(true);
  const [chaHas, setChaHas] = useState(true);
  const [chaIdade, setChaIdade] = useState(72);
  const [chaDm, setChaDm] = useState(false);
  const [chaAvc, setChaAvc] = useState(false);
  const [chaVasc, setChaVasc] = useState(false);
  const [resultadoCha, setResultadoCha] = useState<ResultadoCha2ds2Va | null>(null);

  const [qsofaFr, setQsofaFr] = useState(true);
  const [qsofaPas, setQsofaPas] = useState(true);
  const [qsofaMental, setQsofaMental] = useState(false);
  const [resultadoQsofa, setResultadoQsofa] = useState<ResultadoQsofa | null>(null);

  // Handlers de Cálculo
  const calcularCkdEpi = async () => {
    setErroCalculo(null);
    try {
      const res = await executarCalculoClinico<ResultadoTfg>('ckd_epi_2021', {
        creatinina,
        idade,
        sexo_feminino: sexoFeminino,
      });
      setResultadoTfg(res);
    } catch (e) {
      setResultadoTfg(null);
      setErroCalculo(e instanceof Error ? e.message : String(e));
    }
  };

  const calcularCockcroft = async () => {
    setErroCalculo(null);
    try {
      const res = await executarCalculoClinico<{ clearance_creatinina_ml_min: number }>('cockcroft_gault', {
        creatinina,
        peso_kg: pesoCockcroft,
        idade,
        sexo_feminino: sexoFeminino,
      });
      setResultadoCockcroft(res.clearance_creatinina_ml_min);
    } catch (e) {
      setResultadoCockcroft(null);
      setErroCalculo(e instanceof Error ? e.message : String(e));
    }
  };

  const calcularCurb = async () => {
    setErroCalculo(null);
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
      setResultadoCurb(null);
      setErroCalculo(e instanceof Error ? e.message : String(e));
    }
  };

  const calcularWells = async () => {
    setErroCalculo(null);
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
      setResultadoWells(null);
      setErroCalculo(e instanceof Error ? e.message : String(e));
    }
  };

  const calcularInfusao = async () => {
    setErroCalculo(null);
    try {
      if (modoInfusao === 'direto') {
        const res = await executarCalculoClinico<{ vazao_ml_h: number }>('vazao_infusao', {
          dose_mcg_kg_min: doseInfusao,
          peso_kg: pesoInfusao,
          concentracao_mg_ml: concInfusao,
        });
        setResultadoVazao(res.vazao_ml_h);
      } else {
        const res = await executarCalculoClinico<{ dose_mcg_kg_min: number }>('dose_reversa_infusao', {
          vazao_ml_h: vazaoInfusao,
          peso_kg: pesoInfusao,
          concentracao_mg_ml: concInfusao,
        });
        setResultadoDoseReversa(res.dose_mcg_kg_min);
      }
    } catch (e) {
      setResultadoVazao(null);
      setResultadoDoseReversa(null);
      setErroCalculo(e instanceof Error ? e.message : String(e));
    }
  };

  const calcularSri = async () => {
    setErroCalculo(null);
    try {
      const res = await executarCalculoClinico<ResultadoIntubacaoSri>('intubacao_sri', {
        peso_kg: pesoSri,
        altura_cm: alturaSri,
        sexo_feminino: sexoFemSri,
        perfil: perfilSri,
      });
      setResultadoSri(res);
    } catch (e) {
      setResultadoSri(null);
      setErroCalculo(e instanceof Error ? e.message : String(e));
    }
  };

  const calcularGasometria = async () => {
    setErroCalculo(null);
    try {
      const res = await executarCalculoClinico<ResultadoGasometria>('gasometria', {
        ph: gasoPh,
        paco2: gasoPaco2,
        hco3: gasoHco3,
        sodio: gasoSodio,
        cloro: gasoCloro,
        albumina: gasoAlbumina,
        pao2: gasoPao2,
        fio2_fracao: gasoFio2,
      });
      setResultadoGaso(res);
    } catch (e) {
      setResultadoGaso(null);
      setErroCalculo(e instanceof Error ? e.message : String(e));
    }
  };

  const calcularSodio = async () => {
    setErroCalculo(null);
    try {
      const res = await executarCalculoClinico<ResultadoCorrecaoSodio>('correcao_sodio', {
        sodio_atual: sodioAtual,
        peso_kg: pesoSodio,
        sexo_feminino: sexoFemSodio,
        idoso: idosoSodio,
        solucao_meq_l: solucaoSodio,
      });
      setResultadoSodio(res);
    } catch (e) {
      setResultadoSodio(null);
      setErroCalculo(e instanceof Error ? e.message : String(e));
    }
  };

  const calcularPals = async () => {
    setErroCalculo(null);
    try {
      const res = await executarCalculoClinico<ResultadoEmergenciaPediatrica>('emergencia_pediatrica', {
        peso_kg: pesoPals,
        idade_anos: idadePals,
      });
      setResultadoPals(res);
    } catch (e) {
      setResultadoPals(null);
      setErroCalculo(e instanceof Error ? e.message : String(e));
    }
  };

  const calcularCardioSepse = async () => {
    setErroCalculo(null);
    try {
      const resCha = await executarCalculoClinico<ResultadoCha2ds2Va>('cha2ds2_va', {
        insuficiencia_cardiaca: chaIc,
        hipertensao: chaHas,
        idade: chaIdade,
        diabetes: chaDm,
        avc_ou_ait_previo: chaAvc,
        doenca_vascular: chaVasc,
      });
      setResultadoCha(resCha);

      const resQs = await executarCalculoClinico<ResultadoQsofa>('qsofa', {
        fr_maior_22: qsofaFr,
        pas_menor_100: qsofaPas,
        alteracao_mental: qsofaMental,
      });
      setResultadoQsofa(resQs);
    } catch (e) {
      setErroCalculo(e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-teal-500/10 text-teal-400 rounded-xl">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Calculadoras Clínicas & Emergência Médica</h3>
            <p className="text-xs text-slate-400">
              Módulos determinísticos com validação fisiológica (Sala Vermelha, UTI, Nefrologia e Cardiologia).
            </p>
          </div>
        </div>
      </div>

      {/* Abas Superiores de Navegação */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setCalculadoraAtiva('sri')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
            calculadoraAtiva === 'sri' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Wind className="w-4 h-4 text-rose-300" /> ISR & 7 Ps
        </button>
        <button
          onClick={() => setCalculadoraAtiva('gasometria')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
            calculadoraAtiva === 'gasometria' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Droplet className="w-4 h-4 text-sky-300" /> Gasometria & Sódio
        </button>
        <button
          onClick={() => setCalculadoraAtiva('infusao')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
            calculadoraAtiva === 'infusao' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4 text-amber-300" /> Bombas UTI (10 Drogas)
        </button>
        <button
          onClick={() => setCalculadoraAtiva('pals')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
            calculadoraAtiva === 'pals' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Baby className="w-4 h-4 text-purple-300" /> Emergência PALS
        </button>
        <button
          onClick={() => setCalculadoraAtiva('cardio_sepse')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
            calculadoraAtiva === 'cardio_sepse' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <HeartPulse className="w-4 h-4 text-emerald-300" /> CHA2DS2-VA & qSOFA
        </button>
        <button
          onClick={() => setCalculadoraAtiva('ckd_epi')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
            calculadoraAtiva === 'ckd_epi' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          CKD-EPI 2021
        </button>
        <button
          onClick={() => setCalculadoraAtiva('cockcroft')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
            calculadoraAtiva === 'cockcroft' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Cockcroft-Gault
        </button>
        <button
          onClick={() => setCalculadoraAtiva('curb65')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
            calculadoraAtiva === 'curb65' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          CURB-65
        </button>
        <button
          onClick={() => setCalculadoraAtiva('wells')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
            calculadoraAtiva === 'wells' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Wells (TEP)
        </button>
      </div>

      {erroCalculo && (
        <div className="bg-red-950/60 border border-red-700 p-3 rounded-xl text-xs text-red-200">
          <strong>Erro no cálculo:</strong> {erroCalculo}
        </div>
      )}

      {/* 1. ABA ISR & 7 PS */}
      {calculadoraAtiva === 'sri' && (
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
              Intubação em Sequência Rápida (ISR / SRI) & Ventilação ARDSNet
            </span>
            <span className="text-[11px] text-slate-400">Doses automáticas em mL por peso real e ideal</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Peso Real (kg)</label>
              <input
                type="number"
                value={pesoSri}
                onChange={(e) => setPesoSri(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Altura (cm)</label>
              <input
                type="number"
                value={alturaSri}
                onChange={(e) => setAlturaSri(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Sexo Biológico</label>
              <select
                value={sexoFemSri ? 'f' : 'm'}
                onChange={(e) => setSexoFemSri(e.target.value === 'f')}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-sm"
              >
                <option value="m">Masculino</option>
                <option value="f">Feminino</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Perfil Hemodinâmico</label>
              <select
                value={perfilSri}
                onChange={(e) => setPerfilSri(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-sm"
              >
                <option value="choque_instavel">Choque / Hipotensão</option>
                <option value="neuroprotecao_tce">Neuroproteção / TCE</option>
                <option value="broncoespasmo_grave">Broncoespasmo Grave / Asma</option>
                <option value="padrao">Padrão / Euvolemia</option>
              </select>
            </div>
          </div>

          <button
            onClick={calcularSri}
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition shadow"
          >
            Calcular Doses (mL) e Parâmetros do Respirador
          </button>

          {resultadoSri && (
            <div className="space-y-4 pt-2">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-2">
                  Ventilação Mecânica Protetora Inicial (ARDSNet - 6 mL/kg)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="bg-slate-950 p-2 rounded-lg">
                    <span className="text-slate-400">Peso Predito:</span>
                    <p className="font-bold text-slate-100 font-mono text-sm">{resultadoSri.ventilacao.peso_predito_kg} kg</p>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-lg">
                    <span className="text-slate-400">Volume Corrente:</span>
                    <p className="font-bold text-sky-300 font-mono text-sm">{resultadoSri.ventilacao.volume_corrente_ml} mL</p>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-lg">
                    <span className="text-slate-400">PEEP Inicial:</span>
                    <p className="font-bold text-slate-100 font-mono text-sm">{resultadoSri.ventilacao.peep_sugerida_cmh2o} cmH2O</p>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-lg">
                    <span className="text-slate-400">FR Sugerida:</span>
                    <p className="font-bold text-slate-100 font-mono text-sm">{resultadoSri.ventilacao.fr_sugerida_irpm} irpm</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Drogas da Intubação (Volumes Prontos para Aspirar):
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {resultadoSri.farmacos.map((f, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border text-xs space-y-1 ${
                        f.recomendado_perfil
                          ? 'bg-slate-900 border-teal-600/70'
                          : 'bg-slate-900/60 border-slate-800 opacity-80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-100 text-sm">{f.nome_farmaco}</span>
                        <span className="text-emerald-400 font-extrabold font-mono text-sm">
                          {f.volume_administrar_ml} mL ({f.dose_total_mg} mg)
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">{f.apresentacao_ampola}</div>
                      <p className="text-[11px] text-slate-300 pt-0.5">{f.observacao_clinica}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-xs space-y-1">
                <strong className="text-rose-300 block mb-1">Checklist dos 7 Ps da ISR:</strong>
                {resultadoSri.checklist_7ps.map((p, i) => (
                  <p key={i} className="text-slate-300">&bull; {p}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. ABA GASOMETRIA & SÓDIO */}
      {calculadoraAtiva === 'gasometria' && (
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="text-xs font-bold text-sky-400 uppercase tracking-wider">
            Gasometria Arterial, Ânion Gap Corrigido (Figge), Delta-Delta e Correção de Sódio
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">pH</label>
              <input
                type="number"
                step="0.01"
                value={gasoPh}
                onChange={(e) => setGasoPh(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">PaCO2 (mmHg)</label>
              <input
                type="number"
                value={gasoPaco2}
                onChange={(e) => setGasoPaco2(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">HCO3 (mEq/L)</label>
              <input
                type="number"
                value={gasoHco3}
                onChange={(e) => setGasoHco3(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Sódio Na+ (mEq/L)</label>
              <input
                type="number"
                value={gasoSodio}
                onChange={(e) => setGasoSodio(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Cloro Cl- (mEq/L)</label>
              <input
                type="number"
                value={gasoCloro}
                onChange={(e) => setGasoCloro(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Albumina (g/dL)</label>
              <input
                type="number"
                step="0.1"
                value={gasoAlbumina}
                onChange={(e) => setGasoAlbumina(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">PaO2 (mmHg)</label>
              <input
                type="number"
                value={gasoPao2}
                onChange={(e) => setGasoPao2(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">FiO2 (0.21 a 1.0)</label>
              <input
                type="number"
                step="0.01"
                value={gasoFio2}
                onChange={(e) => setGasoFio2(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
          </div>

          <button
            onClick={calcularGasometria}
            className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition shadow"
          >
            Interpretar Distúrbio Ácido-Básico Completo
          </button>

          {resultadoGaso && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-sm font-bold text-sky-300">{resultadoGaso.disturbio_primario}</span>
                <span className="font-mono text-slate-300">P/F: {resultadoGaso.relacao_pafo2}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="bg-slate-950 p-2 rounded-lg">
                  <span className="text-slate-400">AG Bruto:</span>
                  <p className="font-bold text-slate-100 font-mono">{resultadoGaso.anion_gap_bruto}</p>
                </div>
                <div className="bg-slate-950 p-2 rounded-lg">
                  <span className="text-slate-400">AG Corrigido (Figge):</span>
                  <p className="font-bold text-amber-300 font-mono">{resultadoGaso.anion_gap_corrigido}</p>
                </div>
                <div className="bg-slate-950 p-2 rounded-lg">
                  <span className="text-slate-400">Delta-Delta:</span>
                  <p className="font-bold text-slate-100 font-mono">{resultadoGaso.delta_delta ?? 'N/A'}</p>
                </div>
                <div className="bg-slate-950 p-2 rounded-lg">
                  <span className="text-slate-400">Oxigenação (SDRA):</span>
                  <p className="font-bold text-emerald-300 text-[11px]">{resultadoGaso.classificacao_oxigenacao_sdra}</p>
                </div>
              </div>

              <div className="text-slate-300 space-y-1">
                <p><strong>Compensação:</strong> {resultadoGaso.compensacao_respiratoria}</p>
                {resultadoGaso.interpretacao_delta_delta && (
                  <p><strong>Interpretação Delta-Delta:</strong> {resultadoGaso.interpretacao_delta_delta}</p>
                )}
              </div>

              {resultadoGaso.condutas_sugeridas.length > 0 && (
                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-sky-200">
                  <strong>Condutas Clínicas:</strong>
                  {resultadoGaso.condutas_sugeridas.map((c, i) => (
                    <p key={i} className="mt-0.5">&bull; {c}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Subseção Correção de Sódio */}
          <div className="pt-3 border-t border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Correção de Sódio (Fórmula de Adrogué-Madias - Limite Seguro 8 mEq/L/24h)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <label className="text-slate-400">Sódio Atual (mEq/L)</label>
                <input
                  type="number"
                  value={sodioAtual}
                  onChange={(e) => setSodioAtual(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400">Peso (kg)</label>
                <input
                  type="number"
                  value={pesoSodio}
                  onChange={(e) => setPesoSodio(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400">Solução Utilizada</label>
                <select
                  value={solucaoSodio}
                  onChange={(e) => setSolucaoSodio(parseFloat(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 text-slate-100"
                >
                  <option value={513}>NaCl 3% (513 mEq/L)</option>
                  <option value={154}>SF 0.9% (154 mEq/L)</option>
                  <option value={0}>SG 5% (0 mEq/L)</option>
                </select>
              </div>
              <div className="flex items-center gap-3 pt-4">
                <label className="flex items-center gap-1 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sexoFemSodio}
                    onChange={(e) => setSexoFemSodio(e.target.checked)}
                  />
                  Feminino
                </label>
                <label className="flex items-center gap-1 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={idosoSodio}
                    onChange={(e) => setIdosoSodio(e.target.checked)}
                  />
                  Idoso
                </label>
              </div>
            </div>

            <button
              onClick={calcularSodio}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition"
            >
              Calcular Vazão da Solução em BIC (mL/h)
            </button>

            {resultadoSodio && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Vazão Recomendada em BIC:</span>
                  <span className="text-teal-400 font-extrabold font-mono text-base">
                    {resultadoSodio.vazao_bic_ml_h} mL/h ({resultadoSodio.volume_recomendado_24h_ml} mL em 24h)
                  </span>
                </div>
                <div className="text-[11px] text-amber-200 bg-amber-950/40 p-2 rounded-lg border border-amber-900/60">
                  {resultadoSodio.alerta_seguranca}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. ABA BOMBAS UTI (10 DROGAS & REVERSO) */}
      {calculadoraAtiva === 'infusao' && (
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Painel de 10 Drogas Vasoativas / Sedativos de UTI
            </span>
            <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-[11px]">
              <button
                onClick={() => setModoInfusao('direto')}
                className={`px-2.5 py-1 rounded-md transition ${modoInfusao === 'direto' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
              >
                Dose &rarr; mL/h
              </button>
              <button
                onClick={() => setModoInfusao('reverso')}
                className={`px-2.5 py-1 rounded-md transition ${modoInfusao === 'reverso' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
              >
                mL/h &rarr; Dose
              </button>
            </div>
          </div>

          {/* Presets Rápidos */}
          <div className="flex flex-wrap gap-1.5">
            {DROGAS_VASOATIVAS_PRESET.map((d, i) => (
              <button
                key={i}
                onClick={() => {
                  setConcInfusao(d.concPadrao);
                  setDoseInfusao(d.dosePadrao);
                }}
                className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-[11px] text-slate-300 transition"
              >
                {d.nome}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {modoInfusao === 'direto' ? (
              <div>
                <label className="block text-slate-400 mb-1">Dose Alvo (mcg/kg/min)</label>
                <input
                  type="number"
                  step="0.01"
                  value={doseInfusao}
                  onChange={(e) => setDoseInfusao(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
                />
              </div>
            ) : (
              <div>
                <label className="block text-slate-400 mb-1">Vazão Programada (mL/h)</label>
                <input
                  type="number"
                  step="0.1"
                  value={vazaoInfusao}
                  onChange={(e) => setVazaoInfusao(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
                />
              </div>
            )}
            <div>
              <label className="block text-slate-400 mb-1">Peso do Paciente (kg)</label>
              <input
                type="number"
                value={pesoInfusao}
                onChange={(e) => setPesoInfusao(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Concentração da Solução (mg/mL)</label>
              <input
                type="number"
                step="0.001"
                value={concInfusao}
                onChange={(e) => setConcInfusao(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
              />
            </div>
          </div>

          <button
            onClick={calcularInfusao}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition shadow"
          >
            {modoInfusao === 'direto' ? 'Calcular Vazão na Bomba (mL/h)' : 'Calcular Dose Administrada (mcg/kg/min)'}
          </button>

          {resultadoVazao !== null && modoInfusao === 'direto' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-3xl font-extrabold text-amber-400 font-mono">
                {resultadoVazao.toFixed(2)} <span className="text-sm text-slate-400">mL/h</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Taxa programável na bomba de infusão volumétrica dedicada em acesso venoso central.
              </p>
            </div>
          )}

          {resultadoDoseReversa !== null && modoInfusao === 'reverso' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-3xl font-extrabold text-teal-400 font-mono">
                {resultadoDoseReversa.toFixed(3)} <span className="text-sm text-slate-400">mcg/kg/min</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Dose ponderal efetiva recebida pelo paciente na velocidade atual.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 4. ABA PALS EMERGÊNCIA */}
      {calculadoraAtiva === 'pals' && (
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="text-xs font-bold text-purple-400 uppercase tracking-wider">
            Régua de Emergência Pediátrica (PALS / Broselow)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Peso da Criança (kg)</label>
              <input
                type="number"
                value={pesoPals}
                onChange={(e) => setPesoPals(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Idade da Criança (anos)</label>
              <input
                type="number"
                step="0.5"
                value={idadePals}
                onChange={(e) => setIdadePals(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm"
              />
            </div>
          </div>

          <button
            onClick={calcularPals}
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition shadow"
          >
            Calcular Parâmetros de PCR, Tubo e Choque
          </button>

          {resultadoPals && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Tubo com Cuff:</span>
                  <p className="font-bold text-purple-300 font-mono text-sm">{resultadoPals.tubo_com_cuff_mm} mm</p>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Tubo sem Cuff:</span>
                  <p className="font-bold text-slate-200 font-mono text-sm">{resultadoPals.tubo_sem_cuff_mm} mm</p>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Fixação Rima Labial:</span>
                  <p className="font-bold text-slate-200 font-mono text-sm">{resultadoPals.fixacao_rima_labial_cm} cm</p>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">1º Choque (2 J/kg):</span>
                  <p className="font-bold text-rose-300 font-mono text-sm">{resultadoPals.carga_desfibrilacao_1_j} J</p>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">2º Choque (4 J/kg):</span>
                  <p className="font-bold text-rose-400 font-mono text-sm">{resultadoPals.carga_desfibrilacao_2_j} J</p>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Lâmina Laringo:</span>
                  <p className="font-bold text-slate-200 text-[11px]">{resultadoPals.lamina_laringoscopio}</p>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-300">Adrenalina PCR (0.01 mg/kg):</span>
                  <span className="font-bold text-rose-400 font-mono">
                    {resultadoPals.adrenalina_pcr_mg} mg ({resultadoPals.adrenalina_diluida_1_10000_ml} mL da solução 1:10.000)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Expansão Volêmica (20 mL/kg):</span>
                  <span className="font-bold text-sky-400 font-mono">
                    {resultadoPals.expansao_cristaloide_20ml_kg} mL de SF 0,9% ou Ringer Lactato
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. ABA CARDIOLOGIA & SEPSE */}
      {calculadoraAtiva === 'cardio_sepse' && (
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            CHA2DS2-VA (Diretriz ESC 2024 sem viés de gênero) & qSOFA
          </div>

          <div className="space-y-3 text-xs">
            <span className="font-semibold text-slate-300 block">Critérios CHA2DS2-VA (Fibrilação Atrial):</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <label className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg cursor-pointer">
                <input type="checkbox" checked={chaIc} onChange={(e) => setChaIc(e.target.checked)} />
                Insuficiência Cardíaca (+1)
              </label>
              <label className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg cursor-pointer">
                <input type="checkbox" checked={chaHas} onChange={(e) => setChaHas(e.target.checked)} />
                Hipertensão (+1)
              </label>
              <label className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg cursor-pointer">
                <input type="checkbox" checked={chaDm} onChange={(e) => setChaDm(e.target.checked)} />
                Diabetes Mellitus (+1)
              </label>
              <label className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg cursor-pointer">
                <input type="checkbox" checked={chaAvc} onChange={(e) => setChaAvc(e.target.checked)} />
                AVC / AIT Prévio (+2)
              </label>
              <label className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg cursor-pointer">
                <input type="checkbox" checked={chaVasc} onChange={(e) => setChaVasc(e.target.checked)} />
                Doença Vascular (+1)
              </label>
              <div className="bg-slate-900 p-1.5 rounded-lg flex items-center justify-between">
                <span className="text-slate-400">Idade (anos):</span>
                <input
                  type="number"
                  value={chaIdade}
                  onChange={(e) => setChaIdade(parseInt(e.target.value) || 0)}
                  className="w-16 bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 font-mono text-center"
                />
              </div>
            </div>

            <span className="font-semibold text-slate-300 block pt-2">Critérios qSOFA (Triagem de Sepse):</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <label className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg cursor-pointer">
                <input type="checkbox" checked={qsofaFr} onChange={(e) => setQsofaFr(e.target.checked)} />
                FR &ge; 22 irpm (+1)
              </label>
              <label className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg cursor-pointer">
                <input type="checkbox" checked={qsofaPas} onChange={(e) => setQsofaPas(e.target.checked)} />
                PAS &le; 100 mmHg (+1)
              </label>
              <label className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg cursor-pointer">
                <input type="checkbox" checked={qsofaMental} onChange={(e) => setQsofaMental(e.target.checked)} />
                Alteração Mental / Glasgow &lt; 15 (+1)
              </label>
            </div>
          </div>

          <button
            onClick={calcularCardioSepse}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow"
          >
            Calcular Risco Tromboembólico & Sepse
          </button>

          {resultadoCha && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-emerald-300 text-sm">
                  CHA2DS2-VA: {resultadoCha.pontuacao} pontos ({resultadoCha.categoria_risco})
                </span>
                <span className="text-slate-400 font-mono">Taxa AVC: {resultadoCha.taxa_avc_anual_estimada}</span>
              </div>
              <p className="text-slate-200"><strong>Conduta:</strong> {resultadoCha.recomendacao_anticoagulacao}</p>
            </div>
          )}

          {resultadoQsofa && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-amber-300 text-sm">
                  qSOFA: {resultadoQsofa.pontuacao} pontos &mdash; {resultadoQsofa.alto_risco_sepse ? 'ALTO RISCO DE SEPSE' : 'Baixo Risco'}
                </span>
              </div>
              <p className="text-slate-200">{resultadoQsofa.recomendacao}</p>
            </div>
          )}
        </div>
      )}

      {/* 6. ABA CKD-EPI */}
      {calculadoraAtiva === 'ckd_epi' && (
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="text-xs font-bold text-teal-400 uppercase tracking-wider">
            Taxa de Filtração Glomerular (CKD-EPI 2021 sem viés racial)
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
                value={idade}
                onChange={(e) => setIdade(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Sexo Biológico</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSexoFeminino(false)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition ${
                    !sexoFeminino ? 'bg-teal-600 border-teal-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  Masculino
                </button>
                <button
                  type="button"
                  onClick={() => setSexoFeminino(true)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition ${
                    sexoFeminino ? 'bg-teal-600 border-teal-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  Feminino
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={calcularCkdEpi}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition shadow"
          >
            Calcular TFG (CKD-EPI 2021)
          </button>

          {resultadoTfg && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center space-y-1">
              <div className="text-3xl font-extrabold text-teal-400 font-mono">
                {resultadoTfg.taxa_filtracao_glomerular.toFixed(1)}{' '}
                <span className="text-sm text-slate-400">mL/min/1.73m²</span>
              </div>
              <div className="text-xs font-bold text-slate-200">{resultadoTfg.estagio_drc}</div>
              <p className="text-xs text-slate-400 pt-1">{resultadoTfg.recomendacao_geral}</p>
            </div>
          )}
        </div>
      )}

      {/* 7. ABA COCKCROFT */}
      {calculadoraAtiva === 'cockcroft' && (
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="text-xs font-bold text-teal-400 uppercase tracking-wider">
            Clearance de Creatinina (Cockcroft-Gault 1976)
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
                onChange={(e) => setIdade(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Sexo Biológico</label>
              <select
                value={sexoFeminino ? 'f' : 'm'}
                onChange={(e) => setSexoFeminino(e.target.value === 'f')}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-sm"
              >
                <option value="m">Masculino (Fator 1.0)</option>
                <option value="f">Feminino (Fator 0.85)</option>
              </select>
            </div>
          </div>

          <button
            onClick={calcularCockcroft}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition shadow"
          >
            Calcular Clearance (mL/min)
          </button>

          {resultadoCockcroft !== null && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-3xl font-extrabold text-teal-400 font-mono">
                {resultadoCockcroft.toFixed(1)} <span className="text-sm text-slate-400">mL/min</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Utilizado para checagem de faixas de bula de medicamentos.</p>
            </div>
          )}
        </div>
      )}

      {/* 8. ABA CURB-65 */}
      {calculadoraAtiva === 'curb65' && (
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            CURB-65 (Estratificação de Gravidade na Pneumonia Adquirida na Comunidade)
          </div>

          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2 bg-slate-900 p-2.5 rounded-lg cursor-pointer">
              <input type="checkbox" checked={confusao} onChange={(e) => setConfusao(e.target.checked)} />
              <strong>C:</strong> Confusão mental aguda (escore AMTS &le; 8 ou desorientação) (+1)
            </label>
            <label className="flex items-center gap-2 bg-slate-900 p-2.5 rounded-lg cursor-pointer">
              <input type="checkbox" checked={ureia} onChange={(e) => setUreia(e.target.checked)} />
              <strong>U:</strong> Ureia sérica &gt; 50 mg/dL (&gt; 7 mmol/L) (+1)
            </label>
            <label className="flex items-center gap-2 bg-slate-900 p-2.5 rounded-lg cursor-pointer">
              <input type="checkbox" checked={fr} onChange={(e) => setFr(e.target.checked)} />
              <strong>R:</strong> Frequência respiratória &ge; 30 irpm (+1)
            </label>
            <label className="flex items-center gap-2 bg-slate-900 p-2.5 rounded-lg cursor-pointer">
              <input type="checkbox" checked={hipotensao} onChange={(e) => setHipotensao(e.target.checked)} />
              <strong>B:</strong> Pressão arterial baixa (PAS &lt; 90 ou PAD &le; 60 mmHg) (+1)
            </label>
            <label className="flex items-center gap-2 bg-slate-900 p-2.5 rounded-lg cursor-pointer">
              <input type="checkbox" checked={idade65} onChange={(e) => setIdade65(e.target.checked)} />
              <strong>65:</strong> Idade &ge; 65 anos (+1)
            </label>
          </div>

          <button
            onClick={calcularCurb}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition shadow"
          >
            Calcular CURB-65
          </button>

          {resultadoCurb && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center space-y-1">
              <div className="text-3xl font-extrabold text-amber-400 font-mono">
                {resultadoCurb.pontuacao} <span className="text-sm text-slate-400">pontos</span>
              </div>
              <div className="text-xs font-bold text-slate-200">{resultadoCurb.estrato_mortalidade}</div>
              <p className="text-xs text-slate-300 pt-1">{resultadoCurb.recomendacao_local_tratamento}</p>
            </div>
          )}
        </div>
      )}

      {/* 9. ABA WELLS */}
      {calculadoraAtiva === 'wells' && (
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="text-xs font-bold text-sky-400 uppercase tracking-wider">
            Critérios de Wells para Tromboembolismo Pulmonar (TEP)
          </div>

          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2 bg-slate-900 p-2.5 rounded-lg cursor-pointer">
              <input type="checkbox" checked={wellsTvp} onChange={(e) => setWellsTvp(e.target.checked)} />
              Sinais clínicos ou sintomas de TVP (edema assimétrico, dor à palpação) (+3.0)
            </label>
            <label className="flex items-center gap-2 bg-slate-900 p-2.5 rounded-lg cursor-pointer">
              <input type="checkbox" checked={wellsAlt} onChange={(e) => setWellsAlt(e.target.checked)} />
              Diagnóstico alternativo menos provável que TEP (+3.0)
            </label>
            <label className="flex items-center gap-2 bg-slate-900 p-2.5 rounded-lg cursor-pointer">
              <input type="checkbox" checked={wellsFc} onChange={(e) => setWellsFc(e.target.checked)} />
              Frequência cardíaca &gt; 100 bpm (+1.5)
            </label>
            <label className="flex items-center gap-2 bg-slate-900 p-2.5 rounded-lg cursor-pointer">
              <input type="checkbox" checked={wellsImob} onChange={(e) => setWellsImob(e.target.checked)} />
              Imobilização &ge; 3 dias ou cirurgia nas últimas 4 semanas (+1.5)
            </label>
            <label className="flex items-center gap-2 bg-slate-900 p-2.5 rounded-lg cursor-pointer">
              <input type="checkbox" checked={wellsHist} onChange={(e) => setWellsHist(e.target.checked)} />
              Histórico prévio comprovado de TVP ou TEP (+1.5)
            </label>
            <label className="flex items-center gap-2 bg-slate-900 p-2.5 rounded-lg cursor-pointer">
              <input type="checkbox" checked={wellsHemo} onChange={(e) => setWellsHemo(e.target.checked)} />
              Hemoptise (+1.0)
            </label>
            <label className="flex items-center gap-2 bg-slate-900 p-2.5 rounded-lg cursor-pointer">
              <input type="checkbox" checked={wellsMalign} onChange={(e) => setWellsMalign(e.target.checked)} />
              Malignidade ativa ou em tratamento nos últimos 6 meses (+1.0)
            </label>
          </div>

          <button
            onClick={calcularWells}
            className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition shadow"
          >
            Calcular Probabilidade de Wells
          </button>

          {resultadoWells && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center space-y-1">
              <div className="text-3xl font-extrabold text-sky-400 font-mono">
                {resultadoWells.pontuacao_total.toFixed(1)} <span className="text-sm text-slate-400">pontos</span>
              </div>
              <div className="text-xs font-bold text-slate-200">
                {resultadoWells.categoria_risco} ({resultadoWells.probabilidade_clinica_percentual})
              </div>
              <p className="text-xs text-slate-300 pt-1">{resultadoWells.conduta_propedêutica}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
