export interface PrincipioAtivo {
  id_principio_ativo: number;
  nome_dcb: string;
  classe_terapeutica: string;
  categoria_risco_gestacao: 'A' | 'B' | 'C' | 'D' | 'X';
  compatibilidade_aleitamento: string;
  disponivel_rename_sus: number;
  componente_sus: 'Basico' | 'Estrategico' | 'Especializado' | 'Nao_Padronizado';
}

export interface MedicamentoComercial {
  id_medicamento: number;
  id_principio_ativo: number;
  numero_registro_anvisa: string;
  nome_comercial: string;
  laboratorio_fabricante: string;
  apresentacao_comercial: string;
  concentracao_valor: number;
  concentracao_unidade: string;
  forma_farmaceutica: string;
  tipo_receituario: string;
  preco_maximo_consumidor: number;
}

export interface FaixaAjusteRenal {
  tfg_min: number;
  tfg_max: number;
  posologia_recomendada: string;
}

export interface GuiaDiluicao {
  diluente_compativel: string;
  volume_recomendado_ml: string;
  tempo_infusao: string;
  estabilidade_horas: number;
}

export interface BulaEstruturada {
  id_bula: number;
  id_principio_ativo: number;
  indicacoes_clinicas: string;
  posologia_adulto_padrao: string;
  posologia_pediatrica_padrao?: string | null;
  dose_pediatrica_mg_kg_dia_min?: number | null;
  dose_pediatrica_mg_kg_dia_max?: number | null;
  dose_maxima_diaria_mg?: number | null;
  ajuste_funcao_renal_json?: string | null;
  ajuste_funcao_hepatica?: string | null;
  contraindicacoes: string;
  eventos_adversos_comuns: string;
  guia_diluicao_injetavel_json?: string | null;
}

export interface DetalheMedicamentoCompleto {
  medicamento: MedicamentoComercial;
  principio_ativo: PrincipioAtivo;
  bula?: BulaEstruturada | null;
}

export interface MatrizInteracao {
  id_interacao: number;
  id_principio_ativo_a: number;
  id_principio_ativo_b: number;
  nome_principio_a?: string | null;
  nome_principio_b?: string | null;
  gravidade_interacao: 'Contraindicada' | 'Grave' | 'Moderada' | 'Leve';
  efeito_clinico: string;
  conduta_recomendada: string;
}

export interface CodigoDiagnostico {
  id_diagnostico: number;
  codigo_cid10: string;
  descricao_cid10: string;
  codigo_ciap2: string;
  descricao_ciap2: string;
}

export interface ItemBuscaFts {
  tipo_registro:
    | 'medicamento'
    | 'diagnostico'
    | 'protocolo'
    | 'pcdt_governo'
    | 'cmed_comercial'
    | 'ftn_monografia'
    | 'bula_importada'
    | 'pcdt_conitec';
  id_referencia: number | string;
  titulo_primario: string;
  subtitulo: string;
  score_relevancia: number;
}

export interface ResultadoDosePediatrica {
  peso_kg: number;
  dose_alvo_mg_kg_dia: number;
  dose_total_calculada_mg_dia: number;
  dose_teto_aplicada_mg_dia: number;
  fracionamento_diario: number;
  intervalo_horas: number;
  dose_por_tomada_mg: number;
  /** null quando não há formulação líquida (comprimido/cápsula): dose só em mg */
  volume_ml_por_tomada: number | null;
  numero_gotas_por_tomada: number | null;
  alerta_teto_ultrapassado: boolean;
  justificativa_seguranca?: string | null;
}

export interface ResultadoTfg {
  taxa_filtracao_glomerular: number;
  estagio_drc: string;
  metodo_utilizado: string;
  recomendacao_geral: string;
}

export interface ResultadoCurb65 {
  pontuacao: number;
  estrato_mortalidade: string;
  recomendacao_local_tratamento: string;
}

export interface ResultadoWells {
  pontuacao_total: number;
  categoria_risco: string;
  probabilidade_clinica_percentual: string;
  conduta_propedêutica: string;
}

export interface ProtocoloClinico {
  id_protocolo: string;
  titulo: string;
  cids_relacionados: string[];
  ciaps_relacionados: string[];
  nivel_atencao: string;
  data_revisao: string;
  status_revisao_clinica?: string;
  conteudo_markdown: string;
  bloco_prescricao_copiavel: string;
}

export interface LinkPesquisaPreco {
  nome_farmacia: string;
  descricao: string;
  url: string;
}

