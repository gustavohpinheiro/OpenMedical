//! Preço de referência e acesso a medicamentos.
//!
//! O OpenClinical não tem acesso aos preços praticados pelas farmácias: o único valor monetário exibido é o
//! Preço Máximo ao Consumidor (PMC) oficial da CMED/ANVISA, que é o teto legal de venda. Para o preço real,
//! o usuário recebe links de busca das principais redes e do agregador Consulta Remédios.
//!
//! A gratuidade pelo Programa Farmácia Popular do Brasil é verificada pela substância **e** pela dose, contra o
//! elenco divulgado pelo Ministério da Saúde em 13/02/2025 (todos os itens gratuitos desde então).

use serde::{Deserialize, Serialize};

/// Data de referência do elenco do Farmácia Popular embutido abaixo.
pub const REFERENCIA_ELENCO_FARMACIA_POPULAR: &str =
    "elenco do Programa Farmácia Popular divulgado pelo Ministério da Saúde em 13/02/2025";

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct LinkPesquisaPreco {
    pub nome_farmacia: String,
    pub descricao: String,
    pub url: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct SituacaoFarmaciaPopular {
    /// true somente quando substância e dose da apresentação constam do elenco
    pub gratuito: bool,
    /// true quando a substância consta do elenco, mas em outra dose
    pub substancia_no_programa: bool,
    pub indicacao: Option<String>,
    pub doses_no_programa: Option<String>,
    pub mensagem: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct AnalisePrecoMedicamento {
    pub nome_comercial: String,
    pub substancia: String,
    pub tipo_produto: String,
    pub apresentacao: String,
    pub codigo_ean: String,
    /// PMC oficial (CMED, alíquota de ICMS de 18%); None quando a CMED não informa PMC
    pub preco_pmc_teto: Option<f64>,
    pub quantidade_unidades: Option<u32>,
    pub pmc_por_unidade: Option<f64>,
    pub farmacia_popular: SituacaoFarmaciaPopular,
    pub links_pesquisa: Vec<LinkPesquisaPreco>,
}

/// Item do elenco: termos que precisam estar na substância, número de princípios ativos e doses (cada dose
/// lista os números da apresentação, ex. [0.03, 0.15] para etinilestradiol + levonorgestrel).
struct ItemElenco {
    indicacao: &'static str,
    termos: &'static [&'static str],
    componentes: usize,
    doses: &'static [&'static [f64]],
    doses_texto: &'static str,
}

