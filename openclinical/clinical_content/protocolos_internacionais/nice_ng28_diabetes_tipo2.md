---
id_protocolo: "nice_ng28_diabetes_tipo2"
titulo: "Diabetes Mellitus Tipo 2 no Adulto: Manejo Farmacológico com Metformina, iSGLT2 e Análogos GLP-1/GIP"
pais: "Reino Unido"
agencia: "NICE (National Institute for Health and Care Excellence)"
codigo_diretriz: "NICE Guideline NG28"
url_fonte: "https://www.nice.org.uk/guidance/ng28"
data_publicacao: "2015-12-02"
data_revisao: "2026-02-18"
idioma_original: "en-GB"
cids_relacionados: ["E11", "E11.2", "E11.4", "E11.9"]
ciaps_relacionados: ["T90"]
categoria: "metabolico_endocrino"
nivel_atencao: "Atencao_Primaria_e_Especializada"
status_revisao_clinica: "documento_oficial_governamental"

# Mapeamento com o SUS / Brasil
equivalente_sus_id: "diabetes_tipo2_associacao_metformina_isglt2"
tem_equivalente_sus: true
disponibilidade_farmacos_rename_sus: "parcial"
medicamentos_exclusivos_estrangeiros:
  - "Tirzepatida (duplo agonista GLP-1/GIP)"
  - "Semaglutida injetável/oral para DM2 em atenção primária"
  - "Empagliflozina / Ertugliflozina de dispensação universal"

# Resumo executivo de divergências entre a conduta internacional e o PCDT/SUS:
divergencias_relevantes_vs_sus:
  - "A diretriz NICE NG28 posiciona os inibidores de SGLT2 (Dapagliflozina, Empagliflozina) como terapia de 1ª linha em combinação com a Metformina desde o diagnóstico para pacientes com alto risco cardiovascular, insuficiência cardíaca ou doença renal crônica."
  - "Sulfonilureias (Gliclazida) perderam espaço como 2ª linha mandatória no NICE devido ao risco de hipoglicemia e ganho de peso, dando lugar a iSGLT2, agonistas do receptor GLP-1 e inibidores de DPP-4."
  - "No SUS (Conitec / RENAME), a Dapagliflozina 10 mg foi incorporada com critérios restritos de idade (idade >= 65 anos com DCV estabelecida) ou DRC com albuminúria, mantendo a Gliclazida MR e Insulina NPH como escolhas preponderantes na UBS após a Metformina."
---

# Diretriz Clínica Governamental: Diabetes Tipo 2 no Adulto (NICE NG28)

