// Serviço de Cotação e Comparador de Preços em Farmácias (Web / PWA / Desktop)
// Mantém 100% de paridade com o módulo Rust (clinical_engine::pharmacy_pricing).

import { AnalisePrecoMedicamento, CotacaoFarmacia } from './types';
import { CATALOGO_CMED_NACIONAL } from './data/catalogo_cmed_nacional';

export function verificarElegibilidadeFarmaciaPopular(substancia: string): { elegivel: boolean; detalhe?: string } {
  const subUpper = substancia.toUpperCase();

  // 100% Gratuito (SUS R$ 0,00)
  if (
    subUpper.includes('ATENOLOL') ||
    subUpper.includes('CAPTOPRIL') ||
    subUpper.includes('ENALAPRIL') ||
    subUpper.includes('HIDROCLOROTIAZIDA') ||
    subUpper.includes('LOSARTANA') ||
    subUpper.includes('PROPRANOLOL')
  ) {
    return { elegivel: true, detalhe: 'Farmácia Popular: 100% Gratuito (SUS R$ 0,00) - Hipertensão' };
  }

  if (
    subUpper.includes('METFORMINA') ||
    subUpper.includes('GLIBENCLAMIDA') ||
    subUpper.includes('INSULINA')
  ) {
    return { elegivel: true, detalhe: 'Farmácia Popular: 100% Gratuito (SUS R$ 0,00) - Diabetes' };
  }

  if (
    subUpper.includes('SALBUTAMOL') ||
    subUpper.includes('IPRATROPIO') ||
    subUpper.includes('IPRATRÓPIO') ||
    subUpper.includes('BECLOMETASONA')
  ) {
    return { elegivel: true, detalhe: 'Farmácia Popular: 100% Gratuito (SUS R$ 0,00) - Asma' };
  }

  if (subUpper.includes('ALENDRONATO')) {
    return { elegivel: true, detalhe: 'Farmácia Popular: 100% Gratuito (SUS R$ 0,00) - Osteoporose' };
  }

  if (
    subUpper.includes('MEDROXIPROGESTERONA') ||
    subUpper.includes('NORETISTERONA') ||
    subUpper.includes('ETINILESTRADIOL')
  ) {
    return { elegivel: true, detalhe: 'Farmácia Popular: 100% Gratuito (SUS R$ 0,00) - Anticoncepção' };
  }

  // Copagamento (subsídio do Ministério da Saúde com até 90% de desconto)
  if (subUpper.includes('SINVASTATINA')) {
    return { elegivel: true, detalhe: 'Farmácia Popular: Copagamento com até 90% de subsídio SUS - Dislipidemia' };
  }

  if (subUpper.includes('TIMOLOL')) {
    return { elegivel: true, detalhe: 'Farmácia Popular: Copagamento com até 90% de subsídio SUS - Glaucoma' };
  }

  if (subUpper.includes('LEVODOPA') || subUpper.includes('BENSERAZIDA') || subUpper.includes('CARBIDOPA')) {
    return { elegivel: true, detalhe: 'Farmácia Popular: Copagamento com até 90% de subsídio SUS - Parkinson' };
  }

  if (subUpper.includes('BUDESONIDA')) {
    return { elegivel: true, detalhe: 'Farmácia Popular: Copagamento com até 90% de subsídio SUS - Rinite' };
  }

  return { elegivel: false };
}

export function extrairQuantidadeUnidades(apresentacao: string): number | null {
  const apr = apresentacao.toUpperCase();

  const posX = apr.lastIndexOf(' X ');
  if (posX !== -1) {
    const pedaco = apr.substring(posX + 3).trim();
    const match = pedaco.match(/^(\d+)/);
    if (match) {
      const n = parseInt(match[1], 10);
      if (n > 0 && n <= 500) return n;
    }
  }

  const partes = apr.split(/\s+/);
  for (let i = 0; i < partes.length; i++) {
    const n = parseInt(partes[i], 10);
    if (!isNaN(n) && i + 1 < partes.length) {
      const prox = partes[i + 1];
      if (
        prox.startsWith('COMP') ||
        prox.startsWith('CAP') ||
        prox.startsWith('DRAG') ||
        prox.startsWith('ML') ||
        prox.startsWith('ENV')
      ) {
        if (n > 0 && n <= 500) return n;
      }
    }
  }

  const matchGeral = apr.match(/(\d+)\s*(COMP|CAP|DRAG|ML|ENV)/);
  if (matchGeral) {
    const n = parseInt(matchGeral[1], 10);
    if (n > 0 && n <= 500) return n;
  }

  return null;
}

function arredondar2(n: number): number {
  return Math.round(n * 100) / 100;
}

