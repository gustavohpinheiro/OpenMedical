import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Printer,
  FileUp,
  Download,
  ShoppingBag,
  ShieldAlert,
  Flame,
  Dna,
  Heart,
  Layers,
  Sparkles,
  Edit2,
  Check,
  ChevronDown,
  Upload,
  Image as ImageIcon,
  Copy,
  Sliders,
  AlertTriangle,
  MoveUp,
  MoveDown,
  Eye,
  FileCheck,
  Building,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import {
  BlocoPrescricao,
  ItemPrescricaoCesta,
  PerfilMedico,
  Paciente,
  TemplateReceituario,
} from '../types';
import {
  obterPerfilMedicoAtivo,
  obterPacienteAtivo,
  obterBlocosPrescricao,
  salvarBlocosPrescricao,
  obterTemplatesReceituario,
  obterTemplateAtivoId,
  definirTemplateAtivoId,
  salvarNovoTemplateReceituario,
  limparPrescricao,
  abrirConfiguracaoAssinatura,
  abrirConfiguracaoReceita,
} from '../storage_clinico';
import { cotarPrecosFarmacias } from '../pharmacy_pricing';
import { avaliarSegurancaMedicamentosa5g } from '../medication_safety_5g';
import { exportarElementosParaPdf } from '../pdf_generator';
import { importarReceitasDePdfs } from '../prescription_importer';
import { PrescriptionSheetRenderer } from './PrescriptionSheetRenderer';
import { MedicationAutocomplete } from './MedicationAutocomplete';

