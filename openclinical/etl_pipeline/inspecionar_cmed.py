import os
import csv

cmed = os.path.join(os.path.dirname(__file__), "dados_publicos", "TA_PRECO_MEDICAMENTO.csv")
with open(cmed, "r", encoding="latin1") as f:
    leitor = csv.reader(f, delimiter=";")
    cabecalho = next(leitor)
    print("Colunas CMED:")
    for i, col in enumerate(cabecalho):
        col_limpa = col.encode('ascii', 'replace').decode()
        print(f"{i}: {col_limpa}")
    
    print("\nExemplo de Linha 1:")
    linha1 = next(leitor)
    for col, val in zip(cabecalho, linha1):
        c = col.encode('ascii', 'replace').decode()
        v = val.encode('ascii', 'replace').decode()
        print(f"{c}: {v}")
