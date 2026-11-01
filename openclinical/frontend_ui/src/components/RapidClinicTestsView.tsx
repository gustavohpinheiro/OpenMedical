import React, { useState, useMemo } from 'react';
import {
  Activity,
  Brain,
  Smile,
  AlertCircle,
  FileText,
  Download,
  Copy,
  Plus,
  Check,
  ChevronRight,
  ExternalLink,
  BookOpen,
  HelpCircle,
  Clock,
  ShieldCheck,
  User,
} from 'lucide-react';
import {
  PerfilMedico,
  Paciente,
  RelatorioTesteRealizado,
} from '../types';
import {
  obterPerfilMedicoAtivo,
  obterPacienteAtivo,
  adicionarItemPrescricaoModular,
  salvarRelatorioTeste,
} from '../storage_clinico';
import { exportarRelatorioTesteEmPdf } from '../pdf_generator';

interface TesteClinicoConfig {
  id: string;
  nome: string;
  sigla: string;
  area: string;
  tempo: string;
  descricao: string;
  fonte: {
    autores: string;
    ano: number;
    titulo: string;
    veiculo: string;
    diretriz_nacional: string;
  };
  pontuacao_maxima: number;
  questoes: {
    id: string;
    enunciado: string;
    opcoes: { rotulo: string; pontos: number }[];
  }[];
  avaliar: (respostas: Record<string, number>, paciente?: Paciente | null) => {
    score: number;
    resultado: string;
    gravidade: 'normal' | 'alerta' | 'grave';
    interpretacao: string;
    conduta: string;
    sugestaoPrescricao?: {
      titulo: string;
      texto: string;
    };
  };
}

