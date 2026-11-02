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
  categoria?: string;
  nivel_atencao: string;
  data_revisao: string;
  status_revisao_clinica?: string;
  conteudo_markdown: string;
  bloco_prescricao_copiavel: string;

  // Extensões para Protocolos Internacionais (NICE, CDC, OMS, etc.)
  jurisdicao?: 'BR_SUS' | 'UK_NICE' | 'US_CDC_FDA' | 'GLOBAL_WHO' | 'CA_HEALTH' | 'FR_HAS';
  pais?: string;
  agencia?: string;
  codigo_diretriz?: string;
  url_fonte?: string;
  data_publicacao?: string;
  idioma_original?: string;
  equivalente_sus_id?: string | null;
  tem_equivalente_sus?: boolean;
  disponibilidade_farmacos_rename_sus?: 'total' | 'parcial' | 'ausente_no_sus';
  medicamentos_exclusivos_estrangeiros?: string[];
  divergencias_relevantes_vs_sus?: string[];
  tamanho_markdown_bytes?: number;
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

export interface ResultadoAtualizacaoDiretrizes {
  sucesso: boolean;
  mensagem: string;
  total_diretrizes: number;
  duracao_segundos: number;
  saida_log: string;
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


// -----------------------------------------------------------------------------
// Tipos de Emergência, UTI, Gasometria e Escores Cardiológicos
// -----------------------------------------------------------------------------

export interface ItemFarmacoEmergencia {
  classe: string;
  nome_farmaco: string;
  apresentacao_ampola: string;
  dose_mg_kg: number;
  dose_total_mg: number;
  volume_administrar_ml: number;
  recomendado_perfil: boolean;
  observacao_clinica: string;
}

export interface ParametrosVentilacaoInicial {
  peso_predito_kg: number;
  volume_corrente_ml: number;
  peep_sugerida_cmh2o: number;
  fr_sugerida_irpm: number;
  fio2_inicial_percentual: number;
}

export interface ResultadoIntubacaoSri {
  peso_real_kg: number;
  perfil_hemodinamico: string;
  farmacos: ItemFarmacoEmergencia[];
  ventilacao: ParametrosVentilacaoInicial;
  checklist_7ps: string[];
}

export interface ResultadoEmergenciaPediatrica {
  peso_kg: number;
  idade_anos: number;
  tubo_com_cuff_mm: number;
  tubo_sem_cuff_mm: number;
  fixacao_rima_labial_cm: number;
  lamina_laringoscopio: string;
  carga_desfibrilacao_1_j: number;
  carga_desfibrilacao_2_j: number;
  adrenalina_pcr_mg: number;
  adrenalina_diluida_1_10000_ml: number;
  expansao_cristaloide_20ml_kg: number;
}

export interface ResultadoGasometria {
  ph: number;
  paco2: number;
  hco3: number;
  sodio: number;
  cloro: number;
  albumina: number;
  pao2: number;
  fio2_fracao: number;
  disturbio_primario: string;
  anion_gap_bruto: number;
  anion_gap_corrigido: number;
  delta_delta?: number | null;
  interpretacao_delta_delta?: string | null;
  paco2_esperada_min?: number | null;
  paco2_esperada_max?: number | null;
  compensacao_respiratoria: string;
  relacao_pafo2: number;
  classificacao_oxigenacao_sdra: string;
  condutas_sugeridas: string[];
}

export interface ResultadoCorrecaoSodio {
  sodio_atual: number;
  solucao_meq_l: number;
  agua_corporal_total_litros: number;
  variacao_sodio_1l: number;
  volume_recomendado_24h_ml: number;
  vazao_bic_ml_h: number;
  alerta_seguranca: string;
}

export interface ResultadoCha2ds2Va {
  pontuacao: number;
  categoria_risco: string;
  taxa_avc_anual_estimada: string;
  recomendacao_anticoagulacao: string;
}

export interface ResultadoQsofa {
  pontuacao: number;
  alto_risco_sepse: boolean;
  recomendacao: string;
}

// -----------------------------------------------------------------------------
// Segurança Farmacológica de 5ª Geração (Cascatas, ACB, Triple Whammy, Tisdale, CPIC)
// -----------------------------------------------------------------------------

export interface AlertaCascataPrescricao {
  farmaco_causador: string;
  farmaco_prescrito: string;
  efeito_adverso_confundido: string;
  conduta_desprescricao: string;
}

export interface ItemCargaAnticolinergica {
  medicamento: string;
  pontuacao_acb: number;
  classificacao: string;
}

export interface ResultadoCargaAnticolinergica {
  pontuacao_total: number;
  classificacao_risco: string;
  itens: ItemCargaAnticolinergica[];
  sugestoes_desprescricao: string[];
}

export interface ResultadoTripleWhammy {
  detectado: boolean;
  vasodilatador_eferente_ieca_bra?: string | null;
  depletor_volume_diuretico?: string | null;
  vasoconstritor_aferente_aine?: string | null;
  gravidade: string;
  mecanismo_fisiopatologico: string;
  recomendacao_clinica: string;
}

export interface ResultadoEscoreTisdale {
  pontuacao_total: number;
  categoria_risco: string;
  risco_estimado_percentual: string;
  farmacos_qtc_presentes: string[];
  fatores_risco_detectados: string[];
  recomendacao_monitorizacao: string;
}

export interface AlertaFarmacogenomicoCpic {
  medicamento: string;
  gene: string;
  nivel_evidencia_cpic: string;
  alerta_clinico: string;
  recomendacao: string;
}

export interface RelatorioSeguranca5g {
  cascatas: AlertaCascataPrescricao[];
  carga_anticolinergica: ResultadoCargaAnticolinergica;
  triple_whammy: ResultadoTripleWhammy;
  escore_tisdale: ResultadoEscoreTisdale;
  farmacogenomica: AlertaFarmacogenomicoCpic[];
}

// -----------------------------------------------------------------------------
// Cesta de Prescrição Médica Multidisciplinar
// -----------------------------------------------------------------------------

export interface ItemPrescricaoCesta {
  id: string;
  nome_medicamento: string;
  principio_ativo: string;
  apresentacao: string;
  posologia: string;
  via_administracao?: string;
  dose_unitaria?: string;
  frequencia_intervalo?: string;
  duracao_tratamento?: string;
  orientacoes_especificas?: string;
  quantidade_embalagens: number;
  tipo_receituario: 'simples' | 'controle_especial_c1' | 'antimicrobiano' | 'notificacao_b_azul' | 'notificacao_a_amarela';
  preco_pmc: number;
}

// -----------------------------------------------------------------------------
// Calculadoras Clínicas 2.1 (Novos Escores e Protocolos)
// -----------------------------------------------------------------------------

export interface ResultadoDengueMs {
  grupo: string;
  classificacao_risco: string;
  volume_total_dia_ml: number;
  volume_sro_ml: number;
  volume_outros_liquidos_ml: number;
  fase_expansao_imediata_ml: number;
  tempo_infusao_expansao_horas: number;
  vazao_expansao_ml_h: number;
  vazao_manutencao_ml_h: number;
  orientacao_clinica: string;
  criterios_alarme_presentes: string[];
}

export interface ResultadoParkland {
  peso_kg: number;
  percentual_scq: number;
  volume_total_24h_parkland_ml: number;
  volume_total_24h_atls10_ml: number;
  volume_primeira_fase_ml: number;
  horas_primeira_fase: number;
  vazao_primeira_fase_ml_h: number;
  volume_segunda_fase_ml: number;
  vazao_segunda_fase_ml_h: number;
  meta_diurese_ml_h: string;
  conduta_resfriamento_e_acesso: string;
}

export interface ResultadoMetabolicoCad {
  sodio_medido: number;
  glicemia_mg_dl: number;
  sodio_corrigido_katz: number;
  sodio_corrigido_hillier: number;
  osmolaridade_efetiva_m_osm_kg: number;
  classificacao_osmolaridade: string;
  calcio_total_medido: number;
  albumina_medida: number;
  calcio_corrigido_payne: number;
  potassio_medido: number;
  conduta_insulina_e_potassio: string;
  alerta_critico_bloqueio_insulina: boolean;
}

export interface ResultadoFenaFeureia {
  fena_percentual?: number | null;
  feureia_percentual?: number | null;
  diagnostico_provavel: string;
  interpretacao_clinica: string;
  ressalva_diuretico?: string | null;
}

export interface ResultadoPamPpc {
  pas_mmhg: number;
  pad_mmhg: number;
  pam_mmhg: number;
  pic_mmhg?: number | null;
  ppc_mmhg?: number | null;
  classificacao_hemodinamica: string;
  alvo_terapeutico: string;
}

export interface ResultadoHeartScore {
  pontuacao_total: number;
  categoria_risco: string;
  mace_percentual: string;
  conduta_sugerida: string;
  detalhamento_pontos: string[];
}

export interface ResultadoHasBled {
  pontuacao_total: number;
  categoria_risco: string;
  taxa_sangramento_anual: string;
  fatores_modificaveis: string[];
  recomendacao_anticoagulacao: string;
}

export interface ResultadoQtcCorrigido {
  qt_medido_ms: number;
  fc_bpm: number;
  qtc_bazett_ms: number;
  qtc_fridericia_ms: number;
  qtc_framingham_ms: number;
  status_intervalo: string;
  alerta_torsades: boolean;
  recomendacao: string;
}

export interface ResultadoPerc {
  criterios_positivos: number;
  tep_descartado: boolean;
  probabilidade_residual_percentual: string;
  conduta: string;
}

export interface ResultadoWellsTvp {
  pontuacao_total: number;
  categoria_probabilidade: string;
  incidencia_estimada: string;
  conduta_indicada: string;
}

export interface ResultadoPaduaTev {
  pontuacao_total: number;
  alto_risco_tev: boolean;
  profilaxia_indicada: string;
  esquema_enoxaparina: string;
}

export interface ResultadoTromboliseAvc {
  peso_kg: number;
  dose_total_alteplase_mg: number;
  bolus_alteplase_10_porcento_mg: number;
  infusao_alteplase_90_porcento_mg_h: number;
  dose_tenecteplase_mg: number;
  metas_pressoricas: string;
  contraindicacoes_absolutas: string[];
}

export interface ResultadoGlasgowP {
  escore_glasgow: number;
  reacao_pupilar_pontos: number;
  gcs_p_final: number;
  gravidade_tce: string;
  indicacao_intubacao: boolean;
  conduta: string;
}

export interface ResultadoCranioCervical {
  indicacao_tc_cranio: boolean;
  justificativa_cranio: string;
  criterios_nexus_atendidos: boolean;
  indicacao_imagem_cervical: boolean;
  justificativa_coluna: string;
}

export interface ResultadoMeldNa {
  score_meld_inicial: number;
  score_meld_na: number;
  mortalidade_90d_percentual: string;
  prioridade_transplante: string;
  conduta_clinica: string;
}

export interface ResultadoChildPugh {
  pontuacao_total: number;
  classe: string;
  sobrevida_1ano_percentual: string;
  sobrevida_2anos_percentual: string;
  risco_cirurgico_mortalidade: string;
  conduta_geral: string;
}

export interface ResultadoFib4 {
  score_fib4: number;
  estratificacao_fibrose: string;
  valor_preditivo: string;
  conduta_encaminhamento: string;
}

export interface ResultadoGlasgowBlatchford {
  pontuacao_total: number;
  baixo_risco_ambulatorial: boolean;
  necessidade_intervencao_percentual: string;
  conduta_sugerida: string;
}

export interface ResultadoBisap {
  pontuacao_total: number;
  categoria_gravidade: string;
  mortalidade_prevista_percentual: string;
  indicacao_uti: boolean;
  conduta: string;
}

export interface ResultadoAlvarado {
  pontuacao_total: number;
  probabilidade_apendicite: string;
  conduta_cirurgica: string;
}

export interface ItemDoseEquivalente {
  farmaco: string;
  dose_equivalente_mg: number;
  potencia_antiinflamatoria_relativa: number;
  duracao_efeito_horas: string;
}

export interface ResultadoEquivalenciaCorticoide {
  farmaco_origem: string;
  dose_origem_mg: number;
  doses_equivalentes: ItemDoseEquivalente[];
  esquema_desmame_sugerido: string;
}

export interface ResultadoAntropometriaFarmacologica {
  peso_real_kg: number;
  altura_cm: number;
  peso_ideal_devine_kg: number;
  peso_ajustado_obesidade_kg: number;
  superficie_corporal_mosteller_m2: number;
  imc: number;
  classificacao_imc: string;
  recomendacao_drogas_hidrofilicas: string;
}

export interface ResultadoCentorMcIsaac {
  pontuacao_total: number;
  probabilidade_strepto_percentual: string;
  indicacao_teste_rapido_ou_atb: string;
}

export interface ResultadoIdadeGestacionalDpp {
  idade_gestacional_semanas: number;
  idade_gestacional_dias: number;
  data_provavel_parto_naegele: string;
  trimestre_atual: string;
  exames_do_trimestre: string[];
}

export interface ResultadoSofaCompleto {
  sofa_total: number;
  mortalidade_estimada_uti: string;
  pontuacao_respiratoria: number;
  pontuacao_coagulacao: number;
  pontuacao_hepatica: number;
  pontuacao_cardiovascular: number;
  pontuacao_neurologica: number;
  pontuacao_renal: number;
  criterios_sirs_presentes: number;
  sirs_positivo: boolean;
  conduta_sepse: string;
}


// =============================================================================
// Gestão de Perfil Médico & Autenticação Local
// =============================================================================

export interface PerfilMedico {
  id: string;
  nome_completo: string;
  crm: string;
  uf_crm: string;
  rqe?: string;
  especialidade?: string;
  nome_clinica?: string;
  endereco_consultorio?: string;
  telefone_consultorio?: string;
  email_contato?: string;
  logo_base64?: string;
  assinatura_base64?: string;
  papel_timbrado_base64?: string;
  usar_papel_timbrado_proprio?: boolean;
  pin_acesso?: string;
  tamanho_papel_receita?: 'A4' | 'A5';
  estilo_receita?: 'moderno' | 'classico' | 'hospitalar';
  mostrar_qr_code?: boolean;
  mostrar_linha_assinatura?: boolean;
  texto_rodape_customizado?: string;
  ocultar_logo_padrao?: boolean;
  ocultar_papel_timbrado_padrao?: boolean;
  usar_assinatura_eletronica?: boolean;
  texto_assinatura_eletronica?: string;
  hash_assinatura_eletronica?: string;
}

export interface ReceitaSalva {
  id: string;
  paciente_id: string;
  paciente_nome: string;
  medico_id?: string;
  medico_nome: string;
  medico_crm: string;
  data_hora: string;
  blocos: BlocoPrescricao[];
  total_itens: number;
  total_pmc_estimado: number;
  observacoes?: string;
}

export interface EvolucaoProntuario {
  id: string;
  paciente_id: string;
  medico_nome: string;
  data_hora: string;
  motivo_consulta?: string;
  anamnese_evolucao: string;
  conduta_planejada?: string;
}

// =============================================================================
// Gestão e Prontuário Resumido do Paciente
// =============================================================================

export interface Paciente {
  id: string;
  nome_completo: string;
  cpf?: string;
  cns?: string; // Cartão Nacional de Saúde
  data_nascimento: string; // AAAA-MM-DD
  idade_anos: number;
  sexo: 'M' | 'F';
  peso_kg?: number;
  altura_cm?: number;
  endereco?: string;
  telefone?: string;
  alergias: string[];
  comorbidades: string[];
  observacoes_clinicas?: string;
  criado_em: string;
}

// =============================================================================
// Composição Modular de Prescrição (Peças Modulares / Blocos)
// =============================================================================

export type TipoBlocoPrescricao =
  | 'medicamento'
  | 'orientacao'
  | 'dieta'
  | 'exame'
  | 'atestado'
  | 'encaminhamento';

export interface BlocoPrescricao {
  id: string;
  tipo: TipoBlocoPrescricao;
  titulo: string;
  conteudo: string;
  medicamento_detalhe?: ItemPrescricaoCesta;
  tags?: string[];
  ordem: number;
  origem_fonte?: string; // ex: 'PCDT Asma 2024', 'NICE NG136', 'Manual'
  ativo: boolean;
}

export interface TemplateReceituario {
  id: string;
  nome: string;
  descricao: string;
  estilo: 'moderno' | 'classico' | 'hospitalar' | 'minimalista' | 'customizado';
  imagem_fundo_base64?: string;
  cor_primaria: string;
  cor_secundaria: string;
  fonte_familia: 'sans' | 'serif' | 'mono';
  mostrar_linha_assinatura: boolean;
  mostrar_qr_code: boolean;
  margem_superior_mm: number;
  margem_inferior_mm: number;
}

// =============================================================================
// Testes Rápidos de Consultório & Avaliação Médica
// =============================================================================

export interface OpcaoQuestaoTeste {
  rotulo: string;
  pontos: number;
}

export interface QuestaoTesteRapido {
  id: string;
  enunciado: string;
  dominio?: string;
  pontos_maximos?: number;
  opcoes?: OpcaoQuestaoTeste[];
  tipo_resposta?: 'sim_nao' | 'multipla_escolha' | 'numerico' | 'pontuacao_direta';
}

export interface FonteCientificaTeste {
  autores: string;
  ano: number;
  titulo: string;
  periodico_ou_diretriz: string;
  link_referencia?: string;
}

export interface TesteRapidoDefinicao {
  id: string;
  nome: string;
  sigla: string;
  area_clinica: string;
  tempo_estimado_minutos: number;
  descricao_curta: string;
  fonte_cientifica: FonteCientificaTeste;
  pontuacao_maxima: number;
  questoes: QuestaoTesteRapido[];
  obterInterpretacao: (score: number, dadosExtras?: Record<string, any>) => {
    resultado: string;
    gravidade: 'normal' | 'alerta' | 'grave';
    interpretacao_detalhada: string;
    conduta_recomendada: string;
    bloco_prescricao_sugerido?: string;
  };
}

export interface RelatorioTesteRealizado {
  id: string;
  paciente_id?: string;
  paciente_nome: string;
  paciente_idade?: number;
  paciente_cpf?: string;
  medico_nome: string;
  medico_crm: string;
  teste_id: string;
  teste_nome: string;
  data_hora: string;
  pontuacao_obtida: number;
  pontuacao_maxima: number;
  classificacao: string;
  interpretacao_clinica: string;
  conduta_proposta: string;
  referencia_bibliografica: string;
  respostas_detalhadas: { enunciado: string; resposta: string; pontos: number }[];
}
