import {
  ItemBuscaFts,
  DetalheMedicamentoCompleto,
  MatrizInteracao,
  ProtocoloClinico,
  ResultadoDosePediatrica,
  ResultadoTfg,
  ResultadoCurb65,
  ResultadoWells,
  CodigoDiagnostico,
  AnalisePrecoMedicamento,
  ApresentacaoCmedResumo,
  BulaAnvisaIndice,
  EstadoFonteAtualizacao,
  ResultadoAtualizacaoBase,
  EstadoCredenciaisAnvisa,
  ResultadoTesteApiAnvisa,
  BulaImportada,
  BulaImportadaResumo,
  PcdtResumo,
  PcdtDetalhe,
} from './types';

import { executarCalculoLocal } from './clinical_fallback';

// Detecta se a aplicação está rodando dentro do WebView nativo do Tauri 2.0
export const isTauri = () => typeof window !== 'undefined' && ('__TAURI_INTERNALS__' in window || '__TAURI__' in window);

// Remove acentos e caixa, como o tokenizador FTS5 'unicode61 remove_diacritics 2' do app nativo
export const normalizarTexto = (texto: string) =>
  texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

async function invokeTauri<T>(cmd: string, args: Record<string, unknown> = {}): Promise<T> {
  const { invoke } = await import('@tauri-apps/api/core');
  return invoke<T>(cmd, args);
}

