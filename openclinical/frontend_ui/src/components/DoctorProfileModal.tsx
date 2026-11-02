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
}

export const DoctorProfileModal: React.FC<DoctorProfileModalProps> = ({
  perfil,
  isOpen,
  onClose,
  onPerfilSalvo,
}) => {
  const [formData, setFormData] = useState<PerfilMedico>({ ...perfil });
  const [todosMedicos, setTodosMedicos] = useState<PerfilMedico[]>([]);
  const [sucessoMsg, setSucessoMsg] = useState(false);
  const [erroMsg, setErroMsg] = useState<string | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<'dados' | 'receita'>('dados');

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

        {/* Abas: Dados Profissionais vs Configurações da Receita & PDF */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-50 dark:bg-slate-950/40">
          <button
            type="button"
            onClick={() => setAbaAtiva('dados')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
              abaAtiva === 'dados'
                ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Dados Profissionais & Login</span>
          </button>
          <button
            type="button"
            onClick={() => setAbaAtiva('receita')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
              abaAtiva === 'receita'
                ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Identidade Visual, Assinatura Eletrônica & PDF</span>
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

          {abaAtiva === 'dados' ? (
            /* ===================================================================
                ABA 1: DADOS PROFISSIONAIS & LOGIN (Sem duplicidade de logos)
               =================================================================== */
            <>
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
            </>
          ) : (
            /* ===================================================================
                ABA 2: IDENTIDADE VISUAL, PAPEL TIMBRADO, ASSINATURA ELETRÔNICA & PDF
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

              {/* 4. Assinatura Eletrônica & Certificação Digital do Médico */}
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-teal-500" /> Assinatura Eletrônica & Chancela Digital do Médico
                  </span>
                  <span className="text-[10px] text-teal-600 dark:text-teal-300 font-mono font-semibold">
                    MP 2.200-2/01 & Lei 14.063/20
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200">
                      <input
                        type="checkbox"
                        checked={formData.usar_assinatura_eletronica !== false}
                        onChange={(e) => handleChange('usar_assinatura_eletronica', e.target.checked)}
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span>Assinar digitalmente as receitas emitidas</span>
                    </label>

                    {/* Alternador de método: Upload vs Desenho */}
                    <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-0.5">
                      <button
                        type="button"
                        onClick={() => setModoAssinatura('upload')}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition ${
                          modoAssinatura === 'upload'
                            ? 'bg-teal-500/15 text-teal-700 dark:text-teal-300'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        Upload Imagem
                      </button>
                      <button
                        type="button"
                        onClick={() => setModoAssinatura('desenho')}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition flex items-center gap-1 ${
                          modoAssinatura === 'desenho'
                            ? 'bg-teal-500/15 text-teal-700 dark:text-teal-300'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        <PenTool className="w-3 h-3" /> Desenhar Rubrica
                      </button>
                    </div>
                  </div>

                  {/* Área de Entrada da Assinatura */}
                  {modoAssinatura === 'upload' ? (
                    <div>
                      {formData.assinatura_base64 ? (
                        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-32 bg-slate-50 dark:bg-slate-950 rounded border border-slate-100 dark:border-slate-800 flex items-center justify-center p-1">
                              <img src={formData.assinatura_base64} alt="Assinatura" className="max-h-full max-w-full object-contain" />
                            </div>
                            <div className="text-[11px]">
                              <p className="font-bold text-slate-800 dark:text-slate-200">Rubrica Digital Carregada</p>
                              <p className="text-slate-500 text-[10px]">Pronta para ser chancelada nas receitas</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleChange('assinatura_base64', undefined)}
                            className="px-2.5 py-1 text-rose-500 hover:text-rose-400 text-xs font-bold"
                          >
                            Remover
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 rounded-2xl cursor-pointer text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition bg-white dark:bg-slate-900">
                          <Upload className="w-5 h-5 mb-1" />
                          <span className="text-xs font-bold">Importar imagem de assinatura (PNG transparente / JPG)</span>
                          <span className="text-[10px] text-slate-400">Escaneamento de rubrica ou assinatura eletrônica</span>
                          <input type="file" accept="image/*" onChange={handleUploadAssinatura} className="hidden" />
                        </label>
                      )}
                    </div>
                  ) : (
                    /* Área do Canvas de Desenho */
                    <div className="space-y-2">
                      <div className="relative border border-slate-300 dark:border-slate-700 rounded-2xl overflow-hidden bg-white">
                        <canvas
                          ref={canvasRef}
                          width={480}
                          height={120}
                          onMouseDown={iniciarDesenho}
                          onMouseMove={desenhar}
                          onMouseUp={pararDesenho}
                          onMouseLeave={pararDesenho}
                          onTouchStart={iniciarDesenho}
                          onTouchMove={desenhar}
                          onTouchEnd={pararDesenho}
                          className="w-full h-[120px] cursor-crosshair touch-none"
                        />
                        <div className="absolute top-2 right-2 flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={limparCanvasAssinatura}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-bold flex items-center gap-1"
                          >
                            <Eraser className="w-3 h-3" /> Limpar
                          </button>
                          <button
                            type="button"
                            onClick={salvarCanvasAssinatura}
                            className="px-2.5 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded text-[10px] font-bold flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" /> Salvar Rubrica
                          </button>
                        </div>
                        <div className="absolute bottom-1 left-3 text-[10px] text-slate-400 pointer-events-none">
                          Desenhe sua rubrica com mouse ou caneta digital
                        </div>
                      </div>

                      {formData.assinatura_base64 && (
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Rubrica gravada e pronta para compor a receita digital!
                        </div>
                      )}
                    </div>
                  )}

                  {/* Preview da Chancela Eletrônica na Receita */}
                  {formData.assinatura_base64 && formData.usar_assinatura_eletronica !== false && (
                    <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-xl space-y-1.5">
                      <div className="flex items-center gap-1.5 text-teal-800 dark:text-teal-300 font-bold text-[11px]">
                        <Shield className="w-3.5 h-3.5" /> Prévia da Chancela que aparecerá na Receita:
                      </div>
                      <div className="bg-white p-2.5 rounded border border-teal-200 text-slate-800 text-[10px] space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="h-8 max-w-[120px] flex items-center">
                            <img src={formData.assinatura_base64} alt="Preview" className="max-h-full object-contain" />
                          </div>
                          <span className="font-mono text-[9px] text-slate-500">
                            Cód. Validação: {formData.hash_assinatura_eletronica || 'OC-SIG-7A8B9C'}
                          </span>
                        </div>
                        <p className="font-bold border-t border-slate-200 pt-1">
                          {formData.nome_completo} &bull; CRM/{formData.uf_crm} {formData.crm}
                        </p>
                        <p className="text-[9px] text-slate-500">
                          Documento assinado eletronicamente pelo profissional conforme Medida Provisória nº 2.200-2/2001 e Lei Federal nº 14.063/2020.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 5. Opções de Impressão e Rodapé */}
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
