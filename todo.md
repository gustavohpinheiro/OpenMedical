# TODO: base de bulas e protocolos mais completa

Objetivo: posologia, contraindicações e interações para o maior número possível de medicamentos vendidos
no Brasil, por caminhos legítimos.

**Fora de escopo, de propósito:** scraping do Bulário Eletrônico da ANVISA (`consultas.anvisa.gov.br`).
O site tem verificação antirrobô (Cloudflare Turnstile) e a API responde 403 a acessos automatizados;
contornar essa proteção não é aceitável.

Ordem sugerida: 1 → 2 → 3 (reaproveita o leitor do item 1) → 4 (pode ir em paralelo, só depende de enviar).

---

## 1. Importar a bula em PDF (o usuário baixa no Bulário e arrasta no app)

A pessoa resolve a verificação do Bulário no navegador dela, baixa o PDF e o app faz o resto.
A base cresce com o uso, sempre com a bula vigente.

- [ ] **Leitor de texto do PDF**: `pdfjs-dist` (funciona no navegador, no app desktop e no Node, o que
      permite reusar no item 3). Carregar sob demanda (é pesado).
- [ ] **Separador de seções** em `frontend_ui/src/bula_parser.ts` (função pura, testável em Node):
  - Bula do profissional (RDC 47/2009): `1. INDICAÇÕES`, `2. RESULTADOS DE EFICÁCIA`,
    `3. CARACTERÍSTICAS FARMACOLÓGICAS`, `4. CONTRAINDICAÇÕES`, `5. ADVERTÊNCIAS E PRECAUÇÕES`,
    `6. INTERAÇÕES MEDICAMENTOSAS`, `7. CUIDADOS DE ARMAZENAMENTO`, `8. POSOLOGIA E MODO DE USAR`,
    `9. REAÇÕES ADVERSAS`, `10. SUPERDOSE`.
  - Bula do paciente: `1. PARA QUE ESTE MEDICAMENTO É INDICADO?` … `6. COMO DEVO USAR ESTE MEDICAMENTO?` …
  - Extrair também nome do produto, empresa e registro (`MS 1.xxxx.xxxx.xxx-x` → 9 primeiros dígitos).
  - Marcar se é bula do profissional ou do paciente; preferir a do profissional quando houver as duas.
- [ ] **Ligação**: pelo registro (9 dígitos) com a CMED e com `bulas_anvisa_indice` (data da versão
      vigente: avisar se o PDF importado é mais antigo que a bula vigente); pelo princípio ativo com o FTN
      (`ligacao_ftn.ts`).
- [ ] **Armazenamento**:
  - Desktop: tabela `bulas_importadas` (registro PK, nome, empresa, tipo, origem, data_importacao,
    data_bula, secoes_json, texto) + linha no `indice_busca_fts` (`tipo_registro = 'bula_importada'`).
    Comandos Tauri `salvar_bula_importada`, `obter_bula_importada`, `listar_bulas_importadas`,
    `remover_bula_importada`. Gravar na cópia do banco em app data (ver `preparar_banco_gravavel`).
  - Navegador/PWA: IndexedDB (localStorage tem limite de ~5 MB).
- [ ] **Interface**:
  - No detalhe do produto CMED e na bula estruturada: botão "Importar PDF da bula" (input de arquivo +
    arrastar e soltar) ao lado de "Bula oficial (ANVISA)".
  - Bula importada: seções em abas (Posologia primeiro), com origem e data.
  - Lista "Bulas importadas" na tela de bases públicas.
  - Busca global e nome clicável (`abrirMedicamentoPorNome`) passam a considerar a bula importada.
- [ ] **Testes**: separador de seções com textos reais de 3 ou 4 bulas (profissional e paciente),
      extração do registro e PDF que não é bula (deve ser recusado com mensagem clara).

## 2. PCDTs da CONITEC (protocolos oficiais atuais)

Complementa o FTN de 2010 com as condutas atuais do SUS por doença. Hoje `pcdt_oficial_ms` tem 83 itens,
mas só 23 têm conteúdo (resumos escritos pelo projeto).

Fonte verificada em 28/10/2026:
- `robots.txt` do gov.br permite robôs em `/conitec`.
- O site é Plone/Volto; a lista sai pela API REST pública:
  `https://www.gov.br/conitec/++api++/pt-br/assuntos/avaliacao-de-tecnologias-em-saude/protocolos-clinicos-e-diretrizes-terapeuticas/pcdt`
  (JSON de ~650 KB com ~380 links de mídia). Os PDFs vêm no formato
  `https://www.gov.br/conitec/pt-br/midias/.../arquivo.pdf/@@display-file/file`.
- Pastas irmãs da mesma página: `ddt`, `diretrizes-brasileiras-db`, `linhas-de-cuidados`,
  `protocolos-de-uso-pu`.
- A lista mistura PCDTs, portarias e relatórios: filtrar pelos títulos/blocos da página, não só pela URL.

