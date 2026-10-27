# ESPECIFICAÇÃO TÉCNICA E PLANO DE EXECUÇÃO: OPENCLINICAL (HYBRID PYTHON/RUST)

## 1. Diretrizes de Engenharia e Regras de Desenvolvimento

Atue como um Engenheiro de Software Sênior, Engenheiro de Dados e Desenvolvedor de Sistemas em Rust e Python. Sua missão é construir o **OpenClinical**, uma plataforma *open source* de suporte à decisão clínica (*Point-of-Care*) focada na realidade médica brasileira (SUS, RENAME, ANVISA, CID-10 e CIAP-2).

A arquitetura adota uma abordagem híbrida estrita:
* **Python (3.11+):** Exclusivo para ingestão de dados abertos, web scraping, parsing de PDFs regulatórios da ANVISA, normalização via LLMs locais e compilação do banco relacional estático.
* **Rust (Edição 2021):** Exclusivo para o motor clínico determinístico (cálculos matemáticos, escores, combinatória de interações), consultas locais ultra-rápidas em SQLite FTS5 e empacotamento offline de baixo consumo de memória (via Tauri 2.0 / WebAssembly).

### Regras Estritas de Implementação:
1. **Nomenclatura:** Utilize exclusivamente identificadores em formato composto com sublinhado (`snake_case`) para todas as variáveis, funções, métodos, atributos, colunas de banco de dados e nomes de arquivos, tanto em Python quanto em Rust.
2. **Restrições Python:**
   * Utilize `pydantic.BaseModel` (Pydantic v2) para validação de esquemas de dados, tipagem estrita e serialização JSON.
   * **Proibição Absoluta:** NUNCA utilize o decorador `@dataclass` em nenhuma parte do código.
3. **Restrições Rust:**
   * Não utilize blocos `unsafe` sem justificativa estrita documentada.
   * O motor clínico (`clinical_engine`) não deve depender de runtime assíncrono (`tokio`) para cálculos numéricos ou acesso a dados locais. Deve compilar para código nativo e para o target `wasm32-unknown-unknown`.
   * Trate todos os fluxos de falha através de `Result<T, E>` com tipos de erro customizados e descritivos via `thiserror`. Evite o uso de `unwrap()` ou `expect()` em código de produção.
4. **Modificações Cirúrgicas:** Ao refatorar ou corrigir defeitos, altere estritamente os trechos de código que demandam correção, mantendo a integridade dos módulos estáveis.
5. **Completude do Código:** Entregue sempre implementações completas, funcionais e testáveis. Não utilize stubs, implementações parciais ou comentários evasivos como `# TODO` ou `// implementar lógica aqui`.
6. **Segurança Clínica:** Todos os cálculos médicos (doses pediátricas, taxas de filtração glomerular, escores prognósticos e vazões de infusão) devem ser determinísticos e auditáveis via testes unitários. Nunca delegue cálculos matemáticos em tempo de execução para modelos de linguagem.

---

## 2. Topologia do Repositório (Monorepo)

O projeto será organizado na seguinte estrutura de diretórios:

```text
openclinical/
├── etl_pipeline/                      # CAMADA PYTHON (Engenharia de Dados & NLP)
│   ├── pyproject.toml
│   ├── schemas_dominio.py             # Modelos Pydantic v2 para validação e serialização
│   ├── extrator_pdf_bulas.py          # Extrator PyMuPDF baseado nas seções da RDC 47/2009
│   ├── estruturador_posologia.py      # Extração estruturada via LLM local (Ollama/LiteLLM)
│   ├── sincronizador_rename.py        # Cruzamento de dados da RENAME/SUS e CMED
│   ├── compilador_banco.py            # Criação do schema SQLite e tabela virtual FTS5
│   └── seed_dados_iniciais.py         # Carga inicial com fármacos essenciais e CIDs
│
├── core_rust/                         # CAMADA RUST (Motor Clínico, FTS5 & Desktop)
│   ├── Cargo.toml                     # Cargo Workspace
│   ├── clinical_engine/               # Crate da lógica clínica e acesso a dados
│   │   ├── Cargo.toml
│   │   ├── src/
│   │   │   ├── lib.rs
│   │   │   ├── errors.rs              # Definições de erro com thiserror
│   │   │   ├── models.rs              # Estruturas de dados (Serde)
│   │   │   ├── calculators.rs         # Fórmulas: CKD-EPI 2021, Cockcroft, Wells, CURB-65
│   │   │   ├── pediatric.rs           # Cálculo de dose líquida, teto diário e gotas
│   │   │   ├── interactions.rs        # Algoritmo de cruzamento N-fármacos
│   │   │   ├── protocols.rs           # Parser de condutas em Markdown + YAML Frontmatter
│   │   │   └── database.rs            # Acesso ao SQLite via rusqlite com FTS5
│   │   └── tests/
│   │       └── test_clinical_engine.rs # Testes unitários com casos clínicos de referência
│   │
│   └── openclinical_desktop/          # App Desktop/Mobile nativo via Tauri 2.0
│       ├── Cargo.toml
│       ├── tauri.conf.json
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
    └── src/                           # Interface focada em ergonomia no atendimento
```

