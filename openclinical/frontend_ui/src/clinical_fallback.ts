// Porte fiel do motor clínico Rust (clinical_engine) para execução em navegador/PWA,
// onde o Tauri IPC não existe. Qualquer alteração aqui deve espelhar calculators.rs e
// pediatric.rs; a paridade é verificada em tests/paridade_calculos.test.mjs.
import type {
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
