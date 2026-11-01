import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PerfilMedico, Paciente, RelatorioTesteRealizado } from './types';

/**
 * Converte um ou mais elementos HTML (páginas A4 ou A5) em um arquivo PDF para download direto.
 */
export async function exportarElementosParaPdf(
  elementos: HTMLElement[],
  nomeArquivo: string,
  formato: 'a4' | 'a5' = 'a4'
): Promise<void> {
  if (!elementos || elementos.length === 0) return;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: formato,
    compress: true,
  });

  const largura = formato === 'a5' ? 148 : 210;
  const altura = formato === 'a5' ? 210 : 297;

  for (let i = 0; i < elementos.length; i++) {
    const el = elementos[i];
    if (i > 0) {
      pdf.addPage(formato, 'portrait');
    }

    const canvas = await html2canvas(el, {
      scale: 2.5, // Alta resolução para impressão nítida
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    pdf.addImage(imgData, 'JPEG', 0, 0, largura, altura, undefined, 'FAST');
  }

  pdf.save(nomeArquivo.endsWith('.pdf') ? nomeArquivo : `${nomeArquivo}.pdf`);
}

/**
 * Gera um PDF formal do laudo/relatório de teste rápido clínico.
 */
export async function exportarRelatorioTesteEmPdf(
  relatorio: RelatorioTesteRealizado,
  perfilMedico: PerfilMedico,
  paciente?: Paciente | null
): Promise<void> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const marginX = 20;
  let cursorY = 22;

  // Cabeçalho da Clínica / Médico
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(15, 118, 110); // Teal 700
  pdf.text(perfilMedico.nome_clinica || 'OpenClinical - Medicina de Precisão', marginX, cursorY);
  cursorY += 6;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(71, 85, 105);
  pdf.text(
    `${perfilMedico.nome_completo} • CRM/${perfilMedico.uf_crm} ${perfilMedico.crm} ${
      perfilMedico.rqe ? `• RQE ${perfilMedico.rqe}` : ''
    }`,
    marginX,
    cursorY
  );
  cursorY += 4.5;
  pdf.text(perfilMedico.endereco_consultorio || '', marginX, cursorY);
  cursorY += 4.5;
  pdf.text(`Contato: ${perfilMedico.telefone_consultorio || ''}`, marginX, cursorY);
  cursorY += 6;

  // Linha divisória
  pdf.setDrawColor(203, 213, 225);
  pdf.setLineWidth(0.5);
  pdf.line(marginX, cursorY, 190, cursorY);
  cursorY += 8;

  // Título do Laudo
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(13);
  pdf.setTextColor(15, 23, 42); // Slate 900
  pdf.text('LAUDO DE AVALIAÇÃO CLÍNICA & TESTE DE CONSULTÓRIO', marginX, cursorY);
  cursorY += 7;

  // Box de Identificação do Paciente
  pdf.setFillColor(248, 250, 252);
  pdf.setDrawColor(226, 232, 240);
  pdf.roundedRect(marginX, cursorY, 170, 26, 2, 2, 'FD');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(51, 65, 85);
  pdf.text('PACIENTE:', marginX + 4, cursorY + 6);
  pdf.setFont('helvetica', 'normal');
  pdf.text(paciente ? paciente.nome_completo : relatorio.paciente_nome, marginX + 25, cursorY + 6);

  pdf.setFont('helvetica', 'bold');
  pdf.text('IDADE:', marginX + 115, cursorY + 6);
  pdf.setFont('helvetica', 'normal');
  pdf.text(paciente ? `${paciente.idade_anos} anos` : 'Não informada', marginX + 130, cursorY + 6);

  pdf.setFont('helvetica', 'bold');
  pdf.text('DOCUMENTO:', marginX + 4, cursorY + 13);
  pdf.setFont('helvetica', 'normal');
  pdf.text(paciente?.cpf ? `CPF: ${paciente.cpf}` : 'Não informado', marginX + 28, cursorY + 13);

  pdf.setFont('helvetica', 'bold');
  pdf.text('DATA/HORA:', marginX + 105, cursorY + 13);
  pdf.setFont('helvetica', 'normal');
  pdf.text(new Date(relatorio.data_hora).toLocaleString('pt-BR'), marginX + 128, cursorY + 13);

  if (paciente?.alergias && paciente.alergias.length > 0) {
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(225, 29, 72); // Rose
    pdf.text('ALERGIAS:', marginX + 4, cursorY + 20);
    pdf.setFont('helvetica', 'normal');
    pdf.text(paciente.alergias.join(', '), marginX + 25, cursorY + 20);
  }

  cursorY += 34;

  // Resultado do Instrumento
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(15, 23, 42);
  pdf.text(`Instrumento: ${relatorio.teste_nome}`, marginX, cursorY);
  cursorY += 6;

  // Destaque de Pontuação
  pdf.setFillColor(240, 253, 250); // Teal 50
  pdf.setDrawColor(20, 184, 166); // Teal 500
  pdf.setLineWidth(0.8);
  pdf.roundedRect(marginX, cursorY, 170, 18, 2, 2, 'FD');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(15, 118, 110);
  pdf.text(
    `Escore Obtido: ${relatorio.pontuacao_obtida} de ${relatorio.pontuacao_maxima} pontos`,
    marginX + 6,
    cursorY + 7
  );

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(15, 23, 42);
  pdf.text(`Classificação: ${relatorio.classificacao}`, marginX + 6, cursorY + 13);
  cursorY += 26;

  // Interpretação Clínica
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(30, 41, 59);
  pdf.text('Interpretação Clínica:', marginX, cursorY);
  cursorY += 5;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(51, 65, 85);
  const linhasInterp = pdf.splitTextToSize(relatorio.interpretacao_clinica, 170);
  pdf.text(linhasInterp, marginX, cursorY);
  cursorY += linhasInterp.length * 4.5 + 4;

  // Conduta Recomendada
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(30, 41, 59);
  pdf.text('Conduta Propedêutica e Terapêutica Proposta:', marginX, cursorY);
  cursorY += 5;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(51, 65, 85);
  const linhasConduta = pdf.splitTextToSize(relatorio.conduta_proposta, 170);
  pdf.text(linhasConduta, marginX, cursorY);
  cursorY += linhasConduta.length * 4.5 + 8;

  // Fonte e Referência Bibliográfica
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(100, 116, 139);
  pdf.text('Fonte Científica e Referência Bibliográfica Oficial:', marginX, cursorY);
  cursorY += 4;

  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(8);
  const linhasFonte = pdf.splitTextToSize(relatorio.referencia_bibliografica, 170);
  pdf.text(linhasFonte, marginX, cursorY);
  cursorY += linhasFonte.length * 4 + 14;

  // Assinatura do Médico
  if (cursorY > 240) {
    pdf.addPage('a4', 'portrait');
    cursorY = 40;
  }

  const posXAssinatura = 110;
  pdf.setDrawColor(148, 163, 184);
  pdf.setLineWidth(0.5);
  pdf.line(posXAssinatura, cursorY, posXAssinatura + 75, cursorY);
  cursorY += 5;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(15, 23, 42);
  pdf.text(perfilMedico.nome_completo, posXAssinatura + 5, cursorY);
  cursorY += 4;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(71, 85, 105);
  pdf.text(
    `CRM/${perfilMedico.uf_crm} ${perfilMedico.crm} ${
      perfilMedico.especialidade ? `• ${perfilMedico.especialidade}` : ''
    }`,
    posXAssinatura + 5,
    cursorY
  );

  const safeNome = (paciente ? paciente.nome_completo : relatorio.paciente_nome)
    .replace(/[^a-zA-Z0-9]/g, '_')
    .substring(0, 20);
  const safeTeste = relatorio.teste_nome.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 15);
  pdf.save(`Laudo_${safeTeste}_${safeNome}.pdf`);
}
