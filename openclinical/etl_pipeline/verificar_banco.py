import sqlite3
import os

caminho = os.path.join(os.path.dirname(__file__), "openclinical_core.sqlite")
conn = sqlite3.connect(caminho)
tabelas = [r[0] for r in conn.execute("SELECT name FROM sqlite_master WHERE type='table';").fetchall()]
print(f"Tabelas criadas: {tabelas}")

count_principios = conn.execute("SELECT count(*) FROM principios_ativos;").fetchone()[0]
count_medicamentos = conn.execute("SELECT count(*) FROM medicamentos_comerciais;").fetchone()[0]
count_bulas = conn.execute("SELECT count(*) FROM bulas_estruturadas;").fetchone()[0]
count_interacoes = conn.execute("SELECT count(*) FROM matriz_interacoes;").fetchone()[0]
count_diagnosticos = conn.execute("SELECT count(*) FROM codigos_diagnosticos;").fetchone()[0]
count_fts = conn.execute("SELECT count(*) FROM indice_busca_fts;").fetchone()[0]

print(f"Principios Ativos: {count_principios}")
print(f"Medicamentos Comerciais: {count_medicamentos}")
print(f"Bulas Estruturadas: {count_bulas}")
print(f"Matriz Interações: {count_interacoes}")
print(f"Códigos Diagnósticos: {count_diagnosticos}")
print(f"Registros no Índice FTS5: {count_fts}")

# Teste de busca FTS5
res_fts = conn.execute("SELECT tipo_registro, titulo_primario, subtitulo FROM indice_busca_fts WHERE indice_busca_fts MATCH 'amoxil OR amoxicilina';").fetchall()
print(f"Busca FTS 'amoxil OR amoxicilina' ({len(res_fts)} resultados): {res_fts}")

conn.close()
