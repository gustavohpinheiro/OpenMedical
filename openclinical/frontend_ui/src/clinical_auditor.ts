import type { BlocoPrescricao, ItemPrescricaoCesta, Paciente, RelatorioSeguranca5g, MatrizInteracao } from './types.ts';
import type { ItemBuscaFts } from './types.ts';
import type { MonografiaFtn } from './data/formulario_terapeutico.ts';
import { carregarFormulario, cruzarInteracoesFtn, rotuloConduta, inferirVia, normalizarTexto } from './formulario_utils.ts';
import { avaliarSegurancaMedicamentosa5g } from './medication_safety_5g.ts';

// =============================================================================
// 1. CLASSIFICAÇÃO REGULATÓRIA SANITÁRIA (PORTARIA SVS/MS 344/98 E RDC 471/2021)
// =============================================================================

const ANTIMICROBIANOS_DCB = [
  'amoxicilina', 'ampicilina', 'cefalexina', 'ceftriaxona', 'cefepima', 'cefazolina',
  'cefuroxima', 'ceftazidima', 'ciprofloxacino', 'levofloxacino', 'moxifloxacino',
  'azitromicina', 'claritromicina', 'eritromicina', 'sulfametoxazol', 'trimetoprima',
  'nitrofurantoina', 'doxiciclina', 'metronidazol', 'gentamicina', 'amicacina',
  'clindamicina', 'vancomicina', 'meropenem', 'imipenem', 'polimixina', 'colistina',
  'linezolida', 'daptomicina', 'piperacilina', 'tazobactam', 'amoxicilina + clavulanato',
  'norfloxacino', 'rifampicina', 'isoniazida', 'pirazinamida', 'etambutol', 'fluconazol',
  'itraconazol', 'voriconazol', 'anfotericina'
];

const NOTIFICACAO_A_DCB = [
  'morfina', 'metadona', 'oxicodona', 'fentanil', 'fentanila', 'metilfenidato',
  'remifentanila', 'sufentanila', 'hidromorfona', 'lisdexanfetamina'
];

const NOTIFICACAO_B_AZUL_DCB = [
  'clonazepam', 'diazepam', 'alprazolam', 'lorazepam', 'bromazepam', 'midazolam',
  'zolpidem', 'zopiclona', 'eszopiclona', 'clobazam', 'nitrazepam', 'fenobarbital',
  'flunitrazepam', 'estazolam', 'clordiazepoxido'
];

const CONTROLE_ESPECIAL_C1_DCB = [
  'sertralina', 'fluoxetina', 'escitalopram', 'citalopram', 'paroxetina', 'venlafaxina',
  'desvenlafaxina', 'duloxetina', 'bupropiona', 'trazodona', 'amitriptilina', 'nortriptilina',
  'imipramina', 'clomipramina', 'mirtazapina', 'carbamazepina', 'oxcarbazepina',
  'lamotrigina', 'valproato', 'acido valproico', 'divalproato', 'gabapentina', 'pregabalina',
  'topiramato', 'haloperidol', 'risperidona', 'olanzapina', 'quetiapina', 'aripiprazol',
  'clozapina', 'ziprasidona', 'levomepromazina', 'clorpromazina', 'litio', 'carbonato de litio',
  'biperideno', 'amantadina', 'tramadol', 'codeina', 'baclofeno', 'tizanidina', 'subcitrato de bismuto'
];

export function classificarTipoReceituario(nomeOuPrincipio: string): 'simples' | 'controle_especial_c1' | 'antimicrobiano' | 'notificacao_b_azul' | 'notificacao_a_amarela' {
  const norm = normalizarTexto(nomeOuPrincipio);

  for (const a of NOTIFICACAO_A_DCB) {
    if (norm.includes(normalizarTexto(a))) return 'notificacao_a_amarela';
  }
  for (const b of NOTIFICACAO_B_AZUL_DCB) {
    if (norm.includes(normalizarTexto(b))) return 'notificacao_b_azul';
  }
  for (const c of CONTROLE_ESPECIAL_C1_DCB) {
    if (norm.includes(normalizarTexto(c))) return 'controle_especial_c1';
  }
  for (const atb of ANTIMICROBIANOS_DCB) {
    if (norm.includes(normalizarTexto(atb))) return 'antimicrobiano';
  }

  return 'simples';
}

// =============================================================================
// 2. RESOLVEDOR DE MEDICAMENTO DA BASE (FTN + BULAS + CMED)
// =============================================================================

