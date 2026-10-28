import React, { useEffect, useState } from 'react';
import { KeyRound, ExternalLink, ShieldCheck, Trash2, PlugZap, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { estadoCredenciaisAnvisa, isTauri, removerCredenciaisAnvisa, salvarCredenciaisAnvisa, testarApiAnvisa } from '../api';
import type { EstadoCredenciaisAnvisa, ResultadoTesteApiAnvisa } from '../types';

const URL_PORTAL = 'https://api.anvisa.gov.br/client-manage';

const PASSOS_TUTORIAL = [
  'Clique em "Abrir o Portal de APIs" (abre no seu navegador).',
  'Clique em "Entrar com gov.br" e faça login com a sua conta gov.br. A senha é sua: o OpenClinical nunca a vê.',
  'Já logado, abra "Gerenciamento de Client IDs e Client Secrets" (api.anvisa.gov.br/client-manage).',
  'Se aparecer o botão "Regenerar Secret", clique nele. Se aparecer "Criar Client", clique, recarregue a página e então clique em "Regenerar Secret".',
  'Copie o valor ao lado de "Client Secret:". O Client ID é o seu CPF, só números.',
  'Cole os dois campos abaixo e clique em "Salvar no cofre". Depois use "Testar conexão".',
];

const ROTULO_SITUACAO: Record<string, string> = {
  acessivel: 'Acessível',
  sem_permissao: 'Sem permissão',
  nao_publicado: 'Não publicado pela ANVISA',
  bloqueado_firewall: 'Bloqueado pelo firewall da ANVISA',
  erro: 'Erro',
};

/** Cadastro do Client ID / Client Secret do Portal de APIs da ANVISA, com tutorial e teste de conexão. */
export const IntegracaoApiAnvisa: React.FC = () => {
  const [aberto, setAberto] = useState(false);
  const [estado, setEstado] = useState<EstadoCredenciaisAnvisa | null>(null);
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [mensagem, setMensagem] = useState<{ texto: string; erro: boolean } | null>(null);
  const [ocupado, setOcupado] = useState(false);
  const [teste, setTeste] = useState<ResultadoTesteApiAnvisa | null>(null);
  const desktop = isTauri();

  useEffect(() => {
    if (!desktop) return;
    estadoCredenciaisAnvisa()
      .then(setEstado)
      .catch((e) => setMensagem({ texto: e instanceof Error ? e.message : String(e), erro: true }));
  }, [desktop]);

  const executar = async (acao: () => Promise<void>) => {
    setOcupado(true);
    setMensagem(null);
    try {
      await acao();
    } catch (e) {
      setMensagem({ texto: e instanceof Error ? e.message : String(e), erro: true });
    } finally {
      setOcupado(false);
    }
  };

  const salvar = () =>
    executar(async () => {
      setEstado(await salvarCredenciaisAnvisa(clientId, clientSecret));
      // O secret sai da memória da tela assim que vai para o cofre
      setClientId('');
      setClientSecret('');
      setTeste(null);
      setMensagem({ texto: 'Credenciais salvas no cofre do sistema.', erro: false });
    });

  const remover = () =>
    executar(async () => {
      setEstado(await removerCredenciaisAnvisa());
      setTeste(null);
      setMensagem({ texto: 'Credenciais removidas deste computador.', erro: false });
    });

  const testar = () => executar(async () => setTeste(await testarApiAnvisa()));

  const classeCampo =
    'w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:border-teal-500 focus:outline-none';

  return (
    <div className="bg-slate-950/60 border border-slate-800 rounded-xl">
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left"
        aria-expanded={aberto}
      >
        <span className="flex items-center gap-2 text-[11px] font-bold text-slate-300 uppercase tracking-wider">
          <KeyRound className="w-4 h-4 text-amber-300" />
          API oficial da ANVISA (Client ID e Client Secret)
        </span>
        <span className="flex items-center gap-2 text-[11px] text-slate-400">
          {estado?.configurado ? (
            <span className="text-emerald-300">Configurada · {estado.client_id_mascarado}</span>
          ) : desktop ? (
            'Não configurada'
          ) : (
            'Só no app desktop'
          )}
          {aberto ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>

      {aberto && (
        <div className="px-3 pb-3 space-y-3 border-t border-slate-800 pt-3">
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Com a credencial do Portal de APIs, o app consulta direto os serviços da ANVISA (Lista CMED, consultas externas).
            O portal não tem API de bula: o texto da bula continua no Bulário Eletrônico. A credencial é pessoal: o Client
            ID é o CPF do titular da conta gov.br.
          </p>

          <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300">
            {PASSOS_TUTORIAL.map((passo) => (
              <li key={passo}>{passo}</li>
            ))}
          </ol>

          <a
            href={URL_PORTAL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] bg-sky-950/70 hover:bg-sky-900 border border-sky-600/50 text-sky-300 px-3 py-1.5 rounded-lg font-bold"
          >
            Abrir o Portal de APIs <ExternalLink className="w-3 h-3" />
          </a>

          {!desktop ? (
            <p className="text-[11px] text-amber-300/90">
              No navegador a ANVISA bloqueia essas chamadas (CORS) e não há cofre seguro para a credencial: cadastre-a no app
              desktop.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <label className="text-[11px] text-slate-400 space-y-1">
                  <span>Client ID (CPF, só números)</span>
                  <input
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder={estado?.configurado ? 'Já salvo; preencha para trocar' : '00000000000'}
                    className={classeCampo}
                  />
                </label>
                <label className="text-[11px] text-slate-400 space-y-1">
                  <span>Client Secret</span>
                  <input
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                    type="password"
                    autoComplete="off"
                    placeholder={estado?.configurado ? 'Já salvo; preencha para trocar' : 'Cole o Client Secret'}
                    className={classeCampo}
                  />
                </label>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={salvar}
                  disabled={ocupado || !clientId.trim() || !clientSecret.trim()}
                  className="flex items-center gap-1.5 text-[11px] bg-teal-700 hover:bg-teal-600 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg font-bold"
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Salvar no cofre
                </button>
                <button
                  type="button"
                  onClick={testar}
                  disabled={ocupado || !estado?.configurado}
                  className="flex items-center gap-1.5 text-[11px] bg-slate-800 hover:bg-slate-700 disabled:opacity-50 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg font-bold"
                >
                  <PlugZap className="w-3.5 h-3.5" /> {ocupado ? 'Aguarde...' : 'Testar conexão'}
                </button>
                {estado?.configurado && (
                  <button
                    type="button"
                    onClick={remover}
                    disabled={ocupado}
                    className="flex items-center gap-1.5 text-[11px] text-rose-300 hover:text-rose-200 px-2 py-1.5 font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remover deste computador
                  </button>
                )}
              </div>
              <p className="text-[10px] text-slate-500">
                Guardado no cofre de credenciais do sistema (Gerenciador de Credenciais do Windows, Keychain no macOS), não em
                cookie nem em arquivo do app. O secret não volta a ser exibido.
              </p>
            </>
          )}

          {mensagem && (
            <p className={`text-[11px] ${mensagem.erro ? 'text-rose-300' : 'text-emerald-300'}`}>{mensagem.texto}</p>
          )}

          {teste && (
            <div className="space-y-1.5 text-[11px]">
              <p className={`flex items-center gap-1.5 font-semibold ${teste.autenticado ? 'text-emerald-300' : 'text-rose-300'}`}>
                {teste.autenticado ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                {teste.mensagem}
                {teste.token_expira_em_segundos ? ` Token válido por ${Math.round(teste.token_expira_em_segundos / 60)} min.` : ''}
              </p>
              {teste.servicos.map((servico) => (
                <div key={servico.nome} className="text-slate-400">
                  <span className="text-slate-200 font-semibold">{servico.nome}:</span> {ROTULO_SITUACAO[servico.situacao] ?? servico.situacao}{' '}
                  · {servico.detalhe}
                  {servico.operacoes.length > 0 && (
                    <details className="mt-0.5">
                      <summary className="cursor-pointer text-slate-500">Operações disponíveis</summary>
                      <ul className="font-mono text-[10px] text-slate-500 max-h-40 overflow-y-auto">
                        {servico.operacoes.map((op) => (
                          <li key={op}>{op}</li>
                        ))}
                      </ul>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
