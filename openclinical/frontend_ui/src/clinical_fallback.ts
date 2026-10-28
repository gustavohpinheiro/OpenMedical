// Porte fiel do motor clínico Rust (clinical_engine) para execução em navegador/PWA,
// onde o Tauri IPC não existe. Qualquer alteração aqui deve espelhar calculators.rs e
// pediatric.rs; a paridade é verificada em tests/paridade_calculos.test.mjs.
import type {
  ResultadoCurb65,
  ResultadoDosePediatrica,
  ResultadoTfg,
  ResultadoWells,
} from './types';

export const GOTAS_POR_MILILITRO = 20;

export class ErroClinico extends Error {}

function arredondar2(valor: number): number {
  return Math.round(valor * 100) / 100;
}

function exigirNumero(campo: string, valor: unknown): number {
  const numero = typeof valor === 'number' ? valor : Number(valor);
  if (valor === null || valor === undefined || valor === '' || !Number.isFinite(numero)) {
    throw new ErroClinico(`Parâmetro '${campo}' ausente ou inválido`);
  }
  return numero;
}

function parametroInvalido(campo: string, valor: number, motivo: string): ErroClinico {
  return new ErroClinico(`Parâmetro fisiológico inválido: ${campo}. Valor recebido: ${valor}. Motivo: ${motivo}`);
}

function validarCreatinina(creatinina: number): void {
  if (creatinina <= 0 || creatinina > 30) {
    throw parametroInvalido('creatinina', creatinina, 'A creatinina sérica deve estar em faixa clinicamente compatível (> 0.0 e <= 30.0 mg/dL).');
  }
}

function validarIdadeAdulta(idade: number): void {
  if (!Number.isInteger(idade) || idade < 18 || idade > 125) {
    throw parametroInvalido('idade', idade, 'A fórmula é validada estritamente para indivíduos adultos (>= 18 anos).');
  }
}

export function calcularTfgCkdEpi2021(creatinina: number, idade: number, sexoFeminino: boolean): number {
  validarCreatinina(creatinina);
  validarIdadeAdulta(idade);

  const kappa = sexoFeminino ? 0.7 : 0.9;
  const alpha = sexoFeminino ? -0.241 : -0.302;
  const multiplicadorSexo = sexoFeminino ? 1.012 : 1.0;

  const razao = creatinina / kappa;
  const tfg =
    142.0 *
    Math.pow(Math.min(razao, 1.0), alpha) *
    Math.pow(Math.max(razao, 1.0), -1.2) *
    Math.pow(0.9938, idade) *
    multiplicadorSexo;

  return arredondar2(tfg);
}

export function avaliarEstagioDrc(tfg: number): ResultadoTfg {
  let estagio: string;
  let recomendacao: string;
  if (tfg >= 90) {
    estagio = 'G1 - Função renal normal ou elevada';
    recomendacao = 'Função normal. Acompanhamento anual de rotina.';
  } else if (tfg >= 60) {
    estagio = 'G2 - Levemente diminuída';
    recomendacao = 'Leve redução. Monitorar fatores de risco cardiovascular e albuminúria.';
  } else if (tfg >= 45) {
    estagio = 'G3a - Leve a moderadamente diminuída';
    recomendacao = 'Atenção a medicamentos nefrotóxicos e ajuste inicial de posologia.';
  } else if (tfg >= 30) {
    estagio = 'G3b - Moderada a gravemente diminuída';
    recomendacao = 'Ajuste obrigatório de doses (ex: metformina limitada a 1000 mg/dia e sem iniciar tratamento novo). Encaminhar ao nefrologista.';
  } else if (tfg >= 15) {
    estagio = 'G4 - Gravemente diminuída';
    recomendacao = 'Contraindicação de diversos fármacos (metformina, IECA/BRA em hipercalemia). Preparo para terapia renal substitutiva.';
  } else {
    estagio = 'G5 - Falência renal terminal';
    recomendacao = 'Terapia renal substitutiva (hemodiálise / diálise peritoneal) ou transplante renal.';
  }
  return {
    taxa_filtracao_glomerular: tfg,
    estagio_drc: estagio,
    metodo_utilizado: 'CKD-EPI 2021 (sem viés racial)',
    recomendacao_geral: recomendacao,
  };
}