// -----------------------------------------------------------------------------
// CATÁLOGO COMPLETO DE MEDICAMENTOS (13 Fármacos Comerciais e Bulas Estruturadas)
// -----------------------------------------------------------------------------
export const MOCK_MEDICAMENTOS: Record<number, DetalheMedicamentoCompleto> = {
  1: {
    medicamento: {
      id_medicamento: 1,
      id_principio_ativo: 1,
      numero_registro_anvisa: '1010700030665',
      nome_comercial: 'Amoxil 500mg',
      laboratorio_fabricante: 'Glaxosmithkline Brasil Ltda',
      apresentacao_comercial: 'Cápsula dura 500 mg - Embalagem com 21 cápsulas',
      concentracao_valor: 500.0,
      concentracao_unidade: 'mg',
      forma_farmaceutica: 'capsula',
      tipo_receituario: 'antimicrobiano',
      preco_maximo_consumidor: 130.08,
    },
    principio_ativo: {
      id_principio_ativo: 1,
      nome_dcb: 'Amoxicilina',
      classe_terapeutica: 'Antibacteriano Betalactâmico (Penicilina de Amplo Espectro)',
      categoria_risco_gestacao: 'B',
      compatibilidade_aleitamento: 'Compatível',
      disponivel_rename_sus: 1,
      componente_sus: 'Basico',
    },
    bula: {
      id_bula: 1,
      id_principio_ativo: 1,
      indicacoes_clinicas: 'Infecções respiratórias altas e baixas (faringoamigdalite, sinusite bacteriana, pneumonia adquirida na comunidade), otite média aguda, infecções do trato urinário e profilaxia de endocardite bacteriana.',
      posologia_adulto_padrao: '500 mg a cada 8 horas por via oral ou 875 mg a cada 12 horas por 7 a 10 dias consecutivos.',
      posologia_pediatrica_padrao: '25 a 50 mg/kg/dia fracionado a cada 8 horas. Em otite média aguda: até 90 mg/kg/dia fracionado a cada 12 horas.',
      dose_pediatrica_mg_kg_dia_min: 25.0,
      dose_pediatrica_mg_kg_dia_max: 90.0,
      dose_maxima_diaria_mg: 3000.0,
      ajuste_funcao_renal_json: JSON.stringify([
        { tfg_min: 30.0, tfg_max: 150.0, posologia_recomendada: 'Sem necessidade de ajuste posológico.' },
        { tfg_min: 10.0, tfg_max: 29.9, posologia_recomendada: '250 a 500 mg por via oral a cada 12 horas.' },
        { tfg_min: 0.0, tfg_max: 9.9, posologia_recomendada: '250 a 500 mg por via oral a cada 24 horas.' },
      ]),
      ajuste_funcao_hepatica: 'Não necessita de ajuste de dose inicial.',
      contraindicacoes: 'Hipersensibilidade grave e anafilaxia prévia a penicilinas e cefalosporinas. Histórico de icterícia colestática associada à amoxicilina.',
      eventos_adversos_comuns: 'Diarreia osmótica, náuseas, vômitos, exantema morbiliforme, candidíase de mucosas.',
      guia_diluicao_injetavel_json: null,
    },
  },
  2: {
    medicamento: {
      id_medicamento: 2,
      id_principio_ativo: 1,
      numero_registro_anvisa: '1004307270023',
      nome_comercial: 'Amoxicilina 250mg/5mL Suspensão Oral',
      laboratorio_fabricante: 'Eurofarma Laboratorios S.A.',
      apresentacao_comercial: 'Frasco com pó para preparação de 150 mL (50 mg/mL)',
      concentracao_valor: 50.0,
      concentracao_unidade: 'mg/mL',
      forma_farmaceutica: 'suspensao_oral',
      tipo_receituario: 'antimicrobiano',
      preco_maximo_consumidor: 37.77,
    },
    principio_ativo: {
      id_principio_ativo: 1,
      nome_dcb: 'Amoxicilina',
      classe_terapeutica: 'Antibacteriano Betalactâmico (Penicilina de Amplo Espectro)',
      categoria_risco_gestacao: 'B',
      compatibilidade_aleitamento: 'Compatível',
      disponivel_rename_sus: 1,
      componente_sus: 'Basico',
    },
    bula: {
      id_bula: 1,
      id_principio_ativo: 1,
      indicacoes_clinicas: 'Infecções respiratórias em pediatria, otite média aguda, faringite bacteriana e infecção de partes moles.',
      posologia_adulto_padrao: '500 mg a cada 8 horas.',
      posologia_pediatrica_padrao: '25 a 50 mg/kg/dia fracionado a cada 8 horas (máximo 90 mg/kg/dia em otite média aguda).',
      dose_pediatrica_mg_kg_dia_min: 25.0,
      dose_pediatrica_mg_kg_dia_max: 90.0,
      dose_maxima_diaria_mg: 3000.0,
      ajuste_funcao_renal_json: null,
      ajuste_funcao_hepatica: null,
      contraindicacoes: 'Hipersensibilidade a penicilinas.',
      eventos_adversos_comuns: 'Diarreia, náuseas, exantema cutâneo.',
      guia_diluicao_injetavel_json: null,
    },
  },
  3: {
    medicamento: {
      id_medicamento: 3,
      id_principio_ativo: 2,
      numero_registro_anvisa: '1862000180102',
      nome_comercial: 'Novalgina Gotas 500mg/mL',
      laboratorio_fabricante: 'Opella Healthcare Brazil Ltda',
      apresentacao_comercial: 'Frasco gotejador de 20 mL com 500 mg/mL (1 gota = 25 mg)',
      concentracao_valor: 500.0,
      concentracao_unidade: 'mg/mL',
      forma_farmaceutica: 'solucao_oral',
      tipo_receituario: 'simples',
      preco_maximo_consumidor: 32.44,
    },
    principio_ativo: {
      id_principio_ativo: 2,
      nome_dcb: 'Dipirona Monoidratada',
      classe_terapeutica: 'Analgésico e Antipirético (Derivado Pirazolônico)',
      categoria_risco_gestacao: 'C',
      compatibilidade_aleitamento: 'Criterioso',
      disponivel_rename_sus: 1,
      componente_sus: 'Basico',
    },
    bula: {
      id_bula: 2,
      id_principio_ativo: 2,
      indicacoes_clinicas: 'Dor aguda de intensidade leve a moderada (cefaleia, lombalgia, cólica renal, odontalgia) e controle de febre refratária.',
      posologia_adulto_padrao: '500 mg a 1000 mg (20 a 40 gotas) por via oral a cada 6 horas se dor ou febre (máximo 4000 mg/dia).',
      posologia_pediatrica_padrao: '10 a 15 mg/kg/dose a cada 6 ou 8 horas (aproximadamente 1 gota para cada 2 kg de peso corporal).',
      dose_pediatrica_mg_kg_dia_min: 40.0,
      dose_pediatrica_mg_kg_dia_max: 60.0,
      dose_maxima_diaria_mg: 4000.0,
      ajuste_funcao_renal_json: null,
      ajuste_funcao_hepatica: 'Reduzir doses pela metade em insuficiência hepática descompensada.',
      contraindicacoes: 'Hipersensibilidade a pirazolonas, histórico prévio de agranulocitose medicamentosa, porfiria hepática aguda e deficiência de G6PD.',
      eventos_adversos_comuns: 'Hipotensão transitória (principalmente se injeção rápida), erupções cutâneas e sonolência.',
      guia_diluicao_injetavel_json: null,
    },
  },
  4: {
    medicamento: {
      id_medicamento: 4,
      id_principio_ativo: 2,
      numero_registro_anvisa: '',
      nome_comercial: 'Dipirona Monoidratada 500mg Comprimido',
      laboratorio_fabricante: 'Brainfarma Indústria Química e Farmacêutica S.A.',
      apresentacao_comercial: 'Comprimido simples 500 mg - Blister com 10 unidades',
      concentracao_valor: 500.0,
      concentracao_unidade: 'mg',
      forma_farmaceutica: 'comprimido',
      tipo_receituario: 'simples',
      preco_maximo_consumidor: 0.00,
    },
    principio_ativo: {
      id_principio_ativo: 2,
      nome_dcb: 'Dipirona Monoidratada',
      classe_terapeutica: 'Analgésico e Antipirético (Derivado Pirazolônico)',
      categoria_risco_gestacao: 'C',
      compatibilidade_aleitamento: 'Criterioso',
      disponivel_rename_sus: 1,
      componente_sus: 'Basico',
    },
    bula: {
      id_bula: 2,
      id_principio_ativo: 2,
      indicacoes_clinicas: 'Dor aguda de intensidade leve a moderada e estado febril em adultos e adolescentes.',
      posologia_adulto_padrao: '1 a 2 comprimidos (500 a 1000 mg) por via oral a cada 6 horas (dose máxima diária: 4000 mg).',
      posologia_pediatrica_padrao: 'Não recomendado em comprimidos para crianças menores de 15 anos ou com peso inferior a 53 kg.',
      dose_pediatrica_mg_kg_dia_min: 40.0,
      dose_pediatrica_mg_kg_dia_max: 60.0,
      dose_maxima_diaria_mg: 4000.0,
      ajuste_funcao_renal_json: null,
      ajuste_funcao_hepatica: 'Reduzir posologia em pacientes hepatopatas graves.',
      contraindicacoes: 'Hipersensibilidade conhecida a derivados pirazolônicos, agranulocitose, porfiria e deficiência de G6PD.',
      eventos_adversos_comuns: 'Reações alérgicas cutâneas, prurido, hipotensão e sonolência.',
      guia_diluicao_injetavel_json: null,
    },
  },
  5: {
    medicamento: {
      id_medicamento: 5,
      id_principio_ativo: 3,
      numero_registro_anvisa: '1002900070074',
      nome_comercial: 'Cozaar 50mg',
      laboratorio_fabricante: 'Organon Farmaceutica Ltda.',
      apresentacao_comercial: 'Comprimido revestido 50 mg - Caixa com 30 unidades',
      concentracao_valor: 50.0,
      concentracao_unidade: 'mg',
      forma_farmaceutica: 'comprimido',
      tipo_receituario: 'simples',
      preco_maximo_consumidor: 73.14,
    },
    principio_ativo: {
      id_principio_ativo: 3,
      nome_dcb: 'Losartana Potássica',
      classe_terapeutica: 'Anti-hipertensivo (Antagonista do Receptor de Angiotensina II - BRA)',
      categoria_risco_gestacao: 'D',
      compatibilidade_aleitamento: 'Criterioso',
      disponivel_rename_sus: 1,
      componente_sus: 'Basico',
    },
    bula: {
      id_bula: 3,
      id_principio_ativo: 3,
      indicacoes_clinicas: 'Hipertensão arterial primária essencial, insuficiência cardíaca crônica e proteção renal em nefropatia diabética do diabetes tipo 2.',
      posologia_adulto_padrao: '50 mg por via oral uma vez ao dia pela manhã. Pode ser titulado até 100 mg/dia em dose única ou fracionado a cada 12 horas.',
      posologia_pediatrica_padrao: '0.7 mg/kg uma vez ao dia em crianças maiores de 6 anos com hipertensão (máximo inicial 50 mg/dia).',
      dose_pediatrica_mg_kg_dia_min: 0.7,
      dose_pediatrica_mg_kg_dia_max: 1.4,
      dose_maxima_diaria_mg: 100.0,
      ajuste_funcao_renal_json: JSON.stringify([
        { tfg_min: 30.0, tfg_max: 150.0, posologia_recomendada: 'Sem ajuste de dose inicial.' },
        { tfg_min: 0.0, tfg_max: 29.9, posologia_recomendada: 'Iniciar com 25 mg/dia e monitorar calemia e creatinina.' },
      ]),
      ajuste_funcao_hepatica: 'Iniciar com dose reduzida de 25 mg uma vez ao dia.',
      contraindicacoes: 'Segundo e terceiro trimestres de gestação (toxicidade e morte fetal). Uso concomitante com alisquireno em diabéticos. Associação com IECAs (enalapril).',
      eventos_adversos_comuns: 'Tontura ortostática, hipercalemia, congestão nasal, hipotensão e fadiga.',
      guia_diluicao_injetavel_json: null,
    },
  },
  6: {
    medicamento: {
      id_medicamento: 6,
      id_principio_ativo: 3,
      numero_registro_anvisa: '1004309110041',
      nome_comercial: 'Losartana Potássica 50mg Genérico',
      laboratorio_fabricante: 'Eurofarma Laboratorios S.A.',
      apresentacao_comercial: 'Comprimido revestido 50 mg - Caixa com 30 unidades',
      concentracao_valor: 50.0,
      concentracao_unidade: 'mg',
      forma_farmaceutica: 'comprimido',
      tipo_receituario: 'simples',
      preco_maximo_consumidor: 26.82,
    },
    principio_ativo: {
      id_principio_ativo: 3,
      nome_dcb: 'Losartana Potássica',
      classe_terapeutica: 'Anti-hipertensivo (Antagonista do Receptor de Angiotensina II - BRA)',
      categoria_risco_gestacao: 'D',
      compatibilidade_aleitamento: 'Criterioso',
      disponivel_rename_sus: 1,
      componente_sus: 'Basico',
    },
    bula: {
      id_bula: 3,
      id_principio_ativo: 3,
      indicacoes_clinicas: 'Hipertensão arterial sistêmica e redução de morbimortalidade cardiovascular.',
      posologia_adulto_padrao: '50 mg uma vez ao dia, podendo ser ajustado para 100 mg/dia.',
      posologia_pediatrica_padrao: 'Uso pediátrico sob acompanhamento cardiológico especializado.',
      dose_pediatrica_mg_kg_dia_min: 0.7,
      dose_pediatrica_mg_kg_dia_max: 1.4,
      dose_maxima_diaria_mg: 100.0,
      ajuste_funcao_renal_json: null,
      ajuste_funcao_hepatica: 'Dose inicial de 25 mg em cirrose ou insuficiência hepática.',
      contraindicacoes: 'Gestação (Risco D), hipercalemia grave, duplo bloqueio SRAA.',
      eventos_adversos_comuns: 'Cefaleia, tontura, hipotensão postural.',
      guia_diluicao_injetavel_json: null,
    },
  },
  7: {
    medicamento: {
      id_medicamento: 7,
      id_principio_ativo: 4,
      numero_registro_anvisa: '1002900310504',
      nome_comercial: 'Renitec 10mg',
      laboratorio_fabricante: 'Organon Farmaceutica Ltda.',
      apresentacao_comercial: 'Comprimido sulcado 10 mg - Caixa com 30 unidades',
      concentracao_valor: 10.0,
      concentracao_unidade: 'mg',
      forma_farmaceutica: 'comprimido',
      tipo_receituario: 'simples',
      preco_maximo_consumidor: 28.48,
    },
    principio_ativo: {
      id_principio_ativo: 4,
      nome_dcb: 'Maleato de Enalapril',
      classe_terapeutica: 'Anti-hipertensivo e Vasodilatador (Inibidor da ECA - IECA)',
      categoria_risco_gestacao: 'D',
      compatibilidade_aleitamento: 'Compatível',
      disponivel_rename_sus: 1,
      componente_sus: 'Basico',
    },
    bula: {
      id_bula: 4,
      id_principio_ativo: 4,
      indicacoes_clinicas: 'Todos os graus de hipertensão arterial essencial, insuficiência cardíaca congestiva com fração de ejeção reduzida e prevenção de IC sintomática.',
      posologia_adulto_padrao: '10 a 20 mg por via oral uma vez ao dia pela manhã (dose alvo na IC: 20 mg a cada 12 horas; teto diário 40 mg/dia).',
      posologia_pediatrica_padrao: '0.08 mg/kg uma vez ao dia (máximo inicial 5 mg/dia).',
      dose_pediatrica_mg_kg_dia_min: 0.08,
      dose_pediatrica_mg_kg_dia_max: 0.5,
      dose_maxima_diaria_mg: 40.0,
      ajuste_funcao_renal_json: JSON.stringify([
        { tfg_min: 30.0, tfg_max: 150.0, posologia_recomendada: '5 a 20 mg/dia.' },
        { tfg_min: 10.0, tfg_max: 29.9, posologia_recomendada: 'Iniciar com 2.5 mg/dia; titular cuidadosamente.' },
        { tfg_min: 0.0, tfg_max: 9.9, posologia_recomendada: '2.5 mg nos dias de diálise.' },
      ]),
      ajuste_funcao_hepatica: 'Não necessita de ajuste posológico.',
      contraindicacoes: 'Histórico prévio de angioedema associado a IECA, estenose bilateral de artéria renal, segundo e terceiro trimestres de gestação.',
      eventos_adversos_comuns: 'Tosse seca irritativa intratável mediada por bradicinina (~10% dos pacientes), tontura, cefaleia e hipercalemia.',
      guia_diluicao_injetavel_json: null,
    },
  },
  8: {
    medicamento: {
      id_medicamento: 8,
      id_principio_ativo: 5,
      numero_registro_anvisa: '',
      nome_comercial: 'Losec Mups 20mg',
      laboratorio_fabricante: 'AstraZeneca do Brasil Ltda',
      apresentacao_comercial: 'Comprimido revestido 20 mg - Embalagem com 28 comprimidos',
      concentracao_valor: 20.0,
      concentracao_unidade: 'mg',
      forma_farmaceutica: 'comprimido',
      tipo_receituario: 'simples',
      preco_maximo_consumidor: 0.00,
    },
    principio_ativo: {
      id_principio_ativo: 5,
      nome_dcb: 'Omeprazol',
      classe_terapeutica: 'Antiulceroso (Inibidor da Bomba de Prótons - IBP)',
      categoria_risco_gestacao: 'C',
      compatibilidade_aleitamento: 'Compatível',
      disponivel_rename_sus: 1,
      componente_sus: 'Basico',
    },
    bula: {
      id_bula: 5,
      id_principio_ativo: 5,
      indicacoes_clinicas: 'Úlcera péptica gástrica e duodenal, doença do refluxo gastroesofágico (DRGE), esofagite erosiva, erradicação de Helicobacter pylori e profilaxia de lesão de mucosa por AINEs.',
      posologia_adulto_padrao: '20 mg a 40 mg por via oral uma vez ao dia pela manhã em jejum rigoroso (30 a 60 minutos antes da primeira refeição).',
      posologia_pediatrica_padrao: '0.7 a 1 mg/kg/dia uma vez ao dia pela manhã.',
      dose_pediatrica_mg_kg_dia_min: 0.7,
      dose_pediatrica_mg_kg_dia_max: 2.0,
      dose_maxima_diaria_mg: 80.0,
      ajuste_funcao_renal_json: null,
      ajuste_funcao_hepatica: 'Máximo de 20 mg/dia em cirrose ou insuficiência hepática moderada a grave.',
      contraindicacoes: 'Hipersensibilidade conhecida a benzimidazóis substituídos. Uso concomitante com nelfinavir e rilpivirina.',
      eventos_adversos_comuns: 'Cefaleia, náusea, constipação intestinal, flatulência. Em uso crônico: hipomagnesemia e risco de fraturas osteoporóticas.',
      guia_diluicao_injetavel_json: null,
    },
  },
  9: {
    medicamento: {
      id_medicamento: 9,
      id_principio_ativo: 6,
      numero_registro_anvisa: '1211003590023',
      nome_comercial: 'Zitromax 500mg',
      laboratorio_fabricante: 'Pfizer Brasil Ltda',
      apresentacao_comercial: 'Comprimido revestido 500 mg - Embalagem com 3 comprimidos',
      concentracao_valor: 500.0,
      concentracao_unidade: 'mg',
      forma_farmaceutica: 'comprimido',
      tipo_receituario: 'antimicrobiano',
      preco_maximo_consumidor: 51.07,
    },
    principio_ativo: {
      id_principio_ativo: 6,
      nome_dcb: 'Azitromicina',
      classe_terapeutica: 'Antibacteriano (Macrolídeo Azalídeo)',
      categoria_risco_gestacao: 'B',
      compatibilidade_aleitamento: 'Compatível',
      disponivel_rename_sus: 1,
      componente_sus: 'Basico',
    },
    bula: {
      id_bula: 6,
      id_principio_ativo: 6,
      indicacoes_clinicas: 'Infecções do trato respiratório inferior (pneumonia adquirida na comunidade ambulatorial), infecções de vias aéreas superiores, infecções genitais não complicadas por Chlamydia trachomatis e cancro mole.',
      posologia_adulto_padrao: '500 mg por via oral uma vez ao dia durante 3 a 5 dias (dose cumulativa total: 1500 mg). Em clamídia genital: 1000 mg em dose única.',
      posologia_pediatrica_padrao: '10 mg/kg uma vez ao dia por 3 dias seguidos ou 10 mg/kg no 1º dia seguido de 5 mg/kg/dia do 2º ao 5º dia.',
      dose_pediatrica_mg_kg_dia_min: 10.0,
      dose_pediatrica_mg_kg_dia_max: 12.0,
      dose_maxima_diaria_mg: 500.0,
      ajuste_funcao_renal_json: null,
      ajuste_funcao_hepatica: 'Cautela e monitoramento em pacientes com hepatopatia significativa ativa.',
      contraindicacoes: 'Hipersensibilidade a macrolídeos ou cetolídeos. Histórico de icterícia colestática ou disfunção hepática prévia associada à azitromicina.',
      eventos_adversos_comuns: 'Diarreia aquosa, cólicas abdominais, náuseas, vômitos e prolongamento assintomático do intervalo QT cardíaco.',
      guia_diluicao_injetavel_json: null,
    },
  },
  10: {
    medicamento: {
      id_medicamento: 10,
      id_principio_ativo: 7,
      numero_registro_anvisa: '',
      nome_comercial: 'Levophed 2mg/mL',
      laboratorio_fabricante: 'Pfizer Brasil Ltda',
      apresentacao_comercial: 'Solução injetável estéril 2 mg/mL - Ampola 4 mL',
      concentracao_valor: 2.0,
      concentracao_unidade: 'mg/mL',
      forma_farmaceutica: 'solucao_injetavel',
      tipo_receituario: 'simples',
      preco_maximo_consumidor: 0.00,
    },
    principio_ativo: {
      id_principio_ativo: 7,
      nome_dcb: 'Hemitartarato de Norepinefrina',
      classe_terapeutica: 'Vasopressor e Inotrópico (Agonista Alfa e Beta Adrenérgico)',
      categoria_risco_gestacao: 'C',
      compatibilidade_aleitamento: 'Criterioso',
      disponivel_rename_sus: 1,
      componente_sus: 'Estrategico',
    },
    bula: {
      id_bula: 7,
      id_principio_ativo: 7,
      indicacoes_clinicas: 'Choque séptico refratário a reposição volêmica, choque distributivo e hipotensão aguda crítica com risco de vida.',
      posologia_adulto_padrao: 'Infusão intravenosa contínua em bomba de infusão volumétrica: 0.05 a 0.1 mcg/kg/min inicial, titulada continuamente até alvo de PAM >= 65 mmHg.',
      posologia_pediatrica_padrao: '0.05 a 0.1 mcg/kg/min sob titulação contínua e monitorização hemodinâmica invasiva.',
      dose_pediatrica_mg_kg_dia_min: null,
      dose_pediatrica_mg_kg_dia_max: null,
      dose_maxima_diaria_mg: null,
      ajuste_funcao_renal_json: null,
      ajuste_funcao_hepatica: null,
      contraindicacoes: 'Hipotensão decorrente de hipovolemia não corrigida previamente por volume cristaloide, exceto em emergência extrema como ponte vital.',
      eventos_adversos_comuns: 'Necrose isquêmica periférica por extravasamento tecidual, arritmias ventriculares, taquicardia sinusal e ansiedade intensa.',
      guia_diluicao_injetavel_json: JSON.stringify({
        diluente_compativel: 'Glicose 5% (SG 5%) - Proibido diluir exclusivamente em Soro Fisiológico isolado sem glicose pelo risco de oxidação precoce da catecolamina.',
        volume_recomendado_ml: '4 ampolas (16 mg) diluídas em 234 mL de SG 5% (Concentração final padrão: 0.064 mg/mL ou 64 mcg/mL).',
        tempo_infusao: 'Infusão contínua 24h exclusiva em acesso venoso central (CVC) com bomba de infusão volumétrica.',
        estabilidade_horas: 24,
      }),
    },
  },
  11: {
    medicamento: {
      id_medicamento: 11,
      id_principio_ativo: 8,
      numero_registro_anvisa: '1010001320461',
      nome_comercial: 'Rocefin 1g IV',
      laboratorio_fabricante: 'Produtos Roche Químicos E Farmacêuticos S.A.',
      apresentacao_comercial: 'Frasco-ampola com 1000 mg pó liofilizado + ampola diluente 10 mL',
      concentracao_valor: 1000.0,
      concentracao_unidade: 'mg',
      forma_farmaceutica: 'po_para_solucao_injetavel',
      tipo_receituario: 'antimicrobiano',
      preco_maximo_consumidor: 0.00,
    },
    principio_ativo: {
      id_principio_ativo: 8,
      nome_dcb: 'Ceftriaxona Sódica',
      classe_terapeutica: 'Antibacteriano Parenteral (Cefalosporina de 3ª Geração)',
      categoria_risco_gestacao: 'B',
      compatibilidade_aleitamento: 'Compatível',
      disponivel_rename_sus: 1,
      componente_sus: 'Especializado',
    },
    bula: {
      id_bula: 8,
      id_principio_ativo: 8,
      indicacoes_clinicas: 'Meningite bacteriana aguda, sepse, infecções intra-abdominais complicadas, pielonefrite aguda com critérios de internação e gonorreia urogenital disseminada.',
      posologia_adulto_padrao: '1 g a 2 g por via intravenosa uma vez ao dia (ou a cada 12 horas em meningite bacteriana aguda).',
      posologia_pediatrica_padrao: '50 a 80 mg/kg/dia por via IV em dose única diária (máximo 100 mg/kg/dia em meningite, até 4 g/dia).',
      dose_pediatrica_mg_kg_dia_min: 50.0,
      dose_pediatrica_mg_kg_dia_max: 100.0,
      dose_maxima_diaria_mg: 4000.0,
      ajuste_funcao_renal_json: JSON.stringify([
        { tfg_min: 10.0, tfg_max: 150.0, posologia_recomendada: 'Sem necessidade de ajuste se função hepática preservada.' },
        { tfg_min: 0.0, tfg_max: 9.9, posologia_recomendada: 'Dose máxima de 2 g a cada 24 horas.' },
      ]),
      ajuste_funcao_hepatica: 'Sem ajuste necessário exceto em insuficiência hepatorrenal combinada grave.',
      contraindicacoes: 'Hipersensibilidade grave e anafilaxia prévia a cefalosporinas. Neonatos com hiperbilirrubinemia (risco de encefalopatia por kernicterus). Coadministração com soluções contendo cálcio (incluindo Ringer Lactato) em neonatos devido ao risco de precipitação fatal pulmonar e renal.',
      eventos_adversos_comuns: 'Diarreia por disbiose intestinal, flebite no sítio de infusão venosa, eosinofilia e lama biliar (pseudolitíase reversível).',
      guia_diluicao_injetavel_json: JSON.stringify({
        diluente_compativel: 'Soro Fisiológico 0.9% (SF 0.9%) ou Glicose 5% (SG 5%). Contraindicado diluentes com cálcio.',
        volume_recomendado_ml: 'Reconstituir com 10 mL de água estéril para injeção e diluir em 50 a 100 mL de SF 0.9%.',
        tempo_infusao: 'Infundir por via intravenosa lenta em pelo menos 30 minutos.',
        estabilidade_horas: 24,
      }),
    },
  },
  12: {
    medicamento: {
      id_medicamento: 12,
      id_principio_ativo: 9,
      numero_registro_anvisa: '1008903400031',
      nome_comercial: 'Glifage XR 500mg',
      laboratorio_fabricante: 'Merck S/A',
      apresentacao_comercial: 'Comprimido de liberação prolongada 500 mg - Caixa com 30 comprimidos',
      concentracao_valor: 500.0,
      concentracao_unidade: 'mg',
      forma_farmaceutica: 'comprimido',
      tipo_receituario: 'simples',
      preco_maximo_consumidor: 12.20,
    },
    principio_ativo: {
      id_principio_ativo: 9,
      nome_dcb: 'Cloridrato de Metformina',
      classe_terapeutica: 'Antidiabético Oral (Biguanida Sensibilizadora de Insulina)',
      categoria_risco_gestacao: 'B',
      compatibilidade_aleitamento: 'Compatível',
      disponivel_rename_sus: 1,
      componente_sus: 'Basico',
    },
    bula: {
      id_bula: 9,
      id_principio_ativo: 9,
      indicacoes_clinicas: 'Tratamento farmacológico de primeira escolha do diabetes mellitus tipo 2 em adultos e crianças a partir de 10 anos, pré-diabetes e síndrome dos ovários policísticos (SOP).',
      posologia_adulto_padrao: '500 mg uma vez ao dia junto ao jantar nos primeiros 14 dias; titular gradualmente até 1500 a 2000 mg/dia divididos nas refeições.',
      posologia_pediatrica_padrao: '500 mg uma vez ao dia com refeição a partir dos 10 anos (máximo 2000 mg/dia).',
      dose_pediatrica_mg_kg_dia_min: null,
      dose_pediatrica_mg_kg_dia_max: null,
      dose_maxima_diaria_mg: 2550.0,
      ajuste_funcao_renal_json: JSON.stringify([
        { tfg_min: 60.0, tfg_max: 150.0, posologia_recomendada: 'Dose máxima de 2000 a 2550 mg/dia.' },
        { tfg_min: 45.0, tfg_max: 59.9, posologia_recomendada: 'Dose máxima de 2000 mg/dia. Monitorar função renal a cada 3 a 6 meses.' },
        { tfg_min: 30.0, tfg_max: 44.9, posologia_recomendada: 'Dose máxima de 1000 mg/dia. Não iniciar novos tratamentos nesta faixa.' },
        { tfg_min: 0.0, tfg_max: 29.9, posologia_recomendada: 'CONTRAINDICAÇÃO FORMAL ABSOLUTA pelo risco crítico de acidose lática grave potencialmente fatal.' },
      ]),
      ajuste_funcao_hepatica: 'Contraindicado em insuficiência hepática descompensada devido ao aumento expressivo do risco de acidose lática.',
      contraindicacoes: 'Taxa de Filtração Glomerular (TFG) < 30 mL/min/1.73m², acidose metabólica aguda, cetoacidose diabética, sepse, hipóxia tecidual e realização de exames contrastados com contraste iodado.',
      eventos_adversos_comuns: 'Desconforto gastrointestinal, diarreia aquosa, náuseas, flatulência e gosto metálico na boca. Em uso prolongado (> 4 anos): deficiência de vitamina B12.',
      guia_diluicao_injetavel_json: null,
    },
  },
  13: {
    medicamento: {
      id_medicamento: 13,
      id_principio_ativo: 10,
      numero_registro_anvisa: '',
      nome_comercial: 'Zocor 20mg',
      laboratorio_fabricante: 'Organon Farmacêutica Ltda',
      apresentacao_comercial: 'Comprimido revestido 20 mg - Caixa com 30 unidades',
      concentracao_valor: 20.0,
      concentracao_unidade: 'mg',
      forma_farmaceutica: 'comprimido',
      tipo_receituario: 'simples',
      preco_maximo_consumidor: 0.00,
    },
    principio_ativo: {
      id_principio_ativo: 10,
      nome_dcb: 'Sinvastatina',
      classe_terapeutica: 'Hipolipemiante (Inibidor da HMG-CoA Redutase - Estatina)',
      categoria_risco_gestacao: 'X',
      compatibilidade_aleitamento: 'Contraindicado',
      disponivel_rename_sus: 1,
      componente_sus: 'Basico',
    },
    bula: {
      id_bula: 10,
      id_principio_ativo: 10,
      indicacoes_clinicas: 'Hipercolesterolemia primária, hiperlipidemia mista, prevenção secundária de eventos coronarianos agudos e redução de mortalidade vascular.',
      posologia_adulto_padrao: '20 mg a 40 mg por via oral uma vez ao dia à noite ao deitar (pico de síntese hepática noturna de colesterol).',
      posologia_pediatrica_padrao: '10 mg/dia à noite em crianças > 10 anos com hipercolesterolemia familiar.',
      dose_pediatrica_mg_kg_dia_min: null,
      dose_pediatrica_mg_kg_dia_max: null,
      dose_maxima_diaria_mg: 40.0,
      ajuste_funcao_renal_json: JSON.stringify([
        { tfg_min: 30.0, tfg_max: 150.0, posologia_recomendada: 'Sem necessidade de ajuste.' },
        { tfg_min: 0.0, tfg_max: 29.9, posologia_recomendada: 'Iniciar com 10 mg/dia e monitorar rigorosamente dor muscular.' },
      ]),
      ajuste_funcao_hepatica: 'Contraindicado em hepatopatia ativa ou elevações persistentes e inexplicadas de transaminases > 3x o limite superior da normalidade.',
      contraindicacoes: 'Gestação (Categoria X: teratogenicidade e bloqueio de síntese de esteroides fetais) e aleitamento. Doença hepática ativa. Coadministração com inibidores potentes do CYP3A4 (azitromicina, claritromicina, cetoconazol).',
      eventos_adversos_comuns: 'Mialgia difusa, elevação assintomática de transaminases, cefaleia e epigastralgia. Raro mas severo: rabdomiólise com insuficiência renal mioglobinúrica.',
      guia_diluicao_injetavel_json: null,
    },
  },
};

