"""
Compilação e validação de Protocolos Clínicos Internacionais (NICE, CDC, FDA, OMS, etc.).

Lê os arquivos de:
    clinical_content/protocolos_internacionais/<id_protocolo>.md

Gera o bundle TypeScript para o frontend Web/PWA:
    frontend_ui/src/data/protocolos_internacionais_gerados.ts
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from typing import Any, Dict, List, Optional, Tuple
import yaml

DIRETORIO_ETL = os.path.dirname(os.path.abspath(__file__))
DIRETORIO_RAIZ = os.path.abspath(os.path.join(DIRETORIO_ETL, ".."))
DIRETORIO_INTERNACIONAIS = os.path.join(DIRETORIO_RAIZ, "clinical_content", "protocolos_internacionais")
CAMINHO_TS_INTERNACIONAIS = os.path.join(DIRETORIO_RAIZ, "frontend_ui", "src", "data", "protocolos_internacionais_gerados.ts")

ARQUIVOS_IGNORADOS = {"_MODELO_INTERNACIONAL.md", "INDICE_PROTOCOLOS_INTERNACIONAIS.md", "README.md"}
PADRAO_BLOCO_RECEITA = re.compile(r"```(?:receita|prescricao)\s*\n(.*?)```", re.DOTALL | re.IGNORECASE)


def mapear_jurisdicao(pais: str, agencia: str) -> str:
    p = pais.lower()
    a = agencia.lower()
    if "reino unido" in p or "nice" in a or "uk" in p:
        return "UK_NICE"
    if "estados unidos" in p or "eua" in p or "cdc" in a or "fda" in a:
        return "US_CDC_FDA"
    if "global" in p or "oms" in a or "who" in a or "mundial" in p:
        return "GLOBAL_WHO"
    if "canad" in p or "health canada" in a:
        return "CA_HEALTH"
    if "fran" in p or "has" in a:
        return "FR_HAS"
    return "UK_NICE"


def separar_frontmatter(conteudo: str) -> Tuple[Dict[str, Any], str]:
    if not conteudo.startswith("---"):
        raise ValueError("Arquivo não inicia com '---' de frontmatter YAML")
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


def processar_protocolos_internacionais() -> List[Dict[str, Any]]:
    if not os.path.exists(DIRETORIO_INTERNACIONAIS):
        return []

    protocolos = []
    arquivos = sorted(os.listdir(DIRETORIO_INTERNACIONAIS))

    for nome in arquivos:
        if not nome.endswith(".md") or nome in ARQUIVOS_IGNORADOS or nome.startswith("_"):
            continue
        caminho = os.path.join(DIRETORIO_INTERNACIONAIS, nome)
        with open(caminho, "r", encoding="utf-8") as f:
            conteudo = f.read()

        try:
            meta, corpo = separar_frontmatter(conteudo)
        except Exception as e:
            print(f"[AVISO] Ignorando {nome} por erro de frontmatter: {e}")
            continue

        id_protocolo = meta.get("id_protocolo", os.path.splitext(nome)[0])
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

        protocolos.append({
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
        })

    return protocolos


def gerar_bundle_ts(protocolos: List[Dict[str, Any]]) -> str:
    farmacos: Dict[str, List[str]] = {}
    categorias: Dict[str, str] = {}

    for p in protocolos:
        farmacos[p["id_protocolo"]] = p.get("medicamentos_exclusivos_estrangeiros", [])
        categorias[p["id_protocolo"]] = p.get("categoria", "clinica_geral")

    ts_content = (
        "// ARQUIVO GERADO por etl_pipeline/cadastrar_protocolos_internacionais.py - NÃO EDITAR MANUALMENTE.\n"
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


def main():
    protocolos = processar_protocolos_internacionais()
    print(f"Processados {len(protocolos)} protocolos internacionais.")
    ts_code = gerar_bundle_ts(protocolos)
    os.makedirs(os.path.dirname(CAMINHO_TS_INTERNACIONAIS), exist_ok=True)
    with open(CAMINHO_TS_INTERNACIONAIS, "w", encoding="utf-8") as f:
        f.write(ts_code)
    print(f"Bundle TypeScript gravado com sucesso em: {CAMINHO_TS_INTERNACIONAIS}")


if __name__ == "__main__":
    main()
