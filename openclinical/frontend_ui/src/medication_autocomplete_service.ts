import { carregarFormulario, normalizarTexto, inferirVia } from './formulario_utils.ts';
import { classificarTipoReceituario } from './clinical_auditor.ts';
import type { MonografiaFtn } from './data/formulario_terapeutico.ts';

export interface SugestaoMedicamento {
  id: string;
  nome: string;
  subtitulo?: string;
  tipo: 'classe_alergica' | 'principio_ativo' | 'comercial' | 'outro';
  detalhes?: {
    principio_ativo?: string;
    apresentacao?: string;
    via_administracao?: string;
    posologia?: string;
    tipo_receituario?: 'simples' | 'controle_especial_c1' | 'antimicrobiano' | 'notificacao_b_azul' | 'notificacao_a_amarela';
  };
}

export const CLASSES_ALERGICAS_CLINICAS: {
  nome: string;
  classe: string;
  exemplos: string[];
  mecanismo: string;
}[] = [
  {
    nome: 'Penicilinas',
    classe: 'Beta-lactâmicos',
    exemplos: ['Amoxicilina', 'Ampicilina', 'Benzetacil (Penicilina Benzatina)', 'Oxacilina', 'Piperacilina'],
    mecanismo: 'Risco de choque anafilático ou urticária por anel beta-lactâmico.',
  },
  {
    nome: 'Cefalosporinas',
    classe: 'Beta-lactâmicos',
    exemplos: ['Cefalexina', 'Ceftriaxona', 'Cefazolina', 'Cefepima'],
    mecanismo: 'Reatividade cruzada com penicilinas em ~1-3% dos pacientes.',
  },
  {
    nome: 'AINEs (Anti-inflamatórios Não Esteroidais)',
    classe: 'Anti-inflamatórios',
    exemplos: ['Ibuprofeno', 'Diclofenaco', 'Cetoprofeno', 'Nimesulida', 'AAS / Aspirina', 'Piroxicam', 'Celecoxibe'],
    mecanismo: 'Inibição de COX-1 com desvio para leucotrienos (Broncoespasmo/Angioedema).',
  },
  {
    nome: 'Dipirona / Pirazolonas',
    classe: 'Analgésicos Pirazolônicos',
    exemplos: ['Dipirona Monoidratada', 'Novalgina', 'Lisador', 'Anador', 'Dorflex'],
    mecanismo: 'Hipersensibilidade aguda com risco de choque anafilático e agranulocitose.',
  },
  {
    nome: 'Sulfas / Sulfonamidas',
    classe: 'Antimicrobianos e Diuréticos',
    exemplos: ['Sulfametoxazol + Trimetoprima (Bactrim)', 'Sulfadiazina', 'Furosemida'],
    mecanismo: 'Grupo arilamina com risco de reações cutâneas graves (SSJ/NET).',
  },
  {
    nome: 'Opioides e Derivados Morfínicos',
    classe: 'Analgésicos Narcóticos',
    exemplos: ['Morfina', 'Tramadol', 'Codeína', 'Fentanil', 'Oxicodona', 'Metadona'],
    mecanismo: 'Liberação direta de histamina mastocitária ou reação imune.',
  },
  {
    nome: 'Quinolonas / Fluoroquinolonas',
    classe: 'Antimicrobianos',
    exemplos: ['Ciprofloxacino', 'Levofloxacino', 'Moxifloxacino', 'Norfloxacino'],
    mecanismo: 'Hipersensibilidade imediata e risco de tendinopatia.',
  },
  {
    nome: 'Macrolídeos',
    classe: 'Antimicrobianos',
    exemplos: ['Azitromicina', 'Claritromicina', 'Eritromicina'],
    mecanismo: 'Reações cutâneas e prolongamento do intervalo QTc.',
  },
  {
    nome: 'Aminoglicosídeos',
    classe: 'Antimicrobianos',
    exemplos: ['Gentamicina', 'Amicacina', 'Tobramicina'],
    mecanismo: 'Nefrotoxicidade e ototoxicidade graves associadas.',
  },
  {
    nome: 'Contrastes Iodados / Iodo',
    classe: 'Agentes Radiológicos',
    exemplos: ['Contraste TC (Iohexol, Iopamidol)', 'Povidona-Iodo', 'Amiodarona'],
    mecanismo: 'Reação anafilactoide direta por hiperosmolaridade.',
  },
  {
    nome: 'Inibidores da ECA (IECA)',
    classe: 'Anti-hipertensivos',
    exemplos: ['Captopril', 'Enalapril', 'Ramipril'],
    mecanismo: 'Tosse seca intratável e angioedema de vias aéreas superiores por bradicinina.',
  },
  {
    nome: 'Anticonvulsivantes Aromáticos',
    classe: 'Neurologia',
    exemplos: ['Carbamazepina', 'Fenitoína', 'Lamotrigina', 'Fenobarbital'],
    mecanismo: 'Síndrome DRESS e hipersensibilidade cutânea severa.',
  },
  {
    nome: 'Anestésicos Locais',
    classe: 'Anestésicos',
    exemplos: ['Lidocaína', 'Bupivacaína', 'Prilocaína', 'Procaína'],
    mecanismo: 'Reações alérgicas ou conservantes bissulfitos associados.',
  },
  {
    nome: 'Estatinas',
    classe: 'Hipolipemiantes',
    exemplos: ['Sinvastatina', 'Atorvastatina', 'Rosuvastatina'],
    mecanismo: 'Miopatia severa, rabdomiólise e hipersensibilidade.',
  },
  {
    nome: 'Látex / Borracha Natural',
    classe: 'Material Médico-Cirúrgico',
    exemplos: ['Luvas cirúrgicas', 'Equipos', 'Sondas de foley'],
    mecanismo: 'Anafilaxia intraoperatória grave.',
  },
  {
    nome: 'Frutos do Mar / Crustáceos',
    classe: 'Alérgeno Alimentar',
    exemplos: ['Camarão', 'Caranguejo', 'Lagosta'],
    mecanismo: 'Anafilaxia por tropomiosina.',
  },
  {
    nome: 'Ovo / Albumina de Ovo',
    classe: 'Alérgeno Alimentar / Vacinas',
    exemplos: ['Clara de ovo', 'Vacinas cultivadas em embrião de galinha'],
    mecanismo: 'Precaução em esquemas de imunização.',
  },
];

