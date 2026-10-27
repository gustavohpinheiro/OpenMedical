use crate::errors::ClinicalError;
use crate::models::ProtocoloClinico;

/// Analisador sintático de protocolos clínicos no formato Docs-as-Code (Markdown + Frontmatter YAML).
pub fn analisar_protocolo_markdown(conteudo_arquivo: &str) -> Result<ProtocoloClinico, ClinicalError> {
    let linhas: Vec<&str> = conteudo_arquivo.lines().collect();

    if linhas.is_empty() || linhas[0].trim() != "---" {
        return Err(ClinicalError::FalhaParserProtocolo {
            motivo: "O documento deve iniciar com delimitador de frontmatter YAML '---' na primeira linha.".to_string(),
        });
    }

    let mut indice_fechamento: Option<usize> = None;
    for (i, linha) in linhas.iter().enumerate().skip(1) {
        if linha.trim() == "---" {
            indice_fechamento = Some(i);
            break;
        }
    }

    let fim_frontmatter = match indice_fechamento {
        Some(idx) => idx,
        None => {
            return Err(ClinicalError::FalhaParserProtocolo {
                motivo: "Delimitador de fechamento do frontmatter YAML '---' não foi localizado.".to_string(),
            });
        }
    };

    let mut id_protocolo = String::new();
    let mut titulo = String::new();
    let mut cids_relacionados: Vec<String> = Vec::new();
    let mut ciaps_relacionados: Vec<String> = Vec::new();
    let mut nivel_atencao = String::new();
    let mut data_revisao = String::new();

    // Extrai metadados do frontmatter YAML linha a linha de forma determinística
    for i in 1..fim_frontmatter {
        let linha = linhas[i].trim();
        if linha.is_empty() || linha.starts_with('#') {
            continue;
        }

        if let Some((chave, valor)) = linha.split_once(':') {
            let chave_limpa = chave.trim().to_lowercase();
            let valor_limpo = valor.trim().trim_matches('"').trim_matches('\'');

            match chave_limpa.as_str() {
                "id_protocolo" => id_protocolo = valor_limpo.to_string(),
                "titulo" => titulo = valor_limpo.to_string(),
                "nivel_atencao" => nivel_atencao = valor_limpo.to_string(),
                "data_revisao" => data_revisao = valor_limpo.to_string(),
                "cids_relacionados" | "cids" => {
                    cids_relacionados = parsear_lista_yaml(valor_limpo);
                }
                "ciaps_relacionados" | "ciaps" => {
                    ciaps_relacionados = parsear_lista_yaml(valor_limpo);
                }
                _ => {}
            }
        }
    }

    if id_protocolo.is_empty() {
        return Err(ClinicalError::FalhaParserProtocolo {
            motivo: "Metadado obrigatório 'id_protocolo' não informado no frontmatter.".to_string(),
        });
    }

    if titulo.is_empty() {
        return Err(ClinicalError::FalhaParserProtocolo {
            motivo: "Metadado obrigatório 'titulo' não informado no frontmatter.".to_string(),
        });
    }

    let corpo_markdown = linhas[(fim_frontmatter + 1)..].join("\n").trim().to_string();

    // Extrai bloco copiável de prescrição médica
    let bloco_prescricao = extrair_bloco_prescricao(&corpo_markdown);

    Ok(ProtocoloClinico {
        id_protocolo,
        titulo,
        cids_relacionados,
        ciaps_relacionados,
        nivel_atencao,
        data_revisao,
        conteudo_markdown: corpo_markdown,
        bloco_prescricao_copiavel: bloco_prescricao,
    })
}

fn parsear_lista_yaml(texto_lista: &str) -> Vec<String> {
    let limpo = texto_lista.trim().trim_start_matches('[').trim_end_matches(']');
    limpo
        .split(',')
        .map(|item| item.trim().trim_matches('"').trim_matches('\'').to_string())
        .filter(|s| !s.is_empty())
        .collect()
}

fn extrair_bloco_prescricao(conteudo_markdown: &str) -> String {
    // Procura por bloco delimitado com tags especiais ou cabeçalho de receita
    let marcadores = [
        "```receita",
        "```prescricao",
        "```prescrição",
        "## Modelo de Prescrição",
        "## Bloco de Prescrição Médica",
        "### Prescrição Sugerida",
    ];

    for marcador in marcadores {
        if let Some(pos_inicio) = conteudo_markdown.find(marcador) {
            let trecho = &conteudo_markdown[pos_inicio..];
            if marcador.starts_with("```") {
                if let Some(pos_fim) = trecho[marcador.len()..].find("```") {
                    return trecho[marcador.len()..(marcador.len() + pos_fim)].trim().to_string();
                }
            } else {
                // Se for cabeçalho Markdown, pega o texto até o próximo cabeçalho '##' ou fim
                let apos_cabecalho = &trecho[marcador.len()..];
                let fim = apos_cabecalho.find("\n## ").unwrap_or(apos_cabecalho.len());
                return apos_cabecalho[..fim].trim().to_string();
            }
        }
    }

    String::new()
}
