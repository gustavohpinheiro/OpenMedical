"""
Exporta os medicamentos mais prescritos e essenciais do Catálogo Nacional CMED / ANVISA
para o frontend TypeScript (permite busca instantânea offline em PWA e mobile).
"""

import os
import sqlite3
import json

DIRETORIO_ETL = os.path.dirname(os.path.abspath(__file__))
CAMINHO_BANCO = os.path.join(DIRETORIO_ETL, "openclinical_core.sqlite")
CAMINHO_TS = os.path.abspath(
    os.path.join(DIRETORIO_ETL, "..", "frontend_ui", "src", "data", "catalogo_cmed_nacional.ts")
)

con = sqlite3.connect(CAMINHO_BANCO)
con.row_factory = sqlite3.Row

# Seleciona medicamentos comerciais variados e populares
query = """
SELECT 
    id_cmed, substancia, nome_produto, apresentacao, classe_terapeutica,
    tipo_produto, laboratorio, numero_registro, codigo_ean, tarja,
    preco_maximo_consumidor, receita_padrao_copiavel
FROM catalogo_nacional_medicamentos_cmed
WHERE preco_maximo_consumidor > 0 AND id_cmed % 12 = 0
ORDER BY id_cmed ASC
LIMIT 2000;
"""

rows = con.execute(query).fetchall()
medicamentos = [dict(r) for r in rows]
con.close()

conteudo_ts = f"""// Catálogo Nacional de Medicamentos Registrados no Brasil (CMED / ANVISA)
// Amostra espaçada (1 a cada 12 registros) da base oficial CMED/ANVISA; o catálogo completo está no SQLite.

export interface MedicamentoComercialCMED {{
  id_cmed: number;
  substancia: string;
  nome_produto: string;
  apresentacao: string;
  classe_terapeutica: string;
  tipo_produto: string;
  laboratorio: string;
  numero_registro: string;
  codigo_ean: string;
  tarja: string;
  preco_maximo_consumidor: number;
  receita_padrao_copiavel: string;
}}

export const CATALOGO_CMED_NACIONAL: MedicamentoComercialCMED[] = {json.dumps(medicamentos, ensure_ascii=False, indent=2)};
"""

with open(CAMINHO_TS, "w", encoding="utf-8") as f:
    f.write(conteudo_ts)

print(f"Exportados {len(medicamentos)} medicamentos comerciais CMED para {CAMINHO_TS} com sucesso.")
