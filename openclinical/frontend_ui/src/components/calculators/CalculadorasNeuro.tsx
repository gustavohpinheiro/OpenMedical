import React, { useState, useEffect, useMemo } from 'react';
import { Eye, Zap, Shield, AlertTriangle } from 'lucide-react';
import { ResultadoGlasgowP, ResultadoTromboliseAvc, ResultadoCranioCervical } from '../../types';
import { executarCalculoClinico } from '../../api';
import { CardCalculadora, ChipSegmentado } from './CalculadoraShared';
import { CATALOGO_CALCULADORAS } from './catalogo';

interface Props {
  calculadoraAtiva: string;
  isFavorito: (id: string) => boolean;
  onToggleFavorito: (id: string) => void;
  onNavegarCalculadora: (id: string) => void;
}

export const CalculadorasNeuro: React.FC<Props> = ({
  calculadoraAtiva,
  isFavorito,
  onToggleFavorito,
  onNavegarCalculadora,
}) => {
  // 1. Glasgow-P
  const [gcsOlhos, setGcsOlhos] = useState<number>(4);
  const [gcsVerbal, setGcsVerbal] = useState<number>(5);
  const [gcsMotor, setGcsMotor] = useState<number>(6);
  const [gcsPupilas, setGcsPupilas] = useState<number>(2);
  const [resGlasgow, setResGlasgow] = useState<ResultadoGlasgowP | null>(null);

  useEffect(() => {
    if (calculadoraAtiva !== 'glasgow_p') return;
    executarCalculoClinico<ResultadoGlasgowP>('glasgow_p', {
      abertura_ocular: gcsOlhos,
      resposta_verbal: gcsVerbal,
      resposta_motora: gcsMotor,
      pupilas_reagentes: gcsPupilas,
    })
      .then(setResGlasgow)
      .catch(() => setResGlasgow(null));
  }, [calculadoraAtiva, gcsOlhos, gcsVerbal, gcsMotor, gcsPupilas]);

  const textoProntuarioGlasgow = useMemo(() => {
    if (!resGlasgow) return '';
    return `[ESCALA DE COMA DE GLASGOW COM REATIVIDADE PUPILAR (GCS-P)]\n- Ocular: ${gcsOlhos}/4 | Verbal: ${gcsVerbal}/5 | Motora: ${gcsMotor}/6 -> GCS Basal: ${resGlasgow.escore_glasgow}/15\n- Reatividade Pupilar: ${gcsPupilas === 2 ? 'Ambas reagem (0 pt)' : gcsPupilas === 1 ? 'Apenas 1 reage (-1 pt)' : 'Nenhuma reage (-2 pts)'}\n-> GCS-P Final: ${resGlasgow.gcs_p_final} pts (${resGlasgow.gravidade_tce})\nConduta: ${resGlasgow.conduta}${resGlasgow.indicacao_intubacao ? ' [ALERTA: INDICAÇÃO DE INTUBAÇÃO OROTRAQUEAL IMEDIATA]' : ''}`;
  }, [resGlasgow, gcsOlhos, gcsVerbal, gcsMotor, gcsPupilas]);

  // 2. Trombólise AVC
  const [avcPeso, setAvcPeso] = useState<number>(70);
  const [avcPas, setAvcPas] = useState<number>(160);
  const [avcPad, setAvcPad] = useState<number>(95);
  const [avcDeltaT, setAvcDeltaT] = useState<number>(2.5);
  const [avcTc, setAvcTc] = useState<boolean>(true);
  const [avcGlicemia, setAvcGlicemia] = useState<number>(130);
  const [avcPlaquetas, setAvcPlaquetas] = useState<number>(220000);
  const [avcInr, setAvcInr] = useState<number>(1.1);
  const [avcTtpa, setAvcTtpa] = useState<boolean>(false);
  const [avcDoac, setAvcDoac] = useState<boolean>(false);
  const [avcTce3m, setAvcTce3m] = useState<boolean>(false);
  const [avcCirurg14d, setAvcCirurg14d] = useState<boolean>(false);
  const [avcSang21d, setAvcSang21d] = useState<boolean>(false);
  const [avcPuncao7d, setAvcPuncao7d] = useState<boolean>(false);
  const [resAvc, setResAvc] = useState<ResultadoTromboliseAvc | null>(null);

  useEffect(() => {
    if (calculadoraAtiva !== 'trombolise_avc') return;
    executarCalculoClinico<ResultadoTromboliseAvc>('trombolise_avc', {
      peso_kg: avcPeso,
      pressao_sistolica: avcPas,
      pressao_diastolica: avcPad,
      tempo_inicio_sintomas_horas: avcDeltaT,
      avc_isquemico_confirmado_tc: avcTc,
      glicemia_mg_dl: avcGlicemia,
      plaquetas: avcPlaquetas,
      inr: avcInr,
      ttpa_prolongado: avcTtpa,
      uso_anticoagulante_oral_direto_48h: avcDoac,
      avc_grave_ou_tce_ultimos_3_meses: avcTce3m,
      cirurgia_grande_porte_ou_trauma_grave_14d: avcCirurg14d,
      sangramento_interno_ativo_21d: avcSang21d,
      puncao_arterial_sitio_nao_compressivel_7d: avcPuncao7d,
    })
      .then(setResAvc)
      .catch(() => setResAvc(null));
  }, [
    calculadoraAtiva,
    avcPeso,
    avcPas,
    avcPad,
    avcDeltaT,
    avcTc,
    avcGlicemia,
    avcPlaquetas,
    avcInr,
    avcTtpa,
    avcDoac,
    avcTce3m,
    avcCirurg14d,
    avcSang21d,
    avcPuncao7d,
  ]);

  const textoProntuarioAvc = useMemo(() => {
    if (!resAvc) return '';
    return `[PROTOCOLO DE TROMBÓLISE NO AVC ISQUÊMICO AGUDO]\nPeso: ${avcPeso} kg | Delta T: ${avcDeltaT}h | PA: ${avcPas}/${avcPad} mmHg\n- Dose Total Alteplase (0,9 mg/kg - máx 90mg): ${resAvc.dose_total_alteplase_mg.toFixed(1)} mg\n  * Bolus 10% IV em 1 min: ${resAvc.bolus_alteplase_10_porcento_mg.toFixed(1)} mg\n  * Infusão contínua 90% em 60 min: ${resAvc.infusao_alteplase_90_porcento_mg_h.toFixed(1)} mg/h\n- Dose Alternativa Tenecteplase (0,25 mg/kg - máx 25mg): ${resAvc.dose_tenecteplase_mg.toFixed(1)} mg em bolus único\nMetas de PA: ${resAvc.metas_pressoricas}\nContraindicações detectadas: ${resAvc.contraindicacoes_absolutas.length > 0 ? resAvc.contraindicacoes_absolutas.join('; ') : 'NENHUMA contraindicação absoluta detectada'}`;
  }, [resAvc, avcPeso, avcDeltaT, avcPas, avcPad]);

  // 3. Canadian CT Head & NEXUS
  const [canGcs15, setCanGcs15] = useState(false);
  const [canFratura, setCanFratura] = useState(false);
  const [canBaseCranio, setCanBaseCranio] = useState(false);
  const [canVomito, setCanVomito] = useState(false);
  const [canIdade65, setCanIdade65] = useState(false);
  const [canAmnesia, setCanAmnesia] = useState(false);
  const [canMecanismo, setCanMecanismo] = useState(false);

  const [nexLinhaMedia, setNexLinhaMedia] = useState(false);
  const [nexDeficit, setNexDeficit] = useState(false);
  const [nexConsciencia, setNexConsciencia] = useState(false);
  const [nexIntox, setNexIntox] = useState(false);
  const [nexDistrativa, setNexDistrativa] = useState(false);

  const [resCanNex, setResCanNex] = useState<ResultadoCranioCervical | null>(null);

  useEffect(() => {
    if (calculadoraAtiva !== 'cranio_cervical') return;
    executarCalculoClinico<ResultadoCranioCervical>('cranio_cervical', {
      glasgow_menor_15_em_2h: canGcs15,
      suspeita_fratura_aberta_ou_afundamento: canFratura,
      sinal_fratura_base_cranio: canBaseCranio,
      dois_ou_mais_episodios_vomito: canVomito,
      idade_maior_ou_igual_65: canIdade65,
      amnesia_retrograda_maior_30min: canAmnesia,
      mecanismo_perigoso: canMecanismo,
      dor_linha_media_cervical: nexLinhaMedia,
      deficit_neurologico_focal: nexDeficit,
      nivel_consciencia_alterado: nexConsciencia,
      intoxicacao_evidente: nexIntox,
      lesao_distrativa_dolorosa: nexDistrativa,
    })
      .then(setResCanNex)
      .catch(() => setResCanNex(null));
  }, [
    calculadoraAtiva,
    canGcs15,
    canFratura,
    canBaseCranio,
    canVomito,
    canIdade65,
    canAmnesia,
    canMecanismo,
    nexLinhaMedia,
    nexDeficit,
    nexConsciencia,
    nexIntox,
    nexDistrativa,
  ]);

  const textoProntuarioCanNex = useMemo(() => {
    if (!resCanNex) return '';
    return `[DECISÃO DE IMAGEM NO TCE LEVE - CANADIAN HEAD CT & NEXUS CERVICAL]\n- TC de Crânio Indicada: ${resCanNex.indicacao_tc_cranio ? 'SIM' : 'NÃO'}\n  Justificativa: ${resCanNex.justificativa_cranio}\n- Imagem de Coluna Cervical Indicada: ${resCanNex.indicacao_imagem_cervical ? 'SIM' : 'NÃO'}\n  Justificativa: ${resCanNex.justificativa_coluna}`;
  }, [resCanNex]);

  const metaGlasgow = CATALOGO_CALCULADORAS.find((c) => c.id === 'glasgow_p')!;
  const metaAvc = CATALOGO_CALCULADORAS.find((c) => c.id === 'trombolise_avc')!;
  const metaCanNex = CATALOGO_CALCULADORAS.find((c) => c.id === 'cranio_cervical')!;

  return (
    <>
      {/* 1. GLASGOW-P */}
      {calculadoraAtiva === 'glasgow_p' && (
        <CardCalculadora
          meta={metaGlasgow}
          icone={Eye}
          corDestaque="purple"
          isFavorito={isFavorito('glasgow_p')}
          onToggleFavorito={onToggleFavorito}
          onNavegarCalculadora={onNavegarCalculadora}
          textoProntuario={textoProntuarioGlasgow}
        >
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Abertura Ocular</label>
              <ChipSegmentado<number>
                valor={gcsOlhos}
                opcoes={[
                  { valor: 4, rotulo: 'Espontânea', pontos: '4 pts' },
                  { valor: 3, rotulo: 'Ao som / voz', pontos: '3 pts' },
                  { valor: 2, rotulo: 'À pressão dolorosa', pontos: '2 pts' },
                  { valor: 1, rotulo: 'Ausente', pontos: '1 pt' },
                ]}
                onChange={setGcsOlhos}
                corAtiva="bg-purple-600"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Resposta Verbal</label>
              <ChipSegmentado<number>
                valor={gcsVerbal}
                opcoes={[
                  { valor: 5, rotulo: 'Orientada', pontos: '5 pts' },
                  { valor: 4, rotulo: 'Confusa', pontos: '4 pts' },
                  { valor: 3, rotulo: 'Palavras inapropriadas', pontos: '3 pts' },
                  { valor: 2, rotulo: 'Sons ininteligíveis', pontos: '2 pts' },
                  { valor: 1, rotulo: 'Ausente', pontos: '1 pt' },
                ]}
                onChange={setGcsVerbal}
                corAtiva="bg-purple-600"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Resposta Motora</label>
              <ChipSegmentado<number>
                valor={gcsMotor}
                opcoes={[
                  { valor: 6, rotulo: 'Obedece a comandos', pontos: '6 pts' },
                  { valor: 5, rotulo: 'Localiza a dor', pontos: '5 pts' },
                  { valor: 4, rotulo: 'Flexão normal (retirada)', pontos: '4 pts' },
                  { valor: 3, rotulo: 'Flexão anormal (decorticação)', pontos: '3 pts' },
                  { valor: 2, rotulo: 'Extensão anormal (descerebração)', pontos: '2 pts' },
                  { valor: 1, rotulo: 'Ausente', pontos: '1 pt' },
                ]}
                onChange={setGcsMotor}
                corAtiva="bg-purple-600"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Reatividade Pupilar à Luz</label>
              <ChipSegmentado<number>
                valor={gcsPupilas}
                opcoes={[
                  { valor: 2, rotulo: 'Ambas as pupilas reagem', pontos: '0 pt' },
                  { valor: 1, rotulo: 'Apenas uma pupila reage (Anisocoria)', pontos: '-1 pt' },
                  { valor: 0, rotulo: 'Nenhuma pupila reage (Midríase fixa)', pontos: '-2 pts' },
                ]}
                onChange={setGcsPupilas}
                corAtiva="bg-purple-600"
              />
            </div>
          </div>

          {resGlasgow && (
            <div className="space-y-3">
              <div className="p-4 bg-slate-900 border border-purple-500/20 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">GCS-P Score Final</span>
                  <span className="text-3xl font-extrabold text-purple-400 font-mono">{resGlasgow.gcs_p_final}</span>
                  <span className="text-xs text-slate-400 ml-1">pts (Glasgow Basal: {resGlasgow.escore_glasgow})</span>
                </div>
                <div className="text-right text-xs">
                  <div className="font-bold text-slate-200">{resGlasgow.gravidade_tce}</div>
                  <div className="text-slate-400 mt-0.5">{resGlasgow.conduta}</div>
                </div>
              </div>

              {resGlasgow.indicacao_intubacao && (
                <div className="p-3 bg-rose-950/60 border border-rose-700 rounded-xl text-xs text-rose-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                    <span>
                      <strong>GCS &le; 8 detectado:</strong> Incapacidade de proteção de via aérea &bull; Indicação de
                      Intubação Imediata.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavegarCalculadora('sri')}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold shrink-0 shadow"
                  >
                    Abrir ISR (7 Ps) &rarr;
                  </button>
                </div>
              )}
            </div>
          )}
        </CardCalculadora>
      )}

      {/* 2. TROMBÓLISE AVC */}
      {calculadoraAtiva === 'trombolise_avc' && (
        <CardCalculadora
          meta={metaAvc}
          icone={Zap}
          corDestaque="rose"
          isFavorito={isFavorito('trombolise_avc')}
          onToggleFavorito={onToggleFavorito}
          onNavegarCalculadora={onNavegarCalculadora}
          textoProntuario={textoProntuarioAvc}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Peso do Paciente (kg)</label>
              <input
                type="number"
                value={avcPeso}
                onChange={(e) => setAvcPeso(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Delta T (Horas desde início)</label>
              <input
                type="number"
                step="0.1"
                value={avcDeltaT}
                onChange={(e) => setAvcDeltaT(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">PAS (Sistólica mmHg)</label>
              <input
                type="number"
                value={avcPas}
                onChange={(e) => setAvcPas(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">PAD (Diastólica mmHg)</label>
              <input
                type="number"
                value={avcPad}
                onChange={(e) => setAvcPad(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Glicemia (mg/dL)</label>
              <input
                type="number"
                value={avcGlicemia}
                onChange={(e) => setAvcGlicemia(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Plaquetas (/mm³)</label>
              <input
                type="number"
                value={avcPlaquetas}
                onChange={(e) => setAvcPlaquetas(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">INR</label>
              <input
                type="number"
                step="0.1"
                value={avcInr}
                onChange={(e) => setAvcInr(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer w-full text-slate-300">
                <input type="checkbox" checked={avcTc} onChange={(e) => setAvcTc(e.target.checked)} />
                <span>TC Crânio descartou sangramento</span>
              </label>
            </div>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5 text-xs">
            <span className="font-semibold text-slate-300 block mb-1">Checklist de Contraindicações Absolutas:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={avcDoac} onChange={(e) => setAvcDoac(e.target.checked)} />
                <span>Uso de DOAC nas últimas 48h</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={avcTce3m} onChange={(e) => setAvcTce3m(e.target.checked)} />
                <span>AVC prévio ou TCE grave nos últimos 3 meses</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={avcCirurg14d} onChange={(e) => setAvcCirurg14d(e.target.checked)} />
                <span>Cirurgia de grande porte nos últimos 14 dias</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={avcSang21d} onChange={(e) => setAvcSang21d(e.target.checked)} />
                <span>Sangramento gastrointestinal/urinário nos últimos 21 dias</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={avcPuncao7d} onChange={(e) => setAvcPuncao7d(e.target.checked)} />
                <span>Punção arterial em sítio não compressível nos últimos 7 dias</span>
              </label>
            </div>
          </div>

          {resAvc && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-center">
                <div className="p-3 bg-slate-900 border border-rose-500/30 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Alteplase (0.9 mg/kg)</span>
                  <div className="text-xl font-bold text-rose-300 font-mono">
                    Total: {resAvc.dose_total_alteplase_mg.toFixed(1)} mg
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Bolus 10%: <strong>{resAvc.bolus_alteplase_10_porcento_mg.toFixed(1)} mg</strong> (1 min) &bull;
                    Bomba 90%: <strong>{resAvc.infusao_alteplase_90_porcento_mg_h.toFixed(1)} mg/h</strong> (60 min)
                  </div>
                </div>
                <div className="p-3 bg-slate-900 border border-amber-500/30 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                    Tenecteplase (0.25 mg/kg)
                  </span>
                  <div className="text-xl font-bold text-amber-300 font-mono">
                    {resAvc.dose_tenecteplase_mg.toFixed(1)} mg
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Bolus IV único em 5 a 10 segundos</div>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Metas Pressóricas</span>
                  <div className="text-xs font-bold text-teal-400">{resAvc.metas_pressoricas}</div>
                </div>
              </div>

              {resAvc.contraindicacoes_absolutas.length > 0 && (
                <div className="p-3 bg-rose-950/60 border border-rose-700 rounded-xl text-xs text-rose-200">
                  <strong>CONTRAINDICAÇÃO DETECTADA:</strong>
                  <ul className="list-disc list-inside mt-1">
                    {resAvc.contraindicacoes_absolutas.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardCalculadora>
      )}

      {/* 3. CANADIAN & NEXUS */}
      {calculadoraAtiva === 'cranio_cervical' && (
        <CardCalculadora
          meta={metaCanNex}
          icone={Shield}
          corDestaque="sky"
          isFavorito={isFavorito('cranio_cervical')}
          onToggleFavorito={onToggleFavorito}
          onNavegarCalculadora={onNavegarCalculadora}
          textoProntuario={textoProntuarioCanNex}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Canadian CT Head */}
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-sky-400 block border-b border-slate-800 pb-1">
                Canadian CT Head Rule (TC de Crânio no TCE Leve)
              </span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={canGcs15} onChange={(e) => setCanGcs15(e.target.checked)} />
                <span>GCS &lt; 15 após 2 horas do trauma</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={canFratura} onChange={(e) => setCanFratura(e.target.checked)} />
                <span>Suspeita de fratura craniana aberta ou afundamento</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={canBaseCranio} onChange={(e) => setCanBaseCranio(e.target.checked)} />
                <span>Sinal de fratura de base de crânio (guaxinim, Battle, otoliquorreia)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={canVomito} onChange={(e) => setCanVomito(e.target.checked)} />
                <span>Dois ou mais episódios de vômitos</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={canIdade65} onChange={(e) => setCanIdade65(e.target.checked)} />
                <span>Idade &ge; 65 anos</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={canAmnesia} onChange={(e) => setCanAmnesia(e.target.checked)} />
                <span>Amnésia retrógrada para fatos &gt; 30 min antes do trauma</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={canMecanismo} onChange={(e) => setCanMecanismo(e.target.checked)} />
                <span>Mecanismo perigoso (atropelamento, ejeção do veículo, queda &gt; 1m)</span>
              </label>
            </div>

            {/* NEXUS Cervical */}
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-teal-400 block border-b border-slate-800 pb-1">
                Critérios NEXUS (Imagem de Coluna Cervical)
              </span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={nexLinhaMedia} onChange={(e) => setNexLinhaMedia(e.target.checked)} />
                <span>Dor à palpação na linha média cervical posterior</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={nexDeficit} onChange={(e) => setNexDeficit(e.target.checked)} />
                <span>Déficit neurológico focal (paresia, parestesia)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={nexConsciencia}
                  onChange={(e) => setNexConsciencia(e.target.checked)}
                />
                <span>Nível de consciência alterado (GCS &lt; 15 ou desorientação)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={nexIntox} onChange={(e) => setNexIntox(e.target.checked)} />
                <span>Evidência de intoxicação exógena por álcool/drogas</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={nexDistrativa}
                  onChange={(e) => setNexDistrativa(e.target.checked)}
                />
                <span>Presença de lesão distrativa dolorosa (fratura de osso longo, queimadura grave)</span>
              </label>
            </div>
          </div>

          {resCanNex && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div
                className={`p-3 rounded-xl border ${
                  resCanNex.indicacao_tc_cranio
                    ? 'bg-amber-950/40 border-amber-800/40 text-amber-200'
                    : 'bg-emerald-950/40 border-emerald-800/40 text-emerald-200'
                }`}
              >
                <div className="font-bold text-sm">
                  TC de Crânio: {resCanNex.indicacao_tc_cranio ? 'INDICADA' : 'Dispensável com segurança'}
                </div>
                <div className="text-[11px] mt-0.5">{resCanNex.justificativa_cranio}</div>
              </div>
              <div
                className={`p-3 rounded-xl border ${
                  resCanNex.indicacao_imagem_cervical
                    ? 'bg-amber-950/40 border-amber-800/40 text-amber-200'
                    : 'bg-emerald-950/40 border-emerald-800/40 text-emerald-200'
                }`}
              >
                <div className="font-bold text-sm">
                  Coluna Cervical:{' '}
                  {resCanNex.indicacao_imagem_cervical ? 'IMAGEM INDICADA' : 'Dispensável (NEXUS Satisfeito)'}
                </div>
                <div className="text-[11px] mt-0.5">{resCanNex.justificativa_coluna}</div>
              </div>
            </div>
          )}
        </CardCalculadora>
      )}
    </>
  );
};
