# TODO: base de bulas e protocolos mais completa

Objetivo: posologia, contraindicações e interações para o maior número possível de medicamentos vendidos
no Brasil, por caminhos legítimos.

**Fora de escopo, de propósito:** scraping do Bulário Eletrônico da ANVISA (`consultas.anvisa.gov.br`).
O site tem verificação antirrobô (Cloudflare Turnstile) e a API responde 403 a acessos automatizados;
contornar essa proteção não é aceitável.

Situação em 28/10/2026: os caminhos 1, 2 e 3 estão implementados e testados (detalhes na seção 4.2 e 4.8 a 4.10
de `DOCUMENTACAO_TECNICA_OPENCLINICAL.md`). Falta enviar os pedidos do caminho 4 e o que está desmarcado abaixo.

---

## 1. Importar a bula em PDF (o usuário baixa no Bulário e arrasta no app)

- [x] Leitor de texto do PDF: `pdfjs-dist` 4.10.38, carregado sob demanda (`frontend_ui/src/leitor_pdf.ts`).
- [x] Separador de seções em `frontend_ui/src/bula_parser.ts` (profissional e paciente, RDC 47/2009), com nome,
      empresa, CNPJ, registro (9 dígitos) e data de aprovação; remove a caixa da prova gráfica.
- [x] Ligação pelo registro com a CMED e com `bulas_anvisa_indice` (aviso de PDF mais antigo que a bula vigente,
      de registro de outro produto e de arquivo já importado).
- [x] Armazenamento: tabela `bulas_importadas` + FTS (`clinical_engine::bulas_importadas`, comandos Tauri
      `salvar/obter/listar/remover_bula_importada`); IndexedDB no navegador.
- [x] Interface: painel no detalhe do produto CMED e na bula estruturada, aba "Bulas importadas (PDF)", busca
      global e nome clicável.
- [x] Testes: trechos reais de 2 bulas da Aché, bula fictícia do profissional, prova gráfica, PDF que não é bula.
- [ ] Testar a importação no app desktop empacotado (só foi testada no navegador e por `cargo test`).
- [ ] Conseguir uma bula real do profissional para fixture de teste (hoje a do profissional é fictícia).

## 2. PCDT da CONITEC (protocolos oficiais atuais)

- [x] `etl_pipeline/extrator_pcdt_conitec.py`: lista pela API `++api++`, download condicional dos 141 PDFs
      (2 s entre requisições), seções numeradas, CIDs e medicamentos do Termo de Esclarecimento cruzados com
      FTN/RENAME. Resultado: 141 com texto, 98 com esquemas de administração, 126 com medicamentos.
- [x] `pcdt_documentos` + FTS `pcdt_conitec` nos dois bancos; `frontend_ui/src/data/pcdt_conitec.ts` sob demanda.
- [x] Interface: aba PCDT com seções, "Ver no PDF (p. N)", links oficiais; "Citado nos PCDT" na monografia do FTN.
- [x] Atualizador diário: fonte `conitec_pcdt` (lista, portarias, PCDT novos; PDF trocado marca o conteúdo como
      desatualizado até o ETL rodar de novo).
- [x] Testes em Python e em Rust com a mesma amostra real da API.
- [ ] Manuais de HIV/IST e PCDT fora do modelo numerado: ainda sem seções separadas.
- [ ] Quadros e tabelas dos esquemas saem desalinhados: avaliar extração de tabelas (pymupdf `find_tables`).
- [ ] Pastas irmãs da CONITEC (`ddt`, `diretrizes-brasileiras-db`, `linhas-de-cuidados`, `protocolos-de-uso-pu`).
- [ ] Rodar o ETL periodicamente (ou a cada versão do app) para limpar a marca de conteúdo desatualizado.

## 3. Bulas publicadas pelos laboratórios

- [x] Levantamento: Aché e Eurofarma entram; EMS, Neo Química, Medley, Cimed e Prati-Donaduzzi avaliadas e
      excluídas (motivos em `frontend_ui/scripts/fontes_bulas_laboratorios.json`).
- [x] Coletor `frontend_ui/scripts/baixar_bulas_laboratorios.mjs`: robots.txt, 2 s por domínio, antirrobô pula a
      fonte, download só do que mudou, grava nos dois bancos. Aché: 14 bulas gravadas (11 produtos CMED).
- [ ] Rodar a coleta da Eurofarma (configurada; não foi executada durante o desenvolvimento porque o robots.txt
      dela bloqueia o robô do assistente de IA).
- [ ] Reavaliar Prati-Donaduzzi, Germed, Legrand e Sandoz; procurar outros laboratórios com bulas em PDF abertas.
- [ ] Agendar a coleta semanal (Agendador de Tarefas do Windows ou cron).
- [x] `etl_pipeline/dados_publicos/bulas_laboratorios/` (estado do coletor) está no `.gitignore`.

## 4. Pedido formal à ANVISA

Textos prontos em [pedidos_anvisa.md](pedidos_anvisa.md). O envio é feito por você, com o login gov.br.

- [ ] Enviar o pedido pela Lei de Acesso à Informação (Fala.BR, órgão ANVISA). Prazo: 20 dias + 10.
- [ ] Abrir o chamado no Portal de APIs (endpoint de bulas e previsão da Lista CMED).
- [ ] Se a ANVISA liberar: acrescentar a fonte ao `clinical_engine::atualizador` usando a credencial do cofre
      (`api_anvisa.rs`) e trocar a importação manual pela automática.

### Acompanhamento

| Pedido | Data de envio | Protocolo | Prazo | Resposta |
|---|---|---|---|---|
| LAI (Fala.BR): base de bulas em lote | | | | |
| Portal de APIs: endpoint de bulas e Lista CMED | | | | |
