import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  return {
    base: mode === 'production' ? '/adminweb/' : '/',
    root: __dirname,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      port: 3001,
      proxy: {
        '/api': {
          // --- LOCALHOST PROXY (Active for localhost:3001 dev) ---
          target: process.env.VITE_API_URL || 'http://127.0.0.1:3000',

          // --- LIVE PRODUCTION PROXY (Commented out for local dev) ---
          // target: 'https://skillhub.vgmsofttech.com',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: path.resolve(__dirname, '../dist-admin'),
      emptyOutDir: true,
    },
  };
});