const ELENCO_FARMACIA_POPULAR: &[ItemElenco] = &[
    // Asma
    ItemElenco { indicacao: "Asma", termos: &["IPRATROPIO"], componentes: 1, doses: &[&[0.02], &[0.25]], doses_texto: "0,02 mg; 0,25 mg" },
    ItemElenco { indicacao: "Asma / Rinite", termos: &["BECLOMETASONA"], componentes: 1, doses: &[&[50.0], &[200.0], &[250.0]], doses_texto: "50 mcg; 200 mcg; 250 mcg" },
    ItemElenco { indicacao: "Asma", termos: &["SALBUTAMOL"], componentes: 1, doses: &[&[100.0], &[5.0]], doses_texto: "100 mcg; 5 mg" },
    // Diabetes
    ItemElenco { indicacao: "Diabetes", termos: &["METFORMINA"], componentes: 1, doses: &[&[500.0], &[850.0]], doses_texto: "500 mg; 500 mg ação prolongada; 850 mg" },
    ItemElenco { indicacao: "Diabetes", termos: &["GLIBENCLAMIDA"], componentes: 1, doses: &[&[5.0]], doses_texto: "5 mg" },
    ItemElenco { indicacao: "Diabetes", termos: &["INSULINA HUMANA"], componentes: 1, doses: &[&[100.0]], doses_texto: "100 UI/mL (regular e NPH)" },
    ItemElenco { indicacao: "Diabetes com doença cardiovascular", termos: &["DAPAGLIFLOZINA"], componentes: 1, doses: &[&[10.0]], doses_texto: "10 mg" },
    // Hipertensão
    ItemElenco { indicacao: "Hipertensão", termos: &["ATENOLOL"], componentes: 1, doses: &[&[25.0]], doses_texto: "25 mg" },
    ItemElenco { indicacao: "Hipertensão", termos: &["ANLODIPINO"], componentes: 1, doses: &[&[5.0]], doses_texto: "5 mg" },
    ItemElenco { indicacao: "Hipertensão", termos: &["CAPTOPRIL"], componentes: 1, doses: &[&[25.0]], doses_texto: "25 mg" },
    ItemElenco { indicacao: "Hipertensão", termos: &["PROPRANOLOL"], componentes: 1, doses: &[&[40.0]], doses_texto: "40 mg" },
    ItemElenco { indicacao: "Hipertensão", termos: &["HIDROCLOROTIAZIDA"], componentes: 1, doses: &[&[25.0]], doses_texto: "25 mg" },
    ItemElenco { indicacao: "Hipertensão", termos: &["LOSARTANA"], componentes: 1, doses: &[&[50.0]], doses_texto: "50 mg" },
    ItemElenco { indicacao: "Hipertensão", termos: &["ENALAPRIL"], componentes: 1, doses: &[&[10.0]], doses_texto: "10 mg" },
    ItemElenco { indicacao: "Hipertensão", termos: &["ESPIRONOLACTONA"], componentes: 1, doses: &[&[25.0]], doses_texto: "25 mg" },
    ItemElenco { indicacao: "Hipertensão", termos: &["FUROSEMIDA"], componentes: 1, doses: &[&[40.0]], doses_texto: "40 mg" },
    ItemElenco { indicacao: "Hipertensão", termos: &["SUCCINATO", "METOPROLOL"], componentes: 1, doses: &[&[25.0]], doses_texto: "succinato 25 mg" },
    // Anticoncepção
    ItemElenco { indicacao: "Anticoncepção", termos: &["MEDROXIPROGESTERONA"], componentes: 1, doses: &[&[150.0]], doses_texto: "150 mg" },
    ItemElenco { indicacao: "Anticoncepção", termos: &["ETINILESTRADIOL", "LEVONORGESTREL"], componentes: 2, doses: &[&[0.03, 0.15]], doses_texto: "0,03 mg + 0,15 mg" },
    ItemElenco { indicacao: "Anticoncepção", termos: &["NORETISTERONA"], componentes: 1, doses: &[&[0.35]], doses_texto: "0,35 mg" },
    ItemElenco { indicacao: "Anticoncepção", termos: &["ESTRADIOL", "NORETISTERONA"], componentes: 2, doses: &[&[5.0, 50.0]], doses_texto: "valerato de estradiol 5 mg + enantato de noretisterona 50 mg" },
    // Osteoporose
    ItemElenco { indicacao: "Osteoporose", termos: &["ALENDRONATO"], componentes: 1, doses: &[&[70.0]], doses_texto: "70 mg" },
    // Dislipidemia
    ItemElenco { indicacao: "Dislipidemia", termos: &["SINVASTATINA"], componentes: 1, doses: &[&[10.0], &[20.0], &[40.0]], doses_texto: "10 mg; 20 mg; 40 mg" },
    // Doença de Parkinson
    ItemElenco { indicacao: "Doença de Parkinson", termos: &["CARBIDOPA", "LEVODOPA"], componentes: 2, doses: &[&[25.0, 250.0]], doses_texto: "25 mg + 250 mg" },
    ItemElenco { indicacao: "Doença de Parkinson", termos: &["BENSERAZIDA", "LEVODOPA"], componentes: 2, doses: &[&[25.0, 100.0]], doses_texto: "25 mg + 100 mg" },
    // Glaucoma
    ItemElenco { indicacao: "Glaucoma", termos: &["TIMOLOL"], componentes: 1, doses: &[&[2.5], &[5.0]], doses_texto: "2,5 mg/mL; 5 mg/mL" },
    // Rinite
    ItemElenco { indicacao: "Rinite", termos: &["BUDESONIDA"], componentes: 1, doses: &[&[32.0], &[50.0]], doses_texto: "32 mcg; 50 mcg" },
];

