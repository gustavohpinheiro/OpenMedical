import { ProtocoloClinico } from '../types';

export const PROTOCOLOS_INFECTOLOGIA: ProtocoloClinico[] = [
  {
    id_protocolo: 'faringite_amigdalite_aguda',
    titulo: 'Manejo da Faringoamigdalite Aguda Estreptocócica',
    cids_relacionados: ['J02.0', 'J02.9', 'J03.0'],
    ciaps_relacionados: ['R74'],
    nivel_atencao: 'Atencao_Primaria',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Critérios Clínicos de Centor Modificados (Streptococcus pyogenes)
* Febre referida ou aferida (> 38 ºC): +1 ponto
* Ausência de tosse: +1 ponto
* Exsudato amigdaliano ou edema com eritema intenso: +1 ponto
* Linfonodomegalia cervical anterior dolorosa: +1 ponto
* Idade de 3 a 14 anos (+1) | 15 a 44 anos (0) | >= 45 anos (-1)
* **Conduta:** Escore >= 3 justifica antibioticoterapia empírica para prevenção de Febre Reumática e Glomerulonefrite Difusa Aguda (GNDA).

## Opções Terapêuticas de Primeira Linha
1. **Amoxicilina:** 500 mg VO a cada 8 horas por 10 dias (ou 875 mg VO a cada 12 horas).
2. **Penicilina G Benzatina (Dose Única IM):**
   * Crianças < 27 kg: 600.000 UI IM dose única profunda.
   * Adultos e crianças >= 27 kg: 1.200.000 UI IM dose única.
3. **Alergia a Betalactâmicos:** Azitromicina 500 mg VO uma vez ao dia por 5 dias.`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - FARINGOAMIGDALITE AGUDA
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Amoxicilina 500mg cápsula --------------------------- 1 caixa (30 cápsulas)
   Tomar 1 cápsula por via oral a cada 8 horas por 10 dias consecutivos.
   (Atenção: Não interromper o antibiótico antes de 10 dias para prevenção de febre reumática).

2. Dipirona Monoidratada 500mg comprimido -------------- 1 blister (10 comprimidos)
   Tomar 1 a 2 comprimidos por via oral a cada 6 horas se dor de garganta ou febre.

Orientações Não Farmacológicas:
- Hidratação abundante (água, sucos naturais e chás mornos).
- Gargarejos com água morna e salina leve 3 vezes ao dia.
- Trocar a escova dental após 48 horas de início do antibiótico para evitar reinfecção.`,
  },
  {
    id_protocolo: 'manejo_dengue_ms',
    titulo: 'Protocolo de Manejo Clínico da Dengue (MS / OMS)',
    cids_relacionados: ['A90'],
    ciaps_relacionados: ['A77'],
    nivel_atencao: 'Atencao_Primaria_e_Urgencia',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Classificação de Risco e Conduta
* **Grupo A (Sem sinais de alarme, sem comorbidades):** Tratamento domiciliar com hidratação oral volumosa calculada a 60 mL/kg/dia (sendo 1/3 com Sais de Reidratação Oral e 2/3 com líquidos caseiros).
* **Grupo B (Sem alarme, mas com sangramento de pele espontâneo, gestantes, idosos, nefropatas):** Hemograma completo obrigatório e hidratação oral supervisionada (80 mL/kg/dia).
* **Grupos C e D (Presença de Sinais de Alarme ou Choque):** Internação hospitalar imediata. Expansão venosa com SF 0.9% ou Ringer Lactato (10 mL/kg na 1ª hora no grupo C; 20 mL/kg em 20 min no grupo D).

## Contraindicação Formal Absoluta
* **PROIBIDO O USO DE AAS E AINEs** (ibuprofeno, diclofenaco, cetoprofeno, nimesulida) e corticoides pelo risco crítico de hemorragia grave e plaquetopenia aguda.`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - DENGUE (GRUPO A AMBULATORIAL)
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Sais de Reidratação Oral (SRO) sachê 27.9g ------------ 10 envelopes
   Diluir 1 envelope em exatamente 1 litro de água filtrada ou fervida.
   Ingerir ao longo do dia em pequenos goles. Volume mínimo diário: [Calcular 60 mL/kg/dia].

2. Dipirona Monoidratada 500mg comprimido --------------- 1 caixa (20 comprimidos)
   Tomar 1 a 2 comprimidos por via oral a cada 6 horas em caso de dor ou febre superior a 37.8 ºC.

ADVERTÊNCIA CRÍTICA:
- NÃO TOMAR Ácido Acetilsalicílico (Aspirina/AAS) nem anti-inflamatórios (ibuprofeno, cetoprofeno, diclofenaco).
- Retorno IMEDIATO ao pronto-atendimento se houver dor abdominal intensa e contínua, vômitos frequentes, tontura ao levantar, sangramento de gengiva/nariz ou sonolência excessiva.`,
  },
  {
    id_protocolo: 'chikungunya_fase_aguda_cronica',
    titulo: 'Manejo da Febre de Chikungunya: Fases Aguda e Crônica',
    cids_relacionados: ['A92.0'],
    ciaps_relacionados: ['A77'],
    nivel_atencao: 'Atencao_Primaria_e_Especializada',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Fases Clínicas da Doença
* **Fase Aguda (até 14 dias):** Febre alta súbita, poliartralgia intensa bilateral e simétrica (mãos, punhos, tornozelos). Analgesia com Dipirona ou Paracetamol. Evitar AINEs até exclusão de dengue.
* **Fase Pós-Aguda (15 a 90 dias):** Persistência de artralgia inflamatória. Pode-se introduzir AINEs com cautela ou corticoide em dose baixa se refratariedade.
* **Fase Crônica (> 90 dias):** Poliartrite crônica erosiva destrutiva. Indicação de seguimento reumatológico e introdução de Metotrexato ou Hidroxicloroquina.`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - CHIKUNGUNYA (FASE AGUDA / ANALGESIA ESCALONADA)
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Dipirona Monoidratada 500mg comprimido -------------- 2 caixas (40 comprimidos)
   Tomar 2 comprimidos (1000 mg) por via oral a cada 6 horas de forma regular nos primeiros 5 dias.

2. Cloridrato de Tramadol 50mg cápsula ------------------ 1 caixa (10 cápsulas)
   Tomar 1 cápsula por via oral a cada 8 horas apenas se dor articular intensa incapacitante refratária à dipirona.
   (Receituário de Controle Especial C1 - Branco em 2 vias).

Orientações:
- Repouso articular relativo e compressas frias nas articulações inflamadas por 20 minutos.
- Ingesta de pelo menos 2.5 litros de líquidos ao dia.`,
  },
  {
    id_protocolo: 'zika_gestante_manifestacoes',
    titulo: 'Manejo da Infecção pelo Vírus Zika e Abordagem na Gestação',
    cids_relacionados: ['A92.8', 'O35.3'],
    ciaps_relacionados: ['A77', 'W78'],
    nivel_atencao: 'Atencao_Primaria_e_Pre_Natal',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Quadro Clínico e Sinais de Alerta
* Exantema maculopapular pruriginoso precoce associado a febre baixa ou ausente, hiperemia conjuntival não purulenta e artralgias leves.
* Risco primordial: Síndrome da Zika Congênita (microcefalia, calcificações cerebrais, artrogripose).

## Conduta Terapêutica na Gestante
* Sintomáticos seguros: Paracetamol para controle álgico e febril. Anti-histamínicos seguros (Loratadina) para prurido intenso.
* Ultrassonografia obstétrica seriada a cada 4 semanas para monitoramento da biometria fetal e circunferência cefálica.`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - ZIKA VÍRUS NA GESTAÇÃO
Paciente: [Nome da Gestante]
Data: [Data do Atendimento]

USO ORAL:
1. Paracetamol 500mg comprimido ------------------------ 1 caixa (20 comprimidos)
   Tomar 1 a 2 comprimidos (500 a 750 mg) por via oral a cada 6 horas se dor ou febre (máximo 3000 mg/dia).

2. Loratadina 10mg comprimido -------------------------- 1 caixa (10 comprimidos)
   Tomar 1 comprimido por via oral uma vez ao dia se prurido cutâneo intenso.

USO TÓPICO:
3. Repelente corporal à base de Icaridina 20% a 25% ----- 1 frasco
   Aplicar nas áreas expostas da pele a cada 8 horas, reaplicando após suor intenso.`,
  },
  {
    id_protocolo: 'pneumonia_adquirida_comunidade',
    titulo: 'Pneumonia Adquirida na Comunidade (PAC) no Adulto: Manejo Ambulatorial',
    cids_relacionados: ['J18.9', 'J13', 'J15.9'],
    ciaps_relacionados: ['R81'],
    nivel_atencao: 'Atencao_Primaria',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Estratificação de Gravidade pelo Escore CURB-65
* **C (Confusão mental):** +1
* **U (Ureia > 50 mg/dL):** +1
* **R (Frequência Respiratória >= 30 ipm):** +1
* **B (Pressão Arterial PAS < 90 ou PAD <= 60 mmHg):** +1
* **65 (Idade >= 65 anos):** +1
* **Conduta:** Escore 0 ou 1: Tratamento ambulatorial seguro. Escore 2: Avaliar internação em enfermaria. Escore >= 3: Internação hospitalar mandatória; considerar UTI se >= 4.

## Esquema Antimicrobiano Empírico
* Adulto hígido sem comorbidades: Amoxicilina 500 mg VO 8/8h por 7 dias (ou Azitromicina 500 mg VO/dia por 5 dias).
* Adulto com comorbidades (DM, DPOC, cardiopatia): Amoxicilina 875 mg + Clavulanato 125 mg VO 12/12h associado a Azitromicina 500 mg/dia.`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - PNEUMONIA COMUNITÁRIA (AMBULATORIAL)
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Amoxicilina 500mg cápsula --------------------------- 1 caixa (21 cápsulas)
   Tomar 1 cápsula por via oral a cada 8 horas durante 7 dias.

2. Azitromicina 500mg comprimido ----------------------- 1 caixa (3 comprimidos)
   Tomar 1 comprimido por via oral uma vez ao dia, 1 hora antes ou 2 horas após a refeição, durante 3 dias.

3. Dipirona Monoidratada 500mg comprimido -------------- 1 blister (10 comprimidos)
   Tomar 1 a 2 comprimidos por via oral a cada 6 horas se dor torácica ou febre.

Orientações:
- Manter repouso e hidratação oral mínima de 2 litros ao dia.
- Reavaliação médica ambulatorial obrigatória em 48 a 72 horas.`,
  },
  {
    id_protocolo: 'sinusite_bacteriana_aguda',
    titulo: 'Rinossinusite Bacteriana Aguda no Adulto',
    cids_relacionados: ['J01.9', 'J01.0'],
    ciaps_relacionados: ['R75'],
    nivel_atencao: 'Atencao_Primaria',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Diferenciação: Viral vs Bacteriana
* A esmagadora maioria (> 95%) das rinossinusites agudas é viral (resfriado comum).
* **Indicações de infecção bacteriana:**
  1. Sintomas persistentes sem melhora após 10 dias de evolução;
  2. Piora bifásica ('double sickening'): piora abrupta de febre e secreção após melhora inicial;
  3. Início severo: febre alta (> 39 ºC) associada a secreção purulenta e dor facial intensa por >= 3 dias consecutivos.`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - RINOSSINUSITE BACTERIANA AGUDA
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO NASAL:
1. Soro Fisiológico 0.9% frasco 500 mL ------------------ 1 frasco
   Fazer lavagem nasal de alto volume com seringa (10 a 20 mL em cada narina) 3 a 4 vezes ao dia.

2. Budesonida Spray Nasal 50 mcg/dose ------------------ 1 frasco (120 doses)
   Aplicar 2 jatos em cada narina pela manhã e à noite durante 14 dias (aplicar após a lavagem nasal).

USO ORAL:
3. Amoxicilina 500mg cápsula --------------------------- 1 caixa (21 cápsulas)
   Tomar 1 cápsula por via oral a cada 8 horas durante 7 dias.

4. Dipirona Monoidratada 500mg comprimido -------------- 1 blister (10 comprimidos)
   Tomar 1 comprimido por via oral a cada 6 horas se dor facial ou cefaleia.`,
  },
  {
    id_protocolo: 'otite_media_aguda_pediatrica',
    titulo: 'Otite Média Aguda (OMA) na Infância',
    cids_relacionados: ['H65.0', 'H66.0'],
    ciaps_relacionados: ['H71'],
    nivel_atencao: 'Atencao_Primaria_e_Pediatria',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Critérios Diagnósticos
* Início agudo de otalgia (ou irritabilidade/puxar a orelha em lactentes);
* Abaulamento moderado a severo da membrana timpânica à otoscopia pneumática ou otorreia aguda não decorrente de otite externa.

## Dose Pediátrica de Amoxicilina
* **Dose Padrão OMA:** 80 a 90 mg/kg/dia fracionado a cada 12 horas por 10 dias em menores de 2 anos (ou 7 dias em maiores de 2 anos com OMA leve).
* Essa alta concentração garante níveis terapêuticos eficazes no fluido da orelha média contra cepas de Streptococcus pneumoniae com sensibilidade intermediária à penicilina.`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - OTITE MÉDIA AGUDA PEDIÁTRICA
Paciente: [Nome da Criança] | Peso: [Ex: 12 kg]
Data: [Data do Atendimento]

USO ORAL:
1. Amoxicilina 250mg/5mL suspensão oral (50 mg/mL) ------ 2 frascos (150 mL cada)
   Dar [Calcular: 90 mg/kg/dia / 2 tomadas = Ex: 10.8 mL] por via oral a cada 12 horas por 10 dias consecutivos.
   (Agitar bem o frasco antes de cada administração; manter refrigerado após reconstituição).

2. Dipirona Monoidratada 500mg/mL gotas ---------------- 1 frasco (20 mL)
   Dar 1 gota para cada 2 kg de peso por via oral a cada 6 horas em caso de dor de ouvido ou febre.

Orientações:
- Não molhar o ouvido afetado durante o banho.
- Não introduzir cotonetes ou soluções otológicas tópicas se houver perfuração timpânica visível.`,
  },
  {
    id_protocolo: 'itu_nao_complicada',
    titulo: 'Manejo da Infecção do Trato Urinário Não Complicada (Cistite Aguda)',
    cids_relacionados: ['N39.0', 'N30.0'],
    ciaps_relacionados: ['U71'],
    nivel_atencao: 'Atencao_Primaria',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Abordagem Diagnóstica
* Presença de disúria, polaciúria e urgência miccional sem sintomas vaginais (ausência de corrimento ou prurido).
* Ausência de febre, calafrios ou dor em flanco (sinais sugestivos de pielonefrite).
* Urocultura com antibiograma recomendada apenas se: suspeita de pielonefrite, sintomas atípicos, falha terapêutica ou infecção recorrente (>= 3 episódios/ano).

## Escolha Antimicrobiana de 1ª Linha
* **Fosfomicina trometamol 3g dose única:** Excelente adesão e baixos índices de resistência em Escherichia coli.
* **Nitrofurantoína 100mg VO 6/6h por 5 dias:** Primeira linha segura se TFG > 30 mL/min.`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - CISTITE AGUDA NÃO COMPLICADA
Paciente: [Nome da Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Fosfomicina trometamol 3g pó para solução oral ------- 1 sachê
   Dissolver 1 sachê em meio copo de água e tomar em dose única por via oral, à noite ao deitar, logo após esvaziar a bexiga.

2. Dipirona Monoidratada 500mg/mL gotas ---------------- 1 frasco (20 mL)
   Tomar 35 a 40 gotas por via oral a cada 6 a 8 horas se dor ou desconforto miccional nas primeiras 48 horas.

Orientações Preventivas:
- Ingerir pelo menos 2 litros de água ao longo do dia.
- Urinar após o coito e evitar postergar a micção quando sentir vontade.`,
  },
  {
    id_protocolo: 'pielonefrite_aguda_nao_complicada',
    titulo: 'Pielonefrite Aguda Não Complicada (Manejo Ambulatorial)',
    cids_relacionados: ['N10'],
    ciaps_relacionados: ['U70'],
    nivel_atencao: 'Atencao_Primaria_e_Urgencia',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Critérios de Internação Hospitalar
* Intolerância gástrica (vômitos incoercíveis impossibilitando medicação oral);
* Sepse ou instabilidade hemodinâmica;
* Gestantes;
* Obstrução do trato urinário conhecida ou litíase associada;
* Descompensação de comorbidades clínicas de base.

## Conduta Ambulatorial para Pacientes Selecionados
* Coletar Urocultura com antibiograma e hemograma antes da primeira dose.
* Dose de ataque inicial parenteral no pronto-atendimento (Ceftriaxona 1g IV) seguida de Ciprofloxacino oral se estabilidade clínica.`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - PIELONEFRITE AGUDA AMBULATORIAL
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Cloridrato de Ciprofloxacino 500mg comprimido ------- 1 caixa (14 comprimidos)
   Tomar 1 comprimido por via oral a cada 12 horas durante 7 dias consecutivos.
   (Receituário Antimicrobiano em 2 vias).

2. Dipirona Monoidratada 500mg comprimido -------------- 1 caixa (20 comprimidos)
   Tomar 1 a 2 comprimidos por via oral a cada 6 horas em caso de dor lombar ou febre.

Orientações Críticas:
- Reavaliação médica presencial mandatória em 48 horas.
- Procurar hospital imediatamente se apresentar vômitos contínuos, febre > 39 ºC persistente ou queda da pressão arterial.`,
  },
  {
    id_protocolo: 'erisipela_celulite_infecciosa',
    titulo: 'Manejo da Erisipela e Celulite Infecciosa de Membros Inferiores',
    cids_relacionados: ['A46', 'L03.1'],
    ciaps_relacionados: ['S76'],
    nivel_atencao: 'Atencao_Primaria_e_Pronto_Atendimento',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Diferenciação Clínica
* **Erisipela:** Acomete derme superficial e linfáticos; bordas nítidas, elevadas e bem demarcadas; Streptococcus pyogenes predominante.
* **Celulite:** Acomete derme profunda e tecido subcutâneo; bordas mal delimitadas e difusas; Staphylococcus aureus e estreptococos.

## Tratamento Oral Ambulatorial
* Demarcar com caneta a borda do eritema para acompanhar a resposta clínica diária.
* Elevação do membro afetado acima do nível do quadril (reduz edema e acelera cura).`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - ERISIPELA / CELULITE AMBULATORIAL
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Cefalexina 500mg cápsula ---------------------------- 2 caixas (56 cápsulas)
   Tomar 1 cápsula por via oral a cada 6 horas durante 10 dias consecutivos.
   (Receituário Antimicrobiano em 2 vias).

2. Dipirona Monoidratada 500mg comprimido -------------- 1 caixa (20 comprimidos)
   Tomar 1 a 2 comprimidos por via oral a cada 6 horas se dor local ou febre.

Orientações:
- Manter a perna elevada durante o repouso com almofadas sob a panturrilha.
- Tratar a porta de entrada (frieiras interdigitais, micose ungueal ou ferimentos).`,
  },
  {
    id_protocolo: 'impetigo_crostoso_bolhoso',
    titulo: 'Manejo do Impetigo Crostoso e Bolhoso na Criança e Adulto',
    cids_relacionados: ['L01.0', 'L01.1'],
    ciaps_relacionados: ['S84'],
    nivel_atencao: 'Atencao_Primaria',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Características e Etiologia
* Lesões vesicopustulosas com crostas melicéricas aderentes ('aspecto de açúcar queimado') periorificiais.
* Agentes etiológicos: Staphylococcus aureus e Streptococcus pyogenes.

## Conduta Terapêutica
* **Lesões localizadas (< 3 lesões):** Pomada tópica de Mupirocina 2% por 7 dias após amolecimento das crostas com água morna.
* **Lesões disseminadas ou sistêmicas:** Cefalexina por via oral associada ao cuidado local.`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - IMPETIGO
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO TÓPICO:
1. Mupirocina 2% pomada dermatológica ------------------ 1 bisnaga (15 g)
   Lavar suavemente a região com água morna e sabonete neutro para remover crostas frouxas.
   Aplicar fina camada da pomada sobre as lesões 3 vezes ao dia durante 7 dias.

USO ORAL (Se lesões extensas):
2. Cefalexina 500mg comprimido (ou suspensão 250mg/5mL) -- 1 caixa
   Tomar conforme prescrição médica a cada 6 horas por 7 dias.

Orientações:
- Uso estritamente individual de toalhas de banho e roupas de cama para evitar disseminação intrafamiliar.`,
  },
  {
    id_protocolo: 'herpes_zoster_nevralgia',
    titulo: 'Abordagem do Herpes Zoster e Prevenção da Nevralgia Pós-Herpética',
    cids_relacionados: ['B02.9', 'G53.0'],
    ciaps_relacionados: ['S70'],
    nivel_atencao: 'Atencao_Primaria_e_Pronto_Atendimento',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Janela de Eficácia Antiviral
* Reativação do vírus Varicela-Zóster em dermátomo unilateral.
* Iniciar antiviral idealmente nas primeiras 72 horas do surgimento das vesículas para reduzir a duração do quadro e o risco de Nevralgia Pós-Herpética (NPH).
* Rastrear acometimento de ramo oftálmico do trigêmeo (Sinal de Hutchinson: vesícula na ponta do nariz) - encaminhamento oftalmológico de urgência pelo risco de ceratite herpética.`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - HERPES ZOSTER AGUDO
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Aciclovir 800mg comprimido -------------------------- 5 caixas (35 comprimidos)
   Tomar 1 comprimido (800 mg) por via oral 5 vezes ao dia (a cada 4 horas, pulando a dose da madrugada) durante 7 dias consecutivos.

2. Dipirona Monoidratada 500mg comprimido -------------- 1 caixa (20 comprimidos)
   Tomar 1 a 2 comprimidos por via oral a cada 6 horas se dor em queimação.

3. Gabapentina 300mg cápsula --------------------------- 1 caixa (30 cápsulas)
   Tomar 1 cápsula à noite antes de deitar nos primeiros 3 dias; aumentar para 1 cápsula 12/12h se dor neuropática intensa persistente.`,
  },
  {
    id_protocolo: 'parasitoses_intestinais_giardiase',
    titulo: 'Protocolo de Tratamento das Parasitoses Intestinais na Atenção Primária',
    cids_relacionados: ['B82.9', 'A07.1', 'B77.9'],
    ciaps_relacionados: ['D96'],
    nivel_atencao: 'Atencao_Primaria',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Espectro Terapêutico
* **Geo-helmintos (Ascaris, Ancylostoma, Enterobius):** Albendazol em dose única (repetir após 14 dias para enterobíase devido ao ciclo biológico).
* **Protozoários (Giardia lamblia, Entamoeba histolytica):** Secnidazol 2g dose única ou Metronidazol por 5 a 7 dias.`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - PARASITOSES INTESTINAIS
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Albendazol 400mg comprimido mastigável -------------- 2 comprimidos
   Mastigar 1 comprimido em dose única junto a uma refeição gordurosa.
   Repetir o segundo comprimido após 14 dias.

2. Secnidazol 1000mg comprimido revestido -------------- 2 comprimidos
   Tomar os 2 comprimidos juntos (dose total de 2000 mg) em dose única à noite após o jantar.
   (Atenção: Não ingerir bebidas alcoólicas por até 72 horas devido ao efeito antabuse).

Orientações:
- Tratamento profilático de todos os coabitantes da mesma residência para quebrar o ciclo de transmissão.`,
  },
  {
    id_protocolo: 'sifilis_adquirida_primaria_secundaria',
    titulo: 'Manejo da Sífilis Adquirida (Primária, Secundária e Latente Recente)',
    cids_relacionados: ['A51.0', 'A51.3', 'A52.9'],
    ciaps_relacionados: ['Y70'],
    nivel_atencao: 'Atencao_Primaria_e_IST',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Esquemas Terapêuticos Padronizados (PCDT/MS)
* **Sífilis Primária (Cancro Duro), Secundária (Roséola, Condiloma plano) e Latente Recente (< 1 ano):**
  - Penicilina G Benzatina 2.400.000 UI IM em dose única (1.200.000 UI em cada glúteo).
* **Sífilis Latente Tardia (> 1 ano) ou Duração Indeterminada:**
  - Penicilina G Benzatina 2.400.000 UI IM semanal por 3 semanas consecutivas (Dose cumulativa: 7.200.000 UI).
* **Gestantes:** Penicilina G Benzatina é o ÚNICO medicamento eficaz para prevenção da Sífilis Congênita.`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - SÍFILIS ADQUIRIDA (DOSE ÚNICA)
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO INTRAMUSCULAR PROFUNDO:
1. Penicilina G Benzatina 1.200.000 UI suspensão injetável - 2 frascos-ampola
   Aplicar 1 frasco-ampola por via intramuscular profunda em cada região glútea, em dose única (dose total: 2.400.000 UI).
   (Aplicação imediata em unidade de saúde; observar por 30 minutos).

Orientações:
- Notificação compulsória e convocação de todos os parceiros sexuais dos últimos 90 dias para tratamento empírico simultâneo.
- Controle sorológico quantitativo de cura com VDRL trimestral (espera-se queda de pelo menos 2 titulações em 6 meses, ex: de 1:32 para 1:8).`,
  },
  {
    id_protocolo: 'uretrite_gonococica_clamidia',
    titulo: 'Abordagem Sindrômica das Uretrites e Cervicites (Gonorreia e Clamídia)',
    cids_relacionados: ['A54.0', 'A56.0'],
    ciaps_relacionados: ['U72', 'X71'],
    nivel_atencao: 'Atencao_Primaria_e_Urgencia',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Abordagem Sindrômica
* Diante de corrimento uretral purulento ou mucopurulento, tratar obrigatoriamente e simultaneamente Neisseria gonorrhoeae e Chlamydia trachomatis em dose única presencial.`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - URETRITE / CERVICITE (SÍNDROME DE CORRIMENTO)
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO INTRAMUSCULAR:
1. Ceftriaxona 500mg pó liofilizado para injeção IM ---- 1 frasco-ampola + diluente
   Reconstituir e aplicar 500 mg por via intramuscular profunda em dose única na unidade de saúde.

USO ORAL:
2. Azitromicina 500mg comprimido ----------------------- 2 comprimidos
   Tomar os 2 comprimidos juntos por via oral (dose total de 1000 mg) em dose única logo após a injeção.

Orientações:
- Abstenção de relações sexuais por 7 dias após o tratamento.
- Tratamento e testagem para HIV, Sífilis e Hepatites de todas as parcerias sexuais recentes.`,
  },
  {
    id_protocolo: 'candidiaze_vulvovaginal',
    titulo: 'Manejo da Candidíase Vulvovaginal Aguda',
    cids_relacionados: ['B37.3'],
    ciaps_relacionados: ['X72'],
    nivel_atencao: 'Atencao_Primaria',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Quadro Clínico Típico
* Prurido vulvar intenso, ardor miccional externo, edema e eritema vulvovaginal.
* Corrimento esbranquiçado grumoso ('aspecto de leite coalhado') aderido às paredes vaginais com pH < 4.5.`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - CANDIDÍASE VULVOVAGINAL
Paciente: [Nome da Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Fluconazol 150mg cápsula ---------------------------- 1 cápsula
   Tomar 1 cápsula por via oral em dose única.
   (Contraindicado em gestantes: utilizar exclusivamente terapia tópica com clotrimazol/miconazol).

USO VAGINAL:
2. Nitrato de Miconazol creme vaginal 2% --------------- 1 bisnaga (80 g) com aplicadores
   Aplicar 1 aplicador cheio profundamente na vagina à noite ao deitar durante 7 dias consecutivos.

Orientações:
- Usar roupas íntimas de algodão folgadas e evitar protetores diários sintéticos abafados.`,
  },
  {
    id_protocolo: 'vaginose_bacteriana_tricomoniase',
    titulo: 'Tratamento da Vaginose Bacteriana e Tricomoníase Vaginal',
    cids_relacionados: ['N76.0', 'A59.0'],
    ciaps_relacionados: ['X73'],
    nivel_atencao: 'Atencao_Primaria',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Critérios de Amsel para Vaginose Bacteriana
* Corrimento acinzentado fino homogêneo;
* pH vaginal > 4.5;
* Teste das aminas positivo (Whiff test com KOH 10%: odor característico de peixe em decomposição);
* Presença de 'Clue Cells' (células guia) à microscopia óptica.`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - VAGINOSE BACTERIANA
Paciente: [Nome da Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Metronidazol 400mg (ou 500mg) comprimido ------------ 1 caixa (20 comprimidos)
   Tomar 1 comprimido por via oral a cada 12 horas durante 7 dias consecutivos.

ADVERTÊNCIA RIGOROSA:
- PROIBIDO CONSUMO DE ÁLCOOL durante o tratamento e até 48 horas após a última dose pelo risco de reação dissulfiram-like (rubor facial, taquicardia, náuseas e vômitos incoercíveis).`,
  },
  {
    id_protocolo: 'influenza_sindrome_gripal_oseltamivir',
    titulo: 'Manejo da Síndrome Gripal e Uso do Oseltamivir (Influenza A/B)',
    cids_relacionados: ['J10.1', 'J11.1'],
    ciaps_relacionados: ['R80'],
    nivel_atencao: 'Atencao_Primaria_e_Urgencia',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Grupos Prioritários para Antiviral (Oseltamivir)
* Gestantes e puérperas (até 2 semanas pós-parto);
* Crianças < 2 anos e idosos >= 60 anos;
* Portadores de pneumopatias (incluindo asma), cardiopatias, imunossuprimidos, renais crônicos e obesidade grau III (IMC >= 40);
* Sinais de Síndrome Respiratória Aguda Grave (SRAG): dispneia, SpO2 < 95% em ar ambiente, hipotensão arterial.`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - SÍNDROME GRIPAL EM GRUPO DE RISCO
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Fosfato de Oseltamivir 75mg cápsula dura ------------ 1 caixa (10 cápsulas)
   Tomar 1 cápsula por via oral a cada 12 horas durante 5 dias consecutivos.
   (Iniciar idealmente nas primeiras 48 horas do início dos sintomas gripais).

2. Dipirona Monoidratada 500mg comprimido -------------- 1 blister (10 comprimidos)
   Tomar 1 a 2 comprimidos por via oral a cada 6 horas se febre alta ou mialgia intensa.

Orientações:
- Isolamento respiratório domiciliar e uso de máscara cirúrgica até 24 horas após cessar a febre.
- Retorno de urgência se sentir falta de ar, dor no peito ou lábios arroxeados.`,
  },
];
