use crate::errors::ClinicalError;
use crate::models::{ResultadoCurb65, ResultadoTfg, ResultadoWells};

/// Equação CKD-EPI 2021 para estimativa da taxa de filtração glomerular (TFG)
/// sem ajuste racial, recomendada pelas diretrizes internacionais (KDIGO 2023)
/// e Sociedade Brasileira de Nefrologia (SBN).
///
/// Parâmetros:
/// - creatinina: creatinina sérica em mg/dL (método rastreável IDMS)
/// - idade: idade cronológica em anos completos (>= 18)
/// - sexo_feminino: true se sexo biológico feminino, false se masculino
pub fn calcular_tfg_ckd_epi_2021(
    creatinina: f64,
    idade: u32,
    sexo_feminino: bool,
) -> Result<f64, ClinicalError> {
    if creatinina <= 0.0 || creatinina > 30.0 {
        return Err(ClinicalError::ParametroInvalido {
            campo: "creatinina".to_string(),
            valor: creatinina,
            motivo: "A creatinina sérica deve estar em faixa clinicamente compatível (> 0.0 e <= 30.0 mg/dL).".to_string(),
        });
    }

    if idade < 18 || idade > 125 {
        return Err(ClinicalError::ParametroInvalido {
            campo: "idade".to_string(),
            valor: idade as f64,
            motivo: "A equação CKD-EPI 2021 é validada estritamente para indivíduos adultos (>= 18 anos).".to_string(),
        });
    }

    let (kappa, alpha, multiplicador_sexo) = if sexo_feminino {
        (0.7, -0.241, 1.012)
    } else {
        (0.9, -0.302, 1.0)
    };

    let razao_creatinina = creatinina / kappa;
    let min_val = razao_creatinina.min(1.0);
    let max_val = razao_creatinina.max(1.0);

    let termo_min = min_val.powf(alpha);
    let termo_max = max_val.powf(-1.200);
    let termo_idade = (0.9938_f64).powf(idade as f64);

    let tfg = 142.0 * termo_min * termo_max * termo_idade * multiplicador_sexo;

    Ok((tfg * 100.0).round() / 100.0)
}

/// Estimativa do clearance de creatinina pela fórmula clássica de Cockcroft-Gault (1976),
/// amplamente utilizada para ajustes de dosagem em bulas farmacêuticas da ANVISA e FDA.
///
/// Parâmetros:
/// - creatinina: creatinina sérica em mg/dL
/// - peso_kg: peso corporal total em quilogramas
/// - idade: idade do paciente em anos (>= 18)
/// - sexo_feminino: true se sexo feminino (fator 0.85), false se masculino
pub fn calcular_clearance_cockcroft_gault(
    creatinina: f64,
    peso_kg: f64,
    idade: u32,
    sexo_feminino: bool,
) -> Result<f64, ClinicalError> {
    if creatinina <= 0.0 || creatinina > 30.0 {
        return Err(ClinicalError::ParametroInvalido {
            campo: "creatinina".to_string(),
            valor: creatinina,
            motivo: "A creatinina sérica deve ser maior que zero e fisiologicamente aceitável.".to_string(),
        });
    }

    if peso_kg <= 0.0 || peso_kg > 400.0 {
        return Err(ClinicalError::ParametroInvalido {
            campo: "peso_kg".to_string(),
            valor: peso_kg,
            motivo: "O peso do paciente deve ser positivo e clinicamente factível.".to_string(),
        });
    }

    if idade < 18 || idade > 125 {
        return Err(ClinicalError::ParametroInvalido {
            campo: "idade".to_string(),
            valor: idade as f64,
            motivo: "Cockcroft-Gault é validado para adultos (>= 18 anos).".to_string(),
        });
    }

    let fator_sexo = if sexo_feminino { 0.85 } else { 1.0 };
    let numerador = (140.0 - idade as f64) * peso_kg;
    let denominador = 72.0 * creatinina;

    let clearance = (numerador / denominador) * fator_sexo;

    Ok((clearance * 100.0).round() / 100.0)
}

