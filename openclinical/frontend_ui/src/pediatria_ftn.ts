// Leitura dos esquemas do FTN para a calculadora de dose pediátrica.
// Só preenche o que o texto diz sem ambiguidade; o restante fica para o médico informar.
// Sem imports de runtime: os testes em Node (tests/paridade_calculos.test.mjs) importam este arquivo direto.
import type { EsquemaAdministracaoFtn, MonografiaFtn } from './data/formulario_terapeutico';

export type ModoDose = 'dia' | 'tomada';

export interface DosePediatricaInterpretada {
  doseMin: number;
  doseMax: number;
  /** null quando o texto não diz se a dose em mg/kg é diária ou por tomada */
  modo: ModoDose | null;
  /** tomadas por dia; null quando o texto não informa o intervalo */
  fracionamento: number | null;
  /** teto diário em mg (só quando o FTN o dá como diário) */
  tetoDiarioMg: number | null;
  /** "em dose única": a receita não pode dizer "a cada 24 horas" */
  doseUnica: boolean;
}

const normalizar = (texto: string) =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ');

const numero = (texto: string) => parseFloat(texto.replace(/\./g, '').replace(',', '.'));

const PADRAO_MG_KG = /(\d+(?:[.,]\d+)?)(?:\s*(?:a|-|–|ate)\s*(\d+(?:[.,]\d+)?))?\s*mg\s*\/\s*kg(\s*\/\s*dia)?/g;

/** População pediátrica (crianças, neonatos, lactentes, adolescentes...). */
export function ehPopulacaoPediatrica(populacao: string): boolean {
  return /crian|neonat|lactent|recem|adolesc|pediatr|bebe|infan|menores de/.test(normalizar(populacao));
}

/** Tomadas por dia a partir de "a cada 8 horas", "3 vezes ao dia", "em 4 tomadas", "dose única". */
export function fracionamentoDoTexto(texto: string): number | null {
  const t = normalizar(texto);
  const intervalo = /a cada (\d+)(?: (?:ou|a) (\d+))? horas/.exec(t);
  if (intervalo) {
    // "a cada 8 ou 12 horas" / "a cada 2 a 3 horas": a escolha é do médico
    if (intervalo[2] && intervalo[2] !== intervalo[1]) return null;
    const horas = parseInt(intervalo[1], 10);
    if (horas > 0 && horas <= 24 && 24 % horas === 0) return 24 / horas;
    return null;
  }
  const vezes = /(\d+) vezes (?:ao|por) dia/.exec(t) ?? /(?:em|divididos? em) (\d+) (?:tomadas|doses|administracoes)/.exec(t);
  if (vezes) {
    const n = parseInt(vezes[1], 10);
    if (n >= 1 && n <= 24) return n;
  }
  if (/(?:uma vez|1 vez) (?:ao|por) dia|a cada 24 horas/.test(t)) return 1;
  if (/duas vezes (?:ao|por) dia/.test(t)) return 2;
  if (/tres vezes (?:ao|por) dia/.test(t)) return 3;
  if (/quatro vezes (?:ao|por) dia/.test(t)) return 4;
  return null;
}

/**
 * Interpreta um esquema do FTN. Devolve null quando o texto não tem dose em mg/kg ou tem mais de uma
 * (ex.: ataque + manutenção), casos em que o médico preenche a calculadora.
 */
export function interpretarEsquemaPediatrico(esquema: EsquemaAdministracaoFtn): DosePediatricaInterpretada | null {
  const fracionamento = esquema.fracionamento_diario ?? fracionamentoDoTexto(esquema.texto);
  const doseUnica = /dose unica/.test(normalizar(esquema.texto));
  // O extrator do FTN já estruturou os casos inequívocos em mg/kg/dia
  if (esquema.dose_mg_kg_dia_min !== null) {
    return {
      doseMin: esquema.dose_mg_kg_dia_min,
      doseMax: esquema.dose_mg_kg_dia_max ?? esquema.dose_mg_kg_dia_min,
      modo: 'dia',
      fracionamento,
      tetoDiarioMg: esquema.dose_maxima_diaria_mg,
      doseUnica,
    };
  }

  const t = normalizar(esquema.texto);
  // Doses por tempo de infusão (mg/kg/h, microgramas/kg/minuto) não são dose por tomada nem diária
  if (/\/\s*kg\s*(\/\s*(h|hora|min)|por (hora|minuto))/.test(t)) return null;
  const doses = [...t.matchAll(PADRAO_MG_KG)];
  const distintas = new Set(doses.map((d) => `${d[1]}|${d[2] ?? ''}|${d[3] ? 'dia' : ''}`));
  if (distintas.size !== 1) return null;

  const [trecho, minimo, maximo, porDia] = doses[0];
  const depois = t.slice((doses[0].index ?? 0) + trecho.length);
  let modo: ModoDose | null = null;
  if (porDia || /^[^.;]*?(por dia|ao dia|diari|divididos?|dividida|fracionad)/.test(depois)) modo = 'dia';
  // "a cada N horas" sozinho não diz se a dose é por tomada: o FTN escreve "20 a 90 mg/kg de amoxicilina,
  // a cada 8 ou 12 horas" querendo dose diária dividida. Só a menção explícita define "por tomada".
  else if (/^[^.;]*?(dose unica|por dose|por tomada|cada dose|cada tomada)/.test(depois)) modo = 'tomada';

  return {
    doseMin: numero(minimo),
    doseMax: maximo ? numero(maximo) : numero(minimo),
    modo,
    fracionamento: fracionamento ?? (doseUnica ? 1 : null),
    tetoDiarioMg: esquema.dose_maxima_diaria_mg,
    doseUnica,
  };
}