export interface MedicamentoResolvido {
  nome_medicamento: string;
  principio_ativo: string;
  apresentacao: string;
  posologia: string;
  via_administracao: string;
  tipo_receituario: 'simples' | 'controle_especial_c1' | 'antimicrobiano' | 'notificacao_b_azul' | 'notificacao_a_amarela';
  dose_unitaria: string;
  frequencia_intervalo: string;
  duracao_tratamento: string;
  quantidade_embalagens: number;
  origem_base: string;
  id_monografia_ftn?: number;
}

export async function resolverMedicamentoDaBase(
  item: ItemBuscaFts | { titulo_primario: string; subtitulo?: string; tipo_registro?: string; id_referencia?: string | number }
): Promise<MedicamentoResolvido> {
  let ftnMatch: MonografiaFtn | undefined;
  const termoNorm = normalizarTexto(item.titulo_primario);

  try {
    const { MONOGRAFIAS_FTN } = await carregarFormulario();
    if (item.tipo_registro === 'ftn_monografia' && typeof item.id_referencia === 'number') {
      ftnMatch = MONOGRAFIAS_FTN.find((m) => m.id_monografia === item.id_referencia);
    }
    if (!ftnMatch) {
      ftnMatch = MONOGRAFIAS_FTN.find(
        (m) =>
          normalizarTexto(m.nome) === termoNorm ||
          normalizarTexto(m.nome_busca) === termoNorm ||
          termoNorm.startsWith(normalizarTexto(m.nome))
      );
    }
  } catch {
    // Tolerante a falha
  }

  if (ftnMatch) {
    const apres = ftnMatch.apresentacoes[0] || 'Comprimido';
    const via = inferirVia(apres);
    const esquema = ftnMatch.esquemas_administracao[0];
    const esquemaTexto = typeof esquema === 'string' ? esquema : (esquema as any)?.texto;
    const posologiaTexto = esquemaTexto
      ? `${via}: ${esquemaTexto}`
      : `${via}: Tomar 1 unidade de 12 em 12 horas por 7 dias.`;

    const tipoRec = classificarTipoReceituario(ftnMatch.nome);

    return {
      nome_medicamento: ftnMatch.nome.charAt(0).toUpperCase() + ftnMatch.nome.slice(1),
      principio_ativo: ftnMatch.nome.toUpperCase(),
      apresentacao: apres,
      posologia: posologiaTexto,
      via_administracao: via,
      tipo_receituario: tipoRec,
      dose_unitaria: '1 unidade',
      frequencia_intervalo: 'de 12 em 12 horas',
      duracao_tratamento: 'por 7 dias',
      quantidade_embalagens: 1,
      origem_base: `FTN 2010 (Pág. ${ftnMatch.pagina})`,
      id_monografia_ftn: ftnMatch.id_monografia,
    };
  }

  // Parse heurístico a partir do subtítulo
  let principio = item.titulo_primario;
  let apres = '';
  if (item.subtitulo) {
    if (item.subtitulo.includes(' - ')) {
      const partes = item.subtitulo.split(' - ');
      apres = partes[1] || '';
    } else if (item.subtitulo.includes('·')) {
      const partes = item.subtitulo.split('·');
      principio = partes[0].trim() || item.titulo_primario;
      apres = partes[1]?.trim() || '';
    }
  }

  const via = inferirVia(apres || item.titulo_primario);
  const tipoRec = classificarTipoReceituario(item.titulo_primario + ' ' + principio);

  return {
    nome_medicamento: item.titulo_primario,
    principio_ativo: principio.toUpperCase(),
    apresentacao: apres || 'Apresentação padrão',
    posologia: `${via}: Tomar 1 unidade de 12 em 12 horas por 7 dias.`,
    via_administracao: via,
    tipo_receituario: tipoRec,
    dose_unitaria: '1 unidade',
    frequencia_intervalo: 'de 12 em 12 horas',
    duracao_tratamento: 'por 7 dias',
    quantidade_embalagens: 1,
    origem_base: 'Base Clínica Integrada',
  };
}

// =============================================================================
// 3. MOTOR DE ALERGIAS E REATIVIDADE CRUZADA
// =============================================================================

export interface AlertaAlergiaClinica {
  medicamento: string;
  alergia_declarada: string;
  mecanismo_reatividade: string;
  gravidade: 'Critica' | 'Alta';
}

