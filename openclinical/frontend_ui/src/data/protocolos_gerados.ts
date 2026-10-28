// ARQUIVO GERADO por etl_pipeline/gerador_receitas_completas.py - NÃO EDITAR MANUALMENTE.
import { ProtocoloClinico } from '../types';

export const PROTOCOLOS_GERADOS: ProtocoloClinico[] = [
  {
    "id_protocolo": "faringite_amigdalite_aguda",
    "titulo": "Manejo da Faringoamigdalite Aguda Estreptocócica",
    "cids_relacionados": [
      "J02.0",
      "J02.9",
      "J03.0"
    ],
    "ciaps_relacionados": [
      "R74"
    ],
    "nivel_atencao": "Atencao_Primaria",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Critérios Clínicos de Centor Modificados (Streptococcus pyogenes)\n* Febre referida ou aferida (> 38 ºC): +1 ponto\n* Ausência de tosse: +1 ponto\n* Exsudato amigdaliano ou edema com eritema intenso: +1 ponto\n* Linfonodomegalia cervical anterior dolorosa: +1 ponto\n* Idade de 3 a 14 anos (+1) | 15 a 44 anos (0) | >= 45 anos (-1)\n* **Conduta:** Escore >= 3 justifica antibioticoterapia empírica para prevenção de Febre Reumática e Glomerulonefrite Difusa Aguda (GNDA).\n\n## 2. Opções Terapêuticas de Primeira Linha\n1. **Amoxicilina:** 500 mg VO a cada 8 horas por 10 dias (ou 875 mg VO a cada 12 horas).\n2. **Penicilina G Benzatina (Dose Única IM):**\n   * Crianças < 27 kg: 600.000 UI IM dose única profunda.\n   * Adultos e crianças >= 27 kg: 1.200.000 UI IM dose única.\n3. **Alergia a Betalactâmicos:** Azitromicina 500 mg VO uma vez ao dia por 5 dias.",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - FARINGOAMIGDALITE AGUDA\nPaciente: [Nome do Paciente]\nData: [Data do Atendimento]\n\nUSO ORAL:\n1. Amoxicilina 500mg cápsula --------------------------- 1 caixa (30 cápsulas)\n   Tomar 1 cápsula por via oral a cada 8 horas por 10 dias consecutivos.\n   (Atenção: Não interromper o antibiótico antes de 10 dias para prevenção de febre reumática).\n\n2. Dipirona Monoidratada 500mg comprimido -------------- 1 blister (10 comprimidos)\n   Tomar 1 a 2 comprimidos por via oral a cada 6 horas se dor de garganta ou febre.\n\nOrientações Não Farmacológicas:\n- Hidratação abundante (água, sucos naturais e chás mornos).\n- Gargarejos com água morna e salina leve 3 vezes ao dia.\n- Trocar a escova dental após 48 horas de início do antibiótico para evitar reinfecção."
  },
  {
    "id_protocolo": "manejo_dengue_ms",
    "titulo": "Protocolo de Manejo Clínico da Dengue (MS / OMS)",
    "cids_relacionados": [
      "A90"
    ],
    "ciaps_relacionados": [
      "A77"
    ],
    "nivel_atencao": "Atencao_Primaria_e_Urgencia",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Classificação de Risco e Conduta\n* **Grupo A (Sem sinais de alarme, sem comorbidades):** Tratamento domiciliar com hidratação oral volumosa calculada a 60 mL/kg/dia (sendo 1/3 com Sais de Reidratação Oral e 2/3 com líquidos caseiros).\n* **Grupo B (Sem alarme, mas com sangramento de pele espontâneo, gestantes, idosos, nefropatas):** Hemograma completo obrigatório e hidratação oral supervisionada (80 mL/kg/dia).\n* **Grupos C e D (Presença de Sinais de Alarme ou Choque):** Internação hospitalar imediata. Expansão venosa com SF 0.9% ou Ringer Lactato (10 mL/kg na 1ª hora no grupo C; 20 mL/kg em 20 min no grupo D).\n\n## 2. Contraindicação Formal Absoluta\n* **PROIBIDO O USO DE AAS E AINEs** (ibuprofeno, diclofenaco, cetoprofeno, nimesulida) e corticoides pelo risco crítico de hemorragia grave e plaquetopenia aguda.",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - DENGUE (GRUPO A AMBULATORIAL)\nPaciente: [Nome do Paciente]\nData: [Data do Atendimento]\n\nUSO ORAL:\n1. Sais de Reidratação Oral (SRO) sachê 27.9g ------------ 10 envelopes\n   Diluir 1 envelope em exatamente 1 litro de água filtrada ou fervida.\n   Ingerir ao longo do dia em pequenos goles. Volume mínimo diário: [Calcular 60 mL/kg/dia].\n\n2. Dipirona Monoidratada 500mg comprimido --------------- 1 caixa (20 comprimidos)\n   Tomar 1 a 2 comprimidos por via oral a cada 6 horas em caso de dor ou febre superior a 37.8 ºC.\n\nADVERTÊNCIA CRÍTICA:\n- NÃO TOMAR Ácido Acetilsalicílico (Aspirina/AAS) nem anti-inflamatórios (ibuprofeno, cetoprofeno, diclofenaco).\n- Retorno IMEDIATO ao pronto-atendimento se houver dor abdominal intensa e contínua, vômitos frequentes, tontura ao levantar, sangramento de gengiva/nariz ou sonolência excessiva."
  },
  {
    "id_protocolo": "chikungunya_fase_aguda_cronica",
    "titulo": "Manejo da Febre de Chikungunya: Fases Aguda e Crônica",
    "cids_relacionados": [
      "A92.0"
    ],
    "ciaps_relacionados": [
      "A77"
    ],
    "nivel_atencao": "Atencao_Primaria_e_Especializada",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Fases Clínicas da Doença\n* **Fase Aguda (até 14 dias):** Febre alta súbita, poliartralgia intensa bilateral e simétrica (mãos, punhos, tornozelos). Analgesia com Dipirona ou Paracetamol. Evitar AINEs até exclusão de dengue.\n* **Fase Pós-Aguda (15 a 90 dias):** Persistência de artralgia inflamatória. Pode-se introduzir AINEs com cautela ou corticoide em dose baixa se refratariedade.\n* **Fase Crônica (> 90 dias):** Poliartrite crônica erosiva destrutiva. Indicação de seguimento reumatológico e introdução de Metotrexato ou Hidroxicloroquina.",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - CHIKUNGUNYA (FASE AGUDA / ANALGESIA ESCALONADA)\nPaciente: [Nome do Paciente]\nData: [Data do Atendimento]\n\nUSO ORAL:\n1. Dipirona Monoidratada 500mg comprimido -------------- 2 caixas (40 comprimidos)\n   Tomar 2 comprimidos (1000 mg) por via oral a cada 6 horas de forma regular nos primeiros 5 dias.\n\n2. Cloridrato de Tramadol 50mg cápsula ------------------ 1 caixa (10 cápsulas)\n   Tomar 1 cápsula por via oral a cada 8 horas apenas se dor articular intensa incapacitante refratária à dipirona.\n   (Receituário de Controle Especial C1 - Branco em 2 vias).\n\nOrientações:\n- Repouso articular relativo e compressas frias nas articulações inflamadas por 20 minutos.\n- Ingesta de pelo menos 2.5 litros de líquidos ao dia."
  },
  {
    "id_protocolo": "zika_gestante_manifestacoes",
    "titulo": "Manejo da Infecção pelo Vírus Zika e Abordagem na Gestação",
    "cids_relacionados": [
      "A92.8",
      "O35.3"
    ],
    "ciaps_relacionados": [
      "A77",
      "W78"
    ],
    "nivel_atencao": "Atencao_Primaria_e_Pre_Natal",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Quadro Clínico e Sinais de Alerta\n* Exantema maculopapular pruriginoso precoce associado a febre baixa ou ausente, hiperemia conjuntival não purulenta e artralgias leves.\n* Risco primordial: Síndrome da Zika Congênita (microcefalia, calcificações cerebrais, artrogripose).\n\n## 2. Conduta Terapêutica na Gestante\n* Sintomáticos seguros: Paracetamol para controle álgico e febril. Anti-histamínicos seguros (Loratadina) para prurido intenso.\n* Ultrassonografia obstétrica seriada a cada 4 semanas para monitoramento da biometria fetal e circunferência cefálica.",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - ZIKA VÍRUS NA GESTAÇÃO\nPaciente: [Nome da Gestante]\nData: [Data do Atendimento]\n\nUSO ORAL:\n1. Paracetamol 500mg comprimido ------------------------ 1 caixa (20 comprimidos)\n   Tomar 1 a 2 comprimidos (500 a 750 mg) por via oral a cada 6 horas se dor ou febre (máximo 3000 mg/dia).\n\n2. Loratadina 10mg comprimido -------------------------- 1 caixa (10 comprimidos)\n   Tomar 1 comprimido por via oral uma vez ao dia se prurido cutâneo intenso.\n\nUSO TÓPICO:\n3. Repelente corporal à base de Icaridina 20% a 25% ----- 1 frasco\n   Aplicar nas áreas expostas da pele a cada 8 horas, reaplicando após suor intenso."
  },
  {
    "id_protocolo": "pneumonia_adquirida_comunidade",
    "titulo": "Pneumonia Adquirida na Comunidade (PAC) no Adulto: Manejo Ambulatorial",
    "cids_relacionados": [
      "J18.9",
      "J13",
      "J15.9"
    ],
    "ciaps_relacionados": [
      "R81"
    ],
    "nivel_atencao": "Atencao_Primaria",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Estratificação de Gravidade pelo Escore CURB-65\n* **C (Confusão mental):** +1\n* **U (Ureia > 50 mg/dL):** +1\n* **R (Frequência Respiratória >= 30 ipm):** +1\n* **B (Pressão Arterial PAS < 90 ou PAD <= 60 mmHg):** +1\n* **65 (Idade >= 65 anos):** +1\n* **Conduta:** Escore 0 ou 1: Tratamento ambulatorial seguro. Escore 2: Avaliar internação em enfermaria. Escore >= 3: Internação hospitalar mandatória; considerar UTI se >= 4.\n\n## 2. Esquema Antimicrobiano Empírico\n* Adulto hígido sem comorbidades: Amoxicilina 500 mg VO 8/8h por 7 dias (ou Azitromicina 500 mg VO/dia por 5 dias).\n* Adulto com comorbidades (DM, DPOC, cardiopatia): Amoxicilina 875 mg + Clavulanato 125 mg VO 12/12h associado a Azitromicina 500 mg/dia.",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - PNEUMONIA COMUNITÁRIA (AMBULATORIAL)\nPaciente: [Nome do Paciente]\nData: [Data do Atendimento]\n\nUSO ORAL:\n1. Amoxicilina 500mg cápsula --------------------------- 1 caixa (21 cápsulas)\n   Tomar 1 cápsula por via oral a cada 8 horas durante 7 dias.\n\n2. Dipirona Monoidratada 500mg comprimido -------------- 1 blister (10 comprimidos)\n   Tomar 1 a 2 comprimidos por via oral a cada 6 horas se dor torácica ou febre.\n\nOrientações:\n- Esta receita contempla o adulto hígido sem comorbidades (CURB-65 0 ou 1). Em caso de comorbidades, substituir por Amoxicilina + Clavulanato 875/125 mg 12/12h associada a Azitromicina; em alergia a penicilina, usar Azitromicina 500 mg/dia por 5 dias.\n- Manter repouso e hidratação oral mínima de 2 litros ao dia.\n- Reavaliação médica ambulatorial obrigatória em 48 a 72 horas."
  },
  {
    "id_protocolo": "sinusite_bacteriana_aguda",
    "titulo": "Rinossinusite Bacteriana Aguda no Adulto",
    "cids_relacionados": [
      "J01.9",
      "J01.0"
    ],
    "ciaps_relacionados": [
      "R75"
    ],
    "nivel_atencao": "Atencao_Primaria",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Diferenciação: Viral vs Bacteriana\n* A esmagadora maioria (> 95%) das rinossinusites agudas é viral (resfriado comum).\n* **Indicações de infecção bacteriana:**\n  1. Sintomas persistentes sem melhora após 10 dias de evolução;\n  2. Piora bifásica ('double sickening'): piora abrupta de febre e secreção após melhora inicial;\n  3. Início severo: febre alta (> 39 ºC) associada a secreção purulenta e dor facial intensa por >= 3 dias consecutivos.",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - RINOSSINUSITE BACTERIANA AGUDA\nPaciente: [Nome do Paciente]\nData: [Data do Atendimento]\n\nUSO NASAL:\n1. Soro Fisiológico 0.9% frasco 500 mL ------------------ 1 frasco\n   Fazer lavagem nasal de alto volume com seringa (10 a 20 mL em cada narina) 3 a 4 vezes ao dia.\n\n2. Budesonida Spray Nasal 50 mcg/dose ------------------ 1 frasco (120 doses)\n   Aplicar 2 jatos em cada narina pela manhã e à noite durante 14 dias (aplicar após a lavagem nasal).\n\nUSO ORAL:\n3. Amoxicilina 500mg cápsula --------------------------- 1 caixa (21 cápsulas)\n   Tomar 1 cápsula por via oral a cada 8 horas durante 7 dias.\n\n4. Dipirona Monoidratada 500mg comprimido -------------- 1 blister (10 comprimidos)\n   Tomar 1 comprimido por via oral a cada 6 horas se dor facial ou cefaleia."
  },
  {
    "id_protocolo": "otite_media_aguda_pediatrica",
    "titulo": "Otite Média Aguda (OMA) na Infância",
    "cids_relacionados": [
      "H65.0",
      "H66.0"
    ],
    "ciaps_relacionados": [
      "H71"
    ],
    "nivel_atencao": "Atencao_Primaria_e_Pediatria",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Critérios Diagnósticos\n* Início agudo de otalgia (ou irritabilidade/puxar a orelha em lactentes);\n* Abaulamento moderado a severo da membrana timpânica à otoscopia pneumática ou otorreia aguda não decorrente de otite externa.\n\n## 2. Dose Pediátrica de Amoxicilina\n* **Dose Padrão OMA:** 80 a 90 mg/kg/dia fracionado a cada 12 horas por 10 dias em menores de 2 anos (ou 7 dias em maiores de 2 anos com OMA leve).\n* Essa alta concentração garante níveis terapêuticos eficazes no fluido da orelha média contra cepas de Streptococcus pneumoniae com sensibilidade intermediária à penicilina.",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - OTITE MÉDIA AGUDA PEDIÁTRICA\nPaciente: [Nome da Criança] | Peso: [Ex: 12 kg]\nData: [Data do Atendimento]\n\nUSO ORAL:\n1. Amoxicilina 250mg/5mL suspensão oral (50 mg/mL) ------ 2 frascos (150 mL cada)\n   Dar [Calcular: 90 mg/kg/dia / 2 tomadas = Ex: 10.8 mL] por via oral a cada 12 horas por 10 dias consecutivos.\n   (Agitar bem o frasco antes de cada administração; manter refrigerado após reconstituição).\n\n2. Dipirona Monoidratada 500mg/mL gotas ---------------- 1 frasco (20 mL)\n   Dar 1 gota para cada 2 kg de peso por via oral a cada 6 horas em caso de dor de ouvido ou febre.\n\nOrientações:\n- Não molhar o ouvido afetado durante o banho.\n- Não introduzir cotonetes ou soluções otológicas tópicas se houver perfuração timpânica visível."
  },
  {
    "id_protocolo": "itu_nao_complicada",
    "titulo": "Manejo da Infecção do Trato Urinário Não Complicada (Cistite Aguda)",
    "cids_relacionados": [
      "N39.0",
      "N30.0"
    ],
    "ciaps_relacionados": [
      "U71"
    ],
    "nivel_atencao": "Atencao_Primaria",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Abordagem Diagnóstica\n* Presença de disúria, polaciúria e urgência miccional sem sintomas vaginais (ausência de corrimento ou prurido).\n* Ausência de febre, calafrios ou dor em flanco (sinais sugestivos de pielonefrite).\n* Urocultura com antibiograma recomendada apenas se: suspeita de pielonefrite, sintomas atípicos, falha terapêutica ou infecção recorrente (>= 3 episódios/ano).\n\n## 2. Escolha Antimicrobiana de 1ª Linha\n* **Fosfomicina trometamol 3g dose única:** Excelente adesão e baixos índices de resistência em Escherichia coli.\n* **Nitrofurantoína 100mg VO 6/6h por 5 dias:** Primeira linha segura se TFG > 30 mL/min.",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - CISTITE AGUDA NÃO COMPLICADA\nPaciente: [Nome da Paciente]\nData: [Data do Atendimento]\n\nUSO ORAL:\n1. Fosfomicina trometamol 3g pó para solução oral ------- 1 sachê\n   Dissolver 1 sachê em meio copo de água e tomar em dose única por via oral, à noite ao deitar, logo após esvaziar a bexiga.\n\n2. Dipirona Monoidratada 500mg/mL gotas ---------------- 1 frasco (20 mL)\n   Tomar 35 a 40 gotas por via oral a cada 6 a 8 horas se dor ou desconforto miccional nas primeiras 48 horas.\n\nOrientações Preventivas:\n- Ingerir pelo menos 2 litros de água ao longo do dia.\n- Urinar após o coito e evitar postergar a micção quando sentir vontade."
  },
  {
    "id_protocolo": "pielonefrite_aguda_nao_complicada",
    "titulo": "Pielonefrite Aguda Não Complicada (Manejo Ambulatorial)",
    "cids_relacionados": [
      "N10"
    ],
    "ciaps_relacionados": [
      "U70"
    ],
    "nivel_atencao": "Atencao_Primaria_e_Urgencia",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Critérios de Internação Hospitalar\n* Intolerância gástrica (vômitos incoercíveis impossibilitando medicação oral);\n* Sepse ou instabilidade hemodinâmica;\n* Gestantes;\n* Obstrução do trato urinário conhecida ou litíase associada;\n* Descompensação de comorbidades clínicas de base.\n\n## 2. Conduta Ambulatorial para Pacientes Selecionados\n* Coletar Urocultura com antibiograma e hemograma antes da primeira dose.\n* Dose de ataque inicial parenteral no pronto-atendimento (Ceftriaxona 1g IV) seguida de Ciprofloxacino oral se estabilidade clínica.",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - PIELONEFRITE AGUDA AMBULATORIAL\nPaciente: [Nome do Paciente]\nData: [Data do Atendimento]\n\nUSO ORAL:\n1. Cloridrato de Ciprofloxacino 500mg comprimido ------- 1 caixa (14 comprimidos)\n   Tomar 1 comprimido por via oral a cada 12 horas durante 7 dias consecutivos.\n   (Receituário Antimicrobiano em 2 vias).\n\n2. Dipirona Monoidratada 500mg comprimido -------------- 1 caixa (20 comprimidos)\n   Tomar 1 a 2 comprimidos por via oral a cada 6 horas em caso de dor lombar ou febre.\n\nOrientações Críticas:\n- Reavaliação médica presencial mandatória em 48 horas.\n- Procurar hospital imediatamente se apresentar vômitos contínuos, febre > 39 ºC persistente ou queda da pressão arterial."
  },
  {
    "id_protocolo": "erisipela_celulite_infecciosa",
    "titulo": "Manejo da Erisipela e Celulite Infecciosa de Membros Inferiores",
    "cids_relacionados": [
      "A46",
      "L03.1"
    ],
    "ciaps_relacionados": [
      "S76"
    ],
    "nivel_atencao": "Atencao_Primaria_e_Pronto_Atendimento",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Diferenciação Clínica\n* **Erisipela:** Acomete derme superficial e linfáticos; bordas nítidas, elevadas e bem demarcadas; Streptococcus pyogenes predominante.\n* **Celulite:** Acomete derme profunda e tecido subcutâneo; bordas mal delimitadas e difusas; Staphylococcus aureus e estreptococos.\n\n## 2. Tratamento Oral Ambulatorial\n* Demarcar com caneta a borda do eritema para acompanhar a resposta clínica diária.\n* Elevação do membro afetado acima do nível do quadril (reduz edema e acelera cura).",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - ERISIPELA / CELULITE AMBULATORIAL\nPaciente: [Nome do Paciente]\nData: [Data do Atendimento]\n\nUSO ORAL:\n1. Cefalexina 500mg cápsula ---------------------------- 2 caixas (56 cápsulas)\n   Tomar 1 cápsula por via oral a cada 6 horas durante 10 dias consecutivos.\n   (Receituário Antimicrobiano em 2 vias).\n\n2. Dipirona Monoidratada 500mg comprimido -------------- 1 caixa (20 comprimidos)\n   Tomar 1 a 2 comprimidos por via oral a cada 6 horas se dor local ou febre.\n\nOrientações:\n- Manter a perna elevada durante o repouso com almofadas sob a panturrilha.\n- Tratar a porta de entrada (frieiras interdigitais, micose ungueal ou ferimentos)."
  },
  {
    "id_protocolo": "impetigo_crostoso_bolhoso",
    "titulo": "Manejo do Impetigo Crostoso e Bolhoso na Criança e Adulto",
    "cids_relacionados": [
      "L01.0",
      "L01.1"
    ],
    "ciaps_relacionados": [
      "S84"
    ],
    "nivel_atencao": "Atencao_Primaria",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Características e Etiologia\n* Lesões vesicopustulosas com crostas melicéricas aderentes ('aspecto de açúcar queimado') periorificiais.\n* Agentes etiológicos: Staphylococcus aureus e Streptococcus pyogenes.\n\n## 2. Conduta Terapêutica\n* **Lesões localizadas (< 3 lesões):** Pomada tópica de Mupirocina 2% por 7 dias após amolecimento das crostas com água morna.\n* **Lesões disseminadas ou sistêmicas:** Cefalexina por via oral associada ao cuidado local.",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - IMPETIGO\nPaciente: [Nome do Paciente]\nData: [Data do Atendimento]\n\nUSO TÓPICO:\n1. Mupirocina 2% pomada dermatológica ------------------ 1 bisnaga (15 g)\n   Lavar suavemente a região com água morna e sabonete neutro para remover crostas frouxas.\n   Aplicar fina camada da pomada sobre as lesões 3 vezes ao dia durante 7 dias.\n\nUSO ORAL (Se lesões extensas):\n2. Cefalexina 500mg comprimido (ou suspensão 250mg/5mL) -- 1 caixa\n   Adultos: 500 mg por via oral a cada 6 horas por 7 dias. Crianças: 25 a 50 mg/kg/dia da suspensão 250mg/5mL, divididos a cada 6 horas, por 7 dias.\n\nOrientações:\n- Uso estritamente individual de toalhas de banho e roupas de cama para evitar disseminação intrafamiliar."
  },
  {
    "id_protocolo": "herpes_zoster_nevralgia",
    "titulo": "Abordagem do Herpes Zoster e Prevenção da Nevralgia Pós-Herpética",
    "cids_relacionados": [
      "B02.9",
      "G53.0"
    ],
    "ciaps_relacionados": [
      "S70"
    ],
    "nivel_atencao": "Atencao_Primaria_e_Pronto_Atendimento",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Janela de Eficácia Antiviral\n* Reativação do vírus Varicela-Zóster em dermátomo unilateral.\n* Iniciar antiviral idealmente nas primeiras 72 horas do surgimento das vesículas para reduzir a duração do quadro e o risco de Nevralgia Pós-Herpética (NPH).\n* Rastrear acometimento de ramo oftálmico do trigêmeo (Sinal de Hutchinson: vesícula na ponta do nariz) - encaminhamento oftalmológico de urgência pelo risco de ceratite herpética.",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - HERPES ZOSTER AGUDO\nPaciente: [Nome do Paciente]\nData: [Data do Atendimento]\n\nUSO ORAL:\n1. Aciclovir 800mg comprimido -------------------------- 5 caixas (35 comprimidos)\n   Tomar 1 comprimido (800 mg) por via oral 5 vezes ao dia (a cada 4 horas, pulando a dose da madrugada) durante 7 dias consecutivos.\n\n2. Dipirona Monoidratada 500mg comprimido -------------- 1 caixa (20 comprimidos)\n   Tomar 1 a 2 comprimidos por via oral a cada 6 horas se dor em queimação.\n\n3. Gabapentina 300mg cápsula --------------------------- 1 caixa (30 cápsulas)\n   Tomar 1 cápsula à noite antes de deitar nos primeiros 3 dias; aumentar para 1 cápsula 12/12h se dor neuropática intensa persistente."
  },
  {
    "id_protocolo": "parasitoses_intestinais_giardiase",
    "titulo": "Protocolo de Tratamento das Parasitoses Intestinais na Atenção Primária",
    "cids_relacionados": [
      "B82.9",
      "A07.1",
      "B77.9"
    ],
    "ciaps_relacionados": [
      "D96"
    ],
    "nivel_atencao": "Atencao_Primaria",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Espectro Terapêutico\n* **Geo-helmintos (Ascaris, Ancylostoma, Enterobius):** Albendazol em dose única (repetir após 14 dias para enterobíase devido ao ciclo biológico).\n* **Protozoários (Giardia lamblia, Entamoeba histolytica):** Secnidazol 2g dose única ou Metronidazol por 5 a 7 dias.",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - PARASITOSES INTESTINAIS\nPaciente: [Nome do Paciente]\nData: [Data do Atendimento]\n\nUSO ORAL:\n1. Albendazol 400mg comprimido mastigável -------------- 2 comprimidos\n   Mastigar 1 comprimido em dose única junto a uma refeição gordurosa.\n   Repetir o segundo comprimido após 14 dias.\n\n2. Secnidazol 1000mg comprimido revestido -------------- 2 comprimidos\n   Tomar os 2 comprimidos juntos (dose total de 2000 mg) em dose única à noite após o jantar.\n   (Atenção: Não ingerir bebidas alcoólicas por até 72 horas devido ao efeito antabuse).\n\nOrientações:\n- Tratamento profilático de todos os coabitantes da mesma residência para quebrar o ciclo de transmissão."
  },
  {
    "id_protocolo": "sifilis_adquirida_primaria_secundaria",
    "titulo": "Manejo da Sífilis Adquirida (Primária, Secundária e Latente Recente)",
    "cids_relacionados": [
      "A51.0",
      "A51.3",
      "A52.9"
    ],
    "ciaps_relacionados": [
      "Y70"
    ],
    "nivel_atencao": "Atencao_Primaria_e_IST",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Esquemas Terapêuticos Padronizados\n* **Sífilis Primária (Cancro Duro), Secundária (Roséola, Condiloma plano) e Latente Recente (< 1 ano):**\n  - Penicilina G Benzatina 2.400.000 UI IM em dose única (1.200.000 UI em cada glúteo).\n* **Sífilis Latente Tardia (> 1 ano) ou Duração Indeterminada:**\n  - Penicilina G Benzatina 2.400.000 UI IM semanal por 3 semanas consecutivas (Dose cumulativa: 7.200.000 UI).\n* **Gestantes:** Penicilina G Benzatina é o ÚNICO medicamento eficaz para prevenção da Sífilis Congênita.",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - SÍFILIS ADQUIRIDA (DOSE ÚNICA)\nPaciente: [Nome do Paciente]\nData: [Data do Atendimento]\n\nUSO INTRAMUSCULAR PROFUNDO:\n1. Penicilina G Benzatina 1.200.000 UI suspensão injetável - 2 frascos-ampola\n   Aplicar 1 frasco-ampola por via intramuscular profunda em cada região glútea, em dose única (dose total: 2.400.000 UI).\n   (Aplicação imediata em unidade de saúde; observar por 30 minutos).\n\nOrientações:\n- Notificação compulsória e convocação de todos os parceiros sexuais dos últimos 90 dias para tratamento empírico simultâneo.\n- Controle sorológico quantitativo de cura com VDRL trimestral (espera-se queda de pelo menos 2 titulações em 6 meses, ex: de 1:32 para 1:8)."
  },
  {
    "id_protocolo": "uretrite_gonococica_clamidia",
    "titulo": "Abordagem Sindrômica das Uretrites e Cervicites (Gonorreia e Clamídia)",
    "cids_relacionados": [
      "A54.0",
      "A56.0"
    ],
    "ciaps_relacionados": [
      "U72",
      "X71"
    ],
    "nivel_atencao": "Atencao_Primaria_e_Urgencia",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Abordagem Sindrômica\n* Diante de corrimento uretral purulento ou mucopurulento, tratar obrigatoriamente e simultaneamente Neisseria gonorrhoeae e Chlamydia trachomatis em dose única presencial.",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - URETRITE / CERVICITE (SÍNDROME DE CORRIMENTO)\nPaciente: [Nome do Paciente]\nData: [Data do Atendimento]\n\nUSO INTRAMUSCULAR:\n1. Ceftriaxona 500mg pó liofilizado para injeção IM ---- 1 frasco-ampola + diluente\n   Reconstituir e aplicar 500 mg por via intramuscular profunda em dose única na unidade de saúde.\n\nUSO ORAL:\n2. Azitromicina 500mg comprimido ----------------------- 2 comprimidos\n   Tomar os 2 comprimidos juntos por via oral (dose total de 1000 mg) em dose única logo após a injeção.\n\nOrientações:\n- Abstenção de relações sexuais por 7 dias após o tratamento.\n- Tratamento e testagem para HIV, Sífilis e Hepatites de todas as parcerias sexuais recentes."
  },
  {
    "id_protocolo": "candidiaze_vulvovaginal",
    "titulo": "Manejo da Candidíase Vulvovaginal Aguda",
    "cids_relacionados": [
      "B37.3"
    ],
    "ciaps_relacionados": [
      "X72"
    ],
    "nivel_atencao": "Atencao_Primaria",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Quadro Clínico Típico\n* Prurido vulvar intenso, ardor miccional externo, edema e eritema vulvovaginal.\n* Corrimento esbranquiçado grumoso ('aspecto de leite coalhado') aderido às paredes vaginais com pH < 4.5.",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - CANDIDÍASE VULVOVAGINAL\nPaciente: [Nome da Paciente]\nData: [Data do Atendimento]\n\nUSO ORAL:\n1. Fluconazol 150mg cápsula ---------------------------- 1 cápsula\n   Tomar 1 cápsula por via oral em dose única.\n   (Contraindicado em gestantes: utilizar exclusivamente terapia tópica com clotrimazol/miconazol).\n\nUSO VAGINAL:\n2. Nitrato de Miconazol creme vaginal 2% --------------- 1 bisnaga (80 g) com aplicadores\n   Aplicar 1 aplicador cheio profundamente na vagina à noite ao deitar durante 7 dias consecutivos.\n\nOrientações:\n- Usar roupas íntimas de algodão folgadas e evitar protetores diários sintéticos abafados."
  },
  {
    "id_protocolo": "vaginose_bacteriana_tricomoniase",
    "titulo": "Tratamento da Vaginose Bacteriana e Tricomoníase Vaginal",
    "cids_relacionados": [
      "N76.0",
      "A59.0"
    ],
    "ciaps_relacionados": [
      "X73"
    ],
    "nivel_atencao": "Atencao_Primaria",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Critérios de Amsel para Vaginose Bacteriana\n* Corrimento acinzentado fino homogêneo;\n* pH vaginal > 4.5;\n* Teste das aminas positivo (Whiff test com KOH 10%: odor característico de peixe em decomposição);\n* Presença de 'Clue Cells' (células guia) à microscopia óptica.",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - VAGINOSE BACTERIANA\nPaciente: [Nome da Paciente]\nData: [Data do Atendimento]\n\nUSO ORAL:\n1. Metronidazol 400mg (ou 500mg) comprimido ------------ 1 caixa (20 comprimidos)\n   Tomar 1 comprimido por via oral a cada 12 horas durante 7 dias consecutivos.\n\nADVERTÊNCIA RIGOROSA:\n- PROIBIDO CONSUMO DE ÁLCOOL durante o tratamento e até 48 horas após a última dose pelo risco de reação dissulfiram-like (rubor facial, taquicardia, náuseas e vômitos incoercíveis)."
  },
  {
    "id_protocolo": "influenza_sindrome_gripal_oseltamivir",
    "titulo": "Manejo da Síndrome Gripal e Uso do Oseltamivir (Influenza A/B)",
    "cids_relacionados": [
      "J10.1",
      "J11.1"
    ],
    "ciaps_relacionados": [
      "R80"
    ],
    "nivel_atencao": "Atencao_Primaria_e_Urgencia",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Grupos Prioritários para Antiviral (Oseltamivir)\n* Gestantes e puérperas (até 2 semanas pós-parto);\n* Crianças < 2 anos e idosos >= 60 anos;\n* Portadores de pneumopatias (incluindo asma), cardiopatias, imunossuprimidos, renais crônicos e obesidade grau III (IMC >= 40);\n* Sinais de Síndrome Respiratória Aguda Grave (SRAG): dispneia, SpO2 < 95% em ar ambiente, hipotensão arterial.",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - SÍNDROME GRIPAL EM GRUPO DE RISCO\nPaciente: [Nome do Paciente]\nData: [Data do Atendimento]\n\nUSO ORAL:\n1. Fosfato de Oseltamivir 75mg cápsula dura ------------ 1 caixa (10 cápsulas)\n   Tomar 1 cápsula por via oral a cada 12 horas durante 5 dias consecutivos.\n   (Iniciar idealmente nas primeiras 48 horas do início dos sintomas gripais).\n\n2. Dipirona Monoidratada 500mg comprimido -------------- 1 blister (10 comprimidos)\n   Tomar 1 a 2 comprimidos por via oral a cada 6 horas se febre alta ou mialgia intensa.\n\nOrientações:\n- Isolamento respiratório domiciliar e uso de máscara cirúrgica até 24 horas após cessar a febre.\n- Retorno de urgência se sentir falta de ar, dor no peito ou lábios arroxeados."
  },
  {
    "id_protocolo": "crise_hipertensiva",
    "titulo": "Abordagem da Crise Hipertensiva: Urgência vs Emergência Hipertensiva",
    "cids_relacionados": [
      "I10",
      "I15"
    ],
    "ciaps_relacionados": [
      "K86",
      "K87"
    ],
    "nivel_atencao": "Atencao_Primaria_e_Pronto_Atendimento",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Classificação Diferencial Obrigatória\n* **Urgência Hipertensiva:** PA >= 180x120 mmHg SEM evidência de lesão aguda em órgãos-alvo (sem encefalopatia, sem edema agudo de pulmão, sem dissecção aórtica).\n  - *Conduta:* Redução gradual da PA por via oral em 24 a 48 horas. Evitar quedas abruptas com nifedipino sublingual (risco de isquemia cerebral).\n* **Emergência Hipertensiva:** PA elevada COM lesão aguda em evolução em órgãos-alvo.\n  - *Conduta:* Internação imediata em UTI e vasodilatador intravenoso contínuo sob monitorização invasiva (Nitroprussiato de Sódio ou Nitroglicerina).",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - URGÊNCIA HIPERTENSIVA (CONTROLE AMBULATORIAL)\nPaciente: [Nome do Paciente]\nData: [Data do Atendimento]\n\nUSO ORAL:\n1. Maleato de Enalapril 10mg comprimido ----------------- 1 caixa (30 comprimidos)\n   Tomar 1 comprimido por via oral uma vez ao dia pela manhã.\n\n2. Hidroclorotiazida 25mg comprimido ------------------- 1 caixa (30 comprimidos)\n   Tomar 1 comprimido por via oral uma vez ao dia pela manhã junto ao enalapril.\n\nOrientações:\n- Redução estrita do sal no preparo dos alimentos; suspender caldos industrializados e embutidos.\n- Diário residencial de aferição da pressão arterial (anotar pela manhã e ao fim da tarde).\n- Retorno ao pronto-socorro se dor no peito, falta de ar súbita, perda de visão ou confusão mental."
  },
  {
    "id_protocolo": "hipertensao_arterial_estagio1_2",
    "titulo": "Hipertensão Arterial Sistêmica Estágios 1 e 2 (Terapia Combinada Inicial)",
    "cids_relacionados": [
      "I10"
    ],
    "ciaps_relacionados": [
      "K86"
    ],
    "nivel_atencao": "Atencao_Primaria",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Estratégia de Combinação Dupla Precoce\n* Para hipertensos estágio 2 (PA >= 160/100 mmHg) ou estágio 1 (140-159/90-99 mmHg) com alto risco cardiovascular, iniciar preferencialmente associação de duas classes em doses baixas.\n* **Mulheres em idade fértil:** BRA e IECA são contraindicados na gestação (toxicidade fetal); exigir contracepção eficaz ou optar por outra classe.\n* Classes preferenciais: BRA (Losartana) ou IECA (Enalapril) + Bloqueador dos Canais de Cálcio (Anlodipino) ou Tiazídico.",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - HIPERTENSÃO ARTERIAL (COMBINAÇÃO SINÉRGICA)\nPaciente: [Nome do Paciente]\nData: [Data do Atendimento]\n\nUSO ORAL:\n1. Losartana Potássica 50mg comprimido revestido ------- 1 caixa (30 comprimidos)\n   Tomar 1 comprimido por via oral uma vez ao dia pela manhã.\n\n2. Besilato de Anlodipino 5mg comprimido --------------- 1 caixa (30 comprimidos)\n   Tomar 1 comprimido por via oral uma vez ao dia pela manhã.\n\nOrientações:\n- Prática de exercícios aeróbicos regulares (150 minutos por semana).\n- Acompanhar surgimento de eventual edema maleolar vespertino leve decorrente do vasodilatador."
  },
  {
    "id_protocolo": "insuficiencia_cardiaca_fracao_reduzida",
    "titulo": "Insuficiência Cardíaca com Fração de Ejeção Reduzida (IC-FEr: O Quarteto Fantástico)",
    "cids_relacionados": [
      "I50.0",
      "I50.9"
    ],
    "ciaps_relacionados": [
      "K77"
    ],
    "nivel_atencao": "Atencao_Primaria_e_Cardiologia",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. As Quatro Classes Obrigatórias (Redução de Mortalidade Global)\n1. **Inibidor do SRAA:** IECA (Enalapril), BRA ou preferencialmente ARNI (Sacubitril/Valsartana);\n2. **Betabloqueador cardioprotetor:** Succinato de Metoprolol, Carvedilol ou Bisoprolol;\n3. **Antagonista do Receptor Mineralocorticoide:** Espironolactona 25 mg/dia;\n4. **Inibidor de SGLT2:** Dapagliflozina 10 mg ou Empagliflozina 10 mg uma vez ao dia.",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - INSUFICIÊNCIA CARDÍACA (IC-FEr)\nPaciente: [Nome do Paciente]\nData: [Data do Atendimento]\n\nUSO ORAL:\n1. Succinato de Metoprolol 25mg comprimido lib. prolongada - 1 caixa (30 comprimidos)\n   Tomar 1 comprimido por via oral pela manhã (titular dose a cada 2 a 4 semanas até 100-200 mg/dia).\n\n2. Maleato de Enalapril 5mg comprimido ------------------ 1 caixa (60 comprimidos)\n   Tomar 1/2 comprimido (2.5 mg) por via oral de 12 em 12 horas na 1ª semana; titular a cada 2 semanas até a dose-alvo de 10 a 20 mg de 12 em 12 horas conforme PA, potássio e creatinina.\n\n3. Espironolactona 25mg comprimido --------------------- 1 caixa (30 comprimidos)\n   Tomar 1 comprimido por via oral pela manhã (monitorar potássio e creatinina séricos).\n\n4. Dapagliflozina 10mg comprimido ----------------------- 1 caixa (30 comprimidos)\n   Tomar 1 comprimido por via oral uma vez ao dia pela manhã.\n\n5. Furosemida 40mg comprimido (Sintomático de Congestão) - 1 caixa (30 comprimidos)\n   Tomar 1 comprimido pela manhã em jejum se ganho de peso súbito (> 2 kg em 3 dias) ou edema nas pernas."
  },
  {
    "id_protocolo": "fibrilacao_atrial_anticoagulacao_cha2ds2vasc",
    "titulo": "Fibrilação Atrial: Prevenção de AVC e Estratificação CHA2DS2-VASc",
    "cids_relacionados": [
      "I48.0",
      "I48.9"
    ],
    "ciaps_relacionados": [
      "K78"
    ],
    "nivel_atencao": "Atencao_Primaria_e_Cardiologia",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Estratificação de Risco Embólico pelo Escore CHA2DS2-VASc\n* Insuficiência Cardíaca (+1), Hipertensão (+1), Idade >= 75 anos (+2), Diabetes (+1), AVC/AIT prévio (+2), Doença Vascular (+1), Idade 65-74 (+1), Sexo Feminino (+1).\n* **Indicação de Anticoagulação:** Homens com escore >= 2 e Mulheres com escore >= 3 têm indicação formal de DOAC (Anticoagulante Oral Direto) ou Varfarina.\n* **Exceção:** FA com estenose mitral moderada a grave ou prótese valvar mecânica não deve receber DOAC; usar Varfarina (INR 2-3).",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - FIBRILAÇÃO ATRIAL (ANTICOAGULAÇÃO ORAL)\nPaciente: [Nome do Paciente]\nData: [Data do Atendimento]\n\nUSO ORAL:\n1. Rivaroxabana 20mg comprimido revestido -------------- 1 caixa (28 comprimidos)\n   Tomar 1 comprimido por via oral uma vez ao dia, obrigatoriamente junto à maior refeição (almoço ou jantar).\n   (Ajustar para 15 mg/dia se ClCr entre 15 e 49 mL/min).\n\n2. Atenolol 50mg comprimido (Controle de Frequência Cardíaca) - 1 caixa (30 comprimidos)\n   Tomar 1 comprimido por via oral uma vez ao dia pela manhã para manter FC alvo de repouso < 100 bpm.\n\nOrientações:\n- Atenção a sinais de sangramento (fezes escuras, sangue na urina ou hematomas espontâneos múltiplos)."
  },
  {
    "id_protocolo": "angina_estavel_doenca_coronariana",
    "titulo": "Doença Arterial Coronariana Crônica: Angina Estável",
    "cids_relacionados": [
      "I20.9",
      "I25.1"
    ],
    "ciaps_relacionados": [
      "K74"
    ],
    "nivel_atencao": "Atencao_Primaria_e_Cardiologia",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Metas do Tratamento\n* Prevenção secundária de infarto agudo do miocárdio e óbito cardiovascular (AAS + Estatina de alta intensidade);\n* Alívio dos sintomas isquêmicos e melhora da capacidade funcional (Betabloqueador + Nitrato).",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - DOENÇA ARTERIAL CORONARIANA CRÔNICA\nPaciente: [Nome do Paciente]\nData: [Data do Atendimento]\n\nUSO ORAL:\n1. Ácido Acetilsalicílico (AAS) 100mg comprimido -------- 1 caixa (30 comprimidos)\n   Tomar 1 comprimido por via oral uma vez ao dia logo após o almoço.\n\n2. Atorvastatina 40mg comprimido revestido -------------- 1 caixa (30 comprimidos)\n   Tomar 1 comprimido por via oral uma vez ao dia (estatina de alta intensidade; titular até 80 mg se LDL-c acima da meta).\n\n3. Atenolol 50mg comprimido ---------------------------- 1 caixa (30 comprimidos)\n   Tomar 1 comprimido por via oral pela manhã.\n\n4. Dinitrato de Isossorbida 5mg comprimido sublingual -- 1 caixa (20 comprimidos)\n   Colocar 1 comprimido sob a língua apenas em caso de dor no peito aos esforços; se dor persistir por mais de 5 a 10 minutos, procurar emergência com urgência."
  },
  {
    "id_protocolo": "dislipidemia_prevencao_cardiovascular",
    "titulo": "Prevenção Cardiovascular Primária e Manejo das Dislipidemias (SBC / AHA)",
    "cids_relacionados": [
      "E78.0",
      "E78.2"
    ],
    "ciaps_relacionados": [
      "T93"
    ],
    "nivel_atencao": "Atencao_Primaria",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Metas de LDL-c segundo Risco Cardiovascular Global (SBC)\n* Baixo Risco: LDL-c < 130 mg/dL\n* Risco Intermediário: LDL-c < 100 mg/dL\n* Alto Risco (DM, placa carotídea subclínica, aneurisma): LDL-c < 70 mg/dL\n* Muito Alto Risco (Infarto prévio, AVC prévio, revascularização): LDL-c < 50 mg/dL",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - DISLIPIDEMIA (PREVENÇÃO CARDIOVASCULAR)\nPaciente: [Nome do Paciente]\nData: [Data do Atendimento]\n\nUSO ORAL:\n1. Sinvastatina 20mg (ou 40mg) comprimido revestido ---- 2 caixas (60 comprimidos)\n   Tomar 1 comprimido por via oral uma vez ao dia à noite ao deitar.\n   (A síntese hepática do colesterol ocorre preferencialmente durante o repouso noturno).\n\nOrientações:\n- Dieta com restrição de gorduras trans e saturadas; estímulo ao azeite de oliva e fibras solúveis (aveia).\n- Comunicar o médico se apresentar dor muscular generalizada persistente ou urina escura."
  },
  {
    "id_protocolo": "doenca_renal_cronica_nefroprotecao",
    "titulo": "Doença Renal Crônica (DRC): Estratégias de Nefroproteção e Retardo da Progressão",
    "cids_relacionados": [
      "N18.9",
      "N18.3",
      "N18.4"
    ],
    "ciaps_relacionados": [
      "U99"
    ],
    "nivel_atencao": "Atencao_Primaria_e_Nefrologia",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Pilares Terapêuticos\n* Controle rigoroso da Pressão Arterial (alvo < 120/80 mmHg com técnica padronizada);\n* Bloqueio do SRAA com BRA ou IECA para redução da pressão intraglomerular e proteinúria;\n* Inibidores de SGLT2 (Dapagliflozina/Empagliflozina) para retardar declínio de TFG;\n* Evitar AINEs, contrastes iodados desnecessários e automedicação nefrotóxica.",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - NEFROPROTEÇÃO NA DRC (ESTÁGIOS G2 A G4)\nPaciente: [Nome do Paciente]\nData: [Data do Atendimento]\n\nUSO ORAL:\n1. Losartana Potássica 50mg comprimido revestido ------- 1 caixa (30 comprimidos)\n   Tomar 1 comprimido por via oral uma vez ao dia pela manhã.\n\n2. Dapagliflozina 10mg comprimido ----------------------- 1 caixa (30 comprimidos)\n   Tomar 1 comprimido por via oral uma vez ao dia pela manhã (indicado para TFG >= 20 mL/min).\n\nOrientações:\n- Restrição proteica moderada (0.8 g/kg/dia) orientada por nutricionista.\n- NUNCA tomar anti-inflamatórios como diclofenaco, cetoprofeno, nimesulida ou ibuprofeno."
  },
  {
    "id_protocolo": "asma_exacerbacao_aguda",
    "titulo": "Manejo da Exacerbação Aguda de Asma na Atenção Básica e Urgência",
    "cids_relacionados": [
      "J45",
      "J45.9",
      "J46"
    ],
    "ciaps_relacionados": [
      "R96"
    ],
    "nivel_atencao": "Atencao_Primaria_e_Urgencia",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Manejo Imediato na Crise Leve a Moderada\n* Salbutamol Spray 100 mcg acoplado a espaçador valvulado: 4 a 10 jatos a cada 20 minutos na primeira hora.\n* Corticoterapia sistêmica oral precoce (Prednisona 40 a 50 mg em dose única) acelera a resolução da inflamação e previne reinternações.",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - ALTA DA EXACERBAÇÃO DE ASMA\nPaciente: [Nome do Paciente]\nData: [Data do Atendimento]\n\nUSO INALATÓRIO:\n1. Sulfato de Salbutamol spray 100mcg/dose ------------- 1 frasco (200 doses)\n   Inalar 2 a 4 jatos com espaçador a cada 4 ou 6 horas em caso de chiado no peito ou falta de ar.\n\nUSO ORAL:\n2. Prednisona 20mg comprimido -------------------------- 1 caixa (20 comprimidos)\n   Tomar 2 comprimidos (40 mg) por via oral pela manhã, em dose única diária, durante 5 dias consecutivos.\n   (Não necessita de desmame se usado por apenas 5 dias).\n\nOrientações:\n- Utilizar obrigatoriamente o espaçador valvulado para garantir a deposição pulmonar do broncodilatador."
  },
  {
    "id_protocolo": "asma_tratamento_manutencao_gina",
    "titulo": "Tratamento de Manutenção da Asma Crônica (Diretrizes GINA)",
    "cids_relacionados": [
      "J45.0",
      "J45.8"
    ],
    "ciaps_relacionados": [
      "R96"
    ],
    "nivel_atencao": "Atencao_Primaria_e_Pneumologia",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Mudança de Paradigma GINA\n* O uso de broncodilatador de curta ação (SABA isolado) não é mais recomendado como monoterapia devido ao risco aumentado de exacerbações graves e mortalidade.\n* O pilar central é o Corticoide Inalatório (CI) associado a Formoterol (LABA de início rápido) como terapia de alívio e manutenção (SMART / MART).",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - ASMA CRÔNICA (MANUTENÇÃO GINA ETAPA 3)\nPaciente: [Nome do Paciente]\nData: [Data do Atendimento]\n\nUSO INALATÓRIO:\n1. Fumarato de Formoterol 6mcg + Budesonida 200mcg cápsulas inalatórias - 1 caixa (60 cápsulas)\n   Inalar 1 cápsula por via oral com o inalador a cada 12 horas diariamente de manutenção.\n   Em caso de sintomas agudos, inalar 1 cápsula adicional de alívio imediato (máximo de 8 a 12 cápsulas/dia).\n\nOrientações:\n- Enxaguar a boca com água e cuspir após cada inalação para prevenir candidíase oral (sapinho) e rouquidão."
  },
  {
    "id_protocolo": "dpoc_estavel_manutencao_gold",
    "titulo": "Doença Pulmonar Obstrutiva Crônica (DPOC): Tratamento Estável (GOLD)",
    "cids_relacionados": [
      "J44.0",
      "J44.9"
    ],
    "ciaps_relacionados": [
      "R95"
    ],
    "nivel_atencao": "Atencao_Primaria_e_Pneumologia",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Classificação ABE e Metas\n* Grupo A (Poucos sintomas, 0-1 exacerbação sem internação): Broncodilatador de longa ação (LAMA ou LABA).\n* Grupo B (Muitos sintomas mMRC >= 2 ou CAT >= 10): Dupla broncodilatação LAMA + LABA.\n* Grupo E (>= 2 exacerbações ou >= 1 internação no último ano): LAMA + LABA (+ Corticoide Inalatório se eosinófilos sanguíneos >= 300 células/mcL).",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - DPOC ESTÁVEL (GRUPO B / DUPLA BRONCODILATAÇÃO)\nPaciente: [Nome do Paciente]\nData: [Data do Atendimento]\n\nUSO INALATÓRIO:\n1. Brometo de Tiotrópio 2.5mcg inalador Respimat -------- 1 frasco (60 doses)\n   Inalar 2 jatos por via inalatória uma vez ao dia, no mesmo horário (LAMA).\n\n1b. Xinafoato de Salmeterol 50mcg pó inalatório --------- 1 inalador (60 doses)\n   Inalar 1 dose a cada 12 horas (LABA), completando a dupla broncodilatação do grupo B.\n\n2. Sulfato de Salbutamol 100mcg spray ------------------- 1 frasco\n   Inalar 2 jatos com espaçador se falta de ar aguda de resgate.\n\nOrientações Vitais:\n- Cessação do tabagismo imediata (medida com maior impacto na sobrevida).\n- Vacinação anual contra Influenza, Pneumococo (VPC13 e VPP23) e COVID-19."
  },
  {
    "id_protocolo": "rinite_alergica_persistente",
    "titulo": "Manejo da Rinite Alérgica Moderada a Grave (Diretrizes ARIA)",
    "cids_relacionados": [
      "J30.1",
      "J30.4"
    ],
    "ciaps_relacionados": [
      "R97"
    ],
    "nivel_atencao": "Atencao_Primaria",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Princípios de Tratamento\n* Corticosteroides nasais constituem a primeira linha com maior eficácia para controle de obstrução nasal, espirros e prurido.\n* Anti-histamínicos orais de 2ª geração (não sedantes) são adjuvantes de alívio rápido.",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - RINITE ALÉRGICA MODERADA A GRAVE\nPaciente: [Nome do Paciente]\nData: [Data do Atendimento]\n\nUSO NASAL:\n1. Soro Fisiológico 0.9% frasco 500 mL ------------------ 1 frasco\n   Realizar lavagem nasal com 10 a 20 mL em cada narina 2 vezes ao dia.\n\n2. Budesonida spray nasal 50mcg/dose -------------------- 1 frasco (120 doses)\n   Aplicar 1 a 2 jatos em cada narina uma vez ao dia pela manhã por pelo menos 30 a 60 dias consecutivos.\n\nUSO ORAL:\n3. Loratadina 10mg comprimido -------------------------- 1 caixa (12 comprimidos)\n   Tomar 1 comprimido por via oral uma vez ao dia se crises de prurido ocular ou espirros frequentes."
  },
  {
    "id_protocolo": "gastrite_drge",
    "titulo": "Manejo da Doença do Refluxo Gastroesofágico (DRGE) e Dispepsia",
    "cids_relacionados": [
      "K21.9",
      "K29.7"
    ],
    "ciaps_relacionados": [
      "D84",
      "D87"
    ],
    "nivel_atencao": "Atencao_Primaria",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Sinais de Alarme para Endoscopia Digestiva Alta (EDA) Obrigatória\n* Idade >= 50 anos com sintomas dispépticos novos;\n* Perda ponderal inexplicada;\n* Disfagia progressiva ou odinofagia;\n* Anemia ferropriva ou evidência de sangramento digestivo (hematêmese/melena);\n* Histórico familiar de neoplasia do trato gastrointestinal alto.",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - DRGE E DISPEPSIA\nPaciente: [Nome do Paciente]\nData: [Data do Atendimento]\n\nUSO ORAL:\n1. Omeprazol 20mg cápsula ------------------------------ 2 caixas (56 cápsulas)\n   Tomar 1 cápsula por via oral uma vez ao dia pela manhã em jejum rigoroso, exatamente 30 minutos antes do café da manhã, durante 8 semanas consecutivas.\n\nOrientações Não Farmacológicas:\n- Fracionar as refeições e não deitar nas 2 horas seguintes à alimentação.\n- Elevação da cabeceira da cama em 15 cm.\n- Evitar café, chocolates, frituras, refrigerantes e condimentos em excesso."
  },
  {
    "id_protocolo": "erradicacao_helicobacter_pylori",
    "titulo": "Erradicação do Helicobacter pylori: Terapia Quádrupla / Tripla Otimizada",
    "cids_relacionados": [
      "B96.81",
      "K25.9"
    ],
    "ciaps_relacionados": [
      "D85"
    ],
    "nivel_atencao": "Atencao_Primaria_e_Gastroenterologia",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Duração Otimizada de 14 Dias\n* Aumentar o tempo de tratamento de 7 para 14 dias eleva a taxa de erradicação para > 85%.\n* Dobrar a dose do IBP para garantir supressão ácida adequada, permitindo maior estabilidade dos antibióticos no estômago.",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - ERRADICAÇÃO DE HELICOBACTER PYLORI (14 DIAS)\nPaciente: [Nome do Paciente]\nData: [Data do Atendimento]\n\nUSO ORAL:\n1. Omeprazol 20mg cápsula ------------------------------ 2 caixas (56 cápsulas)\n   Tomar 1 cápsula de 12 em 12 horas (pela manhã em jejum e à noite antes do jantar) por 14 dias.\n\n2. Amoxicilina 500mg cápsula --------------------------- 4 caixas (112 cápsulas)\n   Tomar 2 cápsulas (1000 mg) por via oral a cada 12 horas durante 14 dias.\n\n3. Claritromicina 500mg comprimido revestido ----------- 2 caixas (28 comprimidos)\n   Tomar 1 comprimido por via oral a cada 12 horas durante 14 dias.\n\nOrientações:\n- Não interromper o tratamento; o cumprimento integral dos 14 dias é vital para evitar falha terapêutica e resistência bacteriana.\n- Teste respiratório com ureia marcada ou antígeno fecal após pelo menos 4 semanas do término para comprovação de cura."
  },
  {
    "id_protocolo": "constipacao_intestinal_cronica",
    "titulo": "Constipação Intestinal Funcional Crônica no Adulto e Idoso",
    "cids_relacionados": [
      "K59.0"
    ],
    "ciaps_relacionados": [
      "D12"
    ],
    "nivel_atencao": "Atencao_Primaria",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Escalonamento Terapêutico\n* Linha 1: Fibras solúveis (Psyllium) e hidratação (1.5 a 2 L/dia);\n* Linha 2: Laxativos osmóticos de escolha segura para uso continuado (Polietilenoglicol - PEG 4000 ou Lactulose);\n* Evitar uso crônico de laxativos estimulantes antraquinônicos (sene, cáscara sagrada) pelo risco de catarse colônica e melanose de cólon.",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - CONSTIPAÇÃO INTESTINAL FUNCIONAL\nPaciente: [Nome do Paciente]\nData: [Data do Atendimento]\n\nUSO ORAL:\n1. Polietilenoglicol 4000 pó (sem eletrólitos) sachê 10g - 2 caixas (30 sachês)\n   Dissolver 1 a 2 sachês em um copo de água ou suco e tomar uma vez ao dia pela manhã.\n\n2. Lactulose 667mg/mL xarope --------------------------- 1 frasco (120 mL)\n   Tomar 15 a 30 mL por via oral uma vez ao dia se fezes endurecidas.\n\nOrientações:\n- Consumir frutas laxativas com casca (mamão, ameixa preta, kiwi) e vegetais folhosos.\n- Atender prontamente ao reflexo gastrocólico após as refeições."
  },
  {
    "id_protocolo": "diarreia_aguda_gastroenterite",
    "titulo": "Gastroenterite Aguda e Diarreia no Adulto e Criança",
    "cids_relacionados": [
      "A09",
      "K52.9"
    ],
    "ciaps_relacionados": [
      "D11",
      "D73"
    ],
    "nivel_atencao": "Atencao_Primaria_e_Urgencia",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Regra de Ouro da OMS\n* Hidratação precoce com solução salina-glicídica isotônica previne a desidratação e o óbito em mais de 98% dos casos.\n* Em crianças, o Zinco oral por 10 a 14 dias reduz a gravidade, duração e episódios diarreicos nos 3 meses subsequentes.\n* Antibióticos são contraindicados de rotina; indicados apenas em disenteria grave (sangue e muco visíveis nas fezes) ou suspeita de cólera.",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - GASTROENTERITE AGUDA\nPaciente: [Nome do Paciente]\nData: [Data do Atendimento]\n\nUSO ORAL:\n1. Sais de Reidratação Oral (SRO) sachê 27.9g ------------ 10 envelopes\n   Diluir 1 envelope em exatamente 1 litro de água filtrada.\n   Ingerir 1 copo (200 mL) a cada evacuação líquida ou vômito.\n\n2. Racecadotrila 100mg cápsula (Antissecretor) ---------- 1 caixa (10 cápsulas)\n   Tomar 1 cápsula por via oral a cada 8 horas até o término da diarreia (máximo 7 dias).\n\n3. Probiótico (Saccharomyces boulardii 200mg) ----------- 1 caixa (10 sachês)\n   Tomar 1 sachê dissolvido em água 2 vezes ao dia por 5 dias.\n\nOrientações:\n- Não utilizar loperamida se houver febre alta ou sangue nas fezes.\n- Manter alimentação habitual branda; evitar leite e sucos muito açucarados."
  },
  {
    "id_protocolo": "diabetes_mellitus_tipo2",
    "titulo": "Manejo Farmacológico Inicial do Diabetes Mellitus Tipo 2 no SUS",
    "cids_relacionados": [
      "E11",
      "E11.9"
    ],
    "ciaps_relacionados": [
      "T90"
    ],
    "nivel_atencao": "Atencao_Primaria",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Metformina como Terapia Inicial Padrão\n* Iniciar com 500 a 850 mg/dia junto à refeição principal e titular gradualmente a cada 14 dias até dose plena de 2000 a 2550 mg/dia.\n* Redução esperada de HbA1c: 1.0% a 1.5%.\n* Monitorar TFG: Contraindicação formal absoluta se TFG < 30 mL/min/1.73m² (risco de acidose lática).",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - DIABETES MELLITUS TIPO 2\nPaciente: [Nome do Paciente]\nData: [Data do Atendimento]\n\nUSO ORAL:\n1. Cloridrato de Metformina 850mg comprimido ----------- 2 caixas (60 comprimidos)\n   - Primeiros 14 dias: Tomar 1 comprimido por via oral logo após o almoço ou jantar.\n   - A partir do 15º dia: Tomar 1 comprimido após o café da manhã e 1 comprimido após o jantar (total 1700 mg/dia).\n\nOrientações:\n- Tomar sempre durante ou após as refeições para amenizar desconfortos digestivos.\n- Agendar retorno em 3 meses com dosagem de Hemoglobina Glicada (alvo < 7.0%)."
  },
  {
    "id_protocolo": "diabetes_tipo2_associacao_metformina_isglt2",
    "titulo": "Diabetes Tipo 2: Terapia Combinada com Inibidor de SGLT2 (Proteção Cardio-Renal)",
    "cids_relacionados": [
      "E11.2",
      "E11.5"
    ],
    "ciaps_relacionados": [
      "T90"
    ],
    "nivel_atencao": "Atencao_Primaria_e_Endocrinologia",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Benefícios Independentes do Controle Glicêmico\n* Redução de hospitalização por insuficiência cardíaca e retardo na progressão da doença renal do diabetes.\n* Promove glicosúria osmótica com perda ponderal (~2 a 3 kg) e modesta redução pressórica sistólica (~3 a 5 mmHg).",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - DIABETES TIPO 2 (PROTEÇÃO CARDIO-RENAL)\nPaciente: [Nome do Paciente]\nData: [Data do Atendimento]\n\nUSO ORAL:\n1. Cloridrato de Metformina 500mg lib. prolongada (XR) -- 2 caixas (60 comprimidos)\n   Tomar 2 comprimidos (1000 mg) por via oral juntos após o jantar.\n\n2. Dapagliflozina 10mg comprimido revestido ------------- 1 caixa (30 comprimidos)\n   Tomar 1 comprimido por via oral uma vez ao dia pela manhã.\n\nOrientações:\n- Manter higiene íntima rigorosa com água após micções para prevenir candidíase urogenital.\n- Manter hidratação adequada ao longo do dia.\n- Suspender a dapagliflozina em jejum prolongado, vômitos/diarreia ou doença aguda grave e procurar atendimento se náuseas, dor abdominal ou mal-estar intenso (risco de cetoacidose euglicêmica).\n- Para efeito glicêmico, TFG >= 45 mL/min; para proteção cardio-renal, pode ser mantida até TFG >= 20 mL/min."
  },
  {
    "id_protocolo": "hipotireoidismo_primario_levotiroxina",
    "titulo": "Hipotireoidismo Primário no Adulto e Idoso: Manejo com Levotiroxina",
    "cids_relacionados": [
      "E03.9",
      "E03.8"
    ],
    "ciaps_relacionados": [
      "T86"
    ],
    "nivel_atencao": "Atencao_Primaria",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Posologia e Titulação\n* Adulto jovem sem cardiopatia: Dose plena estimada em 1.6 mcg/kg/dia.\n* Idosos (> 60 anos) ou portadores de coronariopatia: Iniciar com doses baixas de 12.5 a 25 mcg/dia e titular a cada 6 a 8 semanas para evitar precipitação de arritmias ou angina.\n* Coleta de TSH de controle após 6 a 8 semanas da dose estável (alvo de TSH: 0.5 a 4.0 mUI/L).",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - HIPOTIREOIDISMO PRIMÁRIO\nPaciente: [Nome do Paciente]\nData: [Data do Atendimento]\n\nUSO ORAL:\n1. Levotiroxina Sódica 50mcg comprimido ----------------- 1 caixa (30 comprimidos)\n   Tomar 1 comprimido por via oral uma vez ao dia pela manhã em jejum estrito com água, pelo menos 30 a 60 minutos antes do café da manhã.\n\nOrientações Mandatórias:\n- Não tomar junto a café, leite, suplementos de cálcio ou sulfato ferroso (aguardar pelo menos 4 horas após a levotiroxina para ingerir ferro ou cálcio)."
  },
  {
    "id_protocolo": "gota_artrite_urica_aguda_e_profilaxia",
    "titulo": "Artrite Gotosa Aguda (Crise) e Hipouricemiantes Crônicos (Alopurinol)",
    "cids_relacionados": [
      "M10.0",
      "M10.9"
    ],
    "ciaps_relacionados": [
      "T92"
    ],
    "nivel_atencao": "Atencao_Primaria_e_Reumatologia",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Crise Aguda de Podagra (1ª Metatarsofalângica)\n* Colchicina: 1 mg imediatamente, seguido de 0.5 mg após 1 hora (dose total de 1.5 mg no 1º dia); manter 0.5 mg 12/12h até resolução.\n* **REGRA FUNDAMENTAL:** NÃO suspender Alopurinol já em uso durante a crise (a variação dos níveis séricos de ácido úrico perpetua a precipitação de cristais de monourato). O início de hipouricemiante pode ocorrer durante ou após a crise (ACR 2020), sempre com profilaxia anti-inflamatória (colchicina 0.5 mg/dia) por 3 a 6 meses e dose inicial baixa (100 mg/dia).\n* Colchicina: ajustar em insuficiência renal e evitar com claritromicina (inibidor de CYP3A4/P-gp).",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - CRISE AGUDA DE GOTA (ARTRITE ÚRICA)\nPaciente: [Nome do Paciente]\nData: [Data do Atendimento]\n\nUSO ORAL:\n1. Colchicina 0.5mg comprimido ------------------------- 1 caixa (20 comprimidos)\n   - Tomar 2 comprimidos (1 mg) imediatamente ao primeiro sinal de dor.\n   - Tomar mais 1 comprimido (0.5 mg) exatamente 1 hora após a primeira dose.\n   - A partir do 2º dia: Tomar 1 comprimido (0.5 mg) a cada 12 horas por 5 a 7 dias.\n\n2. Dipirona Monoidratada 500mg comprimido -------------- 1 caixa (20 comprimidos)\n   Tomar 1 a 2 comprimidos por via oral a cada 6 horas se dor intensa.\n\nOrientações:\n- Repouso articular e aplicação de gelo local por 20 minutos 3 vezes ao dia.\n- Evitar cerveja, frutos do mar e carnes vermelhas em excesso."
  },
  {
    "id_protocolo": "osteoporose_pos_menopausa_alendronato",
    "titulo": "Osteoporose Pós-Menopausa: Terapia com Bisfosfonato (Alendronato)",
    "cids_relacionados": [
      "M81.0"
    ],
    "ciaps_relacionados": [
      "L95"
    ],
    "nivel_atencao": "Atencao_Primaria_e_Ginecologia",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Rastreamento e Indicação\n* Mulheres >= 65 anos ou com fratura por fragilidade óssea prévia;\n* Critério Densitométrico: T-score <= -2.5 em coluna lombar, colo de fêmur ou fêmur total.",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - OSTEOPOROSE\nPaciente: [Nome da Paciente]\nData: [Data do Atendimento]\n\nUSO ORAL:\n1. Alendronato de Sódio 70mg comprimido ----------------- 1 caixa (4 comprimidos)\n   Tomar 1 comprimido por via oral uma vez por semana (ex: todo domingo pela manhã) em jejum estrito com 1 copo cheio de água pura.\n\n2. Carbonato de Cálcio 500mg + Vitamina D3 400 UI ------ 1 frasco (60 comprimidos)\n   Tomar 1 comprimido por via oral após o almoço diariamente.\n\nINSTRUÇÃO DE SEGURANÇA CRÍTICA:\n- Após engolir o comprimido de alendronato com água, PERMANECER EM PÉ OU SENTADO POR PELO MENOS 30 MINUTOS (NUNCA DEITAR) para evitar refluxo e esofagite erosiva grave."
  },
  {
    "id_protocolo": "lombalgia_aguda",
    "titulo": "Abordagem da Lombalgia Mecânica Aguda (Lumbago)",
    "cids_relacionados": [
      "M54.5"
    ],
    "ciaps_relacionados": [
      "L03"
    ],
    "nivel_atencao": "Atencao_Primaria",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Rastreamento de Red Flags\n* Síndrome da Cauda Equina (anestesia em sela, incontinência urinária/fecal - emergência cirúrgica);\n* Suspeita de fratura ou neoplasia subjacente.\n* Desestímulo formal ao repouso no leito: movimentação acelera a resolução funcional.",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - LOMBALGIA MECÂNICA AGUDA\nPaciente: [Nome do Paciente]\nData: [Data do Atendimento]\n\nUSO ORAL:\n1. Dipirona Monoidratada 500mg comprimido -------------- 1 caixa (20 comprimidos)\n   Tomar 1 a 2 comprimidos por via oral a cada 6 horas por até 5 dias em caso de dor.\n\n2. Ciclobenzaprina 5mg comprimido ---------------------- 1 caixa (15 comprimidos)\n   Tomar 1 comprimido por via oral à noite antes de dormir por 3 a 5 dias.\n   (Atenção: pode causar sonolência; não dirigir ou operar maquinário).\n\nOrientações:\n- Evitar repouso absoluto na cama. Manter caminhadas curtas.\n- Calor local morno por 20 minutos na região lombar 2 a 3 vezes ao dia."
  },
  {
    "id_protocolo": "cefaleia_tensional_enxaqueca",
    "titulo": "Abordagem da Cefaleia Tensional e Enxaqueca na Atenção Primária",
    "cids_relacionados": [
      "R51",
      "G43.9",
      "G44.2"
    ],
    "ciaps_relacionados": [
      "N01",
      "N89"
    ],
    "nivel_atencao": "Atencao_Primaria_e_Pronto_Atendimento",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Sinais de Alarme SNOOP\n* S (Systemic): Febre, perda ponderal, câncer, imunossupressão.\n* N (Neurologic): Déficit focal, alteração pupilar, papiledema.\n* O (Onset): Início súbito explosivo ('thunderclap').\n* O (Older): Início após 50 anos de idade.\n* P (Pattern): Mudança súbita no padrão de dor.",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - CEFALEIA / ENXAQUECA AGUDA\nPaciente: [Nome do Paciente]\nData: [Data do Atendimento]\n\nUSO ORAL:\n1. Dipirona Monoidratada 500mg comprimido -------------- 1 caixa (20 comprimidos)\n   Tomar 2 comprimidos (1000 mg) por via oral logo ao início dos sintomas álgicos.\n   Se necessário, repetir após 6 horas (máximo 4000 mg/dia).\n\n2. Cloridrato de Metoclopramida 10mg comprimido -------- 1 blister (10 comprimidos)\n   Tomar 1 comprimido por via oral se houver enjoo ou náusea associada.\n\nOrientações:\n- Repousar em ambiente silencioso e com pouca luminosidade.\n- Limitar o uso de analgésicos a no máximo 2 dias por semana para prevenir cefaleia por rebote de medicação."
  },
  {
    "id_protocolo": "profilaxia_enxaqueca_cronica",
    "titulo": "Tratamento Profilático da Enxaqueca Frequente ou Crônica",
    "cids_relacionados": [
      "G43.3",
      "G43.9"
    ],
    "ciaps_relacionados": [
      "N89"
    ],
    "nivel_atencao": "Atencao_Primaria_e_Neurologia",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Indicação de Terapia Preventiva\n* 3 ou mais episódios incapacitantes de enxaqueca ao mês;\n* Crises que não respondem à medicação abortiva ou com uso abusivo de analgésicos (> 10 a 15 dias/mês).",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - PROFILAXIA DE ENXAQUECA\nPaciente: [Nome do Paciente]\nData: [Data do Atendimento]\n\nUSO ORAL:\n1. Cloridrato de Propranolol 40mg comprimido ----------- 1 caixa (60 comprimidos)\n   Tomar 1/2 comprimido (20 mg) 12/12h por 7 dias; aumentar para 1 comprimido (40 mg) a cada 12 horas continuamente.\n   (Contraindicado em portadores de asma ou bradicardia sintomática).\n\nOrientações:\n- Preencher o 'Diário da Cefaleia' anotando dias com dor e possíveis gatilhos alimentares.\n- O efeito preventivo pleno manifesta-se após 4 a 8 semanas de uso regular diário."
  },
  {
    "id_protocolo": "depressao_ansiedade_atencao_primaria",
    "titulo": "Transtorno Depressivo Maior e Ansiedade na Atenção Primária (ISRS)",
    "cids_relacionados": [
      "F32.1",
      "F41.1"
    ],
    "ciaps_relacionados": [
      "P76",
      "P74"
    ],
    "nivel_atencao": "Atencao_Primaria",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Princípios Farmacológicos\n* Primeira linha: Inibidores Seletivos da Recaptação de Serotonina (ISRS) pela tolerabilidade e segurança cardiovascular.\n* **Período de Latência Terapêutica:** O efeito antidepressivo consistente inicia após 2 a 4 semanas. Nos primeiros 7 a 10 dias pode haver aumento transitório de ansiedade ou náuseas leves.",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - DEPRESSÃO E ANSIEDADE NA APS\nPaciente: [Nome do Paciente]\nData: [Data do Atendimento]\n\nUSO ORAL:\n1. Cloridrato de Sertralina 50mg comprimido ------------ 1 caixa (30 comprimidos)\n   - Tomar 1/2 comprimido (25 mg) por via oral pela manhã após o café nos primeiros 7 dias.\n   - A partir do 8º dia: Tomar 1 comprimido inteiro (50 mg) pela manhã diariamente.\n   (Receituário de Controle Especial C1 - Branco em 2 vias).\n\nOrientações ao Paciente:\n- Não interromper abruptamente a medicação.\n- Manter acompanhamento com a equipe multiprofissional (apoio psicológico e atividade física aeróbica).\n- Retorno agendado em 3 a 4 semanas para avaliação de resposta clínica e tolerabilidade."
  },
  {
    "id_protocolo": "vertigem_posicional_paroxistica_labirintopatia",
    "titulo": "Abordagem da Vertigem Posicional Paroxística Benigna (VPPB) e Labirintite",
    "cids_relacionados": [
      "H81.1",
      "H81.0"
    ],
    "ciaps_relacionados": [
      "H82"
    ],
    "nivel_atencao": "Atencao_Primaria_e_Pronto_Atendimento",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Diferenciação Crucial\n* **VPPB:** Crises de vertigem giratória de curta duração (< 1 minuto) desencadeadas por movimentos da cabeça.\n  - *Tratamento definitivo:* Manobras de reposicionamento canalicular (Manobra de Epley) com taxa de sucesso > 80% sem necessidade de medicação contínua.\n* **Labirintite / Neuronite Vestibular:** Vertigem contínua incapacitante de dias com náuseas/vômitos intensos. Supressores vestibulares apenas nas primeiras 48 a 72 horas para não bloquear a compensação central.",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - CRISES AGUDAS DE VERTIGEM\nPaciente: [Nome do Paciente]\nData: [Data do Atendimento]\n\nUSO ORAL:\n1. Dimenidrinato 50mg + Cloridrato de Piridoxina 10mg -- 1 caixa (20 comprimidos)\n   Tomar 1 comprimido por via oral a cada 8 horas apenas durante as crises agudas de tontura giratória (limitar a 3 a 5 dias).\n\nOrientações:\n- Realizar a Manobra de Epley orientada pelo profissional de saúde.\n- Evitar movimentos bruscos de rotação da cabeça e levantar-se devagar da cama."
  },
  {
    "id_protocolo": "anafilaxia_reacao_alergica_grave",
    "titulo": "Protocolo de Emergência: Anafilaxia e Reações Alérgicas Graves",
    "cids_relacionados": [
      "T78.2",
      "T78.0"
    ],
    "ciaps_relacionados": [
      "A92"
    ],
    "nivel_atencao": "Urgencia_Emergencia",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Conduta Vital Imediata\n* **ADRENALINA INTRAMUSCULAR É O MEDICAMENTO DE ESCOLHA IMEDIATO.**\n* Dose Adulto: 0.5 mg (0.5 mL de solução 1:1000) IM no terço médio anterolateral da coxa (vasto lateral).\n* Dose Pediátrica: 0.01 mg/kg (máximo 0.3 mg) IM no vasto lateral da coxa.\n* Pode ser repetida a cada 5 a 15 minutos se resposta insuficiente. Corticoides e anti-histamínicos são fármacos de segunda linha e NUNCA devem atrasar a administração da adrenalina.",
    "bloco_prescricao_copiavel": "PRESCRIÇÃO HOSPITALAR DE EMERGÊNCIA - ANAFILAXIA\nPaciente: [Nome do Paciente]\nData: [Data do Atendimento]\n\nUSO INTRAMUSCULAR IMEDIATO:\n1. Epinefrina (Adrenalina) 1 mg/mL (1:1000) ------------- 1 ampola\n   Aplicar 0.5 mL (0.5 mg) por via intramuscular profunda no vasto lateral da coxa IMEDIATAMENTE.\n\nUSO INTRAVENOSO:\n2. Soro Fisiológico 0.9% bolsa 1000 mL ------------------ 2 bolsas\n   Infundir 1000 a 2000 mL em fluxo rápido para expansão volêmica.\n\n3. Succinato Sódico de Hidrocortisona 500mg frasco-ampola - 1 frasco\n   Diluir em 20 mL de AD e infundir por via IV lenta (dose de manutenção anti-inflamatória pós-crise)."
  },
  {
    "id_protocolo": "desidratacao_pediatrica_plano_b_c",
    "titulo": "Manejo da Desidratação Pediátrica (Planos A, B e C da OMS)",
    "cids_relacionados": [
      "E86",
      "A09"
    ],
    "ciaps_relacionados": [
      "T11",
      "D73"
    ],
    "nivel_atencao": "Atencao_Primaria_e_Urgencia",
    "data_revisao": "2026-10-26",
    "status_revisao_clinica": "pendente_revisao_por_profissional_habilitado",
    "conteudo_markdown": "## 1. Avaliação do Grau de Desidratação\n* **Sem Desidratação (Plano A):** Domiciliar. Oferecer líquidos adicionais e SRO após cada evacuação líquida.\n* **Desidratação Leve a Moderada (Plano B):** Unidade de saúde. TRO (Terapia de Reidratação Oral) com SRO: 50 a 100 mL/kg em 4 a 6 horas em colheres/copinhos.\n* **Desidratação Grave com Choque (Plano C):** Hidratação venosa rápida com Solução Fisiológica 0.9% ou Ringer Lactato (100 mL/kg fracionado).",
    "bloco_prescricao_copiavel": "RECEITUÁRIO MÉDICO - DESIDRATAÇÃO PEDIÁTRICA (PLANO A + ZINCO)\nPaciente: [Nome da Criança] | Idade: [Ex: 1 ano]\nData: [Data do Atendimento]\n\nUSO ORAL:\n1. Sais de Reidratação Oral (SRO) sachê 27.9g ------------ 6 envelopes\n   Diluir 1 envelope em 1 litro de água filtrada. Oferecer 50 a 100 mL aos poucos com colher após cada evacuação diarreica.\n\n2. Sulfato de Zinco 10mg/mL solução oral (ou 20mg comp.) - 1 frasco\n   Dar 20 mg por via oral uma vez ao dia durante 14 dias consecutivos (10 mg/dia se menor de 6 meses).\n   (Medida fundamental recomendada pela OMS para acelerar a regeneração dos enterócitos intestinais)."
  }
];

