// Base Oficial de Medicamentos Registrados ANVISA (Amostra de Dados Abertos)
// Extraído diretamente de dados.anvisa.gov.br

export interface MedicamentoAnvisaOficial {
  id_anvisa: number;
  nome_produto: string;
  principio_ativo: string;
  classe_terapeutica: string;
  numero_registro_anvisa: string;
  laboratorio_fabricante: string;
  categoria_regulatoria: string;
  situacao_registro: string;
}

export const LISTA_MEDICAMENTOS_ANVISA_OFICIAL: MedicamentoAnvisaOficial[] = [
  {
    "id_anvisa": 3,
    "nome_produto": "LYSUGI",
    "principio_ativo": "pregabalina",
    "classe_terapeutica": "ANTICONVULSIVANTES",
    "numero_registro_anvisa": "151430058",
    "laboratorio_fabricante": "03978166000175 - DR. REDDYS FARMACÊUTICA DO BRASIL LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 4,
    "nome_produto": "MALEATO DE ENALAPRIL",
    "principio_ativo": "maleato de enalapril",
    "classe_terapeutica": "ANTI-HIPERTENSIVOS SIMPLES",
    "numero_registro_anvisa": "167730267",
    "laboratorio_fabricante": "05044984000126 - LEGRAND PHARMA INDÚSTRIA FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 5,
    "nome_produto": "MELAZTE",
    "principio_ativo": "temozolomida",
    "classe_terapeutica": "CITOSTATICOS ALQUILANTES",
    "numero_registro_anvisa": "102980586",
    "laboratorio_fabricante": "44734671000151 - CRISTÁLIA PRODUTOS QUÍMICOS FARMACÊUTICOS LTDA.",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 8,
    "nome_produto": "NOVALGINA",
    "principio_ativo": "dipirona monoidratada",
    "classe_terapeutica": "ANALGESICOS NAO NARCOTICOS",
    "numero_registro_anvisa": "186200018",
    "laboratorio_fabricante": "38391432000143 - OPELLA HEALTHCARE BRAZIL LTDA",
    "categoria_regulatoria": "Novo",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 11,
    "nome_produto": "OXACILINA SODICA",
    "principio_ativo": "oxacilina sódica",
    "classe_terapeutica": "ANTIBIOTICOS SISTEMICOS SIMPLES",
    "numero_registro_anvisa": "103700282",
    "laboratorio_fabricante": "17159229000176 - LABORATÓRIO TEUTO BRASILEIRO S/A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 17,
    "nome_produto": "SORO ANTIBOTRÓPICO-LAQUÉTICO",
    "principio_ativo": "imunoglobulina heteróloga contra veneno de bothrops sp, imunoglobulina heteóloga contra o veneno de lachesis muta",
    "classe_terapeutica": "SOROS IMUNOPROTETORES",
    "numero_registro_anvisa": "122340004",
    "laboratorio_fabricante": "61821344000156 - INSTITUTO BUTANTAN",
    "categoria_regulatoria": "Biológico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 18,
    "nome_produto": "TROMETAMOL CETOROLACO",
    "principio_ativo": "trometamol cetorolaco",
    "classe_terapeutica": "ANTINFLAMATORIOS",
    "numero_registro_anvisa": "167730239",
    "laboratorio_fabricante": "05044984000126 - LEGRAND PHARMA INDÚSTRIA FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 23,
    "nome_produto": "VIT. BIO D",
    "principio_ativo": "colecalciferol",
    "classe_terapeutica": "VITAMINA D E ANÁLOGOS",
    "numero_registro_anvisa": "105730133",
    "laboratorio_fabricante": "60659463002992 - ACHÉ LABORATÓRIOS FARMACÊUTICOS S.A",
    "categoria_regulatoria": "Específico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 29,
    "nome_produto": "IBANDRONATO DE SÓDIO MONOIDRATADO",
    "principio_ativo": "ibandronato de sódio monoidratado",
    "classe_terapeutica": "SUPRESSORES DA REABSORCAO OSSEA",
    "numero_registro_anvisa": "105830958",
    "laboratorio_fabricante": "45992062000165 - GERMED FARMACEUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 32,
    "nome_produto": "LANSOPRAZOL + CLARITROMICINA + AMOXICILINA",
    "principio_ativo": "lansoprazol, claritromicina, amoxicilina tri-hidratada",
    "classe_terapeutica": "ANTIACIDOS E ANTIULCEROSOS ASSOCIADOS",
    "numero_registro_anvisa": "103700540",
    "laboratorio_fabricante": "17159229000176 - LABORATÓRIO TEUTO BRASILEIRO S/A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 33,
    "nome_produto": "LEVOFLOXACINO",
    "principio_ativo": "levofloxacino hemiidratado",
    "classe_terapeutica": "ANTIBIOTICOS SISTEMICOS SIMPLES",
    "numero_registro_anvisa": "103700660",
    "laboratorio_fabricante": "17159229000176 - LABORATÓRIO TEUTO BRASILEIRO S/A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 36,
    "nome_produto": "NISTAMAX",
    "principio_ativo": "nistatina",
    "classe_terapeutica": "ANTIMICOTICO",
    "numero_registro_anvisa": "138410028",
    "laboratorio_fabricante": "02456955000183 - NATULAB LABORATORIO S.A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 45,
    "nome_produto": "AZTREONAM",
    "principio_ativo": "aztreonam",
    "classe_terapeutica": "ANTIBIOTICOS SISTEMICOS SIMPLES",
    "numero_registro_anvisa": "100630231",
    "laboratorio_fabricante": "33258401000103 - INSTITUTO BIOCHIMICO INDÚSTRIA FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 46,
    "nome_produto": "BROMIDRATO DE GALANTAMINA",
    "principio_ativo": "bromidrato de galantamina",
    "classe_terapeutica": "OUTROS PRODUTOS QUE ATUAM SOBRE O SISTEMA NERVOSO",
    "numero_registro_anvisa": "125680250",
    "laboratorio_fabricante": "73856593000166 - PRATI DONADUZZI & CIA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 54,
    "nome_produto": "KEFLIN NEUTRO",
    "principio_ativo": "cefalotina sodica, cefalotina sódica tamponada",
    "classe_terapeutica": "ANTIBIOTICOS SISTEMICOS SIMPLES",
    "numero_registro_anvisa": "155620004",
    "laboratorio_fabricante": "05439635000103 - ANTIBIÓTICOS DO BRASIL LTDA",
    "categoria_regulatoria": "Novo",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 55,
    "nome_produto": "LEVETIRACETAM",
    "principio_ativo": "levetiracetam",
    "classe_terapeutica": "ANTICONVULSIVANTES",
    "numero_registro_anvisa": "100431270",
    "laboratorio_fabricante": "61190096000192 - EUROFARMA LABORATORIOS S.A.",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 57,
    "nome_produto": "NORADOP",
    "principio_ativo": "cloridrato de bupropiona",
    "classe_terapeutica": "ANTITABAGICO",
    "numero_registro_anvisa": "118190317",
    "laboratorio_fabricante": "92265552000905 - MULTILAB INDUSTRIA E COMERCIO DE PRODUTOS FARMACEUTICOS LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 58,
    "nome_produto": "OXALATO DE ESCITALOPRAM",
    "principio_ativo": "oxalato de escitalopram",
    "classe_terapeutica": "ANTIDEPRESSIVOS",
    "numero_registro_anvisa": "100630274",
    "laboratorio_fabricante": "33258401000103 - INSTITUTO BIOCHIMICO INDÚSTRIA FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 60,
    "nome_produto": "RESFEGARGANTA",
    "principio_ativo": "cloreto de cetilpiridínio, benzocaína",
    "classe_terapeutica": "ANTINFECCIOSOS E ANTISSEPTICOS TOPICOS PARA OROFARINGE",
    "numero_registro_anvisa": "106890215",
    "laboratorio_fabricante": "92695691000103 - KLEY HERTZ FARMACEUTICA S.A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 71,
    "nome_produto": "ADENOSINA",
    "principio_ativo": "adenosina",
    "classe_terapeutica": "OUTROS PRODUTOS COM ACAO NO MIOCARDIO E SISTEMA DE CONDUCAO",
    "numero_registro_anvisa": "110110054",
    "laboratorio_fabricante": "59088333000167 - NEWCOM FARMACEUTICA LTDA.",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 72,
    "nome_produto": "AMOXICILINA",
    "principio_ativo": "amoxicilina tri-hidratada",
    "classe_terapeutica": "PENICILINA DE AMPLO ESPECTRO",
    "numero_registro_anvisa": "125680147",
    "laboratorio_fabricante": "73856593000166 - PRATI DONADUZZI & CIA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 76,
    "nome_produto": "BIOLME H",
    "principio_ativo": "olmesartana medoxomila, hidroclorotiazida",
    "classe_terapeutica": "ANTI-HIPERTENSIVOS-ASSOCIACOES MEDICAMENTOSAS",
    "numero_registro_anvisa": "109740375",
    "laboratorio_fabricante": "49475833000106 - BIOLAB SANUS FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 77,
    "nome_produto": "CEFTRIONA",
    "principio_ativo": "ceftriaxona dissódica hemieptaidratada",
    "classe_terapeutica": "ANTIBIOTICOS SISTEMICOS SIMPLES",
    "numero_registro_anvisa": "110110046",
    "laboratorio_fabricante": "59088333000167 - NEWCOM FARMACEUTICA LTDA.",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 80,
    "nome_produto": "CLORIDRATO DE METFORMINA",
    "principio_ativo": "cloridrato de metformina",
    "classe_terapeutica": "ANTIDIABETICOS",
    "numero_registro_anvisa": "154230270",
    "laboratorio_fabricante": "03485572000104 - GEOLAB INDÚSTRIA FARMACÊUTICA S/A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 81,
    "nome_produto": "DESOGESTREL",
    "principio_ativo": "desogestrel",
    "classe_terapeutica": "ANTICONCEPCIONAIS",
    "numero_registro_anvisa": "100681149",
    "laboratorio_fabricante": "56994502000130 - NOVARTIS BIOCIENCIAS S.A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 86,
    "nome_produto": "GAPEM",
    "principio_ativo": "gabapentina",
    "classe_terapeutica": "ANTICONVULSIVANTES",
    "numero_registro_anvisa": "125680296",
    "laboratorio_fabricante": "73856593000166 - PRATI DONADUZZI & CIA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 87,
    "nome_produto": "GIFUZ",
    "principio_ativo": "fosfato de sitagliptina, cloridrato de metformina",
    "classe_terapeutica": "ANTIDIABETICOS",
    "numero_registro_anvisa": "165070047",
    "laboratorio_fabricante": "24633934000129 - CAMBER FARMACEUTICA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 95,
    "nome_produto": "MEVAMOX",
    "principio_ativo": "meloxicam",
    "classe_terapeutica": "ANTINFLAMATORIOS",
    "numero_registro_anvisa": "103700257",
    "laboratorio_fabricante": "17159229000176 - LABORATÓRIO TEUTO BRASILEIRO S/A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 97,
    "nome_produto": "MYLLCIS",
    "principio_ativo": "cisplatina",
    "classe_terapeutica": "ANTINEOPLASICO",
    "numero_registro_anvisa": "188300055",
    "laboratorio_fabricante": "11643096000122 - VIATRIS FARMACEUTICA DO BRASIL LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 102,
    "nome_produto": "NORFLOXACINO",
    "principio_ativo": "norfloxacino",
    "classe_terapeutica": "ANTIBIOTICOS SISTEMICOS SIMPLES",
    "numero_registro_anvisa": "118190068",
    "laboratorio_fabricante": "92265552000905 - MULTILAB INDUSTRIA E COMERCIO DE PRODUTOS FARMACEUTICOS LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 111,
    "nome_produto": "VILDAGLIPTINA",
    "principio_ativo": "vildagliptina",
    "classe_terapeutica": "ANTIDIABETICOS",
    "numero_registro_anvisa": "165070055",
    "laboratorio_fabricante": "24633934000129 - CAMBER FARMACEUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 112,
    "nome_produto": "VILDAGLIPTINA + CLORIDRATO DE METFORMINA",
    "principio_ativo": "vildagliptina, cloridrato de metformina",
    "classe_terapeutica": "ANTIDIABETICOS",
    "numero_registro_anvisa": "155840702",
    "laboratorio_fabricante": "05161069000110 - BRAINFARMA INDÚSTRIA QUÍMICA E FARMACÊUTICA S.A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 114,
    "nome_produto": "ALBENDAZOL",
    "principio_ativo": "albendazol",
    "classe_terapeutica": "Farmacoterápico",
    "numero_registro_anvisa": "103700492",
    "laboratorio_fabricante": "17159229000176 - LABORATÓRIO TEUTO BRASILEIRO S/A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 122,
    "nome_produto": "CORRETAL",
    "principio_ativo": "capecitabina",
    "classe_terapeutica": "OUTROS ANTINEOPLASICOS",
    "numero_registro_anvisa": "100431210",
    "laboratorio_fabricante": "61190096000192 - EUROFARMA LABORATORIOS S.A.",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 130,
    "nome_produto": "ADVIL",
    "principio_ativo": "ibuprofeno",
    "classe_terapeutica": "ANALGESICOS NAO NARCOTICOS",
    "numero_registro_anvisa": "192900005",
    "laboratorio_fabricante": "30872270000153 - PF CONSUMER HEALTHCARE BRAZIL IMPORTADORA E DISTRIBUIDORA DE ME",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 131,
    "nome_produto": "ALPRAZOLAM",
    "principio_ativo": "alprazolam",
    "classe_terapeutica": "ANSIOLITICOS SIMPLES",
    "numero_registro_anvisa": "167730496",
    "laboratorio_fabricante": "05044984000126 - LEGRAND PHARMA INDÚSTRIA FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 132,
    "nome_produto": "BUPIUM",
    "principio_ativo": "cloridrato de bupropiona",
    "classe_terapeutica": "ANTITABAGICO",
    "numero_registro_anvisa": "135690730",
    "laboratorio_fabricante": "00923140000131 - EMS SIGMA PHARMA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 134,
    "nome_produto": "CLOPIVIX",
    "principio_ativo": "bissulfato de clopidogrel",
    "classe_terapeutica": "OUTROS MEDICAMENTOS DE ACAO NO APARELHO CARDIOVASCULAR",
    "numero_registro_anvisa": "151430013",
    "laboratorio_fabricante": "03978166000175 - DR. REDDYS FARMACÊUTICA DO BRASIL LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 136,
    "nome_produto": "CLORIDRATO DE NAFAZOLINA",
    "principio_ativo": "cloridrato de nafazolina",
    "classe_terapeutica": "DESCONGESTIONANTES NASAIS TOPICOS",
    "numero_registro_anvisa": "102350718",
    "laboratorio_fabricante": "57507378000365 - EMS S/A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 138,
    "nome_produto": "DAPAGLIFLOZINA PROPANODIOL",
    "principio_ativo": "dapagliflozina propanodiol monoidratado",
    "classe_terapeutica": "ANTIDIABETICOS",
    "numero_registro_anvisa": "116180292",
    "laboratorio_fabricante": "60318797000100 - ASTRAZENECA DO BRASIL LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 139,
    "nome_produto": "DESDIFF",
    "principio_ativo": "succinato de desvenlafaxina monoidratado",
    "classe_terapeutica": "ANTIDEPRESSIVOS",
    "numero_registro_anvisa": "104300050",
    "laboratorio_fabricante": "42457796000156 - DIFFUCAP - CHEMOBRÁS QUÍMICA E FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 142,
    "nome_produto": "FASLODEX",
    "principio_ativo": "fulvestranto",
    "classe_terapeutica": "ANTINEOPLASICO",
    "numero_registro_anvisa": "116180114",
    "laboratorio_fabricante": "60318797000100 - ASTRAZENECA DO BRASIL LTDA",
    "categoria_regulatoria": "Novo",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 143,
    "nome_produto": "GENGIMIN",
    "principio_ativo": "zingiber officinale roscoe",
    "classe_terapeutica": "Farmacoterápico",
    "numero_registro_anvisa": "103900185",
    "laboratorio_fabricante": "33349473000158 - FARMOQUÍMICA S/A",
    "categoria_regulatoria": "Fitoterápico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 148,
    "nome_produto": "KALYDECO",
    "principio_ativo": "ivacaftor",
    "classe_terapeutica": "OUTROS PRODUTOS PARA O APARELHO RESPIRATORIO",
    "numero_registro_anvisa": "138230002",
    "laboratorio_fabricante": "21798065000102 - VERTEX FARMACEUTICA DO BRASIL LTDA.",
    "categoria_regulatoria": "Novo",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 153,
    "nome_produto": "MESILATO DE IMATINIBE",
    "principio_ativo": "mesilato de imatinibe",
    "classe_terapeutica": "ANTINEOPLASICO",
    "numero_registro_anvisa": "116370222",
    "laboratorio_fabricante": "58430828000160 - BLAU FARMACÊUTICA S.A.",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 155,
    "nome_produto": "NEBACIMED",
    "principio_ativo": "sulfato de neomicina, bacitracina zíncica",
    "classe_terapeutica": "ANTINFECCIOSOS TOPICOS-ASSOCIACOES MEDICAMENTOSAS",
    "numero_registro_anvisa": "143810086",
    "laboratorio_fabricante": "02814497000107 - CIMED INDUSTRIA S.A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 158,
    "nome_produto": "CIPROBACTER",
    "principio_ativo": "ciprofloxacino",
    "classe_terapeutica": "ANTIBIOTICOS SISTEMICOS SIMPLES",
    "numero_registro_anvisa": "103110151",
    "laboratorio_fabricante": "01571702000198 - HALEX ISTAR INDÚSTRIA FARMACÊUTICA SA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 162,
    "nome_produto": "CORDAREX",
    "principio_ativo": "besilato de anlodipino",
    "classe_terapeutica": "ANTI-HIPERTENSIVOS SIMPLES",
    "numero_registro_anvisa": "105730584",
    "laboratorio_fabricante": "60659463002992 - ACHÉ LABORATÓRIOS FARMACÊUTICOS S.A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 164,
    "nome_produto": "ETORICOXIBE",
    "principio_ativo": "etoricoxibe",
    "classe_terapeutica": "ANTINFLAMATORIOS ANTIREUMATICOS",
    "numero_registro_anvisa": "123520301",
    "laboratorio_fabricante": "73663650000190 - RANBAXY FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 165,
    "nome_produto": "HEMIFUMARATO DE QUETIAPINA",
    "principio_ativo": "hemifumarato de quetiapina",
    "classe_terapeutica": "ANTIPSICOTICOS",
    "numero_registro_anvisa": "100470492",
    "laboratorio_fabricante": "61286647000116 - SANDOZ DO BRASIL INDÚSTRIA FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 171,
    "nome_produto": "NICOTINELL",
    "principio_ativo": "nicotina",
    "classe_terapeutica": "ANTITABAGICO",
    "numero_registro_anvisa": "151430101",
    "laboratorio_fabricante": "03978166000175 - DR. REDDYS FARMACÊUTICA DO BRASIL LTDA",
    "categoria_regulatoria": "Específico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 174,
    "nome_produto": "PROPRANOLOL",
    "principio_ativo": "cloridrato de propranolol",
    "classe_terapeutica": "BETABLOQUEADORES SIMPLES",
    "numero_registro_anvisa": "135690710",
    "laboratorio_fabricante": "00923140000131 - EMS SIGMA PHARMA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 175,
    "nome_produto": "RISEDRONATO SÓDICO",
    "principio_ativo": "risedronato sódico",
    "classe_terapeutica": "SUPRESSORES DA REABSORCAO OSSEA",
    "numero_registro_anvisa": "118190343",
    "laboratorio_fabricante": "92265552000905 - MULTILAB INDUSTRIA E COMERCIO DE PRODUTOS FARMACEUTICOS LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 184,
    "nome_produto": "CARVEDILOL",
    "principio_ativo": "carvedilol",
    "classe_terapeutica": "ANTI-HIPERTENSIVOS SIMPLES",
    "numero_registro_anvisa": "105250038",
    "laboratorio_fabricante": "33078528000132 - TORRENT DO BRASIL LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 185,
    "nome_produto": "CLORIDRATO DE RANITIDINA",
    "principio_ativo": "cloridrato de ranitidina",
    "classe_terapeutica": "ANTIULCEROSOS",
    "numero_registro_anvisa": "110850025",
    "laboratorio_fabricante": "06628333000146 - FARMACE INDÚSTRIA QUÍMICO-FARMACÊUTICA CEARENSE LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 186,
    "nome_produto": "CYMEVIR",
    "principio_ativo": "ganciclovir, ganciclovir sódico",
    "classe_terapeutica": "ANTIVIROTICOS",
    "numero_registro_anvisa": "103110100",
    "laboratorio_fabricante": "01571702000198 - HALEX ISTAR INDÚSTRIA FARMACÊUTICA SA",
    "categoria_regulatoria": "Novo",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 190,
    "nome_produto": "FLEBOGAMMA",
    "principio_ativo": "imunoglobulina humana",
    "classe_terapeutica": "IMUNOGLOBULINAS",
    "numero_registro_anvisa": "136410002",
    "laboratorio_fabricante": "02513899000171 - GRIFOLS BRASIL LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 192,
    "nome_produto": "HEMIFUMARATO DE QUETIAPINA",
    "principio_ativo": "hemifumarato de quetiapina",
    "classe_terapeutica": "OUTROS PRODS  NAO ENQUADRADOS EM CLASSE TERAPEUTICA ESPECIF",
    "numero_registro_anvisa": "110390205",
    "laboratorio_fabricante": "43640754000119 - FUNDAÇÃO PARA O REMÉDIO POPULAR - FURP",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 198,
    "nome_produto": "PANTOPRAZOL",
    "principio_ativo": "pantoprazol",
    "classe_terapeutica": "ANTIULCEROSOS",
    "numero_registro_anvisa": "155370012",
    "laboratorio_fabricante": "64171697000146 - ACCORD FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 199,
    "nome_produto": "PREZISTA",
    "principio_ativo": "etanolato de darunavir, darunavir",
    "classe_terapeutica": "ANTIRETROVIRAL",
    "numero_registro_anvisa": "112363387",
    "laboratorio_fabricante": "51780468000187 - JANSSEN-CILAG FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Novo",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 202,
    "nome_produto": "SEDAMED",
    "principio_ativo": "cafeína, cafeína anidra, dipirona, dipirona monoidratada, cloridrato de isometepteno, mucato de isometepteno",
    "classe_terapeutica": "ANALGESICOS NAO NARCOTICOS",
    "numero_registro_anvisa": "143810119",
    "laboratorio_fabricante": "02814497000107 - CIMED INDUSTRIA S.A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 205,
    "nome_produto": "ARIPIPRAZOL",
    "principio_ativo": "aripiprazol",
    "classe_terapeutica": "ANTIPSICOTICOS",
    "numero_registro_anvisa": "102351411",
    "laboratorio_fabricante": "57507378000365 - EMS S/A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 211,
    "nome_produto": "CLORIDRATO DE SOTALOL",
    "principio_ativo": "cloridrato de sotalol",
    "classe_terapeutica": "BETABLOQUEADORES SIMPLES",
    "numero_registro_anvisa": "155840496",
    "laboratorio_fabricante": "05161069000110 - BRAINFARMA INDÚSTRIA QUÍMICA E FARMACÊUTICA S.A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 212,
    "nome_produto": "DIPROPIONATO DE BECLOMETASONA",
    "principio_ativo": "dipropionato de beclometasona",
    "classe_terapeutica": "ANTIASMATICOS",
    "numero_registro_anvisa": "100580119",
    "laboratorio_fabricante": "61363032000146 - CHIESI FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 213,
    "nome_produto": "EMPAGLIFLOZINA",
    "principio_ativo": "empagliflozina",
    "classe_terapeutica": "ANTIDIABETICOS",
    "numero_registro_anvisa": "125680391",
    "laboratorio_fabricante": "73856593000166 - PRATI DONADUZZI & CIA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 215,
    "nome_produto": "GLICOSE",
    "principio_ativo": "glicose anidra",
    "classe_terapeutica": "REPOSICAO HIDROELETROLITICA E ALIMENTACAO PARENTERAL",
    "numero_registro_anvisa": "171270003",
    "laboratorio_fabricante": "44593084000190 - VITAMED MEDICAMENTOS E PRODUTOS PARA SAUDE LTDA",
    "categoria_regulatoria": "Específico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 217,
    "nome_produto": "HARPAGON",
    "principio_ativo": "harpagophytum procumbens dc. ex meissn. e/ou harpagophytum zeyheri decne",
    "classe_terapeutica": "Farmacoterápico",
    "numero_registro_anvisa": "115600248",
    "laboratorio_fabricante": "17562075000169 - CIFARMA CIENTÍFICA FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Fitoterápico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 231,
    "nome_produto": "PLAGREL",
    "principio_ativo": "bissulfato de clopidogrel",
    "classe_terapeutica": "OUTROS MEDICAMENTOS DE ACAO NO APARELHO CARDIOVASCULAR",
    "numero_registro_anvisa": "100470423",
    "laboratorio_fabricante": "61286647000116 - SANDOZ DO BRASIL INDÚSTRIA FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 240,
    "nome_produto": "SUCRAFILM",
    "principio_ativo": "sucralfato",
    "classe_terapeutica": "ANTIULCEROSOS",
    "numero_registro_anvisa": "135690617",
    "laboratorio_fabricante": "00923140000131 - EMS SIGMA PHARMA LTDA",
    "categoria_regulatoria": "Específico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 242,
    "nome_produto": "TELD HCT",
    "principio_ativo": "telmisartana, hidroclorotiazida",
    "classe_terapeutica": "ANTI-HIPERTENSIVOS-ASSOCIACOES MEDICAMENTOSAS",
    "numero_registro_anvisa": "105250101",
    "laboratorio_fabricante": "33078528000132 - TORRENT DO BRASIL LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 243,
    "nome_produto": "VILDAGLIPTINA + CLORIDRATO DE METFORMINA",
    "principio_ativo": "vildagliptina, cloridrato de metformina",
    "classe_terapeutica": "ANTIDIABETICOS",
    "numero_registro_anvisa": "155370121",
    "laboratorio_fabricante": "64171697000146 - ACCORD FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 244,
    "nome_produto": "VITAMINA D3",
    "principio_ativo": "colecalciferol",
    "classe_terapeutica": "ANALOGO SINTETICO DA VITAMINA D",
    "numero_registro_anvisa": "100431599",
    "laboratorio_fabricante": "61190096000192 - EUROFARMA LABORATORIOS S.A.",
    "categoria_regulatoria": "Específico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 253,
    "nome_produto": "CIPROFIBRATO",
    "principio_ativo": "ciprofibrato",
    "classe_terapeutica": "ANTILIPEMICOS",
    "numero_registro_anvisa": "155840195",
    "laboratorio_fabricante": "05161069000110 - BRAINFARMA INDÚSTRIA QUÍMICA E FARMACÊUTICA S.A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 254,
    "nome_produto": "CIPROFLOXACINO",
    "principio_ativo": "ciprofloxacino",
    "classe_terapeutica": "ANTIBIOTICOS SISTEMICOS SIMPLES",
    "numero_registro_anvisa": "103460024",
    "laboratorio_fabricante": "47231121000108 - BEKER PRODUTOS FÁRMACO HOSPITALARES LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 255,
    "nome_produto": "CLORIDRATO DE PAZOPANIBE",
    "principio_ativo": "cloridrato de pazopanibe",
    "classe_terapeutica": "ANTINEOPLASICO",
    "numero_registro_anvisa": "100431547",
    "laboratorio_fabricante": "61190096000192 - EUROFARMA LABORATORIOS S.A.",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 260,
    "nome_produto": "ERITROMAX",
    "principio_ativo": "alfaepoetina",
    "classe_terapeutica": "OUTROS PRODUTOS QUE ATUAM NO SANGUE E HEMATOPOIESE",
    "numero_registro_anvisa": "116370024",
    "laboratorio_fabricante": "58430828000160 - BLAU FARMACÊUTICA S.A.",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 269,
    "nome_produto": "NOXX",
    "principio_ativo": "enoxaparina sódica",
    "classe_terapeutica": "ANTITROMBOTICO",
    "numero_registro_anvisa": "116370175",
    "laboratorio_fabricante": "58430828000160 - BLAU FARMACÊUTICA S.A.",
    "categoria_regulatoria": "Biológico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 273,
    "nome_produto": "RUVA",
    "principio_ativo": "rosuvastatina cálcica",
    "classe_terapeutica": "ANTILIPEMICOS",
    "numero_registro_anvisa": "100431310",
    "laboratorio_fabricante": "61190096000192 - EUROFARMA LABORATORIOS S.A.",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 278,
    "nome_produto": "TIMOPTOL",
    "principio_ativo": "maleato de timolol",
    "classe_terapeutica": "ANTIGLAUCOMATOSOS",
    "numero_registro_anvisa": "191980006",
    "laboratorio_fabricante": "15127898000130 - MUNDIPHARMA BRASIL PRODUTOS MÉDICOS E FARMACÊUTICOS LTDA",
    "categoria_regulatoria": "Novo",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 281,
    "nome_produto": "ZILEPAM",
    "principio_ativo": "clonazepam",
    "classe_terapeutica": "ANTICONVULSIVANTES",
    "numero_registro_anvisa": "154230175",
    "laboratorio_fabricante": "03485572000104 - GEOLAB INDÚSTRIA FARMACÊUTICA S/A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 283,
    "nome_produto": "ACICLOVIR",
    "principio_ativo": "aciclovir",
    "classe_terapeutica": "ANTIVIROTICOS",
    "numero_registro_anvisa": "125680111",
    "laboratorio_fabricante": "73856593000166 - PRATI DONADUZZI & CIA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 285,
    "nome_produto": "ÁGUA PARA INJETÁVEIS",
    "principio_ativo": "água para injetáveis",
    "classe_terapeutica": "DILUENTES E VEICULOS DE MEDICAMENTOS",
    "numero_registro_anvisa": "155920002",
    "laboratorio_fabricante": "04459117000199 - SAMTEC BIOTECNOLOGIA LIMITADA",
    "categoria_regulatoria": "Específico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 289,
    "nome_produto": "CLORIDRATO DE DILTIAZEM",
    "principio_ativo": "cloridrato de diltiazem",
    "classe_terapeutica": "ANTIANGINOSOS E VASODILATADORES",
    "numero_registro_anvisa": "118190460",
    "laboratorio_fabricante": "92265552000905 - MULTILAB INDUSTRIA E COMERCIO DE PRODUTOS FARMACEUTICOS LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 295,
    "nome_produto": "FRUMAGNA",
    "principio_ativo": "bicarbonato de sódio, carbonato de sódio, ácido cítrico",
    "classe_terapeutica": "ANTIACIDO",
    "numero_registro_anvisa": "143810302",
    "laboratorio_fabricante": "02814497000107 - CIMED INDUSTRIA S.A",
    "categoria_regulatoria": "Específico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 297,
    "nome_produto": "HEMITARTARATO DE ZOLPIDEM",
    "principio_ativo": "hemitartarato de zolpidem",
    "classe_terapeutica": "HIPNOTICOS",
    "numero_registro_anvisa": "101180668",
    "laboratorio_fabricante": "62462015000129 - APSEN FARMACEUTICA S/A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 299,
    "nome_produto": "IBUPROTRAT",
    "principio_ativo": "ibuprofeno",
    "classe_terapeutica": "ANALGESICOS NAO NARCOTICOS",
    "numero_registro_anvisa": "138410033",
    "laboratorio_fabricante": "02456955000183 - NATULAB LABORATORIO S.A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 303,
    "nome_produto": "MESILATO DE RASAGILINA",
    "principio_ativo": "mesilato de rasagilina",
    "classe_terapeutica": "ANTIPARKINSONIANOS",
    "numero_registro_anvisa": "155730052",
    "laboratorio_fabricante": "05333542000108 - TEVA FARMACÊUTICA LTDA.",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 304,
    "nome_produto": "MEZOLIUM",
    "principio_ativo": "esomeprazol magnésico tri-hidratado",
    "classe_terapeutica": "ANTIULCEROSOS",
    "numero_registro_anvisa": "105830843",
    "laboratorio_fabricante": "45992062000165 - GERMED FARMACEUTICA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 311,
    "nome_produto": "DOPROPIZINA",
    "principio_ativo": "dropropizina",
    "classe_terapeutica": "ANTITUSSIGENOS",
    "numero_registro_anvisa": "125680091",
    "laboratorio_fabricante": "73856593000166 - PRATI DONADUZZI & CIA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 312,
    "nome_produto": "DULLO",
    "principio_ativo": "cloridrato de duloxetina",
    "classe_terapeutica": "ANTIDEPRESSIVOS",
    "numero_registro_anvisa": "146820092",
    "laboratorio_fabricante": "05035244000123 - SUN FARMACÊUTICA DO BRASIL LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 332,
    "nome_produto": "BENALQ",
    "principio_ativo": "cloridrato de bendamustina",
    "classe_terapeutica": "ANTINEOPLASICOS CITOTOXICOS",
    "numero_registro_anvisa": "155730047",
    "laboratorio_fabricante": "05333542000108 - TEVA FARMACÊUTICA LTDA.",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 338,
    "nome_produto": "CLORIDRATO DE SERTRALINA",
    "principio_ativo": "cloridrato de sertralina",
    "classe_terapeutica": "ANTIDEPRESSIVOS",
    "numero_registro_anvisa": "167730431",
    "laboratorio_fabricante": "05044984000126 - LEGRAND PHARMA INDÚSTRIA FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 340,
    "nome_produto": "ESPIRONOLACTONA",
    "principio_ativo": "espironolactona",
    "classe_terapeutica": "DIURETICOS SIMPLES",
    "numero_registro_anvisa": "194270113",
    "laboratorio_fabricante": "14806008000154 - MOMENTA FARMACÊUTICA LTDA.",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 342,
    "nome_produto": "GLICOBRAS",
    "principio_ativo": "fludesoxiglicose 18f",
    "classe_terapeutica": "AGENTES DIAGNOSTICOS RADIOATIVOS",
    "numero_registro_anvisa": "185120001",
    "laboratorio_fabricante": "08820007000161 - CMR CAMPINAS PHARMA LTDA",
    "categoria_regulatoria": "Radiofármaco",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 346,
    "nome_produto": "MALEATO DE ENALAPRIL",
    "principio_ativo": "maleato de enalapril",
    "classe_terapeutica": "ANTI-HIPERTENSIVOS SIMPLES",
    "numero_registro_anvisa": "109740274",
    "laboratorio_fabricante": "49475833000106 - BIOLAB SANUS FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 349,
    "nome_produto": "NEOCOFLAN",
    "principio_ativo": "diclofenaco dietilamônio",
    "classe_terapeutica": "ANTINFLAMATORIOS",
    "numero_registro_anvisa": "155840305",
    "laboratorio_fabricante": "05161069000110 - BRAINFARMA INDÚSTRIA QUÍMICA E FARMACÊUTICA S.A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 353,
    "nome_produto": "RUNNER",
    "principio_ativo": "rosuvastatina cálcica",
    "classe_terapeutica": "ANTILIPEMICOS",
    "numero_registro_anvisa": "105730007",
    "laboratorio_fabricante": "60659463002992 - ACHÉ LABORATÓRIOS FARMACÊUTICOS S.A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 356,
    "nome_produto": "URSIX",
    "principio_ativo": "ácido ursodesoxicólico",
    "classe_terapeutica": "COLAGOGOS, COLERETICOS E HEPATOPROTETORES",
    "numero_registro_anvisa": "101180661",
    "laboratorio_fabricante": "62462015000129 - APSEN FARMACEUTICA S/A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 360,
    "nome_produto": "BHENA",
    "principio_ativo": "cloridrato de benazepril",
    "classe_terapeutica": "ANTI-HIPERTENSIVOS SIMPLES",
    "numero_registro_anvisa": "109740293",
    "laboratorio_fabricante": "49475833000106 - BIOLAB SANUS FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 361,
    "nome_produto": "BIOVICERIN",
    "principio_ativo": "bacillus cereus",
    "classe_terapeutica": "OUTROS COADJUVANTES DO TRATAMENTO DA DIARREIA",
    "numero_registro_anvisa": "104430009",
    "laboratorio_fabricante": "92670801000182 - GEYER MEDICAMENTOS S.A.",
    "categoria_regulatoria": "Biológico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 364,
    "nome_produto": "CELECOXIBE",
    "principio_ativo": "celecoxibe",
    "classe_terapeutica": "ANTINFLAMATORIOS",
    "numero_registro_anvisa": "102351330",
    "laboratorio_fabricante": "57507378000365 - EMS S/A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 369,
    "nome_produto": "DEFLAIMMUN",
    "principio_ativo": "deflazacorte",
    "classe_terapeutica": "GLICOCORTICOIDES SISTEMICOS",
    "numero_registro_anvisa": "135690594",
    "laboratorio_fabricante": "00923140000131 - EMS SIGMA PHARMA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 372,
    "nome_produto": "ENTARKIN",
    "principio_ativo": "entacapona",
    "classe_terapeutica": "ANTIPARKINSONIANOS",
    "numero_registro_anvisa": "135690587",
    "laboratorio_fabricante": "00923140000131 - EMS SIGMA PHARMA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 374,
    "nome_produto": "GUACOLIN",
    "principio_ativo": "mikania glomerata spreng.",
    "classe_terapeutica": "Farmacoterápico",
    "numero_registro_anvisa": "106570016",
    "laboratorio_fabricante": "84712579000105 - KRESS FARMACEUTICA S.A.",
    "categoria_regulatoria": "Fitoterápico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 375,
    "nome_produto": "HEMIFUMARATO DE QUETIAPINA",
    "principio_ativo": "hemifumarato de quetiapina",
    "classe_terapeutica": "OUTROS PRODS  NAO ENQUADRADOS EM CLASSE TERAPEUTICA ESPECIF",
    "numero_registro_anvisa": "118190458",
    "laboratorio_fabricante": "92265552000905 - MULTILAB INDUSTRIA E COMERCIO DE PRODUTOS FARMACEUTICOS LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 376,
    "nome_produto": "HEMITARTARATO DE ZOLPIDEM",
    "principio_ativo": "hemitartarato de zolpidem",
    "classe_terapeutica": "HIPNOTICOS",
    "numero_registro_anvisa": "118190481",
    "laboratorio_fabricante": "92265552000905 - MULTILAB INDUSTRIA E COMERCIO DE PRODUTOS FARMACEUTICOS LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 382,
    "nome_produto": "PICBAM",
    "principio_ativo": "apixabana",
    "classe_terapeutica": "ANTITROMBOTICO",
    "numero_registro_anvisa": "178170921",
    "laboratorio_fabricante": "61082426000207 - COSMED INDUSTRIA DE COSMETICOS E MEDICAMENTOS S.A.",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 385,
    "nome_produto": "UTROGESTAN",
    "principio_ativo": "progesterona",
    "classe_terapeutica": "PROGESTAGENOS SIMPLES",
    "numero_registro_anvisa": "187590001",
    "laboratorio_fabricante": "11082598000393 - BESINS HEALTHCARE BRASIL COMERCIAL E DISTRIBUIDORA DE MEDICAMEN",
    "categoria_regulatoria": "Novo",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 389,
    "nome_produto": "CIPROFIBRATO",
    "principio_ativo": "ciprofibrato",
    "classe_terapeutica": "ANTILIPEMICOS",
    "numero_registro_anvisa": "103700737",
    "laboratorio_fabricante": "17159229000176 - LABORATÓRIO TEUTO BRASILEIRO S/A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 391,
    "nome_produto": "DIPIRONA SÓDICA",
    "principio_ativo": "dipirona",
    "classe_terapeutica": "ANALGESICOS NAO NARCOTICOS",
    "numero_registro_anvisa": "117720023",
    "laboratorio_fabricante": "01784792000103 - EQUIPLEX INDÚSTRIA FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 392,
    "nome_produto": "DRICS",
    "principio_ativo": "cloridrato de hidroxizina",
    "classe_terapeutica": "ANTI-HISTAMINICOS SISTEMICOS",
    "numero_registro_anvisa": "178170871",
    "laboratorio_fabricante": "61082426000207 - COSMED INDUSTRIA DE COSMETICOS E MEDICAMENTOS S.A.",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 395,
    "nome_produto": "ITRACONAZOL",
    "principio_ativo": "itraconazol",
    "classe_terapeutica": "ANTIMICOTICO",
    "numero_registro_anvisa": "110390215",
    "laboratorio_fabricante": "43640754000119 - FUNDAÇÃO PARA O REMÉDIO POPULAR - FURP",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 401,
    "nome_produto": "VITAMINA D3",
    "principio_ativo": "colecalciferol",
    "classe_terapeutica": "ANALOGO SINTETICO DA VITAMINA D",
    "numero_registro_anvisa": "109740352",
    "laboratorio_fabricante": "49475833000106 - BIOLAB SANUS FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Específico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 402,
    "nome_produto": "ALGIE",
    "principio_ativo": "cetoprofeno",
    "classe_terapeutica": "ANTIINFLAMATÓRIOS E ANTIREUMÁTICOS",
    "numero_registro_anvisa": "100431353",
    "laboratorio_fabricante": "61190096000192 - EUROFARMA LABORATORIOS S.A.",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 404,
    "nome_produto": "CITRATO DE SILDENAFILA",
    "principio_ativo": "citrato de sildenafila",
    "classe_terapeutica": "VASODILATADORES",
    "numero_registro_anvisa": "102351117",
    "laboratorio_fabricante": "57507378000365 - EMS S/A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 406,
    "nome_produto": "CLORIDRATO DE METILFENIDATO",
    "principio_ativo": "cloridrato de metilfenidato",
    "classe_terapeutica": "PSICOANALETICOS",
    "numero_registro_anvisa": "155730059",
    "laboratorio_fabricante": "05333542000108 - TEVA FARMACÊUTICA LTDA.",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 408,
    "nome_produto": "DIVELOL",
    "principio_ativo": "carvedilol",
    "classe_terapeutica": "BETABLOQUEADORES SIMPLES",
    "numero_registro_anvisa": "101460065",
    "laboratorio_fabricante": "61150447000131 - LABORATÓRIOS BALDACCI LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 411,
    "nome_produto": "KATRIZAN",
    "principio_ativo": "sulfato de neomicina, bacitracina",
    "classe_terapeutica": "ANTINFECCIOSOS TOPICOS",
    "numero_registro_anvisa": "103920108",
    "laboratorio_fabricante": "30222814000131 - VITAMEDIC INDUSTRIA FARMACEUTICA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 415,
    "nome_produto": "MOUNJARO",
    "principio_ativo": "tirzepatida",
    "classe_terapeutica": "ANTIDIABETICOS",
    "numero_registro_anvisa": "112600202",
    "laboratorio_fabricante": "43940618000144 - ELI LILLY DO BRASIL LTDA",
    "categoria_regulatoria": "Novo",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 417,
    "nome_produto": "NICORETTE",
    "principio_ativo": "nicotina",
    "classe_terapeutica": "ANTITABAGICO",
    "numero_registro_anvisa": "157211210",
    "laboratorio_fabricante": "59748988000114 - KENVUE LTDA.",
    "categoria_regulatoria": "Específico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 422,
    "nome_produto": "TAVAGRAN",
    "principio_ativo": "levofloxacino hemi-hidratado",
    "classe_terapeutica": "ANTIBIOTICOS SISTEMICOS SIMPLES",
    "numero_registro_anvisa": "167730609",
    "laboratorio_fabricante": "05044984000126 - LEGRAND PHARMA INDÚSTRIA FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 424,
    "nome_produto": "ATORVASTATINA CÁLCICA",
    "principio_ativo": "atorvastatina cálcica",
    "classe_terapeutica": "ANTILIPEMICOS",
    "numero_registro_anvisa": "118190198",
    "laboratorio_fabricante": "92265552000905 - MULTILAB INDUSTRIA E COMERCIO DE PRODUTOS FARMACEUTICOS LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 426,
    "nome_produto": "CELECOXIBE",
    "principio_ativo": "celecoxibe",
    "classe_terapeutica": "ANTINFLAMATORIOS",
    "numero_registro_anvisa": "155840588",
    "laboratorio_fabricante": "05161069000110 - BRAINFARMA INDÚSTRIA QUÍMICA E FARMACÊUTICA S.A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 432,
    "nome_produto": "DIPIRONA",
    "principio_ativo": "dipirona, dipirona monoidratada",
    "classe_terapeutica": "ANALGESICOS",
    "numero_registro_anvisa": "155840683",
    "laboratorio_fabricante": "05161069000110 - BRAINFARMA INDÚSTRIA QUÍMICA E FARMACÊUTICA S.A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 433,
    "nome_produto": "DORFLEX DIP",
    "principio_ativo": "dipirona monoidratada",
    "classe_terapeutica": "ANALGESICOS NAO NARCOTICOS",
    "numero_registro_anvisa": "186200007",
    "laboratorio_fabricante": "38391432000143 - OPELLA HEALTHCARE BRAZIL LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 435,
    "nome_produto": "DOZOITO",
    "principio_ativo": "succinato de metoprolol",
    "classe_terapeutica": "BETABLOQUEADORES SIMPLES",
    "numero_registro_anvisa": "109740334",
    "laboratorio_fabricante": "49475833000106 - BIOLAB SANUS FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 436,
    "nome_produto": "ELPRE",
    "principio_ativo": "prednisolona",
    "classe_terapeutica": "GLICOCORTICOIDES SISTEMICOS",
    "numero_registro_anvisa": "125680389",
    "laboratorio_fabricante": "73856593000166 - PRATI DONADUZZI & CIA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 437,
    "nome_produto": "EVOPOSDO",
    "principio_ativo": "etoposido",
    "classe_terapeutica": "ANTINEOPLASICO",
    "numero_registro_anvisa": "116880015",
    "laboratorio_fabricante": "58635830000175 - FARMARIN INDUSTRIA E COMERCIO LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 439,
    "nome_produto": "ICTUS",
    "principio_ativo": "carvedilol",
    "classe_terapeutica": "BETABLOQUEADORES SIMPLES",
    "numero_registro_anvisa": "109740146",
    "laboratorio_fabricante": "49475833000106 - BIOLAB SANUS FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 440,
    "nome_produto": "NIMESULIDA",
    "principio_ativo": "nimesulida",
    "classe_terapeutica": "AGENTES ANTI-INFLAMATÓRIOS",
    "numero_registro_anvisa": "115600227",
    "laboratorio_fabricante": "17562075000169 - CIFARMA CIENTÍFICA FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 445,
    "nome_produto": "PREDNISONA",
    "principio_ativo": "prednisona",
    "classe_terapeutica": "GLICOCORTICOIDES SISTEMICOS",
    "numero_registro_anvisa": "118190372",
    "laboratorio_fabricante": "92265552000905 - MULTILAB INDUSTRIA E COMERCIO DE PRODUTOS FARMACEUTICOS LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 451,
    "nome_produto": "BACTOMAX",
    "principio_ativo": "teicoplanina",
    "classe_terapeutica": "ANTIBIOTICOS SISTEMICOS SIMPLES",
    "numero_registro_anvisa": "102980288",
    "laboratorio_fabricante": "44734671000151 - CRISTÁLIA PRODUTOS QUÍMICOS FARMACÊUTICOS LTDA.",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 454,
    "nome_produto": "CINARIZINA",
    "principio_ativo": "cinarizina",
    "classe_terapeutica": "VASODILATADORES",
    "numero_registro_anvisa": "123520143",
    "laboratorio_fabricante": "73663650000190 - RANBAXY FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 465,
    "nome_produto": "DUTASTERIDA",
    "principio_ativo": "dutasterida",
    "classe_terapeutica": "INIBIDOR DA ALFA-REDUTASE",
    "numero_registro_anvisa": "123520305",
    "laboratorio_fabricante": "73663650000190 - RANBAXY FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 469,
    "nome_produto": "LEUKERAN",
    "principio_ativo": "clorambucila",
    "classe_terapeutica": "OUTROS ANTINEOPLASICOS",
    "numero_registro_anvisa": "137640148",
    "laboratorio_fabricante": "02433631000120 - ASPEN PHARMA INDÚSTRIA FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Novo",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 479,
    "nome_produto": "FINASTERIDA",
    "principio_ativo": "finasterida",
    "classe_terapeutica": "INIBIDOR DA ALFA-REDUTASE",
    "numero_registro_anvisa": "118190259",
    "laboratorio_fabricante": "92265552000905 - MULTILAB INDUSTRIA E COMERCIO DE PRODUTOS FARMACEUTICOS LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 484,
    "nome_produto": "NEO FRESH",
    "principio_ativo": "carmelose sódica",
    "classe_terapeutica": "OUTROS MEDICAMENTOS COM ACAO NO APARELHO VISUAL",
    "numero_registro_anvisa": "155840402",
    "laboratorio_fabricante": "05161069000110 - BRAINFARMA INDÚSTRIA QUÍMICA E FARMACÊUTICA S.A",
    "categoria_regulatoria": "Específico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 486,
    "nome_produto": "PEMETREXEDE DISSÓDICO HEPTAIDRATADO",
    "principio_ativo": "pemetrexede dissódico heptaidratado",
    "classe_terapeutica": "ANTINEOPLASICO",
    "numero_registro_anvisa": "106460215",
    "laboratorio_fabricante": "61282661000141 - LABORATORIO QUIMICO FARMACEUTICO BERGAMO LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 488,
    "nome_produto": "PERFENOL",
    "principio_ativo": "paracetamol, maleato de clorfeniramina, cloridrato de fenilefrina",
    "classe_terapeutica": "PRODUTOS PARA TERAPIA SINTOMATICA DA GRIPE",
    "numero_registro_anvisa": "104971367",
    "laboratorio_fabricante": "60665981000118 - UNIÃO QUÍMICA FARMACÊUTICA NACIONAL S/A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 491,
    "nome_produto": "SONRIDOR",
    "principio_ativo": "paracetamol",
    "classe_terapeutica": "ANALGESICOS NAO NARCOTICOS",
    "numero_registro_anvisa": "192900010",
    "laboratorio_fabricante": "30872270000153 - PF CONSUMER HEALTHCARE BRAZIL IMPORTADORA E DISTRIBUIDORA DE ME",
    "categoria_regulatoria": "Novo",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 496,
    "nome_produto": "ATORVASTATINA CÁLCICA",
    "principio_ativo": "atorvastatina cálcica",
    "classe_terapeutica": "ANTILIPEMICOS",
    "numero_registro_anvisa": "103700562",
    "laboratorio_fabricante": "17159229000176 - LABORATÓRIO TEUTO BRASILEIRO S/A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 499,
    "nome_produto": "CLORIDRATO DE AMITRIPTILINA",
    "principio_ativo": "cloridrato de amitriptilina",
    "classe_terapeutica": "ANTIDEPRESSIVOS",
    "numero_registro_anvisa": "155840067",
    "laboratorio_fabricante": "05161069000110 - BRAINFARMA INDÚSTRIA QUÍMICA E FARMACÊUTICA S.A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 500,
    "nome_produto": "CLORIDRATO DE IRINOTECANO",
    "principio_ativo": "cloridrato de irinotecano triidratado",
    "classe_terapeutica": "ANTINEOPLASICO",
    "numero_registro_anvisa": "116370159",
    "laboratorio_fabricante": "58430828000160 - BLAU FARMACÊUTICA S.A.",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 505,
    "nome_produto": "DESONIDA",
    "principio_ativo": "desonida",
    "classe_terapeutica": "GLICOCORTICOIDES TOP. SIMP. EXC. USO OFTALM.",
    "numero_registro_anvisa": "105730762",
    "laboratorio_fabricante": "60659463002992 - ACHÉ LABORATÓRIOS FARMACÊUTICOS S.A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 506,
    "nome_produto": "FOSFATO DE CLINDAMICINA",
    "principio_ativo": "fosfato de clindamicina",
    "classe_terapeutica": "ANTIBIOTICOS SISTEMICOS SIMPLES",
    "numero_registro_anvisa": "110110033",
    "laboratorio_fabricante": "59088333000167 - NEWCOM FARMACEUTICA LTDA.",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 507,
    "nome_produto": "IMPERE",
    "principio_ativo": "succinato de solifenacina",
    "classe_terapeutica": "OUTROS PRODUTOS COM ACAO NO TRATO URINARIO",
    "numero_registro_anvisa": "102351258",
    "laboratorio_fabricante": "57507378000365 - EMS S/A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 509,
    "nome_produto": "JP GLICOFISIOLÓGICO",
    "principio_ativo": "cloreto de sódio, glicose",
    "classe_terapeutica": "REPOSICAO HIDROELETROLITICA E ALIMENTACAO PARENTERAL",
    "numero_registro_anvisa": "104910019",
    "laboratorio_fabricante": "55972087000150 - JP INDUSTRIA FARMACEUTICA S/A",
    "categoria_regulatoria": "Específico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 513,
    "nome_produto": "LOXONIN FLEX",
    "principio_ativo": "loxoprofeno sódico",
    "classe_terapeutica": "ANTINFLAMATORIOS",
    "numero_registro_anvisa": "104540188",
    "laboratorio_fabricante": "60874187000184 - DAIICHI SANKYO BRASIL FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Novo",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 514,
    "nome_produto": "MALEATO DE DEXCLORFENIRAMINA + BETAMETASONA",
    "principio_ativo": "maleato de dexclorfeniramina, betametasona",
    "classe_terapeutica": "ANTI-HISTAMINICOS SISTEMICOS",
    "numero_registro_anvisa": "103700399",
    "laboratorio_fabricante": "17159229000176 - LABORATÓRIO TEUTO BRASILEIRO S/A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 516,
    "nome_produto": "MIORRELAX UNO",
    "principio_ativo": "dipirona monoidratada",
    "classe_terapeutica": "ANALGESICOS NAO NARCOTICOS",
    "numero_registro_anvisa": "155840585",
    "laboratorio_fabricante": "05161069000110 - BRAINFARMA INDÚSTRIA QUÍMICA E FARMACÊUTICA S.A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 522,
    "nome_produto": "SEROQUEL",
    "principio_ativo": "hemifumarato de quetiapina",
    "classe_terapeutica": "ANTIPSICOTICOS",
    "numero_registro_anvisa": "141070664",
    "laboratorio_fabricante": "02501297000102 - PHARLAB INDÚSTRIA FARMACÊUTICA S.A.",
    "categoria_regulatoria": "Novo",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 525,
    "nome_produto": "CLORIDRATO DE ATOMOXETINA",
    "principio_ativo": "cloridrato de atomoxetina",
    "classe_terapeutica": "OUTROS PRODUTOS QUE ATUAM SOBRE O SISTEMA NERVOSO",
    "numero_registro_anvisa": "101180666",
    "laboratorio_fabricante": "62462015000129 - APSEN FARMACEUTICA S/A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 526,
    "nome_produto": "CLORIDRATO DE CIPROFLOXACINO MONOIDRATADO + DEXAMETASONA",
    "principio_ativo": "cloridrato de ciprofloxacino monoidratado, dexametasona",
    "classe_terapeutica": "ANTINFECCIOSOS TOPICOS PARA USO OFTALMICO",
    "numero_registro_anvisa": "102351210",
    "laboratorio_fabricante": "57507378000365 - EMS S/A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 529,
    "nome_produto": "EMIBAZET SINV",
    "principio_ativo": "ezetimiba, sinvastatina",
    "classe_terapeutica": "ANTILIPEMICOS",
    "numero_registro_anvisa": "118190316",
    "laboratorio_fabricante": "92265552000905 - MULTILAB INDUSTRIA E COMERCIO DE PRODUTOS FARMACEUTICOS LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 531,
    "nome_produto": "EZETIMIBA + SINVASTATINA",
    "principio_ativo": "ezetimiba, sinvastatina",
    "classe_terapeutica": "ANTILIPEMICOS",
    "numero_registro_anvisa": "156510106",
    "laboratorio_fabricante": "05254971000181 - ZYDUS NIKKHO FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 532,
    "nome_produto": "HEMITARTARATO DE RIVASTIGMINA",
    "principio_ativo": "hemitartarato de rivastigmina",
    "classe_terapeutica": "OUTROS PRODUTOS QUE ATUAM SOBRE O SISTEMA NERVOSO",
    "numero_registro_anvisa": "123520259",
    "laboratorio_fabricante": "73663650000190 - RANBAXY FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 536,
    "nome_produto": "MESILATO DE IMATINIBE",
    "principio_ativo": "mesilato de imatinibe",
    "classe_terapeutica": "ANTINEOPLASICO",
    "numero_registro_anvisa": "116370222",
    "laboratorio_fabricante": "58430828000160 - BLAU FARMACÊUTICA S.A.",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 537,
    "nome_produto": "NUBAIN",
    "principio_ativo": "cloridrato de nalbufina",
    "classe_terapeutica": "ANALGESICOS NARCOTICOS",
    "numero_registro_anvisa": "102980284",
    "laboratorio_fabricante": "44734671000151 - CRISTÁLIA PRODUTOS QUÍMICOS FARMACÊUTICOS LTDA.",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 539,
    "nome_produto": "OMEPRAZOL SÓDICO",
    "principio_ativo": "omeprazol sódico",
    "classe_terapeutica": "ANTIULCEROSOS",
    "numero_registro_anvisa": "103700771",
    "laboratorio_fabricante": "17159229000176 - LABORATÓRIO TEUTO BRASILEIRO S/A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 544,
    "nome_produto": "TODOC",
    "principio_ativo": "etodolaco",
    "classe_terapeutica": "ANTINFLAMATORIOS ANTIREUMATICOS",
    "numero_registro_anvisa": "167730583",
    "laboratorio_fabricante": "05044984000126 - LEGRAND PHARMA INDÚSTRIA FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 545,
    "nome_produto": "VILDAGLIPTINA + CLORIDRATO DE METFORMINA",
    "principio_ativo": "vildagliptina, cloridrato de metformina",
    "classe_terapeutica": "ANTIDIABETICOS",
    "numero_registro_anvisa": "182610029",
    "laboratorio_fabricante": "08157293000127 - NATCOFARMA DO BRASIL LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 548,
    "nome_produto": "ACICLOVIR",
    "principio_ativo": "aciclovir",
    "classe_terapeutica": "ANTIVIROTICOS (INIBE REPLICACAO VIROTICA)",
    "numero_registro_anvisa": "105730556",
    "laboratorio_fabricante": "60659463002992 - ACHÉ LABORATÓRIOS FARMACÊUTICOS S.A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 553,
    "nome_produto": "BENZAPEN G",
    "principio_ativo": "benzilpenicilina procaína",
    "classe_terapeutica": "PENICILINA G E DERIVADOS (BENZILPENICILINAS)",
    "numero_registro_anvisa": "103700158",
    "laboratorio_fabricante": "17159229000176 - LABORATÓRIO TEUTO BRASILEIRO S/A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 554,
    "nome_produto": "BRONQUITOSS",
    "principio_ativo": "sulfato de terbutalina, guaifenesina",
    "classe_terapeutica": "BRONCODILATADORES",
    "numero_registro_anvisa": "167730050",
    "laboratorio_fabricante": "05044984000126 - LEGRAND PHARMA INDÚSTRIA FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 557,
    "nome_produto": "DHIVAS",
    "principio_ativo": "diosmina, flavonóides expressos em hesperidina",
    "classe_terapeutica": "ANTIVARICOSOS DE ACAO SISTEMICA",
    "numero_registro_anvisa": "103720299",
    "laboratorio_fabricante": "43312503000105 - SUPERA FARMA LABORATÓRIOS S.A",
    "categoria_regulatoria": "Específico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 559,
    "nome_produto": "FOSFATO DISSÓDICO DE BETAMETASONA",
    "principio_ativo": "fosfato dissódico de betametasona",
    "classe_terapeutica": "GLICOCORTICOIDES SISTEMICOS",
    "numero_registro_anvisa": "110110012",
    "laboratorio_fabricante": "59088333000167 - NEWCOM FARMACEUTICA LTDA.",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 562,
    "nome_produto": "NATURETTI",
    "principio_ativo": "senna alexandrina mill., cassia fistula l.",
    "classe_terapeutica": "Farmacoterápico",
    "numero_registro_anvisa": "155840644",
    "laboratorio_fabricante": "05161069000110 - BRAINFARMA INDÚSTRIA QUÍMICA E FARMACÊUTICA S.A",
    "categoria_regulatoria": "Fitoterápico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 563,
    "nome_produto": "NIMESULIDA",
    "principio_ativo": "nimesulida",
    "classe_terapeutica": "ANTINFLAMATORIOS",
    "numero_registro_anvisa": "103920175",
    "laboratorio_fabricante": "30222814000131 - VITAMEDIC INDUSTRIA FARMACEUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 564,
    "nome_produto": "PARACETAMOL + FOSFATO DE CODEÍNA",
    "principio_ativo": "paracetamol, fosfato de codeína",
    "classe_terapeutica": "ANALGESICOS NARCOTICOS",
    "numero_registro_anvisa": "109740323",
    "laboratorio_fabricante": "49475833000106 - BIOLAB SANUS FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 566,
    "nome_produto": "RECONTER",
    "principio_ativo": "oxalato de escitalopram",
    "classe_terapeutica": "ANTIDEPRESSIVOS",
    "numero_registro_anvisa": "100330156",
    "laboratorio_fabricante": "61230314000175 - LIBBS FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 571,
    "nome_produto": "TOPIRAMATO",
    "principio_ativo": "topiramato",
    "classe_terapeutica": "ANTICONVULSIVANTES",
    "numero_registro_anvisa": "105730686",
    "laboratorio_fabricante": "60659463002992 - ACHÉ LABORATÓRIOS FARMACÊUTICOS S.A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 575,
    "nome_produto": "BART H",
    "principio_ativo": "irbesartana, hidroclorotiazida",
    "classe_terapeutica": "ANTI-HIPERTENSIVOS",
    "numero_registro_anvisa": "100431351",
    "laboratorio_fabricante": "61190096000192 - EUROFARMA LABORATORIOS S.A.",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 577,
    "nome_produto": "CLORIDRATO DE BUPROPIONA",
    "principio_ativo": "cloridrato de bupropiona",
    "classe_terapeutica": "ANTITABAGICO",
    "numero_registro_anvisa": "102351039",
    "laboratorio_fabricante": "57507378000365 - EMS S/A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 578,
    "nome_produto": "CLORIDRATO DE METFORMINA",
    "principio_ativo": "cloridrato de metformina",
    "classe_terapeutica": "ANTIDIABETICOS",
    "numero_registro_anvisa": "125680247",
    "laboratorio_fabricante": "73856593000166 - PRATI DONADUZZI & CIA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 580,
    "nome_produto": "EXEMESTANO",
    "principio_ativo": "exemestano",
    "classe_terapeutica": "ANTINEOPLASICO",
    "numero_registro_anvisa": "146820066",
    "laboratorio_fabricante": "05035244000123 - SUN FARMACÊUTICA DO BRASIL LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 581,
    "nome_produto": "FOSFATO DE OSELTAMIVIR",
    "principio_ativo": "fosfato de oseltamivir",
    "classe_terapeutica": "ANTIVIRÓTICOS",
    "numero_registro_anvisa": "109740381",
    "laboratorio_fabricante": "49475833000106 - BIOLAB SANUS FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 583,
    "nome_produto": "IVAHART",
    "principio_ativo": "cloridrato de ivabradina",
    "classe_terapeutica": "ANTIANGINOSOS E VASODILATADORES",
    "numero_registro_anvisa": "105250090",
    "laboratorio_fabricante": "33078528000132 - TORRENT DO BRASIL LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 584,
    "nome_produto": "LFM - MONONITRATO DE ISOSSORBIDA",
    "principio_ativo": "mononitrato de isossorbida",
    "classe_terapeutica": "ANTIANGINOSOS E VASODILATADORES",
    "numero_registro_anvisa": "126250045",
    "laboratorio_fabricante": "00394502007157 - LABORATÓRIO FARMACÊUTICO DA MARINHA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 585,
    "nome_produto": "LOSARTANA POTÁSSICA + HIDROCLOROTIAZIDA",
    "principio_ativo": "losartana potássica, hidroclorotiazida",
    "classe_terapeutica": "ANTI-HIPERTENSIVOS",
    "numero_registro_anvisa": "167730537",
    "laboratorio_fabricante": "05044984000126 - LEGRAND PHARMA INDÚSTRIA FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 589,
    "nome_produto": "OXALATO DE ESCITALOPRAM",
    "principio_ativo": "oxalato de escitalopram",
    "classe_terapeutica": "ANTIDEPRESSIVOS",
    "numero_registro_anvisa": "102351063",
    "laboratorio_fabricante": "57507378000365 - EMS S/A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 597,
    "nome_produto": "APIXNEO",
    "principio_ativo": "apixabana",
    "classe_terapeutica": "ANTITROMBOTICO",
    "numero_registro_anvisa": "155840636",
    "laboratorio_fabricante": "05161069000110 - BRAINFARMA INDÚSTRIA QUÍMICA E FARMACÊUTICA S.A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 599,
    "nome_produto": "AZITROMICINA",
    "principio_ativo": "azitromicina di-hidratada",
    "classe_terapeutica": "ANTIBIOTICOS SISTEMICOS SIMPLES",
    "numero_registro_anvisa": "125680187",
    "laboratorio_fabricante": "73856593000166 - PRATI DONADUZZI & CIA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 600,
    "nome_produto": "BACIGEN",
    "principio_ativo": "neomicina, bacitracina zíncica",
    "classe_terapeutica": "ANTINFECCIOSOS TOPICOS-ASSOCIACOES MEDICAMENTOSAS",
    "numero_registro_anvisa": "107150039",
    "laboratorio_fabricante": "44010437000181 - CAZI QUIMICA FARMACEUTICA INDUSTRIA E COMERCIO LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 601,
    "nome_produto": "CITTÀ",
    "principio_ativo": "bromidrato de citalopram",
    "classe_terapeutica": "ANTIDEPRESSIVOS",
    "numero_registro_anvisa": "100431387",
    "laboratorio_fabricante": "61190096000192 - EUROFARMA LABORATORIOS S.A.",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 602,
    "nome_produto": "CLORIDRATO DE VERAPAMIL",
    "principio_ativo": "cloridrato de verapamil",
    "classe_terapeutica": "ANTIANGINOSOS E VASODILATADORES",
    "numero_registro_anvisa": "103700373",
    "laboratorio_fabricante": "17159229000176 - LABORATÓRIO TEUTO BRASILEIRO S/A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 605,
    "nome_produto": "FLUIMUCIL",
    "principio_ativo": "acetilcisteína",
    "classe_terapeutica": "EXPECTORANTES BALSAMICOS E MUCOLITICO",
    "numero_registro_anvisa": "100840075",
    "laboratorio_fabricante": "61100004000136 - ZAMBON LABORATÓRIOS FARMACÊUTICOS LTDA.",
    "categoria_regulatoria": "Novo",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 608,
    "nome_produto": "HYBLUT",
    "principio_ativo": "enoxaparina sódica",
    "classe_terapeutica": "ANTITROMBOTICO",
    "numero_registro_anvisa": "155840671",
    "laboratorio_fabricante": "05161069000110 - BRAINFARMA INDÚSTRIA QUÍMICA E FARMACÊUTICA S.A",
    "categoria_regulatoria": "Biológico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 612,
    "nome_produto": "NUFIG MET",
    "principio_ativo": "silybum marianum (l.) gaertn, racemetionina",
    "classe_terapeutica": "HEPATOPROTETORES E LIPOTROPICOS",
    "numero_registro_anvisa": "154230358",
    "laboratorio_fabricante": "03485572000104 - GEOLAB INDÚSTRIA FARMACÊUTICA S/A",
    "categoria_regulatoria": "Específico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 613,
    "nome_produto": "OCTANINE F",
    "principio_ativo": "fator ix de coagulação",
    "classe_terapeutica": "OUTROS DERIVADOS DO SANGUE E SUBSTITUTOS",
    "numero_registro_anvisa": "139710008",
    "laboratorio_fabricante": "02552927000160 - OCTAPHARMA BRASIL LTDA",
    "categoria_regulatoria": "Biológico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 615,
    "nome_produto": "SENSILACRI",
    "principio_ativo": "hipromelose, dextrana 70 (99m tc)",
    "classe_terapeutica": "EMOLIENTES E PROTETORES OFTALMICOS",
    "numero_registro_anvisa": "154230327",
    "laboratorio_fabricante": "03485572000104 - GEOLAB INDÚSTRIA FARMACÊUTICA S/A",
    "categoria_regulatoria": "Específico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 625,
    "nome_produto": "DESTADIN",
    "principio_ativo": "desloratadina",
    "classe_terapeutica": "ANTI-HISTAMINICOS SISTEMICOS",
    "numero_registro_anvisa": "102350962",
    "laboratorio_fabricante": "57507378000365 - EMS S/A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 627,
    "nome_produto": "ÉSIO",
    "principio_ativo": "esomeprazol magnésico",
    "classe_terapeutica": "ANTIULCEROSOS",
    "numero_registro_anvisa": "100431217",
    "laboratorio_fabricante": "61190096000192 - EUROFARMA LABORATORIOS S.A.",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 629,
    "nome_produto": "GANCICLOVIR SODICO",
    "principio_ativo": "ganciclovir sódico",
    "classe_terapeutica": "ANTIVIROTICOS",
    "numero_registro_anvisa": "100430762",
    "laboratorio_fabricante": "61190096000192 - EUROFARMA LABORATORIOS S.A.",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 632,
    "nome_produto": "LIRACLICK",
    "principio_ativo": "liraglutida",
    "classe_terapeutica": "OUTROS HORMONIOS E MODULADORES DO METABOLISMO E DA DIGESTAO",
    "numero_registro_anvisa": "105831062",
    "laboratorio_fabricante": "45992062000165 - GERMED FARMACEUTICA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 636,
    "nome_produto": "OLMEGRAN HCT",
    "principio_ativo": "olmesartana medoxomila, hidroclorotiazida",
    "classe_terapeutica": "ANTI-HIPERTENSIVOS-ASSOCIACOES MEDICAMENTOSAS",
    "numero_registro_anvisa": "167730648",
    "laboratorio_fabricante": "05044984000126 - LEGRAND PHARMA INDÚSTRIA FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 637,
    "nome_produto": "RIVOXX",
    "principio_ativo": "rivaroxabana",
    "classe_terapeutica": "AGENTES ANTITROMBÓTICOS",
    "numero_registro_anvisa": "100431445",
    "laboratorio_fabricante": "61190096000192 - EUROFARMA LABORATORIOS S.A.",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 639,
    "nome_produto": "SONIC",
    "principio_ativo": "cloridrato de trazodona",
    "classe_terapeutica": "ANTIDEPRESSIVOS",
    "numero_registro_anvisa": "100431435",
    "laboratorio_fabricante": "61190096000192 - EUROFARMA LABORATORIOS S.A.",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 642,
    "nome_produto": "TAVALISSE",
    "principio_ativo": "fostamatinibe dissódico hexaidratado",
    "classe_terapeutica": "OUTROS PRODUTOS ANTI-HEMORRAGICOS",
    "numero_registro_anvisa": "125760043",
    "laboratorio_fabricante": "68949239000146 - UNITED MEDICAL LTDA",
    "categoria_regulatoria": "Novo",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 650,
    "nome_produto": "CANDESARTANA CILEXETILA",
    "principio_ativo": "candesartana cilexetila",
    "classe_terapeutica": "ANTI-HIPERTENSIVOS SIMPLES",
    "numero_registro_anvisa": "102351089",
    "laboratorio_fabricante": "57507378000365 - EMS S/A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 651,
    "nome_produto": "CLORETO DE SÓDIO SOLUÇÃO FISIOLÓGICA PARA IRRIGAÇÃO - BAXTER",
    "principio_ativo": "cloreto de sódio",
    "classe_terapeutica": "OUTROS PRODS  NAO ENQUADRADOS EM CLASSE TERAPEUTICA ESPECIF",
    "numero_registro_anvisa": "106830180",
    "laboratorio_fabricante": "49351786000261 - BAXTER HOSPITALAR LTDA",
    "categoria_regulatoria": "Específico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 654,
    "nome_produto": "HALOBEX",
    "principio_ativo": "propionato de halobetasol",
    "classe_terapeutica": "GLICOCORTICOIDES TOP. SIMP. EXC. USO OFTALM.",
    "numero_registro_anvisa": "110130267",
    "laboratorio_fabricante": "44363661000157 - GLENMARK FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Novo",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 656,
    "nome_produto": "MIRADOR",
    "principio_ativo": "dipirona monoidratada",
    "classe_terapeutica": "ANALGESICOS NAO NARCOTICOS",
    "numero_registro_anvisa": "155840582",
    "laboratorio_fabricante": "05161069000110 - BRAINFARMA INDÚSTRIA QUÍMICA E FARMACÊUTICA S.A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 657,
    "nome_produto": "NAPROXENO",
    "principio_ativo": "naproxeno",
    "classe_terapeutica": "ANTINFLAMATORIOS ANTIREUMATICOS",
    "numero_registro_anvisa": "103700446",
    "laboratorio_fabricante": "17159229000176 - LABORATÓRIO TEUTO BRASILEIRO S/A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 660,
    "nome_produto": "NOVALGINA FLASH",
    "principio_ativo": "dipirona monoidratada, cafeína anidra",
    "classe_terapeutica": "ANALGESICOS NAO NARCOTICOS",
    "numero_registro_anvisa": "186200023",
    "laboratorio_fabricante": "38391432000143 - OPELLA HEALTHCARE BRAZIL LTDA",
    "categoria_regulatoria": "Novo",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 661,
    "nome_produto": "PRATIPRAZOL",
    "principio_ativo": "omeprazol",
    "classe_terapeutica": "INIBIDORES DA BOMBA DE PRÓTONS",
    "numero_registro_anvisa": "125680337",
    "laboratorio_fabricante": "73856593000166 - PRATI DONADUZZI & CIA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 663,
    "nome_produto": "TELMIGRAN HCT",
    "principio_ativo": "telmisartana, hidroclorotiazida",
    "classe_terapeutica": "ANTI-HIPERTENSIVOS-ASSOCIACOES MEDICAMENTOSAS",
    "numero_registro_anvisa": "167730581",
    "laboratorio_fabricante": "05044984000126 - LEGRAND PHARMA INDÚSTRIA FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 664,
    "nome_produto": "TEUDOM",
    "principio_ativo": "cloridrato de dopamina",
    "classe_terapeutica": "VASOCONSTRITORES E HIPERTENSORES",
    "numero_registro_anvisa": "103700753",
    "laboratorio_fabricante": "17159229000176 - LABORATÓRIO TEUTO BRASILEIRO S/A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 668,
    "nome_produto": "ACECLOFENACO",
    "principio_ativo": "aceclofenaco",
    "classe_terapeutica": "ANTINFLAMATORIOS",
    "numero_registro_anvisa": "104810145",
    "laboratorio_fabricante": "48113906000149 - 1FARMA INDUSTRIA FARMACEUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 669,
    "nome_produto": "ALOIS DUO",
    "principio_ativo": "cloridrato de donepezila, cloridrato de donepezila monoidratado, cloridrato de memantina",
    "classe_terapeutica": "OUTROS PRODUTOS QUE ATUAM SOBRE O SISTEMA NERVOSO",
    "numero_registro_anvisa": "101180628",
    "laboratorio_fabricante": "62462015000129 - APSEN FARMACEUTICA S/A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 673,
    "nome_produto": "DICLORIDRATO DE MANIDIPINO",
    "principio_ativo": "dicloridrato de manidipino",
    "classe_terapeutica": "ANTI-HIPERTENSIVOS",
    "numero_registro_anvisa": "141070623",
    "laboratorio_fabricante": "02501297000102 - PHARLAB INDÚSTRIA FARMACÊUTICA S.A.",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 678,
    "nome_produto": "FONT D",
    "principio_ativo": "colecalciferol",
    "classe_terapeutica": "ANALOGO SINTETICO DA VITAMINA D",
    "numero_registro_anvisa": "104971481",
    "laboratorio_fabricante": "60665981000118 - UNIÃO QUÍMICA FARMACÊUTICA NACIONAL S/A",
    "categoria_regulatoria": "Específico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 680,
    "nome_produto": "HARTERYA",
    "principio_ativo": "apixabana",
    "classe_terapeutica": "ANTITROMBOTICO",
    "numero_registro_anvisa": "156510096",
    "laboratorio_fabricante": "05254971000181 - ZYDUS NIKKHO FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 682,
    "nome_produto": "LIPOVENOS  MCT",
    "principio_ativo": "óleo de soja, triglicerídeos cadeia média, triglicerídeos de cadeia média, glicerol, lecitina de ovo",
    "classe_terapeutica": "NUTRIENTES PARENTERAIS",
    "numero_registro_anvisa": "100419931",
    "laboratorio_fabricante": "49324221000104 - FRESENIUS KABI BRASIL LTDA",
    "categoria_regulatoria": "Específico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 684,
    "nome_produto": "MEROPENÉM",
    "principio_ativo": "meropeném tri-hidratado",
    "classe_terapeutica": "ANTIBIOTICOS SISTEMICOS SIMPLES",
    "numero_registro_anvisa": "116370187",
    "laboratorio_fabricante": "58430828000160 - BLAU FARMACÊUTICA S.A.",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 688,
    "nome_produto": "PRIMID",
    "principio_ativo": "primidona",
    "classe_terapeutica": "ANTICONVULSIVANTES",
    "numero_registro_anvisa": "101180659",
    "laboratorio_fabricante": "62462015000129 - APSEN FARMACEUTICA S/A",
    "categoria_regulatoria": "Novo",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 691,
    "nome_produto": "RIVAROXABANA",
    "principio_ativo": "rivaroxabana",
    "classe_terapeutica": "AGENTES ANTITROMBÓTICOS",
    "numero_registro_anvisa": "151430037",
    "laboratorio_fabricante": "03978166000175 - DR. REDDYS FARMACÊUTICA DO BRASIL LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 692,
    "nome_produto": "SANDIMMUN",
    "principio_ativo": "ciclosporina",
    "classe_terapeutica": "Farmacoterápico",
    "numero_registro_anvisa": "100680020",
    "laboratorio_fabricante": "56994502000130 - NOVARTIS BIOCIENCIAS S.A",
    "categoria_regulatoria": "Novo",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 693,
    "nome_produto": "SIGRAN",
    "principio_ativo": "cloridrato de sibutramina monoidratado",
    "classe_terapeutica": "ANOREXICOS SIMPLES",
    "numero_registro_anvisa": "105830831",
    "laboratorio_fabricante": "45992062000165 - GERMED FARMACEUTICA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 697,
    "nome_produto": "ZEDORA",
    "principio_ativo": "trastuzumabe",
    "classe_terapeutica": "ANTINEOPLASICO",
    "numero_registro_anvisa": "100330199",
    "laboratorio_fabricante": "61230314000175 - LIBBS FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Biológico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 703,
    "nome_produto": "BABYMED TRATAMENTO",
    "principio_ativo": "nistatina, óxido de zinco",
    "classe_terapeutica": "EMOLIENTES E PROTETORES DA PELE E MUCOSAS",
    "numero_registro_anvisa": "143810258",
    "laboratorio_fabricante": "02814497000107 - CIMED INDUSTRIA S.A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 707,
    "nome_produto": "IXABI",
    "principio_ativo": "apixabana",
    "classe_terapeutica": "ANTITROMBOTICO",
    "numero_registro_anvisa": "105250122",
    "laboratorio_fabricante": "33078528000132 - TORRENT DO BRASIL LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 708,
    "nome_produto": "LACOSAMIDA",
    "principio_ativo": "lacosamida",
    "classe_terapeutica": "ANTICONVULSIVANTES",
    "numero_registro_anvisa": "170420010",
    "laboratorio_fabricante": "18755529000180 - MCG INDUSTRIA FARMACEUTICA E IMPORTAÇAO LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 710,
    "nome_produto": "MALEATO DE DEXCLORFENIRAMINA + BETAMETASONA",
    "principio_ativo": "maleato de dexclorfeniramina, betametasona",
    "classe_terapeutica": "ANTI-HISTAMINICOS SISTEMICOS",
    "numero_registro_anvisa": "126750091",
    "laboratorio_fabricante": "72593791000111 - NOVA QUIMICA FARMACÊUTICA S/A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 719,
    "nome_produto": "STABIL",
    "principio_ativo": "dicloridrato de pramipexol",
    "classe_terapeutica": "ANTIPARKINSONIANOS",
    "numero_registro_anvisa": "105730429",
    "laboratorio_fabricante": "60659463002992 - ACHÉ LABORATÓRIOS FARMACÊUTICOS S.A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 720,
    "nome_produto": "SUCCINATO SODICO DE HIDROCORTISONA",
    "principio_ativo": "succinato sódico de hidrocortisona",
    "classe_terapeutica": "GLICOCORTICOIDES SISTEMICOS",
    "numero_registro_anvisa": "116370105",
    "laboratorio_fabricante": "58430828000160 - BLAU FARMACÊUTICA S.A.",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 723,
    "nome_produto": "ANASTROZOL",
    "principio_ativo": "anastrozol",
    "classe_terapeutica": "ANTINEOPLASICO",
    "numero_registro_anvisa": "102980584",
    "laboratorio_fabricante": "44734671000151 - CRISTÁLIA PRODUTOS QUÍMICOS FARMACÊUTICOS LTDA.",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 724,
    "nome_produto": "AQUARELA ODT",
    "principio_ativo": "aripiprazol",
    "classe_terapeutica": "ANTIPSICOTICOS",
    "numero_registro_anvisa": "105730178",
    "laboratorio_fabricante": "60659463002992 - ACHÉ LABORATÓRIOS FARMACÊUTICOS S.A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 727,
    "nome_produto": "CLORIDRATO DE DONEPEZILA",
    "principio_ativo": "cloridrato de donepezila",
    "classe_terapeutica": "OUTROS PRODUTOS QUE ATUAM SOBRE O SISTEMA NERVOSO",
    "numero_registro_anvisa": "183260503",
    "laboratorio_fabricante": "10588595001092 - SANOFI MEDLEY FARMACÊUTICA LTDA.",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 728,
    "nome_produto": "CLORIDRATO DE HIDROXIZINA",
    "principio_ativo": "dicloridrato de hidroxizina",
    "classe_terapeutica": "ANTI-HISTAMINICOS SISTEMICOS",
    "numero_registro_anvisa": "147610022",
    "laboratorio_fabricante": "65271900000119 - NATIVITA IND. COM. LTDA.",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 730,
    "nome_produto": "DICLORIDRATO DE TRIMETAZIDINA",
    "principio_ativo": "dicloridrato de trimetazidina",
    "classe_terapeutica": "ANTIANGINOSOS E VASODILATADORES",
    "numero_registro_anvisa": "105830915",
    "laboratorio_fabricante": "45992062000165 - GERMED FARMACEUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 732,
    "nome_produto": "DIVALPROATO DE SÓDIO",
    "principio_ativo": "divalproato de sódio",
    "classe_terapeutica": "ANTIEPILÉPTICOS",
    "numero_registro_anvisa": "105730692",
    "laboratorio_fabricante": "60659463002992 - ACHÉ LABORATÓRIOS FARMACÊUTICOS S.A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 734,
    "nome_produto": "ESTOMAZIL PASTILHAS",
    "principio_ativo": "carbonato de cálcio 90%, hidroxido de alumínio, hidróxido de alumínio, hidroxido de magnesio, hidróxido de magnésio",
    "classe_terapeutica": "ANTIACIDO",
    "numero_registro_anvisa": "178170094",
    "laboratorio_fabricante": "61082426000207 - COSMED INDUSTRIA DE COSMETICOS E MEDICAMENTOS S.A.",
    "categoria_regulatoria": "Específico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 737,
    "nome_produto": "GAMA ANTI-D GRIFOLS",
    "principio_ativo": "imunoglobulina anti-d",
    "classe_terapeutica": "IMUNOGLOBULINAS",
    "numero_registro_anvisa": "136410004",
    "laboratorio_fabricante": "02513899000171 - GRIFOLS BRASIL LTDA",
    "categoria_regulatoria": "Biológico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 738,
    "nome_produto": "ISTARHES",
    "principio_ativo": "hidroxietilamido, cloreto de sódio, cloreto de potássio, cloreto de cálcio diidratado, cloreto de magnésio hexaidratado, acetato de sódio triidratado",
    "classe_terapeutica": "SUBSTITUTOS DO PLASMA E EXPANSORES PLASMATICOS",
    "numero_registro_anvisa": "103110135",
    "laboratorio_fabricante": "01571702000198 - HALEX ISTAR INDÚSTRIA FARMACÊUTICA SA",
    "categoria_regulatoria": "Específico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 739,
    "nome_produto": "KRIKOR",
    "principio_ativo": "cloridrato de valaciclovir",
    "classe_terapeutica": "ANTIVIROTICOS",
    "numero_registro_anvisa": "178170984",
    "laboratorio_fabricante": "61082426000207 - COSMED INDUSTRIA DE COSMETICOS E MEDICAMENTOS S.A.",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 746,
    "nome_produto": "AMOXICILINA TRI-HIDRATADA",
    "principio_ativo": "amoxicilina trihidratada",
    "classe_terapeutica": "ANTIBIOTICOS SISTEMICOS SIMPLES",
    "numero_registro_anvisa": "105730545",
    "laboratorio_fabricante": "60659463002992 - ACHÉ LABORATÓRIOS FARMACÊUTICOS S.A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 751,
    "nome_produto": "CLORIDRATO DE TRAZODONA",
    "principio_ativo": "cloridrato de trazodona",
    "classe_terapeutica": "ANTIDEPRESSIVOS",
    "numero_registro_anvisa": "183260491",
    "laboratorio_fabricante": "10588595001092 - SANOFI MEDLEY FARMACÊUTICA LTDA.",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 755,
    "nome_produto": "IBUPROFENO",
    "principio_ativo": "ibuprofeno",
    "classe_terapeutica": "ANALGESICOS NAO NARCOTICOS",
    "numero_registro_anvisa": "135170067",
    "laboratorio_fabricante": "48344725000719 - ALTHAIA S.A. INDUSTRIA FARMACEUTICA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 756,
    "nome_produto": "LÂNICO",
    "principio_ativo": "amoxicilina tri-hidratada, clavulanato de potássio",
    "classe_terapeutica": "ANTIBIOTICOS SISTEMICOS-ASSOCIACOES MEDICAMENTOSAS",
    "numero_registro_anvisa": "103720277",
    "laboratorio_fabricante": "43312503000105 - SUPERA FARMA LABORATÓRIOS S.A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 762,
    "nome_produto": "OXALATO DE ESCITALOPRAM",
    "principio_ativo": "oxalato de escitalopram",
    "classe_terapeutica": "ANTIDEPRESSIVOS",
    "numero_registro_anvisa": "154230199",
    "laboratorio_fabricante": "03485572000104 - GEOLAB INDÚSTRIA FARMACÊUTICA S/A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 764,
    "nome_produto": "RISONATO",
    "principio_ativo": "risedronato sódico",
    "classe_terapeutica": "SUPRESSORES DA REABSORCAO OSSEA",
    "numero_registro_anvisa": "102350976",
    "laboratorio_fabricante": "57507378000365 - EMS S/A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 765,
    "nome_produto": "RISS",
    "principio_ativo": "risperidona",
    "classe_terapeutica": "NEUROLEPTICOS",
    "numero_registro_anvisa": "100431002",
    "laboratorio_fabricante": "61190096000192 - EUROFARMA LABORATORIOS S.A.",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 766,
    "nome_produto": "RIVAXA",
    "principio_ativo": "rivaroxabana",
    "classe_terapeutica": "AGENTES ANTITROMBÓTICOS",
    "numero_registro_anvisa": "100431347",
    "laboratorio_fabricante": "61190096000192 - EUROFARMA LABORATORIOS S.A.",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 767,
    "nome_produto": "SUCCINATO DE DESVENLAFAXINA MONOIDRATADO",
    "principio_ativo": "succinato de desvenlafaxina monoidratado",
    "classe_terapeutica": "ANTIDEPRESSIVOS",
    "numero_registro_anvisa": "155840561",
    "laboratorio_fabricante": "05161069000110 - BRAINFARMA INDÚSTRIA QUÍMICA E FARMACÊUTICA S.A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 770,
    "nome_produto": "ATEPRESS",
    "principio_ativo": "atenolol",
    "classe_terapeutica": "BETABLOQUEADORES SIMPLES",
    "numero_registro_anvisa": "103700151",
    "laboratorio_fabricante": "17159229000176 - LABORATÓRIO TEUTO BRASILEIRO S/A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 774,
    "nome_produto": "CLORIDRATO DE CICLOBENZAPRINA",
    "principio_ativo": "cloridrato de ciclobenzaprina",
    "classe_terapeutica": "RELAXANTES MUSCULARES",
    "numero_registro_anvisa": "102351381",
    "laboratorio_fabricante": "57507378000365 - EMS S/A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 784,
    "nome_produto": "LABREA",
    "principio_ativo": "cloridrato de donepezila",
    "classe_terapeutica": "OUTROS PRODUTOS QUE ATUAM SOBRE O SISTEMA NERVOSO",
    "numero_registro_anvisa": "102980392",
    "laboratorio_fabricante": "44734671000151 - CRISTÁLIA PRODUTOS QUÍMICOS FARMACÊUTICOS LTDA.",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 787,
    "nome_produto": "NEO LORATADIN",
    "principio_ativo": "loratadina",
    "classe_terapeutica": "ANTI-HISTAMINICOS SISTEMICOS",
    "numero_registro_anvisa": "155840576",
    "laboratorio_fabricante": "05161069000110 - BRAINFARMA INDÚSTRIA QUÍMICA E FARMACÊUTICA S.A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 791,
    "nome_produto": "RIVAROXABANA",
    "principio_ativo": "rivaroxabana",
    "classe_terapeutica": "AGENTES ANTITROMBÓTICOS",
    "numero_registro_anvisa": "135170084",
    "laboratorio_fabricante": "48344725000719 - ALTHAIA S.A. INDUSTRIA FARMACEUTICA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Ativo"
  },
  {
    "id_anvisa": 793,
    "nome_produto": "TAPAZOL",
    "principio_ativo": "tiamazol",
    "classe_terapeutica": "ANTITIREOIDEANOS",
    "numero_registro_anvisa": "109740193",
    "laboratorio_fabricante": "49475833000106 - BIOLAB SANUS FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Novo",
    "situacao_registro": "Ativo"
  }
];
