use clinical_engine::api_anvisa::{mascarar_client_id, normalizar_credenciais, testar_conexao};
use clinical_engine::atualizador::atualizar_bases;
use clinical_engine::calculators::{
    avaliar_estagio_drc, calcular_tfg_ckd_epi_2021,
};
use clinical_engine::database::BancoDadosClinico;
use clinical_engine::pediatric::calcular_dose_pediatrica;
use clinical_engine::pharmacy_pricing::analisar_preco_medicamento;
use std::env;
use std::path::Path;

fn resolver_caminho_banco() -> String {
    let caminhos = [
        "openclinical_core.sqlite",
        "openclinical/etl_pipeline/openclinical_core.sqlite",
        "../etl_pipeline/openclinical_core.sqlite",
        "../../etl_pipeline/openclinical_core.sqlite",
        "etl_pipeline/openclinical_core.sqlite",
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

            match calcular_dose_pediatrica(peso, dose_alvo, Some(conc), fracionamento, Some(teto)) {
                Ok(res) => {
                    if let (Some(volume), Some(gotas)) = (res.volume_ml_por_tomada, res.numero_gotas_por_tomada) {
                        println!("\n   ⭐ Volume por Tomada: {volume:.1} mL ({gotas} gotas)");
                    }
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

        "precos" => {
            let termo = args.get(2).map(|s| s.as_str()).unwrap_or("dipirona");
            let caminho_db = resolver_caminho_banco();
            println!("\n💊 PREÇO MÁXIMO (PMC/CMED) E FARMÁCIA POPULAR");
            println!("   Pesquisando: '{}' na tabela CMED...\n", termo);

            match BancoDadosClinico::abrir_somente_leitura(&caminho_db) {
                Ok(banco) => match banco.buscar_geral(termo, 50) {
                    Ok(achados) => {
                        let ids_cmed: Vec<i64> = achados
                            .into_iter()
                            .filter(|item| item.tipo_registro == "cmed_comercial")
                            .filter_map(|item| item.id_referencia.as_i64())
                            .take(10)
                            .collect();

                        if ids_cmed.is_empty() {
                            println!("Nenhuma apresentação encontrada na tabela CMED para '{}'.", termo);
                        }

                        for id in ids_cmed {
                            match banco.obter_registro_cmed(id) {
                                Ok(med) => {
                                    let analise = analisar_preco_medicamento(
                                        &med.nome_produto,
                                        &med.substancia,
                                        &med.tipo_produto,
                                        &med.apresentacao,
                                        &med.codigo_ean,
                                        med.preco_maximo_consumidor,
                                    );
                                    let pmc = analise
                                        .preco_pmc_teto
                                        .map(|valor| format!("R$ {valor:.2}"))
                                        .unwrap_or_else(|| "sem PMC publicado".to_string());
                                    println!("• {} - {}", analise.nome_comercial, analise.apresentacao);
                                    println!("    {} | PMC (ICMS 18%): {}", analise.substancia, pmc);
                                    println!(
                                        "    Farmácia Popular: {}",
                                        analise.farmacia_popular.mensagem
                                    );
                                }
                                Err(e) => eprintln!("❌ Erro ao buscar dados da CMED: {}", e),
                            }
                        }
                        println!(
                            "\nO preço praticado só pode ser conferido nas farmácias (ex.: https://consultaremedios.com.br/)."
                        );
                    }
                    Err(e) => eprintln!("❌ Erro ao buscar registros: {}", e),
                },
                Err(e) => eprintln!("❌ Falha ao conectar ao banco SQLite: {}", e),
            }
        }

        "atualizar" => {
            // Mesmo atualizador que o app desktop dispara uma vez por dia; pode ir no agendador do sistema
            let caminho_db = args
                .get(2)
                .filter(|a| !a.starts_with("--"))
                .cloned()
                .unwrap_or_else(resolver_caminho_banco);
            let forcar = args.iter().any(|a| a == "--forcar");
            println!("\n🔄 Atualizando bases oficiais da ANVISA em {caminho_db}...\n");
            match atualizar_bases(&caminho_db, forcar) {
                Ok(resultados) => {
                    for r in resultados {
                        println!("• [{}] {}: {}", r.situacao.to_uppercase(), r.descricao, r.mensagem);
                    }
                }
                Err(e) => {
                    eprintln!("❌ {e}");
                    std::process::exit(1);
                }
            }
        }

        "testar-api-anvisa" => {
            // Credencial por variável de ambiente para não ficar no histórico do terminal
            let (Ok(client_id), Ok(client_secret)) = (env::var("ANVISA_CLIENT_ID"), env::var("ANVISA_CLIENT_SECRET")) else {
                eprintln!("Defina ANVISA_CLIENT_ID (CPF, só números) e ANVISA_CLIENT_SECRET antes de rodar.");
                std::process::exit(2);
            };
            let credenciais = match normalizar_credenciais(&client_id, &client_secret) {
                Ok(c) => c,
                Err(e) => {
                    eprintln!("❌ {e}");
                    std::process::exit(2);
                }
            };
            println!("\n🔑 Testando a credencial {} no Portal de APIs da ANVISA...\n", mascarar_client_id(&credenciais.client_id));
            let teste = testar_conexao(&credenciais);
            println!("{} {}", if teste.autenticado { "✅" } else { "❌" }, teste.mensagem);
            for servico in teste.servicos {
                println!("• {}: {} - {}", servico.nome, servico.situacao, servico.detalhe);
                for operacao in servico.operacoes.iter().take(40) {
                    println!("    {operacao}");
                }
            }
        }

        "bula" => {
            let registro = args.get(2).map(|s| s.as_str()).unwrap_or("100290007");
            let caminho_db = resolver_caminho_banco();
            match BancoDadosClinico::abrir_somente_leitura(&caminho_db).and_then(|b| b.consultar_bula_anvisa(registro)) {
                Ok(Some(bula)) => {
                    println!("\n📄 {} ({})", bula.nome_produto, bula.empresa);
                    println!("   Bula vigente no Bulário: {} | expediente {}", bula.data_publicacao, bula.expediente);
                    println!("   {}", bula.url_bulario);
                }
                Ok(None) => println!("\nRegistro {registro} sem bula no índice (rode 'atualizar' para baixar o índice)."),
                Err(e) => eprintln!("❌ {e}"),
            }
        }

        _ => {
            println!("\nUso do OpenClinical CLI em Rust:");
            println!("  cargo run --bin openclinical_cli -- atualizar [caminho_banco] [--forcar]");
            println!("      Baixa preços CMED, registros e índice de bulas da ANVISA (só o que mudou)\n");
            println!("  cargo run --bin openclinical_cli -- bula <numero_registro>");
            println!("      Ex: cargo run --bin openclinical_cli -- bula 100290007\n");
            println!("  cargo run --bin openclinical_cli -- precos <medicamento>");
            println!("      Ex: cargo run --bin openclinical_cli -- precos dipirona");
            println!("      Ex: cargo run --bin openclinical_cli -- precos losartana");
            println!("      Ex: cargo run --bin openclinical_cli -- precos amoxicilina\n");
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
