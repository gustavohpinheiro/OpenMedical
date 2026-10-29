// Separa a bula (texto extraído do PDF) nas seções da RDC 47/2009 e extrai registro, empresa e data de aprovação.
// Sem imports de runtime: roda no navegador, no app desktop e no Node (testes e coletor de bulas dos laboratórios).

export type TipoBula = 'profissional' | 'paciente';

export interface SecaoBula {
  chave: string;
  titulo: string;
  texto: string;
}

export interface BulaAnalisada {
  tipo: TipoBula;
  nome_produto: string;
  /** Denominações listadas abaixo do nome comercial ("lansoprazol", "claritromicina"...) */
  principios_ativos: string[];
  empresa: string;
  cnpj: string;
  /** Registro do produto: 9 primeiros dígitos do número MS, ou vazio se o PDF não traz */
  registro: string;
  /** AAAA-MM-DD da frase "Esta bula foi aprovada pela Anvisa em ...", ou vazio */
  data_aprovacao: string;
  /** Apresentações e composição (texto antes da primeira seção) */
  cabecalho: string;
  secoes: SecaoBula[];
}

export class ErroBula extends Error {}

interface ModeloSecao {
  chave: string;
  numero: number;
  titulo: string;
  /** Início do título, em maiúsculas e sem acento */
  padrao: string;
}

const SECOES_PROFISSIONAL: ModeloSecao[] = [
  { chave: 'indicacoes', numero: 1, titulo: 'Indicações', padrao: 'INDICACOES' },
  { chave: 'eficacia', numero: 2, titulo: 'Resultados de eficácia', padrao: 'RESULTADOS DE EFICACIA' },
  { chave: 'farmacologia', numero: 3, titulo: 'Características farmacológicas', padrao: 'CARACTERISTICAS FARMACOLOGICAS' },
  { chave: 'contraindicacoes', numero: 4, titulo: 'Contraindicações', padrao: 'CONTRA-?INDICACOES' },
  { chave: 'advertencias', numero: 5, titulo: 'Advertências e precauções', padrao: 'ADVERTENCIAS E PRECAUCOES' },
  { chave: 'interacoes', numero: 6, titulo: 'Interações medicamentosas', padrao: 'INTERACOES MEDICAMENTOSAS' },
  { chave: 'armazenamento', numero: 7, titulo: 'Cuidados de armazenamento', padrao: 'CUIDADOS DE ARMAZENAMENTO' },
  { chave: 'posologia', numero: 8, titulo: 'Posologia e modo de usar', padrao: 'POSOLOGIA E MODO DE USAR' },
  { chave: 'reacoes_adversas', numero: 9, titulo: 'Reações adversas', padrao: 'REACOES ADVERSAS' },
  { chave: 'superdose', numero: 10, titulo: 'Superdose', padrao: 'SUPERDOSE' },
];

const SECOES_PACIENTE: ModeloSecao[] = [
  { chave: 'indicacoes', numero: 1, titulo: 'Para que este medicamento é indicado?', padrao: 'PARA QUE ESTE MEDICAMENTO E INDICADO' },
  { chave: 'como_funciona', numero: 2, titulo: 'Como este medicamento funciona?', padrao: 'COMO ESTE MEDICAMENTO FUNCIONA' },
  { chave: 'contraindicacoes', numero: 3, titulo: 'Quando não devo usar este medicamento?', padrao: 'QUANDO NAO DEVO USAR ESTE MEDICAMENTO' },
  {
    chave: 'advertencias',
    numero: 4,
    titulo: 'O que devo saber antes de usar este medicamento?',
    padrao: 'O QUE DEVO SABER ANTES DE USAR ESTE MEDICAMENTO',
  },
  {
    chave: 'armazenamento',
    numero: 5,
    titulo: 'Onde, como e por quanto tempo posso guardar este medicamento?',
    padrao: 'ONDE, COMO E POR QUANTO TEMPO POSSO GUARDAR',
  },
  { chave: 'posologia', numero: 6, titulo: 'Como devo usar este medicamento?', padrao: 'COMO DEVO USAR ESTE MEDICAMENTO' },
  {
    chave: 'esquecimento',
    numero: 7,
    titulo: 'O que devo fazer quando eu me esquecer de usar este medicamento?',
    padrao: 'O QUE DEVO FAZER QUANDO EU ME ESQUECER',
  },
  {
    chave: 'reacoes_adversas',
    numero: 8,
    titulo: 'Quais os males que este medicamento pode me causar?',
    padrao: 'QUAIS OS MALES QUE ESTE MEDICAMENTO PODE',
  },
  {
    chave: 'superdose',
    numero: 9,
    titulo: 'O que fazer se alguém usar uma quantidade maior do que a indicada deste medicamento?',
    padrao: 'O QUE (?:DEVO )?FAZER SE ALGUEM USAR UMA QUANTIDADE',
  },
];

