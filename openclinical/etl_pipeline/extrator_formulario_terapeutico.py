"""
Extrator das bases oficiais de posologia do Ministério da Saúde:

1. Formulário Terapêutico Nacional (FTN 2010, Portaria MS nº 4.004/2010): 351 monografias com
   apresentações, indicações, contraindicações, precauções, esquemas de administração (adultos/crianças),
   efeitos adversos, interações, orientações e aspectos farmacêuticos.
   "É permitida a reprodução parcial ou total desta obra, desde que citada a fonte e que não seja para
   venda ou qualquer fim comercial." (FTN 2010, ficha catalográfica)
2. Relação Nacional de Medicamentos Essenciais (RENAME 2024, Portaria GM/MS nº 6.324/2024): elenco
   oficial do SUS com concentração, forma farmacêutica, componente de financiamento, ATC e AWaRe.

Gera a tabela `monografias_ftn`, a tabela `rename_2024_itens`, entradas no índice FTS5 e o módulo
TypeScript usado pelo frontend (mesma fonte para desktop e PWA).
"""

import json
import os
import re
import sqlite3
import urllib.request
from typing import Dict, List, Optional, Tuple

from pydantic import BaseModel, ConfigDict, Field

DIRETORIO_ETL = os.path.dirname(os.path.abspath(__file__))
DIRETORIO_DADOS = os.path.join(DIRETORIO_ETL, "dados_publicos")
CAMINHO_PDF_FTN = os.path.join(DIRETORIO_DADOS, "formulario_terapeutico_nacional_2010.pdf")
CAMINHO_PDF_RENAME = os.path.join(DIRETORIO_DADOS, "relacao_nacional_medicamentos_2024.pdf")
URL_FTN = "https://bvsms.saude.gov.br/bvs/publicacoes/formulario_terapeutico_nacional_2010.pdf"
URL_RENAME = "https://bvsms.saude.gov.br/bvs/publicacoes/relacao_nacional_medicamentos_2024.pdf"
CAMINHO_BANCO = os.path.join(DIRETORIO_ETL, "openclinical_core.sqlite")
CAMINHO_BANCO_DESKTOP = os.path.abspath(
    os.path.join(DIRETORIO_ETL, "..", "core_rust", "openclinical_desktop", "openclinical_core.sqlite")
)
CAMINHO_TS_FORMULARIO = os.path.abspath(
    os.path.join(DIRETORIO_ETL, "..", "frontend_ui", "src", "data", "formulario_terapeutico.ts")
)

FONTE_FTN = "Formulário Terapêutico Nacional 2010 (Ministério da Saúde, Portaria nº 4.004/2010)"
FONTE_RENAME = "RENAME 2024 (Ministério da Saúde, Portaria GM/MS nº 6.324/2024)"

# Cabeçalhos de seção das monografias (o FTN alterna singular/plural e tem pequenas variações de grafia)
SECOES_FTN: List[Tuple[str, str]] = [
    ("apresentacoes", r"Apresentaç(?:ão|ões)"),
    ("indicacoes", r"Indicaç(?:ão|ões)"),
    ("contraindicacoes", r"Contraindicaç(?:ão|ões)"),
    ("precaucoes", r"Precauç(?:ão|ões)"),
    # O PDF tem variações de caixa e erros de digitação ("administação", "farmacocintéticos")
    ("esquemas_administracao", r"Esquemas? de administ\w*"),
    ("farmacocinetica", r"Aspectos? farmacoci\w*(?: cl[ií]nicamente relevantes?)?"),
    ("efeitos_adversos", r"Efeitos adversos"),
    ("interacoes", r"Interaç(?:ão|ões) (?:de )?medicamentos(?:as)?"),
    ("orientacoes_pacientes", r"Orientaç(?:ão|ões) (?:aos?|às?) pacientes?"),
    ("aspectos_farmaceuticos", r"Aspectos? farmacêuticos?"),
]
PADRAO_SECAO = re.compile(
    r"^(?:" + "|".join(f"(?P<{chave}>{padrao})" for chave, padrao in SECOES_FTN) + r")\s*[\d,\-–; ]*$",
    re.IGNORECASE,
)

PADRAO_POPULACAO = re.compile(
    r"adult|crian|idos|neonat|lactent|adolesc|gestant|grávid|recém|mulher|homen|homem|paciente|bebê", re.IGNORECASE
)

LINHAS_DESCARTADAS = re.compile(
    r"^(=====PAGINA \d+=====|\d{1,4}|Monografias dos produtos em ordem alfabética|"
    r"Secretaria de Ciência, Tecnologia e Insumos Estratégicos/MS - FTN)$"
)

