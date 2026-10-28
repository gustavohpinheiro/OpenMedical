// Preço de referência e acesso (navegador/PWA). Mesma regra do módulo Rust clinical_engine::pharmacy_pricing:
// o único valor monetário é o PMC oficial da CMED; preços reais são pesquisados nos links das farmácias.

import type { AnalisePrecoMedicamento, ApresentacaoCmedResumo } from './types';
import { extrairQuantidadeUnidades, montarLinksPesquisa, verificarFarmaciaPopular } from './farmacia_popular';

const arredondar2 = (n: number) => Math.round(n * 100) / 100;

const normalizar = (texto: string) =>
  texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().trim();

export function analisarPrecoMedicamento(
  nomeProduto: string,
  substancia: string,
  tipoProduto: string,
  apresentacao: string,
  codigoEan: string,
  pmc: number
): AnalisePrecoMedicamento {
  const preco_pmc_teto = pmc > 0 ? arredondar2(pmc) : null;
  const quantidade_unidades = extrairQuantidadeUnidades(apresentacao);
  return {
    nome_comercial: nomeProduto,
    substancia,
    tipo_produto: tipoProduto,
    apresentacao,
    codigo_ean: codigoEan,
    preco_pmc_teto,
    quantidade_unidades,
    pmc_por_unidade: preco_pmc_teto !== null && quantidade_unidades ? arredondar2(preco_pmc_teto / quantidade_unidades) : null,
    farmacia_popular: verificarFarmaciaPopular(substancia, apresentacao),
    links_pesquisa: montarLinksPesquisa(nomeProduto),
  };
}

const carregarCatalogo = () => import('./data/catalogo_cmed_nacional').then((m) => m.CATALOGO_CMED_NACIONAL);

/** Apresentações da amostra offline da CMED que correspondem ao termo (nome, substância ou EAN). */
export async function buscarApresentacoesLocal(termo: string, limite = 40): Promise<ApresentacaoCmedResumo[]> {
  const t = normalizar(termo);
  if (!t) return [];
  const catalogo = await carregarCatalogo();
  return catalogo
    .filter((c) => normalizar(c.nome_produto).includes(t) || normalizar(c.substancia).includes(t) || (c.codigo_ean && c.codigo_ean.includes(t)))
    .slice(0, limite)
    .map((c) => ({
      id_cmed: c.id_cmed,
      titulo: `${c.nome_produto} (${c.apresentacao})`,
      subtitulo: `${c.substancia} - ${c.laboratorio}`,
    }));
}

export async function analisarPrecoLocal(idCmed: number): Promise<AnalisePrecoMedicamento> {
  const registro = (await carregarCatalogo()).find((c) => c.id_cmed === idCmed);
  if (!registro) {
    throw new Error(`Apresentação CMED ${idCmed} não está na amostra offline do navegador`);
  }
  return analisarPrecoMedicamento(
    registro.nome_produto,
    registro.substancia,
    registro.tipo_produto,
    registro.apresentacao,
    registro.codigo_ean,
    registro.preco_maximo_consumidor
  );
}
