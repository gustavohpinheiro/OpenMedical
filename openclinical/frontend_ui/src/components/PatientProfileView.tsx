import React, { useState, useEffect, useMemo } from 'react';
import {
  User,
  Calendar,
  Weight,
  Ruler,
  AlertOctagon,
  Activity,
  FileText,
  Clock,
  Printer,
  Download,
  Trash2,
  RotateCcw,
  Check,
  Plus,
  BookOpen,
  Brain,
  FileSpreadsheet,
  Stethoscope,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import {
  Paciente,
  ReceitaSalva,
  RelatorioTesteRealizado,
  EvolucaoProntuario,
  BlocoPrescricao,
} from '../types';
import {
  obterPacienteAtivo,
  listarReceitasSalvas,
  excluirReceitaSalva,
  listarRelatoriosTestes,
  listarEvolucoesProntuario,
  salvarEvolucaoProntuario,
  salvarBlocosPrescricao,
  obterPerfilMedicoAtivo,
} from '../storage_clinico';
import { exportarRelatorioTesteEmPdf, exportarElementosParaPdf } from '../pdf_generator';

interface PatientProfileViewProps {
  onNavegarPrescricao?: () => void;
  onEditarPaciente?: (pac: Paciente) => void;
}

export const PatientProfileView: React.FC<PatientProfileViewProps> = ({
  onNavegarPrescricao,
  onEditarPaciente,
}) => {
  const [paciente, setPaciente] = useState<Paciente | null>(obterPacienteAtivo());
  const [receitas, setReceitas] = useState<ReceitaSalva[]>([]);
  const [testes, setTestes] = useState<RelatorioTesteRealizado[]>([]);
  const [evolucoes, setEvolucoes] = useState<EvolucaoProntuario[]>([]);

  const [abaAtiva, setAbaAtiva] = useState<'receitas' | 'testes' | 'evolucoes'>('receitas');
  const [receitaAbertaId, setReceitaAbertaId] = useState<string | null>(null);

  // Form de Nova Evolução
  const [novaAnamnese, setNovaAnamnese] = useState('');
  const [novoMotivo, setNovoMotivo] = useState('');
  const [novaConduta, setNovaConduta] = useState('');
  const [sucessoEvolucao, setSucessoEvolucao] = useState(false);
  const [sucessoCargaReceita, setSucessoCargaReceita] = useState(false);

  const perfilMedico = obterPerfilMedicoAtivo();

  const recarregarHistorico = () => {
    const pac = obterPacienteAtivo();
    setPaciente(pac);
    if (pac) {
      setReceitas(listarReceitasSalvas(pac.id));
      setTestes(listarRelatoriosTestes(pac.id));
      setEvolucoes(listarEvolucoesProntuario(pac.id));
    } else {
      setReceitas(listarReceitasSalvas());
      setTestes(listarRelatoriosTestes());
      setEvolucoes([]);
    }
  };

  useEffect(() => {
    recarregarHistorico();
    const handlePaciente = (e: any) => {
      setPaciente(e.detail);
      recarregarHistorico();
    };
    const handleReceita = () => recarregarHistorico();

    window.addEventListener('openclinical_paciente_alterado', handlePaciente);
    window.addEventListener('openclinical_receita_salva', handleReceita);
    window.addEventListener('openclinical_receita_excluida', handleReceita);
    window.addEventListener('openclinical_relatorio_salvo', handleReceita);

    return () => {
      window.removeEventListener('openclinical_paciente_alterado', handlePaciente);
      window.removeEventListener('openclinical_receita_salva', handleReceita);
      window.removeEventListener('openclinical_receita_excluida', handleReceita);
      window.removeEventListener('openclinical_relatorio_salvo', handleReceita);
    };
  }, []);

  // Repetir / Carregar receita antiga na gaveta modular atual
  const carregarReceitaNaCesta = (rec: ReceitaSalva) => {
    salvarBlocosPrescricao(rec.blocos);
    setSucessoCargaReceita(true);
    setTimeout(() => {
      setSucessoCargaReceita(false);
      if (onNavegarPrescricao) onNavegarPrescricao();
    }, 1200);
  };

  // Excluir receita do histórico
  const handleExcluirReceita = (id: string) => {
    if (confirm('Deseja excluir esta receita do histórico do paciente?')) {
      excluirReceitaSalva(id);
      recarregarHistorico();
    }
  };

  // Adicionar Evolução Clínica
  const handleSalvarEvolucao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paciente || !novaAnamnese.trim()) return;

    const nova: EvolucaoProntuario = {
      id: `ev_${Date.now()}`,
      paciente_id: paciente.id,
      medico_nome: perfilMedico.nome_completo,
      data_hora: new Date().toISOString(),
      motivo_consulta: novoMotivo.trim() || 'Consulta Ambulatorial de Rotina',
      anamnese_evolucao: novaAnamnese.trim(),
      conduta_planejada: novaConduta.trim() || undefined,
    };

    salvarEvolucaoProntuario(nova);
    setEvolucoes(listarEvolucoesProntuario(paciente.id));
    setNovaAnamnese('');
    setNovoMotivo('');
    setNovaConduta('');
    setSucessoEvolucao(true);
    setTimeout(() => setSucessoEvolucao(false), 2200);
  };

  // IMC e Superfície Corporal
  const biometria = useMemo(() => {
    if (!paciente?.peso_kg || !paciente?.altura_cm) return null;
    const imc = paciente.peso_kg / Math.pow(paciente.altura_cm / 100, 2);
    const bsa = Math.sqrt((paciente.peso_kg * paciente.altura_cm) / 3600); // Mosteller
    let catImc = 'Eutrófico';
    if (imc < 18.5) catImc = 'Baixo Peso';
    else if (imc >= 25 && imc < 30) catImc = 'Sobrepeso';
    else if (imc >= 30) catImc = 'Obesidade';

    return { imc: imc.toFixed(1), catImc, bsa: bsa.toFixed(2) };
  }, [paciente]);

  return (
    <div className="space-y-6">
      {/* =====================================================================
          CABEÇALHO DO PRONTUÁRIO / FICHA GERAL DO PACIENTE
         ===================================================================== */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 text-slate-800 dark:text-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold text-xl uppercase shadow-md">
              {paciente ? paciente.nome_completo.substring(0, 2) : '??'}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold tracking-tight">
                  {paciente ? paciente.nome_completo : 'Nenhum Paciente Selecionado'}
                </h2>
                {paciente && (
                  <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-mono text-xs font-bold">
                    {paciente.idade_anos} anos &bull; {paciente.sexo === 'M' ? 'Masculino' : 'Feminino'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {paciente?.cpf && <span>CPF: {paciente.cpf}</span>}{' '}
                {paciente?.cns && <span>&bull; Cartão SUS: {paciente.cns}</span>}{' '}
                {paciente?.data_nascimento && <span>&bull; Nasc: {paciente.data_nascimento}</span>}
              </p>
            </div>
          </div>

          {paciente && onEditarPaciente && (
            <button
              type="button"
              onClick={() => onEditarPaciente(paciente)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition border border-slate-300 dark:border-slate-700 self-start md:self-auto"
            >
              Editar Ficha Cadastral
            </button>
          )}
        </div>

        {/* Biometria & Alertas Críticos */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          {/* Box Peso & IMC */}
          <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              Biometria & IMC
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono text-teal-600 dark:text-teal-400">
                {paciente?.peso_kg ? `${paciente.peso_kg} kg` : '--'}
              </span>
              <span className="text-slate-500">
                {paciente?.altura_cm ? `(${paciente.altura_cm} cm)` : ''}
              </span>
            </div>
            {biometria && (
              <span className="text-[11px] text-slate-600 dark:text-slate-400 block font-medium">
                IMC: <strong>{biometria.imc} kg/m²</strong> ({biometria.catImc}) &bull; SC: {biometria.bsa} m²
              </span>
            )}
          </div>

          {/* Alergias Medicamentosas */}
          <div className="md:col-span-2 bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 space-y-2">
            <span className="text-[10px] uppercase font-black text-rose-700 dark:text-rose-400 tracking-wider flex items-center gap-1.5">
              <AlertOctagon className="w-3.5 h-3.5" /> Alergias Documentadas
            </span>
            {paciente?.alergias && paciente.alergias.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {paciente.alergias.map((al) => (
                  <span
                    key={al}
                    className="px-2.5 py-1 bg-rose-500/20 text-rose-800 dark:text-rose-300 border border-rose-500/40 rounded-lg text-xs font-bold"
                  >
                    ⚠️ {al}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-slate-500 text-[11px] italic">
                Nenhuma alergia a medicamentos relatada até o momento.
              </span>
            )}
          </div>

          {/* Comorbidades */}
          <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-teal-600 dark:text-teal-400 tracking-wider flex items-center gap-1">
              <Activity className="w-3 h-3" /> Condições Crônicas
            </span>
            {paciente?.comorbidades && paciente.comorbidades.length > 0 ? (
              <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5">
                {paciente.comorbidades.map((c, i) => (
                  <li key={i} className="truncate">
                    &bull; {c}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-slate-500 text-[11px] italic">Sem comorbidades registradas.</span>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================================
          ABAS DO PRONTUÁRIO: RECEITAS | TESTES | EVOLUÇÕES
         ===================================================================== */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setAbaAtiva('receitas')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 border ${
            abaAtiva === 'receitas'
              ? 'bg-teal-600 text-white border-teal-500 shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-400'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Histórico de Receitas Salvas</span>
          <span className="px-1.5 py-0.2 bg-black/20 rounded font-mono text-[10px]">
            {receitas.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setAbaAtiva('testes')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 border ${
            abaAtiva === 'testes'
              ? 'bg-teal-600 text-white border-teal-500 shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-400'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>Laudos e Testes de Consultório</span>
          <span className="px-1.5 py-0.2 bg-black/20 rounded font-mono text-[10px]">
            {testes.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setAbaAtiva('evolucoes')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 border ${
            abaAtiva === 'evolucoes'
              ? 'bg-teal-600 text-white border-teal-500 shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-400'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>Evolução & Anamnese Clínica</span>
          <span className="px-1.5 py-0.2 bg-black/20 rounded font-mono text-[10px]">
            {evolucoes.length}
          </span>
        </button>
      </div>

      {sucessoCargaReceita && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 rounded-2xl flex items-center gap-2 font-bold text-xs animate-in fade-in">
          <Check className="w-4 h-4" /> Prescrição antiga carregada na gaveta modular com sucesso!
        </div>
      )}

      {/* =====================================================================
          ABA 1: HISTÓRICO DE RECEITAS SALVAS
         ===================================================================== */}
      {abaAtiva === 'receitas' && (
        <div className="space-y-4">
          {receitas.length === 0 ? (
            <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-2 text-xs">
              <FileText className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
              <p className="font-semibold text-slate-600 dark:text-slate-300">
                Nenhuma receita emitida ou salva para este paciente ainda.
              </p>
              <p className="text-[11px] text-slate-400">
                Ao finalizar uma receita na gaveta modular ou na estação de prescrição, clique em{' '}
                <strong>&quot;Salvar no Prontuário&quot;</strong>.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {receitas.map((rec) => {
                const aberta = receitaAbertaId === rec.id;
                return (
                  <div
                    key={rec.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3 transition text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                            Prescrição Médica &bull; {new Date(rec.data_hora).toLocaleDateString('pt-BR')}{' '}
                            às {new Date(rec.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="px-2 py-0.5 bg-teal-500/15 text-teal-700 dark:text-teal-300 rounded font-mono text-[10px] font-bold">
                            {rec.total_itens} item(ns)
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Prescritor: {rec.medico_nome} ({rec.medico_crm})
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => carregarReceitaNaCesta(rec)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600/10 hover:bg-teal-600/20 text-teal-700 dark:text-teal-300 border border-teal-500/30 rounded-xl font-bold transition text-xs"
                          title="Carregar todos estes medicamentos de volta na gaveta atual"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Repetir Receita</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setReceitaAbertaId(aberta ? null : rec.id)}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400"
                          title="Detalhar itens"
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform ${aberta ? 'rotate-180' : ''}`} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleExcluirReceita(rec.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg"
                          title="Excluir do histórico"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Itens da Receita (Lego Blocks Salvos) */}
                    <div className="space-y-2">
                      {rec.blocos.map((bloco, bIdx) => (
                        <div
                          key={bloco.id}
                          className="p-2.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-xl space-y-1"
                        >
                          <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                            <span>
                              {bIdx + 1}. {bloco.titulo}
                            </span>
                            <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              {bloco.tipo}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed pl-2 whitespace-pre-line">
                            {bloco.conteudo}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          ABA 2: HISTÓRICO DE LAUDOS E TESTES CLÍNICOS
         ===================================================================== */}
      {abaAtiva === 'testes' && (
        <div className="space-y-3">
          {testes.length === 0 ? (
            <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-2 text-xs">
              <Brain className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
              <p className="font-semibold text-slate-600 dark:text-slate-300">
                Nenhum teste rápido ou escala clínica salva para este paciente.
              </p>
              <p className="text-[11px] text-slate-400">
                Execute os testes na aba <strong>Testes de Consultório</strong> (MEEM, PHQ-9, GAD-7, FAST, FINDRISC) e clique em &quot;Exportar Laudo&quot;.
              </p>
            </div>
          ) : (
            testes.map((rel) => (
              <div
                key={rel.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {rel.teste_nome}
                      </span>
                      <span className="px-2 py-0.5 bg-teal-500/15 text-teal-700 dark:text-teal-300 font-bold rounded text-[10px] font-mono">
                        {rel.pontuacao_obtida}/{rel.pontuacao_maxima} pts
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Realizado em {new Date(rel.data_hora).toLocaleDateString('pt-BR')} &bull; Médico: {rel.medico_nome}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => exportarRelatorioTesteEmPdf(rel, perfilMedico, paciente)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold transition text-xs shadow-sm self-start sm:self-auto"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar Laudo PDF</span>
                  </button>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5">
                  <div className="font-bold text-teal-700 dark:text-teal-300">
                    Resultado: {rel.classificacao}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    <strong>Interpretação:</strong> {rel.interpretacao_clinica}
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    <strong>Conduta Sugerida:</strong> {rel.conduta_proposta}
                  </p>
                  <p className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-200 dark:border-slate-800">
                    Fonte: {rel.referencia_bibliografica}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* =====================================================================
          ABA 3: EVOLUÇÃO E ANAMNESE CLÍNICA
         ===================================================================== */}
      {abaAtiva === 'evolucoes' && (
        <div className="space-y-6">
          {/* Formulário para Adicionar Nova Evolução */}
          <form
            onSubmit={handleSalvarEvolucao}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3 text-xs"
          >
            <span className="font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 block text-[11px]">
              Nova Evolução / Anamnese de Consulta:
            </span>

            {sucessoEvolucao && (
              <div className="p-2.5 bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 rounded-xl font-bold text-xs flex items-center gap-1.5 animate-in fade-in">
                <Check className="w-4 h-4" /> Evolução clínica registrada no prontuário!
              </div>
            )}

            <div>
              <label className="text-slate-600 dark:text-slate-400 block mb-1">Motivo do Atendimento / Queixa Principal</label>
              <input
                type="text"
                placeholder="Ex: Retorno de Hipertensão Arterial e Diabetes / Avaliação de exames..."
                value={novoMotivo}
                onChange={(e) => setNovoMotivo(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="text-slate-600 dark:text-slate-400 block mb-1">Anamnese, Exame Físico e Evolução *</label>
              <textarea
                rows={4}
                required
                placeholder="Ex: Paciente refere adesão adequada à medicação anti-hipertensiva. Nega episódios de tontura ou cefaleia. Ao exame físico: PA 128/82 mmHg, FC 74 bpm, MV+ sem RA, pulsos periféricos palpáveis..."
                value={novaAnamnese}
                onChange={(e) => setNovaAnamnese(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-slate-100 leading-relaxed focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="text-slate-600 dark:text-slate-400 block mb-1">Conduta e Plano Terapêutico</label>
              <input
                type="text"
                placeholder="Ex: Mantida Losartana 50mg/dia. Solicitado controle de HbA1c e retorno em 60 dias."
                value={novaConduta}
                onChange={(e) => setNovaConduta(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-teal-950/20"
            >
              <Plus className="w-4 h-4" /> Registrar no Prontuário
            </button>
          </form>

          {/* Linha do Tempo das Evoluções Salvas */}
          <div className="space-y-3">
            {evolucoes.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-xs">
                Nenhuma nota clínica ou evolução registrada para este paciente ainda.
              </div>
            ) : (
              evolucoes.map((ev) => (
                <div
                  key={ev.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-2 text-xs"
                >
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {ev.motivo_consulta}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {new Date(ev.data_hora).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {ev.anamnese_evolucao}
                  </p>
                  {ev.conduta_planejada && (
                    <div className="p-2.5 bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/40 rounded-xl text-teal-900 dark:text-teal-200 text-[11px]">
                      <strong>Conduta:</strong> {ev.conduta_planejada}
                    </div>
                  )}
                  <p className="text-[10px] text-slate-400 text-right">
                    Registrado por: {ev.medico_nome}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
