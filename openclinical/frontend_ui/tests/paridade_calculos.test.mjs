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

test('Dengue MS 6ª Edição (Grupos A, B, C, D)', () => {
  const gA = executarCalculoLocal('dengue_ms', { peso_kg: 70, sinais_alarme: false, sinais_choque_ou_sangramento_grave: false, condicao_especial_ou_plaquetopenia: false, idade_anos: 35 });
  assert.equal(gA.grupo, 'A');
  assert.equal(gA.volume_total_dia_ml, 4200);
  assert.equal(gA.volume_sro_ml, 1400);

  const gC = executarCalculoLocal('dengue_ms', { peso_kg: 60, sinais_alarme: true, sinais_choque_ou_sangramento_grave: false, condicao_especial_ou_plaquetopenia: false });
  assert.equal(gC.grupo, 'C');
  assert.equal(gC.fase_expansao_imediata_ml, 600);

  const gD = executarCalculoLocal('dengue_ms', { peso_kg: 80, sinais_alarme: true, sinais_choque_ou_sangramento_grave: true, condicao_especial_ou_plaquetopenia: false });
  assert.equal(gD.grupo, 'D');
  assert.equal(gD.fase_expansao_imediata_ml, 1600);
});

test('Parkland & ATLS 10ª Edição para Queimados', () => {
  const park = executarCalculoLocal('parkland', { peso_kg: 70, percentual_scq: 30, horas_desde_queimadura: 2 });
  assert.equal(park.volume_total_24h_parkland_ml, 8400);
  assert.equal(park.volume_total_24h_atls10_ml, 4200);
  assert.equal(park.volume_primeira_fase_ml, 4200);
  assert.equal(park.horas_primeira_fase, 6);
  assert.equal(park.vazao_primeira_fase_ml_h, 700);
  assert.equal(park.volume_segunda_fase_ml, 4200);
  assert.equal(park.vazao_segunda_fase_ml_h, 262.5);
});

test('Distúrbios Metabólicos CAD & Calemia (Katz, Hillier, Payne)', () => {
  const cad = executarCalculoLocal('metabolico_cad', { sodio_medido: 130, glicemia_mg_dl: 600, potassio_medido: 3.1, calcio_total: 8.0, albumina_g_dl: 2.5 });
  assert.equal(cad.sodio_corrigido_katz, 138);
  assert.equal(cad.sodio_corrigido_hillier, 142);
  assert.equal(cad.alerta_critico_bloqueio_insulina, true);
  assert.match(cad.conduta_insulina_e_potassio, /NÃO INICIAR INSULINA/);
  assert.equal(cad.calcio_corrigido_payne, 9.2);
});

test('FENa & FEUreia com Ressalva de Diurético', () => {
  const res = executarCalculoLocal('fena_feureia', { na_serico: 140, cr_serica: 2.0, ureia_serica: 120, na_urinario: 10, cr_urinaria: 100, ureia_urinaria: 600, usa_diuretico: false });
  assert.ok(res.fena_percentual < 1.0);
  assert.match(res.diagnostico_provavel, /Pré-Renal/);

  const resDiur = executarCalculoLocal('fena_feureia', { na_serico: 140, cr_serica: 2.0, ureia_serica: 120, na_urinario: 50, cr_urinaria: 100, ureia_urinaria: 300, usa_diuretico: true });
  assert.ok(resDiur.ressalva_diuretico !== null);
});

test('PAM & Pressão de Perfusão Cerebral (PPC)', () => {
  const pam = executarCalculoLocal('pam_ppc', { pas_mmhg: 120, pad_mmhg: 80, pic_mmhg: 15 });
  assert.equal(pam.pam_mmhg, 93.3);
  assert.equal(pam.ppc_mmhg, 78.3);
  assert.match(pam.alvo_terapeutico, /PPC/);
});

