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

  // Mesmo caso de test_pediatrico_forma_solida_sem_volume (Rust)
  const solido = calcularDosePediatrica(20, 10, null, 2, null);
  assert.equal(solido.dose_por_tomada_mg, 100);
  assert.equal(solido.volume_ml_por_tomada, null);
  assert.equal(solido.numero_gotas_por_tomada, null);
  assert.throws(() => calcularDosePediatrica(20, 10, 0, 2, null), ErroClinico);
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


// Mesmos casos de test_farmacia_popular_confere_substancia_e_dose (Rust)
test('Farmácia Popular confere substância e dose (paridade com o Rust)', async () => {
  const { verificarFarmaciaPopular, extrairQuantidadeUnidades } = await import('../src/farmacia_popular.ts');
  const losartana = verificarFarmaciaPopular('LOSARTANA POTÁSSICA', '50 MG COM REV CT BL AL PLAS OPC X 30');
  assert.equal(losartana.gratuito, true);
  assert.equal(losartana.indicacao, 'Hipertensão');
  const losartana100 = verificarFarmaciaPopular('LOSARTANA POTÁSSICA', '100 MG COM REV CT BL AL PLAS OPC X 50');
  assert.equal(losartana100.gratuito, false);
  assert.equal(losartana100.substancia_no_programa, true);
  assert.equal(verificarFarmaciaPopular('LOSARTANA POTÁSSICA;HIDROCLOROTIAZIDA', '(50 + 12,5) MG COM REV X 30').substancia_no_programa, false);
  assert.equal(verificarFarmaciaPopular('SINVASTATINA', '20 MG COM REV CT BL AL PLAS INC X 30').gratuito, true);
  assert.equal(verificarFarmaciaPopular('LEVONORGESTREL;ETINILESTRADIOL', '(0,15 + 0,03) MG COM CT BL AL PLAS TRANS X 21').gratuito, true);
  assert.equal(verificarFarmaciaPopular('GESTODENO;ETINILESTRADIOL', '(0,075 + 0,03) MG COM X 21').gratuito, false);
  assert.equal(verificarFarmaciaPopular('INSULINA GLARGINA', '100 UI/ML SOL INJ X 3 ML').gratuito, false);
  assert.equal(extrairQuantidadeUnidades('500 MG COM CT BL AL PLAS INC X 30'), 30);
  assert.equal(extrairQuantidadeUnidades('10 MG/ML SOL ORAL CT FR GTS X 20 ML'), 20);
});
test('Produto comercial é ligado à monografia do FTN pelo princípio ativo e pela via', async () => {
  const L = await import('../src/ligacao_ftn.ts');
  const { MONOGRAFIAS_FTN } = await import('../src/data/formulario_terapeutico.ts');
  const nomes = (substancia, apresentacao) => L.monografiasDoProduto(substancia, apresentacao, MONOGRAFIAS_FTN).map((m) => m.nome);

  assert.equal(L.principioAtivoBase('CLORIDRATO DE CIPROFLOXACINO MONOIDRATADO'), 'ciprofloxacino');
  assert.equal(L.principioAtivoBase('cloreto de potássio'), 'cloreto de potassio');
  assert.equal(L.chaveSubstanciaCmed('CLAVULANATO DE POTÁSSIO;AMOXICILINA TRI-HIDRATADA'), 'amoxicilina + clavulanato');
  assert.deepEqual(L.chavesMonografia('midazolam ou cloridrato de midazolam'), ['midazolam']);
  assert.deepEqual(L.chavesMonografia('artesunato de sódio e cloridrato de mefloquina'), ['artesunato de sodio e cloridrato de mefloquina']);

  assert.deepEqual(nomes('AMOXICILINA TRI-HIDRATADA', '500 MG CAP GEL DURA CT BL AL PLAS INC X 21'), ['amoxicilina']);
  assert.deepEqual(nomes('LOSARTANA POTÁSSICA', '50 MG COM REV CT BL AL PLAS OPC X 30'), ['losartana potássica']);
  assert.deepEqual(nomes('CLAVULANATO DE POTÁSSIO;AMOXICILINA TRI-HIDRATADA', '50 MG/ML + 12,5 MG/ML PÓ P/ SUSP ORAL CT FR X 75 ML + COL'), [
    'amoxicilina + clavulanato de potássio',
  ]);
  assert.deepEqual(nomes('OMEPRAZOL', '20 MG CAP DURA LIB RETARD CT BL AL X 28'), ['omeprazol e omeprazol sódico']);
  // Via diferente da descrita no FTN: sem posologia
  assert.deepEqual(nomes('ACETATO DE BETAMETASONA', '0,5 MG/G CREM CT BG AL X 30 G'), []);
  assert.deepEqual(nomes('ACETATO DE PREDNISOLONA', '10 MG/ML SUS OFT CT FR GOT PLAS OPC X 5 ML'), []);
  assert.deepEqual(nomes('DIPIRONA MONOIDRATADA', '500 MG/ML SOL OR CT FR GOT X 20 ML'), []);
  assert.equal(L.viaApresentacaoCmed('1 MG/ML SOL INJ IM/IV/RET CX 50 AMP X 5 ML'), 'injetavel');
  assert.equal(L.viaApresentacaoCmed('263,2 MG COM REV LIB RET BL AL PLAS INC X 30'), 'oral');
  // Associação não recebe a posologia de um componente isolado
  assert.deepEqual(nomes('LOSARTANA POTÁSSICA;HIDROCLOROTIAZIDA', '50 MG + 12,5 MG COM REV X 30'), []);

  assert.equal(
    L.urlBularioAnvisa('1004307270023', 'COZAAR'),
    'https://consultas.anvisa.gov.br/#/bulario/q/?numeroRegistro=100430727'
  );
  assert.equal(L.urlBularioAnvisa('', 'Losec Mups'), 'https://consultas.anvisa.gov.br/#/bulario/q/?nomeProduto=Losec%20Mups');
});

