import { ProtocoloClinico } from '../types';

export const PROTOCOLOS_CLINICA_GERAL: ProtocoloClinico[] = [
  // ---------------------------------------------------------------------------
  // CARDIOLOGIA & NEFROLOGIA
  // ---------------------------------------------------------------------------
  {
    id_protocolo: 'crise_hipertensiva',
    titulo: 'Abordagem da Crise Hipertensiva: Urgência vs Emergência Hipertensiva',
    cids_relacionados: ['I10', 'I15'],
    ciaps_relacionados: ['K86', 'K87'],
    nivel_atencao: 'Atencao_Primaria_e_Pronto_Atendimento',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Classificação Diferencial Obrigatória
* **Urgência Hipertensiva:** PA >= 180x120 mmHg SEM evidência de lesão aguda em órgãos-alvo (sem encefalopatia, sem edema agudo de pulmão, sem dissecção aórtica).
  - *Conduta:* Redução gradual da PA por via oral em 24 a 48 horas. Evitar quedas abruptas com nifedipino sublingual (risco de isquemia cerebral).
* **Emergência Hipertensiva:** PA elevada COM lesão aguda em evolução em órgãos-alvo.
  - *Conduta:* Internação imediata em UTI e vasodilatador intravenoso contínuo sob monitorização invasiva (Nitroprussiato de Sódio ou Nitroglicerina).`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - URGÊNCIA HIPERTENSIVA (CONTROLE AMBULATORIAL)
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Maleato de Enalapril 10mg comprimido ----------------- 1 caixa (30 comprimidos)
   Tomar 1 comprimido por via oral uma vez ao dia pela manhã.

2. Hidroclorotiazida 25mg comprimido ------------------- 1 caixa (30 comprimidos)
   Tomar 1 comprimido por via oral uma vez ao dia pela manhã junto ao enalapril.

Orientações:
- Redução estrita do sal no preparo dos alimentos; suspender caldos industrializados e embutidos.
- Diário residencial de aferição da pressão arterial (anotar pela manhã e ao fim da tarde).
- Retorno ao pronto-socorro se dor no peito, falta de ar súbita, perda de visão ou confusão mental.`,
  },
  {
    id_protocolo: 'hipertensao_arterial_estagio1_2',
    titulo: 'Hipertensão Arterial Sistêmica Estágios 1 e 2 (Terapia Combinada Inicial)',
    cids_relacionados: ['I10'],
    ciaps_relacionados: ['K86'],
    nivel_atencao: 'Atencao_Primaria',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Estratégia de Combinação Dupla Precoce
* Para hipertensos estágio 2 (PA >= 140/90 mmHg com alto risco cardiovascular ou PA >= 160/100 mmHg), iniciar preferencialmente associação de duas classes em doses baixas.
* Classes preferenciais: BRA (Losartana) ou IECA (Enalapril) + Bloqueador dos Canais de Cálcio (Anlodipino) ou Tiazídico.`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - HIPERTENSÃO ARTERIAL (COMBINAÇÃO SINÉRGICA)
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Losartana Potássica 50mg comprimido revestido ------- 1 caixa (30 comprimidos)
   Tomar 1 comprimido por via oral uma vez ao dia pela manhã.

2. Besilato de Anlodipino 5mg comprimido --------------- 1 caixa (30 comprimidos)
   Tomar 1 comprimido por via oral uma vez ao dia pela manhã.

Orientações:
- Prática de exercícios aeróbicos regulares (150 minutos por semana).
- Acompanhar surgimento de eventual edema maleolar vespertino leve decorrente do vasodilatador.`,
  },
  {
    id_protocolo: 'insuficiencia_cardiaca_fracao_reduzida',
    titulo: 'Insuficiência Cardíaca com Fração de Ejeção Reduzida (IC-FEr: O Quarteto Fantástico)',
    cids_relacionados: ['I50.0', 'I50.9'],
    ciaps_relacionados: ['K77'],
    nivel_atencao: 'Atencao_Primaria_e_Cardiologia',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## As Quatro Classes Obrigatórias (Redução de Mortalidade Global)
1. **Inibidor do SRAA:** IECA (Enalapril), BRA ou preferencialmente ARNI (Sacubitril/Valsartana);
2. **Betabloqueador cardioprotetor:** Succinato de Metoprolol, Carvedilol ou Bisoprolol;
3. **Antagonista do Receptor Mineralocorticoide:** Espironolactona 25 mg/dia;
4. **Inibidor de SGLT2:** Dapagliflozina 10 mg ou Empagliflozina 10 mg uma vez ao dia.`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - INSUFICIÊNCIA CARDÍACA (IC-FEr)
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Succinato de Metoprolol 25mg comprimido lib. prolongada - 1 caixa (30 comprimidos)
   Tomar 1 comprimido por via oral pela manhã (titular dose a cada 2 a 4 semanas até 100-200 mg/dia).

2. Maleato de Enalapril 10mg comprimido ----------------- 1 caixa (60 comprimidos)
   Tomar 1 comprimido por via oral de 12 em 12 horas.

3. Espironolactona 25mg comprimido --------------------- 1 caixa (30 comprimidos)
   Tomar 1 comprimido por via oral pela manhã (monitorar potássio e creatinina séricos).

4. Dapagliflozina 10mg comprimido ----------------------- 1 caixa (30 comprimidos)
   Tomar 1 comprimido por via oral uma vez ao dia pela manhã.

5. Furosemida 40mg comprimido (Sintomático de Congestão) - 1 caixa (30 comprimidos)
   Tomar 1 comprimido pela manhã em jejum se ganho de peso súbito (> 2 kg em 3 dias) ou edema nas pernas.`,
  },
  {
    id_protocolo: 'fibrilacao_atrial_anticoagulacao_cha2ds2vasc',
    titulo: 'Fibrilação Atrial: Prevenção de AVC e Estratificação CHA2DS2-VASc',
    cids_relacionados: ['I48.0', 'I48.9'],
    ciaps_relacionados: ['K78'],
    nivel_atencao: 'Atencao_Primaria_e_Cardiologia',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Estratificação de Risco Embólico pelo Escore CHA2DS2-VASc
* Insuficiência Cardíaca (+1), Hipertensão (+1), Idade >= 75 anos (+2), Diabetes (+1), AVC/AIT prévio (+2), Doença Vascular (+1), Idade 65-74 (+1), Sexo Feminino (+1).
* **Indicação de Anticoagulação:** Homens com escore >= 2 e Mulheres com escore >= 3 têm indicação formal de DOAC (Anticoagulante Oral Direto) ou Varfarina.`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - FIBRILAÇÃO ATRIAL (ANTICOAGULAÇÃO ORAL)
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Rivaroxabana 20mg comprimido revestido -------------- 1 caixa (28 comprimidos)
   Tomar 1 comprimido por via oral uma vez ao dia, obrigatoriamente junto à maior refeição (almoço ou jantar).
   (Ajustar para 15 mg/dia se ClCr entre 15 e 49 mL/min).

2. Atenolol 50mg comprimido (Controle de Frequência Cardíaca) - 1 caixa (30 comprimidos)
   Tomar 1 comprimido por via oral uma vez ao dia pela manhã para manter FC alvo de repouso < 100 bpm.

Orientações:
- Atenção a sinais de sangramento (fezes escuras, sangue na urina ou hematomas espontâneos múltiplos).`,
  },
  {
    id_protocolo: 'angina_estavel_doenca_coronariana',
    titulo: 'Doença Arterial Coronariana Crônica: Angina Estável',
    cids_relacionados: ['I20.9', 'I25.1'],
    ciaps_relacionados: ['K74'],
    nivel_atencao: 'Atencao_Primaria_e_Cardiologia',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Metas do Tratamento
* Prevenção secundária de infarto agudo do miocárdio e óbito cardiovascular (AAS + Estatina de alta intensidade);
* Alívio dos sintomas isquêmicos e melhora da capacidade funcional (Betabloqueador + Nitrato).`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - DOENÇA ARTERIAL CORONARIANA CRÔNICA
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Ácido Acetilsalicílico (AAS) 100mg comprimido -------- 1 caixa (30 comprimidos)
   Tomar 1 comprimido por via oral uma vez ao dia logo após o almoço.

2. Sinvastatina 40mg comprimido revestido -------------- 1 caixa (30 comprimidos)
   Tomar 1 comprimido por via oral uma vez ao dia à noite ao deitar.

3. Atenolol 50mg comprimido ---------------------------- 1 caixa (30 comprimidos)
   Tomar 1 comprimido por via oral pela manhã.

4. Dinitrato de Isossorbida 5mg comprimido sublingual -- 1 caixa (20 comprimidos)
   Colocar 1 comprimido sob a língua apenas em caso de dor no peito aos esforços; se dor persistir por mais de 5 a 10 minutos, procurar emergência com urgência.`,
  },
  {
    id_protocolo: 'dislipidemia_prevencao_cardiovascular',
    titulo: 'Prevenção Cardiovascular Primária e Manejo das Dislipidemias (SBC / AHA)',
    cids_relacionados: ['E78.0', 'E78.2'],
    ciaps_relacionados: ['T93'],
    nivel_atencao: 'Atencao_Primaria',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Metas de LDL-c segundo Risco Cardiovascular Global (SBC)
* Baixo Risco: LDL-c < 130 mg/dL
* Risco Intermediário: LDL-c < 100 mg/dL
* Alto Risco (DM, placa carotídea subclínica, aneurisma): LDL-c < 70 mg/dL
* Muito Alto Risco (Infarto prévio, AVC prévio, revascularização): LDL-c < 50 mg/dL`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - DISLIPIDEMIA (PREVENÇÃO CARDIOVASCULAR)
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Sinvastatina 20mg (ou 40mg) comprimido revestido ---- 2 caixas (60 comprimidos)
   Tomar 1 comprimido por via oral uma vez ao dia à noite ao deitar.
   (A síntese hepática do colesterol ocorre preferencialmente durante o repouso noturno).

Orientações:
- Dieta com restrição de gorduras trans e saturadas; estímulo ao azeite de oliva e fibras solúveis (aveia).
- Comunicar o médico se apresentar dor muscular generalizada persistente ou urina escura.`,
  },
  {
    id_protocolo: 'doenca_renal_cronica_nefroprotecao',
    titulo: 'Doença Renal Crônica (DRC): Estratégias de Nefroproteção e Retardo da Progressão',
    cids_relacionados: ['N18.9', 'N18.3', 'N18.4'],
    ciaps_relacionados: ['U99'],
    nivel_atencao: 'Atencao_Primaria_e_Nefrologia',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Pilares Terapêuticos (KDIGO 2024)
* Controle rigoroso da Pressão Arterial (alvo < 120/80 mmHg com técnica padronizada);
* Bloqueio do SRAA com BRA ou IECA para redução da pressão intraglomerular e proteinúria;
* Inibidores de SGLT2 (Dapagliflozina/Empagliflozina) para retardar declínio de TFG;
* Evitar AINEs, contrastes iodados desnecessários e automedicação nefrotóxica.`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - NEFROPROTEÇÃO NA DRC (ESTÁGIOS G2 A G4)
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Losartana Potássica 50mg comprimido revestido ------- 1 caixa (30 comprimidos)
   Tomar 1 comprimido por via oral uma vez ao dia pela manhã.

2. Dapagliflozina 10mg comprimido ----------------------- 1 caixa (30 comprimidos)
   Tomar 1 comprimido por via oral uma vez ao dia pela manhã (indicado para TFG >= 20 mL/min).

Orientações:
- Restrição proteica moderada (0.8 g/kg/dia) orientada por nutricionista.
- NUNCA tomar anti-inflamatórios como diclofenaco, cetoprofeno, nimesulida ou ibuprofeno.`,
  },

  // ---------------------------------------------------------------------------
  // PNEUMOLOGIA (GINA, GOLD, SBPT)
  // ---------------------------------------------------------------------------
  {
    id_protocolo: 'asma_exacerbacao_aguda',
    titulo: 'Manejo da Exacerbação Aguda de Asma na Atenção Básica e Urgência',
    cids_relacionados: ['J45', 'J45.9', 'J46'],
    ciaps_relacionados: ['R96'],
    nivel_atencao: 'Atencao_Primaria_e_Urgencia',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Manejo Imediato na Crise Leve a Moderada
* Salbutamol Spray 100 mcg acoplado a espaçador valvulado: 4 a 10 jatos a cada 20 minutos na primeira hora.
* Corticoterapia sistêmica oral precoce (Prednisona 40 a 50 mg em dose única) acelera a resolução da inflamação e previne reinternações.`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - ALTA DA EXACERBAÇÃO DE ASMA
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO INALATÓRIO:
1. Sulfato de Salbutamol spray 100mcg/dose ------------- 1 frasco (200 doses)
   Inalar 2 a 4 jatos com espaçador a cada 4 ou 6 horas em caso de chiado no peito ou falta de ar.

USO ORAL:
2. Prednisona 20mg comprimido -------------------------- 1 caixa (20 comprimidos)
   Tomar 2 comprimidos (40 mg) por via oral pela manhã, em dose única diária, durante 5 dias consecutivos.
   (Não necessita de desmame se usado por apenas 5 dias).

Orientações:
- Utilizar obrigatoriamente o espaçador valvulado para garantir a deposição pulmonar do broncodilatador.`,
  },
  {
    id_protocolo: 'asma_tratamento_manutencao_gina',
    titulo: 'Tratamento de Manutenção da Asma Crônica (Diretrizes GINA)',
    cids_relacionados: ['J45.0', 'J45.8'],
    ciaps_relacionados: ['R96'],
    nivel_atencao: 'Atencao_Primaria_e_Pneumologia',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Mudança de Paradigma GINA
* O uso de broncodilatador de curta ação (SABA isolado) não é mais recomendado como monoterapia devido ao risco aumentado de exacerbações graves e mortalidade.
* O pilar central é o Corticoide Inalatório (CI) associado a Formoterol (LABA de início rápido) como terapia de alívio e manutenção (SMART / MART).`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - ASMA CRÔNICA (MANUTENÇÃO GINA ETAPA 3)
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO INALATÓRIO:
1. Fumarato de Formoterol 6mcg + Budesonida 200mcg cápsulas inalatórias - 1 caixa (60 cápsulas)
   Inalar 1 cápsula por via oral com o inalador a cada 12 horas diariamente de manutenção.
   Em caso de sintomas agudos, inalar 1 cápsula adicional de alívio imediato (máximo de 8 a 12 cápsulas/dia).

Orientações:
- Enxaguar a boca com água e cuspir após cada inalação para prevenir candidíase oral (sapinho) e rouquidão.`,
  },
  {
    id_protocolo: 'dpoc_estavel_manutencao_gold',
    titulo: 'Doença Pulmonar Obstrutiva Crônica (DPOC): Tratamento Estável (GOLD)',
    cids_relacionados: ['J44.0', 'J44.9'],
    ciaps_relacionados: ['R95'],
    nivel_atencao: 'Atencao_Primaria_e_Pneumologia',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Classificação ABE e Metas (GOLD 2024)
* Grupo A (Poucos sintomas, 0-1 exacerbação sem internação): Broncodilatador de longa ação (LAMA ou LABA).
* Grupo B (Muitos sintomas mMRC >= 2 ou CAT >= 10): Dupla broncodilatação LAMA + LABA.
* Grupo E (>= 2 exacerbações ou >= 1 internação no último ano): LAMA + LABA (+ Corticoide Inalatório se eosinófilos sanguíneos >= 300 células/mcL).`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - DPOC ESTÁVEL (GRUPO B / DUPLA BRONCODILATAÇÃO)
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO INALATÓRIO:
1. Brometo de Tiotrópio 2.5mcg inalador Respimat -------- 1 frasco (60 doses)
   Inalar 2 jatos por via inalatória uma vez ao dia, no mesmo horário.

2. Sulfato de Salbutamol 100mcg spray ------------------- 1 frasco
   Inalar 2 jatos com espaçador se falta de ar aguda de resgate.

Orientações Vitais:
- Cessação do tabagismo imediata (medida com maior impacto na sobrevida).
- Vacinação anual contra Influenza, Pneumococo (VPC13 e VPP23) e COVID-19.`,
  },
  {
    id_protocolo: 'rinite_alergica_persistente',
    titulo: 'Manejo da Rinite Alérgica Moderada a Grave (Diretrizes ARIA)',
    cids_relacionados: ['J30.1', 'J30.4'],
    ciaps_relacionados: ['R97'],
    nivel_atencao: 'Atencao_Primaria',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Princípios de Tratamento (ARIA)
* Corticosteroides nasais constituem a primeira linha com maior eficácia para controle de obstrução nasal, espirros e prurido.
* Anti-histamínicos orais de 2ª geração (não sedantes) são adjuvantes de alívio rápido.`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - RINITE ALÉRGICA MODERADA A GRAVE
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO NASAL:
1. Soro Fisiológico 0.9% frasco 500 mL ------------------ 1 frasco
   Realizar lavagem nasal com 10 a 20 mL em cada narina 2 vezes ao dia.

2. Budesonida spray nasal 50mcg/dose -------------------- 1 frasco (120 doses)
   Aplicar 1 a 2 jatos em cada narina uma vez ao dia pela manhã por pelo menos 30 a 60 dias consecutivos.

USO ORAL:
3. Loratadina 10mg comprimido -------------------------- 1 caixa (12 comprimidos)
   Tomar 1 comprimido por via oral uma vez ao dia se crises de prurido ocular ou espirros frequentes.`,
  },

  // ---------------------------------------------------------------------------
  // GASTROENTEROLOGIA
  // ---------------------------------------------------------------------------
  {
    id_protocolo: 'gastrite_drge',
    titulo: 'Manejo da Doença do Refluxo Gastroesofágico (DRGE) e Dispepsia',
    cids_relacionados: ['K21.9', 'K29.7'],
    ciaps_relacionados: ['D84', 'D87'],
    nivel_atencao: 'Atencao_Primaria',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Sinais de Alarme para Endoscopia Digestiva Alta (EDA)
* Idade >= 50 anos com sintomas dispépticos novos;
* Perda ponderal inexplicada;
* Disfagia progressiva ou odinofagia;
* Anemia ferropriva ou evidência de sangramento digestivo (hematêmese/melena);
* Histórico familiar de neoplasia do trato gastrointestinal alto.`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - DRGE E DISPEPSIA
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Omeprazol 20mg cápsula ------------------------------ 2 caixas (56 cápsulas)
   Tomar 1 cápsula por via oral uma vez ao dia pela manhã em jejum rigoroso, exatamente 30 minutos antes do café da manhã, durante 8 semanas consecutivas.

Orientações Não Farmacológicas:
- Fracionar as refeições e não deitar nas 2 horas seguintes à alimentação.
- Elevação da cabeceira da cama em 15 cm.
- Evitar café, chocolates, frituras, refrigerantes e condimentos em excesso.`,
  },
  {
    id_protocolo: 'erradicacao_helicobacter_pylori',
    titulo: 'Erradicação do Helicobacter pylori: Terapia Quádrupla / Tripla Otimizada',
    cids_relacionados: ['B96.81', 'K25.9'],
    ciaps_relacionados: ['D85'],
    nivel_atencao: 'Atencao_Primaria_e_Gastroenterologia',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Duração Otimizada de 14 Dias (Maastricht VI)
* Aumentar o tempo de tratamento de 7 para 14 dias eleva a taxa de erradicação para > 85%.
* Dobrar a dose do IBP para garantir supressão ácida adequada, permitindo maior estabilidade dos antibióticos no estômago.`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - ERRADICAÇÃO DE HELICOBACTER PYLORI (14 DIAS)
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Omeprazol 20mg cápsula ------------------------------ 2 caixas (56 cápsulas)
   Tomar 1 cápsula de 12 em 12 horas (pela manhã em jejum e à noite antes do jantar) por 14 dias.

2. Amoxicilina 500mg cápsula --------------------------- 4 caixas (112 cápsulas)
   Tomar 2 cápsulas (1000 mg) por via oral a cada 12 horas durante 14 dias.

3. Claritromicina 500mg comprimido revestido ----------- 2 caixas (28 comprimidos)
   Tomar 1 comprimido por via oral a cada 12 horas durante 14 dias.

Orientações:
- Não interromper o tratamento; o cumprimento integral dos 14 dias é vital para evitar falha terapêutica e resistência bacteriana.
- Teste respiratório com ureia marcada ou antígeno fecal após pelo menos 4 semanas do término para comprovação de cura.`,
  },
  {
    id_protocolo: 'constipacao_intestinal_cronica',
    titulo: 'Constipação Intestinal Funcional Crônica no Adulto e Idoso',
    cids_relacionados: ['K59.0'],
    ciaps_relacionados: ['D12'],
    nivel_atencao: 'Atencao_Primaria',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Escalonamento Terapêutico (WGO)
* Linha 1: Fibras solúveis (Psyllium) e hidratação (1.5 a 2 L/dia);
* Linha 2: Laxativos osmóticos de escolha segura para uso continuado (Polietilenoglicol - PEG 4000 ou Lactulose);
* Evitar uso crônico de laxativos estimulantes antraquinônicos (sene, cáscara sagrada) pelo risco de catarse colônica e melanose de cólon.`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - CONSTIPAÇÃO INTESTINAL FUNCIONAL
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Polietilenoglicol 4000 pó (sem eletrólitos) sachê 10g - 2 caixas (30 sachês)
   Dissolver 1 a 2 sachês em um copo de água ou suco e tomar uma vez ao dia pela manhã.

2. Lactulose 667mg/mL xarope --------------------------- 1 frasco (120 mL)
   Tomar 15 a 30 mL por via oral uma vez ao dia se fezes endurecidas.

Orientações:
- Consumir frutas laxativas com casca (mamão, ameixa preta, kiwi) e vegetais folhosos.
- Atender prontamente ao reflexo gastrocólico após as refeições.`,
  },
  {
    id_protocolo: 'diarreia_aguda_gastroenterite',
    titulo: 'Gastroenterite Aguda e Diarreia no Adulto e Criança',
    cids_relacionados: ['A09', 'K52.9'],
    ciaps_relacionados: ['D11', 'D73'],
    nivel_atencao: 'Atencao_Primaria_e_Urgencia',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Regra de Ouro da OMS
* Hidratação precoce com solução salina-glicídica isotônica previne a desidratação e o óbito em mais de 98% dos casos.
* Em crianças, o Zinco oral por 10 a 14 dias reduz a gravidade, duração e episódios diarreicos nos 3 meses subsequentes.
* Antibióticos são contraindicados de rotina; indicados apenas em disenteria grave (sangue e muco visíveis nas fezes) ou suspeita de cólera.`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - GASTROENTERITE AGUDA
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Sais de Reidratação Oral (SRO) sachê 27.9g ------------ 10 envelopes
   Diluir 1 envelope em exatamente 1 litro de água filtrada.
   Ingerir 1 copo (200 mL) a cada evacuação líquida ou vômito.

2. Racecadotrila 100mg cápsula (Antissecretor) ---------- 1 caixa (10 cápsulas)
   Tomar 1 cápsula por via oral a cada 8 horas até o término da diarreia (máximo 7 dias).

3. Probiótico (Saccharomyces boulardii 200mg) ----------- 1 caixa (10 sachês)
   Tomar 1 sachê dissolvido em água 2 vezes ao dia por 5 dias.

Orientações:
- Não utilizar loperamida se houver febre alta ou sangue nas fezes.
- Manter alimentação habitual branda; evitar leite e sucos muito açucarados.`,
  },

  // ---------------------------------------------------------------------------
  // ENDOCRINOLOGIA & REUMATOLOGIA
  // ---------------------------------------------------------------------------
  {
    id_protocolo: 'diabetes_mellitus_tipo2',
    titulo: 'Manejo Farmacológico Inicial do Diabetes Mellitus Tipo 2 no SUS',
    cids_relacionados: ['E11', 'E11.9'],
    ciaps_relacionados: ['T90'],
    nivel_atencao: 'Atencao_Primaria',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Metformina como Terapia Inicial Padrão (SBD 2024)
* Iniciar com 500 a 850 mg/dia junto à refeição principal e titular gradualmente a cada 14 dias até dose plena de 2000 a 2550 mg/dia.
* Redução esperada de HbA1c: 1.5% a 2.0%.
* Monitorar TFG: Contraindicação formal absoluta se TFG < 30 mL/min/1.73m² (risco de acidose lática).`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - DIABETES MELLITUS TIPO 2
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Cloridrato de Metformina 850mg comprimido ----------- 2 caixas (60 comprimidos)
   - Primeiros 14 dias: Tomar 1 comprimido por via oral logo após o almoço ou jantar.
   - A partir do 15º dia: Tomar 1 comprimido após o café da manhã e 1 comprimido após o jantar (total 1700 mg/dia).

Orientações:
- Tomar sempre durante ou após as refeições para amenizar desconfortos digestivos.
- Agendar retorno em 3 meses com dosagem de Hemoglobina Glicada (alvo < 7.0%).`,
  },
  {
    id_protocolo: 'diabetes_tipo2_associacao_metformina_isglt2',
    titulo: 'Diabetes Tipo 2: Terapia Combinada com Inibidor de SGLT2 (Proteção Cardio-Renal)',
    cids_relacionados: ['E11.2', 'E11.5'],
    ciaps_relacionados: ['T90'],
    nivel_atencao: 'Atencao_Primaria_e_Endocrinologia',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Benefícios Independentes do Controle Glicêmico (ADA 2024)
* Redução de hospitalização por insuficiência cardíaca e retardo na progressão da doença renal do diabetes.
* Promove glicosúria osmótica com perda ponderal (~2 a 3 kg) e modesta redução pressórica sistólica (~3 a 5 mmHg).`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - DIABETES TIPO 2 (PROTEÇÃO CARDIO-RENAL)
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Cloridrato de Metformina 500mg lib. prolongada (XR) -- 2 caixas (60 comprimidos)
   Tomar 2 comprimidos (1000 mg) por via oral juntos após o jantar.

2. Dapagliflozina 10mg comprimido revestido ------------- 1 caixa (30 comprimidos)
   Tomar 1 comprimido por via oral uma vez ao dia pela manhã.

Orientações:
- Manter higiene íntima rigorosa com água após micções para prevenir candidíase urogenital.
- Manter hidratação adequada ao longo do dia.`,
  },
  {
    id_protocolo: 'hipotireoidismo_primario_levotiroxina',
    titulo: 'Hipotireoidismo Primário no Adulto e Idoso: Manejo com Levotiroxina',
    cids_relacionados: ['E03.9', 'E03.8'],
    ciaps_relacionados: ['T86'],
    nivel_atencao: 'Atencao_Primaria',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Posologia e Titulação (SBEM / ATA)
* Adulto jovem sem cardiopatia: Dose plena estimada em 1.6 mcg/kg/dia.
* Idosos (> 60 anos) ou portadores de coronariopatia: Iniciar com doses baixas de 12.5 a 25 mcg/dia e titular a cada 6 a 8 semanas para evitar precipitação de arritmias ou angina.
* Coleta de TSH de controle após 6 a 8 semanas da dose estável (alvo de TSH: 0.5 a 4.0 mUI/L).`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - HIPOTIREOIDISMO PRIMÁRIO
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Levotiroxina Sódica 50mcg comprimido ----------------- 1 caixa (30 comprimidos)
   Tomar 1 comprimido por via oral uma vez ao dia pela manhã em jejum estrito com água, pelo menos 30 a 60 minutos antes do café da manhã.

Orientações Mandatórias:
- Não tomar junto a café, leite, suplementos de cálcio ou sulfato ferroso (aguardar pelo menos 4 horas após a levotiroxina para ingerir ferro ou cálcio).`,
  },
  {
    id_protocolo: 'gota_artrite_urica_aguda_e_profilaxia',
    titulo: 'Artrite Gotosa Aguda (Crise) e Hipouricemiantes Crônicos (Alopurinol)',
    cids_relacionados: ['M10.0', 'M10.9'],
    ciaps_relacionados: ['T92'],
    nivel_atencao: 'Atencao_Primaria_e_Reumatologia',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Crise Aguda de Podagra (1ª Metatarsofalângica)
* Colchicina: 1 mg imediatamente, seguido de 0.5 mg após 1 hora (dose total de 1.5 mg no 1º dia); manter 0.5 mg 12/12h até resolução.
* **REGRA FUNDAMENTAL:** NÃO iniciar e NÃO suspender Alopurinol durante a vigência de crise álgica aguda (a variação dos níveis séricos de ácido úrico perpetua a precipitação de cristais de monourato).`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - CRISE AGUDA DE GOTA (ARTRITE ÚRICA)
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Colchicina 0.5mg comprimido ------------------------- 1 caixa (20 comprimidos)
   - Tomar 2 comprimidos (1 mg) imediatamente ao primeiro sinal de dor.
   - Tomar mais 1 comprimido (0.5 mg) exatamente 1 hora após a primeira dose.
   - A partir do 2º dia: Tomar 1 comprimido (0.5 mg) a cada 12 horas por 5 a 7 dias.

2. Dipirona Monoidratada 500mg comprimido -------------- 1 caixa (20 comprimidos)
   Tomar 1 a 2 comprimidos por via oral a cada 6 horas se dor intensa.

Orientações:
- Repouso articular e aplicação de gelo local por 20 minutos 3 vezes ao dia.
- Evitar cerveja, frutos do mar e carnes vermelhas em excesso.`,
  },
  {
    id_protocolo: 'osteoporose_pos_menopausa_alendronato',
    titulo: 'Osteoporose Pós-Menopausa: Terapia com Bisfosfonato (Alendronato)',
    cids_relacionados: ['M81.0'],
    ciaps_relacionados: ['L95'],
    nivel_atencao: 'Atencao_Primaria_e_Ginecologia',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Rastreamento e Indicação (SBR / NOF)
* Mulheres >= 65 anos ou com fratura por fragilidade óssea prévia;
* Critério Densitométrico: T-score <= -2.5 em coluna lombar, colo de fêmur ou fêmur total.`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - OSTEOPOROSE
Paciente: [Nome da Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Alendronato de Sódio 70mg comprimido ----------------- 1 caixa (4 comprimidos)
   Tomar 1 comprimido por via oral uma vez por semana (ex: todo domingo pela manhã) em jejum estrito com 1 copo cheio de água pura.

2. Carbonato de Cálcio 500mg + Vitamina D3 400 UI ------ 1 frasco (60 comprimidos)
   Tomar 1 comprimido por via oral após o almoço diariamente.

INSTRUÇÃO DE SEGURANÇA CRÍTICA:
- Após engolir o comprimido de alendronato com água, PERMANECER EM PÉ OU SENTADO POR PELO MENOS 30 MINUTOS (NUNCA DEITAR) para evitar refluxo e esofagite erosiva grave.`,
  },

  // ---------------------------------------------------------------------------
  // NEUROLOGIA & SAÚDE MENTAL
  // ---------------------------------------------------------------------------
  {
    id_protocolo: 'lombalgia_aguda',
    titulo: 'Abordagem da Lombalgia Mecânica Aguda (Lumbago)',
    cids_relacionados: ['M54.5'],
    ciaps_relacionados: ['L03'],
    nivel_atencao: 'Atencao_Primaria',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Rastreamento de Red Flags
* Síndrome da Cauda Equina (anestesia em sela, incontinência urinária/fecal - emergência cirúrgica);
* Suspeita de fratura ou neoplasia subjacente.
* Desestímulo formal ao repouso no leito: movimentação acelera a resolução funcional.`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - LOMBALGIA MECÂNICA AGUDA
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Dipirona Monoidratada 500mg comprimido -------------- 1 caixa (20 comprimidos)
   Tomar 1 a 2 comprimidos por via oral a cada 6 horas por até 5 dias em caso de dor.

2. Ciclobenzaprina 5mg comprimido ---------------------- 1 caixa (15 comprimidos)
   Tomar 1 comprimido por via oral à noite antes de dormir por 3 a 5 dias.
   (Atenção: pode causar sonolência; não dirigir ou operar maquinário).

Orientações:
- Evitar repouso absoluto na cama. Manter caminhadas curtas.
- Calor local morno por 20 minutos na região lombar 2 a 3 vezes ao dia.`,
  },
  {
    id_protocolo: 'cefaleia_tensional_enxaqueca',
    titulo: 'Abordagem da Cefaleia Tensional e Enxaqueca na Atenção Primária',
    cids_relacionados: ['R51', 'G43.9', 'G44.2'],
    ciaps_relacionados: ['N01', 'N89'],
    nivel_atencao: 'Atencao_Primaria_e_Pronto_Atendimento',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Sinais de Alarme SNOOP
* S (Systemic): Febre, perda ponderal, câncer, imunossupressão.
* N (Neurologic): Déficit focal, alteração pupilar, papiledema.
* O (Onset): Início súbito explosivo ('thunderclap').
* O (Older): Início após 50 anos de idade.
* P (Pattern): Mudança súbita no padrão de dor.`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - CEFALEIA / ENXAQUECA AGUDA
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Dipirona Monoidratada 500mg comprimido -------------- 1 caixa (20 comprimidos)
   Tomar 2 comprimidos (1000 mg) por via oral logo ao início dos sintomas álgicos.
   Se necessário, repetir após 6 horas (máximo 4000 mg/dia).

2. Cloridrato de Metoclopramida 10mg comprimido -------- 1 blister (10 comprimidos)
   Tomar 1 comprimido por via oral se houver enjoo ou náusea associada.

Orientações:
- Repousar em ambiente silencioso e com pouca luminosidade.
- Limitar o uso de analgésicos a no máximo 2 dias por semana para prevenir cefaleia por rebote de medicação.`,
  },
  {
    id_protocolo: 'profilaxia_enxaqueca_cronica',
    titulo: 'Tratamento Profilático da Enxaqueca Frequente ou Crônica',
    cids_relacionados: ['G43.3', 'G43.9'],
    ciaps_relacionados: ['N89'],
    nivel_atencao: 'Atencao_Primaria_e_Neurologia',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Indicação de Terapia Preventiva (SBCe / AAN)
* 3 ou mais episódios incapacitantes de enxaqueca ao mês;
* Crises que não respondem à medicação abortiva ou com uso abusivo de analgésicos (> 10 a 15 dias/mês).`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - PROFILAXIA DE ENXAQUECA
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Cloridrato de Propranolol 40mg comprimido ----------- 1 caixa (60 comprimidos)
   Tomar 1/2 comprimido (20 mg) 12/12h por 7 dias; aumentar para 1 comprimido (40 mg) a cada 12 horas continuamente.
   (Contraindicado em portadores de asma ou bradicardia sintomática).

Orientações:
- Preencher o 'Diário da Cefaleia' anotando dias com dor e possíveis gatilhos alimentares.
- O efeito preventivo pleno manifesta-se após 4 a 8 semanas de uso regular diário.`,
  },
  {
    id_protocolo: 'depressao_ansiedade_atencao_primaria',
    titulo: 'Transtorno Depressivo Maior e Ansiedade na Atenção Primária (ISRS)',
    cids_relacionados: ['F32.1', 'F41.1'],
    ciaps_relacionados: ['P76', 'P74'],
    nivel_atencao: 'Atencao_Primaria',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Princípios Farmacológicos (Guia mhGAP OMS / ABP)
* Primeira linha: Inibidores Seletivos da Recaptação de Serotonina (ISRS) pela tolerabilidade e segurança cardiovascular.
* **Período de Latência Terapêutica:** O efeito antidepressivo consistente inicia após 2 a 4 semanas. Nos primeiros 7 a 10 dias pode haver aumento transitório de ansiedade ou náuseas leves.`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - DEPRESSÃO E ANSIEDADE NA APS
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Cloridrato de Sertralina 50mg comprimido ------------ 1 caixa (30 comprimidos)
   - Tomar 1/2 comprimido (25 mg) por via oral pela manhã após o café nos primeiros 7 dias.
   - A partir do 8º dia: Tomar 1 comprimido inteiro (50 mg) pela manhã diariamente.
   (Receituário de Controle Especial C1 - Branco em 2 vias).

Orientações ao Paciente:
- Não interromper abruptamente a medicação.
- Manter acompanhamento com a equipe multiprofissional (apoio psicológico e atividade física aeróbica).
- Retorno agendado em 3 a 4 semanas para avaliação de resposta clínica e tolerabilidade.`,
  },
  {
    id_protocolo: 'vertigem_posicional_paroxistica_labirintopatia',
    titulo: 'Abordagem da Vertigem Posicional Paroxística Benigna (VPPB) e Labirintite',
    cids_relacionados: ['H81.1', 'H81.0'],
    ciaps_relacionados: ['H82'],
    nivel_atencao: 'Atencao_Primaria_e_Pronto_Atendimento',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Diferenciação Crucial (AAO-HNS)
* **VPPB:** Crises de vertigem giratória de curta duração (< 1 minuto) desencadeadas por movimentos da cabeça.
  - *Tratamento definitivo:* Manobras de reposicionamento canalicular (Manobra de Epley) com taxa de sucesso > 80% sem necessidade de medicação contínua.
* **Labirintite / Neuronite Vestibular:** Vertigem contínua incapacitante de dias com náuseas/vômitos intensos. Supressores vestibulares apenas nas primeiras 48 a 72 horas para não bloquear a compensação central.`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - CRISES AGUDAS DE VERTIGEM
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Dimenidrinato 50mg + Cloridrato de Piridoxina 10mg -- 1 caixa (20 comprimidos)
   Tomar 1 comprimido por via oral a cada 8 horas apenas durante as crises agudas de tontura giratória (limitar a 3 a 5 dias).

Orientações:
- Realizar a Manobra de Epley orientada pelo profissional de saúde.
- Evitar movimentos bruscos de rotação da cabeça e levantar-se devagar da cama.`,
  },

  // ---------------------------------------------------------------------------
  // URGÊNCIA & PEDIATRIA
  // ---------------------------------------------------------------------------
  {
    id_protocolo: 'anafilaxia_reacao_alergica_grave',
    titulo: 'Protocolo de Emergência: Anafilaxia e Reações Alérgicas Graves',
    cids_relacionados: ['T78.2', 'T78.0'],
    ciaps_relacionados: ['A92'],
    nivel_atencao: 'Urgencia_Emergencia',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Conduta Vital Imediata (WAO / AHA)
* **ADRENALINA INTRAMUSCULAR É O MEDICAMENTO DE ESCOLHA IMEDIATO.**
* Dose Adulto: 0.5 mg (0.5 mL de solução 1:1000) IM no terço médio anterolateral da coxa (vasto lateral).
* Dose Pediátrica: 0.01 mg/kg (máximo 0.3 mg) IM no vasto lateral da coxa.
* Pode ser repetida a cada 5 a 15 minutos se resposta insuficiente. Corticoides e anti-histamínicos são fármacos de segunda linha e NUNCA devem atrasar a administração da adrenalina.`,
    bloco_prescricao_copiavel: `PRESCRIÇÃO HOSPITALAR DE EMERGÊNCIA - ANAFILAXIA
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO INTRAMUSCULAR IMEDIATO:
1. Epinefrina (Adrenalina) 1 mg/mL (1:1000) ------------- 1 ampola
   Aplicar 0.5 mL (0.5 mg) por via intramuscular profunda no vasto lateral da coxa IMEDIATAMENTE.

USO INTRAVENOSO:
2. Soro Fisiológico 0.9% bolsa 1000 mL ------------------ 2 bolsas
   Infundir 1000 a 2000 mL em fluxo rápido para expansão volêmica.

3. Succinato Sódico de Hidrocortisona 500mg frasco-ampola - 1 frasco
   Diluir em 20 mL de AD e infundir por via IV lenta (dose de manutenção anti-inflamatória pós-crise).`,
  },
  {
    id_protocolo: 'desidratacao_pediatrica_plano_b_c',
    titulo: 'Manejo da Desidratação Pediátrica (Planos A, B e C da OMS)',
    cids_relacionados: ['E86', 'A09'],
    ciaps_relacionados: ['T11', 'D73'],
    nivel_atencao: 'Atencao_Primaria_e_Urgencia',
    data_revisao: '2026-10-26',
    conteudo_markdown: `## Avaliação do Grau de Desidratação (OMS / SBP)
* **Sem Desidratação (Plano A):** Domiciliar. Oferecer líquidos adicionais e SRO após cada evacuação líquida.
* **Desidratação Leve a Moderada (Plano B):** Unidade de saúde. TRO (Terapia de Reidratação Oral) com SRO: 50 a 100 mL/kg em 4 a 6 horas em colheres/copinhos.
* **Desidratação Grave com Choque (Plano C):** Hidratação venosa rápida com Solução Fisiológica 0.9% ou Ringer Lactato (100 mL/kg fracionado).`,
    bloco_prescricao_copiavel: `RECEITUÁRIO MÉDICO - DESIDRATAÇÃO PEDIÁTRICA (PLANO A + ZINCO)
Paciente: [Nome da Criança] | Idade: [Ex: 1 ano]
Data: [Data do Atendimento]

USO ORAL:
1. Sais de Reidratação Oral (SRO) sachê 27.9g ------------ 6 envelopes
   Diluir 1 envelope em 1 litro de água filtrada. Oferecer 50 a 100 mL aos poucos com colher após cada evacuação diarreica.

2. Sulfato de Zinco 10mg/mL solução oral (ou 20mg comp.) - 1 frasco
   Dar 20 mg por via oral uma vez ao dia durante 14 dias consecutivos (10 mg/dia se menor de 6 meses).
   (Medida fundamental recomendada pela OMS para acelerar a regeneração dos enterócitos intestinais).`,
  },
];
