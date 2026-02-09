import {defineConfig} from 'vite';
import {resolve} from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@shared': resolve(__dirname, '../shared/src'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
  },
});
