import json
import sqlite3
import os
from typing import List, Optional
from schemas_dominio import (
    PrincipioAtivoSchema,
    MedicamentoComercialSchema,
    BulaEstruturadaSchema,
    MatrizInteracaoSchema,
    CodigoDiagnosticoSchema,
    FaixaAjusteRenalSchema,
    GuiaDiluicaoSchema,
)
from compilador_banco import obter_caminho_padrao_banco, inicializar_banco_dados


def obter_lista_principios_ativos() -> List[PrincipioAtivoSchema]:
    return [
        PrincipioAtivoSchema(
            id_principio_ativo=1,
            nome_dcb="Amoxicilina",
            classe_terapeutica="Antibacteriano Betalactâmico (Penicilina de Amplo Espectro)",
            categoria_risco_gestacao="B",
            compatibilidade_aleitamento="Compatível",
            disponivel_rename_sus=1,
            componente_sus="Basico",
        ),
        PrincipioAtivoSchema(
            id_principio_ativo=2,
            nome_dcb="Dipirona Monoidratada",
            classe_terapeutica="Analgésico e Antipirético (Derivado Pirazolônico)",
            categoria_risco_gestacao="C",
            compatibilidade_aleitamento="Criterioso",
            disponivel_rename_sus=1,
            componente_sus="Basico",
        ),
        PrincipioAtivoSchema(
            id_principio_ativo=3,
            nome_dcb="Losartana Potássica",
            classe_terapeutica="Anti-hipertensivo (Antagonista do Receptor de Angiotensina II - BRA)",
            categoria_risco_gestacao="D",
            compatibilidade_aleitamento="Criterioso",
            disponivel_rename_sus=1,
            componente_sus="Basico",
        ),
        PrincipioAtivoSchema(
            id_principio_ativo=4,
            nome_dcb="Maleato de Enalapril",
            classe_terapeutica="Anti-hipertensivo e Vasodilatador (Inibidor da ECA - IECA)",
            categoria_risco_gestacao="D",
            compatibilidade_aleitamento="Compatível",
            disponivel_rename_sus=1,
            componente_sus="Basico",
        ),
        PrincipioAtivoSchema(
            id_principio_ativo=5,
            nome_dcb="Omeprazol",
            classe_terapeutica="Antiulceroso (Inibidor da Bomba de Prótons - IBP)",
            categoria_risco_gestacao="C",
            compatibilidade_aleitamento="Compatível",
            disponivel_rename_sus=1,
            componente_sus="Basico",
        ),
        PrincipioAtivoSchema(
            id_principio_ativo=6,
            nome_dcb="Azitromicina",
            classe_terapeutica="Antibacteriano (Macrolídeo Azalídeo)",
            categoria_risco_gestacao="B",
            compatibilidade_aleitamento="Compatível",
            disponivel_rename_sus=1,
            componente_sus="Basico",
        ),
        PrincipioAtivoSchema(
            id_principio_ativo=7,
            nome_dcb="Hemitartarato de Norepinefrina",
            classe_terapeutica="Vasopressor e Inotrópico (Agonista Alfa e Beta Adrenérgico)",
            categoria_risco_gestacao="C",
            compatibilidade_aleitamento="Criterioso",
            disponivel_rename_sus=1,
            componente_sus="Estrategico",
        ),
        PrincipioAtivoSchema(
            id_principio_ativo=8,
            nome_dcb="Ceftriaxona Sódica",
            classe_terapeutica="Antibacteriano Parenteral (Cefalosporina de 3ª Geração)",
            categoria_risco_gestacao="B",
            compatibilidade_aleitamento="Compatível",
            disponivel_rename_sus=1,
            componente_sus="Especializado",
        ),
        PrincipioAtivoSchema(
            id_principio_ativo=9,
            nome_dcb="Cloridrato de Metformina",
            classe_terapeutica="Antidiabético Oral (Biguanida)",
            categoria_risco_gestacao="B",
            compatibilidade_aleitamento="Compatível",
            disponivel_rename_sus=1,
            componente_sus="Basico",
        ),
        PrincipioAtivoSchema(
            id_principio_ativo=10,
            nome_dcb="Sinvastatina",
            classe_terapeutica="Hipolipemiante (Inibidor da HMG-CoA Redutase - Estatina)",
            categoria_risco_gestacao="X",
            compatibilidade_aleitamento="Contraindicado",
            disponivel_rename_sus=1,
            componente_sus="Basico",
        ),
    ]


