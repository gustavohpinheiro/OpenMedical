import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AlertTriangle, ExternalLink, FileText, FileUp, Loader2, Trash2, Upload } from 'lucide-react';
import type { BulaAnalisada } from '../bula_parser';
import type { BulaImportada as BulaImportadaDados, BulaImportadaResumo } from '../types';
import {
  consultarBulaAnvisa,
  listarBulasImportadas,
  obterBulasImportadas,
  removerBulaImportada,
  salvarBulaImportada,
} from '../api';
import { urlBularioAnvisa } from '../ligacao_ftn';

const TAMANHO_MAXIMO_PDF = 30 * 1024 * 1024;

const dataBr = (iso: string) => (/^\d{4}-\d{2}-\d{2}/.test(iso) ? iso.slice(0, 10).split('-').reverse().join('/') : iso);
const rotuloTipo = (tipo: string) => (tipo === 'profissional' ? 'Bula do profissional' : 'Bula do paciente');
const rotuloOrigem = (origem: string) =>
  origem === 'manual' ? 'PDF importado' : origem.startsWith('laboratorio:') ? `Site do laboratório (${origem.slice(12)})` : origem;

type Etapa =
  | { fase: 'ocioso' }
  | { fase: 'lendo'; nomeArquivo: string }
  | { fase: 'revisar'; analise: BulaAnalisada; hash: string; nomeArquivo: string; avisos: string[]; registro: string }
  | { fase: 'gravando' }
  | { fase: 'erro'; mensagem: string };

interface ImportadorProps {
  /** Registro do produto aberto na tela (CMED/ANVISA); vazio na lista geral de bulas importadas */
  registroEsperado?: string;
  nomeEsperado?: string;
  onImportada: (resumo: BulaImportadaResumo) => void;
  compacto?: boolean;
}

/**
 * Importa o PDF da bula baixado no Bulário Eletrônico: extrai o texto, separa as seções da RDC 47/2009 e mostra
 * o resultado para conferência antes de gravar. A verificação antirrobô do Bulário é resolvida pela própria pessoa.
 */
