import React, { useState, useEffect, useMemo } from 'react';
import { Wind, Activity, Baby, Droplets, Flame, Gauge, AlertTriangle } from 'lucide-react';
import {
  ResultadoIntubacaoSri,
  ResultadoEmergenciaPediatrica,
  ResultadoDengueMs,
  ResultadoParkland,
  ResultadoPamPpc,
  ResultadoSofaCompleto,
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

const DROGAS_VASOATIVAS_PRESET = [
  { nome: 'Noradrenalina (Padrão)', dosePadrao: 0.1, concPadrao: 0.064, desc: '16 mg em 250 mL SG 5% (0.064 mg/mL)' },
  { nome: 'Noradrenalina (Concentrada 4x)', dosePadrao: 0.1, concPadrao: 0.256, desc: '64 mg em 250 mL SG 5% (0.256 mg/mL)' },
  { nome: 'Adrenalina', dosePadrao: 0.05, concPadrao: 0.04, desc: '10 mg em 250 mL SG 5% (0.04 mg/mL)' },
  { nome: 'Dobutamina', dosePadrao: 5.0, concPadrao: 1.0, desc: '250 mg em 250 mL SG 5% (1.0 mg/mL)' },
  { nome: 'Dopamina', dosePadrao: 5.0, concPadrao: 1.0, desc: '250 mg em 250 mL SG 5% (1.0 mg/mL)' },
  { nome: 'Nitroprussiato de Sódio', dosePadrao: 0.5, concPadrao: 0.2, desc: '50 mg em 250 mL SG 5% (0.2 mg/mL)' },
  { nome: 'Nitroglicerina', dosePadrao: 0.3, concPadrao: 0.2, desc: '50 mg em 250 mL SF 0.9% (0.2 mg/mL)' },
  { nome: 'Fentanil (Sedoanalgesia)', dosePadrao: 0.03, concPadrao: 0.05, desc: '50 mcg/mL puro (0.05 mg/mL)' },
  { nome: 'Midazolam (Sedação)', dosePadrao: 0.1, concPadrao: 1.0, desc: '50 mg em 50 mL SF 0.9% (1.0 mg/mL)' },
  { nome: 'Propofol 1%', dosePadrao: 1.5, concPadrao: 10.0, desc: '10 mg/mL puro em frasco' },
];

export const CalculadorasSalaVermelha: React.FC<Props> = ({
  calculadoraAtiva,
  isFavorito,
  onToggleFavorito,
  onNavegarCalculadora,
}) => {
  // 1. ISR / SRI
  const [pesoSri, setPesoSri] = useState<number>(70);
  const [alturaSri, setAlturaSri] = useState<number>(175);
  const [sexoFemSri, setSexoFemSri] = useState<boolean>(false);
  const [perfilSri, setPerfilSri] = useState<string>('choque_instavel');
  const [resSri, setResSri] = useState<ResultadoIntubacaoSri | null>(null);

  useEffect(() => {
    if (calculadoraAtiva !== 'sri') return;
    executarCalculoClinico<ResultadoIntubacaoSri>('intubacao_sri', {
      peso_kg: pesoSri,
      altura_cm: alturaSri,
      sexo_feminino: sexoFemSri,
      perfil: perfilSri,
    })
      .then(setResSri)
      .catch(() => setResSri(null));
  }, [calculadoraAtiva, pesoSri, alturaSri, sexoFemSri, perfilSri]);

  const textoProntuarioSri = useMemo(() => {
    if (!resSri) return '';
    const farmacosLinhas = resSri.farmacos
      .map((f) => `- ${f.nome_farmaco}: ${f.volume_administrar_ml} mL (${f.dose_total_mg} mg) [${f.observacao_clinica}]`)
      .join('\n');
    return `[INTUBAÇÃO EM SEQUÊNCIA RÁPIDA (ISR / SRI)]
Perfil: ${resSri.perfil_hemodinamico} | Peso Real: ${pesoSri} kg | Peso Predito: ${resSri.ventilacao.peso_predito_kg.toFixed(1)} kg (ARDSNet)
Drogas da Indução e Bloqueio:
${farmacosLinhas}
Ventilação Protetora Inicial:
- Volume Corrente Alvo: ${resSri.ventilacao.volume_corrente_ml} mL (6 mL/kg predito)
- PEEP Inicial: ${resSri.ventilacao.peep_sugerida_cmh2o} cmH2O | FR: ${resSri.ventilacao.fr_sugerida_irpm} irpm | FiO2 Inicial: ${resSri.ventilacao.fio2_inicial_percentual}%`;
  }, [resSri, pesoSri]);

  // 2. Bombas de Infusão
  const [modoInfusao, setModoInfusao] = useState<'direto' | 'reverso'>('direto');
  const [doseInfusao, setDoseInfusao] = useState<number>(0.1);
  const [vazaoInfusao, setVazaoInfusao] = useState<number>(6.56);
  const [pesoInfusao, setPesoInfusao] = useState<number>(70);
  const [concInfusao, setConcInfusao] = useState<number>(0.064);
  const [resVazao, setResVazao] = useState<number | null>(null);
  const [resDoseReversa, setResDoseReversa] = useState<number | null>(null);

  useEffect(() => {
    if (calculadoraAtiva !== 'infusao') return;
    if (modoInfusao === 'direto') {
      executarCalculoClinico<{ vazao_ml_h: number }>('vazao_infusao', {
        dose_mcg_kg_min: doseInfusao,
        peso_kg: pesoInfusao,
        concentracao_mg_ml: concInfusao,
      })
        .then((r) => setResVazao(r.vazao_ml_h))
        .catch(() => setResVazao(null));
    } else {
      executarCalculoClinico<{ dose_mcg_kg_min: number }>('dose_reversa_infusao', {
        vazao_ml_h: vazaoInfusao,
        peso_kg: pesoInfusao,
        concentracao_mg_ml: concInfusao,
      })
        .then((r) => setResDoseReversa(r.dose_mcg_kg_min))
        .catch(() => setResDoseReversa(null));
    }
  }, [calculadoraAtiva, modoInfusao, doseInfusao, vazaoInfusao, pesoInfusao, concInfusao]);

  const textoProntuarioInfusao = useMemo(() => {
    if (modoInfusao === 'direto' && resVazao !== null) {
      return `[BOMBA DE INFUSÃO CONTÍNUA (BIC)]\nPeso: ${pesoInfusao} kg | Concentração: ${concInfusao} mg/mL | Dose Alvo: ${doseInfusao} mcg/kg/min -> Vazão Calculada: ${resVazao.toFixed(2)} mL/h`;
    }
    if (modoInfusao === 'reverso' && resDoseReversa !== null) {
      return `[TITULAÇÃO REVERSA BIC]\nPeso: ${pesoInfusao} kg | Concentração: ${concInfusao} mg/mL | Vazão Atual: ${vazaoInfusao} mL/h -> Dose em Infusão: ${resDoseReversa.toFixed(3)} mcg/kg/min`;
    }
    return '';
  }, [modoInfusao, pesoInfusao, concInfusao, doseInfusao, vazaoInfusao, resVazao, resDoseReversa]);

  // 3. PALS Pediátrico
  const [pesoPals, setPesoPals] = useState<number>(20);
  const [idadePals, setIdadePals] = useState<number>(6);
  const [resPals, setResPals] = useState<ResultadoEmergenciaPediatrica | null>(null);

  useEffect(() => {
    if (calculadoraAtiva !== 'pals') return;
    executarCalculoClinico<ResultadoEmergenciaPediatrica>('emergencia_pediatrica', {
      peso_kg: pesoPals,
      idade_anos: idadePals,
    })
      .then(setResPals)
      .catch(() => setResPals(null));
  }, [calculadoraAtiva, pesoPals, idadePals]);

  const textoProntuarioPals = useMemo(() => {
    if (!resPals) return '';
    return `[EMERGÊNCIA PEDIÁTRICA PALS]\nIdade: ${idadePals} anos | Peso: ${pesoPals} kg\n- Tubo Endotraqueal: ${resPals.tubo_com_cuff_mm.toFixed(1)} mm (com cuff) ou ${resPals.tubo_sem_cuff_mm.toFixed(1)} mm (sem cuff) | Fixação na rima: ${resPals.fixacao_rima_labial_cm.toFixed(1)} cm\n- Desfibrilação: 1º Choque ${resPals.carga_desfibrilacao_1_j} J (2 J/kg) -> 2º Choque ${resPals.carga_desfibrilacao_2_j} J (4 J/kg)\n- Adrenalina PCR (1:10.000): ${resPals.adrenalina_pcr_mg.toFixed(2)} mg (${resPals.adrenalina_diluida_1_10000_ml.toFixed(1)} mL IV/IO)\n- Expansão Volêmica (20 mL/kg): ${resPals.expansao_cristaloide_20ml_kg} mL SF 0,9% em bolus`;
  }, [resPals, idadePals, pesoPals]);

  // 4. Dengue MS
  const [pesoDengue, setPesoDengue] = useState<number>(70);
  const [sinaisAlarme, setSinaisAlarme] = useState<boolean>(false);
  const [sinaisChoque, setSinaisChoque] = useState<boolean>(false);
  const [condicaoEspecial, setCondicaoEspecial] = useState<boolean>(false);
  const [resDengue, setResDengue] = useState<ResultadoDengueMs | null>(null);

  useEffect(() => {
    if (calculadoraAtiva !== 'dengue_ms') return;
    executarCalculoClinico<ResultadoDengueMs>('dengue_ms', {
      peso_kg: pesoDengue,
      sinais_alarme: sinaisAlarme,
      sinais_choque_ou_sangramento_grave: sinaisChoque,
      condicao_especial_ou_plaquetopenia: condicaoEspecial,
    })
      .then(setResDengue)
      .catch(() => setResDengue(null));
  }, [calculadoraAtiva, pesoDengue, sinaisAlarme, sinaisChoque, condicaoEspecial]);

  const textoProntuarioDengue = useMemo(() => {
    if (!resDengue) return '';
    return `[ESTADIAMENTO E CONDUTA DENGUE - MINISTÉRIO DA SAÚDE]\nPeso: ${pesoDengue} kg | Classificação: ${resDengue.grupo} (${resDengue.classificacao_risco})\nConduta: ${resDengue.orientacao_clinica}\n- Volume 24h: ${resDengue.volume_total_dia_ml} mL (SRO: ${resDengue.volume_sro_ml} mL + Outros Líquidos: ${resDengue.volume_outros_liquidos_ml} mL)\n${resDengue.fase_expansao_imediata_ml > 0 ? `- Expansão Imediata: ${resDengue.fase_expansao_imediata_ml} mL em ${resDengue.tempo_infusao_expansao_horas}h (${resDengue.vazao_expansao_ml_h} mL/h)` : ''}`;
  }, [resDengue, pesoDengue]);

  // 5. Parkland
  const [pesoParkland, setPesoParkland] = useState<number>(70);
  const [scqParkland, setScqParkland] = useState<number>(25);
  const [horasParkland, setHorasParkland] = useState<number>(2);
  const [resParkland, setResParkland] = useState<ResultadoParkland | null>(null);

  useEffect(() => {
    if (calculadoraAtiva !== 'parkland') return;
    executarCalculoClinico<ResultadoParkland>('parkland', {
      peso_kg: pesoParkland,
      percentual_scq: scqParkland,
      horas_desde_queimadura: horasParkland,
    })
      .then(setResParkland)
      .catch(() => setResParkland(null));
  }, [calculadoraAtiva, pesoParkland, scqParkland, horasParkland]);

  const textoProntuarioParkland = useMemo(() => {
    if (!resParkland) return '';
    return `[RESSUSCITAÇÃO VOLÊMICA DO GRANDE QUEIMADO - PARKLAND / ATLS 10ª]\nPeso: ${pesoParkland} kg | Superfície Corpórea Queimada (SCQ): ${scqParkland}%\n- Volume Total 24h (Parkland 4 mL/kg/%): ${resParkland.volume_total_24h_parkland_ml.toFixed(0)} mL Ringer Lactato\n- Volume Total 24h (Consenso ATLS 2 mL/kg/%): ${resParkland.volume_total_24h_atls10_ml.toFixed(0)} mL\n- 1ª Fase (primeiras ${resParkland.horas_primeira_fase.toFixed(1)}h restantes): ${resParkland.volume_primeira_fase_ml.toFixed(0)} mL a ${resParkland.vazao_primeira_fase_ml_h.toFixed(1)} mL/h\n- 2ª Fase (16h subsequentes): ${resParkland.volume_segunda_fase_ml.toFixed(0)} mL a ${resParkland.vazao_segunda_fase_ml_h.toFixed(1)} mL/h\n- Meta de Diurese: ${resParkland.meta_diurese_ml_h}`;
  }, [resParkland, pesoParkland, scqParkland]);

  // 6. PAM & PPC
  const [pasPam, setPasPam] = useState<number>(120);
  const [padPam, setPadPam] = useState<number>(70);
  const [picPam, setPicPam] = useState<number>(15);
  const [usarPic, setUsarPic] = useState<boolean>(true);
  const [resPam, setResPam] = useState<ResultadoPamPpc | null>(null);

  useEffect(() => {
    if (calculadoraAtiva !== 'pam_ppc') return;
    executarCalculoClinico<ResultadoPamPpc>('pam_ppc', {
      pas_mmhg: pasPam,
      pad_mmhg: padPam,
      pic_mmhg: usarPic ? picPam : undefined,
    })
      .then(setResPam)
      .catch(() => setResPam(null));
  }, [calculadoraAtiva, pasPam, padPam, picPam, usarPic]);

  const textoProntuarioPam = useMemo(() => {
    if (!resPam) return '';
    return `[MONITORIZAÇÃO HEMODINÂMICA: PAM & PPC]\nPA: ${pasPam}/${padPam} mmHg -> PAM: ${resPam.pam_mmhg.toFixed(1)} mmHg\n${resPam.pic_mmhg ? `PIC: ${resPam.pic_mmhg} mmHg -> Pressão de Perfusão Cerebral (PPC): ${resPam.ppc_mmhg?.toFixed(1)} mmHg\n` : ''}Classificação: ${resPam.classificacao_hemodinamica}\nAlvo Terapêutico: ${resPam.alvo_terapeutico}`;
  }, [resPam, pasPam, padPam]);

  // 7. SOFA & SIRS
  const [pao2Sofa, setPao2Sofa] = useState<number>(85);
  const [fio2Sofa, setFio2Sofa] = useState<number>(0.21);
  const [ventMecSofa, setVentMecSofa] = useState<boolean>(false);
  const [plaqSofa, setPlaqSofa] = useState<number>(160);
  const [biliSofa, setBiliSofa] = useState<number>(1.0);
  const [pamSofa, setPamSofa] = useState<number>(75);
  const [dopaSofa, setDopaSofa] = useState<number>(0);
  const [noraSofa, setNoraSofa] = useState<number>(0);
  const [gcsSofa, setGcsSofa] = useState<number>(15);
  const [crSofa, setCrSofa] = useState<number>(1.0);
  const [fcSirs, setFcSirs] = useState<number>(82);
  const [frSirs, setFrSirs] = useState<number>(18);
  const [tempSirs, setTempSirs] = useState<number>(36.8);
  const [leucoSirs, setLeucoSirs] = useState<number>(7500);
  const [resSofa, setResSofa] = useState<ResultadoSofaCompleto | null>(null);

  useEffect(() => {
    if (calculadoraAtiva !== 'sofa_sirs') return;
    executarCalculoClinico<ResultadoSofaCompleto>('sofa_completo', {
      pao2: pao2Sofa,
      fio2_fracao: fio2Sofa > 1 ? fio2Sofa / 100 : fio2Sofa,
      em_ventilacao_mecanica: ventMecSofa,
      plaquetas_milhares: plaqSofa,
      bilirrubina_mg_dl: biliSofa,
      pam_mmhg: pamSofa,
      dose_dopamina_mcg_kg_min: dopaSofa,
      dose_noradrenalina_mcg_kg_min: noraSofa,
      glasgow: gcsSofa,
      creatinina_mg_dl: crSofa,
      diurese_diaria_ml: undefined,
      fc: fcSirs,
      fr: frSirs,
      temperatura_c: tempSirs,
      leucocitos_totais: leucoSirs,
    })
      .then(setResSofa)
      .catch(() => setResSofa(null));
  }, [
    calculadoraAtiva,
    pao2Sofa,
    fio2Sofa,
    ventMecSofa,
    plaqSofa,
    biliSofa,
    pamSofa,
    dopaSofa,
    noraSofa,
    gcsSofa,
    crSofa,
    fcSirs,
    frSirs,
    tempSirs,
    leucoSirs,
  ]);

  const textoProntuarioSofa = useMemo(() => {
    if (!resSofa) return '';
    return `[AVALIAÇÃO DE DISFUNÇÃO ORGÂNICA - SOFA & SIRS]\nSOFA Total: ${resSofa.sofa_total}/24 pontos (Mortalidade estimada de UTI: ${resSofa.mortalidade_estimada_uti})\n- Resp (PaO2/FiO2): ${resSofa.pontuacao_respiratoria} pt | Coagulação: ${resSofa.pontuacao_coagulacao} pt | Hepático: ${resSofa.pontuacao_hepatica} pt\n- Cardiovascular: ${resSofa.pontuacao_cardiovascular} pt | SNC: ${resSofa.pontuacao_neurologica} pt | Renal: ${resSofa.pontuacao_renal} pt\nSIRS: ${resSofa.criterios_sirs_presentes}/4 critérios (${resSofa.sirs_positivo ? 'POSITIVA' : 'Negativa'})\nConduta: ${resSofa.conduta_sepse}`;
  }, [resSofa]);

  const metaSri = CATALOGO_CALCULADORAS.find((c) => c.id === 'sri')!;
  const metaInfusao = CATALOGO_CALCULADORAS.find((c) => c.id === 'infusao')!;
  const metaPals = CATALOGO_CALCULADORAS.find((c) => c.id === 'pals')!;
  const metaDengue = CATALOGO_CALCULADORAS.find((c) => c.id === 'dengue_ms')!;
  const metaParkland = CATALOGO_CALCULADORAS.find((c) => c.id === 'parkland')!;
  const metaPam = CATALOGO_CALCULADORAS.find((c) => c.id === 'pam_ppc')!;
  const metaSofa = CATALOGO_CALCULADORAS.find((c) => c.id === 'sofa_sirs')!;

  return (
    <>
      {/* 1. ISR / SRI */}
      {calculadoraAtiva === 'sri' && (
        <CardCalculadora
          meta={metaSri}
          icone={Wind}
          corDestaque="rose"
          isFavorito={isFavorito('sri')}
          onToggleFavorito={onToggleFavorito}
          onNavegarCalculadora={onNavegarCalculadora}
          textoProntuario={textoProntuarioSri}
        >
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Peso Real (kg)</label>
              <input
                type="number"
                value={pesoSri}
                onChange={(e) => setPesoSri(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Altura (cm)</label>
              <input
                type="number"
                value={alturaSri}
                onChange={(e) => setAlturaSri(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Sexo Biológico</label>
              <ChipSegmentado<boolean>
                valor={sexoFemSri}
                opcoes={[
                  { valor: false, rotulo: 'Masc' },
                  { valor: true, rotulo: 'Fem' },
                ]}
                onChange={setSexoFemSri}
                corAtiva="bg-rose-600"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Perfil Clínico</label>
              <select
                value={perfilSri}
                onChange={(e) => setPerfilSri(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-xs"
              >
                <option value="choque_instavel">Choque / Instabilidade Hemodinâmica</option>
                <option value="neuro_tce">Neuro / TCE / Hipertensão Intracraniana</option>
                <option value="broncoespasmo_asma">Broncoespasmo Grave / Asma</option>
                <option value="padrao_estavel">Padrão / Hemodinamicamente Estável</option>
              </select>
            </div>
          </div>

          {resSri && (
            <div className="space-y-3">
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Drogas da Indução e Bloqueio (Volumes Prontos em mL):
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {resSri.farmacos.map((f, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border text-xs space-y-1 ${
                        f.recomendado_perfil
                          ? 'bg-slate-900 border-teal-600/70 shadow'
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

              <div className="p-3 bg-slate-900/90 border border-teal-500/20 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-teal-400 font-semibold block">
                    Ventilação Mecânica Protetora (Protocolo ARDSNet):
                  </span>
                  <span className="text-slate-300">
                    Peso Predito: <strong>{resSri.ventilacao.peso_predito_kg.toFixed(1)} kg</strong> &bull; Volume
                    Corrente Alvo: <strong>{resSri.ventilacao.volume_corrente_ml} mL</strong> (6 mL/kg) &bull; PEEP:{' '}
                    <strong>{resSri.ventilacao.peep_sugerida_cmh2o} cmH2O</strong> &bull; FR:{' '}
                    <strong>{resSri.ventilacao.fr_sugerida_irpm} irpm</strong>
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardCalculadora>
      )}

      {/* 2. BOMBAS DVA */}
      {calculadoraAtiva === 'infusao' && (
        <CardCalculadora
          meta={metaInfusao}
          icone={Activity}
          corDestaque="amber"
          isFavorito={isFavorito('infusao')}
          onToggleFavorito={onToggleFavorito}
          onNavegarCalculadora={onNavegarCalculadora}
          textoProntuario={textoProntuarioInfusao}
        >
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setModoInfusao('direto')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-semibold ${
                modoInfusao === 'direto' ? 'bg-amber-600 text-white shadow' : 'bg-slate-900 text-slate-400'
              }`}
            >
              Cálculo Direto (Dose &rarr; Vazão mL/h)
            </button>
            <button
              type="button"
              onClick={() => setModoInfusao('reverso')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-semibold ${
                modoInfusao === 'reverso' ? 'bg-amber-600 text-white shadow' : 'bg-slate-900 text-slate-400'
              }`}
            >
              Cálculo Reverso (Vazão mL/h &rarr; Dose Recebida)
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            {DROGAS_VASOATIVAS_PRESET.map((d, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setDoseInfusao(d.dosePadrao);
                  setConcInfusao(d.concPadrao);
                }}
                className="text-left p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-[11px]"
              >
                <div className="font-semibold text-slate-200 truncate">{d.nome}</div>
                <div className="text-[10px] text-slate-400 font-mono">{d.concPadrao} mg/mL</div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Peso do Paciente (kg)</label>
              <input
                type="number"
                value={pesoInfusao}
                onChange={(e) => setPesoInfusao(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Concentração da Solução (mg/mL)</label>
              <input
                type="number"
                step="0.001"
                value={concInfusao}
                onChange={(e) => setConcInfusao(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                {modoInfusao === 'direto' ? 'Dose Alvo (mcg/kg/min)' : 'Vazão Atual na Bomba (mL/h)'}
              </label>
              <input
                type="number"
                step="0.01"
                value={modoInfusao === 'direto' ? doseInfusao : vazaoInfusao}
                onChange={(e) =>
                  modoInfusao === 'direto'
                    ? setDoseInfusao(parseFloat(e.target.value) || 0)
                    : setVazaoInfusao(parseFloat(e.target.value) || 0)
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-amber-400 font-mono font-bold"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-900 border border-amber-500/20 rounded-xl text-center">
            {modoInfusao === 'direto' ? (
              <div>
                <span className="text-xs text-slate-400 block mb-1">Vazão Programada na Bomba de Infusão</span>
                <span className="text-3xl font-extrabold text-amber-400 font-mono">
                  {resVazao !== null ? resVazao.toFixed(2) : '--'}
                </span>
                <span className="text-sm font-semibold text-slate-300 ml-1.5">mL/h</span>
              </div>
            ) : (
              <div>
                <span className="text-xs text-slate-400 block mb-1">Dose Efetiva Recebida pelo Paciente</span>
                <span className="text-3xl font-extrabold text-amber-400 font-mono">
                  {resDoseReversa !== null ? resDoseReversa.toFixed(3) : '--'}
                </span>
                <span className="text-sm font-semibold text-slate-300 ml-1.5">mcg/kg/min</span>
              </div>
            )}
          </div>
        </CardCalculadora>
      )}

      {/* 3. PALS PEDIÁTRICO */}
      {calculadoraAtiva === 'pals' && (
        <CardCalculadora
          meta={metaPals}
          icone={Baby}
          corDestaque="purple"
          isFavorito={isFavorito('pals')}
          onToggleFavorito={onToggleFavorito}
          onNavegarCalculadora={onNavegarCalculadora}
          textoProntuario={textoProntuarioPals}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Idade da Criança (anos)</label>
              <input
                type="number"
                value={idadePals}
                onChange={(e) => setIdadePals(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Peso Estimado ou Aferido (kg)</label>
              <input
                type="number"
                value={pesoPals}
                onChange={(e) => setPesoPals(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
              />
            </div>
          </div>

          {resPals && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Tubo Endotraqueal</span>
                <div className="font-bold text-purple-300 font-mono text-sm mt-0.5">
                  {resPals.tubo_com_cuff_mm.toFixed(1)} mm <span className="text-[10px] text-slate-400">(c/ cuff)</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {resPals.tubo_sem_cuff_mm.toFixed(1)} mm (sem cuff) &bull; Rima: {resPals.fixacao_rima_labial_cm.toFixed(1)} cm
                </div>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Desfibrilação</span>
                <div className="font-bold text-amber-300 font-mono text-sm mt-0.5">
                  1º: {resPals.carga_desfibrilacao_1_j} J (2 J/kg)
                </div>
                <div className="text-[10px] text-slate-400">
                  2º+: {resPals.carga_desfibrilacao_2_j} J (4 J/kg)
                </div>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Adrenalina PCR</span>
                <div className="font-bold text-rose-300 font-mono text-sm mt-0.5">
                  {resPals.adrenalina_pcr_mg.toFixed(2)} mg ({resPals.adrenalina_diluida_1_10000_ml.toFixed(1)} mL)
                </div>
                <div className="text-[10px] text-slate-400">Solução 1:10.000 a cada 3 a 5 min</div>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Expansão Volêmica</span>
                <div className="font-bold text-teal-300 font-mono text-sm mt-0.5">
                  {resPals.expansao_cristaloide_20ml_kg} mL SF 0,9%
                </div>
                <div className="text-[10px] text-slate-400">20 mL/kg em bolus rápido IV/IO</div>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Lâmina Laringo</span>
                <div className="font-bold text-sky-300 font-mono text-sm mt-0.5">
                  {resPals.lamina_laringoscopio}
                </div>
                <div className="text-[10px] text-slate-400">Reto/Curvo conforme anatomia</div>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Idade / Peso</span>
                <div className="font-bold text-emerald-300 font-mono text-sm mt-0.5">
                  {resPals.peso_kg} kg
                </div>
                <div className="text-[10px] text-slate-400">{resPals.idade_anos} anos</div>
              </div>
            </div>
          )}
        </CardCalculadora>
      )}

      {/* 4. DENGUE MS */}
      {calculadoraAtiva === 'dengue_ms' && (
        <CardCalculadora
          meta={metaDengue}
          icone={Droplets}
          corDestaque="rose"
          isFavorito={isFavorito('dengue_ms')}
          onToggleFavorito={onToggleFavorito}
          onNavegarCalculadora={onNavegarCalculadora}
          textoProntuario={textoProntuarioDengue}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Peso do Paciente (kg)</label>
              <input
                type="number"
                value={pesoDengue}
                onChange={(e) => setPesoDengue(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={condicaoEspecial}
                  onChange={(e) => setCondicaoEspecial(e.target.checked)}
                />
                <span>Condição especial, comorbidades, gestante ou prova do laço positiva</span>
              </label>
              <label className="flex items-center gap-2 p-2 bg-amber-950/40 rounded-xl border border-amber-800/40 cursor-pointer text-amber-200">
                <input type="checkbox" checked={sinaisAlarme} onChange={(e) => setSinaisAlarme(e.target.checked)} />
                <span>Sinais de alarme (dor abdominal intensa, vômitos, sangramento mucoso, lipotimia)</span>
              </label>
              <label className="flex items-center gap-2 p-2 bg-rose-950/40 rounded-xl border border-rose-800/40 cursor-pointer text-rose-200">
                <input type="checkbox" checked={sinaisChoque} onChange={(e) => setSinaisChoque(e.target.checked)} />
                <span>Sinais de choque, taquicardia, hipotensão postural ou hemorragia grave</span>
              </label>
            </div>
          </div>

          {resDengue && (
            <div className="space-y-3">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-rose-400">
                    {resDengue.grupo} &bull; {resDengue.classificacao_risco}
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{resDengue.orientacao_clinica}</p>
                </div>
              </div>

              {resDengue.fase_expansao_imediata_ml > 0 ? (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-rose-950/50 border border-rose-800/50 rounded-xl text-center">
                    <span className="text-[10px] text-rose-300 uppercase block font-semibold">
                      Fase de Expansão Imediata (IV)
                    </span>
                    <strong className="text-2xl font-bold text-white font-mono">
                      {resDengue.fase_expansao_imediata_ml} mL
                    </strong>
                    <div className="text-[11px] text-rose-200 mt-0.5">
                      Correr em {resDengue.tempo_infusao_expansao_horas}h ({resDengue.vazao_expansao_ml_h} mL/h)
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center">
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                      Fase de Manutenção Posterior
                    </span>
                    <strong className="text-2xl font-bold text-slate-200 font-mono">
                      {resDengue.vazao_manutencao_ml_h} mL/h
                    </strong>
                    <div className="text-[11px] text-slate-400 mt-0.5">25 mL/kg em 6h seguido de 25 mL/kg em 8h</div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">Volume Diário Total</span>
                    <strong className="text-lg font-bold text-teal-300 font-mono">{resDengue.volume_total_dia_ml} mL</strong>
                  </div>
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">SRO (1/3 nas 1ªs 6h)</span>
                    <strong className="text-lg font-bold text-sky-300 font-mono">{resDengue.volume_sro_ml} mL</strong>
                  </div>
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">Líquidos Caseiros (2/3)</span>
                    <strong className="text-lg font-bold text-emerald-300 font-mono">{resDengue.volume_outros_liquidos_ml} mL</strong>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardCalculadora>
      )}

      {/* 5. PARKLAND */}
      {calculadoraAtiva === 'parkland' && (
        <CardCalculadora
          meta={metaParkland}
          icone={Flame}
          corDestaque="amber"
          isFavorito={isFavorito('parkland')}
          onToggleFavorito={onToggleFavorito}
          onNavegarCalculadora={onNavegarCalculadora}
          textoProntuario={textoProntuarioParkland}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Peso do Paciente (kg)</label>
              <input
                type="number"
                value={pesoParkland}
                onChange={(e) => setPesoParkland(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Superfície Queimada (% SCQ 2º/3º grau)</label>
              <input
                type="number"
                value={scqParkland}
                onChange={(e) => setScqParkland(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Horas decorridas desde a queimadura</label>
              <input
                type="number"
                step="0.5"
                value={horasParkland}
                onChange={(e) => setHorasParkland(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
              />
            </div>
          </div>

          {resParkland && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-center text-xs">
                <div className="p-3 bg-amber-950/40 border border-amber-800/40 rounded-xl">
                  <span className="text-[10px] text-amber-300 uppercase block font-semibold">1ª Metade (Volume restante)</span>
                  <strong className="text-2xl font-bold text-white font-mono">
                    {resParkland.volume_primeira_fase_ml.toFixed(0)} mL
                  </strong>
                  <div className="text-xs text-amber-200 mt-1">
                    Vazão: <strong>{resParkland.vazao_primeira_fase_ml_h.toFixed(1)} mL/h</strong> (nas próximas {resParkland.horas_primeira_fase.toFixed(1)}h)
                  </div>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">2ª Metade (16h seguintes)</span>
                  <strong className="text-2xl font-bold text-slate-200 font-mono">
                    {resParkland.volume_segunda_fase_ml.toFixed(0)} mL
                  </strong>
                  <div className="text-xs text-slate-300 mt-1">
                    Vazão: <strong>{resParkland.vazao_segunda_fase_ml_h.toFixed(1)} mL/h</strong>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs flex justify-between items-center">
                <span className="text-slate-400">Meta de diurese no grande queimado:</span>
                <span className="text-teal-400 font-bold">{resParkland.meta_diurese_ml_h}</span>
              </div>
            </div>
          )}
        </CardCalculadora>
      )}

      {/* 6. PAM & PPC */}
      {calculadoraAtiva === 'pam_ppc' && (
        <CardCalculadora
          meta={metaPam}
          icone={Gauge}
          corDestaque="sky"
          isFavorito={isFavorito('pam_ppc')}
          onToggleFavorito={onToggleFavorito}
          onNavegarCalculadora={onNavegarCalculadora}
          textoProntuario={textoProntuarioPam}
        >
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">PAS (Sistólica mmHg)</label>
              <input
                type="number"
                value={pasPam}
                onChange={(e) => setPasPam(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">PAD (Diastólica mmHg)</label>
              <input
                type="number"
                value={padPam}
                onChange={(e) => setPadPam(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Incluir PIC (Cateter intracraniano)?</label>
              <ChipSegmentado<boolean>
                valor={usarPic}
                opcoes={[
                  { valor: false, rotulo: 'Apenas PAM' },
                  { valor: true, rotulo: 'PPC (c/ PIC)' },
                ]}
                onChange={setUsarPic}
                corAtiva="bg-sky-600"
              />
            </div>
            {usarPic && (
              <div>
                <label className="block text-slate-400 font-semibold mb-1">PIC (Intracraniana mmHg)</label>
                <input
                  type="number"
                  value={picPam}
                  onChange={(e) => setPicPam(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
                />
              </div>
            )}
          </div>

          {resPam && (
            <div className="p-4 bg-slate-900 border border-sky-500/20 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">PAM</span>
                  <span className="text-3xl font-extrabold text-sky-400 font-mono">{resPam.pam_mmhg.toFixed(1)}</span>
                  <span className="text-xs text-slate-400 ml-1">mmHg</span>
                </div>
                {resPam.ppc_mmhg !== null && resPam.ppc_mmhg !== undefined && (
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">PPC</span>
                    <span className="text-3xl font-extrabold text-teal-400 font-mono">{resPam.ppc_mmhg.toFixed(1)}</span>
                    <span className="text-xs text-slate-400 ml-1">mmHg</span>
                  </div>
                )}
              </div>
              <div className="text-right text-xs">
                <div className="font-bold text-slate-200">{resPam.classificacao_hemodinamica}</div>
                <div className="text-slate-400 mt-0.5">{resPam.alvo_terapeutico}</div>
              </div>
            </div>
          )}
        </CardCalculadora>
      )}

      {/* 7. SOFA & SIRS */}
      {calculadoraAtiva === 'sofa_sirs' && (
        <CardCalculadora
          meta={metaSofa}
          icone={AlertTriangle}
          corDestaque="rose"
          isFavorito={isFavorito('sofa_sirs')}
          onToggleFavorito={onToggleFavorito}
          onNavegarCalculadora={onNavegarCalculadora}
          textoProntuario={textoProntuarioSofa}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">PaO2 (mmHg)</label>
              <input
                type="number"
                value={pao2Sofa}
                onChange={(e) => setPao2Sofa(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">FiO2 (ex: 0.21 ou 21)</label>
              <input
                type="number"
                step="0.01"
                value={fio2Sofa}
                onChange={(e) => setFio2Sofa(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Plaquetas (mil/mm³)</label>
              <input
                type="number"
                value={plaqSofa}
                onChange={(e) => setPlaqSofa(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Bilirrubina (mg/dL)</label>
              <input
                type="number"
                step="0.1"
                value={biliSofa}
                onChange={(e) => setBiliSofa(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">PAM (mmHg)</label>
              <input
                type="number"
                value={pamSofa}
                onChange={(e) => setPamSofa(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Noradrenalina (mcg/kg/min)</label>
              <input
                type="number"
                step="0.01"
                value={noraSofa}
                onChange={(e) => setNoraSofa(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Glasgow (GCS 3 a 15)</label>
              <input
                type="number"
                value={gcsSofa}
                onChange={(e) => setGcsSofa(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Creatinina (mg/dL)</label>
              <input
                type="number"
                step="0.1"
                value={crSofa}
                onChange={(e) => setCrSofa(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-lg text-xs cursor-pointer">
              <input type="checkbox" checked={ventMecSofa} onChange={(e) => setVentMecSofa(e.target.checked)} />
              <span>Em Ventilação Mecânica Invasiva</span>
            </label>
          </div>

          {resSofa && (
            <div className="p-4 bg-slate-900 border border-rose-500/20 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">SOFA Score Total</span>
                  <span className="text-3xl font-extrabold text-rose-400 font-mono">{resSofa.sofa_total}</span>
                  <span className="text-xs text-slate-400 ml-1">/ 24 pts</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-200">
                    Mortalidade UTI: {resSofa.mortalidade_estimada_uti}
                  </div>
                  <div className="text-xs text-slate-400">
                    SIRS: {resSofa.criterios_sirs_presentes}/4 critérios ({resSofa.sirs_positivo ? 'POSITIVO' : 'Negativo'})
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-300 border-t border-slate-800 pt-2">{resSofa.conduta_sepse}</p>
            </div>
          )}
        </CardCalculadora>
      )}
    </>
  );
};
