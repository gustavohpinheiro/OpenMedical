import React, { useState, useMemo, useEffect } from 'react';
import {
  Database,
  Search,
  Copy,
  Check,
  FileCheck,
  Building2,
  Filter,
  Pill,
  BookOpen,
  DollarSign,
  Tag,
  ShieldCheck,
  Barcode,
  Store,
  FileText,
} from 'lucide-react';
import { LISTA_MEDICAMENTOS_ANVISA_OFICIAL, MedicamentoAnvisaOficial } from '../data/anvisa_medicamentos_publicos';
import { CATALOGO_CMED_NACIONAL, MedicamentoComercialCMED } from '../data/catalogo_cmed_nacional';
import { normalizarTexto, obterRegistroCmed } from '../api';
import { BotaoBulaAnvisa, BulaVigenteAnvisa, PosologiaFtnProduto } from './PosologiaFtnProduto';
import { AtualizacaoBases } from './AtualizacaoBases';
import { IntegracaoApiAnvisa } from './IntegracaoApiAnvisa';
import { LinkMedicamento } from './LinkMedicamento';
import { BulaImportadaDoProduto, BulasImportadasView } from './BulaImportada';
import { PcdtConitecView } from './PcdtConitecView';

/** Registro aberto a partir da busca global; `versao` muda a cada clique para reabrir o mesmo item. */
export type SelecaoBasePublica =
  | { tipo: 'cmed'; id: number; versao: number }
  /** PCDT pelo id, ou um título para filtrar a lista */
  | { tipo: 'pcdt'; id: number | string; versao: number }
  /** Bula importada, pelo registro de 9 dígitos */
  | { tipo: 'bula'; id: string; versao: number };

interface PublicDatabasesViewProps {
  selecao?: SelecaoBasePublica | null;
  onCompararPrecos?: (termoOuIdCmed: string | number) => void;
  onAbrirMonografia?: (idMonografia: number) => void;
}

const LIMITE_ITENS_LISTA = 150;

