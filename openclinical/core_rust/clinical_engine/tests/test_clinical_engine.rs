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
    let res = calcular_dose_pediatrica(15.0, 50.0, 50.0, 3, Some(3000.0));
    assert!(res.is_ok());
    let dose = res.unwrap();

    assert_eq!(dose.dose_total_calculada_mg_dia, 750.0);
    assert_eq!(dose.dose_teto_aplicada_mg_dia, 750.0);
    assert_eq!(dose.dose_por_tomada_mg, 250.0);
    assert_eq!(dose.volume_ml_por_tomada, 5.0);
    assert_eq!(dose.numero_gotas_por_tomada, 100);
    assert_eq!(dose.intervalo_horas, 8);
    assert!(!dose.alerta_teto_ultrapassado);
    assert!(dose.justificativa_seguranca.is_none());
}

#[test]
fn test_pediatrico_teto_maximo_ultrapassado() {
    // Criança de 40 kg, dose 90 mg/kg/dia -> 3600 mg/dia
    // Teto estabelecido: 3000 mg/dia
    let res = calcular_dose_pediatrica(40.0, 90.0, 50.0, 3, Some(3000.0));
    assert!(res.is_ok());
    let dose = res.unwrap();

    assert_eq!(dose.dose_total_calculada_mg_dia, 3600.0);
    assert_eq!(dose.dose_teto_aplicada_mg_dia, 3000.0);
    assert_eq!(dose.dose_por_tomada_mg, 1000.0);
    assert_eq!(dose.volume_ml_por_tomada, 20.0);
    assert!(dose.alerta_teto_ultrapassado);
    assert!(dose.justificativa_seguranca.is_some());
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
    assert!(calcular_dose_pediatrica(0.0, 50.0, 50.0, 3, None).is_err());
    assert!(calcular_dose_pediatrica(15.0, 50.0, 50.0, 0, None).is_err());
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

    for tipo in ["medicamento", "protocolo", "pcdt_governo", "cmed_comercial"] {
        let termo = match tipo {
            "medicamento" => "amoxicilina",
            "protocolo" => "hipertensao",
            "pcdt_governo" => "acromegalia",
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
fn test_cotacao_farmacia_dipirona_sempre_com_valor() {
    use clinical_engine::pharmacy_pricing::cotar_precos_farmacias;

    let analise = cotar_precos_farmacias(
        "NOVALGINA",
        "DIPIRONA MONOIDRATADA",
        "Referência",
        "500 MG COM CT BL AL PLAS INC X 20",
        "7891058001234",
        28.50,
    );

    // O valor deve sempre existir e ser positivo
    assert_eq!(analise.nome_comercial, "NOVALGINA");
    assert_eq!(analise.preco_pmc_teto, 28.50);
    assert!(analise.menor_preco_estimado > 0.0);
    assert!(analise.menor_preco_estimado <= analise.maior_preco_estimado);
    assert!(analise.maior_preco_estimado <= analise.preco_pmc_teto);
    assert!(analise.preco_medio > 0.0);

    // Todas as farmácias parceiras devem ter preço cotado válido menor ou igual ao teto regulatório
    assert!(!analise.cotacoes.is_empty());
    for cotacao in &analise.cotacoes {
        assert!(cotacao.preco_estimado >= 0.0);
        assert!(cotacao.preco_estimado <= analise.preco_pmc_teto);
        assert!(!cotacao.nome_farmacia.is_empty());
        assert!(!cotacao.link_busca.is_empty());
    }

    // Deve extrair 20 unidades e calcular o preço por comprimido
    assert_eq!(analise.quantidade_unidades, Some(20));
    assert!(analise.preco_por_unidade.is_some());
    let preco_unidade = analise.preco_por_unidade.unwrap();
    assert!(preco_unidade > 0.0 && preco_unidade < 2.0);
}

#[test]
fn test_farmacia_popular_losartana_gratuita() {
    use clinical_engine::pharmacy_pricing::{cotar_precos_farmacias, verificar_elegibilidade_farmacia_popular};

    let (elegivel, detalhe) = verificar_elegibilidade_farmacia_popular("LOSARTANA POTÁSSICA");
    assert!(elegivel);
    assert!(detalhe.unwrap().contains("100% Gratuito"));

    let analise = cotar_precos_farmacias(
        "LOSARTANA POTÁSSICA",
        "LOSARTANA POTÁSSICA",
        "Genérico",
        "50 MG COM REV CT BL AL PLAS OPC X 30",
        "7896714200000",
        18.00,
    );

    assert!(analise.elegivel_farmacia_popular);
    // Deve incluir a cotação do programa Farmácia Popular com R$ 0,00
    let cotacao_fp = analise
        .cotacoes
        .iter()
        .find(|c| c.nome_farmacia.contains("Farmácia Popular"));
    assert!(cotacao_fp.is_some());
    assert_eq!(cotacao_fp.unwrap().preco_estimado, 0.00);
    assert_eq!(cotacao_fp.unwrap().desconto_percentual, 100.0);
}

#[test]
fn test_farmacia_popular_sinvastatina_copagamento() {
    use clinical_engine::pharmacy_pricing::{cotar_precos_farmacias, verificar_elegibilidade_farmacia_popular};

    let (elegivel, detalhe) = verificar_elegibilidade_farmacia_popular("SINVASTATINA");
    assert!(elegivel);
    assert!(detalhe.unwrap().contains("Copagamento"));

    let analise = cotar_precos_farmacias(
        "ZOCOR",
        "SINVASTATINA",
        "Referência",
        "20 MG COM REV CT BL AL PLAS INC X 30",
        "7890000000000",
        50.00,
    );

    assert!(analise.elegivel_farmacia_popular);
    let cotacao_fp = analise
        .cotacoes
        .iter()
        .find(|c| c.nome_farmacia.contains("Farmácia Popular"));
    assert!(cotacao_fp.is_some());
    assert_eq!(cotacao_fp.unwrap().preco_estimado, 5.00); // 90% desconto sobre 50.00 = 5.00
}

#[test]
fn test_extrair_quantidade_unidades() {
    use clinical_engine::pharmacy_pricing::extrair_quantidade_unidades;

    assert_eq!(extrair_quantidade_unidades("500 MG COM CT BL AL PLAS INC X 30"), Some(30));
    assert_eq!(extrair_quantidade_unidades("10 MG/ML SOL ORAL CT FR GTS X 20 ML"), Some(20));
    assert_eq!(extrair_quantidade_unidades("20 MG COM REV X 60"), Some(60));
}
