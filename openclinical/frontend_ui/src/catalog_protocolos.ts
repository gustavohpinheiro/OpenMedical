import { ProtocoloClinico } from './types';
import { PROTOCOLOS_INFECTOLOGIA } from './data/protocolos_infectologia';
import { PROTOCOLOS_CLINICA_GERAL } from './data/protocolos_clinica_geral';

// Catálogo Consolidado de 45 Protocolos e Receituários Médicos Completos
export const CATALOGO_PROTOCOLOS: ProtocoloClinico[] = [
  ...PROTOCOLOS_INFECTOLOGIA,
  ...PROTOCOLOS_CLINICA_GERAL,
];

// Fármacos principais de cada um dos 45 protocolos para renderização imediata de Chips
export const FARMACOS_POR_PROTOCOLO: Record<string, string[]> = {
  // Infectologia & Arboviroses (18)
  faringite_amigdalite_aguda: ['Amoxicilina 500mg', 'Dipirona 500mg', 'Penicilina G Benzatina'],
  manejo_dengue_ms: ['Dipirona Monoidratada', 'Sais de Reidratação Oral (SRO)', 'Paracetamol 500mg'],
  chikungunya_fase_aguda_cronica: ['Dipirona Monoidratada', 'Paracetamol 750mg', 'Cloridrato de Tramadol'],
  zika_gestante_manifestacoes: ['Paracetamol 500mg', 'Loratadina 10mg', 'Repelente Icaridina'],
  pneumonia_adquirida_comunidade: ['Amoxicilina 500mg', 'Azitromicina 500mg', 'Dipirona 500mg'],
  sinusite_bacteriana_aguda: ['Amoxicilina 500mg', 'Budesonida Spray Nasal', 'Dipirona 500mg'],
  otite_media_aguda_pediatrica: ['Amoxicilina 250mg/5mL', 'Dipirona Gotas 500mg/mL'],
  itu_nao_complicada: ['Fosfomicina trometamol 3g', 'Dipirona Gotas 500mg/mL', 'Nitrofurantoína 100mg'],
  pielonefrite_aguda_nao_complicada: ['Cloridrato de Ciprofloxacino 500mg', 'Ceftriaxona 1g IV', 'Dipirona 500mg'],
  erisipela_celulite_infecciosa: ['Cefalexina 500mg', 'Dipirona 500mg'],
  impetigo_crostoso_bolhoso: ['Mupirocina 2% Pomada', 'Cefalexina 500mg'],
  herpes_zoster_nevralgia: ['Aciclovir 800mg', 'Dipirona 500mg', 'Gabapentina 300mg'],
  parasitoses_intestinais_giardiase: ['Albendazol 400mg', 'Secnidazol 1000mg', 'Metronidazol 400mg'],
  sifilis_adquirida_primaria_secundaria: ['Penicilina G Benzatina 1.200.000 UI'],
  uretrite_gonococica_clamidia: ['Ceftriaxona 500mg IM', 'Azitromicina 500mg'],
  candidiaze_vulvovaginal: ['Fluconazol 150mg', 'Nitrato de Miconazol Creme 2%'],
  vaginose_bacteriana_tricomoniase: ['Metronidazol 400mg'],
  influenza_sindrome_gripal_oseltamivir: ['Fosfato de Oseltamivir 75mg', 'Dipirona 500mg'],

  // Cardiologia & Nefrologia (7)
  crise_hipertensiva: ['Maleato de Enalapril 10mg', 'Hidroclorotiazida 25mg'],
  hipertensao_arterial_estagio1_2: ['Losartana Potássica 50mg', 'Besilato de Anlodipino 5mg'],
  insuficiencia_cardiaca_fracao_reduzida: ['Succinato de Metoprolol', 'Maleato de Enalapril', 'Espironolactona', 'Dapagliflozina 10mg'],
  fibrilacao_atrial_anticoagulacao_cha2ds2vasc: ['Rivaroxabana 20mg', 'Atenolol 50mg'],
  angina_estavel_doenca_coronariana: ['AAS 100mg', 'Sinvastatina 40mg', 'Atenolol 50mg', 'Dinitrato de Isossorbida'],
  dislipidemia_prevencao_cardiovascular: ['Sinvastatina 20mg / 40mg'],
  doenca_renal_cronica_nefroprotecao: ['Losartana Potássica 50mg', 'Dapagliflozina 10mg'],

  // Pneumologia & Alergia (4)
  asma_exacerbacao_aguda: ['Sulfato de Salbutamol 100mcg', 'Prednisona 20mg'],
  asma_tratamento_manutencao_gina: ['Formoterol 6mcg + Budesonida 200mcg'],
  dpoc_estavel_manutencao_gold: ['Brometo de Tiotrópio 2.5mcg', 'Salbutamol 100mcg'],
  rinite_alergica_persistente: ['Budesonida Spray Nasal 50mcg', 'Loratadina 10mg', 'Soro Fisiológico 0.9%'],

  // Gastroenterologia (4)
  gastrite_drge: ['Omeprazol 20mg cápsula'],
  erradicacao_helicobacter_pylori: ['Omeprazol 20mg', 'Amoxicilina 500mg', 'Claritromicina 500mg'],
  constipacao_intestinal_cronica: ['Polietilenoglicol 4000 (PEG)', 'Lactulose 667mg/mL'],
  diarreia_aguda_gastroenterite: ['Sais de Reidratação Oral (SRO)', 'Racecadotrila 100mg', 'Saccharomyces boulardii'],

  // Endocrinologia & Reumatologia (5)
  diabetes_mellitus_tipo2: ['Cloridrato de Metformina 850mg'],
  diabetes_tipo2_associacao_metformina_isglt2: ['Metformina XR 500mg', 'Dapagliflozina 10mg'],
  hipotireoidismo_primario_levotiroxina: ['Levotiroxina Sódica 50mcg'],
  gota_artrite_urica_aguda_e_profilaxia: ['Colchicina 0.5mg', 'Dipirona 500mg'],
  osteoporose_pos_menopausa_alendronato: ['Alendronato de Sódio 70mg', 'Carbonato de Cálcio + Vitamina D3'],

  // Neurologia & Saúde Mental (5)
  lombalgia_aguda: ['Dipirona Monoidratada 500mg', 'Ciclobenzaprina 5mg'],
  cefaleia_tensional_enxaqueca: ['Dipirona Monoidratada 500mg', 'Metoclopramida 10mg'],
  profilaxia_enxaqueca_cronica: ['Cloridrato de Propranolol 40mg'],
  depressao_ansiedade_atencao_primaria: ['Cloridrato de Sertralina 50mg'],
  vertigem_posicional_paroxistica_labirintopatia: ['Dimenidrinato + Piridoxina'],

  // Urgência & Pediatria (2)
  anafilaxia_reacao_alergica_grave: ['Epinefrina (Adrenalina 1:1000)', 'Hidrocortisona 500mg IV'],
  desidratacao_pediatrica_plano_b_c: ['Sais de Reidratação Oral (SRO)', 'Sulfato de Zinco 20mg'],
};

