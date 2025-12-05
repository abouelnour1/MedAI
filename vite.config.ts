import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allow access via IP address (fixes "localhost refused" on mobile testing)
    port: 5173,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});