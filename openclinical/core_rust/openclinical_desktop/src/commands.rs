use clinical_engine::calculators::{
    avaliar_curb65_detalhado, avaliar_estagio_drc, calcular_clearance_cockcroft_gault,
    calcular_escore_wells_tep, calcular_tfg_ckd_epi_2021, calcular_vazao_infusao,
};
use clinical_engine::database::BancoDadosClinico;
use clinical_engine::models::{
    DetalheMedicamentoCompleto, ItemBuscaFts, MatrizInteracao, MedicamentoComercialCmed,
    ProtocoloClinico,
};
use clinical_engine::pediatric::calcular_dose_pediatrica;
use clinical_engine::pharmacy_pricing::{analisar_preco_medicamento as analisar_preco, AnalisePrecoMedicamento};
use clinical_engine::protocols::analisar_protocolo_markdown;
use clinical_engine::api_anvisa::{
    mascarar_client_id, normalizar_credenciais, testar_conexao, CredenciaisAnvisa, ResultadoTesteAnvisa,
    URL_GERENCIAR_CREDENCIAIS,
};
use clinical_engine::bulas_importadas::{self, BulaImportada, BulaImportadaResumo};
use clinical_engine::pcdt_conitec::{PcdtDetalhe, PcdtResumo};
use clinical_engine::atualizador::{
    atualizar_bases, precisa_atualizar, BulaAnvisaIndice, EstadoFonte, ResultadoAtualizacao,
    INTERVALO_ATUALIZACAO_HORAS,
};
use serde_json::{json, Value};
use std::fs;
use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Mutex;
use std::time::Duration;
use tauri::{AppHandle, Emitter};

pub struct EstadoAplicacao {
    pub caminho_banco: Mutex<Option<String>>,
}

/// Procura o banco em `OPENCLINICAL_DB_PATH`, no diretório de recursos do app empacotado
/// e, por fim, nos caminhos relativos usados durante o desenvolvimento.
pub fn resolver_caminho_banco(diretorio_recursos: Option<PathBuf>) -> Option<String> {
    if let Ok(caminho_env) = std::env::var("OPENCLINICAL_DB_PATH") {
        if Path::new(&caminho_env).exists() {
            return Some(caminho_env);
        }
    }

    if let Some(diretorio) = diretorio_recursos {
        let caminho_recurso = diretorio.join("openclinical_core.sqlite");
        if caminho_recurso.exists() {
            return Some(caminho_recurso.to_string_lossy().into_owned());
        }
    }

    let caminhos_candidatos = [
        "openclinical_core.sqlite",
        "openclinical/core_rust/openclinical_desktop/openclinical_core.sqlite",
        "openclinical/etl_pipeline/openclinical_core.sqlite",
        "../etl_pipeline/openclinical_core.sqlite",
        "../../etl_pipeline/openclinical_core.sqlite",
    ];

    caminhos_candidatos
        .iter()
        .find(|candidato| Path::new(candidato).exists())
        .map(|candidato| candidato.to_string())
}

/// O banco empacotado fica numa pasta somente leitura (Arquivos de Programas): o atualizador diário
/// trabalha numa cópia na pasta de dados do app, refeita quando a versão do app muda.
pub fn preparar_banco_gravavel(caminho: String, diretorio_recursos: Option<&Path>, diretorio_dados: Option<PathBuf>) -> String {
    let empacotado = diretorio_recursos.is_some_and(|recursos| Path::new(&caminho).starts_with(recursos));
    let (true, Some(dados)) = (empacotado, diretorio_dados) else {
        return caminho; // desenvolvimento ou OPENCLINICAL_DB_PATH: usa o arquivo direto
    };
    let copia = dados.join("openclinical_core.sqlite");
    let marcador = dados.join("versao_banco.txt");
    let versao = env!("CARGO_PKG_VERSION");
    let atual = copia.exists() && fs::read_to_string(&marcador).is_ok_and(|v| v.trim() == versao);
    if !atual {
        let copiado = fs::create_dir_all(&dados)
            .and_then(|_| fs::copy(&caminho, &copia))
            .and_then(|_| fs::write(&marcador, versao));
        if let Err(erro) = copiado {
            eprintln!("Não foi possível copiar o banco para {}: {erro}; atualização automática desativada.", dados.display());
            return caminho;
        }
    }
    copia.to_string_lossy().into_owned()
}

