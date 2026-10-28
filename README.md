# OpenClinical 🏥
Plataforma Open Source de Suporte à Decisão Clínica (*Point-of-Care*) com foco na realidade médica brasileira (SUS, RENAME, ANVISA, CID-10 e CIAP-2).

A plataforma adota uma arquitetura híbrida estrita de alto desempenho e segurança clínica:
- **Python (3.11+):** Pipeline ETL de dados abertos, parsing de PDFs regulatórios da ANVISA (RDC 47/2009), estruturação NLP via LLM local com fallback determinístico e compilação do banco SQLite relacional com FTS5.
- **Rust (Edição 2021):** Motor clínico determinístico (`clinical_engine`) com cálculos médicos auditáveis (CKD-EPI 2021 sem viés racial, Cockcroft-Gault, CURB-65, Wells, vazão de infusão, doses pediátricas com teto de segurança e algoritmo combinatório de interações), além de empacotamento offline para Desktop/Mobile via Tauri 2.0.
- **Frontend UI (PWA / Webview):** Interface em React + TypeScript voltada para ergonomia no atendimento médico, busca global unificada (`Ctrl+K`), visualizador de bulas, matriz de interações e copiador de prescrições pronto para prontuários eletrônicos (e-SUS APS, MV, Tasy).

---

## 📁 Topologia do Monorepo

```text
openclinical/
├── environment.yml                    # Definição do Conda Environment
├── PROMPT.md                          # Especificação técnica original do projeto
├── etl_pipeline/                      # CAMADA PYTHON (Engenharia de Dados & NLP)
│   ├── pyproject.toml
│   ├── environment.yml
│   ├── schemas_dominio.py             # Modelos Pydantic v2 (sem @dataclass)
│   ├── compilador_banco.py            # Criação do schema SQLite e tabela virtual FTS5
│   ├── seed_dados_iniciais.py         # Carga inicial com fármacos essenciais RENAME e CIDs
│   ├── extrator_pdf_bulas.py          # Extrator PyMuPDF (seções RDC 47/2009)
│   ├── estruturador_posologia.py      # Extração posológica via LLM local (Ollama) + Regex
│   ├── sincronizador_rename.py        # Cruzamento de dados RENAME/SUS e CMED
│   ├── openclinical_core.sqlite       # Banco relacional estático compilado com FTS5
│   └── tests/
│       └── test_etl_pipeline.py       # Testes unitários do pipeline Python (Pytest)
│
├── core_rust/                         # CAMADA RUST (Motor Clínico, FTS5 & Desktop)
│   ├── Cargo.toml                     # Cargo Workspace
│   ├── clinical_engine/               # Crate da lógica clínica e acesso a dados
│   │   ├── Cargo.toml
│   │   ├── src/
│   │   │   ├── lib.rs
│   │   │   ├── errors.rs              # Erros customizados via thiserror
│   │   │   ├── models.rs              # Estruturas de dados (Serde)
│   │   │   ├── calculators.rs         # Fórmulas: CKD-EPI 2021, Cockcroft, Wells, CURB-65
│   │   │   ├── pediatric.rs           # Cálculo de dose líquida, teto diário e gotas
│   │   │   ├── interactions.rs        # Algoritmo combinatório N-fármacos e ordenação
│   │   │   ├── protocols.rs           # Parser de condutas em Markdown + Frontmatter YAML
│   │   │   └── database.rs            # Acesso ao SQLite via rusqlite com BM25 FTS5
│   │   └── tests/
│   │       └── test_clinical_engine.rs # Bateria de testes clínicos de referência (100% passing)
│   │
│   └── openclinical_desktop/          # App Desktop/Mobile nativo via Tauri 2.0
│       ├── Cargo.toml
│       ├── tauri.conf.json
│       ├── build.rs
│       └── src/
│           ├── main.rs
│           └── commands.rs            # Comandos IPC Tauri expostos para o Frontend
│
├── clinical_content/                  # CONTEÚDO MÉDICO (Docs-as-Code)
│   └── protocolos/                    # Protocolos em Markdown com Frontmatter YAML
│       ├── itu_nao_complicada.md
│       ├── manejo_dengue_ms.md
│       └── crise_hipertensiva.md
│
└── frontend_ui/                       # CAMADA DE APRESENTAÇÃO (PWA / Webview)
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    ├── index.html
    └── src/
        ├── App.tsx
        ├── main.tsx
        ├── types.ts
        ├── api.ts
        ├── index.css
        └── components/
            ├── SearchModal.tsx        # Busca rápida global (Ctrl+K) com FTS5
            ├── DrugDetail.tsx         # Bula estruturada (Dose, SUS, Renal, Gestação, Diluição)
            ├── PediatricCalculator.tsx# Calculadora pediátrica com teto de segurança diário
            ├── InteractionChecker.tsx # Verificador de interações com chips dinâmicos
            ├── ClinicalCalculators.tsx# CKD-EPI 2021, Cockcroft, CURB-65, Wells, Infusão
            └── ProtocolsView.tsx      # Protocolos e copiador de receitas para prontuário
```

