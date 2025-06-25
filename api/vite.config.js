import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:80',
      '/ws': {
        target: 'ws://localhost:80',
        ws: true
      }
    }
  }
});
