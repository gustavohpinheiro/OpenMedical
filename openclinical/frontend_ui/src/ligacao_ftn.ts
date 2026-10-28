// Liga uma apresentação comercial (CMED/ANVISA) à monografia do Formulário Terapêutico Nacional
// pelo princípio ativo, e monta o link da bula oficial no Bulário Eletrônico da ANVISA.
// Sem imports de runtime: os testes em Node (tests/paridade_calculos.test.mjs) importam este arquivo direto.
import type { MonografiaFtn } from './data/formulario_terapeutico';

const normalizar = (texto: string) =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

// Ânions de sal que precedem o fármaco ("cloridrato de sertralina" -> "sertralina")
const ANIONS =
  '(?:di|hemi)?(?:cloridrato|bromidrato|sulfato|acetato|fosfato(?: dissodico| sodico)?|maleato|besilato|succinato(?: sodico)?|' +
  'citrato|fumarato|hemifumarato|tartarato|hemitartarato|bitartarato|mesilato|dimesilato|nitrato|valerato|propionato|dipropionato|' +
  'carbonato|gliconato|lactato|estolato|palmitato|decanoato|enantato|benzoato|brometo|iodeto|pamoato|oxalato|tosilato|cloreto|' +
  'hiclato|furoato|butilbrometo|metilbrometo|embonato|cipionato|undecilato|malato|levomalato|estearato|xinafoato|teoclato)';
const PREFIXO_SAL = new RegExp(`^${ANIONS} de `);
// Sal mineral em que o íon é o próprio fármaco ("cloreto de potássio", "carbonato de lítio"): não se remove o ânion
const SAL_MINERAL = new RegExp(`^${ANIONS} de (sodio|potassio|calcio|magnesio|litio|zinco|aluminio|ferro|prata)$`);
const SUFIXO_SAL =
  /(?:\s+(?:de )?(?:sodic[oa]|potassic[oa]|calcic[oa]|dissodic[oa]|magnesic[oa]|sodio|potassio|calcio|(?:mono|di|tri|tetra|penta|hexa|hepta|sesqui|hemi)-?h?idratad[oa]|hidratad[oa]|anidr[oa]|base|micronizad[oa]))+$/;

/** Princípio ativo sem sal nem hidratação: "CLORIDRATO DE CIPROFLOXACINO MONOIDRATADO" -> "ciprofloxacino". */
export function principioAtivoBase(nome: string): string {
  let parte = normalizar(nome)
    .replace(/\(.*?\)/g, '')
    .replace(/^\d+-/, '')
    .trim();
  if (SAL_MINERAL.test(parte)) return parte;
  parte = parte.replace(PREFIXO_SAL, '');
  const semSufixo = parte.replace(SUFIXO_SAL, '').trim();
  return semSufixo || parte;
}

const chaveDasPartes = (partes: string[]) =>
  [...new Set(partes.map(principioAtivoBase).filter(Boolean))].sort().join(' + ');

/** Chave da substância CMED ("A;B" ou "A + B"), independente da ordem e do sal. */
export function chaveSubstanciaCmed(substancia: string): string {
  return chaveDasPartes(substancia.split(/\s*[;+]\s*/));
}

/**
 * Chaves de uma monografia. O FTN titula sais alternativos do mesmo fármaco juntos
 * ("omeprazol e omeprazol sódico", "midazolam ou cloridrato de midazolam"): cada alternativa vira uma chave.
 * " e " só separa quando as partes são o mesmo fármaco, para não confundir associações
 * ("artesunato de sódio e cloridrato de mefloquina").
 */
export function chavesMonografia(nome: string): string[] {
  if (nome.includes('+')) return [chaveDasPartes(nome.split(/\s*\+\s*/))];
  const alternativas = normalizar(nome).split(/\s+ou\s+/);
  const chaves: string[] = [];
  for (const alternativa of alternativas) {
    const partes = alternativa.split(/\s+e\s+|,\s*/).map(principioAtivoBase);
    const mesmoFarmaco = partes.every((p) => p.includes(partes[0]) || partes[0].includes(p));
    chaves.push(...(mesmoFarmaco ? partes : [principioAtivoBase(alternativa)]));
  }
  return [...new Set(chaves.filter(Boolean))];
}

export type ViaAdministracao =
  | 'oral'
  | 'injetavel'
  | 'oftalmica'
  | 'otologica'
  | 'nasal_inalatoria'
  | 'topica'
  | 'transdermica'
  | 'vaginal'
  | 'retal'
  | 'outra';

/**
 * Via da apresentação CMED, escrita com as abreviaturas da ANVISA ("SOL INJ", "COL", "CREM DERM"...).
 * Forma não reconhecida vira 'outra' e não recebe posologia.
 */
