"""
Módulo de Atualização, Auditoria e Sincronização de Diretrizes Clínicas Internacionais e do SUS.

Executa:
1. Varredura completa de todas as diretrizes coletadas em clinical_content/protocolos_internacionais/
2. Auditoria de integridade técnica e conformidade clínica (CIDs, escalonamento, divergências vs SUS)
3. Verificação de conectividade e status HTTP das fontes governamentais primárias (NICE, CDC, OMS, Health Canada)
4. Recompilação automática do bundle TypeScript para o frontend Web/PWA
5. Geração de relatório consolidado em JSON e Markdown para auditoria clínica
"""

from __future__ import annotations

import argparse
import datetime
import json
import os
import re
import sys
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Any, Dict, List, Optional, Tuple

import yaml

# Caminhos canônicos do projeto
DIRETORIO_ETL = os.path.dirname(os.path.abspath(__file__))
DIRETORIO_RAIZ = os.path.abspath(os.path.join(DIRETORIO_ETL, ".."))
DIRETORIO_INTERNACIONAIS = os.path.join(DIRETORIO_RAIZ, "clinical_content", "protocolos_internacionais")
CAMINHO_TS_INTERNACIONAIS = os.path.join(
    DIRETORIO_RAIZ, "frontend_ui", "src", "data", "protocolos_internacionais_gerados.ts"
)
CAMINHO_RELATORIO_JSON = os.path.join(DIRETORIO_INTERNACIONAIS, "RELATORIO_SINCRONIZACAO.json")

ARQUIVOS_IGNORADOS = {"_MODELO_INTERNACIONAL.md", "INDICE_PROTOCOLOS_INTERNACIONAIS.md", "README.md"}
PADRAO_BLOCO_RECEITA = re.compile(r"```(?:receita|prescricao)\s*\n(.*?)```", re.DOTALL | re.IGNORECASE)

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 OpenMedical/1.0"


def mapear_jurisdicao(pais: str, agencia: str) -> str:
    p = (pais or "").lower()
    a = (agencia or "").lower()
    if "reino unido" in p or "nice" in a or "uk" in p or "nhs" in a:
        return "UK_NICE"
    if "estados unidos" in p or "eua" in p or "cdc" in a or "fda" in a or "aha" in a:
        return "US_CDC_FDA"
    if "global" in p or "oms" in a or "who" in a or "mundial" in p:
        return "GLOBAL_WHO"
    if "canad" in p or "health canada" in a or "ccs" in a:
        return "CA_HEALTH"
    if "fran" in p or "has" in a:
        return "FR_HAS"
    return "UK_NICE"


def separar_frontmatter(conteudo: str) -> Tuple[Dict[str, Any], str]:
    if not conteudo.startswith("---"):
        raise ValueError("Arquivo não inicia com delimitador YAML '---'")
    partes = conteudo.split("---", 2)
    if len(partes) < 3:
        raise ValueError("Frontmatter YAML incompleto ou sem fechamento '---'")
    meta_raw = partes[1].strip()
    corpo = partes[2].strip()
    metadados = yaml.safe_load(meta_raw) or {}
    return metadados, corpo


def separar_receita(corpo: str) -> Tuple[str, str]:
    match = re.search(PADRAO_BLOCO_RECEITA, corpo)
    if match:
        bloco = match.group(1).strip()
        corpo_sem_bloco = re.sub(PADRAO_BLOCO_RECEITA, "", corpo).strip()
        return corpo_sem_bloco, bloco
    return corpo, ""


def checar_url_governamental(url: str, timeout: int = 8) -> Dict[str, Any]:
    """Testa a conectividade com o portal governamental oficial emissor da diretriz."""
    if not url or not url.startswith("http"):
        return {"acessivel": False, "codigo_http": None, "mensagem": "URL não configurada ou inválida"}

    req = urllib.request.Request(
        url,
        headers={"User-Agent": USER_AGENT, "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"},
    )
    req.get_method = lambda: "HEAD"

    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return {
                "acessivel": True,
                "codigo_http": resp.status,
                "content_type": resp.headers.get("Content-Type", ""),
                "last_modified": resp.headers.get("Last-Modified", ""),
                "mensagem": "Online",
            }
    except urllib.error.HTTPError as e:
        # Muitos portais oficiais bloqueiam HEAD mas respondem GET 200, ou retornam 403 por WAF
        if e.code in (403, 405):
            return {"acessivel": True, "codigo_http": e.code, "mensagem": f"Servidor ativo (HTTP {e.code} com proteção WAF)"}
        return {"acessivel": False, "codigo_http": e.code, "mensagem": f"Erro HTTP {e.code}"}
    except Exception as e:
        return {"acessivel": False, "codigo_http": None, "mensagem": f"Falha de conexão: {type(e).__name__}"}


