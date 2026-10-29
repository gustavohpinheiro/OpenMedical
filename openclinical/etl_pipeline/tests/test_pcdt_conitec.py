"""Extrator dos PCDT da CONITEC (extrator_pcdt_conitec.py): lista oficial, seções e medicamentos do Termo."""

import json
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from extrator_pcdt_conitec import (  # noqa: E402
    IndiceFarmacos,
    extrair_cids,
    extrair_lista_ter,
    extrair_secoes,
    farmaco,
    juntar_paragrafos,
    listar_pcdt,
    localizar_titulos,
    slug_da_url,
)

FIXTURE = os.path.join(os.path.dirname(__file__), "fixtures", "conitec_pcdt_amostra.json")


def test_lista_oficial_da_api_da_conitec():
    with open(FIXTURE, encoding="utf-8") as f:
        itens = listar_pcdt(json.load(f))
    # Mesmos valores conferidos no teste do atualizador em Rust (test_pcdt_conitec_lista_oficial_e_atualizacao)
    assert [(i.slug, i.titulo, i.data_portaria) for i in itens] == [
        ("pcdt-acidentes-escorpionicos", "Acidentes Escorpiônicos", "2025-08-05"),
        ("pcdt-acidentes-ofidicos-final", "Acidentes Ofídicos", "2025-10-09"),
        ("tromb-lise-no-acidente-vascular-cerebral-isqu-mico-agudo", "Acidente Vascular Cerebral (AVC) Isquêmico Agudo", "2023-12-15"),
        ("pcdt-diabete-melito-tipo-2", "Diabete Melito Tipo 2", "2026-02-24"),
    ]
    assert itens[0].portaria == "Portaria SECTICS/MS nº 59 - 01/08/2025"
    assert "pcdt-resumido" in itens[0].url_resumido
    assert itens[3].url_resumido == ""
    assert slug_da_url("https://x/midias/Protocolos/PCDT_Asma.PDF/@@display-file/file") == "pcdt-asma"


# Linhas como o pymupdf devolve um PCDT no modelo atual: número da seção em linha própria, título principal
# quebrado, marcadores de lista soltos, número da página colado no título do Termo.
LINHAS_PCDT = [
    (1, "ANEXO"),
    (1, "1. INTRODUÇÃO"),
    (1, "A asma é uma doença inflamatória crônica."),
    (2, "2. CLASSIFICAÇÃO ESTATÍSTICA INTERNACIONAL DE DOENÇAS E PROBLEMAS RELACIONADOS À"),
    (2, "SAÚDE (CID-10)"),
    (2, "-"),
    (2, "J45.0 - Asma predominante alérgica"),
    (2, "-"),
    (2, "J45.8 - Asma mista"),
    (3, "3. CRITÉRIOS DE INCLUSÃO"),
    (3, "Pacientes com diagnóstico de asma."),
    (4, "4. TRATAMENTO"),
    (4, "O objetivo é o controle da doença."),
    (5, "4.1. Medicamentos"),
    (5, "- Budesonida: cápsula inalante de 200 mcg;"),
    (6, "4.1.1. Esquemas de administração"),
    (6, "Budesonida: 200 a 400 mcg/dia, divididos em duas"),
    (6, "doses."),
    (7, "5. MONITORAMENTO"),
    (7, "Reavaliar a cada 3 meses."),
    (8, "6. REFERÊNCIAS"),
    (8, "1. Global Initiative for Asthma."),
    (9, "62 TERMO DE ESCLARECIMENTO E RESPONSABILIDADE BUDESONIDA,"),
    (9, "FUMARATO DE FORMOTEROL + BUDESONIDA E SULFATO DE"),
    (9, "SALBUTAMOL"),
    (9, ""),
    (9, "Eu, ______ (nome do paciente), declaro ter sido informado(a)"),
]


def test_secoes_numeradas_do_pcdt():
    titulos = localizar_titulos(LINHAS_PCDT)
    assert [t.numero for t in titulos] == ["1", "2", "3", "4", "4.1", "4.1.1", "5", "6"]
    secoes = {s.chave: s for s in extrair_secoes(LINHAS_PCDT, titulos)}
    assert list(secoes) == ["cid", "inclusao", "tratamento", "medicamentos", "esquemas", "monitoramento"]
    # Continuação do título ("SAÚDE (CID-10)") não entra no texto; marcadores viram itens
    assert secoes["cid"].texto == "- J45.0 - Asma predominante alérgica\n- J45.8 - Asma mista"
    assert extrair_cids(secoes["cid"].texto) == ["J45.0", "J45.8"]
    assert secoes["esquemas"].texto == "Budesonida: 200 a 400 mcg/dia, divididos em duas doses."
    assert secoes["esquemas"].pagina == 6
    # A subseção termina na próxima de mesmo nível ou acima; as referências ficam fora
    assert "Reavaliar" not in secoes["tratamento"].texto
    assert "Budesonida: 200 a 400" not in secoes["medicamentos"].texto
    assert "Global Initiative" not in secoes["monitoramento"].texto


def test_medicamentos_do_termo_de_esclarecimento():
    nomes = extrair_lista_ter(LINHAS_PCDT)
    assert nomes == ["budesonida", "fumarato de formoterol + budesonida", "sulfato de salbutamol"]
    indice = IndiceFarmacos(ftn={"budesonida": 45, "salbutamol": 315}, rename={"budesonida": "budesonida", "salbutamol": "sulfato de salbutamol"})
    salbutamol = farmaco("sulfato de salbutamol", indice)
    assert (salbutamol.chave, salbutamol.no_rename, salbutamol.id_monografia_ftn) == ("salbutamol", True, 315)
    associacao = farmaco("fumarato de formoterol + budesonida", indice)
    assert associacao.chave == "formoterol + budesonida" and not associacao.no_rename


def test_paragrafos_hifenizacao_e_itens():
    assert juntar_paragrafos(["Texto que con-", "tinua aqui.", "-", "item um;", "•", "item dois"]) == (
        "Texto que continua aqui.\n- item um;\n- item dois"
    )
