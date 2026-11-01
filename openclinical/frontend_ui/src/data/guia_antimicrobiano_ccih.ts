export interface ItemMatrizAntimicrobiano {
  antibiotico: string;
  classe: string;
  posologia_padrao: string;
  ajuste_renal: string;
  mssa: 'Excelente (1ª linha)' | 'Ativo (Alternativa)' | 'Resistente / Inativo';
  mrsa: 'Excelente (1ª linha)' | 'Ativo (Alternativa)' | 'Resistente / Inativo';
  s_pneumoniae: 'Excelente (1ª linha)' | 'Ativo (Alternativa)' | 'Resistente / Inativo';
  e_faecalis: 'Excelente (1ª linha)' | 'Ativo (Alternativa)' | 'Resistente / Inativo';
  gram_negativos: 'Excelente (1ª linha)' | 'Ativo (Alternativa)' | 'Resistente / Inativo';
  pseudomonas: 'Excelente (1ª linha)' | 'Ativo (Alternativa)' | 'Resistente / Inativo';
  esbl: 'Excelente (1ª linha)' | 'Ativo (Alternativa)' | 'Resistente / Inativo';
  anaerobios: 'Excelente (1ª linha)' | 'Ativo (Alternativa)' | 'Resistente / Inativo';
  atipicos: 'Excelente (1ª linha)' | 'Ativo (Alternativa)' | 'Resistente / Inativo';
}

