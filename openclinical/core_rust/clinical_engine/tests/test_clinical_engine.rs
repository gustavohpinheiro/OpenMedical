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
}
