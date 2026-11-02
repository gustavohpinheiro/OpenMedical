import test from 'node:test';
import assert from 'node:assert/strict';
import {
  classificarTipoReceituario,
  checarAlergiasDoPaciente,
  auditarReceitaCompleta,
} from '../src/clinical_auditor.ts';

test('Classificação Regulatória Sanitária (Portaria 344/98 e RDC 471/2021)', () => {
  // Antimicrobianos (RDC 471/2021)
  assert.equal(classificarTipoReceituario('Amoxicilina 500mg'), 'antimicrobiano');
  assert.equal(classificarTipoReceituario('Ciprofloxacino'), 'antimicrobiano');
  assert.equal(classificarTipoReceituario('Ceftriaxona IV'), 'antimicrobiano');
  assert.equal(classificarTipoReceituario('Azitromicina 500mg'), 'antimicrobiano');

  // Notificação B Azul (Portaria 344/98)
  assert.equal(classificarTipoReceituario('Clonazepam 2mg/mL'), 'notificacao_b_azul');
  assert.equal(classificarTipoReceituario('Diazepam 10mg'), 'notificacao_b_azul');
  assert.equal(classificarTipoReceituario('Zolpidem 10mg'), 'notificacao_b_azul');

  // Notificação A Amarela (Portaria 344/98)
  assert.equal(classificarTipoReceituario('Morfina 10mg'), 'notificacao_a_amarela');
  assert.equal(classificarTipoReceituario('Metilfenidato 10mg'), 'notificacao_a_amarela');

  // Controle Especial C1 Branca em 2 vias (Portaria 344/98)
  assert.equal(classificarTipoReceituario('Sertralina 50mg'), 'controle_especial_c1');
  assert.equal(classificarTipoReceituario('Fluoxetina 20mg'), 'controle_especial_c1');
  assert.equal(classificarTipoReceituario('Carbamazepina 200mg'), 'controle_especial_c1');
  assert.equal(classificarTipoReceituario('Pregabalina 75mg'), 'controle_especial_c1');

  // Receita Simples
  assert.equal(classificarTipoReceituario('Dipirona 500mg'), 'simples');
  assert.equal(classificarTipoReceituario('Losartana Potássica 50mg'), 'simples');
  assert.equal(classificarTipoReceituario('Omeprazol 20mg'), 'simples');
});

test('Detecção de Alergias Diretas e Reatividade Cruzada', () => {
  const pacientePenicilina = {
    id: 'p1',
    nome_completo: 'João Silva',
    cpf: '123.456.789-00',
    data_nascimento: '1980-01-01',
    sexo: 'M',
    telefone: '',
    endereco: '',
    cns: '',
    alergias: ['Penicilina'],
    comorbidades: [],
    criado_em: '',
    atualizado_em: '',
  };

  const blocosPenicilina = [
    {
      id: 'b1',
      tipo: 'medicamento',
      titulo: 'Amoxicilina + Clavulanato',
      conteudo: 'Tomar 1 comp de 8/8h',
      medicamento_detalhe: {
        id: 'm1',
        nome_medicamento: 'Amoxicilina + Clavulanato',
        principio_ativo: 'AMOXICILINA',
        apresentacao: '500mg/125mg',
        posologia: 'Tomar 1 comp de 8/8h',
        quantidade_embalagens: 1,
        tipo_receituario: 'antimicrobiano',
        preco_pmc: 0,
      },
      ordem: 1,
      ativo: true,
    },
  ];

  const alertas = checarAlergiasDoPaciente(blocosPenicilina, pacientePenicilina);
  assert.equal(alertas.length >= 1, true);
  assert.equal(alertas[0].medicamento, 'Amoxicilina + Clavulanato');
  assert.equal(alertas[0].gravidade, 'Critica');
});

test('Auditoria Farmacológica Completa da Receita (Triple Whammy + Alergia)', async () => {
  const paciente = {
    id: 'p2',
    nome_completo: 'Maria Souza',
    cpf: '987.654.321-00',
    data_nascimento: '1950-05-15',
    idade_anos: 74,
    sexo: 'F',
    telefone: '',
    endereco: '',
    cns: '',
    alergias: ['Dipirona'],
    comorbidades: ['Hipertensão'],
    criado_em: '',
    atualizado_em: '',
  };

  const blocosTripleWhammy = [
    {
      id: 'b1',
      tipo: 'medicamento',
      titulo: 'Enalapril 20mg',
      conteudo: 'Tomar 1 comprimido ao dia',
      medicamento_detalhe: {
        id: 'm1',
        nome_medicamento: 'Enalapril',
        principio_ativo: 'ENALAPRIL',
        apresentacao: '20mg',
        posologia: '1x ao dia',
        quantidade_embalagens: 1,
        tipo_receituario: 'simples',
        preco_pmc: 0,
      },
      ordem: 1,
      ativo: true,
    },
    {
      id: 'b2',
      tipo: 'medicamento',
      titulo: 'Hidroclorotiazida 25mg',
      conteudo: 'Tomar 1 comprimido pela manhã',
      medicamento_detalhe: {
        id: 'm2',
        nome_medicamento: 'Hidroclorotiazida',
        principio_ativo: 'HIDROCLOROTIAZIDA',
        apresentacao: '25mg',
        posologia: '1x ao dia',
        quantidade_embalagens: 1,
        tipo_receituario: 'simples',
        preco_pmc: 0,
      },
      ordem: 2,
      ativo: true,
    },
    {
      id: 'b3',
      tipo: 'medicamento',
      titulo: 'Ibuprofeno 600mg',
      conteudo: 'Tomar 1 comprimido de 8 em 8 horas se dor',
      medicamento_detalhe: {
        id: 'm3',
        nome_medicamento: 'Ibuprofeno',
        principio_ativo: 'IBUPROFENO',
        apresentacao: '600mg',
        posologia: '8/8h',
        quantidade_embalagens: 1,
        tipo_receituario: 'simples',
        preco_pmc: 0,
      },
      ordem: 3,
      ativo: true,
    },
    {
      id: 'b4',
      tipo: 'medicamento',
      titulo: 'Novalgina 500mg',
      conteudo: 'Tomar 1 comprimido de 6 em 6 horas',
      medicamento_detalhe: {
        id: 'm4',
        nome_medicamento: 'Novalgina',
        principio_ativo: 'DIPIRONA',
        apresentacao: '500mg',
        posologia: '6/6h',
        quantidade_embalagens: 1,
        tipo_receituario: 'simples',
        preco_pmc: 0,
      },
      ordem: 4,
      ativo: true,
    },
  ];

  const resultado = await auditarReceitaCompleta(blocosTripleWhammy, paciente);
  assert.equal(resultado.possui_risco_grave, true);
  assert.equal(
    resultado.alertas_criticos.some((a) => a.includes('TRIPLE WHAMMY')),
    true
  );
  assert.equal(
    resultado.alertas_criticos.some((a) => a.includes('ALERGIA GRAVE') && a.includes('Novalgina')),
    true
  );
});
