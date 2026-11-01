// =============================================================================
// MOTOR DETERMINÍSTICO DE INVESTIGAÇÃO DIAGNÓSTICA DE SINTOMAS
// OpenClinical - Mapeamento Sintomas -> Hipóteses Clínicas & Propedêutica
// =============================================================================

export interface SintomaClinico {
  id: string;
  nome: string;
  sistema:
    | 'Constitucional'
    | 'Respiratório'
    | 'Cardiovascular'
    | 'Gastrointestinal'
    | 'Nefro-Urológico'
    | 'Neurológico'
    | 'Dermatológico'
    | 'Osteomuscular';
  sinonimos?: string[];
}

export interface HipoteseDiagnostica {
  id_protocolo: string;
  doenca: string;
  cids: string[];
  sistema: string;
  sintomas_cardinais: string[];
  outros_sintomas: string[];
  sinais_alarme: string[];
  exames_investigativos: string[];
  conduta_inicial: string;
  medicamentos_sugeridos: {
    nome: string;
    posologia: string;
    controlado?: boolean;
    apresentacao?: string;
  }[];
  orientacoes_cuidados: string[];
  contraindicacoes_absolutas: string[];
  score_match?: number;
  sintomas_presentes?: string[];
  sintomas_ausentes?: string[];
  sinais_alarme_ativos?: string[];
}

