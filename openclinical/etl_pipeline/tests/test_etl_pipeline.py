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


# ---------------------------------------------------------------------------
# Testes adicionais: banco isolado, consistência dos protocolos e bases públicas
# ---------------------------------------------------------------------------
import re
import csv


def test_banco_isolado_semeado_com_fts5(tmp_path):
    from seed_dados_iniciais import popular_banco_dados

    caminho = str(tmp_path / "teste.sqlite")
    popular_banco_dados(caminho)
    con = inicializar_banco_dados(caminho)
    assert con.execute("SELECT count(*) FROM principios_ativos").fetchone()[0] > 0
    assert con.execute("PRAGMA foreign_key_check").fetchall() == []
    assert con.execute(
        "SELECT count(*) FROM indice_busca_fts WHERE indice_busca_fts MATCH 'amoxicilina'"
    ).fetchone()[0] > 0
    con.close()


def test_protocolos_markdown_consistentes_com_gerador():
    """Os .md são a fonte única: todos válidos e o módulo TS gerado em dia com eles."""
    import cadastrar_receitas as c

    resultado = c.carregar_receitas()
    assert resultado.erros == [], "\n".join(str(e) for e in resultado.erros)
    ids = [r.id for r in resultado.receitas]
    assert len(ids) == len(set(ids)) >= 45
    for r in resultado.receitas:
        assert r.bloco_prescricao, f"{r.id} sem bloco de receita"
        assert r.conteudo_markdown, f"{r.id} sem corpo"
        for cid in r.metadados["cids_relacionados"]:
            assert re.fullmatch(r"[A-Z]\d{2}(\.\d{1,2})?", cid), f"CID inválido {cid} em {r.id}"

    with open(c.CAMINHO_TS_PROTOCOLOS, encoding="utf-8") as f:
        assert f.read() == c.gerar_conteudo_typescript(resultado.receitas), (
            "protocolos_gerados.ts desatualizado: rode python openclinical/etl_pipeline/cadastrar_receitas.py"
        )

    # Módulo antigo continua expondo a mesma lista para quem ainda o importa
    import gerador_receitas_completas as g

    assert [p["id_protocolo"] for p in g.TODOS_PROTOCOLOS] == ids


def test_receitas_nao_contem_pseudoposologia_generica():
    import cadastrar_receitas as c

    proibidos = ["conforme prescrição médica", "a critério médico", "conforme orientação médica"]
    assert set(proibidos) <= set(c.FRASES_PSEUDOPOSOLOGIA)
    for r in c.carregar_receitas().receitas:
        receita = r.bloco_prescricao.lower()
        for frase in c.FRASES_PSEUDOPOSOLOGIA:
            assert frase not in receita, f"{r.id} contém posologia genérica: {frase}"


def test_pcdt_sem_cids_inventados_para_protocolos_nao_curados():
    import compilador_bases_publicas as c

    protocolos = c.compilar_pcdt_oficial()
    assert len(protocolos) == 83
    nomes = {p["nome_protocolo"] for p in protocolos}
    assert set(c.MAPEAMENTO_CLINICO_PCDT) <= nomes, "Chaves de mapeamento sem correspondência no CSV oficial"
    for p in protocolos:
        if not p["conteudo_curado"]:
            assert p["cids_relacionados"] == []
            assert p["bloco_prescricao_copiavel"] == ""
        else:
            assert p["cids_relacionados"]


def test_cmed_leitura_utf8_preserva_acentos():
    import compilar_cmed_completo as m

    receita = m.gerar_receita_prescricao("TESTE", "SUBSTÂNCIA", "10 MG COMP", "LAB", "Tarja Vermelha", "J01CA04")
    assert "ANTIMICROBIANO" in receita
    assert "[PREENCHER" in receita
    with open(m.CAMINHO_CMED, encoding="utf-8-sig", newline="") as f:
        cabecalho = next(csv.reader(f, delimiter=";"))
    assert "SUBSTÂNCIA" in cabecalho and "APRESENTAÇÃO" in cabecalho


def test_dados_de_demonstracao_do_frontend_iguais_ao_seed():
    """O modo navegador usa cópias em api.ts; gravidades e formas farmacêuticas não podem divergir do seed."""
    import re
    import seed_dados_iniciais as s

    caminho_api = os.path.join(diretorio_etl, "..", "frontend_ui", "src", "api.ts")
    with open(caminho_api, encoding="utf-8") as f:
        api = f.read()

    gravidades_api = dict(
        (int(i), g) for i, g in re.findall(r"id_interacao: (\d+),.*?gravidade_interacao: '(\w+)'", api, flags=re.DOTALL)
    )
    gravidades_seed = {i.id_interacao: i.gravidade_interacao for i in s.obter_lista_matriz_interacoes()}
    assert gravidades_api == gravidades_seed

    formas_api = dict(
        (int(i), f) for i, f in re.findall(r"id_medicamento: (\d+),.*?forma_farmaceutica: '(\w+)'", api, flags=re.DOTALL)
    )
    formas_seed = {m.id_medicamento: m.forma_farmaceutica for m in s.obter_lista_medicamentos_comerciais()}
    assert formas_api == formas_seed

