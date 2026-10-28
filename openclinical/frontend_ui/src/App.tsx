import React, { useState, useEffect, Suspense, lazy } from 'react';
import {
  Search,
  Pill,
  Baby,
  ShieldAlert,
  Calculator,
  BookOpen,
  HeartPulse,
  Check,
  Database,
  FileCheck,
  AlertTriangle,
  Store,
  BookMarked,
} from 'lucide-react';
import { SearchModal } from './components/SearchModal';
import { DrugDetail } from './components/DrugDetail';
import { PediatricCalculator } from './components/PediatricCalculator';
import { InteractionChecker } from './components/InteractionChecker';
import { ClinicalCalculators } from './components/ClinicalCalculators';
import { ProtocolsView } from './components/ProtocolsView';
import { PharmacyPriceFinder } from './components/PharmacyPriceFinder';
import type { SelecaoBasePublica } from './components/PublicDatabasesView';

// Tela com os catálogos públicos (vários MB): carregada só quando aberta
const PublicDatabasesView = lazy(() =>
  import('./components/PublicDatabasesView').then((m) => ({ default: m.PublicDatabasesView }))
);
// Formulário Terapêutico Nacional (~3 MB de monografias): também carregado sob demanda
const FormularioView = lazy(() => import('./components/FormularioView').then((m) => ({ default: m.FormularioView })));
import { DetalheMedicamentoCompleto } from './types';
import { obterDetalheMedicamento, isTauri } from './api';

type SecaoApp = 'medicamentos' | 'formulario' | 'precos' | 'protocolos' | 'pcdt' | 'pediatria' | 'interacoes' | 'calculadoras';

const SECOES: { id: SecaoApp; label: string; icon: React.ComponentType<{ className?: string }>; badge: string }[] = [
  { id: 'formulario', label: 'Medicamentos & Receitas', icon: BookMarked, badge: 'FTN · 346' },
  { id: 'medicamentos', label: 'Bulas Estruturadas', icon: Pill, badge: '10 DCB' },
  { id: 'precos', label: 'Preços em Farmácias', icon: Store, badge: 'Redes & SUS' },
  { id: 'protocolos', label: 'Receitas & Prescrições', icon: BookOpen, badge: '45 Protocolos' },
  { id: 'pcdt', label: 'Bases Públicas', icon: FileCheck, badge: 'CMED · PCDT · ANVISA' },
  { id: 'pediatria', label: 'Calculadora Pediátrica', icon: Baby, badge: 'Teto de dose' },
  { id: 'interacoes', label: 'Verificador de Interações', icon: ShieldAlert, badge: 'FTN · 1.436' },
  { id: 'calculadoras', label: 'Escores & Nefrologia', icon: Calculator, badge: 'CKD-EPI 2021' },
];

