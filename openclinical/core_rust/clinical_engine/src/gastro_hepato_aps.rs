//! Módulo de Gastroenterologia, Hepatologia, Cirurgia Geral e Atenção Primária à Saúde (APS).
//!
//! Contém MELD-Na, Child-Pugh, FIB-4, Glasgow-Blatchford (HDA), BISAP (Pancreatite),
//! Alvarado (Apendicite), Conversor de Corticoides, Antropometria Farmacológica,
//! Centor/McIsaac, Idade Gestacional/DPP (Naegele) e SOFA Completo / SIRS.

use crate::errors::ClinicalError;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ResultadoMeldNa {
    pub score_meld_inicial: f64,
    pub score_meld_na: f64,
    pub mortalidade_90d_percentual: String,
    pub prioridade_transplante: String,
    pub conduta_clinica: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ResultadoChildPugh {
    pub pontuacao_total: u8,
    pub classe: String,
    pub sobrevida_1ano_percentual: String,
    pub sobrevida_2anos_percentual: String,
    pub risco_cirurgico_mortalidade: String,
    pub conduta_geral: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ResultadoFib4 {
    pub score_fib4: f64,
    pub estratificacao_fibrose: String,
    pub valor_preditivo: String,
    pub conduta_encaminhamento: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ResultadoGlasgowBlatchford {
    pub pontuacao_total: u8,
    pub baixo_risco_ambulatorial: bool,
    pub necessidade_intervencao_percentual: String,
    pub conduta_sugerida: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ResultadoBisap {
    pub pontuacao_total: u8,
    pub categoria_gravidade: String,
    pub mortalidade_prevista_percentual: String,
    pub indicacao_uti: bool,
    pub conduta: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ResultadoAlvarado {
    pub pontuacao_total: u8,
    pub probabilidade_apendicite: String,
    pub conduta_cirurgica: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ItemDoseEquivalente {
    pub farmaco: String,
    pub dose_equivalente_mg: f64,
    pub potencia_antiinflamatoria_relativa: f64,
    pub duracao_efeito_horas: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ResultadoEquivalenciaCorticoide {
    pub farmaco_origem: String,
    pub dose_origem_mg: f64,
    pub doses_equivalentes: Vec<ItemDoseEquivalente>,
    pub esquema_desmame_sugerido: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ResultadoAntropometriaFarmacologica {
    pub peso_real_kg: f64,
    pub altura_cm: f64,
    pub peso_ideal_devine_kg: f64,
    pub peso_ajustado_obesidade_kg: f64,
    pub superficie_corporal_mosteller_m2: f64,
    pub imc: f64,
    pub classificacao_imc: String,
    pub recomendacao_drogas_hidrofilicas: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ResultadoCentorMcIsaac {
    pub pontuacao_total: i8,
    pub probabilidade_strepto_percentual: String,
    pub indicacao_teste_rapido_ou_atb: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ResultadoIdadeGestacionalDpp {
    pub idade_gestacional_semanas: u16,
    pub idade_gestacional_dias: u8,
    pub data_provavel_parto_naegele: String,
    pub trimestre_atual: String,
    pub exames_do_trimestre: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ResultadoSofaCompleto {
    pub sofa_total: u8,
    pub mortalidade_estimada_uti: String,
    pub pontuacao_respiratoria: u8,
    pub pontuacao_coagulacao: u8,
    pub pontuacao_hepatica: u8,
    pub pontuacao_cardiovascular: u8,
    pub pontuacao_neurologica: u8,
    pub pontuacao_renal: u8,
    pub criterios_sirs_presentes: u8,
    pub sirs_positivo: bool,
    pub conduta_sepse: String,
}

/// MELD-Na (Model for End-Stage Liver Disease com correção pelo Sódio Sérico).
pub fn calcular_meld_na(
    creatinina: f64,
    bilirrubina: f64,
    inr: f64,
    sodio: f64,
    dialise_recente: bool,
) -> Result<ResultadoMeldNa, ClinicalError> {
    if creatinina <= 0.0 || bilirrubina <= 0.0 || inr <= 0.0 || sodio < 100.0 || sodio > 180.0 {
        return Err(ClinicalError::ParametroInvalido {
            campo: "creatinina / bilirrubina / inr / sodio".to_string(),
            valor: creatinina,
            motivo: "Parâmetros laboratoriais do MELD devem ser maiores que zero e em faixas fisiológicas.".to_string(),
        });
    }

    // Regras de piso e teto UNOS/OPTN
    let cr_calc = if dialise_recente {
        4.0
    } else {
        creatinina.clamp(1.0, 4.0)
    };
    let bili_calc = bilirrubina.max(1.0);
    let inr_calc = inr.max(1.0);
    let na_calc = sodio.clamp(125.0, 137.0);

    // MELD inicial = 9.57 * ln(Cr) + 3.78 * ln(Bili) + 11.20 * ln(INR) + 6.43
    let meld_i = (9.57 * cr_calc.ln() + 3.78 * bili_calc.ln() + 11.20 * inr_calc.ln() + 6.43).round();

    // MELD-Na (se MELD_i > 11): MELD_i + 1.32 * (137 - Na) - [0.033 * MELD_i * (137 - Na)]
    let meld_na = if meld_i > 11.0 {
        let calc = meld_i + 1.32 * (137.0 - na_calc) - (0.033 * meld_i * (137.0 - na_calc));
        calc.clamp(6.0, 40.0).round()
    } else {
        meld_i.clamp(6.0, 40.0)
    };

    let (mortalidade, prioridade, conduta) = match meld_na as u32 {
        m if m >= 30 => (
            "> 50% a 70% de mortalidade em 90 dias sem transplante".to_string(),
            "Prioridade Máxima na fila de Transplante Hepático (Listagem Urgente)".to_string(),
            "Internação em UTI / Centro de Transplante. Monitorização agressiva de encefalopatia, síndrome hepatorrenal e PBE.".to_string(),
        ),
        20..=29 => (
            "~20% a 50% de mortalidade em 90 dias".to_string(),
            "Alta prioridade na lista de transplante".to_string(),
            "Seguimento hepatológico estreito. Otimização de diuréticos (espironolactona + furosemida), profilaxia de varizes de esôfago e vacinação.".to_string(),
        ),
        10..=19 => (
            "~6% a 10% de mortalidade em 90 dias".to_string(),
            "Prioridade Intermediária".to_string(),
            "Acompanhamento ambulatorial periódico. Rastreio de Carcinoma Hepatocelular (CHC) com USG + Alfafetoproteína de 6 em 6 meses.".to_string(),
        ),
        _ => (
            "< 2% de mortalidade em 90 dias".to_string(),
            "Prioridade Basal".to_string(),
            "Hepatopatia compensada. Manter rastreio semestral de CHC e evitar agentes hepatotóxicos e AINEs.".to_string(),
        ),
    };

    Ok(ResultadoMeldNa {
        score_meld_inicial: meld_i,
        score_meld_na: meld_na,
        mortalidade_90d_percentual: mortalidade,
        prioridade_transplante: prioridade,
        conduta_clinica: conduta,
    })
}

/// Escore de Child-Pugh-Turcotte para Cirrose Hepática.
pub fn calcular_child_pugh(
    bilirrubina: f64,
    albumina: f64,
    inr: f64,
    ascite_grau: u8,
    encefalopatia_grau: u8,
) -> Result<ResultadoChildPugh, ClinicalError> {
    if bilirrubina <= 0.0 || albumina <= 0.0 || inr <= 0.0 {
        return Err(ClinicalError::ParametroInvalido {
            campo: "bilirrubina / albumina / inr".to_string(),
            valor: bilirrubina,
            motivo: "Bilirrubina, albumina e INR devem ser maiores que zero.".to_string(),
        });
    }
    if ascite_grau < 1 || ascite_grau > 3 || encefalopatia_grau < 1 || encefalopatia_grau > 3 {
        return Err(ClinicalError::ParametroInvalido {
            campo: "ascite_grau / encefalopatia_grau".to_string(),
            valor: ascite_grau as f64,
            motivo: "Graus de ascite e encefalopatia devem ser de 1 a 3.".to_string(),
        });
    }

    let mut pontos: u8 = 0;

    // Bilirrubina (mg/dL)
    if bilirrubina < 2.0 {
        pontos += 1;
    } else if bilirrubina <= 3.0 {
        pontos += 2;
    } else {
        pontos += 3;
    }

    // Albumina (g/dL)
    if albumina > 3.5 {
        pontos += 1;
    } else if albumina >= 2.8 {
        pontos += 2;
    } else {
        pontos += 3;
    }

    // INR
    if inr < 1.7 {
        pontos += 1;
    } else if inr <= 2.3 {
        pontos += 2;
    } else {
        pontos += 3;
    }

    pontos += ascite_grau;
    pontos += encefalopatia_grau;

    let (classe, s1, s2, risco_cir, conduta) = match pontos {
        5 | 6 => (
            "Classe A (5 a 6 pontos)".to_string(),
            "100%".to_string(),
            "85%".to_string(),
            "Baixo Risco Cirúrgico (~10% de mortalidade perioperatória)".to_string(),
            "Cirrose bem compensada. Procedimentos cirúrgicos de médio porte geralmente bem tolerados. Manter rastreio semestral de hepatocarcinoma.".to_string(),
        ),
        7..=9 => (
            "Classe B (7 a 9 pontos)".to_string(),
            "80%".to_string(),
            "60%".to_string(),
            "Risco Cirúrgico Moderado (~30% de mortalidade perioperatória)".to_string(),
            "Comprometimento funcional hepático significativo. Cirurgias eletivas necessitam de otimização prévia rigorosa. Considerar avaliação para transplante.".to_string(),
        ),
        _ => (
            "Classe C (10 a 15 pontos)".to_string(),
            "45%".to_string(),
            "35%".to_string(),
            "Altíssimo Risco Cirúrgico (~75% a 82% de mortalidade perioperatória)".to_string(),
            "Cirrose descompensada terminal. Contraindicação para cirurgias eletivas não relacionadas a transplante hepático. Priorizar suporte intensivo e listagem.".to_string(),
        ),
    };

    Ok(ResultadoChildPugh {
        pontuacao_total: pontos,
        classe,
        sobrevida_1ano_percentual: s1,
        sobrevida_2anos_percentual: s2,
        risco_cirurgico_mortalidade: risco_cir,
        conduta_geral: conduta,
    })
}

/// Escore FIB-4 para Triagem Não Invasiva de Fibrose Hepática Avançada (MASLD / Esteatose / Hepatites).
pub fn calcular_fib4(
    idade: u32,
    ast: f64,
    alt: f64,
    plaquetas_milhares: f64,
) -> Result<ResultadoFib4, ClinicalError> {
    if ast <= 0.0 || alt <= 0.0 || plaquetas_milhares <= 0.0 || idade < 18 {
        return Err(ClinicalError::ParametroInvalido {
            campo: "ast / alt / plaquetas / idade".to_string(),
            valor: ast,
            motivo: "AST, ALT, plaquetas e idade devem ser valores positivos fisiológicos.".to_string(),
        });
    }

    // FIB-4 = (Idade * AST) / (Plaquetas * sqrt(ALT))
    let fib4 = (idade as f64 * ast) / (plaquetas_milhares * alt.sqrt());
    let fib4_arredondado = (fib4 * 100.0).round() / 100.0;

    let (estrato, valor_pred, conduta) = if fib4 < 1.30 {
        (
            "Baixa Probabilidade de Fibrose Avançada (FIB-4 < 1.30)".to_string(),
            "Alto Valor Preditivo Negativo (> 90%) para afastar fibrose F3-F4".to_string(),
            "Manejo na Atenção Primária / Ambulatório Geral. Foco na perda ponderal, controle do diabetes/dislipidemia e cessação de álcool. Repetir escore em 2 a 3 anos.".to_string(),
        )
    } else if fib4 > 2.67 {
        (
            "Alta Probabilidade de Fibrose Hepática Avançada / Cirrose (FIB-4 > 2.67)".to_string(),
            "Alto Valor Preditivo Positivo para fibrose avançada (F3-F4)".to_string(),
            "Encaminhamento obrigatório ao Hepatologista / Gastroenterologista. Realizar elastografia hepática (FibroScan) ou biópsia e rastrear varizes de esôfago.".to_string(),
        )
    } else {
        (
            "Faixa Indeterminada / Intermediária (1.30 a 2.67)".to_string(),
            "Não é possível confirmar ou excluir fibrose avançada isoladamente".to_string(),
            "Necessidade de método secundário não invasivo: solicitar Elastografia Hepática Transitória (FibroScan) ou ELF Test.".to_string(),
        )
    };

    Ok(ResultadoFib4 {
        score_fib4: fib4_arredondado,
        estratificacao_fibrose: estrato,
        valor_preditivo: valor_pred,
        conduta_encaminhamento: conduta,
    })
}

/// Escore de Glasgow-Blatchford para Hemorragia Digestiva Alta (HDA).
pub fn calcular_glasgow_blatchford(
    ureia_mg_dl: f64,
    hemoglobina_g_dl: f64,
    pas_mmhg: f64,
    fc_bpm: f64,
    sexo_feminino: bool,
    melena: bool,
    sincope: bool,
    hepatopatia: bool,
    insuficiencia_cardiaca: bool,
) -> Result<ResultadoGlasgowBlatchford, ClinicalError> {
    if ureia_mg_dl < 0.0 || hemoglobina_g_dl <= 0.0 || pas_mmhg <= 0.0 || fc_bpm <= 0.0 {
        return Err(ClinicalError::ParametroInvalido {
            campo: "laboratorio_ou_sinais_vitais".to_string(),
            valor: ureia_mg_dl,
            motivo: "Ureia, hemoglobina e sinais vitais devem ser válidos.".to_string(),
        });
    }

    let mut pontos: u8 = 0;

    // BUN = Ureia / 2.14
    let bun = ureia_mg_dl / 2.14;
    if bun >= 70.0 {
        pontos += 6;
    } else if bun >= 28.0 {
        pontos += 4;
    } else if bun >= 22.4 {
        pontos += 3;
    } else if bun >= 18.2 {
        pontos += 2;
    }

    // Hemoglobina
    if sexo_feminino {
        if hemoglobina_g_dl < 10.0 {
            pontos += 6;
        } else if hemoglobina_g_dl < 12.0 {
            pontos += 1;
        }
    } else {
        if hemoglobina_g_dl < 10.0 {
            pontos += 6;
        } else if hemoglobina_g_dl < 12.0 {
            pontos += 3;
        } else if hemoglobina_g_dl < 13.0 {
            pontos += 1;
        }
    }

    // PAS
    if pas_mmhg < 100.0 {
        pontos += 3;
    } else if pas_mmhg <= 109.0 {
        pontos += 2;
    } else if pas_mmhg <= 119.0 {
        pontos += 1;
    }

    // FC >= 100
    if fc_bpm >= 100.0 {
        pontos += 1;
    }

    // Apresentação e comorbidades
    if melena { pontos += 1; }
    if sincope { pontos += 2; }
    if hepatopatia { pontos += 2; }
    if insuficiencia_cardiaca { pontos += 2; }

    let baixo_risco = pontos <= 1;

    let (intervencao, conduta) = if baixo_risco {
        (
            "< 1% de necessidade de intervenção endoscópica, transfusional ou cirúrgica".to_string(),
            "BAIXO RISCO (Blatchford 0 ou 1): Candidato a manejo ambulatorial seguro com Endoscopia Digestiva Alta (EDA) eletiva em até 24 a 48 horas. Evita internações desnecessárias.".to_string(),
        )
    } else {
        (
            format!("{} ponto(s) - Alto Risco de necessidade de intervenção (> 50%)", pontos),
            "ALTO RISCO (Blatchford >= 2): Admissão hospitalar obrigatória. Obter 2 acessos calibrosos, tipagem e Prova Cruzada, iniciar IBP venoso em dose alta (Omeprazol 80 mg bolus + 8 mg/h contínuo) e realizar EDA diagnóstica e terapêutica precoce em até 24h (ou de emergência se instabilidade hemodinâmica).".to_string(),
        )
    };

    Ok(ResultadoGlasgowBlatchford {
        pontuacao_total: pontos,
        baixo_risco_ambulatorial: baixo_risco,
        necessidade_intervencao_percentual: intervencao,
        conduta_sugerida: conduta,
    })
}

/// Escore BISAP para Estratificação Precoce de Gravidade na Pancreatite Aguda.
pub fn calcular_bisap(
    ureia_maior_53_5: bool,
    glasgow_menor_15: bool,
    sirs_presente: bool,
    idade_maior_60: bool,
    derrame_pleural: bool,
) -> ResultadoBisap {
    let mut pontos: u8 = 0;
    if ureia_maior_53_5 { pontos += 1; }
    if glasgow_menor_15 { pontos += 1; }
    if sirs_presente { pontos += 1; }
    if idade_maior_60 { pontos += 1; }
    if derrame_pleural { pontos += 1; }

    let (categoria, mortalidade, uti, conduta) = match pontos {
        0 | 1 => (
            "Pancreatite Aguda Leve".to_string(),
            "< 1.0% de mortalidade".to_string(),
            false,
            "Hidratação venosa parcimoniosa com Ringer Lactato (manter diurese >= 0.5 mL/kg/h). Realimentação oral precoce tão logo haja controle da dor e náuseas.".to_string(),
        ),
        2 => (
            "Pancreatite Aguda Moderada".to_string(),
            "~1.6% de mortalidade".to_string(),
            false,
            "Internação em enfermaria com vigilância hemodinâmica e débito urinário rigoroso. Hidratação titulada e analgesia multimodal escalonada.".to_string(),
        ),
        _ => (
            format!("Pancreatite Aguda Grave (BISAP {} pts)", pontos),
            format!("{:.1}% de mortalidade hospitalar", if pontos == 3 { 5.3 } else if pontos == 4 { 12.7 } else { 22.5 }),
            true,
            "ALTO RISCO DE FALÊNCIA ORGÂNICA PERSISTENTE: Admissão imediata em Unidade de Terapia Intensiva (UTI). Hidratação guiada por metas (PAM >= 65 mmHg, diurese >= 0.5 a 1.0 mL/kg/h). Não indicar antibiótico profilático rotineiramente. TC de abdome contrastada após 72h para avaliar necrose.".to_string(),
        ),
    };

    ResultadoBisap {
        pontuacao_total: pontos,
        categoria_gravidade: categoria,
        mortalidade_prevista_percentual: mortalidade,
        indicacao_uti: uti,
        conduta,
    }
}

/// Escore de Alvarado para Apendicite Aguda.
pub fn calcular_alvarado(
    dor_fossa_iliaca_direita: bool,
    descompressao_brusca_positiva: bool,
    migracao_da_dor: bool,
    febre_maior_37_3: bool,
    anorexia: bool,
    nauseas_ou_vomitos: bool,
    leucocitose_maior_10000: bool,
    desvio_a_esquerda: bool,
) -> ResultadoAlvarado {
    let mut pontos: u8 = 0;
    // Sinais (dor FID e descompressão valem 2 pontos cada)
    if dor_fossa_iliaca_direita { pontos += 2; }
    if descompressao_brusca_positiva { pontos += 2; }
    // Sintomas
    if migracao_da_dor { pontos += 1; }
    if febre_maior_37_3 { pontos += 1; }
    if anorexia { pontos += 1; }
    if nauseas_ou_vomitos { pontos += 1; }
    // Laboratório (leucocitose vale 2 pontos)
    if leucocitose_maior_10000 { pontos += 2; }
    if desvio_a_esquerda { pontos += 1; }

    let (probabilidade, conduta) = match pontos {
        p if p <= 4 => (
            "Baixa Probabilidade de Apendicite Aguda (<= 4 pontos)".to_string(),
            "Apendicite muito improvável (< 5%). Avaliar diagnósticos diferenciais ginecológicos/urológicos. Alta com orientações de retorno se dor piorar.".to_string(),
        ),
        5 | 6 => (
            "Probabilidade Intermediária / Suspeita (5 a 6 pontos)".to_string(),
            "Necessidade de exame de imagem: solicitar Ultrassonografia de Abdome (ou Tomografia Computadorizada de Abdome com contraste em adultos/obesos). Manter jejum.".to_string(),
        ),
        _ => (
            "Alta Probabilidade de Apendicite Aguda (Alvarado >= 7)".to_string(),
            "Apendicite altamente provável (> 85%). Avaliação cirúrgica imediata para Apendicectomia videolaparoscópica ou aberta. Iniciar jejum, analgesia IV e antibióticos profiláticos.".to_string(),
        ),
    };

    ResultadoAlvarado {
        pontuacao_total: pontos,
        probabilidade_apendicite: probabilidade,
        conduta_cirurgica: conduta,
    }
}

/// Conversor de Corticoides Equivalentes e Esquema de Desmame.
pub fn calcular_equivalencia_corticoide(
    farmaco_origem: &str,
    dose_mg: f64,
) -> Result<ResultadoEquivalenciaCorticoide, ClinicalError> {
    if dose_mg <= 0.0 || dose_mg > 5000.0 {
        return Err(ClinicalError::ParametroInvalido {
            campo: "dose_mg".to_string(),
            valor: dose_mg,
            motivo: "Dose do corticoide deve estar entre 0.1 e 5000 mg.".to_string(),
        });
    }

    // Potências relativas equivalentes a 5 mg de Prednisona:
    // Cortisona: 25 mg
    // Hidrocortisona: 20 mg
    // Prednisona: 5 mg
    // Prednisolona: 5 mg
    // Metilprednisolona: 4 mg
    // Triancinolona: 4 mg
    // Dexametasona: 0.75 mg
    // Betametasona: 0.6 mg

    let fator_base_prednisona = match farmaco_origem.to_lowercase().trim() {
        f if f.contains("hidrocortisona") => 5.0 / 20.0,
        f if f.contains("cortisona") => 5.0 / 25.0,
        f if f.contains("metilprednisolona") => 5.0 / 4.0,
        f if f.contains("triancinolona") => 5.0 / 4.0,
        f if f.contains("dexametasona") => 5.0 / 0.75,
        f if f.contains("betametasona") => 5.0 / 0.6,
        _ => 1.0, // prednisona ou prednisolona
    };

    let dose_prednisona_eq = dose_mg * fator_base_prednisona;

    let tabela = vec![
        ItemDoseEquivalente {
            farmaco: "Hidrocortisona".to_string(),
            dose_equivalente_mg: (dose_prednisona_eq * (20.0 / 5.0) * 100.0).round() / 100.0,
            potencia_antiinflamatoria_relativa: 1.0,
            duracao_efeito_horas: "8 a 12 horas (Ação curta / Alta retenção de sódio)".to_string(),
        },
        ItemDoseEquivalente {
            farmaco: "Prednisona".to_string(),
            dose_equivalente_mg: (dose_prednisona_eq * 100.0).round() / 100.0,
            potencia_antiinflamatoria_relativa: 4.0,
            duracao_efeito_horas: "18 a 36 horas (Ação intermediária)".to_string(),
        },
        ItemDoseEquivalente {
            farmaco: "Prednisolona".to_string(),
            dose_equivalente_mg: (dose_prednisona_eq * 100.0).round() / 100.0,
            potencia_antiinflamatoria_relativa: 4.0,
            duracao_efeito_horas: "18 a 36 horas (Forma ativa oral / líquida infantil)".to_string(),
        },
        ItemDoseEquivalente {
            farmaco: "Metilprednisolona".to_string(),
            dose_equivalente_mg: (dose_prednisona_eq * (4.0 / 5.0) * 100.0).round() / 100.0,
            potencia_antiinflamatoria_relativa: 5.0,
            duracao_efeito_horas: "18 a 36 horas (Ação intermediária / Uso IV hospitalar)".to_string(),
        },
        ItemDoseEquivalente {
            farmaco: "Dexametasona".to_string(),
            dose_equivalente_mg: (dose_prednisona_eq * (0.75 / 5.0) * 100.0).round() / 100.0,
            potencia_antiinflamatoria_relativa: 25.0,
            duracao_efeito_horas: "36 a 72 horas (Ação longa / Mínimo efeito mineralocorticoide)".to_string(),
        },
    ];

    let desmame = if dose_prednisona_eq > 20.0 {
        "Uso > 3 semanas em dose supra-fisiológica (> 20 mg/dia de prednisona-eq) causa supressão do eixo HHA. Desmame escalonado: reduzir 5 a 10 mg a cada 1 a 2 semanas até atingir 20 mg/dia; a seguir, reduzir 2.5 a 5 mg a cada 2 a 4 semanas até 5 mg/dia; por fim, reduzir 1 mg a cada 2 a 4 semanas antes da suspensão total.".to_string()
    } else {
        "Uso em dose baixa ou tempo curto (< 2 semanas): geralmente não requer desmame longo, podendo ser suspenso diretamente ou reduzido em 3 a 5 dias.".to_string()
    };

    Ok(ResultadoEquivalenciaCorticoide {
        farmaco_origem: farmaco_origem.to_string(),
        dose_origem_mg: dose_mg,
        doses_equivalentes: tabela,
        esquema_desmame_sugerido: desmame,
    })
}

/// Antropometria Farmacológica: Peso Ideal (Devine), Peso Ajustado em Obesos, SC (Mosteller) e IMC.
pub fn calcular_antropometria_farmacologica(
    peso_kg: f64,
    altura_cm: f64,
    sexo_feminino: bool,
) -> Result<ResultadoAntropometriaFarmacologica, ClinicalError> {
    if peso_kg < 2.0 || peso_kg > 400.0 || altura_cm < 40.0 || altura_cm > 260.0 {
        return Err(ClinicalError::ParametroInvalido {
            campo: "peso_kg / altura_cm".to_string(),
            valor: peso_kg,
            motivo: "Peso e altura devem estar em faixas antropométricas plausíveis.".to_string(),
        });
    }

    // Peso Ideal de Devine (1974)
    let base_ideal = if sexo_feminino { 45.5 } else { 50.0 };
    let peso_ideal = base_ideal + 0.91 * (altura_cm - 152.4);
    let peso_ideal_final = if peso_ideal < 10.0 { peso_kg } else { peso_ideal };

    // Peso Ajustado para Obesidade (ABW): Peso Ideal + 0.40 * (Peso Real - Peso Ideal)
    let peso_ajustado = if peso_kg > peso_ideal_final * 1.20 {
        peso_ideal_final + 0.40 * (peso_kg - peso_ideal_final)
    } else {
        peso_kg
    };

    // Superfície Corporal de Mosteller: sqrt( (altura_cm * peso_kg) / 3600 )
    let sc = ((altura_cm * peso_kg) / 3600.0).sqrt();

    // IMC
    let altura_m = altura_cm / 100.0;
    let imc = peso_kg / (altura_m * altura_m);

    let classif_imc = if imc < 18.5 {
        "Abaixo do peso".to_string()
    } else if imc < 25.0 {
        "Eutrofia / Peso adequado".to_string()
    } else if imc < 30.0 {
        "Sobrepeso".to_string()
    } else if imc < 35.0 {
        "Obesidade Grau I".to_string()
    } else if imc < 40.0 {
        "Obesidade Grau II".to_string()
    } else {
        "Obesidade Grau III (Mórbida)".to_string()
    };

    let recomendacao = if peso_kg > peso_ideal_final * 1.20 {
        "PACIENTE COM OBESIDADE (> 120% do Peso Ideal): Para fármacos hidrofílicos que se distribuem fracamente no tecido adiposo (Aminoglicosídeos: Gentamicina, Amicacina; e profilaxia de Enoxaparina), utilizar o PESO AJUSTADO (ABW) para evitar superdosagem e nefrotoxicidade.".to_string()
    } else {
        "Peso dentro da faixa compatível com o peso ideal. Utilizar o PESO REAL para dosagem posológica padrão.".to_string()
    };

    Ok(ResultadoAntropometriaFarmacologica {
        peso_real_kg: peso_kg,
        altura_cm,
        peso_ideal_devine_kg: (peso_ideal_final * 10.0).round() / 10.0,
        peso_ajustado_obesidade_kg: (peso_ajustado * 10.0).round() / 10.0,
        superficie_corporal_mosteller_m2: (sc * 100.0).round() / 100.0,
        imc: (imc * 10.0).round() / 10.0,
        classificacao_imc: classif_imc,
        recomendacao_drogas_hidrofilicas: recomendacao,
    })
}

/// Escore de Centor Modificado por McIsaac para Faringite Estreptocócica (Streptococcus pyogenes do Grupo A).
pub fn calcular_centor_mcisaac(
    idade_anos: u16,
    febre_maior_38: bool,
    ausencia_de_tosse: bool,
    adenomegalia_cervical_anterior_dolorosa: bool,
    exsudato_amigdaliano: bool,
) -> ResultadoCentorMcIsaac {
    let mut pontos: i8 = 0;
    if febre_maior_38 { pontos += 1; }
    if ausencia_de_tosse { pontos += 1; }
    if adenomegalia_cervical_anterior_dolorosa { pontos += 1; }
    if exsudato_amigdaliano { pontos += 1; }

    // Idade
    if idade_anos <= 14 {
        pontos += 1;
    } else if idade_anos >= 45 {
        pontos -= 1;
    }

    let (prob, conduta) = match pontos {
        p if p <= 0 => (
            "1% a 2.5% de probabilidade de faringite bacteriana".to_string(),
            "Origem viral muito provável. Não realizar teste rápido nem prescrever antimicrobianos. Tratamento sintomático exclusivo (Dipirona / Paracetamol / anti-inflamatório).".to_string(),
        ),
        1 => (
            "5% a 10% de probabilidade".to_string(),
            "Faringite viral provável. Antimicrobiano não indicado rotineiramente. Tratamento sintomático.".to_string(),
        ),
        2 => (
            "11% a 17% de probabilidade".to_string(),
            "Indicação de Teste Rápido de Antígeno Estreptocócico (TRG) ou Cultura de Orofaringe. Prescrever antibiótico apenas se teste positivo.".to_string(),
        ),
        3 => (
            "28% a 35% de probabilidade".to_string(),
            "Realizar Teste Rápido de Antígeno Estreptocócico (ou iniciar antibiótico empiricamente se teste não disponível no serviço: Amoxicilina 500mg de 8/8h por 10 dias ou Benzetacil dose única).".to_string(),
        ),
        _ => (
            "51% a 53% de probabilidade de estreptococo Grupo A (Centor >= 4)".to_string(),
            "Alta probabilidade bacteriana: Tratamento antibiótico empírico indicado (Amoxicilina 500 mg VO de 8/8h por 10 dias OU Penicilina Benzatina 1.200.000 UI IM dose única).".to_string(),
        ),
    };

    ResultadoCentorMcIsaac {
        pontuacao_total: pontos,
        probabilidade_strepto_percentual: prob,
        indicacao_teste_rapido_ou_atb: conduta,
    }
}

/// Cálculo de Idade Gestacional e Data Provável do Parto pela Regra de Naegele (DUM).
pub fn calcular_idade_gestacional_dpp(
    dum_ano: u32,
    dum_mes: u32,
    dum_dia: u32,
    consulta_ano: u32,
    consulta_mes: u32,
    consulta_dia: u32,
) -> Result<ResultadoIdadeGestacionalDpp, ClinicalError> {
    if dum_mes < 1 || dum_mes > 12 || dum_dia < 1 || dum_dia > 31 {
        return Err(ClinicalError::ParametroInvalido {
            campo: "dum".to_string(),
            valor: dum_dia as f64,
            motivo: "Data da Última Menstruação (DUM) inválida.".to_string(),
        });
    }

    // Regra de Naegele: Dia + 7; Mês: se mes >= 4 subtrai 3, se mes < 4 soma 9 (e ajusta ano)
    let dpp_dia = dum_dia + 7;
    let (dpp_mes_ajustado, dpp_ano_ajustado) = if dum_mes >= 4 {
        (dum_mes - 3, dum_ano + 1)
    } else {
        (dum_mes + 9, dum_ano)
    };

    let dpp_formatada = format!("{:02}/{:02}/{:04}", dpp_dia.min(28), dpp_mes_ajustado, dpp_ano_ajustado);

    // Estimativa de dias decorridos de forma determinística
    let dias_dum = dum_ano as i64 * 365 + (dum_mes as i64 - 1) * 30 + dum_dia as i64;
    let dias_consulta = consulta_ano as i64 * 365 + (consulta_mes as i64 - 1) * 30 + consulta_dia as i64;

    let dias_totais = (dias_consulta - dias_dum).max(0);
    let semanas = (dias_totais / 7) as u16;
    let dias_resto = (dias_totais % 7) as u8;

    let (trimestre, exames) = if semanas < 14 {
        (
            "1º Trimestre (até 13 semanas e 6 dias)".to_string(),
            vec![
                "Ultrassonografia Obstétrica Precoce (ideal entre 11 e 13+6 semanas para TN)".to_string(),
                "Tipagem Sanguínea e Fator Rh + Coombs Indireto se Rh negativo".to_string(),
                "Hemograma, Glicemia de jejum, VDRL/Sífilis, HIV, Hepatite B (HBsAg), Toxoplasmose".to_string(),
                "Urina EAS + Urocultura com antibiograma".to_string(),
            ],
        )
    } else if semanas < 28 {
        (
            "2º Trimestre (14 a 27 semanas e 6 dias)".to_string(),
            vec![
                "Ultrassonografia Morfológica de 2º Trimestre (ideal entre 20 e 24 semanas)".to_string(),
                "Teste Oral de Tolerância à Glicose (TOTG 75g) entre 24 e 28 semanas".to_string(),
                "Repetir VDRL, HIV e Coombs indireto (se Rh negativo)".to_string(),
            ],
        )
    } else {
        (
            "3º Trimestre (28 a 40+ semanas)".to_string(),
            vec![
                "Swab vaginal e retal para Estreptococo do Grupo B (EGB) entre 35 e 37 semanas".to_string(),
                "Repetir Hemograma, VDRL, HIV, HBsAg e Toxoplasmose".to_string(),
                "Avaliação de vitalidade fetal e plano de parto".to_string(),
            ],
        )
    };

    Ok(ResultadoIdadeGestacionalDpp {
        idade_gestacional_semanas: semanas,
        idade_gestacional_dias: dias_resto,
        data_provavel_parto_naegele: dpp_formatada,
        trimestre_atual: trimestre,
        exames_do_trimestre: exames,
    })
}

/// Escore SOFA Completo (Sequential Organ Failure Assessment) e Critérios SIRS para Sepse.
pub fn calcular_sofa_completo(
    pao2_fio2: f64,
    em_ventilacao_mecanica: bool,
    plaquetas_milhares: f64,
    bilirrubina: f64,
    pam: f64,
    dopamina_mcg: f64,
    noradrenalina_mcg: f64,
    glasgow: u8,
    creatinina: f64,
    diurese_ml_dia: f64,
    temp_celsius: f64,
    fc_bpm: f64,
    fr_irpm: f64,
    leucocitos_totais: f64,
) -> ResultadoSofaCompleto {
    let mut sofa: u8 = 0;

    // 1. Respiratório (PaO2/FiO2)
    let resp = if pao2_fio2 < 100.0 && em_ventilacao_mecanica {
        4
    } else if pao2_fio2 < 200.0 && em_ventilacao_mecanica {
        3
    } else if pao2_fio2 < 300.0 {
        2
    } else if pao2_fio2 < 400.0 {
        1
    } else {
        0
    };
    sofa += resp;

    // 2. Coagulação (Plaquetas)
    let coag = if plaquetas_milhares < 20.0 {
        4
    } else if plaquetas_milhares < 50.0 {
        3
    } else if plaquetas_milhares < 100.0 {
        2
    } else if plaquetas_milhares < 150.0 {
        1
    } else {
        0
    };
    sofa += coag;

    // 3. Fígado (Bilirrubina)
    let hep = if bilirrubina >= 12.0 {
        4
    } else if bilirrubina >= 6.0 {
        3
    } else if bilirrubina >= 2.0 {
        2
    } else if bilirrubina >= 1.2 {
        1
    } else {
        0
    };
    sofa += hep;

    // 4. Cardiovascular (Hipotensão / DVA)
    let cardio = if noradrenalina_mcg > 0.1 || dopamina_mcg > 15.0 {
        4
    } else if noradrenalina_mcg > 0.0 || dopamina_mcg > 5.0 {
        3
    } else if dopamina_mcg > 0.0 {
        2
    } else if pam < 70.0 {
        1
    } else {
        0
    };
    sofa += cardio;

    // 5. Neurológico (Glasgow)
    let neuro = if glasgow < 6 {
        4
    } else if glasgow <= 9 {
        3
    } else if glasgow <= 12 {
        2
    } else if glasgow <= 14 {
        1
    } else {
        0
    };
    sofa += neuro;

    // 6. Renal (Creatinina ou Diurese)
    let renal = if creatinina >= 5.0 || diurese_ml_dia < 200.0 {
        4
    } else if creatinina >= 3.5 || diurese_ml_dia < 500.0 {
        3
    } else if creatinina >= 2.0 {
        2
    } else if creatinina >= 1.2 {
        1
    } else {
        0
    };
    sofa += renal;

    // Critérios SIRS (febre > 38 ou < 36; FC > 90; FR > 20 ou PaCO2 < 32; Leucócitos > 12000 ou < 4000)
    let mut sirs_count: u8 = 0;
    if temp_celsius > 38.0 || temp_celsius < 36.0 { sirs_count += 1; }
    if fc_bpm > 90.0 { sirs_count += 1; }
    if fr_irpm > 20.0 { sirs_count += 1; }
    if leucocitos_totais > 12000.0 || leucocitos_totais < 4000.0 { sirs_count += 1; }

    let sirs_pos = sirs_count >= 2;

    let (mortalidade, conduta) = match sofa {
        0 | 1 => ("< 5% de mortalidade na UTI".to_string(), "Sem evidência de disfunção orgânica grave.".to_string()),
        2..=5 => ("~10% a 15% de mortalidade".to_string(), "Sepse confirmada se associada a infecção documentada (variação do SOFA >= 2 pontos). Iniciar Bundle da 1ª hora (hemoculturas, lactato, antibiótico).".to_string()),
        6..=9 => ("~20% a 40% de mortalidade".to_string(), "Disfunção orgânica moderada a grave. Suporte intensivo e monitorização invasiva.".to_string()),
        10..=12 => ("~50% de mortalidade".to_string(), "Falência de múltiplos órgãos. Titulação de vasopressores e ventilação protetora.".to_string()),
        _ => ("> 80% a 95% de mortalidade hospitalar".to_string(), "Falência de múltiplos órgãos refratária. Suporte de vida avançado em UTI.".to_string()),
    };

    ResultadoSofaCompleto {
        sofa_total: sofa,
        mortalidade_estimada_uti: mortalidade,
        pontuacao_respiratoria: resp,
        pontuacao_coagulacao: coag,
        pontuacao_hepatica: hep,
        pontuacao_cardiovascular: cardio,
        pontuacao_neurologica: neuro,
        pontuacao_renal: renal,
        criterios_sirs_presentes: sirs_count,
        sirs_positivo: sirs_pos,
        conduta_sepse: conduta,
    }
}
