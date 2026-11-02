import React from 'react';

export interface OpenClinicalLogoProps {
  variant?: 'full' | 'icon' | 'compact';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtitle?: boolean;
}

export const OPENCLINICAL_ICON_SVG = `
<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ocGradMain" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f766e" />
      <stop offset="45%" stop-color="#0d9488" />
      <stop offset="100%" stop-color="#10b981" />
    </linearGradient>
    <linearGradient id="ocGradPulse" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#6ee7b7" />
    </linearGradient>
    <linearGradient id="ocGradGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2dd4bf" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#047857" stop-opacity="0.05" />
    </linearGradient>
    <filter id="ocShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#0f766e" flood-opacity="0.25" />
    </filter>
  </defs>

  <!-- Escudo / Brasão Clínico com Cantos Arredondados Nobres -->
  <rect x="6" y="6" width="88" height="88" rx="24" fill="url(#ocGradMain)" filter="url(#ocShadow)" />
  <rect x="8" y="8" width="84" height="84" rx="22" stroke="white" stroke-opacity="0.2" stroke-width="1.5" />
  <rect x="12" y="12" width="76" height="76" rx="18" fill="url(#ocGradGlow)" />

  <!-- Cruz Médica Clássica com Proporções Áureas -->
  <!-- Barra Vertical -->
  <rect x="42" y="22" width="16" height="56" rx="8" fill="#ffffff" fill-opacity="0.95" />
  <!-- Barra Horizontal -->
  <rect x="22" y="42" width="56" height="16" rx="8" fill="#ffffff" fill-opacity="0.95" />

  <!-- Pulso Eletrocardiográfico e Curva de Precisão Integrada -->
  <path
    d="M 18 50 L 34 50 L 40 43 L 46 61 L 52 35 L 58 55 L 64 50 L 82 50"
    stroke="url(#ocGradPulse)"
    stroke-width="3.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  />

  <!-- Ponto Vital Pulsante Central -->
  <circle cx="52" cy="35" r="3" fill="#ffffff" />
  <circle cx="52" cy="35" r="5" stroke="#38bdf8" stroke-width="1.2" stroke-opacity="0.8" />
</svg>
`.trim();

export const OPENCLINICAL_LOGO_BASE64 = `data:image/svg+xml;utf8,${encodeURIComponent(OPENCLINICAL_ICON_SVG)}`;

export const OpenClinicalLogo: React.FC<OpenClinicalLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  showSubtitle = true,
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-sm', sub: 'text-[9px]' },
    md: { icon: 'w-9 h-9', text: 'text-base', sub: 'text-[10px]' },
    lg: { icon: 'w-12 h-12', text: 'text-xl', sub: 'text-xs' },
    xl: { icon: 'w-16 h-16', text: 'text-2xl', sub: 'text-sm' },
  };

  const curSize = sizeMap[size];

  if (variant === 'icon') {
    return (
      <div className={`relative inline-flex items-center justify-center flex-shrink-0 ${curSize.icon} ${className}`}>
        <div
          dangerouslySetInnerHTML={{ __html: OPENCLINICAL_ICON_SVG }}
          className="w-full h-full drop-shadow-md hover:scale-105 transition-transform"
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Ícone / Brasão */}
      <div className={`relative flex-shrink-0 ${curSize.icon}`}>
        <div
          dangerouslySetInnerHTML={{ __html: OPENCLINICAL_ICON_SVG }}
          className="w-full h-full drop-shadow-md"
        />
      </div>

      {/* Identidade Tipográfica */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <span className={`font-black tracking-tight font-sans ${curSize.text} leading-none text-slate-900 dark:text-white`}>
            Open<span className="bg-gradient-to-r from-teal-600 to-emerald-500 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">Clinical</span>
          </span>
          <span className="text-[9px] font-extrabold uppercase tracking-wider bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30 px-1.5 py-0.5 rounded-md font-mono">
            Pro
          </span>
        </div>

        {showSubtitle && variant !== 'compact' && (
          <p className={`${curSize.sub} text-slate-500 dark:text-slate-400 font-medium leading-tight mt-0.5`}>
            Prescrição Médica Inteligente &bull; SUS &bull; CFM
          </p>
        )}
      </div>
    </div>
  );
};