def obter_lista_medicamentos_comerciais() -> List[MedicamentoComercialSchema]:
    return [
        # Amoxicilina
        MedicamentoComercialSchema(
            id_medicamento=1,
            id_principio_ativo=1,
            numero_registro_anvisa="1010700030665",
            nome_comercial="Amoxil 500mg",
            laboratorio_fabricante="Glaxosmithkline Brasil Ltda",
            apresentacao_comercial="Cápsula dura 500 mg - Embalagem com 21 cápsulas",
            concentracao_valor=500.0,
            concentracao_unidade="mg",
            forma_farmaceutica="capsula",
            tipo_receituario="antimicrobiano",
            preco_maximo_consumidor=130.08,
        ),
        MedicamentoComercialSchema(
            id_medicamento=2,
            id_principio_ativo=1,
            numero_registro_anvisa="1004307270023",
            nome_comercial="Amoxicilina Pó para Suspensão Oral 250mg/5mL",
            laboratorio_fabricante="Eurofarma Laboratorios S.A.",
            apresentacao_comercial="Frasco com pó para preparação de 150 mL (50 mg/mL)",
            concentracao_valor=50.0,
            concentracao_unidade="mg/mL",
            forma_farmaceutica="suspensao_oral",
            tipo_receituario="antimicrobiano",
            preco_maximo_consumidor=37.77,
        ),
        # Dipirona
        MedicamentoComercialSchema(
            id_medicamento=3,
            id_principio_ativo=2,
            numero_registro_anvisa="1862000180102",
            nome_comercial="Novalgina Gotas 500mg/mL",
            laboratorio_fabricante="Opella Healthcare Brazil Ltda",
            apresentacao_comercial="Frasco gotejador de 20 mL com 500 mg/mL",
            concentracao_valor=500.0,
            concentracao_unidade="mg/mL",
            forma_farmaceutica="solucao_oral",
            tipo_receituario="simples",
            preco_maximo_consumidor=32.44,
        ),
        MedicamentoComercialSchema(
            id_medicamento=4,
            id_principio_ativo=2,
            numero_registro_anvisa="",
            nome_comercial="Dipirona Monoidratada 500mg",
            laboratorio_fabricante="Brainfarma Indústria Química e Farmacêutica S.A.",
            apresentacao_comercial="Comprimido simples 500 mg - Blister com 10 unidades",
            concentracao_valor=500.0,
            concentracao_unidade="mg",
            forma_farmaceutica="comprimido",
            tipo_receituario="simples",
            preco_maximo_consumidor=0.00,
        ),
        # Losartana
        MedicamentoComercialSchema(
            id_medicamento=5,
            id_principio_ativo=3,
            numero_registro_anvisa="1002900070074",
            nome_comercial="Cozaar 50mg",
            laboratorio_fabricante="Organon Farmaceutica Ltda.",
            apresentacao_comercial="Comprimido revestido 50 mg - Caixa com 30 unidades",
            concentracao_valor=50.0,
            concentracao_unidade="mg",
            forma_farmaceutica="comprimido",
            tipo_receituario="simples",
            preco_maximo_consumidor=73.14,
        ),
        MedicamentoComercialSchema(
            id_medicamento=6,
            id_principio_ativo=3,
            numero_registro_anvisa="1004309110041",
            nome_comercial="Losartana Potássica 50mg Genérico",
            laboratorio_fabricante="Eurofarma Laboratorios S.A.",
            apresentacao_comercial="Comprimido revestido 50 mg - Caixa com 30 unidades",
            concentracao_valor=50.0,
            concentracao_unidade="mg",
            forma_farmaceutica="comprimido",
            tipo_receituario="simples",
            preco_maximo_consumidor=26.82,
        ),
        # Enalapril
        MedicamentoComercialSchema(
            id_medicamento=7,
            id_principio_ativo=4,
            numero_registro_anvisa="1002900310504",
            nome_comercial="Renitec 10mg",
            laboratorio_fabricante="Organon Farmaceutica Ltda.",
            apresentacao_comercial="Comprimido sulcado 10 mg - Blister com 30 unidades",
            concentracao_valor=10.0,
            concentracao_unidade="mg",
            forma_farmaceutica="comprimido",
            tipo_receituario="simples",
            preco_maximo_consumidor=28.48,
        ),
        # Omeprazol
        MedicamentoComercialSchema(
            id_medicamento=8,
            id_principio_ativo=5,
            numero_registro_anvisa="",
            nome_comercial="Losec Mups 20mg",
            laboratorio_fabricante="AstraZeneca do Brasil Ltda",
            apresentacao_comercial="Comprimido de liberação modificada 20 mg - Frasco com 28 unidades",
            concentracao_valor=20.0,
            concentracao_unidade="mg",
            forma_farmaceutica="comprimido",
            tipo_receituario="simples",
            preco_maximo_consumidor=0.00,
        ),
        # Azitromicina
        MedicamentoComercialSchema(
            id_medicamento=9,
            id_principio_ativo=6,
            numero_registro_anvisa="1211003590023",
            nome_comercial="Zitromax 500mg",
            laboratorio_fabricante="Pfizer Brasil Ltda",
            apresentacao_comercial="Comprimido revestido 500 mg - Embalagem com 3 comprimidos",
            concentracao_valor=500.0,
            concentracao_unidade="mg",
            forma_farmaceutica="comprimido",
            tipo_receituario="antimicrobiano",
            preco_maximo_consumidor=51.07,
        ),
        # Noradrenalina
        MedicamentoComercialSchema(
            id_medicamento=10,
            id_principio_ativo=7,
            numero_registro_anvisa="",
            nome_comercial="Levophed 2mg/mL",
            laboratorio_fabricante="Pfizer Brasil Ltda",
            apresentacao_comercial="Solução injetável estéril 2 mg/mL (bitartarato de norepinefrina) - Ampola 4 mL",
            concentracao_valor=2.0,
            concentracao_unidade="mg/mL",
            forma_farmaceutica="solucao_injetavel",
            tipo_receituario="simples",
            preco_maximo_consumidor=0.00,
        ),
        # Ceftriaxona
        MedicamentoComercialSchema(
            id_medicamento=11,
            id_principio_ativo=8,
            numero_registro_anvisa="1010001320461",
            nome_comercial="Rocefin 1g IV",
            laboratorio_fabricante="Produtos Roche Químicos E Farmacêuticos S.A.",
            apresentacao_comercial="Frasco-ampola com pó liofilizado de 1000 mg para infusão IV",
            concentracao_valor=1000.0,
            concentracao_unidade="mg",
            forma_farmaceutica="po_para_solucao_injetavel",
            tipo_receituario="antimicrobiano",
            preco_maximo_consumidor=0.00,
        ),
        # Metformina
        MedicamentoComercialSchema(
            id_medicamento=12,
            id_principio_ativo=9,
            numero_registro_anvisa="1008903400031",
            nome_comercial="Glifage XR 500mg",
            laboratorio_fabricante="Merck S/A",
            apresentacao_comercial="Comprimido de liberação prolongada 500 mg - Caixa com 30 unidades",
            concentracao_valor=500.0,
            concentracao_unidade="mg",
            forma_farmaceutica="comprimido",
            tipo_receituario="simples",
            preco_maximo_consumidor=12.20,
        ),
        # Sinvastatina
        MedicamentoComercialSchema(
            id_medicamento=13,
            id_principio_ativo=10,
            numero_registro_anvisa="",
            nome_comercial="Zocor 20mg",
            laboratorio_fabricante="Organon Farmacêutica Ltda",
            apresentacao_comercial="Comprimido revestido 20 mg - Caixa com 30 unidades",
            concentracao_valor=20.0,
            concentracao_unidade="mg",
            forma_farmaceutica="comprimido",
            tipo_receituario="simples",
            preco_maximo_consumidor=0.00,
        ),
    ]