function montarUrlBusca(baseUrl: string, termo: string): string {
  const enc = encodeURIComponent(termo.trim());
  return `${baseUrl}${enc}`;
}

export function cotarPrecosFarmacias(
  nomeProduto: string,
  substancia: string,
  tipoProduto: string,
  apresentacao: string,
  codigoEan: string,
  pmc: number
): AnalisePrecoMedicamento {
  const precoTeto = pmc > 0 ? pmc : 15.0;
  const tipoUpper = tipoProduto.toUpperCase();
  const isGenerico = tipoUpper.includes('GENÉRICO') || tipoUpper.includes('GENERICO');
  const isSimilar = tipoUpper.includes('SIMILAR');

  const termoBusca = codigoEan && codigoEan.trim().length >= 8 ? codigoEan.trim() : nomeProduto.trim();

  const cotacoes: CotacaoFarmacia[] = [];

  // 1. Ultrafarma
  const descUltrafarma = isGenerico ? 0.62 : isSimilar ? 0.44 : 0.26;
  const precoUltrafarma = arredondar2(precoTeto * (1 - descUltrafarma));
  cotacoes.push({
    nome_farmacia: 'Ultrafarma',
    tipo_rede: 'Varejo Online & Lojas',
    preco_estimado: precoUltrafarma,
    desconto_percentual: arredondar2(descUltrafarma * 100),
    link_busca: montarUrlBusca('https://www.ultrafarma.com.br/busca?q=', termoBusca),
    disponibilidade: 'Entrega em Todo o Brasil',
  });

  // 2. Drogasil
  const descDrogasil = isGenerico ? 0.54 : isSimilar ? 0.36 : 0.20;
  const precoDrogasil = arredondar2(precoTeto * (1 - descDrogasil));
  cotacoes.push({
    nome_farmacia: 'Drogasil',
    tipo_rede: 'Rede Nacional (RD Saúde)',
    preco_estimado: precoDrogasil,
    desconto_percentual: arredondar2(descDrogasil * 100),
    link_busca: montarUrlBusca('https://www.drogasil.com.br/search?w=', termoBusca),
    disponibilidade: 'Retirada em 1h ou Entrega',
  });

  // 3. Droga Raia
  const descRaia = isGenerico ? 0.52 : isSimilar ? 0.35 : 0.21;
  const precoRaia = arredondar2(precoTeto * (1 - descRaia));
  cotacoes.push({
    nome_farmacia: 'Droga Raia',
    tipo_rede: 'Rede Nacional (RD Saúde)',
    preco_estimado: precoRaia,
    desconto_percentual: arredondar2(descRaia * 100),
    link_busca: montarUrlBusca('https://www.drogaraia.com.br/search?w=', termoBusca),
    disponibilidade: 'Retirada em Loja e Delivery',
  });

  // 4. Drogaria São Paulo / Pacheco
  const descDpsp = isGenerico ? 0.50 : isSimilar ? 0.34 : 0.18;
  const precoDpsp = arredondar2(precoTeto * (1 - descDpsp));
  cotacoes.push({
    nome_farmacia: 'Drogaria São Paulo / Pacheco',
    tipo_rede: 'Grupo DPSP',
    preco_estimado: precoDpsp,
    desconto_percentual: arredondar2(descDpsp * 100),
    link_busca: montarUrlBusca('https://www.drogariasaopaulo.com.br/', termoBusca),
    disponibilidade: 'Lojas Físicas e E-commerce',
  });

  // 5. Pague Menos
  const descPagueMenos = isGenerico ? 0.53 : isSimilar ? 0.37 : 0.19;
  const precoPagueMenos = arredondar2(precoTeto * (1 - descPagueMenos));
  cotacoes.push({
    nome_farmacia: 'Pague Menos',
    tipo_rede: 'Rede Nacional',
    preco_estimado: precoPagueMenos,
    desconto_percentual: arredondar2(descPagueMenos * 100),
    link_busca: montarUrlBusca('https://www.paguemenos.com.br/', termoBusca),
    disponibilidade: 'Retirada Expressa',
  });

  // 6. Panvel
  const descPanvel = isGenerico ? 0.48 : isSimilar ? 0.32 : 0.17;
  const precoPanvel = arredondar2(precoTeto * (1 - descPanvel));
  cotacoes.push({
    nome_farmacia: 'Panvel',
    tipo_rede: 'Sul & Sudeste',
    preco_estimado: precoPanvel,
    desconto_percentual: arredondar2(descPanvel * 100),
    link_busca: montarUrlBusca('https://www.panvel.com/panvel/buscarProduto.do?termoPesquisa=', termoBusca),
    disponibilidade: 'Lojas e E-commerce',
  });

  // 7. Consulta Remédios
  cotacoes.push({
    nome_farmacia: 'Consulta Remédios',
    tipo_rede: 'Agregador de Cotações',
    preco_estimado: precoUltrafarma,
    desconto_percentual: arredondar2(descUltrafarma * 100),
    link_busca: montarUrlBusca('https://consultaremedios.com.br/busca?termo=', termoBusca),
    disponibilidade: 'Comparativo de Centenas de Farmácias',
  });

  // Farmácia Popular
  const fp = verificarElegibilidadeFarmaciaPopular(substancia);
  if (fp.elegivel && fp.detalhe) {
    if (fp.detalhe.includes('100% Gratuito')) {
      cotacoes.unshift({
        nome_farmacia: 'Programa Farmácia Popular (SUS)',
        tipo_rede: "Rede Credenciada SUS / 'Aqui Tem Farmácia Popular'",
        preco_estimado: 0.00,
        desconto_percentual: 100.0,
        link_busca: 'https://www.gov.br/saude/pt-br/composicao/sectics/farmacia-popular',
        disponibilidade: '100% Gratuito com Receita do SUS ou Particular',
      });
    } else if (fp.detalhe.includes('Copagamento')) {
      const copag = arredondar2(precoTeto * 0.10);
      cotacoes.unshift({
        nome_farmacia: 'Farmácia Popular (Copagamento SUS)',
        tipo_rede: 'Subsídio do Ministério da Saúde até 90%',
        preco_estimado: copag,
        desconto_percentual: 90.0,
        link_busca: 'https://www.gov.br/saude/pt-br/composicao/sectics/farmacia-popular',
        disponibilidade: 'Subsídio Governamental nas Redes Credenciadas',
      });
    }
  }

  const comerciais = cotacoes.filter((c) => !c.nome_farmacia.includes('Farmácia Popular')).map((c) => c.preco_estimado);
  const menorPreco = comerciais.length > 0 ? Math.min(...comerciais) : precoUltrafarma;
  const maiorPreco = comerciais.length > 0 ? Math.max(...comerciais) : precoTeto;
  const soma = comerciais.reduce((acc, v) => acc + v, 0);
  const precoMedio = comerciais.length > 0 ? arredondar2(soma / comerciais.length) : precoTeto;

  const qtdUnidades = extrairQuantidadeUnidades(apresentacao);
  const precoPorUnidade = qtdUnidades ? arredondar2(menorPreco / qtdUnidades) : null;

  return {
    nome_comercial: nomeProduto,
    substancia,
    tipo_produto: tipoProduto,
    apresentacao,
    codigo_ean: codigoEan,
    preco_pmc_teto: arredondar2(precoTeto),
    menor_preco_estimado: menorPreco,
    maior_preco_estimado: maiorPreco,
    preco_medio: precoMedio,
    preco_por_unidade: precoPorUnidade,
    quantidade_unidades: qtdUnidades,
    elegivel_farmacia_popular: fp.elegivel,
    faixa_farmacia_popular: fp.detalhe || null,
    cotacoes,
  };
}

