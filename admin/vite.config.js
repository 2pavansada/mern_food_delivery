import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
    base: process.env.VITE_BASE_PATH || (command === 'build' ? '/admin/' : '/'),
    resolve: {
      preserveSymlinks: true
    },
    server: {
      port: 5174,
      strictPort: true,
      host: 'localhost'
    }
  };
});
