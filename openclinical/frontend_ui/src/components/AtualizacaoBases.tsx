import React, { useCallback, useEffect, useState } from 'react';
import { RefreshCw, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { aoAtualizarBases, atualizarBasesAgora, estadoAtualizacaoBases, isTauri } from '../api';
import type { EstadoFonteAtualizacao } from '../types';

/** "2026-10-28 12:47:19" (UTC, gravado pelo SQLite) -> data e hora locais */
const dataHoraLocal = (utc: string | null) => {
  if (!utc) return 'nunca';
  const data = new Date(`${utc.replace(' ', 'T')}Z`);
  return Number.isNaN(data.getTime()) ? utc : data.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
};

/** Situação do atualizador diário das bases oficiais (preços CMED, registros e índice de bulas da ANVISA). */
export const AtualizacaoBases: React.FC = () => {
  const [fontes, setFontes] = useState<EstadoFonteAtualizacao[]>([]);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const recarregar = useCallback(() => {
    estadoAtualizacaoBases()
      .then(setFontes)
      .catch((e) => setErro(e instanceof Error ? e.message : String(e)));
  }, []);

  useEffect(() => {
    recarregar();
    let cancelar: (() => void) | undefined;
    aoAtualizarBases(() => recarregar()).then((fn) => (cancelar = fn));
    return () => cancelar?.();
  }, [recarregar]);

  if (!isTauri()) {
    return (
      <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5" />
        No app desktop, preços da CMED, registros e o índice de bulas da ANVISA são atualizados automaticamente uma vez por
        dia. No navegador vale a amostra que acompanha esta versão.
      </p>
    );
  }

  const atualizarAgora = () => {
    setAtualizando(true);
    setErro(null);
    atualizarBasesAgora()
      .then(recarregar)
      .catch((e) => setErro(e instanceof Error ? e.message : String(e)))
      .finally(() => setAtualizando(false));
  };

  return (
    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
          Atualização diária das bases da ANVISA
        </span>
        <button
          type="button"
          onClick={atualizarAgora}
          disabled={atualizando}
          className="flex items-center gap-1.5 text-[11px] bg-slate-800 hover:bg-slate-700 disabled:opacity-60 border border-slate-700 text-slate-200 px-2.5 py-1 rounded-lg font-semibold"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${atualizando ? 'animate-spin' : ''}`} />
          {atualizando ? 'Verificando...' : 'Verificar agora'}
        </button>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {fontes.map((f) => (
          <li key={f.fonte} className="text-[11px] text-slate-400 leading-snug">
            <span className="flex items-center gap-1 text-slate-200 font-semibold">
              {f.situacao === 'erro' ? (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              )}
              {f.descricao}
            </span>
            Baixado em {dataHoraLocal(f.atualizado_em)}
            {f.registros !== null ? ` · ${f.registros.toLocaleString('pt-BR')} registros` : ''}
            <br />
            Última verificação: {dataHoraLocal(f.verificado_em)}
            {f.situacao === 'erro' && f.mensagem && <span className="block text-amber-300/90">{f.mensagem}</span>}
          </li>
        ))}
      </ul>
      {erro && <p className="text-[11px] text-rose-300">{erro}</p>}
    </div>
  );
};
