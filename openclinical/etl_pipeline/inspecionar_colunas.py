import os
import csv

caminho = os.path.join(os.path.dirname(__file__), "dados_publicos", "anvisa_medicamentos.csv")
with open(caminho, "r", encoding="latin1") as f:
    linha1 = f.readline()
    print("Cabeçalho ANVISA:")
    print(linha1.strip().split(";"))
    
    for i in range(3):
        linha = f.readline()
        print(f"Linha {i+1}:")
        print(linha.strip().split(";")[:8])
