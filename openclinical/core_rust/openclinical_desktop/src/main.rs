#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

use commands::{
    buscar_geral, cotar_precos_medicamento, executar_calculo_clinico, listar_protocolos_clinicos,
    obter_detalhe_medicamento, obter_registro_cmed, resolver_caminho_banco, verificar_interacoes,
    EstadoAplicacao,
};
use std::sync::Mutex;
use tauri::Manager;

fn main() {
    let resultado = tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(EstadoAplicacao {
            caminho_banco: Mutex::new(None),
        })
        .setup(|app| {
            // No app instalado o banco vem como recurso empacotado (bundle.resources do tauri.conf.json)
            let caminho_banco = resolver_caminho_banco(app.path().resource_dir().ok());
            match &caminho_banco {
                Some(caminho) => println!("Iniciando OpenClinical Desktop. Banco de dados em: {caminho}"),
                None => eprintln!("Banco de dados openclinical_core.sqlite não encontrado; as consultas retornarão erro."),
            }

            let estado = app.state::<EstadoAplicacao>();
            let mut caminho_estado = estado
                .caminho_banco
                .lock()
                .map_err(|e| format!("Erro ao obter trava do estado do banco: {e}"))?;
            *caminho_estado = caminho_banco;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            buscar_geral,
            obter_detalhe_medicamento,
            obter_registro_cmed,
            cotar_precos_medicamento,
            verificar_interacoes,
            listar_protocolos_clinicos,
            executar_calculo_clinico
        ])
        .run(tauri::generate_context!());

    if let Err(erro) = resultado {
        eprintln!("Erro ao executar aplicativo Tauri OpenClinical: {erro}");
        std::process::exit(1);
    }
}
