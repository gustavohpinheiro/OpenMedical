"""
Módulo de Ingestão e Download Direto de Bases Públicas de Saúde (SUS / PCDT / ANVISA / OMS)
Baixa as bases públicas oficiais, extrai os registros e os compila para o OpenClinical.
"""

import os
import sys
import zipfile
import csv
import json
import sqlite3
import urllib.request
import urllib.error
from typing import List, Dict, Any, Optional

DIRETORIO_ETL = os.path.dirname(os.path.abspath(__file__))
DIRETORIO_DADOS_PUBLICOS = os.path.join(DIRETORIO_ETL, "dados_publicos")
CAMINHO_BANCO_SQLITE = os.path.join(DIRETORIO_ETL, "openclinical_core.sqlite")
DIRETORIO_PROTOCOLOS_MD = os.path.abspath(os.path.join(DIRETORIO_ETL, "..", "clinical_content", "protocolos"))

URL_PCDT_CSV_ZIP = "https://s3.sa-east-1.amazonaws.com/ckan.saude.gov.br/CONITEC/csv/pcdt.csv.zip"
URL_ANVISA_DADOS_ABERTOS = "https://dados.anvisa.gov.br/dados/DADOS_ABERTOS_MEDICAMENTOS.csv"

CABECALHO_USER_AGENT = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 OpenClinical/1.0"
}


def garantir_diretorios() -> None:
    os.makedirs(DIRETORIO_DADOS_PUBLICOS, exist_ok=True)
    os.makedirs(DIRETORIO_PROTOCOLOS_MD, exist_ok=True)


def baixar_arquivo_com_progresso(url: str, caminho_destino: str, timeout_segundos: int = 30) -> bool:
    """Baixa um arquivo público via HTTP/HTTPS de forma segura."""
    print(f"Iniciando download de: {url}")
    print(f"Destino: {caminho_destino}")
    try:
        req = urllib.request.Request(url, headers=CABECALHO_USER_AGENT)
        with urllib.request.urlopen(req, timeout=timeout_segundos) as resposta:
            conteudo = resposta.read()
            with open(caminho_destino, "wb") as f_out:
                f_out.write(conteudo)
        tamanho_kb = os.path.getsize(caminho_destino) / 1024
        print(f"Download concluído com sucesso ({tamanho_kb:.1f} KB).")
        return True
    except Exception as e:
        print(f"Aviso/Falha ao baixar {url}: {e}")
        return False


def extrair_zip(caminho_zip: str, pasta_extracao: str) -> List[str]:
    """Extrai arquivos de um arquivo .zip e retorna a lista de arquivos descompactados."""
    arquivos_extraidos = []
    try:
        with zipfile.ZipFile(caminho_zip, 'r') as zf:
            zf.extractall(pasta_extracao)
            arquivos_extraidos = zf.namelist()
            print(f"Arquivo ZIP extraído com sucesso: {arquivos_extraidos}")
    except Exception as e:
        print(f"Erro ao descompactar {caminho_zip}: {e}")
    return arquivos_extraidos


def ler_e_processar_csv_pcdt(caminho_csv: str) -> List[Dict[str, Any]]:
    """Lê diretamente o CSV oficial do PCDT (Ministério da Saúde / CONITEC)."""
    registros: List[Dict[str, Any]] = []
    if not os.path.exists(caminho_csv):
        print(f"Arquivo CSV não encontrado: {caminho_csv}")
        return registros

    # O CSV do governo costuma usar ';' ou ',' e encoding utf-8 ou iso-8859-1 / latin1
    for codificacao in ['utf-8', 'latin1', 'iso-8859-1', 'cp1252']:
        try:
            with open(caminho_csv, 'r', encoding=codificacao) as f:
                amostra = f.read(4096)
                f.seek(0)
                delimitador = ';' if ';' in amostra else ','
                leitor = csv.DictReader(f, delimiter=delimitador)
                for linha in leitor:
                    # Normaliza chaves
                    linha_limpa = {k.strip().lower(): v.strip() if isinstance(v, str) else v for k, v in linha.items() if k}
                    if linha_limpa:
                        registros.append(linha_limpa)
            print(f"CSV processado com sucesso usando codificação {codificacao}. Total de linhas: {len(registros)}")
            break
        except UnicodeDecodeError:
            continue
        except Exception as e:
            print(f"Erro com codificação {codificacao}: {e}")
            continue

    return registros


def carregar_dados_publicos_completos() -> Dict[str, Any]:
    """
    Executa o fluxo completo:
    1. Baixa o PCDT oficial do Ministério da Saúde
    2. Extrai e carrega
    3. Retorna estrutura com todos os protocolos públicos mapeados
    """
    garantir_diretorios()
    caminho_zip_pcdt = os.path.join(DIRETORIO_DADOS_PUBLICOS, "pcdt.csv.zip")
    caminho_csv_pcdt = os.path.join(DIRETORIO_DADOS_PUBLICOS, "pcdt.csv")

    baixado = False
    if not os.path.exists(caminho_csv_pcdt):
        baixado = baixar_arquivo_com_progresso(URL_PCDT_CSV_ZIP, caminho_zip_pcdt, timeout_segundos=40)
        if baixado and os.path.exists(caminho_zip_pcdt):
            extrair_zip(caminho_zip_pcdt, DIRETORIO_DADOS_PUBLICOS)

    registros_pcdt = []
    if os.path.exists(caminho_csv_pcdt):
        registros_pcdt = ler_e_processar_csv_pcdt(caminho_csv_pcdt)
    else:
        # Procura qualquer arquivo CSV extraído na pasta
        for f in os.listdir(DIRETORIO_DADOS_PUBLICOS):
            if f.endswith(".csv"):
                caminho = os.path.join(DIRETORIO_DADOS_PUBLICOS, f)
                print(f"Encontrado CSV alternativo: {caminho}")
                registros_pcdt = ler_e_processar_csv_pcdt(caminho)
                if registros_pcdt:
                    break

    print(f"Total de registros públicos lidos diretamente do PCDT: {len(registros_pcdt)}")
    return {
        "pcdt": registros_pcdt,
        "total_pcdt": len(registros_pcdt),
        "status": "sucesso" if registros_pcdt else "fallback_disponivel"
    }


if __name__ == "__main__":
    resultado = carregar_dados_publicos_completos()
    print(f"Resultado da carga pública: {resultado['total_pcdt']} registros.")
