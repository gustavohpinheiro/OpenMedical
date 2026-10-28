import React, { useState, useEffect, useMemo } from 'react';
import {
  Store,
  Search,
  DollarSign,
  TrendingDown,
  Building2,
  ExternalLink,
  ShieldCheck,
  Percent,
  Copy,
  Check,
  AlertCircle,
  Pill,
  Sparkles,
  MapPin,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { AnalisePrecoMedicamento, CotacaoFarmacia } from '../types';
import { cotarPrecosMedicamento } from '../api';
import { CATALOGO_CMED_NACIONAL, MedicamentoComercialCMED } from '../data/catalogo_cmed_nacional';

interface PharmacyPriceFinderProps {
  medicamentoInicial?: string | number;
  onSelecionarMedicamento?: (id: number) => void;
}

const SUGESTOES_RAPIDAS = [
  { label: 'Dipirona 500mg', termo: 'Dipirona' },
  { label: 'Amoxicilina 500mg', termo: 'Amoxicilina' },
  { label: 'Losartana 50mg (SUS R$ 0)', termo: 'Losartana' },
  { label: 'Metformina 500mg (SUS R$ 0)', termo: 'Metformina' },
  { label: 'Omeprazol 20mg', termo: 'Omeprazol' },
  { label: 'Sinvastatina 20mg (SUS)', termo: 'Sinvastatina' },
  { label: 'Azitromicina 500mg', termo: 'Azitromicina' },
  { label: 'Novalgina Gotas', termo: 'Novalgina' },
];

const ESTADOS_ICMS = [
  { uf: 'SP', icms: '18%', nome: 'São Paulo' },
  { uf: 'RJ', icms: '20%', nome: 'Rio de Janeiro' },
  { uf: 'MG', icms: '18%', nome: 'Minas Gerais' },
  { uf: 'RS', icms: '17%', nome: 'Rio Grande do Sul' },
  { uf: 'PR', icms: '19.5%', nome: 'Paraná' },
  { uf: 'BA', icms: '20.5%', nome: 'Bahia' },
  { uf: 'DF', icms: '20%', nome: 'Distrito Federal' },
  { uf: 'PE', icms: '20.5%', nome: 'Pernambuco' },
  { uf: 'CE', icms: '20%', nome: 'Ceará' },
  { uf: 'SC', icms: '17%', nome: 'Santa Catarina' },
];

export const PharmacyPriceFinder: React.FC<PharmacyPriceFinderProps> = ({
  medicamentoInicial,
  onSelecionarMedicamento,
}) => {
  const [termoBusca, setTermoBusca] = useState<string>(
    typeof medicamentoInicial === 'string' ? medicamentoInicial : 'Dipirona'
  );
  const [analise, setAnalise] = useState<AnalisePrecoMedicamento | null>(null);
  const [carregando, setCarregando] = useState<boolean>(false);
  const [copiado, setCopiado] = useState<boolean>(false);
  const [estadoUf, setEstadoUf] = useState<string>('SP');
  const [filtroTipo, setFiltroTipo] = useState<'todas' | 'popular' | 'nacionais'>('todas');

  // Carrega cotação quando o termo muda ou na inicialização
  useEffect(() => {
    let ativo = true;
    const buscar = async () => {
      setCarregando(true);
      try {
        const resultado = await cotarPrecosMedicamento({
          id_cmed: typeof medicamentoInicial === 'number' ? medicamentoInicial : undefined,
          termo: termoBusca,
        });
        if (ativo) {
          setAnalise(resultado);
        }
      } catch (err) {
        console.error('Erro ao cotar preços:', err);
      } finally {
        if (ativo) setCarregando(false);
      }
    };

    buscar();
    return () => {
      ativo = false;
    };
  }, [termoBusca, medicamentoInicial]);

  // Lista de farmácias filtrada
  const cotacoesFiltradas = useMemo(() => {
    if (!analise) return [];
    if (filtroTipo === 'popular') {
      return analise.cotacoes.filter((c) => c.nome_farmacia.includes('Farmácia Popular'));
    }
    if (filtroTipo === 'nacionais') {
      return analise.cotacoes.filter((c) => !c.nome_farmacia.includes('Farmácia Popular'));
    }
    return analise.cotacoes;
  }, [analise, filtroTipo]);

  // Copia resumo de preços para enviar ao paciente
  const copiarResumoPaciente = () => {
    if (!analise) return;

    let texto = `🏥 *COTAÇÃO DE PREÇOS EM FARMÁCIAS - OPENCLINICAL*\n\n`;
    texto += `💊 *Medicamento:* ${analise.nome_comercial} (${analise.substancia})\n`;
    texto += `📦 *Apresentação:* ${analise.apresentacao}\n`;
    texto += `🏛️ *Teto Oficial ANVISA (PMC):* R$ ${analise.preco_pmc_teto.toFixed(2)}\n`;
    texto += `⭐ *Menor Preço Encontrado:* R$ ${analise.menor_preco_estimado.toFixed(2)}\n`;
    texto += `📊 *Preço Médio de Balcão:* R$ ${analise.preco_medio.toFixed(2)}\n`;

    if (analise.preco_por_unidade) {
      texto += `💵 *Custo por comprimido/dose:* R$ ${analise.preco_por_unidade.toFixed(2)}\n`;
    }

    if (analise.elegivel_farmacia_popular && analise.faixa_farmacia_popular) {
      texto += `\n🟢 *ATENÇÃO:* ${analise.faixa_farmacia_popular}\n(Retirada gratuita com receita médica e CPF nas farmácias com o selo 'Aqui Tem Farmácia Popular')\n`;
    }

    texto += `\n📋 *Valores por Rede de Farmácias:*\n`;
    for (const c of analise.cotacoes) {
      texto += `• *${c.nome_farmacia}:* R$ ${c.preco_estimado.toFixed(2)} (${c.desconto_percentual.toFixed(0)}% desc.)\n`;
    }

    texto += `\n_Pesquisado em ${new Date().toLocaleDateString('pt-BR')} via OpenClinical._`;

    navigator.clipboard
      .writeText(texto)
      .then(() => {
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2500);
      })
      .catch(() => alert('Não foi possível copiar. Selecione o texto manualmente.'));
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Cabeçalho do Localizador de Preços */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0d1627] to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-8 -top-8 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-10 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-2xl shadow-lg shadow-emerald-950/60 ring-1 ring-white/20">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    Localizador de Preços em Farmácias
                  </h1>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Cotação em Tempo Real
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Pesquise qualquer remédio e veja o valor nas redes de farmácias brasileiras, teto legal CMED e Farmácia Popular.
                </p>
              </div>
            </div>
          </div>

          {/* Seletor de Estado / ICMS */}
          <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 rounded-2xl px-3 py-2 text-xs">
            <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="text-slate-400 font-medium">Estado / ICMS:</span>
            <select
              value={estadoUf}
              onChange={(e) => setEstadoUf(e.target.value)}
              className="bg-transparent text-emerald-300 font-bold focus:outline-none cursor-pointer"
            >
              {ESTADOS_ICMS.map((est) => (
                <option key={est.uf} value={est.uf} className="bg-slate-900 text-slate-100">
                  {est.uf} ({est.icms})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Barra de Pesquisa Ativa */}
        <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              placeholder="Digite o nome do remédio (ex: Dipirona, Losartana, Amoxil), substância ou código de barras EAN..."
              className="w-full bg-slate-950/90 border border-slate-750 focus:border-emerald-500 rounded-2xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none shadow-inner"
            />
          </div>
          <button
            onClick={() => setTermoBusca(termoBusca.trim())}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-emerald-950/50 transition-all flex items-center justify-center space-x-2"
          >
            <span>Cotar Preços</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Pílulas de Sugestão Rápida */}
        <div className="mt-3 flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mr-1">
            <Tag className="w-3 h-3" /> Sugestões:
          </span>
          {SUGESTOES_RAPIDAS.map((sug) => (
            <button
              key={sug.termo}
              onClick={() => setTermoBusca(sug.termo)}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-xl transition-all border ${
                termoBusca.toLowerCase() === sug.termo.toLowerCase()
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {sug.label}
            </button>
          ))}
        </div>
      </div>

      {carregando && (
        <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold">Pesquisando nas farmácias brasileiras e na base oficial CMED...</p>
        </div>
      )}

      {/* Resultados da Cotação */}
      {!carregando && analise && (
        <div className="space-y-6">
          {/* Card do Medicamento Analisado */}
          <div className="bg-[#0b1322] border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {analise.tipo_produto || 'Medicamento Comercial'}
                </span>
                {analise.codigo_ean && (
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-slate-900 text-slate-400 border border-slate-800">
                    EAN: {analise.codigo_ean}
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white">{analise.nome_comercial}</h2>
              <p className="text-xs text-slate-400 font-medium">
                Princípio Ativo (DCB): <strong className="text-slate-200">{analise.substancia}</strong> &bull; Apresentação: {analise.apresentacao}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copiarResumoPaciente}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-750 hover:border-emerald-500/50 rounded-xl text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center space-x-2 shadow-sm"
              >
                {copiado ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                <span>{copiado ? 'Cotação Copiada!' : 'Copiar para o Paciente'}</span>
              </button>
            </div>
          </div>

          {/* Banner de Elegibilidade Farmácia Popular (SUS) */}
          {analise.elegivel_farmacia_popular && (
            <div className="bg-gradient-to-r from-emerald-950/70 via-teal-950/60 to-emerald-950/70 border border-emerald-500/40 rounded-2xl p-5 shadow-xl relative overflow-hidden">
              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 bg-emerald-500/20 rounded-xl border border-emerald-500/30 text-emerald-300 flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-300 bg-emerald-900/50 px-2 py-0.5 rounded-md border border-emerald-600/40">
                      Aqui Tem Farmácia Popular
                    </span>
                    <span className="text-xs font-bold text-emerald-200">Programa Oficial do Ministério da Saúde</span>
                  </div>
                  <p className="text-xs text-emerald-100/90 leading-relaxed">
                    {analise.faixa_farmacia_popular}
                  </p>
                  <p className="text-[11px] text-emerald-300/80">
                    O paciente pode retirar este medicamento nas farmácias credenciadas apresentando receita médica (do SUS ou clínica particular) acompanhada do documento oficial com foto e CPF.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Grid de Destaques dos Valores (SEMPRE exibe os valores fundamentais) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Menor Preço Encontrado */}
            <div className="bg-[#0c1626] border border-emerald-500/40 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-lg shadow-emerald-950/20">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" /> Menor Preço
                </span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">Mais Barato</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-300 tracking-tight">
                R$ {analise.menor_preco_estimado.toFixed(2)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 truncate">
                Melhor oferta encontrada no varejo farmacêutico
              </p>
            </div>

            {/* 2. Preço Médio de Balcão */}
            <div className="bg-[#0b1322] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-md">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-semibold text-slate-300 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-teal-400" /> Preço Médio
                </span>
                <span className="text-[10px] text-slate-500">Balcão</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
                R$ {analise.preco_medio.toFixed(2)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Média entre as principais redes brasileiras
              </p>
            </div>

            {/* 3. Preço Máximo Autorizado (PMC / CMED) */}
            <div className="bg-[#0b1322] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-md">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-semibold text-amber-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Teto CMED (PMC)
                </span>
                <span className="text-[10px] bg-amber-500/10 text-amber-300 px-1.5 py-0.5 rounded">Legal</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-200 tracking-tight">
                R$ {analise.preco_pmc_teto.toFixed(2)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Preço Máximo ao Consumidor (Alíquota {estadoUf})
              </p>
            </div>

            {/* 4. Preço por Unidade / Comprimido */}
            <div className="bg-[#0b1322] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-md">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-semibold text-cyan-300 flex items-center gap-1">
                  <Pill className="w-3.5 h-3.5" /> Por Unidade
                </span>
                {analise.quantidade_unidades && (
                  <span className="text-[10px] bg-cyan-500/10 text-cyan-300 px-1.5 py-0.5 rounded">
                    {analise.quantidade_unidades} un.
                  </span>
                )}
              </div>
              <div className="text-2xl sm:text-3xl font-black text-cyan-200 tracking-tight">
                {analise.preco_por_unidade
                  ? `R$ ${analise.preco_por_unidade.toFixed(2)}`
                  : 'N/D'}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {analise.preco_por_unidade ? 'Custo estimado por dose/comprimido' : 'Quantidade não identificada na caixa'}
              </p>
            </div>
          </div>

          {/* Filtros da Tabela de Cotações */}
          <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Store className="w-4 h-4 text-emerald-400" />
                Cotações por Farmácia e Rede
              </h3>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                {cotacoesFiltradas.length} encontradas
              </span>
            </div>

            <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setFiltroTipo('todas')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  filtroTipo === 'todas'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFiltroTipo('nacionais')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  filtroTipo === 'nacionais'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Varejo Farmacêutico
              </button>
              {analise.elegivel_farmacia_popular && (
                <button
                  onClick={() => setFiltroTipo('popular')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    filtroTipo === 'popular'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Farmácia Popular SUS
                </button>
              )}
            </div>
          </div>

          {/* Lista de Cotações por Farmácia com Valores Sempre Visíveis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {cotacoesFiltradas.map((cotacao, idx) => {
              const isPopular = cotacao.nome_farmacia.includes('Farmácia Popular');
              const isCampeao = idx === 0 && !isPopular;

              return (
                <div
                  key={`${cotacao.nome_farmacia}-${idx}`}
                  className={`border rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all ${
                    isPopular
                      ? 'bg-emerald-950/40 border-emerald-500/50 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/30'
                      : isCampeao
                      ? 'bg-[#0d1829] border-teal-500/40 shadow-md ring-1 ring-teal-500/20'
                      : 'bg-[#090f1a] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-extrabold text-white">{cotacao.nome_farmacia}</h4>
                          {isPopular && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              SUS R$ 0
                            </span>
                          )}
                          {isCampeao && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/40">
                              Menor Preço
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium">{cotacao.tipo_rede}</p>
                      </div>

                      {/* VALOR DO MEDICAMENTO SEMPRE EM DESTAQUE */}
                      <div className="text-right">
                        <div className="text-xl sm:text-2xl font-black text-white">
                          R$ {cotacao.preco_estimado.toFixed(2)}
                        </div>
                        <div className="text-[10px] font-bold text-emerald-400">
                          {cotacao.desconto_percentual.toFixed(0)}% OFF sobre PMC
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 pb-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{cotacao.disponibilidade}</span>
                      <span className="text-slate-500">Teto Legal: R$ {analise.preco_pmc_teto.toFixed(2)}</span>
                    </div>
                  </div>

                  <a
                    href={cotacao.link_busca}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                      isPopular
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md'
                        : 'bg-slate-900 hover:bg-slate-800 text-teal-300 hover:text-white border border-slate-750 hover:border-teal-500/50'
                    }`}
                  >
                    <span>{isPopular ? 'Consultar Regras Farmácia Popular' : `Conferir na ${cotacao.nome_farmacia}`}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              );
            })}
          </div>

          {/* Nota Regulatória de Transparência */}
          <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-4 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-300">
              <AlertCircle className="w-3.5 h-3.5 text-teal-400" />
              <span>Transparência Regulatória e Preços Médios Farmacêuticos</span>
            </div>
            <p>
              Os valores apresentados baseiam-se na tabela oficial de <strong>Preço Máximo ao Consumidor (PMC)</strong> da CMED/ANVISA com alíquotas estaduais de ICMS ({estadoUf}) e curvas reais de desconto praticadas pelo mercado farmacêutico nacional. Nenhuma farmácia pode cobrar valor superior ao PMC legal. Para comprar ou retirar, use os botões acima para acessar diretamente os canais oficiais da farmácia.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
