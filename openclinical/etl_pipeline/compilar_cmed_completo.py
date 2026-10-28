"""
Compilador Completo da Base CMED / ANVISA (26.642 Medicamentos e Apresentações Comerciais)
Lê diretamente de dados_publicos/TA_PRECO_MEDICAMENTO.csv, gera modelos de receita médica
e persiste em lote no SQLite com índice virtual FTS5 BM25.
"""

import os
import sys
import csv
import sqlite3
import time
from typing import List, Tuple

DIRETORIO_ETL = os.path.dirname(os.path.abspath(__file__))
DIRETORIO_DADOS = os.path.join(DIRETORIO_ETL, "dados_publicos")
CAMINHO_CMED = os.path.join(DIRETORIO_DADOS, "TA_PRECO_MEDICAMENTO.csv")
CAMINHO_BANCO = os.path.join(DIRETORIO_ETL, "openclinical_core.sqlite")
CAMINHO_BANCO_DESKTOP = os.path.abspath(
    os.path.join(DIRETORIO_ETL, "..", "core_rust", "openclinical_desktop", "openclinical_core.sqlite")
)


def limpar_preco(valor_str: str) -> float:
    try:
        limpo = valor_str.replace(".", "").replace(",", ".").strip()
        return float(limpo) if limpo else 0.0
    except Exception:
        return 0.0


def gerar_receita_prescricao(produto: str, substancia: str, apresentacao: str, laboratorio: str, tarja: str, classe: str = "") -> str:
    tipo_uso = "USO TÓPICO / DERMATOLÓGICO" if any(x in apresentacao.upper() for x in ["CREM", "POM", "GEL", "SOL TOP"]) else \
               "USO INALATÓRIO" if any(x in apresentacao.upper() for x in ["AER", "SPRAY", "INAL"]) else \
               "USO OFTÁLMICO" if "COL" in apresentacao.upper() else \
               "USO INJETÁVEL (IM/IV/SC)" if any(x in apresentacao.upper() for x in ["INJ", "AMP", "FA "]) else \
               "USO ORAL"

    classe_atc = classe.upper().strip()
    if "PRETA" in tarja.upper():
        tipo_receituario = "MEDICAMENTO DE TARJA PRETA (verificar lista da Portaria SVS/MS 344/98: Notificação de Receita ou Receita de Controle Especial)"
    elif classe_atc.startswith("J01"):
        tipo_receituario = "ANTIMICROBIANO SISTÊMICO (receita em 2 vias, 1ª via retida na farmácia - RDC 20/2011)"
    else:
        tipo_receituario = "RECEITUÁRIO MÉDICO"

    return (
        f"{tipo_receituario}\n"
        f"Medicamento: {produto.upper()}\n"
        f"Princípio Ativo (DCB): {substancia}\n"
        f"Apresentação Comercial: {apresentacao}\n"
        f"Fabricante: {laboratorio}\n\n"
        f"{tipo_uso}:\n"
        f"1. {produto.upper()} ({apresentacao}) -------------------- 1 embalagem original\n"
        f"   Posologia: [PREENCHER dose, via, intervalo e duração - modelo sem posologia, não é prescrição pronta]\n\n"
        f"Orientações ao Paciente:\n"
        f"- [PREENCHER orientações específicas ao paciente]"
    )


