import React, { useState, useEffect, useMemo } from 'react';
import {
  ShoppingBag,
  FileText,
  Plus,
  Trash2,
  Printer,
  Download,
  Save,
  Check,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Flame,
  ShieldAlert,
  Sliders,
  MoveUp,
  MoveDown,
  Edit2,
  ExternalLink,
  Layers,
  Baby,
  Calculator,
  X,
  Eye,
  AlertOctagon,
  Sparkles,
  ClipboardList,
} from 'lucide-react';
import {
  BlocoPrescricao,
  Paciente,
  PerfilMedico,
  ItemPrescricaoCesta,
} from '../types';
import {
  obterBlocosPrescricao,
  salvarBlocosPrescricao,
  obterPacienteAtivo,
  obterPerfilMedicoAtivo,
  salvarReceitaNoHistorico,
  limparPrescricao,
} from '../storage_clinico';
import { avaliarSegurancaMedicamentosa5g } from '../medication_safety_5g';
import { exportarElementosParaPdf } from '../pdf_generator';

interface PrescriptionSideDrawerProps {
  onVisualizarReceitaCompleta?: () => void;
  onAbrirCalculadoraPediatrica?: (nome: string) => void;
  onAbrirCalculadoraRenal?: () => void;
}

const OPCOES_VIA = [
  'Uso Oral (VO)',
  'Uso Sublingual (SL)',
  'Uso Tópico / Dérmico',
  'Uso Inalatório / Respiratório',
  'Uso Oftálmico (Colírio)',
  'Uso Otológico',
  'Uso Intramuscular (IM)',
  'Uso Intravenoso (IV)',
  'Uso Subcutâneo (SC)',
  'Uso Retal',
];

const OPCOES_DOSE = [
  '1 comprimido',
  '2 comprimidos',
  '1/2 comprimido',
  '1 cápsula',
  '2 cápsulas',
  '20 gotas',
  '30 gotas',
  '40 gotas',
  '5 mL (1 colher-medida)',
  '10 mL (2 colheres-medida)',
  '1 ampola',
  '1 aplicação / borrifo',
  '1 sachê / envelope',
];

const OPCOES_INTERVALO = [
  '1x ao dia pela manhã',
  '1x ao dia à noite',
  'de 12 em 12 horas',
  'de 8 em 8 horas',
  'de 6 em 6 horas',
  'em jejum, 30 min antes do café',
  'ao deitar',
  'de 8 em 8 horas se dor ou febre (SOS)',
  'de 6 em 6 horas se náusea ou vômito (SOS)',
];

const OPCOES_DURACAO = [
  'por 3 dias',
  'por 5 dias',
  'por 7 dias',
  'por 10 dias',
  'por 14 dias',
  'por 30 dias',
  'por 60 dias',
  'por 90 dias',
  'Uso Contínuo',
];

