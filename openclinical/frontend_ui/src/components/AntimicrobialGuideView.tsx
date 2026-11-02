import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  FileText,
  AlertCircle,
  Filter,
  Sparkles,
  Search,
  Plus,
} from 'lucide-react';
import {
  MATRIZ_ANTIMICROBIANOS,
  CRITERIOS_SWITCH_IV_VO,
  CARIMBOS_PRONTUARIO,
  ItemMatrizAntimicrobiano,
} from '../data/guia_antimicrobiano_ccih';
import { adicionarItemPrescricaoModular } from '../storage_clinico';

export const AntimicrobialGuideView: React.FC = () => {
  const [abaAtiva, setAbaAtiva] = useState<'matriz' | 'switch' | 'carimbos'>('matriz');

  // Filtros da Matriz
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroEspectro, setFiltroEspectro] = useState<'todos' | 'pseudomonas' | 'mrsa' | 'esbl' | 'anaerobios'>('todos');

  // Checklist de Switch
  const [criteriosMarcados, setCriteriosMarcados] = useState<number[]>([]);

  // Carimbos de Prontuário
  const [copiadoId, setCopiadoId] = useState<string | null>(null);
  const [buscaCarimbo, setBuscaCarimbo] = useState('');

  const alternarCriterio = (id: number) => {
    setCriteriosMarcados((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const copiarTexto = async (id: string, texto: string) => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiadoId(id);
      setTimeout(() => setCopiadoId(null), 2500);
    } catch {
      // Fallback
    }
  };

  const itensFiltrados = MATRIZ_ANTIMICROBIANOS.filter((item) => {
    const atendeTexto =
      item.antibiotico.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      item.classe.toLowerCase().includes(filtroTexto.toLowerCase());
    if (!atendeTexto) return false;

    if (filtroEspectro === 'pseudomonas') return item.pseudomonas.includes('Excelente') || item.pseudomonas.includes('Ativo');
    if (filtroEspectro === 'mrsa') return item.mrsa.includes('Excelente') || item.mrsa.includes('Ativo');
    if (filtroEspectro === 'esbl') return item.esbl.includes('Excelente') || item.esbl.includes('Ativo');
    if (filtroEspectro === 'anaerobios') return item.anaerobios.includes('Excelente') || item.anaerobios.includes('Ativo');

    return true;
  });

  const carimbosFiltrados = CARIMBOS_PRONTUARIO.filter(
    (c) =>
      c.titulo.toLowerCase().includes(buscaCarimbo.toLowerCase()) ||
      c.categoria.toLowerCase().includes(buscaCarimbo.toLowerCase()) ||
      c.texto.toLowerCase().includes(buscaCarimbo.toLowerCase())
  );

  const elegivelSwitch = criteriosMarcados.length === CRITERIOS_SWITCH_IV_VO.length;

  const handlePrescreverAntimicrobiano = (item: ItemMatrizAntimicrobiano) => {
    adicionarItemPrescricaoModular(
      'medicamento',
      item.antibiotico,
      `Uso conforme orientação médica: ${item.posologia_padrao}\nClasse: ${item.classe}`,
      {
        id: `atb_${Date.now()}`,
        nome_medicamento: item.antibiotico,
        principio_ativo: item.antibiotico.toUpperCase(),
        apresentacao: 'Comprimido / Cápsula / Suspensão',
        posologia: item.posologia_padrao,
        quantidade_embalagens: 1,
        via_administracao: 'oral',
        tipo_receituario: 'antimicrobiano',
        preco_pmc: 0,
      },
      `Guia Antimicrobiano CCIH (${item.classe})`
    );
  };

  const handleAdicionarOrientacaoSwitch = () => {
    adicionarItemPrescricaoModular(
      'orientacao',
      'Desprescrição / Switch Terapia IV → VO',
      'Critérios clínicos preenchidos para transição de antimicrobiano intravenoso para via oral (apirexia > 48h, leucócitos em queda, trato gastrointestinal funcionante e estabilidade hemodinâmica). Retirada de acesso venoso recomendada pela CCIH.',
      undefined,
      'Stewardship de Antimicrobianos / CCIH'
    );
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              Guia Antimicrobiano & Stewardship Hospitalar (CCIH)
              <span className="px-2 py-0.5 bg-teal-500/20 text-teal-300 text-[10px] rounded font-mono">
                Choosing Wisely
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Matriz de cobertura microbiológica, checklist de transição IV &rarr; VO e modelos estruturados de prontuário.
            </p>
          </div>
        </div>

        {/* Abas */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setAbaAtiva('matriz')}
            className={`px-3 py-1.5 rounded-lg transition ${
              abaAtiva === 'matriz' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Matriz de Cobertura
          </button>
          <button
            onClick={() => setAbaAtiva('switch')}
            className={`px-3 py-1.5 rounded-lg transition ${
              abaAtiva === 'switch' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Switch IV &rarr; VO
          </button>
          <button
            onClick={() => setAbaAtiva('carimbos')}
            className={`px-3 py-1.5 rounded-lg transition ${
              abaAtiva === 'carimbos' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Carimbos de Prontuário
          </button>
        </div>
      </div>

      {/* ABA 1: MATRIZ DE COBERTURA */}
      {abaAtiva === 'matriz' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filtrar por antibiótico ou classe..."
                value={filtroTexto}
                onChange={(e) => setFiltroTexto(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 text-xs">
              <button
                onClick={() => setFiltroEspectro('todos')}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition ${
                  filtroEspectro === 'todos' ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-800 text-slate-400'
                }`}
              >
                Todos (15)
              </button>
              <button
                onClick={() => setFiltroEspectro('pseudomonas')}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition ${
                  filtroEspectro === 'pseudomonas' ? 'bg-sky-600 border-sky-500 text-white' : 'border-slate-800 text-slate-400'
                }`}
              >
                Pseudomonas
              </button>
              <button
                onClick={() => setFiltroEspectro('mrsa')}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition ${
                  filtroEspectro === 'mrsa' ? 'bg-rose-600 border-rose-500 text-white' : 'border-slate-800 text-slate-400'
                }`}
              >
                MRSA
              </button>
              <button
                onClick={() => setFiltroEspectro('esbl')}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition ${
                  filtroEspectro === 'esbl' ? 'bg-amber-600 border-amber-500 text-white' : 'border-slate-800 text-slate-400'
                }`}
              >
                ESBL
              </button>
              <button
                onClick={() => setFiltroEspectro('anaerobios')}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition ${
                  filtroEspectro === 'anaerobios' ? 'bg-purple-600 border-purple-500 text-white' : 'border-slate-800 text-slate-400'
                }`}
              >
                Anaeróbios
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Antimicrobiano</th>
                  <th className="py-2.5 px-2 text-center">MSSA</th>
                  <th className="py-2.5 px-2 text-center">MRSA</th>
                  <th className="py-2.5 px-2 text-center">S. pneumo</th>
                  <th className="py-2.5 px-2 text-center">E. faecalis</th>
                  <th className="py-2.5 px-2 text-center">Gram Neg.</th>
                  <th className="py-2.5 px-2 text-center">Pseudomonas</th>
                  <th className="py-2.5 px-2 text-center">ESBL</th>
                  <th className="py-2.5 px-2 text-center">Anaeróbios</th>
                  <th className="py-2.5 px-2 text-center">Atípicos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {itensFiltrados.map((item, idx) => {
                  const renderBadge = (val: string) => {
                    if (val.includes('Excelente')) {
                      return <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">1ª Linha</span>;
                    }
                    if (val.includes('Ativo')) {
                      return <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">Ativo</span>;
                    }
                    return <span className="inline-block px-1 py-0.5 rounded text-[10px] text-slate-500">&mdash;</span>;
                  };

                  return (
                    <tr key={idx} className="hover:bg-slate-800/40 transition">
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-100">{item.antibiotico}</div>
                        <div className="text-[11px] text-slate-400">{item.classe}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5 font-mono">{item.posologia_padrao}</div>
                        <button
                          type="button"
                          onClick={() => handlePrescreverAntimicrobiano(item)}
                          className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-[10px] font-semibold transition"
                          title="Adicionar à Receita Digital (2 vias RDC 471/2021)"
                        >
                          <Plus className="w-3 h-3" />
                          <span>+ Receita Digital</span>
                        </button>
                      </td>
                      <td className="py-2.5 px-2 text-center">{renderBadge(item.mssa)}</td>
                      <td className="py-2.5 px-2 text-center">{renderBadge(item.mrsa)}</td>
                      <td className="py-2.5 px-2 text-center">{renderBadge(item.s_pneumoniae)}</td>
                      <td className="py-2.5 px-2 text-center">{renderBadge(item.e_faecalis)}</td>
                      <td className="py-2.5 px-2 text-center">{renderBadge(item.gram_negativos)}</td>
                      <td className="py-2.5 px-2 text-center">{renderBadge(item.pseudomonas)}</td>
                      <td className="py-2.5 px-2 text-center">{renderBadge(item.esbl)}</td>
                      <td className="py-2.5 px-2 text-center">{renderBadge(item.anaerobios)}</td>
                      <td className="py-2.5 px-2 text-center">{renderBadge(item.atipicos)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ABA 2: CHECKLIST SWITCH IV -> VO */}
      {abaAtiva === 'switch' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                Critérios de Transição Intravenosa &rarr; Oral (Switch Therapy CCIH)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Reduz tempo de internação, bacteremias associadas a cateter venoso e custos hospitalares.
              </p>
            </div>
            <div
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition ${
                elegivelSwitch
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-950/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {elegivelSwitch ? 'ELEGÍVEL PARA TRANSIÇÃO ORAL' : `${criteriosMarcados.length}/5 critérios atendidos`}
            </div>
          </div>

          <div className="space-y-3">
            {CRITERIOS_SWITCH_IV_VO.map((crit) => {
              const ativo = criteriosMarcados.includes(crit.id);
              return (
                <div
                  key={crit.id}
                  onClick={() => alternarCriterio(crit.id)}
                  className={`p-4 rounded-xl border text-xs cursor-pointer transition flex items-start space-x-3 ${
                    ativo
                      ? 'bg-emerald-950/30 border-emerald-600/70 text-slate-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className={`mt-0.5 rounded-md p-0.5 ${ativo ? 'text-emerald-400' : 'text-slate-600'}`}>
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <span className="font-bold text-slate-100 text-sm block">{crit.titulo}</span>
                    <p className="text-slate-300 leading-relaxed">{crit.descricao}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {elegivelSwitch && (
            <div className="bg-emerald-950/40 border border-emerald-600/60 rounded-xl p-4 text-xs text-emerald-200 space-y-2">
              <strong className="text-emerald-300 flex items-center gap-1.5 text-sm">
                <Sparkles className="w-4 h-4" /> Recomendação CCIH / Stewardship:
              </strong>
              <p>
                Paciente preenche todos os critérios de segurança para conversão para terapia oral. Considerar desprescrição da via parenteral e retirada precoce do cateter venoso periférico/central.
              </p>
              <button
                type="button"
                onClick={handleAdicionarOrientacaoSwitch}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>+ Adicionar Conduta de Switch à Receita / Prontuário</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ABA 3: CARIMBOS DE PRONTUÁRIO */}
      {abaAtiva === 'carimbos' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-400" />
                Biblioteca de Carimbos e Modelos de Prontuário Médico
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Modelos prontos e auditados para cópia rápida em 1 clique (FAST-HUG, IOT, CVC, Paracentese, etc.).
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar carimbo..."
                value={buscaCarimbo}
                onChange={(e) => setBuscaCarimbo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {carimbosFiltrados.map((c) => {
              const copiado = copiadoId === c.id;
              return (
                <div
                  key={c.id}
                  className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-2">
                    <div>
                      <span className="font-bold text-slate-100 text-sm">{c.titulo}</span>
                      <span className="block text-[11px] text-teal-400">{c.categoria}</span>
                    </div>
                    <button
                      onClick={() => copiarTexto(c.id, c.texto)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        copiado
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      }`}
                    >
                      {copiado ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiado ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>

                  <pre className="text-[11px] text-slate-300 font-mono bg-slate-900 p-3 rounded-lg overflow-x-auto max-h-48 whitespace-pre-wrap leading-relaxed border border-slate-850">
                    {c.texto}
                  </pre>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
