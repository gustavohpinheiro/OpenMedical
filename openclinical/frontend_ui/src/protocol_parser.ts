import { BlocoPrescricao, ProtocoloClinico } from './types.ts';
import { classificarTipoReceituario, resolverMedicamentoDaBase } from './clinical_auditor.ts';

export interface ProtocoloDecomposto {
  medicamentos: BlocoPrescricao[];
  exames: BlocoPrescricao[];
  orientacoes: BlocoPrescricao[];
  todosBlocos: BlocoPrescricao[];
}

/**
 * Normaliza e decompõe um protocolo clínico estruturado ou texto de prescrição
 * em blocos modulares individuais (Lego No-Code), separando automaticamente:
 * 1. Medicamentos individuais (com classificação sanitária da Anvisa)
 * 2. Pedidos de exames complementares (laboratoriais e imagem)
 * 3. Orientações não farmacológicas e estilo de vida
 */
export function decomporProtocoloEmBlocos(
  protocolo: ProtocoloClinico,
  fontePadrao?: string
): ProtocoloDecomposto {
  const fonte = fontePadrao || (protocolo.agencia ? `${protocolo.agencia} (${protocolo.pais || 'Oficial'})` : 'PCDT SUS');
  const texto = protocolo.bloco_prescricao_copiavel || protocolo.conteudo_markdown || '';

  const medicamentos: BlocoPrescricao[] = [];
  const exames: BlocoPrescricao[] = [];
  const orientacoes: BlocoPrescricao[] = [];

  if (!texto.trim()) {
    return { medicamentos: [], exames: [], orientacoes: [], todosBlocos: [] };
  }

  // Divisão por seções clássicas de receituário médico
  const linhas = texto.split('\n');
  let secaoAtual: 'cabecalho' | 'medicamentos' | 'exames' | 'orientacoes' = 'medicamentos';

  let bufferItem: {
    tipo: 'medicamento' | 'exame' | 'orientacao';
    titulo: string;
    linhasConteudo: string[];
  } | null = null;

  const salvarBuffer = () => {
    if (!bufferItem) return;
    const conteudo = bufferItem.linhasConteudo.join('\n').trim();
    const tituloLimpo = bufferItem.titulo.replace(/^\d+[\.\)]\s*/, '').trim();

    if (bufferItem.tipo === 'medicamento') {
      // Tenta extrair quantidade se houver traços ou hífen
      // Ex: "Amoxicilina 500mg cápsula ------------------- 1 caixa"
      let nomeRemedio = tituloLimpo;
      let quantidade = '1 caixa';
      if (tituloLimpo.includes('---') || tituloLimpo.includes(' – ') || tituloLimpo.includes(' - ')) {
        const partes = tituloLimpo.split(/[-–—]{2,}|(?<=\b)\s*[-–—]\s*(?=[0-9])/);
        if (partes.length >= 2) {
          nomeRemedio = partes[0].trim();
          quantidade = partes[1].trim();
        }
      }

      const tipoRec = classificarTipoReceituario(nomeRemedio);
      const bloco: BlocoPrescricao = {
        id: `bloco_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        tipo: 'medicamento',
        titulo: nomeRemedio,
        conteudo: conteudo || `Tomar conforme orientação médica.\nPosologia padronizada pelo protocolo ${protocolo.titulo}.`,
        medicamento_detalhe: {
          id: `med_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          nome_medicamento: nomeRemedio,
          principio_ativo: nomeRemedio.toUpperCase(),
          apresentacao: 'Conforme padronização',
          posologia: conteudo || 'Tomar conforme prescrição.',
          quantidade_embalagens: 1,
          via_administracao: 'oral',
          tipo_receituario: tipoRec,
          preco_pmc: 0,
        },
        origem_fonte: fonte,
        tags: ['Protocolo Clínico', protocolo.titulo],
        ordem: medicamentos.length + 1,
        ativo: true,
      };
      medicamentos.push(bloco);
    } else if (bufferItem.tipo === 'exame') {
      const bloco: BlocoPrescricao = {
        id: `bloco_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        tipo: 'exame',
        titulo: tituloLimpo,
        conteudo: conteudo || `Solicitação de exame complementar para investigação e monitoramento de ${protocolo.titulo}.`,
        origem_fonte: fonte,
        tags: ['Exame Complementar', protocolo.titulo],
        ordem: exames.length + 1,
        ativo: true,
      };
      exames.push(bloco);
    } else if (bufferItem.tipo === 'orientacao') {
      const bloco: BlocoPrescricao = {
        id: `bloco_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        tipo: 'orientacao',
        titulo: tituloLimpo.length > 5 ? tituloLimpo : `Orientações: ${protocolo.titulo}`,
        conteudo: conteudo || tituloLimpo,
        origem_fonte: fonte,
        tags: ['Orientações Clínicas', protocolo.titulo],
        ordem: orientacoes.length + 1,
        ativo: true,
      };
      orientacoes.push(bloco);
    }

    bufferItem = null;
  };

  for (let i = 0; i < linhas.length; i++) {
    const linha = linhas[i].trim();
    if (!linha) continue;

    // Detecção de títulos de seções
    const linhaUpper = linha.toUpperCase();
    if (linhaUpper.includes('EXAMES') || linhaUpper.includes('SOLICITAÇÃO DE EXAME') || linhaUpper.includes('PROPEDÊUTICA')) {
      salvarBuffer();
      secaoAtual = 'exames';
      continue;
    }
    if (linhaUpper.includes('ORIENTAÇÕES') || linhaUpper.includes('RECOMENDAÇÕES') || linhaUpper.includes('CUIDADOS') || linhaUpper.includes('ESTILO DE VIDA')) {
      salvarBuffer();
      secaoAtual = 'orientacoes';
      continue;
    }
    if (linhaUpper.includes('USO ORAL') || linhaUpper.includes('USO TÓPICO') || linhaUpper.includes('USO INJETÁVEL') || linhaUpper.includes('PRESCRIÇÃO') || linhaUpper.includes('TRATAMENTO FARMACOLÓGICO')) {
      salvarBuffer();
      secaoAtual = 'medicamentos';
      continue;
    }

    // Ignora linhas de cabeçalho administrativo da receita (ex: "Paciente: ...", "Data: ...")
    if (/^(PACIENTE|DATA|MÉDICO|RECEITUÁRIO|DIRETRIZ)\s*[:\-]/i.test(linha)) {
      continue;
    }

    // Detecta item numerado (ex: "1. Amoxicilina 500mg...")
    const matchNumerado = linha.match(/^(\d+)[\.\)]\s*(.+)/);
    if (matchNumerado) {
      salvarBuffer();
      const titulo = matchNumerado[2].trim();
      const tipo = secaoAtual === 'exames' ? 'exame' : secaoAtual === 'orientacoes' ? 'orientacao' : 'medicamento';
      bufferItem = {
        tipo,
        titulo,
        linhasConteudo: [],
      };
      continue;
    }

    // Detecta item com bullet (ex: "- Hidratação abundante...")
    const matchBullet = linha.match(/^[\*\-•]\s*(.+)/);
    if (matchBullet) {
      if (secaoAtual === 'orientacoes' || secaoAtual === 'exames') {
        salvarBuffer();
        const titulo = matchBullet[1].trim();
        const tipo = secaoAtual === 'exames' ? 'exame' : 'orientacao';
        bufferItem = {
          tipo,
          titulo,
          linhasConteudo: [],
        };
        continue;
      }
    }

    // Linha de detalhe / posologia subordinada ao item anterior
    if (bufferItem) {
      bufferItem.linhasConteudo.push(linha);
    } else {
      // Se não houver item aberto, cria de acordo com a seção atual
      const tipo = secaoAtual === 'exames' ? 'exame' : secaoAtual === 'orientacoes' ? 'orientacao' : 'medicamento';
      bufferItem = {
        tipo,
        titulo: linha,
        linhasConteudo: [],
      };
    }
  }

  salvarBuffer();

  // Se por alguma razão o texto não tiver numeração, cria pelo menos 1 bloco estruturado
  if (medicamentos.length === 0 && exames.length === 0 && orientacoes.length === 0 && texto.trim()) {
    medicamentos.push({
      id: `bloco_${Date.now()}`,
      tipo: 'medicamento',
      titulo: protocolo.titulo,
      conteudo: texto,
      origem_fonte: fonte,
      tags: ['Protocolo Clínico'],
      ordem: 1,
      ativo: true,
    });
  }

  const todosBlocos = [...medicamentos, ...exames, ...orientacoes];
  return { medicamentos, exames, orientacoes, todosBlocos };
}