test('Calculadora pediátrica lê os esquemas do FTN de qualquer medicamento sem inventar dose', async () => {
  const P = await import('../src/pediatria_ftn.ts');
  const { MONOGRAFIAS_FTN } = await import('../src/data/formulario_terapeutico.ts');
  const esquema = (texto, extra = {}) => ({
    populacao: 'Crianças', indicacao: '', texto,
    dose_mg_kg_dia_min: null, dose_mg_kg_dia_max: null, fracionamento_diario: null, dose_maxima_diaria_mg: null, ...extra,
  });

  // "a cada N horas" sozinho não define se a dose é por tomada ou diária: o médico escolhe
  assert.deepEqual(P.interpretarEsquemaPediatrico(esquema('20 mg/kg, por via intravenosa, em infusão contínua por 1 hora, a cada 8 horas.')), {
    doseMin: 20, doseMax: 20, modo: null, fracionamento: 3, tetoDiarioMg: null, doseUnica: false,
  });
  // O FTN escreve assim a dose DIÁRIA da amoxicilina + clavulanato: não pode virar 20-90 mg/kg por tomada
  assert.equal(P.interpretarEsquemaPediatrico(esquema('20 a 90 mg/kg de amoxicilina, por via oral, a cada 8 ou 12 horas.')).modo, null);
  assert.equal(P.interpretarEsquemaPediatrico(esquema('10 mg/kg por dose, a cada 6 horas.')).modo, 'tomada');
  // Dose diária dividida
  const diaria = P.interpretarEsquemaPediatrico(esquema('20 a 40 mg/kg/dia, por via oral, divididos em 3 tomadas.'));
  assert.equal(diaria.modo, 'dia');
  assert.equal(diaria.fracionamento, 3);
  assert.equal(diaria.doseMax, 40);
  // Dose única
  const unica = P.interpretarEsquemaPediatrico(esquema('50 mg/kg, por via oral, em dose única, antes do procedimento.'));
  assert.equal(unica.fracionamento, 1);
  assert.equal(unica.doseUnica, true);
  // Infusão contínua, duas doses diferentes e intervalo em faixa não são preenchidos às cegas
  assert.equal(P.interpretarEsquemaPediatrico(esquema('0,1 a 0,2 mg/kg/h em infusão contínua.')), null);
  assert.equal(P.interpretarEsquemaPediatrico(esquema('Ataque: 15 mg/kg; manutenção: 5 mg/kg a cada 12 horas.')), null);
  assert.equal(P.interpretarEsquemaPediatrico(esquema('0,1 mg/kg, por via intravenosa, a cada 2 a 3 horas.')).fracionamento, null);
  // Sem indicação de dia ou tomada: o médico escolhe
  assert.equal(P.interpretarEsquemaPediatrico(esquema('0,2 a 0,4 mg/kg, por bolo intravenoso.')).modo, null);

  // Formulações líquidas do FTN/RENAME com a concentração em mg/mL
  assert.equal(P.mgPorMl('Suspensão oral 250 mg/5 mL'), 50);
  assert.equal(P.mgPorMl('Comprimido 500 mg'), null);
  const ibuprofeno = MONOGRAFIAS_FTN.find((m) => m.nome === 'ibuprofeno');
  assert.equal(P.formulacoesLiquidas(ibuprofeno)[0].mgPorMl, 50);
  assert.equal(P.formulacoesLiquidas(ibuprofeno)[0].origem, 'sus');

  // Associações: concentração do componente em que a dose é dada (amoxicilina), inclusive de produtos comerciais
  assert.equal(P.mgPorMlPrimeiroComponente('(400 + 57) MG/5 ML PO SUS OR CT FR VD AMB X 70 ML + COP'), 80);
  assert.equal(P.mgPorMlPrimeiroComponente('50 MG/ML + 12,5 MG/ML PÓ P/ SUSP ORAL CT FR X 75 ML + COL'), 50);
  assert.equal(P.mgPorMlPrimeiroComponente('(500 + 125) MG COM REV CT BL AL X 21'), null);
  const amoxClav = MONOGRAFIAS_FTN.find((m) => m.nome === 'amoxicilina + clavulanato de potássio');
  const formulas = P.formulacoesLiquidas(amoxClav, [{ nome_produto: 'CLAVULIN BD', apresentacao: '(400 + 57) MG/5 ML PO SUS OR CT FR X 70 ML' }]);
  assert.deepEqual(formulas.map((f) => [f.mgPorMl, f.origem, f.componente]), [[50, 'sus', 'amoxicilina'], [80, 'comercial', 'amoxicilina']]);
  // Muito além da amoxicilina: centenas de fármacos têm esquema pediátrico legível
  const comDose = MONOGRAFIAS_FTN.filter((m) => P.esquemasPediatricos(m).some((e) => P.interpretarEsquemaPediatrico(e)));
  assert.ok(comDose.length > 80, `${comDose.length} fármacos`);
});