export interface SituacaoFarmaciaPopular {
  gratuito: boolean;
  substancia_no_programa: boolean;
  indicacao: string | null;
  doses_no_programa: string | null;
  mensagem: string;
}

/** O único valor monetário é o PMC oficial da CMED; o preço praticado é pesquisado nos links das farmácias. */
export interface AnalisePrecoMedicamento {
  nome_comercial: string;
  substancia: string;
  tipo_produto: string;
  apresentacao: string;
  codigo_ean: string;
  preco_pmc_teto: number | null;
  quantidade_unidades: number | null;
  pmc_por_unidade: number | null;
  farmacia_popular: SituacaoFarmaciaPopular;
  links_pesquisa: LinkPesquisaPreco[];
}

export interface ApresentacaoCmedResumo {
  id_cmed: number;
  titulo: string;
  subtitulo: string;
}

/** Bula vigente de um produto no índice oficial do Bulário Eletrônico (dados abertos da ANVISA) */
export interface BulaAnvisaIndice {
  numero_registro: string;
  nome_produto: string;
  empresa: string;
  expediente: string;
  /** AAAA-MM-DD */
  data_publicacao: string;
  url_bulario: string;
}

/** Situação de uma fonte do atualizador diário (app desktop) */
export interface EstadoFonteAtualizacao {
  fonte: string;
  descricao: string;
  verificado_em: string | null;
  atualizado_em: string | null;
  registros: number | null;
  situacao: string | null;
  mensagem: string | null;
}

export interface ResultadoAtualizacaoBase {
  fonte: string;
  descricao: string;
  situacao: 'atualizada' | 'sem_mudanca' | 'erro';
  registros: number | null;
  mensagem: string;
}

/** Credenciais do Portal de APIs da ANVISA guardadas no cofre do sistema (o secret nunca volta à interface) */
export interface EstadoCredenciaisAnvisa {
  configurado: boolean;
  client_id_mascarado: string | null;
  url_gerenciar_credenciais: string;
}

export interface ServicoApiAnvisa {
  nome: string;
  situacao: 'acessivel' | 'sem_permissao' | 'nao_publicado' | 'bloqueado_firewall' | 'erro';
  detalhe: string;
  operacoes: string[];
}

export interface ResultadoTesteApiAnvisa {
  autenticado: boolean;
  mensagem: string;
  token_expira_em_segundos: number | null;
  servicos: ServicoApiAnvisa[];
}

/** Bula em PDF importada pelo usuário ou coletada do site do laboratório, já separada em seções (bula_parser.ts) */
export interface BulaImportada {
  /** 9 primeiros dígitos do registro na ANVISA */
  registro: string;
  tipo: 'profissional' | 'paciente';
  nome_produto: string;
  principios_ativos: string[];
  empresa: string;
  cnpj: string;
  /** AAAA-MM-DD da aprovação pela ANVISA, ou vazio */
  data_bula: string;
  /** 'manual' ou 'laboratorio:<nome>' */
  origem: string;
  url_origem: string;
  data_importacao: string;
  hash_arquivo: string;
  cabecalho: string;
  secoes: { chave: string; titulo: string; texto: string }[];
}

export interface BulaImportadaResumo {
  registro: string;
  tipo: 'profissional' | 'paciente';
  nome_produto: string;
  empresa: string;
  origem: string;
  data_bula: string;
  data_importacao: string;
  total_secoes: number;
}

/** Fármaco listado no PCDT (Termo de Esclarecimento), cruzado com RENAME 2024 e FTN */
export interface FarmacoPcdt {
  nome: string;
  chave: string;
  no_rename: boolean;
  id_monografia_ftn: number | null;
}

export interface SecaoPcdt {
  chave: string;
  titulo: string;
  /** Página do PDF onde a seção começa */
  pagina: number;
  texto: string;
  /** false quando o texto foi cortado (versão do navegador) */
  completo?: boolean;
}

/** PCDT da CONITEC: lista oficial + conteúdo extraído do PDF (etl_pipeline/extrator_pcdt_conitec.py) */
export interface PcdtResumo {
  id_pcdt: number;
  titulo: string;
  portaria: string;
  data_portaria: string;
  url_pdf: string;
  url_portaria: string;
  url_publicacao_ms: string;
  url_resumido: string;
  paginas: number;
  tem_texto: boolean;
  cids: string[];
  farmacos: FarmacoPcdt[];
  secoes_disponiveis: string[];
  /** A CONITEC trocou o PDF depois da última extração (só no app desktop) */
  conteudo_desatualizado?: boolean;
}

export interface PcdtDetalhe extends PcdtResumo {
  secoes: SecaoPcdt[];
}
