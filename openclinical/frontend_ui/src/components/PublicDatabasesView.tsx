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
} from 'lucide-react';
import { LISTA_PCDT_OFICIAL_MS, ProtocoloPCDTOficial } from '../data/pcdt_oficial_ms';
import { LISTA_MEDICAMENTOS_ANVISA_OFICIAL, MedicamentoAnvisaOficial } from '../data/anvisa_medicamentos_publicos';
import { CATALOGO_CMED_NACIONAL, MedicamentoComercialCMED } from '../data/catalogo_cmed_nacional';
import { normalizarTexto, obterRegistroCmed } from '../api';

/** Registro aberto a partir da busca global; `versao` muda a cada clique para reabrir o mesmo item. */
export interface SelecaoBasePublica {
  tipo: 'cmed' | 'pcdt';
  id: number;
  versao: number;
}

interface PublicDatabasesViewProps {
  selecao?: SelecaoBasePublica | null;
  onCompararPrecos?: (termo: string) => void;
}

const LIMITE_ITENS_LISTA = 150;

export const PublicDatabasesView: React.FC<PublicDatabasesViewProps> = ({ selecao, onCompararPrecos }) => {
  const [abaAtiva, setAbaAtiva] = useState<'cmed' | 'pcdt' | 'anvisa'>('cmed');

  // Estado CMED (Remédios Registrados no Brasil)
  const [termoCmed, setTermoCmed] = useState('');
  const [filtroTipoCmed, setFiltroTipoCmed] = useState<string>('todos');
  const [cmedSelecionado, setCmedSelecionado] = useState<MedicamentoComercialCMED | null>(CATALOGO_CMED_NACIONAL[0] || null);
  const [copiadoCmed, setCopiadoCmed] = useState(false);
  const [erroCmed, setErroCmed] = useState<string | null>(null);

  // Estado PCDT
  const [termoPcdt, setTermoPcdt] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [pcdtSelecionado, setPcdtSelecionado] = useState<ProtocoloPCDTOficial>(LISTA_PCDT_OFICIAL_MS[0]);
  const [copiadoPcdt, setCopiadoPcdt] = useState(false);

  // Estado ANVISA
  const [termoAnvisa, setTermoAnvisa] = useState('');
  const [filtroClasse, setFiltroClasse] = useState<string>('todas');

  useEffect(() => {
    if (!selecao) return;
    if (selecao.tipo === 'pcdt') {
      const encontrado = LISTA_PCDT_OFICIAL_MS.find((p) => p.id_pcdt === selecao.id);
      setAbaAtiva('pcdt');
      if (encontrado) {
        setTermoPcdt('');
        setFiltroStatus('todos');
        setPcdtSelecionado(encontrado);
      }
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

  const copiarPrescricaoPcdt = () => {
    if (!pcdtSelecionado?.bloco_prescricao_copiavel) return;
    copiarTexto(pcdtSelecionado.bloco_prescricao_copiavel, setCopiadoPcdt);
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

  // Filtragem PCDT
  const pcdtsFiltrados = useMemo(() => {
    const t = normalizarTexto(termoPcdt);
    return LISTA_PCDT_OFICIAL_MS.filter((p) => {
      const matchTexto =
        !t ||
        normalizarTexto(p.nome_protocolo).includes(t) ||
        normalizarTexto(p.id_protocolo).includes(t) ||
        normalizarTexto(p.tipo_protocolo).includes(t) ||
        normalizarTexto(p.cids_relacionados.join(' ')).includes(t) ||
        normalizarTexto(p.farmacos_principais.join(' ')).includes(t);

      if (!matchTexto) return false;

      if (filtroStatus === 'aprovado') return p.status_conitec.toLowerCase().includes('aprovado');
      if (filtroStatus === 'atualizacao') return p.status_conitec.toLowerCase().includes('atualiza');
      if (filtroStatus === 'elaboracao') return p.status_conitec.toLowerCase().includes('elabora');
      if (filtroStatus === 'conitec') return p.status_conitec.toLowerCase().includes('conitec');

      return true;
    });
  }, [termoPcdt, filtroStatus]);

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
              <span>PCDT / CONITEC (83 Protocolos)</span>
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
          </div>
        </div>
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
                      <p className="text-xs text-teal-400 font-medium mt-0.5">{cmedSelecionado.substancia}</p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {onCompararPrecos && (
                        <button
                          onClick={() => onCompararPrecos(cmedSelecionado.nome_produto)}
                          className="flex items-center gap-2 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-600/50 text-emerald-300 hover:text-white px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex-shrink-0"
                          title="Localizar preços desta apresentação nas farmácias e Farmácia Popular"
                        >
                          <Store className="w-4 h-4 text-emerald-400" />
                          <span>Cotar em Farmácias</span>
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
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Preço Teto Consumidor (PMC)</span>
                      <p className="text-emerald-400 font-mono font-bold text-sm">R$ {cmedSelecionado.preco_maximo_consumidor.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Bloco de Receituário Copiável */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <FileCheck className="w-4 h-4 text-teal-400" /> Modelo de Receita (sem posologia)
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">PEC e-SUS / MV / Tasy</span>
                    </div>
                    <p className="text-[11px] text-amber-300/90">
                      A base CMED não traz posologia: preencha os campos [PREENCHER] antes de usar.
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

      {/* ABA 2: PCDT MINISTÉRIO DA SAÚDE */}
      {abaAtiva === 'pcdt' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-teal-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={termoPcdt}
                onChange={(e) => setTermoPcdt(e.target.value)}
                placeholder="Filtrar por protocolo (ex: Artrite, Asma, Diabetes, M05)..."
                className="w-full bg-slate-950 border border-slate-750 focus:border-teal-500 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto text-xs scrollbar-none">
              <span className="text-slate-400 font-semibold text-[11px] flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Status:
              </span>
              {[
                { id: 'todos', label: 'Todos (83)' },
                { id: 'aprovado', label: 'Aprovados CONITEC' },
                { id: 'atualizacao', label: 'Em Atualização' },
                { id: 'elaboracao', label: 'Em Elaboração' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setFiltroStatus(s.id)}
                  className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                    filtroStatus === s.id
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2.5 max-h-[720px] overflow-y-auto">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800 text-slate-300 font-bold uppercase tracking-wider">
                <span>Protocolos Encontrados ({pcdtsFiltrados.length})</span>
                {termoPcdt && (
                  <button onClick={() => setTermoPcdt('')} className="text-teal-400 hover:text-teal-300 text-[11px]">
                    Limpar
                  </button>
                )}
              </div>

              {pcdtsFiltrados.map((p) => {
                const ativo = pcdtSelecionado?.id_pcdt === p.id_pcdt;
                const eAprovado = p.status_conitec.toLowerCase().includes('aprovado');
                return (
                  <div
                    key={p.id_pcdt}
                    onClick={() => setPcdtSelecionado(p)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      ativo
                        ? 'bg-teal-950/70 border-teal-500 shadow-lg shadow-teal-950/50 ring-1 ring-teal-500/40'
                        : 'bg-slate-850/60 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[10px] font-mono text-slate-400 font-semibold">{p.tipo_protocolo}</span>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold ${
                          eAprovado
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                            : 'bg-amber-950 text-amber-300 border border-amber-700/60'
                        }`}
                      >
                        {p.status_conitec}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-100 leading-snug mb-1.5">{p.nome_protocolo}</div>

                    <div className="flex flex-wrap gap-1">
                      {p.cids_relacionados.slice(0, 3).map((cid) => (
                        <span key={cid} className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-px rounded font-mono">
                          {cid}
                        </span>
                      ))}
                      {p.cids_relacionados.length > 3 && (
                        <span className="text-[9px] text-slate-500">+{p.cids_relacionados.length - 3}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
              {pcdtSelecionado && (
                <>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-indigo-900/60 text-indigo-300 border border-indigo-700/60 px-2 py-0.5 rounded font-mono font-bold">
                          {pcdtSelecionado.tipo_protocolo}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded font-mono font-bold border ${
                            pcdtSelecionado.status_conitec.toLowerCase().includes('aprovado')
                              ? 'bg-emerald-900/60 text-emerald-300 border-emerald-700/60'
                              : 'bg-amber-900/60 text-amber-300 border-amber-700/60'
                          }`}
                        >
                          CONITEC: {pcdtSelecionado.status_conitec}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-100 leading-tight">
                        {pcdtSelecionado.nome_protocolo}
                      </h3>
                    </div>

                    {pcdtSelecionado.conteudo_curado && pcdtSelecionado.bloco_prescricao_copiavel && (
                      <button
                        onClick={copiarPrescricaoPcdt}
                        className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-teal-950/50 transition-all flex-shrink-0"
                      >
                        {copiadoPcdt ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                        <span>{copiadoPcdt ? 'Copiado!' : 'Copiar Modelo de Prescrição'}</span>
                      </button>
                    )}
                  </div>

                  {!pcdtSelecionado.conteudo_curado && (
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed">
                      A base pública do Ministério da Saúde traz apenas nome, tipo e status deste documento. CIDs, fármacos e
                      conduta não foram resumidos pelo projeto: consulte o texto oficial no portal da CONITEC (gov.br/conitec).
                    </div>
                  )}

                  {pcdtSelecionado.conteudo_curado && (
                  <>
                  <div className="p-3 bg-amber-950/40 border border-amber-700/50 rounded-xl text-[11px] text-amber-200 leading-relaxed">
                    Resumo redigido pelo projeto OpenClinical, pendente de revisão clínica. Não substitui o texto oficial do PCDT
                    (gov.br/conitec).
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">CIDs Cobertos no SUS:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {pcdtSelecionado.cids_relacionados.map((cid) => (
                        <span key={cid} className="bg-slate-800/90 border border-slate-700 text-teal-300 px-2 py-0.5 rounded text-xs font-mono font-bold">
                          {cid}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fármacos Incorporados:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {pcdtSelecionado.farmacos_principais.map((farmaco, i) => (
                        <span key={i} className="bg-slate-800 text-slate-200 border border-slate-700/80 px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5">
                          <Pill className="w-3 h-3 text-teal-400 opacity-80" />
                          <span>{farmaco}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-teal-400" /> Resumo da Conduta
                    </span>
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed">
                      {pcdtSelecionado.conduta_clinica}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <FileCheck className="w-4 h-4 text-emerald-400" /> Modelo de Prescrição & Dispensação SUS
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">PEC / Tasy / MV</span>
                    </div>
                    <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-teal-300 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto selection:bg-teal-700 selection:text-white">
                      {pcdtSelecionado.bloco_prescricao_copiavel}
                    </pre>
                  </div>
                  </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

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
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {anvisaFiltrados.slice(0, 50).map((m) => (
                    <tr key={m.id_anvisa} className="hover:bg-slate-850/80 transition-colors">
                      <td className="p-3.5 font-bold text-slate-100">{m.nome_produto}</td>
                      <td className="p-3.5 text-teal-300">{m.principio_ativo}</td>
                      <td className="p-3.5">{m.classe_terapeutica}</td>
                      <td className="p-3.5 font-mono text-[11px] text-slate-400">{m.numero_registro_anvisa}</td>
                      <td className="p-3.5 text-slate-400">{m.laboratorio_fabricante}</td>
                      <td className="p-3.5">
                        <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono">
                          {m.categoria_regulatoria}
                        </span>
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
