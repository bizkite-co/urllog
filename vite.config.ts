import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 5174,
  },
  build: {
    ssr: true,
    target: 'node16', // Specify Node.js version
    lib: {
      entry: resolve(__dirname, 'src/index.ts'), // Entry point
      name: 'urllog', // Global variable name (not used in CJS)
      formats: ['es'], // Output format: ES Modules
      fileName: (format) => `index.js`, // Output file name
    },
    rollupOptions: {
      // Make sure to externalize deps that shouldn't be bundled
      // external: ['@playwright/test', 'fs', 'path', 'rimraf'], // Removing external
    },
    outDir: 'dist', // Output directory
  },
});