def obter_lista_bulas_estruturadas() -> List[BulaEstruturadaSchema]:
    # Ajustes renais serializados em JSON
    ajuste_amoxicilina = [
        FaixaAjusteRenalSchema(tfg_min=30.0, tfg_max=150.0, posologia_recomendada="Sem necessidade de ajuste posológico.").model_dump(),
        FaixaAjusteRenalSchema(tfg_min=10.0, tfg_max=29.9, posologia_recomendada="250 a 500 mg por via oral a cada 12 horas.").model_dump(),
        FaixaAjusteRenalSchema(tfg_min=0.0, tfg_max=9.9, posologia_recomendada="250 a 500 mg por via oral a cada 24 horas. Administrar dose adicional pós-hemodiálise.").model_dump(),
    ]

    ajuste_enalapril = [
        FaixaAjusteRenalSchema(tfg_min=30.0, tfg_max=80.0, posologia_recomendada="Dose inicial de 5 mg/dia, titulada até no máximo 20 mg/dia.").model_dump(),
        FaixaAjusteRenalSchema(tfg_min=0.0, tfg_max=29.9, posologia_recomendada="Dose inicial de 2.5 mg/dia, titulada com cautela até máximo 10 mg/dia. Monitorar K+ e creatinina.").model_dump(),
    ]

    ajuste_metformina = [
        FaixaAjusteRenalSchema(tfg_min=60.0, tfg_max=150.0, posologia_recomendada="Dose padrão até 2550 mg/dia dividida em 2-3 tomadas.").model_dump(),
        FaixaAjusteRenalSchema(tfg_min=45.0, tfg_max=59.9, posologia_recomendada="Dose máxima recomendada de 1000 mg/dia. Monitorar função renal semestralmente.").model_dump(),
        FaixaAjusteRenalSchema(tfg_min=30.0, tfg_max=44.9, posologia_recomendada="Dose máxima recomendada de 500 mg/dia. Não iniciar novos tratamentos nesta faixa.").model_dump(),
        FaixaAjusteRenalSchema(tfg_min=0.0, tfg_max=29.9, posologia_recomendada="CONTRAINDICAÇÃO ABSOLUTA devido ao risco crítico de acidose láctica potencialmente fatal.").model_dump(),
    ]

    diluicao_noradrenalina = GuiaDiluicaoSchema(
        diluente_compativel="Glicose 5% (SG 5%) ou Solução Fisiológica 0.9% (SG 5% preferencial para evitar oxidação)",
        volume_recomendado_ml="4 ampolas (16 mg / 16 mL) em 234 mL de SG 5%, totalizando 250 mL (concentração 64 mcg/mL)",
        tempo_infusao="Infusão intravenosa contínua contínua em bomba infusora volumétrica dedicada em acesso venoso central",
        estabilidade_horas=24.0,
    ).model_dump()

    diluicao_ceftriaxona = GuiaDiluicaoSchema(
        diluente_compativel="Solução Fisiológica 0.9% ou Glicose 5%. NUNCA utilizar diluentes contendo cálcio (ex: Ringer Lactato)",
        volume_recomendado_ml="Reconstituir 1g com 10 mL de água para injetáveis e diluir em 100 mL de SF 0.9%",
        tempo_infusao="Infusão intravenosa por gotejamento ou bomba ao longo de 30 a 60 minutos",
        estabilidade_horas=24.0,
    ).model_dump()

    return [
        BulaEstruturadaSchema(
            id_bula=1,
            id_principio_ativo=1,
            indicacoes_clinicas="Infecções respiratórias altas e baixas (faringoamigdalite, sinusite bacteriana, PAC), otite média aguda, infecções do trato urinário não complicadas, infecções cutâneas e profilaxia de endocardite infecciosa.",
            posologia_adulto_padrao="500 mg a cada 8 horas por via oral ou 875 mg a cada 12 horas por 7 a 10 dias.",
            posologia_pediatrica_padrao="25 a 50 mg/kg/dia fracionado a cada 8 horas. Em otite média aguda por pneumococo resistente: 80 a 90 mg/kg/dia fracionado a cada 12 horas.",
            dose_pediatrica_mg_kg_dia_min=25.0,
            dose_pediatrica_mg_kg_dia_max=90.0,
            dose_maxima_diaria_mg=3000.0,
            ajuste_funcao_renal_json=json.dumps(ajuste_amoxicilina, ensure_ascii=False),
            ajuste_funcao_hepatica="Não necessita de ajuste inicial de dose; acompanhar transaminases em tratamentos prolongados.",
            contraindicacoes="Hipersensibilidade grave e anafilaxia a penicilinas e betalactâmicos. Histórico de colestase hepática associada à amoxicilina.",
            eventos_adversos_comuns="Diarreia osmótica, náuseas, vômitos, exantema morbiliforme, candidíase de mucosas.",
            guia_diluicao_injetavel_json=None,
        ),
        BulaEstruturadaSchema(
            id_bula=2,
            id_principio_ativo=2,
            indicacoes_clinicas="Dor aguda de intensidade leve a moderada, cefaleia tensional, dor pós-operatória e controle de febre refratária.",
            posologia_adulto_padrao="500 mg a 1000 mg por via oral a cada 6 horas (respeitar intervalo mínimo de 6 horas). Dose máxima de 4000 mg/dia.",
            posologia_pediatrica_padrao="10 a 15 mg/kg/dose a cada 6 ou 8 horas. Gotas (500 mg/mL): 1 gota por kg de peso por tomada (respeitando teto).",
            dose_pediatrica_mg_kg_dia_min=40.0,
            dose_pediatrica_mg_kg_dia_max=60.0,
            dose_maxima_diaria_mg=4000.0,
            ajuste_funcao_renal_json=None,
            ajuste_funcao_hepatica="Reduzir a posologia diária pela metade em pacientes com cirrose hepática descompensada.",
            contraindicacoes="Hipersensibilidade a derivados pirazolônicos, histórico de agranulocitose, porfiria hepática aguda, deficiência congênita de glicose-6-fosfato desidrogenase (G6PD), supressão de medula óssea.",
            eventos_adversos_comuns="Hipotensão arterial após administração rápida, sonolência, erupções cutâneas, agranulocitose idiopática (muito raro).",
            guia_diluicao_injetavel_json=None,
        ),
        BulaEstruturadaSchema(
            id_bula=3,
            id_principio_ativo=3,
            indicacoes_clinicas="Hipertensão arterial sistêmica primária, insuficiência cardíaca crônica com fração de ejeção reduzida, nefropatia diabética em pacientes com diabetes tipo 2 e proteinúria.",
            posologia_adulto_padrao="50 mg por via oral uma vez ao dia pela manhã, podendo ser titulada até 100 mg/dia em tomada única ou dividida em duas tomadas.",
            posologia_pediatrica_padrao=None,
            dose_pediatrica_mg_kg_dia_min=None,
            dose_pediatrica_mg_kg_dia_max=None,
            dose_maxima_diaria_mg=100.0,
            ajuste_funcao_renal_json=None,
            ajuste_funcao_hepatica="Dose inicial de 25 mg/dia recomendada para pacientes com histórico de insuficiência hepática leve a moderada.",
            contraindicacoes="Segundo e terceiro trimestres de gestação (toxicidade e morte fetal). Uso concomitante com alisquireno em diabéticos. Hipersensibilidade.",
            eventos_adversos_comuns="Tontura ortostática, fadiga, hipercalemia, congestão nasal, hipotensão.",
            guia_diluicao_injetavel_json=None,
        ),
        BulaEstruturadaSchema(
            id_bula=4,
            id_principio_ativo=4,
            indicacoes_clinicas="Hipertensão arterial sistêmica, insuficiência cardíaca congestiva sintomática e disfunção ventricular esquerda assintomática pós-IAM.",
            posologia_adulto_padrao="Dose inicial de 5 mg a 10 mg por via oral uma vez ao dia, titulada gradualmente até manutenção de 20 mg a 40 mg ao dia.",
            posologia_pediatrica_padrao=None,
            dose_pediatrica_mg_kg_dia_min=None,
            dose_pediatrica_mg_kg_dia_max=None,
            dose_maxima_diaria_mg=40.0,
            ajuste_funcao_renal_json=json.dumps(ajuste_enalapril, ensure_ascii=False),
            ajuste_funcao_hepatica="Não requer ajuste posológico específico; metabolismo depende da ativação em enalaprilato.",
            contraindicacoes="Histórico de angioedema relacionado a tratamento anterior com IECA ou angioedema hereditário/idiopático. Segundo e terceiro trimestres de gestação. Estenose bilateral de artéria renal.",
            eventos_adversos_comuns="Tosse seca persistente (mediada por bradicinina em até 15% dos casos), cefaleia, astenia, hipotensão sintomática na primeira dose, hipercalemia.",
            guia_diluicao_injetavel_json=None,
        ),
        BulaEstruturadaSchema(
            id_bula=5,
            id_principio_ativo=5,
            indicacoes_clinicas="Úlcera duodenal ativa, úlcera gástrica benigna, doença do refluxo gastroesofágico (DRGE), esofagite erosiva, síndrome de Zollinger-Ellison e profilaxia de úlcera péptica por AINEs.",
            posologia_adulto_padrao="20 mg a 40 mg por via oral uma vez ao dia em jejum pela manhã, 30 minutos antes da primeira refeição, durante 4 a 8 semanas.",
            posologia_pediatrica_padrao="0.7 a 1.4 mg/kg/dia em tomada única matinal (crianças acima de 1 ano ou peso > 10 kg).",
            dose_pediatrica_mg_kg_dia_min=0.7,
            dose_pediatrica_mg_kg_dia_max=1.4,
            dose_maxima_diaria_mg=80.0,
            ajuste_funcao_renal_json=None,
            ajuste_funcao_hepatica="Dose máxima diária de 20 mg/dia em portadores de cirrose ou disfunção hepática grave.",
            contraindicacoes="Hipersensibilidade ao omeprazol ou outros inibidores da bomba de prótons. Coadministração com rilpivirina e atazanavir.",
            eventos_adversos_comuns="Cefaleia, dor abdominal, diarreia, flatulência, náuseas, constipação, hipomagnesemia em uso contínuo crônico.",
            guia_diluicao_injetavel_json=None,
        ),
        BulaEstruturadaSchema(
            id_bula=6,
            id_principio_ativo=6,
            indicacoes_clinicas="Infecções do trato respiratório (faringite estreptocócica, exacerbação de DPOC, pneumonia adquirida na comunidade), infecções genitais não complicadas por Chlamydia trachomatis.",
            posologia_adulto_padrao="500 mg por via oral uma vez ao dia por 3 a 5 dias consecutivos (ou dose única de 1000 mg para infecções clamidianas urogenitais).",
            posologia_pediatrica_padrao="10 mg/kg/dia em tomada única diária durante 3 dias (ou 10 mg/kg no D1 seguido de 5 mg/kg/dia do D2 ao D5).",
            dose_pediatrica_mg_kg_dia_min=10.0,
            dose_pediatrica_mg_kg_dia_max=12.0,
            dose_maxima_diaria_mg=500.0,
            ajuste_funcao_renal_json=None,
            ajuste_funcao_hepatica="Utilizar com cautela em hepatopatias severas; principal via de excreção é a eliminação biliar hepática inalterada.",
            contraindicacoes="Hipersensibilidade a azitromicina, eritromicina ou a qualquer outro antibacteriano macrolídeo. Histórico prévio de icterícia colestática medicamentosa.",
            eventos_adversos_comuns="Desconforto gástrico, náuseas, cólicas abdominais, diarreia, prolongamento subclínico do intervalo QTc.",
            guia_diluicao_injetavel_json=None,
        ),
        BulaEstruturadaSchema(
            id_bula=7,
            id_principio_ativo=7,
            indicacoes_clinicas="Restauração e sustentação da pressão arterial em estados de hipotensão arterial aguda refratária e choque distributivo (especialmente choque séptico e neurogênico).",
            posologia_adulto_padrao="Infusão intravenosa contínua contínua em bomba: dose inicial de 0.05 a 0.1 mcg/kg/min, titulada a cada 2 a 5 minutos até atingir PAM alvo >= 65 mmHg (faixa clínica de 0.01 a 3.0 mcg/kg/min).",
            posologia_pediatrica_padrao="0.05 a 0.1 mcg/kg/min em infusão contínua, titulada por resposta pressórica e perfusão tecidual periférica.",
            dose_pediatrica_mg_kg_dia_min=None,
            dose_pediatrica_mg_kg_dia_max=None,
            dose_maxima_diaria_mg=None,
            ajuste_funcao_renal_json=None,
            ajuste_funcao_hepatica="Não requer ajuste posológico específico; metabolismo simpático tecidual por COMT e MAO.",
            contraindicacoes="Hipovolemia não corrigida antes da ressuscitação volêmica adequada, exceto em emergências de salvamento coronariano/cerebral. Trombose vascular periférica.",
            eventos_adversos_comuns="Arritmias cardíacas ventriculares e atriais, isquemia periférica de extremidades e órgãos esplâncnicos, bradicardia reflexa, necrose tecidual por extravasamento.",
            guia_diluicao_injetavel_json=json.dumps(diluicao_noradrenalina, ensure_ascii=False),
        ),
        BulaEstruturadaSchema(
            id_bula=8,
            id_principio_ativo=8,
            indicacoes_clinicas="Infecções bacterianas graves: sepse de foco urinário ou respiratório, meningite bacteriana, infecções intra-abdominais, pneumonia comunitária grave e gonorreia disseminada.",
            posologia_adulto_padrao="1 g a 2 g por via intravenosa ou intramuscular a cada 24 horas (em meningite: 2 g IV a cada 12 horas).",
            posologia_pediatrica_padrao="50 a 100 mg/kg/dia por via intravenosa em dose única diária (máximo 4000 mg/dia em meningite bacteriana aguda).",
            dose_pediatrica_mg_kg_dia_min=50.0,
            dose_pediatrica_mg_kg_dia_max=100.0,
            dose_maxima_diaria_mg=4000.0,
            ajuste_funcao_renal_json=None,
            ajuste_funcao_hepatica="Não requer ajuste se a função renal estiver preservada, devido à dupla via de depuração renal e biliar.",
            contraindicacoes="Prematuros e recém-nascidos a termo até 28 dias de vida com icterícia (desloca bilirrubina da albumina). Administração concomitante com soluções contendo cálcio por risco letal de precipitação microvascular.",
            eventos_adversos_comuns="Diarreia, leucopenia, trombocitose, elevação transitória de transaminases, lama biliar ecográfica reversível (pseudolitíase).",
            guia_diluicao_injetavel_json=json.dumps(diluicao_ceftriaxona, ensure_ascii=False),
        ),
        BulaEstruturadaSchema(
            id_bula=9,
            id_principio_ativo=9,
            indicacoes_clinicas="Tratamento farmacológico de primeira linha no Diabetes Mellitus Tipo 2, especialmente em indivíduos com sobrepeso/obesidade, e síndrome dos ovários policísticos.",
            posologia_adulto_padrao="Iniciar com 500 mg ou 850 mg por via oral uma vez ao dia junto à principal refeição. Titular a cada 1-2 semanas até 2000 mg a 2550 mg/dia divididos em 2 a 3 tomadas.",
            posologia_pediatrica_padrao=None,
            dose_pediatrica_mg_kg_dia_min=None,
            dose_pediatrica_mg_kg_dia_max=None,
            dose_maxima_diaria_mg=2550.0,
            ajuste_funcao_renal_json=json.dumps(ajuste_metformina, ensure_ascii=False),
            ajuste_funcao_hepatica="Evitar o uso em casos de insuficiência hepática clinicamente significativa pelo acúmulo de lactato.",
            contraindicacoes="Disfunção renal grave (TFG < 30 mL/min/1.73m2), cetoacidose diabética, acidose metabólica aguda, choque circulatório, hipóxia tecidual crônica e exames com contraste radiológico iodado.",
            eventos_adversos_comuns="Diarreia e desconforto gastrointestinal transitório (20-30%), náuseas, flatulência, gosto metálico, redução na absorção de cianocobalamina (vitamina B12).",
            guia_diluicao_injetavel_json=None,
        ),
        BulaEstruturadaSchema(
            id_bula=10,
            id_principio_ativo=10,
            indicacoes_clinicas="Hipercolesterolemia primária (familiar e não-familiar), dislipidemia mista, prevenção secundária de eventos coronarianos e cerebrovasculares ateroscleróticos maiores.",
            posologia_adulto_padrao="20 mg a 40 mg por via oral uma vez ao dia à noite (período de pico de síntese do colesterol hepático endógeno).",
            posologia_pediatrica_padrao=None,
            dose_pediatrica_mg_kg_dia_min=None,
            dose_pediatrica_mg_kg_dia_max=None,
            dose_maxima_diaria_mg=40.0,
            ajuste_funcao_renal_json=None,
            ajuste_funcao_hepatica="Contraindicada em hepatopatias ativas ou com elevações séricas inexplicadas e persistentes de transaminases superiores a 3 vezes o limite superior da normalidade.",
            contraindicacoes="Gravidez confirmada ou suspeita (Categoria X - teratogênica), lactação, hepatopatia ativa aguda, coadministração com inibidores potentes do citocromo CYP3A4.",
            eventos_adversos_comuns="Mialgia difusa sem elevação de CK, cefaleia, constipação, dor abdominal, astenia muscular, risco raro de rabdomiólise com insuficiência renal mioglobinúrica.",
            guia_diluicao_injetavel_json=None,
        ),
    ]


