---
id_protocolo: "fda_aha_avc_trombolise_tnk"
titulo: "AVC Isquêmico Agudo: Trombólise Intravenosa com Tenecteplase (TNK em Bólus) e Alteplase"
pais: "Estados Unidos"
agencia: "FDA / AHA / ASA (American Heart Association / American Stroke Association)"
codigo_diretriz: "2026 AHA/ASA Guidelines for the Early Management of Acute Ischemic Stroke"
url_fonte: "https://www.ahajournals.org/journal/str"
data_publicacao: "2026-01-26"
data_revisao: "2026-01-26"
idioma_original: "en-US"
cids_relacionados: ["I63", "I63.0", "I63.9", "I64"]
ciaps_relacionados: ["K90"]
categoria: "neurologia_urgencia"
nivel_atencao: "Atencao_Terciaria_Hospitalar"
status_revisao_clinica: "documento_oficial_governamental"

# Mapeamento com o SUS / Brasil
equivalente_sus_id: ""
tem_equivalente_sus: false
disponibilidade_farmacos_rename_sus: "parcial"
medicamentos_exclusivos_estrangeiros:
  - "Tenecteplase padronizada universalmente como trombolítico Classe I em pronto-socorro"
  - "Software de tomografia por perfusão (CTP) automatizado via IA para AVC em janela estendida"

# Resumo executivo de divergências entre a conduta internacional e o PCDT/SUS:
divergencias_relevantes_vs_sus:
  - "A diretriz 2026 da AHA/ASA estabelece equiparação Classe I entre Tenecteplase (TNK em bólus IV único de 5 a 10 segundos) e Alteplase (infusão de 60 minutos em bomba) na janela de até 4,5 horas."
  - "A simplicidade logística do bólus único de Tenecteplase revolucionou o modelo de transferência inter-hospitalar (*drip-and-ship*) para centros com hemodinâmica e trombectomia mecânica, reduzindo significativamente o atraso agulha-punção arterial."
  - "No SUS brasileiro, a Alteplase 0,9 mg/kg ainda é o padrão hegemônico da maioria das Unidades de AVC habilitadas pelo Ministério da Saúde, estando a Tenecteplase em expansão e implantação gradual em serviços de emergência e SAMU."
---

# Diretriz Clínica Governamental: AVC Isquêmico Agudo (AHA / ASA / FDA 2026)