---

## 🚀 Como Executar o Projeto

### 1. Ambiente Conda (Python 3.11+)
O ambiente Conda oficial do projeto está salvo no arquivo `environment.yml`:

```bash
# Criar ou atualizar o ambiente a partir do environment.yml
conda env create -f environment.yml

# Ativar o ambiente
conda activate openclinical
```

### 2. Executar o Pipeline ETL e Banco SQLite
```bash
# Compilar o banco de dados e aplicar o seed inicial (10 princípios ativos, 13 apresentações)
python openclinical/etl_pipeline/seed_dados_iniciais.py

# Baixar e instalar a posologia oficial do Ministério da Saúde: 346 medicamentos do Formulário
# Terapêutico Nacional 2010 e as 875 apresentações da RENAME 2024 (banco + frontend)
python openclinical/etl_pipeline/extrator_formulario_terapeutico.py

# Rodar os testes unitários do pipeline Python
python -m pytest openclinical/etl_pipeline/tests/test_etl_pipeline.py
```

### 3. Rodar os Testes Unitários do Motor Clínico em Rust
```bash
cargo test --package clinical_engine --manifest-path openclinical/core_rust/clinical_engine/Cargo.toml
```
*24 testes determinísticos (credencial do Portal de APIs da ANVISA, CKD-EPI 2021, Cockcroft-Gault, CURB-65, Wells TEP, vazão de noradrenalina, dose pediátrica com teto e em forma sólida, combinatória de interações, parser de protocolos, busca FTS5, consulta CMED, preço oficial e Farmácia Popular, atualizador das bases da ANVISA, entradas inválidas e consultas no banco empacotado).*

```bash
# Atualizar preços CMED, registros e índice de bulas da ANVISA (o app desktop faz isso sozinho uma vez por dia)
cargo run --release --manifest-path openclinical/core_rust/clinical_engine/Cargo.toml --bin openclinical_cli -- atualizar
```

### 4. Executar a Interface do Usuário (Frontend Web / PWA)
```bash
cd openclinical/frontend_ui
npm ci
npm run dev
```
Se `npm run dev` acusar `Cannot find module ... vite/bin/vite.js`, o `node_modules` está incompleto: encerre qualquer servidor dev aberto e rode `npm ci` de novo.
Acesse `http://localhost:5173`. Pressione `Ctrl+K` para abrir a busca global instantânea.

```bash
npm run typecheck   # tsc estrito
npm test            # paridade dos cálculos TS x casos de referência do Rust
```

### 5. Executar o Aplicativo Nativo Multiplataforma (Tauri 2.0 Desktop)
```bash
cargo tauri dev --manifest-path openclinical/core_rust/openclinical_desktop/Cargo.toml
```

---

## ⚠️ Aviso
Projeto em estágio de protótipo. O conteúdo clínico (protocolos, bulas, interações, resumos de PCDT) **não passou por revisão clínica formal** e não substitui julgamento profissional nem as fontes oficiais. Nos catálogos CMED/ANVISA, a posologia aparece quando o princípio ativo e a via têm monografia no FTN 2010 (5.877 das 26.635 apresentações); para os demais produtos, cada registro tem link para a bula oficial no Bulário Eletrônico da ANVISA (requer internet).

## 🛡️ Segurança Clínica e Determinismo
- Todos os cálculos médicos são estritamente matemáticos e determinísticos, auditados por testes unitários e nunca delegados a LLMs em tempo de execução.
- A calculadora de dose pediátrica serve para qualquer medicamento: busca os 346 do FTN, mostra os esquemas pediátricos e aceita dose em mg/kg por dia ou por tomada; o que o FTN não diz sem ambiguidade fica para o médico preencher. Tem alerta e limitação ao teto diário, atalho fixo no topo (ícone de bebê) e, no app instalado no celular, um atalho próprio ("Dose infantil").
- No app desktop, preços da CMED, registros e o índice de bulas da ANVISA são atualizados automaticamente uma vez por dia, sem apagar dados se o download falhar.
- A credencial do Portal de APIs da ANVISA (Client ID = CPF, Client Secret gerado em api.anvisa.gov.br/client-manage) é cadastrada no app desktop, com tutorial, e fica no cofre de credenciais do sistema operacional.
- Cada medicamento do Formulário mostra se está disponível no SUS (RENAME 2024) e todas as apresentações comerciais da CMED do mesmo princípio ativo; a calculadora pediátrica aceita associações (ex.: amoxicilina + clavulanato) e marca as formulações do SUS e as comerciais.
- Clicar no nome de um medicamento (protocolos, interações, PCDT, registros) abre a bula estruturada ou a monografia do FTN.
- A posologia das receitas da tela "Medicamentos & Receitas" vem do Formulário Terapêutico Nacional 2010 (MS), com página de origem; o FTN é de 2010 e deve ser conferido com o PCDT/diretriz vigente.
- A classificação renal KDIGO 2023 utiliza a equação CKD-EPI 2021 sem viés racial.