const GRUPOS_CRUZADOS_ALERGIA: {
  alergias_chaves: string[];
  farmacos_cruzados: string[];
  mecanismo: string;
}[] = [
  {
    alergias_chaves: ['penicilina', 'amoxicilina', 'ampicilina', 'beta-lactamico', 'betalactamico'],
    farmacos_cruzados: [
      'penicilina', 'amoxicilina', 'ampicilina', 'oxacilina', 'piperacilina', 'tazobactam',
      'cefalexina', 'ceftriaxona', 'cefazolina', 'cefepima', 'meropenem', 'imipenem', 'ertapenem'
    ],
    mecanismo: 'Reatividade cruzada imunomediada (IgE/Anfilaxia) por anel beta-lactâmico compartilhado.',
  },
  {
    alergias_chaves: ['aine', 'aines', 'anti-inflamatorio', 'antiinflamatorio', 'aspirina', 'aas', 'acido acetilsalicilico', 'ibuprofeno'],
    farmacos_cruzados: [
      'aspirina', 'aas', 'acido acetilsalicilico', 'ibuprofeno', 'cetoprofeno', 'diclofenaco',
      'naproxeno', 'nimesulida', 'meloxicam', 'piroxicam', 'celecoxibe', 'etoricoxibe', 'indometacina', 'tenoxicam'
    ],
    mecanismo: 'Inibição não seletiva da COX-1 com desvio de metabólitos para a via dos leucotrienos (Broncoespasmo/Angioedema).',
  },
  {
    alergias_chaves: ['sulfa', 'sulfonamida', 'bactrim', 'sulfametoxazol'],
    farmacos_cruzados: [
      'sulfametoxazol', 'trimetoprima', 'sulfadiazina', 'furosemida', 'hidroclorotiazida',
      'indapamida', 'clortalidona', 'glibenclamida', 'gliclazida', 'celecoxibe'
    ],
    mecanismo: 'Grupo arilamina sulfonamida com potencial de reação imune tardia e hipersensibilidade cutânea severa (SSJ/NET).',
  },
  {
    alergias_chaves: ['dipirona', 'metamizol', 'novalgina', 'lisador', 'anador'],
    farmacos_cruzados: ['dipirona', 'metamizol', 'pirazolona', 'isometepteno', 'novalgina', 'anador', 'lisador'],
    mecanismo: 'Hipersensibilidade a pirazolônicos com risco de agranulocitose, broncoespasmo e choque anafilático.',
  },
  {
    alergias_chaves: ['iodo', 'contraste iodado'],
    farmacos_cruzados: ['amiodarona', 'contraste iodado', 'lugol', 'povidona', 'iodo'],
    mecanismo: 'Carga de iodo livre com risco de tireotoxicose induzida (Jod-Basedow) ou reação anafilactoide.',
  },
];

export function checarAlergiasDoPaciente(
  blocos: BlocoPrescricao[],
  paciente: Paciente | null
): AlertaAlergiaClinica[] {
  if (!paciente?.alergias || paciente.alergias.length === 0) return [];

  const alertas: AlertaAlergiaClinica[] = [];
  const medicamentosBloco = blocos.filter((b) => b.tipo === 'medicamento');

  for (const med of medicamentosBloco) {
    const textoMed = normalizarTexto(`${med.titulo} ${med.medicamento_detalhe?.principio_ativo || ''} ${med.conteudo}`);

    for (const alergia of paciente.alergias) {
      const alergiaNorm = normalizarTexto(alergia);
      if (!alergiaNorm) continue;

      // 1. Coincidência direta exata / substring
      if (textoMed.includes(alergiaNorm) || alergiaNorm.includes(textoMed.split(' ')[0])) {
        alertas.push({
          medicamento: med.titulo,
          alergia_declarada: alergia,
          mecanismo_reatividade: 'Coincidência direta entre o fármaco prescrito e a alergia documentada.',
          gravidade: 'Critica',
        });
        continue;
      }

      // 2. Reatividade cruzada farmacológica
      for (const grupo of GRUPOS_CRUZADOS_ALERGIA) {
        const pacienteTemAlergiaAoGrupo = grupo.alergias_chaves.some((chave) =>
          alergiaNorm.includes(normalizarTexto(chave))
        );
        if (pacienteTemAlergiaAoGrupo) {
          const farmacoEhDoGrupo = grupo.farmacos_cruzados.some((farmaco) =>
            textoMed.includes(normalizarTexto(farmaco))
          );
          if (farmacoEhDoGrupo) {
            alertas.push({
              medicamento: med.titulo,
              alergia_declarada: alergia,
              mecanismo_reatividade: grupo.mecanismo,
              gravidade: 'Critica',
            });
            break;
          }
        }
      }
    }
  }

  return alertas;
}

