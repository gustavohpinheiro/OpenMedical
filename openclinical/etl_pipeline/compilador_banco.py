import sqlite3
import os
from typing import Optional


def obter_caminho_padrao_banco() -> str:
    diretorio_atual = os.path.dirname(os.path.abspath(__file__))
    caminho_banco = os.path.join(diretorio_atual, "openclinical_core.sqlite")
    return caminho_banco


def inicializar_banco_dados(caminho_banco: Optional[str] = None) -> sqlite3.Connection:
    if caminho_banco is None:
        caminho_banco = obter_caminho_padrao_banco()

    conexao = sqlite3.connect(caminho_banco)
    conexao.execute("PRAGMA foreign_keys = ON;")
    conexao.execute("PRAGMA journal_mode = WAL;")

    with conexao:
        # 1. Tabela: principios_ativos
        conexao.execute("""
            CREATE TABLE IF NOT EXISTS principios_ativos (
                id_principio_ativo INTEGER PRIMARY KEY AUTOINCREMENT,
                nome_dcb TEXT NOT NULL UNIQUE,
                classe_terapeutica TEXT NOT NULL,
                categoria_risco_gestacao TEXT NOT NULL CHECK(categoria_risco_gestacao IN ('A', 'B', 'C', 'D', 'X')),
                compatibilidade_aleitamento TEXT NOT NULL,
                disponivel_rename_sus INTEGER NOT NULL CHECK(disponivel_rename_sus IN (0, 1)),
                componente_sus TEXT NOT NULL CHECK(componente_sus IN ('Basico', 'Estrategico', 'Especializado', 'Nao_Padronizado'))
            );
        """)

        # 2. Tabela: medicamentos_comerciais
        conexao.execute("""
            CREATE TABLE IF NOT EXISTS medicamentos_comerciais (
                id_medicamento INTEGER PRIMARY KEY AUTOINCREMENT,
                id_principio_ativo INTEGER NOT NULL REFERENCES principios_ativos(id_principio_ativo) ON DELETE CASCADE,
                numero_registro_anvisa TEXT NOT NULL,
                nome_comercial TEXT NOT NULL,
                laboratorio_fabricante TEXT NOT NULL,
                apresentacao_comercial TEXT NOT NULL,
                concentracao_valor REAL NOT NULL,
                concentracao_unidade TEXT NOT NULL,
                forma_farmaceutica TEXT NOT NULL,
                tipo_receituario TEXT NOT NULL CHECK(tipo_receituario IN (
                    'simples',
                    'controle_especial_c1',
                    'antimicrobiano',
                    'notificacao_b_azul',
                    'notificacao_a_amarela'
                )),
                preco_maximo_consumidor REAL NOT NULL
            );
        """)

        # 3. Tabela: bulas_estruturadas
        conexao.execute("""
            CREATE TABLE IF NOT EXISTS bulas_estruturadas (
                id_bula INTEGER PRIMARY KEY AUTOINCREMENT,
                id_principio_ativo INTEGER NOT NULL UNIQUE REFERENCES principios_ativos(id_principio_ativo) ON DELETE CASCADE,
                indicacoes_clinicas TEXT NOT NULL,
                posologia_adulto_padrao TEXT NOT NULL,
                posologia_pediatrica_padrao TEXT,
                dose_pediatrica_mg_kg_dia_min REAL,
                dose_pediatrica_mg_kg_dia_max REAL,
                dose_maxima_diaria_mg REAL,
                ajuste_funcao_renal_json TEXT,
                ajuste_funcao_hepatica TEXT,
                contraindicacoes TEXT NOT NULL,
                eventos_adversos_comuns TEXT NOT NULL,
                guia_diluicao_injetavel_json TEXT
            );
        """)

        # 4. Tabela: matriz_interacoes
        conexao.execute("""
            CREATE TABLE IF NOT EXISTS matriz_interacoes (
                id_interacao INTEGER PRIMARY KEY AUTOINCREMENT,
                id_principio_ativo_a INTEGER NOT NULL REFERENCES principios_ativos(id_principio_ativo) ON DELETE CASCADE,
                id_principio_ativo_b INTEGER NOT NULL REFERENCES principios_ativos(id_principio_ativo) ON DELETE CASCADE,
                gravidade_interacao TEXT NOT NULL CHECK(gravidade_interacao IN ('Contraindicada', 'Grave', 'Moderada', 'Leve')),
                efeito_clinico TEXT NOT NULL,
                conduta_recomendada TEXT NOT NULL
            );
        """)

        # 5. Tabela: codigos_diagnosticos
        conexao.execute("""
            CREATE TABLE IF NOT EXISTS codigos_diagnosticos (
                id_diagnostico INTEGER PRIMARY KEY AUTOINCREMENT,
                codigo_cid10 TEXT NOT NULL,
                descricao_cid10 TEXT NOT NULL,
                codigo_ciap2 TEXT NOT NULL,
                descricao_ciap2 TEXT NOT NULL
            );
        """)

        # 6. Tabela Virtual FTS5: indice_busca_fts
        conexao.execute("""
            CREATE VIRTUAL TABLE IF NOT EXISTS indice_busca_fts USING fts5(
                tipo_registro,
                id_referencia UNINDEXED,
                titulo_primario,
                subtitulo,
                conteudo_textual,
                tokenize = 'unicode61 remove_diacritics 2'
            );
        """)

        # Índices complementares para performance de junções relacionais
        conexao.execute("CREATE INDEX IF NOT EXISTS idx_med_principio ON medicamentos_comerciais(id_principio_ativo);")
        conexao.execute("CREATE INDEX IF NOT EXISTS idx_bula_principio ON bulas_estruturadas(id_principio_ativo);")
        conexao.execute("CREATE INDEX IF NOT EXISTS idx_interacao_a ON matriz_interacoes(id_principio_ativo_a);")
        conexao.execute("CREATE INDEX IF NOT EXISTS idx_interacao_b ON matriz_interacoes(id_principio_ativo_b);")
        conexao.execute("CREATE INDEX IF NOT EXISTS idx_diag_cid ON codigos_diagnosticos(codigo_cid10);")
        conexao.execute("CREATE INDEX IF NOT EXISTS idx_diag_ciap ON codigos_diagnosticos(codigo_ciap2);")

        # Configuração de Triggers para sincronização automática com FTS5
        # Triggers: medicamentos_comerciais (inclui DCB e classe terapêutica no FTS5)
        conexao.execute("""
            CREATE TRIGGER IF NOT EXISTS trg_med_insert AFTER INSERT ON medicamentos_comerciais
            BEGIN
                INSERT INTO indice_busca_fts(tipo_registro, id_referencia, titulo_primario, subtitulo, conteudo_textual)
                VALUES (
                    'medicamento',
                    NEW.id_medicamento,
                    NEW.nome_comercial,
                    NEW.apresentacao_comercial || ' (' || COALESCE((SELECT nome_dcb FROM principios_ativos WHERE id_principio_ativo = NEW.id_principio_ativo), '') || ') - ' || NEW.laboratorio_fabricante,
                    NEW.nome_comercial || ' ' || COALESCE((SELECT nome_dcb || ' ' || classe_terapeutica FROM principios_ativos WHERE id_principio_ativo = NEW.id_principio_ativo), '') || ' ' || NEW.laboratorio_fabricante || ' ' || NEW.numero_registro_anvisa || ' ' || NEW.forma_farmaceutica
                );
            END;
        """)

        conexao.execute("""
            CREATE TRIGGER IF NOT EXISTS trg_med_delete AFTER DELETE ON medicamentos_comerciais
            BEGIN
                DELETE FROM indice_busca_fts
                WHERE tipo_registro = 'medicamento' AND id_referencia = OLD.id_medicamento;
            END;
        """)

        conexao.execute("""
            CREATE TRIGGER IF NOT EXISTS trg_med_update AFTER UPDATE ON medicamentos_comerciais
            BEGIN
                DELETE FROM indice_busca_fts
                WHERE tipo_registro = 'medicamento' AND id_referencia = OLD.id_medicamento;

                INSERT INTO indice_busca_fts(tipo_registro, id_referencia, titulo_primario, subtitulo, conteudo_textual)
                VALUES (
                    'medicamento',
                    NEW.id_medicamento,
                    NEW.nome_comercial,
                    NEW.apresentacao_comercial || ' (' || COALESCE((SELECT nome_dcb FROM principios_ativos WHERE id_principio_ativo = NEW.id_principio_ativo), '') || ') - ' || NEW.laboratorio_fabricante,
                    NEW.nome_comercial || ' ' || COALESCE((SELECT nome_dcb || ' ' || classe_terapeutica FROM principios_ativos WHERE id_principio_ativo = NEW.id_principio_ativo), '') || ' ' || NEW.laboratorio_fabricante || ' ' || NEW.numero_registro_anvisa || ' ' || NEW.forma_farmaceutica
                );
            END;
        """)

        # Triggers: codigos_diagnosticos
        conexao.execute("""
            CREATE TRIGGER IF NOT EXISTS trg_diag_insert AFTER INSERT ON codigos_diagnosticos
            BEGIN
                INSERT INTO indice_busca_fts(tipo_registro, id_referencia, titulo_primario, subtitulo, conteudo_textual)
                VALUES (
                    'diagnostico',
                    NEW.id_diagnostico,
                    NEW.codigo_cid10 || ' / ' || NEW.codigo_ciap2,
                    NEW.descricao_cid10,
                    NEW.descricao_cid10 || ' ' || NEW.descricao_ciap2 || ' ' || NEW.codigo_cid10 || ' ' || NEW.codigo_ciap2
                );
            END;
        """)

        conexao.execute("""
            CREATE TRIGGER IF NOT EXISTS trg_diag_delete AFTER DELETE ON codigos_diagnosticos
            BEGIN
                DELETE FROM indice_busca_fts
                WHERE tipo_registro = 'diagnostico' AND id_referencia = OLD.id_diagnostico;
            END;
        """)

        conexao.execute("""
            CREATE TRIGGER IF NOT EXISTS trg_diag_update AFTER UPDATE ON codigos_diagnosticos
            BEGIN
                DELETE FROM indice_busca_fts
                WHERE tipo_registro = 'diagnostico' AND id_referencia = OLD.id_diagnostico;

                INSERT INTO indice_busca_fts(tipo_registro, id_referencia, titulo_primario, subtitulo, conteudo_textual)
                VALUES (
                    'diagnostico',
                    NEW.id_diagnostico,
                    NEW.codigo_cid10 || ' / ' || NEW.codigo_ciap2,
                    NEW.descricao_cid10,
                    NEW.descricao_cid10 || ' ' || NEW.descricao_ciap2 || ' ' || NEW.codigo_cid10 || ' ' || NEW.codigo_ciap2
                );
            END;
        """)

    return conexao


if __name__ == "__main__":
    caminho = obter_caminho_padrao_banco()
    print(f"Compilando banco de dados SQLite e índices FTS5 em: {caminho}")
    conn = inicializar_banco_dados(caminho)
    conn.close()
    print("Banco de dados SQLite inicializado com sucesso.")
