//! Módulo de Escores Cardiológicos, Tromboembolismo, QTc e Neurologia Aguda.
//!
//! Contém HEART Score, HAS-BLED, QTc Corrigido (Bazett/Fridericia/Framingham),
//! PERC, Wells TVP, Pádua TEV, Trombólise no AVC (r-tPA / TNK) e Glasgow Pupilar (GCS-P).

use crate::errors::ClinicalError;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ResultadoHeartScore {
    pub pontuacao_total: u8,
    pub categoria_risco: String,
    pub mace_percentual: String,
    pub conduta_sugerida: String,
    pub detalhamento_pontos: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ResultadoHasBled {
    pub pontuacao_total: u8,
    pub categoria_risco: String,
    pub taxa_sangramento_anual: String,
    pub fatores_modificaveis: Vec<String>,
    pub recomendacao_anticoagulacao: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ResultadoQtcCorrigido {
    pub qt_medido_ms: f64,
    pub fc_bpm: f64,
    pub qtc_bazett_ms: f64,
    pub qtc_fridericia_ms: f64,
    pub qtc_framingham_ms: f64,
    pub status_intervalo: String,
    pub alerta_torsades: bool,
    pub recomendacao: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ResultadoPerc {
    pub criterios_positivos: u8,
    pub tep_descartado: bool,
    pub probabilidade_residual_percentual: String,
    pub conduta: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ResultadoWellsTvp {
    pub pontuacao_total: i8,
    pub categoria_probabilidade: String,
    pub incidencia_estimada: String,
    pub conduta_indicada: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ResultadoPaduaTev {
    pub pontuacao_total: u8,
    pub alto_risco_tev: bool,
    pub profilaxia_indicada: String,
    pub esquema_enoxaparina: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ResultadoTromboliseAvc {
    pub peso_kg: f64,
    pub dose_total_alteplase_mg: f64,
    pub bolus_alteplase_10_porcento_mg: f64,
    pub infusao_alteplase_90_porcento_mg_h: f64,
    pub dose_tenecteplase_mg: f64,
    pub metas_pressoricas: String,
    pub contraindicacoes_absolutas: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ResultadoGlasgowP {
    pub escore_glasgow: u8,
    pub reacao_pupilar_pontos: u8,
    pub gcs_p_final: i8,
    pub gravidade_tce: String,
    pub indicacao_intubacao: bool,
    pub conduta: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ResultadoCranioCervical {
    pub indicacao_tc_cranio: bool,
    pub justificativa_cranio: String,
    pub criterios_nexus_atendidos: bool,
    pub indicacao_imagem_cervical: bool,
    pub justificativa_coluna: String,
}

/// HEART Score para Estratificação de Risco de Eventos Cardíacos Maiores (MACE) na Dor Torácica.
pub fn calcular_heart_score(
    historia: u8,
    ecg: u8,
    idade: u8,
    fatores_risco: u8,
    troponina: u8,
) -> Result<ResultadoHeartScore, ClinicalError> {
    if historia > 2 || ecg > 2 || idade > 2 || fatores_risco > 2 || troponina > 2 {
        return Err(ClinicalError::ParametroInvalido {
            campo: "componente_heart".to_string(),
            valor: 3.0,
            motivo: "Cada componente do HEART Score deve pontuar estritamente entre 0 e 2 pontos.".to_string(),
        });
    }

    let total = historia + ecg + idade + fatores_risco + troponina;

    let mut detalhe = Vec::new();
    detalhe.push(format!("História Clínica: {} pt(s)", historia));
    detalhe.push(format!("Eletrocardiograma (ECG): {} pt(s)", ecg));
    detalhe.push(format!("Idade do Paciente: {} pt(s)", idade));
    detalhe.push(format!("Fatores de Risco / DAC prévia: {} pt(s)", fatores_risco));
    detalhe.push(format!("Troponina Inicial: {} pt(s)", troponina));

    let (categoria, mace, conduta) = match total {
        0..=3 => (
            "Baixo Risco".to_string(),
            "0.9% a 1.7% de MACE em 6 semanas".to_string(),
            "Candidato a alta precoce com segurança após protocolo de troponina seriada ultrassensível negativa (0h/1h ou 0h/2h). Investigação ambulatorial eletiva.".to_string(),
        ),
        4..=6 => (
            "Risco Moderado".to_string(),
            "12.0% a 16.6% de MACE em 6 semanas".to_string(),
            "Admissão em Unidade de Dor Torácica / Leito de Observação. Troponina seriada, monitorização eletrocardiográfica contínua e prova funcional não invasiva (ex: Angio-TC, Eco-stress ou Teste Ergométrico) antes da alta.".to_string(),
        ),
        _ => (
            "Alto Risco".to_string(),
            "50.0% a 65.0% de MACE em 6 semanas".to_string(),
            "Admissão hospitalar imediata em Unidade Coronariana (UCO/UTI). Iniciar dupla antiagregação plaquetária (AAS + Ticagrelor/Clopidogrel) + anticoagulação plena. Estratégia invasiva precoce com Cateterismo Cardíaco (CATE).".to_string(),
        ),
    };

    Ok(ResultadoHeartScore {
        pontuacao_total: total,
        categoria_risco: categoria,
        mace_percentual: mace,
        conduta_sugerida: conduta,
        detalhamento_pontos: detalhe,
    })
}

/// HAS-BLED para Avaliação do Risco de Sangramento Maior em Pacientes com Fibrilação Atrial.
pub fn calcular_has_bled(
    hipertensao_nao_controlada: bool,
    funcao_renal_anormal: bool,
    funcao_hepatica_anormal: bool,
    avc_previo: bool,
    sangramento_previo: bool,
    inr_labil: bool,
    idade_maior_65: bool,
    drogas_ou_aine: bool,
    alcool: bool,
) -> ResultadoHasBled {
    let mut pontos: u8 = 0;
    let mut modificaveis = Vec::new();

    if hipertensao_nao_controlada {
        pontos += 1;
        modificaveis.push("Pressão arterial sistólica > 160 mmHg (Otimizar anti-hipertensivos)".to_string());
    }
    if funcao_renal_anormal {
        pontos += 1;
        modificaveis.push("Disfunção renal (diálise, transplante ou creatinina >= 2.26 mg/dL) - ajustar dose de DOAC".to_string());
    }
    if funcao_hepatica_anormal {
        pontos += 1;
        modificaveis.push("Doença hepática crônica grave (cirrose ou bilirrubina > 2x + AST/ALT > 3x)".to_string());
    }
    if avc_previo {
        pontos += 1;
    }
    if sangramento_previo {
        pontos += 1;
        modificaveis.push("Histórico de hemorragia digestiva ou anemia prévia - considerar gastroproteção com IBP".to_string());
    }
    if inr_labil {
        pontos += 1;
        modificaveis.push("INR lábil com TTR < 60% se em uso de Varfarina - considerar migração para DOAC".to_string());
    }
    if idade_maior_65 {
        pontos += 1;
    }
    if drogas_ou_aine {
        pontos += 1;
        modificaveis.push("Uso concomitante de AINEs ou Antiagregantes (AAS/Clopidogrel) - desprescrever se sem indicação estrita".to_string());
    }
    if alcool {
        pontos += 1;
        modificaveis.push("Consumo de álcool >= 8 doses por semana - orientar cessação/redução".to_string());
    }

    let (categoria, taxa, recomendacao) = if pontos >= 3 {
        (
            "Alto Risco de Sangramento Maior (HAS-BLED >= 3)".to_string(),
            format!("{:.1}% de risco de sangramento maior em 1 ano", 3.7 + (pontos as f64 - 3.0) * 1.5),
            "O escore HAS-BLED elevado NÃO deve ser usado para contraindicar a anticoagulação oral (pois o benefício na redução de AVC isquêmico supera o sangramento). Conduta: Identificar e corrigir agressivamente todos os fatores de risco modificáveis (suspender AINEs, controlar PAS < 140 mmHg, prescrever IBP) e realizar seguimento clínico mais frequente.".to_string(),
        )
    } else {
        (
            "Baixo a Moderado Risco de Sangramento (HAS-BLED < 3)".to_string(),
            format!("{:.1}% de risco de sangramento maior em 1 ano", 1.0 + pontos as f64 * 0.9),
            "Risco basal de sangramento aceitável. Iniciar ou manter anticoagulação oral plena (DOACs preferenciais sobre antagonistas da vitamina K).".to_string(),
        )
    };

    ResultadoHasBled {
        pontuacao_total: pontos,
        categoria_risco: categoria,
        taxa_sangramento_anual: taxa,
        fatores_modificaveis: modificaveis,
        recomendacao_anticoagulacao: recomendacao,
    }
}

/// Cálculo de Intervalo QTc pelas Fórmulas de Bazett, Fridericia e Framingham.
pub fn calcular_qtc_corrigido(
    qt_ms: f64,
    fc_bpm: f64,
    sexo_feminino: bool,
) -> Result<ResultadoQtcCorrigido, ClinicalError> {
    if qt_ms < 150.0 || qt_ms > 900.0 {
        return Err(ClinicalError::ParametroInvalido {
            campo: "qt_ms".to_string(),
            valor: qt_ms,
            motivo: "Intervalo QT deve estar entre 150 e 900 ms.".to_string(),
        });
    }

    if fc_bpm < 25.0 || fc_bpm > 260.0 {
        return Err(ClinicalError::ParametroInvalido {
            campo: "fc_bpm".to_string(),
            valor: fc_bpm,
            motivo: "Frequência cardíaca deve estar entre 25 e 260 bpm.".to_string(),
        });
    }

    let rr_seg = 60.0 / fc_bpm;

    // Bazett: QT / sqrt(RR)
    let qtc_bazett = qt_ms / rr_seg.sqrt();

    // Fridericia (padrão-ouro em taquicardia/bradicardia): QT / cbrt(RR)
    let qtc_fridericia = qt_ms / rr_seg.cbrt();

    // Framingham: QT + 154 * (1 - RR)
    let qtc_framingham = qt_ms + 154.0 * (1.0 - rr_seg);

    let limite_normal = if sexo_feminino { 470.0 } else { 450.0 };
    let alerta_torsades = qtc_fridericia >= 500.0 || qtc_bazett >= 500.0;

    let (status, recomendacao) = if alerta_torsades {
        (
            "CRÍTICO: QTc >= 500 ms (Altíssimo Risco de Torsades de Pointes)".to_string(),
            "Suspender imediatamente qualquer fármaco que prolongue o QTc (antipsicóticos, macrolídeos, quinolonas, antieméticos). Dosar potássio e magnésio séricos imediatamente e corrigir para K+ >= 4.0 mEq/L e Mg2+ >= 2.0 mg/dL. Monitorizar em telemetria contínua. Em caso de Torsades de Pointes, infundir Sulfato de Magnésio 2g IV.".to_string(),
        )
    } else if qtc_fridericia > limite_normal {
        (
            format!("Intervalo QTc Prolongado (> {} ms)", limite_normal),
            "QTc discretamente acima da faixa fisiológica. Evitar associação de múltiplos fármacos proarritmogênicos e realizar ECG seriado.".to_string(),
        )
    } else {
        (
            "Intervalo QTc Normal".to_string(),
            "Intervalo de repolarização ventricular dentro dos limites fisiológicos normais.".to_string(),
        )
    };

    Ok(ResultadoQtcCorrigido {
        qt_medido_ms: qt_ms,
        fc_bpm,
        qtc_bazett_ms: (qtc_bazett * 10.0).round() / 10.0,
        qtc_fridericia_ms: (qtc_fridericia * 10.0).round() / 10.0,
        qtc_framingham_ms: (qtc_framingham * 10.0).round() / 10.0,
        status_intervalo: status,
        alerta_torsades,
        recomendacao,
    })
}

/// Critérios PERC (Pulmonary Embolism Rule-Out Criteria) para Descarte de TEP sem Exames Adicionais.
pub fn calcular_criterios_perc(
    idade_ge_50: bool,
    fc_ge_100: bool,
    spo2_menor_95: bool,
    edema_unilateral_mmii: bool,
    hemoptise: bool,
    cirurgia_ou_trauma_recente: bool,
    tev_previo: bool,
    uso_estrogenio: bool,
) -> ResultadoPerc {
    let mut positivos: u8 = 0;
    if idade_ge_50 { positivos += 1; }
    if fc_ge_100 { positivos += 1; }
    if spo2_menor_95 { positivos += 1; }
    if edema_unilateral_mmii { positivos += 1; }
    if hemoptise { positivos += 1; }
    if cirurgia_ou_trauma_recente { positivos += 1; }
    if tev_previo { positivos += 1; }
    if uso_estrogenio { positivos += 1; }

    let descartado = positivos == 0;
    let (prob, conduta) = if descartado {
        (
            "< 1.5% de probabilidade de TEP".to_string(),
            "PERC NEGATIVO (0 critérios presentes): Em pacientes com BAIXA probabilidade clínica pré-teste (Wells < 2), o TEP pode ser descartado com segurança SEM necessidade de D-dímero ou Angiotomografia de Tórax.".to_string(),
        )
    } else {
        (
            format!("{} critério(s) presente(s) - PERC Positivo", positivos),
            "PERC POSITIVO: Não é possível descartar TEP apenas clinicamente. Indicação de dosagem de D-dímero (se baixa/intermediária probabilidade) ou Angiotomografia pulmonar direta (se alta probabilidade clínica).".to_string(),
        )
    };

    ResultadoPerc {
        criterios_positivos: positivos,
        tep_descartado: descartado,
        probabilidade_residual_percentual: prob,
        conduta,
    }
}

/// Escore de Wells para Trombose Venosa Profunda (TVP).
pub fn calcular_wells_tvp(
    cancer_ativo: bool,
    paralisia_ou_imobilizacao_mmii: bool,
    acamado_recente_ou_cirurgia: bool,
    dor_ao_longo_sistema_venoso: bool,
    edema_perna_inteira: bool,
    edema_panturrilha_maior_3cm: bool,
    edema_com_cacifo: bool,
    veias_colaterais_superficiais: bool,
    tvp_previa: bool,
    diagnostico_alternativo_provavel: bool,
) -> ResultadoWellsTvp {
    let mut pontos: i8 = 0;
    if cancer_ativo { pontos += 1; }
    if paralisia_ou_imobilizacao_mmii { pontos += 1; }
    if acamado_recente_ou_cirurgia { pontos += 1; }
    if dor_ao_longo_sistema_venoso { pontos += 1; }
    if edema_perna_inteira { pontos += 1; }
    if edema_panturrilha_maior_3cm { pontos += 1; }
    if edema_com_cacifo { pontos += 1; }
    if veias_colaterais_superficiais { pontos += 1; }
    if tvp_previa { pontos += 1; }
    if diagnostico_alternativo_provavel { pontos -= 2; }

    let (categoria, incid, conduta) = match pontos {
        p if p <= 0 => (
            "Baixa Probabilidade de TVP".to_string(),
            "~3% a 5% de prevalência".to_string(),
            "Solicitar D-dímero de alta sensibilidade. Se negativo: TVP descartada sem necessidade de USG Doppler. Se positivo: realizar Ultrassonografia Vascular com Doppler venoso de MMII.".to_string(),
        ),
        1 | 2 => (
            "Probabilidade Moderada de TVP".to_string(),
            "~17% de prevalência".to_string(),
            "Solicitar D-dímero de alta sensibilidade ou Ultrassonografia Vascular com Doppler venoso de MMII.".to_string(),
        ),
        _ => (
            "Alta Probabilidade de TVP (Wells >= 3)".to_string(),
            "~53% a 75% de prevalência".to_string(),
            "Indicação formal direta de Ultrassonografia Vascular com Doppler de MMII. Se exame demorar > 4 horas e ausência de contraindicações graves, considerar dose inicial de anticoagulante pleno (Enoxaparina 1 mg/kg SC 12/12h).".to_string(),
        ),
    };

    ResultadoWellsTvp {
        pontuacao_total: pontos,
        categoria_probabilidade: categoria,
        incidencia_estimada: incid,
        conduta_indicada: conduta,
    }
}

/// Escore de Pádua para Profilaxia de Tromboembolismo Venoso (TEV) em Paciente Clínico Hospitalizado.
pub fn calcular_escore_padua(
    cancer_ativo: bool,
    tev_previo: bool,
    mobilidade_reduzida: bool,
    trombofilia: bool,
    trauma_ou_cirurgia_recente: bool,
    idade_ge_70: bool,
    ic_ou_insuf_respiratoria: bool,
    iam_ou_avc_agudo: bool,
    infeccao_ou_doenca_reumatologica: bool,
    obesidade_imc_ge_30: bool,
    terapia_hormonal: bool,
) -> ResultadoPaduaTev {
    let mut pontos: u8 = 0;
    if cancer_ativo { pontos += 3; }
    if tev_previo { pontos += 3; }
    if mobilidade_reduzida { pontos += 3; }
    if trombofilia { pontos += 3; }
    if trauma_ou_cirurgia_recente { pontos += 2; }
    if idade_ge_70 { pontos += 1; }
    if ic_ou_insuf_respiratoria { pontos += 1; }
    if iam_ou_avc_agudo { pontos += 1; }
    if infeccao_ou_doenca_reumatologica { pontos += 1; }
    if obesidade_imc_ge_30 { pontos += 1; }
    if terapia_hormonal { pontos += 1; }

    let alto_risco = pontos >= 4;
    let (prof, esquema) = if alto_risco {
        (
            "ALTO RISCO DE TEV (Pádua >= 4): Tromboprofilaxia farmacológica obrigatória se sem contraindicações hemorrágicas ativas.".to_string(),
            "Enoxaparina 40 mg SC 1x ao dia pela manhã. Se ClCr < 30 mL/min: ajustar para Enoxaparina 20 mg SC 1x ao dia OU Heparina Não Fracionada (HNF) 5.000 UI SC a cada 8 ou 12 horas. Manter deambulação precoce e meias de compressão se sangramento ativo.".to_string(),
        )
    } else {
        (
            "BAIXO RISCO DE TEV (Pádua < 4): Profilaxia farmacológica não indicada rotineiramente.".to_string(),
            "Estimular deambulação precoce no leito/quarto e hidratação adequada. Reavaliar escore a cada 48 horas ou em caso de piora clínica.".to_string(),
        )
    };

    ResultadoPaduaTev {
        pontuacao_total: pontos,
        alto_risco_tev: alto_risco,
        profilaxia_indicada: prof,
        esquema_enoxaparina: esquema,
    }
}

/// Doses de Trombólise no AVC Isquêmico Agudo (Alteplase e Tenecteplase).
pub fn calcular_trombolise_avc(peso_kg: f64) -> Result<ResultadoTromboliseAvc, ClinicalError> {
    if peso_kg < 20.0 || peso_kg > 300.0 {
        return Err(ClinicalError::ParametroInvalido {
            campo: "peso_kg".to_string(),
            valor: peso_kg,
            motivo: "Peso deve estar entre 20.0 e 300.0 kg para cálculo de trombólise.".to_string(),
        });
    }

    // Alteplase (r-tPA): 0.9 mg/kg (máximo 90 mg)
    let dose_alteplase = (0.9 * peso_kg).min(90.0);
    let bolus_10 = dose_alteplase * 0.10; // 10% em 1 minuto
    let infusao_90 = dose_alteplase * 0.90; // 90% em 60 minutos (mL/h na solução 1 mg/mL)

    // Tenecteplase (TNK): 0.25 mg/kg (máximo 25 mg) em bolus IV único
    let dose_tnk = (0.25 * peso_kg).min(25.0);

    let contraindicacoes = vec![
        "Hemorragia intracraniana prévia em qualquer época da vida".to_string(),
        "AVC isquêmico extenso ou TCE grave nos últimos 3 meses".to_string(),
        "PA mantida >= 185/110 mmHg a despeito de anti-hipertensivo IV (Nitroprussiato / Esmolol)".to_string(),
        "Plaquetas < 100.000/mm³, INR > 1.7 ou uso de DOAC nas últimas 48 horas".to_string(),
        "Glicemia capilar < 50 mg/dL (corrigir hipoglicemia antes de trombolisar)".to_string(),
    ];

    let metas_pa = "Antes do bolus: PA < 185/110 mmHg. Durante a infusão e nas primeiras 24 horas: manter PA < 180/105 mmHg com checagem neurológica seriada a cada 15 min nas primeiras 2 horas.".to_string();

    Ok(ResultadoTromboliseAvc {
        peso_kg,
        dose_total_alteplase_mg: (dose_alteplase * 100.0).round() / 100.0,
        bolus_alteplase_10_porcento_mg: (bolus_10 * 100.0).round() / 100.0,
        infusao_alteplase_90_porcento_mg_h: (infusao_90 * 100.0).round() / 100.0,
        dose_tenecteplase_mg: (dose_tnk * 100.0).round() / 100.0,
        metas_pressoricas: metas_pa,
        contraindicacoes_absolutas: contraindicacoes,
    })
}

/// Escala de Coma de Glasgow com Reatividade Pupilar (GCS-P).
pub fn calcular_glasgow_p(
    abertura_ocular: u8,
    resposta_verbal: u8,
    resposta_motora: u8,
    reacao_pupilar: u8,
) -> Result<ResultadoGlasgowP, ClinicalError> {
    if abertura_ocular < 1 || abertura_ocular > 4 {
        return Err(ClinicalError::ParametroInvalido {
            campo: "abertura_ocular".to_string(),
            valor: abertura_ocular as f64,
            motivo: "Abertura ocular deve ser entre 1 (nenhuma) e 4 (espontânea).".to_string(),
        });
    }
    if resposta_verbal < 1 || resposta_verbal > 5 {
        return Err(ClinicalError::ParametroInvalido {
            campo: "resposta_verbal".to_string(),
            valor: resposta_verbal as f64,
            motivo: "Resposta verbal deve ser entre 1 (nenhuma) e 5 (orientada).".to_string(),
        });
    }
    if resposta_motora < 1 || resposta_motora > 6 {
        return Err(ClinicalError::ParametroInvalido {
            campo: "resposta_motora".to_string(),
            valor: resposta_motora as f64,
            motivo: "Resposta motora deve ser entre 1 (nenhuma) e 6 (obedece a comandos).".to_string(),
        });
    }
    if reacao_pupilar > 2 {
        return Err(ClinicalError::ParametroInvalido {
            campo: "reacao_pupilar".to_string(),
            valor: reacao_pupilar as f64,
            motivo: "Pontuação pupilar deve ser 0 (ambas reagem), 1 (uma reage) ou 2 (nenhuma reage).".to_string(),
        });
    }

    let gcs = abertura_ocular + resposta_verbal + resposta_motora;
    let gcs_p = gcs as i8 - reacao_pupilar as i8;

    let intubacao = gcs_p <= 8;

    let (gravidade, conduta) = if gcs_p <= 8 {
        (
            "TCE Grave / Coma (GCS-P <= 8)".to_string(),
            "INDICAÇÃO FORMAL DE INTUBAÇÃO OROTRAQUEAL IMEDIATA (ISR) para proteção definitiva de via aérea. Neuroproteção intensiva: manter PAM >= 80 mmHg, cabeceira a 30°, evitar hipóxia (SpO2 >= 94%) e hipercapnia (PaCO2 entre 35 e 40 mmHg). Solicitar TC de Crânio urgente e avaliar Neurocirurgia.".to_string(),
        )
    } else if gcs_p <= 12 {
        (
            "TCE Moderado (GCS-P 9 a 12)".to_string(),
            "Internação em leito de monitorização neurológica contínua. Indicação de TC de Crânio imediata. Reavaliação neurológica seriada a cada 1 hora.".to_string(),
        )
    } else {
        (
            "TCE Leve (GCS-P 13 a 15)".to_string(),
            "Avaliar critérios da Canadian CT Head Rule para decidir indicação de Tomografia de Crânio. Observação clínica por no mínimo 6 a 12 horas.".to_string(),
        )
    };

    Ok(ResultadoGlasgowP {
        escore_glasgow: gcs,
        reacao_pupilar_pontos: reacao_pupilar,
        gcs_p_final: gcs_p,
        gravidade_tce: gravidade,
        indicacao_intubacao: intubacao,
        conduta,
    })
}

/// Regra Canadense de TC de Crânio e Critérios NEXUS para Trauma Cervical.
pub fn calcular_cranio_cervical(
    glasgow_menor_15_em_2h: bool,
    suspeita_fratura_afundamento_base: bool,
    vomitos_ge_2_episodios: bool,
    idade_ge_65: bool,
    amnesia_retrograda_ge_30min: bool,
    mecanismo_perigoso_ejetado_atropelado: bool,
    dor_palpacao_linha_media_cervical: bool,
    deficit_neurologico_focal: bool,
    nivel_consciencia_alterado_ou_glasgow_menor_15: bool,
    evidencia_intoxicacao: bool,
    lesao_dolorosa_distrativa: bool,
) -> ResultadoCranioCervical {
    let indicacao_tc_cranio = glasgow_menor_15_em_2h
        || suspeita_fratura_afundamento_base
        || vomitos_ge_2_episodios
        || idade_ge_65
        || amnesia_retrograda_ge_30min
        || mecanismo_perigoso_ejetado_atropelado;

    let justificativa_tc = if indicacao_tc_cranio {
        "INDICAÇÃO DE TC DE CRÂNIO (Canadian CT Head Rule): O paciente apresenta ao menos um critério de alto ou médio risco para lesão intracraniana neurocirúrgica ou clinicamente importante.".to_string()
    } else {
        "BAIXO RISCO PARA TC DE CRÂNIO: Nenhum critério da Canadian Head Rule presente. Risco de lesão cirúrgica < 0.1%. Tomografia não indicada rotineiramente.".to_string()
    };

    let criteria_nexus_atendidos = !dor_palpacao_linha_media_cervical
        && !deficit_neurologico_focal
        && !nivel_consciencia_alterado_ou_glasgow_menor_15
        && !evidencia_intoxicacao
        && !lesao_dolorosa_distrativa;

    let indicacao_imagem_cervical = !criteria_nexus_atendidos;
    let justificativa_cervical = if indicacao_imagem_cervical {
        "INDICAÇÃO DE IMAGEM DA COLUNA CERVICAL (NEXUS Positivo): Presença de dor à palpação de linha média, déficit neurológico, alteração de consciência, intoxicação ou lesão distrativa. Manter colar cervical rígido e realizar TC ou Radiografia.".to_string()
    } else {
        "COLUNA CERVICAL LIBERADA CLINICAMENTE (NEXUS Negativo): Todos os 5 critérios negativos com 99.6% de sensibilidade. O colar cervical pode ser retirado com segurança sem necessidade de imagem.".to_string()
    };

    ResultadoCranioCervical {
        indicacao_tc_cranio,
        justificativa_cranio: justificativa_tc,
        criterios_nexus_atendidos: criteria_nexus_atendidos,
        indicacao_imagem_cervical,
        justificativa_coluna: justificativa_cervical,
    }
}
