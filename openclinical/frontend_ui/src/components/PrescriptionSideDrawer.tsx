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
} from 'lucide-react';
import {
  BlocoPrescricao,
  Paciente,
  PerfilMedico,
  ReceitaSalva,
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
  onVisualizarReceitaCompleta: () => void;
  onAbrirCalculadoraPediatrica?: (nome: string) => void;
  onAbrirCalculadoraRenal?: () => void;
}

export const PrescriptionSideDrawer: React.FC<PrescriptionSideDrawerProps> = ({
  onVisualizarReceitaCompleta,
  onAbrirCalculadoraPediatrica,
  onAbrirCalculadoraRenal,
}) => {
  const [aberto, setAberto] = useState(false);
  const [blocos, setBlocos] = useState<BlocoPrescricao[]>(obterBlocosPrescricao());
  const [pacienteAtivo, setPacienteAtivo] = useState<Paciente | null>(obterPacienteAtivo());
  const [perfilMedico, setPerfilMedico] = useState<PerfilMedico>(obterPerfilMedicoAtivo());

  const [salvandoMsg, setSalvandoMsg] = useState(false);
  const [blocoExpandidoId, setBlocoExpandidoId] = useState<string | null>(null);

  // Sincronização com eventos
  useEffect(() => {
    const handleAtualizacao = (e: any) => {
      setBlocos(e.detail);
      // Quando um novo bloco é adicionado, abre a gaveta automaticamente
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

  // Atualizar campo do bloco inline (Lego interativo)
  const atualizarConteudoBloco = (id: string, novoConteudo: string) => {
    const novos = blocos.map((b) => (b.id === id ? { ...b, conteudo: novoConteudo } : b));
    setBlocos(novos);
    salvarBlocosPrescricao(novos);
  };

  // Alterar quantidade de caixas
  const alterarQuantidade = (id: string, delta: number) => {
    const novos = blocos.map((b) => {
      if (b.id === id && b.medicamento_detalhe) {
        const novaQtd = Math.max(1, (b.medicamento_detalhe.quantidade_embalagens || 1) + delta);
        return {
          ...b,
          medicamento_detalhe: {
            ...b.medicamento_detalhe,
            quantidade_embalagens: novaQtd,
          },
        };
      }
      return b;
    });
    setBlocos(novos);
    salvarBlocosPrescricao(novos);
  };

  // Avaliação de Segurança e Interações em Tempo Real (Tarja Vermelha)
  const relatorioSeguranca = useMemo(() => {
    const nomesFármacos = blocos
      .filter((b) => b.ativo && b.tipo === 'medicamento' && b.medicamento_detalhe)
      .map((b) => b.medicamento_detalhe!.principio_ativo || b.medicamento_detalhe!.nome_medicamento);

    if (nomesFármacos.length < 1) return null;

    return avaliarSegurancaMedicamentosa5g(
      nomesFármacos,
      pacienteAtivo?.idade_anos || 65,
      false,
      false,
      false,
      false,
      false
    );
  }, [blocos, pacienteAtivo]);

  // Salvar no Histórico do Paciente (Prontuário Digital)
  const handleSalvarNoProntuario = () => {
    if (blocos.length === 0) return;

    let totalPmc = 0;
    blocos.forEach((b) => {
      if (b.medicamento_detalhe) {
        totalPmc += (b.medicamento_detalhe.preco_pmc || 0) * (b.medicamento_detalhe.quantidade_embalagens || 1);
      }
    });

    const novaReceita: ReceitaSalva = {
      id: `rec_${Date.now()}`,
      paciente_id: pacienteAtivo?.id || 'pac_geral',
      paciente_nome: pacienteAtivo?.nome_completo || 'Paciente Geral',
      medico_nome: perfilMedico.nome_completo,
      medico_crm: `CRM/${perfilMedico.uf_crm} ${perfilMedico.crm}`,
      data_hora: new Date().toISOString(),
      blocos: [...blocos],
      total_itens: blocos.length,
      total_pmc_estimado: totalPmc,
    };

    salvarReceitaNoHistorico(novaReceita);
    setSalvandoMsg(true);
    setTimeout(() => setSalvandoMsg(false), 2200);
  };

  // Total de itens ativos
  const totalItens = blocos.length;

  return (
    <>
      {/* Gatilho Flutuante (Floating Pill Trigger) quando a gaveta está fechada */}
      {!aberto && (
        <button
          type="button"
          onClick={() => setAberto(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-2xl shadow-2xl shadow-teal-950/60 border border-teal-400/40 font-bold text-xs transition-all transform hover:scale-105 animate-in fade-in"
          title="Abrir Gaveta de Prescrição em Curso"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Receita em Curso</span>
          <span className="px-2 py-0.5 bg-black/25 rounded-lg font-mono text-[11px]">
            {totalItens} {totalItens === 1 ? 'item' : 'itens'}
          </span>
          {relatorioSeguranca && relatorioSeguranca.triple_whammy.detectado && (
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping" />
          )}
        </button>
      )}

      {/* Gaveta Lateral (Slide-over Drawer) */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-white dark:bg-[#0c1427] border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out text-slate-800 dark:text-slate-100 ${
          aberto ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
      >
        {/* Topo da Gaveta */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/90 backdrop-blur">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-500/15 text-teal-600 dark:text-teal-400 rounded-xl border border-teal-500/30">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm flex items-center gap-2">
                Prescrição Modular &bull; Lego No-Code
                <span className="px-2 py-0.2 bg-teal-500/20 text-teal-700 dark:text-teal-300 text-[10px] rounded font-mono font-semibold">
                  {totalItens}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[240px]">
                Paciente: <strong>{pacienteAtivo ? pacienteAtivo.nome_completo : 'Paciente Geral'}</strong>
              </p>
            </div>
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

        {/* ===================================================================
            TARJA VERMELHA DE INTERAÇÃO MEDICAMENTOSA EM TEMPO REAL
           =================================================================== */}
        {relatorioSeguranca && (relatorioSeguranca.triple_whammy.detectado || relatorioSeguranca.cascatas.length > 0 || relatorioSeguranca.escore_tisdale.pontuacao_total >= 7) && (
          <div className="p-3 bg-rose-600 text-white font-sans text-xs space-y-1.5 shadow-lg border-b border-rose-700 animate-in slide-in-from-top">
            <div className="flex items-center gap-1.5 font-black uppercase tracking-wider text-[11px]">
              <ShieldAlert className="w-4 h-4 shrink-0 animate-bounce" />
              <span>TARJA VERMELHA: Interação Crítica / Risco Grave</span>
            </div>

            {relatorioSeguranca.triple_whammy.detectado && (
              <p className="text-[11px] leading-tight font-medium bg-rose-700/80 p-2 rounded-lg">
                <strong>Alerta Triple Whammy Renal:</strong> Associação perigosa de IECA/BRA + Diurético + AINE detectada na receita. Risco elevado de Insuficiência Renal Aguda.
              </p>
            )}

            {relatorioSeguranca.cascatas.map((c, i) => (
              <p key={i} className="text-[11px] leading-tight font-medium bg-rose-700/80 p-2 rounded-lg">
                <strong>Cascata Iatrogênica ({c.farmaco_causador} &rarr; {c.farmaco_prescrito}):</strong> {c.efeito_adverso_confundido} ({c.conduta_desprescricao})
              </p>
            ))}

            {relatorioSeguranca.escore_tisdale.pontuacao_total >= 7 && (
              <p className="text-[11px] leading-tight font-medium bg-rose-700/80 p-2 rounded-lg">
                <strong>Risco Alto de Prolongamento QTc:</strong> Fármacos com potencial torsadogênico presentes ({relatorioSeguranca.escore_tisdale.farmacos_qtc_presentes.join(', ')}).
              </p>
            )}
          </div>
        )}

        {/* Lista de Blocos Modulares (Lego Prescrição) */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
          {blocos.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2 text-xs">
              <ShoppingBag className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
              <p className="font-semibold text-slate-600 dark:text-slate-300">
                Sua receita ainda está vazia.
              </p>
              <p className="text-[11px] text-slate-400 max-w-[260px] mx-auto">
                Adicione remédios pelo Formulário FTN, bulas, calculadoras pediátricas ou protocolos.
              </p>
            </div>
          ) : (
            blocos.map((bloco, idx) => {
              const expandido = blocoExpandidoId === bloco.id;
              const isMed = bloco.tipo === 'medicamento';
              const isControlado = bloco.medicamento_detalhe?.tipo_receituario !== 'simples';

              return (
                <div
                  key={bloco.id}
                  className={`border rounded-2xl transition-all shadow-sm ${
                    isControlado
                      ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/60'
                      : isMed
                      ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                      : 'bg-sky-50/60 dark:bg-sky-950/20 border-sky-300 dark:border-sky-800/60'
                  }`}
                >
                  {/* Cabeçalho do Bloco Lego */}
                  <div className="p-3 flex items-center justify-between gap-2 text-xs">
                    <div
                      className="flex items-center gap-2 flex-1 cursor-pointer min-w-0"
                      onClick={() => setBlocoExpandidoId(expandido ? null : bloco.id)}
                    >
                      <span className="text-[10px] font-mono font-bold text-slate-400 w-4">
                        #{idx + 1}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase shrink-0 ${
                          isControlado
                            ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                            : isMed
                            ? 'bg-teal-500/20 text-teal-800 dark:text-teal-300 border border-teal-500/30'
                            : 'bg-sky-500/20 text-sky-800 dark:text-sky-300 border border-sky-500/30'
                        }`}
                      >
                        {isControlado ? 'Controle Especial' : bloco.tipo}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-slate-100 truncate text-xs">
                        {bloco.titulo}
                      </span>
                    </div>

                    {/* Ações do Bloco */}
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
                        className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded"
                        title="Excluir este bloco da receita"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Corpo Compacto da Posologia / Orientações */}
                  <div className="px-3 pb-3 text-xs space-y-2">
                    {/* Campo de Edição da Posologia Inline */}
                    <textarea
                      rows={2}
                      value={bloco.conteudo}
                      onChange={(e) => atualizarConteudoBloco(bloco.id, e.target.value)}
                      placeholder="Posologia ou orientação ao paciente..."
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-[11px] text-slate-800 dark:text-slate-200 leading-relaxed focus:outline-none focus:border-teal-500"
                    />

                    {/* Controles do Medicamento: Quantidade e Atalhos de Calculadora */}
                    {isMed && bloco.medicamento_detalhe && (
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
                        {/* Stepper de Quantidade */}
                        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded-lg">
                          <span className="text-slate-500 text-[10px]">Qtd:</span>
                          <button
                            type="button"
                            onClick={() => alterarQuantidade(bloco.id, -1)}
                            className="px-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 font-bold"
                          >
                            -
                          </button>
                          <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                            {bloco.medicamento_detalhe.quantidade_embalagens || 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => alterarQuantidade(bloco.id, 1)}
                            className="px-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 font-bold"
                          >
                            +
                          </button>
                          <span className="text-slate-400 text-[10px]">cx/fr</span>
                        </div>

                        {/* Atalhos Rápidos para Calculadoras de Dose */}
                        <div className="flex items-center gap-1">
                          {onAbrirCalculadoraPediatrica && (
                            <button
                              type="button"
                              onClick={() =>
                                onAbrirCalculadoraPediatrica(
                                  bloco.medicamento_detalhe?.nome_medicamento || bloco.titulo
                                )
                              }
                              className="px-2 py-0.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-500/30 rounded-md text-[10px] font-semibold flex items-center gap-1"
                              title="Calcular dose pediátrica por peso para este fármaco"
                            >
                              <Baby className="w-3 h-3" />
                              <span>Pediatria</span>
                            </button>
                          )}

                          {onAbrirCalculadoraRenal && (
                            <button
                              type="button"
                              onClick={onAbrirCalculadoraRenal}
                              className="px-2 py-0.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 rounded-md text-[10px] font-semibold flex items-center gap-1"
                              title="Ajuste posológico de função renal (CKD-EPI)"
                            >
                              <Calculator className="w-3 h-3" />
                              <span>Renal</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ===================================================================
            RODAPÉ DE AÇÕES DA GAVETA
           =================================================================== */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 space-y-2 text-xs">
          {salvandoMsg && (
            <div className="p-2 bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 rounded-xl font-bold text-[11px] flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-3.5 h-3.5" /> Receita salva com sucesso no histórico do paciente!
            </div>
          )}

          {/* Botão Principal: Visualizar Receita Dividida & Formatada */}
          <button
            type="button"
            onClick={onVisualizarReceitaCompleta}
            disabled={blocos.length === 0}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-950/20 transition"
          >
            <Eye className="w-4 h-4" />
            <span>Visualizar Receita Dividida & Imprimir</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            {/* Salvar no Prontuário */}
            <button
              type="button"
              onClick={handleSalvarNoProntuario}
              disabled={blocos.length === 0}
              className="py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 disabled:opacity-50 rounded-xl font-semibold flex items-center justify-center gap-1.5 border border-slate-300 dark:border-slate-700 transition text-[11px]"
            >
              <Save className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Salvar no Prontuário</span>
            </button>

            {/* Limpar Cesta */}
            <button
              type="button"
              onClick={() => {
                if (confirm('Deseja limpar todos os blocos desta receita?')) {
                  limparPrescricao();
                  setBlocos([]);
                }
              }}
              disabled={blocos.length === 0}
              className="py-2 bg-slate-200 hover:bg-rose-500/20 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 disabled:opacity-50 rounded-xl font-semibold flex items-center justify-center gap-1.5 border border-slate-300 dark:border-slate-700 transition text-[11px]"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar Cesta</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