## 1. Identificação e Metadados da Fonte Oficial
* **Agências Emissoras:** American Heart Association (AHA) e American Stroke Association (ASA) em conformidade com as aprovações do Food and Drug Administration (FDA) - Estados Unidos.
* **Referência Oficial:** *2026 Guideline for the Early Management of Patients With Acute Ischemic Stroke* (Stroke 2026;57:e1-Exxx).
* **Link Oficial:** [https://www.ahajournals.org/journal/str](https://www.ahajournals.org/journal/str)
* **Público-alvo:** Médicos emergencistas, neurologistas vasculares, intensivistas e equipes de resgate pré-hospitalar.

---

## 2. Critérios de Elegibilidade e Janelas de Tempo

### Janela Terapêutica Convencional (0 a 4,5 horas):
* Início dos sintomas ou último momento em que o paciente foi visto sem déficits (*last known well*) **$< 4,5\text{ horas}$**.
* Idade $\ge 18$ anos com déficit neurológico mensurável e potencialmente incapacitante (escore NIHSS ou perda funcional relevante como afasia, hemianopsia, paralisia de membro).
* **Tomografia de Crânio Não Contrastada (TC):** Excluir obrigatoriamente hemorragia intracraniana (HIC) ou hipodensidade precoce extensa do território da artéria cerebral média ($> 1/3$ do hemisfério / ASPECTS $< 6$).

### Janela Estendida (4,5 a 9 horas ou AVC do Despertar / *Wake-up Stroke*):
* Elegibilidade confirmada por neuroimagem avançada:
  * Tomografia com Perfusão (CTP) demonstrando mismatch significativo entre o núcleo isquêmico infartado (*core*) e a área de penumbra isquêmica recuperável; **OU**
  * Ressonância Magnética com *mismatch DWI-FLAIR* (lesão hiperintensa evidente em difusão DWI, porém sem hiperintensidade correspondente no FLAIR, indicando AVC com tempo real de evolução $< 4,5\text{ horas}$).

### Critérios de Exclusão Críticos para Trombólise:
1. Hemorragia intracraniana em TC basal;
2. Pressão Arterial persistente $\ge 185/110\text{ mmHg}$ refratária a anti-hipertensivos parenterais imediatos (Labetalol ou Nitroprussiato de Sódio);
3. Plaquetometria $< 100.000/\text{mm}^3$;
4. Uso de anticoagulante oral direto (DOAC: Rivaroxabana, Apixabana, Dabigatrana) nas últimas 48 horas (exceto se testes laboratoriais específicos normais ou reversor disponível);
5. Uso de Heparina nas últimas 24 horas com TTPa alargado, ou INR $> 1,7$ em uso de Varfarina;
6. Traumatismo cranioencefálico grave ou cirurgia intracraniana/espinhal nos últimos 3 meses.

---

## 3. Posologias e Esquemas Trombólicos (Tenecteplase vs. Alteplase)

### Opção 1: Tenecteplase (TNK-tPA) - Padrão Ouro de Agilidade Logística
* **Posologia Oficial:** **$0,25\text{ mg/kg}$ por via intravenosa administrada em bólus único rápido durante 5 a 10 segundos** (dose máxima de **$25\text{ mg}$**, equivalente a $5\text{ mL}$ da solução reconstituída).
* **Vantagens Operacionais Comprovadas:**
  * Dispensa o uso de bomba de infusão contínua;
  * Permite infusão imediata na sala de tomografia;
  * Não há risco de extravasamento, interrupção acidental ou perda de bomba durante a ambulância no transporte para trombectomia mecânica inter-hospitalar.

### Opção 2: Alteplase (rt-PA) - Esquema Clássico
* **Posologia Oficial:** **$0,9\text{ mg/kg}$ por via intravenosa** (dose máxima de **$90\text{ mg}$**):
  * **$10\%$ da dose total** administrada em bólus IV direto durante 1 minuto;
  * **$90\%$ restantes** infundidos em bomba de infusão contínua durante exatamente 60 minutos.

### Monitoramento Pós-Trombólise e Controle Hemodinâmico:
* **Alvo de Pressão Arterial:** Manter rigorosamente $\text{PA} < 180/105\text{ mmHg}$ durante e nas primeiras 24 horas após o trombolítico para prevenir transformação hemorrágica sintomática.
* **Proibição de Antiagregantes:** Não administrar AAS, Clopidogrel ou Heparina nas primeiras 24 horas pós-trombólise; realizar TC de crânio de controle em 24h antes de autorizar início de antiagregação plaquetária secundária.

---

## 4. Análise Comparada com o SUS / Brasil

### Convergências:
* Tanto a Linha de Cuidado do AVC do Ministério da Saúde do Brasil quanto a AHA/ASA preconizam o atendimento ultra-rápido (*tempo porta-agulha* $< 45\text{--}60$ minutos) e a trombectomia mecânica para oclusão de grandes vasos da circulação anterior até 24 horas com critérios de imagem favoráveis.

### Divergências Relevantes de Gestão e Acesso:
1. **Predomínio da Alteplase no SUS:** No Brasil, a grande maioria dos leitos de AVC credenciados ainda emprega exclusivamente a Alteplase 0,9 mg/kg fornecida pelo Ministério da Saúde. A Tenecteplase, embora recentemente avaliada pela Conitec e implementada em alguns serviços avançados do SAMU (como SAMU Metropolitano e capitais pioneiras), ainda não alcançou a substituição plena nacionalmente.
2. **Infraestrutura Pré-Hospitalar (Mobile Stroke Units):** Nos grandes centros norte-americanos, a trombólise com TNK ocorre frequentemente dentro de tomógrafos móveis embarcados em ambulâncias (*Mobile Stroke Units*). No Brasil, o transporte até o hospital terciário ainda representa o maior fator limitador de perda de janela de 4,5 horas.
3. **Softwares de Inteligência Artificial para Perfusão:** A diretriz americana baseia a janela tardia no uso disseminado de softwares automáticos (como RAPID AI), enquanto nos hospitais públicos brasileiros o laudo radiológico de penumbra depende preponderantemente da disponibilidade de neurorradiologista presencial ou sobreaviso.
