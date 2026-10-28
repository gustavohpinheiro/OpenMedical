import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Lista os arquivos do build para o service worker pré-carregar na instalação:
// assim o PWA funciona offline já após o primeiro acesso, inclusive telas carregadas sob demanda.
function manifestoPrecache(): Plugin {
  return {
    name: 'openclinical-manifesto-precache',
    apply: 'build',
    generateBundle(_opcoes, bundle) {
      const arquivos = Object.keys(bundle)
        .filter((nome) => /\.(js|css|woff2)$/.test(nome))
        // Só os subconjuntos de fonte usados em português (latin / latin-ext)
        .filter((nome) => !/\.woff2$/.test(nome) || /-latin(-ext)?-/.test(nome))
        .map((nome) => `/${nome}`);
      this.emitFile({
        type: 'asset',
        fileName: 'precache-manifest.json',
        source: JSON.stringify(arquivos),
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), manifestoPrecache()],
  clearScreen: false,
  server: {
    port: 5173,
    strictPort: true,
  },
  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    target: process.env.TAURI_PLATFORM === 'windows' ? 'chrome105' : 'safari13',
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    sourcemap: !!process.env.TAURI_DEBUG,
    outDir: 'dist',
    // O catálogo CMED offline é um módulo de dados grande, carregado sob demanda
    chunkSizeWarningLimit: 2000,
  },
});