# Classificação regulatória do receituário (Portaria SVS/MS 344/98 e RDC 20/2011) para os fármacos do FTN.
# Só entram substâncias cuja lista é inequívoca; o restante recebe receituário simples.
RECEITUARIO_CONTROLADO: List[Tuple[str, str]] = [
    (r"\bmorfina\b|\bfentanila\b|\bmetadona\b|\bpetidina\b|\bremifentanila\b", "Notificação de Receita A (amarela) - lista A1 da Portaria SVS/MS 344/98"),
    (r"\bdiazepam\b|\bclonazepam\b|\bmidazolam\b|\blorazepam\b|\bfenobarbital\b|\bnitrazepam\b|\bclobazam\b",
     "Notificação de Receita B (azul) - lista B1 da Portaria SVS/MS 344/98"),
    (r"\bamitriptilina\b|\bnortriptilina\b|\bclomipramina\b|\bfluoxetina\b|\bsertralina\b|\bcarbamazepina\b|"
     r"\bfenitoína\b|\bvalproato\b|\bvalproico\b|\bhaloperidol\b|\bclorpromazina\b|\brisperidona\b|\blítio\b|"
     r"\bbiperideno\b|\bprometazina\b|\bcetamina\b|\btramadol\b|\bcodeína\b",
     "Receita de Controle Especial em 2 vias - lista C1 (ou conforme Portaria SVS/MS 344/98)"),
]

SAIS_E_PREFIXOS = (
    "cloridrato de", "dicloridrato de", "bromidrato de", "sulfato de", "acetato de", "fosfato de",
    "fosfato dissódico de", "maleato de", "besilato de", "succinato de", "citrato de", "fumarato de",
    "tartarato de", "hemitartarato de", "mesilato de", "nitrato de", "valerato de", "propionato de",
    "dipropionato de", "carbonato de", "gliconato de", "lactato de", "estolato de", "palmitato de",
    "decanoato de", "enantato de", "benzoato de", "bitartarato de", "brometo de", "iodeto de", "pamoato de",
)


class EsquemaAdministracaoSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")

    populacao: str = Field(..., description="Adultos, Crianças, Idosos... ou 'Geral' quando o FTN não separa")
    indicacao: str = Field(..., description="Indicação a que o esquema se refere (vazio se não especificada)")
    texto: str = Field(..., description="Texto do esquema de administração como publicado no FTN")
    dose_mg_kg_dia_min: Optional[float] = Field(None, ge=0, description="Dose pediátrica diária mínima extraída do texto")
    dose_mg_kg_dia_max: Optional[float] = Field(None, ge=0, description="Dose pediátrica diária máxima extraída do texto")
    fracionamento_diario: Optional[int] = Field(None, ge=1, le=24, description="Tomadas por dia extraídas do texto")
    dose_maxima_diaria_mg: Optional[float] = Field(None, ge=0, description="Teto diário explícito no texto (mg/dia)")


class InteracaoFtnSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")

    farmaco: str = Field(..., description="Fármaco ou classe citada na monografia")
    texto: str = Field(..., description="Efeito e conduta conforme o FTN")


class MonografiaFtnSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id_monografia: int = Field(..., ge=1)
    nome: str = Field(..., description="Denominação do fármaco como titulada no FTN")
    nome_busca: str = Field(..., description="Nome sem sal/prefixo, usado para cruzar interações e RENAME")
    itens_rename_2010: str = Field(..., description="Itens da RENAME 2010 citados na monografia")
    pagina: int = Field(..., ge=1, description="Página do PDF do FTN 2010")
    apresentacoes: List[str] = Field(default_factory=list)
    indicacoes: str = ""
    contraindicacoes: str = ""
    precaucoes: str = ""
    esquemas_administracao: str = ""
    esquemas: List[EsquemaAdministracaoSchema] = Field(default_factory=list)
    farmacocinetica: str = ""
    efeitos_adversos: str = ""
    interacoes: List[InteracaoFtnSchema] = Field(default_factory=list)
    orientacoes_pacientes: str = ""
    aspectos_farmaceuticos: str = ""
    tipo_receituario: str = Field(..., description="Receituário exigido (Portaria 344/98, RDC 20/2011 ou simples)")
    rename_2024: List[Dict[str, str]] = Field(default_factory=list, description="Apresentações na RENAME 2024")


class ItemRename2024Schema(BaseModel):
    model_config = ConfigDict(extra="forbid")

    denominacao: str
    concentracao: str
    forma_farmaceutica: str
    componente: str
    codigo_atc: str
    classificacao_aware: str = ""


