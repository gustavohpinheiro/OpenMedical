export type CategoriaCalculadora =
  | 'todos'
  | 'favoritos'
  | 'sala_vermelha'
  | 'cardio'
  | 'pneumo_tev'
  | 'nefro_gaso'
  | 'neuro'
  | 'gastro_hepato'
  | 'cirurgia_aps';

export interface MetaCalculadora {
  id: string;
  nome: string;
  sigla: string;
  categoria: CategoriaCalculadora;
  descricao: string;
  tags: string[];
  pontesClinicas?: { id: string; rotulo: string }[];
}

export const CATEGORIAS_CALCULADORAS: { id: CategoriaCalculadora; rotulo: string; contagemOriginal: number }[] = [
  { id: 'todos', rotulo: 'Todos', contagemOriginal: 36 },
  { id: 'favoritos', rotulo: '★ Favoritos', contagemOriginal: 0 },
  { id: 'sala_vermelha', rotulo: 'Sala Vermelha & Choque', contagemOriginal: 7 },
  { id: 'cardio', rotulo: 'Cardiologia & Dor Torácica', contagemOriginal: 5 },
  { id: 'pneumo_tev', rotulo: 'Pneumo & TEV', contagemOriginal: 5 },
  { id: 'nefro_gaso', rotulo: 'Nefro & Gasometria', contagemOriginal: 6 },
  { id: 'neuro', rotulo: 'Neurologia Aguda & AVC', contagemOriginal: 3 },
  { id: 'gastro_hepato', rotulo: 'Gastro & Hepatologia', contagemOriginal: 5 },
  { id: 'cirurgia_aps', rotulo: 'Cirurgia, APS & Doses', contagemOriginal: 5 },
];

