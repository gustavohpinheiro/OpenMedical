//! Cliente do Portal de APIs da ANVISA (api.anvisa.gov.br).
//!
//! Autenticação OAuth2 "client credentials" no Keycloak da ANVISA (realm `externo`): o Client ID é o CPF
//! (ou CNPJ) do titular da conta gov.br e o Client Secret é gerado por ele em api.anvisa.gov.br/client-manage.
//! As APIs publicadas cobrem Consultas Externas (produtos para saúde, UDI, certificados...), SNGPC, Lista CMED
//! e SNCR (numeração de receitas controladas). Não há endpoint de bula: o texto da bula segue no Bulário.

use serde::{Deserialize, Serialize};
use std::io::Read;
use std::time::Duration;

pub const URL_TOKEN: &str = "https://acesso.prd.apps.anvisa.gov.br/auth/realms/externo/protocol/openid-connect/token";
pub const URL_GATEWAY: &str = "https://api-gateway.prd.apps.anvisa.gov.br";
/// Página em que o titular cria o client e regenera o Client Secret (exige login gov.br)
pub const URL_GERENCIAR_CREDENCIAIS: &str = "https://api.anvisa.gov.br/client-manage";

/// Serviços conferidos no teste de conexão (especificação OpenAPI de cada um, tentando os endereços usuais
/// do springdoc). O SNCR fica de fora: suas operações emitem numeração oficial de receita e não devem ser
/// chamadas como teste.
pub const SERVICOS_VERIFICADOS: [(&str, &str); 2] = [
    ("Lista CMED (preços)", "/anvs-listacmed-service"),
    ("Consultas Externas", "/consultas-externas-api"),
];
const CAMINHOS_ESPECIFICACAO: [&str; 3] = ["/v3/api-docs", "/v2/api-docs", "/api-docs"];

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CredenciaisAnvisa {
    pub client_id: String,
    pub client_secret: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ServicoAnvisa {
    pub nome: String,
    /// "acessivel", "sem_permissao", "nao_publicado", "bloqueado_firewall" ou "erro"
    pub situacao: String,
    pub detalhe: String,
    /// "GET /api/v1/..." de cada operação publicada, quando a especificação é lida
    pub operacoes: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ResultadoTesteAnvisa {
    pub autenticado: bool,
    pub mensagem: String,
    pub token_expira_em_segundos: Option<u64>,
    pub servicos: Vec<ServicoAnvisa>,
}

/// CPF/CNPJ digitado com pontuação vira só dígitos; o secret só perde espaços nas pontas.
pub fn normalizar_credenciais(client_id: &str, client_secret: &str) -> Result<CredenciaisAnvisa, String> {
    let id = client_id.trim();
    let id = if id.chars().all(|c| c.is_ascii_digit() || ".-/ ".contains(c)) {
        id.chars().filter(char::is_ascii_digit).collect::<String>()
    } else {
        id.to_string()
    };
    if id.is_empty() {
        return Err("Informe o Client ID (o CPF do titular, só números).".to_string());
    }
    if id.chars().all(|c| c.is_ascii_digit()) && id.len() != 11 && id.len() != 14 {
        return Err(format!("O Client ID numérico deve ser um CPF (11 dígitos) ou CNPJ (14); foram informados {}.", id.len()));
    }
    let secret = client_secret.trim();
    if secret.is_empty() {
        return Err("Informe o Client Secret gerado no Portal de APIs da ANVISA.".to_string());
    }
    if secret.chars().any(char::is_whitespace) {
        return Err("O Client Secret não tem espaços: confira se foi copiado inteiro e só ele.".to_string());
    }
    Ok(CredenciaisAnvisa { client_id: id, client_secret: secret.to_string() })
}

/// "12345678909" -> "123.***.***-09": o CPF nunca aparece inteiro na interface.
pub fn mascarar_client_id(client_id: &str) -> String {
    let digitos: Vec<char> = client_id.chars().collect();
    match digitos.len() {
        11 if client_id.chars().all(|c| c.is_ascii_digit()) => {
            format!("{}.***.***-{}", digitos[..3].iter().collect::<String>(), digitos[9..].iter().collect::<String>())
        }
        n if n > 4 => format!("{}…{}", digitos[..2].iter().collect::<String>(), digitos[n - 2..].iter().collect::<String>()),
        _ => "***".to_string(),
    }
}

/// Explica uma resposta de erro: recusa do Keycloak (JSON) ou página de bloqueio do firewall (HTML com Ray ID).
pub fn descrever_erro_http(status: u16, corpo: &str) -> (String, String) {
    if corpo.contains("Bloqueado") || corpo.contains("regra de segurança") {
        let ray = corpo
            .split("Ray ID")
            .nth(1)
            .and_then(|resto| resto.split(|c: char| !c.is_ascii_alphanumeric()).find(|t| t.len() >= 8))
            .map(|id| format!(" (Ray ID {id})"))
            .unwrap_or_default();
        return (
            "bloqueado_firewall".to_string(),
            format!("Requisição barrada pelo firewall da ANVISA{ray}. Informe o Ray ID à ANVISA para liberar o acesso da aplicação."),
        );
    }
    if let Ok(json) = serde_json::from_str::<serde_json::Value>(corpo) {
        // Erro HTTP comum do serviço ({"status":404,"error":"Not Found","path":...}): não é recusa de login
        let erro_de_servico = json.get("status").is_some() || json.get("path").is_some();
        if let Some(erro) = json.get("error").and_then(|e| e.as_str()).filter(|_| !erro_de_servico) {
            let mensagem = match erro {
                "invalid_client" | "unauthorized_client" => {
                    "Client ID ou Client Secret recusados pela ANVISA. Regenere o secret no portal e cole de novo.".to_string()
                }
                outro => format!(
                    "ANVISA recusou a autenticação: {outro} {}",
                    json.get("error_description").and_then(|d| d.as_str()).unwrap_or("")
                ),
            };
            return ("sem_permissao".to_string(), mensagem.trim().to_string());
        }
    }
    match status {
        401 => ("sem_permissao".to_string(), "Token não aceito por este serviço (401).".to_string()),
        404 => ("nao_publicado".to_string(), "Endereço não encontrado (404): serviço ou especificação não publicados pela ANVISA.".to_string()),
        403 => ("sem_permissao".to_string(), "Credencial sem permissão para este serviço (403).".to_string()),
        _ => ("erro".to_string(), format!("Resposta HTTP {status} da ANVISA.")),
    }
}

/// Operações de uma especificação OpenAPI ("GET /api/v1/...").
pub fn operacoes_openapi(especificacao: &serde_json::Value) -> Vec<String> {
    let mut operacoes = Vec::new();
    if let Some(caminhos) = especificacao.get("paths").and_then(|p| p.as_object()) {
        for (caminho, metodos) in caminhos {
            if let Some(metodos) = metodos.as_object() {
                for metodo in metodos.keys() {
                    operacoes.push(format!("{} {caminho}", metodo.to_uppercase()));
                }
            }
        }
    }
    operacoes.sort();
    operacoes
}

fn agente() -> ureq::Agent {
    ureq::AgentBuilder::new()
        .timeout_connect(Duration::from_secs(20))
        .timeout_read(Duration::from_secs(60))
        .user_agent(concat!("OpenClinical/", env!("CARGO_PKG_VERSION")))
        .build()
}

fn corpo_texto(resposta: ureq::Response) -> String {
    let mut texto = String::new();
    let _ = resposta.into_reader().take(2 * 1024 * 1024).read_to_string(&mut texto);
    texto
}

pub struct TokenAnvisa {
    pub access_token: String,
    pub expira_em_segundos: Option<u64>,
}

/// Pede o token de acesso ao Keycloak da ANVISA. Erro já vem explicado para a interface.
pub fn obter_token(credenciais: &CredenciaisAnvisa) -> Result<TokenAnvisa, String> {
    let resposta = agente().post(URL_TOKEN).send_form(&[
        ("grant_type", "client_credentials"),
        ("client_id", credenciais.client_id.as_str()),
        ("client_secret", credenciais.client_secret.as_str()),
    ]);
    match resposta {
        Ok(resposta) => {
            let json: serde_json::Value =
                serde_json::from_str(&corpo_texto(resposta)).map_err(|e| format!("Resposta de token ilegível: {e}"))?;
            let access_token = json
                .get("access_token")
                .and_then(|t| t.as_str())
                .ok_or("A ANVISA respondeu sem access_token.")?
                .to_string();
            Ok(TokenAnvisa { access_token, expira_em_segundos: json.get("expires_in").and_then(|e| e.as_u64()) })
        }
        Err(ureq::Error::Status(status, resposta)) => Err(descrever_erro_http(status, &corpo_texto(resposta)).1),
        Err(erro) => Err(format!("Sem conexão com o servidor de login da ANVISA: {erro}")),
    }
}

fn verificar_servico(token: &TokenAnvisa, nome: &str, base: &str) -> ServicoAnvisa {
    let mut ultimo = ("erro".to_string(), "Nenhum endereço de especificação respondeu.".to_string());
    for caminho in CAMINHOS_ESPECIFICACAO {
        let resposta = agente()
            .get(&format!("{URL_GATEWAY}{base}{caminho}"))
            .set("Authorization", &format!("Bearer {}", token.access_token))
            .set("Accept", "application/json")
            .call();
        match resposta {
            Ok(resposta) => match serde_json::from_str::<serde_json::Value>(&corpo_texto(resposta)) {
                Ok(especificacao) => {
                    let operacoes = operacoes_openapi(&especificacao);
                    return ServicoAnvisa {
                        nome: nome.to_string(),
                        situacao: "acessivel".to_string(),
                        detalhe: format!("{} operações publicadas ({base}{caminho}).", operacoes.len()),
                        operacoes,
                    };
                }
                Err(_) => ultimo = ("erro".to_string(), format!("Especificação ilegível em {base}{caminho}.")),
            },
            Err(ureq::Error::Status(status, resposta)) => {
                ultimo = descrever_erro_http(status, &corpo_texto(resposta));
                // Só vale tentar o próximo endereço quando este não existe
                if status != 404 {
                    break;
                }
            }
            Err(erro) => {
                ultimo = ("erro".to_string(), format!("Sem conexão: {erro}"));
                break;
            }
        }
    }
    ServicoAnvisa { nome: nome.to_string(), situacao: ultimo.0, detalhe: ultimo.1, operacoes: Vec::new() }
}

/// Teste de conexão: obtém o token e confere quais serviços aceitam a credencial (sem chamar o SNCR).
pub fn testar_conexao(credenciais: &CredenciaisAnvisa) -> ResultadoTesteAnvisa {
    match obter_token(credenciais) {
        Ok(token) => ResultadoTesteAnvisa {
            autenticado: true,
            mensagem: "Credencial aceita pela ANVISA.".to_string(),
            token_expira_em_segundos: token.expira_em_segundos,
            servicos: SERVICOS_VERIFICADOS
                .iter()
                .map(|(nome, base)| verificar_servico(&token, nome, base))
                .collect(),
        },
        Err(mensagem) => ResultadoTesteAnvisa {
            autenticado: false,
            mensagem,
            token_expira_em_segundos: None,
            servicos: Vec::new(),
        },
    }
}
