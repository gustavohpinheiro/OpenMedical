"""
Cadastro de Receitas & Prescrições (protocolos clínicos em Markdown).

FONTE ÚNICA: os arquivos ``clinical_content/protocolos/<id_protocolo>.md``.
Este script lê todos eles, valida cada campo e, se nada estiver errado, regenera:

  * ``frontend_ui/src/data/protocolos_gerados.ts`` (catálogo do frontend / modo navegador);
  * as linhas ``tipo_registro = 'protocolo'`` do índice FTS5 ``indice_busca_fts`` nos bancos SQLite.

Uso (a partir da raiz do repositório):

    python openclinical/etl_pipeline/cadastrar_receitas.py              # valida + regenera tudo
    python openclinical/etl_pipeline/cadastrar_receitas.py --validar    # só valida (não grava nada)
    python openclinical/etl_pipeline/cadastrar_receitas.py --nova minha_receita   # cria o .md a partir do modelo

Arquivos ignorados pelo carregamento: os que começam com "_" (ex.: ``_MODELO.md``) e ``COMO_CADASTRAR.md``.
O app desktop (Rust) também ignora ambos: o modelo tem ``id_protocolo`` vazio e o guia não tem frontmatter.
"""

from __future__ import annotations

import argparse
import datetime as _dt
import json
import os
import re
import sqlite3
import sys
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Sequence, Tuple

DIRETORIO_ETL = os.path.dirname(os.path.abspath(__file__))
DIRETORIO_RAIZ = os.path.abspath(os.path.join(DIRETORIO_ETL, ".."))
DIRETORIO_PROTOCOLOS = os.path.join(DIRETORIO_RAIZ, "clinical_content", "protocolos")
CAMINHO_MODELO = os.path.join(DIRETORIO_PROTOCOLOS, "_MODELO.md")
CAMINHO_TS_PROTOCOLOS = os.path.join(DIRETORIO_RAIZ, "frontend_ui", "src", "data", "protocolos_gerados.ts")
BANCOS_PADRAO = [
    os.path.join(DIRETORIO_ETL, "openclinical_core.sqlite"),
    os.path.join(DIRETORIO_RAIZ, "core_rust", "openclinical_desktop", "openclinical_core.sqlite"),
]

ARQUIVOS_IGNORADOS = {"COMO_CADASTRAR.md", "README.md"}

STATUS_PENDENTE = "pendente_revisao_por_profissional_habilitado"
STATUS_PERMITIDOS = (STATUS_PENDENTE, "revisado_por_profissional_habilitado")

# Precisam bater com os filtros de ProtocolsView.tsx (CATEGORIAS_FILTRO), senão a receita some dos filtros.
CATEGORIAS_PERMITIDAS = (
    "infectologia",
    "ginecologia",
    "cardiovascular",
    "nefrologia",
    "respiratorio",
    "gastroenterologia",
    "endocrinologia",
    "reumatologia",
    "neurologia",
    "saude_mental",
    "urgencia",
    "pediatria",
)

# Frases que não são posologia: a receita copiável precisa dizer dose, via, intervalo e duração.
FRASES_PSEUDOPOSOLOGIA = (
    "conforme prescrição médica",
    "conforme prescricao medica",
    "a critério médico",
    "a criterio medico",
    "conforme orientação médica",
    "conforme orientacao medica",
    "conforme indicação médica",
    "uso conforme bula",
    "posologia usual",
)

MARCADOR_PENDENTE = "PREENCHER"

PADRAO_ID = re.compile(r"^[a-z0-9]+(?:_[a-z0-9]+)*$")
PADRAO_CID10 = re.compile(r"^[A-Z]\d{2}(?:\.\d{1,2})?$")
PADRAO_CIAP2 = re.compile(r"^[A-Z]\d{2}$")
PADRAO_NIVEL_ATENCAO = re.compile(r"^[A-Z][A-Za-z]*(?:_[A-Za-z]+)*$")
PADRAO_BLOCO_RECEITA = r"```receita\n(.*?)```"


@dataclass(frozen=True)
class Campo:
    tipo: str  # "texto" | "lista" | "inteiro"
    obrigatorio: bool
    descricao: str


