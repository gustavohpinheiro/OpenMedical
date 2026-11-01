import type {
  AlertaCascataPrescricao,
  AlertaFarmacogenomicoCpic,
  ItemCargaAnticolinergica,
  RelatorioSeguranca5g,
  ResultadoCargaAnticolinergica,
  ResultadoEscoreTisdale,
  ResultadoTripleWhammy,
} from './types';

/**
 * Normaliza o nome do fármaco para maiúsculas e remove acentos diacríticos.
 */
export function normalizarTermoFarmaco(texto: string): string {
  return texto
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function contemQualquer(farmacoNorm: string, lista: string[]): boolean {
  return lista.some((item) => farmacoNorm.includes(item));
}

function encontrarCorrespondente(
  medicamentosNorm: { original: string; norm: string }[],
  lista: string[]
): string | null {
  const match = medicamentosNorm.find((m) => contemQualquer(m.norm, lista));
  return match ? match.original : null;
}

/**
 * Detecta pares de cascatas iatrogênicas de prescrição validadas na literatura clínica (JAMA/Lancet).
 */
export function detectarCascatasPrescricao(medicamentos: string[]): AlertaCascataPrescricao[] {
  const medsNorm = medicamentos.map((m) => ({ original: m, norm: normalizarTermoFarmaco(m) }));
  const cascatas: AlertaCascataPrescricao[] = [];

  // 1. Anlodipino -> Furosemida (Edema de MMII)
  const g1A = ['ANLODIPIN', 'AMLODIPIN', 'NIFEDIPIN', 'NORVASC', 'MANIVASC', 'LECANIDIPIN'];
  const g1B = ['FUROSEMID', 'HIDROCLOROTIAZID', 'CLORTALIDON', 'LASIX', 'INDAPAMID'];
  const match1A = encontrarCorrespondente(medsNorm, g1A);
  const match1B = encontrarCorrespondente(medsNorm, g1B);
  if (match1A && match1B) {
    cascatas.push({
      farmaco_causador: match1A,
      farmaco_prescrito: match1B,
      efeito_adverso_confundido:
        'Edema maleolar pré-capilar induzido por bloqueador de canal de cálcio di-hidropiridínico (frequentemente confundido com retenção volêmica de insuficiência cardíaca).',
      conduta_desprescricao:
        'Suspender o diurético se indicado apenas para o edema de tornozelos. Reduzir a dose do BCC ou associar IECA/BRA (promove dilatação venular pós-capilar, reduzindo a pressão hidrostática).',
    });
  }

  // 2. IECA -> Antitussígeno / Broncodilatador (Tosse seca crônica)
  const g2A = ['ENALAPRIL', 'CAPTOPRIL', 'RAMIPRIL', 'LISINOPRIL', 'PERINDOPRIL', 'RENITEC'];
  const g2B = ['CODEINA', 'DROPROPIZIN', 'ACEBROFILIN', 'SALBUTAMOL', 'CLOPERASTIN', 'LEVODROPROPIZIN', 'XAROPE'];
  const match2A = encontrarCorrespondente(medsNorm, g2A);
  const match2B = encontrarCorrespondente(medsNorm, g2B);
  if (match2A && match2B) {
    cascatas.push({
      farmaco_causador: match2A,
      farmaco_prescrito: match2B,
      efeito_adverso_confundido:
        'Tosse seca crônica induzida pelo acúmulo de bradicinina e substância P por inibição da enzima conversora de angiotensina (incidência de 5% a 20%).',
      conduta_desprescricao:
        'Substituir o IECA por um Antagonista do Receptor da Angiotensina II (BRA - ex: Losartana 50mg) e suspender antitussígenos ou broncodilatadores desnecessários.',
    });
  }

  // 3. Antidopaminérgico -> Antiparkinsoniano (Parkinsonismo secundário)
  const g3A = ['METOCLOPRAMID', 'HALOPERIDOL', 'RISPERIDON', 'FLUNARIZIN', 'CINARIZIN', 'PLASIL', 'HALDOL'];
  const g3B = ['LEVODOPA', 'BIPERIDENO', 'PROLOPA', 'AKINETON', 'PRAMIPEXOL'];
  const match3A = encontrarCorrespondente(medsNorm, g3A);
  const match3B = encontrarCorrespondente(medsNorm, g3B);
  if (match3A && match3B) {
    cascatas.push({
      farmaco_causador: match3A,
      farmaco_prescrito: match3B,
      efeito_adverso_confundido:
        'Parkinsonismo medicamentoso secundário ao bloqueio dopaminérgico D2 no estriado (tremor de repouso, rigidez plástica e bradicinesia).',
      conduta_desprescricao:
        'Suspender o bloqueador dopaminérgico agressor. Se antiemético necessário, prescrever Ondansetrona ou Domperidona; se antipsicótico, trocar por Quetiapina em dose baixa.',
    });
  }

  // 4. AINE -> Anti-hipertensivo (Descontrole pressórico)
  const g4A = ['IBUPROFEN', 'DICLOFENAC', 'CETOPROFEN', 'MELOXICAM', 'NIMESULID', 'NAPROXEN', 'CELECOXIB', 'ETORICOXIB', 'TENOXICAM', 'PIROXICAM', 'CATAFLAM', 'VOLTAREN', 'TORAGESIC'];
  const g4B = ['ANLODIPIN', 'LOSARTAN', 'ENALAPRIL', 'HIDROCLOROTIAZID', 'ATENOLOL', 'VALSARTAN', 'METOPROLOL'];
  const match4A = encontrarCorrespondente(medsNorm, g4A);
  const match4B = encontrarCorrespondente(medsNorm, g4B);
  if (match4A && match4B) {
    cascatas.push({
      farmaco_causador: match4A,
      farmaco_prescrito: match4B,
      efeito_adverso_confundido:
        'Elevação aguda da pressão arterial e retenção hidrossalina secundária à inibição da síntese renal de prostaglandinas vasodilatadoras (PGE2/PGI2).',
      conduta_desprescricao:
        'Desprescrever o AINE antes de escalonar classes ou doses de anti-hipertensivos. Substituir por analgésico sem impacto cardiovascular (Dipirona até 1g 6/6h ou Paracetamol).',
    });
  }

  // 5. Anticolinesterásico -> Antimuscarínico Urinário (Incontinência)
  const g5A = ['DONEPEZIL', 'RIVASTIGMIN', 'GALANTAMIN', 'ERANZ', 'EXELON'];
  const g5B = ['OXIBUTININ', 'TOLTERODIN', 'SOLIFENACIN', 'RETEMIC'];
  const match5A = encontrarCorrespondente(medsNorm, g5A);
  const match5B = encontrarCorrespondente(medsNorm, g5B);
  if (match5A && match5B) {
    cascatas.push({
      farmaco_causador: match5A,
      farmaco_prescrito: match5B,
      efeito_adverso_confundido:
        'Incontinência urinária de urgência decorrente do aumento da atividade parassimpática no músculo detrusor vesical estimulada pelo anticolinesterásico.',
      conduta_desprescricao:
        'Evitar antagonismo farmacológico nulo: a Oxibutinina atravessa a barreira hematoencefálica e neutraliza a eficácia cognitiva do inibidor de acetilcolinesterase, acelerando o declínio cognitivo. Avaliar Mirabegrona.',
    });
  }

  // 6. Fluoroquinolona -> Benzodiazepínico (Insônia / Agitação)
  const g6A = ['CIPROFLOXACIN', 'NORFLOXACIN', 'LEVOFLOXACIN', 'MOXIFLOXACIN'];
  const g6B = ['DIAZEPAM', 'CLONAZEPAM', 'ZOLPIDEM', 'LORAZEPAM', 'MIDAZOLAM', 'RIVOTRIL'];
  const match6A = encontrarCorrespondente(medsNorm, g6A);
  const match6B = encontrarCorrespondente(medsNorm, g6B);
  if (match6A && match6B) {
    cascatas.push({
      farmaco_causador: match6A,
      farmaco_prescrito: match6B,
      efeito_adverso_confundido:
        'Insônia aguda, pesadelos e hiperexcitabilidade do SNC por antagonismo no receptor GABA induzido pela fluoroquinolona.',
      conduta_desprescricao:
        'Efeito adverso transitório do antimicrobiano. Não iniciar benzodiazepínico ou hipnótico agonista Z de forma continuada, sob alto risco de dependência e quedas em idosos.',
    });
  }

  return cascatas;
}

/**
 * Calcula a Carga Anticolinérgica Cumulativa (ACB Score) e sugere estratégias de desprescrição em idosos.
 */
export function calcularCargaAnticolinergicaAcb(medicamentos: string[]): ResultadoCargaAnticolinergica {
  const acbPeso3 = [
    'AMITRIPTILIN', 'NORTRIPTILIN', 'CLOMIPRAMIN', 'IMIPRAMIN', 'PROMETAZIN',
    'DEXCLORFENIRAMIN', 'HIDROXIZIN', 'DIMENIDRINAT', 'ESCOPOLAMIN', 'OXIBUTININ',
    'BIPERIDENO', 'CLORPROMAZIN', 'OLANZAPIN', 'CICLOBENZAPRIN', 'ORFENADRIN',
    'LEVOMEPROMAZIN', 'TIORIDAZIN', 'BUSCOPAN', 'FERNERGAN', 'POLARAMINE',
  ];
  const acbPeso2 = [
    'CARBAMAZEPIN', 'OXCARBAZEPIN', 'LOPERAMID', 'CETIRIZIN', 'BACLOFEN', 'AMANTADIN',
  ];
  const acbPeso1 = [
    'FUROSEMID', 'CAPTOPRIL', 'HIDROCORTISON', 'PREDNISON', 'PREDNISOLON', 'DIGOXIN',
    'VARFARIN', 'CODEIN', 'MORFIN', 'HALOPERIDOL', 'RISPERIDON', 'QUETIAPIN',
    'TRAZODON', 'VENLAFAXIN', 'DIAZEPAM', 'ALPRAZOLAM', 'METOPROLOL', 'ATENOLOL',
    'RANITIDIN', 'PAROXETIN', 'SERTRALIN',
  ];

  let total = 0;
  const itens: ItemCargaAnticolinergica[] = [];

  for (const med of medicamentos) {
    const norm = normalizarTermoFarmaco(med);
    if (contemQualquer(norm, acbPeso3)) {
      total += 3;
      itens.push({
        medicamento: med,
        pontuacao_acb: 3,
        classificacao: 'Anticolinérgico Potente (ACB = 3)',
      });
    } else if (contemQualquer(norm, acbPeso2)) {
      total += 2;
      itens.push({
        medicamento: med,
        pontuacao_acb: 2,
        classificacao: 'Anticolinérgico Moderado (ACB = 2)',
      });
    } else if (contemQualquer(norm, acbPeso1)) {
      total += 1;
      itens.push({
        medicamento: med,
        pontuacao_acb: 1,
        classificacao: 'Anticolinérgico Leve / Cumulativo (ACB = 1)',
      });
    }
  }

  let classificacao = '';
  let sugestoes: string[] = [];

  if (total === 0) {
    classificacao = 'Ausência de Carga Anticolinérgica (ACB = 0)';
  } else if (total === 1) {
    classificacao = 'Carga Anticolinérgica Leve (ACB = 1) - Risco Baixo';
  } else if (total === 2) {
    classificacao = 'Carga Anticolinérgica Moderada (ACB = 2) - Monitorar sonolência, boca seca e constipação';
    sugestoes = ['Monitorar sinais precoces de retenção urinária e prejuízo cognitivo.'];
  } else {
    classificacao = 'Carga Anticolinérgica Alta (ACB >= 3) - Alto Risco de Delirium e Declínio Cognitivo';
    sugestoes = [
      'ALERTA CRÍTICO: Carga Anticolinérgica Alta (ACB >= 3). Fortemente associada a Delirium, quedas, fraturas e aumento da mortalidade em idosos.',
      'Substituir anti-histamínicos de 1ª geração (Dexclorfeniramina, Hidroxizina, Prometazina) por agentes de 2ª geração sem atividade anticolinérgica (Loratadina, Fexofenadina ou Desloratadina).',
      'Substituir relaxantes musculares anticolinérgicos (Ciclobenzaprina, Orfenadrina) por analgesia simples com Dipirona e fisioterapia motora.',
    ];
    if (itens.some((i) => contemQualquer(normalizarTermoFarmaco(i.medicamento), ['AMITRIPTILIN', 'NORTRIPTILIN', 'CLOMIPRAMIN']))) {
      sugestoes.push('Reavaliar antidepressivos tricíclicos: para dor neuropática considerar Duloxetina ou Gabapentina; para depressão optar por ISRS com ACB = 0 (Sertralina ou Escitalopram).');
    }
    if (itens.some((i) => contemQualquer(normalizarTermoFarmaco(i.medicamento), ['OXIBUTININ', 'RETEMIC']))) {
      sugestoes.push('Para bexiga hiperativa, descontinuar Oxibutinina e avaliar Mirabegrona (agonista beta-3 adrenérgico) ou fisioterapia do assoalho pélvico.');
    }
  }

  return {
    pontuacao_total: total,
    classificacao_risco: classificacao,
    itens,
    sugestoes_desprescricao: sugestoes,
  };
}

/**
 * Detecta a combinação iatrogênica "Triple Whammy" (IECA/BRA + Diurético + AINE).
 */
export function detectarTripleWhammyRenal(medicamentos: string[]): ResultadoTripleWhammy {
  const medsNorm = medicamentos.map((m) => ({ original: m, norm: normalizarTermoFarmaco(m) }));

  const gIecaBra = [
    'ENALAPRIL', 'CAPTOPRIL', 'RAMIPRIL', 'LISINOPRIL', 'PERINDOPRIL', 'BENAZEPRIL',
    'LOSARTAN', 'VALSARTAN', 'CANDESARTAN', 'OLMESARTAN', 'TELMISARTAN', 'IRBESARTAN',
  ];
  const gDiuretico = [
    'FUROSEMID', 'BUMETANID', 'HIDROCLOROTIAZID', 'CLORTALIDON', 'INDAPAMID',
    'ESPIRONOLACTON', 'EPLERENON', 'AMILORID', 'LASIX',
  ];
  const gAine = [
    'IBUPROFEN', 'DICLOFENAC', 'CETOPROFEN', 'NAPROXEN', 'NIMESULID', 'MELOXICAM',
    'CELECOXIB', 'ETORICOXIB', 'TENOXICAM', 'PIROXICAM', 'CETOROLACO', 'INDOMETACIN',
    'CATAFLAM', 'VOLTAREN', 'TORAGESIC',
  ];

  const medIecaBra = encontrarCorrespondente(medsNorm, gIecaBra);
  const medDiuretico = encontrarCorrespondente(medsNorm, gDiuretico);
  const medAine = encontrarCorrespondente(medsNorm, gAine);

  const detectado = Boolean(medIecaBra && medDiuretico && medAine);

  if (detectado) {
    return {
      detectado: true,
      vasodilatador_eferente_ieca_bra: medIecaBra,
      depletor_volume_diuretico: medDiuretico,
      vasoconstritor_aferente_aine: medAine,
      gravidade: 'Contraindicada / Crítica (Alto Risco de Injúria Renal Aguda e Hipercalemia)',
      mecanismo_fisiopatologico:
        'Colapso hemodinâmico intraglomerular: o AINE vasoconstringe a arteríola aferente (inibe PGE2/PGI2), o diurético espolia volume plasmático reduzindo a perfusão renal, e o IECA/BRA vasodilata a arteríola eferente (bloqueia angiotensina II), zerando o gradiente de filtração glomerular.',
      recomendacao_clinica:
        'Suspender imediatamente o AINE prescrito. Substituir por analgésico sem nefrotoxicidade hemodinâmica (Dipirona até 1g de 6/6h ou Paracetamol até 750mg de 8/8h). Hidratar e dosar creatinina, ureia e potássio sérico em 48 a 72h.',
    };
  }

  return {
    detectado: false,
    vasodilatador_eferente_ieca_bra: medIecaBra,
    depletor_volume_diuretico: medDiuretico,
    vasoconstritor_aferente_aine: medAine,
    gravidade: 'Sem detecção de combinação Triple Whammy',
    mecanismo_fisiopatologico: '',
    recomendacao_clinica: 'Manter monitorização rotineira de função renal e pressão arterial.',
  };
}

/**
 * Escore de Tisdale para estratificação de risco de prolongamento do intervalo QTc e Torsades de Pointes.
 */
export function calcularEscoreTisdaleQtc(
  medicamentos: string[],
  idade: number,
  sexo_feminino: boolean,
  potassio_menor_igual_3_5: boolean,
  qtc_basal_maior_igual_450: boolean,
  iam_agudo: boolean,
  insuficiencia_cardiaca_ou_sepse: boolean
): ResultadoEscoreTisdale {
  const medsNorm = medicamentos.map((m) => ({ original: m, norm: normalizarTermoFarmaco(m) }));

  const farmacosQtcLista = [
    'ONDANSETRON', 'AZITROMICIN', 'CLARITROMICIN', 'ERITROMICIN', 'CIPROFLOXACIN',
    'LEVOFLOXACIN', 'MOXIFLOXACIN', 'HALOPERIDOL', 'CLORPROMAZIN', 'RISPERIDON',
    'QUETIAPIN', 'ESCITALOPRAM', 'CITALOPRAM', 'AMITRIPTILIN', 'NORTRIPTILIN',
    'AMIODARON', 'SOTALOL', 'FLUCONAZOL', 'METADON', 'DOMPERIDON', 'HIDROXICLOROQUIN',
  ];

  const qtcEncontrados: string[] = [];
  for (const m of medsNorm) {
    for (const alvo of farmacosQtcLista) {
      if (m.norm.includes(alvo) && !qtcEncontrados.includes(m.original)) {
        qtcEncontrados.push(m.original);
      }
    }
  }

  const usaDiureticoAlca = medsNorm.some(
    (m) => m.norm.includes('FUROSEMID') || m.norm.includes('BUMETANID') || m.norm.includes('LASIX')
  );

  let pontos = 0;
  const fatores: string[] = [];

  if (idade >= 68) {
    pontos += 1;
    fatores.push('Idade >= 68 anos (+1 ponto)');
  }
  if (sexo_feminino) {
    pontos += 1;
    fatores.push('Sexo biológico feminino (+1 ponto)');
  }
  if (usaDiureticoAlca) {
    pontos += 1;
    fatores.push('Uso concomitante de diurético de alça / Furosemida (+1 ponto)');
  }
  if (potassio_menor_igual_3_5) {
    pontos += 2;
    fatores.push('Hipocalemia com K+ <= 3.5 mEq/L (+2 pontos)');
  }
  if (qtc_basal_maior_igual_450) {
    pontos += 2;
    fatores.push('Intervalo QTc basal prolongado >= 450 ms (+2 pontos)');
  }
  if (iam_agudo) {
    pontos += 2;
    fatores.push('Infarto Agudo do Miocárdio recente (+2 pontos)');
  }
  if (insuficiencia_cardiaca_ou_sepse) {
    pontos += 3;
    fatores.push('Insuficiência Cardíaca descompensada ou Sepse (+3 pontos)');
  }

  const qtdFarmacosQtc = qtcEncontrados.length;
  if (qtdFarmacosQtc >= 2) {
    pontos += 6;
    fatores.push(`>= 2 fármacos que prolongam o QTc na prescrição (+6 pontos): ${qtcEncontrados.join(', ')}`);
  } else if (qtdFarmacosQtc === 1) {
    pontos += 3;
    fatores.push(`1 fármaco que prolonga o QTc na prescrição (+3 pontos): ${qtcEncontrados[0]}`);
  }

  let categoria = '';
  let risco = '';
  let recomendacao = '';

  if (pontos <= 6) {
    categoria = 'Baixo Risco de Prolongamento QTc';
    risco = '~15% de incidência prevista de QTc > 500 ms';
    recomendacao = 'Risco baixo pelo Escore de Tisdale. Manter vigilância clínica e eletrocardiográfica de rotina.';
  } else if (pontos <= 10) {
    categoria = 'Moderado Risco de Prolongamento QTc';
    risco = '~37% de incidência prevista de QTc > 500 ms';
    recomendacao =
      'Risco moderado: Realizar ECG prévio e seriado após introdução das medicações. Otimizar eletrólitos séricos mantendo K+ >= 4.0 mEq/L e Magnésio >= 2.0 mg/dL.';
  } else {
    categoria = 'Alto Risco de Torsades de Pointes e PCR';
    risco = '~73% de incidência prevista de QTc > 500 ms';
    recomendacao =
      'ALERTA CRÍTICO: Risco muito alto de fibrilação ventricular / Torsades de Pointes. Evitar prescrever novos fármacos que alarguem o QTc, monitorar em telemetria contínua e suspender agentes duplicados.';
  }

  return {
    pontuacao_total: pontos,
    categoria_risco: categoria,
    risco_estimado_percentual: risco,
    farmacos_qtc_presentes: qtcEncontrados,
    fatores_risco_detectados: fatores,
    recomendacao_monitorizacao: recomendacao,
  };
}

/**
 * Consulta diretrizes e alertas silenciosos de Farmacogenômica com nível de evidência CPIC Nível A.
 */
export function consultarAlertasFarmacogenomicosCpic(medicamentos: string[]): AlertaFarmacogenomicoCpic[] {
  const medsNorm = medicamentos.map((m) => ({ original: m, norm: normalizarTermoFarmaco(m) }));
  const alertas: AlertaFarmacogenomicoCpic[] = [];

  const clop = encontrarCorrespondente(medsNorm, ['CLOPIDOGREL', 'PLAVIX']);
  if (clop) {
    alertas.push({
      medicamento: clop,
      gene: 'CYP2C19',
      nivel_evidencia_cpic: 'Nível A (Diretriz CPIC / FDA Black Box)',
      alerta_clinico:
        'O Clopidogrel é uma pró-droga que requer ativação pela enzima hepática CYP2C19. Indivíduos metabolizadores intermediários (*1/*2, *1/*3) ou lentos (*2/*2, *3/*3) apresentam geração reduzida do metabólito ativo e maior risco de trombose de stent e novos eventos isquêmicos.',
      recomendacao:
        'Em Síndrome Coronariana Aguda com Intervenção Coronária Percutânea (ICP), considerar uso preferencial de Prasugrel ou Ticagrelor, fármacos com menor dependência de ativação pela CYP2C19.',
    });
  }

  const cod = encontrarCorrespondente(medsNorm, ['CODEIN', 'TYLEX', 'TRAMADOL']);
  if (cod) {
    alertas.push({
      medicamento: cod,
      gene: 'CYP2D6',
      nivel_evidencia_cpic: 'Nível A (Diretriz CPIC)',
      alerta_clinico:
        'A Codeína e o Tramadol são bioativados pela CYP2D6 em metabólitos opioides ativos (morfina e O-desmetiltramadol). Em metabolizadores ultrarrápidos há risco grave de intoxicação opioide e parada respiratória fatal; em metabolizadores lentos ocorre falha analgésica completa.',
      recomendacao:
        'Evitar Codeína e Tramadol em metabolizadores ultrarrápidos ou lentos da CYP2D6. Optar por analgésicos não opioides ou opioides que não dependem do metabolismo de primeira passagem pela CYP2D6 (Morfina direta em dose titulada).',
    });
  }

  const sinv = encontrarCorrespondente(medsNorm, ['SINVASTATIN', 'ZOCOR']);
  if (sinv) {
    alertas.push({
      medicamento: sinv,
      gene: 'SLCO1B1',
      nivel_evidencia_cpic: 'Nível A (Diretriz CPIC)',
      alerta_clinico:
        'Polimorfismos no transportador hepático SLCO1B1 (variante c.521T>C / alelo *5) aumentam drasticamente a concentração plasmática de Sinvastatina, elevando em mais de 4 vezes o risco de miopatia grave e rabdomiólise fatal na dose de 40 a 80 mg/dia.',
      recomendacao:
        'Em portadores de variantes SLCO1B1 de função reduzida, prescrever doses baixas de Sinvastatina (máximo 20 mg/dia) ou substituir por estatina com captação hepática menos dependente de SLCO1B1 (Rosuvastatina, Atorvastatina ou Pravastatina).',
    });
  }

  const alo = encontrarCorrespondente(medsNorm, ['ALOPURINOL', 'ZYLORIC']);
  if (alo) {
    alertas.push({
      medicamento: alo,
      gene: 'HLA-B*58:01',
      nivel_evidencia_cpic: 'Nível A (Diretriz CPIC / Colégio Americano de Reumatologia)',
      alerta_clinico:
        'Presença do alelo HLA-B*58:01 está fortemente associada a Reações Adversas Cutâneas Graves (SCARs), incluindo Síndrome de Stevens-Johnson (SSJ), Necrólise Epidérmica Tóxica (NET) e síndrome DRESS induzidas pelo Alopurinol.',
      recomendacao:
        'A triagem de HLA-B*58:01 é recomendada especialmente em populações de ascendência do Leste Asiático e Afrodescendentes antes de prescrever Alopurinol. Em portadores positivos, o Alopurinol é estritamente contraindicado; considerar Febuxostate.',
    });
  }

  const carb = encontrarCorrespondente(medsNorm, ['CARBAMAZEPIN', 'TEGRETOL', 'FENITOIN', 'HIDANTAL']);
  if (carb) {
    alertas.push({
      medicamento: carb,
      gene: 'HLA-B*15:02 e CYP2C9',
      nivel_evidencia_cpic: 'Nível A (Diretriz CPIC)',
      alerta_clinico:
        'O alelo HLA-B*15:02 confere risco altíssimo de Stevens-Johnson/NET com Carbamazepina e Fenitoína. Variantes de perda de função no gene CYP2C9 reduzem a depuração da Fenitoína, acumulando níveis tóxicos com ataxia e nistagmo.',
      recomendacao:
        'Contraindicado iniciar Carbamazepina ou Fenitoína se HLA-B*15:02 positivo. Optar por anticonvulsivantes com menor imunogenicidade cutânea (Levetiracetam ou Ácido Valproico).',
    });
  }

  const varf = encontrarCorrespondente(medsNorm, ['VARFARIN', 'MAREVAN', 'COUMADIN']);
  if (varf) {
    alertas.push({
      medicamento: varf,
      gene: 'CYP2C9 e VKORC1',
      nivel_evidencia_cpic: 'Nível A (Diretriz CPIC)',
      alerta_clinico:
        'Variantes alélicas CYP2C9 (*2 e *3) reduzem o clearance da S-varfarina, enquanto o polimorfismo no promotor VKORC1 (-1639G>A) aumenta a sensibilidade farmacológica à inibição do ciclo da vitamina K, exigindo reduções de 30% a 70% na dose inicial.',
      recomendacao:
        'Iniciar com doses conservadoras de Varfarina guiadas por algoritmo farmacogenômico ou priorizar Anticoagulantes Orais Diretos (DOACs - Apixabana/Rivaroxabana) em casos elegíveis sem prótese valvar mecânica.',
    });
  }

  return alertas;
}

/**
 * Avalia integralmente o pacote de Segurança de 5ª Geração (Cascatas, ACB, Triple Whammy, Tisdale e CPIC).
 */
export function avaliarSegurancaMedicamentosa5g(
  medicamentos: string[],
  idade = 50,
  sexo_feminino = false,
  potassio_menor_igual_3_5 = false,
  qtc_basal_maior_igual_450 = false,
  iam_agudo = false,
  insuficiencia_cardiaca_ou_sepse = false
): RelatorioSeguranca5g {
  return {
    cascatas: detectarCascatasPrescricao(medicamentos),
    carga_anticolinergica: calcularCargaAnticolinergicaAcb(medicamentos),
    triple_whammy: detectarTripleWhammyRenal(medicamentos),
    escore_tisdale: calcularEscoreTisdaleQtc(
      medicamentos,
      idade,
      sexo_feminino,
      potassio_menor_igual_3_5,
      qtc_basal_maior_igual_450,
      iam_agudo,
      insuficiencia_cardiaca_ou_sepse
    ),
    farmacogenomica: consultarAlertasFarmacogenomicosCpic(medicamentos),
  };
}