test('Disponibilidade no SUS vem da RENAME 2024 lida por tabela', async () => {
  const { MONOGRAFIAS_FTN, ITENS_RENAME_2024 } = await import('../src/data/formulario_terapeutico.ts');
  const L = await import('../src/ligacao_ftn.ts');
  const porNome = (n) => MONOGRAFIAS_FTN.find((m) => m.nome === n);
  // Remédios básicos que a extração antiga deixava "fora do SUS"
  for (const nome of ['cloridrato de metformina', 'succinato de metoprolol ou tartarato de metoprolol', 'cefalexina ou cefalexina monoidratada']) {
    assert.ok(porNome(nome).rename_2024.length > 0, nome);
  }
  assert.ok(MONOGRAFIAS_FTN.filter((m) => m.rename_2024.length > 0).length >= 200);
  // Produto comercial: SUS pelo princípio ativo, com associação conferida inteira
  assert.ok(L.itensRenameDoPrincipio('CLORIDRATO DE METFORMINA', ITENS_RENAME_2024).length >= 2);
  assert.equal(L.itensRenameDoPrincipio('LOSARTANA POTÁSSICA;HIDROCLOROTIAZIDA', ITENS_RENAME_2024).length, 0);
});


test('Dose reversa de infusão e escores CHA2DS2-VA / qSOFA', () => {
  // Dose reversa: 15 mL/h, 70 kg, 0.064 mg/mL -> 0.229 mcg/kg/min
  const rev = executarCalculoLocal('dose_reversa_infusao', { vazao_ml_h: 15, peso_kg: 70, concentracao_mg_ml: 0.064 });
  assert.equal(rev.dose_mcg_kg_min, 0.229);

  // CHA2DS2-VA: 5 pontos (Muito Alto)
  const cha = executarCalculoLocal('cha2ds2_va', {
    insuficiencia_cardiaca: true,
    hipertensao: true,
    idade: 76,
    diabetes: true,
    avc_ou_ait_previo: false,
    doenca_vascular: false,
  });
  assert.equal(cha.pontuacao, 5);
  assert.match(cha.categoria_risco, /Muito Alto/);

  // qSOFA: 2 pontos -> alto risco
  const qs = executarCalculoLocal('qsofa', { fr_maior_22: true, pas_menor_100: true, alteracao_mental: false });
  assert.equal(qs.pontuacao, 2);
  assert.equal(qs.alto_risco_sepse, true);
});

