// Coletor das bulas em PDF publicadas pelos próprios laboratórios (fontes em scripts/fontes_bulas_laboratorios.json).
//
// Regras de boa conduta, verificadas a cada execução:
// - respeita o robots.txt de cada domínio (grupo do nosso User-Agent ou "*");
// - no máximo 1 requisição a cada 2 s por domínio, com User-Agent identificado;
// - página com verificação antirrobô (Cloudflare, Incapsula...) faz a fonte ser pulada, nunca contornada;
// - PDF já coletado só é baixado de novo se mudou (ETag/Last-Modified e hash do arquivo).
//
// A bula é lida com o mesmo separador de seções da importação manual (src/bula_parser.ts) e gravada na tabela
// bulas_importadas dos dois bancos SQLite (etl_pipeline e app desktop), com origem "laboratorio:<id>".
// PDF sem número de registro reconhecível é descartado: sem ele não há como ligar a bula ao produto da CMED.
//
// Uso (Node 24):
//   node scripts/baixar_bulas_laboratorios.mjs                 # todas as fontes
//   node scripts/baixar_bulas_laboratorios.mjs --fonte ache --limite 20
//   node scripts/baixar_bulas_laboratorios.mjs --sem-gravar     # só testa a coleta e a leitura
// Pensado para rodar uma vez por semana (Agendador de Tarefas do Windows ou cron): não sobrecarrega os sites.

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const RAIZ_FRONTEND = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const RAIZ_PROJETO = resolve(RAIZ_FRONTEND, '..');
const BANCOS = [
  join(RAIZ_PROJETO, 'etl_pipeline', 'openclinical_core.sqlite'),
  join(RAIZ_PROJETO, 'core_rust', 'openclinical_desktop', 'openclinical_core.sqlite'),
];
const DIRETORIO_ESTADO = join(RAIZ_PROJETO, 'etl_pipeline', 'dados_publicos', 'bulas_laboratorios');
const CAMINHO_ESTADO = join(DIRETORIO_ESTADO, 'estado.json');
const USER_AGENT = 'OpenClinical/0.1 (coleta de bulas publicas; uso como referencia clinica)';
const TOKEN_ROBOTS = 'openclinical';
export const INTERVALO_POR_DOMINIO_MS = 2000;
const LIMITE_PDF_BYTES = 40 * 1024 * 1024;

// ---------------------------------------------------------------------------
// robots.txt
// ---------------------------------------------------------------------------