export const LISTA_TESTES_CLINICOS: TesteClinicoConfig[] = [
  // ---------------------------------------------------------------------------
  // 1. MEEM - Mini-Exame do Estado Mental
  // ---------------------------------------------------------------------------
  {
    id: 'meem',
    nome: 'Mini-Exame do Estado Mental (MEEM / Folstein)',
    sigla: 'MEEM',
    area: 'Neurologia & Geriatria',
    tempo: '5-10 min',
    descricao:
      'Padrão-ouro para rastreamento de déficit cognitivo e demência em idosos com pontos de corte adaptados para a população brasileira por nível de escolaridade.',
    fonte: {
      autores: 'Folstein MF, Folstein SE, McHugh PR; Brucki SMD, Nitrini R, et al.',
      ano: 2003,
      titulo: 'Sugestões para o uso do mini-exame do estado mental no Brasil',
      veiculo: 'Arquivos de Neuro-Psiquiatria, 61(3B):777-781 (1975/2003)',
      diretriz_nacional: 'Academia Brasileira de Neurologia (ABN) & Portaria MS/PCDT Demência',
    },
    pontuacao_maxima: 30,
    questoes: [
      {
        id: 'meem_1',
        enunciado: '1. Orientação Temporal (Ano, Estação, Mês, Dia do mês, Dia da semana)',
        opcoes: [
          { rotulo: '0 acertos', pontos: 0 },
          { rotulo: '1 acerto', pontos: 1 },
          { rotulo: '2 acertos', pontos: 2 },
          { rotulo: '3 acertos', pontos: 3 },
          { rotulo: '4 acertos', pontos: 4 },
          { rotulo: '5 acertos (Completo)', pontos: 5 },
        ],
      },
      {
        id: 'meem_2',
        enunciado: '2. Orientação Espacial (Estado, Cidade, Bairro, Hospital/Clínica, Andar/Sala)',
        opcoes: [
          { rotulo: '0 acertos', pontos: 0 },
          { rotulo: '1 acerto', pontos: 1 },
          { rotulo: '2 acertos', pontos: 2 },
          { rotulo: '3 acertos', pontos: 3 },
          { rotulo: '4 acertos', pontos: 4 },
          { rotulo: '5 acertos (Completo)', pontos: 5 },
        ],
      },
      {
        id: 'meem_3',
        enunciado: '3. Registro Imediato de Memória (Repetir 3 palavras: Carro, Vaso, Tijolo)',
        opcoes: [
          { rotulo: 'Nenhuma palavra', pontos: 0 },
          { rotulo: '1 palavra', pontos: 1 },
          { rotulo: '2 palavras', pontos: 2 },
          { rotulo: '3 palavras (Todas)', pontos: 3 },
        ],
      },
      {
        id: 'meem_4',
        enunciado: '4. Atenção e Cálculo (Subtrair 7 de 100 consecutivamente 5 vezes: 93, 86, 79, 72, 65)',
        opcoes: [
          { rotulo: '0 acertos', pontos: 0 },
          { rotulo: '1 acerto', pontos: 1 },
          { rotulo: '2 acertos', pontos: 2 },
          { rotulo: '3 acertos', pontos: 3 },
          { rotulo: '4 acertos', pontos: 4 },
          { rotulo: '5 acertos (Perfeito)', pontos: 5 },
        ],
      },
      {
        id: 'meem_5',
        enunciado: '5. Memória de Evocação Tardia (Lembrar as 3 palavras mencionadas anteriormente)',
        opcoes: [
          { rotulo: '0 palavras lembradas', pontos: 0 },
          { rotulo: '1 palavra lembrada', pontos: 1 },
          { rotulo: '2 palavras lembradas', pontos: 2 },
          { rotulo: '3 palavras lembradas', pontos: 3 },
        ],
      },
      {
        id: 'meem_6',
        enunciado: '6. Linguagem: Nomear dois objetos (Relógio de pulso e Caneta)',
        opcoes: [
          { rotulo: '0 acertos', pontos: 0 },
          { rotulo: '1 acerto', pontos: 1 },
          { rotulo: '2 acertos (Ambos)', pontos: 2 },
        ],
      },
      {
        id: 'meem_7',
        enunciado: '7. Repetição da frase ("Nem aqui, nem ali, nem lá")',
        opcoes: [
          { rotulo: 'Incorreta', pontos: 0 },
          { rotulo: 'Correta na primeira tentativa', pontos: 1 },
        ],
      },
      {
        id: 'meem_8',
        enunciado: '8. Comando de Três Estágios ("Pegue este papel com a mão direita, dobre ao meio e coloque na mesa")',
        opcoes: [
          { rotulo: '0 estágios', pontos: 0 },
          { rotulo: '1 estágio', pontos: 1 },
          { rotulo: '2 estágios', pontos: 2 },
          { rotulo: '3 estágios cumpridos', pontos: 3 },
        ],
      },
      {
        id: 'meem_9',
        enunciado: '9. Leitura e Execução ("Feche os olhos") e Redação de uma frase com sentido',
        opcoes: [
          { rotulo: '0 acertos', pontos: 0 },
          { rotulo: '1 acerto', pontos: 1 },
          { rotulo: '2 acertos (Ambos)', pontos: 2 },
        ],
      },
      {
        id: 'meem_10',
        enunciado: '10. Cópia de Desenho (Pentágonos sobrepostos com intersecção de 4 lados)',
        opcoes: [
          { rotulo: 'Desenho incorreto / sem intersecção', pontos: 0 },
          { rotulo: 'Desenho correto com intersecção precisa', pontos: 1 },
        ],
      },
    ],
    avaliar: (respostas) => {
      const score = Object.values(respostas).reduce((a, b) => a + b, 0);
      let gravidade: 'normal' | 'alerta' | 'grave' = 'normal';
      let resultado = 'Desempenho Cognitivo Preservado';
      let conduta =
        'Manter acompanhamento clínico habitual. Estimular atividades cognitivas e sociais.';

      if (score < 20) {
        gravidade = 'grave';
        resultado = 'Declínio Cognitivo Severo / Sugestivo de Demência';
        conduta =
          'Investigação diagnóstica para causas reversíveis (TSH, Vit B12, Sífilis, TC/RM de Crânio). Avaliar início de inibidores da colinesterase conforme PCDT Demência e encaminhamento para neurologista/geriatra.';
      } else if (score < 25) {
        gravidade = 'alerta';
        resultado = 'Declínio Cognitivo Leve a Moderado';
        conduta =
          'Triagem complementar com Teste do Desenho do Relógio, dosagem de vitamina B12, TSH e avaliação funcional (Katz e Lawton). Avaliar revisão de fármacos com carga anticolinérgica.';
      }

      return {
        score,
        resultado,
        gravidade,
        interpretacao: `Pontuação total de ${score} de 30 pontos. De acordo com Brucki et al. (ABN), a linha de corte varia de 20 pontos para analfabetos a 27 pontos para escolaridade superior.`,
        conduta,
        sugestaoPrescricao: {
          titulo: 'Conduta Investigativa - Déficit Cognitivo',
          texto:
            '• Solicitar exames laboratoriais de triagem metabólica: TSH, T4 Livre, Vitamina B12, Ácido Fólico, VDRL, Creatinina, Eletrólitos.\n• Solicitar Ressonância Magnética de Encéfalo ou TC de Crânio sem contraste.\n• Suspender medicações sedativas ou de alta carga anticolinérgica.',
        },
      };
    },
  },

  // ---------------------------------------------------------------------------
  // 2. PHQ-9 - Patient Health Questionnaire (Depressão Maior)
  // ---------------------------------------------------------------------------
  {
    id: 'phq9',
    nome: 'Questionário de Saúde do Paciente (PHQ-9 - Depressão)',
    sigla: 'PHQ-9',
    area: 'Saúde Mental & Psiquiatria',
    tempo: '3 min',
    descricao:
      'Instrumento validado internacionalmente para triagem, diagnóstico e mensuração de gravidade do Episódio Depressivo Maior (critérios DSM-5).',
    fonte: {
      autores: 'Kroenke K, Spitzer RL, Williams JB.',
      ano: 2001,
      titulo: 'The PHQ-9: validity of a brief depression severity measure',
      veiculo: 'Journal of General Internal Medicine, 16(9):606-613 (2001)',
      diretriz_nacional: 'Ministério da Saúde - Linha de Cuidado do Transtorno Depressivo / OMS mhGAP',
    },
    pontuacao_maxima: 27,
    questoes: [
      {
        id: 'phq_1',
        enunciado: '1. Pouco interesse ou pouco prazer em fazer as coisas habitual',
        opcoes: [
          { rotulo: 'Nenhum dia (0)', pontos: 0 },
          { rotulo: 'Vários dias (1)', pontos: 1 },
          { rotulo: 'Mais da metade dos dias (2)', pontos: 2 },
          { rotulo: 'Quase todos os dias (3)', pontos: 3 },
        ],
      },
      {
        id: 'phq_2',
        enunciado: '2. Sentir-se para baixo, deprimido(a) ou sem perspectiva',
        opcoes: [
          { rotulo: 'Nenhum dia (0)', pontos: 0 },
          { rotulo: 'Vários dias (1)', pontos: 1 },
          { rotulo: 'Mais da metade dos dias (2)', pontos: 2 },
          { rotulo: 'Quase todos os dias (3)', pontos: 3 },
        ],
      },
      {
        id: 'phq_3',
        enunciado: '3. Dificuldade para pegar no sono, acordar no meio da noite ou dormir demais',
        opcoes: [
          { rotulo: 'Nenhum dia (0)', pontos: 0 },
          { rotulo: 'Vários dias (1)', pontos: 1 },
          { rotulo: 'Mais da metade dos dias (2)', pontos: 2 },
          { rotulo: 'Quase todos os dias (3)', pontos: 3 },
        ],
      },
      {
        id: 'phq_4',
        enunciado: '4. Sentir-se cansado(a) ou com pouca energia física',
        opcoes: [
          { rotulo: 'Nenhum dia (0)', pontos: 0 },
          { rotulo: 'Vários dias (1)', pontos: 1 },
          { rotulo: 'Mais da metade dos dias (2)', pontos: 2 },
          { rotulo: 'Quase todos os dias (3)', pontos: 3 },
        ],
      },
      {
        id: 'phq_5',
        enunciado: '5. Pouco apetite ou comer em excesso',
        opcoes: [
          { rotulo: 'Nenhum dia (0)', pontos: 0 },
          { rotulo: 'Vários dias (1)', pontos: 1 },
          { rotulo: 'Mais da metade dos dias (2)', pontos: 2 },
          { rotulo: 'Quase todos os dias (3)', pontos: 3 },
        ],
      },
      {
        id: 'phq_6',
        enunciado: '6. Sentir-se mal consigo mesmo(a) ou que decepcionou a família',
        opcoes: [
          { rotulo: 'Nenhum dia (0)', pontos: 0 },
          { rotulo: 'Vários dias (1)', pontos: 1 },
          { rotulo: 'Mais da metade dos dias (2)', pontos: 2 },
          { rotulo: 'Quase todos os dias (3)', pontos: 3 },
        ],
      },
      {
        id: 'phq_7',
        enunciado: '7. Dificuldade de concentração (ler jornal, assistir TV, trabalhar)',
        opcoes: [
          { rotulo: 'Nenhum dia (0)', pontos: 0 },
          { rotulo: 'Vários dias (1)', pontos: 1 },
          { rotulo: 'Mais da metade dos dias (2)', pontos: 2 },
          { rotulo: 'Quase todos os dias (3)', pontos: 3 },
        ],
      },
      {
        id: 'phq_8',
        enunciado: '8. Lentidão física ou agitação motora evidente percebida pelos outros',
        opcoes: [
          { rotulo: 'Nenhum dia (0)', pontos: 0 },
          { rotulo: 'Vários dias (1)', pontos: 1 },
          { rotulo: 'Mais da metade dos dias (2)', pontos: 2 },
          { rotulo: 'Quase todos os dias (3)', pontos: 3 },
        ],
      },
      {
        id: 'phq_9',
        enunciado: '9. Pensamentos de que seria melhor estar morto(a) ou de se machucar',
        opcoes: [
          { rotulo: 'Nenhum dia (0)', pontos: 0 },
          { rotulo: 'Vários dias (1) ⚠️', pontos: 1 },
          { rotulo: 'Mais da metade dos dias (2) ⚠️', pontos: 2 },
          { rotulo: 'Quase todos os dias (3) 🚨', pontos: 3 },
        ],
      },
    ],
    avaliar: (respostas) => {
      const score = Object.values(respostas).reduce((a, b) => a + b, 0);
      const ideacaoSuicida = (respostas['phq_9'] || 0) > 0;

      let gravidade: 'normal' | 'alerta' | 'grave' = 'normal';
      let resultado = 'Sintomas Mínimos / Ausência de Depressão';
      let conduta = 'Reforço de hábitos de vida saudáveis, sono regular e reavaliação se necessário.';

      if (ideacaoSuicida || score >= 20) {
        gravidade = 'grave';
        resultado = ideacaoSuicida
          ? 'Depressão Grave com Risco de Ideação Suicida Ativa'
          : 'Depressão Severa (Score 20-27)';
        conduta =
          'Avaliação psiquiátrica urgente ou suporte de crise. Início imediato de farmacoterapia antidepressiva (ISRS de 1ª linha como Sertralina ou Escitalopram) associada à psicoterapia intensiva e plano de segurança.';
      } else if (score >= 15) {
        gravidade = 'grave';
        resultado = 'Depressão Moderadamente Grave (Score 15-19)';
        conduta =
          'Indicação formal de farmacoterapia antidepressiva combinada à psicoterapia estruturada (TCC). Retorno em 15 a 21 dias para avaliar resposta e tolerabilidade.';
      } else if (score >= 10) {
        gravidade = 'alerta';
        resultado = 'Depressão Moderada (Score 10-14)';
        conduta =
          'Considerar farmacoterapia e/ou psicoterapia de acordo com preferência do paciente e histórico prévio. Monitoramento a cada 2-4 semanas.';
      } else if (score >= 5) {
        gravidade = 'normal';
        resultado = 'Sintomas Depressivos Leves (Score 5-9)';
        conduta = 'Suporte de aconselhamento, higiene do sono, atividade física aeróbica e reavaliação em 30 dias.';
      }

      return {
        score,
        resultado,
        gravidade,
        interpretacao: `Score PHQ-9: ${score} de 27 pontos. ${
          ideacaoSuicida ? 'ALERTA: Item 9 positivo indica necessidade de rastreio de risco de suicídio.' : ''
        }`,
        conduta,
        sugestaoPrescricao: {
          titulo: 'Orientações em Saúde Mental & Psicoterapia',
          texto:
            '• Iniciar psicoterapia de abordagem cognitivo-comportamental (TCC).\n• Prática de atividade física regular (caminhada/corrida 150 min/semana).\n• Higiene do sono: evitar telas 1h antes de deitar, manter horários fixos.\n• Contato imediato com serviço de emergência em caso de crise ou ideação invasiva (CVV 188).',
        },
      };
    },
  },

  // ---------------------------------------------------------------------------
  // 3. GAD-7 - Generalized Anxiety Disorder (Ansiedade Generalizada)
  // ---------------------------------------------------------------------------
  {
    id: 'gad7',
    nome: 'Escala de Ansiedade Generalizada (GAD-7)',
    sigla: 'GAD-7',
    area: 'Saúde Mental & Clínica Médica',
    tempo: '2 min',
    descricao:
      'Avaliação rápida e sensível para rastreamento de transtorno de ansiedade generalizada, transtorno do pânico e fobia social.',
    fonte: {
      autores: 'Spitzer RL, Kroenke K, Williams JB, Löwe B.',
      ano: 2006,
      titulo: 'A brief measure for assessing generalized anxiety disorder: the GAD-7',
      veiculo: 'Archives of Internal Medicine, 166(10):1092-1097 (2006)',
      diretriz_nacional: 'Ministério da Saúde - Manual de Transtornos de Ansiedade na Atenção Primária',
    },
    pontuacao_maxima: 21,
    questoes: [
      {
        id: 'gad_1',
        enunciado: '1. Sentir-se nervoso(a), ansioso(a) ou muito tenso(a)',
        opcoes: [
          { rotulo: 'Nenhum dia (0)', pontos: 0 },
          { rotulo: 'Vários dias (1)', pontos: 1 },
          { rotulo: 'Mais da metade dos dias (2)', pontos: 2 },
          { rotulo: 'Quase todos os dias (3)', pontos: 3 },
        ],
      },
      {
        id: 'gad_2',
        enunciado: '2. Não ser capaz de impedir ou de controlar as preocupações',
        opcoes: [
          { rotulo: 'Nenhum dia (0)', pontos: 0 },
          { rotulo: 'Vários dias (1)', pontos: 1 },
          { rotulo: 'Mais da metade dos dias (2)', pontos: 2 },
          { rotulo: 'Quase todos os dias (3)', pontos: 3 },
        ],
      },
      {
        id: 'gad_3',
        enunciado: '3. Preocupar-se demais com diversas coisas diferentes',
        opcoes: [
          { rotulo: 'Nenhum dia (0)', pontos: 0 },
          { rotulo: 'Vários dias (1)', pontos: 1 },
          { rotulo: 'Mais da metade dos dias (2)', pontos: 2 },
          { rotulo: 'Quase todos os dias (3)', pontos: 3 },
        ],
      },
      {
        id: 'gad_4',
        enunciado: '4. Dificuldade para relaxar',
        opcoes: [
          { rotulo: 'Nenhum dia (0)', pontos: 0 },
          { rotulo: 'Vários dias (1)', pontos: 1 },
          { rotulo: 'Mais da metade dos dias (2)', pontos: 2 },
          { rotulo: 'Quase todos os dias (3)', pontos: 3 },
        ],
      },
      {
        id: 'gad_5',
        enunciado: '5. Ficar tão agitado(a) que se torna difícil ficar parado(a)',
        opcoes: [
          { rotulo: 'Nenhum dia (0)', pontos: 0 },
          { rotulo: 'Vários dias (1)', pontos: 1 },
          { rotulo: 'Mais da metade dos dias (2)', pontos: 2 },
          { rotulo: 'Quase todos os dias (3)', pontos: 3 },
        ],
      },
      {
        id: 'gad_6',
        enunciado: '6. Ficar facilmente irritado(a) ou aborrecido(a)',
        opcoes: [
          { rotulo: 'Nenhum dia (0)', pontos: 0 },
          { rotulo: 'Vários dias (1)', pontos: 1 },
          { rotulo: 'Mais da metade dos dias (2)', pontos: 2 },
          { rotulo: 'Quase todos os dias (3)', pontos: 3 },
        ],
      },
      {
        id: 'gad_7',
        enunciado: '7. Sentir medo como se algo horrível fosse acontecer',
        opcoes: [
          { rotulo: 'Nenhum dia (0)', pontos: 0 },
          { rotulo: 'Vários dias (1)', pontos: 1 },
          { rotulo: 'Mais da metade dos dias (2)', pontos: 2 },
          { rotulo: 'Quase todos os dias (3)', pontos: 3 },
        ],
      },
    ],
    avaliar: (respostas) => {
      const score = Object.values(respostas).reduce((a, b) => a + b, 0);
      let gravidade: 'normal' | 'alerta' | 'grave' = 'normal';
      let resultado = 'Ansiedade Mínima (0-4 pts)';
      let conduta = 'Orientação habitual e medidas de manejo do estresse.';

      if (score >= 15) {
        gravidade = 'grave';
        resultado = 'Ansiedade Severa (15-21 pts)';
        conduta =
          'Intervenção clínica ativa: farmacoterapia (ISRS/ISRN de 1ª linha como Sertralina ou Venlafaxina) associada a técnicas de relaxamento e psicoterapia TCC. Evitar prescrição crônica de benzodiazepínicos.';
      } else if (score >= 10) {
        gravidade = 'alerta';
        resultado = 'Ansiedade Moderada (10-14 pts)';
        conduta =
          'Avaliação clínica detalhada para Transtorno de Ansiedade Generalizada (TAG) ou Pânico. Psicoterapia e avaliação de medicação conforme impacto na qualidade de vida.';
      } else if (score >= 5) {
        gravidade = 'normal';
        resultado = 'Ansiedade Leve (5-9 pts)';
        conduta = 'Manejo não-farmacológico: técnicas de respiração diafragmática, redução de cafeína e acompanhamento em 30 dias.';
      }

      return {
        score,
        resultado,
        gravidade,
        interpretacao: `Pontuação GAD-7: ${score} de 21 pontos. Ponto de corte ≥ 10 possui sensibilidade de 89% e especificidade de 82% para TAG.`,
        conduta,
        sugestaoPrescricao: {
          titulo: 'Manejo da Ansiedade & Redução de Estresse',
          texto:
            '• Reduzir consumo de estimulantes (café, bebidas energéticas, chimarrão após as 14h).\n• Técnicas de relaxamento: respiração 4-7-8 duas vezes ao dia.\n• Manter rotina regular de exercícios físicos aeróbicos.',
        },
      };
    },
  },

  // ---------------------------------------------------------------------------
  // 4. FAST / Escala Pré-Hospitalar de Cincinnati (AVC Agudo)
  // ---------------------------------------------------------------------------
  {
    id: 'fast_cincinnati',
    nome: 'Escala de Cincinnati / FAST (Triagem de AVC Agudo)',
    sigla: 'FAST',
    area: 'Emergência & Neurologia',
    tempo: '1 min',
    descricao:
      'Triagem rápida de alta acurácia para Acidente Vascular Cerebral agudo. A presença de qualquer 1 dos 3 sinais prediz probabilidade de AVC > 72%.',
    fonte: {
      autores: 'Kothari RU, Pancioli A, Liu T, Brott T, Broderick J.',
      ano: 1999,
      titulo: 'Cincinnati Prehospital Stroke Scale: reproducibility and validity',
      veiculo: 'Annals of Emergency Medicine, 33(4):373-378 (1999)',
      diretriz_nacional: 'Linha de Cuidado do AVC no Adulto - Ministério da Saúde & Sociedade Brasileira de AVC (SBAVC)',
    },
    pontuacao_maxima: 3,
    questoes: [
      {
        id: 'fast_f',
        enunciado: '1. F (Face): Peça ao paciente para sorrir ou mostrar os dentes',
        opcoes: [
          { rotulo: 'Simetria facial normal (Ambos os lados movem igualmente)', pontos: 0 },
          { rotulo: 'Queda facial / Assimetria evidente de um lado 🚨', pontos: 1 },
        ],
      },
      {
        id: 'fast_a',
        enunciado: '2. A (Arm / Braço): Peça para levantar ambos os braços por 10 segundos com olhos fechados',
        opcoes: [
          { rotulo: 'Ambos os braços sustentados igualmente', pontos: 0 },
          { rotulo: 'Queda de um dos braços ou incapacidade de elevar 🚨', pontos: 1 },
        ],
      },
      {
        id: 'fast_s',
        enunciado: '3. S (Speech / Fala): Peça para repetir uma frase simples ("O céu é azul em Brasília")',
        opcoes: [
          { rotulo: 'Fala clara, compreensível e correta', pontos: 0 },
          { rotulo: 'Fala arrastada (disartria), palavras erradas ou afasia 🚨', pontos: 1 },
        ],
      },
    ],
    avaliar: (respostas) => {
      const score = Object.values(respostas).reduce((a, b) => a + b, 0);
      let gravidade: 'normal' | 'alerta' | 'grave' = 'normal';
      let resultado = 'Triagem FAST Negativa para Déficit Focal Agudo';
      let conduta = 'Investigar outros diagnósticos diferenciais não neurológicos focais.';

      if (score >= 1) {
        gravidade = 'grave';
        resultado = `ALERTA VERMELHO: Suspeita Altamente Provável de AVC Agudo (${score}/3 critérios positivos)`;
        conduta =
          'ACIONAMENTO IMEDIATO DO CÓDIGO AVC / SAMU 192. Encaminhar para Centro de Referência com Tomografia e Suporte para Trombólise/Trombectomia mecânica. Janela terapêutica crucial: anotar horário exato de início dos sintomas ("delta T"). Manter cabeceira a 0º se hipotenso ou 30º se hipertenso, glicemia capilar imediata (afastar hipoglicemia) e jejum total.';
      }

      return {
        score,
        resultado,
        gravidade,
        interpretacao: `Score FAST: ${score} critério(s) alterado(s). 1 sinal positivo confere 72% de probabilidade de AVC; 3 sinais aumentam a probabilidade para > 85%.`,
        conduta,
        sugestaoPrescricao: {
          titulo: 'Conduta de Urgência - Suspeita de AVC Agudo',
          texto:
            '• Contato imediato com SAMU 192 (Encaminhamento para Centro de AVC).\n• Checagem imediata de HGT (afastar hipoglicemia mimética de AVC).\n• Manter o paciente em jejum estrito (risco de broncoaspiração).\n• NÃO abaixar a pressão arterial agudamente exceto se PA > 220/120 mmHg (salvo protocolo de trombólise onde alvo é < 185/110 mmHg).',
        },
      };
    },
  },

  // ---------------------------------------------------------------------------
  // 5. FINDRISC - Risco de Diabetes em 10 anos
  // ---------------------------------------------------------------------------
  {
    id: 'findrisc',
    nome: 'Escore Finlandês de Risco de Diabetes (FINDRISC)',
    sigla: 'FINDRISC',
    area: 'Endocrinologia & Atenção Primária',
    tempo: '2 min',
    descricao:
      'Calcula o risco percentual de um indivíduo desenvolver Diabetes Mellitus Tipo 2 nos próximos 10 anos com intervenções preventivas direcionadas.',
    fonte: {
      autores: 'Lindström J, Tuomilehto J.',
      ano: 2003,
      titulo: 'The diabetes risk score: a practical tool to predict type 2 diabetes risk',
      veiculo: 'Diabetes Care, 26(3):725-731 (2003)',
      diretriz_nacional: 'Diretrizes da Sociedade Brasileira de Diabetes (SBD 2024)',
    },
    pontuacao_maxima: 26,
    questoes: [
      {
        id: 'find_idade',
        enunciado: '1. Idade do paciente',
        opcoes: [
          { rotulo: 'Menos de 45 anos (0)', pontos: 0 },
          { rotulo: '45 a 54 anos (2)', pontos: 2 },
          { rotulo: '55 a 64 anos (3)', pontos: 3 },
          { rotulo: '65 anos ou mais (4)', pontos: 4 },
        ],
      },
      {
        id: 'find_imc',
        enunciado: '2. Índice de Massa Corporal (IMC)',
        opcoes: [
          { rotulo: 'Menor que 25 kg/m² (0)', pontos: 0 },
          { rotulo: '25 a 30 kg/m² - Sobrepeso (1)', pontos: 1 },
          { rotulo: 'Maior que 30 kg/m² - Obesidade (3)', pontos: 3 },
        ],
      },
      {
        id: 'find_cintura',
        enunciado: '3. Circunferência Abdominal (Homens: <94 / 94-102 / >102 cm | Mulheres: <80 / 80-88 / >88 cm)',
        opcoes: [
          { rotulo: 'Normal (H < 94cm / M < 80cm) (0)', pontos: 0 },
          { rotulo: 'Moderada (H 94-102cm / M 80-88cm) (3)', pontos: 3 },
          { rotulo: 'Elevada (H > 102cm / M > 88cm) (4)', pontos: 4 },
        ],
      },
      {
        id: 'find_atividade',
        enunciado: '4. Pratica pelo menos 30 minutos de atividade física diária?',
        opcoes: [
          { rotulo: 'Sim (0)', pontos: 0 },
          { rotulo: 'Não (2)', pontos: 2 },
        ],
      },
      {
        id: 'find_vegetais',
        enunciado: '5. Consumo de verduras, legumes ou frutas todos os dias?',
        opcoes: [
          { rotulo: 'Todos os dias (0)', pontos: 0 },
          { rotulo: 'Não todos os dias (1)', pontos: 1 },
        ],
      },
      {
        id: 'find_has',
        enunciado: '6. Toma medicamentos para pressão arterial regularmente?',
        opcoes: [
          { rotulo: 'Não (0)', pontos: 0 },
          { rotulo: 'Sim (2)', pontos: 2 },
        ],
      },
      {
        id: 'find_glicose',
        enunciado: '7. Já teve histórico de glicemia elevada no passado (ex: exame de rotina ou gravidez)?',
        opcoes: [
          { rotulo: 'Não (0)', pontos: 0 },
          { rotulo: 'Sim (5)', pontos: 5 },
        ],
      },
      {
        id: 'find_familia',
        enunciado: '8. Alguém na família imediata tem histórico de diabetes (pais, irmãos, filhos)?',
        opcoes: [
          { rotulo: 'Não (0)', pontos: 0 },
          { rotulo: 'Parentes de 2º grau (avós, tios, primos) (3)', pontos: 3 },
          { rotulo: 'Parentes de 1º grau (pais, irmãos, filhos) (5)', pontos: 5 },
        ],
      },
    ],
    avaliar: (respostas) => {
      const score = Object.values(respostas).reduce((a, b) => a + b, 0);
      let gravidade: 'normal' | 'alerta' | 'grave' = 'normal';
      let resultado = 'Baixo Risco de Diabetes em 10 anos (< 1%)';
      let conduta = 'Reforçar estilo de vida ativo e dieta balanceada.';

      if (score >= 20) {
        gravidade = 'grave';
        resultado = 'Risco Muito Alto de Diabetes em 10 anos (~50% de probabilidade)';
        conduta =
          'Rastreio laboratorial imediato com Glicemia de Jejum, Hemoglobina Glicada (HbA1c) e TOTG 75g. Intervenção intensiva no estilo de vida com meta de perda de 7% do peso corporal e avaliação de Metformina profilática segundo diretriz SBD.';
      } else if (score >= 15) {
        gravidade = 'grave';
        resultado = 'Risco Alto de Diabetes em 10 anos (~33% de probabilidade)';
        conduta =
          'Solicitar Glicemia de Jejum e HbA1c. Orientar plano alimentar hipocalórico, redução de açúcares simples e 150 min/semana de atividade física moderada.';
      } else if (score >= 12) {
        gravidade = 'alerta';
        resultado = 'Risco Moderado de Diabetes em 10 anos (~17% de probabilidade)';
        conduta = 'Solicitar glicemia de jejum de rastreio e acompanhamento nutricional.';
      } else if (score >= 7) {
        gravidade = 'normal';
        resultado = 'Risco Ligeiramente Elevado (~4% em 10 anos)';
        conduta = 'Incentivar prática de exercícios e perda de peso moderada.';
      }

      return {
        score,
        resultado,
        gravidade,
        interpretacao: `Pontuação FINDRISC: ${score} de 26 pontos. Instrumento com sensibilidade de 81% para predizer novos casos de diabetes mellitus tipo 2 em 10 anos.`,
        conduta,
        sugestaoPrescricao: {
          titulo: 'Prevenção de Diabetes Mellitus Tipo 2 (SBD)',
          texto:
            '• Solicitar: Glicemia de Jejum e Hemoglobina Glicada (HbA1c).\n• Meta ponderal: Perda de 5% a 7% do peso corporal atual.\n• Alimentação: Reduzir carboidratos refinados, preferir grãos integrais e fibras vegetais.\n• Exercício: Mínimo de 150 minutos semanais de atividade física aeróbica fracionada.',
        },
      };
    },
  },
];

