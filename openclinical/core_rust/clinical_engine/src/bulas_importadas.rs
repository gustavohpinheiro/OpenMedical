//! Bulas em PDF importadas pelo usuário (baixadas no Bulário Eletrônico) ou coletadas das páginas dos laboratórios.
//!
//! A leitura do PDF e a separação das seções acontecem na interface (`frontend_ui/src/bula_parser.ts`), que também
//! roda no coletor em Node: aqui só se grava, consulta e indexa o resultado. Cada produto (registro de 9 dígitos)
//! pode ter a bula do profissional e a do paciente. O coletor (`frontend_ui/scripts/baixar_bulas_laboratorios.mjs`)
//! grava na mesma tabela com o mesmo esquema.

use crate::errors::ClinicalError;
use rusqlite::{params, Connection, OptionalExtension};
use serde::{Deserialize, Serialize};

pub const TIPO_REGISTRO_FTS: &str = "bula_importada";

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct SecaoBulaImportada {
    pub chave: String,
    pub titulo: String,
    pub texto: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct BulaImportada {
    /// 9 primeiros dígitos do registro na ANVISA
    pub registro: String,
    /// "profissional" ou "paciente"
    pub tipo: String,
    pub nome_produto: String,
    pub principios_ativos: Vec<String>,
    pub empresa: String,
    pub cnpj: String,
    /// AAAA-MM-DD da aprovação da bula pela ANVISA (vazio se o PDF não traz)
    pub data_bula: String,
    /// "manual" ou "laboratorio:<nome>"
    pub origem: String,
    pub url_origem: String,
    /// Preenchida ao gravar (UTC, AAAA-MM-DD HH:MM:SS)
    #[serde(default)]
    pub data_importacao: String,
    pub hash_arquivo: String,
    pub cabecalho: String,
    pub secoes: Vec<SecaoBulaImportada>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct BulaImportadaResumo {
    pub registro: String,
    pub tipo: String,
    pub nome_produto: String,
    pub empresa: String,
    pub origem: String,
    pub data_bula: String,
    pub data_importacao: String,
    pub total_secoes: i64,
}

fn erro_banco(contexto: &'static str) -> impl Fn(rusqlite::Error) -> ClinicalError {
    move |e| ClinicalError::ErroBancoDados {
        mensagem: format!("Falha ao {contexto}: {e}"),
    }
}

pub fn garantir_esquema(con: &Connection) -> Result<(), ClinicalError> {
    con.execute_batch(
        r#"
        CREATE TABLE IF NOT EXISTS bulas_importadas (
            registro TEXT NOT NULL,
            tipo TEXT NOT NULL CHECK (tipo IN ('profissional', 'paciente')),
            nome_produto TEXT NOT NULL,
            principios_ativos TEXT NOT NULL DEFAULT '[]',
            empresa TEXT NOT NULL DEFAULT '',
            cnpj TEXT NOT NULL DEFAULT '',
            data_bula TEXT NOT NULL DEFAULT '',
            origem TEXT NOT NULL,
            url_origem TEXT NOT NULL DEFAULT '',
            data_importacao TEXT NOT NULL,
            hash_arquivo TEXT NOT NULL DEFAULT '',
            cabecalho TEXT NOT NULL DEFAULT '',
            secoes_json TEXT NOT NULL,
            PRIMARY KEY (registro, tipo)
        );
        CREATE VIRTUAL TABLE IF NOT EXISTS indice_busca_fts USING fts5(
            tipo_registro, id_referencia UNINDEXED, titulo_primario, subtitulo, conteudo_textual,
            tokenize = 'unicode61 remove_diacritics 2'
        );
        "#,
    )
    .map_err(erro_banco("criar a tabela de bulas importadas"))
}

fn somente_digitos(texto: &str) -> String {
    texto.chars().filter(char::is_ascii_digit).collect()
}

/// Valida e normaliza a bula antes de gravar: registro com 9 dígitos, tipo conhecido, ao menos uma seção.
pub fn validar(bula: &BulaImportada) -> Result<BulaImportada, ClinicalError> {
    let digitos = somente_digitos(&bula.registro);
    if digitos.len() < 9 {
        return Err(ClinicalError::DadoInvalido {
            campo: "registro".into(),
            motivo: "a bula precisa do número de registro do produto na ANVISA (9 dígitos)".into(),
        });
    }
    if bula.tipo != "profissional" && bula.tipo != "paciente" {
        return Err(ClinicalError::DadoInvalido {
            campo: "tipo".into(),
            motivo: format!("tipo de bula desconhecido: '{}'", bula.tipo),
        });
    }
    if bula.secoes.is_empty() || bula.secoes.iter().all(|s| s.texto.trim().is_empty()) {
        return Err(ClinicalError::DadoInvalido {
            campo: "secoes".into(),
            motivo: "a bula não tem nenhuma seção com texto".into(),
        });
    }
    let mut normalizada = bula.clone();
    normalizada.registro = digitos[..9].to_string();
    if normalizada.nome_produto.trim().is_empty() {
        normalizada.nome_produto = format!("Registro {}", normalizada.registro);
    }
    Ok(normalizada)
}

fn id_fts(registro: &str, tipo: &str) -> String {
    format!("{registro}:{tipo}")
}

/// Grava (ou substitui) a bula e o item da busca global, numa transação.
pub fn salvar(con: &mut Connection, bula: &BulaImportada) -> Result<BulaImportadaResumo, ClinicalError> {
    garantir_esquema(con)?;
    let bula = validar(bula)?;
    let secoes_json = serde_json::to_string(&bula.secoes).map_err(|e| ClinicalError::ErroBancoDados {
        mensagem: format!("Falha ao serializar as seções da bula: {e}"),
    })?;
    let principios_json = serde_json::to_string(&bula.principios_ativos).unwrap_or_else(|_| "[]".into());
    let id = id_fts(&bula.registro, &bula.tipo);
    let rotulo_tipo = if bula.tipo == "profissional" { "Bula do profissional" } else { "Bula do paciente" };
    let texto_secao = |chave: &str| {
        bula.secoes
            .iter()
            .find(|s| s.chave == chave)
            .map(|s| s.texto.as_str())
            .unwrap_or("")
    };
    let conteudo = format!(
        "{} {} {} {}",
        bula.principios_ativos.join(" "),
        bula.registro,
        texto_secao("indicacoes"),
        texto_secao("posologia")
    );

    let tx = con.transaction().map_err(erro_banco("iniciar a gravação da bula"))?;
    tx.execute(
        "INSERT INTO bulas_importadas (registro, tipo, nome_produto, principios_ativos, empresa, cnpj, data_bula, origem,
                                       url_origem, data_importacao, hash_arquivo, cabecalho, secoes_json)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, datetime('now'), ?10, ?11, ?12)
         ON CONFLICT(registro, tipo) DO UPDATE SET
            nome_produto = excluded.nome_produto, principios_ativos = excluded.principios_ativos,
            empresa = excluded.empresa, cnpj = excluded.cnpj, data_bula = excluded.data_bula, origem = excluded.origem,
            url_origem = excluded.url_origem, data_importacao = excluded.data_importacao,
            hash_arquivo = excluded.hash_arquivo, cabecalho = excluded.cabecalho, secoes_json = excluded.secoes_json",
        params![
            bula.registro,
            bula.tipo,
            bula.nome_produto,
            principios_json,
            bula.empresa,
            bula.cnpj,
            bula.data_bula,
            bula.origem,
            bula.url_origem,
            bula.hash_arquivo,
            bula.cabecalho,
            secoes_json
        ],
    )
    .map_err(erro_banco("gravar a bula importada"))?;
    tx.execute(
        "DELETE FROM indice_busca_fts WHERE tipo_registro = ?1 AND id_referencia = ?2",
        params![TIPO_REGISTRO_FTS, id],
    )
    .map_err(erro_banco("atualizar o índice de busca"))?;
    tx.execute(
        "INSERT INTO indice_busca_fts (tipo_registro, id_referencia, titulo_primario, subtitulo, conteudo_textual)
         VALUES (?1, ?2, ?3, ?4, ?5)",
        params![
            TIPO_REGISTRO_FTS,
            id,
            bula.nome_produto,
            format!("{rotulo_tipo} · {}", if bula.empresa.is_empty() { "empresa não informada" } else { &bula.empresa }),
            conteudo
        ],
    )
    .map_err(erro_banco("atualizar o índice de busca"))?;
    tx.commit().map_err(erro_banco("concluir a gravação da bula"))?;

    resumo(con, &bula.registro, &bula.tipo)?.ok_or_else(|| ClinicalError::ErroBancoDados {
        mensagem: "a bula gravada não foi encontrada".into(),
    })
}