export function calcularClearanceCockcroftGault(
  creatinina: number,
  pesoKg: number,
  idade: number,
  sexoFeminino: boolean,
): number {
  validarCreatinina(creatinina);
  if (pesoKg <= 0 || pesoKg > 400) {
    throw parametroInvalido('peso_kg', pesoKg, 'O peso do paciente deve ser positivo e clinicamente factível.');
  }
  validarIdadeAdulta(idade);

  const fatorSexo = sexoFeminino ? 0.85 : 1.0;
  return arredondar2(((140 - idade) * pesoKg) / (72 * creatinina) * fatorSexo);
}

export function calcularEscoreCurb65(
  confusao: boolean,
  ureiaMaior50: boolean,
  frMaior30: boolean,
  hipotensao: boolean,
  idadeMaior65: boolean,
): number {
  return [confusao, ureiaMaior50, frMaior30, hipotensao, idadeMaior65].filter(Boolean).length;
}

export function avaliarCurb65Detalhado(
  confusao: boolean,
  ureiaMaior50: boolean,
  frMaior30: boolean,
  hipotensao: boolean,
  idadeMaior65: boolean,
): ResultadoCurb65 {
  const pontuacao = calcularEscoreCurb65(confusao, ureiaMaior50, frMaior30, hipotensao, idadeMaior65);
  if (pontuacao <= 1) {
    return {
      pontuacao,
      estrato_mortalidade: 'Baixo risco (mortalidade estimada < 3%)',
      recomendacao_local_tratamento: 'Tratamento ambulatorial com antibioticoterapia oral e reavaliação clínica em 48-72h.',
    };
  }
  if (pontuacao === 2) {
    return {
      pontuacao,
      estrato_mortalidade: 'Risco intermediário (mortalidade estimada de ~9%)',
      recomendacao_local_tratamento: 'Considerar internação em enfermaria ou supervisão ambulatorial estrita com observação inicial.',
    };
  }
  return {
    pontuacao,
    estrato_mortalidade: 'Alto risco (mortalidade estimada de 15% a 40%)',
    recomendacao_local_tratamento: 'Internação hospitalar imediata em enfermaria ou UTI. Se pontuação >= 4, avaliar suporte de terapia intensiva.',
  };
}

export interface ParametrosWells {
  sinais_clinicos_tvp: boolean;
  diagnostico_alternativo_menos_provavel: boolean;
  fc_maior_100: boolean;
  imobilizacao_ou_cirurgia_recente: boolean;
  historico_previo_tep_tvp: boolean;
  hemoptise: boolean;
  malignidade_ativa: boolean;
}

export function calcularEscoreWellsTep(p: ParametrosWells): ResultadoWells {
  let pontos = 0;
  if (p.sinais_clinicos_tvp) pontos += 3;
  if (p.diagnostico_alternativo_menos_provavel) pontos += 3;
  if (p.fc_maior_100) pontos += 1.5;
  if (p.imobilizacao_ou_cirurgia_recente) pontos += 1.5;
  if (p.historico_previo_tep_tvp) pontos += 1.5;
  if (p.hemoptise) pontos += 1;
  if (p.malignidade_ativa) pontos += 1;

  if (pontos < 2) {
    return {
      pontuacao_total: pontos,
      categoria_risco: 'Baixa probabilidade clínica',
      probabilidade_clinica_percentual: '~1% a 4% (derivação de Wells 2000: 1,3%)',
      conduta_propedêutica: 'Aplicar critérios PERC se disponíveis ou solicitar D-Dímero de alta sensibilidade para descarte.',
    };
  }
  if (pontos <= 6) {
    return {
      pontuacao_total: pontos,
      categoria_risco: 'Moderada probabilidade clínica',
      probabilidade_clinica_percentual: '~16% a 20% (derivação de Wells 2000: 16,2%)',
      conduta_propedêutica: 'Solicitar D-Dímero. Se positivo, realizar Angiotomografia de Artérias Pulmonares (Angio-TC).',
    };
  }
  return {
    pontuacao_total: pontos,
    categoria_risco: 'Alta probabilidade clínica',
    probabilidade_clinica_percentual: '~40% a 65% (derivação de Wells 2000: 40,6%)',
    conduta_propedêutica: 'Indicação formal de Angiotomografia Computadorizada de Tórax imediata. Iniciar anticoagulação empírica se não houver contraindicação.',
  };
}

