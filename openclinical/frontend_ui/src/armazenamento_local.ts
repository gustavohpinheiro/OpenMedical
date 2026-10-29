// IndexedDB do navegador/PWA: guarda o que o usuário importa quando não há o banco SQLite do app desktop.
// O localStorage não serve aqui: limite de ~5 MB e bulas têm dezenas de KB cada.

const NOME_BANCO = 'openclinical';
const VERSAO_BANCO = 1;
export const LOJA_BULAS = 'bulas_importadas';

let conexao: Promise<IDBDatabase> | null = null;

function abrir(): Promise<IDBDatabase> {
  conexao ??= new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('Este navegador não permite guardar dados localmente (IndexedDB indisponível).'));
      return;
    }
    const pedido = indexedDB.open(NOME_BANCO, VERSAO_BANCO);
    pedido.onupgradeneeded = () => {
      const banco = pedido.result;
      if (!banco.objectStoreNames.contains(LOJA_BULAS)) banco.createObjectStore(LOJA_BULAS, { keyPath: ['registro', 'tipo'] });
    };
    pedido.onsuccess = () => resolve(pedido.result);
    pedido.onerror = () => reject(pedido.error ?? new Error('Falha ao abrir o armazenamento local'));
  }).catch((erro) => {
    conexao = null;
    throw erro;
  });
  return conexao;
}

function concluir<T>(pedido: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    pedido.onsuccess = () => resolve(pedido.result);
    pedido.onerror = () => reject(pedido.error ?? new Error('Falha no armazenamento local'));
  });
}

async function loja(nome: string, modo: IDBTransactionMode): Promise<IDBObjectStore> {
  return (await abrir()).transaction(nome, modo).objectStore(nome);
}

export async function lerTodos<T>(nome: string): Promise<T[]> {
  return concluir((await loja(nome, 'readonly')).getAll()) as Promise<T[]>;
}

export async function gravar<T>(nome: string, valor: T): Promise<void> {
  await concluir((await loja(nome, 'readwrite')).put(valor));
}

/** Devolve se a chave existia. */
export async function remover(nome: string, chave: IDBValidKey): Promise<boolean> {
  const armazem = await loja(nome, 'readwrite');
  const existente = await concluir(armazem.count(chave));
  if (existente === 0) return false;
  await concluir(armazem.delete(chave));
  return true;
}
