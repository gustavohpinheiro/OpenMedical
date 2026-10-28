import React, { useEffect, useState } from 'react';
import { BookOpen, ExternalLink, FileText, AlertTriangle } from 'lucide-react';
import type { ItemRename2024, MonografiaFtn } from '../data/formulario_terapeutico';
import { carregarFormulario, capitalizar } from '../formulario_utils';
import { itensRenameDoPrincipio, monografiasDoProduto, urlBularioAnvisa } from '../ligacao_ftn';
import { consultarBulaAnvisa, isTauri } from '../api';
import type { BulaAnvisaIndice } from '../types';

const LIMITE_ESQUEMAS = 4;

/** Link para a bula oficial do produto no Bulário Eletrônico da ANVISA. */
export const BotaoBulaAnvisa: React.FC<{ numeroRegistro: string; nomeProduto: string; compacto?: boolean }> = ({
  numeroRegistro,
  nomeProduto,
  compacto,
}) => (
  <a
    href={urlBularioAnvisa(numeroRegistro, nomeProduto)}
    target="_blank"
    rel="noopener noreferrer"
    title="Abre o Bulário Eletrônico da ANVISA (requer internet)"
    className={
      compacto
        ? 'inline-flex items-center gap-1 text-[11px] text-sky-300 hover:text-sky-200 font-semibold'
        : 'flex items-center gap-2 bg-sky-950/70 hover:bg-sky-900 border border-sky-600/50 text-sky-300 hover:text-white px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex-shrink-0'
    }
  >
    <FileText className={compacto ? 'w-3.5 h-3.5' : 'w-4 h-4 text-sky-400'} />
    <span>{compacto ? 'Bula' : 'Bula oficial (ANVISA)'}</span>
    {!compacto && <ExternalLink className="w-3 h-3 opacity-70" />}
  </a>
);

const dataBr = (iso: string) => (/^\d{4}-\d{2}-\d{2}$/.test(iso) ? iso.split('-').reverse().join('/') : iso);

/**
 * Bula vigente do produto segundo o índice oficial do Bulário Eletrônico (dados abertos da ANVISA, atualizado
 * diariamente no app desktop). No navegador o índice não vem empacotado e nada é exibido.
 */
export const BulaVigenteAnvisa: React.FC<{ numeroRegistro: string }> = ({ numeroRegistro }) => {
  const [estado, setEstado] = useState<{ registro: string; bula: BulaAnvisaIndice | null } | null>(null);

  useEffect(() => {
    let cancelado = false;
    if (!isTauri()) return;
    consultarBulaAnvisa(numeroRegistro)
      .then((bula) => !cancelado && setEstado({ registro: numeroRegistro, bula }))
      .catch(() => !cancelado && setEstado(null));
    return () => {
      cancelado = true;
    };
  }, [numeroRegistro]);

  if (!estado || estado.registro !== numeroRegistro) return null;
  if (!estado.bula) {
    return (
      <p className="text-[11px] text-slate-500">
        Registro sem bula no índice oficial do Bulário (produtos novos, de uso hospitalar ou com registro cancelado).
      </p>
    );
  }
  return (
    <p className="text-[11px] text-sky-300/90">
      Bulário ANVISA: bula vigente de <strong>{dataBr(estado.bula.data_publicacao)}</strong> · expediente{' '}
      {estado.bula.expediente} · {estado.bula.empresa}
    </p>
  );
};

interface PosologiaFtnProdutoProps {
  substancia: string;
  apresentacao: string;
  onAbrirMonografia?: (idMonografia: number) => void;
}

