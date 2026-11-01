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
  FileText,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { SearchModal } from './components/SearchModal';
import { DrugDetail } from './components/DrugDetail';
import { PediatricCalculator } from './components/PediatricCalculator';
import { InteractionChecker } from './components/InteractionChecker';
import { ClinicalCalculators } from './components/ClinicalCalculators';
import { ProtocolsView } from './components/ProtocolsView';
import { PrescriptionModularCanvas } from './components/PrescriptionModularCanvas';
import { PrescriptionSideDrawer } from './components/PrescriptionSideDrawer';
import { PatientProfileView } from './components/PatientProfileView';
import { RapidClinicTestsView } from './components/RapidClinicTestsView';
import { DoctorProfileModal } from './components/DoctorProfileModal';
import { PatientSelectorBar } from './components/PatientSelectorBar';
import { AntimicrobialGuideView } from './components/AntimicrobialGuideView';
import { obterPerfilMedicoAtivo } from './storage_clinico';
import { PerfilMedico } from './types';
import { obterTemaAtual, aplicarTema, alternarTema, TemaClinico } from './tema';
import { UserCheck, Brain, Sun, Moon, FileSpreadsheet } from 'lucide-react';
import { PharmacyPriceFinder } from './components/PharmacyPriceFinder';
import type { SelecaoBasePublica } from './components/PublicDatabasesView';

// Tela com os catálogos públicos (vários MB): carregada só quando aberta
const PublicDatabasesView = lazy(() =>
  import('./components/PublicDatabasesView').then((m) => ({ default: m.PublicDatabasesView }))
);
// Formulário Terapêutico Nacional (~3 MB de monografias): também carregado sob demanda
const FormularioView = lazy(() => import('./components/FormularioView').then((m) => ({ default: m.FormularioView })));
import { DetalheMedicamentoCompleto } from './types';
import { obterDetalheMedicamento, isTauri, buscarGeral, normalizarTexto, aoAtualizarBases } from './api';
import { AbrirMedicamentoContext } from './components/LinkMedicamento';
import { carregarFormulario } from './formulario_utils';
import { chaveSubstanciaCmed, monografiasDoPrincipio } from './ligacao_ftn';

export type SecaoApp =
  | 'medicamentos'
  | 'formulario'
  | 'precos'
  | 'protocolos'
  | 'prescricao'
  | 'guia_antimicrobiano'
  | 'pcdt'
  | 'pediatria'
  | 'interacoes'
  | 'calculadoras'
  | 'testes_rapidos'
  | 'prontuario';

export interface ItemNavegacao {
  id: SecaoApp;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
  descricao?: string;
}

export interface GrupoNavegacao {
  titulo: string;
  icone: string;
  itens: ItemNavegacao[];
}

