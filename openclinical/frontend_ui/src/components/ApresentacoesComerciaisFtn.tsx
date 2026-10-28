import React, { useEffect, useMemo, useState } from 'react';
import { Store, ExternalLink } from 'lucide-react';
import type { MonografiaFtn } from '../data/formulario_terapeutico';
import type { MedicamentoComercialCMED } from '../data/catalogo_cmed_nacional';
import { apresentacoesComerciaisDoFarmaco, isTauri } from '../api';
import { monografiasDoProduto, viaApresentacaoCmed, type ViaAdministracao } from '../ligacao_ftn';
import { verificarFarmaciaPopular } from '../farmacia_popular';

const ROTULO_VIA: Record<ViaAdministracao, string> = {
  oral: 'oral',
  injetavel: 'injetável',
  oftalmica: 'oftálmica',
  otologica: 'otológica',
  nasal_inalatoria: 'nasal/inalatória',
  topica: 'tópica',
  transdermica: 'transdérmica',
  vaginal: 'vaginal',
  retal: 'retal',
  outra: 'outra',
};

const LIMITE_PRODUTOS = 60;

interface Props {
  monografia: MonografiaFtn;
  onAbrirProduto?: (idCmed: number) => void;
}

interface Linha {
  item: MedicamentoComercialCMED;
  via: ViaAdministracao;
  mesmaVia: boolean;
  gratuito: boolean;
}

/** Todas as apresentações comerciais (CMED) do princípio ativo da monografia, agrupadas por produto. */
export const ApresentacoesComerciaisFtn: React.FC<Props> = ({ monografia, onAbrirProduto }) => {
  const [itens, setItens] = useState<MedicamentoComercialCMED[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [soViaFtn, setSoViaFtn] = useState(true);
  const [mostrarTodos, setMostrarTodos] = useState(false);

  useEffect(() => {
    let cancelado = false;
    setItens(null);
    setErro(null);
    setMostrarTodos(false);
    apresentacoesComerciaisDoFarmaco(monografia)
      .then((lista) => !cancelado && setItens(lista))
      .catch((e) => !cancelado && setErro(e instanceof Error ? e.message : String(e)));
    return () => {
      cancelado = true;
    };
  }, [monografia]);

  const linhas = useMemo<Linha[]>(
    () =>
      (itens ?? []).map((item) => ({
        item,
        via: viaApresentacaoCmed(item.apresentacao),
        mesmaVia: monografiasDoProduto(item.substancia, item.apresentacao, [monografia]).length > 0,
        gratuito: verificarFarmaciaPopular(item.substancia, item.apresentacao).gratuito,
      })),
    [itens, monografia]
  );

  const visiveis = soViaFtn ? linhas.filter((l) => l.mesmaVia) : linhas;
  const produtos = useMemo(() => {
    const grupos = new Map<string, Linha[]>();
    for (const linha of visiveis) {
      const chave = `${linha.item.nome_produto} · ${linha.item.laboratorio}`;
      grupos.set(chave, [...(grupos.get(chave) ?? []), linha]);
    }
    return [...grupos.entries()];
  }, [visiveis]);

  if (erro) return <p className="text-xs text-rose-300">{erro}</p>;
  if (itens === null) return <p className="text-xs text-slate-400">Carregando apresentações comerciais...</p>;

  const mesmaViaTotal = linhas.filter((l) => l.mesmaVia).length;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-slate-300">
          <strong>{linhas.length}</strong> apresentações comerciais na CMED ({mesmaViaTotal} na mesma via das apresentações do
          FTN).
          {!isTauri() && <span className="text-slate-500"> No navegador, amostra offline; o catálogo completo está no app desktop.</span>}
        </p>
        <label className="flex items-center gap-2 text-[11px] text-slate-400 cursor-pointer select-none">
          <input type="checkbox" checked={soViaFtn} onChange={(e) => setSoViaFtn(e.target.checked)} className="accent-teal-500" />
          Só vias descritas no FTN
        </label>
      </div>

      {produtos.length === 0 && (
        <p className="text-xs text-slate-500">
          Nenhuma apresentação comercial {soViaFtn ? 'nesta via ' : ''}encontrada para este princípio ativo.
        </p>
      )}

      <div className="space-y-2">
        {(mostrarTodos ? produtos : produtos.slice(0, LIMITE_PRODUTOS)).map(([produto, apresentacoes]) => (
          <div key={produto} className="bg-slate-950 border border-slate-800 rounded-xl p-3">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-slate-100">{apresentacoes[0].item.nome_produto}</span>
              {apresentacoes[0].item.tipo_produto && (
                <span className="text-[10px] bg-slate-800 text-teal-300 px-1.5 py-px rounded font-mono">
                  {apresentacoes[0].item.tipo_produto}
                </span>
              )}
              <span className="text-[10px] text-slate-500">{apresentacoes[0].item.laboratorio}</span>
            </div>
            <ul className="space-y-1">
              {apresentacoes.map(({ item, via, gratuito }) => (
                <li key={item.id_cmed} className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <span className="text-slate-300">
                    {item.apresentacao}
                    <span className="ml-1.5 text-slate-500">· via {ROTULO_VIA[via]}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    {gratuito && (
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700/60 px-1.5 py-px rounded font-semibold">
                        Grátis no Farmácia Popular
                      </span>
                    )}
                    <span className="font-mono text-emerald-400">
                      {item.preco_maximo_consumidor > 0 ? `PMC R$ ${item.preco_maximo_consumidor.toFixed(2)}` : 'sem PMC'}
                    </span>
                    {onAbrirProduto && (
                      <button
                        type="button"
                        onClick={() => onAbrirProduto(item.id_cmed)}
                        title="Abrir registro, bula oficial e preço"
                        className="text-sky-300 hover:text-sky-200"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {!mostrarTodos && produtos.length > LIMITE_PRODUTOS && (
        <button
          type="button"
          onClick={() => setMostrarTodos(true)}
          className="flex items-center gap-1.5 text-[11px] text-teal-300 hover:text-teal-200 font-semibold"
        >
          <Store className="w-3.5 h-3.5" /> Mostrar os {produtos.length} produtos
        </button>
      )}
    </div>
  );
};