// Nomes comerciais frequentes de farmácia mapeados para princípios ativos
const MARCAS_COMERCIAIS_FREQUENTES: { marca: string; principio: string; apresentacao: string }[] = [
  { marca: 'Novalgina', principio: 'Dipirona', apresentacao: 'Comprimido 1g ou Gotas 500mg/mL' },
  { marca: 'Amoxil', principio: 'Amoxicilina', apresentacao: 'Cápsulas 500mg ou Suspensão 250mg/5mL' },
  { marca: 'Clavulin', principio: 'Amoxicilina + Clavulanato', apresentacao: 'Comprimido 875mg + 125mg' },
  { marca: 'Voltaren', principio: 'Diclofenaco de Sódio', apresentacao: 'Comprimido 50mg ou Injetável 75mg' },
  { marca: 'Cataflam', principio: 'Diclofenaco Potássico', apresentacao: 'Drágea 50mg ou Gotas 15mg/mL' },
  { marca: 'Tylenol', principio: 'Paracetamol', apresentacao: 'Comprimido 750mg ou Gotas 200mg/mL' },
  { marca: 'Advil', principio: 'Ibuprofeno', apresentacao: 'Cápsula líquida 400mg' },
  { marca: 'Glifage', principio: 'Metformina', apresentacao: 'Comprimido 500mg ou 850mg XR' },
  { marca: 'Cozaar', principio: 'Losartana Potássica', apresentacao: 'Comprimido 50mg ou 100mg' },
  { marca: 'Renitec', principio: 'Enalapril', apresentacao: 'Comprimido 10mg ou 20mg' },
  { marca: 'Rocefin', principio: 'Ceftriaxona', apresentacao: 'Frasco-ampola 1g IV/IM' },
  { marca: 'Keflex', principio: 'Cefalexina', apresentacao: 'Drágea 500mg ou Suspensão 250mg/5mL' },
  { marca: 'Bactrim', principio: 'Sulfametoxazol + Trimetoprima', apresentacao: 'Comprimido 400mg+80mg ou F 800mg+160mg' },
  { marca: 'Plasil', principio: 'Metoclopramida', apresentacao: 'Comprimido 10mg ou Gotas 4mg/mL' },
  { marca: 'Dramin', principio: 'Dimenidrinato', apresentacao: 'Comprimido 100mg ou Gotas B6' },
  { marca: 'Buscopan Composto', principio: 'Butilbrometo de Escopolamina + Dipirona', apresentacao: 'Drágea ou Gotas' },
  { marca: 'Rivotril', principio: 'Clonazepam', apresentacao: 'Comprimido 2mg ou Gotas 2.5mg/mL' },
  { marca: 'Valium', principio: 'Diazepam', apresentacao: 'Comprimido 10mg ou Injetável' },
  { marca: 'Frontal', principio: 'Alprazolam', apresentacao: 'Comprimido 0.5mg ou 1mg' },
  { marca: 'Lexotan', principio: 'Bromazepam', apresentacao: 'Comprimido 3mg ou 6mg' },
  { marca: 'Prozac', principio: 'Fluoxetina', apresentacao: 'Cápsula 20mg' },
  { marca: 'Zoloft', principio: 'Sertralina', apresentacao: 'Comprimido 50mg' },
  { marca: 'Puran T4', principio: 'Levotiroxina Sódica', apresentacao: 'Comprimido 25mcg a 150mcg' },
  { marca: 'AAS Infantil', principio: 'Ácido Acetilsalicílico', apresentacao: 'Comprimido 100mg' },
  { marca: 'Aspirina Prevent', principio: 'Ácido Acetilsalicílico', apresentacao: 'Comprimido 100mg' },
  { marca: 'Zyloric', principio: 'Alopurinol', apresentacao: 'Comprimido 100mg ou 300mg' },
  { marca: 'Selozok', principio: 'Succinato de Metoprolol', apresentacao: 'Comprimido 25mg ou 50mg' },
  { marca: 'Lasix', principio: 'Furosemida', apresentacao: 'Comprimido 40mg ou Ampola 20mg' },
  { marca: 'Aldactone', principio: 'Espironolactona', apresentacao: 'Comprimido 25mg ou 100mg' },
  { marca: 'Cipro', principio: 'Ciprofloxacino', apresentacao: 'Comprimido 500mg' },
  { marca: 'Zithromax', principio: 'Azitromicina', apresentacao: 'Comprimido 500mg' },
  { marca: 'Pantocal', principio: 'Pantoprazol', apresentacao: 'Comprimido 40mg' },
  { marca: 'Losec', principio: 'Omeprazol', apresentacao: 'Cápsula 20mg' },
];

