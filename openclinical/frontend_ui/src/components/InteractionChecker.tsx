import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  AlertOctagon,
  AlertTriangle,
  Info,
  Plus,
  X,
  Dna,
  Zap,
  Flame,
  Brain,
  Layers,
  FileText,
} from 'lucide-react';
import { MatrizInteracao, RelatorioSeguranca5g } from '../types';
import { verificarInteracoes, avaliarSegurancaMedicamentosa5g } from '../api';
import { FtnInteractionChecker } from './FtnInteractionChecker';
import { LinkMedicamento } from './LinkMedicamento';
import { obterBlocosPrescricao, obterPacienteAtivo } from '../storage_clinico';
import { MedicationAutocomplete } from './MedicationAutocomplete';

const LISTA_FARMACOS_SUGERIDOS: { chave: string; nome: string; idPrincipioAtivo: number | null }[] = [
  { chave: 'amoxicilina', nome: 'Amoxicilina', idPrincipioAtivo: 1 },
  { chave: 'dipirona', nome: 'Dipirona Monoidratada', idPrincipioAtivo: 2 },
  { chave: 'losartana', nome: 'Losartana Potássica', idPrincipioAtivo: 3 },
  { chave: 'enalapril', nome: 'Maleato de Enalapril', idPrincipioAtivo: 4 },
  { chave: 'omeprazol', nome: 'Omeprazol', idPrincipioAtivo: 5 },
  { chave: 'azitromicina', nome: 'Azitromicina', idPrincipioAtivo: 6 },
  { chave: 'norepinefrina', nome: 'Hemitartarato de Norepinefrina', idPrincipioAtivo: 7 },
  { chave: 'ceftriaxona', nome: 'Ceftriaxona Sódica', idPrincipioAtivo: 8 },
  { chave: 'metformina', nome: 'Cloridrato de Metformina', idPrincipioAtivo: 9 },
  { chave: 'sinvastatina', nome: 'Sinvastatina', idPrincipioAtivo: 10 },
  { chave: 'anlodipino', nome: 'Anlodipino', idPrincipioAtivo: null },
  { chave: 'furosemida', nome: 'Furosemida', idPrincipioAtivo: null },
  { chave: 'ibuprofeno', nome: 'Ibuprofeno', idPrincipioAtivo: null },
  { chave: 'amitriptilina', nome: 'Amitriptilina', idPrincipioAtivo: null },
  { chave: 'oxibutinina', nome: 'Oxibutinina', idPrincipioAtivo: null },
  { chave: 'ondansetrona', nome: 'Ondansetrona', idPrincipioAtivo: null },
  { chave: 'clopidogrel', nome: 'Clopidogrel', idPrincipioAtivo: null },
  { chave: 'alopurinol', nome: 'Alopurinol', idPrincipioAtivo: null },
  { chave: 'donepezila', nome: 'Donepezila', idPrincipioAtivo: null },
  { chave: 'metoclopramida', nome: 'Metoclopramida', idPrincipioAtivo: null },
];