/** Posologia do Formulário Terapêutico Nacional para o princípio ativo e a via desta apresentação comercial. */
export const PosologiaFtnProduto: React.FC<PosologiaFtnProdutoProps> = ({ substancia, apresentacao, onAbrirMonografia }) => {
  const [encontradas, setEncontradas] = useState<MonografiaFtn[] | null>(null);
  const [itensSus, setItensSus] = useState<ItemRename2024[] | null>(null);

  useEffect(() => {
    let cancelado = false;
    setEncontradas(null);
    setItensSus(null);
    carregarFormulario()
      .then(({ MONOGRAFIAS_FTN, ITENS_RENAME_2024 }) => {
        if (cancelado) return;
        setEncontradas(monografiasDoProduto(substancia, apresentacao, MONOGRAFIAS_FTN));
        setItensSus(itensRenameDoPrincipio(substancia, ITENS_RENAME_2024));
      })
      .catch(() => {
        if (!cancelado) setEncontradas([]);
      });
    return () => {
      cancelado = true;
    };
  }, [substancia, apresentacao]);

  return (
    <div className="space-y-2">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <BookOpen className="w-4 h-4 text-teal-400" /> Posologia (Formulário Terapêutico Nacional)
      </span>

      {itensSus !== null &&
        (itensSus.length > 0 ? (
          <div className="p-2.5 bg-emerald-950/40 border border-emerald-700/50 rounded-lg text-[11px] text-emerald-200">
            <strong>Disponível no SUS</strong> (RENAME 2024 · {Array.from(new Set(itensSus.map((i) => i.componente))).join(', ')}):{' '}
            {itensSus.map((i) => `${i.forma_farmaceutica} ${i.concentracao}`).join('; ')}. Outras marcas e apresentações só na
            farmácia.
          </div>
        ) : (
          <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-slate-400">
            <strong>Fora do SUS ambulatorial:</strong> este princípio ativo (ou associação) não está na RENAME 2024.
          </div>
        ))}

      {encontradas === null && <div className="text-[11px] text-slate-500">Carregando o formulário...</div>}

      {encontradas?.length === 0 && (
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-slate-400 leading-relaxed">
          O FTN 2010 não tem monografia deste princípio ativo para esta via de administração. A posologia está na bula
          oficial (botão "Bula oficial" acima).
        </div>
      )}

      {encontradas?.map((monografia) => (
        <div key={monografia.id_monografia} className="p-4 bg-slate-950 border border-teal-800/50 rounded-xl space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="text-sm font-bold text-slate-100">{capitalizar(monografia.nome)}</div>
              <div className="text-[10px] text-slate-500 font-mono">FTN 2010, p. {monografia.pagina}</div>
            </div>
            {onAbrirMonografia && (
              <button
                onClick={() => onAbrirMonografia(monografia.id_monografia)}
                className="text-[11px] bg-teal-700 hover:bg-teal-600 text-white px-3 py-1.5 rounded-lg font-bold"
              >
                Monografia completa e receita
              </button>
            )}
          </div>

          <div className="text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300">Apresentações descritas no FTN: </span>
            {monografia.apresentacoes.map((a) => a.replace(/\.$/, '')).join('; ')}
          </div>

          <ul className="space-y-2">
            {monografia.esquemas.slice(0, LIMITE_ESQUEMAS).map((esquema, i) => (
              <li key={i} className="text-xs text-slate-200 leading-relaxed">
                <span className="text-teal-300 font-semibold">
                  {esquema.populacao}
                  {esquema.indicacao ? ` · ${esquema.indicacao}` : ''}:
                </span>{' '}
                {esquema.texto}
              </li>
            ))}
          </ul>
          {monografia.esquemas.length > LIMITE_ESQUEMAS && (
            <div className="text-[11px] text-slate-500">
              + {monografia.esquemas.length - LIMITE_ESQUEMAS} esquemas na monografia completa.
            </div>
          )}

          <div className="flex gap-2 p-2.5 bg-amber-950/40 border border-amber-700/50 rounded-lg text-[11px] text-amber-200 leading-relaxed">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-400" />
            <span>
              Posologia do princípio ativo segundo o FTN 2010 (MS). Confira se a concentração e a forma desta
              apresentação (ex.: liberação prolongada) estão entre as descritas acima; se não estiverem, siga a bula.
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
