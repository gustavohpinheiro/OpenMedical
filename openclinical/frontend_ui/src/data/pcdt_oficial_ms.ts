// Base Oficial PCDT do Ministério da Saúde / CONITEC (83 Protocolos)
// Lista (nome/status/tipo) extraída dos dados abertos governamentais (ckan.saude.gov.br).
// Campos clínicos só existem onde conteudo_curado = true e são resumos escritos pelo projeto, NÃO o texto do PCDT.

export interface ProtocoloPCDTOficial {
  id_pcdt: number;
  id_protocolo: string;
  nome_protocolo: string;
  status_conitec: string;
  tipo_protocolo: string;
  cids_relacionados: string[];
  farmacos_principais: string[];
  conduta_clinica: string;
  bloco_prescricao_copiavel: string;
  conteudo_curado: boolean;
}

export const LISTA_PCDT_OFICIAL_MS: ProtocoloPCDTOficial[] = [
  {
    "id_pcdt": 1,
    "id_protocolo": "acidentes_escorpi_nicos",
    "nome_protocolo": "Acidentes Escorpiônicos",
    "status_conitec": "Aprovado*",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [
      "T63.2"
    ],
    "farmacos_principais": [
      "Soro Antiescorpiônico (SAEsc) injetável",
      "Dipirona 500mg/mL",
      "Cloridrato de Tramadol",
      "Lidocaína 2% sem vasoconstritor"
    ],
    "conduta_clinica": "Classificação da gravidade (Leve: dor e parestesia local; Moderado: náuseas, sudorese, taquicardia; Grave: choque, edema agudo de pulmão). Soroterapia intravenosa rápida nos casos moderados e graves.",
    "bloco_prescricao_copiavel": "1. Dipirona Monoidratada 500mg/mL gotas: Dar 1 gota a cada 2 kg de peso (máximo 40 gotas) a cada 6 horas para dor.\n2. Bloqueio anestésico local com Lidocaína 2% sem vasoconstritor se dor lancinante refratária.",
    "conteudo_curado": true
  },
  {
    "id_pcdt": 2,
    "id_protocolo": "acidentes_of_dicos",
    "nome_protocolo": "Acidentes Ofídicos",
    "status_conitec": "Conitec",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [
      "T63.0"
    ],
    "farmacos_principais": [
      "Soro Antibotrópico (SAB)",
      "Soro Anticrotálico (SAC)",
      "Soro Antilaquético (SAL)",
      "Dipirona 500mg"
    ],
    "conduta_clinica": "Identificação do gênero da serpente (Bothrops: dor, edema, necrose, sangramento; Crotalus: fácies miastênica, urina escura, paralisia). Infusão venosa precoce do antiveneno específico.",
    "bloco_prescricao_copiavel": "1. Soro Antibotrópico pentavalente: Infundir por via intravenosa diluído em SF 0.9% em 30 a 60 minutos (Leve: 2 a 4 ampolas; Moderado: 4 a 8 ampolas; Grave: 12 ampolas).\n2. Dipirona 500mg comprimido: 1 comprimido 6/6h para dor.",
    "conteudo_curado": true
  },
  {
    "id_pcdt": 3,
    "id_protocolo": "acromegalia",
    "nome_protocolo": "Acromegalia",
    "status_conitec": "Aprovado*",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [
      "E22.0"
    ],
    "farmacos_principais": [
      "Acetato de Octreotida LAR 20mg/30mg",
      "Cabergolina 0.5mg",
      "Pegvisomanto"
    ],
    "conduta_clinica": "Cirurgia transesfenoidal como primeira escolha curativa. Tratamento farmacológico com análogos de somatostatina de longa ação (Octreotida LAR) para controle de GH e IGF-1.",
    "bloco_prescricao_copiavel": "1. Acetato de Octreotida LAR 20mg: Aplicar por via intramuscular profunda glútea uma vez a cada 4 semanas em serviço de saúde especializado.",
    "conteudo_curado": true
  },
  {
    "id_pcdt": 4,
    "id_protocolo": "adenocarcinoma_de_c_lon_e_reto",
    "nome_protocolo": "Adenocarcinoma de Cólon e Reto",
    "status_conitec": "Aprovado*",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Aprovado*). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 5,
    "id_protocolo": "adenocarcinoma_de_es_fago",
    "nome_protocolo": "Adenocarcinoma de Esôfago",
    "status_conitec": "Em atualização",
    "tipo_protocolo": "DDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "DDT listado pela CONITEC/Ministério da Saúde (Em atualização). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 6,
    "id_protocolo": "adenocarcinoma_de_est_mago",
    "nome_protocolo": "Adenocarcinoma de estômago",
    "status_conitec": "Em atualização",
    "tipo_protocolo": "DDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "DDT listado pela CONITEC/Ministério da Saúde (Em atualização). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 7,
    "id_protocolo": "adenocarcinoma_de_pr_stata",
    "nome_protocolo": "Adenocarcinoma de Próstata",
    "status_conitec": "Em atualização",
    "tipo_protocolo": "DDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "DDT listado pela CONITEC/Ministério da Saúde (Em atualização). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 8,
    "id_protocolo": "alergia_prote_na_do_leite_de_vaca",
    "nome_protocolo": "Alergia à Proteína do Leite de Vaca",
    "status_conitec": "Aprovado*",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Aprovado*). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 9,
    "id_protocolo": "amiloidoses_associadas_transtirretina",
    "nome_protocolo": "Amiloidoses associadas à transtirretina",
    "status_conitec": "Aprovado*",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Aprovado*). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 10,
    "id_protocolo": "anemia_na_doen_a_renal_cr_nica",
    "nome_protocolo": "Anemia na Doença Renal Crônica",
    "status_conitec": "Aprovado*",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [
      "D63.8",
      "N18.3",
      "N18.4",
      "N18.5"
    ],
    "farmacos_principais": [
      "Alfaepoetina (EPO) 2000 UI / 4000 UI injetável",
      "Sacarato de Hidróxido de Ferro III 100mg/5mL"
    ],
    "conduta_clinica": "Garantir saturação de transferrina > 20% e ferritina > 100 ng/mL antes e durante o tratamento com Agente Estimulador da Eritropoiese (Alfaepoetina). Meta de Hemoglobina: 10 a 11.5 g/dL.",
    "bloco_prescricao_copiavel": "1. Alfaepoetina 4000 UI frasco-ampola: Aplicar via subcutânea 1 vez por semana conforme dosagem de hemoglobina.\n2. Sacarato de Ferro 100mg ampola: Infusão intravenosa lenta em solução salina a cada 15 dias na unidade de hemodiálise.",
    "conteudo_curado": true
  },
  {
    "id_pcdt": 11,
    "id_protocolo": "anemia_por_defici_ncia_de_ferro",
    "nome_protocolo": "Anemia por deficiência de ferro",
    "status_conitec": "Aprovado*",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [
      "D50.0",
      "D50.8",
      "D50.9"
    ],
    "farmacos_principais": [
      "Sulfato Ferroso 40mg de ferro elementar",
      "Sacarato de Hidróxido de Ferro III injetável"
    ],
    "conduta_clinica": "Reposição oral de ferro elementar (100 a 200 mg/dia) preferencialmente em jejum com suco cítrico. Manter por 3 meses após normalização do hemograma para repor estoques de ferritina.",
    "bloco_prescricao_copiavel": "1. Sulfato Ferroso 40mg (ferro elementar) comprimido: Tomar 1 comprimido por via oral 3 vezes ao dia (120 mg/dia de ferro elementar), 1 hora antes das principais refeições com água ou suco de laranja.",
    "conteudo_curado": true
  },
  {
    "id_pcdt": 12,
    "id_protocolo": "angioedema_associado_defici_ncia_de_c1_esterase_c1_inh",
    "nome_protocolo": "Angioedema associado à deficiência de C1 esterase (C1-INH)",
    "status_conitec": "Aprovado*",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Aprovado*). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 13,
    "id_protocolo": "artrite_idiop_tica_juvenil",
    "nome_protocolo": "Artrite Idiopática Juvenil",
    "status_conitec": "Aprovado*",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Aprovado*). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 14,
    "id_protocolo": "artrite_psori_sica",
    "nome_protocolo": "Artrite Psoriásica",
    "status_conitec": "Aprovado*",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Aprovado*). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 15,
    "id_protocolo": "artrite_reumatoide",
    "nome_protocolo": "Artrite Reumatoide",
    "status_conitec": "Aprovado*",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [
      "M05.0",
      "M05.1",
      "M05.2",
      "M05.3",
      "M05.8",
      "M06.0"
    ],
    "farmacos_principais": [
      "Metotrexato 2.5mg",
      "Ácido Fólico 5mg",
      "Sulfassalazina 500mg",
      "Leflunomida 20mg",
      "Adalimumabe 40mg"
    ],
    "conduta_clinica": "Tratamento por metas (Treat to Target). Iniciar precocemente com DMARD sintético convencional (Metotrexato) associado a ácido fólico. Se falha após 3 a 6 meses, associar DMARD biológico (Anti-TNF) ou inibidor de JAK.",
    "bloco_prescricao_copiavel": "1. Metotrexato 2.5mg comprimido: Tomar 6 comprimidos (15 mg) por via oral uma vez por semana (às segundas-feiras).\n2. Ácido Fólico 5mg comprimido: Tomar 1 comprimido por via oral uma vez por semana (às terças-feiras, 24h após o metotrexato).",
    "conteudo_curado": true
  },
  {
    "id_pcdt": 16,
    "id_protocolo": "asma",
    "nome_protocolo": "Asma",
    "status_conitec": "Em atualização",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [
      "J45.0",
      "J45.1",
      "J45.8",
      "J45.9"
    ],
    "farmacos_principais": [
      "Dipropionato de Beclometasona",
      "Budesonida + Formoterol",
      "Sulfato de Salbutamol 100mcg",
      "Fenoterol"
    ],
    "conduta_clinica": "Controle de sintomas e prevenção de exacerbações com Corticoide Inalatório em todos os passos clínicos. Uso preferencial de CI-Formoterol como resgate e manutenção.",
    "bloco_prescricao_copiavel": "1. Budesonida 200mcg + Formoterol 6mcg pó inalatório: Inalar 1 dose a cada 12 horas diariamente de manutenção e 1 dose extra se falta de ar aguda.\n2. Sulfato de Salbutamol 100mcg spray: Inalar 2 a 4 jatos se crise aguda com espaçador.",
    "conteudo_curado": true
  },
  {
    "id_pcdt": 17,
    "id_protocolo": "c_ncer_de_cabe_a_e_pesco_o",
    "nome_protocolo": "Câncer de Cabeça e Pescoço",
    "status_conitec": "Em atualização",
    "tipo_protocolo": "DDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "DDT listado pela CONITEC/Ministério da Saúde (Em atualização). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 18,
    "id_protocolo": "c_ncer_de_pulm_o",
    "nome_protocolo": "Câncer de Pulmão",
    "status_conitec": "Em atualização",
    "tipo_protocolo": "DDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "DDT listado pela CONITEC/Ministério da Saúde (Em atualização). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 19,
    "id_protocolo": "carcinoma_diferenciado_de_tire_ide",
    "nome_protocolo": "Carcinoma Diferenciado de Tireóide",
    "status_conitec": "Em atualização",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Em atualização). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 20,
    "id_protocolo": "cardioversor_desfibrilador",
    "nome_protocolo": "Cardioversor Desfibrilador",
    "status_conitec": "Em atualização",
    "tipo_protocolo": "Protocolo de Uso",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "Protocolo de Uso listado pela CONITEC/Ministério da Saúde (Em atualização). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 21,
    "id_protocolo": "cisticercose",
    "nome_protocolo": "Cisticercose",
    "status_conitec": "Em elaboração",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Em elaboração). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 22,
    "id_protocolo": "colangite_biliar_prim_ria",
    "nome_protocolo": "Colangite Biliar Primária",
    "status_conitec": "Em atualização",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Em atualização). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 23,
    "id_protocolo": "cranioestenoses",
    "nome_protocolo": "Cranioestenoses",
    "status_conitec": "Em elaboração",
    "tipo_protocolo": "Diretrizes Brasileiras",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "Diretrizes Brasileiras listado pela CONITEC/Ministério da Saúde (Em elaboração). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 24,
    "id_protocolo": "cuidado_ao_paciente_com_doen_a_renal_cr_nica_no_sus",
    "nome_protocolo": "Cuidado ao paciente com Doença Renal Crônica no SUS",
    "status_conitec": "Em atualização",
    "tipo_protocolo": "Diretriz",
    "cids_relacionados": [
      "N18.1",
      "N18.2",
      "N18.3",
      "N18.4",
      "N18.5",
      "N18.9"
    ],
    "farmacos_principais": [
      "Losartana Potássica 50mg",
      "Maleato de Enalapril 10mg/20mg",
      "Dapagliflozina 10mg",
      "Bicarbonato de Sódio 500mg",
      "Alfaepoetina"
    ],
    "conduta_clinica": "Nefroproteção estrita com bloqueio de SRAA (BRA ou IECA) para controle de proteinúria e pressão arterial, associado a inibidor de SGLT2 (Dapagliflozina).",
    "bloco_prescricao_copiavel": "1. Losartana 50mg comprimido: Tomar 1 comprimido pela manhã.\n2. Dapagliflozina 10mg comprimido: Tomar 1 comprimido pela manhã.\n3. Bicarbonato de Sódio 500mg cápsula: Tomar 1 cápsula 12/12h se bicarbonato sérico < 22 mEq/L.",
    "conteudo_curado": true
  },
  {
    "id_pcdt": 25,
    "id_protocolo": "defici_ncia_de_biotinidase",
    "nome_protocolo": "Deficiência de Biotinidase",
    "status_conitec": "Aprovado*",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Aprovado*). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 26,
    "id_protocolo": "defici_ncia_do_horm_nio_do_crescimento_hipopituitarismo",
    "nome_protocolo": "Deficiência do Hormônio do Crescimento - Hipopituitarismo",
    "status_conitec": "Em atualização",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Em atualização). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 27,
    "id_protocolo": "dermatite_at_pica",
    "nome_protocolo": "Dermatite Atópica",
    "status_conitec": "Conitec",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [
      "L20.0",
      "L20.8",
      "L20.9"
    ],
    "farmacos_principais": [
      "Valerato de Betametasona creme 0.1%",
      "Furoato de Mometasona 0.1%",
      "Tacrolimo pomada 0.03%/0.1%",
      "Hidratante com Ureia / Ceramidas"
    ],
    "conduta_clinica": "Restauração da barreira cutânea com banhos rápidos mornos e aplicação abundante de emoliente em até 3 minutos pós-banho. Corticoides tópicos em pulsoterapia curta nas crises.",
    "bloco_prescricao_copiavel": "1. Creme Hidratante Emoliente sem fragrância: Aplicar em todo o corpo 2 a 3 vezes ao dia logo após o banho.\n2. Furoato de Mometasona 0.1% creme: Aplicar fina camada sobre as lesões ativas inflamadas uma vez ao dia à noite por até 7 a 10 dias.",
    "conteudo_curado": true
  },
  {
    "id_pcdt": 28,
    "id_protocolo": "diabete_melito_tipo_1",
    "nome_protocolo": "Diabete Melito Tipo 1",
    "status_conitec": "Em atualização",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [
      "E10.0",
      "E10.1",
      "E10.9"
    ],
    "farmacos_principais": [
      "Insulina Humana NPH",
      "Insulina Humana Regular",
      "Insulina Glargina",
      "Insulina Lispro / Asparte"
    ],
    "conduta_clinica": "Esquema basal-bolus intensivo com monitoramento capilar de glicemia de 4 a 6 vezes ao dia. Titulação de insulina conforme contagem de carboidratos.",
    "bloco_prescricao_copiavel": "1. Insulina NPH Humana 100 UI/mL: Aplicar 16 UI via subcutânea às 07h e 8 UI às 22h.\n2. Insulina Regular 100 UI/mL: Aplicar via SC antes das principais refeições conforme glicemia capilar.",
    "conteudo_curado": true
  },
  {
    "id_pcdt": 29,
    "id_protocolo": "diabete_melito_tipo_2",
    "nome_protocolo": "Diabete Melito tipo 2",
    "status_conitec": "Em atualização",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [
      "E11.0",
      "E11.2",
      "E11.9"
    ],
    "farmacos_principais": [
      "Cloridrato de Metformina 500mg/850mg",
      "Gliclazida MR 30mg/60mg",
      "Dapagliflozina 10mg",
      "Insulina NPH Humana"
    ],
    "conduta_clinica": "Mudança no estilo de vida associada a Metformina como primeira linha. Adicionar iSGLT2 (Dapagliflozina) em pacientes com DRC ou doença cardiovascular estabelecida.",
    "bloco_prescricao_copiavel": "1. Metformina 850mg comprimido: Tomar 1 comprimido após o almoço e 1 comprimido após o jantar diariamente.\n2. Dapagliflozina 10mg comprimido: Tomar 1 comprimido pela manhã em jejum.",
    "conteudo_curado": true
  },
  {
    "id_pcdt": 30,
    "id_protocolo": "diabetes_ins_pido",
    "nome_protocolo": "Diabetes Insípido",
    "status_conitec": "Aprovado*",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Aprovado*). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 31,
    "id_protocolo": "disfun_o_neurog_nica_do_trato_urin_rio_inferior_em_adultos_antes_bexiga_neurog_nica",
    "nome_protocolo": "Disfunção Neurogênica do Trato Urinário Inferior em Adultos (antes Bexiga Neurogênica)",
    "status_conitec": "Aprovado*",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Aprovado*). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 32,
    "id_protocolo": "dislipidemia_preven_o_de_eventos_cardiovasculares_e_pancreatite",
    "nome_protocolo": "Dislipidemia: Prevenção de eventos cardiovasculares e pancreatite",
    "status_conitec": "Em atualização",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [
      "E78.0",
      "E78.1",
      "E78.2",
      "E78.4"
    ],
    "farmacos_principais": [
      "Sinvastatina 20mg/40mg",
      "Atorvastatina 20mg/40mg/80mg",
      "Ezetimiba 10mg",
      "Fenofibrato 160mg/200mg"
    ],
    "conduta_clinica": "Estatina de intensidade moderada a alta para prevenção primária e secundária conforme risco cardiovascular global. Fibratos indicados se triglicérides > 500 mg/dL.",
    "bloco_prescricao_copiavel": "1. Sinvastatina 40mg comprimido: Tomar 1 comprimido à noite ao deitar.\n2. Ezetimiba 10mg comprimido: Tomar 1 comprimido pela manhã se LDL permanecer acima da meta terapêutica.",
    "conteudo_curado": true
  },
  {
    "id_pcdt": 33,
    "id_protocolo": "distonias_e_espasmo_hemifacial",
    "nome_protocolo": "Distonias e Espasmo Hemifacial",
    "status_conitec": "Aprovado*",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Aprovado*). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 34,
    "id_protocolo": "dist_rbio_do_espectro_da_neuromielite_ptica",
    "nome_protocolo": "Distúrbio do Espectro da Neuromielite Óptica",
    "status_conitec": "Em elaboração",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Em elaboração). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 35,
    "id_protocolo": "doen_a_de_alzheimer",
    "nome_protocolo": "Doença de Alzheimer",
    "status_conitec": "Conitec",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [
      "G30.0",
      "G30.1",
      "G30.8",
      "G30.9",
      "F00"
    ],
    "farmacos_principais": [
      "Cloridrato de Donepezila 5mg/10mg",
      "Hemitartarato de Rivastigmina",
      "Cloridrato de Memantina 10mg"
    ],
    "conduta_clinica": "Inibidores da acetilcolinesterase (Donepezila/Rivastigmina) para demência leve a moderada. Adicionar Memantina (antagonista NMDA) em fases moderadas a avançadas.",
    "bloco_prescricao_copiavel": "1. Donepezila 5mg comprimido: Tomar 1 comprimido à noite ao deitar durante 4 semanas; aumentar para 10mg/dia se boa tolerância.",
    "conteudo_curado": true
  },
  {
    "id_pcdt": 36,
    "id_protocolo": "doen_a_de_crohn",
    "nome_protocolo": "Doença de Crohn",
    "status_conitec": "Em atualização",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [
      "K50.0",
      "K50.1",
      "K50.8",
      "K50.9"
    ],
    "farmacos_principais": [
      "Azatioprina 50mg",
      "Mesalazina 800mg/1000mg",
      "Infliximabe 100mg injetável",
      "Adalimumabe 40mg",
      "Metronidazol 400mg"
    ],
    "conduta_clinica": "Indução e manutenção de remissão clínica e cicatrização de mucosa com imunossupressores (Azatioprina) e terapia biológica precoce (Anti-TNF) em doença moderada a grave.",
    "bloco_prescricao_copiavel": "1. Azatioprina 50mg comprimido: Dose de 2 a 2.5 mg/kg/dia em dose única diária após o café da manhã (ex.: 70 kg = 3 comprimidos de 50 mg); calcular pelo peso do paciente e monitorar hemograma mensalmente.",
    "conteudo_curado": true
  },
  {
    "id_pcdt": 37,
    "id_protocolo": "doen_a_de_parkinson",
    "nome_protocolo": "Doença de Parkinson",
    "status_conitec": "Aprovado*",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [
      "G20"
    ],
    "farmacos_principais": [
      "Levodopa + Cloridrato de Benserazida 200/50mg",
      "Pramipexol 0.25mg/1mg",
      "Amantadina 100mg"
    ],
    "conduta_clinica": "Reposição dopaminérgica individualizada com Levodopa/Benserazida ou agonista dopaminérgico em pacientes jovens. Tomar longe de refeições hiperproteicas.",
    "bloco_prescricao_copiavel": "1. Levodopa 200mg + Benserazida 50mg comprimido: Tomar 1/2 comprimido 3 vezes ao dia (08h, 14h, 20h), pelo menos 30 a 60 minutos antes das refeições.",
    "conteudo_curado": true
  },
  {
    "id_pcdt": 38,
    "id_protocolo": "doen_a_pulmonar_obstrutiva_cr_nica",
    "nome_protocolo": "Doença Pulmonar Obstrutiva Crônica",
    "status_conitec": "Conitec",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [
      "J44.0",
      "J44.1",
      "J44.8",
      "J44.9"
    ],
    "farmacos_principais": [
      "Brometo de Tiotrópio 2.5mcg (LAMA)",
      "Salmeterol 50mcg (LABA)",
      "Formoterol + Budesonida",
      "Salbutamol 100mcg"
    ],
    "conduta_clinica": "Broncodilatadores de longa ação (LAMA e/ou LABA) para redução de hiperinsuflação e prevenção de exacerbações. Vacinação anual pneumocócica e influenza.",
    "bloco_prescricao_copiavel": "1. Brometo de Tiotrópio 2.5mcg inalador Respimat: Inalar 2 jatos uma vez ao dia no mesmo horário.\n2. Salbutamol 100mcg spray: Inalar 2 jatos com espaçador se resgate.",
    "conteudo_curado": true
  },
  {
    "id_pcdt": 39,
    "id_protocolo": "endometriose",
    "nome_protocolo": "Endometriose",
    "status_conitec": "Conitec",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [
      "N80.0",
      "N80.1",
      "N80.2",
      "N80.3",
      "N80.8"
    ],
    "farmacos_principais": [
      "Dienogeste 2mg",
      "Acetato de Medroxiprogesterona 150mg/mL",
      "Levonorgestrel DIU",
      "Dipirona 500mg"
    ],
    "conduta_clinica": "Bloqueio hormonal contínuo para atrofia das lesões endometrióticas ectópicas e controle da dor pélvica crônica. Progestagênios de uso contínuo de primeira escolha.",
    "bloco_prescricao_copiavel": "1. Dienogeste 2mg comprimido: Tomar 1 comprimido por via oral diariamente no mesmo horário de forma contínua, sem pausas.\n2. Dipirona Monoidratada 500mg: Tomar 1 a 2 comprimidos 6/6h se dismenorreia.",
    "conteudo_curado": true
  },
  {
    "id_pcdt": 40,
    "id_protocolo": "epilepsia",
    "nome_protocolo": "Epilepsia",
    "status_conitec": "Aprovado*",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [
      "G40.0",
      "G40.1",
      "G40.2",
      "G40.3"
    ],
    "farmacos_principais": [
      "Carbamazepina 200mg/400mg",
      "Ácido Valproico 250mg/500mg",
      "Fenitoína Sódica 100mg",
      "Lamotrigina 50mg/100mg",
      "Levetiracetam"
    ],
    "conduta_clinica": "Monoterapia com fármaco antiepiléptico de primeira escolha conforme o tipo de crise (focal vs generalizada). Monitorar dosagem sérica e hemograma.",
    "bloco_prescricao_copiavel": "1. Carbamazepina 200mg comprimido: Tomar 1 comprimido por via oral a cada 12 horas após as refeições (titular gradualmente conforme resposta clínica).",
    "conteudo_curado": true
  },
  {
    "id_pcdt": 41,
    "id_protocolo": "espondiloartrite_axial",
    "nome_protocolo": "Espondiloartrite Axial",
    "status_conitec": "Aprovado*",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Aprovado*). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 42,
    "id_protocolo": "esquizofrenia",
    "nome_protocolo": "Esquizofrenia",
    "status_conitec": "Em atualização",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [
      "F20.0",
      "F20.1",
      "F20.2",
      "F20.3",
      "F20.5",
      "F20.9"
    ],
    "farmacos_principais": [
      "Risperidona 1mg/2mg/3mg",
      "Olanzapina 5mg/10mg",
      "Quetiapina 100mg/200mg",
      "Clozapina 25mg/100mg",
      "Haloperidol 5mg"
    ],
    "conduta_clinica": "Antipsicóticos de 2ª geração (atípicos) de escolha inicial pela menor taxa de sintomas extrapiramidais e discinesia tardia. Monitorar perfil lipídico e glicemia a cada 3 meses.",
    "bloco_prescricao_copiavel": "1. Risperidona 2mg comprimido: Tomar 1 comprimido por via oral à noite ao deitar (titular conforme resposta clínica e tolerabilidade).",
    "conteudo_curado": true
  },
  {
    "id_pcdt": 43,
    "id_protocolo": "glaucoma",
    "nome_protocolo": "Glaucoma",
    "status_conitec": "Em atualização",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [
      "H40.1",
      "H40.2",
      "H40.9"
    ],
    "farmacos_principais": [
      "Maleato de Timolol colírio 0.5%",
      "Travoprosta colírio 0.004%",
      "Tartarato de Brimonidina 0.2%",
      "Dorzolamida colírio 2%"
    ],
    "conduta_clinica": "Redução da Pressão Intraocular (PIO) como único tratamento comprovado para desacelerar perda de campo visual. Análogos de prostaglandina ou betabloqueadores tópicos como 1ª linha.",
    "bloco_prescricao_copiavel": "1. Maleato de Timolol colírio 0.5%: Pingar 1 gota no olho afetado a cada 12 horas.\n2. Travoprosta colírio 0.004%: Pingar 1 gota no olho afetado uma vez ao dia à noite ao deitar.",
    "conteudo_curado": true
  },
  {
    "id_pcdt": 44,
    "id_protocolo": "hemangioma_infantil",
    "nome_protocolo": "Hemangioma Infantil",
    "status_conitec": "Em atualização",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Em atualização). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 45,
    "id_protocolo": "hemoglobin_ria_parox_stica_noturna",
    "nome_protocolo": "Hemoglobinúria Paroxística Noturna",
    "status_conitec": "Aprovado*",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Aprovado*). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 46,
    "id_protocolo": "hidradenite_supurativa",
    "nome_protocolo": "Hidradenite Supurativa",
    "status_conitec": "Em atualização",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Em atualização). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 47,
    "id_protocolo": "hipoparatireoidismo",
    "nome_protocolo": "Hipoparatireoidismo",
    "status_conitec": "Em atualização",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Em atualização). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 48,
    "id_protocolo": "imunodefici_ncia_prim_ria_com_predomin_ncia_de_defeitos_de_anticorpos",
    "nome_protocolo": "Imunodeficiência Primária com predominância de defeitos de anticorpos",
    "status_conitec": "Em atualização",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Em atualização). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 49,
    "id_protocolo": "imunodefici_ncias_com_defeitos_cong_nitos_de_fag_citos_defeitos_da_imunidade_inata",
    "nome_protocolo": "Imunodeficiências com defeitos congênitos de fagócitos - defeitos da imunidade inata",
    "status_conitec": "Em elaboração",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Em elaboração). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 50,
    "id_protocolo": "imunodefici_ncias_combinadas_graves_imunodefici_ncias_combinadas_e_imunodefici_ncias_combinadas_com_caracter_sticas_sindr_micas",
    "nome_protocolo": "Imunodeficiências combinadas graves, imunodeficiências combinadas e imunodeficiências combinadas com características sindrômicas",
    "status_conitec": "Em elaboração",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Em elaboração). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 51,
    "id_protocolo": "imunossupress_o_em_transplante_de_c_lulas_tronco_hematopoi_ticas",
    "nome_protocolo": "Imunossupressão em Transplante de Células-Tronco Hematopoiéticas",
    "status_conitec": "Em elaboração",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Em elaboração). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 52,
    "id_protocolo": "imunossupress_o_em_transplante_de_pulm_o",
    "nome_protocolo": "Imunossupressão em Transplante de Pulmão",
    "status_conitec": "Em elaboração",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Em elaboração). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 53,
    "id_protocolo": "imunossupress_o_no_transplante_de_p_ncreas",
    "nome_protocolo": "Imunossupressão no Transplante de Pâncreas",
    "status_conitec": "Em elaboração",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Em elaboração). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 54,
    "id_protocolo": "imunossupress_o_no_transplante_hep_tico_em_adultos",
    "nome_protocolo": "Imunossupressão no Transplante Hepático em Adultos",
    "status_conitec": "Em atualização",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Em atualização). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 55,
    "id_protocolo": "infec_es_virais_p_s_transplantes",
    "nome_protocolo": "Infecções Virais pós transplantes",
    "status_conitec": "Em elaboração",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Em elaboração). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 56,
    "id_protocolo": "insufici_ncia_pancre_tica_ex_crina",
    "nome_protocolo": "Insuficiência Pancreática Exócrina",
    "status_conitec": "Em atualização",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Em atualização). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 57,
    "id_protocolo": "leiomioma_de_tero",
    "nome_protocolo": "Leiomioma de útero",
    "status_conitec": "Em atualização",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Em atualização). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 58,
    "id_protocolo": "leishmaniose_tegumentar",
    "nome_protocolo": "Leishmaniose Tegumentar",
    "status_conitec": "Em elaboração",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Em elaboração). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 59,
    "id_protocolo": "leishmaniose_visceral",
    "nome_protocolo": "Leishmaniose Visceral",
    "status_conitec": "Em elaboração",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Em elaboração). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 60,
    "id_protocolo": "leucemia_mieloide_cr_nica_do_adulto",
    "nome_protocolo": "Leucemia Mieloide Crônica do Adulto",
    "status_conitec": "Em atualização",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Em atualização). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 61,
    "id_protocolo": "linfoma_difuso_de_grandes_c_lulas_b",
    "nome_protocolo": "Linfoma Difuso de Grandes Células B",
    "status_conitec": "Em atualização",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Em atualização). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 62,
    "id_protocolo": "linfoma_folicular",
    "nome_protocolo": "Linfoma Folicular",
    "status_conitec": "Em atualização",
    "tipo_protocolo": "DDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "DDT listado pela CONITEC/Ministério da Saúde (Em atualização). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 63,
    "id_protocolo": "marca_passos_card_acos",
    "nome_protocolo": "Marca-passos cardíacos",
    "status_conitec": "Em atualização",
    "tipo_protocolo": "Protocolo de Uso",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "Protocolo de Uso listado pela CONITEC/Ministério da Saúde (Em atualização). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 64,
    "id_protocolo": "mieloma_m_ltiplo",
    "nome_protocolo": "Mieloma Múltiplo",
    "status_conitec": "Aprovado*",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Aprovado*). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 65,
    "id_protocolo": "mucopolissacaridose_do_tipo_ii",
    "nome_protocolo": "Mucopolissacaridose do tipo II",
    "status_conitec": "Aprovado*",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Aprovado*). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 66,
    "id_protocolo": "neoplasia_maligna_epitelial_de_ov_rio",
    "nome_protocolo": "Neoplasia Maligna Epitelial de Ovário",
    "status_conitec": "Em atualização",
    "tipo_protocolo": "DDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "DDT listado pela CONITEC/Ministério da Saúde (Em atualização). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 67,
    "id_protocolo": "nirsevimabe_para_a_preven_o_de_infec_o_do_trato_respirat_rio_inferior_associado_ao_v_rus_sincicial_respirat_rio",
    "nome_protocolo": "Nirsevimabe para a prevenção de infecção do trato respiratório inferior associado ao vírus sincicial respiratório.",
    "status_conitec": "Em elaboração",
    "tipo_protocolo": "Protocolo de Uso",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "Protocolo de Uso listado pela CONITEC/Ministério da Saúde (Em elaboração). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 68,
    "id_protocolo": "osteoporose",
    "nome_protocolo": "Osteoporose",
    "status_conitec": "Aprovado*",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [
      "M81.0",
      "M81.8",
      "M81.9"
    ],
    "farmacos_principais": [
      "Alendronato de Sódio 70mg",
      "Risedronato 35mg",
      "Carbonato de Cálcio 500mg",
      "Colecalciferol (Vitamina D3) 7000 UI"
    ],
    "conduta_clinica": "Bisfosfonato oral semanal associado a suplementação diária de cálcio e vitamina D se ingesta inadequada. Manter ortostatismo por 30 minutos após dose.",
    "bloco_prescricao_copiavel": "1. Alendronato de Sódio 70mg comprimido: Tomar 1 comprimido por via oral uma vez por semana em jejum estrito com 1 copo de água pura. Não deitar por 30 minutos.\n2. Cálcio 500mg + Vitamina D3 400 UI: Tomar 1 comprimido após almoço.",
    "conteudo_curado": true
  },
  {
    "id_pcdt": 69,
    "id_protocolo": "porfirias",
    "nome_protocolo": "Porfirias",
    "status_conitec": "Aprovado*",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Aprovado*). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 70,
    "id_protocolo": "rastreamento_do_c_ncer_do_colo_do_tero_parte_i_rastreamento_organizado_utilizando_testes_moleculares_para_detec_o_de_dna_hpv_oncog_nico",
    "nome_protocolo": "Rastreamento do Câncer do Colo do Útero: Parte I - Rastreamento organizado utilizando testes moleculares para detecção de DNA-HPV oncogênico",
    "status_conitec": "Aprovado*",
    "tipo_protocolo": "Diretrizes Brasileiras",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "Diretrizes Brasileiras listado pela CONITEC/Ministério da Saúde (Aprovado*). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 71,
    "id_protocolo": "retinopatia_diab_tica",
    "nome_protocolo": "Retinopatia Diabética",
    "status_conitec": "Aprovado*",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Aprovado*). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 72,
    "id_protocolo": "s_ndrome_de_turner",
    "nome_protocolo": "Síndrome de Turner",
    "status_conitec": "Aprovado*",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Aprovado*). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 73,
    "id_protocolo": "s_ndrome_nefr_tica_prim_ria_em_crian_as_e_adolescentes",
    "nome_protocolo": "Síndrome Nefrótica Primária em crianças e adolescentes",
    "status_conitec": "Em atualização",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Em atualização). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 74,
    "id_protocolo": "s_ndromes_coronarianas_agudas",
    "nome_protocolo": "Síndromes Coronarianas Agudas",
    "status_conitec": "Em atualização",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [
      "I20.0",
      "I21.0",
      "I21.1",
      "I21.9",
      "I22"
    ],
    "farmacos_principais": [
      "AAS 100mg",
      "Bissulfato de Clopidogrel 75mg",
      "Atorvastatina 80mg",
      "Succinato de Metoprolol 50mg",
      "Enalapril 10mg"
    ],
    "conduta_clinica": "Dupla Antiagregação Plaquetária (DAPT) imediata (AAS + Clopidogrel/Ticagrelor) por 12 meses pós-evento coronariano, associada a estatina de alta potência (Atorvastatina 80mg).",
    "bloco_prescricao_copiavel": "1. Ácido Acetilsalicílico (AAS) 100mg comprimido: Tomar 1 comprimido por via oral após o almoço diariamente.\n2. Clopidogrel 75mg comprimido: Tomar 1 comprimido por via oral uma vez ao dia.\n3. Atorvastatina 80mg comprimido: Tomar 1 comprimido por via oral à noite.",
    "conteudo_curado": true
  },
  {
    "id_pcdt": 75,
    "id_protocolo": "sobrecarga_de_ferro",
    "nome_protocolo": "Sobrecarga de Ferro",
    "status_conitec": "Aprovado*",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Aprovado*). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 76,
    "id_protocolo": "stents_em_pacientes_com_doen_a_coronariana_est_vel",
    "nome_protocolo": "Stents em Pacientes com Doença Coronariana Estável",
    "status_conitec": "Em atualização",
    "tipo_protocolo": "Diretrizes Brasileiras",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "Diretrizes Brasileiras listado pela CONITEC/Ministério da Saúde (Em atualização). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 77,
    "id_protocolo": "ten_ase",
    "nome_protocolo": "Teníase",
    "status_conitec": "Em elaboração",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Em elaboração). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 78,
    "id_protocolo": "terapia_fotodin_mica_para_tratamento_de_c_ncer_de_pele_n_o_melanoma_do_tipo_carcinoma_basocelular_superficial_e_nodular",
    "nome_protocolo": "Terapia fotodinâmica para tratamento de câncer de pele não melanoma do tipo carcinoma basocelular superficial e nodular",
    "status_conitec": "Aprovado*",
    "tipo_protocolo": "Protocolo de Uso",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "Protocolo de Uso listado pela CONITEC/Ministério da Saúde (Aprovado*). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 79,
    "id_protocolo": "transtorno_afetivo_bipolar_do_tipo_i",
    "nome_protocolo": "Transtorno Afetivo Bipolar do tipo I",
    "status_conitec": "Em atualização",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [
      "F31.0",
      "F31.1",
      "F31.2",
      "F31.3",
      "F31.4",
      "F31.6"
    ],
    "farmacos_principais": [
      "Carbonato de Lítio 300mg",
      "Ácido Valproico 250mg/500mg",
      "Quetiapina 100mg/200mg",
      "Olanzapina 5mg/10mg"
    ],
    "conduta_clinica": "Estabilizador de humor como esteio terapêutico permanente (Lítio ou Valproato). Dosar litemia periódica a cada 3 a 6 meses (janela terapêutica estrita: 0.6 a 1.0 mEq/L).",
    "bloco_prescricao_copiavel": "1. Carbonato de Lítio 300mg comprimido: Tomar 1 comprimido de 12 em 12 horas junto às refeições (monitorar litemia sérica, TSH e creatinina).",
    "conteudo_curado": true
  },
  {
    "id_pcdt": 80,
    "id_protocolo": "tratamento_de_fratura_do_colo_do_f_mur_em_idosos",
    "nome_protocolo": "Tratamento de Fratura do Colo do Fêmur em Idosos",
    "status_conitec": "Em atualização",
    "tipo_protocolo": "Diretrizes Brasileiras",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "Diretrizes Brasileiras listado pela CONITEC/Ministério da Saúde (Em atualização). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 81,
    "id_protocolo": "trombocitopenia_imune_prim_ria",
    "nome_protocolo": "Trombocitopenia Imune Primária",
    "status_conitec": "Conitec",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Conitec). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 82,
    "id_protocolo": "tumor_no_estroma_gastrointestinal",
    "nome_protocolo": "Tumor no Estroma Gastrointestinal",
    "status_conitec": "Em atualização",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Em atualização). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  },
  {
    "id_pcdt": 83,
    "id_protocolo": "uve_tes_n_o_infecciosas",
    "nome_protocolo": "Uveítes não infecciosas",
    "status_conitec": "Em atualização",
    "tipo_protocolo": "PCDT",
    "cids_relacionados": [],
    "farmacos_principais": [],
    "conduta_clinica": "PCDT listado pela CONITEC/Ministério da Saúde (Em atualização). O conteúdo clínico do documento oficial não foi importado: consulte o texto vigente no portal da CONITEC.",
    "bloco_prescricao_copiavel": "",
    "conteudo_curado": false
  }
];