// -----------------------------------------------------------------------------
// MATRIZ DE INTERAÇÕES MEDICAMENTOSAS (Cruzamento Combinatório)
// -----------------------------------------------------------------------------
export const MOCK_INTERACOES: MatrizInteracao[] = [
  {
    id_interacao: 1,
    id_principio_ativo_a: 3,
    id_principio_ativo_b: 4,
    nome_principio_a: 'Losartana Potássica',
    nome_principio_b: 'Maleato de Enalapril',
    gravidade_interacao: 'Contraindicada',
    efeito_clinico: 'Duplo bloqueio simultâneo do sistema renina-angiotensina-aldosterona (SRAA). Risco crítico de hipercalemia grave refratária, hipotensão precipitante e deterioração acelerada da TFG sem ganhos cardiovasculares.',
    conduta_recomendada: 'Diretrizes (SBC 2020, KDIGO) recomendam não associar IECA e BRA (ONTARGET, VA NEPHRON-D). Manter apenas uma das classes e, se a meta pressórica não for atingida, associar bloqueador dos canais de cálcio (anlodipino) ou diurético tiazídico.',
  },
  {
    id_interacao: 2,
    id_principio_ativo_a: 10,
    id_principio_ativo_b: 6,
    nome_principio_a: 'Sinvastatina',
    nome_principio_b: 'Azitromicina',
    gravidade_interacao: 'Leve',
    efeito_clinico: 'Azitromicina, ao contrário de claritromicina e eritromicina, é inibidora fraca do CYP3A4; há relatos isolados de miopatia/rabdomiólise com sinvastatina, sem aumento relevante e consistente dos níveis séricos.',
    conduta_recomendada: 'Pode-se manter a sinvastatina, orientando suspensão e procura de atendimento se houver dor ou fraqueza muscular. Se o macrolídeo for claritromicina ou eritromicina, suspender a sinvastatina durante o curso.',
  },
  {
    id_interacao: 3,
    id_principio_ativo_a: 4,
    id_principio_ativo_b: 2,
    nome_principio_a: 'Maleato de Enalapril',
    nome_principio_b: 'Dipirona Monoidratada',
    gravidade_interacao: 'Moderada',
    efeito_clinico: 'Inibição de prostaglandinas vasodilatadoras renais atenua o efeito anti-hipertensivo do IECA e aumenta o risco de insuficiência renal aguda funcional.',
    conduta_recomendada: 'Utilizar dipirona na menor dose e menor intervalo de tempo estritamente necessários sob demanda sintomática.',
  },
  {
    id_interacao: 4,
    id_principio_ativo_a: 3,
    id_principio_ativo_b: 2,
    nome_principio_a: 'Losartana Potássica',
    nome_principio_b: 'Dipirona Monoidratada',
    gravidade_interacao: 'Moderada',
    efeito_clinico: 'Antagonismo parcial da resposta vasodilatadora e risco aumentado de retenção hidrossalina em pacientes hipertensos cardiopatas.',
    conduta_recomendada: 'Evitar uso contínuo da dipirona; monitorar a pressão arterial ambulatorialmente.',
  },
  {
    id_interacao: 5,
    id_principio_ativo_a: 7,
    id_principio_ativo_b: 4,
    nome_principio_a: 'Hemitartarato de Norepinefrina',
    nome_principio_b: 'Maleato de Enalapril',
    gravidade_interacao: 'Grave',
    efeito_clinico: 'No choque, o IECA reduz a angiotensina II que sustenta a pressão arterial e a vasoconstrição da arteríola eferente: agrava a hipotensão, aumenta a necessidade de vasopressor e reduz a TFG (risco de lesão renal aguda).',
    conduta_recomendada: 'Suspender imediatamente anti-hipertensivos e IECAs durante choque e instabilidade hemodinâmica.',
  },
];