export function viaApresentacaoCmed(apresentacao: string): ViaAdministracao {
  const a = ` ${normalizar(apresentacao).replace(/[()/,]/g, ' ').replace(/\s+/g, ' ')} `;
  // "COL" na CMED é a colher dosadora, não colírio; "LIB RET" é liberação retardada, não via retal
  if (/ (oft|oc|ocu|ivit|intravitre[oa]) /.test(a)) return 'oftalmica';
  if (/ oto /.test(a)) return 'otologica';
  // Antes do retal: "SOL INJ IM/IV/RET" é injetável
  if (/ (inj|infus|iv|im|sc|fa|amp|liof|carp|preenc) /.test(a)) return 'injetavel';
  if (/ (vag|ovl|ovulo) /.test(a)) return 'vaginal';
  if (/ (sup|enem|retal|(?<!lib )ret) /.test(a)) return 'retal';
  if (/ (nas|inal|aer|neb) /.test(a)) return 'nasal_inalatoria';
  if (/ (transd|ades|stt) /.test(a)) return 'transdermica';
  // Antes do tópico: "CAP GEL DURA" é cápsula de gelatina, não gel
  if (/ (com|cap|capi|drg|cp|or|oral|xpe|elx|subl|mast|efev|gran|sach|pas|goma|buc|gts|cgt|cop|col) /.test(a)) return 'oral';
  if (/ (derm|crem|pom|gel|loc|top|xamp|shamp|sab|esmalte) /.test(a)) return 'topica';
  return 'outra';
}

/** Via de uma apresentação descrita por extenso no FTN ou na RENAME ("Solução injetável 1 g/mL"). */
export function viaApresentacaoFtn(texto: string): ViaAdministracao {
  const a = normalizar(texto);
  if (/colirio|oftalm/.test(a)) return 'oftalmica';
  if (/otolog|otic/.test(a)) return 'otologica';
  if (/vagina|ovulo/.test(a)) return 'vaginal';
  if (/supositorio|retal|enema/.test(a)) return 'retal';
  if (/inala|aerossol|nebuliz|nasal|volatil/.test(a)) return 'nasal_inalatoria';
  if (/injet|infusao|intraven|intramusc|subcut|ampola|perfus/.test(a)) return 'injetavel';
  if (/transderm/.test(a)) return 'transdermica';
  if (/creme|pomada|gel|locao|xampu|topic|cutane|dermatol|pasta|esmalte/.test(a)) return 'topica';
  return 'oral';
}

// Só as apresentações do próprio FTN: os itens RENAME 2024 são associados pelo nome sem sal
// e trazem formas de outros sais (o creme de dexametasona aparece no fosfato dissódico injetável).
function viasDaMonografia(monografia: MonografiaFtn): Set<ViaAdministracao> {
  return new Set(monografia.apresentacoes.map(viaApresentacaoFtn));
}

/** Índice chave -> monografias, montado uma vez por lista. */
const indices = new WeakMap<MonografiaFtn[], Map<string, MonografiaFtn[]>>();
function indicePorChave(monografias: MonografiaFtn[]): Map<string, MonografiaFtn[]> {
  let indice = indices.get(monografias);
  if (!indice) {
    indice = new Map();
    for (const monografia of monografias) {
      for (const chave of chavesMonografia(monografia.nome)) {
        const lista = indice.get(chave) ?? [];
        lista.push(monografia);
        indice.set(chave, lista);
      }
    }
    indices.set(monografias, indice);
  }
  return indice;
}

/**
 * Monografias do FTN com o mesmo princípio ativo (ou a mesma associação) e a mesma via da apresentação.
 * Uma pomada de betametasona não recebe a posologia da betametasona injetável.
 */
export function monografiasDoProduto(
  substancia: string,
  apresentacao: string,
  monografias: MonografiaFtn[]
): MonografiaFtn[] {
  const candidatas = indicePorChave(monografias).get(chaveSubstanciaCmed(substancia)) ?? [];
  const via = viaApresentacaoCmed(apresentacao);
  return candidatas.filter((monografia) => viasDaMonografia(monografia).has(via));
}

/** Itens da RENAME 2024 (SUS) com o mesmo princípio ativo ou associação da substância CMED. */
export function itensRenameDoPrincipio<T extends { denominacao: string }>(substancia: string, itens: T[]): T[] {
  const chave = chaveSubstanciaCmed(substancia);
  return itens.filter((item) => chaveSubstanciaCmed(item.denominacao) === chave);
}

/** Monografias do mesmo princípio ativo (ou associação), sem filtro de via: usado ao clicar no nome de um fármaco. */
export function monografiasDoPrincipio(nome: string, monografias: MonografiaFtn[]): MonografiaFtn[] {
  return indicePorChave(monografias).get(chaveSubstanciaCmed(nome)) ?? [];
}

/**
 * Bulário Eletrônico da ANVISA. O número de registro de 13 dígitos da CMED identifica a apresentação;
 * o bulário busca pelo registro do produto (9 primeiros dígitos). Sem registro, busca pelo nome.
 */
export function urlBularioAnvisa(numeroRegistro: string, nomeProduto: string): string {
  const digitos = (numeroRegistro || '').replace(/\D/g, '');
  if (digitos.length >= 9) {
    return `https://consultas.anvisa.gov.br/#/bulario/q/?numeroRegistro=${digitos.slice(0, 9)}`;
  }
  return `https://consultas.anvisa.gov.br/#/bulario/q/?nomeProduto=${encodeURIComponent(nomeProduto.trim())}`;
}
