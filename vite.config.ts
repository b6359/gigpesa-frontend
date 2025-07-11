import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths'; // 👈 Import the alias plugin

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths() // 👈 Register the alias plugin
  ]
});
