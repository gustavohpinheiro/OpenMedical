import React, { useState } from 'react';
import {
  Pill,
  Clock,
  Shield,
  Activity,
  Droplets,
  DollarSign,
  Copy,
  Check,
  Building2,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { DetalheMedicamentoCompleto, FaixaAjusteRenal, GuiaDiluicao } from '../types';

interface DrugDetailProps {
  detalhe: DetalheMedicamentoCompleto;
  onAbrirCalculadoraPediatrica: (nome: string, doseMin?: number, conc?: number, teto?: number) => void;
  onSelecionarMedicamento?: (id: number) => void;
}

const FARMACOS_DISPONIVEIS = [
  { id: 1, nome: 'Amoxil 500mg', tag: 'Oral' },
  { id: 2, nome: 'Amoxicilina 250mg/5mL', tag: 'Pediátrico' },
  { id: 3, nome: 'Novalgina Gotas', tag: 'Gotas' },
  { id: 4, nome: 'Dipirona 500mg', tag: 'Oral' },
  { id: 5, nome: 'Cozaar 50mg (Losartana)', tag: 'Anti-hipertensivo' },
  { id: 7, nome: 'Renitec 10mg (Enalapril)', tag: 'IECA' },
  { id: 8, nome: 'Losec 20mg (Omeprazol)', tag: 'IBP' },
  { id: 9, nome: 'Zitromax 500mg (Azitromicina)', tag: 'Macrolídeo' },
  { id: 10, nome: 'Levophed 2mg/mL (Noradrenalina)', tag: 'UTI / IV' },
  { id: 11, nome: 'Rocefin 1g (Ceftriaxona)', tag: 'Injetável IV' },
  { id: 12, nome: 'Glifage XR 500mg (Metformina)', tag: 'Antidiabético' },
  { id: 13, nome: 'Zocor 20mg (Sinvastatina)', tag: 'Estatina' },
];

export const DrugDetail: React.FC<DrugDetailProps> = ({
  detalhe,
  onAbrirCalculadoraPediatrica,
  onSelecionarMedicamento,
}) => {
  const [abaAtiva, setAbaAtiva] = useState<'posologia' | 'apresentacoes' | 'renal_gestacao' | 'diluicao'>('posologia');
  const [copiado, setCopiado] = useState(false);

  const { medicamento, principio_ativo, bula } = detalhe;

  // Parser dos JSONs estruturados da bula
  let ajustesRenais: FaixaAjusteRenal[] = [];
  if (bula?.ajuste_funcao_renal_json) {
    try {
      ajustesRenais = JSON.parse(bula.ajuste_funcao_renal_json);
    } catch {
      ajustesRenais = [];
    }
  }

  let guiaDiluicao: GuiaDiluicao | null = null;
  if (bula?.guia_diluicao_injetavel_json) {
    try {
      guiaDiluicao = JSON.parse(bula.guia_diluicao_injetavel_json);
    } catch {
      guiaDiluicao = null;
    }
  }

  const copiarPrescricaoAdulto = () => {
    const texto = `RECEITUÁRIO MÉDICO
${medicamento.nome_comercial} (${principio_ativo.nome_dcb}) - ${medicamento.apresentacao_comercial}
Posologia: ${bula?.posologia_adulto_padrao || 'Conforme orientação médica.'}
Receituário: ${medicamento.tipo_receituario.toUpperCase()}`;

    navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const getCorGestacao = (cat: string) => {
    switch (cat) {
      case 'A': return 'bg-emerald-900/60 text-emerald-300 border-emerald-600/60';
      case 'B': return 'bg-teal-900/60 text-teal-300 border-teal-600/60';
      case 'C': return 'bg-yellow-900/60 text-yellow-300 border-yellow-600/60';
      case 'D': return 'bg-amber-900/60 text-amber-300 border-amber-600/60';
      case 'X': return 'bg-rose-900/60 text-rose-300 border-rose-600/60';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden space-y-0">
      {/* Seletor Rápido de Fármacos RENAME */}
      {onSelecionarMedicamento && (
        <div className="bg-slate-950/80 px-6 py-3 border-b border-slate-800 flex items-center space-x-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-2">
            Fármacos Rápidos:
          </span>
          {FARMACOS_DISPONIVEIS.map((f) => {
            const ativo = f.id === medicamento.id_medicamento;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => onSelecionarMedicamento(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                  ativo
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-950/40 ring-1 ring-white/20'
                    : 'bg-slate-850/80 border border-slate-750 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{f.nome}</span>
                <span className={`text-[10px] px-1 rounded ${ativo ? 'bg-black/20 text-teal-100' : 'bg-slate-800 text-slate-400'}`}>
                  {f.tag}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Cabeçalho do Fármaco */}
      <div className="p-6 bg-slate-850 border-b border-slate-800">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-slate-100">{medicamento.nome_comercial}</h2>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-mono border border-slate-700">
                {principio_ativo.nome_dcb}
              </span>
            </div>
            <p className="text-xs text-slate-400">{principio_ativo.classe_terapeutica}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copiarPrescricaoAdulto}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all shadow"
            >
              {copiado ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-teal-400" />}
              <span>{copiado ? 'Prescrição Copiada!' : 'Copiar Prescrição'}</span>
            </button>
          </div>
        </div>

        {/* Badges Regulatórios e Clínicos */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-800/80">
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getCorGestacao(principio_ativo.categoria_risco_gestacao)}`}>
            Gestação Risco {principio_ativo.categoria_risco_gestacao}
          </span>

          <span className="text-[11px] font-medium bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700">
            Lactação: {principio_ativo.compatibilidade_aleitamento}
          </span>

          {principio_ativo.disponivel_rename_sus === 1 && (
            <span className="text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-700/60 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              RENAME SUS ({principio_ativo.componente_sus})
            </span>
          )}

          <span className="text-[11px] font-mono bg-indigo-950/70 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-700/50">
            Receituário: {medicamento.tipo_receituario.toUpperCase()}
          </span>

          <span className="text-[11px] font-mono text-slate-400 ml-auto">
            ANVISA: {medicamento.numero_registro_anvisa}
          </span>
        </div>
      </div>

      {/* Navegação por Abas */}
      <div className="flex border-b border-slate-800 bg-slate-900 px-6">
        {[
          { id: 'posologia', label: 'Posologia Rápida', icon: Clock },
          { id: 'apresentacoes', label: 'Apresentações & Preço', icon: DollarSign },
          { id: 'renal_gestacao', label: 'Ajuste Renal & Gestação', icon: Shield },
          { id: 'diluicao', label: 'Guia de Diluição', icon: Droplets },
        ].map((aba) => {
          const Icone = aba.icon;
          const ativa = abaAtiva === aba.id;
          return (
            <button
              key={aba.id}
              onClick={() => setAbaAtiva(aba.id as any)}
              className={`flex items-center space-x-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
                ativa
                  ? 'border-teal-500 text-teal-400 bg-slate-850/50'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icone className="w-4 h-4" />
              <span>{aba.label}</span>
            </button>
          );
        })}
      </div>

      {/* Conteúdo da Aba */}
      <div className="p-6">
        {abaAtiva === 'posologia' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4" /> Indicações Clínicas Aprovadas
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                {bula?.indicacoes_clinicas || 'Sem indicações clínicas registradas.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-teal-400" /> Posologia Adulto Padrão
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {bula?.posologia_adulto_padrao || 'Consulte orientação médica.'}
                </p>
                {bula?.dose_maxima_diaria_mg && (
                  <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                    Teto Diário: <strong className="text-slate-200">{bula.dose_maxima_diaria_mg} mg/dia</strong>
                  </div>
                )}
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Pill className="w-4 h-4 text-sky-400" /> Posologia Pediátrica
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1">
                    {bula?.posologia_pediatrica_padrao || 'Uso pediátrico sob avaliação médica ou não aplicável.'}
                  </p>
                  {bula?.dose_pediatrica_mg_kg_dia_min && (
                    <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                      Faixa: <strong className="text-slate-200">{bula.dose_pediatrica_mg_kg_dia_min} a {bula.dose_pediatrica_mg_kg_dia_max} mg/kg/dia</strong>
                    </div>
                  )}
                </div>

                {bula?.dose_pediatrica_mg_kg_dia_min && (
                  <button
                    onClick={() =>
                      onAbrirCalculadoraPediatrica(
                        medicamento.nome_comercial,
                        bula.dose_pediatrica_mg_kg_dia_min ?? 50,
                        medicamento.concentracao_valor,
                        bula.dose_maxima_diaria_mg ?? 3000
                      )
                    }
                    className="w-full mt-3 py-2 bg-teal-600/90 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold transition-all shadow"
                  >
                    Abrir Calculadora Pediátrica
                  </button>
                )}
              </div>
            </div>

            <div className="bg-rose-950/30 border border-rose-900/60 p-4 rounded-xl space-y-1">
              <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" /> Contraindicações e Advertências Críticas
              </span>
              <p className="text-xs text-rose-200/90 leading-relaxed">
                {bula?.contraindicacoes || 'Sem contraindicações registradas.'}
              </p>
            </div>
          </div>
        )}

        {abaAtiva === 'apresentacoes' && (
          <div className="space-y-4">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-400">Laboratório Fabricante</div>
                <div className="text-sm font-bold text-slate-200 flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-4 h-4 text-teal-400" /> {medicamento.laboratorio_fabricante}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-slate-400">Preço Máximo Consumidor (CMED)</div>
                <div className="text-lg font-mono font-bold text-emerald-400 mt-0.5">
                  R$ {medicamento.preco_maximo_consumidor.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-slate-400">Descrição da Apresentação</div>
              <p className="text-xs text-slate-200 font-mono">{medicamento.apresentacao_comercial}</p>
              <div className="flex gap-4 pt-2 text-xs text-slate-400">
                <span>Concentração: <strong className="text-slate-200">{medicamento.concentracao_valor} {medicamento.concentracao_unidade}</strong></span>
                <span>Forma: <strong className="text-slate-200">{medicamento.forma_farmaceutica}</strong></span>
              </div>
            </div>
          </div>
        )}

        {abaAtiva === 'renal_gestacao' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                Ajuste de Dose por Taxa de Filtração Glomerular (TFG)
              </h4>
              {ajustesRenais.length > 0 ? (
                <div className="overflow-x-auto border border-slate-800 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-850 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-4 font-semibold">Faixa de TFG (mL/min)</th>
                        <th className="py-2.5 px-4 font-semibold">Posologia Recomendada</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {ajustesRenais.map((faixa, idx) => (
                        <tr key={idx} className="hover:bg-slate-850/40">
                          <td className="py-3 px-4 text-teal-400 font-bold whitespace-nowrap">
                            {faixa.tfg_min} a {faixa.tfg_max} mL/min
                          </td>
                          <td className="py-3 px-4 text-slate-300 font-sans">
                            {faixa.posologia_recomendada}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs text-slate-400">
                  {bula?.ajuste_funcao_renal_json || 'Não há necessidade de ajuste de dose para insuficiência renal leve a moderada documentada em bula.'}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-slate-300">Ajuste Hepático:</span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {bula?.ajuste_funcao_hepatica || 'Sem recomendações de redução inicial.'}
                </p>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-slate-300">Aleitamento Materno:</span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Classificação: <strong className="text-teal-400">{principio_ativo.compatibilidade_aleitamento}</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

        {abaAtiva === 'diluicao' && (
          <div className="space-y-4">
            {guiaDiluicao ? (
              <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800 space-y-4 text-xs">
                <div>
                  <span className="font-bold text-teal-400 uppercase tracking-wider text-[11px]">Diluentes Compatíveis:</span>
                  <p className="text-slate-200 mt-1">{guiaDiluicao.diluente_compativel}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                  <div>
                    <span className="font-bold text-slate-400">Volume Recomendado:</span>
                    <p className="text-slate-200 mt-0.5">{guiaDiluicao.volume_recomendado_ml}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400">Estabilidade da Solução:</span>
                    <p className="text-slate-200 mt-0.5">{guiaDiluicao.estabilidade_horas} horas</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <span className="font-bold text-slate-400">Via e Tempo de Infusão:</span>
                  <p className="text-slate-200 mt-0.5">{guiaDiluicao.tempo_infusao}</p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/60 p-8 rounded-xl border border-slate-800 text-center text-slate-400 text-xs">
                Este medicamento é de uso oral / tópico e não requer guia de diluição parenteral intravenosa.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
