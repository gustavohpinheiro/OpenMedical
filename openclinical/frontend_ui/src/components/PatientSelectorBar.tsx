import React, { useState, useEffect } from 'react';
import {
  User,
  Users,
  UserPlus,
  AlertOctagon,
  Calendar,
  Weight,
  Ruler,
  FileSpreadsheet,
  Edit3,
  Trash2,
  Check,
  X,
  Search,
  ChevronDown,
  Activity,
} from 'lucide-react';
import { Paciente } from '../types';
import {
  listarPacientes,
  obterPacienteAtivo,
  definirPacienteAtivo,
  salvarPaciente,
  excluirPaciente,
} from '../storage_clinico';

interface PatientSelectorBarProps {
  onPacienteSelecionado?: (paciente: Paciente | null) => void;
  onAbrirProntuario?: () => void;
}

export const PatientSelectorBar: React.FC<PatientSelectorBarProps> = ({
  onPacienteSelecionado,
  onAbrirProntuario,
}) => {
  const [pacienteAtivo, setPacienteAtivo] = useState<Paciente | null>(null);
  const [modalListaAberto, setModalListaAberto] = useState(false);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [busca, setBusca] = useState('');
  const [pacientes, setPacientes] = useState<Paciente[]>([]);

  // Formulário de Paciente
  const [formPaciente, setFormPaciente] = useState<Partial<Paciente>>({
    nome_completo: '',
    cpf: '',
    cns: '',
    data_nascimento: '1980-01-01',
    idade_anos: 44,
    sexo: 'M',
    peso_kg: 70,
    altura_cm: 170,
    endereco: '',
    telefone: '',
    alergias: [],
    comorbidades: [],
    observacoes_clinicas: '',
  });

  const [novaAlergia, setNovaAlergia] = useState('');
  const [novaComorbidade, setNovaComorbidade] = useState('');

  const recarregar = () => {
    const todos = listarPacientes();
    setPacientes(todos);
    const ativo = obterPacienteAtivo();
    setPacienteAtivo(ativo);
    if (onPacienteSelecionado) onPacienteSelecionado(ativo);
  };

  useEffect(() => {
    recarregar();
    const handlePacienteAlterado = (e: any) => {
      setPacienteAtivo(e.detail);
      if (onPacienteSelecionado) onPacienteSelecionado(e.detail);
    };
    window.addEventListener('openclinical_paciente_alterado', handlePacienteAlterado);
    return () => {
      window.removeEventListener('openclinical_paciente_alterado', handlePacienteAlterado);
    };
  }, []);

  const calcularIdade = (dataNascStr: string): number => {
    if (!dataNascStr) return 0;
    const nasc = new Date(dataNascStr);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
      idade--;
    }
    return Math.max(0, idade);
  };

  const abrirNovoPaciente = () => {
    setFormPaciente({
      id: `pac_${Date.now()}`,
      nome_completo: '',
      cpf: '',
      cns: '',
      data_nascimento: '1985-05-15',
      idade_anos: 39,
      sexo: 'F',
      peso_kg: 65,
      altura_cm: 165,
      endereco: '',
      telefone: '',
      alergias: [],
      comorbidades: [],
      observacoes_clinicas: '',
      criado_em: new Date().toISOString(),
    });
    setModalEdicaoAberto(true);
  };

  const abrirEditarPaciente = (pac: Paciente) => {
    setFormPaciente({ ...pac });
    setModalEdicaoAberto(true);
  };

  const salvarFormulario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPaciente.nome_completo?.trim()) return;

    const idade = calcularIdade(formPaciente.data_nascimento || '1980-01-01');

    const completo: Paciente = {
      id: formPaciente.id || `pac_${Date.now()}`,
      nome_completo: formPaciente.nome_completo.trim(),
      cpf: formPaciente.cpf?.trim() || undefined,
      cns: formPaciente.cns?.trim() || undefined,
      data_nascimento: formPaciente.data_nascimento || '1980-01-01',
      idade_anos: idade,
      sexo: formPaciente.sexo || 'M',
      peso_kg: formPaciente.peso_kg ? Number(formPaciente.peso_kg) : undefined,
      altura_cm: formPaciente.altura_cm ? Number(formPaciente.altura_cm) : undefined,
      endereco: formPaciente.endereco?.trim() || undefined,
      telefone: formPaciente.telefone?.trim() || undefined,
      alergias: formPaciente.alergias || [],
      comorbidades: formPaciente.comorbidades || [],
      observacoes_clinicas: formPaciente.observacoes_clinicas?.trim() || undefined,
      criado_em: formPaciente.criado_em || new Date().toISOString(),
    };

    salvarPaciente(completo);
    definirPacienteAtivo(completo);
    recarregar();
    setModalEdicaoAberto(false);
  };

  const adicionarAlergiaTag = () => {
    if (!novaAlergia.trim()) return;
    const lista = formPaciente.alergias || [];
    if (!lista.includes(novaAlergia.trim())) {
      setFormPaciente({ ...formPaciente, alergias: [...lista, novaAlergia.trim()] });
    }
    setNovaAlergia('');
  };

  const removerAlergiaTag = (item: string) => {
    const lista = (formPaciente.alergias || []).filter((a) => a !== item);
    setFormPaciente({ ...formPaciente, alergias: lista });
  };

  const adicionarComorbidadeTag = () => {
    if (!novaComorbidade.trim()) return;
    const lista = formPaciente.comorbidades || [];
    if (!lista.includes(novaComorbidade.trim())) {
      setFormPaciente({ ...formPaciente, comorbidades: [...lista, novaComorbidade.trim()] });
    }
    setNovaComorbidade('');
  };

  const removerComorbidadeTag = (item: string) => {
    const lista = (formPaciente.comorbidades || []).filter((c) => c !== item);
    setFormPaciente({ ...formPaciente, comorbidades: lista });
  };

  const pacientesFiltrados = pacientes.filter(
    (p) =>
      p.nome_completo.toLowerCase().includes(busca.toLowerCase()) ||
      (p.cpf && p.cpf.includes(busca)) ||
      (p.cns && p.cns.includes(busca))
  );

  return (
    <>
      {/* Barra de Paciente Ativo */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs transition-colors">
        {/* Identificação do Paciente */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold text-xs uppercase shadow-sm">
              {pacienteAtivo ? pacienteAtivo.nome_completo.substring(0, 2) : '??'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {pacienteAtivo ? pacienteAtivo.nome_completo : 'Nenhum Paciente Selecionado'}
                </span>
                {pacienteAtivo && (
                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md font-mono text-[10px] font-semibold">
                    {pacienteAtivo.idade_anos} anos &bull; {pacienteAtivo.sexo === 'M' ? 'Masc' : 'Fem'}
                  </span>
                )}
              </div>
              {pacienteAtivo && (
                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  {pacienteAtivo.cpf && <span>CPF: {pacienteAtivo.cpf}</span>}
                  {pacienteAtivo.peso_kg && (
                    <span className="font-mono text-teal-600 dark:text-teal-400 font-bold">
                      &bull; {pacienteAtivo.peso_kg} kg
                    </span>
                  )}
                  {pacienteAtivo.altura_cm && (
                    <span className="font-mono text-slate-500">
                      &bull; {pacienteAtivo.altura_cm} cm
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Alertas Críticos de Alergia */}
          {pacienteAtivo?.alergias && pacienteAtivo.alergias.length > 0 && (
            <div className="flex items-center gap-1.5 bg-rose-500/15 border border-rose-500/40 px-3 py-1 rounded-xl text-rose-800 dark:text-rose-300 font-bold text-[11px] animate-pulse">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>Alergias:</span>
              <span className="underline decoration-rose-500/60 font-black">
                {pacienteAtivo.alergias.join(', ')}
              </span>
            </div>
          )}

          {/* Comorbidades */}
          {pacienteAtivo?.comorbidades && pacienteAtivo.comorbidades.length > 0 && (
            <div className="hidden xl:flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-[11px]">
              <Activity className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Condições: {pacienteAtivo.comorbidades.slice(0, 2).join(', ')}</span>
              {pacienteAtivo.comorbidades.length > 2 && (
                <span className="text-[10px] text-slate-400 font-mono">
                  (+{pacienteAtivo.comorbidades.length - 2})
                </span>
              )}
            </div>
          )}
        </div>

        {/* Botões de Ação do Paciente */}
        <div className="flex items-center gap-2">
          {pacienteAtivo && onAbrirProntuario && (
            <button
              type="button"
              onClick={onAbrirProntuario}
              className="flex items-center gap-1 px-3 py-1.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-500/30 rounded-xl font-bold transition text-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Ver Prontuário Digital</span>
            </button>
          )}

          {pacienteAtivo && (
            <button
              type="button"
              onClick={() => abrirEditarPaciente(pacienteAtivo)}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 rounded-lg transition text-[11px] flex items-center gap-1 border border-slate-200 dark:border-slate-800"
              title="Editar dados clínicos do paciente"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Editar Ficha</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setModalListaAberto(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 rounded-xl font-medium transition text-xs border border-slate-200 dark:border-slate-700"
          >
            <Users className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Trocar Paciente</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={abrirNovoPaciente}
            className="flex items-center gap-1 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold transition text-xs shadow-md shadow-teal-950/20"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Novo Paciente</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          MODAL DE SELEÇÃO DE PACIENTE (LISTA)
         ===================================================================== */}
      {modalListaAberto && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in isolate">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl text-slate-800 dark:text-slate-100">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Diretório Local de Pacientes</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Selecione o paciente ativo para que as prescrições e laudos já recebam seus dados.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalListaAberto(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Campo de Busca */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-950/40">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Pesquisar por nome, CPF ou CNS..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {/* Lista de Pacientes */}
            <div className="p-4 overflow-y-auto space-y-2 flex-1">
              {pacientesFiltrados.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  Nenhum paciente encontrado com &quot;{busca}&quot;.
                </div>
              ) : (
                pacientesFiltrados.map((pac) => {
                  const isAtivo = pacienteAtivo?.id === pac.id;
                  return (
                    <div
                      key={pac.id}
                      onClick={() => {
                        definirPacienteAtivo(pac);
                        setModalListaAberto(false);
                      }}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                        isAtivo
                          ? 'bg-teal-500/15 border-teal-500/40 text-slate-900 dark:text-slate-100 shadow-sm'
                          : 'bg-slate-50/70 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs">{pac.nome_completo}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 font-mono">
                            {pac.idade_anos}a &bull; {pac.sexo}
                          </span>
                          {isAtivo && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-700 dark:text-teal-300 font-bold">
                              Ativo
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                          {pac.cpf && <span>CPF: {pac.cpf}</span>}
                          {pac.peso_kg && <span>&bull; {pac.peso_kg} kg</span>}
                        </div>
                        {pac.alergias.length > 0 && (
                          <div className="text-[10px] text-rose-600 dark:text-rose-400 font-bold">
                            ⚠️ Alergias: {pac.alergias.join(', ')}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => {
                            setModalListaAberto(false);
                            abrirEditarPaciente(pac);
                          }}
                          className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg"
                          title="Editar"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Deseja excluir o paciente ${pac.nome_completo}?`)) {
                              excluirPaciente(pac.id);
                              recarregar();
                            }
                          }}
                          className="p-1.5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-500 rounded-lg"
                          title="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setModalListaAberto(false);
                  abrirNovoPaciente();
                }}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" /> Cadastrar Novo Paciente
              </button>
              <button
                type="button"
                onClick={() => {
                  definirPacienteAtivo(null);
                  setModalListaAberto(false);
                }}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs"
              >
                Desmarcar Paciente Ativo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL DE CADASTRO / EDIÇÃO DE PACIENTE (ISOLADO Z-[110])
         ===================================================================== */}
      {modalEdicaoAberto && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in isolate">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl text-slate-800 dark:text-slate-100">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur flex items-center justify-between z-10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">
                    {formPaciente.id && pacientes.some((p) => p.id === formPaciente.id)
                      ? 'Editar Ficha do Paciente'
                      : 'Novo Paciente Clínico'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Dados utilizados para cálculo posológico pediátrico, função renal e impressão da receita.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalEdicaoAberto(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={salvarFormulario} className="p-6 space-y-4 text-xs">
              {/* Nome e Sexo */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={formPaciente.nome_completo || ''}
                    onChange={(e) => setFormPaciente({ ...formPaciente, nome_completo: e.target.value })}
                    placeholder="Ex: Dona Maria de Fátima..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Sexo Biológico *</label>
                  <select
                    value={formPaciente.sexo || 'F'}
                    onChange={(e) => setFormPaciente({ ...formPaciente, sexo: e.target.value as 'M' | 'F' })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                  >
                    <option value="F">Feminino</option>
                    <option value="M">Masculino</option>
                  </select>
                </div>
              </div>

              {/* Data Nascimento e Documentos */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Data de Nascimento</label>
                  <input
                    type="date"
                    value={formPaciente.data_nascimento || '1985-01-01'}
                    onChange={(e) => {
                      const dt = e.target.value;
                      setFormPaciente({
                        ...formPaciente,
                        data_nascimento: dt,
                        idade_anos: calcularIdade(dt),
                      });
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">CPF</label>
                  <input
                    type="text"
                    value={formPaciente.cpf || ''}
                    onChange={(e) => setFormPaciente({ ...formPaciente, cpf: e.target.value })}
                    placeholder="000.000.000-00"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Cartão SUS (CNS)</label>
                  <input
                    type="text"
                    value={formPaciente.cns || ''}
                    onChange={(e) => setFormPaciente({ ...formPaciente, cns: e.target.value })}
                    placeholder="7000..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>
              </div>

              {/* Antropometria (Peso, Altura, IMC) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1 flex items-center gap-1">
                    <Weight className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> Peso Real (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="300"
                    value={formPaciente.peso_kg || ''}
                    onChange={(e) =>
                      setFormPaciente({ ...formPaciente, peso_kg: parseFloat(e.target.value) || undefined })
                    }
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1 flex items-center gap-1">
                    <Ruler className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> Altura (cm)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="250"
                    value={formPaciente.altura_cm || ''}
                    onChange={(e) =>
                      setFormPaciente({ ...formPaciente, altura_cm: parseInt(e.target.value) || undefined })
                    }
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">IMC Calculado</label>
                  <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 font-mono font-bold flex items-center justify-between">
                    <span>
                      {formPaciente.peso_kg && formPaciente.altura_cm
                        ? (
                            formPaciente.peso_kg /
                            Math.pow(formPaciente.altura_cm / 100, 2)
                          ).toFixed(1)
                        : '--'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">kg/m²</span>
                  </div>
                </div>
              </div>

              {/* Alergias Conhecidas (Tags) */}
              <div className="space-y-2">
                <label className="block font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <AlertOctagon className="w-3.5 h-3.5" /> Alergias a Medicamentos / Alimentos
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={novaAlergia}
                    onChange={(e) => setNovaAlergia(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        adicionarAlergiaTag();
                      }
                    }}
                    placeholder="Ex: Dipirona, Penicilinas, AINEs... (Pressione Enter para adicionar)"
                    className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 text-xs"
                  />
                  <button
                    type="button"
                    onClick={adicionarAlergiaTag}
                    className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30 rounded-xl font-bold text-xs"
                  >
                    Adicionar
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(formPaciente.alergias || []).map((alergia) => (
                    <span
                      key={alergia}
                      className="px-2.5 py-1 bg-rose-500/15 text-rose-800 dark:text-rose-300 border border-rose-500/40 rounded-lg text-xs font-bold flex items-center gap-1.5"
                    >
                      {alergia}
                      <button
                        type="button"
                        onClick={() => removerAlergiaTag(alergia)}
                        className="hover:text-rose-600 dark:hover:text-rose-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Comorbidades e Condições Prévias */}
              <div className="space-y-2">
                <label className="block font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" /> Comorbidades & Doenças Crônicas
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={novaComorbidade}
                    onChange={(e) => setNovaComorbidade(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        adicionarComorbidadeTag();
                      }
                    }}
                    placeholder="Ex: Hipertensão, Diabetes Tipo 2, Asma... (Pressione Enter)"
                    className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 text-xs"
                  />
                  <button
                    type="button"
                    onClick={adicionarComorbidadeTag}
                    className="px-3 py-2 bg-teal-600/10 hover:bg-teal-600/20 text-teal-700 dark:text-teal-300 border border-teal-500/30 rounded-xl font-bold text-xs"
                  >
                    Adicionar
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(formPaciente.comorbidades || []).map((comorbidade) => (
                    <span
                      key={comorbidade}
                      className="px-2.5 py-1 bg-teal-500/15 text-teal-800 dark:text-teal-300 border border-teal-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                    >
                      {comorbidade}
                      <button
                        type="button"
                        onClick={() => removerComorbidadeTag(comorbidade)}
                        className="hover:text-teal-900 dark:hover:text-teal-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Endereço e Contato */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Endereço Residencial (Obrigatório em Controle Especial)</label>
                  <input
                    type="text"
                    value={formPaciente.endereco || ''}
                    onChange={(e) => setFormPaciente({ ...formPaciente, endereco: e.target.value })}
                    placeholder="Rua, número, bairro e cidade..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    value={formPaciente.telefone || ''}
                    onChange={(e) => setFormPaciente({ ...formPaciente, telefone: e.target.value })}
                    placeholder="(00) 00000-0000"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 text-xs"
                  />
                </div>
              </div>

              {/* Botões */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalEdicaoAberto(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-teal-950/20"
                >
                  <Check className="w-4 h-4" /> Salvar Paciente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