/** Regras (Allow/Disallow) do grupo do nosso User-Agent, ou do grupo "*" se não houver um específico. */
export function regrasRobots(texto, token = TOKEN_ROBOTS) {
  const grupos = [];
  let atual = null;
  let lendoAgentes = false;
  for (const bruta of texto.split(/\r?\n/)) {
    const linha = bruta.replace(/#.*$/, '').trim();
    const m = /^([A-Za-z-]+)\s*:\s*(.*)$/.exec(linha);
    if (!m) continue;
    const campo = m[1].toLowerCase();
    const valor = m[2].trim();
    if (campo === 'user-agent') {
      if (!lendoAgentes) {
        atual = { agentes: [], regras: [] };
        grupos.push(atual);
      }
      atual.agentes.push(valor.toLowerCase());
      lendoAgentes = true;
    } else if (campo === 'allow' || campo === 'disallow') {
      lendoAgentes = false;
      if (atual) atual.regras.push({ permitir: campo === 'allow', caminho: valor });
    } else {
      lendoAgentes = false;
    }
  }
  const especifico = grupos.filter((g) => g.agentes.some((a) => a !== '*' && token.includes(a)));
  const escolhidos = especifico.length > 0 ? especifico : grupos.filter((g) => g.agentes.includes('*'));
  return escolhidos.flatMap((g) => g.regras);
}

function casaCaminho(regra, caminho) {
  if (!regra) return false;
  const final = regra.endsWith('$');
  const corpo = (final ? regra.slice(0, -1) : regra).split('*').map((p) => p.replace(/[.+?^${}()|[\]\\]/g, '\\$&'));
  return new RegExp(`^${corpo.join('.*')}${final ? '$' : ''}`).test(caminho);
}

/** A regra mais específica (caminho mais longo) vence; empate favorece Allow. Sem regra, é permitido. */
export function permitidoPorRobots(regras, url) {
  const { pathname, search } = new URL(url);
  const caminho = pathname + search;
  let melhor = null;
  for (const regra of regras) {
    if (regra.caminho === '' || !casaCaminho(regra.caminho, caminho)) continue;
    if (!melhor || regra.caminho.length > melhor.caminho.length || (regra.caminho.length === melhor.caminho.length && regra.permitir)) {
      melhor = regra;
    }
  }
  return melhor ? melhor.permitir : true;
}

// ---------------------------------------------------------------------------
// Rede: intervalo por domínio, robots e detecção de verificação antirrobô
// ---------------------------------------------------------------------------

export class BloqueioAntirrobo extends Error {}
export class ProibidoPorRobots extends Error {}

// Página de desafio no lugar do conteúdo. Páginas normais podem carregar reCAPTCHA ou Turnstile num formulário:
// esses sinais só contam quando o servidor também recusou a resposta (403/429/503).
const DESAFIO_SEMPRE = [/<title>\s*Just a moment/i, /_Incapsula_Resource/i];
const DESAFIO_COM_RECUSA = [/challenges\.cloudflare\.com/i, /cf-chl-/i, /captcha/i];

export function pareceDesafio(status, texto) {
  if (DESAFIO_SEMPRE.some((r) => r.test(texto))) return true;
  return [403, 429, 503].includes(status) && DESAFIO_COM_RECUSA.some((r) => r.test(texto));
}

class Navegador {
  constructor({ intervaloMs = INTERVALO_POR_DOMINIO_MS, buscar = fetch } = {}) {
    this.intervaloMs = intervaloMs;
    this.buscar = buscar;
    this.ultimoAcesso = new Map();
    this.robots = new Map();
  }

  async esperarVez(dominio) {
    const espera = (this.ultimoAcesso.get(dominio) ?? 0) + this.intervaloMs - Date.now();
    if (espera > 0) await new Promise((r) => setTimeout(r, espera));
    this.ultimoAcesso.set(dominio, Date.now());
  }

  async regras(origem) {
    if (!this.robots.has(origem)) {
      await this.esperarVez(new URL(origem).host);
      const resposta = await this.buscar(`${origem}/robots.txt`, { headers: { 'User-Agent': USER_AGENT } });
      const texto = resposta.ok ? await resposta.text() : '';
      if (pareceDesafio(resposta.status, texto)) throw new BloqueioAntirrobo(`${origem}/robots.txt exige verificação antirrobô`);
      this.robots.set(origem, resposta.ok ? regrasRobots(texto) : []);
    }
    return this.robots.get(origem);
  }

  async obter(url, cabecalhos = {}) {
    const { origin, host } = new URL(url);
    if (!permitidoPorRobots(await this.regras(origin), url)) throw new ProibidoPorRobots(`robots.txt de ${host} não permite ${url}`);
    await this.esperarVez(host);
    const resposta = await this.buscar(url, { headers: { 'User-Agent': USER_AGENT, ...cabecalhos }, redirect: 'follow' });
    return resposta;
  }

  async texto(url) {
    const resposta = await this.obter(url);
    const texto = await resposta.text();
    if (pareceDesafio(resposta.status, texto)) throw new BloqueioAntirrobo(`${new URL(url).host} pediu verificação antirrobô`);
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status} em ${url}`);
    return texto;
  }
}

// ---------------------------------------------------------------------------
// Listagem de PDFs por tipo de fonte
// ---------------------------------------------------------------------------

async function pdfsWpRest(fonte, navegador, limite) {
  const pdfs = [];
  for (let pagina = 1; pagina <= 50; pagina++) {
    const url = `${fonte.listagem}${fonte.listagem.includes('?') ? '&' : '?'}page=${pagina}`;
    const resposta = await navegador.obter(url, { Accept: 'application/json' });
    if (resposta.status === 400) break; // WordPress: página além da última
    const texto = await resposta.text();
    if (pareceDesafio(resposta.status, texto)) throw new BloqueioAntirrobo(`${new URL(url).host} pediu verificação antirrobô`);
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status} em ${url}`);
    const itens = JSON.parse(texto);
    if (!Array.isArray(itens) || itens.length === 0) break;
    for (const item of itens) {
      const link = item[fonte.campo_pdf];
      if (typeof link === 'string' && /\.pdf(\?|$)/i.test(link)) pdfs.push({ url: link, pagina: item.link ?? '' });
    }
    if (limite && pdfs.length >= limite) break;
    const totalPaginas = Number(resposta.headers.get('x-wp-totalpages') ?? 0);
    if (totalPaginas && pagina >= totalPaginas) break;
  }
  return pdfs;
}

