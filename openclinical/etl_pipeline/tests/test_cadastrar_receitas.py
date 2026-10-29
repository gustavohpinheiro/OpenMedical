"""Testes do fluxo de cadastro de receitas (clinical_content/protocolos/*.md)."""
import os
import re
import shutil
import sqlite3
import sys

import pytest

diretorio_etl = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if diretorio_etl not in sys.path:
    sys.path.insert(0, diretorio_etl)

import cadastrar_receitas as c  # noqa: E402

# Valores fictícios só para exercitar o validador; não são conteúdo clínico do app.
PREENCHIMENTO = {
    'titulo: "PREENCHER: título da receita"': 'titulo: "Receita de Teste do Validador"',
    'categoria: "PREENCHER"': 'categoria: "infectologia"',
    'cids_relacionados: ["PREENCHER"]': 'cids_relacionados: ["J02.9"]',
    'ciaps_relacionados: ["PREENCHER"]': 'ciaps_relacionados: ["R74"]',
    'farmacos_principais: ["PREENCHER"]': 'farmacos_principais: ["Farmaco Teste 10mg"]',
    'diretrizes_referencia: "PREENCHER: diretriz oficial consultada"': 'diretrizes_referencia: "Fonte de teste"',
}


def preencher_modelo(texto: str) -> str:
    for antigo, novo in PREENCHIMENTO.items():
        assert antigo in texto, f"modelo mudou: não achei {antigo!r}"
        texto = texto.replace(antigo, novo)
    # Corpo: troca cada "PREENCHER..." por texto neutro de teste
    texto = re.sub(r"PREENCHER[^\n]*", "texto de teste com dose, via, intervalo e duração definidos", texto)
    return texto


@pytest.fixture
def pasta(tmp_path):
    destino = tmp_path / "protocolos"
    destino.mkdir()
    shutil.copy(c.CAMINHO_MODELO, destino / "_MODELO.md")
    return destino


def criar_preenchida(pasta, id_protocolo="receita_teste"):
    caminho = c.criar_receita_do_modelo(id_protocolo, str(pasta), str(pasta / "_MODELO.md"))
    with open(caminho, encoding="utf-8") as f:
        texto = preencher_modelo(f.read())
    with open(caminho, "w", encoding="utf-8") as f:
        f.write(texto)
    return caminho


def editar(caminho, antigo, novo):
    with open(caminho, encoding="utf-8") as f:
        texto = f.read()
    assert antigo in texto
    with open(caminho, "w", encoding="utf-8") as f:
        f.write(texto.replace(antigo, novo, 1))


def mensagens(pasta):
    return [str(e) for e in c.carregar_receitas(str(pasta)).erros]


def test_modelo_preenchido_passa_na_validacao(pasta):
    criar_preenchida(pasta)
    resultado = c.carregar_receitas(str(pasta))
    assert resultado.erros == []
    [receita] = resultado.receitas  # _MODELO.md não é carregado
    assert receita.id == "receita_teste"
    assert receita.metadados["status_revisao_clinica"] == c.STATUS_PENDENTE
    assert receita.bloco_prescricao.startswith("RECEITUÁRIO MÉDICO")
    assert "```" not in receita.conteudo_markdown


def test_modelo_sem_preencher_e_recusado(pasta):
    c.criar_receita_do_modelo("receita_teste", str(pasta), str(pasta / "_MODELO.md"))
    erros = mensagens(pasta)
    assert any("receita_teste.md" in e and "titulo" in e and "PREENCHER" in e for e in erros)
    assert any("corpo" in e and "PREENCHER" in e for e in erros)


def test_modelo_real_e_ignorado_pelo_app_desktop():
    """O leitor Rust descarta arquivos com id_protocolo vazio; o guia não tem frontmatter."""
    with open(c.CAMINHO_MODELO, encoding="utf-8") as f:
        assert re.search(r'(?m)^id_protocolo: ""$', f.read())
    with open(os.path.join(c.DIRETORIO_PROTOCOLOS, "COMO_CADASTRAR.md"), encoding="utf-8") as f:
        assert not f.read().startswith("---")
    nomes = {os.path.basename(p) for p in c.listar_arquivos_receitas()}
    assert "_MODELO.md" not in nomes and "COMO_CADASTRAR.md" not in nomes


@pytest.mark.parametrize(
    "antigo, novo, campo, trecho",
    [
        ('["J02.9"]', '["J2.9"]', "cids_relacionados", "CID-10 'J2.9' inválido"),
        ('["J02.9"]', '[]', "cids_relacionados", "ao menos um CID-10"),
        ('["J02.9"]', "['J02.9']", "cids_relacionados", "aspas duplas"),
        ('ciaps_relacionados: ["R74"]', 'ciaps_relacionados: ["R7"]', "ciaps_relacionados", "CIAP-2 'R7' inválido"),
        ('"infectologia"', '"dermatologia"', "categoria", "'dermatologia' inválida"),
        ('id_protocolo: "receita_teste"', 'id_protocolo: "outra_receita"', "id_protocolo", "difere do nome do arquivo"),
        ('id_protocolo: "receita_teste"', 'id_protocolo: "Receita-Teste"', "id_protocolo", "letras minúsculas"),
        ('status_revisao_clinica: "pendente_revisao_por_profissional_habilitado"',
         'status_revisao_clinica: "aprovado"', "status_revisao_clinica", "inválido"),
        ('diretrizes_referencia: "Fonte de teste"', 'diretrizes_referncia: "Fonte de teste"',
         "diretrizes_referncia", "você quis dizer 'diretrizes_referencia'"),
        ('farmacos_principais: ["Farmaco Teste 10mg"]\n', '', "farmacos_principais", "campo obrigatório ausente"),
        ('nivel_atencao: "Atencao_Primaria"', 'nivel_atencao: "Atenção Primária"', "nivel_atencao", "inválido"),
        ('```receita', '```', "corpo", "falta o bloco de receita"),
    ],
)
def test_erros_apontam_arquivo_e_campo(pasta, antigo, novo, campo, trecho):
    caminho = criar_preenchida(pasta)
    editar(caminho, antigo, novo)
    erros = mensagens(pasta)
    assert any(
        "receita_teste.md" in e and f"-> {campo}:" in e and trecho in e for e in erros
    ), f"mensagem esperada ({campo}: {trecho}) não encontrada em {erros}"