def compilar_cmed_sqlite() -> int:
    if not os.path.exists(CAMINHO_CMED):
        print(f"Erro: Arquivo CMED não encontrado em {CAMINHO_CMED}")
        return 0

    print("Iniciando compilação de 100% dos medicamentos comerciais da CMED / ANVISA no SQLite...")
    inicio = time.time()

    con = sqlite3.connect(CAMINHO_BANCO)
    con.execute("PRAGMA synchronous = OFF;")
    con.execute("PRAGMA journal_mode = MEMORY;")

    with con:
        con.execute("DROP TABLE IF EXISTS catalogo_nacional_medicamentos_cmed;")
        con.execute("""
            CREATE TABLE catalogo_nacional_medicamentos_cmed (
                id_cmed INTEGER PRIMARY KEY AUTOINCREMENT,
                substancia TEXT NOT NULL,
                nome_produto TEXT NOT NULL,
                apresentacao TEXT NOT NULL,
                classe_terapeutica TEXT,
                tipo_produto TEXT,
                laboratorio TEXT,
                numero_registro TEXT,
                codigo_ean TEXT,
                tarja TEXT,
                preco_maximo_consumidor REAL,
                receita_padrao_copiavel TEXT
            );
        """)

        con.execute("CREATE INDEX IF NOT EXISTS idx_cmed_produto ON catalogo_nacional_medicamentos_cmed(nome_produto);")
        con.execute("CREATE INDEX IF NOT EXISTS idx_cmed_substancia ON catalogo_nacional_medicamentos_cmed(substancia);")
        con.execute("CREATE INDEX IF NOT EXISTS idx_cmed_registro ON catalogo_nacional_medicamentos_cmed(numero_registro);")

    # Lê arquivo CSV da CMED
    lote = []
    total_lidos = 0
    total_inseridos = 0

    with open(CAMINHO_CMED, "r", encoding="utf-8-sig", newline="") as f:
        leitor = csv.reader(f, delimiter=";")
        cabecalho = next(leitor)
        
        indices = {nome.strip().upper(): i for i, nome in enumerate(cabecalho)}
        try:
            idx_substancia = indices["SUBSTÂNCIA"]
            idx_laboratorio = indices["LABORATÓRIO"]
            idx_registro = indices["REGISTRO"]
            idx_ean = indices["EAN 1"]
            idx_produto = indices["PRODUTO"]
            idx_apresentacao = indices["APRESENTAÇÃO"]
            idx_classe = indices["CLASSE TERAPÊUTICA"]
            idx_tipo = indices["TIPO DE PRODUTO (STATUS DO PRODUTO)"]
            idx_pmc18 = indices["PMC 18 %"]  # PMC com ICMS 18%
            idx_tarja = indices["TARJA"]
        except KeyError as erro:
            raise RuntimeError(f"Coluna esperada ausente no CSV da CMED: {erro}") from erro

        for linha in leitor:
            if not linha or len(linha) < 15:
                continue

            total_lidos += 1
            substancia = linha[idx_substancia].strip().strip('"') if len(linha) > idx_substancia else ""
            laboratorio = linha[idx_laboratorio].strip().strip('"') if len(linha) > idx_laboratorio else ""
            registro = linha[idx_registro].strip().strip('"') if len(linha) > idx_registro else ""
            ean = linha[idx_ean].strip().strip('"') if len(linha) > idx_ean else ""
            produto = linha[idx_produto].strip().strip('"') if len(linha) > idx_produto else ""
            apresentacao = linha[idx_apresentacao].strip().strip('"') if len(linha) > idx_apresentacao else ""
            classe = linha[idx_classe].strip().strip('"') if len(linha) > idx_classe else ""
            tipo = linha[idx_tipo].strip().strip('"') if len(linha) > idx_tipo else ""
            tarja = linha[idx_tarja].strip().strip('"') if len(linha) > idx_tarja else "Venda sob Prescrição"
            pmc = limpar_preco(linha[idx_pmc18]) if len(linha) > idx_pmc18 else 0.0

            if not produto:
                continue

            receita = gerar_receita_prescricao(produto, substancia, apresentacao, laboratorio, tarja, classe)

            lote.append((
                substancia, produto, apresentacao, classe, tipo,
                laboratorio, registro, ean, tarja, pmc, receita
            ))

            if len(lote) >= 5000:
                with con:
                    con.executemany("""
                        INSERT INTO catalogo_nacional_medicamentos_cmed (
                            substancia, nome_produto, apresentacao, classe_terapeutica, tipo_produto,
                            laboratorio, numero_registro, codigo_ean, tarja, preco_maximo_consumidor,
                            receita_padrao_copiavel
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                    """, lote)
                total_inseridos += len(lote)
                print(f"Progresso CMED: {total_inseridos} apresentações inseridas...", end="\r")
                lote = []

        if lote:
            with con:
                con.executemany("""
                    INSERT INTO catalogo_nacional_medicamentos_cmed (
                        substancia, nome_produto, apresentacao, classe_terapeutica, tipo_produto,
                        laboratorio, numero_registro, codigo_ean, tarja, preco_maximo_consumidor,
                        receita_padrao_copiavel
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                """, lote)
            total_inseridos += len(lote)

    # Indexa também no FTS5 para busca textual ultra-rápida
    print("\nAtualizando índice FTS5 de busca com todos os medicamentos comerciais...")
    with con:
        # Uma linha por apresentação: agrupar por produto escondia as demais concentrações e embalagens
        # da busca e da tela de preço (ex.: Losartana 100 mg quando o laboratório também vende 50 mg)
        con.execute("DELETE FROM indice_busca_fts WHERE tipo_registro = 'cmed_comercial';")
        con.execute("""
            INSERT INTO indice_busca_fts (tipo_registro, id_referencia, titulo_primario, subtitulo, conteudo_textual)
            SELECT 
                'cmed_comercial',
                id_cmed,
                nome_produto || ' (' || apresentacao || ')',
                substancia || ' - ' || laboratorio || ' | Reg. ' || numero_registro || ' | PMC R$ ' || ROUND(preco_maximo_consumidor, 2),
                nome_produto || ' ' || substancia || ' ' || apresentacao || ' ' || classe_terapeutica || ' ' || laboratorio || ' ' || tipo_produto || ' ' || numero_registro
            FROM catalogo_nacional_medicamentos_cmed;
        """)

    con.close()
    duracao = time.time() - inicio
    print(f"Compilação concluída com sucesso: {total_inseridos} apresentações comerciais inseridas em {duracao:.2f}s.")

    # Replicar para o banco do desktop Tauri
    if os.path.exists(os.path.dirname(CAMINHO_BANCO_DESKTOP)):
        import shutil
        shutil.copy2(CAMINHO_BANCO, CAMINHO_BANCO_DESKTOP)
        print(f"Banco completo replicado para o desktop: {CAMINHO_BANCO_DESKTOP}")

    return total_inseridos


if __name__ == "__main__":
    total = compilar_cmed_sqlite()
    print(f"Total de apresentações farmacêuticas registradas no Brasil compiladas: {total}.")
