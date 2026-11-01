// ARQUIVO GERADO por etl_pipeline/cadastrar_protocolos_internacionais.py - NÃO EDITAR MANUALMENTE.
import { ProtocoloClinico } from '../types';

export const PROTOCOLOS_INTERNACIONAIS_GERADOS: ProtocoloClinico[] = [
  {
    "id_protocolo": "cdc_idsa_doenca_de_lyme",
    "titulo": "Doença de Lyme (Boreliose): Profilaxia Pós-Exposição, Diagnóstico e Tratamento Antimicrobiano",
    "cids_relacionados": [
      "A69.2",
      "A69.20",
      "A69.29"
    ],
    "ciaps_relacionados": [
      "A78"
    ],
    "categoria": "infectologia_zoonoses",
    "nivel_atencao": "Atencao_Primaria_e_Especializada",
    "data_revisao": "2024-05-01",
    "status_revisao_clinica": "documento_oficial_governamental",
    "conteudo_markdown": "# Diretriz Clínica Governamental: Doença de Lyme (CDC / IDSA Guidelines)\n\n## 1. Identificação e Metadados da Fonte Oficial\n* **Agências Emissoras:** Centers for Disease Control and Prevention (CDC) em conjunto com a Infectious Diseases Society of America (IDSA), American Academy of Neurology (AAN) e American College of Rheumatology (ACR).\n* **Referência Oficial:** *Clinical Practice Guidelines for the Prevention, Diagnosis and Treatment of Lyme Disease* (Clin Infect Dis. 2021; 72(1):e1-e48).\n* **Link Oficial:** [https://www.cdc.gov/lyme/hcp/clinical-care/index.html](https://www.cdc.gov/lyme/hcp/clinical-care/index.html)\n* **Público-alvo:** Médicos de atenção primária, infectologistas, dermatologistas, neurologistas e reumatologistas.\n\n---\n\n## 2. Profilaxia e Manifestações Clínicas Oficiais\n\n### Profilaxia Pós-Picada de Carrapato (Indicação Restrita):\nPrescrever profilaxia antimicrobiana **apenas** quando **TODOS** os seguintes critérios forem preenchidos:\n1. O carrapato removido for confiavelmente identificado como ninfa ou adulto de *Ixodes scapularis* ou *Ixodes pacificus*;\n2. O carrapato esteve fixado por um período estimado $\\ge 36\\text{ horas}$ (ingurgitamento evidente);\n3. A profilaxia pode ser iniciada em até **72 horas** após a remoção do vetor;\n4. A pessoa esteve em área altamente endêmica de Lyme (taxa local de infecção em carrapatos $\\ge 20\\%$).\n* **Regime Profilático:** **Doxiciclina $200\\text{ mg}$ em dose única oral** (para adultos e crianças de qualquer idade em dose de $4,4\\text{ mg/kg}$ até o teto de $200\\text{ mg}$). Se contraindicação ou não preenchimento dos critérios: apenas observação clínica vigilante por 30 dias.\n\n### Estágios Clínicos e Diagnóstico:\n1. **Fase Inicial Localizada (Eritema Migratório):**\n   * Placa eritematosa expansiva ($\\ge 5\\text{ cm}$ de diâmetro), que surge 3 a 30 dias após a picada, frequentemente com clareamento central (*lesão em alvo* ou *bull's-eye*).\n   * **Conduta Diagnóstica:** Diagnóstico **puramente clínico**. Não solicitar sorologia (sensibilidade na fase de eritema migratório é $< 40\\%$). Iniciar tratamento imediatamente.\n2. **Fase Inicial Disseminada:**\n   * Múltiplas lesões secundárias de eritema migratório, febre, mal-estar, cefaleia, paralisia do nervo facial (paralisia de Bell uni ou bilateral), meningite asséptica ou cardite com bloqueio atrioventricular (BAV).\n3. **Fase Tardia:**\n   * Monoartrite ou oligoartrite inflamatória de grandes articulações (joelho mais comum) com grande derrame articular e dor moderada.\n   * **Diagnóstico Sorológico de Fase Tardia (Sorologia em 2 Níveis / MTTT):** Primeiro ensaio imunoenzimático (ELISA/EIA) de alta sensibilidade; se reagente ou indeterminado, realizar segundo ensaio ou Western Blot (critérios estritos de bandas IgM e IgG do CDC).\n\n---\n\n## 3. Escalonamento Farmacológico Padronizado (IDSA / CDC)\n\n### A. Eritema Migratório / Lyme Precoce Localizado:\n* **1ª Linha Preferencial (Adultos e Crianças de qualquer idade):**\n  * **Doxiciclina $100\\text{ mg}$ por via oral 2 vezes ao dia durante 10 dias** (ou $4,4\\text{ mg/kg/dia}$ dividido em 2 tomadas para crianças $< 45\\text{ kg}$).\n  * *Nota de segurança pediátrica:* Estudos do CDC e AAP comprovaram a segurança de cursos curtos ($\\le 21$ dias) de doxiciclina em crianças $< 8$ anos sem evidência de manchamento dental.\n* **Alternativas:**\n  * **Amoxicilina $500\\text{ mg}$ por via oral 3 vezes ao dia durante 14 dias** ($50\\text{ mg/kg/dia}$ em 3 tomadas para crianças); **OU**\n  * **Cefuroxima axetil $500\\text{ mg}$ por via oral 2 vezes ao dia durante 14 dias**.\n  * Se alergia grave a beta-lactâmicos e contraindicação a tetraciclina: Azitromicina $500\\text{ mg}$ no dia 1 e $250\\text{ mg}$ nos dias 2 a 7 (menor eficácia, reservar para exceções).\n\n### B. Manifestações Neurológicas (Paralisia Facial de Bell e Meningorradiculite):\n* **Paralisia Facial Isolada por Lyme:** Doxiciclina $100\\text{ mg}$ VO 2x/dia durante 14 a 21 dias (corticosteroides não são rotineiramente recomendados).\n* **Meningite por Lyme ou Radiculoneuropatia (Síndrome de Bannwarth):**\n  * **Ceftriaxona $2\\text{ g}$ por via intravenosa (IV) 1 vez ao dia durante 14 a 21 dias**; alternativamente Doxiciclina oral $100\\text{ a }200\\text{ mg}$ 2x/dia por 14 a 21 dias se tolerância oral preservada.\n\n### C. Artrite de Lyme:\n* Doxiciclina oral $100\\text{ mg}$ 2x/dia por **28 dias** (ou Amoxicilina $500\\text{ mg}$ 3x/dia por 28 dias).\n\n### Posição Governamental Sobre \"Lyme Crônico\":\n* O CDC e a IDSA **condenam veementemente antibioticoterapia prolongada por meses ou anos** em pacientes com fadiga inespecífica pós-tratamento (*Post-Treatment Lyme Disease Syndrome* - PTLDS). Múltiplos ensaios clínicos randomizados demonstraram ausência de eficácia com graves riscos de bacteremia por cateter e sepse por infecções hospitalares secundárias.\n\n---\n\n## 4. Análise Comparada com o SUS / Brasil\n\n### Contexto Epidemiológico e Clínico Brasileiro:\n* A Doença de Lyme clássica transmitida pelo *Ixodes scapularis* infectado pela *Borrelia burgdorferi* sensu stricto não ocorre de forma autóctone no Brasil.\n* Em território brasileiro, descreve-se uma condição correlata denominada **Síndrome de Baggio-Yoshinari (SBY)** ou \"Lyme-símile brasileira\", provocada por espiroquetas atípicas transmitidas por carrapatos de gêneros nativos (*Amblyomma cajennense* / carrapato-estrela ou *Rhipicephalus*).\n* Não há Protocolo Clínico e Diretrizes Terapêuticas (PCDT) homologado pelo Ministério da Saúde para Síndrome de Baggio-Yoshinari, orientando-se o uso empírico de Doxiciclina baseado nas diretrizes do CDC.\n* **Viajantes Internacionais no Brasil:** Médicos brasileiros do SUS e de serviços de emergência frequentemente atendem turistas estrangeiros ou viajantes brasileiros retornando de áreas endêmicas dos EUA (Nordeste e Centro-Oeste americano) ou Europa com lesões de eritema migratório e febre, situação na qual o protocolo do CDC/IDSA fornece a base técnica insubstituível para prescrição rápida de Doxiciclina e profilaxia de sequelas articulares e neurológicas graves.",
    "bloco_prescricao_copiavel": "",
    "jurisdicao": "US_CDC_FDA",
    "pais": "Estados Unidos",
    "agencia": "CDC / IDSA / AAN / ACR (Estados Unidos)",
    "codigo_diretriz": "Clinical Practice Guidelines by IDSA, AAN, and ACR 2020 / CDC Guidelines",
    "url_fonte": "https://www.cdc.gov/lyme/hcp/clinical-care/index.html",
    "data_publicacao": "2020-11-30",
    "idioma_original": "en-US",
    "equivalente_sus_id": "",
    "tem_equivalente_sus": false,
    "disponibilidade_farmacos_rename_sus": "parcial",
    "medicamentos_exclusivos_estrangeiros": [
      "Cefuroxima axetil de uso rotineiro em cuidados primários",
      "Testes sorológicos imunoenzimáticos automatizados de dois níveis (MTTT aprovados pelo FDA)"
    ],
    "divergencias_relevantes_vs_sus": [
      "Inexistência de protocolo clínico PCDT formal no SUS para Doença de Lyme clássica (*Borrelia burgdorferi* sensu stricto), uma vez que a infecção é hiperendêmica na América do Norte e Europa temperada, existindo no Brasil apenas uma variante sindrômica atípica rara (Síndrome de Baggio-Yoshinari).",
      "Definição de profilaxia antimicrobiana pós-picada: dose única de Doxiciclina 200 mg dentro de 72 horas após a remoção de carrapato *Ixodes* ingurgitado em áreas de alta transmissão.",
      "O Eritema Migratório é um diagnóstico puramente dermatológico e clínico: a solicitação de sorologia na fase aguda de lesão cutânea é expressamente desaconselhada pelo CDC devido à alta taxa de falso-negativo por soroconversão tardia."
    ]
  },
  {
    "id_protocolo": "cdc_ntca_tuberculose_latente_3hp",
    "titulo": "Infecção Latente por Tuberculose (ILTB): Esquemas Encurtados 3HP (Rifapentina + Isoniazida) e 4R",
    "cids_relacionados": [
      "Z22.7",
      "R76.1",
      "A15",
      "A16"
    ],
    "ciaps_relacionados": [
      "A70"
    ],
    "categoria": "infectologia_respiratoria",
    "nivel_atencao": "Atencao_Primaria_e_Especializada",
    "data_revisao": "2024-03-12",
    "status_revisao_clinica": "documento_oficial_governamental",
    "conteudo_markdown": "# Diretriz Clínica Governamental: Tratamento da Tuberculose Latente (CDC / NTCA Guidelines)\n\n## 1. Identificação e Metadados da Fonte Oficial\n* **Agências Emissoras:** Centers for Disease Control and Prevention (CDC) e National Tuberculosis Controllers Association (NTCA) - Estados Unidos.\n* **Referência Oficial:** *Guidelines for the Treatment of Latent Tuberculosis Infection: Recommendations from NTCA and CDC* (MMWR Recomm Rep 2020;69(No. RR-1):1–11).\n* **Link Oficial:** [https://www.cdc.gov/mmwr/volumes/69/rr/rr6901a1.htm](https://www.cdc.gov/mmwr/volumes/69/rr/rr6901a1.htm)\n* **Público-alvo:** Médicos de atenção primária, tisiologistas, pneumologistas, infectologistas e coordenadores de programas de controle da tuberculose.\n\n---\n\n## 2. Rastreio Diagnóstico e Exclusão de Doença Ativa\n\n### Métodos de Triagem de ILTB:\n1. **Ensaios de Liberação de Interferon-Gama (IGRA):**\n   * *QuantiFERON-TB Gold Plus* ou *T-SPOT.TB*.\n   * **Método de escolha preferencial do CDC** para indivíduos com idade $\\ge 2$ anos que receberam vacinação prévia com BCG, evitando reações falso-positivas decorrentes da imunização infantil.\n2. **Teste Tuberculínico Cutâneo (TST / PPD de Mantoux):**\n   * Alternativa válida em crianças $< 2$ anos ou quando IGRA indisponível. Pontos de corte de induração: $\\ge 5\\text{ mm}$ (imunossuprimidos, PVHIV, contatos domiciliares de TB ativa); $\\ge 10\\text{ mm}$ (imigrantes recentes de países de alta carga, profissionais de saúde); $\\ge 15\\text{ mm}$ (população geral de baixo risco).\n\n### Regra Mandatória de Segurança:\n* **Exclusão Absoluta de Tuberculose Ativa:** Antes de iniciar qualquer regime para ILTB, o paciente deve obrigatoriamente realizar avaliação clínica de sintomas sistêmicos (tosse $\\ge 2$ semanas, febre vespertina, sudorese noturna, emagrecimento) e **Radiografia de Tórax**. Se houver qualquer suspeita radiológica ou sintomática, coletar baciloscoia/TRM-TB/cultura de escarro e tratar como tuberculose ativa com esquema RIPE quádruplo, a fim de evitar a seleção de cepas multidroga-resistentes.\n\n---\n\n## 3. Esquemas Terapêuticos Preferenciais (CDC / NTCA)\n\n### 1ª Escolha: Esquema 3HP (Rifapentina + Isoniazida Semanal por 12 Semanas)\nRegime com maior taxa de completude terapêutica ($> 85\\text{ a }90\\%$) e menor perfil hepatotóxico:\n* **Duração:** 3 meses (exatamente **12 doses semanais**). Pode ser administrado por tratamento diretamente observado (TDO) ou autoadministrado monitorado.\n* **Posologia em Adultos e Crianças $\\ge 12$ anos:**\n  * **Isoniazida (INH):** $15\\text{ mg/kg}$ por via oral (dose máxima: $900\\text{ mg}$ 1 vez por semana); **E**\n  * **Rifapentina (RPT):** Dose fixa baseada em faixas de peso corporal:\n    * $32,1\\text{ a }45,0\\text{ kg}$: $750\\text{ mg}$ 1 vez por semana.\n    * $> 45,0\\text{ kg}$: $900\\text{ mg}$ 1 vez por semana.\n  * **Vitamina B6 (Piridoxina):** $25\\text{ a }50\\text{ mg}$ VO semanalmente para profilaxia de neuropatia periférica em diabéticos, gestantes, etilistas ou desnutridos.\n\n### 2ª Escolha: Esquema 4R (Rifampicina Diária por 4 Meses)\n* **Duração:** 4 meses de tomada diária contínua (**120 doses diárias**).\n* **Posologia:**\n  * **Rifampicina (RIF):** $10\\text{ mg/kg}$ por via oral 1 vez ao dia em jejum (dose máxima: $600\\text{ mg/dia}$ no adulto; $15\\text{ a }20\\text{ mg/kg/dia}$ na criança).\n  * Excelente alternativa se intolerância gástrica à Isoniazida ou quando o paciente não puder realizar o esquema semanal 3HP.\n\n### 3ª Escolha: Esquema 3HR (Isoniazida + Rifampicina Diária por 3 Meses)\n* Tomada diária combinada por 3 meses (90 doses).\n\n### Esquemas Alternativos Monoterápicos (Apenas se Contraindicação Absoluta a Rifamicinas):\n* **6H ou 9H (Isoniazida diária por 6 ou 9 meses):**\n  * Isoniazida $300\\text{ mg/dia}$ VO por 180 a 270 doses. Reservado estritamente para pessoas com interações medicamentosas graves com rifamicinas que impeçam seu uso (ex: certos esquemas antirretrovirais sem possibilidade de ajuste).\n\n---\n\n## 4. Análise Comparada com o SUS / Brasil\n\n### Convergências:\n* O Ministério da Saúde do Brasil, por meio da Conitec e das atualizações do Programa Nacional de Controle da Tuberculose (PNCT), aprovou a incorporação da Rifapentina em dose fixa combinada com Isoniazida (esquema 3HP) para o tratamento da ILTB no SUS.\n* Ambos concordam na contraindicação de esquemas com rifamicina associados a inibidores de protease no HIV ou na gestação (onde o esquema com Isoniazida 6H ou 9H suplementado com piridoxina ainda é mantido como opção preferencial).\n\n### Divergências Relevantes de Gestão e Acesso:\n1. **Disponibilidade Efetiva do 3HP na Atenção Básica:** Embora incorporado teoricamente pelo SUS, o fornecimento de Rifapentina sofre com desabastecimentos periódicos e distribuição centralizada em centros de referência em vários estados brasileiros. Como consequência, a prescrição de Isoniazida diária por 6 a 9 meses ainda é o esquema mais executado pelos médicos de UBS no Brasil.\n2. **Método Diagnóstico de Escolha (IGRA vs. PPD):** Nos EUA, o IGRA é o método dominante no sistema público e privado. No SUS, o PPD (teste tuberculínico) é o carro-chefe nas UBSs, mas enfrenta constantes crises globais de desabastecimento de derivado proteico purificado, gerando atrasos graves na quimioprofilaxia de contatos de pacientes bacilíferos.",
    "bloco_prescricao_copiavel": "",
    "jurisdicao": "US_CDC_FDA",
    "pais": "Estados Unidos",
    "agencia": "CDC / NTCA (National Tuberculosis Controllers Association)",
    "codigo_diretriz": "CDC MMWR Recommendations and Reports (Vol 69 / RR-1)",
    "url_fonte": "https://www.cdc.gov/mmwr/volumes/69/rr/rr6901a1.htm",
    "data_publicacao": "2020-02-14",
    "idioma_original": "en-US",
    "equivalente_sus_id": "",
    "tem_equivalente_sus": false,
    "disponibilidade_farmacos_rename_sus": "parcial",
    "medicamentos_exclusivos_estrangeiros": [
      "Rifapentina em blíster individual para dose supervisionada semanal",
      "Testes de IGRA (QuantiFERON-TB / T-SPOT.TB) universais na rede pública"
    ],
    "divergencias_relevantes_vs_sus": [
      "CDC e NTCA posicionam esquemas ultracurtos baseados em rifamicinas (3HP: 12 doses semanais de Rifapentina + Isoniazida; e 4R: 4 meses de Rifampicina diária) como 1ª linha prioritária estrita, em detrimento do antigo esquema de 9 meses de Isoniazida diária.",
      "A monoterapia com Isoniazida (6H ou 9H) foi rebaixada a esquema de exceção devido à elevada taxa de abandono do tratamento e risco 3 a 5 vezes maior de hepatotoxicidade medicamentosa severa.",
      "Nos Estados Unidos, o teste de liberação de interferon-gama (IGRA) é o método preferencial para quem recebeu vacina BCG; no SUS brasileiro, a Prova Tuberculínica (PPD) por método de Mantoux ainda é a ferramenta mais comumente ofertada nas unidades de saúde."
    ]
  },
  {
    "id_protocolo": "cdc_sti_gonorreia_clamidia_2021",
    "titulo": "Infecções Gonocócicas e por Clamídia: Ceftriaxona 500 mg e Transição para Doxiciclina",
    "cids_relacionados": [
      "A54",
      "A54.0",
      "A56",
      "A56.0",
      "A56.2"
    ],
    "ciaps_relacionados": [
      "U72",
      "X90",
      "Y71"
    ],
    "categoria": "infectologia_ist",
    "nivel_atencao": "Atencao_Primaria_e_Urgencia",
    "data_revisao": "2024-05-18",
    "status_revisao_clinica": "documento_oficial_governamental",
    "conteudo_markdown": "# Diretriz Clínica Governamental: Gonorreia e Clamídia (CDC STI Guidelines 2021)\n\n## 1. Identificação e Metadados da Fonte Oficial\n* **Agência Emissora:** Centers for Disease Control and Prevention (CDC) - Department of Health and Human Services (HHS), Estados Unidos.\n* **Código de Referência:** CDC STI Treatment Guidelines 2021 (Revisão continuada de vigilância antimicrobiana).\n* **Link Oficial:** [https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm](https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm)\n* **Público-alvo:** Médicos generalistas, urologistas, ginecologistas, infectologistas e emergencistas.\n\n---\n\n## 2. Diagnóstico Molecular e Apresentação Clínica\n\n### Métodos Diagnósticos Padrão Ouro:\n* **Testes de Amplificação de Ácidos Nucleicos (NAAT):** Teste de escolha para detecção de *Neisseria gonorrhoeae* e *Chlamydia trachomatis*. Amostras validadas: urina de primeiro jato (homens), swab vaginal autocoletado ou endocervical (mulheres), e swabs extragenitais (faríngeo e retal para populações expostas).\n* **Bacterioscopia por Gram (em corrimento uretral masculino):** Diplococos gram-negativos intracelulares em neutrófilos conferem sensibilidade $> 95\\%$ para gonorreia uretral.\n\n---\n\n## 3. Esquemas Terapêuticos Padronizados (CDC 2021 Update)\n\n### A. Infecção Gonocócica Não Complicada (Uretra, Colo do Útero ou Reto):\n* **Esquema de 1ª Linha (Monoterapia Otimizada):**\n  * **Ceftriaxona $500\\text{ mg}$ por via intramuscular (IM) em dose única** (para pacientes com peso corporal $< 150\\text{ kg}$).\n  * *Ajuste para obesidade:* Se peso $\\ge 150\\text{ kg}$, administrar **Ceftriaxona $1\\text{ g}$ IM em dose única**.\n* **Conduta para Clamídia Concomitante:**\n  * Se a infecção por *Chlamydia trachomatis* não tiver sido formalmente excluída por NAAT, **adicionar Doxiciclina $100\\text{ mg}$ por via oral 2 vezes ao dia durante 7 dias**.\n* **Se Alergia Grave à Cefalosporina / Anafilaxia a Beta-lactâmicos:**\n  * Gentamicina $240\\text{ mg}$ IM dose única **+** Azitromicina $2\\text{ g}$ por via oral em dose única.\n\n### B. Infecção Faríngea por Gonococo:\n* A faringe constitui um reservatório de difícil erradicação: administrar **Ceftriaxona $500\\text{ mg}$ IM dose única** (ou $1\\text{ g}$ se $\\ge 150\\text{ kg}$). Realizar teste de cura com NAAT ou cultura em 14 dias se persistência sintomática ou uso de esquema alternativo.\n\n### C. Infecção por *Chlamydia trachomatis* (Urogenital ou Retal):\n* **1ª Linha Preferencial (Adultos e Adolescentes Não Gestantes):**\n  * **Doxiciclina $100\\text{ mg}$ por via oral 2 vezes ao dia durante 7 dias**.\n* **2ª Linha (Alternativa se intolerância ou não adesão previsível a 7 dias):**\n  * **Azitromicina $1\\text{ g}$ por via oral em dose única**; **OU**\n  * Levofloxacino $500\\text{ mg}$ por via oral 1 vez ao dia durante 7 dias.\n* **Manejo na Gestante:**\n  * **Azitromicina $1\\text{ g}$ por via oral em dose única** (a Doxiciclina é contraindicada na gravidez por risco de hipoplasia de esmalte e pigmentação dentária fetal). Alternativa: Amoxicilina $500\\text{ mg}$ 3x/dia durante 7 dias.\n\n---\n\n## 4. Análise Comparada com o SUS / Brasil\n\n### Convergências:\n* Ambas as diretrizes já eliminaram definitivamente as quinolonas (Ciprofloxacino) do tratamento empírico da gonorreia devido a taxas globais de resistência bacteriana superiores a 60-70%.\n* Reconhecimento da Ceftriaxona como o último agente beta-lactâmico monoterápico amplamente eficaz contra a *Neisseria gonorrhoeae*.\n\n### Divergências Relevantes de Gestão e Acesso:\n1. **Dose Única vs. Curso de 7 Dias para Clamídia:** No SUS, a abordagem sindrômica para corrimento uretral preconiza Ceftriaxona 500 mg IM + Azitromicina 1 g oral dose única em tomada diretamente observada na UBS, garantindo adesão imediata em populações em situação de vulnerabilidade. O CDC abandonou essa combinação compulsória para evitar induzir resistência de macrolídeos no *Mycoplasma genitalium*.\n2. **Disponibilidade de Testes Moleculares (NAAT):** Nos Estados Unidos, o NAAT molecular urogenital e extragenital é o padrão de rotina na atenção primária. No SUS, a ampla maioria das unidades básicas ainda depende exclusivamente do manejo sindrômico visual e da bacterioscopia rápida, sem acesso rotineiro a NAAT multiplex.",
    "bloco_prescricao_copiavel": "",
    "jurisdicao": "US_CDC_FDA",
    "pais": "Estados Unidos",
    "agencia": "CDC (Centers for Disease Control and Prevention)",
    "codigo_diretriz": "CDC STI Treatment Guidelines 2021 (MMWR Vol 70 / No 4)",
    "url_fonte": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm",
    "data_publicacao": "2021-07-23",
    "idioma_original": "en-US",
    "equivalente_sus_id": "uretrite_gonococica_clamidia",
    "tem_equivalente_sus": true,
    "disponibilidade_farmacos_rename_sus": "total",
    "medicamentos_exclusivos_estrangeiros": [],
    "divergencias_relevantes_vs_sus": [
      "CDC elevou a dose padrão de Ceftriaxona de 250 mg para 500 mg IM dose única (e 1 g se peso >= 150 kg) em monoterapia para Neisseria gonorrhoeae não complicada, eliminando a prescrição compulsória associada de Azitromicina para diminuir a pressão de resistência.",
      "Para Chlamydia trachomatis, o CDC estabeleceu a Doxiciclina (100 mg 2x/dia por 7 dias) como primeira escolha estrita em substituição à Azitromicina 1 g dose única, devido à maior eficácia microbiológica na mucosa retal e prevenção de resistência no Mycoplasma genitalium.",
      "No SUS, a abordagem sindrômica brasileira ainda utiliza a Azitromicina 1 g oral dose única combinada com Ceftriaxona 500 mg para assegurar adesão imediata em populações vulneráveis na atenção primária."
    ]
  },
  {
    "id_protocolo": "cdc_sti_sifilis_2021",
    "titulo": "Sífilis Adquirida (Primária, Secundária e Latente): Algoritmo Reverso e Esquemas Terapêuticos",
    "cids_relacionados": [
      "A51",
      "A51.0",
      "A51.3",
      "A52",
      "A52.9",
      "A53",
      "A53.0"
    ],
    "ciaps_relacionados": [
      "Y70",
      "X70"
    ],
    "categoria": "infectologia_ist",
    "nivel_atencao": "Atencao_Primaria_e_Especializada",
    "data_revisao": "2024-06-04",
    "status_revisao_clinica": "documento_oficial_governamental",
    "conteudo_markdown": "# Diretriz Clínica Governamental: Sífilis Adquirida (CDC STI Guidelines 2021)\n\n## 1. Identificação e Metadados da Fonte Oficial\n* **Agência Emissora:** Centers for Disease Control and Prevention (CDC) - Department of Health and Human Services (HHS), Estados Unidos.\n* **Código de Referência:** MMWR Recommendations and Reports (Vol. 70 / No. 4).\n* **Link Oficial:** [https://www.cdc.gov/std/treatment-guidelines/syphilis.htm](https://www.cdc.gov/std/treatment-guidelines/syphilis.htm)\n* **Público-alvo:** Médicos de atenção primária, infectologistas, ginecologistas, urologistas e equipes de controle de infecções sexualmente transmissíveis.\n\n---\n\n## 2. Diagnóstico Sorológico e Estadiamento Clínico\n\n### Algoritmos Diagnósticos Oficiais (CDC):\n1. **Algoritmo Reverso (Preferido em Centros Automatizados):**\n   * Triagem com **teste treponêmico automatizado** (EIA ou CIA).\n   * Se reagente $\\rightarrow$ realizar teste **não treponêmico quantitativo** (RPR ou VDRL com titulação).\n   * Se teste não treponêmico for não reagente $\\rightarrow$ realizar um segundo teste treponêmico diferente (ex: TP-PA - *Treponema pallidum particle agglutination*) para confirmar se é cicatriz sorológica versus falso-positivo inicial.\n2. **Algoritmo Tradicional:**\n   * Teste não treponêmico (RPR/VDRL) seguido por teste confirmatório treponêmico (FTA-Abs ou teste rápido).\n\n### Estadiamento Clínico:\n* **Sífilis Primária:** Cancro duro único ou múltiplo (úlcera genital ou anal indolor, de base limpa e bordos endurecidos), frequentemente com linfoadenopatia regional indolor.\n* **Sífilis Secundária:** Disseminação hematogênica: roséola sifilítica, lesões pápulo-escamosas palmo-plantares, condiloma plano em dobras cutâneas, placas mucosas e micropoliadenopatia.\n* **Sífilis Latente Precoce:** Infecção adquirida comprovadamente nos últimos 12 meses, sem sinais ou sintomas clínicos atuais.\n* **Sífilis Latente Tardia ou Duração Indeterminada:** Infecção há mais de 12 meses ou sem datação precisa comprovada.\n\n---\n\n## 3. Esquemas Terapêuticos Padronizados (CDC)\n\n### Sífilis Primária, Secundária e Latente Precoce:\n* **Esquema Preferencial (Padrão Ouro Universal):**\n  * **Penicilina G Benzatina 2,4 milhões de Unidades Internacionais (UI)**, administrada por via **intramuscular (IM)** em dose única (aplicada como 1,2 milhão de UI em cada glúteo).\n* **Alternativa em Adultos NÃO Gestantes com Alergia Comprovada à Penicilina:**\n  * **Doxiciclina $100\\text{ mg}$ por via oral 2 vezes ao dia durante 14 dias**; **OU**\n  * Ceftriaxona $1\\text{ g}$ IM ou IV 1x/dia durante 10 a 14 dias (cautela se anafilaxia prévia a beta-lactâmicos).\n\n### Sífilis Latente Tardia ou de Duração Desconhecida:\n* **Esquema Preferencial:**\n  * **Penicilina G Benzatina 7,2 milhões de UI no total**, administrada em **3 doses de 2,4 milhões de UI IM**, com intervalo estrito de 1 semana entre as doses (dias 1, 8 e 15).\n  * *Atenção à adesão:* No caso de atraso $> 14$ dias entre as doses em não gestantes (ou $> 7$ a 9 dias em gestantes), o esquema deve ser reiniciado desde a primeira dose.\n* **Alternativa em Não Gestantes Alérgicos:**\n  * **Doxiciclina $100\\text{ mg}$ por via oral 2 vezes ao dia durante 28 dias**.\n\n### Manejo em Gestantes (Regra Estrita de Saúde Pública):\n* **Penicilina Benzatina é o ÚNICO tratamento documentado capaz de tratar a infecção materna e prevenir a sífilis congênita.**\n* Gestantes com histórico de alergia à penicilina **devem ser internadas e submetidas a protocolo de dessensibilização oral com penicilina**, seguido de imediata aplicação do esquema regular com Benzatina. É contraindicado o uso de Doxiciclina (teratogênica) ou Azitromicina (alta taxa de resistência do *T. pallidum* e barreira placentária ineficaz).\n\n---\n\n## 4. Análise Comparada com o SUS / Brasil\n\n### Convergências:\n* Tanto o PCDT de IST do Ministério da Saúde do Brasil quanto o CDC adotam exatamente a mesma posologia e fármaco prioritário: Penicilina G Benzatina 2,4 milhões UI (dose única para primária/secundária/latente precoce e 3 doses para latente tardia).\n* Ambas as diretrizes tratam a gestante com penicilina obrigatória e proíbem outros antibióticos para fins de cura fetal.\n\n### Divergências Relevantes de Gestão e Acesso:\n1. **Algoritmo de Rastreio:** O SUS adota massivamente os Testes Rápidos (TR) Treponêmicos por imunocromatografia de punção digital nas Unidades Básicas de Saúde (UBS), permitindo tratamento imediato na primeira consulta. O CDC utiliza preferencialmente o algoritmo reverso automatizado centralizado em laboratório com EIA e RPR quantitativo.\n2. **Prevenção Doxy-PEP:** O CDC incorporou orientações clínicas formais sobre Doxy-PEP para prevenção de sífilis em populações-chave nos EUA. No Brasil, o uso preventivo da Doxiciclina ainda não é protocolo ministerial da atenção básica.\n3. **Resistência a Macrolídeos:** Ambas as agências desaconselham categoricamente a Azitromicina para sífilis devido a mutações genéticas (*A2058G*) de resistência disseminadas mundialmente.",
    "bloco_prescricao_copiavel": "",
    "jurisdicao": "US_CDC_FDA",
    "pais": "Estados Unidos",
    "agencia": "CDC (Centers for Disease Control and Prevention)",
    "codigo_diretriz": "CDC STI Treatment Guidelines 2021 (MMWR Vol 70 / No 4)",
    "url_fonte": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm",
    "data_publicacao": "2021-07-23",
    "idioma_original": "en-US",
    "equivalente_sus_id": "sifilis_adquirida_primaria_secundaria",
    "tem_equivalente_sus": true,
    "disponibilidade_farmacos_rename_sus": "total",
    "medicamentos_exclusivos_estrangeiros": [],
    "divergencias_relevantes_vs_sus": [
      "CDC padroniza a triagem sorológica pelo algoritmo reverso (início por teste treponêmico automatizado imunoensaio EIA/CIA, seguido por teste não treponêmico RPR; se discordante, desempate com TP-PA), que identifica mais casos de infecção precoce ou tratada previamente.",
      "Inclusão recente de diretrizes formais para profilaxia pós-exposição com Doxiciclina (Doxy-PEP 200 mg dose única até 72h após relação desprotegida) para populações sob risco substancial nos EUA.",
      "Concordância absoluta no tratamento de gestantes: Penicilina Benzatina é o único agente eficaz contra a sífilis congênita; qualquer gestante alérgica deve ser obrigatoriamente dessensibilizada em ambiente hospitalar."
    ]
  },
  {
    "id_protocolo": "fda_aha_avc_trombolise_tnk",
    "titulo": "AVC Isquêmico Agudo: Trombólise Intravenosa com Tenecteplase (TNK em Bólus) e Alteplase",
    "cids_relacionados": [
      "I63",
      "I63.0",
      "I63.9",
      "I64"
    ],
    "ciaps_relacionados": [
      "K90"
    ],
    "categoria": "neurologia_urgencia",
    "nivel_atencao": "Atencao_Terciaria_Hospitalar",
    "data_revisao": "2026-01-26",
    "status_revisao_clinica": "documento_oficial_governamental",
    "conteudo_markdown": "# Diretriz Clínica Governamental: AVC Isquêmico Agudo (AHA / ASA / FDA 2026)\n\n## 1. Identificação e Metadados da Fonte Oficial\n* **Agências Emissoras:** American Heart Association (AHA) e American Stroke Association (ASA) em conformidade com as aprovações do Food and Drug Administration (FDA) - Estados Unidos.\n* **Referência Oficial:** *2026 Guideline for the Early Management of Patients With Acute Ischemic Stroke* (Stroke 2026;57:e1-Exxx).\n* **Link Oficial:** [https://www.ahajournals.org/journal/str](https://www.ahajournals.org/journal/str)\n* **Público-alvo:** Médicos emergencistas, neurologistas vasculares, intensivistas e equipes de resgate pré-hospitalar.\n\n---\n\n## 2. Critérios de Elegibilidade e Janelas de Tempo\n\n### Janela Terapêutica Convencional (0 a 4,5 horas):\n* Início dos sintomas ou último momento em que o paciente foi visto sem déficits (*last known well*) **$< 4,5\\text{ horas}$**.\n* Idade $\\ge 18$ anos com déficit neurológico mensurável e potencialmente incapacitante (escore NIHSS ou perda funcional relevante como afasia, hemianopsia, paralisia de membro).\n* **Tomografia de Crânio Não Contrastada (TC):** Excluir obrigatoriamente hemorragia intracraniana (HIC) ou hipodensidade precoce extensa do território da artéria cerebral média ($> 1/3$ do hemisfério / ASPECTS $< 6$).\n\n### Janela Estendida (4,5 a 9 horas ou AVC do Despertar / *Wake-up Stroke*):\n* Elegibilidade confirmada por neuroimagem avançada:\n  * Tomografia com Perfusão (CTP) demonstrando mismatch significativo entre o núcleo isquêmico infartado (*core*) e a área de penumbra isquêmica recuperável; **OU**\n  * Ressonância Magnética com *mismatch DWI-FLAIR* (lesão hiperintensa evidente em difusão DWI, porém sem hiperintensidade correspondente no FLAIR, indicando AVC com tempo real de evolução $< 4,5\\text{ horas}$).\n\n### Critérios de Exclusão Críticos para Trombólise:\n1. Hemorragia intracraniana em TC basal;\n2. Pressão Arterial persistente $\\ge 185/110\\text{ mmHg}$ refratária a anti-hipertensivos parenterais imediatos (Labetalol ou Nitroprussiato de Sódio);\n3. Plaquetometria $< 100.000/\\text{mm}^3$;\n4. Uso de anticoagulante oral direto (DOAC: Rivaroxabana, Apixabana, Dabigatrana) nas últimas 48 horas (exceto se testes laboratoriais específicos normais ou reversor disponível);\n5. Uso de Heparina nas últimas 24 horas com TTPa alargado, ou INR $> 1,7$ em uso de Varfarina;\n6. Traumatismo cranioencefálico grave ou cirurgia intracraniana/espinhal nos últimos 3 meses.\n\n---\n\n## 3. Posologias e Esquemas Trombólicos (Tenecteplase vs. Alteplase)\n\n### Opção 1: Tenecteplase (TNK-tPA) - Padrão Ouro de Agilidade Logística\n* **Posologia Oficial:** **$0,25\\text{ mg/kg}$ por via intravenosa administrada em bólus único rápido durante 5 a 10 segundos** (dose máxima de **$25\\text{ mg}$**, equivalente a $5\\text{ mL}$ da solução reconstituída).\n* **Vantagens Operacionais Comprovadas:**\n  * Dispensa o uso de bomba de infusão contínua;\n  * Permite infusão imediata na sala de tomografia;\n  * Não há risco de extravasamento, interrupção acidental ou perda de bomba durante a ambulância no transporte para trombectomia mecânica inter-hospitalar.\n\n### Opção 2: Alteplase (rt-PA) - Esquema Clássico\n* **Posologia Oficial:** **$0,9\\text{ mg/kg}$ por via intravenosa** (dose máxima de **$90\\text{ mg}$**):\n  * **$10\\%$ da dose total** administrada em bólus IV direto durante 1 minuto;\n  * **$90\\%$ restantes** infundidos em bomba de infusão contínua durante exatamente 60 minutos.\n\n### Monitoramento Pós-Trombólise e Controle Hemodinâmico:\n* **Alvo de Pressão Arterial:** Manter rigorosamente $\\text{PA} < 180/105\\text{ mmHg}$ durante e nas primeiras 24 horas após o trombolítico para prevenir transformação hemorrágica sintomática.\n* **Proibição de Antiagregantes:** Não administrar AAS, Clopidogrel ou Heparina nas primeiras 24 horas pós-trombólise; realizar TC de crânio de controle em 24h antes de autorizar início de antiagregação plaquetária secundária.\n\n---\n\n## 4. Análise Comparada com o SUS / Brasil\n\n### Convergências:\n* Tanto a Linha de Cuidado do AVC do Ministério da Saúde do Brasil quanto a AHA/ASA preconizam o atendimento ultra-rápido (*tempo porta-agulha* $< 45\\text{--}60$ minutos) e a trombectomia mecânica para oclusão de grandes vasos da circulação anterior até 24 horas com critérios de imagem favoráveis.\n\n### Divergências Relevantes de Gestão e Acesso:\n1. **Predomínio da Alteplase no SUS:** No Brasil, a grande maioria dos leitos de AVC credenciados ainda emprega exclusivamente a Alteplase 0,9 mg/kg fornecida pelo Ministério da Saúde. A Tenecteplase, embora recentemente avaliada pela Conitec e implementada em alguns serviços avançados do SAMU (como SAMU Metropolitano e capitais pioneiras), ainda não alcançou a substituição plena nacionalmente.\n2. **Infraestrutura Pré-Hospitalar (Mobile Stroke Units):** Nos grandes centros norte-americanos, a trombólise com TNK ocorre frequentemente dentro de tomógrafos móveis embarcados em ambulâncias (*Mobile Stroke Units*). No Brasil, o transporte até o hospital terciário ainda representa o maior fator limitador de perda de janela de 4,5 horas.\n3. **Softwares de Inteligência Artificial para Perfusão:** A diretriz americana baseia a janela tardia no uso disseminado de softwares automáticos (como RAPID AI), enquanto nos hospitais públicos brasileiros o laudo radiológico de penumbra depende preponderantemente da disponibilidade de neurorradiologista presencial ou sobreaviso.",
    "bloco_prescricao_copiavel": "",
    "jurisdicao": "US_CDC_FDA",
    "pais": "Estados Unidos",
    "agencia": "FDA / AHA / ASA (American Heart Association / American Stroke Association)",
    "codigo_diretriz": "2026 AHA/ASA Guidelines for the Early Management of Acute Ischemic Stroke",
    "url_fonte": "https://www.ahajournals.org/journal/str",
    "data_publicacao": "2026-01-26",
    "idioma_original": "en-US",
    "equivalente_sus_id": "",
    "tem_equivalente_sus": false,
    "disponibilidade_farmacos_rename_sus": "parcial",
    "medicamentos_exclusivos_estrangeiros": [
      "Tenecteplase padronizada universalmente como trombolítico Classe I em pronto-socorro",
      "Software de tomografia por perfusão (CTP) automatizado via IA para AVC em janela estendida"
    ],
    "divergencias_relevantes_vs_sus": [
      "A diretriz 2026 da AHA/ASA estabelece equiparação Classe I entre Tenecteplase (TNK em bólus IV único de 5 a 10 segundos) e Alteplase (infusão de 60 minutos em bomba) na janela de até 4,5 horas.",
      "A simplicidade logística do bólus único de Tenecteplase revolucionou o modelo de transferência inter-hospitalar (*drip-and-ship*) para centros com hemodinâmica e trombectomia mecânica, reduzindo significativamente o atraso agulha-punção arterial.",
      "No SUS brasileiro, a Alteplase 0,9 mg/kg ainda é o padrão hegemônico da maioria das Unidades de AVC habilitadas pelo Ministério da Saúde, estando a Tenecteplase em expansão e implantação gradual em serviços de emergência e SAMU."
    ]
  },
  {
    "id_protocolo": "health_canada_ccs_insuficiencia_cardiaca",
    "titulo": "Insuficiência Cardíaca com Fração de Ejeção Reduzida (ICFEr): Os Quatro Pilares da Terapia Médica Otimizada",
    "cids_relacionados": [
      "I50",
      "I50.0",
      "I50.1",
      "I50.9"
    ],
    "ciaps_relacionados": [
      "K77"
    ],
    "categoria": "cardiovascular",
    "nivel_atencao": "Atencao_Primaria_e_Especializada",
    "data_revisao": "2024-03-15",
    "status_revisao_clinica": "documento_oficial_governamental",
    "conteudo_markdown": "# Diretriz Clínica Governamental: Insuficiência Cardíaca Reduzida (Health Canada / CCS)\n\n## 1. Identificação e Metadados da Fonte Oficial\n* **Agências Emissoras:** Canadian Cardiovascular Society (CCS) em alinhamento com a Canadian Heart Failure Society (CHFS) e diretrizes terapêuticas da Health Canada.\n* **Referência Oficial:** *2021 Comprehensive Update of the Canadian Cardiovascular Society Guidelines for the Management of Heart Failure* (Can J Cardiol. 2021; 37(4):531-546).\n* **Link Oficial:** [https://ccs.ca/guideline/2021-heart-failure-reduced-ef/](https://ccs.ca/guideline/2021-heart-failure-reduced-ef/)\n* **Público-alvo:** Médicos de atenção primária, cardiologistas, internistas e equipes multidisciplinares de IC.\n\n---\n\n## 2. Critérios Diagnósticos e Fenotipagem Ecocardiográfica\n\n### Definição de ICFEr:\n* Presença de sintomas típicos (dispneia aos esforços, ortopneia, dispneia paroxística noturna, fadiga) e/ou sinais físicos de congestão (turgência jugular a $45^\\circ$, refluxo hepatojugular, estertores crepitantes pulmonares, edema de membros inferiores); **E**\n* **Fração de Ejeção do Ventrículo Esquerdo (FEVE) $\\le 40\\%$** documentada por ecocardiograma transtorácico ou ressonância cardíaca.\n\n### Biomarcadores Natriuréticos no Diagnóstico Diferencial:\n* **NT-proBNP $\\ge 125\\text{ pg/mL}$** no ambulatório ($\\ge 300\\text{ pg/mL}$ na urgência); ou **BNP $\\ge 35\\text{ pg/mL}$** ($\\ge 100\\text{ pg/mL}$ na urgência): confirma probabilidade substancial de etiologia cardíaca para dispneia.\n\n---\n\n## 3. Os Quatro Pilares Farmacológicos (Quartet Therapy)\n\nA diretriz canadense preconizou que a introdução precoce das 4 classes de fármacos em doses baixas nas primeiras semanas oferece benefício prognóstico superior a titulações lentas de apenas uma ou duas drogas isoladas:\n\n### 1º Pilar: Inibidor da Neprilisina e Receptor de Angiotensina (ARNI)\n* **Sacubitril/Valsartana:**\n  * **Indicação:** Terapia preferencial de primeira linha para substituir IECA ou BRA em pacientes com ICFEr sintomática.\n  * **Posologia:** Iniciar com $24/26\\text{ mg}$ (comprimido de $50\\text{ mg}$) ou $49/51\\text{ mg}$ ($100\\text{ mg}$) 2 vezes ao dia. Titular a cada 2 a 4 semanas até o alvo de **$97/103\\text{ mg}$ (comprimido de $200\\text{ mg}$) 2 vezes ao dia**.\n  * *Atenção de Segurança:* Se o paciente estiver em uso prévio de IECA (Enalapril/Captopril), é mandatório respeitar um **período de washout (clareamento) de pelo menos 36 horas** antes da 1ª dose do ARNI, para evitar angioedema fatal.\n\n### 2º Pilar: Beta-bloqueador com Evidência Comprovada de Sobrevida\n* Iniciar com o paciente hemodinamicamente estável e euvolêmico:\n  * **Succinato de Metoprolol:** iniciar com $25\\text{ a }50\\text{ mg/dia}$, titular até $200\\text{ mg/dia}$; **OU**\n  * **Carvedilol:** iniciar com $3,125\\text{ mg}$ 2x/dia, titular até $25\\text{ mg}$ 2x/dia (ou $50\\text{ mg}$ 2x/dia se peso $> 85\\text{ kg}$); **OU**\n  * **Bisoprolol:** iniciar com $1,25\\text{ mg/dia}$, titular até $10\\text{ mg/dia}$.\n\n### 3º Pilar: Antagonista do Receptor Mineralocorticoide (MRA)\n* **Espironolactona:**\n  * Iniciar com $12,5\\text{ a }25\\text{ mg/dia}$ VO. Titular até $50\\text{ mg/dia}$.\n  * *Critérios de Segurança:* Dosar potássio sérico ($\\text{K}^+$) e creatinina em 1, 4 e 12 semanas. Contraindicado se $\\text{K}^+ > 5,0\\text{ mEq/L}$ ou TFGe $< 30\\text{ mL/min/1,73m²}$.\n  * Se o homem desenvolver ginecomastia dolorosa: substituir por Eplerenona ($25\\text{ a }50\\text{ mg/dia}$).\n\n### 4º Pilar: Inibidores de SGLT2 (Dapagliflozina / Empagliflozina)\n* **Dapagliflozina $10\\text{ mg}$ 1x/dia** OU **Empagliflozina $10\\text{ mg}$ 1x/dia**:\n  * Indicados para **TODOS** os pacientes com FEVE $\\le 40\\%$, **independentemente de terem ou não Diabetes Mellitus**.\n  * Fármaco sem necessidade de titulação de dose (inicia-se diretamente na dose terapêutica plena).\n  * Reduz internações por IC em mais de $30\\%$ e mortalidade cardiovascular em poucas semanas.\n\n### Manejo da Congestão (Sintomático):\n* **Furosemida:** $20\\text{ a }80\\text{ mg/dia}$ VO para manter euvolemia. Reduzir a dose de diurético de alça quando o iSGLT2 e o ARNI promoverem natriurese compensatória.\n\n---\n\n## 4. Análise Comparada com o SUS / Brasil\n\n### Convergências:\n* Tanto a Diretriz da Sociedade Brasileira de Cardiologia (SBC 2021) quanto o PCDT de Insuficiência Cardíaca reconhecem que a combinação quádrupla é a terapia modificadora de doença que confere a maior redução de mortalidade da história da cardiologia contemporânea.\n* Ambas preconizam Carvedilol, Succinato de Metoprolol e Bisoprolol como os únicos betabloqueadores validados para ICFEr.\n\n### Divergências Relevantes de Gestão e Acesso:\n1. **Acesso aos 4 Pilares na Atenção Básica:** No SUS, a cesta farmacêutica básica disponível de pronto na UBS contempla apenas o Enalapril, Carvedilol, Espironolactona e Furosemida (3 pilares tradicionais). O quarto pilar (Dapagliflozina) foi incorporado pelo Ministério da Saúde, mas sua dispensação muitas vezes exige preenchimento de formulários específicos em farmácias especializadas ou laudos de ecocardiograma recentes.\n2. **Uso de ARNI (Sacubitril/Valsartana):** No Canadá, o ARNI é prescrito universalmente na alta hospitalar ou no primeiro contato ambulatorial. No SUS, a maioria dos pacientes continua em uso crônico de Enalapril devido ao custo elevado do ARNI na farmácia comercial e restrições burocráticas nas redes estaduais.\n3. **Disponibilidade do BNP/NT-proBNP na Rede de Atenção Básica:** No sistema de saúde canadense, o teste rápido ou laboratorial de BNP é amplamente difundido para afastar IC em idosos com queixa de cansaço. Na atenção básica do SUS, a dosagem de peptídeos natriuréticos é inexistente na vasta maioria dos municípios, restringindo-se a hospitais terciários e unidades de terapia intensiva.",
    "bloco_prescricao_copiavel": "",
    "jurisdicao": "CA_HEALTH",
    "pais": "Canadá",
    "agencia": "Health Canada / CCS (Canadian Cardiovascular Society)",
    "codigo_diretriz": "2021 CCS/CHFS Heart Failure Guidelines Update",
    "url_fonte": "https://ccs.ca/guideline/2021-heart-failure-reduced-ef/",
    "data_publicacao": "2021-04-01",
    "idioma_original": "en-CA",
    "equivalente_sus_id": "insuficiencia_cardiaca_fracao_reduzida",
    "tem_equivalente_sus": true,
    "disponibilidade_farmacos_rename_sus": "parcial",
    "medicamentos_exclusivos_estrangeiros": [
      "Sacubitril/Valsartana (ARNI) de prescrição universal em primeira linha ambulatorial",
      "Vericiguat (estimulador solúvel da guanilato ciclase para IC recente com descompensação)",
      "Eplerenona como alternativa direta à Espironolactona se ginecomastia dolorosa"
    ],
    "divergencias_relevantes_vs_sus": [
      "A diretriz canadense padroniza o início rápido dos 'Quatro Pilares' fundamentais (ARNI + Betabloqueador + Espironolactona + iSGLT2) nas primeiras 4 a 6 semanas de diagnóstico para todos os pacientes com FEVE <= 40%, independentemente de glicemia.",
      "Sacubitril/Valsartana (ARNI) é posicionado como substituto prioritário de 1ª linha em relação a IECA/BRA, enquanto no SUS o Enalapril continua sendo a droga básica fornecida pela UBS.",
      "Uso rotineiro de peptídeos natriuréticos (BNP ou NT-proBNP) na atenção primária canadense para diagnóstico diferencial célere de dispneia aguda e acompanhamento de resposta terapêutica."
    ]
  },
  {
    "id_protocolo": "nice_ng136_hipertensao",
    "titulo": "Hipertensão Arterial no Adulto: Diagnóstico e Manejo",
    "cids_relacionados": [
      "I10",
      "I15"
    ],
    "ciaps_relacionados": [
      "K86",
      "K87"
    ],
    "categoria": "cardiovascular",
    "nivel_atencao": "Atencao_Primaria_e_Especializada",
    "data_revisao": "2026-02-26",
    "status_revisao_clinica": "documento_oficial_governamental",
    "conteudo_markdown": "# Diretriz Clínica Governamental: Hipertensão Arterial no Adulto (NICE NG136)\n\n## 1. Identificação e Metadados da Fonte Oficial\n* **Agência Emissora:** National Institute for Health and Care Excellence (NICE) - National Health Service (NHS), Reino Unido.\n* **Código de Referência:** NICE Guideline NG136 (atualização 2026).\n* **Link Oficial:** [https://www.nice.org.uk/guidance/ng136](https://www.nice.org.uk/guidance/ng136)\n* **Público-alvo:** Médicos de atenção primária (GPs), cardiologistas, enfermeiros de prática avançada e equipes multiprofissionais.\n\n---\n\n## 2. Critérios Diagnósticos e Classificação Oficial (NICE)\n\n### Rastreio e Confirmação Ambulatorial\n* **Aferição em Consultório:** Realizar em ambos os braços na primeira avaliação; considerar o braço com maior valor. Se $\\text{PA} \\ge 140/90\\text{ mmHg}$, repetir para confirmação.\n* **Confirmação Mandatória:**\n  * Oferecer **MAPA (Monitorização Ambulatorial da Pressão Arterial)** como exame padrão ouro.\n  * Se MAPA não tolerado ou indisponível, realizar **MRPA (Monitorização Residencial da Pressão Arterial)**: 2 medidas com intervalo de 1 minuto, 2 vezes ao dia (manhã e noite), durante 7 dias (descartar o dia 1 e calcular a média dos dias restantes).\n\n### Estadiamento Clínico (Consultório vs. MAPA/MRPA):\n1. **Estágio 1:**\n   * Consultório: $140/90\\text{ mmHg}$ a $159/99\\text{ mmHg}$ **E**\n   * MAPA/MRPA diurno: $135/85\\text{ mmHg}$ a $149/94\\text{ mmHg}$.\n2. **Estágio 2:**\n   * Consultório: $\\ge 160/100\\text{ mmHg}$ **E**\n   * MAPA/MRPA diurno: $\\ge 150/95\\text{ mmHg}$.\n3. **Hipertensão Severa (Estágio 3):**\n   * Consultório: Pressão Arterial Sistólica (PAS) $\\ge 180\\text{ mmHg}$ ou Pressão Arterial Diastólica (PAD) $\\ge 120\\text{ mmHg}$. Avaliar imediatamente lesão aguda de órgão-alvo ou emergência hipertensiva.\n\n---\n\n## 3. Escalonamento Terapêutico (NICE Stepwise Approach)\n\n### Metas Pressóricas Alvo:\n* **Idade < 80 anos:** Consultório $< 140/90\\text{ mmHg}$ (MAPA/MRPA $< 135/85\\text{ mmHg}$).\n* **Idade $\\ge 80$ anos:** Consultório $< 150/90\\text{ mmHg}$ (MAPA/MRPA $< 145/85\\text{ mmHg}$).\n\n### Algoritmo Farmacológico:\n\n#### Step 1 (Monoterapia de 1ª Linha):\n* **Idade < 55 anos E não-negro:**\n  * Iniciar com **Inibidor da ECA (IECA)** (ex: Ramipril 2,5 a 10 mg/dia ou Enalapril 10 a 40 mg/dia) ou **Bloqueador dos Receptores de Angiotensina (BRA)** (ex: Losartana 50 a 100 mg/dia ou Candesartana 8 a 32 mg/dia).\n* **Idade $\\ge 55$ anos OU qualquer idade com ascendência africana ou caribenha:**\n  * Iniciar com **Bloqueador do Canal de Cálcio (BCC)** (ex: Besilato de Anlodipino 5 a 10 mg 1x/dia). Se BCC contraindicado ou não tolerado (edema severo), utilizar diurético tiazídico-símile (Indapamida 1,5 mg liberação sustentada ou 2,5 mg 1x/dia pela manhã).\n\n#### Step 2 (Combinação Dupla):\n* Adicionar o fármaco complementar:\n  * Se usava IECA/BRA: associar **BCC** (IECA/BRA + BCC).\n  * Se não tolera BCC: associar **Diurético Tiazídico-Símile** (Indapamida 1,5 mg/2,5 mg ou Clortalidona 12,5 a 25 mg/dia).\n  * Para pacientes negros com intolerância ao BRA inicial: BCC + Tiazídico-símile.\n\n#### Step 3 (Combinação Tripla):\n* Associação em doses otimizadas das 3 classes fundamentais:\n  * **[IECA ou BRA] + [BCC] + [Diurético Tiazídico-Símile]**.\n\n#### Step 4 (Hipertensão Resistente):\n* Confirmar adesão e descartar efeito do avental branco (MAPA/MRPA).\n* Avaliar nível sérico de Potássio ($\\text{K}^+$):\n  * **Se $\\text{K}^+ \\le 4,5\\text{ mEq/L}$:** Adicionar **Espironolactona** na dose de $25\\text{ mg/dia}$ (monitorar função renal e calemia em 2 a 4 semanas).\n  * **Se $\\text{K}^+ > 4,5\\text{ mEq/L}$:** Adicionar **Alfa-bloqueador** (Doxazosina 4 a 8 mg/dia) ou **Beta-bloqueador** (Bisoprolol 5 a 10 mg/dia, Atenolol ou Carvedilol).\n  * Encaminhar para centro especializado em nefrologia ou hipertensão arterial refratária.\n\n---\n\n## 4. Análise Comparada com o SUS / Brasil\n\n### Convergências:\n* Ambas as diretrizes convergem na recomendação prioritária do tripé anti-hipertensivo (IECA/BRA + BCC + Diuréticos) para controle pressórico sustentado.\n* Contraindicação formal absoluta do uso combinado de IECA + BRA pelo risco aumentado de lesão renal aguda e hipercalemia sem ganho clínico adicional.\n\n### Divergências Práticas de Acesso e Conduta:\n1. **Confirmação Diagnóstica:** Enquanto o NHS/NICE exige MAPA/MRPA sistemático para validar o diagnóstico, a rede básica do SUS frequentemente diagnostica e trata com base na média de medidas de consultório em dias separados, devido ao gargalo de agendamento de MAPA municipal.\n2. **Escolha do Diurético:** O SUS disponibiliza massivamente a **Hidroclorotiazida 25 mg** na Farmácia Popular/UBS básica, enquanto o NICE expressamente desaconselha o início de hidroclorotiazida se indapamida ou clortalidona estiverem disponíveis.\n3. **Abordagem Étnica Inicial:** O protocolo brasileiro (SBC 2020) permite combinação fixa dupla precoce logo no estágio 1 de alto risco cardiovascular independentemente de idade/etnia, enquanto o NICE mantém a regra etária/étnica estrita de Step 1 (BCC preferencial para $\\ge 55$ anos ou negros).",
    "bloco_prescricao_copiavel": "",
    "jurisdicao": "UK_NICE",
    "pais": "Reino Unido",
    "agencia": "NICE (National Institute for Health and Care Excellence)",
    "codigo_diretriz": "NICE Guideline NG136",
    "url_fonte": "https://www.nice.org.uk/guidance/ng136",
    "data_publicacao": "2019-08-28",
    "idioma_original": "en-GB",
    "equivalente_sus_id": "hipertensao_arterial_estagio1_2",
    "tem_equivalente_sus": true,
    "disponibilidade_farmacos_rename_sus": "parcial",
    "medicamentos_exclusivos_estrangeiros": [],
    "divergencias_relevantes_vs_sus": [
      "NICE estabelece confirmação mandatória por MAPA (diurno >= 135/85 mmHg) ou MRPA antes de rotular diagnóstico ou iniciar fármaco no estágio 1 sem lesão de órgão-alvo; no SUS, 2 ou mais aferições de consultório em consultas distintas ainda constituem a prática mais comum.",
      "Estratificação farmacológica inicial por etnia e idade: NICE preconiza Bloqueadores dos Canais de Cálcio (BCC) como monoterapia de 1ª linha para indivíduos com idade >= 55 anos ou de etnia negra (origem africana/caribenha), e IECA/BRA para não-negros < 55 anos.",
      "Preferência por diuréticos tiazídicos-símile (Indapamida ou Clortalidona) em detrimento da Hidroclorotiazida comum, baseada em maior meia-vida e redução consistente de desfechos cardiovasculares."
    ]
  },
  {
    "id_protocolo": "nice_ng193_dor_cronica_fibromialgia",
    "titulo": "Dor Crônica Primária e Fibromialgia: Abordagem Não-Opioide, Isenta de AINEs e Foco em Funcionalidade",
    "cids_relacionados": [
      "M79.7",
      "R52.1",
      "R52.2"
    ],
    "ciaps_relacionados": [
      "L18",
      "A01"
    ],
    "categoria": "reumatologia_dor",
    "nivel_atencao": "Atencao_Primaria_e_Especializada",
    "data_revisao": "2024-05-10",
    "status_revisao_clinica": "documento_oficial_governamental",
    "conteudo_markdown": "# Diretriz Clínica Governamental: Dor Crônica Primária e Fibromialgia (NICE NG193)\n\n## 1. Identificação e Metadados da Fonte Oficial\n* **Agência Emissora:** National Institute for Health and Care Excellence (NICE) - National Health Service (NHS), Reino Unido.\n* **Código de Referência:** NICE Guideline NG193 (*Chronic pain (primary and secondary) in over 16s*).\n* **Link Oficial:** [https://www.nice.org.uk/guidance/ng193](https://www.nice.org.uk/guidance/ng193)\n* **Público-alvo:** Médicos de atenção primária, reumatologistas, especialistas em dor, fisioterapeutas e psicólogos.\n\n---\n\n## 2. Conceito de Dor Crônica Primária e Critérios Clínicos\n\n### Definição Oficial (NICE / CID-11):\n* **Dor Crônica Primária (incluindo Fibromialgia):** Dor persistente em uma ou mais regiões anatômicas por **mais de 3 meses**, associada a sofrimento emocional significativo (ansiedade, frustração, depressão) e limitação funcional substancial, **sem que possa ser explicada satisfatoriamente por outro diagnóstico crônico secundário** (como artrite reumatoide, neoplasia, artrose avançada ou neuropatia demonstrável).\n* **Quadro Típico:** Dor difusa musculoesquelética bilateral, rigidez matinal, fadiga crônica não restauradora, distúrbios do sono e queixas de déficit de concentração/névoa mental (*fibrofog*).\n\n---\n\n## 3. Recomendações e Contraindicações Terapêuticas Formais\n\n### Fármacos Expressamente NÃO Recomendados (Evidência de Ausência de Benefício e Alto Risco de Dano):\nO NICE emitiu recomendação mandatória **CONTRA o início** de qualquer uma das seguintes classes terapêuticas para dor crônica primária / fibromialgia:\n1. **Opioides:** Nem fracos (Tramadol, Codeína) nem potentes (Morfina, Oxicodona, Fentanil, Buprenorfina) - ausência de melhora funcional e alto risco de dependência química e hiperalgesia induzida por opioides.\n2. **Gabapentinoides:** Pregabalina e Gabapentina (não demonstraram benefício sustentado para dor primária, com riscos de sedação, ganho de peso e dependência).\n3. **Anti-inflamatórios Não Esteroidais (AINEs):** Ibuprofeno, Cetoprofeno, Diclofenaco, Meloxicam, Naproxeno - ineficazes na dor de processamento central e nefrotóxicos/gastrotóxicos no uso crônico.\n4. **Paracetamol isolado ou associado.**\n5. **Benzodiazepínicos e relaxantes musculares sistêmicos.**\n\n### Terapias Não Farmacológicas de 1ª Linha (Pilar Central):\n* **Exercício Físico Supervisionado:** Programas aeróbicos de condicionamento físico progressivo e fortalecimento muscular em grupo (caminhada, hidroginástica, pilates), ajustados à tolerância inicial do paciente.\n* **Psicoterapia Focada em Dor:** Terapia de Aceitação e Compromisso (ACT) ou Terapia Cognitivo-Comportamental (TCC) voltada para o manejo da dor e reestruturação de crenças catastrofizantes.\n* **Acupuntura:** Considerar ciclo breve de sessões de acupuntura com profissional habilitado se houver preferência do paciente.\n\n### Farmacoterapia de Apoio Permitida (Antidepressivos):\nSe, após discussão compartilhada sobre benefícios modestos e possíveis efeitos adversos, for acordado o teste farmacológico, prescrever **exclusivamente**:\n* **Duloxetina:** Dose inicial de $30\\text{ mg/dia}$ pela manhã por 1 semana, seguida de aumento para $60\\text{ mg/dia}$ (dose máxima: $120\\text{ mg/dia}$).\n* **Amitriptilina:** Dose baixa de $10\\text{ mg}$ à noite, podendo titular para $20\\text{ a }50\\text{ mg}$ ao deitar (útil na coocorrência de insônia fragmentada).\n* **ISRS:** Citalopram, Sertralina ou Fluoxetina, se comorbidade com transtorno ansioso ou depressivo.\n\n---\n\n## 4. Análise Comparada com o SUS / Brasil\n\n### Convergências:\n* Tanto as sociedades médicas brasileiras (Sociedade Brasileira de Reumatologia - SBR) quanto o NICE concordam que o exercício físico regular e aeróbico é o pilar não medicamentoso mais efetivo e custo-efetivo na fibromialgia.\n\n### Divergências Relevantes de Gestão e Conduta:\n1. **Uso de Pregabalina:** Enquanto o FDA e as diretrizes brasileiras da SBR ainda mantêm a indicação formal da Pregabalina como droga aprovada para fibromialgia, o NICE britânico baniu o início de gabapentinoides para dor primária após revisão sistemática demonstrar balanço desfavorável entre eficácia e segurança.\n2. **Cultura de Prescrição de Opioides na APS:** No Brasil, é comum a prescrição crônica de analgésicos opioides (Tramadol, Tylex/Paracetamol+Codeína) para crises de dor em pacientes fibromiálgicos nas UPAs e UBSs, o que perpetua a sensibilização central. O protocolo do NICE estabelece diretriz estrita para interrupção gradual e segura desses fármacos.\n3. **Acesso à Duloxetina:** No SUS, a Duloxetina é um medicamento do Componente Especializado da Assistência Farmacêutica (CEAF) em muitos estados, sujeito a laudos complexos, enquanto a Amitriptilina (que tem mais efeitos anticolinérgicos e sonolência) acaba sendo o único antidepressivo disponível de imediato na farmácia básica.",
    "bloco_prescricao_copiavel": "",
    "jurisdicao": "UK_NICE",
    "pais": "Reino Unido",
    "agencia": "NICE (National Institute for Health and Care Excellence)",
    "codigo_diretriz": "NICE Guideline NG193",
    "url_fonte": "https://www.nice.org.uk/guidance/ng193",
    "data_publicacao": "2021-04-07",
    "idioma_original": "en-GB",
    "equivalente_sus_id": "",
    "tem_equivalente_sus": false,
    "disponibilidade_farmacos_rename_sus": "parcial",
    "medicamentos_exclusivos_estrangeiros": [
      "Duloxetina e Milnaciprano acessíveis sem protocolo de excepcionalidade",
      "Terapia de Aceitação e Compromisso (ACT) estruturada em rede básica"
    ],
    "divergencias_relevantes_vs_sus": [
      "NICE estabelece contraindicação categórica para o início de opioides (incluindo Tramadol e Codeína), anti-inflamatórios não esteroidais (AINEs), paracetamol e gabapentinoides (Pregabalina/Gabapentina) para dor crônica primária e fibromialgia.",
      "Apenas antidepressivos (Duloxetina, Amitriptilina ou ISRS) possuem recomendação farmacológica favorável, sempre subordinados a terapias físicas e psicológicas ativas.",
      "No Brasil, na ausência de um PCDT unificado do SUS específico para Fibromialgia na APS, o uso crônico e iatrogênico de AINEs, analgésicos opioides e relaxantes musculares ainda é amplamente disseminado nos serviços de saúde."
    ]
  },
  {
    "id_protocolo": "nice_ng203_doenca_renal_cronica",
    "titulo": "Doença Renal Crônica: Avaliação, Rastreio com RAC e Nefroproteção com IECA/BRA e iSGLT2",
    "cids_relacionados": [
      "N18",
      "N18.1",
      "N18.2",
      "N18.3",
      "N18.4",
      "N18.5",
      "N18.9"
    ],
    "ciaps_relacionados": [
      "U99"
    ],
    "categoria": "nefrologia",
    "nivel_atencao": "Atencao_Primaria_e_Especializada",
    "data_revisao": "2021-11-24",
    "status_revisao_clinica": "documento_oficial_governamental",
    "conteudo_markdown": "# Diretriz Clínica Governamental: Doença Renal Crônica (NICE NG203)\n\n## 1. Identificação e Metadados da Fonte Oficial\n* **Agência Emissora:** National Institute for Health and Care Excellence (NICE) - National Health Service (NHS), Reino Unido.\n* **Código de Referência:** NICE Guideline NG203.\n* **Link Oficial:** [https://www.nice.org.uk/guidance/ng203](https://www.nice.org.uk/guidance/ng203)\n* **Escopo:** Detecção precoce, estadiamento pelo KDIGO (TFGe + RAC), redução do declínio da função renal e manejo do risco cardiovascular.\n\n---\n\n## 2. Critérios Diagnósticos e Classificação KDIGO\n\n### Diagnóstico de Doença Renal Crônica (DRC):\n* Presença persistente por **$\\ge 3$ meses** de:\n  * **TFGe < 60 mL/min/1,73m²** (calculada pela equação CKD-EPI baseada em creatinina sérica); **OU**\n  * **Marcador de lesão renal:** Relação Albumina/Creatinina (RAC) na urina $\\ge 30\\text{ mg/g}$ ($3\\text{ mg/mmol}$), anormalidades no sedimento urinário, alterações histológicas ou anatômicas estruturais.\n\n### Estadiamento Combinado (TFGe [G] + Albuminúria [A]):\n* **Estágios de TFGe (G):**\n  * G1: $\\ge 90$ (normal/elevado)\n  * G2: $60\\text{--}89$ (levemente diminuído)\n  * G3a: $45\\text{--}59$ (leve a moderadamente diminuído)\n  * G3b: $30\\text{--}44$ (moderada a severamente diminuído)\n  * G4: $15\\text{--}29$ (severamente diminuído)\n  * G5: $< 15\\text{ mL/min/1,73m²}$ (falência renal / estágio terminal)\n* **Categorias de Albuminúria (A - RAC):**\n  * A1: $< 30\\text{ mg/g}$ ($< 3\\text{ mg/mmol}$) - Normal a aumento leve\n  * A2: $30\\text{--}300\\text{ mg/g}$ ($3\\text{--}30\\text{ mg/mmol}$) - Microalbuminúria / aumento moderado\n  * A3: $> 300\\text{ mg/g}$ ($> 30\\text{ mg/mmol}$) - Macroalbuminúria / aumento severo\n\n---\n\n## 3. Escalonamento Farmacológico e Nefroproteção\n\n### Metas Pressóricas no Paciente com DRC:\n* Se RAC $< 70\\text{ mg/mmol}$ ($< 600\\text{ mg/g}$): Manter PA sistólica entre $120\\text{--}139\\text{ mmHg}$ e diastólica $< 90\\text{ mmHg}$.\n* Se RAC $\\ge 70\\text{ mg/mmol}$ ($\\ge 600\\text{ mg/g}$): Controle mais estrito, PAS entre $120\\text{--}129\\text{ mmHg}$ e PAD $< 80\\text{ mmHg}$.\n\n### Algoritmo Nefroprotetor:\n1. **Bloqueio do Sistema Renina-Angiotensina-Aldosterona (SRAA):**\n   * **Indicação:** Oferecer IECA (Ramipril $2,5\\text{ a }10\\text{ mg/dia}$ ou Enalapril $5\\text{ a }40\\text{ mg/dia}$) ou BRA (Losartana $50\\text{ a }100\\text{ mg/dia}$) se:\n     * Diabetes com RAC $\\ge 30\\text{ mg/g}$ ($3\\text{ mg/mmol}$);\n     * Hipertensão sem diabetes com RAC $\\ge 300\\text{ mg/g}$ ($30\\text{ mg/mmol}$);\n     * Qualquer DRC com RAC $\\ge 600\\text{ mg/g}$ ($70\\text{ mg/mmol}$).\n   * **Monitoramento:** Dosar creatinina sérica e potássio em 1 a 2 semanas após iniciar ou titular a dose. Aumentos de até $30\\%$ na creatinina basal são esperados pela hemodinâmica glomerular e aceitáveis; investigar apenas se elevação $> 30\\%$ ou hipercalemia $> 5,5\\text{ mEq/L}$.\n2. **Inibidores de SGLT2 (Dapagliflozina / Empagliflozina):**\n   * Prescrever **Dapagliflozina $10\\text{ mg}$ 1x/dia** para adultos com TFGe entre $25\\text{ e }75\\text{ mL/min/1,73m²}$ que apresentem RAC $\\ge 200\\text{ mg/g}$ ($22,6\\text{ mg/mmol}$), **independentemente da presença de diabetes**.\n   * Não descontinuar o iSGLT2 se a TFGe cair abaixo de $25\\text{ mL/min/1,73m²}$ durante o tratamento, exceto se início de terapia dialítica ou intolerância clínica severa.\n3. **Estatinas e Proteção Cardiovascular (NICE NG238):**\n   * Prescrever **Atorvastatina $20\\text{ mg/dia}$** para todos os pacientes adultos com DRC nos estágios G3 a G5 ou com albuminúria A2/A3, sem necessidade de cálculo de escore de risco adicional, devido ao risco cardiovascular equivalente.\n\n---\n\n## 4. Análise Comparada com o SUS / Brasil\n\n### Convergências:\n* Uso prioritário de IECA (Enalapril) ou BRA (Losartana) para nefroproteção em diabéticos e hipertensos com perda proteica renal.\n* Aceitação clínica do aumento moderado de creatinina (até 30%) como efeito fisiológico do alívio da hiperfiltração intraglomerular.\n\n### Divergências Relevantes de Gestão e Acesso:\n1. **Disponibilidade da RAC na Atenção Básica:** O protocolo britânico exige a RAC urinária na rotina laboratorial da atenção primária. No SUS, a solicitação de microalbuminúria/RAC frequentemente enfrenta restrição de cota laboratorial ambulatorial em municípios de médio e pequeno porte, gerando subdiagnóstico do estágio A2.\n2. **Indicação Ampla de iSGLT2 na DRC Não Diabética:** O NICE preconiza Dapagliflozina para DRC com albuminúria com ou sem DM2. No SUS, o acesso a iSGLT2 para não diabéticos ainda é restrito ou depende de processos de Farmácia de Alto Custo (CEAF) estadual com regras heterogêneas.\n3. **Escore KFRE de Encaminhamento:** O NHS adota a calculadora KFRE de 4 variáveis para regular a fila da nefrologia (encaminhar se risco de diálise em 5 anos for $> 5\\%$), enquanto no SUS o critério costuma ser puramente corte fixo de TFGe $< 30\\text{ mL/min}$ ou creatinina absoluta.",
    "bloco_prescricao_copiavel": "",
    "jurisdicao": "UK_NICE",
    "pais": "Reino Unido",
    "agencia": "NICE (National Institute for Health and Care Excellence)",
    "codigo_diretriz": "NICE Guideline NG203",
    "url_fonte": "https://www.nice.org.uk/guidance/ng203",
    "data_publicacao": "2021-08-25",
    "idioma_original": "en-GB",
    "equivalente_sus_id": "doenca_renal_cronica_nefroprotecao",
    "tem_equivalente_sus": true,
    "disponibilidade_farmacos_rename_sus": "parcial",
    "medicamentos_exclusivos_estrangeiros": [
      "Finerenona (antagonista não esteroidal do receptor mineralocorticoide - NICE TA877)",
      "Bicarbonato de sódio purificado para profilaxia de acidose metabólica crônica"
    ],
    "divergencias_relevantes_vs_sus": [
      "NICE estabelece a Relação Albumina/Creatinina Urinária (RAC/ACR) em amostra isolada como exame obrigatório para rastreio e acompanhamento, condenando explicitamente fitas reagentes urinárias comuns e urina de 24 horas para este fim.",
      "Indicação formal de Inibidores de SGLT2 (Dapagliflozina) para qualquer paciente com DRC e TFGe entre 25 e 75 mL/min/1,73m² com RAC >= 200 mg/g (ou 22,6 mg/mmol), mesmo na ausência de Diabetes Mellitus.",
      "Uso da equação CKD-EPI sem ajuste por raça/etnia e cálculo do risco de falência renal em 5 anos (Kidney Failure Risk Equation - KFRE com escore de 4 variáveis) para decidir encaminhamento nefrológico ambulatorial."
    ]
  },
  {
    "id_protocolo": "nice_ng222_depressao_adulto",
    "titulo": "Depressão no Adulto: Abordagem Escalonada, Terapias Psicológicas e Desmame Gradual de Antidepressivos",
    "cids_relacionados": [
      "F32",
      "F32.0",
      "F32.1",
      "F32.2",
      "F33",
      "F33.0",
      "F33.1"
    ],
    "ciaps_relacionados": [
      "P76"
    ],
    "categoria": "saude_mental",
    "nivel_atencao": "Atencao_Primaria_e_Especializada",
    "data_revisao": "2026-01-15",
    "status_revisao_clinica": "documento_oficial_governamental",
    "conteudo_markdown": "# Diretriz Clínica Governamental: Depressão no Adulto (NICE NG222)\n\n## 1. Identificação e Metadados da Fonte Oficial\n* **Agência Emissora:** National Institute for Health and Care Excellence (NICE) - National Health Service (NHS), Reino Unido.\n* **Código de Referência:** NICE Guideline NG222.\n* **Link Oficial:** [https://www.nice.org.uk/guidance/ng222](https://www.nice.org.uk/guidance/ng222)\n* **Público-alvo:** Médicos de família, psiquiatras, psicólogos clínicos e equipes de atenção psicossocial.\n\n---\n\n## 2. Estratificação de Severidade e Princípios Gerais\n\n### Estratificação Diagnóstica (Critérios DSM / CID):\n1. **Episódio Depressivo Leve:** Poucos sintomas além dos 5 necessários para diagnóstico, sofrimento suportável e comprometimento funcional mínimo nas atividades diárias.\n2. **Episódio Depressivo Moderado:** Número intermediário de sintomas, perda perceptível de rendimento socioprofissional.\n3. **Episódio Depressivo Grave:** Quase todos os sintomas clássicos presentes (humor deprimido acentuado, anedonia, desesperança intensa, ideação suicida, retardo psicomotor severo ou sintomas psicóticos).\n\n### Princípio da Decisão Compartilhada:\n* Discutir ativamente riscos, efeitos adversos, tempo de latência terapêutica (2 a 4 semanas para início de melhora) e a duração recomendada do tratamento após a remissão (mínimo de 6 meses no primeiro episódio; 2 anos ou mais em episódios recorrentes).\n\n---\n\n## 3. Escalonamento Terapêutico (NICE Matched Stepped-Care)\n\n### Depressão Leve (Menor Comprometimento Funcional):\n* **Não utilizar medicação antidepressiva como conduta primária imediata**, exceto se houver histórico prévio de depressão moderada/grave ou preferência convicta do paciente após esclarecimento.\n* **Intervenções Psicológicas de 1ª Escolha:**\n  * Autoajuda guiada baseada em TCC (impressa ou digital suportada por profissional de saúde mental);\n  * Terapia de Ativação Comportamental em grupo ou individual;\n  * Exercícios físicos aeróbicos supervisionados (3 sessões de 45 a 60 min por semana durante 10 semanas).\n\n### Depressão Moderada a Grave:\n* Oferecer **Psicoterapia Estruturada de Alta Intensidade** (TCC individual, Terapia Interpessoal [TIP]) **combinada ou associada** a tratamento farmacológico.\n\n#### Farmacoterapia de 1ª Linha (ISRS):\n* **Sertralina:**\n  * Dose inicial: $50\\text{ mg/dia}$ pela manhã. Se resposta parcial após 3 a 4 semanas com boa tolerância, titular de 50 em 50 mg até o máximo de $200\\text{ mg/dia}$. Fármaco de escolha em cardiopatas ou histórico recente de infarto agudo do miocárdio.\n* **Alternativas:** Citalopram ($20\\text{ a }40\\text{ mg/dia}$ - atentar para monitorar intervalo QTc), Escitalopram ($10\\text{ a }20\\text{ mg/dia}$) ou Fluoxetina ($20\\text{ a }60\\text{ mg/dia}$).\n\n#### Farmacoterapia de 2ª Linha (Se falha terapêutica ou intolerância ao 1º ISRS):\n* Trocar para outro ISRS ou para um Inibidor da Recaptação de Serotonina e Noradrenalina (IRSN) como **Venlafaxina** ($75\\text{ a }225\\text{ mg/dia}$) ou **Duloxetina** ($60\\text{ a }120\\text{ mg/dia}$); ou para **Mirtazapina** ($15\\text{ a }45\\text{ mg/dia}$ ao deitar, excelente opção se insônia refratária ou perda ponderal severa).\n\n#### Depressão Refratária / Potencialização:\n* Potencialização com **Carbonato de Lítio** (litemia alvo $0,6\\text{ a }0,8\\text{ mEq/L}$) ou antipsicótico atípico em dose baixa (**Quetiapina** $150\\text{ a }300\\text{ mg/dia}$ ou **Aripiprazol** $2,5\\text{ a }10\\text{ mg/dia}$) sob supervisão psiquiátrica.\n\n### Manejo da Interrupção / Desmame (Tapering Seguro):\n* **Proibição de parada abrupta:** Reduzir a dose em etapas proporcionais a cada 2 a 4 semanas.\n* Pacientes em uso prolongado devem reduzir progressivamente doses mínimas fracionadas para mitigar sintomas de retirada (parestesias / sensação de choque, tontura, irritabilidade, choro fácil, labilidade autonômica).\n\n---\n\n## 4. Análise Comparada com o SUS / Brasil\n\n### Convergências:\n* Tanto o Caderno de Atenção Básica nº 34 do Ministério da Saúde quanto o NICE reconhecem a importância da escuta qualificada, do acolhimento na atenção primária e do rastreio ativo de risco de suicídio.\n* A Sertralina e a Fluoxetina são reconhecidas como ferramentas psicotrópicas seguras e de baixo custo.\n\n### Divergências Relevantes de Gestão e Acesso:\n1. **Oferta Psicoterápica no Primeiro Contato:** O NHS estruturou o programa nacional *Talking Therapies*, permitindo encaminhamento ágil e padronizado para sessões de TCC de baixa e alta intensidade. No SUS, o acesso a psicólogos nos NASF/eMulti ou CAPS é frequentemente deficitário, empurrando o médico de família para a prescrição medicamentosa precoce até mesmo em casos leves.\n2. **Fármaco de Distribuição Padrão na UBS:** O arsenal da maioria das farmácias municipais do SUS é composto fundamentalmente por Fluoxetina 20 mg e Amitriptilina 25 mg. A Sertralina está presente na RENAME, mas seu estoque sofre mais desabastecimentos regionais, enquanto o NICE elege a Sertralina como padrão primário global.\n3. **Protocolo Formal de Descontinuação:** A diretriz brasileira tem poucas orientações formais detalhadas sobre técnicas de desmame e prevenção da síndrome de descontinuação de antidepressivos, aspecto que o NICE NG222 aborda com extremo rigor técnico.",
    "bloco_prescricao_copiavel": "",
    "jurisdicao": "UK_NICE",
    "pais": "Reino Unido",
    "agencia": "NICE (National Institute for Health and Care Excellence)",
    "codigo_diretriz": "NICE Guideline NG222",
    "url_fonte": "https://www.nice.org.uk/guidance/ng222",
    "data_publicacao": "2022-06-29",
    "idioma_original": "en-GB",
    "equivalente_sus_id": "depressao_ansiedade_atencao_primaria",
    "tem_equivalente_sus": true,
    "disponibilidade_farmacos_rename_sus": "parcial",
    "medicamentos_exclusivos_estrangeiros": [
      "Vortioxetina (multimodal para depressão com comprometimento cognitivo)",
      "TCC digital estruturada via aplicativo integrado ao prontuário do NHS"
    ],
    "divergencias_relevantes_vs_sus": [
      "NICE orienta a NÃO prescrever antidepressivos rotineiramente como tratamento inicial para episódios de depressão leve, priorizando psicoterapias estruturadas (TCC de baixa intensidade, terapia comportamental ou exercícios em grupo).",
      "Sertralina é o Inibidor Seletivo da Recaptação de Serotonina (ISRS) de 1ª escolha padrão recomendado pelo NICE pelo menor índice de interações e maior segurança cardiológica; no SUS da atenção básica, a Fluoxetina 20 mg é a oferta preponderante nas farmácias de UBS.",
      "Instituição de protocolo obrigatório de retirada lenta e proporcional (desmame hiperbólico ao longo de semanas a meses) para prevenir síndrome de retirada de antidepressivos."
    ]
  },
  {
    "id_protocolo": "nice_ng245_asma_manejo_cronico",
    "titulo": "Asma no Adulto e Criança: Diagnóstico Objetivo (FeNO, Espirometria) e Manejo Escalonado MART",
    "cids_relacionados": [
      "J45",
      "J45.0",
      "J45.1",
      "J45.9"
    ],
    "ciaps_relacionados": [
      "R96"
    ],
    "categoria": "pneumologia",
    "nivel_atencao": "Atencao_Primaria_e_Especializada",
    "data_revisao": "2024-11-27",
    "status_revisao_clinica": "documento_oficial_governamental",
    "conteudo_markdown": "# Diretriz Clínica Governamental: Asma Crônica (NICE NG245 / BTS / SIGN)\n\n## 1. Identificação e Metadados da Fonte Oficial\n* **Agência Emissora:** Parceria conjunta entre NICE, British Thoracic Society (BTS) e Scottish Intercollegiate Guidelines Network (SIGN) - Reino Unido.\n* **Código de Referência:** NICE Guideline NG245 (Substitui e unifica as diretrizes NG80 e SIGN 158).\n* **Link Oficial:** [https://www.nice.org.uk/guidance/ng245](https://www.nice.org.uk/guidance/ng245)\n* **Público-alvo:** Médicos de família, pneumologistas, pediatras e equipes de enfermagem respiratória.\n\n---\n\n## 2. Critérios Diagnósticos Objetivos Oficiais\n\n### Algoritmo Diagnóstico para Adultos e Crianças $\\ge 5$ anos:\n1. **FeNO (Fração de Óxido Nítrico Exalado):**\n   * $\\ge 40\\text{ ppb}$ em adultos ($\\ge 35\\text{ ppb}$ em crianças): marcador de inflamação eosinofílica das vias aéreas.\n2. **Espirometria com Prova Broncodilatadora (PBD):**\n   * Relação $\\text{VEF}_1/\\text{CVF} < 0,70$ (ou abaixo do limite inferior da normalidade - LIN), com melhora de $\\text{VEF}_1 \\ge 12\\%$ **E** $\\ge 200\\text{ mL}$ após $400\\text{ mcg}$ de Salbutamol inalatório.\n3. **Variabilidade do Pico de Fluxo Expiratório (PFE / PEF):**\n   * Se espirometria normal ou duvidosa: monitorar diário de PFE por 2 a 4 semanas. Variabilidade diurna $> 20\\%$ confirma hiper-responsividade brônquica.\n\n---\n\n## 3. Escalonamento Terapêutico (NICE/BTS Stepwise Approach)\n\n### Princípio Fundamental de Segurança:\n* **Fim da Monoterapia com SABA:** Todo paciente com asma necessita de corticoide inalatório (CI) desde o início dos sintomas para controlar a cascata inflamatória subjacente.\n\n### Etapas de Tratamento no Adulto ($\\ge 12$ anos):\n\n#### Step 1 e Step 2 (Sintomas Leves a Moderados):\n* **Opção Preferencial (Estratégia MART / SMART):**\n  * **Budesonida + Formoterol (160/4,5 mcg ou 200/6 mcg)**: 1 inalação 1 a 2x ao dia como manutenção **E** 1 inalação adicional conforme a necessidade para alívio imediato dos sintomas (máximo de 8 a 12 inalações totais/dia em crises).\n* **Opção Alternativa (Terapia Fixa Convencional):**\n  * Corticoide Inalatório em dose baixa regular (ex: Beclometasona $100\\text{--}200\\text{ mcg}$ 2x/dia ou Budesonida $200\\text{ mcg}$ 2x/dia) **+** SABA (Salbutamol $100\\text{ mcg}$ 1 a 2 jatos) estritamente para alívio agudo.\n\n#### Step 3 (Asma Não Controlada no Step 2):\n* Aumentar dose de CI para moderada (ex: Budesonida $400\\text{ mcg}$ 2x/dia ou Beclometasona dipropionato $400\\text{ mcg}$ 2x/dia) associado a LABA (Formoterol $12\\text{ mcg}$ 2x/dia ou Salmeterol $50\\text{ mcg}$ 2x/dia).\n* Avaliar associação de **Antagonista do Receptor de Leucotrieno (LTRA)**: Montelucaste de sódio $10\\text{ mg}$ 1x/dia à noite.\n\n#### Step 4 (Asma Grave / Refratária):\n* Otimizar para CI em dose alta + LABA + Antimuscarínico de Longa Ação (LAMA - Tiotrópio $5\\text{ mcg}$ névoa suave ou $18\\text{ mcg}$ pó inalatório) -> **Terapia Tripla Inalatória**.\n* Encaminhar para centro especializado de asma grave para fenotipagem e consideração de imunobiológicos (Omalizumabe se alérgica IgE elevada, Mepolizumabe/Benralizumabe se padrão eosinofílico, ou Tezepelumabe).\n\n---\n\n## 4. Análise Comparada com o SUS / Brasil\n\n### Convergências:\n* Tanto o GINA incorporado pela Sociedade Brasileira de Pneumologia e Tisiologia (SBPT) quanto o NICE condenam o tratamento baseado exclusivamente em broncodilatador de curta ação isolado.\n* O SUS disponibiliza Beclometasona em spray e Budesonida em pó/spray na Farmácia Popular sem custos.\n\n### Divergências Relevantes de Gestão e Acesso:\n1. **Dispensação Desconectada na APS:** Na prática rotineira do SUS brasileiro, muitos pacientes recebem exclusivamente frascos de Salbutamol 100 mcg na UBS para crises episódicas sem que haja a adesão vinculada ao corticoide inalatório regular, elevando o risco de exacerbação grave.\n2. **Acesso à Associação Formoterol + Budesonida (MART):** No SUS, a associação fixa em pó/spray comumente exige abertura de processo administrativo de medicamentos especiais em secretarias estaduais ou Farmácia Especializada, enquanto no Reino Unido é prescrita e retirada imediatamente na farmácia comunitária da atenção básica.\n3. **Disponibilidade de Exames Propedêuticos:** O NHS garante acesso regional à dosagem de FeNO e Espirometria ambulatorial célere; nas UBS do Brasil, o teste de reversibilidade espirométrica pode demorar meses na fila do SISREG.",
    "bloco_prescricao_copiavel": "",
    "jurisdicao": "UK_NICE",
    "pais": "Reino Unido",
    "agencia": "NICE / BTS / SIGN (National Institute for Health and Care Excellence)",
    "codigo_diretriz": "NICE Guideline NG245",
    "url_fonte": "https://www.nice.org.uk/guidance/ng245",
    "data_publicacao": "2024-11-27",
    "idioma_original": "en-GB",
    "equivalente_sus_id": "asma_tratamento_manutencao_gina",
    "tem_equivalente_sus": true,
    "disponibilidade_farmacos_rename_sus": "parcial",
    "medicamentos_exclusivos_estrangeiros": [
      "Medição de FeNO (Óxido Nítrico Exalado) rotineira na atenção básica",
      "Tezepelumabe (anti-TSLP) e Dupilumabe (anti-IL-4R) amplamente acessíveis em ambulatório secundário"
    ],
    "divergencias_relevantes_vs_sus": [
      "NICE/BTS/SIGN proíbem terminantemente a prescrição de broncodilatador de curta ação isolado (SABA como Salbutamol) como terapia única regular, devido ao risco aumentado de exacerbação grave e morte por asma.",
      "Adoção preferencial da estratégia MART (Maintenance and Reliever Therapy) com Budesonida + Formoterol em dose única, servindo simultaneamente para manutenção diária e alívio das crises.",
      "Exigência de testes fisiológicos objetivos (FeNO >= 40 ppb e reversibilidade na espirometria de pelo menos 12% e 200 mL) antes de firmar diagnóstico de asma em maiores de 5 anos; no SUS da APS, o diagnóstico clínico-empírico ainda prevalece."
    ]
  },
  {
    "id_protocolo": "nice_ng250_pneumonia_adquirida_comunidade",
    "titulo": "Pneumonia Adquirida na Comunidade no Adulto: Estratificação por CRB65, Teste de PCR Point-of-Care e Antimicrobianos",
    "cids_relacionados": [
      "J13",
      "J15",
      "J18",
      "J18.0",
      "J18.9"
    ],
    "ciaps_relacionados": [
      "R81"
    ],
    "categoria": "pneumologia_infecciosa",
    "nivel_atencao": "Atencao_Primaria_e_Urgencia",
    "data_revisao": "2024-10-30",
    "status_revisao_clinica": "documento_oficial_governamental",
    "conteudo_markdown": "# Diretriz Clínica Governamental: Pneumonia Adquirida na Comunidade (NICE NG250)\n\n## 1. Identificação e Metadados da Fonte Oficial\n* **Agência Emissora:** National Institute for Health and Care Excellence (NICE) - National Health Service (NHS), Reino Unido.\n* **Código de Referência:** NICE Guideline NG250 (Substitui e atualiza a diretriz antimicrobiana NG138).\n* **Link Oficial:** [https://www.nice.org.uk/guidance/ng250](https://www.nice.org.uk/guidance/ng250)\n* **Público-alvo:** Médicos de atenção primária, emergencistas e clínicos gerais.\n\n---\n\n## 2. Diagnóstico e Estratificação de Gravidade (CRB65)\n\n### Diagnóstico Clínico e Decisão com PCR Point-of-Care (Atenção Básica):\nNa suspeita clínica de infecção do trato respiratório inferior em que o diagnóstico de pneumonia seja incerto:\n* **PCR < 20 mg/L:** Não prescrever antibióticos rotineiramente; orientar sinais de alerta e hidratação.\n* **PCR entre 20 e 100 mg/L:** Considerar receita médica de uso tardio (*delayed prescription*) caso os sintomas piorem ou não melhorem após 48 a 72 horas.\n* **PCR > 100 mg/L:** Prescrever antibioticoterapia imediatamente.\n\n### Escore de Risco CRB65 (Aplicável em Consultório / Ambulatório):\n1 ponto para cada parâmetro presente:\n* **C (Confusion):** Confusão mental aguda (desorientação têmporo-espacial ou escore abreviado $\\le 8$).\n* **R (Respiratory rate):** Frequência respiratória $\\ge 30\\text{ irpm}$.\n* **B (Blood pressure):** Pressão arterial sistólica $< 90\\text{ mmHg}$ ou diastólica $\\le 60\\text{ mmHg}$.\n* **65:** Idade $\\ge 65$ anos.\n\n#### Conduta pelo CRB65:\n* **Escore 0 (Baixo Risco):** Mortalidade $< 1\\%$. Tratamento domiciliar seguro com antibiótico oral.\n* **Escore 1 ou 2 (Risco Intermediário):** Avaliar suporte social e fragilidade; considerar encaminhamento hospitalar para exames complementares (Raio-X de tórax e exames laboratoriais/CURB65 com ureia).\n* **Escore 3 ou 4 (Alto Risco):** Mortalidade $> 15\\%$. Encaminhamento hospitalar urgente com suporte avançado.\n\n---\n\n## 3. Escalonamento Antimicrobiano Racional\n\n### PAC de Baixa Gravidade (CRB65 = 0) - Tratamento Oral Domiciliar:\n* **1ª Linha (Padrão Ouro):**\n  * **Amoxicilina $500\\text{ mg}$ por via oral a cada 8 horas durante 5 dias**.\n* **Alternativa se Alergia a Penicilinas:**\n  * **Doxiciclina $200\\text{ mg}$ dose de ataque no dia 1, seguida por $100\\text{ mg}$ 1x/dia do dia 2 ao dia 5 (total 5 dias)**; **OU**\n  * **Claritromicina $500\\text{ mg}$ por via oral a cada 12 horas durante 5 dias**.\n\n### PAC de Moderada a Alta Gravidade (CRB65 $\\ge 1$ / Internação Hospitalar):\n* **Terapia Combinada (Cobertura de Germes Típicos + Atípicos):**\n  * **Amoxicilina $500\\text{ mg}$ a $1.000\\text{ mg}$ a cada 8 horas** associada a **Claritromicina $500\\text{ mg}$ a cada 12 horas** durante 5 dias; **OU**\n  * **Amoxicilina/Clavulanato $500/125\\text{ mg}$ a cada 8 horas ou $875/125\\text{ mg}$ a cada 12 horas** associada a Claritromicina $500\\text{ mg}$ 12/12h.\n* **Se via intravenosa necessária (sepse ou intolerância gástrica):**\n  * Co-amoxiclav (Amoxicilina/Clavulanato $1,2\\text{ g}$ IV 8/8h) + Claritromicina $500\\text{ mg}$ IV 12/12h. Transicionar para via oral nas primeiras 48h de estabilidade hemodinâmica e apirexia.\n\n---\n\n## 4. Análise Comparada com o SUS / Brasil\n\n### Convergências:\n* Amoxicilina oral continua sendo a droga de escolha principal tanto nas recomendações do Ministério da Saúde do Brasil / SBPT quanto no NICE para pneumonias não graves comunitárias em pacientes sem comorbidades descompensadas.\n* Ambas as diretrizes recomendam a transição célere da via intravenosa para via oral assim que observada melhora clínica.\n\n### Divergências Relevantes de Gestão e Acesso:\n1. **Duração do Tratamento:** Enquanto a medicina de família brasileira tradicionalmente prescreve 7 a 10 dias de antibioticoterapia, o protocolo do Reino Unido consolidou a segurança do tratamento ultracurto de 5 dias, diminuindo a resistência bacteriana e toxicidade farmacológica.\n2. **Uso de PCR no Point-of-Care:** O NHS disponibiliza kits de PCR com dosagem digital rápida de ponta de dedo no próprio consultório do clínico geral, evitando a sobreprescrição de antibióticos em infecções virais autolimitadas. No SUS, a dosagem de PCR depende de coleta venosa laboratorial que frequentemente demora mais de 24 horas para laudo.\n3. **Alternativas a Penicilinas:** O NICE enfatiza fortemente a Doxiciclina como opção preferencial por menor indução de resistência bacteriana e boa cobertura para germes atípicos (*Mycoplasma pneumoniae*, *Chlamydophila*), enquanto na atenção básica do Brasil a Azitromicina 500mg ainda é mais rotineiramente prescrita.",
    "bloco_prescricao_copiavel": "",
    "jurisdicao": "UK_NICE",
    "pais": "Reino Unido",
    "agencia": "NICE (National Institute for Health and Care Excellence)",
    "codigo_diretriz": "NICE Guideline NG250",
    "url_fonte": "https://www.nice.org.uk/guidance/ng250",
    "data_publicacao": "2024-10-30",
    "idioma_original": "en-GB",
    "equivalente_sus_id": "pneumonia_adquirida_comunidade",
    "tem_equivalente_sus": true,
    "disponibilidade_farmacos_rename_sus": "total",
    "medicamentos_exclusivos_estrangeiros": [],
    "divergencias_relevantes_vs_sus": [
      "NICE orienta a utilização de dosagem rápida de Proteína C Reativa (PCR Point-of-Care) na atenção básica para diferenciar infecção autolimitada de pneumonia bacteriana: PCR < 20 mg/L contraindica antibiótico de rotina; PCR > 100 mg/L indica início imediato.",
      "Duração padrão do tratamento antibiótico reduzida para 5 dias em casos de gravidade baixa a moderada com boa resposta clínica, contrastando com os habituais 7 a 10 dias prescritos no Brasil.",
      "Uso padronizado e sistemático do escore CRB65 (que não exige dosagem sérica de ureia) para definir internação hospitalar imediata vs. tratamento domiciliar seguro."
    ]
  },
  {
    "id_protocolo": "nice_ng28_diabetes_tipo2",
    "titulo": "Diabetes Mellitus Tipo 2 no Adulto: Manejo Farmacológico com Metformina, iSGLT2 e Análogos GLP-1/GIP",
    "cids_relacionados": [
      "E11",
      "E11.2",
      "E11.4",
      "E11.9"
    ],
    "ciaps_relacionados": [
      "T90"
    ],
    "categoria": "metabolico_endocrino",
    "nivel_atencao": "Atencao_Primaria_e_Especializada",
    "data_revisao": "2026-02-18",
    "status_revisao_clinica": "documento_oficial_governamental",
    "conteudo_markdown": "# Diretriz Clínica Governamental: Diabetes Tipo 2 no Adulto (NICE NG28)\n\n## 1. Identificação e Metadados da Fonte Oficial\n* **Agência Emissora:** National Institute for Health and Care Excellence (NICE) - National Health Service (NHS), Reino Unido.\n* **Código de Referência:** NICE Guideline NG28 (Atualização com evidências de 2026).\n* **Link Oficial:** [https://www.nice.org.uk/guidance/ng28](https://www.nice.org.uk/guidance/ng28)\n* **Escopo:** Diagnóstico, metas individualizadas de hemoglobina glicada ($\\text{HbA}_{1c}$), rastreio de complicações micro e macrovasculares e farmacoterapia protetora de órgãos.\n\n---\n\n## 2. Metas Glicêmicas e Monitoramento Clínico\n\n### Alvos de Hemoglobina Glicada ($\\text{HbA}_{1c}$):\n* **Alvo Padrão (Sem fármacos com risco de hipoglicemia):**\n  * $\\text{HbA}_{1c} \\le 48\\text{ mmol/mol}$ ($6,5\\%$) se manejado exclusivamente com estilo de vida ou monoterapia com Metformina.\n* **Alvo de Segurança (Em uso de fármacos com risco de hipoglicemia - Sulfonilureias / Insulina):**\n  * $\\text{HbA}_{1c} \\le 53\\text{ mmol/mol}$ ($7,0\\%$) para evitar hipoglicemias sintomáticas ou assintomáticas.\n* **Metas Relaxadas:** $\\text{HbA}_{1c} \\le 58\\text{ a }64\\text{ mmol/mol}$ ($7,5\\%\\text{--}8,0\\%$) para idosos frágeis, histórico de hipoglicemia grave ou expectativa de vida reduzida.\n\n---\n\n## 3. Escalonamento Farmacológico Oficial (NICE Algorithm)\n\n### 1ª Linha (Terapia Inicial):\n1. **Metformina de Liberação Padrão ou Prolongada (XR):**\n   * Titulação: iniciar com $500\\text{ mg/dia}$ às refeições; titular até $1.000\\text{ mg}$ 2x/dia (dose máxima efetiva: $2.000\\text{ a }2.550\\text{ mg/dia}$).\n2. **Avaliação Precoce de Doença Cardiovascular Estabelecida (DCV), IC ou Risco CV Elevado:**\n   * **Se DCV aterosclerótica estabelecida, Insuficiência Cardíaca crônica ou $\\text{QRISK3} \\ge 10\\%$:**\n     * Adicionar **Inibidor do Cotransportador Sódio-Glicose 2 (iSGLT2)** com benefício cardiovascular comprovado (Dapagliflozina $10\\text{ mg/dia}$ ou Empagliflozina $10\\text{ a }25\\text{ mg/dia}$) **junto ou logo após** o início da Metformina, sem aguardar desfecho de falha glicêmica isolada.\n   * Se contraindicação ou intolerância gastrointestinal severa à Metformina: monoterapia com iSGLT2 ou Inibidor da DPP-4 (Sitagliptina $100\\text{ mg/dia}$).\n\n### 2ª Linha (Dual Therapy - Se $\\text{HbA}_{1c} >$ Meta após 3 a 6 meses):\n* Adicionar uma segunda classe de acordo com o perfil fenotípico:\n  * **Se iSGLT2 já em uso com Metformina:** Adicionar Inibidor de DPP-4 (ex: Sitagliptina $100\\text{ mg}$, Linagliptina $5\\text{ mg}$), Agonista do Receptor GLP-1, Pioglitazona ($15\\text{--}30\\text{ mg/dia}$) ou Sulfonilureia (Gliclazida MR $30\\text{--}120\\text{ mg/dia}$).\n  * **Se obesidade grau II/III ($\\text{IMC} \\ge 35\\text{ kg/m}^2$) ou DCV grave:** Considerar indicação de **Agonista do Receptor GLP-1** (Dulaglutida $1,5\\text{ mg}$ SC 1x/sem ou Semaglutida $0,5\\text{--}1,0\\text{ mg}$ SC 1x/sem) ou **Tirzepatida**.\n\n### 3ª Linha (Terapia Tripla e Insulinoterapia):\n* Metformina + iSGLT2 + (iDPP-4 ou GLP-1 RA ou Pioglitazona ou Sulfonilureia).\n* Se persistir fora da meta ou sinais clínicos de catabolismo (perda ponderal inexplicada, cetose):\n  * Iniciar **Insulina Basal** (Insulina NPH ou análogos de ação prolongada como Glargina ou Degludeca), habitualmente $10\\text{ UI}$ ou $0,1\\text{ a }0,2\\text{ UI/kg}$ ao deitar.\n\n---\n\n## 4. Análise Comparada com o SUS / Brasil\n\n### Convergências:\n* Metformina permanece universalmente como o alicerce fundamental do tratamento inicial do DM2 tanto no SUS quanto no NHS/NICE.\n* Reconhecimento formal da nefroproteção e cardioproteção promovida pelos iSGLT2 em pacientes de alto risco.\n\n### Divergências Relevantes de Gestão e Acesso:\n1. **Critérios de Acesso aos iSGLT2:** O PCDT do Ministério da Saúde restringe a Dapagliflozina para idosos ($\\ge 65$ anos) com evento cardiovascular prévio ou portadores de insuficiência cardíaca / DRC avançada. No NICE, a prescrição é ampla a qualquer adulto com DCV estabelecida ou risco elevado, independentemente do teto etário de 65 anos.\n2. **Agonistas GLP-1 e Duplos Agonistas (GIP/GLP-1):** O NHS subsidia análogos de GLP-1 e Tirzepatida para DM2 com obesidade ou alto risco cardiovascular; no SUS, os análogos de GLP-1 não estão na RENAME para DM2 na atenção básica.\n3. **Papel das Sulfonilureias:** Enquanto o SUS utiliza intensamente a Gliclazida MR como o segundo fármaco obrigatório na UBS por custo e disponibilidade, o NICE desestimula sua utilização rotineira precoce devido ao risco cumulativo de hipoglicemia e esgotamento da célula beta.",
    "bloco_prescricao_copiavel": "",
    "jurisdicao": "UK_NICE",
    "pais": "Reino Unido",
    "agencia": "NICE (National Institute for Health and Care Excellence)",
    "codigo_diretriz": "NICE Guideline NG28",
    "url_fonte": "https://www.nice.org.uk/guidance/ng28",
    "data_publicacao": "2015-12-02",
    "idioma_original": "en-GB",
    "equivalente_sus_id": "diabetes_tipo2_associacao_metformina_isglt2",
    "tem_equivalente_sus": true,
    "disponibilidade_farmacos_rename_sus": "parcial",
    "medicamentos_exclusivos_estrangeiros": [
      "Tirzepatida (duplo agonista GLP-1/GIP)",
      "Semaglutida injetável/oral para DM2 em atenção primária",
      "Empagliflozina / Ertugliflozina de dispensação universal"
    ],
    "divergencias_relevantes_vs_sus": [
      "A diretriz NICE NG28 posiciona os inibidores de SGLT2 (Dapagliflozina, Empagliflozina) como terapia de 1ª linha em combinação com a Metformina desde o diagnóstico para pacientes com alto risco cardiovascular, insuficiência cardíaca ou doença renal crônica.",
      "Sulfonilureias (Gliclazida) perderam espaço como 2ª linha mandatória no NICE devido ao risco de hipoglicemia e ganho de peso, dando lugar a iSGLT2, agonistas do receptor GLP-1 e inibidores de DPP-4.",
      "No SUS (Conitec / RENAME), a Dapagliflozina 10 mg foi incorporada com critérios restritos de idade (idade >= 65 anos com DCV estabelecida) ou DRC com albuminúria, mantendo a Gliclazida MR e Insulina NPH como escolhas preponderantes na UBS após a Metformina."
    ]
  },
  {
    "id_protocolo": "nice_ta875_ta1026_obesidade_glp1_gip",
    "titulo": "Sobrepeso e Obesidade: Manejo com Agonistas GLP-1 (Semaglutida) e Coagonistas GLP-1/GIP (Tirzepatida)",
    "cids_relacionados": [
      "E66",
      "E66.0",
      "E66.8",
      "E66.9"
    ],
    "ciaps_relacionados": [
      "T82",
      "T83"
    ],
    "categoria": "metabolico_endocrino",
    "nivel_atencao": "Atencao_Primaria_e_Especializada",
    "data_revisao": "2025-01-20",
    "status_revisao_clinica": "documento_oficial_governamental",
    "conteudo_markdown": "# Diretriz Clínica Governamental: Tratamento Farmacológico da Obesidade (NICE TA875 / TA1026 & FDA)\n\n## 1. Identificação e Metadados da Fonte Oficial\n* **Agências Emissoras:** \n  * National Institute for Health and Care Excellence (NICE) - Reino Unido: Avaliações de Tecnologia em Saúde TA875 (Semaglutida) e TA1026 (Tirzepatida).\n  * Food and Drug Administration (FDA) - Estados Unidos: Aprovações regulatórias para Wegovy (Semaglutida) e Zepbound (Tirzepatida).\n* **Links Oficiais:** \n  * [NICE Guidance TA875 (Semaglutida para Obesidade)](https://www.nice.org.uk/guidance/ta875)\n  * [NICE Guidance TA1026 (Tirzepatida para Obesidade)](https://www.nice.org.uk/guidance/ta1026)\n  * [FDA Drug Information: Wegovy / Zepbound](https://www.fda.gov/drugs)\n\n---\n\n## 2. Critérios de Elegibilidade e Seleção de Pacientes\n\n### Indicações Oficiais:\nIndicados como adjuvantes a uma dieta com restrição calórica e aumento de atividade física para manejo crônico de peso em adultos com:\n* **IMC $\\ge 30\\text{ kg/m}^2$** (Obesidade clínica definida); **OU**\n* **IMC entre $27\\text{ kg/m}^2$ e $29,9\\text{ kg/m}^2$** (Sobrepeso) associado a pelo menos uma comorbidade ponderal relevante:\n  * Disglicemia (intolerância à glicose ou pré-diabetes);\n  * Hipertensão arterial sistêmica;\n  * Dislipidemia aterogênica;\n  * Apneia obstrutiva do sono (SAOS);\n  * Doença cardiovascular estabelecida (indicação formal de proteção cardiovascular secundária da Semaglutida aprovada pelo FDA / ensaio SELECT).\n\n### Contraindicações e Precauções Formais:\n* **Contraindicação Absoluta:** Histórico pessoal ou familiar de carcinoma medular de tireoide (CMT) ou síndrome de Neoplasia Endócrina Múltipla tipo 2 (NEM-2). Gestação e lactação.\n* **Precauções:** Pancreatite prévia, colelitíase, gastroparesia grave, desidratação e lesão renal aguda por hipovolemia.\n\n---\n\n## 3. Posologia e Esquema Escalonado de Titulação\n\n### Esquema A: Semaglutida Subcutânea (Wegovy)\nAdministração semanal no mesmo dia da semana, por via subcutânea (abdome, coxa ou braço):\n* **Semanas 1 a 4:** $0,25\\text{ mg}$ SC 1x/semana (dose inicial de adaptação gastrointestinal).\n* **Semanas 5 a 8:** $0,50\\text{ mg}$ SC 1x/semana.\n* **Semanas 9 a 12:** $1,0\\text{ mg}$ SC 1x/semana.\n* **Semanas 13 a 16:** $1,7\\text{ mg}$ SC 1x/semana.\n* **Semana 17 em diante:** **$2,4\\text{ mg}$ SC 1x/semana** (dose terapêutica plena de manutenção).\n\n### Esquema B: Tirzepatida Subcutânea (Zepbound)\nCoagonista dos receptores GIP e GLP-1:\n* **Semanas 1 a 4:** $2,5\\text{ mg}$ SC 1x/semana (dose inicial não terapêutica).\n* **Semanas 5 a 8:** $5,0\\text{ mg}$ SC 1x/semana.\n* **Titulação:** Aumentar em degraus de $2,5\\text{ mg}$ a cada 4 semanas, conforme resposta e tolerância, até as doses de manutenção de $10\\text{ mg}$ ou $15\\text{ mg}$ SC 1x/semana (dose máxima aprovada).\n\n### Critérios de Avaliação de Eficácia e Parada (*Stopping Rules*):\n* **Regra dos 5%:** O tratamento deve ser reavaliado após 12 a 16 semanas no teto terapêutico. Se o paciente não tiver alcançado pelo menos **$5\\%$ de perda do peso inicial**, o medicamento deve ser suspenso devido à falta de resposta individual (*non-responder*).\n* No NHS (Reino Unido), a cobertura pública máxima para Semaglutida no serviço de controle de peso nível 3/4 é estipulada em até 2 anos de duração contínua.\n\n---\n\n## 4. Análise Comparada com o SUS / Brasil\n\n### Convergências:\n* Tanto as entidades brasileiras (ABESO/SBEM) quanto as agências internacionais enfatizam que nenhuma farmacoterapia é curativa isoladamente, exigindo reeducação alimentar consistente, suporte comportamental e prática regular de atividade física aeróbica e de resistência para preservação de massa muscular.\n\n### Divergências Relevantes de Gestão e Acesso:\n1. **Ausência Completa na Tabela SUS / RENAME:** O Sistema Único de Saúde não disponibiliza análogos de GLP-1 ou coagonistas GIP/GLP-1 para o tratamento da obesidade em nenhuma instância da atenção básica ou especializada. No Brasil, o acesso a esses fármacos se dá quase que exclusivamente por desembolso direto do paciente no setor farmacêutico privado ou por judicialização.\n2. **Abordagem Estruturada de Serviços Especializados:** O modelo britânico integra a prescrição de incretinas a clínicas especializadas multidisciplinares de controle de peso (*Tier 3 Weight Management Services*), com nutricionistas, psicólogos e educadores físicos, garantindo adesão segura.\n3. **Manejo da Esofagite e Efeitos Gastrointestinais:** Devido ao custo elevado no Brasil, observa-se frequentemente a subdosagem não aprovada ou interrupções precoces sem supervisão médica, ao passo que as diretrizes internacionais estabelecem protocolos claros de titulação lenta e manejo de náuseas.",
    "bloco_prescricao_copiavel": "",
    "jurisdicao": "UK_NICE",
    "pais": "Reino Unido / Estados Unidos",
    "agencia": "NICE (Reino Unido) / FDA (Estados Unidos)",
    "codigo_diretriz": "NICE TA875, NICE TA1026 e FDA Labeling Wegovy/Zepbound",
    "url_fonte": "https://www.nice.org.uk/guidance/ta875",
    "data_publicacao": "2023-03-08",
    "idioma_original": "en-GB",
    "equivalente_sus_id": "",
    "tem_equivalente_sus": false,
    "disponibilidade_farmacos_rename_sus": "ausente_no_sus",
    "medicamentos_exclusivos_estrangeiros": [
      "Semaglutida 2,4 mg subcutânea semanal (Wegovy)",
      "Tirzepatida 2,5 mg a 15 mg subcutânea semanal (Zepbound)",
      "Liraglutida 3,0 mg subcutânea diária (Saxenda)"
    ],
    "divergencias_relevantes_vs_sus": [
      "O NICE e o FDA tratam a obesidade como doença crônica recidivante com indicação formal de farmacoterapia avançada com incretinomiméticos (Semaglutida 2,4 mg ou Tirzepatida até 15 mg semanal) como adjuvante de dieta hipocalórica e atividade física.",
      "Critérios objetivos de resposta (Stopping Rules): descontinuação mandatória se o paciente não perder pelo menos 5% do peso corporal total após 12 ou 26 semanas na dose de manutenção.",
      "No SUS brasileiro, nenhum análogo de GLP-1 ou coagonista GIP/GLP-1 é fornecido pela RENAME para obesidade, limitando a oferta pública a orientações de estilo de vida na UBS e cirurgia bariátrica hospitalar em longas filas de espera."
    ]
  },
  {
    "id_protocolo": "who_arboviroses_dengue_2025",
    "titulo": "Dengue e Arboviroses: Diretrizes Globais OMS para Manejo Clínico e Hidratação Guiada",
    "cids_relacionados": [
      "A90",
      "A91",
      "A92.0",
      "A92.8"
    ],
    "ciaps_relacionados": [
      "A77",
      "A97"
    ],
    "categoria": "infectologia_tropical",
    "nivel_atencao": "Atencao_Primaria_e_Urgencia",
    "data_revisao": "2025-07-04",
    "status_revisao_clinica": "documento_oficial_governamental",
    "conteudo_markdown": "# Diretriz Clínica Governamental: Manejo Clínico da Dengue (OMS / WHO 2025)\n\n## 1. Identificação e Metadados da Fonte Oficial\n* **Agência Emissora:** Organização Mundial da Saúde (OMS / WHO) - Genebra, Suíça.\n* **Referência Oficial:** *WHO guidelines for clinical management of arboviral diseases: dengue, chikungunya, Zika and yellow fever* (ISBN: 9789240111110).\n* **Link Oficial:** [https://www.who.int/publications/i/item/9789240111110](https://www.who.int/publications/i/item/9789240111110)\n* **Público-alvo:** Médicos de atenção primária, emergencistas, intensivistas, pediatras e equipes de enfermagem em áreas endêmicas de arboviroses.\n\n---\n\n## 2. Fases Clínicas e Classificação de Gravidade da OMS\n\n### Curso Temporal da Doença:\n1. **Fase Febril (Dias 1 a 3):** Febre súbita alta ($39\\text{--}40^\\circ\\text{C}$), cefaleia retrorbitária, mialgias intensas, artralgia, náuseas, vômitos e exantema macular.\n2. **Fase Crítica (Dias 3 a 7 - Período da Defervescência):** Coincide com a queda da febre. É o momento de maior vulnerabilidade clínica pelo surgimento do **extravasamento plasmático capilar**, que pode durar de 24 a 48 horas.\n3. **Fase de Recuperação (Dias 7 a 10):** Reabsorção do fluido extravasado de volta para o compartimento intravascular, estabilização hemodinâmica e surgimento do exantema tardio (*ilhas brancas em mar vermelho*), com prurido intenso.\n\n### Classificação Oficial de Gravidade (OMS):\n\n#### 1. Dengue Sem Sinais de Alarme:\n* Febre associada a pelo menos dois sintomas constitucionais (náusea, cefaleia, mialgia, dor retro-ocular, leucopenia).\n\n#### 2. Dengue Com Sinais de Alarme (Sinais de Extravasamento Iminente):\nPresença de **qualquer um** dos seguintes sinais clínicos:\n* Dor abdominal intensa e contínua, ou à palpação;\n* Vômitos persistentes ($\\ge 3$ episódios em 1 hora ou $\\ge 4$ episódios em 6 horas);\n* Acúmulo clínico de fluidos (derrame pleural, ascite, espessamento da parede da vesícula biliar ao ultrassom);\n* Sangramento de mucosas (gengivorragia, epistaxe, metrorragia desproporcional);\n* Letargia, sonolência anormal ou irritabilidade psicomotora;\n* Hepatomegalia dolorosa $> 2\\text{ cm}$ abaixo do rebordo costal direito;\n* **Aumento progressivo do Hematócrito (Htc)** concomitante à **queda abrupta na contagem de plaquetas**.\n\n#### 3. Dengue Grave (*Severe Dengue*):\n* Extravasamento grave de plasma cursando com **Choque da Dengue** (taquicardia, extremidades frias, pulso filiforme, tempo de enchimento capilar $> 2\\text{ segundos}$, pressão de pulso convergente $\\le 20\\text{ mmHg}$) ou desconforto respiratório por acúmulo de líquidos;\n* Hemorragia clinicamente grave (hematêmese, melena, hemoptise maciça);\n* Disfunção orgânica grave (AST/ALT $\\ge 1.000\\text{ UI/L}$, miocardite, alteração do nível de consciência/encefalite, lesão renal aguda).\n\n---\n\n## 3. Protocolos de Hidratação e Racional Terapêutico\n\n### Dengue Sem Sinais de Alarme (Manejo Ambulatorial / Domiciliar):\n* **Hidratação Oral Vigorosa:** $60\\text{ a }80\\text{ mL/kg/dia}$ (sendo $1/3$ na forma de Solução de Reidratação Oral [SRO] e $2/3$ em líquidos caseiros como água de coco, sucos naturais e sopas salgadas).\n* **Sintomáticos Seguros:**\n  * Paracetamol $500\\text{ a }750\\text{ mg}$ VO a cada 6 horas (dose máxima: $3\\text{ g/dia}$ no adulto para prevenir toxicidade hepática no contexto de hepatopatia da dengue); ou Dipirona $500\\text{ a }1.000\\text{ mg}$ 6/6h.\n* **Proibição Absoluta de AINEs e Salicilatos:** Aspirina/AAS, Ibuprofeno, Cetoprofeno, Diclofenaco e Piroxicam são contraindicados devido ao risco de gastrite hemorrágica e disfunção plaquetária induzida.\n\n### Dengue Com Sinais de Alarme (Internação Obrigatória / Observação):\n* Obter hematócrito basal antes de infundir fluidos.\n* **Fase de Expansão com Cristaloide Isotônico (Ringer Lactato ou Soro Fisiológico 0,9%):**\n  * Iniciar com **$10\\text{ mL/kg}$ por via intravenosa na 1ª hora** (ou $5\\text{ a }7\\text{ mL/kg/h}$ por 2 a 4 horas).\n  * Reavaliar clinicamente e por hematócrito:\n    * Se melhora clínica e queda do Htc: reduzir gradativamente para $3\\text{ a }5\\text{ mL/kg/h}$ por 2 a 4 horas; depois $2\\text{ a }3\\text{ mL/kg/h}$ por 24 a 48 horas.\n    * Interromper a hidratação venosa assim que o paciente conseguir ingerir líquidos e a fase crítica de 48h tiver transcorrido.\n\n### Dengue Grave / Choque (Tratamento de Emergência):\n* **Ressuscitação Volêmica Imediata:**\n  * Administrar bólus de cristaloide isotônico aquecido na velocidade de **$20\\text{ mL/kg}$ em 15 a 30 minutos**.\n  * Se persistência do choque: repetir segundo bólus de cristaloide a $20\\text{ mL/kg}$.\n  * Se choque refratário com hematócrito elevado: considerar solução coloide (Albumina $20\\%$ ou derivados sintéticos) $10\\text{ a }20\\text{ mL/kg}$ em 30 a 60 min.\n  * Se choque refratário com queda súbita do hematócrito: suspeitar fortemente de **hemorragia interna oculta** (trato gastrointestinal) $\\rightarrow$ realizar prova cruzada e transfundir **Concentrado de Hemácias** imediatamente ($10\\text{ mL/kg}$).\n\n---\n\n## 4. Análise Comparada com o SUS / Brasil\n\n### Convergências:\n* Tanto o protocolo do Ministério da Saúde do Brasil (10 Passos do Manejo da Dengue) quanto o da OMS colocam a reposição precoce de fluidos como a única intervenção com poder real de reduzir a mortalidade da dengue para níveis inferiores a $1\\%$.\n* Consenso sobre não transfundir plaquetas profilaticamente e proibição de anti-inflamatórios e corticosteroides.\n\n### Divergências Relevantes de Gestão e Acesso:\n1. **Estrutura Operacional dos Grupos (A, B, C, D vs. Tripartite da OMS):** O Brasil refinou a diretriz da OMS criando o \"Grupo B\" (pacientes sem sinais de alarme, mas com fatores de risco individuais como lactentes, gestantes, idosos $> 65$ anos, hipertensos, diabéticos, cardiopatas e doentes renais). Esses pacientes obrigatoriamente coletam hemograma na UBS e aguardam resultado antes de serem liberados, reduzindo o risco de choque súbito no domicílio.\n2. **Prova do Laço (Tourniquet Test):** O Ministério da Saúde do Brasil ainda mantém a realização da Prova do Laço como critério de triagem para alocar pacientes no Grupo B, enquanto a diretriz mais recente da OMS flexibilizou a importância desse teste devido à sua baixa sensibilidade e acurácia durante epidemias de alta densidade.\n3. **Logística de Poltronas de Hidratação:** O SUS consolidou o modelo de tendas e poltronas de hidratação oral supervisionada imediata na recepção das unidades básicas e UPAs, garantindo ingesta de SRO antes mesmo da consulta médica formal.",
    "bloco_prescricao_copiavel": "",
    "jurisdicao": "GLOBAL_WHO",
    "pais": "Global / OMS",
    "agencia": "OMS / WHO (World Health Organization)",
    "codigo_diretriz": "WHO Arboviral Diseases Clinical Management Guidelines 2025",
    "url_fonte": "https://www.who.int/publications/i/item/9789240111110",
    "data_publicacao": "2025-07-04",
    "idioma_original": "en-GB",
    "equivalente_sus_id": "manejo_dengue_ms",
    "tem_equivalente_sus": true,
    "disponibilidade_farmacos_rename_sus": "total",
    "medicamentos_exclusivos_estrangeiros": [],
    "divergencias_relevantes_vs_sus": [
      "A OMS adota a classificação tripartite simplificada (Dengue Sem Sinais de Alarme, Dengue Com Sinais de Alarme e Dengue Grave), enquanto o Ministério da Saúde do Brasil estrutura o fluxo assistencial em 4 Grupos Operacionais (A, B, C e D) para organização de filas de acolhimento e hidratação nas UBS e UPAs.",
      "Diretriz enfática da OMS sobre cessação imediata da reposição intravenosa vigorosa após a resolução da fase crítica (24 a 48h após a queda da febre), para prevenir edema agudo de pulmão iatrogênico por hiper-hidratação na fase de reabsorção capilar.",
      "Contraindicação formal reforçada pela OMS para a transfusão profilática de concentrado de plaquetas baseada unicamente no valor numérico da plaquetometria (mesmo < 20.000/mm³), reservando plaquetas para sangramento grave ativo ou procedimentos invasivos imediatos."
    ]
  },
  {
    "id_protocolo": "who_hemorragia_pos_parto_pph",
    "titulo": "Prevenção e Manejo da Hemorragia Pós-Parto: Ocitocina, Carbetocina Termoestável e Ácido Tranexâmico",
    "cids_relacionados": [
      "O72",
      "O72.0",
      "O72.1",
      "O72.2"
    ],
    "ciaps_relacionados": [
      "W17",
      "W92"
    ],
    "categoria": "obstetricia_urgencia",
    "nivel_atencao": "Atencao_Secundaria_e_Hospitalar",
    "data_revisao": "2025-10-05",
    "status_revisao_clinica": "documento_oficial_governamental",
    "conteudo_markdown": "# Diretriz Clínica Governamental: Hemorragia Pós-Parto (OMS / WHO 2025)\n\n## 1. Identificação e Metadados da Fonte Oficial\n* **Agência Emissora:** Organização Mundial da Saúde (OMS / WHO) em parceria com a Federação Internacional de Ginecologia e Obstetrícia (FIGO) e Confederação Internacional de Parteiras (ICM).\n* **Referência Oficial:** *Consolidated guidelines for the prevention, diagnosis and treatment of postpartum haemorrhage* (ISBN: 9789240115637).\n* **Link Oficial:** [https://www.who.int/publications/i/item/9789240115637](https://www.who.int/publications/i/item/9789240115637)\n* **Público-alvo:** Médicos obstetras, enfermeiras obstétricas, anestesiologistas e equipes multiprofissionais de maternidades e centros de parto normal.\n\n---\n\n## 2. Definição, Diagnóstico Quantitativo e os 4 \"T\"s\n\n### Critérios Diagnósticos Oficiais (OMS):\n* **Hemorragia Pós-Parto (HPP):** Perda sanguínea cumulativa estimada ou medida **$\\ge 500\\text{ mL}$** após parto vaginal ou **$\\ge 1.000\\text{ mL}$** após cesariana, OU qualquer perda sanguínea capaz de causar instabilidade hemodinâmica (hipotensão, taquicardia, tontura, palidez, oligúria) dentro de 24 horas pós-parto.\n* **Uso de Coletor Graduado Calibrado:** A OMS recomenda a utilização de campos coletores com escala volumétrica milimétrica sob a pelve da parturiente para detecção precoce de perda antes que o choque se estabeleça.\n\n### Diagnóstico Etiológico (Regra Mnemônica dos 4 Ts):\n1. **Tônus (Atonia Uterina):** Causa mais frequente ($\\approx 70\\text{ a }80\\%$ dos casos). Útero amolecido e supraumbilical.\n2. **Trauma:** Lacerações de canal de parto (colo, vagina, períneo), hematomas ou rotura/inversão uterina.\n3. **Tecido:** Retenção de fragmentos placentários, cotilédone anômalo ou coágulos intrauterinos.\n4. **Trombina:** Coagulopatias congênitas ou adquiridas (CIVD associada a descolamento prematuro de placenta, pré-eclâmpsia grave com HELLP ou embolia amniótica).\n\n---\n\n## 3. Protocolos de Prevenção e Tratamento Imediato\n\n### A. Prevenção Universal no 3º Estágio do Parto:\nRecomendada para todos os nascimentos:\n* **Uterotônico de Escolha:**\n  * **Ocitocina:** Administrar **$10\\text{ UI}$ por via intramuscular (IM)** ou intravenosa lenta imediatamente após a expulsão do concepto (e antes do clampeamento e tração controlada do cordão).\n  * **Carbetocina Termoestável:** Administrar **$100\\text{ mcg}$ IM ou IV em dose única**, especialmente em ambientes tropicais ou de baixa infraestrutura onde a refrigeração contínua da ocitocina ($+2^\\circ\\text{C}$ a $+8^\\circ\\text{C}$) não possa ser rigorosamente garantida.\n  * Se ocitocina/carbetocina indisponíveis: Misoprostol $400\\text{ a }600\\text{ mcg}$ por via sublingual ou oral.\n\n### B. Tratamento da Hemorragia Estabelecida (Pacote \"First-Response MOTIVE\"):\nIniciar todas as intervenções simultaneamente nos primeiros 15 minutos:\n1. **Massagem Uterina Bimanual Externa / Compressão Aórtica:** Estimular contratilidade miometrial contínua.\n2. **Ácido Tranexâmico (TXA) - Intervenção Crítica:**\n   * Administrar **$1\\text{ g}$ ($10\\text{ mL}$ a $100\\text{ mg/mL}$) por via intravenosa diluído em $100\\text{ mL}$ de soro fisiológico infundido em 10 minutos**.\n   * **Janela Temporal Ouro:** Deve ser infundido o mais rápido possível e **obrigatoriamente dentro das primeiras 3 horas pós-parto**. Após 3 horas, o benefício hemostático cessa e os riscos tromboembólicos se elevam.\n   * Se o sangramento persistir após 30 minutos ou recorrer em até 24 horas: administrar uma **segunda dose de $1\\text{ g}$ de TXA IV**.\n3. **Segunda Linha de Uterotônicos:**\n   * **Ocitocina Contínua:** Infusão de $20\\text{ a }40\\text{ UI}$ em $500\\text{ mL}$ de Ringer Lactato a $125\\text{ a }250\\text{ mL/h}$.\n   * **Maleato de Metilergometrina:** $0,2\\text{ mg}$ IM dose única (CONTRAINDICADO se hipertensão, pré-eclâmpsia ou cardiopatia).\n   * **Misoprostol:** $800\\text{ mcg}$ por via sublingual ou retal (se ainda não usado na prevenção).\n4. **Revisão e Tamponamento:**\n   * Revisão sistemática do canal de parto sob boa iluminação com afastadores de valva;\n   * Curetagem ou aspiração manual intrauterina se restos ovulares;\n   * Inserção de **Balão de Tamponamento Intrauterino (Balão de Bakri ou artesanal com preservativo e sonda de Foley)** preenchido com $300\\text{ a }500\\text{ mL}$ de soro morno para hemostasia por pressão hidrostática.\n5. **Ressuscitação Hemodinâmica e Protocolo de Transfusão Maciça:**\n   * Acesso venoso duplo calibroso (jelco 14 ou 16); infusão de cristaloides aquecidos limitados a 2.000 mL para evitar coagulopatia dilucional;\n   * Se instabilidade refratária: ativar protocolo de transfusão maciça na proporção balanceada de $1:1:1$ (Concentrado de Hemácias : Plasma Fresco Congelado : Plaquetas) e crioprecipitado se Fibrinogênio $< 200\\text{ mg/dL}$.\n\n---\n\n## 4. Análise Comparada com o SUS / Brasil\n\n### Convergências:\n* O Ministério da Saúde do Brasil e o Manual de Gestação de Alto Risco adotam a profilaxia universal com Ocitocina 10 UI no 3º estágio do parto e a inserção do Ácido Tranexâmico nos kits hospitalares de emergência obstétrica da Rede Cegonha / Rede Alyne.\n\n### Divergências Relevantes de Gestão e Acesso:\n1. **Subutilização e Atraso do Ácido Tranexâmico:** Apesar de padronizado nos hospitais terciários brasileiros, o TXA frequentemente é administrado tardiamente (após 3 horas do início da hemorragia), quando a mortalidade já disparou e o benefício do estudo WOMAN se perde. O protocolo da OMS enfatiza o gatilho precoce do TXA simultâneo ao segundo uterotônico.\n2. **Carbetocina Termoestável:** Na vasta extensão territorial do Brasil (regiões Norte e Centro-Oeste com temperaturas ambientes que frequentemente superam $35^\\circ\\text{C}$), a manutenção da cadeia de frio da Ocitocina em unidades de saúde ribeirinhas ou de difícil acesso é crítica. A OMS recomenda nesses cenários a Carbetocina termoestável, fármaco que ainda possui penetração restrita no SUS pela barreira de custo comparativo frente à ampola tradicional de Ocitocina.\n3. **Mensuração Subjetiva do Sangramento:** A ampla maioria dos partos normais no Brasil ainda quantifica a hemorragia por estimativa visual em gazes e compressas, levando a um subdiagnóstico de até 50% dos casos de hemorragia moderada inicial.",
    "bloco_prescricao_copiavel": "",
    "jurisdicao": "GLOBAL_WHO",
    "pais": "Global / OMS",
    "agencia": "OMS / WHO (World Health Organization)",
    "codigo_diretriz": "WHO Consolidated Guidelines on Postpartum Haemorrhage (2025)",
    "url_fonte": "https://www.who.int/publications/i/item/9789240115637",
    "data_publicacao": "2025-10-05",
    "idioma_original": "en-GB",
    "equivalente_sus_id": "",
    "tem_equivalente_sus": false,
    "disponibilidade_farmacos_rename_sus": "parcial",
    "medicamentos_exclusivos_estrangeiros": [
      "Carbetocina termoestável padronizada para prevenção sem exigência de cadeia de frio",
      "Campos coletores graduados calibrados para quantificação visual precoce de perda sanguínea"
    ],
    "divergencias_relevantes_vs_sus": [
      "A OMS estabelece o Ácido Tranexâmico (TXA 1 g IV) administrado obrigatoriamente dentro de até 3 horas do parto como conduta salvadora de vida Classe I em toda HPP clínica, comprovando redução de mais de 30% na mortalidade materna por sangramento.",
      "Recomendação da Carbetocina termoestável (100 mcg dose única) para prevenção no 3º estágio do parto em locais com cadeia de frio instável, superando o risco de inativação térmica da Ocitocina convencional.",
      "Adoção sistemática do pacote intervencionista precoce integrado (Bundle 'First-Response MOTIVE') guiado por coletores calibrados de volume, em substituição à estimativa visual subjetiva."
    ]
  }
];