Tarefas:
- [ ] `etl_pipeline/extrator_pcdt_conitec.py`: ler a API `++api++`, montar a lista (título, CIDs,
      portaria, data, URL do PDF), baixar os PDFs para `dados_publicos/pcdt/` com intervalo entre
      requisições e User-Agent identificado (`OpenClinical/x.y (+coleta de dados publicos)`), e baixar
      de novo só o que mudou (ETag/Last-Modified ou data `modified` da API).
- [ ] Extrair o texto com pymupdf e separar as seções usuais do PCDT: CID-10, critérios de inclusão e
      exclusão, tratamento, **fármacos**, **esquemas de administração**, tempo de tratamento,
      monitorização.
- [ ] Reconhecer os fármacos citados cruzando com FTN e RENAME (`chaves_associacao` /
      `nome_para_busca`) e preencher `farmacos_principais` com dados reais, no lugar dos campos vazios.
- [ ] Persistir em `pcdt_documentos` (+ FTS) nos dois bancos e exportar para o frontend um resumo
      leve (título, CIDs, fármacos, trecho de "Esquemas de administração", URL do PDF), carregado sob
      demanda.
- [ ] Interface: na aba PCDT, mostrar fármacos e esquemas extraídos com link para a página do PDF; na
      monografia do FTN, listar "PCDTs que citam este medicamento".
- [ ] Incluir a CONITEC no atualizador diário (`clinical_engine::atualizador` ou ETL agendado) usando a
      data `modified` da API.
- [ ] Testes: extração de 2 ou 3 PCDTs conhecidos (ex.: hipertensão, diabetes tipo 2, asma) com
      fármacos esperados.

## 3. Bulas publicadas pelos laboratórios

Muitos fabricantes publicam o PDF da bula em página aberta. A cobertura é irregular e cada site é
diferente, por isso vem depois do item 1, reaproveitando o mesmo leitor de PDF.

- [ ] Levantar 5 a 10 laboratórios com mais produtos na CMED (EMS, Eurofarma, Medley/Sanofi,
      Aché, Germed, Prati-Donaduzzi, Neo Química, Cimed…). Para cada um:
      - conferir o `robots.txt` e os termos de uso; pular quem proibir;
      - identificar a página/listagem de bulas e o padrão dos links de PDF;
      - registrar no arquivo de configuração das fontes (URL da listagem, seletor/regex do link,
        empresa, CNPJ).
- [ ] Coletor `frontend_ui/scripts/baixar_bulas_laboratorios.mjs` (Node 24, sem dependências extras:
      `fetch` + `node:sqlite`), que reusa `bula_parser.ts` e o leitor de PDF:
  - respeita o `robots.txt` (parser simples de `Disallow` para `User-agent: *`);
  - 1 requisição a cada 2 s por domínio, User-Agent identificado, nada de burlar verificação
    antirrobô (se houver, a fonte é pulada e registrada);
  - baixa só PDFs novos ou alterados (ETag/Last-Modified, hash do arquivo);
  - grava em `bulas_importadas` com `origem = 'laboratorio:<nome>'`, nos dois bancos.
- [ ] Ligar ao produto CMED pelo registro encontrado no PDF; descartar PDF sem registro reconhecível.
- [ ] Relatório ao final: quantas bulas por laboratório e quantos produtos CMED passaram a ter bula.
- [ ] Rodar pelo atualizador semanal (não diário: pesa nos sites dos fabricantes).

## 4. Pedido formal à ANVISA

Único caminho para "todas as bulas" de forma oficial. Não exige código; é redigir e enviar.

- [ ] **Pedido pela Lei de Acesso à Informação** (Fala.BR, https://falabr.cgu.gov.br, órgão ANVISA):
      solicitar a base de bulas vigentes do Bulário Eletrônico em formato aberto (PDF ou texto, em
      lote), com o identificador do produto (registro), a data de publicação e o expediente, nos moldes
      do arquivo já publicado `TA_CONSULTA_BULA_PRODUTO.CSV` em
      `dados.anvisa.gov.br/dados/CONSULTAS/DOCUMENTOS/`. Justificativa: aplicação gratuita de apoio à
      prescrição no SUS; a ANVISA já publica o índice das bulas, mas não o conteúdo. Prazo legal de
      resposta: 20 dias, prorrogáveis por mais 10.
- [ ] **Chamado ao Portal de APIs** (api.anvisa.gov.br, com a credencial já cadastrada):
  - pedir um endpoint de consulta e download de bulas na API de Consultas Externas, ou a liberação
    da API do Bulário (`consultas.anvisa.gov.br/api/consulta/bulario`) para clientes autenticados;
  - perguntar a previsão da Lista CMED (hoje responde 404; a configuração pública do portal traz
    `FEATURE_FLAG_CMED: "false"`).
- [ ] Guardar os números de protocolo neste arquivo e acompanhar as respostas.
- [ ] Se a ANVISA liberar: acrescentar a fonte ao `clinical_engine::atualizador` usando a credencial do
      cofre (`api_anvisa.rs`) e trocar a importação manual pela automática.
