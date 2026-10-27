import sqlite3
import os
import sys
from typing import List, Dict, Any, Optional

diretorio_atual = os.path.dirname(os.path.abspath(__file__))
if diretorio_atual not in sys.path:
    sys.path.insert(0, diretorio_atual)

from schemas_dominio import MedicamentoComercialSchema
from compilador_banco import obter_caminho_padrao_banco, inicializar_banco_dados


class SincronizadorRenameCmed:
    """
    Sincronizador para cruzamento de dados oficiais da RENAME (Relação Nacional de
    Medicamentos Essenciais do SUS) e CMED (Câmara de Regulação do Mercado de Medicamentos).
    """

    def __init__(self, caminho_banco: Optional[str] = None) -> None:
        if caminho_banco is None:
            self.caminho_banco = obter_caminho_padrao_banco()
        else:
            self.caminho_banco = caminho_banco

    def obter_conexao(self) -> sqlite3.Connection:
        conexao = sqlite3.connect(self.caminho_banco)
        conexao.execute("PRAGMA foreign_keys = ON;")
        return conexao

    def atualizar_status_rename(
        self,
        nome_dcb: str,
        disponivel_sus: bool,
        componente_sus: str,
    ) -> bool:
        """
        Atualiza a classificação de padronização SUS do princípio ativo.
        """
        conexao = self.obter_conexao()
        with conexao:
            cursor = conexao.execute("""
                UPDATE principios_ativos
                SET disponivel_rename_sus = ?, componente_sus = ?
                WHERE LOWER(nome_dcb) = LOWER(?);
            """, (1 if disponivel_sus else 0, componente_sus, nome_dcb))
            linhas_afetadas = cursor.rowcount
        conexao.close()
        return linhas_afetadas > 0

    def atualizar_preco_cmed(
        self,
        numero_registro_anvisa: str,
        preco_maximo_consumidor: float,
    ) -> bool:
        """
        Atualiza o PMC (Preço Máximo ao Consumidor) regulado pela CMED para um medicamento registrado.
        """
        conexao = self.obter_conexao()
        with conexao:
            cursor = conexao.execute("""
                UPDATE medicamentos_comerciais
                SET preco_maximo_consumidor = ?
                WHERE numero_registro_anvisa = ?;
            """, (preco_maximo_consumidor, numero_registro_anvisa))
            linhas_afetadas = cursor.rowcount
        conexao.close()
        return linhas_afetadas > 0

    def sincronizar_novos_registros_cmed(
        self,
        registros_cmed: List[Dict[str, Any]],
    ) -> int:
        """
        Cruza registros da lista CMED com os princípios ativos cadastrados,
        inserindo novos medicamentos comerciais validados pelo Pydantic.
        """
        conexao = self.obter_conexao()
        inseridos = 0

        with conexao:
            for item in registros_cmed:
                nome_dcb = item.get("nome_dcb", "")
                cursor_pa = conexao.execute(
                    "SELECT id_principio_ativo FROM principios_ativos WHERE LOWER(nome_dcb) = LOWER(?);",
                    (nome_dcb,),
                )
                linha_pa = cursor_pa.fetchone()
                if not linha_pa:
                    continue

                id_principio = linha_pa[0]

                medicamento_schema = MedicamentoComercialSchema(
                    id_medicamento=None,
                    id_principio_ativo=id_principio,
                    numero_registro_anvisa=item["numero_registro_anvisa"],
                    nome_comercial=item["nome_comercial"],
                    laboratorio_fabricante=item["laboratorio_fabricante"],
                    apresentacao_comercial=item["apresentacao_comercial"],
                    concentracao_valor=float(item["concentracao_valor"]),
                    concentracao_unidade=item["concentracao_unidade"],
                    forma_farmaceutica=item["forma_farmaceutica"],
                    tipo_receituario=item["tipo_receituario"],
                    preco_maximo_consumidor=float(item["preco_maximo_consumidor"]),
                )

                conexao.execute("""
                    INSERT OR IGNORE INTO medicamentos_comerciais (
                        id_principio_ativo, numero_registro_anvisa, nome_comercial,
                        laboratorio_fabricante, apresentacao_comercial, concentracao_valor,
                        concentracao_unidade, forma_farmaceutica, tipo_receituario,
                        preco_maximo_consumidor
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                """, (
                    medicamento_schema.id_principio_ativo,
                    medicamento_schema.numero_registro_anvisa,
                    medicamento_schema.nome_comercial,
                    medicamento_schema.laboratorio_fabricante,
                    medicamento_schema.apresentacao_comercial,
                    medicamento_schema.concentracao_valor,
                    medicamento_schema.concentracao_unidade,
                    medicamento_schema.forma_farmaceutica,
                    medicamento_schema.tipo_receituario,
                    medicamento_schema.preco_maximo_consumidor,
                ))
                inseridos += 1

        conexao.close()
        return inseridos


if __name__ == "__main__":
    sincronizador = SincronizadorRenameCmed()
    # Teste de atualização de status
    atualizou = sincronizador.atualizar_status_rename("Amoxicilina", True, "Basico")
    print(f"Sincronização RENAME Amoxicilina atualizada: {atualizou}")
