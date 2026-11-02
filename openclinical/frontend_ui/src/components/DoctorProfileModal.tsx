import React, { useState, useEffect, useRef } from 'react';
import {
  UserCheck,
  Building,
  Upload,
  X,
  Check,
  FileImage,
  FileText,
  Users,
  UserPlus,
  Shield,
  Key,
  PenTool,
  Eraser,
  ShieldCheck,
  Sparkles,
  Info,
} from 'lucide-react';
import { PerfilMedico } from '../types';
import {
  salvarPerfilMedicoAtivo,
  listarPerfisMedicos,
  trocarPerfilMedico,
} from '../storage_clinico';
import { OpenClinicalLogo } from './OpenClinicalLogo';

interface DoctorProfileModalProps {
  perfil: PerfilMedico;
  isOpen: boolean;
  onClose: () => void;
  onPerfilSalvo: (novoPerfil: PerfilMedico) => void;
  abaInicial?: 'dados' | 'assinatura' | 'receita';
}

export const DoctorProfileModal: React.FC<DoctorProfileModalProps> = ({
  perfil,
  isOpen,
  onClose,
  onPerfilSalvo,
  abaInicial = 'dados',
}) => {
  const [formData, setFormData] = useState<PerfilMedico>({ ...perfil });
  const [todosMedicos, setTodosMedicos] = useState<PerfilMedico[]>([]);
  const [sucessoMsg, setSucessoMsg] = useState(false);
  const [erroMsg, setErroMsg] = useState<string | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<'dados' | 'assinatura' | 'receita'>(abaInicial);

  // Sincroniza aba inicial quando abre
  useEffect(() => {
    if (isOpen && abaInicial) {
      setAbaAtiva(abaInicial);
    }
  }, [isOpen, abaInicial]);

  // Estado para desenho interativo de assinatura no Canvas
  const [modoAssinatura, setModoAssinatura] = useState<'upload' | 'desenho'>('upload');
  const [desenhando, setDesenhando] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sincroniza o estado interno sempre que o modal abre ou perfil muda
  useEffect(() => {
    if (isOpen) {
      setFormData({ ...perfil });
      setTodosMedicos(listarPerfisMedicos());
      setSucessoMsg(false);
      setErroMsg(null);
    }
  }, [isOpen, perfil]);

  if (!isOpen) return null;

  const handleChange = (campo: keyof PerfilMedico, valor: any) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleUploadLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('logo_base64', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadPapelTimbrado = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('papel_timbrado_base64', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadAssinatura = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('assinatura_base64', reader.result as string);
        handleChange('usar_assinatura_eletronica', true);
        if (!formData.hash_assinatura_eletronica) {
          handleChange('hash_assinatura_eletronica', 'OC-SIG-' + Math.random().toString(36).substring(2, 8).toUpperCase());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Funções do Canvas de Assinatura
  const iniciarDesenho = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setDesenhando(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const desenhar = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!desenhando) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = '#0f172a'; // Tinta escura de caneta
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const pararDesenho = () => {
    setDesenhando(false);
  };

  const limparCanvasAssinatura = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const salvarCanvasAssinatura = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    handleChange('assinatura_base64', dataUrl);
    handleChange('usar_assinatura_eletronica', true);
    if (!formData.hash_assinatura_eletronica) {
      handleChange('hash_assinatura_eletronica', 'OC-SIG-' + Math.random().toString(36).substring(2, 8).toUpperCase());
    }
  };

  const handleTrocarMedico = (id: string) => {
    const selecionado = trocarPerfilMedico(id);
    if (selecionado) {
      setFormData({ ...selecionado });
      onPerfilSalvo(selecionado);
      setSucessoMsg(true);
      setTimeout(() => setSucessoMsg(false), 2000);
    }
  };

  const handleCriarNovoMedico = () => {
    const novo: PerfilMedico = {
      id: `med_${Date.now()}`,
      nome_completo: 'Dr(a). Novo Prescritor',
      crm: '',
      uf_crm: 'SP',
      especialidade: 'Clínica Geral',
      nome_clinica: formData.nome_clinica || 'Consultório Médico',
      endereco_consultorio: formData.endereco_consultorio || '',
      telefone_consultorio: formData.telefone_consultorio || '',
      email_contato: '',
      usar_papel_timbrado_proprio: false,
      ocultar_logo_padrao: false,
      ocultar_papel_timbrado_padrao: false,
      usar_assinatura_eletronica: true,
      tamanho_papel_receita: 'A4',
      estilo_receita: 'moderno',
      mostrar_qr_code: true,
      mostrar_linha_assinatura: true,
    };
    setFormData(novo);
  };

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome_completo.trim()) {
      setErroMsg('O nome do médico é obrigatório.');
      return;
    }
    if (!formData.crm.trim()) {
      setErroMsg('O CRM do médico é obrigatório para emissão de receitas.');
      return;
    }

    salvarPerfilMedicoAtivo(formData);
    onPerfilSalvo(formData);
    setTodosMedicos(listarPerfisMedicos());
    setSucessoMsg(true);
    setErroMsg(null);
    setTimeout(() => {
      setSucessoMsg(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col text-slate-800 dark:text-slate-100">
        {/* Topo do Modal */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-2xl border border-teal-500/20">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                Identificação e Perfil do Médico Prescritor
                <span className="text-[10px] bg-teal-500/20 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded font-mono font-semibold">
                  Local &bull; Seguro
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gerencie seus dados profissionais, múltiplos prescritores, assinatura eletrônica e identidade da receita.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Seletor de Perfil do Médico / Multi-Médicos */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Prescritor Selecionado:</span>
            <select
              value={formData.id}
              onChange={(e) => handleTrocarMedico(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500"
            >
              {todosMedicos.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nome_completo} (CRM/{m.uf_crm} {m.crm})
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleCriarNovoMedico}
            className="flex items-center gap-1.5 px-3 py-1 bg-teal-600/10 hover:bg-teal-600/20 text-teal-700 dark:text-teal-300 border border-teal-500/30 rounded-xl font-bold transition"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Cadastrar Outro Médico</span>
          </button>
        </div>

        {/* Abas: Dados Profissionais vs Assinatura Eletrônica vs Papel & Layout */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-50 dark:bg-slate-950/40 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setAbaAtiva('dados')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
              abaAtiva === 'dados'
                ? 'border-teal-500 text-teal-600 dark:text-teal-400 bg-white/50 dark:bg-slate-900/50'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>1. Dados do Médico & CRM</span>
          </button>
          <button
            type="button"
            onClick={() => setAbaAtiva('assinatura')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
              abaAtiva === 'assinatura'
                ? 'border-teal-500 text-teal-600 dark:text-teal-400 bg-white/50 dark:bg-slate-900/50'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <PenTool className="w-4 h-4 text-teal-600" />
            <span className="font-extrabold text-teal-700 dark:text-teal-300">2. 🖋️ Assinatura Eletrônica & Rubrica</span>
          </button>
          <button
            type="button"
            onClick={() => setAbaAtiva('receita')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
              abaAtiva === 'receita'
                ? 'border-teal-500 text-teal-600 dark:text-teal-400 bg-white/50 dark:bg-slate-900/50'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>3. Papel Timbrado, Logo & Layout</span>
          </button>
        </div>

        {/* Formulário de Edição */}
        <form onSubmit={handleSalvar} className="p-6 space-y-5 text-xs">
          {sucessoMsg && (
            <div className="p-3 bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 rounded-2xl flex items-center gap-2 font-bold animate-in fade-in">
              <Check className="w-4 h-4" /> Informações do médico salvas com sucesso no banco local!
            </div>
          )}

          {erroMsg && (
            <div className="p-3 bg-rose-500/15 border border-rose-500/40 text-rose-800 dark:text-rose-300 rounded-2xl flex items-center gap-2 font-bold animate-in fade-in">
              <X className="w-4 h-4" /> {erroMsg}
            </div>
          )}

          {abaAtiva === 'dados' && (
            /* ===================================================================
                ABA 1: DADOS PROFISSIONAIS & LOGIN (Sem duplicidade de logos)
               =================================================================== */
            <div className="space-y-5">
              {/* Dados Pessoais & CRM */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block">
                  Registro Profissional (CFM / CRM)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-slate-600 dark:text-slate-400 block mb-1">Nome Completo do Médico *</label>
                    <input
                      type="text"
                      required
                      value={formData.nome_completo}
                      onChange={(e) => handleChange('nome_completo', e.target.value)}
                      placeholder="Ex: Dr. Carlos Eduardo Medeiros"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-600 dark:text-slate-400 block mb-1">CRM *</label>
                      <input
                        type="text"
                        required
                        value={formData.crm}
                        onChange={(e) => handleChange('crm', e.target.value)}
                        placeholder="123456"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="text-slate-600 dark:text-slate-400 block mb-1">UF *</label>
                      <input
                        type="text"
                        required
                        maxLength={2}
                        value={formData.uf_crm}
                        onChange={(e) => handleChange('uf_crm', e.target.value.toUpperCase())}
                        placeholder="SP"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 font-mono text-center uppercase focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-slate-600 dark:text-slate-400 block mb-1">Especialidade Clínica</label>
                    <input
                      type="text"
                      value={formData.especialidade || ''}
                      onChange={(e) => handleChange('especialidade', e.target.value)}
                      placeholder="Ex: Clínica Médica / Cardiologia"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 dark:text-slate-400 block mb-1">RQE</label>
                    <input
                      type="text"
                      value={formData.rqe || ''}
                      onChange={(e) => handleChange('rqe', e.target.value)}
                      placeholder="Ex: 45892"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Dados do Consultório / Clínica */}
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block">
                  Consultório, Clínica ou Unidade de Saúde
                </span>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Nome do Estabelecimento / Clínica</label>
                  <input
                    type="text"
                    value={formData.nome_clinica || ''}
                    onChange={(e) => handleChange('nome_clinica', e.target.value)}
                    placeholder="Ex: Consultório de Clínica Médica & Cardiologia"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Endereço Completo (Obrigatório em Controle Especial)</label>
                  <input
                    type="text"
                    value={formData.endereco_consultorio || ''}
                    onChange={(e) => handleChange('endereco_consultorio', e.target.value)}
                    placeholder="Ex: Av. Paulista, 1578, Cj 1102 - Bela Vista, São Paulo - SP"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-600 dark:text-slate-400 block mb-1">Telefone / WhatsApp de Contato</label>
                    <input
                      type="text"
                      value={formData.telefone_consultorio || ''}
                      onChange={(e) => handleChange('telefone_consultorio', e.target.value)}
                      placeholder="Ex: (11) 3254-8900 / (11) 99876-5432"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 dark:text-slate-400 block mb-1">E-mail Profissional</label>
                    <input
                      type="email"
                      value={formData.email_contato || ''}
                      onChange={(e) => handleChange('email_contato', e.target.value)}
                      placeholder="Ex: contato@drpaulomedeiros.med.br"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Autenticação Local / PIN de Segurança */}
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5" /> Segurança & PIN de Acesso Local
                </span>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-bold block text-slate-800 dark:text-slate-200">Senha / PIN do Médico (Opcional)</span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Protege contra alterações acidentais de dados cadastrais ou troca de prescritor no computador do consultório.
                    </p>
                  </div>
                  <input
                    type="password"
                    maxLength={8}
                    value={formData.pin_acesso || ''}
                    onChange={(e) => handleChange('pin_acesso', e.target.value)}
                    placeholder="Ex: 1234"
                    className="w-32 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-center font-mono text-sm tracking-widest focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </div>
          )}

          {abaAtiva === 'assinatura' && (
            /* ===================================================================
                ABA 2: ASSINATURA ELETRÔNICA, RUBRICA & CHANCELA MP 2.200-2/01
               =================================================================== */
            <div className="space-y-6">
              <div className="p-4 bg-teal-500/10 border border-teal-500/30 rounded-2xl flex items-start gap-3">
                <div className="p-2 bg-teal-600 text-white rounded-xl flex-shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-black text-sm text-teal-950 dark:text-teal-200">
                    Assinatura Eletrônica & Rubrica do Prescritor
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Você pode fazer upload de uma imagem da sua rubrica escaneada ou desenhá-la diretamente aqui na tela com o mouse ou caneta touch. Ela será chancelada automaticamente nas receitas, pedidos de exames e laudos com rastreabilidade da <strong>Medida Provisória nº 2.200-2/2001</strong> e <strong>Lei Federal nº 14.063/2020</strong>.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200">
                      <input
                        type="checkbox"
                        checked={formData.usar_assinatura_eletronica !== false}
                        onChange={(e) => handleChange('usar_assinatura_eletronica', e.target.checked)}
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
                      />
                      <span>Habilitar chancela eletrônica nas prescrições e laudos</span>
                    </label>

                    {/* Alternador de método: Upload vs Desenho */}
                    <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-sm">
                      <button
                        type="button"
                        onClick={() => setModoAssinatura('upload')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                          modoAssinatura === 'upload'
                            ? 'bg-teal-600 text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        📁 Importar Imagem (PNG / JPG)
                      </button>
                      <button
                        type="button"
                        onClick={() => setModoAssinatura('desenho')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                          modoAssinatura === 'desenho'
                            ? 'bg-teal-600 text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        <PenTool className="w-3.5 h-3.5" />
                        <span>✏️ Desenhar Rubrica</span>
                      </button>
                    </div>
                  </div>

                  {/* Método 1: Upload de Imagem */}
                  {modoAssinatura === 'upload' ? (
                    <div>
                      {formData.assinatura_base64 ? (
                        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
                          <div className="flex items-center gap-4">
                            <div className="h-16 w-44 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800 flex items-center justify-center p-2">
                              <img src={formData.assinatura_base64} alt="Assinatura" className="max-h-full max-w-full object-contain" />
                            </div>
                            <div className="space-y-0.5">
                              <p className="font-bold text-slate-900 dark:text-slate-100 text-xs">Rubrica Digital Ativa ✓</p>
                              <p className="text-slate-500 text-[11px]">Sua assinatura será impressa perfeitamente na folha da receita</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer transition">
                              Trocar Imagem
                              <input type="file" accept="image/*" onChange={handleUploadAssinatura} className="hidden" />
                            </label>
                            <button
                              type="button"
                              onClick={() => handleChange('assinatura_base64', undefined)}
                              className="px-3 py-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl text-xs font-bold transition"
                            >
                              Remover
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-teal-500/60 hover:border-teal-600 rounded-2xl cursor-pointer text-slate-600 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 transition bg-white dark:bg-slate-900 p-4">
                          <Upload className="w-6 h-6 mb-1 text-teal-600" />
                          <span className="text-xs font-extrabold text-teal-800 dark:text-teal-300">Clique aqui para selecionar a imagem da sua assinatura</span>
                          <span className="text-[11px] text-slate-500 mt-0.5">Formatos suportados: PNG transparente, JPEG ou WebP</span>
                          <input type="file" accept="image/*" onChange={handleUploadAssinatura} className="hidden" />
                        </label>
                      )}
                    </div>
                  ) : (
                    /* Método 2: Canvas de Desenho da Rubrica */
                    <div className="space-y-2">
                      <div className="relative border-2 border-slate-300 dark:border-slate-700 rounded-2xl overflow-hidden bg-white shadow-inner">
                        <canvas
                          ref={canvasRef}
                          width={540}
                          height={140}
                          onMouseDown={iniciarDesenho}
                          onMouseMove={desenhar}
                          onMouseUp={pararDesenho}
                          onMouseLeave={pararDesenho}
                          onTouchStart={iniciarDesenho}
                          onTouchMove={desenhar}
                          onTouchEnd={pararDesenho}
                          className="w-full h-[140px] cursor-crosshair touch-none bg-white"
                        />
                        <div className="absolute top-2 right-2 flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={limparCanvasAssinatura}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
                          >
                            <Eraser className="w-3.5 h-3.5" /> Limpar
                          </button>
                          <button
                            type="button"
                            onClick={salvarCanvasAssinatura}
                            className="px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
                          >
                            <Check className="w-3.5 h-3.5" /> Gravar Rubrica
                          </button>
                        </div>
                        <div className="absolute bottom-2 left-3 text-[11px] text-slate-400 pointer-events-none select-none">
                          Desenhe aqui com o mouse ou caneta digital touch
                        </div>
                      </div>

                      {formData.assinatura_base64 && (
                        <div className="text-xs text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                          <Check className="w-4 h-4 text-emerald-600" /> Rubrica gravada com sucesso e pronta para compor suas receitas!
                        </div>
                      )}
                    </div>
                  )}

                  {/* Prévia Fidedigna da Chancela Digital na Receita */}
                  {formData.assinatura_base64 && formData.usar_assinatura_eletronica !== false && (
                    <div className="p-4 bg-teal-500/10 border border-teal-500/30 rounded-2xl space-y-2">
                      <div className="flex items-center gap-2 text-teal-900 dark:text-teal-200 font-bold text-xs">
                        <Shield className="w-4 h-4 text-teal-600" />
                        <span>Prévia Exata de Como Aparecerá na Folha Impressa / PDF:</span>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-teal-300 text-slate-800 text-xs space-y-2 shadow-sm max-w-md mx-auto">
                        <div className="flex items-center justify-between">
                          <div className="h-10 max-w-[140px] flex items-center">
                            <img src={formData.assinatura_base64} alt="Preview" className="max-h-full object-contain" />
                          </div>
                          <span className="font-mono text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            Cód: {formData.hash_assinatura_eletronica || 'OC-SIG-7A8B9C'}
                          </span>
                        </div>
                        <p className="font-bold border-t border-slate-200 pt-1.5 text-slate-900 text-xs">
                          {formData.nome_completo} &bull; CRM/{formData.uf_crm} {formData.crm}
                        </p>
                        <p className="text-[10px] text-slate-600 leading-tight">
                          Documento assinado eletronicamente pelo profissional conforme Medida Provisória nº 2.200-2/2001 e Lei Federal nº 14.063/2020.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {abaAtiva === 'receita' && (
            /* ===================================================================
                ABA 3: IDENTIDADE VISUAL, PAPEL TIMBRADO, LOGOTIPO & PDF
               =================================================================== */
            <div className="space-y-6">
              {/* 1. Formato e Dimensões do Papel */}
              <div>
                <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block mb-2">
                  Formato e Dimensões do Papel de Impressão
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleChange('tamanho_papel_receita', 'A4')}
                    className={`p-3.5 rounded-2xl border text-left transition ${
                      (formData.tamanho_papel_receita || 'A4') === 'A4'
                        ? 'border-teal-500 bg-teal-500/10 text-teal-900 dark:text-teal-200 ring-1 ring-teal-500/40'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between">
                      <span>Papel A4 (Padrão)</span>
                      <span className="font-mono text-[10px]">210 × 297 mm</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Padrão internacional para impressoras convencionais e exportação de PDF.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChange('tamanho_papel_receita', 'A5')}
                    className={`p-3.5 rounded-2xl border text-left transition ${
                      formData.tamanho_papel_receita === 'A5'
                        ? 'border-teal-500 bg-teal-500/10 text-teal-900 dark:text-teal-200 ring-1 ring-teal-500/40'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between">
                      <span>Papel A5 (Bloco / Meio-Ofício)</span>
                      <span className="font-mono text-[10px]">148 × 210 mm</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Ideal para blocos compactos de bolso e receituário ambulatorial.
                    </p>
                  </button>
                </div>
              </div>

              {/* 2. Estilo Visual da Receita */}
              <div>
                <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block mb-2">
                  Estilo e Apresentação Visual da Receita
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'moderno', label: 'Moderno Clínico', desc: 'Design esmeralda com linhas limpas' },
                    { id: 'classico', label: 'Clássico Consultório', desc: 'Borda nobre e tipografia serifada' },
                    { id: 'hospitalar', label: 'Hospitalar Oficial', desc: 'Tabela densa com leito e prontuário' },
                  ].map((est) => (
                    <button
                      key={est.id}
                      type="button"
                      onClick={() => handleChange('estilo_receita', est.id)}
                      className={`p-3 rounded-2xl border text-left transition ${
                        (formData.estilo_receita || 'moderno') === est.id
                          ? 'border-teal-500 bg-teal-500/10 text-teal-900 dark:text-teal-200 ring-1 ring-teal-500/40'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="font-bold text-xs">{est.label}</div>
                      <p className="text-[10px] text-slate-500 mt-0.5">{est.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Identidade Visual Customizada (Logotipo e Papel Timbrado do Médico) */}
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block">
                    Sua Identidade Visual Personalizada (Opcional)
                  </span>
                  <span className="text-[10px] text-slate-500">Substitui o padrão institucional</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Upload de Logo Próprio */}
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <FileImage className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Logotipo do Consultório
                      </span>
                      {formData.logo_base64 && (
                        <button
                          type="button"
                          onClick={() => handleChange('logo_base64', undefined)}
                          className="text-rose-500 hover:text-rose-400 text-[10px] font-bold"
                        >
                          Remover
                        </button>
                      )}
                    </div>
                    {formData.logo_base64 ? (
                      <div className="h-14 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center p-2 border border-slate-200 dark:border-slate-800">
                        <img src={formData.logo_base64} alt="Logo" className="max-h-full object-contain" />
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-14 border border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 rounded-xl cursor-pointer text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition">
                        <Upload className="w-4 h-4 mb-1" />
                        <span className="text-[10px]">Carregar Logo Próprio (PNG / JPG)</span>
                        <input type="file" accept="image/*" onChange={handleUploadLogo} className="hidden" />
                      </label>
                    )}
                  </div>

                  {/* Upload de Papel Timbrado Próprio */}
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Building className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Papel Timbrado (Fundo A4/A5)
                      </span>
                      {formData.papel_timbrado_base64 && (
                        <button
                          type="button"
                          onClick={() => handleChange('papel_timbrado_base64', undefined)}
                          className="text-rose-500 hover:text-rose-400 text-[10px] font-bold"
                        >
                          Remover
                        </button>
                      )}
                    </div>
                    {formData.papel_timbrado_base64 ? (
                      <div className="h-14 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center p-2 border border-slate-200 dark:border-slate-800">
                        <span className="text-[11px] text-teal-600 dark:text-teal-300 font-mono">Fundo Timbrado Carregado ✓</span>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-14 border border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 rounded-xl cursor-pointer text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition">
                        <Upload className="w-4 h-4 mb-1" />
                        <span className="text-[10px]">Carregar Arte Timbrada (PNG/JPG)</span>
                        <input type="file" accept="image/*" onChange={handleUploadPapelTimbrado} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>

                {/* Opções de Padrão do OpenClinical quando não houver logo ou timbrado do médico */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2.5">
                  <div className="flex items-center gap-2">
                    <OpenClinicalLogo variant="icon" size="sm" />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">Padrão Institucional OpenClinical</span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Se você não carregar uma logo ou papel timbrado próprio, o sistema utiliza o brasão e marca d'água oficial do OpenClinical para manter o receituário com apresentação profissional.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-200 dark:border-slate-800">
                    <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={formData.ocultar_logo_padrao || false}
                        onChange={(e) => handleChange('ocultar_logo_padrao', e.target.checked)}
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span>Ocultar logotipo OpenClinical por padrão</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={formData.ocultar_papel_timbrado_padrao || false}
                        onChange={(e) => handleChange('ocultar_papel_timbrado_padrao', e.target.checked)}
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span>Ocultar papel timbrado / marca d'água OpenClinical</span>
                    </label>
                  </div>

                  {/* Checkbox de Papel Pré-impresso Físico */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                    <label className="flex items-start gap-2 cursor-pointer text-[11px] text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={formData.usar_papel_timbrado_proprio || false}
                        onChange={(e) => handleChange('usar_papel_timbrado_proprio', e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span>
                        <strong>Modo Papel Timbrado Físico de Gráfica:</strong> Oculta todo cabeçalho e rodapé automáticos da página impressa para casar com a folha já timbrada da clínica.
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* 4. Opções de Impressão e Rodapé */}
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block">
                  Elementos e Rodapé da Receita
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label className="p-3 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.mostrar_qr_code !== false}
                      onChange={(e) => handleChange('mostrar_qr_code', e.target.checked)}
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                      Exibir QR Code de validação
                    </span>
                  </label>

                  <label className="p-3 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.mostrar_linha_assinatura !== false}
                      onChange={(e) => handleChange('mostrar_linha_assinatura', e.target.checked)}
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                      Exibir linha de assinatura e carimbo
                    </span>
                  </label>
                </div>

                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">
                    Instruções ou Mensagem Fixa de Rodapé
                  </label>
                  <textarea
                    rows={2}
                    value={formData.texto_rodape_customizado || ''}
                    onChange={(e) => handleChange('texto_rodape_customizado', e.target.value)}
                    placeholder="Ex: Em caso de persistência dos sintomas ou efeitos adversos, procure o pronto atendimento mais próximo."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Rodapé com botões de ação */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold transition shadow-lg shadow-teal-950/30 flex items-center gap-2"
            >
              <Check className="w-4 h-4" /> Salvar Perfil do Médico
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
