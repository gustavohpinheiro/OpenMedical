import re
import os
from typing import Dict, List, Optional
import fitz  # PyMuPDF
from pydantic import BaseModel, Field, ConfigDict


class SecaoBulaSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")

    numero_secao: int = Field(..., description="Número da seção regulatória RDC 47/2009")
    titulo_secao: str = Field(..., description="Nome do tópico da seção")
    conteudo_texto: str = Field(..., description="Texto limpo e extraído da seção")


class BulaProcessadaPdfSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")

    caminho_arquivo: str = Field(..., description="Caminho do arquivo PDF processado")
    total_paginas: int = Field(..., ge=1, description="Contagem total de páginas do documento")
    secoes: Dict[str, str] = Field(default_factory=dict, description="Dicionário mapeando nome da seção para o texto")
    texto_completo: str = Field(..., description="Texto bruto extraído de todo o documento")


class ExtratorPdfBulas:
    """
    Extrator de texto e segmentador de seções de bulas regulatórias conforme normas
    da RDC 47/2009 da ANVISA para bulas de profissionais de saúde e pacientes.
    """

    # Padrões de cabeçalho para fatiamento regulatório (RDC 47/2009)
    PADROES_SECOES = {
        "indicacoes": re.compile(
            r"(?:^|\n)\s*(?:1\.?\s*(?:INDICAÇÕES|PARA\s+QUE\s+ESTE\s+MEDICAMENTO\s+É\s+INDICADO\??|INDICAÇÕES\s+TERAPÊUTICAS))",
            re.IGNORECASE,
        ),
        "resultados_eficacia": re.compile(
            r"(?:^|\n)\s*(?:2\.?\s*(?:RESULTADOS\s+DE\s+EFICÁCIA|COMO\s+ESTE\s+MEDICAMENTO\s+FUNCIONA\??))",
            re.IGNORECASE,
        ),
        "contraindicacoes": re.compile(
            r"(?:^|\n)\s*(?:3\.?\s*(?:CONTRAINDICAÇÕES|QUANDO\s+NÃO\s+DEVO\s+USAR\s+ESTE\s+MEDICAMENTO\??))",
            re.IGNORECASE,
        ),
        "advertencias_precaucoes": re.compile(
            r"(?:^|\n)\s*(?:4\.?\s*O\s+QUE\s+DEVO\s+SABER\s+ANTES\s+DE\s+USAR\s+ESTE\s+MEDICAMENTO\??|5\.?\s*(?:ADVERTÊNCIAS\s+E\s+PRECAUÇÕES|ADVERTÊNCIAS))",
            re.IGNORECASE,
        ),
        "interacoes_medicamentosas": re.compile(
            r"(?:^|\n)\s*(?:6\.?\s*(?:INTERAÇÕES\s+MEDICAMENTOSAS|INTERAÇÕES))",
            re.IGNORECASE,
        ),
        "cuidados_armazenamento": re.compile(
            r"(?:^|\n)\s*(?:5\.?\s*ONDE,\s*COMO\s*E\s*POR\s*QUANTO\s*TEMPO\s*POSSO\s*GUARDAR|7\.?\s*CUIDADOS\s+DE\s+ARMAZENAMENTO)",
            re.IGNORECASE,
        ),
        "posologia_modo_usar": re.compile(
            r"(?:^|\n)\s*(?:6\.?\s*COMO\s+DEVO\s+USAR\s+ESTE\s+MEDICAMENTO\??|8\.?\s*(?:POSOLOGIA\s+E\s+MODO\s+DE\s+USAR|POSOLOGIA))",
            re.IGNORECASE,
        ),
        "reacoes_adversas": re.compile(
            r"(?:^|\n)\s*(?:7\.?\s*QUAIS\s+OS\s+MALES\s+QUE\s+ESTE\s+MEDICAMENTO\s+PODE\s+ME\s+CAUSAR\??|9\.?\s*(?:REAÇÕES\s+ADVERSAS|EVENTOS\s+ADVERSOS))",
            re.IGNORECASE,
        ),
        "superdose": re.compile(
            r"(?:^|\n)\s*(?:8\.?\s*O\s+QUE\s+FAZER\s+SE\s+ALGUÉM\s+USAR\s+UMA\s+QUANTIDADE\s+MAIOR|10\.?\s*SUPERDOSE)",
            re.IGNORECASE,
        ),
    }

    def __init__(self) -> None:
        pass

    def extrair_texto_pdf(self, caminho_pdf: str) -> str:
        if not os.path.exists(caminho_pdf):
            raise FileNotFoundError(f"Arquivo PDF não encontrado: {caminho_pdf}")

        doc = fitz.open(caminho_pdf)
        paginas_texto: List[str] = []

        for num_pagina in range(len(doc)):
            pagina = doc[num_pagina]
            texto = pagina.get_text("text")
            paginas_texto.append(texto)

        doc.close()
        return "\n".join(paginas_texto)

    def fatiar_secoes_rdc47(self, texto_completo: str) -> Dict[str, str]:
        # Encontra as posições de início de cada cabeçalho detectado
        posicoes: List[tuple] = []
        for chave, padrao in self.PADROES_SECOES.items():
            for correspondencia in padrao.finditer(texto_completo):
                posicoes.append((correspondencia.start(), correspondencia.end(), chave))

        # Ordena as seções pela ordem de aparição no documento
        posicoes.sort(key=lambda item: item[0])

        secoes_extraidas: Dict[str, str] = {}
        for indice, (inicio, fim_cabecalho, chave) in enumerate(posicoes):
            if indice + 1 < len(posicoes):
                proximo_inicio = posicoes[indice + 1][0]
                conteudo = texto_completo[fim_cabecalho:proximo_inicio].strip()
            else:
                conteudo = texto_completo[fim_cabecalho:].strip()

            if chave not in secoes_extraidas or len(conteudo) > len(secoes_extraidas[chave]):
                secoes_extraidas[chave] = self.limpar_texto(conteudo)

        return secoes_extraidas

    def limpar_texto(self, texto_bruto: str) -> str:
        # Normalização de quebras de linha e remoção de hifens de quebra de palavra
        texto_limpo = re.sub(r"-\n\s*", "", texto_bruto)
        texto_limpo = re.sub(r"[ \t]+", " ", texto_limpo)
        texto_limpo = re.sub(r"\n\s*\n+", "\n\n", texto_limpo)
        return texto_limpo.strip()

    def processar_arquivo_bula(self, caminho_pdf: str) -> BulaProcessadaPdfSchema:
        doc = fitz.open(caminho_pdf)
        total_paginas = len(doc)
        doc.close()

        texto_completo = self.extrair_texto_pdf(caminho_pdf)
        secoes = self.fatiar_secoes_rdc47(texto_completo)

        return BulaProcessadaPdfSchema(
            caminho_arquivo=caminho_pdf,
            total_paginas=total_paginas,
            secoes=secoes,
            texto_completo=texto_completo,
        )


if __name__ == "__main__":
    print("Módulo extrator_pdf_bulas pronto para processamento de bulas ANVISA RDC 47/2009.")
