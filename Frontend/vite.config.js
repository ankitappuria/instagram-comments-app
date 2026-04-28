import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    
  ],
  test: {
    // 👋 add the line below to add jsdom to vite
    environment: 'jsdom',
    setupFiles: './tests/setup.js'
  }
})
