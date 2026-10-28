use crate::errors::ClinicalError;
use crate::models::{
    BulaEstruturada, DetalheMedicamentoCompleto, ItemBuscaFts, MatrizInteracao, MedicamentoComercial,
    MedicamentoComercialCmed, PrincipioAtivo,
};

#[cfg(not(target_arch = "wasm32"))]
use rusqlite::{params, Connection, OpenFlags, OptionalExtension};

#[cfg(not(target_arch = "wasm32"))]
pub struct BancoDadosClinico {
    conexao: Connection,
}

#[cfg(not(target_arch = "wasm32"))]
fn valor_sqlite_para_json(valor: rusqlite::types::Value) -> serde_json::Value {
    use rusqlite::types::Value;
    match valor {
        Value::Integer(n) => serde_json::Value::from(n),
        Value::Real(f) => serde_json::Value::from(f),
        Value::Text(t) => serde_json::Value::from(t),
        Value::Null | Value::Blob(_) => serde_json::Value::Null,
    }
}

/// Distingue "registro inexistente" de falhas reais de consulta, que não podem ser mascaradas.
#[cfg(not(target_arch = "wasm32"))]
fn erro_consulta(erro: rusqlite::Error, identificador: String) -> ClinicalError {
    match erro {
        rusqlite::Error::QueryReturnedNoRows => ClinicalError::NaoEncontrado { identificador },
        outro => ClinicalError::ErroBancoDados {
            mensagem: format!("Erro ao consultar {identificador}: {outro}"),
        },
    }
}

#[cfg(not(target_arch = "wasm32"))]
impl BancoDadosClinico {
    pub fn abrir(caminho_arquivo: &str) -> Result<Self, ClinicalError> {
        let conexao = Connection::open_with_flags(
            caminho_arquivo,
            OpenFlags::SQLITE_OPEN_READ_WRITE
                | OpenFlags::SQLITE_OPEN_CREATE
                | OpenFlags::SQLITE_OPEN_URI,
        )
        .map_err(|e| ClinicalError::ErroBancoDados {
            mensagem: format!("Falha ao abrir banco de dados SQLite '{caminho_arquivo}': {e}"),
        })?;

        conexao
            .execute_batch("PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;")
            .map_err(|e| ClinicalError::ErroBancoDados {
                mensagem: format!("Falha ao configurar pragmas SQLite: {e}"),
            })?;

        Ok(Self { conexao })
    }

    pub fn abrir_somente_leitura(caminho_arquivo: &str) -> Result<Self, ClinicalError> {
        let conexao = Connection::open_with_flags(
            caminho_arquivo,
            OpenFlags::SQLITE_OPEN_READ_ONLY | OpenFlags::SQLITE_OPEN_URI,
        )
        .map_err(|e| ClinicalError::ErroBancoDados {
            mensagem: format!("Falha ao abrir banco SQLite em modo somente leitura: {e}"),
        })?;
        // O atualizador diário grava em transação: as consultas esperam o fim dela em vez de falhar
        conexao
            .busy_timeout(std::time::Duration::from_secs(15))
            .map_err(|e| ClinicalError::ErroBancoDados {
                mensagem: format!("Falha ao configurar espera do banco: {e}"),
            })?;

        Ok(Self { conexao })
    }

    /// Substâncias distintas da CMED: a interface normaliza sal e associação e escolhe as que correspondem a um fármaco.
    pub fn listar_substancias_cmed(&self) -> Result<Vec<String>, ClinicalError> {
        let mut stmt = self
            .conexao
            .prepare("SELECT DISTINCT substancia FROM catalogo_nacional_medicamentos_cmed ORDER BY substancia")
            .map_err(|e| ClinicalError::ErroBancoDados { mensagem: format!("Erro ao listar substâncias CMED: {e}") })?;
        let linhas = stmt
            .query_map([], |row| row.get::<_, String>(0))
            .map_err(|e| ClinicalError::ErroBancoDados { mensagem: format!("Erro ao listar substâncias CMED: {e}") })?;
        linhas
            .collect::<Result<Vec<_>, _>>()
            .map_err(|e| ClinicalError::ErroBancoDados { mensagem: format!("Erro ao ler substâncias CMED: {e}") })
    }

