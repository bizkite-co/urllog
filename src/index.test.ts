import { test, expect } from '@playwright/test';
import { inspect } from './index'; // Assuming inspect is exported
import fs from 'fs';
import path from 'path';

test.describe('urllog', () => {
  test.beforeEach(() => {
    // Clean up any existing output directory before each test
    const inspectDir = 'urllog-output';
    if (fs.existsSync(inspectDir)) {
      fs.rmSync(inspectDir, { recursive: true, force: true });
    }
  });

  test('inspect creates output directory and files', async () => {
    await inspect(); // Run the inspect function

    const inspectDir = 'urllog-output';
    expect(fs.existsSync(inspectDir)).toBe(true);
    expect(fs.existsSync(path.join(inspectDir, 'screenshot.png'))).toBe(true);
    expect(fs.existsSync(path.join(inspectDir, 'page.html'))).toBe(true);
    expect(fs.existsSync(path.join(inspectDir, 'js_result.txt'))).toBe(true);
    // We can't fully test the interactive terminal parts, but we can check for the output file
    expect(fs.existsSync(path.join(inspectDir, 'interaction_result.txt'))).toBe(true);
  });
});