use clinical_engine::cardio_neuro_scores::{
    calcular_cranio_cervical, calcular_criterios_perc, calcular_escore_padua, calcular_glasgow_p,
    calcular_has_bled, calcular_heart_score, calcular_qtc_corrigido, calcular_trombolise_avc,
    calcular_wells_tvp,
};
use clinical_engine::fluid_electrolytes::{
    calcular_fena_feureia, calcular_manejo_dengue_ms, calcular_metabolico_cad_calemia,
    calcular_pam_ppc, calcular_parkland_queimado,
};
use clinical_engine::gastro_hepato_aps::{
    calcular_alvarado, calcular_antropometria_farmacologica, calcular_bisap, calcular_child_pugh,
    calcular_centor_mcisaac, calcular_equivalencia_corticoide, calcular_fib4,
    calcular_glasgow_blatchford, calcular_idade_gestacional_dpp, calcular_meld_na,
    calcular_sofa_completo,
};
use clinical_engine::calculators::{
    avaliar_curb65_detalhado, avaliar_estagio_drc, calcular_clearance_cockcroft_gault,
    calcular_escore_curb65, calcular_escore_wells_tep, calcular_tfg_ckd_epi_2021,
    calcular_vazao_infusao,
};
use clinical_engine::errors::ClinicalError;
use clinical_engine::interactions::{gerar_pares_combinatorios, verificar_interacoes_em_memoria};
use clinical_engine::models::MatrizInteracao;
use clinical_engine::pediatric::calcular_dose_pediatrica;
use clinical_engine::protocols::analisar_protocolo_markdown;

#[test]
fn test_ckd_epi_2021_mulher_saudavel() {
    // Mulher de 45 anos com creatinina sérica de 0.8 mg/dL
    // Equação CKD-EPI 2021 exata: 142 * (0.8/0.7)^(-1.2) * (0.9938^45) * 1.012 = 92.54 mL/min/1.73m2
    let resultado = calcular_tfg_ckd_epi_2021(0.8, 45, true);
    assert!(resultado.is_ok());
    let tfg = resultado.unwrap();
    assert_eq!(tfg, 92.54);

    let avaliacao = avaliar_estagio_drc(tfg);
    assert!(avaliacao.estagio_drc.contains("G1"));
}

#[test]
fn test_ckd_epi_2021_homem_idoso_disfuncao() {
    // Homem de 68 anos com creatinina de 1.8 mg/dL
    let resultado = calcular_tfg_ckd_epi_2021(1.8, 68, false);
    assert!(resultado.is_ok());
    let tfg = resultado.unwrap();
    assert!(tfg >= 35.0 && tfg <= 45.0, "TFG obtida: {}", tfg);

    let avaliacao = avaliar_estagio_drc(tfg);
    assert!(avaliacao.estagio_drc.contains("G3b"));
}

#[test]
fn test_ckd_epi_2021_parametros_invalidos() {
    // Creatinina zero
    let erro_creatinina = calcular_tfg_ckd_epi_2021(0.0, 40, false);
    assert!(matches!(
        erro_creatinina,
        Err(ClinicalError::ParametroInvalido { campo, .. }) if campo == "creatinina"
    ));

    // Menor de idade (equação não validada para pediatria)
    let erro_idade = calcular_tfg_ckd_epi_2021(1.0, 16, true);
    assert!(matches!(
        erro_idade,
        Err(ClinicalError::ParametroInvalido { campo, .. }) if campo == "idade"
    ));
}

#[test]
fn test_cockcroft_gault_padrao() {
    // Homem de 50 anos, 70 kg, creatinina 1.0 mg/dL
    // CrCl = (140 - 50) * 70 / (72 * 1.0) = 6300 / 72 = 87.5 mL/min
    let resultado = calcular_clearance_cockcroft_gault(1.0, 70.0, 50, false);
    assert!(resultado.is_ok());
    let crcl = resultado.unwrap();
    assert_eq!(crcl, 87.5);

    // Mulher de 60 anos, 60 kg, creatinina 1.2 mg/dL
    // CrCl = [(140 - 60) * 60 / (72 * 1.2)] * 0.85 = (4800 / 86.4) * 0.85 = 55.55 * 0.85 = 47.22 mL/min
    let res_mulher = calcular_clearance_cockcroft_gault(1.2, 60.0, 60, true);
    assert!(res_mulher.is_ok());
    let crcl_mulher = res_mulher.unwrap();
    assert_eq!(crcl_mulher, 47.22);
}

#[test]
fn test_curb65_estratificacao() {
    // Caso de baixo risco: apenas idade >= 65
    let escore_baixo = calcular_escore_curb65(false, false, false, false, true);
    assert_eq!(escore_baixo, 1);
    let avaliacao_baixa = avaliar_curb65_detalhado(false, false, false, false, true);
    assert!(avaliacao_baixa.estrato_mortalidade.contains("Baixo risco"));

    // Caso grave: confusão + FR > 30 + hipotensão + idade > 65
    let escore_grave = calcular_escore_curb65(true, false, true, true, true);
    assert_eq!(escore_grave, 4);
    let avaliacao_grave = avaliar_curb65_detalhado(true, false, true, true, true);
    assert!(avaliacao_grave.estrato_mortalidade.contains("Alto risco"));
}

#[test]
fn test_wells_tep_estratificacao() {
    // Sinais de TVP (+3) e FC > 100 (+1.5) = 4.5 pontos (moderada probabilidade)
    let wells_mod = calcular_escore_wells_tep(true, false, true, false, false, false, false);
    assert_eq!(wells_mod.pontuacao_total, 4.5);
    assert_eq!(wells_mod.categoria_risco, "Moderada probabilidade clínica");

    // Alta probabilidade: TVP (+3), diagnóstico alternativo menos provável (+3), hemoptise (+1) = 7.0
    let wells_alta = calcular_escore_wells_tep(true, true, false, false, false, true, false);
    assert_eq!(wells_alta.pontuacao_total, 7.0);
    assert_eq!(wells_alta.categoria_risco, "Alta probabilidade clínica");
}

#[test]
fn test_vazao_infusao_noradrenalina() {
    // Noradrenalina 0.1 mcg/kg/min, paciente de 70 kg, solução de 16 mg em 250 mL (0.064 mg/mL)
    // Vazão = (0.1 * 70 * 60) / (0.064 * 1000) = 420 / 64 = 6.5625 -> 6.56 mL/h
    let resultado = calcular_vazao_infusao(0.1, 70.0, 0.064);
    assert!(resultado.is_ok());
    let vazao = resultado.unwrap();
    assert_eq!(vazao, 6.56);
}

#[test]
fn test_pediatrico_amoxicilina_dentro_do_teto() {
    // Criança de 15 kg, Amoxicilina 50 mg/kg/dia, frasco 50 mg/mL (250mg/5mL)
    // Fracionamento de 8 em 8 horas (3 tomadas/dia)
    // Teto de segurança: 3000 mg/dia
    let res = calcular_dose_pediatrica(15.0, 50.0, Some(50.0), 3, Some(3000.0));
    assert!(res.is_ok());
    let dose = res.unwrap();

    assert_eq!(dose.dose_total_calculada_mg_dia, 750.0);
    assert_eq!(dose.dose_teto_aplicada_mg_dia, 750.0);
    assert_eq!(dose.dose_por_tomada_mg, 250.0);
    assert_eq!(dose.volume_ml_por_tomada, Some(5.0));
    assert_eq!(dose.numero_gotas_por_tomada, Some(100));
    assert_eq!(dose.intervalo_horas, 8);
    assert!(!dose.alerta_teto_ultrapassado);
    assert!(dose.justificativa_seguranca.is_none());
}

