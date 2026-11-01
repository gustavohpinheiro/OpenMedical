use crate::errors::ClinicalError;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ResultadoGasometria {
    pub ph: f64,
    pub paco2: f64,
    pub hco3: f64,
    pub sodio: f64,
    pub cloro: f64,
    pub albumina: f64,
    pub pao2: f64,
    pub fio2_fracao: f64,
    pub disturbio_primario: String,
    pub anion_gap_bruto: f64,
    pub anion_gap_corrigido: f64,
    pub delta_delta: Option<f64>,
    pub interpretacao_delta_delta: Option<String>,
    pub paco2_esperada_min: Option<f64>,
    pub paco2_esperada_max: Option<f64>,
    pub compensacao_respiratoria: String,
    pub relacao_pafo2: f64,
    pub classificacao_oxigenacao_sdra: String,
    pub condutas_sugeridas: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ResultadoCorrecaoSodio {
    pub sodio_atual: f64,
    pub solucao_meq_l: f64,
    pub agua_corporal_total_litros: f64,
    pub variacao_sodio_1l: f64,
    pub volume_recomendado_24h_ml: f64,
    pub vazao_bic_ml_h: f64,
    pub alerta_seguranca: String,
}

/// Interpreta gasometria arterial completa com Ânion Gap corrigido por Figge, Delta-Delta, Winters e Relação P/F.
pub fn interpretar_gasometria(
    ph: f64,
    paco2: f64,
    hco3: f64,
    sodio: f64,
    cloro: f64,
    albumina: f64,
    pao2: f64,
    fio2_fracao: f64,
) -> Result<ResultadoGasometria, ClinicalError> {
    if !(6.5..=7.9).contains(&ph) {
        return Err(ClinicalError::ParametroInvalido {
            campo: "ph".to_string(),
            valor: ph,
            motivo: "pH arterial deve estar no intervalo biológico de 6.5 a 7.9.".to_string(),
        });
    }
    if !(10.0..=150.0).contains(&paco2) {
        return Err(ClinicalError::ParametroInvalido {
            campo: "paco2".to_string(),
            valor: paco2,
            motivo: "PaCO2 deve estar entre 10.0 e 150.0 mmHg.".to_string(),
        });
    }
    if !(2.0..=65.0).contains(&hco3) {
        return Err(ClinicalError::ParametroInvalido {
            campo: "hco3".to_string(),
            valor: hco3,
            motivo: "Bicarbonato (HCO3) deve estar entre 2.0 e 65.0 mEq/L.".to_string(),
        });
    }
    if !(100.0..=190.0).contains(&sodio) {
        return Err(ClinicalError::ParametroInvalido {
            campo: "sodio".to_string(),
            valor: sodio,
            motivo: "Sódio sérico deve estar entre 100.0 e 190.0 mEq/L.".to_string(),
        });
    }
    if !(60.0..=150.0).contains(&cloro) {
        return Err(ClinicalError::ParametroInvalido {
            campo: "cloro".to_string(),
            valor: cloro,
            motivo: "Cloro sérico deve estar entre 60.0 e 150.0 mEq/L.".to_string(),
        });
    }
    if !(0.5..=6.5).contains(&albumina) {
        return Err(ClinicalError::ParametroInvalido {
            campo: "albumina".to_string(),
            valor: albumina,
            motivo: "Albumina sérica deve estar entre 0.5 e 6.5 g/dL.".to_string(),
        });
    }
    if !(0.21..=1.0).contains(&fio2_fracao) {
        return Err(ClinicalError::ParametroInvalido {
            campo: "fio2_fracao".to_string(),
            valor: fio2_fracao,
            motivo: "FiO2 fracionada deve estar entre 0.21 e 1.0 (21% a 100%).".to_string(),
        });
    }

    // 1. Ânion Gap Bruto e Corrigido (Fórmula de Figge)
    let ag_bruto = sodio - (cloro + hco3);
    let ag_corrigido = ag_bruto + 2.5 * (4.0 - albumina);
    let ag_bruto_round = (ag_bruto * 10.0).round() / 10.0;
    let ag_corrigido_round = (ag_corrigido * 10.0).round() / 10.0;

    // 2. Distúrbio Primário
    let (disturbio_primario, is_acidose_metab, is_alcalose_metab) = if ph < 7.35 {
        if hco3 < 22.0 && paco2 > 45.0 {
            ("Acidose Mista (Metabólica e Respiratória)".to_string(), true, false)
        } else if hco3 < 22.0 {
            ("Acidose Metabólica".to_string(), true, false)
        } else if paco2 > 45.0 {
            ("Acidose Respiratória".to_string(), false, false)
        } else {
            ("Acidose não compensada".to_string(), false, false)
        }
    } else if ph > 7.45 {
        if hco3 > 26.0 && paco2 < 35.0 {
            ("Alcalose Mista (Metabólica e Respiratória)".to_string(), false, true)
        } else if hco3 > 26.0 {
            ("Alcalose Metabólica".to_string(), false, true)
        } else if paco2 < 35.0 {
            ("Alcalose Respiratória".to_string(), false, false)
        } else {
            ("Alcalose não compensada".to_string(), false, false)
        }
    } else {
        // pH dentro da faixa normal (7.35 - 7.45)
        if hco3 < 22.0 && paco2 < 35.0 {
            if ph < 7.40 {
                ("Acidose Metabólica Compensada".to_string(), true, false)
            } else {
                ("Alcalose Respiratória Compensada".to_string(), false, false)
            }
        } else if hco3 > 26.0 && paco2 > 45.0 {
            if ph > 7.40 {
                ("Alcalose Metabólica Compensada".to_string(), false, true)
            } else {
                ("Acidose Respiratória Compensada".to_string(), false, false)
            }
        } else {
            ("Equilíbrio Ácido-Básico Preservado (Normal)".to_string(), false, false)
        }
    };

    // 3. Compensação Respiratória
    let mut paco2_min = None;
    let mut paco2_max = None;
    let mut compensacao = "Sem indicação de cálculo de resposta compensatória ventilatória.".to_string();

    if is_acidose_metab {
        // Fórmula de Winters: PaCO2 = 1.5 * HCO3 + 8 (+- 2)
        let paco2_esp = 1.5 * hco3 + 8.0;
        let min_val = (paco2_esp - 2.0).max(10.0);
        let max_val = paco2_esp + 2.0;
        paco2_min = Some((min_val * 10.0).round() / 10.0);
        paco2_max = Some((max_val * 10.0).round() / 10.0);

        if paco2 < min_val {
            compensacao = format!(
                "Alcalose respiratória concomitante (PaCO2 real {:.1} < esperado {:.1}-{:.1} pela Fórmula de Winters).",
                paco2, min_val, max_val
            );
        } else if paco2 > max_val {
            compensacao = format!(
                "Acidose respiratória associada / Fadiga ventilatória (PaCO2 real {:.1} > esperado {:.1}-{:.1} pela Fórmula de Winters).",
                paco2, min_val, max_val
            );
        } else {
            compensacao = format!(
                "Compensação respiratória adequada pela Fórmula de Winters (PaCO2 esperada: {:.1} a {:.1} mmHg).",
                min_val, max_val
            );
        }
    } else if is_alcalose_metab {
        // PaCO2 = 0.7 * (HCO3 - 24) + 40 (+- 2)
        let paco2_esp = 0.7 * (hco3 - 24.0) + 40.0;
        let min_val = (paco2_esp - 2.0).max(10.0);
        let max_val = paco2_esp + 2.0;
        paco2_min = Some((min_val * 10.0).round() / 10.0);
        paco2_max = Some((max_val * 10.0).round() / 10.0);

        if paco2 < min_val {
            compensacao = format!(
                "Alcalose respiratória associada (PaCO2 {:.1} < {:.1}).",
                paco2, min_val
            );
        } else if paco2 > max_val {
            compensacao = format!(
                "Acidose respiratória associada (PaCO2 {:.1} > {:.1}).",
                paco2, max_val
            );
        } else {
            compensacao = format!(
                "Compensação respiratória adequada (PaCO2 esperada: {:.1} a {:.1} mmHg).",
                min_val, max_val
            );
        }
    }

    // 4. Delta-Delta
    let mut delta_delta = None;
    let mut interpretacao_delta_delta = None;
    if ag_corrigido > 12.0 && hco3 < 24.0 {
        let delta_ag = ag_corrigido - 12.0;
        let delta_hco3 = 24.0 - hco3;
        if delta_hco3 > 0.001 {
            let ratio = delta_ag / delta_hco3;
            let ratio_round = (ratio * 100.0).round() / 100.0;
            delta_delta = Some(ratio_round);

            let interp = if ratio < 1.0 {
                "Delta-Delta < 1.0: Acidose metabólica mista (Ânion Gap Elevado + Hiperclorêmica / Ânion Gap Normal).".to_string()
            } else if ratio <= 2.0 {
                "Delta-Delta entre 1.0 e 2.0: Acidose metabólica com Ânion Gap elevado pura (ex: Cetoacidose, Uremia, Láctico, Tóxicos).".to_string()
            } else {
                "Delta-Delta > 2.0: Acidose de Ânion Gap elevado associada a Alcalose Metabólica preexistente ou retenção crônica prévia de bicarbonato.".to_string()
            };
            interpretacao_delta_delta = Some(interp);
        }
    }

    // 5. Relação PaO2 / FiO2 (Horowitz)
    let pafo2 = (pao2 / fio2_fracao * 10.0).round() / 10.0;
    let sdra_class = if pafo2 >= 300.0 {
        "Troca gasosa preservada (P/F >= 300 - Sem critérios para SDRA)".to_string()
    } else if pafo2 >= 200.0 {
        "SDRA Leve (Berlim: P/F entre 200 e 300 com PEEP >= 5 cmH2O)".to_string()
    } else if pafo2 >= 100.0 {
        "SDRA Moderada (Berlim: P/F entre 100 e 200 - otimizar PEEP e ventilação protetora 6 mL/kg)".to_string()
    } else {
        "SDRA Grave (Berlim: P/F < 100 - Alto risco de mortalidade; considerar posição prona por 16h e bloqueio neuromuscular)".to_string()
    };

    // 6. Condutas Sugeridas
    let mut condutas = Vec::new();
    if is_acidose_metab {
        if ag_corrigido > 12.0 {
            condutas.push("Investigar mnemônico GOLDMARK (Glicóis, Oxoprolina, L-Lactato, D-Lactato, Metanol, Aspirina, Renal/Uremia, Cetoacidose).".to_string());
        } else {
            condutas.push("Investigar causas de Ânion Gap normal/hiperclorêmicas: perdas digestivas baixas (diarreia), fístulas, acidose tubular renal ou infusão excessiva de SF 0,9%.".to_string());
        }
    }
    if pafo2 < 200.0 {
        condutas.push("Adotar rigorosamente protocolo ARDSNet de ventilação mecânica protetora: volume corrente de 4 a 6 mL/kg de peso predito e pressão de platô <= 30 cmH2O / driving pressure <= 15 cmH2O.".to_string());
    }

    Ok(ResultadoGasometria {
        ph,
        paco2,
        hco3,
        sodio,
        cloro,
        albumina,
        pao2,
        fio2_fracao,
        disturbio_primario,
        anion_gap_bruto: ag_bruto_round,
        anion_gap_corrigido: ag_corrigido_round,
        delta_delta,
        interpretacao_delta_delta,
        paco2_esperada_min: paco2_min,
        paco2_esperada_max: paco2_max,
        compensacao_respiratoria: compensacao,
        relacao_pafo2: pafo2,
        classificacao_oxigenacao_sdra: sdra_class,
        condutas_sugeridas: condutas,
    })
}

/// Calcula correção de sódio pelo método de Adrogué-Madias com limite seguro de 8 mEq/L em 24h.
pub fn calcular_correcao_sodio(
    sodio_atual: f64,
    peso_kg: f64,
    sexo_feminino: bool,
    idoso: bool,
    solucao_meq_l: f64,
) -> Result<ResultadoCorrecaoSodio, ClinicalError> {
    if !(100.0..=190.0).contains(&sodio_atual) {
        return Err(ClinicalError::ParametroInvalido {
            campo: "sodio_atual".to_string(),
            valor: sodio_atual,
            motivo: "Sódio sérico atual deve estar entre 100.0 e 190.0 mEq/L.".to_string(),
        });
    }
    if !(20.0..=250.0).contains(&peso_kg) {
        return Err(ClinicalError::ParametroInvalido {
            campo: "peso_kg".to_string(),
            valor: peso_kg,
            motivo: "Peso do paciente deve estar entre 20.0 e 250.0 kg.".to_string(),
        });
    }

    // Fração de Água Corporal Total (ACT)
    let fracao_act = match (sexo_feminino, idoso) {
        (true, true) => 0.45,
        (true, false) => 0.50,
        (false, true) => 0.50,
        (false, false) => 0.60,
    };

    let act = peso_kg * fracao_act;

    // Fórmula de Adrogué-Madias: Delta Na+ = (Na+ infusato - Na+ sérico) / (ACT + 1)
    let delta_na_1l = (solucao_meq_l - sodio_atual) / (act + 1.0);
    let delta_na_1l_round = (delta_na_1l * 100.0).round() / 100.0;

    let delta_alvo_seguro = 8.0; // máx 8 mEq/L nas primeiras 24 horas
    let vol_24h_ml = if delta_na_1l.abs() > 0.0001 {
        ((delta_alvo_seguro / delta_na_1l.abs()) * 1000.0 * 10.0).round() / 10.0
    } else {
        0.0
    };
    let vazao_bic_ml_h = (vol_24h_ml / 24.0 * 10.0).round() / 10.0;

    let alerta = if delta_na_1l > 0.0 {
        "Atenção na Hiponatremia: Taxa máxima recomendada de elevação do sódio é de 8 mEq/L nas primeiras 24 horas para prevenção rigorosa da Síndrome de Desmielinização Osmótica (Mielinólise Pontina). Dosar sódio a cada 2 a 4 horas.".to_string()
    } else {
        "Atenção na Hipernatremia: Redução máxima de sódio sérico de 8 a 10 mEq/L em 24h para prevenir edema cerebral e convulsões agudas. Dosar eletrólitos a cada 4 a 6 horas.".to_string()
    };

    Ok(ResultadoCorrecaoSodio {
        sodio_atual,
        solucao_meq_l,
        agua_corporal_total_litros: (act * 10.0).round() / 10.0,
        variacao_sodio_1l: delta_na_1l_round,
        volume_recomendado_24h_ml: (vol_24h_ml * 10.0).round() / 10.0,
        vazao_bic_ml_h,
        alerta_seguranca: alerta,
    })
}