CAMPOS: Dict[str, Campo] = {
    "id_protocolo": Campo("texto", True, "identificador em snake_case, igual ao nome do arquivo sem .md"),
    "titulo": Campo("texto", True, "título exibido na lista de receitas"),
    "categoria": Campo("texto", True, "uma de: " + ", ".join(CATEGORIAS_PERMITIDAS)),
    "cids_relacionados": Campo("lista", True, 'lista de CID-10, ex.: ["J02.0", "J03.9"]'),
    "ciaps_relacionados": Campo("lista", True, 'lista de CIAP-2, ex.: ["R74"] (pode ser [])'),
    "farmacos_principais": Campo("lista", True, 'fármacos usados nos filtros/busca, ex.: ["Amoxicilina 500mg"]'),
    "nivel_atencao": Campo("texto", True, "ex.: Atencao_Primaria, Atencao_Primaria_e_Urgencia"),
    "diretrizes_referencia": Campo("texto", True, "fonte oficial consultada (MS/PCDT, sociedade médica, OMS...)"),
    "data_revisao": Campo("texto", True, "data da última revisão no formato AAAA-MM-DD"),
    "status_revisao_clinica": Campo("texto", True, "use " + STATUS_PENDENTE + " até revisão por profissional"),
    "ordem_catalogo": Campo("inteiro", False, "posição na lista (opcional; sem ela a receita vai para o fim)"),
}


@dataclass
class Receita:
    arquivo: str
    metadados: Dict[str, Any]
    corpo_completo: str  # tudo após o frontmatter (com o título H1 e o bloco ```receita)
    conteudo_markdown: str  # corpo sem H1 e sem o bloco de receita (como o frontend exibe)
    bloco_prescricao: str

    @property
    def id(self) -> str:
        return self.metadados["id_protocolo"]


@dataclass
class ErroValidacao:
    arquivo: str
    campo: str
    mensagem: str
    linha: Optional[int] = None

    def __str__(self) -> str:
        local = os.path.basename(self.arquivo)
        if self.linha:
            local += f":{self.linha}"
        return f"[ERRO] {local} -> {self.campo}: {self.mensagem}"


@dataclass
class ResultadoCarga:
    receitas: List[Receita] = field(default_factory=list)
    erros: List[ErroValidacao] = field(default_factory=list)


# ---------------------------------------------------------------------------
# Leitura e validação
# ---------------------------------------------------------------------------

def separar_corpo_e_receita(conteudo: str) -> Tuple[str, str]:
    """Separa o texto explicativo (sem o título H1) do bloco de receita copiável."""
    correspondencia = re.search(PADRAO_BLOCO_RECEITA, conteudo, flags=re.DOTALL)
    receita = correspondencia.group(1).strip() if correspondencia else ""
    corpo = re.sub(PADRAO_BLOCO_RECEITA, "", conteudo, flags=re.DOTALL).strip()
    corpo = re.sub(r"^# .*\n+", "", corpo).strip()
    return corpo, receita


def listar_arquivos_receitas(diretorio: str = DIRETORIO_PROTOCOLOS) -> List[str]:
    return sorted(
        os.path.join(diretorio, nome)
        for nome in os.listdir(diretorio)
        if nome.endswith(".md") and not nome.startswith("_") and nome not in ARQUIVOS_IGNORADOS
    )


def _interpretar_valor(bruto: str, campo: Campo) -> Any:
    """Converte o texto do frontmatter. Levanta ValueError com mensagem amigável."""
    if campo.tipo == "lista":
        if not (bruto.startswith("[") and bruto.endswith("]")):
            raise ValueError('deve ser uma lista entre colchetes, ex.: ["A", "B"]')
        try:
            valor = json.loads(bruto)
        except json.JSONDecodeError:
            raise ValueError('lista mal formatada; use aspas duplas e vírgulas, ex.: ["J02.0", "J03.9"]')
        if not all(isinstance(v, str) for v in valor):
            raise ValueError("todos os itens da lista devem ser textos entre aspas duplas")
        return [v.strip() for v in valor]
    if campo.tipo == "inteiro":
        if not re.fullmatch(r"\d+", bruto):
            raise ValueError("deve ser um número inteiro positivo, sem aspas")
        return int(bruto)
    if len(bruto) >= 2 and bruto[0] == bruto[-1] and bruto[0] in "\"'":
        bruto = bruto[1:-1]
    if '"' in bruto:
        raise ValueError("não use aspas duplas dentro do valor (o leitor do app desktop não as suporta)")
    return bruto.strip()