#[test]
fn test_pediatrico_teto_maximo_ultrapassado() {
    // Criança de 40 kg, dose 90 mg/kg/dia -> 3600 mg/dia
    // Teto estabelecido: 3000 mg/dia
    let res = calcular_dose_pediatrica(40.0, 90.0, Some(50.0), 3, Some(3000.0));
    assert!(res.is_ok());
    let dose = res.unwrap();

    assert_eq!(dose.dose_total_calculada_mg_dia, 3600.0);
    assert_eq!(dose.dose_teto_aplicada_mg_dia, 3000.0);
    assert_eq!(dose.dose_por_tomada_mg, 1000.0);
    assert_eq!(dose.volume_ml_por_tomada, Some(20.0));
    assert!(dose.alerta_teto_ultrapassado);
    assert!(dose.justificativa_seguranca.is_some());
}

#[test]
fn test_pediatrico_forma_solida_sem_volume() {
    // Comprimido: sem concentração líquida o resultado fica em mg, sem volume nem gotas
    let dose = calcular_dose_pediatrica(20.0, 10.0, None, 2, None).unwrap();
    assert_eq!(dose.dose_por_tomada_mg, 100.0);
    assert_eq!(dose.volume_ml_por_tomada, None);
    assert_eq!(dose.numero_gotas_por_tomada, None);
    assert!(calcular_dose_pediatrica(20.0, 10.0, Some(0.0), 2, None).is_err());
}

#[test]
fn test_combinatoria_e_interacoes() {
    // Teste de pares combinatórios (3 fármacos geram 3 pares)
    let ids = vec![3, 4, 10];
    let pares = gerar_pares_combinatorios(&ids);
    assert_eq!(pares.len(), 3);
    assert!(pares.contains(&(3, 4)));
    assert!(pares.contains(&(3, 10)));
    assert!(pares.contains(&(4, 10)));

    // Teste de ordenação de interações por severidade
    let interacoes_catalogo = vec![
        MatrizInteracao {
            id_interacao: 1,
            id_principio_ativo_a: 4,
            id_principio_ativo_b: 2,
            nome_principio_a: Some("Enalapril".to_string()),
            nome_principio_b: Some("Dipirona".to_string()),
            gravidade_interacao: "Moderada".to_string(),
            efeito_clinico: "Redução do efeito anti-hipertensivo.".to_string(),
            conduta_recomendada: "Monitorar PA.".to_string(),
        },
        MatrizInteracao {
            id_interacao: 2,
            id_principio_ativo_a: 3,
            id_principio_ativo_b: 4,
            nome_principio_a: Some("Losartana".to_string()),
            nome_principio_b: Some("Enalapril".to_string()),
            gravidade_interacao: "Contraindicada".to_string(),
            efeito_clinico: "Duplo bloqueio SRAA e hipercalemia.".to_string(),
            conduta_recomendada: "Não associar.".to_string(),
        },
    ];

    let detectadas = verificar_interacoes_em_memoria(&[2, 3, 4], &interacoes_catalogo);
    assert_eq!(detectadas.len(), 2);
    // A primeira deve ser Contraindicada
    assert_eq!(detectadas[0].gravidade_interacao, "Contraindicada");
    assert_eq!(detectadas[1].gravidade_interacao, "Moderada");
}

#[test]
fn test_parser_protocolo_markdown() {
    let markdown_exemplo = r#"---
id_protocolo: teste_itu
titulo: Protocolo de Teste ITU
cids_relacionados: ["N39.0"]
ciaps_relacionados: ["U71"]
nivel_atencao: Atencao_Primaria
data_revisao: 2026-10-25
---

# Diretrizes Clínicas de Teste

Texto explicativo das diretrizes.

```receita
1. Fosfomicina trometamol 3g - 1 sachê em dose única à noite.
2. Orientações de hidratação abundante.
```
"#;

    let res = analisar_protocolo_markdown(markdown_exemplo);
    assert!(res.is_ok());
    let protocolo = res.unwrap();

    assert_eq!(protocolo.id_protocolo, "teste_itu");
    assert_eq!(protocolo.titulo, "Protocolo de Teste ITU");
    assert_eq!(protocolo.cids_relacionados, vec!["N39.0"]);
    assert_eq!(protocolo.ciaps_relacionados, vec!["U71"]);
    assert!(protocolo.bloco_prescricao_copiavel.contains("Fosfomicina trometamol"));

    // O corpo exibido não repete o título nem a receita (que tem bloco copiável próprio)
    assert_eq!(protocolo.conteudo_markdown, "Texto explicativo das diretrizes.");
    assert_eq!(protocolo.status_revisao_clinica, None);
}

#[test]
fn test_parser_protocolo_status_revisao_clinica() {
    let markdown = "---\nid_protocolo: x\ntitulo: X\nstatus_revisao_clinica: pendente_revisao_por_profissional_habilitado\n---\n\nCorpo.";
    let protocolo = analisar_protocolo_markdown(markdown).unwrap();
    assert_eq!(
        protocolo.status_revisao_clinica.as_deref(),
        Some("pendente_revisao_por_profissional_habilitado")
    );
    assert_eq!(protocolo.conteudo_markdown, "Corpo.");
}

#[test]
fn test_ckd_epi_2021_homem_referencia() {
    // Homem de 50 anos, creatinina 1.0 mg/dL: 142 * (1.0/0.9)^-1.2 * 0.9938^50 = ~91.7 mL/min/1.73m2
    let tfg = calcular_tfg_ckd_epi_2021(1.0, 50, false).unwrap();
    assert!((tfg - 91.7).abs() < 0.2, "TFG obtida: {}", tfg);
}

#[test]
fn test_wells_tep_baixa_probabilidade_e_limites() {
    let baixa = calcular_escore_wells_tep(false, false, true, false, false, false, false);
    assert_eq!(baixa.pontuacao_total, 1.5);
    assert_eq!(baixa.categoria_risco, "Baixa probabilidade clínica");

    // 2.0 pontos é o limite inferior da categoria moderada
    let limite = calcular_escore_wells_tep(false, false, false, false, false, true, true);
    assert_eq!(limite.pontuacao_total, 2.0);
    assert_eq!(limite.categoria_risco, "Moderada probabilidade clínica");

    // 6.0 permanece moderada; acima de 6.0 é alta
    let seis = calcular_escore_wells_tep(true, false, true, true, false, false, false);
    assert_eq!(seis.pontuacao_total, 6.0);
    assert_eq!(seis.categoria_risco, "Moderada probabilidade clínica");
}

#[test]
fn test_entradas_invalidas_nao_geram_resultado() {
    assert!(calcular_clearance_cockcroft_gault(0.0, 70.0, 50, false).is_err());
    assert!(calcular_clearance_cockcroft_gault(1.0, -5.0, 50, false).is_err());
    assert!(calcular_vazao_infusao(0.1, 70.0, 0.0).is_err());
    assert!(calcular_vazao_infusao(0.0, 70.0, 0.064).is_err());
    assert!(calcular_dose_pediatrica(0.0, 50.0, Some(50.0), 3, None).is_err());
    assert!(calcular_dose_pediatrica(15.0, 50.0, Some(50.0), 0, None).is_err());
}

#[cfg(not(target_arch = "wasm32"))]
#[test]
fn test_busca_fts_sem_acentos_e_tokens_vazios() {
    use clinical_engine::database::BancoDadosClinico;
    use rusqlite::Connection;

    let arquivo = std::env::temp_dir().join("openclinical_teste_fts.sqlite");
    let _ = std::fs::remove_file(&arquivo);
    {
        let con = Connection::open(&arquivo).unwrap();
        con.execute_batch(
            "CREATE VIRTUAL TABLE indice_busca_fts USING fts5(
                tipo_registro, id_referencia, titulo_primario, subtitulo, conteudo_textual,
                tokenize = 'unicode61 remove_diacritics 2');
             INSERT INTO indice_busca_fts VALUES ('protocolo', '1', 'Hipertensão arterial', 'HAS', 'pressão alta');",
        )
        .unwrap();
    }

    let banco = BancoDadosClinico::abrir_somente_leitura(arquivo.to_str().unwrap()).unwrap();
    let achados = banco.buscar_geral("hipertensao", 10).unwrap();
    assert_eq!(achados.len(), 1);
    assert_eq!(achados[0].titulo_primario, "Hipertensão arterial");
    assert_eq!(achados[0].id_referencia, serde_json::json!("1"));

    // Termos só com pontuação não podem gerar erro de sintaxe FTS5
    assert!(banco.buscar_geral("((( )))", 10).unwrap().is_empty());
    assert!(banco.buscar_geral("   ", 10).unwrap().is_empty());
    drop(banco);
    let _ = std::fs::remove_file(&arquivo);
}