def test_data_revisao_invalida(pasta):
    caminho = criar_preenchida(pasta)
    with open(caminho, encoding="utf-8") as f:
        texto = re.sub(r'data_revisao: "[^"]*"', 'data_revisao: "2026-13-40"', f.read())
    with open(caminho, "w", encoding="utf-8") as f:
        f.write(texto)
    assert any("data_revisao" in e and "AAAA-MM-DD" in e for e in mensagens(pasta))


def test_pseudoposologia_generica_e_recusada(pasta):
    caminho = criar_preenchida(pasta)
    editar(caminho, "Paciente: [Nome do Paciente]", "Paciente: [Nome do Paciente]\nTomar conforme prescrição médica.")
    assert any("-> receita:" in e and "conforme prescrição médica" in e for e in mensagens(pasta))


def test_ordem_catalogo_repetida_e_ordenacao(pasta):
    a = criar_preenchida(pasta, "receita_a")
    b = criar_preenchida(pasta, "receita_b")
    editar(b, "Receita de Teste do Validador", "Outra Receita de Teste")
    editar(a, "# ordem_catalogo: 46", "ordem_catalogo: 2")
    editar(b, "# ordem_catalogo: 46", "ordem_catalogo: 1")
    resultado = c.carregar_receitas(str(pasta))
    assert resultado.erros == []
    assert [r.id for r in resultado.receitas] == ["receita_b", "receita_a"]

    editar(a, "ordem_catalogo: 2", "ordem_catalogo: 1")
    assert any("ordem_catalogo" in e and "já usado" in e for e in mensagens(pasta))


def test_titulo_repetido(pasta):
    criar_preenchida(pasta, "receita_a")
    criar_preenchida(pasta, "receita_b")
    assert any("titulo" in e and "repetido" in e for e in mensagens(pasta))


def test_nova_recusa_id_invalido_ou_existente(pasta):
    with pytest.raises(ValueError):
        c.criar_receita_do_modelo("Nome Inválido", str(pasta), str(pasta / "_MODELO.md"))
    criar_preenchida(pasta)
    with pytest.raises(FileExistsError):
        c.criar_receita_do_modelo("receita_teste", str(pasta), str(pasta / "_MODELO.md"))


def _banco_com_indice(caminho):
    con = sqlite3.connect(caminho)
    con.execute(
        "CREATE VIRTUAL TABLE indice_busca_fts USING fts5(tipo_registro, id_referencia UNINDEXED, "
        "titulo_primario, subtitulo, conteudo_textual)"
    )
    con.execute("INSERT INTO indice_busca_fts VALUES ('protocolo', 'antigo', 'x', 'x', 'x')")
    con.execute("INSERT INTO indice_busca_fts VALUES ('medicamento', '1', 'Amoxicilina', 'x', 'x')")
    con.commit()
    con.close()


def test_comando_completo_gera_ts_e_indexa_busca(pasta, tmp_path, capsys):
    criar_preenchida(pasta)
    ts = tmp_path / "protocolos_gerados.ts"
    banco = tmp_path / "banco.sqlite"
    _banco_com_indice(banco)

    codigo = c.main(["--diretorio", str(pasta), "--saida-ts", str(ts), "--banco", str(banco)])
    assert codigo == 0
    conteudo_ts = ts.read_text(encoding="utf-8")
    assert '"id_protocolo": "receita_teste"' in conteudo_ts
    assert '"receita_teste": "infectologia"' in conteudo_ts

    con = sqlite3.connect(banco)
    linhas = con.execute("SELECT tipo_registro, id_referencia FROM indice_busca_fts ORDER BY 1").fetchall()
    con.close()
    assert linhas == [("medicamento", "1"), ("protocolo", "receita_teste")]


def test_comando_com_erro_nao_grava_nada(pasta, tmp_path, capsys):
    caminho = criar_preenchida(pasta)
    editar(caminho, '["J02.9"]', '["XYZ"]')
    ts = tmp_path / "protocolos_gerados.ts"
    codigo = c.main(["--diretorio", str(pasta), "--saida-ts", str(ts), "--sem-banco"])
    assert codigo == 1
    assert not ts.exists()
    saida = capsys.readouterr().err
    assert "[ERRO] receita_teste.md:" in saida and "cids_relacionados" in saida and "Nada foi gravado" in saida


def test_validar_nao_grava(pasta, tmp_path):
    criar_preenchida(pasta)
    ts = tmp_path / "protocolos_gerados.ts"
    assert c.main(["--validar", "--diretorio", str(pasta), "--saida-ts", str(ts)]) == 0
    assert not ts.exists()
