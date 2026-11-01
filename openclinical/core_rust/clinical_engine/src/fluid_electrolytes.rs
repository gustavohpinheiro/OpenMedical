//! Módulo de Hidratação, Eletrólitos Avançados, Dengue MS, Parkland e Distúrbios Metabólicos.
//!
//! Todas as fórmulas seguem estritamente as diretrizes do Ministério da Saúde (Dengue 6ª Ed.),
//! ATLS 10ª Edição / SBQ (Parkland), ADA/SBD (CAD) e KDIGO (Injúria Renal Aguda).

use crate::errors::ClinicalError;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ResultadoDengueMs {
    pub grupo: String,
    pub classificacao_risco: String,
    pub volume_total_dia_ml: f64,
    pub volume_sro_ml: f64,
    pub volume_outros_liquidos_ml: f64,
    pub fase_expansao_imediata_ml: f64,
    pub tempo_infusao_expansao_horas: f64,
    pub vazao_expansao_ml_h: f64,
    pub vazao_manutencao_ml_h: f64,
    pub orientacao_clinica: String,
    pub criterios_alarme_presentes: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ResultadoParkland {
    pub peso_kg: f64,
    pub percentual_scq: f64,
    pub volume_total_24h_parkland_ml: f64,
    pub volume_total_24h_atls10_ml: f64,
    pub volume_primeira_fase_ml: f64,
    pub horas_primeira_fase: f64,
    pub vazao_primeira_fase_ml_h: f64,
    pub volume_segunda_fase_ml: f64,
    pub vazao_segunda_fase_ml_h: f64,
    pub meta_diurese_ml_h: String,
    pub conduta_resfriamento_e_acesso: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ResultadoMetabolicoCad {
    pub sodio_medido: f64,
    pub glicemia_mg_dl: f64,
    pub sodio_corrigido_katz: f64,
    pub sodio_corrigido_hillier: f64,
    pub osmolaridade_efetiva_m_osm_kg: f64,
    pub classificacao_osmolaridade: String,
    pub calcio_total_medido: f64,
    pub albumina_medida: f64,
    pub calcio_corrigido_payne: f64,
    pub potassio_medido: f64,
    pub conduta_insulina_e_potassio: String,
    pub alerta_critico_bloqueio_insulina: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ResultadoFenaFeureia {
    pub fena_percentual: Option<f64>,
    pub feureia_percentual: Option<f64>,
    pub diagnostico_provavel: String,
    pub interpretacao_clinica: String,
    pub ressalva_diuretico: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ResultadoPamPpc {
    pub pas_mmhg: f64,
    pub pad_mmhg: f64,
    pub pam_mmhg: f64,
    pub pic_mmhg: Option<f64>,
    pub ppc_mmhg: Option<f64>,
    pub classificacao_hemodinamica: String,
    pub alvo_terapeutico: String,
}

/// Classificação e Conduta Volêmica na Dengue conforme a 6ª Edição do Ministério da Saúde.
pub fn calcular_manejo_dengue_ms(
    peso_kg: f64,
    sinais_alarme: bool,
    sinais_choque_ou_sangramento_grave: bool,
    condicao_especial_ou_plaquetopenia: bool,
    idade_anos: Option<f64>,
) -> Result<ResultadoDengueMs, ClinicalError> {
    if peso_kg < 2.0 || peso_kg > 300.0 {
        return Err(ClinicalError::ParametroInvalido {
            campo: "peso_kg".to_string(),
            valor: peso_kg,
            motivo: "Peso deve estar entre 2.0 e 300.0 kg.".to_string(),
        });
    }

    let eh_pediatrico = idade_anos.is_some_and(|i| i < 13.0);

    // Determina o Grupo de Gravidade do Ministério da Saúde (A, B, C ou D)
    let (grupo, classif, alarme_criticos) = if sinais_choque_ou_sangramento_grave {
        (
            "D".to_string(),
            "Dengue Grave (Choque / Sangramento Vultoso / Disfunção Orgânica)".to_string(),
            vec![
                "Hipotensão / Pressão arterial convergente (PAM < 20 mmHg de diferencial)".to_string(),
                "Enchimento capilar lentificado (> 2 segundos) e extremidades frias".to_string(),
                "Sangramento gastrointestinal grave ou coagulopatia de consumo".to_string(),
            ],
        )
    } else if sinais_alarme {
        (
            "C".to_string(),
            "Dengue com Sinais de Alarme (Extravasamento Plasmático Iminente)".to_string(),
            vec![
                "Dor abdominal intensa (referida ou à palpação) e contínua".to_string(),
                "Vômitos persistentes, lipotimia ou hipotensão postural".to_string(),
                "Hepatomegalia dolorosa > 2 cm abaixo do rebordo costal".to_string(),
                "Aumento progressivo do hematócrito e queda abrupta de plaquetas".to_string(),
            ],
        )
    } else if condicao_especial_ou_plaquetopenia {
        (
            "B".to_string(),
            "Dengue com Condições Especiais, Risco Social ou Prova do Laço Positiva".to_string(),
            vec!["Gestante, idoso (> 65 anos), menor de 2 anos, cardiopata, DRC ou plaquetas < 100.000/mm³".to_string()],
        )
    } else {
        (
            "A".to_string(),
            "Dengue Clássica sem Sinais de Alarme ou Comorbidades Descompensadas".to_string(),
            vec![],
        )
    };

    // Cálculos de Volume conforme Diretrizes MS
    let volume_total_dia = if eh_pediatrico {
        let p = peso_kg;
        if p <= 10.0 {
            p * 130.0
        } else if p <= 20.0 {
            1000.0 + (p - 10.0) * 50.0
        } else {
            1500.0 + (p - 20.0) * 20.0
        }
    } else {
        60.0 * peso_kg
    };

    let volume_sro = ((volume_total_dia / 3.0) * 100.0).round() / 100.0;
    let volume_outros = ((volume_total_dia * 2.0 / 3.0) * 100.0).round() / 100.0;

    let (fase_expansao, tempo_expansao_h, vazao_expansao, vazao_manutencao, orientacao) = match grupo.as_str() {
        "D" => {
            let exp = 20.0 * peso_kg; // 20 mL/kg em 20 min
            let tempo_h = 20.0 / 60.0; // 0.333 h
            let vazao = (exp / tempo_h * 10.0).round() / 10.0;
            let orient = "EMERGÊNCIA SALA VERMELHA: Ressuscitação volêmica imediata com 20 mL/kg de SF 0.9% ou Ringer Lactato em 20 minutos. Reavaliar hematócrito e sinais de choque; se refratário após 3 expansões, avaliar drogas vasoativas (Noradrenalina). Leito de UTI obrigatório.".to_string();
            (exp, tempo_h, vazao, (25.0 * peso_kg) / 6.0, orient)
        }
        "C" => {
            let exp = 10.0 * peso_kg; // 10 mL/kg em 1 hora
            let tempo_h = 1.0;
            let vazao = exp;
            let vazao_manut = (25.0 * peso_kg) / 6.0; // 25 mL/kg em 6h
            let orient = "INTERNAÇÃO HOSPITALAR OBRIGATÓRIA (Leito de Observação/Enfermaria): Fase de expansão rápida parenteral imediata de 10 mL/kg de SF 0.9% IV em 1 hora. Reavaliar paciente e hematócrito. Se melhora, iniciar fase de manutenção com 25 mL/kg em 6 horas, seguida de 25 mL/kg em 8 horas. Meta de diurese >= 1 mL/kg/h.".to_string();
            (exp, tempo_h, vazao, (vazao_manut * 10.0).round() / 10.0, orient)
        }
        "B" => {
            let orient = "LEITO DE OBSERVAÇÃO / UPA: Hidratação oral supervisionada no serviço de saúde enquanto aguarda resultado de hemograma completo. Coleta de hemograma obrigatória. Se hematócrito normal, alta com reavaliação clínica em 24h. Se hemoconcentração presente, migrar para manejo parenteral do Grupo C.".to_string();
            (0.0, 0.0, 0.0, 0.0, orient)
        }
        _ => {
            let orient = "TRATAMENTO AMBULATORIAL / DOMICILIAR: Hidratação oral precoce e abundante. Orientar ingestão de 1/3 do volume total com SRO e 2/3 com água, sucos e água de coco. Contraindicar formalmente AINEs e AAS (risco hemorrágico). Orientar retorno imediato se surgirem sinais de alarme.".to_string();
            (0.0, 0.0, 0.0, 0.0, orient)
        }
    };

    Ok(ResultadoDengueMs {
        grupo,
        classificacao_risco: classif,
        volume_total_dia_ml: (volume_total_dia * 100.0).round() / 100.0,
        volume_sro_ml: volume_sro,
        volume_outros_liquidos_ml: volume_outros,
        fase_expansao_imediata_ml: (fase_expansao * 10.0).round() / 10.0,
        tempo_infusao_expansao_horas: tempo_expansao_h,
        vazao_expansao_ml_h: vazao_expansao,
        vazao_manutencao_ml_h: vazao_manutencao,
        orientacao_clinica: orientacao,
        criterios_alarme_presentes: alarme_criticos,
    })
}

/// Fórmula de Parkland e Consenso ATLS 10ª Edição para Ressuscitação Volêmica em Grandes Queimados.
pub fn calcular_parkland_queimado(
    peso_kg: f64,
    percentual_scq: f64,
    horas_desde_queimadura: f64,
) -> Result<ResultadoParkland, ClinicalError> {
    if peso_kg < 2.0 || peso_kg > 300.0 {
        return Err(ClinicalError::ParametroInvalido {
            campo: "peso_kg".to_string(),
            valor: peso_kg,
            motivo: "Peso deve estar entre 2.0 e 300.0 kg.".to_string(),
        });
    }

    if percentual_scq <= 0.0 || percentual_scq > 100.0 {
        return Err(ClinicalError::ParametroInvalido {
            campo: "percentual_scq".to_string(),
            valor: percentual_scq,
            motivo: "Percentual de Superfície Corporal Queimada (SCQ 2º e 3º graus) deve ser entre 0.1% e 100%.".to_string(),
        });
    }

    if horas_desde_queimadura < 0.0 || horas_desde_queimadura >= 24.0 {
        return Err(ClinicalError::ParametroInvalido {
            campo: "horas_desde_queimadura".to_string(),
            valor: horas_desde_queimadura,
            motivo: "O tempo decorrido desde o momento da queimadura deve ser entre 0 e 24 horas.".to_string(),
        });
    }

    // Volume Parkland clássico: 4 mL * kg * %SCQ
    let vol_parkland = 4.0 * peso_kg * percentual_scq;
    // Consenso ATLS 10 para queimaduras térmicas em adultos: 2 mL * kg * %SCQ
    let vol_atls = 2.0 * peso_kg * percentual_scq;

    // Metade do volume total deve ser administrada nas primeiras 8 horas desde o trauma
    let horas_restantes_fase1 = (8.0 - horas_desde_queimadura).max(1.0);
    let vol_fase1 = vol_parkland * 0.5;
    let vazao_fase1 = vol_fase1 / horas_restantes_fase1;

    let vol_fase2 = vol_parkland * 0.5;
    let vazao_fase2 = vol_fase2 / 16.0;

    let meta_diurese = if peso_kg < 30.0 {
        "1.0 a 1.5 mL/kg/h (Crianças < 30 kg)".to_string()
    } else {
        "0.5 mL/kg/h (30 a 50 mL/h em adultos; aumentar para 75 a 100 mL/h se queimadura elétrica por risco de mioglobinúria)".to_string()
    };

    let conduta = "Solução de escolha: Ringer Lactato aquecido. Obter 2 acessos venosos periféricos calibrosos em área não queimada (ou intraósseo/CVC). Sondagem vesical de demora para controle horário de diurese. Analgesia potente com opioides IV.".to_string();

    Ok(ResultadoParkland {
        peso_kg,
        percentual_scq,
        volume_total_24h_parkland_ml: (vol_parkland * 10.0).round() / 10.0,
        volume_total_24h_atls10_ml: (vol_atls * 10.0).round() / 10.0,
        volume_primeira_fase_ml: (vol_fase1 * 10.0).round() / 10.0,
        horas_primeira_fase: horas_restantes_fase1,
        vazao_primeira_fase_ml_h: (vazao_fase1 * 10.0).round() / 10.0,
        volume_segunda_fase_ml: (vol_fase2 * 10.0).round() / 10.0,
        vazao_segunda_fase_ml_h: (vazao_fase2 * 10.0).round() / 10.0,
        meta_diurese_ml_h: meta_diurese,
        conduta_resfriamento_e_acesso: conduta,
    })
}

/// Sódio Corrigido (Katz e Hillier), Osmolaridade Efetiva, Cálcio Corrigido (Payne) e Manejo de K+ na CAD.
pub fn calcular_metabolico_cad_calemia(
    sodio: f64,
    glicemia_mg_dl: f64,
    potassio: f64,
    calcio_total: f64,
    albumina: f64,
) -> Result<ResultadoMetabolicoCad, ClinicalError> {
    if sodio < 80.0 || sodio > 200.0 {
        return Err(ClinicalError::ParametroInvalido {
            campo: "sodio".to_string(),
            valor: sodio,
            motivo: "Sódio sérico deve estar entre 80 e 200 mEq/L.".to_string(),
        });
    }

    if glicemia_mg_dl < 20.0 || glicemia_mg_dl > 2500.0 {
        return Err(ClinicalError::ParametroInvalido {
            campo: "glicemia_mg_dl".to_string(),
            valor: glicemia_mg_dl,
            motivo: "Glicemia deve estar entre 20 e 2500 mg/dL.".to_string(),
        });
    }

    if potassio < 1.0 || potassio > 10.0 {
        return Err(ClinicalError::ParametroInvalido {
            campo: "potassio".to_string(),
            valor: potassio,
            motivo: "Potássio sérico deve estar entre 1.0 e 10.0 mEq/L.".to_string(),
        });
    }

    if albumina <= 0.0 || albumina > 8.0 {
        return Err(ClinicalError::ParametroInvalido {
            campo: "albumina".to_string(),
            valor: albumina,
            motivo: "Albumina deve estar entre 0.1 e 8.0 g/dL.".to_string(),
        });
    }

    let delta_glicemia = (glicemia_mg_dl - 100.0).max(0.0) / 100.0;
    let na_katz = sodio + 1.6 * delta_glicemia;
    let na_hillier = sodio + 2.4 * delta_glicemia;

    // Osmolaridade efetiva = 2 * Na_medido + Glicemia / 18
    let osm_efetiva = (2.0 * sodio) + (glicemia_mg_dl / 18.0);
    let classif_osm = if osm_efetiva > 320.0 {
        "Hiperosmolaridade Grave (Sugerindo Estado Hiperglicêmico Hiperosmolar - EHH)".to_string()
    } else if osm_efetiva >= 295.0 {
        "Osmolaridade Plasmática Elevada".to_string()
    } else if osm_efetiva >= 275.0 {
        "Osmolaridade Plasmática Normal (275 a 295 mOsm/kg)".to_string()
    } else {
        "Hipo-osmolaridade Plasmática (< 275 mOsm/kg)".to_string()
    };

    // Cálcio corrigido de Payne = Cálcio Total + 0.8 * (4.0 - Albumina)
    let ca_corr = calcio_total + 0.8 * (4.0 - albumina);

    // Protocolo de Segurança para K+ e Insulina na CAD (ADA / SBD)
    let (conduta_k, bloqueio_insulina) = if potassio < 3.3 {
        (
            "ALERTA CRÍTICO: NÃO INICIAR INSULINA! O potássio está < 3.3 mEq/L. A infusão de insulina causará influxo maciço de K+ para o meio intracelular, provocando arritmias letais ou PCR. Conduta: Repor 20 a 40 mEq/h de KCl IV até K+ >= 3.3 mEq/L antes de liberar insulina.".to_string(),
            true,
        )
    } else if potassio <= 5.2 {
        (
            "POTÁSSIO EM FAIXA DE REPOSIÇÃO (3.3 a 5.2 mEq/L): Iniciar infusão contínua de Insulina Regular (0.1 U/kg/h) E adicionar 20 a 30 mEq de KCl por litro de soro de hidratação (1 ampola de 10 mL de KCl 19.1% contém 25.6 mEq) para manter calemia entre 4.0 e 5.0 mEq/L.".to_string(),
            false,
        )
    } else {
        (
            "HIPERCALEMIA (K+ > 5.2 mEq/L): Iniciar infusão de Insulina Regular sem reposição inicial de KCl. Monitorar K+ sérico de 2 em 2 horas. Quando K+ cair abaixo de 5.2 mEq/L, associar reposição de KCl.".to_string(),
            false,
        )
    };

    Ok(ResultadoMetabolicoCad {
        sodio_medido: sodio,
        glicemia_mg_dl,
        sodio_corrigido_katz: (na_katz * 10.0).round() / 10.0,
        sodio_corrigido_hillier: (na_hillier * 10.0).round() / 10.0,
        osmolaridade_efetiva_m_osm_kg: (osm_efetiva * 10.0).round() / 10.0,
        classificacao_osmolaridade: classif_osm,
        calcio_total_medido: calcio_total,
        albumina_medida: albumina,
        calcio_corrigido_payne: (ca_corr * 10.0).round() / 10.0,
        potassio_medido: potassio,
        conduta_insulina_e_potassio: conduta_k,
        alerta_critico_bloqueio_insulina: bloqueio_insulina,
    })
}

/// FENa (Fração de Excreção de Sódio) e FEUreia para Diagnóstico Diferencial de Injúria Renal Aguda.
pub fn calcular_fena_feureia(
    na_plasmatico: f64,
    cr_plasmatica: f64,
    ureia_plasmatica: f64,
    na_urinario: f64,
    cr_urinaria: f64,
    ureia_urinaria: Option<f64>,
    usa_diuretico: bool,
) -> Result<ResultadoFenaFeureia, ClinicalError> {
    if na_plasmatico <= 0.0 || cr_plasmatica <= 0.0 || cr_urinaria <= 0.0 {
        return Err(ClinicalError::ParametroInvalido {
            campo: "cr_plasmatica / cr_urinaria".to_string(),
            valor: cr_plasmatica,
            motivo: "Concentrações plasmáticas e urinárias de creatinina e sódio devem ser maiores que zero.".to_string(),
        });
    }

    let fena = ((na_urinario * cr_plasmatica) / (na_plasmatico * cr_urinaria)) * 100.0;

    let feureia = if let Some(u_u) = ureia_urinaria {
        if ureia_plasmatica > 0.0 {
            Some(((u_u * cr_plasmatica) / (ureia_plasmatica * cr_urinaria)) * 100.0)
        } else {
            None
        }
    } else {
        None
    };

    let (diag, interp, ressalva) = if usa_diuretico {
        let ressalva_txt = "ATENÇÃO: O uso recente de diuréticos de alça (Furosemida) ou tiazídicos invalida a interpretação da FENa, pois induz natriurese farmacológica forçada. A FEUreia é o parâmetro de escolha nesta situação.".to_string();
        if let Some(fe_u) = feureia {
            if fe_u <= 35.0 {
                (
                    "IRA Pré-Renal (Compatível pela FEUreia <= 35%)".to_string(),
                    format!("FEUreia de {:.1}% (< 35%) indica preservação da reabsorção tubular proximal de ureia, consistente com hipoperfusão renal (IRA pré-renal), a despeito do diurético.", fe_u),
                    Some(ressalva_txt),
                )
            } else if fe_u > 50.0 {
                (
                    "Injúria Renal Intrínseca / NTA (Compatível pela FEUreia > 50%)".to_string(),
                    format!("FEUreia de {:.1}% (> 50%) indica incapacidade tubular de reabsorção, compatível com necrose tubular aguda (NTA) ou lesão intrínseca.", fe_u),
                    Some(ressalva_txt),
                )
            } else {
                (
                    "Padrão Indeterminado (FEUreia entre 35% e 50%)".to_string(),
                    format!("FEUreia de {:.1}% em faixa intermediária. Correlacionar com resposta a prova volêmica e sedimento urinário.", fe_u),
                    Some(ressalva_txt),
                )
            }
        } else {
            (
                "Avaliação Prejudicada por Diurético (Necessita FEUreia)".to_string(),
                "Como o paciente usa diurético, solicite dosagem de ureia urinária para cálculo da FEUreia, pois a FENa está artificialmente elevada.".to_string(),
                Some(ressalva_txt),
            )
        }
    } else if fena < 1.0 {
        (
            "IRA Pré-Renal (FENa < 1.0%)".to_string(),
            format!("FENa de {:.2}% (< 1.0%) indica integridade da função tubular renal com avidex na reabsorção de sódio e água em resposta à hipovolemia ou redução do débito cardíaco. Conduta: Otimizar volume/perfusão.", fena),
            None,
        )
    } else if fena > 2.0 {
        (
            "Injúria Renal Intrínseca / Necrose Tubular Aguda (FENa > 2.0%)".to_string(),
            format!("FENa de {:.2}% (> 2.0%) indica lesão das células tubulares com incapacidade de reter sódio, típica de NTA isquêmica ou tóxica (contrastes, sepse, aminoglicosídeos). Evitar hipervolemia iatrogênica.", fena),
            None,
        )
    } else {
        (
            "Zona Cinzenta / Indeterminado (FENa entre 1.0% e 2.0%)".to_string(),
            format!("FENa de {:.2}% em zona indeterminada. Pode ocorrer em glomerulonefrite aguda, NTA precoce ou sobreposição pré-renal. Avaliar sedimento urinário e clínica.", fena),
            None,
        )
    };

    Ok(ResultadoFenaFeureia {
        fena_percentual: Some((fena * 100.0).round() / 100.0),
        feureia_percentual: feureia.map(|v| (v * 100.0).round() / 100.0),
        diagnostico_provavel: diag,
        interpretacao_clinica: interp,
        ressalva_diuretico: ressalva,
    })
}

/// Pressão Arterial Média (PAM) e Pressão de Perfusão Cerebral (PPC).
pub fn calcular_pam_ppc(
    pas: f64,
    pad: f64,
    pic: Option<f64>,
) -> Result<ResultadoPamPpc, ClinicalError> {
    if pas <= pad || pas < 30.0 || pas > 300.0 || pad < 10.0 {
        return Err(ClinicalError::ParametroInvalido {
            campo: "pas / pad".to_string(),
            valor: pas,
            motivo: "A pressão sistólica deve ser maior que a diastólica e em limites fisiológicos.".to_string(),
        });
    }

    let pam = (2.0 * pad + pas) / 3.0;

    let (ppc, classif, alvo) = if let Some(p_ic) = pic {
        if p_ic < 0.0 || p_ic > 100.0 {
            return Err(ClinicalError::ParametroInvalido {
                campo: "pic".to_string(),
                valor: p_ic,
                motivo: "PIC deve estar entre 0 e 100 mmHg.".to_string(),
            });
        }
        let calc_ppc = pam - p_ic;
        let c = if calc_ppc < 60.0 {
            "HIPOPERFUSÃO CEREBRAL CRÍTICA (PPC < 60 mmHg) - Risco de isquemia secundária".to_string()
        } else if calc_ppc <= 70.0 {
            "PPC Otimizada para Neuroproteção (60 a 70 mmHg)".to_string()
        } else {
            "PPC Elevada (> 70 mmHg) - Evitar hiperperfusão/edema cerebral se autorregulação perdida".to_string()
        };
        let a = "Meta em Neurointensivismo / TCE Grave: manter PPC entre 60 e 70 mmHg e PIC < 22 mmHg (Brain Trauma Foundation).".to_string();
        (Some((calc_ppc * 10.0).round() / 10.0), c, a)
    } else {
        let c = if pam < 65.0 {
            "Hipotensão com Hipoperfusão Tecidual (PAM < 65 mmHg)".to_string()
        } else if pam <= 100.0 {
            "PAM Normal / Adequada para Perfusão Sistêmica".to_string()
        } else {
            "PAM Elevada / Hipertensão Sistêmica".to_string()
        };
        let a = "Meta no Choque Séptico / Hemodinâmico: PAM >= 65 mmHg (Surviving Sepsis Campaign).".to_string();
        (None, c, a)
    };

    Ok(ResultadoPamPpc {
        pas_mmhg: pas,
        pad_mmhg: pad,
        pam_mmhg: (pam * 10.0).round() / 10.0,
        pic_mmhg: pic,
        ppc_mmhg: ppc,
        classificacao_hemodinamica: classif,
        alvo_terapeutico: alvo,
    })
}