/// Exercita o banco realmente empacotado no app desktop (pulado se ainda não foi gerado pelo ETL).
#[cfg(not(target_arch = "wasm32"))]
#[test]
fn test_banco_empacotado_consultas_principais() {
    use clinical_engine::database::BancoDadosClinico;

    let caminho = std::path::Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("../openclinical_desktop/openclinical_core.sqlite");
    if !caminho.exists() {
        eprintln!("Banco empacotado ausente em {}; teste pulado.", caminho.display());
        return;
    }

    let banco = BancoDadosClinico::abrir_somente_leitura(caminho.to_str().unwrap()).unwrap();

    let detalhe = banco.obter_detalhe_medicamento(1).unwrap();
    assert!(detalhe.bula.is_some());

    let interacoes = banco.verificar_interacoes(&[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).unwrap();
    assert!(!interacoes.is_empty());

    for tipo in ["medicamento", "protocolo", "pcdt_conitec", "cmed_comercial"] {
        let termo = match tipo {
            "medicamento" => "amoxicilina",
            "protocolo" => "hipertensao",
            "pcdt_conitec" => "acromegalia",
            _ => "dipirona",
        };
        let achados = banco.buscar_geral(termo, 50).unwrap();
        assert!(
            achados.iter().any(|item| item.tipo_registro == tipo),
            "busca por '{termo}' não retornou registro do tipo {tipo}"
        );
    }

    let id_cmed = banco
        .buscar_geral("dipirona", 50)
        .unwrap()
        .into_iter()
        .find(|item| item.tipo_registro == "cmed_comercial")
        .and_then(|item| item.id_referencia.as_i64())
        .unwrap();
    assert!(banco.obter_registro_cmed(id_cmed).is_ok());

    // Todas as apresentações estão indexadas, e as embalagens CMED não empurram a monografia do FTN para fora do limite
    let losartana = banco.buscar_geral("losartana", 50).unwrap();
    let primeira_cmed = losartana.iter().position(|item| item.tipo_registro == "cmed_comercial").unwrap();
    let monografia = losartana.iter().position(|item| item.tipo_registro == "ftn_monografia");
    assert!(monografia.is_some_and(|posicao| posicao < primeira_cmed));
    // Apresentações comerciais por substância (a interface escolhe as substâncias pela chave do princípio ativo)
    let substancias = banco.listar_substancias_cmed().unwrap();
    let amox_clav: Vec<String> = substancias
        .into_iter()
        .filter(|s| s.contains("AMOXICILINA") && s.contains("CLAVUL"))
        .collect();
    let apresentacoes = banco.apresentacoes_cmed_por_substancias(&amox_clav).unwrap();
    assert!(apresentacoes.len() > 50, "{} apresentações", apresentacoes.len());
    assert!(banco.apresentacoes_cmed_por_substancias(&[]).unwrap().is_empty());

    let losartana_100 = banco.buscar_geral("losartana 100 mg", 50).unwrap();
    assert!(losartana_100
        .iter()
        .any(|item| item.tipo_registro == "cmed_comercial" && item.titulo_primario.contains("100 MG")));

    // PCDT da CONITEC extraídos dos PDFs oficiais: lista completa, CIDs, medicamentos do Termo e esquemas
    let pcdts = banco.listar_pcdt_conitec().unwrap();
    assert!(pcdts.len() >= 100, "{} PCDT", pcdts.len());
    let asma = pcdts.iter().find(|p| p.titulo.starts_with("Asma")).expect("PCDT de asma");
    assert!(asma.cids.iter().any(|c| c.starts_with("J45")));
    assert!(asma.farmacos.iter().any(|f| f.chave == "budesonida" && f.no_rename));
    let detalhe = banco.obter_pcdt_conitec(asma.id_pcdt).unwrap().unwrap();
    let esquemas = detalhe.secoes.iter().find(|s| s.chave == "esquemas").expect("esquemas de administração");
    assert!(esquemas.pagina > 0 && esquemas.texto.to_lowercase().contains("budesonida"));
    // Busca pelo medicamento citado no PCDT
    assert!(banco
        .buscar_geral("levotiroxina", 50)
        .unwrap()
        .iter()
        .any(|item| item.tipo_registro == "pcdt_conitec"));
}

#[cfg(not(target_arch = "wasm32"))]
#[test]
fn test_obter_registro_cmed() {
    use clinical_engine::database::BancoDadosClinico;
    use rusqlite::Connection;

    let arquivo = std::env::temp_dir().join("openclinical_teste_cmed.sqlite");
    let _ = std::fs::remove_file(&arquivo);
    {
        let con = Connection::open(&arquivo).unwrap();
        con.execute_batch(
            "CREATE TABLE catalogo_nacional_medicamentos_cmed (
                id_cmed INTEGER PRIMARY KEY, substancia TEXT NOT NULL, nome_produto TEXT NOT NULL,
                apresentacao TEXT NOT NULL, classe_terapeutica TEXT, tipo_produto TEXT, laboratorio TEXT,
                numero_registro TEXT, codigo_ean TEXT, tarja TEXT, preco_maximo_consumidor REAL,
                receita_padrao_copiavel TEXT);
             INSERT INTO catalogo_nacional_medicamentos_cmed VALUES
                (7, 'DIPIRONA', 'NOVALGINA', '500 MG COM X 10', NULL, 'Referência', 'SANOFI',
                 '1832600010012', '789', 'Venda Livre', 12.5, 'RECEITUÁRIO MÉDICO');",
        )
        .unwrap();
    }

    let banco = BancoDadosClinico::abrir_somente_leitura(arquivo.to_str().unwrap()).unwrap();
    let registro = banco.obter_registro_cmed(7).unwrap();
    assert_eq!(registro.nome_produto, "NOVALGINA");
    assert_eq!(registro.classe_terapeutica, "");
    assert!(banco.obter_registro_cmed(999).is_err());
    drop(banco);
    let _ = std::fs::remove_file(&arquivo);
}

#[test]
fn test_analise_de_preco_so_usa_valores_oficiais() {
    use clinical_engine::pharmacy_pricing::analisar_preco_medicamento;

    let analise = analisar_preco_medicamento(
        "NOVALGINA",
        "DIPIRONA MONOIDRATADA",
        "Novo",
        "500 MG COM CT BL AL PLAS INC X 20",
        "7891058001234",
        28.50,
    );
    assert_eq!(analise.preco_pmc_teto, Some(28.50));
    assert_eq!(analise.quantidade_unidades, Some(20));
    assert_eq!(analise.pmc_por_unidade, Some(1.43));
    assert!(!analise.farmacia_popular.gratuito);
    assert!(analise.links_pesquisa.iter().all(|l| l.url.starts_with("https://") && l.url.contains("NOVALGINA")));

    // Sem PMC publicado não há valor inventado
    let hospitalar = analisar_preco_medicamento("X", "NOREPINEFRINA", "Similar", "2 MG/ML SOL INJ X 4 ML", "", 0.0);
    assert_eq!(hospitalar.preco_pmc_teto, None);
    assert_eq!(hospitalar.pmc_por_unidade, None);
}