def analisar_arquivo(caminho: str) -> Tuple[Optional[Receita], List[ErroValidacao]]:
    """Lê e valida um único .md. Retorna (receita ou None, erros)."""
    erros: List[ErroValidacao] = []
    linha_do_campo: Dict[str, int] = {}

    def erro(campo: str, msg: str, linha: Optional[int] = None) -> None:
        erros.append(ErroValidacao(caminho, campo, msg, linha or linha_do_campo.get(campo)))

    try:
        with open(caminho, encoding="utf-8") as f:
            texto = f.read()
    except UnicodeDecodeError:
        erro("arquivo", "não está em UTF-8; salve o arquivo com codificação UTF-8")
        return None, erros
    texto = texto.lstrip("﻿")
    linhas = texto.split("\n")

    if not linhas or linhas[0].strip() != "---":
        erro("frontmatter", "a primeira linha do arquivo deve ser exatamente '---'", 1)
        return None, erros
    fim = next((i for i in range(1, len(linhas)) if linhas[i].strip() == "---"), None)
    if fim is None:
        erro("frontmatter", "falta a linha '---' que fecha o cabeçalho de metadados")
        return None, erros

    metadados: Dict[str, Any] = {}
    for i in range(1, fim):
        linha = linhas[i].strip()
        if not linha or linha.startswith("#"):
            continue
        if ":" not in linha:
            erro("frontmatter", f"linha sem 'campo: valor': {linha!r}", i + 1)
            continue
        chave, bruto = linha.split(":", 1)
        chave = chave.strip()
        if chave not in CAMPOS:
            sugestao = _sugerir_campo(chave)
            erro(chave, "campo desconhecido" + (f" (você quis dizer '{sugestao}'?)" if sugestao else ""), i + 1)
            continue
        if chave in metadados:
            erro(chave, "campo repetido no cabeçalho", i + 1)
            continue
        linha_do_campo[chave] = i + 1
        try:
            metadados[chave] = _interpretar_valor(bruto.strip(), CAMPOS[chave])
        except ValueError as e:
            erro(chave, str(e), i + 1)

    for chave, campo in CAMPOS.items():
        if campo.obrigatorio and chave not in metadados and not any(e.campo == chave for e in erros):
            erro(chave, f"campo obrigatório ausente ({campo.descricao})")

    _validar_metadados(caminho, metadados, erro)

    corpo_completo = "\n".join(linhas[fim + 1:]).strip()
    conteudo_markdown, bloco = separar_corpo_e_receita(corpo_completo)
    linha_marcador = next((i + 1 for i in range(fim + 1, len(linhas)) if MARCADOR_PENDENTE in linhas[i]), None)
    _validar_corpo(corpo_completo, conteudo_markdown, bloco, erro, linha_marcador)

    if erros:
        return None, erros
    return Receita(caminho, metadados, corpo_completo, conteudo_markdown, bloco), erros


def _sugerir_campo(chave: str) -> Optional[str]:
    import difflib

    candidatos = difflib.get_close_matches(chave, list(CAMPOS), n=1, cutoff=0.6)
    return candidatos[0] if candidatos else None


