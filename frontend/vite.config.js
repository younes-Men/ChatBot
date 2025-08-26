import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),  // Ajoute le plugin React
    tailwindcss(),  // Garde le plugin TailwindCSS
  ],
});
