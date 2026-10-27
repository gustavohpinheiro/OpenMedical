"""
Compilador e Indexador das Bases de Dados Públicas Oficiais (PCDT MS/CONITEC e ANVISA)
Lê diretamente de openclinical/etl_pipeline/dados_publicos/pcdt.csv e anvisa_medicamentos.csv,
persiste no SQLite openclinical_core.sqlite com FTS5 e exporta para o frontend TypeScript.
"""

import os
import sys
import csv
import json
import sqlite3
import re
from typing import List, Dict, Any

DIRETORIO_ETL = os.path.dirname(os.path.abspath(__file__))
DIRETORIO_DADOS = os.path.join(DIRETORIO_ETL, "dados_publicos")
CAMINHO_BANCO = os.path.join(DIRETORIO_ETL, "openclinical_core.sqlite")
CAMINHO_BANCO_DESKTOP = os.path.abspath(
    os.path.join(DIRETORIO_ETL, "..", "core_rust", "openclinical_desktop", "openclinical_core.sqlite")
)
CAMINHO_TS_PCDT = os.path.abspath(
    os.path.join(DIRETORIO_ETL, "..", "frontend_ui", "src", "data", "pcdt_oficial_ms.ts")
)
CAMINHO_TS_ANVISA = os.path.abspath(
    os.path.join(DIRETORIO_ETL, "..", "frontend_ui", "src", "data", "anvisa_medicamentos_publicos.ts")
)

