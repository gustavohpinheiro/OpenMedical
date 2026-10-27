use crate::models::MatrizInteracao;

/// Converte o nível textual de gravidade em peso numérico decrescente para ordenação prioritária.
pub fn peso_gravidade_interacao(gravidade: &str) -> u8 {
    match gravidade.to_lowercase().as_str() {
        "contraindicada" => 4,
        "grave" => 3,
        "moderada" => 2,
        "leve" => 1,
        _ => 0,
    }
}

/// Gera todos os pares combinatórios únicos (N escolhe 2) a partir de uma lista de IDs.
pub fn gerar_pares_combinatorios(ids_principios_ativos: &[i64]) -> Vec<(i64, i64)> {
    let mut pares = Vec::new();
    let total = ids_principios_ativos.len();

    if total < 2 {
        return pares;
    }

    for i in 0..total {
        for j in (i + 1)..total {
            let id_a = ids_principios_ativos[i];
            let id_b = ids_principios_ativos[j];
            // Mantém ordenação determinística interna do par
            if id_a < id_b {
                pares.push((id_a, id_b));
            } else {
                pares.push((id_b, id_a));
            }
        }
    }

    pares
}

/// Filtra e ordena uma base de interações conhecidas para uma lista de princípios ativos informada.
/// As interações são retornadas estritamente ordenadas pela gravidade clínica decrescente.
pub fn verificar_interacoes_em_memoria(
    ids_principios_ativos: &[i64],
    catalogo_interacoes: &[MatrizInteracao],
) -> Vec<MatrizInteracao> {
    let pares = gerar_pares_combinatorios(ids_principios_ativos);
    let mut interacoes_detectadas = Vec::new();

    for (id_1, id_2) in pares {
        for interacao in catalogo_interacoes {
            let coincide_direto = interacao.id_principio_ativo_a == id_1
                && interacao.id_principio_ativo_b == id_2;
            let coincide_inverso = interacao.id_principio_ativo_a == id_2
                && interacao.id_principio_ativo_b == id_1;

            if coincide_direto || coincide_inverso {
                interacoes_detectadas.push(interacao.clone());
            }
        }
    }

    // Ordenação decrescente pela severidade (Contraindicada primeiro, depois Grave, etc.)
    interacoes_detectadas.sort_by(|a, b| {
        let peso_b = peso_gravidade_interacao(&b.gravidade_interacao);
        let peso_a = peso_gravidade_interacao(&a.gravidade_interacao);
        peso_b.cmp(&peso_a)
    });

    interacoes_detectadas
}
