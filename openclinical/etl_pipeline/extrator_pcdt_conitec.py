"""
Extrator dos Protocolos Clínicos e Diretrizes Terapêuticas (PCDT) publicados pela CONITEC/Ministério da Saúde.

Fonte: página oficial dos PCDT em gov.br/conitec, lida pela API REST pública do portal (Plone/Volto, `++api++`).
O `robots.txt` do gov.br permite robôs em /conitec. A página traz uma tabela com, para cada PCDT: o PDF vigente,
a portaria (com data de publicação e link), a publicação do MS e o PCDT resumido.

Para cada PCDT o extrator:
1. baixa o PDF para `dados_publicos/pcdt/` (2 s entre requisições, User-Agent identificado e download condicional
   por ETag/Last-Modified: na segunda execução só o que mudou é baixado de novo);
2. separa as seções numeradas do protocolo (CID-10, critérios de inclusão/exclusão, tratamento, fármacos,
   esquemas de administração, tempo de tratamento, monitoramento);
3. lê a lista oficial de medicamentos do Termo de Esclarecimento e Responsabilidade e cruza com o FTN e a RENAME;
4. grava a tabela `pcdt_documentos` + índice FTS5 nos dois bancos e exporta um resumo leve para o frontend.

Uso:
    python extrator_pcdt_conitec.py              # lista, baixa o que mudou e extrai tudo
    python extrator_pcdt_conitec.py --sem-download   # reprocessa os PDFs já baixados
    python extrator_pcdt_conitec.py --limite 5       # só os 5 primeiros (teste)
"""

import argparse
import hashlib
import json
import os
import re
import sqlite3
import sys
import time
import unicodedata
import urllib.error
import urllib.request
from typing import Dict, List, Optional, Tuple

from pydantic import BaseModel, ConfigDict, Field

from extrator_formulario_terapeutico import chaves_associacao, nome_para_busca, normalizar_chave

DIRETORIO_ETL = os.path.dirname(os.path.abspath(__file__))
DIRETORIO_PDF = os.path.join(DIRETORIO_ETL, "dados_publicos", "pcdt")
CAMINHO_MANIFESTO = os.path.join(DIRETORIO_PDF, "manifesto.json")
CAMINHO_BANCO = os.path.join(DIRETORIO_ETL, "openclinical_core.sqlite")
CAMINHO_BANCO_DESKTOP = os.path.abspath(
    os.path.join(DIRETORIO_ETL, "..", "core_rust", "openclinical_desktop", "openclinical_core.sqlite")
)
CAMINHO_TS = os.path.abspath(os.path.join(DIRETORIO_ETL, "..", "frontend_ui", "src", "data", "pcdt_conitec.ts"))

URL_PAGINA = (
    "https://www.gov.br/conitec/pt-br/assuntos/avaliacao-de-tecnologias-em-saude/"
    "protocolos-clinicos-e-diretrizes-terapeuticas/pcdt"
)
URL_API = URL_PAGINA.replace("/conitec/pt-br/", "/conitec/++api++/pt-br/")
USER_AGENT = "OpenClinical/0.1 (coleta de dados publicos do Ministerio da Saude)"
INTERVALO_REQUISICOES_S = 2.0
LIMITE_PDF_BYTES = 80 * 1024 * 1024
FONTE = "Protocolos Clínicos e Diretrizes Terapêuticas - CONITEC/Ministério da Saúde (gov.br/conitec)"

# Tamanho dos trechos exportados para o frontend (o texto completo fica no banco do app desktop)
LIMITE_TS_ESQUEMAS = 2500
LIMITE_TS_MEDICAMENTOS = 1200


class ItemListaPcdt(BaseModel):
    model_config = ConfigDict(extra="forbid")

    titulo: str
    slug: str
    url_pdf: str
    portaria: str = ""
    data_portaria: str = Field("", description="AAAA-MM-DD da publicação da portaria, quando a tabela traz")
    url_portaria: str = ""
    url_publicacao_ms: str = ""
    url_resumido: str = ""


class FarmacoPcdt(BaseModel):
    model_config = ConfigDict(extra="forbid")

    nome: str
    chave: str
    no_rename: bool
    id_monografia_ftn: Optional[int] = None


class SecaoPcdt(BaseModel):
    model_config = ConfigDict(extra="forbid")

    chave: str
    titulo: str
    pagina: int
    texto: str


