## Plan to Address Runtime Error and Add Tests

### 1. Fix the Build Configuration

The root cause of the `ReferenceError: require is not defined` error is the Vite configuration, which is set to output CommonJS format (`cjs`). This conflicts with the project's `"type": "module"` setting in `package.json`.

**Action:** Modify `vite.config.ts` to output ES modules.

**File:** `vite.config.ts`

**Change:**

```diff
-      formats: ['cjs'], // Output format: CommonJS
+      formats: ['es'], // Output format: ES Modules
```

### 2. Add Basic Tests

Playwright Test is already included as a dependency, so we can use it directly. We'll create a new test file and add basic tests to validate the core functionality.

**Action:** Create `src/index.test.ts` and add basic tests.

**File:** `src/index.test.ts`

**Content:**

```typescript
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
```

**Note:** We need to export the `inspect` function from `src/index.ts` for the test to work.

**File:** `src/index.ts`

**Change:**
```diff
- async function inspect() {
+ export async function inspect() {
```

### 3. Run Tests and Address Failures

**Action:** Run the tests using `npm test` and address any reported failures. This may involve debugging the code and making necessary changes to fix the issues.

**Command:**

```bash
npm test
```

### 4. Update README

Add instructions on how to run the tests.

**Action:** Add a "Testing" section to `README.md`.

**File:** `README.md`

**Content:** (To be added to the README)

```markdown
## Testing

This project uses Playwright Test for testing.

To run the tests:

1.  Make sure the application you want to inspect is running (e.g., `npm run dev` if it's a local development server).
2.  Run the tests:

    ```bash
    npm test
    ```
    or, to run the tests in headed mode so you can see the browser:
    ```bash
    npm test --headed
    ```
    or, to run the tests with the UI:
    ```bash
    npx playwright test --ui
    ```
```

### 5. Add test script to package.json

**Action:** Add a "test" script to `package.json`.

**File:** `package.json`

**Change:**

```diff
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "prepare": "npm run build",
+   "test": "playwright test src/index.test.ts"
  },
```

### 6. Update shebang to use node --import

**Action:** Update shebang in `src/index.ts` to use `node --import` to support top-level await.

**File:** `src/index.ts`

**Change:**

```diff
- #!/usr/bin/env node
+ #!/usr/bin/env node --import=tsx
```

### 7. Additional Step: Install tsx

**Action:** Install the `tsx` package as a dev dependency.

**Command:**

```bash
npm install --save-dev tsx