---

## 3. Esquema Relacional de Dados (openclinical_core.sqlite)

O pipeline Python irá compilar e indexar o arquivo `openclinical_core.sqlite` com as seguintes tabelas estruturadas:

### `principios_ativos`:
* `id_principio_ativo` (INTEGER PRIMARY KEY AUTOINCREMENT)
* `nome_dcb` (TEXT NOT NULL UNIQUE) - Denominação Comum Brasileira
* `classe_terapeutica` (TEXT NOT NULL)
* `categoria_risco_gestacao` (TEXT NOT NULL) - A, B, C, D ou X
* `compatibilidade_aleitamento` (TEXT NOT NULL)
* `disponivel_rename_sus` (INTEGER NOT NULL CHECK(disponivel_rename_sus IN (0, 1)))
* `componente_sus` (TEXT NOT NULL) - Basico, Estrategico, Especializado ou Nao_Padronizado

### `medicamentos_comerciais`:
* `id_medicamento` (INTEGER PRIMARY KEY AUTOINCREMENT)
* `id_principio_ativo` (INTEGER NOT NULL REFERENCES principios_ativos(id_principio_ativo))
* `numero_registro_anvisa` (TEXT NOT NULL)
* `nome_comercial` (TEXT NOT NULL)
* `laboratorio_fabricante` (TEXT NOT NULL)
* `apresentacao_comercial` (TEXT NOT NULL)
* `concentracao_valor` (REAL NOT NULL)
* `concentracao_unidade` (TEXT NOT NULL) - mg, mg/mL, mcg, UI, etc.
* `forma_farmaceutica` (TEXT NOT NULL) - comprimido, suspensao_oral, solucao_injetavel, etc.
* `tipo_receituario` (TEXT NOT NULL) - simples, controle_especial_c1, antimicrobiano, notificacao_b_azul, notificacao_a_amarela
* `preco_maximo_consumidor` (REAL NOT NULL)

### `bulas_estruturadas`:
* `id_bula` (INTEGER PRIMARY KEY AUTOINCREMENT)
* `id_principio_ativo` (INTEGER NOT NULL UNIQUE REFERENCES principios_ativos(id_principio_ativo))
* `indicacoes_clinicas` (TEXT NOT NULL)
* `posologia_adulto_padrao` (TEXT NOT NULL)
* `posologia_pediatrica_padrao` (TEXT)
* `dose_pediatrica_mg_kg_dia_min` (REAL)
* `dose_pediatrica_mg_kg_dia_max` (REAL)
* `dose_maxima_diaria_mg` (REAL)
* `ajuste_funcao_renal_json` (TEXT) - JSON serializado contendo faixas de TFG e doses recomendadas
* `ajuste_funcao_hepatica` (TEXT)
* `contraindicacoes` (TEXT NOT NULL)
* `eventos_adversos_comuns` (TEXT NOT NULL)
* `guia_diluicao_injetavel_json` (TEXT) - JSON com diluente compatível, volume e estabilidade

### `matriz_interacoes`:
* `id_interacao` (INTEGER PRIMARY KEY AUTOINCREMENT)
* `id_principio_ativo_a` (INTEGER NOT NULL REFERENCES principios_ativos(id_principio_ativo))
* `id_principio_ativo_b` (INTEGER NOT NULL REFERENCES principios_ativos(id_principio_ativo))
* `gravidade_interacao` (TEXT NOT NULL) - Contraindicada, Grave, Moderada ou Leve
* `efeito_clinico` (TEXT NOT NULL)
* `conduta_recomendada` (TEXT NOT NULL)

### `codigos_diagnosticos`:
* `id_diagnostico` (INTEGER PRIMARY KEY AUTOINCREMENT)
* `codigo_cid10` (TEXT NOT NULL)
* `descricao_cid10` (TEXT NOT NULL)
* `codigo_ciap2` (TEXT NOT NULL)
* `descricao_ciap2` (TEXT NOT NULL)

### `indice_busca_fts` (Virtual Table FTS5):
Tabela indexada via SQLite FTS5 com o tokenizador unicode61 remove_diacritics 2.
Colunas: `tipo_registro` (medicamento, diagnostico, protocolo), `id_referencia`, `titulo_primario`, `subtitulo`, `conteudo_textual`.
Triggers de sincronização automática para inserção, atualização e deleção a partir das tabelas base.

---

## 4. Plano de Execução Faseado

Siga rigorosamente a ordem das fases abaixo. Não inicie uma fase subsequente sem a validação formal da fase atual.

* **FASE 1: Fundação de Dados e Pipeline SQLite em Python**
* **FASE 2: Ingestão de Bulas Regulatórias e Extração NLP (Python)**
* **FASE 3: Motor Clínico Determinístico em Rust (clinical_engine)**
* **FASE 4: Consultas FTS5 e Protocolos Docs-as-Code em Rust**
* **FASE 5: Integração Nativa Offline com Tauri 2.0**
* **FASE 6: Interface de Usuário Point-of-Care (Frontend)**
