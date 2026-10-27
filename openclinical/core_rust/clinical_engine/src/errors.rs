use thiserror::Error;

#[derive(Error, Debug, Clone, PartialEq)]
pub enum ClinicalError {
    #[error("Parâmetro fisiológico inválido: {campo}. Valor recebido: {valor}. Motivo: {motivo}")]
    ParametroInvalido {
        campo: String,
        valor: f64,
        motivo: String,
    },

    #[error("Concentração do fármaco não pode ser menor ou igual a zero: {valor}")]
    ConcentracaoInvalida { valor: f64 },

    #[error("Fracionamento diário inválido: {valor}. Deve ser entre 1 e 24 tomadas ao dia.")]
    FracionamentoInvalido { valor: u8 },

    #[error("Escore clínico com parâmetros inconsistentes: {mensagem}")]
    EscoreInconsistente { mensagem: String },

    #[error("Falha ao analisar protocolo clínico: {motivo}")]
    FalhaParserProtocolo { motivo: String },

    #[error("Registro clínico não localizado para o identificador: {identificador}")]
    NaoEncontrado { identificador: String },

    #[error("Erro de persistência ou consulta no banco de dados SQLite: {mensagem}")]
    ErroBancoDados { mensagem: String },

    #[error("Funcionalidade indisponível no ambiente de execução: {detalhe}")]
    AmbienteNaoSuportado { detalhe: String },
}

#[cfg(not(target_arch = "wasm32"))]
impl From<rusqlite::Error> for ClinicalError {
    fn from(erro: rusqlite::Error) -> Self {
        ClinicalError::ErroBancoDados {
            mensagem: erro.to_string(),
        }
    }
}
