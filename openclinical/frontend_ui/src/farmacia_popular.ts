// Porte do módulo Rust clinical_engine::pharmacy_pricing (paridade testada em tests/paridade_calculos.test.mjs).
// Sem imports: roda no navegador e no `node --test`.

export const REFERENCIA_ELENCO_FARMACIA_POPULAR =
  'elenco do Programa Farmácia Popular divulgado pelo Ministério da Saúde em 13/02/2025';

export interface SituacaoFarmaciaPopular {
  gratuito: boolean;
  substancia_no_programa: boolean;
  indicacao: string | null;
  doses_no_programa: string | null;
  mensagem: string;
}

export interface LinkPesquisaPreco {
  nome_farmacia: string;
  descricao: string;
  url: string;
}

interface ItemElenco {
  indicacao: string;
  termos: string[];
  componentes: number;
  doses: number[][];
  doses_texto: string;
}

// Elenco de 13/02/2025 (todos os itens gratuitos desde então); dose = números da concentração da apresentação
const ELENCO_FARMACIA_POPULAR: ItemElenco[] = [
  { indicacao: 'Asma', termos: ['IPRATROPIO'], componentes: 1, doses: [[0.02], [0.25]], doses_texto: '0,02 mg; 0,25 mg' },
  { indicacao: 'Asma / Rinite', termos: ['BECLOMETASONA'], componentes: 1, doses: [[50], [200], [250]], doses_texto: '50 mcg; 200 mcg; 250 mcg' },
  { indicacao: 'Asma', termos: ['SALBUTAMOL'], componentes: 1, doses: [[100], [5]], doses_texto: '100 mcg; 5 mg' },
  { indicacao: 'Diabetes', termos: ['METFORMINA'], componentes: 1, doses: [[500], [850]], doses_texto: '500 mg; 500 mg ação prolongada; 850 mg' },
  { indicacao: 'Diabetes', termos: ['GLIBENCLAMIDA'], componentes: 1, doses: [[5]], doses_texto: '5 mg' },
  { indicacao: 'Diabetes', termos: ['INSULINA HUMANA'], componentes: 1, doses: [[100]], doses_texto: '100 UI/mL (regular e NPH)' },
  { indicacao: 'Diabetes com doença cardiovascular', termos: ['DAPAGLIFLOZINA'], componentes: 1, doses: [[10]], doses_texto: '10 mg' },
  { indicacao: 'Hipertensão', termos: ['ATENOLOL'], componentes: 1, doses: [[25]], doses_texto: '25 mg' },
  { indicacao: 'Hipertensão', termos: ['ANLODIPINO'], componentes: 1, doses: [[5]], doses_texto: '5 mg' },
  { indicacao: 'Hipertensão', termos: ['CAPTOPRIL'], componentes: 1, doses: [[25]], doses_texto: '25 mg' },
  { indicacao: 'Hipertensão', termos: ['PROPRANOLOL'], componentes: 1, doses: [[40]], doses_texto: '40 mg' },
  { indicacao: 'Hipertensão', termos: ['HIDROCLOROTIAZIDA'], componentes: 1, doses: [[25]], doses_texto: '25 mg' },
  { indicacao: 'Hipertensão', termos: ['LOSARTANA'], componentes: 1, doses: [[50]], doses_texto: '50 mg' },
  { indicacao: 'Hipertensão', termos: ['ENALAPRIL'], componentes: 1, doses: [[10]], doses_texto: '10 mg' },
  { indicacao: 'Hipertensão', termos: ['ESPIRONOLACTONA'], componentes: 1, doses: [[25]], doses_texto: '25 mg' },
  { indicacao: 'Hipertensão', termos: ['FUROSEMIDA'], componentes: 1, doses: [[40]], doses_texto: '40 mg' },
  { indicacao: 'Hipertensão', termos: ['SUCCINATO', 'METOPROLOL'], componentes: 1, doses: [[25]], doses_texto: 'succinato 25 mg' },
  { indicacao: 'Anticoncepção', termos: ['MEDROXIPROGESTERONA'], componentes: 1, doses: [[150]], doses_texto: '150 mg' },
  { indicacao: 'Anticoncepção', termos: ['ETINILESTRADIOL', 'LEVONORGESTREL'], componentes: 2, doses: [[0.03, 0.15]], doses_texto: '0,03 mg + 0,15 mg' },
  { indicacao: 'Anticoncepção', termos: ['NORETISTERONA'], componentes: 1, doses: [[0.35]], doses_texto: '0,35 mg' },
  { indicacao: 'Anticoncepção', termos: ['ESTRADIOL', 'NORETISTERONA'], componentes: 2, doses: [[5, 50]], doses_texto: 'valerato de estradiol 5 mg + enantato de noretisterona 50 mg' },
  { indicacao: 'Osteoporose', termos: ['ALENDRONATO'], componentes: 1, doses: [[70]], doses_texto: '70 mg' },
  { indicacao: 'Dislipidemia', termos: ['SINVASTATINA'], componentes: 1, doses: [[10], [20], [40]], doses_texto: '10 mg; 20 mg; 40 mg' },
  { indicacao: 'Doença de Parkinson', termos: ['CARBIDOPA', 'LEVODOPA'], componentes: 2, doses: [[25, 250]], doses_texto: '25 mg + 250 mg' },
  { indicacao: 'Doença de Parkinson', termos: ['BENSERAZIDA', 'LEVODOPA'], componentes: 2, doses: [[25, 100]], doses_texto: '25 mg + 100 mg' },
  { indicacao: 'Glaucoma', termos: ['TIMOLOL'], componentes: 1, doses: [[2.5], [5]], doses_texto: '2,5 mg/mL; 5 mg/mL' },
  { indicacao: 'Rinite', termos: ['BUDESONIDA'], componentes: 1, doses: [[32], [50]], doses_texto: '32 mcg; 50 mcg' },
];