export const MATRIZ_ANTIMICROBIANOS: ItemMatrizAntimicrobiano[] = [
  {
    antibiotico: 'Amoxicilina + Clavulanato',
    classe: 'Penicilina + Inibidor de Beta-lactamase',
    posologia_padrao: '875/125 mg VO 12/12h ou 1g/200mg IV 8/8h',
    ajuste_renal: 'TFG < 30: 500/125 mg VO 12/12h; TFG < 10: 24/24h',
    mssa: 'Excelente (1ª linha)',
    mrsa: 'Resistente / Inativo',
    s_pneumoniae: 'Excelente (1ª linha)',
    e_faecalis: 'Excelente (1ª linha)',
    gram_negativos: 'Ativo (Alternativa)',
    pseudomonas: 'Resistente / Inativo',
    esbl: 'Resistente / Inativo',
    anaerobios: 'Excelente (1ª linha)',
    atipicos: 'Resistente / Inativo',
  },
  {
    antibiotico: 'Oxacilina',
    classe: 'Penicilina Antiestafilocócica',
    posologia_padrao: '2g IV 4/4h (em infusão contínua ou intermitente)',
    ajuste_renal: 'Não requer ajuste de dose na disfunção renal',
    mssa: 'Excelente (1ª linha)',
    mrsa: 'Resistente / Inativo',
    s_pneumoniae: 'Ativo (Alternativa)',
    e_faecalis: 'Resistente / Inativo',
    gram_negativos: 'Resistente / Inativo',
    pseudomonas: 'Resistente / Inativo',
    esbl: 'Resistente / Inativo',
    anaerobios: 'Resistente / Inativo',
    atipicos: 'Resistente / Inativo',
  },
  {
    antibiotico: 'Ceftriaxona',
    classe: 'Cefalosporina de 3ª Geração',
    posologia_padrao: '1g a 2g IV 24/24h (2g 12/12h em meningite)',
    ajuste_renal: 'Não requer ajuste renal isolado (eliminação biliar/renal)',
    mssa: 'Ativo (Alternativa)',
    mrsa: 'Resistente / Inativo',
    s_pneumoniae: 'Excelente (1ª linha)',
    e_faecalis: 'Resistente / Inativo',
    gram_negativos: 'Excelente (1ª linha)',
    pseudomonas: 'Resistente / Inativo',
    esbl: 'Resistente / Inativo',
    anaerobios: 'Resistente / Inativo',
    atipicos: 'Resistente / Inativo',
  },
  {
    antibiotico: 'Cefepima',
    classe: 'Cefalosporina de 4ª Geração Antipseudomonas',
    posologia_padrao: '2g IV 8/8h em infusão estendida (3 a 4h)',
    ajuste_renal: 'Ajuste obrigatório pelo risco de neurotoxicidade/coma (TFG < 50: 2g 12/12h; < 30: 2g 24/24h)',
    mssa: 'Excelente (1ª linha)',
    mrsa: 'Resistente / Inativo',
    s_pneumoniae: 'Excelente (1ª linha)',
    e_faecalis: 'Resistente / Inativo',
    gram_negativos: 'Excelente (1ª linha)',
    pseudomonas: 'Excelente (1ª linha)',
    esbl: 'Resistente / Inativo',
    anaerobios: 'Resistente / Inativo',
    atipicos: 'Resistente / Inativo',
  },
  {
    antibiotico: 'Piperacilina + Tazobactam',
    classe: 'Ureidopenicilina + Inibidor de Beta-lactamase',
    posologia_padrao: '4,5g IV 6/6h (ou 4,5g 8/8h em infusão estendida 4h)',
    ajuste_renal: 'TFG 20-50: 3,375g 6/6h; TFG < 20: 2,25g 6/6h',
    mssa: 'Excelente (1ª linha)',
    mrsa: 'Resistente / Inativo',
    s_pneumoniae: 'Excelente (1ª linha)',
    e_faecalis: 'Excelente (1ª linha)',
    gram_negativos: 'Excelente (1ª linha)',
    pseudomonas: 'Excelente (1ª linha)',
    esbl: 'Ativo (Alternativa)',
    anaerobios: 'Excelente (1ª linha)',
    atipicos: 'Resistente / Inativo',
  },
  {
    antibiotico: 'Meropenem',
    classe: 'Carbapenêmico',
    posologia_padrao: '1g IV 8/8h em infusão de 3h (2g 8/8h em meningite)',
    ajuste_renal: 'TFG 26-50: 1g 12/12h; TFG 10-25: 500mg 12/12h; TFG < 10: 500mg 24/24h',
    mssa: 'Excelente (1ª linha)',
    mrsa: 'Resistente / Inativo',
    s_pneumoniae: 'Excelente (1ª linha)',
    e_faecalis: 'Resistente / Inativo',
    gram_negativos: 'Excelente (1ª linha)',
    pseudomonas: 'Excelente (1ª linha)',
    esbl: 'Excelente (1ª linha)',
    anaerobios: 'Excelente (1ª linha)',
    atipicos: 'Resistente / Inativo',
  },
  {
    antibiotico: 'Vancomicina',
    classe: 'Glicopeptídeo',
    posologia_padrao: 'Ataque 25-30 mg/kg; manutenção 15-20 mg/kg IV 8/12h (Alvo Vancocemia: 15-20 mcg/mL)',
    ajuste_renal: 'Ajuste estrito por vancocemia de vale e TFG para prevenir IRA',
    mssa: 'Ativo (Alternativa)',
    mrsa: 'Excelente (1ª linha)',
    s_pneumoniae: 'Excelente (1ª linha)',
    e_faecalis: 'Excelente (1ª linha)',
    gram_negativos: 'Resistente / Inativo',
    pseudomonas: 'Resistente / Inativo',
    esbl: 'Resistente / Inativo',
    anaerobios: 'Ativo (Alternativa)',
    atipicos: 'Resistente / Inativo',
  },
  {
    antibiotico: 'Linezolida',
    classe: 'Oxazolidinona',
    posologia_padrao: '600 mg IV ou VO 12/12h (biodisponibilidade oral ~100%)',
    ajuste_renal: 'Não requer ajuste de dose renal. Monitorar plaquetas após 10-14 dias.',
    mssa: 'Excelente (1ª linha)',
    mrsa: 'Excelente (1ª linha)',
    s_pneumoniae: 'Excelente (1ª linha)',
    e_faecalis: 'Excelente (1ª linha)',
    gram_negativos: 'Resistente / Inativo',
    pseudomonas: 'Resistente / Inativo',
    esbl: 'Resistente / Inativo',
    anaerobios: 'Ativo (Alternativa)',
    atipicos: 'Resistente / Inativo',
  },
  {
    antibiotico: 'Levofloxacino',
    classe: 'Fluoroquinolona Respiratória',
    posologia_padrao: '500 mg a 750 mg IV ou VO 24/24h',
    ajuste_renal: 'TFG 20-50: 500mg ataque, depois 250mg 24/24h; TFG < 20: 500mg ataque, depois 250mg 48/48h',
    mssa: 'Ativo (Alternativa)',
    mrsa: 'Resistente / Inativo',
    s_pneumoniae: 'Excelente (1ª linha)',
    e_faecalis: 'Resistente / Inativo',
    gram_negativos: 'Excelente (1ª linha)',
    pseudomonas: 'Ativo (Alternativa)',
    esbl: 'Resistente / Inativo',
    anaerobios: 'Resistente / Inativo',
    atipicos: 'Excelente (1ª linha)',
  },
  {
    antibiotico: 'Metronidazol',
    classe: 'Nitroimidazol Antianaeróbio',
    posologia_padrao: '400 mg VO 8/8h ou 500 mg IV 8/8h',
    ajuste_renal: 'Não requer ajuste renal. Reduzir em 50% na insuficiência hepática grave.',
    mssa: 'Resistente / Inativo',
    mrsa: 'Resistente / Inativo',
    s_pneumoniae: 'Resistente / Inativo',
    e_faecalis: 'Resistente / Inativo',
    gram_negativos: 'Resistente / Inativo',
    pseudomonas: 'Resistente / Inativo',
    esbl: 'Resistente / Inativo',
    anaerobios: 'Excelente (1ª linha)',
    atipicos: 'Resistente / Inativo',
  },
  {
    antibiotico: 'Sulfametoxazol + Trimetoprima',
    classe: 'Inibidor do Folato / Sulfonamida',
    posologia_padrao: '800/160 mg VO 12/12h (alta dose 15-20 mg/kg/dia para P. jirovecii)',
    ajuste_renal: 'TFG 15-30: 50% da dose; TFG < 15: não recomendado (risco de hipercalemia e IRA)',
    mssa: 'Excelente (1ª linha)',
    mrsa: 'Ativo (Alternativa)',
    s_pneumoniae: 'Ativo (Alternativa)',
    e_faecalis: 'Resistente / Inativo',
    gram_negativos: 'Excelente (1ª linha)',
    pseudomonas: 'Resistente / Inativo',
    esbl: 'Resistente / Inativo',
    anaerobios: 'Resistente / Inativo',
    atipicos: 'Resistente / Inativo',
  },
  {
    antibiotico: 'Azitromicina',
    classe: 'Macrolídeo',
    posologia_padrao: '500 mg VO ou IV 24/24h por 3 a 5 dias',
    ajuste_renal: 'Não requer ajuste renal. Atenção para prolongamento do intervalo QTc.',
    mssa: 'Resistente / Inativo',
    mrsa: 'Resistente / Inativo',
    s_pneumoniae: 'Ativo (Alternativa)',
    e_faecalis: 'Resistente / Inativo',
    gram_negativos: 'Resistente / Inativo',
    pseudomonas: 'Resistente / Inativo',
    esbl: 'Resistente / Inativo',
    anaerobios: 'Resistente / Inativo',
    atipicos: 'Excelente (1ª linha)',
  },
  {
    antibiotico: 'Amicacina',
    classe: 'Aminoglicosídeo',
    posologia_padrao: '15 a 20 mg/kg IV em dose única diária (infusão de 60 min)',
    ajuste_renal: 'Intervalo alargado guiado rigorosamente pela depuração de creatinina',
    mssa: 'Ativo (Alternativa)',
    mrsa: 'Resistente / Inativo',
    s_pneumoniae: 'Resistente / Inativo',
    e_faecalis: 'Ativo (Alternativa)',
    gram_negativos: 'Excelente (1ª linha)',
    pseudomonas: 'Excelente (1ª linha)',
    esbl: 'Excelente (1ª linha)',
    anaerobios: 'Resistente / Inativo',
    atipicos: 'Resistente / Inativo',
  },
  {
    antibiotico: 'Polimixina B',
    classe: 'Polipeptídeo / Resistência Extrema',
    posologia_padrao: 'Ataque 25.000 UI/kg; manutenção 15.000 a 25.000 UI/kg/dia dividido em 2 doses',
    ajuste_renal: 'Não requer ajuste de dose formal (dosagem baseada no peso corporal total)',
    mssa: 'Resistente / Inativo',
    mrsa: 'Resistente / Inativo',
    s_pneumoniae: 'Resistente / Inativo',
    e_faecalis: 'Resistente / Inativo',
    gram_negativos: 'Excelente (1ª linha)',
    pseudomonas: 'Excelente (1ª linha)',
    esbl: 'Excelente (1ª linha)',
    anaerobios: 'Resistente / Inativo',
    atipicos: 'Resistente / Inativo',
  },
  {
    antibiotico: 'Fluconazol (Antifúngico)',
    classe: 'Triazol Antifúngico',
    posologia_padrao: 'Ataque 800 mg, depois 400 mg IV ou VO 24/24h (biodisponibilidade oral > 90%)',
    ajuste_renal: 'TFG < 50: reduzir dose de manutenção em 50%',
    mssa: 'Resistente / Inativo',
    mrsa: 'Resistente / Inativo',
    s_pneumoniae: 'Resistente / Inativo',
    e_faecalis: 'Resistente / Inativo',
    gram_negativos: 'Resistente / Inativo',
    pseudomonas: 'Resistente / Inativo',
    esbl: 'Resistente / Inativo',
    anaerobios: 'Resistente / Inativo',
    atipicos: 'Resistente / Inativo',
  },
];