// -----------------------------------------------------------------------------
// CATÁLOGO COMPLETO DE 45 RECEITAS E PROTOCOLOS CLÍNICOS (SUS E MUNDIAIS)
// -----------------------------------------------------------------------------
import { CATALOGO_PROTOCOLOS } from './catalog_protocolos';
import type { MedicamentoComercialCMED } from './data/catalogo_cmed_nacional';
import type { MonografiaFtn } from './data/formulario_terapeutico';

// A amostra CMED (~2 MB) só é carregada quando a busca ou a tela de bases públicas precisa dela
const carregarCatalogoCmed = () => import('./data/catalogo_cmed_nacional').then((m) => m.CATALOGO_CMED_NACIONAL);
export const MOCK_PROTOCOLOS: ProtocoloClinico[] = CATALOGO_PROTOCOLOS;

// -----------------------------------------------------------------------------
// LISTA DE CÓDIGOS DIAGNÓSTICOS PARA BUSCA (CID-10 e CIAP-2)
// -----------------------------------------------------------------------------
export const MOCK_DIAGNOSTICOS: CodigoDiagnostico[] = [
  { id_diagnostico: 1, codigo_cid10: 'I10', descricao_cid10: 'Hipertensão essencial (primária)', codigo_ciap2: 'K86', descricao_ciap2: 'Hipertensão arterial não complicada' },
  { id_diagnostico: 2, codigo_cid10: 'E11', descricao_cid10: 'Diabetes mellitus não-insulino-dependente', codigo_ciap2: 'T90', descricao_ciap2: 'Diabetes mellitus' },
  { id_diagnostico: 3, codigo_cid10: 'N39.0', descricao_cid10: 'Infecção do trato urinário não especificada', codigo_ciap2: 'U71', descricao_ciap2: 'Cistite / Infecção urinária aguda' },
  { id_diagnostico: 4, codigo_cid10: 'J02.0', descricao_cid10: 'Faringite estreptocócica', codigo_ciap2: 'R74', descricao_ciap2: 'Faringite / Amigdalite aguda' },
  { id_diagnostico: 5, codigo_cid10: 'A90', descricao_cid10: 'Dengue [dengue clássico]', codigo_ciap2: 'A77', descricao_ciap2: 'Dengue e outras arboviroses' },
  { id_diagnostico: 6, codigo_cid10: 'M54.5', descricao_cid10: 'Dor lombar baixa (Lombalgia / Lumbago)', codigo_ciap2: 'L03', descricao_ciap2: 'Sintomas lombares / Lombalgia' },
  { id_diagnostico: 7, codigo_cid10: 'R51', descricao_cid10: 'Cefaleia / Dor de cabeça', codigo_ciap2: 'N01', descricao_ciap2: 'Cefaleia tensional e enxaqueca' },
  { id_diagnostico: 8, codigo_cid10: 'J18.9', descricao_cid10: 'Pneumonia não especificada (PAC)', codigo_ciap2: 'R81', descricao_ciap2: 'Pneumonia comunitária' },
  { id_diagnostico: 9, codigo_cid10: 'K21.9', descricao_cid10: 'Doença do refluxo gastroesofágico sem esofagite', codigo_ciap2: 'D84', descricao_ciap2: 'Doença do esôfago / Refluxo' },
  { id_diagnostico: 10, codigo_cid10: 'E78.0', descricao_cid10: 'Hipercolesterolemia pura (Dislipidemia)', codigo_ciap2: 'T93', descricao_ciap2: 'Dislipidemia e alteração lipídica' },
  { id_diagnostico: 11, codigo_cid10: 'J45.9', descricao_cid10: 'Asma não especificada', codigo_ciap2: 'R96', descricao_ciap2: 'Asma brônquica' },
];