// =============================================================================
// 4. AUDITORIA CONSOLIDADA DA RECEITA (ALERGIAS + FTN + 5G)
// =============================================================================

export interface DetalheInteracaoFtnAudit {
  origem: string;
  alvo: string;
  farmacoCitado: string;
  texto: string;
  conduta: string;
  nivel: 'evitar' | 'ajustar' | 'monitorar';
}

export interface RelatorioAuditoriaReceita {
  alertas_criticos: string[];
  alertas_moderados: string[];
  alergias_encontradas: AlertaAlergiaClinica[];
  interacoes_ftn: DetalheInteracaoFtnAudit[];
  relatorio_5g: RelatorioSeguranca5g | null;
  possui_risco_grave: boolean;
}

// Interações clássicas de alta gravidade registradas diretamente
const INTERACOES_CRITICAS_DIRETAS: {
  farmaco_a: string;
  farmaco_b: string;
  gravidade: 'Contraindicada' | 'Grave' | 'Moderada';
  efeito: string;
  conduta: string;
}[] = [
  {
    farmaco_a: 'losartana',
    farmaco_b: 'enalapril',
    gravidade: 'Contraindicada',
    efeito: 'Duplo bloqueio simultâneo do SRAA com risco de insuficiência renal aguda e hipercalemia refratária.',
    conduta: 'Não associar IECA e BRA. Manter apenas um dos agentes.',
  },
  {
    farmaco_a: 'sinvastatina',
    farmaco_b: 'claritromicina',
    gravidade: 'Contraindicada',
    efeito: 'Inibição intensa do CYP3A4 com aumento de até 10x nos níveis de sinvastatina e rabdomiólise fatal.',
    conduta: 'Suspender a sinvastatina durante o tratamento com claritromicina.',
  },
  {
    farmaco_a: 'varfarina',
    farmaco_b: 'acido acetilsalicilico',
    gravidade: 'Grave',
    efeito: 'Potencialização do efeito anticoagulante e antiagregante com risco crítico de hemorragia digestiva e intracraniana.',
    conduta: 'Evitar associação exceto em casos específicos de prótese valvar metálica com estrito controle de RNI.',
  },
  {
    farmaco_a: 'sildenafila',
    farmaco_b: 'mononitrato de isossorbida',
    gravidade: 'Contraindicada',
    efeito: 'Potencialização profunda da via GMPc/óxido nítrico com hipotensão refratária grave e choque.',
    conduta: 'Contraindicação absoluta concomitante.',
  },
  {
    farmaco_a: 'espironolactona',
    farmaco_b: 'cloreto de potassio',
    gravidade: 'Contraindicada',
    efeito: 'Hipercalemia grave potencialmente arritmogênica por retenção renal de potássio somada a suplemento exógeno.',
    conduta: 'Não suplementar potássio na vigência de poupadores de potássio.',
  },
];

