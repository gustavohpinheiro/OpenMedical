import React, { useState, useEffect } from 'react';
import {
  Search,
  Pill,
  Baby,
  ShieldAlert,
  Calculator,
  BookOpen,
  HeartPulse,
  WifiOff,
  Copy,
  Check,
  Sparkles,
  ChevronRight,
  Database,
  Clock,
  FileCheck,
} from 'lucide-react';
import { SearchModal } from './components/SearchModal';
import { DrugDetail } from './components/DrugDetail';
import { PediatricCalculator } from './components/PediatricCalculator';
import { InteractionChecker } from './components/InteractionChecker';
import { ClinicalCalculators } from './components/ClinicalCalculators';
import { ProtocolsView } from './components/ProtocolsView';
import { PublicDatabasesView } from './components/PublicDatabasesView';
import { DetalheMedicamentoCompleto } from './types';
import { obterDetalheMedicamento } from './api';

export const App: React.FC = () => {
  const [buscaAberta, setBuscaAberta] = useState(false);
  const [secaoAtiva, setSecaoAtiva] = useState<'medicamentos' | 'protocolos' | 'pcdt' | 'pediatria' | 'interacoes' | 'calculadoras'>('medicamentos');
  const [medicamentoAtual, setMedicamentoAtual] = useState<DetalheMedicamentoCompleto | null>(null);
  const [protocoloSelecionadoId, setProtocoloSelecionadoId] = useState<string | null>(null);
  const [toastMensagem, setToastMensagem] = useState<string | null>(null);

  // Parâmetros dinâmicos para a calculadora pediátrica a partir da bula
  const [pedProps, setPedProps] = useState<{
    nome: string;
    doseMin?: number;
    conc?: number;
    teto?: number;
  }>({
    nome: 'Amoxicilina 250mg/5mL',
    doseMin: 50,
    conc: 50,
    teto: 3000,
  });

  // Atalho global do teclado (Ctrl+K ou Barra '/') para abrir a busca instantânea
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key.toLowerCase() === 'k') || (e.key === '/' && (e.target as HTMLElement).tagName !== 'INPUT')) {
        e.preventDefault();
        setBuscaAberta(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Carga inicial do medicamento de referência
  useEffect(() => {
    obterDetalheMedicamento(1).then(setMedicamentoAtual).catch(console.error);
  }, []);

  const abrirMedicamentoPorId = async (id: number) => {
    try {
      const detalhe = await obterDetalheMedicamento(id);
      setMedicamentoAtual(detalhe);
      setSecaoAtiva('medicamentos');
      mostrarToast(`Medicamento carregado: ${detalhe.medicamento.nome_comercial}`);
    } catch (e) {
      console.error(e);
    }
  };

  const abrirProtocoloPorId = (id: string) => {
    setProtocoloSelecionadoId(id);
    setSecaoAtiva('protocolos');
    mostrarToast("Protocolo clínico selecionado");
  };

  const abrirCalculadoraPediatricaComDados = (nome: string, doseMin?: number, conc?: number, teto?: number) => {
    setPedProps({ nome, doseMin, conc, teto });
    setSecaoAtiva('pediatria');
    mostrarToast(`Dose de ${nome} carregada na calculadora`);
  };

  const mostrarToast = (msg: string) => {
    setToastMensagem(msg);
    setTimeout(() => setToastMensagem(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#060b13] text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Toast Notificação Flutuante */}
      {toastMensagem && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 border border-teal-500/60 shadow-2xl shadow-teal-950/80 text-teal-300 text-xs font-semibold px-4 py-3 rounded-2xl flex items-center space-x-2.5 backdrop-blur-md animate-fade-in">
          <Check className="w-4 h-4 text-teal-400 flex-shrink-0" />
          <span>{toastMensagem}</span>
        </div>
      )}

      {/* Barra de Topo Superior - Ergonomia Médica Point-of-Care */}
      <header className="sticky top-0 z-40 bg-[#0a101d]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 bg-gradient-to-tr from-teal-500 via-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-950/60 ring-1 ring-white/20">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-white font-sans">OpenClinical</span>
              <span className="text-[10px] font-extrabold bg-gradient-to-r from-teal-900 to-emerald-900 text-teal-300 border border-teal-600/50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Point-of-Care
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Suporte Clínico Determinístico &bull; SUS &bull; ANVISA &bull; RENAME
            </p>
          </div>
        </div>

        {/* Barra Central de Busca Rápida (Ctrl+K) */}
        <div className="flex-1 max-w-lg mx-6 hidden md:block">
          <button
            onClick={() => setBuscaAberta(true)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-900/90 hover:bg-slate-850 border border-slate-750 hover:border-teal-500/60 rounded-2xl text-slate-400 text-xs transition-all shadow-inner group"
          >
            <div className="flex items-center space-x-2.5 truncate">
              <Search className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform flex-shrink-0" />
              <span className="truncate">Buscar fármacos (ex: Dipirona, Amoxil), CIDs, receitas...</span>
            </div>
            <kbd className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-slate-950 text-slate-400 border border-slate-800 rounded-lg shadow-sm">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Status Operacional & Badge de Conexão */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setBuscaAberta(true)}
            className="md:hidden p-2.5 bg-slate-850 border border-slate-750 text-teal-400 rounded-xl"
            aria-label="Abrir busca"
          >
            <Search className="w-4 h-4" />
          </button>

          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-xl text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-slate-300">SQLite FTS5 Offline</span>
            <span className="text-slate-500 font-mono text-[10px]">| Rust Engine</span>
          </div>
        </div>
      </header>

      {/* Barra de Navegação Horizontal das Seções Clínicas */}
      <nav className="bg-[#0b1322] border-b border-slate-800 px-4 sm:px-8 flex overflow-x-auto gap-1.5 py-2.5 scrollbar-none">
        {[
          { id: 'medicamentos', label: 'Bulas Estruturadas', icon: Pill, badge: '10 DCB' },
          { id: 'protocolos', label: 'Receitas & Prescrições', icon: BookOpen, badge: '45 Prontas' },
          { id: 'pcdt', label: 'Bases Públicas (PCDT MS)', icon: FileCheck, badge: '83 Oficiais' },
          { id: 'pediatria', label: 'Calculadora Pediátrica', icon: Baby, badge: 'Teto ANVISA' },
          { id: 'interacoes', label: 'Verificador de Interações', icon: ShieldAlert, badge: 'Combinatória' },
          { id: 'calculadoras', label: 'Escores & Nefrologia', icon: Calculator, badge: 'CKD-EPI 2021' },
        ].map((item) => {
          const Icone = item.icon;
          const ativo = secaoAtiva === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSecaoAtiva(item.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                ativo
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-950/50 ring-1 ring-white/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/80 border border-transparent'
              }`}
            >
              <Icone className={`w-4 h-4 ${ativo ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                  ativo ? 'bg-black/30 text-teal-100' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {item.badge}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
        {secaoAtiva === 'medicamentos' && medicamentoAtual && (
          <DrugDetail
            detalhe={medicamentoAtual}
            onAbrirCalculadoraPediatrica={abrirCalculadoraPediatricaComDados}
            onSelecionarMedicamento={abrirMedicamentoPorId}
          />
        )}

        {secaoAtiva === 'pediatria' && (
          <PediatricCalculator
            nomeMedicamento={pedProps.nome}
            doseAlvoInicial={pedProps.doseMin}
            concentracaoInicial={pedProps.conc}
            tetoMaximoInicial={pedProps.teto}
          />
        )}

        {secaoAtiva === 'interacoes' && <InteractionChecker />}

        {secaoAtiva === 'calculadoras' && <ClinicalCalculators />}

        {secaoAtiva === 'protocolos' && (
          <ProtocolsView protocoloSelecionadoId={protocoloSelecionadoId} />
        )}

        {secaoAtiva === 'pcdt' && <PublicDatabasesView />}
      </main>

      {/* Modal de Busca Rápida Unificada */}
      <SearchModal
        aberto={buscaAberta}
        onFechar={() => setBuscaAberta(false)}
        onSelecionarMedicamento={abrirMedicamentoPorId}
        onSelecionarProtocolo={abrirProtocoloPorId}
      />

      {/* Rodapé Point-of-Care */}
      <footer className="bg-[#090f1a] border-t border-slate-800/80 px-4 sm:px-8 py-3.5 text-xs text-slate-400 flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-teal-400" />
          <span>
            <strong>OpenClinical</strong> &bull; Motor Clínico em <strong>Rust 🦀</strong> + Banco Relacional <strong>SQLite FTS5</strong>
          </span>
        </div>
        <div className="flex items-center space-x-4 text-[11px] text-slate-400">
          <span>Pressione <strong className="text-teal-300 font-mono">Ctrl+K</strong> para buscar a qualquer momento</span>
          <span>&bull;</span>
          <span>Auditoria Médica Determinística</span>
        </div>
      </footer>
    </div>
  );
};
