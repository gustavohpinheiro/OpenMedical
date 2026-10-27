import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Copy,
  Check,
  Calendar,
  Search,
  Pill,
  ShieldCheck,
  Sparkles,
  Filter,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { ProtocoloClinico } from '../types';
import { listarProtocolos } from '../api';
import { FARMACOS_POR_PROTOCOLO, CATEGORIAS_POR_PROTOCOLO } from '../catalog_protocolos';

interface ProtocolsViewProps {
  protocoloSelecionadoId?: string | null;
}

type CategoriaFiltro =
  | 'todos'
  | 'dipirona'
  | 'infecto'
  | 'cardio'
  | 'respiratorio'
  | 'gastro'
  | 'endocrino'
  | 'neuro'
  | 'urgencia';

export const ProtocolsView: React.FC<ProtocolsViewProps> = ({ protocoloSelecionadoId }) => {
  const [protocolos, setProtocolos] = useState<ProtocoloClinico[]>([]);
  const [selecionado, setSelecionado] = useState<ProtocoloClinico | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [termoFiltro, setTermoFiltro] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState<CategoriaFiltro>('todos');

  useEffect(() => {
    listarProtocolos().then((lista) => {
      setProtocolos(lista);
      if (protocoloSelecionadoId) {
        const achado = lista.find(
          (p) =>
            p.id_protocolo === protocoloSelecionadoId ||
            p.titulo === protocoloSelecionadoId ||
            p.titulo.toLowerCase().includes(protocoloSelecionadoId.toLowerCase())
        );
        if (achado) setSelecionado(achado);
        else if (lista.length > 0) setSelecionado(lista[0]);
      } else if (lista.length > 0) {
        setSelecionado(lista[0]);
      }
    });
  }, [protocoloSelecionadoId]);

  const copiarPrescricao = () => {
    if (!selecionado) return;
    navigator.clipboard.writeText(selecionado.bloco_prescricao_copiavel);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  // Filtragem combinada por termo e categoria médica
  const protocolosFiltrados = useMemo(() => {
    const t = termoFiltro.toLowerCase().trim();

    return protocolos.filter((p) => {
      const farmacos = (FARMACOS_POR_PROTOCOLO[p.id_protocolo] || []).join(' ').toLowerCase();
      const matchTexto =
        !t ||
        p.titulo.toLowerCase().includes(t) ||
        p.id_protocolo.toLowerCase().includes(t) ||
        p.cids_relacionados.join(' ').toLowerCase().includes(t) ||
        p.bloco_prescricao_copiavel.toLowerCase().includes(t) ||
        farmacos.includes(t);

      if (!matchTexto) return false;

      const cat = CATEGORIAS_POR_PROTOCOLO[p.id_protocolo] || '';

      if (categoriaAtiva === 'dipirona') {
        return farmacos.includes('dipirona') || p.bloco_prescricao_copiavel.toLowerCase().includes('dipirona');
      }
      if (categoriaAtiva === 'infecto') {
        return cat === 'infectologia' || cat === 'ginecologia';
      }
      if (categoriaAtiva === 'cardio') {
        return cat === 'cardiovascular' || cat === 'nefrologia';
      }
      if (categoriaAtiva === 'respiratorio') {
        return cat === 'respiratorio';
      }
      if (categoriaAtiva === 'gastro') {
        return cat === 'gastroenterologia';
      }
      if (categoriaAtiva === 'endocrino') {
        return cat === 'endocrinologia' || cat === 'reumatologia';
      }
      if (categoriaAtiva === 'neuro') {
        return cat === 'neurologia' || cat === 'saude_mental';
      }
      if (categoriaAtiva === 'urgencia') {
        return cat === 'urgencia' || cat === 'pediatria';
      }

      return true;
    });
  }, [protocolos, termoFiltro, categoriaAtiva]);

  return (
    <div className="space-y-6">
      {/* Barra de Filtro e Busca Rápida de Receitas */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="p-2.5 bg-teal-500/10 text-teal-400 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Central de Receitas & Condutas Clínicas (SUS e Mundiais)
                <span className="text-[10px] bg-teal-900/60 text-teal-300 border border-teal-700/60 px-2 py-0.5 rounded-full font-mono font-semibold">
                  45 Oficiais
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Prescrições estruturadas para prontuário eletrônico com orientações do MS, OMS, SBC, SBD, SBPT, GINA, GOLD e KDIGO
              </p>
            </div>
          </div>

          {/* Campo de Busca de Receitas */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-teal-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={termoFiltro}
              onChange={(e) => setTermoFiltro(e.target.value)}
              placeholder="Buscar receita (ex: Dipirona, Dengue, Amoxicilina, CID)..."
              className="w-full bg-slate-950 border border-slate-750 focus:border-teal-500 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Chips de Categorias Clínicas Rápidas */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filtros:
          </span>
          {[
            { id: 'todos', label: 'Todas as Receitas (45)' },
            { id: 'dipirona', label: '⭐ Dor & Febre (Dipirona)', highlight: true },
            { id: 'infecto', label: 'Infectologia & Arboviroses (18)' },
            { id: 'cardio', label: 'Cardio & Nefro (7)' },
            { id: 'respiratorio', label: 'Pneumologia & Asma (4)' },
            { id: 'gastro', label: 'Gastroenterologia (4)' },
            { id: 'endocrino', label: 'Endócrino & Reumato (5)' },
            { id: 'neuro', label: 'Neurologia & Saúde Mental (5)' },
            { id: 'urgencia', label: 'Urgência & Pediatria (2)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoriaAtiva(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                categoriaAtiva === cat.id
                  ? cat.highlight
                    ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-950/40 ring-1 ring-white/20'
                    : 'bg-teal-600 text-white shadow-md shadow-teal-950/40'
                  : 'bg-slate-800/80 border border-slate-750 text-slate-300 hover:bg-slate-750 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Principal: Lista Lateral e Visualizador */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Coluna 1: Lista de Receitas */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2.5 max-h-[750px] overflow-y-auto">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-800 text-xs">
            <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
              Receitas Disponíveis ({protocolosFiltrados.length})
            </span>
            {termoFiltro && (
              <button
                onClick={() => setTermoFiltro('')}
                className="text-teal-400 hover:text-teal-300 text-[11px]"
              >
                Limpar busca
              </button>
            )}
          </div>

          {protocolosFiltrados.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs space-y-1">
              <p className="font-semibold text-slate-300">Nenhuma receita encontrada para os filtros atuais.</p>
              <p className="text-slate-500">Tente buscar por &ldquo;Dipirona&rdquo;, &ldquo;Amoxicilina&rdquo; ou clique em &ldquo;Todas&rdquo;.</p>
            </div>
          )}

          {protocolosFiltrados.map((p) => {
            const ativo = selecionado?.id_protocolo === p.id_protocolo;
            const farmacos = FARMACOS_POR_PROTOCOLO[p.id_protocolo] || [];
            const temDipirona = farmacos.some((f) => f.toLowerCase().includes('dipirona'));

            return (
              <div
                key={p.id_protocolo}
                onClick={() => setSelecionado(p)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  ativo
                    ? 'bg-teal-950/60 border-teal-500 shadow-lg shadow-teal-950/50 ring-1 ring-teal-500/40'
                    : 'bg-slate-850/60 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-teal-400 font-mono text-[10px] uppercase tracking-wider">
                    {p.nivel_atencao.replace('_', ' ')}
                  </span>
                  <div className="flex gap-1">
                    {p.cids_relacionados.map((cid) => (
                      <span key={cid} className="bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded text-[10px] font-mono">
                        {cid}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-xs font-bold text-slate-100 leading-snug mb-2">
                  {p.titulo}
                </div>

                {/* Chips de Medicamentos da Receita */}
                <div className="flex flex-wrap gap-1">
                  {farmacos.map((f, i) => {
                    const eDipirona = f.toLowerCase().includes('dipirona');
                    return (
                      <span
                        key={i}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-medium flex items-center gap-1 ${
                          eDipirona
                            ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-700/60 font-semibold'
                            : 'bg-slate-800/90 text-slate-300 border border-slate-750'
                        }`}
                      >
                        <Pill className="w-2.5 h-2.5 opacity-70" />
                        <span>{f}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Coluna 2: Visualizador da Receita Selecionada */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          {selecionado ? (
            <>
              {/* Cabeçalho do Protocolo */}
              <div className="border-b border-slate-800 pb-4 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <h2 className="text-xl font-extrabold text-slate-100 leading-tight">
                      {selecionado.titulo}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] bg-teal-950 text-teal-300 border border-teal-700/60 px-2 py-0.5 rounded-full font-semibold">
                        {selecionado.nivel_atencao.replace('_', ' ')}
                      </span>
                      <span className="text-[11px] bg-slate-800 text-slate-300 border border-slate-750 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" /> Revisão: {selecionado.data_revisao}
                      </span>
                      <span className="text-[11px] bg-indigo-950 text-indigo-300 border border-indigo-700/50 px-2 py-0.5 rounded-full font-mono">
                        CIDs: {selecionado.cids_relacionados.join(', ')}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={copiarPrescricao}
                    className="flex items-center space-x-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-teal-950/40 flex-shrink-0"
                  >
                    {copiado ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-white" />}
                    <span>{copiado ? 'Prescrição Copiada!' : 'Copiar Prescrição Pronta'}</span>
                  </button>
                </div>
              </div>

              {/* Bloco Destaque: Receituário Médico Formatado */}
              <div className="bg-slate-950 border-2 border-teal-800/60 rounded-2xl p-5 space-y-3 shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center space-x-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-teal-400" />
                    <span>Modelo de Prescrição Médica para Prontuário / e-SUS</span>
                  </div>
                  <button
                    onClick={copiarPrescricao}
                    className="text-xs text-teal-300 hover:text-white flex items-center space-x-1 font-semibold"
                  >
                    {copiado ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiado ? 'Copiado!' : 'Copiar Texto'}</span>
                  </button>
                </div>

                <pre className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl text-slate-200 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed selection:bg-teal-500 selection:text-white">
                  {selecionado.bloco_prescricao_copiavel}
                </pre>
              </div>

              {/* Diretrizes Clínicas e Sinais de Alarme */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" /> Diretrizes de Diagnóstico & Sinais de Alarme
                </h3>
                <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-sans space-y-2">
                  {selecionado.conteudo_markdown}
                </div>
              </div>
            </>
          ) : (
            <div className="p-16 text-center text-slate-400 text-sm space-y-2">
              <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="font-semibold text-slate-300">Selecione uma receita à esquerda para visualizar.</p>
              <p className="text-xs text-slate-500">Ou utilize a barra de busca acima para localizar pelo nome do remédio.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