export const GRUPOS_NAVEGACAO: GrupoNavegacao[] = [
  {
    titulo: 'Farmacologia & Bulas',
    icone: '💊',
    itens: [
      {
        id: 'formulario',
        label: 'Medicamentos & Receitas',
        icon: BookMarked,
        badge: 'FTN · 346',
        descricao: 'Monografias oficiais do Ministério da Saúde',
      },
      {
        id: 'medicamentos',
        label: 'Bulas Estruturadas',
        icon: Pill,
        badge: '10 DCB',
        descricao: 'Posologias adulto/pediátrica e ajuste renal',
      },
      {
        id: 'precos',
        label: 'Preço & Farmácia Popular',
        icon: Store,
        badge: 'PMC · SUS',
        descricao: 'Preço máximo ao consumidor e gratuidade SUS',
      },
      {
        id: 'pcdt',
        label: 'Bases Públicas & LME',
        icon: FileCheck,
        badge: 'CMED · PCDT',
        descricao: 'Dados abertos ANVISA, PCDT CONITEC e LME',
      },
    ],
  },
  {
    titulo: 'Prescrição & Protocolos',
    icone: '📋',
    itens: [
      {
        id: 'prontuario',
        label: 'Prontuário & Paciente',
        icon: FileSpreadsheet,
        badge: 'Histórico · Evolução',
        descricao: 'Ficha do paciente, histórico de receitas e laudos',
      },
      {
        id: 'protocolos',
        label: 'Receitas & Diretrizes',
        icon: BookOpen,
        badge: 'SUS · NICE · 62',
        descricao: 'PCDT SUS e diretrizes internacionais (NICE, CDC, OMS)',
      },
      {
        id: 'prescricao',
        label: 'Cesta Modular & Receita PDF',
        icon: FileText,
        badge: 'Port. 344 · RDC',
        descricao: 'Peças modulares, separação em 2 vias, templates e PDF',
      },
      {
        id: 'guia_antimicrobiano',
        label: 'Guia Antimicrobiano & CCIH',
        icon: Stethoscope,
        badge: '15 ATBs · IV→VO',
        descricao: 'Terapia empírica, espectro bacteriano e switch IV→VO',
      },
    ],
  },
  {
    titulo: 'Decisão Clínica & Urgência',
    icone: '⚡',
    itens: [
      {
        id: 'testes_rapidos',
        label: 'Testes de Consultório',
        icon: Brain,
        badge: 'MEEM · PHQ-9 · AVC',
        descricao: 'Escalas cognitivas, depressão, ansiedade e laudo PDF',
      },
      {
        id: 'pediatria',
        label: 'Calculadora Pediátrica',
        icon: Baby,
        badge: 'Teto de dose',
        descricao: 'Cálculo mg/kg com corte de segurança e apresentações',
      },
      {
        id: 'interacoes',
        label: 'Interações & Radar 5G',
        icon: ShieldAlert,
        badge: 'Whammy · CPIC',
        descricao: 'Cascata iatrogênica, risco QTc e farmacogenômica',
      },
      {
        id: 'calculadoras',
        label: 'Escores & Sala Vermelha',
        icon: Calculator,
        badge: 'ISR · Gaso · UTI',
        descricao: 'Gasometria, Parkland, SOFA, Wells e CKD-EPI',
      },
    ],
  },
];

const TODAS_SECOES = GRUPOS_NAVEGACAO.flatMap((g) => g.itens);