// -----------------------------------------------------------------------------
// FACHADA DE BUSCA MULTIPLATAFORMA (TAURI IPC + FALLBACK DETERMINÍSTICO WEB)
// -----------------------------------------------------------------------------
export async function buscarGeral(termo: string): Promise<ItemBuscaFts[]> {
  if (isTauri()) {
    // No app nativo a busca é do índice FTS5 completo; erros são exibidos, não trocados por base reduzida.
    return invokeTauri<ItemBuscaFts[]>('buscar_geral', { termo });
  }

  const termoNormalizado = normalizarTexto(termo);
  if (!termoNormalizado) return [];

  const resultados: ItemBuscaFts[] = [];

  // 0. Formulário Terapêutico Nacional (posologia oficial do MS), carregado sob demanda
  const { MONOGRAFIAS_FTN } = await import('./data/formulario_terapeutico');
  for (const m of MONOGRAFIAS_FTN) {
    const nome = normalizarTexto(m.nome);
    const nomeBusca = normalizarTexto(m.nome_busca);
    if (nome.includes(termoNormalizado) || nomeBusca.includes(termoNormalizado)) {
      resultados.push({
        tipo_registro: 'ftn_monografia',
        id_referencia: m.id_monografia,
        titulo_primario: m.nome.charAt(0).toUpperCase() + m.nome.slice(1),
        subtitulo: `Formulário Terapêutico Nacional - ${m.apresentacoes.slice(0, 2).join('; ')}`,
        score_relevancia: nomeBusca.startsWith(termoNormalizado) || nome.startsWith(termoNormalizado) ? -6.0 : -4.8,
      });
    }
  }

  // 1. Pesquisa em Medicamentos Comerciais e seus Princípios Ativos (DCB)
  for (const m of Object.values(MOCK_MEDICAMENTOS)) {
    const nomeComercial = normalizarTexto(m.medicamento.nome_comercial);
    const dcb = normalizarTexto(m.principio_ativo.nome_dcb);
    const classe = normalizarTexto(m.principio_ativo.classe_terapeutica);
    const apresentacao = normalizarTexto(m.medicamento.apresentacao_comercial);
    const indicacoes = normalizarTexto(m.bula?.indicacoes_clinicas || '');

    if (
      nomeComercial.includes(termoNormalizado) ||
      dcb.includes(termoNormalizado) ||
      classe.includes(termoNormalizado) ||
      apresentacao.includes(termoNormalizado) ||
      indicacoes.includes(termoNormalizado)
    ) {
      const matchExato = nomeComercial.includes(termoNormalizado) || dcb.includes(termoNormalizado);
      resultados.push({
        tipo_registro: 'medicamento',
        id_referencia: m.medicamento.id_medicamento,
        titulo_primario: m.medicamento.nome_comercial,
        subtitulo: `${m.medicamento.apresentacao_comercial} (${m.principio_ativo.nome_dcb}) - ${m.medicamento.laboratorio_fabricante}`,
        score_relevancia: matchExato ? -5.0 : -2.0,
      });
    }
  }

  // 2. Pesquisa em Protocolos Clínicos e Receituários Oficiais
  for (const p of MOCK_PROTOCOLOS) {
    const titulo = normalizarTexto(p.titulo);
    const cids = normalizarTexto(p.cids_relacionados.join(' '));
    const ciaps = normalizarTexto(p.ciaps_relacionados.join(' '));
    const markdown = normalizarTexto(p.conteudo_markdown);
    const receita = normalizarTexto(p.bloco_prescricao_copiavel);
    const id = normalizarTexto(p.id_protocolo);

    if (
      titulo.includes(termoNormalizado) ||
      id.includes(termoNormalizado) ||
      cids.includes(termoNormalizado) ||
      ciaps.includes(termoNormalizado) ||
      markdown.includes(termoNormalizado) ||
      receita.includes(termoNormalizado)
    ) {
      const matchNoTitulo = titulo.includes(termoNormalizado) || cids.includes(termoNormalizado);
      resultados.push({
        tipo_registro: 'protocolo',
        id_referencia: p.id_protocolo,
        titulo_primario: p.titulo,
        subtitulo: `Receita & Conduta - CIDs: ${p.cids_relacionados.join(', ')}`,
        score_relevancia: matchNoTitulo ? -4.5 : -2.5,
      });
    }
  }

  // 3. Pesquisa em Diagnósticos CIDs e CIAPs
  for (const d of MOCK_DIAGNOSTICOS) {
    const cid = normalizarTexto(d.codigo_cid10);
    const descCid = normalizarTexto(d.descricao_cid10);
    const ciap = normalizarTexto(d.codigo_ciap2);
    const descCiap = normalizarTexto(d.descricao_ciap2);

    if (
      cid.includes(termoNormalizado) ||
      descCid.includes(termoNormalizado) ||
      ciap.includes(termoNormalizado) ||
      descCiap.includes(termoNormalizado)
    ) {
      resultados.push({
        tipo_registro: 'diagnostico',
        id_referencia: d.id_diagnostico,
        titulo_primario: `${d.codigo_cid10} / ${d.codigo_ciap2}`,
        subtitulo: `${d.descricao_cid10} (${d.descricao_ciap2})`,
        score_relevancia: -3.0,
      });
    }
  }

  // 4. PCDT da CONITEC (lista oficial, CIDs e fármacos extraídos dos PDFs), carregados sob demanda
  for (const pcdt of await listarPcdtConitec()) {
    const nome = normalizarTexto(pcdt.titulo);
    const cids = normalizarTexto(pcdt.cids.join(' '));
    const farmacos = normalizarTexto(pcdt.farmacos.map((f) => f.nome).join(' '));
    if (nome.includes(termoNormalizado) || cids.includes(termoNormalizado) || farmacos.includes(termoNormalizado)) {
      const cidsTexto = pcdt.cids.length > 0 ? ` - CIDs: ${pcdt.cids.slice(0, 6).join(', ')}` : '';
      resultados.push({
        tipo_registro: 'pcdt_conitec',
        id_referencia: pcdt.id_pcdt,
        titulo_primario: pcdt.titulo,
        subtitulo: `PCDT CONITEC${cidsTexto}`,
        score_relevancia: nome.includes(termoNormalizado) || cids.includes(termoNormalizado) ? -5.5 : -3.5,
      });
    }
  }

  // 5. Bulas em PDF importadas neste navegador
  for (const bula of await bulasImportadasLocais()) {
    const textos = [bula.nome_produto, bula.registro, ...bula.principios_ativos].map(normalizarTexto);
    if (textos.some((t) => t.includes(termoNormalizado))) {
      resultados.push({
        tipo_registro: 'bula_importada',
        id_referencia: `${bula.registro}:${bula.tipo}`,
        titulo_primario: bula.nome_produto,
        subtitulo: `${bula.tipo === 'profissional' ? 'Bula do profissional' : 'Bula do paciente'} · ${bula.empresa || 'empresa não informada'}`,
        score_relevancia: normalizarTexto(bula.nome_produto).startsWith(termoNormalizado) ? -5.8 : -4.6,
      });
    }
  }

  // 6. Amostra do catálogo CMED disponível offline no navegador (o catálogo completo está no app nativo)
  let encontradosCmed = 0;
  for (const item of await carregarCatalogoCmed()) {
    if (encontradosCmed >= 10) break;
    const nome = normalizarTexto(item.nome_produto);
    const substancia = normalizarTexto(item.substancia);
    if (nome.includes(termoNormalizado) || substancia.includes(termoNormalizado)) {
      encontradosCmed += 1;
      resultados.push({
        tipo_registro: 'cmed_comercial',
        id_referencia: item.id_cmed,
        titulo_primario: `${item.nome_produto} (${item.apresentacao})`,
        subtitulo: `${item.substancia} - ${item.laboratorio}`,
        score_relevancia: nome.startsWith(termoNormalizado) ? -2.0 : -1.0,
      });
    }
  }

  return resultados.sort((a, b) => a.score_relevancia - b.score_relevancia);
}

