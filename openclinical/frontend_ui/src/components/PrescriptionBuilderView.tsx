import React, { useState, useMemo } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Printer,
  ShoppingBag,
  ShieldAlert,
  AlertTriangle,
  Flame,
  Dna,
  DollarSign,
  Heart,
  Layers,
  Sparkles,
} from 'lucide-react';
import { ItemPrescricaoCesta } from '../types';
import { cotarPrecosFarmacias } from '../pharmacy_pricing';
import { avaliarSegurancaMedicamentosa5g } from '../medication_safety_5g';

const PRESETS_EXEMPLO: ItemPrescricaoCesta[] = [
  {
    id: '1',
    nome_medicamento: 'Losartana Potássica 50mg',
    principio_ativo: 'LOSARTANA POTÁSSICA',
    apresentacao: '50 MG COM REV CT BL AL PLAS OPC X 30',
    posologia: 'Tomar 1 comprimido por via oral uma vez ao dia pela manhã.',
    quantidade_embalagens: 2,
    tipo_receituario: 'simples',
    preco_pmc: 32.5,
  },
  {
    id: '2',
    nome_medicamento: 'Furosemida 40mg',
    principio_ativo: 'FUROSEMIDA',
    apresentacao: '40 MG COM CT BL AL PLAS AMB X 20',
    posologia: 'Tomar 1 comprimido por via oral pela manhã em jejum.',
    quantidade_embalagens: 1,
    tipo_receituario: 'simples',
    preco_pmc: 14.8,
  },
  {
    id: '3',
    nome_medicamento: 'Clonazepam 2mg (Rivotril)',
    principio_ativo: 'CLONAZEPAM',
    apresentacao: '2 MG COM CT BL AL PLAS INC X 30',
    posologia: 'Tomar 1 comprimido por via oral ao deitar se insônia grave.',
    quantidade_embalagens: 1,
    tipo_receituario: 'controle_especial_c1',
    preco_pmc: 24.9,
  },
];