def obter_lista_matriz_interacoes() -> List[MatrizInteracaoSchema]:
    return [
        # 1. Losartana (3) + Enalapril (4): Duplo bloqueio SRAA
        MatrizInteracaoSchema(
            id_interacao=1,
            id_principio_ativo_a=3,
            id_principio_ativo_b=4,
            gravidade_interacao="Contraindicada",
            efeito_clinico="Duplo bloqueio simultâneo do sistema renina-angiotensina-aldosterona (SRAA). Aumento estatisticamente demonstrado de hipercalemia grave refratária, hipotensão arterial precipitante e deterioração aguda e acelerada da taxa de filtração glomerular sem benefícios cardiovasculares adicionais.",
            conduta_recomendada="Diretrizes (SBC 2020, KDIGO) recomendam não associar IECA e BRA (ONTARGET, VA NEPHRON-D). Manter apenas uma das classes e, se a meta pressórica não for atingida, associar bloqueador dos canais de cálcio (anlodipino) ou diurético tiazídico.",
        ),
        # 2. Sinvastatina (10) + Azitromicina (6): azitromicina é inibidora fraca do CYP3A4 (diferente de claritromicina/eritromicina)
        MatrizInteracaoSchema(
            id_interacao=2,
            id_principio_ativo_a=10,
            id_principio_ativo_b=6,
            gravidade_interacao="Leve",
            efeito_clinico="Azitromicina, ao contrário de claritromicina e eritromicina, é inibidora fraca do CYP3A4; há relatos isolados de miopatia/rabdomiólise com sinvastatina, sem aumento relevante e consistente dos níveis séricos.",
            conduta_recomendada="Pode-se manter a sinvastatina, orientando suspensão e procura de atendimento se houver dor ou fraqueza muscular. Se o macrolídeo for claritromicina ou eritromicina, suspender a sinvastatina durante o curso.",
        ),
        # 3. Enalapril (4) + Dipirona (2): Inibição de prostaglandinas vasodilatadoras renais
        MatrizInteracaoSchema(
            id_interacao=3,
            id_principio_ativo_a=4,
            id_principio_ativo_b=2,
            gravidade_interacao="Moderada",
            efeito_clinico="A administração regular e repetida de analgésicos que inibem a síntese de prostaglandinas pode atenuar a resposta vasodilatadora renal e o efeito anti-hipertensivo do enalapril, além de aumentar o risco de retenção hidrossalina e lesão renal aguda funcional em pacientes hipovolêmicos ou idosos.",
            conduta_recomendada="Utilizar dipirona na menor dose e menor intervalo de tempo necessários para alívio térmico/álgico. Evitar prescrições contínuas prolongadas. Monitorar pressão arterial e função renal com dosagem de creatinina sérica.",
        ),
        # 4. Losartana (3) + Dipirona (2): Redução do efeito hemodinâmico renal
        MatrizInteracaoSchema(
            id_interacao=4,
            id_principio_ativo_a=3,
            id_principio_ativo_b=2,
            gravidade_interacao="Moderada",
            efeito_clinico="Inibição de prostaglandinas intrarrenais pode antagonizar parcialmente a redução da resistência vascular sistêmica induzida pela losartana, com eventual descompensação da pressão arterial em indivíduos hipertensos e risco de hipercalemia em nefropatas crônicos.",
            conduta_recomendada="Limitar o uso da dipirona a episódios esporádicos sob demanda sintomática. Monitorar a pressão arterial sistêmica e orientar o paciente quanto a sinais de retenção hídrica ou edema de membros inferiores.",
        ),
        # 5. Noradrenalina (7) + Enalapril (4): Conflito hemodinâmico em instabilidade circulatória
        MatrizInteracaoSchema(
            id_interacao=5,
            id_principio_ativo_a=7,
            id_principio_ativo_b=4,
            gravidade_interacao="Grave",
            efeito_clinico="No choque, o IECA reduz a angiotensina II que sustenta a pressão arterial e a vasoconstrição da arteríola eferente: agrava a hipotensão, aumenta a necessidade de vasopressor e reduz a TFG (risco de lesão renal aguda).",
            conduta_recomendada="Suspender imediatamente qualquer anti-hipertensivo ou IECA na presença de hipotensão que demande vasopressores. Manter monitorização invasiva contínua de débito cardíaco, PAM e débito urinário horário.",
        ),
    ]


