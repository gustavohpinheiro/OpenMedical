---
id_protocolo: "nice_ng203_doenca_renal_cronica"
titulo: "Doença Renal Crônica: Avaliação, Rastreio com RAC e Nefroproteção com IECA/BRA e iSGLT2"
pais: "Reino Unido"
agencia: "NICE (National Institute for Health and Care Excellence)"
codigo_diretriz: "NICE Guideline NG203"
url_fonte: "https://www.nice.org.uk/guidance/ng203"
data_publicacao: "2021-08-25"
data_revisao: "2021-11-24"
idioma_original: "en-GB"
cids_relacionados: ["N18", "N18.1", "N18.2", "N18.3", "N18.4", "N18.5", "N18.9"]
ciaps_relacionados: ["U99"]
categoria: "nefrologia"
nivel_atencao: "Atencao_Primaria_e_Especializada"
status_revisao_clinica: "documento_oficial_governamental"

# Mapeamento com o SUS / Brasil
equivalente_sus_id: "doenca_renal_cronica_nefroprotecao"
tem_equivalente_sus: true
disponibilidade_farmacos_rename_sus: "parcial"
medicamentos_exclusivos_estrangeiros:
  - "Finerenona (antagonista não esteroidal do receptor mineralocorticoide - NICE TA877)"
  - "Bicarbonato de sódio purificado para profilaxia de acidose metabólica crônica"

# Resumo executivo de divergências entre a conduta internacional e o PCDT/SUS:
divergencias_relevantes_vs_sus:
  - "NICE estabelece a Relação Albumina/Creatinina Urinária (RAC/ACR) em amostra isolada como exame obrigatório para rastreio e acompanhamento, condenando explicitamente fitas reagentes urinárias comuns e urina de 24 horas para este fim."
  - "Indicação formal de Inibidores de SGLT2 (Dapagliflozina) para qualquer paciente com DRC e TFGe entre 25 e 75 mL/min/1,73m² com RAC >= 200 mg/g (ou 22,6 mg/mmol), mesmo na ausência de Diabetes Mellitus."
  - "Uso da equação CKD-EPI sem ajuste por raça/etnia e cálculo do risco de falência renal em 5 anos (Kidney Failure Risk Equation - KFRE com escore de 4 variáveis) para decidir encaminhamento nefrológico ambulatorial."
---

# Diretriz Clínica Governamental: Doença Renal Crônica (NICE NG203)