/** Ordem de exibição: o que o prescritor procura primeiro. */
export const ORDEM_EXIBICAO_SECOES = [
  'posologia',
  'indicacoes',
  'contraindicacoes',
  'advertencias',
  'interacoes',
  'reacoes_adversas',
  'superdose',
  'esquecimento',
  'farmacologia',
  'como_funciona',
  'eficacia',
  'armazenamento',
];

const MINIMO_SECOES = 3;

/** Remove acentos mantendo o comprimento e a caixa: as posições valem para o texto original. */
function semAcento(texto: string): string {
  let saida = '';
  for (let i = 0; i < texto.length; i++) saida += texto[i].normalize('NFD')[0];
  return saida;
}

/** Item de texto do pdf.js (`page.getTextContent().items`). */
export interface ItemTextoPdf {
  str: string;
  transform: number[];
  hasEOL?: boolean;
}

/** Junta os itens de uma página em linhas: quebra quando o item termina a linha ou muda de altura. */
export function textoDaPagina(itens: ItemTextoPdf[]): string {
  let saida = '';
  let yAnterior: number | null = null;
  for (const item of itens) {
    if (item.str === undefined) continue;
    const y = item.transform[5];
    if (yAnterior !== null && Math.abs(y - yAnterior) > 2 && !saida.endsWith('\n')) saida += '\n';
    saida += item.str;
    // O pdf.js também marca fim de linha em itens vazios: linha em branco aqui é ruído, não parágrafo
    if (item.hasEOL && !saida.endsWith('\n')) saida += '\n';
    yAnterior = y;
  }
  return saida;
}

// Marcas de diagramação que se repetem nas páginas ("Pyloripac_BU01b_VP", "BU 04a_VP SAP 4183603", arquivo .indd)
const ARTEFATO_PAGINA = /_|\.indd|\b(BU|VP|VPS|SAP|PH)\s?\d|\bBU\d|^\d{1,3}$|^p[aá]gina \d+( de \d+)?$|^\d+\s*mm$/i;
const DATA_HORA_DIAGRAMACAO = /^\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}$/;
// Caixa de aprovação da prova gráfica que alguns laboratórios deixam no PDF publicado
// ("Produto/Product:", "O Fornecedor é responsável...", "E D I T O R A Ç Ã O  G R Á F I C A", arquivo .indd)
const PROVA_GRAFICA =
  /Produto\/Product|C[oó]digo\/Code|^Dimensional:|Data\/Date|Cores\/Colors|Preto\/Black|Approved by|Fornecedor (é|não tem)|Supplier|approved PDF|E D I T O R A|GRAPHIC PUBLISHING|\.indd\b|_BU ?\d|_VPS?(_|\b)|-\d{2}\/\d{2}\/\d{4}-\d{2}:\d{2}hs$/i;

function limparLinhas(texto: string): string[] {
  const linhas = texto
    .replace(/\r\n?/g, '\n')
    .replace(/[   ]/g, ' ')
    // Palavra quebrada com hífen no fim da linha ("MEDICAMEN-\nTO", "compos-\ntos")
    .replace(/([A-Za-zÀ-ÿ])[-­‐‑][ \t]*\n\s*([a-zà-ÿ]|[A-ZÀ-Ý](?=[A-ZÀ-Ý]))/g, '$1$2')
    .split('\n')
    .map((l) => l.replace(/[ \t]+/g, ' ').trim());
  const contagem = new Map<string, number>();
  for (const l of linhas) if (l) contagem.set(l, (contagem.get(l) ?? 0) + 1);
  return linhas.filter((l) => {
    if (DATA_HORA_DIAGRAMACAO.test(l) || PROVA_GRAFICA.test(l)) return false;
    const repetida = (contagem.get(l) ?? 0) >= 2 && l.length <= 60;
    return !(ARTEFATO_PAGINA.test(l) && (repetida || l.length <= 40));
  });
}

/** Reconstrói parágrafos: linhas quebradas pelo layout do PDF viram uma só; itens, subtítulos e frases fechadas ficam. */
export function juntarParagrafos(linhas: string[]): string {
  const saida: string[] = [];
  let atual = '';
  for (let i = 0; i < linhas.length; i++) {
    const linha = linhas[i];
    if (!linha) {
      if (atual) saida.push(atual);
      atual = '';
      continue;
    }
    atual = atual ? `${atual} ${linha}` : linha;
    const proxima = linhas[i + 1] ?? '';
    const fechaFrase = /[.:;?!]$/.test(linha);
    const proximaEhItem = /^([-•·▪*]|\d+[.)]\s|[a-z]\)\s)/.test(proxima);
    const subtitulo = linha.length <= 45 && /^[A-ZÀ-Ý]/.test(proxima) && !/[,(]$/.test(linha);
    if (!proxima || fechaFrase || proximaEhItem || subtitulo) {
      saida.push(atual);
      atual = '';
    }
  }
  if (atual) saida.push(atual);
  return saida.join('\n').trim();
}