export async function obterRegistroCmed(idCmed: number): Promise<MedicamentoComercialCMED> {
  if (isTauri()) {
    return invokeTauri<MedicamentoComercialCMED>('obter_registro_cmed', { idCmed });
  }
  const registro = (await carregarCatalogoCmed()).find((item) => item.id_cmed === idCmed);
  if (!registro) {
    throw new Error(`Apresentação CMED ${idCmed} não está na amostra offline do navegador`);
  }
  return registro;
}

export async function obterDetalheMedicamento(idMedicamento: number): Promise<DetalheMedicamentoCompleto> {
  if (isTauri()) {
    return invokeTauri<DetalheMedicamentoCompleto>('obter_detalhe_medicamento', { idMedicamento });
  }

  const med = MOCK_MEDICAMENTOS[idMedicamento];
  if (!med) {
    throw new Error(`Medicamento não localizado para o identificador ${idMedicamento}`);
  }
  return med;
}

export async function verificarInteracoes(idsPrincipiosAtivos: number[]): Promise<MatrizInteracao[]> {
  if (isTauri()) {
    // Em ambiente nativo, falha na checagem de interações deve ser exibida, nunca substituída por base reduzida.
    return invokeTauri<MatrizInteracao[]>('verificar_interacoes', { idsPrincipiosAtivos });
  }

  const resultados: MatrizInteracao[] = [];
  for (let i = 0; i < idsPrincipiosAtivos.length; i++) {
    for (let j = i + 1; j < idsPrincipiosAtivos.length; j++) {
      const idA = idsPrincipiosAtivos[i];
      const idB = idsPrincipiosAtivos[j];
      for (const interacao of MOCK_INTERACOES) {
        if (
          (interacao.id_principio_ativo_a === idA && interacao.id_principio_ativo_b === idB) ||
          (interacao.id_principio_ativo_a === idB && interacao.id_principio_ativo_b === idA)
        ) {
          resultados.push(interacao);
        }
      }
    }
  }

  return resultados.sort((a, b) => {
    const pesos: Record<string, number> = { Contraindicada: 4, Grave: 3, Moderada: 2, Leve: 1 };
    return (pesos[b.gravidade_interacao] || 0) - (pesos[a.gravidade_interacao] || 0);
  });
}

