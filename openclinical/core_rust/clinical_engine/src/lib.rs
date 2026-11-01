#[cfg(not(target_arch = "wasm32"))]
pub mod api_anvisa;
#[cfg(not(target_arch = "wasm32"))]
pub mod atualizador;
#[cfg(not(target_arch = "wasm32"))]
pub mod bulas_importadas;
#[cfg(not(target_arch = "wasm32"))]
pub mod pcdt_conitec;
pub mod acid_base;
pub mod calculators;
pub mod database;
pub mod emergency;
pub mod errors;
pub mod interactions;
pub mod medication_safety_5g;
pub mod models;
pub mod pediatric;
pub mod pharmacy_pricing;
pub mod protocols;

// Re-exports convenientes para os consumidores da biblioteca
pub use acid_base::{calcular_correcao_sodio, interpretar_gasometria, ResultadoCorrecaoSodio, ResultadoGasometria};
pub use calculators::{
    avaliar_curb65_detalhado, avaliar_estagio_drc, calcular_clearance_cockcroft_gault,
    calcular_dose_reversa_infusao, calcular_escore_cha2ds2_va, calcular_escore_curb65,
    calcular_escore_qsofa, calcular_escore_wells_tep, calcular_tfg_ckd_epi_2021,
    calcular_vazao_infusao,
};
pub use emergency::{
    calcular_emergencia_pediatrica, calcular_intubacao_sri, ItemFarmacoEmergencia,
    ParametrosVentilacaoInicial, ResultadoEmergenciaPediatrica, ResultadoIntubacaoSri,
};
pub use errors::ClinicalError;
pub use interactions::{gerar_pares_combinatorios, verificar_interacoes_em_memoria};
pub use medication_safety_5g::{
    avaliar_seguranca_medicamentosa_5g, calcular_carga_anticolinergica_acb,
    calcular_escore_tisdale_qtc, consultar_alertas_farmacogenomicos_cpic,
    detectar_cascatas_prescricao, detectar_triple_whammy_renal,
    AlertaCascataPrescricao, AlertaFarmacogenomicoCpic, ItemCargaAnticolinergica,
    RelatorioSeguranca5g, ResultadoCargaAnticolinergica, ResultadoEscoreTisdale,
    ResultadoTripleWhammy,
};
pub use models::*;
pub use pediatric::calcular_dose_pediatrica;
pub use pharmacy_pricing::{
    analisar_preco_medicamento, extrair_quantidade_unidades, verificar_farmacia_popular,
    AnalisePrecoMedicamento, LinkPesquisaPreco, SituacaoFarmaciaPopular,
};
pub use protocols::analisar_protocolo_markdown;

#[cfg(not(target_arch = "wasm32"))]
pub use database::BancoDadosClinico;
