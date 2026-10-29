# Como cadastrar uma nova receita

Cada arquivo `.md` desta pasta é uma receita da seção **Receitas & Prescrições**. Eles são a fonte
única: o catálogo do frontend (`frontend_ui/src/data/protocolos_gerados.ts`) e o índice de busca dos
bancos SQLite são gerados a partir deles. Não edite o `.ts` gerado à mão.

## Passo a passo

1. Crie o arquivo a partir do modelo (rode na raiz do repositório):

   ```
   python openclinical/etl_pipeline/cadastrar_receitas.py --nova otite_externa_aguda
   ```

   Isso cria `clinical_content/protocolos/otite_externa_aguda.md` com o `id_protocolo` e a data já
   preenchidos. (Também dá para copiar `_MODELO.md` à mão; o nome do arquivo precisa ser igual ao `id_protocolo`.)

2. Abra o arquivo e troque **todo** texto `PREENCHER` por conteúdo real, tirado da diretriz que você
   cita em `diretrizes_referencia`. Os comentários (`# ...`) no cabeçalho explicam cada campo.
   - A receita copiável vai dentro de um único bloco ` ```receita ... ``` `.
   - Escreva dose, via, intervalo e duração. Frases como "conforme prescrição médica" são recusadas.
   - Deixe `status_revisao_clinica: "pendente_revisao_por_profissional_habilitado"` até a revisão
     por um profissional habilitado.

3. Valide e regenere tudo com um único comando:

   ```
   python openclinical/etl_pipeline/cadastrar_receitas.py
   ```

   Se houver erro, nada é gravado e cada problema aparece como
   `[ERRO] arquivo.md:linha -> campo: o que corrigir`. Corrija e rode de novo.
   Para só conferir, sem gravar nada: `--validar`. Para não mexer nos bancos SQLite: `--sem-banco`.

4. Rode os testes: `python -X utf8 -m pytest openclinical/etl_pipeline/tests -q`
   (eles falham se algum `.md` estiver inválido ou se o `.ts` gerado estiver desatualizado).

## Arquivos ignorados

`_MODELO.md` (e qualquer arquivo começando com `_`) e este `COMO_CADASTRAR.md` não viram receitas.