/// Avalia a TFG e classifica o estágio da Doença Renal Crônica (DRC) conforme KDIGO.
pub fn avaliar_estagio_drc(tfg: f64) -> ResultadoTfg {
    let (estagio, recomendacao) = if tfg >= 90.0 {
        ("G1 - Função renal normal ou elevada", "Função normal. Acompanhamento anual de rotina.")
    } else if tfg >= 60.0 {
        ("G2 - Levemente diminuída", "Leve redução. Monitorar fatores de risco cardiovascular e albuminúria.")
    } else if tfg >= 45.0 {
        ("G3a - Leve a moderadamente diminuída", "Atenção a medicamentos nefrotóxicos e ajuste inicial de posologia.")
    } else if tfg >= 30.0 {
        ("G3b - Moderada a gravemente diminuída", "Ajuste obrigatório de doses (ex: metformina máx 500mg). Encaminhar ao nefrologista.")
    } else if tfg >= 15.0 {
        ("G4 - Gravemente diminuída", "Contraindicação de diversos fármacos (metformina, IECA/BRA em hipercalemia). Preparo para terapia renal substitutiva.")
    } else {
        ("G5 - Falência renal terminal", "Terapia renal substitutiva (hemodiálise / diálise peritoneal) ou transplante renal.")
    };

    ResultadoTfg {
        taxa_filtracao_glomerular: tfg,
        estagio_drc: estagio.to_string(),
        metodo_utilizado: "CKD-EPI 2021 (sem viés racial)".to_string(),
        recomendacao_geral: recomendacao.to_string(),
    }
}

/// Escore CURB-65 para estratificação de risco de mortalidade na Pneumonia Adquirida na Comunidade (PAC).
/// Retorna pontuação inteira entre 0 e 5.
pub fn calcular_escore_curb65(
    confusao: bool,
    ureia_maior_50: bool,
    fr_maior_30: bool,
    hipotensao: bool,
    idade_maior_65: bool,
) -> u8 {
    let mut escore: u8 = 0;
    if confusao {
        escore += 1;
    }
    if ureia_maior_50 {
        escore += 1;
    }
    if fr_maior_30 {
        escore += 1;
    }
    if hipotensao {
        escore += 1;
    }
    if idade_maior_65 {
        escore += 1;
    }
    escore
}

/// Avaliação detalhada do CURB-65 com recomendações de conduta e local de tratamento.
pub fn avaliar_curb65_detalhado(
    confusao: bool,
    ureia_maior_50: bool,
    fr_maior_30: bool,
    hipotensao: bool,
    idade_maior_65: bool,
) -> ResultadoCurb65 {
    let pontuacao = calcular_escore_curb65(
        confusao,
        ureia_maior_50,
        fr_maior_30,
        hipotensao,
        idade_maior_65,
    );

    let (estrato, local) = match pontuacao {
        0 | 1 => (
            "Baixo risco (mortalidade estimada < 3%)",
            "Tratamento ambulatorial com antibioticoterapia oral e reavaliação clínica em 48-72h.",
        ),
        2 => (
            "Risco intermediário (mortalidade estimada de ~9%)",
            "Considerar internação em enfermaria ou supervisão ambulatorial estrita com observação inicial.",
        ),
        _ => (
            "Alto risco (mortalidade estimada de 15% a 40%)",
            "Internação hospitalar imediata em enfermaria ou UTI. Se pontuação >= 4, avaliar suporte de terapia intensiva.",
        ),
    };

    ResultadoCurb65 {
        pontuacao,
        estrato_mortalidade: estrato.to_string(),
        recomendacao_local_tratamento: local.to_string(),
    }
}