export function buscarCotacaoLocal(termoOuId: string | number): AnalisePrecoMedicamento {
  // Se for número, busca primeiro no catálogo CMED
  if (typeof termoOuId === 'number') {
    const cmed = CATALOGO_CMED_NACIONAL.find((c) => c.id_cmed === termoOuId);
    if (cmed) {
      return cotarPrecosFarmacias(
        cmed.nome_produto,
        cmed.substancia,
        cmed.tipo_produto,
        cmed.apresentacao,
        cmed.codigo_ean,
        cmed.preco_maximo_consumidor
      );
    }
  }

  const termo = String(termoOuId).toUpperCase().trim();

  // Busca em CATALOGO_CMED_NACIONAL
  const encontradoCmed = CATALOGO_CMED_NACIONAL.find(
    (c) =>
      c.nome_produto.toUpperCase().includes(termo) ||
      c.substancia.toUpperCase().includes(termo) ||
      (c.codigo_ean && c.codigo_ean.includes(termo))
  );

  if (encontradoCmed) {
    return cotarPrecosFarmacias(
      encontradoCmed.nome_produto,
      encontradoCmed.substancia,
      encontradoCmed.tipo_produto,
      encontradoCmed.apresentacao,
      encontradoCmed.codigo_ean,
      encontradoCmed.preco_maximo_consumidor
    );
  }

  // Fallback simulado determinístico para qualquer termo pesquisado
  return cotarPrecosFarmacias(
    String(termoOuId),
    String(termoOuId),
    'Genérico',
    'Apresentação Comercial em Farmácias (1 cx)',
    '',
    28.00
  );
}
