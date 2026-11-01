import React, { useState, useEffect, useMemo } from 'react';
import { Heart, Activity, ShieldAlert, Zap, AlertCircle } from 'lucide-react';
import {
  ResultadoHeartScore,
  ResultadoCha2ds2Va,
  ResultadoHasBled,
  ResultadoQtcCorrigido,
  ResultadoEscoreTisdale,
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

export const CalculadorasCardio: React.FC<Props> = ({
  calculadoraAtiva,
  isFavorito,
  onToggleFavorito,
  onNavegarCalculadora,
}) => {
  // 1. HEART Score
  const [heartHistoria, setHeartHistoria] = useState<number>(1);
  const [heartEcg, setHeartEcg] = useState<number>(0);
  const [heartIdade, setHeartIdade] = useState<number>(1);
  const [heartFatores, setHeartFatores] = useState<number>(1);
  const [heartTropo, setHeartTropo] = useState<number>(0);
  const [resHeart, setResHeart] = useState<ResultadoHeartScore | null>(null);

  useEffect(() => {
    if (calculadoraAtiva !== 'heart_score') return;
    executarCalculoClinico<ResultadoHeartScore>('heart_score', {
      historia: heartHistoria,
      ecg: heartEcg,
      idade: heartIdade,
      fatores_risco: heartFatores,
      troponina: heartTropo,
    })
      .then(setResHeart)
      .catch(() => setResHeart(null));
  }, [calculadoraAtiva, heartHistoria, heartEcg, heartIdade, heartFatores, heartTropo]);

  const textoProntuarioHeart = useMemo(() => {
    if (!resHeart) return '';
    return `[HEART SCORE - ESTRATIFICAÇÃO DE DOR TORÁCICA NO PS]\nPontuação Total: ${resHeart.pontuacao_total}/10 pts -> Risco: ${resHeart.categoria_risco} (MACE em 6 semanas: ${resHeart.mace_percentual})\nCritérios: História: ${heartHistoria} | ECG: ${heartEcg} | Idade: ${heartIdade} | Fatores: ${heartFatores} | Troponina: ${heartTropo}\nConduta Sugerida: ${resHeart.conduta_sugerida}`;
  }, [resHeart, heartHistoria, heartEcg, heartIdade, heartFatores, heartTropo]);

  // 2. CHA2DS2-VA (ESC 2024)
  const [chaIc, setChaIc] = useState<boolean>(true);
  const [chaHas, setChaHas] = useState<boolean>(true);
  const [chaIdade, setChaIdade] = useState<number>(72);
  const [chaDm, setChaDm] = useState<boolean>(false);
  const [chaAvc, setChaAvc] = useState<boolean>(false);
  const [chaVasc, setChaVasc] = useState<boolean>(false);
  const [resCha, setResCha] = useState<ResultadoCha2ds2Va | null>(null);

  useEffect(() => {
    if (calculadoraAtiva !== 'cha2ds2_va') return;
    executarCalculoClinico<ResultadoCha2ds2Va>('cha2ds2_va', {
      insuficiencia_cardiaca: chaIc,
      hipertensao: chaHas,
      idade: chaIdade,
      diabetes: chaDm,
      avc_ou_ait_previo: chaAvc,
      doenca_vascular: chaVasc,
    })
      .then(setResCha)
      .catch(() => setResCha(null));
  }, [calculadoraAtiva, chaIc, chaHas, chaIdade, chaDm, chaAvc, chaVasc]);

  const textoProntuarioCha = useMemo(() => {
    if (!resCha) return '';
    return `[CHA2DS2-VA (DIRETRIZ ESC 2024) - RISCO DE AVC NA FIBRILAÇÃO ATRIAL]\nPontuação: ${resCha.pontuacao} pts -> Categoria: ${resCha.categoria_risco}\nTaxa estimada de AVC/ano: ${resCha.taxa_avc_anual_estimada}\nRecomendação: ${resCha.recomendacao_anticoagulacao}`;
  }, [resCha]);

  // 3. HAS-BLED
  const [hasHas, setHasHas] = useState<boolean>(true);
  const [hasRenal, setHasRenal] = useState<boolean>(false);
  const [hasHep, setHasHep] = useState<boolean>(false);
  const [hasAvc, setHasAvc] = useState<boolean>(false);
  const [hasSang, setHasSang] = useState<boolean>(false);
  const [hasInr, setHasInr] = useState<boolean>(false);
  const [hasIdade, setHasIdade] = useState<boolean>(true);
  const [hasDrogas, setHasDrogas] = useState<boolean>(false);
  const [hasAine, setHasAine] = useState<boolean>(false);
  const [resHasBled, setResHasBled] = useState<ResultadoHasBled | null>(null);

  useEffect(() => {
    if (calculadoraAtiva !== 'has_bled') return;
    executarCalculoClinico<ResultadoHasBled>('has_bled', {
      hipertensao_nao_controlada: hasHas,
      funcao_renal_anormal: hasRenal,
      funcao_hepatica_anormal: hasHep,
      avc_previo: hasAvc,
      historico_ou_predisposicao_sangramento: hasSang,
      inr_labil: hasInr,
      idade_maior_65: hasIdade,
      uso_drogas_ou_alcool: hasDrogas,
      uso_antiplaquetarios_ou_aines: hasAine,
    })
      .then(setResHasBled)
      .catch(() => setResHasBled(null));
  }, [calculadoraAtiva, hasHas, hasRenal, hasHep, hasAvc, hasSang, hasInr, hasIdade, hasDrogas, hasAine]);

  const textoProntuarioHasBled = useMemo(() => {
    if (!resHasBled) return '';
    return `[HAS-BLED - RISCO DE SANGRAMENTO MAIOR NA ANTICOAGULAÇÃO]\nPontuação Total: ${resHasBled.pontuacao_total} pts -> Categoria: ${resHasBled.categoria_risco}\nTaxa anual de sangramento maior: ${resHasBled.taxa_sangramento_anual}\nRecomendação: ${resHasBled.recomendacao_anticoagulacao}\nFatores modificáveis a corrigir: ${resHasBled.fatores_modificaveis.join(', ') || 'Nenhum identificado'}`;
  }, [resHasBled]);

  // 4. QTc Corrigido
  const [qtMs, setQtMs] = useState<number>(420);
  const [fcBpm, setFcBpm] = useState<number>(75);
  const [sexoFemQtc, setSexoFemQtc] = useState<boolean>(false);
  const [resQtc, setResQtc] = useState<ResultadoQtcCorrigido | null>(null);

  useEffect(() => {
    if (calculadoraAtiva !== 'qtc_corrigido') return;
    executarCalculoClinico<ResultadoQtcCorrigido>('qtc_corrigido', {
      qt_medido_ms: qtMs,
      fc_bpm: fcBpm,
      sexo_feminino: sexoFemQtc,
    })
      .then(setResQtc)
      .catch(() => setResQtc(null));
  }, [calculadoraAtiva, qtMs, fcBpm, sexoFemQtc]);

  const textoProntuarioQtc = useMemo(() => {
    if (!resQtc) return '';
    return `[QTc CORRIGIDO (BAZETT, FRIDERICIA, FRAMINGHAM)]\nQT medido: ${qtMs} ms | FC: ${fcBpm} bpm | Sexo: ${sexoFemQtc ? 'Feminino' : 'Masculino'}\n- QTc Bazett: ${resQtc.qtc_bazett_ms.toFixed(0)} ms\n- QTc Fridericia: ${resQtc.qtc_fridericia_ms.toFixed(0)} ms\n- QTc Framingham: ${resQtc.qtc_framingham_ms.toFixed(0)} ms\nStatus: ${resQtc.status_intervalo} | Alerta Torsades: ${resQtc.alerta_torsades ? 'RISCO ELEVADO' : 'Baixo Risco'}\nRecomendação: ${resQtc.recomendacao}`;
  }, [resQtc, qtMs, fcBpm, sexoFemQtc]);

  // 5. Tisdale
  const [tisdaleIdade, setTisdaleIdade] = useState<boolean>(false);
  const [tisdaleFem, setTisdaleFem] = useState<boolean>(false);
  const [tisdaleAlca, setTisdaleAlca] = useState<boolean>(false);
  const [tisdaleK, setTisdaleK] = useState<boolean>(false);
  const [tisdaleQtc450, setTisdaleQtc450] = useState<boolean>(false);
  const [tisdaleIam, setTisdaleIam] = useState<boolean>(false);
  const [tisdaleDrogasQt, setTisdaleDrogasQt] = useState<number>(1);
  const [tisdaleSepse, setTisdaleSepse] = useState<boolean>(false);
  const [tisdaleIc, setTisdaleIc] = useState<boolean>(false);
  const [resTisdale, setResTisdale] = useState<ResultadoEscoreTisdale | null>(null);

  useEffect(() => {
    if (calculadoraAtiva !== 'tisdale') return;
    executarCalculoClinico<ResultadoEscoreTisdale>('escore_tisdale', {
      idade_ge_68: tisdaleIdade,
      sexo_feminino: tisdaleFem,
      uso_diuretico_alca: tisdaleAlca,
      potassio_le_3_5: tisdaleK,
      qtc_admissional_ge_450: tisdaleQtc450,
      infarto_agudo_recente: tisdaleIam,
      numero_drogas_prolongadoras_qt: tisdaleDrogasQt,
      sepse: tisdaleSepse,
      insuficiencia_cardiaca: tisdaleIc,
    })
      .then(setResTisdale)
      .catch(() => setResTisdale(null));
  }, [
    calculadoraAtiva,
    tisdaleIdade,
    tisdaleFem,
    tisdaleAlca,
    tisdaleK,
    tisdaleQtc450,
    tisdaleIam,
    tisdaleDrogasQt,
    tisdaleSepse,
    tisdaleIc,
  ]);

  const textoProntuarioTisdale = useMemo(() => {
    if (!resTisdale) return '';
    return `[ESCORE DE TISDALE - RISCO DE PROLONGAMENTO DE QTc HOSPITALAR]\nPontuação: ${resTisdale.pontuacao_total} pts -> Categoria: ${resTisdale.categoria_risco} (Incidência estimada: ${resTisdale.risco_estimado_percentual})\nRecomendação: ${resTisdale.recomendacao_monitorizacao}`;
  }, [resTisdale]);

  const metaHeart = CATALOGO_CALCULADORAS.find((c) => c.id === 'heart_score')!;
  const metaCha = CATALOGO_CALCULADORAS.find((c) => c.id === 'cha2ds2_va')!;
  const metaHasBled = CATALOGO_CALCULADORAS.find((c) => c.id === 'has_bled')!;
  const metaQtc = CATALOGO_CALCULADORAS.find((c) => c.id === 'qtc_corrigido')!;
  const metaTisdale = CATALOGO_CALCULADORAS.find((c) => c.id === 'tisdale')!;

  return (
    <>
      {/* 1. HEART SCORE */}
      {calculadoraAtiva === 'heart_score' && (
        <CardCalculadora
          meta={metaHeart}
          icone={Heart}
          corDestaque="rose"
          isFavorito={isFavorito('heart_score')}
          onToggleFavorito={onToggleFavorito}
          onNavegarCalculadora={onNavegarCalculadora}
          textoProntuario={textoProntuarioHeart}
        >
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">H - História Clínica</label>
              <ChipSegmentado<number>
                valor={heartHistoria}
                opcoes={[
                  { valor: 0, rotulo: 'Pouco Suspeita', pontos: '0 pt' },
                  { valor: 1, rotulo: 'Moderadamente Suspeita', pontos: '+1 pt' },
                  { valor: 2, rotulo: 'Altamente Típica', pontos: '+2 pts' },
                ]}
                onChange={setHeartHistoria}
                corAtiva="bg-rose-600"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">E - Eletrocardiograma (ECG)</label>
              <ChipSegmentado<number>
                valor={heartEcg}
                opcoes={[
                  { valor: 0, rotulo: 'Normal', pontos: '0 pt' },
                  { valor: 1, rotulo: 'Repolarização Inespecífica / HVE', pontos: '+1 pt' },
                  { valor: 2, rotulo: 'Desvio de ST Significativo (sem BRE)', pontos: '+2 pts' },
                ]}
                onChange={setHeartEcg}
                corAtiva="bg-rose-600"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">A - Idade (Age)</label>
              <ChipSegmentado<number>
                valor={heartIdade}
                opcoes={[
                  { valor: 0, rotulo: '< 45 anos', pontos: '0 pt' },
                  { valor: 1, rotulo: '45 a 64 anos', pontos: '+1 pt' },
                  { valor: 2, rotulo: '≥ 65 anos', pontos: '+2 pts' },
                ]}
                onChange={setHeartIdade}
                corAtiva="bg-rose-600"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">R - Fatores de Risco Cardiovascular</label>
              <ChipSegmentado<number>
                valor={heartFatores}
                opcoes={[
                  { valor: 0, rotulo: 'Sem fatores de risco', pontos: '0 pt' },
                  { valor: 1, rotulo: '1 ou 2 fatores (HAS, DM, DLP, Fumo)', pontos: '+1 pt' },
                  { valor: 2, rotulo: '≥ 3 fatores ou DAC prévia documentada', pontos: '+2 pts' },
                ]}
                onChange={setHeartFatores}
                corAtiva="bg-rose-600"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">T - Troponina Admissional</label>
              <ChipSegmentado<number>
                valor={heartTropo}
                opcoes={[
                  { valor: 0, rotulo: '≤ Limite Superior Normal (Normal)', pontos: '0 pt' },
                  { valor: 1, rotulo: '1 a 3x o Limite Superior', pontos: '+1 pt' },
                  { valor: 2, rotulo: '> 3x o Limite Superior', pontos: '+2 pts' },
                ]}
                onChange={setHeartTropo}
                corAtiva="bg-rose-600"
              />
            </div>
          </div>

          {resHeart && (
            <div className="p-4 bg-slate-900 border border-rose-500/20 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">HEART Score</span>
                <span className="text-3xl font-extrabold text-rose-400 font-mono">{resHeart.pontuacao_total}</span>
                <span className="text-xs text-slate-400 ml-1">/ 10 pts</span>
              </div>
              <div className="text-right text-xs">
                <div className="font-bold text-slate-200">
                  {resHeart.categoria_risco} (MACE: {resHeart.mace_percentual})
                </div>
                <div className="text-slate-300 mt-1">{resHeart.conduta_sugerida}</div>
              </div>
            </div>
          )}
        </CardCalculadora>
      )}

      {/* 2. CHA2DS2-VA */}
      {calculadoraAtiva === 'cha2ds2_va' && (
        <CardCalculadora
          meta={metaCha}
          icone={Activity}
          corDestaque="emerald"
          isFavorito={isFavorito('cha2ds2_va')}
          onToggleFavorito={onToggleFavorito}
          onNavegarCalculadora={onNavegarCalculadora}
          textoProntuario={textoProntuarioCha}
        >
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-slate-900 rounded-xl flex items-center justify-between">
              <label className="text-slate-300 font-semibold">Idade do Paciente</label>
              <input
                type="number"
                value={chaIdade}
                onChange={(e) => setChaIdade(parseInt(e.target.value) || 0)}
                className="w-24 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-100 font-mono text-right"
              />
            </div>
            <label className="flex items-center gap-2 p-2.5 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={chaIc} onChange={(e) => setChaIc(e.target.checked)} />
              <span>
                <strong>C:</strong> Insuficiência Cardíaca Congênita / FEVE ≤ 40% (+1 pt)
              </span>
            </label>
            <label className="flex items-center gap-2 p-2.5 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={chaHas} onChange={(e) => setChaHas(e.target.checked)} />
              <span>
                <strong>H:</strong> Hipertensão Arterial Sistêmica (+1 pt)
              </span>
            </label>
            <label className="flex items-center gap-2 p-2.5 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={chaDm} onChange={(e) => setChaDm(e.target.checked)} />
              <span>
                <strong>D:</strong> Diabetes Mellitus (+1 pt)
              </span>
            </label>
            <label className="flex items-center gap-2 p-2.5 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={chaAvc} onChange={(e) => setChaAvc(e.target.checked)} />
              <span>
                <strong>S2:</strong> AVC, AIT ou Tromboembolismo Prévio (+2 pts)
              </span>
            </label>
            <label className="flex items-center gap-2 p-2.5 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={chaVasc} onChange={(e) => setChaVasc(e.target.checked)} />
              <span>
                <strong>V:</strong> Doença Vascular (IAM prévio, DAOP ou placa aórtica) (+1 pt)
              </span>
            </label>
          </div>

          {resCha && (
            <div className="p-4 bg-slate-900 border border-emerald-500/20 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Pontuação CHA2DS2-VA</span>
                <span className="text-3xl font-extrabold text-emerald-400 font-mono">{resCha.pontuacao}</span>
                <span className="text-xs text-slate-400 ml-1">pts</span>
              </div>
              <div className="text-right text-xs">
                <div className="font-bold text-slate-200">
                  {resCha.categoria_risco} (AVC: {resCha.taxa_avc_anual_estimada})
                </div>
                <div className="text-emerald-300 mt-1">{resCha.recomendacao_anticoagulacao}</div>
              </div>
            </div>
          )}
        </CardCalculadora>
      )}

      {/* 3. HAS-BLED */}
      {calculadoraAtiva === 'has_bled' && (
        <CardCalculadora
          meta={metaHasBled}
          icone={ShieldAlert}
          corDestaque="amber"
          isFavorito={isFavorito('has_bled')}
          onToggleFavorito={onToggleFavorito}
          onNavegarCalculadora={onNavegarCalculadora}
          textoProntuario={textoProntuarioHasBled}
        >
          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={hasHas} onChange={(e) => setHasHas(e.target.checked)} />
              <span>
                <strong>H:</strong> Hipertensão não controlada (PAS &gt; 160 mmHg) (+1 pt)
              </span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={hasRenal} onChange={(e) => setHasRenal(e.target.checked)} />
              <span>
                <strong>A (Renal):</strong> Doença Renal Crônica (Diálise, transplante ou Cr &ge; 2,26 mg/dL) (+1 pt)
              </span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={hasHep} onChange={(e) => setHasHep(e.target.checked)} />
              <span>
                <strong>A (Hepática):</strong> Doença hepática crônica (Cirrose, Bilirrubina &gt; 2x ou AST/ALT &gt; 3x) (+1 pt)
              </span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={hasAvc} onChange={(e) => setHasAvc(e.target.checked)} />
              <span>
                <strong>S:</strong> Histórico de AVC prévio (+1 pt)
              </span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={hasSang} onChange={(e) => setHasSang(e.target.checked)} />
              <span>
                <strong>B:</strong> Sangramento prévio maior ou predisposição à hemorragia (+1 pt)
              </span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={hasInr} onChange={(e) => setHasInr(e.target.checked)} />
              <span>
                <strong>L:</strong> INR lábil em uso de varfarina (tempo na faixa terapêutica &lt; 60%) (+1 pt)
              </span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={hasIdade} onChange={(e) => setHasIdade(e.target.checked)} />
              <span>
                <strong>E:</strong> Idade &gt; 65 anos (+1 pt)
              </span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={hasDrogas} onChange={(e) => setHasDrogas(e.target.checked)} />
              <span>
                <strong>D (Álcool/Drogas):</strong> Abuso de substâncias ou &ge; 8 doses alcoólicas/semana (+1 pt)
              </span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={hasAine} onChange={(e) => setHasAine(e.target.checked)} />
              <span>
                <strong>D (Fármacos):</strong> Uso concomitante de antiplaquetários ou AINEs (+1 pt)
              </span>
            </label>
          </div>

          {resHasBled && (
            <div className="p-4 bg-slate-900 border border-amber-500/20 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">HAS-BLED Total</span>
                <span className="text-3xl font-extrabold text-amber-400 font-mono">{resHasBled.pontuacao_total}</span>
                <span className="text-xs text-slate-400 ml-1">pts</span>
              </div>
              <div className="text-right text-xs">
                <div className="font-bold text-slate-200">
                  {resHasBled.categoria_risco} ({resHasBled.taxa_sangramento_anual}/ano)
                </div>
                <div className="text-amber-300 mt-1">{resHasBled.recomendacao_anticoagulacao}</div>
              </div>
            </div>
          )}
        </CardCalculadora>
      )}

      {/* 4. QTc CORRIGIDO */}
      {calculadoraAtiva === 'qtc_corrigido' && (
        <CardCalculadora
          meta={metaQtc}
          icone={Zap}
          corDestaque="sky"
          isFavorito={isFavorito('qtc_corrigido')}
          onToggleFavorito={onToggleFavorito}
          onNavegarCalculadora={onNavegarCalculadora}
          textoProntuario={textoProntuarioQtc}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">QT Medido no ECG (ms)</label>
              <input
                type="number"
                value={qtMs}
                onChange={(e) => setQtMs(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Frequência Cardíaca (bpm)</label>
              <input
                type="number"
                value={fcBpm}
                onChange={(e) => setFcBpm(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Sexo Biológico</label>
              <ChipSegmentado<boolean>
                valor={sexoFemQtc}
                opcoes={[
                  { valor: false, rotulo: 'Masculino (Normal ≤ 450 ms)' },
                  { valor: true, rotulo: 'Feminino (Normal ≤ 460 ms)' },
                ]}
                onChange={setSexoFemQtc}
                corAtiva="bg-sky-600"
              />
            </div>
          </div>

          {resQtc && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Fórmula de Bazett</span>
                  <strong className="text-xl font-bold text-sky-400 font-mono">
                    {resQtc.qtc_bazett_ms.toFixed(0)} ms
                  </strong>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Fórmula de Fridericia</span>
                  <strong className="text-xl font-bold text-teal-400 font-mono">
                    {resQtc.qtc_fridericia_ms.toFixed(0)} ms
                  </strong>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Fórmula de Framingham</span>
                  <strong className="text-xl font-bold text-emerald-400 font-mono">
                    {resQtc.qtc_framingham_ms.toFixed(0)} ms
                  </strong>
                </div>
              </div>

              <div
                className={`p-3 rounded-xl border text-xs flex justify-between items-center ${
                  resQtc.alerta_torsades
                    ? 'bg-rose-950/60 border-rose-700 text-rose-200'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div>
                  <strong>Status:</strong> {resQtc.status_intervalo} &bull; {resQtc.recomendacao}
                </div>
                {resQtc.alerta_torsades && (
                  <span className="px-2 py-1 bg-rose-600 text-white rounded font-bold uppercase text-[10px]">
                    Alerta Torsades
                  </span>
                )}
              </div>
            </div>
          )}
        </CardCalculadora>
      )}

      {/* 5. TISDALE */}
      {calculadoraAtiva === 'tisdale' && (
        <CardCalculadora
          meta={metaTisdale}
          icone={AlertCircle}
          corDestaque="purple"
          isFavorito={isFavorito('tisdale')}
          onToggleFavorito={onToggleFavorito}
          onNavegarCalculadora={onNavegarCalculadora}
          textoProntuario={textoProntuarioTisdale}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={tisdaleIdade} onChange={(e) => setTisdaleIdade(e.target.checked)} />
              <span>Idade &ge; 68 anos (+1 pt)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={tisdaleFem} onChange={(e) => setTisdaleFem(e.target.checked)} />
              <span>Sexo Feminino (+1 pt)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={tisdaleAlca} onChange={(e) => setTisdaleAlca(e.target.checked)} />
              <span>Uso de diurético de alça (+1 pt)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={tisdaleK} onChange={(e) => setTisdaleK(e.target.checked)} />
              <span>Potássio sérico &le; 3,5 mEq/L (+2 pts)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={tisdaleQtc450} onChange={(e) => setTisdaleQtc450(e.target.checked)} />
              <span>QTc basal admissional &ge; 450 ms (+2 pts)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={tisdaleIam} onChange={(e) => setTisdaleIam(e.target.checked)} />
              <span>Infarto agudo do miocárdio recente (+2 pts)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={tisdaleSepse} onChange={(e) => setTisdaleSepse(e.target.checked)} />
              <span>Sepse (+1 pt)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={tisdaleIc} onChange={(e) => setTisdaleIc(e.target.checked)} />
              <span>Insuficiência cardíaca (+1 pt)</span>
            </label>
            <div className="col-span-1 sm:col-span-2 p-2 bg-slate-900 rounded-xl border border-slate-800">
              <label className="block text-slate-300 font-semibold mb-1">Número de Fármacos Prolongadores do QT</label>
              <ChipSegmentado<number>
                valor={tisdaleDrogasQt}
                opcoes={[
                  { valor: 0, rotulo: 'Nenhum', pontos: '0 pt' },
                  { valor: 1, rotulo: '1 fármaco prolongador', pontos: '+3 pts' },
                  { valor: 2, rotulo: '≥ 2 fármacos prolongadores', pontos: '+6 pts' },
                ]}
                onChange={setTisdaleDrogasQt}
                corAtiva="bg-purple-600"
              />
            </div>
          </div>

          {resTisdale && (
            <div className="p-4 bg-slate-900 border border-purple-500/20 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Tisdale Total</span>
                <span className="text-3xl font-extrabold text-purple-400 font-mono">{resTisdale.pontuacao_total}</span>
                <span className="text-xs text-slate-400 ml-1">pts</span>
              </div>
              <div className="text-right text-xs">
                <div className="font-bold text-slate-200">
                  {resTisdale.categoria_risco} ({resTisdale.risco_estimado_percentual})
                </div>
                <div className="text-purple-300 mt-1">{resTisdale.recomendacao_monitorizacao}</div>
              </div>
            </div>
          )}
        </CardCalculadora>
      )}
    </>
  );
};