    /// Todas as apresentações comerciais das substâncias informadas (texto exato da CMED).
    pub fn apresentacoes_cmed_por_substancias(
        &self,
        substancias: &[String],
    ) -> Result<Vec<MedicamentoComercialCmed>, ClinicalError> {
        if substancias.is_empty() {
            return Ok(Vec::new());
        }
        let marcadores = vec!["?"; substancias.len()].join(", ");
        let sql = format!(
            "SELECT id_cmed, substancia, nome_produto, apresentacao,
                    COALESCE(classe_terapeutica, ''), COALESCE(tipo_produto, ''), COALESCE(laboratorio, ''),
                    COALESCE(numero_registro, ''), COALESCE(codigo_ean, ''), COALESCE(tarja, ''),
                    COALESCE(preco_maximo_consumidor, 0.0), COALESCE(receita_padrao_copiavel, '')
             FROM catalogo_nacional_medicamentos_cmed
             WHERE substancia IN ({marcadores})
             ORDER BY nome_produto, apresentacao"
        );
        let mut stmt = self
            .conexao
            .prepare(&sql)
            .map_err(|e| ClinicalError::ErroBancoDados { mensagem: format!("Erro ao preparar consulta CMED: {e}") })?;
        let linhas = stmt
            .query_map(rusqlite::params_from_iter(substancias.iter()), |row| {
                Ok(MedicamentoComercialCmed {
                    id_cmed: row.get(0)?,
                    substancia: row.get(1)?,
                    nome_produto: row.get(2)?,
                    apresentacao: row.get(3)?,
                    classe_terapeutica: row.get(4)?,
                    tipo_produto: row.get(5)?,
                    laboratorio: row.get(6)?,
                    numero_registro: row.get(7)?,
                    codigo_ean: row.get(8)?,
                    tarja: row.get(9)?,
                    preco_maximo_consumidor: row.get(10)?,
                    receita_padrao_copiavel: row.get(11)?,
                })
            })
            .map_err(|e| ClinicalError::ErroBancoDados { mensagem: format!("Erro ao consultar apresentações CMED: {e}") })?;
        linhas
            .collect::<Result<Vec<_>, _>>()
            .map_err(|e| ClinicalError::ErroBancoDados { mensagem: format!("Erro ao ler apresentações CMED: {e}") })
    }

    /// Bula vigente do produto no índice oficial do Bulário Eletrônico (atualizado diariamente).
    pub fn consultar_bula_anvisa(
        &self,
        numero_registro: &str,
    ) -> Result<Option<crate::atualizador::BulaAnvisaIndice>, ClinicalError> {
        crate::atualizador::consultar_bula(&self.conexao, numero_registro)
    }

    /// Situação de cada fonte do atualizador diário.
    pub fn estado_atualizacao(&self) -> Vec<crate::atualizador::EstadoFonte> {
        crate::atualizador::estado_atualizacao(&self.conexao)
    }

    /// Busca textual rápida com ranqueamento BM25 na tabela virtual FTS5.
    pub fn buscar_geral(&self, termo_busca: &str, limite: usize) -> Result<Vec<ItemBuscaFts>, ClinicalError> {
        let termo_limpo = termo_busca.trim();
        if termo_limpo.is_empty() {
            return Ok(Vec::new());
        }

        // Sanitização e formatação da expressão de busca FTS5 (prefix query com '*')
        let tokens: Vec<String> = termo_limpo
            .split_whitespace()
            .map(|tok| {
                let token_sanitizado: String = tok
                    .chars()
                    .filter(|c| c.is_alphanumeric() || *c == '-' || *c == '.')
                    .collect();
                token_sanitizado
            })
            .filter(|tok| !tok.is_empty())
            .map(|tok| format!("\"{}\"*", tok))
            .collect();

        if tokens.is_empty() {
            return Ok(Vec::new());
        }

        let consulta_fts = tokens.join(" ");

        let sql = r#"
            SELECT tipo_registro, id_referencia, titulo_primario, subtitulo, bm25(indice_busca_fts) as score
            FROM indice_busca_fts
            WHERE indice_busca_fts MATCH ?1
            -- As 26 mil apresentações CMED vêm depois de monografias, bulas e protocolos,
            -- senão as embalagens de um mesmo produto ocupam todo o limite
            ORDER BY CASE tipo_registro WHEN 'cmed_comercial' THEN 1 ELSE 0 END, score ASC
            LIMIT ?2
        "#;

        let mut stmt = self
            .conexao
            .prepare(sql)
            .map_err(|e| ClinicalError::ErroBancoDados {
                mensagem: format!("Erro ao preparar declaração FTS5: {e}"),
            })?;

        let linhas = stmt
            .query_map(params![consulta_fts, limite as i64], |row| {
                Ok(ItemBuscaFts {
                    tipo_registro: row.get(0)?,
                    id_referencia: valor_sqlite_para_json(row.get::<_, rusqlite::types::Value>(1)?),
                    titulo_primario: row.get(2)?,
                    subtitulo: row.get(3)?,
                    score_relevancia: row.get(4)?,
                })
            })
            .map_err(|e| ClinicalError::ErroBancoDados {
                mensagem: format!("Erro na execução da consulta FTS5: {e}"),
            })?;

        let mut resultados = Vec::new();
        for item in linhas {
            let registro = item.map_err(|e| ClinicalError::ErroBancoDados {
                mensagem: format!("Erro ao ler resultado da busca FTS5: {e}"),
            })?;
            resultados.push(registro);
        }

        Ok(resultados)
    }