export const FARMACOS_POR_PROTOCOLO: Record<string, string[]> = {
  "faringite_amigdalite_aguda": [
    "Amoxicilina 500mg",
    "Dipirona 500mg",
    "Penicilina G Benzatina"
  ],
  "manejo_dengue_ms": [
    "Sais de Reidratação Oral (SRO)",
    "Dipirona 500mg",
    "Paracetamol 500mg"
  ],
  "chikungunya_fase_aguda_cronica": [
    "Dipirona Monoidratada",
    "Paracetamol 750mg",
    "Cloridrato de Tramadol"
  ],
  "zika_gestante_manifestacoes": [
    "Paracetamol 500mg",
    "Loratadina 10mg",
    "Repelente com Icaridina"
  ],
  "pneumonia_adquirida_comunidade": [
    "Amoxicilina 500mg",
    "Dipirona 500mg"
  ],
  "sinusite_bacteriana_aguda": [
    "Amoxicilina 500mg",
    "Budesonida Spray Nasal",
    "Soro Fisiológico 0.9%"
  ],
  "otite_media_aguda_pediatrica": [
    "Amoxicilina 250mg/5mL",
    "Dipirona Gotas 500mg/mL",
    "Ibuprofeno Gotas"
  ],
  "itu_nao_complicada": [
    "Fosfomicina trometamol 3g",
    "Nitrofurantoína 100mg",
    "Dipirona Gotas"
  ],
  "pielonefrite_aguda_nao_complicada": [
    "Ciprofloxacino 500mg",
    "Ceftriaxona 1g IV",
    "Dipirona 500mg"
  ],
  "erisipela_celulite_infecciosa": [
    "Cefalexina 500mg",
    "Dipirona 500mg",
    "Permanganato de Potássio"
  ],
  "impetigo_crostoso_bolhoso": [
    "Mupirocina 2% Pomada",
    "Cefalexina 250mg/5mL",
    "Sabonete Antisséptico"
  ],
  "herpes_zoster_nevralgia": [
    "Aciclovir 800mg",
    "Dipirona 500mg",
    "Gabapentina 300mg"
  ],
  "parasitoses_intestinais_giardiase": [
    "Albendazol 400mg",
    "Secnidazol 1000mg",
    "Metronidazol 400mg"
  ],
  "sifilis_adquirida_primaria_secundaria": [
    "Penicilina G Benzatina 1.200.000 UI",
    "Doxiciclina 100mg"
  ],
  "uretrite_gonococica_clamidia": [
    "Ceftriaxona 500mg IM",
    "Azitromicina 500mg VO"
  ],
  "candidiaze_vulvovaginal": [
    "Fluconazol 150mg",
    "Nitrato de Miconazol Creme 2%"
  ],
  "vaginose_bacteriana_tricomoniase": [
    "Metronidazol 400mg",
    "Metronidazol Gel Vaginal"
  ],
  "influenza_sindrome_gripal_oseltamivir": [
    "Fosfato de Oseltamivir 75mg",
    "Dipirona 500mg",
    "Soro Fisiológico"
  ],
  "crise_hipertensiva": [
    "Maleato de Enalapril 10mg",
    "Hidroclorotiazida 25mg",
    "Anlodipino 5mg"
  ],
  "hipertensao_arterial_estagio1_2": [
    "Losartana Potássica 50mg",
    "Besilato de Anlodipino 5mg",
    "Hidroclorotiazida 25mg"
  ],
  "insuficiencia_cardiaca_fracao_reduzida": [
    "Succinato de Metoprolol",
    "Maleato de Enalapril 5mg",
    "Espironolactona 25mg",
    "Dapagliflozina 10mg"
  ],
  "fibrilacao_atrial_anticoagulacao_cha2ds2vasc": [
    "Rivaroxabana 20mg",
    "Apixabana 5mg",
    "Atenolol 50mg"
  ],
  "angina_estavel_doenca_coronariana": [
    "AAS 100mg",
    "Atorvastatina 40mg",
    "Atenolol 50mg",
    "Dinitrato de Isossorbida"
  ],
  "dislipidemia_prevencao_cardiovascular": [
    "Sinvastatina 20mg a 40mg",
    "Atorvastatina 20mg",
    "Ezetimiba 10mg"
  ],
  "doenca_renal_cronica_nefroprotecao": [
    "Losartana Potássica",
    "Dapagliflozina 10mg",
    "Bicarbonato de Sódio"
  ],
  "asma_exacerbacao_aguda": [
    "Sulfato de Salbutamol 100mcg Spray",
    "Prednisona 20mg"
  ],
  "asma_tratamento_manutencao_gina": [
    "Budesonida + Formoterol",
    "Dipropionato de Beclometasona"
  ],
  "dpoc_estavel_manutencao_gold": [
    "Brometo de Tiotrópio 2.5mcg (LAMA)",
    "Salmeterol 50mcg (LABA)",
    "Sulfato de Salbutamol 100mcg"
  ],
  "rinite_alergica_persistente": [
    "Budesonida Spray Nasal",
    "Loratadina 10mg",
    "Soro Fisiológico 0.9%"
  ],
  "gastrite_drge": [
    "Omeprazol 20mg cápsula",
    "Domperidona 10mg"
  ],
  "erradicacao_helicobacter_pylori": [
    "Omeprazol 20mg",
    "Claritromicina 500mg",
    "Amoxicilina 500mg"
  ],
  "constipacao_intestinal_cronica": [
    "Polietilenoglicol (PEG 4000)",
    "Lactulose 667mg/mL",
    "Psyllium"
  ],
  "diarreia_aguda_gastroenterite": [
    "Sais de Reidratação Oral (SRO)",
    "Sulfato de Zinco",
    "Racecadotrila 100mg"
  ],
  "diabetes_mellitus_tipo2": [
    "Cloridrato de Metformina 850mg",
    "Gliclazida MR 30mg"
  ],
  "diabetes_tipo2_associacao_metformina_isglt2": [
    "Metformina XR 500mg",
    "Dapagliflozina 10mg",
    "Empagliflozina 25mg"
  ],
  "hipotireoidismo_primario_levotiroxina": [
    "Levotiroxina Sódica 25mcg / 50mcg / 75mcg / 100mcg"
  ],
  "gota_artrite_urica_aguda_e_profilaxia": [
    "Colchicina 0.5mg",
    "Alopurinol 100mg / 300mg",
    "Dipirona 500mg"
  ],
  "osteoporose_pos_menopausa_alendronato": [
    "Alendronato de Sódio 70mg",
    "Carbonato de Cálcio + Vitamina D"
  ],
  "lombalgia_aguda": [
    "Dipirona Monoidratada 500mg",
    "Ciclobenzaprina 5mg"
  ],
  "cefaleia_tensional_enxaqueca": [
    "Dipirona Monoidratada 500mg",
    "Metoclopramida 10mg"
  ],
  "profilaxia_enxaqueca_cronica": [
    "Cloridrato de Propranolol 40mg",
    "Topiramato 25mg",
    "Amitriptilina 25mg"
  ],
  "depressao_ansiedade_atencao_primaria": [
    "Cloridrato de Sertralina 50mg",
    "Oxalato de Escitalopram 10mg"
  ],
  "vertigem_posicional_paroxistica_labirintopatia": [
    "Dimenidrinato + Piridoxina",
    "Dicloridrato de Flunarizina 10mg"
  ],
  "anafilaxia_reacao_alergica_grave": [
    "Epinefrina (Adrenalina 1:1000)",
    "Hidrocortisona",
    "Difenidramina"
  ],
  "desidratacao_pediatrica_plano_b_c": [
    "Sais de Reidratação Oral (SRO)",
    "Sulfato de Zinco 20mg",
    "Soro Fisiológico / Ringer Lactato"
  ]
};