def _validar_metadados(caminho: str, m: Dict[str, Any], erro) -> None:
    nome_esperado = os.path.splitext(os.path.basename(caminho))[0]

    id_protocolo = m.get("id_protocolo")
    if id_protocolo is not None:
        if not id_protocolo:
            erro("id_protocolo", "está vazio")
        elif not PADRAO_ID.match(id_protocolo):
            erro("id_protocolo", f"'{id_protocolo}' deve usar só letras minúsculas sem acento, números e '_'")
        elif id_protocolo != nome_esperado:
            erro("id_protocolo", f"'{id_protocolo}' difere do nome do arquivo; renomeie para {id_protocolo}.md "
                                 f"ou ajuste o campo para '{nome_esperado}'")

    for chave in ("titulo", "diretrizes_referencia"):
        if chave in m and not m[chave]:
            erro(chave, "está vazio")

    if "categoria" in m and m["categoria"] not in CATEGORIAS_PERMITIDAS:
        erro("categoria", f"'{m['categoria']}' inválida; use uma de: {', '.join(CATEGORIAS_PERMITIDAS)}")

    if "cids_relacionados" in m:
        if not m["cids_relacionados"]:
            erro("cids_relacionados", "informe ao menos um CID-10")
        for cid in m["cids_relacionados"]:
            if not PADRAO_CID10.match(cid):
                erro("cids_relacionados", f"CID-10 '{cid}' inválido; formato esperado letra + 2 dígitos "
                                          "e subcategoria opcional, ex.: J02 ou J02.9")
        if len(set(m["cids_relacionados"])) != len(m["cids_relacionados"]):
            erro("cids_relacionados", "há CIDs repetidos")

    for ciap in m.get("ciaps_relacionados", []):
        if not PADRAO_CIAP2.match(ciap):
            erro("ciaps_relacionados", f"CIAP-2 '{ciap}' inválido; formato esperado letra + 2 dígitos, ex.: R74")

    if "farmacos_principais" in m:
        if not m["farmacos_principais"]:
            erro("farmacos_principais", "informe ao menos um fármaco")
        if any(not f for f in m["farmacos_principais"]):
            erro("farmacos_principais", "há item vazio na lista")

    if "nivel_atencao" in m and not PADRAO_NIVEL_ATENCAO.match(m["nivel_atencao"]):
        erro("nivel_atencao", f"'{m['nivel_atencao']}' inválido; use palavras sem acento separadas por '_', "
                              "ex.: Atencao_Primaria_e_Urgencia")

    if "data_revisao" in m:
        try:
            _dt.date.fromisoformat(m["data_revisao"])
        except ValueError:
            erro("data_revisao", f"'{m['data_revisao']}' não é uma data válida no formato AAAA-MM-DD")

    if "status_revisao_clinica" in m and m["status_revisao_clinica"] not in STATUS_PERMITIDOS:
        erro("status_revisao_clinica", f"'{m['status_revisao_clinica']}' inválido; use '{STATUS_PENDENTE}' "
                                       "(padrão) ou 'revisado_por_profissional_habilitado'")

    if "ordem_catalogo" in m and m["ordem_catalogo"] < 1:
        erro("ordem_catalogo", "deve ser maior ou igual a 1")

    for chave, valor in m.items():
        textos = valor if isinstance(valor, list) else [valor]
        if chave == "categoria" and valor not in CATEGORIAS_PERMITIDAS:
            continue  # já reportado acima
        if any(MARCADOR_PENDENTE in str(t) for t in textos):
            erro(chave, f"ainda contém o marcador '{MARCADOR_PENDENTE}' do modelo")


def _validar_corpo(corpo_completo: str, conteudo: str, bloco: str, erro,
                   linha_marcador: Optional[int] = None) -> None:
    quantidade_blocos = corpo_completo.count("```receita")
    if quantidade_blocos == 0:
        erro("corpo", "falta o bloco de receita copiável (abra com ```receita e feche com ```)")
    elif quantidade_blocos > 1:
        erro("corpo", "há mais de um bloco ```receita; use apenas um por arquivo")
    elif not re.search(PADRAO_BLOCO_RECEITA, corpo_completo, flags=re.DOTALL):
        erro("corpo", "o bloco ```receita não foi fechado com ```")
    elif not bloco:
        erro("receita", "o bloco ```receita está vazio")

    if not conteudo:
        erro("corpo", "falta o texto explicativo (critérios, conduta) antes do bloco de receita")

    if MARCADOR_PENDENTE in corpo_completo:
        erro("corpo", f"ainda contém o marcador '{MARCADOR_PENDENTE}' do modelo", linha_marcador)

    receita_minuscula = bloco.lower()
    for frase in FRASES_PSEUDOPOSOLOGIA:
        if frase in receita_minuscula:
            erro("receita", f"contém posologia genérica '{frase}'; escreva dose, via, intervalo e duração")