/** Esquemas mostrados na calculadora: os de população pediátrica e, entre os demais, os que estão em mg/kg. */
export function esquemasPediatricos(monografia: MonografiaFtn): EsquemaAdministracaoFtn[] {
  return monografia.esquemas.filter(
    (e) => ehPopulacaoPediatrica(e.populacao) || (/mg\s*\/\s*kg/i.test(e.texto) && !/^adult/i.test(e.populacao))
  );
}

export interface FormulacaoDisponivel {
  rotulo: string;
  mgPorMl: number;
  gotas: boolean;
  /** 'sus': item da RENAME 2024; 'ftn': descrita no FTN; 'comercial': apresentação da CMED */
  origem: 'sus' | 'ftn' | 'comercial';
  /** Associação: a concentração é a do componente citado na dose ("mg/kg de amoxicilina") */
  componente?: string;
}

/**
 * Concentração (mg/mL) do primeiro componente de uma associação: "50 mg + 12,5 mg/mL" -> 50,
 * "(400 + 57) mg/5 mL" -> 80. É o componente em que o FTN expressa a dose ("mg/kg de amoxicilina").
 */
export function mgPorMlPrimeiroComponente(texto: string): number | null {
  const t = normalizar(texto).replace(/,/g, '.');
  if (!t.includes('+')) return null;
  const primeiro = /(\d+(?:\.\d+)?)\s*(?:mg)?\s*(?:\/\s*ml\s*)?\+/.exec(t);
  const volumes = [...t.matchAll(/mg\s*\/\s*(\d+(?:\.\d+)?)?\s*ml\b/g)];
  if (!primeiro || volumes.length === 0) return null;
  const volume = parseFloat(volumes[volumes.length - 1][1] ?? '1');
  const valor = parseFloat(primeiro[1]) / volume;
  return Number.isFinite(valor) && valor > 0 ? valor : null;
}

/** mg/mL de uma apresentação ("250 mg/5 mL", "50 mg/mL", "40 mg/mL (gotas)"); null se não for líquida. */
export function mgPorMl(texto: string): number | null {
  const t = normalizar(texto).replace(/,/g, '.');
  const porVolume = /(\d+(?:\.\d+)?)\s*mg\s*\/\s*(\d+(?:\.\d+)?)\s*ml/.exec(t);
  if (porVolume) return parseFloat(porVolume[1]) / parseFloat(porVolume[2]);
  const porMl = /(\d+(?:\.\d+)?)\s*mg\s*\/\s*ml/.exec(t);
  if (porMl) return parseFloat(porMl[1]);
  const grama = /(\d+(?:\.\d+)?)\s*g\s*\/\s*ml/.exec(t);
  if (grama) return parseFloat(grama[1]) * 1000;
  return null;
}

/** Apresentação comercial (CMED) oferecida como formulação; a via oral já deve ter sido filtrada. */
export interface ApresentacaoComercialLiquida {
  nome_produto: string;
  apresentacao: string;
}

/**
 * Formulações líquidas para a calculadora, sem repetir a mesma concentração e nesta ordem de preferência:
 * RENAME 2024 (disponível no SUS), FTN e apresentações comerciais da CMED. Em associações, a concentração
 * usada é a do primeiro componente, o mesmo em que o FTN expressa a dose em mg/kg.
 */
export function formulacoesLiquidas(
  monografia: MonografiaFtn,
  comerciais: ApresentacaoComercialLiquida[] = []
): FormulacaoDisponivel[] {
  const associacao = monografia.nome.includes('+');
  const componente = associacao ? monografia.nome.split('+')[0].trim() : undefined;
  const candidatos: { texto: string; rotulo: string; origem: FormulacaoDisponivel['origem'] }[] = [
    ...monografia.rename_2024.map((item) => {
      const texto = `${item.forma_farmaceutica} ${item.concentracao}`;
      return { texto, rotulo: `${texto} (RENAME 2024 - ${item.componente})`, origem: 'sus' as const };
    }),
    ...monografia.apresentacoes.map((texto) => ({ texto, rotulo: texto.replace(/\.$/, ''), origem: 'ftn' as const })),
    ...comerciais.map((c) => ({ texto: c.apresentacao, rotulo: `${c.nome_produto} - ${c.apresentacao}`, origem: 'comercial' as const })),
  ];
  const lista: FormulacaoDisponivel[] = [];
  for (const { texto, rotulo, origem } of candidatos) {
    const valor = associacao ? mgPorMlPrimeiroComponente(texto) : /\+/.test(texto) ? null : mgPorMl(texto);
    if (valor === null || valor <= 0) continue;
    const arredondado = Math.round(valor * 1000) / 1000;
    if (lista.some((f) => Math.abs(f.mgPorMl - arredondado) < 1e-9)) continue;
    lista.push({ rotulo, mgPorMl: arredondado, gotas: /gota|\bgts\b|\bgot\b/i.test(texto), origem, componente });
  }
  return lista;
}
