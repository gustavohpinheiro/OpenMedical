pub mod calculators;
pub mod database;
pub mod errors;
pub mod interactions;
pub mod models;
pub mod pediatric;
pub mod pharmacy_pricing;
pub mod protocols;

// Re-exports convenientes para os consumidores da biblioteca
pub use calculators::{
    avaliar_curb65_detalhado, avaliar_estagio_drc, calcular_clearance_cockcroft_gault,
    calcular_escore_curb65, calcular_escore_wells_tep, calcular_tfg_ckd_epi_2021,
    calcular_vazao_infusao,
};
pub use errors::ClinicalError;
pub use interactions::{gerar_pares_combinatorios, verificar_interacoes_em_memoria};
pub use models::*;
pub use pediatric::calcular_dose_pediatrica;
pub use pharmacy_pricing::{
    cotar_precos_farmacias, extrair_quantidade_unidades, verificar_elegibilidade_farmacia_popular,
    AnalisePrecoMedicamento, CotacaoFarmacia,
};
pub use protocols::analisar_protocolo_markdown;

#[cfg(not(target_arch = "wasm32"))]
pub use database::BancoDadosClinico;
