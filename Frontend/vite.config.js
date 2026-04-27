import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,                    // Enables 'describe', 'it', 'expect' globally
    environment: 'jsdom',             // Default to jsdom
    setupFiles: './src/setupTests.js', // Points to your existing CRA setup file
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/setupTests.js',
      ]
    }
  }
});
