import React, { useState, useEffect, useMemo } from 'react';
import { Wind, ShieldCheck, Activity, Stethoscope, AlertOctagon } from 'lucide-react';
import {
  ResultadoWells,
  ResultadoPerc,
  ResultadoWellsTvp,
  ResultadoPaduaTev,
  ResultadoCurb65,
} from '../../types';
import { executarCalculoClinico } from '../../api';
import { CardCalculadora } from './CalculadoraShared';
import { CATALOGO_CALCULADORAS } from './catalogo';

interface Props {
  calculadoraAtiva: string;
  isFavorito: (id: string) => boolean;
  onToggleFavorito: (id: string) => void;
  onNavegarCalculadora: (id: string) => void;
}

export const CalculadorasPneumo: React.FC<Props> = ({
  calculadoraAtiva,
  isFavorito,
  onToggleFavorito,
  onNavegarCalculadora,
}) => {
  // 1. Wells TEP
  const [wellsTvp, setWellsTvp] = useState(false);
  const [wellsAlt, setWellsAlt] = useState(false);
  const [wellsFc, setWellsFc] = useState(false);
  const [wellsImob, setWellsImob] = useState(false);
  const [wellsHist, setWellsHist] = useState(false);
  const [wellsHemo, setWellsHemo] = useState(false);
  const [wellsMalign, setWellsMalign] = useState(false);
  const [resWellsTep, setResWellsTep] = useState<ResultadoWells | null>(null);

  useEffect(() => {
    if (calculadoraAtiva !== 'wells_tep') return;
    executarCalculoClinico<ResultadoWells>('wells_tep', {
      sinais_clinicos_tvp: wellsTvp,
      diagnostico_alternativo_menos_provavel: wellsAlt,
      fc_maior_100: wellsFc,
      imobilizacao_ou_cirurgia_recente: wellsImob,
      historico_previo_tep_tvp: wellsHist,
      hemoptise: wellsHemo,
      malignidade_ativa: wellsMalign,
    })
      .then(setResWellsTep)
      .catch(() => setResWellsTep(null));
  }, [calculadoraAtiva, wellsTvp, wellsAlt, wellsFc, wellsImob, wellsHist, wellsHemo, wellsMalign]);

  const textoProntuarioWellsTep = useMemo(() => {
    if (!resWellsTep) return '';
    return `[WELLS TEP - PROBABILIDADE PRÉ-TESTE DE EMBOLIA PULMONAR]\nPontuação Total: ${resWellsTep.pontuacao_total.toFixed(1)} pts -> Categoria: ${resWellsTep.categoria_risco} (${resWellsTep.probabilidade_clinica_percentual})\nConduta Propedêutica: ${resWellsTep.conduta_propedêutica}`;
  }, [resWellsTep]);

  // 2. PERC
  const [percIdade, setPercIdade] = useState(false);
  const [percFc, setPercFc] = useState(false);
  const [percSat, setPercSat] = useState(false);
  const [percEdema, setPercEdema] = useState(false);
  const [percHemo, setPercHemo] = useState(false);
  const [percCirurgia, setPercCirurgia] = useState(false);
  const [percHist, setPercHist] = useState(false);
  const [percHormonio, setPercHormonio] = useState(false);
  const [resPerc, setResPerc] = useState<ResultadoPerc | null>(null);

  useEffect(() => {
    if (calculadoraAtiva !== 'perc') return;
    executarCalculoClinico<ResultadoPerc>('perc', {
      idade_ge_50: percIdade,
      fc_ge_100: percFc,
      sao2_ar_ambiente_lt_95: percSat,
      edema_unilateral_perna: percEdema,
      hemoptise: percHemo,
      cirurgia_ou_trauma_recente_4sem: percCirurgia,
      historico_tep_tvp: percHist,
      uso_hormonio_estrogenio: percHormonio,
    })
      .then(setResPerc)
      .catch(() => setResPerc(null));
  }, [calculadoraAtiva, percIdade, percFc, percSat, percEdema, percHemo, percCirurgia, percHist, percHormonio]);

  const textoProntuarioPerc = useMemo(() => {
    if (!resPerc) return '';
    return `[CRITÉRIOS PERC - REGRA DE DESCARTE DE TEP]\nCritérios Positivos: ${resPerc.criterios_positivos}/8 -> Descarte de TEP: ${resPerc.tep_descartado ? 'SIM (TEP DES増ARTADO SEM D-DÍMERO)' : 'NÃO (INVESTIGAR)'}\nProbabilidade residual estimada: ${resPerc.probabilidade_residual_percentual}\nConduta: ${resPerc.conduta}`;
  }, [resPerc]);

  // 3. Wells TVP
  const [tvpCancer, setTvpCancer] = useState(false);
  const [tvpParalisia, setTvpParalisia] = useState(false);
  const [tvpAcamado, setTvpAcamado] = useState(false);
  const [tvpDorTrajeto, setTvpDorTrajeto] = useState(false);
  const [tvpEdemaPerna, setTvpEdemaPerna] = useState(false);
  const [tvpEdemaPant, setTvpEdemaPant] = useState(false);
  const [tvpEdemaDepressivel, setTvpEdemaDepressivel] = useState(false);
  const [tvpVeiasColaterais, setTvpVeiasColaterais] = useState(false);
  const [tvpHistPrevio, setTvpHistPrevio] = useState(false);
  const [tvpDiagAlt, setTvpDiagAlt] = useState(false);
  const [resWellsTvp, setResWellsTvp] = useState<ResultadoWellsTvp | null>(null);

  useEffect(() => {
    if (calculadoraAtiva !== 'wells_tvp') return;
    executarCalculoClinico<ResultadoWellsTvp>('wells_tvp', {
      cancer_ativo: tvpCancer,
      paralisia_ou_imobilizacao_membro: tvpParalisia,
      acamado_recente_cirurgia: tvpAcamado,
      dor_trajeto_venoso_profundo: tvpDorTrajeto,
      edema_toda_perna: tvpEdemaPerna,
      edema_panturrilha_maior_3cm: tvpEdemaPant,
      edema_depressivel_assimetrico: tvpEdemaDepressivel,
      veias_colaterais_superficiais: tvpVeiasColaterais,
      historico_previo_tvp: tvpHistPrevio,
      diagnostico_alternativo_provavel: tvpDiagAlt,
    })
      .then(setResWellsTvp)
      .catch(() => setResWellsTvp(null));
  }, [
    calculadoraAtiva,
    tvpCancer,
    tvpParalisia,
    tvpAcamado,
    tvpDorTrajeto,
    tvpEdemaPerna,
    tvpEdemaPant,
    tvpEdemaDepressivel,
    tvpVeiasColaterais,
    tvpHistPrevio,
    tvpDiagAlt,
  ]);

  const textoProntuarioWellsTvp = useMemo(() => {
    if (!resWellsTvp) return '';
    return `[WELLS TVP - TROMBOSE VENOSA PROFUNDA]\nPontuação Total: ${resWellsTvp.pontuacao_total} pts -> Categoria: ${resWellsTvp.categoria_probabilidade} (Incidência: ${resWellsTvp.incidencia_estimada})\nConduta Indicada: ${resWellsTvp.conduta_indicada}`;
  }, [resWellsTvp]);

  // 4. Pádua TEV
  const [paduaCancer, setPaduaCancer] = useState(false);
  const [paduaTev, setPaduaTev] = useState(false);
  const [paduaMob, setPaduaMob] = useState(false);
  const [paduaTrombofilia, setPaduaTrombofilia] = useState(false);
  const [paduaTrauma, setPaduaTrauma] = useState(false);
  const [paduaIdade, setPaduaIdade] = useState(false);
  const [paduaIcResp, setPaduaIcResp] = useState(false);
  const [paduaIamAvc, setPaduaIamAvc] = useState(false);
  const [paduaInfec, setPaduaInfec] = useState(false);
  const [paduaImc, setPaduaImc] = useState(false);
  const [paduaHorm, setPaduaHorm] = useState(false);
  const [resPadua, setResPadua] = useState<ResultadoPaduaTev | null>(null);

  useEffect(() => {
    if (calculadoraAtiva !== 'padua_tev') return;
    executarCalculoClinico<ResultadoPaduaTev>('padua_tev', {
      cancer_ativo: paduaCancer,
      tromboembolismo_previo: paduaTev,
      mobilidade_reduzida: paduaMob,
      trombofilia_conhecida: paduaTrombofilia,
      trauma_ou_cirurgia_recente: paduaTrauma,
      idade_ge_70: paduaIdade,
      insuficiencia_cardiaca_ou_respiratoria: paduaIcResp,
      iam_ou_avc_isquemico: paduaIamAvc,
      infeccao_aguda_ou_doenca_reumatica: paduaInfec,
      imc_ge_30: paduaImc,
      tratamento_hormonal: paduaHorm,
    })
      .then(setResPadua)
      .catch(() => setResPadua(null));
  }, [
    calculadoraAtiva,
    paduaCancer,
    paduaTev,
    paduaMob,
    paduaTrombofilia,
    paduaTrauma,
    paduaIdade,
    paduaIcResp,
    paduaIamAvc,
    paduaInfec,
    paduaImc,
    paduaHorm,
  ]);

  const textoProntuarioPadua = useMemo(() => {
    if (!resPadua) return '';
    return `[ESCORE DE PÁDUA - PROFILAXIA DE TEV EM PACIENTE CLÍNICO]\nPontuação Total: ${resPadua.pontuacao_total} pts -> Alto Risco TEV: ${resPadua.alto_risco_tev ? 'SIM' : 'NÃO'}\nProfilaxia Indicada: ${resPadua.profilaxia_indicada}\nEsquema Farmacológico: ${resPadua.esquema_enoxaparina}`;
  }, [resPadua]);

  // 5. CURB-65
  const [curbConfusao, setCurbConfusao] = useState(false);
  const [curbUreia, setCurbUreia] = useState(false);
  const [curbFr, setCurbFr] = useState(false);
  const [curbHipotensao, setCurbHipotensao] = useState(false);
  const [curbIdade65, setCurbIdade65] = useState(false);
  const [resCurb, setResCurb] = useState<ResultadoCurb65 | null>(null);

  useEffect(() => {
    if (calculadoraAtiva !== 'curb65') return;
    executarCalculoClinico<ResultadoCurb65>('curb65', {
      confusao: curbConfusao,
      ureia_maior_50: curbUreia,
      fr_maior_30: curbFr,
      hipotensao: curbHipotensao,
      idade_maior_65: curbIdade65,
    })
      .then(setResCurb)
      .catch(() => setResCurb(null));
  }, [calculadoraAtiva, curbConfusao, curbUreia, curbFr, curbHipotensao, curbIdade65]);

  const textoProntuarioCurb = useMemo(() => {
    if (!resCurb) return '';
    return `[CURB-65 - ESTRATIFICAÇÃO DE GRAVIDADE NA PAC]\nPontuação: ${resCurb.pontuacao}/5 pts -> Mortalidade: ${resCurb.estrato_mortalidade}\nRecomendação de Local de Tratamento: ${resCurb.recomendacao_local_tratamento}`;
  }, [resCurb]);

  const metaWellsTep = CATALOGO_CALCULADORAS.find((c) => c.id === 'wells_tep')!;
  const metaPerc = CATALOGO_CALCULADORAS.find((c) => c.id === 'perc')!;
  const metaWellsTvp = CATALOGO_CALCULADORAS.find((c) => c.id === 'wells_tvp')!;
  const metaPadua = CATALOGO_CALCULADORAS.find((c) => c.id === 'padua_tev')!;
  const metaCurb = CATALOGO_CALCULADORAS.find((c) => c.id === 'curb65')!;

  return (
    <>
      {/* 1. WELLS TEP */}
      {calculadoraAtiva === 'wells_tep' && (
        <CardCalculadora
          meta={metaWellsTep}
          icone={Wind}
          corDestaque="sky"
          isFavorito={isFavorito('wells_tep')}
          onToggleFavorito={onToggleFavorito}
          onNavegarCalculadora={onNavegarCalculadora}
          textoProntuario={textoProntuarioWellsTep}
        >
          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={wellsTvp} onChange={(e) => setWellsTvp(e.target.checked)} />
              <span>Sinais clínicos ou sintomas de TVP (edema assimétrico, dor à palpação) (+3.0 pts)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={wellsAlt} onChange={(e) => setWellsAlt(e.target.checked)} />
              <span>Diagnóstico alternativo menos provável que TEP (+3.0 pts)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={wellsFc} onChange={(e) => setWellsFc(e.target.checked)} />
              <span>Frequência cardíaca &gt; 100 bpm (+1.5 pts)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={wellsImob} onChange={(e) => setWellsImob(e.target.checked)} />
              <span>Imobilização &ge; 3 dias ou cirurgia nas últimas 4 semanas (+1.5 pts)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={wellsHist} onChange={(e) => setWellsHist(e.target.checked)} />
              <span>Histórico prévio comprovado de TVP ou TEP (+1.5 pts)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={wellsHemo} onChange={(e) => setWellsHemo(e.target.checked)} />
              <span>Hemoptise (+1.0 pt)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={wellsMalign} onChange={(e) => setWellsMalign(e.target.checked)} />
              <span>Malignidade ativa ou em tratamento nos últimos 6 meses (+1.0 pt)</span>
            </label>
          </div>

          {resWellsTep && (
            <div className="p-4 bg-slate-900 border border-sky-500/20 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Pontuação Wells TEP</span>
                <span className="text-3xl font-extrabold text-sky-400 font-mono">
                  {resWellsTep.pontuacao_total.toFixed(1)}
                </span>
                <span className="text-xs text-slate-400 ml-1">pts</span>
              </div>
              <div className="text-right text-xs">
                <div className="font-bold text-slate-200">
                  {resWellsTep.categoria_risco} ({resWellsTep.probabilidade_clinica_percentual})
                </div>
                <div className="text-sky-300 mt-1">{resWellsTep.conduta_propedêutica}</div>
              </div>
            </div>
          )}
        </CardCalculadora>
      )}

      {/* 2. PERC */}
      {calculadoraAtiva === 'perc' && (
        <CardCalculadora
          meta={metaPerc}
          icone={ShieldCheck}
          corDestaque="emerald"
          isFavorito={isFavorito('perc')}
          onToggleFavorito={onToggleFavorito}
          onNavegarCalculadora={onNavegarCalculadora}
          textoProntuario={textoProntuarioPerc}
        >
          <div className="space-y-2 text-xs">
            <div className="p-2.5 bg-emerald-950/30 border border-emerald-800/40 rounded-xl text-emerald-300">
              Aplicável somente se o paciente for classificado como de <strong>Baixo Risco / TEP Improvável</strong> no
              Wells. Se <strong>todos os 8 critérios forem negativos (0 pts)</strong>, o TEP está descartado com
              segurança sem necessidade de D-dímero ou Angio-TC.
            </div>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={percIdade} onChange={(e) => setPercIdade(e.target.checked)} />
              <span>Idade &ge; 50 anos</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={percFc} onChange={(e) => setPercFc(e.target.checked)} />
              <span>Frequência cardíaca &ge; 100 bpm</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={percSat} onChange={(e) => setPercSat(e.target.checked)} />
              <span>Saturação de O2 em ar ambiente &lt; 95%</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={percEdema} onChange={(e) => setPercEdema(e.target.checked)} />
              <span>Edema unilateral de membro inferior</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={percHemo} onChange={(e) => setPercHemo(e.target.checked)} />
              <span>Hemoptise</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={percCirurgia} onChange={(e) => setPercCirurgia(e.target.checked)} />
              <span>Cirurgia ou trauma recente com anestesia geral nas últimas 4 semanas</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={percHist} onChange={(e) => setPercHist(e.target.checked)} />
              <span>Histórico prévio de TVP ou TEP</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={percHormonio} onChange={(e) => setPercHormonio(e.target.checked)} />
              <span>Uso de terapia com estrogênio (ACO, TRH)</span>
            </label>
          </div>

          {resPerc && (
            <div
              className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-center gap-3 ${
                resPerc.tep_descartado
                  ? 'bg-emerald-950/50 border-emerald-700/60'
                  : 'bg-amber-950/40 border-amber-800/40'
              }`}
            >
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Critérios PERC</span>
                <span
                  className={`text-2xl font-extrabold font-mono ${
                    resPerc.tep_descartado ? 'text-emerald-300' : 'text-amber-400'
                  }`}
                >
                  {resPerc.tep_descartado ? 'TEP DESCARTADO' : `${resPerc.criterios_positivos} Critério(s) Positivo(s)`}
                </span>
              </div>
              <div className="text-right text-xs">
                <div className="font-bold text-slate-200">
                  Risco residual: {resPerc.probabilidade_residual_percentual}
                </div>
                <div className="text-slate-300 mt-1">{resPerc.conduta}</div>
              </div>
            </div>
          )}
        </CardCalculadora>
      )}

      {/* 3. WELLS TVP */}
      {calculadoraAtiva === 'wells_tvp' && (
        <CardCalculadora
          meta={metaWellsTvp}
          icone={Activity}
          corDestaque="sky"
          isFavorito={isFavorito('wells_tvp')}
          onToggleFavorito={onToggleFavorito}
          onNavegarCalculadora={onNavegarCalculadora}
          textoProntuario={textoProntuarioWellsTvp}
        >
          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={tvpCancer} onChange={(e) => setTvpCancer(e.target.checked)} />
              <span>Câncer ativo ou em tratamento paliativo/curativo nos últimos 6 meses (+1 pt)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={tvpParalisia} onChange={(e) => setTvpParalisia(e.target.checked)} />
              <span>Paralisia, paresia ou imobilização gessada recente do membro inferior (+1 pt)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={tvpAcamado} onChange={(e) => setTvpAcamado(e.target.checked)} />
              <span>Acamado recentemente &ge; 3 dias ou grande cirurgia nas últimas 12 semanas (+1 pt)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={tvpDorTrajeto} onChange={(e) => setTvpDorTrajeto(e.target.checked)} />
              <span>Dor localizada ao longo do trajeto venoso profundo (+1 pt)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={tvpEdemaPerna} onChange={(e) => setTvpEdemaPerna(e.target.checked)} />
              <span>Edema de toda a perna (+1 pt)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={tvpEdemaPant} onChange={(e) => setTvpEdemaPant(e.target.checked)} />
              <span>Edema da panturrilha &gt; 3 cm em relação ao membro contralateral (+1 pt)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={tvpEdemaDepressivel}
                onChange={(e) => setTvpEdemaDepressivel(e.target.checked)}
              />
              <span>Edema depressível unilateral (cacifo maior na perna sintomática) (+1 pt)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={tvpVeiasColaterais}
                onChange={(e) => setTvpVeiasColaterais(e.target.checked)}
              />
              <span>Veias superficiais colaterais não varicosas (+1 pt)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={tvpHistPrevio} onChange={(e) => setTvpHistPrevio(e.target.checked)} />
              <span>Histórico prévio documentado de TVP (+1 pt)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer text-amber-300">
              <input type="checkbox" checked={tvpDiagAlt} onChange={(e) => setTvpDiagAlt(e.target.checked)} />
              <span>
                <strong>Diagnóstico alternativo</strong> tão provável ou mais provável que TVP (cisto de Baker, celulite)
                (-2 pts)
              </span>
            </label>
          </div>

          {resWellsTvp && (
            <div className="p-4 bg-slate-900 border border-sky-500/20 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Wells TVP Total</span>
                <span className="text-3xl font-extrabold text-sky-400 font-mono">{resWellsTvp.pontuacao_total}</span>
                <span className="text-xs text-slate-400 ml-1">pts</span>
              </div>
              <div className="text-right text-xs">
                <div className="font-bold text-slate-200">
                  {resWellsTvp.categoria_probabilidade} (Incidência: {resWellsTvp.incidencia_estimada})
                </div>
                <div className="text-sky-300 mt-1">{resWellsTvp.conduta_indicada}</div>
              </div>
            </div>
          )}
        </CardCalculadora>
      )}

      {/* 4. PÁDUA TEV */}
      {calculadoraAtiva === 'padua_tev' && (
        <CardCalculadora
          meta={metaPadua}
          icone={Stethoscope}
          corDestaque="amber"
          isFavorito={isFavorito('padua_tev')}
          onToggleFavorito={onToggleFavorito}
          onNavegarCalculadora={onNavegarCalculadora}
          textoProntuario={textoProntuarioPadua}
        >
          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={paduaCancer} onChange={(e) => setPaduaCancer(e.target.checked)} />
              <span>Câncer ativo (+3 pts)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={paduaTev} onChange={(e) => setPaduaTev(e.target.checked)} />
              <span>Tromboembolismo venoso prévio (+3 pts)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={paduaMob} onChange={(e) => setPaduaMob(e.target.checked)} />
              <span>Mobilidade reduzida (acamado &ge; 3 dias) (+3 pts)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={paduaTrombofilia}
                onChange={(e) => setPaduaTrombofilia(e.target.checked)}
              />
              <span>Trombofilia congênita ou adquirida conhecida (+3 pts)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={paduaTrauma} onChange={(e) => setPaduaTrauma(e.target.checked)} />
              <span>Trauma ou cirurgia recente no último mês (+2 pts)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={paduaIdade} onChange={(e) => setPaduaIdade(e.target.checked)} />
              <span>Idade &ge; 70 anos (+1 pt)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={paduaIcResp} onChange={(e) => setPaduaIcResp(e.target.checked)} />
              <span>Insuficiência cardíaca ou respiratória descompensada (+1 pt)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={paduaIamAvc} onChange={(e) => setPaduaIamAvc(e.target.checked)} />
              <span>IAM ou AVC isquêmico agudo (+1 pt)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={paduaInfec} onChange={(e) => setPaduaInfec(e.target.checked)} />
              <span>Infecção aguda e/ou doença reumatológica ativa (+1 pt)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={paduaImc} onChange={(e) => setPaduaImc(e.target.checked)} />
              <span>Obesidade (IMC &ge; 30 kg/m²) (+1 pt)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={paduaHorm} onChange={(e) => setPaduaHorm(e.target.checked)} />
              <span>Tratamento hormonal contínuo (+1 pt)</span>
            </label>
          </div>

          {resPadua && (
            <div className="p-4 bg-slate-900 border border-amber-500/20 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Escore de Pádua Total</span>
                <span className="text-3xl font-extrabold text-amber-400 font-mono">{resPadua.pontuacao_total}</span>
                <span className="text-xs text-slate-400 ml-1">pts</span>
              </div>
              <div className="text-right text-xs">
                <div className="font-bold text-slate-200">
                  {resPadua.alto_risco_tev ? 'Alto Risco de TEV (≥ 4 pts)' : 'Baixo Risco de TEV (< 4 pts)'}
                </div>
                <div className="text-teal-400 mt-1 font-semibold">{resPadua.esquema_enoxaparina}</div>
              </div>
            </div>
          )}
        </CardCalculadora>
      )}

      {/* 5. CURB-65 */}
      {calculadoraAtiva === 'curb65' && (
        <CardCalculadora
          meta={metaCurb}
          icone={AlertOctagon}
          corDestaque="amber"
          isFavorito={isFavorito('curb65')}
          onToggleFavorito={onToggleFavorito}
          onNavegarCalculadora={onNavegarCalculadora}
          textoProntuario={textoProntuarioCurb}
        >
          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2 p-2.5 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={curbConfusao} onChange={(e) => setCurbConfusao(e.target.checked)} />
              <span>
                <strong>C:</strong> Confusão mental aguda (AMTS &le; 8 ou desorientação têmpora-espacial) (+1 pt)
              </span>
            </label>
            <label className="flex items-center gap-2 p-2.5 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={curbUreia} onChange={(e) => setCurbUreia(e.target.checked)} />
              <span>
                <strong>U:</strong> Ureia sérica &gt; 50 mg/dL (&gt; 7 mmol/L) (+1 pt)
              </span>
            </label>
            <label className="flex items-center gap-2 p-2.5 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={curbFr} onChange={(e) => setCurbFr(e.target.checked)} />
              <span>
                <strong>R:</strong> Frequência respiratória &ge; 30 irpm (+1 pt)
              </span>
            </label>
            <label className="flex items-center gap-2 p-2.5 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={curbHipotensao} onChange={(e) => setCurbHipotensao(e.target.checked)} />
              <span>
                <strong>B:</strong> Pressão arterial baixa (PAS &lt; 90 mmHg ou PAD &le; 60 mmHg) (+1 pt)
              </span>
            </label>
            <label className="flex items-center gap-2 p-2.5 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={curbIdade65} onChange={(e) => setCurbIdade65(e.target.checked)} />
              <span>
                <strong>65:</strong> Idade &ge; 65 anos (+1 pt)
              </span>
            </label>
          </div>

          {resCurb && (
            <div className="p-4 bg-slate-900 border border-amber-500/20 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">CURB-65 Total</span>
                <span className="text-3xl font-extrabold text-amber-400 font-mono">{resCurb.pontuacao}</span>
                <span className="text-xs text-slate-400 ml-1">/ 5 pts</span>
              </div>
              <div className="text-right text-xs">
                <div className="font-bold text-slate-200">Mortalidade: {resCurb.estrato_mortalidade}</div>
                <div className="text-amber-300 mt-1">{resCurb.recomendacao_local_tratamento}</div>
              </div>
            </div>
          )}
        </CardCalculadora>
      )}
    </>
  );
};