export const App: React.FC = () => {
  const modoNativo = isTauri();
  const [buscaAberta, setBuscaAberta] = useState(false);
  const [modalMedicoAberto, setModalMedicoAberto] = useState(false);
  const [perfilMedico, setPerfilMedico] = useState<PerfilMedico>(obterPerfilMedicoAtivo());
  const [termoBuscaInicial, setTermoBuscaInicial] = useState<string | undefined>(undefined);
  const [temaAtual, setTemaAtual] = useState<TemaClinico>(obterTemaAtual());
  const [avisoAberto, setAvisoAberto] = useState<boolean>(() => {
    return localStorage.getItem('openclinical_aviso_fechado') !== 'true';
  });

  useEffect(() => {
    aplicarTema(temaAtual);
    const handleTema = (e: any) => setTemaAtual(e.detail);
    window.addEventListener('openclinical_tema_alterado', handleTema);
    return () => window.removeEventListener('openclinical_tema_alterado', handleTema);
  }, []);

  const toggleTema = () => {
    const novo = alternarTema();
    setTemaAtual(novo);
  };

  const fecharAviso = () => {
    setAvisoAberto(false);
    localStorage.setItem('openclinical_aviso_fechado', 'true');
  };

  // Controle da barra lateral retrátil (Sidebar)
  const [sidebarColapsada, setSidebarColapsada] = useState<boolean>(() => {
    return localStorage.getItem('openclinical_sidebar_colapsada') === 'true';
  });
  const [sidebarMobileAberta, setSidebarMobileAberta] = useState(false);

  const toggleSidebar = () => {
    setSidebarColapsada((prev) => {
      const novo = !prev;
      localStorage.setItem('openclinical_sidebar_colapsada', String(novo));
      return novo;
    });
  };

  // "?secao=pediatria" abre direto uma seção (usado pelo atalho do ícone do app no celular)
  const [secaoAtiva, setSecaoAtiva] = useState<SecaoApp>(() => {
    const pedida = new URLSearchParams(window.location.search).get('secao');
    return TODAS_SECOES.some((s) => s.id === pedida) ? (pedida as SecaoApp) : 'formulario';
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
    idMonografia?: number;
  }>({
    nome: '',
    conc: null,
    teto: null,
  });

  // Atalho global do teclado (Ctrl+K / Cmd+K ou '/') para abrir a busca instantânea
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const alvo = e.target as HTMLElement;
      const digitando =
        alvo.tagName === 'INPUT' ||
        alvo.tagName === 'TEXTAREA' ||
        alvo.tagName === 'SELECT' ||
        alvo.isContentEditable;
      if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') || (e.key === '/' && !digitando)) {
        e.preventDefault();
        setBuscaAberta(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Atualizador diário do app desktop: avisa quando houver dado novo da ANVISA
  useEffect(() => {
    let cancelar: (() => void) | undefined;
    aoAtualizarBases((resultados) => {
      const novas = resultados.filter((r) => r.situacao === 'atualizada').map((r) => r.descricao);
      if (novas.length > 0) mostrarToast(`Bases da ANVISA atualizadas: ${novas.join('; ')}`);
    }).then((fn) => (cancelar = fn));
    return () => cancelar?.();
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

  const navegarPara = (id: SecaoApp) => {
    setSecaoAtiva(id);
    setSidebarMobileAberta(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const abrirBasePublica = (tipo: 'cmed' | 'pcdt' | 'bula', id: number | string) => {
    setSelecaoBasePublica(
      tipo === 'cmed'
        ? { tipo, id: Number(id), versao: Date.now() }
        : tipo === 'bula'
        ? { tipo, id: String(id), versao: Date.now() }
        : { tipo, id, versao: Date.now() }
    );
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

  const abrirMedicamentoPorNome = async (nomeExibido: string) => {
    const nome =
      nomeExibido
        .replace(/\(.*?\)/g, ' ')
        .replace(/\s+\d.*$/, '')
        .replace(
          /\b(gotas|xarope|suspens[aã]o|comprimidos?|c[aá]psulas?|spray|nasal|injet[aá]vel|solu[cç][aã]o|oral|creme|pomada|col[ií]rio|ampola)\b/gi,
          ' '
        )
        .replace(/\s+/g, ' ')
        .trim() || nomeExibido;
    const chave = chaveSubstanciaCmed(nome);
    try {
      const resultados = await buscarGeral(nome);
      if (!chave.includes('+')) {
        const bula = resultados.find(
          (r) =>
            r.tipo_registro === 'medicamento' &&
            normalizarTexto(`${r.titulo_primario} ${r.subtitulo}`).includes(chave)
        );
        if (bula && typeof bula.id_referencia === 'number') {
          await abrirMedicamentoPorId(bula.id_referencia);
          return;
        }
      }
      const { MONOGRAFIAS_FTN } = await carregarFormulario();
      const [monografia] = monografiasDoPrincipio(nome, MONOGRAFIAS_FTN);
      if (monografia) {
        abrirFormularioPorId(monografia.id_monografia);
        return;
      }
      const bulaPdf = resultados.find(
        (r) =>
          r.tipo_registro === 'bula_importada' &&
          normalizarTexto(r.titulo_primario).startsWith(normalizarTexto(nome))
      );
      if (bulaPdf) {
        abrirBasePublica('bula', String(bulaPdf.id_referencia).split(':')[0]);
        return;
      }
      const produto = resultados.find(
        (r) =>
          r.tipo_registro === 'cmed_comercial' &&
          normalizarTexto(r.titulo_primario).startsWith(normalizarTexto(nome))
      );
      if (produto && typeof produto.id_referencia === 'number') {
        abrirBasePublica('cmed', produto.id_referencia);
        return;
      }
    } catch (e) {
      mostrarToast(`Não foi possível abrir ${nome}: ${e instanceof Error ? e.message : String(e)}`, true);
      return;
    }
    setTermoBuscaInicial(nome);
    setBuscaAberta(true);
  };

  const abrirCalculadoraPediatricaComDados = (
    nome: string,
    doseMin: number | undefined,
    conc: number | null,
    teto: number | null,
    fracionamento?: number,
    referencia?: string,
    idMonografia?: number
  ) => {
    setPedProps({ nome, doseMin, conc, teto, fracionamento, referencia, idMonografia });
    setSecaoAtiva('pediatria');
    window.scrollTo({ top: 0 });
    mostrarToast(
      conc === null ? `${nome}: informe a concentração da formulação` : `Dose de ${nome} carregada na calculadora`
    );
  };

  const itemAtivoAtual = TODAS_SECOES.find((s) => s.id === secaoAtiva);

  return (
    <AbrirMedicamentoContext.Provider value={abrirMedicamentoPorNome}>
      <div className="min-h-screen bg-[#060b13] text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
        {/* Toast Notificação Flutuante */}
        {toastMensagem && (
          <div
            role="status"
            className={`fixed bottom-6 right-6 left-6 sm:left-auto z-50 bg-slate-900/95 border shadow-2xl text-xs font-semibold px-4 py-3 rounded-2xl flex items-center space-x-2.5 backdrop-blur-md animate-fade-in ${
              toastErro
                ? 'border-rose-500/60 text-rose-200 shadow-rose-950/60'
                : 'border-teal-500/60 text-teal-300 shadow-teal-950/80'
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
        <header className="sticky top-0 z-40 bg-[#0a101d]/95 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            {/* Botão de Toggle da Barra Lateral no Mobile */}
            <button
              onClick={() => setSidebarMobileAberta(true)}
              className="lg:hidden p-2 text-slate-300 hover:text-white rounded-xl bg-slate-850/80 border border-slate-750 transition-colors"
              aria-label="Abrir menu de navegação"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Botão de Toggle Desktop da Sidebar (Recolher/Expandir) */}
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 transition-colors"
              title={sidebarColapsada ? 'Expandir barra lateral' : 'Recolher barra lateral'}
              aria-label="Alternar barra lateral"
            >
              {sidebarColapsada ? <PanelLeft className="w-4 h-4 text-teal-400" /> : <PanelLeftClose className="w-4 h-4 text-slate-400" />}
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-tr from-teal-500 via-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-950/60 ring-1 ring-white/20">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black tracking-tight text-white font-sans">OpenClinical</span>
                  <span className="text-[9px] font-extrabold bg-gradient-to-r from-teal-900 to-emerald-900 text-teal-300 border border-teal-600/50 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    Point-of-Care
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                  Suporte Clínico Determinístico &bull; SUS &bull; ANVISA &bull; RENAME
                </p>
              </div>
            </div>
          </div>

          {/* Barra Central de Busca Rápida (Ctrl+K) */}
          <div className="flex-1 max-w-lg mx-2 hidden md:block">
            <button
              onClick={() => setBuscaAberta(true)}
              className="w-full flex items-center justify-between px-3.5 py-2 bg-slate-900/90 hover:bg-slate-850 border border-slate-750 hover:border-teal-500/60 rounded-xl text-slate-400 text-xs transition-all shadow-inner group"
            >
              <div className="flex items-center space-x-2 truncate">
                <Search className="w-3.5 h-3.5 text-teal-400 group-hover:scale-110 transition-transform flex-shrink-0" />
                <span className="truncate">Buscar fármacos (ex: Dipirona, Amoxil), CIDs, receitas...</span>
              </div>
              <kbd className="px-1.5 py-0.5 text-[9px] font-mono font-semibold bg-slate-950 text-slate-400 border border-slate-800 rounded shadow-sm">
                Ctrl+K
              </kbd>
            </button>
          </div>

          {/* Status Operacional & Atalhos Rápidos */}
          <div className="flex items-center space-x-2.5">
            {/* Botão de Alternar Tema Claro/Escuro */}
            <button
              type="button"
              onClick={toggleTema}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 transition"
              title={temaAtual === 'escuro' ? 'Alternar para Tema Hospitalar Claro' : 'Alternar para Tema Noturno/Sala Vermelha'}
              aria-label="Alternar tema visual"
            >
              {temaAtual === 'escuro' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Botão de Perfil do Médico */}
            <button
              type="button"
              onClick={() => setModalMedicoAberto(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/80 rounded-xl text-xs text-slate-800 dark:text-slate-200 transition"
              title="Configurar médico prescritor, CRM e papel timbrado"
            >
              <UserCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span className="font-bold">
                {perfilMedico.nome_completo.split(' ')[0]} {perfilMedico.nome_completo.split(' ').slice(-1)[0]}
              </span>
              <span className="text-[10px] text-teal-600 dark:text-teal-300 font-mono hidden sm:inline">
                CRM/{perfilMedico.uf_crm} {perfilMedico.crm}
              </span>
            </button>

            {/* Acesso direto à dose pediátrica */}
            <button
              onClick={() => navegarPara('pediatria')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                secaoAtiva === 'pediatria'
                  ? 'bg-sky-600 border-sky-400 text-white'
                  : 'bg-sky-950/60 border-sky-700/60 text-sky-300 hover:bg-sky-900/70'
              }`}
              title="Calculadora de dose pediátrica direta"
            >
              <Baby className="w-4 h-4" />
              <span className="hidden xl:inline text-[11px] whitespace-nowrap">Dose infantil</span>
            </button>

            {/* Busca mobile */}
            <button
              onClick={() => setBuscaAberta(true)}
              className="md:hidden p-2 bg-slate-850 border border-slate-750 text-teal-400 rounded-xl"
              aria-label="Abrir busca"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Badge de Conexão e Motor */}
            <div
              className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 bg-slate-900/80 border border-slate-800 rounded-xl text-[10px] whitespace-nowrap"
              title={
                modoNativo
                  ? 'Aplicativo nativo: motor Rust e banco SQLite completo'
                  : 'Navegador/PWA: porte TypeScript do motor e amostra offline das bases'
              }
            >
              <span className={`w-1.5 h-1.5 rounded-full ${modoNativo ? 'bg-emerald-400' : 'bg-sky-400'}`}></span>
              <span className="font-semibold text-slate-300">{modoNativo ? 'Desktop' : 'Web/PWA'}</span>
              <span className="text-slate-500 font-mono">| {modoNativo ? 'Rust' : 'TS'}</span>
            </div>
          </div>
        </header>

        {/* Aviso clínico regulatório (Discreto e Fechável) */}
        {avisoAberto && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800/40 px-4 sm:px-6 py-1.5 text-[11px] text-amber-900 dark:text-amber-200/90 flex items-center justify-between gap-2 transition-all">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
              <span>
                Suporte à decisão clínica: consulte a bula ANVISA e o PCDT oficial antes de prescrever.
              </span>
            </div>
            <button
              type="button"
              onClick={fecharAviso}
              className="p-1 hover:bg-amber-200 dark:hover:bg-amber-900/50 rounded text-amber-700 dark:text-amber-400 transition"
              title="Fechar aviso regulatório"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Estrutura Principal: Sidebar Lateral + Área de Trabalho */}
        <div className="flex-1 flex flex-row w-full items-stretch">
          {/* SIDEBAR DESKTOP (COLLAPSIBLE) */}
          <aside
            className={`hidden lg:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#080e1a] sticky top-[57px] h-[calc(100vh-57px)] transition-all duration-300 flex-shrink-0 z-20 ${
              sidebarColapsada ? 'w-16' : 'w-64'
            }`}
          >
            <div className="flex-1 overflow-y-auto py-2.5 space-y-4 scrollbar-none">
              {!sidebarColapsada ? (
                // MODO EXPANDIDO: 3 MÓDULOS CLÍNICOS AGRUPADOS
                GRUPOS_NAVEGACAO.map((grupo, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="px-3 pt-2 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <span>{grupo.icone}</span>
                      <span>{grupo.titulo}</span>
                    </div>

                    <div className="px-2 space-y-0.5">
                      {grupo.itens.map((item) => {
                        const Icone = item.icon;
                        const ativo = secaoAtiva === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => navegarPara(item.id)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                              ativo
                                ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-950/40 ring-1 ring-white/20'
                                : 'text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent'
                            }`}
                            title={item.descricao}
                          >
                            <div className="flex items-center space-x-2.5 truncate">
                              <Icone className={`w-4 h-4 flex-shrink-0 ${ativo ? 'text-white' : 'text-teal-400'}`} />
                              <span className="truncate">{item.label}</span>
                            </div>
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono flex-shrink-0 ml-1 ${
                                ativo ? 'bg-black/30 text-teal-100' : 'bg-slate-800/90 text-slate-400'
                              }`}
                            >
                              {item.badge}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                // MODO RECOLHIDO: APENAS ÍCONES VERTICAIS
                <div className="flex flex-col items-center space-y-2 pt-1">
                  {TODAS_SECOES.map((item) => {
                    const Icone = item.icon;
                    const ativo = secaoAtiva === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => navegarPara(item.id)}
                        title={`${item.label} (${item.badge}) - ${item.descricao || ''}`}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          ativo
                            ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-950/50 ring-1 ring-white/20'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <Icone className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Rodapé da Sidebar Desktop (Botão de Recolher/Expandir) */}
            <div className="p-2 border-t border-slate-800/80 bg-slate-950/60">
              <button
                onClick={toggleSidebar}
                className="w-full flex items-center justify-center gap-1.5 py-2 text-slate-400 hover:text-white hover:bg-slate-850/80 rounded-xl text-xs font-semibold transition-colors"
                title={sidebarColapsada ? 'Expandir menu lateral' : 'Recolher menu lateral'}
              >
                {sidebarColapsada ? (
                  <ChevronRight className="w-4 h-4 text-teal-400" />
                ) : (
                  <>
                    <ChevronLeft className="w-4 h-4 text-teal-400" />
                    <span className="text-[11px]">Recolher menu</span>
                  </>
                )}
              </button>
            </div>
          </aside>

          {/* DRAWER MOBILE (SLIDE-OVER QUANDO CLICADO NO HAMBÚRGUER) */}
          {sidebarMobileAberta && (
            <div className="lg:hidden fixed inset-0 z-50 flex animate-in fade-in duration-200">
              <div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setSidebarMobileAberta(false)}
              />
              <aside className="relative w-72 max-w-[85vw] bg-[#09101d] border-r border-slate-800 h-full flex flex-col z-10 shadow-2xl overflow-y-auto">
                <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <HeartPulse className="w-5 h-5 text-teal-400" />
                    <span className="font-bold text-sm text-white">Módulos Clínicos</span>
                  </div>
                  <button
                    onClick={() => setSidebarMobileAberta(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-3 space-y-4">
                  {GRUPOS_NAVEGACAO.map((grupo, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="px-2 pt-1 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <span>{grupo.icone}</span>
                        <span>{grupo.titulo}</span>
                      </div>
                      <div className="space-y-1">
                        {grupo.itens.map((item) => {
                          const Icone = item.icon;
                          const ativo = secaoAtiva === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => navegarPara(item.id)}
                              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                                ativo
                                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-950/40'
                                  : 'text-slate-300 hover:bg-slate-800/80'
                              }`}
                            >
                              <div className="flex items-center space-x-2.5 truncate">
                                <Icone className={`w-4 h-4 flex-shrink-0 ${ativo ? 'text-white' : 'text-teal-400'}`} />
                                <span className="truncate">{item.label}</span>
                              </div>
                              <span
                                className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono ${
                                  ativo ? 'bg-black/30 text-teal-100' : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                {item.badge}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          )}

          {/* ÁREA PRINCIPAL DE TRABALHO */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 min-w-0">
            {/* Barra de Paciente Ativo no Consultório */}
            <PatientSelectorBar
              onAbrirProntuario={() => setSecaoAtiva('prontuario')}
            />
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
                key={String(medicamentoPrecoInicial)}
                medicamentoInicial={medicamentoPrecoInicial}
                onSelecionarMedicamento={abrirMedicamentoPorId}
              />
            )}

            {secaoAtiva === 'pediatria' && (
              <PediatricCalculator
                key={`${pedProps.nome}-${pedProps.conc}-${pedProps.doseMin}-${pedProps.fracionamento}-${pedProps.referencia}`}
                nomeMedicamento={pedProps.nome}
                idMonografiaInicial={pedProps.idMonografia}
                doseAlvoInicial={pedProps.doseMin}
                concentracaoInicial={pedProps.conc}
                tetoMaximoInicial={pedProps.teto}
                fracionamentoInicial={pedProps.fracionamento}
                referenciaDose={pedProps.referencia}
              />
            )}

            {secaoAtiva === 'formulario' && (
              <Suspense
                fallback={
                  <div className="py-16 text-center text-sm text-slate-400">
                    Carregando o Formulário Terapêutico...
                  </div>
                }
              >
                <FormularioView
                  selecao={selecaoFormulario}
                  onAbrirCalculadoraPediatrica={abrirCalculadoraPediatricaComDados}
                  onAbrirProdutoCmed={(id) => abrirBasePublica('cmed', id)}
                  onAbrirPcdt={(id) => abrirBasePublica('pcdt', id)}
                />
              </Suspense>
            )}

            {secaoAtiva === 'interacoes' && <InteractionChecker />}

            {secaoAtiva === 'calculadoras' && <ClinicalCalculators />}

            {secaoAtiva === 'protocolos' && (
              <ProtocolsView protocoloSelecionadoId={protocoloSelecionadoId} />
            )}

            {secaoAtiva === 'prescricao' && <PrescriptionModularCanvas />}

            {secaoAtiva === 'prontuario' && (
              <PatientProfileView
                onNavegarPrescricao={() => setSecaoAtiva('prescricao')}
              />
            )}

            {secaoAtiva === 'testes_rapidos' && <RapidClinicTestsView />}

            {secaoAtiva === 'guia_antimicrobiano' && <AntimicrobialGuideView />}

            {secaoAtiva === 'pcdt' && (
              <Suspense
                fallback={
                  <div className="py-16 text-center text-sm text-slate-400">Carregando bases públicas...</div>
                }
              >
                <PublicDatabasesView
                  selecao={selecaoBasePublica}
                  onCompararPrecos={abrirComparadorPrecos}
                  onAbrirMonografia={abrirFormularioPorId}
                />
              </Suspense>
            )}
          </main>
        </div>

        {/* Modal de Busca Rápida Unificada */}
        <SearchModal
          aberto={buscaAberta}
          termoInicial={termoBuscaInicial}
          onFechar={() => {
            setBuscaAberta(false);
            setTermoBuscaInicial(undefined);
          }}
          onSelecionarMedicamento={abrirMedicamentoPorId}
          onSelecionarProtocolo={abrirProtocoloPorId}
          onSelecionarBasePublica={abrirBasePublica}
          onSelecionarFormulario={abrirFormularioPorId}
        />

        {/* Rodapé Point-of-Care */}
        <footer className="bg-[#090f1a] border-t border-slate-800/80 px-4 sm:px-6 py-3 text-xs text-slate-400 flex flex-wrap justify-between items-center gap-3 z-30">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-teal-400" />
            <span>
              <strong>OpenClinical</strong> &bull;{' '}
              {modoNativo
                ? 'Motor clínico em Rust + SQLite FTS5'
                : 'Cálculos no porte TypeScript do motor Rust (testado por paridade)'}
            </span>
          </div>
          <div className="hidden sm:flex items-center space-x-4 text-[11px] text-slate-400">
            <span>
              Pressione <strong className="text-teal-300 font-mono">Ctrl+K</strong> ou{' '}
              <strong className="text-teal-300 font-mono">/</strong> para buscar
            </span>
          </div>
        </footer>
      </div>
    </AbrirMedicamentoContext.Provider>
  );
};