# ---------------------------------------------------------------------------
# Download
# ---------------------------------------------------------------------------

def garantir_pdfs_oficiais() -> None:
    os.makedirs(DIRETORIO_DADOS, exist_ok=True)
    for url, caminho in ((URL_FTN, CAMINHO_PDF_FTN), (URL_RENAME, CAMINHO_PDF_RENAME)):
        if os.path.exists(caminho) and os.path.getsize(caminho) > 1024 * 1024:
            continue
        print(f"Baixando {url} ...")
        requisicao = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 OpenClinical/1.0"})
        with urllib.request.urlopen(requisicao, timeout=300) as resposta, open(caminho, "wb") as saida:
            saida.write(resposta.read())


def extrair_linhas_pdf(caminho_pdf: str) -> List[Tuple[int, str]]:
    import pymupdf

    linhas: List[Tuple[int, str]] = []
    with pymupdf.open(caminho_pdf) as documento:
        for numero, pagina in enumerate(documento, start=1):
            for linha in pagina.get_text("text").split("\n"):
                linhas.append((numero, linha.replace("­", "").rstrip()))
    return linhas


def classificar_estilo(spans: List[dict]) -> str:
    """
    O FTN usa tipografia semântica: título da monografia (Humanist negrito 8,5), seção (Humanist negrito 7,6),
    população (Minion negrito), indicação (Minion itálico) e texto (Minion regular).
    Os números de referência sobrescritos (corpo ~4,4) são ignorados na classificação.
    """
    principais = [s for s in spans if s["text"].strip() and s["size"] >= 6]
    if not principais:
        return "texto"
    fontes = {s["font"] for s in principais}
    if all("Humanist" in f and "Bold" in f for f in fontes):
        return "titulo" if min(s["size"] for s in principais) >= 8.2 else "secao"
    if all(f.endswith("-Bold") or f.endswith("-Bd") for f in fontes):
        return "populacao"
    if all(f.endswith("-It") or "Italic" in f for f in fontes):
        return "indicacao"
    return "texto"


def extrair_linhas_estilizadas(caminho_pdf: str) -> List[Tuple[int, str, str]]:
    import pymupdf

    linhas: List[Tuple[int, str, str]] = []
    with pymupdf.open(caminho_pdf) as documento:
        for numero, pagina in enumerate(documento, start=1):
            for bloco in pagina.get_text("dict")["blocks"]:
                for linha in bloco.get("lines", []):
                    spans = linha["spans"]
                    texto = "".join(s["text"] for s in spans).replace("­", "").strip()
                    if texto:
                        linhas.append((numero, texto, classificar_estilo(spans)))
    return linhas


# ---------------------------------------------------------------------------
# Normalização de texto
# ---------------------------------------------------------------------------

def normalizar_chave(texto: str) -> str:
    import unicodedata

    sem_acento = unicodedata.normalize("NFD", texto.lower())
    sem_acento = "".join(c for c in sem_acento if unicodedata.category(c) != "Mn")
    return re.sub(r"\s+", " ", sem_acento).strip()


def nome_para_busca(nome: str) -> str:
    """'cloridrato de amiodarona' -> 'amiodarona'; mantém associações ('a + b')."""
    partes = []
    for parte in re.split(r"\s*\+\s*", nome.lower()):
        parte = re.sub(r"\s+e\s+.*$", "", parte.strip()) if " e " in parte and "ácido" not in parte else parte.strip()
        for prefixo in SAIS_E_PREFIXOS:
            if parte.startswith(prefixo + " "):
                parte = parte[len(prefixo) + 1:]
                break
        parte = re.sub(r"\s+(sódic[oa]|potássic[oa]|cálcic[oa]|dissódic[oa]|monoidratad[oa]|di-?hidratad[oa])$", "", parte)
        partes.append(parte.strip())
    return " + ".join(p for p in partes if p)


def concatenar(anterior: str, continuacao: str) -> str:
    """Une linhas quebradas, desfazendo a hifenização de fim de linha ('seme-' + 'lhante')."""
    if anterior.endswith("-") and continuacao[:1].islower():
        return anterior[:-1] + continuacao
    return f"{anterior} {continuacao}"


class ItemSecao(BaseModel):
    model_config = ConfigDict(extra="forbid")

    populacao: str
    indicacao: str
    texto: str


