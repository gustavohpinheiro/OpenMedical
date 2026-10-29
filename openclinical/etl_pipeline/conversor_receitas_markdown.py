"""
Obsoleto: este script regravava 8 receitas antigas por cima dos .md atuais.

As receitas agora são cadastradas diretamente em ``clinical_content/protocolos/*.md``
(veja ``clinical_content/protocolos/COMO_CADASTRAR.md``) e processadas por ``cadastrar_receitas.py``.
"""

import os
import sys

diretorio_atual = os.path.dirname(os.path.abspath(__file__))
if diretorio_atual not in sys.path:
    sys.path.insert(0, diretorio_atual)

import cadastrar_receitas as _cadastro  # noqa: E402
from cadastrar_receitas import DIRETORIO_PROTOCOLOS  # noqa: E402,F401


def sincronizar_protocolos_no_banco_sqlite(caminho_banco: str = None) -> int:
    receitas = _cadastro.carregar_receitas().receitas
    return _cadastro.sincronizar_banco(receitas, caminho_banco or _cadastro.BANCOS_PADRAO[0]) or 0


if __name__ == "__main__":
    print("Aviso: use 'python openclinical/etl_pipeline/cadastrar_receitas.py' (este script só o encaminha).")
    sys.exit(_cadastro.main())