export async function listarProtocolos(): Promise<ProtocoloClinico[]> {
  if (isTauri()) {
    try {
      const lista = await invokeTauri<ProtocoloClinico[]>('listar_protocolos_clinicos');
      if (lista && lista.length > 0) return lista;
    } catch {
      // fallback
    }
  }
  return MOCK_PROTOCOLOS;
}

export async function executarCalculoClinico<T>(tipo: string, parametros: Record<string, unknown>): Promise<T> {
  // No app nativo o cálculo é do motor Rust; uma falha NUNCA cai silenciosamente para outra implementação.
  if (isTauri()) {
    return invokeTauri<T>('executar_calculo_clinico', { tipo, parametros });
  }
  // No navegador/PWA usa-se o porte fiel do motor (validado por tests/paridade_calculos.test.mjs).
  return executarCalculoLocal(tipo, parametros) as T;
}


/** Apresentações comerciais (CMED) para o termo: índice completo no desktop, amostra offline no navegador. */
export async function buscarApresentacoesPreco(termo: string): Promise<ApresentacaoCmedResumo[]> {
  if (!termo.trim()) return [];
  if (isTauri()) {
    const itens = await invokeTauri<ItemBuscaFts[]>('buscar_geral', { termo });
    return itens
      .filter((item) => item.tipo_registro === 'cmed_comercial')
      .map((item) => ({ id_cmed: Number(item.id_referencia), titulo: item.titulo_primario, subtitulo: item.subtitulo }));
  }
  const { buscarApresentacoesLocal } = await import('./pharmacy_pricing');
  return buscarApresentacoesLocal(termo);
}

/** PMC oficial, situação no Farmácia Popular e links de busca de preço de uma apresentação CMED. */
export async function analisarPrecoMedicamento(idCmed: number): Promise<AnalisePrecoMedicamento> {
  if (isTauri()) {
    return invokeTauri<AnalisePrecoMedicamento>('analisar_preco_medicamento', { idCmed });
  }
  const { analisarPrecoLocal } = await import('./pharmacy_pricing');
  return analisarPrecoLocal(idCmed);
}

// -----------------------------------------------------------------------------
// Atualização diária das bases da ANVISA e índice do Bulário (somente no app desktop)
// -----------------------------------------------------------------------------

/** Bula vigente pelo registro; no navegador o índice não é empacotado e a resposta é null. */
export async function consultarBulaAnvisa(numeroRegistro: string): Promise<BulaAnvisaIndice | null> {
  if (!isTauri() || numeroRegistro.replace(/\D/g, '').length < 9) return null;
  return invokeTauri<BulaAnvisaIndice | null>('consultar_bula_anvisa', { numeroRegistro });
}