export const PrescriptionModularCanvas: React.FC = () => {
  const [perfilMedico, setPerfilMedico] = useState<PerfilMedico>(obterPerfilMedicoAtivo());
  const [pacienteAtivo, setPacienteAtivo] = useState<Paciente | null>(obterPacienteAtivo());
  const [blocos, setBlocos] = useState<BlocoPrescricao[]>(obterBlocosPrescricao());
  const [templates, setTemplates] = useState<TemplateReceituario[]>(obterTemplatesReceituario());
  const [templateAtivoId, setTemplateAtivoId] = useState<string>(obterTemplateAtivoId());

  // Form de adição rápida de peça modular
  const [abaNovoItem, setAbaNovoItem] = useState<'medicamento' | 'orientacao' | 'exame'>('medicamento');
  const [formMedNome, setFormMedNome] = useState('');
  const [formMedPrincipio, setFormMedPrincipio] = useState('');
  const [formMedApres, setFormMedApres] = useState('');
  const [formMedPosologia, setFormMedPosologia] = useState('');
  const [formMedQtd, setFormMedQtd] = useState(1);
  const [formMedTipo, setFormMedTipo] = useState<ItemPrescricaoCesta['tipo_receituario']>('simples');
  const [formMedPmc, setFormMedPmc] = useState<number>(25.0);

  // Form de orientação / conselho
  const [formOrientTitulo, setFormOrientTitulo] = useState('Orientações e Sinais de Alarme');
  const [formOrientTexto, setFormOrientTexto] = useState('');

  // Form de exame
  const [formExameTitulo, setFormExameTitulo] = useState('Solicitação de Exames Complementares');
  const [formExameTexto, setFormExameTexto] = useState('');

  // Estado de geração de PDF
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const [importandoPdf, setImportandoPdf] = useState(false);
  const fileInputCanvasRef = useRef<HTMLInputElement>(null);
  const [msgImportacaoCanvas, setMsgImportacaoCanvas] = useState<{ texto: string; tipo: 'sucesso' | 'erro' | 'alerta'; detalhes?: string[] } | null>(null);

  const handleImportarPdfsCanvas = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      setImportandoPdf(true);
      setMsgImportacaoCanvas(null);
      const resultados = await importarReceitasDePdfs(Array.from(files), pacienteAtivo);
      let novosBlocos: BlocoPrescricao[] = [...blocos];
      let totalItensAdicionados = 0;
      const todosAlertasAlergia: string[] = [];
      const todosAlertasInteracoes: string[] = [];

      for (const res of resultados) {
        if (res.sucesso && res.blocos.length > 0) {
          totalItensAdicionados += res.blocos.length;
          novosBlocos = [...novosBlocos, ...res.blocos];
          todosAlertasAlergia.push(...res.alertas_alergia);
          todosAlertasInteracoes.push(...res.alertas_interacoes);
        }
      }

      if (totalItensAdicionados > 0) {
        salvarBlocosPrescricao(novosBlocos);
        setBlocos(novosBlocos);
        const alertasTotal = [...todosAlertasAlergia, ...todosAlertasInteracoes];
        if (alertasTotal.length > 0) {
          setMsgImportacaoCanvas({
            texto: `${totalItensAdicionados} item(ns) importado(s) de ${files.length} PDF(s), mas foram detectados alertas críticos de segurança!`,
            tipo: 'alerta',
            detalhes: alertasTotal,
          });
        } else {
          setMsgImportacaoCanvas({
            texto: `${totalItensAdicionados} item(ns) importado(s) com sucesso de ${files.length} receita(s) em PDF!`,
            tipo: 'sucesso',
          });
        }
        setTimeout(() => setMsgImportacaoCanvas(null), 8000);
      } else {
        setMsgImportacaoCanvas({
          texto: 'Não foi possível extrair medicamentos válidos dos arquivos PDF enviados.',
          tipo: 'erro',
        });
      }
    } catch (err: any) {
      setMsgImportacaoCanvas({
        texto: err.message || 'Erro ao processar importação de PDF.',
        tipo: 'erro',
      });
    } finally {
      setImportandoPdf(false);
      if (fileInputCanvasRef.current) fileInputCanvasRef.current.value = '';
    }
  };
  const printPagesRef = useRef<HTMLDivElement>(null);

  // Carregar dados e sincronizar com eventos
  useEffect(() => {
    const handlePrescricaoAtualizada = (e: any) => setBlocos(e.detail);
    const handleMedicoAlterado = (e: any) => setPerfilMedico(e.detail);
    const handlePacienteAlterado = (e: any) => setPacienteAtivo(e.detail);
    const handleTemplateAlterado = (e: any) => setTemplateAtivoId(e.detail);

    window.addEventListener('openclinical_prescricao_atualizada', handlePrescricaoAtualizada);
    window.addEventListener('openclinical_medico_alterado', handleMedicoAlterado);
    window.addEventListener('openclinical_paciente_alterado', handlePacienteAlterado);
    window.addEventListener('openclinical_template_alterado', handleTemplateAlterado);

    return () => {
      window.removeEventListener('openclinical_prescricao_atualizada', handlePrescricaoAtualizada);
      window.removeEventListener('openclinical_medico_alterado', handleMedicoAlterado);
      window.removeEventListener('openclinical_paciente_alterado', handlePacienteAlterado);
      window.removeEventListener('openclinical_template_alterado', handleTemplateAlterado);
    };
  }, []);

  const templateAtual = useMemo(() => {
    return templates.find((t) => t.id === templateAtivoId) || templates[0];
  }, [templates, templateAtivoId]);

  // Manipulação de Blocos
  const removerBloco = (id: string) => {
    const novos = blocos.filter((b) => b.id !== id);
    setBlocos(novos);
    salvarBlocosPrescricao(novos);
  };

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

  const alternarAtivo = (id: string) => {
    const novos = blocos.map((b) => (b.id === id ? { ...b, ativo: !b.ativo } : b));
    setBlocos(novos);
    salvarBlocosPrescricao(novos);
  };

  // Adicionar Medicamento
  const adicionarMedicamento = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMedNome.trim() || !formMedPosologia.trim()) return;

    const med: ItemPrescricaoCesta = {
      id: `med_${Date.now()}`,
      nome_medicamento: formMedNome.trim(),
      principio_ativo: (formMedPrincipio || formMedNome).trim().toUpperCase(),
      apresentacao: formMedApres.trim() || 'Comprimido / Uso Oral',
      posologia: formMedPosologia.trim(),
      quantidade_embalagens: formMedQtd,
      tipo_receituario: formMedTipo,
      preco_pmc: formMedPmc,
    };

    const novoBloco: BlocoPrescricao = {
      id: `bloco_${Date.now()}`,
      tipo: 'medicamento',
      titulo: med.nome_medicamento,
      conteudo: med.posologia,
      medicamento_detalhe: med,
      origem_fonte: 'Prescrição Clínica Manual',
      tags: [med.tipo_receituario === 'simples' ? 'Receita Simples' : 'Controle Especial'],
      ordem: blocos.length + 1,
      ativo: true,
    };

    const novos = [...blocos, novoBloco];
    setBlocos(novos);
    salvarBlocosPrescricao(novos);

    setFormMedNome('');
    setFormMedPrincipio('');
    setFormMedApres('');
    setFormMedPosologia('');
    setFormMedQtd(1);
  };

  // Adicionar Orientação
  const adicionarOrientacao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formOrientTexto.trim()) return;

    const novoBloco: BlocoPrescricao = {
      id: `bloco_${Date.now()}`,
      tipo: 'orientacao',
      titulo: formOrientTitulo.trim() || 'Orientações ao Paciente',
      conteudo: formOrientTexto.trim(),
      origem_fonte: 'Recomendações Clínicas',
      tags: ['Orientações', 'Estilo de Vida'],
      ordem: blocos.length + 1,
      ativo: true,
    };

    const novos = [...blocos, novoBloco];
    setBlocos(novos);
    salvarBlocosPrescricao(novos);
    setFormOrientTexto('');
  };

  // Adicionar Exame
  const adicionarExame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formExameTexto.trim()) return;

    const novoBloco: BlocoPrescricao = {
      id: `bloco_${Date.now()}`,
      tipo: 'exame',
      titulo: formExameTitulo.trim() || 'Solicitação de Exames Complementares',
      conteudo: formExameTexto.trim(),
      origem_fonte: 'Propedêutica Complementar',
      tags: ['Exames'],
      ordem: blocos.length + 1,
      ativo: true,
    };

    const novos = [...blocos, novoBloco];
    setBlocos(novos);
    salvarBlocosPrescricao(novos);
    setFormExameTexto('');
  };

  // Upload de Template / Papel Timbrado
  const handleUploadTemplateImagem = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const novoTemplate: TemplateReceituario = {
          id: `tpl_custom_${Date.now()}`,
          nome: `Modelo Personalizado (${file.name.substring(0, 15)})`,
          descricao: 'Template com imagem de fundo timbrada enviada pelo médico.',
          estilo: 'customizado',
          imagem_fundo_base64: reader.result as string,
          cor_primaria: '#0f766e',
          cor_secundaria: '#334155',
          fonte_familia: 'sans',
          mostrar_linha_assinatura: true,
          mostrar_qr_code: false,
          margem_superior_mm: 30,
          margem_inferior_mm: 20,
        };
        salvarNovoTemplateReceituario(novoTemplate);
        setTemplates(obterTemplatesReceituario());
        setTemplateAtivoId(novoTemplate.id);
      };
      reader.readAsDataURL(file);
    }
  };

  // ===========================================================================
  // REGRAS REGULATÓRIAS DO BRASIL: DIVISÃO AUTOMÁTICA DE FOLHAS E RECEITAS
  // ===========================================================================
  const itensAtivos = blocos.filter((b) => b.ativo);

  // 1. Medicamentos Simples (máximo de 4 por folha para legibilidade garantida)
  const medicamentosSimples = itensAtivos.filter(
    (b) => b.tipo === 'medicamento' && b.medicamento_detalhe?.tipo_receituario === 'simples'
  );

  const paginasReceitaSimples = useMemo(() => {
    const paginas: BlocoPrescricao[][] = [];
    const itensPorPagina = 4;
    for (let i = 0; i < medicamentosSimples.length; i += itensPorPagina) {
      paginas.push(medicamentosSimples.slice(i, i + itensPorPagina));
    }
    return paginas;
  }, [medicamentosSimples]);

  // 2. Medicamentos de Controle Especial (Portaria 344/98 e RDC 471)
  // Limite estrito de no máximo 3 substâncias por receita de controle especial
  const medicamentosControle = itensAtivos.filter(
    (b) =>
      b.tipo === 'medicamento' &&
      b.medicamento_detalhe &&
      b.medicamento_detalhe.tipo_receituario !== 'simples'
  );

  const receitasControleEspecial = useMemo(() => {
    const receitas: BlocoPrescricao[][] = [];
    const limitePorReceita = 3; // Portaria 344/98 art. 57
    for (let i = 0; i < medicamentosControle.length; i += limitePorReceita) {
      receitas.push(medicamentosControle.slice(i, i + limitePorReceita));
    }
    return receitas;
  }, [medicamentosControle]);

  // 3. Folha de Recomendações e Exames (Não fica retida na farmácia)
  const blocosConselhosEExames = itensAtivos.filter(
    (b) => b.tipo === 'orientacao' || b.tipo === 'exame' || b.tipo === 'dieta'
  );

  // Cotação consolidada de Farmácia Popular
  const orcamento = useMemo(() => {
    let totalPmc = 0;
    let totalVarejoEstimado = 0;
    let totalComFarmaciaPopular = 0;
    let itensGratuitosSus = 0;

    const meds = itensAtivos
      .filter((b) => b.tipo === 'medicamento' && b.medicamento_detalhe)
      .map((b) => b.medicamento_detalhe!);

    for (const item of meds) {
      const cotacao = cotarPrecosFarmacias(
        item.nome_medicamento,
        item.principio_ativo,
        item.preco_pmc,
        item.apresentacao
      );
      const subtotalPmc = cotacao.preco_teto_anvisa * item.quantidade_embalagens;
      const subtotalVarejo = cotacao.preco_varejo_estimado * item.quantidade_embalagens;

      totalPmc += subtotalPmc;
      totalVarejoEstimado += subtotalVarejo;

      if (cotacao.situacao_farmacia_popular.gratuito) {
        itensGratuitosSus += 1;
      } else {
        totalComFarmaciaPopular += subtotalVarejo;
      }
    }

    const economiaTotal = totalPmc - totalComFarmaciaPopular;
    return {
      totalPmc,
      totalVarejoEstimado,
      totalComFarmaciaPopular,
      itensGratuitosSus,
      economiaTotal: economiaTotal > 0 ? economiaTotal : 0,
    };
  }, [itensAtivos]);

  // Auditoria de Segurança 5G
  const relatorio5g = useMemo(() => {
    const nomes = itensAtivos
      .filter((b) => b.tipo === 'medicamento' && b.medicamento_detalhe)
      .map((b) => b.medicamento_detalhe!.principio_ativo || b.medicamento_detalhe!.nome_medicamento);
    return avaliarSegurancaMedicamentosa5g(
      nomes,
      pacienteAtivo?.idade_anos || 65,
      false,
      false,
      false,
      false,
      false
    );
  }, [itensAtivos, pacienteAtivo]);

  // Exportação em PDF
  const dispararDownloadPdf = async () => {
    if (!printPagesRef.current) return;
    setGerandoPdf(true);
    try {
      const paginasEl = Array.from(
        printPagesRef.current.querySelectorAll('.folha-receita-exportavel, .pagina-a4-render')
      ) as HTMLElement[];

      if (paginasEl.length === 0) {
        alert('Nenhuma página de receituário para exportar.');
        return;
      }

      const nomePac = pacienteAtivo
        ? pacienteAtivo.nome_completo.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20)
        : 'Paciente';
      const dataHoje = new Date().toISOString().substring(0, 10);
      const formato = (perfilMedico.tamanho_papel_receita?.toLowerCase() as 'a4' | 'a5') || 'a4';
      await exportarElementosParaPdf(
        paginasEl,
        `Receituario_${nomePac}_${dataHoje}.pdf`,
        formato,
        {
          blocos: itensAtivos,
          paciente: pacienteAtivo,
          medico: perfilMedico,
        }
      );
    } catch (err) {
      console.error('Erro ao gerar PDF da receita:', err);
      alert('Houve um erro ao processar o PDF. Utilize o botão Imprimir para salvar em PDF.');
    } finally {
      setGerandoPdf(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* =====================================================================
          CABEÇALHO DA ESTAÇÃO DE PRESCRIÇÃO MODULAR
         ===================================================================== */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-teal-500/10 text-teal-400 rounded-2xl border border-teal-500/20">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 flex-wrap">
              Cesta de Prescrição Modular & Conformidade Sanitária
              <span className="px-2 py-0.5 bg-teal-500/20 text-teal-300 text-[10px] rounded-md font-mono">
                Portaria 344/98 &bull; RDC 471 &bull; CFM
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Composição em blocos modulares, separação legal automática em 2 vias para controle especial, cotação Farmácia Popular e exportação direta em PDF.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={abrirConfiguracaoAssinatura}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 rounded-xl text-xs font-bold transition shadow-sm"
            title="Upload ou desenho da assinatura eletrônica do médico prescritor"
          >
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>{perfilMedico.assinatura_base64 ? 'Assinatura Ativa ✓' : 'Configurar Assinatura'}</span>
          </button>

          <button
            onClick={abrirConfiguracaoReceita}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition shadow-sm"
            title="Configurar tamanho de papel (A4/A5), logotipo e papel timbrado"
          >
            <Sliders className="w-4 h-4 text-slate-400" />
            <span>Papel & PDF</span>
          </button>

          <input
            ref={fileInputCanvasRef}
            type="file"
            accept=".pdf"
            multiple={true}
            onChange={handleImportarPdfsCanvas}
            className="hidden"
          />
          <button
            onClick={() => fileInputCanvasRef.current?.click()}
            disabled={importandoPdf}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-950/40"
            title="Importar uma ou múltiplas receitas em PDF e recuperar blocos inteligentes"
          >
            <FileUp className="w-4 h-4" />
            {importandoPdf ? 'Lendo PDFs...' : 'Importar Receitas em PDF'}
          </button>

          <button
            onClick={dispararDownloadPdf}
            disabled={itensAtivos.length === 0 || gerandoPdf}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-sky-950/40"
          >
            <Download className="w-4 h-4" />
            {gerandoPdf ? 'Gerando PDF...' : 'Baixar Receita em PDF'}
          </button>

          <button
            onClick={() => window.print()}
            disabled={itensAtivos.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-teal-950/40"
          >
            <Printer className="w-4 h-4" /> Imprimir
          </button>

          <button
            onClick={() => {
              if (confirm('Deseja limpar todos os blocos desta prescrição?')) {
                limparPrescricao();
                setBlocos([]);
              }
            }}
            className="p-2.5 bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 rounded-xl transition border border-slate-700"
            title="Limpar Prescrição"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* =====================================================================
          SELETOR DE MODELO VISUAL / TEMPLATE & UPLOAD DE TIMBRE
         ===================================================================== */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 print:hidden flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
            <Sliders className="w-4 h-4 text-teal-400" /> Template Visual:
          </span>
          <select
            value={templateAtivoId}
            onChange={(e) => {
              setTemplateAtivoId(e.target.value);
              definirTemplateAtivoId(e.target.value);
            }}
            className="w-full sm:w-72 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-medium focus:outline-none focus:border-teal-500"
          >
            {templates.map((tpl) => (
              <option key={tpl.id} value={tpl.id}>
                {tpl.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Botão de Upload de Papel Timbrado Novo */}
        <label className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold cursor-pointer transition border border-slate-700 shrink-0">
          <Upload className="w-3.5 h-3.5 text-teal-400" />
          <span>Subir Novo Template / Timbre A4</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleUploadTemplateImagem}
            className="hidden"
          />
        </label>
      </div>

      {/* =====================================================================
          ALERTA REGULATÓRIO BRASIL & PAINEL DE DIVISÃO DE FOLHAS
         ===================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 print:hidden">
        {/* Card Receita Simples */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300 uppercase">Receituário Simples</span>
            <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-mono text-[10px]">
              {medicamentosSimples.length} item(ns)
            </span>
          </div>
          <div className="text-xs text-slate-400">
            {paginasReceitaSimples.length > 0 ? (
              <span className="text-teal-400 font-medium">
                Dividido em {paginasReceitaSimples.length} folha(s) (máx. 4 itens/folha para legibilidade)
              </span>
            ) : (
              <span>Nenhum medicamento simples prescrito.</span>
            )}
          </div>
        </div>

        {/* Card Controle Especial (2 Vias) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-400 uppercase">Controle Especial & ATB</span>
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded font-mono text-[10px] font-bold">
              {medicamentosControle.length} substância(s)
            </span>
          </div>
          <div className="text-xs text-slate-400">
            {receitasControleEspecial.length > 0 ? (
              <span className="text-amber-300 font-medium">
                {receitasControleEspecial.length} receita(s) em 2 VIAS OBRIGATÓRIAS (máx. 3 fármacos por notificação)
              </span>
            ) : (
              <span>Nenhum fármaco controlado ou antimicrobiano.</span>
            )}
          </div>
        </div>

        {/* Card Orientações e Exames */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-sky-400 uppercase">Orientações & Exames</span>
            <span className="px-2 py-0.5 bg-sky-500/20 text-sky-300 rounded font-mono text-[10px]">
              {blocosConselhosEExames.length} bloco(s)
            </span>
          </div>
          <div className="text-xs text-slate-400">
            Folha anexa exclusiva de orientações não-farmacológicas e pedidos de exames para o paciente.
          </div>
        </div>
      </div>

      {/* =====================================================================
          ORÇAMENTO & AUDITORIA 5G DA CESTA
         ===================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 print:hidden">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Teto ANVISA (PMC)</span>
          <div className="text-xl font-bold font-mono text-slate-100">
            R$ {orcamento.totalPmc.toFixed(2)}
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
          <span className="text-[10px] text-sky-400 font-bold uppercase block">Varejo Estimado</span>
          <div className="text-xl font-bold font-mono text-sky-300">
            R$ {orcamento.totalVarejoEstimado.toFixed(2)}
          </div>
        </div>
        <div className="bg-slate-900 border border-teal-800/60 rounded-2xl p-4 text-center">
          <span className="text-[10px] text-teal-400 font-bold uppercase block">Com Farmácia Popular SUS</span>
          <div className="text-xl font-extrabold font-mono text-teal-300">
            R$ {orcamento.totalComFarmaciaPopular.toFixed(2)}
          </div>
          <span className="text-[10px] text-teal-400">
            {orcamento.itensGratuitosSus} item(ns) a R$ 0,00
          </span>
        </div>
        <div className="bg-slate-900 border border-emerald-800/60 rounded-2xl p-4 text-center">
          <span className="text-[10px] text-emerald-400 font-bold uppercase block">Economia Estimada</span>
          <div className="text-xl font-extrabold font-mono text-emerald-400">
            R$ {orcamento.economiaTotal.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Auditoria 5G */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 print:hidden">
        <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase">
          <ShieldAlert className="w-4 h-4" /> Auditoria 5G da Prescrição:
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {relatorio5g.triple_whammy.detectado && (
            <span className="px-2.5 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-lg font-semibold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" /> Triple Whammy Renal Detectado!
            </span>
          )}
          {relatorio5g.cascatas.length > 0 && (
            <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg font-semibold">
              ⚠️ {relatorio5g.cascatas.length} Cascata(s) Iatrogênica(s)
            </span>
          )}
          <span className="px-2.5 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded-lg">
            Carga Anticolinérgica: {relatorio5g.carga_anticolinergica.pontuacao_total} pts ({relatorio5g.carga_anticolinergica.classificacao_risco})
          </span>
          <span className="px-2.5 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded-lg">
            Tisdale QTc: {relatorio5g.escore_tisdale.pontuacao_total} pts ({relatorio5g.escore_tisdale.categoria_risco})
          </span>
        </div>
      </div>

      {/* =====================================================================
          FORMULÁRIO DE ADIÇÃO DE NOVAS PEÇAS MODULARES
         ===================================================================== */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 print:hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Adicionar Nova Peça Modular à Prescrição:
          </span>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setAbaNovoItem('medicamento')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                abaNovoItem === 'medicamento' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              💊 Fármaco
            </button>
            <button
              onClick={() => setAbaNovoItem('orientacao')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                abaNovoItem === 'orientacao' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              📋 Conselho / MEV
            </button>
            <button
              onClick={() => setAbaNovoItem('exame')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                abaNovoItem === 'exame' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🔬 Pedido de Exames
            </button>
          </div>
        </div>

        {/* Sub-aba Medicamento */}
        {abaNovoItem === 'medicamento' && (
          <form onSubmit={adicionarMedicamento} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Medicamento / Marca Comercial *</label>
                <MedicationAutocomplete
                  required
                  placeholder="Ex: Losartana Potássica 50mg"
                  value={formMedNome}
                  onChange={(val) => setFormMedNome(val)}
                  onSelect={(sugestao) => {
                    setFormMedNome(sugestao.nome);
                    if (sugestao.detalhes?.principio_ativo) {
                      setFormMedPrincipio(sugestao.detalhes.principio_ativo);
                    }
                    if (sugestao.detalhes?.apresentacao) {
                      setFormMedApres(sugestao.detalhes.apresentacao);
                    }
                    if (sugestao.detalhes?.posologia) {
                      setFormMedPosologia(sugestao.detalhes.posologia);
                    }
                    if (sugestao.detalhes?.tipo_receituario) {
                      setFormMedTipo(sugestao.detalhes.tipo_receituario);
                    }
                  }}
                  className="w-full"
                  inputClassName="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Princípio Ativo (DCB)</label>
                <MedicationAutocomplete
                  placeholder="Ex: LOSARTANA POTÁSSICA"
                  value={formMedPrincipio}
                  onChange={(val) => setFormMedPrincipio(val)}
                  onSelect={(sugestao) => {
                    setFormMedPrincipio(sugestao.detalhes?.principio_ativo || sugestao.nome.toUpperCase());
                    if (!formMedNome) {
                      setFormMedNome(sugestao.nome);
                    }
                    if (!formMedApres && sugestao.detalhes?.apresentacao) {
                      setFormMedApres(sugestao.detalhes.apresentacao);
                    }
                  }}
                  className="w-full"
                  inputClassName="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Apresentação</label>
                <input
                  type="text"
                  placeholder="Ex: 50mg comprimido rev. - cx com 30"
                  value={formMedApres}
                  onChange={(e) => setFormMedApres(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <div className="sm:col-span-2">
                <label className="text-slate-400 block mb-1">Posologia / Orientação de Uso *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Tomar 1 comprimido VO 1x ao dia pela manhã."
                  value={formMedPosologia}
                  onChange={(e) => setFormMedPosologia(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Quantidade</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={formMedQtd}
                  onChange={(e) => setFormMedQtd(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Tipo de Receituário</label>
                <select
                  value={formMedTipo}
                  onChange={(e) =>
                    setFormMedTipo(e.target.value as ItemPrescricaoCesta['tipo_receituario'])
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-slate-100"
                >
                  <option value="simples">Receituário Simples</option>
                  <option value="controle_especial_c1">Controle Especial C1 (2 Vias)</option>
                  <option value="antimicrobiano">Antimicrobiano RDC 471 (2 Vias)</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Preço PMC (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formMedPmc}
                  onChange={(e) => setFormMedPmc(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-teal-950/40"
            >
              <Plus className="w-4 h-4" /> Adicionar Medicamento à Prescrição
            </button>
          </form>
        )}

        {/* Sub-aba Orientação */}
        {abaNovoItem === 'orientacao' && (
          <form onSubmit={adicionarOrientacao} className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Título do Bloco de Orientações</label>
              <input
                type="text"
                value={formOrientTitulo}
                onChange={(e) => setFormOrientTitulo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Orientações, Dieta, Cuidados ou Sinais de Alarme</label>
              <textarea
                rows={3}
                required
                placeholder="Ex: • Ingerir pelo menos 2 litros de água ao dia.&#10;• Retornar ao pronto-socorro em caso de febre persistente ou dor intensa."
                value={formOrientTexto}
                onChange={(e) => setFormOrientTexto(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Adicionar Bloco de Orientações
            </button>
          </form>
        )}

        {/* Sub-aba Exame */}
        {abaNovoItem === 'exame' && (
          <form onSubmit={adicionarExame} className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Título da Solicitação</label>
              <input
                type="text"
                value={formExameTitulo}
                onChange={(e) => setFormExameTitulo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Exames Solicitados e Justificativa Clínica</label>
              <textarea
                rows={3}
                required
                placeholder="Ex: 1. Hemograma completo&#10;2. Creatinina e TFG&#10;3. Glicemia de jejum e HbA1c&#10;Indicação: Avaliação de rotina em paciente com HAS/DM2."
                value={formExameTexto}
                onChange={(e) => setFormExameTexto(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Adicionar Pedido de Exames
            </button>
          </form>
        )}
      </div>

      {/* =====================================================================
          LISTA DE PEÇAS MODULARES ATIVAS (REORDENÁVEIS E EDITÁVEIS)
         ===================================================================== */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3 print:hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Peças Modulares na Prescrição Ativa ({blocos.length}):
          </span>
          <span className="text-[11px] text-slate-400">
            Arraste ou use as setas para reordenar a prioridade de exibição.
          </span>
        </div>

        {blocos.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-2xl">
            Nenhuma peça na prescrição. Adicione medicamentos, conselhos ou exporte de um protocolo clínico.
          </div>
        ) : (
          <div className="space-y-2">
            {blocos.map((bloco, idx) => (
              <div
                key={bloco.id}
                className={`p-3.5 rounded-2xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
                  bloco.ativo
                    ? 'bg-slate-950/70 border-slate-800'
                    : 'bg-slate-950/30 border-slate-900 opacity-50'
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex flex-col gap-1 pt-0.5">
                    <button
                      disabled={idx === 0}
                      onClick={() => moverBloco(idx, 'cima')}
                      className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded disabled:opacity-30"
                      title="Mover para cima"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      disabled={idx === blocos.length - 1}
                      onClick={() => moverBloco(idx, 'baixo')}
                      className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded disabled:opacity-30"
                      title="Mover para baixo"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-100 text-sm">{bloco.titulo}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase font-semibold ${
                          bloco.tipo === 'medicamento'
                            ? bloco.medicamento_detalhe?.tipo_receituario === 'simples'
                              ? 'bg-teal-500/15 text-teal-300 border border-teal-500/20'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : bloco.tipo === 'orientacao'
                            ? 'bg-sky-500/15 text-sky-300 border border-sky-500/20'
                            : 'bg-purple-500/15 text-purple-300 border border-purple-500/20'
                        }`}
                      >
                        {bloco.tipo}
                      </span>
                      {bloco.origem_fonte && (
                        <span className="text-[10px] text-slate-500 font-mono">
                          Fonte: {bloco.origem_fonte}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-300 leading-relaxed whitespace-pre-line text-[11px]">
                      {bloco.conteudo}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => alternarAtivo(bloco.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition ${
                      bloco.ativo
                        ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {bloco.ativo ? 'Ativo' : 'Oculto'}
                  </button>
                  <button
                    onClick={() => removerBloco(bloco.id)}
                    className="p-1.5 hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 rounded-lg transition"
                    title="Remover Peça"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =========================================================================
          PRÉ-VISUALIZAÇÃO / RENDERIZAÇÃO DAS PÁGINAS A4 DE IMPRESSÃO E PDF
          (Em tela fica como preview elegante; na impressão/PDF vira A4 perfeito)
         ========================================================================= */}
      <div ref={printPagesRef} className="space-y-8">
        <PrescriptionSheetRenderer
          blocos={itensAtivos}
          perfilMedico={perfilMedico}
          pacienteAtivo={pacienteAtivo}
        />
      </div>
    </div>
  );
};
