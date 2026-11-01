import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Building,
  MapPin,
  Phone,
  Mail,
  Award,
  Upload,
  X,
  Check,
  Lock,
  FileImage,
  Users,
  UserPlus,
  Shield,
  Key,
} from 'lucide-react';
import { PerfilMedico } from '../types';
import {
  salvarPerfilMedicoAtivo,
  listarPerfisMedicos,
  trocarPerfilMedico,
} from '../storage_clinico';

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
                Identificação e Login do Médico Prescritor
                <span className="text-[10px] bg-teal-500/20 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded font-mono font-semibold">
                  Local &bull; Seguro
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Altere seus dados profissionais, gerencie múltiplos prescritores ou defina seu PIN local.
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
                  Protege contra alterações acidentais de carimbo ou prescrições não autorizadas neste computador.
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

          {/* Timbre, Logo e Papel Timbrado Físico */}
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block">
              Personalização Visual & Papel Timbrado
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Upload de Logo */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <FileImage className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Logotipo da Clínica
                  </span>
                  {formData.logo_base64 && (
                    <button
                      type="button"
                      onClick={() => handleChange('logo_base64', undefined)}
                      className="text-rose-500 hover:text-rose-400 text-[10px]"
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
                    <span className="text-[10px]">Carregar imagem (PNG / JPG)</span>
                    <input type="file" accept="image/*" onChange={handleUploadLogo} className="hidden" />
                  </label>
                )}
              </div>

              {/* Upload de Papel Timbrado (Fundo) */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Papel Timbrado (Fundo)
                  </span>
                  {formData.papel_timbrado_base64 && (
                    <button
                      type="button"
                      onClick={() => handleChange('papel_timbrado_base64', undefined)}
                      className="text-rose-500 hover:text-rose-400 text-[10px]"
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
                    <span className="text-[10px]">Carregar arte timbrada A4</span>
                    <input type="file" accept="image/*" onChange={handleUploadPapelTimbrado} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            {/* Checkbox: Impressão em Papel Timbrado Físico */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl flex items-start gap-2.5">
              <input
                type="checkbox"
                id="checkTimbradoFisico"
                checked={formData.usar_papel_timbrado_proprio || false}
                onChange={(e) => handleChange('usar_papel_timbrado_proprio', e.target.checked)}
                className="mt-0.5 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-teal-600 focus:ring-teal-500"
              />
              <label htmlFor="checkTimbradoFisico" className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed cursor-pointer">
                <strong>Modo Papel Timbrado Físico:</strong> Oculta o cabeçalho e rodapé automáticos da página impressa para casar com a folha já timbrada da clínica.
              </label>
            </div>
          </div>

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