let monografiasCache: MonografiaFtn[] | null = null;

async function obterMonografias(): Promise<MonografiaFtn[]> {
  if (monografiasCache) return monografiasCache;
  try {
    const { MONOGRAFIAS_FTN } = await carregarFormulario();
    monografiasCache = MONOGRAFIAS_FTN;
    return MONOGRAFIAS_FTN;
  } catch (e) {
    console.warn('Erro ao carregar monografias do FTN para autocomplete:', e);
    return [];
  }
}

/**
 * Busca sugestões inteligentes de medicamentos ou classes alérgicas
 */
export async function buscarSugestoesMedicamentos(
  termo: string,
  opcoes: { modoAlergia?: boolean; limite?: number } = {}
): Promise<SugestaoMedicamento[]> {
  const { modoAlergia = false, limite = 12 } = opcoes;
  const termoNorm = normalizarTexto(termo);

  const sugestoes: SugestaoMedicamento[] = [];

  // Se o termo estiver vazio em modo alergia, retorna as classes mais comuns imediatamente
  if (!termoNorm) {
    if (modoAlergia) {
      return CLASSES_ALERGICAS_CLINICAS.slice(0, 8).map((c) => ({
        id: `alergia_classe_${c.nome}`,
        nome: c.nome,
        subtitulo: `Exemplos: ${c.exemplos.slice(0, 3).join(', ')}`,
        tipo: 'classe_alergica',
      }));
    }
    return [];
  }

  // 1. Classes Alérgicas Farmacológicas (prioridade máxima em modo alergia)
  for (const c of CLASSES_ALERGICAS_CLINICAS) {
    const nomeNorm = normalizarTexto(c.nome);
    const classeNorm = normalizarTexto(c.classe);
    const exemplosNorm = normalizarTexto(c.exemplos.join(' '));

    const matchNome = nomeNorm.includes(termoNorm);
    const matchClasse = classeNorm.includes(termoNorm);
    const matchExemplo = exemplosNorm.includes(termoNorm);

    if (matchNome || matchClasse || matchExemplo) {
      sugestoes.push({
        id: `alergia_classe_${c.nome}`,
        nome: c.nome,
        subtitulo: `Classe: ${c.classe} · ${c.exemplos.slice(0, 3).join(', ')}`,
        tipo: 'classe_alergica',
      });
    }
  }

  // 2. Monografias FTN (Princípios Ativos Oficiais do Ministério da Saúde)
  const monografias = await obterMonografias();
  for (const m of monografias) {
    const nomeNorm = normalizarTexto(m.nome);
    const buscaNorm = normalizarTexto(m.nome_busca);

    if (nomeNorm.includes(termoNorm) || buscaNorm.includes(termoNorm)) {
      const nomeCapitalizado = m.nome.charAt(0).toUpperCase() + m.nome.slice(1);
      const apres = m.apresentacoes[0] || 'Apresentação padronizada';
      const via = inferirVia(apres);
      const esquema = m.esquemas_administracao?.[0] || 'Tomar conforme prescrição médica.';
      const esquemaTexto = typeof esquema === 'string' ? esquema : (esquema as any)?.texto || 'Tomar conforme prescrição médica.';
      const tipoRec = classificarTipoReceituario(m.nome);

      // Evita duplicatas se já adicionado
      if (!sugestoes.some((s) => normalizarTexto(s.nome) === nomeNorm)) {
        sugestoes.push({
          id: `ftn_${m.id_monografia}`,
          nome: nomeCapitalizado,
          subtitulo: `FTN / RENAME · ${m.apresentacoes.slice(0, 2).join(' · ')}`,
          tipo: 'principio_ativo',
          detalhes: {
            principio_ativo: m.nome.toUpperCase(),
            apresentacao: apres,
            via_administracao: via,
            posologia: `${via}: ${esquemaTexto}`,
            tipo_receituario: tipoRec,
          },
        });
      }
    }
    if (sugestoes.length >= limite * 2) break;
  }

  // 3. Marcas Comerciais Frequentes
  for (const item of MARCAS_COMERCIAIS_FREQUENTES) {
    const marcaNorm = normalizarTexto(item.marca);
    const princNorm = normalizarTexto(item.principio);

    if (marcaNorm.includes(termoNorm) || princNorm.includes(termoNorm)) {
      if (!sugestoes.some((s) => normalizarTexto(s.nome) === marcaNorm)) {
        const tipoRec = classificarTipoReceituario(item.principio);
        const via = inferirVia(item.apresentacao);
        sugestoes.push({
          id: `comercial_${item.marca}`,
          nome: item.marca,
          subtitulo: `${item.principio} · ${item.apresentacao}`,
          tipo: 'comercial',
          detalhes: {
            principio_ativo: item.principio.toUpperCase(),
            apresentacao: item.apresentacao,
            via_administracao: via,
            posologia: `${via}: Tomar 1 unidade de 12 em 12 horas por 7 dias.`,
            tipo_receituario: tipoRec,
          },
        });
      }
    }
    if (sugestoes.length >= limite * 2) break;
  }

  // Ordenação de relevância:
  // - StartsWith tem prioridade sobre includes
  // - Em modoAlergia, classe_alergica fica em primeiro
  sugestoes.sort((a, b) => {
    const aNorm = normalizarTexto(a.nome);
    const bNorm = normalizarTexto(b.nome);

    if (modoAlergia) {
      if (a.tipo === 'classe_alergica' && b.tipo !== 'classe_alergica') return -1;
      if (b.tipo === 'classe_alergica' && a.tipo !== 'classe_alergica') return 1;
    }

    const aStarts = aNorm.startsWith(termoNorm);
    const bStarts = bNorm.startsWith(termoNorm);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;

    return a.nome.localeCompare(b.nome);
  });

  return sugestoes.slice(0, limite);
}
