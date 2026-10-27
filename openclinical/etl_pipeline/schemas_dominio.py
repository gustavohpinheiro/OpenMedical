from typing import List, Optional, Literal
from pydantic import BaseModel, Field, ConfigDict


class FaixaAjusteRenalSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")

    tfg_min: float = Field(..., description="Taxa de filtração glomerular mínima em mL/min/1.73m2")
    tfg_max: float = Field(..., description="Taxa de filtração glomerular máxima em mL/min/1.73m2")
    posologia_recomendada: str = Field(..., description="Conduta posológica para esta faixa de função renal")


class GuiaDiluicaoSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")

    diluente_compativel: str = Field(..., description="Soluções compatíveis (ex: SF 0.9%, SG 5%)")
    volume_recomendado_ml: str = Field(..., description="Volume recomendado para diluição")
    tempo_infusao: str = Field(..., description="Tempo recomendado de infusão intravenosa")
    estabilidade_horas: float = Field(..., description="Estabilidade da solução após diluição em horas")


class PrincipioAtivoSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id_principio_ativo: Optional[int] = Field(None, description="Identificador primário do princípio ativo")
    nome_dcb: str = Field(..., description="Denominação Comum Brasileira oficial")
    classe_terapeutica: str = Field(..., description="Classe farmacológica ou terapêutica")
    categoria_risco_gestacao: Literal["A", "B", "C", "D", "X"] = Field(..., description="Categoria de risco na gravidez FDA/ANVISA")
    compatibilidade_aleitamento: str = Field(..., description="Classificação de segurança durante a lactação")
    disponivel_rename_sus: int = Field(..., ge=0, le=1, description="1 se padronizado no SUS/RENAME, 0 se não")
    componente_sus: Literal["Basico", "Estrategico", "Especializado", "Nao_Padronizado"] = Field(
        ..., description="Componente da assistência farmacêutica no SUS"
    )


class MedicamentoComercialSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id_medicamento: Optional[int] = Field(None, description="Identificador primário do medicamento comercial")
    id_principio_ativo: int = Field(..., description="Chave estrangeira para principios_ativos")
    numero_registro_anvisa: str = Field(..., description="Número de registro no sistema da ANVISA")
    nome_comercial: str = Field(..., description="Nome de marca ou denominação genérica")
    laboratorio_fabricante: str = Field(..., description="Razão social ou nome fantasia do laboratório")
    apresentacao_comercial: str = Field(..., description="Descrição completa da embalagem e apresentação")
    concentracao_valor: float = Field(..., gt=0, description="Magnitude numérica da concentração")
    concentracao_unidade: str = Field(..., description="Unidade de medida da concentração (mg, mg/mL, etc.)")
    forma_farmaceutica: str = Field(..., description="Forma farmacêutica (comprimido, suspensao_oral, etc.)")
    tipo_receituario: Literal[
        "simples",
        "controle_especial_c1",
        "antimicrobiano",
        "notificacao_b_azul",
        "notificacao_a_amarela"
    ] = Field(..., description="Classificação regulatória da receita médica")
    preco_maximo_consumidor: float = Field(..., ge=0, description="Preço máximo ao consumidor tabelado CMED")


class BulaEstruturadaSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id_bula: Optional[int] = Field(None, description="Identificador primário da bula")
    id_principio_ativo: int = Field(..., description="Chave estrangeira única para principios_ativos")
    indicacoes_clinicas: str = Field(..., description="Indicações terapêuticas aprovadas em bula")
    posologia_adulto_padrao: str = Field(..., description="Regime posológico usual para pacientes adultos")
    posologia_pediatrica_padrao: Optional[str] = Field(None, description="Instruções para administração pediátrica")
    dose_pediatrica_mg_kg_dia_min: Optional[float] = Field(None, ge=0, description="Dose pediátrica mínima mg/kg/dia")
    dose_pediatrica_mg_kg_dia_max: Optional[float] = Field(None, ge=0, description="Dose pediátrica máxima mg/kg/dia")
    dose_maxima_diaria_mg: Optional[float] = Field(None, ge=0, description="Teto de segurança diário em mg")
    ajuste_funcao_renal_json: Optional[str] = Field(None, description="JSON serializado de List[FaixaAjusteRenalSchema]")
    ajuste_funcao_hepatica: Optional[str] = Field(None, description="Orientações para insuficiência hepática")
    contraindicacoes: str = Field(..., description="Contraindicações absolutas e relativas")
    eventos_adversos_comuns: str = Field(..., description="Efeitos colaterais frequentes")
    guia_diluicao_injetavel_json: Optional[str] = Field(None, description="JSON serializado de GuiaDiluicaoSchema")


class MatrizInteracaoSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id_interacao: Optional[int] = Field(None, description="Identificador primário da interação")
    id_principio_ativo_a: int = Field(..., description="Primeiro princípio ativo envolvido")
    id_principio_ativo_b: int = Field(..., description="Segundo princípio ativo envolvido")
    gravidade_interacao: Literal["Contraindicada", "Grave", "Moderada", "Leve"] = Field(
        ..., description="Nível de risco clínico da interação"
    )
    efeito_clinico: str = Field(..., description="Mecanismo farmacológico e desfecho no paciente")
    conduta_recomendada: str = Field(..., description="Ação médica orientada (monitorar, suspender, substituir)")


class CodigoDiagnosticoSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id_diagnostico: Optional[int] = Field(None, description="Identificador primário do diagnóstico")
    codigo_cid10: str = Field(..., description="Código alfanumérico da CID-10")
    descricao_cid10: str = Field(..., description="Descrição nosológica da CID-10")
    codigo_ciap2: str = Field(..., description="Código alfanumérico da CIAP-2")
    descricao_ciap2: str = Field(..., description="Descrição nosológica da CIAP-2 para Atenção Primária")


class PosologiaEstruturadaSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")

    dose_pediatrica_mg_kg_dia_min: Optional[float] = Field(None, ge=0, description="Dose mínima pediátrica em mg/kg/dia")
    dose_pediatrica_mg_kg_dia_max: Optional[float] = Field(None, ge=0, description="Dose máxima pediátrica em mg/kg/dia")
    dose_maxima_diaria_mg: Optional[float] = Field(None, ge=0, description="Teto de dose diária segura em mg")
    fracionamento_diario_sugerido: Optional[int] = Field(None, ge=1, le=24, description="Número de tomadas diárias")
    ajustes_renais: List[FaixaAjusteRenalSchema] = Field(default_factory=list, description="Lista de ajustes por clearance renal")
    resumo_posologico_adulto: str = Field(..., description="Resumo em linguagem clínica direta para adultos")


class IndiceBuscaFtsSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")

    tipo_registro: Literal["medicamento", "diagnostico", "protocolo"] = Field(
        ..., description="Classificador da entidade no índice de busca"
    )
    id_referencia: int = Field(..., description="Identificador na tabela de origem")
    titulo_primario: str = Field(..., description="Título principal indexado")
    subtitulo: str = Field(..., description="Subtítulo ou contexto complementar")
    conteudo_textual: str = Field(..., description="Corpo textual completo para busca textual FTS5")