/// Maiúsculas sem acento, para comparar textos da CMED.
fn normalizar(texto: &str) -> String {
    texto
        .to_uppercase()
        .chars()
        .map(|c| match c {
            'Á' | 'À' | 'Â' | 'Ã' | 'Ä' => 'A',
            'É' | 'È' | 'Ê' | 'Ë' => 'E',
            'Í' | 'Ì' | 'Î' | 'Ï' => 'I',
            'Ó' | 'Ò' | 'Ô' | 'Õ' | 'Ö' => 'O',
            'Ú' | 'Ù' | 'Û' | 'Ü' => 'U',
            'Ç' => 'C',
            outro => outro,
        })
        .collect()
}

fn contar_componentes(substancia: &str) -> usize {
    substancia
        .split([';', '+', ','])
        .filter(|parte| !parte.trim().is_empty())
        .count()
}

/// Números da parte de concentração da apresentação (antes do último " X ", que indica a quantidade).
pub fn extrair_numeros_concentracao(apresentacao: &str) -> Vec<f64> {
    let texto = normalizar(apresentacao);
    let concentracao = match texto.rfind(" X ") {
        Some(posicao) => &texto[..posicao],
        None => texto.as_str(),
    };
    let mut numeros = Vec::new();
    let mut atual = String::new();
    for c in concentracao.chars().chain(std::iter::once(' ')) {
        if c.is_ascii_digit() || ((c == ',' || c == '.') && !atual.is_empty()) {
            atual.push(if c == ',' { '.' } else { c });
        } else if !atual.is_empty() {
            if let Ok(valor) = atual.trim_end_matches('.').parse::<f64>() {
                numeros.push(valor);
            }
            atual.clear();
        }
    }
    numeros
}

/// Verifica a gratuidade no Farmácia Popular para a substância e a apresentação informadas.
pub fn verificar_farmacia_popular(substancia: &str, apresentacao: &str) -> SituacaoFarmaciaPopular {
    let substancia_normalizada = normalizar(substancia);
    let componentes = contar_componentes(&substancia_normalizada);
    let numeros = extrair_numeros_concentracao(apresentacao);

    let candidatos: Vec<&ItemElenco> = ELENCO_FARMACIA_POPULAR
        .iter()
        .filter(|item| item.componentes == componentes && item.termos.iter().all(|t| substancia_normalizada.contains(t)))
        .collect();

    for item in &candidatos {
        let dose_confere = item
            .doses
            .iter()
            .any(|dose| dose.iter().all(|valor| numeros.iter().any(|n| (n - valor).abs() < 1e-6)));
        if dose_confere {
            return SituacaoFarmaciaPopular {
                gratuito: true,
                substancia_no_programa: true,
                indicacao: Some(item.indicacao.to_string()),
                doses_no_programa: Some(item.doses_texto.to_string()),
                mensagem: format!(
                    "Gratuito no Farmácia Popular ({}), com receita e documento com foto, em farmácia credenciada. Conferir se o elenco segue vigente em gov.br/saude.",
                    item.indicacao
                ),
            };
        }
    }

    if let Some(item) = candidatos.first() {
        return SituacaoFarmaciaPopular {
            gratuito: false,
            substancia_no_programa: true,
            indicacao: Some(item.indicacao.to_string()),
            doses_no_programa: Some(item.doses_texto.to_string()),
            mensagem: format!(
                "A substância está no Farmácia Popular ({}), mas só nas doses {}; esta apresentação não é gratuita pelo programa.",
                item.indicacao, item.doses_texto
            ),
        };
    }

    SituacaoFarmaciaPopular {
        gratuito: false,
        substancia_no_programa: false,
        indicacao: None,
        doses_no_programa: None,
        mensagem: format!("Não consta do {REFERENCIA_ELENCO_FARMACIA_POPULAR}."),
    }
}