fn existe_tabela(con: &Connection) -> Result<bool, ClinicalError> {
    Ok(con
        .query_row("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'bulas_importadas'", [], |_| Ok(true))
        .optional()
        .map_err(erro_banco("consultar as bulas importadas"))?
        .unwrap_or(false))
}

const COLUNAS_RESUMO: &str = "registro, tipo, nome_produto, empresa, origem, data_bula, data_importacao, json_array_length(secoes_json)";

fn ler_resumo(r: &rusqlite::Row<'_>) -> rusqlite::Result<BulaImportadaResumo> {
    Ok(BulaImportadaResumo {
        registro: r.get(0)?,
        tipo: r.get(1)?,
        nome_produto: r.get(2)?,
        empresa: r.get(3)?,
        origem: r.get(4)?,
        data_bula: r.get(5)?,
        data_importacao: r.get(6)?,
        total_secoes: r.get(7)?,
    })
}

fn resumo(con: &Connection, registro: &str, tipo: &str) -> Result<Option<BulaImportadaResumo>, ClinicalError> {
    con.query_row(
        &format!("SELECT {COLUNAS_RESUMO} FROM bulas_importadas WHERE registro = ?1 AND tipo = ?2"),
        params![registro, tipo],
        ler_resumo,
    )
    .optional()
    .map_err(erro_banco("consultar a bula importada"))
}

