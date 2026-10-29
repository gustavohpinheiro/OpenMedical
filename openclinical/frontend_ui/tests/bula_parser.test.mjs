// Separador de seções da bula (src/bula_parser.ts). As bulas da Aché são trechos reais extraídos do PDF publicado
// pelo laboratório (títulos e primeiras linhas de cada seção); a do profissional é fictícia, no formato da RDC 47/2009.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { analisarBula, ErroBula, secoesParaExibicao, textoDaPagina, juntarParagrafos } from '../src/bula_parser.ts';

const fixture = (nome) => readFileSync(new URL(`./fixtures/${nome}`, import.meta.url), 'utf8');
const chaves = (bula) => bula.secoes.map((s) => s.chave);
const secao = (bula, chave) => bula.secoes.find((s) => s.chave === chave)?.texto ?? '';

test('bula do paciente: albendazol (Aché)', () => {
  const bula = analisarBula(fixture('bula_paciente_albendazol_ache.txt'));
  assert.equal(bula.tipo, 'paciente');
  assert.equal(bula.nome_produto, 'albendazol');
  assert.deepEqual(bula.principios_ativos, ['albendazol']);
  assert.equal(bula.registro, '105730574');
  assert.equal(bula.empresa, 'Aché Laboratórios Farmacêuticos S.A.');
  assert.equal(bula.data_aprovacao, '2023-12-18');
  assert.deepEqual(chaves(bula), [
    'indicacoes',
    'como_funciona',
    'contraindicacoes',
    'advertencias',
    'armazenamento',
    'posologia',
    'esquecimento',
    'reacoes_adversas',
    'superdose',
  ]);
  // Título quebrado em duas linhas não sobra no texto da seção
  assert.ok(!secao(bula, 'armazenamento').startsWith('ESTE MEDICAMENTO'), secao(bula, 'armazenamento'));
  // Hifenização do layout é desfeita
  assert.match(secao(bula, 'indicacoes'), /Estudos mostram/);
  assert.match(bula.cabecalho, /Comprimido mastigável de 400 mg/);
});

test('bula do paciente: associação com nome comercial (Pyloripac, Aché)', () => {
  const bula = analisarBula(fixture('bula_paciente_pyloripac_ache.txt'));
  assert.equal(bula.tipo, 'paciente');
  assert.equal(bula.nome_produto, 'PYLORIPAC');
  assert.deepEqual(bula.principios_ativos, ['lansoprazol', 'claritromicina', 'amoxicilina']);
  assert.equal(bula.registro, '105730125');
  assert.equal(bula.data_aprovacao, '2025-04-30');
  assert.equal(bula.secoes.length, 9);
  // Variante "O QUE DEVO FAZER SE ALGUÉM USAR..." com marca de diagramação no meio do título
  assert.match(secao(bula, 'superdose'), /^Se ingerir uma dose muito grande/);
  // Marca de página "Pyloripac_BU01b_VP" não entra no texto
  assert.ok(!bula.secoes.some((s) => s.texto.includes('_BU01b')));
});

test('bula do profissional: seções, registro com apresentação e artefatos de página', () => {
  const bula = analisarBula(fixture('bula_profissional_ficticia.txt'));
  assert.equal(bula.tipo, 'profissional');
  assert.equal(bula.nome_produto, 'EXEMPLOFEN');
  assert.deepEqual(bula.principios_ativos, ['paracetamol']);
  assert.equal(bula.registro, '123456789');
  assert.equal(bula.empresa, 'Laboratório Exemplo Ltda.');
  assert.equal(bula.cnpj, '00.000.000/0001-91');
  assert.equal(bula.data_aprovacao, '2024-03-05');
  assert.equal(bula.secoes.length, 10);
  const posologia = secao(bula, 'posologia');
  assert.equal(
    posologia,
    'Adultos e crianças acima de 12 anos\n' +
      'Comprimidos: 1 comprimido de 500 mg a cada 4 a 6 horas. Não exceder 4.000 mg em 24 horas.\n' +
      'Crianças\n' +
      'Gotas: 10 a 15 mg/kg por dose, a cada 4 a 6 horas, até 5 tomadas ao dia.\n' +
      '- Não ultrapassar 75 mg/kg/dia.'
  );
  assert.match(secao(bula, 'farmacologia'), /A absorção é rápida/);
  assert.ok(!secao(bula, 'superdose').includes('DIZERES'), 'dizeres legais ficam fora da última seção');
  assert.ok(!bula.secoes.some((s) => s.texto.includes('EXEMPLO_BU01')));
  assert.equal(secoesParaExibicao(bula.secoes)[0].chave, 'posologia');
});

