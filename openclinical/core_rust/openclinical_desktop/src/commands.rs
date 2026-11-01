use clinical_engine::calculators::{
    avaliar_curb65_detalhado, avaliar_estagio_drc, calcular_clearance_cockcroft_gault,
    calcular_dose_reversa_infusao, calcular_escore_cha2ds2_va, calcular_escore_qsofa,
    calcular_escore_wells_tep, calcular_tfg_ckd_epi_2021, calcular_vazao_infusao,
};
use clinical_engine::acid_base::{calcular_correcao_sodio, interpretar_gasometria};
use clinical_engine::cardio_neuro_scores::{
    calcular_cranio_cervical, calcular_criterios_perc, calcular_escore_padua, calcular_glasgow_p,
    calcular_has_bled, calcular_heart_score, calcular_qtc_corrigido, calcular_trombolise_avc,
    calcular_wells_tvp,
};
use clinical_engine::fluid_electrolytes::{
    calcular_fena_feureia, calcular_manejo_dengue_ms, calcular_metabolico_cad_calemia,
    calcular_pam_ppc, calcular_parkland_queimado,
};
use clinical_engine::gastro_hepato_aps::{
    calcular_alvarado, calcular_antropometria_farmacologica, calcular_bisap, calcular_child_pugh,
    calcular_centor_mcisaac, calcular_equivalencia_corticoide, calcular_fib4,
    calcular_glasgow_blatchford, calcular_idade_gestacional_dpp, calcular_meld_na,
    calcular_sofa_completo,
};
use clinical_engine::emergency::{calcular_emergencia_pediatrica, calcular_intubacao_sri};
use clinical_engine::medication_safety_5g::{
    avaliar_seguranca_medicamentosa_5g as avaliar_seg_5g, RelatorioSeguranca5g,
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

                "dose_reversa_infusao" => {
            let vazao_ml_h = parametros["vazao_ml_h"]
                .as_f64()
                .ok_or("Parâmetro 'vazao_ml_h' ausente ou inválido")?;
            let peso_kg = parametros["peso_kg"]
                .as_f64()
                .ok_or("Parâmetro 'peso_kg' ausente ou inválido")?;
            let concentracao_mg_ml = parametros["concentracao_mg_ml"]
                .as_f64()
                .ok_or("Parâmetro 'concentracao_mg_ml' ausente ou inválido")?;

            let dose = calcular_dose_reversa_infusao(vazao_ml_h, peso_kg, concentracao_mg_ml)
                .map_err(|e| e.to_string())?;

            Ok(json!({
                "dose_mcg_kg_min": dose,
                "unidade": "mcg/kg/min",
                "vazao_ml_h": vazao_ml_h,
                "peso_kg": peso_kg,
                "concentracao_mg_ml": concentracao_mg_ml
            }))
        }

        "cha2ds2_va" => {
            let ic = parametros["insuficiencia_cardiaca"].as_bool().unwrap_or(false);
            let has = parametros["hipertensao"].as_bool().unwrap_or(false);
            let idade = parametros["idade"].as_u64().unwrap_or(0) as u32;
            let dm = parametros["diabetes"].as_bool().unwrap_or(false);
            let avc = parametros["avc_ou_ait_previo"].as_bool().unwrap_or(false);
            let vasc = parametros["doenca_vascular"].as_bool().unwrap_or(false);

            let resultado = calcular_escore_cha2ds2_va(ic, has, idade, dm, avc, vasc);
            serde_json::to_value(&resultado).map_err(|e| e.to_string())
        }

        "qsofa" => {
            let fr = parametros["fr_maior_22"].as_bool().unwrap_or(false);
            let pas = parametros["pas_menor_100"].as_bool().unwrap_or(false);
            let mental = parametros["alteracao_mental"].as_bool().unwrap_or(false);

            let resultado = calcular_escore_qsofa(fr, pas, mental);
            serde_json::to_value(&resultado).map_err(|e| e.to_string())
        }

        "intubacao_sri" => {
            let peso_kg = parametros["peso_kg"]
                .as_f64()
                .ok_or("Parâmetro 'peso_kg' ausente ou inválido")?;
            let altura_cm = parametros["altura_cm"]
                .as_f64()
                .ok_or("Parâmetro 'altura_cm' ausente ou inválido")?;
            let sexo_feminino = parametros["sexo_feminino"].as_bool().unwrap_or(false);
            let perfil = parametros["perfil"].as_str().unwrap_or("padrao");

            let resultado = calcular_intubacao_sri(peso_kg, altura_cm, sexo_feminino, perfil)
                .map_err(|e| e.to_string())?;
            serde_json::to_value(&resultado).map_err(|e| e.to_string())
        }

        "emergencia_pediatrica" => {
            let peso_kg = parametros["peso_kg"]
                .as_f64()
                .ok_or("Parâmetro 'peso_kg' ausente ou inválido")?;
            let idade_anos = parametros["idade_anos"]
                .as_f64()
                .ok_or("Parâmetro 'idade_anos' ausente ou inválido")?;

            let resultado = calcular_emergencia_pediatrica(peso_kg, idade_anos)
                .map_err(|e| e.to_string())?;
            serde_json::to_value(&resultado).map_err(|e| e.to_string())
        }

        "gasometria" => {
            let ph = parametros["ph"]
                .as_f64()
                .ok_or("Parâmetro 'ph' ausente ou inválido")?;
            let paco2 = parametros["paco2"]
                .as_f64()
                .ok_or("Parâmetro 'paco2' ausente ou inválido")?;
            let hco3 = parametros["hco3"]
                .as_f64()
                .ok_or("Parâmetro 'hco3' ausente ou inválido")?;
            let sodio = parametros["sodio"]
                .as_f64()
                .ok_or("Parâmetro 'sodio' ausente ou inválido")?;
            let cloro = parametros["cloro"]
                .as_f64()
                .ok_or("Parâmetro 'cloro' ausente ou inválido")?;
            let albumina = parametros["albumina"]
                .as_f64()
                .ok_or("Parâmetro 'albumina' ausente ou inválido")?;
            let pao2 = parametros["pao2"]
                .as_f64()
                .ok_or("Parâmetro 'pao2' ausente ou inválido")?;
            let fio2_fracao = parametros["fio2_fracao"]
                .as_f64()
                .ok_or("Parâmetro 'fio2_fracao' ausente ou inválido")?;

            let resultado = interpretar_gasometria(ph, paco2, hco3, sodio, cloro, albumina, pao2, fio2_fracao)
                .map_err(|e| e.to_string())?;
            serde_json::to_value(&resultado).map_err(|e| e.to_string())
        }

        "correcao_sodio" => {
            let sodio_atual = parametros["sodio_atual"]
                .as_f64()
                .ok_or("Parâmetro 'sodio_atual' ausente ou inválido")?;
            let peso_kg = parametros["peso_kg"]
                .as_f64()
                .ok_or("Parâmetro 'peso_kg' ausente ou inválido")?;
            let sexo_feminino = parametros["sexo_feminino"].as_bool().unwrap_or(false);
            let idoso = parametros["idoso"].as_bool().unwrap_or(false);
            let solucao_meq_l = parametros["solucao_meq_l"]
                .as_f64()
                .ok_or("Parâmetro 'solucao_meq_l' ausente ou inválido")?;

            let resultado = calcular_correcao_sodio(sodio_atual, peso_kg, sexo_feminino, idoso, solucao_meq_l)
                .map_err(|e| e.to_string())?;
            serde_json::to_value(&resultado).map_err(|e| e.to_string())
        }

                        "dengue_ms" => {
            let peso_kg = parametros["peso_kg"].as_f64().ok_or("Parâmetro 'peso_kg' ausente ou inválido")?;
            let sinais_alarme = parametros["sinais_alarme"].as_bool().unwrap_or(false);
            let sinais_choque = parametros["sinais_choque_ou_sangramento_grave"].as_bool().unwrap_or(false);
            let condicao_especial = parametros["condicao_especial_ou_plaquetopenia"].as_bool().unwrap_or(false);
            let idade_anos = parametros["idade_anos"].as_f64();

            let resultado = calcular_manejo_dengue_ms(peso_kg, sinais_alarme, sinais_choque, condicao_especial, idade_anos)
                .map_err(|e| e.to_string())?;
            serde_json::to_value(&resultado).map_err(|e| e.to_string())
        }

        "parkland" => {
            let peso_kg = parametros["peso_kg"].as_f64().ok_or("Parâmetro 'peso_kg' ausente ou inválido")?;
            let percentual_scq = parametros["percentual_scq"].as_f64().ok_or("Parâmetro 'percentual_scq' ausente ou inválido")?;
            let horas = parametros["horas_desde_queimadura"].as_f64().unwrap_or(0.0);

            let resultado = calcular_parkland_queimado(peso_kg, percentual_scq, horas)
                .map_err(|e| e.to_string())?;
            serde_json::to_value(&resultado).map_err(|e| e.to_string())
        }

        "metabolico_cad" => {
            let sodio = parametros["sodio_medido"].as_f64().ok_or("Parâmetro 'sodio_medido' ausente ou inválido")?;
            let glicemia = parametros["glicemia_mg_dl"].as_f64().ok_or("Parâmetro 'glicemia_mg_dl' ausente ou inválido")?;
            let potassio = parametros["potassio_medido"].as_f64().ok_or("Parâmetro 'potassio_medido' ausente ou inválido")?;
            let calcio = parametros["calcio_total"].as_f64().unwrap_or(9.0);
            let albumina = parametros["albumina_g_dl"].as_f64().unwrap_or(4.0);

            let resultado = calcular_metabolico_cad_calemia(sodio, glicemia, potassio, calcio, albumina)
                .map_err(|e| e.to_string())?;
            serde_json::to_value(&resultado).map_err(|e| e.to_string())
        }

        "fena_feureia" => {
            let na_s = parametros["na_serico"].as_f64().unwrap_or_else(|| parametros["na_plasmatico"].as_f64().unwrap_or(140.0));
            let cr_s = parametros["cr_serica"].as_f64().unwrap_or_else(|| parametros["cr_plasmatica"].as_f64().unwrap_or(1.0));
            let ur_s = parametros["ureia_serica"].as_f64().unwrap_or_else(|| parametros["ureia_plasmatica"].as_f64().unwrap_or(40.0));
            let na_u = parametros["na_urinario"].as_f64().unwrap_or(20.0);
            let cr_u = parametros["cr_urinaria"].as_f64().unwrap_or(50.0);
            let ur_u = parametros["ureia_urinaria"].as_f64();
            let usa_diuretico = parametros["usa_diuretico"].as_bool().unwrap_or(false);

            let resultado = calcular_fena_feureia(na_s, cr_s, ur_s, na_u, cr_u, ur_u, usa_diuretico)
                .map_err(|e| e.to_string())?;
            serde_json::to_value(&resultado).map_err(|e| e.to_string())
        }

        "pam_ppc" => {
            let pas = parametros["pas_mmhg"].as_f64().ok_or("Parâmetro 'pas_mmhg' ausente ou inválido")?;
            let pad = parametros["pad_mmhg"].as_f64().ok_or("Parâmetro 'pad_mmhg' ausente ou inválido")?;
            let pic = parametros["pic_mmhg"].as_f64();

            let resultado = calcular_pam_ppc(pas, pad, pic)
                .map_err(|e| e.to_string())?;
            serde_json::to_value(&resultado).map_err(|e| e.to_string())
        }

        "heart_score" => {
            let historia = parametros["historia"].as_u64().ok_or("Parâmetro 'historia' ausente ou inválido")? as u8;
            let ecg = parametros["ecg"].as_u64().ok_or("Parâmetro 'ecg' ausente ou inválido")? as u8;
            let idade = parametros["idade"].as_u64().ok_or("Parâmetro 'idade' ausente ou inválido")? as u8;
            let fatores = parametros["fatores_risco"].as_u64().ok_or("Parâmetro 'fatores_risco' ausente ou inválido")? as u8;
            let troponina = parametros["troponina"].as_u64().ok_or("Parâmetro 'troponina' ausente ou inválido")? as u8;

            let resultado = calcular_heart_score(historia, ecg, idade, fatores, troponina)
                .map_err(|e| e.to_string())?;
            serde_json::to_value(&resultado).map_err(|e| e.to_string())
        }

        "has_bled" => {
            let has = parametros["hipertensao_nao_controlada"].as_bool().unwrap_or(false);
            let renal = parametros["funcao_renal_anormal"].as_bool().unwrap_or(false);
            let hep = parametros["funcao_hepatica_anormal"].as_bool().unwrap_or(false);
            let avc = parametros["avc_previo"].as_bool().unwrap_or(false);
            let sangramento = parametros["sangramento_previo"].as_bool().unwrap_or(false);
            let inr = parametros["inr_labil"].as_bool().unwrap_or(false);
            let idoso = parametros["idade_maior_65"].as_bool().unwrap_or(false);
            let drogas_aine = parametros["drogas_ou_aine"].as_bool().unwrap_or_else(|| parametros["uso_antiplaquetarios_ou_aine"].as_bool().unwrap_or(false));
            let alcool = parametros["alcool"].as_bool().unwrap_or_else(|| parametros["uso_drogas_ou_alcool"].as_bool().unwrap_or(false));

            let resultado = calcular_has_bled(has, renal, hep, avc, sangramento, inr, idoso, drogas_aine, alcool);
            serde_json::to_value(&resultado).map_err(|e| e.to_string())
        }

        "qtc_corrigido" => {
            let qt = parametros["qt_medido_ms"].as_f64().unwrap_or_else(|| parametros["qt_ms"].as_f64().unwrap_or(400.0));
            let fc = parametros["fc_bpm"].as_f64().ok_or("Parâmetro 'fc_bpm' ausente ou inválido")?;
            let sexo_fem = parametros["sexo_feminino"].as_bool().unwrap_or(false);

            let resultado = calcular_qtc_corrigido(qt, fc, sexo_fem)
                .map_err(|e| e.to_string())?;
            serde_json::to_value(&resultado).map_err(|e| e.to_string())
        }

        "perc" => {
            let id50 = parametros["idade_ge_50"].as_bool().unwrap_or_else(|| parametros["idade_maior_igual_50"].as_bool().unwrap_or(false));
            let fc100 = parametros["fc_ge_100"].as_bool().unwrap_or_else(|| parametros["fc_maior_igual_100"].as_bool().unwrap_or(false));
            let sat95 = parametros["spo2_menor_95"].as_bool().unwrap_or_else(|| parametros["sat_o2_ar_ambiente_menor_95"].as_bool().unwrap_or(false));
            let edema = parametros["edema_unilateral_mmii"].as_bool().unwrap_or_else(|| parametros["edema_unilateral_membro_inferior"].as_bool().unwrap_or(false));
            let hemo = parametros["hemoptise"].as_bool().unwrap_or(false);
            let cirurg = parametros["cirurgia_ou_trauma_recente"].as_bool().unwrap_or_else(|| parametros["cirurgia_trauma_ultimas_4sem"].as_bool().unwrap_or(false));
            let tev = parametros["tev_previo"].as_bool().unwrap_or(false);
            let estrog = parametros["uso_estrogenio"].as_bool().unwrap_or(false);

            let resultado = calcular_criterios_perc(id50, fc100, sat95, edema, hemo, cirurg, tev, estrog);
            serde_json::to_value(&resultado).map_err(|e| e.to_string())
        }

        "wells_tvp" => {
            let cancer = parametros["cancer_ativo"].as_bool().unwrap_or(false);
            let paralisia = parametros["paralisia_ou_imobilizacao_mmii"].as_bool().unwrap_or_else(|| parametros["paralisia_ou_imobilizacao_recente"].as_bool().unwrap_or(false));
            let acamado = parametros["acamado_recente_ou_cirurgia"].as_bool().unwrap_or_else(|| parametros["acamado_recente_ou_cirurgia_maior"].as_bool().unwrap_or(false));
            let dor = parametros["dor_ao_longo_sistema_venoso"].as_bool().unwrap_or_else(|| parametros["dor_trajeto_venoso_profundo"].as_bool().unwrap_or(false));
            let edema_total = parametros["edema_perna_inteira"].as_bool().unwrap_or_else(|| parametros["edema_membro_inferior_inteiro"].as_bool().unwrap_or(false));
            let edema_pant = parametros["edema_panturrilha_maior_3cm"].as_bool().unwrap_or(false);
            let cacifo = parametros["edema_com_cacifo"].as_bool().unwrap_or_else(|| parametros["edema_com_cacifo_unilateral"].as_bool().unwrap_or(false));
            let colaterais = parametros["veias_colaterais_superficiais"].as_bool().unwrap_or(false);
            let tvp = parametros["tvp_previa"].as_bool().unwrap_or_else(|| parametros["tvp_previa_documentada"].as_bool().unwrap_or(false));
            let alt = parametros["diagnostico_alternativo_provavel"].as_bool().unwrap_or_else(|| parametros["diagnostico_alternativo_mais_provavel"].as_bool().unwrap_or(false));

            let resultado = calcular_wells_tvp(cancer, paralisia, acamado, dor, edema_total, edema_pant, cacifo, colaterais, tvp, alt);
            serde_json::to_value(&resultado).map_err(|e| e.to_string())
        }

        "padua_tev" => {
            let cancer = parametros["cancer_ativo"].as_bool().unwrap_or(false);
            let tev = parametros["tev_previo"].as_bool().unwrap_or(false);
            let mobilidade = parametros["mobilidade_reduzida"].as_bool().unwrap_or(false);
            let trombo = parametros["trombofilia"].as_bool().unwrap_or_else(|| parametros["trombofilia_conhecida"].as_bool().unwrap_or(false));
            let cirurg = parametros["trauma_ou_cirurgia_recente"].as_bool().unwrap_or(false);
            let id70 = parametros["idade_ge_70"].as_bool().unwrap_or_else(|| parametros["idade_maior_igual_70"].as_bool().unwrap_or(false));
            let cardresp = parametros["ic_ou_insuf_respiratoria"].as_bool().unwrap_or_else(|| parametros["insuficiencia_cardiaca_ou_respiratoria"].as_bool().unwrap_or(false));
            let iam_avc = parametros["iam_ou_avc_agudo"].as_bool().unwrap_or_else(|| parametros["iam_ou_avc_isquemico_agudo"].as_bool().unwrap_or(false));
            let inf_reuma = parametros["infeccao_ou_doenca_reumatologica"].as_bool().unwrap_or_else(|| parametros["infeccao_aguda_ou_doenca_reumatologica"].as_bool().unwrap_or(false));
            let imc30 = parametros["obesidade_imc_ge_30"].as_bool().unwrap_or_else(|| parametros["imc_maior_igual_30"].as_bool().unwrap_or(false));
            let hormonal = parametros["terapia_hormonal"].as_bool().unwrap_or_else(|| parametros["terapia_hormonal_em_curso"].as_bool().unwrap_or(false));

            let resultado = calcular_escore_padua(cancer, tev, mobilidade, trombo, cirurg, id70, cardresp, iam_avc, inf_reuma, imc30, hormonal);
            serde_json::to_value(&resultado).map_err(|e| e.to_string())
        }

        "trombolise_avc" => {
            let peso = parametros["peso_kg"].as_f64().ok_or("Parâmetro 'peso_kg' ausente ou inválido")?;

            let resultado = calcular_trombolise_avc(peso)
                .map_err(|e| e.to_string())?;
            serde_json::to_value(&resultado).map_err(|e| e.to_string())
        }

        "glasgow_p" => {
            let ocular = parametros["abertura_ocular"].as_u64().ok_or("Parâmetro 'abertura_ocular' ausente ou inválido")? as u8;
            let verbal = parametros["resposta_verbal"].as_u64().ok_or("Parâmetro 'resposta_verbal' ausente ou inválido")? as u8;
            let motora = parametros["resposta_motora"].as_u64().ok_or("Parâmetro 'resposta_motora' ausente ou inválido")? as u8;
            let reacao_pupilar = parametros["reacao_pupilar"].as_u64().unwrap_or_else(|| parametros["pupilas_sem_resposta_luz"].as_u64().unwrap_or(0)) as u8;

            let resultado = calcular_glasgow_p(ocular, verbal, motora, reacao_pupilar)
                .map_err(|e| e.to_string())?;
            serde_json::to_value(&resultado).map_err(|e| e.to_string())
        }

        "cranio_cervical" => {
            let gcs15 = parametros["glasgow_menor_15_em_2h"].as_bool().unwrap_or_else(|| parametros["gcs_menor_15_apos_2h"].as_bool().unwrap_or(false));
            let fratura = parametros["suspeita_fratura_afundamento_base"].as_bool().unwrap_or_else(|| parametros["suspeita_fratura_aberta_afundamento"].as_bool().unwrap_or(false));
            let vomitos = parametros["vomitos_ge_2_episodios"].as_bool().unwrap_or_else(|| parametros["dois_ou_mais_episodios_vomito"].as_bool().unwrap_or(false));
            let id65 = parametros["idade_ge_65"].as_bool().unwrap_or_else(|| parametros["idade_maior_igual_65"].as_bool().unwrap_or(false));
            let amnesia = parametros["amnesia_retrograda_ge_30min"].as_bool().unwrap_or_else(|| parametros["amnesia_retrograda_maior_30min"].as_bool().unwrap_or(false));
            let mecanismo = parametros["mecanismo_perigoso_ejetado_atropelado"].as_bool().unwrap_or_else(|| parametros["mecanismo_perigoso"].as_bool().unwrap_or(false));
            let dor_cerv = parametros["dor_palpacao_linha_media_cervical"].as_bool().unwrap_or_else(|| parametros["nexus_dor_palpacao_cervical_medial"].as_bool().unwrap_or(false));
            let deficit = parametros["deficit_neurologico_focal"].as_bool().unwrap_or_else(|| parametros["nexus_deficit_neurologico_focal"].as_bool().unwrap_or(false));
            let consciencia = parametros["nivel_consciencia_alterado_ou_glasgow_menor_15"].as_bool().unwrap_or_else(|| parametros["nexus_nivel_consciencia_alterado"].as_bool().unwrap_or(false));
            let intoxicacao = parametros["evidencia_intoxicacao"].as_bool().unwrap_or_else(|| parametros["nexus_sinais_intoxicacao"].as_bool().unwrap_or(false));
            let distrativa = parametros["lesao_dolorosa_distrativa"].as_bool().unwrap_or_else(|| parametros["nexus_lesao_dolorosa_distrativa"].as_bool().unwrap_or(false));

            let resultado = calcular_cranio_cervical(
                gcs15, fratura, vomitos, id65, amnesia, mecanismo,
                dor_cerv, deficit, consciencia, intoxicacao, distrativa,
            );
            serde_json::to_value(&resultado).map_err(|e| e.to_string())
        }

        "meld_na" => {
            let creatinina = parametros["creatinina"].as_f64().ok_or("Parâmetro 'creatinina' ausente ou inválido")?;
            let bilirrubina = parametros["bilirrubina"].as_f64().ok_or("Parâmetro 'bilirrubina' ausente ou inválido")?;
            let inr = parametros["inr"].as_f64().ok_or("Parâmetro 'inr' ausente ou inválido")?;
            let sodio = parametros["sodio"].as_f64().ok_or("Parâmetro 'sodio' ausente ou inválido")?;
            let dialise = parametros["dialise_recente"].as_bool().unwrap_or(false);

            let resultado = calcular_meld_na(creatinina, bilirrubina, inr, sodio, dialise)
                .map_err(|e| e.to_string())?;
            serde_json::to_value(&resultado).map_err(|e| e.to_string())
        }

        "child_pugh" => {
            let bili = parametros["bilirrubina"].as_f64().unwrap_or_else(|| parametros["bilirrubina_mg_dl"].as_f64().unwrap_or(1.0));
            let alb = parametros["albumina"].as_f64().unwrap_or_else(|| parametros["albumina_g_dl"].as_f64().unwrap_or(4.0));
            let inr = parametros["inr"].as_f64().ok_or("Parâmetro 'inr' ausente ou inválido")?;
            let ascite = parametros["ascite_grau"].as_u64().unwrap_or_else(|| parametros["grau_ascite"].as_u64().unwrap_or(1)) as u8;
            let encef = parametros["encefalopatia_grau"].as_u64().unwrap_or_else(|| parametros["grau_encefalopatia"].as_u64().unwrap_or(1)) as u8;

            let resultado = calcular_child_pugh(bili, alb, inr, ascite, encef)
                .map_err(|e| e.to_string())?;
            serde_json::to_value(&resultado).map_err(|e| e.to_string())
        }

        "fib4" => {
            let idade = parametros["idade"].as_u64().unwrap_or_else(|| parametros["idade_anos"].as_u64().unwrap_or(40)) as u32;
            let ast = parametros["ast"].as_f64().unwrap_or_else(|| parametros["ast_tgo"].as_f64().unwrap_or(30.0));
            let alt = parametros["alt"].as_f64().unwrap_or_else(|| parametros["alt_tgp"].as_f64().unwrap_or(30.0));
            let plaquetas = parametros["plaquetas_milhares"].as_f64().ok_or("Parâmetro 'plaquetas_milhares' ausente ou inválido")?;

            let resultado = calcular_fib4(idade, ast, alt, plaquetas)
                .map_err(|e| e.to_string())?;
            serde_json::to_value(&resultado).map_err(|e| e.to_string())
        }

        "glasgow_blatchford" => {
            let ureia = parametros["ureia_mg_dl"].as_f64().ok_or("Parâmetro 'ureia_mg_dl' ausente ou inválido")?;
            let hb = parametros["hemoglobina_g_dl"].as_f64().ok_or("Parâmetro 'hemoglobina_g_dl' ausente ou inválido")?;
            let pas = parametros["pas_mmhg"].as_f64().ok_or("Parâmetro 'pas_mmhg' ausente ou inválido")?;
            let fc = parametros["fc_bpm"].as_f64().ok_or("Parâmetro 'fc_bpm' ausente ou inválido")?;
            let sexo_fem = parametros["sexo_feminino"].as_bool().unwrap_or(false);
            let melena = parametros["melena"].as_bool().unwrap_or(false);
            let sincope = parametros["sincope"].as_bool().unwrap_or(false);
            let hepatica = parametros["hepatopatia"].as_bool().unwrap_or_else(|| parametros["doenca_hepatica"].as_bool().unwrap_or(false));
            let ic = parametros["insuficiencia_cardiaca"].as_bool().unwrap_or(false);

            let resultado = calcular_glasgow_blatchford(ureia, hb, pas, fc, sexo_fem, melena, sincope, hepatica, ic)
                .map_err(|e| e.to_string())?;
            serde_json::to_value(&resultado).map_err(|e| e.to_string())
        }

        "bisap" => {
            let ureia = parametros["ureia_maior_53_5"].as_bool().unwrap_or_else(|| parametros["ureia_maior_44"].as_bool().unwrap_or(false));
            let gcs = parametros["glasgow_menor_15"].as_bool().unwrap_or(false);
            let sirs = parametros["sirs_presente"].as_bool().unwrap_or(false);
            let id60 = parametros["idade_maior_60"].as_bool().unwrap_or(false);
            let derrame = parametros["derrame_pleural"].as_bool().unwrap_or(false);

            let resultado = calcular_bisap(ureia, gcs, sirs, id60, derrame);
            serde_json::to_value(&resultado).map_err(|e| e.to_string())
        }

        "alvarado" => {
            let dor_fid = parametros["dor_fossa_iliaca_direita"].as_bool().unwrap_or_else(|| parametros["dor_migratoria_fossa_iliaca_direita"].as_bool().unwrap_or(false));
            let descomp = parametros["descompressao_brusca_positiva"].as_bool().unwrap_or_else(|| parametros["dor_descompressao_brusca"].as_bool().unwrap_or(false));
            let migr = parametros["migracao_da_dor"].as_bool().unwrap_or(false);
            let febre = parametros["febre_maior_37_3"].as_bool().unwrap_or(false);
            let anorexia = parametros["anorexia"].as_bool().unwrap_or(false);
            let nausea = parametros["nauseas_ou_vomitos"].as_bool().unwrap_or_else(|| parametros["nausea_ou_vomito"].as_bool().unwrap_or(false));
            let leuco = parametros["leucocitose_maior_10000"].as_bool().unwrap_or(false);
            let desvio = parametros["desvio_a_esquerda"].as_bool().unwrap_or_else(|| parametros["desvio_esquerda_neutrofilos"].as_bool().unwrap_or(false));

            let resultado = calcular_alvarado(dor_fid, descomp, migr, febre, anorexia, nausea, leuco, desvio);
            serde_json::to_value(&resultado).map_err(|e| e.to_string())
        }

        "equivalencia_corticoide" => {
            let farmaco = parametros["farmaco_origem"].as_str().ok_or("Parâmetro 'farmaco_origem' ausente ou inválido")?;
            let dose = parametros["dose_origem_mg"].as_f64().unwrap_or_else(|| parametros["dose_mg"].as_f64().unwrap_or(0.0));

            let resultado = calcular_equivalencia_corticoide(farmaco, dose)
                .map_err(|e| e.to_string())?;
            serde_json::to_value(&resultado).map_err(|e| e.to_string())
        }

        "antropometria_farmacologica" => {
            let peso = parametros["peso_kg"].as_f64().ok_or("Parâmetro 'peso_kg' ausente ou inválido")?;
            let altura = parametros["altura_cm"].as_f64().ok_or("Parâmetro 'altura_cm' ausente ou inválido")?;
            let sexo_fem = parametros["sexo_feminino"].as_bool().unwrap_or(false);

            let resultado = calcular_antropometria_farmacologica(peso, altura, sexo_fem)
                .map_err(|e| e.to_string())?;
            serde_json::to_value(&resultado).map_err(|e| e.to_string())
        }

        "centor_mcisaac" => {
            let idade = parametros["idade_anos"].as_u64().ok_or("Parâmetro 'idade_anos' ausente ou inválido")? as u16;
            let febre = parametros["febre_maior_38"].as_bool().unwrap_or_else(|| parametros["febre_referida_ou_aferida"].as_bool().unwrap_or(false));
            let tosse = parametros["ausencia_de_tosse"].as_bool().unwrap_or(false);
            let linfonodo = parametros["adenomegalia_cervical_anterior_dolorosa"].as_bool().unwrap_or_else(|| parametros["linfonodomegalia_cervical_anterior_dolorosa"].as_bool().unwrap_or(false));
            let exsudato = parametros["exsudato_amigdaliano"].as_bool().unwrap_or_else(|| parametros["exsudato_ou_edema_tonsilar"].as_bool().unwrap_or(false));

            let resultado = calcular_centor_mcisaac(idade, febre, tosse, linfonodo, exsudato);
            serde_json::to_value(&resultado).map_err(|e| e.to_string())
        }

        "idade_gestacional_dpp" => {
            let ano = parametros["dum_ano"].as_u64().ok_or("Parâmetro 'dum_ano' ausente ou inválido")? as u32;
            let mes = parametros["dum_mes"].as_u64().ok_or("Parâmetro 'dum_mes' ausente ou inválido")? as u32;
            let dia = parametros["dum_dia"].as_u64().ok_or("Parâmetro 'dum_dia' ausente ou inválido")? as u32;
            let atual_ano = parametros["consulta_ano"].as_u64().unwrap_or_else(|| parametros["data_atual_ano"].as_u64().unwrap_or(ano as u64)) as u32;
            let atual_mes = parametros["consulta_mes"].as_u64().unwrap_or_else(|| parametros["data_atual_mes"].as_u64().unwrap_or(mes as u64)) as u32;
            let atual_dia = parametros["consulta_dia"].as_u64().unwrap_or_else(|| parametros["data_atual_dia"].as_u64().unwrap_or(dia as u64)) as u32;

            let resultado = calcular_idade_gestacional_dpp(ano, mes, dia, atual_ano, atual_mes, atual_dia)
                .map_err(|e| e.to_string())?;
            serde_json::to_value(&resultado).map_err(|e| e.to_string())
        }

        "sofa_completo" => {
            let pao2_fio2 = parametros["pao2_fio2"].as_f64().unwrap_or(400.0);
            let vm = parametros["em_ventilacao_mecanica"].as_bool().unwrap_or_else(|| parametros["ventilacao_mecanica"].as_bool().unwrap_or(false));
            let plaq = parametros["plaquetas_milhares"].as_f64().ok_or("Parâmetro 'plaquetas_milhares' ausente ou inválido")?;
            let bili = parametros["bilirrubina"].as_f64().unwrap_or_else(|| parametros["bilirrubina_mg_dl"].as_f64().unwrap_or(1.0));
            let pam = parametros["pam"].as_f64().unwrap_or_else(|| parametros["pam_mmhg"].as_f64().unwrap_or(80.0));
            let dopa = parametros["dopamina_mcg"].as_f64().unwrap_or_else(|| parametros["dopamina_mcg_kg_min"].as_f64().unwrap_or(0.0));
            let nora = parametros["noradrenalina_mcg"].as_f64().unwrap_or_else(|| parametros["noradrenalina_mcg_kg_min"].as_f64().unwrap_or(0.0));
            let gcs = parametros["glasgow"].as_u64().ok_or("Parâmetro 'glasgow' ausente ou inválido")? as u8;
            let cr = parametros["creatinina"].as_f64().unwrap_or_else(|| parametros["creatinina_mg_dl"].as_f64().unwrap_or(1.0));
            let diurese = parametros["diurese_ml_dia"].as_f64().unwrap_or_else(|| parametros["diurese_24h_ml"].as_f64().unwrap_or(1500.0));
            let temp = parametros["temp_celsius"].as_f64().unwrap_or(36.8);
            let fc = parametros["fc_bpm"].as_f64().unwrap_or(75.0);
            let fr = parametros["fr_irpm"].as_f64().unwrap_or(16.0);
            let leuco = parametros["leucocitos_totais"].as_f64().unwrap_or(7000.0);

            let resultado = calcular_sofa_completo(
                pao2_fio2, vm, plaq, bili, pam, dopa, nora, gcs, cr, diurese,
                temp, fc, fr, leuco,
            );
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


// -----------------------------------------------------------------------------
// Segurança Farmacológica de 5ª Geração (Cascatas, ACB, Triple Whammy, Tisdale, CPIC)
// -----------------------------------------------------------------------------

#[tauri::command]
pub fn avaliar_seguranca_medicamentosa_5g(
    medicamentos: Vec<String>,
    idade: u32,
    sexo_feminino: bool,
    potassio_menor_igual_3_5: bool,
    qtc_basal_maior_igual_450: bool,
    iam_agudo: bool,
    insuficiencia_cardiaca_ou_sepse: bool,
) -> Result<RelatorioSeguranca5g, String> {
    Ok(avaliar_seg_5g(
        &medicamentos,
        idade,
        sexo_feminino,
        potassio_menor_igual_3_5,
        qtc_basal_maior_igual_450,
        iam_agudo,
        insuficiencia_cardiaca_ou_sepse,
    ))
}