async function pdfsSitemap(fonte, navegador, limite) {
  const sitemap = await navegador.texto(fonte.sitemap);
  const paginas = [...sitemap.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]).filter((u) => u.includes(fonte.filtro_paginas));
  const padrao = new RegExp(fonte.padrao_pdf, 'g');
  const pdfs = [];
  const vistos = new Set();
  for (const pagina of paginas) {
    if (limite && pdfs.length >= limite) break;
    let html;
    try {
      html = await navegador.texto(pagina);
    } catch (erro) {
      if (erro instanceof BloqueioAntirrobo) throw erro;
      continue;
    }
    for (const m of html.matchAll(padrao)) {
      if (!vistos.has(m[0])) {
        vistos.add(m[0]);
        pdfs.push({ url: m[0], pagina });
      }
    }
  }
  return pdfs;
}

const LISTADORES = { 'wp-rest': pdfsWpRest, 'sitemap-paginas': pdfsSitemap };

// ---------------------------------------------------------------------------
// Leitura do PDF e gravação
// ---------------------------------------------------------------------------

async function carregarLeitor() {
  const pdfjs = await import(pathToFileURL(join(RAIZ_FRONTEND, 'node_modules', 'pdfjs-dist', 'legacy', 'build', 'pdf.mjs')).href);
  const parser = await import(pathToFileURL(join(RAIZ_FRONTEND, 'src', 'bula_parser.ts')).href);
  return async (bytes) => {
    const documento = await pdfjs.getDocument({ data: new Uint8Array(bytes), verbosity: 0 }).promise;
    try {
      let texto = '';
      for (let p = 1; p <= Math.min(documento.numPages, 80); p++) {
        texto += parser.textoDaPagina((await (await documento.getPage(p)).getTextContent()).items) + '\n';
      }
      return parser.analisarBula(texto);
    } finally {
      await documento.destroy();
    }
  };
}

// Mesmo esquema de clinical_engine::bulas_importadas (Rust)
const ESQUEMA_SQL = `
  CREATE TABLE IF NOT EXISTS bulas_importadas (
    registro TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('profissional', 'paciente')),
    nome_produto TEXT NOT NULL,
    principios_ativos TEXT NOT NULL DEFAULT '[]',
    empresa TEXT NOT NULL DEFAULT '',
    cnpj TEXT NOT NULL DEFAULT '',
    data_bula TEXT NOT NULL DEFAULT '',
    origem TEXT NOT NULL,
    url_origem TEXT NOT NULL DEFAULT '',
    data_importacao TEXT NOT NULL,
    hash_arquivo TEXT NOT NULL DEFAULT '',
    cabecalho TEXT NOT NULL DEFAULT '',
    secoes_json TEXT NOT NULL,
    PRIMARY KEY (registro, tipo)
  );
  CREATE VIRTUAL TABLE IF NOT EXISTS indice_busca_fts USING fts5(
    tipo_registro, id_referencia UNINDEXED, titulo_primario, subtitulo, conteudo_textual,
    tokenize = 'unicode61 remove_diacritics 2'
  );`;

