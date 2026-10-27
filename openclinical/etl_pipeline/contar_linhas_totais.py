import os

anvisa = os.path.join(os.path.dirname(__file__), "dados_publicos", "DADOS_ABERTOS_MEDICAMENTOS.csv")
cmed = os.path.join(os.path.dirname(__file__), "dados_publicos", "TA_PRECO_MEDICAMENTO.csv")

with open(anvisa, "r", encoding="latin1") as f:
    linhas_anvisa = sum(1 for _ in f)

with open(cmed, "r", encoding="latin1") as f:
    linha_cmed1 = f.readline()
    linhas_cmed = 1 + sum(1 for _ in f)

print(f"Total de registros na base completa ANVISA: {linhas_anvisa:,} linhas.")
print(f"Total de registros na base completa CMED: {linhas_cmed:,} linhas.")
print("Cabeçalho CMED:")
print(linha_cmed1.strip().split(";")[:10])
