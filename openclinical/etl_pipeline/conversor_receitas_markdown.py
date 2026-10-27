import os
import sys
import sqlite3
from typing import List, Dict, Any

diretorio_atual = os.path.dirname(os.path.abspath(__file__))
if diretorio_atual not in sys.path:
    sys.path.insert(0, diretorio_atual)

from compilador_banco import obter_caminho_padrao_banco

# Diretório oficial de protocolos em Markdown
DIRETORIO_PROTOCOLOS = os.path.abspath(
    os.path.join(diretorio_atual, "..", "clinical_content", "protocolos")
)


RECEITAS_CLINICAS_PADRAO: List[Dict[str, Any]] = [
    {
        "id_protocolo": "faringite_amigdalite_aguda",
        "titulo": "Manejo da Faringoamigdalite Aguda Estreptocócica",
        "cids": ["J02.0", "J02.9", "J03.0"],
        "ciaps": ["R74"],
        "nivel_atencao": "Atencao_Primaria",
        "data_revisao": "2026-10-25",
        "conteudo": """# Diretrizes Clínicas: Faringite e Amigdalite Aguda Estreptocócica

## 1. Critérios Clínicos de Centor Modificados (Probabilidade de Streptococcus pyogenes)
* Febre referida ou aferida (> 38 ºC): +1 ponto
* Ausência de tosse: +1 ponto
* Exsudato amigdaliano ou edema com eritema intenso: +1 ponto
* Linfonodomegalia cervical anterior dolorosa: +1 ponto
* Idade de 3 a 14 anos (+1 ponto) | 15 a 44 anos (0 pontos) | >= 45 anos (-1 ponto)
* **Conduta:** Escore >= 3 justifica antibioticoterapia empírica ou teste rápido antigênico (Streptotest).

## 2. Opções Terapêuticas de Primeira Linha
1. **Amoxicilina:** 500 mg VO de 8 em 8 horas por 10 dias (ou 875 mg VO de 12 em 12 horas por 10 dias).
   * *Pediatria:* 50 mg/kg/dia divididos a cada 12 ou 8 horas por 10 dias.
2. **Penicilina G Benzatina:** Dose única intramuscular profunda (garante adesão completa ao tratamento de 10 dias, prevenindo Febre Reumática):
   * Peso < 27 kg: 600.000 UI IM dose única.
   * Peso >= 27 kg: 1.200.000 UI IM dose única.
3. **Alergia a Penicilina (Anafilaxia/Urticária):**
   * Azitromicina 500 mg VO uma vez ao dia por 5 dias (pediatria: 10 mg/kg/dia por 3 a 5 dias).

```receita
RECEITUÁRIO MÉDICO
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Amoxicilina 500mg cápsula --------------------------- 1 caixa (30 cápsulas)
   Tomar 1 cápsula por via oral a cada 8 horas por 10 dias consecutivos.
   (Atenção: Não interromper o tratamento mesmo após alívio completo da dor de garganta).

2. Dipirona Monoidratada 500mg comprimido -------------- 1 blister (10 comprimidos)
   Tomar 1 a 2 comprimidos por via oral a cada 6 horas em caso de dor de garganta ou febre.

Orientações:
- Hidratação abundante e gargarejos com água morna e salina leve.
- Trocar a escova de dentes após 48 horas de antibioticoterapia para evitar reinfecção estreptocócica.
```
""",
    },
    {
        "id_protocolo": "diabetes_mellitus_tipo2",
        "titulo": "Manejo Farmacológico Inicial do Diabetes Mellitus Tipo 2 no SUS",
        "cids": ["E11", "E11.9"],
        "ciaps": ["T90"],
        "nivel_atencao": "Atencao_Primaria",
        "data_revisao": "2026-10-25",
        "conteudo": """# Diretrizes Clínicas: Manejo Inicial do Diabetes Mellitus Tipo 2 (Diretrizes SBD / Ministério da Saúde)

## 1. Metas Terapêuticas Clínicas
* **HbA1c Alvo:** < 7.0% na maioria dos adultos não gestantes (< 6.5% em jovens sem comorbidades; < 8.0% em idosos frágeis).
* **Glicemia de Jejum:** 80 a 130 mg/dL.
* **Glicemia Pós-prandial (2 horas):** < 180 mg/dL.
* **Pressão Arterial:** < 130/80 mmHg.

## 2. Terapêutica de Primeira Linha (Biguanida)
* **Cloridrato de Metformina:** Iniciar com 500 mg ou 850 mg uma vez ao dia junto ao café da manhã ou almoço.
* Titular a cada 14 dias para minimizar intolerância gastrointestinal até 2000 mg a 2550 mg/dia.
* **Segurança Renal:**
  - TFG >= 60 mL/min: dose plena.
  - TFG 45 a 59 mL/min: dose máxima 1000 mg/dia.
  - TFG 30 a 44 mL/min: dose máxima 500 mg/dia com monitorização semestral.
  - **TFG < 30 mL/min:** CONTRAINDICAÇÃO FORMAL pelo risco de acidose láctica severa.

```receita
RECEITUÁRIO MÉDICO - DIABETES MELLITUS TIPO 2
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Cloridrato de Metformina 850mg comprimido ----------- 2 caixas (60 comprimidos)
   Tomar 1 comprimido por via oral imediatamente após o almoço nos primeiros 14 dias.
   A partir do 15º dia, tomar 1 comprimido após o café da manhã e 1 comprimido após o almoço ou jantar.

Orientações Não Farmacológicas:
- Praticar 150 minutos semanais de atividade física aeróbica de intensidade moderada (caminhadas, bicicleta).
- Redução na ingestão de carboidratos refinados, bebidas açucaradas e ultraprocessados.
- Exame diário minucioso dos pés para detecção precoce de fissuras, micoses ou feridas.
- Retorno agendado com dosagem de HbA1c, creatinina, perfil lipídico e microalbuminúria em 3 meses.
```
""",
    },
    {
        "id_protocolo": "asma_exacerbacao_aguda",
        "titulo": "Manejo da Exacerbação Aguda de Asma na Atenção Básica e Urgência",
        "cids": ["J45", "J45.9", "J46"],
        "ciaps": ["R96"],
        "nivel_atencao": "Atencao_Primaria_e_Urgencia",
        "data_revisao": "2026-10-25",
        "conteudo": """# Protocolo de Crise Asmática Leve a Moderada (Diretrizes GINA / SUS)

## 1. Avaliação Rápida da Gravidade da Crise
* **Leve a Moderada:** Fala frases completas, prefere sentar a deitar, frequência respiratória aumentada, FC 100 a 120 bpm, Saturação de O2 em ar ambiente >= 92% a 95%, PFE > 50%.
* **Grave / Ameaça à Vida:** Fala palavras entrecortadas, sentado inclinado para a frente, FR > 30 irpm, uso de musculatura acessória (tiragem intercostal/fúrcula), FC > 120 bpm, SpO2 < 92%, silêncio respiratório à ausculta pulmonar.

## 2. Tratamento Imediato no Ponto de Atendimento
1. **Beta-2 Agonista de Curta Duração (Salbutamol Spray 100 mcg):**
   * 4 a 10 jatos com espaçador valvulado a cada 20 minutos durante a primeira hora (3 ciclos).
2. **Corticoide Sistêmico Precoce (Via Oral preferencial):**
   * Adultos: Prednisona 40 a 50 mg VO dose única diária por 5 a 7 dias.
   * Crianças: Prednisolona 1 a 2 mg/kg/dia (máx 40 mg) por 3 a 5 dias. Não há necessidade de desmame se <= 7 dias de uso.

```receita
RECEITUÁRIO MÉDICO - ALTA DA EXACERBAÇÃO DE ASMA
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO INALATÓRIO:
1. Sulfato de Salbutamol Spray 100mcg/dose ------------- 1 frasco (200 doses)
   Inalar 2 a 4 jatos com espaçador a cada 4 ou 6 horas se houver chiado no peito, tosse ou falta de ar.

USO ORAL:
2. Prednisona 20mg comprimido -------------------------- 1 caixa (20 comprimidos)
   Tomar 2 comprimidos (40 mg) por via oral pela manhã, em dose única diária, durante 5 dias consecutivos.

Orientações:
- Manter o uso do corticoide inalatório de manutenção prescrito para uso crônico.
- Procurar a emergência imediatamente se o alívio não durar pelo menos 3 horas após o salbutamol ou se houver cansaço progressivo.
```
""",
    },
    {
        "id_protocolo": "pneumonia_adquirida_comunidade",
        "titulo": "Pneumonia Adquirida na Comunidade (PAC) no Adulto: Manejo Ambulatorial",
        "cids": ["J18.9", "J13", "J15.9"],
        "ciaps": ["R81"],
        "nivel_atencao": "Atencao_Primaria",
        "data_revisao": "2026-10-25",
        "conteudo": """# Diretrizes Clínicas: Pneumonia Adquirida na Comunidade (PAC) - Diretrizes SBPT / SUS

## 1. Estratificação de Risco pelo CURB-65
* Escore CURB-65 = 0 ou 1: Baixo risco de mortalidade (< 3%). Candidato seguro ao tratamento ambulatorial por via oral.
* Escore CURB-65 = 2: Considerar observação hospitalar ou supervisão ambulatorial rigorosa.
* Escore CURB-65 >= 3: Internação hospitalar mandatória (avaliar UTI se 4 ou 5).

## 2. Esquema Antimicrobiano Empírico Ambulatorial
* **Paciente previamente hígido, sem uso recente de antibióticos nos últimos 90 dias:**
  - Opção A: Amoxicilina 500 mg de 8/8h (ou 875 mg de 12/12h) por 5 a 7 dias.
  - Opção B: Azitromicina 500 mg VO uma vez ao dia por 5 dias.
* **Portador de comorbidades (DPOC, DM, insuficiência cardíaca, DRC):**
  - Associação Betalactâmico + Macrolídeo: Amoxicilina + Clavulanato 875/125 mg 12/12h associado a Azitromicina 500 mg/dia por 7 dias.

```receita
RECEITUÁRIO MÉDICO - PAC AMBULATORIAL (CURB-65 0-1)
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Amoxicilina 500mg cápsula --------------------------- 1 caixa (21 cápsulas)
   Tomar 1 cápsula por via oral a cada 8 horas por 7 dias.

2. Azitromicina 500mg comprimido ----------------------- 1 caixa (5 comprimidos)
   Tomar 1 comprimido por via oral uma vez ao dia, no mesmo horário, durante 5 dias.

3. Dipirona Monoidratada 500mg comprimido -------------- 1 caixa (20 comprimidos)
   Tomar 1 comprimido de 6 em 6 horas se febre > 37.8 ºC ou dor torácica pleurítica.

Orientações:
- Retorno presencial mandatório em 48 a 72 horas para reavaliação clínica.
- Sinais de alarme: sonolência excessiva, confusão mental, falta de ar intensa, lábios arroxeados.
```
""",
    },
    {
        "id_protocolo": "lombalgia_aguda",
        "titulo": "Abordagem da Lombalgia Mecânica Aguda (Lumbago)",
        "cids": ["M54.5"],
        "ciaps": ["L03"],
        "nivel_atencao": "Atencao_Primaria",
        "data_revisao": "2026-10-25",
        "conteudo": """# Diretrizes Clínicas: Lombalgia Aguda Não Específica

## 1. Rastreamento de Sinais de Alarme (Red Flags)
* Síndrome da Cauda Equina: anestesia em sela, incontinência/retenção urinária ou fecal, fraqueza motora progressiva em MMII (indicação cirúrgica de urgência).
* Suspeita de Fratura Vertebral: trauma recente, osteoporose conhecida, corticoterapia crônica, idade > 70 anos.
* Suspeita de Infecção/Neoplasia: febre, perda ponderal inexplicada, histórico de neoplasia, imunossupressão ou uso de drogas intravenosas.

## 2. Princípios de Manejo da Lombalgia Mecânica
* **DESESTÍMULO AO REPOUSO PROLONGADO EM LEITO:** A manutenção da atividade física tolerada acelera a recuperação funcional.
* Analgesia escalonada: Dipirona ou Paracetamol em doses adequadas como base. Evitar uso de opioides em atenção primária para dor lombar mecânica.

```receita
RECEITUÁRIO MÉDICO - LOMBALGIA MECÂNICA AGUDA
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Dipirona Monoidratada 500mg comprimido -------------- 1 caixa (20 comprimidos)
   Tomar 1 a 2 comprimidos por via oral a cada 6 horas por até 5 dias em caso de dor.

2. Ciclobenzaprina 5mg comprimido ---------------------- 1 caixa (15 comprimidos)
   Tomar 1 comprimido por via oral à noite antes de dormir por 3 a 5 dias.
   (Atenção: pode causar sonolência; não dirigir ou operar máquinas pesadas).

Orientações Clínicas:
- Evitar repouso absoluto na cama. Manter movimentação leve e caminhadas curtas.
- Aplicação de calor local (bolsa de água morna) por 20 minutos na região lombar 2 a 3 vezes ao dia.
- Retorno de urgência se perder força nas pernas ou apresentar perda do controle da urina/fezes.
```
""",
    },
    {
        "id_protocolo": "gastrite_drge",
        "titulo": "Manejo da Doença do Refluxo Gastroesofágico (DRGE) e Dispepsia",
        "cids": ["K21.9", "K29.7"],
        "ciaps": ["D84", "D87"],
        "nivel_atencao": "Atencao_Primaria",
        "data_revisao": "2026-10-25",
        "conteudo": """# Diretrizes Clínicas: Doença do Refluxo Gastroesofágico e Gastrite

## 1. Quadro Clínico e Sinais de Alarme
* Sintomas típicos: pirose (queimação retroesternal) e regurgitação ácida, agravados após refeições copiosas ou decúbito dorsal.
* **Sinais de Alarme para Endoscopia Digestiva Alta (EDA) Imediata:**
  - Idade >= 45 a 55 anos no início dos sintomas;
  - Disfagia (dificuldade para engolir) ou odinofagia;
  - Perda de peso involuntária e significativa;
  - Sangramento digestivo manifesto (hematêmese ou melena) ou anemia ferropriva;
  - Vômitos persistentes e história familiar de câncer gástrico/esofágico.

## 2. Tratamento Farmacológico com IBP
* Omeprazol 20 mg ou 40 mg uma vez ao dia pela manhã, rigorosamente em jejum, 30 minutos antes do café da manhã, por período de 4 a 8 semanas.

```receita
RECEITUÁRIO MÉDICO - DRGE / DISPEPSIA
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Omeprazol 20mg cápsula ------------------------------ 2 caixas (56 cápsulas)
   Tomar 1 a 2 cápsulas (20 a 40 mg) por via oral uma vez ao dia, pela manhã em jejum, 30 minutos antes do café da manhã, durante 8 semanas.

Orientações Higienodietéticas Fundamentais:
- Fracionar as refeições ao longo do dia e mastigar devagar.
- Não deitar antes de 2 a 3 horas após o término da última refeição noturna.
- Elevar a cabeceira da cama em 15 cm (com calços sob os pés da cabeceira, não apenas travesseiros).
- Evitar café, álcool, refrigerantes gasosos, alimentos cítricos, chocolate e frituras.
- Cessar tabagismo e controle do excesso de peso corporal.
```
""",
    },
    {
        "id_protocolo": "dislipidemia_prevencao_cardiovascular",
        "titulo": "Prevenção Cardiovascular Primária e Manejo das Dislipidemias (SBC)",
        "cids": ["E78.0", "E78.2"],
        "ciaps": ["T93"],
        "nivel_atencao": "Atencao_Primaria",
        "data_revisao": "2026-10-25",
        "conteudo": """# Diretrizes Clínicas: Manejo das Dislipidemias (Diretrizes SBC / SUS)

## 1. Estratificação de Risco Cardiovascular Geral (Escore de Framingham / SBC)
* **Baixo Risco:** Risco em 10 anos < 5% (LDL-c alvo < 130 mg/dL).
* **Risco Intermediário:** Homens com risco 5-10% e mulheres com risco 5-10% (LDL-c alvo < 100 mg/dL).
* **Alto Risco:** DM, aterosclerose subclínica (CAC > 100), DRC estágio 3, aneurisma de aorta (LDL-c alvo < 70 mg/dL).
* **Muito Alto Risco:** Evento aterosclerótico manifesto prévio (IAM, AVC, revascularização) (LDL-c alvo < 50 mg/dL).

## 2. Terapêutica Hipolipemiante com Estatinas no SUS
* **Sinvastatina 20 a 40 mg/dia:** Administrada em tomada única noturna (pico fisiológico circadiano da síntese hepática do colesterol por HMG-CoA redutase).
* **Segurança e Interações:**
  - Dosar transaminases (ALT/AST) e CK basais e no acompanhamento.
  - Alerta crítico: Contraindicada na gestação (Categoria X). Cuidado extremo na coadministração com inibidores do CYP3A4 (azitromicina, cetoconazol).

```receita
RECEITUÁRIO MÉDICO - DISLIPIDEMIA (PREVENÇÃO CARDIOVASCULAR)
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Sinvastatina 20mg comprimido revestido -------------- 2 caixas (60 comprimidos)
   Tomar 1 a 2 comprimidos (20 a 40 mg) por via oral uma vez ao dia, rigorosamente à noite ao deitar.

Orientações:
- Dieta cardioprotetora rica em fibras solúveis (aveia, frutas), grãos integrais e azeite de oliva. Redução de gorduras saturadas e trans.
- Prática de atividade física regular e cessação completa do tabagismo.
- Retorno agendado em 6 a 12 semanas com perfil lipídico de controle e dosagem de enzimas hepáticas.
```
""",
    },
    {
        "id_protocolo": "cefaleia_tensional_enxaqueca",
        "titulo": "Abordagem da Cefaleia Tensional e Enxaqueca na Atenção Primária",
        "cids": ["R51", "G43.9", "G44.2"],
        "ciaps": ["N01", "N89", "N90"],
        "nivel_atencao": "Atencao_Primaria_e_Pronto_Atendimento",
        "data_revisao": "2026-10-25",
        "conteudo": """# Diretrizes Clínicas: Abordagem da Cefaleia Aguda e Rastreio de Sinais de Alarme (SNOOP)

## 1. Sinais de Alarme para Cefaleias Secundárias (Mnemônico SNOOP)
* **S (Systemic):** Febre, perda de peso, calafrios, histórico de neoplasia ou infecção por HIV.
* **N (Neurologic):** Déficit neurológico focal (paresia, alteração de fala, ataxia, papiledema).
* **O (Onset):** Início súbito explosivo ("pior dor de cabeça da vida", atinge pico em < 1 minuto - suspeita de hemorragia subaracnóidea).
* **O (Older):** Início após os 50 anos de idade (suspeita de arterite de células gigantes / neoplasia).
* **P (Pattern):** Mudança no padrão habitual, agravamento progressivo ou cefaleia precipitada por tosse/Valsalva.

## 2. Tratamento Abortivo da Crise de Enxaqueca / Tensional
* Dipirona 1 g VO (ou Paracetamol 750 mg a 1000 mg) associado a antiemético se náusea (Metoclopramida 10 mg).
* Administrar precocemente na fase inicial da cefaleia para maior taxa de abortamento.

```receita
RECEITUÁRIO MÉDICO - CEFALEIA / ENXAQUECA
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Dipirona Monoidratada 500mg comprimido -------------- 1 caixa (20 comprimidos)
   Tomar 2 comprimidos (1000 mg) por via oral logo no início dos sintomas de dor de cabeça.
   Se necessário, repetir após 6 horas. (Dose máxima de 4000 mg/dia).

2. Cloridrato de Metoclopramida 10mg comprimido -------- 1 blister (10 comprimidos)
   Tomar 1 comprimido por via oral se houver enjoo ou náusea associada à crise.

Orientações:
- Descansar em ambiente silencioso, com pouca luminosidade e bem arejado.
- Evitar o uso abusivo de analgésicos (> 2 a 3 dias por semana) para prevenir a 'cefaleia por uso excessivo de medicação'.
- Procurar atendimento de urgência se apresentar a pior dor da vida que começou como uma pontada súbita, febre ou rigidez de nuca.
```
""",
    },
]


