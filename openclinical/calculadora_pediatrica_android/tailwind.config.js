import base from '../frontend_ui/tailwind.config.js';

/** Mesmo tema do app principal; varre também os componentes reaproveitados de ../frontend_ui/src */
export default {
  ...base,
  content: ['./index.html', './src/**/*.{ts,tsx}', '../frontend_ui/src/**/*.{ts,tsx}'],
};