export const FARMACOS_POR_PROTOCOLO_INTERNACIONAL: Record<string, string[]> = {
  "cdc_idsa_doenca_de_lyme": [
    "Cefuroxima axetil de uso rotineiro em cuidados primários",
    "Testes sorológicos imunoenzimáticos automatizados de dois níveis (MTTT aprovados pelo FDA)"
  ],
  "cdc_ntca_tuberculose_latente_3hp": [
    "Rifapentina em blíster individual para dose supervisionada semanal",
    "Testes de IGRA (QuantiFERON-TB / T-SPOT.TB) universais na rede pública"
  ],
  "cdc_sti_gonorreia_clamidia_2021": [],
  "cdc_sti_sifilis_2021": [],
  "fda_aha_avc_trombolise_tnk": [
    "Tenecteplase padronizada universalmente como trombolítico Classe I em pronto-socorro",
    "Software de tomografia por perfusão (CTP) automatizado via IA para AVC em janela estendida"
  ],
  "health_canada_ccs_insuficiencia_cardiaca": [
    "Sacubitril/Valsartana (ARNI) de prescrição universal em primeira linha ambulatorial",
    "Vericiguat (estimulador solúvel da guanilato ciclase para IC recente com descompensação)",
    "Eplerenona como alternativa direta à Espironolactona se ginecomastia dolorosa"
  ],
  "nice_ng136_hipertensao": [],
  "nice_ng193_dor_cronica_fibromialgia": [
    "Duloxetina e Milnaciprano acessíveis sem protocolo de excepcionalidade",
    "Terapia de Aceitação e Compromisso (ACT) estruturada em rede básica"
  ],
  "nice_ng203_doenca_renal_cronica": [
    "Finerenona (antagonista não esteroidal do receptor mineralocorticoide - NICE TA877)",
    "Bicarbonato de sódio purificado para profilaxia de acidose metabólica crônica"
  ],
  "nice_ng222_depressao_adulto": [
    "Vortioxetina (multimodal para depressão com comprometimento cognitivo)",
    "TCC digital estruturada via aplicativo integrado ao prontuário do NHS"
  ],
  "nice_ng245_asma_manejo_cronico": [
    "Medição de FeNO (Óxido Nítrico Exalado) rotineira na atenção básica",
    "Tezepelumabe (anti-TSLP) e Dupilumabe (anti-IL-4R) amplamente acessíveis em ambulatório secundário"
  ],
  "nice_ng250_pneumonia_adquirida_comunidade": [],
  "nice_ng28_diabetes_tipo2": [
    "Tirzepatida (duplo agonista GLP-1/GIP)",
    "Semaglutida injetável/oral para DM2 em atenção primária",
    "Empagliflozina / Ertugliflozina de dispensação universal"
  ],
  "nice_ta875_ta1026_obesidade_glp1_gip": [
    "Semaglutida 2,4 mg subcutânea semanal (Wegovy)",
    "Tirzepatida 2,5 mg a 15 mg subcutânea semanal (Zepbound)",
    "Liraglutida 3,0 mg subcutânea diária (Saxenda)"
  ],
  "who_arboviroses_dengue_2025": [],
  "who_hemorragia_pos_parto_pph": [
    "Carbetocina termoestável padronizada para prevenção sem exigência de cadeia de frio",
    "Campos coletores graduados calibrados para quantificação visual precoce de perda sanguínea"
  ]
};

