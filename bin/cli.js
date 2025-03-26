#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path'); // Import path module

console.log('[WRAPPER LOG] Starting urllog wrapper script...');
console.log(`[WRAPPER LOG] Current Working Directory: ${process.cwd()}`);
console.log(`[WRAPPER LOG] Arguments received: ${process.argv.slice(2).join(' ')}`);

const scriptPath = path.resolve(__dirname, '../dist/index.js'); // Get absolute path to dist/index.js
console.log(`[WRAPPER LOG] Attempting to execute: node ${scriptPath}`);

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
    Usage: npx @textnav/urllog [options] <url>

    Options:
      -h, --help  Show this help message
  `);
  console.log('[WRAPPER LOG] Displayed help message.');
} else {
  try {
    // Use execSync to run the compiled index.js, passing along all arguments
    execSync(`node ${scriptPath} ${process.argv.slice(2).join(' ')}`, { stdio: 'inherit' });
    console.log('[WRAPPER LOG] Execution finished.');
  } catch (error) {
    console.error('[WRAPPER LOG] Error during execution:', error.message);
    process.exit(1); // Ensure the wrapper script exits with an error code if the main script fails
  }
}