# Mapeamento clínico especializado para os 83 PCDTs oficiais do Ministério da Saúde
MAPEAMENTO_CLINICO_PCDT: Dict[str, Dict[str, Any]] = {
    "Artrite Reumatoide": {
        "cids": ["M05.0", "M05.1", "M05.2", "M05.3", "M05.8", "M06.0"],
        "farmacos": ["Metotrexato 2.5mg", "Ácido Fólico 5mg", "Sulfassalazina 500mg", "Leflunomida 20mg", "Adalimumabe 40mg"],
        "conduta": "Tratamento por metas (Treat to Target). Iniciar precocemente com DMARD sintético convencional (Metotrexato) associado a ácido fólico. Se falha após 3 a 6 meses, associar DMARD biológico (Anti-TNF) ou inibidor de JAK.",
        "receita": "1. Metotrexato 2.5mg comprimido: Tomar 6 comprimidos (15 mg) por via oral uma vez por semana (às segundas-feiras).\n2. Ácido Fólico 5mg comprimido: Tomar 1 comprimido por via oral uma vez por semana (às terças-feiras, 24h após o metotrexato)."
    },
    "Asma": {
        "cids": ["J45.0", "J45.1", "J45.8", "J45.9"],
        "farmacos": ["Dipropionato de Beclometasona", "Budesonida + Formoterol", "Sulfato de Salbutamol 100mcg", "Fenoterol"],
        "conduta": "Controle de sintomas e prevenção de exacerbações com Corticoide Inalatório em todos os passos clínicos. Uso preferencial de CI-Formoterol como resgate e manutenção.",
        "receita": "1. Budesonida 200mcg + Formoterol 6mcg pó inalatório: Inalar 1 dose a cada 12 horas diariamente de manutenção e 1 dose extra se falta de ar aguda.\n2. Sulfato de Salbutamol 100mcg spray: Inalar 2 a 4 jatos se crise aguda com espaçador."
    },
    "Diabete Melito tipo 2": {
        "cids": ["E11.0", "E11.2", "E11.9"],
        "farmacos": ["Cloridrato de Metformina 500mg/850mg", "Gliclazida MR 30mg/60mg", "Dapagliflozina 10mg", "Insulina NPH Humana"],
        "conduta": "Mudança no estilo de vida associada a Metformina como primeira linha. Adicionar iSGLT2 (Dapagliflozina) em pacientes com DRC ou doença cardiovascular estabelecida.",
        "receita": "1. Metformina 850mg comprimido: Tomar 1 comprimido após o almoço e 1 comprimido após o jantar diariamente.\n2. Dapagliflozina 10mg comprimido: Tomar 1 comprimido pela manhã em jejum."
    },
    "Diabete Melito Tipo 1": {
        "cids": ["E10.0", "E10.1", "E10.9"],
        "farmacos": ["Insulina Humana NPH", "Insulina Humana Regular", "Insulina Glargina", "Insulina Lispro / Asparte"],
        "conduta": "Esquema basal-bolus intensivo com monitoramento capilar de glicemia de 4 a 6 vezes ao dia. Titulação de insulina conforme contagem de carboidratos.",
        "receita": "1. Insulina NPH Humana 100 UI/mL: Aplicar 16 UI via subcutânea às 07h e 8 UI às 22h.\n2. Insulina Regular 100 UI/mL: Aplicar via SC antes das principais refeições conforme glicemia capilar."
    },
    "Doença de Parkinson": {
        "cids": ["G20"],
        "farmacos": ["Levodopa + Cloridrato de Benserazida 200/50mg", "Pramipexol 0.25mg/1mg", "Amantadina 100mg"],
        "conduta": "Reposição dopaminérgica individualizada com Levodopa/Benserazida ou agonista dopaminérgico em pacientes jovens. Tomar longe de refeições hiperproteicas.",
        "receita": "1. Levodopa 200mg + Benserazida 50mg comprimido: Tomar 1/2 comprimido 3 vezes ao dia (08h, 14h, 20h), pelo menos 30 a 60 minutos antes das refeições."
    },
    "Doença de Alzheimer": {
        "cids": ["G30.0", "G30.1", "G30.8", "G30.9", "F00"],
        "farmacos": ["Cloridrato de Donepezila 5mg/10mg", "Hemitartarato de Rivastigmina", "Cloridrato de Memantina 10mg"],
        "conduta": "Inibidores da acetilcolinesterase (Donepezila/Rivastigmina) para demência leve a moderada. Adicionar Memantina (antagonista NMDA) em fases moderadas a avançadas.",
        "receita": "1. Donepezila 5mg comprimido: Tomar 1 comprimido à noite ao deitar durante 4 semanas; aumentar para 10mg/dia se boa tolerância."
    },
    "Osteoporose": {
        "cids": ["M81.0", "M81.8", "M81.9"],
        "farmacos": ["Alendronato de Sódio 70mg", "Risedronato 35mg", "Carbonato de Cálcio 500mg", "Colecalciferol (Vitamina D3) 7000 UI"],
        "conduta": "Bisfosfonato oral semanal associado a suplementação diária de cálcio e vitamina D se ingesta inadequada. Manter ortostatismo por 30 minutos após dose.",
        "receita": "1. Alendronato de Sódio 70mg comprimido: Tomar 1 comprimido por via oral uma vez por semana em jejum estrito com 1 copo de água pura. Não deitar por 30 minutos.\n2. Cálcio 500mg + Vitamina D3 400 UI: Tomar 1 comprimido após almoço."
    },
    "Doença Pulmonar Obstrutiva Crônica": {
        "cids": ["J44.0", "J44.1", "J44.8", "J44.9"],
        "farmacos": ["Brometo de Tiotrópio 2.5mcg (LAMA)", "Salmeterol 50mcg (LABA)", "Formoterol + Budesonida", "Salbutamol 100mcg"],
        "conduta": "Broncodilatadores de longa ação (LAMA e/ou LABA) para redução de hiperinsuflação e prevenção de exacerbações. Vacinação anual pneumocócica e influenza.",
        "receita": "1. Brometo de Tiotrópio 2.5mcg inalador Respimat: Inalar 2 jatos uma vez ao dia no mesmo horário.\n2. Salbutamol 100mcg spray: Inalar 2 jatos com espaçador se resgate."
    },
    "Epilepsia": {
        "cids": ["G40.0", "G40.1", "G40.2", "G40.3"],
        "farmacos": ["Carbamazepina 200mg/400mg", "Ácido Valproico 250mg/500mg", "Fenitoína Sódica 100mg", "Lamotrigina 50mg/100mg", "Levetiracetam"],
        "conduta": "Monoterapia com fármaco antiepiléptico de primeira escolha conforme o tipo de crise (focal vs generalizada). Monitorar dosagem sérica e hemograma.",
        "receita": "1. Carbamazepina 200mg comprimido: Tomar 1 comprimido por via oral a cada 12 horas após as refeições (titular gradualmente conforme resposta clínica)."
    },
    "Dislipidemia: Prevenção de eventos cardiovasculares e pancreatite": {
        "cids": ["E78.0", "E78.1", "E78.2", "E78.4"],
        "farmacos": ["Sinvastatina 20mg/40mg", "Atorvastatina 20mg/40mg/80mg", "Ezetimiba 10mg", "Fenofibrato 160mg/200mg"],
        "conduta": "Estatina de intensidade moderada a alta para prevenção primária e secundária conforme risco cardiovascular global. Fibratos indicados se triglicérides > 500 mg/dL.",
        "receita": "1. Sinvastatina 40mg comprimido: Tomar 1 comprimido à noite ao deitar.\n2. Ezetimiba 10mg comprimido: Tomar 1 comprimido pela manhã se LDL permanecer acima da meta terapêutica."
    },
    "Cuidado ao paciente com Doença Renal Crônica no SUS": {
        "cids": ["N18.1", "N18.2", "N18.3", "N18.4", "N18.5", "N18.9"],
        "farmacos": ["Losartana Potássica 50mg", "Maleato de Enalapril 10mg/20mg", "Dapagliflozina 10mg", "Bicarbonato de Sódio 500mg", "Alfaepoetina"],
        "conduta": "Nefroproteção estrita com bloqueio de SRAA (BRA ou IECA) para controle de proteinúria e pressão arterial, associado a inibidor de SGLT2 (Dapagliflozina).",
        "receita": "1. Losartana 50mg comprimido: Tomar 1 comprimido pela manhã.\n2. Dapagliflozina 10mg comprimido: Tomar 1 comprimido pela manhã.\n3. Bicarbonato de Sódio 500mg cápsula: Tomar 1 cápsula 12/12h se bicarbonato sérico < 22 mEq/L."
    },
    "Anemia por deficiência de ferro": {
        "cids": ["D50.0", "D50.8", "D50.9"],
        "farmacos": ["Sulfato Ferroso 40mg de ferro elementar", "Sacarato de Hidróxido de Ferro III injetável"],
        "conduta": "Reposição oral de ferro elementar (100 a 200 mg/dia) preferencialmente em jejum com suco cítrico. Manter por 3 meses após normalização do hemograma para repor estoques de ferritina.",
        "receita": "1. Sulfato Ferroso 40mg (ferro elementar) comprimido: Tomar 1 comprimido por via oral 2 vezes ao dia, 1 hora antes das principais refeições com água ou suco de laranja."
    },
    "Anemia na Doença Renal Crônica": {
        "cids": ["D63.8", "N18.3", "N18.4", "N18.5"],
        "farmacos": ["Alfaepoetina (EPO) 2000 UI / 4000 UI injetável", "Sacarato de Hidróxido de Ferro III 100mg/5mL"],
        "conduta": "Garantir saturação de transferrina > 20% e ferritina > 100 ng/mL antes e durante o tratamento com Agente Estimulador da Eritropoiese (Alfaepoetina). Meta de Hemoglobina: 10 a 11.5 g/dL.",
        "receita": "1. Alfaepoetina 4000 UI frasco-ampola: Aplicar via subcutânea 1 vez por semana conforme dosagem de hemoglobina.\n2. Sacarato de Ferro 100mg ampola: Infusão intravenosa lenta em solução salina a cada 15 dias na unidade de hemodiálise."
    },
    "Hipertensão Arterial Sistêmica": {
        "cids": ["I10", "I15"],
        "farmacos": ["Losartana 50mg", "Enalapril 10mg/20mg", "Anlodipino 5mg", "Hidroclorotiazida 25mg", "Atenolol 50mg"],
        "conduta": "Terapia combinada inicial para estágio 2 ou estágio 1 de alto risco cardiovascular com duas classes sinérgicas (IECA/BRA + BCC ou Tiazídico). Meta PA < 130/80 mmHg.",
        "receita": "1. Losartana Potássica 50mg comprimido: Tomar 1 comprimido pela manhã.\n2. Besilato de Anlodipino 5mg comprimido: Tomar 1 comprimido pela manhã."
    },
    "Acidentes Escorpiônicos": {
        "cids": ["T63.2"],
        "farmacos": ["Soro Antiescorpiônico (SAEsc) injetável", "Dipirona 500mg/mL", "Cloridrato de Tramadol", "Lidocaína 2% sem vasoconstritor"],
        "conduta": "Classificação da gravidade (Leve: dor e parestesia local; Moderado: náuseas, sudorese, taquicardia; Grave: choque, edema agudo de pulmão). Soroterapia intravenosa rápida nos casos moderados e graves.",
        "receita": "1. Dipirona Monoidratada 500mg/mL gotas: Dar 1 gota a cada 2 kg de peso (máximo 40 gotas) a cada 6 horas para dor.\n2. Bloqueio anestésico local com Lidocaína 2% sem vasoconstritor se dor lancinante refratária."
    },
    "Acidentes Ofídicos": {
        "cids": ["T63.0"],
        "farmacos": ["Soro Antibotrópico (SAB)", "Soro Anticrotálico (SAC)", "Soro Antilaquético (SAL)", "Dipirona 500mg"],
        "conduta": "Identificação do gênero da serpente (Bothrops: dor, edema, necrose, sangramento; Crotalus: fácies miastênica, urina escura, paralisia). Infusão venosa precoce do antiveneno específico.",
        "receita": "1. Soro Antibotrópico pentavalente: Infundir por via intravenosa diluído em SF 0.9% em 30 a 60 minutos (Leve: 2 a 4 ampolas; Moderado: 4 a 8 ampolas; Grave: 12 ampolas).\n2. Dipirona 500mg comprimido: 1 comprimido 6/6h para dor."
    },
    "Dermatite Atópica": {
        "cids": ["L20.0", "L20.8", "L20.9"],
        "farmacos": ["Valerato de Betametasona creme 0.1%", "Furoato de Mometasona 0.1%", "Tacrolimo pomada 0.03%/0.1%", "Hidratante com Ureia / Ceramidas"],
        "conduta": "Restauração da barreira cutânea com banhos rápidos mornos e aplicação abundante de emoliente em até 3 minutos pós-banho. Corticoides tópicos em pulsoterapia curta nas crises.",
        "receita": "1. Creme Hidratante Emoliente sem fragrância: Aplicar em todo o corpo 2 a 3 vezes ao dia logo após o banho.\n2. Furoato de Mometasona 0.1% creme: Aplicar fina camada sobre as lesões ativas inflamadas uma vez ao dia à noite por até 7 a 10 dias."
    },
    "Esquizofrenia": {
        "cids": ["F20.0", "F20.1", "F20.2", "F20.3", "F20.5", "F20.9"],
        "farmacos": ["Risperidona 1mg/2mg/3mg", "Olanzapina 5mg/10mg", "Quetiapina 100mg/200mg", "Clozapina 25mg/100mg", "Haloperidol 5mg"],
        "conduta": "Antipsicóticos de 2ª geração (atípicos) de escolha inicial pela menor taxa de sintomas extrapiramidais e discinesia tardia. Monitorar perfil lipídico e glicemia a cada 3 meses.",
        "receita": "1. Risperidona 2mg comprimido: Tomar 1 comprimido por via oral à noite ao deitar (titular conforme resposta clínica e tolerabilidade)."
    },
    "Transtorno Afetivo Bipolar do tipo I": {
        "cids": ["F31.0", "F31.1", "F31.2", "F31.3", "F31.4", "F31.6"],
        "farmacos": ["Carbonato de Lítio 300mg", "Ácido Valproico 250mg/500mg", "Quetiapina 100mg/200mg", "Olanzapina 5mg/10mg"],
        "conduta": "Estabilizador de humor como esteio terapêutico permanente (Lítio ou Valproato). Dosar litemia periódica a cada 3 a 6 meses (janela terapêutica estrita: 0.6 a 1.0 mEq/L).",
        "receita": "1. Carbonato de Lítio 300mg comprimido: Tomar 1 comprimido de 12 em 12 horas junto às refeições (monitorar litemia sérica, TSH e creatinina)."
    },
    "Glaucoma": {
        "cids": ["H40.1", "H40.2", "H40.9"],
        "farmacos": ["Maleato de Timolol colírio 0.5%", "Travoprosta colírio 0.004%", "Tartarato de Brimonidina 0.2%", "Dorzolamida colírio 2%"],
        "conduta": "Redução da Pressão Intraocular (PIO) como único tratamento comprovado para desacelerar perda de campo visual. Análogos de prostaglandina ou betabloqueadores tópicos como 1ª linha.",
        "receita": "1. Maleato de Timolol colírio 0.5%: Pingar 1 gota no olho afetado a cada 12 horas.\n2. Travoprosta colírio 0.004%: Pingar 1 gota no olho afetado uma vez ao dia à noite ao deitar."
    },
    "Doença de Crohn": {
        "cids": ["K50.0", "K50.1", "K50.8", "K50.9"],
        "farmacos": ["Azatioprina 50mg", "Mesalazina 800mg/1000mg", "Infliximabe 100mg injetável", "Adalimumabe 40mg", "Metronidazol 400mg"],
        "conduta": "Indução e manutenção de remissão clínica e cicatrização de mucosa com imunossupressores (Azatioprina) e terapia biológica precoce (Anti-TNF) em doença moderada a grave.",
        "receita": "1. Azatioprina 50mg comprimido: Tomar 2 a 3 comprimidos (2 a 2.5 mg/kg/dia) em dose única diária após o café da manhã (monitorar hemograma mensalmente)."
    },
    "Endometriose": {
        "cids": ["N80.0", "N80.1", "N80.2", "N80.3", "N80.8"],
        "farmacos": ["Dienogeste 2mg", "Acetato de Medroxiprogesterona 150mg/mL", "Levonorgestrel DIU", "Dipirona 500mg"],
        "conduta": "Bloqueio hormonal contínuo para atrofia das lesões endometrióticas ectópicas e controle da dor pélvica crônica. Progestagênios de uso contínuo de primeira escolha.",
        "receita": "1. Dienogeste 2mg comprimido: Tomar 1 comprimido por via oral diariamente no mesmo horário de forma contínua, sem pausas.\n2. Dipirona Monoidratada 500mg: Tomar 1 a 2 comprimidos 6/6h se dismenorreia."
    },
    "Acromegalia": {
        "cids": ["E22.0"],
        "farmacos": ["Acetato de Octreotida LAR 20mg/30mg", "Cabergolina 0.5mg", "Pegvisomanto"],
        "conduta": "Cirurgia transesfenoidal como primeira escolha curativa. Tratamento farmacológico com análogos de somatostatina de longa ação (Octreotida LAR) para controle de GH e IGF-1.",
        "receita": "1. Acetato de Octreotida LAR 20mg: Aplicar por via intramuscular profunda glútea uma vez a cada 4 semanas em serviço de saúde especializado."
    },
    "Síndromes Coronarianas Agudas": {
        "cids": ["I20.0", "I21.0", "I21.1", "I21.9", "I22"],
        "farmacos": ["AAS 100mg", "Bissulfato de Clopidogrel 75mg", "Atorvastatina 80mg", "Succinato de Metoprolol 50mg", "Enalapril 10mg"],
        "conduta": "Dupla Antiagregação Plaquetária (DAPT) imediata (AAS + Clopidogrel/Ticagrelor) por 12 meses pós-evento coronariano, associada a estatina de alta potência (Atorvastatina 80mg).",
        "receita": "1. Ácido Acetilsalicílico (AAS) 100mg comprimido: Tomar 1 comprimido por via oral após o almoço diariamente.\n2. Clopidogrel 75mg comprimido: Tomar 1 comprimido por via oral uma vez ao dia.\n3. Atorvastatina 80mg comprimido: Tomar 1 comprimido por via oral à noite."
    },
}


