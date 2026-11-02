import {
  PerfilMedico,
  Paciente,
  BlocoPrescricao,
  TemplateReceituario,
  RelatorioTesteRealizado,
  ItemPrescricaoCesta,
  ReceitaSalva,
  EvolucaoProntuario,
  ProtocoloClinico,
} from './types';

// =============================================================================
// Chaves de Armazenamento Local
// =============================================================================
const KEY_PERFIL_MEDICO_ATIVO = 'openclinical_perfil_medico_ativo';
const KEY_PERFIS_MEDICOS = 'openclinical_perfis_medicos';
const KEY_PACIENTE_ATIVO = 'openclinical_paciente_ativo';
const KEY_PACIENTES = 'openclinical_pacientes_lista';
const KEY_BLOCOS_PRESCRICAO = 'openclinical_blocos_prescricao';
const KEY_TEMPLATES_RECEITA = 'openclinical_templates_receita';
const KEY_TEMPLATE_ATIVO_ID = 'openclinical_template_ativo_id';
const KEY_RELATORIOS_TESTES = 'openclinical_relatorios_testes';
const KEY_RECEITAS_HISTORICO = 'openclinical_receitas_historico';
const KEY_EVOLUCOES_PRONTUARIO = 'openclinical_evolucoes_prontuario';
const KEY_PROTOCOLOS_PERSONALIZADOS = 'openclinical_protocolos_personalizados';

// =============================================================================
// Dados Iniciais Padrão (Presets de Demonstração e Consultório)
// =============================================================================

export const PERFIL_MEDICO_PADRAO: PerfilMedico = {
  id: 'med_default',
  nome_completo: 'Dr. Carlos Eduardo Medeiros',
  crm: '123456',
  uf_crm: 'SP',
  rqe: '45892',
  especialidade: 'Clínica Médica & Saúde da Família',
  nome_clinica: 'Consultório Integrado de Saúde & Bem-Estar',
  endereco_consultorio: 'Av. Paulista, 1578, Cj 1102 - Bela Vista, São Paulo - SP',
  telefone_consultorio: '(11) 3254-8900 / (11) 99876-5432',
  email_contato: 'contato@drpaulomedeiros.med.br',
  usar_papel_timbrado_proprio: false,
  ocultar_logo_padrao: false,
  ocultar_papel_timbrado_padrao: false,
  usar_assinatura_eletronica: true,
  tamanho_papel_receita: 'A4',
  estilo_receita: 'moderno',
  mostrar_qr_code: true,
  mostrar_linha_assinatura: true,
};

export const PACIENTES_PADRAO: Paciente[] = [
  {
    id: 'pac_1',
    nome_completo: 'Maria de Fátima da Silva Oliveira',
    cpf: '123.456.789-00',
    cns: '700012345678901',
    data_nascimento: '1966-05-14',
    idade_anos: 58,
    sexo: 'F',
    peso_kg: 68.5,
    altura_cm: 162,
    endereco: 'Rua das Camélias, 240, Apto 42 - Jardim Paulista, São Paulo - SP',
    telefone: '(11) 98765-4321',
    alergias: ['Dipirona', 'AINEs (Diclofenaco)'],
    comorbidades: ['Hipertensão Arterial Sistêmica', 'Diabetes Mellitus Tipo 2', 'Dislipidemia'],
    observacoes_clinicas: 'Em acompanhamento ambulatorial regular. Função renal preservada.',
    criado_em: '2026-01-10T10:00:00Z',
  },
  {
    id: 'pac_2',
    nome_completo: 'Lucas Gabriel Albuquerque Costa',
    cpf: '987.654.321-11',
    cns: '700098765432102',
    data_nascimento: '2019-09-22',
    idade_anos: 7,
    sexo: 'M',
    peso_kg: 24.0,
    altura_cm: 122,
    endereco: 'Alameda Santos, 850 - Cerqueira César, São Paulo - SP',
    telefone: '(11) 97654-3210',
    alergias: ['Penicilinas (Amoxicilina)'],
    comorbidades: ['Rinite Alérgica', 'Asma Leve Intermitente'],
    observacoes_clinicas: 'Alergia confirmada a beta-lactâmicos com exantema máculo-papular.',
    criado_em: '2026-02-15T14:30:00Z',
  },
  {
    id: 'pac_3',
    nome_completo: 'Sr. Benedito Soares dos Santos',
    cpf: '456.789.012-33',
    cns: '700045678901203',
    data_nascimento: '1949-11-03',
    idade_anos: 76,
    sexo: 'M',
    peso_kg: 74.0,
    altura_cm: 170,
    endereco: 'Av. Brigadeiro Luís Antônio, 2300 - Bela Vista, São Paulo - SP',
    telefone: '(11) 96543-2109',
    alergias: ['Sulfas'],
    comorbidades: ['Fibrilação Atrial', 'Insuficiência Cardíaca CF II', 'DRC Estágio 3a (TFG ~48 ml/min)'],
    observacoes_clinicas: 'Uso de anticoagulante oral direto. Monitorar função renal a cada 6 meses.',
    criado_em: '2026-03-01T09:15:00Z',
  },
];