class DocumentoPcdt(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id_pcdt: int
    titulo: str
    slug: str
    portaria: str
    data_portaria: str
    url_pdf: str
    url_portaria: str
    url_publicacao_ms: str
    url_resumido: str
    paginas: int
    tem_texto: bool
    cids: List[str]
    farmacos: List[FarmacoPcdt]
    secoes: List[SecaoPcdt]
    hash_pdf: str


# ---------------------------------------------------------------------------
# Lista oficial (API REST do portal gov.br)
# ---------------------------------------------------------------------------

def _requisicao(url: str, cabecalhos: Optional[Dict[str, str]] = None) -> urllib.request.Request:
    return urllib.request.Request(url, headers={"User-Agent": USER_AGENT, **(cabecalhos or {})})


def baixar_lista() -> dict:
    with urllib.request.urlopen(_requisicao(URL_API, {"Accept": "application/json"}), timeout=60) as resposta:
        return json.loads(resposta.read().decode("utf-8"))


def _tabelas(no, saida: List[dict]) -> List[dict]:
    if isinstance(no, dict):
        if no.get("@type") == "slateTable":
            saida.append(no)
        for valor in no.values():
            _tabelas(valor, saida)
    elif isinstance(no, list):
        for valor in no:
            _tabelas(valor, saida)
    return saida


def _texto_slate(no) -> str:
    if isinstance(no, dict):
        if "text" in no:
            return no["text"]
        return "".join(_texto_slate(filho) for filho in no.get("children", []))
    if isinstance(no, list):
        return " ".join(_texto_slate(filho) for filho in no)
    return ""


def _links_slate(no, saida: List[Tuple[str, str]]) -> List[Tuple[str, str]]:
    if isinstance(no, dict):
        if no.get("type") == "link" and no.get("data", {}).get("url"):
            saida.append((_texto_slate(no).strip(), no["data"]["url"]))
        for filho in no.get("children", []):
            _links_slate(filho, saida)
    elif isinstance(no, list):
        for filho in no:
            _links_slate(filho, saida)
    return saida


def _limpar(texto: str) -> str:
    return re.sub(r"\s+", " ", texto.replace("\xa0", " ")).strip(" /-\u2013")


def slug_da_url(url: str) -> str:
    """'.../protocolos/2026/pcdt-diabete-melito-tipo-2/@@display-file/file' -> 'pcdt-diabete-melito-tipo-2'."""
    caminho = url.split("/@@")[0].rstrip("/")
    nome = caminho.rsplit("/", 1)[-1]
    nome = re.sub(r"\.pdf$", "", nome, flags=re.IGNORECASE)
    return re.sub(r"[^a-z0-9]+", "-", normalizar_chave(nome)).strip("-")[:150].strip("-")


def _data_iso(texto: str) -> str:
    m = re.search(r"(\d{2})/(\d{2})/(\d{4})", texto)
    return f"{m.group(3)}-{m.group(2)}-{m.group(1)}" if m else ""


def listar_pcdt(dados: dict) -> List[ItemListaPcdt]:
    """Linhas da 'Tabela de PCDT': [nome + PDF] [portaria (publicada em [data])] [publicação MS] [PCDT resumido]."""
    tabelas = [t for t in _tabelas(dados.get("blocks", {}), []) if "PCDT" in (t.get("table", {}).get("caption") or "")]
    if not tabelas:
        raise RuntimeError("A página da CONITEC não tem mais a 'Tabela de PCDT': o formato mudou.")
    itens: List[ItemListaPcdt] = []
    vistos = set()
    for linha in tabelas[0]["table"]["rows"]:
        celulas = [c.get("value", []) for c in linha.get("cells", [])]
        if not celulas:
            continue
        links_nome = _links_slate(celulas[0], [])
        if not links_nome:
            continue  # letra do índice alfabético ou linha vazia
        url_pdf = links_nome[0][1]
        titulo = _limpar(_texto_slate(celulas[0]))
        if not titulo or url_pdf in vistos:
            continue
        vistos.add(url_pdf)
        slug = slug_da_url(url_pdf)
        # Arquivos de mesmo nome em pastas diferentes: sufixo na ordem da tabela (igual ao atualizador em Rust)
        if any(i.slug == slug for i in itens):
            n = 2
            while any(i.slug == f"{slug}-{n}" for i in itens):
                n += 1
            slug = f"{slug}-{n}"
        portaria_texto = _limpar(_texto_slate(celulas[1])) if len(celulas) > 1 else ""
        links_portaria = _links_slate(celulas[1], []) if len(celulas) > 1 else []
        links_ms = _links_slate(celulas[2], []) if len(celulas) > 2 else []
        links_resumido = _links_slate(celulas[3], []) if len(celulas) > 3 else []
        publicada = re.search(r"Publicada em\s*\[?\s*(\d{2}/\d{2}/\d{4})", portaria_texto)
        itens.append(
            ItemListaPcdt(
                titulo=titulo,
                slug=slug,
                url_pdf=url_pdf,
                portaria=re.sub(r"\s*\(?\s*Publicada em.*$", "", portaria_texto).strip(),
                data_portaria=_data_iso(publicada.group(1)) if publicada else _data_iso(portaria_texto),
                url_portaria=links_portaria[0][1] if links_portaria else "",
                url_publicacao_ms=links_ms[0][1] if links_ms else "",
                url_resumido=links_resumido[0][1] if links_resumido else "",
            )
        )
    return itens


# ---------------------------------------------------------------------------
# Download dos PDFs (condicional, com intervalo entre requisições)
# ---------------------------------------------------------------------------

def carregar_manifesto() -> Dict[str, dict]:
    if os.path.exists(CAMINHO_MANIFESTO):
        with open(CAMINHO_MANIFESTO, encoding="utf-8") as f:
            return json.load(f)
    return {}


def salvar_manifesto(manifesto: Dict[str, dict]) -> None:
    os.makedirs(DIRETORIO_PDF, exist_ok=True)
    with open(CAMINHO_MANIFESTO, "w", encoding="utf-8") as f:
        json.dump(manifesto, f, ensure_ascii=False, indent=1)


def caminho_pdf(item: ItemListaPcdt) -> str:
    return os.path.join(DIRETORIO_PDF, f"{item.slug}.pdf")


def baixar_pdf(item: ItemListaPcdt, manifesto: Dict[str, dict], forcar: bool = False) -> str:
    """Devolve 'baixado', 'sem_mudanca' ou 'erro: ...'. O manifesto guarda URL, ETag e Last-Modified por slug."""
    destino = caminho_pdf(item)
    anterior = manifesto.get(item.slug, {})
    cabecalhos: Dict[str, str] = {}
    if not forcar and os.path.exists(destino) and anterior.get("url") == item.url_pdf:
        if anterior.get("etag"):
            cabecalhos["If-None-Match"] = anterior["etag"]
        if anterior.get("last_modified"):
            cabecalhos["If-Modified-Since"] = anterior["last_modified"]
    try:
        with urllib.request.urlopen(_requisicao(item.url_pdf, cabecalhos), timeout=180) as resposta:
            dados = resposta.read(LIMITE_PDF_BYTES + 1)
            etag, modificado = resposta.headers.get("ETag"), resposta.headers.get("Last-Modified")
    except urllib.error.HTTPError as erro:
        if erro.code == 304:
            return "sem_mudanca"
        return f"erro: HTTP {erro.code}"
    except (urllib.error.URLError, TimeoutError, OSError) as erro:
        return f"erro: {erro}"
    if len(dados) > LIMITE_PDF_BYTES:
        return "erro: PDF maior que o limite"
    if not dados.startswith(b"%PDF"):
        return "erro: a resposta não é um PDF"
    os.makedirs(DIRETORIO_PDF, exist_ok=True)
    temporario = destino + ".parcial"
    with open(temporario, "wb") as f:
        f.write(dados)
    os.replace(temporario, destino)
    manifesto[item.slug] = {
        "url": item.url_pdf,
        "etag": etag,
        "last_modified": modificado,
        "sha256": hashlib.sha256(dados).hexdigest(),
        "baixado_em": time.strftime("%Y-%m-%d %H:%M:%S"),
    }
    return "baixado"


# ---------------------------------------------------------------------------
# Leitura do PDF: seções numeradas
# ---------------------------------------------------------------------------

NUMERO_SOLTO = re.compile(r"^\d+(?:\.\d+)*\.?$")
TITULO_NUMERADO = re.compile(r"^(\d+(?:\.\d+)*)\.?\s+(\S.{1,110})$")
MARCADOR_ITEM = {"-", "\u2013", "\u2022", "\u25aa", "o"}
# Marcadores da fonte Symbol (área de uso privado: U+F02D, U+F0B7...) viram hífen
SIMBOLO_PRIVADO = re.compile("[\uf000-\uf0ff]")

# Seções principais (título em maiúsculas, número sem ponto). A ordem não importa: cada título é classificado.
SECOES_PRINCIPAIS: List[Tuple[str, str]] = [
    ("cid", r"CLASSIFICA[CÇ][AÃ]O ESTAT[IÍ]STICA|\(CID-?10\)"),
    ("inclusao", r"CRIT[EÉ]RIOS? DE INCLUS[AÃ]O"),
    ("exclusao", r"CRIT[EÉ]RIOS? DE EXCLUS[AÃ]O"),
    ("casos_especiais", r"CASOS ESPECIAIS"),
    ("tratamento", r"^TRATAMENTO|ABORDAGEM TERAP[EÊ]UTICA"),
    ("monitoramento", r"MONITORAMENTO|MONITORIZA[CÇ][AÃ]O"),
    ("referencias", r"^REFER[EÊ]NCIAS"),
]
# Subseções do tratamento (título em caixa normal: "8.7. Medicamentos", "6.2.4 Fármacos")
SUBSECOES_TRATAMENTO: List[Tuple[str, str]] = [
    ("medicamentos", r"^(F[áa]rmacos?|Medicamentos?)( e (f[áa]rmacos|medicamentos|apresenta[çc][õo]es))?( dispon[íi]veis.*)?$"),
    # Também "Fármacos e Esquemas de Administração" (o padrão de "medicamentos" exige o título inteiro)
    ("esquemas", r"^(F[áa]rmacos? e )?Esquemas? de administra"),
    ("tempo_tratamento", r"^Tempo de tratamento|^Dura[çc][ãa]o do tratamento"),
    ("criterios_interrupcao", r"^Crit[ée]rios de interrup"),
]
TITULOS_SECOES = {
    "cid": "Classificação (CID-10)",
    "inclusao": "Critérios de inclusão",
    "exclusao": "Critérios de exclusão",
    "casos_especiais": "Casos especiais",
    "tratamento": "Tratamento",
    "medicamentos": "Fármacos / medicamentos",
    "esquemas": "Esquemas de administração",
    "tempo_tratamento": "Tempo de tratamento",
    "criterios_interrupcao": "Critérios de interrupção",
    "monitoramento": "Monitoramento",
}


class Titulo(BaseModel):
    indice: int
    numero: str
    titulo: str
    pagina: int

    @property
    def nivel(self) -> int:
        return self.numero.count(".") + 1


def linhas_pdf(caminho: str) -> Tuple[List[Tuple[int, str]], int]:
    """(página, texto) de cada linha, com os números de seção soltos ("7.4.") unidos ao título da linha seguinte."""
    import pymupdf

    documento = pymupdf.open(caminho)
    brutas: List[Tuple[int, str]] = []
    for numero_pagina, pagina in enumerate(documento, start=1):
        for linha in pagina.get_text().split("\n"):
            texto = linha.replace("\xa0", " ").replace("\u00ad", "")
            brutas.append((numero_pagina, SIMBOLO_PRIVADO.sub("-", texto).strip()))
    total_paginas = documento.page_count
    documento.close()

    unidas: List[Tuple[int, str]] = []
    i = 0
    while i < len(brutas):
        pagina, texto = brutas[i]
        if NUMERO_SOLTO.match(texto) and i + 1 < len(brutas) and brutas[i + 1][1][:1].isalpha():
            unidas.append((pagina, f"{texto} {brutas[i + 1][1]}"))
            i += 2
            continue
        unidas.append((pagina, texto))
        i += 1
    return unidas, total_paginas


def _eh_titulo(numero: str, texto: str) -> bool:
    if texto.endswith((".", ",", ";")) or len(numero) > 9 or re.match(r"^\d", texto):
        return False
    if "." not in numero.rstrip("."):
        # Seção principal: em maiúsculas ("8. TRATAMENTO")
        letras = [c for c in texto if c.isalpha()]
        return len(letras) >= 4 and sum(c.isupper() for c in letras) / len(letras) > 0.85
    return texto[:1].isupper()


def localizar_titulos(linhas: List[Tuple[int, str]]) -> List[Titulo]:
    titulos: List[Titulo] = []
    for indice, (pagina, texto) in enumerate(linhas):
        m = TITULO_NUMERADO.match(texto)
        if not m or not _eh_titulo(m.group(1), m.group(2).strip()):
            continue
        titulo = re.sub(r"\s+", " ", m.group(2)).strip()
        # Título principal quebrado em duas linhas ("... RELACIONADOS À" / "SAÚDE (CID-10)")
        if "." not in m.group(1) and indice + 1 < len(linhas):
            seguinte = linhas[indice + 1][1]
            if seguinte and seguinte.isupper() and len(seguinte) < 80 and not TITULO_NUMERADO.match(seguinte):
                titulo = f"{titulo} {seguinte}"
        titulos.append(Titulo(indice=indice, numero=m.group(1), titulo=titulo, pagina=pagina))
    return titulos


def classificar_principal(titulo: str) -> Optional[str]:
    for chave, padrao in SECOES_PRINCIPAIS:
        if re.search(padrao, titulo):
            return chave
    return None


def classificar_subsecao(titulo: str) -> Optional[str]:
    for chave, padrao in SUBSECOES_TRATAMENTO:
        if re.search(padrao, titulo, re.IGNORECASE):
            return chave
    return None


def juntar_paragrafos(linhas: List[str]) -> str:
    """Une as linhas quebradas pelo layout; mantém itens de lista e frases fechadas em linhas próprias."""
    saida: List[str] = []
    atual = ""
    prefixo_item = False
    for linha in linhas:
        linha = linha.strip()
        if not linha:
            continue
        if linha in MARCADOR_ITEM:
            if atual:
                saida.append(atual)
            atual, prefixo_item = "", True
            continue
        if prefixo_item:
            linha = f"- {linha}"
            prefixo_item = False
            if atual:
                saida.append(atual)
                atual = ""
        if atual.endswith("-") and linha[:1].islower():
            atual = atual[:-1] + linha
        else:
            atual = f"{atual} {linha}".strip() if atual else linha
        if re.search(r"[.:;!?]$", linha):
            saida.append(atual)
            atual = ""
    if atual:
        saida.append(atual)
    return "\n".join(saida).strip()


def extrair_secoes(linhas: List[Tuple[int, str]], titulos: List[Titulo]) -> List[SecaoPcdt]:
    """Seções principais e subseções do tratamento, do corpo do protocolo (até as referências)."""
    principais = [t for t in titulos if t.nivel == 1]
    inicio_corpo = next((t.indice for t in principais if re.search(r"INTRODU", t.titulo)), 0)
    fim_corpo = next(
        (t.indice for t in principais if t.indice > inicio_corpo and classificar_principal(t.titulo) == "referencias"),
        len(linhas),
    )
    do_corpo = [t for t in titulos if inicio_corpo <= t.indice < fim_corpo]

    def chave_de(titulo: Titulo) -> Optional[str]:
        return classificar_principal(titulo.titulo) if titulo.nivel == 1 else classificar_subsecao(titulo.titulo)

    def fim_da_secao(titulo: Titulo) -> int:
        # Termina no próximo título de mesmo nível ou acima, ou numa subseção que tem aba própria
        # ("7.4. Medicamentos" não engole "7.4.1. Esquemas de administração")
        for seguinte in do_corpo:
            if seguinte.indice > titulo.indice and (seguinte.nivel <= titulo.nivel or chave_de(seguinte)):
                return seguinte.indice
        return fim_corpo

    secoes: List[SecaoPcdt] = []
    vistas = set()
    for titulo in do_corpo:
        chave = chave_de(titulo)
        if not chave or chave == "referencias" or chave in vistas:
            continue
        vistas.add(chave)
        corpo = [texto for _, texto in linhas[titulo.indice + 1 : fim_da_secao(titulo)]]
        # Continuação do título em maiúsculas ("ESTATÍSTICA INTERNACIONAL ... SAÚDE (CID-10)") não é texto da seção
        while corpo and (not corpo[0] or (corpo[0].isupper() and len(corpo[0]) < 100 and not CID.search(corpo[0]))):
            corpo.pop(0)
        texto = juntar_paragrafos(corpo)
        secoes.append(SecaoPcdt(chave=chave, titulo=TITULOS_SECOES[chave], pagina=titulo.pagina, texto=texto))
    return secoes


CID = re.compile(r"\b([A-TV-Z]\d{2}(?:\.\d{1,2})?)\b")


def extrair_cids(texto: str) -> List[str]:
    return list(dict.fromkeys(m.group(1) for m in CID.finditer(texto)))


def extrair_lista_ter(linhas: List[Tuple[int, str]]) -> List[str]:
    """
    Medicamentos listados no cabeçalho do Termo de Esclarecimento e Responsabilidade, em maiúsculas:
    "TERMO DE ESCLARECIMENTO E RESPONSABILIDADE" / "BENRALIZUMABE, BROMIDRATO DE FENOTEROL, ..." / "Eu, ____".
    """
    textos = [texto for _, texto in linhas]
    for i in range(len(textos) - 1, -1, -1):
        # O número da página às vezes vem colado no título ("62 TERMO DE ESCLARECIMENTO ...")
        m = re.match(r"^(?:\d+\s+)?TERMO DE ESCLARECIMENTO E RESPONSABILIDADE\b(.*)$", textos[i])
        if not m:
            continue
        # "TERMO DE ESCLARECIMENTO E RESPONSABILIDADE (TER)" / "... - TER": a sigla não é medicamento
        partes = [re.sub(r"^[\s\-–]*\(?TER\)?(?![A-Z])", "", m.group(1)).strip()]
        for seguinte in textos[i + 1 : i + 12]:
            if not seguinte:
                if any(partes):
                    break
                continue
            letras = [c for c in seguinte if c.isalpha()]
            if not letras or sum(c.isupper() for c in letras) / len(letras) < 0.9 or seguinte.startswith("EU"):
                break
            partes.append(seguinte)
        lista = " ".join(p for p in partes if p).strip(" \u2013-")
        if not lista:
            continue
        nomes = re.split(r",\s*|\s+E\s+(?=[A-ZÁÉÍÓÚÂÊÔÃÕÇ])", lista)
        return [re.sub(r"\s+", " ", n).strip(" .\u2013-").lower() for n in nomes if len(n.strip()) > 2]
    return []


# ---------------------------------------------------------------------------
# Cruzamento com FTN e RENAME
# ---------------------------------------------------------------------------

class IndiceFarmacos(BaseModel):
    ftn: Dict[str, int]
    rename: Dict[str, str]


def montar_indice_farmacos(caminho_banco: str) -> IndiceFarmacos:
    con = sqlite3.connect(caminho_banco)
    ftn: Dict[str, int] = {}
    for id_monografia, nome in con.execute("SELECT id_monografia, nome FROM monografias_ftn"):
        for chave in chaves_associacao(nome):
            ftn.setdefault(chave, id_monografia)
    rename: Dict[str, str] = {}
    for (denominacao,) in con.execute("SELECT DISTINCT denominacao FROM rename_2024_itens"):
        rename.setdefault(normalizar_chave(nome_para_busca(denominacao)), denominacao)
    con.close()
    return IndiceFarmacos(ftn=ftn, rename=rename)


def chave_farmaco(nome: str) -> str:
    return normalizar_chave(nome_para_busca(nome))


def farmaco(nome: str, indice: IndiceFarmacos) -> FarmacoPcdt:
    chave = chave_farmaco(nome)
    return FarmacoPcdt(
        nome=nome,
        chave=chave,
        no_rename=chave in indice.rename,
        id_monografia_ftn=indice.ftn.get(chave),
    )


def farmacos_citados(texto: str, indice: IndiceFarmacos) -> List[str]:
    """Sem lista no Termo: fármacos do FTN/RENAME citados no texto de medicamentos (nome inteiro, sem acento)."""
    normalizado = normalizar_chave(texto)
    encontrados: List[Tuple[int, str]] = []
    for chave in set(indice.rename) | set(indice.ftn):
        if len(chave) < 5 or "+" in chave:
            continue
        m = re.search(rf"(?<![a-z]){re.escape(chave)}(?![a-z])", normalizado)
        if m:
            encontrados.append((m.start(), chave))
    return [chave for _, chave in sorted(encontrados)]


# ---------------------------------------------------------------------------
# Documento completo
# ---------------------------------------------------------------------------

def analisar_pdf(caminho: str, item: ItemListaPcdt, id_pcdt: int, indice: IndiceFarmacos) -> DocumentoPcdt:
    with open(caminho, "rb") as f:
        hash_pdf = hashlib.sha256(f.read()).hexdigest()
    linhas, paginas = linhas_pdf(caminho)
    tem_texto = sum(len(t) for _, t in linhas) > 2000
    titulos = localizar_titulos(linhas) if tem_texto else []
    secoes = extrair_secoes(linhas, titulos) if titulos else []
    por_chave = {s.chave: s for s in secoes}

    cids = extrair_cids(por_chave["cid"].texto) if "cid" in por_chave else []
    nomes = extrair_lista_ter(linhas) if tem_texto else []
    if not nomes:
        base = por_chave.get("medicamentos") or por_chave.get("tratamento")
        nomes = farmacos_citados(base.texto, indice) if base else []
    farmacos = list({f.chave: f for f in (farmaco(n, indice) for n in nomes) if f.chave}.values())

    return DocumentoPcdt(
        id_pcdt=id_pcdt,
        titulo=item.titulo,
        slug=item.slug,
        portaria=item.portaria,
        data_portaria=item.data_portaria,
        url_pdf=item.url_pdf,
        url_portaria=item.url_portaria,
        url_publicacao_ms=item.url_publicacao_ms,
        url_resumido=item.url_resumido,
        paginas=paginas,
        tem_texto=tem_texto,
        cids=cids,
        farmacos=farmacos,
        secoes=secoes,
        hash_pdf=hash_pdf,
    )


def documento_sem_pdf(item: ItemListaPcdt, id_pcdt: int) -> DocumentoPcdt:
    return DocumentoPcdt(
        id_pcdt=id_pcdt, titulo=item.titulo, slug=item.slug, portaria=item.portaria, data_portaria=item.data_portaria,
        url_pdf=item.url_pdf, url_portaria=item.url_portaria, url_publicacao_ms=item.url_publicacao_ms,
        url_resumido=item.url_resumido, paginas=0, tem_texto=False, cids=[], farmacos=[], secoes=[], hash_pdf="",
    )


# ---------------------------------------------------------------------------
# Persistência e exportação
# ---------------------------------------------------------------------------

ESQUEMA_SQL = """
CREATE TABLE IF NOT EXISTS pcdt_documentos (
    id_pcdt INTEGER PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    titulo TEXT NOT NULL,
    portaria TEXT NOT NULL DEFAULT '',
    data_portaria TEXT NOT NULL DEFAULT '',
    url_pdf TEXT NOT NULL,
    url_portaria TEXT NOT NULL DEFAULT '',
    url_publicacao_ms TEXT NOT NULL DEFAULT '',
    url_resumido TEXT NOT NULL DEFAULT '',
    paginas INTEGER NOT NULL DEFAULT 0,
    tem_texto INTEGER NOT NULL DEFAULT 0,
    cids_json TEXT NOT NULL DEFAULT '[]',
    farmacos_json TEXT NOT NULL DEFAULT '[]',
    secoes_json TEXT NOT NULL DEFAULT '[]',
    hash_pdf TEXT NOT NULL DEFAULT '',
    extraido_em TEXT,
    -- O atualizador diário do app marca quando a CONITEC troca o PDF (o conteúdo extraído fica antigo)
    conteudo_desatualizado INTEGER NOT NULL DEFAULT 0,
    na_lista_oficial INTEGER NOT NULL DEFAULT 1
);
"""


def ids_existentes(caminho_banco: str) -> Dict[str, int]:
    if not os.path.exists(caminho_banco):
        return {}
    con = sqlite3.connect(caminho_banco)
    try:
        con.execute(ESQUEMA_SQL)
        return {slug: id_pcdt for slug, id_pcdt in con.execute("SELECT slug, id_pcdt FROM pcdt_documentos")}
    finally:
        con.close()


def conteudo_fts(documento: DocumentoPcdt) -> str:
    por_chave = {s.chave: s.texto for s in documento.secoes}
    return " ".join(
        [
            documento.titulo,
            " ".join(documento.cids),
            " ".join(f.nome for f in documento.farmacos),
            por_chave.get("medicamentos", "")[:4000],
            por_chave.get("esquemas", "")[:4000],
        ]
    )


def persistir_no_banco(documentos: List[DocumentoPcdt], caminho_banco: str) -> None:
    con = sqlite3.connect(caminho_banco)
    with con:
        con.execute(ESQUEMA_SQL)
        con.execute("UPDATE pcdt_documentos SET na_lista_oficial = 0")
        for d in documentos:
            con.execute(
                """
                INSERT INTO pcdt_documentos (id_pcdt, slug, titulo, portaria, data_portaria, url_pdf, url_portaria,
                    url_publicacao_ms, url_resumido, paginas, tem_texto, cids_json, farmacos_json, secoes_json, hash_pdf,
                    extraido_em, conteudo_desatualizado, na_lista_oficial)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), 0, 1)
                ON CONFLICT(slug) DO UPDATE SET
                    titulo = excluded.titulo, portaria = excluded.portaria, data_portaria = excluded.data_portaria,
                    url_pdf = excluded.url_pdf, url_portaria = excluded.url_portaria,
                    url_publicacao_ms = excluded.url_publicacao_ms, url_resumido = excluded.url_resumido,
                    paginas = excluded.paginas, tem_texto = excluded.tem_texto, cids_json = excluded.cids_json,
                    farmacos_json = excluded.farmacos_json, secoes_json = excluded.secoes_json,
                    hash_pdf = excluded.hash_pdf, extraido_em = excluded.extraido_em,
                    conteudo_desatualizado = 0, na_lista_oficial = 1
                """,
                (
                    d.id_pcdt, d.slug, d.titulo, d.portaria, d.data_portaria, d.url_pdf, d.url_portaria,
                    d.url_publicacao_ms, d.url_resumido, d.paginas, int(d.tem_texto), json.dumps(d.cids),
                    json.dumps([f.model_dump() for f in d.farmacos], ensure_ascii=False),
                    json.dumps([s.model_dump() for s in d.secoes], ensure_ascii=False), d.hash_pdf,
                ),
            )
        con.execute("DELETE FROM indice_busca_fts WHERE tipo_registro IN ('pcdt_conitec', 'pcdt_governo')")
        con.executemany(
            "INSERT INTO indice_busca_fts (tipo_registro, id_referencia, titulo_primario, subtitulo, conteudo_textual) "
            "VALUES ('pcdt_conitec', ?, ?, ?, ?)",
            [
                (
                    d.id_pcdt,
                    d.titulo,
                    "PCDT CONITEC" + (f" - CIDs: {', '.join(d.cids[:6])}" if d.cids else "")
                    + (f" - {d.portaria}" if d.portaria else ""),
                    conteudo_fts(d),
                )
                for d in documentos
            ],
        )
    con.close()


def resumo_frontend(d: DocumentoPcdt) -> dict:
    por_chave = {s.chave: s for s in d.secoes}

    def trecho(chave: str, limite: int) -> dict:
        secao = por_chave.get(chave)
        if not secao:
            return {"texto": "", "pagina": 0, "completo": True}
        texto = secao.texto
        if len(texto) > limite:
            texto = texto[:limite].rsplit("\n", 1)[0] if "\n" in texto[:limite] else texto[:limite]
        return {"texto": texto, "pagina": secao.pagina, "completo": len(texto) == len(secao.texto)}

    return {
        "id_pcdt": d.id_pcdt,
        "titulo": d.titulo,
        "portaria": d.portaria,
        "data_portaria": d.data_portaria,
        "url_pdf": d.url_pdf,
        "url_portaria": d.url_portaria,
        "url_publicacao_ms": d.url_publicacao_ms,
        "url_resumido": d.url_resumido,
        "paginas": d.paginas,
        "tem_texto": d.tem_texto,
        "cids": d.cids,
        "farmacos": [f.model_dump() for f in d.farmacos],
        "secoes_disponiveis": [s.chave for s in d.secoes],
        "medicamentos": trecho("medicamentos", LIMITE_TS_MEDICAMENTOS),
        "esquemas": trecho("esquemas", LIMITE_TS_ESQUEMAS),
    }


def exportar_typescript(documentos: List[DocumentoPcdt], verificado_em: str) -> None:
    dados = [resumo_frontend(d) for d in documentos]
    conteudo = (
        "// ARQUIVO GERADO por etl_pipeline/extrator_pcdt_conitec.py - não editar à mão.\n"
        f"// Fonte: {FONTE}.\n"
        "// Trechos extraídos automaticamente dos PDFs oficiais; o texto completo de cada seção fica no banco do app desktop.\n\n"
        "export interface FarmacoPcdt {\n  nome: string;\n  chave: string;\n  no_rename: boolean;\n"
        "  id_monografia_ftn: number | null;\n}\n\n"
        "export interface TrechoPcdt {\n  texto: string;\n  /** Página do PDF onde a seção começa (0 se não encontrada) */\n"
        "  pagina: number;\n  /** false quando o trecho foi cortado para caber no app */\n  completo: boolean;\n}\n\n"
        "export interface PcdtConitec {\n  id_pcdt: number;\n  titulo: string;\n  portaria: string;\n"
        "  /** AAAA-MM-DD da publicação da portaria */\n  data_portaria: string;\n  url_pdf: string;\n"
        "  url_portaria: string;\n  url_publicacao_ms: string;\n  url_resumido: string;\n  paginas: number;\n"
        "  /** false: PDF digitalizado (sem texto) ou não baixado */\n  tem_texto: boolean;\n  cids: string[];\n"
        "  farmacos: FarmacoPcdt[];\n  secoes_disponiveis: string[];\n  medicamentos: TrechoPcdt;\n  esquemas: TrechoPcdt;\n}\n\n"
        f"export const FONTE_PCDT_CONITEC = {json.dumps(FONTE, ensure_ascii=False)};\n"
        f"export const URL_PAGINA_PCDT = {json.dumps(URL_PAGINA)};\n"
        f"export const PCDT_VERIFICADO_EM = {json.dumps(verificado_em)};\n\n"
        f"export const PCDT_CONITEC: PcdtConitec[] = {json.dumps(dados, ensure_ascii=False, indent=1)};\n"
    )
    with open(CAMINHO_TS, "w", encoding="utf-8", newline="\n") as f:
        f.write(conteudo)


# ---------------------------------------------------------------------------
# Orquestração
# ---------------------------------------------------------------------------

def compilar_pcdt(baixar: bool = True, forcar: bool = False, limite: Optional[int] = None) -> List[DocumentoPcdt]:
    itens = listar_pcdt(baixar_lista())
    if limite:
        itens = itens[:limite]
    print(f"Lista oficial da CONITEC: {len(itens)} PCDT")

    manifesto = carregar_manifesto()
    if baixar:
        for posicao, item in enumerate(itens, start=1):
            time.sleep(INTERVALO_REQUISICOES_S)
            situacao = baixar_pdf(item, manifesto, forcar)
            print(f"[{posicao}/{len(itens)}] {item.titulo}: {situacao}", flush=True)
            if situacao == "baixado":
                salvar_manifesto(manifesto)

    banco_referencia = CAMINHO_BANCO if os.path.exists(CAMINHO_BANCO) else CAMINHO_BANCO_DESKTOP
    indice = montar_indice_farmacos(banco_referencia)
    existentes = ids_existentes(banco_referencia)
    proximo_id = max(existentes.values(), default=0) + 1
    documentos: List[DocumentoPcdt] = []
    for item in itens:
        id_pcdt = existentes.get(item.slug)
        if id_pcdt is None:
            id_pcdt, proximo_id = proximo_id, proximo_id + 1
        caminho = caminho_pdf(item)
        if os.path.exists(caminho):
            try:
                documentos.append(analisar_pdf(caminho, item, id_pcdt, indice))
                continue
            except Exception as erro:  # PDF corrompido não derruba o lote
                print(f"  falha ao ler {item.slug}: {erro}", file=sys.stderr)
        documentos.append(documento_sem_pdf(item, id_pcdt))

    for banco in (CAMINHO_BANCO, CAMINHO_BANCO_DESKTOP):
        if os.path.exists(banco):
            persistir_no_banco(documentos, banco)
    exportar_typescript(documentos, time.strftime("%Y-%m-%d"))
    return documentos


if __name__ == "__main__":
    argumentos = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    argumentos.add_argument("--sem-download", action="store_true", help="usa só os PDFs já baixados")
    argumentos.add_argument("--forcar", action="store_true", help="baixa de novo mesmo sem mudança")
    argumentos.add_argument("--limite", type=int, help="processa só os N primeiros (teste)")
    opcoes = argumentos.parse_args()
    docs = compilar_pcdt(baixar=not opcoes.sem_download, forcar=opcoes.forcar, limite=opcoes.limite)
    com_texto = [d for d in docs if d.tem_texto]
    print(
        f"PCDT: {len(docs)} na lista | {len(com_texto)} com texto | "
        f"{sum(1 for d in com_texto if any(s.chave == 'esquemas' for s in d.secoes))} com esquemas de administração | "
        f"{sum(1 for d in docs if d.farmacos)} com fármacos identificados"
    )