def estruturar_secao(linhas: List[Tuple[str, str]]) -> Tuple[str, List[ItemSecao]]:
    """
    Converte as linhas (texto, estilo) de uma seção em Markdown simples e em itens com o contexto
    de população (negrito) e indicação (itálico) definidos pela tipografia do FTN.
    """
    blocos: List[List[str]] = []  # [tipo, texto] com tipo em populacao/indicacao/item/subitem/texto
    for texto, estilo in linhas:
        if estilo == "populacao":
            if texto.lower().startswith("nota"):
                estilo = "texto"  # "Nota:" em negrito é observação, não população
            else:
                texto = texto.rstrip(":").strip()
                if not PADRAO_POPULACAO.search(texto):
                    estilo = "indicacao"  # negrito que não descreve pacientes ("Cuidados na administração")
        if estilo in ("populacao", "indicacao"):
            if blocos and blocos[-1][0] == estilo and not re.search(r"[.:;]$", blocos[-1][1]):
                blocos[-1][1] = concatenar(blocos[-1][1], texto)
            else:
                blocos.append([estilo, texto])
        elif texto.startswith("•"):
            blocos.append(["item", texto.lstrip("• ").strip()])
        elif texto.startswith("––") or texto.startswith("--"):
            blocos.append(["subitem", texto.lstrip("–- ").strip()])
        elif estilo == "texto" and texto.lower().startswith("nota"):
            blocos.append(["texto", texto])
        elif blocos and blocos[-1][0] in ("item", "subitem", "texto"):
            blocos[-1][1] = concatenar(blocos[-1][1], texto)
        else:
            blocos.append(["texto", texto])

    markdown: List[str] = []
    itens: List[ItemSecao] = []
    populacao, indicacao = "", ""
    for tipo, texto in blocos:
        if tipo == "populacao":
            populacao, indicacao = texto, ""
            markdown.append(f"\n**{texto}**")
        elif tipo == "indicacao":
            indicacao = texto
            markdown.append(f"\n*{texto}*")
        elif tipo == "subitem":
            markdown.append(f"  - {texto}")
            if itens:
                itens[-1].texto = f"{itens[-1].texto} {texto}"
        else:
            markdown.append(f"- {texto}" if tipo == "item" else texto)
            itens.append(ItemSecao(populacao=populacao, indicacao=indicacao, texto=texto))
    return "\n".join(markdown).strip(), itens


# ---------------------------------------------------------------------------
# Posologia pediátrica (apenas padrões inequívocos; o restante fica só como texto)
# ---------------------------------------------------------------------------

def _numero(texto: str) -> float:
    return float(texto.replace(".", "").replace(",", "."))


def extrair_dose_maxima_diaria_mg(texto: str) -> Optional[float]:
    """'Dose máxima diária: 400 mg' / 'Dose máxima: 4 g/dia' -> mg/dia. Doses máximas por tomada são ignoradas."""
    m = re.search(
        r"dose máxima(?: diária)?:?\s*(?:de\s*)?(\d+(?:[.,]\d+)?)\s*(g|mg)\b(\s*/\s*dia|\s*por dia|\s*ao dia)?",
        texto.lower(),
    )
    if not m or ("diária" not in m.group(0) and not m.group(3)):
        return None
    valor = _numero(m.group(1))
    return valor * 1000 if m.group(2) == "g" else valor


def extrair_dose_pediatrica(texto: str) -> Tuple[Optional[float], Optional[float], Optional[int]]:
    t = texto.lower()
    # Textos com mais de uma dose em mg/kg (dose teste, associações, escalonamentos) não são estruturados:
    # ficam só como texto para leitura, sem preencher a calculadora.
    if len(re.findall(r"mg/\s?kg", t)) != 1:
        return None, None, None
    intervalos = [int(h) for h in re.findall(r"a cada (\d{1,2}) horas", t)]
    fracionamento = 24 // intervalos[0] if len(intervalos) == 1 and intervalos[0] and 24 % intervalos[0] == 0 else None
    m_vezes = re.search(r"(?:dividid[oa]s? em|em) (\d) (?:doses|tomadas|vezes)", t)
    if m_vezes and fracionamento is None:
        fracionamento = int(m_vezes.group(1))

    faixa = r"(\d+(?:,\d+)?)\s*(?:(?:a|–|-)\s*(\d+(?:,\d+)?))?\s*mg/kg"
    diaria = re.search(faixa + r"\s*(?:/dia|por dia|ao dia)", t)
    if diaria:
        minimo = _numero(diaria.group(1))
        maximo = _numero(diaria.group(2)) if diaria.group(2) else minimo
        return minimo, maximo, fracionamento

    # "X mg/kg, dividido a cada N horas" = dose diária dividida
    dividida = re.search(faixa + r",?\s*dividid[oa]", t)
    if dividida:
        minimo = _numero(dividida.group(1))
        maximo = _numero(dividida.group(2)) if dividida.group(2) else minimo
        return minimo, maximo, fracionamento

    # "X mg/kg ... a cada N horas" (dose por tomada) com intervalo único: converte para dose diária
    por_dose = re.search(faixa + r"(?:/dose)?,?\s*(?:por via [a-zá-ú]+,?\s*)?a cada (\d{1,2}) horas", t)
    if por_dose and len(intervalos) == 1:
        intervalo = int(por_dose.group(3))
        if intervalo and 24 % intervalo == 0:
            tomadas = 24 // intervalo
            minimo = _numero(por_dose.group(1)) * tomadas
            maximo = (_numero(por_dose.group(2)) if por_dose.group(2) else _numero(por_dose.group(1))) * tomadas
            return minimo, maximo, tomadas
    return None, None, fracionamento


