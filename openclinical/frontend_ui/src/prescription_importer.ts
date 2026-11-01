// =============================================================================
// IMPORTADOR INTELIGENTE DE RECEITAS EM PDF & RECONVERSÃO REVERSA
// OpenClinical - Suporte a múltiplos PDFs, extração de payload nativo ou heurística
// =============================================================================

import { BlocoPrescricao, Paciente } from './types';
import { avaliarSegurancaMedicamentosa5g } from './medication_safety_5g';
import { normalizarTexto } from './api';

export interface ResultadoImportacaoPdf {
  arquivo_nome: string;
  sucesso: boolean;
  formato: 'openclinical_smart' | 'heuristica_externa';
  paciente_detectado?: string;
  medico_detectado?: string;
  data_detectada?: string;
  blocos: BlocoPrescricao[];
  alertas_alergia: string[];
  alertas_interacoes: string[];
  erro?: string;
}

export async function importarReceitasDePdfs(
  arquivos: File[],
  pacienteAtivo?: Paciente | null
): Promise<ResultadoImportacaoPdf[]> {
  const [pdfjs, { default: urlWorker }] = await Promise.all([
    import('pdfjs-dist'),
    import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
  ]);
  pdfjs.GlobalWorkerOptions.workerSrc = urlWorker;

  const resultados: ResultadoImportacaoPdf[] = [];

  for (const arquivo of arquivos) {
    try {
      const buffer = await arquivo.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: new Uint8Array(buffer), verbosity: 0 }).promise;

      // 1. Tenta extrair dos Metadados (Keywords) do PDF
      let payloadDecodificado: any = null;
      let modoExtracao: 'openclinical_smart' | 'heuristica_externa' = 'heuristica_externa';

      try {
        const metadata = await pdf.getMetadata();
        const keywords = (metadata.info as any)?.Keywords || '';
        if (keywords && keywords.includes('OPENCLINICAL_SMART_RX:')) {
          const b64 = keywords.split('OPENCLINICAL_SMART_RX:')[1]?.trim();
          if (b64) {
            const jsonStr = decodeURIComponent(escape(atob(b64)));
            payloadDecodificado = JSON.parse(jsonStr);
            modoExtracao = 'openclinical_smart';
          }
        }
      } catch (e) {
        // Prossegue para busca no texto
      }

      // 2. Extrai o texto de todas as páginas
      let textoCompleto = '';
      for (let p = 1; p <= pdf.numPages; p++) {
        const page = await pdf.getPage(p);
        const textContent = await page.getTextContent();
        const pageStr = textContent.items
          .map((item: any) => item.str || '')
          .join(' ');
        textoCompleto += pageStr + '\n';
      }

      // Se ainda não encontrou via metadados, procura o token invisível no texto
      if (!payloadDecodificado && textoCompleto.includes('[OPENCLINICAL_SMART_PAYLOAD]')) {
        try {
          const partes = textoCompleto.split('[OPENCLINICAL_SMART_PAYLOAD]');
          const b64 = partes[1]?.split('[/OPENCLINICAL_SMART_PAYLOAD]')[0]?.trim();
          if (b64) {
            const jsonStr = decodeURIComponent(escape(atob(b64)));
            payloadDecodificado = JSON.parse(jsonStr);
            modoExtracao = 'openclinical_smart';
          }
        } catch (e) {
          // Prossegue para heurística
        }
      }

      let blocosReconstruidos: BlocoPrescricao[] = [];
      let pacienteNome = '';
      let medicoNome = '';

      if (payloadDecodificado && payloadDecodificado.blocos) {
        blocosReconstruidos = payloadDecodificado.blocos;
        pacienteNome = payloadDecodificado.paciente?.nome_completo || '';
        medicoNome = payloadDecodificado.medico?.nome_completo || '';
      } else {
        // 3. Heurística Clínica para PDFs externos ou impressos sem payload
        const parsedHeuristica = parsearTextoReceitaExterna(textoCompleto);
        blocosReconstruidos = parsedHeuristica.blocos;
        pacienteNome = parsedHeuristica.paciente;
        medicoNome = parsedHeuristica.medico;
      }

      // 4. Auditoria Obrigatória de Segurança: Alergias e Interações Farmacológicas
      const alertasAlergia: string[] = [];
      const alertasInteracoes: string[] = [];

      if (pacienteAtivo && pacienteAtivo.alergias && pacienteAtivo.alergias.length > 0) {
        const alergiasNormalizadas = pacienteAtivo.alergias.map(normalizarTexto);
        for (const bloco of blocosReconstruidos) {
          if (bloco.tipo !== 'medicamento') continue;
          const textoBloco = normalizarTexto(
            `${bloco.titulo} ${bloco.medicamento_detalhe?.principio_ativo || ''} ${bloco.conteudo}`
          );
          for (let i = 0; i < pacienteAtivo.alergias.length; i++) {
            const alergia = pacienteAtivo.alergias[i];
            const alergiaNorm = alergiasNormalizadas[i];
            if (textoBloco.includes(alergiaNorm)) {
              alertasAlergia.push(
                `ALERTA DE ALERGIA: O medicamento "${bloco.titulo}" coincide com a alergia cadastrada "${alergia}" do paciente!`
              );
            }
          }
        }
      }

      // Auditoria 5G de Interações Farmacológicas
      const nomesRemedios = blocosReconstruidos
        .filter((b) => b.tipo === 'medicamento')
        .map((b) => b.medicamento_detalhe?.principio_ativo || b.titulo);

      if (nomesRemedios.length >= 2) {
        const seg = avaliarSegurancaMedicamentosa5g(
          nomesRemedios,
          pacienteAtivo?.idade_anos || 65,
          pacienteAtivo?.sexo === 'F'
        );
        if (seg.triple_whammy.detectado) {
          alertasInteracoes.push(
            `TRIPLE WHAMMY RENAL: Associação perigosa de IECA/BRA + Diurético + AINE detectada na receita importada!`
          );
        }
        if (seg.escore_tisdale.pontuacao_total >= 7) {
          alertasInteracoes.push(
            `RISCO ALTO DE QTc (Tisdale ${seg.escore_tisdale.pontuacao_total}): Combinação com risco de arritmias ventriculares!`
          );
        }
        if (seg.cascatas.length > 0) {
          seg.cascatas.forEach((c) => {
            alertasInteracoes.push(`CASCATA IATROGÊNICA: ${c.farmaco_causador} + ${c.farmaco_prescrito}`);
          });
        }
      }

      resultados.push({
        arquivo_nome: arquivo.name,
        sucesso: blocosReconstruidos.length > 0,
        formato: modoExtracao,
        paciente_detectado: pacienteNome,
        medico_detectado: medicoNome,
        blocos: blocosReconstruidos,
        alertas_alergia: alertasAlergia,
        alertas_interacoes: alertasInteracoes,
      });

      await pdf.destroy();
    } catch (err: any) {
      resultados.push({
        arquivo_nome: arquivo.name,
        sucesso: false,
        formato: 'heuristica_externa',
        blocos: [],
        alertas_alergia: [],
        alertas_interacoes: [],
        erro: err.message || 'Falha ao processar arquivo PDF.',
      });
    }
  }

  return resultados;
}