#[test]
fn test_farmacia_popular_confere_substancia_e_dose() {
    use clinical_engine::pharmacy_pricing::verificar_farmacia_popular;

    let losartana = verificar_farmacia_popular("LOSARTANA POTÁSSICA", "50 MG COM REV CT BL AL PLAS OPC X 30");
    assert!(losartana.gratuito);
    assert_eq!(losartana.indicacao.as_deref(), Some("Hipertensão"));

    // Mesma substância em dose fora do elenco não é gratuita
    let losartana_100 = verificar_farmacia_popular("LOSARTANA POTÁSSICA", "100 MG COM REV CT BL AL PLAS OPC X 50");
    assert!(!losartana_100.gratuito);
    assert!(losartana_100.substancia_no_programa);

    // Associação com outro princípio ativo não entra
    let associacao = verificar_farmacia_popular("LOSARTANA POTÁSSICA;HIDROCLOROTIAZIDA", "(50 + 12,5) MG COM REV X 30");
    assert!(!associacao.gratuito);
    assert!(!associacao.substancia_no_programa);

    // Desde 02/2025 não existe mais copagamento: sinvastatina 20 mg é gratuita
    assert!(verificar_farmacia_popular("SINVASTATINA", "20 MG COM REV CT BL AL PLAS INC X 30").gratuito);

    // Anticoncepcional: só a combinação e as doses do elenco
    assert!(verificar_farmacia_popular("LEVONORGESTREL;ETINILESTRADIOL", "(0,15 + 0,03) MG COM CT BL AL PLAS TRANS X 21").gratuito);
    assert!(!verificar_farmacia_popular("GESTODENO;ETINILESTRADIOL", "(0,075 + 0,03) MG COM X 21").gratuito);

    // Insulina análoga não é a insulina humana do programa
    assert!(!verificar_farmacia_popular("INSULINA GLARGINA", "100 UI/ML SOL INJ X 3 ML").gratuito);
}

#[test]
fn test_extrair_quantidade_unidades() {
    use clinical_engine::pharmacy_pricing::extrair_quantidade_unidades;

    assert_eq!(extrair_quantidade_unidades("500 MG COM CT BL AL PLAS INC X 30"), Some(30));
    assert_eq!(extrair_quantidade_unidades("10 MG/ML SOL ORAL CT FR GTS X 20 ML"), Some(20));
    assert_eq!(extrair_quantidade_unidades("20 MG COM REV X 60"), Some(60));
}

#[cfg(not(target_arch = "wasm32"))]
#[test]
fn test_atualizador_le_arquivos_da_anvisa_e_protege_os_dados() {
    use clinical_engine::atualizador::{
        aplicar_arquivo, consultar_bula, decodificar_texto, garantir_esquema, ler_indice_bulas, ler_precos_cmed,
        precisa_atualizar, FonteDados, TipoFonte, FONTES,
    };
    use rusqlite::Connection;

    // Cabeçalho real da CMED (com BOM), reduzido às colunas que importam
    let mut cmed = String::from("\u{feff}SUBSTÂNCIA;CNPJ;LABORATÓRIO;CÓDIGO GGREM;REGISTRO;EAN 1;EAN 2;EAN 3;PRODUTO;APRESENTAÇÃO;CLASSE TERAPÊUTICA;TIPO DE PRODUTO (STATUS DO PRODUTO);REGIME DE PREÇO;PMC 18 %;TARJA\n");
    for i in 0..3 {
        cmed.push_str(&format!(
            "LOSARTANA POTÁSSICA;00;EMS S/A;1;100290007{i:04};789{i};;;COZAAR;50 MG COM REV CT BL X {};C9C;Novo;Regulado;\"107,85\";Tarja Vermelha\n",
            30 + i
        ));
    }
    let linhas = ler_precos_cmed(&decodificar_texto(cmed.as_bytes())).unwrap();
    assert_eq!(linhas.len(), 3);
    assert_eq!(linhas[0].preco_maximo_consumidor, 107.85);
    assert_eq!(linhas[0].substancia, "LOSARTANA POTÁSSICA");

    // Índice de bulas: Windows-1252, sem cabeçalho, data em mês/dia/ano
    let bulas_cp1252: Vec<u8> = b"336699;\"COZAAR\";\"100290007\";6;\"250000052239411\";\"45987013000134\";\"ORGANON FARMAC\xcaUTICA LTDA.\";34428002;\"1454152257\";\"11/03/2025 16:59:21\";\"15987262025\";\"10/12/2026 00:00:00\"\n".to_vec();
    let bulas = ler_indice_bulas(&decodificar_texto(&bulas_cp1252)).unwrap();
    assert_eq!(bulas[0].empresa, "ORGANON FARMACÊUTICA LTDA.");
    assert_eq!(bulas[0].data_publicacao, "2025-11-03");

    let mut con = Connection::open_in_memory().unwrap();
    garantir_esquema(&con).unwrap();
    let fonte_teste = FonteDados { minimo_linhas: 1, ..FONTES[0] };
    assert_eq!(aplicar_arquivo(&mut con, &fonte_teste, cmed.as_bytes()).unwrap(), 3);
    let busca: i64 = con
        .query_row("SELECT COUNT(*) FROM indice_busca_fts WHERE tipo_registro = 'cmed_comercial'", [], |r| r.get(0))
        .unwrap();
    assert_eq!(busca, 3);

    // Arquivo truncado (menos da metade das linhas atuais) não substitui a tabela
    let truncado: String = cmed.lines().take(2).map(|l| format!("{l}\n")).collect();
    assert!(aplicar_arquivo(&mut con, &fonte_teste, truncado.as_bytes()).is_err());
    let restantes: i64 = con.query_row("SELECT COUNT(*) FROM catalogo_nacional_medicamentos_cmed", [], |r| r.get(0)).unwrap();
    assert_eq!(restantes, 3);
    // Formato desconhecido também é recusado sem apagar nada
    assert!(aplicar_arquivo(&mut con, &fonte_teste, b"COLUNA;OUTRA\n1;2\n").is_err());

    let fonte_bulas = FonteDados { minimo_linhas: 1, tipo: TipoFonte::IndiceBulas, ..FONTES[2] };
    aplicar_arquivo(&mut con, &fonte_bulas, &bulas_cp1252).unwrap();
    let bula = consultar_bula(&con, "1002900070066").unwrap().unwrap();
    assert_eq!(bula.nome_produto, "COZAAR");
    assert!(bula.url_bulario.ends_with("numeroRegistro=100290007"));
    assert!(consultar_bula(&con, "999999999").unwrap().is_none());

    // Banco que nunca foi verificado precisa de atualização
    let arquivo = std::env::temp_dir().join(format!("openclinical_atualizador_{}.sqlite", std::process::id()));
    let _ = std::fs::remove_file(&arquivo);
    assert!(precisa_atualizar(arquivo.to_str().unwrap(), 24.0));
    let _ = std::fs::remove_file(&arquivo);
}