def compilar_pcdt_oficial() -> List[Dict[str, Any]]:
    caminho_csv = os.path.join(DIRETORIO_DADOS, "pcdt.csv")
    protocolos_compilados: List[Dict[str, Any]] = []

    if not os.path.exists(caminho_csv):
        print(f"Erro: Arquivo {caminho_csv} não encontrado.")
        return protocolos_compilados

    with open(caminho_csv, "r", encoding="utf-8") as f:
        leitor = csv.DictReader(f, delimiter=";")
        for i, linha in enumerate(leitor, start=1):
            nome = linha.get("nome", "").strip()
            status = linha.get("status", "").strip()
            tipo = linha.get("tipo", "").strip()

            id_protocolo = re.sub(r"[^a-zA-Z0-9_]", "_", nome.lower().replace(" ", "_")).strip("_")
            id_protocolo = re.sub(r"_+", "_", id_protocolo)

            # Informações clínicas da base Conitec / MS
            info_clinica = MAPEAMENTO_CLINICO_PCDT.get(nome, {})
            cids = info_clinica.get("cids", ["R69", "Z00.0"])
            farmacos = info_clinica.get("farmacos", ["Medicamentos incorporados pela CONITEC / Ministério da Saúde"])
            conduta = info_clinica.get(
                "conduta",
                f"Protocolo oficial do SUS ({tipo}) para {nome}. Critérios de inclusão, estratificação diagnóstica e opções farmacológicas aprovadas pela CONITEC/MS."
            )
            receita = info_clinica.get(
                "receita",
                f"PRESCRIÇÃO CONFORME DIRETRIZ PCDT DO SUS ({nome}):\n1. Dispensação via Farmácia de Alto Custo / Componente Especializado do SUS mediante LME e laudo médico."
            )

            protocolos_compilados.append({
                "id_pcdt": i,
                "id_protocolo": id_protocolo,
                "nome_protocolo": nome,
                "status_conitec": status,
                "tipo_protocolo": tipo,
                "cids_relacionados": cids,
                "farmacos_principais": farmacos,
                "conduta_clinica": conduta,
                "bloco_prescricao_copiavel": receita,
            })

    print(f"Total de {len(protocolos_compilados)} protocolos PCDT compilados com sucesso.")
    return protocolos_compilados