test('caixa de aprovação da prova gráfica no meio da página não entra no texto', () => {
  // Linhas reais da prova gráfica publicada em PDF de bula da Aché, no meio de uma frase da posologia
  const caixa = [
    'PH 4543 BU 04a_VP SAP 4183603 04/24',
    'Produto/Product: ALBENDAZOL',
    'Código/Code: SAP 4183603',
    'Dimensional: 140X620 mm',
    'Data/Date: 04/04/2024',
    'Cores/Colors Aprovado por/ Approved by',
    'Preto/Black',
    'O Fornecedor é responsável pela produção na íntegra e de acordo com o PDF aprovado. O Fornecedor não tem autorização de alterar qualquer informação',
    'deste documento. Qualquer divergência ou dúvida entre em contato com a Editoração Gráfica Aché. The Supplier is responsible for production in full and in',
    'accordance with the approved PDF. The Supplier is not authorized to change any information in this document. Please contact us if you have any problem.',
    'E D I T O R A Ç Ã O G R Á F I C A | G R A P H I C P U B L I S H I N G',
    'BU ALBENDAZOL 400MG COMM CL 4183603.indd 1BU ALBENDAZOL 400MG COMM CL 4183603.indd 1 18/04/2024 09:3618/04/2024 09:36',
    'Lidia Alvares de Lima-25/04/2024-14:27hs',
  ].join('\n');
  const texto = fixture('bula_profissional_ficticia.txt').replace(
    'Comprimidos: 1 comprimido de 500 mg a cada 4 a 6 horas. Não exceder',
    `Comprimidos: 1 comprimido de 500 mg a cada 4 a 6 horas. Não\n${caixa}\nexceder`
  );
  const posologia = secao(analisarBula(texto), 'posologia');
  assert.match(posologia, /a cada 4 a 6 horas\. Não exceder 4\.000 mg/);
  assert.doesNotMatch(posologia, /Fornecedor|Supplier|Product|indd|Lidia|E D I T/);
});

test('títulos numerados em caixa mista também são reconhecidos', () => {
  const texto = fixture('bula_profissional_ficticia.txt').replace(/^(\d+\. )([A-ZÀ-Ý ]+)$/gm, (_, n, t) => n + t[0] + t.slice(1).toLowerCase());
  const bula = analisarBula(texto);
  assert.equal(bula.tipo, 'profissional');
  assert.ok(bula.secoes.length >= 9, String(bula.secoes.length));
});

test('PDF que não é bula ou sem texto é recusado com mensagem clara', () => {
  const relatorio = 'Relatório de recomendação da CONITEC.\n'.repeat(5) + 'Texto qualquer sobre avaliação de tecnologias em saúde. '.repeat(20);
  assert.throws(() => analisarBula(relatorio), (e) => e instanceof ErroBula && /não parece uma bula/.test(e.message));
  assert.throws(() => analisarBula('  \n 1 \n 2 \n'), (e) => e instanceof ErroBula && /texto selecionável/.test(e.message));
});

test('linhas do pdf.js: fim de linha e mudança de altura, sem linhas em branco espúrias', () => {
  const itens = [
    { str: '1. INDICAÇÕES', transform: [1, 0, 0, 1, 50, 700], hasEOL: true },
    { str: '', transform: [1, 0, 0, 1, 50, 700], hasEOL: true },
    { str: 'Dor e febre', transform: [1, 0, 0, 1, 50, 688] },
    { str: ' em adultos.', transform: [1, 0, 0, 1, 120, 688] },
    { str: 'Segunda linha', transform: [1, 0, 0, 1, 50, 676] },
  ];
  assert.equal(textoDaPagina(itens), '1. INDICAÇÕES\nDor e febre em adultos.\nSegunda linha');
  assert.equal(juntarParagrafos(['Uma frase que continua', 'na linha seguinte.', '- item']), 'Uma frase que continua na linha seguinte.\n- item');
});