export function gravarBula(db, bula) {
  db.exec(ESQUEMA_SQL);
  const id = `${bula.registro}:${bula.tipo}`;
  const secao = (chave) => bula.secoes.find((s) => s.chave === chave)?.texto ?? '';
  const rotulo = bula.tipo === 'profissional' ? 'Bula do profissional' : 'Bula do paciente';
  db.exec('BEGIN');
  try {
    db.prepare(
      `INSERT INTO bulas_importadas (registro, tipo, nome_produto, principios_ativos, empresa, cnpj, data_bula, origem,
         url_origem, data_importacao, hash_arquivo, cabecalho, secoes_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), ?, ?, ?)
       ON CONFLICT(registro, tipo) DO UPDATE SET
         nome_produto = excluded.nome_produto, principios_ativos = excluded.principios_ativos, empresa = excluded.empresa,
         cnpj = excluded.cnpj, data_bula = excluded.data_bula, origem = excluded.origem, url_origem = excluded.url_origem,
         data_importacao = excluded.data_importacao, hash_arquivo = excluded.hash_arquivo, cabecalho = excluded.cabecalho,
         secoes_json = excluded.secoes_json`
    ).run(
      bula.registro,
      bula.tipo,
      bula.nome_produto,
      JSON.stringify(bula.principios_ativos),
      bula.empresa,
      bula.cnpj,
      bula.data_bula,
      bula.origem,
      bula.url_origem,
      bula.hash_arquivo,
      bula.cabecalho,
      JSON.stringify(bula.secoes)
    );
    db.prepare("DELETE FROM indice_busca_fts WHERE tipo_registro = 'bula_importada' AND id_referencia = ?").run(id);
    db.prepare(
      "INSERT INTO indice_busca_fts (tipo_registro, id_referencia, titulo_primario, subtitulo, conteudo_textual) VALUES ('bula_importada', ?, ?, ?, ?)"
    ).run(
      id,
      bula.nome_produto,
      `${rotulo} · ${bula.empresa || 'empresa não informada'}`,
      `${bula.principios_ativos.join(' ')} ${bula.registro} ${secao('indicacoes')} ${secao('posologia')}`
    );
    db.exec('COMMIT');
  } catch (erro) {
    db.exec('ROLLBACK');
    throw erro;
  }
}

function carregarEstado() {
  return existsSync(CAMINHO_ESTADO) ? JSON.parse(readFileSync(CAMINHO_ESTADO, 'utf8')) : {};
}

function salvarEstado(estado) {
  mkdirSync(DIRETORIO_ESTADO, { recursive: true });
  writeFileSync(CAMINHO_ESTADO, JSON.stringify(estado, null, 1));
}

async function baixarPdf(navegador, url, anterior) {
  const cabecalhos = {};
  if (anterior?.etag) cabecalhos['If-None-Match'] = anterior.etag;
  if (anterior?.last_modified) cabecalhos['If-Modified-Since'] = anterior.last_modified;
  const resposta = await navegador.obter(url, cabecalhos);
  if (resposta.status === 304) return { situacao: 'sem_mudanca' };
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
  const bytes = Buffer.from(await resposta.arrayBuffer());
  if (bytes.length > LIMITE_PDF_BYTES) throw new Error('PDF maior que o limite');
  if (bytes.subarray(0, 4).toString('latin1') !== '%PDF') {
    if (pareceDesafio(resposta.status, bytes.toString('utf8', 0, 4000))) throw new BloqueioAntirrobo('verificação antirrobô no lugar do PDF');
    throw new Error('a resposta não é um PDF');
  }
  const hash = createHash('sha256').update(bytes).digest('hex');
  if (anterior?.sha256 === hash) return { situacao: 'sem_mudanca' };
  return { situacao: 'baixado', bytes, hash, etag: resposta.headers.get('etag'), last_modified: resposta.headers.get('last-modified') };
}

// ---------------------------------------------------------------------------
// Execução
// ---------------------------------------------------------------------------

function argumentos(lista) {
  const saida = { fontes: [], limite: 0, gravar: true };
  for (let i = 0; i < lista.length; i++) {
    if (lista[i] === '--fonte') saida.fontes.push(lista[++i]);
    else if (lista[i] === '--limite') saida.limite = Number(lista[++i]);
    else if (lista[i] === '--sem-gravar') saida.gravar = false;
  }
  return saida;
}