export const DICIONARIO_SINTOMAS: SintomaClinico[] = [
  // Constitucional / Geral
  { id: 'febre', nome: 'Febre aferida (> 37,8°C)', sistema: 'Constitucional', sinonimos: ['pirexia', 'temperatura', 'febril'] },
  { id: 'fadiga', nome: 'Fadiga intensa / Astenia / Fraqueza', sistema: 'Constitucional', sinonimos: ['cansaco', 'adinamia'] },
  { id: 'perda_peso', nome: 'Perda de peso não intencional', sistema: 'Constitucional', sinonimos: ['emagrecimento', 'caquexia'] },
  { id: 'sudorese_noturna', nome: 'Sudorese noturna profusa', sistema: 'Constitucional', sinonimos: ['suor noturno'] },
  { id: 'mialgia', nome: 'Mialgia / Dores musculares generalizadas', sistema: 'Constitucional', sinonimos: ['dor no corpo'] },
  { id: 'artralgia', nome: 'Artralgia / Dores articulares', sistema: 'Constitucional', sinonimos: ['dor nas juntas'] },

  // Respiratório
  { id: 'tosse_seca', nome: 'Tosse seca irritativa', sistema: 'Respiratório', sinonimos: ['tossindo sem expectoracao'] },
  { id: 'tosse_produtiva', nome: 'Tosse produtiva com expectoração', sistema: 'Respiratório', sinonimos: ['catarro', 'escarro'] },
  { id: 'dispneia', nome: 'Dispneia / Falta de ar', sistema: 'Respiratório', sinonimos: ['falta de ar', 'cansaco respiratorio'] },
  { id: 'dor_pleuritica', nome: 'Dor torácica pleurítica (piora à inspiração)', sistema: 'Respiratório', sinonimos: ['dor ventilatorio dependente'] },
  { id: 'sibilos', nome: 'Sibilos / Chiado no peito', sistema: 'Respiratório', sinonimos: ['chieira', 'miado de gato'] },
  { id: 'coriza', nome: 'Coriza / Congestão nasal', sistema: 'Respiratório', sinonimos: ['nariz escorrendo', 'obstrucao nasal'] },
  { id: 'odinofagia', nome: 'Odinofagia / Dor de garganta', sistema: 'Respiratório', sinonimos: ['dor ao engolir', 'faringe'] },
  { id: 'hemoptise', nome: 'Hemoptise (escarro com sangue)', sistema: 'Respiratório', sinonimos: ['sangue no catarro'] },

  // Cardiovascular
  { id: 'dor_precordial', nome: 'Dor precordial em opressão / aperto', sistema: 'Cardiovascular', sinonimos: ['dor no peito', 'angina'] },
  { id: 'palpitacoes', nome: 'Palpitações / Taquicardia', sistema: 'Cardiovascular', sinonimos: ['coracao acelerado', 'batedeira'] },
  { id: 'edema_mmii', nome: 'Edema de membros inferiores (inchaço nas pernas)', sistema: 'Cardiovascular', sinonimos: ['pernas inchadas', 'tornozelo inchado'] },
  { id: 'ortopneia', nome: 'Ortopneia / Dispneia paroxística noturna (DPN)', sistema: 'Cardiovascular', sinonimos: ['sufocamento ao deitar'] },
  { id: 'sincope', nome: 'Síncope / Desmaio / Pré-síncope', sistema: 'Cardiovascular', sinonimos: ['tontura com desmaio', 'apagao'] },

  // Gastrointestinal
  { id: 'dor_epigastrica', nome: 'Dor epigástrica / Azia / Pirose', sistema: 'Gastrointestinal', sinonimos: ['dor de estomago', 'queimacao'] },
  { id: 'dor_hipocondrio_dir', nome: 'Dor em hipocôndrio direito (fígado/vesícula)', sistema: 'Gastrointestinal', sinonimos: ['dor no lado direito alto'] },
  { id: 'dor_fossa_iliaca_dir', nome: 'Dor em fossa ilíaca direita (FID)', sistema: 'Gastrointestinal', sinonimos: ['dor no pe da barriga a direita'] },
  { id: 'nausea_vomito', nome: 'Náuseas / Vômitos frequentes', sistema: 'Gastrointestinal', sinonimos: ['enjoo', 'emese'] },
  { id: 'diarreia_aquosa', nome: 'Diarreia aquosa aguda', sistema: 'Gastrointestinal', sinonimos: ['evacuacoes liquidas', 'desarranjo'] },
  { id: 'diarreia_sangue', nome: 'Diarreia sanguinolenta / Disenteria', sistema: 'Gastrointestinal', sinonimos: ['sangue nas fezes', 'muco nas fezes'] },
  { id: 'ictericia', nome: 'Icterícia (olhos amarelos) / Colúria (urina escura)', sistema: 'Gastrointestinal', sinonimos: ['pele amarela', 'urina cor de coca-cola'] },

  // Nefro-Urológico
  { id: 'disuria', nome: 'Disúria (dor ou queimação ao urinar)', sistema: 'Nefro-Urológico', sinonimos: ['ardor urinario', 'dor para fazer xixi'] },
  { id: 'polaciuria', nome: 'Polaciúria / Urgência miccional', sistema: 'Nefro-Urológico', sinonimos: ['urinar muitas vezes em pouca quantidade'] },
  { id: 'dor_lombar', nome: 'Dor lombar / Giordano positivo', sistema: 'Nefro-Urológico', sinonimos: ['dor nos rins', 'dor nas costas'] },
  { id: 'hematuria', nome: 'Hematúria (urina com sangue ou avermelhada)', sistema: 'Nefro-Urológico', sinonimos: ['sangue na urina'] },
  { id: 'oliguria', nome: 'Oligúria / Redução expressiva do volume urinário', sistema: 'Nefro-Urológico', sinonimos: ['urina diminuida', 'anuria'] },

  // Neurológico
  { id: 'cefaleia_intensa', nome: 'Cefaleia holocraniana intensa ou súbita', sistema: 'Neurológico', sinonimos: ['dor de cabeca forte', 'enxaqueca'] },
  { id: 'deficit_focal', nome: 'Déficit motor focal (fraqueza em um lado do corpo)', sistema: 'Neurológico', sinonimos: ['hemiplegia', 'hemiparesia', 'perda de forca'] },
  { id: 'desvio_rima', nome: 'Desvio de rima facial / Disartria (dificuldade de falar)', sistema: 'Neurológico', sinonimos: ['boca torta', 'fala arrastada'] },
  { id: 'confusao_mental', nome: 'Confusão mental / Desorientação / Letargia', sistema: 'Neurológico', sinonimos: ['delirium', 'sonolencia excessiva'] },
  { id: 'rigidez_nucal', nome: 'Rigidez de nuca / Sinais meníngeos', sistema: 'Neurológico', sinonimos: ['pescoco duro', 'dor ao fletir pescoco'] },

  // Dermatológico & Infeccioso
  { id: 'exantema', nome: 'Exantema / Rash cutâneo / Manchas avermelhadas', sistema: 'Dermatológico', sinonimos: ['manchas vermelhas na pele', 'erupcao'] },
  { id: 'petequias', nome: 'Petéquias / Púrpuras / Prova do laço positiva', sistema: 'Dermatológico', sinonimos: ['pontos vermelhos na pele', 'sangramento cutaneo'] },
  { id: 'dor_retroorbitaria', nome: 'Dor retro-orbitária (dor atrás dos olhos)', sistema: 'Constitucional', sinonimos: ['dor no fundo dos olhos'] },
  { id: 'poliuria_polidipsia', nome: 'Poliúria (urinar muito) e Polidipsia (sede excessiva)', sistema: 'Constitucional', sinonimos: ['muita sede', 'muito xixi'] },
];