// Categoria clínica de cada protocolo para organização em abas/filtros
export const CATEGORIAS_POR_PROTOCOLO: Record<string, string> = {
  faringite_amigdalite_aguda: 'infectologia',
  manejo_dengue_ms: 'infectologia',
  chikungunya_fase_aguda_cronica: 'infectologia',
  zika_gestante_manifestacoes: 'infectologia',
  pneumonia_adquirida_comunidade: 'infectologia',
  sinusite_bacteriana_aguda: 'infectologia',
  otite_media_aguda_pediatrica: 'pediatria',
  itu_nao_complicada: 'infectologia',
  pielonefrite_aguda_nao_complicada: 'infectologia',
  erisipela_celulite_infecciosa: 'infectologia',
  impetigo_crostoso_bolhoso: 'pediatria',
  herpes_zoster_nevralgia: 'infectologia',
  parasitoses_intestinais_giardiase: 'infectologia',
  sifilis_adquirida_primaria_secundaria: 'infectologia',
  uretrite_gonococica_clamidia: 'infectologia',
  candidiaze_vulvovaginal: 'ginecologia',
  vaginose_bacteriana_tricomoniase: 'ginecologia',
  influenza_sindrome_gripal_oseltamivir: 'infectologia',

  crise_hipertensiva: 'cardiovascular',
  hipertensao_arterial_estagio1_2: 'cardiovascular',
  insuficiencia_cardiaca_fracao_reduzida: 'cardiovascular',
  fibrilacao_atrial_anticoagulacao_cha2ds2vasc: 'cardiovascular',
  angina_estavel_doenca_coronariana: 'cardiovascular',
  dislipidemia_prevencao_cardiovascular: 'cardiovascular',
  doenca_renal_cronica_nefroprotecao: 'nefrologia',

  asma_exacerbacao_aguda: 'respiratorio',
  asma_tratamento_manutencao_gina: 'respiratorio',
  dpoc_estavel_manutencao_gold: 'respiratorio',
  rinite_alergica_persistente: 'respiratorio',

  gastrite_drge: 'gastroenterologia',
  erradicacao_helicobacter_pylori: 'gastroenterologia',
  constipacao_intestinal_cronica: 'gastroenterologia',
  diarreia_aguda_gastroenterite: 'gastroenterologia',

  diabetes_mellitus_tipo2: 'endocrinologia',
  diabetes_tipo2_associacao_metformina_isglt2: 'endocrinologia',
  hipotireoidismo_primario_levotiroxina: 'endocrinologia',
  gota_artrite_urica_aguda_e_profilaxia: 'reumatologia',
  osteoporose_pos_menopausa_alendronato: 'reumatologia',

  lombalgia_aguda: 'neurologia',
  cefaleia_tensional_enxaqueca: 'neurologia',
  profilaxia_enxaqueca_cronica: 'neurologia',
  depressao_ansiedade_atencao_primaria: 'saude_mental',
  vertigem_posicional_paroxistica_labirintopatia: 'neurologia',

  anafilaxia_reacao_alergica_grave: 'urgencia',
  desidratacao_pediatrica_plano_b_c: 'pediatria',
};