/**
 * Parser heurístico clínico para extrair blocos de remédios de qualquer PDF médico
 */
function parsearTextoReceitaExterna(texto: string): {
  blocos: BlocoPrescricao[];
  paciente: string;
  medico: string;
} {
  const linhas = texto
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const blocos: BlocoPrescricao[] = [];
  let pacienteDetectado = '';
  let medicoDetectado = '';

  // Procura nome do paciente e médico
  for (const l of linhas) {
    const lNorm = normalizarTexto(l);
    if (lNorm.includes('paciente:') || lNorm.includes('para:')) {
      pacienteDetectado = l.split(/paciente:|para:/i)[1]?.trim() || '';
    }
    if (lNorm.includes('dr.') || lNorm.includes('dra.') || lNorm.includes('crm:')) {
      medicoDetectado = l;
    }
  }

  // Regex para identificar itens numerados típicos de receitas (ex: "1) Dipirona...", "2. Amoxicilina...")
  const itemRegex = /^(\d{1,2})[\.\)-]\s*(.+)$/;

  let blocoAtual: Partial<BlocoPrescricao> | null = null;
  let ordem = 1;

  for (let i = 0; i < linhas.length; i++) {
    const linha = linhas[i];
    const match = linha.match(itemRegex);

    if (match) {
      if (blocoAtual && blocoAtual.titulo) {
        blocos.push(finalizarBloco(blocoAtual, ordem++));
      }

      const tituloLimpo = match[2].trim();
      blocoAtual = {
        id: `med_imp_${Date.now()}_${ordem}`,
        tipo: 'medicamento',
        titulo: tituloLimpo,
        conteudo: '',
        ordem,
        ativo: true,
      };
    } else if (blocoAtual) {
      // Linha subsequente adicionada à posologia
      if (!linha.toLowerCase().includes('crm') && !linha.toLowerCase().includes('data:')) {
        blocoAtual.conteudo = blocoAtual.conteudo
          ? `${blocoAtual.conteudo} ${linha}`
          : linha;
      }
    }
  }

  if (blocoAtual && blocoAtual.titulo) {
    blocos.push(finalizarBloco(blocoAtual, ordem++));
  }

  return {
    blocos,
    paciente: pacienteDetectado,
    medico: medicoDetectado,
  };
}

function finalizarBloco(parcial: Partial<BlocoPrescricao>, ordem: number): BlocoPrescricao {
  const titulo = parcial.titulo || 'Medicamento Prescrito';
  const posologia = parcial.conteudo || 'Tomar conforme orientação médica.';
  const isControlado =
    titulo.toLowerCase().includes('clonazepam') ||
    titulo.toLowerCase().includes('diazepam') ||
    titulo.toLowerCase().includes('amoxicilina') ||
    titulo.toLowerCase().includes('azitromicina') ||
    titulo.toLowerCase().includes('ciprofloxacino') ||
    titulo.toLowerCase().includes('controle especial');

  return {
    id: parcial.id || `med_imp_${Date.now()}_${ordem}`,
    tipo: 'medicamento',
    titulo: titulo,
    conteudo: posologia,
    medicamento_detalhe: {
      id: `med_det_${Date.now()}_${ordem}`,
      nome_medicamento: titulo,
      principio_ativo: titulo.split(' ')[0],
      apresentacao: 'Apresentação padrão',
      posologia: posologia,
      quantidade_embalagens: 1,
      tipo_receituario: isControlado ? 'controle_especial_c1' : 'simples',
      preco_pmc: 0,
    },
    tags: ['Importado via PDF', isControlado ? 'Portaria 344' : 'Receita Simples'],
    ordem,
    ativo: true,
    origem_fonte: 'Importação Reversa de PDF',
  };
}