## 1. Identificação e Metadados da Fonte Oficial
* **Agência Emissora:** National Institute for Health and Care Excellence (NICE) - National Health Service (NHS), Reino Unido.
* **Código de Referência:** NICE Guideline NG28 (Atualização com evidências de 2026).
* **Link Oficial:** [https://www.nice.org.uk/guidance/ng28](https://www.nice.org.uk/guidance/ng28)
* **Escopo:** Diagnóstico, metas individualizadas de hemoglobina glicada ($\text{HbA}_{1c}$), rastreio de complicações micro e macrovasculares e farmacoterapia protetora de órgãos.

---

## 2. Metas Glicêmicas e Monitoramento Clínico

### Alvos de Hemoglobina Glicada ($\text{HbA}_{1c}$):
* **Alvo Padrão (Sem fármacos com risco de hipoglicemia):**
  * $\text{HbA}_{1c} \le 48\text{ mmol/mol}$ ($6,5\%$) se manejado exclusivamente com estilo de vida ou monoterapia com Metformina.
* **Alvo de Segurança (Em uso de fármacos com risco de hipoglicemia - Sulfonilureias / Insulina):**
  * $\text{HbA}_{1c} \le 53\text{ mmol/mol}$ ($7,0\%$) para evitar hipoglicemias sintomáticas ou assintomáticas.
* **Metas Relaxadas:** $\text{HbA}_{1c} \le 58\text{ a }64\text{ mmol/mol}$ ($7,5\%\text{--}8,0\%$) para idosos frágeis, histórico de hipoglicemia grave ou expectativa de vida reduzida.

---

## 3. Escalonamento Farmacológico Oficial (NICE Algorithm)

### 1ª Linha (Terapia Inicial):
1. **Metformina de Liberação Padrão ou Prolongada (XR):**
   * Titulação: iniciar com $500\text{ mg/dia}$ às refeições; titular até $1.000\text{ mg}$ 2x/dia (dose máxima efetiva: $2.000\text{ a }2.550\text{ mg/dia}$).
2. **Avaliação Precoce de Doença Cardiovascular Estabelecida (DCV), IC ou Risco CV Elevado:**
   * **Se DCV aterosclerótica estabelecida, Insuficiência Cardíaca crônica ou $\text{QRISK3} \ge 10\%$:**
     * Adicionar **Inibidor do Cotransportador Sódio-Glicose 2 (iSGLT2)** com benefício cardiovascular comprovado (Dapagliflozina $10\text{ mg/dia}$ ou Empagliflozina $10\text{ a }25\text{ mg/dia}$) **junto ou logo após** o início da Metformina, sem aguardar desfecho de falha glicêmica isolada.
   * Se contraindicação ou intolerância gastrointestinal severa à Metformina: monoterapia com iSGLT2 ou Inibidor da DPP-4 (Sitagliptina $100\text{ mg/dia}$).

### 2ª Linha (Dual Therapy - Se $\text{HbA}_{1c} >$ Meta após 3 a 6 meses):
* Adicionar uma segunda classe de acordo com o perfil fenotípico:
  * **Se iSGLT2 já em uso com Metformina:** Adicionar Inibidor de DPP-4 (ex: Sitagliptina $100\text{ mg}$, Linagliptina $5\text{ mg}$), Agonista do Receptor GLP-1, Pioglitazona ($15\text{--}30\text{ mg/dia}$) ou Sulfonilureia (Gliclazida MR $30\text{--}120\text{ mg/dia}$).
  * **Se obesidade grau II/III ($\text{IMC} \ge 35\text{ kg/m}^2$) ou DCV grave:** Considerar indicação de **Agonista do Receptor GLP-1** (Dulaglutida $1,5\text{ mg}$ SC 1x/sem ou Semaglutida $0,5\text{--}1,0\text{ mg}$ SC 1x/sem) ou **Tirzepatida**.

### 3ª Linha (Terapia Tripla e Insulinoterapia):
* Metformina + iSGLT2 + (iDPP-4 ou GLP-1 RA ou Pioglitazona ou Sulfonilureia).
* Se persistir fora da meta ou sinais clínicos de catabolismo (perda ponderal inexplicada, cetose):
  * Iniciar **Insulina Basal** (Insulina NPH ou análogos de ação prolongada como Glargina ou Degludeca), habitualmente $10\text{ UI}$ ou $0,1\text{ a }0,2\text{ UI/kg}$ ao deitar.

---

## 4. Análise Comparada com o SUS / Brasil

### Convergências:
* Metformina permanece universalmente como o alicerce fundamental do tratamento inicial do DM2 tanto no SUS quanto no NHS/NICE.
* Reconhecimento formal da nefroproteção e cardioproteção promovida pelos iSGLT2 em pacientes de alto risco.

### Divergências Relevantes de Gestão e Acesso:
1. **Critérios de Acesso aos iSGLT2:** O PCDT do Ministério da Saúde restringe a Dapagliflozina para idosos ($\ge 65$ anos) com evento cardiovascular prévio ou portadores de insuficiência cardíaca / DRC avançada. No NICE, a prescrição é ampla a qualquer adulto com DCV estabelecida ou risco elevado, independentemente do teto etário de 65 anos.
2. **Agonistas GLP-1 e Duplos Agonistas (GIP/GLP-1):** O NHS subsidia análogos de GLP-1 e Tirzepatida para DM2 com obesidade ou alto risco cardiovascular; no SUS, os análogos de GLP-1 não estão na RENAME para DM2 na atenção básica.
3. **Papel das Sulfonilureias:** Enquanto o SUS utiliza intensamente a Gliclazida MR como o segundo fármaco obrigatório na UBS por custo e disponibilidade, o NICE desestimula sua utilização rotineira precoce devido ao risco cumulativo de hipoglicemia e esgotamento da célula beta.