def test_extracao_dose_pediatrica_so_em_casos_inequivocos():
    import extrator_formulario_terapeutico as f

    # Dose diária explícita e dose "dividida" viram mg/kg/dia
    assert f.extrair_dose_pediatrica("10 a 20 mg/kg/dia, dividido a cada 8 a 12 horas.")[:2] == (10.0, 20.0)
    assert f.extrair_dose_pediatrica("20 a 90 mg/kg, dividido a cada 8 ou 12 horas.")[:2] == (20.0, 90.0)
    # Dose por tomada com intervalo único é convertida para dose diária
    assert f.extrair_dose_pediatrica("25 mg/kg, por via intravenosa, a cada 6 horas.") == (100.0, 100.0, 4)
    # Mais de uma dose em mg/kg no texto (dose teste, associação) não é estruturada
    assert f.extrair_dose_pediatrica(
        "1 mg/kg, por via intravenosa, a cada 24 horas, associada com flucitosina 100 mg/kg/dia."
    ) == (None, None, None)
    # Teto diário só quando o texto diz que é diário
    assert f.extrair_dose_maxima_diaria_mg("Dose máxima diária: 1,5 g.") == 1500.0
    assert f.extrair_dose_maxima_diaria_mg("Dose máxima: 4 g/dia.") == 4000.0
    assert f.extrair_dose_maxima_diaria_mg("Dose máxima: 2 g.") is None


def test_classificacao_receituario_e_nome_de_busca():
    import extrator_formulario_terapeutico as f

    assert "RDC 20/2011" in f.classificar_receituario("amoxicilina", "itens 5.1.1 e 16.3")
    assert "B1" in f.classificar_receituario("diazepam", "item 13.4")
    assert f.classificar_receituario("paracetamol", "item 2.1") == "Receituário simples"
    assert f.nome_para_busca("cloridrato de amiodarona") == "amiodarona"
    assert f.nome_para_busca("sulfametoxazol + trimetoprima") == "sulfametoxazol + trimetoprima"


@pytest.mark.skipif(
    not os.path.exists(os.path.join(diretorio_etl, "dados_publicos", "formulario_terapeutico_nacional_2010.pdf")),
    reason="PDF do FTN 2010 não baixado",
)
def test_formulario_terapeutico_extraido_do_pdf_oficial():
    import extrator_formulario_terapeutico as f

    monografias = f.extrair_monografias_ftn()
    assert len(monografias) >= 340
    nomes = {m.nome for m in monografias}
    assert {"amoxicilina", "ácido acetilsalicílico", "varfarina sódica"} <= nomes
    assert not any("(ver " in m.nome or "página" in m.nome for m in monografias)

    amoxicilina = next(m for m in monografias if m.nome == "amoxicilina")
    assert amoxicilina.apresentacoes == ["Cápsula ou comprimido 500 mg.", "Pó para suspensão oral 50 mg/mL."]
    infantil = next(e for e in amoxicilina.esquemas if e.populacao == "Crianças" and e.dose_mg_kg_dia_min)
    assert (infantil.dose_mg_kg_dia_min, infantil.dose_mg_kg_dia_max) == (20.0, 90.0)
    # Esquemas de adultos nunca recebem dose em mg/kg estruturada
    assert all(e.dose_mg_kg_dia_min is None for m in monografias for e in m.esquemas if e.populacao == "Adultos")
    assert sum(len(m.interacoes) for m in monografias) > 1000

    por_nome = {m.nome: m for m in monografias}
    # Rótulo de população fora do negrito puro ("• Adultos", "Adultos" em fonte regular) não pode deixar
    # doses de adulto rotuladas como pediátricas
    losartana = por_nome["losartana potássica"].esquemas
    assert [e.populacao for e in losartana] == ["Crianças, com seis anos ou mais"] + ["Adultos"] * 4
    assert not any(e.texto == "Adultos" for m in monografias for e in m.esquemas)
    azitromicina = por_nome["azitromicina"].esquemas
    assert next(e for e in azitromicina if e.texto.startswith("500 mg")).populacao == "Adultos"
    # "––" usado como marcador principal (medroxiprogesterona) gera um item por dose
    medroxi = por_nome["acetato de medroxiprogesterona"].esquemas
    assert {e.indicacao for e in medroxi} >= {"Contracepção", "Endometriose", "Menopausa"}
    # Indicação em itálico com parênteses regulares e população inline ("Neonatos: ...")
    rifampicina = por_nome["rifampicina"].esquemas
    assert any(e.indicacao.startswith("Tratamento da hanseníase") and e.populacao == "Adultos e adolescentes" for e in rifampicina)
    assert any(e.populacao == "Neonatos" and e.texto.startswith("Neonatos: 5 mg/kg") for e in rifampicina)
    # Nome científico em itálico no fim da frase continua no texto da apresentação
    assert por_nome["soro antibotrópico (pentavalente)"].apresentacoes[1].endswith("Bothrops jararaca.")

@pytest.mark.skipif(
    not os.path.exists(os.path.join(diretorio_etl, "dados_publicos", "relacao_nacional_medicamentos_2024.pdf")),
    reason="PDF da RENAME 2024 não baixado",
)
def test_rename_2024_lida_por_tabela_sem_cabecalhos_no_nome():
    import extrator_formulario_terapeutico as f

    itens = f.extrair_itens_rename_2024()
    assert len(itens) >= 900
    # A leitura sequencial antiga colava cabeçalhos de página e concentrações no nome e perdia a metformina
    assert not any(re.search(r"MINIST|continua|\(DCB\)|\*", i.denominacao) for i in itens)
    metformina = [i for i in itens if i.denominacao == "cloridrato de metformina"]
    assert {i.concentracao for i in metformina} == {"500 mg", "850 mg"}
    dapsona = [i for i in itens if i.denominacao == "dapsona"]
    assert dapsona and dapsona[0].codigo_atc == "J04BA02"

    # Títulos do FTN com sais alternativos ("... ou ...") encontram os itens dos dois sais
    assert set(f.chaves_associacao("succinato de metoprolol ou tartarato de metoprolol")) == {"metoprolol"}
    assert f.chaves_associacao("artesunato de sódio e cloridrato de mefloquina") == ["artesunato de sodio e cloridrato de mefloquina"]
