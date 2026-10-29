// Texto de um PDF no navegador e no app desktop, com o pdf.js carregado só quando alguém importa um arquivo (~1 MB).
import { textoDaPagina, type ItemTextoPdf } from './bula_parser';

const LIMITE_PAGINAS = 80;

export async function extrairTextoPdf(dados: ArrayBuffer): Promise<string> {
  const [pdfjs, { default: urlWorker }] = await Promise.all([
    import('pdfjs-dist'),
    import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
  ]);
  pdfjs.GlobalWorkerOptions.workerSrc = urlWorker;
  let documento;
  try {
    documento = await pdfjs.getDocument({ data: new Uint8Array(dados), verbosity: 0 }).promise;
  } catch (erro) {
    const nome = erro instanceof Error ? erro.name : '';
    if (nome === 'PasswordException') throw new Error('O PDF está protegido por senha.');
    throw new Error('O arquivo não é um PDF válido ou está corrompido.');
  }
  try {
    const paginas: string[] = [];
    for (let p = 1; p <= Math.min(documento.numPages, LIMITE_PAGINAS); p++) {
      const conteudo = await (await documento.getPage(p)).getTextContent();
      paginas.push(textoDaPagina(conteudo.items as ItemTextoPdf[]));
    }
    return paginas.join('\n');
  } finally {
    await documento.destroy();
  }
}

/** SHA-256 em hexadecimal: identifica o arquivo para não reimportar o mesmo PDF. */
export async function hashArquivo(dados: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', dados);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}