export const App: React.FC = () => {
  const modoNativo = isTauri();
  const [buscaAberta, setBuscaAberta] = useState(false);
  // "?secao=pediatria" abre direto uma seção (usado pelo atalho do ícone do app no celular)
  const [secaoAtiva, setSecaoAtiva] = useState<SecaoApp>(() => {
    const pedida = new URLSearchParams(window.location.search).get('secao');
    return SECOES.some((s) => s.id === pedida) ? (pedida as SecaoApp) : 'formulario';
  });
  const [selecaoFormulario, setSelecaoFormulario] = useState<{ id: number; versao: number } | null>(null);
  const [medicamentoAtual, setMedicamentoAtual] = useState<DetalheMedicamentoCompleto | null>(null);
  const [erroMedicamento, setErroMedicamento] = useState<string | null>(null);
  const [protocoloSelecionadoId, setProtocoloSelecionadoId] = useState<string | null>(null);
  const [selecaoBasePublica, setSelecaoBasePublica] = useState<SelecaoBasePublica | null>(null);
  const [medicamentoPrecoInicial, setMedicamentoPrecoInicial] = useState<string | number>('Dipirona');
  const [toastMensagem, setToastMensagem] = useState<string | null>(null);
  const [toastErro, setToastErro] = useState(false);

  // Parâmetros dinâmicos para a calculadora pediátrica a partir da bula
  const [pedProps, setPedProps] = useState<{
    nome: string;
    doseMin?: number;
    conc: number | null;
    teto: number | null;
    fracionamento?: number;
    referencia?: string;
  }>({
    nome: 'Amoxicilina 250mg/5mL',
    doseMin: 50,
    conc: 50,
    teto: 3000,
  });

  // Atalho global do teclado (Ctrl+K / Cmd+K ou '/') para abrir a busca instantânea
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const alvo = e.target as HTMLElement;
      const digitando = alvo.tagName === 'INPUT' || alvo.tagName === 'TEXTAREA' || alvo.tagName === 'SELECT' || alvo.isContentEditable;
      if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') || (e.key === '/' && !digitando)) {
        e.preventDefault();
        setBuscaAberta(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Carga inicial do medicamento de referência
  useEffect(() => {
    obterDetalheMedicamento(1)
      .then((detalhe) => {
        setMedicamentoAtual(detalhe);
        setErroMedicamento(null);
      })
      .catch((e) => setErroMedicamento(e instanceof Error ? e.message : String(e)));
  }, []);

  const mostrarToast = (msg: string, erro = false) => {
    setToastMensagem(msg);
    setToastErro(erro);
    setTimeout(() => setToastMensagem(null), 3500);
  };

  const abrirMedicamentoPorId = async (id: number) => {
    try {
      const detalhe = await obterDetalheMedicamento(id);
      setMedicamentoAtual(detalhe);
      setErroMedicamento(null);
      setSecaoAtiva('medicamentos');
      window.scrollTo({ top: 0 });
      mostrarToast(`Medicamento carregado: ${detalhe.medicamento.nome_comercial}`);
    } catch (e) {
      mostrarToast(`Não foi possível abrir o medicamento: ${e instanceof Error ? e.message : String(e)}`, true);
    }
  };

  const abrirProtocoloPorId = (id: string) => {
    setProtocoloSelecionadoId(id);
    setSecaoAtiva('protocolos');
    window.scrollTo({ top: 0 });
  };

  const abrirBasePublica = (tipo: 'cmed' | 'pcdt', id: number) => {
    setSelecaoBasePublica({ tipo, id, versao: Date.now() });
    setSecaoAtiva('pcdt');
    window.scrollTo({ top: 0 });
  };

  const abrirComparadorPrecos = (termoOuId?: string | number) => {
    if (termoOuId) {
      setMedicamentoPrecoInicial(termoOuId);
    }
    setSecaoAtiva('precos');
    window.scrollTo({ top: 0 });
  };

  const abrirFormularioPorId = (id: number) => {
    setSelecaoFormulario({ id, versao: Date.now() });
    setSecaoAtiva('formulario');
    window.scrollTo({ top: 0 });
  };

  const abrirCalculadoraPediatricaComDados = (
    nome: string,
    doseMin: number | undefined,
    conc: number | null,
    teto: number | null,
    fracionamento?: number,
    referencia?: string
  ) => {
    setPedProps({ nome, doseMin, conc, teto, fracionamento, referencia });
    setSecaoAtiva('pediatria');
    window.scrollTo({ top: 0 });
    mostrarToast(conc === null ? `${nome}: informe a concentração da formulação` : `Dose de ${nome} carregada na calculadora`);
  };

  return (
    <div className="min-h-screen bg-[#060b13] text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Toast Notificação Flutuante */}
      {toastMensagem && (
        <div
          role="status"
          className={`fixed bottom-6 right-6 left-6 sm:left-auto z-50 bg-slate-900/95 border shadow-2xl text-xs font-semibold px-4 py-3 rounded-2xl flex items-center space-x-2.5 backdrop-blur-md animate-fade-in ${
            toastErro ? 'border-rose-500/60 text-rose-200 shadow-rose-950/60' : 'border-teal-500/60 text-teal-300 shadow-teal-950/80'
          }`}
        >
          {toastErro ? (
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          ) : (
            <Check className="w-4 h-4 text-teal-400 flex-shrink-0" />
          )}
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
          {/* Acesso direto à calculadora de dose pediátrica, sempre visível */}
          <button
            onClick={() => {
              setSecaoAtiva('pediatria');
              window.scrollTo({ top: 0 });
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
              secaoAtiva === 'pediatria'
                ? 'bg-sky-600 border-sky-400 text-white'
                : 'bg-sky-950/60 border-sky-700/60 text-sky-300 hover:bg-sky-900/70'
            }`}
            aria-label="Abrir calculadora de dose pediátrica"
            title="Calculadora de dose pediátrica"
          >
            <Baby className="w-5 h-5" />
            <span className="hidden lg:inline whitespace-nowrap">Dose infantil</span>
          </button>
          <button
            onClick={() => setBuscaAberta(true)}
            className="md:hidden p-2.5 bg-slate-850 border border-slate-750 text-teal-400 rounded-xl"
            aria-label="Abrir busca"
          >
            <Search className="w-4 h-4" />
          </button>

          <div
            className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-xl text-[11px] whitespace-nowrap"
            title={
              modoNativo
                ? 'Aplicativo nativo: motor Rust e banco SQLite completo'
                : 'Navegador/PWA: porte TypeScript do motor e amostra offline das bases'
            }
          >
            <span className={`w-2 h-2 rounded-full ${modoNativo ? 'bg-emerald-400' : 'bg-sky-400'}`}></span>
            <span className="font-semibold text-slate-300">{modoNativo ? 'Desktop · SQLite FTS5' : 'Web/PWA · Offline'}</span>
            <span className="text-slate-500 font-mono text-[10px]">| {modoNativo ? 'Motor Rust' : 'Porte TS'}</span>
          </div>
        </div>
      </header>

      {/* Aviso permanente de uso */}
      <div className="bg-amber-950/40 border-b border-amber-800/40 px-4 sm:px-8 py-1.5 text-[11px] text-amber-200/90 flex items-center gap-2">
        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
        <span>
          Protótipo de apoio à decisão: conteúdo clínico pendente de revisão por profissional habilitado. Confira sempre a bula
          e o protocolo oficial antes de prescrever.
        </span>
      </div>

      {/* Barra de Navegação Horizontal das Seções Clínicas */}
      <nav className="bg-[#0b1322] border-b border-slate-800 px-4 sm:px-8 flex overflow-x-auto gap-1.5 py-2.5 scrollbar-none" aria-label="Seções">
        {SECOES.map((item) => {
          const Icone = item.icon;
          const ativo = secaoAtiva === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSecaoAtiva(item.id)}
              aria-current={ativo ? 'page' : undefined}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                ativo
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-950/50 ring-1 ring-white/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/80 border border-transparent'
              }`}
            >
              <Icone className={`w-4 h-4 ${ativo ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
              <span
                className={`text-[10px] px-1.5 py-px rounded-md font-mono ${
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
        {secaoAtiva === 'medicamentos' && erroMedicamento && !medicamentoAtual && (
          <div role="alert" className="p-4 bg-rose-950/50 border border-rose-700/60 rounded-2xl text-sm text-rose-200">
            Não foi possível carregar a base de medicamentos: {erroMedicamento}
          </div>
        )}

        {secaoAtiva === 'medicamentos' && medicamentoAtual && (
          <DrugDetail
            detalhe={medicamentoAtual}
            onAbrirCalculadoraPediatrica={abrirCalculadoraPediatricaComDados}
            onSelecionarMedicamento={abrirMedicamentoPorId}
            onCompararPrecos={abrirComparadorPrecos}
          />
        )}

        {secaoAtiva === 'precos' && (
          <PharmacyPriceFinder
            medicamentoInicial={medicamentoPrecoInicial}
            onSelecionarMedicamento={abrirMedicamentoPorId}
          />
        )}

        {secaoAtiva === 'pediatria' && (
          <PediatricCalculator
            key={`${pedProps.nome}-${pedProps.conc}-${pedProps.doseMin}-${pedProps.fracionamento}`}
            nomeMedicamento={pedProps.nome}
            doseAlvoInicial={pedProps.doseMin}
            concentracaoInicial={pedProps.conc}
            tetoMaximoInicial={pedProps.teto}
            fracionamentoInicial={pedProps.fracionamento}
            referenciaDose={pedProps.referencia}
          />
        )}

        {secaoAtiva === 'formulario' && (
          <Suspense fallback={<div className="py-16 text-center text-sm text-slate-400">Carregando o Formulário Terapêutico...</div>}>
            <FormularioView selecao={selecaoFormulario} onAbrirCalculadoraPediatrica={abrirCalculadoraPediatricaComDados} />
          </Suspense>
        )}

        {secaoAtiva === 'interacoes' && <InteractionChecker />}

        {secaoAtiva === 'calculadoras' && <ClinicalCalculators />}

        {secaoAtiva === 'protocolos' && (
          <ProtocolsView protocoloSelecionadoId={protocoloSelecionadoId} />
        )}

        {secaoAtiva === 'pcdt' && (
          <Suspense fallback={<div className="py-16 text-center text-sm text-slate-400">Carregando bases públicas...</div>}>
            <PublicDatabasesView selecao={selecaoBasePublica} onCompararPrecos={abrirComparadorPrecos} />
          </Suspense>
        )}
      </main>

      {/* Modal de Busca Rápida Unificada */}
      <SearchModal
        aberto={buscaAberta}
        onFechar={() => setBuscaAberta(false)}
        onSelecionarMedicamento={abrirMedicamentoPorId}
        onSelecionarProtocolo={abrirProtocoloPorId}
        onSelecionarBasePublica={abrirBasePublica}
        onSelecionarFormulario={abrirFormularioPorId}
      />

      {/* Rodapé Point-of-Care */}
      <footer className="bg-[#090f1a] border-t border-slate-800/80 px-4 sm:px-8 py-3.5 text-xs text-slate-400 flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-teal-400" />
          <span>
            <strong>OpenClinical</strong> &bull;{' '}
            {modoNativo ? 'Motor clínico em Rust + SQLite FTS5' : 'Cálculos no porte TypeScript do motor Rust (testado por paridade)'}
          </span>
        </div>
        <div className="hidden sm:flex items-center space-x-4 text-[11px] text-slate-400">
          <span>Pressione <strong className="text-teal-300 font-mono">Ctrl+K</strong> ou <strong className="text-teal-300 font-mono">/</strong> para buscar</span>
        </div>
      </footer>
    </div>
  );
};