export function calcularVazaoInfusao(doseMcgKgMin: number, pesoKg: number, concentracaoMgMl: number): number {
  if (doseMcgKgMin <= 0) {
    throw parametroInvalido('dose_mcg_kg_min', doseMcgKgMin, 'A dose alvo de infusão deve ser estritamente positiva.');
  }
  if (pesoKg <= 0 || pesoKg > 400) {
    throw parametroInvalido('peso_kg', pesoKg, 'O peso do paciente deve ser válido e positivo.');
  }
  if (concentracaoMgMl <= 0) {
    throw new ErroClinico(`Concentração do fármaco não pode ser menor ou igual a zero: ${concentracaoMgMl}`);
  }
  return arredondar2((doseMcgKgMin * pesoKg * 60) / (concentracaoMgMl * 1000));
}

export function calcularDosePediatrica(
  pesoKg: number,
  doseAlvoMgKgDia: number,
  concentracaoMgMl: number | null,
  fracionamentoDiario: number,
  doseMaximaDiariaMg: number | null,
): ResultadoDosePediatrica {
  if (pesoKg <= 0 || pesoKg > 150) {
    throw parametroInvalido('peso_kg', pesoKg, 'O peso pediátrico deve ser estritamente positivo e compatível com a infância/adolescência.');
  }
  if (doseAlvoMgKgDia <= 0) {
    throw parametroInvalido('dose_alvo_mg_kg_dia', doseAlvoMgKgDia, 'A dose alvo em mg/kg/dia deve ser maior que zero.');
  }
  if (concentracaoMgMl !== null && concentracaoMgMl <= 0) {
    throw new ErroClinico(`Concentração do fármaco não pode ser menor ou igual a zero: ${concentracaoMgMl}`);
  }
  if (!Number.isInteger(fracionamentoDiario) || fracionamentoDiario < 1 || fracionamentoDiario > 24) {
    throw new ErroClinico(`Fracionamento diário inválido: ${fracionamentoDiario}. Deve ser entre 1 e 24 tomadas ao dia.`);
  }

  const doseTotalCalculada = pesoKg * doseAlvoMgKgDia;
  const tetoExcedido = doseMaximaDiariaMg !== null && doseTotalCalculada > doseMaximaDiariaMg;
  const doseTetoAplicada = tetoExcedido ? (doseMaximaDiariaMg as number) : doseTotalCalculada;

  const doseTomada = doseTetoAplicada / fracionamentoDiario;
  // Sem formulação líquida (comprimido, cápsula) a dose fica só em mg, como no motor Rust
  const volumeMl = concentracaoMgMl === null ? null : doseTomada / concentracaoMgMl;

  return {
    peso_kg: arredondar2(pesoKg),
    dose_alvo_mg_kg_dia: arredondar2(doseAlvoMgKgDia),
    dose_total_calculada_mg_dia: arredondar2(doseTotalCalculada),
    dose_teto_aplicada_mg_dia: arredondar2(doseTetoAplicada),
    fracionamento_diario: fracionamentoDiario,
    intervalo_horas: Math.floor(24 / fracionamentoDiario),
    dose_por_tomada_mg: arredondar2(doseTomada),
    volume_ml_por_tomada: volumeMl === null ? null : arredondar2(volumeMl),
    numero_gotas_por_tomada: volumeMl === null ? null : Math.round(volumeMl * GOTAS_POR_MILILITRO),
    alerta_teto_ultrapassado: tetoExcedido,
    justificativa_seguranca: tetoExcedido
      ? `Alerta Clínico: A dose calculada de ${doseTotalCalculada.toFixed(2)} mg/dia excedeu a dose máxima diária recomendada de ${(doseMaximaDiariaMg as number).toFixed(2)} mg/dia. O regime foi limitado com segurança ao teto máximo diário.`
      : null,
  };
}

