import React, { useState, useEffect, useMemo } from 'react';
import {
  GitCommit,
  Activity,
  HeartPulse,
  Flame,
  Stethoscope,
  Scissors,
  Pill,
  Scale,
  Calendar,
} from 'lucide-react';
import {
  ResultadoGlasgowBlatchford,
  ResultadoMeldNa,
  ResultadoChildPugh,
  ResultadoBisap,
  ResultadoFib4,
  ResultadoAlvarado,
  ResultadoEquivalenciaCorticoide,
  ResultadoAntropometriaFarmacologica,
  ResultadoCentorMcIsaac,
  ResultadoIdadeGestacionalDpp,
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

export const CalculadorasGastroCirurgia: React.FC<Props> = ({
  calculadoraAtiva,
  isFavorito,
  onToggleFavorito,
  onNavegarCalculadora,
}) => {
  // 1. Glasgow-Blatchford (HDA)
  const [gbUreia, setGbUreia] = useState<number>(45);
  const [gbHb, setGbHb] = useState<number>(11.5);
  const [gbFem, setGbFem] = useState<boolean>(false);
  const [gbPas, setGbPas] = useState<number>(110);
  const [gbFc, setGbFc] = useState<number>(85);
  const [gbMelena, setGbMelena] = useState<boolean>(false);
  const [gbSincope, setGbSincope] = useState<boolean>(false);
  const [gbHep, setGbHep] = useState<boolean>(false);
  const [gbIc, setGbIc] = useState<boolean>(false);
  const [resGb, setResGb] = useState<ResultadoGlasgowBlatchford | null>(null);

  useEffect(() => {
    if (calculadoraAtiva !== 'glasgow_blatchford') return;
    executarCalculoClinico<ResultadoGlasgowBlatchford>('glasgow_blatchford', {
      ureia_mg_dl: gbUreia,
      hemoglobina_g_dl: gbHb,
      sexo_feminino: gbFem,
      pas_mmhg: gbPas,
      fc_bpm: gbFc,
      apresentou_melena: gbMelena,
      apresentou_sincope: gbSincope,
      doenca_hepatica: gbHep,
      insuficiencia_cardiaca: gbIc,
    })
      .then(setResGb)
      .catch(() => setResGb(null));
  }, [calculadoraAtiva, gbUreia, gbHb, gbFem, gbPas, gbFc, gbMelena, gbSincope, gbHep, gbIc]);

  const textoProntuarioGb = useMemo(() => {
    if (!resGb) return '';
    return `[GLASGOW-BLATCHFORD - HEMORRAGIA DIGESTIVA ALTA (HDA)]\nPontuação Total: ${resGb.pontuacao_total} pts -> Manejo Ambulatorial: ${resGb.baixo_risco_ambulatorial ? 'SIM (BAIXO RISCO, ESCORE 0)' : 'NÃO (INTERNAÇÃO / EDA)'}\nNecessidade de intervenção estimada: ${resGb.necessidade_intervencao_percentual}\nConduta: ${resGb.conduta_sugerida}`;
  }, [resGb]);

  // 2. MELD-Na
  const [meldBili, setMeldBili] = useState<number>(2.4);
  const [meldInr, setMeldInr] = useState<number>(1.6);
  const [meldCr, setMeldCr] = useState<number>(1.4);
  const [meldNa, setMeldNa] = useState<number>(132);
  const [meldDialise, setMeldDialise] = useState<boolean>(false);
  const [resMeld, setResMeld] = useState<ResultadoMeldNa | null>(null);

  useEffect(() => {
    if (calculadoraAtiva !== 'meld_na') return;
    executarCalculoClinico<ResultadoMeldNa>('meld_na', {
      bilirrubina_mg_dl: meldBili,
      inr: meldInr,
      creatinina_mg_dl: meldCr,
      sodio_m_eq_l: meldNa,
      em_dialise: meldDialise,
    })
      .then(setResMeld)
      .catch(() => setResMeld(null));
  }, [calculadoraAtiva, meldBili, meldInr, meldCr, meldNa, meldDialise]);

  const textoProntuarioMeld = useMemo(() => {
    if (!resMeld) return '';
    return `[MELD-Na - DOENÇA HEPÁTICA TERMINAL & PRIORIDADE TRANSPLANTE]\nBilirrubina: ${meldBili} | INR: ${meldInr} | Creatinina: ${meldCr} | Na+: ${meldNa} mEq/L | Diálise: ${meldDialise ? 'SIM' : 'NÃO'}\n- MELD Original: ${resMeld.score_meld_inicial} pts\n- MELD-Na Final: ${resMeld.score_meld_na} pts\nMortalidade estimada em 90 dias: ${resMeld.mortalidade_90d_percentual}\nPrioridade: ${resMeld.prioridade_transplante} &bull; Conduta: ${resMeld.conduta_clinica}`;
  }, [resMeld, meldBili, meldInr, meldCr, meldNa, meldDialise]);

  // 3. Child-Pugh
  const [cpBili, setCpBili] = useState<number>(2.2);
  const [cpAlb, setCpAlb] = useState<number>(3.1);
  const [cpInr, setCpInr] = useState<number>(1.8);
  const [cpAscite, setCpAscite] = useState<number>(1);
  const [cpEncef, setCpEncef] = useState<number>(1);
  const [resCp, setResCp] = useState<ResultadoChildPugh | null>(null);

  useEffect(() => {
    if (calculadoraAtiva !== 'child_pugh') return;
    executarCalculoClinico<ResultadoChildPugh>('child_pugh', {
      bilirrubina_mg_dl: cpBili,
      albumina_g_dl: cpAlb,
      inr: cpInr,
      ascite_grau: cpAscite,
      encefalopatia_grau: cpEncef,
    })
      .then(setResCp)
      .catch(() => setResCp(null));
  }, [calculadoraAtiva, cpBili, cpAlb, cpInr, cpAscite, cpEncef]);

  const textoProntuarioCp = useMemo(() => {
    if (!resCp) return '';
    return `[CLASSIFICAÇÃO DE CHILD-PUGH-TURCOTTE - CIRROSE HEPÁTICA]\nPontuação: ${resCp.pontuacao_total} pts -> Classe ${resCp.classe}\n- Sobrevida 1 ano: ${resCp.sobrevida_1ano_percentual} | 2 anos: ${resCp.sobrevida_2anos_percentual}\n- Risco Cirúrgico Abdominal: ${resCp.risco_cirurgico_mortalidade}\nConduta: ${resCp.conduta_geral}`;
  }, [resCp]);

  // 4. BISAP (Pancreatite)
  const [bisapUreia, setBisapUreia] = useState<boolean>(false);
  const [bisapMental, setBisapMental] = useState<boolean>(false);
  const [bisapSirs, setBisapSirs] = useState<boolean>(false);
  const [bisapIdade, setBisapIdade] = useState<boolean>(false);
  const [bisapPleural, setBisapPleural] = useState<boolean>(false);
  const [resBisap, setResBisap] = useState<ResultadoBisap | null>(null);

  useEffect(() => {
    if (calculadoraAtiva !== 'bisap') return;
    executarCalculoClinico<ResultadoBisap>('bisap', {
      ureia_maior_50: bisapUreia,
      alteracao_mental: bisapMental,
      criterios_sirs_presentes: bisapSirs,
      idade_maior_60: bisapIdade,
      derrame_pleural: bisapPleural,
    })
      .then(setResBisap)
      .catch(() => setResBisap(null));
  }, [calculadoraAtiva, bisapUreia, bisapMental, bisapSirs, bisapIdade, bisapPleural]);

  const textoProntuarioBisap = useMemo(() => {
    if (!resBisap) return '';
    return `[BISAP SCORE - GRAVIDADE NA PANCREATITE AGUDA]\nPontuação: ${resBisap.pontuacao_total}/5 pts -> Categoria: ${resBisap.categoria_gravidade} (Mortalidade: ${resBisap.mortalidade_prevista_percentual})\nIndicação de UTI: ${resBisap.indicacao_uti ? 'SIM' : 'NÃO'} &bull; Conduta: ${resBisap.conduta}`;
  }, [resBisap]);

  // 5. FIB-4
  const [fibIdade, setFibIdade] = useState<number>(52);
  const [fibAst, setFibAst] = useState<number>(65);
  const [fibAlt, setFibAlt] = useState<number>(58);
  const [fibPlaq, setFibPlaq] = useState<number>(180);
  const [resFib, setResFib] = useState<ResultadoFib4 | null>(null);

  useEffect(() => {
    if (calculadoraAtiva !== 'fib4') return;
    executarCalculoClinico<ResultadoFib4>('fib4', {
      idade_anos: fibIdade,
      ast_u_l: fibAst,
      alt_u_l: fibAlt,
      plaquetas_milhares: fibPlaq,
    })
      .then(setResFib)
      .catch(() => setResFib(null));
  }, [calculadoraAtiva, fibIdade, fibAst, fibAlt, fibPlaq]);

  const textoProntuarioFib = useMemo(() => {
    if (!resFib) return '';
    return `[ESCORE FIB-4 - RASTREIO AMBULATORIAL DE FIBROSE HEPÁTICA]\nIdade: ${fibIdade} | AST: ${fibAst} | ALT: ${fibAlt} | Plaquetas: ${fibPlaq} mil/mm³\n- FIB-4 Score: ${resFib.score_fib4.toFixed(2)}\n- Estratificação: ${resFib.estratificacao_fibrose} (${resFib.valor_preditivo})\nConduta: ${resFib.conduta_encaminhamento}`;
  }, [resFib, fibIdade, fibAst, fibAlt, fibPlaq]);

  // 6. Alvarado
  const [alvDorMigra, setAlvDorMigra] = useState<boolean>(false);
  const [alvAnorexia, setAlvAnorexia] = useState<boolean>(false);
  const [alvNausea, setAlvNausea] = useState<boolean>(false);
  const [alvDorFid, setAlvDorFid] = useState<boolean>(true);
  const [alvDescomp, setAlvDescomp] = useState<boolean>(true);
  const [alvFebre, setAlvFebre] = useState<boolean>(false);
  const [alvLeuco, setAlvLeuco] = useState<boolean>(true);
  const [alvDesvio, setAlvDesvio] = useState<boolean>(false);
  const [resAlv, setResAlv] = useState<ResultadoAlvarado | null>(null);

  useEffect(() => {
    if (calculadoraAtiva !== 'alvarado') return;
    executarCalculoClinico<ResultadoAlvarado>('alvarado', {
      dor_migratoria_fossa_iliaca_direita: alvDorMigra,
      anorexia: alvAnorexia,
      nausea_ou_vomito: alvNausea,
      dor_fossa_iliaca_direita: alvDorFid,
      descompressao_brusca_positiva: alvDescomp,
      temperatura_elevada: alvFebre,
      leucocitose: alvLeuco,
      desvio_esquerda_neutrofilos: alvDesvio,
    })
      .then(setResAlv)
      .catch(() => setResAlv(null));
  }, [
    calculadoraAtiva,
    alvDorMigra,
    alvAnorexia,
    alvNausea,
    alvDorFid,
    alvDescomp,
    alvFebre,
    alvLeuco,
    alvDesvio,
  ]);

  const textoProntuarioAlv = useMemo(() => {
    if (!resAlv) return '';
    return `[ESCORE DE ALVARADO (MANTRELS) - APENDICITE AGUDA]\nPontuação Total: ${resAlv.pontuacao_total}/10 pts -> Probabilidade: ${resAlv.probabilidade_apendicite}\nConduta: ${resAlv.conduta_cirurgica}`;
  }, [resAlv]);

  // 7. Corticoides
  const [corticoideOrigem, setCorticoideOrigem] = useState<string>('prednisona');
  const [doseOrigem, setDoseOrigem] = useState<number>(20);
  const [resCort, setResCort] = useState<ResultadoEquivalenciaCorticoide | null>(null);

  useEffect(() => {
    if (calculadoraAtiva !== 'corticoides') return;
    executarCalculoClinico<ResultadoEquivalenciaCorticoide>('equivalencia_corticoide', {
      farmaco_origem: corticoideOrigem,
      dose_origem_mg: doseOrigem,
    })
      .then(setResCort)
      .catch(() => setResCort(null));
  }, [calculadoraAtiva, corticoideOrigem, doseOrigem]);

  const textoProntuarioCort = useMemo(() => {
    if (!resCort) return '';
    const lista = resCort.doses_equivalentes.map((d) => `${d.farmaco}: ${d.dose_equivalente_mg} mg`).join(', ');
    return `[EQUIVALÊNCIA DE CORTICOIDES & DESMAME]\nFármaco Base: ${resCort.farmaco_origem} ${resCort.dose_origem_mg} mg/dia\nDoses Equivalentes: ${lista}\nEsquema de Desmame: ${resCort.esquema_desmame_sugerido}`;
  }, [resCort]);

  // 8. Antropometria Farmacológica
  const [pesoAntro, setPesoAntro] = useState<number>(95);
  const [alturaAntro, setAlturaAntro] = useState<number>(175);
  const [sexoFemAntro, setSexoFemAntro] = useState<boolean>(false);
  const [resAntro, setResAntro] = useState<ResultadoAntropometriaFarmacologica | null>(null);

  useEffect(() => {
    if (calculadoraAtiva !== 'antropometria') return;
    executarCalculoClinico<ResultadoAntropometriaFarmacologica>('antropometria_farmacologica', {
      peso_real_kg: pesoAntro,
      altura_cm: alturaAntro,
      sexo_feminino: sexoFemAntro,
    })
      .then(setResAntro)
      .catch(() => setResAntro(null));
  }, [calculadoraAtiva, pesoAntro, alturaAntro, sexoFemAntro]);

  const textoProntuarioAntro = useMemo(() => {
    if (!resAntro) return '';
    return `[ANTROPOMETRIA FARMACOLÓGICA & DOSAGEM]\nPeso Real: ${pesoAntro} kg | Altura: ${alturaAntro} cm | Sexo: ${sexoFemAntro ? 'Fem' : 'Masc'}\n- IMC: ${resAntro.imc.toFixed(1)} kg/m² (${resAntro.classificacao_imc})\n- Peso Ideal (Devine): ${resAntro.peso_ideal_devine_kg.toFixed(1)} kg\n- Peso Ajustado (Obesidade): ${resAntro.peso_ajustado_obesidade_kg.toFixed(1)} kg\n- Superfície Corporal (Mosteller): ${resAntro.superficie_corporal_mosteller_m2.toFixed(2)} m²\nRecomendação Farmacológica: ${resAntro.recomendacao_drogas_hidrofilicas}`;
  }, [resAntro, pesoAntro, alturaAntro, sexoFemAntro]);

  // 9. Centor / McIsaac
  const [centorIdade, setCentorIdade] = useState<number>(8);
  const [centorFebre, setCentorFebre] = useState<boolean>(true);
  const [centorSemTosse, setCentorSemTosse] = useState<boolean>(true);
  const [centorLinfonodo, setCentorLinfonodo] = useState<boolean>(true);
  const [centorExsudato, setCentorExsudato] = useState<boolean>(true);
  const [resCentor, setResCentor] = useState<ResultadoCentorMcIsaac | null>(null);

  useEffect(() => {
    if (calculadoraAtiva !== 'centor') return;
    executarCalculoClinico<ResultadoCentorMcIsaac>('centor_mcisaac', {
      idade_anos: centorIdade,
      febre_aferida_ou_relatada: centorFebre,
      ausencia_de_tosse: centorSemTosse,
      linfonodomegalia_cervical_anterior_dolorosa: centorLinfonodo,
      exsudato_amigdaliano_ou_edema: centorExsudato,
    })
      .then(setResCentor)
      .catch(() => setResCentor(null));
  }, [
    calculadoraAtiva,
    centorIdade,
    centorFebre,
    centorSemTosse,
    centorLinfonodo,
    centorExsudato,
  ]);

  const textoProntuarioCentor = useMemo(() => {
    if (!resCentor) return '';
    return `[CENTOR MODIFICADO POR MCISAAC - FARINGITE AGUDA]\nIdade: ${centorIdade} anos | Pontuação: ${resCentor.pontuacao_total} pts\nProbabilidade de infecção por Streptococcus pyogenes (Grupo A): ${resCentor.probabilidade_strepto_percentual}\nConduta: ${resCentor.indicacao_teste_rapido_ou_atb}`;
  }, [resCentor, centorIdade]);

  // 10. Idade Gestacional & DPP
  const hoje = new Date();
  const [dumDia, setDumDia] = useState<number>(15);
  const [dumMes, setDumMes] = useState<number>(1);
  const [dumAno, setDumAno] = useState<number>(hoje.getFullYear());
  const [resDum, setResDum] = useState<ResultadoIdadeGestacionalDpp | null>(null);

  useEffect(() => {
    if (calculadoraAtiva !== 'idade_gestacional') return;
    executarCalculoClinico<ResultadoIdadeGestacionalDpp>('idade_gestacional_dpp', {
      dia_dum: dumDia,
      mes_dum: dumMes,
      ano_dum: dumAno,
      dia_referencia: hoje.getDate(),
      mes_referencia: hoje.getMonth() + 1,
      ano_referencia: hoje.getFullYear(),
    })
      .then(setResDum)
      .catch(() => setResDum(null));
  }, [calculadoraAtiva, dumDia, dumMes, dumAno]);

  const textoProntuarioDum = useMemo(() => {
    if (!resDum) return '';
    return `[IDADE GESTACIONAL & DPP - REGRA DE NAEGELE]\nDUM: ${dumDia.toString().padStart(2, '0')}/${dumMes.toString().padStart(2, '0')}/${dumAno}\n- Idade Gestacional: ${resDum.idade_gestacional_semanas} semanas e ${resDum.idade_gestacional_dias} dias (${resDum.trimestre_atual})\n- Data Provável do Parto (DPP): ${resDum.data_provavel_parto_naegele}\nExames de rotina recomendados: ${resDum.exames_do_trimestre.join('; ')}`;
  }, [resDum, dumDia, dumMes, dumAno]);

  const metaGb = CATALOGO_CALCULADORAS.find((c) => c.id === 'glasgow_blatchford')!;
  const metaMeld = CATALOGO_CALCULADORAS.find((c) => c.id === 'meld_na')!;
  const metaCp = CATALOGO_CALCULADORAS.find((c) => c.id === 'child_pugh')!;
  const metaBisap = CATALOGO_CALCULADORAS.find((c) => c.id === 'bisap')!;
  const metaFib = CATALOGO_CALCULADORAS.find((c) => c.id === 'fib4')!;
  const metaAlv = CATALOGO_CALCULADORAS.find((c) => c.id === 'alvarado')!;
  const metaCort = CATALOGO_CALCULADORAS.find((c) => c.id === 'corticoides')!;
  const metaAntro = CATALOGO_CALCULADORAS.find((c) => c.id === 'antropometria')!;
  const metaCentor = CATALOGO_CALCULADORAS.find((c) => c.id === 'centor')!;
  const metaDum = CATALOGO_CALCULADORAS.find((c) => c.id === 'idade_gestacional')!;

  return (
    <>
      {/* 1. GLASGOW-BLATCHFORD */}
      {calculadoraAtiva === 'glasgow_blatchford' && (
        <CardCalculadora
          meta={metaGb}
          icone={GitCommit}
          corDestaque="amber"
          isFavorito={isFavorito('glasgow_blatchford')}
          onToggleFavorito={onToggleFavorito}
          onNavegarCalculadora={onNavegarCalculadora}
          textoProntuario={textoProntuarioGb}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Ureia (mg/dL)</label>
              <input
                type="number"
                value={gbUreia}
                onChange={(e) => setGbUreia(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Hemoglobina (g/dL)</label>
              <input
                type="number"
                step="0.1"
                value={gbHb}
                onChange={(e) => setGbHb(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">PAS (Sistólica mmHg)</label>
              <input
                type="number"
                value={gbPas}
                onChange={(e) => setGbPas(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">FC (bpm)</label>
              <input
                type="number"
                value={gbFc}
                onChange={(e) => setGbFc(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <ChipSegmentado<boolean>
              valor={gbFem}
              opcoes={[
                { valor: false, rotulo: 'Masculino' },
                { valor: true, rotulo: 'Feminino' },
              ]}
              onChange={setGbFem}
              corAtiva="bg-amber-600"
            />
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={gbMelena} onChange={(e) => setGbMelena(e.target.checked)} />
              <span>Apresentou Melena</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={gbSincope} onChange={(e) => setGbSincope(e.target.checked)} />
              <span>Apresentou Síncope</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={gbHep} onChange={(e) => setGbHep(e.target.checked)} />
              <span>Doença Hepática</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer col-span-2">
              <input type="checkbox" checked={gbIc} onChange={(e) => setGbIc(e.target.checked)} />
              <span>Insuficiência Cardíaca Concomitante</span>
            </label>
          </div>

          {resGb && (
            <div className="p-4 bg-slate-900 border border-amber-500/20 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Glasgow-Blatchford Total</span>
                <span className="text-3xl font-extrabold text-amber-400 font-mono">{resGb.pontuacao_total}</span>
                <span className="text-xs text-slate-400 ml-1">pts</span>
              </div>
              <div className="text-right text-xs">
                <div className="font-bold text-slate-200">
                  {resGb.baixo_risco_ambulatorial ? 'Baixo Risco (Manejo Ambulatorial Possível)' : 'Alto Risco (Internar para EDA)'}
                </div>
                <div className="text-slate-400 mt-1">{resGb.conduta_sugerida}</div>
              </div>
            </div>
          )}
        </CardCalculadora>
      )}

      {/* 2. MELD-NA */}
      {calculadoraAtiva === 'meld_na' && (
        <CardCalculadora
          meta={metaMeld}
          icone={Activity}
          corDestaque="rose"
          isFavorito={isFavorito('meld_na')}
          onToggleFavorito={onToggleFavorito}
          onNavegarCalculadora={onNavegarCalculadora}
          textoProntuario={textoProntuarioMeld}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Bilirrubina Total (mg/dL)</label>
              <input
                type="number"
                step="0.1"
                value={meldBili}
                onChange={(e) => setMeldBili(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">INR</label>
              <input
                type="number"
                step="0.1"
                value={meldInr}
                onChange={(e) => setMeldInr(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Creatinina (mg/dL)</label>
              <input
                type="number"
                step="0.1"
                value={meldCr}
                onChange={(e) => setMeldCr(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Sódio Sérico (mEq/L)</label>
              <input
                type="number"
                value={meldNa}
                onChange={(e) => setMeldNa(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
          </div>

          <div className="flex gap-2 text-xs">
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={meldDialise} onChange={(e) => setMeldDialise(e.target.checked)} />
              <span>Paciente em diálise recente &ge; 2 vezes na última semana (Cr fixada em 4.0)</span>
            </label>
          </div>

          {resMeld && (
            <div className="p-4 bg-slate-900 border border-rose-500/20 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">MELD-Na Score</span>
                <span className="text-3xl font-extrabold text-rose-400 font-mono">{resMeld.score_meld_na}</span>
                <span className="text-xs text-slate-400 ml-1">pts (MELD Original: {resMeld.score_meld_inicial})</span>
              </div>
              <div className="text-right text-xs">
                <div className="font-bold text-slate-200">
                  Mortalidade 90d: {resMeld.mortalidade_90d_percentual} &bull; Prioridade: {resMeld.prioridade_transplante}
                </div>
                <div className="text-slate-400 mt-1">{resMeld.conduta_clinica}</div>
              </div>
            </div>
          )}
        </CardCalculadora>
      )}

      {/* 3. CHILD-PUGH */}
      {calculadoraAtiva === 'child_pugh' && (
        <CardCalculadora
          meta={metaCp}
          icone={HeartPulse}
          corDestaque="amber"
          isFavorito={isFavorito('child_pugh')}
          onToggleFavorito={onToggleFavorito}
          onNavegarCalculadora={onNavegarCalculadora}
          textoProntuario={textoProntuarioCp}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Bilirrubina Total (mg/dL)</label>
              <input
                type="number"
                step="0.1"
                value={cpBili}
                onChange={(e) => setCpBili(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Albumina Sérica (g/dL)</label>
              <input
                type="number"
                step="0.1"
                value={cpAlb}
                onChange={(e) => setCpAlb(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">INR</label>
              <input
                type="number"
                step="0.1"
                value={cpInr}
                onChange={(e) => setCpInr(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Ascite</label>
              <ChipSegmentado<number>
                valor={cpAscite}
                opcoes={[
                  { valor: 1, rotulo: 'Ausente', pontos: '1 pt' },
                  { valor: 2, rotulo: 'Leve / Controlada', pontos: '2 pts' },
                  { valor: 3, rotulo: 'Moderada / Refratária', pontos: '3 pts' },
                ]}
                onChange={setCpAscite}
                corAtiva="bg-amber-600"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Encefalopatia Hepática</label>
              <ChipSegmentado<number>
                valor={cpEncef}
                opcoes={[
                  { valor: 1, rotulo: 'Ausente', pontos: '1 pt' },
                  { valor: 2, rotulo: 'Grau 1 ou 2 (leve)', pontos: '2 pts' },
                  { valor: 3, rotulo: 'Grau 3 ou 4 (grave)', pontos: '3 pts' },
                ]}
                onChange={setCpEncef}
                corAtiva="bg-amber-600"
              />
            </div>
          </div>

          {resCp && (
            <div className="p-4 bg-slate-900 border border-amber-500/20 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Child-Pugh Score</span>
                <span className="text-3xl font-extrabold text-amber-400 font-mono">
                  Classe {resCp.classe} ({resCp.pontuacao_total} pts)
                </span>
              </div>
              <div className="text-right text-xs">
                <div className="font-bold text-slate-200">
                  Sobrevida 1 ano: {resCp.sobrevida_1ano_percentual} &bull; 2 anos: {resCp.sobrevida_2anos_percentual}
                </div>
                <div className="text-slate-400 mt-1">Risco Cirúrgico: {resCp.risco_cirurgico_mortalidade}</div>
              </div>
            </div>
          )}
        </CardCalculadora>
      )}

      {/* 4. BISAP */}
      {calculadoraAtiva === 'bisap' && (
        <CardCalculadora
          meta={metaBisap}
          icone={Flame}
          corDestaque="rose"
          isFavorito={isFavorito('bisap')}
          onToggleFavorito={onToggleFavorito}
          onNavegarCalculadora={onNavegarCalculadora}
          textoProntuario={textoProntuarioBisap}
        >
          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={bisapUreia} onChange={(e) => setBisapUreia(e.target.checked)} />
              <span>
                <strong>B (BUN):</strong> Ureia &gt; 50 mg/dL (&gt; 25 mg/dL de BUN) (+1 pt)
              </span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={bisapMental} onChange={(e) => setBisapMental(e.target.checked)} />
              <span>
                <strong>I (Impaired Mental Status):</strong> Desorientação ou rebaixamento sensorial (+1 pt)
              </span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={bisapSirs} onChange={(e) => setBisapSirs(e.target.checked)} />
              <span>
                <strong>S (SIRS):</strong> Síndrome da Resposta Inflamatória Sistêmica presente (+1 pt)
              </span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={bisapIdade} onChange={(e) => setBisapIdade(e.target.checked)} />
              <span>
                <strong>A (Age):</strong> Idade &gt; 60 anos (+1 pt)
              </span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={bisapPleural} onChange={(e) => setBisapPleural(e.target.checked)} />
              <span>
                <strong>P (Pleural Effusion):</strong> Derrame pleural documentado em radiografia ou TC (+1 pt)
              </span>
            </label>
          </div>

          {resBisap && (
            <div className="p-4 bg-slate-900 border border-rose-500/20 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">BISAP Total</span>
                <span className="text-3xl font-extrabold text-rose-400 font-mono">{resBisap.pontuacao_total}</span>
                <span className="text-xs text-slate-400 ml-1">/ 5 pts</span>
              </div>
              <div className="text-right text-xs">
                <div className="font-bold text-slate-200">
                  {resBisap.categoria_gravidade} (Mortalidade: {resBisap.mortalidade_prevista_percentual})
                </div>
                <div className="text-slate-400 mt-1">{resBisap.conduta}</div>
              </div>
            </div>
          )}
        </CardCalculadora>
      )}

      {/* 5. FIB-4 */}
      {calculadoraAtiva === 'fib4' && (
        <CardCalculadora
          meta={metaFib}
          icone={Stethoscope}
          corDestaque="teal"
          isFavorito={isFavorito('fib4')}
          onToggleFavorito={onToggleFavorito}
          onNavegarCalculadora={onNavegarCalculadora}
          textoProntuario={textoProntuarioFib}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Idade (anos)</label>
              <input
                type="number"
                value={fibIdade}
                onChange={(e) => setFibIdade(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">AST / TGO (U/L)</label>
              <input
                type="number"
                value={fibAst}
                onChange={(e) => setFibAst(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">ALT / TGP (U/L)</label>
              <input
                type="number"
                value={fibAlt}
                onChange={(e) => setFibAlt(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Plaquetas (mil/mm³)</label>
              <input
                type="number"
                value={fibPlaq}
                onChange={(e) => setFibPlaq(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
          </div>

          {resFib && (
            <div className="p-4 bg-slate-900 border border-teal-500/20 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Índice FIB-4</span>
                <span className="text-3xl font-extrabold text-teal-400 font-mono">{resFib.score_fib4.toFixed(2)}</span>
              </div>
              <div className="text-right text-xs">
                <div className="font-bold text-slate-200">
                  {resFib.estratificacao_fibrose} ({resFib.valor_preditivo})
                </div>
                <div className="text-slate-400 mt-1">{resFib.conduta_encaminhamento}</div>
              </div>
            </div>
          )}
        </CardCalculadora>
      )}

      {/* 6. ALVARADO */}
      {calculadoraAtiva === 'alvarado' && (
        <CardCalculadora
          meta={metaAlv}
          icone={Scissors}
          corDestaque="amber"
          isFavorito={isFavorito('alvarado')}
          onToggleFavorito={onToggleFavorito}
          onNavegarCalculadora={onNavegarCalculadora}
          textoProntuario={textoProntuarioAlv}
        >
          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={alvDorMigra} onChange={(e) => setAlvDorMigra(e.target.checked)} />
              <span>Dor migratória para a fossa ilíaca direita (+1 pt)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={alvAnorexia} onChange={(e) => setAlvAnorexia(e.target.checked)} />
              <span>Anorexia ou cetonúria (+1 pt)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={alvNausea} onChange={(e) => setAlvNausea(e.target.checked)} />
              <span>Náusea ou vômito (+1 pt)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer font-bold text-amber-300">
              <input type="checkbox" checked={alvDorFid} onChange={(e) => setAlvDorFid(e.target.checked)} />
              <span>Dor à palpação na fossa ilíaca direita (Sinal importante) (+2 pts)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer font-bold text-amber-300">
              <input type="checkbox" checked={alvDescomp} onChange={(e) => setAlvDescomp(e.target.checked)} />
              <span>Descompressão brusca dolorosa positiva (Blumberg) (+2 pts)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={alvFebre} onChange={(e) => setAlvFebre(e.target.checked)} />
              <span>Temperatura axilar &gt; 37,3 °C (+1 pt)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={alvLeuco} onChange={(e) => setAlvLeuco(e.target.checked)} />
              <span>Leucocitose &gt; 10.000 /mm³ (+2 pts)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={alvDesvio} onChange={(e) => setAlvDesvio(e.target.checked)} />
              <span>Desvio à esquerda dos neutrófilos &gt; 75% (+1 pt)</span>
            </label>
          </div>

          {resAlv && (
            <div className="p-4 bg-slate-900 border border-amber-500/20 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Escore de Alvarado</span>
                <span className="text-3xl font-extrabold text-amber-400 font-mono">{resAlv.pontuacao_total}</span>
                <span className="text-xs text-slate-400 ml-1">/ 10 pts</span>
              </div>
              <div className="text-right text-xs">
                <div className="font-bold text-slate-200">Probabilidade: {resAlv.probabilidade_apendicite}</div>
                <div className="text-slate-400 mt-1">{resAlv.conduta_cirurgica}</div>
              </div>
            </div>
          )}
        </CardCalculadora>
      )}

      {/* 7. CORTICOIDES */}
      {calculadoraAtiva === 'corticoides' && (
        <CardCalculadora
          meta={metaCort}
          icone={Pill}
          corDestaque="teal"
          isFavorito={isFavorito('corticoides')}
          onToggleFavorito={onToggleFavorito}
          onNavegarCalculadora={onNavegarCalculadora}
          textoProntuario={textoProntuarioCort}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Corticoide de Referência</label>
              <select
                value={corticoideOrigem}
                onChange={(e) => setCorticoideOrigem(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
              >
                <option value="prednisona">Prednisona / Prednisolona</option>
                <option value="dexametasona">Dexametasona</option>
                <option value="hidrocortisona">Hidrocortisona</option>
                <option value="metilprednisolona">Metilprednisolona</option>
                <option value="betametasona">Betametasona</option>
                <option value="deflazacorte">Deflazacorte</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Dose Atual (mg/dia)</label>
              <input
                type="number"
                step="0.5"
                value={doseOrigem}
                onChange={(e) => setDoseOrigem(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-teal-400"
              />
            </div>
          </div>

          {resCort && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {resCort.doses_equivalentes.map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold truncate">
                      {item.farmaco}
                    </span>
                    <strong className="text-base font-bold text-teal-300 font-mono">
                      {item.dose_equivalente_mg.toFixed(1)} mg
                    </strong>
                    <div className="text-[10px] text-slate-500 mt-0.5">Duração: {item.duracao_efeito_horas}</div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300">
                <span className="font-semibold text-slate-200 block mb-1">
                  Esquema Prático de Desmame (Evitar Insuficiência Adrenal):
                </span>
                {resCort.esquema_desmame_sugerido}
              </div>
            </div>
          )}
        </CardCalculadora>
      )}

      {/* 8. ANTROPOMETRIA */}
      {calculadoraAtiva === 'antropometria' && (
        <CardCalculadora
          meta={metaAntro}
          icone={Scale}
          corDestaque="sky"
          isFavorito={isFavorito('antropometria')}
          onToggleFavorito={onToggleFavorito}
          onNavegarCalculadora={onNavegarCalculadora}
          textoProntuario={textoProntuarioAntro}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Peso Real (kg)</label>
              <input
                type="number"
                value={pesoAntro}
                onChange={(e) => setPesoAntro(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Altura (cm)</label>
              <input
                type="number"
                value={alturaAntro}
                onChange={(e) => setAlturaAntro(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Sexo Biológico</label>
              <ChipSegmentado<boolean>
                valor={sexoFemAntro}
                opcoes={[
                  { valor: false, rotulo: 'Masculino' },
                  { valor: true, rotulo: 'Feminino' },
                ]}
                onChange={setSexoFemAntro}
                corAtiva="bg-sky-600"
              />
            </div>
          </div>

          {resAntro && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">IMC</span>
                  <strong className="text-xl font-bold text-sky-400 font-mono">
                    {resAntro.imc.toFixed(1)} <span className="text-xs text-slate-400">kg/m²</span>
                  </strong>
                  <div className="text-[10px] text-slate-400 mt-0.5">{resAntro.classificacao_imc}</div>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Peso Ideal (Devine)</span>
                  <strong className="text-xl font-bold text-teal-300 font-mono">
                    {resAntro.peso_ideal_devine_kg.toFixed(1)} kg
                  </strong>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Peso Ajustado (Obesos)</span>
                  <strong className="text-xl font-bold text-amber-300 font-mono">
                    {resAntro.peso_ajustado_obesidade_kg.toFixed(1)} kg
                  </strong>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Área Corporal (Mosteller)</span>
                  <strong className="text-xl font-bold text-purple-300 font-mono">
                    {resAntro.superficie_corporal_mosteller_m2.toFixed(2)} m²
                  </strong>
                </div>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300">
                <strong>Recomendação Farmacológica:</strong> {resAntro.recomendacao_drogas_hidrofilicas}
              </div>
            </div>
          )}
        </CardCalculadora>
      )}

      {/* 9. CENTOR / MCISAAC */}
      {calculadoraAtiva === 'centor' && (
        <CardCalculadora
          meta={metaCentor}
          icone={Stethoscope}
          corDestaque="purple"
          isFavorito={isFavorito('centor')}
          onToggleFavorito={onToggleFavorito}
          onNavegarCalculadora={onNavegarCalculadora}
          textoProntuario={textoProntuarioCentor}
        >
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-slate-900 rounded-xl flex items-center justify-between">
              <label className="text-slate-300 font-semibold">Idade do Paciente (anos)</label>
              <input
                type="number"
                value={centorIdade}
                onChange={(e) => setCentorIdade(parseInt(e.target.value) || 0)}
                className="w-24 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-100 font-mono text-right"
              />
            </div>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={centorFebre} onChange={(e) => setCentorFebre(e.target.checked)} />
              <span>Febre relatada ou aferida &gt; 38 °C (+1 pt)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={centorSemTosse} onChange={(e) => setCentorSemTosse(e.target.checked)} />
              <span>Ausência de tosse (+1 pt)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={centorLinfonodo}
                onChange={(e) => setCentorLinfonodo(e.target.checked)}
              />
              <span>Linfonodomegalia cervical anterior dolorosa (+1 pt)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={centorExsudato}
                onChange={(e) => setCentorExsudato(e.target.checked)}
              />
              <span>Exsudato amigdaliano ou edema amigdaliano (+1 pt)</span>
            </label>
          </div>

          {resCentor && (
            <div className="p-4 bg-slate-900 border border-purple-500/20 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Centor/McIsaac Total</span>
                <span className="text-3xl font-extrabold text-purple-400 font-mono">{resCentor.pontuacao_total}</span>
                <span className="text-xs text-slate-400 ml-1">pts</span>
              </div>
              <div className="text-right text-xs">
                <div className="font-bold text-slate-200">
                  Strepto Grupo A: {resCentor.probabilidade_strepto_percentual}
                </div>
                <div className="text-purple-300 mt-1">{resCentor.indicacao_teste_rapido_ou_atb}</div>
              </div>
            </div>
          )}
        </CardCalculadora>
      )}

      {/* 10. IDADE GESTACIONAL & DPP */}
      {calculadoraAtiva === 'idade_gestacional' && (
        <CardCalculadora
          meta={metaDum}
          icone={Calendar}
          corDestaque="rose"
          isFavorito={isFavorito('idade_gestacional')}
          onToggleFavorito={onToggleFavorito}
          onNavegarCalculadora={onNavegarCalculadora}
          textoProntuario={textoProntuarioDum}
        >
          <div className="grid grid-cols-3 gap-2.5 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Dia da DUM</label>
              <input
                type="number"
                min="1"
                max="31"
                value={dumDia}
                onChange={(e) => setDumDia(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Mês da DUM</label>
              <input
                type="number"
                min="1"
                max="12"
                value={dumMes}
                onChange={(e) => setDumMes(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Ano da DUM</label>
              <input
                type="number"
                value={dumAno}
                onChange={(e) => setDumAno(parseInt(e.target.value) || 2026)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
          </div>

          {resDum && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-center text-xs">
                <div className="p-3 bg-rose-950/40 border border-rose-800/40 rounded-xl">
                  <span className="text-[10px] text-rose-300 uppercase block font-semibold">Idade Gestacional Atual</span>
                  <div className="text-2xl font-bold text-white font-mono">
                    {resDum.idade_gestacional_semanas} sem e {resDum.idade_gestacional_dias} dias
                  </div>
                  <div className="text-xs text-rose-200 mt-0.5">{resDum.trimestre_atual}</div>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                    Data Provável do Parto (DPP - Naegele)
                  </span>
                  <div className="text-2xl font-bold text-teal-300 font-mono">
                    {resDum.data_provavel_parto_naegele}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">40 semanas de gestação</div>
                </div>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300">
                <span className="font-semibold text-slate-200 block mb-1">
                  Exames de Rotina Recomendados para o {resDum.trimestre_atual}:
                </span>
                <ul className="list-disc list-inside space-y-0.5">
                  {resDum.exames_do_trimestre.map((ex, i) => (
                    <li key={i}>{ex}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardCalculadora>
      )}
    </>
  );
};
