import React from 'react';

/**
 * Renderizador mínimo do Markdown usado nos protocolos (títulos, listas, parágrafos, **negrito**, *itálico* e `código`).
 * Gera elementos React diretamente: nenhum HTML do conteúdo é interpretado, então não há risco de injeção.
 */

function renderizarTrechosInline(texto: string, chaveBase: string): React.ReactNode[] {
  const partes: React.ReactNode[] = [];
  const padrao = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*\s][^*]*\*)/g;
  let ultimoIndice = 0;
  let correspondencia: RegExpExecArray | null;
  let contador = 0;

  while ((correspondencia = padrao.exec(texto)) !== null) {
    if (correspondencia.index > ultimoIndice) {
      partes.push(texto.slice(ultimoIndice, correspondencia.index));
    }
    const trecho = correspondencia[0];
    const chave = `${chaveBase}-${contador++}`;
    if (trecho.startsWith('**')) {
      partes.push(<strong key={chave} className="font-semibold text-slate-100">{trecho.slice(2, -2)}</strong>);
    } else if (trecho.startsWith('`')) {
      partes.push(<code key={chave} className="font-mono text-teal-300 bg-slate-900 px-1 rounded">{trecho.slice(1, -1)}</code>);
    } else {
      partes.push(<em key={chave} className="text-slate-200">{trecho.slice(1, -1)}</em>);
    }
    ultimoIndice = correspondencia.index + trecho.length;
  }

  if (ultimoIndice < texto.length) {
    partes.push(texto.slice(ultimoIndice));
  }
  return partes;
}

interface ItemLista {
  nivel: number;
  ordenado: boolean;
  texto: string;
}

export const MarkdownSimples: React.FC<{ conteudo: string }> = ({ conteudo }) => {
  const blocos: React.ReactNode[] = [];
  let itensPendentes: ItemLista[] = [];
  let paragrafoPendente: string[] = [];

  const descarregarParagrafo = () => {
    if (paragrafoPendente.length === 0) return;
    const chave = `p-${blocos.length}`;
    blocos.push(
      <p key={chave} className="text-slate-300">
        {renderizarTrechosInline(paragrafoPendente.join(' '), chave)}
      </p>
    );
    paragrafoPendente = [];
  };

  const descarregarLista = () => {
    if (itensPendentes.length === 0) return;
    const chave = `l-${blocos.length}`;
    const ordenada = itensPendentes[0].ordenado;
    const Tag = ordenada ? 'ol' : 'ul';
    blocos.push(
      <Tag key={chave} className={`space-y-1 pl-5 ${ordenada ? 'list-decimal' : 'list-disc'} marker:text-teal-500`}>
        {itensPendentes.map((item, indice) => (
          <li
            key={`${chave}-${indice}`}
            className={item.nivel > 0 ? 'ml-5 list-[circle] text-slate-400' : 'text-slate-300'}
          >
            {renderizarTrechosInline(item.texto, `${chave}-${indice}`)}
          </li>
        ))}
      </Tag>
    );
    itensPendentes = [];
  };

  for (const linhaOriginal of conteudo.split('\n')) {
    const linha = linhaOriginal.replace(/\s+$/, '');
    const titulo = /^(#{1,4})\s+(.*)$/.exec(linha);
    const itemLista = /^(\s*)([-*]|\d+[.)])\s+(.*)$/.exec(linha);

    if (!linha.trim()) {
      descarregarParagrafo();
      descarregarLista();
    } else if (titulo) {
      descarregarParagrafo();
      descarregarLista();
      const nivel = titulo[1].length;
      const chave = `h-${blocos.length}`;
      const classe =
        nivel <= 2
          ? 'text-sm font-bold text-slate-100 pt-2'
          : 'text-xs font-bold text-teal-300 uppercase tracking-wider pt-1';
      blocos.push(
        <h4 key={chave} className={classe}>
          {renderizarTrechosInline(titulo[2], chave)}
        </h4>
      );
    } else if (itemLista) {
      descarregarParagrafo();
      itensPendentes.push({
        nivel: itemLista[1].length >= 2 ? 1 : 0,
        ordenado: /\d/.test(itemLista[2]),
        texto: itemLista[3],
      });
    } else if (itensPendentes.length > 0 && /^\s+/.test(linha)) {
      // Continuação de um item de lista quebrado em várias linhas
      itensPendentes[itensPendentes.length - 1].texto += ` ${linha.trim()}`;
    } else {
      descarregarLista();
      paragrafoPendente.push(linha.trim());
    }
  }
  descarregarParagrafo();
  descarregarLista();

  return <div className="space-y-2.5 text-xs leading-relaxed">{blocos}</div>;
};