async function principal() {
  const opcoes = argumentos(process.argv.slice(2));
  const configuracao = JSON.parse(readFileSync(join(RAIZ_FRONTEND, 'scripts', 'fontes_bulas_laboratorios.json'), 'utf8'));
  const fontes = configuracao.fontes.filter((f) => opcoes.fontes.length === 0 || opcoes.fontes.includes(f.id));
  const lerBula = await carregarLeitor();
  const navegador = new Navegador();
  const estado = carregarEstado();
  const bancos = opcoes.gravar ? BANCOS.filter((b) => existsSync(b)).map((b) => new DatabaseSync(b)) : [];
  const relatorio = [];

  for (const fonte of fontes) {
    const linha = { fonte: fonte.id, pdfs: 0, gravadas: 0, sem_mudanca: 0, sem_registro: 0, nao_e_bula: 0, erros: 0, registros: new Set(), situacao: 'ok' };
    relatorio.push(linha);
    let pdfs;
    try {
      pdfs = await LISTADORES[fonte.tipo](fonte, navegador, opcoes.limite);
    } catch (erro) {
      linha.situacao = erro instanceof BloqueioAntirrobo || erro instanceof ProibidoPorRobots ? `pulada: ${erro.message}` : `erro: ${erro.message}`;
      console.log(`[${fonte.id}] ${linha.situacao}`);
      continue;
    }
    if (opcoes.limite) pdfs = pdfs.slice(0, opcoes.limite);
    linha.pdfs = pdfs.length;
    console.log(`[${fonte.id}] ${pdfs.length} PDFs de bula listados`);

    for (const { url } of pdfs) {
      const anterior = estado[url];
      try {
        const download = await baixarPdf(navegador, url, anterior);
        if (download.situacao === 'sem_mudanca') {
          linha.sem_mudanca++;
          if (anterior?.registro) linha.registros.add(anterior.registro);
          continue;
        }
        let analise;
        try {
          analise = await lerBula(download.bytes);
        } catch (erro) {
          linha.nao_e_bula++;
          estado[url] = { sha256: download.hash, etag: download.etag, last_modified: download.last_modified, descartado: erro.message };
          continue;
        }
        if (!analise.registro) {
          linha.sem_registro++;
          estado[url] = { sha256: download.hash, etag: download.etag, last_modified: download.last_modified, descartado: 'sem registro' };
          continue;
        }
        const bula = {
          registro: analise.registro,
          tipo: analise.tipo,
          nome_produto: analise.nome_produto || analise.principios_ativos.join(' + '),
          principios_ativos: analise.principios_ativos,
          empresa: analise.empresa || fonte.empresa,
          cnpj: analise.cnpj,
          data_bula: analise.data_aprovacao,
          origem: `laboratorio:${fonte.id}`,
          url_origem: url,
          hash_arquivo: download.hash,
          cabecalho: analise.cabecalho,
          secoes: analise.secoes,
        };
        for (const db of bancos) gravarBula(db, bula);
        linha.gravadas++;
        linha.registros.add(bula.registro);
        estado[url] = { sha256: download.hash, etag: download.etag, last_modified: download.last_modified, registro: bula.registro };
        console.log(`  ${bula.nome_produto} (${bula.tipo}, reg. ${bula.registro})`);
      } catch (erro) {
        if (erro instanceof BloqueioAntirrobo || erro instanceof ProibidoPorRobots) {
          linha.situacao = `interrompida: ${erro.message}`;
          console.log(`[${fonte.id}] ${linha.situacao}`);
          break;
        }
        linha.erros++;
        console.log(`  erro em ${url}: ${erro.message}`);
      }
    }
    if (opcoes.gravar) salvarEstado(estado);
  }

  // Quantos produtos da CMED passaram a ter bula (registro de 9 dígitos)
  let produtosCmed = null;
  if (bancos.length > 0) {
    const registros = [...new Set(relatorio.flatMap((l) => [...l.registros]))];
    const consulta = bancos[0].prepare(
      'SELECT COUNT(DISTINCT substr(numero_registro, 1, 9)) AS n FROM catalogo_nacional_medicamentos_cmed WHERE substr(numero_registro, 1, 9) = ?'
    );
    produtosCmed = registros.reduce((total, r) => total + Number(consulta.get(r).n), 0);
  }
  console.log('\nResumo da coleta:');
  for (const l of relatorio) {
    console.log(
      `- ${l.fonte}: ${l.pdfs} PDFs, ${l.gravadas} bulas gravadas, ${l.sem_mudanca} sem mudança, ${l.sem_registro} sem registro, ` +
        `${l.nao_e_bula} não eram bula, ${l.erros} erros (${l.situacao})`
    );
  }
  if (produtosCmed !== null) console.log(`Produtos da CMED com bula coletada: ${produtosCmed}`);
  for (const db of bancos) db.close();
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  principal().catch((erro) => {
    console.error(erro);
    process.exit(1);
  });
}