export const BASE_HIPOTESES_CLINICAS: HipoteseDiagnostica[] = [
  {
    id_protocolo: 'dengue_ms_2024',
    doenca: 'Dengue Clássica e Arboviroses (MS 6ª Edição)',
    cids: ['A90', 'A91'],
    sistema: 'Infectologia & Arboviroses',
    sintomas_cardinais: ['febre', 'mialgia', 'cefaleia_intensa', 'dor_retroorbitaria'],
    outros_sintomas: ['artralgia', 'exantema', 'nausea_vomito', 'fadiga'],
    sinais_alarme: [
      'Dor abdominal intensa e contínua',
      'Vômitos persistentes (>= 3 episódios em 1 hora)',
      'Hipotensão postural ou lipotimia',
      'Hepatomegalia dolorosa (> 2 cm do rebordo costal)',
      'Sangramento de mucosas (gengivorragia, epistaxe, metrorragia)',
      'Letargia ou irritabilidade',
      'Aumento progressivo do hematócrito ou queda abrupta de plaquetas',
    ],
    exames_investigativos: [
      'Hemograma completo urgente (Hematócrito e Plaquetas)',
      'Prova do laço (Classificação do grupo A vs B)',
      'Pesquisa de Antígeno NS1 (até 5º dia de febre) ou Sorologia IgM (a partir do 6º dia)',
      'Dosagem de AST/ALT e Função Renal se sinais de alarme',
    ],
    conduta_inicial:
      'Grupo A (ambulatorial): Hidratação oral vigorosa (60 mL/kg/dia, 1/3 com SRO e 2/3 com água/sucos). Sintomáticos com Dipirona ou Paracetamol. CONTRAINDICADOS estritamente: AAS, Ibuprofeno, Diclofenaco e todos os AINEs pelo risco fatal de sangramento.',
    medicamentos_sugeridos: [
      {
        nome: 'Dipirona Monoidratada 500mg',
        posologia: 'Tomar 1 a 2 comprimidos por via oral até de 6 em 6 horas em caso de dor ou febre (não exceder 4g/dia).',
        apresentacao: '500mg comprimidos',
      },
      {
        nome: 'Sais de Reidratação Oral (SRO)',
        posologia: 'Diluir 1 envelope em 1 litro de água filtrada. Beber ao longo do dia com pequenos goles.',
        apresentacao: 'Envelope com pó para solução oral',
      },
    ],
    orientacoes_cuidados: [
      'Repouso domiciliar obrigatório durante o período febril.',
      'Retornar imediatamente à emergência se surgirem dores na barriga, vômitos que não cessam ou tontura.',
      'Utilizar repelente de mosquitos para interromper a cadeia de transmissão intradomiciliar.',
    ],
    contraindicacoes_absolutas: ['AAS (Ácido Acetilsalicílico)', 'Ibuprofeno', 'Diclofenaco', 'Cetoprofeno', 'Corticoides na fase aguda'],
  },
  {
    id_protocolo: 'pneumonia_pac_nice_ms',
    doenca: 'Pneumonia Adquirida na Comunidade (PAC)',
    cids: ['J15', 'J18'],
    sistema: 'Pneumologia',
    sintomas_cardinais: ['tosse_produtiva', 'febre', 'dispneia', 'dor_pleuritica'],
    outros_sintomas: ['fadiga', 'mialgia', 'confusao_mental'],
    sinais_alarme: [
      'Escore CURB-65 / CRB-65 >= 2',
      'Frequência respiratória >= 30 irpm',
      'Pressão arterial sistólica < 90 mmHg ou diastólica <= 60 mmHg',
      'Confusão mental aguda',
      'SpO2 < 92% em ar ambiente',
    ],
    exames_investigativos: [
      'Radiografia de tórax (PA e Perfil)',
      'Oximetria de pulso contínua',
      'Dosagem de PCR (Point-of-care ou laboratorial)',
      'Hemograma completo, Ureia e Creatinina para cálculo do CURB-65',
    ],
    conduta_inicial:
      'CRB-65 = 0 (Baixo risco ambulatorial): Amoxicilina 500mg 8/8h por 5 dias (ou Doxiciclina 100mg 12/12h se alergia). Se CRB-65 >= 1 ou comorbidades: encaminhar para avaliação hospitalar com amoxicilina/clavulanato + macrolídeo.',
    medicamentos_sugeridos: [
      {
        nome: 'Amoxicilina 500mg',
        posologia: 'Tomar 1 cápsula por via oral de 8 em 8 horas durante 5 dias.',
        apresentacao: '500mg cápsulas (Portaria 344/98 - Antimicrobiano 2 vias)',
        controlado: true,
      },
      {
        nome: 'Dipirona 500mg',
        posologia: 'Tomar 1 comprimido de 6 em 6 horas se febre > 37,8°C ou dor torácica.',
        apresentacao: '500mg comprimidos',
      },
    ],
    orientacoes_cuidados: [
      'Manter boa hidratação para fluidificar as secreções brônquicas.',
      'Não interromper os antibióticos antes dos 5 dias recomendados.',
      'Buscar emergência caso sinta falta de ar progressiva ou lábios arroxeados.',
    ],
    contraindicacoes_absolutas: ['Não prescrever antitussígenos que suprimam a expectoração produtiva protetora.'],
  },
  {
    id_protocolo: 'itu_cistite_pielonefrite',
    doenca: 'Infecção do Trato Urinário (Cistite & Pielonefrite)',
    cids: ['N39.0', 'N10'],
    sistema: 'Nefro-Urológico',
    sintomas_cardinais: ['disuria', 'polaciuria'],
    outros_sintomas: ['febre', 'dor_lombar', 'hematuria', 'nausea_vomito'],
    sinais_alarme: [
      'Febre alta associada a sinal de Giordano positivo (dor à punho-percussão lombar): indica Pielonefrite Aguda',
      'Hipotensão ou calafrios com tremores (Sepse de foco urinário)',
      'Intolerância gástrica absoluta a medicamentos orais',
      'Gestação (bacteriúria ou cistite em gestante exige tratamento imediato e urocultura)',
    ],
    exames_investigativos: [
      'EAS / Urina tipo 1 (presença de piócitos, nitrito positivo e hematúria)',
      'Urocultura com Antibiograma (obrigatória em homens, gestantes e suspeita de pielonefrite)',
      'Ultrassonografia do aparelho urinário se suspeita de nefrolitíase complicada ou pielonefrite obstrutiva',
    ],
    conduta_inicial:
      'Cistite não complicada em mulher: Fosfomicina trometamol 3g dose única ou Nitrofurantoína 100mg 6/6h por 5 dias. Pielonefrite não complicada ambulatorial: Ciprofloxacino 500mg 12/12h por 7 dias ou Ceftriaxona 1g IM.',
    medicamentos_sugeridos: [
      {
        nome: 'Fosfomicina Trometamol 3g',
        posologia: 'Dissolver 1 envelope em meio copo d’água e tomar em dose única antes de dormir, após esvaziar a bexiga.',
        apresentacao: 'Envelope com granulado 3g (Antimicrobiano 2 vias)',
        controlado: true,
      },
      {
        nome: 'Escopolamina + Dipirona',
        posologia: 'Tomar 1 comprimido até de 8 em 8 horas se cólica ou espasmo vesical.',
        apresentacao: 'Comprimidos',
      },
    ],
    orientacoes_cuidados: [
      'Ingerir pelo menos 2,5 a 3 litros de água por dia.',
      'Não reter a urina por períodos prolongados.',
      'Micção pós-coito recomendada.',
    ],
    contraindicacoes_absolutas: ['Não utilizar quinolonas como 1ª linha em cistites simples sem critérios de complicação.'],
  },
  {
    id_protocolo: 'sepse_choque_septico',
    doenca: 'Sepse e Choque Séptico (Protocolo Golden Hour)',
    cids: ['A41.9', 'R65.2'],
    sistema: 'Urgência & Terapia Intensiva',
    sintomas_cardinais: ['febre', 'confusao_mental', 'dispneia', 'oliguria'],
    outros_sintomas: ['fadiga', 'palpitacoes', 'nausea_vomito'],
    sinais_alarme: [
      'qSOFA >= 2 (PAS <= 100 mmHg, FR >= 22 irpm, Glasgow < 15)',
      'Lactato sérico >= 2 mmol/L (ou >= 4 mmol/L = choque grave)',
      'Hipotensão refratária à reposição volêmica inicial exigindo vasopressor',
      'Tempo de enchimento capilar > 3 segundos / livedo reticular',
    ],
    exames_investigativos: [
      'Dosagem de Lactato sérico arterial ou venoso imediata',
      'Dois pares de Hemoculturas de sítios diferentes antes do antibiótico',
      'Gasometria arterial, Hemograma, Creatinina, Bilirrubinas e Coagulograma (cálculo SOFA)',
      'Radiografia de tórax e EAS com urocultura para identificação do foco',
    ],
    conduta_inicial:
      'EMERGÊNCIA MÉDICA: Ressuscitação volêmica guiada (30 mL/kg de Ringer Lactato ou SF 0,9% nas primeiras 3h se hipotensão ou lactato >= 4). Iniciar antimicrobiano de amplo espectro na 1ª hora (Golden Hour). Noradrenalina se PAM < 65 mmHg.',
    medicamentos_sugeridos: [
      {
        nome: 'Ceftriaxona 2g IV',
        posologia: 'Administrar 2g por via intravenosa imediatamente na primeira hora.',
        apresentacao: 'Frasco-ampola 1g pó para solução injetável',
        controlado: true,
      },
      {
        nome: 'Ringer Lactato 1000 mL IV',
        posologia: 'Infundir 30 mL/kg em acesso venoso calibroso nas primeiras 3 horas.',
        apresentacao: 'Bolsa plástica 1000 mL',
      },
    ],
    orientacoes_cuidados: [
      'Internação imediata em leito de Terapia Intensiva (UTI) ou Sala Vermelha.',
      'Sondagem vesical de demora para controle rigoroso de diurese horária (> 0,5 mL/kg/h).',
      'Monitorização contínua de PAM, ECG e oximetria.',
    ],
    contraindicacoes_absolutas: ['Não atrasar o início dos antimicrobianos para além de 1 hora.'],
  },
  {
    id_protocolo: 'has_hipertensao_arterial',
    doenca: 'Hipertensão Arterial Sistêmica & Crise Hipertensiva',
    cids: ['I10', 'I15'],
    sistema: 'Cardiologia',
    sintomas_cardinais: ['cefaleia_intensa'],
    outros_sintomas: ['palpitacoes', 'dor_precordial', 'fadiga'],
    sinais_alarme: [
      'Emergência Hipertensiva: PA >= 180x120 mmHg com Lesão Aguda de Órgão-Alvo (LOA)',
      'Encefalopatia hipertensiva, AVC agudo, SCA / Infarto, Dissecção de Aorta, Edema Agudo de Pulmão',
      'Se não há LOA, trata-se de Urgência Hipertensiva (manejo oral ambulatorial)',
    ],
    exames_investigativos: [
      'Mapeamento Ambulatorial da Pressão Arterial (MAPA) ou MRPA para confirmação diagnóstica',
      'Eletrocardiograma de 12 derivações (sobrecarga de VE)',
      'EAS (proteinúria/hematúria), Creatinina e Estimativa da TGF',
      'Glicemia de jejum, Perfil lipídico e Potássio sérico',
    ],
    conduta_inicial:
      'Hipertensão Estágio 1 com alto risco ou Estágio 2: terapia combinada de 1ª linha com IECA (ou BRA) + Bloqueador dos Canais de Cálcio (Amlodipino) ou Diurético Tiazídico (Clortalidona). Farmácia Popular cobre Losartana e Hidroclorotiazida gratuitamente.',
    medicamentos_sugeridos: [
      {
        nome: 'Losartana Potássica 50mg',
        posologia: 'Tomar 1 comprimido por via oral pela manhã, de uso contínuo.',
        apresentacao: '50mg comprimidos (Farmácia Popular Gratuito)',
      },
      {
        nome: 'Besilato de Anlodipino 5mg',
        posologia: 'Tomar 1 comprimido por via oral uma vez ao dia.',
        apresentacao: '5mg comprimidos',
      },
    ],
    orientacoes_cuidados: [
      'Reduzir ingestão de sódio para menos de 2g de sódio/dia (5g de sal de cozinha).',
      'Prática de 150 minutos semanais de atividade física aeróbica moderada.',
      'Cessação do tabagismo e controle do peso corporal.',
    ],
    contraindicacoes_absolutas: ['Evitar prescrição simultânea de IECA e BRA pelo risco grave de hipercalemia e IRA.'],
  },
  {
    id_protocolo: 'dm2_diabetes_mellitus',
    doenca: 'Diabetes Mellitus Tipo 2 Descompensado',
    cids: ['E11'],
    sistema: 'Endocrinologia',
    sintomas_cardinais: ['poliuria_polidipsia', 'perda_peso', 'fadiga'],
    outros_sintomas: ['nausea_vomito', 'confusao_mental'],
    sinais_alarme: [
      'Cetoacidose Diabética (CAD) ou Estado Hiperosmolar Hiperglicêmico (EHH)',
      'Glicemia capilar > 300 mg/dL com dor abdominal, hálito cetônico ou respiração de Kussmaul',
      'Desidratação grave e hipotensão com alteração do sensório',
    ],
    exames_investigativos: [
      'Glicemia de jejum e Hemoglobina Glicada (HbA1c)',
      'Gasometria arterial, Cetonemia/Cetonúria e Eletrólitos se suspeita de CAD',
      'Relação Albumina/Creatinina em amostra de urina (RAC) para rastreio de nefropatia',
      'Fundo de olho anual para rastreio de retinopatia diabética',
    ],
    conduta_inicial:
      'HbA1c < 9%: Metformina 850mg 2x/dia após refeições. Se doença cardiovascular ou DRC: associar iSGLT2 (Dapagliflozina) ou aGLP-1. Se glicemia > 300 ou sintomas catabólicos graves: insulinoterapia precoce.',
    medicamentos_sugeridos: [
      {
        nome: 'Cloridrato de Metformina 850mg',
        posologia: 'Tomar 1 comprimido após o almoço e 1 após o jantar, uso contínuo.',
        apresentacao: '850mg comprimidos (Farmácia Popular Gratuito)',
      },
      {
        nome: 'Dapagliflozina 10mg',
        posologia: 'Tomar 1 comprimido uma vez ao dia pela manhã.',
        apresentacao: '10mg comprimidos (Incorporado PCDT SUS)',
      },
    ],
    orientacoes_cuidados: [
      'Exame diário dos pés para prevenção do pé diabético.',
      'Acompanhamento nutricional com contagem de carboidratos.',
      'Diário glicêmico nos pacientes sob uso de insulina.',
    ],
    contraindicacoes_absolutas: ['Metformina contraindicada se TFG < 30 mL/min/1,73m² pelo risco de acidose lática.'],
  },
  {
    id_protocolo: 'asma_broncoespasmo_agudo',
    doenca: 'Asma Brônquica & Crise Aguda de Broncoespasmo',
    cids: ['J45'],
    sistema: 'Pneumologia',
    sintomas_cardinais: ['dispneia', 'sibilos', 'tosse_seca'],
    outros_sintomas: ['dor_pleuritica', 'fadiga'],
    sinais_alarme: [
      'Tórax silencioso à ausculta pulmonar (ausência de murmúrio vesicular por colapso expiratório grave)',
      'Incapacidade de completar frases com uma única respiração',
      'Uso evidente de musculatura acessória e batimento de asas nasais',
      'Pico de Fluxo Expiratório (PFE) < 50% do previsto',
      'Cianose central ou sonolência (iminência de parada respiratória)',
    ],
    exames_investigativos: [
      'Espirometria com prova broncodilatadora (fora da crise aguda)',
      'Medição do Pico de Fluxo Expiratório (Peak Flow)',
      'Radiografia de tórax para descartar pneumotórax ou pneumonia associada',
    ],
    conduta_inicial:
      'Crise aguda: Salbutamol spray 100mcg (4 a 8 jatos com espaçador a cada 20 min na 1ª hora) + Corticoide oral (Prednisona 40-50mg/dia por 5 dias). Manutenção: Corticoide Inalatório em dose baixa associado a Formoterol conforme GINA 2024.',
    medicamentos_sugeridos: [
      {
        nome: 'Sulfato de Salbutamol 100mcg Spray',
        posologia: 'Inalar 4 jatos via oral com espaçador a cada 20 minutos na primeira hora de crise.',
        apresentacao: 'Aerossol dosimetrado 200 doses (Farmácia Popular Gratuito)',
      },
      {
        nome: 'Prednisona 20mg',
        posologia: 'Tomar 2 comprimidos (40mg) pela manhã durante 5 dias. Não necessita desmame curto.',
        apresentacao: '20mg comprimidos',
      },
    ],
    orientacoes_cuidados: [
      'Higienizar o espaçador semanalmente com água e detergente neutro, secando ao ar.',
      'Enxaguar a cavidade oral com água após o uso de corticoides inalatórios para evitar candidíase oral.',
      'Plano de ação escrito entregue ao paciente com os passos de resgate.',
    ],
    contraindicacoes_absolutas: ['Betabloqueadores não seletivos (ex: Propranolol) são formalmente contraindicados.'],
  },
  {
    id_protocolo: 'insuficiencia_cardiaca_descompensada',
    doenca: 'Insuficiência Cardíaca Congestiva (Perfil Congestivo)',
    cids: ['I50'],
    sistema: 'Cardiologia',
    sintomas_cardinais: ['dispneia', 'edema_mmii', 'ortopneia', 'fadiga'],
    outros_sintomas: ['tosse_seca', 'nausea_vomito'],
    sinais_alarme: [
      'Edema Agudo de Pulmão (EAP): estertores crepitantes até ápices pulmonares com dispneia extrema',
      'Choque Cardiogênico (Perfil Frio e Úmido): extremidades frias, tempo de enchimento capilar alentecido',
      'Piora aguda da função renal e oligúria com congestão venosa sistêmica (Síndrome Cardiorrenal)',
    ],
    exames_investigativos: [
      'Ecocardiograma Transtorácico com cálculo da Fração de Ejeção do VE',
      'Dosagem de BNP ou NT-proBNP sérico',
      'Radiografia de tórax (congestão hilar em asa de borboleta, linhas B de Kerley, cardiomegalia)',
      'Eletrólitos séricos (Sódio, Potássio) e Ureia/Creatinina',
    ],
    conduta_inicial:
      'Quarteto Fantástico na ICFEr: (1) Sacubitril/Valsartana ou IECA/BRA + (2) Betabloqueador cardioseletivo (Carvedilol, Bisoprolol ou Succinato de Metoprolol) + (3) Espironolactona + (4) iSGLT2 (Dapagliflozina). Diurético de alça (Furosemida) titulado para alívio dos sintomas congestivos.',
    medicamentos_sugeridos: [
      {
        nome: 'Furosemida 40mg',
        posologia: 'Tomar 1 a 2 comprimidos pela manhã em jejum. Ajustar conforme controle do edema.',
        apresentacao: '40mg comprimidos',
      },
      {
        nome: 'Espironolactona 25mg',
        posologia: 'Tomar 1 comprimido uma vez ao dia pela manhã, de uso contínuo.',
        apresentacao: '25mg comprimidos',
      },
      {
        nome: 'Succinato de Metoprolol 25mg',
        posologia: 'Tomar 1 comprimido pela manhã de uso contínuo (iniciar apenas quando paciente euvolêmico).',
        apresentacao: '25mg comprimidos de liberação prolongada',
      },
    ],
    orientacoes_cuidados: [
      'Pesagem diária matinal após urinar. Ganho > 2 kg em 3 dias sinaliza retenção hídrica precoce.',
      'Restrição hidrossalina orientada.',
      'Evitar automedicação com anti-inflamatórios que anulam o efeito dos diuréticos.',
    ],
    contraindicacoes_absolutas: ['AINEs causam retenção volêmica grave e precipitam internações por descompensação da IC.'],
  },
  {
    id_protocolo: 'avc_isquemico_agudo',
    doenca: 'Acidente Vascular Cerebral Isquêmico (AVCi)',
    cids: ['I63', 'G45'],
    sistema: 'Neurologia',
    sintomas_cardinais: ['deficit_focal', 'desvio_rima', 'confusao_mental'],
    outros_sintomas: ['cefaleia_intensa', 'sincope'],
    sinais_alarme: [
      'Janela terapêutica estrita <= 4,5 horas do início dos sintomas para Trombólise Intravenosa com Alteplase',
      'Escala de Cincinnati / FAST positiva (Fraqueza em braço, Face caída, Fala arrastada)',
      'Rebaixamento agudo do nível de consciência (Glasgow < 8)',
    ],
    exames_investigativos: [
      'Tomografia Computadorizada de Crânio sem contraste imediata (descartar hemorragia)',
      'Glicemia capilar imediata (descartar hipoglicemia como stroke-mimic)',
      'Eletrocardiograma (pesquisa de Fibrilação Atrial paroxística)',
      'Angiotomografia de vasos intracranianos e cervicais se candidato a trombectomia mecânica',
    ],
    conduta_inicial:
      'EMERGÊNCIA ZERO: Encaminhamento imediato com Código AVC. Não baixar a pressão arterial a menos que PAS > 220 mmHg ou PAD > 120 mmHg (ou > 185x110 mmHg se for trombolisar). Manter cabeceira a 0° se tolerado.',
    medicamentos_sugeridos: [
      {
        nome: 'Ácido Acetilsalicílico (AAS) 100mg',
        posologia: 'Administrar 2 a 3 comprimidos (200-300mg) por via oral apenas após TC descartar hemorragia (e após 24h se trombolisado).',
        apresentacao: '100mg comprimidos',
      },
      {
        nome: 'Atorvastatina 80mg',
        posologia: 'Tomar 1 comprimido à noite de uso contínuo para estabilização de placa.',
        apresentacao: '80mg comprimidos',
      },
    ],
    orientacoes_cuidados: [
      'Notificar o hospital de referência enquanto a ambulância transporta o paciente.',
      'Manter jejum absoluto pelo risco iminente de broncoaspiração.',
      'Monitorar saturação mantendo O2 suplementar se SpO2 < 93%.',
    ],
    contraindicacoes_absolutas: ['Não administrar anticoagulantes ou antiagregantes antes da TC de crânio.'],
  },
  {
    id_protocolo: 'faringite_amigdalite_aguda',
    doenca: 'Faringoamigdalite Aguda Estreptocócica (Critérios de Centor)',
    cids: ['J02.0', 'J03.0'],
    sistema: 'Infectologia',
    sintomas_cardinais: ['odinofagia', 'febre'],
    outros_sintomas: ['cefaleia_intensa', 'mialgia'],
    sinais_alarme: [
      'Trismo / Dificuldade para abrir a boca (suspeita de Abscesso Periamigdaliano)',
      'Estridor laríngeo ou sialorreia / incapacidade de engolir a própria saliva',
      'Assimetria amigdaliana com desvio da úvula para o lado contralateral',
    ],
    exames_investigativos: [
      'Critérios de Centor Modificados: Febre > 38°C (+1), Exsudato amigdaliano (+1), Linfadenopatia cervical dolorosa (+1), Ausência de tosse (+1)',
      'Teste Rápido de Detecção de Antígeno Estreptocócico (TRG) se Centor >= 2',
      'Cultura de orofaringe em casos atípicos ou recorrentes',
    ],
    conduta_inicial:
      'Centor 0-1: Etiologia viral provável. Tratamento exclusivamente sintomático (Dipirona ou Paracetamol). Centor 3-4 ou TRG positivo: Penicilina G Benzatina 1.200.000 UI IM dose única (ou Amoxicilina 500mg 8/8h por 10 dias) para prevenção obrigatória de Febre Reumática.',
    medicamentos_sugeridos: [
      {
        nome: 'Penicilina G Benzatina 1.200.000 UI',
        posologia: 'Aplicar 1 ampola por via intramuscular profunda em dose única.',
        apresentacao: 'Frasco-ampola com pó para suspensão injetável (Antimicrobiano 2 vias)',
        controlado: true,
      },
      {
        nome: 'Dipirona 500mg',
        posologia: 'Tomar 1 a 2 comprimidos a cada 6 horas se dor de garganta intensa ou febre.',
        apresentacao: '500mg comprimidos',
      },
    ],
    orientacoes_cuidados: [
      'Gargarejos mornos com solução salina para alívio tópico da inflamação.',
      'Alimentação pastosa e fria/morna para facilitar a deglutição.',
      'Completar 10 dias se optar por amoxicilina via oral.',
    ],
    contraindicacoes_absolutas: ['Evitar antibióticos em quadros com tosse e coriza franca (etiologia viral).'],
  },
];