/// Extrai a quantidade total de unidades (comprimidos, cápsulas ou mL) da descrição da apresentação comercial.
pub fn extrair_quantidade_unidades(apresentacao: &str) -> Option<u32> {
    let apr = apresentacao.to_uppercase();

    // Padrões como " X 30", " X 20 ML"
    if let Some(pos_x) = apr.rfind(" X ") {
        let num_str: String = apr[pos_x + 3..].chars().take_while(|c| c.is_ascii_digit()).collect();
        if let Ok(n) = num_str.parse::<u32>() {
            if n > 0 && n <= 500 {
                return Some(n);
            }
        }
    }

    // Padrões como "30 COMP", "20 ML", "28 CAPS"
    let partes: Vec<&str> = apr.split_whitespace().collect();
    for janela in partes.windows(2) {
        if let Ok(n) = janela[0].parse::<u32>() {
            let prox = janela[1];
            let unidade = ["COMP", "CAP", "DRAG", "ML", "ENV"].iter().any(|u| prox.starts_with(u));
            if unidade && n > 0 && n <= 500 {
                return Some(n);
            }
        }
    }

    None
}

fn arredondar_moeda(valor: f64) -> f64 {
    (valor * 100.0).round() / 100.0
}

/// Codificação de URL (RFC 3986) para o termo de busca.
fn codificar_url(termo: &str) -> String {
    let mut saida = String::new();
    for byte in termo.trim().bytes() {
        match byte {
            b'A'..=b'Z' | b'a'..=b'z' | b'0'..=b'9' | b'-' | b'_' | b'.' | b'~' => saida.push(byte as char),
            _ => saida.push_str(&format!("%{byte:02X}")),
        }
    }
    saida
}

/// Links de busca nas principais redes (o preço real só pode ser conferido na própria farmácia).
pub fn montar_links_pesquisa(termo: &str) -> Vec<LinkPesquisaPreco> {
    let t = codificar_url(termo);
    [
        ("Consulta Remédios", "Agregador: compara preços de várias farmácias", format!("https://consultaremedios.com.br/busca?termo={t}")),
        ("Ultrafarma", "Loja online", format!("https://www.ultrafarma.com.br/busca?q={t}")),
        ("Drogasil", "Rede nacional (RD Saúde)", format!("https://www.drogasil.com.br/search?w={t}")),
        ("Droga Raia", "Rede nacional (RD Saúde)", format!("https://www.drogaraia.com.br/search?w={t}")),
        ("Drogaria São Paulo", "Grupo DPSP", format!("https://www.drogariasaopaulo.com.br/pesquisa?q={t}")),
        ("Drogarias Pacheco", "Grupo DPSP", format!("https://www.drogariaspacheco.com.br/pesquisa?q={t}")),
        ("Pague Menos", "Rede nacional", format!("https://www.paguemenos.com.br/busca?termo={t}")),
        ("Panvel", "Sul e Sudeste", format!("https://www.panvel.com/panvel/buscarProduto.do?termoPesquisa={t}")),
    ]
    .into_iter()
    .map(|(nome, descricao, url)| LinkPesquisaPreco {
        nome_farmacia: nome.to_string(),
        descricao: descricao.to_string(),
        url,
    })
    .collect()
}

/// Reúne o PMC oficial, o PMC por unidade, a situação no Farmácia Popular e os links de busca de preço.
pub fn analisar_preco_medicamento(
    nome_produto: &str,
    substancia: &str,
    tipo_produto: &str,
    apresentacao: &str,
    codigo_ean: &str,
    pmc: f64,
) -> AnalisePrecoMedicamento {
    let preco_pmc_teto = if pmc > 0.0 { Some(arredondar_moeda(pmc)) } else { None };
    let quantidade_unidades = extrair_quantidade_unidades(apresentacao);
    let pmc_por_unidade = match (preco_pmc_teto, quantidade_unidades) {
        (Some(preco), Some(qtd)) => Some(arredondar_moeda(preco / qtd as f64)),
        _ => None,
    };

    AnalisePrecoMedicamento {
        nome_comercial: nome_produto.to_string(),
        substancia: substancia.to_string(),
        tipo_produto: tipo_produto.to_string(),
        apresentacao: apresentacao.to_string(),
        codigo_ean: codigo_ean.to_string(),
        preco_pmc_teto,
        quantidade_unidades,
        pmc_por_unidade,
        farmacia_popular: verificar_farmacia_popular(substancia, apresentacao),
        links_pesquisa: montar_links_pesquisa(nome_produto),
    }
}
