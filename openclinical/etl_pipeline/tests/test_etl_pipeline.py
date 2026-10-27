import os
import sys
import pytest

diretorio_etl = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if diretorio_etl not in sys.path:
    sys.path.insert(0, diretorio_etl)

from schemas_dominio import (
    PrincipioAtivoSchema,
    MedicamentoComercialSchema,
    FaixaAjusteRenalSchema,
    GuiaDiluicaoSchema,
    PosologiaEstruturadaSchema,
)
from estruturador_posologia import EstruturadorPosologia
from sincronizador_rename import SincronizadorRenameCmed
from compilador_banco import obter_caminho_padrao_banco, inicializar_banco_dados


def test_validacao_schema_pydantic_principio_ativo():
    # Princípio ativo válido
    pa = PrincipioAtivoSchema(
        id_principio_ativo=1,
        nome_dcb="Amoxicilina",
        classe_terapeutica="Antibacteriano",
        categoria_risco_gestacao="B",
        compatibilidade_aleitamento="Compatível",
        disponivel_rename_sus=1,
        componente_sus="Basico",
    )
    assert pa.nome_dcb == "Amoxicilina"
    assert pa.categoria_risco_gestacao == "B"

    # Falha se categoria de risco gestacional for inválida (ex: 'Z')
    with pytest.raises(Exception):
        PrincipioAtivoSchema(
            id_principio_ativo=1,
            nome_dcb="Droga Invalida",
            classe_terapeutica="Teste",
            categoria_risco_gestacao="Z",  # inválido: deve ser A, B, C, D ou X
            compatibilidade_aleitamento="Incompatível",
            disponivel_rename_sus=0,
            componente_sus="Nao_Padronizado",
        )


def test_validacao_schema_medicamento_comercial():
    # Falha se concentração for negativa ou nula
    with pytest.raises(Exception):
        MedicamentoComercialSchema(
            id_medicamento=1,
            id_principio_ativo=1,
            numero_registro_anvisa="10101010",
            nome_comercial="Medicamento Negativo",
            laboratorio_fabricante="Lab",
            apresentacao_comercial="Comp",
            concentracao_valor=-50.0,  # deve ser > 0
            concentracao_unidade="mg",
            forma_farmaceutica="comprimido",
            tipo_receituario="simples",
            preco_maximo_consumidor=10.0,
        )


def test_extracao_posologia_deterministica():
    estruturador = EstruturadorPosologia()
    texto_amoxicilina = (
        "Adultos: 500 mg a cada 8 horas por 7 a 10 dias.\n"
        "Crianças: a dose recomendada é de 25 a 50 mg/kg/dia divididos a cada 8 horas.\n"
        "Dose máxima diária de 3000 mg."
    )
    resultado = estruturador.estruturar(texto_amoxicilina, tentar_llm=False)

    assert isinstance(resultado, PosologiaEstruturadaSchema)
    assert resultado.dose_pediatrica_mg_kg_dia_min == 25.0
    assert resultado.dose_pediatrica_mg_kg_dia_max == 50.0
    assert resultado.dose_maxima_diaria_mg == 3000.0
    assert resultado.fracionamento_diario_sugerido == 3


def test_integridade_banco_dados_e_fts5():
    caminho = obter_caminho_padrao_banco()
    assert os.path.exists(caminho), "Arquivo de banco SQLite openclinical_core.sqlite deve existir"

    conexao = inicializar_banco_dados(caminho)
    # Verifica tabelas
    tabelas = [r[0] for r in conexao.execute("SELECT name FROM sqlite_master WHERE type='table';").fetchall()]
    assert "principios_ativos" in tabelas
    assert "medicamentos_comerciais" in tabelas
    assert "bulas_estruturadas" in tabelas
    assert "matriz_interacoes" in tabelas
    assert "codigos_diagnosticos" in tabelas
    assert "indice_busca_fts" in tabelas

    # Busca no FTS5
    res = conexao.execute("SELECT count(*) FROM indice_busca_fts WHERE indice_busca_fts MATCH 'amoxicilina';").fetchone()[0]
    assert res > 0, "Deve encontrar resultados para amoxicilina no FTS5"

    conexao.close()