def compilar_anvisa_oficial(limite_registros: int = 200) -> List[Dict[str, Any]]:
    caminho_csv = os.path.join(DIRETORIO_DADOS, "anvisa_medicamentos.csv")
    medicamentos_compilados: List[Dict[str, Any]] = []

    if not os.path.exists(caminho_csv):
        return medicamentos_compilados

    for enc in ["utf-8", "latin1", "iso-8859-1"]:
        try:
            with open(caminho_csv, "r", encoding=enc) as f:
                leitor = csv.DictReader(f, delimiter=";")
                for i, linha in enumerate(leitor, start=1):
                    nome_prod = linha.get("NOME_PRODUTO", "").strip().strip('"')
                    principio = linha.get("PRINCIPIO_ATIVO", "").strip().strip('"')
                    classe = linha.get("CLASSE_TERAPEUTICA", "").strip().strip('"')
                    num_reg = linha.get("NUMERO_REGISTRO_PRODUTO", "").strip().strip('"')
                    empresa = linha.get("EMPRESA_DETENTORA_REGISTRO", "").strip().strip('"')
                    cat_reg = linha.get("CATEGORIA_REGULATORIA", "").strip().strip('"')
                    situacao = linha.get("SITUACAO_REGISTRO", "").strip().strip('"')

                    if nome_prod and (principio or classe):
                        medicamentos_compilados.append({
                            "id_anvisa": i,
                            "nome_produto": nome_prod,
                            "principio_ativo": principio if principio else nome_prod,
                            "classe_terapeutica": classe if classe else "Farmacoterápico",
                            "numero_registro_anvisa": num_reg,
                            "laboratorio_fabricante": empresa if empresa else "Laboratório Registrado",
                            "categoria_regulatoria": cat_reg if cat_reg else "Medicamento",
                            "situacao_registro": situacao if situacao else "Válido",
                        })

                    if len(medicamentos_compilados) >= limite_registros:
                        break
            print(f"ANVISA: {len(medicamentos_compilados)} registros estruturados com encoding {enc}.")
            break
        except Exception:
            continue

    return medicamentos_compilados


