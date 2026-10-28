use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct PrincipioAtivo {
    pub id_principio_ativo: i64,
    pub nome_dcb: String,
    pub classe_terapeutica: String,
    pub categoria_risco_gestacao: String,
    pub compatibilidade_aleitamento: String,
    pub disponivel_rename_sus: i64,
    pub componente_sus: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct MedicamentoComercial {
    pub id_medicamento: i64,
    pub id_principio_ativo: i64,
    pub numero_registro_anvisa: String,
    pub nome_comercial: String,
    pub laboratorio_fabricante: String,
    pub apresentacao_comercial: String,
    pub concentracao_valor: f64,
    pub concentracao_unidade: String,
    pub forma_farmaceutica: String,
    pub tipo_receituario: String,
    pub preco_maximo_consumidor: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct BulaEstruturada {
    pub id_bula: i64,
    pub id_principio_ativo: i64,
    pub indicacoes_clinicas: String,
    pub posologia_adulto_padrao: String,
    pub posologia_pediatrica_padrao: Option<String>,
    pub dose_pediatrica_mg_kg_dia_min: Option<f64>,
    pub dose_pediatrica_mg_kg_dia_max: Option<f64>,
    pub dose_maxima_diaria_mg: Option<f64>,
    pub ajuste_funcao_renal_json: Option<String>,
    pub ajuste_funcao_hepatica: Option<String>,
    pub contraindicacoes: String,
    pub eventos_adversos_comuns: String,
    pub guia_diluicao_injetavel_json: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct MatrizInteracao {
    pub id_interacao: i64,
    pub id_principio_ativo_a: i64,
    pub id_principio_ativo_b: i64,
    pub nome_principio_a: Option<String>,
    pub nome_principio_b: Option<String>,
    pub gravidade_interacao: String,
    pub efeito_clinico: String,
    pub conduta_recomendada: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct CodigoDiagnostico {
    pub id_diagnostico: i64,
    pub codigo_cid10: String,
    pub descricao_cid10: String,
    pub codigo_ciap2: String,
    pub descricao_ciap2: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ItemBuscaFts {
    pub tipo_registro: String,
    /// Inteiro (medicamentos, diagnósticos) ou texto (identificador de protocolo).
    pub id_referencia: serde_json::Value,
    pub titulo_primario: String,
    pub subtitulo: String,
    pub score_relevancia: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct DetalheMedicamentoCompleto {
    pub medicamento: MedicamentoComercial,
    pub principio_ativo: PrincipioAtivo,
    pub bula: Option<BulaEstruturada>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ResultadoDosePediatrica {
    pub peso_kg: f64,
    pub dose_alvo_mg_kg_dia: f64,
    pub dose_total_calculada_mg_dia: f64,
    pub dose_teto_aplicada_mg_dia: f64,
    pub fracionamento_diario: u8,
    pub intervalo_horas: u8,
    pub dose_por_tomada_mg: f64,
    pub volume_ml_por_tomada: f64,
    pub numero_gotas_por_tomada: u32,
    pub alerta_teto_ultrapassado: bool,
    pub justificativa_seguranca: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ResultadoTfg {
    pub taxa_filtracao_glomerular: f64,
    pub estagio_drc: String,
    pub metodo_utilizado: String,
    pub recomendacao_geral: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ResultadoWells {
    pub pontuacao_total: f64,
    pub categoria_risco: String,
    pub probabilidade_clinica_percentual: String,
    pub conduta_propedêutica: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ResultadoCurb65 {
    pub pontuacao: u8,
    pub estrato_mortalidade: String,
    pub recomendacao_local_tratamento: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ProtocoloClinico {
    pub id_protocolo: String,
    pub titulo: String,
    pub cids_relacionados: Vec<String>,
    pub ciaps_relacionados: Vec<String>,
    pub nivel_atencao: String,
    pub data_revisao: String,
    #[serde(default)]
    pub status_revisao_clinica: Option<String>,
    pub conteudo_markdown: String,
    pub bloco_prescricao_copiavel: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct MedicamentoComercialCmed {
    pub id_cmed: i64,
    pub substancia: String,
    pub nome_produto: String,
    pub apresentacao: String,
    pub classe_terapeutica: String,
    pub tipo_produto: String,
    pub laboratorio: String,
    pub numero_registro: String,
    pub codigo_ean: String,
    pub tarja: String,
    pub preco_maximo_consumidor: f64,
    pub receita_padrao_copiavel: String,
}