test('HEART Score para Dor Torácica', () => {
  const baixo = executarCalculoLocal('heart_score', { historia: 0, ecg: 0, idade: 0, fatores_risco: 0, troponina: 0 });
  assert.equal(baixo.pontuacao_total, 0);
  assert.equal(baixo.categoria_risco, 'Baixo Risco');

  const alto = executarCalculoLocal('heart_score', { historia: 2, ecg: 2, idade: 1, fatores_risco: 1, troponina: 2 });
  assert.equal(alto.pontuacao_total, 8);
  assert.equal(alto.categoria_risco, 'Alto Risco');
});

test('HAS-BLED para Risco Hemorrágico', () => {
  const hb = executarCalculoLocal('has_bled', { hipertensao_nao_controlada: true, funcao_renal_anormal: false, funcao_hepatica_anormal: false, avc_previo: true, sangramento_previo: false, inr_labil: false, idade_maior_65: true, uso_antiplaquetarios_ou_aine: true, uso_drogas_ou_alcool: false });
  assert.equal(hb.pontuacao_total, 4);
  assert.match(hb.categoria_risco, /Alto Risco/);
});

test('QTc Corrigido (Bazett, Fridericia, Framingham)', () => {
  const normal = executarCalculoLocal('qtc_corrigido', { qt_medido_ms: 400, fc_bpm: 60, sexo_feminino: false });
  assert.equal(normal.qtc_bazett_ms, 400);
  assert.equal(normal.qtc_fridericia_ms, 400);
  assert.equal(normal.alerta_torsades, false);

  const torsades = executarCalculoLocal('qtc_corrigido', { qt_medido_ms: 500, fc_bpm: 100, sexo_feminino: false });
  assert.equal(torsades.alerta_torsades, true);
});

test('PERC, Wells TVP e Pádua TEV', () => {
  const perc = executarCalculoLocal('perc', { idade_maior_igual_50: false, fc_maior_igual_100: false, sat_o2_ar_ambiente_menor_95: false, hemoptise: false, uso_estrogenio: false, tev_previo: false, cirurgia_trauma_ultimas_4sem: false, edema_unilateral_membro_inferior: false });
  assert.equal(perc.criterios_positivos, 0);
  assert.equal(perc.tep_descartado, true);

  const wells = executarCalculoLocal('wells_tvp', { cancer_ativo: true, edema_panturrilha_maior_3cm: true });
  assert.equal(wells.pontuacao_total, 2);
  assert.match(wells.categoria_probabilidade, /Moderada/);

  const padua = executarCalculoLocal('padua_tev', { cancer_ativo: true, mobilidade_reduzida: true });
  assert.equal(padua.pontuacao_total, 6);
  assert.equal(padua.alto_risco_tev, true);
});

test('Trombólise AVC e Glasgow Pupilar (GCS-P)', () => {
  const avc = executarCalculoLocal('trombolise_avc', { peso_kg: 70 });
  assert.equal(avc.dose_total_alteplase_mg, 63);
  assert.equal(avc.bolus_alteplase_10_porcento_mg, 6.3);
  assert.equal(avc.infusao_alteplase_90_porcento_mg_h, 56.7);
  assert.equal(avc.dose_tenecteplase_mg, 17.5);

  const gp = executarCalculoLocal('glasgow_p', { abertura_ocular: 2, resposta_verbal: 2, resposta_motora: 4, pupilas_sem_resposta_luz: 1 });
  assert.equal(gp.escore_glasgow, 8);
  assert.equal(gp.reacao_pupilar_pontos, 1);
  assert.equal(gp.gcs_p_final, 7);
  assert.equal(gp.indicacao_intubacao, true);
});

test('Canadian CT Head & NEXUS Cervical', () => {
  const cc = executarCalculoLocal('cranio_cervical', { gcs_menor_15_apos_2h: true });
  assert.equal(cc.indicacao_tc_cranio, true);
  assert.equal(cc.criterios_nexus_atendidos, true);
});

