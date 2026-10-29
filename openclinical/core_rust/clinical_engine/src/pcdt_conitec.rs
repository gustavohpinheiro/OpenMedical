//! Protocolos Clínicos e Diretrizes Terapêuticas (PCDT) da CONITEC.
//!
//! O conteúdo (seções, CIDs, fármacos) é extraído dos PDFs oficiais pelo ETL em Python
//! (`etl_pipeline/extrator_pcdt_conitec.py`), que grava a tabela `pcdt_documentos`. Aqui ficam a consulta para o app
//! e a leitura da lista oficial pela API REST do portal gov.br, usada pelo atualizador diário: PCDT novos entram
//! na lista, portarias e links são atualizados, e um PDF trocado marca o conteúdo extraído como desatualizado
//! até a próxima execução do ETL.

use crate::errors::ClinicalError;
use rusqlite::{params, Connection, OptionalExtension};
use serde::{Deserialize, Serialize};
use serde_json::Value;

pub const URL_API_LISTA: &str = "https://www.gov.br/conitec/++api++/pt-br/assuntos/avaliacao-de-tecnologias-em-saude/protocolos-clinicos-e-diretrizes-terapeuticas/pcdt";
pub const TIPO_REGISTRO_FTS: &str = "pcdt_conitec";

pub const ESQUEMA_SQL: &str = "
    CREATE TABLE IF NOT EXISTS pcdt_documentos (
        id_pcdt INTEGER PRIMARY KEY,
        slug TEXT NOT NULL UNIQUE,
        titulo TEXT NOT NULL,
        portaria TEXT NOT NULL DEFAULT '',
        data_portaria TEXT NOT NULL DEFAULT '',
        url_pdf TEXT NOT NULL,
        url_portaria TEXT NOT NULL DEFAULT '',
        url_publicacao_ms TEXT NOT NULL DEFAULT '',
        url_resumido TEXT NOT NULL DEFAULT '',
        paginas INTEGER NOT NULL DEFAULT 0,
        tem_texto INTEGER NOT NULL DEFAULT 0,
        cids_json TEXT NOT NULL DEFAULT '[]',
        farmacos_json TEXT NOT NULL DEFAULT '[]',
        secoes_json TEXT NOT NULL DEFAULT '[]',
        hash_pdf TEXT NOT NULL DEFAULT '',
        extraido_em TEXT,
        conteudo_desatualizado INTEGER NOT NULL DEFAULT 0,
        na_lista_oficial INTEGER NOT NULL DEFAULT 1
    );";

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ItemListaPcdt {
    pub titulo: String,
    pub slug: String,
    pub url_pdf: String,
    pub portaria: String,
    /// AAAA-MM-DD da publicação da portaria
    pub data_portaria: String,
    pub url_portaria: String,
    pub url_publicacao_ms: String,
    pub url_resumido: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct FarmacoPcdt {
    pub nome: String,
    pub chave: String,
    pub no_rename: bool,
    pub id_monografia_ftn: Option<i64>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct SecaoPcdt {
    pub chave: String,
    pub titulo: String,
    pub pagina: i64,
    pub texto: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct PcdtResumo {
    pub id_pcdt: i64,
    pub titulo: String,
    pub portaria: String,
    pub data_portaria: String,
    pub url_pdf: String,
    pub url_portaria: String,
    pub url_publicacao_ms: String,
    pub url_resumido: String,
    pub paginas: i64,
    pub tem_texto: bool,
    pub cids: Vec<String>,
    pub farmacos: Vec<FarmacoPcdt>,
    pub secoes_disponiveis: Vec<String>,
    /// A CONITEC trocou o PDF depois da última extração
    pub conteudo_desatualizado: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct PcdtDetalhe {
    #[serde(flatten)]
    pub resumo: PcdtResumo,
    pub secoes: Vec<SecaoPcdt>,
}

fn erro_banco(contexto: &'static str) -> impl Fn(rusqlite::Error) -> ClinicalError {
    move |e| ClinicalError::ErroBancoDados {
        mensagem: format!("Falha ao {contexto}: {e}"),
    }
}

// ---------------------------------------------------------------------------
// Lista oficial (JSON da API do portal) - mesmas regras de `listar_pcdt` no ETL em Python
// ---------------------------------------------------------------------------

fn tabelas<'a>(no: &'a Value, saida: &mut Vec<&'a Value>) {
    match no {
        Value::Object(mapa) => {
            if mapa.get("@type").and_then(Value::as_str) == Some("slateTable") {
                saida.push(no);
            }
            for valor in mapa.values() {
                tabelas(valor, saida);
            }
        }
        Value::Array(lista) => lista.iter().for_each(|v| tabelas(v, saida)),
        _ => {}
    }
}

fn texto_slate(no: &Value) -> String {
    match no {
        Value::Object(mapa) => match mapa.get("text").and_then(Value::as_str) {
            Some(texto) => texto.to_string(),
            None => mapa.get("children").map(texto_slate_filhos).unwrap_or_default(),
        },
        Value::Array(lista) => lista.iter().map(texto_slate).collect::<Vec<_>>().join(" "),
        _ => String::new(),
    }
}

fn texto_slate_filhos(filhos: &Value) -> String {
    filhos.as_array().map(|l| l.iter().map(texto_slate).collect::<String>()).unwrap_or_default()
}

fn links_slate(no: &Value, saida: &mut Vec<String>) {
    match no {
        Value::Object(mapa) => {
            if mapa.get("type").and_then(Value::as_str) == Some("link") {
                if let Some(url) = mapa.get("data").and_then(|d| d.get("url")).and_then(Value::as_str) {
                    saida.push(url.to_string());
                }
            }
            if let Some(filhos) = mapa.get("children").and_then(Value::as_array) {
                filhos.iter().for_each(|f| links_slate(f, saida));
            }
        }
        Value::Array(lista) => lista.iter().for_each(|v| links_slate(v, saida)),
        _ => {}
    }
}

fn limpar(texto: &str) -> String {
    let unido = texto.replace('\u{a0}', " ").split_whitespace().collect::<Vec<_>>().join(" ");
    unido.trim_matches(|c: char| c == ' ' || c == '/' || c == '-' || c == '\u{2013}').to_string()
}

fn sem_acento(c: char) -> char {
    match c {
        'á' | 'à' | 'â' | 'ã' | 'ä' => 'a',
        'é' | 'è' | 'ê' | 'ë' => 'e',
        'í' | 'ì' | 'î' | 'ï' => 'i',
        'ó' | 'ò' | 'ô' | 'õ' | 'ö' => 'o',
        'ú' | 'ù' | 'û' | 'ü' => 'u',
        'ç' => 'c',
        'ñ' => 'n',
        outro => outro,
    }
}

/// ".../protocolos/2026/pcdt-diabete-melito-tipo-2/@@display-file/file" -> "pcdt-diabete-melito-tipo-2".
pub fn slug_da_url(url: &str) -> String {
    let caminho = url.split("/@@").next().unwrap_or(url).trim_end_matches('/');
    let mut nome = caminho.rsplit('/').next().unwrap_or(caminho).to_lowercase();
    if nome.ends_with(".pdf") {
        nome.truncate(nome.len() - 4);
    }
    let mut slug = String::new();
    for c in nome.chars().map(sem_acento) {
        if c.is_ascii_alphanumeric() {
            slug.push(c);
        } else if !slug.ends_with('-') {
            slug.push('-');
        }
    }
    slug.trim_matches('-').chars().take(150).collect::<String>().trim_end_matches('-').to_string()
}

/// Primeira data dd/mm/aaaa do texto, como AAAA-MM-DD.
fn primeira_data(texto: &str) -> Option<String> {
    let bytes = texto.as_bytes();
    (0..bytes.len().saturating_sub(9)).find_map(|i| {
        let trecho = &bytes[i..i + 10];
        let digito = |j: usize| trecho[j].is_ascii_digit();
        let valida = digito(0) && digito(1) && trecho[2] == b'/' && digito(3) && digito(4) && trecho[5] == b'/'
            && (6..10).all(digito)
            && (i == 0 || !bytes[i - 1].is_ascii_digit());
        valida.then(|| {
            let s = std::str::from_utf8(trecho).unwrap_or_default();
            format!("{}-{}-{}", &s[6..10], &s[3..5], &s[0..2])
        })
    })
}

/// Linhas da "Tabela de PCDT": [nome + PDF] [portaria (publicada em [data])] [publicação MS] [PCDT resumido].
pub fn ler_lista_api(json: &str) -> Result<Vec<ItemListaPcdt>, String> {
    let dados: Value = serde_json::from_str(json).map_err(|e| format!("resposta da CONITEC não é JSON: {e}"))?;
    let mut todas = Vec::new();
    tabelas(dados.get("blocks").unwrap_or(&Value::Null), &mut todas);
    let tabela = todas
        .into_iter()
        .find(|t| t.pointer("/table/caption").and_then(Value::as_str).is_some_and(|c| c.contains("PCDT")))
        .ok_or("a página da CONITEC não tem mais a 'Tabela de PCDT': o formato mudou")?;
    let linhas = tabela.pointer("/table/rows").and_then(Value::as_array).cloned().unwrap_or_default();

    let mut itens = Vec::new();
    let mut vistos = std::collections::HashSet::new();
    for linha in &linhas {
        let celulas: Vec<&Value> = linha
            .get("cells")
            .and_then(Value::as_array)
            .map(|c| c.iter().map(|cel| cel.get("value").unwrap_or(&Value::Null)).collect())
            .unwrap_or_default();
        let Some(primeira) = celulas.first() else { continue };
        let mut links_nome = Vec::new();
        links_slate(primeira, &mut links_nome);
        let Some(url_pdf) = links_nome.into_iter().next() else { continue };
        let titulo = limpar(&texto_slate(primeira));
        if titulo.is_empty() || !vistos.insert(url_pdf.clone()) {
            continue;
        }
        let celula = |i: usize| celulas.get(i).copied().unwrap_or(&Value::Null);
        let primeiro_link = |i: usize| {
            let mut links = Vec::new();
            links_slate(celula(i), &mut links);
            links.into_iter().next().unwrap_or_default()
        };
        let portaria_texto = limpar(&texto_slate(celula(1)));
        let (portaria, data_portaria) = match portaria_texto.find("Publicada em") {
            Some(posicao) => (
                portaria_texto[..posicao].trim_end_matches(|c: char| c == '(' || c.is_whitespace()).to_string(),
                primeira_data(&portaria_texto[posicao..]).unwrap_or_default(),
            ),
            None => (portaria_texto.clone(), primeira_data(&portaria_texto).unwrap_or_default()),
        };
        // Arquivos de mesmo nome em pastas diferentes: sufixo na ordem da tabela (igual ao ETL em Python)
        let base = slug_da_url(&url_pdf);
        let mut slug = base.clone();
        let mut n = 2;
        while itens.iter().any(|i: &ItemListaPcdt| i.slug == slug) {
            slug = format!("{base}-{n}");
            n += 1;
        }
        itens.push(ItemListaPcdt {
            slug,
            titulo,
            url_pdf,
            portaria,
            data_portaria,
            url_portaria: primeiro_link(1),
            url_publicacao_ms: primeiro_link(2),
            url_resumido: primeiro_link(3),
        });
    }
    Ok(itens)
}

/// Atualiza a lista na tabela `pcdt_documentos` (dentro da transação do atualizador). Devolve quantos PCDT há na lista.
pub fn aplicar_lista(con: &Connection, itens: &[ItemListaPcdt]) -> Result<usize, String> {
    con.execute_batch(ESQUEMA_SQL).map_err(|e| e.to_string())?;
    con.execute("UPDATE pcdt_documentos SET na_lista_oficial = 0", []).map_err(|e| e.to_string())?;
    for item in itens {
        let existente: Option<(i64, String)> = con
            .query_row("SELECT id_pcdt, url_pdf FROM pcdt_documentos WHERE slug = ?1", params![item.slug], |r| {
                Ok((r.get(0)?, r.get(1)?))
            })
            .optional()
            .map_err(|e| e.to_string())?;
        match existente {
            Some((id_pcdt, url_anterior)) => {
                con.execute(
                    "UPDATE pcdt_documentos SET titulo = ?2, portaria = ?3, data_portaria = ?4, url_pdf = ?5, url_portaria = ?6,
                        url_publicacao_ms = ?7, url_resumido = ?8, na_lista_oficial = 1,
                        conteudo_desatualizado = CASE WHEN ?9 THEN 1 ELSE conteudo_desatualizado END
                     WHERE id_pcdt = ?1",
                    params![
                        id_pcdt,
                        item.titulo,
                        item.portaria,
                        item.data_portaria,
                        item.url_pdf,
                        item.url_portaria,
                        item.url_publicacao_ms,
                        item.url_resumido,
                        url_anterior != item.url_pdf
                    ],
                )
                .map_err(|e| e.to_string())?;
            }
            None => {
                // PCDT novo: entra na lista com os links; o texto vem na próxima execução do ETL
                con.execute(
                    "INSERT INTO pcdt_documentos (id_pcdt, slug, titulo, portaria, data_portaria, url_pdf, url_portaria,
                        url_publicacao_ms, url_resumido, conteudo_desatualizado, na_lista_oficial)
                     VALUES ((SELECT COALESCE(MAX(id_pcdt), 0) + 1 FROM pcdt_documentos), ?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, 1, 1)",
                    params![
                        item.slug,
                        item.titulo,
                        item.portaria,
                        item.data_portaria,
                        item.url_pdf,
                        item.url_portaria,
                        item.url_publicacao_ms,
                        item.url_resumido
                    ],
                )
                .map_err(|e| e.to_string())?;
            }
        }
    }
    // Índice de busca: título e CIDs da lista atual (o conteúdo extraído entra pelo ETL)
    con.execute_batch(
        "DELETE FROM indice_busca_fts WHERE tipo_registro IN ('pcdt_conitec', 'pcdt_governo');
         INSERT INTO indice_busca_fts (tipo_registro, id_referencia, titulo_primario, subtitulo, conteudo_textual)
         SELECT 'pcdt_conitec', id_pcdt, titulo,
                'PCDT CONITEC' || CASE WHEN portaria != '' THEN ' - ' || portaria ELSE '' END,
                titulo || ' ' || cids_json || ' ' || farmacos_json
         FROM pcdt_documentos WHERE na_lista_oficial = 1;",
    )
    .map_err(|e| e.to_string())?;
    Ok(itens.len())
}

// ---------------------------------------------------------------------------
// Consulta para o app
// ---------------------------------------------------------------------------

fn existe_tabela(con: &Connection) -> Result<bool, ClinicalError> {
    Ok(con
        .query_row("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'pcdt_documentos'", [], |_| Ok(true))
        .optional()
        .map_err(erro_banco("consultar os PCDT"))?
        .unwrap_or(false))
}

const COLUNAS: &str = "id_pcdt, titulo, portaria, data_portaria, url_pdf, url_portaria, url_publicacao_ms, url_resumido,
                       paginas, tem_texto, cids_json, farmacos_json, secoes_json, conteudo_desatualizado";

fn ler_linha(r: &rusqlite::Row<'_>) -> rusqlite::Result<PcdtDetalhe> {
    let cids: String = r.get(10)?;
    let farmacos: String = r.get(11)?;
    let secoes_json: String = r.get(12)?;
    let secoes: Vec<SecaoPcdt> = serde_json::from_str(&secoes_json).unwrap_or_default();
    Ok(PcdtDetalhe {
        resumo: PcdtResumo {
            id_pcdt: r.get(0)?,
            titulo: r.get(1)?,
            portaria: r.get(2)?,
            data_portaria: r.get(3)?,
            url_pdf: r.get(4)?,
            url_portaria: r.get(5)?,
            url_publicacao_ms: r.get(6)?,
            url_resumido: r.get(7)?,
            paginas: r.get(8)?,
            tem_texto: r.get::<_, i64>(9)? != 0,
            cids: serde_json::from_str(&cids).unwrap_or_default(),
            farmacos: serde_json::from_str(&farmacos).unwrap_or_default(),
            secoes_disponiveis: secoes.iter().map(|s| s.chave.clone()).collect(),
            conteudo_desatualizado: r.get::<_, i64>(13)? != 0,
        },
        secoes,
    })
}

/// PCDT da lista oficial vigente, em ordem alfabética (sem o texto das seções).
pub fn listar(con: &Connection) -> Result<Vec<PcdtResumo>, ClinicalError> {
    if !existe_tabela(con)? {
        return Ok(Vec::new());
    }
    let mut stmt = con
        .prepare(&format!("SELECT {COLUNAS} FROM pcdt_documentos WHERE na_lista_oficial = 1 ORDER BY titulo COLLATE NOCASE"))
        .map_err(erro_banco("listar os PCDT"))?;
    let linhas = stmt.query_map([], ler_linha).map_err(erro_banco("listar os PCDT"))?;
    linhas
        .map(|l| l.map(|d| d.resumo))
        .collect::<Result<Vec<_>, _>>()
        .map_err(erro_banco("ler os PCDT"))
}

/// PCDT com o texto completo das seções extraídas.
pub fn obter(con: &Connection, id_pcdt: i64) -> Result<Option<PcdtDetalhe>, ClinicalError> {
    if !existe_tabela(con)? {
        return Ok(None);
    }
    con.query_row(&format!("SELECT {COLUNAS} FROM pcdt_documentos WHERE id_pcdt = ?1"), params![id_pcdt], ler_linha)
        .optional()
        .map_err(erro_banco("consultar o PCDT"))
}
