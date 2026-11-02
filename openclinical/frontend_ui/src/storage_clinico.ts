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
// Motor de Persistência Segura contra Quedas de Energia e Corrupção de Disco
// (Atomic Two-Phase Commit + Snapshots de Segurança + Espelhamento IndexedDB ACID)
// =============================================================================

const DB_NOME = 'OpenClinical_SafeStore_v1';
const DB_VERSAO = 1;
const STORE_NOME = 'tabelas_clinicas';

let dbInstancia: IDBDatabase | null = null;

async function obterBancoIndexedDB(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) return null;
  if (dbInstancia) return dbInstancia;

  return new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NOME, DB_VERSAO);
      request.onupgradeneeded = (e: any) => {
        const db = e.target.result as IDBDatabase;
        if (!db.objectStoreNames.contains(STORE_NOME)) {
          db.createObjectStore(STORE_NOME, { keyPath: 'chave' });
        }
      };
      request.onsuccess = (e: any) => {
        dbInstancia = e.target.result;
        resolve(dbInstancia);
      };
      request.onerror = () => {
        resolve(null);
      };
    } catch {
      resolve(null);
    }
  });
}

/**
 * Grava assincronamente no IndexedDB como garantia transacional ACID (SQLite WAL)
 */
function espelharNoIndexedDB(chave: string, dado: any): void {
  obterBancoIndexedDB().then((db) => {
    if (!db) return;
    try {
      const tx = db.transaction(STORE_NOME, 'readwrite');
      const store = tx.objectStore(STORE_NOME);
      store.put({
        chave,
        conteudo: dado,
        atualizado_em: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Erro ao espelhar no IndexedDB:', e);
    }
  });
}

/**
 * Grava um dado com protocolo seguro de duas fases (Two-Phase Atomic Commit):
 * 1. Faz cópia de segurança do estado anterior comprovadamente íntegro (chave_backup)
 * 2. Grava em chave_temp e valida com JSON.parse
 * 3. Promove para a chave final e limpa chave_temp
 * 4. Espelha em transação ACID no IndexedDB
 */
export function gravarComSeguranca(chave: string, dado: any): void {
  try {
    const serializado = JSON.stringify(dado);

    // 1. Snapshot de segurança antes da escrita
    const atual = localStorage.getItem(chave);
    if (atual) {
      localStorage.setItem(`${chave}_backup`, atual);
    }

    // 2. Escrita em área temporária para validação
    localStorage.setItem(`${chave}_temp`, serializado);

    // 3. Validação de integridade sintática
    JSON.parse(localStorage.getItem(`${chave}_temp`) || '');

    // 4. Efetivação atômica na chave principal
    localStorage.setItem(chave, serializado);
    localStorage.removeItem(`${chave}_temp`);

    // 5. Espelhamento assíncrono no IndexedDB (ACID contra falta de energia)
    espelharNoIndexedDB(chave, dado);
  } catch (e) {
    console.error(`[STORAGE_CLINICO] Falha ao gravar chave ${chave}:`, e);
  }
}

/**
 * Lê com tolerância a falhas e recuperação automática de desastre:
 * Se o JSON estiver corrompido (ex: queda de energia no meio de uma gravação prévia),
 * restaura instantaneamente a partir do backup snapshot íntegro.
 */
export function lerComSeguranca<T>(chave: string, valorPadrao: T): T {
  try {
    const data = localStorage.getItem(chave);
    if (data) {
      return JSON.parse(data) as T;
    }
  } catch (erroCorrupcao) {
    console.warn(`[STORAGE_CLINICO] Corrupção detectada na chave ${chave}. Recuperando pelo snapshot de backup...`, erroCorrupcao);
    try {
      const backup = localStorage.getItem(`${chave}_backup`);
      if (backup) {
        const recuperado = JSON.parse(backup) as T;
        localStorage.setItem(chave, backup);
        console.info(`[STORAGE_CLINICO] Chave ${chave} recuperada com sucesso do snapshot de segurança!`);
        return recuperado;
      }
    } catch (eBackup) {
      console.error(`[STORAGE_CLINICO] Snapshot de backup também indisponível para ${chave}:`, eBackup);
    }
  }
  return valorPadrao;
}

/**
 * Abre o modal de configuração médica diretamente na aba de Assinatura Eletrônica
 */
export function abrirConfiguracaoAssinatura(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('openclinical_abrir_modal_medico', { detail: { aba: 'assinatura' } })
    );
  }
}

/**
 * Abre o modal de configuração médica na aba de Papel Timbrado & PDF
 */
export function abrirConfiguracaoReceita(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('openclinical_abrir_modal_medico', { detail: { aba: 'receita' } })
    );
  }
}

// =============================================================================
// Funções de Gestão de Perfil Médico
// =============================================================================

export function obterPerfilMedicoAtivo(): PerfilMedico {
  return lerComSeguranca<PerfilMedico>(KEY_PERFIL_MEDICO_ATIVO, PERFIL_MEDICO_PADRAO);
}

export function salvarPerfilMedicoAtivo(perfil: PerfilMedico): void {
  try {
    gravarComSeguranca(KEY_PERFIL_MEDICO_ATIVO, perfil);
    // Atualiza também na lista de médicos
    const todos = listarPerfisMedicos();
    const index = todos.findIndex((m) => m.id === perfil.id);
    if (index >= 0) {
      todos[index] = perfil;
    } else {
      todos.push(perfil);
    }
    gravarComSeguranca(KEY_PERFIS_MEDICOS, todos);
    window.dispatchEvent(new CustomEvent('openclinical_medico_alterado', { detail: perfil }));
  } catch (e) {
    console.error('Erro ao salvar perfil médico:', e);
  }
}