export const CATEGORIAS_POR_PROTOCOLO: Record<string, string> = {
  "faringite_amigdalite_aguda": "infectologia",
  "manejo_dengue_ms": "infectologia",
  "chikungunya_fase_aguda_cronica": "infectologia",
  "zika_gestante_manifestacoes": "infectologia",
  "pneumonia_adquirida_comunidade": "infectologia",
  "sinusite_bacteriana_aguda": "infectologia",
  "otite_media_aguda_pediatrica": "pediatria",
  "itu_nao_complicada": "infectologia",
  "pielonefrite_aguda_nao_complicada": "infectologia",
  "erisipela_celulite_infecciosa": "infectologia",
  "impetigo_crostoso_bolhoso": "pediatria",
  "herpes_zoster_nevralgia": "infectologia",
  "parasitoses_intestinais_giardiase": "infectologia",
  "sifilis_adquirida_primaria_secundaria": "infectologia",
  "uretrite_gonococica_clamidia": "infectologia",
  "candidiaze_vulvovaginal": "ginecologia",
  "vaginose_bacteriana_tricomoniase": "ginecologia",
  "influenza_sindrome_gripal_oseltamivir": "infectologia",
  "crise_hipertensiva": "cardiovascular",
  "hipertensao_arterial_estagio1_2": "cardiovascular",
  "insuficiencia_cardiaca_fracao_reduzida": "cardiovascular",
  "fibrilacao_atrial_anticoagulacao_cha2ds2vasc": "cardiovascular",
  "angina_estavel_doenca_coronariana": "cardiovascular",
  "dislipidemia_prevencao_cardiovascular": "cardiovascular",
  "doenca_renal_cronica_nefroprotecao": "nefrologia",
  "asma_exacerbacao_aguda": "respiratorio",
  "asma_tratamento_manutencao_gina": "respiratorio",
  "dpoc_estavel_manutencao_gold": "respiratorio",
  "rinite_alergica_persistente": "respiratorio",
  "gastrite_drge": "gastroenterologia",
  "erradicacao_helicobacter_pylori": "gastroenterologia",
  "constipacao_intestinal_cronica": "gastroenterologia",
  "diarreia_aguda_gastroenterite": "gastroenterologia",
  "diabetes_mellitus_tipo2": "endocrinologia",
  "diabetes_tipo2_associacao_metformina_isglt2": "endocrinologia",
  "hipotireoidismo_primario_levotiroxina": "endocrinologia",
  "gota_artrite_urica_aguda_e_profilaxia": "reumatologia",
  "osteoporose_pos_menopausa_alendronato": "reumatologia",
  "lombalgia_aguda": "reumatologia",
  "cefaleia_tensional_enxaqueca": "neurologia",
  "profilaxia_enxaqueca_cronica": "neurologia",
  "depressao_ansiedade_atencao_primaria": "saude_mental",
  "vertigem_posicional_paroxistica_labirintopatia": "neurologia",
  "anafilaxia_reacao_alergica_grave": "urgencia",
  "desidratacao_pediatrica_plano_b_c": "pediatria"
};