/**
 * Motor de correspondência determinística de sintomas
 */
export function investigarSintomas(sintomasSelecionados: string[]): {
  hipoteses: HipoteseDiagnostica[];
  sinaisAlarmeDetetados: string[];
  examesConsolidados: string[];
} {
  if (!sintomasSelecionados || sintomasSelecionados.length === 0) {
    return { hipoteses: [], sinaisAlarmeDetetados: [], examesConsolidados: [] };
  }

  const selecionadosSet = new Set(sintomasSelecionados);
  const resultados: HipoteseDiagnostica[] = [];
  const todosAlarmes: Set<string> = new Set();
  const todosExames: Set<string> = new Set();

  for (const hip of BASE_HIPOTESES_CLINICAS) {
    const todosSintomasDoenca = [...hip.sintomas_cardinais, ...hip.outros_sintomas];
    const presentes = todosSintomasDoenca.filter((s) => selecionadosSet.has(s));

    if (presentes.length === 0) continue;

    const ausentes = todosSintomasDoenca.filter((s) => !selecionadosSet.has(s));
    const cardinaisPresentes = hip.sintomas_cardinais.filter((s) => selecionadosSet.has(s));

    // Cálculo do Match Score Determinístico:
    // Peso dobrado para sintomas cardinais da doença
    const pesoTotal = hip.sintomas_cardinais.length * 2 + hip.outros_sintomas.length;
    const pesoObtido = cardinaisPresentes.length * 2 + (presentes.length - cardinaisPresentes.length);
    const scorePercentual = Math.min(100, Math.round((pesoObtido / pesoTotal) * 100));

    // Se houver pelo menos 1 sintoma cardinal ou 2 sintomas comuns
    if (cardinaisPresentes.length > 0 || presentes.length >= 2) {
      resultados.push({
        ...hip,
        score_match: scorePercentual,
        sintomas_presentes: presentes,
        sintomas_ausentes: ausentes,
        sinais_alarme_ativos: hip.sinais_alarme,
      });

      hip.sinais_alarme.forEach((a) => todosAlarmes.add(a));
      hip.exames_investigativos.forEach((e) => todosExames.add(e));
    }
  }

  // Ordena por maior pontuação determinística
  resultados.sort((a, b) => (b.score_match || 0) - (a.score_match || 0));

  return {
    hipoteses: resultados,
    sinaisAlarmeDetetados: Array.from(todosAlarmes),
    examesConsolidados: Array.from(todosExames),
  };
}