/** Despacha um cálculo pelo mesmo contrato de parâmetros usado pelo comando Tauri `executar_calculo_clinico`. */
export function executarCalculoLocal(tipo: string, parametros: Record<string, unknown>): unknown {
  const booleano = (campo: string): boolean => parametros[campo] === true;

  switch (tipo) {
    case 'ckd_epi_2021': {
      const tfg = calcularTfgCkdEpi2021(
        exigirNumero('creatinina', parametros.creatinina),
        exigirNumero('idade', parametros.idade),
        booleano('sexo_feminino'),
      );
      return avaliarEstagioDrc(tfg);
    }
    case 'cockcroft_gault': {
      const crcl = calcularClearanceCockcroftGault(
        exigirNumero('creatinina', parametros.creatinina),
        exigirNumero('peso_kg', parametros.peso_kg),
        exigirNumero('idade', parametros.idade),
        booleano('sexo_feminino'),
      );
      return { clearance_creatinina_ml_min: crcl, metodo: 'Cockcroft-Gault (1976)' };
    }
    case 'curb65':
      return avaliarCurb65Detalhado(
        booleano('confusao'),
        booleano('ureia_maior_50'),
        booleano('fr_maior_30'),
        booleano('hipotensao'),
        booleano('idade_maior_65'),
      );
    case 'wells_tep':
      return calcularEscoreWellsTep({
        sinais_clinicos_tvp: booleano('sinais_clinicos_tvp'),
        diagnostico_alternativo_menos_provavel: booleano('diagnostico_alternativo_menos_provavel'),
        fc_maior_100: booleano('fc_maior_100'),
        imobilizacao_ou_cirurgia_recente: booleano('imobilizacao_ou_cirurgia_recente'),
        historico_previo_tep_tvp: booleano('historico_previo_tep_tvp'),
        hemoptise: booleano('hemoptise'),
        malignidade_ativa: booleano('malignidade_ativa'),
      });
    case 'vazao_infusao': {
      const dose = exigirNumero('dose_mcg_kg_min', parametros.dose_mcg_kg_min);
      const peso = exigirNumero('peso_kg', parametros.peso_kg);
      const concentracao = exigirNumero('concentracao_mg_ml', parametros.concentracao_mg_ml);
      return {
        vazao_ml_h: calcularVazaoInfusao(dose, peso, concentracao),
        unidade: 'mL/h',
        dose_mcg_kg_min: dose,
        peso_kg: peso,
        concentracao_mg_ml: concentracao,
      };
    }
    case 'dose_pediatrica': {
      const teto = parametros.dose_maxima_diaria_mg;
      const concentracao = parametros.concentracao_mg_ml;
      return calcularDosePediatrica(
        exigirNumero('peso_kg', parametros.peso_kg),
        exigirNumero('dose_alvo_mg_kg_dia', parametros.dose_alvo_mg_kg_dia),
        concentracao === null || concentracao === undefined ? null : exigirNumero('concentracao_mg_ml', concentracao),
        exigirNumero('fracionamento_diario', parametros.fracionamento_diario),
        teto === null || teto === undefined || teto === '' ? null : exigirNumero('dose_maxima_diaria_mg', teto),
      );
    }
    default:
      throw new ErroClinico(`Tipo de cálculo clínico desconhecido: '${tipo}'`);
  }
}