export const PrescriptionSideDrawer: React.FC<PrescriptionSideDrawerProps> = ({
  onVisualizarReceitaCompleta,
  onAbrirCalculadoraPediatrica,
  onAbrirCalculadoraRenal,
}) => {
  const [aberto, setAberto] = useState(false);
  const [modoVisualizacao, setModoVisualizacao] = useState<'blocos' | 'impressao'>('blocos');
  const [blocos, setBlocos] = useState<BlocoPrescricao[]>(obterBlocosPrescricao());
  const [pacienteAtivo, setPacienteAtivo] = useState<Paciente | null>(obterPacienteAtivo());
  const [perfilMedico, setPerfilMedico] = useState<PerfilMedico>(obterPerfilMedicoAtivo());

  const [salvandoMsg, setSalvandoMsg] = useState(false);
  const [blocoExpandidoId, setBlocoExpandidoId] = useState<string | null>(null);

  // Sincronização com eventos globais
  useEffect(() => {
    const handleAtualizacao = (e: any) => {
      setBlocos(e.detail);
      setAberto(true);
    };
    const handlePaciente = (e: any) => setPacienteAtivo(e.detail);
    const handleMedico = (e: any) => setPerfilMedico(e.detail);

    window.addEventListener('openclinical_prescricao_atualizada', handleAtualizacao);
    window.addEventListener('openclinical_paciente_alterado', handlePaciente);
    window.addEventListener('openclinical_medico_alterado', handleMedico);

    return () => {
      window.removeEventListener('openclinical_prescricao_atualizada', handleAtualizacao);
      window.removeEventListener('openclinical_paciente_alterado', handlePaciente);
      window.removeEventListener('openclinical_medico_alterado', handleMedico);
    };
  }, []);

  // Remover bloco
  const removerBloco = (id: string) => {
    const novos = blocos.filter((b) => b.id !== id);
    setBlocos(novos);
    salvarBlocosPrescricao(novos);
  };

  // Mover bloco para cima ou para baixo
  const moverBloco = (index: number, direcao: 'cima' | 'baixo') => {
    const novoIndex = direcao === 'cima' ? index - 1 : index + 1;
    if (novoIndex < 0 || novoIndex >= blocos.length) return;
    const novos = [...blocos];
    const item = novos.splice(index, 1)[0];
    novos.splice(novoIndex, 0, item);
    novos.forEach((b, idx) => (b.ordem = idx + 1));
    setBlocos(novos);
    salvarBlocosPrescricao(novos);
  };

  // Atualizar parâmetros do Bloco Inteligente (Objeto estruturado)
  const atualizarParametroBloco = (
    id: string,
    campo: 'via' | 'dose' | 'intervalo' | 'duracao' | 'orientacao' | 'quantidade',
    valor: any
  ) => {
    const novos = blocos.map((b) => {
      if (b.id !== id) return b;
      const detalhe: ItemPrescricaoCesta = b.medicamento_detalhe || {
        id: `med_${Date.now()}`,
        nome_medicamento: b.titulo,
        principio_ativo: b.titulo,
        apresentacao: '',
        posologia: b.conteudo,
        quantidade_embalagens: 1,
        tipo_receituario: 'simples',
        preco_pmc: 0,
      };

      if (campo === 'via') detalhe.via_administracao = valor;
      if (campo === 'dose') detalhe.dose_unitaria = valor;
      if (campo === 'intervalo') detalhe.frequencia_intervalo = valor;
      if (campo === 'duracao') detalhe.duracao_tratamento = valor;
      if (campo === 'orientacao') detalhe.orientacoes_especificas = valor;
      if (campo === 'quantidade') {
        detalhe.quantidade_embalagens = Math.max(1, Number(valor));
      }

      // Recompila a frase inteligente da posologia automaticamente
      const viaTxt = detalhe.via_administracao || 'Uso Oral';
      const doseTxt = detalhe.dose_unitaria || '1 comprimido';
      const freqTxt = detalhe.frequencia_intervalo || 'de 12 em 12 horas';
      const durTxt = detalhe.duracao_tratamento || 'por 7 dias';
      const obsTxt = detalhe.orientacoes_especificas ? ` (${detalhe.orientacoes_especificas})` : '';

      const novaPosologia = `${viaTxt}: Tomar ${doseTxt} ${freqTxt} ${durTxt}.${obsTxt}`;

      return {
        ...b,
        conteudo: novaPosologia,
        medicamento_detalhe: detalhe,
      };
    });

    setBlocos(novos);
    salvarBlocosPrescricao(novos);
  };

  // Alterar quantidade com stepper
  const alterarQuantidade = (id: string, delta: number) => {
    const bloco = blocos.find((b) => b.id === id);
    if (!bloco || !bloco.medicamento_detalhe) return;
    const atual = bloco.medicamento_detalhe.quantidade_embalagens || 1;
    atualizarParametroBloco(id, 'quantidade', atual + delta);
  };

  // Checagem de Alergia do Paciente Ativo
  const checarAlergiaBloco = (bloco: BlocoPrescricao): string | null => {
    if (!pacienteAtivo?.alergias || pacienteAtivo.alergias.length === 0) return null;
    const textoMedicamento = `${bloco.titulo} ${bloco.medicamento_detalhe?.principio_ativo || ''}`.toLowerCase();
    for (const alergia of pacienteAtivo.alergias) {
      const a = alergia.toLowerCase().trim();
      if (a && textoMedicamento.includes(a)) {
        return alergia;
      }
    }
    return null;
  };

  const listaAlergiasDetectadas = useMemo(() => {
    const alertas: { remedio: string; alergia: string }[] = [];
    for (const b of blocos) {
      const encontrada = checarAlergiaBloco(b);
      if (encontrada) {
        alertas.push({ remedio: b.titulo, alergia: encontrada });
      }
    }
    return alertas;
  }, [blocos, pacienteAtivo]);

  // Auditoria de Farmacovigilância 5G em Tempo Real
  const relatorioSeguranca = useMemo(() => {
    const nomes = blocos
      .filter((b) => b.tipo === 'medicamento')
      .map((b) => b.medicamento_detalhe?.principio_ativo || b.titulo);
    if (nomes.length < 2) return null;
    return avaliarSegurancaMedicamentosa5g(
      nomes,
      pacienteAtivo?.idade_anos || 65,
      pacienteAtivo?.sexo === 'F'
    );
  }, [blocos, pacienteAtivo]);

  // Salvar no Prontuário do Paciente
  const handleSalvarNoHistorico = () => {
    if (blocos.length === 0) return;
    const totalPmc = blocos.reduce(
      (acc, b) => acc + (b.medicamento_detalhe?.preco_pmc || 0) * (b.medicamento_detalhe?.quantidade_embalagens || 1),
      0
    );
    salvarReceitaNoHistorico({
      id: `rec_${Date.now()}`,
      paciente_id: pacienteAtivo ? pacienteAtivo.id : 'pac_geral',
      paciente_nome: pacienteAtivo ? pacienteAtivo.nome_completo : 'Paciente Geral',
      medico_nome: perfilMedico.nome_completo,
      medico_crm: `${perfilMedico.crm}/${perfilMedico.uf_crm}`,
      data_hora: new Date().toISOString(),
      blocos: [...blocos],
      total_itens: blocos.length,
      total_pmc_estimado: totalPmc,
    });
    setSalvandoMsg(true);
    setTimeout(() => setSalvandoMsg(false), 3000);
  };

  // Exportar PDF Direto
  const handleExportarPdf = async () => {
    try {
      const el = document.getElementById('folha-receita-modular');
      if (el) {
        await exportarElementosParaPdf(
          [el],
          `Receita_${pacienteAtivo?.nome_completo || 'Paciente'}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}`
        );
      } else {
        window.print();
      }
    } catch {
      window.print();
    }
  };

  const totalItens = blocos.length;
  const temAlertaGrave =
    listaAlergiasDetectadas.length > 0 ||
    Boolean(
      relatorioSeguranca &&
        (relatorioSeguranca.triple_whammy.detectado ||
          relatorioSeguranca.cascatas.length > 0 ||
          relatorioSeguranca.escore_tisdale.pontuacao_total >= 7)
    );

  return (
    <>
      {/* =====================================================================
          ABA FIXA COLAPSÁVEL NA BORDA DIREITA DA TELA (DOCKED TRIGGER)
         ===================================================================== */}
      {!aberto && (
        <button
          type="button"
          onClick={() => setAberto(true)}
          className="fixed right-0 top-1/3 z-40 bg-gradient-to-b from-teal-600 to-emerald-700 hover:from-teal-500 hover:to-emerald-600 text-white rounded-l-2xl shadow-2xl py-3 px-2 flex flex-col items-center gap-1.5 cursor-pointer border-y border-l border-teal-300/40 transition-transform hover:-translate-x-1 animate-in slide-in-from-right"
          title="Abrir Prescrição Inteligente em Blocos Lego"
        >
          <ClipboardList className="w-5 h-5" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest [writing-mode:vertical-rl] rotate-180">
            Receita
          </span>
          <span className="px-1.5 py-0.5 bg-black/30 rounded-full font-mono text-[10px] font-bold">
            {totalItens}
          </span>
          {temAlertaGrave && (
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping mt-1" />
          )}
        </button>
      )}

      {/* =====================================================================
          GAVETA LATERAL DINÂMICA (SLIDE-OVER DRAWER)
         ===================================================================== */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] lg:w-[520px] bg-white dark:bg-[#0c1427] border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out text-slate-800 dark:text-slate-100 ${
          aberto ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
      >
        {/* Topo da Gaveta */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/95 backdrop-blur">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-500/15 text-teal-700 dark:text-teal-400 rounded-xl border border-teal-500/30">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm flex items-center gap-2 text-slate-900 dark:text-slate-100">
                Receita Dinâmica &bull; Lego No-Code
                <span className="px-2 py-0.5 bg-teal-500/20 text-teal-800 dark:text-teal-300 text-[10px] rounded font-mono font-bold">
                  {totalItens} {totalItens === 1 ? 'item' : 'itens'}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[260px]">
                Paciente: <strong>{pacienteAtivo ? pacienteAtivo.nome_completo : 'Paciente Geral'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Alternador de Modo: Blocos Inteligentes vs Impressão */}
            <div className="flex items-center bg-slate-200 dark:bg-slate-800 p-0.5 rounded-xl text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setModoVisualizacao('blocos')}
                className={`px-2 py-1 rounded-lg transition ${
                  modoVisualizacao === 'blocos'
                    ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Editar parâmetros estruturados dos blocos"
              >
                🧩 Blocos
              </button>
              <button
                type="button"
                onClick={() => setModoVisualizacao('impressao')}
                className={`px-2 py-1 rounded-lg transition ${
                  modoVisualizacao === 'impressao'
                    ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Visualizar layout de impressão particionado por regra da ANVISA"
              >
                📄 Impressão
              </button>
            </div>

            <button
              type="button"
              onClick={() => setAberto(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition"
              title="Recolher gaveta"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ===================================================================
            TARJA VERMELHA DE ALERGIA E INTERAÇÕES MEDICAMENTOSAS
           =================================================================== */}
        {temAlertaGrave && (
          <div className="p-3 bg-rose-600 text-white font-sans text-xs space-y-1.5 shadow-lg border-b border-rose-700 animate-in slide-in-from-top">
            <div className="flex items-center gap-1.5 font-black uppercase tracking-wider text-[11px]">
              <ShieldAlert className="w-4 h-4 shrink-0 animate-bounce" />
              <span>TARJA VERMELHA: Interação Crítica / Risco do Paciente</span>
            </div>

            {/* Alerta de Alergia do Paciente */}
            {listaAlergiasDetectadas.map((al, idx) => (
              <div key={`alergia_${idx}`} className="bg-rose-700 p-2 rounded-lg text-[11px] font-bold flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-white shrink-0" />
                <span>
                  <strong>ALERTA DE ALERGIA:</strong> Fármaco <u>{al.remedio}</u> coincide com alergia cadastrada no paciente ({al.alergia})! Risco de reação anafilática grave.
                </span>
              </div>
            ))}

            {/* Alerta Triple Whammy */}
            {relatorioSeguranca?.triple_whammy.detectado && (
              <p className="text-[11px] leading-tight font-medium bg-rose-700/90 p-2 rounded-lg">
                <strong>Triple Whammy Renal:</strong> Associação simultânea de IECA/BRA + Diurético + AINE detectada. Risco elevado de Insuficiência Renal Aguda.
              </p>
            )}

            {/* Cascatas Iatrogênicas */}
            {relatorioSeguranca?.cascatas.map((c, i) => (
              <p key={i} className="text-[11px] leading-tight font-medium bg-rose-700/90 p-2 rounded-lg">
                <strong>Cascata Iatrogênica ({c.farmaco_causador} &rarr; {c.farmaco_prescrito}):</strong> {c.efeito_adverso_confundido} ({c.conduta_desprescricao})
              </p>
            ))}

            {/* Risco QTc */}
            {relatorioSeguranca && relatorioSeguranca.escore_tisdale.pontuacao_total >= 7 && (
              <p className="text-[11px] leading-tight font-medium bg-rose-700/90 p-2 rounded-lg">
                <strong>Risco Alto de Prolongamento QTc:</strong> Fármacos torsadogênicos presentes ({relatorioSeguranca.escore_tisdale.farmacos_qtc_presentes.join(', ')}).
              </p>
            )}
          </div>
        )}

        {/* ===================================================================
            CONTEÚDO: MODO BLOCOS INTELIGENTES (LEGO)
           =================================================================== */}
        {modoVisualizacao === 'blocos' ? (
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
            {blocos.length === 0 ? (
              <div className="py-20 text-center text-slate-400 space-y-2 text-xs">
                <ClipboardList className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
                <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                  Sua receita ainda está vazia
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-[280px] mx-auto">
                  Clique em <strong>[➕ Adicionar à Receita]</strong> em qualquer remédio do Formulário FTN, bulas ou protocolos para montar seus blocos modulares.
                </p>
              </div>
            ) : (
              blocos.map((bloco, idx) => {
                const isMed = bloco.tipo === 'medicamento';
                const isControlado = bloco.medicamento_detalhe?.tipo_receituario !== 'simples';
                const alergiaDetectada = checarAlergiaBloco(bloco);
                const detalhe = bloco.medicamento_detalhe;

                return (
                  <div
                    key={bloco.id}
                    className={`border-2 rounded-2xl transition-all shadow-sm ${
                      alergiaDetectada
                        ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-500'
                        : isControlado
                        ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700/60'
                        : isMed
                        ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                        : 'bg-sky-50/70 dark:bg-sky-950/20 border-sky-300 dark:border-sky-800/60'
                    }`}
                  >
                    {/* Cabeçalho do Bloco Lego */}
                    <div className="p-3 flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/60">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-[11px] font-mono font-bold text-slate-400 w-5">
                          #{idx + 1}
                        </span>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase shrink-0 ${
                            isControlado
                              ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                              : isMed
                              ? 'bg-teal-500/20 text-teal-800 dark:text-teal-300 border border-teal-500/30'
                              : 'bg-sky-500/20 text-sky-800 dark:text-sky-300 border border-sky-500/30'
                          }`}
                        >
                          {isControlado ? 'Controle Especial' : bloco.tipo}
                        </span>
                        <span className="font-extrabold text-slate-900 dark:text-slate-100 truncate text-xs">
                          {bloco.titulo}
                        </span>
                      </div>

                      {/* Ações de Reordenação e Exclusão */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moverBloco(idx, 'cima')}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded disabled:opacity-30"
                          title="Subir bloco"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === blocos.length - 1}
                          onClick={() => moverBloco(idx, 'baixo')}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded disabled:opacity-30"
                          title="Descer bloco"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removerBloco(bloco.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-500/10 rounded"
                          title="Excluir este bloco da receita"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Alerta de Alergia no Bloco */}
                    {alergiaDetectada && (
                      <div className="px-3 pt-2 text-[11px] font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1.5 animate-pulse">
                        <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>Paciente alérgico a este fármaco ({alergiaDetectada})!</span>
                      </div>
                    )}

                    {/* Controles Inteligentes do Objeto */}
                    <div className="p-3 space-y-2.5 text-xs">
                      {isMed ? (
                        <>
                          <div className="grid grid-cols-2 gap-2">
                            {/* Seletor de Via */}
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                Via de Uso
                              </label>
                              <select
                                value={detalhe?.via_administracao || 'Uso Oral (VO)'}
                                onChange={(e) =>
                                  atualizarParametroBloco(bloco.id, 'via', e.target.value)
                                }
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg p-1.5 text-[11px] font-medium text-slate-800 dark:text-slate-100 focus:outline-none"
                              >
                                {OPCOES_VIA.map((v) => (
                                  <option key={v} value={v}>
                                    {v}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Seletor de Dose Unitária */}
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                Dose por Tomada
                              </label>
                              <select
                                value={detalhe?.dose_unitaria || '1 comprimido'}
                                onChange={(e) =>
                                  atualizarParametroBloco(bloco.id, 'dose', e.target.value)
                                }
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg p-1.5 text-[11px] font-medium text-slate-800 dark:text-slate-100 focus:outline-none"
                              >
                                {OPCOES_DOSE.map((d) => (
                                  <option key={d} value={d}>
                                    {d}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            {/* Frequência / Intervalo */}
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                Frequência / Intervalo
                              </label>
                              <select
                                value={detalhe?.frequencia_intervalo || 'de 12 em 12 horas'}
                                onChange={(e) =>
                                  atualizarParametroBloco(bloco.id, 'intervalo', e.target.value)
                                }
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg p-1.5 text-[11px] font-medium text-slate-800 dark:text-slate-100 focus:outline-none"
                              >
                                {OPCOES_INTERVALO.map((i) => (
                                  <option key={i} value={i}>
                                    {i}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Duração do Tratamento */}
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                Duração
                              </label>
                              <select
                                value={detalhe?.duracao_tratamento || 'por 7 dias'}
                                onChange={(e) =>
                                  atualizarParametroBloco(bloco.id, 'duracao', e.target.value)
                                }
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg p-1.5 text-[11px] font-medium text-slate-800 dark:text-slate-100 focus:outline-none"
                              >
                                {OPCOES_DURACAO.map((dur) => (
                                  <option key={dur} value={dur}>
                                    {dur}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Stepper de Quantidade & Atalhos de Calculadora */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                            {/* Quantidade */}
                            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded-lg">
                              <span className="text-slate-500 text-[10px] font-bold">Qtd a dispensar:</span>
                              <button
                                type="button"
                                onClick={() => alterarQuantidade(bloco.id, -1)}
                                className="px-1 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 font-black text-sm"
                              >
                                -
                              </button>
                              <span className="font-mono font-bold text-slate-900 dark:text-slate-100 min-w-[16px] text-center">
                                {detalhe?.quantidade_embalagens || 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => alterarQuantidade(bloco.id, 1)}
                                className="px-1 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 font-black text-sm"
                              >
                                +
                              </button>
                              <span className="text-slate-400 text-[10px]">cx/fr</span>
                            </div>

                            {/* Atalhos de Calculadoras Clínicas */}
                            <div className="flex items-center gap-1">
                              {onAbrirCalculadoraPediatrica && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    onAbrirCalculadoraPediatrica(
                                      detalhe?.nome_medicamento || bloco.titulo
                                    )
                                  }
                                  className="px-2 py-0.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-500/30 rounded-md text-[10px] font-semibold flex items-center gap-1"
                                  title="Calcular dose por peso mg/kg para este fármaco"
                                >
                                  <Baby className="w-3 h-3" />
                                  <span>Dose Infantil</span>
                                </button>
                              )}
                              {onAbrirCalculadoraRenal && (
                                <button
                                  type="button"
                                  onClick={onAbrirCalculadoraRenal}
                                  className="px-2 py-0.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 rounded-md text-[10px] font-semibold flex items-center gap-1"
                                  title="Checar ajuste para função renal (CKD-EPI)"
                                >
                                  <Calculator className="w-3 h-3" />
                                  <span>Renal</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        /* Bloco Não-Farmacológico (Orientações, Dietas, Exames) */
                        <textarea
                          rows={3}
                          value={bloco.conteudo}
                          onChange={(e) =>
                            atualizarParametroBloco(bloco.id, 'orientacao', e.target.value)
                          }
                          placeholder="Digite as orientações, cuidados ou exames solicitados..."
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-[11px] text-slate-800 dark:text-slate-100 leading-relaxed focus:outline-none"
                        />
                      )}

                      {/* Pré-visualização da Frase Formatada */}
                      <div className="bg-slate-50 dark:bg-slate-950/80 p-2 rounded-xl border border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-300 italic">
                        &ldquo;{bloco.conteudo}&rdquo;
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* ===================================================================
              CONTEÚDO: MODO IMPRESSÃO / FOLHAS SANITÁRIAS SEPARADAS
             =================================================================== */
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-100 dark:bg-[#070d18]">
            <div id="folha-receita-modular" className="space-y-4">
              {/* Receituário Simples (Máx 4 itens) */}
              <div className="bg-white text-slate-900 p-5 rounded-2xl shadow-md border border-slate-200 text-xs space-y-3 font-sans">
                <div className="border-b border-slate-200 pb-2 flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-sm uppercase tracking-wide text-slate-900">
                      Receituário Médico
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      {perfilMedico.nome_completo} &bull; CRM/{perfilMedico.uf_crm} {perfilMedico.crm}
                    </p>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono">
                    Receituário Simples
                  </span>
                </div>

                <div className="text-[11px] font-medium text-slate-700">
                  Paciente: <strong>{pacienteAtivo ? pacienteAtivo.nome_completo : 'Paciente Geral'}</strong>
                </div>

                <div className="space-y-2.5 pt-1">
                  {blocos.filter((b) => b.medicamento_detalhe?.tipo_receituario === 'simples' || !b.medicamento_detalhe).map((b, i) => (
                    <div key={b.id} className="text-[11px] border-b border-slate-100 pb-1.5">
                      <div className="font-black text-slate-900">
                        {i + 1}) {b.titulo} — {b.medicamento_detalhe?.quantidade_embalagens || 1} cx/fr
                      </div>
                      <div className="text-slate-600 pl-3 italic">{b.conteudo}</div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400 flex justify-between items-end">
                  <span>Data: {new Date().toLocaleDateString('pt-BR')}</span>
                  <div className="text-right">
                    <div className="w-36 border-b border-slate-400 mb-1" />
                    <span>Assinatura e Carimbo</span>
                  </div>
                </div>
              </div>

              {/* Receituário de Controle Especial (Portaria 344/98 e RDC 471) em 2 Vias */}
              {blocos.some((b) => b.medicamento_detalhe && b.medicamento_detalhe.tipo_receituario !== 'simples') && (
                <div className="bg-white text-slate-900 p-5 rounded-2xl shadow-md border-2 border-amber-400 text-xs space-y-3 font-sans">
                  <div className="border-b border-amber-300 pb-2 flex justify-between items-start">
                    <div>
                      <h4 className="font-black text-sm uppercase tracking-wide text-amber-900">
                        Receituário de Controle Especial
                      </h4>
                      <p className="text-[10px] text-slate-600 font-bold">
                        VÁLIDO EM TODO O TERRITÓRIO NACIONAL &bull; 1ª VIA FARMÁCIA / 2ª VIA PACIENTE
                      </p>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-amber-100 border border-amber-300 rounded text-amber-800 font-mono">
                      Portaria 344/98
                    </span>
                  </div>

                  <div className="text-[11px] font-medium text-slate-700">
                    Paciente: <strong>{pacienteAtivo ? pacienteAtivo.nome_completo : 'Paciente Geral'}</strong>
                    {pacienteAtivo?.endereco && <div>Endereço: {pacienteAtivo.endereco}</div>}
                  </div>

                  <div className="space-y-2.5 pt-1">
                    {blocos.filter((b) => b.medicamento_detalhe && b.medicamento_detalhe.tipo_receituario !== 'simples').map((b, i) => (
                      <div key={b.id} className="text-[11px] border-b border-amber-100 pb-1.5">
                        <div className="font-black text-slate-900">
                          {i + 1}) {b.titulo} — {b.medicamento_detalhe?.quantidade_embalagens || 1} cx
                        </div>
                        <div className="text-slate-600 pl-3 italic">{b.conteudo}</div>
                      </div>
                    ))}
                  </div>

                  {/* Campos Obrigatórios do Comprador e Fornecedor da Portaria 344 */}
                  <div className="pt-2 border-t border-amber-200 grid grid-cols-2 gap-2 text-[9px] text-slate-500">
                    <div className="border border-slate-200 p-1.5 rounded">
                      <strong>IDENTIFICAÇÃO DO COMPRADOR:</strong>
                      <div>Nome: ____________________________</div>
                      <div>Identidade/Órgão: __________________</div>
                      <div>Telefone: __________________________</div>
                    </div>
                    <div className="border border-slate-200 p-1.5 rounded">
                      <strong>IDENTIFICAÇÃO DO FORNECEDOR:</strong>
                      <div>Assinatura Farmacêutico: __________</div>
                      <div>Data de Dispensação: ___/___/______</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================================================================
            RODAPÉ DE AÇÕES DA GAVETA
           =================================================================== */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/95 space-y-2 text-xs">
          {salvandoMsg && (
            <div className="p-2 bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 rounded-xl font-bold text-[11px] flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-3.5 h-3.5" /> Receita salva com sucesso no histórico do paciente!
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {/* Exportar PDF Direto */}
            <button
              type="button"
              onClick={handleExportarPdf}
              disabled={blocos.length === 0}
              className="py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow transition"
              title="Gerar PDF da receita nas normas sanitárias"
            >
              <Download className="w-4 h-4" />
              <span>Exportar PDF</span>
            </button>

            {/* Salvar no Prontuário */}
            <button
              type="button"
              onClick={handleSalvarNoHistorico}
              disabled={blocos.length === 0}
              className="py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-750 disabled:opacity-50 text-slate-800 dark:text-slate-100 rounded-xl font-bold flex items-center justify-center gap-1.5 transition"
              title="Salvar cópia desta receita no histórico do paciente"
            >
              <Save className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Salvar no Prontuário</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => {
                limparPrescricao();
                setBlocos([]);
              }}
              disabled={blocos.length === 0}
              className="text-[11px] text-slate-400 hover:text-rose-600 transition flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Limpar receita
            </button>

            {onVisualizarReceitaCompleta && (
              <button
                type="button"
                onClick={onVisualizarReceitaCompleta}
                className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline font-bold flex items-center gap-1"
              >
                Abrir editor em tela cheia &rarr;
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