export const CRITERIOS_SWITCH_IV_VO = [
  {
    id: 1,
    titulo: 'Estabilidade Clínica e Hemodinâmica',
    descricao: 'Afebril (temperatura axilar < 37,8ºC) há pelo menos 24 a 48 horas, sem uso de drogas vasoativas e sem hipotensão.',
  },
  {
    id: 2,
    titulo: 'Melhora dos Marcadores Infecciosos',
    descricao: 'Queda progressiva da curva de leucócitos, desvio à esquerda e PCR sérica, com regressão evidente dos sinais clínicos do foco infeccioso.',
  },
  {
    id: 3,
    titulo: 'Trato Gastrointestinal Íntegro e Funcional',
    descricao: 'Aceitação adequada da via oral/enteral, sem náuseas, vômitos incoercíveis, diarreia intensa, íleo paralítico ou má-absorção conhecida.',
  },
  {
    id: 4,
    titulo: 'Ausência de Foco com Exigência de Nível Parenteral Estrito',
    descricao: 'Não se trata de infecção profunda com barreira anatômica restrita como Endocardite Infecciosa, Meningite, Osteomielite precoce, Artrite Séptica não drenada ou Infecção de Prótese Vascular.',
  },
  {
    id: 5,
    titulo: 'Disponibilidade de Antimicrobiano Oral Equivalente',
    descricao: 'Existência de fármaco oral com alta biodisponibilidade (> 80-90%): Ciprofloxacino, Levofloxacino, Linezolida, Metronidazol, Sulfametoxazol-Trimetoprima, Fluconazol ou Amoxicilina-Clavulanato.',
  },
];

