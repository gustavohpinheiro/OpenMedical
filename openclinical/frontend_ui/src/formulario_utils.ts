import type { EsquemaAdministracaoFtn, MonografiaFtn } from './data/formulario_terapeutico';
import { normalizarTexto } from './api';

// O módulo do FTN tem ~3 MB: é carregado sob demanda (e pré-carregado pelo service worker no PWA)
let cacheFormulario: Promise<typeof import('./data/formulario_terapeutico')> | null = null;
export const carregarFormulario = () => {
  cacheFormulario ??= import('./data/formulario_terapeutico');
  return cacheFormulario;
};

export const capitalizar = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1);

/** Via de administração deduzida da apresentação, para o cabeçalho "USO ..." da receita. */
export function inferirVia(apresentacao: string): string {
  const a = normalizarTexto(apresentacao);
  if (/injet|intraven|intramusc|ampola|frasco-ampola|po para solucao inj|infusao/.test(a)) return 'USO INJETÁVEL';
  if (/colirio|oftalm/.test(a)) return 'USO OFTÁLMICO';
  if (/otolog|otico/.test(a)) return 'USO OTOLÓGICO';
  if (/aerossol|inalat|po para inalacao|nebuliz|spray nasal|nasal/.test(a)) return 'USO INALATÓRIO/NASAL';
  if (/creme|pomada|gel|locao|xampu|solucao topica|uso topico|cutane/.test(a)) return 'USO TÓPICO';
  if (/vaginal|ovulo/.test(a)) return 'USO VAGINAL';
  if (/supositorio|retal|enema/.test(a)) return 'USO RETAL';
  return 'USO ORAL';
}

/** Concentração em mg/mL de uma apresentação líquida ("50 mg/mL", "250 mg/5 mL"); null se não houver. */
export function concentracaoMgPorMl(apresentacao: string): number | null {
  const a = apresentacao.toLowerCase().replace(/,/g, '.');
  const porMl = /(\d+(?:\.\d+)?)\s*mg\s*\/\s*ml/.exec(a);
  if (porMl) return parseFloat(porMl[1]);
  const porVolume = /(\d+(?:\.\d+)?)\s*mg\s*\/\s*(\d+(?:\.\d+)?)\s*ml/.exec(a);
  if (porVolume) return parseFloat(porVolume[1]) / parseFloat(porVolume[2]);
  return null;
}

/** Apresentações oferecidas para a receita: FTN 2010 + itens da RENAME 2024 (sem repetir). */
export function apresentacoesDisponiveis(monografia: MonografiaFtn): string[] {
  const lista = monografia.apresentacoes.map((a) => a.replace(/\.$/, ''));
  for (const item of monografia.rename_2024) {
    const descricao = `${capitalizar(item.forma_farmaceutica)} ${item.concentracao} (RENAME 2024 - ${item.componente})`;
    if (!lista.some((a) => normalizarTexto(a).includes(normalizarTexto(item.concentracao)) && normalizarTexto(a).includes(normalizarTexto(item.forma_farmaceutica).split(' ')[0]))) {
      lista.push(descricao);
    }
  }
  return lista;
}

/** Itens de orientação ao paciente (Markdown do FTN em lista) para o rodapé da receita. */
function orientacoesResumidas(monografia: MonografiaFtn, limite = 3): string[] {
  return monografia.orientacoes_pacientes
    .split('\n')
    .filter((linha) => linha.startsWith('- '))
    .map((linha) => linha.slice(2).trim())
    .slice(0, limite);
}

export function montarReceita(
  monografia: MonografiaFtn,
  apresentacao: string,
  esquema: EsquemaAdministracaoFtn | null
): string {
  const posologia = esquema
    ? `${esquema.texto}${esquema.indicacao ? `\n   (Indicação: ${esquema.indicacao} - ${esquema.populacao})` : ''}`
    : '[PREENCHER dose, via, intervalo e duração]';
  const orientacoes = orientacoesResumidas(monografia);
  return [
    monografia.tipo_receituario.toUpperCase(),
    'Paciente: ______________________________________',
    'Data: ___/___/______',
    '',
    `${inferirVia(apresentacao)}:`,
    `1. ${capitalizar(monografia.nome)} - ${apresentacao} ---------- [quantidade]`,
    `   ${posologia}`,
    ...(orientacoes.length > 0 ? ['', 'Orientações ao paciente:', ...orientacoes.map((o) => `- ${o}`)] : []),
    '',
    `Posologia conforme Formulário Terapêutico Nacional 2010 (MS), p. ${monografia.pagina}. Conferir antes de prescrever.`,
  ].join('\n');
}

export function filtrarMonografias(lista: MonografiaFtn[], termo: string): MonografiaFtn[] {
  const t = normalizarTexto(termo);
  if (!t) return lista;
  return lista.filter(
    (m) =>
      normalizarTexto(m.nome).includes(t) ||
      normalizarTexto(m.nome_busca).includes(t) ||
      normalizarTexto(m.apresentacoes.join(' ')).includes(t) ||
      normalizarTexto(m.indicacoes).includes(t)
  );
}

/** Termos usados para reconhecer o fármaco quando outra monografia o cita em "Interações de medicamentos". */
function chavesDoFarmaco(monografia: MonografiaFtn): string[] {
  return monografia.nome_busca
    .split(' + ')
    .flatMap((parte) => [normalizarTexto(parte), normalizarTexto(parte).split(' ')[0]])
    .filter((chave, indice, todas) => chave.length >= 5 && todas.indexOf(chave) === indice);
}

export interface InteracaoEncontradaFtn {
  origem: MonografiaFtn;
  alvo: MonografiaFtn;
  farmacoCitado: string;
  texto: string;
}

/** Cruza todos os pares selecionados usando as seções "Interações de medicamentos" das duas monografias. */
export function cruzarInteracoesFtn(selecionadas: MonografiaFtn[]): InteracaoEncontradaFtn[] {
  const encontradas: InteracaoEncontradaFtn[] = [];
  for (const origem of selecionadas) {
    for (const alvo of selecionadas) {
      if (origem.id_monografia === alvo.id_monografia) continue;
      const chaves = chavesDoFarmaco(alvo);
      for (const interacao of origem.interacoes) {
        const citado = normalizarTexto(interacao.farmaco);
        if (chaves.some((chave) => citado.includes(chave))) {
          encontradas.push({ origem, alvo, farmacoCitado: interacao.farmaco, texto: interacao.texto });
        }
      }
    }
  }
  return encontradas;
}

/** O FTN não gradua as interações; este rótulo vem só de palavras do próprio texto. */
export function rotuloConduta(texto: string): { rotulo: string; nivel: 'evitar' | 'ajustar' | 'monitorar' } {
  const t = normalizarTexto(texto);
  if (
    /contraindicad|nao (usar|utilizar|administrar|associar)|evitar (o |a )?(uso|associacao|combinacao|coadministracao)|(deve|devem) ser evitad|evitar uso concomitante|uso concomitante deve ser evitado/.test(t)
  ) {
    return { rotulo: 'Evitar associação (segundo o texto)', nivel: 'evitar' };
  }
  if (/ajust|reduzir a dose|diminuir a dose|aumentar a dose/.test(t)) {
    return { rotulo: 'Ajustar dose (segundo o texto)', nivel: 'ajustar' };
  }
  return { rotulo: 'Monitorar', nivel: 'monitorar' };
}