def estruturar_esquemas(itens: List[ItemSecao]) -> List[EsquemaAdministracaoSchema]:
    esquemas: List[EsquemaAdministracaoSchema] = []
    for item in itens:
        populacao = item.populacao or "Geral"
        # A dose em mg/kg só é estruturada (para a calculadora pediátrica) quando a população é pediátrica
        eh_pediatrico = bool(re.search(r"crian|neonat|lactent|recém|bebê", populacao.lower()))
        minimo, maximo, fracionamento = extrair_dose_pediatrica(item.texto) if eh_pediatrico else (None, None, None)
        esquemas.append(
            EsquemaAdministracaoSchema(
                populacao=populacao,
                indicacao=item.indicacao,
                texto=item.texto,
                dose_mg_kg_dia_min=minimo,
                dose_mg_kg_dia_max=maximo,
                fracionamento_diario=fracionamento,
                dose_maxima_diaria_mg=extrair_dose_maxima_diaria_mg(item.texto) if minimo is not None else None,
            )
        )
    return esquemas


def estruturar_interacoes(itens: List[ItemSecao]) -> List[InteracaoFtnSchema]:
    interacoes = []
    for item in itens:
        m = re.match(r"^([^:]{2,90}):\s*(.+)$", item.texto)
        if m:
            interacoes.append(InteracaoFtnSchema(farmaco=m.group(1).strip(), texto=m.group(2).strip()))
    return interacoes


def classificar_receituario(nome: str, itens_rename: str) -> str:
    nome_minusculo = nome.lower()
    for padrao, tipo in RECEITUARIO_CONTROLADO:
        if re.search(padrao, nome_minusculo):
            return tipo
    # Antibacterianos (item 5.1 da RENAME 2010) exigem retenção de receita (RDC 20/2011)
    if re.search(r"(?<![\d.])5\.1(?:\.\d+)*(?![\d])", itens_rename):
        return "Antimicrobiano - receita em 2 vias, 1ª via retida na farmácia (RDC 20/2011)"
    return "Receituário simples"


# ---------------------------------------------------------------------------
# FTN: separação das monografias
# ---------------------------------------------------------------------------

