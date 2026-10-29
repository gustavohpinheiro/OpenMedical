// ARQUIVO GERADO por etl_pipeline/extrator_pcdt_conitec.py - não editar à mão.
// Fonte: Protocolos Clínicos e Diretrizes Terapêuticas - CONITEC/Ministério da Saúde (gov.br/conitec).
// Trechos extraídos automaticamente dos PDFs oficiais; o texto completo de cada seção fica no banco do app desktop.

export interface FarmacoPcdt {
  nome: string;
  chave: string;
  no_rename: boolean;
  id_monografia_ftn: number | null;
}

export interface TrechoPcdt {
  texto: string;
  /** Página do PDF onde a seção começa (0 se não encontrada) */
  pagina: number;
  /** false quando o trecho foi cortado para caber no app */
  completo: boolean;
}

export interface PcdtConitec {
  id_pcdt: number;
  titulo: string;
  portaria: string;
  /** AAAA-MM-DD da publicação da portaria */
  data_portaria: string;
  url_pdf: string;
  url_portaria: string;
  url_publicacao_ms: string;
  url_resumido: string;
  paginas: number;
  /** false: PDF digitalizado (sem texto) ou não baixado */
  tem_texto: boolean;
  cids: string[];
  farmacos: FarmacoPcdt[];
  secoes_disponiveis: string[];
  medicamentos: TrechoPcdt;
  esquemas: TrechoPcdt;
}

export const FONTE_PCDT_CONITEC = "Protocolos Clínicos e Diretrizes Terapêuticas - CONITEC/Ministério da Saúde (gov.br/conitec)";
export const URL_PAGINA_PCDT = "https://www.gov.br/conitec/pt-br/assuntos/avaliacao-de-tecnologias-em-saude/protocolos-clinicos-e-diretrizes-terapeuticas/pcdt";
export const PCDT_VERIFICADO_EM = "2026-10-28";

export const PCDT_CONITEC: PcdtConitec[] = [
 {
  "id_pcdt": 1,
  "titulo": "Acidentes Escorpiônicos",
  "portaria": "Portaria SECTICS/MS nº 59 - 01/08/2025",
  "data_portaria": "2025-08-05",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-acidentes-escorpionicos/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2025/portaria-sectics-ms-no-59-de-1o-de-agosto-de-2025/@@display-file/file",
  "url_publicacao_ms": "https://www.gov.br/conitec/pt-br/midias/protocolos/2026/publicacao-ms/pcdt-acidentes-escorpionicos/@@display-file/file",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/2026/pcdt-resumido/pcdt_acidentes-escopionicos_f.pdf/@@display-file/file",
  "paginas": 50,
  "tem_texto": true,
  "cids": [
   "T63.2",
   "X22"
  ],
  "farmacos": [
   {
    "nome": "soro antiescorpionico",
    "chave": "soro antiescorpionico",
    "no_rename": false,
    "id_monografia_ftn": 291
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "esquemas",
   "criterios_interrupcao",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "Soro antiescorpiônico - Soro Antiescorpiônico (SAEsc) solução injetável que contém imunoglobulinas heterólogas que neutralizam 1,0 mg de veneno-referência de Tityus serrulatus (soroneutralização em camundongo) por mL de soro.\n18 Indicado para o tratamento dos envenenamentos causados por picadas de escorpiões do gênero Tityus. As imunoglobulinas específicas presentes no soro se ligam ao veneno que ainda não se fixou nas células dos tecidos-alvo, neutralizando-o61.\nSoro antiaracnídico: Na ausência do soro antiescorpiônico",
   "pagina": 17,
   "completo": false
  },
  "esquemas": {
   "texto": "Há incertezas quanto às doses de antiveneno no esquema de administração atualmente adotado. Os estudos incluídos em uma síntese de evidências sobre o uso de soroterapia no escorpionismo (Apêndice 1) identificaram ampla variação na quantidade de soro antiveneno usado: de 1 a 20 frascos-ampolas, administrados de acordo com a gravidade dos casos. Isso diverge das orientações do Ministério da Saúde, especialmente nos casos leves, para os quais não há indicação do uso de soro antiveneno.\nDada a heterogeneidade das evidências disponíveis sobre as doses de soro antiveneno a serem utilizadas, bem como a escassez de estudos específicos para a população pediátrica, não se justifica uma atualização nas orientações das doses de antiveneno estabelecidas pelo Ministério da Saúde para o tratamento do escorpionismo, e esta deve ser utilizada para determinar as quantidades de terapia antiveneno (Quadro 5). O uso racional do soro deve ser priorizado e é fundamental que a administração seja realizada de forma criteriosa, considerando a gravidade do envenenamento e os riscos associados ao tratamento.\nQuadro 5. Classificação do escorpionismo quanto à gravidade e ao tratamento específico.\nClassificação Soro antiveneno SAEsc* ou SAA** Leve\n- Moderado 3 frascos-ampolas Grave 6 frascos-ampolas *SAEsc: Soro Antiescorpiônico; **SAA: Soro Antiaracnídico (Loxosceles, Phoneutria e Tityus).\nNota: Não devem ser administrados mais que 6 frascos-ampolas.\nFonte: adaptado de Funasa, 20011.\nO soro antiescorpiônico deve ser administrado por via intravenosa ou, em situações em que não for possível o acesso venoso, por via intraóssea (na indisponibilidade de acesso venoso).\nNa administração intravenosa, a solução deve ser diluída em cloreto de sódio a 0,9% (soro fisiológico) ou em solução glicosada a 5%, na proporção de 1:2 a 1:5, podendo ser realizada também na proporção 1:1 33,39,59,61. Quando diluído, o soro antiveneno parece reduzir a frequência de reações adversas59. A infusão deve ser realizada em um período de 10 a 15 minutos ou em 19 bolus, com uma velocidade de 8 a 12 mL/min, com atenção especial ao risco de sobrecarga hídrica em crianças com insuficiência cardíaca e/ou EAP39,59,61.\nQuando necessário, o uso de soro antiaracnídico deve seguir as mesmas recomendações aplicadas ao soro antiescorpiônico, exceto pelo tempo de infusão, que deve ser maior (entre 20 e 60 minutos)38,62.",
   "pagina": 18,
   "completo": false
  }
 },
 {
  "id_pcdt": 2,
  "titulo": "Acidentes Ofídicos",
  "portaria": "Portaria SECTICS/MS nº 83 - 07/10/2025",
  "data_portaria": "2025-10-09",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt_acidentes_ofidicos_final.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2025/portaria-sectics-ms-no-83-de-7-de-outubro-de-2025/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/2026/pcdt-resumido/pcdt-resumido-acidentes-ofidicos/@@display-file/file",
  "paginas": 84,
  "tem_texto": true,
  "cids": [
   "T63.0",
   "X20"
  ],
  "farmacos": [
   {
    "nome": "cloreto de sodio",
    "chave": "cloreto de sodio",
    "no_rename": true,
    "id_monografia_ftn": 78
   },
   {
    "nome": "sodio",
    "chave": "sodio",
    "no_rename": true,
    "id_monografia_ftn": 6
   },
   {
    "nome": "dipirona",
    "chave": "dipirona",
    "no_rename": true,
    "id_monografia_ftn": 139
   },
   {
    "nome": "paracetamol",
    "chave": "paracetamol",
    "no_rename": true,
    "id_monografia_ftn": 256
   },
   {
    "nome": "soro antibotropico (pentavalente) e anticrotalico",
    "chave": "soro antibotropico (pentavalente)",
    "no_rename": true,
    "id_monografia_ftn": 285
   },
   {
    "nome": "soro anticrotalico",
    "chave": "soro anticrotalico",
    "no_rename": true,
    "id_monografia_ftn": 288
   },
   {
    "nome": "soro antielapidico (bivalente)",
    "chave": "soro antielapidico (bivalente)",
    "no_rename": true,
    "id_monografia_ftn": 290
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "esquemas",
   "criterios_interrupcao",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "Foi conduzida uma revisão do escopo para mapear as doses de soroterapia recomendadas na literatura. A revisão evidenciou a ausência de um consenso claro entre os estudos e identificou variações metodológicas importantes, que comprometeram a robustez e confiabilidade dos resultados. Considerando a inexistência de evidências, foram mantidas as orientações de uso racional do Ministério da Saúde quanto ao número de frascos-ampolas recomendados para o tratamento dos acidentes botrópicos, laquéticos, crotálicos e elapídicos (Apêndice 1).\nAs doses da soroterapia antiveneno diferem de acordo com o tipo de acidente ofídico e sua classificação de gravidade (apresentadas nos Quadros 7, 8, 9 e 10)133. Sua administração deve seguir as seguintes orientações:\n- Via de administração: intravenosa52,100,102,111,141.\n- Diluição: deve ser realizada em soro fisiológico ou soro glicosado a 5%; para o soro antielapídico, a diluição deve ocorrer na proporção de 1:2 a 1:5 para reduzir a frequência de reações adversas à soroterapia antiveneno52,100,102,111,141.\n- Velocidade de infusão: entre 8 e 12 mL por minuto, com cautela para que não haja sobrecarga de volume52,100,102,111,141.\nA administração da quantidade recomendada de frascos-ampolas não deve ser fracionada, devendo ser realizada de uma só vez e sempre sob vigilância do profissional de saúde responsável52,100,102,111,141.",
   "pagina": 21,
   "completo": true
  }
 },
 {
  "id_pcdt": 3,
  "titulo": "Acidente Vascular Cerebral (AVC) Isquêmico Agudo",
  "portaria": "Portaria Conjunta SAES/SECTICS/MS nº 29 - 12/12/2023",
  "data_portaria": "2023-12-15",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/tromb-lise-no-acidente-vascular-cerebral-isqu-mico-agudo.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2023/portaria-conjunta-saes-sectics-no-29.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/pcdt-resumido-avc.pdf/@@display-file/file",
  "paginas": 83,
  "tem_texto": true,
  "cids": [
   "I63.0",
   "I63.1",
   "I63.2",
   "I63.3",
   "I63.4",
   "I63.5",
   "I63.6",
   "I63.8",
   "I63.9"
  ],
  "farmacos": [
   {
    "nome": "alteplase",
    "chave": "alteplase",
    "no_rename": false,
    "id_monografia_ftn": 20
   },
   {
    "nome": "estreptoquinase",
    "chave": "estreptoquinase",
    "no_rename": false,
    "id_monografia_ftn": 149
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "esquemas",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "- Alteplase: 0,9 mg/kg (máximo de 90 mg), por via intravenosa, com 10% da dose aplicada em bolus e o restante, continuamente, ao longo de 60 minutos. A administração da alteplase deve ocorrer em até 4 horas e 30 minutos do início dos sintomas de AVCi.",
   "pagina": 10,
   "completo": true
  }
 },
 {
  "id_pcdt": 4,
  "titulo": "Acromegalia",
  "portaria": "Portaria Conjunta SAES/SECTICS/MS nº 23 - 22/10/2025",
  "data_portaria": "2025-10-31",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/portaria-no-23-pcdt-acromegalia.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2025/portaria-conjunta-saes-sectics-no-23-de-22-de-outubro-de-2025.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/pcdt_resumido_acromegalia/@@display-file/file",
  "paginas": 25,
  "tem_texto": true,
  "cids": [
   "E22.0"
  ],
  "farmacos": [
   {
    "nome": "octreotida",
    "chave": "octreotida",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "lanreotida",
    "chave": "lanreotida",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "cabergolina",
    "chave": "cabergolina",
    "no_rename": true,
    "id_monografia_ftn": 46
   },
   {
    "nome": "pasireotida",
    "chave": "pasireotida",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "esquemas",
   "criterios_interrupcao",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Acetato de octreotida: solução injetável de 0,1 mg/mL; pó para suspensão injetável de 10 mg, 20 mg e 30 mg;\n- Acetato de lanreotida solução injetável de liberação controlada de 60 mg, 90 mg e 120 mg;\n- Cabergolina: comprimido de 0,5 mg;\n11 - Pamoato de pasireotida: pó para suspensão injetável de 10 mg, 20 mg, 40 mg e 60 mg.",
   "pagina": 10,
   "completo": true
  },
  "esquemas": {
   "texto": "Acetato de octreotida de liberação prolongada: administrações intramusculares em região glútea profunda a cada 4 semanas, dose mínima de 10 mg e dose máxima de 30 mg (a dose inicial recomendada em bula é de 20 mg). Os ajustes na dose devem ser feitos a intervalos trimestrais, de acordo com a resposta clínica, os eventos adversos e os níveis séricos de IGF-I, e após o controle da atividade da doença (normalização dos níveis de IGF-I), podem ser espaçados para controles semestrais ou anuais. As aplicações devem ser feitas por profissional treinado e habilitado87.\nAcetato de octreotida: dose inicial de 0,05 a 0,1 mg por injeção subcutânea a cada 8 ou 12 horas. A dose ideal diária na maioria dos pacientes é de 0,3 mg. A dose máxima é de 1,5 mg/dia. O ajuste posológico deve ser baseado na avaliação mensal dos níveis de GH e IGF-I, e dos sintomas clínicos, e na tolerabilidade87.\nLanreotida: administrações subcutâneas profundas em região glútea a cada 4 semanas, podendo ser estendida para 6 a 8 semanas. A dose inicial recomendada para tratamento de acromegalia pode variar de 60 mg a 120 mg. Os ajustes devem ser feitos a intervalos trimestrais de acordo com a resposta clínica, eventos adversos e os níveis séricos de IGF-I. Após o controle da atividade da doença (normalização dos níveis de IGF-I), os controles podem ser espaçados, com frequência semestral ou anual. As aplicações devem ser feitas por profissional treinado e habilitado88.\nCabergolina: as doses são gradativamente tituladas até atingir 2 a 3 mg/semana, por via oral, com controle mensal ou bimestral, observando-se a resposta clínica, os eventos adversos e os níveis séricos de IGF-I. Nos casos de controle da atividade da doença (normalização dos níveis de IGF-I), o monitoramento pode ser espaçado para frequência semestral ou anual.",
   "pagina": 11,
   "completo": false
  }
 },
 {
  "id_pcdt": 5,
  "titulo": "Adenocarcinoma de Cólon e Reto",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 25 - 17/11/2025",
  "data_portaria": "2025-12-11",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/adenocarcinoma-de-colon-e-de-reto-pcdt/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2025/portaria-conjunta-saes-sctie-no-26-de-25-de-novembro-de-2025/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/2026/pcdt-resumido/PCDT_Resumido_Adenocarcinoma_Clon_Retof.pdf/@@display-file/file",
  "paginas": 38,
  "tem_texto": true,
  "cids": [
   "C18",
   "C18.0",
   "C18.1",
   "C18.2",
   "C18.3",
   "C18.4",
   "C18.5",
   "C18.6",
   "C18.7",
   "C18.8",
   "C18.9",
   "C19",
   "C20"
  ],
  "farmacos": [
   {
    "nome": "diafragma",
    "chave": "diafragma",
    "no_rename": false,
    "id_monografia_ftn": 130
   },
   {
    "nome": "fluoruracila",
    "chave": "fluoruracila",
    "no_rename": false,
    "id_monografia_ftn": 168
   },
   {
    "nome": "acido folinico",
    "chave": "acido folinico",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "oxaliplatina",
    "chave": "oxaliplatina",
    "no_rename": false,
    "id_monografia_ftn": 249
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 6,
  "titulo": "Adenocarcinoma de estômago",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 100 - 20/10/2026",
  "data_portaria": "2026-10-28",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/2026/pcdt_adenocarcinoma-de-estomago.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2026/portaria-conjunta-saes-sctie-no-100-de-20-de-outubro-de-2026.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 34,
  "tem_texto": true,
  "cids": [
   "C16.0",
   "C16.1",
   "C16.2",
   "C16.3",
   "C16.4",
   "C16.5",
   "C16.6",
   "C16.8",
   "C16.9",
   "C15.5"
  ],
  "farmacos": [
   {
    "nome": "oxaliplatina",
    "chave": "oxaliplatina",
    "no_rename": false,
    "id_monografia_ftn": 249
   },
   {
    "nome": "docetaxel",
    "chave": "docetaxel",
    "no_rename": false,
    "id_monografia_ftn": 142
   },
   {
    "nome": "cisplatina",
    "chave": "cisplatina",
    "no_rename": false,
    "id_monografia_ftn": 65
   },
   {
    "nome": "fluoruracila",
    "chave": "fluoruracila",
    "no_rename": false,
    "id_monografia_ftn": 168
   },
   {
    "nome": "carboplatina",
    "chave": "carboplatina",
    "no_rename": false,
    "id_monografia_ftn": 52
   },
   {
    "nome": "paclitaxel",
    "chave": "paclitaxel",
    "no_rename": false,
    "id_monografia_ftn": 253
   },
   {
    "nome": "acido folinico",
    "chave": "acido folinico",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "monitoramento",
   "criterios_interrupcao"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 7,
  "titulo": "Adenocarcinoma de Próstata",
  "portaria": "Portaria SAES/SCTIE/MS nº 97 - 10/10/2026",
  "data_portaria": "2026-10-28",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/2026/pcdt_adenocarcinoma-de-prostata.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2026/portaria-conjunta-saes-sctie-no-97-de-20-de-outubro-de-2026.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 117,
  "tem_texto": true,
  "cids": [
   "C61"
  ],
  "farmacos": [
   {
    "nome": "leuprorrelina",
    "chave": "leuprorrelina",
    "no_rename": true,
    "id_monografia_ftn": 3
   },
   {
    "nome": "triptorrelina",
    "chave": "triptorrelina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "gosserrelina",
    "chave": "gosserrelina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "prednisona",
    "chave": "prednisona",
    "no_rename": true,
    "id_monografia_ftn": 267
   },
   {
    "nome": "docetaxel",
    "chave": "docetaxel",
    "no_rename": false,
    "id_monografia_ftn": 142
   },
   {
    "nome": "dexametasona",
    "chave": "dexametasona",
    "no_rename": true,
    "id_monografia_ftn": 129
   },
   {
    "nome": "cetoconazol",
    "chave": "cetoconazol",
    "no_rename": true,
    "id_monografia_ftn": 61
   },
   {
    "nome": "calcio",
    "chave": "calcio",
    "no_rename": true,
    "id_monografia_ftn": 50
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "monitoramento",
   "criterios_interrupcao"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 8,
  "titulo": "Amiloidoses Associadas à Transtirretina",
  "portaria": "Portaria Conjunta SAES/SECTICS/MS nº 12 - 24/07/2025",
  "data_portaria": "2025-08-01",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/AmiloidosesAssociadasaTranstirretina.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2025/PortariaConjuntaSAESSECTICSN12DE29DEjulhoDE2025.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/pcdt-resumido-amiloidoses-transtirretina/@@display-file/file",
  "paginas": 28,
  "tem_texto": true,
  "cids": [],
  "farmacos": [
   {
    "nome": "tafamidis",
    "chave": "tafamidis",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "tafamidis meglumina",
    "chave": "tafamidis meglumina",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "medicamentos",
   "esquemas",
   "criterios_interrupcao"
  ],
  "medicamentos": {
   "texto": "- Tafamidis meglumina: cápsulas de 20 mg;\n- Tafamidis: cápsulas de 61 mg.",
   "pagina": 10,
   "completo": true
  },
  "esquemas": {
   "texto": "Tafamidis meglumina:\nPara tratamento de pacientes com ATTR-PN hereditária (familiar), tafamidis meglumina 20 mg por via oral (VO), uma vez ao dia, ingerida com ou sem alimentos. Não são necessários ajustes de dose para pacientes idosos (acima de 65 anos), nem para pacientes com comprometimento renal ou comprometimento hepático leve ou moderado55. O medicamento não deve ser prescrito para a população pediátrica, uma vez que a ATTR-PN não é uma doença presente nesta população55, nem para gestantes e lactantes56;\nTafamidis:\nPara tratamento de pacientes com ATTR-CM, tafamidis 61 mg por VO, uma vez ao dia.\nNota: Por serem medicamentos diferentes, é importante ressaltar que tafamidis e tafamidis meglumina não são intercambiáveis por mg.\n6.3.1. Eventos adversos Os eventos adversos em geral são leves e bem tolerados. Os mais comuns são diarreia, dor abdominal, infecção urinária e infecção vaginal55,56. Tafamidis contém sorbitol, portanto, pacientes com problemas hereditários de intolerância à frutose não devem tomar este medicamento55.",
   "pagina": 10,
   "completo": true
  }
 },
 {
  "id_pcdt": 9,
  "titulo": "Anemia na Doença Renal Crônica - Alfaepoetina",
  "portaria": "Portaria SAS/MS nº 365 - 15/02/2017",
  "data_portaria": "2017-02-23",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt_anemia_doencarenalcronica.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2017/portariasas365_15022017.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 24,
  "tem_texto": true,
  "cids": [
   "N18.0",
   "N18.8"
  ],
  "farmacos": [
   {
    "nome": "alfaepoetina",
    "chave": "alfaepoetina",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "medicamentos",
   "esquemas",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Alfaepoetina: frasco-ampola com 1.000 UI, 2.000 UI, 3.000 UI, 4.000 UI e 10.000 UI.\nMINISTÉRIO DA SAÚDE SECRETARIA DE ATENÇÃO À SAÚDE",
   "pagina": 12,
   "completo": true
  },
  "esquemas": {
   "texto": "Adultos Pacientes adultos em tratamento conservador ou em diálise peritoneal podem ser tratados inicialmente com uma das seguintes opções, ajustadas posteriormente de acordo com a resposta terapêutica:\n- 50-100 UI/kg, via SC, divididas em uma a três aplicações por semana;\n- 10.000 UI, via SC, uma vez por semana; ou - 20.000 UI, via SC, uma vez a cada 2 semanas;\nPacientes em hemodiálise podem ser tratados inicialmente com uma das seguintes opções, ajustadas posteriormente de acordo com a resposta terapêutica:\n- 50-100 UI/kg, via SC, divididas em uma a três aplicações por semana ou - 50-100 UI/kg, via SC, divididas em três aplicações por semana.\nDiversos nomogramas para ajuste de dose de alfaepoetina foram descritos em pacientes com DRC (47-49). A maioria, contudo, não foi validada de forma prospectiva. Inexistem comparações diretas entre diferentes estratégias de ajuste de dose. Sugere-se que os pacientes tenham a sua hemoglobina monitorizada a cada 2 semanas após cada ajuste de dose até a estabilização e, a partir de então, a cada 4 semanas. As doses devem ser corrigidas conforme o nível de hemoglobina e desde que as reservas de ferro estejam adequadas:\n- Se, após 4 semanas de tratamento, a elevação de hemoglobina for inferior a 0,3 g/dL por semana: aumentar a dose em 25%, respeitando-se o limite da dose máxima, que é de 300 UI/kg/semana por via subcutânea e 450 UI/kg/semana por via intravenosa.\n- Se, após 4 semanas de tratamento, a elevação de hemoglobina estiver no intervalo de 0,3-0,5 g/dL por semana: manter a dose em uso.\n- Se após 4 semanas, a elevação de hemoglobina for maior que 0,5 g/dL por semana ou o nível de hemoglobina estiver entre 12 e 13 g/dL: reduzir a dose em 25% a 50%, respeitando o limite da dose mínima recomendada, que é de 50 UI/kg/semana via SC.\n- Suspender temporariamente o tratamento se o nível de hemoglobina estiver superior a 13 g/dL. Quanto ao reinício, não há recomendação específica;\nentretanto, deve-se aguardar a queda da hemoglobina, quando hemoglobina estiver entre 10 e 12 g/dL, para reiniciar a eritropoetina com dose menor.\nAntes de cada ajuste de dose de alfaepoetina, os níveis séricos de ferritina e saturação da transferrina devem ser avaliados e mantidos de acordo com o Protocolo Clínico e Diretrizes Terapêuticas da Anemia na Doença Renal Crônica – Reposição de Ferro.",
   "pagina": 13,
   "completo": false
  }
 },
 {
  "id_pcdt": 10,
  "titulo": "Anemia na Doença Renal Crônica - Reposição de Ferro",
  "portaria": "Portaria SAS/MS nº 365 - 15/02/2017",
  "data_portaria": "2017-02-23",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt_irc_ferro.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2017/portariasas365_15022017.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 22,
  "tem_texto": true,
  "cids": [],
  "farmacos": [
   {
    "nome": "sacarato de hidróxido férrico",
    "chave": "sacarato de hidroxido ferrico",
    "no_rename": false,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "medicamentos",
   "esquemas",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Sulfato ferroso: comprimidos de 40 mg, solução oral de 25 mg/mL e xarope de 5 mg/mL - Sacarato de hidróxido férrico: solução injetável de 100 mg, frasco de 5 mL MINISTÉRIO DA SAÚDE SECRETARIA DE ATENÇÃO À SAÚDE",
   "pagina": 11,
   "completo": true
  },
  "esquemas": {
   "texto": "Adultos - Sulfato ferroso: dose de 40 mg, via oral, três vezes ao dia, nos intervalos das refeições.\n- Sacarato de hidróxido férrico: uso intravenoso, conforme esquema abaixo:\nDose teste: os estudos clínicos que avaliaram a segurança do sacarato de hidróxido férrico demonstraram que o medicamento é seguro e que a utilização de dose teste, apesar de recomendada pelo fabricante, pode ser dispensada (45). Quando utilizada, a dose teste deve ser realizada na primeira administração e consiste em diluir 25 mg de ferro elementar em 100 mL de solução salina e administrar via intravenosa em no mínimo 15 minutos. Deve-se aguardar 15 minutos antes de administrar o restante da primeira dose ou repor as doses necessárias nos dias subsequentes, caso não ocorram reações adversas como cefaleia, náuseas, vômitos, parestesias, distúrbios gastrointestinais, dores musculares, febre, hipotensão, urticária, rubor e reação anafilática.\nDose de ataque: indicada quando o nível de ferritina sérica for inferior a 200 ng/mL ou a saturação de transferrina for inferior a 20%. Pode-se administrar 1.000 mg de ferro, divididos em 10 sessões de hemodiálise ou em 10 dias diferentes (duas ou três vezes por semana) nos pacientes em diálise peritoneal ou em tratamento conservador (19).\nDose de manutenção: indicada para manter os estoques adequados de ferro em pacientes com níveis de ferritina superiores a 200 ng/mL e saturação da transferrina superior a 20%. Administrar 100 mg de ferro por via intravenosa em dose única a cada 15 dias (19). A dose deve ser diluída em no mínimo 100 mL de solução fisiológica e infundida em 5 a 15 minutos. Estudo demonstra segurança do seu uso em tempos de administração menores, de até 5 minutos, sem aumento de reações adversas (45).\nMINISTÉRIO DA SAÚDE SECRETARIA DE ATENÇÃO À SAÚDE Crianças Nos estágios iniciais da DRC, ferro por via oral pode ser utilizada. A dose recomendada para uso de ferro oral é de 6 mg/kg/dia com no máximo 150 a 300 mg de ferro elementar, dividido em duas a três tomadas, duas horas antes ou uma hora após alimentação para maximizar a absorção gastrointestinal.\nReposição de ferro para crianças em diálise peritoneal: administrar dose mensal de 5 mg/Kg (sem exceder 200 mg de ferro por infusão) diluindo em 200 ml de soro fisiológico e aumentando o tempo da infusão para 60 minutos. O aumento da dose, nestes casos, tem como objetivo evitar as punções venosas repetidas.",
   "pagina": 12,
   "completo": false
  }
 },
 {
  "id_pcdt": 11,
  "titulo": "Anemia Hemolítica Autoimune",
  "portaria": "Portaria Conjunta SAES/SECTICS/MS nº 7 - 1º/07/2025",
  "data_portaria": "2025-07-14",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-anemia-hemolitica-autoimune.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2025/portaria-conjunta-saes-sectics-no-7-de-1-de-julho-de-2025.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/pcdt_resumido_anemia_hemolitica_autoimune-f/@@display-file/file",
  "paginas": 52,
  "tem_texto": true,
  "cids": [],
  "farmacos": [
   {
    "nome": "ácido fólico",
    "chave": "acido folico",
    "no_rename": true,
    "id_monografia_ftn": 10
   },
   {
    "nome": "ciclofosfamida",
    "chave": "ciclofosfamida",
    "no_rename": true,
    "id_monografia_ftn": 62
   },
   {
    "nome": "ciclosporina",
    "chave": "ciclosporina",
    "no_rename": true,
    "id_monografia_ftn": 63
   },
   {
    "nome": "imunoglobulina humana",
    "chave": "imunoglobulina humana",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "metilprednisolona",
    "chave": "metilprednisolona",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "prednisona",
    "chave": "prednisona",
    "no_rename": true,
    "id_monografia_ftn": 267
   }
  ],
  "secoes_disponiveis": [
   "medicamentos",
   "esquemas",
   "tempo_tratamento"
  ],
  "medicamentos": {
   "texto": "- Ácido fólico: comprimidos de 5 mg e solução oral de 0,2 mg/mL.\n- Ciclofosfamida: comprimidos de 50 mg; pó para solução injetável de 1.000 mg e 200 mg.\n- Ciclosporina: cápsulas de 10 mg, 25 mg, 50 mg e 100 mg; solução oral de 100 mg/mL.\n- Imunoglobulina humana: pó para solução injetável ou solução injetável de 0,5 g, 1,0 g, 2,5 g e 5,0 g.\n- Metilprednisolona: pó para solução injetável 500 mg.\n- Prednisona: comprimidos de 5 mg e 20 mg.\nNota: Os medicamentos metilprednisolona e ciclofosfamida pó para solução injetável de 200 mg e 100 mg estão contemplados nos procedimentos de pulsoterapia, sendo seu fornecimento de responsabilidade do serviço, não sendo dispensados no âmbito da Assistência Farmacêutica.\n12",
   "pagina": 9,
   "completo": true
  },
  "esquemas": {
   "texto": "- Ácido Fólico: 5 a 10 mg/dia, por via oral, 1 vez ao dia.\n- Ciclofosfamida: 100 mg/dia, por via oral, ou 500 a 700 mg, por via intravenosa a cada 4 a 6 semanas. Para crianças, a dose preconizada é de 2 mg/kg.\n- Ciclosporina: 5 a 10 mg/kg/dia, por via oral, divididos em 2 doses diárias.\n- Imunoglobulina humana: 400 a 1.000 mg/kg/dia, por via intravenosa, por 5 dias. A manutenção pode ser necessária e é feita a cada 21 dias.\n- Metilprednisolona: 100 a 200 mg/dia por até 14 dias. Para o tratamento da síndrome de Evans, inicia-se habitualmente com 1 mg/kg com o objetivo de elevar os níveis hemoglobina acima de 10 g/dL e as plaquetas acima 50.000/mm3, realizando posteriormente redução lenta da dose.\n- Prednisona: dose inicial de 1 mg/kg/dia para adultos. Para criança, a dose pode ser superior (1 a 2 mg/kg/dia). Quando os níveis de hemoglobina se encontram acima de 10 g/dL, as doses de prednisona podem ser reduzidas para 0,5 mg/kg/dia após 2 semanas. Mantendo-se controlados os níveis de hemoglobina, a prednisona deve ser diminuída lentamente no período de 3 meses37.",
   "pagina": 10,
   "completo": true
  }
 },
 {
  "id_pcdt": 12,
  "titulo": "Anemia por Deficiência de Ferro",
  "portaria": "Portaria SAS/MS nº 1.247 - 10/11/2014",
  "data_portaria": "2014-11-11",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/consultas/relatorios/2014/pcdt_anemia_deficienciaferro_2014.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2014/portaria_sas_1247_2014.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 20,
  "tem_texto": true,
  "cids": [
   "D50.0",
   "D50.8"
  ],
  "farmacos": [
   {
    "nome": "sulfato ferroso",
    "chave": "sulfato ferroso",
    "no_rename": true,
    "id_monografia_ftn": 319
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "medicamentos",
   "esquemas",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "Uso interno (via oral, VO):\n- Sulfato Ferroso ‑ 40 mg de ferro elementar por comprimido\n- Sulfato Ferroso ‑ 25 mg/mL de ferro elementar em solução oral\n- Sulfato Ferroso ‑ 5 mg/ mL de ferro elementar em xarope Uso intravenoso (IV):\n- Sacarato de hidróxido férrico 100 mg de ferro injetável, frasco‑ampola de 5 mL",
   "pagina": 10,
   "completo": true
  },
  "esquemas": {
   "texto": "As doses terapêuticas usuais dos medicamentos preconizados neste Protocolo são:\nSulfato ferroso – tratamento:\n- crianças: 3 a 6 mg/kg/dia de ferro elementar, sem ultrapassar 60 mg/dia.\n- gestantes: 60 a 200 mg/dia de ferro elementar associadas a 400 mcg/dia de ácido fólico.\n- adultos: 120 mg/dia de ferro elementar.\n- idosos: 15 mg/dia de ferro elementar.\nSacarato de hidróxido férrico – tratamento:\nFórmula para cálculo da dose total IV de ferro a ser administrada:\nFerro (mg) = (Hb desejada conforme sexo e idade do paciente – Hb atual em g/dL) x Peso corporal (kg) x 2,4 + 500 mg A dose deve ser administrada em hospital, em infusão IV lenta, por 30 minutos, de uma a três vezes na semana, com intervalos mínimos de 48 horas e não ultrapassando 300 mg em cada dose.\nPara as gestantes o peso corporal deve ser o de antes da gestação. (47)",
   "pagina": 10,
   "completo": true
  }
 },
 {
  "id_pcdt": 13,
  "titulo": "Angioedema associado à deficiência de C1 esterase",
  "portaria": "Portaria SAS/MS nº 880 - 12/07/2016",
  "data_portaria": "2016-07-15",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt_angioedema-deficincia-c1esterase_2016.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2016/portaria_sas_880_2016.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 11,
  "tem_texto": true,
  "cids": [
   "D84.1"
  ],
  "farmacos": [
   {
    "nome": "danazol",
    "chave": "danazol",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "medicamentos",
   "esquemas",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Danazol: cápsula de 100 e 200 mg",
   "pagina": 6,
   "completo": true
  },
  "esquemas": {
   "texto": "- Danazol: 200 mg, por via oral, divididos em duas administrações diárias, durante o primeiro mês. Após o primeiro mês, a dose deve ser ajustada conforme resposta clínica e laboratorial (ver Monitorização). Dose máxima diária de 600 mg para profilaxia a longo prazo (o uso de doses acima de 200 mg/dia, nesses casos, deve ser considerado somente em casos especiais – item 7 Casos Especiais) (14).\nNos casos em que o paciente será exposto à situação potencialmente desencadeadora de crise, o danazol deve ser administrado na dose de 400-600 mg/dia nos 5 dias anteriores ao procedimento, e nos 3 dias posteriores ao procedimento (1).",
   "pagina": 6,
   "completo": true
  }
 },
 {
  "id_pcdt": 14,
  "titulo": "Artrite Psoriásica",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 37 - 21/01/2026",
  "data_portaria": "2026-01-23",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-da-artrite-psoriasica/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2026/portaria-conjunta-saes-sctie-no-37-de-21-de-janeiro-de-2026/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/2026/pcdt-resumido/pcdt-resumido-artrite-psoriasica/@@display-file/file",
  "paginas": 46,
  "tem_texto": true,
  "cids": [],
  "farmacos": [
   {
    "nome": "ibuprofeno",
    "chave": "ibuprofeno",
    "no_rename": true,
    "id_monografia_ftn": 193
   },
   {
    "nome": "naproxeno",
    "chave": "naproxeno",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "prednisona",
    "chave": "prednisona",
    "no_rename": true,
    "id_monografia_ftn": 267
   },
   {
    "nome": "ciclosporina",
    "chave": "ciclosporina",
    "no_rename": true,
    "id_monografia_ftn": 63
   },
   {
    "nome": "sulfassalazina",
    "chave": "sulfassalazina",
    "no_rename": true,
    "id_monografia_ftn": 303
   },
   {
    "nome": "metotrexato",
    "chave": "metotrexato",
    "no_rename": true,
    "id_monografia_ftn": 229
   },
   {
    "nome": "leflunomida",
    "chave": "leflunomida",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "adalimumabe",
    "chave": "adalimumabe",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "etanercepte",
    "chave": "etanercepte",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "infliximabe",
    "chave": "infliximabe",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "golimumabe",
    "chave": "golimumabe",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "secuquinumabe",
    "chave": "secuquinumabe",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "certolizumabe pegol",
    "chave": "certolizumabe pegol",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "tofacitinibe e ixequizumabe",
    "chave": "tofacitinibe",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "esquemas",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Adalimumabe: solução injetável de 40 mg;\n- Certolizumabe Pegol: solução injetável de 200 mg/mL;\n- Ciclosporina: cápsulas de 10 mg, 25 mg, 50 mg e 100 mg; solução oral 100 mg/mL;\n- Etanercepte: solução injetável de 25 mg e 50 mg.\n- Golimumabe: solução injetável de 50 mg.\n- Ibuprofeno: comprimidos revestidos de 200 mg, 300 mg e 600 mg; suspensão oral de 50 mg/mL.\n- Infliximabe: pó para solução injetável de 100 mg/10 mL;\n- Ixequizumabe: solução injetável de 80 mg;\n- Leflunomida: comprimidos de 20 mg;\n- Metilprednisolona: frasco de 40 mg/2 mL;\n- Metotrexato: comprimidos de 2,5 mg; solução injetável (frasco com 2 mL);\n- Naproxeno: comprimidos de 250 mg e 500 mg;\n- Prednisona: comprimidos de 5 mg e 20 mg;\n- Secuquinumabe: solução injetável com 150 mg/mL;\n- Sulfassalazina: comprimidos de 500 mg;\n- Tofacitinibe: comprimidos de 5 mg.\nNota: O medicamento metilprednisolona está contemplado em procedimentos de infiltração, sendo seu fornecimento de responsabilidade do serviço, não sendo dispensados no âmbito da Assistência Farmacêutica.",
   "pagina": 10,
   "completo": true
  },
  "esquemas": {
   "texto": "- Adalimumabe: 40 mg, por via subcutânea, a cada duas semanas.\n- Certolizumabe pegol: 400 mg (duas injeções de 200 mg cada), por via subcutânea, nas semanas 0, 2 e 4; posteriormente, 200 mg a cada duas semanas ou 400 mg a cada quatro semanas. Aprovado apenas para pacientes adultos.\n- Ciclosporina: 3 a 5 mg/kg/dia, por via oral, divididos em duas administrações (12/12 horas).\n- Etanercepte: 50 mg, por via subcutânea, a cada semana.\n- Golimumabe: 50 mg, por via subcutânea, a cada 4 semanas. Aprovado apenas para pacientes adultos.\n- Ibuprofeno: 600 a 3.200 mg/dia, por via oral, divididos em três administrações (8/8 horas).\n- Infliximabe: 5 mg/kg, por via intravenosa, nas semanas 0, 2 e 6, e, posteriormente, a cada 8 semanas.\n- Ixequizumabe: 160 mg por injeção subcutânea (duas injeções de 80 mg) na semana 0, seguida de 80 mg a cada 4 semanas. Aprovado apenas para pacientes adultos.\n- Leflunomida: 20 mg, por via oral, uma vez por dia.\n- Metilprednisolona: 4 a 80 mg a cada 3 a 4 meses, por via intra- ou periarticular, a depender do tamanho da articulação:\nGrande: 20 a 80 mg; média: 10 a 40 mg; pequena: 4 a 10 mg.\n- Metotrexato: 7,5 a 25 mg, por via oral, subcutânea ou intramuscular, a cada semana.\n- Naproxeno: 500 a 1.500 mg/dia, por via oral, divididos em três administrações (8/8 horas).\n- Prednisona: 5 a 20 mg/dia, por via oral, divididos em até três administrações (8/8 horas).\n- Secuquinumabe: Para a indicação incorporada ao SUS44 (pacientes com artrite psoriásica com resposta inadequada a anti‐TNFα), a dose é de 300 mg, nas semanas 0, 1, 2, 3 e 4; posteriormente, uma vez a cada quatro semanas. Cada dose de 300 mg é administrada em duas injeções subcutâneas de 150 mg. Aprovado apenas para pacientes adultos.\n- Sulfassalazina: 500 a 3.000 mg/dia, por via oral, divididos em até três administrações (8/8 horas).\n- Tofacitinibe: 5 mg, por via oral, administrada duas vezes ao dia. Aprovado apenas para pacientes adultos.",
   "pagina": 10,
   "completo": true
  }
 },
 {
  "id_pcdt": 15,
  "titulo": "Artrite Reativa",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 6 - 22/04/2021",
  "data_portaria": "2021-04-26",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/20210428_pcdt_artrite_reativa.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2021/20210426_portaria_conjunta_06.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/PCDTResumidoArtriteReativa.pdf/@@display-file/file",
  "paginas": 29,
  "tem_texto": true,
  "cids": [
   "M03.2",
   "M03.6",
   "M02.1",
   "M02.3"
  ],
  "farmacos": [
   {
    "nome": "acetato de betametasona + fosfato dissódico de betametasona",
    "chave": "betametasona + betametasona",
    "no_rename": true,
    "id_monografia_ftn": 1
   },
   {
    "nome": "acetato de metilprednisolona",
    "chave": "metilprednisolona",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "ibuprofeno",
    "chave": "ibuprofeno",
    "no_rename": true,
    "id_monografia_ftn": 193
   },
   {
    "nome": "naproxeno",
    "chave": "naproxeno",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "prednisona",
    "chave": "prednisona",
    "no_rename": true,
    "id_monografia_ftn": 267
   },
   {
    "nome": "sulfassalazina",
    "chave": "sulfassalazina",
    "no_rename": true,
    "id_monografia_ftn": 303
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "casos_especiais",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "esquemas",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Ibuprofeno: comprimidos de 200, 300 e 600 mg; suspensão oral de 50 mg/mL.\n- Naproxeno: comprimidos de 250 e 500 mg.\n- Prednisona: comprimidos de 5mg e 20 mg.\n- Acetato de betametasona + fosfatodissódico de betametasona: suspensão injetável 3 mg/mL + 3 mg/mL.\n- Acetato de metilprednisolona: solução injetável 40mg/mL.\n- Sulfassalazina: comprimidos de 500 mg.",
   "pagina": 9,
   "completo": true
  },
  "esquemas": {
   "texto": "- Ibuprofeno: 600 a 2.700 mg/dia, divididas em três administrações (8h/8h).\n- Naproxeno: 500 a 1000 mg/dia, divididas em duas administrações (12/12h) (usar a menor dose pelo menor tempo possível).\n- Prednisona: 5 a 20mg, 1 a 2x/dia, pelo menor tempo necessário para controle das manifestações articulares e extra-articulares agudas.\n- Acetato de betametasona + fosfatodissódico de betametasona: 1 ampola intramuscular a cada 4 semanas, pelo menor tempo necessário para controle das manifestações articulares e extra-articulares agudas;\nou 1 ampola periarticular em dose única.\n- Acetato de metilprednisolona: 1 a 2 mL intra-articular em dose única.\n- Sulfassalazina: 500 a 3000mg/dia, 1 a 3x/dia, por 3 a 6 meses ou até a remissão da doença articular inflamatória.",
   "pagina": 9,
   "completo": true
  }
 },
 {
  "id_pcdt": 16,
  "titulo": "Artrite Reumatoide",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 33 - 19/01/2026",
  "data_portaria": "2026-01-23",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-da-artrite-reumatoide/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2026/portaria-conjunta-saes-sctie-no-33-de-19-de-janeiro-de-2026/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/2026/pcdt-resumido/pcdt-resumido-artrite-reumatoide/@@display-file/file",
  "paginas": 180,
  "tem_texto": true,
  "cids": [
   "M05.0",
   "M05.1",
   "M05.2",
   "M05.3",
   "M05.8",
   "M06.0",
   "M06.8"
  ],
  "farmacos": [
   {
    "nome": "abatacepte",
    "chave": "abatacepte",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "adalimumabe",
    "chave": "adalimumabe",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "azatioprina",
    "chave": "azatioprina",
    "no_rename": true,
    "id_monografia_ftn": 33
   },
   {
    "nome": "baricitinibe",
    "chave": "baricitinibe",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "certolizumabe pegol",
    "chave": "certolizumabe pegol",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "ciclosporina",
    "chave": "ciclosporina",
    "no_rename": true,
    "id_monografia_ftn": 63
   },
   {
    "nome": "ciclofosfamida",
    "chave": "ciclofosfamida",
    "no_rename": true,
    "id_monografia_ftn": 62
   },
   {
    "nome": "cloroquina",
    "chave": "cloroquina",
    "no_rename": false,
    "id_monografia_ftn": 135
   },
   {
    "nome": "etanercepte",
    "chave": "etanercepte",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "golimumabe",
    "chave": "golimumabe",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "hidroxicloroquina",
    "chave": "hidroxicloroquina",
    "no_rename": true,
    "id_monografia_ftn": 312
   },
   {
    "nome": "ibuprofeno",
    "chave": "ibuprofeno",
    "no_rename": true,
    "id_monografia_ftn": 193
   },
   {
    "nome": "infliximabe",
    "chave": "infliximabe",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "leflunomida",
    "chave": "leflunomida",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "metilprednisolona",
    "chave": "metilprednisolona",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "metotrexato",
    "chave": "metotrexato",
    "no_rename": true,
    "id_monografia_ftn": 229
   },
   {
    "nome": "naproxeno",
    "chave": "naproxeno",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "prednisolona",
    "chave": "prednisolona",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "prednisona",
    "chave": "prednisona",
    "no_rename": true,
    "id_monografia_ftn": 267
   },
   {
    "nome": "rituximabe",
    "chave": "rituximabe",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "sulfassalazina",
    "chave": "sulfassalazina",
    "no_rename": true,
    "id_monografia_ftn": 303
   },
   {
    "nome": "tocilizumabe",
    "chave": "tocilizumabe",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "tofacitinibe",
    "chave": "tofacitinibe",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "upadacitinibe",
    "chave": "upadacitinibe",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "esquemas",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "Os medicamentos incluídos neste Protocolo para o tratamento da artrite reumatoide são:\nAnti-inflamatórios não esteroidais (AINE) - Ibuprofeno: comprimidos de 200, 300 e 600 mg; suspensão oral de 50 mg/mL.\n- Naproxeno: comprimidos de 250 e 500 mg.\nGlicocorticoides - Acetato de metilprednisolona (intra-articular): pó para solução injetável de 40 mg/2 mL - Succinato sódico de metilprednisolona (intravenoso) pó para solução injetável de 40 mg, 125 mg, 500 mg ou 1.000 mg - Prednisona: comprimidos de 5 e 20 mg.\n- Fosfato sódico de prednisolona: solução oral de 1 e 3 mg/mL.\nMedicamentos modificadores do curso da doença – sintéticos - Metotrexato: comprimidos de 2,5 mg; solução injetável de 25 mg/mL.\n- Sulfassalazina: comprimidos de 500 mg.\n- Leflunomida: comprimidos de 20 mg.\n- Sulfato de hidroxicloroquina: comprimidos de 400 mg.\n- Difosfato de cloroquina: comprimidos de 150 mg.\nMedicamentos modificadores do curso da doença – imunobiológicos - Adalimumabe: solução injetável de 40 mg.\n- Certolizumabe pegol: solução injetável de 200 mg.\n- Etanercepte: solução injetável de 25 e 50 mg.\n- Infliximabe: pó para solução injetável de 100 mg/10 ml.\n- Golimumabe: solução injetável de 50 mg.",
   "pagina": 13,
   "completo": false
  },
  "esquemas": {
   "texto": "Os esquemas de administração dos fármacos usados no tratamento da AR encontram-se discriminados no Quadro 4.\nQuadro 4 - Medicamentos para o tratamento de AR Classe Medicamento Via de administração Posologia Medicamentos modificadores do curso da doença sintéticos (MMCDs) Metotrexato (MTX) VO, SC ou IM 7,5 a 25 mg, 1x/semana Hidroxicloroquina VO 400 mg, 1x/dia Cloroquina VO 4 mg/kg/dia Sulfassalazina VO 500 mg, 1-3 g/dia Leflunomida VO 20 mg, 1x/dia MMCDs alvo-específico Baricitinibe VO 4 mg, 1x/dia.\nRedução de dose para 2 mg/dia para pacientes com idade acima de 75 anos, com insuficiência renal ou em pacientes com controle prolongado da atividade da doença e elegíveis para redução de dose.\nTofacitinibe VO 5 mg, 2x/dia 17 Classe Medicamento Via de administração Posologia Upadacitinibe VO 15 mg, 1x/dia Medicamentos modificadores do curso da doença biológicos anti-TNF (MMCDbio anti-TNF) Adalimumabe SC 40 mg a cada 2 semanas Certolizumabe pegol SC 400 mg nas semanas 0, 2 e 4.\nApós manter 200 mg a cada 2 semanas ou 400 mg a cada 4 semanas.\nEtanercepte SC 50 mg, 1x/semana Golimumabe SC 50 mg, 1x/ a cada 4 semanas Infliximabe IV 3 mg/kg/dose nas semanas 0, 2, 6. Depois de manter a mesma dose, a cada 8 semanas Medicamentos modificadores do curso da doença biológicos não anti-TNF (MMCDbio não anti-TNF) Rituximabe IV 1.000 mg nos dias 0 e 14 (dose total de 2.000mg por ciclo). Após a administração inicial de duas doses de 1.000 mg cada, com intervalo de 14 dias, ciclos semelhantes podem ser repetidos a cada seis meses, totalizando 2000 mg por ciclo (mantendo-se 2.000 mg por ciclo com intervalo de 14 dias a cada dose de 1.000 mg). A manutenção com 1.000 mg pode ser considerada no cenário de boa resposta clínica† Tocilizumabe IV IV: 8 mg/kg/dose (dose máxima de 800 mg) 1x/ a cada 4 semanas.\nAbatacepte SC SC: 125 mg, 1x/semana Imunossupressores Azatioprina VO Iniciar com 1 mg/kg/dia, 1 a 2x dia, e, em caso de não resposta, aumentar 0,5 mg/kg/dia a cada mês até 2,5 mg/kg/dia (dose máxima).",
   "pagina": 16,
   "completo": false
  }
 },
 {
  "id_pcdt": 17,
  "titulo": "Artrite Idiopática Juvenil (AIJ)",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 34 - 19/01/2026",
  "data_portaria": "2026-01-23",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-da-artrite-idiopatica-juvenil/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2026/portaria-conjunta-saes-sctie-no-34-de-19-de-janeiro-de-2026/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 71,
  "tem_texto": true,
  "cids": [
   "B27",
   "M08.0",
   "M08.1",
   "M08.2",
   "M08.3",
   "M08.4",
   "M08.8",
   "M08.9"
  ],
  "farmacos": [
   {
    "nome": "naproxeno",
    "chave": "naproxeno",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "metotrexato",
    "chave": "metotrexato",
    "no_rename": true,
    "id_monografia_ftn": 229
   },
   {
    "nome": "ciclosporina",
    "chave": "ciclosporina",
    "no_rename": true,
    "id_monografia_ftn": 63
   },
   {
    "nome": "leflunomida",
    "chave": "leflunomida",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "metilprednisolona",
    "chave": "metilprednisolona",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "adalimumabe",
    "chave": "adalimumabe",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "etanercepte",
    "chave": "etanercepte",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "infliximabe",
    "chave": "infliximabe",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "sulfassalazina",
    "chave": "sulfassalazina",
    "no_rename": true,
    "id_monografia_ftn": 303
   },
   {
    "nome": "abatacepte",
    "chave": "abatacepte",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "tocilizumabe",
    "chave": "tocilizumabe",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "esquemas",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "Os esquemas de tratamento, por medicamento e conforme citados anteriormente, podem ser vistos no Quadro 5.\nQuadro 5 - Medicamentos disponíveis no SUS e suas respectivas posologias para tratamento da AIJ Medicamento Apresentações disponíveis no SUS Esquema de administração Observações Anti-inflamatórios não esteroidais (AINEs) Naproxeno Comprimido de 250 mg e         500 mg 10 a 20 mg/kg/dia divididos em 2 doses por dia, por via oral Ibuprofeno Comprimido de 200 mg, 300 mg e 600 mg Suspensão oral de 50 mg/mL 10 a 30 mg/kg/dia em 3 a 4 doses por dia, por via oral Não exceder 3.200 mg/dia em adultos, 800 mg/dia em crianças Glicocorticoides sistêmicos Metilprednisolona Pó para solução injetável          500 mg 20 a 30 mg/kg/dia por 1 a 3 dias consecutivos, seguidos por doses de 2 mg/kg/dia de 2 a 4 vezes por dia. Dose máxima de 60 mg Prednisona oral Comprimido de 5 mg e 20 mg Manutenção pós pulsoterapia:\n1 a 2 mg/kg/dia até o máximo de 60 mg Dose pediátrica:\nDe 0,14 a 2 mg/kg de peso por dia, ou de 4 a 60 mg/m2 por dia Dose para adultos:\nDe 5 a 60 mg por dia Fosfato sódico de prednisolona Solução oral de 1 mg/mL e 3 mg/mL Dose pediátrica:\n0,2 a 0,5 mg/kg por dia Dose para adultos:\nDe 5 a 60 mg por dia Glicocorticoide para uso tópico ocular Dexametasona 1 mg/ml (0,1%) suspensão oftálmica ou pomada oftálmica Uma gota no olho afetado a cada 2 a 4 horas, de acordo 18 Medicamento Apresentações disponíveis no SUS Esquema de administração Observações com a gravidade da inflamação ocular Glicocorticoide para uso intra-articular Acetato de metilprednisolona Pó para solução injetável             40 mg/2 mL 0,5 a 1,0 mg/kg/articulação Medicamentos modificadores do curso de doença - MMCD sintéticos Metotrexato (MTX) Comprimido de 2,5 mg ou solução injetável de 25 mg/mL (frasco com 2 mL) 10 a 15 mg/m2 por semana40, VO, IV, SC ou IM.",
   "pagina": 17,
   "completo": false
  }
 },
 {
  "id_pcdt": 18,
  "titulo": "Asma (Anexo alterado em 04/09/2026)",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 43 - 24/03/2026",
  "data_portaria": "2026-04-02",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/2026/asma-portaria-conjunta-saes-sctie-no-43.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2026/portaria-conjunta-saes-sctie-no-43-de-24-de-marco-de-2026/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/2026/pcdt-resumido/pcdt_resumido_asma_f.pdf/@@display-file/file",
  "paginas": 57,
  "tem_texto": true,
  "cids": [
   "J45.0",
   "J45.1",
   "J45.8"
  ],
  "farmacos": [
   {
    "nome": "benralizumabe",
    "chave": "benralizumabe",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "bromidrato de fenoterol",
    "chave": "fenoterol",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "budesonida",
    "chave": "budesonida",
    "no_rename": true,
    "id_monografia_ftn": 45
   },
   {
    "nome": "dipropionato de beclometasona",
    "chave": "beclometasona",
    "no_rename": true,
    "id_monografia_ftn": 140
   },
   {
    "nome": "dupilumabe",
    "chave": "dupilumabe",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "fosfato sódico de prednisolona",
    "chave": "fosfato sodico de prednisolona",
    "no_rename": true,
    "id_monografia_ftn": 173
   },
   {
    "nome": "fumarato de formoterol",
    "chave": "formoterol",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "fumarato de formoterol + budesonida",
    "chave": "formoterol + budesonida",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "omalizumabe",
    "chave": "omalizumabe",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "mepolizumabe",
    "chave": "mepolizumabe",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "prednisona",
    "chave": "prednisona",
    "no_rename": true,
    "id_monografia_ftn": 267
   },
   {
    "nome": "sulfato de salbutamol",
    "chave": "salbutamol",
    "no_rename": true,
    "id_monografia_ftn": 315
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "medicamentos",
   "esquemas",
   "criterios_interrupcao",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Benralizumabe: solução injetável de 30 mg/mL;\n- Bromidrato de fenoterol: aerossol de 100 mcg;\n- Budesonida: cápsula inalante de 200 mcg e 400 mcg e pó inalante ou aerossol bucal de 200 mcg;\n- Dipropionato de beclometasona: cápsula inalante ou pó inalante de 200 mcg e 400 mcg e aerossol ou spray de 50 mcg e 250 mcg;\n- Dupilumabe: seringa preenchida com 300mg/2mL 200 mg/1,14mL\n- Fosfato sódico de prednisolona: solução oral de 1 mg/mL e 3 mg/mL;\n- Fumarato de formoterol: cápsula ou pó inalante de 12 mcg;\n- Fumarato de formoterol + budesonida: cápsula ou pó inalante de 12 mcg/400 mcg e de 6 mcg/200 mcg;\n- Omalizumabe: seringa preenchida de 150mg/mL e 75 mg/0,5mL;\n- Mepolizumabe: solução injetável de 100 mg/mL e 40 mg/0,4 mL;\n- Prednisona: comprimidos de 5 mg e de 20 mg;\n- Sulfato de salbutamol: aerossol de 100 mcg e solução inalante de 5 mg/mL.\nObservar que, apesar de a maioria das apresentações consistir em um medicamento, este Protocolo não preconiza monoterapia de SABA ou LABA, mas sim a combinação a critério do médico e respeitadas as condições, quando especificadas.",
   "pagina": 37,
   "completo": false
  },
  "esquemas": {
   "texto": "- Beclometasona e budesonida: doses diárias totais sugeridas para corticoides inalatórios, dividida em doses baixa, média e alta, estão discriminadas no Quadro 103.\nQuadro 10 - Doses baixas, médias e altas de corticoides inalatórios, para uso diário, isoladamente ou com beta2-agonista de longa duração (LABA) Corticoide Dose baixaa mcg/dia Dose média mcg/dia Dose altab mcg/dia ≥ 12 anos Dipropionato de beclometasona (pMDI, partícula padrão, HFA) 200-500 > 500- 1.000 > 1.000 Dipropionato de beclometasona (DPI ou pMDI, partícula extrafinac, HFA) 100-200 > 200-400 > 400 Budesonida (DPI ou pMDI, partícula padrão, HFA) 200-400 > 400-800 > 800 Crianças 6 a 11 anos Dipropionato de beclometasona (pMDI, partícula padrão, HFA) 100-200 > 200-400 > 400 Dipropionato de beclometasona (pMDI, partícula extrafinac, HFA) 50-100 > 100-200 > 200 Budesonida (DPI ou pMDI, partícula padrão, HFA) 100-200 > 200-400 > 400 Nota: a. Dose padrão para iniciar e manter o tratamento da maioria dos pacientes; b. Aumentam a frequência e intensidade dos efeitos colaterais sistêmicos; c.\nApresentação ainda não disponível no Brasil; pMDI: dispositivos de dose medida pressurizada; DPI: Dispositivo de pó inalatório. HFA: hidrofluoralcano. Fonte:\nadaptado da GINA (2025)3\n- Prednisona e prednisolona: para adolescentes e adultos, a dose recomendada de prednisolona (ou equivalente de prednisona) é de 40 a 50 mg/dia por 5 a 7 dias para exacerbações graves. O uso adicional de corticoides orais em baixa dose (até 7,5 mg/dia de prednisona ou equivalente) pode ser considerado como último recurso no manejo da asma grave em adultos. Para crianças de 6 a 11 anos, preconiza-se 1 a 2 mg/kg/dia de prednisolona, com máximo de 40 mg/dia, por 3 a 5 dias. A GINA recomenda administração em dose única diária, para adultos. A administração matinal é geralmente preferida para minimizar eventos adversos sobre o eixo hipotálamo-hipófise-adrenal. Não é necessário desmame de corticoide oral se o uso for por menos de 2 semanas3.",
   "pagina": 38,
   "completo": false
  }
 },
 {
  "id_pcdt": 19,
  "titulo": "Atenção Integral às Pessoas com Infecções Sexualmente Transmissíveis (IST)",
  "portaria": "Portaria SCTIE/MS nº 12 - 19/04/2021",
  "data_portaria": "2021-04-22",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/20210429_pcdt-ist_588.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2021/20210419_portaria_12.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 112,
  "tem_texto": true,
  "cids": [],
  "farmacos": [],
  "secoes_disponiveis": [],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 20,
  "titulo": "Atrofia Muscular Espinhal 5q Tipos I e II",
  "portaria": "Portaria Conjunta SAES/SECTICS/MS nº 03 - 21/03/2025",
  "data_portaria": "2025-03-25",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/20230522_portariaconjuntano6atrofiamuscularespinhal5qtipos1e2.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2025/portaria-conjunta-saes-sectics-no-3-de-21-de-marco-de-2025/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/PCDT_Resumido_AME_2025_4.pdf/@@display-file/file",
  "paginas": 81,
  "tem_texto": true,
  "cids": [
   "G12.0",
   "G12.1"
  ],
  "farmacos": [
   {
    "nome": "onasemnogeno abeparvoveque",
    "chave": "onasemnogeno abeparvoveque",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "esquemas",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Nusinersena: solução injetável de 2,4 mg/mL;\n- Onasemnogeno abeparvoveque: 2,0 × 1013 gv/mLb;\n- Risdiplam: pó para solução oral de 0,75 mg/mL.",
   "pagina": 12,
   "completo": true
  },
  "esquemas": {
   "texto": "Risdiplam O risdiplam pó para solução oral deve ser constituído por um profissional de saúde antes de ser dispensado56. A constituição do medicamento é um requisito para sua dispensação. A farmácia encarregada de realizar a constituição da solução oral deve atender aos padrões de boas práticas recomendados pelas normas da Anvisa. Os procedimentos operacionais para constituição da solução oral, data de validade, armazenamento e outras instruções relevantes a serem repassadas às famílias e pacientes para administração da solução de risdiplam encontram-se na bula fornecida pelo fabricante.\nO medicamento deve ser administrado por via oral uma vez ao dia, aproximadamente no mesmo horário todos os dias, utilizando a seringa oral fornecida. A dose diária recomendada de risdiplam para pacientes com AME é determinada pela idade e peso corporal (Quadro 4)56.\nQuadro 4 - Esquema de dose de risdiplam conforme idade e peso corporal do paciente.\nIdade e peso corporal Dose diária recomendada < 2 meses de idade 0,15 mg/kg 2 meses a < 2 anos de idade 0,20 mg/kg ≥ 2 anos de idade (< 20 kg) 0,25 mg/kg ≥ 2 anos de idade (≥ 20 kg) 5 mg Fonte: Bula Evrysdi (2023).\nMudanças na dose devem ser realizadas sob a supervisão do médico assistente. Atenção especial deve ser dada aos pacientes em função do ganho ou perda de peso, por sua condição clínica ou faixa etária. Recomenda-se o ajuste de dose, pelo menos uma vez ao mês, até o paciente atingir 20 kg, em função da curva de ganho de peso na infância (lactente: 29 dias a 2 anos de idade; pré-escolar: 2 a 6 anos de idade e escolar). Doses maiores que 5 mg não foram estudadas e não são recomendadas.\nNusinersena O medicamento deve ser administrado por profissional médico habilitado para realizar o procedimento de administração intratecal por punção lombar. Técnicas assépticas devem ser utilizadas durante a preparação e administração do nusinersena53.\nRecomenda-se que seja aspirado o mesmo volume de LCR, antes da administração do nusinersena53.\n- Fase inicial: Nas três primeiras doses devem ser administrados 12 mg de nusinersena, por via intratecal, a cada 14 dias (dias 0, 14 e 28). A quarta dose deve ser administrada 30 dias após a terceira, desde que a criança tenha condições clínicas de receber o medicamento.\n- Fase de manutenção: 12 mg de nusinersena administrado por via intratecal a cada quatro meses.",
   "pagina": 13,
   "completo": false
  }
 },
 {
  "id_pcdt": 21,
  "titulo": "Brucelose Humana",
  "portaria": "Portaria SECTICS/MS nº 22/2025 - 12/05/2025",
  "data_portaria": "2025-05-27",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-da-brucelose-humana/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2025/portaria-sectics-ms-no-22-de-12-de-maio-de-2025/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/pcdt-resumido-da-brucelose-humana/@@display-file/file",
  "paginas": 216,
  "tem_texto": true,
  "cids": [],
  "farmacos": [
   {
    "nome": "doxiciclina",
    "chave": "doxiciclina",
    "no_rename": true,
    "id_monografia_ftn": 94
   },
   {
    "nome": "rifampicina",
    "chave": "rifampicina",
    "no_rename": true,
    "id_monografia_ftn": 271
   },
   {
    "nome": "estreptomicina",
    "chave": "estreptomicina",
    "no_rename": true,
    "id_monografia_ftn": 310
   },
   {
    "nome": "gentamicina",
    "chave": "gentamicina",
    "no_rename": true,
    "id_monografia_ftn": 311
   },
   {
    "nome": "acido folico",
    "chave": "acido folico",
    "no_rename": true,
    "id_monografia_ftn": 10
   },
   {
    "nome": "agua para injecao",
    "chave": "agua para injecao",
    "no_rename": false,
    "id_monografia_ftn": 12
   }
  ],
  "secoes_disponiveis": [
   "medicamentos",
   "esquemas"
  ],
  "medicamentos": {
   "texto": "- cloridrato de doxiciclina: comprimido de 100 mg;\n- rifampicina: cápsula de 300 mg e suspensão oral 20 mg/mL\n- sulfametoxazol + trimetoprima: comprimido de 400 mg + 80 mg; suspensão oral de 40 mg/mL + 8 mg/mL e solução injetável 80 mg/mL + 16 mg/mL;\n- sulfato de estreptomicina: pó para solução injetável de 1 g;\n- sulfato de gentamicina: solução injetável de 40mg /mL.\nAs principais informações dos medicamentos recomendados neste PCDT são descritas abaixo. A fonte das informações apresentadas a seguir é o Formulário Terapêutico Nacional95.\n9.4.1. Cloridrato de doxiciclina A doxiciclina é um antibiótico que pertencente à classe das tetraciclinas, administrado por via oral. Seu mecanismo de ação envolve a inibição da síntese de proteínas nas bactérias, interferindo com a ligação do RNA mensageiro ao ribossomo bacteriano. Isso impede a produção de proteínas essenciais para o crescimento e replicação bacteriana, levando à morte das bactérias ou à inibição do seu crescimento. A dose usual em adultos no tratamento da brucelose é de 200 mg (100 mg, a cada 12 horas).",
   "pagina": 16,
   "completo": false
  },
  "esquemas": {
   "texto": "Os esquemas de administração dos medicamentos preconizado neste Protocolo estão descritos no Quadro 1, conforme populações específicas.\n18 Quadro 1 - Esquemas recomendados para tratamento da brucelose nos diferentes subgrupos.\nIndicação Esquema Posologia diária Duração Adultos e crianças maiores de 10 anos Preferenciais:\ncloridrato de doxiciclina + aminoglicosídeos (sulfato de estreptomicina ou sulfato de gentamicina) doxiciclina: 100 mg, 12/12 horas, VO + estreptomicina: 1000 mg/dia, via IM 42 dias 14 dias doxiciclina: 100 mg, 12/12 horas, VO + sulfato de gentamicina: 5 mg/kg/dia*, IM ou IV 42 dias 5 a 7 dias Alternativo:\ncloridrato de doxiciclina + rifampicina Doxiciclina: 100 mg, 12/12 horas, VO + rifampicina: 600 mg (2 cápsulas de 300mg), 1 vez ao dia, VO 42 dias Crianças até 10 anos SMX+TMP + rifampicina SMX+TMP 8 a 12 mg/kg/dia, VOβ + rifampicina 15 a 20 mg/kg#, 1 vez ao dia, VO 42 dias Gestantes SMX+TMP + rifampicina SMX+TMP 400 mg +80mg/kg, 12/12 horas, VO + rifampicina: 600 mg (2 cápsulas de 300mg), 1 vez ao dia, VO 42 dias Legenda: IV: intravenosa; IM: intramuscular; SMX+TMP: Sulfametoxazol + trimetoprima; VO: via oral.\nNota 1: Foram considerados os esquemas de administração utilizados nos estudos*96,97;\n#98,99; β:98,100,101. e relatórios do CDC 55 e Conitec102.\nNota 2: A utilização de SMX+TMP em apresentação de solução injetável 80 mg/mL + 16 mg/mL (ampola de 5mL) pode ser necessária quando a administração oral é impossível ou contraindicada. Nesse caso, a dose a ser administrada para crianças de até 12 anos é de 30mg de SMX + 6mg de TMP por kg de peso corpóreo diariamente, sendo dividida em duas administrações.\nPara adultos e crianças acima de 12 anos, a dose recomendada corresponde a 2 ampolas de 5mL duas vezes ao dia. A dose padrão deve ser usada por não mais do que 5 dias consecutivos e as altas doses não mais do que 3 dias consecutivos103.",
   "pagina": 17,
   "completo": true
  }
 },
 {
  "id_pcdt": 22,
  "titulo": "Câncer Epidermoide de Cabeça e Pescoço",
  "portaria": "Portaria SAES/SCTIE/MS nº 94 - 20/10/2016",
  "data_portaria": "2026-10-28",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/2026/pcdt-cancer-epidermoide-de-cabeca-e-pescoco.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2015/portaria_sas_516_2015.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 55,
  "tem_texto": true,
  "cids": [
   "C00",
   "C01",
   "C02",
   "C03",
   "C04",
   "C05",
   "C06",
   "C09",
   "C10",
   "C11",
   "C12",
   "C13",
   "C14",
   "C32",
   "C76.0"
  ],
  "farmacos": [
   {
    "nome": "cisplatina",
    "chave": "cisplatina",
    "no_rename": false,
    "id_monografia_ftn": 65
   },
   {
    "nome": "docetaxel",
    "chave": "docetaxel",
    "no_rename": false,
    "id_monografia_ftn": 142
   },
   {
    "nome": "carboplatina",
    "chave": "carboplatina",
    "no_rename": false,
    "id_monografia_ftn": 52
   },
   {
    "nome": "fluoruracila",
    "chave": "fluoruracila",
    "no_rename": false,
    "id_monografia_ftn": 168
   },
   {
    "nome": "paclitaxel",
    "chave": "paclitaxel",
    "no_rename": false,
    "id_monografia_ftn": 253
   },
   {
    "nome": "gencitabina",
    "chave": "gencitabina",
    "no_rename": false,
    "id_monografia_ftn": 99
   },
   {
    "nome": "filgrastim",
    "chave": "filgrastim",
    "no_rename": true,
    "id_monografia_ftn": 162
   },
   {
    "nome": "metotrexato",
    "chave": "metotrexato",
    "no_rename": true,
    "id_monografia_ftn": 229
   },
   {
    "nome": "ifosfamida",
    "chave": "ifosfamida",
    "no_rename": false,
    "id_monografia_ftn": 194
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 23,
  "titulo": "Câncer de Mama",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 106 - 20/10/2026",
  "data_portaria": "2026-10-28",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/2026/pcdt_cancer-de-mama.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2026/portaria-conjunta-saes-sctie-no-106-de-20-de-outubro-de-2026.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 85,
  "tem_texto": true,
  "cids": [
   "C50.0",
   "C50.1",
   "C50.2",
   "C50.3",
   "C50.4",
   "C50.5",
   "C50.6",
   "C50.8",
   "C50.9"
  ],
  "farmacos": [
   {
    "nome": "tamoxifeno",
    "chave": "tamoxifeno",
    "no_rename": false,
    "id_monografia_ftn": 70
   },
   {
    "nome": "doxorrubicina",
    "chave": "doxorrubicina",
    "no_rename": false,
    "id_monografia_ftn": 95
   },
   {
    "nome": "ciclofosfamida",
    "chave": "ciclofosfamida",
    "no_rename": true,
    "id_monografia_ftn": 62
   },
   {
    "nome": "paclitaxel",
    "chave": "paclitaxel",
    "no_rename": false,
    "id_monografia_ftn": 253
   },
   {
    "nome": "docetaxel",
    "chave": "docetaxel",
    "no_rename": false,
    "id_monografia_ftn": 142
   },
   {
    "nome": "fluoruracila",
    "chave": "fluoruracila",
    "no_rename": false,
    "id_monografia_ftn": 168
   },
   {
    "nome": "metotrexato",
    "chave": "metotrexato",
    "no_rename": true,
    "id_monografia_ftn": 229
   },
   {
    "nome": "gosserrelina",
    "chave": "gosserrelina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "carboplatina",
    "chave": "carboplatina",
    "no_rename": false,
    "id_monografia_ftn": 52
   },
   {
    "nome": "anastrozol",
    "chave": "anastrozol",
    "no_rename": false,
    "id_monografia_ftn": 25
   },
   {
    "nome": "everolimo",
    "chave": "everolimo",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "cisplatina",
    "chave": "cisplatina",
    "no_rename": false,
    "id_monografia_ftn": 65
   },
   {
    "nome": "gencitabina",
    "chave": "gencitabina",
    "no_rename": false,
    "id_monografia_ftn": 99
   },
   {
    "nome": "vimblastina",
    "chave": "vimblastina",
    "no_rename": false,
    "id_monografia_ftn": 316
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "monitoramento",
   "criterios_interrupcao"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 24,
  "titulo": "Carcinoma de Esôfago",
  "portaria": "Portaria SAES/SCTIE/MS nº 96 - 20/10/2026",
  "data_portaria": "2026-10-28",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/2026/pcdt-carcinoma-de-esofago.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2026/portaria-conjunta-saes-sctie-no-96-de-20-de-outubro-de-2026.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 40,
  "tem_texto": true,
  "cids": [
   "C15.0",
   "C15.1",
   "C15.2",
   "C15.3",
   "C15.4",
   "C15.5",
   "C15.8",
   "C15.9",
   "D00",
   "D00.1"
  ],
  "farmacos": [
   {
    "nome": "diafragma",
    "chave": "diafragma",
    "no_rename": false,
    "id_monografia_ftn": 130
   },
   {
    "nome": "carboplatina",
    "chave": "carboplatina",
    "no_rename": false,
    "id_monografia_ftn": 52
   },
   {
    "nome": "paclitaxel",
    "chave": "paclitaxel",
    "no_rename": false,
    "id_monografia_ftn": 253
   },
   {
    "nome": "cisplatina",
    "chave": "cisplatina",
    "no_rename": false,
    "id_monografia_ftn": 65
   },
   {
    "nome": "fluoruracila",
    "chave": "fluoruracila",
    "no_rename": false,
    "id_monografia_ftn": 168
   },
   {
    "nome": "acido folinico",
    "chave": "acido folinico",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "oxaliplatina",
    "chave": "oxaliplatina",
    "no_rename": false,
    "id_monografia_ftn": 249
   },
   {
    "nome": "docetaxel",
    "chave": "docetaxel",
    "no_rename": false,
    "id_monografia_ftn": 142
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 25,
  "titulo": "Carcinoma diferenciado da Tireóide",
  "portaria": "Portaria SAES/SCTIE/MS nº 92 - 20/10/2026",
  "data_portaria": "2026-10-28",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/2026/pcdt-do-carcinoma-diferenciado-da-tireoide.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2026/portaria-conjunta-saes-sctie-no-92-de-20-de-outubro-de-2026.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 48,
  "tem_texto": true,
  "cids": [
   "C73"
  ],
  "farmacos": [
   {
    "nome": "levotiroxina",
    "chave": "levotiroxina",
    "no_rename": true,
    "id_monografia_ftn": 212
   },
   {
    "nome": "calcio",
    "chave": "calcio",
    "no_rename": true,
    "id_monografia_ftn": 50
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 26,
  "titulo": "Carcinoma Renal de Células Claras",
  "portaria": "Portaria SAES/SCTIE/MS nº 103 - 20/10/2026",
  "data_portaria": "2026-10-28",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/2026/pcdt_carcinoma-renal-de-celulas-claras.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2026/portaria-conjunta-saes-sctie-no-103-de-20-de-outubro-de-2026.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 140,
  "tem_texto": true,
  "cids": [
   "C64"
  ],
  "farmacos": [
   {
    "nome": "rifampicina",
    "chave": "rifampicina",
    "no_rename": true,
    "id_monografia_ftn": 271
   },
   {
    "nome": "cetoconazol",
    "chave": "cetoconazol",
    "no_rename": true,
    "id_monografia_ftn": 61
   },
   {
    "nome": "everolimo",
    "chave": "everolimo",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "monitoramento",
   "casos_especiais"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 27,
  "titulo": "Colangite Biliar Primária",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 11 - 09/09/2019",
  "data_portaria": "2019-09-16",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/portaria-conjunta-pcdt-colangite-biliar-saes.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2019/portariasctie_11_12_13_2019.pdf/@@display-file/file",
  "url_publicacao_ms": "https://www.gov.br/conitec/pt-br/midias/protocolos/publicacoes_ms/pcdt_colangitebiliar_isbn_17-08-2020.pdf/@@display-file/file",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/pcdt_resumido_colangitebiliar.pdf/@@display-file/file",
  "paginas": 17,
  "tem_texto": true,
  "cids": [
   "K74.3"
  ],
  "farmacos": [
   {
    "nome": "ácido ursodesoxicólico",
    "chave": "acido ursodesoxicolico",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "esquemas",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "- Ácido ursodesoxicólico: 13 mg a 15 mg/kg/dia, via oral, dose única ou dividida em até quatro doses diárias.\nCaso seja necessário o uso concomitante de substâncias que inibem a absorção intestinal de ácidos biliares, como a colestiramina, colestipol ou antiácidos à base de alumínio, estas devem ser tomadas ao menos 2 horas antes ou após o ácido ursodesoxicólico33.",
   "pagina": 11,
   "completo": true
  }
 },
 {
  "id_pcdt": 28,
  "titulo": "Comportamento Agressivo no Transtorno do Espectro do Autismo",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 07 - 12/04/2022",
  "data_portaria": "2022-04-19",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/20220419_portal-portaria_conjunta_7_comportamento_agressivo_tea.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2022/20220419_portaria_conjunta_7.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/PCDT_Resumido_Autismo_final.pdf/@@display-file/file",
  "paginas": 85,
  "tem_texto": true,
  "cids": [
   "F84.0",
   "F84.1",
   "F84.3",
   "F84.5",
   "F84.8"
  ],
  "farmacos": [
   {
    "nome": "risperidona",
    "chave": "risperidona",
    "no_rename": true,
    "id_monografia_ftn": 273
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "esquemas",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Risperidona: solução oral de 1 mg/mL (para doses que exigem frações de 0,5 mg); comprimidos de 1, 2 e 3 mg.",
   "pagina": 10,
   "completo": true
  },
  "esquemas": {
   "texto": "Idealmente, a prescrição de risperidona para indivíduos com TEA deve ser feita por profissional da saúde familiarizado com o tratamento do TEA24,53,58,70. Na indisponibilidade do acesso a profissionais especializados, os médicos da atenção primária podem prescrever o medicamento ou encarregar-se da manutenção e monitoramento do tratamento após uma prescrição inicial de um profissional de saúde mental familiarizado com o TEA58.\nEm crianças maiores que 5 anos de idade e adolescentes77,88, deve-se iniciar com 0,25 mg/dia (solução oral) para pacientes com peso inferior a 20 kg e com 0,5 mg/dia para peso maior que 20 kg. A partir do 4º dia, a dose pode ser aumentada em 0,25 mg/dia para pacientes com peso inferior a 20 kg e em 0,5 mg/dia para pacientes com peso maior. No entanto, o aumento de doses deve ser feito de maneira lenta para evitar o desenvolvimento de sintomas extrapiramidais. A dose do 4º dia deve ser mantida, e a resposta deve ser avaliada ao redor do 14º dia (Quadro 1). As doses diárias máximas estudadas são de 1,5 mg para pacientes com peso inferior a 20 kg; de 2,5 mg para pacientes entre 20 kg e 45 kg; e de 3,5 mg para pacientes com peso superior a 45 kg.\nApenas para os pacientes que não obtiverem resposta adequada, aumentos adicionais da dose devem ser considerados.\nQUADRO 1 - Doses diárias (total em mg/dia) de risperidona preconizadas para crianças maiores que 5 anos de idade e adolescentes com comportamento agressivo como transtorno do espectro do autismo.\nGRUPO DE ACORDO COM O PESO DOSE DIÁRIA INICIAL (DIAS 1 A 3) DOSE DIÁRIA DE MANUTENÇÃO (DIA 4 – DIA 14+) AUMENTO DE DOSE, SE NECESSÁRIO FAIXA TERAPÊUTICA < 20 Kg 0,25 mg 0,50 mg Aumento de 0,25 mg em intervalos ≥ 2 semanas 0,5 mg a 1,50 mg ≥ 20 Kg 0,50 mg 1,0 mg Aumento de 0,50 mg em intervalos ≥2 semanas 1,0 mg a 2,50 mg* * Pacientes com mais de 45 kg podem necessitar de doses maiores; a dose máxima avaliada foi 3,5 mg/dia.\nAdaptado de Janssen-Cilag, 202177.\nPara adultos77,88, doses aproximadas de 3 mg/dia (variando de 1 a 6 mg/dia) apresentaram resultados terapêuticos nesses pacientes. O tratamento deve ser iniciado com a dose de 1 mg/dia (preferencialmente à noite), podendo ser aumentada em 1 mg a cada 3 ou 4 dias, dependendo da resposta terapêutica e tolerância, sendo adose máxima 10 mg/dia.",
   "pagina": 10,
   "completo": false
  }
 },
 {
  "id_pcdt": 29,
  "titulo": "Deficiência de Biotinidase",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 13 – 04/05/2018",
  "data_portaria": "2018-05-24",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt_da_deficiencia_de_biotinidase-1.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2018/dou-n-99-24maio2018-portariasconjuntas-13-14-15pcdt.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 15,
  "tem_texto": true,
  "cids": [
   "E88.9"
  ],
  "farmacos": [
   {
    "nome": "biotina",
    "chave": "biotina",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "medicamentos",
   "esquemas",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Biotina: cápsulas de 2,5 mg.\nAs cápsulas devem ser integralmente deglutidas por crianças maiores (escolares e adolescentes) ou ter seu conteúdo retirado e administrado a lactentes, pré-escolares ou pacientes com distúrbios de deglutição juntamente com leite materno, fórmula infantil ou leite.\nA seguir, sem lavar a colher ou o dispensador, deve-se adicionar nova quantidade do líquido utilizado para que seja administrado todo o conteúdo da cápsula. Apresentações líquidas não são recomendadas devido à baixa solubilidade da biotina em solução aquosa (25).",
   "pagina": 8,
   "completo": true
  },
  "esquemas": {
   "texto": "A biotina deve ser utilizada na dose inicial de 5 mg/dia (independentemente do peso corporal) por todos os pacientes com diagnóstico de DB leve e de 10 mg/dia (independentemente do peso corporal) por todos os pacientes com diagnóstico de DB grave.\nCasos suspeitos devem iniciar com 10mg. Para casos sem resposta com a dose-padrão ou com exacerbações da doença, o que raramente ocorre, doses maiores (até 20 mg/dia) podem ser utilizadas em serviços de referência, entre eles o de triagem neonatal.",
   "pagina": 8,
   "completo": true
  }
 },
 {
  "id_pcdt": 30,
  "titulo": "Deficiência de Hormônio do Crescimento - Hipopituitarismo",
  "portaria": "Portaria Conjunta SAS/SCTIE/MS nº 28 - 30/11/2018",
  "data_portaria": "2018-12-14",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt_deficienciadohormoniodecrescimento_2018.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2018/portariasctie_28_hipopituitarismo.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 24,
  "tem_texto": true,
  "cids": [
   "E23.0"
  ],
  "farmacos": [
   {
    "nome": "somatropina",
    "chave": "somatropina",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "medicamentos",
   "esquemas",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "Somatropina injetável: 4 UI, 12UI, 15UI, 16UI, 18UI, 24UI e 30UI.\nNa fórmula de conversão, 1 mg equivale a 3 UI. Há apresentações comerciais com volumes de diluente diferentes para a mesma dose de hormônio, o que deverá ser observado na prescrição e orientação ao paciente.",
   "pagina": 12,
   "completo": true
  },
  "esquemas": {
   "texto": "Crianças e adolescentes Somatropina: 0,025-0,035 mg/kg/dia ou 0,075-0,10 UI/kg/dia, administrada por via subcutânea, à noite, 6-7 vezes/semana, ajustada conforme peso corporal, velocidade de crescimento e níveis de IGF-1 (12).\nAdultos Somatropina: 0,15-0,3 mg/dia ou 0,5-1,0 UI/dia (independentemente do peso corporal), ajustada com dosagem de IGF-1 (7, 41, 42).",
   "pagina": 13,
   "completo": true
  }
 },
 {
  "id_pcdt": 31,
  "titulo": "Degeneração Macular Relacionada à Idade (forma neovascular)",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 24 – 07/12/2022",
  "data_portaria": "2022-12-16",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/20221216_pcdt-dmri.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2022/20221216_portaria_conjunta_n_24_saes_sctie_ms.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/20220824_PCDT_Resumido_DMRI_final.pdf/@@display-file/file",
  "paginas": 33,
  "tem_texto": true,
  "cids": [
   "H35.3"
  ],
  "farmacos": [
   {
    "nome": "aflibercepte",
    "chave": "aflibercepte",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "bevacizumabe",
    "chave": "bevacizumabe",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "ranibizumabe",
    "chave": "ranibizumabe",
    "no_rename": false,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "esquemas",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "Os ensaios clínicos randomizados (ECR) incluídos neste Protocolo descreveram três esquemas de administração de antiangiogênicos distintos:\na) Esquema fixo: esquema de injeções fixas mensais17,18,37;\nb) Esquema Pro Re Nata (PRN): esquema de injeções conforme a necessidade ou as needed20,35,36,38; e c) Esquema Tratar e Estender (TES): esquema de injeções com intervalos de tempo flexíveis conforme resposta ao tratamento (TREX: Treat and Extend)56–58.\nEm meta-análise de Schmucker et al., os autores concluíram que, apesar da vantajosa redução do número de aplicações no esquema Pro Re Nata, há perda média de 1,9 letras (IC95% 0,5-3,3) na AV em relação ao tratamento com injeções mensais59.\nPor outro lado, três ensaios clínicos não demonstraram diferença significativa em relação ao desfecho funcional e anatômico entre o Esquema Tratar e Estender e o uso de injeções mensais fixas no primeiro ano de tratamento56–58.\nHá muita controvérsia na literatura em relação a qual esquema seguir no longo prazo. Cabe ressaltar que, até o momento, não há ECR com mais de 24 meses de acompanhamento. Além disso, estudos de extensão de ECR (abertos) apontam para uma piora progressiva dos resultados funcionais e anatômicos ao longo dos anos (SEVEN-UP/CATT, 5 anos). Não sabemos se a piora em longo prazo é resultado de um esquema de administração mais flexível ou de uma limitação desta classe de medicamentos, pois boa parte dos pacientes desenvolveram ou pioraram a atrofia geográfica com o passar dos anos.\nNa prática médica, as particularidades de cada paciente, a evolução clínica e o perfil de cada serviço de saúde irão nortear a frequência de aplicação de anti-VEGF. Ademais, considerando a frequência de comparecimento ao serviço, alguns desses esquemas, os quais consideram visitas com intervalo de tempo menor, podem não ser factíveis, devido à capacidade de atendimento dos centros especializados em que a aplicação é feita. Sendo assim, os esquemas de administração descritos neste Protocolo estão adequados às diversas necessidades possíveis, conforme o perfil do paciente e a autonomia do médico.\nA dose intravítrea a ser aplicada, por olho, é de 2 mg de aflibercepte, 0,5 mg de ranibizumabe e 1,25 mg de bevacizumabe.\n7.1.1. Esquema fixo Os pacientes recebem injeções fixas mensais de antiangiogênico independentemente dos achados clínicos e da TCO17,18,37.",
   "pagina": 11,
   "completo": false
  }
 },
 {
  "id_pcdt": 32,
  "titulo": "Dermatite Atópica",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 28 - 27/11/2025",
  "data_portaria": "2025-11-28",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-da-dermatite-atopica/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2025/portaria-conjunta-saes-sctie-no-28-de-27-de-novembro-de-2025/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/2026/pcdt-resumido/PCDT_Resumido_Dermatite_Atopicaf.pdf/@@display-file/file",
  "paginas": 56,
  "tem_texto": true,
  "cids": [
   "L20.0",
   "L20.8"
  ],
  "farmacos": [
   {
    "nome": "dexametasona",
    "chave": "dexametasona",
    "no_rename": true,
    "id_monografia_ftn": 129
   },
   {
    "nome": "acetato de hidrocortisona",
    "chave": "hidrocortisona",
    "no_rename": true,
    "id_monografia_ftn": 2
   },
   {
    "nome": "furoato de mometasona",
    "chave": "furoato de mometasona",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "tacrolimo",
    "chave": "tacrolimo",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "ciclosporina",
    "chave": "ciclosporina",
    "no_rename": true,
    "id_monografia_ftn": 63
   },
   {
    "nome": "metotrexato",
    "chave": "metotrexato",
    "no_rename": true,
    "id_monografia_ftn": 229
   },
   {
    "nome": "dupilumabe",
    "chave": "dupilumabe",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "upadacitinibe",
    "chave": "upadacitinibe",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "esquemas",
   "criterios_interrupcao",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Acetato de hidrocortisona: creme de 10 mg/g - Ciclosporina cápsulas de 25 mg, 50 mg e 100 mg; solução oral de 100 mg/mL;\n- Dexametasona: creme de 1 mg/g - Dupilumabe: solução injetável de 200 mg ou 300 mg;\n- Furoato de mometasona: creme ou pomada de 1 mg/g - Metotrexato: comprimido de 2,5 mg, solução injetável de 25 mg/mL;\n- Tacrolimo: pomada de 0,3 mg/g ou 1 mg/g;\n- Upadacitinibe: comprimidos revestidos de liberação prolongada de 15 mg.",
   "pagina": 21,
   "completo": true
  },
  "esquemas": {
   "texto": "- Acetato de hidrocortisona: aplicar uma camada fina do creme, 2 a 3 vezes por dia, sob ligeira fricção; após melhora do quadro clínico, uma aplicação por dia é suficiente na maioria dos casos. Em lactentes e crianças abaixo de 4 anos, o tratamento não deve prolongar-se por mais de 3 semanas, especialmente nas zonas cobertas por fraldas.\n- Ciclosporina – via oral: O esquema terapêutico com a ciclosporina varia de acordo com o curso da doença. Durante a fase aguda, a terapia é voltada especialmente para a remissão dos sintomas, enquanto na fase de manutenção o principal objetivo é minimizar as chances de recorrência das manifestações cutâneas. O tratamento dos episódios agudos, tanto em pacientes adultos quanto pediátricos, é realizado pela administração oral de 3 a 5 mg/kg/dia, dividida em duas doses diárias (manhã e noite). Após seis semanas, durante a fase de manutenção, a dose diária é reduzida a 2,5 a 3 mg/kg/dia. Sugere-se que doses iniciais mais altas possam resultar em um controle mais rápido da doença e na redução da área de superfície corporal envolvida, além de melhorar a qualidade de vida do paciente. Apesar disso, é preconizado que a dose inicial prescrita seja baseada em diversos fatores, como gravidade da doença e outras morbidades identificadas. Ao todo, as terapias de curto e longo prazo podem ser úteis e a duração do tratamento varia entre três meses e um ano64. Preferencialmente, seu uso deve ser restrito a 8 a 12 meses, não sendo recomendado por período superior a dois anos contínuos 11,60,64. A prescrição da menor dose clinicamente útil considerando o tratamento a longo prazo pode ser aconselhável em alguns casos e, para redução de dose, aconselha-se considerar a eficácia 22 clínica do tratamento3. A associação do tratamento com ciclosporina e terapia ultravioleta (UV) não é recomendada, enquanto a proteção UV é altamente indicada3,11.\n- Dexametasona creme: uma a três aplicações diárias do creme por períodos inferiores a 30 dias; na fase de manutenção, aplicar o creme 2 vezes/semana.",
   "pagina": 21,
   "completo": false
  }
 },
 {
  "id_pcdt": 33,
  "titulo": "Diabetes Insípido",
  "portaria": "Portaria Conjunta SAES/SECTICS/MS nº 17 - 05/08/2025",
  "data_portaria": "2025-09-18",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-diabete-insipido/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2025/portaria-conjunta-saes-sectics-no-17-de-5-de-agosto-de-2025/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 41,
  "tem_texto": true,
  "cids": [
   "E23.2"
  ],
  "farmacos": [
   {
    "nome": "desmopressina",
    "chave": "desmopressina",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "medicamentos",
   "esquemas",
   "criterios_interrupcao",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Desmopressina: solução nasal de 0,1 mg/mL ou 100 mcg/mL (em solução ou spray) ou comprimidos de 0,1 e 0,2 mg.",
   "pagina": 9,
   "completo": true
  },
  "esquemas": {
   "texto": "Há duas formas comerciais disponíveis de aplicação nasal de desmopressina: a aplicação por meio de túbulo plástico (ou cânula) e o spray, que apresentam algumas particularidades quanto à sua administração.\nNo primeiro caso, o túbulo plástico deve ser preenchido com a dose a ser utilizada, por capilaridade, encostando uma ponta do túbulo na solução contida no frasco. Após assegurar-se de que a dose está correta, uma das extremidades do túbulo é colocada na cavidade nasal, e outra, na boca do paciente. Através da extremidade colocada na boca, o medicamento é soprado para a cavidade nasal, onde é absorvido. Já a aplicação por spray nasal é realizada através de jato nasal com dose fixa de 10 mcg/jato.\nO uso do spray nasal é mais simples e fornece doses fixas múltiplas de 10 mcg (por exemplo, 10, 20, 30 mcg). Já a solução nasal possibilita a aplicação de doses múltiplas de 5 mcg (por exemplo, 5, 10, 15, 20 mcg), o que pode ser mais adequado para alguns pacientes, principalmente para os pediátricos. Portanto, o spray nasal não permite a flexibilidade das doses que a solução nasal possibilita.\nA dose inicial de desmopressina de aplicação nasal recomendada é de 10 mcg em adultos e adolescentes e de 5 mcg em crianças. Sugere-se que a dose inicial seja administrada à noite e que o incremento gradual no número de aplicações e na dose seja feito de forma individualizada, de acordo com a resposta do paciente. Existem graus muito variáveis de deficiência do ADH, o que repercute na variabilidade da dose de manutenção da desmopressina. A dose de manutenção com a desmopressina 10 solução nasal varia de 5 a 20 mcg, uma a três vezes ao dia; já para a desmopressina spray nasal, 10 a 20 mcg, uma a três vezes ao dia.\nEm neonatos e lactentes, a dose de desmopressina inicialmente prescrita por via intranasal é de 2,5 mcg. Caso o recémnascido com DI central seja prematuro ou de baixo peso, doses ainda menores podem ser necessárias.",
   "pagina": 9,
   "completo": false
  }
 },
 {
  "id_pcdt": 34,
  "titulo": "Diabete Melito Tipo 1",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 17 - 12/11/2019",
  "data_portaria": "2019-11-13",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/portaria-conjunta-pcdt-diabete-melito-1.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2019/portaria_conjunta_saes-sctie_17_2019.pdf/@@display-file/file",
  "url_publicacao_ms": "https://www.gov.br/conitec/pt-br/midias/protocolos/publicacoes_ms/pcdt_diabetesmellitus_tipoi_isbn_19-08-2020.pdf/@@display-file/file",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/pcdt_resumido_diabetesmellitus_tipo1.pdf/@@display-file/file",
  "paginas": 58,
  "tem_texto": true,
  "cids": [
   "E10.0",
   "E10.1",
   "E10.2",
   "E10.3",
   "E10.4",
   "E10.5",
   "E10.6",
   "E10.7",
   "E10.8",
   "E10.9"
  ],
  "farmacos": [
   {
    "nome": "insulina nph",
    "chave": "insulina nph",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "insulina regular",
    "chave": "insulina regular",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "insulina análoga de ação rápida",
    "chave": "insulina analoga de acao rapida",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "insulina análoga de ação prolongada",
    "chave": "insulina analoga de acao prolongada",
    "no_rename": false,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 35,
  "titulo": "Diabete Melito Tipo 2",
  "portaria": "Portaria SCTIE/MS nº 13/2026 - 21/02/2026",
  "data_portaria": "2026-02-24",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/2026/pcdt-diabete-melito-tipo-2/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2026/portaria-sctie-ms-no-13-de-21-de-fevereiro-de-2026/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 80,
  "tem_texto": true,
  "cids": [
   "E11",
   "E11.2",
   "E11.3",
   "E11.4",
   "E11.5",
   "E11.6",
   "E11.7",
   "E11.8",
   "E11.9"
  ],
  "farmacos": [
   {
    "nome": "dapagliflozina",
    "chave": "dapagliflozina",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "glibenclamida",
    "chave": "glibenclamida",
    "no_rename": true,
    "id_monografia_ftn": 177
   },
   {
    "nome": "gliclazida",
    "chave": "gliclazida",
    "no_rename": true,
    "id_monografia_ftn": 179
   },
   {
    "nome": "insulina humana nph",
    "chave": "insulina humana nph",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "insulina humana regular",
    "chave": "insulina humana regular",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "insulina análoga de ação rápida",
    "chave": "insulina analoga de acao rapida",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "insulina análoga de ação prolongada",
    "chave": "insulina analoga de acao prolongada",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "cloridrato de metformina",
    "chave": "metformina",
    "no_rename": true,
    "id_monografia_ftn": 107
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "esquemas",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "Biguanidas:\n- Cloridrato de metformina: comprimido de 500 mg e 850 mg;\nSulfonilureias:\n- Glibenclamida: comprimido de 5 mg;\n- Gliclazida: comprimido de liberação prolongada de 30 mg e 60 mg, e comprimido de 80 mg.\nInibidores de SGLT2:\n- Dapagliflozina: comprimidos de 10 mg.\nInsulinas:\n- Insulina humana NPH: suspensão injetável de 100 U/mL;\n- Insulina humana regular: solução injetável de 100 U/mL;\n38 - Insulina análoga de ação rápida: solução injetável de 100 U/mL;\n- Insulina análoga de ação prolongada: solução injetável de 100 U/mL ou 300 U/mL.\nNota: O medicamento cloridrato de metformina 500 mg comprimido de ação prolongada está disponível por meio do Programa Aqui tem Farmácia Popular.",
   "pagina": 37,
   "completo": true
  },
  "esquemas": {
   "texto": "O tratamento do DM2 requer acompanhamento contínuo pois, após a decisão terapêutica inicial, é fundamental avaliar periodicamente a necessidade de intensificação do esquema utilizado, com ajuste de dose ou adição de outros agentes. Se a HbA1c estiver dentro da meta, sua medida pode ser feita, em exame de sangue, pelo menos duas vezes por ano. Caso esse parâmetro ainda esteja fora da meta, dosagens mais frequentes são necessárias (a cada 3 meses) e o tratamento deve ser intensificado. Se houver diagnóstico de DRD ou doença cardiovascular, reavaliação do esquema terapêutico também é necessária99.\n- Caso seja necessário iniciar insulina, é recomendado iniciar com uma insulina basal (análogo de longa duração ou insulina humana NPH) na dose de 0,1 a 0,2 U/kg.\n- Caso opte por usar insulina humana NPH: a dose deve iniciada à noite, antes da ceia. Após início de insulina basal, a dose deve ser titulada de acordo com a glicemia de jejum. A titulação pode ser feita a cada 3 dias, com treinamento do paciente, até atingir o objetivo. Caso o alvo da glicose em jejum seja atingido e ainda haja hiperglicemia ao longo do dia, uma dose adicional de insulina humana NPH pela manhã deve ser adicionada. Caso a hiperglicemia seja predominantemente pós-prandial, insulina humana regular ou análogo de ação rápida deve ser adicionado, antes das refeições100.\n- Caso haja indicação e disponibilidade de uso de insulina análoga de ação prolongada, a administração pode ser pela manhã ou à noite. Para a insulina glargina 100 U, há necessidade de manter o horário da aplicação constante. Para insulina degludeca, há flexibilidade de horário de administração para 8 horas a mais ou a menos. Para insulina glargina 300 U, há flexibilidade de horário de administração para 3 horas a mais ou a menos. Após início de insulina basal, a dose deve ser titulada de acordo com a glicemia de jejum. A titulação pode ser feita a cada 3 dias, com treinamento do paciente, até atingir o objetivo, no caso da insulina glargina. Para usuários de insulina degludeca, o ajuste geralmente é feito semanalmente. Caso haja hiperglicemia pós-prandial significativa com uso de insulina basal, deve ser feita associação com insulina humana regular ou análogo de ação rápida, quando disponível, antes das refeições100.",
   "pagina": 38,
   "completo": false
  }
 },
 {
  "id_pcdt": 36,
  "titulo": "Dislipidemia: prevenção de eventos cardiovasculares e pancreatite",
  "portaria": "Portaria Conjunta SAS/SCTIE/MS nº 8 - 30/07/2019",
  "data_portaria": "2019-08-07",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt_dislipidemia.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2019/portariasconjuntas_sctie_sas_8e9_2019.pdf/@@display-file/file",
  "url_publicacao_ms": "https://www.gov.br/conitec/pt-br/midias/protocolos/publicacoes_ms/pcdt_dislipidemia_prevencaoeventoscardiovascularesepancreatite_isbn_18-08-2020.pdf/@@display-file/file",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/pcdt_resumido_dislipidemia.pdf/@@display-file/file",
  "paginas": 29,
  "tem_texto": true,
  "cids": [
   "E78.0",
   "E78.1",
   "E78.2",
   "E78.3",
   "E78.4",
   "E78.5",
   "E78.6",
   "E78.8"
  ],
  "farmacos": [
   {
    "nome": "estatinas: atorvastatina",
    "chave": "estatinas: atorvastatina",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "pravastatina",
    "chave": "pravastatina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "sinvastatina; fibratos: bezafibrato",
    "chave": "sinvastatina; fibratos: bezafibrato",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "ciprofibrato",
    "chave": "ciprofibrato",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "etofibrato",
    "chave": "etofibrato",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "fenofibrato",
    "chave": "fenofibrato",
    "no_rename": true,
    "id_monografia_ftn": 161
   },
   {
    "nome": "genfibrozila;",
    "chave": "genfibrozila;",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "ácido nicotínico",
    "chave": "acido nicotinico",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "medicamentos",
   "esquemas",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Atorvastatina cálcica: comprimidos de 10, 20, 40 e 80 mg.\n- Pravastatina sódica: comprimidos de 10, 20 e 40 mg.\n- Sinvastatina: comprimidos de 10, 20 e 40 mg.\n- Bezafibrato: comprimidos e drágeas de 200 mg e comprimidos de desintegração lenta de 400 mg.\n- Ciprofibrato: comprimidos de 100 mg.\n- Etofibrato: cápsulas de 500 mg.\n- Fenofibrato: cápsulas de 200 mg e cápsulas de liberação retardada de 250 mg.\n- Genfibrozila: comprimidos de 600 e 900 mg.\n- Ácido nicotínico: comprimidos de 500 mg.",
   "pagina": 9,
   "completo": true
  },
  "esquemas": {
   "texto": "Estatinas Devem ser usadas via oral, em dose única diária preferencialmente à noite para se obter o efeito máximo. Os representantes destes grupos com suas doses mínimas e máximas encontram-se na Tabela 1.\nFibratos Devem ser tomados preferencialmente em horário afastado das estatinas, quando estas forem usadas concomitantemente, para diminuir o risco de toxicidade, ou seja, pela manhã. A genfibrozila nunca deve ser administrada concomitantemente ao uso de estatinas. Os representantes destes grupos com suas doses mínimas e máximas encontram-se na Tabela 1.\nÁcido nicotínico Utilizam-se 2 a 3 g/dia (início do efeito terapêutico com 1 a 2 g/dia), ajustados conforme o efeito ou a tolerância. Devido à baixa tolerância imediata a doses elevadas, inicia-se o tratamento com doses baixas (250 mg em dose única após o jantar), com aumento gradual a cada 2 a 4 semanas, até atingir a dose eficaz (ver Tabela 1).\nTabela 1 – Doses Iniciais e máximas dos medicamentos Medicamento Dose inicial (mg) Dose máxima (mg) ESTATINAS Atorvastatina cálcica 10 80* Pravastatina sódica 20 40 Sinvastatina 20 80** FIBRATOS Bezafibrato 200 400 Ciprofibrato 100 100 Etofibrato 500 500 Fenofibrato 200 250 Genfibrozila 600",
   "pagina": 10,
   "completo": true
  }
 },
 {
  "id_pcdt": 37,
  "titulo": "Distonias e Espasmo Hemifacial",
  "portaria": "Portaria Conjunta SAS/SCTIE/MS nº 1 - 29/05/2017",
  "data_portaria": "2017-05-30",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/protocolo_uso/pcdt_distonias_e_espasmo_hemifacial_29_05_2017.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/legislacao/portaria_conjunta29-05-2017_pcdtdistoniaseespasmohemifacial.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 18,
  "tem_texto": true,
  "cids": [
   "G24.3",
   "G24.4",
   "G24.5",
   "G24.8",
   "G51.3",
   "G51.8"
  ],
  "farmacos": [
   {
    "nome": "toxina botulínica tipo a",
    "chave": "toxina botulinica tipo a",
    "no_rename": false,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "esquemas",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Toxina botulínica tipo A: frasco-ampola com 100U (TBA-1) e frasco-ampola com 500U (TBA-2).",
   "pagina": 11,
   "completo": true
  },
  "esquemas": {
   "texto": "Com relação às técnicas de aplicação da TBA, são feitas as seguintes recomendações:\n- A aplicação deve ser realizada por médico capacitado;\n- utilizar sempre solução salina sem conservantes (soro fisiológico a 0,9%) para reconstituição;\n- evitar o borbulhamento ou a agitação do conteúdo do frasco durante a reconstituição e a aspiração do medicamento para a seringa de injeção;\n- indicar e modificar as injeções (doses e pontos de aplicação) de acordo com o resultado terapêutico obtido após cada aplicação;\n- aplicar as injeções em múltiplos pontos em cada músculo (pelo menos dois pontos, podendo ser mais nos músculos grandes);\n- em adultos, recomenda-se uma dose máxima por aplicação de TBA-1= 360 U e de TBA-2= 1.000 U;\n- em crianças, recomenda-se uma dose máxima, por sessão de aplicação, de 6 U/kg ou 300 U de TBA-1. A TBA-2 não foi registrada para tratamento das distonias em menores de 2 anos;\n- administrar a TBA em todos os músculos desejados na mesma sessão de aplicação;\n- respeitar um intervalo mínimo de 3 meses entre as aplicações de TBA (para diminuir o risco de formação de anticorpos contra a toxina), mesmo que sejam em músculos diferentes;\n- considerar, em decisão colegiada, o uso de EMG ou eletroestimulação para as aplicações de TBA em casos especiais, quando determinados músculos não podem ser adequadamente palpados ou quando o paciente é refratário ao tratamento, para otimizar a administração da toxina [segundo a literatura (53), as taxas de melhora são semelhantes entre as aplicações guiadas ou não por EMG, concluindo que seu uso não é necessário na maioria dos pacientes].",
   "pagina": 11,
   "completo": true
  }
 },
 {
  "id_pcdt": 38,
  "titulo": "Distúrbio Mineral Ósseo na Doença Renal Crônica",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 15 - 04/08/2022",
  "data_portaria": "2022-08-30",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/copy_of_DistrbioMineralsseonaDoenaRenalCrnica.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2022/20220830_Portaria_conjunta_15.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/20230213_PCDT_Resumido_DMO_DRC_final.pdf/@@display-file/file",
  "paginas": 62,
  "tem_texto": true,
  "cids": [
   "N18.2",
   "N18.3",
   "N18.4",
   "N18.5",
   "N25.0"
  ],
  "farmacos": [
   {
    "nome": "calcitriol",
    "chave": "calcitriol",
    "no_rename": true,
    "id_monografia_ftn": 47
   },
   {
    "nome": "paricalcitol",
    "chave": "paricalcitol",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "cinacalcete",
    "chave": "cinacalcete",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "sevelâmer",
    "chave": "sevelamer",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "desferroxamina",
    "chave": "desferroxamina",
    "no_rename": true,
    "id_monografia_ftn": 224
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "esquemas",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "-  Carbonato de cálcio: A dose deve, preferencialmente, ser dividida em três tomadas, administrada junto com cada refeição e ajustada de acordo com os níveis de fósforo e cálcio. Recomenda-se que a dose inicial seja de 500 mg de cálcio elementar (um comprimido de carbonato de cálcio de 1.250 mg), por via oral, com aumento conforme a necessidade e tolerância até dose máxima de 2.500 mg de cálcio elementar em crianças (cerca 6.000 mg de carbonato de cálcio) e dose máxima de 2.000 mg de cálcio elementar em adultos (cerca de 5.000 mg de carbonato de cálcio). Para o tratamento da síndrome da fome óssea, em pacientes dialíticos, a dose inicial deve ser de 5.000 mg a 15.000 mg de carbonato de cálcio, divididas em 2 ou 3 vezes ao dia, após a liberação da dieta, longe das refeições. Em pacientes transplantados renais, a reposição oral deve ser iniciada após normalização da hipercalcemia, na dose de 2.000 a 3.000 mg, divididas em 2 ou 3 vezes ao dia.  Após o segundo dia de pósoperatório, a dose deve ser ajustada diariamente, de acordo com o nível de calcio sérico, visando à suspensão da infusão endovenosa de gluconato de cálcio o mais precocemente possível54.\n- Cloridrato de sevelâmer: A dose inicial recomendada é de 800 a 1.600 mg (1 a 2 comprimidos), a qual pode ser administrada a cada refeição (duas ou três vezes por dia), devendo ser ajustada de acordo com o nível de fósforo, visando alvo entre 3,5 e 5,5 mg/dL. A dose pode ser aumentada ou diminuída em um comprimido por refeição em intervalos de quatro semanas. Se os valores de fósforo forem inferiores a 3,5 mg/dL, deve-se reduzir um comprinido. Se valores forem superiores a 6 mg/dL, deve-se aumentar um comprimido por refeição. A dose máxima recomendada é de 7.200 mg/dia. Deve-se sempre utilizar a menor dose possível com base na dosagem de fósforo sérico.\n- Calcitriol: A dose recomendada é de 0,25 mcg duas vezes ao dia. Os níveis de cálcio e fósforo devem ser monitorados a cada 4 semanas. Para o tratamento da síndrome de fome óssea, deve-se iniciar calcitriol oral na dose de 2,5 mcg/dia (em pacientes dialíticos) ou 0,75 mcg/dia (em pacientes transplantados), fracionada em doses concomitantes ao uso de carbonato de cálcio.  A dose máxima não deve ultrapassar 7,5 mcg/dia.",
   "pagina": 13,
   "completo": false
  }
 },
 {
  "id_pcdt": 39,
  "titulo": "Doença Celíaca",
  "portaria": "Portaria Conjunta SAES/SECTICS/MS nº 8 - 1º/07/2025",
  "data_portaria": "2025-07-14",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/portaria-no-8-pcdt-doenca-celiaca.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2025/portaria-conjunta-saes-sectics-no-8-de-1-de-julho-de-2025.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/pcdt-resumido-doenca-celiaca/@@display-file/file",
  "paginas": 22,
  "tem_texto": true,
  "cids": [
   "K90.0"
  ],
  "farmacos": [
   {
    "nome": "calcio",
    "chave": "calcio",
    "no_rename": true,
    "id_monografia_ftn": 50
   },
   {
    "nome": "zinco",
    "chave": "zinco",
    "no_rename": true,
    "id_monografia_ftn": 318
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 40,
  "titulo": "Doença de Alzheimer",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 27 - 27/11/2025",
  "data_portaria": "2025-11-28",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-da-doenca-de-alzheimer/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2025/portaria-conjunta-saes-sctie-no-27-de-27-de-novembro-de-2025/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 90,
  "tem_texto": true,
  "cids": [
   "G30.0",
   "G30.1",
   "G30.8",
   "F00.0",
   "F00.1",
   "F00.2"
  ],
  "farmacos": [
   {
    "nome": "donepezila",
    "chave": "donepezila",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "galantamina",
    "chave": "galantamina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "memantina",
    "chave": "memantina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "rivastigmina",
    "chave": "rivastigmina",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "esquemas",
   "criterios_interrupcao",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Bromidrato de galantamina: cápsulas de liberação prolongada de 8 mg, 16 mg e 24 mg;\n- Cloridrato de donepezila: comprimidos de 5 mg e 10 mg;\n- Cloridrato de memantina: comprimidos de 10 mg;\n- Rivastigmina: cápsulas de 1,5 mg, 3 mg, 4,5 mg e 6 mg; solução oral de 2 mg/mL; adesivos transdérmicos de 5 cm2 contendo 9 mg de rivastigmina com percentual de liberação de 4,6 mg/24 horas, e; de 10 cm2 contendo 18 mg de rivastigmina, percentual de liberação de 9,5 mg/24 horas.",
   "pagina": 12,
   "completo": true
  },
  "esquemas": {
   "texto": "Os esquemas de administração dos medicamentos por via oral estão descritos no Quadro 5.\n13 Quadro 5. Esquemas de administração dos medicamentos (via oral).\nMedicamento Dose inicial Duração e outras orientações Donepezila 5 mg/dia, via oral A dose pode ser aumentada para 10 mg/dia após 4 a 6 semanas.\nOs comprimidos podem ser ingeridos com ou sem alimentos.\nGalantamina 8 mg/dia, via oral A dose inicial deve ser utilizada durante 4 semanas.\nA dose de manutenção é de 16 mg/dia durante pelo menos quatro semanas. A dose máxima é de 24 mg/dia.\nPor serem cápsulas de liberação prolongada, devem ser administradas uma vez ao dia, pela manhã, de preferência com alimentos.\nEm caso de insuficiência hepática ou renal moderada, a dose deve ser ajustada considerando a dose máxima de 16 mg/dia.\nRivastigmina (cápsula) 3 mg/dia, via oral A dose pode ser aumentada para 6 mg/dia após 2 semanas.\nAumentos subsequentes para 9 mg/dia e para 12 mg/dia devem ser feitos de acordo com a tolerabilidade e após um intervalo de 2 semanas.\nA dose máxima é de 12 mg/dia. As doses devem ser divididas em duas administrações, junto às refeições.\nÉ desnecessário realizar ajuste em casos de insuficiência hepática ou renal, mas deve-se ter cautela em caso de insuficiência hepática (administrar as menores doses possíveis).\nMemantina 5 mg/dia (1/2 comprimido) Aumentar 5 mg/semana nas 3 semanas subsequentes até chegar à dose de 20 mg/dia (1 comprimido de 10 mg duas vezes por dia) na quarta semana e manter esta dose.\nEm pacientes com função renal ligeiramente alterada (depuração de creatinina entre 50 e 80 mL/min), não há necessidade de ajuste de dose. Nos casos de comprometimento moderado (entre 30 e 49 mL/min), a dose inicial é de 10 mg/dia, podendo ser aumentada para 20 mg/dia após 7 dias se bem tolerada. Já em comprometimento grave (entre 5 e 29 mL/min), a dose deve ser mantida em 10 mg/dia.\nFonte: elaboração própria com base na bula dos medicamentos 106–109.\nRivastigmina (adesivos transdérmicos) O uso de adesivos transdérmicos inicia-se com a apresentação de 5 cm2 por, no mínimo, 4 semanas de tratamento.",
   "pagina": 12,
   "completo": false
  }
 },
 {
  "id_pcdt": 41,
  "titulo": "Doença de Chagas",
  "portaria": "Portaria SCTIE/MS nº 57/2018 - 30/10/2018",
  "data_portaria": "2018-10-31",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt_doenca_de_chagas.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2018/portariassctie_44-45_50a54_56a61.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/PCDTResumidoDoenadeChagas.pdf/@@display-file/file",
  "paginas": 135,
  "tem_texto": true,
  "cids": [
   "B57",
   "B57.0",
   "B57.1",
   "B57.2",
   "B57.3",
   "B57.4",
   "B57.5",
   "K23.1",
   "K93.1"
  ],
  "farmacos": [
   {
    "nome": "benznidazol",
    "chave": "benznidazol",
    "no_rename": true,
    "id_monografia_ftn": 38
   },
   {
    "nome": "nifurtimox",
    "chave": "nifurtimox",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "amiodarona",
    "chave": "amiodarona",
    "no_rename": true,
    "id_monografia_ftn": 80
   },
   {
    "nome": "dinitrato de isossorbida",
    "chave": "dinitrato de isossorbida",
    "no_rename": true,
    "id_monografia_ftn": 138
   },
   {
    "nome": "glicerol",
    "chave": "glicerol",
    "no_rename": true,
    "id_monografia_ftn": 178
   },
   {
    "nome": "enalapril",
    "chave": "enalapril",
    "no_rename": true,
    "id_monografia_ftn": 218
   },
   {
    "nome": "captopril",
    "chave": "captopril",
    "no_rename": true,
    "id_monografia_ftn": 48
   },
   {
    "nome": "metoprolol",
    "chave": "metoprolol",
    "no_rename": true,
    "id_monografia_ftn": 297
   },
   {
    "nome": "carvedilol",
    "chave": "carvedilol",
    "no_rename": true,
    "id_monografia_ftn": 54
   },
   {
    "nome": "hidroclorotiazida",
    "chave": "hidroclorotiazida",
    "no_rename": true,
    "id_monografia_ftn": 188
   },
   {
    "nome": "furosemida",
    "chave": "furosemida",
    "no_rename": true,
    "id_monografia_ftn": 175
   },
   {
    "nome": "espironolactona",
    "chave": "espironolactona",
    "no_rename": true,
    "id_monografia_ftn": 147
   },
   {
    "nome": "digoxina",
    "chave": "digoxina",
    "no_rename": true,
    "id_monografia_ftn": 137
   },
   {
    "nome": "hidralazina",
    "chave": "hidralazina",
    "no_rename": true,
    "id_monografia_ftn": 100
   },
   {
    "nome": "mononitrato de isossorbida",
    "chave": "mononitrato de isossorbida",
    "no_rename": true,
    "id_monografia_ftn": 233
   },
   {
    "nome": "calcio",
    "chave": "calcio",
    "no_rename": true,
    "id_monografia_ftn": 50
   },
   {
    "nome": "verapamil",
    "chave": "verapamil",
    "no_rename": true,
    "id_monografia_ftn": 124
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "tratamento"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 42,
  "titulo": "Doença de Crohn (Anexo alterado em 20/08/2026)",
  "portaria": "Portaria Conjunta SAS/SCTIE/MS nº 51 - 18/05/2026",
  "data_portaria": "2026-07-26",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/portaria-no-51-pcdt-doenca-de-crohn_19.08/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2026/portaria-conjunta-saes-sctie-no-51-de-18-de-maio-de-2026/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 42,
  "tem_texto": true,
  "cids": [
   "K50.0",
   "K50.1",
   "K50.8"
  ],
  "farmacos": [
   {
    "nome": "sulfassalazina",
    "chave": "sulfassalazina",
    "no_rename": true,
    "id_monografia_ftn": 303
   },
   {
    "nome": "mesalazina",
    "chave": "mesalazina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "azatioprina",
    "chave": "azatioprina",
    "no_rename": true,
    "id_monografia_ftn": 33
   },
   {
    "nome": "metotrexato",
    "chave": "metotrexato",
    "no_rename": true,
    "id_monografia_ftn": 229
   },
   {
    "nome": "metilprednisolona",
    "chave": "metilprednisolona",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "infliximabe",
    "chave": "infliximabe",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "adalimumabe",
    "chave": "adalimumabe",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "certolizumabe pegol",
    "chave": "certolizumabe pegol",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "ustequinumabe",
    "chave": "ustequinumabe",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "vedolizumabe",
    "chave": "vedolizumabe",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "esquemas",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Adalimumabe: solução injetável de 40 mg;\n- Azatioprina: comprimido de 50 mg;\n- Certolizumabe pegol: solução injetável de 200 mg;\n- Cloridrato de ciprofloxacino: comprimidos de 250 mg e 500 mg;\n- Infliximabe: pó para solução injetável de 100 mg (apresentação IV); solução injetável de 120 mg/mL (apresentação SC);\n- Mesalazina: comprimido de 400 mg e 800 mg, comprimido de liberação prolongada 500 mg e 800 mg;\n- Metilprednisolona: pó para: solução injetável de 500 mg;\n- Metotrexato: solução injetável de 25 mg/mL;\n- Metronidazol: comprimidos de 250 mg e 400 mg;\n- Prednisona: comprimidos de 5 mg e 20 mg;\n- Succinato sódico de hidrocortisona: pó para solução injetável de 100 mg e 500 mg;\n- Sulfassalazina: comprimido de 500 mg;\n- Ustequinumabe: solução injetável de 130 mg, 45 mg e 90 mg/1,0 mL.\n- Vedolizumabe: pó para solução injetável de 300 mg.",
   "pagina": 14,
   "completo": true
  },
  "esquemas": {
   "texto": "Cloridrato de ciprofloxacino: 1 comprimido, por via oral (VO), 12/12 horas, após as refeições e afastados do uso de antiácidos.\nSuccinato sódico de hidrocortisona: 100 mg, infusão intermitente por IV, 8/8 horas.\nMesalazina: 4 g/dia, VO, divididos de 6/6 horas, 8/8 horas ou 12/12 horas.\nMetilprednisolona: 1 mg/kg/dia, em bolus por IV com concentração máxima de 125 mg/mL, dividido de 6/6 horas.\nMetronidazol: 20 mg/kg/dia, VO, dividido de 8/8 horas, após as refeições.\nPrednisona: 40 mg a 60 mg por dia VO, até a resolução dos sintomas e a cessação da perda de peso ou, em altas doses, 1 mg/kg/dia VO após as refeições. Recomenda-se reduzir de 5 mg a 10 mg por semana até a dose de 20 mg e, após, 2,5 mg a 5 mg por semana até suspender o tratamento.\nSulfassalazina: 2 comprimidos a 4 comprimidos, VO, 8/8 horas, após as refeições.\nAzatioprina:      dose inicial de 50 mg, VO, por dia, iniciada junto com o tratamento de indução com corticoide, para testar tolerância do paciente (ver Monitoramento). Após a exclusão de pancreatite (em casos de dor abdominal), hepatotoxicidade e mielotoxicidade, escalona-se a dose para a faixa terapêutica de 2,0 mg/kg/dia a 2,5 mg/kg/dia, VO, 24/24 horas, após as refeições.\nMetotrexato:\n- Tratamento de indução de remissão: 25 mg, em dose semanal, por via intramuscular (IM).\n- Tratamento de manutenção de remissão: 12,5 a 25 mg, em dose semanal, IM.\nInfliximabe:\nInfusão IV em pelo menos 120 minutos:\n- Tratamento de indução e manutenção de remissão: 5 mg/kg/semana, administrado por um período mínimo de 2 horas, nas semanas 0, 2 e 6 e, após a indução, manutenção a cada 8 semanas. A partir da semana 14 de tratamento é possível aumentar a dose para 10 mg/kg a cada 8 semanas ou diminuir o intervalo de administração para 4 semanas ou 6 semanas, se houver resposta parcial ou perda de resposta.\n- Tratamento de DC complicada por fístula perianal complexa: 5 mg/kg/semana, administrado por um período mínimo de 2 horas, nas semanas 0, 2, 6 e, após a indução, manutenção a cada 8 semanas. Se o paciente não responder após essas três doses, não se deve instituir tratamento adicional com infliximabe. É possível aumentar para 10 mg/kg a cada 8 semanas em caso de perda de resposta a partir da semana 22 de tratamento.\nAdministração SC, para pacientes adultos com DC complicada por fístula perianal complexa:",
   "pagina": 14,
   "completo": false
  }
 },
 {
  "id_pcdt": 43,
  "titulo": "Doença de Fabry",
  "portaria": "Portaria Conjunta SAES/SECTICS/MS nº 02 - 15/01/2025",
  "data_portaria": "2025-01-23",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/protocolo-clinico-e-diretrizes-terapeuticas-da-doenca-de-fabry/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2025/portaria-conjunta-saes-sectics-no-2-de-15-de-janeiro-de-2025/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/PCDT_Resumido_DoenadeFabry_F.pdf/@@display-file/file",
  "paginas": 49,
  "tem_texto": true,
  "cids": [
   "E75.2"
  ],
  "farmacos": [
   {
    "nome": "alfagalsidase",
    "chave": "alfagalsidase",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "betagalsidase",
    "chave": "betagalsidase",
    "no_rename": false,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "esquemas",
   "criterios_interrupcao",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "− Alfagalsidase: solução injetável de 1 mg/mL;\n− Beta-agalsidase: pó para solução injetável de 35 mg.",
   "pagina": 15,
   "completo": true
  },
  "esquemas": {
   "texto": "− Alfagalsidase: a dose recomendada é de 0,2 mg/kg de peso em administração intravenosa (IV) a cada duas semanas. O preparo deve envolver a diluição do volume total da alfagalsidase em 100 mL de solução de cloreto de sódio 0,9% para infusão55.\n− Beta-agalsidase: a dose recomendada é de 1 mg/kg de peso em administração IV a cada duas semanas. O pó para solução injetável deve ser reconstituído com água estéril para solução, diluído com solução intravenosa de cloreto de sódio 0,9%. O medicamento beta-agalsidase deve ser diluído entre 50 e 500 mL de cloreto de sódio 0,9% considerando a dose individual. Para doses menores que 35 mg deverá ser usado um mínimo de 50 mL; para doses de 35 a 70 mg, utilizar um mínimo de 100 mL;\npara doses de 70 a 100 mg, utilizar um mínimo de 250 mL, e; para doses maiores que 100 mg, utilizar 500 mL56.",
   "pagina": 15,
   "completo": true
  }
 },
 {
  "id_pcdt": 44,
  "titulo": "Doença de Gaucher",
  "portaria": "Portaria Conjunta SAES/SECTICS/MS nº 10 - 02/07/2025",
  "data_portaria": "2025-07-14",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/portaria-no-10-pcdt-doenca-de-gaucher.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2025/portaria-conjunta-saes-sectics-no-10-de-1-de-julho-de-2025.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/pcdt-resumido-da-doenca-de-gaucher/@@display-file/file",
  "paginas": 79,
  "tem_texto": true,
  "cids": [
   "E75.2"
  ],
  "farmacos": [
   {
    "nome": "alfataliglicerase",
    "chave": "alfataliglicerase",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "imiglucerase",
    "chave": "imiglucerase",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "alfavelaglicerase",
    "chave": "alfavelaglicerase",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "miglustate",
    "chave": "miglustate",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "medicamentos",
   "esquemas",
   "criterios_interrupcao",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Alfataliglicerase: pó para solução injetável de 200 U;\n- Alfavelaglicerase: pó para solução injetável de 400 U;\n- Imiglucerase: pó para solução injetável de 400 U;\n- Miglustate: cápsulas de 100 mg.",
   "pagina": 15,
   "completo": true
  },
  "esquemas": {
   "texto": "Terapia de reposição enzimática (TRE) Neste Protocolo, a TRE, independentemente da forma recombinante da enzima a ser utilizada, deve ser feita em pacientes adultos sem doença grave com a menor dose eficaz (15 U/kg/infusão, com infusões a cada 2 semanas) 66–71. Ajustes de doses para 30 U/kg/infusão a cada 2 semanas serão permitidos nos casos em que nenhuma resposta seja observada, conforme item ‘Monitoramento’. Lesões irreversíveis presentes já ao início do tratamento, como osteonecrose, compressão vertebral e fibrose avançada do fígado e do baço, não poderão ser utilizadas como parâmetros ou desfechos para cálculo das doses de início, de manutenção ou dos reajustes.\nDoses iniciais de 30 U/kg/infusão a cada 2 semanas são preconizadas para crianças com menos de 12 anos ou para adolescentes com idade inferior a 19 anos e que não tenham completado crescimento ósseo, conforme radiografia para determinação da idade óssea 72,73.\nA utilização de doses iniciais de 60 U/kg/infusão a cada 2 semanas fica recomendada somente aos casos de doença grave, independentemente da faixa etária. Os pacientes que estiverem em uso de 60 U/kg/infusão a cada 2 semanas deverão ser reavaliados a cada 6 meses em centro de referência em doenças raras com vistas à otimização da dose. Nos pacientes com DG tipo 3, a melhora neurológica é improvável e de difícil aferição, e não pode ser considerada como critério para ajuste de dose.\nRecomenda-se que as infusões sejam feitas com filtro 0,2 micra, inicialmente em um período de 2 horas, em serviço de atenção especializada. O esquema de ajuste posológico da TRE preconizado considera as evidências disponíveis e os dados de efetividade. A dose de início e a dose mínima de manutenção de tratamento preconizada neste Protocolo encontramse descritas no Quadro 5.\n16 Quadro 5. Dose de início e de manutenção de tratamento com terapia de reposição enzimática.\nCaracterísticas do Paciente Presença de doença grave a Dose de início da enzima b (U/kg/infusão a cada 2 semanas) Dose mínima de manutenção (U/kg/Infusão) c Adultos (18 anos ou mais) ou adolescentes que já ultrapassaram a fase de crescimentod.\nNão 15 15 Sim 60 15 Crianças e adolescentes (menores de 18 anos) em fase de crescimento d.\nNão 30 30 Sim 60 30 Fonte: Elaboração própria.\nNotas: a - conforme definido no item Diagnóstico; b - A dose de início é a dose máxima que pode ser reduzida de acordo com a resposta clínica do paciente;",
   "pagina": 15,
   "completo": false
  }
 },
 {
  "id_pcdt": 45,
  "titulo": "Doença de Paget",
  "portaria": "Portaria Conjunta SAES/SCTICS/MS nº 2 - 17/01/2020",
  "data_portaria": "2020-01-23",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-paget.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2020/portariaconjunta_sctie_saes_02_2020.pdf/@@display-file/file",
  "url_publicacao_ms": "https://www.gov.br/conitec/pt-br/midias/protocolos/publicacoes_ms/pcdt_doena-de-paget_final_isbn_20-08-2020.pdf/@@display-file/file",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/pcdt_resumido_doencapaget.pdf/@@display-file/file",
  "paginas": 21,
  "tem_texto": true,
  "cids": [
   "M88.0",
   "M88.8"
  ],
  "farmacos": [
   {
    "nome": "alendronato",
    "chave": "alendronato",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "risedronato",
    "chave": "risedronato",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "calcitonina",
    "chave": "calcitonina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "ácido zoledrônico",
    "chave": "acido zoledronico",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "carbonato de cálcio + colecalciferol",
    "chave": "calcio + colecalciferol",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "esquemas",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Alendronato de sódio: comprimidos de 10 mg\n- Risedronato sódico: comprimidos de 35 mg\n- Ácido zoledrônico: frasco com 100 mL de solução, com 5 mg/100 mL\n- Calcitonina: aerossol nasal em frasco de 200 UI\n- Carbonato de cálcio + colecalciferol: comprimidos de 1.250 mg (500 mg de cálcio elementar) + 200 ou 400 UI;\ncomprimidos de 1.500 mg (600 mg de cálcio elementar) + 400 UI",
   "pagina": 6,
   "completo": true
  },
  "esquemas": {
   "texto": "Alendronato de sódio: 40 mg por via oral, em dose única diária, por 6 meses. Deve ser ingerido pela manhã, meia hora antes da refeição, com um copo cheio de água (180-240 ml). O paciente deve ficar de pé ou sentado, com espaldar reto por no mínimo 30 minutos após a administração do medicamento.\nRisedronato sódico: 35 mg por via oral*1, em dose única diária, por 2 meses. Deve ser ingerido pela manhã, meia hora antes da refeição, com 300 mL de água. O paciente deve ficar de pé ou sentado por no mínimo 30 minutos após a administração do medicamento.\nÁcido Zoledrônico: 5 mg por via intravenosa. A dose é de 5 mg, com 12 meses de intervalo mínimo para retratamento.\nCalcitonina: 200 UI por via inalatória nasal, diariamente ou 3 vezes por semana por 6 a 18 meses.\nCarbonato de cálcio + colecalciferol: 1,2 a 1,5 g/dia de cálcio elementar e 600 a 1.200 UI/dia de colecalciferol, dividido em 3 doses por 6 meses. Verificar a apresentação mais adequada de acordo com a posologia prescrita.",
   "pagina": 6,
   "completo": true
  }
 },
 {
  "id_pcdt": 46,
  "titulo": "Doença de Parkinson",
  "portaria": "Portaria Conjunta SAES/SECTIE/MS nº 16 - 01/08/2025",
  "data_portaria": "2025-09-18",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-doenca-de-parkinson/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2025/portaria-conjunta-saes-sectics-no-16-de-1o-de-agosto-de-2025/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 77,
  "tem_texto": true,
  "cids": [
   "G20"
  ],
  "farmacos": [
   {
    "nome": "amantadina",
    "chave": "amantadina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "biperideno",
    "chave": "biperideno",
    "no_rename": true,
    "id_monografia_ftn": 82
   },
   {
    "nome": "clozapina",
    "chave": "clozapina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "entacapona",
    "chave": "entacapona",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "levodopa + benserazida",
    "chave": "levodopa + benserazida",
    "no_rename": true,
    "id_monografia_ftn": 210
   },
   {
    "nome": "levodopa + carbidopa",
    "chave": "levodopa + carbidopa",
    "no_rename": true,
    "id_monografia_ftn": 211
   },
   {
    "nome": "pramipexol",
    "chave": "pramipexol",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "rasagilina",
    "chave": "rasagilina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "triexifenidil",
    "chave": "triexifenidil",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "rivastigmina",
    "chave": "rivastigmina",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "esquemas",
   "criterios_interrupcao",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Amantadina: comprimidos de 100 mg;\n- Biperideno: comprimidos de 2 mg e comprimidos de liberação controlada de 4 mg;\n15\n- Clozapina: comprimidos de 25 e 100 mg;\n- Entacapona: comprimidos de 200 mg;\n- Levodopa + benserazida: cápsulas de 100 mg + 25 mg, comprimidos de 100 mg + 25 mg e de 200 mg + 50 mg;\n- Levodopa + carbidopa: comprimidos de 200 mg + 50 mg e de 250 mg + 25 mg;\n- Pramipexol: comprimidos de 0,125 mg, 0,25 mg e 1 mg;\n- Rasagilina: comprimidos de 1 mg;\n- Rivastigmina: cápsulas de 1,5 mg, 3 mg, 4,5 mg e 6 mg; adesivo transdérmico de 9 mg (equivalente a 4,6 mg por 24 horas), 18 mg (equivalente a 9,5 mg por 24 horas); solução oral de 2 mg/mL;\n- Triexifenidil: comprimidos de 5 mg.",
   "pagina": 14,
   "completo": true
  },
  "esquemas": {
   "texto": "Os esquemas de administração segundo medicamentos estão representados no Quadro 5.\nQuadro 5 - Medicamentos disponíveis no SUS para tratamento da doença de Parkinson.\nMedicamento Fase Inicial Fase Avançada Condições especiais Posologia Levodopa + benserazida X X NA A dose recomendada é de 200/50 mg por dia, dividida em pelo menos duas administrações. As doses vão sendo ajustadas subsequentemente de acordo com a resposta clínica. A dose média eficaz para a maioria dos pacientes é de 600-750 mg/dia de levodopa.\nDependendo da tolerância e resposta clínica a dose pode ser aumentada até o máximo de 2.000 mg/dia.\nA levodopa/benserazida é disponibilizada em diferentes formulações. A forma de comprimido padrão é de 100/25 e 200/50. Esta apresentação apresenta início de ação em torno de 20-40 minutos e duração de 2 a 4 horas; a forma em cápsula apresenta um início de ação de 30-60 minutos e duração de 3 a 6 horas. A forma dispersível para diluição em água possui início de ação mais rápido (10-20 minutos) e menor duração (0,5-1 hora).\nApesar destas variabilidades farmacocinéticas, não há evidências clínicas (estudos clínicos) que mostrem de forma convincente superioridade entre as apresentações. A apresentação dispersível é uma forma útil em pacientes com disfagia ou sonda de alimentação enteral.\nLevodopa + carbidopa X X NA A dose inicial recomendada é de 250/25 mg por dia, dividida em pelo menos duas administrações. A dose máxima recomendada de levodopa é de 2.000 mg/dia.\n16 Medicamento Fase Inicial Fase Avançada Condições especiais Posologia Pramipexol X X NA Inicial: 0,375 mg/dia, subdividida em três doses diárias, e deve ser aumentada a cada 5 a 7 dias. Se houver necessidade de aumento da dose, acrescentar semanalmente 0,75 mg à dose diária até atingir a dose máxima de 4,5 mg/dia (aumento sucessivo para 0,75 mg; 1,5 mg; 2,25 mg; 3,0 mg; e 4,5 mg/dia);\nManutenção: a dose individual deve situar-se no intervalo entre 0,375 mg/dia e a dose máxima de 4,5 mg/dia.\nRasagilina X X NA 1 mg ao dia.",
   "pagina": 15,
   "completo": false
  }
 },
 {
  "id_pcdt": 47,
  "titulo": "Doença de Pompe",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 12 - 03/08/2020",
  "data_portaria": "2020-08-10",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/protocolo_uso/portaria-conjunta-pcdt-doena-de-pompe10-08-2020.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2020/portariaconjunta_sctie_saes_12_2020.pdf/@@display-file/file",
  "url_publicacao_ms": "https://www.gov.br/conitec/pt-br/midias/protocolos/publicacoes_ms/pcdt_doenca_de_pompe_final_isbn.pdf/@@display-file/file",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/pcdt_doenca_de_pompe.pdf/@@display-file/file",
  "paginas": 27,
  "tem_texto": true,
  "cids": [],
  "farmacos": [
   {
    "nome": "alfa-alglicosidase",
    "chave": "alfa-alglicosidase",
    "no_rename": false,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "esquemas",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Alfa-alglicosidase ácida: frasco-ampola com 50 mg de pó liofilizado",
   "pagina": 13,
   "completo": true
  },
  "esquemas": {
   "texto": "- Alfa-alglicosidase: 20 mg/kg, via intravenosa, a cada 15 dias.\nCada frasco deve ser reconstituído com 10,3 mL de água para injeção (concentração final de 5 mg/mL) e, após, diluído em solução de cloreto de sódio 0,9 % até uma concentração final entre 0,5 mg e 4 mg/mL. A administração deve ser lenta, por meio de bomba de infusão IV. Iniciar com uma taxa de infusão de 1 mg/kg/hora e aumentar gradualmente para 2 mg/kg/hora a cada 30 minutos até o máximo de 7 mg/kg/hora1.\nMonitorizar a infusão a cada 15 minutos, especialmente em relação ao sistema cardiorespiratório, avaliando a ausculta respiratória, as frequências respiratória e cardíaca e a pressão arterial antes e durante a infusão1. A infusão deve ser feita em ambiente hospitalar ou ambulatorial. Infusões domiciliares podem ser consideradas após 6 meses de tratamento sem intercorrências.",
   "pagina": 13,
   "completo": true
  }
 },
 {
  "id_pcdt": 48,
  "titulo": "Doença de Wilson",
  "portaria": "Portaria Conjunta SAES/SECTICS/MS nº 15 – 01/11/2024",
  "data_portaria": "2024-12-06",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/protocolo-clinico-e-diretrizes-terapeuticas-da-doenca-de-wilson/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2024/portaria-conjunta-saes-sectics-no-15-de-1o-de-novembro-de-2024/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/pcdt-resumido-da-doenca-de-wilson/@@display-file/file",
  "paginas": 30,
  "tem_texto": true,
  "cids": [
   "E83.0"
  ],
  "farmacos": [
   {
    "nome": "penicilamina",
    "chave": "penicilamina",
    "no_rename": true,
    "id_monografia_ftn": 112
   },
   {
    "nome": "piridoxina",
    "chave": "piridoxina",
    "no_rename": true,
    "id_monografia_ftn": 114
   },
   {
    "nome": "trientina",
    "chave": "trientina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "sulfato de zinco",
    "chave": "zinco",
    "no_rename": true,
    "id_monografia_ftn": 318
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "esquemas",
   "criterios_interrupcao",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Penicilamina: cápsula de 250 mg.\n- Trientina: cápsula de 250 mg.\n- Piridoxina: comprimido de 40 mg.\n- Sulfato de zinco: comprimido mastigável de 10 mg; xarope de 4 mg de zinco elementar/mL.\nNo Brasil, não há preparações farmacêuticas industriais prontas de acetato de zinco, sendo necessário que sejam manipuladas em farmácias magistrais.",
   "pagina": 11,
   "completo": true
  },
  "esquemas": {
   "texto": "- Penicilamina: cápsula de 250 mg - Adultos: 250 mg/dia em fase inicial e 750 a 1.500 mg/dia em fase de manutenção - Crianças: 20 mg/kg/dia (arredondado para os 250 mg mais próximos) Administrar via oral, dividido em 2 a 4 doses diárias, uma hora antes ou duas horas após as refeições e, pelo menos, uma hora antes de ingerir qualquer alimento ou medicamento11,12. O paciente deve ser orientado a tomar meio litro de líquido ao deitar e outro meio litro uma vez durante a noite. Em adultos, a dose inicial recomendada é de 250 mg/dia, aumentada gradualmente até a quantidade desejada, por incrementos de 250 mg semanais. Para maior segurança do paciente, sugere-se que o aumento de dose seja realizado sob monitoramento clínico e bioquímico11,12. O tratamento adequado pode ser identificado pela quantificação de cobre sérico livre no soro, usualmente menor que 10 mcg/dL. Na ausência de reações adversas, a dose de manutenção pode ser mantida entre 750 e 1.500 mg12,48. A administração única de doses maiores ou iguais a 1.500 mg por dia pode levar a deterioração neurológica rápida e irreversível15.\n- Trientina: cápsula de 250 mg - Adultos: 750 a 1.250 mg/dia em fase inicial, com dose de manutenção máxima de 2.000 mg/dia - Crianças: 500 a 750 mg/dia em fase inicial, com dose de manutenção máxima de 1.500 mg/dia Administrar via oral, dividido em 2 a 4 doses diárias, uma hora antes ou duas horas após as refeições e, pelo menos, uma hora antes de ingerir qualquer alimento ou medicamento12. Caso não seja observada resposta clínica adequada ou quando a concentração de cobre sérico livre no soro apresentar medidas persistentes acima de 20 mcg/dL, a dose diária deve ser aumentada.\nÉ recomendado que as doses de manutenção sejam determinadas em intervalos de 6 a 12 meses49.\n- Piridoxina: comprimido de 40 mg - Adultos e crianças: 20 mg/dia, via oral, concomitante ao uso de penicilamina.\n- Sulfato de zinco (zinco elementar) - Adultos: 150 mg de zinco elementar/dia - Crianças:  50 mg de zinco elementar/dia para menores de 5 anos; 75mg de zinco elementar/dia para crianças com peso corporal menor que 50 kg; 150 mg de zinco elementar/dia para crianças com peso corporal maior que 50 kg Para menores de 5 anos: Administrar via oral, 25 mg de zinco elementar duas vezes ao dia, 30 minutos antes da refeição.\nPara os demais, administrar via oral, a dose diária dividida em três vezes, 30 minutos antes da refeição12.",
   "pagina": 12,
   "completo": false
  }
 },
 {
  "id_pcdt": 49,
  "titulo": "Doença Falciforme",
  "portaria": "Portaria Conjunta SAES/SECTICS/MS nº 16 - 01/11/2024",
  "data_portaria": "2024-11-22",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-da-doenca-falciforme/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2024/portaria-conjunta-saes-sectics-no-16-de-1o-de-novembro-de-2024/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/pcdt-resumido-doenca-falciforme/@@display-file/file",
  "paginas": 89,
  "tem_texto": true,
  "cids": [
   "D57.0",
   "D57.1",
   "D57.2"
  ],
  "farmacos": [
   {
    "nome": "ácido fólico",
    "chave": "acido folico",
    "no_rename": true,
    "id_monografia_ftn": 10
   },
   {
    "nome": "alfaepoetina",
    "chave": "alfaepoetina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "benzilpenicilina benzatina (penicilina g)",
    "chave": "benzilpenicilina benzatina (penicilina g)",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "eritromicina",
    "chave": "eritromicina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "fenoximetilpenicilina (penicilina v)",
    "chave": "fenoximetilpenicilina (penicilina v)",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "hidroxiureia",
    "chave": "hidroxiureia",
    "no_rename": true,
    "id_monografia_ftn": 190
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "medicamentos",
   "esquemas",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Ácido fólico: comprimidos de 5 mg e solução oral de 0,2 mg/mL;\n- Alfaepoetina humana recombinante: pó para solução injetável e em solução injetável nas concentrações de 1.000, 2.000, 3.000, 4.000 e 10.000 UI;\n- Amoxicilina: cápsulas e comprimidos de 500 mg e suspensão oral de 50 mg/mL;\n- Amoxicilina+clavulanato: cápsula de 50 mg; comprimido de 50 mg e suspensão oral de 50 mg/mL;\n- Azitromicina: comprimidos de 250 e 500 mg e pó para suspensão oral de 40 mg/mL;\n- Benzilpenicilina benzatina: pó para suspensão injetável de 600.000 e 1.200.000 UI;\n- Cefalexina: cápsulas e comprimidos de 500 mg e suspensão oral de 50 mg/mL;\n- Ceftriaxona: pó para solução injetável de 250 mg, 500 mg e 1 g;\n- Estolato de eritromicina: suspensão oral de 25 mg/mL e 50 mg/mL e comprimidos de 500 mg;\n- Fenoximetilpenicilina potássica: pó para solução oral de 80.000 UI/mL;\n- Hidroxiureia: cápsulas de 500 mg e comprimidos revestidos de 100 mg.",
   "pagina": 17,
   "completo": true
  },
  "esquemas": {
   "texto": "Hidroxiureia A dose inicial recomendada de HU é 15 mg/kg/dia, por via oral, em dose única. Aumentar em 5 mg/kg/dia a cada 4 semanas até atingir a dose máxima de 35 mg/kg/dia ou a ocorrência de toxicidade hematológica ou outros eventos adversos graves (ver seção Critérios de interrupção)92,93.\nPara crianças de até 25 kg, recomenda-se a prescrição da apresentação de 100 mg em comprimido revestido. Os comprimidos podem ser fracionados conforme a dose indicada, e desintegrados imediatamente antes do uso em uma pequena quantidade de água. Cabe destacar que o comprimido revestido de 100 mg pode ser partido em duas partes iguais (50 mg cada), o que deve ser considerado para o cálculo da dose e orientações ao paciente. Já em pessoas acima de 25 kg, a cápsula de 500 mg pode ser dissolvida em 10 mL de água destilada ou filtrada, obtendo a concentração de 50 mg/mL, o que facilita a administração da dose correta por peso, utilizando uma seringa descartável.\nUm estudo de estabilidade publicado em 2022 apontou que manipulações da preparação líquida oral de HU permaneceram estáveis por 90 dias em frascos de plástico âmbar e 14 dias em seringas de plástico âmbar116.\nPor se tratar de fármaco citotóxico, recomenda-se que a manipulação da solução ocorra em farmácias de manipulação, seguindo as boas práticas de manipulação de preparações magistrais e oficinais117. Entretanto, a disponibilização de preparação líquida pelo SUS depende da existência de Protocolos regionais e serviços de saúde com recursos físicos e humanos para preparar e distribuir as soluções.\nO tratamento com HU deve ser mantido por tempo indeterminado enquanto houver resposta clínica e laboratorial. Cerca de 25% dos pacientes não apresentam resposta satisfatória à HU, condição que pode determinar, a critério médico, a suspensão do tratamento após 2 anos de uso.\nPara um indivíduo que não apresente a resposta esperada ao tratamento, é importante revisar a administração do medicamento. A adesão a medicamento em doença crônica deve ser revista pela equipe de saúde e otimizada, mostrando ao paciente os benefícios do medicamento.\nAlfaepoetina A dose recomendada de alfaepoetina é de 12.000 UI, divididas em três aplicações por semana (4.000 UI por aplicação), administrada por via subcutânea ou intravenosa.\nProfilaxia antimicrobiana O esquema profilático preconizado desde o diagnóstico até os 5 anos de idade está descrito no Quadro 3 a seguir.",
   "pagina": 18,
   "completo": false
  }
 },
 {
  "id_pcdt": 50,
  "titulo": "Doença Pulmonar Obstrutiva Crônica",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 29 - 29/11/2025",
  "data_portaria": "2025-11-28",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-da-doenca-pulmonar-obstrutiva-cronica/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2025/portaria-conjunta-saes-sctie-no-29-de-27-de-novembro-de-2025/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 68,
  "tem_texto": true,
  "cids": [
   "J44.0",
   "J44.1",
   "J44.8"
  ],
  "farmacos": [
   {
    "nome": "brometo de ipratrópio",
    "chave": "ipratropio",
    "no_rename": true,
    "id_monografia_ftn": 43
   },
   {
    "nome": "brometo de tiotrópio monoidratado + cloridrato de olodaterol",
    "chave": "tiotropio + olodaterol",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "brometo de umeclidínio + trifenatato de vilanterol",
    "chave": "umeclidinio + trifenatato de vilanterol",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "bromidrato de fenoterol",
    "chave": "fenoterol",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "budesonida",
    "chave": "budesonida",
    "no_rename": true,
    "id_monografia_ftn": 45
   },
   {
    "nome": "dipropionato de beclometasona + fumarato de formoterol di-hidratado + brometo de glicopirrônio",
    "chave": "beclometasona + formoterol + glicopirronio",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "diproprionato de beclometasona",
    "chave": "diproprionato de beclometasona",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "fumarato de formoterol",
    "chave": "formoterol",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "fumarato de formoterol + budesonida",
    "chave": "formoterol + budesonida",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "furoato de fluticasona + brometo de umeclidínio + trifenatato de vilanterol",
    "chave": "furoato de fluticasona + umeclidinio + trifenatato de vilanterol",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "fosfato sódico de prednisolona",
    "chave": "fosfato sodico de prednisolona",
    "no_rename": true,
    "id_monografia_ftn": 173
   },
   {
    "nome": "prednisona",
    "chave": "prednisona",
    "no_rename": true,
    "id_monografia_ftn": 267
   },
   {
    "nome": "succinato sódico de hidrocortisona",
    "chave": "succinato sodico de hidrocortisona",
    "no_rename": true,
    "id_monografia_ftn": 298
   },
   {
    "nome": "sulfato de salbutamol",
    "chave": "salbutamol",
    "no_rename": true,
    "id_monografia_ftn": 315
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "medicamentos",
   "esquemas",
   "criterios_interrupcao",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- brometo de ipratrópio: solução para inalação de 0,25 mg/mL e solução com aerossol de 20 mcg/dose;\n- brometo de tiotrópio monoidratado + cloridrato de olodaterol: solução para inalação de 2,5 mcg + 2,5 mcg;\n- brometo de umeclidínio + trifenatato de vilanterol: pó inalatório de 62,5 mcg + 25 mcg;\n- bromidrato de fenoterol: solução aerossol de 100 mcg/dose;\n- budesonida: cápsula ou pó de inalação ou aerossol oral de 200 mcg e cápsula para inalação de 400 mcg ou pó inalante e aerossol oral de 200 mcg;\n- dipropionato de beclometasona + fumarato de formoterol di-hidratado + brometo de glicopirrônio: solução aerossol para inalação oral de 100 µg + 6 µg + 12,5 µg;\n- diproprionato de beclometasona: cápsula para inalação ou pó para inalação de 200 mcg e 400 mcg e solução aerossol de 50 mcg/dose, 200 mcg/dose e 250 mcg/dose; suspensão para inalação nasal de 50 mcg/dose.\n- fumarato de formoterol + budesonida: cápsula ou pó para inalação de 6 mcg + 200 mcg e de 12 mcg + 400 mcg;\n- fumarato de formoterol: cápsula ou pó para inalação de 12 mcg;\n- furoato de fluticasona + brometo de umeclidínio + trifenatato de vilanterol: pó para inalação oral 100 mcg + 62,5 mcg + 25 mcg;",
   "pagina": 19,
   "completo": false
  },
  "esquemas": {
   "texto": "Os esquemas de administração dos medicamentos para tratamento da DPOC estão disponíveis no Quadro 6.\nQuadro 6 - Esquemas de administração dos tratamentos para DPOC.\nClasse medicamentosa ou associação Esquema terapêutico SABA Alívio de broncoespasmo agudo ou antes de esforço físico:\n200 a 400 mcg de sulfato de salbutamol (2 a 4 jatos do aerossol dosimétrico), em dose única antes do esforço ou a cada 4 a 6 horas até melhora dos sintomas; ou 100 a 200 mcg de bromidrato de fenoterol (1 a 2 jatos do aerossol)48,49.\n20 Classe medicamentosa ou associação Esquema terapêutico A nebulização com salbutamol (2,5 mg, diluído em 2 a 4 mL de cloreto de sódio 0,9% (soro fisiológico) ou fenoterol (0,5 a 1 mg, equivalente a 10 a 20 gotas, diluído em 2 a 4 mL de cloreto de sódio 0,9% pode ser utilizada em pacientes muito debilitados que não conseguem utilizar inaladores adequadamente. A administração usual ocorre a cada 4 a 6 horas, mas, em exacerbações agudas, pode ser repetida a cada 20 minutos nas primeiras horas, sob monitoramento médico. O tempo de nebulização varia conforme a inalação completa do medicamento2.\nSAMA Pacientes clinicamente estáveis:\n40 mcg (2 jatos do aerossol dosimétrico) de brometo de ipratrópio, por via inalatória, 3 a 4 vezes/dia.\nA dose máxima não deve exceder 240 mcg/dia51.\nRecomenda-se orientar o paciente quanto ao uso correto do dispositivo inalatório e sobre a possibilidade de contato das partículas com os olhos. Sinais e sintomas oculares sugestivos de glaucoma (dor ou desconforto, visão embaçada, visão de halos ou imagens coloridas em associação com vermelhidão conjuntival) devem ser observados51. Para nebulização devem ser utilizados de 0,25 a 0,5 mg (20 a 40 gotas) a cada 4 a 6 horas até melhora clínica. A solução para nebulização deve ser diluída em solução salina fisiológica até um volume final de 3 a 4 mL2,26,51.\nAlívio de broncoespasmo agudo:\nNão é recomendado devido à demora no início da ação quando comparado a fenoterol e salbutamol.\nLABA Fumarato de formoterol:\n12 a 24 mcg, 2 vezes/dia.\nOs pacientes devem ser orientados a inalar uma cápsula por vez e a não usar mais de 2 vezes/dia, exceto quando houver recomendação médica, não ultrapassando a dose máxima diária recomendada de 48 mcg/dia de formoterol 52.\nLABA+LAMA (terapia dupla) Brometo de umeclidínio + trifenatato de vilanterol:",
   "pagina": 19,
   "completo": false
  }
 },
 {
  "id_pcdt": 51,
  "titulo": "Dor Crônica",
  "portaria": "Portaria Conjunta SAES/SAPS/SECTICS nº 1 - 22/08/2024",
  "data_portaria": "2024-08-23",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/dorcronica-1.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2024/portaria-conjunta-saes-saps-sectics-ms-no-1-de-22-de-agosto-de-2024/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-resumido-da-dor-cronica/@@display-file/file",
  "paginas": 298,
  "tem_texto": true,
  "cids": [
   "R52.1",
   "R52.2",
   "M16",
   "M16.0",
   "M16.1",
   "M16.4",
   "M16.5",
   "M16.6",
   "M16.7",
   "M16.9",
   "M17",
   "M17.0",
   "M17.1",
   "M17.2",
   "M17.3",
   "M17.4",
   "M17.5",
   "M17.9"
  ],
  "farmacos": [
   {
    "nome": "ácido acetilsalicílico",
    "chave": "acido acetilsalicilico",
    "no_rename": true,
    "id_monografia_ftn": 9
   },
   {
    "nome": "ácido valpróico ou valproato de sódio",
    "chave": "acido valproico ou valproato de sodio",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "carbamazepina",
    "chave": "carbamazepina",
    "no_rename": true,
    "id_monografia_ftn": 49
   },
   {
    "nome": "cloridrato de amitriptilina",
    "chave": "amitriptilina",
    "no_rename": true,
    "id_monografia_ftn": 81
   },
   {
    "nome": "cloridrato de clomipramina",
    "chave": "clomipramina",
    "no_rename": true,
    "id_monografia_ftn": 89
   },
   {
    "nome": "cloridrato de metadona",
    "chave": "metadona",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "cloridrato de nortriptilina",
    "chave": "nortriptilina",
    "no_rename": true,
    "id_monografia_ftn": 110
   },
   {
    "nome": "dipirona",
    "chave": "dipirona",
    "no_rename": true,
    "id_monografia_ftn": 139
   },
   {
    "nome": "fenitoína",
    "chave": "fenitoina",
    "no_rename": true,
    "id_monografia_ftn": 159
   },
   {
    "nome": "fosfato de codeína",
    "chave": "codeina",
    "no_rename": true,
    "id_monografia_ftn": 170
   },
   {
    "nome": "gabapentina",
    "chave": "gabapentina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "ibuprofeno",
    "chave": "ibuprofeno",
    "no_rename": true,
    "id_monografia_ftn": 193
   },
   {
    "nome": "naproxeno",
    "chave": "naproxeno",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "paracetamol",
    "chave": "paracetamol",
    "no_rename": true,
    "id_monografia_ftn": 256
   },
   {
    "nome": "omeprazol",
    "chave": "omeprazol",
    "no_rename": true,
    "id_monografia_ftn": 247
   },
   {
    "nome": "sulfato de morfina",
    "chave": "morfina",
    "no_rename": true,
    "id_monografia_ftn": 314
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Ácido acetilsalicílico: comprimidos de 500 mg;\n- Ácido valpróico: comprimidos de 250 ou 500 mg; cápsulas de 250 mg; xarope 50 mg/mL;\n- Carbamazepina: comprimidos de 200 ou 400 mg; suspensão oral 20 mg/mL;\n- Cloridrato de amitriptilina: comprimidos de 25 ou 75 mg;\n- Cloridrato de clomipramina: comprimidos de 10 ou 25 mg;\n- Cloridrato de metadona: comprimidos de 5 ou 10 mg; solução injetável de 10 mg/mL;\n- Cloridrato de nortriptilina: cápsulas de 10, 25, 50 ou 75 mg;\n- Dipirona: comprimidos de 500 mg; solução oral de 500 mg/mL;\n- Fenitoína: comprimidos de 100 mg; suspensão oral de 20 mg/mL;\n- Fosfato de codeína: comprimidos de 30 ou 60 mg; solução oral de 3 mg/mL; solução injetável de 30 mg/mL;\n- Gabapentina: cápsulas de 300 ou 400 mg;\n- Ibuprofeno: comprimidos de 200, 300 ou 600 mg; suspensão oral de 50 mg/mL;\n- Naproxeno: comprimidos de 250 e 500 mg;\n- Omeprazol: comprimidos de 10 e 20 mg;\n- Paracetamol: comprimidos de 500 mg; solução oral de 200 mg/mL;\n- Sulfato de morfina: comprimidos de 10 ou 30 mg; cápsulas de liberação prolongada de 30, 60 ou 100 mg; solução oral de 10 mg/mL; solução injetável de 10 mg/mL;",
   "pagina": 16,
   "completo": false
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 52,
  "titulo": "Endometriose (Anexo alterado em 09/09/2026)",
  "portaria": "Portaria Conjunta SAES/SAPS/SCTIE/MS nº 54 - 02/06/2026 (Publicada 22/07/2026)",
  "data_portaria": "2026-06-02",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/portaria-conjunta-n-54-endometriose.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2026/portaria-conjunta-saes-saps-sctie-no-54-de-2-de-junho-de-2026/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 52,
  "tem_texto": true,
  "cids": [
   "N80.0",
   "N80.1",
   "N80.2",
   "N80.3",
   "N80.4",
   "N80.5",
   "N80.8"
  ],
  "farmacos": [
   {
    "nome": "etinilestradiol + levonorgestrel",
    "chave": "etinilestradiol + levonorgestrel",
    "no_rename": true,
    "id_monografia_ftn": 152
   },
   {
    "nome": "acetado de medroxiprogesterona",
    "chave": "acetado de medroxiprogesterona",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "desogestrel",
    "chave": "desogestrel",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "dispositivo intrauterino liberador de levonorgestrel",
    "chave": "dispositivo intrauterino liberador de levonorgestrel",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "gosserrelina",
    "chave": "gosserrelina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "leuprorrelina",
    "chave": "leuprorrelina",
    "no_rename": true,
    "id_monografia_ftn": 3
   },
   {
    "nome": "triptorrelina",
    "chave": "triptorrelina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "danazol",
    "chave": "danazol",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "esquemas",
   "criterios_interrupcao",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "• acetato de medroxiprogesterona: comprimidos de 10 mg; suspensão injetável de 50 mg/mL e 150 mg/mL;\n• danazol: cápsulas de 100 e 200 mg;\n• desogestrel: comprimido de 0,075 mg;\n• etinilestradiol + levonorgestrel: comprimidos de 0,03 mg + 0,15 mg;\n• gosserrelina: implante subcutâneo de 3,6 mg ou 10,8 mg;\n• leuprorrelina: pó para suspensão injetável de 3,75 mg ou 11,25 mg;\n• levonorgestrel:  dispositivo intrauterino liberador contendo 52 mg de levonorgestrel;\n• triptorrelina: pó para solução injetável de liberação prolongada de 3,75 mg ou 11,25 mg.\nNota: O uso de analgésicos deverá seguir as orientações do Protocolo Clínico e Diretrizes Terapêuticas da Dor Crônica vigente, do Ministério da Saúde.\nSe necessária, a reposição de ferro deverá seguir as orientações do Protocolo Clínico e Diretrizes Terapêuticas da Anemia por Deficiência de Ferro vigente, do Ministério da Saúde.\n10",
   "pagina": 9,
   "completo": true
  },
  "esquemas": {
   "texto": "Os esquemas de administração para tratamento da endometriose então descritos no Quadro 1.\nQuadro 1. Esquemas de administração dos tratamentos de crianças, adolescentes e adultos.\nMedicamentos Esquemas Tratamento de primeira linha Etinilestradiol 0,03 mg + levonorgestrel 0,15 mg Um comprimido por via oral uma vez ao dia no mesmo horário por 21 dias. Nos casos em que a paciente não tenha utilizado contraceptivo hormonal no mês anterior, a administração deve ser iniciada no 1º dia do ciclo (1º dia de sangramento menstrual).\nPara os casos em que a paciente já esteja em uso do medicamento, deve haver um intervalo de 7 dias sem a ingestão dos comprimidos, antes de iniciar a próxima cartela, ou seja, no 8º dia após o término da cartela anterior.\nAcetato de medroxiprogesterona, (comprimido) Um comprimido (10 mg) por via oral três vezes ao dia. O uso é contínuo sem intervalos.\nAcetato de medroxiprogesterona, (suspensão injetável) Por via intramuscular, utilizar 150 mg, iniciando a primeira injeção até o 5º dia do ciclo menstrual e as injeções subsequentes com intervalo de 12 a 13 semanas (intervalo máximo entre as aplicações é de 91 dias). O uso é contínuo sem intervalos.\nDesogestrel Um comprimido por via oral uma vez ao dia, preferencialmente no mesmo horário, na ordem indicada pelas setas impressas na cartela. Deve-se tomar um comprimido ao dia durante 28 dias consecutivos. Cada cartela subsequente deve ser iniciada imediatamente após o término da anterior, sem intervalos.\nDIU-LNG Inserir uma unidade do dispositivo contendo 52 mg de levonorgestrel na cavidade uterina. Cada inserção possui eficácia por três ou  cinco anos, conforme dispositivo.\nTratamento de segunda linha Gosserrelina 3,6 mg por via subcutânea, mensalmente; ou 10,8 mg por via subcutânea a cada 3 meses.\nLeuprorrelina 3,75 mg por via intramuscular, mensalmente; ou 11,25 mg intramuscular a cada 3 meses.\nTriptorrelina 3,75 mg por via intramuscular, mensalmente ou 11,25 mg intramuscular a cada 3 meses.\nDanazol 400 mg, por via oral, divididos em duas administrações diárias, podendo-se aumentar para 800 mg, por via oral, divididos em duas administrações diárias.\nLegenda: DIU-LNG, dispositivo intrauterino liberador de levonorgestrel.\nFonte: Elaboração própria.",
   "pagina": 10,
   "completo": true
  }
 },
 {
  "id_pcdt": 53,
  "titulo": "Epilepsia (Anexo alterado em 23/07/2025)",
  "portaria": "Portaria Conjunta SAS/SCTIE/MS nº 17 - 21/06/2018",
  "data_portaria": "2018-06-27",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt_epilepsia-1.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2018/portaria_17_pcdt_de_epilepsia.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/PCDT_Resumido_Epilepsia_final.pdf/@@display-file/file",
  "paginas": 59,
  "tem_texto": true,
  "cids": [
   "G40.0",
   "G40.1",
   "G40.2",
   "G40.3",
   "G40.4",
   "G40.5",
   "G40.6",
   "G40.7",
   "G40.8"
  ],
  "farmacos": [
   {
    "nome": "ácido valproico/valproato de sódio",
    "chave": "acido valproico/valproato de sodio",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "carbamazepina",
    "chave": "carbamazepina",
    "no_rename": true,
    "id_monografia_ftn": 49
   },
   {
    "nome": "clobazam",
    "chave": "clobazam",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "clonazepam",
    "chave": "clonazepam",
    "no_rename": true,
    "id_monografia_ftn": 73
   },
   {
    "nome": "etossuximida",
    "chave": "etossuximida",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "fenitoína",
    "chave": "fenitoina",
    "no_rename": true,
    "id_monografia_ftn": 159
   },
   {
    "nome": "fenobarbital",
    "chave": "fenobarbital",
    "no_rename": true,
    "id_monografia_ftn": 160
   },
   {
    "nome": "gabapentina",
    "chave": "gabapentina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "lamotrigina",
    "chave": "lamotrigina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "levetiracetam",
    "chave": "levetiracetam",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "primidona",
    "chave": "primidona",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "topiramato",
    "chave": "topiramato",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "vigabatrina",
    "chave": "vigabatrina",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "esquemas",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "Ácido valproico (valproato de sódio): comprimidos ou cápsulas de 250 mg, comprimidos de 500 mg e solução e xarope de 50 mg/mL.\nDose inicial: 250 mg/dia.\nEscalonamento: 250 mg/dia a cada 3 dias.\nDose máxima: 3.000 mg/dia.\nIntervalo de dose: 2 administrações/dia.\nIntolerância gástrica significativa (menor com o uso de valproato de sódio). Tomar após alimentação Carbamazepina: comprimidos de 200 e 400 mg, suspensão oral de 20 mg/mL.\nDose inicial:\n- Adultos: 200 mg/dia.\n- Crianças de 6 a 12 anos: 100 mg/dia.\n24 - Crianças abaixo de 6 anos: 5-10 mg/kg/dia.\n- Escalonamento:\n- Adultos: 200 mg/dia/semana.\n- Crianças de 6 a 12 anos: 100 mg/dia/semana.\n- Crianças com menos de 6 anos: 5-10 mg/kg/dia/semana.\n- Dose máxima:\n- Adultos: 1.800 mg/dia.\n- Crianças de 6 a 12 anos: 600-1.000 mg/dia.\n- Crianças com menos de 6 anos: 35 mg/kg/dia.\nIntervalo de dose: se não for a formulação de liberação lenta, tem de ser utilizada 3 a 4 vezes ao dia, após alimentação.\nClobazam: comprimidos de 10 e 20 mg Dose inicial: 5-10 mg/dia.\nEscalonamento: 5 mg/dia/semana.\nDose máxima: 40 mg/dia.\nIntervalo de dose: 1 a 2x/dia Clonazepam: solução oral (2,5 mg/mL).\nDose inicial: 0,25 mg/dia (crianças de 2 a 12 anos: 0,01 mg/kg/dia).\nEscalonamento: 0,25 mg/dia/semana (crianças: 0,1-0,2 mg/kg/dia/semana).\nDose máxima: 10 mg/dia.\nIntervalo de dose: 1-2 administrações/dia.\nEtossuximida: xarope de 50 mg/mL.\nDose inicial: 250 mg/dia.\nEscalonamento: 250 mg/dia/semana.\nDose máxima: 1.500 mg/dia.\nIntervalo de dose: 2-3 administrações/dia.\nFenitoína: comprimidos de 100 mg, suspensão oral 20 mg/mL.\nDose inicial: 100 mg/dia.\nEscalonamento: 100 mg/dia/semana.\nDose máxima: 500 mg/dia.\nIntervalo de dose: 1-2 administrações/dia.\nFenobarbital: comprimidos de 100 mg e solução oral 40 mg/mL.\nDose inicial: 50 mg/dia.\nEscalonamento: 50 mg/dia/semana.\nDose máxima: 300 mg/dia.\nIntervalo de dose: dose única diária.\nGabapentina: cápsulas de 300 e 400 mg.\nDose inicial: 15 mg/kg/dia ou máximo de 300 mg/dia.\nEscalonamento: 300 mg/dia (15 mg/kg/dia).\nDose máxima: 3.600 mg/dia (50-100 mg/kg/dia).\nIntervalo de dose: 3 administrações/dia.\nLamotrigina: comprimidos 25, 50 e 100 mg.\n- Monoterapia:\n25 Dose inicial: 25 mg/dia por 2 semanas; 50 mg/dia por mais 2 semanas.\nEscalonamento: 50-100 mg a cada 1-2 semanas.\nDose máxima: 500 mg/dia (1-5 mg/kg/dia).\nIntervalo de dose: 2 a 3 tomadas reduzem efeitos adversos de pico de dose.\n- Terapia adjuvante com ácido valproico:",
   "pagina": 23,
   "completo": false
  }
 },
 {
  "id_pcdt": 54,
  "titulo": "Esclerose Lateral Amiotrófica",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 13 - 13/08/2020",
  "data_portaria": "2020-08-19",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/portaria_conjunta_pcdt_ela.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2020/portariaconjunta_sctie_saes_13_2020.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/PCDTResumidoELA.pdf/@@display-file/file",
  "paginas": 37,
  "tem_texto": true,
  "cids": [
   "G12.2"
  ],
  "farmacos": [
   {
    "nome": "riluzol",
    "chave": "riluzol",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "medicamentos",
   "esquemas",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "Riluzol: comprimidos de 50 mg.",
   "pagina": 15,
   "completo": true
  },
  "esquemas": {
   "texto": "01 comprimido de 50 mg, por via oral, a cada 12 horas, 1 hora antes ou 2 horas após as refeições.",
   "pagina": 15,
   "completo": true
  }
 },
 {
  "id_pcdt": 55,
  "titulo": "Esclerose Múltipla",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 8 - 12/09/2024",
  "data_portaria": "2024-09-26",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-de-esclerose-multipla/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2024/portaria-conjunta-saes-sectics-no-8-de-12-de-setembro-de-2024/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/PCDT_Resumido_Esclerose_Multipla_2024_f.pdf/@@display-file/file",
  "paginas": 117,
  "tem_texto": true,
  "cids": [
   "G35"
  ],
  "farmacos": [
   {
    "nome": "alentuzumabe",
    "chave": "alentuzumabe",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "azatioprina",
    "chave": "azatioprina",
    "no_rename": true,
    "id_monografia_ftn": 33
   },
   {
    "nome": "betainterferonas",
    "chave": "betainterferonas",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "cladribina oral",
    "chave": "cladribina oral",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "fingolimode",
    "chave": "fingolimode",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "fumarato de dimetila",
    "chave": "dimetila",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "glatirâmer",
    "chave": "glatiramer",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "natalizumabe",
    "chave": "natalizumabe",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "teriflunomida",
    "chave": "teriflunomida",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "medicamentos",
   "esquemas",
   "criterios_interrupcao",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Acetato de glatirâmer: solução injetável de 20 mg e 40 mg;\n- Alentuzumabe: solução injetável de 10 mg/mL em frasco-ampola contendo 1,2 mL;\n- Azatioprina: comprimido de 50 mg;- Betainterferona 1A: solução injetável de 22 mcg (6.000.000 UI), 30 mcg (6.000.000 UI) e de 44 mcg (12.000.000 UI);\n- Betainterferona 1B: solução injetável de 300 mcg (9.600.000 UI);\n- Cladribina oral: comprimidos de 10 mg;\n- Fingolimode: cápsula de 0,5 mg;\n- Fumarato de dimetila: cápsula de 120 mg e 240 mg;\n- Metilprednisolona: pó para solução injetável de 500 mg;\n- Natalizumabe: solução injetável de 20 mg/mL; e\n- Teriflunomida: comprimido de 14 mg.",
   "pagina": 15,
   "completo": true
  },
  "esquemas": {
   "texto": "O Quadro 2 apresenta os medicamentos disponíveis para o tratamento da esclerose múltipla remitente-recorrente (EMRR).\nQuadro 2 - Doses e principais eventos adversos dos medicamentos para EMRR FÁRMACO VIA DE ADMINISTRAÇÃO DOSE INICIAL PRINCIPAIS EVENTOS ADVERSOS TRATAMENTO DOS SURTOS Metilprednisolona110 Via intravenosa 1g, 1x ao dia, por 3 ou 5 dias Disfunção/distúrbio miccional gastrintestinal funcional, cefaleia, meningite, paraparesia/ paraplegia, convulsões, distúrbios sensitivos TRATAMENTO DA EMRR DE BAIXA OU MODERADA ATIVIDADE PRIMEIRA LINHA Betainterferona 1a111 Via intramuscular 30 µg (6 MUI), 1x semana Mialgia, febre, calafrios, sudorese, astenia, cefaleia e náusea Betainterferona 1a112,38 Via subcutânea 22 µg (6 MUI), 3x semana 16 FÁRMACO VIA DE ADMINISTRAÇÃO DOSE INICIAL PRINCIPAIS EVENTOS ADVERSOS 44 µg (12 MUI), 3x semana Betainterferona 1b113 Via subcutânea 0,25 mg (8 milhões de MUI), em dias alternados Acetato de glatirâmer35 Via subcutânea 20 mg, 1x ao dia OU 40 mg, 3x por semana Infecção, gripe, dispneia, náusea, artralgia, dorsalgia, astenia, dor torácica e algia Teriflunomida45 Via oral 14 mg, 1x ao dia Cefaleia, diarreia, náusea, alopecia e aumento das transaminases hepáticas Fumarato de dimetila51 Via oral 120 mg, 2x ao dia por 7 dias; e 240 mg, 2x ao dia Rubor e eventos gastrointestinais (diarreia, náusea, dor abdominal, dor abdominal superior) Azatioprina114 Via oral 1-3 mg/kg de peso corporal ao dia Infecções virais, fúngicas e bacterianas; leucopenia, anemia, colestase, hipersensibilidade, disfunção hepática SEGUNDA LINHA Fingolimode55 Via oral 0,5 mg, 1x ao dia Tosse, diarreia, dor nas costas, cefaleia, infecções virais por influenza, sinusite, elevação nas enzimas hepáticas (aumento da ALT, GGT, AST).",
   "pagina": 15,
   "completo": false
  }
 },
 {
  "id_pcdt": 56,
  "titulo": "Esclerose Sistêmica",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 16 - 10/08/2022",
  "data_portaria": "2022-09-26",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/20220926_pcdt_esclerose_sistemica.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2022/20220926_portaria_conjunta_n16.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/PCDT_Resumido_Esclerose_Sistemica_final.pdf/@@display-file/file",
  "paginas": 148,
  "tem_texto": true,
  "cids": [
   "M34.0",
   "M34.1",
   "M34.8"
  ],
  "farmacos": [
   {
    "nome": "ciclofosfamida",
    "chave": "ciclofosfamida",
    "no_rename": true,
    "id_monografia_ftn": 62
   },
   {
    "nome": "metotrexato",
    "chave": "metotrexato",
    "no_rename": true,
    "id_monografia_ftn": 229
   },
   {
    "nome": "azatioprina",
    "chave": "azatioprina",
    "no_rename": true,
    "id_monografia_ftn": 33
   },
   {
    "nome": "sildenafila",
    "chave": "sildenafila",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "captopril",
    "chave": "captopril",
    "no_rename": true,
    "id_monografia_ftn": 48
   },
   {
    "nome": "nifedipino",
    "chave": "nifedipino",
    "no_rename": true,
    "id_monografia_ftn": 237
   },
   {
    "nome": "metoclopramida",
    "chave": "metoclopramida",
    "no_rename": true,
    "id_monografia_ftn": 108
   },
   {
    "nome": "omeprazol",
    "chave": "omeprazol",
    "no_rename": true,
    "id_monografia_ftn": 247
   },
   {
    "nome": "besilato de anlodipino",
    "chave": "anlodipino",
    "no_rename": true,
    "id_monografia_ftn": 40
   },
   {
    "nome": "prednisona",
    "chave": "prednisona",
    "no_rename": true,
    "id_monografia_ftn": 267
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "esquemas",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Azatioprina: comprimidos de 50 mg;\n- besilato de anlodipino: comprimidos de 5 e 10 mg;\n- captopril: comprimidos de 25 mg;\n- ciclofosfamida: comprimidos de 50 mg; frasco-ampola de 1.000 mg e 200 mg;\n- metotrexato: comprimidos de 2,5 mg; solução injetável de 50 mg/2 mL;\n- metoclopramida: comprimidos de 10 mg;\n- nifedipino: comprimidos de 10 mg;\n- omeprazol: cápsulas de 10 e 20 mg;\n- prednisona: comprimidos de 5 e 20 mg;\n- sildenafila: comprimidos de 25 e 50 mg.",
   "pagina": 7,
   "completo": true
  },
  "esquemas": {
   "texto": "- Azatioprina: dose inicial de 1 mg/kg/dia, por via oral, aumentando 0,5 mg/kg a cada 4 semanas até atingir o controle da atividade da doença. A dose máxima não deve ultrapassar 3 mg/kg/dia. As contraindicações são imunossupressão (AIDS, linfoma e outros), infecção ativa, tuberculose, neoplasia maligna em atividade.\n- Besilato de anlodipino: dose de 5 a 10 mg, 1 vez ao dia. As contraindicações infarto agudo do miocárdio, insuficiência cardíaca congestiva, angina instável ou pós-infarto, estenose da válvula aórtica grave, hipotensos, gestantes (antes da 20ª semana) ou mulheres que estejam amamentando.\n- Captopril: para pacientes hipertensos com CRE, sem evidência de envolvimento do sistema nervoso central, dose de 6,25 a 12,5 mg por via oral, com aumento de 12,5 a 25 mg em intervalos de 4 a 8 horas até que a pressão arterial esteja normalizada. A dose máxima é de 300 a 450 mg/dia. Nos pacientes em CRE normotensos, a dose inicial é de 6,25 mg e, conforme a tolerância, deve-se aumentar para 12,5 mg na segunda dose (aumentos adicionais devem ser feitos com cautela para evitar a indução de hipotensão).\n- Ciclofosfamida: 1 a 2 mg/kg/dia, por via oral, ou 300 a 800 mg/m2 por via intravenosa a cada 4 semanas. As contraindicações ao uso são pacientes com tuberculose sem tratamento, infecção bacteriana com indicação de uso de antibiótico;\ninfecção fúngica ameaçadora à vida; infecção por herpes zoster ativa; hepatites B ou C agudas; insuficiência cardíaca grave não controlada, concepção, gestação ou lactação, cistite hemorrágica, imunossupressão, neoplasia maligna em atividade. Em caso de pacientes com creatinina sérica acima de 2 mg/dL ou clearance de creatinina menor que 30, deve-se considerar o ajuste de dose de ciclofosfamida. Neste caso e em pacientes com leucopenia (igual ou menor a 3.000 células/mm3), deve-se considerar a não utilização do medicamento.\n- Metoclopramida: 10 mg, 3 vezes ao dia, 10 minutos antes das refeições. As contraindicações são situações em que a estimulação da motilidade gastrintestinal seja perigosa, como por exemplo, na presença de hemorragia gastrintestinal, obstrução mecânica ou perfuração gastrintestinal; em pacientes com epilepsia ou que estejam recebendo outros medicamentos que possam causar reações extrapiramidais, uma vez que a frequência e intensidade destas reações podem ser aumentadas; em pacientes com feocromocitoma, pois pode desencadear crise hipertensiva, devido à provável liberação de catecolaminas do tumor.",
   "pagina": 7,
   "completo": false
  }
 },
 {
  "id_pcdt": 57,
  "titulo": "Espasticidade",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 5 - 22/03/2022",
  "data_portaria": "2022-03-23",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/20220323_portal-portaria-conjunta-no-5-pcdt_espasticidade.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2022/20220323_portaria_conjunta_5.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/20230106_PCDT_Resumido_Espasticidade_final.pdf/@@display-file/file",
  "paginas": 175,
  "tem_texto": true,
  "cids": [
   "G04.1",
   "G80.0",
   "G80.1",
   "G80.2",
   "G81.1",
   "G82.1",
   "G82.4",
   "I69.0",
   "I69.1",
   "I69.2",
   "I69.3",
   "I69.4",
   "I69.8",
   "T90.5",
   "T90.8"
  ],
  "farmacos": [
   {
    "nome": "toxina botulínica tipo a",
    "chave": "toxina botulinica tipo a",
    "no_rename": false,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "esquemas",
   "criterios_interrupcao",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "Toxina botulínica tipo A: frasco-ampola com 100 U e frasco-ampola com 500 U.",
   "pagina": 11,
   "completo": true
  },
  "esquemas": {
   "texto": "A toxina botulínica é um produto biológico, cujas apresentações disponíveis no mercado são sintetizadas como complexos proteicos macromoleculares distintos, o que pode afetar sua farmacocinética. Consequentemente, os produtos mostram diferenças em seus perfis in vivo, incluindo curvas de resposta à dose pré-clínica e dosagem clínica, eficácia, duração e segurança/eventos adversos.\nDessa forma, recomenda-se que eles devam ser usados de acordo com as orientações do fabricante75–77.\nA TBA é injetada pela via intramuscular, conforme o plano terapêutico. A aplicação deve ser realizada por médico devidamente capacitado, especialista em medicina física e reabilitação (fisiatria), neurologia, neuropediatria, neurocirurgia ou ortopedia. A dose total por sessão de tratamento deve seguir as recomendações das bulas de cada fabricante, dividida entre os músculos selecionados. A determinação das doses baseia-se na intensidade da espasticidade, comprometimento funcional, peso corporal e tamanho e número de músculos a serem tratados, devendo ser também consideradas as orientações do fabricante de cada produto. Cada aplicação deve sempre utilizar a menor dose eficaz estimada. Nos casos que os objetivos não forem alcançados, novas aplicações podem ser consideradas, respeitando o intervalo mínimo de 3 a 4 meses entre cada dose. Tais medidas são indispensáveis para minimizar o risco de falha terapêutica em decorrência da formação de anticorpos78.\nA duração do efeito é variável. Recomenda-se a reavaliação em 4 a 6 semanas após cada aplicação, sendo as demais reavaliações realizadas a critério médico. Após a aplicação local, a TBA difunde-se pelo tecido muscular e por outros tecidos.\nSeu efeito concentra-se próximo ao ponto de aplicação e diminui ao se afastar dele. Pode ocorrer difusão para músculos vizinhos, especialmente quando são utilizadas doses ou volumes elevados. O efeito distante da TBA é preocupante, pois pode resultar em efeitos adversos sistêmicos. Os efeitos adversos sistêmicos são devidos ao efeito da TBA nos tecidos distantes da administração local.78,79 Em relação às técnicas de aplicação, são feitas as seguintes recomendações80–82:\n- Utilizar sempre solução salina sem conservantes (soro fisiológico a 0,9%) para a reconstituição;\n- evitar o borbulhamento ou a agitação do conteúdo do frasco durante a reconstituição e recuperação do medicamento para a seringa de injeção;",
   "pagina": 11,
   "completo": false
  }
 },
 {
  "id_pcdt": 58,
  "titulo": "Espondilite Ancilosante",
  "portaria": "Portaria Conjunta SAS/SCTIE/MS nº 25 - 22/10/2018",
  "data_portaria": "2018-10-26",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/20210428_pcdt-espondilite-ancilosante-1.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2018/portaria-conjunta-no-25-de-22-de-outubro-de-2018.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 24,
  "tem_texto": true,
  "cids": [
   "M45",
   "M46.8"
  ],
  "farmacos": [
   {
    "nome": "ibuprofeno",
    "chave": "ibuprofeno",
    "no_rename": true,
    "id_monografia_ftn": 193
   },
   {
    "nome": "naproxeno",
    "chave": "naproxeno",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "sulfassalazina",
    "chave": "sulfassalazina",
    "no_rename": true,
    "id_monografia_ftn": 303
   },
   {
    "nome": "metotrexato",
    "chave": "metotrexato",
    "no_rename": true,
    "id_monografia_ftn": 229
   },
   {
    "nome": "adalimumabe",
    "chave": "adalimumabe",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "etanercepte",
    "chave": "etanercepte",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "golimumabe",
    "chave": "golimumabe",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "infliximabe",
    "chave": "infliximabe",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "certolizumabe pegol",
    "chave": "certolizumabe pegol",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "secuquinumabe",
    "chave": "secuquinumabe",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "medicamentos",
   "esquemas",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Ibuprofeno: comprimidos revestidos de 200 mg, 300 mg e 600 mg, solução oral de 50 mg/mL.\n- Naproxeno: comprimidos de 250 mg e 500 mg.\n- Sulfassalazina: comprimidos de 500 mg.\n- Metilprednisolona: frasco de 40 mg/2 mL.\n- Metotrexato: comprimidos de 2,5 mg; frasco-ampola com 50 mg/2 mL.\n- Adalimumabe: solução injetável de 40 mg.\n- Etanercepte: frasco-ampola ou seringa preenchida de 25 mg e 50 mg.\n- Infliximabe: frasco-ampola com 100 mg/10 mL.\n- Golimumabe: seringa preenchida com 50 mg. Aprovado apenas para pacientes adultos.\n- Certolizumabe pegol: solução injetável com 200mg/mL com caneta aplicadora. Aprovado apenas para pacientes adultos.\n- Secuquinumabe: solução injetável com 150mg/ml com caneta aplicadora. Aprovado apenas para pacientes adultos.",
   "pagina": 8,
   "completo": true
  },
  "esquemas": {
   "texto": "- Ibuprofeno: 600 mg/dia a 2.700 mg/dia, por via oral, divididos em 3 administrações (8/8 horas).\n- Naproxeno: 500 mg/dia a 1.500 mg/dia, por via oral, divididos em até 3 administrações (8/8 horas).\n- Sulfassalazina: 500 mg/dia a 3.000 mg/dia, por via oral, divididos em 2 administrações (12/12 horas).\n- Metiprednisolona: 40 mg a 80 mg, intra ou periarticular, a cada 3 meses.\n- Metotrexato: 7,5 mg a 25 mg, por via oral, subcutânea ou intramuscular, a cada semana.\n- Adalimumabe: 40 mg, por via subcutânea, a cada 2 semanas.\n- Etanercepte: 50 mg, por via subcutânea, a cada semana.\n- Infliximabe: 5 mg/kg, por via intravenosa, nas semanas 0, 2, 6 e, depois, a cada 8 semanas.\n- Golimumabe: 50mg, por via subcutânea, a cada 4 semanas. Aprovado apenas para pacientes adultos.\n- Certolizumabe pegol: dose de indução de 400 mg (duas aplicações de 200 mg nas semanas 0, 2 e 4). Após, 200 mg a cada duas semanas ou 400 mg a cada quatro semanas. Aprovado apenas para pacientes adultos.\n- Secuquinumabe: A dose de indução recomendada é 150 mg por injeção subcutânea com administração inicial nas semanas 0, 1, 2, 3 e 4, seguida por administração de manutenção uma vez a cada 4 semanas.\nAprovado apenas para pacientes adultos.",
   "pagina": 8,
   "completo": true
  }
 },
 {
  "id_pcdt": 59,
  "titulo": "Esquizofrenia",
  "portaria": "Portaria SAS/MS nº 364 - 09/04/2013",
  "data_portaria": "2014-05-07",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-esquizofrenia-livro-2013-1.pdf/@@display-file/file",
  "url_portaria": "https://bvsms.saude.gov.br/bvs/saudelegis/sas/2013/prt0364_09_04_2013.html",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 27,
  "tem_texto": true,
  "cids": [
   "F20.0",
   "F20.1",
   "F20.2",
   "F20.3",
   "F20.4",
   "F20.5",
   "F20.6",
   "F20.8"
  ],
  "farmacos": [
   {
    "nome": "risperidona",
    "chave": "risperidona",
    "no_rename": true,
    "id_monografia_ftn": 273
   },
   {
    "nome": "quetiapina",
    "chave": "quetiapina",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "ziprasidona",
    "chave": "ziprasidona",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "olanzapina",
    "chave": "olanzapina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "clozapina",
    "chave": "clozapina",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "medicamentos",
   "esquemas",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Risperidona: comprimidos de 1, 2 e 3 mg.\n- Quetiapina: comprimidos de 25, 100, 200 e 300 mg.\n- Ziprasidona: cápsulas de 40 e 80 mg.\n- Olanzapina: comprimidos de 5 e 10 mg.\n- Clozapina: comprimidos de 25 e 100 mg.\n- Clorpromazina: comprimidos de 25 e 100 mg; solução oral de 40 mg/ml.\n- Haloperidol: comprimido de 1 e 5 mg solução oral 2 mg/ml.\n- Decanoato de haloperidol: solução injetável 50 mg/ml.",
   "pagina": 5,
   "completo": true
  },
  "esquemas": {
   "texto": "Risperidona Deve-se iniciar com 1 mg, 2 vezes ao dia, para evitar efeito de primeira dose (bloqueio alfa-adrenérgico). A dose pode ser aumentada em 1 mg, 2 vezes ao dia, até que uma dose-alvo de 6 mg/dia (3 mg, 2 vezes ao dia) seja alcançada no terceiro dia. As doses recomendadas de manutenção são de 3-6 mg/dia (154-156). Se descontinuada, a administração deve ser reiniciada conforme a primeira dose. Em pacientes com insuficiências renal ou hepática, a dose máxima recomendada é de 3 mg/dia. A administração simultânea com alimentos não interfere na biodisponibilidade do medicamento.\nQuetiapina Deve-se iniciar com 25 mg, 2 vezes ao dia, por via oral, com aumentos de  25-50 mg por dose por dia, com o objetivo de alcançar 300-600 mg/dia (157). A dose total poderá ser dividida em 2 ou 3 vezes ao dia, devendo ser alcançada entre o quarto e o sétimo dias de tratamento. O ajuste pode ser feito com incrementos (ou diminuição) de 25-50 mg, 2 vezes ao dia, ou num intervalo de 2 dias. A dose máxima situa-se entre 750-800 mg/dia.\nZiprasidona Deve-se iniciar com 40 mg, 2 vezes ao dia, por via oral, sendo administrados com os alimentos. Aumentos de dose deverão ocorrer em intervalos superiores a 2 dias até a dose máxima de 160 mg/dia (80 mg, 2 vezes ao dia). A dose de manutenção ideal é de 40 mg, administrados 2 vezes ao dia.\nOlanzapina Deve-se iniciar com 5 mg à noite. Pode-se aumentar a dose em 5 mg após pelo menos 7 dias até uma dose de 20 mg/dia. Não há evidências de que doses acima de 20 mg/dia em pacientes não refratários sejam mais eficazes (123). Não é necessário ajuste de dose em casos de insuficiências renal ou hepática. Pacientes debilitados fisicamente e emagrecidos deverão receber no máximo 5 mg/dia. Na ocorrência de efeitos adversos graves de clozapina (agranulocitose, cardiopatia e oclusão intestinal), em pacientes refratários, olanzapina poderá ser utilizada até a dose de 30 mg/dia (158-160).\nClozapina Deve-se iniciar com 12,5 mg à noite. Pode-se aumentar a dose em 25 mg a cada 1 a 2 dias até 300-400 mg/dia.\nApós 30 dias sem melhora, pode-se  aumentar 50 mg a cada 3-4 dias até 800 mg/dia. Doses acima de 400 mg poderão ser fracionadas para aumentar a tolerância do paciente.",
   "pagina": 5,
   "completo": false
  }
 },
 {
  "id_pcdt": 60,
  "titulo": "Estratégias para Atenuar a Progressão da Doença Renal Crônica(Anexo alterado em 07/02/2025)",
  "portaria": "Portaria Conjunta SAES/SECTICS/MS nº 11 - 16/09/2024",
  "data_portaria": "2024-09-26",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-de-estrategias-para-atenuar-a-progressao-da-doenca-renal-cronica/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2024/portaria-conjunta-saes-sectics-no-11-de-16-de-setembro-de-2024/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/pcdt-resumido-das-estrategias-para-atenuar-a-progressao-da-doenca-renal-cronica/@@display-file/file",
  "paginas": 68,
  "tem_texto": true,
  "cids": [
   "N18.2",
   "N18.3",
   "N18.4",
   "N18.5"
  ],
  "farmacos": [
   {
    "nome": "captopril",
    "chave": "captopril",
    "no_rename": true,
    "id_monografia_ftn": 48
   },
   {
    "nome": "enalapril",
    "chave": "enalapril",
    "no_rename": true,
    "id_monografia_ftn": 218
   },
   {
    "nome": "losartana",
    "chave": "losartana",
    "no_rename": true,
    "id_monografia_ftn": 216
   },
   {
    "nome": "espironolactona",
    "chave": "espironolactona",
    "no_rename": true,
    "id_monografia_ftn": 147
   },
   {
    "nome": "dapagliflozina",
    "chave": "dapagliflozina",
    "no_rename": false,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "esquemas",
   "criterios_interrupcao",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Captopril: comprimidos de 25 mg;\n- Dapagliflozina: comprimidos de 10 mg;\n- Espironolactona: comprimidos de 25 mg;\n- Losartana potássica: comprimidos de 50 mg;\n- Maleato de enalapril: comprimidos de 5, 10 e 20 mg.",
   "pagina": 10,
   "completo": true
  },
  "esquemas": {
   "texto": "• Captopril: a dose recomendada é de 25 mg a cada 8 horas. Caso o paciente apresente nefropatia diabética e insuficiência renal leve a moderada, doses de 75 a 100 mg/dia são bem toleradas, devendo ser divididas três vezes ao dia. Pacientes com insuficiência renal significativa devem ter sua dose diária inicial reduzida, utilizado incrementos menores para a titulação lenta (intervalos de uma a duas semanas). Não há necessidade de ajuste de dose em pacientes idosos. O medicamento deve ser administrado uma hora antes das refeições.\n• Maleato de enalapril: podem ser administrados antes, durante ou após as refeições, conforme esquema a seguir:\nQuadro 4 - Esquemas de administração do enalapril conforme disfunção renal.\nDisfunção renal Depuração plasmática de creatinina (mL/min) Dose inicial (mg/dia) Leve Menor que 80 e maior que 30 mL/min 5 mg – 10 mg Moderada Menor ou igual a 30 e maior que 10 mL/min 2,5 mg – 5 mg Grave * Menor ou igual a 10 mL/min 2,5 mg nos dias de diálise** * Normalmente esses pacientes estão sob diálise.\n**O maleato de enalapril é dialisável. Nos dias em que o paciente não for submetido à diálise, a posologia deverá ser ajustada à resposta da pressão arterial.\nFonte: Elaboração própria.\n• Losartana potássica: a dose recomendada é de 50 mg uma vez ao dia, podendo ser aumentada para 100 mg uma vez ao dia conforme a pressão arterial. Não há necessidade de ajuste posológico inicial para pacientes idosos ou para pacientes com insuficiência renal, inclusive para pacientes em diálise. Pode ser administrada com ou sem alimentos. A losartana e o seu metabólito ativo não podem ser removidos da circulação por hemodiálise.\n• Espironolactona: a dose recomendada é de 25 a 50 mg ao dia, em uma tomada diária. Não há necessidade de ajuste posológico inicial para pacientes idosos ou para pacientes com DRC. Pode ser administrada com ou sem alimentos. A espironolactona potencializa o efeito de outros diuréticos e anti-hipertensivos quando administrados concomitantemente. Há casos relatados de hiperpotassemia (aumento dos níveis sanguíneos de potássio) grave em pacientes que fazem uso de diuréticos poupadores de potássio, incluindo espironolactona e inibidores da ECA (como captopril e enalapril). Desta forma, a dose desses fármacos deverá ser reduzida quando a espironolactona for incluída ao tratamento.\n• Dapagliflozina: a dose recomendada é 10 mg uma vez ao dia, a qualquer hora do dia, independentemente das refeições.",
   "pagina": 10,
   "completo": false
  }
 },
 {
  "id_pcdt": 61,
  "titulo": "Fenilcetonúria",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 12 - 10/09/2019",
  "data_portaria": "2019-09-16",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/portaria-conjunta-pcdt-fenilcetonuria_saes.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2019/portariasctie_11_12_13_2019.pdf/@@display-file/file",
  "url_publicacao_ms": "https://www.gov.br/conitec/pt-br/midias/protocolos/publicacoes_ms/pcdt_fenilcetonuria_isbn_17-08-2020.pdf/@@display-file/file",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/pcdt_resumido_fenilcetonuria.pdf/@@display-file/file",
  "paginas": 40,
  "tem_texto": true,
  "cids": [],
  "farmacos": [
   {
    "nome": "dicloridrato de sapropterina",
    "chave": "sapropterina",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 62,
  "titulo": "Fibrose Cística (Portaria atualizada em 09/05/2024)",
  "portaria": "Portaria Conjunta SAES/SECTICS/MS nº 5 - 30/04/2024",
  "data_portaria": "2024-05-02",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/20211230_portal-portaria-conjunta-no-25_pcdt_fibrose-cistica.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2024/portaria-conjunta-saes-sectics-no-5-de-30-de-abril-de-2024/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/pcdt-resumido-fibrose-cistica.pdf/@@display-file/file",
  "paginas": 47,
  "tem_texto": true,
  "cids": [
   "E84.0",
   "E84.1",
   "E84.8"
  ],
  "farmacos": [
   {
    "nome": "alfadornase",
    "chave": "alfadornase",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "colistimetato",
    "chave": "colistimetato",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "ivacaftor",
    "chave": "ivacaftor",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "elexacaftor/tezacaftor/ivacaftor",
    "chave": "elexacaftor/tezacaftor/ivacaftor",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "pancreatina",
    "chave": "pancreatina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "tobramicina",
    "chave": "tobramicina",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "medicamentos",
   "esquemas",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Alfadornase: solução para inalação de 1 mg/mL.\n- Colistimetato de sódio: pó para solução injetável ou inalatória contendo 80 mg (1 milhão de UI) e 160 mg (2 milhões de UI).\n- Elexacaftor/tezacaftor/ivacaftor: comprimidos revestidos de 100 mg de elexacaftor/50 mg de tezacaftor/75 mg de ivacaftor co-embalados com comprimidos revestidos de 150 mg de ivacaftor e comprimidos revestidos de 50 mg de elexacaftor/25 mg de tezacaftor/37,5 mg de ivacaftor co-embalados com comprimidos revestidos de 75 mg de ivacaftor.\n- Ivacaftor: comprimidos de 150 mg.\n- Pancreatina: cápsulas com 10.000 UI e 25.000 UI de lipase.\n- Tobramicina: solução inalatória de 300 mg.",
   "pagina": 19,
   "completo": true
  },
  "esquemas": {
   "texto": "- Alfadornase: 2,5 mg uma vez ao dia, com nebulizador apropriado em sistema a jato ou malha vibratória 123,178,179.\nPacientes com doença pulmonar mais grave ou com exacerbações frequentes podem se beneficiar com inalação duas vezes ao dia 122. A inalação deve ocorrer 30 minutos antes ou 30 minutos após a fisioterapia, conforme preferência do paciente, para melhores resultados. Há possibilidade de instilação de alfadornase diretamente nas vias aéreas inferiores por fibrobroncoscopia, na presença de alterações radiológicas causadas por obstrução ou impacção mucoide das vias aéreas 178–183 - Colistimetato de sódio: para uso inalatório, preconiza-se o uso de 1 milhão a 2 milhões de UI, inalada duas ou três vezes ao dia, de acordo com a severidade, o tipo de infecção e com a função renal do paciente. Deve ser administrado após a fisioterapia respiratória e outros tratamentos inalatórios para maior eficácia, quando utilizados, podendo seu uso ser estendido por 2 a 3 meses. O paciente deve utilizar broncodilatador antes da nebulização com colistimetato para prevenção de broncoespasmo. Para o uso por via intravenosa, preconiza-se doses de 50.000 UI/kg/dia (4 mg/kg/dia) até 75.000 UI/kg/dia (6 mg/kg/dia) para pacientes até 60 kg, divididas em 3 administrações e, para pacientes com peso superior a 60 kg, deve ser administrada dose de 1.000.000 - 2.000.000 UI a cada 8 horas (dose máxima de 6.000.000 UI, 480 mg).\n- Elexacaftor/tezacaftor/ivacaftor: a dose é de acordo com o peso e a idade do paciente, dividido em 2 administrações diárias por via oral, conforme Quadro 3. Os comprimidos devem ser ingeridos com alimentos contendo gordura, com aproximadamente 12 horas de intervalo entre as administrações.\nQuadro 3 – Esquemas de administração do elexacaftor/tezacaftor/ivacaftor.\nIdade/peso Dose da manhã (2 comprimidos) Dose da noite (1 comprimido) Pacientes de 6 anos a 11 anos de idade pesando menos de 30 kg 50 mg elexacaftor/25 mg tezacaftor/37,5 mg ivacaftor ivacaftor 75 mg Pacientes de 6 anos a 11 anos de idade pesando 30 kg ou mais 100 mg elexacaftor/50 mg tezacaftor/75 mg ivacaftor ivacaftor 150 mg Pacientes com 12 anos de idade ou mais 100 mg elexacaftor/50 mg tezacaftor/75 mg ivacaftor ivacaftor 150 mg - Ivacaftor: 1 comprimido a cada 12 horas, com dose diária total de 300 mg, nos casos de paciente com idade igual ou maior que 6 anos e pesando pelo menos 25 kg.",
   "pagina": 19,
   "completo": false
  }
 },
 {
  "id_pcdt": 63,
  "titulo": "Glaucoma",
  "portaria": "Portaria Conjunta SAES/SECTICS/MS nº 28 - 06/12/2023",
  "data_portaria": "2023-12-11",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/portaria-conjunta-no-28-pcdt-do-glaucoma.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2023/portaria-conjunta-saes-sectics-no-28.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/PCDTResumidoGlaucomafinal.pdf/@@display-file/file",
  "paginas": 39,
  "tem_texto": true,
  "cids": [
   "Q15.0"
  ],
  "farmacos": [
   {
    "nome": "acetazolamida",
    "chave": "acetazolamida",
    "no_rename": true,
    "id_monografia_ftn": 7
   },
   {
    "nome": "bimatoprosta",
    "chave": "bimatoprosta",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "brimonidina",
    "chave": "brimonidina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "brinzolamida",
    "chave": "brinzolamida",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "dorzolamida",
    "chave": "dorzolamida",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "latanoprosta",
    "chave": "latanoprosta",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "pilocarpina",
    "chave": "pilocarpina",
    "no_rename": true,
    "id_monografia_ftn": 113
   },
   {
    "nome": "timolol",
    "chave": "timolol",
    "no_rename": true,
    "id_monografia_ftn": 220
   },
   {
    "nome": "travoprosta",
    "chave": "travoprosta",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "medicamentos",
   "esquemas",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Acetazolamida: comprimido de 250 mg.\n- Bimatoprosta: solução oftálmica a 0,03%.\n- Brimonidina: solução oftálmica a 0,2%.\n- Brinzolamida: suspensão oftálmica a 1%.\n- Dorzolamida: solução oftálmica a 2%.\n- Latanoprosta: solução oftálmica a 0,005%.\n- Manitol: solução intravenosa a 20%.\n- Pilocarpina: solução oftálmica a 2%.\n- Timolol: solução oftálmica a 0,5%.\n- Travoprosta: solução oftálmica a 0,004%.",
   "pagina": 12,
   "completo": true
  },
  "esquemas": {
   "texto": "- Acetazolamida: 1 comprimido via oral (VO) de até 6 em 6 horas.\n- Bimatoprosta a 0,03%: 1 gota no olho, 1 vez por dia (à noite).\n- Brimonidina a 0,2%: 1 gota no olho, 2 a 3 vezes ao dia (quando em monoterapia); se associada, 1 gota, 2 vezes ao dia.\n- Brinzolamida: 1 gota no olho, 2 a 3 vezes ao dia (quando em monoterapia); se associada, 1 gota, 2 vezes ao dia.\n- Dorzolamida: 1 gota no olho, 2 a 3 vezes ao dia (quando em monoterapia); se associada, 1 gota, 2 vezes ao dia.\n- Latanoprosta: 1 gota no olho, 1 vez por dia (à noite).\n- Manitol: 1,5 a 2 g/kg de peso por via intravenosa de 8 em 8 horas.\n- Pilocarpina: 1 gota no olho de 6 em 6 horas.\n- Timolol: 1 gota no olho, 2 vezes ao dia.\n- Travoprosta: 1 gota no olho, 1 vez por dia (à noite).",
   "pagina": 12,
   "completo": true
  }
 },
 {
  "id_pcdt": 64,
  "titulo": "Hanseníase",
  "portaria": "Portaria SCTIE/MS nº 67 - 07/07/2022",
  "data_portaria": "2022-07-11",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/20220818_pcdt_hanseniase.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2022/20220711_portaria_67.pdf/@@display-file/file",
  "url_publicacao_ms": "https://www.gov.br/conitec/pt-br/midias/protocolos/publicacoes_ms/copy_of_20230131_PCDT_Hanseniase_2022_eletronica_ISBN.pdf/@@display-file/file",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/PCDTResumidoHanseniase.pdf/@@display-file/file",
  "paginas": 107,
  "tem_texto": true,
  "cids": [
   "A30.0",
   "A30.1",
   "A30.2",
   "A30.3",
   "A30.4",
   "A30.5",
   "A30.8",
   "A30.9",
   "B92"
  ],
  "farmacos": [
   {
    "nome": "rifampicina",
    "chave": "rifampicina",
    "no_rename": true,
    "id_monografia_ftn": 271
   },
   {
    "nome": "clofazimina",
    "chave": "clofazimina",
    "no_rename": true,
    "id_monografia_ftn": 72
   },
   {
    "nome": "dapsona",
    "chave": "dapsona",
    "no_rename": true,
    "id_monografia_ftn": 128
   },
   {
    "nome": "minociclina",
    "chave": "minociclina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "talidomida",
    "chave": "talidomida",
    "no_rename": true,
    "id_monografia_ftn": 320
   },
   {
    "nome": "ofloxacino",
    "chave": "ofloxacino",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "prednisona",
    "chave": "prednisona",
    "no_rename": true,
    "id_monografia_ftn": 267
   },
   {
    "nome": "pentoxifilina",
    "chave": "pentoxifilina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "claritromicina",
    "chave": "claritromicina",
    "no_rename": true,
    "id_monografia_ftn": 71
   },
   {
    "nome": "acido folico",
    "chave": "acido folico",
    "no_rename": true,
    "id_monografia_ftn": 10
   },
   {
    "nome": "glicose",
    "chave": "glicose",
    "no_rename": true,
    "id_monografia_ftn": 182
   },
   {
    "nome": "tetraciclina",
    "chave": "tetraciclina",
    "no_rename": true,
    "id_monografia_ftn": 121
   },
   {
    "nome": "hidrocortisona",
    "chave": "hidrocortisona",
    "no_rename": true,
    "id_monografia_ftn": 2
   },
   {
    "nome": "oxigenio",
    "chave": "oxigenio",
    "no_rename": false,
    "id_monografia_ftn": 252
   },
   {
    "nome": "fibrinogenio",
    "chave": "fibrinogenio",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "preservativo masculino",
    "chave": "preservativo masculino",
    "no_rename": false,
    "id_monografia_ftn": 268
   },
   {
    "nome": "diafragma",
    "chave": "diafragma",
    "no_rename": false,
    "id_monografia_ftn": 130
   },
   {
    "nome": "dolutegravir",
    "chave": "dolutegravir",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "sodio",
    "chave": "sodio",
    "no_rename": true,
    "id_monografia_ftn": 6
   },
   {
    "nome": "saquinavir",
    "chave": "saquinavir",
    "no_rename": false,
    "id_monografia_ftn": 276
   },
   {
    "nome": "zidovudina",
    "chave": "zidovudina",
    "no_rename": true,
    "id_monografia_ftn": 345
   },
   {
    "nome": "calcio",
    "chave": "calcio",
    "no_rename": true,
    "id_monografia_ftn": 50
   },
   {
    "nome": "magnesio",
    "chave": "magnesio",
    "no_rename": true,
    "id_monografia_ftn": 313
   },
   {
    "nome": "isotretinoina",
    "chave": "isotretinoina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "zinco",
    "chave": "zinco",
    "no_rename": true,
    "id_monografia_ftn": 318
   },
   {
    "nome": "glibenclamida",
    "chave": "glibenclamida",
    "no_rename": true,
    "id_monografia_ftn": 177
   },
   {
    "nome": "fenitoina",
    "chave": "fenitoina",
    "no_rename": true,
    "id_monografia_ftn": 159
   },
   {
    "nome": "carbamazepina",
    "chave": "carbamazepina",
    "no_rename": true,
    "id_monografia_ftn": 49
   },
   {
    "nome": "fenobarbital",
    "chave": "fenobarbital",
    "no_rename": true,
    "id_monografia_ftn": 160
   },
   {
    "nome": "rifabutina",
    "chave": "rifabutina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "efavirenz",
    "chave": "efavirenz",
    "no_rename": true,
    "id_monografia_ftn": 143
   },
   {
    "nome": "nevirapina",
    "chave": "nevirapina",
    "no_rename": true,
    "id_monografia_ftn": 235
   },
   {
    "nome": "rifapentina",
    "chave": "rifapentina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "etravirina",
    "chave": "etravirina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "fluconazol",
    "chave": "fluconazol",
    "no_rename": true,
    "id_monografia_ftn": 164
   },
   {
    "nome": "ritonavir",
    "chave": "ritonavir",
    "no_rename": true,
    "id_monografia_ftn": 274
   },
   {
    "nome": "sildenafila",
    "chave": "sildenafila",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "midazolam",
    "chave": "midazolam",
    "no_rename": true,
    "id_monografia_ftn": 231
   },
   {
    "nome": "digoxina",
    "chave": "digoxina",
    "no_rename": true,
    "id_monografia_ftn": 137
   },
   {
    "nome": "atazanavir",
    "chave": "atazanavir",
    "no_rename": true,
    "id_monografia_ftn": 306
   },
   {
    "nome": "itraconazol",
    "chave": "itraconazol",
    "no_rename": true,
    "id_monografia_ftn": 206
   },
   {
    "nome": "cetoconazol",
    "chave": "cetoconazol",
    "no_rename": true,
    "id_monografia_ftn": 61
   },
   {
    "nome": "anfotericina b",
    "chave": "anfotericina b",
    "no_rename": false,
    "id_monografia_ftn": 26
   },
   {
    "nome": "acido acetilsalicilico",
    "chave": "acido acetilsalicilico",
    "no_rename": true,
    "id_monografia_ftn": 9
   },
   {
    "nome": "dexametasona",
    "chave": "dexametasona",
    "no_rename": true,
    "id_monografia_ftn": 129
   },
   {
    "nome": "varfarina",
    "chave": "varfarina",
    "no_rename": true,
    "id_monografia_ftn": 344
   },
   {
    "nome": "noretisterona",
    "chave": "noretisterona",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "casos_especiais",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- PQT-U Adulto (rifampicina 600 mg + clofazimina 100 mg + dapsona 100 mg + clofazimina 50 mg);\n- PQT-U Infantil (rifampicina 300 mg + rifampicina 150 mg + clofazimina 50 mg + dapsona 50 mg);\n- Rifampicina: suspensão oral de 20 mg/mL (2%);\n- Clofazimina: cápsula de 50 mg; cápsula de 100 mg;\n- Minociclina: comprimido de 100 mg;\nNota: A talidomida produzida no Brasil e disponibilizada no SUS tem registro em bula destinado somente para adultos.\nPortanto, não está autorizado por este PCDT a administração de talidomida em menores de 18 anos.\n39\n- Ofloxacino: comprimido de 400 mg;\n- Prednisona: comprimido de 5 mg; comprimido de 20 mg;\n- Pentoxifilina: comprimido de 400 mg;\n- Talidomida: comprimido de 100 mg;\n- Claritromicina: comprimido de 500 mg;",
   "pagina": 38,
   "completo": false
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 65,
  "titulo": "Hemangioma Infantil",
  "portaria": "Portaria Conjunta SAS/SCTIE/MS nº 76 - 01/09/2026",
  "data_portaria": "2026-10-15",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/2026/pcdt_hemangioma-infantil.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2026/portaria-conjunta-saes-sctie-no-76-de-1o-de-setembro-de-2026.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 120,
  "tem_texto": true,
  "cids": [
   "D18.0"
  ],
  "farmacos": [
   {
    "nome": "cloridrato de propranolol",
    "chave": "propranolol",
    "no_rename": true,
    "id_monografia_ftn": 118
   },
   {
    "nome": "prednisona ou fosfato sódico de prednisolona",
    "chave": "prednisona ou fosfato sodico de prednisolona",
    "no_rename": false,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "esquemas",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Cloridrato de propranolol: comprimidos de 10 mg e 40 mg;\n- Prednisona: comprimidos de 5 mg e 20 mg;\n- Fosfato sódico de prednisolona: solução oral de 1 mg/mL e 3 mg/mL.",
   "pagina": 18,
   "completo": true
  },
  "esquemas": {
   "texto": "Os esquemas de administração dos medicamentos recomendados neste Protocolo estão descritos a seguir:\n- Cloridrato de propranolol: 2 a 3 mg/kg, por via oral, divididos em 2 a 3 doses diárias, com intervalo de 8 a 12 horas entre as doses. Recomenda-se iniciar o tratamento com uma dose mais baixa, ajustada conforme as condições clínicas do paciente. Para recém-nascidos prematuros, com idade pós-concepcional inferior a 45 semanas, com baixo peso ao nascer (menor que 2,5 kg), presença de comorbidades, tendência à hipoglicemia, lesões graves (incluindo suspeita ou diagnóstico de síndrome PHACES), ulceração extensa ou progressiva, a dose inicial deve ser de 0,5 mg/kg, preferencialmente em ambiente hospitalar. Já para bebês a termo, com idade pós-concepcional superior a 45 semanas, com peso normal ao nascer e alimentação estabelecida com ganho ponderal satisfatório, recomenda-se iniciar com 1 mg/kg, sendo possível realizar em regime ambulatorial. A dose deve ser titulada de forma gradual, por meio de incrementos de 0,5 mg/kg, com intervalos mínimos de 24 horas ou semanalmente, até atingir a dose máxima requerida. O medicamento deve ser administrado durante ou imediatamente após a alimentação, a fim de minimizar o risco de hipoglicemia. Os pais ou responsáveis devem receber instruções por escrito sobre a administração do medicamento4,7,8,19,21,22,26,40,41,67,68. Em pacientes com HI ulcerado, recomenda-se considerar o início do tratamento com uma dose mais baixa (≤ 1 mg/kg/dia)50. Embora a duração mínima de tratamento recomendada seja de 6 meses, o período máximo pode variar entre 6 e 24 meses, devido à ausência de consenso na literatura que defina um tempo ideal. As diretrizes mais recentes recomendam, em média, a manutenção do tratamento até os 12 meses de idade, com o objetivo de reduzir o risco de recidiva.\nNo entanto, alguns pacientes podem necessitar de um tempo de tratamento ainda mais prolongado4,7,8,21,22,31,69.\n- Prednisona ou fosfato sódico de prednisolona: 2 a 3 mg/kg, por via oral, em dose diária única no período da manhã.\nA duração do tratamento pode variar desde ciclos mais longos, mantendo a dose completa por 4 a 12 semanas seguida de redução gradual lenta até a conclusão da terapia entre 9 a 12 meses de idade, a ciclos mais curtos, de 1 a 6 semanas, com múltiplos ciclos intermitentes, se necessário4,7,8,12,21,40,69.",
   "pagina": 18,
   "completo": false
  }
 },
 {
  "id_pcdt": 66,
  "titulo": "Hemoglobinúria Paroxística Noturna",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 18 - 20/11/2019",
  "data_portaria": "2019-11-22",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt__hpn.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2019/portariaconjunta_n18_2019.pdf/@@display-file/file",
  "url_publicacao_ms": "https://www.gov.br/conitec/pt-br/midias/protocolos/publicacoes_ms/pcdt_hemoglobinria-paroxstica-noturna_isbn_final.pdf/@@display-file/file",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/pcdt_resumido_hemoglobinuriaparoxisticanoturna.pdf/@@display-file/file",
  "paginas": 34,
  "tem_texto": true,
  "cids": [
   "D59.5"
  ],
  "farmacos": [
   {
    "nome": "eculizumabe",
    "chave": "eculizumabe",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 67,
  "titulo": "Hepatite Autoimune",
  "portaria": "Portaria Conjunta SAS/SCTIE/MS nº 14 - 09/05/2018",
  "data_portaria": "2018-05-24",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/portaria-conjunta-14_pcdt-hai_final1_sctie-1.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2018/portarias_conjuntas_13_14_15.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/PCDT_Resumido_Hepatite_Autoimune_final.pdf/@@display-file/file",
  "paginas": 31,
  "tem_texto": true,
  "cids": [
   "K75.4"
  ],
  "farmacos": [
   {
    "nome": "prednisona",
    "chave": "prednisona",
    "no_rename": true,
    "id_monografia_ftn": 267
   },
   {
    "nome": "azatioprina",
    "chave": "azatioprina",
    "no_rename": true,
    "id_monografia_ftn": 33
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "medicamentos",
   "esquemas",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Prednisona: comprimidos de 5 e 20 mg;\n- Azatioprina: comprimidos de 50 mg.",
   "pagina": 10,
   "completo": true
  },
  "esquemas": {
   "texto": "Os esquemas de administração de imunossupressores são os seguintes:\nIndução da remissão Em adultos, utilizam-se as doses preconizadas na Tabela 4. Em crianças, as doses iniciais recomendadas são de 2 mg/kg de prednisona (dose máxima de 60 mg/dia), sendo possível a associação de azatioprina como medida para redução da dose de corticosteroide26.\nTabela 4 - Doses do Tratamento de Indução da Remissão em Adultos Semanas em tratamento Tratamento combinado Prednisona em monoterapia Prednisona (mg/dia) Azatioprina (mg/dia) Prednisona (mg/dia) 1 30 50-150 60 1 20 50-150 40 2 15 50-150 30 Manutenção até o desfecho do tratamento 5-15 50-150 20 Esquema para falha do tratamento de indução da remissão Deve-se iniciar com prednisona em monoterapia (60 mg/dia) ou prednisona (30 mg/dia) associada à azatioprina (150 mg/dia). As doses são reduzidas mensalmente enquanto houver melhora laboratorial (redução de 10 mg/mês para prednisona e de 50 mg/mês para azatioprina) até atingir-se a dose de 10 mg/dia de prednisona e de 50 mg/dia de azatioprina ou 20 mg/dia de prednisona em monoterapia, quando os pacientes devem ser tratados como os que se encontram em esquemas de tratamento padrão.\nEsquema para resposta incompleta ou a partir da segunda recaída A manutenção com prednisona em doses baixas é preconizada para resposta incompleta ou a partir da segunda recaída. Após remissão clínica e bioquímica com a terapia de indução, reduz-se a dose de prednisona (2,5 mg/dia ou 5 mg a cada 2 dias) enquanto houver estabilidade clínicolaboratorial até encontrar-se a dose mínima eficaz para manter o paciente assintomático e AST/TGO 5 vezes abaixo do limite superior da normalidade. A maior vantagem da monoterapia com corticosteroide em doses baixas é a prevenção da teratogenicidade de azatioprina em mulheres em idade fértil.\nA manutenção com azatioprina em monoterapia tem as mesmas indicações da manutenção com prednisona em doses baixas. Após remissão clínica e bioquímica com a terapia de indução, a dose de azatioprina é aumentada gradualmente (até 2 mg/kg/dia), permitindo redução da dose de corticosteroide. A maior vantagem da monoterapia com azatioprina é a prevenção dos efeitos adversos dos corticosteroides, em especial nas pacientes pós-menopáusicas.",
   "pagina": 11,
   "completo": true
  }
 },
 {
  "id_pcdt": 68,
  "titulo": "Hepatite B e Coinfecções",
  "portaria": "Portaria SECTICS/MS nº 25 - 18/05/2023",
  "data_portaria": "2023-05-22",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/20230524_Relatrio_PCDTHepatiteB.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2023/20230522_portaria_dou_25.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/pcdt-resumido-de-hepatite-b-e-coinfeccoes/@@display-file/file",
  "paginas": 104,
  "tem_texto": true,
  "cids": [],
  "farmacos": [],
  "secoes_disponiveis": [],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 69,
  "titulo": "Hepatite C e coinfecções",
  "portaria": "Portaria SCTIE/MS nº 39 - 20/07/2026",
  "data_portaria": "2026-07-21",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2026/portaria-sctiems-no-39-de-20-de-julho-de-2026/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2026/portaria-sctie-ms-no-39-de-20-de-julho-de-2026/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 66,
  "tem_texto": true,
  "cids": [
   "B17.1",
   "B18.2"
  ],
  "farmacos": [
   {
    "nome": "tenofovir desoproxila",
    "chave": "tenofovir desoproxila",
    "no_rename": true,
    "id_monografia_ftn": 174
   },
   {
    "nome": "sofosbuvir",
    "chave": "sofosbuvir",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "daclatasvir",
    "chave": "daclatasvir",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "carbamazepina",
    "chave": "carbamazepina",
    "no_rename": true,
    "id_monografia_ftn": 49
   },
   {
    "nome": "fenitoina",
    "chave": "fenitoina",
    "no_rename": true,
    "id_monografia_ftn": 159
   },
   {
    "nome": "fenobarbital",
    "chave": "fenobarbital",
    "no_rename": true,
    "id_monografia_ftn": 160
   },
   {
    "nome": "amiodarona",
    "chave": "amiodarona",
    "no_rename": true,
    "id_monografia_ftn": 80
   },
   {
    "nome": "rifampicina",
    "chave": "rifampicina",
    "no_rename": true,
    "id_monografia_ftn": 271
   },
   {
    "nome": "rifabutina",
    "chave": "rifabutina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "rifapentina",
    "chave": "rifapentina",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 70,
  "titulo": "Hidradenite Supurativa",
  "portaria": "Portaria Conjunta SCTIE/SAS/MS nº 14/2019 - 11/09/2019",
  "data_portaria": "2019-09-16",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/site-de-portaria-conjunta-14_pcdthidradernite-supurativa.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2019/portariasctie_14_b_2019.pdf/@@display-file/file",
  "url_publicacao_ms": "https://www.gov.br/conitec/pt-br/midias/protocolos/publicacoes_ms/pcdt_hidradenite-supurativa_isbn_21-08-2020.pdf/@@display-file/file",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/pcdt_resumido_hidradenitesupurativa.pdf/@@display-file/file",
  "paginas": 24,
  "tem_texto": true,
  "cids": [
   "L73.2"
  ],
  "farmacos": [
   {
    "nome": "adalimumabe",
    "chave": "adalimumabe",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "clindamicina",
    "chave": "clindamicina",
    "no_rename": true,
    "id_monografia_ftn": 88
   },
   {
    "nome": "rifampicina",
    "chave": "rifampicina",
    "no_rename": true,
    "id_monografia_ftn": 271
   },
   {
    "nome": "tetraciclina",
    "chave": "tetraciclina",
    "no_rename": true,
    "id_monografia_ftn": 121
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "esquemas",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "- Fosfato de Clindamicina 1%: aplicação tópica, 2 vezes ao dia.\n- Cloridrato de tetraciclina: 500mg, por via oral, em duas administrações (12/12h).\n- Cloridrato de clindamicina: 300 mg, por via oral, em duas administrações (12/12h).\n- Rifampicina: 300mg, por via oral, em duas administrações (12/12h).\n- Adalimumabe: a dose de indução recomendada é de 160 mg (quatro injeções subcutâneas de 40 mg, administradas no 1º dia ou divididas em duas injeções de 40mg em 2 dias consecutivos), seguidas por administração de 80 mg (duas injeções subcutânea de 40mg) na 2º semana e, dose de manutenção de uma injeção de 40 mg por semana da 4º a 12º semana.\n9.1.1. Contraindicações Fosfato de clindamicina 1%: Hipersensibilidade conhecida ao medicamento, classe ou componentes; pacientes com antecedentes de enterite regional, colite ulcerativa ou colite induzida ou associada a antibióticos (incluindo colite pseudomembranosa). Não deve ser utilizado por mulheres grávidas ou durante a amamentação42.\nCloridrato de tetraciclina: Hipersensibilidade conhecida ao medicamento, classe ou componentes; na gestação e amamentação45.\nCloridrato de clindamicina: Hipersensibilidade conhecida ao medicamento, classe ou componentes e amamentação47–49.\nRifampicina: Hipersensibilidade conhecida ao medicamento, classe ou componentes. Não deve ser administrada simultaneamente com a combinação de saquinavir/ritonavir47–49.\nAdalimumabe: Hipersensibilidade conhecida ao medicamento, classe ou componentes;\ninfecções graves devido a bactérias, micobactérias, infecções fúngicas invasivas (histoplasmose disseminada ou extrapulmonar, aspergilose, coccidioidomicose), virais, parasitárias ou outras infecções oportunistas4,36;  tuberculoseativa e latente4; insuficiênciacardíacaNew York Heart Association (NYHA) III e IV4,36; vacinação com vírus vivo36.",
   "pagina": 12,
   "completo": true
  }
 },
 {
  "id_pcdt": 71,
  "titulo": "Hiperplasia Adrenal Congênita",
  "portaria": "Portaria SAS/MS nº 16 - 15/01/2010",
  "data_portaria": "2010-01-18",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/pdf/2014/abril/02/pcdt-hiperplasia-adrenal-congenita-livro-2010.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2010/portaria_sas_16_2010.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 18,
  "tem_texto": true,
  "cids": [],
  "farmacos": [
   {
    "nome": "dexametasona",
    "chave": "dexametasona",
    "no_rename": true,
    "id_monografia_ftn": 129
   },
   {
    "nome": "prednisona",
    "chave": "prednisona",
    "no_rename": true,
    "id_monografia_ftn": 267
   },
   {
    "nome": "hidrocortisona",
    "chave": "hidrocortisona",
    "no_rename": true,
    "id_monografia_ftn": 2
   },
   {
    "nome": "fludrocortisona",
    "chave": "fludrocortisona",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "medicamentos",
   "esquemas",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "Glicocorticoides • Dexametasona: elixir de 0,1 mg/ml; comprimido de 4 mg; solução injetável de 4 mg/ml • Prednisona: comprimidos de 5 e 20 mg • Prednisolona: solução oral de 1,34 mg/ml • Hidrocortisona: solução injetável de 100 e 500 mg Mineralocorticoide • Fludrocortisona: comprimido de 0,1 mg 359 Protocolos Clínicos e Diretrizes Terapêuticas Na Tabela 1 estão indicadas as potências biológicas dos esteroides sintéticos em relação ao cortisol.\nTabela 1 - P otências B iológicas dos Esteroides S intéticos em relação ao Cortisol Esteroide Atividade anti-inflamatória15 Retenção salina16 Supressão do eixo hipotálamo-hipófise15 Cortisol/hidrocortisona 1 1 1 Fludrocortisona 12 125 12 Prednisona 3 0,8 4 Prednisolona 3 0,8 4 Dexametasona 26 0 17 * Em pessoas sem deficiência enzimática, a produção diária de cortisol é estimada em 7-9 mg/m2 em neonatos17, em 6-7 mg/m2 em crianças e adolescentes18 e em 10-15 mg em adultos19.",
   "pagina": 3,
   "completo": true
  },
  "esquemas": {
   "texto": "Para glicocorticoides O tratamento com glicocorticoides deve ser feito com a menor dose possível para manter controlados os níveis de andrógenos. A tentativa de supressão extrema dos níveis de andrógenos leva a excesso de glicocorticoide, com desenvolvimento da síndrome de Cushing iatrogênica1. O excesso tanto de andrógenos (subtratamento) como de glicocorticoides (sobretratamento) tem impacto negativo no crescimento de crianças com HAC20,21. O tratamento pode ser realizado com qualquer um dos glicocorticoides listados abaixo.\n• Dexametasona: administrada por via oral, intramuscular ou intravenosa, em dose única diária Dose inicial em crianças: 0,27 mg/m2/dia22 Dose inicial em adultos: 0,25-0,75 mg/dia • Prednisona: administrada por via oral, em dose única diária Dose inicial em crianças: 2,5-4 mg/m2/dia23 Dose inicial em adultos: 2,5-7,5 mg/dia • Prednisolona: administrada por via oral, em dose única diária Dose inicial em crianças: 2-3 mg/m2/dia23,24 Dose inicial em adultos: 2,5-7,5 mg/dia • Hidrocortisona: administrada por via intramuscular ou intravenosa Dose inicial em crianças: 12-18 mg/m2/dia (em estresse/crise adrenal: 60-100 mg/m2/dia)1 Dose inicial em adultos: 20 mg/dia (em crise adrenal: 200-300 mg/dia) Em gestantes com HAC, para evitar a exposição fetal ao glicocorticoide, o tratamento deve ser realizado de preferência com glicocorticoide metabolizável pela placenta (prednisona, prednisolona ou hidrocortisona).\nA Tabela 2 apresenta os glicocorticoides usados no tratamento da HAC.\nTabela 2 - Glicocorticoides Usados no T ratamento da HAC Esteroide Dose-equivalente em crianças (mg/m2/dia)23 Dose-equivalente em adultos (mg/dia)15 Dose ao dia Meia-vida (horas)15 Via de administração Hidrocortisona 10 - 18 20 2 - 4",
   "pagina": 4,
   "completo": true
  }
 },
 {
  "id_pcdt": 72,
  "titulo": "Hiperprolactinemia",
  "portaria": "Portaria Conjunta SCTIE/SAES/MS nº 19 - 23/11/2020",
  "data_portaria": "2020-11-27",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/20201201_portaria_conjunta_pcdt_hiperprolactinemia.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2020/20201127_portaria_conjunta_19.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/PCDTResumidodaHiperprolactinemia.pdf.pdf/@@display-file/file",
  "paginas": 17,
  "tem_texto": true,
  "cids": [
   "E22.1"
  ],
  "farmacos": [
   {
    "nome": "cabergolina",
    "chave": "cabergolina",
    "no_rename": true,
    "id_monografia_ftn": 46
   },
   {
    "nome": "bromocriptina",
    "chave": "bromocriptina",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "medicamentos",
   "esquemas",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Cabergolina: comprimidos de 0,5 mg.\n- Mesilato de bromocriptina: comprimidos de 2,5 mg.",
   "pagina": 7,
   "completo": true
  },
  "esquemas": {
   "texto": "- Cabergolina: possui uma meia-vida longa e, em geral, é administrada semanalmente. Preconiza-se iniciar com 0,25 mg, por via oral, duas vezes por semana ou 0,5 mg uma vez por semana; incrementos de 0,25 mg a 1 mg duas vezes por semana podem ser realizados, a intervalos de no mínimo 4 semanas, conforme necessidade. Em geral, a dose administrada semanalmente varia de 1 a 2 mg. Em algumas situações, doses acima de 3 mg/semana são necessárias, podendo chegar até no máximo de 4,5 mg/semana48.\n- Mesilato de bromocriptina: Preconiza-se iniciar com 1,25 mg, por via oral, depois do jantar ou na hora de dormir, durante uma semana; então, aumentar para 1,25 mg duas vezes por dia (depois do café da manhã e depois do jantar ou na hora de dormir). Incrementos de dose de 2,5 mg podem ser realizados a cada três a sete dias até a dose necessária para obter o resultado de tratamento, até o limite de 20 mg49.\nO tratamento com agonistas dopaminérgicos para prolactinomas é contínuo, com tempo mínimo preconizado de dois anos. Não há tempo máximo de tratamento. Uma vez suspenso o agonista dopaminérgico, a hiperprolactinemia pode recidivar, geralmente sem novo crescimento tumoral13.",
   "pagina": 7,
   "completo": true
  }
 },
 {
  "id_pcdt": 73,
  "titulo": "Hipertensão Arterial Sistêmica",
  "portaria": "Portaria SECTICS/MS nº 49 - 23/07/2025",
  "data_portaria": "2025-07-24",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-hipertensao-arterial-sistemica.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2025/portaria-sectics-no-49-de-23-de-julho-de-2025-pdf.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/2026/pcdt-resumido/pcdt-resumido-da-hipertensao-arterial-sistemica/@@display-file/file",
  "paginas": 97,
  "tem_texto": true,
  "cids": [
   "I10",
   "I15",
   "O10.0",
   "O10.4",
   "O10.9",
   "O13",
   "O14",
   "O16"
  ],
  "farmacos": [
   {
    "nome": "atenolol",
    "chave": "atenolol",
    "no_rename": true,
    "id_monografia_ftn": 32
   },
   {
    "nome": "besilato de anlodipino",
    "chave": "anlodipino",
    "no_rename": true,
    "id_monografia_ftn": 40
   },
   {
    "nome": "captopril",
    "chave": "captopril",
    "no_rename": true,
    "id_monografia_ftn": 48
   },
   {
    "nome": "carvedilol",
    "chave": "carvedilol",
    "no_rename": true,
    "id_monografia_ftn": 54
   },
   {
    "nome": "mesilato de doxazosina",
    "chave": "doxazosina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "maleato de enalapril",
    "chave": "enalapril",
    "no_rename": true,
    "id_monografia_ftn": 218
   },
   {
    "nome": "espironolactona",
    "chave": "espironolactona",
    "no_rename": true,
    "id_monografia_ftn": 147
   },
   {
    "nome": "furosemida",
    "chave": "furosemida",
    "no_rename": true,
    "id_monografia_ftn": 175
   },
   {
    "nome": "cloridrato de hidralazina",
    "chave": "hidralazina",
    "no_rename": true,
    "id_monografia_ftn": 100
   },
   {
    "nome": "hidroclorotiazida",
    "chave": "hidroclorotiazida",
    "no_rename": true,
    "id_monografia_ftn": 188
   },
   {
    "nome": "losartana potássica",
    "chave": "losartana",
    "no_rename": true,
    "id_monografia_ftn": 216
   },
   {
    "nome": "metildopa",
    "chave": "metildopa",
    "no_rename": true,
    "id_monografia_ftn": 227
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 74,
  "titulo": "Hipertensão Pulmonar - Alterado em 26/09/2024",
  "portaria": "Portaria Conjunta SAES/SECTICS/MS nº 10 - 18/07/2023",
  "data_portaria": "2023-07-21",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/portariaconjuntano10pcdthipertensaopulmonar.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2023/20230721_PORTARIAConjunta__DOU_10.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/PCDTResumidoHipertensoPulmonar.pdf/@@display-file/file",
  "paginas": 54,
  "tem_texto": true,
  "cids": [
   "I27.0",
   "I27.2",
   "I27.8"
  ],
  "farmacos": [
   {
    "nome": "ambrisentana",
    "chave": "ambrisentana",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "anlodipino",
    "chave": "anlodipino",
    "no_rename": true,
    "id_monografia_ftn": 40
   },
   {
    "nome": "bosentana",
    "chave": "bosentana",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "iloprosta",
    "chave": "iloprosta",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "nifedipino",
    "chave": "nifedipino",
    "no_rename": true,
    "id_monografia_ftn": 237
   },
   {
    "nome": "sildenafila",
    "chave": "sildenafila",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "selexipague",
    "chave": "selexipague",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "medicamentos",
   "esquemas",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "• Ambrisentana: comprimidos de 5 e 10 mg.\n• Anlodipino: comprimidos de 5 e 10 mg.\n• Bosentana: comprimidos de 62,5 e 125 mg.\n• Citrato de sildenafila: comprimidos de 20 mg.\n• Iloprosta: solução para nebulização contendo 10 mcg/mL.\n• Nifedipino: cápsula ou comprimidos de 10 mg.\n- Selexipague: comprimidos de 200 mcg, 400 mcg, 600 mcg, 800 mcg, 1.000 mcg, 1.200 mcg, 1.400 mcg ou 1.600 mcg Deve ser observado o escalonamento adequado dos fármacos disponíveis conforme o caso e a indicação. Por exemplo, a ambrisentana e o selexipague possuem indicação terapêutica aprovada apenas para usuários em CF II e III.",
   "pagina": 18,
   "completo": true
  },
  "esquemas": {
   "texto": "- Ambrisentana: a dose inicial preconizada é de 5 mg/dia e, se bem tolerada, pode ser aumentada para 10 mg/dia. Caso o paciente também esteja em uso de ciclosporina, a dose deve ser limitada a 5 mg uma vez ao dia. Não é necessário ajuste de dose para idosos. O mínimo metabolismo e a excreção renal do fármaco tornam improvável a necessidade de ajuste em paciente com insuficiência renal. Inexistem estudos adequados e bem controlados sobre o uso de ambrisentana em mulheres grávidas e crianças. Seu uso está contraindicado na gravidez, em mulheres em idade fértil que não estão utilizando método contraceptivo seguro, em lactantes, em indivíduos com menos de 18 anos, em pacientes com concentrações de aminotransferases (ALT ou AST) aumentadas em mais de 3 vezes o limite superior do normal e em pacientes com insuficiência hepática grave.\n- Bloqueadores dos canais de cálcio (anlodipino e nifedipino): o nifedipino pode ser iniciado com 30 mg/dia, devendo a dose ser aumentada progressivamente até a maior dose tolerada (de 30 a 240 mg/dia), em duas administrações diárias. A dose inicial de anlodipino é de 5 mg, podendo ser aumentada até 20 mg/dia, em uma administração diária. As doses devem ser ajustadas conforme a tolerância do paciente, monitorando-se melhora clínica, pressão arterial sistêmica, frequência cardíaca, saturação de oxigênio e eventos adversos17.\n- Bosentana: a dose inicial preconizada é de 62,5 mg, duas vezes/dia, durante 4 semanas, aumentando posteriormente para 125 mg, duas vezes/dia, como dose de manutenção. A posologia para pacientes com peso corpóreo abaixo de 40 kg deve seguir a orientação pediátrica. Não é necessário ajuste de dose para pacientes idosos ou com insuficiência renal, em hemodiálise ou com insuficiência hepática leve (Child-Pugh classe A). O uso de bosentana deve ser evitado em pacientes com insuficiência hepática moderada ou grave (Child-Pugh classe B ou C). Em pacientes entre 3 a 15 anos de idade, a dose deve ser calculada considerando seu peso: entre 10 e 20 kg, a dose inicial deve ser de 31,25 mg, uma vez/dia, e a de manutenção de 31,25 mg, duas vezes/dia; entre 21 e 40 kg, a dose inicial deve ser de 31,25 mg, duas vezes/dia, e a de manutenção de 62,5 mg, duas vezes/dia;\nacima de 40 kg, a dose inicial deve ser de 62,5 mg, duas vezes/dia, e a de manutenção de 125 mg, duas vezes/dia.",
   "pagina": 19,
   "completo": false
  }
 },
 {
  "id_pcdt": 75,
  "titulo": "Hipoparatireoidismo",
  "portaria": "Portaria SAES/SCTIE/MS nº 70 - 05/08/2026",
  "data_portaria": "2026-09-01",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/2026/pcdt-do-hipoparatireoidismo.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2026/portaria-conjunta-saes-sctie-no-70-de-5-de-agosto-de-2026-1.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 48,
  "tem_texto": true,
  "cids": [
   "E20.0",
   "E20.1",
   "E20.8",
   "E89.2"
  ],
  "farmacos": [
   {
    "nome": "calcitriol",
    "chave": "calcitriol",
    "no_rename": true,
    "id_monografia_ftn": 47
   },
   {
    "nome": "carbonato de cálcio + colecalciferol",
    "chave": "calcio + colecalciferol",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "hidroclorotiazida",
    "chave": "hidroclorotiazida",
    "no_rename": true,
    "id_monografia_ftn": 188
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "medicamentos",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Calcitriol: cápsulas de 0,25 mcg;\n- Carbonato de cálcio + colecalciferol: comprimidos de 500 mg de cálcio + 200 UI;\n- Carbonato de cálcio + colecalciferol: comprimidos de 500 mg de cálcio + 400 UI;\n- Carbonato de cálcio + colecalciferol: comprimidos de 600 mg de cálcio + 400 UI;\n- Carbonato de cálcio: comprimidos de 500 mg de cálcio elementar;\n- Gliconato de cálcio: solução injetável 10%.\n- Hidroclorotiazida: comprimidos de 12,5 mg e 25 mg;\n- Sulfato de magnésio: solução injetável de 10% ou 50%;\nNOTA: Sulfato de magnésio e gliconato de cálcio devem ser utilizados no tratamento de casos graves, em ambiente hospitalar.",
   "pagina": 12,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 76,
  "titulo": "Hipotireoidismo Congênito",
  "portaria": "Portaria Conjunta SCTIE/SAES/MS nº 5 - 16/04/2021",
  "data_portaria": "2021-04-23",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/20210426_portaria_conjunta_pcdt_hipotireoidismo_congenito.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2021/20210423_portaria_conjunta_05-1.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/pcdt_resumido_do_hipotireoidismo.pdf/@@display-file/file",
  "paginas": 16,
  "tem_texto": true,
  "cids": [
   "E03.0",
   "E03.1"
  ],
  "farmacos": [
   {
    "nome": "levotiroxina",
    "chave": "levotiroxina",
    "no_rename": true,
    "id_monografia_ftn": 212
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "medicamentos",
   "esquemas",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Levotiroxina sódica: comprimidos de 12,5; 25; 37,5; 50 e 100 mcg.",
   "pagina": 7,
   "completo": true
  },
  "esquemas": {
   "texto": "A dose de levotiroxina varia de acordo com a idade e peso corporal do paciente. Crianças mais jovens necessitam de doses mais elevadas do que crianças maiores e adultos16, 22,26.\nO tratamento inicia-se com a dose-padrão de 10-15 mcg/kg via oral, uma vez por dia, e esta deve ser ajustada periodicamente de acordo com os controles laboratoriais (ver item 9. Monitoramento). Doses maiores (entre 12-17 mcg/kg, por exemplo) são usadas para iniciar o tratamento dos pacientes com hipotireoidismo mais grave (menores níveis de T4 livre). A dose média para recém-nascido (RN) a termo é de 50 mcg/dia e para RN pré-termo, de 25-37,5 mcg/dia1,16,18,22.\nPara RN e lactentes, o comprimido de levotiroxina deve ser triturado, misturado com um pouco de água ou leite materno e administrado com uma colher. Não diluir na mamadeira. A dose pode ser administrada pela manhã ou à tarde, de preferência antes das refeições. Se a criança vomitar logo em seguida, preconiza-se repetir a mesma dose da levotiroxina22.\nDeve ser evitada a administração concomitante com leite de soja, ferro e cálcio na forma de suplementos alimentares, por interferir em sua absorção. O aleitamento materno deve ser mantido. Mães que usam medicamentos antitireoidianos podem também manter a amamentação de seus filhos, mesmo que eles tenham hipotireoidismo. Se houver insuficiência adrenal concomitante, a reposição de levotiroxina só deve ser iniciada 3-5 dias após o início da corticoterapia para evitar a precipitação de uma crise adrenal 22.",
   "pagina": 7,
   "completo": true
  }
 },
 {
  "id_pcdt": 77,
  "titulo": "Homocistinúria Clássica",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 3 - 17/01/2020",
  "data_portaria": "2020-01-23",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt_homocistinriaclassica.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2020/portariaconjunta_sctie_saes_03_2020.pdf/@@display-file/file",
  "url_publicacao_ms": "https://www.gov.br/conitec/pt-br/midias/protocolos/publicacoes_ms/pcdt_homocistinria-clssica-_isbn.pdf/@@display-file/file",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/pcdt_resumido_homocistinuriaclassica.pdf/@@display-file/file",
  "paginas": 20,
  "tem_texto": true,
  "cids": [
   "E72.1"
  ],
  "farmacos": [
   {
    "nome": "ácido acetilsalicílico",
    "chave": "acido acetilsalicilico",
    "no_rename": true,
    "id_monografia_ftn": 9
   },
   {
    "nome": "ácido fólico",
    "chave": "acido folico",
    "no_rename": true,
    "id_monografia_ftn": 10
   },
   {
    "nome": "cianocobalamina",
    "chave": "cianocobalamina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "cloridrato de piridoxina",
    "chave": "piridoxina",
    "no_rename": true,
    "id_monografia_ftn": 114
   },
   {
    "nome": "fórmula metabólica isenta de metionina",
    "chave": "formula metabolica isenta de metionina",
    "no_rename": false,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "esquemas",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "Os esquemas de administração variam conforme o tipo clínico e a faixa etária dos pacientes e as recomendações sugeridas muitas vezes devem ser ajustadas à resposta terapêutica dos pacientes (conforme monitorização dos níveis plasmáticos de homocisteína total e demais aminoácidos). É recomendado que a FMIM seja usada três a quatro vezes ao dia para maximizar a retenção de nitrogênio e alcançar o crescimento apropriado (1).\n8.4.1 Pacientes responsivos à piridoxina A recomendação do uso de cloridrato de piridoxina é 10 mg/kg/dia até a dose máxima de 500 mg/dia. Pacientes que apresentam homocisteína total no plasma < 50 micromol/L em uso de piridoxina e ácido fólico, são claramente responsivos e não necessitam tratamento adicional (1).\n8.4.2 Pacientes parcialmente responsivos à piridoxina Quando o paciente é parcialmente responsivo à piridoxina, de acordo com os critérios apresentados no item 3.3, devese adicionar ao tratamento com piridoxina/ácido fólico a dieta com restrição de proteína (e, portanto, de metionina) e FMIM, nos mesmos moldes descritos no item 8.4.3 8.4.3 Pacientes não responsivos à piridoxina Nos pacientes não responsivos à piridoxina, não há evidência de que seu uso apresente benefício se não houver resposta bioquímica em um teste bem conduzido. Deve-se iniciar dieta com restrição de metionina associada à FMIM. A tolerância à metionina (e, portanto, à proteína natural) é individualizada para cada paciente.\nA prescrição da FMIM varia considerando a idade, o peso do paciente e o controle metabólico. A quantidade de aminoácidos em 100g da FMIM pode variar dependendo do fabricante, por este motivo é importante conhecer a informação nutricional da fórmula prescrita.",
   "pagina": 9,
   "completo": false
  }
 },
 {
  "id_pcdt": 78,
  "titulo": "Ictioses Hereditárias",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 12 - 13/06/2022",
  "data_portaria": "2022-07-25",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/portalportariaconjuntano12pcdtictioseshereditarias-1.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2022/20220726_portaria-conjunta-n-12-1.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/20230419_PCDT_Resumido_Ictioses_Hereditrias_final.pdf/@@display-file/file",
  "paginas": 19,
  "tem_texto": true,
  "cids": [
   "Q80.0",
   "Q80.1",
   "Q80.2",
   "Q80.3",
   "Q80.8",
   "Q80.9"
  ],
  "farmacos": [
   {
    "nome": "acitretina",
    "chave": "acitretina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "pomada de ácido salicílico",
    "chave": "pomada de acido salicilico",
    "no_rename": false,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "medicamentos",
   "esquemas",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Ácido salicílico: pomada a 5%.\n- Acitretina: cápsulas de 10 mg e 25 mg.",
   "pagina": 11,
   "completo": true
  },
  "esquemas": {
   "texto": "Pomada com ácido salicílico a 5%: A pomada deve ser aplicada nas lesões, à noite, e retirada pela manhã22, devendo ser indicada para áreas limitadas, como palmas das mãos, plantas dos pés, cotovelos e joelhos. Formas farmacêuticas ceratolíticas contendo ácido salicílico devem ser utilizadas de forma ponderada e por curtos períodos, apenas em áreas hiperceratósicas localizadas, em especial na criança pequena, por causa do risco de salicilismo5,9.\nAcitretina: Considerando-se as diferenças individuais na absorção e na velocidade do metabolismo da acitretina, a dose deve ser ajustada individualmente. A dose diária deve ser ingerida de preferência uma vez ao dia, com alimentos ou com um pouco de leite. Em geral, a posologia para adultos é de uma dose inicial diária de 25 a 30 mg durante 2 a 4 semanas. A dose de manutenção deve ser estabelecida de acordo com a eficácia e tolerabilidade. Em geral, os melhores resultados são obtidos com doses diárias de 25 a 50 mg tomadas durante seis a oito semanas adicionais. A dose máxima é de 75 mg/dia. A dose em crianças é de acordo com o peso, sendo indicada 0,5 a 1 mg/kg/dia, com a dose máxima de 35 mg/dia. Uma vez obtida melhora clínica, a dose deve ser reduzida até a menor dose clinicamente eficaz, devido aos possíveis eventos secundários de longo prazo. Em genodermatoses, como nas ictioses, o tratamento é de uso contínuo, observando-se a necessidade de ajuste das doses em função de eventuais efeitos colaterais.5,20.\nO tratamento não tem tempo predeterminado.",
   "pagina": 11,
   "completo": true
  }
 },
 {
  "id_pcdt": 79,
  "titulo": "Imunodeficiência Primária com predominância de defeitos de anticorpos",
  "portaria": "Portaria SAS/MS nº 495 - 11/09/2007",
  "data_portaria": "2007-09-12",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-imunodeficienciaprimaria.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2007/portaria_sas_495_2007.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 10,
  "tem_texto": true,
  "cids": [],
  "farmacos": [],
  "secoes_disponiveis": [
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "esquemas",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "A IGH é uma preparação terapêutica de IgG poliespecífica. As subclasses de IgG estão presentes em proporções fisiológicas. A IgA e IgM estão presentes somente em pequenas quantidades.\nAs seguintes apresentações são disponíveis:\napresentações intravenosas: frascos-ampola de 0,5; 1,0; 2,5; 3,0; 5,0; 6,0g;",
   "pagina": 5,
   "completo": true
  },
  "esquemas": {
   "texto": "A dose IV recomendada para início de tratamento é de 300 a 400mg/kg a cada 3 semanas ou 400- 500mg/kg a cada 4 semanas38.  A dose máxima recomendada é de 600mg/kg a cada 3 semanas ou 800mg/kg a cada 4 semanas38.",
   "pagina": 6,
   "completo": true
  }
 },
 {
  "id_pcdt": 80,
  "titulo": "Imunossupressão no Transplante Cardíaco",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 2 - 05/01/2021",
  "data_portaria": "2021-01-11",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/20210121_portaria_conjunta_pcdt_imunossupressao_transplante_cardiaco.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2021/20210111_portaria_conjunta_02-1.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/PCDTResumidoImunossupressaoTC.pdf.pdf/@@display-file/file",
  "paginas": 78,
  "tem_texto": true,
  "cids": [
   "Z94.1",
   "T86.2"
  ],
  "farmacos": [
   {
    "nome": "prednisona",
    "chave": "prednisona",
    "no_rename": true,
    "id_monografia_ftn": 267
   },
   {
    "nome": "ciclosporina",
    "chave": "ciclosporina",
    "no_rename": true,
    "id_monografia_ftn": 63
   },
   {
    "nome": "tacrolimo",
    "chave": "tacrolimo",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "calcio",
    "chave": "calcio",
    "no_rename": true,
    "id_monografia_ftn": 50
   },
   {
    "nome": "rifampicina",
    "chave": "rifampicina",
    "no_rename": true,
    "id_monografia_ftn": 271
   },
   {
    "nome": "everolimo",
    "chave": "everolimo",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "sirolimo",
    "chave": "sirolimo",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "azatioprina",
    "chave": "azatioprina",
    "no_rename": true,
    "id_monografia_ftn": 33
   },
   {
    "nome": "mercaptopurina",
    "chave": "mercaptopurina",
    "no_rename": false,
    "id_monografia_ftn": 223
   },
   {
    "nome": "micofenolato de mofetila",
    "chave": "micofenolato de mofetila",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "metotrexato",
    "chave": "metotrexato",
    "no_rename": true,
    "id_monografia_ftn": 229
   },
   {
    "nome": "ciclofosfamida",
    "chave": "ciclofosfamida",
    "no_rename": true,
    "id_monografia_ftn": 62
   },
   {
    "nome": "imunoglobulina humana",
    "chave": "imunoglobulina humana",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "esquemas",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "6.3.1 Corticosteroides Exercem potente efeito imunossupressor e anti-inflamatório, atuando na regulação de genes que afetam a função de leucócitos, citocinas, moléculas de adesão e fatores de crescimento. São utilizados em doses altas nas fases iniciais e nos episódios de rejeição aguda. Em razão de inúmeros efeitos colaterais, em especial metabólicos e cardiovasculares, sua retirada tem sido preconizada a partir do sexto mês pós-transplante cardíaco71, principalmente nos pacientes com histórico favorável de rejeição.\nO mecanismo de ação dos corticosteroides para reverter rejeição não é completamente entendido. Pulso de corticosteroide torna sem efeito a geração de citocinas60 e pode ser mais efetivo.\nO paciente com rejeição aguda sintomática deve ser hospitalizado e aqueles com comprometimento hemodinâmico devem internar-se numa unidade de cuidados intensivos. Alta dose de metilprednisolona intravenosa (IV) é a primeira linha de tratamento. A rejeição celular ou humoral aguda não sintomática também é tratada com pulso de corticosteroides IV ou doses mais elevadas de prednisona por via oral1,29.",
   "pagina": 11,
   "completo": false
  },
  "esquemas": {
   "texto": "- Ciclosporina (CsA): cápsulas de 10, 25, 50 e 100 mg; solução oral de 100 mg/mL (frascos de 50 mL); e frascoampola de 50mg.\n1 – 2 mg/kg/dia, por via intravenosa ou 3 - 8 mg/Kg/dia, por via oral, com dose de manutenção guiada por sintomas de efeitos adversos, rejeição e nível sérico. Níveis séricos recomendados - Inicial: 350-450 ng/mL; 250 – 350 ng/mL de 3 a 6 meses: 200 – 300 ng/mL de 6 a 12 meses e 100 – 200 ng/mL após 1 ano.\n- Tacrolimo (TAC): cápsulas de 1 e 5 mg;\nfrasco-ampola de 0,5mg.\n0,05-0,1 mg/Kg/dia por via oral ou 0,01-0,02 mg/Kg/dia por via intravenosa, guiada por sintomas, rejeição e nível sérico. Níveis séricos - Vale: 10-15 ng/mL inicialmente e 5 – 10 ng/mL pós-6 meses.\n- Azatioprina (AZA): comprimidos de 50 mg.\n1,5 – 2,5 mg/kg/dia por via oral, com mesma dose de manutenção, mantendo leucócitos acima de 3.000-4.000/mm3. Suspender o medicamento se leucócitos menores que estes níveis - Prednisona (PDN): comprimidos de 5 e 20 mg.\n0,5 - 1 mg/Kg/dia, por via oral, de manutenção, retirada até 6 meses (na ausência de tratamento de rejeição). Dose de 1mg/kg/dia por via oral, por 3 a 5 dias no resgate.\n- Metotrexato (MTX): comprimidos de 2,5 mg pulso com 2,5 – 20 mg por via oral por semana para resgate, por 3 a 12 semanas. Monitorar mielossupressão, sintomas gastrointestinais, hepato- e nefro-toxicidade.\n- Metilprednisolona: solução injetável de 500 mg.\n500 – 1.000 mg/dia, por via intravenosa, decrescente até o terceiro dia.\nTratamento da rejeição aguda por 3 a 5 dias. Dose de 500 – 1000 mg/dia, IVintravenosa, IV por 3 dias na terapia de resgate.\n- Micofenolato de mofetila (MMF):\ncomprimido de 500 mg.\n1 g de 12/12 horas por via oral, inicialmente. Manutenção com 500 mg a 1,5 g de 12/12 horas. Quando disponível, monitorar com níveis séricos de MPA 2,5 - 5 mcg/mL.\n- Micofenolato de sódio (SMF):\ncomprimidos de 180 e 360 mg.\n720 mg de 12/12 horas via oral inicial. Manutenção com 360 a 720 mg de 12/12 horas.\n- Everolimo (EVL): comprimidos de 0,5;\n0,75 e 1 mg.\n0,5 – 1,5 mg/dia por via oral inicial. Manutenção de 0,5 – 1,5 mg/dia via oral de 12/12 horas. Controle nível sérico no vale: 3 a 8 ng/mL.\n- Imunoglobulina humana (IVIG): frascos de 320mg; 0,5, 1,0, 2,5 e 5,0 g.\n2 g/kg, 1 a 4 vezes por semana, frequentemente administrado após cada sessão de plasmaférese. Enquanto durar a rejeição a critério clínico.\n- Basiliximabe: Frasco-ampola com 20 mg + ampola com 5 mL de água para injeção.",
   "pagina": 15,
   "completo": false
  }
 },
 {
  "id_pcdt": 81,
  "titulo": "Imunossupressão no Transplante Hepático em Adulto",
  "portaria": "Portaria Conjunta SAS/SCTIE/MS nº 5 - 22/06/2017",
  "data_portaria": "2017-06-23",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt_imunossupressao-pos-transplante-hepatico.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2017/portariaconjuntasas-sctie4e5-23062017.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 37,
  "tem_texto": true,
  "cids": [
   "Z94.4",
   "T86.4"
  ],
  "farmacos": [
   {
    "nome": "azatioprina",
    "chave": "azatioprina",
    "no_rename": true,
    "id_monografia_ftn": 33
   },
   {
    "nome": "ciclosporina",
    "chave": "ciclosporina",
    "no_rename": true,
    "id_monografia_ftn": 63
   },
   {
    "nome": "everolimo",
    "chave": "everolimo",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "micofenolato de mofetila",
    "chave": "micofenolato de mofetila",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "micofenolato de sodio",
    "chave": "micofenolato de sodio",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "sodio",
    "chave": "sodio",
    "no_rename": true,
    "id_monografia_ftn": 6
   },
   {
    "nome": "prednisona",
    "chave": "prednisona",
    "no_rename": true,
    "id_monografia_ftn": 267
   },
   {
    "nome": "tacrolimo",
    "chave": "tacrolimo",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "claritromicina",
    "chave": "claritromicina",
    "no_rename": true,
    "id_monografia_ftn": 71
   },
   {
    "nome": "eritromicina",
    "chave": "eritromicina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "azitromicina",
    "chave": "azitromicina",
    "no_rename": true,
    "id_monografia_ftn": 34
   },
   {
    "nome": "fluconazol",
    "chave": "fluconazol",
    "no_rename": true,
    "id_monografia_ftn": 164
   },
   {
    "nome": "itraconazol",
    "chave": "itraconazol",
    "no_rename": true,
    "id_monografia_ftn": 206
   },
   {
    "nome": "cetoconazol",
    "chave": "cetoconazol",
    "no_rename": true,
    "id_monografia_ftn": 61
   },
   {
    "nome": "voriconazol",
    "chave": "voriconazol",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "calcio",
    "chave": "calcio",
    "no_rename": true,
    "id_monografia_ftn": 50
   },
   {
    "nome": "verapamil",
    "chave": "verapamil",
    "no_rename": true,
    "id_monografia_ftn": 124
   },
   {
    "nome": "nifedipino",
    "chave": "nifedipino",
    "no_rename": true,
    "id_monografia_ftn": 237
   },
   {
    "nome": "metoclopramida",
    "chave": "metoclopramida",
    "no_rename": true,
    "id_monografia_ftn": 108
   },
   {
    "nome": "amiodarona",
    "chave": "amiodarona",
    "no_rename": true,
    "id_monografia_ftn": 80
   },
   {
    "nome": "rifampicina",
    "chave": "rifampicina",
    "no_rename": true,
    "id_monografia_ftn": 271
   },
   {
    "nome": "carbamazepina",
    "chave": "carbamazepina",
    "no_rename": true,
    "id_monografia_ftn": 49
   },
   {
    "nome": "fenobarbital",
    "chave": "fenobarbital",
    "no_rename": true,
    "id_monografia_ftn": 160
   },
   {
    "nome": "fenitoina",
    "chave": "fenitoina",
    "no_rename": true,
    "id_monografia_ftn": 159
   },
   {
    "nome": "sirolimo",
    "chave": "sirolimo",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "mercaptopurina",
    "chave": "mercaptopurina",
    "no_rename": false,
    "id_monografia_ftn": 223
   },
   {
    "nome": "alopurinol",
    "chave": "alopurinol",
    "no_rename": true,
    "id_monografia_ftn": 19
   },
   {
    "nome": "ganciclovir",
    "chave": "ganciclovir",
    "no_rename": false,
    "id_monografia_ftn": 176
   },
   {
    "nome": "aciclovir",
    "chave": "aciclovir",
    "no_rename": true,
    "id_monografia_ftn": 8
   },
   {
    "nome": "magnesio",
    "chave": "magnesio",
    "no_rename": true,
    "id_monografia_ftn": 313
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "esquemas",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "Formas farmacêuticas x Azatioprina: comprimido de 50 mg;\nx Basiliximabe: frasco-ampola de 20 mg;\nx Ciclosporina: cápsulas de 10mg, 25mg, 50mg e 100 mg; solução oral de 100 mg/mL (frascos de 50 mL);\nx Everolimo: comprimidos de 0,5mg, 0,75 mg e 1 mg;\nx Imunoglobulina antitimócito: frasco ampola de 25 mg injetável;\nx Metilprednisolona: solução injetável de 500 mg;\nx Micofenolato de mofetila: comprimido de 500 mg;\nx Micofenolato de sódio: comprimidos de 180 mg e 360 mg;\nx Prednisona: comprimidos de 5 mg e 20 mg;\nx Prednisolona: solução oral de 3 mg/mL; e x Tacrolimo: cápsulas de 0,5mg, 1mg e 5mg.\n6.1.1 Inibidores de calcineurina (INCs) São os principais medicamentos utilizados na terapia de manutenção do transplante hepático;\nincluem a CsA e o TAC.",
   "pagina": 7,
   "completo": false
  },
  "esquemas": {
   "texto": "6.2.1. Esquema de indução A terapia dupla com corticosteroide e inibidor da calcineurina é considerada o tratamento padrão inicial no transplante hepático, com incidência de rejeição de 35%-50% e sobrevida dos pacientes de 80%-90% em 01 ano pós-transplante. No entanto, os efeitos secundários de imunossupressão exagerada (infecções oportunistas e neoplasias de novo), a gravidade da recidiva de doenças virais (como hepatite B e hepatite C) e os efeitos adversos em longo prazo (nefrotoxicidade, hipertensão arterial, DM, dislipidemia, osteoporose) determinam uma elevada morbidade e são causa frequente de mortalidade[39, 40].\nA administração de 500 mg a 1 g de metilprednisolona no intraoperatório para todos os pacientesna fase anepática é o esquema de indução mais utilizado.\nUma alternativa seria a administração de timoglobulina (ATG), principalmente nos casos de insuficiência renal em que se deseja retardar o início dos INCs. A ATG resulta em uma maior imunossupressão por acarretar uma depleção dos linfócitos T, portanto é recomendada para aprevenção da rejeição aguda do enxerto uma dose de 1 a 1,5 mg/kg/dia, durante 2 a 14 dias após o transplante hepático.\nOutra alternativa é a indução com 2 doses de 20 mg de basiliximabe, a primeira no dia zero e a segunda no quarto dia do pós-operatório. Um estudo clínico duplo-cego controlado realizado em 2002 demonstrou que a proporção de episódios de rejeição aguda em 6 e em 12 meses pós-transplante hepático foi reduzida no grupo que utilizou basiliximabe como terapia de indução[36]. Há evidências que a adição de basiliximabe à tripla imunossupressão de manutenção melhora a eficácia da terapia, reduzindo a incidência de episódios de rejeição aguda, sem aumentar os efeitos adversos[35].\nUma revisão sistemática realizada por Penninga L. et al em 2014 [41] analisou os resultados da terapia de indução com anticorpos específicos anti-células T versus a indução com corticosteroides.",
   "pagina": 11,
   "completo": false
  }
 },
 {
  "id_pcdt": 82,
  "titulo": "Imunossupressão no Transplante Hepático em Pediatria",
  "portaria": "Portaria Conjunta SAS/SCTIE/MS nº 4 - 10/01/2019",
  "data_portaria": "2019-01-14",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt_imunossupressonotransplantehepaticoempediatria.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2019/portariasconjuntas_sctie_sas_1a4_2019-1.pdf/@@display-file/file",
  "url_publicacao_ms": "https://www.gov.br/conitec/pt-br/midias/protocolos/publicacoes_ms/pcdt_imunossupresso-no-transplante-heptico-em-pediatria_-isbn.pdf/@@display-file/file",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/pcdt_resumido_imunossupresso-no-transplante-heptico-em-pediatria.pdf/@@display-file/file",
  "paginas": 79,
  "tem_texto": true,
  "cids": [
   "Z94.4",
   "T86.4"
  ],
  "farmacos": [
   {
    "nome": "azatioprina",
    "chave": "azatioprina",
    "no_rename": true,
    "id_monografia_ftn": 33
   },
   {
    "nome": "ciclosporina",
    "chave": "ciclosporina",
    "no_rename": true,
    "id_monografia_ftn": 63
   },
   {
    "nome": "everolimo",
    "chave": "everolimo",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "metilprednisolona",
    "chave": "metilprednisolona",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "micofenolato de mofetila",
    "chave": "micofenolato de mofetila",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "micofenolato de sódio",
    "chave": "micofenolato de sodio",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "predinisolona",
    "chave": "predinisolona",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "prednisona",
    "chave": "prednisona",
    "no_rename": true,
    "id_monografia_ftn": 267
   },
   {
    "nome": "sirolimo",
    "chave": "sirolimo",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "tacrolimo",
    "chave": "tacrolimo",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "inclusao",
   "cid",
   "tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 83,
  "titulo": "Imunossupressão em Transplante Renal",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 01/2021 - 05/01/2021",
  "data_portaria": "2021-01-11",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/20210113_pcdt_imunossupressao_transplante-renal.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2021/20210111_portaria_conjunta_01.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/20230313_PCDT_Resumido_Imunossupressao_TR_final.pdf/@@display-file/file",
  "paginas": 29,
  "tem_texto": true,
  "cids": [
   "Z94.0",
   "T86.1"
  ],
  "farmacos": [
   {
    "nome": "azatioprina",
    "chave": "azatioprina",
    "no_rename": true,
    "id_monografia_ftn": 33
   },
   {
    "nome": "ciclosporina",
    "chave": "ciclosporina",
    "no_rename": true,
    "id_monografia_ftn": 63
   },
   {
    "nome": "everolimo",
    "chave": "everolimo",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "imunoglobulina humana",
    "chave": "imunoglobulina humana",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "imunoglobulina antitimócitos humanos (obtida decoelho)/timoglobulina",
    "chave": "imunoglobulina antitimocitos humanos (obtida decoelho)/timoglobulina",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "metilprednisolona",
    "chave": "metilprednisolona",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "micofenolato de mofetila ou de sódio",
    "chave": "micofenolato de mofetila ou de sodio",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "prednisona",
    "chave": "prednisona",
    "no_rename": true,
    "id_monografia_ftn": 267
   },
   {
    "nome": "prednisolona",
    "chave": "prednisolona",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "tacrolimo",
    "chave": "tacrolimo",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "sirolimo",
    "chave": "sirolimo",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "medicamentos",
   "esquemas",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Ciclosporina: cápsulas de 10, 25, 50 e 100 mg; solução oral de 100 mg/mL (frascos de 50 mL); 50 mg (solução injetável).\n- Tacrolimo: cápsulas de 1 e 5 mg e solução injetável de 5 mg/mL.\n- Azatioprina: comprimido de 50 mg.\n- Prednisona: comprimidos de 5 e 20 mg.\n- Prednisolona: solução oral de 1 mg/mL e 3 mg/mL.\n- Metilprednisolona: solução injetável de 500 mg.\n- Micofenolato de mofetila: comprimido de 500 mg.\n- Micofenolato de sódio: comprimidos de 180 e 360 mg.\n- Sirolimo: drágeas de 1 e 2 mg.\n- Everolimo: comprimidos de 0,5, 0,75 e 1 mg.\n- Imunoglobulina humana: frascos de 0,5, 1,0, 2,5 e 5,0 g.\n- Basiliximabe: frasco-ampola de 20 mg.\n- Imunoglobulina antitimócitos humanos (obtida de coelho)/timoglobulina: frasco ampola de 25 mg.",
   "pagina": 11,
   "completo": true
  },
  "esquemas": {
   "texto": "Indução - Metilprednisolona: 250 a 1.000mg no intra-operatório. Em crianças, a dose é de 30mg/Kg. Doses adicionais no pósoperatório a depender do protocolo do serviço85.\n- Basiliximabe: 20mg IV no intra-operatório e 20mg IV no quarto dia de pós-operatório. Para crianças abaixo de 35 kg, preconizam-se doses de 10mg86.\n-  Imunoglobulina antitimócitos humanos (obtida de coelho)/timoglobulina: 3,0 – 7,5 mg/Kg (dose total), com administração iniciada antes, durante ou após o implante do enxerto. Não há consenso sobre a melhor forma de administrar a dose total planejada, nem quanto ao melhor momento de iniciar (pré, trans ou pós-operatório). Para minimizar eventos adversos relacionados à infusão, recomenda-se fracionar a dose total em múltiplos de 1,5-3mg/Kg e utilizar um acesso central ou uma veia periférica calibrosa87, 88.\n- Imunoglobulina humana: 2g/Kg, administrada em dose única ou fracionada (2 a 5 dias), a depender do protocolo do serviço. Para minimizar eventos adversos relacionados à infusão, preconiza-se fracionar a dose total em múltiplos de 1g/Kg ou menos89.\nManutenção - Prednisona ou prednisolona: Variável de acordo com o protocolo do serviço. Preconiza-se iniciar com 0,5 mg/Kg a 1mg/Kg/dia com desmame gradual, objetivando a dose de manutenção de 5 mg em 1 a 3 meses90.\n- Ciclosporina: A dose inicial preconizada é 3 a 6 mg/Kg a cada 12h, por via oral, ajustada a seguir de acordo com a concentração sanguínea. Uma vez que a dose depende do monitoramento terapêutico, não há recomendação para dose máxima. Monitorização terapêutica: A dose de ciclosporina deve ser ajustada regularmente para manter sua concentração no sangue total imediatamente antes [concentração residual ou de vale (C0)] ou 2 horas após (C2) a sua administração matinal dentro de faixas terapêuticas predeterminadas. |Preconiza-se que a primeira determinação seja obtida 2-3 dias após o início do tratamento. As concentrações alvo dependem do esquema e estão descritas no item “Esquemas de Imunossupressão”91.",
   "pagina": 11,
   "completo": false
  }
 },
 {
  "id_pcdt": 84,
  "titulo": "Incontinência Urinária não Neurogênica",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 01 - 09/01/2020",
  "data_portaria": "2020-01-13",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/portaria-conjunta-pcdt-incontinencia-urinaria-nn-13-01-2020.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2020/portariaconjunta_sctie_saes_01_2020.pdf/@@display-file/file",
  "url_publicacao_ms": "https://www.gov.br/conitec/pt-br/midias/protocolos/publicacoes_ms/pcdt_incontinencia-urinria-no-neurognica_final_isbn_20-08-2020.pdf/@@display-file/file",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/pcdt_resumido_incontinenciaurinaria.pdf/@@display-file/file",
  "paginas": 168,
  "tem_texto": true,
  "cids": [
   "R32",
   "N39.3",
   "N39.4"
  ],
  "farmacos": [],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 85,
  "titulo": "Insuficiência Adrenal",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 20 - 24/11/2020",
  "data_portaria": "2020-11-27",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/20210701_portaria_conjunta_pcdt_insuficencia_adrenal.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2020/20201127_portaria_conjunta_20.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/20230117_PCDT_Resumido_Insuficencia_Adrenal_final.pdf/@@display-file/file",
  "paginas": 16,
  "tem_texto": true,
  "cids": [
   "E23.0",
   "E23.3",
   "E27.1",
   "E27.2",
   "E27.3",
   "E27.4"
  ],
  "farmacos": [
   {
    "nome": "prednisona",
    "chave": "prednisona",
    "no_rename": true,
    "id_monografia_ftn": 267
   },
   {
    "nome": "fosfato sodico de prednisolona",
    "chave": "fosfato sodico de prednisolona",
    "no_rename": true,
    "id_monografia_ftn": 173
   },
   {
    "nome": "succinato sodico de hidrocortisona",
    "chave": "succinato sodico de hidrocortisona",
    "no_rename": true,
    "id_monografia_ftn": 298
   },
   {
    "nome": "hidrocortisona",
    "chave": "hidrocortisona",
    "no_rename": true,
    "id_monografia_ftn": 2
   },
   {
    "nome": "fludrocortisona",
    "chave": "fludrocortisona",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "esquemas",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "Glicocorticoides:\n- Prednisona: comprimidos de 5 e 20 mg.\n- Fosfato sódico de prednisolona: solução oral de 1 mg/mL (equivalente a 1,34 mg/mL de fosfato sódico de prednisolona e 1 mg de prednisolona base) e 3 mg/mL (equivalente a 4,02 mg/mL de fosfato sódico de prednisolona e 3 mg de prednisolona base).\n- Succinato sódico de hidrocortisona: pó para solução injetável de 100 e 500 mg.\nMineralocorticoide - Acetato de fludrocortisona: comprimido de 0,1 mg.",
   "pagina": 8,
   "completo": true
  },
  "esquemas": {
   "texto": "- Prednisona: administrada por via oral (VO), em dose única diária, ou duas vezes ao dia.\nDose inicial em crianças: 2,5-4 mg/m2/dia Dose inicial em adultos: 2,5-7,5 mg/dia\n- Fosfato sódico de prednisolona: administrada por VO, em dose única diária, ou duas vezes ao dia.\nDose inicial em crianças: 2-3 mg/m2/dia Dose inicial em adultos: 2,5-7,5 mg/dia\n- Succinato sódico de hidrocortisona: administrada por via IM ou IV Dose inicial em crianças: 12-18 mg/m2/dia divididas entre duas e quatro aplicações. Em estresse ou crise adrenal: 60- 100 mg/m2/dia.\nDose inicial em adultos: 20-30 mg/dia divididas entre duas e quatro aplicações. Em estresse ou crise adrenal: 200 mg/dia (50 mg IV 6/6h)27.\nCrise adissoniana:\n*Dose de ataque: 20 mg IV para recém-nascidos; 50 mg IV para lactentes e pré-escolares; 100 mg IV para escolares, adolescentes e adultos.\n*Dose de manutenção após a dose de ataque: 50 mg IV 6/6h27.\n- Acetato de fludrocortisona: administrada por VO, em dose única diária.\nCrianças: 0,1 mg/dia (podendo variar de 0,05-0,3 mg/dia) Adultos: 0,1 mg/dia (podendo variar de 0,05-0,4 mg/dia) A dose de manutenção é normalmente de 0,1 mg/dia.\nEm gestantes, para evitar a exposição fetal excessiva aos glicocorticoides, o tratamento é realizado preferencialmente com medicamento metabolizável pela placenta, como prednisona, prednisolona ou hidrocortisona. Devido ao aumento da necessidade de corticoide na gravidez, preconiza-se que nesse período sejam utilizadas doses mais elevadas, cerca de 7,5 mg/dia de prednisona ou prednisolona. A utilização de hidrocortisona como tratamento de manutenção é uma exceção, sendo usada apenas para pacientes sem condições de via oral. A dose IV ou IM de manutenção é de aproximadamente 20 mg/dia.\nNa indução do parto, o uso de hidrocortisona em dose de estresse deve ser considerado (200-300 mg/dia em duas a quatro aplicações ao dia)31,32.",
   "pagina": 8,
   "completo": true
  }
 },
 {
  "id_pcdt": 86,
  "titulo": "Insuficiência Cardíaca com Fração de Ejeção Reduzida (Anexo alterado em 12/11/2024)",
  "portaria": "Portaria Conjunta SAES/SECTICS/MS nº 10 - 13/09/2024",
  "data_portaria": "2024-09-26",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-de-insuficiencia-cardiaca/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2024/portaria-conjunta-saes-sectics-no-10-de-13-de-setembro-de-2024/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/PCDTResumidoInsuficinciaCardacafinal.pdf/@@display-file/file",
  "paginas": 39,
  "tem_texto": true,
  "cids": [
   "I50.0",
   "I50.1",
   "I50.9"
  ],
  "farmacos": [
   {
    "nome": "captopril",
    "chave": "captopril",
    "no_rename": true,
    "id_monografia_ftn": 48
   },
   {
    "nome": "carvedilol",
    "chave": "carvedilol",
    "no_rename": true,
    "id_monografia_ftn": 54
   },
   {
    "nome": "dapagliflozina",
    "chave": "dapagliflozina",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "digoxina",
    "chave": "digoxina",
    "no_rename": true,
    "id_monografia_ftn": 137
   },
   {
    "nome": "dinitrato de isossorbida",
    "chave": "dinitrato de isossorbida",
    "no_rename": true,
    "id_monografia_ftn": 138
   },
   {
    "nome": "enalapril",
    "chave": "enalapril",
    "no_rename": true,
    "id_monografia_ftn": 218
   },
   {
    "nome": "espironolactona",
    "chave": "espironolactona",
    "no_rename": true,
    "id_monografia_ftn": 147
   },
   {
    "nome": "furosemida",
    "chave": "furosemida",
    "no_rename": true,
    "id_monografia_ftn": 175
   },
   {
    "nome": "hidralazina",
    "chave": "hidralazina",
    "no_rename": true,
    "id_monografia_ftn": 100
   },
   {
    "nome": "hidroclorotiazida",
    "chave": "hidroclorotiazida",
    "no_rename": true,
    "id_monografia_ftn": 188
   },
   {
    "nome": "losartana",
    "chave": "losartana",
    "no_rename": true,
    "id_monografia_ftn": 216
   },
   {
    "nome": "metoprolol",
    "chave": "metoprolol",
    "no_rename": true,
    "id_monografia_ftn": 297
   },
   {
    "nome": "mononitrato de isossorbida",
    "chave": "mononitrato de isossorbida",
    "no_rename": true,
    "id_monografia_ftn": 233
   },
   {
    "nome": "sacubitril valsartana sódica hidratada",
    "chave": "sacubitril valsartana sodica hidratada",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "esquemas",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Captopril: comprimidos de 25 mg;\n- Carvedilol: comprimidos de 3,125 mg, 6,25 mg, 12,5 mg e 25 mg;\n- Cloridrato de hidralazina: comprimidos de 25 mg e 50 mg;\n- Dapagliflozina: comprimidos de 10 mg;\n- Digoxina: comprimidos de 0,25 mg;\n- Dinitrato de isossorbida: comprimido sublingual de 5 mg;\n- Espironolactona: comprimidos de 25 mg e 100 mg;\n- Furosemida: comprimidos de 40 mg;\n- Hidroclorotiazida: comprimidos de 12,5 mg e 25 mg;\n- Losartana potássica: comprimidos de 50 mg;\n- Maleato de enalapril: comprimidos de 5 mg, 10 mg e 20 mg;\n- Mononitrato de isossorbida: comprimidos de 20 e 40 mg;\n- Sacubitril valsartana sódica hidratada: comprimidos de 50, 100 e 200 mg; e\n- Succinato de metoprolol: comprimidos de liberação prolongada de 25 mg, 50 mg e 100 mg.",
   "pagina": 15,
   "completo": true
  },
  "esquemas": {
   "texto": "Os esquemas de administração segundo classe farmacêutica, dose inicial e dose-alvo estão representados no quadro a seguir4–6.\nQuadro 5 - Esquemas de administração.\nClasse farmacêutica Fármacos Dose inicial Dose-alvo Antagonista de aldosterona Espironolactona (25 e 100 mg) 12,5-25 mg, 1 x ao dia 25-50 mg, 1 x ao dia Antagonista de receptor de angiotensina II Losartana potássica (50 mg) 25 mg, 1 x ao dia 150 mg ao dia (dose única ou dividida em 2 vezes ao dia) Betabloqueadores Succinato de metoprolol (25, 50 e 100 mg) 12,5-25 mg, 1 x ao dia 200 mg, 1 x ao dia Carvedilol (3,125, 6,25, 12,5 e 25 mg) 3,125 mg, 2 x ao dia 25 mg, 2 x ao dia Digitálico Digoxina (0,25 mg) 0,125 mg em dias alternados a 0,25 mg, 1 x ao dia Dosagem de nível sérico pode auxiliar no ajuste Diurético de alça * Furosemida (40 mg) 20-40 mg 1x ao dia 40-240 mg (dose usual) Diurético tiazídico Hidroclorotiazida (12,5 e 25 mg) 25 mg 1x ao dia 12,5-100 mg (dose usual) Inibidores da enzima conversora de angiotensina Maleato de enalapril (5, 10 e 20 mg) 2,5 mg, 2 x ao dia 10-20 mg, 2 x ao dia Captopril (25 mg) 6,25 mg, 3 x ao dia 50 mg, 3 x ao dia Inibidores da neprilisina e dos receptores da angiotensina Sacubitril valsartana sódica hidratada (50, 100 e 200 mg) 50 mg, 2x ao dia.\n200 mg, 2x ao dia.\nInibidor da SGLT2 Dapagliflozina (10 mg) 10 mg 1 x ao dia 10 mg 1 x ao dia Nitratos Dinitrato de isossorbida (5 mg) Mononitrato de isossorbida (20 e 40 mg) 10-20 mg, 3 x ao dia 40 mg, 3 x ao dia Vasodilatador Hidralazina (25 e 50 mg) 12,5-25 mg, 3 x ao dia 50-100 mg, 3 x ao dia * As doses são ajustadas de acordo com a presença de congestão. São utilizados inicialmente 1 vez ao dia, podendo-se utilizar 2-3 vezes ao dia.\nSGLT2: Sodium Glucose cotransporter 2 (cotransportador de sódio e glicose 2).",
   "pagina": 15,
   "completo": true
  }
 },
 {
  "id_pcdt": 87,
  "titulo": "Insuficiência Pancreática Exócrina",
  "portaria": "Portaria SAS/MS nº 112 - 04/02/2016",
  "data_portaria": "2016-02-05",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt_insuficienciapancreaticaexocrina-fev2016.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2016/portaria-no-112-de-4-de-fevereiro-de-2015/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 13,
  "tem_texto": true,
  "cids": [
   "K86.0",
   "K86.1",
   "K90.3"
  ],
  "farmacos": [
   {
    "nome": "pancreatina",
    "chave": "pancreatina",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "esquemas",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Pancreatina: cápsulas de 10.000 e 25.000 unidades internacionais (UI) de lipase A dose em UI é baseada na quantidade de lipase presente na formulação.",
   "pagina": 8,
   "completo": true
  },
  "esquemas": {
   "texto": "Pancreatina: 10.000 UI a 50.000 UI nas três principais refeições; e 10.000 UI a 25.000 UI em duas refeições adicionais.\nRecomenda-se iniciar com uma dose de lipase de 10.000 UI por refeição e titular de acordo com a resposta terapêutica, avaliada pela melhora dos sintomas, até uma dose de",
   "pagina": 8,
   "completo": true
  }
 },
 {
  "id_pcdt": 88,
  "titulo": "Leiomioma de útero",
  "portaria": "Portaria Conjunta SAS/SCTIE/MS nº 11 - 31/10/2017",
  "data_portaria": "2017-11-09",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-leiomioma_31_10_2017.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/legislacao/portaria_conjunta_no_102017_de_09112017.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 30,
  "tem_texto": true,
  "cids": [
   "D25.0",
   "D25.1",
   "D25.2"
  ],
  "farmacos": [
   {
    "nome": "gosserrelina",
    "chave": "gosserrelina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "leuprorrelina",
    "chave": "leuprorrelina",
    "no_rename": true,
    "id_monografia_ftn": 3
   },
   {
    "nome": "triptorrelina",
    "chave": "triptorrelina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "acetato de medroxiprogesterona",
    "chave": "medroxiprogesterona",
    "no_rename": true,
    "id_monografia_ftn": 4
   },
   {
    "nome": "estrogênios conjugados",
    "chave": "estrogenios conjugados",
    "no_rename": true,
    "id_monografia_ftn": 151
   },
   {
    "nome": "sulfato ferroso",
    "chave": "sulfato ferroso",
    "no_rename": true,
    "id_monografia_ftn": 319
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "medicamentos",
   "esquemas",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Gosserrelina: seringa preenchida de 3,6 e 10,8 mg injetável;\n- Leuprorrelina: frasco-ampola de 3,75 e 11,25 mg injetável;\n- Triptorrelina: 3,75 e 11,25 mg injetável (por frasco-ampola);\n- Acetato de medroxiprogesterona: comprimido de 10 mg;\n- Estrogênios conjugados: comprimido de 0,3 mg;\n- Sulfato ferroso: comprimido de 40mg, solução oral de 25 mg/mL.",
   "pagina": 9,
   "completo": true
  },
  "esquemas": {
   "texto": "- Gosserrelina: 3,6mg, por via subcutânea, injetados no abdômen, mensalmente, ou 10,8mg por esta mesma via, trimestralmente.\n- Leuprorrelina: 3,75mg, por via intramuscular, mensalmente, ou 11,25mg por esta mesma via, trimestralmente.\n- Triptorrelina: 3,75mg, por via intramuscular, mensalmente, ou 11,25mg por esta mesma via, trimestralmente.\n- Acetato de medroxiprogesterona: 2,5 mg a 10 mg por dia, por via oral, durante o uso do análogo.\n- Estrogênios conjugados: 0,3 mg a 0,6 mg, ao dia, por via oral, durante o uso do análogo.\n- Sulfato ferroso: 120mg ao dia de ferro elementar, por via oral, preferencialmente afastado das refeições.",
   "pagina": 9,
   "completo": true
  }
 },
 {
  "id_pcdt": 142,
  "titulo": "Leucemia Mieloide Crônica do Adulto",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 95 - 20/10/2026",
  "data_portaria": "2026-10-28",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/2026/pcdt_leucemia-mieloide-cronica-do-adulto.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2026/portaria-conjunta-saes-sctie-no-95-de-20-de-outubro-de-2026.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 38,
  "tem_texto": true,
  "cids": [],
  "farmacos": [
   {
    "nome": "hidroxiureia",
    "chave": "hidroxiureia",
    "no_rename": true,
    "id_monografia_ftn": 190
   }
  ],
  "secoes_disponiveis": [
   "medicamentos",
   "esquemas",
   "criterios_interrupcao"
  ],
  "medicamentos": {
   "texto": "- Alfa-interferona: pó para solução injetável com 5 milhões UI;\n- Asciminibe: comprimido revestido de 20 mg e 40 mg;\n- Dasatinibe: comprimido revestido de 20 mg e 100 mg;\n- Hidroxiureia: cápsula de 500 mg;\n- Mesilato de imatinibe: comprimido revestido de 100 mg e 400 mg;\n- Nilotinibe: cápsula de 200 mg;\n- Ponatinibe: comprimido de 15 mg e 45 mg.",
   "pagina": 16,
   "completo": true
  },
  "esquemas": {
   "texto": "- Mesilato de Imatinibe: 400 mg uma vez ao dia, por via oral (VO), para tratamento da LMC-FC; 600 mg/dia, VO, para tratamento da LMC-FA; 800 mg/dia, VO, para tratamento da LMC-FB. O medicamento deve ser tomado com água logo após a maior refeição do dia24.\n- Nilotinibe: 800 mg/dia, VO, divididas em duas doses de 400 mg para tratamento da LMC-FC; 140 mg/dia, VO, para tratamento da LMC-FA ou da LMC-FB. Na crise blástica, essa dose pode ser elevada até 180 mg/dia. O medicamento deve ser tomado com água pelo menos duas horas após ter ingerido algum alimento, esperando pelo menos uma hora para ingerir novamente algum alimento26.\n- Dasatinibe: 100 mg, VO, uma vez ao dia para tratamento da LMC-FC; 140 mg/dia, VO, para tratamento da LMC-FA e LMC-FB. Na crise blástica, essa dose pode ser elevada até 180 mg/dia. O medicamento pode ser ingerido em jejum ou com alimentos25.\n- Ponatinibe: 15 a 45 mg, VO, uma vez ao dia. O medicamento pode ser ingerido em jejum ou com alimentos28. Os comprimidos devem ser engolidos inteiros, eles não devem ser mastigados ou dissolvidos ou triturados ou partidos28.\n- Asciminibe: 80 mg, VO uma vez ao dia, no mesmo horário, ou 40 mg duas vezes ao dia em intervalos de 12 horas. O medicamento deve ser administrado pelo menos 2 horas após qualquer alimento e 1 hora antes de ingerir alimentos. Os comprimidos devem ser engolidos inteiros, eles não devem ser quebrados, esmagados ou mastigados.32 - Hidroxiureia: 20 a 30 mg/kg/dia uma vez ao dia51.\n- Alfa-interferona: 5 milhões UI. O pó liofilizado deve ser reconstituído com 1 mL de água para injeção estéril e apirogênica. O produto deve ser administrado imediatamente após a reconstituição por via intramuscular ou subcutânea. As vias intravenosa, intratecal e intraperitoneal pressupõem a administração por profissional de saúde treinado52.\nNota: No caso de o efeito terapêutico do ITQ ter feito regredir a fase leucêmica para uma anterior (de LMC-FB para LMC-FA ou LMC-FC; de LMC-FA para LMC-FC), não se modifica nem o medicamento nem a dose já em uso.",
   "pagina": 17,
   "completo": true
  }
 },
 {
  "id_pcdt": 90,
  "titulo": "Leucemia Mieloide Crônica - Crianças e Adolescentes",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 10 - 02/07/2021",
  "data_portaria": "2021-07-06",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/20210707_portaria_conjunta_pcdt_lmc_pediatria.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2021/20210706_portaria_conjunta_10.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/20221116_pcdt_resumido_lmc_pediatria.pdf/@@display-file/file",
  "paginas": 49,
  "tem_texto": true,
  "cids": [
   "C92.1"
  ],
  "farmacos": [
   {
    "nome": "mesilato de imatinibe",
    "chave": "imatinibe",
    "no_rename": false,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "esquemas",
   "criterios_interrupcao",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "A hidroxiureia deve ser utilizada somente para reduzir o número de leucócitos, enquanto se aguardam os resultados dos exames que confirmem o diagnóstico de LMC2,3.\nO imatinibe só deve ser iniciado com leucometria reduzida previamente com hidroxiureia, pois, pela experiência acumulada com seu uso por pacientes de todas as faixas etárias, a hidroxiureia é muito eficaz para uma redução imediata da hiperleucocitose, devendo-se iniciar o imatinibe com a leucometria em torno de 20.000/mm3.\nApós controle hematológico, com o uso da hidroxiureia, por via oral, na dose de 30 a 40mg/kg/dia, com ajustes da dose de acordo com a redução da leucometria global para aproximadamente 20.000/mm3, indica-se o mesilato de imatinibe como primeira linha de tratamento da LMC em qualquer de suas fases ao diagnóstico:\nSão preconizadas as seguintes posologias do mesilato de imatinibe23:\na) LMC-FC: 260 a 300 mg/m2 (com arredondamento de dose para a centena mais próxima e dose máxima diária de 400 mg), por via oral, 1 vez ao dia e após a maior refeição do dia.\nb) LMC-FT: 300 a 340 mg/m2 (com arredondamento de dose para a centena mais próxima e dose máxima diária de 600 mg), por via oral, 1 vez ao dia e após a maior refeição do dia.\nc) LMC-FB: 340 mg/m2 (dose máxima 600 mg) associado ao esquema poliquimioterápico adotado no hospital de acordo com a linhagem celular agudizada (linfoide ou mieloide).\nO comprimido de mesilato de imatinibe pode ser dissolvido em água ou suco de maçã, usando 50 ml do líquido para 100 mg do comprimido ou 200 ml do líquido para 400 mg do comprimido. O resíduo do copo deve ser diluído e ingerido imediatamente. Para crianças com menos de 3 anos, deve-se oferecer, pelo menos, 120 ml de água ou alimento, para evitar irritação esofágica23.",
   "pagina": 6,
   "completo": true
  }
 },
 {
  "id_pcdt": 91,
  "titulo": "Linfangioleiomiomatose",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 13 - 12/08/2021",
  "data_portaria": "2021-08-20",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/20210820_portaria_conjunta_n13_pcdt_lam.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2021/20210820_portaria_conjunta_13.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/pcdt_resumido_linfangioleiomiomatose_lam.pdf/@@display-file/file",
  "paginas": 9,
  "tem_texto": true,
  "cids": [
   "J84.8"
  ],
  "farmacos": [
   {
    "nome": "sirolimo",
    "chave": "sirolimo",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "medicamentos",
   "esquemas",
   "criterios_interrupcao",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Sirolimo: drágeas de 1 mg e 2 mg.",
   "pagina": 5,
   "completo": true
  },
  "esquemas": {
   "texto": "A dose inicial de sirolimo deve ser de 2 mg/dia. As concentrações de sirolimo no sangue total devem ser medidas em intervalos de 10 a 20 dias, com ajuste de dose para a manutenção das concentrações séricas entre 5 -15 ng/mL. Na maioria dos pacientes, os ajustes de dose podem ser baseados na simples proporção: nova dose de sirolimo = dose atual x (concentração alvo/concentração atual). Frequentes ajustes de dose de sirolimo com base em seus níveis séricos e no estado de não equilíbrio podem levar à superdose ou subdose, já que esse medicamento possui meia-vida longa10.\nUma vez que a dose de manutenção de sirolimo tenha sido ajustada, os pacientes devem continuar na nova dose de manutenção por, pelo menos, 7 a 14 dias antes de um novo ajuste de dose com o monitoramento da concentração. Quando a dose estável for alcançada, a monitorização terapêutica deve ser realizada, pelo menos, a cada três meses10.",
   "pagina": 5,
   "completo": true
  }
 },
 {
  "id_pcdt": 92,
  "titulo": "Linfoma Difuso de Grandes Células B",
  "portaria": "Portaria SAS/MS nº 956 - 26/09/2014",
  "data_portaria": "2014-09-29",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/artigos_publicacoes/ddt_linfomadifusob_26092014.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2014/portaria_sas_956_2014.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 20,
  "tem_texto": true,
  "cids": [],
  "farmacos": [],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "monitoramento",
   "criterios_interrupcao"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 93,
  "titulo": "Linfoma de Hodgkin no adulto",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 91 - 20/10/2026",
  "data_portaria": "2026-10-28",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/2026/pcdt-do-linfoma-de-hodgkin-no-adulto.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2026/portaria-conjunta-saes-sctie-no-91-de-20-de-outubro-de-2026.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 44,
  "tem_texto": true,
  "cids": [
   "C81.0",
   "C81.1",
   "C81.2",
   "C81.3",
   "C81.7",
   "C81.9"
  ],
  "farmacos": [
   {
    "nome": "doxorrubicina",
    "chave": "doxorrubicina",
    "no_rename": false,
    "id_monografia_ftn": 95
   },
   {
    "nome": "bleomicina",
    "chave": "bleomicina",
    "no_rename": false,
    "id_monografia_ftn": 309
   },
   {
    "nome": "vimblastina",
    "chave": "vimblastina",
    "no_rename": false,
    "id_monografia_ftn": 316
   },
   {
    "nome": "dacarbazina",
    "chave": "dacarbazina",
    "no_rename": false,
    "id_monografia_ftn": 125
   },
   {
    "nome": "etoposideo",
    "chave": "etoposideo",
    "no_rename": false,
    "id_monografia_ftn": 154
   },
   {
    "nome": "ciclofosfamida",
    "chave": "ciclofosfamida",
    "no_rename": true,
    "id_monografia_ftn": 62
   },
   {
    "nome": "vincristina",
    "chave": "vincristina",
    "no_rename": false,
    "id_monografia_ftn": 317
   },
   {
    "nome": "prednisona",
    "chave": "prednisona",
    "no_rename": true,
    "id_monografia_ftn": 267
   },
   {
    "nome": "dexametasona",
    "chave": "dexametasona",
    "no_rename": true,
    "id_monografia_ftn": 129
   },
   {
    "nome": "ifosfamida",
    "chave": "ifosfamida",
    "no_rename": false,
    "id_monografia_ftn": 194
   },
   {
    "nome": "carboplatina",
    "chave": "carboplatina",
    "no_rename": false,
    "id_monografia_ftn": 52
   },
   {
    "nome": "citarabina",
    "chave": "citarabina",
    "no_rename": false,
    "id_monografia_ftn": 66
   },
   {
    "nome": "cisplatina",
    "chave": "cisplatina",
    "no_rename": false,
    "id_monografia_ftn": 65
   },
   {
    "nome": "gencitabina",
    "chave": "gencitabina",
    "no_rename": false,
    "id_monografia_ftn": 99
   },
   {
    "nome": "oxaliplatina",
    "chave": "oxaliplatina",
    "no_rename": false,
    "id_monografia_ftn": 249
   },
   {
    "nome": "ritonavir",
    "chave": "ritonavir",
    "no_rename": true,
    "id_monografia_ftn": 274
   },
   {
    "nome": "raltegravir",
    "chave": "raltegravir",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "dolutegravir",
    "chave": "dolutegravir",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "filgrastim",
    "chave": "filgrastim",
    "no_rename": true,
    "id_monografia_ftn": 162
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 94,
  "titulo": "Lipofuscinose Ceroide Neuronal tipo 2",
  "portaria": "Portaria Conjunta SAES/SECTICS/MS nº8 - 26/06/2023",
  "data_portaria": "2023-07-04",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/portariaconjuntano8pcdtlipofuscinoseceroideneuronaltipo2.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2023/20230704_portaria_conjunta08.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/PCDTResumidolipofuscinoseCLN2.pdf/@@display-file/file",
  "paginas": 21,
  "tem_texto": true,
  "cids": [
   "E75.4"
  ],
  "farmacos": [
   {
    "nome": "alfacerliponase",
    "chave": "alfacerliponase",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "medicamentos",
   "esquemas",
   "criterios_interrupcao",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Alfacerliponase: solução para perfusão contendo 30 mg/mL.",
   "pagina": 8,
   "completo": true
  },
  "esquemas": {
   "texto": "A dose preconizada é de 300 mg de alfacerliponase administrada a cada duas semanas, por via intracerebroventricular.\nNo entanto, crianças menores de 2 anos devem utilizar as doses descritas no Quadro 2.\nQuadro 2 - Doses preconizadas em crianças até 2 anos de idade.\nFaixas etárias Dose total administrada a cada 2 semanas (mg) Volume da solução de Alfacerliponase (mL) Nascimento até < 6 meses 100 3,3 6 meses até < 1 ano 150 5 1 ano até < 2 anos 200 (primeiras 4 doses) 300 (doses subsequentes) 6,7 (primeiras 4 doses) 10 (doses subsequentes) 2 anos ou mais 300 10 Fonte: BIOMARIM, 202221.\nA velocidade da infusão e da solução de lavagem é de 2,5 mL/hora e a duração completa da infusão é de aproximadamente 2 a 4,5 horas, dependendo da dose e do volume administrados, devendo ser feita em ambiente hospitalar ou ambulatorial. É preconizado pré-tratamento dos pacientes com anti-histamínicos, com ou sem antipiréticos, 30 a 60 minutos antes da infusão. Os sinais vitais devem ser monitorados antes do início da infusão e, periodicamente, durante e após a infusão por pelo menos uma hora21.\nO medicamento alfacerliponase é administrado no líquido cefalorraquidiano (LCR) por perfusão por meio de um reservatório e um cateter implantados cirurgicamente (dispositivo de acesso intracerebroventricular). Esse dispositivo deve ser Suspeita diagnóstica a partir de sinais e sintomas de CLN2 Atividade deficiente da enzima tripeptidil peptidase 1 (TPP1) (no plasma/leucócitos/fibroblastos) Variantes patogênicas, provavelmente patogênicas ou de significado incerto (VUS) bialélicas identificadas no gene Tratamento de Suporte Diagnóstico Iniciar TRE com alfacerliponase Algum critério de exclusão para TRE?\nSim Não Tratamento implantado antes da primeira perfusão e deve ser adequado para aceder aos ventrículos cerebrais, com vista à administração terapêutica21.",
   "pagina": 8,
   "completo": true
  }
 },
 {
  "id_pcdt": 95,
  "titulo": "Linfoma Folicular",
  "portaria": "Portaria SAES/SCTIE/MS nº 99 - 20/10/2026",
  "data_portaria": "2026-10-28",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/2026/pcdt_linfoma-folicular.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2026/portaria-conjunta-saes-sctie-no-99-de-20-de-outubro-de-2026.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 95,
  "tem_texto": true,
  "cids": [
   "C82.0",
   "C82.1",
   "C82.2",
   "C82.3",
   "C82.7",
   "C82.9",
   "C82.4"
  ],
  "farmacos": [
   {
    "nome": "rituximabe",
    "chave": "rituximabe",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "ciclofosfamida",
    "chave": "ciclofosfamida",
    "no_rename": true,
    "id_monografia_ftn": 62
   },
   {
    "nome": "doxorrubicina",
    "chave": "doxorrubicina",
    "no_rename": false,
    "id_monografia_ftn": 95
   },
   {
    "nome": "vincristina",
    "chave": "vincristina",
    "no_rename": false,
    "id_monografia_ftn": 317
   },
   {
    "nome": "prednisona",
    "chave": "prednisona",
    "no_rename": true,
    "id_monografia_ftn": 267
   },
   {
    "nome": "ifosfamida",
    "chave": "ifosfamida",
    "no_rename": false,
    "id_monografia_ftn": 194
   },
   {
    "nome": "carboplatina",
    "chave": "carboplatina",
    "no_rename": false,
    "id_monografia_ftn": 52
   },
   {
    "nome": "etoposideo",
    "chave": "etoposideo",
    "no_rename": false,
    "id_monografia_ftn": 154
   },
   {
    "nome": "dexametasona",
    "chave": "dexametasona",
    "no_rename": true,
    "id_monografia_ftn": 129
   },
   {
    "nome": "citarabina",
    "chave": "citarabina",
    "no_rename": false,
    "id_monografia_ftn": 66
   },
   {
    "nome": "cisplatina",
    "chave": "cisplatina",
    "no_rename": false,
    "id_monografia_ftn": 65
   },
   {
    "nome": "gencitabina",
    "chave": "gencitabina",
    "no_rename": false,
    "id_monografia_ftn": 99
   },
   {
    "nome": "oxaliplatina",
    "chave": "oxaliplatina",
    "no_rename": false,
    "id_monografia_ftn": 249
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 96,
  "titulo": "Lúpus Eritematoso Sistêmico",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº21 - 01/11/2022",
  "data_portaria": "2022-11-07",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/20221109_pcdt_lupus.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2022/20221109_portaria_conjunta_n21.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/PCDT_Resumido_Lupus_ES_final.pdf/@@display-file/file",
  "paginas": 95,
  "tem_texto": true,
  "cids": [
   "L93.0",
   "L93.1",
   "M32.1",
   "M32.8"
  ],
  "farmacos": [
   {
    "nome": "azatioprina",
    "chave": "azatioprina",
    "no_rename": true,
    "id_monografia_ftn": 33
   },
   {
    "nome": "betametasona",
    "chave": "betametasona",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "ciclofosfamida",
    "chave": "ciclofosfamida",
    "no_rename": true,
    "id_monografia_ftn": 62
   },
   {
    "nome": "ciclosporina",
    "chave": "ciclosporina",
    "no_rename": true,
    "id_monografia_ftn": 63
   },
   {
    "nome": "cloroquina",
    "chave": "cloroquina",
    "no_rename": false,
    "id_monografia_ftn": 135
   },
   {
    "nome": "danazol",
    "chave": "danazol",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "dexametasona",
    "chave": "dexametasona",
    "no_rename": true,
    "id_monografia_ftn": 129
   },
   {
    "nome": "hidroxicloroquina",
    "chave": "hidroxicloroquina",
    "no_rename": true,
    "id_monografia_ftn": 312
   },
   {
    "nome": "metilprednisolona",
    "chave": "metilprednisolona",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "metotrexato",
    "chave": "metotrexato",
    "no_rename": true,
    "id_monografia_ftn": 229
   },
   {
    "nome": "micofenolato de mofetila",
    "chave": "micofenolato de mofetila",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "prednisona",
    "chave": "prednisona",
    "no_rename": true,
    "id_monografia_ftn": 267
   },
   {
    "nome": "talidomida",
    "chave": "talidomida",
    "no_rename": true,
    "id_monografia_ftn": 320
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "medicamentos",
   "esquemas",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Acetato de betametasona + fosfato dissódico de betametasona: suspensão injetável de (3 mg +3 mg)/mL;\n- Azatioprina: comprimidos de 50 mg;\n- Ciclofosfamida: comprimidos de 50 mg e pó para solução injetável de 200 e 1.000 mg;\n- Ciclosporina: cápsulas de 10, 25, 50, 100 mg e solução oral de 100 mg/mL – frasco de 50 mL;\n- Cloroquina: comprimidos de 150 mg;\n- Danazol: cápsulas de 100 ou 200 mg;\n- Dexametasona: comprimidos de 4 mg;\n- Hidroxicloroquina: comprimidos de 400 mg;\n- Metilprednisolona: pó para solução injetável de 500 mg;\n- Metotrexato: comprimidos de 2,5 mg e solução injetável de 25 mg/mL;\n- Micofenolato de mofetila: comprimidos de 500 mg;\n- Prednisona: comprimidos de 5 ou 20 mg;\n- Talidomida: comprimido de 100 mg.",
   "pagina": 15,
   "completo": true
  },
  "esquemas": {
   "texto": "- Azatioprina: dose inicial de 0,5 a 1 mg/kg/dia, por via oral, aumentando 0,5 mg/kg a cada 4 semanas até atingir o controle da atividade da doença, que é evidenciado por resolução das alterações clínicas e laboratoriais apresentadas pelo paciente. A dose máxima não deve ultrapassar 3 mg/kg/dia.\n- Ciclofosfamida: 1-3 mg/kg/dia, por via oral, 1 vez/dia, ou infusão de 0,5-1,0 g/m2 por via intravenosa a cada 4 semanas.\nPara prevenir cistite hemorrágica, recomenda-se a administração de mesna por via intravenosa ou oral (1 mg para cada 1 mg de ciclofosfamida) dividida em 4 administrações: 30 minutos antes da infusão e 2, 4 e 6 horas após o término da infusão. Sugere-se administração de 1.000 mL de cloreto de sódio (soro fisiológico) 0,9%, por via intravenosa, 1 hora antes da infusão, bem como o uso de diuréticos. Hidratação oral deve ser estimulada ao longo do tratamento com ciclofosfamida.\n- Ciclosporina: doses de até 5 mg/kg/dia, divididas em 2 administrações, por via oral.\n- Cloroquina: 2-3 mg/kg/dia, por via oral.\n- Danazol: dose inicial de 100 mg, 2 vezes/dia, por via oral, durante 30 dias, aumentando progressivamente até 400 mg, 2 vezes/dia. Quando a dose terapêutica for alcançada, manter o danazol por mais 30 dias e iniciar a retirada de glicocorticoide.\nQuando a dose de glicocorticoide atingir 10 mg/dia e as plaquetas estiverem em níveis adequados (acima de 100.000/mm3) durante 2 meses consecutivos, iniciar a redução da dose de danazol até 100 mg/dia. Esta dose pode ser mantida por 2 a 3 anos de acordo com a evolução clínica.\n- Hidroxicloroquina: 5 mg/kg/dia, por via oral.\n- Metilprednisolona: pulsoterapia de 250-1.000 mg/dia ou 15-20 mg/kg/dia, por via intravenosa, ao longo de 1 hora por 3 dias consecutivos; repetir mensalmente conforme resposta terapêutica.\n- Metotrexato: dose inicial de 10 mg/semana, por via oral ou intramuscular, podendo ser aumentada para até 25 mg/semana.\n- Micofenonato de mofetila: na fase de indução, a dose preconizada é 2 a 3 g/dia, por via oral, dividida em 2 administrações diárias. Na fase de manutenção, de acordo com a resposta clínica e laboratorial, a dose pode ser diminuída para 1 a 2 g/dia, de maneira lenta e gradual. A retirada gradual do tratamento poderá ser tentada após pelo menos 3 a 5 anos de tratamento em resposta clínica completa.",
   "pagina": 16,
   "completo": false
  }
 },
 {
  "id_pcdt": 97,
  "titulo": "Manejo da infecção pelo HIV em crianças e adolescentes",
  "portaria": "Portaria SCTIE/MS nº 31 - 01/09/2017",
  "data_portaria": "2017-09-05",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt_criancaeadolescente_09_2017-1.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2017/portariasctie_31_05-09-2017.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 220,
  "tem_texto": true,
  "cids": [],
  "farmacos": [],
  "secoes_disponiveis": [],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 143,
  "titulo": "Manejo da Infecção pelo HIV em Crianças e Adolescentes - Módulo 2 - Diagnóstico, Manejo e Tratamento de Crianças e Adolescentes Vivendo com HIV",
  "portaria": "Portaria SECTICS/MS nº 75 - 28/12/2023",
  "data_portaria": "2023-12-29",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/protocolo-clinico-e-diretrizes-terapeuticas-para-manejo-da-infeccao-pelo-hiv-em-criancas-e-adolescentes-modulo-2-diagnostico-manejo-e-tratamento-de-criancas-e-adolescentes-vivendo-com-hiv.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/2023/portaria-sectics-ms-no-75.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "http://PCDTResumidoHIVCrianasAdolescentesModulo2",
  "paginas": 75,
  "tem_texto": true,
  "cids": [],
  "farmacos": [],
  "secoes_disponiveis": [],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 144,
  "titulo": "Manejo da Infecção pelo HIV em Crianças e Adolescentes - Módulo 1 - Diagnóstico, Manejo e Acompanhamento de Crianças Expostas ao HIV",
  "portaria": "Portaria SECTICS/MS nº 76 - 28/12/2023",
  "data_portaria": "2023-12-29",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/protocolo-clinico-e-diretrizes-terapeuticas-para-manejo-da-infeccao-pelo-hiv-em-criancas-e-adolescentes-modulo-1-diagnostico-manejo-e-acompanhamento-de-criancas-expostas-ao-hiv.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/2023/portaria-sectics-ms-no-76.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 42,
  "tem_texto": true,
  "cids": [],
  "farmacos": [],
  "secoes_disponiveis": [],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 100,
  "titulo": "Manejo da infecção pelo HIV em adultos",
  "portaria": "Portaria SCTIE/MS nº 52 - 23/11/2017",
  "data_portaria": "2017-11-27",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt_manejo_hiv_adulto-1.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/legislacao/portarias_48-50-51-52-53.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 412,
  "tem_texto": true,
  "cids": [],
  "farmacos": [],
  "secoes_disponiveis": [],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 101,
  "titulo": "Manejo da Infecção pelo HIV em Adultos: Módulo 1 - Tratamento",
  "portaria": "Portaria SECTICS/MS nº 56 - 18/10/2023",
  "data_portaria": "2023-10-20",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/PCDTManejodaInfecopeloHIVemAdultosMdulo1Tratamento.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2023/portaria-sectics-ms-no-56/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 82,
  "tem_texto": true,
  "cids": [],
  "farmacos": [],
  "secoes_disponiveis": [],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 102,
  "titulo": "Manejo da Infecção pelo HIV em Adultos: Módulo 2 - Coinfecções e Infecções Oportunistas",
  "portaria": "Portaria SECTICS/MS nº 57 - 18/10/2023",
  "data_portaria": "2023-10-20",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/PCDTManejodaInfecopeloHIVemAdultosMdulo2Coinfeces.docx.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2023/PORTARIASECTICSMSN57.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 91,
  "tem_texto": true,
  "cids": [],
  "farmacos": [],
  "secoes_disponiveis": [],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 103,
  "titulo": "Melanoma Cutâneo",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 93 - 20/10/2026",
  "data_portaria": "2026-10-28",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/2026/pcdt-melanoma-cutaneo.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2026/portaria-conjunta-saes-sctie-no-93-de-20-de-outubro-de-2026.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 39,
  "tem_texto": true,
  "cids": [
   "C43",
   "C43.0",
   "C43.1",
   "C43.2",
   "C43.3",
   "C43.4",
   "C43.5",
   "C43.6",
   "C43.7",
   "C43.8",
   "C43.9",
   "D03",
   "D03.0",
   "D03.2",
   "D03.3",
   "D03.4",
   "D03.5",
   "D03.6",
   "D03.7",
   "D03.8",
   "D03.9"
  ],
  "farmacos": [
   {
    "nome": "dacarbazina",
    "chave": "dacarbazina",
    "no_rename": false,
    "id_monografia_ftn": 125
   },
   {
    "nome": "cisplatina",
    "chave": "cisplatina",
    "no_rename": false,
    "id_monografia_ftn": 65
   },
   {
    "nome": "vimblastina",
    "chave": "vimblastina",
    "no_rename": false,
    "id_monografia_ftn": 316
   },
   {
    "nome": "carboplatina",
    "chave": "carboplatina",
    "no_rename": false,
    "id_monografia_ftn": 52
   },
   {
    "nome": "paclitaxel",
    "chave": "paclitaxel",
    "no_rename": false,
    "id_monografia_ftn": 253
   },
   {
    "nome": "prednisona",
    "chave": "prednisona",
    "no_rename": true,
    "id_monografia_ftn": 267
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 104,
  "titulo": "Miastenia Gravis",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 11 - 23/05/2022",
  "data_portaria": "2022-05-27",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/copy_of_20220530_PORTAL_PCDT_Miastenia_Gravis.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2022/20220527_portaria_conjunta_11.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/20220705_PCDT_Resumido_MIastenia_Gravis_final.pdf/@@display-file/file",
  "paginas": 26,
  "tem_texto": true,
  "cids": [
   "G70.0",
   "G70.2"
  ],
  "farmacos": [
   {
    "nome": "azatioprina",
    "chave": "azatioprina",
    "no_rename": true,
    "id_monografia_ftn": 33
   },
   {
    "nome": "ciclofosfamida",
    "chave": "ciclofosfamida",
    "no_rename": true,
    "id_monografia_ftn": 62
   },
   {
    "nome": "ciclosporina",
    "chave": "ciclosporina",
    "no_rename": true,
    "id_monografia_ftn": 63
   },
   {
    "nome": "imunoglobulina",
    "chave": "imunoglobulina",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "piridostigmina",
    "chave": "piridostigmina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "prednisona",
    "chave": "prednisona",
    "no_rename": true,
    "id_monografia_ftn": 267
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "esquemas",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "- Piridostigmina: Inicia-se a piridostigmina em adultos na dose de 30-60 mg via oral a cada 6 horas; em crianças a dose inicial é de 1,0 mg/kg. A dose é gradualmente ajustada, se necessário, à medida que houver o controle dos sintomas miastênicos e a redução dos eventos adversos. A maioria dos adultos requer 60-120 mg a cada 4-6 horas; dose máxima de 720 mg/dia, por risco de crise colinérgica.\n- Prednisona: Iniciar com doses baixas (15-20 mg/dia), com aumento gradual até a dose máxima de 1mg/kg/dia.  Pode-se optar por iniciar com a dose de 1 mg/kg/dia, no entanto deve-se atentar para uma possibilidade de piora clínica transitória, inclusive desencadeando Crise Miastênica.  Por esta razão, muitos neurologistas iniciam o medicamento em dias alternados, com dose inicial de 10 mg, com aumento gradual de 10 mg a cada três dias, até 0,75 mg/kg para a forma ocular, ou até 100 mg ou 1,5 mg/kg/em dias alternados, para a forma generalizada. Após melhora máxima, inicia-se tentativa de redução gradual da dose da prednisona, podendo ser necessária a associação de imunossupressores, que tem como objetivo principal a diminuição da dose de prednisona.\n- Azatioprina: em adultos, iniciar com dose de 50 mg/dia, por via oral, com aumento gradual até 2-3 mg/kg/dia.\n- Ciclosporina: iniciar com 3-4 mg/kg/dia por via oral, dividida em duas doses, com aumento gradual até 6 mg/kg/dia, conforme necessário para o controle dos sintomas. Após a obtenção da melhora máxima, diminuir a dose ao longo de meses até a mínima tolerável (3,0 mg/kg/dia).\n- Ciclofosfamida: pulsoterapia intravenosa, mensal, na dose de 500 mg/m2. A dose poderá ser ajustada gradativamente, se não houver melhora clínica ou efeitos adversos, num total de até 2000 mg/m2.  As pulsoterapias com ciclofosfamida são administrados mensalmente por seis meses, depois a cada dois meses, para um total de nove ciclos.\n- Imunoglobulina humana: dose total máxima de 2 g/kg administrada ao longo de 2 a 5 dias.\n- Plasmaférese: 5-6 trocas de 2-3 litros de plasma, em dias alternados. Usualmente a melhora funcional é detectada após 2-4 trocas.\nUma vez que manifestações mínimas sejam alcançadas com o medicamento poupador de prednisona, recomenda-se manter a primeira opção introduzida, por pelo menos um a dois anos e, então, diminuir a sua dose, progressivamente, a cada três ou seis meses, até encontrar a mínima dose efetiva.",
   "pagina": 11,
   "completo": true
  }
 },
 {
  "id_pcdt": 105,
  "titulo": "Mieloma Múltiplo",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 90 - 20/10/2026",
  "data_portaria": "2026-10-28",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/2026/pcdt-mieloma-multiplo.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2026/portaria-conjunta-saes-sctie-no-90-de-20-de-outubro-de-2026.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 143,
  "tem_texto": true,
  "cids": [
   "C90.0"
  ],
  "farmacos": [
   {
    "nome": "ciclofosfamida",
    "chave": "ciclofosfamida",
    "no_rename": true,
    "id_monografia_ftn": 62
   },
   {
    "nome": "cisplatina",
    "chave": "cisplatina",
    "no_rename": false,
    "id_monografia_ftn": 65
   },
   {
    "nome": "doxorrubicina",
    "chave": "doxorrubicina",
    "no_rename": false,
    "id_monografia_ftn": 95
   },
   {
    "nome": "etoposideo",
    "chave": "etoposideo",
    "no_rename": false,
    "id_monografia_ftn": 154
   },
   {
    "nome": "vincristina",
    "chave": "vincristina",
    "no_rename": false,
    "id_monografia_ftn": 317
   },
   {
    "nome": "talidomida",
    "chave": "talidomida",
    "no_rename": true,
    "id_monografia_ftn": 320
   },
   {
    "nome": "dexametasona",
    "chave": "dexametasona",
    "no_rename": true,
    "id_monografia_ftn": 129
   },
   {
    "nome": "prednisona",
    "chave": "prednisona",
    "no_rename": true,
    "id_monografia_ftn": 267
   },
   {
    "nome": "calcio",
    "chave": "calcio",
    "no_rename": true,
    "id_monografia_ftn": 50
   },
   {
    "nome": "fibrinogenio",
    "chave": "fibrinogenio",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "acido zoledronico",
    "chave": "acido zoledronico",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "pamidronato",
    "chave": "pamidronato",
    "no_rename": true,
    "id_monografia_ftn": 255
   },
   {
    "nome": "anfotericina b",
    "chave": "anfotericina b",
    "no_rename": false,
    "id_monografia_ftn": 26
   },
   {
    "nome": "sodio",
    "chave": "sodio",
    "no_rename": true,
    "id_monografia_ftn": 6
   },
   {
    "nome": "cloreto de sodio",
    "chave": "cloreto de sodio",
    "no_rename": true,
    "id_monografia_ftn": 78
   },
   {
    "nome": "melfalana",
    "chave": "melfalana",
    "no_rename": false,
    "id_monografia_ftn": 222
   },
   {
    "nome": "aciclovir",
    "chave": "aciclovir",
    "no_rename": true,
    "id_monografia_ftn": 8
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "criterios_interrupcao",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 106,
  "titulo": "Miopatias Inflamatórias",
  "portaria": "Portaria Conjunta SAES/SECTICS/MS nº 9 - 02/07/2025",
  "data_portaria": "2025-07-14",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/portaria-no-9-pcdt-miopatias-inflamatorias.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2025/portaria-conjunta-saes-sectics-no-9-de-1-de-julho-de-2025.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/2026/pcdt-resumido/pcdt-resumido-miopatias-inflamatorias/@@display-file/file",
  "paginas": 125,
  "tem_texto": true,
  "cids": [],
  "farmacos": [
   {
    "nome": "azatioprina",
    "chave": "azatioprina",
    "no_rename": true,
    "id_monografia_ftn": 33
   },
   {
    "nome": "metotrexato",
    "chave": "metotrexato",
    "no_rename": true,
    "id_monografia_ftn": 229
   },
   {
    "nome": "hidroxicloroquina",
    "chave": "hidroxicloroquina",
    "no_rename": true,
    "id_monografia_ftn": 312
   },
   {
    "nome": "ciclosporina",
    "chave": "ciclosporina",
    "no_rename": true,
    "id_monografia_ftn": 63
   },
   {
    "nome": "imunoglobulina humana",
    "chave": "imunoglobulina humana",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "prednisona",
    "chave": "prednisona",
    "no_rename": true,
    "id_monografia_ftn": 267
   },
   {
    "nome": "metilprednisolona",
    "chave": "metilprednisolona",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "ciclofosfamida",
    "chave": "ciclofosfamida",
    "no_rename": true,
    "id_monografia_ftn": 62
   }
  ],
  "secoes_disponiveis": [
   "medicamentos",
   "esquemas",
   "criterios_interrupcao"
  ],
  "medicamentos": {
   "texto": "- Azatioprina: comprimidos de 50 mg;\n- Ciclofosfamida: pó para solução injetável de 200 mg e 1.000 mg;\n- Ciclosporina: cápsulas de 10 mg, 25 mg, 50 mg, 100 mg e solução oral de 100 mg/mL;\n- Imunoglobulina humana: pó para solução injetável ou solução injetável de 0,5 g, 1 g, 2,5 g e 5 g;\n- Metilprednisolona: pó para solução injetável de 500 mg;\n- Metotrexato: comprimidos de 2,5 mg ou solução injetável de 25 mg/mL;\n- Prednisona: comprimidos de 5 e 20 mg;\n- Sulfato de hidroxicloroquina: comprimidos de 400 mg.\nNota: Os medicamentos ciclofosfamida e metilprednisolona estão contemplados em procedimentos de pulsoterapia, sendo seu fornecimento de responsabilidade do serviço, não sendo dispensados no âmbito da Assistência Farmacêutica.",
   "pagina": 11,
   "completo": true
  },
  "esquemas": {
   "texto": "Prednisona\n- Adultos: administração via oral, 1 mg/kg/dia (máximo: 80 mg/dia) durante 4-6 semanas. Se houver controle da doença, iniciar diminuição gradual da dose, reduzindo-se até 20% da dose vigente a cada 4 semanas até atingir 10 mg/dia. Manter a corticoterapia conforme evolução clínica até completar 9 a 12 meses de tratamento. Nos casos refratários ou recidivantes, seu uso poderá exceder 12 meses. Em caso de recidiva durante a redução de dose, deve-se retornar à mínima dose efetiva e adicionar azatioprina ou metotrexato (ou ajustar as doses desses medicamentos, se já em uso). Recomenda-se monitoramento cuidadoso, pois o uso de altas doses (1 mg/kg/dia) por mais de 6 semanas pode aumentar o risco de desenvolver miopatia associada a glicocorticoides39.\n- Crianças e adolescentes (menores de 18 anos): administração via oral, 1 a 2 mg/kg/dia (máximo: 60 mg/dia) durante 4 semanas. Se houver resposta adequada, iniciar redução gradual (0,5 mg/kg a cada 2 semanas com base na resposta até que a dose seja 0,5 mg/kg/dia). Em seguida, diminuir a cada 4 semanas conforme tolerância39.\nMetilprednisona (pulsoterapia)\n- Adultos: administração por pulsoterapia em pacientes com envolvimento sistêmico grave ou fraqueza intensa, administrar 1.000 mg por via intravenosa por, pelo menos, 30 minutos durante 3 a 5 dias consecutivos, seguido de glicocorticoide oral39. Repetir mensalmente conforme resposta terapêutica.\n- Crianças e adolescentes (menores de 18 anos): administração por via intramuscular ou intravenosa, doses iniciais de 10 a 40 mg. Caso seja necessário o uso de doses elevadas, é recomendado 30 mg/kg por via intravenosa durante 30 minutos, repetido a cada 4 a 6 horas por até 48 horas, chegando ao máximo de 1.000 mg ao dia. Deve-se continuar a terapia com altas doses até que a condição do paciente se estabilize entre 48 e 72 horas (três dias consecutivos) 65.\nAzatioprina\n- Adultos: administração via oral, iniciar com 50 mg uma vez ao dia em combinação com um glicocorticoide. A dose pode ser alterada a partir de 6 a 8 semanas para 1,5 mg/kg/dia. Em casos de resposta insatisfatória em 3 meses, o aumento de dose gradual, em intervalos de 4 semanas, pode ser realizado até 2,5 a 3 mg/kg/dia. Os incrementos de dose devem ser de 0,5 mg/kg ou, aproximadamente, 25 mg diariamente39,66.",
   "pagina": 11,
   "completo": false
  }
 },
 {
  "id_pcdt": 107,
  "titulo": "Mucopolissacaridose tipo I",
  "portaria": "Portaria Conjunta SAES/SECTICS/MS nº 6 - 1º/07/2025",
  "data_portaria": "2025-07-14",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-munopolissacaridose-tipo-i.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2025/portaria-conjunta-saes-sectics-no-6-de-1-de-julho-de-2025.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 46,
  "tem_texto": true,
  "cids": [],
  "farmacos": [
   {
    "nome": "laronidase",
    "chave": "laronidase",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "medicamentos",
   "esquemas",
   "criterios_interrupcao"
  ],
  "medicamentos": {
   "texto": "- Laronidase: solução injetável de 0,58 mg/mL.",
   "pagina": 16,
   "completo": true
  },
  "esquemas": {
   "texto": "A dose recomendada para a laronidase é de 0,58 mg/kg de peso corporal, administrada uma vez por semana por infusão intravenosa, durante três a quatro horas. Pré-tratamento com antipiréticos ou anti-histamínicos é recomendado 60 minutos antes do início da infusão em bula103, porém trata-se apenas de uma recomendação. A decisão de usar pré-medicação ou não, cabe ao médico/a assistente do paciente103. A infusão deve ser feita em ambiente hospitalar ou ambulatorial. Infusões domiciliares podem ser consideradas após 6 meses de tratamento sem intercorrências103,106.\nO volume total da infusão é determinado pelo peso corporal do paciente e deve ser infundido ao longo de 3 a 4 horas.\nPacientes com 20 kg ou menos devem receber um volume total de 100 mL. Pacientes com mais de 20 kg devem receber um volume total de 250 ml. A taxa inicial de infusão é de 10 mcg/kg/hora e pode ser aumentada a cada 15 minutos durante a primeira hora, conforme a tolerância, até uma velocidade máxima de infusão de 200 mcg/kg/hora ser atingida, sendo mantida para o restante da infusão (2 a 3 horas)103.\nAlguns estudos107,103 avaliaram um esquema posológico alternativo, diferente do preconizado em bula da laronidase.\nPacientes em uso de 1,2 mg/kg de laronidase em semanas alternadas (15/15 dias) apresentaram bons resultados clínicos (nenhuma deterioração ou reversão dos resultados clínicos), boa tolerância e segurança, além de maior satisfação, quando comparados ao uso da dose semanal. Contudo, devido à escassez das evidências, este Protocolo não preconiza o uso de laronidase em esquemas de administração distintos.",
   "pagina": 16,
   "completo": true
  }
 },
 {
  "id_pcdt": 108,
  "titulo": "Mucopolissacaridose tipo II",
  "portaria": "Portaria Conjunta SAS/SCTIE/MS nº 11 - 9/07/2025",
  "data_portaria": "2025-07-30",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-da-mucopolissacaridose-tipo-ii/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2025/portaria-conjunta-saes-sectics-no-11-de-9-de-julho-de-2025/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/pcdt-resumido-da-mucopolissacaridose-tipo-ii/@@display-file/file",
  "paginas": 35,
  "tem_texto": true,
  "cids": [
   "E76.1"
  ],
  "farmacos": [
   {
    "nome": "idursulfase alfa",
    "chave": "idursulfase alfa",
    "no_rename": false,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "esquemas",
   "criterios_interrupcao",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Idursulfase alfa: 2 mg/mL solução injetável.\n15",
   "pagina": 14,
   "completo": true
  },
  "esquemas": {
   "texto": "A dose de idursulfase alfa é de 0,5 mg/kg de peso corporal administrado uma vez por semana por infusão intravenosa (IV). A solução deve ser diluída em 100 mL de cloreto de sódio a 0,9% e administrada durante 1 a 3 horas.\nDeve ser feita em ambiente hospitalar ou ambulatorial, sob vigilância de um médico ou outro profissional de saúde em ambiente dotado de infraestrutura necessária ao manejo clínico relacionado às intercorrências. Infusões domiciliares podem ser consideradas após 6 meses de tratamento, caso não tenham ocorrido intercorrências.\nRecomenda-se o uso de um dispositivo de infusão com um filtro de 0,2 μm58. A taxa de infusão inicial deve ser 8 mL/hora nos primeiros 15 minutos e, se bem tolerado, pode ser aumentada em 8 mL/hora a cada 15 minutos, até uma taxa máxima de 100 mL/h. Se a taxa for reduzida, o tempo de infusão não deve exceder 8 horas, uma vez que o medicamento não possui conservantes59. A administração de medicamentos antitérmicos e anti-histamínicos antes das infusões não deve ser considerada como recomendação padrão, sendo utilizada somente para prevenção de recorrência de reações à infusão60.\nO uso de idursulfase alfa administrada por infusão IV na dose de 0,5 mg/kg quinzenalmente é relatada em alguns centros e é considerada prescrição off label, não aprovada no registro do medicamento60. O estudo de Muenzer et al. (2006)29 considerou os desfechos em pacientes utilizando a dose de 0,5 mg/kg semanalmente, a dose de 0,5 mg/kg quinzenalmente e placebo e identificou uma taxa de melhora estatisticamente significante no TC6M quando comparou pacientes que utilizaram a dose semanal e o placebo (44,3 - 12,3 metros versus 7,3 - 9,5 metros;",
   "pagina": 15,
   "completo": false
  }
 },
 {
  "id_pcdt": 109,
  "titulo": "Mucopolissacaridose tipo IV A",
  "portaria": "Portaria Conjunta SAS/SCTIE/MS nº 19 - 04/12/2019",
  "data_portaria": "2019-12-06",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt_mucopolissacaridosetipoiva.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2019/portariaconjunta_sctie_saes_19_2019.pdf/@@display-file/file",
  "url_publicacao_ms": "https://www.gov.br/conitec/pt-br/midias/protocolos/publicacoes_ms/pcdt_mucopolissacaridose_tipoiva_isbn_18-08-2020.pdf/@@display-file/file",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/pcdt_resumido_mucopolissacaridoseiva.pdf/@@display-file/file",
  "paginas": 20,
  "tem_texto": true,
  "cids": [
   "E76.2"
  ],
  "farmacos": [
   {
    "nome": "alfaelosulfase",
    "chave": "alfaelosulfase",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "esquemas",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Alfaelosulfase: 1 mg/ml solução injetável.",
   "pagina": 8,
   "completo": true
  },
  "esquemas": {
   "texto": "A dose recomendada para a alfaelosulfase é de 2 mg/kg de peso corporal, administrada uma vez por semana por infusão intravenosa. O uso de anti-histamínico, associado ou não a antipirético, é recomendado de 30 a 60 minutos antes do início da infusão (6). A infusão deve ser feita em ambiente hospitalar.\nO volume total da infusão é determinado pelo peso corporal do paciente e deve ser infundido ao longo de 4 horas. Pacientes com 20 kg ou menos devem receber um volume total de 100 ml. Pacientes com mais de 20 kg devem receber um volume total de 250 mL. Quando diluído em 100 ml de solução fisiológica, a velocidade de infusão inicial deve ser de 3 mL/h e pode ser aumentada, conforme a tolerância, a cada 15 minutos: primeiro, aumentar a velocidade para 6 mL/h, depois, a cada 15 minutos, em incrementos de 6 mL/h até a velocidade máxima de 36 mL/h ser atingida. Quando diluído em 250 mL, a velocidade de infusão inicial deve ser de 6 mL/h e pode ser aumentada, conforme tolerância, a cada 15 minutos: primeiro, aumentar a velocidade para 12 mL/h, depois, a cada 15 minutos, em incrementos de 12 mL/h até a velocidade máxima de 72 mL/h ser atingida (40).",
   "pagina": 8,
   "completo": true
  }
 },
 {
  "id_pcdt": 110,
  "titulo": "Mucopolissacaridose tipo VI",
  "portaria": "Portaria Conjunta SAS/SCTIE/MS nº 20 - 05/12/2019",
  "data_portaria": "2019-12-06",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt_mucopolissacaridosetipovi.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2019/portariaconjunta_sctie_saes_20_2019.pdf/@@display-file/file",
  "url_publicacao_ms": "https://www.gov.br/conitec/pt-br/midias/protocolos/publicacoes_ms/pcdt_mucopolissacaridose_tipovi_isbn_17-08-2020.pdf/@@display-file/file",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/pcdt_resumido_mucopolissacaridosevi.pdf/@@display-file/file",
  "paginas": 23,
  "tem_texto": true,
  "cids": [
   "E76.2"
  ],
  "farmacos": [
   {
    "nome": "galsulfase",
    "chave": "galsulfase",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "esquemas",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Galsulfase: 1 mg/ml solução injetável.",
   "pagina": 9,
   "completo": true
  },
  "esquemas": {
   "texto": "A dose recomendada para a galsulfase é de 1 mg/kg de peso corporal, administrada uma vez por semana por infusão IV. O uso de antipiréticos ou anti-histamínicos é recomendado 30 a 60 minutos antes do início da infusão (4). A infusão deve ser feita em ambiente hospitalar ou ambulatorial.\nO volume total da infusão é determinado pelo peso corporal do paciente e deve ser infundido ao longo de 4 horas. Pacientes com 20 kg ou menos devem receber um volume total de 100 ml. Pacientes com mais de 20 kg devem receber um volume total de 250 ml. A taxa de infusão inicial deve ser de 6 ml por hora durante a primeira hora. Se a infusão for bem tolerada, a velocidade de infusão pode ser aumentada para 80 ml por hora durante as restantes 3 horas. O tempo de infusão pode ser prolongado até 20 horas se ocorrerem reações à infusão. (43)",
   "pagina": 9,
   "completo": true
  }
 },
 {
  "id_pcdt": 111,
  "titulo": "Mucopolissacaridose tipo VII",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 8 - 21/05/2021",
  "data_portaria": "2021-05-28",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/20210531_pcdt_mps_vii.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2021/20210528_portaria_conjunta_08.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/20230217_PCDT_Resumido_MucopolissacaridoseTipoVII_final.pdf/@@display-file/file",
  "paginas": 26,
  "tem_texto": true,
  "cids": [
   "E76.2"
  ],
  "farmacos": [
   {
    "nome": "alfavestronidase",
    "chave": "alfavestronidase",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "medicamentos",
   "esquemas",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Alfavestronidase: solução injetável contendo 10 mg em 5mL.",
   "pagina": 10,
   "completo": true
  },
  "esquemas": {
   "texto": "A dose preconizada para a alfavestronidase é de 4 mg/kg de peso corporal, administrada uma vez a cada duas semanas por infusão intravenosa. O uso de antipiréticos ou anti-histamínicos é recomendado 30 a 60 minutos antes do início da infusão2, 18, 21, 51, que deve ser feita em ambiente hospitalar ou ambulatorial. O volume total da infusão é determinado pelo peso corporal do paciente e deve ser infundido ao longo de 4 horas. A taxa de infusão inicial deve ser de 2,5% do volume da dose do medicamento por hora durante a primeira hora. Se a infusão for bem tolerada, a velocidade de infusão pode ser aumentada para um montante igual ao volume restante de 97,5% dividido por 3 horas e permanecer nessa taxa até que a infusão seja concluída em aproximadamente 3 horas. O tempo de infusão pode ser prolongado até 20 horas se ocorrerem reações à infusão2, 21.",
   "pagina": 10,
   "completo": true
  }
 },
 {
  "id_pcdt": 112,
  "titulo": "Neoplasia Maligna Epitelial de Ovário",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 98 - 20/10/2026",
  "data_portaria": "2026-10-28",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/2026/pcdt_neoplasia-maligna-epitelial-de-ovario.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2026/portaria-conjunta-saes-sctie-no-98-de-20-de-outubro-de-2026.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 112,
  "tem_texto": true,
  "cids": [
   "C48.1",
   "C48.2",
   "C56",
   "C57.0"
  ],
  "farmacos": [
   {
    "nome": "diafragma",
    "chave": "diafragma",
    "no_rename": false,
    "id_monografia_ftn": 130
   },
   {
    "nome": "carboplatina",
    "chave": "carboplatina",
    "no_rename": false,
    "id_monografia_ftn": 52
   },
   {
    "nome": "paclitaxel",
    "chave": "paclitaxel",
    "no_rename": false,
    "id_monografia_ftn": 253
   },
   {
    "nome": "cisplatina",
    "chave": "cisplatina",
    "no_rename": false,
    "id_monografia_ftn": 65
   },
   {
    "nome": "docetaxel",
    "chave": "docetaxel",
    "no_rename": false,
    "id_monografia_ftn": 142
   },
   {
    "nome": "fluoruracila",
    "chave": "fluoruracila",
    "no_rename": false,
    "id_monografia_ftn": 168
   },
   {
    "nome": "acido folinico",
    "chave": "acido folinico",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "doxorrubicina",
    "chave": "doxorrubicina",
    "no_rename": false,
    "id_monografia_ftn": 95
   },
   {
    "nome": "tamoxifeno",
    "chave": "tamoxifeno",
    "no_rename": false,
    "id_monografia_ftn": 70
   },
   {
    "nome": "anastrozol",
    "chave": "anastrozol",
    "no_rename": false,
    "id_monografia_ftn": 25
   },
   {
    "nome": "itraconazol",
    "chave": "itraconazol",
    "no_rename": true,
    "id_monografia_ftn": 206
   },
   {
    "nome": "claritromicina",
    "chave": "claritromicina",
    "no_rename": true,
    "id_monografia_ftn": 71
   },
   {
    "nome": "ciprofloxacino",
    "chave": "ciprofloxacino",
    "no_rename": true,
    "id_monografia_ftn": 87
   },
   {
    "nome": "eritromicina",
    "chave": "eritromicina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "fluconazol",
    "chave": "fluconazol",
    "no_rename": true,
    "id_monografia_ftn": 164
   },
   {
    "nome": "verapamil",
    "chave": "verapamil",
    "no_rename": true,
    "id_monografia_ftn": 124
   },
   {
    "nome": "gencitabina",
    "chave": "gencitabina",
    "no_rename": false,
    "id_monografia_ftn": 99
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "criterios_interrupcao",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 113,
  "titulo": "Osteogênese Imperfeita",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 17 - 08/09/2022",
  "data_portaria": "2022-09-26",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/20220926_pcdt_osteogenese_imperfeita.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2022/20220926_portaria_conjunta_n17.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/20230424_PCDT_Resumido_Osteogenese_Imperfeita_final.pdf/@@display-file/file",
  "paginas": 78,
  "tem_texto": true,
  "cids": [
   "Q78.0"
  ],
  "farmacos": [
   {
    "nome": "pamidronato",
    "chave": "pamidronato",
    "no_rename": true,
    "id_monografia_ftn": 255
   },
   {
    "nome": "alendronato",
    "chave": "alendronato",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "carbonato de cálcio + colecalciferol",
    "chave": "calcio + colecalciferol",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "esquemas",
   "criterios_interrupcao",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Alendronato: comprimidos de 10mg e 70 mg - Pamidronato: frasco-ampola de 60 e 90 mg.\n- Carbonato de cálcio + colecalciferol: comprimido de 500 mg + 400 UI ou comprimido de 500 mg + 200 UI.",
   "pagina": 7,
   "completo": true
  },
  "esquemas": {
   "texto": "- Alendronato: Pacientes com 35 kg ou mais devem utilizar dose de 70 mg/semana ou 10 mg/dia, por via oral, ingerida em jejum pela manhã com água (200 mL), pelo menos meia hora antes da primeira refeição e de outros medicamentos. O paciente deve manter a posição ortostática (sentado ou em pé) por, no mínimo, 30 minutos após a administração do medicamento.\nPacientes com menos de 35 kg, devem utilizar 30 mg ou 40 mg/semana, a critério médico. A apresentação de 10 mg, inclusive, permite o uso diário do alendronato.\n- Pamidronato: em crianças menores de 2 anos, a dose preconizada é de 0,5 mg/kg/dia por 3 dias a cada dois meses. Em crianças de 2 a 3 anos, preconiza-se 0,75 mg/kg/dia por 3 dias a cada 3 meses. Pacientes maiores de 3 anos, devem utilizar 1,0 mg/kg/dia por 3 dias a cada 4 meses. As doses devem ser administradas por via intravenosa. O volume de infusão não deve exceder a 60 mg/h e a concentração na solução de infusão não deve exceder a 90 mg/250 mL. A dose máxima é de 90 mg e o medicamento não deve ser administrado em bolus.\n- Carbonato de cálcio + colecalciferol: A dose preconizada é de 1.000 a 2.000 mg de cálcio por dia e 400 a 800 UI de colecalciferol (vitamina D), a serem administrados, preferencialmente, após as refeições ou conforme orientação médica.",
   "pagina": 8,
   "completo": true
  }
 },
 {
  "id_pcdt": 114,
  "titulo": "Osteoporose - Portaria atualizada em 29/01/2026",
  "portaria": "Portaria Conjunta SAES-SECTICS nº 22 - 22/10/2025 (Republicada em 31/10/2025)",
  "data_portaria": "2025-10-22",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/portaria-no-22-pcdt-da-osteoporose.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2025/portaria-conjunta-saes-sectics-no-22-de-22-de-outubro-de-2025.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 98,
  "tem_texto": true,
  "cids": [
   "M80.0",
   "M80.1",
   "M80.2",
   "M80.3",
   "M80.4",
   "M80.5",
   "M80.8",
   "M81.0",
   "M81.1",
   "M81.2",
   "M81.3",
   "M81.4",
   "M81.5",
   "M81.6",
   "M81.8",
   "M82.0",
   "M82.1",
   "M82.8",
   "M85.8"
  ],
  "farmacos": [
   {
    "nome": "ácido zoledrônico",
    "chave": "acido zoledronico",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "alendronato",
    "chave": "alendronato",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "calcitonina",
    "chave": "calcitonina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "calcitriol",
    "chave": "calcitriol",
    "no_rename": true,
    "id_monografia_ftn": 47
   },
   {
    "nome": "carbonato de cálcio",
    "chave": "calcio",
    "no_rename": true,
    "id_monografia_ftn": 50
   },
   {
    "nome": "colecalciferol",
    "chave": "colecalciferol",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "pamidronato",
    "chave": "pamidronato",
    "no_rename": true,
    "id_monografia_ftn": 255
   },
   {
    "nome": "raloxifeno",
    "chave": "raloxifeno",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "risedronato",
    "chave": "risedronato",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "romosozumabe",
    "chave": "romosozumabe",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "medicamentos",
   "esquemas",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Ácido zoledrônico: solução para infusão de 5 mg/100mL;\n- Alendronato de sódio: comprimidos de 10 e 70 mg;\n- Calcitonina: solução nasal com 200 UI/dose;\n- Calcitriol: cápsula de 0,25 mcg;\n- Carbonato de cálcio: comprimido de 1.250 mg (equivalente a 500 mg de cálcio elementar);\n- Carbonato de cálcio + colecalciferol: comprimidos de 1.250 mg (equivalente a 500 mg de cálcio elementar) + 200 UI ou 400 UI; comprimidos de 1.500 mg (equivalente a 600 mg de cálcio elementar) + 400 UI;\n- Fosfato de cálcio tribásico + colecalciferol: comprimidos de 1661,616 mg (equivalente a 600 mg de cálcio elementar) + 400 UI;\n- Cloridrato de raloxifeno: comprimidos de 60 mg;\n- Estrogênios conjugados: comprimidos de 0,3 mg e 0,625 mg;\n- Pamidronato dissódico: pó para solução injetável de 60 mg;\n- Risedronato sódico: comprimidos de 35 mg;\n- Romosozumabe: solução injetável de 90 mg/mL.",
   "pagina": 12,
   "completo": true
  },
  "esquemas": {
   "texto": "- Ácido zoledrônico: dose de 5 mg, por via intravenosa (IV), uma vez ao ano.\n- Alendronato de sódio: dose de 10 mg/dia ou 70 mg, uma vez por semana, por via oral (VO). Deve ser ingerido em jejum, pelo menos meia hora antes da primeira refeição e de outros medicamentos, com um copo de água (200 mL). Após a ingestão, o paciente deve ficar sentado ou de pé por pelo menos 30 a 60 minutos.\n- Calcitonina: dose de 400 UI/dia, por via intranasal.\n- Calcitriol: dose de 0,25 mcg, duas vezes ao dia, por VO.\n- Carbonato de cálcio: dose de 500 a 1.400 mg por dia de cálcio elementar por VO, divididas em administrações de, no máximo, 500 mg de cálcio elementar por vez.\n- Fosfato de cálcio tribásico + colecalciferol: doses de 600 a 1200 mg por dia de cálcio elementar por VO, divididas em no máximo 600 mg de cálcio elementar por vez.\n- Estrógenos conjugados: dose individualizada, por VO.\n- Pamidronato dissódico: dose de 60 mg, por via IV a cada 3 meses. Após reconstituição, deve-se diluir o fármaco em 500 mL de soro fisiológico. A duração mínima da infusão é de 2 horas;\n- Raloxifeno: dose de 60 mg por dia, por VO.\n- Risedronato sódico: dose de 35 mg, uma vez por semana, por VO. Deve ser ingerido em jejum, pelo menos 30 minutos antes da primeira refeição e de outros medicamentos, com um copo de água. Após a ingestão, o paciente deve ficar sentado ou de pé por 30 minutos;\n- Romosozumabe: dose recomendada de 210 mg, por via subcutânea, uma vez por mês durante um período de 12 meses. Os pacientes devem ser adequadamente suplementados com cálcio e colecalciferol (vitamina D).",
   "pagina": 12,
   "completo": true
  }
 },
 {
  "id_pcdt": 115,
  "titulo": "Porfirias",
  "portaria": "Portaria Conjunta SAES/SECTICS/MS nº 21 - 01/09/2025",
  "data_portaria": "2025-09-18",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-porfirias/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2025/portaria-conjunta-saes-sectics-no-21-de-1o-de-setembro-de-2025/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 46,
  "tem_texto": true,
  "cids": [
   "E80.0",
   "E80.1",
   "E80.2"
  ],
  "farmacos": [
   {
    "nome": "glicose",
    "chave": "glicose",
    "no_rename": true,
    "id_monografia_ftn": 182
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "esquemas",
   "criterios_interrupcao",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Glicose 5%: solução injetável de 50 mg/mL - Glicose 10%: solução injetável de 100 mg/mL - Glicose 50%: solução injetável de 500 mg/mL",
   "pagina": 14,
   "completo": true
  },
  "esquemas": {
   "texto": "A quantidade de glicose necessária para o controle de ataques porfíricos agudos varia conforme a resposta clínica de cada paciente65. O principal esquema recomendado pelas diretrizes clínicas internacionais é a infusão de 300 a 500 mg de glicose hipertônica 10% reconstituída em solução salina 0,45%, por via intravenosa, com fluxo de distribuição contínuo de 24 horas32,56.\nEm pacientes clinicamente aptos ao consumo oral de glicose ou em situações de baixa tolerabilidade à infusão intravenosa, a dose de glicose pode ser complementada com uma dieta rica em carboidratos55,56.",
   "pagina": 14,
   "completo": true
  }
 },
 {
  "id_pcdt": 116,
  "titulo": "Prevenção da Transmissão Vertical do HIV, Sífilis e Hepatites Virais",
  "portaria": "Portaria SCTIE/MS nº 55/2020 - 11/11/2020",
  "data_portaria": "2020-11-13",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/20201113_pcdt_para_ptv_hiv_final.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2020/20201113_portaria_sctie_55.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 206,
  "tem_texto": true,
  "cids": [],
  "farmacos": [],
  "secoes_disponiveis": [],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 117,
  "titulo": "Prevenção de Tromboembolismo Venoso em Gestantes com Trombofilia",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 23/2021 - 21/12/2021",
  "data_portaria": "2021-12-29",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/20211230_portal-portaria-conjunta_pcdt_trombofilia_gestantes.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2021/20211229_portaria_conjunta_23.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/pcdt_resumido_trombofilia_gestacional.pdf/@@display-file/file",
  "paginas": 19,
  "tem_texto": true,
  "cids": [
   "D68.8",
   "I82.0",
   "I82.1",
   "I82.2",
   "I82.3",
   "I82.8",
   "O22.3",
   "O22.5"
  ],
  "farmacos": [
   {
    "nome": "enoxaparina sódica",
    "chave": "enoxaparina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "ácido acetilsalicílico",
    "chave": "acido acetilsalicilico",
    "no_rename": true,
    "id_monografia_ftn": 9
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "Neste Protocolo, são preconizadas as seguintes apresentações dos medicamentos:\n- Enoxaparina sódica - solução injetável de 40 mg/0,4 mL e de 60 mg/0,6 mL; e - Ácido acetilsalicílico (AAS) – comprimidos de 100 mg.\nEnoxaparina A enoxaparina sódica é uma heparina de baixo peso molecular obtida pela despolimerização alcalina do éster-benzil-heparina derivado da mucosa intestinal suína. Apresenta alta atividade anti-Xa (aproximadamente 100 UI/mg) e baixa atividade anti-IIa ou antitrombina (aproximadamente 28 UI/mg).",
   "pagina": 5,
   "completo": false
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 118,
  "titulo": "Profilaxia Pós-Exposição de Risco (PEP) à Infecção pelo HIV, IST e Hepatites Virais. (Anexo alterado em 20/03/2025)",
  "portaria": "Portaria SECTICS/MS nº 14 - 08/04/2024",
  "data_portaria": "2024-04-10",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/PCDTPEP.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2024/portaria-sectics-ms-no-14-de-8-de-abril-de-2024/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 49,
  "tem_texto": true,
  "cids": [],
  "farmacos": [],
  "secoes_disponiveis": [],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 119,
  "titulo": "Profilaxia PréExposição (PrEP) Oral à Infecção pelo HIV",
  "portaria": "Portaria SCTIE/MS nº 55 - 14/11/2024",
  "data_portaria": "2024-11-18",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/profilaxia-preexposicao-prep-oral-a-infeccao-pelo-hiv/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2024/portaria-sectics-ms-no-55-de-14-de-novembro-de-2024/@@display-file/file",
  "url_publicacao_ms": "https://www.gov.br/conitec/pt-br/midias/protocolos/publicacoes_ms/ProtocoloClnicoeDiretrizesTeraputicasparaProfilaxiaPrExposioPrEPOralInfecopeloHIV.pdf/@@display-file/file",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/pcdt_resumido_profilaxia_pre-exposicao_de_risco_a_infeccao_pelo_hiv.pdf/@@display-file/file",
  "paginas": 52,
  "tem_texto": true,
  "cids": [],
  "farmacos": [],
  "secoes_disponiveis": [],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 120,
  "titulo": "Psoríase",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 18 - 14/10/2021",
  "data_portaria": "2021-10-20",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/20211021_portaria_conjunta_pcdt_psoriase.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2021/20211020_portaria_conjunta_18.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/20220912_PCDT_Resumido_Psoriase_final.pdf/@@display-file/file",
  "paginas": 78,
  "tem_texto": true,
  "cids": [
   "L40.0",
   "L40.1",
   "L40.4",
   "L40.8"
  ],
  "farmacos": [
   {
    "nome": "ácido salicílico",
    "chave": "acido salicilico",
    "no_rename": false,
    "id_monografia_ftn": 11
   },
   {
    "nome": "acitretina",
    "chave": "acitretina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "adalimumabe",
    "chave": "adalimumabe",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "alcatrão mineral",
    "chave": "alcatrao mineral",
    "no_rename": false,
    "id_monografia_ftn": 15
   },
   {
    "nome": "calcipotriol",
    "chave": "calcipotriol",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "ciclosporina",
    "chave": "ciclosporina",
    "no_rename": true,
    "id_monografia_ftn": 63
   },
   {
    "nome": "clobetasol",
    "chave": "clobetasol",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "dexametasona",
    "chave": "dexametasona",
    "no_rename": true,
    "id_monografia_ftn": 129
   },
   {
    "nome": "etanercepte",
    "chave": "etanercepte",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "metotrexato",
    "chave": "metotrexato",
    "no_rename": true,
    "id_monografia_ftn": 229
   },
   {
    "nome": "risanquizumabe",
    "chave": "risanquizumabe",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "secuquinumabe",
    "chave": "secuquinumabe",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "ustequinumabe",
    "chave": "ustequinumabe",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "medicamentos",
   "esquemas",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Ácido salicílico: pomada a 50 mg/g (5%).\n- Alcatrão mineral: pomada a 10 mg/g (1%).\n- Clobetasol: creme a 0,5 mg/g (bisnaga com 30 g) e solução capilar a 0,5 mg/g (frasco com 50 g).\n- Dexametasona: creme a 1 mg/g (0,1%).\n- Calcipotriol: pomada a 50 mcg/g (0,005%).\n- Acitretina: cápsulas de 10 e 25 mg.\n- Metotrexato: comprimidos de 2,5 mg e solução injetável de 25 mg/mL (frasco com 2 mL).\n- Ciclosporina: cápsulas de 10, 25, 50 e 100 mg, solução oral de 100 mg/mL (frasco de 50 mL) e solução injetável de 50mg.\n- Adalimumabe: solução injetável de 40 mg.\n- Etanercepte: solução injetável de 25 mg e 50 mg.\n- Ustequinumabe: solução injetável de 45 mg/0,5 mL e solução injetável de 90 mg/1,0 mL.\n- Secuquinumabe: 150 mg/mL pó para solução injetável.\n- Risanquizumabe: solução injetável de 75 mg/0,83 mL e de 150 mg/mL.\n17 NOTA: O psoraleno se inclui no procedimento 03.03.08.011-6 (Fototerapia com fotossensibilização - por sessão) e a ciclosporina solução injetável de 50mg corresponde ao procedimento 06.03.02.005-4 (Ciclosporina 50 mg injetável - por frasco-ampola), da Tabela de Procedimentos, Medicamentos, Órteses, Próteses e Materiais do SUS.",
   "pagina": 16,
   "completo": true
  },
  "esquemas": {
   "texto": "Como medida geral, creme hidratante (com ureia a 5%-20% e lactato e amônia a 10%, por exemplo) deve ser utilizado. Deve-se aplicar nas lesões 1 vez/dia.\nCorticosteroides tópicos:\nClobetasol creme e solução capilar a 0,05% e dexametasona creme a 0,1% podem ser utilizados 1-3 vezes/dia por períodos inferiores a 30 dias e 2 vezes/semana na fase de manutenção. O tratamento poderá ser oclusivo nas lesões cutâneas com filme de polietileno caso sejam elas hiperceratóticas ou xeróticas, para aumentar a penetração do fármaco. A dose máxima semanal não deve ser superior a 50 g.\nCalcipotriol em pomada:\nDeve ser utilizado 2 vezes/dia no início do tratamento, podendo ser reduzido para 1 vez/dia na fase de manutenção. A dose semanal não deve exceder 100 g.\nÁcido salicílico a 5% em pomada:\nDeve ser aplicada nas lesões hiperceratóticas 1 vez/dia.\nAlcatrão mineral a 1% em pomada:\nDeve ser utilizado diariamente nas lesões de psoríase.\nUVB:\nOs esquemas de doses e cronograma de aplicação das sessões 2-3/semana estão reproduzidos abaixo (quadros 4 e 5).\nPUVA:\nO 8-MOP demora cerca de uma a três horas a atingir a concentração máxima na pele, sendo administrado pelo menos duas horas antes da sessão de fototerapia10. Recomenda-se evitar alimentação 1 hora antes e 1 hora após a sessão (a alimentação diminui e lentifica a absorção do psoraleno). Na fase inicial do tratamento, as sessões são realizadas 2-3 vezes/semana com intervalo de 48 horas, o que permite a melhora do eritema. Os primeiros resultados começam a ser vistos em 1 mês de tratamento. Geralmente são necessárias 20-25 sessões, que podem ser repetidas na manutenção (quadros 6 e 7). O tratamento com psoraleno tópico utiliza 0,1% de 8-MOP em emoliente que deve ser aplicado 30 minutos antes da sessão. Pode levar até 30 sessões para um resultado ser percebido. O primeiro curso pode ter duração de 30-40 sessões e ser repetido se necessário.\nQuadro 4 - Esquema de dose e cronograma para radiação UVB de faixa larga (tratamento 2-3 vezes/semana)83 Fototipo* Dose UVB inicial (mJ/cm2) Incremento da dose por sessão (mJ/cm2) I 20 5 II 25 10 18 III 30 15 IV 40 20 V 50 25 VI 60 30 Dose eritematosa mínima (DEM) Primeira sessão 50% da DEM Sessões 1-10 Aumento de 25% da DEM inicial.\nSessões 11-20 Aumento de 10% da DEM inicial.\nMais de 21 sessões De acordo com o dermatologista.\nSe houver perda de sessões 4-7 dias Manter a dose.\n1-2 semanas Reduzir a dose em 50%.\n2-3 semanas Reduzir a dose em 75%.\n3-4 semanas Reiniciar.",
   "pagina": 17,
   "completo": false
  }
 },
 {
  "id_pcdt": 121,
  "titulo": "Puberdade Precoce Central",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 13 - 27/07/2022",
  "data_portaria": "2022-08-03",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/20220308_portaria-conjunta-no-13-pcdt-puberdade-precoce-central-1.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2022/20220308_portaria-conjunta-no-13.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/PCDT_Resumido_Puberdade_PC_final.pdf/@@display-file/file",
  "paginas": 16,
  "tem_texto": true,
  "cids": [
   "E22.8"
  ],
  "farmacos": [
   {
    "nome": "medroxiprogesterona",
    "chave": "medroxiprogesterona",
    "no_rename": true,
    "id_monografia_ftn": 4
   },
   {
    "nome": "ciproterona",
    "chave": "ciproterona",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "gosserrelina",
    "chave": "gosserrelina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "leuprorrelina",
    "chave": "leuprorrelina",
    "no_rename": true,
    "id_monografia_ftn": 3
   },
   {
    "nome": "triptorrelina",
    "chave": "triptorrelina",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "medicamentos",
   "esquemas",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Acetato de medroxiprogesterona: suspensão injetável com 150 mg/mL ou 50 mg/mL;\n- Acetato de ciproterona: comprimidos de 50 mg;\n- Acetato de gosserrelina: implante subcutâneo de 3,6 mg e 10,8 mg.\n- Acetato de leuprorrelina: pó para suspensão injetável com 3,75 mg, 11,25 mg e 45 mg;\n- Triptorrelina: pó para suspensão injetável com 3,75 mg, 11,25 mg e 22,5 mg.",
   "pagina": 5,
   "completo": true
  },
  "esquemas": {
   "texto": "Os esquemas de administração dos fármacos usados no tratamento da Puberdade Precoce Central encontram-se discriminados na Tabela 1.\nTabela 1 - Esquema de administração dos fármacos usados no tratamento da Puberdade Precoce Central Medicamento Frequência Posologia Via de administração Acetato de ciproterona diária 50 a 100 mg/m2 VO Acetato de medroxiprogesterona mensal 50 a 150 mg IM Acetato de gosserrelina mensal 3,6 mg SC trimestral 10,8 mg SC Acetato de leuprorrelina mensal 3,75 mg IM 7,5 mga IM trimestral 11,25 mg IM semestral 45 mg SC Triptorrelina mensal 3,75 mg IM 7,5 mga IM trimestral 11,25 mg IM semestral 22,5 mg IM Nota: aApenas em caso de controle clínico ou laboratorial insatisfatório.\nLegenda: VO = via oral; IM= via intramuscular.\nAnteriormente, o tratamento com agonistas de GnRH de depósito mensal era usado com mais frequência. No entanto, formulações adicionais de uso a cada 3 meses e 6 meses, bem como implantes subcutâneos, tornaram-se disponíveis nos últimos anos. As opções de depósitos são formulações de liberação sustentada administradas em várias doses e intervalos28. Não há superioridade terapêutica entre as três modalidades: uso mensal, trimestral e semestral3,4,6,29,30. Logo, o início de tratamento pode ser feito com qualquer uma das posologias. Em caso de controle clínico ou laboratorial insatisfatório, pode-se aumentar a dose da leuprorrelina e da triptorrelina de 3,75 mg para 7,5 mg mensal18,27. Inexistem estudos sobre doses maiores na ausência de adequado controle31,32 nas posologias vigentes da gosserrelina, não sendo preconizados neste Protocolo. O uso de leuprorrelina 45 mg e de triptorrelina 22,5 mg apresenta benefícios acerca da vantagem posológica, que pode possibilitar maior adesão ao tratamento29,30,33.",
   "pagina": 6,
   "completo": true
  }
 },
 {
  "id_pcdt": 122,
  "titulo": "Raquitismo e Osteomalácia",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 02 - 11/01/2022",
  "data_portaria": "2022-01-31",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/20220201_portal_portaria_conjunta_2_pcdt_raquitismo_e_osteomalacia-1.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2022/20220131_portaria_conjunta_2.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/pcdt_resumido_raquitismo_e_osteomalacia.pdf/@@display-file/file",
  "paginas": 64,
  "tem_texto": true,
  "cids": [
   "E55.0",
   "E55.9",
   "E64.3",
   "E83.3",
   "M83.0",
   "M83.1",
   "M83.2",
   "M83.3",
   "M83.8"
  ],
  "farmacos": [
   {
    "nome": "calcitriol",
    "chave": "calcitriol",
    "no_rename": true,
    "id_monografia_ftn": 47
   },
   {
    "nome": "carbonato de cálcio",
    "chave": "calcio",
    "no_rename": true,
    "id_monografia_ftn": 50
   },
   {
    "nome": "burosumabe",
    "chave": "burosumabe",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "esquemas",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "- Vitamina D: De forma geral, o tratamento com vitamina D para pacientes com raquitismo e osteomalácia é realizado com suas formas precursoras, vitamina D2 (ergocalciferol) ou D3 (colecalciferol), uma vez que as reações enzimáticas para conversão em calcidiol e calcitriol estão íntegras. Reserva-se o uso do calcitriol às situações em que há comprometimento da síntese ou da atividade da enzima 1-alfa-hidroxilase, responsável pela conversão do calcidiol em calcitriol.\n- Vitamina D2 ou D3: São utilizadas no tratamento de crianças, adolescentes e adultos com raquitismo nutricional por deficiência de vitamina D. A recomendação atual da posologia em pediatria é sugerida segundo a faixa etária, conforme descrito na Tabela 3.\nTabela 3 - Doses de Vitamina D2 ou D3 no tratamento do paciente com raquitismo nutricional Idade Dose diária por 90 dias Em dose única Dose de manutenção < 3 meses",
   "pagina": 13,
   "completo": true
  }
 },
 {
  "id_pcdt": 123,
  "titulo": "Retinopatia Diabética",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 17 - 01/10/2021",
  "data_portaria": "2021-12-16",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/20211220_portal_retinopatia_diabetica.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2021/20211217_portaria_conjunta_17.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/PCDTResumidoRetinopatiaDiabtica.pdf/@@display-file/file",
  "paginas": 207,
  "tem_texto": true,
  "cids": [
   "E10",
   "E11",
   "E12",
   "E13",
   "E14",
   "H36.0"
  ],
  "farmacos": [
   {
    "nome": "dexametasona",
    "chave": "dexametasona",
    "no_rename": true,
    "id_monografia_ftn": 129
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "esquemas",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "Diferentes estudos adotaram diferentes esquemas de tratamento 79,88,98,130. Na prática médica, as particularidades de cada paciente, a evolução clínica e o perfil de cada serviço irão nortear a frequência de aplicação de anti-VEGF. Ademais, considerando a frequência de comparecimento ao serviço de saúde, alguns desses esquemas, os quais consideram visitas com intervalo de tempo menor, podem não ser factíveis, devido a capacidade de atendimento dos centros especializados em que a aplicação é feita. Sendo assim, os esquemas de administração descritos neste Protocolo estão adequados às diversas necessidades possíveis, conforme o perfil do paciente e a autonomia do médico.\nRessalta-se que o esquema posológico, tanto para o uso do aflibercepte como o do ranibizumabe, irá depender das condições de estabilização do paciente, tais como acuidade visual e espessura macular.\n8.1.1. Esquema fixo - Aflibercepte Estudos que levaram à aprovação do aflibercepte utilizaram uma frequência bimestral após uma fase de indução de 5 aplicações mensais consecutivas80,87,130. Dessa forma, o esquema inicial poderá ser de injeções mensais de 2 mg de aflibercepte por cinco meses, seguido de injeções bimestrais de 2 mg de aflibercepte137.\nUma vez que os estudos que embasaram as orientações sobre o aflibercepte (VIVID/VISTA) não determinaram um limite do seu uso, não há base na literatura tocante a regimes fixos para determinar esse limite.\nOs estudos pivotais tiveram duração de dois anos apenas como estudos controlados. Após dois anos, o grupo controle passava a ser tratado com medicamento antiangiogênico e todos os grupos eram acompanhados até o fim do terceiro ano. Apesar de não haver estudos randomizados de maior duração, a doença continua após dois anos e estudos de extensão abertos dos estudos pivotais mostram a necessidade de se continuar tratando149.\n- Ranibizumabe Estudos que levaram à aprovação do ranibizumabe, nos EUA, utilizaram uma frequência mensal por 2 anos79,88. Dessa forma, o esquema inicial poderá ser de injeções mensais de 0,5 mg por dois anos ou até que a acuidade visual máxima seja atingida ou não haja sinais de atividade da doença.\n8.1.2. Esquema “Pro Re Nata” ou as needed O esquema PRN utiliza uma fase inicial de carregamento ou indução com aplicações mensais consecutivas de uma a cinco injeções, de acordo com o critério médico.",
   "pagina": 9,
   "completo": false
  }
 },
 {
  "id_pcdt": 124,
  "titulo": "Retocolite Ulcerativa",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 9 - 12/09/2024",
  "data_portaria": "2024-09-26",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-de-retocolite-ulcerativa/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2024/portaria-conjunta-saes-sectics-no-9-de-12-de-setembro-de-2024/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/pcdt-resumido-retocolite-ulcerativa/@@display-file/file",
  "paginas": 50,
  "tem_texto": true,
  "cids": [
   "K51.0",
   "K51.2",
   "K51.3",
   "K51.5",
   "K51.8"
  ],
  "farmacos": [
   {
    "nome": "sulfassalazina",
    "chave": "sulfassalazina",
    "no_rename": true,
    "id_monografia_ftn": 303
   },
   {
    "nome": "mesalazina",
    "chave": "mesalazina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "azatioprina",
    "chave": "azatioprina",
    "no_rename": true,
    "id_monografia_ftn": 33
   },
   {
    "nome": "ciclosporina",
    "chave": "ciclosporina",
    "no_rename": true,
    "id_monografia_ftn": 63
   },
   {
    "nome": "infliximabe",
    "chave": "infliximabe",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "vedolizumabe",
    "chave": "vedolizumabe",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "tofacitinibe",
    "chave": "tofacitinibe",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "esquemas",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "– Ácido fólico: comprimidos de 5 mg.\n– Azatioprina: comprimidos de 50 mg.\n– Ciclosporina: cápsulas de 10, 25, 50 e 100 mg; solução oral com 100 mg/mL; ampolas com 50 e 250 mg.\n– Hidrcortisona: pó para solução injetável de 100 e 500 mg.\n– Infliximabe: pó para solução injetável com 100 mg.\n– Mesalazina: comprimidos de 400, 500 e 800 mg; sachê contendo grânulos de liberação prolongada de 2 g; supositórios de 250, 500 e 1.000 mg; enema de 1 g;\n– Prednisona: comprimidos de 5 e 20 mg.\n– Sulfassalazina: comprimidos de 500 mg.\n– Tofacitinibe: comprimidos de 5 mg – Vedolizumabe: pó para solução injetável com 300 mg.",
   "pagina": 10,
   "completo": true
  },
  "esquemas": {
   "texto": "- Azatioprina: 2,0 a 2,5 mg/kg/dia. Iniciar com dose de 50 mg até reavaliação com exames. Em caso de ausência de eventos adversos, aumentar para a dose alvo. A dose total pode ser administrar uma vez ao dia ou em doses divididas.\n- Ciclosporina: 2 mg/kg/dia em infusão contínua durante 7 dias. Após resposta clínica, inicia-se a ciclosporina 5 mg/kg/dia por via oral dividida em duas administrações ao dia e mantida por 12 semanas.\n- Hidrocortisona: Administrar 100 mg intravenoso de 6/6h ou de 8/8h.\n- Infliximabe: Infusão intravenosa de 5 mg/kg, administrada por um período mínimo de 2 horas, seguida por doses de infusões adicionais de 5 mg/kg nas semanas 2 e 6 após a primeira infusão e, depois, a cada 8 semanas. Para pacientes adultos que apresentarem resposta incompleta ou perda de resposta, deve-se considerar o ajuste da dose para até 10 mg/kg.\n- Mesalazina (via oral): comprimidos: 2 g a 4,8 g ao dia, divididas em 2 ou 3 vezes ao dia (de 12/12h ou de 8/8h).\n- Mesalazina (via oral) sachê: tratamento agudo: dose individual de até 4g por dia, a ser tomada uma vez ao dia (2 sachês de 2g) ao mesmo tempo pela manhã; ou em doses divididas, duas vezes ao dia (1 sachê de 2g), tomados pela manhã e à noite.\nTratamento de manutenção: dose recomendada de 2g uma vez ao dia. A dose máxima diária é de 4 g/dia. Os grânulos não devem ser mastigados. O conteúdo do sachê deve ser esvaziado diretamente na língua e engolido com água e não deve ser misturado (suspenso) em água ou outros líquidos. Após a abertura do sachê, a administração deve ser imediata.\n- Mesalazina supositório (250, 500 ou 1.000 mg): Aplicar 1 supositório à noite, ao deitar. Pode-se utilizar 2 vezes ao dia em casos selecionados.\n- Prednisona: Tomar preferencialmente pela manhã. Dose inicial de 40 a 60 mg (0,75 a 1 mg/kg/dia não excedendo 60 mg/dia), por via oral, sendo que, após a melhora, esta dose deve ser reduzida 5 a 10 mg por semana até 20 mg por dia, reduzindose então 5 mg por semana até 5 mg por dia e, após, reduzindo-se 2,5 mg por semana até a retirada completa. Evitar o uso crônico, independentemente da dose.",
   "pagina": 10,
   "completo": false
  }
 },
 {
  "id_pcdt": 125,
  "titulo": "Síndrome de Falência Medular",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 23 – 01/11/2022",
  "data_portaria": "2022-11-07",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/20221109_pcdt_sindrome_falencias_medulares.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2022/20221109_portaria_conjunta_n23.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/PCDT_Resumido_SIndrome_Falencia_Medular_final.pdf/@@display-file/file",
  "paginas": 48,
  "tem_texto": true,
  "cids": [
   "D60.0",
   "D60.1",
   "D60.8",
   "D61.0",
   "D61.1",
   "D61.2",
   "D61.3",
   "D61.8",
   "D70",
   "Z94.8"
  ],
  "farmacos": [
   {
    "nome": "filgrastim",
    "chave": "filgrastim",
    "no_rename": true,
    "id_monografia_ftn": 162
   },
   {
    "nome": "ciclofosfamida",
    "chave": "ciclofosfamida",
    "no_rename": true,
    "id_monografia_ftn": 62
   },
   {
    "nome": "ciclosporina",
    "chave": "ciclosporina",
    "no_rename": true,
    "id_monografia_ftn": 63
   },
   {
    "nome": "eltrompobague",
    "chave": "eltrompobague",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "imunoglobulina antitimócitos humanos (coelho)",
    "chave": "imunoglobulina antitimocitos humanos (coelho)",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "imunoglobulina humana",
    "chave": "imunoglobulina humana",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "prednisona",
    "chave": "prednisona",
    "no_rename": true,
    "id_monografia_ftn": 267
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "medicamentos",
   "esquemas",
   "criterios_interrupcao",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Ciclofosfamida: comprimidos de 50 mg;\n- Ciclosporina:  cápsulas de 10, 25, 50 e 100 mg e solução oral de 100 mg/mL;\n- Eltrombopague olamina: comprimidos de 25 e 50 mg;\n- Filgrastim: solução injetável de 300 mcg;\n- Imunoglobulina antitimócitos humanos (coelho): pó para solução injetável de 25 mg;\n- Imunoglobulina humana: pó para solução injetável ou solução injetável contendo 0,5; 1,0; 2,5 e 5,0 g;\n- Prednisona: comprimidos de 5 e 20 mg.",
   "pagina": 9,
   "completo": true
  },
  "esquemas": {
   "texto": "Ciclofosfamida: A dose inicial é de 50 a 100 mg/dia, via oral, podendo ser titulada até dose de 150 mg/dia. A mediana de resposta é de 12 semanas. Caso ocorra resposta, a dose da ciclofosfamida deve ser reduzida paulatinamente, sendo o tempo máximo de tratamento preconizado com ciclofosfamida de 6 meses25–30.\nCiclosporina: A dose inicial é de 5 mg/kg/dia, via oral, dividida em duas administrações. O ajuste de dose é baseado na concentração do nadir do medicamento que deve estar entre 150 e 400 ng/mL no tratamento da AA adquirida, caso haja resposta, a dose da ciclosporina deve ser reduzida em 20% consecutivamente, após 180 dias (D+180); após 270 dias (D+270) e após 360 dias (D+360). Em seguida, esta dose deve ser administrada por mais 1 ano, totalizando 2 anos de uso de ciclosporina. Caso não haja resposta em 3 a 6 meses, o medicamento deve ser suspenso. Já no tratamento de APSV, caso haja resposta, a dose da ciclosporina deve ser reduzida paulatinamente.\nEltrombopague: A dose inicial preconizada é de 150 mg/dia para adultos e adolescentes entre 12 e 17 anos. A dose inicial preconizada é de 75 mg/dia para pacientes asiáticos e crianças entre 6 e 11 anos de idade. O medicamento deve ser administrado respeitando-se jejum de 4 horas. Após a administração, deve-se manter o jejum por 2 horas.\nFilgrastim: Para tratamento da neutropenia congênita grave, a dose inicial preconizada é de 5 mcg/kg/dia, via subcutânea, podendo ser dividida em duas administrações. A dose final deve ser titulada com aumento de 5 mcg/kg/dia a cada 3 a 5 dias para manter a contagem de neutrófilos acima de 1.000 /µL24.\nImunoglobulina antitimócitos humanos (coelho): Para o tratamento de AA adquirida e APSV, a dose preconizada é de 1 a 5 mg/kg/dia, por 5 dias, com infusão em 12 horas, via acesso venoso central. A dose comumente utilizada é de 2,5 mg/kg/dia, por 5 dias.\nImunoglobulina humana: A dose preconizada é de 400 mg/kg/dia por 5 dias, via endovenosa.\nPrednisona: Para o tratamento de AA adquirida, o tratamento deve ser iniciado no dia seguinte ao término da de GAT.",
   "pagina": 10,
   "completo": false
  }
 },
 {
  "id_pcdt": 126,
  "titulo": "Síndrome de Guillain-Barré",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 15 – 13/10/2020",
  "data_portaria": "2020-10-16",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/20201022_portaria_conjunta_pcdt_sgb-1.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2020/20201016_portaria_conjunta_15-1.pdf/@@display-file/file",
  "url_publicacao_ms": "https://www.gov.br/conitec/pt-br/midias/protocolos/publicacoes_ms/20210713_publicacao_guillian_barre.pdf/@@display-file/file",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/20210113_pcdt_resumido_guillan_barre.pdf/@@display-file/file",
  "paginas": 16,
  "tem_texto": true,
  "cids": [
   "G61.0"
  ],
  "farmacos": [
   {
    "nome": "imunoglobulina humana",
    "chave": "imunoglobulina humana",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "medicamentos",
   "esquemas",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "Imunoglobulina humana: frascos-ampola de 0,5; 1,0; 2,5; 5,0 g.",
   "pagina": 9,
   "completo": true
  },
  "esquemas": {
   "texto": "Imunoglobulina humana: 0,4 g/kg/dia, por via intravenosa.",
   "pagina": 9,
   "completo": true
  }
 },
 {
  "id_pcdt": 127,
  "titulo": "Síndrome Mielodisplásica de Baixo Risco",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 22 – 01/11/2022",
  "data_portaria": "2022-11-07",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/20221109_pcdt_sindrome_mielodisplasicas_de_baixo_risco.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2022/20221109_portaria_conjunta_n22.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/pcdt-resumido-smd.pdf/@@display-file/file",
  "paginas": 53,
  "tem_texto": true,
  "cids": [
   "D46.0",
   "D46.1",
   "D46.4",
   "D46.7"
  ],
  "farmacos": [
   {
    "nome": "alfaepoetina",
    "chave": "alfaepoetina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "filgrastim",
    "chave": "filgrastim",
    "no_rename": true,
    "id_monografia_ftn": 162
   },
   {
    "nome": "talidomida",
    "chave": "talidomida",
    "no_rename": true,
    "id_monografia_ftn": 320
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "medicamentos",
   "esquemas",
   "criterios_interrupcao",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Alfaepoetina: solução injetável ou pó para solução injetável contendo 10.000 UI;\n- Filgrastim: solução injetável contendo 300 microgramas (mcg);\n- Talidomida: comprimidos de 100 mg.",
   "pagina": 16,
   "completo": true
  },
  "esquemas": {
   "texto": "● Alfaepoetina: a dose inicial deve ser de 30.000 a 40.000 UI (ou 450 UI/kg) por semana, administradas por via subcutânea. Na ausência de resposta após oito semanas, a dose pode ser aumentada até 60.000 UI (cerca de 1.050 UI/kg) por semana, dose única ou duas administrações. Doses maiores que 60.000 UI por semana não são toleradas. Pacientes com baixo peso e com déficit de função renal devem utilizar dose reduzida de alfaepoetina.\n● Filgrastim: para tratamento da neutropenia, a dose preconizada é de 5 mcg/kg/dia. Para uso associado à alfaepoetina, preconiza-se uma dose inicial de 300 mcg por semana, dividida em duas a três administrações. A dose pode ser aumentada para até 900 mcg, divididas em três administrações semanais, caso o paciente não responda à dose usual.\n● Talidomida: a dose inicial é 100 mg/dia por via oral, em dose única, durante 4 semanas, com aumento da dose a cada mês, conforme a tolerância do paciente. Doses acima de 200 mg/dia devem ser divididas em duas a quatro administrações diárias, 1 hora após as refeições. A dose de resposta ao tratamento varia entre 200 mg e 400 mg ao dia, sendo esta última a dose máxima diária. A redução da dose diária para 100 mg ou 50 mg foi associada à diminuição de eventos adversos.",
   "pagina": 16,
   "completo": true
  }
 },
 {
  "id_pcdt": 128,
  "titulo": "Síndrome de Ovários Policísticos",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 6 - 02/07/2019",
  "data_portaria": "2019-07-11",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-sindrome-dos-ovrios-policsticos.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2019/portarias_conjuntas_saes-sctie-6-7.pdf/@@display-file/file",
  "url_publicacao_ms": "https://www.gov.br/conitec/pt-br/midias/protocolos/publicacoes_ms/pcdt_sndrome-ovrios-policsticos_isbn.pdf/@@display-file/file",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/pcdt_resumido_sndrome-de-ovrios-policsticos.pdf/@@display-file/file",
  "paginas": 188,
  "tem_texto": true,
  "cids": [
   "E28.2",
   "L68.0"
  ],
  "farmacos": [
   {
    "nome": "acetato de medroxiprogesterona",
    "chave": "medroxiprogesterona",
    "no_rename": true,
    "id_monografia_ftn": 4
   },
   {
    "nome": "ciproterona",
    "chave": "ciproterona",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "etinilestradiol mais levonorgestrel",
    "chave": "etinilestradiol mais levonorgestrel",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "metformina",
    "chave": "metformina",
    "no_rename": true,
    "id_monografia_ftn": 107
   },
   {
    "nome": "noretisterona",
    "chave": "noretisterona",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "tratamento",
   "esquemas",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "Anticoncepcionais hormonais:\nEtinilestradiol mais levonorgestrel: 1 comprimido de 0,03 mg + 0,15 mg ao dia por 21 dias/mês. Doses elevadas (3 a 4 comprimidos ao dia) e decrescentes podem ser utilizadas por curtos períodos (4 a 5 dias) para controle de sangramento disfuncional.\nProgestogênios:\nAcetato de medroxiprogesterona: 1 comprimido de 10 mg ao dia por 10 a 12 dias do ciclo menstrual.\nNoretisterona: 1 comprimido de 0,35 mg ao dia em uso contínuo (efeito anticoncepcional).\nAntiandrogênios:\nAcetato de ciproterona: 12,5 mg, 25mg ou 50 mg/dia, por via oral, no esquema 21/7 (utilizar por 21 dias e fazer intervalo de 7 dias para o período menstrual), em associação ao anticoncepcional oral.\nMetformina:\nIniciar com 500 mg, por via oral após o jantar; aumentar 500 (1.000 mg/ semana até o máximo de 2,550 g/dia, se necessário). Dividir a dose em 2 ou 3 vezes ao dia para melhorar a tolerância, em caso de metformina de liberação rápida. Em caso da metformina de liberação prolongada, utilizar 1.000 mg 1 a 2 vezes ao dia.",
   "pagina": 10,
   "completo": true
  }
 },
 {
  "id_pcdt": 129,
  "titulo": "Síndrome de Turner",
  "portaria": "Portaria Conjunta SAES/SECTICS/MS nº 15 – 31/07/2025",
  "data_portaria": "2025-09-18",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-sindrome-de-turner/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2025/portaria-conjunta-saes-sectics-no-15-de-1o-de-agosto-de-2025/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 45,
  "tem_texto": true,
  "cids": [
   "Q96.0",
   "Q96.1",
   "Q96.2",
   "Q96.3",
   "Q96.4",
   "Q96.8"
  ],
  "farmacos": [
   {
    "nome": "estrogênio conjugado",
    "chave": "estrogenio conjugado",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "medroxiprogesterona",
    "chave": "medroxiprogesterona",
    "no_rename": true,
    "id_monografia_ftn": 4
   },
   {
    "nome": "somatropina",
    "chave": "somatropina",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "esquemas",
   "criterios_interrupcao",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Estrogênios conjugados: comprimidos de 0,3 mg e 0,625 mg.\n- Acetato de medroxiprogesterona: comprimidos de 10 mg.\n- Somatropina: pó para solução injetável de 4UI, 12UI, 15UI, 16UI, 18UI, 24UI e 30UI; solução injetável de 4UI, 12UI, 15UI, 16UI, 18UI, 24UI e 30UI.\nNota: Na fórmula de conversão, 1 mg de somatropina equivale a 3 UI. Há apresentações comerciais com volumes de diluente diferentes para a mesma dose de hormônio, o que deverá ser observado na prescrição e orientação ao paciente.",
   "pagina": 6,
   "completo": true
  },
  "esquemas": {
   "texto": "Estrogênios conjugados: 0,3 mg/dia por via oral em dias alternados nos primeiros meses. Após 6 meses, as doses são elevadas para 0,3 mg (1 comprimido) por dia. De 12 a 18 meses de tratamento, a dose deve ser de 0,6 mg (dois comprimidos) por dia. A dose adulta deve ser de 0,6 a 1,2 mg (2 a 4 comprimidos) por dia 36,37.\nMedroxiprogesterona: 5 a 10 mg dos dias 20 a 30 do ciclo mensal37.\nSomatropina: 0,135-0,15 UI/kg/dia (45 a 50 µg/kg/dia administrados por via subcutânea, à noite, diariamente. Doses de 0,2 UI/kg/dia (68 µg/kg/dia) podem ser administradas se o potencial de estatura final estiver substancialmente comprometido e em casos de baixa velocidade de crescimento3,9.",
   "pagina": 6,
   "completo": true
  }
 },
 {
  "id_pcdt": 130,
  "titulo": "Síndrome Nefrótica Primária em Adultos",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 8 - 14/04/2020",
  "data_portaria": "2020-04-16",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt_sindromenefroticaprimariaadulto-1.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2020/portariaconjunta_sctie_saes_08_2020.pdf/@@display-file/file",
  "url_publicacao_ms": "https://www.gov.br/conitec/pt-br/midias/protocolos/publicacoes_ms/20210416_sindrome_nefrotica_primaria_adulto.pdf/@@display-file/file",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/20201218_pcdt_resumido_sindrome_nefrotica-primaria_em_adulto.pdf/@@display-file/file",
  "paginas": 222,
  "tem_texto": true,
  "cids": [
   "N04.0",
   "N04.1",
   "N04.2",
   "N04.3",
   "N04.4",
   "N04.5",
   "N04.6",
   "N04.7",
   "N04.8",
   "N04.9"
  ],
  "farmacos": [
   {
    "nome": "prednisona",
    "chave": "prednisona",
    "no_rename": true,
    "id_monografia_ftn": 267
   },
   {
    "nome": "ciclosporina",
    "chave": "ciclosporina",
    "no_rename": true,
    "id_monografia_ftn": 63
   },
   {
    "nome": "ciclofosfamida",
    "chave": "ciclofosfamida",
    "no_rename": true,
    "id_monografia_ftn": 62
   },
   {
    "nome": "enalapril",
    "chave": "enalapril",
    "no_rename": true,
    "id_monografia_ftn": 218
   },
   {
    "nome": "captopril",
    "chave": "captopril",
    "no_rename": true,
    "id_monografia_ftn": 48
   },
   {
    "nome": "losartana potássica",
    "chave": "losartana",
    "no_rename": true,
    "id_monografia_ftn": 216
   },
   {
    "nome": "hidroclorotiazida",
    "chave": "hidroclorotiazida",
    "no_rename": true,
    "id_monografia_ftn": 188
   },
   {
    "nome": "espironolactona",
    "chave": "espironolactona",
    "no_rename": true,
    "id_monografia_ftn": 147
   },
   {
    "nome": "furosemida",
    "chave": "furosemida",
    "no_rename": true,
    "id_monografia_ftn": 175
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 131,
  "titulo": "Síndrome Nefrótica Primária em Crianças e Adolescentes",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 87 - 15/10/2026",
  "data_portaria": "2026-10-20",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/2026/pcdt-sindrome-nefrotica-primaria-em-criancas-e-adolescentes.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2026/portaria-conjunta-saes-sctie-no-87-de-15-de-outubro-de-2026.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 89,
  "tem_texto": true,
  "cids": [
   "N04.0",
   "N04.1",
   "N04.2",
   "N04.3",
   "N04.4",
   "N04.5",
   "N04.6",
   "N04.7",
   "N04.8"
  ],
  "farmacos": [
   {
    "nome": "prednisona",
    "chave": "prednisona",
    "no_rename": true,
    "id_monografia_ftn": 267
   },
   {
    "nome": "ciclosporina",
    "chave": "ciclosporina",
    "no_rename": true,
    "id_monografia_ftn": 63
   },
   {
    "nome": "tacrolimo",
    "chave": "tacrolimo",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "micofenolato de sódio",
    "chave": "micofenolato de sodio",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "micofenolato de mofetila",
    "chave": "micofenolato de mofetila",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "rituximabe",
    "chave": "rituximabe",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "ciclofosfamida",
    "chave": "ciclofosfamida",
    "no_rename": true,
    "id_monografia_ftn": 62
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "esquemas",
   "criterios_interrupcao",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Captopril: comprimido de 25 mg;\n- Ciclosporina: cápsulas de 10 mg, 25 mg. 50 mg, 100 mg e solução oral de 100 mg/mL;\n- Ciclofosfamida: comprimido de liberação retardada de 50 mg;\n- Maleato de enalapril: comprimidos de 5 mg, 10 mg ou 20 mg;\n- Losartana: comprimido de 50 mg;\n- Metilprednisolona: pó para solução injetável (500 mg);\n- Micofenolato de mofetila: comprimido de 500 mg;\n- Micofenolato de sódio: comprimidos de 180 mg e 360 mg;\n- Fosfato sódico de prednisolona: solução oral de 1 mg/mL e de 3 mg/mL;\n- Prednisona: comprimidos de 5 mg e 20 mg;\n- Rituximabe: solução injetável de 10 mg/mL;\n- Tacrolimo: cápsulas de 1 mg e 5 mg.\nNota: O medicamento metilprednisolona está contemplado em procedimento de pulsoterapia, sendo seu fornecimento de responsabilidade do serviço, não sendo dispensado no âmbito da Assistência Farmacêutica.",
   "pagina": 11,
   "completo": true
  },
  "esquemas": {
   "texto": "As doses e posologias dos medicamentos disponíveis para tratamento inicial, tratamento das recidivas e de pacientes com SNCR, respectivamente, estão disponíveis no Quadro 4.\nQuadro 4 - Esquemas de administração dos medicamentos para tratamento de crianças e adolescentes com síndrome nefrótica primária.\nEtapa/ Classificação Medicamento Orientações e Indicações Inicial Prednisona ou prednisolona Dose única, via oral, pela manhã:\n60 mg/m²/dia ou 2 mg/kg/dia (dose máxima diária de 60 mg) por quatro semanas. Se o paciente atingir a remissão, reduzir a dose para 40 mg/m² (dose máxima diária de 40 mg) em dias alternados por mais quatro semanas.\nOU 60 mg/m²/dia ou 2 mg/kg/dia (dose máxima diária de 60 mg) por seis semanas, diariamente, seguido por 40 mg/m²/em dias alternados (dose máxima diária de 40 mg) por mais seis semanas.\n12 Etapa/ Classificação Medicamento Orientações e Indicações Recidivas Prednisona ou prednisolona Dose única, via oral, pela manhã:\n60 mg/m2/dia ou 2 mg/kg/dia (dose máxima diária de 60mg), até alcançar a remissão completa por três dias. Ajustar a dose para 40 mg/m2/dia ou 1,5 mg/kg/dia em dias alternados (dose máxima diária de 40 mg) por quatro semanas.\nManutenção SNRF sem toxicidade da corticoterapia Prednisona ou prednisolona Dose única, via oral, pela manhã:\nApós remissão da recidiva, diminuir a dose de 1,5 mg/kg/dias alternados objetivando a dose de 0,5 mg/kg/dia ou menor, (que mantenha a remissão) por 12 meses.\nSNRF com toxicidade à corticoterapia e SNCD Ciclofosfamida 2 mg/kg/dia, por via oral, durante 12 semanas (dose máxima diária de 2,5 mg/kg e dose cumulativa máxima de 168 mg/kg). Não deve ser administrado um segundo curso de ciclofosfamida. Preferencialmente para casos de SNRF.\nContraindicada para gestantes.\nCiclosporina 3 a 5 mg/kg/dia, dividido em duas doses, com ajuste da dose até atingir nível sérico entre 60 e 100 ng/mL (50 a 125 nmol/L) em 12 horas (vale), para manter remissão e evitar toxicidade.\nEm geral é o primeiro IC usado, pela facilidade de fracionamento da dose, experiência em SN e menor risco de desencadear diabetes melito em paciente em uso de corticoterapia. No entanto tem maior risco de nefrotoxicidade que o tacrolimo.\nTacrolimo Como medicamento inicial ou para crianças e adolescentes com eventos adversos (hipertrofia gengival e hipertricose) relacionados ao uso da ciclosporina.",
   "pagina": 11,
   "completo": false
  }
 },
 {
  "id_pcdt": 132,
  "titulo": "Sobrecarga de Ferro",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 38 - 21/01/2026",
  "data_portaria": "2026-01-23",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/2026/pcdt-resumido/pcdt-sobrecarga-de-ferro/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2026/portaria-conjunta-saes-sctie-no-38-de-21-de-janeiro-de-2026/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/pcdt_resumido_sobrecarga-de-ferro/@@display-file/file",
  "paginas": 97,
  "tem_texto": true,
  "cids": [
   "T45.4",
   "E83.1"
  ],
  "farmacos": [
   {
    "nome": "mesilato de desferroxamina",
    "chave": "desferroxamina",
    "no_rename": true,
    "id_monografia_ftn": 224
   },
   {
    "nome": "deferiprona",
    "chave": "deferiprona",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "deferasirox",
    "chave": "deferasirox",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 133,
  "titulo": "Sobrepeso e Obesidade em Adultos",
  "portaria": "Portaria SCTIE/MS nº 53 - 11/11/2020",
  "data_portaria": "2020-11-13",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/20201113_pcdt_sobrepeso_e_obesidade_em_adultos_29_10_2020_final.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2020/20201113_portaria_sctie_53.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 391,
  "tem_texto": true,
  "cids": [
   "E66",
   "E66.0",
   "E66.1",
   "E66.2",
   "E66.8",
   "E66.9"
  ],
  "farmacos": [
   {
    "nome": "sodio",
    "chave": "sodio",
    "no_rename": true,
    "id_monografia_ftn": 6
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "casos_especiais",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 134,
  "titulo": "Tabagismo",
  "portaria": "Portaria Conjunta SCTIE/SAES/MS nº 10 - 16/04/2020",
  "data_portaria": "2020-04-24",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt_tabagismo.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2020/portariaconjunta_sctie_saes_10_2020.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/20210113_pcdt_resumido_tabagismo.pdf/@@display-file/file",
  "paginas": 67,
  "tem_texto": true,
  "cids": [
   "F17.1",
   "F17.2",
   "F17.3",
   "T65.2",
   "Z72.0"
  ],
  "farmacos": [
   {
    "nome": "adesivo de nicotina",
    "chave": "adesivo de nicotina",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "cloridrato de bupropiona",
    "chave": "bupropiona",
    "no_rename": true,
    "id_monografia_ftn": 85
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "medicamentos",
   "esquemas",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "• Cloridrato de bupropiona: comprimido de 150 mg (liberação prolongada);\n• Nicotina (de liberação lenta): adesivo de 7, 14 e 21 mg (uso transdérmico); e • Nicotina (de liberação rápida): goma de mascar de 2 mg e pastilha de 2mg.",
   "pagina": 19,
   "completo": true
  },
  "esquemas": {
   "texto": "Na Tabela 1, encontram-se os esquemas de administração dos medicamentos preconizados nesre Protocolo para o tratamento da dependência à nicotina.\n7.5.1. Terapia de reposição de nicotina combinada (CTRN) Importante destacar que a TRN, seja isolada ou em combinação, só deve ser iniciada na data em que o paciente deixar de fumar. A TRN não deve ser usada de forma concomitante com o cigarro ou outros derivados de tabaco.\nAs combinações de adesivo + goma ou pastilha de nicotina podem ser feitas de acordo com o esquema de uso do adesivo descrito a seguir, sendo a goma ou pastilha utilizada para o controle da fissura ou em casos de consumo de até 5 cigarros/dia.\n7.5.2. Adesivos de nicotina (transdérmico):\n- A reposição de nicotina deve considerar 1 mg de nicotina para cada cigarro fumado.\n- Não se deve ultrapassar a dose de 42 mg/dia.\n- A dose inicial de reposição de nicotina, para efeito de cálculo deve considerar:\na) Até 5 cigarros/dia: Não é indicado o uso de adesivo. Iniciar com goma ou pastilha, não ultrapassar 5 gomas/pastilhas de 2 mg ou 3 gomas/pastilhas de 4 mg.\nb) De 6 a 10 cigarros/dia: iniciar com adesivo de 7 mg/dia.\nc) De 11 a 19 cigarros/dia: iniciar com adesivo de 14 mg/dia d) Vinte (20) ou mais cigarros/dia: iniciar com adesivo de 21 mg/dia.\n7.5.3. Associação de adesivos - Os tabagistas que fumam mais de 20 cigarros/dia, e que apresentam dificuldade para reduzir o número de cigarros, mas que estão motivados a parar de fumar, são candidatos ao uso associado de adesivos.\n- As combinações podem ser feitas de acordo com a quantidade de cigarros fumados e a intensidade dos sintomas de abstinência a nicotina:\na) Fuma mais de 40 cigarros por dia: 21mg + 21mg/dia.\nb) Fuma acima de 30 a 40 cigarros por dia: 21mg +14mg/dia.\nc) Fuma acima de 20 a 30 cigarros por dia: 21mg + 7mg/dia.\n- A redução das doses associadas de adesivos deve ser paulatina. Preconiza-se a retirada de 7 mg a cada semana, avaliada pela intensidade dos sintomas de síndrome de abstinência.\n7.5.4. Cloridrato de bupropiona - Pacientes idosos podem ser mais sensíveis ao tratamento com cloridrato de bupropiona. O médico deve avaliar a necessidade e, nesse caso, prescrever dose única diária matinal (após o desjejum) de 150 mg.\n- Para pacientes com quadros de insuficiência renal crônica ou hepatopatia crônica é aconselhável reduzir a dose para 150mg/dia, em razão da maior biodisponibilidade do medicamento.",
   "pagina": 20,
   "completo": false
  }
 },
 {
  "id_pcdt": 135,
  "titulo": "Trombocitopenia Imune Primária",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 41 - 25/02/2026",
  "data_portaria": "2026-02-27",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/2026/portaria-conjunta-no-41-pcdt-trombocitopenia/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt_transtornoafetivobipolar_tipoi.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 43,
  "tem_texto": true,
  "cids": [
   "D69.3"
  ],
  "farmacos": [
   {
    "nome": "rituximabe",
    "chave": "rituximabe",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "azatioprina",
    "chave": "azatioprina",
    "no_rename": true,
    "id_monografia_ftn": 33
   },
   {
    "nome": "ciclofosfamida",
    "chave": "ciclofosfamida",
    "no_rename": true,
    "id_monografia_ftn": 62
   },
   {
    "nome": "danazol",
    "chave": "danazol",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "eltrombopague",
    "chave": "eltrombopague",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "romiplostim",
    "chave": "romiplostim",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "imunoglobulina humana",
    "chave": "imunoglobulina humana",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "prednisona",
    "chave": "prednisona",
    "no_rename": true,
    "id_monografia_ftn": 267
   },
   {
    "nome": "dexametasona",
    "chave": "dexametasona",
    "no_rename": true,
    "id_monografia_ftn": 129
   },
   {
    "nome": "metilprednisolona",
    "chave": "metilprednisolona",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "vincristina",
    "chave": "vincristina",
    "no_rename": false,
    "id_monografia_ftn": 317
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "medicamentos",
   "esquemas",
   "criterios_interrupcao",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Azatioprina: comprimidos de 50 mg;\n- Ciclofosfamida: comprimidos de 50 mg;\n- Danazol: cápsulas de 100 mg e 200 mg;\n- Dexametasona: solução injetável de 4 mg/mL e comprimidos de 4 mg;\n- Eltrombopague: comprimidos revestidos de 25 mg e 50 mg;\n- Imunoglobulina humana intravenosa: solução injetável ou pó para solução injetável contendo 0,5 g, 1,0 g, 2,5 g e 5 g;\n- Metilprednisolona: pó para solução injetável de 500 mg;\n- Prednisolona: solução oral de 1 mg/mL e 3 mg/mL;\n- Prednisona: comprimidos de 5 mg e 20 mg;\n- Rituximabe: solução injetável de 10 mg/mL;\n- Romiplostim: pó para solução injetável de 250 mcg/0,5 mL;\n- Vincristina: solução injetável de 1 mg/mL.",
   "pagina": 16,
   "completo": false
  },
  "esquemas": {
   "texto": "Os esquemas de administração para tratamento de crianças, adolescentes e adultos com PTI estão descritos no Quadro 7:\nQuadro 7. Esquemas de administração dos tratamentos de crianças, adolescentes e adultos.\nMedicamentos Crianças e adolescentes Adultos Tratamento de primeira linha Prednisona ou prednisolona 1 a 2 mg/kg/dia, por via oral, por 4 a 21 dias, com redução progressiva da dose após resposta terapêutica adequada;\nou 4 mg/kg/dia, por via oral, por três a quatro diasa.\nDe 0,5 a 2 mg/kg/dia, por via oral, de 2 a 4 semanas (até que as plaquetas aumentem para níveis entre 30.000/mm3 e 50.000/mm3), com redução progressiva da dose após adequada resposta terapêutica. O tempo de tratamento recomendado é de até oito semanas.\nEntretanto, se necessário, é aceitável dose inferior a 0,5 mg/kg/dia após este períodob.\nDexametasona 0,6 mg/kg/dia (máximo 40 mg/dia) por 4 dias, por via oral ou intravenosa, durante quatro a oito dias.\n40 mg/dia, por via oral ou intravenosa, por quatro dias consecutivos; de um a seis ciclos a cada 14 a 28 dias.\nMetilprednisolona c 30 mg/kg/dia (alta dose), por via intravenosa, durante três dias, seguido de 20 mg/kg/dia nos dias restantesd;\nnão ultrapassar a dose de 1 g/dia para crianças com até 11 anos de idade.\n30 mg/kg/dia ou 1 g/dia, por via intravenosa, durante três dias.\nImunoglobulina humana intravenosa e 0,8 g a 1 g/kg/dia em dose única, podendo ser repetida se não houver resposta ou completando 2 g/kg/ciclo;\nou 400 mg/kg/dia, durante cinco dias.\n0,5 a 1 g/kg/dia, em dose única, podendo ser repetida se não houver resposta ou completando 2 g/kg/ciclo; ou 400 mg/kg/dia, durante cinco dias.\nTratamento de segunda linha Azatioprina 2 mg/kg/dia, por via oral, diariamente.\n150 mg/dia, por via oral, diariamente.\nCiclofosfamida 50 mg/m2 a 100 mg/m2, por via oral, diariamente.\nRituximabe 375 mg/m² por semana, por via intravenosa, durante quatro semanas Eltrombopague f Dose inicial de 50 mg, por via oral, uma vez ao dia. Ajustar dose para atingir contagem de plaquetas acima de 50.000/mm3 até dose máxima de 75 mg/dia. Para pacientes com ascendência asiática, incluindo aqueles com insuficiência hepática, a dose inicial deve ser de 25 mg, por via oral, uma vez ao dia.\nRomiplostim Dose inicial de 1 mcg/kg/semana, administrada por via subcutânea. As doses subsequentes devem ser ajustadas para manter a contagem de plaquetas dentro do intervalo de 50.000 a 200.000/mm3 até a dose máxima de 10 mcg/kg/semana.",
   "pagina": 17,
   "completo": false
  }
 },
 {
  "id_pcdt": 136,
  "titulo": "Transtorno Afetivo Bipolar do tipo I",
  "portaria": "Portaria SAS/MS nº 315 - 30/03/2016",
  "data_portaria": "2016-03-31",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt_transtornoafetivobipolar_tipoi.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2016/portaria_sas_315_2016.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 36,
  "tem_texto": true,
  "cids": [
   "F31.1",
   "F31.2",
   "F31.3",
   "F31.4",
   "F31.5",
   "F31.6",
   "F31.7"
  ],
  "farmacos": [
   {
    "nome": "lamotrigina",
    "chave": "lamotrigina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "risperidona",
    "chave": "risperidona",
    "no_rename": true,
    "id_monografia_ftn": 273
   },
   {
    "nome": "quetiapina",
    "chave": "quetiapina",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "olanzapina",
    "chave": "olanzapina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "clozapina",
    "chave": "clozapina",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "esquemas",
   "tempo_tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "Carbonato de lítio: comprimidos de 300 mg.\nÁcido valproico: comprimidos de 250 e 500 mg, xarope e solução oral de 50 mg/mL.\nCarbamazepina: comprimidos de 200 e 400 mg, suspensão oral de 20 mg/mL.\nLamotrigina: comprimidos de 25, 50 e 100 mg.\nRisperidona: comprimidos de 1, 2 e 3 mg.\nOlanzapina: comprimidos de 5 e 10 mg.\nMinistério da Saúde Secretaria de Atenção à Saúde Haloperidol: comprimidos de 1 e 5 mg, solução injetável de 5 mg/mL e solução oral de 2 g/mL.\nQuetiapina: comprimidos de 25, 100, 200 e 300 mg.\nClozapina: comprimidos de 25 e 100 mg.\nFluoxetina: comprimidos de 20 mg.",
   "pagina": 19,
   "completo": true
  },
  "esquemas": {
   "texto": "Carbonato de lítio - Dose inicial: 300 mg/dia.\n- Faixa de dose: 300-1.800 mg/dia (de acordo com o nível sérico), dose única à noite.\nIncremento de 300 mg a cada 2 dias até chegar a 900 mg. Dosar nível sérico.\n- Dose máxima: 1.800 mg/dia, com ajuste de dose de acordo com o nível sérico (nível sérico terapêutico: 0,6-1,2 mEq/L).\nNota: O nível sérico deve ser dosado com uso contínuo de dose estável do estabilizador por pelo menos 5-7 dias e intervalo de 12 horas da última administração até o horário da coleta de sangue.\nÁcido valproico - Dose inicial: 250 mg/dia.\n- Faixa de dose: 250-2.000 mg/dia (de acordo com o nível sérico), dose única à noite.\nIncremento de 250 mg a cada 2 dias até chegar a 750 mg. Dosar nível sérico.\n- Dose máxima: 2.000 mg/dia, com ajuste de dose de acordo com o nível sérico (nível sérico terapêutico: 50-125 mcg/mL).\nNota: O nível sérico deve ser dosado com uso contínuo de dose estável do estabilizador por pelo menos 5-7 dias e intervalo de 12 horas da última administração até o horário da coleta de sangue.\nMinistério da Saúde Secretaria de Atenção à Saúde Carbamazepina - Dose inicial: 200 mg/dia.\n- Faixa de dose: 200-1.000 mg/dia (de acordo com o nível sérico), dose única à noite.\nIncremento de 200 mg a cada 2 dias até chegar a 600 mg. Dosar nível sérico.\n- Dose máxima: 1.000 mg/dia, com ajuste de dose de acordo com o nível sérico (nível sérico terapêutico: 8-12 mcg/mL).\nNota: O nível sérico deve ser dosado com uso contínuo de dose estável do estabilizador por pelo menos 5-7 dias e intervalo de 12 horas da última administração até o horário da coleta de sangue.\nLamotrigina - Dose inicial: 25 mg/dia.\n- Faixa de dose: 25-200 mg/dia, dose única à noite.\nIncremento de 25 mg/dia a cada 2 semanas nas primeiras 4 semanas, aumentando para 100 mg/dia na quinta semana. Após, a dose pode ser aumentada em, no máximo, 100 mg/semana até ser atingida a dose-alvo (100-200 mg/dia).\n- Dose máxima: 300 mg/dia.\nRisperidona - Dose inicial: 1 mg/dia.\n- Faixa de dose: 1-6 mg/dia, dose única à noite.\nIncremento de 1 mg/dia até chegar à dose-alvo.\n- Dose máxima: 8 mg/dia.\nOlanzapina - Dose inicial: 5 mg/dia.\n- Faixa de dose: 5-20 mg/dia, dose única à noite.\nIncremento de 5 mg/dia até chegar à dose-alvo.\n- Dose máxima: 20 mg/dia.\nMinistério da Saúde Secretaria de Atenção à Saúde Quetiapina - Dose inicial: 25 mg/dia.",
   "pagina": 20,
   "completo": false
  }
 },
 {
  "id_pcdt": 137,
  "titulo": "Transtorno do Déficit de Atenção com Hiperatividade",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 14 - 29/07/2022",
  "data_portaria": "2022-08-03",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/portariaconjuntan14pcdttranstornododeficitdeatencaocomhiperatividadetdah.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2022/20220308_portaria-conjunta-no-14.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/20221228_PCDT_Resumido_TDAH_final.pdf/@@display-file/file",
  "paginas": 199,
  "tem_texto": true,
  "cids": [],
  "farmacos": [
   {
    "nome": "zinco",
    "chave": "zinco",
    "no_rename": true,
    "id_monografia_ftn": 318
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 138,
  "titulo": "Transtorno Esquizoafetivo",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 07 - 14/05/2021",
  "data_portaria": "2021-05-31",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/20210601_portaria-conjunta_pcdt-transtorno-esquizoafetivo-1.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2021/20210531_portaria_conjunta_07.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/copy_of_PCDTResumidoTranstornoEsquizoafetivo.pdf/@@display-file/file",
  "paginas": 55,
  "tem_texto": true,
  "cids": [
   "F25.0",
   "F25.1",
   "F25.2"
  ],
  "farmacos": [
   {
    "nome": "biperideno",
    "chave": "biperideno",
    "no_rename": true,
    "id_monografia_ftn": 82
   },
   {
    "nome": "clorpromazina",
    "chave": "clorpromazina",
    "no_rename": true,
    "id_monografia_ftn": 90
   },
   {
    "nome": "clozapina",
    "chave": "clozapina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "haloperidol",
    "chave": "haloperidol",
    "no_rename": true,
    "id_monografia_ftn": 184
   },
   {
    "nome": "olanzapina",
    "chave": "olanzapina",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "propranolol",
    "chave": "propranolol",
    "no_rename": true,
    "id_monografia_ftn": 118
   },
   {
    "nome": "quetiapina",
    "chave": "quetiapina",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "risperidona",
    "chave": "risperidona",
    "no_rename": true,
    "id_monografia_ftn": 273
   },
   {
    "nome": "ziprasidona",
    "chave": "ziprasidona",
    "no_rename": true,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "medicamentos",
   "esquemas",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Biperideno: comprimido de 2 e 4 mg.\n- Clorpromazina: comprimidos de 25 e 100 mg; solução oral de 40 mg/mL.\n- Clozapina: comprimidos de 25 e 100 mg.\n- Decanoato de haloperidol: solução injetável 50 mg/mL.\n- Haloperidol: comprimido de 1 e 5 mg; solução oral 2 mg/mL.\n- Olanzapina: comprimidos de 5 e 10 mg.\n- Propranolol: comprimido de 10 e 40 mg.\n- Quetiapina: comprimidos de 25, 100 e 200 e 300 mg.\n- Risperidona: comprimidos de 1, 2 e 3 mg.\n- Ziprasidona: cápsulas de 40 e 80 mg.",
   "pagina": 11,
   "completo": true
  },
  "esquemas": {
   "texto": "Biperideno: Poderá ser utilizado na dose de 1 a 16 mg, divididos em 1 a 4 administrações ao dia, dependendo da intensidade dos sintomas. Aprovado para uso adulto e pediátrico acima de três anos.\nClorpromazina: Iniciar com doses pequenas, entre 50 e 100 mg por via oral (VO), 2 a 3 vezes ao dia, para atenuar possíveis efeitos adversos. Sua meia-vida de 24 horas permite administrações uma vez ao dia. Doses médias diárias variam entre 400 e 800 mg, sendo 1 g a dose máxima preconizada. Doses abaixo de 150 mg estão relacionadas a maior chance de recidiva de sintomas.\nApós 2 a 5 dias alcança equilíbrio de concentração no sangue. Diferentes substâncias, como café, cigarro e antiácidos, diminuem sua absorção. No caso de insucesso na redução ou suspensão dessas substâncias, pode-se considerar a administração de doses maiores, respeitando a dose máxima preconizada. Aprovado para uso adulto e pediátrico acima de dois anos.\nClozapina: Iniciar com a dose de 12,5 mg VO, em tomada única à noite, podendo ser aumentada em 25 mg a cada 1 a 2 dias, até a dose de 300 a 400 mg/dia, conforme resposta e tolerância. Após 30 dias sem melhora, pode-se aumentar 50 mg a cada 3 a 4 dias até 800 mg/dia.\nDoses acima de 400 mg podem ser fracionadas em 2 a 3 administrações para aumentar a tolerância do paciente. Aprovado para uso adulto.\nDecanoato de haloperidol: A dose indicada é de 150-200 mg/mês, para a maioria dos casos, aplicada por via intramuscular profunda a cada 4 semanas e, em casos mais graves, até 2 vezes ao mês. Sua meia-vida é de cerca de 3 semanas, levando entre 3 e 6 meses para estabilizar sua concentração plasmática. Por tal motivo, pode-se iniciar com doses maiores de até 400 mg/mês e com frequência semanal nos primeiros meses. Alternativamente, pode-se iniciar com doses usuais e suplementar com haloperidol oral até a dose máxima de 15 mg/dia, conforme tolerância, no primeiro mês. Aprovado para uso adulto.\nHaloperidol: Iniciar com doses fracionadas de 0,5 a 2 mg VO, 2 a 3 vezes ao dia para minimizar efeitos adversos, até a dose máxima de 15 mg/dia, em situações agudas e, de 10 mg/dia, para manutenção. Pode ser administrado uma vez ao dia, pois tem meia-vida de 24 horas. Doses maiores parecem não ter benefício e aumentam a incidência de efeitos adversos. As doses devem ser reduzidas até o nível mais baixo de efetividade. Pacientes idosos geralmente requerem doses menores. Aprovado para uso adulto.",
   "pagina": 11,
   "completo": false
  }
 },
 {
  "id_pcdt": 139,
  "titulo": "Tumor do Estroma Gastrointestinal",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS nº 102 - 20/10/2026",
  "data_portaria": "2026-10-28",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/2026/pcdt_tumor-do-estroma-gastrointestinal.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2026/portaria-conjunta-saes-sctie-no-102-de-20-de-outubro-de-2026.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 40,
  "tem_texto": true,
  "cids": [
   "C15.0",
   "C15.1",
   "C15.2",
   "C15.3",
   "C15.4",
   "C15.5",
   "C15.8",
   "C15.9",
   "C16.0",
   "C16.1",
   "C16.2",
   "C16.3",
   "C16.4",
   "C16.5",
   "C16.6",
   "C16.8",
   "C16.9",
   "C17.0",
   "C17.1",
   "C17.2",
   "C17.3",
   "C17.8",
   "C17.9",
   "C18.0",
   "C18.1",
   "C18.2",
   "C18.3",
   "C18.4",
   "C18.5",
   "C18.6",
   "C18.7",
   "C18.8",
   "C18.9",
   "C19",
   "C20",
   "C26.8",
   "C47.4",
   "C48.1",
   "C49.3"
  ],
  "farmacos": [],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "tempo_tratamento",
   "medicamentos",
   "esquemas",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- - Mesilato de imatinibe: comprimidos de 100 mg e 400 mg;\n- - Malato de sunitinibe: comprimidos de 12,5 mg, 25 mg, 37,5 mg e 50 mg.",
   "pagina": 21,
   "completo": true
  },
  "esquemas": {
   "texto": "Mesilato de imatinibe Dose de 400 mg/dia por via oral, em dose única diária. A dose pode ser aumentada para 600 mg/dia ou 800 mg/dia na ausência de eventos adversos e se não houver outras opções de tratamento.\nO comprimido deve ser ingerido durante as refeições com baixo teor de gordura para minimizar o risco de efeitos gastrointestinais, com um copo grande de água. Doses de 400 mg ou 600 mg devem ser administradas em dose única diária, enquanto a de 800 mg deve ser dividida em duas administrações diárias, pela manhã e à noite. Os comprimidos podem ser dissolvidos em um copo de água ou suco de maçã para pacientes com dificuldade de deglutição. O número de comprimidos necessários deverá ser colocado em um volume apropriado (aproximadamente 50 mL para um comprimido de 100 mg e 200 mL para um comprimido de 400 mg) e misturando com auxílio de uma colher. A suspensão deve ser ingerida imediatamente após a dissolução completa do(s) comprimido(s).\nPara o cálculo da dose, utiliza-se o peso real ou o ideal, aquele que for menor. Os comprimidos de 100 mg ou de 400 mg podem ser fracionados e diluídos com água. A proporção de água é de 50 ml para cada 100 mg. A mistura diluída deverá ser administrada imediatamente após a dissolução completa do medicamento. Recomenda-se a ingestão após a maior refeição do dia.\nO tratamento deverá ser interrompido em casos de falta ou falha de resposta, toxicidade intolerável ou progressão da doença, evidenciadas por acompanhamento clínico e por exames de imagem.\nAs diretrizes de tratamento recomendam enfaticamente que a terapia com TKI na dose diária prescrita deve ser mantida enquanto os pacientes estiverem apresentando benefício clínico (resposta ou doença estável). Ainda, como tratamento de suporte (cuidados paliativos), em caso de falha a todas as alternativas disponíveis, o uso do medicamento deve ser mantido por toda a vida para aliviar os sintomas da doença 12,14,37.",
   "pagina": 21,
   "completo": false
  }
 },
 {
  "id_pcdt": 140,
  "titulo": "Uveítes Não-Infecciosas",
  "portaria": "Portaria Conjunta SAES/SCTIE/MS n° 13 - 11/09/2019",
  "data_portaria": "2019-09-16",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/portaria-conjunta-pcdt-uveites_saes.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2019/portariasctie_11_12_13_2019.pdf/@@display-file/file",
  "url_publicacao_ms": "https://www.gov.br/conitec/pt-br/midias/protocolos/publicacoes_ms/pcdt_uvetes-no-infecciosas-_isbn.pdf/@@display-file/file",
  "url_resumido": "https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/pcdt_resumido_uvetes-no-infecciosas.pdf/@@display-file/file",
  "paginas": 29,
  "tem_texto": true,
  "cids": [
   "H30.1",
   "H30.2",
   "H30.8",
   "H20.1",
   "H15.0"
  ],
  "farmacos": [
   {
    "nome": "adalimumabe",
    "chave": "adalimumabe",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "azatioprina",
    "chave": "azatioprina",
    "no_rename": true,
    "id_monografia_ftn": 33
   },
   {
    "nome": "ciclosporina",
    "chave": "ciclosporina",
    "no_rename": true,
    "id_monografia_ftn": 63
   },
   {
    "nome": "metilprednisolona",
    "chave": "metilprednisolona",
    "no_rename": false,
    "id_monografia_ftn": null
   },
   {
    "nome": "prednisona",
    "chave": "prednisona",
    "no_rename": true,
    "id_monografia_ftn": 267
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "casos_especiais",
   "tratamento",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "",
   "pagina": 0,
   "completo": true
  },
  "esquemas": {
   "texto": "",
   "pagina": 0,
   "completo": true
  }
 },
 {
  "id_pcdt": 141,
  "titulo": "Vasculite Associada aos Anticorpos Anti-citoplasma de Neutrófilos",
  "portaria": "Portaria Conjunta SAES/SECTICS/MS n° 5 - 1º/07/2025",
  "data_portaria": "2025-07-14",
  "url_pdf": "https://www.gov.br/conitec/pt-br/midias/protocolos/pcdt-vasculite-associada-aos-anticorpos-anti-citoplasma-de-neutrofilos.pdf/@@display-file/file",
  "url_portaria": "https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2025/portaria-conjunta-saes-sectics-no-5-de-1-de-julho-de-2025.pdf/@@display-file/file",
  "url_publicacao_ms": "",
  "url_resumido": "",
  "paginas": 45,
  "tem_texto": true,
  "cids": [
   "M31.3",
   "M31.7"
  ],
  "farmacos": [
   {
    "nome": "rituximabe",
    "chave": "rituximabe",
    "no_rename": true,
    "id_monografia_ftn": null
   },
   {
    "nome": "ciclofosfamida",
    "chave": "ciclofosfamida",
    "no_rename": true,
    "id_monografia_ftn": 62
   },
   {
    "nome": "prednisona",
    "chave": "prednisona",
    "no_rename": true,
    "id_monografia_ftn": 267
   },
   {
    "nome": "metilprednisolona",
    "chave": "metilprednisolona",
    "no_rename": false,
    "id_monografia_ftn": null
   }
  ],
  "secoes_disponiveis": [
   "cid",
   "inclusao",
   "exclusao",
   "tratamento",
   "medicamentos",
   "esquemas",
   "criterios_interrupcao",
   "monitoramento"
  ],
  "medicamentos": {
   "texto": "- Ciclofosfamida: pó para solução injetável de 200 mg ou 1.000 mg;\n- Metilprednisolona (succinato): pó para solução injetável de 500 mg;\n- Prednisona: comprimidos de 5 e 20 mg;\n- Rituximabe: solução injetável de 10 mg/mL.\nNota: Os medicamentos ciclofosfamida e metilprednisolona estão contemplados em procedimentos de pulsoterapia, sendo seu fornecimento de responsabilidade do serviço, não sendo dispensados no âmbito da Assistência Farmacêutica.",
   "pagina": 9,
   "completo": true
  },
  "esquemas": {
   "texto": "Ciclofosfamida: 15 mg/kg, via intravenosa, administrada três vezes no primeiro mês, com um intervalo de duas semanas e, então, a cada três semanas por até três a seis meses ou até a remissão, ajustando-se a dose conforme a contagem de linfócitos (mantida em torno de 1.000 células/mm³). A duração da infusão de ciclofosfamida pode variar entre 60 e 120 minutos, dependendo da dose a ser administrada42. A ciclofosfamida pode induzir náuseas e vômitos de forma moderada a alta, conforme a dose a ser administrada. Assim, recomenda-se a administração de antiemético como medida preventiva contra esses eventos adversos. Seu uso é contraindicado em pacientes com deficiência grave da função da medula óssea, cistite, obstrução das vias urinárias e infecções graves.\nMetilprednisolona: dose inicial de 1 g, por via intravenosa, em até três dias, conforme a manifestação da doença. Seu uso é contraindicado em pacientes com infecções sistêmicas por fungos; glaucoma; diabete melito descompensada; doença renal;\ndislipidemias e hipertensão arterial sistêmica.\nPrednisona: dose inicial de 1 mg/kg/dia, conforme a manifestação da doença. Seu uso é contraindicado em pacientes com diabete melito descompensado; glaucoma; infecção sistêmica; úlcera péptica ativa, doença renal ou hipertensão arterial sistêmica descompensada. Poderá ser necessário monitoramento por um período de até um ano após o término de tratamento prolongado ou com doses altas de corticosteroides.",
   "pagina": 9,
   "completo": false
  }
 }
];
