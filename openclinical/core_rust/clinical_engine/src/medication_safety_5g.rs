use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct AlertaCascataPrescricao {
    pub farmaco_causador: String,
    pub farmaco_prescrito: String,
    pub efeito_adverso_confundido: String,
    pub conduta_desprescricao: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ItemCargaAnticolinergica {
    pub medicamento: String,
    pub pontuacao_acb: u8,
    pub classificacao: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ResultadoCargaAnticolinergica {
    pub pontuacao_total: u8,
    pub classificacao_risco: String,
    pub itens: Vec<ItemCargaAnticolinergica>,
    pub sugestoes_desprescricao: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ResultadoTripleWhammy {
    pub detectado: bool,
    pub vasodilatador_eferente_ieca_bra: Option<String>,
    pub depletor_volume_diuretico: Option<String>,
    pub vasoconstritor_aferente_aine: Option<String>,
    pub gravidade: String,
    pub mecanismo_fisiopatologico: String,
    pub recomendacao_clinica: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ResultadoEscoreTisdale {
    pub pontuacao_total: u8,
    pub categoria_risco: String,
    pub risco_estimado_percentual: String,
    pub farmacos_qtc_presentes: Vec<String>,
    pub fatores_risco_detectados: Vec<String>,
    pub recomendacao_monitorizacao: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct AlertaFarmacogenomicoCpic {
    pub medicamento: String,
    pub gene: String,
    pub nivel_evidencia_cpic: String,
    pub alerta_clinico: String,
    pub recomendacao: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct RelatorioSeguranca5g {
    pub cascatas: Vec<AlertaCascataPrescricao>,
    pub carga_anticolinergica: ResultadoCargaAnticolinergica,
    pub triple_whammy: ResultadoTripleWhammy,
    pub escore_tisdale: ResultadoEscoreTisdale,
    pub farmacogenomica: Vec<AlertaFarmacogenomicoCpic>,
}

/// Normaliza nomes de fármacos removendo acentos e convertendo para caixa alta.
pub fn normalizar_termo_farmaco(texto: &str) -> String {
    texto
        .to_uppercase()
        .chars()
        .map(|c| match c {
            'Á' | 'À' | 'Ã' | 'Â' | 'Ä' => 'A',
            'É' | 'È' | 'Ê' | 'Ë' => 'E',
            'Í' | 'Ì' | 'Î' | 'Ï' => 'I',
            'Ó' | 'Ò' | 'Õ' | 'Ô' | 'Ö' => 'O',
            'Ú' | 'Ù' | 'Û' | 'Ü' => 'U',
            'Ç' => 'C',
            _ => c,
        })
        .collect()
}

fn contem_qualquer(farmaco_norm: &str, lista: &[&str]) -> bool {
    lista.iter().any(|&item| farmaco_norm.contains(item))
}

fn encontrar_correspondente<'a>(medicamentos_norm: &'a [String], lista: &[&str]) -> Option<&'a String> {
    medicamentos_norm.iter().find(|med| contem_qualquer(med, lista))
}

/// Detecta pares de cascatas iatrogênicas de prescrição validadas na literatura clínica (JAMA/Lancet).
pub fn detectar_cascatas_prescricao(medicamentos: &[String]) -> Vec<AlertaCascataPrescricao> {
    let meds_norm: Vec<String> = medicamentos.iter().map(|m| normalizar_termo_farmaco(m)).collect();
    let mut cascatas = Vec::new();

    // 1. Anlodipino -> Furosemida (Edema de MMII)
    let g1_a = &["ANLODIPIN", "AMLODIPIN", "NIFEDIPIN", "NORVASC", "MANIVASC", "LECANIDIPIN"];
    let g1_b = &["FUROSEMID", "HIDROCLOROTIAZID", "CLORTALIDON", "LASIX", "INDAPAMID"];
    if let (Some(a), Some(b)) = (encontrar_correspondente(&meds_norm, g1_a), encontrar_correspondente(&meds_norm, g1_b)) {
        cascatas.push(AlertaCascataPrescricao {
            farmaco_causador: a.clone(),
            farmaco_prescrito: b.clone(),
            efeito_adverso_confundido: "Edema maleolar pré-capilar induzido por bloqueador de canal de cálcio di-hidropiridínico (frequentemente confundido com retenção volêmica de insuficiência cardíaca).".to_string(),
            conduta_desprescricao: "Suspender o diurético se indicado apenas para o edema de tornozelos. Reduzir a dose do BCC ou associar IECA/BRA (promove dilatação venular pós-capilar, reduzindo a pressão hidrostática).".to_string(),
        });
    }

    // 2. IECA -> Antitussígeno / Broncodilatador (Tosse seca crônica)
    let g2_a = &["ENALAPRIL", "CAPTOPRIL", "RAMIPRIL", "LISINOPRIL", "PERINDOPRIL", "RENITEC"];
    let g2_b = &["CODEINA", "DROPROPIZIN", "ACEBROFILIN", "SALBUTAMOL", "CLOPERASTIN", "LEVODROPROPIZIN", "XAROPE"];
    if let (Some(a), Some(b)) = (encontrar_correspondente(&meds_norm, g2_a), encontrar_correspondente(&meds_norm, g2_b)) {
        cascatas.push(AlertaCascataPrescricao {
            farmaco_causador: a.clone(),
            farmaco_prescrito: b.clone(),
            efeito_adverso_confundido: "Tosse seca crônica induzida pelo acúmulo de bradicinina e substância P por inibição da enzima conversora de angiotensina (incidência de 5% a 20%).".to_string(),
            conduta_desprescricao: "Substituir o IECA por um Antagonista do Receptor da Angiotensina II (BRA - ex: Losartana 50mg) e suspender antitussígenos ou broncodilatadores desnecessários.".to_string(),
        });
    }

    // 3. Antidopaminérgico -> Antiparkinsoniano (Parkinsonismo secundário)
    let g3_a = &["METOCLOPRAMID", "HALOPERIDOL", "RISPERIDON", "FLUNARIZIN", "CINARIZIN", "PLASIL", "HALDOL"];
    let g3_b = &["LEVODOPA", "BIPERIDENO", "PROLOPA", "AKINETON", "PRAMIPEXOL"];
    if let (Some(a), Some(b)) = (encontrar_correspondente(&meds_norm, g3_a), encontrar_correspondente(&meds_norm, g3_b)) {
        cascatas.push(AlertaCascataPrescricao {
            farmaco_causador: a.clone(),
            farmaco_prescrito: b.clone(),
            efeito_adverso_confundido: "Parkinsonismo medicamentoso secundário ao bloqueio dopaminérgico D2 no estriado (tremor de repouso, rigidez plástica e bradicinesia).".to_string(),
            conduta_desprescricao: "Suspender o bloqueador dopaminérgico agressor. Se antiemético necessário, prescrever Ondansetrona ou Domperidona; se antipsicótico, trocar por Quetiapina em dose baixa.".to_string(),
        });
    }

    // 4. AINE -> Anti-hipertensivo (Descontrole pressórico)
    let g4_a = &["IBUPROFEN", "DICLOFENAC", "CETOPROFEN", "MELOXICAM", "NIMESULID", "NAPROXEN", "CELECOXIB", "ETORICOXIB", "TENOXICAM", "PIROXICAM", "CATAFLAM", "VOLTAREN", "TORAGESIC"];
    let g4_b = &["ANLODIPIN", "LOSARTAN", "ENALAPRIL", "HIDROCLOROTIAZID", "ATENOLOL", "VALSARTAN", "METOPROLOL"];
    if let (Some(a), Some(b)) = (encontrar_correspondente(&meds_norm, g4_a), encontrar_correspondente(&meds_norm, g4_b)) {
        cascatas.push(AlertaCascataPrescricao {
            farmaco_causador: a.clone(),
            farmaco_prescrito: b.clone(),
            efeito_adverso_confundido: "Elevação aguda da pressão arterial e retenção hidrossalina secundária à inibição da síntese renal de prostaglandinas vasodilatadoras (PGE2/PGI2).".to_string(),
            conduta_desprescricao: "Desprescrever o AINE antes de escalonar classes ou doses de anti-hipertensivos. Substituir por analgésico sem impacto cardiovascular (Dipirona até 1g 6/6h ou Paracetamol).".to_string(),
        });
    }

    // 5. Anticolinesterásico -> Antimuscarínico Urinário (Incontinência)
    let g5_a = &["DONEPEZIL", "RIVASTIGMIN", "GALANTAMIN", "ERANZ", "EXELON"];
    let g5_b = &["OXIBUTININ", "TOLTERODIN", "SOLIFENACIN", "RETEMIC"];
    if let (Some(a), Some(b)) = (encontrar_correspondente(&meds_norm, g5_a), encontrar_cmd(&meds_norm, g5_b)) {
        cascatas.push(AlertaCascataPrescricao {
            farmaco_causador: a.clone(),
            farmaco_prescrito: b.clone(),
            efeito_adverso_confundido: "Incontinência urinária de urgência decorrente do aumento da atividade parassimpática no músculo detrusor vesical estimulada pelo anticolinesterásico.".to_string(),
            conduta_desprescricao: "Evitar antagonismo farmacológico nulo: a Oxibutinina atravessa a barreira hematoencefálica e neutraliza a eficácia cognitiva do inibidor de acetilcolinesterase, acelerando o declínio cognitivo. Avaliar Mirabegrona.".to_string(),
        });
    }

    // 6. Fluoroquinolona -> Benzodiazepínico (Insônia / Agitação)
    let g6_a = &["CIPROFLOXACIN", "NORFLOXACIN", "LEVOFLOXACIN", "MOXIFLOXACIN"];
    let g6_b = &["DIAZEPAM", "CLONAZEPAM", "ZOLPIDEM", "LORAZEPAM", "MIDAZOLAM", "RIVOTRIL"];
    if let (Some(a), Some(b)) = (encontrar_correspondente(&meds_norm, g6_a), encontrar_correspondente(&meds_norm, g6_b)) {
        cascatas.push(AlertaCascataPrescricao {
            farmaco_causador: a.clone(),
            farmaco_prescrito: b.clone(),
            efeito_adverso_confundido: "Insônia aguda, pesadelos e hiperexcitabilidade do SNC por antagonismo no receptor GABA induzido pela fluoroquinolona.".to_string(),
            conduta_desprescricao: "Efeito adverso transitório do antimicrobiano. Não iniciar benzodiazepínico ou hipnótico agonista Z de forma continuada, sob alto risco de dependência e quedas em idosos.".to_string(),
        });
    }

    cascatas
}

fn encontrar_cmd<'a>(medicamentos_norm: &'a [String], lista: &[&str]) -> Option<&'a String> {
    encontrar_correspondente(medicamentos_norm, lista)
}

/// Calcula a Carga Anticolinérgica Cumulativa (ACB Score) e sugere estratégias de desprescrição em idosos.
pub fn calcular_carga_anticolinergica_acb(medicamentos: &[String]) -> ResultadoCargaAnticolinergica {
    let acb_peso_3 = &[
        "AMITRIPTILIN", "NORTRIPTILIN", "CLOMIPRAMIN", "IMIPRAMIN", "PROMETAZIN",
        "DEXCLORFENIRAMIN", "HIDROXIZIN", "DIMENIDRINAT", "ESCOPOLAMIN", "OXIBUTININ",
        "BIPERIDENO", "CLORPROMAZIN", "OLANZAPIN", "CICLOBENZAPRIN", "ORFENADRIN",
        "LEVOMEPROMAZIN", "TIORIDAZIN", "BUSCOPAN", "FERNERGAN", "POLARAMINE",
    ];
    let acb_peso_2 = &[
        "CARBAMAZEPIN", "OXCARBAZEPIN", "LOPERAMID", "CETIRIZIN", "BACLOFEN", "AMANTADIN",
    ];
    let acb_peso_1 = &[
        "FUROSEMID", "CAPTOPRIL", "HIDROCORTISON", "PREDNISON", "PREDNISOLON", "DIGOXIN",
        "VARFARIN", "CODEIN", "MORFIN", "HALOPERIDOL", "RISPERIDON", "QUETIAPIN",
        "TRAZODON", "VENLAFAXIN", "DIAZEPAM", "ALPRAZOLAM", "METOPROLOL", "ATENOLOL",
        "RANITIDIN", "PAROXETIN", "SERTRALIN",
    ];

    let mut total: u8 = 0;
    let mut itens = Vec::new();

    for med in medicamentos {
        let norm = normalizar_termo_farmaco(med);
        if contem_qualquer(&norm, acb_peso_3) {
            total = total.saturating_add(3);
            itens.push(ItemCargaAnticolinergica {
                medicamento: med.clone(),
                pontuacao_acb: 3,
                classificacao: "Anticolinérgico Potente (ACB = 3)".to_string(),
            });
        } else if contem_qualquer(&norm, acb_peso_2) {
            total = total.saturating_add(2);
            itens.push(ItemCargaAnticolinergica {
                medicamento: med.clone(),
                pontuacao_acb: 2,
                classificacao: "Anticolinérgico Moderado (ACB = 2)".to_string(),
            });
        } else if contem_qualquer(&norm, acb_peso_1) {
            total = total.saturating_add(1);
            itens.push(ItemCargaAnticolinergica {
                medicamento: med.clone(),
                pontuacao_acb: 1,
                classificacao: "Anticolinérgico Leve / Cumulativo (ACB = 1)".to_string(),
            });
        }
    }

    let (classificacao, sugestoes) = match total {
        0 => (
            "Ausência de Carga Anticolinérgica (ACB = 0)".to_string(),
            Vec::new(),
        ),
        1 => (
            "Carga Anticolinérgica Leve (ACB = 1) - Risco Baixo".to_string(),
            Vec::new(),
        ),
        2 => (
            "Carga Anticolinérgica Moderada (ACB = 2) - Monitorar sonolência, boca seca e constipação".to_string(),
            vec!["Monitorar sinais precoces de retenção urinária e prejuízo cognitivo.".to_string()],
        ),
        _ => {
            let mut s = vec![
                "ALERTA CRÍTICO: Carga Anticolinérgica Alta (ACB >= 3). Fortemente associada a Delirium, quedas, fraturas e aumento da mortalidade em idosos.".to_string(),
                "Substituir anti-histamínicos de 1ª geração (Dexclorfeniramina, Hidroxizina, Prometazina) por agentes de 2ª geração sem atividade anticolinérgica (Loratadina, Fexofenadina ou Desloratadina).".to_string(),
                "Substituir relaxantes musculares anticolinérgicos (Ciclobenzaprina, Orfenadrina) por analgesia simples com Dipirona e fisioterapia motora.".to_string(),
            ];
            if itens.iter().any(|i| contem_qualquer(&normalizar_termo_farmaco(&i.medicamento), &["AMITRIPTILIN", "NORTRIPTILIN", "CLOMIPRAMIN"])) {
                s.push("Reavaliar antidepressivos tricíclicos: para dor neuropática considerar Duloxetina ou Gabapentina; para depressão optar por ISRS com ACB = 0 (Sertralina ou Escitalopram).".to_string());
            }
            if itens.iter().any(|i| contem_qualquer(&normalizar_termo_farmaco(&i.medicamento), &["OXIBUTININ", "RETEMIC"])) {
                s.push("Para bexiga hiperativa, descontinuar Oxibutinina e avaliar Mirabegrona (agonista beta-3 adrenérgico) ou fisioterapia do assoalho pélvico.".to_string());
            }
            (
                "Carga Anticolinérgica Alta (ACB >= 3) - Alto Risco de Delirium e Declínio Cognitivo".to_string(),
                s,
            )
        }
    };

    ResultadoCargaAnticolinergica {
        pontuacao_total: total,
        classificacao_risco: classificacao,
        itens,
        sugestoes_desprescricao: sugestoes,
    }
}

/// Detecta a combinação iatrogênica "Triple Whammy" (IECA/BRA + Diurético + AINE).
pub fn detectar_triple_whammy_renal(medicamentos: &[String]) -> ResultadoTripleWhammy {
    let meds_norm: Vec<String> = medicamentos.iter().map(|m| normalizar_termo_farmaco(m)).collect();

    let g_ieca_bra = &[
        "ENALAPRIL", "CAPTOPRIL", "RAMIPRIL", "LISINOPRIL", "PERINDOPRIL", "BENAZEPRIL",
        "LOSARTAN", "VALSARTAN", "CANDESARTAN", "OLMESARTAN", "TELMISARTAN", "IRBESARTAN",
    ];
    let g_diuretico = &[
        "FUROSEMID", "BUMETANID", "HIDROCLOROTIAZID", "CLORTALIDON", "INDAPAMID",
        "ESPIRONOLACTON", "EPLERENON", "AMILORID", "LASIX",
    ];
    let g_aine = &[
        "IBUPROFEN", "DICLOFENAC", "CETOPROFEN", "NAPROXEN", "NIMESULID", "MELOXICAM",
        "CELECOXIB", "ETORICOXIB", "TENOXICAM", "PIROXICAM", "CETOROLACO", "INDOMETACIN",
        "CATAFLAM", "VOLTAREN", "TORAGESIC",
    ];

    let med_ieca_bra = encontrar_correspondente(&meds_norm, g_ieca_bra).cloned();
    let med_diuretico = encontrar_correspondente(&meds_norm, g_diuretico).cloned();
    let med_aine = encontrar_correspondente(&meds_norm, g_aine).cloned();

    let detectado = med_ieca_bra.is_some() && med_diuretico.is_some() && med_aine.is_some();

    if detectado {
        ResultadoTripleWhammy {
            detectado: true,
            vasodilatador_eferente_ieca_bra: med_ieca_bra,
            depletor_volume_diuretico: med_diuretico,
            vasoconstritor_aferente_aine: med_aine,
            gravidade: "Contraindicada / Crítica (Alto Risco de Injúria Renal Aguda e Hipercalemia)".to_string(),
            mecanismo_fisiopatologico: "Colapso hemodinâmico intraglomerular: o AINE vasoconstringe a arteríola aferente (inibe PGE2/PGI2), o diurético espolia volume plasmático reduzindo a perfusão renal, e o IECA/BRA vasodilata a arteríola eferente (bloqueia angiotensina II), zerando o gradiente de filtração glomerular.".to_string(),
            recomendacao_clinica: "Suspender imediatamente o AINE prescrito. Substituir por analgésico sem nefrotoxicidade hemodinâmica (Dipirona até 1g de 6/6h ou Paracetamol até 750mg de 8/8h). Hidratar e dosar creatinina, ureia e potássio sérico em 48 a 72h.".to_string(),
        }
    } else {
        ResultadoTripleWhammy {
            detectado: false,
            vasodilatador_eferente_ieca_bra: med_ieca_bra,
            depletor_volume_diuretico: med_diuretico,
            vasoconstritor_aferente_aine: med_aine,
            gravidade: "Sem detecção de combinação Triple Whammy".to_string(),
            mecanismo_fisiopatologico: String::new(),
            recomendacao_clinica: "Manter monitorização rotineira de função renal e pressão arterial.".to_string(),
        }
    }
}

/// Escore de Tisdale para estratificação de risco de prolongamento do intervalo QTc e Torsades de Pointes.
pub fn calcular_escore_tisdale_qtc(
    medicamentos: &[String],
    idade: u32,
    sexo_feminino: bool,
    potassio_menor_igual_3_5: bool,
    qtc_basal_maior_igual_450: bool,
    iam_agudo: bool,
    insuficiencia_cardiaca_ou_sepse: bool,
) -> ResultadoEscoreTisdale {
    let meds_norm: Vec<String> = medicamentos.iter().map(|m| normalizar_termo_farmaco(m)).collect();

    let farmacos_qtc_lista = &[
        "ONDANSETRON", "AZITROMICIN", "CLARITROMICIN", "ERITROMICIN", "CIPROFLOXACIN",
        "LEVOFLOXACIN", "MOXIFLOXACIN", "HALOPERIDOL", "CLORPROMAZIN", "RISPERIDON",
        "QUETIAPIN", "ESCITALOPRAM", "CITALOPRAM", "AMITRIPTILIN", "NORTRIPTILIN",
        "AMIODARON", "SOTALOL", "FLUCONAZOL", "METADON", "DOMPERIDON", "HIDROXICLOROQUIN",
    ];

    let mut qtc_encontrados = Vec::new();
    for med in &meds_norm {
        for &alvo in farmacos_qtc_lista {
            if med.contains(alvo) && !qtc_encontrados.contains(med) {
                qtc_encontrados.push(med.clone());
            }
        }
    }

    let usa_diuretico_alca = meds_norm.iter().any(|m| m.contains("FUROSEMID") || m.contains("BUMETANID") || m.contains("LASIX"));

    let mut pontos: u8 = 0;
    let mut fatores = Vec::new();

    if idade >= 68 {
        pontos += 1;
        fatores.push("Idade >= 68 anos (+1 ponto)".to_string());
    }
    if sexo_feminino {
        pontos += 1;
        fatores.push("Sexo biológico feminino (+1 ponto)".to_string());
    }
    if usa_diuretico_alca {
        pontos += 1;
        fatores.push("Uso concomitante de diurético de alça / Furosemida (+1 ponto)".to_string());
    }
    if potassio_menor_igual_3_5 {
        pontos += 2;
        fatores.push("Hipocalemia com K+ <= 3.5 mEq/L (+2 pontos)".to_string());
    }
    if qtc_basal_maior_igual_450 {
        pontos += 2;
        fatores.push("Intervalo QTc basal prolongado >= 450 ms (+2 pontos)".to_string());
    }
    if iam_agudo {
        pontos += 2;
        fatores.push("Infarto Agudo do Miocárdio recente (+2 pontos)".to_string());
    }
    if insuficiencia_cardiaca_ou_sepse {
        pontos += 3;
        fatores.push("Insuficiência Cardíaca descompensada ou Sepse (+3 pontos)".to_string());
    }

    let qtd_farmacos_qtc = qtc_encontrados.len();
    if qtd_farmacos_qtc >= 2 {
        pontos += 6;
        fatores.push(format!(">= 2 fármacos que prolongam o QTc na prescrição (+6 pontos): {:?}", qtc_encontrados));
    } else if qtd_farmacos_qtc == 1 {
        pontos += 3;
        fatores.push(format!("1 fármaco que prolonga o QTc na prescrição (+3 pontos): {:?}", qtc_encontrados));
    }

    let (categoria, risco, recomendacao) = if pontos <= 6 {
        (
            "Baixo Risco de Prolongamento QTc".to_string(),
            "~15% de incidência prevista de QTc > 500 ms".to_string(),
            "Risco baixo pelo Escore de Tisdale. Manter vigilância clínica e eletrocardiográfica de rotina.".to_string(),
        )
    } else if pontos <= 10 {
        (
            "Moderado Risco de Prolongamento QTc".to_string(),
            "~37% de incidência prevista de QTc > 500 ms".to_string(),
            "Risco moderado: Realizar ECG prévio e seriado após introdução das medicações. Otimizar eletrólitos séricos mantendo K+ >= 4.0 mEq/L e Magnésio >= 2.0 mg/dL.".to_string(),
        )
    } else {
        (
            "Alto Risco de Torsades de Pointes e PCR".to_string(),
            "~73% de incidência prevista de QTc > 500 ms".to_string(),
            "ALERTA CRÍTICO: Risco muito alto de fibrilação ventricular / Torsades de Pointes. Evitar prescrever novos fármacos que alarguem o QTc, monitorar em telemetria contínua e suspender agentes duplicados.".to_string(),
        )
    };

    ResultadoEscoreTisdale {
        pontuacao_total: pontos,
        categoria_risco: categoria,
        risco_estimado_percentual: risco,
        farmacos_qtc_presentes: qtc_encontrados,
        fatores_risco_detectados: fatores,
        recomendacao_monitorizacao: recomendacao,
    }
}

/// Consulta diretrizes e alertas silenciosos de Farmacogenômica com nível de evidência CPIC Nível A.
pub fn consultar_alertas_farmacogenomicos_cpic(medicamentos: &[String]) -> Vec<AlertaFarmacogenomicoCpic> {
    let meds_norm: Vec<String> = medicamentos.iter().map(|m| normalizar_termo_farmaco(m)).collect();
    let mut alertas = Vec::new();

    if let Some(med) = encontrar_correspondente(&meds_norm, &["CLOPIDOGREL", "PLAVIX"]) {
        alertas.push(AlertaFarmacogenomicoCpic {
            medicamento: med.clone(),
            gene: "CYP2C19".to_string(),
            nivel_evidencia_cpic: "Nível A (Diretriz CPIC / FDA Black Box)".to_string(),
            alerta_clinico: "O Clopidogrel é uma pró-droga que requer ativação pela enzima hepática CYP2C19. Indivíduos metabolizadores intermediários (*1/*2, *1/*3) ou lentos (*2/*2, *3/*3) apresentam geração reduzida do metabólito ativo e maior risco de trombose de stent e novos eventos isquêmicos.".to_string(),
            recomendacao: "Em Síndrome Coronariana Aguda com Intervenção Coronária Percutânea (ICP), considerar uso preferencial de Prasugrel ou Ticagrelor, fármacos com menor dependência de ativação pela CYP2C19.".to_string(),
        });
    }

    if let Some(med) = encontrar_correspondente(&meds_norm, &["CODEIN", "TYLEX", "TRAMADOL"]) {
        alertas.push(AlertaFarmacogenomicoCpic {
            medicamento: med.clone(),
            gene: "CYP2D6".to_string(),
            nivel_evidencia_cpic: "Nível A (Diretriz CPIC)".to_string(),
            alerta_clinico: "A Codeína e o Tramadol são bioativados pela CYP2D6 em metabólitos opioides ativos (morfina e O-desmetiltramadol). Em metabolizadores ultrarrápidos há risco grave de intoxicação opioide e parada respiratória fatal; em metabolizadores lentos ocorre falha analgésica completa.".to_string(),
            recomendacao: "Evitar Codeína e Tramadol em metabolizadores ultrarrápidos ou lentos da CYP2D6. Optar por analgésicos não opioides ou opioides que não dependem do metabolismo de primeira passagem pela CYP2D6 (Morfina direta em dose titulada).".to_string(),
        });
    }

    if let Some(med) = encontrar_correspondente(&meds_norm, &["SINVASTATIN", "ZOCOR"]) {
        alertas.push(AlertaFarmacogenomicoCpic {
            medicamento: med.clone(),
            gene: "SLCO1B1".to_string(),
            nivel_evidencia_cpic: "Nível A (Diretriz CPIC)".to_string(),
            alerta_clinico: "Polimorfismos no transportador hepático SLCO1B1 (variante c.521T>C / alelo *5) aumentam drasticamente a concentração plasmática de Sinvastatina, elevando em mais de 4 vezes o risco de miopatia grave e rabdomiólise fatal na dose de 40 a 80 mg/dia.".to_string(),
            recomendacao: "Em portadores de variantes SLCO1B1 de função reduzida, prescrever doses baixas de Sinvastatina (máximo 20 mg/dia) ou substituir por estatina com captação hepática menos dependente de SLCO1B1 (Rosuvastatina, Atorvastatina ou Pravastatina).".to_string(),
        });
    }

    if let Some(med) = encontrar_correspondente(&meds_norm, &["ALOPURINOL", "ZYLORIC"]) {
        alertas.push(AlertaFarmacogenomicoCpic {
            medicamento: med.clone(),
            gene: "HLA-B*58:01".to_string(),
            nivel_evidencia_cpic: "Nível A (Diretriz CPIC / Colégio Americano de Reumatologia)".to_string(),
            alerta_clinico: "Presença do alelo HLA-B*58:01 está fortemente associada a Reações Adversas Cutâneas Graves (SCARs), incluindo Síndrome de Stevens-Johnson (SSJ), Necrólise Epidérmica Tóxica (NET) e síndrome DRESS induzidas pelo Alopurinol.".to_string(),
            recomendacao: "A triagem de HLA-B*58:01 é recomendada especialmente em populações de ascendência do Leste Asiático e Afrodescendentes antes de prescrever Alopurinol. Em portadores positivos, o Alopurinol é estritamente contraindicado; considerar Febuxostate.".to_string(),
        });
    }

    if let Some(med) = encontrar_correspondente(&meds_norm, &["CARBAMAZEPIN", "TEGRETOL", "FENITOIN", "HIDANTAL"]) {
        alertas.push(AlertaFarmacogenomicoCpic {
            medicamento: med.clone(),
            gene: "HLA-B*15:02 e CYP2C9".to_string(),
            nivel_evidencia_cpic: "Nível A (Diretriz CPIC)".to_string(),
            alerta_clinico: "O alelo HLA-B*15:02 confere risco altíssimo de Stevens-Johnson/NET com Carbamazepina e Fenitoína. Variantes de perda de função no gene CYP2C9 reduzem a depuração da Fenitoína, acumulando níveis tóxicos com ataxia e nistagmo.".to_string(),
            recomendacao: "Contraindicado iniciar Carbamazepina ou Fenitoína se HLA-B*15:02 positivo. Optar por anticonvulsivantes com menor imunogenicidade cutânea (Levetiracetam ou Ácido Valproico).".to_string(),
        });
    }

    if let Some(med) = encontrar_correspondente(&meds_norm, &["VARFARIN", "MAREVAN", "COUMADIN"]) {
        alertas.push(AlertaFarmacogenomicoCpic {
            medicamento: med.clone(),
            gene: "CYP2C9 e VKORC1".to_string(),
            nivel_evidencia_cpic: "Nível A (Diretriz CPIC)".to_string(),
            alerta_clinico: "Variantes alélicas CYP2C9 (*2 e *3) reduzem o clearance da S-varfarina, enquanto o polimorfismo no promotor VKORC1 (-1639G>A) aumenta a sensibilidade farmacológica à inibição do ciclo da vitamina K, exigindo reduções de 30% a 70% na dose inicial.".to_string(),
            recomendacao: "Iniciar com doses conservadoras de Varfarina guiadas por algoritmo farmacogenômico ou priorizar Anticoagulantes Orais Diretos (DOACs - Apixabana/Rivaroxabana) em casos elegíveis sem prótese valvar mecânica.".to_string(),
        });
    }

    alertas
}

/// Avalia integralmente o pacote de Segurança de 5ª Geração (Cascatas, ACB, Triple Whammy, Tisdale e CPIC).
pub fn avaliar_seguranca_medicamentosa_5g(
    medicamentos: &[String],
    idade: u32,
    sexo_feminino: bool,
    potassio_menor_igual_3_5: bool,
    qtc_basal_maior_igual_450: bool,
    iam_agudo: bool,
    insuficiencia_cardiaca_ou_sepse: bool,
) -> RelatorioSeguranca5g {
    RelatorioSeguranca5g {
        cascatas: detectar_cascatas_prescricao(medicamentos),
        carga_anticolinergica: calcular_carga_anticolinergica_acb(medicamentos),
        triple_whammy: detectar_triple_whammy_renal(medicamentos),
        escore_tisdale: calcular_escore_tisdale_qtc(
            medicamentos,
            idade,
            sexo_feminino,
            potassio_menor_igual_3_5,
            qtc_basal_maior_igual_450,
            iam_agudo,
            insuficiencia_cardiaca_ou_sepse,
        ),
        farmacogenomica: consultar_alertas_farmacogenomicos_cpic(medicamentos),
    }
}
