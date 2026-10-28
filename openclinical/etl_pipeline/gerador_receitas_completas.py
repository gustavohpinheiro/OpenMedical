"""
Gerador de Protocolos e Receituários Clínicos Completos (Brasileiros e Mundiais)
Gera os 45 arquivos Markdown oficiais em clinical_content/protocolos/
e os indexa na tabela virtual FTS5 do SQLite com BM25 ranking.
"""

import os
import sys
import re
import json
import sqlite3
from typing import List, Dict, Any

diretorio_atual = os.path.dirname(os.path.abspath(__file__))
if diretorio_atual not in sys.path:
    sys.path.insert(0, diretorio_atual)

from compilador_banco import obter_caminho_padrao_banco

DIRETORIO_PROTOCOLOS = os.path.abspath(
    os.path.join(diretorio_atual, "..", "clinical_content", "protocolos")
)

STATUS_REVISAO_CLINICA = "pendente_revisao_por_profissional_habilitado"

# Catálogo completo de 45 Protocolos e Receitas Oficiais
TODOS_PROTOCOLOS: List[Dict[str, Any]] = [
    # ---------------------------------------------------------
    # 1. INFECTOLOGIA & ARBOVIROSES
    # ---------------------------------------------------------
    {
        "id_protocolo": "faringite_amigdalite_aguda",
        "titulo": "Manejo da Faringoamigdalite Aguda Estreptocócica",
        "cids": ["J02.0", "J02.9", "J03.0"],
        "ciaps": ["R74"],
        "nivel_atencao": "Atencao_Primaria",
        "diretrizes": "Ministério da Saúde (Brasil), IDSA, NICE",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Amoxicilina 500mg", "Dipirona 500mg", "Penicilina G Benzatina"],
        "categoria": "infectologia",
        "conteudo": """# Diretrizes Clínicas: Faringite e Amigdalite Aguda Estreptocócica

## 1. Critérios Clínicos de Centor Modificados (Streptococcus pyogenes)
* Febre referida ou aferida (> 38 ºC): +1 ponto
* Ausência de tosse: +1 ponto
* Exsudato amigdaliano ou edema com eritema intenso: +1 ponto
* Linfonodomegalia cervical anterior dolorosa: +1 ponto
* Idade de 3 a 14 anos (+1) | 15 a 44 anos (0) | >= 45 anos (-1)
* **Conduta:** Escore >= 3 justifica antibioticoterapia empírica para prevenção de Febre Reumática e Glomerulonefrite Difusa Aguda (GNDA).

## 2. Opções Terapêuticas de Primeira Linha
1. **Amoxicilina:** 500 mg VO a cada 8 horas por 10 dias (ou 875 mg VO a cada 12 horas).
2. **Penicilina G Benzatina (Dose Única IM):**
   * Crianças < 27 kg: 600.000 UI IM dose única profunda.
   * Adultos e crianças >= 27 kg: 1.200.000 UI IM dose única.
3. **Alergia a Betalactâmicos:** Azitromicina 500 mg VO uma vez ao dia por 5 dias.

```receita
RECEITUÁRIO MÉDICO - FARINGOAMIGDALITE AGUDA
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
- Trocar a escova dental após 48 horas de início do antibiótico para evitar reinfecção.
```"""
    },
    {
        "id_protocolo": "manejo_dengue_ms",
        "titulo": "Protocolo de Manejo Clínico da Dengue (MS / OMS)",
        "cids": ["A90"],
        "ciaps": ["A77"],
        "nivel_atencao": "Atencao_Primaria_e_Urgencia",
        "diretrizes": "Ministério da Saúde do Brasil (2024), Organização Pan-Americana da Saúde (OPAS/OMS)",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Sais de Reidratação Oral (SRO)", "Dipirona 500mg", "Paracetamol 500mg"],
        "categoria": "infectologia",
        "conteudo": """# Protocolo de Manejo Clínico da Dengue (Diretrizes MS / OPAS)

## 1. Classificação de Risco e Conduta
* **Grupo A (Sem sinais de alarme, sem comorbidades):** Tratamento domiciliar com hidratação oral volumosa calculada a 60 mL/kg/dia (sendo 1/3 com Sais de Reidratação Oral e 2/3 com líquidos caseiros).
* **Grupo B (Sem alarme, mas com sangramento de pele espontâneo, gestantes, idosos, nefropatas):** Hemograma completo obrigatório e hidratação oral supervisionada (80 mL/kg/dia).
* **Grupos C e D (Presença de Sinais de Alarme ou Choque):** Internação hospitalar imediata. Expansão venosa com SF 0.9% ou Ringer Lactato (10 mL/kg na 1ª hora no grupo C; 20 mL/kg em 20 min no grupo D).

## 2. Contraindicação Formal Absoluta
* **PROIBIDO O USO DE AAS E AINEs** (ibuprofeno, diclofenaco, cetoprofeno, nimesulida) e corticoides pelo risco crítico de hemorragia grave e plaquetopenia aguda.

```receita
RECEITUÁRIO MÉDICO - DENGUE (GRUPO A AMBULATORIAL)
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
- Retorno IMEDIATO ao pronto-atendimento se houver dor abdominal intensa e contínua, vômitos frequentes, tontura ao levantar, sangramento de gengiva/nariz ou sonolência excessiva.
```"""
    },
    {
        "id_protocolo": "chikungunya_fase_aguda_cronica",
        "titulo": "Manejo da Febre de Chikungunya: Fases Aguda e Crônica",
        "cids": ["A92.0"],
        "ciaps": ["A77"],
        "nivel_atencao": "Atencao_Primaria_e_Especializada",
        "diretrizes": "Ministério da Saúde do Brasil, OPAS/OMS",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Dipirona Monoidratada", "Paracetamol 750mg", "Cloridrato de Tramadol"],
        "categoria": "infectologia",
        "conteudo": """# Diretrizes Clínicas: Manejo da Chikungunya

## 1. Fases Clínicas da Doença
* **Fase Aguda (até 14 dias):** Febre alta súbita, poliartralgia intensa bilateral e simétrica (mãos, punhos, tornozelos). Analgesia com Dipirona ou Paracetamol. Evitar AINEs até exclusão de dengue.
* **Fase Pós-Aguda (15 a 90 dias):** Persistência de artralgia inflamatória. Pode-se introduzir AINEs com cautela ou corticoide em dose baixa se refratariedade.
* **Fase Crônica (> 90 dias):** Poliartrite crônica erosiva destrutiva. Indicação de seguimento reumatológico e introdução de Metotrexato ou Hidroxicloroquina.

```receita
RECEITUÁRIO MÉDICO - CHIKUNGUNYA (FASE AGUDA / ANALGESIA ESCALONADA)
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
- Ingesta de pelo menos 2.5 litros de líquidos ao dia.
```"""
    },
    {
        "id_protocolo": "zika_gestante_manifestacoes",
        "titulo": "Manejo da Infecção pelo Vírus Zika e Abordagem na Gestação",
        "cids": ["A92.8", "O35.3"],
        "ciaps": ["A77", "W78"],
        "nivel_atencao": "Atencao_Primaria_e_Pre_Natal",
        "diretrizes": "Ministério da Saúde do Brasil, FEBRASGO, OMS",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Paracetamol 500mg", "Loratadina 10mg", "Repelente com Icaridina"],
        "categoria": "infectologia",
        "conteudo": """# Protocolo: Zika Vírus e Rastreio de Síndrome Congênita

## 1. Quadro Clínico e Sinais de Alerta
* Exantema maculopapular pruriginoso precoce associado a febre baixa ou ausente, hiperemia conjuntival não purulenta e artralgias leves.
* Risco primordial: Síndrome da Zika Congênita (microcefalia, calcificações cerebrais, artrogripose).

## 2. Conduta Terapêutica na Gestante
* Sintomáticos seguros: Paracetamol para controle álgico e febril. Anti-histamínicos seguros (Loratadina) para prurido intenso.
* Ultrassonografia obstétrica seriada a cada 4 semanas para monitoramento da biometria fetal e circunferência cefálica.

```receita
RECEITUÁRIO MÉDICO - ZIKA VÍRUS NA GESTAÇÃO
Paciente: [Nome da Gestante]
Data: [Data do Atendimento]

USO ORAL:
1. Paracetamol 500mg comprimido ------------------------ 1 caixa (20 comprimidos)
   Tomar 1 a 2 comprimidos (500 a 750 mg) por via oral a cada 6 horas se dor ou febre (máximo 3000 mg/dia).

2. Loratadina 10mg comprimido -------------------------- 1 caixa (10 comprimidos)
   Tomar 1 comprimido por via oral uma vez ao dia se prurido cutâneo intenso.

USO TÓPICO:
3. Repelente corporal à base de Icaridina 20% a 25% ----- 1 frasco
   Aplicar nas áreas expostas da pele a cada 8 horas, reaplicando após suor intenso.
```"""
    },
    {
        "id_protocolo": "pneumonia_adquirida_comunidade",
        "titulo": "Pneumonia Adquirida na Comunidade (PAC) no Adulto: Manejo Ambulatorial",
        "cids": ["J18.9", "J13", "J15.9"],
        "ciaps": ["R81"],
        "nivel_atencao": "Atencao_Primaria",
        "diretrizes": "Sociedade Brasileira de Pneumologia e Tisiologia (SBPT), ATS/IDSA",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Amoxicilina 500mg", "Dipirona 500mg"],
        "categoria": "infectologia",
        "conteudo": """# Diretrizes Clínicas: Pneumonia Comunitária Ambulatorial

## 1. Estratificação de Gravidade pelo Escore CURB-65
* **C (Confusão mental):** +1
* **U (Ureia > 50 mg/dL):** +1
* **R (Frequência Respiratória >= 30 ipm):** +1
* **B (Pressão Arterial PAS < 90 ou PAD <= 60 mmHg):** +1
* **65 (Idade >= 65 anos):** +1
* **Conduta:** Escore 0 ou 1: Tratamento ambulatorial seguro. Escore 2: Avaliar internação em enfermaria. Escore >= 3: Internação hospitalar mandatória; considerar UTI se >= 4.

## 2. Esquema Antimicrobiano Empírico
* Adulto hígido sem comorbidades: Amoxicilina 500 mg VO 8/8h por 7 dias (ou Azitromicina 500 mg VO/dia por 5 dias).
* Adulto com comorbidades (DM, DPOC, cardiopatia): Amoxicilina 875 mg + Clavulanato 125 mg VO 12/12h associado a Azitromicina 500 mg/dia.

```receita
RECEITUÁRIO MÉDICO - PNEUMONIA COMUNITÁRIA (AMBULATORIAL)
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Amoxicilina 500mg cápsula --------------------------- 1 caixa (21 cápsulas)
   Tomar 1 cápsula por via oral a cada 8 horas durante 7 dias.

2. Dipirona Monoidratada 500mg comprimido -------------- 1 blister (10 comprimidos)
   Tomar 1 a 2 comprimidos por via oral a cada 6 horas se dor torácica ou febre.

Orientações:
- Esta receita contempla o adulto hígido sem comorbidades (CURB-65 0 ou 1). Em caso de comorbidades, substituir por Amoxicilina + Clavulanato 875/125 mg 12/12h associada a Azitromicina; em alergia a penicilina, usar Azitromicina 500 mg/dia por 5 dias.
- Manter repouso e hidratação oral mínima de 2 litros ao dia.
- Reavaliação médica ambulatorial obrigatória em 48 a 72 horas.
```"""
    },
    {
        "id_protocolo": "sinusite_bacteriana_aguda",
        "titulo": "Rinossinusite Bacteriana Aguda no Adulto",
        "cids": ["J01.9", "J01.0"],
        "ciaps": ["R75"],
        "nivel_atencao": "Atencao_Primaria",
        "diretrizes": "Associação Brasileira de Otorrinolaringologia (ABORL-CCF), IDSA",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Amoxicilina 500mg", "Budesonida Spray Nasal", "Soro Fisiológico 0.9%"],
        "categoria": "infectologia",
        "conteudo": """# Diretrizes Clínicas: Rinossinusite Aguda

## 1. Diferenciação: Viral vs Bacteriana
* A esmagadora maioria (> 95%) das rinossinusites agudas é viral (resfriado comum).
* **Indicações de infecção bacteriana:**
  1. Sintomas persistentes sem melhora após 10 dias de evolução;
  2. Piora bifásica ('double sickening'): piora abrupta de febre e secreção após melhora inicial;
  3. Início severo: febre alta (> 39 ºC) associada a secreção purulenta e dor facial intensa por >= 3 dias consecutivos.

```receita
RECEITUÁRIO MÉDICO - RINOSSINUSITE BACTERIANA AGUDA
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
   Tomar 1 comprimido por via oral a cada 6 horas se dor facial ou cefaleia.
```"""
    },
    {
        "id_protocolo": "otite_media_aguda_pediatrica",
        "titulo": "Otite Média Aguda (OMA) na Infância",
        "cids": ["H65.0", "H66.0"],
        "ciaps": ["H71"],
        "nivel_atencao": "Atencao_Primaria_e_Pediatria",
        "diretrizes": "Sociedade Brasileira de Pediatria (SBP), Academia Americana de Pediatria (AAP)",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Amoxicilina 250mg/5mL", "Dipirona Gotas 500mg/mL", "Ibuprofeno Gotas"],
        "categoria": "pediatria",
        "conteudo": """# Diretrizes Clínicas: Otite Média Aguda Pediátrica

## 1. Critérios Diagnósticos
* Início agudo de otalgia (ou irritabilidade/puxar a orelha em lactentes);
* Abaulamento moderado a severo da membrana timpânica à otoscopia pneumática ou otorreia aguda não decorrente de otite externa.

## 2. Dose Pediátrica de Amoxicilina
* **Dose Padrão OMA:** 80 a 90 mg/kg/dia fracionado a cada 12 horas por 10 dias em menores de 2 anos (ou 7 dias em maiores de 2 anos com OMA leve).
* Essa alta concentração garante níveis terapêuticos eficazes no fluido da orelha média contra cepas de Streptococcus pneumoniae com sensibilidade intermediária à penicilina.

```receita
RECEITUÁRIO MÉDICO - OTITE MÉDIA AGUDA PEDIÁTRICA
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
- Não introduzir cotonetes ou soluções otológicas tópicas se houver perfuração timpânica visível.
```"""
    },
    {
        "id_protocolo": "itu_nao_complicada",
        "titulo": "Manejo da Infecção do Trato Urinário Não Complicada (Cistite Aguda)",
        "cids": ["N39.0", "N30.0"],
        "ciaps": ["U71"],
        "nivel_atencao": "Atencao_Primaria",
        "diretrizes": "Sociedade Brasileira de Urologia (SBU), IDSA, EAU",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Fosfomicina trometamol 3g", "Nitrofurantoína 100mg", "Dipirona Gotas"],
        "categoria": "infectologia",
        "conteudo": """# Diretrizes Clínicas: Cistite Aguda em Mulheres Não Gestantes

## 1. Abordagem Diagnóstica
* Presença de disúria, polaciúria e urgência miccional sem sintomas vaginais (ausência de corrimento ou prurido).
* Ausência de febre, calafrios ou dor em flanco (sinais sugestivos de pielonefrite).
* Urocultura com antibiograma recomendada apenas se: suspeita de pielonefrite, sintomas atípicos, falha terapêutica ou infecção recorrente (>= 3 episódios/ano).

## 2. Escolha Antimicrobiana de 1ª Linha
* **Fosfomicina trometamol 3g dose única:** Excelente adesão e baixos índices de resistência em Escherichia coli.
* **Nitrofurantoína 100mg VO 6/6h por 5 dias:** Primeira linha segura se TFG > 30 mL/min.

```receita
RECEITUÁRIO MÉDICO - CISTITE AGUDA NÃO COMPLICADA
Paciente: [Nome da Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Fosfomicina trometamol 3g pó para solução oral ------- 1 sachê
   Dissolver 1 sachê em meio copo de água e tomar em dose única por via oral, à noite ao deitar, logo após esvaziar a bexiga.

2. Dipirona Monoidratada 500mg/mL gotas ---------------- 1 frasco (20 mL)
   Tomar 35 a 40 gotas por via oral a cada 6 a 8 horas se dor ou desconforto miccional nas primeiras 48 horas.

Orientações Preventivas:
- Ingerir pelo menos 2 litros de água ao longo do dia.
- Urinar após o coito e evitar postergar a micção quando sentir vontade.
```"""
    },
    {
        "id_protocolo": "pielonefrite_aguda_nao_complicada",
        "titulo": "Pielonefrite Aguda Não Complicada (Manejo Ambulatorial)",
        "cids": ["N10"],
        "ciaps": ["U70"],
        "nivel_atencao": "Atencao_Primaria_e_Urgencia",
        "diretrizes": "Sociedade Brasileira de Nefrologia (SBN), IDSA",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Ciprofloxacino 500mg", "Ceftriaxona 1g IV", "Dipirona 500mg"],
        "categoria": "infectologia",
        "conteudo": """# Diretrizes Clínicas: Pielonefrite Aguda

## 1. Critérios de Internação Hospitalar
* Intolerância gástrica (vômitos incoercíveis impossibilitando medicação oral);
* Sepse ou instabilidade hemodinâmica;
* Gestantes;
* Obstrução do trato urinário conhecida ou litíase associada;
* Descompensação de comorbidades clínicas de base.

## 2. Conduta Ambulatorial para Pacientes Selecionados
* Coletar Urocultura com antibiograma e hemograma antes da primeira dose.
* Dose de ataque inicial parenteral no pronto-atendimento (Ceftriaxona 1g IV) seguida de Ciprofloxacino oral se estabilidade clínica.

```receita
RECEITUÁRIO MÉDICO - PIELONEFRITE AGUDA AMBULATORIAL
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
- Procurar hospital imediatamente se apresentar vômitos contínuos, febre > 39 ºC persistente ou queda da pressão arterial.
```"""
    },
    {
        "id_protocolo": "erisipela_celulite_infecciosa",
        "titulo": "Manejo da Erisipela e Celulite Infecciosa de Membros Inferiores",
        "cids": ["A46", "L03.1"],
        "ciaps": ["S76"],
        "nivel_atencao": "Atencao_Primaria_e_Pronto_Atendimento",
        "diretrizes": "Sociedade Brasileira de Dermatologia (SBD), IDSA",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Cefalexina 500mg", "Dipirona 500mg", "Permanganato de Potássio"],
        "categoria": "infectologia",
        "conteudo": """# Diretrizes Clínicas: Infecções de Pele e Partes Moles

## 1. Diferenciação Clínica
* **Erisipela:** Acomete derme superficial e linfáticos; bordas nítidas, elevadas e bem demarcadas; Streptococcus pyogenes predominante.
* **Celulite:** Acomete derme profunda e tecido subcutâneo; bordas mal delimitadas e difusas; Staphylococcus aureus e estreptococos.

## 2. Tratamento Oral Ambulatorial
* Demarcar com caneta a borda do eritema para acompanhar a resposta clínica diária.
* Elevação do membro afetado acima do nível do quadril (reduz edema e acelera cura).

```receita
RECEITUÁRIO MÉDICO - ERISIPELA / CELULITE AMBULATORIAL
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
- Tratar a porta de entrada (frieiras interdigitais, micose ungueal ou ferimentos).
```"""
    },
    {
        "id_protocolo": "impetigo_crostoso_bolhoso",
        "titulo": "Manejo do Impetigo Crostoso e Bolhoso na Criança e Adulto",
        "cids": ["L01.0", "L01.1"],
        "ciaps": ["S84"],
        "nivel_atencao": "Atencao_Primaria",
        "diretrizes": "Sociedade Brasileira de Dermatologia (SBD), SBP",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Mupirocina 2% Pomada", "Cefalexina 250mg/5mL", "Sabonete Antisséptico"],
        "categoria": "pediatria",
        "conteudo": """# Diretrizes Clínicas: Impetigo

## 1. Características e Etiologia
* Lesões vesicopustulosas com crostas melicéricas aderentes ('aspecto de açúcar queimado') periorificiais.
* Agentes etiológicos: Staphylococcus aureus e Streptococcus pyogenes.

## 2. Conduta Terapêutica
* **Lesões localizadas (< 3 lesões):** Pomada tópica de Mupirocina 2% por 7 dias após amolecimento das crostas com água morna.
* **Lesões disseminadas ou sistêmicas:** Cefalexina por via oral associada ao cuidado local.

```receita
RECEITUÁRIO MÉDICO - IMPETIGO
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO TÓPICO:
1. Mupirocina 2% pomada dermatológica ------------------ 1 bisnaga (15 g)
   Lavar suavemente a região com água morna e sabonete neutro para remover crostas frouxas.
   Aplicar fina camada da pomada sobre as lesões 3 vezes ao dia durante 7 dias.

USO ORAL (Se lesões extensas):
2. Cefalexina 500mg comprimido (ou suspensão 250mg/5mL) -- 1 caixa
   Adultos: 500 mg por via oral a cada 6 horas por 7 dias. Crianças: 25 a 50 mg/kg/dia da suspensão 250mg/5mL, divididos a cada 6 horas, por 7 dias.

Orientações:
- Uso estritamente individual de toalhas de banho e roupas de cama para evitar disseminação intrafamiliar.
```"""
    },
    {
        "id_protocolo": "herpes_zoster_nevralgia",
        "titulo": "Abordagem do Herpes Zoster e Prevenção da Nevralgia Pós-Herpética",
        "cids": ["B02.9", "G53.0"],
        "ciaps": ["S70"],
        "nivel_atencao": "Atencao_Primaria_e_Pronto_Atendimento",
        "diretrizes": "Sociedade Brasileira de Dermatologia (SBD), CDC",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Aciclovir 800mg", "Dipirona 500mg", "Gabapentina 300mg"],
        "categoria": "infectologia",
        "conteudo": """# Diretrizes Clínicas: Herpes Zoster

## 1. Janela de Eficácia Antiviral
* Reativação do vírus Varicela-Zóster em dermátomo unilateral.
* Iniciar antiviral idealmente nas primeiras 72 horas do surgimento das vesículas para reduzir a duração do quadro e o risco de Nevralgia Pós-Herpética (NPH).
* Rastrear acometimento de ramo oftálmico do trigêmeo (Sinal de Hutchinson: vesícula na ponta do nariz) - encaminhamento oftalmológico de urgência pelo risco de ceratite herpética.

```receita
RECEITUÁRIO MÉDICO - HERPES ZOSTER AGUDO
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Aciclovir 800mg comprimido -------------------------- 5 caixas (35 comprimidos)
   Tomar 1 comprimido (800 mg) por via oral 5 vezes ao dia (a cada 4 horas, pulando a dose da madrugada) durante 7 dias consecutivos.

2. Dipirona Monoidratada 500mg comprimido -------------- 1 caixa (20 comprimidos)
   Tomar 1 a 2 comprimidos por via oral a cada 6 horas se dor em queimação.

3. Gabapentina 300mg cápsula --------------------------- 1 caixa (30 cápsulas)
   Tomar 1 cápsula à noite antes de deitar nos primeiros 3 dias; aumentar para 1 cápsula 12/12h se dor neuropática intensa persistente.
```"""
    },
    {
        "id_protocolo": "parasitoses_intestinais_giardiase",
        "titulo": "Protocolo de Tratamento das Parasitoses Intestinais na Atenção Primária",
        "cids": ["B82.9", "A07.1", "B77.9"],
        "ciaps": ["D96"],
        "nivel_atencao": "Atencao_Primaria",
        "diretrizes": "Ministério da Saúde do Brasil, OMS",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Albendazol 400mg", "Secnidazol 1000mg", "Metronidazol 400mg"],
        "categoria": "infectologia",
        "conteudo": """# Diretrizes Clínicas: Parasitoses Intestinais

## 1. Espectro Terapêutico
* **Geo-helmintos (Ascaris, Ancylostoma, Enterobius):** Albendazol em dose única (repetir após 14 dias para enterobíase devido ao ciclo biológico).
* **Protozoários (Giardia lamblia, Entamoeba histolytica):** Secnidazol 2g dose única ou Metronidazol por 5 a 7 dias.

```receita
RECEITUÁRIO MÉDICO - PARASITOSES INTESTINAIS
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
- Tratamento profilático de todos os coabitantes da mesma residência para quebrar o ciclo de transmissão.
```"""
    },
    {
        "id_protocolo": "sifilis_adquirida_primaria_secundaria",
        "titulo": "Manejo da Sífilis Adquirida (Primária, Secundária e Latente Recente)",
        "cids": ["A51.0", "A51.3", "A52.9"],
        "ciaps": ["Y70"],
        "nivel_atencao": "Atencao_Primaria_e_IST",
        "diretrizes": "PCDT ISTs Ministério da Saúde do Brasil (2024), CDC, OMS",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Penicilina G Benzatina 1.200.000 UI", "Doxiciclina 100mg"],
        "categoria": "infectologia",
        "conteudo": """# Diretrizes Clínicas: Protocolo Clínico da Sífilis (PCDT/MS)

## 1. Esquemas Terapêuticos Padronizados
* **Sífilis Primária (Cancro Duro), Secundária (Roséola, Condiloma plano) e Latente Recente (< 1 ano):**
  - Penicilina G Benzatina 2.400.000 UI IM em dose única (1.200.000 UI em cada glúteo).
* **Sífilis Latente Tardia (> 1 ano) ou Duração Indeterminada:**
  - Penicilina G Benzatina 2.400.000 UI IM semanal por 3 semanas consecutivas (Dose cumulativa: 7.200.000 UI).
* **Gestantes:** Penicilina G Benzatina é o ÚNICO medicamento eficaz para prevenção da Sífilis Congênita.

```receita
RECEITUÁRIO MÉDICO - SÍFILIS ADQUIRIDA (DOSE ÚNICA)
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO INTRAMUSCULAR PROFUNDO:
1. Penicilina G Benzatina 1.200.000 UI suspensão injetável - 2 frascos-ampola
   Aplicar 1 frasco-ampola por via intramuscular profunda em cada região glútea, em dose única (dose total: 2.400.000 UI).
   (Aplicação imediata em unidade de saúde; observar por 30 minutos).

Orientações:
- Notificação compulsória e convocação de todos os parceiros sexuais dos últimos 90 dias para tratamento empírico simultâneo.
- Controle sorológico quantitativo de cura com VDRL trimestral (espera-se queda de pelo menos 2 titulações em 6 meses, ex: de 1:32 para 1:8).
```"""
    },
    {
        "id_protocolo": "uretrite_gonococica_clamidia",
        "titulo": "Abordagem Sindrômica das Uretrites e Cervicites (Gonorreia e Clamídia)",
        "cids": ["A54.0", "A56.0"],
        "ciaps": ["U72", "X71"],
        "nivel_atencao": "Atencao_Primaria_e_Urgencia",
        "diretrizes": "PCDT ISTs Ministério da Saúde do Brasil, CDC",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Ceftriaxona 500mg IM", "Azitromicina 500mg VO"],
        "categoria": "infectologia",
        "conteudo": """# Diretrizes Clínicas: Corrimento Uretral Masculino e Cervicite

## 1. Abordagem Sindrômica
* Diante de corrimento uretral purulento ou mucopurulento, tratar obrigatoriamente e simultaneamente Neisseria gonorrhoeae e Chlamydia trachomatis em dose única presencial.

```receita
RECEITUÁRIO MÉDICO - URETRITE / CERVICITE (SÍNDROME DE CORRIMENTO)
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
- Tratamento e testagem para HIV, Sífilis e Hepatites de todas as parcerias sexuais recentes.
```"""
    },
    {
        "id_protocolo": "candidiaze_vulvovaginal",
        "titulo": "Manejo da Candidíase Vulvovaginal Aguda",
        "cids": ["B37.3"],
        "ciaps": ["X72"],
        "nivel_atencao": "Atencao_Primaria",
        "diretrizes": "FEBRASGO, CDC",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Fluconazol 150mg", "Nitrato de Miconazol Creme 2%"],
        "categoria": "ginecologia",
        "conteudo": """# Diretrizes Clínicas: Candidíase Vulvovaginal

## 1. Quadro Clínico Típico
* Prurido vulvar intenso, ardor miccional externo, edema e eritema vulvovaginal.
* Corrimento esbranquiçado grumoso ('aspecto de leite coalhado') aderido às paredes vaginais com pH < 4.5.

```receita
RECEITUÁRIO MÉDICO - CANDIDÍASE VULVOVAGINAL
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
- Usar roupas íntimas de algodão folgadas e evitar protetores diários sintéticos abafados.
```"""
    },
    {
        "id_protocolo": "vaginose_bacteriana_tricomoniase",
        "titulo": "Tratamento da Vaginose Bacteriana e Tricomoníase Vaginal",
        "cids": ["N76.0", "A59.0"],
        "ciaps": ["X73"],
        "nivel_atencao": "Atencao_Primaria",
        "diretrizes": "FEBRASGO, PCDT ISTs Ministério da Saúde",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Metronidazol 400mg", "Metronidazol Gel Vaginal"],
        "categoria": "ginecologia",
        "conteudo": """# Diretrizes Clínicas: Corrimento com Odor Fétido

## 1. Critérios de Amsel para Vaginose Bacteriana
* Corrimento acinzentado fino homogêneo;
* pH vaginal > 4.5;
* Teste das aminas positivo (Whiff test com KOH 10%: odor característico de peixe em decomposição);
* Presença de 'Clue Cells' (células guia) à microscopia óptica.

```receita
RECEITUÁRIO MÉDICO - VAGINOSE BACTERIANA
Paciente: [Nome da Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Metronidazol 400mg (ou 500mg) comprimido ------------ 1 caixa (20 comprimidos)
   Tomar 1 comprimido por via oral a cada 12 horas durante 7 dias consecutivos.

ADVERTÊNCIA RIGOROSA:
- PROIBIDO CONSUMO DE ÁLCOOL durante o tratamento e até 48 horas após a última dose pelo risco de reação dissulfiram-like (rubor facial, taquicardia, náuseas e vômitos incoercíveis).
```"""
    },
    {
        "id_protocolo": "influenza_sindrome_gripal_oseltamivir",
        "titulo": "Manejo da Síndrome Gripal e Uso do Oseltamivir (Influenza A/B)",
        "cids": ["J10.1", "J11.1"],
        "ciaps": ["R80"],
        "nivel_atencao": "Atencao_Primaria_e_Urgencia",
        "diretrizes": "Ministério da Saúde do Brasil, OMS, CDC",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Fosfato de Oseltamivir 75mg", "Dipirona 500mg", "Soro Fisiológico"],
        "categoria": "infectologia",
        "conteudo": """# Protocolo de Tratamento da Influenza (Ministério da Saúde)

## 1. Grupos Prioritários para Antiviral (Oseltamivir)
* Gestantes e puérperas (até 2 semanas pós-parto);
* Crianças < 2 anos e idosos >= 60 anos;
* Portadores de pneumopatias (incluindo asma), cardiopatias, imunossuprimidos, renais crônicos e obesidade grau III (IMC >= 40);
* Sinais de Síndrome Respiratória Aguda Grave (SRAG): dispneia, SpO2 < 95% em ar ambiente, hipotensão arterial.

```receita
RECEITUÁRIO MÉDICO - SÍNDROME GRIPAL EM GRUPO DE RISCO
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
- Retorno de urgência se sentir falta de ar, dor no peito ou lábios arroxeados.
```"""
    },

    # ---------------------------------------------------------
    # 2. CARDIOLOGIA & NEFROLOGIA
    # ---------------------------------------------------------
    {
        "id_protocolo": "crise_hipertensiva",
        "titulo": "Abordagem da Crise Hipertensiva: Urgência vs Emergência Hipertensiva",
        "cids": ["I10", "I15"],
        "ciaps": ["K86", "K87"],
        "nivel_atencao": "Atencao_Primaria_e_Pronto_Atendimento",
        "diretrizes": "Diretrizes Brasileiras de Hipertensão (SBC 2020), AHA/ACC",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Maleato de Enalapril 10mg", "Hidroclorotiazida 25mg", "Anlodipino 5mg"],
        "categoria": "cardiovascular",
        "conteudo": """# Diretrizes Clínicas: Crise Hipertensiva

## 1. Classificação Diferencial Obrigatória
* **Urgência Hipertensiva:** PA >= 180x120 mmHg SEM evidência de lesão aguda em órgãos-alvo (sem encefalopatia, sem edema agudo de pulmão, sem dissecção aórtica).
  - *Conduta:* Redução gradual da PA por via oral em 24 a 48 horas. Evitar quedas abruptas com nifedipino sublingual (risco de isquemia cerebral).
* **Emergência Hipertensiva:** PA elevada COM lesão aguda em evolução em órgãos-alvo.
  - *Conduta:* Internação imediata em UTI e vasodilatador intravenoso contínuo sob monitorização invasiva (Nitroprussiato de Sódio ou Nitroglicerina).

```receita
RECEITUÁRIO MÉDICO - URGÊNCIA HIPERTENSIVA (CONTROLE AMBULATORIAL)
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
- Retorno ao pronto-socorro se dor no peito, falta de ar súbita, perda de visão ou confusão mental.
```"""
    },
    {
        "id_protocolo": "hipertensao_arterial_estagio1_2",
        "titulo": "Hipertensão Arterial Sistêmica Estágios 1 e 2 (Terapia Combinada Inicial)",
        "cids": ["I10"],
        "ciaps": ["K86"],
        "nivel_atencao": "Atencao_Primaria",
        "diretrizes": "Sociedade Brasileira de Cardiologia (SBC 2020), ESH/ESC, AHA",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Losartana Potássica 50mg", "Besilato de Anlodipino 5mg", "Hidroclorotiazida 25mg"],
        "categoria": "cardiovascular",
        "conteudo": """# Diretrizes Clínicas: Tratamento Farmacológico da Hipertensão

## 1. Estratégia de Combinação Dupla Precoce
* Para hipertensos estágio 2 (PA >= 160/100 mmHg) ou estágio 1 (140-159/90-99 mmHg) com alto risco cardiovascular, iniciar preferencialmente associação de duas classes em doses baixas.
* **Mulheres em idade fértil:** BRA e IECA são contraindicados na gestação (toxicidade fetal); exigir contracepção eficaz ou optar por outra classe.
* Classes preferenciais: BRA (Losartana) ou IECA (Enalapril) + Bloqueador dos Canais de Cálcio (Anlodipino) ou Tiazídico.

```receita
RECEITUÁRIO MÉDICO - HIPERTENSÃO ARTERIAL (COMBINAÇÃO SINÉRGICA)
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Losartana Potássica 50mg comprimido revestido ------- 1 caixa (30 comprimidos)
   Tomar 1 comprimido por via oral uma vez ao dia pela manhã.

2. Besilato de Anlodipino 5mg comprimido --------------- 1 caixa (30 comprimidos)
   Tomar 1 comprimido por via oral uma vez ao dia pela manhã.

Orientações:
- Prática de exercícios aeróbicos regulares (150 minutos por semana).
- Acompanhar surgimento de eventual edema maleolar vespertino leve decorrente do vasodilatador.
```"""
    },
    {
        "id_protocolo": "insuficiencia_cardiaca_fracao_reduzida",
        "titulo": "Insuficiência Cardíaca com Fração de Ejeção Reduzida (IC-FEr: O Quarteto Fantástico)",
        "cids": ["I50.0", "I50.9"],
        "ciaps": ["K77"],
        "nivel_atencao": "Atencao_Primaria_e_Cardiologia",
        "diretrizes": "Diretriz Brasileira de Insuficiência Cardíaca (SBC 2023), ESC, AHA/ACC",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Succinato de Metoprolol", "Maleato de Enalapril 5mg", "Espironolactona 25mg", "Dapagliflozina 10mg"],
        "categoria": "cardiovascular",
        "conteudo": """# Diretrizes Clínicas: Terapia Modificadora de Prognóstico na IC-FEr

## 1. As Quatro Classes Obrigatórias (Redução de Mortalidade Global)
1. **Inibidor do SRAA:** IECA (Enalapril), BRA ou preferencialmente ARNI (Sacubitril/Valsartana);
2. **Betabloqueador cardioprotetor:** Succinato de Metoprolol, Carvedilol ou Bisoprolol;
3. **Antagonista do Receptor Mineralocorticoide:** Espironolactona 25 mg/dia;
4. **Inibidor de SGLT2:** Dapagliflozina 10 mg ou Empagliflozina 10 mg uma vez ao dia.

```receita
RECEITUÁRIO MÉDICO - INSUFICIÊNCIA CARDÍACA (IC-FEr)
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Succinato de Metoprolol 25mg comprimido lib. prolongada - 1 caixa (30 comprimidos)
   Tomar 1 comprimido por via oral pela manhã (titular dose a cada 2 a 4 semanas até 100-200 mg/dia).

2. Maleato de Enalapril 5mg comprimido ------------------ 1 caixa (60 comprimidos)
   Tomar 1/2 comprimido (2.5 mg) por via oral de 12 em 12 horas na 1ª semana; titular a cada 2 semanas até a dose-alvo de 10 a 20 mg de 12 em 12 horas conforme PA, potássio e creatinina.

3. Espironolactona 25mg comprimido --------------------- 1 caixa (30 comprimidos)
   Tomar 1 comprimido por via oral pela manhã (monitorar potássio e creatinina séricos).

4. Dapagliflozina 10mg comprimido ----------------------- 1 caixa (30 comprimidos)
   Tomar 1 comprimido por via oral uma vez ao dia pela manhã.

5. Furosemida 40mg comprimido (Sintomático de Congestão) - 1 caixa (30 comprimidos)
   Tomar 1 comprimido pela manhã em jejum se ganho de peso súbito (> 2 kg em 3 dias) ou edema nas pernas.
```"""
    },
    {
        "id_protocolo": "fibrilacao_atrial_anticoagulacao_cha2ds2vasc",
        "titulo": "Fibrilação Atrial: Prevenção de AVC e Estratificação CHA2DS2-VASc",
        "cids": ["I48.0", "I48.9"],
        "ciaps": ["K78"],
        "nivel_atencao": "Atencao_Primaria_e_Cardiologia",
        "diretrizes": "Sociedade Brasileira de Cardiologia (SBC), ESC, AHA/ACC",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Rivaroxabana 20mg", "Apixabana 5mg", "Atenolol 50mg"],
        "categoria": "cardiovascular",
        "conteudo": """# Diretrizes Clínicas: Anticoagulação na Fibrilação Atrial

## 1. Estratificação de Risco Embólico pelo Escore CHA2DS2-VASc
* Insuficiência Cardíaca (+1), Hipertensão (+1), Idade >= 75 anos (+2), Diabetes (+1), AVC/AIT prévio (+2), Doença Vascular (+1), Idade 65-74 (+1), Sexo Feminino (+1).
* **Indicação de Anticoagulação:** Homens com escore >= 2 e Mulheres com escore >= 3 têm indicação formal de DOAC (Anticoagulante Oral Direto) ou Varfarina.
* **Exceção:** FA com estenose mitral moderada a grave ou prótese valvar mecânica não deve receber DOAC; usar Varfarina (INR 2-3).

```receita
RECEITUÁRIO MÉDICO - FIBRILAÇÃO ATRIAL (ANTICOAGULAÇÃO ORAL)
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Rivaroxabana 20mg comprimido revestido -------------- 1 caixa (28 comprimidos)
   Tomar 1 comprimido por via oral uma vez ao dia, obrigatoriamente junto à maior refeição (almoço ou jantar).
   (Ajustar para 15 mg/dia se ClCr entre 15 e 49 mL/min).

2. Atenolol 50mg comprimido (Controle de Frequência Cardíaca) - 1 caixa (30 comprimidos)
   Tomar 1 comprimido por via oral uma vez ao dia pela manhã para manter FC alvo de repouso < 100 bpm.

Orientações:
- Atenção a sinais de sangramento (fezes escuras, sangue na urina ou hematomas espontâneos múltiplos).
```"""
    },
    {
        "id_protocolo": "angina_estavel_doenca_coronariana",
        "titulo": "Doença Arterial Coronariana Crônica: Angina Estável",
        "cids": ["I20.9", "I25.1"],
        "ciaps": ["K74"],
        "nivel_atencao": "Atencao_Primaria_e_Cardiologia",
        "diretrizes": "Diretriz de DAC Estável da SBC, ESC, AHA",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["AAS 100mg", "Atorvastatina 40mg", "Atenolol 50mg", "Dinitrato de Isossorbida"],
        "categoria": "cardiovascular",
        "conteudo": """# Diretrizes Clínicas: Angina Estável

## 1. Metas do Tratamento
* Prevenção secundária de infarto agudo do miocárdio e óbito cardiovascular (AAS + Estatina de alta intensidade);
* Alívio dos sintomas isquêmicos e melhora da capacidade funcional (Betabloqueador + Nitrato).

```receita
RECEITUÁRIO MÉDICO - DOENÇA ARTERIAL CORONARIANA CRÔNICA
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Ácido Acetilsalicílico (AAS) 100mg comprimido -------- 1 caixa (30 comprimidos)
   Tomar 1 comprimido por via oral uma vez ao dia logo após o almoço.

2. Atorvastatina 40mg comprimido revestido -------------- 1 caixa (30 comprimidos)
   Tomar 1 comprimido por via oral uma vez ao dia (estatina de alta intensidade; titular até 80 mg se LDL-c acima da meta).

3. Atenolol 50mg comprimido ---------------------------- 1 caixa (30 comprimidos)
   Tomar 1 comprimido por via oral pela manhã.

4. Dinitrato de Isossorbida 5mg comprimido sublingual -- 1 caixa (20 comprimidos)
   Colocar 1 comprimido sob a língua apenas em caso de dor no peito aos esforços; se dor persistir por mais de 5 a 10 minutos, procurar emergência com urgência.
```"""
    },
    {
        "id_protocolo": "dislipidemia_prevencao_cardiovascular",
        "titulo": "Prevenção Cardiovascular Primária e Manejo das Dislipidemias (SBC / AHA)",
        "cids": ["E78.0", "E78.2"],
        "ciaps": ["T93"],
        "nivel_atencao": "Atencao_Primaria",
        "diretrizes": "Diretrizes de Dislipidemia da Sociedade Brasileira de Cardiologia (SBC), AHA/ACC",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Sinvastatina 20mg a 40mg", "Atorvastatina 20mg", "Ezetimiba 10mg"],
        "categoria": "cardiovascular",
        "conteudo": """# Diretrizes Clínicas: Estratificação de Risco e Metas de LDL-colesterol

## 1. Metas de LDL-c segundo Risco Cardiovascular Global (SBC)
* Baixo Risco: LDL-c < 130 mg/dL
* Risco Intermediário: LDL-c < 100 mg/dL
* Alto Risco (DM, placa carotídea subclínica, aneurisma): LDL-c < 70 mg/dL
* Muito Alto Risco (Infarto prévio, AVC prévio, revascularização): LDL-c < 50 mg/dL

```receita
RECEITUÁRIO MÉDICO - DISLIPIDEMIA (PREVENÇÃO CARDIOVASCULAR)
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Sinvastatina 20mg (ou 40mg) comprimido revestido ---- 2 caixas (60 comprimidos)
   Tomar 1 comprimido por via oral uma vez ao dia à noite ao deitar.
   (A síntese hepática do colesterol ocorre preferencialmente durante o repouso noturno).

Orientações:
- Dieta com restrição de gorduras trans e saturadas; estímulo ao azeite de oliva e fibras solúveis (aveia).
- Comunicar o médico se apresentar dor muscular generalizada persistente ou urina escura.
```"""
    },
    {
        "id_protocolo": "doenca_renal_cronica_nefroprotecao",
        "titulo": "Doença Renal Crônica (DRC): Estratégias de Nefroproteção e Retardo da Progressão",
        "cids": ["N18.9", "N18.3", "N18.4"],
        "ciaps": ["U99"],
        "nivel_atencao": "Atencao_Primaria_e_Nefrologia",
        "diretrizes": "Diretrizes KDIGO (2024), Sociedade Brasileira de Nefrologia (SBN)",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Losartana Potássica", "Dapagliflozina 10mg", "Bicarbonato de Sódio"],
        "categoria": "nefrologia",
        "conteudo": """# Diretrizes Clínicas: Nefroproteção na DRC (KDIGO 2024)

## 1. Pilares Terapêuticos
* Controle rigoroso da Pressão Arterial (alvo < 120/80 mmHg com técnica padronizada);
* Bloqueio do SRAA com BRA ou IECA para redução da pressão intraglomerular e proteinúria;
* Inibidores de SGLT2 (Dapagliflozina/Empagliflozina) para retardar declínio de TFG;
* Evitar AINEs, contrastes iodados desnecessários e automedicação nefrotóxica.

```receita
RECEITUÁRIO MÉDICO - NEFROPROTEÇÃO NA DRC (ESTÁGIOS G2 A G4)
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Losartana Potássica 50mg comprimido revestido ------- 1 caixa (30 comprimidos)
   Tomar 1 comprimido por via oral uma vez ao dia pela manhã.

2. Dapagliflozina 10mg comprimido ----------------------- 1 caixa (30 comprimidos)
   Tomar 1 comprimido por via oral uma vez ao dia pela manhã (indicado para TFG >= 20 mL/min).

Orientações:
- Restrição proteica moderada (0.8 g/kg/dia) orientada por nutricionista.
- NUNCA tomar anti-inflamatórios como diclofenaco, cetoprofeno, nimesulida ou ibuprofeno.
```"""
    },

    # ---------------------------------------------------------
    # 3. PNEUMOLOGIA (GINA, GOLD, SBPT)
    # ---------------------------------------------------------
    {
        "id_protocolo": "asma_exacerbacao_aguda",
        "titulo": "Manejo da Exacerbação Aguda de Asma na Atenção Básica e Urgência",
        "cids": ["J45", "J45.9", "J46"],
        "ciaps": ["R96"],
        "nivel_atencao": "Atencao_Primaria_e_Urgencia",
        "diretrizes": "Global Initiative for Asthma (GINA 2024), SBPT",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Sulfato de Salbutamol 100mcg Spray", "Prednisona 20mg"],
        "categoria": "respiratorio",
        "conteudo": """# Diretrizes Clínicas: Crise Asmática Aguda

## 1. Manejo Imediato na Crise Leve a Moderada
* Salbutamol Spray 100 mcg acoplado a espaçador valvulado: 4 a 10 jatos a cada 20 minutos na primeira hora.
* Corticoterapia sistêmica oral precoce (Prednisona 40 a 50 mg em dose única) acelera a resolução da inflamação e previne reinternações.

```receita
RECEITUÁRIO MÉDICO - ALTA DA EXACERBAÇÃO DE ASMA
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
- Utilizar obrigatoriamente o espaçador valvulado para garantir a deposição pulmonar do broncodilatador.
```"""
    },
    {
        "id_protocolo": "asma_tratamento_manutencao_gina",
        "titulo": "Tratamento de Manutenção da Asma Crônica (Diretrizes GINA)",
        "cids": ["J45.0", "J45.8"],
        "ciaps": ["R96"],
        "nivel_atencao": "Atencao_Primaria_e_Pneumologia",
        "diretrizes": "Global Initiative for Asthma (GINA 2024), SBPT",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Budesonida + Formoterol", "Dipropionato de Beclometasona"],
        "categoria": "respiratorio",
        "conteudo": """# Diretrizes Clínicas: Asma Crônica de Manutenção

## 1. Mudança de Paradigma GINA
* O uso de broncodilatador de curta ação (SABA isolado) não é mais recomendado como monoterapia devido ao risco aumentado de exacerbações graves e mortalidade.
* O pilar central é o Corticoide Inalatório (CI) associado a Formoterol (LABA de início rápido) como terapia de alívio e manutenção (SMART / MART).

```receita
RECEITUÁRIO MÉDICO - ASMA CRÔNICA (MANUTENÇÃO GINA ETAPA 3)
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO INALATÓRIO:
1. Fumarato de Formoterol 6mcg + Budesonida 200mcg cápsulas inalatórias - 1 caixa (60 cápsulas)
   Inalar 1 cápsula por via oral com o inalador a cada 12 horas diariamente de manutenção.
   Em caso de sintomas agudos, inalar 1 cápsula adicional de alívio imediato (máximo de 8 a 12 cápsulas/dia).

Orientações:
- Enxaguar a boca com água e cuspir após cada inalação para prevenir candidíase oral (sapinho) e rouquidão.
```"""
    },
    {
        "id_protocolo": "dpoc_estavel_manutencao_gold",
        "titulo": "Doença Pulmonar Obstrutiva Crônica (DPOC): Tratamento Estável (GOLD)",
        "cids": ["J44.0", "J44.9"],
        "ciaps": ["R95"],
        "nivel_atencao": "Atencao_Primaria_e_Pneumologia",
        "diretrizes": "Global Initiative for Chronic Obstructive Lung Disease (GOLD 2024), SBPT",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Brometo de Tiotrópio 2.5mcg (LAMA)", "Salmeterol 50mcg (LABA)", "Sulfato de Salbutamol 100mcg"],
        "categoria": "respiratorio",
        "conteudo": """# Diretrizes Clínicas: DPOC (GOLD 2024)

## 1. Classificação ABE e Metas
* Grupo A (Poucos sintomas, 0-1 exacerbação sem internação): Broncodilatador de longa ação (LAMA ou LABA).
* Grupo B (Muitos sintomas mMRC >= 2 ou CAT >= 10): Dupla broncodilatação LAMA + LABA.
* Grupo E (>= 2 exacerbações ou >= 1 internação no último ano): LAMA + LABA (+ Corticoide Inalatório se eosinófilos sanguíneos >= 300 células/mcL).

```receita
RECEITUÁRIO MÉDICO - DPOC ESTÁVEL (GRUPO B / DUPLA BRONCODILATAÇÃO)
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO INALATÓRIO:
1. Brometo de Tiotrópio 2.5mcg inalador Respimat -------- 1 frasco (60 doses)
   Inalar 2 jatos por via inalatória uma vez ao dia, no mesmo horário (LAMA).

1b. Xinafoato de Salmeterol 50mcg pó inalatório --------- 1 inalador (60 doses)
   Inalar 1 dose a cada 12 horas (LABA), completando a dupla broncodilatação do grupo B.

2. Sulfato de Salbutamol 100mcg spray ------------------- 1 frasco
   Inalar 2 jatos com espaçador se falta de ar aguda de resgate.

Orientações Vitais:
- Cessação do tabagismo imediata (medida com maior impacto na sobrevida).
- Vacinação anual contra Influenza, Pneumococo (VPC13 e VPP23) e COVID-19.
```"""
    },
    {
        "id_protocolo": "rinite_alergica_persistente",
        "titulo": "Manejo da Rinite Alérgica Moderada a Grave (Diretrizes ARIA)",
        "cids": ["J30.1", "J30.4"],
        "ciaps": ["R97"],
        "nivel_atencao": "Atencao_Primaria",
        "diretrizes": "Allergic Rhinitis and its Impact on Asthma (ARIA), ASBAI",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Budesonida Spray Nasal", "Loratadina 10mg", "Soro Fisiológico 0.9%"],
        "categoria": "respiratorio",
        "conteudo": """# Diretrizes Clínicas: Rinite Alérgica

## 1. Princípios de Tratamento
* Corticosteroides nasais constituem a primeira linha com maior eficácia para controle de obstrução nasal, espirros e prurido.
* Anti-histamínicos orais de 2ª geração (não sedantes) são adjuvantes de alívio rápido.

```receita
RECEITUÁRIO MÉDICO - RINITE ALÉRGICA MODERADA A GRAVE
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO NASAL:
1. Soro Fisiológico 0.9% frasco 500 mL ------------------ 1 frasco
   Realizar lavagem nasal com 10 a 20 mL em cada narina 2 vezes ao dia.

2. Budesonida spray nasal 50mcg/dose -------------------- 1 frasco (120 doses)
   Aplicar 1 a 2 jatos em cada narina uma vez ao dia pela manhã por pelo menos 30 a 60 dias consecutivos.

USO ORAL:
3. Loratadina 10mg comprimido -------------------------- 1 caixa (12 comprimidos)
   Tomar 1 comprimido por via oral uma vez ao dia se crises de prurido ocular ou espirros frequentes.
```"""
    },

    # ---------------------------------------------------------
    # 4. GASTROENTEROLOGIA
    # ---------------------------------------------------------
    {
        "id_protocolo": "gastrite_drge",
        "titulo": "Manejo da Doença do Refluxo Gastroesofágico (DRGE) e Dispepsia",
        "cids": ["K21.9", "K29.7"],
        "ciaps": ["D84", "D87"],
        "nivel_atencao": "Atencao_Primaria",
        "diretrizes": "Federação Brasileira de Gastroenterologia (FBG), ACG",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Omeprazol 20mg cápsula", "Domperidona 10mg"],
        "categoria": "gastroenterologia",
        "conteudo": """# Diretrizes Clínicas: DRGE e Doença Péptica

## 1. Sinais de Alarme para Endoscopia Digestiva Alta (EDA) Obrigatória
* Idade >= 50 anos com sintomas dispépticos novos;
* Perda ponderal inexplicada;
* Disfagia progressiva ou odinofagia;
* Anemia ferropriva ou evidência de sangramento digestivo (hematêmese/melena);
* Histórico familiar de neoplasia do trato gastrointestinal alto.

```receita
RECEITUÁRIO MÉDICO - DRGE E DISPEPSIA
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Omeprazol 20mg cápsula ------------------------------ 2 caixas (56 cápsulas)
   Tomar 1 cápsula por via oral uma vez ao dia pela manhã em jejum rigoroso, exatamente 30 minutos antes do café da manhã, durante 8 semanas consecutivas.

Orientações Não Farmacológicas:
- Fracionar as refeições e não deitar nas 2 horas seguintes à alimentação.
- Elevação da cabeceira da cama em 15 cm.
- Evitar café, chocolates, frituras, refrigerantes e condimentos em excesso.
```"""
    },
    {
        "id_protocolo": "erradicacao_helicobacter_pylori",
        "titulo": "Erradicação do Helicobacter pylori: Terapia Quádrupla / Tripla Otimizada",
        "cids": ["B96.81", "K25.9"],
        "ciaps": ["D85"],
        "nivel_atencao": "Atencao_Primaria_e_Gastroenterologia",
        "diretrizes": "IV Diretriz Brasileira sobre Infecção por H. pylori (2024), Maastricht VI",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Omeprazol 20mg", "Claritromicina 500mg", "Amoxicilina 500mg"],
        "categoria": "gastroenterologia",
        "conteudo": """# Diretrizes Clínicas: Erradicação de H. pylori

## 1. Duração Otimizada de 14 Dias
* Aumentar o tempo de tratamento de 7 para 14 dias eleva a taxa de erradicação para > 85%.
* Dobrar a dose do IBP para garantir supressão ácida adequada, permitindo maior estabilidade dos antibióticos no estômago.

```receita
RECEITUÁRIO MÉDICO - ERRADICAÇÃO DE HELICOBACTER PYLORI (14 DIAS)
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
- Teste respiratório com ureia marcada ou antígeno fecal após pelo menos 4 semanas do término para comprovação de cura.
```"""
    },
    {
        "id_protocolo": "constipacao_intestinal_cronica",
        "titulo": "Constipação Intestinal Funcional Crônica no Adulto e Idoso",
        "cids": ["K59.0"],
        "ciaps": ["D12"],
        "nivel_atencao": "Atencao_Primaria",
        "diretrizes": "Federação Brasileira de Gastroenterologia (FBG), WGO",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Polietilenoglicol (PEG 4000)", "Lactulose 667mg/mL", "Psyllium"],
        "categoria": "gastroenterologia",
        "conteudo": """# Diretrizes Clínicas: Constipação Crônica

## 1. Escalonamento Terapêutico
* Linha 1: Fibras solúveis (Psyllium) e hidratação (1.5 a 2 L/dia);
* Linha 2: Laxativos osmóticos de escolha segura para uso continuado (Polietilenoglicol - PEG 4000 ou Lactulose);
* Evitar uso crônico de laxativos estimulantes antraquinônicos (sene, cáscara sagrada) pelo risco de catarse colônica e melanose de cólon.

```receita
RECEITUÁRIO MÉDICO - CONSTIPAÇÃO INTESTINAL FUNCIONAL
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Polietilenoglicol 4000 pó (sem eletrólitos) sachê 10g - 2 caixas (30 sachês)
   Dissolver 1 a 2 sachês em um copo de água ou suco e tomar uma vez ao dia pela manhã.

2. Lactulose 667mg/mL xarope --------------------------- 1 frasco (120 mL)
   Tomar 15 a 30 mL por via oral uma vez ao dia se fezes endurecidas.

Orientações:
- Consumir frutas laxativas com casca (mamão, ameixa preta, kiwi) e vegetais folhosos.
- Atender prontamente ao reflexo gastrocólico após as refeições.
```"""
    },
    {
        "id_protocolo": "diarreia_aguda_gastroenterite",
        "titulo": "Gastroenterite Aguda e Diarreia no Adulto e Criança",
        "cids": ["A09", "K52.9"],
        "ciaps": ["D11", "D73"],
        "nivel_atencao": "Atencao_Primaria_e_Urgencia",
        "diretrizes": "Ministério da Saúde do Brasil, OMS",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Sais de Reidratação Oral (SRO)", "Sulfato de Zinco", "Racecadotrila 100mg"],
        "categoria": "gastroenterologia",
        "conteudo": """# Diretrizes Clínicas: Diarreia Aguda

## 1. Regra de Ouro da OMS
* Hidratação precoce com solução salina-glicídica isotônica previne a desidratação e o óbito em mais de 98% dos casos.
* Em crianças, o Zinco oral por 10 a 14 dias reduz a gravidade, duração e episódios diarreicos nos 3 meses subsequentes.
* Antibióticos são contraindicados de rotina; indicados apenas em disenteria grave (sangue e muco visíveis nas fezes) ou suspeita de cólera.

```receita
RECEITUÁRIO MÉDICO - GASTROENTERITE AGUDA
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
- Manter alimentação habitual branda; evitar leite e sucos muito açucarados.
```"""
    },

    # ---------------------------------------------------------
    # 5. ENDOCRINOLOGIA & METABOLISMO
    # ---------------------------------------------------------
    {
        "id_protocolo": "diabetes_mellitus_tipo2",
        "titulo": "Manejo Farmacológico Inicial do Diabetes Mellitus Tipo 2 no SUS",
        "cids": ["E11", "E11.9"],
        "ciaps": ["T90"],
        "nivel_atencao": "Atencao_Primaria",
        "diretrizes": "Diretrizes da Sociedade Brasileira de Diabetes (SBD 2024), ADA",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Cloridrato de Metformina 850mg", "Gliclazida MR 30mg"],
        "categoria": "endocrinologia",
        "conteudo": """# Diretrizes Clínicas: Início do Tratamento do DM2

## 1. Metformina como Terapia Inicial Padrão
* Iniciar com 500 a 850 mg/dia junto à refeição principal e titular gradualmente a cada 14 dias até dose plena de 2000 a 2550 mg/dia.
* Redução esperada de HbA1c: 1.0% a 1.5%.
* Monitorar TFG: Contraindicação formal absoluta se TFG < 30 mL/min/1.73m² (risco de acidose lática).

```receita
RECEITUÁRIO MÉDICO - DIABETES MELLITUS TIPO 2
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Cloridrato de Metformina 850mg comprimido ----------- 2 caixas (60 comprimidos)
   - Primeiros 14 dias: Tomar 1 comprimido por via oral logo após o almoço ou jantar.
   - A partir do 15º dia: Tomar 1 comprimido após o café da manhã e 1 comprimido após o jantar (total 1700 mg/dia).

Orientações:
- Tomar sempre durante ou após as refeições para amenizar desconfortos digestivos.
- Agendar retorno em 3 meses com dosagem de Hemoglobina Glicada (alvo < 7.0%).
```"""
    },
    {
        "id_protocolo": "diabetes_tipo2_associacao_metformina_isglt2",
        "titulo": "Diabetes Tipo 2: Terapia Combinada com Inibidor de SGLT2 (Proteção Cardio-Renal)",
        "cids": ["E11.2", "E11.5"],
        "ciaps": ["T90"],
        "nivel_atencao": "Atencao_Primaria_e_Endocrinologia",
        "diretrizes": "Sociedade Brasileira de Diabetes (SBD 2024), ADA Standards of Care 2024",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Metformina XR 500mg", "Dapagliflozina 10mg", "Empagliflozina 25mg"],
        "categoria": "endocrinologia",
        "conteudo": """# Diretrizes Clínicas: Associação Metformina + iSGLT2

## 1. Benefícios Independentes do Controle Glicêmico
* Redução de hospitalização por insuficiência cardíaca e retardo na progressão da doença renal do diabetes.
* Promove glicosúria osmótica com perda ponderal (~2 a 3 kg) e modesta redução pressórica sistólica (~3 a 5 mmHg).

```receita
RECEITUÁRIO MÉDICO - DIABETES TIPO 2 (PROTEÇÃO CARDIO-RENAL)
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Cloridrato de Metformina 500mg lib. prolongada (XR) -- 2 caixas (60 comprimidos)
   Tomar 2 comprimidos (1000 mg) por via oral juntos após o jantar.

2. Dapagliflozina 10mg comprimido revestido ------------- 1 caixa (30 comprimidos)
   Tomar 1 comprimido por via oral uma vez ao dia pela manhã.

Orientações:
- Manter higiene íntima rigorosa com água após micções para prevenir candidíase urogenital.
- Manter hidratação adequada ao longo do dia.
- Suspender a dapagliflozina em jejum prolongado, vômitos/diarreia ou doença aguda grave e procurar atendimento se náuseas, dor abdominal ou mal-estar intenso (risco de cetoacidose euglicêmica).
- Para efeito glicêmico, TFG >= 45 mL/min; para proteção cardio-renal, pode ser mantida até TFG >= 20 mL/min.
```"""
    },
    {
        "id_protocolo": "hipotireoidismo_primario_levotiroxina",
        "titulo": "Hipotireoidismo Primário no Adulto e Idoso: Manejo com Levotiroxina",
        "cids": ["E03.9", "E03.8"],
        "ciaps": ["T86"],
        "nivel_atencao": "Atencao_Primaria",
        "diretrizes": "Sociedade Brasileira de Endocrinologia e Metabologia (SBEM), ATA",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Levotiroxina Sódica 25mcg / 50mcg / 75mcg / 100mcg"],
        "categoria": "endocrinologia",
        "conteudo": """# Diretrizes Clínicas: Reposição de Levotiroxina

## 1. Posologia e Titulação
* Adulto jovem sem cardiopatia: Dose plena estimada em 1.6 mcg/kg/dia.
* Idosos (> 60 anos) ou portadores de coronariopatia: Iniciar com doses baixas de 12.5 a 25 mcg/dia e titular a cada 6 a 8 semanas para evitar precipitação de arritmias ou angina.
* Coleta de TSH de controle após 6 a 8 semanas da dose estável (alvo de TSH: 0.5 a 4.0 mUI/L).

```receita
RECEITUÁRIO MÉDICO - HIPOTIREOIDISMO PRIMÁRIO
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Levotiroxina Sódica 50mcg comprimido ----------------- 1 caixa (30 comprimidos)
   Tomar 1 comprimido por via oral uma vez ao dia pela manhã em jejum estrito com água, pelo menos 30 a 60 minutos antes do café da manhã.

Orientações Mandatórias:
- Não tomar junto a café, leite, suplementos de cálcio ou sulfato ferroso (aguardar pelo menos 4 horas após a levotiroxina para ingerir ferro ou cálcio).
```"""
    },
    {
        "id_protocolo": "gota_artrite_urica_aguda_e_profilaxia",
        "titulo": "Artrite Gotosa Aguda (Crise) e Hipouricemiantes Crônicos (Alopurinol)",
        "cids": ["M10.0", "M10.9"],
        "ciaps": ["T92"],
        "nivel_atencao": "Atencao_Primaria_e_Reumatologia",
        "diretrizes": "Sociedade Brasileira de Reumatologia (SBR), ACR",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Colchicina 0.5mg", "Alopurinol 100mg / 300mg", "Dipirona 500mg"],
        "categoria": "reumatologia",
        "conteudo": """# Diretrizes Clínicas: Manejo da Gota

## 1. Crise Aguda de Podagra (1ª Metatarsofalângica)
* Colchicina: 1 mg imediatamente, seguido de 0.5 mg após 1 hora (dose total de 1.5 mg no 1º dia); manter 0.5 mg 12/12h até resolução.
* **REGRA FUNDAMENTAL:** NÃO suspender Alopurinol já em uso durante a crise (a variação dos níveis séricos de ácido úrico perpetua a precipitação de cristais de monourato). O início de hipouricemiante pode ocorrer durante ou após a crise (ACR 2020), sempre com profilaxia anti-inflamatória (colchicina 0.5 mg/dia) por 3 a 6 meses e dose inicial baixa (100 mg/dia).
* Colchicina: ajustar em insuficiência renal e evitar com claritromicina (inibidor de CYP3A4/P-gp).

```receita
RECEITUÁRIO MÉDICO - CRISE AGUDA DE GOTA (ARTRITE ÚRICA)
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
- Evitar cerveja, frutos do mar e carnes vermelhas em excesso.
```"""
    },
    {
        "id_protocolo": "osteoporose_pos_menopausa_alendronato",
        "titulo": "Osteoporose Pós-Menopausa: Terapia com Bisfosfonato (Alendronato)",
        "cids": ["M81.0"],
        "ciaps": ["L95"],
        "nivel_atencao": "Atencao_Primaria_e_Ginecologia",
        "diretrizes": "Sociedade Brasileira de Reumatologia (SBR), NOF",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Alendronato de Sódio 70mg", "Carbonato de Cálcio + Vitamina D"],
        "categoria": "reumatologia",
        "conteudo": """# Diretrizes Clínicas: Osteoporose

## 1. Rastreamento e Indicação
* Mulheres >= 65 anos ou com fratura por fragilidade óssea prévia;
* Critério Densitométrico: T-score <= -2.5 em coluna lombar, colo de fêmur ou fêmur total.

```receita
RECEITUÁRIO MÉDICO - OSTEOPOROSE
Paciente: [Nome da Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Alendronato de Sódio 70mg comprimido ----------------- 1 caixa (4 comprimidos)
   Tomar 1 comprimido por via oral uma vez por semana (ex: todo domingo pela manhã) em jejum estrito com 1 copo cheio de água pura.

2. Carbonato de Cálcio 500mg + Vitamina D3 400 UI ------ 1 frasco (60 comprimidos)
   Tomar 1 comprimido por via oral após o almoço diariamente.

INSTRUÇÃO DE SEGURANÇA CRÍTICA:
- Após engolir o comprimido de alendronato com água, PERMANECER EM PÉ OU SENTADO POR PELO MENOS 30 MINUTOS (NUNCA DEITAR) para evitar refluxo e esofagite erosiva grave.
```"""
    },

    # ---------------------------------------------------------
    # 6. NEUROLOGIA & SAÚDE MENTAL
    # ---------------------------------------------------------
    {
        "id_protocolo": "lombalgia_aguda",
        "titulo": "Abordagem da Lombalgia Mecânica Aguda (Lumbago)",
        "cids": ["M54.5"],
        "ciaps": ["L03"],
        "nivel_atencao": "Atencao_Primaria",
        "diretrizes": "Ministério da Saúde do Brasil, NICE, ACP",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Dipirona Monoidratada 500mg", "Ciclobenzaprina 5mg"],
        "categoria": "reumatologia",
        "conteudo": """# Diretrizes Clínicas: Lombalgia Aguda

## 1. Rastreamento de Red Flags
* Síndrome da Cauda Equina (anestesia em sela, incontinência urinária/fecal - emergência cirúrgica);
* Suspeita de fratura ou neoplasia subjacente.
* Desestímulo formal ao repouso no leito: movimentação acelera a resolução funcional.

```receita
RECEITUÁRIO MÉDICO - LOMBALGIA MECÂNICA AGUDA
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
- Calor local morno por 20 minutos na região lombar 2 a 3 vezes ao dia.
```"""
    },
    {
        "id_protocolo": "cefaleia_tensional_enxaqueca",
        "titulo": "Abordagem da Cefaleia Tensional e Enxaqueca na Atenção Primária",
        "cids": ["R51", "G43.9", "G44.2"],
        "ciaps": ["N01", "N89"],
        "nivel_atencao": "Atencao_Primaria_e_Pronto_Atendimento",
        "diretrizes": "Sociedade Brasileira de Cefaleia (SBCe), IHS",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Dipirona Monoidratada 500mg", "Metoclopramida 10mg"],
        "categoria": "neurologia",
        "conteudo": """# Diretrizes Clínicas: Cefaleia Aguda e Sinais SNOOP

## 1. Sinais de Alarme SNOOP
* S (Systemic): Febre, perda ponderal, câncer, imunossupressão.
* N (Neurologic): Déficit focal, alteração pupilar, papiledema.
* O (Onset): Início súbito explosivo ('thunderclap').
* O (Older): Início após 50 anos de idade.
* P (Pattern): Mudança súbita no padrão de dor.

```receita
RECEITUÁRIO MÉDICO - CEFALEIA / ENXAQUECA AGUDA
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
- Limitar o uso de analgésicos a no máximo 2 dias por semana para prevenir cefaleia por rebote de medicação.
```"""
    },
    {
        "id_protocolo": "profilaxia_enxaqueca_cronica",
        "titulo": "Tratamento Profilático da Enxaqueca Frequente ou Crônica",
        "cids": ["G43.3", "G43.9"],
        "ciaps": ["N89"],
        "nivel_atencao": "Atencao_Primaria_e_Neurologia",
        "diretrizes": "Sociedade Brasileira de Cefaleia (SBCe), AAN",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Cloridrato de Propranolol 40mg", "Topiramato 25mg", "Amitriptilina 25mg"],
        "categoria": "neurologia",
        "conteudo": """# Diretrizes Clínicas: Profilaxia de Enxaqueca

## 1. Indicação de Terapia Preventiva
* 3 ou mais episódios incapacitantes de enxaqueca ao mês;
* Crises que não respondem à medicação abortiva ou com uso abusivo de analgésicos (> 10 a 15 dias/mês).

```receita
RECEITUÁRIO MÉDICO - PROFILAXIA DE ENXAQUECA
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Cloridrato de Propranolol 40mg comprimido ----------- 1 caixa (60 comprimidos)
   Tomar 1/2 comprimido (20 mg) 12/12h por 7 dias; aumentar para 1 comprimido (40 mg) a cada 12 horas continuamente.
   (Contraindicado em portadores de asma ou bradicardia sintomática).

Orientações:
- Preencher o 'Diário da Cefaleia' anotando dias com dor e possíveis gatilhos alimentares.
- O efeito preventivo pleno manifesta-se após 4 a 8 semanas de uso regular diário.
```"""
    },
    {
        "id_protocolo": "depressao_ansiedade_atencao_primaria",
        "titulo": "Transtorno Depressivo Maior e Ansiedade na Atenção Primária (ISRS)",
        "cids": ["F32.1", "F41.1"],
        "ciaps": ["P76", "P74"],
        "nivel_atencao": "Atencao_Primaria",
        "diretrizes": "Guia mhGAP da OMS, Associação Brasileira de Psiquiatria (ABP), CANMAT",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Cloridrato de Sertralina 50mg", "Oxalato de Escitalopram 10mg"],
        "categoria": "saude_mental",
        "conteudo": """# Diretrizes Clínicas: Depressão e Ansiedade na APS

## 1. Princípios Farmacológicos
* Primeira linha: Inibidores Seletivos da Recaptação de Serotonina (ISRS) pela tolerabilidade e segurança cardiovascular.
* **Período de Latência Terapêutica:** O efeito antidepressivo consistente inicia após 2 a 4 semanas. Nos primeiros 7 a 10 dias pode haver aumento transitório de ansiedade ou náuseas leves.

```receita
RECEITUÁRIO MÉDICO - DEPRESSÃO E ANSIEDADE NA APS
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
- Retorno agendado em 3 a 4 semanas para avaliação de resposta clínica e tolerabilidade.
```"""
    },
    {
        "id_protocolo": "vertigem_posicional_paroxistica_labirintopatia",
        "titulo": "Abordagem da Vertigem Posicional Paroxística Benigna (VPPB) e Labirintite",
        "cids": ["H81.1", "H81.0"],
        "ciaps": ["H82"],
        "nivel_atencao": "Atencao_Primaria_e_Pronto_Atendimento",
        "diretrizes": "Academia Americana de Otorrinolaringologia (AAO-HNS), ABORL-CCF",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Dimenidrinato + Piridoxina", "Dicloridrato de Flunarizina 10mg"],
        "categoria": "neurologia",
        "conteudo": """# Diretrizes Clínicas: Vertigem Aguda

## 1. Diferenciação Crucial
* **VPPB:** Crises de vertigem giratória de curta duração (< 1 minuto) desencadeadas por movimentos da cabeça.
  - *Tratamento definitivo:* Manobras de reposicionamento canalicular (Manobra de Epley) com taxa de sucesso > 80% sem necessidade de medicação contínua.
* **Labirintite / Neuronite Vestibular:** Vertigem contínua incapacitante de dias com náuseas/vômitos intensos. Supressores vestibulares apenas nas primeiras 48 a 72 horas para não bloquear a compensação central.

```receita
RECEITUÁRIO MÉDICO - CRISES AGUDAS DE VERTIGEM
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. Dimenidrinato 50mg + Cloridrato de Piridoxina 10mg -- 1 caixa (20 comprimidos)
   Tomar 1 comprimido por via oral a cada 8 horas apenas durante as crises agudas de tontura giratória (limitar a 3 a 5 dias).

Orientações:
- Realizar a Manobra de Epley orientada pelo profissional de saúde.
- Evitar movimentos bruscos de rotação da cabeça e levantar-se devagar da cama.
```"""
    },

    # ---------------------------------------------------------
    # 7. URGÊNCIA & PEDIATRIA
    # ---------------------------------------------------------
    {
        "id_protocolo": "anafilaxia_reacao_alergica_grave",
        "titulo": "Protocolo de Emergência: Anafilaxia e Reações Alérgicas Graves",
        "cids": ["T78.2", "T78.0"],
        "ciaps": ["A92"],
        "nivel_atencao": "Urgencia_Emergencia",
        "diretrizes": "World Allergy Organization (WAO), ASBAI, AHA",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Epinefrina (Adrenalina 1:1000)", "Hidrocortisona", "Difenidramina"],
        "categoria": "urgencia",
        "conteudo": """# Protocolo de Emergência: Anafilaxia

## 1. Conduta Vital Imediata
* **ADRENALINA INTRAMUSCULAR É O MEDICAMENTO DE ESCOLHA IMEDIATO.**
* Dose Adulto: 0.5 mg (0.5 mL de solução 1:1000) IM no terço médio anterolateral da coxa (vasto lateral).
* Dose Pediátrica: 0.01 mg/kg (máximo 0.3 mg) IM no vasto lateral da coxa.
* Pode ser repetida a cada 5 a 15 minutos se resposta insuficiente. Corticoides e anti-histamínicos são fármacos de segunda linha e NUNCA devem atrasar a administração da adrenalina.

```receita
PRESCRIÇÃO HOSPITALAR DE EMERGÊNCIA - ANAFILAXIA
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO INTRAMUSCULAR IMEDIATO:
1. Epinefrina (Adrenalina) 1 mg/mL (1:1000) ------------- 1 ampola
   Aplicar 0.5 mL (0.5 mg) por via intramuscular profunda no vasto lateral da coxa IMEDIATAMENTE.

USO INTRAVENOSO:
2. Soro Fisiológico 0.9% bolsa 1000 mL ------------------ 2 bolsas
   Infundir 1000 a 2000 mL em fluxo rápido para expansão volêmica.

3. Succinato Sódico de Hidrocortisona 500mg frasco-ampola - 1 frasco
   Diluir em 20 mL de AD e infundir por via IV lenta (dose de manutenção anti-inflamatória pós-crise).
```"""
    },
    {
        "id_protocolo": "desidratacao_pediatrica_plano_b_c",
        "titulo": "Manejo da Desidratação Pediátrica (Planos A, B e C da OMS)",
        "cids": ["E86", "A09"],
        "ciaps": ["T11", "D73"],
        "nivel_atencao": "Atencao_Primaria_e_Urgencia",
        "diretrizes": "Organização Mundial da Saúde (OMS), Ministério da Saúde do Brasil, SBP",
        "data_revisao": "2026-10-26",
        "farmacos_principais": ["Sais de Reidratação Oral (SRO)", "Sulfato de Zinco 20mg", "Soro Fisiológico / Ringer Lactato"],
        "categoria": "pediatria",
        "conteudo": """# Diretrizes Clínicas: Desidratação na Infância

## 1. Avaliação do Grau de Desidratação
* **Sem Desidratação (Plano A):** Domiciliar. Oferecer líquidos adicionais e SRO após cada evacuação líquida.
* **Desidratação Leve a Moderada (Plano B):** Unidade de saúde. TRO (Terapia de Reidratação Oral) com SRO: 50 a 100 mL/kg em 4 a 6 horas em colheres/copinhos.
* **Desidratação Grave com Choque (Plano C):** Hidratação venosa rápida com Solução Fisiológica 0.9% ou Ringer Lactato (100 mL/kg fracionado).

```receita
RECEITUÁRIO MÉDICO - DESIDRATAÇÃO PEDIÁTRICA (PLANO A + ZINCO)
Paciente: [Nome da Criança] | Idade: [Ex: 1 ano]
Data: [Data do Atendimento]

USO ORAL:
1. Sais de Reidratação Oral (SRO) sachê 27.9g ------------ 6 envelopes
   Diluir 1 envelope em 1 litro de água filtrada. Oferecer 50 a 100 mL aos poucos com colher após cada evacuação diarreica.

2. Sulfato de Zinco 10mg/mL solução oral (ou 20mg comp.) - 1 frasco
   Dar 20 mg por via oral uma vez ao dia durante 14 dias consecutivos (10 mg/dia se menor de 6 meses).
   (Medida fundamental recomendada pela OMS para acelerar a regeneração dos enterócitos intestinais).
```"""
    },
]

