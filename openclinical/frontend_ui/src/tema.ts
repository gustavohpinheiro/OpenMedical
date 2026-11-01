// =============================================================================
// Gestão de Temas Clínicos: Claro (Hospitalar/Diurno) & Escuro (Sala Vermelha/Noturno)
// =============================================================================

export type TemaClinico = 'claro' | 'escuro';

const KEY_TEMA = 'openclinical_tema';

export function obterTemaAtual(): TemaClinico {
  try {
    const salvo = localStorage.getItem(KEY_TEMA);
    if (salvo === 'claro' || salvo === 'escuro') {
      return salvo;
    }
  } catch {
    // fallback
  }
  // Padrão escuro clínico (alta ergonomia para plantões e salas de exame)
  return 'escuro';
}

export function aplicarTema(tema: TemaClinico): void {
  try {
    localStorage.setItem(KEY_TEMA, tema);
    const root = document.documentElement;

    if (tema === 'escuro') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.style.colorScheme = 'light';
    }

    window.dispatchEvent(new CustomEvent('openclinical_tema_alterado', { detail: tema }));
  } catch (e) {
    console.error('Erro ao aplicar tema:', e);
  }
}

export function alternarTema(): TemaClinico {
  const atual = obterTemaAtual();
  const novo = atual === 'escuro' ? 'claro' : 'escuro';
  aplicarTema(novo);
  return novo;
}