/// Bulas do produto (profissional primeiro), pelos 9 primeiros dígitos do registro.
pub fn obter(con: &Connection, numero_registro: &str) -> Result<Vec<BulaImportada>, ClinicalError> {
    let digitos = somente_digitos(numero_registro);
    if digitos.len() < 9 || !existe_tabela(con)? {
        return Ok(Vec::new());
    }
    let mut stmt = con
        .prepare(
            "SELECT registro, tipo, nome_produto, principios_ativos, empresa, cnpj, data_bula, origem, url_origem,
                    data_importacao, hash_arquivo, cabecalho, secoes_json
             FROM bulas_importadas WHERE registro = ?1 ORDER BY CASE tipo WHEN 'profissional' THEN 0 ELSE 1 END",
        )
        .map_err(erro_banco("consultar a bula importada"))?;
    let linhas = stmt
        .query_map(params![&digitos[..9]], |r| {
            let principios: String = r.get(3)?;
            let secoes: String = r.get(12)?;
            Ok(BulaImportada {
                registro: r.get(0)?,
                tipo: r.get(1)?,
                nome_produto: r.get(2)?,
                principios_ativos: serde_json::from_str(&principios).unwrap_or_default(),
                empresa: r.get(4)?,
                cnpj: r.get(5)?,
                data_bula: r.get(6)?,
                origem: r.get(7)?,
                url_origem: r.get(8)?,
                data_importacao: r.get(9)?,
                hash_arquivo: r.get(10)?,
                cabecalho: r.get(11)?,
                secoes: serde_json::from_str(&secoes).unwrap_or_default(),
            })
        })
        .map_err(erro_banco("consultar a bula importada"))?;
    linhas.collect::<Result<Vec<_>, _>>().map_err(erro_banco("ler a bula importada"))
}

/// Todas as bulas importadas, as mais recentes primeiro.
pub fn listar(con: &Connection) -> Result<Vec<BulaImportadaResumo>, ClinicalError> {
    if !existe_tabela(con)? {
        return Ok(Vec::new());
    }
    let mut stmt = con
        .prepare(&format!("SELECT {COLUNAS_RESUMO} FROM bulas_importadas ORDER BY data_importacao DESC, nome_produto"))
        .map_err(erro_banco("listar as bulas importadas"))?;
    let linhas = stmt.query_map([], ler_resumo).map_err(erro_banco("listar as bulas importadas"))?;
    linhas.collect::<Result<Vec<_>, _>>().map_err(erro_banco("ler as bulas importadas"))
}

fn abrir_gravavel(caminho_banco: &str) -> Result<Connection, ClinicalError> {
    let con = Connection::open(caminho_banco).map_err(erro_banco("abrir o banco para gravação"))?;
    // O atualizador diário pode estar gravando: espera em vez de falhar
    con.busy_timeout(std::time::Duration::from_secs(30))
        .map_err(erro_banco("configurar espera do banco"))?;
    Ok(con)
}

/// `salvar` abrindo o arquivo do banco (o app abre as consultas somente leitura).
pub fn salvar_no_banco(caminho_banco: &str, bula: &BulaImportada) -> Result<BulaImportadaResumo, ClinicalError> {
    salvar(&mut abrir_gravavel(caminho_banco)?, bula)
}

pub fn remover_do_banco(caminho_banco: &str, registro: &str, tipo: &str) -> Result<bool, ClinicalError> {
    remover(&mut abrir_gravavel(caminho_banco)?, registro, tipo)
}

/// Remove a bula e o item da busca. Devolve se havia algo para remover.
pub fn remover(con: &mut Connection, registro: &str, tipo: &str) -> Result<bool, ClinicalError> {
    if !existe_tabela(con)? {
        return Ok(false);
    }
    let tx = con.transaction().map_err(erro_banco("remover a bula importada"))?;
    let removidas = tx
        .execute("DELETE FROM bulas_importadas WHERE registro = ?1 AND tipo = ?2", params![registro, tipo])
        .map_err(erro_banco("remover a bula importada"))?;
    tx.execute(
        "DELETE FROM indice_busca_fts WHERE tipo_registro = ?1 AND id_referencia = ?2",
        params![TIPO_REGISTRO_FTS, id_fts(registro, tipo)],
    )
    .map_err(erro_banco("atualizar o índice de busca"))?;
    tx.commit().map_err(erro_banco("concluir a remoção da bula"))?;
    Ok(removidas > 0)
}
