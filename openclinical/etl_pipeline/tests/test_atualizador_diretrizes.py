"""
Testes unitários para o módulo atualizador_diretrizes.py.
"""

import os
from openclinical.etl_pipeline.atualizador_diretrizes import (
    mapear_jurisdicao,
    separar_frontmatter,
    separar_receita,
    atualizar_todas_diretrizes,
)


def test_mapeamento_jurisdicao():
    assert mapear_jurisdicao("Reino Unido", "NICE") == "UK_NICE"
    assert mapear_jurisdicao("Estados Unidos", "CDC") == "US_CDC_FDA"
    assert mapear_jurisdicao("EUA", "FDA") == "US_CDC_FDA"
    assert mapear_jurisdicao("Global", "OMS / WHO") == "GLOBAL_WHO"
    assert mapear_jurisdicao("Canadá", "Health Canada") == "CA_HEALTH"
    assert mapear_jurisdicao("França", "HAS") == "FR_HAS"


def test_separacao_frontmatter():
    markdown = "---\nid_protocolo: teste_1\ntitulo: Teste Diretriz\n---\n# Conteúdo\nTexto da diretriz."
    meta, corpo = separar_frontmatter(markdown)
    assert meta["id_protocolo"] == "teste_1"
    assert meta["titulo"] == "Teste Diretriz"
    assert corpo.startswith("# Conteúdo")


def test_separacao_receita():
    corpo = "Texto antes\n```receita\nDipirona 500mg\n```\nTexto depois"
    limpo, receita = separar_receita(corpo)
    assert "Dipirona 500mg" in receita
    assert "```receita" not in limpo


def test_execucao_atualizar_todas_diretrizes():
    resultado = atualizar_todas_diretrizes(verificar_urls=False, gravar_bundle=True, gravar_relatorio=True)
    assert resultado["sucesso"] is True
    assert resultado["total_diretrizes_coletadas"] >= 16
    assert resultado["total_erros"] == 0
    assert resultado["bundle_typescript_atualizado"] is True
    assert "UK_NICE" in resultado["distribuicao_jurisdicao"]
    assert "US_CDC_FDA" in resultado["distribuicao_jurisdicao"]
    assert "GLOBAL_WHO" in resultado["distribuicao_jurisdicao"]
    assert "CA_HEALTH" in resultado["distribuicao_jurisdicao"]