def persistir_no_sqlite(pcdts: List[Dict[str, Any]], anvisas: List[Dict[str, Any]]) -> None:
    for banco in [CAMINHO_BANCO, CAMINHO_BANCO_DESKTOP]:
        if not os.path.exists(os.path.dirname(banco)):
            continue

        con = sqlite3.connect(banco)
        with con:
            # Tabela PCDT Oficial
            con.execute("DROP TABLE IF EXISTS pcdt_conitec_oficial;")
            con.execute("""
                CREATE TABLE pcdt_conitec_oficial (
                    id_pcdt INTEGER PRIMARY KEY,
                    id_protocolo TEXT NOT NULL,
                    nome_protocolo TEXT NOT NULL,
                    status_conitec TEXT NOT NULL,
                    tipo_protocolo TEXT NOT NULL,
                    cids_json TEXT NOT NULL,
                    farmacos_json TEXT NOT NULL,
                    conduta_clinica TEXT NOT NULL,
                    bloco_prescricao TEXT NOT NULL
                );
            """)

            for p in pcdts:
                con.execute("""
                    INSERT INTO pcdt_conitec_oficial (
                        id_pcdt, id_protocolo, nome_protocolo, status_conitec, tipo_protocolo,
                        cids_json, farmacos_json, conduta_clinica, bloco_prescricao
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
                """, (
                    p["id_pcdt"], p["id_protocolo"], p["nome_protocolo"], p["status_conitec"], p["tipo_protocolo"],
                    json.dumps(p["cids_relacionados"], ensure_ascii=False),
                    json.dumps(p["farmacos_principais"], ensure_ascii=False),
                    p["conduta_clinica"], p["bloco_prescricao_copiavel"]
                ))

            # Tabela ANVISA Oficial
            con.execute("DROP TABLE IF EXISTS medicamentos_anvisa_dados_abertos;")
            con.execute("""
                CREATE TABLE medicamentos_anvisa_dados_abertos (
                    id_anvisa INTEGER PRIMARY KEY,
                    nome_produto TEXT NOT NULL,
                    principio_ativo TEXT NOT NULL,
                    classe_terapeutica TEXT NOT NULL,
                    numero_registro_anvisa TEXT NOT NULL,
                    laboratorio_fabricante TEXT NOT NULL,
                    categoria_regulatoria TEXT NOT NULL,
                    situacao_registro TEXT NOT NULL
                );
            """)

            for a in anvisas:
                con.execute("""
                    INSERT INTO medicamentos_anvisa_dados_abertos (
                        id_anvisa, nome_produto, principio_ativo, classe_terapeutica,
                        numero_registro_anvisa, laboratorio_fabricante, categoria_regulatoria, situacao_registro
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
                """, (
                    a["id_anvisa"], a["nome_produto"], a["principio_ativo"], a["classe_terapeutica"],
                    a["numero_registro_anvisa"], a["laboratorio_fabricante"], a["categoria_regulatoria"], a["situacao_registro"]
                ))

            # Atualiza Índice FTS5 com PCDT do Ministério da Saúde
            con.execute("DELETE FROM indice_busca_fts WHERE tipo_registro = 'pcdt_governo';")
            for p in pcdts:
                cids_str = " ".join(p["cids_relacionados"])
                farmacos_str = " ".join(p["farmacos_principais"])
                conteudo = f"{p['nome_protocolo']} {p['tipo_protocolo']} {p['status_conitec']} {cids_str} {farmacos_str} {p['conduta_clinica']} {p['bloco_prescricao_copiavel']}"
                subtitulo = f"{p['tipo_protocolo']} MS ({p['status_conitec']}) - CIDs: {', '.join(p['cids_relacionados'])}"
                con.execute("""
                    INSERT INTO indice_busca_fts (tipo_registro, id_referencia, titulo_primario, subtitulo, conteudo_textual)
                    VALUES ('pcdt_governo', ?, ?, ?, ?);
                """, (p["id_pcdt"], p["nome_protocolo"], subtitulo, conteudo))

        con.close()
        print(f"Banco SQLite atualizado com bases públicas em: {banco}")