export const TEMPLATES_RECEITA_PADRAO: TemplateReceituario[] = [
  {
    id: 'tpl_moderno',
    nome: 'Moderno & Limpo (OpenClinical)',
    descricao: 'Design contemporâneo com tipografia refinada, divisores sutis e identificação profissional.',
    estilo: 'moderno',
    cor_primaria: '#0f766e', // Teal
    cor_secundaria: '#334155', // Slate
    fonte_familia: 'sans',
    mostrar_linha_assinatura: true,
    mostrar_qr_code: true,
    margem_superior_mm: 15,
    margem_inferior_mm: 15,
  },
  {
    id: 'tpl_classico',
    nome: 'Clássico Tradicional de Consultório',
    descricao: 'Moldura fina elegante, tipografia sóbria com brasão e linhas formais de receituário médico.',
    estilo: 'classico',
    cor_primaria: '#1e293b',
    cor_secundaria: '#475569',
    fonte_familia: 'serif',
    mostrar_linha_assinatura: true,
    mostrar_qr_code: false,
    margem_superior_mm: 20,
    margem_inferior_mm: 20,
  },
  {
    id: 'tpl_hospitalar',
    nome: 'Institucional SUS / Hospitalar',
    descricao: 'Cabeçalho oficial em caixa alta com campos bem demarcados para triagem e farmácia SUS.',
    estilo: 'hospitalar',
    cor_primaria: '#0369a1', // Sky/Navy
    cor_secundaria: '#1e293b',
    fonte_familia: 'sans',
    mostrar_linha_assinatura: true,
    mostrar_qr_code: true,
    margem_superior_mm: 12,
    margem_inferior_mm: 12,
  },
  {
    id: 'tpl_papel_timbrado',
    nome: 'Papel Timbrado Pré-Impresso / Fundo Personalizado',
    descricao: 'Suprime cabeçalho padrão para usar papel timbrado já impresso na clínica ou imagem carregada.',
    estilo: 'customizado',
    cor_primaria: '#0f172a',
    cor_secundaria: '#475569',
    fonte_familia: 'sans',
    mostrar_linha_assinatura: true,
    mostrar_qr_code: false,
    margem_superior_mm: 35, // Deixa espaço para o timbre da clínica no topo
    margem_inferior_mm: 25,
  },
];

