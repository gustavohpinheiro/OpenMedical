import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CLASSES_ALERGICAS_CLINICAS,
  buscarSugestoesMedicamentos,
} from '../src/medication_autocomplete_service.ts';

test('Autocompletar de Alergias: modoAlergia retorna classes essenciais em input vazio', async () => {
  const sugestoes = await buscarSugestoesMedicamentos('', { modoAlergia: true });
  assert.ok(sugestoes.length > 0, 'Deve retornar classes alérgicas prioritárias');
  assert.equal(sugestoes[0].tipo, 'classe_alergica');
  assert.ok(
    sugestoes.some((s) => s.nome.toLowerCase().includes('penicilina')),
    'Deve incluir Penicilinas'
  );
});

test('Autocompletar de Alergias: busca por termo de classe e mecanismo de reatividade cruzada', async () => {
  // Busca por 'aine'
  const resultadoAine = await buscarSugestoesMedicamentos('aine', { modoAlergia: true });
  assert.ok(resultadoAine.length > 0);
  assert.ok(
    resultadoAine.some((s) => s.nome.includes('AINEs')),
    'Deve encontrar AINEs'
  );

  // Busca por 'dipirona' em modoAlergia
  const resultadoDipi = await buscarSugestoesMedicamentos('dipirona', { modoAlergia: true });
  assert.ok(resultadoDipi.length > 0);
  // Primeira sugestão deve ser a classe alérgica de pirazolonas
  assert.equal(resultadoDipi[0].tipo, 'classe_alergica');
  assert.ok(resultadoDipi[0].nome.includes('Dipirona'));
});

test('Autocompletar de Medicamentos: busca de princípio ativo no FTN', async () => {
  const resultados = await buscarSugestoesMedicamentos('amoxicilina', { modoAlergia: false });
  assert.ok(resultados.length > 0);
  const amox = resultados.find((s) => s.nome.toLowerCase().includes('amoxicilina'));
  assert.ok(amox, 'Deve encontrar Amoxicilina no FTN');
  assert.equal(amox.detalhes?.tipo_receituario, 'antimicrobiano');
  assert.ok(amox.detalhes?.posologia);
});

test('Autocompletar de Medicamentos: marcas comerciais frequentes', async () => {
  const resultadosNovalgina = await buscarSugestoesMedicamentos('novalgina');
  assert.ok(resultadosNovalgina.length > 0);
  const novalgina = resultadosNovalgina.find((s) => s.nome === 'Novalgina');
  assert.ok(novalgina, 'Deve encontrar Novalgina nas marcas comerciais');
  assert.equal(novalgina.tipo, 'comercial');
  assert.equal(novalgina.detalhes?.principio_ativo, 'DIPIRONA');

  const resultadosGlifage = await buscarSugestoesMedicamentos('glifage');
  assert.ok(resultadosGlifage.length > 0);
  const glifage = resultadosGlifage.find((s) => s.nome === 'Glifage');
  assert.ok(glifage, 'Deve encontrar Glifage nas marcas comerciais');
  assert.equal(glifage.tipo, 'comercial');
  assert.equal(glifage.detalhes?.principio_ativo, 'METFORMINA');
});

test('Base de Classes Alérgicas cobre 17 entidades clínicas críticas', () => {
  assert.equal(CLASSES_ALERGICAS_CLINICAS.length, 17);
  const nomes = CLASSES_ALERGICAS_CLINICAS.map((c) => c.nome);
  assert.ok(nomes.some((n) => n.includes('Penicilinas')));
  assert.ok(nomes.some((n) => n.includes('Cefalosporinas')));
  assert.ok(nomes.some((n) => n.includes('AINEs')));
  assert.ok(nomes.some((n) => n.includes('Sulfas')));
  assert.ok(nomes.some((n) => n.includes('Opioides')));
  assert.ok(nomes.some((n) => n.includes('Contrastes Iodados')));
  assert.ok(nomes.some((n) => n.includes('Látex')));
});
