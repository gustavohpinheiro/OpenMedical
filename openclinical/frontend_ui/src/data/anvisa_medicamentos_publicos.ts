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
    "id_anvisa": 1,
    "nome_produto": "INSUMAN",
    "principio_ativo": "insulina humana",
    "classe_terapeutica": "ANTIDIABETICOS",
    "numero_registro_anvisa": "113000267",
    "laboratorio_fabricante": "02685377000157 - SANOFI-AVENTIS FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
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
    "id_anvisa": 6,
    "nome_produto": "NEO FLUOXETIN",
    "principio_ativo": "cloridrato de fluoxetina",
    "classe_terapeutica": "ANTIDEPRESSIVOS",
    "numero_registro_anvisa": "172870372",
    "laboratorio_fabricante": "02932074000191 - HYPERA S.A.",
    "categoria_regulatoria": "Medicamento",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 7,
    "nome_produto": "NORFLOXACINO",
    "principio_ativo": "norfloxacino",
    "classe_terapeutica": "ANTIBIOTICOS SISTEMICOS SIMPLES",
    "numero_registro_anvisa": "101810583",
    "laboratorio_fabricante": "50929710000179 - MEDLEY INDÚSTRIA FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 9,
    "nome_produto": "NUTRICAL D",
    "principio_ativo": "carbonato de cálcio, colecalciferol",
    "classe_terapeutica": "VITAMINAS E SUPLEMENTOS MINERAIS",
    "numero_registro_anvisa": "103900166",
    "laboratorio_fabricante": "33349473000158 - FARMOQUÍMICA S/A",
    "categoria_regulatoria": "Específico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 10,
    "nome_produto": "OSCÁLCIO COLOIDAL",
    "principio_ativo": "fosfato tricálcico, cianocobalamina, calciferol",
    "classe_terapeutica": "PRODUTOS A BASE DE CALCIO-ASSOCIACOES MEDICAMENTOSAS",
    "numero_registro_anvisa": "102690066",
    "laboratorio_fabricante": "60420692000159 - INSTITUTO NACIONAL QUIMIOTERAPIA",
    "categoria_regulatoria": "Específico",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 12,
    "nome_produto": "OXY",
    "principio_ativo": "peroxido de benzoila, peróxido de benzoíla",
    "classe_terapeutica": "PRODUTOS ANTI-ACNE",
    "numero_registro_anvisa": "101070117",
    "laboratorio_fabricante": "33247743000110 - GLAXOSMITHKLINE BRASIL LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 13,
    "nome_produto": "SINVASTATINA",
    "principio_ativo": "sinvastatina",
    "classe_terapeutica": "ANTILIPEMICOS",
    "numero_registro_anvisa": "104920154",
    "laboratorio_fabricante": "33150764000112 - BIOLAB FARMA GENERICOS LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 14,
    "nome_produto": "TYLENOL",
    "principio_ativo": "paracetamol",
    "classe_terapeutica": "ANALGESICOS NAO NARCOTICOS",
    "numero_registro_anvisa": "112363326",
    "laboratorio_fabricante": "51780468000187 - JANSSEN-CILAG FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Novo",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 15,
    "nome_produto": "ACETATO DE RETINOL (50.000 UI)",
    "principio_ativo": "ACETATO DE RETINOL (50.000 UI)",
    "classe_terapeutica": "MONOVITAMINAS EXCETO VITAMINA K",
    "numero_registro_anvisa": "135480052",
    "laboratorio_fabricante": "64858525000145 - MONSANTO DO BRASIL LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 16,
    "nome_produto": "SETRONAX",
    "principio_ativo": "cloridrato de ondansetrona",
    "classe_terapeutica": "ANTIEMETICOS E ANTINAUSEANTES",
    "numero_registro_anvisa": "137640004",
    "laboratorio_fabricante": "02433631000120 - ASPEN PHARMA INDÚSTRIA FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 19,
    "nome_produto": "VACINA ADN RECOMINANTE CONTRA A HEPATITE B",
    "principio_ativo": "proteína antigênica de superfície (hep. b)",
    "classe_terapeutica": "VACINAS",
    "numero_registro_anvisa": "117470004",
    "laboratorio_fabricante": "61774717000185 - CUBANACAN COMÉRCIO INTERNACIONAL LTDA",
    "categoria_regulatoria": "Novo",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 20,
    "nome_produto": "VALTANA H",
    "principio_ativo": "valsartana, hidroclorotiazida",
    "classe_terapeutica": "ANTI-HIPERTENSIVOS-ASSOCIACOES MEDICAMENTOSAS",
    "numero_registro_anvisa": "194270019",
    "laboratorio_fabricante": "14806008000154 - MOMENTA FARMACÊUTICA LTDA.",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 21,
    "nome_produto": "VERMECTIL",
    "principio_ativo": "ivermectina",
    "classe_terapeutica": "ANTIPARASITARIOS",
    "numero_registro_anvisa": "115600106",
    "laboratorio_fabricante": "17562075000169 - CIFARMA CIENTÍFICA FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 22,
    "nome_produto": "VIAGRA",
    "principio_ativo": "citrato de sildenafila",
    "classe_terapeutica": "VASODILATADORES",
    "numero_registro_anvisa": "121100384",
    "laboratorio_fabricante": "61072393000133 - PFIZER BRASIL LTDA",
    "categoria_regulatoria": "Medicamento",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 24,
    "nome_produto": "ACCERA",
    "principio_ativo": "tartarato de brimonidina",
    "classe_terapeutica": "ANTIGLAUCOMATOSOS",
    "numero_registro_anvisa": "183260032",
    "laboratorio_fabricante": "10588595001092 - SANOFI MEDLEY FARMACÊUTICA LTDA.",
    "categoria_regulatoria": "Medicamento",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 25,
    "nome_produto": "ANDROCUR",
    "principio_ativo": "acetato de ciproterona",
    "classe_terapeutica": "PROGESTAGENOS SIMPLES",
    "numero_registro_anvisa": "100200002",
    "laboratorio_fabricante": "56990534000167 - UNIAO QUIMICA INTERNACIONAL LTDA",
    "categoria_regulatoria": "Novo",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 26,
    "nome_produto": "DAPSYN",
    "principio_ativo": "dapsona",
    "classe_terapeutica": "HANSENOSTATICOS",
    "numero_registro_anvisa": "103700214",
    "laboratorio_fabricante": "17159229000176 - LABORATÓRIO TEUTO BRASILEIRO S/A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 27,
    "nome_produto": "ERITROKINE",
    "principio_ativo": "eritropoetina humana recombinante, eritropoietina",
    "classe_terapeutica": "OUTROS PRODUTOS QUE ATUAM NO SANGUE E HEMATOPOIESE",
    "numero_registro_anvisa": "118360015",
    "laboratorio_fabricante": "33019548000132 - SILVESTRE LABS QUÍMICA E FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 28,
    "nome_produto": "H.BACTER",
    "principio_ativo": "lansoprazol, claritromicina, amoxicilina tri-hidratada",
    "classe_terapeutica": "ANTIACIDOS E ANTIULCEROSOS ASSOCIADOS",
    "numero_registro_anvisa": "177940012",
    "laboratorio_fabricante": "09545589000188 - MABRA FARMACEUTICA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 30,
    "nome_produto": "IMENSE",
    "principio_ativo": "succinato de desvenlafaxina monoidratado",
    "classe_terapeutica": "ANTIDEPRESSIVOS",
    "numero_registro_anvisa": "102351199",
    "laboratorio_fabricante": "57507378000365 - EMS S/A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 34,
    "nome_produto": "LORATADINA + SULFATO DE PSEUDOEFEDRINA",
    "principio_ativo": "loratadina, sulfato de pseudoefedrina",
    "classe_terapeutica": "ANTI-HISTAMINICOS SISTEMICOS",
    "numero_registro_anvisa": "100680961",
    "laboratorio_fabricante": "56994502000130 - NOVARTIS BIOCIENCIAS S.A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 35,
    "nome_produto": "LOVASTATINA",
    "principio_ativo": "lovastatina",
    "classe_terapeutica": "ANTILIPEMICOS",
    "numero_registro_anvisa": "100470393",
    "laboratorio_fabricante": "61286647000116 - SANDOZ DO BRASIL INDÚSTRIA FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 38,
    "nome_produto": "PLAGEX",
    "principio_ativo": "cloridrato de metoclopramida monoidratado",
    "classe_terapeutica": "ANTIEMETICOS E ANTINAUSEANTES",
    "numero_registro_anvisa": "103700217",
    "laboratorio_fabricante": "17159229000176 - LABORATÓRIO TEUTO BRASILEIRO S/A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 39,
    "nome_produto": "PRATURE",
    "principio_ativo": "pantoprazol, pantoprazol sódico sesqui-hidratado",
    "classe_terapeutica": "ANTIACIDOS E ANTIULCEROSOS SIMPLES",
    "numero_registro_anvisa": "118190183",
    "laboratorio_fabricante": "92265552000905 - MULTILAB INDUSTRIA E COMERCIO DE PRODUTOS FARMACEUTICOS LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 40,
    "nome_produto": "PROCORDIS HCTZ",
    "principio_ativo": "candesartana cilexetila, hidroclorotiazida",
    "classe_terapeutica": "ANTI-HIPERTENSIVOS",
    "numero_registro_anvisa": "154230228",
    "laboratorio_fabricante": "03485572000104 - GEOLAB INDÚSTRIA FARMACÊUTICA S/A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 41,
    "nome_produto": "SELIMAX",
    "principio_ativo": "azitromicina di-hidratada",
    "classe_terapeutica": "ANTIBIOTICOS SISTEMICOS SIMPLES",
    "numero_registro_anvisa": "100330067",
    "laboratorio_fabricante": "61230314000175 - LIBBS FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 42,
    "nome_produto": "ACTIVELLE",
    "principio_ativo": "estradiol hemi-hidratado, acetato de noretisterona",
    "classe_terapeutica": "ESTROGENOS ASSOCS  A OUTROS FARMACOS EXCLUSIVE ANDROGENOS",
    "numero_registro_anvisa": "100431042",
    "laboratorio_fabricante": "61190096000192 - EUROFARMA LABORATORIOS S.A.",
    "categoria_regulatoria": "Novo",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 43,
    "nome_produto": "AGAROL",
    "principio_ativo": "picossulfato de sódio, óleo mineral leve, agar-agar",
    "classe_terapeutica": "LAXANTES IRRITANTES OU ESTIMULANTES",
    "numero_registro_anvisa": "105730084",
    "laboratorio_fabricante": "60659463002992 - ACHÉ LABORATÓRIOS FARMACÊUTICOS S.A",
    "categoria_regulatoria": "Novo",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 44,
    "nome_produto": "ALPRAZOLAM",
    "principio_ativo": "alprazolam",
    "classe_terapeutica": "ANSIOLITICOS SIMPLES",
    "numero_registro_anvisa": "112130424",
    "laboratorio_fabricante": "53162095000106 - BIOSINTÉTICA FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 47,
    "nome_produto": "CEFADROXILA",
    "principio_ativo": "cefadroxila",
    "classe_terapeutica": "CEFALOSPORINAS",
    "numero_registro_anvisa": "104080059",
    "laboratorio_fabricante": "46385514000103 - ROYTON QUÍMICA FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 49,
    "nome_produto": "CLORIDRATO DE DORZOLAMIDA",
    "principio_ativo": "cloridrato de dorzolamida",
    "classe_terapeutica": "ANTIGLAUCOMATOSOS",
    "numero_registro_anvisa": "112130326",
    "laboratorio_fabricante": "53162095000106 - BIOSINTÉTICA FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 50,
    "nome_produto": "CYMBALTA",
    "principio_ativo": "cloridrato de duloxetina",
    "classe_terapeutica": "ANTIDEPRESSIVOS",
    "numero_registro_anvisa": "112600164",
    "laboratorio_fabricante": "43940618000144 - ELI LILLY DO BRASIL LTDA",
    "categoria_regulatoria": "Novo",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 51,
    "nome_produto": "DIPROPIONATO DE BETAMETASONA + SULFATO DE GENTAMICINA",
    "principio_ativo": "dipropionato de betametasona, sulfato de gentamicina",
    "classe_terapeutica": "ANTINFECCIOSOS TOPICOS-ASSOCIACOES MEDICAMENTOSAS",
    "numero_registro_anvisa": "123520209",
    "laboratorio_fabricante": "73663650000190 - RANBAXY FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 52,
    "nome_produto": "GOLTRITE",
    "principio_ativo": "colchicina",
    "classe_terapeutica": "ANTINFLAMATORIOS ANTIREUMATICOS",
    "numero_registro_anvisa": "126750377",
    "laboratorio_fabricante": "72593791000111 - NOVA QUIMICA FARMACÊUTICA S/A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 53,
    "nome_produto": "IMIPENÉM MONOIDRATADO + CILASTATINA SÓDICA",
    "principio_ativo": "cilastatina sódica, imipeném monoidratado",
    "classe_terapeutica": "ANTIBIOTICOS SISTEMICOS-ASSOCIACOES MEDICAMENTOSAS",
    "numero_registro_anvisa": "188300029",
    "laboratorio_fabricante": "11643096000122 - VIATRIS FARMACEUTICA DO BRASIL LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 56,
    "nome_produto": "NIMODIPINO",
    "principio_ativo": "nimodipino",
    "classe_terapeutica": "VASODILATADORES CEREBRAIS",
    "numero_registro_anvisa": "135690361",
    "laboratorio_fabricante": "00923140000131 - EMS SIGMA PHARMA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 61,
    "nome_produto": "SIFROL",
    "principio_ativo": "dicloridrato de pramipexol",
    "classe_terapeutica": "ANTIPARKINSONIANOS",
    "numero_registro_anvisa": "103670107",
    "laboratorio_fabricante": "60831658000177 - BOEHRINGER INGELHEIM DO BRASIL QUÍMICA E FARMACÊUTICA LTDA.",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 62,
    "nome_produto": "SITRAC",
    "principio_ativo": "besilato de atracúrio",
    "classe_terapeutica": "RELAXANTES MUSCULARES CENTRAIS SIMPLES",
    "numero_registro_anvisa": "123610021",
    "laboratorio_fabricante": "64711500000114 - UCB BIOPHARMA LTDA.",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 63,
    "nome_produto": "SOLUÇÃO DE AMINOACIDOS E CARBOIDRATOS P/ NEFROPATAS",
    "principio_ativo": "SOLUÇÃO DE AMINOACIDOS E CARBOIDRATOS P/ NEFROPATAS",
    "classe_terapeutica": "NUTRIENTES PARENTERAIS",
    "numero_registro_anvisa": "100410039",
    "laboratorio_fabricante": "49324221000104 - FRESENIUS KABI BRASIL LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 64,
    "nome_produto": "TEKASAN",
    "principio_ativo": "ginkgo biloba l.",
    "classe_terapeutica": "Farmacoterápico",
    "numero_registro_anvisa": "146820005",
    "laboratorio_fabricante": "05035244000123 - SUN FARMACÊUTICA DO BRASIL LTDA",
    "categoria_regulatoria": "Fitoterápico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 65,
    "nome_produto": "TESTE CLOEN",
    "principio_ativo": "namiroteno, metotrexato, agua de cal, dipirona",
    "classe_terapeutica": "AGENTE IMUNOSUPRESSOR",
    "numero_registro_anvisa": "167250012",
    "laboratorio_fabricante": "11111111000191 - EMPRESA DE TESTE LTDA. (VS01)",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 66,
    "nome_produto": "TIABENDAZOL",
    "principio_ativo": "tiabendazol",
    "classe_terapeutica": "ANTI-HELMINTICOS DO TRATO GASTRINTESTINAL",
    "numero_registro_anvisa": "105830404",
    "laboratorio_fabricante": "45992062000165 - GERMED FARMACEUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 67,
    "nome_produto": "UNI-GLIC",
    "principio_ativo": "gliclazida",
    "classe_terapeutica": "ANTIDIABETICOS",
    "numero_registro_anvisa": "104971233",
    "laboratorio_fabricante": "60665981000118 - UNIÃO QUÍMICA FARMACÊUTICA NACIONAL S/A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 68,
    "nome_produto": "VALSARTANA + HIDROCLOROTIAZIDA + BESILATO DE ANLODIPINO",
    "principio_ativo": "valsartana, hidroclorotiazida, besilato de anlodipino",
    "classe_terapeutica": "ANTI-HIPERTENSIVOS-ASSOCIACOES MEDICAMENTOSAS",
    "numero_registro_anvisa": "135170024",
    "laboratorio_fabricante": "48344725000719 - ALTHAIA S.A. INDUSTRIA FARMACEUTICA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 69,
    "nome_produto": "VENOLISE",
    "principio_ativo": "melilotus officinalis (l.) pall., melilotus officinalis lam.",
    "classe_terapeutica": "Farmacoterápico",
    "numero_registro_anvisa": "118610269",
    "laboratorio_fabricante": "64088172000141 - ATIVUS FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Fitoterápico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 70,
    "nome_produto": "ZESTRIL",
    "principio_ativo": "lisinopril, lisinopril di-hidratado",
    "classe_terapeutica": "ANTI-HIPERTENSIVOS SIMPLES",
    "numero_registro_anvisa": "116180041",
    "laboratorio_fabricante": "60318797000100 - ASTRAZENECA DO BRASIL LTDA",
    "categoria_regulatoria": "Novo",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 73,
    "nome_produto": "ARACOR",
    "principio_ativo": "valsartana",
    "classe_terapeutica": "ANTI-HIPERTENSIVOS SIMPLES",
    "numero_registro_anvisa": "126750182",
    "laboratorio_fabricante": "72593791000111 - NOVA QUIMICA FARMACÊUTICA S/A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 74,
    "nome_produto": "ATROVERAN DIP",
    "principio_ativo": "dipirona monoidratada",
    "classe_terapeutica": "ANALGESICOS NAO NARCOTICOS",
    "numero_registro_anvisa": "178170862",
    "laboratorio_fabricante": "61082426000207 - COSMED INDUSTRIA DE COSMETICOS E MEDICAMENTOS S.A.",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 75,
    "nome_produto": "BENZOLATO",
    "principio_ativo": "benzoato de benzila",
    "classe_terapeutica": "ESCABICIDAS E OUTROS ECTOPARASITICIDAS",
    "numero_registro_anvisa": "100020088",
    "laboratorio_fabricante": "29322013000169 - LABORATORIO SEDABEL LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 78,
    "nome_produto": "CITRATO DE FENTANILA",
    "principio_ativo": "citrato de fentanila",
    "classe_terapeutica": "ANALGESICOS NARCOTICOS",
    "numero_registro_anvisa": "100430944",
    "laboratorio_fabricante": "61190096000192 - EUROFARMA LABORATORIOS S.A.",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 79,
    "nome_produto": "CITRATO DE SILDENAFILA",
    "principio_ativo": "citrato de sildenafila",
    "classe_terapeutica": "VASODILATADORES",
    "numero_registro_anvisa": "123520242",
    "laboratorio_fabricante": "73663650000190 - RANBAXY FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 82,
    "nome_produto": "DICLOFENACO POTASSICO",
    "principio_ativo": "DICLOFENACO POTASSICO",
    "classe_terapeutica": "ANTINFLAMATORIOS",
    "numero_registro_anvisa": "112830039",
    "laboratorio_fabricante": "52208733000110 - LABORATORIO ITAFARMA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 83,
    "nome_produto": "DICLORIDRATO DE PRAMIPEXOL",
    "principio_ativo": "dicloridrato de pramipexol",
    "classe_terapeutica": "ANTIPARKINSONIANOS",
    "numero_registro_anvisa": "112130440",
    "laboratorio_fabricante": "53162095000106 - BIOSINTÉTICA FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 84,
    "nome_produto": "DIPBE",
    "principio_ativo": "dipirona",
    "classe_terapeutica": "ANALGESICOS NAO NARCOTICOS",
    "numero_registro_anvisa": "196240001",
    "laboratorio_fabricante": "43056264000170 - KYMBERG FARMACEUTICA DO BRASIL LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 85,
    "nome_produto": "ENALABAL",
    "principio_ativo": "maleato de enalapril",
    "classe_terapeutica": "ANTI-HIPERTENSIVOS SIMPLES",
    "numero_registro_anvisa": "101460073",
    "laboratorio_fabricante": "61150447000131 - LABORATÓRIOS BALDACCI LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 88,
    "nome_produto": "GINSENG DOVER",
    "principio_ativo": "ginseng",
    "classe_terapeutica": "PRODUTOS NATURAIS SIMPLES",
    "numero_registro_anvisa": "107120061",
    "laboratorio_fabricante": "29961620000179 - DOVER FARMACEUTICA LTDA",
    "categoria_regulatoria": "Fitoterápico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 89,
    "nome_produto": "KABIVEN",
    "principio_ativo": "alanina, glicose monohidratada, óleo de soja, arginina, l-alanina, ácido aspártico, l-arginina, ácido glutâmico, glicina, l-ácido aspártico, histidina, l-ácido glutâmico, isoleucina, l-histidina, leucina, cloridrato de lisina, l-isoleucina, l-leucina, metionina (11 c), fenilalanina, l-metionina, prolina, l-fenilalanina, serina, l-prolina, treonina, l-serina, triptofano, l-treon",
    "classe_terapeutica": "NUTRIENTES PARENTERAIS",
    "numero_registro_anvisa": "100419938",
    "laboratorio_fabricante": "49324221000104 - FRESENIUS KABI BRASIL LTDA",
    "categoria_regulatoria": "Específico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 91,
    "nome_produto": "LENOVOR",
    "principio_ativo": "leucovorina",
    "classe_terapeutica": "ANTIMETABOLICOS ANTAGONISTAS DO ACIDO FOLICO",
    "numero_registro_anvisa": "126030026",
    "laboratorio_fabricante": "74019670000196 - ÍTACA LABORATÓRIOS LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 92,
    "nome_produto": "LISADOR",
    "principio_ativo": "dipirona, cloridrato de prometazina, cloridrato de adifenina",
    "classe_terapeutica": "ANALGESICOS NAO NARCOTICOS",
    "numero_registro_anvisa": "178170060",
    "laboratorio_fabricante": "61082426000207 - COSMED INDUSTRIA DE COSMETICOS E MEDICAMENTOS S.A.",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 93,
    "nome_produto": "LONGACILIN",
    "principio_ativo": "benzilpenicilina benzatina",
    "classe_terapeutica": "ANTIBIOTICOS SISTEMICOS SIMPLES",
    "numero_registro_anvisa": "109740027",
    "laboratorio_fabricante": "49475833000106 - BIOLAB SANUS FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 94,
    "nome_produto": "MALEATO DE ENALAPRIL",
    "principio_ativo": "maleato de enalapril",
    "classe_terapeutica": "ANTI-HIPERTENSIVOS SIMPLES",
    "numero_registro_anvisa": "101810376",
    "laboratorio_fabricante": "50929710000179 - MEDLEY INDÚSTRIA FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 96,
    "nome_produto": "MINIGEST",
    "principio_ativo": "gestodeno, etinilestradiol",
    "classe_terapeutica": "ANTICONCEPCIONAIS",
    "numero_registro_anvisa": "109740093",
    "laboratorio_fabricante": "49475833000106 - BIOLAB SANUS FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 98,
    "nome_produto": "NITRATO DE MICONAZOL",
    "principio_ativo": "nitrato de miconazol",
    "classe_terapeutica": "ANTIMICOTICOS PARA USO TOPICO",
    "numero_registro_anvisa": "148960002",
    "laboratorio_fabricante": "03108098000193 - BLISFARMA INDÚSTRIA FARMACÊUTICA LTDA - ME",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 103,
    "nome_produto": "OLMESARTANA MEDOXOMILA",
    "principio_ativo": "olmesartana medoxomila",
    "classe_terapeutica": "ANTI-HIPERTENSIVOS",
    "numero_registro_anvisa": "183260270",
    "laboratorio_fabricante": "10588595001092 - SANOFI MEDLEY FARMACÊUTICA LTDA.",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 104,
    "nome_produto": "PATAGEX",
    "principio_ativo": "cloridrato de olopatadina",
    "classe_terapeutica": "MEDICAMENTOS COM ACAO NO APARELHO VISUAL",
    "numero_registro_anvisa": "115600117",
    "laboratorio_fabricante": "17562075000169 - CIFARMA CIENTÍFICA FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 106,
    "nome_produto": "PRESSALIV",
    "principio_ativo": "cloridrato de dorzolamida, maleato de timolol",
    "classe_terapeutica": "ANTIGLAUCOMATOSOS",
    "numero_registro_anvisa": "178170127",
    "laboratorio_fabricante": "61082426000207 - COSMED INDUSTRIA DE COSMETICOS E MEDICAMENTOS S.A.",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 107,
    "nome_produto": "SCAFLAM",
    "principio_ativo": "nimesulida",
    "classe_terapeutica": "ANTINFLAMATORIOS",
    "numero_registro_anvisa": "178170776",
    "laboratorio_fabricante": "61082426000207 - COSMED INDUSTRIA DE COSMETICOS E MEDICAMENTOS S.A.",
    "categoria_regulatoria": "Medicamento",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 108,
    "nome_produto": "TRIMEDAL D&F",
    "principio_ativo": "paracetamol",
    "classe_terapeutica": "ANALGESICOS NAO NARCOTICOS",
    "numero_registro_anvisa": "100681057",
    "laboratorio_fabricante": "56994502000130 - NOVARTIS BIOCIENCIAS S.A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 109,
    "nome_produto": "VANTIL",
    "principio_ativo": "ibuprofeno",
    "classe_terapeutica": "ANALGESICOS NAO NARCOTICOS",
    "numero_registro_anvisa": "104810074",
    "laboratorio_fabricante": "48113906000149 - 1FARMA INDUSTRIA FARMACEUTICA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 110,
    "nome_produto": "VAZTTORIN",
    "principio_ativo": "atorvastatina cálcica",
    "classe_terapeutica": "ANTILIPEMICOS",
    "numero_registro_anvisa": "143810185",
    "laboratorio_fabricante": "02814497000107 - CIMED INDUSTRIA S.A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 113,
    "nome_produto": "AGUA DESTILADA ESTERIL E APIROGENICA",
    "principio_ativo": "AGUA DESTILADA ESTERIL E APIROGENICA",
    "classe_terapeutica": "DILUENTES E VEICULOS DE MEDICAMENTOS",
    "numero_registro_anvisa": "102940120",
    "laboratorio_fabricante": "61541132000115 - NEOLATINA COMÉRCIO E INDÚSTRIA FARMACEUTICA S.A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 115,
    "nome_produto": "ALCACHOFRA FLORA MEDICINAL",
    "principio_ativo": "cynara scolymus l.",
    "classe_terapeutica": "FITOTERAPICO SIMPLES",
    "numero_registro_anvisa": "137070003",
    "laboratorio_fabricante": "02007074000185 - FLORA MEDICINAL J. MONTEIRO DA SILVA LTDA",
    "categoria_regulatoria": "Fitoterápico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 116,
    "nome_produto": "AMOXICILINA TRIIDRATADA",
    "principio_ativo": "amoxicilina tri-hidratada",
    "classe_terapeutica": "PENICILINA DE AMPLO ESPECTRO",
    "numero_registro_anvisa": "126750281",
    "laboratorio_fabricante": "72593791000111 - NOVA QUIMICA FARMACÊUTICA S/A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 117,
    "nome_produto": "CIST 3",
    "principio_ativo": "levofloxacina",
    "classe_terapeutica": "ANTIBIOTICOS SISTEMICOS SIMPLES",
    "numero_registro_anvisa": "103900132",
    "laboratorio_fabricante": "33349473000158 - FARMOQUÍMICA S/A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 118,
    "nome_produto": "CLAVUTAM",
    "principio_ativo": "amoxicilina sódica, clavulanato de potássio",
    "classe_terapeutica": "ANTIBIOTICOS SISTEMICOS-ASSOCIACOES MEDICAMENTOSAS",
    "numero_registro_anvisa": "120690023",
    "laboratorio_fabricante": "94869054000131 - LABORATÓRIOS LIBRA DO BRASIL LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 119,
    "nome_produto": "CLORIDRATO DE BENZIDAMINA",
    "principio_ativo": "CLORIDRATO DE BENZIDAMINA",
    "classe_terapeutica": "ANTINFLAMATORIOS",
    "numero_registro_anvisa": "104650332",
    "laboratorio_fabricante": "29785870000103 - LABORATÓRIO NEO QUÍMICA COMÉRCIO E INDÚSTRIA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 120,
    "nome_produto": "CLORTANA",
    "principio_ativo": "clortalidona",
    "classe_terapeutica": "DIURETICOS SIMPLES",
    "numero_registro_anvisa": "104040181",
    "laboratorio_fabricante": "61299111000135 - LUPER INDÚSTRIA FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 121,
    "nome_produto": "CORGARD",
    "principio_ativo": "nadolol",
    "classe_terapeutica": "AGENTES BETABLOQUEADORES",
    "numero_registro_anvisa": "101800011",
    "laboratorio_fabricante": "56998982000107 - BRISTOL-MYERS SQUIBB FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Novo",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 123,
    "nome_produto": "SAROLIN",
    "principio_ativo": "sulfato de salbutamol",
    "classe_terapeutica": "BRONCODILATADORES",
    "numero_registro_anvisa": "109630042",
    "laboratorio_fabricante": "06597801000162 - THEODORO F SOBRAL & CIA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 124,
    "nome_produto": "SINVALIP AASPAC",
    "principio_ativo": "sinvastatina, ácido acetilsalicílico",
    "classe_terapeutica": "OUTROS MEDICAMENTOS DE ACAO NO APARELHO CARDIOVASCULAR",
    "numero_registro_anvisa": "135690454",
    "laboratorio_fabricante": "00923140000131 - EMS SIGMA PHARMA LTDA",
    "categoria_regulatoria": "Novo",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 125,
    "nome_produto": "SULFATO DE BARIO",
    "principio_ativo": "SULFATO DE BARIO",
    "classe_terapeutica": "PRODUTOS PARA DIAGNOSTICO POR IMAGEM",
    "numero_registro_anvisa": "113980027",
    "laboratorio_fabricante": "30153811000193 - GUERBET IMAGEM DO BRASIL LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 126,
    "nome_produto": "TINAX",
    "principio_ativo": "eritropoetina humana recombinante",
    "classe_terapeutica": "OUTROS PRODUTOS QUE ATUAM NO SANGUE E HEMATOPOIESE",
    "numero_registro_anvisa": "100430633",
    "laboratorio_fabricante": "61190096000192 - EUROFARMA LABORATORIOS S.A.",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 127,
    "nome_produto": "VACINA ANTI-TETANICA ADSORVIDA",
    "principio_ativo": "VACINA ANTI-TETANICA ADSORVIDA",
    "classe_terapeutica": "VACINAS",
    "numero_registro_anvisa": "125170001",
    "laboratorio_fabricante": "00134789000173 - NUTOTH - PHARMA INDÚSTRIA E COMÉRCIO LTDA",
    "categoria_regulatoria": "Novo",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 128,
    "nome_produto": "VALSARTANA",
    "principio_ativo": "valsartana",
    "classe_terapeutica": "ANTI-HIPERTENSIVOS SIMPLES",
    "numero_registro_anvisa": "167730484",
    "laboratorio_fabricante": "05044984000126 - LEGRAND PHARMA INDÚSTRIA FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 129,
    "nome_produto": "VELAMOX",
    "principio_ativo": "amoxicilina tri-hidratada",
    "classe_terapeutica": "ANTIBIOTICOS SISTEMICOS SIMPLES",
    "numero_registro_anvisa": "135690623",
    "laboratorio_fabricante": "00923140000131 - EMS SIGMA PHARMA LTDA",
    "categoria_regulatoria": "Medicamento",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 133,
    "nome_produto": "CARVEDILOL",
    "principio_ativo": "carvedilol",
    "classe_terapeutica": "ANTI-HIPERTENSIVOS",
    "numero_registro_anvisa": "126750242",
    "laboratorio_fabricante": "72593791000111 - NOVA QUIMICA FARMACÊUTICA S/A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 135,
    "nome_produto": "CLORIDRATO DE AMBROXOL",
    "principio_ativo": "cloridrato de ambroxol",
    "classe_terapeutica": "EXPECTORANTES BALSAMICOS E MUCOLITICO",
    "numero_registro_anvisa": "118610245",
    "laboratorio_fabricante": "64088172000141 - ATIVUS FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 137,
    "nome_produto": "COSARTAN",
    "principio_ativo": "valsartana",
    "classe_terapeutica": "ANTI-HIPERTENSIVOS SIMPLES",
    "numero_registro_anvisa": "105830708",
    "laboratorio_fabricante": "45992062000165 - GERMED FARMACEUTICA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 140,
    "nome_produto": "DEXCLOR",
    "principio_ativo": "maleato de dexclorfeniramina",
    "classe_terapeutica": "ANTIALERGICOS",
    "numero_registro_anvisa": "102980153",
    "laboratorio_fabricante": "44734671000151 - CRISTÁLIA PRODUTOS QUÍMICOS FARMACÊUTICOS LTDA.",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 141,
    "nome_produto": "DICLORIDRATO DE PRAMIPEXOL",
    "principio_ativo": "dicloridrato de pramipexol",
    "classe_terapeutica": "ANTIPARKINSONIANOS",
    "numero_registro_anvisa": "104920197",
    "laboratorio_fabricante": "33150764000112 - BIOLAB FARMA GENERICOS LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 144,
    "nome_produto": "HELICOCID TRIPLICE",
    "principio_ativo": "omeprazol, claritromicina, amoxicilina, amoxicilina tri-hidratada",
    "classe_terapeutica": "ANTIBIOTICOS SISTEMICOS-ASSOCIACOES MEDICAMENTOSAS",
    "numero_registro_anvisa": "135690031",
    "laboratorio_fabricante": "00923140000131 - EMS SIGMA PHARMA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 145,
    "nome_produto": "HEPAT",
    "principio_ativo": "silybum marianum (l.) gaertn",
    "classe_terapeutica": "Farmacoterápico",
    "numero_registro_anvisa": "177940043",
    "laboratorio_fabricante": "09545589000188 - MABRA FARMACEUTICA LTDA",
    "categoria_regulatoria": "Fitoterápico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 146,
    "nome_produto": "IBAMOXIL",
    "principio_ativo": "amocixilina trihidratada, amoxicilina trihidratada",
    "classe_terapeutica": "ANTIBIOTICOS SISTEMICOS SIMPLES",
    "numero_registro_anvisa": "109860009",
    "laboratorio_fabricante": "74135922000142 - IBFARMA INDUSTRIA DE BIOTECNOLOGIA FTCA LTDA.",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 147,
    "nome_produto": "ICADEN",
    "principio_ativo": "nitrato de isoconazol",
    "classe_terapeutica": "PRODUTOS GINECOLOGICOS ANTINFECCIOSOS TOPICOS SIMPLES",
    "numero_registro_anvisa": "100200024",
    "laboratorio_fabricante": "56990534000167 - UNIAO QUIMICA INTERNACIONAL LTDA",
    "categoria_regulatoria": "Novo",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 149,
    "nome_produto": "KITAPEN",
    "principio_ativo": "hemifumarato de quetiapina",
    "classe_terapeutica": "ANTIPSICOTICOS",
    "numero_registro_anvisa": "104920230",
    "laboratorio_fabricante": "33150764000112 - BIOLAB FARMA GENERICOS LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 150,
    "nome_produto": "LAFLUGI",
    "principio_ativo": "lansoprazol",
    "classe_terapeutica": "ANTIULCEROSOS",
    "numero_registro_anvisa": "126750326",
    "laboratorio_fabricante": "72593791000111 - NOVA QUIMICA FARMACÊUTICA S/A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 151,
    "nome_produto": "LOZEPREL",
    "principio_ativo": "omeprazol",
    "classe_terapeutica": "ANTIULCEROSOS",
    "numero_registro_anvisa": "118190043",
    "laboratorio_fabricante": "92265552000905 - MULTILAB INDUSTRIA E COMERCIO DE PRODUTOS FARMACEUTICOS LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 152,
    "nome_produto": "MEBENDAZOL",
    "principio_ativo": "mebendazol",
    "classe_terapeutica": "ANTI-HELMINTICOS DO TRATO GASTRINTESTINAL",
    "numero_registro_anvisa": "100630286",
    "laboratorio_fabricante": "33258401000103 - INSTITUTO BIOCHIMICO INDÚSTRIA FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 154,
    "nome_produto": "MIDOSTAURINA",
    "principio_ativo": "midostaurina",
    "classe_terapeutica": "Farmacoterápico",
    "numero_registro_anvisa": "151430088",
    "laboratorio_fabricante": "03978166000175 - DR. REDDYS FARMACÊUTICA DO BRASIL LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 159,
    "nome_produto": "CITRATO DE TAMOXIFENO",
    "principio_ativo": "citrato de tamoxifeno",
    "classe_terapeutica": "ANTINEOPLASICO",
    "numero_registro_anvisa": "126750304",
    "laboratorio_fabricante": "72593791000111 - NOVA QUIMICA FARMACÊUTICA S/A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 160,
    "nome_produto": "CLORIDRATO DULOXETINA",
    "principio_ativo": "cloridrato de duloxetina",
    "classe_terapeutica": "ANTIDEPRESSIVOS",
    "numero_registro_anvisa": "126750373",
    "laboratorio_fabricante": "72593791000111 - NOVA QUIMICA FARMACÊUTICA S/A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 163,
    "nome_produto": "DALSY",
    "principio_ativo": "ibuprofeno",
    "classe_terapeutica": "Farmacoterápico",
    "numero_registro_anvisa": "101160161",
    "laboratorio_fabricante": "33258450000138 - KNOLL PRODS QUIMS FARMACEUTICOS LTDA.",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 166,
    "nome_produto": "HUMULIN N",
    "principio_ativo": "insulina humana, insulina humana biosintética",
    "classe_terapeutica": "ANTIDIABETICOS",
    "numero_registro_anvisa": "112600057",
    "laboratorio_fabricante": "43940618000144 - ELI LILLY DO BRASIL LTDA",
    "categoria_regulatoria": "Novo",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 167,
    "nome_produto": "IBUFRAN",
    "principio_ativo": "ibuprofeno",
    "classe_terapeutica": "ANTINFLAMATORIOS ANTIREUMATICOS",
    "numero_registro_anvisa": "155840136",
    "laboratorio_fabricante": "05161069000110 - BRAINFARMA INDÚSTRIA QUÍMICA E FARMACÊUTICA S.A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 168,
    "nome_produto": "IBUPROFENO",
    "principio_ativo": "ibuprofeno",
    "classe_terapeutica": "ANALGESICOS NAO NARCOTICOS",
    "numero_registro_anvisa": "167730063",
    "laboratorio_fabricante": "05044984000126 - LEGRAND PHARMA INDÚSTRIA FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 169,
    "nome_produto": "MALEATO DE ENALAPRIL",
    "principio_ativo": "maleato de enalapril",
    "classe_terapeutica": "ANTI-HIPERTENSIVOS SIMPLES",
    "numero_registro_anvisa": "101810376",
    "laboratorio_fabricante": "50929710000179 - MEDLEY INDÚSTRIA FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 170,
    "nome_produto": "MALEATO DE TIMOLOL",
    "principio_ativo": "maleato de timolol",
    "classe_terapeutica": "ANTIGLAUCOMATOSOS",
    "numero_registro_anvisa": "167730511",
    "laboratorio_fabricante": "05044984000126 - LEGRAND PHARMA INDÚSTRIA FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 173,
    "nome_produto": "OXALATO DE ESCITALOPRAM",
    "principio_ativo": "oxalato de escitalopram",
    "classe_terapeutica": "ANTIDEPRESSIVOS",
    "numero_registro_anvisa": "105830797",
    "laboratorio_fabricante": "45992062000165 - GERMED FARMACEUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 176,
    "nome_produto": "RIXUBIS",
    "principio_ativo": "gamanonacogue",
    "classe_terapeutica": "OUTROS PRODUTOS QUE ATUAM NO SANGUE E HEMATOPOIESE",
    "numero_registro_anvisa": "106390285",
    "laboratorio_fabricante": "60397775000174 - TAKEDA PHARMA LTDA.",
    "categoria_regulatoria": "Biológico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 177,
    "nome_produto": "RUTOSIDO + BROMELAÍNA + TRIPSINA",
    "principio_ativo": "RUTOSIDO + BROMELAÍNA + TRIPSINA",
    "classe_terapeutica": "ANTINFLAMATORIOS E ANTIREUMATIOS-ASSOCS  MEDICAMENTOSAS",
    "numero_registro_anvisa": "119020001",
    "laboratorio_fabricante": "55765937000140 - KHOL INDUSTRIAL  LTDA",
    "categoria_regulatoria": "Novo",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 178,
    "nome_produto": "SECNIDAZOL",
    "principio_ativo": "secnidazol",
    "classe_terapeutica": "AMEBICIDAS, GIARDICIDAS E TRICOMONICIDAS",
    "numero_registro_anvisa": "172870163",
    "laboratorio_fabricante": "02932074000191 - HYPERA S.A.",
    "categoria_regulatoria": "Medicamento",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 179,
    "nome_produto": "SOMAVERT",
    "principio_ativo": "pegvisomanto",
    "classe_terapeutica": "OUTROS HORMONIOS MEDIADORES E PRODUTOS EQUIVALENTES",
    "numero_registro_anvisa": "102160178",
    "laboratorio_fabricante": "46070868003699 - LABORATÓRIOS PFIZER LTDA",
    "categoria_regulatoria": "Biológico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 180,
    "nome_produto": "VALSACOR DUO",
    "principio_ativo": "valsartana, besilato de anlodipino",
    "classe_terapeutica": "ANTI-HIPERTENSIVOS-ASSOCIACOES MEDICAMENTOSAS",
    "numero_registro_anvisa": "167730505",
    "laboratorio_fabricante": "05044984000126 - LEGRAND PHARMA INDÚSTRIA FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 182,
    "nome_produto": "VERA - BRAS",
    "principio_ativo": "cloridrato de verapamil",
    "classe_terapeutica": "ANTIARRITMICOS",
    "numero_registro_anvisa": "100490089",
    "laboratorio_fabricante": "91671792000181 - LABORATÓRIO SAÚDE LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 183,
    "nome_produto": "ANDROLIP",
    "principio_ativo": "sinvastatina",
    "classe_terapeutica": "ANTILIPEMICOS",
    "numero_registro_anvisa": "103700136",
    "laboratorio_fabricante": "17159229000176 - LABORATÓRIO TEUTO BRASILEIRO S/A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 187,
    "nome_produto": "DICLORIDRATO DE PRAMIPEXOL",
    "principio_ativo": "dicloridrato de pramipexol",
    "classe_terapeutica": "ANTIPARKINSONIANOS",
    "numero_registro_anvisa": "105830760",
    "laboratorio_fabricante": "45992062000165 - GERMED FARMACEUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 188,
    "nome_produto": "DIGESTBEM",
    "principio_ativo": "bicarbonato de sódio, carbonato de sódio, acido citrico, ácido cítrico anidro",
    "classe_terapeutica": "ANTIACIDO",
    "numero_registro_anvisa": "100430700",
    "laboratorio_fabricante": "61190096000192 - EUROFARMA LABORATORIOS S.A.",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 189,
    "nome_produto": "DOMPERIX",
    "principio_ativo": "domperidona",
    "classe_terapeutica": "ANTIEMETICOS E ANTINAUSEANTES",
    "numero_registro_anvisa": "100431033",
    "laboratorio_fabricante": "61190096000192 - EUROFARMA LABORATORIOS S.A.",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 191,
    "nome_produto": "GINKOMILLIUM",
    "principio_ativo": "ginkgo biloba l.",
    "classe_terapeutica": "Farmacoterápico",
    "numero_registro_anvisa": "106240238",
    "laboratorio_fabricante": "29333218000140 - INDÚSTRIA FARMACÊUTICA MILIAN LTDA",
    "categoria_regulatoria": "Fitoterápico",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 193,
    "nome_produto": "HIMAAGIN",
    "principio_ativo": "atenolol",
    "classe_terapeutica": "BETABLOQUEADORES SIMPLES",
    "numero_registro_anvisa": "102351170",
    "laboratorio_fabricante": "57507378000365 - EMS S/A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 194,
    "nome_produto": "LOPURAX",
    "principio_ativo": "alopurinol",
    "classe_terapeutica": "ANTIGOTOSOS",
    "numero_registro_anvisa": "107140114",
    "laboratorio_fabricante": "61068755000708 - SANVAL COMERCIO E INDUSTRIA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 196,
    "nome_produto": "NEOPRAZOL",
    "principio_ativo": "omeprazol",
    "classe_terapeutica": "ANTIULCEROSOS",
    "numero_registro_anvisa": "155840290",
    "laboratorio_fabricante": "05161069000110 - BRAINFARMA INDÚSTRIA QUÍMICA E FARMACÊUTICA S.A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 197,
    "nome_produto": "OXIPELLE",
    "principio_ativo": "nitrato de oxiconazol",
    "classe_terapeutica": "ANTIMICOTICOS PARA USO TOPICO",
    "numero_registro_anvisa": "119610022",
    "laboratorio_fabricante": "27011022000103 - BL INDÚSTRIA OTICA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 201,
    "nome_produto": "RAFEX",
    "principio_ativo": "cloridrato de fexofenadina",
    "classe_terapeutica": "ANTI-HISTAMINICOS SISTEMICOS",
    "numero_registro_anvisa": "183260180",
    "laboratorio_fabricante": "10588595001092 - SANOFI MEDLEY FARMACÊUTICA LTDA.",
    "categoria_regulatoria": "Medicamento",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 203,
    "nome_produto": "TOBRANOM",
    "principio_ativo": "tobramicina",
    "classe_terapeutica": "ANTINFECCIOSOS TOPICOS PARA USO OFTALMICO",
    "numero_registro_anvisa": "104971296",
    "laboratorio_fabricante": "60665981000118 - UNIÃO QUÍMICA FARMACÊUTICA NACIONAL S/A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 204,
    "nome_produto": "GINKGO BILOBA",
    "principio_ativo": "GINKGO BILOBA",
    "classe_terapeutica": "FITOTERAPICO SIMPLES",
    "numero_registro_anvisa": "107740002",
    "laboratorio_fabricante": "92751965000134 - LABORATÓRIO CANGERI LTDA",
    "categoria_regulatoria": "Fitoterápico",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 206,
    "nome_produto": "BECLOSOL",
    "principio_ativo": "dipropionato de beclometasona",
    "classe_terapeutica": "GLICOCORTICOIDES TOP. SIMP. EXC. USO OFTALM.",
    "numero_registro_anvisa": "100250005",
    "laboratorio_fabricante": "33172560000182 - GLAXO WELLCOME S/A",
    "categoria_regulatoria": "Novo",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 207,
    "nome_produto": "CAPTOPRIL + HIDROCLOROTIAZIDA",
    "principio_ativo": "captopril, hidroclorotiazida",
    "classe_terapeutica": "ANTI-HIPERTENSIVOS-ASSOCIACOES MEDICAMENTOSAS",
    "numero_registro_anvisa": "112130263",
    "laboratorio_fabricante": "53162095000106 - BIOSINTÉTICA FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 208,
    "nome_produto": "CASCARA SAGRADA HERBARIUM",
    "principio_ativo": "rhamnus purshiana dc.",
    "classe_terapeutica": "FITOTERAPICO SIMPLES",
    "numero_registro_anvisa": "118600009",
    "laboratorio_fabricante": "78950011000120 - HERBARIUM LABORATORIO BOTANICO LTDA",
    "categoria_regulatoria": "Fitoterápico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 209,
    "nome_produto": "CEFADROXON",
    "principio_ativo": "cefadroxila",
    "classe_terapeutica": "CEFALOSPORINAS",
    "numero_registro_anvisa": "107140163",
    "laboratorio_fabricante": "61068755000708 - SANVAL COMERCIO E INDUSTRIA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 214,
    "nome_produto": "GENOXACIN",
    "principio_ativo": "ofloxacino",
    "classe_terapeutica": "ANTINFECCIOSOS TOPICOS PARA USO OFTALMICO",
    "numero_registro_anvisa": "104971284",
    "laboratorio_fabricante": "60665981000118 - UNIÃO QUÍMICA FARMACÊUTICA NACIONAL S/A",
    "categoria_regulatoria": "Medicamento",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 216,
    "nome_produto": "GLICOSE ASTER",
    "principio_ativo": "dextrose anidra",
    "classe_terapeutica": "REIDRATANTES PARENTERAIS",
    "numero_registro_anvisa": "109710031",
    "laboratorio_fabricante": "45951514000160 - ASTER PRODUTOS MÉDICOS LTDA",
    "categoria_regulatoria": "Específico",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 218,
    "nome_produto": "HYPOCAÍNA",
    "principio_ativo": "cloridrato de lidocaina, hemitartarato de epinefrina, edetato de sódio",
    "classe_terapeutica": "ANESTESICOS LOCAIS",
    "numero_registro_anvisa": "103870039",
    "laboratorio_fabricante": "17174657000178 - HYPOFARMA - INSTITUTO DE HYPODERMIA E FARMÁCIA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 219,
    "nome_produto": "LAMOTRIGINA",
    "principio_ativo": "lamotrigina",
    "classe_terapeutica": "ANTICONVULSIVANTES",
    "numero_registro_anvisa": "100431060",
    "laboratorio_fabricante": "61190096000192 - EUROFARMA LABORATORIOS S.A.",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 220,
    "nome_produto": "LQFEX BROMETO DE N- BUTIL ESCOPOLAMINA",
    "principio_ativo": "brometo de n-butilescopolamina",
    "classe_terapeutica": "ANTIESPASMODICOS E ANTICOLINERGICOS GASTRINTESTINAIS",
    "numero_registro_anvisa": "112080056",
    "laboratorio_fabricante": "00394452000103 - LABORATÓRIO QUÍMICO FARMACÊUTICO DO EXÉRCITO",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 221,
    "nome_produto": "MELLERIL",
    "principio_ativo": "cloridrato de tioridazina",
    "classe_terapeutica": "NEUROLEPTICOS",
    "numero_registro_anvisa": "105750008",
    "laboratorio_fabricante": "61186136000122 - VALEANT FARMACÊUTICA DO BRASIL LTDA",
    "categoria_regulatoria": "Novo",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 223,
    "nome_produto": "MONTELUCASTE DE SÓDIO",
    "principio_ativo": "montelucaste de sódio",
    "classe_terapeutica": "ANTIASMATICOS",
    "numero_registro_anvisa": "167730554",
    "laboratorio_fabricante": "05044984000126 - LEGRAND PHARMA INDÚSTRIA FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 225,
    "nome_produto": "PALMA CHRISTI",
    "principio_ativo": "ricinus communis l.",
    "classe_terapeutica": "FITOTERAPICOS ASSOCIADOS",
    "numero_registro_anvisa": "104690003",
    "laboratorio_fabricante": "46332748000192 - FLOR DO AMAZONAS IND. DE PROD. FARMACEUTICOS LTDA.",
    "categoria_regulatoria": "Fitoterápico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 226,
    "nome_produto": "RINGER",
    "principio_ativo": "cloreto de sódio, cloreto de potássio, cloreto de cálcio 2h2o, cloreto de cálcio diidratado",
    "classe_terapeutica": "ELETROLITOS SIMPLES",
    "numero_registro_anvisa": "103110009",
    "laboratorio_fabricante": "01571702000198 - HALEX ISTAR INDÚSTRIA FARMACÊUTICA SA",
    "categoria_regulatoria": "Específico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 227,
    "nome_produto": "NUPLAM - PARACETAMOL",
    "principio_ativo": "NUPLAM - PARACETAMOL",
    "classe_terapeutica": "ANALGESICOS",
    "numero_registro_anvisa": "112060001",
    "laboratorio_fabricante": "24365710000183 - UNIVERSIDADE FEDERAL DO RIO GRANDE DO NORTE",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 228,
    "nome_produto": "OLANZAPINA",
    "principio_ativo": "olanzapina",
    "classe_terapeutica": "ANTIPSICOTICOS",
    "numero_registro_anvisa": "110500051",
    "laboratorio_fabricante": "12343158000143 - LAB INDL FTCO ALAGOAS SA - LIFAL",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 230,
    "nome_produto": "PARACETAMOL",
    "principio_ativo": "PARACETAMOL",
    "classe_terapeutica": "ANALGESICOS",
    "numero_registro_anvisa": "100663364",
    "laboratorio_fabricante": "84684620000187 - LABORATORIO CATARINENSE LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 232,
    "nome_produto": "PREDNISOLONA",
    "principio_ativo": "fosfato sódico de prednisolona, prednisolona",
    "classe_terapeutica": "GLICOCORTICOIDES SISTEMICOS",
    "numero_registro_anvisa": "155840631",
    "laboratorio_fabricante": "05161069000110 - BRAINFARMA INDÚSTRIA QUÍMICA E FARMACÊUTICA S.A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 233,
    "nome_produto": "RABINEFIL",
    "principio_ativo": "sulfato de vimblastina",
    "classe_terapeutica": "ANTINEOPLASICO",
    "numero_registro_anvisa": "126030036",
    "laboratorio_fabricante": "74019670000196 - ÍTACA LABORATÓRIOS LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 234,
    "nome_produto": "RASILEZ",
    "principio_ativo": "hemifumarato de alisquireno",
    "classe_terapeutica": "ANTI-HIPERTENSIVOS SIMPLES",
    "numero_registro_anvisa": "100681055",
    "laboratorio_fabricante": "56994502000130 - NOVARTIS BIOCIENCIAS S.A",
    "categoria_regulatoria": "Novo",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 236,
    "nome_produto": "RELIPOIETIN",
    "principio_ativo": "eritropoietina",
    "classe_terapeutica": "OUTROS PRODUTOS QUE ATUAM NO SANGUE E HEMATOPOIESE",
    "numero_registro_anvisa": "125760022",
    "laboratorio_fabricante": "68949239000146 - UNITED MEDICAL LTDA",
    "categoria_regulatoria": "Biológico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 238,
    "nome_produto": "RISPERIDONA",
    "principio_ativo": "risperidona",
    "classe_terapeutica": "NEUROLEPTICOS",
    "numero_registro_anvisa": "104971394",
    "laboratorio_fabricante": "60665981000118 - UNIÃO QUÍMICA FARMACÊUTICA NACIONAL S/A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 239,
    "nome_produto": "RIXEVAST",
    "principio_ativo": "hemitartarato de rivastigmina",
    "classe_terapeutica": "OUTROS PRODUTOS QUE ATUAM SOBRE O SISTEMA NERVOSO",
    "numero_registro_anvisa": "102351153",
    "laboratorio_fabricante": "57507378000365 - EMS S/A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 241,
    "nome_produto": "SULONIL",
    "principio_ativo": "nimesulida",
    "classe_terapeutica": "ANTINFLAMATORIOS",
    "numero_registro_anvisa": "107140180",
    "laboratorio_fabricante": "61068755000708 - SANVAL COMERCIO E INDUSTRIA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 245,
    "nome_produto": "AZELAN",
    "principio_ativo": "ácido azelaico",
    "classe_terapeutica": "PRODUTOS ANTI-ACNE",
    "numero_registro_anvisa": "100200075",
    "laboratorio_fabricante": "56990534000167 - UNIAO QUIMICA INTERNACIONAL LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 246,
    "nome_produto": "BAXTER GLICOSE",
    "principio_ativo": "glicose",
    "classe_terapeutica": "REPOSICAO HIDROELETROLITICA E ALIMENTACAO PARENTERAL",
    "numero_registro_anvisa": "106830070",
    "laboratorio_fabricante": "49351786000261 - BAXTER HOSPITALAR LTDA",
    "categoria_regulatoria": "Específico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 247,
    "nome_produto": "BECANTEX + ASSOCIAÇÕES",
    "principio_ativo": "becantex",
    "classe_terapeutica": "ANTITUSSIGENOS-ASSOCIACOES MEDICAMENTOSAS",
    "numero_registro_anvisa": "100020026",
    "laboratorio_fabricante": "29322013000169 - LABORATORIO SEDABEL LTDA",
    "categoria_regulatoria": "Novo",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 248,
    "nome_produto": "CAPTOPRIL",
    "principio_ativo": "captopril",
    "classe_terapeutica": "ANTI-HIPERTENSIVOS SIMPLES",
    "numero_registro_anvisa": "105830827",
    "laboratorio_fabricante": "45992062000165 - GERMED FARMACEUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 249,
    "nome_produto": "CARBAMAZEPINA",
    "principio_ativo": "carbamazepina",
    "classe_terapeutica": "ANTICONVULSIVANTES",
    "numero_registro_anvisa": "107140252",
    "laboratorio_fabricante": "61068755000708 - SANVAL COMERCIO E INDUSTRIA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 250,
    "nome_produto": "CARISOPRODOL + DICLOFENACO SÓDICO + PARACETAMOL + CAFEÍNA",
    "principio_ativo": "carisoprodol, diclofenaco sódico, paracetamol, cafeína",
    "classe_terapeutica": "ANTINFLAMATORIOS",
    "numero_registro_anvisa": "155840483",
    "laboratorio_fabricante": "05161069000110 - BRAINFARMA INDÚSTRIA QUÍMICA E FARMACÊUTICA S.A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 251,
    "nome_produto": "CARVEDILOL",
    "principio_ativo": "carvedilol",
    "classe_terapeutica": "ANTI-HIPERTENSIVOS",
    "numero_registro_anvisa": "113001086",
    "laboratorio_fabricante": "02685377000157 - SANOFI-AVENTIS FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 252,
    "nome_produto": "CEPRONID",
    "principio_ativo": "cetoprofeno",
    "classe_terapeutica": "ANTINFLAMATORIOS",
    "numero_registro_anvisa": "103920122",
    "laboratorio_fabricante": "30222814000131 - VITAMEDIC INDUSTRIA FARMACEUTICA LTDA",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 256,
    "nome_produto": "CLORIDRATO DE SERTRALINA",
    "principio_ativo": "cloridrato de sertralina",
    "classe_terapeutica": "ANTIDEPRESSIVOS",
    "numero_registro_anvisa": "100681125",
    "laboratorio_fabricante": "56994502000130 - NOVARTIS BIOCIENCIAS S.A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 257,
    "nome_produto": "CORISTINA VITAMINA C",
    "principio_ativo": "ácido ascórbico",
    "classe_terapeutica": "VITAMINAS E SUPLEMENTOS MINERAIS",
    "numero_registro_anvisa": "100930247",
    "laboratorio_fabricante": "33060740000172 - MANTECORP INDÚSTRIA QUÍMICA E FARMACÊUTICA S.A.",
    "categoria_regulatoria": "Específico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 258,
    "nome_produto": "CRISAPINA",
    "principio_ativo": "olanzapina",
    "classe_terapeutica": "ANTIPSICOTICOS",
    "numero_registro_anvisa": "102980390",
    "laboratorio_fabricante": "44734671000151 - CRISTÁLIA PRODUTOS QUÍMICOS FARMACÊUTICOS LTDA.",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 259,
    "nome_produto": "DESITIN",
    "principio_ativo": "acetato de vitamina a, ácido bórico, óxido de zinco",
    "classe_terapeutica": "EMOLIENTES E PROTETORES DA PELE E MUCOSAS",
    "numero_registro_anvisa": "102350286",
    "laboratorio_fabricante": "57507378000365 - EMS S/A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 261,
    "nome_produto": "GUACOFLUS",
    "principio_ativo": "mikania glomerata spreng.",
    "classe_terapeutica": "EXPECTORANTES",
    "numero_registro_anvisa": "152750003",
    "laboratorio_fabricante": "04246660000108 - TAUENS FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Fitoterápico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 262,
    "nome_produto": "IMMUCYST",
    "principio_ativo": "bcg em suspensão",
    "classe_terapeutica": "IMUNOESTIMULANTES",
    "numero_registro_anvisa": "113001073",
    "laboratorio_fabricante": "02685377000157 - SANOFI-AVENTIS FARMACÊUTICA LTDA",
    "categoria_regulatoria": "Biológico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 264,
    "nome_produto": "LONIPRIL",
    "principio_ativo": "lisinopril",
    "classe_terapeutica": "ANTI-HIPERTENSIVOS SIMPLES",
    "numero_registro_anvisa": "154230029",
    "laboratorio_fabricante": "03485572000104 - GEOLAB INDÚSTRIA FARMACÊUTICA S/A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 265,
    "nome_produto": "LONIPRIL",
    "principio_ativo": "lisinopril",
    "classe_terapeutica": "ANTI-HIPERTENSIVOS SIMPLES",
    "numero_registro_anvisa": "154230029",
    "laboratorio_fabricante": "03485572000104 - GEOLAB INDÚSTRIA FARMACÊUTICA S/A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 266,
    "nome_produto": "LORAZEFAST",
    "principio_ativo": "lorazepam",
    "classe_terapeutica": "ANSIOLITICOS SIMPLES",
    "numero_registro_anvisa": "135690603",
    "laboratorio_fabricante": "00923140000131 - EMS SIGMA PHARMA LTDA",
    "categoria_regulatoria": "Medicamento",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 268,
    "nome_produto": "MENOPAX",
    "principio_ativo": "ciclofenila",
    "classe_terapeutica": "Farmacoterápico",
    "numero_registro_anvisa": "105730037",
    "laboratorio_fabricante": "60659463002992 - ACHÉ LABORATÓRIOS FARMACÊUTICOS S.A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 270,
    "nome_produto": "OLMESARTANA MEDOXOMILA+HIDROCLOROTIAZIDA",
    "principio_ativo": "olmesartana medoxomila, hidroclorotiazida",
    "classe_terapeutica": "ANTI-HIPERTENSIVOS-ASSOCIACOES MEDICAMENTOSAS",
    "numero_registro_anvisa": "126750387",
    "laboratorio_fabricante": "72593791000111 - NOVA QUIMICA FARMACÊUTICA S/A",
    "categoria_regulatoria": "Genérico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 271,
    "nome_produto": "PONSDRIL",
    "principio_ativo": "ácido mefenâmico",
    "classe_terapeutica": "ANTINFLAMATORIOS ANTIREUMATICOS",
    "numero_registro_anvisa": "102350803",
    "laboratorio_fabricante": "57507378000365 - EMS S/A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 272,
    "nome_produto": "PROZAC",
    "principio_ativo": "cloridrato de fluoxetina",
    "classe_terapeutica": "ANTIDEPRESSIVOS",
    "numero_registro_anvisa": "112600007",
    "laboratorio_fabricante": "43940618000144 - ELI LILLY DO BRASIL LTDA",
    "categoria_regulatoria": "Novo",
    "situacao_registro": "Inativo"
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
    "id_anvisa": 274,
    "nome_produto": "SALIX ALBA ORIENT",
    "principio_ativo": "salix alba l.",
    "classe_terapeutica": "Farmacoterápico",
    "numero_registro_anvisa": "123970016",
    "laboratorio_fabricante": "73657876000189 - ORIENT MIX FITOTERÁPICOS DO BRASIL LTDA.",
    "categoria_regulatoria": "Fitoterápico",
    "situacao_registro": "Inativo"
  },
  {
    "id_anvisa": 275,
    "nome_produto": "SILGLÓS",
    "principio_ativo": "sulfadiazina de prata",
    "classe_terapeutica": "ANTINFECCIOSOS TOPICOS",
    "numero_registro_anvisa": "104971202",
    "laboratorio_fabricante": "60665981000118 - UNIÃO QUÍMICA FARMACÊUTICA NACIONAL S/A",
    "categoria_regulatoria": "Similar",
    "situacao_registro": "Inativo"
  }
];