test('Intubação SRI e Parâmetros ARDSNet', () => {
  const sri = executarCalculoLocal('intubacao_sri', {
    peso_kg: 70,
    altura_cm: 175,
    sexo_feminino: false,
    perfil: 'choque_instavel',
  });
  assert.equal(sri.peso_real_kg, 70);
  assert.ok(Math.abs(sri.ventilacao.peso_predito_kg - 70.6) < 0.2);
  assert.equal(sri.ventilacao.volume_corrente_ml, 424);
  assert.equal(sri.checklist_7ps.length, 7);

  const etomidato = sri.farmacos.find((f) => f.nome_farmaco.includes('Etomidato'));
  assert.equal(etomidato.dose_total_mg, 21);
  assert.equal(etomidato.volume_administrar_ml, 10.5);
  assert.equal(etomidato.recomendado_perfil, true);
});

test('Emergência Pediátrica PALS', () => {
  const peds = executarCalculoLocal('emergencia_pediatrica', { peso_kg: 20, idade_anos: 6 });
  assert.equal(peds.tubo_com_cuff_mm, 5.0);
  assert.equal(peds.tubo_sem_cuff_mm, 5.5);
  assert.equal(peds.fixacao_rima_labial_cm, 15.0);
  assert.equal(peds.carga_desfibrilacao_1_j, 40);
  assert.equal(peds.carga_desfibrilacao_2_j, 80);
  assert.equal(peds.adrenalina_pcr_mg, 0.2);
  assert.equal(peds.adrenalina_diluida_1_10000_ml, 2.0);
  assert.equal(peds.expansao_cristaloide_20ml_kg, 400);
});

test('Gasometria Arterial, Figge, Delta-Delta e Adrogué-Madias', () => {
  const gaso = executarCalculoLocal('gasometria', {
    ph: 7.22,
    paco2: 25,
    hco3: 10,
    sodio: 140,
    cloro: 100,
    albumina: 2.0,
    pao2: 80,
    fio2_fracao: 0.21,
  });
  assert.match(gaso.disturbio_primario, /Acidose Metabólica/);
  assert.equal(gaso.anion_gap_bruto, 30);
  assert.equal(gaso.anion_gap_corrigido, 35);
  assert.ok(Math.abs(gaso.delta_delta - 1.64) < 0.02);
  assert.match(gaso.compensacao_respiratoria, /adequada/);

  const sodio = executarCalculoLocal('correcao_sodio', {
    sodio_atual: 115,
    peso_kg: 70,
    sexo_feminino: false,
    idoso: false,
    solucao_meq_l: 513,
  });
  assert.equal(sodio.agua_corporal_total_litros, 42);
  assert.ok(Math.abs(sodio.variacao_sodio_1l - 9.26) < 0.02);
});

test('Segurança Farmacológica 5G (Cascatas, ACB, Triple Whammy, Tisdale, CPIC)', async () => {
  const {
    detectarCascatasPrescricao,
    calcularCargaAnticolinergicaAcb,
    detectarTripleWhammyRenal,
    calcularEscoreTisdaleQtc,
    consultarAlertasFarmacogenomicosCpic,
  } = await import('../src/medication_safety_5g.ts');

  // Cascata
  const cascatas = detectarCascatasPrescricao(['Anlodipino 5mg', 'Furosemida 40mg']);
  assert.equal(cascatas.length, 1);
  assert.match(cascatas[0].efeito_adverso_confundido, /Edema maleolar/);

  // Triple Whammy
  const tw = detectarTripleWhammyRenal(['Losartana 50mg', 'Furosemida 40mg', 'Ibuprofeno 600mg']);
  assert.equal(tw.detectado, true);

  // ACB
  const acb = calcularCargaAnticolinergicaAcb(['Amitriptilina 25mg', 'Oxibutinina 5mg', 'Furosemida 40mg']);
  assert.equal(acb.pontuacao_total, 7);

  // Tisdale
  const tisdale = calcularEscoreTisdaleQtc(['Ondansetrona 8mg', 'Azitromicina 500mg'], 70, false, false, false, false, false);
  assert.equal(tisdale.pontuacao_total, 7);

  // CPIC
  const cpic = consultarAlertasFarmacogenomicosCpic(['Clopidogrel 75mg', 'Sinvastatina 40mg']);
  assert.equal(cpic.length, 2);
});
