import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: false,
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Backend server URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
