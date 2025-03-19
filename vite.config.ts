import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'), // Entry point
      name: 'urllog', // Global variable name (not used in CJS)
      formats: ['cjs'], // Output format: CommonJS
      fileName: (format) => `index.js`, // Output file name
    },
    rollupOptions: {
      // Make sure to externalize deps that shouldn't be bundled
      external: ['@playwright/test', 'fs', 'path', 'rimraf'],
    },
    outDir: 'dist', // Output directory
  },
});