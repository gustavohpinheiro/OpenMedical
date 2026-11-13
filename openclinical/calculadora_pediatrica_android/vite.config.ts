import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// O app reaproveita o código do app principal direto de ../frontend_ui/src (sem cópias):
// todo rebuild do APK pega a versão atual da calculadora, dos esquemas do FTN e do catálogo CMED.
const FRONTEND = path.resolve(__dirname, '../frontend_ui');

export default defineConfig({
  plugins: [react()],
  // Caminhos relativos: o Capacitor serve os arquivos de dentro do APK
  base: './',
  resolve: {
    alias: { '@openclinical': path.join(FRONTEND, 'src') },
    // Os módulos de ../frontend_ui importam react/lucide-react: uma só cópia, a deste projeto
    dedupe: ['react', 'react-dom', 'lucide-react'],
  },
  server: {
    port: 5174,
    strictPort: true,
    fs: { allow: [__dirname, FRONTEND] },
  },
  build: {
    target: 'chrome89',
    outDir: 'dist',
    // O FTN e o catálogo CMED offline são módulos de dados grandes, carregados sob demanda
    chunkSizeWarningLimit: 3500,
  },
});