const normalizar = (texto: string) =>
  texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();

const contarComponentes = (substancia: string) => substancia.split(/[;+,]/).filter((p) => p.trim()).length;

/** Números da parte de concentração da apresentação (antes do último " X ", que indica a quantidade). */
export function extrairNumerosConcentracao(apresentacao: string): number[] {
  const texto = normalizar(apresentacao);
  const posicao = texto.lastIndexOf(' X ');
  const concentracao = posicao >= 0 ? texto.slice(0, posicao) : texto;
  return (concentracao.match(/\d+(?:[.,]\d+)*/g) ?? [])
    .map((n) => parseFloat(n.replace(',', '.')))
    .filter((n) => Number.isFinite(n));
}

export function verificarFarmaciaPopular(substancia: string, apresentacao: string): SituacaoFarmaciaPopular {
  const sub = normalizar(substancia);
  const componentes = contarComponentes(sub);
  const numeros = extrairNumerosConcentracao(apresentacao);
  const candidatos = ELENCO_FARMACIA_POPULAR.filter(
    (item) => item.componentes === componentes && item.termos.every((t) => sub.includes(t))
  );

  for (const item of candidatos) {
    const doseConfere = item.doses.some((dose) => dose.every((valor) => numeros.some((n) => Math.abs(n - valor) < 1e-6)));
    if (doseConfere) {
      return {
        gratuito: true,
        substancia_no_programa: true,
        indicacao: item.indicacao,
        doses_no_programa: item.doses_texto,
        mensagem: `Gratuito no Farmácia Popular (${item.indicacao}), com receita e documento com foto, em farmácia credenciada. Conferir se o elenco segue vigente em gov.br/saude.`,
      };
    }
  }

  if (candidatos.length > 0) {
    const item = candidatos[0];
    return {
      gratuito: false,
      substancia_no_programa: true,
      indicacao: item.indicacao,
      doses_no_programa: item.doses_texto,
      mensagem: `A substância está no Farmácia Popular (${item.indicacao}), mas só nas doses ${item.doses_texto}; esta apresentação não é gratuita pelo programa.`,
    };
  }

  return {
    gratuito: false,
    substancia_no_programa: false,
    indicacao: null,
    doses_no_programa: null,
    mensagem: `Não consta do ${REFERENCIA_ELENCO_FARMACIA_POPULAR}.`,
  };
}

export function extrairQuantidadeUnidades(apresentacao: string): number | null {
  const apr = apresentacao.toUpperCase();
  const posX = apr.lastIndexOf(' X ');
  if (posX !== -1) {
    const match = apr.substring(posX + 3).match(/^(\d+)/);
    if (match) {
      const n = parseInt(match[1], 10);
      if (n > 0 && n <= 500) return n;
    }
  }
  const partes = apr.split(/\s+/);
  for (let i = 0; i + 1 < partes.length; i++) {
    const n = Number(partes[i]);
    if (Number.isInteger(n) && ['COMP', 'CAP', 'DRAG', 'ML', 'ENV'].some((u) => partes[i + 1].startsWith(u)) && n > 0 && n <= 500) {
      return n;
    }
  }
  return null;
}

export function montarLinksPesquisa(termo: string): LinkPesquisaPreco[] {
  const t = encodeURIComponent(termo.trim());
  return [
    { nome_farmacia: 'Consulta Remédios', descricao: 'Agregador: compara preços de várias farmácias', url: `https://consultaremedios.com.br/busca?termo=${t}` },
    { nome_farmacia: 'Ultrafarma', descricao: 'Loja online', url: `https://www.ultrafarma.com.br/busca?q=${t}` },
    { nome_farmacia: 'Drogasil', descricao: 'Rede nacional (RD Saúde)', url: `https://www.drogasil.com.br/search?w=${t}` },
    { nome_farmacia: 'Droga Raia', descricao: 'Rede nacional (RD Saúde)', url: `https://www.drogaraia.com.br/search?w=${t}` },
    { nome_farmacia: 'Drogaria São Paulo', descricao: 'Grupo DPSP', url: `https://www.drogariasaopaulo.com.br/pesquisa?q=${t}` },
    { nome_farmacia: 'Drogarias Pacheco', descricao: 'Grupo DPSP', url: `https://www.drogariaspacheco.com.br/pesquisa?q=${t}` },
    { nome_farmacia: 'Pague Menos', descricao: 'Rede nacional', url: `https://www.paguemenos.com.br/busca?termo=${t}` },
    { nome_farmacia: 'Panvel', descricao: 'Sul e Sudeste', url: `https://www.panvel.com/panvel/buscarProduto.do?termoPesquisa=${t}` },
  ];
}