export const RapidClinicTestsView: React.FC = () => {
  const [testeSelecionadoId, setTesteSelecionadoId] = useState<string>('meem');
  const [respostas, setRespostas] = useState<Record<string, number>>({});
  const [relatorioModalAberto, setRelatorioModalAberto] = useState(false);
  const [copiadoMsg, setCopiadoMsg] = useState(false);
  const [adicionadoPrescricaoMsg, setAdicionadoPrescricaoMsg] = useState(false);

  const perfilMedico = obterPerfilMedicoAtivo();
  const pacienteAtivo = obterPacienteAtivo();

  const testeAtual = useMemo(() => {
    return LISTA_TESTES_CLINICOS.find((t) => t.id === testeSelecionadoId) || LISTA_TESTES_CLINICOS[0];
  }, [testeSelecionadoId]);

  // Limpar respostas ao trocar de teste
  const trocarTeste = (id: string) => {
    setTesteSelecionadoId(id);
    setRespostas({});
  };

  const selecionarOpcao = (questaoId: string, pontos: number) => {
    setRespostas((prev) => ({ ...prev, [questaoId]: pontos }));
  };

  const avaliacao = useMemo(() => {
    return testeAtual.avaliar(respostas, pacienteAtivo);
  }, [testeAtual, respostas, pacienteAtivo]);

  // Construir objeto do Laudo
  const laudoRelatorio: RelatorioTesteRealizado = useMemo(() => {
    const respostasDetalhadas = testeAtual.questoes.map((q) => {
      const pts = respostas[q.id] ?? 0;
      const opcao = q.opcoes.find((o) => o.pontos === pts);
      return {
        enunciado: q.enunciado,
        resposta: opcao ? opcao.rotulo : 'Não respondida',
        pontos: pts,
      };
    });

    return {
      id: `rel_${Date.now()}`,
      paciente_id: pacienteAtivo?.id,
      paciente_nome: pacienteAtivo?.nome_completo || 'Paciente Avaliado em Consultório',
      paciente_idade: pacienteAtivo?.idade_anos,
      paciente_cpf: pacienteAtivo?.cpf,
      medico_nome: perfilMedico.nome_completo,
      medico_crm: `CRM/${perfilMedico.uf_crm} ${perfilMedico.crm}`,
      teste_id: testeAtual.id,
      teste_nome: testeAtual.nome,
      data_hora: new Date().toISOString(),
      pontuacao_obtida: avaliacao.score,
      pontuacao_maxima: testeAtual.pontuacao_maxima,
      classificacao: avaliacao.resultado,
      interpretacao_clinica: avaliacao.interpretacao,
      conduta_proposta: avaliacao.conduta,
      referencia_bibliografica: `${testeAtual.fonte.autores} (${testeAtual.fonte.ano}). ${testeAtual.fonte.titulo}. ${testeAtual.fonte.veiculo} — ${testeAtual.fonte.diretriz_nacional}.`,
      respostas_detalhadas: respostasDetalhadas,
    };
  }, [testeAtual, respostas, avaliacao, perfilMedico, pacienteAtivo]);

  // Exportar Laudo em PDF
  const dispararPdfLaudo = async () => {
    salvarRelatorioTeste(laudoRelatorio);
    await exportarRelatorioTesteEmPdf(laudoRelatorio, perfilMedico, pacienteAtivo);
  };

  // Enviar para Cesta de Prescrição Modular
  const enviarParaPrescricao = () => {
    if (avaliacao.sugestaoPrescricao) {
      adicionarItemPrescricaoModular(
        'orientacao',
        `${testeAtual.sigla}: ${avaliacao.sugestaoPrescricao.titulo}`,
        `${avaliacao.sugestaoPrescricao.texto}\n\n[Escore obtido: ${avaliacao.score}/${testeAtual.pontuacao_maxima} - ${avaliacao.resultado}]`,
        undefined,
        testeAtual.fonte.diretriz_nacional,
        ['Teste de Consultório', testeAtual.sigla]
      );
      setAdicionadoPrescricaoMsg(true);
      setTimeout(() => setAdicionadoPrescricaoMsg(false), 2000);
    }
  };

  // Copiar Laudo para Área de Transferência
  const copiarTextoProntuario = () => {
    const texto = `=== LAUDO DE AVALIAÇÃO CLÍNICA ===
Instrumento: ${laudoRelatorio.teste_nome}
Data: ${new Date().toLocaleString('pt-BR')}
Paciente: ${laudoRelatorio.paciente_nome}
Médico: ${laudoRelatorio.medico_nome} (${laudoRelatorio.medico_crm})

Escore Obtido: ${laudoRelatorio.pontuacao_obtida} de ${laudoRelatorio.pontuacao_maxima} pontos
Classificação: ${laudoRelatorio.classificacao}
Interpretação: ${laudoRelatorio.interpretacao_clinica}
Conduta Proposta: ${laudoRelatorio.conduta_proposta}

Fonte Oficial: ${laudoRelatorio.referencia_bibliografica}
===================================`;

    navigator.clipboard.writeText(texto);
    setCopiadoMsg(true);
    setTimeout(() => setCopiadoMsg(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho do Módulo */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-teal-500/10 text-teal-400 rounded-2xl border border-teal-500/20">
            <Brain className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              Testes Rápidos de Consultório & Laudos Clínicos
              <span className="px-2 py-0.5 bg-teal-500/20 text-teal-300 text-[10px] rounded-md font-mono">
                Evidência Científica Nível A
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Escalas validadas para rastreio cognitivo, depressão, ansiedade, AVC e risco metabólico com laudo médico exportável em PDF.
            </p>
          </div>
        </div>

        {/* Status do Paciente Vinculado */}
        <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-2xl border border-slate-800 text-xs">
          <User className="w-4 h-4 text-teal-400" />
          <span className="text-slate-400">Paciente Ativo:</span>
          <span className="font-bold text-slate-200">
            {pacienteAtivo ? pacienteAtivo.nome_completo : 'Paciente Modelo'}
          </span>
        </div>
      </div>

      {/* Menu Seletor de Testes */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {LISTA_TESTES_CLINICOS.map((t) => {
          const ativo = t.id === testeSelecionadoId;
          return (
            <button
              key={t.id}
              onClick={() => trocarTeste(t.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap border ${
                ativo
                  ? 'bg-teal-600 text-white border-teal-500 shadow-lg shadow-teal-950/40'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
            >
              <span>{t.sigla}</span>
              <span className="text-[10px] font-normal opacity-80">({t.tempo})</span>
            </button>
          );
        })}
      </div>

      {/* =====================================================================
          BANNER DE FONTE CIENTÍFICA EXPLÍCITA & DIRETRIZ
         ===================================================================== */}
      <div className="bg-slate-900 border border-teal-800/40 rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-teal-300 font-bold">
            <BookOpen className="w-4 h-4 text-teal-400" />
            <span>Fonte Científica & Citação Bibliográfica Oficial:</span>
          </div>
          <span className="text-[10px] bg-teal-500/15 text-teal-300 px-2.5 py-0.5 rounded-full font-mono font-semibold">
            {testeAtual.fonte.diretriz_nacional}
          </span>
        </div>
        <p className="text-xs text-slate-300 font-medium">
          <strong>Referência:</strong> {testeAtual.fonte.autores} ({testeAtual.fonte.ano}).{' '}
          <em>&quot;{testeAtual.fonte.titulo}&quot;</em>. {testeAtual.fonte.veiculo}.
        </p>
      </div>

      {/* =====================================================================
          CORPO DO TESTE INTERATIVO & PAINEL DE RESULTADOS
         ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1 e 2: Questionário Interativo */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                {testeAtual.nome}
              </h3>
              <p className="text-xs text-slate-400 mt-1">{testeAtual.descricao}</p>
            </div>

            {/* Lista de Questões */}
            <div className="space-y-4">
              {testeAtual.questoes.map((q) => {
                const valorAtual = respostas[q.id];
                return (
                  <div
                    key={q.id}
                    className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2.5"
                  >
                    <p className="font-semibold text-slate-200 text-xs leading-relaxed">
                      {q.enunciado}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {q.opcoes.map((op) => {
                        const isSelected = valorAtual === op.pontos;
                        return (
                          <button
                            key={op.rotulo}
                            type="button"
                            onClick={() => selecionarOpcao(q.id, op.pontos)}
                            className={`px-3 py-1.5 rounded-xl text-xs transition border font-medium ${
                              isSelected
                                ? 'bg-teal-600 text-white border-teal-500 shadow-md shadow-teal-950/30'
                                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            {op.rotulo}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Coluna 3: Painel de Interpretação & Ações de Exportação */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl sticky top-24 space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Resultado Clínico em Tempo Real:
            </span>

            {/* Score Card */}
            <div
              className={`p-5 rounded-2xl border text-center space-y-1 ${
                avaliacao.gravidade === 'grave'
                  ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                  : avaliacao.gravidade === 'alerta'
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                  : 'bg-teal-500/15 border-teal-500/40 text-teal-300'
              }`}
            >
              <span className="text-[11px] font-semibold uppercase tracking-wider block">
                Pontuação Total
              </span>
              <div className="text-3xl font-extrabold font-mono">
                {avaliacao.score}{' '}
                <span className="text-sm font-normal opacity-70">
                  / {testeAtual.pontuacao_maxima} pts
                </span>
              </div>
              <div className="text-xs font-bold pt-1">{avaliacao.resultado}</div>
            </div>

            {/* Interpretação Detalhada */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-300 block">Interpretação:</span>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                {avaliacao.interpretacao}
              </p>
            </div>

            {/* Conduta Recomendada */}
            <div className="space-y-2 text-xs border-t border-slate-800 pt-3">
              <span className="font-bold text-teal-400 block">Conduta Baseada em Evidências:</span>
              <p className="text-slate-300 leading-relaxed text-[11px] bg-slate-950 p-3 rounded-xl border border-slate-800">
                {avaliacao.conduta}
              </p>
            </div>

            {/* Botões de Ação */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <button
                onClick={dispararPdfLaudo}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-teal-950/40"
              >
                <Download className="w-4 h-4" /> Exportar Laudo Oficial em PDF
              </button>

              <button
                onClick={enviarParaPrescricao}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border border-slate-700"
              >
                <Plus className="w-4 h-4 text-teal-400" />
                {adicionadoPrescricaoMsg ? 'Adicionado à Prescrição ✓' : 'Enviar Conduta para Prescrição'}
              </button>

              <button
                onClick={copiarTextoProntuario}
                className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                {copiadoMsg ? 'Copiado para o Prontuário ✓' : 'Copiar Texto para Prontuário'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
