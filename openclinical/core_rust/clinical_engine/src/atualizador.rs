//! Atualizador diário das bases oficiais da ANVISA usadas nas receitas e na consulta de medicamentos:
//! preços máximos e apresentações da CMED, registros de medicamentos e índice do Bulário Eletrônico.
//!
//! Cada fonte é baixada com requisição condicional (ETag / Last-Modified): sem mudança, nada é regravado.
//! O arquivo novo só substitui a tabela se tiver ao menos metade das linhas atuais, e tudo acontece em uma
//! única transação: um download truncado ou uma mudança de formato não apaga os dados existentes.

use crate::errors::ClinicalError;
use rusqlite::{params, Connection, OptionalExtension};
use serde::{Deserialize, Serialize};
use std::io::Read;
use std::time::Duration;

/// Intervalo entre verificações automáticas.
pub const INTERVALO_ATUALIZACAO_HORAS: f64 = 24.0;
const LIMITE_DOWNLOAD_BYTES: u64 = 200 * 1024 * 1024;
const PROPORCAO_MINIMA_LINHAS: f64 = 0.5;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum TipoFonte {
    PrecosCmed,
    RegistrosAnvisa,
    IndiceBulas,
}

#[derive(Debug, Clone, Copy)]
pub struct FonteDados {
    pub id: &'static str,
    pub descricao: &'static str,
    pub url: &'static str,
    pub tipo: TipoFonte,
    /// Abaixo disso o arquivo é tratado como incompleto
    pub minimo_linhas: usize,
}

