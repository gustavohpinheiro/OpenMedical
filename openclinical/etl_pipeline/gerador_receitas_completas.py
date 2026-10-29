"""
Compatibilidade: as receitas deixaram de ser escritas neste arquivo Python.

A fonte única agora são os arquivos ``clinical_content/protocolos/*.md``; validação e geração
do frontend/índice de busca ficam em ``cadastrar_receitas.py``. Este módulo só expõe a lista
no formato antigo (``TODOS_PROTOCOLOS``) para scripts que ainda o importam e nunca grava .md.
"""

import os
import sys
from typing import Any, Dict, List

diretorio_atual = os.path.dirname(os.path.abspath(__file__))
if diretorio_atual not in sys.path:
    sys.path.insert(0, diretorio_atual)

import cadastrar_receitas as _cadastro  # noqa: E402
from cadastrar_receitas import (  # noqa: E402,F401
    CAMINHO_TS_PROTOCOLOS,
    DIRETORIO_PROTOCOLOS,
    STATUS_PENDENTE as STATUS_REVISAO_CLINICA,
    separar_corpo_e_receita,
)


def _carregar_no_formato_antigo() -> List[Dict[str, Any]]:
    resultado = _cadastro.carregar_receitas()
    if resultado.erros:
        raise ValueError("Receitas inválidas:\n" + "\n".join(str(e) for e in resultado.erros))
    return [
        {
            "id_protocolo": r.id,
            "titulo": r.metadados["titulo"],
            "cids": r.metadados["cids_relacionados"],
            "ciaps": r.metadados["ciaps_relacionados"],
            "nivel_atencao": r.metadados["nivel_atencao"],
            "diretrizes": r.metadados["diretrizes_referencia"],
            "data_revisao": r.metadados["data_revisao"],
            "farmacos_principais": r.metadados["farmacos_principais"],
            "categoria": r.metadados["categoria"],
            "conteudo": r.corpo_completo,
        }
        for r in resultado.receitas
    ]


TODOS_PROTOCOLOS: List[Dict[str, Any]] = _carregar_no_formato_antigo()


def exportar_protocolos_typescript() -> int:
    receitas = _cadastro.carregar_receitas().receitas
    _cadastro.exportar_typescript(receitas)
    return len(receitas)


def sincronizar_fts5_completo(caminho_banco: str = None) -> int:
    receitas = _cadastro.carregar_receitas().receitas
    return _cadastro.sincronizar_banco(receitas, caminho_banco or _cadastro.BANCOS_PADRAO[0]) or 0


if __name__ == "__main__":
    print("Aviso: use 'python openclinical/etl_pipeline/cadastrar_receitas.py' (este script só o encaminha).")
    sys.exit(_cadastro.main())