// Presets iniciais de blocos na prescrição
export const BLOCOS_PRESCRICAO_PADRAO: BlocoPrescricao[] = [
  {
    id: 'bloco_med_1',
    tipo: 'medicamento',
    titulo: 'Losartana Potássica 50mg',
    conteudo: 'Tomar 1 comprimido por via oral uma vez ao dia pela manhã, de uso contínuo.',
    medicamento_detalhe: {
      id: 'med_losartana_50',
      nome_medicamento: 'Losartana Potássica 50mg',
      principio_ativo: 'LOSARTANA POTÁSSICA',
      apresentacao: '50 MG COM REV CT BL AL PLAS OPC X 30',
      posologia: 'Tomar 1 comprimido por via oral uma vez ao dia pela manhã.',
      quantidade_embalagens: 2,
      tipo_receituario: 'simples',
      preco_pmc: 32.5,
    },
    tags: ['Anti-hipertensivo', 'Uso Contínuo', 'Farmácia Popular Gratuito'],
    ordem: 1,
    origem_fonte: 'Diretriz SBC / PCDT Hipertensão 2024',
    ativo: true,
  },
  {
    id: 'bloco_med_2',
    tipo: 'medicamento',
    titulo: 'Metformina 850mg',
    conteudo: 'Tomar 1 comprimido por via oral duas vezes ao dia, imediatamente após o almoço e jantar.',
    medicamento_detalhe: {
      id: 'med_metformina_850',
      nome_medicamento: 'Cloridrato de Metformina 850mg',
      principio_ativo: 'CLORIDRATO DE METFORMINA',
      apresentacao: '850 MG COM REV CT BL AL PLAS INC X 30',
      posologia: 'Tomar 1 comprimido por via oral 2x/dia após as refeições.',
      quantidade_embalagens: 2,
      tipo_receituario: 'simples',
      preco_pmc: 18.2,
    },
    tags: ['Antidiabético', 'Uso Contínuo', 'Farmácia Popular Gratuito'],
    ordem: 2,
    origem_fonte: 'Diretriz SBD 2024 / Farmácia Popular',
    ativo: true,
  },
  {
    id: 'bloco_orientacao_1',
    tipo: 'orientacao',
    titulo: 'Recomendações e Estilo de Vida',
    conteudo:
      '• Manter ingestão hídrica adequada (~2 litros de água/dia).\n• Dieta hipossódica: evitar adição de sal à mesa e alimentos ultraprocessados/embutidos.\n• Praticar caminhadas de 30 minutos pelo menos 5 vezes por semana.\n• Monitorar a Pressão Arterial semanalmente e anotar no diário de saúde.',
    tags: ['MEV', 'Cardiovascular'],
    ordem: 3,
    origem_fonte: 'Diretriz Brasileira de Hipertensão Arterial - SBC/SBH 2020',
    ativo: true,
  },
  {
    id: 'bloco_exame_1',
    tipo: 'exame',
    titulo: 'Exames Laboratoriais de Controle (30 a 60 dias)',
    conteudo:
      '1. Hemograma Completo\n2. Glicemia de Jejum e Hemoglobina Glicada (HbA1c)\n3. Creatinina Sérica com cálculo de TFG (CKD-EPI) e Ureia\n4. Sódio, Potássio e Ácido Úrico\n5. Perfil Lipídico (Colesterol Total, HDL, LDL, Triglicerídeos)\n6. Urina Tipo 1 (EAS) e Relação Albuminúria/Creatinúria (RAC em amostra isolada)',
    tags: ['Rotina Anual', 'Metabólico'],
    ordem: 4,
    origem_fonte: 'PCDT Diabetes & Doença Renal Crônica',
    ativo: true,
  },
];

// =============================================================================
// Funções de Gestão de Perfil Médico
// =============================================================================

export function obterPerfilMedicoAtivo(): PerfilMedico {
  try {
    const data = localStorage.getItem(KEY_PERFIL_MEDICO_ATIVO);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Erro ao ler perfil médico do localStorage:', e);
  }
  return PERFIL_MEDICO_PADRAO;
}

export function salvarPerfilMedicoAtivo(perfil: PerfilMedico): void {
  try {
    localStorage.setItem(KEY_PERFIL_MEDICO_ATIVO, JSON.stringify(perfil));
    // Atualiza também na lista de médicos
    const todos = listarPerfisMedicos();
    const index = todos.findIndex((m) => m.id === perfil.id);
    if (index >= 0) {
      todos[index] = perfil;
    } else {
      todos.push(perfil);
    }
    localStorage.setItem(KEY_PERFIS_MEDICOS, JSON.stringify(todos));
    window.dispatchEvent(new CustomEvent('openclinical_medico_alterado', { detail: perfil }));
  } catch (e) {
    console.error('Erro ao salvar perfil médico:', e);
  }
}

