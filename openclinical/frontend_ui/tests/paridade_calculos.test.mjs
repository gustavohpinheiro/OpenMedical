// Garante que o porte TypeScript usado no navegador reproduz os casos de referência
// do motor Rust (core_rust/clinical_engine/tests/test_clinical_engine.rs).
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  executarCalculoLocal,
  calcularTfgCkdEpi2021,
  calcularClearanceCockcroftGault,
  calcularVazaoInfusao,
  calcularDosePediatrica,
  ErroClinico,
} from '../src/clinical_fallback.ts';

test('CKD-EPI 2021: mulher saudável e homem idoso', () => {
  assert.equal(calcularTfgCkdEpi2021(0.8, 45, true), 92.54);
  const idoso = calcularTfgCkdEpi2021(1.8, 68, false);
  assert.ok(idoso >= 35 && idoso <= 45, `TFG ${idoso}`);
  assert.ok(Math.abs(calcularTfgCkdEpi2021(1.0, 50, false) - 91.7) < 0.2);
});

test('CKD-EPI 2021 rejeita entradas inválidas como o motor Rust', () => {
  assert.throws(() => calcularTfgCkdEpi2021(0, 40, false), ErroClinico);
  assert.throws(() => calcularTfgCkdEpi2021(1, 16, true), ErroClinico);
  assert.throws(() => executarCalculoLocal('ckd_epi_2021', { creatinina: 'abc', idade: 50, sexo_feminino: false }), ErroClinico);
});

test('Cockcroft-Gault', () => {
  assert.equal(calcularClearanceCockcroftGault(1.0, 70, 50, false), 87.5);
  assert.equal(calcularClearanceCockcroftGault(1.2, 60, 60, true), 47.22);
  assert.throws(() => calcularClearanceCockcroftGault(1, -5, 50, false), ErroClinico);
});

test('Vazão de infusão', () => {
  assert.equal(calcularVazaoInfusao(0.1, 70, 0.064), 6.56);
  assert.throws(() => calcularVazaoInfusao(0.1, 70, 0), ErroClinico);
});

test('Dose pediátrica dentro e acima do teto', () => {
  const ok = calcularDosePediatrica(15, 50, 50, 3, 3000);
  assert.equal(ok.dose_por_tomada_mg, 250);
  assert.equal(ok.volume_ml_por_tomada, 5);
  assert.equal(ok.numero_gotas_por_tomada, 100);
  assert.equal(ok.alerta_teto_ultrapassado, false);

  const acima = calcularDosePediatrica(40, 90, 50, 3, 3000);
  assert.equal(acima.dose_total_calculada_mg_dia, 3600);
  assert.equal(acima.dose_teto_aplicada_mg_dia, 3000);
  assert.equal(acima.alerta_teto_ultrapassado, true);
  assert.throws(() => calcularDosePediatrica(15, 50, 50, 0, null), ErroClinico);
});

test('CURB-65 segue os mesmos estratos do Rust', () => {
  const baixo = executarCalculoLocal('curb65', { idade_maior_65: true });
  assert.equal(baixo.pontuacao, 1);
  assert.match(baixo.estrato_mortalidade, /Baixo risco/);
  const grave = executarCalculoLocal('curb65', { confusao: true, fr_maior_30: true, hipotensao: true, idade_maior_65: true });
  assert.equal(grave.pontuacao, 4);
  assert.match(grave.estrato_mortalidade, /Alto risco/);
});

test('Wells usa os nomes de parâmetros enviados pela interface e 3 faixas', () => {
  // Nomes exatamente como em ClinicalCalculators.tsx / commands.rs
  const moderada = executarCalculoLocal('wells_tep', { sinais_clinicos_tvp: true, fc_maior_100: true });
  assert.equal(moderada.pontuacao_total, 4.5);
  assert.equal(moderada.categoria_risco, 'Moderada probabilidade clínica');

  const alta = executarCalculoLocal('wells_tep', { sinais_clinicos_tvp: true, diagnostico_alternativo_menos_provavel: true, hemoptise: true });
  assert.equal(alta.pontuacao_total, 7);
  assert.equal(alta.categoria_risco, 'Alta probabilidade clínica');

  const imob = executarCalculoLocal('wells_tep', { imobilizacao_ou_cirurgia_recente: true });
  assert.equal(imob.pontuacao_total, 1.5);
  assert.equal(imob.categoria_risco, 'Baixa probabilidade clínica');

  const limite = executarCalculoLocal('wells_tep', { hemoptise: true, malignidade_ativa: true });
  assert.equal(limite.categoria_risco, 'Moderada probabilidade clínica');
});

test('Cálculo desconhecido é rejeitado', () => {
  assert.throws(() => executarCalculoLocal('inexistente', {}), ErroClinico);
});
