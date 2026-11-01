---
# MODELO DE PROTOCOLO INTERNACIONAL - OPENCLINICAL
id_protocolo: "nice_ng136_hipertensao"
titulo: "Hipertensão Arterial no Adulto: Diagnóstico e Manejo"
pais: "Reino Unido"
agencia: "NICE (National Institute for Health and Care Excellence)"
codigo_diretriz: "NICE Guideline NG136"
url_fonte: "https://www.nice.org.uk/guidance/ng136"
data_publicacao: "2019-08-28"
data_revisao: "2023-11-01"
idioma_original: "en-GB"
cids_relacionados: ["I10", "I15"]
ciaps_relacionados: ["K86", "K87"]
categoria: "cardiovascular"
nivel_atencao: "Atencao_Primaria_e_Especializada"
status_revisao_clinica: "documento_oficial_governamental"

# Mapeamento com o SUS / Brasil
equivalente_sus_id: "hipertensao_arterial_estagio1_2"
tem_equivalente_sus: true
disponibilidade_farmacos_rename_sus: "parcial" # "total" | "parcial" | "ausente_no_sus"
medicamentos_exclusivos_estrangeiros: [] # Fármacos citados que não constam na RENAME

# Resumo executivo de divergências entre a conduta internacional e o PCDT/SUS:
divergencias_relevantes_vs_sus:
  - "NICE preconiza MAPA ou MRPA obrigatório para confirmação diagnóstica de HAS antes de iniciar tratamento (no SUS, a aferição em consultório repetida em 2+ consultas ainda é a base mais frequente na UBS)."
  - "Diferenciação farmacológica de 1ª linha por etnia e idade: NICE prioriza Bloqueadores de Canais de Cálcio (BCC) para pacientes ≥ 55 anos ou de ascendência africana/caribenha, e IECA/BRA para < 55 anos não-africanos."
---

# Diretriz Clínica Internacional: Hipertensão Arterial (NICE NG136)

## 1. Identificação e Metadados da Fonte Governamental
* **Agência Emissora:** National Institute for Health and Care Excellence (NICE) - Reino Unido (NHS).
* **Referência Oficial:** NICE Guideline NG136.
* **Link Oficial:** [NICE Guidance NG136](https://www.nice.org.uk/guidance/ng136)

## 2. Critérios Diagnósticos
* Diagnóstico inicial baseado em aferição em consultório $\ge 140/90\text{ mmHg}$ seguido de **confirmação mandatória por MAPA** (média diurna $\ge 135/85\text{ mmHg}$) ou **MRPA** (média de 4 a 7 dias $\ge 135/85\text{ mmHg}$).

## 3. Escalonamento Terapêutico (NICE Stepwise Approach)
* **Step 1:**
  * $< 55$ anos (não negro): IECA ou BRA.
  * $\ge 55$ anos ou negro de qualquer idade: Bloqueador de Canal de Cálcio (BCC - Anlodipino $5\text{--}10\text{ mg}$).
* **Step 2:**
  * Combinação dupla: (IECA ou BRA) + (BCC ou Diurético tiazídico-símile: Indapamida $1,5\text{--}2,5\text{ mg}$).
* **Step 3:**
  * Tripla: IECA/BRA + BCC + Tiazídico-símile.
* **Step 4 (HAS Resistente):**
  * Se $\text{K}^+ \le 4,5\text{ mEq/L}$: Adicionar Espironolactona $25\text{--}50\text{ mg/dia}$.
  * Se $\text{K}^+ > 4,5\text{ mEq/L}$: Adicionar Alfa-bloqueador ou Beta-bloqueador.

## 4. Análise Comparada com o SUS / Brasil
* **Convergências:** Ambos priorizam IECA/BRA, BCC e Tiazídicos como drogas de 1ª linha.
* **Divergências:** O SUS (Diretriz Brasileira SBC 2020 / Linhas de Cuidado MS) utiliza mais frequentemente Hidroclorotiazida na UBS devido à padronização RENAME, enquanto o NICE preconiza Indapamida ou Clortalidona como tiazídicos preferenciais por melhor perfil cardiovascular e meia-vida mais longa.