export const PrescriptionBuilderView: React.FC = () => {
  const [itens, setItens] = useState<ItemPrescricaoCesta[]>(PRESETS_EXEMPLO);

  // Form de adição de novo medicamento
  const [nomeMed, setNomeMed] = useState('');
  const [principioAtivo, setPrincipioAtivo] = useState('');
  const [apresentacao, setApresentacao] = useState('');
  const [posologia, setPosologia] = useState('');
  const [qtd, setQtd] = useState(1);
  const [tipoReceita, setTipoReceita] = useState<ItemPrescricaoCesta['tipo_receituario']>('simples');
  const [precoPmc, setPrecoPmc] = useState<number>(25.0);

  // Dados do Paciente e Médico para Impressão
  const [nomePaciente, setNomePaciente] = useState('Paciente Modelo SUS / Particular');
  const [documentoPaciente, setDocumentoPaciente] = useState('CPF: 123.456.789-00');
  const [nomeMedico, setNomeMedico] = useState('Dr. Médico Assistente');
  const [crmMedico, setCrmMedico] = useState('CRM/UF: 123456');

  // Adicionar item
  const adicionarItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeMed.trim() || !posologia.trim()) return;

    const novo: ItemPrescricaoCesta = {
      id: Date.now().toString(),
      nome_medicamento: nomeMed.trim(),
      principio_ativo: (principioAtivo || nomeMed).trim().toUpperCase(),
      apresentacao: apresentacao.trim() || 'Comprimido / Uso Oral',
      posologia: posologia.trim(),
      quantidade_embalagens: qtd,
      tipo_receituario: tipoReceita,
      preco_pmc: precoPmc,
    };

    setItens((prev) => [...prev, novo]);
    setNomeMed('');
    setPrincipioAtivo('');
    setApresentacao('');
    setPosologia('');
    setQtd(1);
  };

  const removerItem = (id: string) => {
    setItens((prev) => prev.filter((i) => i.id !== id));
  };

  // Cotação consolidada de preços
  const orcamento = useMemo(() => {
    let totalPmc = 0;
    let totalVarejoEstimado = 0;
    let totalComFarmaciaPopular = 0;
    let itensGratuitosSus = 0;

    for (const item of itens) {
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
        // R$ 0,00 no SUS
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
  }, [itens]);

  // Auditoria de Segurança 5G em Tempo Real
  const relatorio5g = useMemo(() => {
    const nomes = itens.map((i) => i.principio_ativo || i.nome_medicamento);
    return avaliarSegurancaMedicamentosa5g(nomes, 68, false, false, false, false, false);
  }, [itens]);

  // Agrupamento por tipo de receituário (Portaria 344/98 e RDC 471)
  const itensSimples = itens.filter((i) => i.tipo_receituario === 'simples');
  const itensControleEspecial = itens.filter(
    (i) => i.tipo_receituario === 'controle_especial_c1' || i.tipo_receituario === 'antimicrobiano'
  );
  const itensNotificacao = itens.filter(
    (i) => i.tipo_receituario === 'notificacao_b_azul' || i.tipo_receituario === 'notificacao_a_amarela'
  );

  const imprimirReceita = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Cesta */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              Cesta de Prescrição Multi-Fármaco & Orçamento Consolidado
              <span className="px-2 py-0.5 bg-teal-500/20 text-teal-300 text-[10px] rounded font-mono">
                Portaria 344 / SUS
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Separação automática de receituários (Simples / 2 Vias Controle Especial), orçamento comparativo de farmácias e auditoria de segurança 5G.
            </p>
          </div>
        </div>

        <button
          onClick={imprimirReceita}
          disabled={itens.length === 0}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-teal-950/40"
        >
          <Printer className="w-4 h-4" /> Imprimir Receituários Oficiais
        </button>
      </div>

      {/* PAINEL DE ORÇAMENTO CONSOLIDADO & FARMÁCIA POPULAR */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 print:hidden">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Teto ANVISA (PMC Oficial)
          </span>
          <div className="text-2xl font-bold font-mono text-slate-100">
            R$ {orcamento.totalPmc.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-500">Preço Máximo ao Consumidor</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center space-y-1">
          <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider block">
            Varejo Econômico Estimado
          </span>
          <div className="text-2xl font-bold font-mono text-sky-300">
            R$ {orcamento.totalVarejoEstimado.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-500">Média drogarias comerciais</span>
        </div>

        <div className="bg-slate-900 border border-teal-800/60 rounded-2xl p-4 text-center space-y-1 shadow-lg shadow-teal-950/30">
          <span className="text-[11px] font-semibold text-teal-400 uppercase tracking-wider block">
            Total com Farmácia Popular SUS
          </span>
          <div className="text-2xl font-extrabold font-mono text-teal-300">
            R$ {orcamento.totalComFarmaciaPopular.toFixed(2)}
          </div>
          <span className="text-[10px] text-teal-400 font-semibold">
            {orcamento.itensGratuitosSus} item(ns) gratuitos (R$ 0,00)
          </span>
        </div>

        <div className="bg-slate-900 border border-emerald-800/60 rounded-2xl p-4 text-center space-y-1">
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
            Economia Potencial ao Paciente
          </span>
          <div className="text-2xl font-extrabold font-mono text-emerald-400">
            R$ {orcamento.economiaTotal.toFixed(2)}
          </div>
          <span className="text-[10px] text-emerald-400">Economia estimada total</span>
        </div>
      </div>

      {/* ALERTA DE SEGURANÇA 5G DA CESTA */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5 print:hidden">
        <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4" /> Auditoria de Segurança 5G na Cesta de Prescrição:
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {relatorio5g.triple_whammy.detectado && (
            <span className="px-2.5 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-lg flex items-center gap-1 font-semibold">
              <Flame className="w-3.5 h-3.5" /> Alerta Crítico: Triple Whammy Renal Detectado!
            </span>
          )}
          {relatorio5g.cascatas.length > 0 && (
            <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg flex items-center gap-1 font-semibold">
              <Layers className="w-3.5 h-3.5" /> {relatorio5g.cascatas.length} Cascata(s) de Prescrição Iatrogênica(s)
            </span>
          )}
          <span
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 font-semibold border ${
              relatorio5g.carga_anticolinergica.pontuacao_total >= 3
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            Carga Anticolinérgica (ACB: {relatorio5g.carga_anticolinergica.pontuacao_total} pts &bull; {relatorio5g.carga_anticolinergica.classificacao_risco})
          </span>
          <span
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 font-semibold border ${
              relatorio5g.escore_tisdale.pontuacao_total >= 7
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            <Heart className="w-3.5 h-3.5" /> Tisdale QTc: {relatorio5g.escore_tisdale.pontuacao_total} pts ({relatorio5g.escore_tisdale.categoria_risco})
          </span>
          {relatorio5g.farmacogenomica.length > 0 && (
            <span className="px-2.5 py-1 bg-sky-500/20 text-sky-300 border border-sky-500/40 rounded-lg flex items-center gap-1 font-semibold">
              <Dna className="w-3.5 h-3.5" /> {relatorio5g.farmacogenomica.length} Alerta(s) CPIC Nível A
            </span>
          )}
        </div>
      </div>

      {/* IDENTIFICAÇÃO DO PACIENTE E PRESCRITOR PARA IMPRESSÃO */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 print:hidden">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Identificação para Impressão do Receituário:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Nome do Paciente</label>
            <input
              type="text"
              value={nomePaciente}
              onChange={(e) => setNomePaciente(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">CPF / CNS do Paciente</label>
            <input
              type="text"
              value={documentoPaciente}
              onChange={(e) => setDocumentoPaciente(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Médico Prescritor</label>
            <input
              type="text"
              value={nomeMedico}
              onChange={(e) => setNomeMedico(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">CRM / UF</label>
            <input
              type="text"
              value={crmMedico}
              onChange={(e) => setCrmMedico(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
            />
          </div>
        </div>
      </div>

      {/* FORMULÁRIO DE ADIÇÃO DE NOVO ITEM */}
      <form onSubmit={adicionarItem} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 print:hidden">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Adicionar Medicamento à Receita:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Nome Comercial / Produto</label>
            <input
              type="text"
              placeholder="Ex: Amoxil 500mg, Losartana..."
              value={nomeMed}
              onChange={(e) => setNomeMed(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
              required
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Princípio Ativo (DCB)</label>
            <input
              type="text"
              placeholder="Ex: AMOXICILINA"
              value={principioAtivo}
              onChange={(e) => setPrincipioAtivo(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Apresentação</label>
            <input
              type="text"
              placeholder="Ex: 500 mg cápsulas dura - cx com 21"
              value={apresentacao}
              onChange={(e) => setApresentacao(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          <div className="sm:col-span-2">
            <label className="text-slate-400 block mb-1">Posologia / Orientação ao Paciente</label>
            <input
              type="text"
              placeholder="Ex: Tomar 1 comprimido por via oral a cada 8 horas por 7 dias."
              value={posologia}
              onChange={(e) => setPosologia(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
              required
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Qtd Embalagens</label>
            <input
              type="number"
              min="1"
              max="20"
              value={qtd}
              onChange={(e) => setQtd(parseInt(e.target.value) || 1)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">PMC Unitário (R$)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={precoPmc}
              onChange={(e) => setPrecoPmc(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Tipo de Receituário</label>
            <select
              value={tipoReceita}
              onChange={(e) => setTipoReceita(e.target.value as ItemPrescricaoCesta['tipo_receituario'])}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-slate-100"
            >
              <option value="simples">Receituário Simples</option>
              <option value="controle_especial_c1">Controle Especial C1 (2 Vias)</option>
              <option value="antimicrobiano">Antimicrobiano RDC 471 (2 Vias)</option>
              <option value="notificacao_b_azul">Notificação B (Azul - Psicotrópico)</option>
              <option value="notificacao_a_amarela">Notificação A (Amarela - Entorpecente)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Adicionar à Cesta de Prescrição
        </button>
      </form>

      {/* ITENS NA CESTA (TABELA INTERATIVA) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 print:hidden">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Medicamentos na Prescrição ({itens.length}):
        </span>

        {itens.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
            Nenhum medicamento na cesta. Adicione itens acima.
          </div>
        ) : (
          <div className="space-y-2.5">
            {itens.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100 text-sm">{item.nome_medicamento}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase ${
                        item.tipo_receituario === 'simples'
                          ? 'bg-slate-800 text-slate-300'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold'
                      }`}
                    >
                      {item.tipo_receituario}
                    </span>
                    <span className="text-slate-400 font-mono">Qtd: {item.quantidade_embalagens} cx</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">{item.apresentacao}</div>
                  <div className="text-teal-300 font-medium">{item.posologia}</div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-slate-400 text-[10px] block">PMC Estimado:</span>
                    <span className="font-mono font-bold text-slate-200">
                      R$ {(item.preco_pmc * item.quantidade_embalagens).toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => removerItem(item.id)}
                    className="p-1.5 hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 rounded-lg transition"
                    title="Remover"
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
          SEÇÃO DE IMPRESSÃO PROFISSIONAL (VISÍVEL NO PRINT)
          Separação obrigatória em Talonário Simples e Controle Especial (2 Vias)
         ========================================================================= */}
      <div className="hidden print:block text-black bg-white space-y-8 p-6 font-sans">
        {/* BLOCO 1: RECEITUÁRIO SIMPLES */}
        {itensSimples.length > 0 && (
          <div className="border-2 border-black p-6 space-y-6 page-break-after">
            <div className="text-center border-b-2 border-black pb-4">
              <h1 className="text-xl font-bold uppercase tracking-wider">RECEITUÁRIO MÉDICO</h1>
              <p className="text-xs">{nomeMedico} &mdash; {crmMedico}</p>
            </div>

            <div className="text-xs space-y-1">
              <p><strong>Paciente:</strong> {nomePaciente}</p>
              <p><strong>Identificação:</strong> {documentoPaciente}</p>
              <p><strong>Data de Emissão:</strong> {new Date().toLocaleDateString('pt-BR')}</p>
            </div>

            <div className="space-y-4 pt-2">
              <span className="font-bold text-xs uppercase block tracking-wider">Uso Oral / Tópico:</span>
              <ol className="list-decimal list-inside space-y-3 text-xs">
                {itensSimples.map((it, idx) => (
                  <li key={idx} className="leading-relaxed">
                    <strong>{it.nome_medicamento}</strong> &mdash; ({it.apresentacao}) &mdash;{' '}
                    <em>Quantidade: {it.quantidade_embalagens} frasco(s)/caixa(s)</em>
                    <div className="pl-5 pt-0.5 text-gray-800">{it.posologia}</div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="pt-16 flex justify-between items-end text-xs">
              <div>
                <p>Validade: 30 dias em território nacional.</p>
              </div>
              <div className="text-center border-t border-black pt-1 w-64">
                <p className="font-bold">{nomeMedico}</p>
                <p>{crmMedico}</p>
              </div>
            </div>
          </div>
        )}

        {/* BLOCO 2: RECEITUÁRIO DE CONTROLE ESPECIAL EM 2 VIAS (PORTARIA 344/98 E RDC 471) */}
        {itensControleEspecial.length > 0 && (
          <div className="space-y-8">
            {/* 1ª VIA: RETENÇÃO DA FARMÁCIA */}
            <div className="border-2 border-black p-6 space-y-5 page-break-after">
              <div className="text-center border-b-2 border-black pb-3">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span>PORTARIA SVS/MS Nº 344/98 / RDC 471</span>
                  <span className="border border-black px-2 py-0.5 uppercase">1ª Via &mdash; Retenção da Farmácia</span>
                </div>
                <h1 className="text-xl font-extrabold uppercase mt-1">RECEITUÁRIO DE CONTROLE ESPECIAL</h1>
                <p className="text-xs">{nomeMedico} &mdash; {crmMedico}</p>
              </div>

              <div className="text-xs space-y-1 border-b pb-2">
                <p><strong>Nome do Paciente:</strong> {nomePaciente}</p>
                <p><strong>Documento:</strong> {documentoPaciente}</p>
                <p><strong>Data de Emissão:</strong> {new Date().toLocaleDateString('pt-BR')}</p>
              </div>

              <div className="space-y-3 text-xs">
                <span className="font-bold uppercase tracking-wider block">Prescrição:</span>
                <ol className="list-decimal list-inside space-y-2.5">
                  {itensControleEspecial.map((it, idx) => (
                    <li key={idx} className="leading-relaxed">
                      <strong>{it.nome_medicamento}</strong> &mdash; <em>Qtd: {it.quantidade_embalagens} caixa(s)</em>
                      <div className="pl-5 pt-0.5">{it.posologia}</div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* QUADROS OBRIGATÓRIOS DA PORTARIA 344/98 */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-black text-[10px]">
                <div className="border border-black p-2 space-y-1">
                  <span className="font-bold uppercase block">IDENTIFICAÇÃO DO COMPRADOR:</span>
                  <p>Nome: __________________________________________________</p>
                  <p>RG/Órgão: ____________________ CPF: ____________________</p>
                  <p>Endereço: ______________________________________________</p>
                  <p>Telefone: __________________ Assinatura: __________________</p>
                </div>
                <div className="border border-black p-2 space-y-1">
                  <span className="font-bold uppercase block">IDENTIFICAÇÃO DO FORNECEDOR / DISPENSAÇÃO:</span>
                  <p>Farmácia / Drogaria: ___________________________________</p>
                  <p>Nome do Farmacêutico: __________________________________</p>
                  <p>CRF: _____________________ Lote: _______________________</p>
                  <p>Data Dispensa: ___/___/2026 Assinatura: __________________</p>
                </div>
              </div>
            </div>

            {/* 2ª VIA: ORIENTAÇÃO DO PACIENTE */}
            <div className="border-2 border-black p-6 space-y-5">
              <div className="text-center border-b-2 border-black pb-3">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span>PORTARIA SVS/MS Nº 344/98 / RDC 471</span>
                  <span className="border border-black px-2 py-0.5 uppercase">2ª Via &mdash; Orientação do Paciente</span>
                </div>
                <h1 className="text-xl font-extrabold uppercase mt-1">RECEITUÁRIO DE CONTROLE ESPECIAL</h1>
                <p className="text-xs">{nomeMedico} &mdash; {crmMedico}</p>
              </div>

              <div className="text-xs space-y-1 border-b pb-2">
                <p><strong>Nome do Paciente:</strong> {nomePaciente}</p>
                <p><strong>Documento:</strong> {documentoPaciente}</p>
                <p><strong>Data:</strong> {new Date().toLocaleDateString('pt-BR')}</p>
              </div>

              <div className="space-y-3 text-xs">
                <span className="font-bold uppercase tracking-wider block">Orientações de Tomada:</span>
                <ol className="list-decimal list-inside space-y-2.5">
                  {itensControleEspecial.map((it, idx) => (
                    <li key={idx}>
                      <strong>{it.nome_medicamento}</strong>
                      <div className="pl-5 pt-0.5 text-gray-800">{it.posologia}</div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="pt-10 flex justify-between items-end text-xs">
                <div>
                  <p>Esta via permanece com o paciente.</p>
                </div>
                <div className="text-center border-t border-black pt-1 w-64">
                  <p className="font-bold">{nomeMedico}</p>
                  <p>{crmMedico}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BLOCO 3: NOTIFICAÇÃO DE RECEITA A (AMARELA) / B (AZUL) - PORTARIA 344/98 */}
        {itensNotificacao.length > 0 && (
          <div className="space-y-6">
            {itensNotificacao.map((it, idx) => (
              <div key={idx} className="border-2 border-black p-6 space-y-4 page-break-after">
                <div className="text-center border-b-2 border-black pb-3">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span>PORTARIA SVS/MS Nº 344/98</span>
                    <span className="border border-black px-2 py-0.5 uppercase">
                      {it.tipo_receituario === 'notificacao_a_amarela'
                        ? 'Notificação de Receita A (Amarela — Entorpecente)'
                        : 'Notificação de Receita B (Azul — Psicotrópico)'}
                    </span>
                  </div>
                  <h1 className="text-xl font-extrabold uppercase mt-1">
                    NOTIFICAÇÃO DE RECEITA {it.tipo_receituario === 'notificacao_a_amarela' ? 'A' : 'B'}
                  </h1>
                  <p className="text-xs">{nomeMedico} &mdash; {crmMedico}</p>
                </div>

                <div className="text-xs space-y-1 border-b pb-2">
                  <p><strong>Paciente:</strong> {nomePaciente}</p>
                  <p><strong>Documento:</strong> {documentoPaciente}</p>
                  <p><strong>Data de Emissão:</strong> {new Date().toLocaleDateString('pt-BR')}</p>
                </div>

                <div className="space-y-2 text-xs">
                  <p>
                    <strong>Medicamento / Substância:</strong> {it.nome_medicamento} ({it.apresentacao})
                  </p>
                  <p>
                    <strong>Quantidade Solicitada:</strong> {it.quantidade_embalagens} caixa(s)/embalagem(ns)
                  </p>
                  <p>
                    <strong>Posologia:</strong> {it.posologia}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-black text-[10px]">
                  <div className="border border-black p-2 space-y-1">
                    <span className="font-bold uppercase block">IDENTIFICAÇÃO DO COMPRADOR:</span>
                    <p>Nome: __________________________________________________</p>
                    <p>RG/Órgão: ____________________ CPF: ____________________</p>
                    <p>Endereço: ______________________________________________</p>
                    <p>Telefone: __________________ Assinatura: __________________</p>
                  </div>
                  <div className="border border-black p-2 space-y-1">
                    <span className="font-bold uppercase block">IDENTIFICAÇÃO DO FORNECEDOR:</span>
                    <p>Farmácia / Drogaria: ___________________________________</p>
                    <p>Farmacêutico / CRF: ____________________________________</p>
                    <p>Lote: ___________________ Data: ___/___/2026</p>
                    <p>Assinatura do Farmacêutico: ____________________________</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