CAMINHO_TS_PROTOCOLOS = os.path.abspath(
    os.path.join(diretorio_atual, "..", "frontend_ui", "src", "data", "protocolos_gerados.ts")
)

PADRAO_BLOCO_RECEITA = r"```receita\n(.*?)```"


def separar_corpo_e_receita(conteudo: str) -> tuple:
    """Separa o texto explicativo (sem o título H1) do bloco de receita copiável."""
    correspondencia = re.search(PADRAO_BLOCO_RECEITA, conteudo, flags=re.DOTALL)
    receita = correspondencia.group(1).strip() if correspondencia else ""
    corpo = re.sub(PADRAO_BLOCO_RECEITA, "", conteudo, flags=re.DOTALL).strip()
    corpo = re.sub(r"^# .*\n+", "", corpo).strip()
    return corpo, receita


def exportar_protocolos_typescript() -> int:
    """Gera o módulo TypeScript do frontend a partir da mesma fonte dos arquivos Markdown."""
    protocolos_ts = []
    farmacos = {}
    categorias = {}
    for p in TODOS_PROTOCOLOS:
        corpo, receita = separar_corpo_e_receita(p["conteudo"])
        protocolos_ts.append({
            "id_protocolo": p["id_protocolo"],
            "titulo": p["titulo"],
            "cids_relacionados": p["cids"],
            "ciaps_relacionados": p["ciaps"],
            "nivel_atencao": p["nivel_atencao"],
            "data_revisao": p["data_revisao"],
            "status_revisao_clinica": STATUS_REVISAO_CLINICA,
            "conteudo_markdown": corpo,
            "bloco_prescricao_copiavel": receita,
        })
        farmacos[p["id_protocolo"]] = p["farmacos_principais"]
        categorias[p["id_protocolo"]] = p["categoria"]

    cabecalho = (
        "// ARQUIVO GERADO por etl_pipeline/gerador_receitas_completas.py - NÃO EDITAR MANUALMENTE.\n"
        "import { ProtocoloClinico } from '../types';\n\n"
    )
    conteudo_ts = (
        cabecalho
        + "export const PROTOCOLOS_GERADOS: ProtocoloClinico[] = "
        + json.dumps(protocolos_ts, ensure_ascii=False, indent=2)
        + ";\n\nexport const FARMACOS_POR_PROTOCOLO: Record<string, string[]> = "
        + json.dumps(farmacos, ensure_ascii=False, indent=2)
        + ";\n\nexport const CATEGORIAS_POR_PROTOCOLO: Record<string, string> = "
        + json.dumps(categorias, ensure_ascii=False, indent=2)
        + ";\n"
    )
    with open(CAMINHO_TS_PROTOCOLOS, "w", encoding="utf-8") as f:
        f.write(conteudo_ts)
    print(f"Módulo TypeScript de {len(protocolos_ts)} protocolos exportado em: {CAMINHO_TS_PROTOCOLOS}")
    return len(protocolos_ts)