test('MELD-Na, Child-Pugh e FIB-4', () => {
  const meld = executarCalculoLocal('meld_na', { creatinina: 2.0, bilirrubina: 3.0, inr: 1.8, sodio: 130, dialise_recente: false });
  assert.ok(meld.score_meld_na > 20);

  const child = executarCalculoLocal('child_pugh', { bilirrubina_mg_dl: 3.5, albumina_g_dl: 2.5, inr: 2.4, grau_ascite: 3, grau_encefalopatia: 2 });
  assert.equal(child.pontuacao_total, 14);
  assert.match(child.classe, /Classe C/);

  const fib = executarCalculoLocal('fib4', { idade_anos: 50, ast_tgo: 80, alt_tgp: 40, plaquetas_milhares: 150 });
  assert.ok(fib.score_fib4 > 3.25);
  assert.match(fib.estratificacao_fibrose, /Alta Probabilidade/);
});

test('Glasgow-Blatchford, BISAP e Alvarado', () => {
  const gbs = executarCalculoLocal('glasgow_blatchford', { ureia_mg_dl: 60, hemoglobina_g_dl: 9, pas_mmhg: 95, fc_bpm: 105, sexo_feminino: false, melena: true, sincope: false, doenca_hepatica: false, insuficiencia_cardiaca: false });
  assert.equal(gbs.pontuacao_total, 15);
  assert.equal(gbs.baixo_risco_ambulatorial, false);

  const bisap = executarCalculoLocal('bisap', { ureia_maior_44: true, glasgow_menor_15: true, sirs_presente: true, idade_maior_60: false, derrame_pleural: false });
  assert.equal(bisap.pontuacao_total, 3);
  assert.equal(bisap.indicacao_uti, true);

  const alv = executarCalculoLocal('alvarado', { dor_fossa_iliaca_direita: true, descompressao_brusca_positiva: true, migracao_da_dor: true, febre_maior_37_3: true, anorexia: true, nauseas_ou_vomitos: true, leucocitose_maior_10000: false, desvio_a_esquerda: false });
  assert.equal(alv.pontuacao_total, 8);
});

test('Corticoides, Antropometria, Centor, Naegele e SOFA Completo', () => {
  const cort = executarCalculoLocal('equivalencia_corticoide', { farmaco_origem: 'Prednisona', dose_origem_mg: 20 });
  const dex = cort.doses_equivalentes.find(d => d.farmaco.includes('Dexametasona'));
  assert.equal(dex.dose_equivalente_mg, 3.0);
  const hid = cort.doses_equivalentes.find(d => d.farmaco.includes('Hidrocortisona'));
  assert.equal(hid.dose_equivalente_mg, 80.0);

  const ant = executarCalculoLocal('antropometria_farmacologica', { peso_kg: 100, altura_cm: 175, sexo_feminino: false });
  assert.equal(ant.peso_ideal_devine_kg, 70.6);
  assert.equal(ant.peso_ajustado_obesidade_kg, 82.3);
  assert.equal(ant.superficie_corporal_mosteller_m2, 2.2);

  const centor = executarCalculoLocal('centor_mcisaac', { idade_anos: 20, febre_maior_38: true, ausencia_de_tosse: true, adenomegalia_cervical_anterior_dolorosa: true, exsudato_amigdaliano: true });
  assert.equal(centor.pontuacao_total, 4);

  const gest = executarCalculoLocal('idade_gestacional_dpp', { dum_ano: 2026, dum_mes: 5, dum_dia: 10, consulta_ano: 2026, consulta_mes: 7, consulta_dia: 15 });
  assert.equal(gest.data_provavel_parto_naegele, '17/02/2027');

  const sofa = executarCalculoLocal('sofa_completo', { pao2_fio2: 150, em_ventilacao_mecanica: true, plaquetas_milhares: 80, bilirrubina: 2.5, pam: 65, dopamina_mcg: 0, noradrenalina_mcg: 0.2, glasgow: 10, creatinina: 2.5, diurese_ml_dia: 800, temp_celsius: 38.5, fc_bpm: 110, fr_irpm: 24, leucocitos_totais: 15000 });
  assert.equal(sofa.sofa_total, 15);
  assert.equal(sofa.sirs_positivo, true);
  assert.match(sofa.conduta_sepse, /Falência de múltiplos órgãos/);
});
