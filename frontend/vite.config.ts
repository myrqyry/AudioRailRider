import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'shared': path.resolve(__dirname, '../shared'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    // Explicitly include dependencies that sometimes cause optimize-deps
    // race conditions or 504 "Outdated Optimize Dep" responses in the
    // browser. Adding 'zod' here ensures Vite pre-bundles it reliably.
    include: ['zod'],
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