interface PosicaoSecao {
  modelo: ModeloSecao;
  inicio: number;
  fimTitulo: number;
}

function regexTitulo(modelo: ModeloSecao, exigirNumero: boolean, flags: string): RegExp {
  const palavras = modelo.padrao.replace(/ /g, '[\\s-]+');
  const numero = `${modelo.numero}[ \\t]*[.)\\-–]?[ \\t]*\\n?[ \\t]*`;
  // O resto do título continua em maiúsculas ("... ESTE MEDICAMENTO?"); o texto da seção não
  return new RegExp(`(^|\\n)[ \\t]*(${numero})${exigirNumero ? '' : '?'}${palavras}[A-Z0-9 ,\\-/()\\n]*?\\??[ \\t]*:?[ \\t]*(?=\\n|$)`, flags);
}

function localizarSecoes(textoSemAcento: string, modelos: ModeloSecao[], exigirNumero: boolean, flags: string): PosicaoSecao[] {
  const encontradas: PosicaoSecao[] = [];
  let cursor = 0;
  for (const modelo of modelos) {
    const regex = regexTitulo(modelo, exigirNumero, flags + 'g');
    regex.lastIndex = cursor;
    const m = regex.exec(textoSemAcento);
    if (!m) continue;
    const inicio = m.index + m[1].length;
    let fimTitulo = m.index + m[0].length;
    // Pergunta do paciente quebrada em linhas ("... POSSO GUARDAR\nESTE MEDICAMENTO?"): o título vai até o "?"
    if (modelo.titulo.endsWith('?')) {
      for (let extra = 0; extra < 2 && !textoSemAcento.slice(inicio, fimTitulo).includes('?'); extra++) {
        const continuacao = /^\n[^\na-z]{1,80}(?=\n|$)/.exec(textoSemAcento.slice(fimTitulo));
        if (!continuacao) break;
        fimTitulo += continuacao[0].length;
      }
    }
    encontradas.push({ modelo, inicio, fimTitulo });
    cursor = fimTitulo;
  }
  return encontradas;
}

/** Tenta títulos em maiúsculas (número opcional) e, se faltar, títulos numerados em qualquer caixa. */
function melhorLocalizacao(textoSemAcento: string, modelos: ModeloSecao[]): PosicaoSecao[] {
  const maiusculas = localizarSecoes(textoSemAcento, modelos, false, '');
  if (maiusculas.length >= modelos.length - 1) return maiusculas;
  const numeradas = localizarSecoes(textoSemAcento, modelos, true, 'i');
  return numeradas.length > maiusculas.length ? numeradas : maiusculas;
}

function dataIso(dia: string, mes: string, ano: string): string {
  return `${ano}-${mes}-${dia}`;
}

function extrairRegistro(textoSemAcento: string): string {
  const numero = /(?<!\d)(1)\s?\.\s?(\d{4})\s?\.\s?(\d{4})(?!\d)/g;
  let m: RegExpExecArray | null;
  while ((m = numero.exec(textoSemAcento))) {
    const antes = textoSemAcento.slice(Math.max(0, m.index - 40), m.index).toUpperCase();
    if (/\bM\.?\s?S\.?\b|REGISTRO|\bREG\b/.test(antes)) return m[1] + m[2] + m[3];
  }
  return '';
}

function extrairEmpresa(linhas: string[]): string {
  const rotulo = /^(Registrad[oa]|Detentor[a]? do registro|Titular do registro)[^:]*:\s*(.*)$/i;
  for (let i = 0; i < linhas.length; i++) {
    const m = rotulo.exec(linhas[i]);
    if (!m) continue;
    if (m[2].trim()) return m[2].trim();
    const seguinte = linhas.slice(i + 1).find((l) => l.trim());
    if (seguinte) return seguinte.trim();
  }
  return '';
}

const LINHA_IGNORADA_NO_NOME =
  /^(medicamento (gen[eé]rico|similar|novo|biol[oó]gico|fitoter[aá]pico|de refer[eê]ncia)|lei n|identifica[cç][aã]o do medicamento|bula (do|para o|ao) (paciente|profissional)|modelo de bula|informa[cç][oõ]es (ao|para o) paciente|leia com aten[cç][aã]o)/i;

