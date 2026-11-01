import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  ClipboardList,
  FileText,
  Download,
  Copy,
  Check,
  X,
  Plus,
  BookOpen,
  Filter,
  ShieldAlert,
} from 'lucide-react';
import {
  DICIONARIO_SINTOMAS,
  investigarSintomas,
  SintomaClinico,
  HipoteseDiagnostica,
} from '../sintomas_diagnostico';
import { adicionarItemPrescricaoModular, obterPacienteAtivo, obterPerfilMedicoAtivo } from '../storage_clinico';
import { exportarElementosParaPdf } from '../pdf_generator';

interface SymptomDiagnosticoViewProps {
  onAbrirProtocolo?: (idProtocolo: string) => void;
  onNavegarParaPrescricao?: () => void;
}

export const SymptomDiagnosticoView: React.FC<SymptomDiagnosticoViewProps> = ({
  onAbrirProtocolo,
  onNavegarParaPrescricao,
}) => {
  const [sintomasSelecionados, setSintomasSelecionados] = useState<string[]>([]);
  const [buscaSintoma, setBuscaSintoma] = useState('');
  const [sistemaFiltro, setSistemaFiltro] = useState<string>('todos');
  const [copiadoId, setCopiadoId] = useState<string | null>(null);
  const [adicionadoId, setAdicionadoId] = useState<string | null>(null);
  const [exportandoPdf, setExportandoPdf] = useState(false);

  const pacienteAtivo = obterPacienteAtivo();
  const perfilMedico = obterPerfilMedicoAtivo();

  // Filtragem dos sintomas para seleção
  const sintomasDisponiveis = useMemo(() => {
    return DICIONARIO_SINTOMAS.filter((s) => {
      const matchSistema = sistemaFiltro === 'todos' || s.sistema === sistemaFiltro;
      const termo = buscaSintoma.toLowerCase().trim();
      const matchBusca =
        !termo ||
        s.nome.toLowerCase().includes(termo) ||
        (s.sinonimos && s.sinonimos.some((sin) => sin.toLowerCase().includes(termo)));
      return matchSistema && matchBusca;
    });
  }, [sistemaFiltro, buscaSintoma]);

  // Executa o motor determinístico
  const analise = useMemo(() => {
    return investigarSintomas(sintomasSelecionados);
  }, [sintomasSelecionados]);

  const toggleSintoma = (id: string) => {
    setSintomasSelecionados((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const aplicarPreset = (sintomas: string[]) => {
    setSintomasSelecionados(sintomas);
  };

  const copiarConduta = (hipotese: HipoteseDiagnostica) => {
    const texto = `HIPÓTESE DIAGNÓSTICA: ${hipotese.doenca} (CIDs: ${hipotese.cids.join(', ')})\n` +
      `CONDUTA INICIAL: ${hipotese.conduta_inicial}\n\n` +
      `EXAMES INVESTIGATIVOS SOLICITADOS:\n` +
      hipotese.exames_investigativos.map((e) => `• ${e}`).join('\n') +
      `\n\nSINAIS DE ALERTA:\n` +
      hipotese.sinais_alarme.map((a) => `⚠ ${a}`).join('\n');

    navigator.clipboard.writeText(texto);
    setCopiadoId(hipotese.id_protocolo);
    setTimeout(() => setCopiadoId(null), 2500);
  };

  const adicionarCondutaNaReceita = (hipotese: HipoteseDiagnostica) => {
    // 1. Adiciona medicamentos sugeridos
    hipotese.medicamentos_sugeridos.forEach((med) => {
      adicionarItemPrescricaoModular(
        'medicamento',
        med.nome,
        med.posologia,
        {
          id: `med_${Date.now()}_${Math.random()}`,
          nome_medicamento: med.nome,
          principio_ativo: med.nome.split(' ')[0],
          apresentacao: med.apresentacao || 'Dose padrão',
          posologia: med.posologia,
          quantidade_embalagens: 1,
          tipo_receituario: med.controlado ? 'controle_especial_c1' : 'simples',
          preco_pmc: 0,
        },
        `Conduta: ${hipotese.doenca}`
      );
    });

    // 2. Adiciona folha de cuidados e orientações
    if (hipotese.orientacoes_cuidados.length > 0) {
      adicionarItemPrescricaoModular(
        'orientacao',
        `Orientações & Sinais de Alerta: ${hipotese.doenca}`,
        hipotese.orientacoes_cuidados.map((o) => `• ${o}`).join('\n'),
        undefined,
        `Protocolo ${hipotese.doenca}`
      );
    }

    setAdicionadoId(hipotese.id_protocolo);
    setTimeout(() => setAdicionadoId(null), 3000);
  };

  const handleExportarRelatorioPdf = async () => {
    try {
      setExportandoPdf(true);
      const el = document.getElementById('relatorio-diagnostico-print');
      if (el) {
        await exportarElementosParaPdf(
          [el],
          `Investigacao_Diagnostica_${pacienteAtivo ? pacienteAtivo.nome_completo : 'Paciente'}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}`,
          'a4'
        );
      } else {
        window.print();
      }
    } catch (e) {
      console.error(e);
      window.print();
    } finally {
      setExportandoPdf(false);
    }
  };

  const sistemas = [
    { id: 'todos', rotulo: 'Todos os Aparelhos' },
    { id: 'Constitucional', rotulo: 'Geral / Constitucional' },
    { id: 'Respiratório', rotulo: 'Respiratório' },
    { id: 'Cardiovascular', rotulo: 'Cardiovascular' },
    { id: 'Gastrointestinal', rotulo: 'Gastrointestinal' },
    { id: 'Nefro-Urológico', rotulo: 'Nefro-Urológico' },
    { id: 'Neurológico', rotulo: 'Neurológico' },
    { id: 'Dermatológico', rotulo: 'Dermatológico' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Cabeçalho do Módulo */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-gradient-to-tr from-teal-500 to-emerald-600 rounded-2xl text-white shadow-md shadow-teal-900/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  Investigador Diagnóstico de Sintomas
                </h2>
                <span className="text-[10px] font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-700/60 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Determinístico Offline
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Mapeamento de queixas clínicas para hipóteses diagnósticas com base nos protocolos oficiais do SUS e diretrizes mundiais.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {sintomasSelecionados.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={() => setSintomasSelecionados([])}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition"
                >
                  Limpar ({sintomasSelecionados.length})
                </button>
                <button
                  type="button"
                  onClick={handleExportarRelatorioPdf}
                  disabled={exportandoPdf}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  {exportandoPdf ? 'Gerando...' : 'Exportar Laudo em PDF'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Presets Rápidos de Consultório */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 uppercase tracking-wider">
            Síndromes Comuns:
          </span>
          <button
            type="button"
            onClick={() => aplicarPreset(['febre', 'mialgia', 'cefaleia_intensa', 'dor_retroorbitaria'])}
            className="px-2.5 py-1 bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60 rounded-lg shrink-0 font-medium hover:bg-teal-100 transition"
          >
            🦟 Suspeita de Dengue / Arbovirose
          </button>
          <button
            type="button"
            onClick={() => aplicarPreset(['tosse_produtiva', 'febre', 'dispneia', 'dor_pleuritica'])}
            className="px-2.5 py-1 bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60 rounded-lg shrink-0 font-medium hover:bg-sky-100 transition"
          >
            🫁 Sintomas Respiratórios / PAC
          </button>
          <button
            type="button"
            onClick={() => aplicarPreset(['disuria', 'polaciuria', 'dor_lombar'])}
            className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 rounded-lg shrink-0 font-medium hover:bg-amber-100 transition"
          >
            🚽 Disúria / Infecção Urinária
          </button>
          <button
            type="button"
            onClick={() => aplicarPreset(['deficit_focal', 'desvio_rima', 'confusao_mental'])}
            className="px-2.5 py-1 bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 rounded-lg shrink-0 font-medium hover:bg-rose-100 transition"
          >
            🚨 Alerta AVC / Déficit Agudo
          </button>
          <button
            type="button"
            onClick={() => aplicarPreset(['dispneia', 'sibilos', 'tosse_seca'])}
            className="px-2.5 py-1 bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 rounded-lg shrink-0 font-medium hover:bg-purple-100 transition"
          >
            💨 Crise de Asma / Broncoespasmo
          </button>
        </div>
      </div>

      {/* Área de Seleção de Sintomas */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Busca por Sintoma */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={buscaSintoma}
              onChange={(e) => setBuscaSintoma(e.target.value)}
              placeholder="Digitar sintoma (ex: febre, tosse, dor)..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Chips de Sistemas / Especialidades */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
            {sistemas.map((sis) => (
              <button
                key={sis.id}
                type="button"
                onClick={() => setSistemaFiltro(sis.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition border ${
                  sistemaFiltro === sis.id
                    ? 'bg-teal-600 text-white border-teal-500 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/80 hover:bg-slate-200'
                }`}
              >
                {sis.rotulo}
              </button>
            ))}
          </div>
        </div>

        {/* Nuvem de Sintomas Clicáveis */}
        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/40">
          {sintomasDisponiveis.map((sintoma) => {
            const selecionado = sintomasSelecionados.includes(sintoma.id);
            return (
              <button
                key={sintoma.id}
                type="button"
                onClick={() => toggleSintoma(sintoma.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  selecionado
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm scale-[1.02]'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-400'
                }`}
              >
                {selecionado ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                ) : (
                  <Plus className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>{sintoma.nome}</span>
              </button>
            );
          })}
        </div>

        {/* Sintomas Atualmente Marcados */}
        {sintomasSelecionados.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
            <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider mr-1">
              Queixas Ativas ({sintomasSelecionados.length}):
            </span>
            {sintomasSelecionados.map((id) => {
              const sintoma = DICIONARIO_SINTOMAS.find((s) => s.id === id);
              if (!sintoma) return null;
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700/60 rounded-full font-bold text-[11px]"
                >
                  {sintoma.nome}
                  <button
                    type="button"
                    onClick={() => toggleSintoma(id)}
                    className="hover:text-rose-500 transition ml-0.5"
                    title="Remover sintoma"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Resultados do Motor Diagnóstico */}
      {sintomasSelecionados.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-500 dark:text-slate-400 space-y-3">
          <Stethoscope className="w-12 h-12 mx-auto text-teal-500 opacity-60 animate-bounce" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            Nenhum sintoma selecionado
          </h3>
          <p className="text-xs max-w-md mx-auto">
            Clique nos sintomas acima ou selecione uma síndrome clínica comum para gerar hipóteses diagnósticas determinísticas, exames complementares e condutas terapêuticas recomendadas.
          </p>
        </div>
      ) : analise.hipoteses.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center text-slate-500 dark:text-slate-400 space-y-2">
          <AlertTriangle className="w-10 h-10 mx-auto text-amber-500" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            Nenhuma hipótese correspondente exata
          </h3>
          <p className="text-xs">
            A combinação de sintomas selecionada não coincide com as síndromes cardinais cadastradas. Tente adicionar sintomas constitucionais ou investigar na busca global.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Alertas Críticos Ativos */}
          {analise.sinaisAlarmeDetetados.length > 0 && (
            <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800/60 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-rose-800 dark:text-rose-200 font-bold text-xs uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                Sinais de Alarme & Gravidade a Checar Imediatamente
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-rose-900 dark:text-rose-200">
                {analise.sinaisAlarmeDetetados.slice(0, 6).map((alarme, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span className="font-bold text-rose-600">•</span>
                    <span>{alarme}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lista de Hipóteses Diagnósticas Ordenadas por Match */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {analise.hipoteses.length} Hipótese(s) Diagnóstica(s) Determinística(s)
              </span>
              <span className="text-xs text-slate-400">Classificadas por compatibilidade clínica</span>
            </div>

            {analise.hipoteses.map((hip) => {
              const score = hip.score_match || 0;
              const isAltaSuspeicao = score >= 60;
              return (
                <div
                  key={hip.id_protocolo}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 hover:border-teal-400 dark:hover:border-teal-600 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                          {hip.doenca}
                        </h4>
                        <span className="text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
                          CIDs: {hip.cids.join(', ')}
                        </span>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500">
                          {hip.sistema}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div
                          className={`text-sm font-black ${
                            isAltaSuspeicao
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          {score}% de compatibilidade
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {isAltaSuspeicao ? 'Alta Suspeição Clínica' : 'Hipótese Diferencial'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Sintomas Presentes vs A Investigar */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
                        ✓ Sintomas Coincidentes no Paciente ({hip.sintomas_presentes?.length}):
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {hip.sintomas_presentes?.map((sId) => {
                          const s = DICIONARIO_SINTOMAS.find((x) => x.id === sId);
                          return (
                            <span
                              key={sId}
                              className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded font-medium text-[11px]"
                            >
                              {s?.nome || sId}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <span className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
                        🔍 Outros Sintomas Típicos a Checar na Anamnese ({hip.sintomas_ausentes?.length}):
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {hip.sintomas_ausentes?.slice(0, 4).map((sId) => {
                          const s = DICIONARIO_SINTOMAS.find((x) => x.id === sId);
                          return (
                            <span
                              key={sId}
                              className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-[11px]"
                            >
                              {s?.nome || sId}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Propedêutica / Exames Recomendados */}
                  <div className="space-y-1.5 text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <ClipboardList className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      Propedêutica Investigativa Recomendada (PCDT / Diretriz):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-700 dark:text-slate-300">
                      {hip.exames_investigativos.map((ex, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <span className="font-bold text-teal-600">•</span>
                          <span>{ex}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Conduta Farmacológica Inicial Recomendada */}
                  <div className="space-y-1.5 text-xs bg-teal-50/50 dark:bg-teal-950/20 p-3 rounded-xl border border-teal-200/60 dark:border-teal-800/40">
                    <span className="font-bold text-teal-900 dark:text-teal-300 block">
                      Conduta Inicial Recomendada:
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {hip.conduta_inicial}
                    </p>

                    {hip.contraindicacoes_absolutas.length > 0 && (
                      <div className="mt-2 text-rose-700 dark:text-rose-300 font-bold flex items-start gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>Contraindicações Estritas: {hip.contraindicacoes_absolutas.join('; ')}</span>
                      </div>
                    )}
                  </div>

                  {/* Ações Rápidas por Doença */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => adicionarCondutaNaReceita(hip)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        {adicionadoId === hip.id_protocolo
                          ? '✓ Inserido na Receita Digital!'
                          : 'Adicionar à Receita Digital'}
                      </button>

                      <button
                        type="button"
                        onClick={() => copiarConduta(hip)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition"
                      >
                        {copiadoId === hip.id_protocolo ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Copiar para Prontuário
                          </>
                        )}
                      </button>
                    </div>

                    {onAbrirProtocolo && (
                      <button
                        type="button"
                        onClick={() => onAbrirProtocolo(hip.id_protocolo)}
                        className="inline-flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400 hover:underline font-bold"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        Ver Protocolo e Monografia Completa →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================
          TEMPLATE OCULTO PARA IMPRESSÃO DE LAUDO DIAGNÓSTICO EM PDF
         =================================================================== */}
      <div className="hidden">
        <div
          id="relatorio-diagnostico-print"
          className="p-10 bg-white text-slate-900 font-sans max-w-[800px] space-y-6"
        >
          <div className="border-b-2 border-teal-700 pb-4 flex justify-between items-start">
            <div>
              <h1 className="text-xl font-black tracking-tight text-teal-800">
                RELATÓRIO DE INVESTIGAÇÃO CLÍNICA & PROPEDÊUTICA
              </h1>
              <p className="text-xs text-slate-600">
                Suporte Determinístico à Decisão Médica &bull; OpenClinical
              </p>
            </div>
            <div className="text-right text-xs text-slate-500 font-mono">
              Data: {new Date().toLocaleDateString('pt-BR')} {new Date().toLocaleTimeString('pt-BR')}
            </div>
          </div>

          {/* Dados do Médico e Paciente */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="font-bold block text-slate-800">MÉDICO ASSISTENTE:</span>
              <span>{perfilMedico.nome_completo}</span>
              <span className="block text-slate-600">CRM/{perfilMedico.uf_crm} {perfilMedico.crm} &bull; RQE {perfilMedico.rqe || 'Clínica Geral'}</span>
            </div>
            <div>
              <span className="font-bold block text-slate-800">PACIENTE:</span>
              <span>{pacienteAtivo ? pacienteAtivo.nome_completo : 'Paciente Geral / Consulta Ambulatorial'}</span>
              <span className="block text-slate-600">Idade: {pacienteAtivo?.idade_anos || '--'} anos &bull; Sexo: {pacienteAtivo?.sexo || '--'}</span>
            </div>
          </div>

          {/* Sintomas Relatados */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-teal-900 uppercase tracking-wider border-b border-slate-200 pb-1">
              1. Queixas e Sintomas Selecionados na Avaliação:
            </h3>
            <div className="flex flex-wrap gap-1 text-xs">
              {sintomasSelecionados.map((id) => {
                const s = DICIONARIO_SINTOMAS.find((x) => x.id === id);
                return (
                  <span key={id} className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded font-medium">
                    {s?.nome || id}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Hipóteses Levantadas */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-teal-900 uppercase tracking-wider border-b border-slate-200 pb-1">
              2. Hipóteses Diagnósticas Determinísticas Levantadas:
            </h3>
            {analise.hipoteses.slice(0, 4).map((h, i) => (
              <div key={i} className="text-xs p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{h.doenca} (CIDs: {h.cids.join(', ')})</span>
                  <span className="text-teal-700">{h.score_match}% de compatibilidade</span>
                </div>
                <p className="text-slate-700 leading-relaxed"><strong className="text-slate-900">Conduta:</strong> {h.conduta_inicial}</p>
                <div className="text-slate-600"><strong className="text-slate-900">Exames Recomendados:</strong> {h.exames_investigativos.join('; ')}</div>
              </div>
            ))}
          </div>

          {/* Rodapé e Assinatura */}
          <div className="pt-8 text-center space-y-2">
            <div className="w-64 mx-auto border-t border-slate-400"></div>
            <p className="text-xs font-bold text-slate-900">{perfilMedico.nome_completo}</p>
            <p className="text-[10px] text-slate-600 font-mono">CRM/{perfilMedico.uf_crm} {perfilMedico.crm}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