export const PublicDatabasesView: React.FC<PublicDatabasesViewProps> = ({ selecao, onCompararPrecos, onAbrirMonografia }) => {
  const [abaAtiva, setAbaAtiva] = useState<'cmed' | 'pcdt' | 'anvisa' | 'bulas'>('cmed');
  const [registroBulaInicial, setRegistroBulaInicial] = useState<string | null>(null);

  // Estado CMED (Remédios Registrados no Brasil)
  const [termoCmed, setTermoCmed] = useState('');
  const [filtroTipoCmed, setFiltroTipoCmed] = useState<string>('todos');
  const [cmedSelecionado, setCmedSelecionado] = useState<MedicamentoComercialCMED | null>(CATALOGO_CMED_NACIONAL[0] || null);
  const [copiadoCmed, setCopiadoCmed] = useState(false);
  const [erroCmed, setErroCmed] = useState<string | null>(null);

  // Estado ANVISA
  const [termoAnvisa, setTermoAnvisa] = useState('');
  const [filtroClasse, setFiltroClasse] = useState<string>('todas');

  useEffect(() => {
    if (!selecao) return;
    if (selecao.tipo === 'bula') {
      setAbaAtiva('bulas');
      setRegistroBulaInicial(selecao.id);
      return;
    }
    if (selecao.tipo === 'pcdt') {
      setAbaAtiva('pcdt');
      return;
    }

    setAbaAtiva('cmed');
    setErroCmed(null);
    let cancelado = false;
    obterRegistroCmed(selecao.id)
      .then((registro) => {
        if (!cancelado) setCmedSelecionado(registro);
      })
      .catch((erro) => {
        if (!cancelado) setErroCmed(erro instanceof Error ? erro.message : String(erro));
      });
    return () => {
      cancelado = true;
    };
  }, [selecao]);

  const copiarTexto = (texto: string, marcarCopiado: (valor: boolean) => void) => {
    navigator.clipboard
      .writeText(texto)
      .then(() => {
        marcarCopiado(true);
        setTimeout(() => marcarCopiado(false), 2000);
      })
      .catch(() => window.alert('Não foi possível acessar a área de transferência. Selecione o texto e copie manualmente.'));
  };

  const copiarPrescricaoCmed = (med: MedicamentoComercialCMED) => {
    copiarTexto(med.receita_padrao_copiavel, setCopiadoCmed);
  };

  // Filtragem CMED (amostra offline; o catálogo completo de 26.635 apresentações está no app nativo)
  const cmedFiltrados = useMemo(() => {
    const t = normalizarTexto(termoCmed);
    return CATALOGO_CMED_NACIONAL.filter((m) => {
      const matchTexto =
        !t ||
        normalizarTexto(m.nome_produto).includes(t) ||
        normalizarTexto(m.substancia).includes(t) ||
        normalizarTexto(m.apresentacao).includes(t) ||
        normalizarTexto(m.laboratorio).includes(t) ||
        m.numero_registro.includes(t) ||
        m.codigo_ean.includes(t);

      if (!matchTexto) return false;

      if (filtroTipoCmed === 'generico') {
        return m.tipo_produto.toLowerCase().includes('genérico') || m.tipo_produto.toLowerCase().includes('generico');
      }
      if (filtroTipoCmed === 'novo') {
        return m.tipo_produto.toLowerCase().includes('novo') || m.tipo_produto.toLowerCase().includes('refer');
      }
      if (filtroTipoCmed === 'similar') {
        return m.tipo_produto.toLowerCase().includes('similar');
      }
      if (filtroTipoCmed === 'biologico') {
        return m.tipo_produto.toLowerCase().includes('biol');
      }

      return true;
    });
  }, [termoCmed, filtroTipoCmed]);

  // Filtragem ANVISA Geral
  const anvisaFiltrados = useMemo(() => {
    const t = normalizarTexto(termoAnvisa);
    return LISTA_MEDICAMENTOS_ANVISA_OFICIAL.filter((m) => {
      const matchTexto =
        !t ||
        normalizarTexto(m.nome_produto).includes(t) ||
        normalizarTexto(m.principio_ativo).includes(t) ||
        normalizarTexto(m.classe_terapeutica).includes(t) ||
        normalizarTexto(m.laboratorio_fabricante).includes(t) ||
        m.numero_registro_anvisa.includes(t);

      if (!matchTexto) return false;
      if (filtroClasse !== 'todas') return m.classe_terapeutica.toLowerCase().includes(filtroClasse.toLowerCase());
      return true;
    });
  }, [termoAnvisa, filtroClasse]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho de Identificação da Fonte Pública */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col xl:flex-row gap-4 xl:items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100">Bases Públicas Oficiais do Brasil (ANVISA / CMED / MS)</h2>
                <span className="text-[10px] bg-emerald-900/60 text-emerald-300 border border-emerald-700/60 px-2.5 py-0.5 rounded-full font-mono font-semibold">
                  {CATALOGO_CMED_NACIONAL.length.toLocaleString('pt-BR')} de 26.635 apresentações offline
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Identificação, registro e preço máximo (PMC) das apresentações CMED, lista de PCDT do MS e registros ANVISA.
                Aqui fica uma amostra offline; o catálogo completo é pesquisável pela busca global (Ctrl+K) no app desktop.
              </p>
            </div>
          </div>

          {/* Abas Alternadoras das Fontes */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setAbaAtiva('cmed')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                abaAtiva === 'cmed'
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Pill className="w-4 h-4" />
              <span>Remédios do Brasil (CMED)</span>
            </button>
            <button
              onClick={() => setAbaAtiva('pcdt')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                abaAtiva === 'pcdt'
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>PCDT / CONITEC</span>
            </button>
            <button
              onClick={() => setAbaAtiva('anvisa')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                abaAtiva === 'anvisa'
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Registro ANVISA</span>
            </button>
            <button
              onClick={() => setAbaAtiva('bulas')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                abaAtiva === 'bulas'
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Bulas importadas (PDF)</span>
            </button>
          </div>
        </div>
        <AtualizacaoBases />
        <IntegracaoApiAnvisa />
      </div>

      {/* ABA 1: CATÁLOGO NACIONAL CMED / ANVISA (TODOS OS REMÉDIOS DO BRASIL) */}
      {abaAtiva === 'cmed' && (
        <div className="space-y-6">
          {/* Barra de Busca e Filtros CMED */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-teal-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={termoCmed}
                onChange={(e) => setTermoCmed(e.target.value)}
                placeholder="Buscar por produto, substância DCB ou laboratório..."
                className="w-full bg-slate-950 border border-slate-750 focus:border-teal-500 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto text-xs scrollbar-none">
              <span className="text-slate-400 font-semibold text-[11px] flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Tipo:
              </span>
              {[
                { id: 'todos', label: 'Todos os Tipos' },
                { id: 'novo', label: 'Referência / Novo' },
                { id: 'generico', label: 'Genérico' },
                { id: 'similar', label: 'Similar' },
                { id: 'biologico', label: 'Biológico' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setFiltroTipoCmed(s.id)}
                  className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                    filtroTipoCmed === s.id
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Principal CMED: Lista e Detalhe da Receita */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Lista Lateral de Medicamentos Comerciais */}
            <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2.5 max-h-[720px] overflow-y-auto">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800 text-slate-300 font-bold uppercase tracking-wider">
                <span>Medicamentos Encontrados ({cmedFiltrados.length})</span>
                {termoCmed && (
                  <button onClick={() => setTermoCmed('')} className="text-teal-400 hover:text-teal-300 text-[11px]">
                    Limpar
                  </button>
                )}
              </div>

              {cmedFiltrados.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-400">
                  Nenhuma apresentação da amostra offline corresponde ao filtro.
                </div>
              )}

              {cmedFiltrados.slice(0, LIMITE_ITENS_LISTA).map((m) => {
                const ativo = cmedSelecionado?.id_cmed === m.id_cmed;
                return (
                  <div
                    key={m.id_cmed}
                    onClick={() => setCmedSelecionado(m)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      ativo
                        ? 'bg-teal-950/70 border-teal-500 shadow-lg shadow-teal-950/50 ring-1 ring-teal-500/40'
                        : 'bg-slate-850/60 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[10px] bg-slate-800 text-teal-300 px-2 py-0.5 rounded font-mono font-bold">
                        {m.tipo_produto || 'Medicamento'}
                      </span>
                      {m.preco_maximo_consumidor > 0 && (
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">
                          PMC R$ {m.preco_maximo_consumidor.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-bold text-slate-100 leading-snug">{m.nome_produto}</div>
                    <div className="text-[11px] text-teal-300/90 font-medium mb-1">{m.substancia}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-1">{m.apresentacao}</div>
                    <div className="text-[9px] text-slate-500 mt-1 flex justify-between items-center">
                      <span>{m.laboratorio}</span>
                      <span className="font-mono">Reg. {m.numero_registro}</span>
                    </div>
                  </div>
                );
              })}

              {cmedFiltrados.length > LIMITE_ITENS_LISTA && (
                <div className="pt-2 text-center text-[11px] text-slate-400">
                  Mostrando {LIMITE_ITENS_LISTA} de {cmedFiltrados.length}. Refine a busca para ver os demais.
                </div>
              )}
            </div>

            {/* Painel da Receita Médica do Remédio */}
            <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
              {erroCmed && (
                <div role="alert" className="p-3 bg-rose-950/50 border border-rose-700/60 rounded-xl text-xs text-rose-200">
                  {erroCmed}
                </div>
              )}
              {cmedSelecionado ? (
                <>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-teal-900/60 text-teal-300 border border-teal-700/60 px-2 py-0.5 rounded font-mono font-bold">
                          {cmedSelecionado.tipo_produto}
                        </span>
                        <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                          {cmedSelecionado.tarja}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-100 leading-tight">
                        {cmedSelecionado.nome_produto}
                      </h3>
                      <p className="text-xs text-teal-400 font-medium mt-0.5">
                        <LinkMedicamento nome={cmedSelecionado.substancia} />
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <BotaoBulaAnvisa
                        numeroRegistro={cmedSelecionado.numero_registro}
                        nomeProduto={cmedSelecionado.nome_produto}
                      />
                      {onCompararPrecos && (
                        <button
                          onClick={() => onCompararPrecos(cmedSelecionado.id_cmed)}
                          className="flex items-center gap-2 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-600/50 text-emerald-300 hover:text-white px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex-shrink-0"
                          title="Preço máximo, Farmácia Popular e busca de preço nas farmácias"
                        >
                          <Store className="w-4 h-4 text-emerald-400" />
                          <span>Preço & Farmácia Popular</span>
                        </button>
                      )}
                      <button
                        onClick={() => copiarPrescricaoCmed(cmedSelecionado)}
                        className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-teal-950/50 transition-all flex-shrink-0"
                      >
                        {copiadoCmed ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                        <span>{copiadoCmed ? 'Modelo Copiado!' : 'Copiar Modelo de Receita'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Informações Regulatórias da Apresentação */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Apresentação</span>
                      <p className="text-slate-200 font-medium">{cmedSelecionado.apresentacao}</p>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Fabricante</span>
                      <p className="text-slate-200 font-medium">{cmedSelecionado.laboratorio}</p>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Registro ANVISA</span>
                      <p className="text-slate-200 font-mono font-medium">{cmedSelecionado.numero_registro}</p>
                      <BulaVigenteAnvisa numeroRegistro={cmedSelecionado.numero_registro} />
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Preço Teto Consumidor (PMC)</span>
                      <p className="text-emerald-400 font-mono font-bold text-sm">R$ {cmedSelecionado.preco_maximo_consumidor.toFixed(2)}</p>
                    </div>
                  </div>

                  <BulaImportadaDoProduto
                    numeroRegistro={cmedSelecionado.numero_registro}
                    nomeProduto={cmedSelecionado.nome_produto}
                  />

                  <PosologiaFtnProduto
                    substancia={cmedSelecionado.substancia}
                    apresentacao={cmedSelecionado.apresentacao}
                    onAbrirMonografia={onAbrirMonografia}
                  />

                  {/* Bloco de Receituário Copiável */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <FileCheck className="w-4 h-4 text-teal-400" /> Modelo de Receita (sem posologia)
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">PEC e-SUS / MV / Tasy</span>
                    </div>
                    <p className="text-[11px] text-amber-300/90">
                      A base CMED não traz posologia: preencha os campos [PREENCHER] antes de usar, ou monte a receita
                      com posologia pela monografia do FTN, quando houver.
                    </p>
                    <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-teal-300 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto selection:bg-teal-700 selection:text-white">
                      {cmedSelecionado.receita_padrao_copiavel}
                    </pre>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Selecione um medicamento da lista para visualizar a apresentação e receita.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: PCDT DA CONITEC (lista oficial + conteúdo extraído dos PDFs) */}
      {abaAtiva === 'pcdt' && (
        <PcdtConitecView
          selecao={selecao?.tipo === 'pcdt' ? { id: selecao.id, versao: selecao.versao } : null}
          onAbrirMonografia={onAbrirMonografia}
        />
      )}

      {/* ABA 4: BULAS EM PDF IMPORTADAS (Bulário ou site do laboratório) */}
      {abaAtiva === 'bulas' && <BulasImportadasView registroInicial={registroBulaInicial} />}

      {/* ABA 3: MEDICAMENTOS ANVISA OFICIAL */}
      {abaAtiva === 'anvisa' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-teal-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={termoAnvisa}
                onChange={(e) => setTermoAnvisa(e.target.value)}
                placeholder="Buscar por produto, princípio ativo ou registro..."
                className="w-full bg-slate-950 border border-slate-750 focus:border-teal-500 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Amostra offline de registros ativos: <span className="text-teal-400 font-bold">{anvisaFiltrados.length}</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Nome Comercial</th>
                    <th className="p-3.5">Princípio Ativo</th>
                    <th className="p-3.5">Classe Terapêutica</th>
                    <th className="p-3.5">Nº Registro ANVISA</th>
                    <th className="p-3.5">Fabricante</th>
                    <th className="p-3.5">Categoria</th>
                    <th className="p-3.5">Bula</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {anvisaFiltrados.slice(0, 50).map((m) => (
                    <tr key={m.id_anvisa} className="hover:bg-slate-850/80 transition-colors">
                      <td className="p-3.5 font-bold text-slate-100">
                        <LinkMedicamento nome={m.principio_ativo}>{m.nome_produto}</LinkMedicamento>
                      </td>
                      <td className="p-3.5 text-teal-300">
                        <LinkMedicamento nome={m.principio_ativo} />
                      </td>
                      <td className="p-3.5">{m.classe_terapeutica}</td>
                      <td className="p-3.5 font-mono text-[11px] text-slate-400">{m.numero_registro_anvisa}</td>
                      <td className="p-3.5 text-slate-400">{m.laboratorio_fabricante}</td>
                      <td className="p-3.5">
                        <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono">
                          {m.categoria_regulatoria}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <BotaoBulaAnvisa numeroRegistro={m.numero_registro_anvisa} nomeProduto={m.nome_produto} compacto />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {anvisaFiltrados.length > 50 && (
              <div className="p-3 bg-slate-950 text-center text-xs text-slate-400 border-t border-slate-800">
                Mostrando os primeiros 50 registros de {anvisaFiltrados.length}. Utilize a busca para refinar.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
