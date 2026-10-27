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
  tipo_registro: 'medicamento' | 'diagnostico' | 'protocolo';
  id_referencia: number;
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
  volume_ml_por_tomada: number;
  numero_gotas_por_tomada: number;
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
  conteudo_markdown: string;
  bloco_prescricao_copiavel: string;
}