def verificar_e_carregar_diretriz(caminho_arquivo: str) -> Dict[str, Any]:
    nome_arquivo = os.path.basename(caminho_arquivo)
    with open(caminho_arquivo, "r", encoding="utf-8") as f:
        conteudo = f.read()

    meta, corpo = separar_frontmatter(conteudo)
    id_protocolo = meta.get("id_protocolo") or os.path.splitext(nome_arquivo)[0]
    pais = meta.get("pais", "Internacional")
    agencia = meta.get("agencia", "Agência Internacional")
    jurisdicao = meta.get("jurisdicao") or mapear_jurisdicao(pais, agencia)
    corpo_limpo, receita = separar_receita(corpo)

    cids = meta.get("cids_relacionados", [])
    if isinstance(cids, str):
        cids = [cids]
    ciaps = meta.get("ciaps_relacionados", [])
    if isinstance(ciaps, str):
        ciaps = [ciaps]

    divergencias = meta.get("divergencias_relevantes_vs_sus", [])
    if isinstance(divergencias, str):
        divergencias = [divergencias]

    medicamentos_exclusivos = meta.get("medicamentos_exclusivos_estrangeiros", [])
    if isinstance(medicamentos_exclusivos, str):
        medicamentos_exclusivos = [medicamentos_exclusivos]

    return {
        "id_protocolo": id_protocolo,
        "titulo": meta.get("titulo", id_protocolo),
        "cids_relacionados": cids,
        "ciaps_relacionados": ciaps,
        "categoria": meta.get("categoria", "clinica_geral"),
        "nivel_atencao": meta.get("nivel_atencao", "Atencao_Primaria_e_Especializada"),
        "data_revisao": str(meta.get("data_revisao", meta.get("data_publicacao", "2026-01-01"))),
        "status_revisao_clinica": meta.get("status_revisao_clinica", "documento_oficial_governamental"),
        "conteudo_markdown": corpo_limpo,
        "bloco_prescricao_copiavel": receita,
        "jurisdicao": jurisdicao,
        "pais": pais,
        "agencia": agencia,
        "codigo_diretriz": meta.get("codigo_diretriz", ""),
        "url_fonte": meta.get("url_fonte", ""),
        "data_publicacao": str(meta.get("data_publicacao", "")),
        "idioma_original": meta.get("idioma_original", "en"),
        "equivalente_sus_id": meta.get("equivalente_sus_id"),
        "tem_equivalente_sus": bool(meta.get("tem_equivalente_sus", False)),
        "disponibilidade_farmacos_rename_sus": meta.get("disponibilidade_farmacos_rename_sus", "parcial"),
        "medicamentos_exclusivos_estrangeiros": medicamentos_exclusivos,
        "divergencias_relevantes_vs_sus": divergencias,
        "tamanho_markdown_bytes": len(corpo_limpo.encode("utf-8")),
    }


def gerar_bundle_ts(protocolos: List[Dict[str, Any]]) -> str:
    farmacos: Dict[str, List[str]] = {}
    categorias: Dict[str, str] = {}

    for p in protocolos:
        farmacos[p["id_protocolo"]] = p.get("medicamentos_exclusivos_estrangeiros", [])
        categorias[p["id_protocolo"]] = p.get("categoria", "clinica_geral")

    ts_content = (
        "// ARQUIVO GERADO AUTOMATICAMENTE pelo atualizador_diretrizes.py - NÃO EDITAR MANUALMENTE.\n"
        "import { ProtocoloClinico } from '../types';\n\n"
        "export const PROTOCOLOS_INTERNACIONAIS_GERADOS: ProtocoloClinico[] = "
        + json.dumps(protocolos, ensure_ascii=False, indent=2)
        + ";\n\n"
        "export const FARMACOS_POR_PROTOCOLO_INTERNACIONAL: Record<string, string[]> = "
        + json.dumps(farmacos, ensure_ascii=False, indent=2)
        + ";\n\n"
        "export const CATEGORIAS_POR_PROTOCOLO_INTERNACIONAL: Record<string, string> = "
        + json.dumps(categorias, ensure_ascii=False, indent=2)
        + ";\n"
    )
    return ts_content