    /// Obtém detalhes completos do medicamento incluindo princípio ativo e bula estruturada.
    pub fn obter_detalhe_medicamento(
        &self,
        id_medicamento: i64,
    ) -> Result<DetalheMedicamentoCompleto, ClinicalError> {
        let sql_med = r#"
            SELECT id_medicamento, id_principio_ativo, numero_registro_anvisa, nome_comercial,
                   laboratorio_fabricante, apresentacao_comercial, concentracao_valor,
                   concentracao_unidade, forma_farmaceutica, tipo_receituario, preco_maximo_consumidor
            FROM medicamentos_comerciais
            WHERE id_medicamento = ?1
        "#;

        let medicamento = self
            .conexao
            .query_row(sql_med, params![id_medicamento], |row| {
                Ok(MedicamentoComercial {
                    id_medicamento: row.get(0)?,
                    id_principio_ativo: row.get(1)?,
                    numero_registro_anvisa: row.get(2)?,
                    nome_comercial: row.get(3)?,
                    laboratorio_fabricante: row.get(4)?,
                    apresentacao_comercial: row.get(5)?,
                    concentracao_valor: row.get(6)?,
                    concentracao_unidade: row.get(7)?,
                    forma_farmaceutica: row.get(8)?,
                    tipo_receituario: row.get(9)?,
                    preco_maximo_consumidor: row.get(10)?,
                })
            })
            .map_err(|e| erro_consulta(e, format!("Medicamento comercial ID {id_medicamento}")))?;

        let sql_pa = r#"
            SELECT id_principio_ativo, nome_dcb, classe_terapeutica, categoria_risco_gestacao,
                   compatibilidade_aleitamento, disponivel_rename_sus, componente_sus
            FROM principios_ativos
            WHERE id_principio_ativo = ?1
        "#;

        let principio_ativo = self
            .conexao
            .query_row(sql_pa, params![medicamento.id_principio_ativo], |row| {
                Ok(PrincipioAtivo {
                    id_principio_ativo: row.get(0)?,
                    nome_dcb: row.get(1)?,
                    classe_terapeutica: row.get(2)?,
                    categoria_risco_gestacao: row.get(3)?,
                    compatibilidade_aleitamento: row.get(4)?,
                    disponivel_rename_sus: row.get(5)?,
                    componente_sus: row.get(6)?,
                })
            })
            .map_err(|e| erro_consulta(e, format!("Princípio ativo ID {}", medicamento.id_principio_ativo)))?;

        let sql_bula = r#"
            SELECT id_bula, id_principio_ativo, indicacoes_clinicas, posologia_adulto_padrao,
                   posologia_pediatrica_padrao, dose_pediatrica_mg_kg_dia_min,
                   dose_pediatrica_mg_kg_dia_max, dose_maxima_diaria_mg,
                   ajuste_funcao_renal_json, ajuste_funcao_hepatica, contraindicacoes,
                   eventos_adversos_comuns, guia_diluicao_injetavel_json
            FROM bulas_estruturadas
            WHERE id_principio_ativo = ?1
        "#;

        let bula = self
            .conexao
            .query_row(sql_bula, params![medicamento.id_principio_ativo], |row| {
                Ok(BulaEstruturada {
                    id_bula: row.get(0)?,
                    id_principio_ativo: row.get(1)?,
                    indicacoes_clinicas: row.get(2)?,
                    posologia_adulto_padrao: row.get(3)?,
                    posologia_pediatrica_padrao: row.get(4)?,
                    dose_pediatrica_mg_kg_dia_min: row.get(5)?,
                    dose_pediatrica_mg_kg_dia_max: row.get(6)?,
                    dose_maxima_diaria_mg: row.get(7)?,
                    ajuste_funcao_renal_json: row.get(8)?,
                    ajuste_funcao_hepatica: row.get(9)?,
                    contraindicacoes: row.get(10)?,
                    eventos_adversos_comuns: row.get(11)?,
                    guia_diluicao_injetavel_json: row.get(12)?,
                })
            })
            .optional()
            .map_err(|e| ClinicalError::ErroBancoDados {
                mensagem: format!("Erro ao consultar bula estruturada: {e}"),
            })?;

        Ok(DetalheMedicamentoCompleto {
            medicamento,
            principio_ativo,
            bula,
        })
    }