def converter_e_salvar_protocolos_markdown() -> int:
    """
    Cria ou atualiza os arquivos Markdown de condutas clínicas no diretório
    clinical_content/protocolos/.
    """
    os.makedirs(DIRETORIO_PROTOCOLOS, exist_ok=True)
    salvos = 0

    for p in RECEITAS_CLINICAS_PADRAO:
        nome_arquivo = f"{p['id_protocolo']}.md"
        caminho_completo = os.path.join(DIRETORIO_PROTOCOLOS, nome_arquivo)

        cids_formatados = ", ".join([f'"{cid}"' for cid in p["cids"]])
        ciaps_formatados = ", ".join([f'"{ciap}"' for ciap in p["ciaps"]])

        documento = f"""---
id_protocolo: "{p['id_protocolo']}"
titulo: "{p['titulo']}"
cids_relacionados: [{cids_formatados}]
ciaps_relacionados: [{ciaps_formatados}]
nivel_atencao: "{p['nivel_atencao']}"
data_revisao: "{p['data_revisao']}"
---

{p['conteudo'].strip()}
"""
        with open(caminho_completo, "w", encoding="utf-8") as f:
            f.write(documento)
        salvos += 1

    print(f"Total de {salvos} protocolos médicos convertidos e salvos em: {DIRETORIO_PROTOCOLOS}")
    return salvos