static ATUALIZANDO: AtomicBool = AtomicBool::new(false);

/// Roda o atualizador se nenhum outro estiver rodando; avisa a interface pelo evento `bases-atualizadas`.
fn executar_atualizacao(app: &AppHandle, caminho: &str, forcar: bool) -> Result<Vec<ResultadoAtualizacao>, String> {
    if ATUALIZANDO.swap(true, Ordering::SeqCst) {
        return Err("Uma atualização das bases já está em andamento.".to_string());
    }
    let resultado = atualizar_bases(caminho, forcar).map_err(|e| e.to_string());
    ATUALIZANDO.store(false, Ordering::SeqCst);
    if let Ok(resultados) = &resultado {
        let _ = app.emit("bases-atualizadas", resultados);
    }
    resultado
}

/// Verifica a cada hora se passou um dia desde a última consulta às fontes da ANVISA e, se passou, atualiza.
pub fn iniciar_atualizador_diario(app: AppHandle, caminho: String) {
    std::thread::spawn(move || {
        // Deixa a interface abrir antes do primeiro download
        std::thread::sleep(Duration::from_secs(30));
        loop {
            if precisa_atualizar(&caminho, INTERVALO_ATUALIZACAO_HORAS) {
                match executar_atualizacao(&app, &caminho, false) {
                    Ok(resultados) => {
                        for r in resultados {
                            println!("[atualizador] {}: {} - {}", r.fonte, r.situacao, r.mensagem);
                        }
                    }
                    Err(erro) => eprintln!("[atualizador] {erro}"),
                }
            }
            std::thread::sleep(Duration::from_secs(60 * 60));
        }
    });
}

fn caminho_banco(estado: &EstadoAplicacao) -> Result<String, String> {
    estado
        .caminho_banco
        .lock()
        .map_err(|e| format!("Erro ao obter trava do estado do banco: {e}"))?
        .clone()
        .ok_or_else(|| "Banco de dados clínico (openclinical_core.sqlite) não encontrado.".to_string())
}

#[tauri::command]
pub fn estado_atualizacao_bases(estado: tauri::State<'_, EstadoAplicacao>) -> Result<Vec<EstadoFonte>, String> {
    Ok(obter_conexao_banco(&estado)?.estado_atualizacao())
}

#[tauri::command]
pub async fn atualizar_bases_agora(app: AppHandle, estado: tauri::State<'_, EstadoAplicacao>) -> Result<Vec<ResultadoAtualizacao>, String> {
    let caminho = caminho_banco(&estado)?;
    tauri::async_runtime::spawn_blocking(move || executar_atualizacao(&app, &caminho, false))
        .await
        .map_err(|e| format!("Falha na tarefa de atualização: {e}"))?
}

#[tauri::command]
pub fn consultar_bula_anvisa(
    numero_registro: String,
    estado: tauri::State<'_, EstadoAplicacao>,
) -> Result<Option<BulaAnvisaIndice>, String> {
    obter_conexao_banco(&estado)?.consultar_bula_anvisa(&numero_registro).map_err(|e| e.to_string())
}

