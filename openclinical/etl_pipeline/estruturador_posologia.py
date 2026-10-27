import re
import json
import os
import sys
import socket
from urllib.parse import urlparse
from typing import Dict, Any, Optional

diretorio_atual = os.path.dirname(os.path.abspath(__file__))
if diretorio_atual not in sys.path:
    sys.path.insert(0, diretorio_atual)

import requests
from schemas_dominio import PosologiaEstruturadaSchema, FaixaAjusteRenalSchema


def _servico_llm_ativo(endpoint_url: str, timeout: float = 0.2) -> bool:
    try:
        parsed = urlparse(endpoint_url)
        host = parsed.hostname or "127.0.0.1"
        porta = parsed.port or (443 if parsed.scheme == "https" else 80)
        with socket.create_connection((host, porta), timeout=timeout):
            return True
    except (socket.timeout, ConnectionRefusedError, OSError):
        return False


class EstruturadorPosologia:
    """
    Cliente de inferência estruturada que processa o texto clínico bruto da posologia
    e retorna instâncias validadas de PosologiaEstruturadaSchema utilizando LLMs locais
    (Ollama / LiteLLM / vLLM) com fallback analítico determinístico baseado em padrões clínicos.
    """

    def __init__(self, endpoint_url: str = "http://127.0.0.1:11434/api/generate", modelo: str = "medllama2") -> None:
        self.endpoint_url = endpoint_url
        self.modelo = modelo

    def construir_prompt_extracao(self, texto_posologia: str) -> str:
        prompt = f"""Você é um especialista em farmacologia clínica e extração estruturada de dados médicos.
Analise o seguinte trecho textual de posologia extraído de uma bula médica da ANVISA:

\"\"\"{texto_posologia}\"\"\"

Extraia as seguintes informações no formato JSON estrito, sem explicações ou formatação markdown adicional:
{{
    "dose_pediatrica_mg_kg_dia_min": número float ou null,
    "dose_pediatrica_mg_kg_dia_max": número float ou null,
    "dose_maxima_diaria_mg": número float ou null,
    "fracionamento_diario_sugerido": número inteiro (ex: 1, 2, 3, 4) ou null,
    "ajustes_renais": [
        {{
            "tfg_min": float,
            "tfg_max": float,
            "posologia_recomendada": "descrição da conduta para esta faixa"
        }}
    ],
    "resumo_posologico_adulto": "resumo claro e direto do regime usual em adultos"
}}
"""
        return prompt

    def extrair_com_llm(self, texto_posologia: str, timeout_segundos: float = 2.0) -> Optional[PosologiaEstruturadaSchema]:
        if not _servico_llm_ativo(self.endpoint_url, timeout=0.15):
            return None

        prompt = self.construir_prompt_extracao(texto_posologia)
        payload = {
            "model": self.modelo,
            "prompt": prompt,
            "stream": False,
            "format": "json",
        }

        try:
            resposta = requests.post(self.endpoint_url, json=payload, timeout=timeout_segundos)
            if resposta.status_code == 200:
                dados_json = resposta.json()
                resposta_texto = dados_json.get("response", "")
                dados_extraidos = json.loads(resposta_texto)
                return PosologiaEstruturadaSchema.model_validate(dados_extraidos)
        except Exception:
            # Em caso de indisponibilidade do serviço local, ativa fallback determinístico
            pass

        return None

    def extrair_deterministico(self, texto_posologia: str) -> PosologiaEstruturadaSchema:
        """
        Parser determinístico por expressões regulares para garantia de execução
        offline e testes contínuos sem dependência de serviços externos.
        """
        # Extração de dose pediátrica mg/kg/dia
        padrao_pediatrico = re.search(
            r"(\d+(?:[.,]\d+)?)\s*(?:a|até|-)\s*(\d+(?:[.,]\d+)?)\s*mg/kg/dia",
            texto_posologia,
            re.IGNORECASE,
        )
        dose_ped_min = None
        dose_ped_max = None
        if padrao_pediatrico:
            dose_ped_min = float(padrao_pediatrico.group(1).replace(",", "."))
            dose_ped_max = float(padrao_pediatrico.group(2).replace(",", "."))
        else:
            padrao_unico = re.search(r"(\d+(?:[.,]\d+)?)\s*mg/kg/dia", texto_posologia, re.IGNORECASE)
            if padrao_unico:
                valor = float(padrao_unico.group(1).replace(",", "."))
                dose_ped_min = valor
                dose_ped_max = valor

        # Extração de dose máxima diária
        padrao_maxima = re.search(
            r"(?:dose\s+máxima(?:\s+diária)?|máximo\s+de)\s*(?:de\s+)?(\d+(?:[.,]\d+)?)\s*mg",
            texto_posologia,
            re.IGNORECASE,
        )
        dose_max_diaria = None
        if padrao_maxima:
            dose_max_diaria = float(padrao_maxima.group(1).replace(",", "."))

        # Fracionamento diário
        fracionamento = None
        if re.search(r"a\s+cada\s+6\s+horas|6/6\s*h|4\s+vezes\s+ao\s+dia", texto_posologia, re.IGNORECASE):
            fracionamento = 4
        elif re.search(r"a\s+cada\s+8\s+horas|8/8\s*h|3\s+vezes\s+ao\s+dia", texto_posologia, re.IGNORECASE):
            fracionamento = 3
        elif re.search(r"a\s+cada\s+12\s+horas|12/12\s*h|2\s+vezes\s+ao\s+dia|duas\s+vezes", texto_posologia, re.IGNORECASE):
            fracionamento = 2
        elif re.search(r"uma\s+vez\s+ao\s+dia|a\s+cada\s+24\s+horas|24/24\s*h|dose\s+única\s+diária", texto_posologia, re.IGNORECASE):
            fracionamento = 1

        # Extração de faixas de clearance renal
        ajustes_renais = []
        if re.search(r"clearance|filtração|renal|tfg", texto_posologia, re.IGNORECASE):
            if "tfg < 30" in texto_posologia.lower() or "clearance inferior a 30" in texto_posologia.lower():
                ajustes_renais.append(
                    FaixaAjusteRenalSchema(
                        tfg_min=0.0,
                        tfg_max=29.9,
                        posologia_recomendada="Reduzir posologia em 50% ou ajustar conforme monitoramento de função renal.",
                    )
                )
            if "tfg 30 a 50" in texto_posologia.lower() or "clearance de 30 a 50" in texto_posologia.lower():
                ajustes_renais.append(
                    FaixaAjusteRenalSchema(
                        tfg_min=30.0,
                        tfg_max=50.0,
                        posologia_recomendada="Manter dose usual com monitoramento rigoroso.",
                    )
                )

        primeiro_periodo = texto_posologia.split("\n")[0].strip()
        resumo_adulto = primeiro_periodo if len(primeiro_periodo) > 5 else texto_posologia[:150]

        return PosologiaEstruturadaSchema(
            dose_pediatrica_mg_kg_dia_min=dose_ped_min,
            dose_pediatrica_mg_kg_dia_max=dose_ped_max,
            dose_maxima_diaria_mg=dose_max_diaria,
            fracionamento_diario_sugerido=fracionamento,
            ajustes_renais=ajustes_renais,
            resumo_posologico_adulto=resumo_adulto,
        )

    def estruturar(self, texto_posologia: str, tentar_llm: bool = False) -> PosologiaEstruturadaSchema:
        if tentar_llm:
            resultado_llm = self.extrair_com_llm(texto_posologia)
            if resultado_llm is not None:
                return resultado_llm
        return self.extrair_deterministico(texto_posologia)


if __name__ == "__main__":
    estruturador = EstruturadorPosologia()
    exemplo = "Em adultos, administrar 500 mg a cada 8 horas. Em crianças, a dose usual é de 25 a 50 mg/kg/dia divididos a cada 8 horas. Dose máxima diária de 3000 mg."
    resultado = estruturador.estruturar(exemplo)
    print("Resultado da estruturação posológica:")
    print(resultado.model_dump_json(indent=2))