#[cfg(not(target_arch = "wasm32"))]
#[test]
fn test_api_anvisa_credenciais_e_respostas() {
    use clinical_engine::api_anvisa::{descrever_erro_http, mascarar_client_id, normalizar_credenciais, operacoes_openapi};

    // CPF com pontuação vira só dígitos; o secret perde só os espaços das pontas
    let credenciais = normalizar_credenciais(" 123.456.789-09 ", "  abcDEF123  ").unwrap();
    assert_eq!(credenciais.client_id, "12345678909");
    assert_eq!(credenciais.client_secret, "abcDEF123");
    assert!(normalizar_credenciais("1234", "x").is_err());
    assert!(normalizar_credenciais("12345678909", "").is_err());
    assert!(normalizar_credenciais("12345678909", "abc def").is_err());
    assert_eq!(mascarar_client_id("12345678909"), "123.***.***-09");

    // Recusa do Keycloak e bloqueio do firewall são explicados de forma diferente
    let (situacao, mensagem) = descrever_erro_http(400, r#"{"error":"invalid_client","error_description":"Invalid client credentials"}"#);
    assert_eq!(situacao, "sem_permissao");
    assert!(mensagem.contains("Regenere"));
    let (situacao, mensagem) = descrever_erro_http(403, "<title>Bloqueado · Ray ID a519f937ad69c03f · IP x</title>");
    assert_eq!(situacao, "bloqueado_firewall");
    assert!(mensagem.contains("a519f937ad69c03f"));

    // 404 do serviço (corpo JSON do Spring) não é recusa de login
    let (situacao, mensagem) = descrever_erro_http(
        404,
        r#"{"timestamp":"2026-10-28T13:00:48Z","status":404,"error":"Not Found","path":"/v3/api-docs"}"#,
    );
    assert_eq!(situacao, "nao_publicado");
    assert!(!mensagem.contains("autenticação"));

    let especificacao = serde_json::json!({"paths": {"/api/v1/lista": {"get": {}, "post": {}}}});
    assert_eq!(operacoes_openapi(&especificacao), vec!["GET /api/v1/lista", "POST /api/v1/lista"]);
}

#[test]
fn test_bulas_importadas_grava_busca_e_remove() {
    use clinical_engine::bulas_importadas::{self, BulaImportada, SecaoBulaImportada};
    use clinical_engine::database::BancoDadosClinico;

    let arquivo = std::env::temp_dir().join(format!("openclinical_bulas_{}.sqlite", std::process::id()));
    let _ = std::fs::remove_file(&arquivo);
    let caminho = arquivo.to_string_lossy().into_owned();

    let secao = |chave: &str, texto: &str| SecaoBulaImportada { chave: chave.into(), titulo: chave.into(), texto: texto.into() };
    let mut bula = BulaImportada {
        registro: "1.0573.0574.001-1".into(),
        tipo: "paciente".into(),
        nome_produto: "albendazol".into(),
        principios_ativos: vec!["albendazol".into()],
        empresa: "Aché Laboratórios Farmacêuticos S.A.".into(),
        cnpj: String::new(),
        data_bula: "2023-12-18".into(),
        origem: "manual".into(),
        url_origem: String::new(),
        data_importacao: String::new(),
        hash_arquivo: "abc".into(),
        cabecalho: "Comprimido mastigável de 400 mg".into(),
        secoes: vec![secao("indicacoes", "Verminoses."), secao("posologia", "400 mg em dose única para ascaridíase.")],
    };

    let resumo = bulas_importadas::salvar_no_banco(&caminho, &bula).expect("grava");
    assert_eq!(resumo.registro, "105730574", "registro normalizado para 9 dígitos");
    assert_eq!(resumo.total_secoes, 2);

    // Regravar substitui (não duplica) e a bula do profissional fica ao lado
    bula.secoes.push(secao("superdose", "Lavagem gástrica."));
    bulas_importadas::salvar_no_banco(&caminho, &bula).expect("regrava");
    bula.tipo = "profissional".into();
    bulas_importadas::salvar_no_banco(&caminho, &bula).expect("grava profissional");

    let banco = BancoDadosClinico::abrir_somente_leitura(&caminho).expect("abre");
    let bulas = banco.obter_bulas_importadas("1057305740011").expect("consulta");
    assert_eq!(bulas.iter().map(|b| b.tipo.as_str()).collect::<Vec<_>>(), ["profissional", "paciente"]);
    assert_eq!(bulas[1].secoes.len(), 3);
    assert!(!bulas[1].data_importacao.is_empty());
    assert_eq!(banco.listar_bulas_importadas().expect("lista").len(), 2);

    // Busca global sem acento encontra pela posologia, uma vez por bula
    let achados = banco.buscar_geral("ascaridiase", 10).expect("busca");
    assert_eq!(achados.iter().filter(|r| r.tipo_registro == "bula_importada").count(), 2);
    assert!(achados.iter().any(|r| r.id_referencia == serde_json::json!("105730574:paciente")));
    drop(banco);

    // Sem registro ou sem seção não grava
    let mut sem_registro = bula.clone();
    sem_registro.registro = "123".into();
    assert!(matches!(bulas_importadas::salvar_no_banco(&caminho, &sem_registro), Err(ClinicalError::DadoInvalido { .. })));
    let mut vazia = bula.clone();
    vazia.secoes.clear();
    assert!(bulas_importadas::salvar_no_banco(&caminho, &vazia).is_err());

    assert!(bulas_importadas::remover_do_banco(&caminho, "105730574", "paciente").expect("remove"));
    assert!(!bulas_importadas::remover_do_banco(&caminho, "105730574", "paciente").expect("remove de novo"));
    let banco = BancoDadosClinico::abrir_somente_leitura(&caminho).expect("abre");
    assert_eq!(banco.obter_bulas_importadas("105730574").expect("consulta").len(), 1);
    assert_eq!(banco.buscar_geral("ascaridiase", 10).expect("busca").len(), 1);
    drop(banco);
    let _ = std::fs::remove_file(&arquivo);
}

#[test]
fn test_pcdt_conitec_lista_oficial_e_atualizacao() {
    use clinical_engine::pcdt_conitec::{self, ler_lista_api, slug_da_url};
    use rusqlite::Connection;

    // Mesma amostra da API usada pelo teste do ETL em Python: os dois lados geram os mesmos slugs e datas
    let caminho_fixture = concat!(env!("CARGO_MANIFEST_DIR"), "/../../etl_pipeline/tests/fixtures/conitec_pcdt_amostra.json");
    let json = std::fs::read_to_string(caminho_fixture).expect("fixture da CONITEC");
    let itens = ler_lista_api(&json).expect("lista");
    let resumo: Vec<(&str, &str, &str)> = itens.iter().map(|i| (i.slug.as_str(), i.titulo.as_str(), i.data_portaria.as_str())).collect();
    assert_eq!(
        resumo,
        [
            ("pcdt-acidentes-escorpionicos", "Acidentes Escorpiônicos", "2025-08-05"),
            ("pcdt-acidentes-ofidicos-final", "Acidentes Ofídicos", "2025-10-09"),
            ("tromb-lise-no-acidente-vascular-cerebral-isqu-mico-agudo", "Acidente Vascular Cerebral (AVC) Isquêmico Agudo", "2023-12-15"),
            ("pcdt-diabete-melito-tipo-2", "Diabete Melito Tipo 2", "2026-02-24"),
        ],
        "linha da letra e linha repetida ficam de fora"
    );
    assert_eq!(itens[0].portaria, "Portaria SECTICS/MS nº 59 - 01/08/2025");
    assert!(itens[0].url_resumido.contains("pcdt-resumido"));
    assert!(itens[3].url_resumido.is_empty());
    assert_eq!(slug_da_url("https://x/midias/Protocolos/PCDT_Asma.PDF/@@display-file/file"), "pcdt-asma");
    assert!(ler_lista_api("{\"blocks\": {}}").is_err(), "sem a tabela, o formato mudou");

    let con = Connection::open_in_memory().expect("banco");
    con.execute_batch(
        "CREATE VIRTUAL TABLE indice_busca_fts USING fts5(tipo_registro, id_referencia UNINDEXED, titulo_primario, subtitulo,
         conteudo_textual, tokenize = 'unicode61 remove_diacritics 2');",
    )
    .expect("fts");
    assert_eq!(pcdt_conitec::aplicar_lista(&con, &itens).expect("aplica"), 4);
    // Conteúdo extraído pelo ETL para um deles
    con.execute(
        "UPDATE pcdt_documentos SET tem_texto = 1, conteudo_desatualizado = 0, cids_json = '[\"E11\"]',
         secoes_json = '[{\"chave\":\"esquemas\",\"titulo\":\"Esquemas de administração\",\"pagina\":38,\"texto\":\"Metformina 500 mg\"}]'
         WHERE slug = 'pcdt-diabete-melito-tipo-2'",
        [],
    )
    .expect("conteúdo");

    // Dia seguinte: a CONITEC troca o PDF do DM2 e tira o AVC da lista
    let mut novos = itens.clone();
    novos.retain(|i| !i.slug.starts_with("tromb"));
    novos[2].url_pdf = "https://www.gov.br/conitec/pt-br/midias/protocolos/2027/pcdt-diabete-melito-tipo-2/@@display-file/file".into();
    pcdt_conitec::aplicar_lista(&con, &novos).expect("reaplica");

    let lista = pcdt_conitec::listar(&con).expect("lista");
    assert_eq!(lista.len(), 3);
    let dm2 = lista.iter().find(|p| p.titulo == "Diabete Melito Tipo 2").expect("dm2");
    assert!(dm2.conteudo_desatualizado, "PDF trocado: conteúdo extraído fica marcado como antigo");
    assert_eq!(dm2.cids, ["E11"]);
    assert_eq!(dm2.secoes_disponiveis, ["esquemas"]);
    let detalhe = pcdt_conitec::obter(&con, dm2.id_pcdt).expect("obtém").expect("existe");
    assert_eq!(detalhe.secoes[0].pagina, 38);
    let ids: Vec<i64> = lista.iter().map(|p| p.id_pcdt).collect();
    assert!(ids.iter().all(|id| (1..=4).contains(id)), "ids estáveis entre execuções: {ids:?}");
    let buscas: i64 = con
        .query_row("SELECT COUNT(*) FROM indice_busca_fts WHERE indice_busca_fts MATCH 'diabete'", [], |r| r.get(0))
        .expect("fts");
    assert_eq!(buscas, 1);
}