    /// Obtém uma apresentação comercial do catálogo CMED (preço máximo e modelo de receita sem posologia).
    pub fn obter_registro_cmed(&self, id_cmed: i64) -> Result<MedicamentoComercialCmed, ClinicalError> {
        let sql = r#"
            SELECT id_cmed, substancia, nome_produto, apresentacao,
                   COALESCE(classe_terapeutica, ''), COALESCE(tipo_produto, ''), COALESCE(laboratorio, ''),
                   COALESCE(numero_registro, ''), COALESCE(codigo_ean, ''), COALESCE(tarja, ''),
                   COALESCE(preco_maximo_consumidor, 0.0), COALESCE(receita_padrao_copiavel, '')
            FROM catalogo_nacional_medicamentos_cmed
            WHERE id_cmed = ?1
        "#;

        self.conexao
            .query_row(sql, params![id_cmed], |row| {
                Ok(MedicamentoComercialCmed {
                    id_cmed: row.get(0)?,
                    substancia: row.get(1)?,
                    nome_produto: row.get(2)?,
                    apresentacao: row.get(3)?,
                    classe_terapeutica: row.get(4)?,
                    tipo_produto: row.get(5)?,
                    laboratorio: row.get(6)?,
                    numero_registro: row.get(7)?,
                    codigo_ean: row.get(8)?,
                    tarja: row.get(9)?,
                    preco_maximo_consumidor: row.get(10)?,
                    receita_padrao_copiavel: row.get(11)?,
                })
            })
            .map_err(|e| erro_consulta(e, format!("Apresentação CMED ID {id_cmed}")))
    }

    /// Verifica e ranqueia interações medicamentosas para N princípios ativos.
    pub fn verificar_interacoes(
        &self,
        ids_principios_ativos: &[i64],
    ) -> Result<Vec<MatrizInteracao>, ClinicalError> {
        let pares = crate::interactions::gerar_pares_combinatorios(ids_principios_ativos);
        if pares.is_empty() {
            return Ok(Vec::new());
        }

        let mut resultados = Vec::new();

        let sql = r#"
            SELECT m.id_interacao, m.id_principio_ativo_a, m.id_principio_ativo_b,
                   pa.nome_dcb as nome_a, pb.nome_dcb as nome_b,
                   m.gravidade_interacao, m.efeito_clinico, m.conduta_recomendada
            FROM matriz_interacoes m
            JOIN principios_ativos pa ON m.id_principio_ativo_a = pa.id_principio_ativo
            JOIN principios_ativos pb ON m.id_principio_ativo_b = pb.id_principio_ativo
            WHERE (m.id_principio_ativo_a = ?1 AND m.id_principio_ativo_b = ?2)
               OR (m.id_principio_ativo_a = ?2 AND m.id_principio_ativo_b = ?1)
        "#;

        let mut stmt = self
            .conexao
            .prepare(sql)
            .map_err(|e| ClinicalError::ErroBancoDados {
                mensagem: format!("Erro ao preparar consulta de interações: {e}"),
            })?;

        for (id_a, id_b) in pares {
            let mut linhas = stmt
                .query(params![id_a, id_b])
                .map_err(|e| ClinicalError::ErroBancoDados {
                    mensagem: format!("Erro ao executar verificação do par ({id_a}, {id_b}): {e}"),
                })?;

            while let Some(row) = linhas.next().map_err(|e| ClinicalError::ErroBancoDados {
                mensagem: format!("Erro ao iterar linhas de interação: {e}"),
            })? {
                resultados.push(MatrizInteracao {
                    id_interacao: row.get(0)?,
                    id_principio_ativo_a: row.get(1)?,
                    id_principio_ativo_b: row.get(2)?,
                    nome_principio_a: Some(row.get(3)?),
                    nome_principio_b: Some(row.get(4)?),
                    gravidade_interacao: row.get(5)?,
                    efeito_clinico: row.get(6)?,
                    conduta_recomendada: row.get(7)?,
                });
            }
        }

        // Ordena pela severidade clínica decrescente
        resultados.sort_by(|a, b| {
            let peso_b = crate::interactions::peso_gravidade_interacao(&b.gravidade_interacao);
            let peso_a = crate::interactions::peso_gravidade_interacao(&a.gravidade_interacao);
            peso_b.cmp(&peso_a)
        });

        Ok(resultados)
    }
}

#[cfg(target_arch = "wasm32")]
pub struct BancoDadosClinico;

#[cfg(target_arch = "wasm32")]
impl BancoDadosClinico {
    pub fn abrir(_caminho: &str) -> Result<Self, ClinicalError> {
        Err(ClinicalError::AmbienteNaoSuportado {
            detalhe: "Acesso direto a arquivo SQLite nativo não está disponível em WebAssembly.".to_string(),
        })
    }
}