export const CATEGORIAS_POR_PROTOCOLO_INTERNACIONAL: Record<string, string> = {
  "cdc_idsa_doenca_de_lyme": "infectologia_zoonoses",
  "cdc_ntca_tuberculose_latente_3hp": "infectologia_respiratoria",
  "cdc_sti_gonorreia_clamidia_2021": "infectologia_ist",
  "cdc_sti_sifilis_2021": "infectologia_ist",
  "fda_aha_avc_trombolise_tnk": "neurologia_urgencia",
  "health_canada_ccs_insuficiencia_cardiaca": "cardiovascular",
  "nice_ng136_hipertensao": "cardiovascular",
  "nice_ng193_dor_cronica_fibromialgia": "reumatologia_dor",
  "nice_ng203_doenca_renal_cronica": "nefrologia",
  "nice_ng222_depressao_adulto": "saude_mental",
  "nice_ng245_asma_manejo_cronico": "pneumologia",
  "nice_ng250_pneumonia_adquirida_comunidade": "pneumologia_infecciosa",
  "nice_ng28_diabetes_tipo2": "metabolico_endocrino",
  "nice_ta875_ta1026_obesidade_glp1_gip": "metabolico_endocrino",
  "who_arboviroses_dengue_2025": "infectologia_tropical",
  "who_hemorragia_pos_parto_pph": "obstetricia_urgencia"
};