export const CATALOGO_CALCULADORAS: MetaCalculadora[] = [
  // 1. Sala Vermelha, Choque & Trauma (7)
  {
    id: 'sri',
    nome: 'Intubação em Sequência Rápida (ISR / SRI) & ARDSNet',
    sigla: 'ISR / SRI',
    categoria: 'sala_vermelha',
    descricao: 'Doses em mL (etomidato, cetamina, suxametônio, rocurônio), 7 Ps e volume corrente protetor.',
    tags: ['intubacao', 'sri', 'isr', '7ps', 'sedacao', 'bloqueador', 'ardsnet', 'ventilacao', 'choque', 'craniotce'],
    pontesClinicas: [
      { id: 'infusao', rotulo: 'Bombas de Infusão DVA' },
      { id: 'gasometria', rotulo: 'Gasometria Arterial' },
      { id: 'glasgow_p', rotulo: 'Escala de Glasgow-P' },
    ],
  },
  {
    id: 'infusao',
    nome: 'Bombas de Infusão e Dose Reversa (10 Drogas UTI)',
    sigla: 'Bombas DVA',
    categoria: 'sala_vermelha',
    descricao: 'Vazão em mL/h e titulação reversa para Nora, Adrena, Dobuta, Dopamina, Nipride, Tridil e sedações.',
    tags: ['dva', 'noradrenalina', 'adrenalina', 'dobutamina', 'propofol', 'fentanil', 'vasoativas', 'infusao', 'bic'],
    pontesClinicas: [
      { id: 'pam_ppc', rotulo: 'Monitorizar PAM & PPC' },
      { id: 'sri', rotulo: 'Intubação ISR' },
    ],
  },
  {
    id: 'pals',
    nome: 'Emergência Pediátrica PALS (Tubo, Choque, Drogas)',
    sigla: 'PALS Pediátrico',
    categoria: 'sala_vermelha',
    descricao: 'Tamanho de tubo endotraqueal com/sem cuff, carga de desfibrilação, adrenalina e expansão volêmica.',
    tags: ['pediatria', 'pals', 'tubo', 'adrenalina', 'choque', 'desfibrilacao', 'ressuscitacao'],
    pontesClinicas: [
      { id: 'dengue_ms', rotulo: 'Hidratação Dengue Pediátrica' },
      { id: 'centor', rotulo: 'Centor/McIsaac Faringite' },
    ],
  },
  {
    id: 'dengue_ms',
    nome: 'Estadiamento e Hidratação da Dengue (MS Grupos A-D)',
    sigla: 'Dengue MS',
    categoria: 'sala_vermelha',
    descricao: 'Classificação oficial do Ministério da Saúde 6ª Ed. Doses orais e expansão parenteral imediata.',
    tags: ['dengue', 'hidratacao', 'alarme', 'choque', 'prova do laco', 'plaquetas', 'ministerio da saude'],
    pontesClinicas: [
      { id: 'parkland', rotulo: 'Fórmula de Parkland' },
      { id: 'pam_ppc', rotulo: 'Monitorização Hemodinâmica PAM' },
    ],
  },
  {
    id: 'parkland',
    nome: 'Fórmula de Parkland & ATLS 10ª (Grande Queimado)',
    sigla: 'Parkland / ATLS',
    categoria: 'sala_vermelha',
    descricao: 'Ressuscitação volêmica nas primeiras 8h e 16h em Ringer Lactato aquecido com meta de diurese.',
    tags: ['queimado', 'parkland', 'scq', 'ringer', 'atls', 'hidratacao', 'trauma'],
    pontesClinicas: [
      { id: 'dengue_ms', rotulo: 'Dengue MS' },
      { id: 'antropometria', rotulo: 'Superfície Corporal Mosteller' },
    ],
  },
  {
    id: 'pam_ppc',
    nome: 'PAM (Pressão Arterial Média) & PPC (Perfusão Cerebral)',
    sigla: 'PAM & PPC',
    categoria: 'sala_vermelha',
    descricao: 'Cálculo da PAM e da pressão de perfusão cerebral frente à PIC, com alvos para sepse e TCE.',
    tags: ['pam', 'ppc', 'pic', 'pressao', 'neuromonitorizacao', 'hemodinamica'],
    pontesClinicas: [
      { id: 'infusao', rotulo: 'Titular Noradrenalina' },
      { id: 'glasgow_p', rotulo: 'Avaliar Glasgow Pupilar' },
    ],
  },
  {
    id: 'sofa_sirs',
    nome: 'SOFA Completo (UTI) & Critérios SIRS',
    sigla: 'SOFA / SIRS',
    categoria: 'sala_vermelha',
    descricao: 'Escore SOFA nos 6 sistemas orgânicos, mortalidade de UTI e checagem de critérios de SIRS.',
    tags: ['sofa', 'sirs', 'sepse', 'uti', 'disfuncao', 'plaquetas', 'bilirrubina', 'noradrenalina'],
    pontesClinicas: [
      { id: 'gasometria', rotulo: 'Gasometria PaO2/FiO2' },
      { id: 'fena_feureia', rotulo: 'Disfunção Renal (FENa/FEUreia)' },
    ],
  },

  // 2. Cardiologia & Dor Torácica (5)
  {
    id: 'heart_score',
    nome: 'HEART Score (Dor Torácica no Pronto-Socorro)',
    sigla: 'HEART Score',
    categoria: 'cardio',
    descricao: 'Estratificação de dor torácica aguda em Baixo (alta), Intermediário e Alto risco para MACE em 6 semanas.',
    tags: ['heart', 'dor toracica', 'coronaria', 'troponina', 'ecg', 'mace', 'sca'],
    pontesClinicas: [
      { id: 'has_bled', rotulo: 'Risco Hemorrágico HAS-BLED' },
      { id: 'cha2ds2_va', rotulo: 'CHA2DS2-VA (FA)' },
    ],
  },
  {
    id: 'cha2ds2_va',
    nome: 'CHA2DS2-VA (ESC 2024 - Risco AVC na Fibrilação Atrial)',
    sigla: 'CHA2DS2-VA',
    categoria: 'cardio',
    descricao: 'Diretriz ESC 2024 (sem pontuação por sexo biológico isolado) para indicação de DOACs ou Warfarina.',
    tags: ['cha2ds2', 'fibrilacao', 'fa', 'anticoagulacao', 'avc', 'esc 2024'],
    pontesClinicas: [
      { id: 'has_bled', rotulo: 'Calcular Risco de Sangramento HAS-BLED' },
      { id: 'ckd_epi', rotulo: 'Checar Função Renal para DOACs' },
    ],
  },
  {
    id: 'has_bled',
    nome: 'HAS-BLED (Risco de Sangramento na Anticoagulação)',
    sigla: 'HAS-BLED',
    categoria: 'cardio',
    descricao: 'Risco de hemorragia maior na anticoagulação de pacientes com FA e fatores modificáveis.',
    tags: ['hasbled', 'sangramento', 'anticoagulacao', 'fa', 'hemorragia'],
    pontesClinicas: [
      { id: 'cha2ds2_va', rotulo: 'Comparar com CHA2DS2-VA' },
      { id: 'glasgow_blatchford', rotulo: 'HDA (Glasgow-Blatchford)' },
    ],
  },
  {
    id: 'qtc_corrigido',
    nome: 'QTc Corrigido (Bazett, Fridericia e Framingham)',
    sigla: 'QTc Corrigido',
    categoria: 'cardio',
    descricao: 'Correção precisa do intervalo QT para FC com alerta semafórico para risco de Torsades de Pointes.',
    tags: ['qtc', 'bazett', 'fridericia', 'framingham', 'torsades', 'arritmia', 'ecg'],
    pontesClinicas: [
      { id: 'tisdale', rotulo: 'Escore de Risco Tisdale' },
      { id: 'cad_calemia', rotulo: 'Checar Potássio e Cálcio' },
    ],
  },
  {
    id: 'tisdale',
    nome: 'Escore de Tisdale (Risco de Alargamento do QTc)',
    sigla: 'Tisdale',
    categoria: 'cardio',
    descricao: 'Escore preditivo para pacientes internados em uso de medicamentos depressores da repolarização.',
    tags: ['tisdale', 'qtc', 'farmacos', 'antimicrobianos', 'psicotropicos'],
    pontesClinicas: [
      { id: 'qtc_corrigido', rotulo: 'Calcular QTc Corrigido' },
    ],
  },

  // 3. Pneumologia & TEV (5)
  {
    id: 'wells_tep',
    nome: 'Wells para TEP (Tromboembolismo Pulmonar)',
    sigla: 'Wells TEP',
    categoria: 'pneumo_tev',
    descricao: 'Probabilidade pré-teste de embolia pulmonar: baixa, intermediária ou alta probabilidade.',
    tags: ['wells', 'tep', 'embolia', 'ddimero', 'angiotc', 'taquicardia'],
    pontesClinicas: [
      { id: 'perc', rotulo: 'Aplicar Critérios PERC (Descarte)' },
      { id: 'wells_tvp', rotulo: 'Avaliar Wells para TVP' },
    ],
  },
  {
    id: 'perc',
    nome: 'Critérios PERC (Descarte de TEP sem Exames)',
    sigla: 'PERC Rule',
    categoria: 'pneumo_tev',
    descricao: 'Descarte seguro de TEP sem necessidade de D-dímero ou Angio-TC em pacientes de baixo risco.',
    tags: ['perc', 'tep', 'descarte', 'baixo risco', 'regra de exclusao'],
    pontesClinicas: [
      { id: 'wells_tep', rotulo: 'Voltar para Wells TEP' },
    ],
  },
  {
    id: 'wells_tvp',
    nome: 'Escore de Wells para TVP (Trombose Venosa Profunda)',
    sigla: 'Wells TVP',
    categoria: 'pneumo_tev',
    descricao: 'Estratificação clínica de risco de trombose venosa profunda em membros inferiores.',
    tags: ['wells', 'tvp', 'trombose', 'edema', 'panturrilha', 'doppler'],
    pontesClinicas: [
      { id: 'wells_tep', rotulo: 'Avaliar Risco de TEP' },
      { id: 'padua_tev', rotulo: 'Escore de Pádua (Profilaxia)' },
    ],
  },
  {
    id: 'padua_tev',
    nome: 'Escore de Pádua (Profilaxia de TEV em Paciente Clínico)',
    sigla: 'Escore Pádua',
    categoria: 'pneumo_tev',
    descricao: 'Indicação de tromboprofilaxia farmacológica (Enoxaparina 40 mg SC/dia) na enfermaria clínica.',
    tags: ['padua', 'tev', 'tromboprofilaxia', 'enoxaparina', 'enfermaria', 'imobilizado'],
    pontesClinicas: [
      { id: 'wells_tvp', rotulo: 'Wells para TVP' },
      { id: 'ckd_epi', rotulo: 'Ajuste Renal de Enoxaparina' },
    ],
  },
  {
    id: 'curb65',
    nome: 'CURB-65 (Gravidade na Pneumonia Adquirida)',
    sigla: 'CURB-65',
    categoria: 'pneumo_tev',
    descricao: 'Estratificação de mortalidade na PAC para definição de ambulatório vs enfermaria vs UTI.',
    tags: ['curb65', 'pneumonia', 'pac', 'internacao', 'uti', 'infeccao respiratoria'],
    pontesClinicas: [
      { id: 'gasometria', rotulo: 'Gasometria PaO2/FiO2' },
      { id: 'sofa_sirs', rotulo: 'SOFA Completo' },
    ],
  },

  // 4. Nefrologia, Gasometria & Metabólico (6)
  {
    id: 'gasometria',
    nome: 'Gasometria Arterial Completa + Figge + Winters',
    sigla: 'Gasometria',
    categoria: 'nefro_gaso',
    descricao: 'Análise tripla de distúrbio ácido-base: Anion Gap corrigido pela albumina, fórmula de Winters e PaO2/FiO2.',
    tags: ['gasometria', 'ph', 'paco2', 'hco3', 'anion gap', 'winters', 'acidose', 'alcalose', 'pafo2'],
    pontesClinicas: [
      { id: 'cad_calemia', rotulo: 'Cetoacidose Diabética (CAD)' },
      { id: 'correcao_sodio', rotulo: 'Correção de Sódio' },
    ],
  },
  {
    id: 'correcao_sodio',
    nome: 'Correção de Sódio (Adrogué-Madias)',
    sigla: 'Correção Na+',
    categoria: 'nefro_gaso',
    descricao: 'Variação estimada por litro de infusão (NaCl 3%, SF 0.9%) e cálculo de vazão em BIC para evitar mielinólise.',
    tags: ['sodio', 'hiponatremia', 'adrogue', 'madias', 'nacl 3%', 'desmielinizacao'],
    pontesClinicas: [
      { id: 'cad_calemia', rotulo: 'Sódio Corrigido pela Glicemia' },
    ],
  },
  {
    id: 'cad_calemia',
    nome: 'CAD / EHH: Sódio Corrigido, Osmolaridade & Potássio',
    sigla: 'CAD & Calemia',
    categoria: 'nefro_gaso',
    descricao: 'Sódio corrigido por Katz e Hillier, Osmolaridade Efetiva, Cálcio de Payne e protocolo ADA de K+ e Insulina.',
    tags: ['cad', 'ehh', 'katz', 'hillier', 'osmolaridade', 'calcio', 'potassio', 'cetoacidose'],
    pontesClinicas: [
      { id: 'gasometria', rotulo: 'Gasometria com Anion Gap' },
      { id: 'correcao_sodio', rotulo: 'Correção de Sódio' },
    ],
  },
  {
    id: 'fena_feureia',
    nome: 'FENa & FEUreia (IRA Pré-Renal vs NTA)',
    sigla: 'FENa / FEUreia',
    categoria: 'nefro_gaso',
    descricao: 'Diferenciação precisa de Injúria Renal Aguda funcional vs parenquimatosa com ressalva para diuréticos.',
    tags: ['fena', 'feureia', 'ira', 'pre-renal', 'nta', 'diuretico', 'nefrologia'],
    pontesClinicas: [
      { id: 'ckd_epi', rotulo: 'TFG CKD-EPI 2021' },
      { id: 'cockcroft', rotulo: 'Clearance Cockcroft-Gault' },
    ],
  },
  {
    id: 'ckd_epi',
    nome: 'TFG CKD-EPI 2021 (Doença Renal Crônica)',
    sigla: 'CKD-EPI 2021',
    categoria: 'nefro_gaso',
    descricao: 'Equação de 2021 livre de raça para estadiamento da DRC (KDIGO G1 a G5).',
    tags: ['ckd-epi', 'tfg', 'clearance', 'drc', 'creatinina', 'estagio renal'],
    pontesClinicas: [
      { id: 'cockcroft', rotulo: 'Cockcroft-Gault (Bula)' },
      { id: 'fena_feureia', rotulo: 'Avaliar FENa/FEUreia' },
    ],
  },
  {
    id: 'cockcroft',
    nome: 'Clearance de Creatinina Cockcroft-Gault',
    sigla: 'Cockcroft-Gault',
    categoria: 'nefro_gaso',
    descricao: 'Clearance de creatinina estimado (mL/min) tradicionalmente exigido em faixas de ajuste posológico de bula.',
    tags: ['cockcroft', 'gault', 'clearance', 'ajuste posologico', 'bula'],
    pontesClinicas: [
      { id: 'ckd_epi', rotulo: 'Comparar com CKD-EPI 2021' },
      { id: 'antropometria', rotulo: 'Peso Ideal Devine' },
    ],
  },

  // 5. Neurologia Aguda & AVC (3)
  {
    id: 'glasgow_p',
    nome: 'Glasgow com Reatividade Pupilar (GCS-P)',
    sigla: 'GCS-P (Glasgow)',
    categoria: 'neuro',
    descricao: 'Escala de Coma de Glasgow atualizada com escore de reatividade pupilar e gatilho de via aérea.',
    tags: ['glasgow', 'gcs', 'pupilas', 'tce', 'coma', 'intubacao', 'neurologia'],
    pontesClinicas: [
      { id: 'sri', rotulo: 'Intubação em Sequência Rápida (se ≤ 8)' },
      { id: 'cranio_cervical', rotulo: 'Indicação de TC de Crânio' },
      { id: 'trombolise_avc', rotulo: 'Protocolo de AVC Agudo' },
    ],
  },
  {
    id: 'trombolise_avc',
    nome: 'Trombólise AVC Agudo (Alteplase & Tenecteplase)',
    sigla: 'Trombólise AVC',
    categoria: 'neuro',
    descricao: 'Cálculo de bolus e infusão de r-tPA (Alteplase) e Tenecteplase, metas de PA e checklist de segurança.',
    tags: ['avc', 'avci', 'alteplase', 'rtpa', 'tenecteplase', 'tnk', 'delta t', 'trombolise'],
    pontesClinicas: [
      { id: 'glasgow_p', rotulo: 'Avaliar Glasgow GCS-P' },
      { id: 'pam_ppc', rotulo: 'Metas Pressóricas PAM' },
    ],
  },
  {
    id: 'cranio_cervical',
    nome: 'Canadian CT Head Rule & NEXUS Coluna Cervical',
    sigla: 'Canadian & NEXUS',
    categoria: 'neuro',
    descricao: 'Diretrizes validadas para dispensar com segurança tomografia de crânio e radiografia de coluna cervical.',
    tags: ['canadian', 'head ct', 'nexus', 'coluna cervical', 'tce leve', 'tomografia'],
    pontesClinicas: [
      { id: 'glasgow_p', rotulo: 'Calcular Glasgow GCS-P' },
    ],
  },

  // 6. Gastro & Hepatologia (5)
  {
    id: 'glasgow_blatchford',
    nome: 'Glasgow-Blatchford (Hemorragia Digestiva Alta)',
    sigla: 'Glasgow-Blatchford',
    categoria: 'gastro_hepato',
    descricao: 'Identificação de pacientes de muito baixo risco (escore 0) candidatos a manejo ambulatorial seguro.',
    tags: ['blatchford', 'hda', 'hemorragia digestiva', 'endoscopia', 'eda', 'sangramento'],
    pontesClinicas: [
      { id: 'has_bled', rotulo: 'Risco Hemorrágico HAS-BLED' },
      { id: 'meld_na', rotulo: 'Escore Hepático MELD-Na' },
    ],
  },
  {
    id: 'meld_na',
    nome: 'MELD-Na (Doença Hepática Terminal & Transplante)',
    sigla: 'MELD-Na',
    categoria: 'gastro_hepato',
    descricao: 'Escore de priorização em lista de transplante hepático e mortalidade estimada em 90 dias.',
    tags: ['meld', 'meld-na', 'cirrose', 'transplante', 'bilirrubina', 'inr', 'creatinina', 'sodio'],
    pontesClinicas: [
      { id: 'child_pugh', rotulo: 'Classificação de Child-Pugh' },
      { id: 'fib4', rotulo: 'Rastreio FIB-4' },
    ],
  },
  {
    id: 'child_pugh',
    nome: 'Classificação de Child-Pugh-Turcotte (Cirrose Hepática)',
    sigla: 'Child-Pugh',
    categoria: 'gastro_hepato',
    descricao: 'Estratificação da gravidade funcional da cirrose (Classes A, B e C) e risco cirúrgico abdominal.',
    tags: ['child-pugh', 'cirrose', 'ascite', 'encefalopatia', 'inr', 'albumina', 'bilirrubina'],
    pontesClinicas: [
      { id: 'meld_na', rotulo: 'Escore MELD-Na' },
      { id: 'glasgow_blatchford', rotulo: 'Hemorragia HDA' },
    ],
  },
  {
    id: 'bisap',
    nome: 'Escore BISAP (Pancreatite Aguda Precoce)',
    sigla: 'BISAP Pancreatite',
    categoria: 'gastro_hepato',
    descricao: 'Previsão precoce de pancreatite grave e falência orgânica nas primeiras 24 horas de admissão.',
    tags: ['bisap', 'pancreatite', 'ureia', 'pleural', 'sirs', 'mortalidade pancreatica'],
    pontesClinicas: [
      { id: 'sofa_sirs', rotulo: 'Critérios de SIRS & SOFA' },
      { id: 'alvarado', rotulo: 'Diagnóstico Diferencial: Alvarado' },
    ],
  },
  {
    id: 'fib4',
    nome: 'FIB-4 (Rastreio de Fibrose Hepática)',
    sigla: 'FIB-4',
    categoria: 'gastro_hepato',
    descricao: 'Índice ambulatorial não-invasivo de fibrose avançada em esteatose hepática (MASLD) e hepatites virais.',
    tags: ['fib4', 'fibrose', 'esteatose', 'mash', 'nash', 'hepatite', 'ast', 'alt', 'plaquetas'],
    pontesClinicas: [
      { id: 'meld_na', rotulo: 'Avaliar MELD-Na se Descompensado' },
    ],
  },

  // 7. Cirurgia, APS & Farmacometria (5)
  {
    id: 'alvarado',
    nome: 'Escore de Alvarado / MANTRELS (Apendicite Aguda)',
    sigla: 'Alvarado (MANTRELS)',
    categoria: 'cirurgia_aps',
    descricao: 'Escore clínico para probabilidade de apendicite aguda e indicação de imagem ou cirurgia imediata.',
    tags: ['alvarado', 'mantrels', 'apendicite', 'dor fosa iliaca', 'descompressao', 'cirurgia'],
    pontesClinicas: [
      { id: 'bisap', rotulo: 'BISAP Pancreatite' },
    ],
  },
  {
    id: 'corticoides',
    nome: 'Conversor de Corticoides & Esquema de Desmame',
    sigla: 'Corticoides',
    categoria: 'cirurgia_aps',
    descricao: 'Equivalência anti-inflamatória exata entre prednisona, dexametasona, hidrocortisona e protocolo de desmame.',
    tags: ['corticoide', 'prednisona', 'dexametasona', 'hidrocortisona', 'metilprednisolona', 'desmame'],
    pontesClinicas: [
      { id: 'antropometria', rotulo: 'Antropometria e Doses' },
    ],
  },
  {
    id: 'antropometria',
    nome: 'Antropometria Farmacológica (Devine, Obesos, SC, IMC)',
    sigla: 'Antropometria',
    categoria: 'cirurgia_aps',
    descricao: 'Peso ideal por Devine, peso corrigido para obesos (ABW), IMC e área de superfície corporal (Mosteller).',
    tags: ['devine', 'peso ideal', 'peso ajustado', 'obesidade', 'mosteller', 'superficie corporal', 'imc'],
    pontesClinicas: [
      { id: 'sri', rotulo: 'Doses da ISR por Peso Ideal' },
      { id: 'parkland', rotulo: 'Parkland Queimados' },
    ],
  },
  {
    id: 'centor',
    nome: 'Centor Modificado por McIsaac (Faringite Estrepto)',
    sigla: 'Centor / McIsaac',
    categoria: 'cirurgia_aps',
    descricao: 'Predição de etiologia estreptocócica do grupo A em faringoamigdalite aguda e uso racional de antimicrobianos.',
    tags: ['centor', 'mcisaac', 'faringite', 'amigdalite', 'streptococcus', 'antibiotico', 'pediatria'],
    pontesClinicas: [
      { id: 'pals', rotulo: 'Emergência Pediátrica PALS' },
    ],
  },
  {
    id: 'idade_gestacional',
    nome: 'Idade Gestacional & DPP (Regra de Naegele)',
    sigla: 'Obstetrícia / DPP',
    categoria: 'cirurgia_aps',
    descricao: 'Data provável do parto pela Regra de Naegele, idade gestacional em semanas/dias e exames de rotina por trimestre.',
    tags: ['idade gestacional', 'dum', 'dpp', 'naegele', 'obstetricia', 'pre-natal', 'gestacao'],
    pontesClinicas: [
      { id: 'dengue_ms', rotulo: 'Manejo de Dengue na Gestante' },
    ],
  },
];
