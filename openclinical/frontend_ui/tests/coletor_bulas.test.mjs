// Regras de boa conduta e gravação do coletor de bulas dos laboratórios (scripts/baixar_bulas_laboratorios.mjs).
import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import {
  regrasRobots,
  permitidoPorRobots,
  pareceDesafio,
  gravarBula,
} from '../scripts/baixar_bulas_laboratorios.mjs';

// Trechos dos robots.txt reais levantados em 28/10/2026
const ROBOTS_EUROFARMA = `
User-agent: *
Content-Signal: search=yes,ai-train=no,use=reference
Allow: /

User-agent: ClaudeBot
Disallow: /

User-agent: GPTBot
Disallow: /
`;
const ROBOTS_CIMED = `
User-agent: *
Disallow: /wp-content/plugins/
Disallow: /wp-admin/
Disallow: /?s=
Disallow: */trackback
Allow: /wp-admin/admin-ajax.php
`;

test('robots.txt: grupo "*" quando não há grupo para o OpenClinical; grupos de outros robôs não valem', () => {
  const regras = regrasRobots(ROBOTS_EUROFARMA);
  assert.deepEqual(regras, [{ permitir: true, caminho: '/' }]);
  assert.equal(permitidoPorRobots(regras, 'https://eurofarma.com.br/produtos/bulas/healthcare/pt/bula-x.pdf'), true);
  // Se um dia houver grupo próprio, ele vale no lugar do "*"
  const proprio = regrasRobots(`${ROBOTS_EUROFARMA}\nUser-agent: OpenClinical\nDisallow: /produtos/\n`);
  assert.equal(permitidoPorRobots(proprio, 'https://eurofarma.com.br/produtos/x'), false);
});

test('robots.txt: regra mais específica vence, curingas e query string', () => {
  const regras = regrasRobots(ROBOTS_CIMED);
  assert.equal(permitidoPorRobots(regras, 'https://cimed.com.br/wp-admin/edit.php'), false);
  assert.equal(permitidoPorRobots(regras, 'https://cimed.com.br/wp-admin/admin-ajax.php'), true);
  assert.equal(permitidoPorRobots(regras, 'https://cimed.com.br/?s=dipirona'), false);
  assert.equal(permitidoPorRobots(regras, 'https://cimed.com.br/post/trackback'), false);
  assert.equal(permitidoPorRobots(regras, 'https://cimed.com.br/produtos/'), true);
  assert.equal(permitidoPorRobots([], 'https://qualquer.com/x'), true);
});

test('verificação antirrobô é reconhecida (e a fonte é pulada), página normal com reCAPTCHA não', () => {
  assert.equal(pareceDesafio(200, '<html><script src="/_Incapsula_Resource?SWJIYLWA=1"></script></html>'), true);
  assert.equal(pareceDesafio(403, '<!DOCTYPE html><html><head><title>Just a moment...</title>'), true);
  assert.equal(pareceDesafio(503, '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js">'), true);
  assert.equal(pareceDesafio(200, '<html><script src="https://www.google.com/recaptcha/api.js"></script><a href="x.pdf">'), false);
  assert.equal(pareceDesafio(200, '[{"id":1,"bula":"https://x/bula.pdf"}]'), false);
});

test('gravação: mesmo esquema do app desktop, regravar substitui e a busca encontra', () => {
  const db = new DatabaseSync(':memory:');
  const bula = {
    registro: '105730574',
    tipo: 'paciente',
    nome_produto: 'albendazol',
    principios_ativos: ['albendazol'],
    empresa: 'Aché Laboratórios Farmacêuticos S.A.',
    cnpj: '',
    data_bula: '2023-12-18',
    origem: 'laboratorio:ache',
    url_origem: 'https://www.ache.com.br/wp-content/uploads/application/pdf/bula-paciente-albendazol-comprimidos.pdf',
    hash_arquivo: 'a',
    cabecalho: '',
    secoes: [{ chave: 'posologia', titulo: 'Como devo usar este medicamento?', texto: '400 mg em dose única para ascaridíase.' }],
  };
  gravarBula(db, bula);
  gravarBula(db, { ...bula, hash_arquivo: 'b' });
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM bulas_importadas').get().n, 1);
  assert.equal(db.prepare('SELECT hash_arquivo FROM bulas_importadas').get().hash_arquivo, 'b');
  const achados = db.prepare("SELECT id_referencia FROM indice_busca_fts WHERE indice_busca_fts MATCH 'ascaridiase'").all();
  assert.deepEqual(achados.map((r) => r.id_referencia), ['105730574:paciente']);
});