export const ImportadorBulaPdf: React.FC<ImportadorProps> = ({ registroEsperado = '', nomeEsperado, onImportada, compacto }) => {
  const [etapa, setEtapa] = useState<Etapa>({ fase: 'ocioso' });
  const [arrastando, setArrastando] = useState(false);
  const entrada = useRef<HTMLInputElement>(null);
  const digitosEsperados = registroEsperado.replace(/\D/g, '').slice(0, 9);

  const lerArquivo = useCallback(
    async (arquivo: File) => {
      if (!/\.pdf$/i.test(arquivo.name) && arquivo.type !== 'application/pdf') {
        setEtapa({ fase: 'erro', mensagem: 'Escolha o arquivo PDF da bula.' });
        return;
      }
      if (arquivo.size > TAMANHO_MAXIMO_PDF) {
        setEtapa({ fase: 'erro', mensagem: 'PDF maior que 30 MB: não parece uma bula.' });
        return;
      }
      setEtapa({ fase: 'lendo', nomeArquivo: arquivo.name });
      try {
        const [{ extrairTextoPdf, hashArquivo }, { analisarBula }] = await Promise.all([
          import('../leitor_pdf'),
          import('../bula_parser'),
        ]);
        const dados = await arquivo.arrayBuffer();
        const hash = await hashArquivo(dados);
        const analise = analisarBula(await extrairTextoPdf(dados));
        const registro = analise.registro || digitosEsperados;
        const avisos: string[] = [];
        if (analise.registro && digitosEsperados && analise.registro !== digitosEsperados) {
          avisos.push(
            `O PDF é do registro ${analise.registro} (${analise.nome_produto || 'produto sem nome'}), não do produto aberto` +
              `${nomeEsperado ? ` (${nomeEsperado}, ` : ' ('}${digitosEsperados}). A bula será gravada no registro do PDF.`
          );
        }
        if (!analise.registro && digitosEsperados) {
          avisos.push(`O PDF não traz o número de registro: será gravado no registro do produto aberto (${digitosEsperados}).`);
        }
        if (registro) {
          const [vigente, existentes] = await Promise.all([
            consultarBulaAnvisa(registro).catch(() => null),
            obterBulasImportadas(registro).catch(() => []),
          ]);
          if (vigente?.data_publicacao && analise.data_aprovacao && analise.data_aprovacao < vigente.data_publicacao) {
            avisos.push(
              `Este PDF foi aprovado em ${dataBr(analise.data_aprovacao)}, mas a bula vigente no Bulário é de ` +
                `${dataBr(vigente.data_publicacao)}. Prefira baixar a versão atual.`
            );
          }
          const mesmoArquivo = existentes.find((b) => b.hash_arquivo === hash);
          if (mesmoArquivo) avisos.push(`Este mesmo PDF já foi importado em ${dataBr(mesmoArquivo.data_importacao)}; gravar de novo só substitui.`);
          const mesmoTipo = existentes.find((b) => b.tipo === analise.tipo && b.hash_arquivo !== hash);
          if (mesmoTipo) avisos.push(`Já existe uma ${rotuloTipo(analise.tipo).toLowerCase()} deste produto: ela será substituída.`);
        }
        if (analise.tipo === 'paciente') {
          avisos.push('É a bula do paciente. A do profissional de saúde tem a posologia mais detalhada, quando disponível.');
        }
        setEtapa({ fase: 'revisar', analise, hash, nomeArquivo: arquivo.name, avisos, registro });
      } catch (erro) {
        setEtapa({ fase: 'erro', mensagem: erro instanceof Error ? erro.message : String(erro) });
      }
    },
    [digitosEsperados, nomeEsperado]
  );

  const gravar = async () => {
    if (etapa.fase !== 'revisar') return;
    const { analise, hash, registro } = etapa;
    const digitos = registro.replace(/\D/g, '');
    if (digitos.length < 9) return;
    setEtapa({ fase: 'gravando' });
    try {
      const resumo = await salvarBulaImportada({
        registro: digitos.slice(0, 9),
        tipo: analise.tipo,
        nome_produto: analise.nome_produto || nomeEsperado || '',
        principios_ativos: analise.principios_ativos,
        empresa: analise.empresa,
        cnpj: analise.cnpj,
        data_bula: analise.data_aprovacao,
        origem: 'manual',
        url_origem: '',
        data_importacao: '',
        hash_arquivo: hash,
        cabecalho: analise.cabecalho,
        secoes: analise.secoes,
      });
      setEtapa({ fase: 'ocioso' });
      onImportada(resumo);
    } catch (erro) {
      setEtapa({ fase: 'erro', mensagem: erro instanceof Error ? erro.message : String(erro) });
    }
  };

  if (etapa.fase === 'revisar') {
    const { analise } = etapa;
    const registroValido = etapa.registro.replace(/\D/g, '').length >= 9;
    return (
      <div className="p-4 bg-slate-950 border border-sky-700/50 rounded-xl space-y-3 text-xs">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-[10px] text-sky-300 font-bold uppercase tracking-wider">Conferir antes de gravar</div>
            <div className="text-sm font-bold text-slate-100">{analise.nome_produto || 'Produto sem nome no PDF'}</div>
            <div className="text-slate-400">
              {rotuloTipo(analise.tipo)}
              {analise.empresa && ` · ${analise.empresa}`}
              {analise.data_aprovacao && ` · aprovada pela ANVISA em ${dataBr(analise.data_aprovacao)}`}
            </div>
          </div>
          <span className="text-[10px] text-slate-500 font-mono truncate max-w-[40%]" title={etapa.nomeArquivo}>
            {etapa.nomeArquivo}
          </span>
        </div>

        <label className="block space-y-1">
          <span className="text-[11px] text-slate-400 font-semibold">Registro do produto na ANVISA (9 dígitos)</span>
          <input
            value={etapa.registro}
            onChange={(e) => setEtapa({ ...etapa, registro: e.target.value })}
            inputMode="numeric"
            placeholder="Ex.: 1.0573.0574"
            className="w-full bg-slate-900 border border-slate-700 focus:border-sky-500 rounded-lg px-3 py-2 font-mono text-slate-100 focus:outline-none"
          />
          {!registroValido && (
            <span className="text-[11px] text-amber-300">
              O PDF não traz o registro. Ele aparece nos dizeres legais da bula ("MS 1.xxxx.xxxx") e na embalagem.
            </span>
          )}
        </label>

        <div className="text-slate-300">
          <span className="font-semibold">{analise.secoes.length} seções encontradas: </span>
          {analise.secoes.map((s) => s.titulo.replace(/\?$/, '')).join(' · ')}
        </div>

        {etapa.avisos.map((aviso) => (
          <div key={aviso} className="flex gap-2 p-2.5 bg-amber-950/40 border border-amber-700/50 rounded-lg text-[11px] text-amber-200">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-400" />
            <span>{aviso}</span>
          </div>
        ))}

        <div className="flex flex-wrap gap-2">
          <button
            onClick={gravar}
            disabled={!registroValido}
            className="bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-bold"
          >
            Gravar bula
          </button>
          <button onClick={() => setEtapa({ fase: 'ocioso' })} className="text-slate-300 hover:text-white px-3 py-2 rounded-lg">
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  const ocupado = etapa.fase === 'lendo' || etapa.fase === 'gravando';
  return (
    <div className="space-y-2">
      <div
        role="button"
        tabIndex={0}
        aria-label="Importar o PDF da bula"
        onClick={() => !ocupado && entrada.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !ocupado) {
            e.preventDefault();
            entrada.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setArrastando(true);
        }}
        onDragLeave={() => setArrastando(false)}
        onDrop={(e) => {
          e.preventDefault();
          setArrastando(false);
          const arquivo = e.dataTransfer.files[0];
          if (arquivo && !ocupado) lerArquivo(arquivo);
        }}
        className={`flex items-center gap-3 border border-dashed rounded-xl cursor-pointer transition-all ${
          compacto ? 'p-3' : 'p-4'
        } ${arrastando ? 'border-sky-400 bg-sky-950/50' : 'border-slate-700 bg-slate-950 hover:border-sky-600 hover:bg-sky-950/20'}`}
      >
        {ocupado ? <Loader2 className="w-5 h-5 text-sky-400 animate-spin" /> : <FileUp className="w-5 h-5 text-sky-400" />}
        <div className="text-xs">
          <div className="font-bold text-slate-100">
            {etapa.fase === 'lendo' ? `Lendo ${etapa.nomeArquivo}...` : etapa.fase === 'gravando' ? 'Gravando...' : 'Importar PDF da bula'}
          </div>
          {!ocupado && (
            <div className="text-slate-400">
              Baixe o PDF no Bulário da ANVISA e arraste aqui (ou clique para escolher). O texto é separado em seções para
              consulta offline.
            </div>
          )}
        </div>
        <input
          ref={entrada}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => {
            const arquivo = e.target.files?.[0];
            e.target.value = '';
            if (arquivo) lerArquivo(arquivo);
          }}
        />
      </div>
      {etapa.fase === 'erro' && (
        <div role="alert" className="flex gap-2 p-2.5 bg-rose-950/50 border border-rose-700/60 rounded-lg text-[11px] text-rose-200">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span>{etapa.mensagem}</span>
        </div>
      )}
    </div>
  );
};

interface VisualizadorProps {
  bulas: BulaImportadaDados[];
  onRemovida?: () => void;
}

/** Bula importada em abas: profissional/paciente e uma aba por seção (posologia primeiro). */
export const VisualizadorBula: React.FC<VisualizadorProps> = ({ bulas, onRemovida }) => {
  const [tipo, setTipo] = useState(bulas[0]?.tipo);
  const bula = bulas.find((b) => b.tipo === tipo) ?? bulas[0];
  const [secoesOrdenadas, setSecoesOrdenadas] = useState(bula?.secoes ?? []);
  const [chave, setChave] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;
    if (!bula) return;
    import('../bula_parser').then(({ secoesParaExibicao }) => {
      if (cancelado) return;
      const ordenadas = secoesParaExibicao(bula.secoes);
      setSecoesOrdenadas(ordenadas);
      setChave((atual) => (ordenadas.some((s) => s.chave === atual) ? atual : ordenadas[0]?.chave ?? null));
    });
    return () => {
      cancelado = true;
    };
  }, [bula]);

  if (!bula) return null;
  const secao = secoesOrdenadas.find((s) => s.chave === chave) ?? secoesOrdenadas[0];

  const remover = async () => {
    if (!window.confirm(`Remover a ${rotuloTipo(bula.tipo).toLowerCase()} de ${bula.nome_produto} deste aparelho?`)) return;
    await removerBulaImportada(bula.registro, bula.tipo);
    onRemovida?.();
  };

  return (
    <div className="p-4 bg-slate-950 border border-sky-800/50 rounded-xl space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="text-sm font-bold text-slate-100">{bula.nome_produto}</div>
          {bula.principios_ativos.length > 0 && bula.principios_ativos[0] !== bula.nome_produto && (
            <div className="text-[11px] text-teal-300">{bula.principios_ativos.join(' + ')}</div>
          )}
          <div className="text-[11px] text-slate-400">
            {rotuloOrigem(bula.origem)}
            {bula.empresa && ` · ${bula.empresa}`}
            {bula.data_bula && ` · aprovada pela ANVISA em ${dataBr(bula.data_bula)}`}
            {` · reg. ${bula.registro}`}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {bula.url_origem && (
            <a
              href={bula.url_origem}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-sky-300 hover:text-sky-200 font-semibold"
            >
              PDF original <ExternalLink className="w-3 h-3" />
            </a>
          )}
          <button
            onClick={remover}
            className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-300"
            title="Remover esta bula importada"
          >
            <Trash2 className="w-3.5 h-3.5" /> Remover
          </button>
        </div>
      </div>

      {bulas.length > 1 && (
        <div className="flex gap-1.5">
          {bulas.map((b) => (
            <button
              key={b.tipo}
              onClick={() => setTipo(b.tipo)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold ${
                b.tipo === bula.tipo ? 'bg-sky-700 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {rotuloTipo(b.tipo)}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1" role="tablist" aria-label="Seções da bula">
        {secoesOrdenadas.map((s) => (
          <button
            key={s.chave}
            role="tab"
            aria-selected={s.chave === secao?.chave}
            onClick={() => setChave(s.chave)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap ${
              s.chave === secao?.chave ? 'bg-teal-700 text-white' : 'bg-slate-850 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {s.titulo.replace(/\?$/, '')}
          </button>
        ))}
      </div>

      {secao && (
        <div role="tabpanel" className="text-xs text-slate-200 leading-relaxed whitespace-pre-line max-h-[420px] overflow-y-auto pr-1">
          {secao.texto || 'Seção sem texto no PDF.'}
        </div>
      )}

      <p className="text-[10px] text-slate-500">
        Texto extraído automaticamente do PDF da bula. Tabelas e fórmulas podem sair desalinhadas: confira no documento oficial.
      </p>
    </div>
  );
};

interface BulaDoProdutoProps {
  numeroRegistro: string;
  nomeProduto: string;
}

/** Bula importada do produto (se houver) ou o campo para importar o PDF. */
export const BulaImportadaDoProduto: React.FC<BulaDoProdutoProps> = ({ numeroRegistro, nomeProduto }) => {
  const [bulas, setBulas] = useState<BulaImportadaDados[] | null>(null);
  const [substituindo, setSubstituindo] = useState(false);
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    let cancelado = false;
    setBulas(null);
    obterBulasImportadas(numeroRegistro)
      .then((lista) => !cancelado && setBulas(lista))
      .catch(() => !cancelado && setBulas([]));
    return () => {
      cancelado = true;
    };
  }, [numeroRegistro, versao]);

  const recarregar = () => {
    setSubstituindo(false);
    setVersao((v) => v + 1);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-sky-400" /> Bula do produto (PDF importado)
        </span>
        {bulas && bulas.length > 0 && (
          <button onClick={() => setSubstituindo((s) => !s)} className="text-[11px] text-sky-300 hover:text-sky-200 font-semibold inline-flex items-center gap-1">
            <Upload className="w-3.5 h-3.5" /> {substituindo ? 'Fechar' : 'Importar outro PDF'}
          </button>
        )}
      </div>
      {bulas === null && <div className="text-[11px] text-slate-500">Procurando bula importada...</div>}
      {bulas && bulas.length > 0 && <VisualizadorBula key={`${numeroRegistro}-${versao}`} bulas={bulas} onRemovida={recarregar} />}
      {bulas && (bulas.length === 0 || substituindo) && (
        <>
          {bulas.length === 0 && (
            <p className="text-[11px] text-slate-400">
              Nenhuma bula importada para este produto.{' '}
              <a
                href={urlBularioAnvisa(numeroRegistro, nomeProduto)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-300 hover:text-sky-200 font-semibold"
              >
                Abrir no Bulário da ANVISA
              </a>
              , baixar o PDF e importar aqui.
            </p>
          )}
          <ImportadorBulaPdf registroEsperado={numeroRegistro} nomeEsperado={nomeProduto} onImportada={recarregar} compacto />
        </>
      )}
    </div>
  );
};

interface ListaProps {
  /** Registro a abrir (busca global ou clique em nome) */
  registroInicial?: string | null;
}

/** Todas as bulas importadas neste aparelho, com o importador geral. */
export const BulasImportadasView: React.FC<ListaProps> = ({ registroInicial }) => {
  const [lista, setLista] = useState<BulaImportadaResumo[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [selecionado, setSelecionado] = useState<string | null>(registroInicial ?? null);
  const [bulas, setBulas] = useState<BulaImportadaDados[]>([]);
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    if (registroInicial) setSelecionado(registroInicial);
  }, [registroInicial]);

  useEffect(() => {
    listarBulasImportadas()
      .then((itens) => {
        setLista(itens);
        setErro(null);
        setSelecionado((atual) => atual ?? itens[0]?.registro ?? null);
      })
      .catch((e) => setErro(e instanceof Error ? e.message : String(e)));
  }, [versao]);

  useEffect(() => {
    if (!selecionado) {
      setBulas([]);
      return;
    }
    let cancelado = false;
    obterBulasImportadas(selecionado).then((b) => !cancelado && setBulas(b)).catch(() => !cancelado && setBulas([]));
    return () => {
      cancelado = true;
    };
  }, [selecionado, versao]);

  // Uma linha por produto (profissional e paciente juntos)
  const produtos = Array.from(new Map((lista ?? []).map((b) => [b.registro, b])).values());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <ImportadorBulaPdf
          onImportada={(resumo) => {
            setSelecionado(resumo.registro);
            setVersao((v) => v + 1);
          }}
        />
        <div className="text-xs pb-2 border-b border-slate-800 text-slate-300 font-bold uppercase tracking-wider">
          Bulas importadas ({produtos.length})
        </div>
        {erro && <div className="text-[11px] text-rose-300">{erro}</div>}
        {lista && produtos.length === 0 && (
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Nenhuma bula importada ainda. Também dá para importar pelo detalhe de cada produto da CMED, que já sabe o
            registro.
          </p>
        )}
        <div className="space-y-2 max-h-[560px] overflow-y-auto">
          {produtos.map((b) => {
            const tipos = (lista ?? []).filter((x) => x.registro === b.registro).map((x) => x.tipo);
            return (
              <button
                key={b.registro}
                onClick={() => setSelecionado(b.registro)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  selecionado === b.registro
                    ? 'bg-sky-950/60 border-sky-500'
                    : 'bg-slate-850/60 border-slate-800 hover:bg-slate-800/80'
                }`}
              >
                <div className="text-xs font-bold text-slate-100">{b.nome_produto}</div>
                <div className="text-[10px] text-slate-400">
                  {b.empresa || 'Empresa não informada'} · reg. {b.registro}
                </div>
                <div className="text-[10px] text-sky-300/90">
                  {tipos.map(rotuloTipo).join(' + ')} · {rotuloOrigem(b.origem)}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="lg:col-span-7">
        {bulas.length > 0 ? (
          <VisualizadorBula key={`${selecionado}-${versao}`} bulas={bulas} onRemovida={() => setVersao((v) => v + 1)} />
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-400">
            Selecione uma bula importada para ler as seções.
          </div>
        )}
      </div>
    </div>
  );
};
