// Browser environment setup for Vitest
// Polyfill for CommonJS modules in browser context

// Define exports and module for CommonJS compatibility
if (typeof window !== 'undefined') {
  if (!window.exports) {
    window.exports = {};
  }
  if (!window.module) {
    window.module = { exports: {} };
  }
}

// Setup any global browser test utilities
export {};