export const CARIMBOS_PRONTUARIO = [
  {
    id: 'exame_fisico_normal',
    titulo: 'Exame Físico Geral e Segmentar Normal',
    categoria: 'Evolução Clínica',
    texto: `EXAME FÍSICO:
Bom estado geral, lúcido e orientado no tempo e espaço (Glasgow 15), corado, hidratado, anictérico, acianótico, febril negativo.
SSVV: PA: 120x80 mmHg | FC: 74 bpm | FR: 16 irpm | SatO2: 98% em ar ambiente | Tax: 36,4ºC.
ACV: Ritmo cardíaco regular em 2 tempos, bulhas normofonéticas, sem sopros ou estalidos. Pulsos periféricos amplos e simétricos.
AR: Murmúrio vesicular universalmente audível, sem ruídos adventícios. Expansibilidade torácica preservada bilateralmente.
ABDOME: Plano, flácido, indolor à palpação superficial e profunda, sem visceromegalias palpáveis. Ruídos hidroaéreos presentes e normoativos. Sinal de Blumberg e Murphy negativos.
EXTREMIDADES: Livres de edema maleolar, sem sinais de trombose venosa profunda (Homans negativo). Tempo de enchimento capilar < 2 segundos.
NEUROLÓGICO: Pupilas isocóricas e fotorreagentes, sem déficits motores ou sensitivos focais. Sem sinais de irritação meníngea (rigidez de nuca ausente).`,
  },
  {
    id: 'admissao_uti_fast_hug',
    titulo: 'Admissão / Ronda Diária UTI (FAST-HUG BIND)',
    categoria: 'Terapia Intensiva',
    texto: `CHECKLIST FAST-HUG BIND (UTI):
F - Feeding (Nutrição): Dieta enteral em infusão contínua em bomba conforme meta calórico-proteica da EMTN.
A - Analgesia: Avaliada por escala visual analógica / CPOT; sedoanalgesia otimizada sem dor aparente.
S - Sedation (Sedação): Escala de Richmond (RASS alvo: -1 a 0). Avaliação de despertar diário realizada.
T - Thromboembolism (Tromboprofilaxia): Enoxaparina 40 mg SC 24/24h (TFG > 30) + compressão pneumática intermitente.
H - Head of bed (Cabeceira): Elevada a 30-45 graus para prevenção de pneumonia associada à ventilação mecânica.
U - Ulcer prophylaxis (Profilaxia Úlcera de Estresse): Omeprazol 40 mg IV 24/24h conforme critérios de risco.
G - Glucose control (Glicemia): Protocolo de insulina venosa com alvo glicêmico estrito de 140 a 180 mg/dL.
B - Bowel (Hábito Intestinal): Ausência de distensão abdominal; última evacuação registrada e tolerada.
I - Indwelling catheters (Dispositivos Invasivos): CVC, TOT e SVD inspecionados diariamente; sem sinais flogísticos; indicação de permanência checada.
N - Neuromuscular de-escalation: Sem uso de bloqueadores neuromusculares no momento.
D - De-escalation (Descalonamento): Culturas checadas; adequação antimicrobiana guiada pelo antibiograma e CCIH.`,
  },
  {
    id: 'intubacao_orotraqueal',
    titulo: 'Procedimento: Intubação Orotraqueal (IOT)',
    categoria: 'Procedimentos / Sala Vermelha',
    texto: `NOTA DE PROCEDIMENTO - INTUBAÇÃO EM SEQUÊNCIA RÁPIDA (ISR):
Indicação: Rebaixamento agudo do nível de consciência / Insuficiência respiratória aguda grave.
Material: Laringoscópio testado lâmina curva nº 3/4, tubo orotraqueal nº 7.5/8.0 com cuff íntegro, bougie, fio guia, aspirador de ponta rígida, capnografia e ambu com reservatório.
Pré-oxigenação: O2 a 100% sob máscara com reservatório por 3 minutos.
Pré-otimização: Hemodinâmica estável com infusão de noradrenalina em acesso venoso.
Indução / Paralisia: Fentanil 100 mcg + Etomidato 20 mg seguidos imediatamente de Rocurônio 1.2 mg/kg IV em bólus rápido.
Laringoscopia: Visualização direta das cordas vocais (Cormack-Lehane Grau I/II). Tubo orotraqueal introduzido sob visão direta sem intercorrências na 1ª tentativa.
Confirmação: Ausculta epigástrica negativa, murmúrios vesiculares simétricos bilateralmente e capnografia em onda com curva positiva mantida.
Fixação: Rima labial fixada a 22 cm. Insuflação do balonete com cuffômetro em 25 cmH2O. Solicitado RX de tórax no leito para controle de posicionamento da ponta da cânula. Conectado à ventilação protetora ARDSNet.`,
  },
  {
    id: 'acesso_venoso_central',
    titulo: 'Procedimento: Cateter Venoso Central (CVC)',
    categoria: 'Procedimentos / Acesso Vascular',
    texto: `NOTA DE PROCEDIMENTO - CATETER VENOSO CENTRAL GUIADO POR ULTRASSONOGRAFIA:
Indicação: Necessidade de monitorização hemodinâmica invasiva e infusão contínua de drogas vasoativas concentradas.
Sítio de Punção: Veia Jugular Interna Direita / Veia Subclávia.
Técnica: Assepsia e antissepsia rigorosa com clorexidina alcoólica a 2%, colocação de campos estéreis amplos, paramentação cirúrgica completa (gorro, máscara cirúrgica, avental estéril e luvas).
Anestesia: Bloqueio anestésico local infiltrativo com lidocaína a 2% sem vasoconstritor (10 mL).
Visualização Ultrassonográfica: Veia identificada em plano transversal com transdutor vascular de alta frequência com capa estéril; colabamento total à compressão e ausência de trombos intraluminais.
Punção: Introdução da agulha guiada em tempo real com refluxo de sangue venoso escuro não pulsátil. Introdução de fio guia metálico pela técnica de Seldinger sem qualquer resistência. Dilatação da pele e fáscia cervical com dilatador vascular.
Posicionamento: Cateter duplo lúmen 7 Fr (20 cm) introduzido sobre o fio guia sem tração. Refluxo e refluxo-lavagem com soro fisiológico em ambas as vias com fluxo livre.
Fixação: Sutura do cateter com fio inabsorvível mononáilon 3-0 com nós de fixação firmes e curativo oclusivo estéril com filme transparente. Solicitado RX de tórax no leito para controle de posicionamento e exclusão de pneumotórax.`,
  },
  {
    id: 'paracentese_evacuadora',
    titulo: 'Procedimento: Paracentese Diagnóstica e de Alívio',
    categoria: 'Procedimentos / Gastroenterologia',
    texto: `NOTA DE PROCEDIMENTO - PARACENTESE ABDOMINAL DIAGNÓSTICA E TERAPÊUTICA:
Indicação: Descarte de Peritonite Bacteriana Espontânea (PBE) e alívio de ascite tensa refratária.
Localização: Quadrante inferior esquerdo (2 cm medial e 2 cm cranial à espinha ilíaca anterossuperior esquerda) após percussão com macicez móvel confirmada e ausência de cicatrizes cirúrgicas ou vasos colaterais.
Antissepsia e Paramentação: Clorexidina alcoólica a 2%, campos estéreis, luvas e técnica asséptica estrita.
Anestesia Local: Lidocaína 2% sem vasoconstritor em planos de pele, celular subcutâneo e peritônio parietal (5 mL).
Punção: Agulha de punção/jelco calibroso nº 14/16 acoplado a seringa pela técnica em trajeto em Z (para prevenção de fístula ascítica pós-punção).
Drenagem: Coletadas amostras para citologia total e diferencial (contagem de polimorfonucleares), bioquímica (albumina para cálculo do GASA, glicose, DHL e proteínas totais) e inoculação de 10 mL do líquido ascítico diretamente em frascos de hemocultura de aeróbios e anaeróbios à beira-leito.
Volume Drenado: 4.500 mL de líquido ascítico límpido citrino.
Expansão com Albumina: Administrados 8g de Albumina Humana a 20% para cada litro de ascite drenado acima de 5 litros (ou conforme protocolo institucional de prevenção de disfunção circulatória pós-paracentese). Retirada da cânula, curativo compressivo seco, sem sangramentos.`,
  },
  {
    id: 'toracocentese',
    titulo: 'Procedimento: Toracocentese Diagnóstica / Alívio',
    categoria: 'Procedimentos / Pneumologia',
    texto: `NOTA DE PROCEDIMENTO - TORACOCENTESE DIAGNÓSTICA E DE ALÍVIO:
Indicação: Investigação etiológica de derrame pleural moderado a volumoso / Alívio de dispneia aguda.
Posicionamento: Paciente sentado no leito com tronco inclinado para a frente e braços apoiados sobre mesa auxiliar com coxim.
Localização: Hemitórax acometido, 1 a 2 espaços intercostais abaixo do nível superior da macicez à percussão, na linha axilar posterior / linha escapular, borda superior da costela inferior para proteger o feixe vasculonervoso intercostal.
Técnica: Antissepsia rigorosa com clorexidina alcoólica a 2%, campos estéreis, anestesia por planos até pleura parietal com lidocaína 2% (10 mL).
Punção e Coleta: Aspiração de líquido pleural com refluxo livre. Coletadas amostras estéreis para critérios de Light (Proteínas totais e DHL pleural + sangue sérico pareado), pH em seringa gasométrica heparinizada, citologia diferencial, baciloscopia/TRM-TB, culturas e citopatológico oncótico.
Volume Total Drenado: 1.000 mL de líquido serofibrinoso (interrompido antes de 1.500 mL para prevenção rigorosa de edema pulmonar de reexpansão). Curativo compressivo seco. Solicitado RX de tórax pós-procedimento.`,
  },
  {
    id: 'puncao_lombar',
    titulo: 'Procedimento: Punção Lombar Diagnóstica',
    categoria: 'Procedimentos / Neurologia',
    texto: `NOTA DE PROCEDIMENTO - PUNÇÃO LOMBAR DIAGNÓSTICA (RAQUI):
Indicação: Suspeita clínica de infecção do sistema nervoso central (meningite/encefalite) / Hemorragia subaracnóidea com TC normal.
Exclusão de Contraindicações: Fundo de olho sem papiledema, TC de crânio prévia sem efeito de massa ou desvio de linha média, coagulograma e plaquetas normais.
Posicionamento: Decúbito lateral esquerdo em posição fetal com coluna fletida perpendicular ao leito.
Localização: Espaço intervertebral L3-L4 / L4-L5 (linha imaginária de Tuffier conectando as cristas ilíacas póstero-superiores).
Técnica e Anestesia: Assepsia com clorexidina alcoólica 2%, campos estéreis, anestesia local com lidocaína 2% (3 mL).
Punção: Agulha raquidiana de ponta atraumática (Whitacre ou Quincke 22G) introduzida com bisel paralelo às fibras longitudinais da dura-máter. Avanço lento com sensação de clique de perda de resistência.
Manometria: Pressão de abertura mensurada com manômetro de coluna de água: 14 cmH2O (pressão normal entre 6 e 20 cmH2O).
Coleta: Líquido cefalorraquidiano (LCR) límpido incolor ('água de rocha'). Coletados 4 tubos numerados estéreis (Tubo 1: Bioquímica - glicose pareada e proteínas totais; Tubo 2: Microbiologia - bacterioscopia Gram, cultura e perfil molecular FilmArray; Tubo 3: Citologia total e diferencial; Tubo 4: Pesquisa de fungos, látex e virologia).
Retirada da agulha com recolocação do mandril para prevenir cefaleia pós-punção. Curativo oclusivo seco. Orientado repouso em decúbito dorsal por 2 horas.`,
  },
  {
    id: 'alta_sinais_alarme',
    titulo: 'Orientações de Alta e Sinais de Alarme (Geral)',
    categoria: 'Ambulatório / Pronto-Socorro',
    texto: `ORIENTAÇÕES MÉDICAS DE ALTA E SINAIS DE ALARME:
1. Seguir rigorosamente os horários e dosagens prescritos na receita médica. Não interromper antibióticos antes do prazo estipulado mesmo com melhora dos sintomas.
2. Manter hidratação oral abundante (2 a 3 litros de água/líquidos ao dia, salvo se houver restrição hídrica por insuficiência cardíaca ou renal avançada).
3. Repouso relativo nas primeiras 48 a 72 horas; alimentação leve e fracionada.
4. RETORNAR IMEDIATAMENTE AO PRONTO-SOCORRO SE APRESENTAR QUALQUER UM DOS SEGUINTES SINAIS DE ALARME:
   - Febre persistente ou recorrente (temperatura axilar >= 38,0ºC) que não cede com antitérmico prescrito;
   - Falta de ar aguda, respiração ofegante, dor para respirar ou arroxeamento nos lábios/dedos;
   - Dor no peito súbita, aperto retroesternal ou palpitações cardíacas intensas;
   - Vômitos incoercíveis que impeçam a ingestão de líquidos ou medicações orais;
   - Tontura incapacitante, desmaio, confusão mental, sonolência excessiva ou convulsão;
   - Sangramento anormal em fezes, vômito, urina ou sangramento gengival espontâneo;
   - Piora progressiva do estado geral ou dor de forte intensidade refratária aos analgésicos orientados.`,
  },
];
