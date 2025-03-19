### 1. Fix the Build Configuration

The root cause of the `ReferenceError: require is not defined` error is the Vite configuration, which is set to output CommonJS format (`cjs`). This conflicts with the project's `"type": "module"` setting in `package.json`.

**Action:** Modify `vite.config.ts` to output ES modules.

**File:** `vite.config.ts`

**Change:**

```diff
-      formats: ['cjs'], // Output format: CommonJS
+      formats: ['es'], // Output format: ES Modules