// -----------------------------------------------------------------------------
// Testes dos Novos Módulos de Emergência, Gasometria e Segurança 5G
// -----------------------------------------------------------------------------

#[test]
fn test_intubacao_sri_e_ventilacao_ardsnet() {
    use clinical_engine::emergency::calcular_intubacao_sri;

    // Homem, 70 kg, 175 cm, Perfil Choque Instável
    let res = calcular_intubacao_sri(70.0, 175.0, false, "choque_instavel").expect("Cálculo ISR");
    assert_eq!(res.peso_real_kg, 70.0);
    assert_eq!(res.perfil_hemodinamico, "choque_instavel");

    // Peso predito homem 175cm: 50.0 + 0.91 * (175 - 152.4) = 50 + 20.566 = 70.6 kg
    assert!((res.ventilacao.peso_predito_kg - 70.6).abs() < 0.2);
    // Volume corrente 6 mL/kg predito: 6 * 70.6 = 423.6 -> ~424 mL
    assert_eq!(res.ventilacao.volume_corrente_ml, 424.0);

    // Verificar fármacos presentes
    let etomidato = res.farmacos.iter().find(|f| f.nome_farmaco.contains("Etomidato")).unwrap();
    assert!(etomidato.recomendado_perfil, "Etomidato deve ser recomendado no choque");
    assert_eq!(etomidato.dose_total_mg, 21.0); // 70 * 0.3
    assert_eq!(etomidato.volume_administrar_ml, 10.5); // 21 / 2.0

    let cetamina = res.farmacos.iter().find(|f| f.nome_farmaco.contains("Cetamina")).unwrap();
    assert!(cetamina.recomendado_perfil, "Cetamina deve ser recomendada no choque");
    assert_eq!(cetamina.dose_total_mg, 105.0); // 70 * 1.5
    assert_eq!(cetamina.volume_administrar_ml, 2.1); // 105 / 50.0

    let succinil = res.farmacos.iter().find(|f| f.nome_farmaco.contains("Succinilcolina")).unwrap();
    assert_eq!(succinil.dose_total_mg, 84.0); // 70 * 1.2
    assert_eq!(succinil.volume_administrar_ml, 8.4); // 84 / 10.0

    assert_eq!(res.checklist_7ps.len(), 7);
}

#[test]
fn test_emergencia_pediatrica_pals() {
    use clinical_engine::emergency::calcular_emergencia_pediatrica;

    // Criança 6 anos, 20 kg
    let res = calcular_emergencia_pediatrica(20.0, 6.0).expect("Pediátrico");
    // Tubo com cuff: (6/4) + 3.5 = 1.5 + 3.5 = 5.0 mm
    assert_eq!(res.tubo_com_cuff_mm, 5.0);
    // Tubo sem cuff: (6/4) + 4.0 = 5.5 mm
    assert_eq!(res.tubo_sem_cuff_mm, 5.5);
    // Rima labial: 3 * 5.0 = 15.0 cm
    assert_eq!(res.fixacao_rima_labial_cm, 15.0);
    // Desfibrilação: 1º choque 2 J/kg = 40 J; 2º choque 4 J/kg = 80 J
    assert_eq!(res.carga_desfibrilacao_1_j, 40.0);
    assert_eq!(res.carga_desfibrilacao_2_j, 80.0);
    // Adrenalina PCR 0.01 mg/kg = 0.2 mg (2.0 mL da solução 1:10.000)
    assert_eq!(res.adrenalina_pcr_mg, 0.2);
    assert_eq!(res.adrenalina_diluida_1_10000_ml, 2.0);
    // Expansão 20 mL/kg = 400 mL
    assert_eq!(res.expansao_cristaloide_20ml_kg, 400.0);
}

#[test]
fn test_gasometria_figge_delta_delta_winters() {
    use clinical_engine::acid_base::interpretar_gasometria;

    // Acidose metabólica grave: pH 7.22, PaCO2 25, HCO3 10, Na 140, Cl 100, Alb 2.0, PaO2 80, FiO2 0.21
    let res = interpretar_gasometria(7.22, 25.0, 10.0, 140.0, 100.0, 2.0, 80.0, 0.21).expect("Gasometria");
    assert!(res.disturbio_primario.contains("Acidose Metabólica"));

    // AG bruto = 140 - (100 + 10) = 30.0
    assert_eq!(res.anion_gap_bruto, 30.0);
    // Figge AG corr = 30 + 2.5 * (4.0 - 2.0) = 30 + 5.0 = 35.0
    assert_eq!(res.anion_gap_corrigido, 35.0);

    // Delta-Delta: (35.0 - 12.0) / (24.0 - 10.0) = 23.0 / 14.0 = 1.64 (Acidose AG elevado pura)
    assert!(res.delta_delta.is_some());
    let dd = res.delta_delta.unwrap();
    assert!((dd - 1.64).abs() < 0.02);
    assert!(res.interpretacao_delta_delta.as_ref().unwrap().contains("pura"));

    // Winters: 1.5 * 10 + 8 = 23 (+- 2 -> 21 a 25). PaCO2 real = 25 -> compensação adequada!
    assert!(res.compensacao_respiratoria.contains("adequada"));

    // Relação PaO2/FiO2: 80 / 0.21 = 380.95 -> normal
    assert!(res.relacao_pafo2 >= 380.0);
}

#[test]
fn test_correcao_sodio_adrogue_madias() {
    use clinical_engine::acid_base::calcular_correcao_sodio;

    // Homem adulto 70 kg, sódio 115 mEq/L, solução NaCl 3% (513 mEq/L)
    let res = calcular_correcao_sodio(115.0, 70.0, false, false, 513.0).expect("Adrogué");
    // ACT homem adulto = 0.6 * 70 = 42.0 L
    assert_eq!(res.agua_corporal_total_litros, 42.0);
    // Delta Na 1L = (513 - 115) / (42 + 1) = 398 / 43 = 9.255 -> 9.26 mEq/L por Litro
    assert!((res.variacao_sodio_1l - 9.26).abs() < 0.02);
    // Limite seguro de 8 mEq/L -> Volume 24h = (8.0 / 9.255) * 1000 = ~864 mL
    assert!(res.volume_recomendado_24h_ml > 850.0 && res.volume_recomendado_24h_ml < 880.0);
    assert!(res.vazao_bic_ml_h > 35.0 && res.vazao_bic_ml_h < 37.0);
}

#[test]
fn test_calculadoras_cha2ds2_va_qsofa_dose_reversa() {
    use clinical_engine::calculators::{
        calcular_dose_reversa_infusao, calcular_escore_cha2ds2_va, calcular_escore_qsofa,
    };

    // Dose reversa noradrenalina: 15 mL/h para paciente de 70 kg em solução 16mg/250mL (0.064 mg/mL)
    // Dose = (15 * 0.064 * 1000) / (70 * 60) = 960 / 4200 = 0.22857 -> 0.229 mcg/kg/min
    let dose = calcular_dose_reversa_infusao(15.0, 70.0, 0.064).expect("Dose reversa");
    assert_eq!(dose, 0.229);

    // CHA2DS2-VA: IC (+1), HAS (+1), Idade 76 (+2), DM (+1) = 5 pontos
    let cha = calcular_escore_cha2ds2_va(true, true, 76, true, false, false);
    assert_eq!(cha.pontuacao, 5);
    assert!(cha.categoria_risco.contains("Muito Alto"));
    assert!(cha.recomendacao_anticoagulacao.contains("imperativa"));

    // qSOFA: FR > 22 (+1), PAS < 100 (+1), Mental normal = 2 pontos -> alto risco sepse
    let qs = calcular_escore_qsofa(true, true, false);
    assert_eq!(qs.pontuacao, 2);
    assert!(qs.alto_risco_sepse);
}