def carregar_receitas(diretorio: str = DIRETORIO_PROTOCOLOS) -> ResultadoCarga:
    """Carrega e valida todos os .md do diretório, incluindo checagens entre arquivos."""
    resultado = ResultadoCarga()
    for caminho in listar_arquivos_receitas(diretorio):
        receita, erros = analisar_arquivo(caminho)
        resultado.erros.extend(erros)
        if receita:
            resultado.receitas.append(receita)

    vistos_ordem: Dict[int, str] = {}
    for r in resultado.receitas:
        ordem = r.metadados.get("ordem_catalogo")
        if ordem is not None:
            if ordem in vistos_ordem:
                resultado.erros.append(ErroValidacao(
                    r.arquivo, "ordem_catalogo",
                    f"{ordem} já usado em {os.path.basename(vistos_ordem[ordem])}; escolha outro número ou remova o campo"))
            else:
                vistos_ordem[ordem] = r.arquivo

    vistos_titulo: Dict[str, str] = {}
    for r in resultado.receitas:
        t = r.metadados["titulo"].casefold()
        if t in vistos_titulo:
            resultado.erros.append(ErroValidacao(
                r.arquivo, "titulo", f"título repetido de {os.path.basename(vistos_titulo[t])}"))
        else:
            vistos_titulo[t] = r.arquivo
    # Ids são únicos por construção: id_protocolo precisa ser igual ao nome do arquivo.

    resultado.receitas.sort(key=lambda r: (
        r.metadados.get("ordem_catalogo") is None,
        r.metadados.get("ordem_catalogo") or 0,
        r.metadados["titulo"].casefold(),
    ))
    return resultado


# ---------------------------------------------------------------------------
# Saídas geradas
# ---------------------------------------------------------------------------

def gerar_conteudo_typescript(receitas: Sequence[Receita]) -> str:
    protocolos_ts = []
    farmacos: Dict[str, List[str]] = {}
    categorias: Dict[str, str] = {}
    for r in receitas:
        m = r.metadados
        protocolos_ts.append({
            "id_protocolo": m["id_protocolo"],
            "titulo": m["titulo"],
            "cids_relacionados": m["cids_relacionados"],
            "ciaps_relacionados": m["ciaps_relacionados"],
            "nivel_atencao": m["nivel_atencao"],
            "data_revisao": m["data_revisao"],
            "status_revisao_clinica": m["status_revisao_clinica"],
            "conteudo_markdown": r.conteudo_markdown,
            "bloco_prescricao_copiavel": r.bloco_prescricao,
        })
        farmacos[m["id_protocolo"]] = m["farmacos_principais"]
        categorias[m["id_protocolo"]] = m["categoria"]

    return (
        "// ARQUIVO GERADO por etl_pipeline/cadastrar_receitas.py a partir de clinical_content/protocolos/*.md"
        " - NÃO EDITAR MANUALMENTE.\n"
        "import { ProtocoloClinico } from '../types';\n\n"
        "export const PROTOCOLOS_GERADOS: ProtocoloClinico[] = "
        + json.dumps(protocolos_ts, ensure_ascii=False, indent=2)
        + ";\n\nexport const FARMACOS_POR_PROTOCOLO: Record<string, string[]> = "
        + json.dumps(farmacos, ensure_ascii=False, indent=2)
        + ";\n\nexport const CATEGORIAS_POR_PROTOCOLO: Record<string, string> = "
        + json.dumps(categorias, ensure_ascii=False, indent=2)
        + ";\n"
    )


def exportar_typescript(receitas: Sequence[Receita], caminho: str = CAMINHO_TS_PROTOCOLOS) -> bool:
    """Grava o módulo TS. Retorna True se o arquivo mudou."""
    novo = gerar_conteudo_typescript(receitas)
    atual = None
    if os.path.exists(caminho):
        with open(caminho, encoding="utf-8") as f:
            atual = f.read()
    if atual == novo:
        return False
    with open(caminho, "w", encoding="utf-8") as f:
        f.write(novo)
    return True


def sincronizar_banco(receitas: Sequence[Receita], caminho_banco: str) -> Optional[int]:
    """Reescreve as linhas 'protocolo' do FTS5. Retorna None se o banco não tiver o índice."""
    if not os.path.exists(caminho_banco):
        return None
    conexao = sqlite3.connect(caminho_banco)
    try:
        tem_indice = conexao.execute(
            "SELECT 1 FROM sqlite_master WHERE name = 'indice_busca_fts'").fetchone()
        if not tem_indice:
            return None
        with conexao:
            conexao.execute("DELETE FROM indice_busca_fts WHERE tipo_registro = 'protocolo';")
            for r in sorted(receitas, key=lambda r: os.path.basename(r.arquivo)):
                m = r.metadados
                cids, ciaps = m["cids_relacionados"], m["ciaps_relacionados"]
                subtitulo = f"Receita & Conduta ({r.id}) - CIDs: {', '.join(cids)}"
                conteudo_textual = (
                    f"{r.id} {m['titulo']} {' '.join(cids)} {' '.join(ciaps)} {r.corpo_completo} "
                    "receita prescricao receituario conduta"
                )
                conexao.execute(
                    "INSERT INTO indice_busca_fts(tipo_registro, id_referencia, titulo_primario, subtitulo, "
                    "conteudo_textual) VALUES ('protocolo', ?, ?, ?, ?);",
                    (r.id, m["titulo"], subtitulo, conteudo_textual),
                )
        return len(receitas)
    finally:
        conexao.close()