pub const FONTES: [FonteDados; 3] = [
    FonteDados {
        id: "cmed_precos",
        descricao: "Preços máximos e apresentações (CMED/ANVISA)",
        url: "https://dados.anvisa.gov.br/dados/TA_PRECO_MEDICAMENTO.csv",
        tipo: TipoFonte::PrecosCmed,
        minimo_linhas: 1000,
    },
    FonteDados {
        id: "anvisa_registros",
        descricao: "Medicamentos registrados (dados abertos ANVISA)",
        url: "https://dados.anvisa.gov.br/dados/DADOS_ABERTOS_MEDICAMENTOS.csv",
        tipo: TipoFonte::RegistrosAnvisa,
        minimo_linhas: 1000,
    },
    FonteDados {
        id: "anvisa_bulas",
        descricao: "Índice do Bulário Eletrônico (dados abertos ANVISA)",
        url: "https://dados.anvisa.gov.br/dados/CONSULTAS/DOCUMENTOS/TA_CONSULTA_BULA_PRODUTO.CSV",
        tipo: TipoFonte::IndiceBulas,
        minimo_linhas: 500,
    },
];

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ResultadoAtualizacao {
    pub fonte: String,
    pub descricao: String,
    /// "atualizada", "sem_mudanca" ou "erro"
    pub situacao: String,
    pub registros: Option<i64>,
    pub mensagem: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct EstadoFonte {
    pub fonte: String,
    pub descricao: String,
    pub verificado_em: Option<String>,
    pub atualizado_em: Option<String>,
    pub registros: Option<i64>,
    pub situacao: Option<String>,
    pub mensagem: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct BulaAnvisaIndice {
    pub numero_registro: String,
    pub nome_produto: String,
    pub empresa: String,
    pub expediente: String,
    /// AAAA-MM-DD
    pub data_publicacao: String,
    pub url_bulario: String,
}

// ---------------------------------------------------------------------------
// Esquema
// ---------------------------------------------------------------------------

/// Cria as tabelas do atualizador (e as tabelas de destino, num banco novo) sem tocar nas existentes.
pub fn garantir_esquema(con: &Connection) -> Result<(), ClinicalError> {
    con.execute_batch(
        r#"
        CREATE TABLE IF NOT EXISTS atualizacoes_bases (
            fonte TEXT PRIMARY KEY,
            url TEXT NOT NULL,
            etag TEXT,
            last_modified TEXT,
            verificado_em TEXT,
            atualizado_em TEXT,
            registros INTEGER,
            situacao TEXT,
            mensagem TEXT
        );
        CREATE TABLE IF NOT EXISTS catalogo_nacional_medicamentos_cmed (
            id_cmed INTEGER PRIMARY KEY AUTOINCREMENT,
            substancia TEXT NOT NULL,
            nome_produto TEXT NOT NULL,
            apresentacao TEXT NOT NULL,
            classe_terapeutica TEXT,
            tipo_produto TEXT,
            laboratorio TEXT,
            numero_registro TEXT,
            codigo_ean TEXT,
            tarja TEXT,
            preco_maximo_consumidor REAL,
            receita_padrao_copiavel TEXT
        );
        CREATE TABLE IF NOT EXISTS remedios_brasil_anvisa_completo (
            id_registro INTEGER PRIMARY KEY AUTOINCREMENT,
            nome_produto TEXT NOT NULL,
            principio_ativo TEXT NOT NULL,
            classe_terapeutica TEXT,
            categoria_regulatoria TEXT,
            numero_registro TEXT NOT NULL,
            laboratorio_fabricante TEXT,
            situacao_registro TEXT,
            modelo_prescricao_sugerida TEXT
        );
        CREATE TABLE IF NOT EXISTS bulas_anvisa_indice (
            numero_registro TEXT PRIMARY KEY,
            id_produto INTEGER,
            nome_produto TEXT NOT NULL,
            empresa TEXT,
            cnpj TEXT,
            expediente TEXT,
            data_publicacao TEXT
        );
        CREATE VIRTUAL TABLE IF NOT EXISTS indice_busca_fts USING fts5(
            tipo_registro, id_referencia UNINDEXED, titulo_primario, subtitulo, conteudo_textual,
            tokenize = 'unicode61 remove_diacritics 2'
        );
        "#,
    )
    .map_err(erro_banco("criar tabelas do atualizador"))
}

fn erro_banco(contexto: &'static str) -> impl Fn(rusqlite::Error) -> ClinicalError {
    move |e| ClinicalError::ErroBancoDados {
        mensagem: format!("Falha ao {contexto}: {e}"),
    }
}

// ---------------------------------------------------------------------------
// Leitura dos arquivos (sem rede, testável)
// ---------------------------------------------------------------------------

/// Os arquivos da ANVISA vêm em UTF-8 (CMED, com BOM) ou Windows-1252 (registros, bulas).
pub fn decodificar_texto(bytes: &[u8]) -> String {
    let sem_bom = bytes.strip_prefix(&[0xEF, 0xBB, 0xBF]).unwrap_or(bytes);
    match std::str::from_utf8(sem_bom) {
        Ok(texto) => texto.to_string(),
        Err(_) => encoding_rs::WINDOWS_1252.decode(sem_bom).0.into_owned(),
    }
}

fn leitor_csv(texto: &str, com_cabecalho: bool) -> csv::Reader<&[u8]> {
    csv::ReaderBuilder::new()
        .delimiter(b';')
        .has_headers(com_cabecalho)
        .flexible(true)
        .from_reader(texto.as_bytes())
}

fn indices_cabecalho(leitor: &mut csv::Reader<&[u8]>, colunas: &[&str]) -> Result<Vec<usize>, String> {
    let cabecalho = leitor.headers().map_err(|e| format!("cabeçalho ilegível: {e}"))?.clone();
    let nomes: Vec<String> = cabecalho.iter().map(|c| c.trim().to_uppercase()).collect();
    colunas
        .iter()
        .map(|coluna| {
            nomes
                .iter()
                .position(|n| n == coluna)
                .ok_or_else(|| format!("coluna '{coluna}' ausente no arquivo"))
        })
        .collect()
}

fn campo(registro: &csv::StringRecord, indice: usize) -> String {
    registro.get(indice).unwrap_or("").trim().trim_matches('"').trim().to_string()
}

#[derive(Debug, Clone, PartialEq)]
pub struct LinhaCmed {
    pub substancia: String,
    pub nome_produto: String,
    pub apresentacao: String,
    pub classe_terapeutica: String,
    pub tipo_produto: String,
    pub laboratorio: String,
    pub numero_registro: String,
    pub codigo_ean: String,
    pub tarja: String,
    pub preco_maximo_consumidor: f64,
}

fn ler_preco(valor: &str) -> f64 {
    valor.replace('.', "").replace(',', ".").trim().parse().unwrap_or(0.0)
}

/// TA_PRECO_MEDICAMENTO.csv: uma linha por apresentação; o PMC usado é o da coluna com ICMS de 18%.
pub fn ler_precos_cmed(texto: &str) -> Result<Vec<LinhaCmed>, String> {
    let mut leitor = leitor_csv(texto, true);
    let i = indices_cabecalho(
        &mut leitor,
        &[
            "SUBSTÂNCIA",
            "LABORATÓRIO",
            "REGISTRO",
            "EAN 1",
            "PRODUTO",
            "APRESENTAÇÃO",
            "CLASSE TERAPÊUTICA",
            "TIPO DE PRODUTO (STATUS DO PRODUTO)",
            "PMC 18 %",
            "TARJA",
        ],
    )?;
    let mut linhas = Vec::new();
    for registro in leitor.records() {
        let Ok(registro) = registro else { continue };
        if registro.len() < 15 {
            continue;
        }
        let nome_produto = campo(&registro, i[4]);
        if nome_produto.is_empty() {
            continue;
        }
        let tarja = campo(&registro, i[9]);
        linhas.push(LinhaCmed {
            substancia: campo(&registro, i[0]),
            laboratorio: campo(&registro, i[1]),
            numero_registro: campo(&registro, i[2]),
            codigo_ean: campo(&registro, i[3]),
            nome_produto,
            apresentacao: campo(&registro, i[5]),
            classe_terapeutica: campo(&registro, i[6]),
            tipo_produto: campo(&registro, i[7]),
            preco_maximo_consumidor: ler_preco(&campo(&registro, i[8])),
            tarja: if tarja.is_empty() { "Venda sob Prescrição".to_string() } else { tarja },
        });
    }
    Ok(linhas)
}

/// Modelo de receita sem posologia (mesmo texto de etl_pipeline/compilar_cmed_completo.py).
pub fn modelo_receita_cmed(linha: &LinhaCmed) -> String {
    let apresentacao = linha.apresentacao.to_uppercase();
    let contem = |trechos: &[&str]| trechos.iter().any(|t| apresentacao.contains(t));
    let tipo_uso = if contem(&["CREM", "POM", "GEL", "SOL TOP"]) {
        "USO TÓPICO / DERMATOLÓGICO"
    } else if contem(&["AER", "SPRAY", "INAL"]) {
        "USO INALATÓRIO"
    } else if contem(&["COL"]) {
        "USO OFTÁLMICO"
    } else if contem(&["INJ", "AMP", "FA "]) {
        "USO INJETÁVEL (IM/IV/SC)"
    } else {
        "USO ORAL"
    };
    let tipo_receituario = if linha.tarja.to_uppercase().contains("PRETA") {
        "MEDICAMENTO DE TARJA PRETA (verificar lista da Portaria SVS/MS 344/98: Notificação de Receita ou Receita de Controle Especial)"
    } else if linha.classe_terapeutica.trim().to_uppercase().starts_with("J01") {
        "ANTIMICROBIANO SISTÊMICO (receita em 2 vias, 1ª via retida na farmácia - RDC 20/2011)"
    } else {
        "RECEITUÁRIO MÉDICO"
    };
    let produto = linha.nome_produto.to_uppercase();
    format!(
        "{tipo_receituario}\nMedicamento: {produto}\nPrincípio Ativo (DCB): {}\nApresentação Comercial: {}\nFabricante: {}\n\n\
         {tipo_uso}:\n1. {produto} ({}) -------------------- 1 embalagem original\n   \
         Posologia: [PREENCHER dose, via, intervalo e duração - modelo sem posologia, não é prescrição pronta]\n\n\
         Orientações ao Paciente:\n- [PREENCHER orientações específicas ao paciente]",
        linha.substancia, linha.apresentacao, linha.laboratorio, linha.apresentacao
    )
}

#[derive(Debug, Clone, PartialEq)]
pub struct LinhaRegistro {
    pub nome_produto: String,
    pub principio_ativo: String,
    pub classe_terapeutica: String,
    pub categoria_regulatoria: String,
    pub numero_registro: String,
    pub laboratorio_fabricante: String,
}

/// DADOS_ABERTOS_MEDICAMENTOS.csv: só registros com situação "Ativo".
pub fn ler_registros_anvisa(texto: &str) -> Result<Vec<LinhaRegistro>, String> {
    let mut leitor = leitor_csv(texto, true);
    let i = indices_cabecalho(
        &mut leitor,
        &[
            "NOME_PRODUTO",
            "PRINCIPIO_ATIVO",
            "CLASSE_TERAPEUTICA",
            "CATEGORIA_REGULATORIA",
            "NUMERO_REGISTRO_PRODUTO",
            "EMPRESA_DETENTORA_REGISTRO",
            "SITUACAO_REGISTRO",
        ],
    )?;
    let mut linhas = Vec::new();
    for registro in leitor.records() {
        let Ok(registro) = registro else { continue };
        let nome_produto = campo(&registro, i[0]);
        if nome_produto.is_empty() || !campo(&registro, i[6]).eq_ignore_ascii_case("ativo") {
            continue;
        }
        let principio = campo(&registro, i[1]);
        let classe = campo(&registro, i[2]);
        linhas.push(LinhaRegistro {
            principio_ativo: if principio.is_empty() { nome_produto.clone() } else { principio },
            classe_terapeutica: if classe.is_empty() { "Farmacoterápico Registrado".to_string() } else { classe },
            categoria_regulatoria: campo(&registro, i[3]),
            numero_registro: campo(&registro, i[4]),
            laboratorio_fabricante: campo(&registro, i[5]),
            nome_produto,
        });
    }
    Ok(linhas)
}

#[derive(Debug, Clone, PartialEq)]
pub struct LinhaBula {
    pub id_produto: Option<i64>,
    pub nome_produto: String,
    pub numero_registro: String,
    pub cnpj: String,
    pub empresa: String,
    pub expediente: String,
    pub data_publicacao: String,
}

/// "11/03/2025 15:09:27" (mês/dia/ano, como no arquivo da ANVISA) -> "2025-11-03"
fn data_iso_mes_dia_ano(texto: &str) -> String {
    let data = texto.split_whitespace().next().unwrap_or("");
    let partes: Vec<&str> = data.split('/').collect();
    match partes.as_slice() {
        [mes, dia, ano] if ano.len() == 4 => format!("{ano}-{mes:0>2}-{dia:0>2}"),
        _ => String::new(),
    }
}

/// TA_CONSULTA_BULA_PRODUTO.CSV (sem cabeçalho): produto, registro, empresa, expediente e data da bula vigente.
pub fn ler_indice_bulas(texto: &str) -> Result<Vec<LinhaBula>, String> {
    let mut leitor = leitor_csv(texto, false);
    let mut linhas = Vec::new();
    for registro in leitor.records() {
        let Ok(registro) = registro else { continue };
        if registro.len() < 10 {
            continue;
        }
        let numero_registro: String = campo(&registro, 2).chars().filter(char::is_ascii_digit).collect();
        let nome_produto = campo(&registro, 1);
        if numero_registro.len() < 9 || nome_produto.is_empty() {
            continue;
        }
        linhas.push(LinhaBula {
            id_produto: campo(&registro, 0).parse().ok(),
            nome_produto,
            numero_registro,
            cnpj: campo(&registro, 5),
            empresa: campo(&registro, 6),
            expediente: campo(&registro, 8),
            data_publicacao: data_iso_mes_dia_ano(&campo(&registro, 9)),
        });
    }
    if linhas.is_empty() {
        return Err("nenhuma linha de bula reconhecida".to_string());
    }
    Ok(linhas)
}

// ---------------------------------------------------------------------------
// Gravação
// ---------------------------------------------------------------------------

fn contar(con: &Connection, tabela: &str) -> i64 {
    con.query_row(&format!("SELECT COUNT(*) FROM {tabela}"), [], |r| r.get(0)).unwrap_or(0)
}

fn conferir_tamanho(fonte: &FonteDados, novas: usize, atuais: i64) -> Result<(), String> {
    if novas < fonte.minimo_linhas {
        return Err(format!("arquivo com {novas} linhas válidas, abaixo do mínimo de {}: mantidos os dados atuais", fonte.minimo_linhas));
    }
    if atuais > 0 && (novas as f64) < (atuais as f64) * PROPORCAO_MINIMA_LINHAS {
        return Err(format!("arquivo com {novas} linhas contra {atuais} atuais: possível download incompleto, mantidos os dados atuais"));
    }
    Ok(())
}

/// Substitui a tabela da fonte pelo conteúdo do arquivo, em uma transação. Devolve o número de linhas gravadas.
pub fn aplicar_arquivo(con: &mut Connection, fonte: &FonteDados, bytes: &[u8]) -> Result<i64, String> {
    let texto = decodificar_texto(bytes);
    let tx = con.transaction().map_err(|e| e.to_string())?;
    let total = match fonte.tipo {
        TipoFonte::PrecosCmed => {
            let linhas = ler_precos_cmed(&texto)?;
            conferir_tamanho(fonte, linhas.len(), contar(&tx, "catalogo_nacional_medicamentos_cmed"))?;
            tx.execute("DELETE FROM catalogo_nacional_medicamentos_cmed", []).map_err(|e| e.to_string())?;
            // Numeração recomeça em 1, na ordem do arquivo (ids iguais aos do ETL em Python)
            tx.execute("DELETE FROM sqlite_sequence WHERE name = 'catalogo_nacional_medicamentos_cmed'", [])
                .map_err(|e| e.to_string())?;
            {
                let mut inserir = tx
                    .prepare(
                        "INSERT INTO catalogo_nacional_medicamentos_cmed (substancia, nome_produto, apresentacao, classe_terapeutica, \
                         tipo_produto, laboratorio, numero_registro, codigo_ean, tarja, preco_maximo_consumidor, receita_padrao_copiavel) \
                         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)",
                    )
                    .map_err(|e| e.to_string())?;
                for l in &linhas {
                    inserir
                        .execute(params![
                            l.substancia,
                            l.nome_produto,
                            l.apresentacao,
                            l.classe_terapeutica,
                            l.tipo_produto,
                            l.laboratorio,
                            l.numero_registro,
                            l.codigo_ean,
                            l.tarja,
                            l.preco_maximo_consumidor,
                            modelo_receita_cmed(l)
                        ])
                        .map_err(|e| e.to_string())?;
                }
            }
            // Uma linha de busca por apresentação, como em etl_pipeline/compilar_cmed_completo.py
            tx.execute_batch(
                "DELETE FROM indice_busca_fts WHERE tipo_registro = 'cmed_comercial';
                 INSERT INTO indice_busca_fts (tipo_registro, id_referencia, titulo_primario, subtitulo, conteudo_textual)
                 SELECT 'cmed_comercial', id_cmed,
                        nome_produto || ' (' || apresentacao || ')',
                        substancia || ' - ' || laboratorio || ' | Reg. ' || numero_registro || ' | PMC R$ ' || ROUND(preco_maximo_consumidor, 2),
                        nome_produto || ' ' || substancia || ' ' || apresentacao || ' ' || classe_terapeutica || ' ' || laboratorio || ' ' || tipo_produto || ' ' || numero_registro
                 FROM catalogo_nacional_medicamentos_cmed;
                 INSERT INTO indice_busca_fts(indice_busca_fts) VALUES('optimize');",
            )
            .map_err(|e| e.to_string())?;
            linhas.len()
        }
        TipoFonte::RegistrosAnvisa => {
            let linhas = ler_registros_anvisa(&texto)?;
            conferir_tamanho(fonte, linhas.len(), contar(&tx, "remedios_brasil_anvisa_completo"))?;
            tx.execute("DELETE FROM remedios_brasil_anvisa_completo", []).map_err(|e| e.to_string())?;
            tx.execute("DELETE FROM sqlite_sequence WHERE name = 'remedios_brasil_anvisa_completo'", [])
                .map_err(|e| e.to_string())?;
            {
                let mut inserir = tx
                    .prepare(
                        "INSERT INTO remedios_brasil_anvisa_completo (nome_produto, principio_ativo, classe_terapeutica, categoria_regulatoria, \
                         numero_registro, laboratorio_fabricante, situacao_registro, modelo_prescricao_sugerida) \
                         VALUES (?1, ?2, ?3, ?4, ?5, ?6, 'Ativo', '')",
                    )
                    .map_err(|e| e.to_string())?;
                for l in &linhas {
                    inserir
                        .execute(params![
                            l.nome_produto,
                            l.principio_ativo,
                            l.classe_terapeutica,
                            l.categoria_regulatoria,
                            l.numero_registro,
                            l.laboratorio_fabricante
                        ])
                        .map_err(|e| e.to_string())?;
                }
            }
            linhas.len()
        }
        TipoFonte::IndiceBulas => {
            let linhas = ler_indice_bulas(&texto)?;
            conferir_tamanho(fonte, linhas.len(), contar(&tx, "bulas_anvisa_indice"))?;
            tx.execute("DELETE FROM bulas_anvisa_indice", []).map_err(|e| e.to_string())?;
            {
                // O mesmo registro pode aparecer mais de uma vez: fica a bula publicada mais recentemente
                let mut inserir = tx
                    .prepare(
                        "INSERT INTO bulas_anvisa_indice (numero_registro, id_produto, nome_produto, empresa, cnpj, expediente, data_publicacao) \
                         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7) \
                         ON CONFLICT(numero_registro) DO UPDATE SET id_produto = excluded.id_produto, nome_produto = excluded.nome_produto, \
                         empresa = excluded.empresa, cnpj = excluded.cnpj, expediente = excluded.expediente, data_publicacao = excluded.data_publicacao \
                         WHERE excluded.data_publicacao > bulas_anvisa_indice.data_publicacao",
                    )
                    .map_err(|e| e.to_string())?;
                for l in &linhas {
                    inserir
                        .execute(params![l.numero_registro, l.id_produto, l.nome_produto, l.empresa, l.cnpj, l.expediente, l.data_publicacao])
                        .map_err(|e| e.to_string())?;
                }
            }
            linhas.len()
        }
    };
    tx.commit().map_err(|e| e.to_string())?;
    Ok(total as i64)
}

// ---------------------------------------------------------------------------
// Rede e orquestração
// ---------------------------------------------------------------------------

enum Download {
    SemMudanca,
    Novo { bytes: Vec<u8>, etag: Option<String>, last_modified: Option<String> },
}

fn baixar(fonte: &FonteDados, etag: Option<&str>, last_modified: Option<&str>) -> Result<Download, String> {
    let agente = ureq::AgentBuilder::new()
        .timeout_connect(Duration::from_secs(30))
        .timeout_read(Duration::from_secs(300))
        .user_agent(concat!("OpenClinical/", env!("CARGO_PKG_VERSION"), " (atualizador de dados abertos)"))
        .build();
    let mut requisicao = agente.get(fonte.url);
    if let Some(valor) = etag {
        requisicao = requisicao.set("If-None-Match", valor);
    }
    if let Some(valor) = last_modified {
        requisicao = requisicao.set("If-Modified-Since", valor);
    }
    let resposta = requisicao.call().map_err(|e| format!("falha ao baixar {}: {e}", fonte.url))?;
    if resposta.status() == 304 {
        return Ok(Download::SemMudanca);
    }
    let etag = resposta.header("ETag").map(str::to_string);
    let last_modified = resposta.header("Last-Modified").map(str::to_string);
    let mut bytes = Vec::new();
    resposta
        .into_reader()
        .take(LIMITE_DOWNLOAD_BYTES)
        .read_to_end(&mut bytes)
        .map_err(|e| format!("download interrompido: {e}"))?;
    Ok(Download::Novo { bytes, etag, last_modified })
}

fn registrar(con: &Connection, fonte: &FonteDados, resultado: &ResultadoAtualizacao, etag: Option<&str>, last_modified: Option<&str>) {
    let atualizada = resultado.situacao == "atualizada";
    let _ = con.execute(
        "INSERT INTO atualizacoes_bases (fonte, url, etag, last_modified, verificado_em, atualizado_em, registros, situacao, mensagem)
         VALUES (?1, ?2, ?3, ?4, datetime('now'), CASE WHEN ?5 THEN datetime('now') END, ?6, ?7, ?8)
         ON CONFLICT(fonte) DO UPDATE SET
            url = excluded.url,
            etag = CASE WHEN ?5 THEN excluded.etag ELSE atualizacoes_bases.etag END,
            last_modified = CASE WHEN ?5 THEN excluded.last_modified ELSE atualizacoes_bases.last_modified END,
            verificado_em = excluded.verificado_em,
            atualizado_em = COALESCE(excluded.atualizado_em, atualizacoes_bases.atualizado_em),
            registros = COALESCE(excluded.registros, atualizacoes_bases.registros),
            situacao = excluded.situacao,
            mensagem = excluded.mensagem",
        params![fonte.id, fonte.url, etag, last_modified, atualizada, resultado.registros, resultado.situacao, resultado.mensagem],
    );
}

fn atualizar_fonte(con: &mut Connection, fonte: &FonteDados, forcar: bool) -> ResultadoAtualizacao {
    let anteriores: Option<(Option<String>, Option<String>)> = if forcar {
        None
    } else {
        con.query_row(
            "SELECT etag, last_modified FROM atualizacoes_bases WHERE fonte = ?1 AND situacao != 'erro'",
            params![fonte.id],
            |r| Ok((r.get(0)?, r.get(1)?)),
        )
        .optional()
        .unwrap_or(None)
    };
    let (etag_anterior, modificado_anterior) = anteriores.unwrap_or((None, None));

    let mut resultado = ResultadoAtualizacao {
        fonte: fonte.id.to_string(),
        descricao: fonte.descricao.to_string(),
        situacao: "erro".to_string(),
        registros: None,
        mensagem: String::new(),
    };
    let (mut etag, mut last_modified) = (None, None);
    match baixar(fonte, etag_anterior.as_deref(), modificado_anterior.as_deref()) {
        Ok(Download::SemMudanca) => {
            resultado.situacao = "sem_mudanca".to_string();
            resultado.mensagem = "Arquivo da ANVISA sem alteração desde a última atualização.".to_string();
        }
        Ok(Download::Novo { bytes, etag: e, last_modified: m }) => match aplicar_arquivo(con, fonte, &bytes) {
            Ok(total) => {
                resultado.situacao = "atualizada".to_string();
                resultado.registros = Some(total);
                resultado.mensagem = format!("{total} registros gravados.");
                (etag, last_modified) = (e, m);
            }
            Err(erro) => resultado.mensagem = erro,
        },
        Err(erro) => resultado.mensagem = erro,
    }
    registrar(con, fonte, &resultado, etag.as_deref(), last_modified.as_deref());
    resultado
}

/// Verifica e, quando houver versão nova, aplica todas as fontes. `forcar` ignora ETag/Last-Modified.
pub fn atualizar_bases(caminho_banco: &str, forcar: bool) -> Result<Vec<ResultadoAtualizacao>, ClinicalError> {
    let mut con = Connection::open(caminho_banco).map_err(erro_banco("abrir o banco para atualização"))?;
    con.busy_timeout(Duration::from_secs(30)).map_err(erro_banco("configurar espera do banco"))?;
    garantir_esquema(&con)?;
    Ok(FONTES.iter().map(|fonte| atualizar_fonte(&mut con, fonte, forcar)).collect())
}

/// Verdadeiro quando alguma fonte nunca foi verificada ou a última verificação passou do intervalo.
pub fn precisa_atualizar(caminho_banco: &str, intervalo_horas: f64) -> bool {
    let Ok(con) = Connection::open(caminho_banco) else { return false };
    if garantir_esquema(&con).is_err() {
        return false;
    }
    FONTES.iter().any(|fonte| {
        con.query_row(
            "SELECT (julianday('now') - julianday(verificado_em)) * 24 FROM atualizacoes_bases WHERE fonte = ?1",
            params![fonte.id],
            |r| r.get::<_, Option<f64>>(0),
        )
        .optional()
        .ok()
        .flatten()
        .flatten()
        .map_or(true, |horas| horas >= intervalo_horas)
    })
}

/// Situação de cada fonte para exibir na interface.
pub fn estado_atualizacao(con: &Connection) -> Vec<EstadoFonte> {
    FONTES
        .iter()
        .map(|fonte| {
            let linha = con
                .query_row(
                    "SELECT verificado_em, atualizado_em, registros, situacao, mensagem FROM atualizacoes_bases WHERE fonte = ?1",
                    params![fonte.id],
                    |r| Ok((r.get(0)?, r.get(1)?, r.get(2)?, r.get(3)?, r.get(4)?)),
                )
                .optional()
                .ok()
                .flatten();
            let (verificado_em, atualizado_em, registros, situacao, mensagem) = linha.unwrap_or((None, None, None, None, None));
            EstadoFonte {
                fonte: fonte.id.to_string(),
                descricao: fonte.descricao.to_string(),
                verificado_em,
                atualizado_em,
                registros,
                situacao,
                mensagem,
            }
        })
        .collect()
}

/// Bula vigente do produto no índice oficial do Bulário (pelos 9 primeiros dígitos do registro).
pub fn consultar_bula(con: &Connection, numero_registro: &str) -> Result<Option<BulaAnvisaIndice>, ClinicalError> {
    let digitos: String = numero_registro.chars().filter(char::is_ascii_digit).collect();
    if digitos.len() < 9 {
        return Ok(None);
    }
    let registro_produto = &digitos[..9];
    let existe_tabela: bool = con
        .query_row("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'bulas_anvisa_indice'", [], |_| Ok(true))
        .optional()
        .map_err(erro_banco("consultar o índice de bulas"))?
        .unwrap_or(false);
    if !existe_tabela {
        return Ok(None);
    }
    con.query_row(
        "SELECT numero_registro, nome_produto, COALESCE(empresa, ''), COALESCE(expediente, ''), COALESCE(data_publicacao, '')
         FROM bulas_anvisa_indice WHERE numero_registro = ?1",
        params![registro_produto],
        |r| {
            let numero_registro: String = r.get(0)?;
            Ok(BulaAnvisaIndice {
                url_bulario: format!("https://consultas.anvisa.gov.br/#/bulario/q/?numeroRegistro={numero_registro}"),
                numero_registro,
                nome_produto: r.get(1)?,
                empresa: r.get(2)?,
                expediente: r.get(3)?,
                data_publicacao: r.get(4)?,
            })
        },
    )
    .optional()
    .map_err(erro_banco("consultar o índice de bulas"))
}