/// Escore de Wells para estratificação de probabilidade pré-teste de Tromboembolismo Pulmonar (TEP).
pub fn calcular_escore_wells_tep(
    sinais_clinicos_tvp: bool,
    diagnostico_alternativo_menos_provavel: bool,
    fc_maior_100: bool,
    imobilizacao_ou_cirurgia_recente: bool,
    historico_previo_tep_tvp: bool,
    hemoptise: bool,
    malignidade_ativa: bool,
) -> ResultadoWells {
    let mut pontos: f64 = 0.0;

    if sinais_clinicos_tvp {
        pontos += 3.0;
    }
    if diagnostico_alternativo_menos_provavel {
        pontos += 3.0;
    }
    if fc_maior_100 {
        pontos += 1.5;
    }
    if imobilizacao_ou_cirurgia_recente {
        pontos += 1.5;
    }
    if historico_previo_tep_tvp {
        pontos += 1.5;
    }
    if hemoptise {
        pontos += 1.0;
    }
    if malignidade_ativa {
        pontos += 1.0;
    }

    let (categoria, percentual, conduta) = if pontos < 2.0 {
        (
            "Baixa probabilidade clínica",
            "< 10%",
            "Aplicar critérios PERC se disponíveis ou solicitar D-Dímero de alta sensibilidade para descarte.",
        )
    } else if pontos <= 6.0 {
        (
            "Moderada probabilidade clínica",
            "20% a 40%",
            "Solicitar D-Dímero. Se positivo, realizar Angiotomografia de Artérias Pulmonares (Angio-TC).",
        )
    } else {
        (
            "Alta probabilidade clínica",
            "> 65%",
            "Indicação formal de Angiotomografia Computadorizada de Tórax imediata. Iniciar anticoagulação empírica se não houver contraindicação.",
        )
    };

    ResultadoWells {
        pontuacao_total: pontos,
        categoria_risco: categoria.to_string(),
        probabilidade_clinica_percentual: percentual.to_string(),
        conduta_propedêutica: conduta.to_string(),
    }
}

/// Cálculo determinístico da taxa de infusão intravenosa contínua para drogas vasoativas
/// (como noradrenalina, dopamina, dobutamina e nitroprussiato).
///
/// Parâmetros:
/// - dose_mcg_kg_min: dose alvo em microgramas por quilograma por minuto (mcg/kg/min)
/// - peso_kg: peso corporal do paciente em kg
/// - concentracao_mg_ml: concentração da solução preparada em mg/mL (ex: 16mg/250mL = 0.064 mg/mL)
///
/// Retorna a velocidade programável na bomba de infusão em mililitros por hora (mL/h).
pub fn calcular_vazao_infusao(
    dose_mcg_kg_min: f64,
    peso_kg: f64,
    concentracao_mg_ml: f64,
) -> Result<f64, ClinicalError> {
    if dose_mcg_kg_min <= 0.0 {
        return Err(ClinicalError::ParametroInvalido {
            campo: "dose_mcg_kg_min".to_string(),
            valor: dose_mcg_kg_min,
            motivo: "A dose alvo de infusão deve ser estritamente positiva.".to_string(),
        });
    }

    if peso_kg <= 0.0 || peso_kg > 400.0 {
        return Err(ClinicalError::ParametroInvalido {
            campo: "peso_kg".to_string(),
            valor: peso_kg,
            motivo: "O peso do paciente deve ser válido e positivo.".to_string(),
        });
    }

    if concentracao_mg_ml <= 0.0 {
        return Err(ClinicalError::ConcentracaoInvalida {
            valor: concentracao_mg_ml,
        });
    }

    // Fórmula: Vazão (mL/h) = [Dose (mcg/kg/min) * Peso (kg) * 60 min/h] / [Concentração (mg/mL) * 1000 mcg/mg]
    let dose_horaria_mcg = dose_mcg_kg_min * peso_kg * 60.0;
    let concentracao_mcg_ml = concentracao_mg_ml * 1000.0;
    let vazao_ml_h = dose_horaria_mcg / concentracao_mcg_ml;

    Ok((vazao_ml_h * 100.0).round() / 100.0)
}