export const InteractionChecker: React.FC = () => {
  // Nomes dos fármacos selecionados na lista para auditoria 5G
  const [nomesFarmacos, setNomesFarmacos] = useState<string[]>([
    'Losartana Potássica',
    'Furosemida',
    'Ibuprofeno',
  ]);
  const [novoTermo, setNovoTermo] = useState('');

  // Estados: Interações clássicas por par
  const [interacoes, setInteracoes] = useState<MatrizInteracao[]>([]);
  const [relatorio5g, setRelatorio5g] = useState<RelatorioSeguranca5g | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erroConsulta, setErroConsulta] = useState<string | null>(null);

  // Parâmetros do paciente para Escore de Tisdale
  const [idadePaciente, setIdadePaciente] = useState<number>(70);
  const [sexoFeminino, setSexoFeminino] = useState<boolean>(false);
  const [hipocalemia, setHipocalemia] = useState<boolean>(false);
  const [qtcBasalAlto, setQtcBasalAlto] = useState<boolean>(false);
  const [iamAgudo, setIamAgudo] = useState<boolean>(false);
  const [icOuSepse, setIcOuSepse] = useState<boolean>(false);

  useEffect(() => {
    if (nomesFarmacos.length >= 1) {
      setCarregando(true);
      setErroConsulta(null);

      // Avaliação de Segurança 5G
      avaliarSegurancaMedicamentosa5g(
        nomesFarmacos,
        idadePaciente,
        sexoFeminino,
        hipocalemia,
        qtcBasalAlto,
        iamAgudo,
        icOuSepse
      )
        .then(setRelatorio5g)
        .catch((e) => {
          console.error('Erro ao avaliar segurança 5G:', e);
        });

      // Mapeamento para IDs caso coincida com os 10 princípios ativos da matriz SQLite/demo
      const idsDemo = nomesFarmacos
        .map((nome) => {
          const achado = LISTA_FARMACOS_SUGERIDOS.find(
            (f) => f.nome.toLowerCase() === nome.toLowerCase()
          );
          return achado ? achado.idPrincipioAtivo : null;
        })
        .filter((id): id is number => id !== null);

      if (idsDemo.length >= 2) {
        verificarInteracoes(idsDemo)
          .then(setInteracoes)
          .catch((e) => {
            setInteracoes([]);
            setErroConsulta(e instanceof Error ? e.message : String(e));
          })
          .finally(() => setCarregando(false));
      } else {
        setInteracoes([]);
        setCarregando(false);
      }
    } else {
      setInteracoes([]);
      setRelatorio5g(null);
    }
  }, [nomesFarmacos, idadePaciente, sexoFeminino, hipocalemia, qtcBasalAlto, iamAgudo, icOuSepse]);

  const alternarFarmacoNome = (nome: string) => {
    setNomesFarmacos((atuais) =>
      atuais.includes(nome) ? atuais.filter((item) => item !== nome) : [...atuais, nome]
    );
  };

  const adicionarManual = (e?: React.FormEvent, nomeManual?: string) => {
    if (e) e.preventDefault();
    const termo = (nomeManual !== undefined ? nomeManual : novoTermo).trim();
    if (termo && !nomesFarmacos.includes(termo)) {
      setNomesFarmacos((prev) => [...prev, termo]);
      setNovoTermo('');
    }
  };

  const importarDaReceitaDigital = () => {
    const blocos = obterBlocosPrescricao();
    const medicamentos = blocos
      .filter((b) => b.tipo === 'medicamento' && b.ativo !== false)
      .map((b) => b.medicamento_detalhe?.principio_ativo || b.medicamento_detalhe?.nome_medicamento || b.titulo);

    if (medicamentos.length > 0) {
      setNomesFarmacos([...new Set(medicamentos)]);
    }

    const paciente = obterPacienteAtivo();
    if (paciente) {
      if (paciente.idade_anos) setIdadePaciente(paciente.idade_anos);
      if (paciente.sexo === 'F') setSexoFeminino(true);
      else if (paciente.sexo === 'M') setSexoFeminino(false);
    }
  };

  return (
    <div className="space-y-6">
      <FtnInteractionChecker />

      {/* PAINEL PRINCIPAL DE SEGURANÇA FARMACOLÓGICA 5G */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Auditoria de Segurança Farmacológica de 5ª Geração
                <span className="px-2 py-0.5 text-[10px] bg-rose-500/20 text-rose-300 font-mono rounded-md uppercase">
                  JAMA / Lancet / CPIC
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Detecção simultânea de Cascatas Iatrogênicas, Carga Anticolinérgica (ACB), Nefrotoxicidade Triple Whammy, Tisdale QTc e Farmacogenômica CPIC Nível A.
              </p>
            </div>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            {nomesFarmacos.length} fármacos na lista
          </div>
        </div>

        {/* Adição Dinâmica de Fármacos */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <form onSubmit={adicionarManual} className="flex gap-2">
              <MedicationAutocomplete
                placeholder="Digitar fármaco (ex: Ciprofloxacino, Varfarina...)"
                value={novoTermo}
                onChange={(val) => setNovoTermo(val)}
                onSelect={(sugestao) => {
                  adicionarManual(undefined, sugestao.nome);
                }}
                className="w-64"
                inputClassName="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:border-teal-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar
              </button>
            </form>

            <button
              type="button"
              onClick={importarDaReceitaDigital}
              className="px-3 py-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-teal-950/40 transition"
              title="Carregar todos os medicamentos da Receita Digital Ativa e dados do paciente"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Carregar da Receita Digital</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {LISTA_FARMACOS_SUGERIDOS.map((f) => {
              const ativo = nomesFarmacos.includes(f.nome);
              return (
                <button
                  key={f.chave}
                  type="button"
                  onClick={() => alternarFarmacoNome(f.nome)}
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-medium border transition-all ${
                    ativo
                      ? 'bg-teal-600/90 border-teal-500 text-white shadow-md shadow-teal-950/40'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750 hover:text-white'
                  }`}
                >
                  <span>{f.nome}</span>
                  {ativo ? <X className="w-3.5 h-3.5 ml-1 opacity-70" /> : <Plus className="w-3.5 h-3.5 ml-1 opacity-70" />}
                </button>
              );
            })}
          </div>

          {/* Chips dos fármacos ativos selecionados */}
          {nomesFarmacos.length > 0 && (
            <div className="pt-2 flex flex-wrap gap-1.5 items-center">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mr-1">
                Prescrição Atual:
              </span>
              {nomesFarmacos.map((nome) => (
                <span
                  key={nome}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-xs font-mono"
                >
                  {nome}
                  <button
                    onClick={() => alternarFarmacoNome(nome)}
                    className="hover:text-rose-400 text-slate-400 ml-1"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* SEÇÃO 1: ALERTA CRÍTICO TRIPLE WHAMMY RENAL */}
        {relatorio5g?.triple_whammy.detectado && (
          <div className="bg-rose-950/60 border-2 border-rose-500 rounded-2xl p-5 space-y-3 shadow-xl shadow-rose-950/50 animate-pulse-once">
            <div className="flex items-center gap-2.5 text-rose-300">
              <Flame className="w-6 h-6 text-rose-400 flex-shrink-0" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-rose-100">
                Alerta Crítico: Combinação "Triple Whammy" Renal Detectada
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-rose-900/60">
                <span className="text-slate-400 font-semibold">1. Vasodilatador Eferente:</span>
                <p className="font-bold text-rose-200 mt-0.5">{relatorio5g.triple_whammy.vasodilatador_eferente_ieca_bra}</p>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-rose-900/60">
                <span className="text-slate-400 font-semibold">2. Depletor Volêmico:</span>
                <p className="font-bold text-rose-200 mt-0.5">{relatorio5g.triple_whammy.depletor_volume_diuretico}</p>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-rose-900/60">
                <span className="text-slate-400 font-semibold">3. Vasoconstritor Aferente:</span>
                <p className="font-bold text-rose-200 mt-0.5">{relatorio5g.triple_whammy.vasoconstritor_aferente_aine}</p>
              </div>
            </div>
            <p className="text-xs text-rose-200 leading-relaxed">
              {relatorio5g.triple_whammy.mecanismo_fisiopatologico}
            </p>
            <div className="bg-slate-950/80 p-3 rounded-xl border border-rose-800/80 text-xs text-amber-200">
              <strong>Conduta Recomendada:</strong> {relatorio5g.triple_whammy.recomendacao_clinica}
            </div>
          </div>
        )}

        {/* SEÇÃO 2: DETECTOR DE CASCATAS DE PRESCRIÇÃO IATROGÊNICAS (JAMA) */}
        {relatorio5g && relatorio5g.cascatas.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              {relatorio5g.cascatas.length} Cascata(s) Iatrogênica(s) de Prescrição Detectada(s) (JAMA)
            </div>
            <div className="space-y-2.5">
              {relatorio5g.cascatas.map((c, idx) => (
                <div
                  key={idx}
                  className="bg-amber-950/30 border border-amber-600/60 rounded-xl p-4 text-xs space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-900/60 pb-2">
                    <span className="font-bold text-amber-200 text-sm">
                      {c.farmaco_causador} &rarr; {c.farmaco_prescrito}
                    </span>
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 font-semibold rounded text-[11px]">
                      Cascata Prescritiva
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-300">Efeito Adverso Confundido:</span>
                    <p className="text-slate-300 mt-0.5">{c.efeito_adverso_confundido}</p>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-teal-300">
                    <strong className="text-teal-400">Conduta de Desprescrição:</strong> {c.conduta_desprescricao}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEÇÃO 3: CARGA ANTICOLINÉRGICA (ACB SCORE) */}
        {relatorio5g && relatorio5g.carga_anticolinergica.pontuacao_total > 0 && (
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
                <Brain className="w-4 h-4" />
                Carga Anticolinérgica Cumulativa (ACB Score)
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                  relatorio5g.carga_anticolinergica.pontuacao_total >= 3
                    ? 'bg-rose-500 text-white'
                    : relatorio5g.carga_anticolinergica.pontuacao_total === 2
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-emerald-500/20 text-emerald-300'
                }`}
              >
                Score ACB: {relatorio5g.carga_anticolinergica.pontuacao_total} pontos
              </span>
            </div>

            <p className="text-xs text-slate-300">
              {relatorio5g.carga_anticolinergica.classificacao_risco}
            </p>

            <div className="flex flex-wrap gap-2">
              {relatorio5g.carga_anticolinergica.itens.map((it, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-300"
                >
                  {it.medicamento}: <strong>+{it.pontuacao_acb} pts</strong>
                </span>
              ))}
            </div>

            {relatorio5g.carga_anticolinergica.sugestoes_desprescricao.length > 0 && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 text-xs space-y-1 text-slate-300">
                <strong className="text-indigo-300 block mb-1">Sugestões de Desprescrição em Idosos:</strong>
                {relatorio5g.carga_anticolinergica.sugestoes_desprescricao.map((sug, i) => (
                  <p key={i}>&bull; {sug}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SEÇÃO 4: ESCORE DE TISDALE (RISCO DE PROLONGAMENTO QTC) */}
        {relatorio5g && relatorio5g.escore_tisdale.farmacos_qtc_presentes.length > 0 && (
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400">
                <Zap className="w-4 h-4" />
                Escore de Tisdale para Prolongamento de QTc
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                  relatorio5g.escore_tisdale.pontuacao_total >= 11
                    ? 'bg-rose-500 text-white'
                    : relatorio5g.escore_tisdale.pontuacao_total >= 7
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-emerald-500/20 text-emerald-300'
                }`}
              >
                Tisdale: {relatorio5g.escore_tisdale.pontuacao_total} pts ({relatorio5g.escore_tisdale.categoria_risco})
              </span>
            </div>

            <div className="text-xs text-slate-400 space-y-1">
              <p>
                <strong>Fármacos QTc presentes:</strong>{' '}
                {relatorio5g.escore_tisdale.farmacos_qtc_presentes.join(', ')}
              </p>
              <p>
                <strong>Risco predito de QTc &gt; 500 ms / TdP:</strong>{' '}
                {relatorio5g.escore_tisdale.risco_estimado_percentual}
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg text-xs text-slate-300">
              <strong className="text-sky-300">Recomendação de Monitorização:</strong>{' '}
              {relatorio5g.escore_tisdale.recomendacao_monitorizacao}
            </div>
          </div>
        )}

        {/* SEÇÃO 5: FARMACOGENÔMICA CPIC NÍVEL A */}
        {relatorio5g && relatorio5g.farmacogenomica.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
              <Dna className="w-4 h-4" />
              Alertas de Farmacogenômica (CPIC Nível A / Medicina de Precisão)
            </div>
            <div className="space-y-2">
              {relatorio5g.farmacogenomica.map((cp, idx) => (
                <div
                  key={idx}
                  className="bg-teal-950/30 border border-teal-700/60 rounded-xl p-3.5 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between border-b border-teal-900/50 pb-1.5">
                    <span className="font-bold text-teal-200">
                      {cp.medicamento} &mdash; Gene <span className="font-mono text-white">{cp.gene}</span>
                    </span>
                    <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded">
                      {cp.nivel_evidencia_cpic}
                    </span>
                  </div>
                  <p className="text-slate-300">{cp.alerta_clinico}</p>
                  <div className="bg-slate-900/80 p-2 rounded text-slate-200">
                    <strong className="text-teal-400">Recomendação Clínica:</strong> {cp.recomendacao}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEÇÃO 6: INTERAÇÕES POR PAR (BASE LOCAL) */}
        {interacoes.length > 0 && (
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              {interacoes.length} Interação(ões) por Par Cataloga(s):
            </div>
            <div className="space-y-2.5">
              {interacoes.map((item) => {
                const eContraindicada = item.gravidade_interacao === 'Contraindicada';
                const eGrave = item.gravidade_interacao === 'Grave';
                const eModerada = item.gravidade_interacao === 'Moderada';

                return (
                  <div
                    key={item.id_interacao}
                    className={`rounded-2xl p-4 border text-xs space-y-2 ${
                      eContraindicada
                        ? 'bg-rose-950/40 border-rose-600/70'
                        : eGrave
                        ? 'bg-amber-950/40 border-amber-600/70'
                        : eModerada
                        ? 'bg-yellow-950/30 border-yellow-600/60'
                        : 'bg-slate-800/60 border-slate-700'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                      <div className="flex items-center space-x-2">
                        {eContraindicada ? (
                          <AlertOctagon className="w-4 h-4 text-rose-400" />
                        ) : eGrave ? (
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Info className="w-4 h-4 text-yellow-400" />
                        )}
                        <span className="font-bold text-slate-100">
                          {item.nome_principio_a ? <LinkMedicamento nome={item.nome_principio_a} /> : 'Princípio A'} &times;{' '}
                          {item.nome_principio_b ? <LinkMedicamento nome={item.nome_principio_b} /> : 'Princípio B'}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-rose-500 text-white">
                        {item.gravidade_interacao}
                      </span>
                    </div>
                    <p className="text-slate-300">{item.efeito_clinico}</p>
                    <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-teal-200">
                      <strong>Conduta:</strong> {item.conduta_recomendada}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
