import React, { useState } from 'react';
import { X, Save, BookOpen, Plus, Tag, FileText, Check } from 'lucide-react';
import { ProtocoloClinico } from '../types';
import { salvarProtocoloPersonalizado } from '../storage_clinico';

interface CustomProtocolModalProps {
  aberto: boolean;
  onFechar: () => void;
  protocoloEditando?: ProtocoloClinico | null;
  onSalvo?: (protocolo: ProtocoloClinico) => void;
}

export const CustomProtocolModal: React.FC<CustomProtocolModalProps> = ({
  aberto,
  onFechar,
  protocoloEditando,
  onSalvo,
}) => {
  const [titulo, setTitulo] = useState(protocoloEditando?.titulo || '');
  const [categoria, setCategoria] = useState(protocoloEditando?.categoria || 'Clinica_Geral');
  const [cidsTexto, setCidsTexto] = useState(protocoloEditando?.cids_relacionados.join(', ') || '');
  const [ciapsTexto, setCiapsTexto] = useState(protocoloEditando?.ciaps_relacionados.join(', ') || '');
  const [conteudoMarkdown, setConteudoMarkdown] = useState(
    protocoloEditando?.conteudo_markdown ||
      '## 1. Critérios Clínicos & Sintomas Cardinais\n- Sintoma 1\n- Sintoma 2\n\n## 2. Propedêutica & Exames Recomendados\n- Exame laboratorial\n- Exame de imagem\n\n## 3. Sinais de Alarme\n- Sinal de gravidade 1\n\n## 4. Conduta Terapêutica & Posologia\n- Medicamento A: posologia...'
  );
  const [blocoPrescricao, setBlocoPrescricao] = useState(
    protocoloEditando?.bloco_prescricao_copiavel ||
      '1) Medicamento Principal 500mg -------- 1 cx\n   Tomar 1 comprimido VO a cada 8 horas por 5 dias.\n\n2) Orientações Gerais:\n   • Manter hidratação e repouso.'
  );

  if (!aberto) return null;

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    const cids = cidsTexto
      .split(',')
      .map((c) => c.trim().toUpperCase())
      .filter(Boolean);
    const ciaps = ciapsTexto
      .split(',')
      .map((c) => c.trim().toUpperCase())
      .filter(Boolean);

    const novoProtocolo: ProtocoloClinico = {
      id_protocolo: protocoloEditando?.id_protocolo || `custom_proto_${Date.now()}`,
      titulo: titulo.trim(),
      categoria: categoria.trim(),
      cids_relacionados: cids.length > 0 ? cids : ['R69'],
      ciaps_relacionados: ciaps.length > 0 ? ciaps : ['A99'],
      nivel_atencao: 'Atenção Primária e Urgência',
      data_revisao: new Date().toLocaleDateString('pt-BR'),
      status_revisao_clinica: 'Protocolo Próprio do Médico',
      conteudo_markdown: conteudoMarkdown.trim(),
      bloco_prescricao_copiavel: blocoPrescricao.trim(),
      jurisdicao: 'BR_SUS',
      agencia: 'Protocolo Personalizado',
      pais: 'Brasil',
    };

    salvarProtocoloPersonalizado(novoProtocolo);
    if (onSalvo) onSalvo(novoProtocolo);
    onFechar();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onFechar();
      }}
    >
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-fade-in my-8 text-slate-800 dark:text-slate-100 flex flex-col max-h-[90vh]">
        {/* Cabeçalho */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-teal-500/15 text-teal-600 dark:text-teal-400 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {protocoloEditando ? 'Editar Protocolo Personalizado' : 'Novo Protocolo Clínico do Médico'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Ficará salvo localmente e disponível na busca, condutas e prescrição digital.
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

        {/* Formulário */}
        <form onSubmit={handleSalvar} className="p-5 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
              Título do Protocolo / Doença *
            </label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Manejo da Crise Enxaquecosa Ambulatorial"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                Especialidade / Categoria
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
              >
                <option value="Clinica_Geral">Clínica Geral</option>
                <option value="Cardiologia">Cardiologia</option>
                <option value="Pneumologia">Pneumologia</option>
                <option value="Infectologia">Infectologia</option>
                <option value="Gastroenterologia">Gastroenterologia</option>
                <option value="Nefrologia">Nefrologia</option>
                <option value="Neurologia">Neurologia</option>
                <option value="Endocrinologia">Endocrinologia</option>
                <option value="Pediatria">Pediatria</option>
                <option value="Ginecologia">Ginecologia & Obstetrícia</option>
                <option value="Dermatologia">Dermatologia</option>
                <option value="Urgencia">Urgência & Emergência</option>
              </select>
            </div>

            <div>
              <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                CIDs Relacionados (vírgula)
              </label>
              <input
                type="text"
                value={cidsTexto}
                onChange={(e) => setCidsTexto(e.target.value)}
                placeholder="Ex: G43, G44.2"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                CIAP-2 (Atenção Básica)
              </label>
              <input
                type="text"
                value={ciapsTexto}
                onChange={(e) => setCiapsTexto(e.target.value)}
                placeholder="Ex: N89, N90"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
              Diretriz Clínica, Critérios Diagnósticos & Sinais de Alarme (Markdown)
            </label>
            <textarea
              rows={5}
              value={conteudoMarkdown}
              onChange={(e) => setConteudoMarkdown(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
              Receituário Estruturado & Conduta Copiável
            </label>
            <textarea
              rows={4}
              value={blocoPrescricao}
              onChange={(e) => setBlocoPrescricao(e.target.value)}
              placeholder="Itens da receita com posologia e orientações..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onFechar}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow transition"
            >
              <Save className="w-3.5 h-3.5" />
              Salvar Protocolo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