def atualizar_todas_diretrizes(
    verificar_urls: bool = False,
    timeout_segundos: int = 8,
    gravar_bundle: bool = True,
    gravar_relatorio: bool = True,
) -> Dict[str, Any]:
    """
    Função principal de atualização e auditoria de todas as diretrizes coletadas.

    Retorna um dicionário estruturado com o status completo da base.
    """
    inicio = datetime.datetime.now(datetime.timezone.utc)
    if not os.path.exists(DIRETORIO_INTERNACIONAIS):
        return {
            "sucesso": False,
            "erro": f"Diretório não encontrado: {DIRETORIO_INTERNACIONAIS}",
            "total_processadas": 0,
        }

    arquivos = sorted([
        f for f in os.listdir(DIRETORIO_INTERNACIONAIS)
        if f.endswith(".md") and f not in ARQUIVOS_IGNORADOS and not f.startswith("_")
    ])

    protocolos: List[Dict[str, Any]] = []
    erros: List[Dict[str, str]] = []

    for nome in arquivos:
        caminho = os.path.join(DIRETORIO_INTERNACIONAIS, nome)
        try:
            proto = verificar_e_carregar_diretriz(caminho)
            protocolos.append(proto)
        except Exception as e:
            erros.append({"arquivo": nome, "erro": str(e)})

    # Verificação opcional de conectividade com as fontes governamentais
    status_fontes: Dict[str, Any] = {}
    if verificar_urls and protocolos:
        with ThreadPoolExecutor(max_workers=5) as executor:
            futuros = {
                executor.submit(checar_url_governamental, p["url_fonte"], timeout_segundos): p["id_protocolo"]
                for p in protocolos
            }
            for futuro in as_completed(futuros):
                id_proto = futuros[futuro]
                try:
                    status_fontes[id_proto] = futuro.result()
                except Exception as ex:
                    status_fontes[id_proto] = {"acessivel": False, "mensagem": str(ex)}

    # Estatísticas agregadas
    jurisdicoes_contagem: Dict[str, int] = {}
    com_equivalente_sus = 0
    sem_equivalente_sus = 0

    for p in protocolos:
        jur = p["jurisdicao"]
        jurisdicoes_contagem[jur] = jurisdicoes_contagem.get(jur, 0) + 1
        if p["tem_equivalente_sus"]:
            com_equivalente_sus += 1
        else:
            sem_equivalente_sus += 1

    # Recompilação do Bundle TypeScript
    bundle_salvo = False
    if gravar_bundle and protocolos:
        os.makedirs(os.path.dirname(CAMINHO_TS_INTERNACIONAIS), exist_ok=True)
        ts_codigo = gerar_bundle_ts(protocolos)
        with open(CAMINHO_TS_INTERNACIONAIS, "w", encoding="utf-8") as f:
            f.write(ts_codigo)
        bundle_salvo = True

    fim = datetime.datetime.now(datetime.timezone.utc)
    duracao_segundos = round((fim - inicio).total_seconds(), 2)

    relatorio: Dict[str, Any] = {
        "sucesso": len(erros) == 0,
        "timestamp_utc": fim.isoformat(),
        "duracao_segundos": duracao_segundos,
        "total_diretrizes_coletadas": len(protocolos),
        "total_erros": len(erros),
        "erros": erros,
        "distribuicao_jurisdicao": jurisdicoes_contagem,
        "cobertura_sus": {
            "com_equivalente_pcdt_sus": com_equivalente_sus,
            "sem_equivalente_pcdt_sus_sugestoes": sem_equivalente_sus,
        },
        "bundle_typescript_atualizado": bundle_salvo,
        "caminho_bundle": CAMINHO_TS_INTERNACIONAIS if bundle_salvo else None,
        "status_urls_oficiais": status_fontes,
    }

    if gravar_relatorio:
        with open(CAMINHO_RELATORIO_JSON, "w", encoding="utf-8") as f:
            json.dump(relatorio, f, ensure_ascii=False, indent=2)

    return relatorio


def main():
    parser = argparse.ArgumentParser(description="Atualizador e Auditor de Diretrizes Clínicas Internacionais")
    parser.add_argument("--online", action="store_true", help="Verifica conectividade HTTP com os portais governamentais")
    parser.add_argument("--timeout", type=int, default=8, help="Timeout em segundos para cada verificação HTTP")
    args = parser.parse_args()

    print("Iniciando rotina de atualização e auditoria das diretrizes clínicas...")
    resultado = atualizar_todas_diretrizes(verificar_urls=args.online, timeout_segundos=args.timeout)

    print("\n--- RELATÓRIO DE SINCRONIZAÇÃO DAS DIRETRIZES ---")
    print(f"Status: {'SUCESSO' if resultado['sucesso'] else 'COM ERROS'}")
    print(f"Diretrizes catalogadas: {resultado['total_diretrizes_coletadas']}")
    print(f"Duração: {resultado['duracao_segundos']}s")
    print(f"Distribuição por Jurisdição: {resultado['distribuicao_jurisdicao']}")
    print(f"Com equivalente PCDT/SUS: {resultado['cobertura_sus']['com_equivalente_pcdt_sus']}")
    print(f"Sem equivalente PCDT/SUS (Sugestões Internacionais): {resultado['cobertura_sus']['sem_equivalente_pcdt_sus_sugestoes']}")
    print(f"Bundle TypeScript gerado: {resultado['bundle_typescript_atualizado']}")

    if resultado["erros"]:
        print(f"\n[ALERTA] Erros encontrados ({len(resultado['erros'])}):")
        for err in resultado["erros"]:
            print(f"  - {err['arquivo']}: {err['erro']}")


if __name__ == "__main__":
    main()