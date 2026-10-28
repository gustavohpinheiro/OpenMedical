import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertOctagon, AlertTriangle, Info, Plus, X } from 'lucide-react';
import { MatrizInteracao } from '../types';
import { verificarInteracoes } from '../api';
import { FtnInteractionChecker } from './FtnInteractionChecker';
import { LinkMedicamento } from './LinkMedicamento';

const LISTA_FARMACOS = [
  { id: 1, nome: 'Amoxicilina' },
  { id: 2, nome: 'Dipirona Monoidratada' },
  { id: 3, nome: 'Losartana Potássica' },
  { id: 4, nome: 'Maleato de Enalapril' },
  { id: 5, nome: 'Omeprazol' },
  { id: 6, nome: 'Azitromicina' },
  { id: 7, nome: 'Noradrenalina' },
  { id: 8, nome: 'Ceftriaxona Sódica' },
  { id: 9, nome: 'Cloridrato de Metformina' },
  { id: 10, nome: 'Sinvastatina' },
];

export const InteractionChecker: React.FC = () => {
  const [selecionados, setSelecionados] = useState<number[]>([3, 4]); // Padrão: Losartana + Enalapril (duplo bloqueio SRAA)
  const [interacoes, setInteracoes] = useState<MatrizInteracao[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erroConsulta, setErroConsulta] = useState<string | null>(null);

  useEffect(() => {
    if (selecionados.length >= 2) {
      setCarregando(true);
      setErroConsulta(null);
      verificarInteracoes(selecionados)
        .then(setInteracoes)
        .catch((e) => {
          setInteracoes([]);
          setErroConsulta(e instanceof Error ? e.message : String(e));
        })
        .finally(() => setCarregando(false));
    } else {
      setInteracoes([]);
    }
  }, [selecionados]);

  const alternarFarmaco = (id: number) => {
    setSelecionados((atuais) =>
      atuais.includes(id) ? atuais.filter((item) => item !== id) : [...atuais, id]
    );
  };

  return (
    <div className="space-y-6">
    <FtnInteractionChecker />
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Interações com gravidade classificada (base local)</h3>
            <p className="text-xs text-slate-400">
              Todos os pares dos fármacos selecionados, ordenados por gravidade. Base de demonstração: 10 princípios ativos e
              5 interações cadastradas.
            </p>
          </div>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          {selecionados.length} selecionados
        </div>
      </div>

      {/* Seletor Dinâmico de Fármacos em Chips */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Adicionar / Remover Fármacos da Prescrição:
        </label>
        <div className="flex flex-wrap gap-2">
          {LISTA_FARMACOS.map((f) => {
            const ativo = selecionados.includes(f.id);
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => alternarFarmaco(f.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
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
      </div>

      {/* Status e Resultados */}
      {selecionados.length < 2 && (
        <div className="bg-slate-950/60 border border-dashed border-slate-800 rounded-xl p-8 text-center text-slate-400 text-sm">
          Selecione 2 ou mais medicamentos para avaliar potenciais interações farmacológicas.
        </div>
      )}

      {erroConsulta && (
        <div className="bg-red-950/50 border border-red-600/60 rounded-xl p-4 text-xs text-red-200">
          <p className="font-bold text-red-300">Não foi possível verificar as interações.</p>
          <p className="mt-0.5">{erroConsulta}</p>
        </div>
      )}

      {selecionados.length >= 2 && !carregando && !erroConsulta && interacoes.length === 0 && (
        <div className="bg-slate-950/60 border border-slate-700 rounded-xl p-5 flex items-center space-x-3 text-slate-200">
          <Info className="w-6 h-6 text-sky-400 flex-shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-slate-100 text-sm">Nenhuma interação cadastrada para esta combinação</p>
            <p className="text-slate-300 mt-0.5">A base atual cataloga apenas um conjunto reduzido de interações (curadoria inicial, sem revisão clínica formal). A ausência de alerta NÃO descarta interação: confirme em fonte de referência.</p>
          </div>
        </div>
      )}

      {interacoes.length > 0 && (
        <div className="space-y-4">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            {interacoes.length} {interacoes.length === 1 ? 'Interação Identificada' : 'Interações Identificadas'}:
          </div>

          <div className="space-y-3">
            {interacoes.map((item) => {
              const eContraindicada = item.gravidade_interacao === 'Contraindicada';
              const eGrave = item.gravidade_interacao === 'Grave';
              const eModerada = item.gravidade_interacao === 'Moderada';

              return (
                <div
                  key={item.id_interacao}
                  className={`rounded-2xl p-5 border transition-all ${
                    eContraindicada
                      ? 'bg-rose-950/40 border-rose-600/70 shadow-lg shadow-rose-950/30'
                      : eGrave
                      ? 'bg-amber-950/40 border-amber-600/70 shadow-lg shadow-amber-950/30'
                      : eModerada
                      ? 'bg-yellow-950/30 border-yellow-600/60'
                      : 'bg-slate-800/60 border-slate-700'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-3">
                    <div className="flex items-center space-x-2">
                      {eContraindicada ? (
                        <AlertOctagon className="w-5 h-5 text-rose-400 flex-shrink-0" />
                      ) : eGrave ? (
                        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                      ) : (
                        <Info className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                      )}
                      <span className="font-bold text-slate-100 text-sm">
                        {item.nome_principio_a ? <LinkMedicamento nome={item.nome_principio_a} /> : 'Princípio A'} &times;{' '}
                        {item.nome_principio_b ? <LinkMedicamento nome={item.nome_principio_b} /> : 'Princípio B'}
                      </span>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        eContraindicada
                          ? 'bg-rose-500 text-white'
                          : eGrave
                          ? 'bg-amber-500 text-slate-950'
                          : eModerada
                          ? 'bg-yellow-500 text-slate-950'
                          : 'bg-slate-700 text-slate-200'
                      }`}
                    >
                      {item.gravidade_interacao}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-semibold text-slate-300">Efeito Clínico / Mecanismo:</span>
                      <p className="text-slate-300 mt-0.5 leading-relaxed">{item.efeito_clinico}</p>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="font-semibold text-teal-400">Conduta Médica Recomendada:</span>
                      <p className="text-slate-200 mt-0.5 leading-relaxed">{item.conduta_recomendada}</p>
                    </div>
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