def localizar_monografias(linhas: List[Tuple[int, str, str]]) -> List[Tuple[str, int, int, int]]:
    """
    Devolve (nome, inicio_corpo, fim, pagina) para cada monografia. Um título (estilo 'titulo') só abre
    monografia quando é seguido pela linha 'Na Rename 2010'; títulos '(ver ...)' são remissivas do índice.
    """
    inicio_apendices = next(
        (i for i, (_, texto, _) in enumerate(linhas) if texto == "APÊNDICES" and i > len(linhas) // 2), len(linhas)
    )
    encontradas: List[Tuple[str, int, int, int]] = []  # (nome, inicio_titulo, inicio_corpo, pagina)
    i = 0
    while i < inicio_apendices:
        _, texto, estilo = linhas[i]
        if estilo != "titulo":
            i += 1
            continue
        # Linhas seguidas em estilo de título: remissivas "(ver ...)" (uma ou duas linhas) e o título real,
        # que pode quebrar em duas linhas. Só o que sobra depois da última remissiva é o nome do fármaco.
        partes: List[str] = []
        inicio_titulo = i
        dentro_de_remissiva = False
        while i < inicio_apendices and linhas[i][2] == "titulo":
            atual = linhas[i][1].strip()
            if dentro_de_remissiva:
                # Remissiva "(ver ...)" termina em ")"; nota "Ver também ... página N" termina no número da página
                dentro_de_remissiva = not (atual.endswith(")") or re.search(r"página \d+", atual))
                partes, inicio_titulo = [], i + 1
            elif re.search(r"\(ver\b", atual):
                dentro_de_remissiva = not atual.endswith(")")
                partes, inicio_titulo = [], i + 1
            elif atual.lower().startswith("ver também"):
                dentro_de_remissiva = not re.search(r"página \d+", atual)
                partes, inicio_titulo = [], i + 1
            else:
                partes.append(atual)
            i += 1
        titulo = re.sub(r"\s+", " ", " ".join(partes)).strip()
        # Próxima linha relevante (pulando a de autores) precisa ser o item da RENAME 2010
        janela = [linhas[k][1] for k in range(i, min(i + 4, inicio_apendices))]
        posicao_rename = next((k for k, t in enumerate(janela) if t.startswith("Na Rename 2010")), None)
        if not titulo or posicao_rename is None:
            continue
        encontradas.append((titulo, inicio_titulo, i + posicao_rename, linhas[i + posicao_rename][0]))

    # A introdução do FTN traz uma monografia de exemplo; vale a ocorrência da seção de monografias
    por_nome: Dict[str, Tuple[str, int, int, int]] = {}
    for item in encontradas:
        por_nome[normalizar_chave(item[0])] = item
    ordenados = sorted(por_nome.values(), key=lambda x: x[1])

    monografias = []
    for posicao, (nome, _inicio_titulo, inicio_corpo, pagina) in enumerate(ordenados):
        fim = ordenados[posicao + 1][1] if posicao + 1 < len(ordenados) else inicio_apendices
        monografias.append((nome, inicio_corpo, fim, pagina))
    return monografias


def analisar_monografia(
    id_monografia: int, nome: str, corpo: List[Tuple[int, str, str]], pagina: int
) -> MonografiaFtnSchema:
    itens_rename = re.sub(r"^Na Rename 2010:\s*", "", corpo[0][1]).strip() if corpo else ""

    secoes: Dict[str, List[Tuple[str, str]]] = {}
    secao_atual: Optional[str] = None
    for _, texto, estilo in corpo[1:]:
        if LINHAS_DESCARTADAS.match(texto) or estilo == "titulo":
            continue  # cabeçalho/rodapé de página e remissivas "(ver ...)" do índice alfabético
        if estilo == "secao":
            m = PADRAO_SECAO.match(texto)
            if m:
                secao_atual = next(chave for chave, valor in m.groupdict().items() if valor)
                secoes.setdefault(secao_atual, [])
                continue
            # Subtítulo diagramado no estilo de seção (ex.: "Idosos" dentro dos esquemas)
            estilo = "populacao"
        if secao_atual:
            secoes[secao_atual].append((texto, estilo))

    estruturadas = {chave: estruturar_secao(secoes.get(chave, [])) for chave, _ in SECOES_FTN}

    return MonografiaFtnSchema(
        id_monografia=id_monografia,
        nome=nome,
        nome_busca=nome_para_busca(nome),
        itens_rename_2010=itens_rename,
        pagina=pagina,
        apresentacoes=[item.texto for item in estruturadas["apresentacoes"][1]],
        indicacoes=estruturadas["indicacoes"][0],
        contraindicacoes=estruturadas["contraindicacoes"][0],
        precaucoes=estruturadas["precaucoes"][0],
        esquemas_administracao=estruturadas["esquemas_administracao"][0],
        esquemas=estruturar_esquemas(estruturadas["esquemas_administracao"][1]),
        farmacocinetica=estruturadas["farmacocinetica"][0],
        efeitos_adversos=estruturadas["efeitos_adversos"][0],
        interacoes=estruturar_interacoes(estruturadas["interacoes"][1]),
        orientacoes_pacientes=estruturadas["orientacoes_pacientes"][0],
        aspectos_farmaceuticos=estruturadas["aspectos_farmaceuticos"][0],
        tipo_receituario=classificar_receituario(nome, itens_rename),
    )


def extrair_monografias_ftn(caminho_pdf: str = CAMINHO_PDF_FTN) -> List[MonografiaFtnSchema]:
    linhas = extrair_linhas_estilizadas(caminho_pdf)
    monografias = []
    for posicao, (nome, inicio, fim, pagina) in enumerate(localizar_monografias(linhas), start=1):
        monografias.append(analisar_monografia(posicao, nome, linhas[inicio:fim], pagina))
    return monografias


# ---------------------------------------------------------------------------
# RENAME 2024
# ---------------------------------------------------------------------------

PADRAO_ATC = re.compile(r"^[A-Z]\d{2}[A-Z]{2}\d{2}$")
COMPONENTES = {"Básico", "Estratégico", "Especializado"}
AWARE = {"Acesso", "Alerta", "Reserva", "-"}


def extrair_itens_rename_2024(caminho_pdf: str = CAMINHO_PDF_RENAME) -> List[ItemRename2024Schema]:
    """
    Lê as tabelas de medicamentos da RENAME 2024. Cada linha da tabela vira, no texto do PDF, a sequência
    [denominação (opcional, várias linhas)] concentração, forma, componente, ATC [AWaRe].
    """
    textos = [t.strip() for _, t in extrair_linhas_pdf(caminho_pdf)]
    itens: List[ItemRename2024Schema] = []
    denominacao_atual = ""
    ultimo_fim = 0
    for i, texto in enumerate(textos):
        if not PADRAO_ATC.match(texto) or i < 4 or textos[i - 1] not in COMPONENTES:
            continue
        componente = textos[i - 1]
        forma = textos[i - 2]
        concentracao = textos[i - 3]
        nome_linhas = [
            t for t in textos[ultimo_fim:i - 3]
            if t and t not in AWARE and not LINHAS_DESCARTADAS.match(t) and not t.startswith("=====")
        ]
        # Linhas de nome só existem quando a denominação muda; títulos de tabela e cabeçalhos são ignorados
        nome_linhas = [t for t in nome_linhas if not re.match(r"^(Denominação|Concentração|Forma|Componente|Código|ATC|AWaRe|Classificação)", t)]
        if nome_linhas and len(" ".join(nome_linhas)) < 160:
            denominacao_atual = re.sub(r"\s+", " ", " ".join(nome_linhas)).strip()
        aware = textos[i + 1] if i + 1 < len(textos) and textos[i + 1] in AWARE else ""
        ultimo_fim = i + (2 if aware else 1)
        if denominacao_atual:
            itens.append(
                ItemRename2024Schema(
                    denominacao=denominacao_atual,
                    concentracao=concentracao,
                    forma_farmaceutica=forma,
                    componente=componente,
                    codigo_atc=texto,
                    classificacao_aware="" if aware in ("", "-") else aware,
                )
            )
    return itens


def associar_rename(monografias: List[MonografiaFtnSchema], itens: List[ItemRename2024Schema]) -> None:
    por_chave: Dict[str, List[ItemRename2024Schema]] = {}
    for item in itens:
        por_chave.setdefault(normalizar_chave(nome_para_busca(item.denominacao)), []).append(item)
    for monografia in monografias:
        encontrados = por_chave.get(normalizar_chave(monografia.nome_busca), [])
        monografia.rename_2024 = [
            {
                "concentracao": item.concentracao,
                "forma_farmaceutica": item.forma_farmaceutica,
                "componente": item.componente,
                "codigo_atc": item.codigo_atc,
            }
            for item in encontrados
        ]


# ---------------------------------------------------------------------------
# Persistência (SQLite + FTS5) e exportação para o frontend
# ---------------------------------------------------------------------------

def persistir_no_banco(
    monografias: List[MonografiaFtnSchema], itens_rename: List[ItemRename2024Schema], caminho_banco: str
) -> None:
    con = sqlite3.connect(caminho_banco)
    with con:
        con.execute("DROP TABLE IF EXISTS monografias_ftn;")
        con.execute(
            """
            CREATE TABLE monografias_ftn (
                id_monografia INTEGER PRIMARY KEY,
                nome TEXT NOT NULL,
                nome_busca TEXT NOT NULL,
                pagina_ftn INTEGER NOT NULL,
                tipo_receituario TEXT NOT NULL,
                dados_json TEXT NOT NULL
            );
            """
        )
        con.execute("DROP TABLE IF EXISTS rename_2024_itens;")
        con.execute(
            """
            CREATE TABLE rename_2024_itens (
                id_item INTEGER PRIMARY KEY AUTOINCREMENT,
                denominacao TEXT NOT NULL,
                concentracao TEXT NOT NULL,
                forma_farmaceutica TEXT NOT NULL,
                componente TEXT NOT NULL,
                codigo_atc TEXT NOT NULL,
                classificacao_aware TEXT
            );
            """
        )
        con.executemany(
            "INSERT INTO monografias_ftn VALUES (?, ?, ?, ?, ?, ?);",
            [
                (m.id_monografia, m.nome, m.nome_busca, m.pagina, m.tipo_receituario, m.model_dump_json())
                for m in monografias
            ],
        )
        con.executemany(
            "INSERT INTO rename_2024_itens (denominacao, concentracao, forma_farmaceutica, componente, codigo_atc, classificacao_aware) VALUES (?, ?, ?, ?, ?, ?);",
            [
                (i.denominacao, i.concentracao, i.forma_farmaceutica, i.componente, i.codigo_atc, i.classificacao_aware)
                for i in itens_rename
            ],
        )
        con.execute("DELETE FROM indice_busca_fts WHERE tipo_registro = 'ftn_monografia';")
        con.executemany(
            "INSERT INTO indice_busca_fts (tipo_registro, id_referencia, titulo_primario, subtitulo, conteudo_textual) VALUES (?, ?, ?, ?, ?);",
            [
                (
                    "ftn_monografia",
                    m.id_monografia,
                    m.nome,
                    "Formulário Terapêutico Nacional - " + "; ".join(m.apresentacoes[:2]),
                    " ".join([m.nome, m.nome_busca, " ".join(m.apresentacoes), m.indicacoes]),
                )
                for m in monografias
            ],
        )
    con.close()


def exportar_typescript(monografias: List[MonografiaFtnSchema], itens_rename: List[ItemRename2024Schema]) -> None:
    os.makedirs(os.path.dirname(CAMINHO_TS_FORMULARIO), exist_ok=True)
    dados_monografias = [m.model_dump() for m in monografias]
    dados_rename = [i.model_dump() for i in itens_rename]
    conteudo = (
        "// ARQUIVO GERADO por etl_pipeline/extrator_formulario_terapeutico.py - não editar à mão.\n"
        f"// Fonte: {FONTE_FTN}. Reprodução permitida citando a fonte, sem fins comerciais.\n"
        f"// Apresentações SUS: {FONTE_RENAME}.\n\n"
        "export interface EsquemaAdministracaoFtn {\n"
        "  populacao: string;\n  indicacao: string;\n  texto: string;\n"
        "  dose_mg_kg_dia_min: number | null;\n  dose_mg_kg_dia_max: number | null;\n  fracionamento_diario: number | null;\n"
        "  dose_maxima_diaria_mg: number | null;\n}\n\n"
        "export interface InteracaoFtn {\n  farmaco: string;\n  texto: string;\n}\n\n"
        "export interface ApresentacaoRename2024 {\n  concentracao: string;\n  forma_farmaceutica: string;\n  componente: string;\n  codigo_atc: string;\n}\n\n"
        "export interface MonografiaFtn {\n"
        "  id_monografia: number;\n  nome: string;\n  nome_busca: string;\n  itens_rename_2010: string;\n  pagina: number;\n"
        "  apresentacoes: string[];\n  indicacoes: string;\n  contraindicacoes: string;\n  precaucoes: string;\n"
        "  esquemas_administracao: string;\n  esquemas: EsquemaAdministracaoFtn[];\n  farmacocinetica: string;\n"
        "  efeitos_adversos: string;\n  interacoes: InteracaoFtn[];\n  orientacoes_pacientes: string;\n"
        "  aspectos_farmaceuticos: string;\n  tipo_receituario: string;\n  rename_2024: ApresentacaoRename2024[];\n}\n\n"
        "export interface ItemRename2024 {\n  denominacao: string;\n  concentracao: string;\n  forma_farmaceutica: string;\n"
        "  componente: string;\n  codigo_atc: string;\n  classificacao_aware: string;\n}\n\n"
        f"export const FONTE_FTN = {json.dumps(FONTE_FTN, ensure_ascii=False)};\n"
        f"export const FONTE_RENAME = {json.dumps(FONTE_RENAME, ensure_ascii=False)};\n\n"
        f"export const MONOGRAFIAS_FTN: MonografiaFtn[] = {json.dumps(dados_monografias, ensure_ascii=False)};\n\n"
        f"export const ITENS_RENAME_2024: ItemRename2024[] = {json.dumps(dados_rename, ensure_ascii=False)};\n"
    )
    with open(CAMINHO_TS_FORMULARIO, "w", encoding="utf-8", newline="\n") as f:
        f.write(conteudo)


def compilar_formulario_terapeutico() -> Tuple[int, int]:
    garantir_pdfs_oficiais()
    monografias = extrair_monografias_ftn()
    itens_rename = extrair_itens_rename_2024()
    associar_rename(monografias, itens_rename)

    for banco in (CAMINHO_BANCO, CAMINHO_BANCO_DESKTOP):
        if os.path.exists(banco):
            persistir_no_banco(monografias, itens_rename, banco)
    exportar_typescript(monografias, itens_rename)
    return len(monografias), len(itens_rename)


if __name__ == "__main__":
    total_monografias, total_rename = compilar_formulario_terapeutico()
    print(f"FTN 2010: {total_monografias} monografias | RENAME 2024: {total_rename} apresentações")
