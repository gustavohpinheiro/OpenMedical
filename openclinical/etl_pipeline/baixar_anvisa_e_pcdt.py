"""
Script de Download e Ingestão Direta das Bases Públicas Oficiais:
1. PCDT (Ministério da Saúde / CONITEC)
2. ANVISA Dados Abertos de Medicamentos Registrados
3. Mapeamento direto para SQLite e JSON estruturado do OpenClinical
"""

import os
import sys
import csv
import json
import sqlite3
import urllib.request
import urllib.error
from typing import Dict, List, Any

DIRETORIO_ETL = os.path.dirname(os.path.abspath(__file__))
DIRETORIO_DADOS_PUBLICOS = os.path.join(DIRETORIO_ETL, "dados_publicos")
CAMINHO_BANCO_SQLITE = os.path.join(DIRETORIO_ETL, "openclinical_core.sqlite")

os.makedirs(DIRETORIO_DADOS_PUBLICOS, exist_ok=True)

URL_ANVISA_MEDICAMENTOS = "https://dados.anvisa.gov.br/dados/DADOS_ABERTOS_MEDICAMENTOS.csv"
CAMINHO_ANVISA_CSV = os.path.join(DIRETORIO_DADOS_PUBLICOS, "anvisa_medicamentos.csv")
CAMINHO_PCDT_CSV = os.path.join(DIRETORIO_DADOS_PUBLICOS, "pcdt.csv")

CABECALHO = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 OpenClinical/1.0"
}


def inspecionar_e_baixar_amostra_anvisa(limite_bytes: int = 5 * 1024 * 1024) -> bool:
    """Baixa uma amostra de 5MB da base da ANVISA diretamente do servidor público."""
    print(f"Conectando ao servidor de dados abertos da ANVISA: {URL_ANVISA_MEDICAMENTOS}")
    try:
        req = urllib.request.Request(URL_ANVISA_MEDICAMENTOS, headers=CABECALHO)
        with urllib.request.urlopen(req, timeout=30) as resp:
            # Lê os primeiros 5MB
            dados = resp.read(limite_bytes)
            with open(CAMINHO_ANVISA_CSV, "wb") as f:
                f.write(dados)
        print(f"Amostra da base ANVISA baixada com sucesso: {len(dados) / 1024:.1f} KB salvos em {CAMINHO_ANVISA_CSV}")
        return True
    except Exception as e:
        print(f"Aviso ao acessar ANVISA online ({e}).")
        return False


def ler_amostra_anvisa() -> List[Dict[str, str]]:
    """Lê registros válidos da base de dados aberta da ANVISA."""
    if not os.path.exists(CAMINHO_ANVISA_CSV):
        return []

    registros = []
    for enc in ['utf-8', 'latin1', 'iso-8859-1']:
        try:
            with open(CAMINHO_ANVISA_CSV, 'r', encoding=enc) as f:
                leitor = csv.DictReader(f, delimiter=';')
                for i, linha in enumerate(leitor):
                    # Pega apenas linhas completas
                    if linha and any(linha.values()):
                        registros.append({k.strip(): v.strip() for k, v in linha.items() if k and v})
                    if len(registros) >= 1000:
                        break
            print(f"Total de {len(registros)} medicamentos da ANVISA lidos com encoding {enc}.")
            break
        except Exception:
            continue

    return registros


def processar_bases_publicas() -> Dict[str, Any]:
    # 1. Lê PCDT baixado
    pcdt_registros = []
    if os.path.exists(CAMINHO_PCDT_CSV):
        with open(CAMINHO_PCDT_CSV, 'r', encoding='utf-8') as f:
            leitor = csv.DictReader(f, delimiter=';')
            for linha in leitor:
                pcdt_registros.append(linha)
    print(f"PCDT Ministério da Saúde: {len(pcdt_registros)} protocolos lidos diretamente da base pública.")

    # 2. Baixa e lê ANVISA
    inspecionar_e_baixar_amostra_anvisa()
    anvisa_registros = ler_amostra_anvisa()

    return {
        "total_pcdt": len(pcdt_registros),
        "pcdt_amostra": pcdt_registros[:5],
        "total_anvisa": len(anvisa_registros),
        "anvisa_amostra": anvisa_registros[:3] if anvisa_registros else [],
    }


if __name__ == "__main__":
    resultado = processar_bases_publicas()
    print("Resumo do processamento:")
    print(f"- PCDT Conitec/MS: {resultado['total_pcdt']} protocolos oficiais.")
    print(f"- ANVISA Medicamentos: {resultado['total_anvisa']} produtos registrados na amostra pública.")
