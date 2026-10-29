#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

use commands::{
    analisar_preco_medicamento, atualizar_bases_agora, buscar_geral, consultar_bula_anvisa,
    estado_atualizacao_bases, executar_calculo_clinico, iniciar_atualizador_diario,
    listar_protocolos_clinicos, obter_detalhe_medicamento, obter_registro_cmed,
    preparar_banco_gravavel, resolver_caminho_banco, verificar_interacoes, EstadoAplicacao,
    estado_credenciais_anvisa, remover_credenciais_anvisa, salvar_credenciais_anvisa, testar_api_anvisa,
    apresentacoes_cmed_por_substancias, listar_substancias_cmed,
    listar_bulas_importadas, obter_bulas_importadas, remover_bula_importada, salvar_bula_importada,
    listar_pcdt_conitec, obter_pcdt_conitec,
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
            let diretorio_recursos = app.path().resource_dir().ok();
            let caminho_banco = resolver_caminho_banco(diretorio_recursos.clone()).map(|caminho| {
                preparar_banco_gravavel(caminho, diretorio_recursos.as_deref(), app.path().app_data_dir().ok())
            });
            match &caminho_banco {
                Some(caminho) => {
                    println!("Iniciando OpenClinical Desktop. Banco de dados em: {caminho}");
                    // Preços CMED, registros e índice de bulas da ANVISA: verificados uma vez por dia
                    iniciar_atualizador_diario(app.handle().clone(), caminho.clone());
                }
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
            analisar_preco_medicamento,
            verificar_interacoes,
            listar_protocolos_clinicos,
            executar_calculo_clinico,
            estado_atualizacao_bases,
            atualizar_bases_agora,
            consultar_bula_anvisa,
            estado_credenciais_anvisa,
            salvar_credenciais_anvisa,
            remover_credenciais_anvisa,
            testar_api_anvisa,
            listar_substancias_cmed,
            apresentacoes_cmed_por_substancias,
            salvar_bula_importada,
            obter_bulas_importadas,
            listar_bulas_importadas,
            remover_bula_importada,
            listar_pcdt_conitec,
            obter_pcdt_conitec
        ])
        .run(tauri::generate_context!());

    if let Err(erro) = resultado {
        eprintln!("Erro ao executar aplicativo Tauri OpenClinical: {erro}");
        std::process::exit(1);
    }
}
