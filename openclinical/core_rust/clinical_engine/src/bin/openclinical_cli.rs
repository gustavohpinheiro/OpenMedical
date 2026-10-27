use clinical_engine::calculators::{
    avaliar_estagio_drc, calcular_tfg_ckd_epi_2021,
};
use clinical_engine::database::BancoDadosClinico;
use clinical_engine::pediatric::calcular_dose_pediatrica;
use std::env;
use std::path::Path;

fn resolver_caminho_banco() -> String {
    let caminhos = [
        "openclinical_core.sqlite",
        "openclinical/etl_pipeline/openclinical_core.sqlite",
        "../etl_pipeline/openclinical_core.sqlite",
        "../../etl_pipeline/openclinical_core.sqlite",
        "etl_pipeline/openclinical_core.sqlite",
        "e:/source/OpenMedical/openclinical/etl_pipeline/openclinical_core.sqlite",
    ];

    for c in caminhos {
        if Path::new(c).exists() {
            return c.to_string();
        }
    }

    "openclinical_core.sqlite".to_string()
}

fn main() {
    let args: Vec<String> = env::args().collect();
    let comando = args.get(1).map(|s| s.as_str()).unwrap_or("ajuda");

    println!("============================================================");
    println!("  🏥 OPENCLINICAL CLI - MOTOR DETERMINÍSTICO EM RUST 🦀   ");
    println!("  Point-of-Care SUS / ANVISA / RENAME / FTS5 SQLite         ");
    println!("============================================================");

    match comando {
        "buscar" => {
            let termo = args.get(2).map(|s| s.as_str()).unwrap_or("amoxicilina");
            let caminho_db = resolver_caminho_banco();
            println!("\n🔍 Buscando no SQLite FTS5 por '{}'...", termo);
            println!("📂 Banco de dados: {}\n", caminho_db);

            match BancoDadosClinico::abrir_somente_leitura(&caminho_db) {
                Ok(banco) => match banco.buscar_geral(termo, 10) {
                    Ok(resultados) => {
                        println!("Encontrados {} registros:", resultados.len());
                        for (i, r) in resultados.iter().enumerate() {
                            println!(
                                "  {}. [{}] {} (Score BM25: {:.2})",
                                i + 1,
                                r.tipo_registro.to_uppercase(),
                                r.titulo_primario,
                                r.score_relevancia
                            );
                            println!("     Contexto: {}", r.subtitulo);
                        }
                    }
                    Err(e) => eprintln!("❌ Erro na consulta FTS5: {}", e),
                },
                Err(e) => eprintln!("❌ Falha ao conectar ao banco SQLite: {}", e),
            }
        }

        "tfg" => {
            let creatinina: f64 = args.get(2).and_then(|s| s.parse().ok()).unwrap_or(1.2);
            let idade: u32 = args.get(3).and_then(|s| s.parse().ok()).unwrap_or(65);
            let sexo_fem: bool = args.get(4).map(|s| s == "f" || s == "fem").unwrap_or(false);

            println!("\n🧮 Calculando TFG (CKD-EPI 2021 sem viés racial):");
            println!("   Creatinina: {} mg/dL | Idade: {} anos | Sexo: {}", creatinina, idade, if sexo_fem { "Feminino" } else { "Masculino" });

            match calcular_tfg_ckd_epi_2021(creatinina, idade, sexo_fem) {
                Ok(tfg) => {
                    let avaliacao = avaliar_estagio_drc(tfg);
                    println!("\n   ⭐ TFG Estimada: {:.2} mL/min/1.73m²", tfg);
                    println!("   ⭐ Classificação KDIGO: {}", avaliacao.estagio_drc);
                    println!("   ⭐ Recomendação Clínica: {}", avaliacao.recomendacao_geral);
                }
                Err(e) => eprintln!("❌ Erro no cálculo: {}", e),
            }
        }

        "pediatrico" => {
            let peso: f64 = args.get(2).and_then(|s| s.parse().ok()).unwrap_or(15.0);
            let dose_alvo: f64 = args.get(3).and_then(|s| s.parse().ok()).unwrap_or(50.0);
            let conc: f64 = args.get(4).and_then(|s| s.parse().ok()).unwrap_or(50.0); // 250mg/5mL
            let fracionamento: u8 = args.get(5).and_then(|s| s.parse().ok()).unwrap_or(3);
            let teto: f64 = args.get(6).and_then(|s| s.parse().ok()).unwrap_or(3000.0);

            println!("\n👶 Calculando Dose Pediátrica Líquida:");
            println!("   Peso: {} kg | Dose: {} mg/kg/dia | Conc: {} mg/mL | Tomadas/dia: {} | Teto: {} mg/dia",
                peso, dose_alvo, conc, fracionamento, teto);

            match calcular_dose_pediatrica(peso, dose_alvo, conc, fracionamento, Some(teto)) {
                Ok(res) => {
                    println!("\n   ⭐ Volume por Tomada: {:.1} mL ({})", res.volume_ml_por_tomada, format!("{} gotas", res.numero_gotas_por_tomada));
                    println!("   ⭐ Dose por Tomada: {:.1} mg a cada {} horas", res.dose_por_tomada_mg, res.intervalo_horas);
                    println!("   ⭐ Dose Diária Total: {:.1} mg/dia (Teto aplicado: {:.1} mg)", res.dose_total_calculada_mg_dia, res.dose_teto_aplicada_mg_dia);
                    if res.alerta_teto_ultrapassado {
                        println!("   ⚠️  ALERTA DE SEGURANÇA: {}", res.justificativa_seguranca.unwrap_or_default());
                    }
                }
                Err(e) => eprintln!("❌ Erro no cálculo: {}", e),
            }
        }

        "interacoes" => {
            let ids: Vec<i64> = if args.len() > 2 {
                args[2..].iter().filter_map(|s| s.parse().ok()).collect()
            } else {
                vec![3, 4] // Losartana + Enalapril
            };

            let caminho_db = resolver_caminho_banco();
            println!("\n⚠️  Verificando Interações Clínicas para IDs {:?}...", ids);

            match BancoDadosClinico::abrir_somente_leitura(&caminho_db) {
                Ok(banco) => match banco.verificar_interacoes(&ids) {
                    Ok(interacoes) => {
                        println!("Detectadas {} interações clínicas:", interacoes.len());
                        for (i, inter) in interacoes.iter().enumerate() {
                            println!(
                                "\n  {}. [GRAVIDADE: {}] {} x {}",
                                i + 1,
                                inter.gravidade_interacao.to_uppercase(),
                                inter.nome_principio_a.as_deref().unwrap_or("?"),
                                inter.nome_principio_b.as_deref().unwrap_or("?")
                            );
                            println!("     Efeito: {}", inter.efeito_clinico);
                            println!("     Conduta Médica: {}", inter.conduta_recomendada);
                        }
                    }
                    Err(e) => eprintln!("❌ Erro na verificação: {}", e),
                },
                Err(e) => eprintln!("❌ Falha ao conectar ao banco SQLite: {}", e),
            }
        }

        _ => {
            println!("\nUso do OpenClinical CLI em Rust:");
            println!("  cargo run --bin openclinical_cli -- buscar <termo>");
            println!("      Ex: cargo run --bin openclinical_cli -- buscar amoxicilina");
            println!("      Ex: cargo run --bin openclinical_cli -- buscar \"N39.0\"");
            println!("      Ex: cargo run --bin openclinical_cli -- buscar dengue\n");
            println!("  cargo run --bin openclinical_cli -- tfg <creatinina> <idade> <sexo (m/f)>");
            println!("      Ex: cargo run --bin openclinical_cli -- tfg 1.4 68 m\n");
            println!("  cargo run --bin openclinical_cli -- pediatrico <peso_kg> <dose_mg_kg_dia> <conc_mg_ml> <tomadas_dia> <teto_mg>");
            println!("      Ex: cargo run --bin openclinical_cli -- pediatrico 15 50 50 3 3000\n");
            println!("  cargo run --bin openclinical_cli -- interacoes <id1> <id2> ...");
            println!("      Ex: cargo run --bin openclinical_cli -- interacoes 3 4   (Losartana + Enalapril)\n");
        }
    }
}