export function listarPerfisMedicos(): PerfilMedico[] {
  try {
    const data = localStorage.getItem(KEY_PERFIS_MEDICOS);
    if (data) {
      const lista: PerfilMedico[] = JSON.parse(data);
      if (lista.length > 0) return lista;
    }
  } catch (e) {
    console.error('Erro ao listar perfis médicos:', e);
  }
  return [PERFIL_MEDICO_PADRAO];
}

// =============================================================================
// Funções de Gestão de Pacientes
// =============================================================================

export function listarPacientes(): Paciente[] {
  try {
    const data = localStorage.getItem(KEY_PACIENTES);
    if (data) {
      const lista: Paciente[] = JSON.parse(data);
      if (lista.length > 0) return lista;
    }
  } catch (e) {
    console.error('Erro ao listar pacientes:', e);
  }
  return PACIENTES_PADRAO;
}

export function obterPacienteAtivo(): Paciente | null {
  try {
    const data = localStorage.getItem(KEY_PACIENTE_ATIVO);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Erro ao ler paciente ativo:', e);
  }
  // Se não houver paciente ativo definido, seleciona o primeiro padrão
  const lista = listarPacientes();
  return lista.length > 0 ? lista[0] : null;
}

export function definirPacienteAtivo(paciente: Paciente | null): void {
  try {
    if (paciente) {
      localStorage.setItem(KEY_PACIENTE_ATIVO, JSON.stringify(paciente));
    } else {
      localStorage.removeItem(KEY_PACIENTE_ATIVO);
    }
    window.dispatchEvent(new CustomEvent('openclinical_paciente_alterado', { detail: paciente }));
  } catch (e) {
    console.error('Erro ao definir paciente ativo:', e);
  }
}

export function salvarPaciente(paciente: Paciente): void {
  try {
    const todos = listarPacientes();
    const index = todos.findIndex((p) => p.id === paciente.id);
    if (index >= 0) {
      todos[index] = paciente;
    } else {
      todos.unshift(paciente);
    }
    localStorage.setItem(KEY_PACIENTES, JSON.stringify(todos));
    // Se for o paciente ativo, atualiza também
    const ativo = obterPacienteAtivo();
    if (ativo && ativo.id === paciente.id) {
      definirPacienteAtivo(paciente);
    }
  } catch (e) {
    console.error('Erro ao salvar paciente:', e);
  }
}

export function excluirPaciente(id: string): void {
  try {
    const todos = listarPacientes().filter((p) => p.id !== id);
    localStorage.setItem(KEY_PACIENTES, JSON.stringify(todos));
    const ativo = obterPacienteAtivo();
    if (ativo && ativo.id === id) {
      definirPacienteAtivo(todos.length > 0 ? todos[0] : null);
    }
  } catch (e) {
    console.error('Erro ao excluir paciente:', e);
  }
}

// =============================================================================
// Funções de Gestão dos Blocos Modulares de Prescrição
// =============================================================================

export function obterBlocosPrescricao(): BlocoPrescricao[] {
  try {
    const data = localStorage.getItem(KEY_BLOCOS_PRESCRICAO);
    if (data) {
      const lista: BlocoPrescricao[] = JSON.parse(data);
      if (Array.isArray(lista)) return lista;
    }
  } catch (e) {
    console.error('Erro ao ler blocos de prescrição:', e);
  }
  return BLOCOS_PRESCRICAO_PADRAO;
}

export function salvarBlocosPrescricao(blocos: BlocoPrescricao[]): void {
  try {
    localStorage.setItem(KEY_BLOCOS_PRESCRICAO, JSON.stringify(blocos));
    window.dispatchEvent(new CustomEvent('openclinical_prescricao_atualizada', { detail: blocos }));
  } catch (e) {
    console.error('Erro ao salvar blocos de prescrição:', e);
  }
}

