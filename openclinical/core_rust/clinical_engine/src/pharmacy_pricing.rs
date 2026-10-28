//! Módulo de Cotação e Comparação de Preços em Farmácias Brasileiras.
//!
//! Integra os dados regulatórios da CMED/ANVISA (Preço Máximo ao Consumidor - PMC)
//! com curvas de desconto do varejo farmacêutico nacional e regras do
//! Programa Farmácia Popular do Brasil (Portaria GM/MS nº 675/2023).

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct CotacaoFarmacia {
    pub nome_farmacia: String,
    pub tipo_rede: String,
    pub preco_estimado: f64,
    pub desconto_percentual: f64,
    pub link_busca: String,
    pub disponibilidade: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct AnalisePrecoMedicamento {
    pub nome_comercial: String,
    pub substancia: String,
    pub tipo_produto: String,
    pub apresentacao: String,
    pub codigo_ean: String,
    pub preco_pmc_teto: f64,
    pub menor_preco_estimado: f64,
    pub maior_preco_estimado: f64,
    pub preco_medio: f64,
    pub preco_por_unidade: Option<f64>,
    pub quantidade_unidades: Option<u32>,
    pub elegivel_farmacia_popular: bool,
    pub faixa_farmacia_popular: Option<String>,
    pub cotacoes: Vec<CotacaoFarmacia>,
}

/// Verifica se o princípio ativo é contemplado no Programa Farmácia Popular do Brasil.
///
/// Retorna `(elegivel, detalhe_programa)`.
pub fn verificar_elegibilidade_farmacia_popular(substancia: &str) -> (bool, Option<&'static str>) {
    let sub_upper = substancia.to_uppercase();

    // 100% Gratuito (Gratuidade Universal SUS)
    // Hipertensão
    if sub_upper.contains("ATENOLOL")
        || sub_upper.contains("CAPTOPRIL")
        || sub_upper.contains("ENALAPRIL")
        || sub_upper.contains("HIDROCLOROTIAZIDA")
        || sub_upper.contains("LOSARTANA")
        || sub_upper.contains("PROPRANOLOL")
    {
        return (
            true,
            Some("Farmácia Popular: 100% Gratuito (SUS R$ 0,00) - Hipertensão"),
        );
    }

    // Diabetes
    if sub_upper.contains("METFORMINA")
        || sub_upper.contains("GLIBENCLAMIDA")
        || sub_upper.contains("INSULINA")
    {
        return (
            true,
            Some("Farmácia Popular: 100% Gratuito (SUS R$ 0,00) - Diabetes"),
        );
    }

    // Asma
    if sub_upper.contains("SALBUTAMOL")
        || sub_upper.contains("IPRATROPIO")
        || sub_upper.contains("IPRATRÓPIO")
        || sub_upper.contains("BECLOMETASONA")
    {
        return (
            true,
            Some("Farmácia Popular: 100% Gratuito (SUS R$ 0,00) - Asma"),
        );
    }

    // Osteoporose
    if sub_upper.contains("ALENDRONATO") {
        return (
            true,
            Some("Farmácia Popular: 100% Gratuito (SUS R$ 0,00) - Osteoporose"),
        );
    }

    // Anticoncepcionais
    if sub_upper.contains("MEDROXIPROGESTERONA")
        || sub_upper.contains("NORETISTERONA")
        || sub_upper.contains("ETINILESTRADIOL")
    {
        return (
            true,
            Some("Farmácia Popular: 100% Gratuito (SUS R$ 0,00) - Anticoncepção"),
        );
    }

    // Copagamento subsidiado (desconto de até 90% pelo Ministério da Saúde)
    if sub_upper.contains("SINVASTATINA") {
        return (
            true,
            Some("Farmácia Popular: Copagamento com até 90% de subsídio SUS - Dislipidemia"),
        );
    }

    if sub_upper.contains("TIMOLOL") {
        return (
            true,
            Some("Farmácia Popular: Copagamento com até 90% de subsídio SUS - Glaucoma"),
        );
    }

    if sub_upper.contains("LEVODOPA") || sub_upper.contains("BENSERAZIDA") || sub_upper.contains("CARBIDOPA") {
        return (
            true,
            Some("Farmácia Popular: Copagamento com até 90% de subsídio SUS - Parkinson"),
        );
    }

    if sub_upper.contains("BUDESONIDA") {
        return (
            true,
            Some("Farmácia Popular: Copagamento com até 90% de subsídio SUS - Rinite"),
        );
    }

    (false, None)
}

/// Extrai a quantidade total de unidades (comprimidos, cápsulas ou mL) da descrição da apresentação comercial.
pub fn extrair_quantidade_unidades(apresentacao: &str) -> Option<u32> {
    let apr = apresentacao.to_uppercase();

    // Procura padrões como " X 30", " X 20", " X 60", " X 100"
    if let Some(pos_x) = apr.rfind(" X ") {
        let pedaco_depois = &apr[pos_x + 3..];
        let num_str: String = pedaco_depois
            .chars()
            .take_while(|c| c.is_ascii_digit())
            .collect();
        if let Ok(n) = num_str.parse::<u32>() {
            if n > 0 && n <= 500 {
                return Some(n);
            }
        }
    }

    // Procura "30 COMP", "20 ML", "28 CAPS"
    let partes: Vec<&str> = apr.split_whitespace().collect();
    for (i, p) in partes.iter().enumerate() {
        if let Ok(n) = p.parse::<u32>() {
            if i + 1 < partes.len() {
                let prox = partes[i + 1];
                if prox.starts_with("COMP")
                    || prox.starts_with("CAP")
                    || prox.starts_with("DRAG")
                    || prox.starts_with("ML")
                    || prox.starts_with("ENV")
                {
                    if n > 0 && n <= 500 {
                        return Some(n);
                    }
                }
            }
        }
    }

    None
}

/// Arredonda valor para 2 casas decimais.
#[inline]
fn arredondar_moeda(valor: f64) -> f64 {
    (valor * 100.0).round() / 100.0
}

/// Constrói a URL de busca codificada para a farmácia.
fn montar_url_busca(base_url: &str, termo: &str) -> String {
    let termo_codificado: String = termo
        .chars()
        .map(|c| match c {
            ' ' => '+',
            c if c.is_alphanumeric() || c == '-' || c == '.' => c,
            _ => '+',
        })
        .collect();
    format!("{base_url}{termo_codificado}")
}

/// Realiza a cotação simulada estruturada e comparativa entre as principais redes de farmácias do Brasil.
///
/// Aplica as curvas de desconto do varejo farmacêutico brasileiro sobre o PMC oficial:
/// - Genéricos: 42% a 64% de desconto sobre o PMC
/// - Similares: 28% a 48% de desconto sobre o PMC
/// - Novos/Referência: 12% a 28% de desconto sobre o PMC
pub fn cotar_precos_farmacias(
    nome_produto: &str,
    substancia: &str,
    tipo_produto: &str,
    apresentacao: &str,
    codigo_ean: &str,
    pmc: f64,
) -> AnalisePrecoMedicamento {
    let preco_teto = if pmc > 0.0 { pmc } else { 15.0 };
    let tipo_upper = tipo_produto.to_uppercase();
    let is_generico = tipo_upper.contains("GENÉRICO") || tipo_upper.contains("GENERICO");
    let is_similar = tipo_upper.contains("SIMILAR");

    // Termo para links de busca (usa EAN se presente e válido, senão nome do produto)
    let termo_busca = if !codigo_ean.trim().is_empty() && codigo_ean.len() >= 8 {
        codigo_ean.trim()
    } else {
        nome_produto.trim()
    };

    // Curvas médias de desconto por rede e tipo regulatório
    let mut cotacoes = Vec::new();

    // 1. Ultrafarma (costuma ter os maiores descontos em genéricos)
    let desc_ultrafarma = if is_generico { 0.62 } else if is_similar { 0.44 } else { 0.26 };
    let preco_ultrafarma = arredondar_moeda(preco_teto * (1.0 - desc_ultrafarma));
    cotacoes.push(CotacaoFarmacia {
        nome_farmacia: "Ultrafarma".to_string(),
        tipo_rede: "Varejo Online & Lojas".to_string(),
        preco_estimado: preco_ultrafarma,
        desconto_percentual: arredondar_moeda(desc_ultrafarma * 100.0),
        link_busca: montar_url_busca("https://www.ultrafarma.com.br/busca?q=", termo_busca),
        disponibilidade: "Entrega em Todo o Brasil".to_string(),
    });

    // 2. Drogasil
    let desc_drogasil = if is_generico { 0.54 } else if is_similar { 0.36 } else { 0.20 };
    let preco_drogasil = arredondar_moeda(preco_teto * (1.0 - desc_drogasil));
    cotacoes.push(CotacaoFarmacia {
        nome_farmacia: "Drogasil".to_string(),
        tipo_rede: "Rede Nacional (RD Saúde)".to_string(),
        preco_estimado: preco_drogasil,
        desconto_percentual: arredondar_moeda(desc_drogasil * 100.0),
        link_busca: montar_url_busca("https://www.drogasil.com.br/search?w=", termo_busca),
        disponibilidade: "Retirada em 1h ou Entrega".to_string(),
    });

    // 3. Droga Raia
    let desc_raia = if is_generico { 0.52 } else if is_similar { 0.35 } else { 0.21 };
    let preco_raia = arredondar_moeda(preco_teto * (1.0 - desc_raia));
    cotacoes.push(CotacaoFarmacia {
        nome_farmacia: "Droga Raia".to_string(),
        tipo_rede: "Rede Nacional (RD Saúde)".to_string(),
        preco_estimado: preco_raia,
        desconto_percentual: arredondar_moeda(desc_raia * 100.0),
        link_busca: montar_url_busca("https://www.drogaraia.com.br/search?w=", termo_busca),
        disponibilidade: "Retirada em Loja e Delivery".to_string(),
    });

    // 4. Drogaria São Paulo / Pacheco (DPSP)
    let desc_dpsp = if is_generico { 0.50 } else if is_similar { 0.34 } else { 0.18 };
    let preco_dpsp = arredondar_moeda(preco_teto * (1.0 - desc_dpsp));
    cotacoes.push(CotacaoFarmacia {
        nome_farmacia: "Drogaria São Paulo / Pacheco".to_string(),
        tipo_rede: "Grupo DPSP".to_string(),
        preco_estimado: preco_dpsp,
        desconto_percentual: arredondar_moeda(desc_dpsp * 100.0),
        link_busca: montar_url_busca("https://www.drogariasaopaulo.com.br/", termo_busca),
        disponibilidade: "Lojas Físicas e E-commerce".to_string(),
    });

    // 5. Farmácias Pague Menos
    let desc_pague_menos = if is_generico { 0.53 } else if is_similar { 0.37 } else { 0.19 };
    let preco_pague_menos = arredondar_moeda(preco_teto * (1.0 - desc_pague_menos));
    cotacoes.push(CotacaoFarmacia {
        nome_farmacia: "Pague Menos".to_string(),
        tipo_rede: "Rede Nacional".to_string(),
        preco_estimado: preco_pague_menos,
        desconto_percentual: arredondar_moeda(desc_pague_menos * 100.0),
        link_busca: montar_url_busca("https://www.paguemenos.com.br/", termo_busca),
        disponibilidade: "Retirada Expressa".to_string(),
    });

    // 6. Panvel Farmácias
    let desc_panvel = if is_generico { 0.48 } else if is_similar { 0.32 } else { 0.17 };
    let preco_panvel = arredondar_moeda(preco_teto * (1.0 - desc_panvel));
    cotacoes.push(CotacaoFarmacia {
        nome_farmacia: "Panvel".to_string(),
        tipo_rede: "Sul & Sudeste".to_string(),
        preco_estimado: preco_panvel,
        desconto_percentual: arredondar_moeda(desc_panvel * 100.0),
        link_busca: montar_url_busca("https://www.panvel.com/panvel/buscarProduto.do?termoPesquisa=", termo_busca),
        disponibilidade: "Lojas e E-commerce".to_string(),
    });

    // 7. Agregador Consulta Remédios
    cotacoes.push(CotacaoFarmacia {
        nome_farmacia: "Consulta Remédios".to_string(),
        tipo_rede: "Agregador de Cotações".to_string(),
        preco_estimado: preco_ultrafarma,
        desconto_percentual: arredondar_moeda(desc_ultrafarma * 100.0),
        link_busca: montar_url_busca("https://consultaremedios.com.br/busca?termo=", termo_busca),
        disponibilidade: "Comparativo de Centenas de Farmácias".to_string(),
    });

    // Checagem Farmácia Popular
    let (elegivel_fp, faixa_fp) = verificar_elegibilidade_farmacia_popular(substancia);
    if elegivel_fp {
        if let Some(msg) = faixa_fp {
            if msg.contains("100% Gratuito") {
                cotacoes.insert(
                    0,
                    CotacaoFarmacia {
                        nome_farmacia: "Programa Farmácia Popular (SUS)".to_string(),
                        tipo_rede: "Rede Credenciada SUS / 'Aqui Tem Farmácia Popular'".to_string(),
                        preco_estimado: 0.00,
                        desconto_percentual: 100.0,
                        link_busca: "https://www.gov.br/saude/pt-br/composicao/sectics/farmacia-popular".to_string(),
                        disponibilidade: "100% Gratuito com Receita do SUS ou Particular".to_string(),
                    },
                );
            } else if msg.contains("Copagamento") {
                let copagamento_estimado = arredondar_moeda(preco_teto * 0.10);
                cotacoes.insert(
                    0,
                    CotacaoFarmacia {
                        nome_farmacia: "Farmácia Popular (Copagamento SUS)".to_string(),
                        tipo_rede: "Subsídio do Ministério da Saúde até 90%".to_string(),
                        preco_estimado: copagamento_estimado,
                        desconto_percentual: 90.0,
                        link_busca: "https://www.gov.br/saude/pt-br/composicao/sectics/farmacia-popular".to_string(),
                        disponibilidade: "Subsídio Governamental nas Redes Credenciadas".to_string(),
                    },
                );
            }
        }
    }

    // Calcula limites e médias de mercado (excluindo a Farmácia Popular gratuita de R$ 0 para a média comercial)
    let precos_comerciais: Vec<f64> = cotacoes
        .iter()
        .filter(|c| !c.nome_farmacia.contains("Farmácia Popular"))
        .map(|c| c.preco_estimado)
        .collect();

    let menor_preco = precos_comerciais
        .iter()
        .copied()
        .min_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal))
        .unwrap_or(preco_ultrafarma);

    let maior_preco = precos_comerciais
        .iter()
        .copied()
        .max_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal))
        .unwrap_or(preco_teto);

    let soma: f64 = precos_comerciais.iter().sum();
    let preco_medio = if !precos_comerciais.is_empty() {
        arredondar_moeda(soma / precos_comerciais.len() as f64)
    } else {
        preco_teto
    };

    // Preço por unidade
    let qtd_unidades = extrair_quantidade_unidades(apresentacao);
    let preco_por_unidade = qtd_unidades.map(|qtd| arredondar_moeda(menor_preco / qtd as f64));

    AnalisePrecoMedicamento {
        nome_comercial: nome_produto.to_string(),
        substancia: substancia.to_string(),
        tipo_produto: tipo_produto.to_string(),
        apresentacao: apresentacao.to_string(),
        codigo_ean: codigo_ean.to_string(),
        preco_pmc_teto: arredondar_moeda(preco_teto),
        menor_preco_estimado: menor_preco,
        maior_preco_estimado: maior_preco,
        preco_medio,
        preco_por_unidade,
        quantidade_unidades: qtd_unidades,
        elegivel_farmacia_popular: elegivel_fp,
        faixa_farmacia_popular: faixa_fp.map(|s| s.to_string()),
        cotacoes,
    }
}
