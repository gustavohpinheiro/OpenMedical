---
# MODELO DE RECEITA - não edite este arquivo; crie uma cópia com:
#   python openclinical/etl_pipeline/cadastrar_receitas.py --nova nome_da_receita
# Linhas que começam com "#" dentro deste cabeçalho são comentários (pode apagá-las na cópia).
# Troque TODO texto "PREENCHER" por conteúdo real tirado da diretriz citada. Não invente doses.
#
# id_protocolo: igual ao nome do arquivo sem ".md"; minúsculas sem acento, números e "_".
#   Ex.: arquivo "otite_externa_aguda.md" -> id_protocolo: "otite_externa_aguda"
id_protocolo: ""
# titulo: nome exibido na lista de Receitas & Prescrições.
titulo: "PREENCHER: título da receita"
# categoria: define em qual filtro a receita aparece. Use exatamente uma destas:
#   infectologia, ginecologia, cardiovascular, nefrologia, respiratorio, gastroenterologia,
#   endocrinologia, reumatologia, neurologia, saude_mental, urgencia, pediatria
categoria: "PREENCHER"
# cids_relacionados: CID-10 entre aspas duplas, separados por vírgula. Ex.: ["J02.0", "J03.9"]
cids_relacionados: ["PREENCHER"]
# ciaps_relacionados: CIAP-2 (letra + 2 dígitos). Ex.: ["R74"]. Se não houver, use []
ciaps_relacionados: ["PREENCHER"]
# farmacos_principais: fármacos da receita, usados na busca e no filtro "Dor & Febre".
#   Ex.: ["Amoxicilina 500mg", "Dipirona 500mg"]
farmacos_principais: ["PREENCHER"]
# nivel_atencao: palavras sem acento separadas por "_". Ex.: Atencao_Primaria,
#   Atencao_Primaria_e_Urgencia, Urgencia_e_Emergencia
nivel_atencao: "Atencao_Primaria"
# diretrizes_referencia: fonte oficial usada (PCDT/MS, sociedade médica, OMS, NICE...). Obrigatório.
diretrizes_referencia: "PREENCHER: diretriz oficial consultada"
# data_revisao: data da última revisão, formato AAAA-MM-DD.
data_revisao: "PREENCHER"
# status_revisao_clinica: mantenha "pendente_revisao_por_profissional_habilitado" até que um
#   profissional habilitado revise; só então troque para "revisado_por_profissional_habilitado".
status_revisao_clinica: "pendente_revisao_por_profissional_habilitado"
# ordem_catalogo (opcional): posição na lista (número inteiro sem aspas, sem repetir).
#   Sem este campo a receita entra no fim da lista, em ordem alfabética.
# ordem_catalogo: 46
---

# Diretrizes Clínicas: PREENCHER nome da condição

## 1. Critérios Diagnósticos / Avaliação
* PREENCHER: critérios clínicos, escores e sinais de alarme conforme a diretriz citada.

## 2. Conduta Terapêutica
* PREENCHER: primeira linha, alternativas, ajustes (renal, pediatria, gestação) e contraindicações.

```receita
RECEITUÁRIO MÉDICO - PREENCHER NOME DA CONDIÇÃO
Paciente: [Nome do Paciente]
Data: [Data do Atendimento]

USO ORAL:
1. PREENCHER Fármaco + concentração + forma ------------ quantidade (ex.: 1 caixa com 20 comprimidos)
   PREENCHER posologia completa: dose, via, intervalo e duração (ex.: "a cada 8 horas por 7 dias").

Orientações:
- PREENCHER: orientações ao paciente e sinais de alarme para retorno.
```