export async function estadoAtualizacaoBases(): Promise<EstadoFonteAtualizacao[]> {
  if (!isTauri()) return [];
  return invokeTauri<EstadoFonteAtualizacao[]>('estado_atualizacao_bases');
}

export async function atualizarBasesAgora(): Promise<ResultadoAtualizacaoBase[]> {
  if (!isTauri()) throw new Error('A atualização das bases da ANVISA roda no app desktop.');
  return invokeTauri<ResultadoAtualizacaoBase[]>('atualizar_bases_agora');
}

/** Avisa quando o atualizador diário termina (evento `bases-atualizadas` do app desktop). Devolve a função de cancelamento. */
export async function aoAtualizarBases(callback: (resultados: ResultadoAtualizacaoBase[]) => void): Promise<() => void> {
  if (!isTauri()) return () => {};
  const { listen } = await import('@tauri-apps/api/event');
  return listen<ResultadoAtualizacaoBase[]>('bases-atualizadas', (evento) => callback(evento.payload));
}

// -----------------------------------------------------------------------------
// Portal de APIs da ANVISA (Client ID + Client Secret no cofre do sistema; só no app desktop)
// -----------------------------------------------------------------------------

export async function estadoCredenciaisAnvisa(): Promise<EstadoCredenciaisAnvisa | null> {
  if (!isTauri()) return null;
  return invokeTauri<EstadoCredenciaisAnvisa>('estado_credenciais_anvisa');
}

export async function salvarCredenciaisAnvisa(clientId: string, clientSecret: string): Promise<EstadoCredenciaisAnvisa> {
  return invokeTauri<EstadoCredenciaisAnvisa>('salvar_credenciais_anvisa', { clientId, clientSecret });
}

export async function removerCredenciaisAnvisa(): Promise<EstadoCredenciaisAnvisa> {
  return invokeTauri<EstadoCredenciaisAnvisa>('remover_credenciais_anvisa');
}

export async function testarApiAnvisa(): Promise<ResultadoTesteApiAnvisa> {
  return invokeTauri<ResultadoTesteApiAnvisa>('testar_api_anvisa');
}

// -----------------------------------------------------------------------------
// Apresentações comerciais (CMED) de um fármaco do FTN, pelo princípio ativo (sal e associação normalizados)
// -----------------------------------------------------------------------------

let cacheSubstanciasCmed: Promise<string[]> | null = null;

export async function apresentacoesComerciaisDoFarmaco(monografia: MonografiaFtn): Promise<MedicamentoComercialCMED[]> {
  const { chavesMonografia, chaveSubstanciaCmed } = await import('./ligacao_ftn');
  const chaves = new Set(chavesMonografia(monografia.nome));
  const ordenar = (lista: MedicamentoComercialCMED[]) =>
    [...lista].sort((a, b) => a.nome_produto.localeCompare(b.nome_produto) || a.apresentacao.localeCompare(b.apresentacao));
  if (isTauri()) {
    cacheSubstanciasCmed ??= invokeTauri<string[]>('listar_substancias_cmed').catch((erro) => {
      cacheSubstanciasCmed = null;
      throw erro;
    });
    const substancias = (await cacheSubstanciasCmed).filter((s) => chaves.has(chaveSubstanciaCmed(s)));
    if (substancias.length === 0) return [];
    return ordenar(await invokeTauri<MedicamentoComercialCMED[]>('apresentacoes_cmed_por_substancias', { substancias }));
  }
  const { CATALOGO_CMED_NACIONAL } = await import('./data/catalogo_cmed_nacional');
  return ordenar(CATALOGO_CMED_NACIONAL.filter((m) => chaves.has(chaveSubstanciaCmed(m.substancia))));
}

// -----------------------------------------------------------------------------
// Bulas em PDF importadas: banco SQLite no app desktop, IndexedDB no navegador/PWA
// -----------------------------------------------------------------------------

async function bulasImportadasLocais(): Promise<BulaImportada[]> {
  const { lerTodos, LOJA_BULAS } = await import('./armazenamento_local');
  return lerTodos<BulaImportada>(LOJA_BULAS).catch(() => []);
}

const ordemTipoBula = (b: { tipo: string }) => (b.tipo === 'profissional' ? 0 : 1);

export async function salvarBulaImportada(bula: BulaImportada): Promise<BulaImportadaResumo> {
  if (isTauri()) return invokeTauri<BulaImportadaResumo>('salvar_bula_importada', { bula });
  const registro = bula.registro.replace(/\D/g, '').slice(0, 9);
  if (registro.length < 9) throw new Error('A bula precisa do número de registro do produto na ANVISA (9 dígitos).');
  const gravada: BulaImportada = {
    ...bula,
    registro,
    data_importacao: new Date().toISOString().slice(0, 19).replace('T', ' '),
  };
  const { gravar, LOJA_BULAS } = await import('./armazenamento_local');
  await gravar(LOJA_BULAS, gravada);
  return resumoBula(gravada);
}

export async function obterBulasImportadas(numeroRegistro: string): Promise<BulaImportada[]> {
  const registro = numeroRegistro.replace(/\D/g, '').slice(0, 9);
  if (registro.length < 9) return [];
  if (isTauri()) return invokeTauri<BulaImportada[]>('obter_bulas_importadas', { numeroRegistro: registro });
  return (await bulasImportadasLocais()).filter((b) => b.registro === registro).sort((a, b) => ordemTipoBula(a) - ordemTipoBula(b));
}

export async function listarBulasImportadas(): Promise<BulaImportadaResumo[]> {
  if (isTauri()) return invokeTauri<BulaImportadaResumo[]>('listar_bulas_importadas');
  return (await bulasImportadasLocais())
    .map(resumoBula)
    .sort((a, b) => b.data_importacao.localeCompare(a.data_importacao) || a.nome_produto.localeCompare(b.nome_produto));
}

export async function removerBulaImportada(registro: string, tipo: BulaImportada['tipo']): Promise<boolean> {
  if (isTauri()) return invokeTauri<boolean>('remover_bula_importada', { registro, tipo });
  const { remover, LOJA_BULAS } = await import('./armazenamento_local');
  return remover(LOJA_BULAS, [registro, tipo]);
}

function resumoBula(b: BulaImportada): BulaImportadaResumo {
  return {
    registro: b.registro,
    tipo: b.tipo,
    nome_produto: b.nome_produto,
    empresa: b.empresa,
    origem: b.origem,
    data_bula: b.data_bula,
    data_importacao: b.data_importacao,
    total_secoes: b.secoes.length,
  };
}

// -----------------------------------------------------------------------------
// PCDT da CONITEC: banco do app desktop (lista atualizada todo dia) ou resumo empacotado no navegador
// -----------------------------------------------------------------------------

const carregarPcdtEmpacotados = () => import('./data/pcdt_conitec');

export async function listarPcdtConitec(): Promise<PcdtResumo[]> {
  if (isTauri()) return invokeTauri<PcdtResumo[]>('listar_pcdt_conitec');
  const { PCDT_CONITEC } = await carregarPcdtEmpacotados();
  return [...PCDT_CONITEC].sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR'));
}

export async function obterPcdtConitec(idPcdt: number): Promise<PcdtDetalhe | null> {
  if (isTauri()) return invokeTauri<PcdtDetalhe | null>('obter_pcdt_conitec', { idPcdt });
  const { PCDT_CONITEC } = await carregarPcdtEmpacotados();
  const pcdt = PCDT_CONITEC.find((p) => p.id_pcdt === idPcdt);
  if (!pcdt) return null;
  // No navegador só vão os trechos de medicamentos e esquemas (o texto completo fica no banco do desktop)
  const secoes = [
    { chave: 'esquemas', titulo: 'Esquemas de administração', ...pcdt.esquemas },
    { chave: 'medicamentos', titulo: 'Fármacos / medicamentos', ...pcdt.medicamentos },
  ].filter((s) => s.texto);
  return { ...pcdt, secoes };
}
