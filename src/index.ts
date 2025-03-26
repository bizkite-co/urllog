#!/usr/bin/env node --import=tsx
/**
 * This script uses Playwright to inspect the application running at a specified URL.
 * It captures a screenshot, the page content, console logs, and executes JavaScript code.
 *
 * Usage:
 * 1. Make sure the application is running: `npm run dev`
 * 2. Run this script: `npx . <url>` (or `npm run inspect -- <url>` if you add a script to package.json)
 *
 * Features:
 * - Navigates to the specified URL
 * - Captures and saves a screenshot as scripts/inspect/screenshot.png
 * - Captures and saves the page content as scripts/inspect/page.html
 * - Captures and saves the console log as scripts/inspect/console.log
 * - Executes JavaScript code in the browser context and saves the result to scripts/inspect/js_result.txt
 * - Focuses the terminal and types 'ls -la', saving the result to scripts/inspect/interaction_result.txt.
 *   You can modify the typed command in the `inspect` function.
 * - Includes error handling for page navigation failures.
 */
import { chromium, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { rimrafSync } from 'rimraf';
import arg from 'arg';
import { fileURLToPath } from 'url'; // Keep for potential future use if needed elsewhere

console.log('[INDEX LOG] Script start.'); // Log at the very beginning

/**
 * Executes JavaScript code in the context of the page and saves the result to a file.
 * @param page The Playwright page object.
 * @param script The JavaScript code to execute.
 * @param fileName The name of the file to save the result to.
 */
async function executeJavaScript(page: Page, script: string, fileName: string) {
  console.log(`[INDEX LOG] Executing JavaScript and saving to ${fileName}...`);
  try {
    const result = await page.evaluate(script);
    const resultString = result !== undefined ? JSON.stringify(result, null, 2) : 'No result';
    fs.writeFileSync(fileName, resultString);
    console.log(`[INDEX LOG] JavaScript execution successful.`);
  } catch (error) {
    console.error('[INDEX LOG] Error executing JavaScript:', error);
    fs.writeFileSync(fileName, `Error: ${error}`);
  }
}

export async function parseArgs() {
    console.log('[INDEX LOG] Parsing arguments...');
    if (process.env.NODE_ENV === 'test') {
        console.log('[INDEX LOG] Skipping argument parsing in test environment.');
        return;
    }
  const args = arg({
    '--help': Boolean,
    '-h': '--help',
  });

  if (args['--help']) {
    console.log(`
      Usage: npx . [options] <url>

      Options:
        -h, --help  Show this help message
    `);
    console.log('[INDEX LOG] Displayed help message.');
    return; // Return instead of process.exit(0)
  }

  if (args._.length === 0) {
    console.error('[INDEX LOG] Error: Missing URL argument.');
    console.log('Usage: npx . <url>');
    process.exit(1);
  }
  const url = args._[0];
  console.log(`[INDEX LOG] URL argument provided: ${url}`);

  // Call inspect() here, after parsing arguments
  console.log('[INDEX LOG] Calling inspect function...');
  await inspect(url);
}

export async function inspect(url: string = '', overrideUrl?: string) {
  const inspectUrl = overrideUrl || url;
  console.log(`[INDEX LOG] Starting inspection for URL: ${inspectUrl}`);
  console.log(`[INDEX LOG] Current Working Directory: ${process.cwd()}`); // Log CWD

  const inspectDir = 'urllog-output';
  const absoluteInspectDir = path.resolve(process.cwd(), inspectDir); // Get absolute path
  console.log(`[INDEX LOG] Output directory relative path: ${inspectDir}`);
  console.log(`[INDEX LOG] Output directory absolute path: ${absoluteInspectDir}`); // Log absolute path

  console.log(`[INDEX LOG] Cleaning output directory: ${absoluteInspectDir}...`);
  rimrafSync(absoluteInspectDir); // Use absolute path
  console.log(`[INDEX LOG] Output directory cleaned.`);

  console.log(`[INDEX LOG] Creating output directory: ${absoluteInspectDir}...`);
  fs.mkdirSync(absoluteInspectDir, { recursive: true }); // Use absolute path
  console.log(`[INDEX LOG] Output directory created.`);

  let browserServer;
  let browser;
  try {
      console.log('[INDEX LOG] Launching browser server...');
      browserServer = await chromium.launchServer(); // Use launchServer
      const wsEndpoint = browserServer.wsEndpoint();
      console.log(`[INDEX LOG] Browser server launched at ${wsEndpoint}. Connecting...`);
      browser = await chromium.connect({ wsEndpoint }); // Connect to the server
      console.log('[INDEX LOG] Connected to browser server.');
  } catch (error) {
      console.error('[INDEX LOG] Error launching or connecting to browser:', error);
      process.exit(1);
  }

  console.log('[INDEX LOG] Creating new browser context...');
  const context = await browser.newContext(); // Create a new browser context
  console.log('[INDEX LOG] Browser context created. Creating new page...');
  const page = await context.newPage();
  console.log('[INDEX LOG] New page created.');

  // Capture console output
  const consoleLogs: string[] = [];
  page.on('console', msg => {
    const timestamp = new Date().toISOString();
    consoleLogs.push(`[${timestamp}] ${msg.text()}`);
  });
  console.log('[INDEX LOG] Console message listener attached.');

  try {
    console.log(`[INDEX LOG] Navigating to ${inspectUrl}...`);
    await page.goto(inspectUrl);
    console.log(`[INDEX LOG] Navigation to ${inspectUrl} successful.`);

    const screenshotPath = path.join(absoluteInspectDir, 'screenshot.png');
    console.log(`[INDEX LOG] Taking screenshot to ${screenshotPath}...`);
    await page.screenshot({ path: screenshotPath }); // Use absolute path
    console.log(`[INDEX LOG] Screenshot saved.`);

    const pageHtmlPath = path.join(absoluteInspectDir, 'page.html');
    console.log(`[INDEX LOG] Getting page content and saving to ${pageHtmlPath}...`);
    const pageContent = await page.content();
    fs.writeFileSync(pageHtmlPath, pageContent); // Use absolute path
    console.log(`[INDEX LOG] Page content saved.`);

    // Execute example JavaScript: Get the document title
    const jsResultPath = path.join(absoluteInspectDir, 'js_result.txt');
    await executeJavaScript(
      page,
      'document.title',
      jsResultPath // Use absolute path
    );

    // Example interaction: Focus the terminal and type 'ls -la'
    // try {
    //   await page.focus('#xtermRef');
    //   await page.keyboard.type('ls -la');
    //   await page.keyboard.press('Enter');
    //   await executeJavaScript(
    //     page,
    //     '/* Typed ls -la into the terminal */',
    //     `${inspectDir}/interaction_result.txt`
    //   )
    // } catch (error) {
    //   console.warn('Could not interact with the terminal:', error);
    //   await executeJavaScript(
    //     page,
    //     `/* Interaction failed: ${error} */`,
    //     `${inspectDir}/interaction_result.txt`
    //   )
    // }
  } catch (error) {
    console.error('[INDEX LOG] Error during Playwright operations:', error);
    const errorLogPath = path.join(absoluteInspectDir, 'error.log');
    fs.writeFileSync(errorLogPath, `Error: ${error}. Make sure the server is running at ${inspectUrl}.`); // Use absolute path
    console.log(`[INDEX LOG] Error details saved to ${errorLogPath}.`);
    console.log('[INDEX LOG] Closing browser server due to error...');
    await browserServer.close(); // Close the server
    console.log('[INDEX LOG] Browser server closed.');
    return; // Exit if navigation fails
  }

  console.log('[INDEX LOG] Waiting for 5 seconds for additional console logs...');
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  await sleep(5000);
  console.log('[INDEX LOG] Wait finished.');

  const consoleLogText = consoleLogs.join('\n');

  const consoleLogPath = path.join(absoluteInspectDir, 'console.log');
  console.log(`[INDEX LOG] Saving console logs to ${consoleLogPath}...`);
  fs.writeFileSync(consoleLogPath, consoleLogText); // Use absolute path
  console.log(`[INDEX LOG] Console logs saved.`);

  console.log(`[INDEX LOG] Inspection complete. Check the '${absoluteInspectDir}' directory for results.`); // Log absolute path
  console.log("\n--- Browser Console Log ---");
  console.log(consoleLogText);
  console.log("--- End of Browser Console Log ---\n");

  console.log('[INDEX LOG] Closing browser context...');
  await context.close(); // Close the context
  console.log('[INDEX LOG] Browser context closed.');
  console.log('[INDEX LOG] Closing browser server...');
  await browserServer.close(); // Close the server
  console.log('[INDEX LOG] Browser server closed.');
  console.log('[INDEX LOG] Exiting process.');
  process.exit(0); // Ensure the process exits
}

// Call parseArgs directly, as this script is intended to be executed via the bin/cli.js wrapper
console.log('[INDEX LOG] Directly calling parseArgs().');
parseArgs();