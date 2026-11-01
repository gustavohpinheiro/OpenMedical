// Porte fiel do motor clínico Rust (clinical_engine) para execução em navegador/PWA,
// onde o Tauri IPC não existe. Qualquer alteração aqui deve espelhar calculators.rs e
// pediatric.rs; a paridade é verificada em tests/paridade_calculos.test.mjs.
import type {
  ResultadoAlvarado,
  ResultadoAntropometriaFarmacologica,
  ResultadoBisap,
  ResultadoCentorMcIsaac,
  ResultadoChildPugh,
  ResultadoCranioCervical,
  ResultadoDengueMs,
  ResultadoEquivalenciaCorticoide,
  ResultadoFenaFeureia,
  ResultadoFib4,
  ResultadoGlasgowBlatchford,
  ResultadoGlasgowP,
  ResultadoHasBled,
  ResultadoHeartScore,
  ResultadoIdadeGestacionalDpp,
  ResultadoMeldNa,
  ResultadoMetabolicoCad,
  ResultadoPaduaTev,
  ResultadoPamPpc,
  ResultadoParkland,
  ResultadoPerc,
  ResultadoQtcCorrigido,
  ResultadoSofaCompleto,
  ResultadoTromboliseAvc,
  ResultadoWellsTvp,
  ResultadoCha2ds2Va,
  ResultadoCorrecaoSodio,
  ResultadoCurb65,
  ResultadoDosePediatrica,
  ResultadoEmergenciaPediatrica,
  ResultadoGasometria,
  ResultadoIntubacaoSri,
  ResultadoQsofa,
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
export function calcularDoseReversaInfusao(
  vazaoMlH: number,
  pesoKg: number,
  concentracaoMgMl: number
): number {
  if (vazaoMlH < 0) {
    throw parametroInvalido('vazao_ml_h', vazaoMlH, 'A vazão da bomba não pode ser negativa.');
  }
  if (pesoKg <= 0 || pesoKg > 400) {
    throw parametroInvalido('peso_kg', pesoKg, 'O peso do paciente deve ser válido e positivo.');
  }
  if (concentracaoMgMl <= 0) {
    throw new ErroClinico(`Concentração do fármaco não pode ser menor ou igual a zero: ${concentracaoMgMl}`);
  }
  const dose = (vazaoMlH * concentracaoMgMl * 1000) / (pesoKg * 60);
  return Math.round(dose * 1000) / 1000;
}

export function calcularEscoreCha2ds2Va(
  insuficienciaCardiaca: boolean,
  hipertensao: boolean,
  idade: number,
  diabetes: boolean,
  avcOuAitPrevio: boolean,
  doencaVascular: boolean
): ResultadoCha2ds2Va {
  let pontos = 0;
  if (insuficienciaCardiaca) pontos += 1;
  if (hipertensao) pontos += 1;
  if (idade >= 75) pontos += 2;
  else if (idade >= 65) pontos += 1;
  if (diabetes) pontos += 1;
  if (avcOuAitPrevio) pontos += 2;
  if (doencaVascular) pontos += 1;

  let categoria = '';
  let taxa = '';
  let recomendacao = '';

  if (pontos === 0) {
    categoria = 'Muito Baixo Risco Tromboembólico';
    taxa = '0.2% ao ano';
    recomendacao = 'Anticoagulação oral não indicada (risco de sangramento supera benefício embólico).';
  } else if (pontos === 1) {
    categoria = 'Baixo a Moderado Risco Tromboembólico';
    taxa = '0.9% ao ano';
    recomendacao = 'Anticoagulação oral (DOAC de escolha sobre AVK) deve ser considerada (Classe IIa).';
  } else if (pontos === 2) {
    categoria = 'Moderado a Alto Risco Tromboembólico';
    taxa = '2.2% ao ano';
    recomendacao =
      'Indicação formal de anticoagulação oral (DOACs de 1ª escolha: Apixabana, Rivaroxabana, Dabigatrana ou Edoxabana - Classe I).';
  } else if (pontos === 3) {
    categoria = 'Alto Risco Tromboembólico';
    taxa = '3.2% ao ano';
    recomendacao =
      'Indicação formal de anticoagulação oral (DOACs recomendados - Classe I). Monitorar adesão e função renal anualmente.';
  } else {
    categoria = 'Muito Alto Risco Tromboembólico';
    taxa = '> 4.8% ao ano';
    recomendacao =
      'Indicação imperativa de anticoagulação oral plena imediata (Classe I). Avaliar escores de sangramento (HAS-BLED) apenas para corrigir fatores de risco modificáveis, não para contraindicar anticoagulante.';
  }

  return {
    pontuacao: pontos,
    categoria_risco: categoria,
    taxa_avc_anual_estimada: taxa,
    recomendacao_anticoagulacao: recomendacao,
  };
}

export function calcularEscoreQsofa(
  frMaior22: boolean,
  pasMenor100: boolean,
  alteracaoMental: boolean
): ResultadoQsofa {
  let pontos = 0;
  if (frMaior22) pontos += 1;
  if (pasMenor100) pontos += 1;
  if (alteracaoMental) pontos += 1;

  const altoRisco = pontos >= 2;
  const recomendacao = altoRisco
    ? 'Alto risco de desfecho desfavorável e óbito por sepse (qSOFA >= 2). Ações imediatas (Golden Hour): Coletar 2 pares de hemoculturas, dosar lactato sérico, iniciar ressuscitação volêmica (30 mL/kg de cristaloide) se hipotensão ou lactato >= 4 mmol/L, e prescrever antimicrobiano de amplo espectro na 1ª hora.'
    : 'Baixo risco de deterioração rápida pelo qSOFA isolado (< 2 pontos). Manter monitorização clínica seriada e calcular SOFA laboratorial completo se houver persistência de sinais de infecção com disfunção de órgãos.';

  return {
    pontuacao: pontos,
    alto_risco_sepse: altoRisco,
    recomendacao,
  };
}

export function calcularIntubacaoSri(
  pesoKg: number,
  alturaCm: number,
  sexoFeminino: boolean,
  perfil: string
): ResultadoIntubacaoSri {
  if (pesoKg < 3 || pesoKg > 300) {
    throw parametroInvalido('peso_kg', pesoKg, 'Peso do paciente deve estar entre 3.0 e 300.0 kg.');
  }
  if (alturaCm < 50 || alturaCm > 250) {
    throw parametroInvalido('altura_cm', alturaCm, 'Altura deve estar entre 50.0 e 250.0 cm.');
  }

  const pesoPredito = sexoFeminino
    ? 45.5 + 0.91 * (alturaCm - 152.4)
    : 50.0 + 0.91 * (alturaCm - 152.4);
  const pesoPreditoFinal = pesoPredito < 15.0 ? pesoKg : Math.round(pesoPredito * 10) / 10;
  const volumeCorrente = Math.round(6.0 * pesoPreditoFinal);

  const perfilNorm = perfil.trim().toLowerCase();
  const farmacos = [
    {
      classe: 'Pré-tratamento / Analgesia',
      nome_farmaco: 'Fentanil',
      apresentacao_ampola: '50 mcg/mL (0.05 mg/mL) - Ampola 2 mL ou 10 mL',
      dose_mg_kg: 0.002,
      dose_total_mg: Math.round(pesoKg * 0.002 * 1000) / 1000,
      volume_administrar_ml: Math.round(((pesoKg * 0.002) / 0.05) * 10) / 10,
      recomendado_perfil: perfilNorm === 'neuroprotecao_tce' || perfilNorm === 'padrao',
      observacao_clinica:
        perfilNorm === 'choque_instavel'
          ? 'Atenção: pode agravar hipotensão em choque; considerar reduzir dose em 50% ou omitir pré-tratamento.'
          : 'Atenua reflexo simpático e pico hipertensivo/pressão intracraniana durante a laringoscopia.',
    },
    {
      classe: 'Indutor Hipnótico',
      nome_farmaco: 'Etomidato',
      apresentacao_ampola: '2 mg/mL - Ampola 10 mL (20 mg)',
      dose_mg_kg: 0.3,
      dose_total_mg: Math.round(pesoKg * 0.3 * 10) / 10,
      volume_administrar_ml: Math.round(((pesoKg * 0.3) / 2.0) * 10) / 10,
      recomendado_perfil:
        perfilNorm === 'choque_instavel' || perfilNorm === 'neuroprotecao_tce' || perfilNorm === 'padrao',
      observacao_clinica:
        'Excelente estabilidade hemodinâmica e neuroprotetor. Supressão adrenal transitória de relevância clínica duvidosa em dose única.',
    },
    {
      classe: 'Indutor Hipnótico / Dissociativo',
      nome_farmaco: 'Cetamina (Ketamina)',
      apresentacao_ampola: '50 mg/mL - Frasco-ampola 10 mL (500 mg)',
      dose_mg_kg: 1.5,
      dose_total_mg: Math.round(pesoKg * 1.5 * 10) / 10,
      volume_administrar_ml: Math.round(((pesoKg * 1.5) / 50.0) * 100) / 100,
      recomendado_perfil: perfilNorm === 'choque_instavel' || perfilNorm === 'broncoespasmo_grave',
      observacao_clinica:
        'Indutor de escolha em broncoespasmo grave (ação broncodilatadora) e choque séptico/cardiogênico (estímulo adrenérgico indireto).',
    },
    {
      classe: 'Indutor Hipnótico',
      nome_farmaco: 'Propofol 1%',
      apresentacao_ampola: '10 mg/mL - Ampola 20 mL (200 mg)',
      dose_mg_kg: 1.5,
      dose_total_mg: Math.round(pesoKg * 1.5 * 10) / 10,
      volume_administrar_ml: Math.round(((pesoKg * 1.5) / 10.0) * 10) / 10,
      recomendado_perfil: perfilNorm === 'broncoespasmo_grave',
      observacao_clinica:
        perfilNorm === 'choque_instavel'
          ? 'CONTRAINDICADO RELATIVO no choque: potente vasodilatador venoso e depressor miocárdico com risco de colapso circulatório.'
          : 'Ação broncodilatadora e rápido despertar. Monitorar rigorosamente pressão arterial.',
    },
    {
      classe: 'Indutor Hipnótico (Reserva)',
      nome_farmaco: 'Midazolam',
      apresentacao_ampola: '5 mg/mL - Ampola 3 mL (15 mg) ou 10 mL (50 mg)',
      dose_mg_kg: 0.15,
      dose_total_mg: Math.round(pesoKg * 0.15 * 10) / 10,
      volume_administrar_ml: Math.round(((pesoKg * 0.15) / 5.0) * 10) / 10,
      recomendado_perfil: false,
      observacao_clinica:
        'Indutor de segunda linha/reserva. Início de ação mais errático (~90 a 120s) e risco frequente de vasodilatação/hipotensão prolongada.',
    },
    {
      classe: 'Bloqueador Neuromuscular Despolarizante',
      nome_farmaco: 'Succinilcolina',
      apresentacao_ampola: 'Frasco 100 mg (reconstituir com 10 mL de AD = 10 mg/mL)',
      dose_mg_kg: 1.2,
      dose_total_mg: Math.round(pesoKg * 1.2 * 10) / 10,
      volume_administrar_ml: Math.round(((pesoKg * 1.2) / 10.0) * 10) / 10,
      recomendado_perfil: true,
      observacao_clinica:
        'Início ultrarrápido (45-60s) e duração curta (6-10 min). CONTRAINDICADO em hipercalemia, queimados > 48h, denervação medular, rabdomiólise e histórico de hipertermia maligna.',
    },
    {
      classe: 'Bloqueador Neuromuscular Não Despolarizante',
      nome_farmaco: 'Brometo de Rocurônio',
      apresentacao_ampola: '10 mg/mL - Frasco-ampola 5 mL (50 mg)',
      dose_mg_kg: 1.2,
      dose_total_mg: Math.round(pesoKg * 1.2 * 10) / 10,
      volume_administrar_ml: Math.round(((pesoKg * 1.2) / 10.0) * 10) / 10,
      recomendado_perfil: true,
      observacao_clinica:
        'BNM de escolha na ISR quando há contraindicação à succinilcolina. Condições de intubação em 60s na dose plena de 1.2 mg/kg. Reversor disponível: Sugamadex.',
    },
  ];

  return {
    peso_real_kg: pesoKg,
    perfil_hemodinamico: perfilNorm,
    farmacos,
    ventilacao: {
      peso_predito_kg: pesoPreditoFinal,
      volume_corrente_ml: volumeCorrente,
      peep_sugerida_cmh2o: 5,
      fr_sugerida_irpm: 16,
      fio2_inicial_percentual: 100,
    },
    checklist_7ps: [
      '1. Preparação: Testar fontes de oxigênio, aspirador a vácuo, tubo com cuff testado, guia/bougie, laringoscópio testado e kit de via aérea difícil (máscara laríngea).',
      '2. Pré-oxigenação: Oxigênio a 100% por 3 a 5 minutos sob máscara com reservatório não reinalante (15 L/min) ou VNI se hipoxemia refratária.',
      '3. Pré-otimização hemodinâmica: Ressuscitação volêmica guiada ou iniciar Noradrenalina precoce para manter PAS > 100 mmHg / PAM > 65 mmHg antes da sedação.',
      '4. Posicionamento: Manobra de olfação (sniffing position) e elevação do conduto auditivo externo ao nível do esterno com coxim occipital.',
      '5. Paralisia com Indução: Injeção rápida do hipnótico imediatamente seguida da injeção do bloqueador neuromuscular sem ventilar com máscara.',
      '6. Passagem do tubo e confirmação: Visualização direta das cordas vocais, confirmação por capnografia em onda e ausculta em 5 pontos (epigástrio e 4 campos pulmonares).',
      '7. Pós-intubação: Fixar rima labial, solicitar radiografia de tórax de controle, iniciar sedoanalgesia em BIC e conectar à ventilação protetora ARDSNet.',
    ],
  };
}

export function calcularEmergenciaPediatrica(pesoKg: number, idadeAnos: number): ResultadoEmergenciaPediatrica {
  if (pesoKg < 1 || pesoKg > 80) {
    throw parametroInvalido('peso_kg', pesoKg, 'Peso pediátrico deve estar entre 1.0 e 80.0 kg.');
  }
  if (idadeAnos < 0 || idadeAnos > 16) {
    throw parametroInvalido('idade_anos', idadeAnos, 'Idade pediátrica deve estar entre 0.0 e 16.0 anos.');
  }

  const cuffedRaw = idadeAnos / 4.0 + 3.5;
  const cuffedRounded = Math.max(3.0, Math.round(cuffedRaw * 2.0) / 2.0);

  const uncuffedRaw = idadeAnos / 4.0 + 4.0;
  const uncuffedRounded = Math.max(3.5, Math.round(uncuffedRaw * 2.0) / 2.0);

  const fixacaoRima = Math.round(cuffedRounded * 3.0 * 10) / 10;

  let lamina = '';
  if (idadeAnos < 1) lamina = 'Reta nº 0 ou 1 (Miller)';
  else if (idadeAnos < 5) lamina = 'Reta ou Curva nº 1 ou 2';
  else if (idadeAnos < 10) lamina = 'Curva nº 2 (Macintosh)';
  else lamina = 'Curva nº 3 (Macintosh)';

  const carga1 = Math.min(200, 2.0 * pesoKg);
  const carga2 = Math.min(200, 4.0 * pesoKg);

  const adrenalinaMg = Math.min(1.0, Math.round(0.01 * pesoKg * 1000) / 1000);
  const adrenalinaMl = Math.min(10.0, Math.round(0.1 * pesoKg * 10) / 10);
  const expansao = Math.round(20.0 * pesoKg);

  return {
    peso_kg: pesoKg,
    idade_anos: idadeAnos,
    tubo_com_cuff_mm: cuffedRounded,
    tubo_sem_cuff_mm: uncuffedRounded,
    fixacao_rima_labial_cm: fixacaoRima,
    lamina_laringoscopio: lamina,
    carga_desfibrilacao_1_j: carga1,
    carga_desfibrilacao_2_j: carga2,
    adrenalina_pcr_mg: adrenalinaMg,
    adrenalina_diluida_1_10000_ml: adrenalinaMl,
    expansao_cristaloide_20ml_kg: expansao,
  };
}

export function interpretarGasometria(
  ph: number,
  paco2: number,
  hco3: number,
  sodio: number,
  cloro: number,
  albumina: number,
  pao2: number,
  fio2Fracao: number
): ResultadoGasometria {
  if (ph < 6.5 || ph > 7.9) throw parametroInvalido('ph', ph, 'pH arterial deve estar no intervalo biológico de 6.5 a 7.9.');
  if (paco2 < 10 || paco2 > 150) throw parametroInvalido('paco2', paco2, 'PaCO2 deve estar entre 10.0 e 150.0 mmHg.');
  if (hco3 < 2 || hco3 > 65) throw parametroInvalido('hco3', hco3, 'Bicarbonato (HCO3) deve estar entre 2.0 e 65.0 mEq/L.');
  if (sodio < 100 || sodio > 190) throw parametroInvalido('sodio', sodio, 'Sódio sérico deve estar entre 100.0 e 190.0 mEq/L.');
  if (cloro < 60 || cloro > 150) throw parametroInvalido('cloro', cloro, 'Cloro sérico deve estar entre 60.0 e 150.0 mEq/L.');
  if (albumina < 0.5 || albumina > 6.5) throw parametroInvalido('albumina', albumina, 'Albumina sérica deve estar entre 0.5 e 6.5 g/dL.');
  if (fio2Fracao < 0.21 || fio2Fracao > 1.0) throw parametroInvalido('fio2_fracao', fio2Fracao, 'FiO2 fracionada deve estar entre 0.21 e 1.0 (21% a 100%).');

  const agBruto = sodio - (cloro + hco3);
  const agCorrigido = agBruto + 2.5 * (4.0 - albumina);
  const agBrutoRound = Math.round(agBruto * 10) / 10;
  const agCorrigidoRound = Math.round(agCorrigido * 10) / 10;

  let disturbioPrimario = '';
  let isAcidoseMetab = false;
  let isAlcaloseMetab = false;

  if (ph < 7.35) {
    if (hco3 < 22 && paco2 > 45) {
      disturbioPrimario = 'Acidose Mista (Metabólica e Respiratória)';
      isAcidoseMetab = true;
    } else if (hco3 < 22) {
      disturbioPrimario = 'Acidose Metabólica';
      isAcidoseMetab = true;
    } else if (paco2 > 45) {
      disturbioPrimario = 'Acidose Respiratória';
    } else {
      disturbioPrimario = 'Acidose não compensada';
    }
  } else if (ph > 7.45) {
    if (hco3 > 26 && paco2 < 35) {
      disturbioPrimario = 'Alcalose Mista (Metabólica e Respiratória)';
      isAlcaloseMetab = true;
    } else if (hco3 > 26) {
      disturbioPrimario = 'Alcalose Metabólica';
      isAlcaloseMetab = true;
    } else if (paco2 < 35) {
      disturbioPrimario = 'Alcalose Respiratória';
    } else {
      disturbioPrimario = 'Alcalose não compensada';
    }
  } else {
    if (hco3 < 22 && paco2 < 35) {
      disturbioPrimario = ph < 7.4 ? 'Acidose Metabólica Compensada' : 'Alcalose Respiratória Compensada';
      isAcidoseMetab = ph < 7.4;
    } else if (hco3 > 26 && paco2 > 45) {
      disturbioPrimario = ph > 7.4 ? 'Alcalose Metabólica Compensada' : 'Acidose Respiratória Compensada';
      isAlcaloseMetab = ph > 7.4;
    } else {
      disturbioPrimario = 'Equilíbrio Ácido-Básico Preservado (Normal)';
    }
  }

  let paco2Min: number | null = null;
  let paco2Max: number | null = null;
  let compensacao = 'Sem indicação de cálculo de resposta compensatória ventilatória.';

  if (isAcidoseMetab) {
    const paco2Esp = 1.5 * hco3 + 8.0;
    const minVal = Math.max(10.0, paco2Esp - 2.0);
    const maxVal = paco2Esp + 2.0;
    paco2Min = Math.round(minVal * 10) / 10;
    paco2Max = Math.round(maxVal * 10) / 10;

    if (paco2 < minVal) {
      compensacao = `Alcalose respiratória concomitante (PaCO2 real ${paco2.toFixed(1)} < esperado ${minVal.toFixed(1)}-${maxVal.toFixed(1)} pela Fórmula de Winters).`;
    } else if (paco2 > maxVal) {
      compensacao = `Acidose respiratória associada / Fadiga ventilatória (PaCO2 real ${paco2.toFixed(1)} > esperado ${minVal.toFixed(1)}-${maxVal.toFixed(1)} pela Fórmula de Winters).`;
    } else {
      compensacao = `Compensação respiratória adequada pela Fórmula de Winters (PaCO2 esperada: ${minVal.toFixed(1)} a ${maxVal.toFixed(1)} mmHg).`;
    }
  } else if (isAlcaloseMetab) {
    const paco2Esp = 0.7 * (hco3 - 24.0) + 40.0;
    const minVal = Math.max(10.0, paco2Esp - 2.0);
    const maxVal = paco2Esp + 2.0;
    paco2Min = Math.round(minVal * 10) / 10;
    paco2Max = Math.round(maxVal * 10) / 10;

    if (paco2 < minVal) {
      compensacao = `Alcalose respiratória associada (PaCO2 ${paco2.toFixed(1)} < ${minVal.toFixed(1)}).`;
    } else if (paco2 > maxVal) {
      compensacao = `Acidose respiratória associada (PaCO2 ${paco2.toFixed(1)} > ${maxVal.toFixed(1)}).`;
    } else {
      compensacao = `Compensação respiratória adequada (PaCO2 esperada: ${minVal.toFixed(1)} a ${maxVal.toFixed(1)} mmHg).`;
    }
  }

  let deltaDelta: number | null = null;
  let interpretacaoDeltaDelta: string | null = null;
  if (agCorrigido > 12.0 && hco3 < 24.0) {
    const deltaAg = agCorrigido - 12.0;
    const deltaHco3 = 24.0 - hco3;
    if (deltaHco3 > 0.001) {
      const ratio = deltaAg / deltaHco3;
      deltaDelta = Math.round(ratio * 100) / 100;
      if (ratio < 1.0) {
        interpretacaoDeltaDelta =
          'Delta-Delta < 1.0: Acidose metabólica mista (Ânion Gap Elevado + Hiperclorêmica / Ânion Gap Normal).';
      } else if (ratio <= 2.0) {
        interpretacaoDeltaDelta =
          'Delta-Delta entre 1.0 e 2.0: Acidose metabólica com Ânion Gap elevado pura (ex: Cetoacidose, Uremia, Láctico, Tóxicos).';
      } else {
        interpretacaoDeltaDelta =
          'Delta-Delta > 2.0: Acidose de Ânion Gap elevado associada a Alcalose Metabólica preexistente ou retenção crônica prévia de bicarbonato.';
      }
    }
  }

  const pafo2 = Math.round((pao2 / fio2Fracao) * 10) / 10;
  let sdraClass = '';
  if (pafo2 >= 300) sdraClass = 'Troca gasosa preservada (P/F >= 300 - Sem critérios para SDRA)';
  else if (pafo2 >= 200) sdraClass = 'SDRA Leve (Berlim: P/F entre 200 e 300 com PEEP >= 5 cmH2O)';
  else if (pafo2 >= 100) sdraClass = 'SDRA Moderada (Berlim: P/F entre 100 e 200 - otimizar PEEP e ventilação protetora 6 mL/kg)';
  else sdraClass = 'SDRA Grave (Berlim: P/F < 100 - Alto risco de mortalidade; considerar posição prona por 16h e bloqueio neuromuscular)';

  const condutas: string[] = [];
  if (isAcidoseMetab) {
    if (agCorrigido > 12.0) {
      condutas.push('Investigar mnemônico GOLDMARK (Glicóis, Oxoprolina, L-Lactato, D-Lactato, Metanol, Aspirina, Renal/Uremia, Cetoacidose).');
    } else {
      condutas.push('Investigar causas de Ânion Gap normal/hiperclorêmicas: perdas digestivas baixas (diarreia), fístulas, acidose tubular renal ou infusão excessiva de SF 0,9%.');
    }
  }
  if (pafo2 < 200.0) {
    condutas.push('Adotar rigorosamente protocolo ARDSNet de ventilação mecânica protetora: volume corrente de 4 a 6 mL/kg de peso predito e pressão de platô <= 30 cmH2O / driving pressure <= 15 cmH2O.');
  }

  return {
    ph,
    paco2,
    hco3,
    sodio,
    cloro,
    albumina,
    pao2,
    fio2_fracao: fio2Fracao,
    disturbio_primario: disturbioPrimario,
    anion_gap_bruto: agBrutoRound,
    anion_gap_corrigido: agCorrigidoRound,
    delta_delta: deltaDelta,
    interpretacao_delta_delta: interpretacaoDeltaDelta,
    paco2_esperada_min: paco2Min,
    paco2_esperada_max: paco2Max,
    compensacao_respiratoria: compensacao,
    relacao_pafo2: pafo2,
    classificacao_oxigenacao_sdra: sdraClass,
    condutas_sugeridas: condutas,
  };
}

export function calcularCorrecaoSodio(
  sodioAtual: number,
  pesoKg: number,
  sexoFeminino: boolean,
  idoso: boolean,
  solucaoMeqL: number
): ResultadoCorrecaoSodio {
  if (sodioAtual < 100 || sodioAtual > 190) {
    throw parametroInvalido('sodio_atual', sodioAtual, 'Sódio sérico atual deve estar entre 100.0 e 190.0 mEq/L.');
  }
  if (pesoKg < 20 || pesoKg > 250) {
    throw parametroInvalido('peso_kg', pesoKg, 'Peso do paciente deve estar entre 20.0 e 250.0 kg.');
  }

  let fracaoAct = 0.6;
  if (sexoFeminino && idoso) fracaoAct = 0.45;
  else if (sexoFeminino || idoso) fracaoAct = 0.5;

  const act = pesoKg * fracaoAct;
  const deltaNa1L = (solucaoMeqL - sodioAtual) / (act + 1.0);
  const deltaNa1LRound = Math.round(deltaNa1L * 100) / 100;

  const deltaAlvo = 8.0;
  const vol24h = Math.abs(deltaNa1L) > 0.0001 ? Math.round((deltaAlvo / Math.abs(deltaNa1L)) * 1000 * 10) / 10 : 0;
  const vazaoBic = Math.round((vol24h / 24.0) * 10) / 10;

  const alerta =
    deltaNa1L > 0
      ? 'Atenção na Hiponatremia: Taxa máxima recomendada de elevação do sódio é de 8 mEq/L nas primeiras 24 horas para prevenção rigorosa da Síndrome de Desmielinização Osmótica (Mielinólise Pontina). Dosar sódio a cada 2 a 4 horas.'
      : 'Atenção na Hipernatremia: Redução máxima de sódio sérico de 8 a 10 mEq/L em 24h para prevenir edema cerebral e convulsões agudas. Dosar eletrólitos a cada 4 a 6 horas.';

  return {
    sodio_atual: sodioAtual,
    solucao_meq_l: solucaoMeqL,
    agua_corporal_total_litros: Math.round(act * 10) / 10,
    variacao_sodio_1l: deltaNa1LRound,
    volume_recomendado_24h_ml: Math.round(vol24h * 10) / 10,
    vazao_bic_ml_h: vazaoBic,
    alerta_seguranca: alerta,
  };
}


// ============================================================================
// NOVAS CALCULADORAS CLÍNICAS (FASES 1 A 4 - PARIDADE 100% COM CORE RUST)
// ============================================================================

export function calcularManejoDengueMs(
  pesoKg: number,
  sinaisAlarme: boolean,
  sinaisChoque: boolean,
  condicaoEspecial: boolean,
  idadeAnos?: number | null
): ResultadoDengueMs {
  if (pesoKg < 2.0 || pesoKg > 300.0) {
    throw parametroInvalido('peso_kg', pesoKg, 'Peso deve estar entre 2.0 e 300.0 kg.');
  }

  const ehPediatrico = idadeAnos !== undefined && idadeAnos !== null && idadeAnos < 13.0;

  if (sinaisChoque) {
    const expansao = 20.0 * pesoKg;
    const vazaoExp = Math.round((expansao / (20.0 / 60.0)) * 10) / 10;
    const manutencao = ehPediatrico ? Math.round((4.0 * pesoKg) * 10) / 10 : Math.round(((pesoKg * 25.0) / 24.0) * 10) / 10;
    return {
      grupo: 'D',
      classificacao_risco: 'Dengue Grave (Choque / Sangramento Vultoso / Disfunção Orgânica)',
      volume_total_dia_ml: Math.round(pesoKg * 100.0),
      volume_sro_ml: 0.0,
      volume_outros_liquidos_ml: 0.0,
      fase_expansao_imediata_ml: expansao,
      tempo_infusao_expansao_horas: 0.33,
      vazao_expansao_ml_h: vazaoExp,
      vazao_manutencao_ml_h: manutencao,
      orientacao_clinica: 'SALA VERMELHA / UTI IMEDIATA: Infundir 20 mL/kg de Ringer Lactato ou SF 0.9% em 20 minutos. Reavaliar a cada 15 a 30 minutos. Se ausência de resposta após 3 etapas de expansão, indicar drogas vasoativas (Noradrenalina). Coletar Ht, Plaquetas, Gasometria e Transaminases imediatamente.',
      criterios_alarme_presentes: [
        'Hipotensão / Pressão arterial convergente (PAM < 20 mmHg de diferencial)',
        'Enchimento capilar lentificado (> 2 segundos) e extremidades frias',
        'Taquicardia desproporcional e pulsos finos ou impalpáveis',
        'Sangramento grave clínico ou disfunção orgânica (miocardite, encefalopatia, hepatite grave)',
      ],
    };
  }

  if (sinaisAlarme) {
    const expansao = 10.0 * pesoKg;
    const vazaoExp = Math.round((expansao / 2.0) * 10) / 10;
    const manutencao = ehPediatrico ? Math.round((3.0 * pesoKg) * 10) / 10 : Math.round(((pesoKg * 25.0) / 24.0) * 10) / 10;
    return {
      grupo: 'C',
      classificacao_risco: 'Dengue com Sinais de Alarme (Leito de Internação / Observação Mínima de 48h)',
      volume_total_dia_ml: Math.round(pesoKg * 60.0),
      volume_sro_ml: 0.0,
      volume_outros_liquidos_ml: 0.0,
      fase_expansao_imediata_ml: expansao,
      tempo_infusao_expansao_horas: 2.0,
      vazao_expansao_ml_h: vazaoExp,
      vazao_manutencao_ml_h: manutencao,
      orientacao_clinica: 'INTERNAÇÃO EM LEITO DE OBSERVAÇÃO (Mínimo 48h): Fase de hidratação venosa imediata: 10 mL/kg de solução cristaloide (SF 0.9% ou Ringer) em 2 horas. Reavaliar clinicamente e hematócrito seriado a cada 2h. Se melhora clínica e queda do Ht, iniciar fase de manutenção.',
      criterios_alarme_presentes: [
        'Dor abdominal intensa (referida ou à palpação) e contínua',
        'Vômitos persistentes',
        'Acúmulo de líquidos (ascite, derrame pleural, derrame pericárdico)',
        'Hipotensão postural ou lipotímia',
        'Hepatomegalia dolorosa > 2 cm abaixo do rebordo costal',
        'Sangramento de mucosa',
        'Letargia ou irritabilidade',
        'Aumento progressivo do hematócrito',
      ],
    };
  }

  if (condicaoEspecial) {
    const volDia = pesoKg * 60.0;
    const sro = Math.round((volDia / 3.0) * 10) / 10;
    const outros = Math.round((volDia - sro) * 10) / 10;
    return {
      grupo: 'B',
      classificacao_risco: 'Dengue sem Alarme com Condição Especial / Risco Social',
      volume_total_dia_ml: volDia,
      volume_sro_ml: sro,
      volume_outros_liquidos_ml: outros,
      fase_expansao_imediata_ml: 0.0,
      tempo_infusao_expansao_horas: 0.0,
      vazao_expansao_ml_h: 0.0,
      vazao_manutencao_ml_h: 0.0,
      orientacao_clinica: 'LEITO DE OBSERVAÇÃO / HIDRATAÇÃO SUPERVISIONADA: Paciente em grupo de risco clínico ou social. Solicitar Hemograma completo obrigatório. Iniciar hidratação oral supervisionada na unidade até o resultado do hemograma. Se Ht normal, alta com retorno diário. Se Ht elevado, conduzir conforme Grupo C.',
      criterios_alarme_presentes: [],
    };
  }

  const volDia = pesoKg * 60.0;
  const sro = Math.round((volDia / 3.0) * 10) / 10;
  const outros = Math.round((volDia - sro) * 10) / 10;
  return {
    grupo: 'A',
    classificacao_risco: 'Dengue Clássica / Manejo Ambulatorial Domiciliar',
    volume_total_dia_ml: volDia,
    volume_sro_ml: sro,
    volume_outros_liquidos_ml: outros,
    fase_expansao_imediata_ml: 0.0,
    tempo_infusao_expansao_horas: 0.0,
    vazao_expansao_ml_h: 0.0,
    vazao_manutencao_ml_h: 0.0,
    orientacao_clinica: 'MANEJO DOMICILIAR AMBULATORIAL: Hidratação oral precoce e abundante (60 mL/kg/dia), sendo 1/3 com Soro de Reidratação Oral (SRO) e 2/3 com líquidos caseiros (água, sucos, água de coco). Paracetamol ou Dipirona para dor/febre. CONTRAINDICADOS estritamente: Ácido Acetilsalicílico (AAS), AINEs e Corticoides pelo risco hemorrágico e de choque. Orientar retorno IMEDIATO se sinais de alarme.',
    criterios_alarme_presentes: [],
  };
}

export function calcularParklandQueimado(
  pesoKg: number,
  percentualScq: number,
  horasDesdeQueimadura: number = 0
): ResultadoParkland {
  if (pesoKg < 2.0 || pesoKg > 300.0) {
    throw parametroInvalido('peso_kg', pesoKg, 'Peso deve estar entre 2.0 e 300.0 kg.');
  }
  if (percentualScq < 0.1 || percentualScq > 100.0) {
    throw parametroInvalido('percentual_scq', percentualScq, 'SCQ deve estar entre 0.1% e 100%.');
  }

  const volParkland = 4.0 * pesoKg * percentualScq;
  const volAtls10 = 2.0 * pesoKg * percentualScq;
  const vol1 = volParkland / 2.0;
  const horas1 = Math.max(1.0, 8.0 - horasDesdeQueimadura);
  const vazao1 = Math.round((vol1 / horas1) * 10) / 10;
  const vol2 = volParkland / 2.0;
  const vazao2 = Math.round((vol2 / 16.0) * 10) / 10;

  return {
    peso_kg: pesoKg,
    percentual_scq: percentualScq,
    volume_total_24h_parkland_ml: Math.round(volParkland * 10) / 10,
    volume_total_24h_atls10_ml: Math.round(volAtls10 * 10) / 10,
    volume_primeira_fase_ml: Math.round(vol1 * 10) / 10,
    horas_primeira_fase: horas1,
    vazao_primeira_fase_ml_h: vazao1,
    volume_segunda_fase_ml: Math.round(vol2 * 10) / 10,
    vazao_segunda_fase_ml_h: vazao2,
    meta_diurese_ml_h: 'Adultos: 0.5 a 1.0 mL/kg/h (30 a 50 mL/h). Queimadura elétrica: 1.0 a 1.5 mL/kg/h (alvo 75 a 100 mL/h até urina clara). Crianças < 30 kg: 1.0 a 1.5 mL/kg/h.',
    conduta_resfriamento_e_acesso: 'Ressuscitação preferencialmente com Ringer Lactato aquecido. Resfriamento imediato com água corrente limpa (15-20°C) por no máximo 10 a 20 minutos (NUNCA usar gelo pelo risco de hipotermia e aprofundamento da lesão). Garantir 2 acessos venosos periféricos calibrosos (14G ou 16G) preferencialmente em área não queimada.',
  };
}

export function calcularMetabolicoCadCalemia(
  sodio: number,
  glicemia: number,
  potassio: number,
  calcioTotal: number = 9.0,
  albumina: number = 4.0
): ResultadoMetabolicoCad {
  if (sodio < 80.0 || sodio > 200.0) {
    throw parametroInvalido('sodio', sodio, 'Sódio sérico deve estar entre 80 e 200 mEq/L.');
  }
  if (glicemia < 20.0 || glicemia > 2500.0) {
    throw parametroInvalido('glicemia_mg_dl', glicemia, 'Glicemia deve estar entre 20 e 2500 mg/dL.');
  }

  const excessoGlicose = Math.max(0.0, (glicemia - 100.0) / 100.0);
  const naKatz = sodio + 1.6 * excessoGlicose;
  const naHillier = sodio + 2.4 * excessoGlicose;
  const osmEfetiva = 2.0 * sodio + glicemia / 18.0;

  let classifOsm = 'Osmolaridade Plasmática Normal (275 a 295 mOsm/kg)';
  if (osmEfetiva >= 320.0) {
    classifOsm = 'Hiperosmolaridade Grave (Osmolaridade Efetiva >= 320 mOsm/kg - Típico de EHH / Estado Hiperosmolar Hiperglicêmico)';
  } else if (osmEfetiva >= 295.0) {
    classifOsm = 'Osmolaridade Plasmática Elevada';
  } else if (osmEfetiva < 275.0) {
    classifOsm = 'Hipo-osmolaridade Plasmática (< 275 mOsm/kg)';
  }

  const caCorr = calcioTotal + 0.8 * (4.0 - albumina);

  let condutaK = '';
  let bloqueioInsulina = false;

  if (potassio < 3.3) {
    condutaK = 'ALERTA CRÍTICO: NÃO INICIAR INSULINA! O potássio está < 3.3 mEq/L. A infusão de insulina causará influxo maciço de K+ para o meio intracelular, provocando arritmias letais ou PCR. Conduta: Repor 20 a 40 mEq/h de KCl IV até K+ >= 3.3 mEq/L antes de liberar insulina.';
    bloqueioInsulina = true;
  } else if (potassio <= 5.2) {
    condutaK = 'POTÁSSIO EM FAIXA DE REPOSIÇÃO (3.3 a 5.2 mEq/L): Iniciar infusão contínua de Insulina Regular (0.1 U/kg/h) E adicionar 20 a 30 mEq de KCl por litro de soro de hidratação (1 ampola de 10 mL de KCl 19.1% contém 25.6 mEq) para manter calemia entre 4.0 e 5.0 mEq/L.';
    bloqueioInsulina = false;
  } else {
    condutaK = 'HIPERCALEMIA (K+ > 5.2 mEq/L): Iniciar infusão de Insulina Regular sem reposição inicial de KCl. Monitorar K+ sérico de 2 em 2 horas. Quando K+ cair abaixo de 5.2 mEq/L, associar reposição de KCl.';
    bloqueioInsulina = false;
  }

  return {
    sodio_medido: sodio,
    glicemia_mg_dl: glicemia,
    sodio_corrigido_katz: Math.round(naKatz * 10) / 10,
    sodio_corrigido_hillier: Math.round(naHillier * 10) / 10,
    osmolaridade_efetiva_m_osm_kg: Math.round(osmEfetiva * 10) / 10,
    classificacao_osmolaridade: classifOsm,
    calcio_total_medido: calcioTotal,
    albumina_medida: albumina,
    calcio_corrigido_payne: Math.round(caCorr * 10) / 10,
    potassio_medido: potassio,
    conduta_insulina_e_potassio: condutaK,
    alerta_critico_bloqueio_insulina: bloqueioInsulina,
  };
}

export function calcularFenaFeureia(
  naPlasmatico: number,
  crPlasmatica: number,
  ureiaPlasmatica: number,
  naUrinario: number,
  crUrinaria: number,
  ureiaUrinaria?: number | null,
  usaDiuretico: boolean = false
): ResultadoFenaFeureia {
  if (naPlasmatico <= 0.0 || crPlasmatica <= 0.0 || crUrinaria <= 0.0) {
    throw parametroInvalido('cr_plasmatica / cr_urinaria', crPlasmatica, 'Concentrações plasmáticas e urinárias de creatinina e sódio devem ser maiores que zero.');
  }

  const fena = ((naUrinario * crPlasmatica) / (naPlasmatico * crUrinaria)) * 100.0;
  const feureia = ureiaUrinaria !== null && ureiaUrinaria !== undefined && ureiaPlasmatica > 0.0
    ? ((ureiaUrinaria * crPlasmatica) / (ureiaPlasmatica * crUrinaria)) * 100.0
    : null;

  let diag = '';
  let interp = '';

  if (usaDiuretico && feureia !== null) {
    if (feureia < 35.0) {
      diag = 'Etiologia Pré-Renal provável (FEUreia < 35% sob efeito de diuréticos)';
      interp = 'A FEUreia confirma avidez tubular por ureia com conservação da função tubular, indicando hipoperfusão / pré-renal a despeito do diurético aumentar a natriurese.';
    } else {
      diag = 'Etiologia Renal Intrínseca / NTA provável (FEUreia >= 35%)';
      interp = 'Perda da capacidade de reabsorção tubular proximal de ureia, compatível com necrose tubular aguda ou dano estrutural.';
    }
  } else if (fena < 1.0) {
    diag = 'Etiologia Pré-Renal (FENa < 1%)';
    interp = 'Fração de Excreção de Sódio < 1% demonstra retenção tubular de sódio preservada em resposta à hipovolemia ou hipofluxo renal. Responde favoravelmente à reposição volêmica cautelosa.';
  } else if (fena > 2.0) {
    diag = 'Etiologia Renal Intrínseca / Necrose Tubular Aguda - NTA (FENa > 2%)';
    interp = 'Incapacidade das células tubulares isquêmicas ou lesadas de reabsorver sódio urinário. Investigar nefrotóxicos, isquemia prolongada ou rabdomiólise.';
  } else {
    diag = 'Zona Indeterminada / Zona Cinzenta (FENa entre 1% e 2%)';
    interp = 'Valores intermediários. Interpretar com contexto clínico, sedimento urinário, FEUreia e ultrassonografia de vias urinárias.';
  }

  const ressalva = usaDiuretico
    ? 'ATENÇÃO AO USO DE DIURÉTICOS: O uso de furosemida/tiazídicos invalida a interpretação do FENa (falso elevado por natriurese forçada). A FEUreia (Fração de Excreção de Ureia) é o padrão-ouro nesta situação pois a reabsorção de ureia no túbulo proximal é independente da inibição do carreador Na-K-2Cl.'
    : null;

  return {
    fena_percentual: Math.round(fena * 100) / 100,
    feureia_percentual: feureia !== null ? Math.round(feureia * 100) / 100 : null,
    diagnostico_provavel: diag,
    interpretacao_clinica: interp,
    ressalva_diuretico: ressalva,
  };
}

export function calcularPamPpc(
  pas: number,
  pad: number,
  pic?: number | null
): ResultadoPamPpc {
  if (pas <= 0.0 || pad <= 0.0 || pas < pad) {
    throw parametroInvalido('pas / pad', pas, 'Pressão arterial sistólica e diastólica incompatíveis.');
  }

  const pam = (pas + 2.0 * pad) / 3.0;
  const ppc = pic !== null && pic !== undefined ? pam - pic : null;

  let classif = '';
  if (pam < 65.0) {
    classif = 'Hipotensão Arterial / Risco de Hipoperfusão Tecidual Sistêmica (PAM < 65 mmHg)';
  } else if (pam <= 100.0) {
    classif = 'Pressão Arterial Média Normal / Alvo Hemodinâmico Padrão (65 a 100 mmHg)';
  } else {
    classif = 'Pressão Arterial Média Elevada (> 100 mmHg)';
  }

  let alvo = 'Meta geral de ressuscitação no choque (Surviving Sepsis): PAM >= 65 mmHg.';
  if (ppc !== null) {
    alvo = 'Meta em Neurointensivismo / TCE Grave: manter PPC entre 60 e 70 mmHg e PIC < 22 mmHg (Brain Trauma Foundation).';
  }

  return {
    pas_mmhg: pas,
    pad_mmhg: pad,
    pam_mmhg: Math.round(pam * 10) / 10,
    pic_mmhg: pic,
    ppc_mmhg: ppc !== null ? Math.round(ppc * 10) / 10 : null,
    classificacao_hemodinamica: classif,
    alvo_terapeutico: alvo,
  };
}

export function calcularHeartScore(
  historia: number,
  ecg: number,
  idade: number,
  fatoresRisco: number,
  troponina: number
): ResultadoHeartScore {
  const total = historia + ecg + idade + fatoresRisco + troponina;
  const detalhe = [
    `História Clínica: ${historia} pt(s)`,
    `Eletrocardiograma (ECG): ${ecg} pt(s)`,
    `Idade do Paciente: ${idade} pt(s)`,
    `Fatores de Risco / DAC prévia: ${fatoresRisco} pt(s)`,
    `Troponina Inicial: ${troponina} pt(s)`,
  ];

  let cat = 'Baixo Risco';
  let mace = '0.9% a 1.7% de MACE em 6 semanas';
  let cond = 'Candidato a alta precoce com segurança após protocolo de troponina seriada ultrassensível negativa (0h/1h ou 0h/2h). Investigação ambulatorial eletiva.';

  if (total >= 7) {
    cat = 'Alto Risco';
    mace = '50% a 65% de MACE em 6 semanas';
    cond = 'Admissão imediata em Unidade Coronariana (UCO/UTI). Estratégia invasiva precoce indicada (CATE / Cineangiocoronariografia de urgência). Dupla antiagregação e anticoagulação plena conforme diretriz de SCA.';
  } else if (total >= 4) {
    cat = 'Risco Moderado';
    mace = '12.0% a 16.6% de MACE em 6 semanas';
    cond = 'Admissão em Unidade de Dor Torácica / Leito de Observação. Troponina seriada, monitorização eletrocardiográfica contínua e prova funcional não invasiva (ex: Angio-TC, Eco-stress ou Teste Ergométrico) antes da alta.';
  }

  return {
    pontuacao_total: total,
    categoria_risco: cat,
    mace_percentual: mace,
    conduta_sugerida: cond,
    detalhamento_pontos: detalhe,
  };
}

export function calcularHasBled(
  has: boolean,
  renal: boolean,
  hep: boolean,
  avc: boolean,
  sangr: boolean,
  inr: boolean,
  idoso: boolean,
  drogasAine: boolean,
  alcool: boolean
): ResultadoHasBled {
  let pontos = 0;
  const modif: string[] = [];

  if (has) { pontos += 1; modif.push('Hipertensão não controlada (PAS > 160 mmHg): otimizar anti-hipertensivo'); }
  if (renal) { pontos += 1; }
  if (hep) { pontos += 1; }
  if (avc) { pontos += 1; }
  if (sangr) { pontos += 1; }
  if (inr) { pontos += 1; modif.push('Labilidade do INR: manter TTR > 70% ou considerar migração para DOAC'); }
  if (idoso) { pontos += 1; }
  if (drogasAine) { pontos += 1; modif.push('Uso concomitante de antiplaquetário ou AINE: desprescrever AINE / suspender AAS se sem indicação recente'); }
  if (alcool) { pontos += 1; modif.push('Consumo excessivo de álcool (>= 8 doses/sem): orientar cessação ou redução'); }

  let cat = 'Baixo Risco de Sangramento (HAS-BLED 0-2)';
  let taxa = '1.0% a 1.9% ao ano';
  let rec = 'Benefício líquido da anticoagulação plena amplamente favorável. Manter seguimento regular.';

  if (pontos >= 3) {
    cat = 'Alto Risco de Sangramento Maior (HAS-BLED >= 3)';
    taxa = pontos >= 5 ? '9.0% a 12.5% ao ano' : '3.7% a 8.7% ao ano';
    rec = 'ATENÇÃO: O escore HAS-BLED alto NÃO contraindica a anticoagulação, mas alerta para necessidade de monitoramento clínico rigoroso e correção imediata de todos os fatores de risco modificáveis identificados.';
  }

  return {
    pontuacao_total: pontos,
    categoria_risco: cat,
    taxa_sangramento_anual: taxa,
    fatores_modificaveis: modif,
    recomendacao_anticoagulacao: rec,
  };
}

export function calcularQtcCorrigido(
  qtMs: number,
  fcBpm: number,
  sexoFeminino: boolean
): ResultadoQtcCorrigido {
  if (qtMs < 200.0 || qtMs > 900.0) {
    throw parametroInvalido('qt_ms', qtMs, 'Intervalo QT deve estar entre 200 e 900 ms.');
  }
  if (fcBpm < 30.0 || fcBpm > 260.0) {
    throw parametroInvalido('fc_bpm', fcBpm, 'FC deve estar entre 30 e 260 bpm.');
  }

  const rrSegundos = 60.0 / fcBpm;
  const qtcBazett = qtMs / Math.sqrt(rrSegundos);
  const qtcFridericia = qtMs / Math.cbrt(rrSegundos);
  const qtcFramingham = qtMs + 154.0 * (1.0 - rrSegundos);

  const limiteProlongado = sexoFeminino ? 460.0 : 450.0;
  const alerta = qtcBazett > 500.0 || qtcFridericia > 500.0;

  let status = 'Intervalo QTc Normal';
  let rec = 'Intervalo de repolarização ventricular fisiológico. Baixo risco de arritmias ventriculares dependentes de pausa.';

  if (alerta) {
    status = 'ALERTA: QTc PROLONGADO CRÍTICO (> 500 ms) - Alto Risco de TdP';
    rec = 'RISCO IMINENTE DE TORSADES DE POINTES / FIBRILAÇÃO VENTRICULAR. Descontinuar imediatamente fármacos que prolongam o QT. Corrigir distúrbios eletrolíticos (manter K+ > 4.5 mEq/L e Mg2+ > 2.0 mg/dL). Monitorização cardíaca contínua. Ter Sulfato de Magnésio IV disponível à beira do leito.';
  } else if (qtcBazett > limiteProlongado || qtcFridericia > limiteProlongado) {
    status = 'QTc Prolongado Limítrofe / Moderado';
    rec = 'Aumento do tempo de repolarização ventricular. Evitar adição de novos fármacos com potencial de prolongamento de QT e solicitar ECG de controle após início de novas medicações.';
  }

  return {
    qt_medido_ms: qtMs,
    fc_bpm: fcBpm,
    qtc_bazett_ms: Math.round(qtcBazett * 10) / 10,
    qtc_fridericia_ms: Math.round(qtcFridericia * 10) / 10,
    qtc_framingham_ms: Math.round(qtcFramingham * 10) / 10,
    status_intervalo: status,
    alerta_torsades: alerta,
    recomendacao: rec,
  };
}

export function calcularCriteriosPerc(
  id50: boolean,
  fc100: boolean,
  sat95: boolean,
  edema: boolean,
  hemo: boolean,
  cirurg: boolean,
  tev: boolean,
  estrog: boolean
): ResultadoPerc {
  let c = 0;
  if (id50) c++;
  if (fc100) c++;
  if (sat95) c++;
  if (edema) c++;
  if (hemo) c++;
  if (cirurg) c++;
  if (tev) c++;
  if (estrog) c++;

  const descartado = c === 0;
  return {
    criterios_positivos: c,
    tep_descartado: descartado,
    probabilidade_residual_percentual: descartado ? '< 1.8% de TEP' : 'Não se aplica (>= 1 critério positivo)',
    conduta: descartado
      ? 'TEP EXCLUÍDO CLINICAMENTE: Se o julgamento clínico pré-teste for de BAIXA probabilidade, o risco de TEP é inferior a 1.8%. NENHUM exame adicional (D-Dímero ou Angio-TC) está indicado. Evita irradiação desnecessária e contraste iodado.'
      : 'PERC POSITIVO: A regra de exclusão não foi atendida. Prosseguir a investigação com dosagem de D-Dímero de alta sensibilidade (se baixa/moderada probabilidade clínica) ou Angio-TC de Tórax.',
  };
}

export function calcularWellsTvp(
  cancer: boolean,
  paralisia: boolean,
  acamado: boolean,
  dor: boolean,
  edemaTotal: boolean,
  edemaPant: boolean,
  cacifo: boolean,
  colaterais: boolean,
  tvpPrevia: boolean,
  altProvavel: boolean
): ResultadoWellsTvp {
  let p = 0;
  if (cancer) p += 1;
  if (paralisia) p += 1;
  if (acamado) p += 1;
  if (dor) p += 1;
  if (edemaTotal) p += 1;
  if (edemaPant) p += 1;
  if (cacifo) p += 1;
  if (colaterais) p += 1;
  if (tvpPrevia) p += 1;
  if (altProvavel) p -= 2;

  let cat = 'Baixa Probabilidade Clínica de TVP (Escore <= 0)';
  let inc = '~3% a 5% de prevalência confirmada';
  let cond = 'Solicitar D-Dímero de alta sensibilidade. Se negativo, TVP excluída com segurança sem necessidade de Doppler venoso. Se positivo, realizar USG Doppler de membros inferiores.';

  if (p >= 3) {
    cat = 'Alta Probabilidade Clínica de TVP (Escore >= 3)';
    inc = '50% a 75% de prevalência confirmada';
    cond = 'Solicitar Ultrassonografia Vascular com Doppler de Membros Inferiores diretamente como primeiro exame. D-Dímero não é necessário para exclusão nesta faixa de alta probabilidade.';
  } else if (p >= 1) {
    cat = 'Probabilidade Moderada de TVP (Escore 1 a 2)';
    inc = '15% a 25% de prevalência confirmada';
    cond = 'Solicitar D-Dímero de alta sensibilidade OU realizar diretamente USG Doppler venoso de membros inferiores conforme disponibilidade local.';
  }

  return {
    pontuacao_total: p,
    categoria_probabilidade: cat,
    incidencia_estimada: inc,
    conduta_indicada: cond,
  };
}

export function calcularEscorePadua(
  cancer: boolean,
  tev: boolean,
  mobilidade: boolean,
  trombo: boolean,
  cirurg: boolean,
  id70: boolean,
  cardresp: boolean,
  iamAvc: boolean,
  infReuma: boolean,
  imc30: boolean,
  hormonal: boolean
): ResultadoPaduaTev {
  let p = 0;
  if (cancer) p += 3;
  if (tev) p += 3;
  if (mobilidade) p += 3;
  if (trombo) p += 3;
  if (cirurg) p += 2;
  if (id70) p += 1;
  if (cardresp) p += 1;
  if (iamAvc) p += 1;
  if (infReuma) p += 1;
  if (imc30) p += 1;
  if (hormonal) p += 1;

  const alto = p >= 4;
  return {
    pontuacao_total: p,
    alto_risco_tev: alto,
    profilaxia_indicada: alto
      ? 'ALTO RISCO DE TEV (Pádua >= 4): Tromboprofilaxia farmacológica fortemente recomendada.'
      : 'BAIXO RISCO DE TEV (Pádua < 4): Profilaxia farmacológica não indicada rotineiramente.',
    esquema_enoxaparina: alto
      ? 'Enoxaparina 40 mg SC 1x/dia (ajustar para 20 mg SC 1x/dia se Clearance < 30 mL/min ou Heparina Não Fracionada 5.000 UI SC 8/8h). Associar medidas mecânicas (meias compressivas/compressão pneumática) se contraindicação hemorrágica.'
      : 'Estimular deambulação precoce no leito/quarto e hidratação adequada. Reavaliar escore a cada 48 horas ou em caso de piora clínica.',
  };
}

export function calcularTromboliseAvc(pesoKg: number): ResultadoTromboliseAvc {
  if (pesoKg < 20.0 || pesoKg > 300.0) {
    throw parametroInvalido('peso_kg', pesoKg, 'Peso deve estar entre 20.0 e 300.0 kg para cálculo de trombólise.');
  }

  const doseAlteplase = Math.min(90.0, 0.9 * pesoKg);
  const bolus10 = doseAlteplase * 0.10;
  const infusao90 = doseAlteplase * 0.90;
  const doseTnk = Math.min(25.0, 0.25 * pesoKg);

  return {
    peso_kg: pesoKg,
    dose_total_alteplase_mg: Math.round(doseAlteplase * 100) / 100,
    bolus_alteplase_10_porcento_mg: Math.round(bolus10 * 100) / 100,
    infusao_alteplase_90_porcento_mg_h: Math.round(infusao90 * 100) / 100,
    dose_tenecteplase_mg: Math.round(doseTnk * 100) / 100,
    metas_pressoricas: 'Antes do bolus: PA < 185/110 mmHg. Durante a infusão e nas primeiras 24 horas: manter PA < 180/105 mmHg com checagem neurológica seriada a cada 15 min nas primeiras 2 horas.',
    contraindicacoes_absolutas: [
      'Hemorragia intracraniana prévia em qualquer época da vida',
      'AVC isquêmico extenso ou TCE grave nos últimos 3 meses',
      'PA mantida >= 185/110 mmHg a despeito de anti-hipertensivo IV (Nitroprussiato / Esmolol)',
      'Plaquetas < 100.000/mm³, INR > 1.7 ou uso de DOAC nas últimas 48 horas',
      'Glicemia capilar < 50 mg/dL (corrigir hipoglicemia antes de trombolisar)',
    ],
  };
}

export function calcularGlasgowP(
  ocular: number,
  verbal: number,
  motora: number,
  reacaoPupilar: number
): ResultadoGlasgowP {
  if (ocular < 1 || ocular > 4 || verbal < 1 || verbal > 5 || motora < 1 || motora > 6) {
    throw parametroInvalido('componentes_gcs', ocular, 'Subcomponentes do Glasgow devem ser válidos.');
  }

  const gcs = ocular + verbal + motora;
  const gcsP = gcs - reacaoPupilar;

  let gravidade = 'TCE Leve (GCS 13 a 15)';
  let cond = 'Observação neurológica e critérios de imagem tomográfica conforme Canadian CT Head Rule.';

  if (gcs <= 8) {
    gravidade = 'TCE Grave (GCS <= 8)';
    cond = 'INDICAÇÃO FORMAL DE VIA AÉREA AVANÇADA (IOT): Proteção de via aérea obrigatória por perda dos reflexos protetores de tosse e deglutição. Proceder com Intubação em Sequência Rápida (SRI) neuroprotetora (evitar hipotensão e hipóxia). TC de crânio urgente e avaliação neurocirúrgica.';
  } else if (gcs <= 12) {
    gravidade = 'TCE Moderado (GCS 9 a 12)';
    cond = 'Internação em leito de monitorização neurológica contínua. TC de crânio obrigatória. Reavaliação seriada do escore a cada 1 hora. Risco de deterioração neurológica rápida.';
  }

  return {
    escore_glasgow: gcs,
    reacao_pupilar_pontos: reacaoPupilar,
    gcs_p_final: gcsP,
    gravidade_tce: gravidade,
    indicacao_intubacao: gcs <= 8,
    conduta: cond,
  };
}

export function calcularCranioCervical(
  gcs15: boolean,
  fratura: boolean,
  vomitos: boolean,
  id65: boolean,
  amnesia: boolean,
  mecanismo: boolean,
  dorCerv: boolean,
  deficit: boolean,
  consciencia: boolean,
  intoxicacao: boolean,
  distrativa: boolean
): ResultadoCranioCervical {
  const tcIndicada = gcs15 || fratura || vomitos || id65 || amnesia || mecanismo;
  const nexusAtendidos = !(dorCerv || deficit || consciencia || intoxicacao || distrativa);

  return {
    indicacao_tc_cranio: tcIndicada,
    justificativa_cranio: tcIndicada
      ? 'TC DE CRÂNIO INDICADA (Canadian CT Head Rule): Presença de critério(s) de alto risco para lesão neurocirúrgica ou risco moderado para lesão encefálica na TC.'
      : 'TC DE CRÂNIO NÃO INDICADA DE ROTINA: Paciente sem critérios de risco da regra canadense.',
    criterios_nexus_atendidos: nexusAtendidos,
    indicacao_imagem_cervical: !nexusAtendidos,
    justificativa_coluna: nexusAtendidos
      ? 'COLUNA CERVICAL LIBERADA CLINICAMENTE (Critérios NEXUS atendidos): Sem dor na linha média, sem déficit neurológico focal, alerta e orientado, sem intoxicação e sem lesão distrativa. Desnecessário Rx ou TC cervical.'
      : 'IMAGEM DE COLUNA CERVICAL INDICADA (Critérios NEXUS violados): Presença de dor palpável em linha média cervical, intoxicação, déficit focal ou lesão distrativa.',
  };
}

export function calcularMeldNa(
  creatinina: number,
  bilirrubina: number,
  inr: number,
  sodio: number,
  dialiseRecente: boolean
): ResultadoMeldNa {
  if (creatinina <= 0.0 || bilirrubina <= 0.0 || inr <= 0.0 || sodio < 100.0 || sodio > 180.0) {
    throw parametroInvalido('creatinina / bilirrubina / inr / sodio', creatinina, 'Parâmetros laboratoriais devem ser maiores que zero e em faixas fisiológicas.');
  }

  const crCalc = dialiseRecente ? 4.0 : Math.min(4.0, Math.max(1.0, creatinina));
  const biliCalc = Math.max(1.0, bilirrubina);
  const inrCalc = Math.max(1.0, inr);
  const naCalc = Math.min(137.0, Math.max(125.0, sodio));

  const meldInicialBruto = 9.57 * Math.log(crCalc) + 3.78 * Math.log(biliCalc) + 11.20 * Math.log(inrCalc) + 6.43;
  const meldInicial = Math.round(meldInicialBruto * 10) / 10;

  let meldNa = meldInicial;
  if (meldInicial > 11.0) {
    const meldNaBruto = meldInicialBruto + 1.32 * (137.0 - naCalc) - (0.033 * meldInicialBruto * (137.0 - naCalc));
    meldNa = Math.round(meldNaBruto * 10) / 10;
  }

  let mort = '< 2% de mortalidade em 90 dias';
  let prio = 'Baixa prioridade em fila de transplante';
  let cond = 'Seguimento ambulatorial hepatológico. Otimizar manejo de ascite e profilaxia de sangramento varicoso.';

  if (meldNa >= 35.0) {
    mort = '> 80% de mortalidade em 90 dias';
    prio = 'Prioridade Máxima (Urgência Imediata de Transplante Hepático)';
    cond = 'Admissão em UTI / Unidade Hepatológica. Manejo agressivo de complicações agudas (Sindrome Hepatorrenal, Encefalopatia grau 3/4, PBE) e comunicação imediata com Central de Transplantes.';
  } else if (meldNa >= 25.0) {
    mort = '~50% a 70% de mortalidade em 90 dias';
    prio = 'Alta Prioridade em fila de transplante';
    cond = 'Considerar internação hospitalar para estabilização clínica, rastreio rigoroso de infecções bacterianas e suporte nutricional/renal.';
  } else if (meldNa >= 15.0) {
    mort = '~6% a 20% de mortalidade em 90 dias';
    prio = 'Prioridade Moderada (Indicação formal de listagem para Transplante)';
    cond = 'Indicação inequívoca de avaliação e inclusão em lista de transplante hepático (MELD >= 15 indica benefício líquido de sobrevida pós-transplante).';
  }

  return {
    score_meld_inicial: meldInicial,
    score_meld_na: meldNa,
    mortalidade_90d_percentual: mort,
    prioridade_transplante: prio,
    conduta_clinica: cond,
  };
}

export function calcularChildPugh(
  bilirrubina: number,
  albumina: number,
  inr: number,
  asciteGrau: number,
  encefalopatiaGrau: number
): ResultadoChildPugh {
  if (bilirrubina <= 0.0 || albumina <= 0.0 || inr <= 0.0) {
    throw parametroInvalido('laboratorio_child', bilirrubina, 'Valores laboratoriais devem ser maiores que zero.');
  }

  let p = 0;
  if (bilirrubina < 2.0) p += 1;
  else if (bilirrubina <= 3.0) p += 2;
  else p += 3;

  if (albumina > 3.5) p += 1;
  else if (albumina >= 2.8) p += 2;
  else p += 3;

  if (inr < 1.7) p += 1;
  else if (inr <= 2.2) p += 2;
  else p += 3;

  p += asciteGrau;
  p += encefalopatiaGrau;

  let classe = 'Classe A (5 a 6 pontos)';
  let s1 = '100%';
  let s2 = '85%';
  let rCirurgico = '~10% de mortalidade perioperatória';
  let cond = 'Cirrose hepática compensada. Bom prognóstico clínico a curto prazo.';

  if (p >= 10) {
    classe = 'Classe C (10 a 15 pontos)';
    s1 = '45%';
    s2 = '35%';
    rCirurgico = '> 70% a 80% de mortalidade cirúrgica (cirurgia eletiva contraindicada)';
    cond = 'Cirrose descompensada terminal. Indicação mandatória de transplante hepático.';
  } else if (p >= 7) {
    classe = 'Classe B (7 a 9 pontos)';
    s1 = '80%';
    s2 = '60%';
    rCirurgico = '~30% de mortalidade perioperatória';
    cond = 'Comprometimento funcional hepático moderado. Cirurgia eletiva deve ser postergada até otimização nutricional.';
  }

  return {
    pontuacao_total: p,
    classe,
    sobrevida_1ano_percentual: s1,
    sobrevida_2anos_percentual: s2,
    risco_cirurgico_mortalidade: rCirurgico,
    conduta_geral: cond,
  };
}

export function calcularFib4(
  idade: number,
  ast: number,
  alt: number,
  plaquetas: number
): ResultadoFib4 {
  if (idade < 18 || ast <= 0.0 || alt <= 0.0 || plaquetas <= 0.0) {
    throw parametroInvalido('parametros_fib4', ast, 'Valores laboratoriais e idade devem ser estritamente positivos.');
  }

  const fib4 = (idade * ast) / (plaquetas * Math.sqrt(alt));
  const fib4Arred = Math.round(fib4 * 100) / 100;

  let estrato = 'Baixa Probabilidade de Fibrose Avançada (FIB-4 < 1.30)';
  let pred = 'Alto Valor Preditivo Negativo (> 90%) para afastar fibrose F3-F4';
  let cond = 'Manejo na Atenção Primária / Ambulatório Geral. Foco na perda ponderal, controle do diabetes/dislipidemia e cessação de álcool. Repetir escore em 2 a 3 anos.';

  if (fib4 > 2.67) {
    estrato = 'Alta Probabilidade de Fibrose Hepática Avançada / Cirrose (FIB-4 > 2.67)';
    pred = 'Alto Valor Preditivo Positivo para fibrose avançada (F3-F4)';
    cond = 'Encaminhamento obrigatório ao Hepatologista / Gastroenterologista. Realizar elastografia hepática (FibroScan) ou biópsia e rastrear varizes de esôfago.';
  } else if (fib4 >= 1.30) {
    estrato = 'Faixa Indeterminada / Intermediária (1.30 a 2.67)';
    pred = 'Não é possível confirmar ou excluir fibrose avançada isoladamente';
    cond = 'Necessidade de método secundário não invasivo: solicitar Elastografia Hepática Transitória (FibroScan) ou ELF Test.';
  }

  return {
    score_fib4: fib4Arred,
    estratificacao_fibrose: estrato,
    valor_preditivo: pred,
    conduta_encaminhamento: cond,
  };
}

export function calcularGlasgowBlatchford(
  ureiaMgDl: number,
  hbGDl: number,
  pasMmhg: number,
  fcBpm: number,
  sexoFeminino: boolean,
  melena: boolean,
  sincope: boolean,
  hepatopatia: boolean,
  ic: boolean
): ResultadoGlasgowBlatchford {
  if (ureiaMgDl < 0.0 || hbGDl <= 0.0 || pasMmhg <= 0.0 || fcBpm <= 0.0) {
    throw parametroInvalido('laboratorio_ou_sinais_vitais', ureiaMgDl, 'Ureia, hemoglobina e sinais vitais devem ser válidos.');
  }

  let p = 0;
  const bun = ureiaMgDl / 2.14;
  if (bun >= 70.0) p += 6;
  else if (bun >= 28.0) p += 4;
  else if (bun >= 22.4) p += 3;
  else if (bun >= 18.2) p += 2;

  if (sexoFeminino) {
    if (hbGDl < 10.0) p += 6;
    else if (hbGDl < 12.0) p += 1;
  } else {
    if (hbGDl < 10.0) p += 6;
    else if (hbGDl < 12.0) p += 3;
    else if (hbGDl < 13.0) p += 1;
  }

  if (pasMmhg < 100.0) p += 3;
  else if (pasMmhg <= 109.0) p += 2;

  if (fcBpm >= 100.0) p += 1;
  if (melena) p += 1;
  if (sincope) p += 2;
  if (hepatopatia) p += 2;
  if (ic) p += 2;

  const baixoRisco = p === 0;
  return {
    pontuacao_total: p,
    baixo_risco_ambulatorial: baixoRisco,
    necessidade_intervencao_percentual: baixoRisco ? '< 0.5% de necessidade de intervenção' : '> 50% a 85% de intervenção necessária',
    conduta_sugerida: baixoRisco
      ? 'BAIXO RISCO DE COMPLICAÇÃO (GBS = 0): Candidato seguro a manejo ambulatorial. Endoscopia digestiva alta precoce em regime ambulatorial seguro.'
      : 'ALTO RISCO DE HDA (GBS >= 1): Internação hospitalar obrigatória. 2 acessos venosos calibrosos, ressuscitação volêmica cautelosa, IBP venoso e EDA em até 24h.',
  };
}

export function calcularBisap(
  ureia53: boolean,
  gcs15: boolean,
  sirs: boolean,
  id60: boolean,
  derrame: boolean
): ResultadoBisap {
  let p = 0;
  if (ureia53) p++;
  if (gcs15) p++;
  if (sirs) p++;
  if (id60) p++;
  if (derrame) p++;

  let cat = 'Pancreatite Aguda Leve (BISAP 0-2)';
  let mort = '< 1% a 2% de mortalidade hospitalar';
  let cond = 'Enfermaria clínica ou observação. Hidratação vigorosa com Ringer Lactato guiada por metas, analgesia escalonada e realimentação oral precoce.';

  if (p >= 3) {
    cat = 'Pancreatite Aguda Grave (BISAP >= 3)';
    mort = p >= 4 ? '> 15% a 22% de mortalidade' : '~5% a 10% de mortalidade';
    cond = 'INTERNAÇÃO EM UTI OBRIGATÓRIA: Alto risco de falência orgânica e necrose pancreática. Ressuscitação volêmica guiada por débito urinário.';
  }

  return {
    pontuacao_total: p,
    categoria_gravidade: cat,
    mortalidade_prevista_percentual: mort,
    indicacao_uti: p >= 3,
    conduta: cond,
  };
}

export function calcularAlvarado(
  dorFid: boolean,
  descomp: boolean,
  migr: boolean,
  febre: boolean,
  anorexia: boolean,
  nausea: boolean,
  leuco: boolean,
  desvio: boolean
): ResultadoAlvarado {
  let p = 0;
  if (migr) p += 1;
  if (anorexia) p += 1;
  if (nausea) p += 1;
  if (dorFid) p += 2;
  if (descomp) p += 2;
  if (febre) p += 1;
  if (leuco) p += 2;
  if (desvio) p += 1;

  let prob = 'Baixa Probabilidade de Apendicite (0 a 4 pontos)';
  let cond = 'Apendicite muito improvável. Não indicada tomografia de rotina. Investigar diagnósticos alternativos e observação ambulatorial com sinais de alerta.';

  if (p >= 7) {
    prob = 'Alta Probabilidade de Apendicite Aguda (7 a 10 pontos)';
    cond = 'AVALIAÇÃO CIRÚRGICA IMEDIATA: Alta probabilidade. Indicação de apendicectomia de urgência. Em homens jovens o quadro é diagnóstico; em mulheres e idosos considerar USG ou TC prévia.';
  } else if (p >= 5) {
    prob = 'Probabilidade Intermediária / Compatível (5 a 6 pontos)';
    cond = 'Observação clínica rigorosa com reavaliação seriada e indicação mandatória de exame de imagem (Ultrassonografia abdominal como primeira linha ou TC com contraste).';
  }

  return {
    pontuacao_total: p,
    probabilidade_apendicite: prob,
    conduta_cirurgica: cond,
  };
}

export function calcularEquivalenciaCorticoide(
  farmacoOrigem: string,
  doseMg: number
): ResultadoEquivalenciaCorticoide {
  if (doseMg < 0.0) {
    throw parametroInvalido('dose_mg', doseMg, 'A dose deve ser maior ou igual a zero.');
  }

  const tabela = [
    { nome: 'Hidrocortisona', pot: 1.0, dur: '8 a 12 horas (Curta)' },
    { nome: 'Prednisona', pot: 4.0, dur: '18 a 36 horas (Intermediária)' },
    { nome: 'Prednisolona', pot: 4.0, dur: '18 a 36 horas (Intermediária)' },
    { nome: 'Metilprednisolona', pot: 5.0, dur: '18 a 36 horas (Intermediária)' },
    { nome: 'Triancinolona', pot: 5.0, dur: '18 a 36 horas (Intermediária)' },
    { nome: 'Dexametasona', pot: 26.67, dur: '36 a 72 horas (Longa)' },
    { nome: 'Betametasona', pot: 26.67, dur: '36 a 72 horas (Longa)' },
    { nome: 'Deflazacorte', pot: 3.33, dur: '18 a 36 horas (Intermediária)' },
  ];

  const itemOrigem = tabela.find(t => farmacoOrigem.toLowerCase().includes(t.nome.toLowerCase())) || { nome: 'Prednisona', pot: 4.0, dur: '18 a 36 horas' };
  const dosePredEquiv = (doseMg * itemOrigem.pot) / 4.0;

  const dosesEquiv = tabela.map(t => ({
    farmaco: t.nome,
    dose_equivalente_mg: Math.round(((dosePredEquiv * 4.0) / t.pot) * 10) / 10,
    potencia_antiinflamatoria_relativa: t.pot,
    duracao_efeito_horas: t.dur,
  }));

  let desmame = 'Uso breve (< 2 a 3 semanas): Pode ser descontinuado sem necessidade de desmame gradual, pois o eixo HPA recupera-se espontaneamente.';
  if (dosePredEquiv >= 20.0) {
    desmame = 'Uso prolongado (> 3 semanas com Prednisona >= 20 mg/dia): ALTO RISCO DE SUPRESSÃO DO EIXO HPA. Desmame obrigatório: reduzir 5 a 10 mg a cada 1-2 semanas até 20 mg/dia; depois reduzir 2.5 mg a cada 1-2 semanas até 10 mg/dia; depois reduzir 1 mg a cada 2 semanas até suspensão.';
  }

  return {
    farmaco_origem: farmacoOrigem,
    dose_origem_mg: doseMg,
    doses_equivalentes: dosesEquiv,
    esquema_desmame_sugerido: desmame,
  };
}

export function calcularAntropometriaFarmacologica(
  pesoReal: number,
  alturaCm: number,
  sexoFeminino: boolean
): ResultadoAntropometriaFarmacologica {
  if (pesoReal <= 0.0 || alturaCm <= 0.0) {
    throw parametroInvalido('peso / altura', pesoReal, 'Peso e altura devem ser maiores que zero.');
  }

  const baseIdeal = sexoFeminino ? 45.5 : 50.0;
  const pesoIdealDevine = baseIdeal + 0.91 * (alturaCm - 152.4);
  const ibwFinal = pesoIdealDevine < 10.0 ? pesoReal : pesoIdealDevine;
  const ibwArred = Math.round(ibwFinal * 10) / 10;

  let pesoAjustado = pesoReal;
  if (pesoReal > ibwFinal * 1.20) {
    pesoAjustado = ibwFinal + 0.40 * (pesoReal - ibwFinal);
  }
  const abwArred = Math.round(pesoAjustado * 10) / 10;

  const sc = Math.sqrt((alturaCm * pesoReal) / 3600.0);
  const scArred = Math.round(sc * 10) / 10;

  const alturaMetros = alturaCm / 100.0;
  const imc = pesoReal / (alturaMetros * alturaMetros);
  const imcArred = Math.round(imc * 10) / 10;

  let classifImc = 'Eutrofia / Peso Normal (IMC 18.5 a 24.9 kg/m²)';
  if (imc >= 40.0) classifImc = 'Obesidade Grau III / Mórbida (IMC >= 40.0 kg/m²)';
  else if (imc >= 35.0) classifImc = 'Obesidade Grau II (IMC 35.0 a 39.9 kg/m²)';
  else if (imc >= 30.0) classifImc = 'Obesidade Grau I (IMC 30.0 a 34.9 kg/m²)';
  else if (imc >= 25.0) classifImc = 'Sobrepeso (IMC 25.0 a 29.9 kg/m²)';
  else if (imc < 18.5) classifImc = 'Baixo Peso (IMC < 18.5 kg/m²)';

  let rec = 'Drogas hidrofílicas e clearance: dosar com base no peso real ou ideal.';
  if (imc >= 30.0) {
    rec = 'PACIENTE COM OBESIDADE: Em drogas hidrofílicas de distribuição limitada ao meio extracelular (Aminoglicosídeos, Vancomicina, Daptomicina), utilizar o PESO AJUSTADO (ABW) para evitar superdosagem e nefrotoxicidade. Em drogas lipofílicas (sedativos, anestésicos), dosar por peso total.';
  }

  return {
    peso_real_kg: pesoReal,
    altura_cm: alturaCm,
    peso_ideal_devine_kg: ibwArred,
    peso_ajustado_obesidade_kg: abwArred,
    superficie_corporal_mosteller_m2: scArred,
    imc: imcArred,
    classificacao_imc: classifImc,
    recomendacao_drogas_hidrofilicas: rec,
  };
}

export function calcularCentorMcIsaac(
  idadeAnos: number,
  febre: boolean,
  tosse: boolean,
  linfonodo: boolean,
  exsudato: boolean
): ResultadoCentorMcIsaac {
  let p = 0;
  if (febre) p += 1;
  if (tosse) p += 1;
  if (linfonodo) p += 1;
  if (exsudato) p += 1;

  if (idadeAnos <= 14) p += 1;
  else if (idadeAnos >= 45) p -= 1;

  let prob = '1% a 2.5% de probabilidade de faringite bacteriana';
  let cond = 'Origem viral muito provável. Não realizar teste rápido nem prescrever antimicrobianos. Tratamento sintomático exclusivo (Dipirona / Paracetamol / anti-inflamatório).';

  if (p >= 4) {
    prob = '51% a 53% de probabilidade de estreptococo Grupo A (Centor >= 4)';
    cond = 'Alta probabilidade bacteriana: Tratamento antibiótico empírico indicado (Amoxicilina 500 mg VO de 8/8h por 10 dias OU Penicilina Benzatina 1.200.000 UI IM dose única).';
  } else if (p === 3) {
    prob = '28% a 35% de probabilidade';
    cond = 'Realizar Teste Rápido de Antígeno Estreptocócico (ou iniciar antibiótico empiricamente se teste não disponível no serviço: Amoxicilina 500mg de 8/8h por 10 dias ou Benzetacil dose única).';
  } else if (p === 2) {
    prob = '11% a 17% de probabilidade';
    cond = 'Indicação de Teste Rápido de Antígeno Estreptocócico (TRG) ou Cultura de Orofaringe. Prescrever antibiótico apenas se teste positivo.';
  } else if (p === 1) {
    prob = '5% a 10% de probabilidade';
    cond = 'Faringite viral provável. Antimicrobiano não indicado rotineiramente. Tratamento sintomático.';
  }

  return {
    pontuacao_total: p,
    probabilidade_strepto_percentual: prob,
    indicacao_teste_rapido_ou_atb: cond,
  };
}

export function calcularIdadeGestacionalDpp(
  dumAno: number,
  dumMes: number,
  dumDia: number,
  consultaAno: number,
  consultaMes: number,
  consultaDia: number
): ResultadoIdadeGestacionalDpp {
  if (dumMes < 1 || dumMes > 12 || dumDia < 1 || dumDia > 31) {
    throw parametroInvalido('dum', dumDia, 'Data da Última Menstruação (DUM) inválida.');
  }

  const dppDia = dumDia + 7;
  const dppMesAjustado = dumMes >= 4 ? dumMes - 3 : dumMes + 9;
  const dppAnoAjustado = dumMes >= 4 ? dumAno + 1 : dumAno;
  const dppFormatada = `${String(Math.min(28, dppDia)).padStart(2, '0')}/${String(dppMesAjustado).padStart(2, '0')}/${String(dppAnoAjustado).padStart(4, '0')}`;

  const diasDum = dumAno * 365 + (dumMes - 1) * 30 + dumDia;
  const diasConsulta = consultaAno * 365 + (consultaMes - 1) * 30 + consultaDia;
  const diasTotais = Math.max(0, diasConsulta - diasDum);
  const semanas = Math.floor(diasTotais / 7);
  const diasResto = diasTotais % 7;

  let trim = '1º Trimestre (< 14 semanas)';
  let exames = [
    'Hemograma completo, Tipagem sanguínea e Fator Rh (Coombs indireto se Rh negativo)',
    'Glicemia de jejum, EAS e Urocultura com antibiograma',
    'Sorologias: HIV, Sífilis (VDRL), Hepatite B (HBsAg), Toxoplasmose (IgM e IgG)',
    'Ultrassonografia Obstétrica Inicial (para confirmação precisa da idade gestacional e CCN)',
  ];

  if (semanas >= 28) {
    trim = '3º Trimestre (>= 28 semanas)';
    exames = [
      'Repetição de Sorologias: HIV, VDRL, Hepatite B, Toxoplasmose',
      'Hemograma completo e Glicemia de jejum',
      'Pesquisa de Streptococcus do Grupo B (Swab vaginal e retal entre 35 e 37 semanas)',
      'Avaliação ultrassonográfica do crescimento fetal, peso estimado e índice de líquido amniótico (ILA)',
    ];
  } else if (semanas >= 14) {
    trim = '2º Trimestre (14 a 27 semanas)';
    exames = [
      'Ultrassonografia Morfológica de 2º trimestre (idealmente entre 20 e 24 semanas)',
      'Teste Oral de Tolerância à Glicose com 75g (TOTG 75g) entre 24 e 28 semanas para rastreio de DMG',
      'Coombs indireto mensal se gestante Rh negativo com parceiro Rh positivo ou desconhecido',
    ];
  }

  return {
    idade_gestacional_semanas: semanas,
    idade_gestacional_dias: diasResto,
    data_provavel_parto_naegele: dppFormatada,
    trimestre_atual: trim,
    exames_do_trimestre: exames,
  };
}

export function calcularSofaCompleto(
  pao2Fio2: number = 400.0,
  vm: boolean = false,
  plaq: number = 250.0,
  bili: number = 1.0,
  pam: number = 80.0,
  dopa: number = 0.0,
  nora: number = 0.0,
  gcs: number = 15,
  cr: number = 1.0,
  diurese: number = 1500.0,
  temp: number = 36.8,
  fc: number = 75.0,
  fr: number = 16.0,
  leuco: number = 7000.0
): ResultadoSofaCompleto {
  let sofa = 0;

  let resp = 0;
  if (pao2Fio2 < 100.0 && vm) resp = 4;
  else if (pao2Fio2 < 200.0 && vm) resp = 3;
  else if (pao2Fio2 < 300.0) resp = 2;
  else if (pao2Fio2 < 400.0) resp = 1;
  sofa += resp;

  let coag = 0;
  if (plaq < 20.0) coag = 4;
  else if (plaq < 50.0) coag = 3;
  else if (plaq < 100.0) coag = 2;
  else if (plaq < 150.0) coag = 1;
  sofa += coag;

  let hep = 0;
  if (bili >= 12.0) hep = 4;
  else if (bili >= 6.0) hep = 3;
  else if (bili >= 2.0) hep = 2;
  else if (bili >= 1.2) hep = 1;
  sofa += hep;

  let cardio = 0;
  if (nora > 0.1 || dopa > 15.0) cardio = 4;
  else if (nora > 0.0 || dopa > 5.0) cardio = 3;
  else if (dopa > 0.0) cardio = 2;
  else if (pam < 70.0) cardio = 1;
  sofa += cardio;

  let neuro = 0;
  if (gcs < 6) neuro = 4;
  else if (gcs <= 9) neuro = 3;
  else if (gcs <= 12) neuro = 2;
  else if (gcs <= 14) neuro = 1;
  sofa += neuro;

  let renal = 0;
  if (cr >= 5.0 || diurese < 200.0) renal = 4;
  else if (cr >= 3.5 || diurese < 500.0) renal = 3;
  else if (cr >= 2.0) renal = 2;
  else if (cr >= 1.2) renal = 1;
  sofa += renal;

  let sirs = 0;
  if (temp > 38.0 || temp < 36.0) sirs++;
  if (fc > 90.0) sirs++;
  if (fr > 20.0) sirs++;
  if (leuco > 12000.0 || leuco < 4000.0) sirs++;

  let mort = '< 5% de mortalidade na UTI';
  let cond = 'Sem evidência de disfunção orgânica grave.';
  if (sofa >= 13) {
    mort = '> 80% a 95% de mortalidade hospitalar';
    cond = 'Falência de múltiplos órgãos refratária. Suporte de vida avançado em UTI.';
  } else if (sofa >= 10) {
    mort = '~50% de mortalidade';
    cond = 'Falência de múltiplos órgãos. Titulação de vasopressores e ventilação protetora.';
  } else if (sofa >= 6) {
    mort = '~20% a 40% de mortalidade';
    cond = 'Disfunção orgânica moderada a grave. Suporte intensivo e monitorização invasiva.';
  } else if (sofa >= 2) {
    mort = '~10% a 15% de mortalidade';
    cond = 'Sepse confirmada se associada a infecção documentada (variação do SOFA >= 2 pontos). Iniciar Bundle da 1ª hora (hemoculturas, lactato, antibiótico).';
  }

  return {
    sofa_total: sofa,
    mortalidade_estimada_uti: mort,
    pontuacao_respiratoria: resp,
    pontuacao_coagulacao: coag,
    pontuacao_hepatica: hep,
    pontuacao_cardiovascular: cardio,
    pontuacao_neurologica: neuro,
    pontuacao_renal: renal,
    criterios_sirs_presentes: sirs,
    sirs_positivo: sirs >= 2,
    conduta_sepse: cond,
  };
}

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
    case 'dose_reversa_infusao':
      return {
        dose_mcg_kg_min: calcularDoseReversaInfusao(
          exigirNumero('vazao_ml_h', parametros.vazao_ml_h),
          exigirNumero('peso_kg', parametros.peso_kg),
          exigirNumero('concentracao_mg_ml', parametros.concentracao_mg_ml)
        ),
        unidade: 'mcg/kg/min',
        vazao_ml_h: parametros.vazao_ml_h,
        peso_kg: parametros.peso_kg,
        concentracao_mg_ml: parametros.concentracao_mg_ml,
      };
    case 'cha2ds2_va':
      return calcularEscoreCha2ds2Va(
        booleano('insuficiencia_cardiaca'),
        booleano('hipertensao'),
        exigirNumero('idade', parametros.idade),
        booleano('diabetes'),
        booleano('avc_ou_ait_previo'),
        booleano('doenca_vascular')
      );
    case 'qsofa':
      return calcularEscoreQsofa(
        booleano('fr_maior_22'),
        booleano('pas_menor_100'),
        booleano('alteracao_mental')
      );
    case 'intubacao_sri':
      return calcularIntubacaoSri(
        exigirNumero('peso_kg', parametros.peso_kg),
        exigirNumero('altura_cm', parametros.altura_cm),
        booleano('sexo_feminino'),
        typeof parametros.perfil === 'string' ? parametros.perfil : 'padrao'
      );
    case 'emergencia_pediatrica':
      return calcularEmergenciaPediatrica(
        exigirNumero('peso_kg', parametros.peso_kg),
        exigirNumero('idade_anos', parametros.idade_anos)
      );
    case 'gasometria':
      return interpretarGasometria(
        exigirNumero('ph', parametros.ph),
        exigirNumero('paco2', parametros.paco2),
        exigirNumero('hco3', parametros.hco3),
        exigirNumero('sodio', parametros.sodio),
        exigirNumero('cloro', parametros.cloro),
        exigirNumero('albumina', parametros.albumina),
        exigirNumero('pao2', parametros.pao2),
        exigirNumero('fio2_fracao', parametros.fio2_fracao)
      );
        case 'dengue_ms':
      return calcularManejoDengueMs(
        exigirNumero('peso_kg', parametros.peso_kg),
        booleano('sinais_alarme'),
        booleano('sinais_choque_ou_sangramento_grave'),
        booleano('condicao_especial_ou_plaquetopenia'),
        parametros.idade_anos !== undefined && parametros.idade_anos !== null ? Number(parametros.idade_anos) : null
      );
    case 'parkland':
      return calcularParklandQueimado(
        exigirNumero('peso_kg', parametros.peso_kg),
        exigirNumero('percentual_scq', parametros.percentual_scq),
        parametros.horas_desde_queimadura !== undefined && parametros.horas_desde_queimadura !== null ? Number(parametros.horas_desde_queimadura) : 0
      );
    case 'metabolico_cad':
      return calcularMetabolicoCadCalemia(
        exigirNumero('sodio_medido', parametros.sodio_medido),
        exigirNumero('glicemia_mg_dl', parametros.glicemia_mg_dl),
        exigirNumero('potassio_medido', parametros.potassio_medido),
        parametros.calcio_total !== undefined && parametros.calcio_total !== null ? Number(parametros.calcio_total) : 9.0,
        parametros.albumina_g_dl !== undefined && parametros.albumina_g_dl !== null ? Number(parametros.albumina_g_dl) : 4.0
      );
    case 'fena_feureia':
      return calcularFenaFeureia(
        exigirNumero('na_serico', parametros.na_serico ?? parametros.na_plasmatico ?? 140),
        exigirNumero('cr_serica', parametros.cr_serica ?? parametros.cr_plasmatica ?? 1.0),
        exigirNumero('ureia_serica', parametros.ureia_serica ?? parametros.ureia_plasmatica ?? 40),
        exigirNumero('na_urinario', parametros.na_urinario ?? 20),
        exigirNumero('cr_urinaria', parametros.cr_urinaria ?? 50),
        parametros.ureia_urinaria !== undefined && parametros.ureia_urinaria !== null ? Number(parametros.ureia_urinaria) : null,
        booleano('usa_diuretico')
      );
    case 'pam_ppc':
      return calcularPamPpc(
        exigirNumero('pas_mmhg', parametros.pas_mmhg),
        exigirNumero('pad_mmhg', parametros.pad_mmhg),
        parametros.pic_mmhg !== undefined && parametros.pic_mmhg !== null ? Number(parametros.pic_mmhg) : null
      );
    case 'heart_score':
      return calcularHeartScore(
        exigirNumero('historia', parametros.historia),
        exigirNumero('ecg', parametros.ecg),
        exigirNumero('idade', parametros.idade),
        exigirNumero('fatores_risco', parametros.fatores_risco),
        exigirNumero('troponina', parametros.troponina)
      );
    case 'has_bled':
      return calcularHasBled(
        booleano('hipertensao_nao_controlada'),
        booleano('funcao_renal_anormal'),
        booleano('funcao_hepatica_anormal'),
        booleano('avc_previo'),
        booleano('sangramento_previo'),
        booleano('inr_labil'),
        booleano('idade_maior_65'),
        booleano('drogas_ou_aine') || booleano('uso_antiplaquetarios_ou_aine'),
        booleano('alcool') || booleano('uso_drogas_ou_alcool')
      );
    case 'qtc_corrigido':
      return calcularQtcCorrigido(
        exigirNumero('qt_medido_ms', parametros.qt_medido_ms ?? parametros.qt_ms),
        exigirNumero('fc_bpm', parametros.fc_bpm),
        booleano('sexo_feminino')
      );
    case 'perc':
      return calcularCriteriosPerc(
        booleano('idade_ge_50') || booleano('idade_maior_igual_50'),
        booleano('fc_ge_100') || booleano('fc_maior_igual_100'),
        booleano('spo2_menor_95') || booleano('sat_o2_ar_ambiente_menor_95'),
        booleano('edema_unilateral_mmii') || booleano('edema_unilateral_membro_inferior'),
        booleano('hemoptise'),
        booleano('cirurgia_ou_trauma_recente') || booleano('cirurgia_trauma_ultimas_4sem'),
        booleano('tev_previo'),
        booleano('uso_estrogenio')
      );
    case 'wells_tvp':
      return calcularWellsTvp(
        booleano('cancer_ativo'),
        booleano('paralisia_ou_imobilizacao_mmii') || booleano('paralisia_ou_imobilizacao_recente'),
        booleano('acamado_recente_ou_cirurgia') || booleano('acamado_recente_ou_cirurgia_maior'),
        booleano('dor_ao_longo_sistema_venoso') || booleano('dor_trajeto_venoso_profundo'),
        booleano('edema_perna_inteira') || booleano('edema_membro_inferior_inteiro'),
        booleano('edema_panturrilha_maior_3cm'),
        booleano('edema_com_cacifo') || booleano('edema_com_cacifo_unilateral'),
        booleano('veias_colaterais_superficiais'),
        booleano('tvp_previa') || booleano('tvp_previa_documentada'),
        booleano('diagnostico_alternativo_provavel') || booleano('diagnostico_alternativo_mais_provavel')
      );
    case 'padua_tev':
      return calcularEscorePadua(
        booleano('cancer_ativo'),
        booleano('tev_previo'),
        booleano('mobilidade_reduzida'),
        booleano('trombofilia') || booleano('trombofilia_conhecida'),
        booleano('trauma_ou_cirurgia_recente'),
        booleano('idade_ge_70') || booleano('idade_maior_igual_70'),
        booleano('ic_ou_insuf_respiratoria') || booleano('insuficiencia_cardiaca_ou_respiratoria'),
        booleano('iam_ou_avc_agudo') || booleano('iam_ou_avc_isquemico_agudo'),
        booleano('infeccao_ou_doenca_reumatologica') || booleano('infeccao_aguda_ou_doenca_reumatologica'),
        booleano('obesidade_imc_ge_30') || booleano('imc_maior_igual_30'),
        booleano('terapia_hormonal') || booleano('terapia_hormonal_em_curso')
      );
    case 'trombolise_avc':
      return calcularTromboliseAvc(exigirNumero('peso_kg', parametros.peso_kg));
    case 'glasgow_p':
      return calcularGlasgowP(
        exigirNumero('abertura_ocular', parametros.abertura_ocular),
        exigirNumero('resposta_verbal', parametros.resposta_verbal),
        exigirNumero('resposta_motora', parametros.resposta_motora),
        Number(parametros.reacao_pupilar ?? parametros.pupilas_sem_resposta_luz ?? 0)
      );
    case 'cranio_cervical':
      return calcularCranioCervical(
        booleano('glasgow_menor_15_em_2h') || booleano('gcs_menor_15_apos_2h'),
        booleano('suspeita_fratura_afundamento_base') || booleano('suspeita_fratura_aberta_afundamento'),
        booleano('vomitos_ge_2_episodios') || booleano('dois_ou_mais_episodios_vomito'),
        booleano('idade_ge_65') || booleano('idade_maior_igual_65'),
        booleano('amnesia_retrograda_ge_30min') || booleano('amnesia_retrograda_maior_30min'),
        booleano('mecanismo_perigoso_ejetado_atropelado') || booleano('mecanismo_perigoso'),
        booleano('dor_palpacao_linha_media_cervical') || booleano('nexus_dor_palpacao_cervical_medial'),
        booleano('deficit_neurologico_focal') || booleano('nexus_deficit_neurologico_focal'),
        booleano('nivel_consciencia_alterado_ou_glasgow_menor_15') || booleano('nexus_nivel_consciencia_alterado'),
        booleano('evidencia_intoxicacao') || booleano('nexus_sinais_intoxicacao'),
        booleano('lesao_dolorosa_distrativa') || booleano('nexus_lesao_dolorosa_distrativa')
      );
    case 'meld_na':
      return calcularMeldNa(
        exigirNumero('creatinina', parametros.creatinina),
        exigirNumero('bilirrubina', parametros.bilirrubina),
        exigirNumero('inr', parametros.inr),
        exigirNumero('sodio', parametros.sodio),
        booleano('dialise_recente')
      );
    case 'child_pugh':
      return calcularChildPugh(
        exigirNumero('bilirrubina', parametros.bilirrubina ?? parametros.bilirrubina_mg_dl),
        exigirNumero('albumina', parametros.albumina ?? parametros.albumina_g_dl),
        exigirNumero('inr', parametros.inr),
        exigirNumero('ascite_grau', parametros.ascite_grau ?? parametros.grau_ascite),
        exigirNumero('encefalopatia_grau', parametros.encefalopatia_grau ?? parametros.grau_encefalopatia)
      );
    case 'fib4':
      return calcularFib4(
        exigirNumero('idade', parametros.idade ?? parametros.idade_anos),
        exigirNumero('ast', parametros.ast ?? parametros.ast_tgo),
        exigirNumero('alt', parametros.alt ?? parametros.alt_tgp),
        exigirNumero('plaquetas_milhares', parametros.plaquetas_milhares)
      );
    case 'glasgow_blatchford':
      return calcularGlasgowBlatchford(
        exigirNumero('ureia_mg_dl', parametros.ureia_mg_dl),
        exigirNumero('hemoglobina_g_dl', parametros.hemoglobina_g_dl),
        exigirNumero('pas_mmhg', parametros.pas_mmhg),
        exigirNumero('fc_bpm', parametros.fc_bpm),
        booleano('sexo_feminino'),
        booleano('melena'),
        booleano('sincope'),
        booleano('hepatopatia') || booleano('doenca_hepatica'),
        booleano('insuficiencia_cardiaca')
      );
    case 'bisap':
      return calcularBisap(
        booleano('ureia_maior_53_5') || booleano('ureia_maior_44'),
        booleano('glasgow_menor_15'),
        booleano('sirs_presente'),
        booleano('idade_maior_60'),
        booleano('derrame_pleural')
      );
    case 'alvarado':
      return calcularAlvarado(
        booleano('dor_fossa_iliaca_direita') || booleano('dor_migratoria_fossa_iliaca_direita'),
        booleano('descompressao_brusca_positiva') || booleano('dor_descompressao_brusca'),
        booleano('migracao_da_dor'),
        booleano('febre_maior_37_3'),
        booleano('anorexia'),
        booleano('nauseas_ou_vomitos') || booleano('nausea_ou_vomito'),
        booleano('leucocitose_maior_10000'),
        booleano('desvio_a_esquerda') || booleano('desvio_esquerda_neutrofilos')
      );
    case 'equivalencia_corticoide':
      return calcularEquivalenciaCorticoide(
        typeof parametros.farmaco_origem === 'string' ? parametros.farmaco_origem : 'Prednisona',
        exigirNumero('dose_origem_mg', parametros.dose_origem_mg ?? parametros.dose_mg)
      );
    case 'antropometria_farmacologica':
      return calcularAntropometriaFarmacologica(
        exigirNumero('peso_kg', parametros.peso_kg),
        exigirNumero('altura_cm', parametros.altura_cm),
        booleano('sexo_feminino')
      );
    case 'centor_mcisaac':
      return calcularCentorMcIsaac(
        exigirNumero('idade_anos', parametros.idade_anos),
        booleano('febre_maior_38') || booleano('febre_referida_ou_aferida'),
        booleano('ausencia_de_tosse'),
        booleano('adenomegalia_cervical_anterior_dolorosa') || booleano('linfonodomegalia_cervical_anterior_dolorosa'),
        booleano('exsudato_amigdaliano') || booleano('exsudato_ou_edema_tonsilar')
      );
    case 'idade_gestacional_dpp':
      return calcularIdadeGestacionalDpp(
        exigirNumero('dum_ano', parametros.dum_ano),
        exigirNumero('dum_mes', parametros.dum_mes),
        exigirNumero('dum_dia', parametros.dum_dia),
        exigirNumero('consulta_ano', parametros.consulta_ano ?? parametros.data_atual_ano ?? parametros.dum_ano),
        exigirNumero('consulta_mes', parametros.consulta_mes ?? parametros.data_atual_mes ?? parametros.dum_mes),
        exigirNumero('consulta_dia', parametros.consulta_dia ?? parametros.data_atual_dia ?? parametros.dum_dia)
      );
    case 'sofa_completo':
      return calcularSofaCompleto(
        parametros.pao2_fio2 !== undefined && parametros.pao2_fio2 !== null ? Number(parametros.pao2_fio2) : 400.0,
        booleano('em_ventilacao_mecanica') || booleano('ventilacao_mecanica'),
        exigirNumero('plaquetas_milhares', parametros.plaquetas_milhares),
        parametros.bilirrubina !== undefined && parametros.bilirrubina !== null ? Number(parametros.bilirrubina) : Number(parametros.bilirrubina_mg_dl ?? 1.0),
        parametros.pam !== undefined && parametros.pam !== null ? Number(parametros.pam) : Number(parametros.pam_mmhg ?? 80.0),
        parametros.dopamina_mcg !== undefined && parametros.dopamina_mcg !== null ? Number(parametros.dopamina_mcg) : Number(parametros.dopamina_mcg_kg_min ?? 0.0),
        parametros.noradrenalina_mcg !== undefined && parametros.noradrenalina_mcg !== null ? Number(parametros.noradrenalina_mcg) : Number(parametros.noradrenalina_mcg_kg_min ?? 0.0),
        exigirNumero('glasgow', parametros.glasgow),
        parametros.creatinina !== undefined && parametros.creatinina !== null ? Number(parametros.creatinina) : Number(parametros.creatinina_mg_dl ?? 1.0),
        parametros.diurese_ml_dia !== undefined && parametros.diurese_ml_dia !== null ? Number(parametros.diurese_ml_dia) : Number(parametros.diurese_24h_ml ?? 1500.0),
        parametros.temp_celsius !== undefined && parametros.temp_celsius !== null ? Number(parametros.temp_celsius) : 36.8,
        parametros.fc_bpm !== undefined && parametros.fc_bpm !== null ? Number(parametros.fc_bpm) : 75.0,
        parametros.fr_irpm !== undefined && parametros.fr_irpm !== null ? Number(parametros.fr_irpm) : 16.0,
        parametros.leucocitos_totais !== undefined && parametros.leucocitos_totais !== null ? Number(parametros.leucocitos_totais) : 7000.0
      );

    case 'correcao_sodio':
      return calcularCorrecaoSodio(
        exigirNumero('sodio_atual', parametros.sodio_atual),
        exigirNumero('peso_kg', parametros.peso_kg),
        booleano('sexo_feminino'),
        booleano('idoso'),
        exigirNumero('solucao_meq_l', parametros.solucao_meq_l)
      );
    default:
      throw new ErroClinico(`Tipo de cálculo clínico desconhecido: '${tipo}'`);
  }
}
