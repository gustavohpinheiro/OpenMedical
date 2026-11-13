import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
// Fontes empacotadas localmente: o app funciona offline
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import '@fontsource/plus-jakarta-sans/800.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
// Mesmo CSS do app principal (inclui o ajuste de contraste do tema claro)
import '@openclinical/index.css';
import './app.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
