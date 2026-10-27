use crate::errors::ClinicalError;
use crate::models::ResultadoDosePediatrica;

/// Fator padrão para conversão de soluções aquosas farmacêuticas pediátricas em frasco gotejador.
pub const GOTAS_POR_MILILITRO: f64 = 20.0;

/// Cálculo determinístico de dose pediátrica líquida com verificação de teto diário de segurança.
///
/// Parâmetros:
/// - peso_kg: peso corporal da criança em quilogramas
/// - dose_alvo_mg_kg_dia: posologia diária recomendada em mg/kg/dia
/// - concentracao_mg_ml: concentração da suspensão/solução oral (mg/mL)
/// - fracionamento_diario: número de tomadas diárias (ex: 3 para cada 8 horas, 4 para cada 6 horas)
/// - dose_maxima_diaria_mg: teto diário absoluto de segurança (opcional, extraído da bula)
pub fn calcular_dose_pediatrica(
    peso_kg: f64,
    dose_alvo_mg_kg_dia: f64,
    concentracao_mg_ml: f64,
    fracionamento_diario: u8,
    dose_maxima_diaria_mg: Option<f64>,
) -> Result<ResultadoDosePediatrica, ClinicalError> {
    if peso_kg <= 0.0 || peso_kg > 150.0 {
        return Err(ClinicalError::ParametroInvalido {
            campo: "peso_kg".to_string(),
            valor: peso_kg,
            motivo: "O peso pediátrico deve ser estritamente positivo e compatível com a infância/adolescência.".to_string(),
        });
    }

    if dose_alvo_mg_kg_dia <= 0.0 {
        return Err(ClinicalError::ParametroInvalido {
            campo: "dose_alvo_mg_kg_dia".to_string(),
            valor: dose_alvo_mg_kg_dia,
            motivo: "A dose alvo em mg/kg/dia deve ser maior que zero.".to_string(),
        });
    }

    if concentracao_mg_ml <= 0.0 {
        return Err(ClinicalError::ConcentracaoInvalida {
            valor: concentracao_mg_ml,
        });
    }

    if fracionamento_diario == 0 || fracionamento_diario > 24 {
        return Err(ClinicalError::FracionamentoInvalido {
            valor: fracionamento_diario,
        });
    }

    let dose_total_calculada = peso_kg * dose_alvo_mg_kg_dia;

    let (dose_teto_aplicada, alerta_teto, justificativa) = match dose_maxima_diaria_mg {
        Some(teto) if dose_total_calculada > teto => (
            teto,
            true,
            Some(format!(
                "Alerta Clínico: A dose calculada de {:.2} mg/dia excedeu a dose máxima diária recomendada de {:.2} mg/dia. O regime foi limitado com segurança ao teto máximo diário.",
                dose_total_calculada, teto
            )),
        ),
        Some(_teto) => (dose_total_calculada, false, None),
        None => (dose_total_calculada, false, None),
    };

    let intervalo_horas = (24 / fracionamento_diario) as u8;
    let dose_por_tomada = dose_teto_aplicada / (fracionamento_diario as f64);
    let volume_ml_por_tomada = dose_por_tomada / concentracao_mg_ml;
    let numero_gotas = (volume_ml_por_tomada * GOTAS_POR_MILILITRO).round() as u32;

    Ok(ResultadoDosePediatrica {
        peso_kg: (peso_kg * 100.0).round() / 100.0,
        dose_alvo_mg_kg_dia: (dose_alvo_mg_kg_dia * 100.0).round() / 100.0,
        dose_total_calculada_mg_dia: (dose_total_calculada * 100.0).round() / 100.0,
        dose_teto_aplicada_mg_dia: (dose_teto_aplicada * 100.0).round() / 100.0,
        fracionamento_diario,
        intervalo_horas,
        dose_por_tomada_mg: (dose_por_tomada * 100.0).round() / 100.0,
        volume_ml_por_tomada: (volume_ml_por_tomada * 100.0).round() / 100.0,
        numero_gotas_por_tomada: numero_gotas,
        alerta_teto_ultrapassado: alerta_teto,
        justificativa_seguranca: justificativa,
    })
}