export function adicionarItemPrescricaoModular(
  tipo: BlocoPrescricao['tipo'],
  titulo: string,
  conteudo: string,
  medicamento?: ItemPrescricaoCesta,
  origemFonte?: string,
  tags?: string[]
): BlocoPrescricao {
  const atuais = obterBlocosPrescricao();
  const novoBloco: BlocoPrescricao = {
    id: `bloco_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    tipo,
    titulo,
    conteudo,
    medicamento_detalhe: medicamento,
    origem_fonte: origemFonte || 'Prescrição Clínica Manual',
    tags: tags || [],
    ordem: atuais.length + 1,
    ativo: true,
  };

  const novaLista = [...atuais, novoBloco];
  salvarBlocosPrescricao(novaLista);
  return novoBloco;
}

export function limparPrescricao(): void {
  salvarBlocosPrescricao([]);
}

// =============================================================================
// Gestão de Modelos / Templates de Receituário
// =============================================================================

export function obterTemplatesReceituario(): TemplateReceituario[] {
  try {
    const data = localStorage.getItem(KEY_TEMPLATES_RECEITA);
    if (data) {
      const lista: TemplateReceituario[] = JSON.parse(data);
      if (Array.isArray(lista) && lista.length > 0) return lista;
    }
  } catch (e) {
    console.error('Erro ao ler templates de receita:', e);
  }
  return TEMPLATES_RECEITA_PADRAO;
}

export function obterTemplateAtivoId(): string {
  return localStorage.getItem(KEY_TEMPLATE_ATIVO_ID) || 'tpl_moderno';
}

export function definirTemplateAtivoId(id: string): void {
  localStorage.setItem(KEY_TEMPLATE_ATIVO_ID, id);
  window.dispatchEvent(new CustomEvent('openclinical_template_alterado', { detail: id }));
}

export function salvarNovoTemplateReceituario(template: TemplateReceituario): void {
  try {
    const templates = obterTemplatesReceituario();
    const index = templates.findIndex((t) => t.id === template.id);
    if (index >= 0) {
      templates[index] = template;
    } else {
      templates.push(template);
    }
    localStorage.setItem(KEY_TEMPLATES_RECEITA, JSON.stringify(templates));
    definirTemplateAtivoId(template.id);
  } catch (e) {
    console.error('Erro ao salvar template:', e);
  }
}

// =============================================================================
// Gestão de Relatórios de Testes e Avaliações Clínicas
// =============================================================================

export function salvarRelatorioTeste(relatorio: RelatorioTesteRealizado): void {
  try {
    const data = localStorage.getItem(KEY_RELATORIOS_TESTES);
    const lista: RelatorioTesteRealizado[] = data ? JSON.parse(data) : [];
    lista.unshift(relatorio);
    localStorage.setItem(KEY_RELATORIOS_TESTES, JSON.stringify(lista));
    window.dispatchEvent(new CustomEvent('openclinical_relatorio_salvo', { detail: relatorio }));
  } catch (e) {
    console.error('Erro ao salvar relatório clínico:', e);
  }
}

export function listarRelatoriosTestes(pacienteId?: string): RelatorioTesteRealizado[] {
  try {
    const data = localStorage.getItem(KEY_RELATORIOS_TESTES);
    if (data) {
      const lista: RelatorioTesteRealizado[] = JSON.parse(data);
      if (pacienteId) {
        return lista.filter((r) => r.paciente_id === pacienteId);
      }
      return lista;
    }
  } catch (e) {
    console.error('Erro ao listar relatórios clínicos:', e);
  }
  return [];
}


// =============================================================================
// Gestão do Histórico de Prescrições do Paciente (Prontuário Digital)
// =============================================================================

export function salvarReceitaNoHistorico(receita: ReceitaSalva): void {
  try {
    const data = localStorage.getItem(KEY_RECEITAS_HISTORICO);
    const lista: ReceitaSalva[] = data ? JSON.parse(data) : [];
    lista.unshift(receita);
    localStorage.setItem(KEY_RECEITAS_HISTORICO, JSON.stringify(lista));
    window.dispatchEvent(new CustomEvent('openclinical_receita_salva', { detail: receita }));
  } catch (e) {
    console.error('Erro ao salvar receita no histórico:', e);
  }
}

export function listarReceitasSalvas(pacienteId?: string): ReceitaSalva[] {
  try {
    const data = localStorage.getItem(KEY_RECEITAS_HISTORICO);
    if (data) {
      const lista: ReceitaSalva[] = JSON.parse(data);
      if (pacienteId) {
        return lista.filter((r) => r.paciente_id === pacienteId);
      }
      return lista;
    }
  } catch (e) {
    console.error('Erro ao listar receitas salvas:', e);
  }
  return [];
}

export function excluirReceitaSalva(id: string): void {
  try {
    const todas = listarReceitasSalvas().filter((r) => r.id !== id);
    localStorage.setItem(KEY_RECEITAS_HISTORICO, JSON.stringify(todas));
    window.dispatchEvent(new CustomEvent('openclinical_receita_excluida', { detail: id }));
  } catch (e) {
    console.error('Erro ao excluir receita:', e);
  }
}

// =============================================================================
// Gestão de Evoluções e Anamnese Clínica do Paciente
// =============================================================================

export function salvarEvolucaoProntuario(evolucao: EvolucaoProntuario): void {
  try {
    const data = localStorage.getItem(KEY_EVOLUCOES_PRONTUARIO);
    const lista: EvolucaoProntuario[] = data ? JSON.parse(data) : [];
    lista.unshift(evolucao);
    localStorage.setItem(KEY_EVOLUCOES_PRONTUARIO, JSON.stringify(lista));
    window.dispatchEvent(new CustomEvent('openclinical_evolucao_salva', { detail: evolucao }));
  } catch (e) {
    console.error('Erro ao salvar evolução no prontuário:', e);
  }
}

export function listarEvolucoesProntuario(pacienteId: string): EvolucaoProntuario[] {
  try {
    const data = localStorage.getItem(KEY_EVOLUCOES_PRONTUARIO);
    if (data) {
      const lista: EvolucaoProntuario[] = JSON.parse(data);
      return lista.filter((ev) => ev.paciente_id === pacienteId);
    }
  } catch (e) {
    console.error('Erro ao listar evoluções:', e);
  }
  return [];
}

// =============================================================================
// Gestão de Autenticação / Troca Rápida de Médicos
// =============================================================================

export function trocarPerfilMedico(id: string): PerfilMedico | null {
  const todos = listarPerfisMedicos();
  const escolhido = todos.find((m) => m.id === id);
  if (escolhido) {
    salvarPerfilMedicoAtivo(escolhido);
    return escolhido;
  }
  return null;
}


// =============================================================================
// Gestão de Protocolos Personalizados do Médico
// =============================================================================

export function listarProtocolosPersonalizados(): ProtocoloClinico[] {
  try {
    const data = localStorage.getItem(KEY_PROTOCOLOS_PERSONALIZADOS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Erro ao listar protocolos personalizados:', e);
  }
  return [];
}

export function salvarProtocoloPersonalizado(protocolo: ProtocoloClinico): void {
  try {
    const todos = listarProtocolosPersonalizados();
    const idx = todos.findIndex((p) => p.id_protocolo === protocolo.id_protocolo);
    if (idx >= 0) {
      todos[idx] = protocolo;
    } else {
      todos.unshift(protocolo);
    }
    localStorage.setItem(KEY_PROTOCOLOS_PERSONALIZADOS, JSON.stringify(todos));
    window.dispatchEvent(new CustomEvent('openclinical_protocolos_atualizados', { detail: todos }));
  } catch (e) {
    console.error('Erro ao salvar protocolo personalizado:', e);
  }
}

export function excluirProtocoloPersonalizado(id: string): void {
  try {
    const todos = listarProtocolosPersonalizados().filter((p) => p.id_protocolo !== id);
    localStorage.setItem(KEY_PROTOCOLOS_PERSONALIZADOS, JSON.stringify(todos));
    window.dispatchEvent(new CustomEvent('openclinical_protocolos_atualizados', { detail: todos }));
  } catch (e) {
    console.error('Erro ao excluir protocolo personalizado:', e);
  }
}

// =============================================================================
// Central de Exportação e Importação de Dados Clínicos (JSON)
// =============================================================================

export function exportarProtocolosJson(): string {
  const protocolos = listarProtocolosPersonalizados();
  return JSON.stringify({ versao: '1.0', exportado_em: new Date().toISOString(), tipo: 'protocolos', dados: protocolos }, null, 2);
}

export function importarProtocolosJson(jsonStr: string): { adicionados: number; total: number } {
  try {
    const parsed = JSON.parse(jsonStr);
    const lista: ProtocoloClinico[] = Array.isArray(parsed) ? parsed : (parsed.dados || []);
    if (!Array.isArray(lista)) throw new Error('Formato inválido');
    const atuais = listarProtocolosPersonalizados();
    let adicionados = 0;
    for (const item of lista) {
      if (!item.id_protocolo || !item.titulo) continue;
      const idx = atuais.findIndex((p) => p.id_protocolo === item.id_protocolo);
      if (idx >= 0) {
        atuais[idx] = item;
      } else {
        atuais.push(item);
        adicionados++;
      }
    }
    localStorage.setItem(KEY_PROTOCOLOS_PERSONALIZADOS, JSON.stringify(atuais));
    window.dispatchEvent(new CustomEvent('openclinical_protocolos_atualizados', { detail: atuais }));
    return { adicionados, total: atuais.length };
  } catch (e) {
    throw new Error('Falha ao processar arquivo JSON de protocolos.');
  }
}

export function exportarReceitasJson(): string {
  const receitas = listarReceitasSalvas();
  return JSON.stringify({ versao: '1.0', exportado_em: new Date().toISOString(), tipo: 'receitas', dados: receitas }, null, 2);
}

export function importarReceitasJson(jsonStr: string): { adicionadas: number; total: number } {
  try {
    const parsed = JSON.parse(jsonStr);
    const lista: ReceitaSalva[] = Array.isArray(parsed) ? parsed : (parsed.dados || []);
    if (!Array.isArray(lista)) throw new Error('Formato inválido');
    const atuais = listarReceitasSalvas();
    let adicionadas = 0;
    for (const item of lista) {
      if (!item.id || !item.blocos) continue;
      const idx = atuais.findIndex((r) => r.id === item.id);
      if (idx >= 0) {
        atuais[idx] = item;
      } else {
        atuais.unshift(item);
        adicionadas++;
      }
    }
    localStorage.setItem(KEY_RECEITAS_HISTORICO, JSON.stringify(atuais));
    window.dispatchEvent(new CustomEvent('openclinical_receitas_atualizadas', { detail: atuais }));
    return { adicionadas, total: atuais.length };
  } catch (e) {
    throw new Error('Falha ao processar arquivo JSON de receitas.');
  }
}

export function exportarProntuariosJson(): string {
  const pacientes = listarPacientes();
  const evolucoesRaw = localStorage.getItem(KEY_EVOLUCOES_PRONTUARIO);
  const evolucoes: EvolucaoProntuario[] = evolucoesRaw ? JSON.parse(evolucoesRaw) : [];
  return JSON.stringify({ versao: '1.0', exportado_em: new Date().toISOString(), tipo: 'prontuarios', pacientes, evolucoes }, null, 2);
}

export function importarProntuariosJson(jsonStr: string): { pacientes: number; evolucoes: number } {
  try {
    const parsed = JSON.parse(jsonStr);
    const pacientesLista: Paciente[] = parsed.pacientes || (Array.isArray(parsed) ? parsed : []);
    const evolucoesLista: EvolucaoProntuario[] = parsed.evolucoes || [];

    const atuaisPacientes = listarPacientes();
    let pacAdicionados = 0;
    for (const p of pacientesLista) {
      if (!p.id || !p.nome_completo) continue;
      const idx = atuaisPacientes.findIndex((x) => x.id === p.id);
      if (idx >= 0) {
        atuaisPacientes[idx] = p;
      } else {
        atuaisPacientes.push(p);
        pacAdicionados++;
      }
    }
    localStorage.setItem(KEY_PACIENTES, JSON.stringify(atuaisPacientes));

    const atuaisEvolucoesRaw = localStorage.getItem(KEY_EVOLUCOES_PRONTUARIO);
    const atuaisEvolucoes: EvolucaoProntuario[] = atuaisEvolucoesRaw ? JSON.parse(atuaisEvolucoesRaw) : [];
    let evAdicionadas = 0;
    for (const ev of evolucoesLista) {
      if (!ev.id || !ev.paciente_id) continue;
      const idx = atuaisEvolucoes.findIndex((x) => x.id === ev.id);
      if (idx >= 0) {
        atuaisEvolucoes[idx] = ev;
      } else {
        atuaisEvolucoes.unshift(ev);
        evAdicionadas++;
      }
    }
    localStorage.setItem(KEY_EVOLUCOES_PRONTUARIO, JSON.stringify(atuaisEvolucoes));

    window.dispatchEvent(new CustomEvent('openclinical_paciente_alterado', { detail: obterPacienteAtivo() }));
    return { pacientes: pacAdicionados, evolucoes: evAdicionadas };
  } catch (e) {
    throw new Error('Falha ao processar arquivo JSON de prontuários.');
  }
}

export function exportarBackupCompletoJson(): string {
  return JSON.stringify({
    versao: '1.0',
    exportado_em: new Date().toISOString(),
    tipo: 'backup_completo_openclinical',
    medicos: listarPerfisMedicos(),
    pacientes: listarPacientes(),
    protocolos_personalizados: listarProtocolosPersonalizados(),
    receitas: listarReceitasSalvas(),
    evolucoes: JSON.parse(localStorage.getItem(KEY_EVOLUCOES_PRONTUARIO) || '[]'),
    templates: obterTemplatesReceituario(),
  }, null, 2);
}

export function importarBackupCompletoJson(jsonStr: string): { sucesso: boolean; mensagem: string } {
  try {
    const backup = JSON.parse(jsonStr);
    if (backup.pacientes) localStorage.setItem(KEY_PACIENTES, JSON.stringify(backup.pacientes));
    if (backup.protocolos_personalizados) localStorage.setItem(KEY_PROTOCOLOS_PERSONALIZADOS, JSON.stringify(backup.protocolos_personalizados));
    if (backup.receitas) localStorage.setItem(KEY_RECEITAS_HISTORICO, JSON.stringify(backup.receitas));
    if (backup.evolucoes) localStorage.setItem(KEY_EVOLUCOES_PRONTUARIO, JSON.stringify(backup.evolucoes));
    if (backup.templates) localStorage.setItem(KEY_TEMPLATES_RECEITA, JSON.stringify(backup.templates));
    if (backup.medicos) localStorage.setItem(KEY_PERFIS_MEDICOS, JSON.stringify(backup.medicos));

    window.dispatchEvent(new CustomEvent('openclinical_prescricao_atualizada', { detail: obterBlocosPrescricao() }));
    window.dispatchEvent(new CustomEvent('openclinical_paciente_alterado', { detail: obterPacienteAtivo() }));
    window.dispatchEvent(new CustomEvent('openclinical_medico_alterado', { detail: obterPerfilMedicoAtivo() }));
    return { sucesso: true, mensagem: 'Backup completo importado com sucesso!' };
  } catch (e) {
    throw new Error('Arquivo de backup inválido ou corrompido.');
  }
}