export async function auditarReceitaCompleta(
  blocos: BlocoPrescricao[],
  paciente: Paciente | null
): Promise<RelatorioAuditoriaReceita> {
  const alertasCriticos: string[] = [];
  const alertasModerados: string[] = [];

  // Camada 1: Alergias
  const alergias = checarAlergiasDoPaciente(blocos, paciente);
  alergias.forEach((a) => {
    alertasCriticos.push(
      `ALERGIA GRAVE: Paciente alérgico a "${a.alergia_declarada}". Prescrição de "${a.medicamento}" pode desencadear: ${a.mecanismo_reatividade}`
    );
  });

  const blocosMeds = blocos.filter((b) => b.tipo === 'medicamento');
  const nomesMeds = blocosMeds.map((b) => b.medicamento_detalhe?.principio_ativo || b.titulo);

  // Camada 2: Interações do FTN (346 Monografias Oficiais do Ministério da Saúde)
  const interacoesFtnAudit: DetalheInteracaoFtnAudit[] = [];
  if (nomesMeds.length >= 2) {
    try {
      const { MONOGRAFIAS_FTN } = await carregarFormulario();
      const monografiasPrescritas: MonografiaFtn[] = [];

      for (const nome of nomesMeds) {
        const nNorm = normalizarTexto(nome);
        const mono = MONOGRAFIAS_FTN.find(
          (m) =>
            normalizarTexto(m.nome) === nNorm ||
            normalizarTexto(m.nome_busca) === nNorm ||
            nNorm.includes(normalizarTexto(m.nome)) ||
            normalizarTexto(m.nome).includes(nNorm.split(' ')[0])
        );
        if (mono && !monografiasPrescritas.some((m) => m.id_monografia === mono.id_monografia)) {
          monografiasPrescritas.push(mono);
        }
      }

      if (monografiasPrescritas.length >= 2) {
        const paresFtn = cruzarInteracoesFtn(monografiasPrescritas);
        for (const par of paresFtn) {
          const { rotulo, nivel } = rotuloConduta(par.texto);
          interacoesFtnAudit.push({
            origem: par.origem.nome,
            alvo: par.alvo.nome,
            farmacoCitado: par.farmacoCitado,
            texto: par.texto,
            conduta: rotulo,
            nivel,
          });

          const msg = `FTN [${par.origem.nome.toUpperCase()} + ${par.alvo.nome.toUpperCase()}]: ${rotulo} - ${par.texto.slice(0, 150)}...`;
          if (nivel === 'evitar') {
            alertasCriticos.push(msg);
          } else {
            alertasModerados.push(msg);
          }
        }
      }
    } catch {
      // FTN resiliente
    }
  }

  // Camada 3: Interações Críticas Diretas da Base
  for (let i = 0; i < nomesMeds.length; i++) {
    for (let j = i + 1; j < nomesMeds.length; j++) {
      const medA = normalizarTexto(nomesMeds[i]);
      const medB = normalizarTexto(nomesMeds[j]);

      for (const ic of INTERACOES_CRITICAS_DIRETAS) {
        const match =
          (medA.includes(ic.farmaco_a) && medB.includes(ic.farmaco_b)) ||
          (medA.includes(ic.farmaco_b) && medB.includes(ic.farmaco_a));
        if (match) {
          const msg = `INTERAÇÃO ${ic.gravidade.toUpperCase()}: ${nomesMeds[i]} + ${nomesMeds[j]} (${ic.efeito}). Conduta: ${ic.conduta}`;
          if (ic.gravidade === 'Contraindicada' || ic.gravidade === 'Grave') {
            alertasCriticos.push(msg);
          } else {
            alertasModerados.push(msg);
          }
        }
      }
    }
  }

  // Camada 4: Auditoria 5G (Triple Whammy, Tisdale QTc, Carga Anticolinérgica, Cascatas)
  let relatorio5g: RelatorioSeguranca5g | null = null;
  if (nomesMeds.length >= 2) {
    try {
      relatorio5g = avaliarSegurancaMedicamentosa5g(
        nomesMeds,
        paciente?.idade_anos || 65,
        paciente?.sexo === 'F'
      );

      if (relatorio5g.triple_whammy.detectado) {
        alertasCriticos.push(
          `TRIPLE WHAMMY RENAL: IECA/BRA + Diurético + AINE prescritos em conjunto! Risco elevado de Insuficiência Renal Aguda anúrica.`
        );
      }

      if (relatorio5g.escore_tisdale.pontuacao_total >= 11) {
        alertasCriticos.push(
          `RISCO SEVERO DE QTc LONGO (Tisdale ${relatorio5g.escore_tisdale.pontuacao_total} pts): Combinação de fármacos com alto risco de Torsades de Pointes e parada cardiorrespiratória!`
        );
      } else if (relatorio5g.escore_tisdale.pontuacao_total >= 7) {
        alertasModerados.push(
          `ALERTA DE QTc (Tisdale ${relatorio5g.escore_tisdale.pontuacao_total} pts - Risco Moderado): Monitorar ECG e eletrólitos séricos (K+, Mg++).`
        );
      }

      if (relatorio5g.carga_anticolinergica.pontuacao_total >= 3) {
        alertasModerados.push(
          `CARGA ANTICOLINÉRGICA ELEVADA (ACB ${relatorio5g.carga_anticolinergica.pontuacao_total} pts): Risco de delirium agudo, declínio cognitivo, retenção urinária e quedas em idosos.`
        );
      }

      relatorio5g.cascatas.forEach((c) => {
        alertasModerados.push(
          `CASCATA IATROGÊNICA: ${c.farmaco_causador} induzindo uso de ${c.farmaco_prescrito} (${c.efeito_adverso_confundido}). Conduta: ${c.conduta_desprescricao}`
        );
      });
    } catch {
      // Tolerante a falha
    }
  }

  const possuiRiscoGrave = alertasCriticos.length > 0;

  return {
    alertas_criticos: Array.from(new Set(alertasCriticos)),
    alertas_moderados: Array.from(new Set(alertasModerados)),
    alergias_encontradas: alergias,
    interacoes_ftn: interacoesFtnAudit,
    relatorio_5g: relatorio5g,
    possui_risco_grave: possuiRiscoGrave,
  };
}
