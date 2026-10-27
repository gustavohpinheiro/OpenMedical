use clinical_engine::calculators::{
    avaliar_curb65_detalhado, avaliar_estagio_drc, calcular_clearance_cockcroft_gault,
    calcular_escore_wells_tep, calcular_tfg_ckd_epi_2021, calcular_vazao_infusao,
};
use clinical_engine::database::BancoDadosClinico;
use clinical_engine::models::{
    DetalheMedicamentoCompleto, ItemBuscaFts, MatrizInteracao, ProtocoloClinico,
};
use clinical_engine::pediatric::calcular_dose_pediatrica;
use clinical_engine::protocols::analisar_protocolo_markdown;
use serde_json::{json, Value};
use std::fs;
use std::path::{Path, PathBuf};
use std::sync::Mutex;

pub struct EstadoAplicacao {
    pub caminho_banco: Mutex<String>,
}

pub fn resolver_caminho_banco() -> String {
    if let Ok(caminho_env) = std::env::var("OPENCLINICAL_DB_PATH") {
        if Path::new(&caminho_env).exists() {
            return caminho_env;
        }
    }

    let caminhos_candidatos = [
        "openclinical_core.sqlite",
        "openclinical/etl_pipeline/openclinical_core.sqlite",
        "../etl_pipeline/openclinical_core.sqlite",
        "../../etl_pipeline/openclinical_core.sqlite",
        "../../../etl_pipeline/openclinical_core.sqlite",
        "e:/source/OpenMedical/openclinical/etl_pipeline/openclinical_core.sqlite",
    ];

    for candidato in caminhos_candidatos {
        if Path::new(candidato).exists() {
            return candidato.to_string();
        }
    }

    "openclinical_core.sqlite".to_string()
}

fn obter_conexao_banco(estado: &EstadoAplicacao) -> Result<BancoDadosClinico, String> {
    let caminho = estado
        .caminho_banco
        .lock()
        .map_err(|e| format!("Erro ao obter trava do estado do banco: {e}"))?
        .clone();

    BancoDadosClinico::abrir(&caminho).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn buscar_geral(
    termo: String,
    estado: tauri::State<'_, EstadoAplicacao>,
) -> Result<Vec<ItemBuscaFts>, String> {
    let banco = obter_conexao_banco(&estado)?;
    banco.buscar_geral(&termo, 30).map_err(|e| e.to_string())
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
        "e:/source/OpenMedical/openclinical/clinical_content/protocolos",
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
        if caminho.extension().and_then(|ext| ext.to_str()) == Some("md") {
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
            let concentracao_mg_ml = parametros["concentracao_mg_ml"]
                .as_f64()
                .ok_or("Parâmetro 'concentracao_mg_ml' ausente ou inválido")?;
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
