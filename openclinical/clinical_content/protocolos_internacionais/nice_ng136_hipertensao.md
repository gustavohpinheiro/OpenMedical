---
id_protocolo: "nice_ng136_hipertensao"
titulo: "Hipertensão Arterial no Adulto: Diagnóstico e Manejo"
pais: "Reino Unido"
agencia: "NICE (National Institute for Health and Care Excellence)"
codigo_diretriz: "NICE Guideline NG136"
url_fonte: "https://www.nice.org.uk/guidance/ng136"
data_publicacao: "2019-08-28"
data_revisao: "2026-02-26"
idioma_original: "en-GB"
cids_relacionados: ["I10", "I15"]
ciaps_relacionados: ["K86", "K87"]
categoria: "cardiovascular"
nivel_atencao: "Atencao_Primaria_e_Especializada"
status_revisao_clinica: "documento_oficial_governamental"

# Mapeamento com o SUS / Brasil
equivalente_sus_id: "hipertensao_arterial_estagio1_2"
tem_equivalente_sus: true
disponibilidade_farmacos_rename_sus: "parcial"
medicamentos_exclusivos_estrangeiros: []

# Resumo executivo de divergências entre a conduta internacional e o PCDT/SUS:
divergencias_relevantes_vs_sus:
  - "NICE estabelece confirmação mandatória por MAPA (diurno >= 135/85 mmHg) ou MRPA antes de rotular diagnóstico ou iniciar fármaco no estágio 1 sem lesão de órgão-alvo; no SUS, 2 ou mais aferições de consultório em consultas distintas ainda constituem a prática mais comum."
  - "Estratificação farmacológica inicial por etnia e idade: NICE preconiza Bloqueadores dos Canais de Cálcio (BCC) como monoterapia de 1ª linha para indivíduos com idade >= 55 anos ou de etnia negra (origem africana/caribenha), e IECA/BRA para não-negros < 55 anos."
  - "Preferência por diuréticos tiazídicos-símile (Indapamida ou Clortalidona) em detrimento da Hidroclorotiazida comum, baseada em maior meia-vida e redução consistente de desfechos cardiovasculares."
---

# Diretriz Clínica Governamental: Hipertensão Arterial no Adulto (NICE NG136)

