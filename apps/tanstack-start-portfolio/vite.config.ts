import tailwind from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  server: {
    port: 1337,
  },
  plugins: [
    tsConfigPaths(),
    tanstackStart(),
    tailwind(),
    // react's vite plugin must come after start's vite plugin
    viteReact(),
  ],
})