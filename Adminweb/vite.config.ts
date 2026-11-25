import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  return {
    base: process.env.VITE_BASE_PATH || './',
    root: __dirname,
    publicDir: path.resolve(__dirname, 'public'),
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
          target: process.env.VITE_API_URL || 'https://skillhub.vgmsofttech.com',
          changeOrigin: true,
          secure: true,
        },
      },
    },
    build: {
      outDir: path.resolve(__dirname, '../dist-admin'),
      emptyOutDir: true,
    },
  };
});