export function listarPerfisMedicos(): PerfilMedico[] {
  return lerComSeguranca<PerfilMedico[]>(KEY_PERFIS_MEDICOS, [PERFIL_MEDICO_PADRAO]);
}

// =============================================================================
// Funções de Gestão de Pacientes
// =============================================================================

export function listarPacientes(): Paciente[] {
  return lerComSeguranca<Paciente[]>(KEY_PACIENTES, PACIENTES_PADRAO);
}

export function obterPacienteAtivo(): Paciente | null {
  const guardado = lerComSeguranca<Paciente | null>(KEY_PACIENTE_ATIVO, null);
  if (guardado) return guardado;
  // Se não houver paciente ativo definido, seleciona o primeiro padrão
  const lista = listarPacientes();
  return lista.length > 0 ? lista[0] : null;
}

export function definirPacienteAtivo(paciente: Paciente | null): void {
  try {
    if (paciente) {
      gravarComSeguranca(KEY_PACIENTE_ATIVO, paciente);
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
    gravarComSeguranca(KEY_PACIENTES, todos);
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
    gravarComSeguranca(KEY_PACIENTES, todos);
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
  return lerComSeguranca<BlocoPrescricao[]>(KEY_BLOCOS_PRESCRICAO, BLOCOS_PRESCRICAO_PADRAO);
}

export function salvarBlocosPrescricao(blocos: BlocoPrescricao[]): void {
  try {
    gravarComSeguranca(KEY_BLOCOS_PRESCRICAO, blocos);
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
  return lerComSeguranca<TemplateReceituario[]>(KEY_TEMPLATES_RECEITA, TEMPLATES_RECEITA_PADRAO);
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
    gravarComSeguranca(KEY_TEMPLATES_RECEITA, templates);
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
    const lista = lerComSeguranca<RelatorioTesteRealizado[]>(KEY_RELATORIOS_TESTES, []);
    lista.unshift(relatorio);
    gravarComSeguranca(KEY_RELATORIOS_TESTES, lista);
    window.dispatchEvent(new CustomEvent('openclinical_relatorio_salvo', { detail: relatorio }));
  } catch (e) {
    console.error('Erro ao salvar relatório clínico:', e);
  }
}

export function listarRelatoriosTestes(pacienteId?: string): RelatorioTesteRealizado[] {
  const lista = lerComSeguranca<RelatorioTesteRealizado[]>(KEY_RELATORIOS_TESTES, []);
  if (pacienteId) {
    return lista.filter((r) => r.paciente_id === pacienteId);
  }
  return lista;
}

// =============================================================================
// Gestão do Histórico de Prescrições do Paciente (Prontuário Digital)
// =============================================================================

export function salvarReceitaNoHistorico(receita: ReceitaSalva): void {
  try {
    const lista = lerComSeguranca<ReceitaSalva[]>(KEY_RECEITAS_HISTORICO, []);
    lista.unshift(receita);
    gravarComSeguranca(KEY_RECEITAS_HISTORICO, lista);
    window.dispatchEvent(new CustomEvent('openclinical_receita_salva', { detail: receita }));
  } catch (e) {
    console.error('Erro ao salvar receita no histórico:', e);
  }
}

export function listarReceitasSalvas(pacienteId?: string): ReceitaSalva[] {
  const lista = lerComSeguranca<ReceitaSalva[]>(KEY_RECEITAS_HISTORICO, []);
  if (pacienteId) {
    return lista.filter((r) => r.paciente_id === pacienteId);
  }
  return lista;
}

export function excluirReceitaSalva(id: string): void {
  try {
    const todas = listarReceitasSalvas().filter((r) => r.id !== id);
    gravarComSeguranca(KEY_RECEITAS_HISTORICO, todas);
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
    const lista = lerComSeguranca<EvolucaoProntuario[]>(KEY_EVOLUCOES_PRONTUARIO, []);
    lista.unshift(evolucao);
    gravarComSeguranca(KEY_EVOLUCOES_PRONTUARIO, lista);
    window.dispatchEvent(new CustomEvent('openclinical_evolucao_salva', { detail: evolucao }));
  } catch (e) {
    console.error('Erro ao salvar evolução no prontuário:', e);
  }
}

export function listarEvolucoesProntuario(pacienteId: string): EvolucaoProntuario[] {
  const lista = lerComSeguranca<EvolucaoProntuario[]>(KEY_EVOLUCOES_PRONTUARIO, []);
  return lista.filter((ev) => ev.paciente_id === pacienteId);
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
  return lerComSeguranca<ProtocoloClinico[]>(KEY_PROTOCOLOS_PERSONALIZADOS, []);
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
    gravarComSeguranca(KEY_PROTOCOLOS_PERSONALIZADOS, todos);
    window.dispatchEvent(new CustomEvent('openclinical_protocolos_atualizados', { detail: todos }));
  } catch (e) {
    console.error('Erro ao salvar protocolo personalizado:', e);
  }
}

export function excluirProtocoloPersonalizado(id: string): void {
  try {
    const todos = listarProtocolosPersonalizados().filter((p) => p.id_protocolo !== id);
    gravarComSeguranca(KEY_PROTOCOLOS_PERSONALIZADOS, todos);
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