# ---------------------------------------------------------------------------
# Criação de uma receita nova a partir do modelo
# ---------------------------------------------------------------------------

def criar_receita_do_modelo(id_protocolo: str, diretorio: str = DIRETORIO_PROTOCOLOS,
                            caminho_modelo: str = CAMINHO_MODELO) -> str:
    if not PADRAO_ID.match(id_protocolo):
        raise ValueError(f"id '{id_protocolo}' inválido: use letras minúsculas sem acento, números e '_'")
    destino = os.path.join(diretorio, f"{id_protocolo}.md")
    if os.path.exists(destino):
        raise FileExistsError(f"{destino} já existe")
    with open(caminho_modelo, encoding="utf-8") as f:
        modelo = f.read()
    modelo = re.sub(r'(?m)^id_protocolo:.*$', f'id_protocolo: "{id_protocolo}"', modelo, count=1)
    modelo = re.sub(r'(?m)^data_revisao:.*$', f'data_revisao: "{_dt.date.today().isoformat()}"', modelo, count=1)
    with open(destino, "w", encoding="utf-8") as f:
        f.write(modelo)
    return destino


# ---------------------------------------------------------------------------
# Linha de comando
# ---------------------------------------------------------------------------

def main(argv: Optional[Sequence[str]] = None) -> int:
    for fluxo in (sys.stdout, sys.stderr):
        try:
            fluxo.reconfigure(encoding="utf-8")
        except (AttributeError, ValueError):
            pass

    parser = argparse.ArgumentParser(
        description="Valida as receitas em clinical_content/protocolos/*.md e regenera frontend e índice de busca.")
    parser.add_argument("--validar", action="store_true", help="só valida; não grava nenhum arquivo")
    parser.add_argument("--nova", metavar="ID", help="cria clinical_content/protocolos/ID.md a partir do _MODELO.md")
    parser.add_argument("--sem-banco", action="store_true", help="não atualiza o índice de busca dos bancos SQLite")
    parser.add_argument("--banco", action="append", metavar="CAMINHO",
                        help="banco SQLite a atualizar (pode repetir); padrão: banco do ETL e do app desktop")
    parser.add_argument("--diretorio", default=DIRETORIO_PROTOCOLOS, help=argparse.SUPPRESS)
    parser.add_argument("--saida-ts", default=CAMINHO_TS_PROTOCOLOS, help=argparse.SUPPRESS)
    args = parser.parse_args(argv)

    if args.nova:
        try:
            destino = criar_receita_do_modelo(args.nova, args.diretorio)
        except (ValueError, FileExistsError) as e:
            print(f"[ERRO] {e}", file=sys.stderr)
            return 1
        print(f"Criado: {destino}")
        print("Preencha todos os campos marcados com PREENCHER e rode este script de novo para validar.")
        return 0

    resultado = carregar_receitas(args.diretorio)
    if resultado.erros:
        for e in resultado.erros:
            print(str(e), file=sys.stderr)
        arquivos = len({e.arquivo for e in resultado.erros})
        print(f"\n{len(resultado.erros)} erro(s) em {arquivos} arquivo(s). Nada foi gravado.", file=sys.stderr)
        return 1

    total = len(resultado.receitas)
    pendentes = sum(1 for r in resultado.receitas if r.metadados["status_revisao_clinica"] == STATUS_PENDENTE)
    print(f"OK: {total} receitas válidas ({pendentes} pendentes de revisão clínica).")
    if args.validar:
        return 0

    mudou = exportar_typescript(resultado.receitas, args.saida_ts)
    print(f"Frontend: {args.saida_ts} {'atualizado' if mudou else 'já estava em dia'}.")

    if not args.sem_banco:
        for caminho in args.banco or BANCOS_PADRAO:
            n = sincronizar_banco(resultado.receitas, caminho)
            if n is None:
                print(f"Banco ignorado (inexistente ou sem indice_busca_fts): {caminho}")
            else:
                print(f"Banco: {n} receitas indexadas na busca em {caminho}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
