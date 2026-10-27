#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

use commands::{
    buscar_geral, executar_calculo_clinico, listar_protocolos_clinicos,
    obter_detalhe_medicamento, resolver_caminho_banco, verificar_interacoes, EstadoAplicacao,
};
use std::sync::Mutex;

fn main() {
    let caminho_banco = resolver_caminho_banco();
    println!("Iniciando OpenClinical Desktop. Banco de dados em: {caminho_banco}");

    let estado = EstadoAplicacao {
        caminho_banco: Mutex::new(caminho_banco),
    };

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(estado)
        .invoke_handler(tauri::generate_handler![
            buscar_geral,
            obter_detalhe_medicamento,
            verificar_interacoes,
            listar_protocolos_clinicos,
            executar_calculo_clinico
        ])
        .run(tauri::generate_context!())
        .expect("Erro ao executar aplicativo Tauri OpenClinical");
}