def salvar_todos_protocolos_markdown() -> int:
    """Cria e persiste todos os 45 arquivos Markdown no diretório oficial."""
    os.makedirs(DIRETORIO_PROTOCOLOS, exist_ok=True)
    salvos = 0

    for p in TODOS_PROTOCOLOS:
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
diretrizes_referencia: "{p.get('diretrizes', 'Ministério da Saúde / OMS')}"
data_revisao: "{p['data_revisao']}"
status_revisao_clinica: "{STATUS_REVISAO_CLINICA}"
---

{p['conteudo'].strip()}
"""
        with open(caminho_completo, "w", encoding="utf-8") as f:
            f.write(documento)
        salvos += 1

    print(f"Total de {salvos} protocolos e receitas médicas salvos em: {DIRETORIO_PROTOCOLOS}")
    return salvos


def sincronizar_fts5_completo(caminho_banco: str = None) -> int:
    """Indexa todos os arquivos .md do diretório na tabela virtual FTS5."""
    if caminho_banco is None:
        caminho_banco = obter_caminho_padrao_banco()

    conexao = sqlite3.connect(caminho_banco)
    indexados = 0

    with conexao:
        conexao.execute("DELETE FROM indice_busca_fts WHERE tipo_registro = 'protocolo';")

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
            conteudo_textual = f"{id_protocolo} {titulo} {' '.join(cids)} {' '.join(ciaps)} {corpo} receita prescricao receituario conduta"

            conexao.execute("""
                INSERT INTO indice_busca_fts(tipo_registro, id_referencia, titulo_primario, subtitulo, conteudo_textual)
                VALUES ('protocolo', ?, ?, ?, ?);
            """, (id_protocolo, titulo, subtitulo, conteudo_textual))
            indexados += 1

    conexao.close()
    print(f"Total de {indexados} protocolos sincronizados e indexados no FTS5 SQLite.")
    return indexados


if __name__ == "__main__":
    salvar_todos_protocolos_markdown()
    exportar_protocolos_typescript()
    sincronizar_fts5_completo()