## 1. Identificação e Metadados da Fonte Oficial
* **Agência Emissora:** National Institute for Health and Care Excellence (NICE) - National Health Service (NHS), Reino Unido.
* **Código de Referência:** NICE Guideline NG136 (atualização 2026).
* **Link Oficial:** [https://www.nice.org.uk/guidance/ng136](https://www.nice.org.uk/guidance/ng136)
* **Público-alvo:** Médicos de atenção primária (GPs), cardiologistas, enfermeiros de prática avançada e equipes multiprofissionais.

---

## 2. Critérios Diagnósticos e Classificação Oficial (NICE)

### Rastreio e Confirmação Ambulatorial
* **Aferição em Consultório:** Realizar em ambos os braços na primeira avaliação; considerar o braço com maior valor. Se $\text{PA} \ge 140/90\text{ mmHg}$, repetir para confirmação.
* **Confirmação Mandatória:**
  * Oferecer **MAPA (Monitorização Ambulatorial da Pressão Arterial)** como exame padrão ouro.
  * Se MAPA não tolerado ou indisponível, realizar **MRPA (Monitorização Residencial da Pressão Arterial)**: 2 medidas com intervalo de 1 minuto, 2 vezes ao dia (manhã e noite), durante 7 dias (descartar o dia 1 e calcular a média dos dias restantes).

### Estadiamento Clínico (Consultório vs. MAPA/MRPA):
1. **Estágio 1:**
   * Consultório: $140/90\text{ mmHg}$ a $159/99\text{ mmHg}$ **E**
   * MAPA/MRPA diurno: $135/85\text{ mmHg}$ a $149/94\text{ mmHg}$.
2. **Estágio 2:**
   * Consultório: $\ge 160/100\text{ mmHg}$ **E**
   * MAPA/MRPA diurno: $\ge 150/95\text{ mmHg}$.
3. **Hipertensão Severa (Estágio 3):**
   * Consultório: Pressão Arterial Sistólica (PAS) $\ge 180\text{ mmHg}$ ou Pressão Arterial Diastólica (PAD) $\ge 120\text{ mmHg}$. Avaliar imediatamente lesão aguda de órgão-alvo ou emergência hipertensiva.

---

## 3. Escalonamento Terapêutico (NICE Stepwise Approach)

### Metas Pressóricas Alvo:
* **Idade < 80 anos:** Consultório $< 140/90\text{ mmHg}$ (MAPA/MRPA $< 135/85\text{ mmHg}$).
* **Idade $\ge 80$ anos:** Consultório $< 150/90\text{ mmHg}$ (MAPA/MRPA $< 145/85\text{ mmHg}$).

### Algoritmo Farmacológico:

#### Step 1 (Monoterapia de 1ª Linha):
* **Idade < 55 anos E não-negro:**
  * Iniciar com **Inibidor da ECA (IECA)** (ex: Ramipril 2,5 a 10 mg/dia ou Enalapril 10 a 40 mg/dia) ou **Bloqueador dos Receptores de Angiotensina (BRA)** (ex: Losartana 50 a 100 mg/dia ou Candesartana 8 a 32 mg/dia).
* **Idade $\ge 55$ anos OU qualquer idade com ascendência africana ou caribenha:**
  * Iniciar com **Bloqueador do Canal de Cálcio (BCC)** (ex: Besilato de Anlodipino 5 a 10 mg 1x/dia). Se BCC contraindicado ou não tolerado (edema severo), utilizar diurético tiazídico-símile (Indapamida 1,5 mg liberação sustentada ou 2,5 mg 1x/dia pela manhã).

#### Step 2 (Combinação Dupla):
* Adicionar o fármaco complementar:
  * Se usava IECA/BRA: associar **BCC** (IECA/BRA + BCC).
  * Se não tolera BCC: associar **Diurético Tiazídico-Símile** (Indapamida 1,5 mg/2,5 mg ou Clortalidona 12,5 a 25 mg/dia).
  * Para pacientes negros com intolerância ao BRA inicial: BCC + Tiazídico-símile.

#### Step 3 (Combinação Tripla):
* Associação em doses otimizadas das 3 classes fundamentais:
  * **[IECA ou BRA] + [BCC] + [Diurético Tiazídico-Símile]**.

#### Step 4 (Hipertensão Resistente):
* Confirmar adesão e descartar efeito do avental branco (MAPA/MRPA).
* Avaliar nível sérico de Potássio ($\text{K}^+$):
  * **Se $\text{K}^+ \le 4,5\text{ mEq/L}$:** Adicionar **Espironolactona** na dose de $25\text{ mg/dia}$ (monitorar função renal e calemia em 2 a 4 semanas).
  * **Se $\text{K}^+ > 4,5\text{ mEq/L}$:** Adicionar **Alfa-bloqueador** (Doxazosina 4 a 8 mg/dia) ou **Beta-bloqueador** (Bisoprolol 5 a 10 mg/dia, Atenolol ou Carvedilol).
  * Encaminhar para centro especializado em nefrologia ou hipertensão arterial refratária.

---

## 4. Análise Comparada com o SUS / Brasil

### Convergências:
* Ambas as diretrizes convergem na recomendação prioritária do tripé anti-hipertensivo (IECA/BRA + BCC + Diuréticos) para controle pressórico sustentado.
* Contraindicação formal absoluta do uso combinado de IECA + BRA pelo risco aumentado de lesão renal aguda e hipercalemia sem ganho clínico adicional.

### Divergências Práticas de Acesso e Conduta:
1. **Confirmação Diagnóstica:** Enquanto o NHS/NICE exige MAPA/MRPA sistemático para validar o diagnóstico, a rede básica do SUS frequentemente diagnostica e trata com base na média de medidas de consultório em dias separados, devido ao gargalo de agendamento de MAPA municipal.
2. **Escolha do Diurético:** O SUS disponibiliza massivamente a **Hidroclorotiazida 25 mg** na Farmácia Popular/UBS básica, enquanto o NICE expressamente desaconselha o início de hidroclorotiazida se indapamida ou clortalidona estiverem disponíveis.
3. **Abordagem Étnica Inicial:** O protocolo brasileiro (SBC 2020) permite combinação fixa dupla precoce logo no estágio 1 de alto risco cardiovascular independentemente de idade/etnia, enquanto o NICE mantém a regra etária/étnica estrita de Step 1 (BCC preferencial para $\ge 55$ anos ou negros).
