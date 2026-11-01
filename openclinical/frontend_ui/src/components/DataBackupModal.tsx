import React, { useState, useRef } from 'react';
import {
  X,
  Download,
  Upload,
  Database,
  FileSpreadsheet,
  BookOpen,
  FileText,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Archive,
} from 'lucide-react';
import {
  exportarProtocolosJson,
  importarProtocolosJson,
  exportarReceitasJson,
  importarReceitasJson,
  exportarProntuariosJson,
  importarProntuariosJson,
  exportarBackupCompletoJson,
  importarBackupCompletoJson,
  listarProtocolosPersonalizados,
  listarPacientes,
  listarReceitasSalvas,
} from '../storage_clinico';

interface DataBackupModalProps {
  aberto: boolean;
  onFechar: () => void;
}

export const DataBackupModal: React.FC<DataBackupModalProps> = ({ aberto, onFechar }) => {
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tipoImportacaoAtivo, setTipoImportacaoAtivo] = useState<
    'protocolos' | 'receitas' | 'prontuarios' | 'completo'
  >('completo');

  if (!aberto) return null;

  const totalProtocolos = listarProtocolosPersonalizados().length;
  const totalPacientes = listarPacientes().length;
  const totalReceitas = listarReceitasSalvas().length;

  const downloadArquivo = (conteudo: string, nomeArquivo: string) => {
    const blob = new Blob([conteudo], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nomeArquivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const dispararImportacao = (tipo: 'protocolos' | 'receitas' | 'prontuarios' | 'completo') => {
    setTipoImportacaoAtivo(tipo);
    setMensagemSucesso(null);
    setMensagemErro(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleArquivoSelecionado = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const conteudo = event.target?.result as string;
      try {
        if (tipoImportacaoAtivo === 'protocolos') {
          const res = importarProtocolosJson(conteudo);
          setMensagemSucesso(`Importação concluída! ${res.adicionados} novo(s) protocolo(s) adicionados.`);
        } else if (tipoImportacaoAtivo === 'receitas') {
          const res = importarReceitasJson(conteudo);
          setMensagemSucesso(`Importação concluída! ${res.adicionadas} receita(s) adicionada(s) ao histórico.`);
        } else if (tipoImportacaoAtivo === 'prontuarios') {
          const res = importarProntuariosJson(conteudo);
          setMensagemSucesso(`Importação concluída! ${res.pacientes} paciente(s) e ${res.evolucoes} evolução(ões) importados.`);
        } else {
          const res = importarBackupCompletoJson(conteudo);
          setMensagemSucesso(res.mensagem);
        }
      } catch (err: any) {
        setMensagemErro(err.message || 'Erro ao importar arquivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onFechar();
      }}
    >
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-fade-in text-slate-800 dark:text-slate-100 flex flex-col max-h-[90vh]">
        {/* Input invisível para upload de arquivo */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleArquivoSelecionado}
          className="hidden"
        />

        {/* Cabeçalho */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-teal-500/15 text-teal-600 dark:text-teal-400 rounded-xl">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Central de Dados, Backups & Portabilidade
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Exporte ou importe protocolos, receitas e prontuários em formato aberto (JSON).
              </p>
            </div>
          </div>
          <button
            onClick={onFechar}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mensagens de Feedback */}
        {mensagemSucesso && (
          <div className="m-4 mb-0 p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700/60 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{mensagemSucesso}</span>
          </div>
        )}

        {mensagemErro && (
          <div className="m-4 mb-0 p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-700/60 rounded-xl text-xs text-rose-800 dark:text-rose-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{mensagemErro}</span>
          </div>
        )}

        {/* Corpo de Gerenciamento */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs">
          {/* Card 1: Protocolos Personalizados */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  Protocolos Personalizados
                  <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.2 rounded font-mono">
                    {totalProtocolos}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Diretrizes clínicas e condutas criadas por você.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => downloadArquivo(exportarProtocolosJson(), `protocolos_openclinical_${Date.now()}.json`)}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 rounded-lg font-semibold transition"
                title="Exportar protocolos para arquivo JSON"
              >
                <Download className="w-3.5 h-3.5" /> Exportar
              </button>
              <button
                type="button"
                onClick={() => dispararImportacao('protocolos')}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-semibold transition"
                title="Importar protocolos de um arquivo JSON"
              >
                <Upload className="w-3.5 h-3.5" /> Importar
              </button>
            </div>
          </div>

          {/* Card 2: Prontuários & Pacientes */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  Prontuários & Pacientes
                  <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.2 rounded font-mono">
                    {totalPacientes}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Fichas cadastrais, alergias, comorbidades e evoluções SOAP.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => downloadArquivo(exportarProntuariosJson(), `prontuarios_openclinical_${Date.now()}.json`)}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 rounded-lg font-semibold transition"
              >
                <Download className="w-3.5 h-3.5" /> Exportar
              </button>
              <button
                type="button"
                onClick={() => dispararImportacao('prontuarios')}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-semibold transition"
              >
                <Upload className="w-3.5 h-3.5" /> Importar
              </button>
            </div>
          </div>

          {/* Card 3: Receitas Emitidas */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-lg">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  Histórico de Receitas
                  <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.2 rounded font-mono">
                    {totalReceitas}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Histórico de prescrições e fórmulas salvas.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => downloadArquivo(exportarReceitasJson(), `receitas_openclinical_${Date.now()}.json`)}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 rounded-lg font-semibold transition"
              >
                <Download className="w-3.5 h-3.5" /> Exportar
              </button>
              <button
                type="button"
                onClick={() => dispararImportacao('receitas')}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-semibold transition"
              >
                <Upload className="w-3.5 h-3.5" /> Importar
              </button>
            </div>
          </div>

          {/* Card 4: Backup Completo da Plataforma */}
          <div className="p-4 bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/50 rounded-xl space-y-2">
            <div className="flex items-center gap-2 font-bold text-teal-900 dark:text-teal-300 text-xs">
              <Archive className="w-4 h-4 text-teal-600" />
              Backup Completo & Migração de Consultório
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Gera um único arquivo contendo médicos cadastrados, pacientes, prontuários, receitas, protocolos próprios e configurações de impressão para migrar de computador ou restaurar o sistema.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => downloadArquivo(exportarBackupCompletoJson(), `backup_completo_openclinical_${Date.now()}.json`)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-600 text-white rounded-lg font-bold transition shadow-sm"
              >
                <Download className="w-3.5 h-3.5" /> Baixar Backup Completo
              </button>
              <button
                type="button"
                onClick={() => dispararImportacao('completo')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-teal-300 dark:border-teal-700 text-teal-800 dark:text-teal-300 rounded-lg font-bold hover:bg-teal-50 dark:hover:bg-slate-750 transition"
              >
                <Upload className="w-3.5 h-3.5" /> Restaurar Backup Completo
              </button>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onFechar}
            className="px-4 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
