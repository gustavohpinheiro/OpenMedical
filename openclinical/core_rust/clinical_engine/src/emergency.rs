use crate::errors::ClinicalError;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ItemFarmacoEmergencia {
    pub classe: String,               // "Pré-tratamento", "Indutor", "Bloqueador Neuromuscular"
    pub nome_farmaco: String,         // Ex: "Etomidato"
    pub apresentacao_ampola: String,  // Ex: "2 mg/mL (Ampola 10 mL)"
    pub dose_mg_kg: f64,              // Ex: 0.3
    pub dose_total_mg: f64,           // Ex: 24.0
    pub volume_administrar_ml: f64,   // Ex: 12.0
    pub recomendado_perfil: bool,     // true se for a 1ª escolha para o perfil hemodinâmico
    pub observacao_clinica: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ParametrosVentilacaoInicial {
    pub peso_predito_kg: f64,
    pub volume_corrente_ml: f64,      // 6.0 * peso_predito_kg (arredondado para inteiro)
    pub peep_sugerida_cmh2o: u8,      // 5 a 8 cmH2O
    pub fr_sugerida_irpm: u8,         // 14 a 18 irpm
    pub fio2_inicial_percentual: u8,  // 100
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ResultadoIntubacaoSri {
    pub peso_real_kg: f64,
    pub perfil_hemodinamico: String,  // "padrao", "choque_instavel", "neuroprotecao_tce", "broncoespasmo_grave"
    pub farmacos: Vec<ItemFarmacoEmergencia>,
    pub ventilacao: ParametrosVentilacaoInicial,
    pub checklist_7ps: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ResultadoEmergenciaPediatrica {
    pub peso_kg: f64,
    pub idade_anos: f64,
    pub tubo_com_cuff_mm: f64,        // (idade / 4.0) + 3.5 (arredondado em passos de 0.5)
    pub tubo_sem_cuff_mm: f64,        // (idade / 4.0) + 4.0 (arredondado em passos de 0.5)
    pub fixacao_rima_labial_cm: f64,  // 3.0 * tubo_com_cuff_mm
    pub lamina_laringoscopio: String,
    pub carga_desfibrilacao_1_j: f64, // 2.0 * peso_kg (máx 200 J)
    pub carga_desfibrilacao_2_j: f64, // 4.0 * peso_kg (máx 200 J)
    pub adrenalina_pcr_mg: f64,       // 0.01 * peso_kg (máx 1.0 mg)
    pub adrenalina_diluida_1_10000_ml: f64, // 0.1 * peso_kg (máx 10.0 mL de solução 1mL+9mL AD)
    pub expansao_cristaloide_20ml_kg: f64,  // 20.0 * peso_kg
}

/// Calcula doses e volumes para Intubação em Sequência Rápida (ISR / SRI) e ventilação mecânica protetora ARDSNet.
pub fn calcular_intubacao_sri(
    peso_kg: f64,
    altura_cm: f64,
    sexo_feminino: bool,
    perfil: &str,
) -> Result<ResultadoIntubacaoSri, ClinicalError> {
    if !(3.0..=300.0).contains(&peso_kg) {
        return Err(ClinicalError::ParametroInvalido {
            campo: "peso_kg".to_string(),
            valor: peso_kg,
            motivo: "Peso do paciente deve estar entre 3.0 e 300.0 kg.".to_string(),
        });
    }

    if !(50.0..=250.0).contains(&altura_cm) {
        return Err(ClinicalError::ParametroInvalido {
            campo: "altura_cm".to_string(),
            valor: altura_cm,
            motivo: "Altura deve estar entre 50.0 e 250.0 cm.".to_string(),
        });
    }

    // Fórmula ARDSNet de Peso Predito (Ideal Body Weight)
    let peso_predito = if sexo_feminino {
        45.5 + 0.91 * (altura_cm - 152.4)
    } else {
        50.0 + 0.91 * (altura_cm - 152.4)
    };
    let peso_predito_final = if peso_predito < 15.0 {
        peso_kg
    } else {
        (peso_predito * 10.0).round() / 10.0
    };

    let volume_corrente = (6.0 * peso_predito_final).round();

    let mut farmacos = Vec::new();
    let perfil_norm = perfil.trim().to_lowercase();

    // 1. Fentanil (0.05 mg/mL = 50 mcg/mL)
    let fentanil_dose_mg_kg = 0.002; // 2 mcg/kg
    let fentanil_dose_total = (peso_kg * fentanil_dose_mg_kg * 1000.0).round() / 1000.0;
    let fentanil_vol = (fentanil_dose_total / 0.05 * 10.0).round() / 10.0;
    let fentanil_rec = perfil_norm == "neuroprotecao_tce" || perfil_norm == "padrao";
    farmacos.push(ItemFarmacoEmergencia {
        classe: "Pré-tratamento / Analgesia".to_string(),
        nome_farmaco: "Fentanil".to_string(),
        apresentacao_ampola: "50 mcg/mL (0.05 mg/mL) - Ampola 2 mL ou 10 mL".to_string(),
        dose_mg_kg: fentanil_dose_mg_kg,
        dose_total_mg: fentanil_dose_total,
        volume_administrar_ml: fentanil_vol,
        recomendado_perfil: fentanil_rec,
        observacao_clinica: if perfil_norm == "choque_instavel" {
            "Atenção: pode agravar hipotensão em choque; considerar reduzir dose em 50% ou omitir pré-tratamento.".to_string()
        } else {
            "Atenua reflexo simpático e pico hipertensivo/pressão intracraniana durante a laringoscopia.".to_string()
        },
    });

    // 2. Etomidato (2 mg/mL)
    let etomidato_dose_mg_kg = 0.3;
    let etomidato_dose_total = (peso_kg * etomidato_dose_mg_kg * 10.0).round() / 10.0;
    let etomidato_vol = (etomidato_dose_total / 2.0 * 10.0).round() / 10.0;
    let etomidato_rec = perfil_norm == "choque_instavel" || perfil_norm == "neuroprotecao_tce" || perfil_norm == "padrao";
    farmacos.push(ItemFarmacoEmergencia {
        classe: "Indutor Hipnótico".to_string(),
        nome_farmaco: "Etomidato".to_string(),
        apresentacao_ampola: "2 mg/mL - Ampola 10 mL (20 mg)".to_string(),
        dose_mg_kg: etomidato_dose_mg_kg,
        dose_total_mg: etomidato_dose_total,
        volume_administrar_ml: etomidato_vol,
        recomendado_perfil: etomidato_rec,
        observacao_clinica: "Excelente estabilidade hemodinâmica e neuroprotetor. Supressão adrenal transitória de relevância clínica duvidosa em dose única.".to_string(),
    });

    // 3. Cetamina (50 mg/mL)
    let cetamina_dose_mg_kg = 1.5;
    let cetamina_dose_total = (peso_kg * cetamina_dose_mg_kg * 10.0).round() / 10.0;
    let cetamina_vol = (cetamina_dose_total / 50.0 * 100.0).round() / 100.0;
    let cetamina_rec = perfil_norm == "choque_instavel" || perfil_norm == "broncoespasmo_grave";
    farmacos.push(ItemFarmacoEmergencia {
        classe: "Indutor Hipnótico / Dissociativo".to_string(),
        nome_farmaco: "Cetamina (Ketamina)".to_string(),
        apresentacao_ampola: "50 mg/mL - Frasco-ampola 10 mL (500 mg)".to_string(),
        dose_mg_kg: cetamina_dose_mg_kg,
        dose_total_mg: cetamina_dose_total,
        volume_administrar_ml: cetamina_vol,
        recomendado_perfil: cetamina_rec,
        observacao_clinica: "Indutor de escolha em broncoespasmo grave (ação broncodilatadora) e choque séptico/cardiogênico (estímulo adrenérgico indireto).".to_string(),
    });

    // 4. Propofol (10 mg/mL)
    let propofol_dose_mg_kg = 1.5;
    let propofol_dose_total = (peso_kg * propofol_dose_mg_kg * 10.0).round() / 10.0;
    let propofol_vol = (propofol_dose_total / 10.0 * 10.0).round() / 10.0;
    let propofol_rec = perfil_norm == "broncoespasmo_grave";
    farmacos.push(ItemFarmacoEmergencia {
        classe: "Indutor Hipnótico".to_string(),
        nome_farmaco: "Propofol 1%".to_string(),
        apresentacao_ampola: "10 mg/mL - Ampola 20 mL (200 mg)".to_string(),
        dose_mg_kg: propofol_dose_mg_kg,
        dose_total_mg: propofol_dose_total,
        volume_administrar_ml: propofol_vol,
        recomendado_perfil: propofol_rec,
        observacao_clinica: if perfil_norm == "choque_instavel" {
            "CONTRAINDICADO RELATIVO no choque: potente vasodilatador venoso e depressor miocárdico com risco de colapso circulatório.".to_string()
        } else {
            "Ação broncodilatadora e rápido despertar. Monitorar rigorosamente pressão arterial.".to_string()
        },
    });

    // 5. Midazolam (5 mg/mL)
    let midazolam_dose_mg_kg = 0.15;
    let midazolam_dose_total = (peso_kg * midazolam_dose_mg_kg * 10.0).round() / 10.0;
    let midazolam_vol = (midazolam_dose_total / 5.0 * 10.0).round() / 10.0;
    farmacos.push(ItemFarmacoEmergencia {
        classe: "Indutor Hipnótico (Reserva)".to_string(),
        nome_farmaco: "Midazolam".to_string(),
        apresentacao_ampola: "5 mg/mL - Ampola 3 mL (15 mg) ou 10 mL (50 mg)".to_string(),
        dose_mg_kg: midazolam_dose_mg_kg,
        dose_total_mg: midazolam_dose_total,
        volume_administrar_ml: midazolam_vol,
        recomendado_perfil: false,
        observacao_clinica: "Indutor de segunda linha/reserva. Início de ação mais errático (~90 a 120s) e risco frequente de vasodilatação/hipotensão prolongada.".to_string(),
    });

    // 6. Succinilcolina (10 mg/mL após reconstituição de 100 mg em 10 mL)
    let succinil_dose_mg_kg = 1.2;
    let succinil_dose_total = (peso_kg * succinil_dose_mg_kg * 10.0).round() / 10.0;
    let succinil_vol = (succinil_dose_total / 10.0 * 10.0).round() / 10.0;
    farmacos.push(ItemFarmacoEmergencia {
        classe: "Bloqueador Neuromuscular Despolarizante".to_string(),
        nome_farmaco: "Succinilcolina".to_string(),
        apresentacao_ampola: "Frasco 100 mg (reconstituir com 10 mL de AD = 10 mg/mL)".to_string(),
        dose_mg_kg: succinil_dose_mg_kg,
        dose_total_mg: succinil_dose_total,
        volume_administrar_ml: succinil_vol,
        recomendado_perfil: true,
        observacao_clinica: "Início ultrarrápido (45-60s) e duração curta (6-10 min). CONTRAINDICADO em hipercalemia, queimados > 48h, denervação medular, rabdomiólise e histórico de hipertermia maligna.".to_string(),
    });

    // 7. Rocurônio (10 mg/mL)
    let rocuronio_dose_mg_kg = 1.2;
    let rocuronio_dose_total = (peso_kg * rocuronio_dose_mg_kg * 10.0).round() / 10.0;
    let rocuronio_vol = (rocuronio_dose_total / 10.0 * 10.0).round() / 10.0;
    farmacos.push(ItemFarmacoEmergencia {
        classe: "Bloqueador Neuromuscular Não Despolarizante".to_string(),
        nome_farmaco: "Brometo de Rocurônio".to_string(),
        apresentacao_ampola: "10 mg/mL - Frasco-ampola 5 mL (50 mg)".to_string(),
        dose_mg_kg: rocuronio_dose_mg_kg,
        dose_total_mg: rocuronio_dose_total,
        volume_administrar_ml: rocuronio_vol,
        recomendado_perfil: true,
        observacao_clinica: "BNM de escolha na ISR quando há contraindicação à succinilcolina. Condições de intubação em 60s na dose plena de 1.2 mg/kg. Reversor disponível: Sugamadex.".to_string(),
    });

    let checklist_7ps = vec![
        "1. Preparação: Testar fontes de oxigênio, aspirador a vácuo, tubo com cuff testado, guia/bougie, laringoscópio testado e kit de via aérea difícil (máscara laríngea).".to_string(),
        "2. Pré-oxigenação: Oxigênio a 100% por 3 a 5 minutos sob máscara com reservatório não reinalante (15 L/min) ou VNI se hipoxemia refratária.".to_string(),
        "3. Pré-otimização hemodinâmica: Ressuscitação volêmica guiada ou iniciar Noradrenalina precoce para manter PAS > 100 mmHg / PAM > 65 mmHg antes da sedação.".to_string(),
        "4. Posicionamento: Manobra de olfação (sniffing position) e elevação do conduto auditivo externo ao nível do esterno com coxim occipital.".to_string(),
        "5. Paralisia com Indução: Injeção rápida do hipnótico imediatamente seguida da injeção do bloqueador neuromuscular sem ventilar com máscara.".to_string(),
        "6. Passagem do tubo e confirmação: Visualização direta das cordas vocais, confirmação por capnografia em onda e ausculta em 5 pontos (epigástrio e 4 campos pulmonares).".to_string(),
        "7. Pós-intubação: Fixar rima labial, solicitar radiografia de tórax de controle, iniciar sedoanalgesia em BIC e conectar à ventilação protetora ARDSNet.".to_string(),
    ];

    Ok(ResultadoIntubacaoSri {
        peso_real_kg: peso_kg,
        perfil_hemodinamico: perfil_norm,
        farmacos,
        ventilacao: ParametrosVentilacaoInicial {
            peso_predito_kg: peso_predito_final,
            volume_corrente_ml: volume_corrente,
            peep_sugerida_cmh2o: 5,
            fr_sugerida_irpm: 16,
            fio2_inicial_percentual: 100,
        },
        checklist_7ps,
    })
}

/// Calcula referências de emergência pediátrica baseada em peso e idade (PALS / Broselow).
pub fn calcular_emergencia_pediatrica(
    peso_kg: f64,
    idade_anos: f64,
) -> Result<ResultadoEmergenciaPediatrica, ClinicalError> {
    if !(1.0..=80.0).contains(&peso_kg) {
        return Err(ClinicalError::ParametroInvalido {
            campo: "peso_kg".to_string(),
            valor: peso_kg,
            motivo: "Peso pediátrico deve estar entre 1.0 e 80.0 kg.".to_string(),
        });
    }

    if !(0.0..=16.0).contains(&idade_anos) {
        return Err(ClinicalError::ParametroInvalido {
            campo: "idade_anos".to_string(),
            valor: idade_anos,
            motivo: "Idade pediátrica deve estar entre 0.0 e 16.0 anos.".to_string(),
        });
    }

    // Fórmula Motoyama / PALS:
    // Tubo com cuff: (idade / 4) + 3.5
    // Tubo sem cuff: (idade / 4) + 4.0
    let cuffed_raw = (idade_anos / 4.0) + 3.5;
    let cuffed_rounded = ((cuffed_raw * 2.0).round() / 2.0).max(3.0);

    let uncuffed_raw = (idade_anos / 4.0) + 4.0;
    let uncuffed_rounded = ((uncuffed_raw * 2.0).round() / 2.0).max(3.5);

    let fixacao_rima = ((cuffed_rounded * 3.0) * 10.0).round() / 10.0;

    let lamina = if idade_anos < 1.0 {
        "Reta nº 0 ou 1 (Miller)".to_string()
    } else if idade_anos < 5.0 {
        "Reta ou Curva nº 1 ou 2".to_string()
    } else if idade_anos < 10.0 {
        "Curva nº 2 (Macintosh)".to_string()
    } else {
        "Curva nº 3 (Macintosh)".to_string()
    };

    let carga_1 = (2.0 * peso_kg).min(200.0);
    let carga_2 = (4.0 * peso_kg).min(200.0);

    let adrenalina_mg = ((0.01 * peso_kg * 1000.0).round() / 1000.0).min(1.0);
    let adrenalina_1_10000_ml = ((0.1 * peso_kg * 10.0).round() / 10.0).min(10.0);
    let expansao = (20.0 * peso_kg).round();

    Ok(ResultadoEmergenciaPediatrica {
        peso_kg,
        idade_anos,
        tubo_com_cuff_mm: cuffed_rounded,
        tubo_sem_cuff_mm: uncuffed_rounded,
        fixacao_rima_labial_cm: fixacao_rima,
        lamina_laringoscopio: lamina,
        carga_desfibrilacao_1_j: carga_1,
        carga_desfibrilacao_2_j: carga_2,
        adrenalina_pcr_mg: adrenalina_mg,
        adrenalina_diluida_1_10000_ml: adrenalina_1_10000_ml,
        expansao_cristaloide_20ml_kg: expansao,
    })
}