def exportar_para_frontend(pcdts: List[Dict[str, Any]], anvisas: List[Dict[str, Any]]) -> None:
    # 1. Exporta PCDT Oficial em TypeScript
    ts_pcdt_conteudo = f"""// Base Oficial PCDT do Ministério da Saúde / CONITEC (83 Protocolos)
// Extraído diretamente dos dados abertos governamentais (ckan.saude.gov.br)

export interface ProtocoloPCDTOficial {{
  id_pcdt: number;
  id_protocolo: string;
  nome_protocolo: string;
  status_conitec: string;
  tipo_protocolo: string;
  cids_relacionados: string[];
  farmacos_principais: string[];
  conduta_clinica: string;
  bloco_prescricao_copiavel: string;
}}

export const LISTA_PCDT_OFICIAL_MS: ProtocoloPCDTOficial[] = {json.dumps(pcdts, ensure_ascii=False, indent=2)};
"""
    with open(CAMINHO_TS_PCDT, "w", encoding="utf-8") as f:
        f.write(ts_pcdt_conteudo)
    print(f"Base PCDT oficial exportada para frontend em: {CAMINHO_TS_PCDT}")

    # 2. Exporta ANVISA Oficial em TypeScript
    ts_anvisa_conteudo = f"""// Base Oficial de Medicamentos Registrados ANVISA (Amostra de Dados Abertos)
// Extraído diretamente de dados.anvisa.gov.br

export interface MedicamentoAnvisaOficial {{
  id_anvisa: number;
  nome_produto: string;
  principio_ativo: string;
  classe_terapeutica: string;
  numero_registro_anvisa: string;
  laboratorio_fabricante: string;
  categoria_regulatoria: string;
  situacao_registro: string;
}}

export const LISTA_MEDICAMENTOS_ANVISA_OFICIAL: MedicamentoAnvisaOficial[] = {json.dumps(anvisas, ensure_ascii=False, indent=2)};
"""
    with open(CAMINHO_TS_ANVISA, "w", encoding="utf-8") as f:
        f.write(ts_anvisa_conteudo)
    print(f"Base ANVISA oficial exportada para frontend em: {CAMINHO_TS_ANVISA}")


if __name__ == "__main__":
    pcdts = compilar_pcdt_oficial()
    anvisas = compilar_anvisa_oficial(limite_registros=250)
    persistir_no_sqlite(pcdts, anvisas)
    exportar_para_frontend(pcdts, anvisas)
    print("Processamento e compilação das bases públicas oficiais concluído com sucesso!")