def sincronizar_protocolos_no_banco_sqlite(caminho_banco: str = None) -> int:
    """
    Indexa todos os 11 protocolos médicos Markdown na tabela virtual FTS5 para busca unificada
    em tempo real sub-milissegundo.
    """
    if caminho_banco is None:
        caminho_banco = obter_caminho_padrao_banco()

    conexao = sqlite3.connect(caminho_banco)
    indexados = 0

    with conexao:
        # Limpa indexação anterior de protocolos
        conexao.execute("DELETE FROM indice_busca_fts WHERE tipo_registro = 'protocolo';")

        # Lê todos os arquivos .md do diretório oficial de protocolos
        arquivos = sorted([f for f in os.listdir(DIRETORIO_PROTOCOLOS) if f.endswith(".md")])
        for idx, nome_arquivo in enumerate(arquivos, start=1):
            caminho_arquivo = os.path.join(DIRETORIO_PROTOCOLOS, nome_arquivo)
            with open(caminho_arquivo, "r", encoding="utf-8") as f:
                conteudo_bruto = f.read()

            id_protocolo = nome_arquivo.replace(".md", "")
            titulo = id_protocolo
            cids = []
            ciaps = []
            nivel_atencao = "Atencao_Primaria"
            corpo = conteudo_bruto

            if conteudo_bruto.startswith("---"):
                partes = conteudo_bruto.split("---", 2)
                if len(partes) >= 3:
                    frontmatter = partes[1]
                    corpo = partes[2].strip()
                    for linha in frontmatter.strip().splitlines():
                        if ":" in linha:
                            k, v = linha.split(":", 1)
                            k = k.strip().lower()
                            v = v.strip().strip('"').strip("'")
                            if k == "titulo":
                                titulo = v
                            elif k == "id_protocolo":
                                id_protocolo = v
                            elif k in ("cids_relacionados", "cids"):
                                cids = [x.strip().strip('"').strip("'") for x in v.strip("[]").split(",") if x.strip()]
                            elif k in ("ciaps_relacionados", "ciaps"):
                                ciaps = [x.strip().strip('"').strip("'") for x in v.strip("[]").split(",") if x.strip()]
                            elif k == "nivel_atencao":
                                nivel_atencao = v

            subtitulo = f"Receita & Conduta ({id_protocolo}) - CIDs: {', '.join(cids)}"
            conteudo_textual = f"{id_protocolo} {titulo} {' '.join(cids)} {' '.join(ciaps)} {corpo} receita prescricao receituario"

            conexao.execute("""
                INSERT INTO indice_busca_fts(tipo_registro, id_referencia, titulo_primario, subtitulo, conteudo_textual)
                VALUES ('protocolo', ?, ?, ?, ?);
            """, (idx, titulo, subtitulo, conteudo_textual))
            indexados += 1

    conexao.close()
    print(f"Total de {indexados} protocolos sincronizados e indexados no FTS5 SQLite.")
    return indexados


if __name__ == "__main__":
    converter_e_salvar_protocolos_markdown()
    sincronizar_protocolos_no_banco_sqlite()
