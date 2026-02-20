import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 1. On importe le plugin Tailwind 4

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(), // 2. On ajoute le moteur Tailwind 4 avant le plugin React
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
})