fn obter_conexao_banco(estado: &EstadoAplicacao) -> Result<BancoDadosClinico, String> {
    let caminho = estado
        .caminho_banco
        .lock()
        .map_err(|e| format!("Erro ao obter trava do estado do banco: {e}"))?
        .clone()
        .ok_or("Banco de dados clínico (openclinical_core.sqlite) não encontrado. Defina OPENCLINICAL_DB_PATH ou reinstale o aplicativo.")?;

    BancoDadosClinico::abrir_somente_leitura(&caminho).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn buscar_geral(
    termo: String,
    estado: tauri::State<'_, EstadoAplicacao>,
) -> Result<Vec<ItemBuscaFts>, String> {
    let banco = obter_conexao_banco(&estado)?;
    banco.buscar_geral(&termo, 50).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn obter_detalhe_medicamento(
    id_medicamento: i64,
    estado: tauri::State<'_, EstadoAplicacao>,
) -> Result<DetalheMedicamentoCompleto, String> {
    let banco = obter_conexao_banco(&estado)?;
    banco
        .obter_detalhe_medicamento(id_medicamento)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn obter_registro_cmed(
    id_cmed: i64,
    estado: tauri::State<'_, EstadoAplicacao>,
) -> Result<MedicamentoComercialCmed, String> {
    let banco = obter_conexao_banco(&estado)?;
    banco.obter_registro_cmed(id_cmed).map_err(|e| e.to_string())
}

/// PMC oficial, situação no Farmácia Popular e links de busca de preço de uma apresentação da CMED.
/// A apresentação é escolhida pelo usuário na lista da busca (`buscar_geral`, registros `cmed_comercial`).
#[tauri::command]
pub fn analisar_preco_medicamento(
    id_cmed: i64,
    estado: tauri::State<'_, EstadoAplicacao>,
) -> Result<AnalisePrecoMedicamento, String> {
    let banco = obter_conexao_banco(&estado)?;
    let med = banco.obter_registro_cmed(id_cmed).map_err(|e| e.to_string())?;
    Ok(analisar_preco(
        &med.nome_produto,
        &med.substancia,
        &med.tipo_produto,
        &med.apresentacao,
        &med.codigo_ean,
        med.preco_maximo_consumidor,
    ))
}

#[tauri::command]
pub fn verificar_interacoes(
    ids_principios_ativos: Vec<i64>,
    estado: tauri::State<'_, EstadoAplicacao>,
) -> Result<Vec<MatrizInteracao>, String> {
    let banco = obter_conexao_banco(&estado)?;
    banco
        .verificar_interacoes(&ids_principios_ativos)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn listar_protocolos_clinicos() -> Result<Vec<ProtocoloClinico>, String> {
    let caminhos_diretorios = [
        "clinical_content/protocolos",
        "openclinical/clinical_content/protocolos",
        "../../clinical_content/protocolos",
        "../../../clinical_content/protocolos",
    ];

    let mut dir_encontrado: Option<PathBuf> = None;
    for d in caminhos_diretorios {
        let p = Path::new(d);
        if p.exists() && p.is_dir() {
            dir_encontrado = Some(p.to_path_buf());
            break;
        }
    }

    let dir = match dir_encontrado {
        Some(d) => d,
        None => return Ok(Vec::new()),
    };

    let mut protocolos = Vec::new();
    let entradas = fs::read_dir(dir).map_err(|e| format!("Falha ao ler diretório de protocolos: {e}"))?;

    for entrada in entradas.flatten() {
        let caminho = entrada.path();
        // "_MODELO.md" e outros arquivos com "_" na frente são modelos, não receitas
        let modelo = caminho.file_name().and_then(|n| n.to_str()).is_some_and(|n| n.starts_with('_'));
        if !modelo && caminho.extension().and_then(|ext| ext.to_str()) == Some("md") {
            if let Ok(conteudo) = fs::read_to_string(&caminho) {
                if let Ok(protocolo) = analisar_protocolo_markdown(&conteudo) {
                    protocolos.push(protocolo);
                }
            }
        }
    }

    Ok(protocolos)
}

#[tauri::command]
pub fn executar_calculo_clinico(
    tipo: String,
    parametros: Value,
) -> Result<Value, String> {
    match tipo.as_str() {
        "ckd_epi_2021" => {
            let creatinina = parametros["creatinina"]
                .as_f64()
                .ok_or("Parâmetro 'creatinina' (f64) ausente ou inválido")?;
            let idade = parametros["idade"]
                .as_u64()
                .ok_or("Parâmetro 'idade' (u32) ausente ou inválido")? as u32;
            let sexo_feminino = parametros["sexo_feminino"]
                .as_bool()
                .ok_or("Parâmetro 'sexo_feminino' (bool) ausente ou inválido")?;

            let tfg = calcular_tfg_ckd_epi_2021(creatinina, idade, sexo_feminino)
                .map_err(|e| e.to_string())?;
            let resultado = avaliar_estagio_drc(tfg);

            serde_json::to_value(&resultado).map_err(|e| e.to_string())
        }

        "cockcroft_gault" => {
            let creatinina = parametros["creatinina"]
                .as_f64()
                .ok_or("Parâmetro 'creatinina' (f64) ausente ou inválido")?;
            let peso_kg = parametros["peso_kg"]
                .as_f64()
                .ok_or("Parâmetro 'peso_kg' (f64) ausente ou inválido")?;
            let idade = parametros["idade"]
                .as_u64()
                .ok_or("Parâmetro 'idade' (u32) ausente ou inválido")? as u32;
            let sexo_feminino = parametros["sexo_feminino"]
                .as_bool()
                .ok_or("Parâmetro 'sexo_feminino' (bool) ausente ou inválido")?;

            let crcl = calcular_clearance_cockcroft_gault(creatinina, peso_kg, idade, sexo_feminino)
                .map_err(|e| e.to_string())?;

            Ok(json!({
                "clearance_creatinina_ml_min": crcl,
                "metodo": "Cockcroft-Gault (1976)"
            }))
        }

        "curb65" => {
            let confusao = parametros["confusao"].as_bool().unwrap_or(false);
            let ureia_maior_50 = parametros["ureia_maior_50"].as_bool().unwrap_or(false);
            let fr_maior_30 = parametros["fr_maior_30"].as_bool().unwrap_or(false);
            let hipotensao = parametros["hipotensao"].as_bool().unwrap_or(false);
            let idade_maior_65 = parametros["idade_maior_65"].as_bool().unwrap_or(false);

            let resultado = avaliar_curb65_detalhado(
                confusao,
                ureia_maior_50,
                fr_maior_30,
                hipotensao,
                idade_maior_65,
            );

            serde_json::to_value(&resultado).map_err(|e| e.to_string())
        }

        "wells_tep" => {
            let sinais_clinicos_tvp = parametros["sinais_clinicos_tvp"].as_bool().unwrap_or(false);
            let diagnostico_alternativo_menos_provavel = parametros["diagnostico_alternativo_menos_provavel"].as_bool().unwrap_or(false);
            let fc_maior_100 = parametros["fc_maior_100"].as_bool().unwrap_or(false);
            let imobilizacao_ou_cirurgia_recente = parametros["imobilizacao_ou_cirurgia_recente"].as_bool().unwrap_or(false);
            let historico_previo_tep_tvp = parametros["historico_previo_tep_tvp"].as_bool().unwrap_or(false);
            let hemoptise = parametros["hemoptise"].as_bool().unwrap_or(false);
            let malignidade_ativa = parametros["malignidade_ativa"].as_bool().unwrap_or(false);

            let resultado = calcular_escore_wells_tep(
                sinais_clinicos_tvp,
                diagnostico_alternativo_menos_provavel,
                fc_maior_100,
                imobilizacao_ou_cirurgia_recente,
                historico_previo_tep_tvp,
                hemoptise,
                malignidade_ativa,
            );

            serde_json::to_value(&resultado).map_err(|e| e.to_string())
        }

        "vazao_infusao" => {
            let dose_mcg_kg_min = parametros["dose_mcg_kg_min"]
                .as_f64()
                .ok_or("Parâmetro 'dose_mcg_kg_min' ausente ou inválido")?;
            let peso_kg = parametros["peso_kg"]
                .as_f64()
                .ok_or("Parâmetro 'peso_kg' ausente ou inválido")?;
            let concentracao_mg_ml = parametros["concentracao_mg_ml"]
                .as_f64()
                .ok_or("Parâmetro 'concentracao_mg_ml' ausente ou inválido")?;

            let vazao = calcular_vazao_infusao(dose_mcg_kg_min, peso_kg, concentracao_mg_ml)
                .map_err(|e| e.to_string())?;

            Ok(json!({
                "vazao_ml_h": vazao,
                "unidade": "mL/h",
                "dose_mcg_kg_min": dose_mcg_kg_min,
                "peso_kg": peso_kg,
                "concentracao_mg_ml": concentracao_mg_ml
            }))
        }

        "dose_pediatrica" => {
            let peso_kg = parametros["peso_kg"]
                .as_f64()
                .ok_or("Parâmetro 'peso_kg' ausente ou inválido")?;
            let dose_alvo_mg_kg_dia = parametros["dose_alvo_mg_kg_dia"]
                .as_f64()
                .ok_or("Parâmetro 'dose_alvo_mg_kg_dia' ausente ou inválido")?;
            // Ausente/null = forma sólida (resultado só em mg)
            let concentracao_mg_ml = match &parametros["concentracao_mg_ml"] {
                Value::Null => None,
                valor => Some(valor.as_f64().ok_or("Parâmetro 'concentracao_mg_ml' inválido")?),
            };
            let fracionamento_diario = parametros["fracionamento_diario"]
                .as_u64()
                .ok_or("Parâmetro 'fracionamento_diario' ausente ou inválido")? as u8;
            let dose_maxima_diaria_mg = parametros["dose_maxima_diaria_mg"].as_f64();

            let resultado = calcular_dose_pediatrica(
                peso_kg,
                dose_alvo_mg_kg_dia,
                concentracao_mg_ml,
                fracionamento_diario,
                dose_maxima_diaria_mg,
            )
            .map_err(|e| e.to_string())?;

            serde_json::to_value(&resultado).map_err(|e| e.to_string())
        }

        _ => Err(format!("Tipo de cálculo clínico desconhecido: '{tipo}'")),
    }
}

// -----------------------------------------------------------------------------
// Portal de APIs da ANVISA: credenciais no cofre do sistema operacional
// -----------------------------------------------------------------------------

const SERVICO_COFRE: &str = "org.openclinical.app.api-anvisa";

#[derive(serde::Serialize)]
pub struct EstadoCredenciaisAnvisa {
    pub configurado: bool,
    /// CPF mascarado ("123.***.***-09"); o secret nunca volta para a interface
    pub client_id_mascarado: Option<String>,
    pub url_gerenciar_credenciais: &'static str,
}

fn entrada_cofre(nome: &str) -> Result<keyring::Entry, String> {
    keyring::Entry::new(SERVICO_COFRE, nome).map_err(|e| format!("Cofre de credenciais indisponível: {e}"))
}

fn ler_cofre(nome: &str) -> Result<Option<String>, String> {
    match entrada_cofre(nome)?.get_password() {
        Ok(valor) => Ok(Some(valor)),
        Err(keyring::Error::NoEntry) => Ok(None),
        Err(e) => Err(format!("Falha ao ler o cofre de credenciais: {e}")),
    }
}

fn credenciais_salvas() -> Result<Option<CredenciaisAnvisa>, String> {
    match (ler_cofre("client_id")?, ler_cofre("client_secret")?) {
        (Some(client_id), Some(client_secret)) => Ok(Some(CredenciaisAnvisa { client_id, client_secret })),
        _ => Ok(None),
    }
}

#[tauri::command]
pub fn estado_credenciais_anvisa() -> Result<EstadoCredenciaisAnvisa, String> {
    let salvas = credenciais_salvas()?;
    Ok(EstadoCredenciaisAnvisa {
        configurado: salvas.is_some(),
        client_id_mascarado: salvas.map(|c| mascarar_client_id(&c.client_id)),
        url_gerenciar_credenciais: URL_GERENCIAR_CREDENCIAIS,
    })
}

#[tauri::command]
pub fn salvar_credenciais_anvisa(client_id: String, client_secret: String) -> Result<EstadoCredenciaisAnvisa, String> {
    let credenciais = normalizar_credenciais(&client_id, &client_secret)?;
    entrada_cofre("client_id")?
        .set_password(&credenciais.client_id)
        .map_err(|e| format!("Não foi possível gravar no cofre de credenciais: {e}"))?;
    entrada_cofre("client_secret")?
        .set_password(&credenciais.client_secret)
        .map_err(|e| format!("Não foi possível gravar no cofre de credenciais: {e}"))?;
    estado_credenciais_anvisa()
}

#[tauri::command]
pub fn remover_credenciais_anvisa() -> Result<EstadoCredenciaisAnvisa, String> {
    for nome in ["client_id", "client_secret"] {
        match entrada_cofre(nome)?.delete_credential() {
            Ok(()) | Err(keyring::Error::NoEntry) => {}
            Err(e) => return Err(format!("Não foi possível remover do cofre: {e}")),
        }
    }
    estado_credenciais_anvisa()
}

#[tauri::command]
pub async fn testar_api_anvisa() -> Result<ResultadoTesteAnvisa, String> {
    let credenciais = credenciais_salvas()?.ok_or("Cadastre o Client ID e o Client Secret antes de testar.")?;
    tauri::async_runtime::spawn_blocking(move || testar_conexao(&credenciais))
        .await
        .map_err(|e| format!("Falha na tarefa de teste: {e}"))
}

// -----------------------------------------------------------------------------
// Bulas em PDF importadas (texto separado em seções pela interface; gravadas na cópia gravável do banco)
// -----------------------------------------------------------------------------

#[tauri::command]
pub fn salvar_bula_importada(
    bula: BulaImportada,
    estado: tauri::State<'_, EstadoAplicacao>,
) -> Result<BulaImportadaResumo, String> {
    bulas_importadas::salvar_no_banco(&caminho_banco(&estado)?, &bula).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn obter_bulas_importadas(
    numero_registro: String,
    estado: tauri::State<'_, EstadoAplicacao>,
) -> Result<Vec<BulaImportada>, String> {
    obter_conexao_banco(&estado)?.obter_bulas_importadas(&numero_registro).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn listar_bulas_importadas(estado: tauri::State<'_, EstadoAplicacao>) -> Result<Vec<BulaImportadaResumo>, String> {
    obter_conexao_banco(&estado)?.listar_bulas_importadas().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn remover_bula_importada(
    registro: String,
    tipo: String,
    estado: tauri::State<'_, EstadoAplicacao>,
) -> Result<bool, String> {
    bulas_importadas::remover_do_banco(&caminho_banco(&estado)?, &registro, &tipo).map_err(|e| e.to_string())
}

// -----------------------------------------------------------------------------
// PCDT da CONITEC (conteúdo extraído dos PDFs oficiais pelo ETL; lista atualizada pelo atualizador diário)
// -----------------------------------------------------------------------------

#[tauri::command]
pub fn listar_pcdt_conitec(estado: tauri::State<'_, EstadoAplicacao>) -> Result<Vec<PcdtResumo>, String> {
    obter_conexao_banco(&estado)?.listar_pcdt_conitec().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn obter_pcdt_conitec(id_pcdt: i64, estado: tauri::State<'_, EstadoAplicacao>) -> Result<Option<PcdtDetalhe>, String> {
    obter_conexao_banco(&estado)?.obter_pcdt_conitec(id_pcdt).map_err(|e| e.to_string())
}

// -----------------------------------------------------------------------------
// Apresentações comerciais de um fármaco (a interface escolhe as substâncias pela chave do princípio ativo)
// -----------------------------------------------------------------------------

#[tauri::command]
pub fn listar_substancias_cmed(estado: tauri::State<'_, EstadoAplicacao>) -> Result<Vec<String>, String> {
    obter_conexao_banco(&estado)?.listar_substancias_cmed().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn apresentacoes_cmed_por_substancias(
    substancias: Vec<String>,
    estado: tauri::State<'_, EstadoAplicacao>,
) -> Result<Vec<MedicamentoComercialCmed>, String> {
    obter_conexao_banco(&estado)?
        .apresentacoes_cmed_por_substancias(&substancias)
        .map_err(|e| e.to_string())
}