## 1. Identificação e Metadados da Fonte Oficial
* **Agência Emissora:** National Institute for Health and Care Excellence (NICE) - National Health Service (NHS), Reino Unido.
* **Código de Referência:** NICE Guideline NG203.
* **Link Oficial:** [https://www.nice.org.uk/guidance/ng203](https://www.nice.org.uk/guidance/ng203)
* **Escopo:** Detecção precoce, estadiamento pelo KDIGO (TFGe + RAC), redução do declínio da função renal e manejo do risco cardiovascular.

---

## 2. Critérios Diagnósticos e Classificação KDIGO

### Diagnóstico de Doença Renal Crônica (DRC):
* Presença persistente por **$\ge 3$ meses** de:
  * **TFGe < 60 mL/min/1,73m²** (calculada pela equação CKD-EPI baseada em creatinina sérica); **OU**
  * **Marcador de lesão renal:** Relação Albumina/Creatinina (RAC) na urina $\ge 30\text{ mg/g}$ ($3\text{ mg/mmol}$), anormalidades no sedimento urinário, alterações histológicas ou anatômicas estruturais.

### Estadiamento Combinado (TFGe [G] + Albuminúria [A]):
* **Estágios de TFGe (G):**
  * G1: $\ge 90$ (normal/elevado)
  * G2: $60\text{--}89$ (levemente diminuído)
  * G3a: $45\text{--}59$ (leve a moderadamente diminuído)
  * G3b: $30\text{--}44$ (moderada a severamente diminuído)
  * G4: $15\text{--}29$ (severamente diminuído)
  * G5: $< 15\text{ mL/min/1,73m²}$ (falência renal / estágio terminal)
* **Categorias de Albuminúria (A - RAC):**
  * A1: $< 30\text{ mg/g}$ ($< 3\text{ mg/mmol}$) - Normal a aumento leve
  * A2: $30\text{--}300\text{ mg/g}$ ($3\text{--}30\text{ mg/mmol}$) - Microalbuminúria / aumento moderado
  * A3: $> 300\text{ mg/g}$ ($> 30\text{ mg/mmol}$) - Macroalbuminúria / aumento severo

---

## 3. Escalonamento Farmacológico e Nefroproteção

### Metas Pressóricas no Paciente com DRC:
* Se RAC $< 70\text{ mg/mmol}$ ($< 600\text{ mg/g}$): Manter PA sistólica entre $120\text{--}139\text{ mmHg}$ e diastólica $< 90\text{ mmHg}$.
* Se RAC $\ge 70\text{ mg/mmol}$ ($\ge 600\text{ mg/g}$): Controle mais estrito, PAS entre $120\text{--}129\text{ mmHg}$ e PAD $< 80\text{ mmHg}$.

### Algoritmo Nefroprotetor:
1. **Bloqueio do Sistema Renina-Angiotensina-Aldosterona (SRAA):**
   * **Indicação:** Oferecer IECA (Ramipril $2,5\text{ a }10\text{ mg/dia}$ ou Enalapril $5\text{ a }40\text{ mg/dia}$) ou BRA (Losartana $50\text{ a }100\text{ mg/dia}$) se:
     * Diabetes com RAC $\ge 30\text{ mg/g}$ ($3\text{ mg/mmol}$);
     * Hipertensão sem diabetes com RAC $\ge 300\text{ mg/g}$ ($30\text{ mg/mmol}$);
     * Qualquer DRC com RAC $\ge 600\text{ mg/g}$ ($70\text{ mg/mmol}$).
   * **Monitoramento:** Dosar creatinina sérica e potássio em 1 a 2 semanas após iniciar ou titular a dose. Aumentos de até $30\%$ na creatinina basal são esperados pela hemodinâmica glomerular e aceitáveis; investigar apenas se elevação $> 30\%$ ou hipercalemia $> 5,5\text{ mEq/L}$.
2. **Inibidores de SGLT2 (Dapagliflozina / Empagliflozina):**
   * Prescrever **Dapagliflozina $10\text{ mg}$ 1x/dia** para adultos com TFGe entre $25\text{ e }75\text{ mL/min/1,73m²}$ que apresentem RAC $\ge 200\text{ mg/g}$ ($22,6\text{ mg/mmol}$), **independentemente da presença de diabetes**.
   * Não descontinuar o iSGLT2 se a TFGe cair abaixo de $25\text{ mL/min/1,73m²}$ durante o tratamento, exceto se início de terapia dialítica ou intolerância clínica severa.
3. **Estatinas e Proteção Cardiovascular (NICE NG238):**
   * Prescrever **Atorvastatina $20\text{ mg/dia}$** para todos os pacientes adultos com DRC nos estágios G3 a G5 ou com albuminúria A2/A3, sem necessidade de cálculo de escore de risco adicional, devido ao risco cardiovascular equivalente.

---

## 4. Análise Comparada com o SUS / Brasil

### Convergências:
* Uso prioritário de IECA (Enalapril) ou BRA (Losartana) para nefroproteção em diabéticos e hipertensos com perda proteica renal.
* Aceitação clínica do aumento moderado de creatinina (até 30%) como efeito fisiológico do alívio da hiperfiltração intraglomerular.

### Divergências Relevantes de Gestão e Acesso:
1. **Disponibilidade da RAC na Atenção Básica:** O protocolo britânico exige a RAC urinária na rotina laboratorial da atenção primária. No SUS, a solicitação de microalbuminúria/RAC frequentemente enfrenta restrição de cota laboratorial ambulatorial em municípios de médio e pequeno porte, gerando subdiagnóstico do estágio A2.
2. **Indicação Ampla de iSGLT2 na DRC Não Diabética:** O NICE preconiza Dapagliflozina para DRC com albuminúria com ou sem DM2. No SUS, o acesso a iSGLT2 para não diabéticos ainda é restrito ou depende de processos de Farmácia de Alto Custo (CEAF) estadual com regras heterogêneas.
3. **Escore KFRE de Encaminhamento:** O NHS adota a calculadora KFRE de 4 variáveis para regular a fila da nefrologia (encaminhar se risco de diálise em 5 anos for $> 5\%$), enquanto no SUS o critério costuma ser puramente corte fixo de TFGe $< 30\text{ mL/min}$ ou creatinina absoluta.