def obter_lista_codigos_diagnosticos() -> List[CodigoDiagnosticoSchema]:
    return [
        # 1. Hipertensão Arterial
        CodigoDiagnosticoSchema(
            id_diagnostico=1,
            codigo_cid10="I10",
            descricao_cid10="Hipertensão essencial (primária)",
            codigo_ciap2="K86",
            descricao_ciap2="Hipertensão sem complicações",
        ),
        # 2. Diabetes Mellitus Tipo 2
        CodigoDiagnosticoSchema(
            id_diagnostico=2,
            codigo_cid10="E11",
            descricao_cid10="Diabetes mellitus não-insulino-dependente",
            codigo_ciap2="T90",
            descricao_ciap2="Diabetes não insulino-dependente",
        ),
        # 3. Infecção Urinária
        CodigoDiagnosticoSchema(
            id_diagnostico=3,
            codigo_cid10="N39.0",
            descricao_cid10="Infecção do trato urinário de localização não especificada",
            codigo_ciap2="U71",
            descricao_ciap2="Cistite / outra infecção urinária",
        ),
        # 4. Faringite Aguda
        CodigoDiagnosticoSchema(
            id_diagnostico=4,
            codigo_cid10="J02.9",
            descricao_cid10="Faringite aguda não especificada",
            codigo_ciap2="R74",
            descricao_ciap2="Faringite aguda / amigdalite",
        ),
        # 5. Dengue
        CodigoDiagnosticoSchema(
            id_diagnostico=5,
            codigo_cid10="A90",
            descricao_cid10="Dengue [dengue clássico]",
            codigo_ciap2="A77",
            descricao_ciap2="Dengue e outras viroses exantemáticas",
        ),
        # 6. IVAS
        CodigoDiagnosticoSchema(
            id_diagnostico=6,
            codigo_cid10="J06.9",
            descricao_cid10="Infecção aguda das vias aéreas superiores não especificada",
            codigo_ciap2="R74",
            descricao_ciap2="Infecção respiratória aguda superior",
        ),
        # 7. Pneumonia
        CodigoDiagnosticoSchema(
            id_diagnostico=7,
            codigo_cid10="J18.9",
            descricao_cid10="Pneumonia não especificada",
            codigo_ciap2="R81",
            descricao_ciap2="Pneumonia bacteriana ou viral",
        ),
        # 8. DRGE
        CodigoDiagnosticoSchema(
            id_diagnostico=8,
            codigo_cid10="K21.9",
            descricao_cid10="Doença do refluxo gastroesofágico sem esofagite",
            codigo_ciap2="D84",
            descricao_ciap2="Doença do esôfago / refluxo gastroesofágico",
        ),
        # 9. Gastrite
        CodigoDiagnosticoSchema(
            id_diagnostico=9,
            codigo_cid10="K29.7",
            descricao_cid10="Gastrite não especificada",
            codigo_ciap2="D87",
            descricao_ciap2="Gastrite / dor epigástrica / queixas estomacais",
        ),
        # 10. Lombalgia
        CodigoDiagnosticoSchema(
            id_diagnostico=10,
            codigo_cid10="M54.5",
            descricao_cid10="Dor lombar baixa (Lumbago)",
            codigo_ciap2="L03",
            descricao_ciap2="Sintoma / queixa lombar",
        ),
        # 11. Cefaleia
        CodigoDiagnosticoSchema(
            id_diagnostico=11,
            codigo_cid10="R51",
            descricao_cid10="Cefaleia e dor facial",
            codigo_ciap2="N01",
            descricao_ciap2="Cefaleia / dor de cabeça",
        ),
        # 12. Transtorno de Ansiedade
        CodigoDiagnosticoSchema(
            id_diagnostico=12,
            codigo_cid10="F41.1",
            descricao_cid10="Transtorno de ansiedade generalizada",
            codigo_ciap2="P74",
            descricao_ciap2="Transtorno de ansiedade / ansiedade generalizada",
        ),
        # 13. Depressão
        CodigoDiagnosticoSchema(
            id_diagnostico=13,
            codigo_cid10="F32.9",
            descricao_cid10="Episódio depressivo não especificado",
            codigo_ciap2="P76",
            descricao_ciap2="Transtorno depressivo",
        ),
        # 14. Hipercolesterolemia
        CodigoDiagnosticoSchema(
            id_diagnostico=14,
            codigo_cid10="E78.0",
            descricao_cid10="Hipercolesterolemia pura",
            codigo_ciap2="T93",
            descricao_ciap2="Anormalidade dos lipídios / dislipidemia",
        ),
        # 15. Asma
        CodigoDiagnosticoSchema(
            id_diagnostico=15,
            codigo_cid10="J45.9",
            descricao_cid10="Asma não especificada",
            codigo_ciap2="R96",
            descricao_ciap2="Asma brônquica",
        ),
    ]