function extrairNomeEPrincipios(linhasCabecalho: string[]): { nome: string; principios: string[] } {
  const candidatas: string[] = [];
  for (const linha of linhasCabecalho) {
    if (/^APRESENTA/i.test(semAcento(linha))) break;
    if (!linha || LINHA_IGNORADA_NO_NOME.test(linha) || linha.length > 80) continue;
    candidatas.push(linha.replace(/[®™]/g, '').trim());
  }
  const nome = candidatas[0] ?? '';
  const principios = candidatas.slice(1).filter((l) => /^[a-zà-ÿ]/.test(l) && l.length <= 60);
  if (nome && /^[a-zà-ÿ]/.test(nome)) principios.unshift(nome);
  return { nome, principios };
}

/**
 * Lê o texto de uma bula e devolve as seções na ordem da RDC 47/2009.
 * Lança ErroBula quando o texto não tem conteúdo (PDF digitalizado) ou não tem as seções de uma bula.
 */
export function analisarBula(textoBruto: string): BulaAnalisada {
  const linhas = limparLinhas(textoBruto);
  const texto = linhas.join('\n');
  if (texto.replace(/\s/g, '').length < 300) {
    throw new ErroBula('O PDF não tem texto selecionável (pode ser uma imagem digitalizada). Baixe a versão em texto no Bulário.');
  }
  const textoSemAcento = semAcento(texto);

  const profissional = melhorLocalizacao(textoSemAcento, SECOES_PROFISSIONAL);
  const paciente = melhorLocalizacao(textoSemAcento, SECOES_PACIENTE);
  const tipo: TipoBula = profissional.length >= paciente.length ? 'profissional' : 'paciente';
  const posicoes = tipo === 'profissional' ? profissional : paciente;
  if (posicoes.length < MINIMO_SECOES) {
    throw new ErroBula(
      'O arquivo não parece uma bula: não foram encontradas as seções padronizadas pela ANVISA (RDC 47/2009), ' +
        'como "Posologia e modo de usar" ou "Como devo usar este medicamento?".'
    );
  }

  const dizeres = /(^|\n)[ \t]*DIZERES LEGAIS/.exec(textoSemAcento.slice(posicoes[posicoes.length - 1].fimTitulo));
  const fimUltima = dizeres ? posicoes[posicoes.length - 1].fimTitulo + dizeres.index : texto.length;

  const secoes: SecaoBula[] = posicoes.map((posicao, i) => {
    const fim = i + 1 < posicoes.length ? posicoes[i + 1].inicio : fimUltima;
    const corpo = texto.slice(posicao.fimTitulo, fim).split('\n');
    return { chave: posicao.modelo.chave, titulo: posicao.modelo.titulo, texto: juntarParagrafos(corpo) };
  });

  const linhasCabecalho = texto.slice(0, posicoes[0].inicio).split('\n');
  const { nome, principios } = extrairNomeEPrincipios(linhasCabecalho);
  const inicioApresentacao = linhasCabecalho.findIndex((l) => /^APRESENTA/i.test(semAcento(l)));
  const cabecalho = juntarParagrafos(
    (inicioApresentacao >= 0 ? linhasCabecalho.slice(inicioApresentacao) : []).filter(
      (l) => !/^INFORMA[CÇ][OÕ]ES (AO|PARA O|T[EÉ]CNICAS)/i.test(l)
    )
  );

  const aprovacao = /aprovad[ao][^\n]{0,60}?Anvisa\s*(?:em\s*)?(\d{2})\/(\d{2})\/(\d{4})/i.exec(textoSemAcento);
  const cnpj = /CNPJ[^\d]{0,10}(\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2})/i.exec(texto);

  return {
    tipo,
    nome_produto: nome,
    principios_ativos: principios,
    empresa: extrairEmpresa(texto.slice(fimUltima).split('\n')) || extrairEmpresa(linhas),
    cnpj: cnpj ? cnpj[1] : '',
    registro: extrairRegistro(textoSemAcento),
    data_aprovacao: aprovacao ? dataIso(aprovacao[1], aprovacao[2], aprovacao[3]) : '',
    cabecalho,
    secoes,
  };
}

/** Seções na ordem de exibição (posologia primeiro). */
export function secoesParaExibicao(secoes: SecaoBula[]): SecaoBula[] {
  const posicao = (chave: string) => {
    const i = ORDEM_EXIBICAO_SECOES.indexOf(chave);
    return i < 0 ? ORDEM_EXIBICAO_SECOES.length : i;
  };
  return [...secoes].sort((a, b) => posicao(a.chave) - posicao(b.chave));
}
