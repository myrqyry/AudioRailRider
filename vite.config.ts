import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Ensure proper resolution of Meyda
      'meyda': 'meyda/dist/web',
    },
  },
  optimizeDeps: {
    include: ['meyda'],
    esbuildOptions: {
      // This ensures proper handling of browser field in package.json
      mainFields: ['browser', 'module', 'main'],
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