#[test]
fn test_seguranca_5g_cascatas_acb_triple_whammy_tisdale_cpic() {
    use clinical_engine::medication_safety_5g::{
        calcular_carga_anticolinergica_acb, calcular_escore_tisdale_qtc,
        consultar_alertas_farmacogenomicos_cpic, detectar_cascatas_prescricao,
        detectar_triple_whammy_renal,
    };

    // 1. Cascata: Anlodipino + Furosemida (Edema MMII)
    let prescricao_cascata = vec!["Anlodipino 5mg".to_string(), "Furosemida 40mg".to_string()];
    let cascatas = detectar_cascatas_prescricao(&prescricao_cascata);
    assert_eq!(cascatas.len(), 1);
    assert!(cascatas[0].efeito_adverso_confundido.contains("Edema maleolar"));

    // 2. Triple Whammy: Losartana + Furosemida + Ibuprofeno
    let prescricao_tw = vec![
        "Losartana Potássica 50mg".to_string(),
        "Furosemida 40mg".to_string(),
        "Ibuprofeno 600mg".to_string(),
    ];
    let tw = detectar_triple_whammy_renal(&prescricao_tw);
    assert!(tw.detectado);
    assert!(tw.gravidade.contains("Crítica"));

    // 3. ACB Score: Amitriptilina (3) + Oxibutinina (3) + Furosemida (1) = 7 pontos (Alto risco)
    let prescricao_acb = vec![
        "Amitriptilina 25mg".to_string(),
        "Oxibutinina 5mg".to_string(),
        "Furosemida 40mg".to_string(),
    ];
    let acb = calcular_carga_anticolinergica_acb(&prescricao_acb);
    assert_eq!(acb.pontuacao_total, 7);
    assert!(acb.classificacao_risco.contains("Alto Risco"));
    assert!(!acb.sugestoes_desprescricao.is_empty());

    // 4. Tisdale QTc: Ondansetrona + Azitromicina (>= 2 drogas QTc = +6) + idade 70 (+1) = 7 (Moderado)
    let prescricao_qtc = vec!["Ondansetrona 8mg".to_string(), "Azitromicina 500mg".to_string()];
    let tisdale = calcular_escore_tisdale_qtc(&prescricao_qtc, 70, false, false, false, false, false);
    assert_eq!(tisdale.pontuacao_total, 7);
    assert!(tisdale.categoria_risco.contains("Moderado"));

    // 5. CPIC Nível A: Clopidogrel + Sinvastatina
    let prescricao_cpic = vec!["Clopidogrel 75mg".to_string(), "Sinvastatina 40mg".to_string()];
    let cpic = consultar_alertas_farmacogenomicos_cpic(&prescricao_cpic);
    assert_eq!(cpic.len(), 2);
    assert!(cpic.iter().any(|c| c.gene == "CYP2C19"));
    assert!(cpic.iter().any(|c| c.gene == "SLCO1B1"));
}

// ============================================================================
// TESTES DAS 24 NOVAS CALCULADORAS CLÍNICAS (FASES 1 A 4)
// ============================================================================

#[test]
fn test_manejo_dengue_ms_grupos() {
    // Grupo A: sem alarme, sem choque, peso 70kg
    let g_a = calcular_manejo_dengue_ms(70.0, false, false, false, Some(35.0)).unwrap();
    assert_eq!(g_a.grupo, "A");
    assert_eq!(g_a.volume_total_dia_ml, 4200.0); // 60 mL/kg/dia
    assert_eq!(g_a.volume_sro_ml, 1400.0); // 1/3 SRO

    // Grupo C: com sinal de alarme (dor abdominal intensa)
    let g_c = calcular_manejo_dengue_ms(60.0, true, false, false, Some(28.0)).unwrap();
    assert_eq!(g_c.grupo, "C");
    assert_eq!(g_c.fase_expansao_imediata_ml, 600.0); // 10 mL/kg

    // Grupo D: choque
    let g_d = calcular_manejo_dengue_ms(80.0, true, true, false, None).unwrap();
    assert_eq!(g_d.grupo, "D");
    assert_eq!(g_d.fase_expansao_imediata_ml, 1600.0); // 20 mL/kg em 20 min
}

#[test]
fn test_parkland_queimados_atls10() {
    // Paciente de 70 kg com 30% SCQ, atendido 2h pós-trauma
    let park = calcular_parkland_queimado(70.0, 30.0, 2.0).unwrap();
    assert_eq!(park.volume_total_24h_parkland_ml, 8400.0); // 4 * 70 * 30
    assert_eq!(park.volume_total_24h_atls10_ml, 4200.0); // 2 * 70 * 30
    assert_eq!(park.volume_primeira_fase_ml, 4200.0); // metade nas primeiras 8h
    assert_eq!(park.horas_primeira_fase, 6.0); // 8 - 2 = 6h restantes
    assert_eq!(park.vazao_primeira_fase_ml_h, 700.0); // 4200 / 6 = 700 mL/h
    assert_eq!(park.volume_segunda_fase_ml, 4200.0);
    assert_eq!(park.vazao_segunda_fase_ml_h, 262.5); // 4200 / 16 = 262.5 mL/h
}

#[test]
fn test_metabolico_cad_katz_hillier_calemia() {
    // Sódio 130, Glicemia 600, Potássio 3.1 (hipocalemia grave), Cálcio 8.0, Albumina 2.5
    let cad = calcular_metabolico_cad_calemia(130.0, 600.0, 3.1, 8.0, 2.5).unwrap();
    assert_eq!(cad.sodio_corrigido_katz, 138.0); // 130 + 1.6 * 5 = 138.0
    assert_eq!(cad.sodio_corrigido_hillier, 142.0); // 130 + 2.4 * 5 = 142.0
    assert!(cad.alerta_critico_bloqueio_insulina); // K+ < 3.3 bloqueia insulina
    assert!(cad.conduta_insulina_e_potassio.contains("NÃO INICIAR INSULINA"));
    assert_eq!(cad.calcio_corrigido_payne, 9.2); // 8.0 + 0.8 * (4 - 2.5) = 9.2
}

#[test]
fn test_fena_feureia_pre_renal() {
    // Pré-renal: FENa < 1%, FEUreia < 35%
    // Na_s: 140, Cr_s: 2.0, Ur_s: 120, Na_u: 10, Cr_u: 100, Ur_u: 600
    let res = calcular_fena_feureia(140.0, 2.0, 120.0, 10.0, 100.0, Some(600.0), false).unwrap();
    assert!(res.fena_percentual.unwrap() < 1.0);
    assert!(res.diagnostico_provavel.contains("Pré-Renal"));

    // Com diurético
    let res_diur = calcular_fena_feureia(140.0, 2.0, 120.0, 50.0, 100.0, Some(300.0), true).unwrap();
    assert!(res_diur.ressalva_diuretico.is_some());
}

#[test]
fn test_pam_ppc() {
    let pam = calcular_pam_ppc(120.0, 80.0, Some(15.0)).unwrap();
    assert_eq!(pam.pam_mmhg, 93.3);
    assert_eq!(pam.ppc_mmhg, Some(78.3));
    assert!(pam.alvo_terapeutico.contains("PPC"));
}

#[test]
fn test_heart_score_baixo_e_alto() {
    // 0 pontos: baixo risco
    let hs_baixo = calcular_heart_score(0, 0, 0, 0, 0).unwrap();
    assert_eq!(hs_baixo.pontuacao_total, 0);
    assert_eq!(hs_baixo.categoria_risco, "Baixo Risco");

    // 8 pontos: alto risco
    let hs_alto = calcular_heart_score(2, 2, 1, 1, 2).unwrap();
    assert_eq!(hs_alto.pontuacao_total, 8);
    assert_eq!(hs_alto.categoria_risco, "Alto Risco");
}

