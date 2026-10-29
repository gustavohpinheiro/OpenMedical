# Pedidos à ANVISA: base de bulas em lote e API do Bulário

Textos prontos para enviar. O envio é feito por você, com o seu login gov.br, porque o pedido fica em seu nome.
Depois de enviar, anote o número do protocolo e a data na seção "Acompanhamento" do [todo.md](todo.md).

---

## 1. Pedido pela Lei de Acesso à Informação (Fala.BR)

- **Onde:** https://falabr.cgu.gov.br → "Acesso à informação" → órgão: **ANVISA – Agência Nacional de Vigilância Sanitária**
- **Prazo legal:** 20 dias, prorrogáveis por mais 10 (Lei nº 12.527/2011, art. 11). Cabe recurso em 10 dias se for negado.
- **Forma de recebimento:** pelo sistema (arquivo digital)

**Resumo (campo "Resumo da solicitação"):**
Base de bulas vigentes do Bulário Eletrônico em formato aberto, em lote

**Texto do pedido:**

> Com base na Lei nº 12.527/2011 (Lei de Acesso à Informação) e na Política de Dados Abertos do Poder Executivo
> Federal (Decreto nº 8.777/2016), solicito o acesso, em formato aberto e em lote, ao conteúdo das bulas vigentes
> publicadas no Bulário Eletrônico da ANVISA (consultas.anvisa.gov.br/#/bulario), nas versões para o paciente e para
> o profissional de saúde.
>
> A ANVISA já publica nos dados abertos o índice dessas bulas (arquivo TA_CONSULTA_BULA_PRODUTO.CSV, em
> dados.anvisa.gov.br/dados/CONSULTAS/DOCUMENTOS/), com número de registro, expediente e data de publicação, mas
> não o conteúdo dos documentos. O Bulário Eletrônico permite consultar uma bula por vez, com verificação
> antirrobô, o que impede a consulta em lote.
>
> Peço, preferencialmente:
> 1. os arquivos PDF (ou o texto) das bulas vigentes, identificados pelo número de registro do produto, pelo número
>    do expediente e pela data de publicação, nos moldes do índice já publicado; e
> 2. se possível, a atualização periódica desse conjunto no Portal de Dados Abertos (dados.anvisa.gov.br).
>
> Caso a entrega integral não seja possível, peço a indicação do meio oficial para obter o conteúdo das bulas em lote
> (por exemplo, um serviço do Portal de APIs da ANVISA) ou a entrega parcial do que estiver disponível.
>
> Finalidade: as bulas serão usadas em um aplicativo gratuito de apoio à prescrição no SUS, que já usa os dados
> abertos da CMED, dos registros de medicamentos e do índice do Bulário, sempre citando a ANVISA como fonte.

---

## 2. Chamado no Portal de APIs da ANVISA

- **Onde:** https://api.anvisa.gov.br, entrando com a conta gov.br em que o Client ID já está cadastrado. Use o canal
  de suporte/contato do portal. Se o portal não tiver formulário de chamado, envie pelo Fala.BR como "Solicitação" para a
  ANVISA, com o mesmo texto.
- **Não inclua** o Client Secret no chamado. Se pedirem identificação, informe só o Client ID.

**Assunto:**
Endpoint de bulas na API de Consultas Externas e previsão da API da Lista CMED

**Texto:**

> Sou usuário do Portal de APIs da ANVISA, com credencial ativa (client_credentials). Tenho duas solicitações:
>
> 1. **Bulas.** A API de Consultas Externas (consultas-externas-api) não tem operação de consulta ou download de
>    bulas. Solicito a inclusão de um endpoint que devolva a bula vigente (PDF ou texto) pelo número de registro do
>    produto, ou a liberação, para clientes autenticados do Portal de APIs, do serviço usado pelo Bulário Eletrônico
>    (consultas.anvisa.gov.br/api/consulta/bulario), que hoje recusa acesso automatizado.
>
> 2. **Lista CMED.** O serviço anvs-listacmed-service responde 404 pelo gateway (api-gateway.prd.apps.anvisa.gov.br)
>    e a configuração pública do portal traz FEATURE_FLAG_CMED: "false". Há previsão de publicação dessa API? Enquanto
>    isso, o arquivo TA_PRECO_MEDICAMENTO.csv dos dados abertos segue sendo a fonte recomendada?
>
> Uso pretendido: aplicativo gratuito de apoio à prescrição no SUS, com consultas de baixo volume (no máximo uma
> atualização diária por produto) e citação da ANVISA como fonte.

---

## Se a ANVISA liberar

- **Arquivo em lote (pedido 1):** incluir a fonte em `clinical_engine::atualizador` e gravar em `bulas_importadas` com
  origem `anvisa`, reaproveitando o leitor de seções (`frontend_ui/src/bula_parser.ts` no ETL em Node).
- **Endpoint de bulas (pedido 2):** usar a credencial guardada no cofre do sistema (`api_anvisa.rs`) e trocar a
  importação manual por automática no detalhe do produto.