def popular_banco_dados(caminho_banco: Optional[str] = None) -> None:
    if caminho_banco is None:
        caminho_banco = obter_caminho_padrao_banco()

    conexao = inicializar_banco_dados(caminho_banco)

    with conexao:
        # Inserção de princípios ativos validados por Pydantic
        for item in obter_lista_principios_ativos():
            conexao.execute("""
                INSERT OR REPLACE INTO principios_ativos (
                    id_principio_ativo, nome_dcb, classe_terapeutica,
                    categoria_risco_gestacao, compatibilidade_aleitamento,
                    disponivel_rename_sus, componente_sus
                ) VALUES (?, ?, ?, ?, ?, ?, ?);
            """, (
                item.id_principio_ativo,
                item.nome_dcb,
                item.classe_terapeutica,
                item.categoria_risco_gestacao,
                item.compatibilidade_aleitamento,
                item.disponivel_rename_sus,
                item.componente_sus,
            ))

        # Inserção de medicamentos comerciais validados
        for item in obter_lista_medicamentos_comerciais():
            conexao.execute("""
                INSERT OR REPLACE INTO medicamentos_comerciais (
                    id_medicamento, id_principio_ativo, numero_registro_anvisa,
                    nome_comercial, laboratorio_fabricante, apresentacao_comercial,
                    concentracao_valor, concentracao_unidade, forma_farmaceutica,
                    tipo_receituario, preco_maximo_consumidor
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            """, (
                item.id_medicamento,
                item.id_principio_ativo,
                item.numero_registro_anvisa,
                item.nome_comercial,
                item.laboratorio_fabricante,
                item.apresentacao_comercial,
                item.concentracao_valor,
                item.concentracao_unidade,
                item.forma_farmaceutica,
                item.tipo_receituario,
                item.preco_maximo_consumidor,
            ))

        # Inserção de bulas estruturadas validadas
        for item in obter_lista_bulas_estruturadas():
            conexao.execute("""
                INSERT OR REPLACE INTO bulas_estruturadas (
                    id_bula, id_principio_ativo, indicacoes_clinicas,
                    posologia_adulto_padrao, posologia_pediatrica_padrao,
                    dose_pediatrica_mg_kg_dia_min, dose_pediatrica_mg_kg_dia_max,
                    dose_maxima_diaria_mg, ajuste_funcao_renal_json,
                    ajuste_funcao_hepatica, contraindicacoes,
                    eventos_adversos_comuns, guia_diluicao_injetavel_json
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            """, (
                item.id_bula,
                item.id_principio_ativo,
                item.indicacoes_clinicas,
                item.posologia_adulto_padrao,
                item.posologia_pediatrica_padrao,
                item.dose_pediatrica_mg_kg_dia_min,
                item.dose_pediatrica_mg_kg_dia_max,
                item.dose_maxima_diaria_mg,
                item.ajuste_funcao_renal_json,
                item.ajuste_funcao_hepatica,
                item.contraindicacoes,
                item.eventos_adversos_comuns,
                item.guia_diluicao_injetavel_json,
            ))

        # Inserção da matriz de interações clínicas
        for item in obter_lista_matriz_interacoes():
            conexao.execute("""
                INSERT OR REPLACE INTO matriz_interacoes (
                    id_interacao, id_principio_ativo_a, id_principio_ativo_b,
                    gravidade_interacao, efeito_clinico, conduta_recomendada
                ) VALUES (?, ?, ?, ?, ?, ?);
            """, (
                item.id_interacao,
                item.id_principio_ativo_a,
                item.id_principio_ativo_b,
                item.gravidade_interacao,
                item.efeito_clinico,
                item.conduta_recomendada,
            ))

        # Inserção dos códigos diagnósticos CID-10 e CIAP-2
        for item in obter_lista_codigos_diagnosticos():
            conexao.execute("""
                INSERT OR REPLACE INTO codigos_diagnosticos (
                    id_diagnostico, codigo_cid10, descricao_cid10,
                    codigo_ciap2, descricao_ciap2
                ) VALUES (?, ?, ?, ?, ?);
            """, (
                item.id_diagnostico,
                item.codigo_cid10,
                item.descricao_cid10,
                item.codigo_ciap2,
                item.descricao_ciap2,
            ))

    conexao.close()
    print("Seed inicial executado com sucesso e banco relacional populado.")


if __name__ == "__main__":
    caminho_db = obter_caminho_padrao_banco()
    popular_banco_dados(caminho_db)