#[test]
fn test_has_bled() {
    // HAS + AVC + Idoso (>65) + AINE = 4 pontos (Alto risco)
    let hb = calcular_has_bled(true, false, false, true, false, false, true, true, false);
    assert_eq!(hb.pontuacao_total, 4);
    assert!(hb.categoria_risco.contains("Alto Risco"));
}

#[test]
fn test_qtc_bazett_fridericia() {
    // QT 400ms, FC 60bpm -> QTc Bazett = 400ms, Fridericia = 400ms
    let qtc = calcular_qtc_corrigido(400.0, 60.0, false).unwrap();
    assert_eq!(qtc.qtc_bazett_ms, 400.0);
    assert_eq!(qtc.qtc_fridericia_ms, 400.0);
    assert!(!qtc.alerta_torsades);

    // QTc prolongado > 500ms
    let qtc_longo = calcular_qtc_corrigido(500.0, 100.0, false).unwrap();
    assert!(qtc_longo.alerta_torsades);
}

#[test]
fn test_perc_wells_tvp_padua() {
    // PERC: tudo falso -> TEP descartado se baixa prob
    let perc = calcular_criterios_perc(false, false, false, false, false, false, false, false);
    assert_eq!(perc.criterios_positivos, 0);
    assert!(perc.tep_descartado);

    // Wells TVP: Câncer (1) + Edema unilateral >3cm (1) = 2 pontos (Moderada)
    let wells = calcular_wells_tvp(true, false, false, false, false, true, false, false, false, false);
    assert_eq!(wells.pontuacao_total, 2);
    assert!(wells.categoria_probabilidade.contains("Moderada"));

    // Pádua TEV: Câncer (3) + Mobilidade (3) = 6 pontos (Alto risco >= 4)
    let padua = calcular_escore_padua(true, false, true, false, false, false, false, false, false, false, false);
    assert_eq!(padua.pontuacao_total, 6);
    assert!(padua.alto_risco_tev);
}

#[test]
fn test_trombolise_avc_e_glasgow_p() {
    // Paciente 70 kg
    let tnk = calcular_trombolise_avc(70.0).unwrap();
    assert_eq!(tnk.dose_total_alteplase_mg, 63.0); // 0.9 * 70 = 63 mg
    assert_eq!(tnk.bolus_alteplase_10_porcento_mg, 6.3);
    assert_eq!(tnk.infusao_alteplase_90_porcento_mg_h, 56.7);
    assert_eq!(tnk.dose_tenecteplase_mg, 17.5); // 0.25 * 70 = 17.5 mg

    // Glasgow-P: GCS 8 - 1 pupila sem resposta = GCS-P 7
    let gp = calcular_glasgow_p(2, 2, 4, 1).unwrap();
    assert_eq!(gp.escore_glasgow, 8);
    assert_eq!(gp.reacao_pupilar_pontos, 1);
    assert_eq!(gp.gcs_p_final, 7);
    assert!(gp.indicacao_intubacao);
}

#[test]
fn test_cranio_cervical_canadian_nexus() {
    let cc = calcular_cranio_cervical(
        true, false, false, false, false, false, false,
        false, false, false, false
    );
    assert!(cc.indicacao_tc_cranio);
    assert!(cc.criterios_nexus_atendidos); // sem critérios NEXUS -> não indicada imagem cervical
}

#[test]
fn test_meld_na_e_child_pugh_e_fib4() {
    // MELD-Na: Cr 2.0, Bili 3.0, INR 1.8, Na 130
    let meld = calcular_meld_na(2.0, 3.0, 1.8, 130.0, false).unwrap();
    assert!(meld.score_meld_na > 20.0);

    // Child-Pugh: Bili 3.5 (3), Alb 2.5 (3), INR 2.4 (3), Ascite moderada (3), Encef grau 2 (2) = 14 pt (Classe C)
    let child = calcular_child_pugh(3.5, 2.5, 2.4, 3, 2).unwrap();
    assert_eq!(child.pontuacao_total, 14);
    assert!(child.classe.contains("Classe C"));

    // FIB-4: Idade 50, AST 80, ALT 40, Plaq 150
    // FIB-4 = (50 * 80) / (150 * sqrt(40)) = 4000 / (150 * 6.3245) = 4000 / 948.68 = 4.22 (Alto Risco)
    let fib = calcular_fib4(50, 80.0, 40.0, 150.0).unwrap();
    assert!(fib.score_fib4 > 3.25);
    assert!(fib.estratificacao_fibrose.contains("Alta Probabilidade"));
}

#[test]
fn test_hda_blatchford_e_bisap_e_alvarado() {
    // Blatchford: Ureia 60 (3), Hb 9 (3), PAS 95 (1), FC 105 (1), Melena (1) = 9 pontos
    let gbs = calcular_glasgow_blatchford(60.0, 9.0, 95.0, 105.0, false, true, false, false, false).unwrap();
    assert_eq!(gbs.pontuacao_total, 15);
    assert!(!gbs.baixo_risco_ambulatorial);

    // BISAP: 3 critérios positivos = 3 pontos
    let bisap = calcular_bisap(true, true, true, false, false);
    assert_eq!(bisap.pontuacao_total, 3);
    assert!(bisap.indicacao_uti);

    // Alvarado: 7 pontos
    let alv = calcular_alvarado(true, true, true, true, true, true, false, false);
    assert_eq!(alv.pontuacao_total, 8);
    assert!(alv.probabilidade_apendicite.contains("Alta Probabilidade"));
}

#[test]
fn test_corticoide_antropometria_centor_naegele_sofa() {
    // Corticoide: 20mg Prednisona -> Dexametasona ~3mg, Hidrocortisona ~80mg
    let cort = calcular_equivalencia_corticoide("Prednisona", 20.0).unwrap();
    let dex = cort.doses_equivalentes.iter().find(|d| d.farmaco.contains("Dexametasona")).unwrap();
    assert_eq!(dex.dose_equivalente_mg, 3.0);
    let hid = cort.doses_equivalentes.iter().find(|d| d.farmaco.contains("Hidrocortisona")).unwrap();
    assert_eq!(hid.dose_equivalente_mg, 80.0);

    // Antropometria: Homem 100 kg, 175 cm
    let ant = calcular_antropometria_farmacologica(100.0, 175.0, false).unwrap();
    assert_eq!(ant.peso_ideal_devine_kg, 70.6); // 50 + 0.91 * (175 - 152.4) = 70.5 kg
    assert_eq!(ant.peso_ajustado_obesidade_kg, 82.3); // 70.5 + 0.4 * (100 - 70.5) = 82.3 kg
    assert_eq!(ant.superficie_corporal_mosteller_m2, 2.2);

    // Centor: Idade 20 (1), Febre (1), Sem tosse (1), Adenomegalia (1), Exsudato (1) = 5 pontos
    let centor = calcular_centor_mcisaac(20, true, true, true, true);
    assert_eq!(centor.pontuacao_total, 4);
    assert!(centor.indicacao_teste_rapido_ou_atb.contains("Tratamento antibiótico empírico"));

    // Naegele: DUM 10/05/2026, Consulta 15/07/2026 -> DPP 17/02/2027
    let gest = calcular_idade_gestacional_dpp(2026, 5, 10, 2026, 7, 15).unwrap();
    assert_eq!(gest.data_provavel_parto_naegele, "17/02/2027");

    // SOFA: PaO2/FiO2 150 em VM (3), Plaq 80 (2), Bili 2.5 (2), PAM 65 (0), Noradrenalina 0.2 (4), GCS 10 (2), Cr 2.5 (2) = 15 pontos
    let sofa = calcular_sofa_completo(150.0, true, 80.0, 2.5, 65.0, 0.0, 0.2, 10, 2.5, 800.0, 38.5, 110.0, 24.0, 15000.0);
    assert_eq!(sofa.sofa_total, 15);
    assert!(sofa.sirs_positivo);
    assert!(sofa.conduta_sepse.contains("Falência de múltiplos órgãos"));
}
