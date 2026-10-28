import React, { useEffect, useMemo, useState } from 'react';
import { AlertOctagon, AlertTriangle, BookMarked, Info, Plus, Search, X } from 'lucide-react';
import type { MonografiaFtn } from '../data/formulario_terapeutico';
import { capitalizar, carregarFormulario, cruzarInteracoesFtn, filtrarMonografias, rotuloConduta } from '../formulario_utils';
import { LinkMedicamento } from './LinkMedicamento';

/** Verificador de interações sobre as seções "Interações de medicamentos" das 346 monografias do FTN 2010. */
export const FtnInteractionChecker: React.FC = () => {
  const [monografias, setMonografias] = useState<MonografiaFtn[]>([]);
  const [erroCarga, setErroCarga] = useState<string | null>(null);
  const [termo, setTermo] = useState('');
  const [selecionadas, setSelecionadas] = useState<MonografiaFtn[]>([]);

  useEffect(() => {
    carregarFormulario()
      .then((modulo) => {
        setMonografias(modulo.MONOGRAFIAS_FTN);
        // Exemplo inicial com interação conhecida no FTN
        const exemplo = ['varfarina sódica', 'ácido acetilsalicílico']
          .map((nome) => modulo.MONOGRAFIAS_FTN.find((m) => m.nome === nome))
          .filter((m): m is MonografiaFtn => Boolean(m));
        setSelecionadas(exemplo);
      })
      .catch((e) => setErroCarga(e instanceof Error ? e.message : String(e)));
  }, []);

  const sugestoes = useMemo(
    () =>
      termo.trim()
        ? filtrarMonografias(monografias, termo)
            .filter((m) => !selecionadas.some((s) => s.id_monografia === m.id_monografia))
            .slice(0, 8)
        : [],
    [monografias, termo, selecionadas]
  );

  const interacoes = useMemo(() => cruzarInteracoesFtn(selecionadas), [selecionadas]);

  const adicionar = (m: MonografiaFtn) => {
    setSelecionadas((atuais) => [...atuais, m]);
    setTermo('');
  };

  if (erroCarga) {
    return (
      <div role="alert" className="p-4 bg-rose-950/50 border border-rose-700/60 rounded-2xl text-sm text-rose-200">
        Não foi possível carregar o Formulário Terapêutico: {erroCarga}
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
        <div className="p-2.5 bg-teal-500/10 text-teal-400 rounded-xl">
          <BookMarked className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-100">Interações pelo Formulário Terapêutico Nacional</h3>
          <p className="text-xs text-slate-400">
            Cruza todos os pares entre os medicamentos escolhidos usando as {monografias.reduce((t, m) => t + m.interacoes.length, 0).toLocaleString('pt-BR')} interações descritas nas monografias do FTN 2010.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {selecionadas.map((m) => (
            <button
              key={m.id_monografia}
              onClick={() => setSelecionadas((atuais) => atuais.filter((s) => s.id_monografia !== m.id_monografia))}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border bg-teal-600/90 border-teal-500 text-white"
              aria-label={`Remover ${m.nome}`}
            >
              {capitalizar(m.nome)}
              <X className="w-3.5 h-3.5 opacity-70" />
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-teal-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            placeholder="Adicionar medicamento (ex.: varfarina, amiodarona, fluconazol)..."
            aria-label="Adicionar medicamento à verificação"
            className="w-full rounded-xl border pl-9 pr-4 py-2 text-xs"
          />
          {sugestoes.length > 0 && (
            <div className="absolute z-20 mt-1 w-full bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
              {sugestoes.map((m) => (
                <button
                  key={m.id_monografia}
                  onClick={() => adicionar(m)}
                  className="w-full flex items-center justify-between px-3 py-2 text-left text-xs text-slate-200 hover:bg-slate-800"
                >
                  <span>{capitalizar(m.nome)}</span>
                  <Plus className="w-3.5 h-3.5 text-teal-400" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {selecionadas.length < 2 && (
        <div className="bg-slate-950/60 border border-dashed border-slate-800 rounded-xl p-6 text-center text-slate-400 text-sm">
          Adicione 2 ou mais medicamentos para cruzar as interações.
        </div>
      )}

      {selecionadas.length >= 2 && interacoes.length === 0 && (
        <div className="bg-slate-950/60 border border-slate-700 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-300">
          <Info className="w-5 h-5 text-sky-400 flex-shrink-0" />
          <span>
            O FTN não descreve interação entre esses medicamentos. Isso não descarta interação: o FTN cita fármacos
            individualmente e às vezes por classe (ex.: "anticoagulantes"); confira as interações completas de cada
            monografia na tela do formulário.
          </span>
        </div>
      )}

      {interacoes.length > 0 && (
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            {interacoes.length} {interacoes.length === 1 ? 'interação descrita' : 'interações descritas'} no FTN
          </div>
          {interacoes.map((item, indice) => {
            const conduta = rotuloConduta(item.texto);
            const estilo =
              conduta.nivel === 'evitar'
                ? 'bg-rose-950/40 border-rose-600/70'
                : conduta.nivel === 'ajustar'
                ? 'bg-amber-950/40 border-amber-600/70'
                : 'bg-slate-800/60 border-slate-700';
            return (
              <div key={indice} className={`rounded-2xl p-4 border ${estilo} space-y-2`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
                    {conduta.nivel === 'evitar' ? (
                      <AlertOctagon className="w-5 h-5 text-rose-400" />
                    ) : conduta.nivel === 'ajustar' ? (
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                    ) : (
                      <Info className="w-5 h-5 text-sky-400" />
                    )}
                    <LinkMedicamento nome={item.origem.nome}>{capitalizar(item.origem.nome)}</LinkMedicamento> &times;{' '}
                    <LinkMedicamento nome={item.alvo.nome}>{capitalizar(item.alvo.nome)}</LinkMedicamento>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/80 text-slate-200 border border-slate-700">
                    {conduta.rotulo}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{item.texto}</p>
                <p className="text-[10px] text-slate-500">
                  Monografia de {item.origem.nome} (FTN 2010, p. {item.origem.pagina}), item "{item.farmacoCitado}".
                </p>
              </div>
            );
          })}
          <p className="text-[10px] text-slate-500">
            O FTN não classifica a gravidade; o rótulo acima é deduzido de palavras do próprio texto ("evitar", "ajustar").
          </p>
        </div>
      )}
    </div>
  );
};
