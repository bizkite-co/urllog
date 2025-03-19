# Task: Move and Adapt Code

This task involves moving the existing `inspect.ts` file to the `src` directory, renaming it to `index.ts`, and adapting the code to the new project environment.

## Steps

1.  Move `inspect.ts` to `src/index.ts`.
2.  Update the shebang line at the top of `src/index.ts` to: `#!/usr/bin/env node`
3.  Adjust file paths within `src/index.ts` (for output) to be relative to the project root. Use a default output directory named `urllog-output` in the project root.

## Expected Outcome

*   The `inspect.ts` file should no longer exist in the project root.
*   A new file `src/index.ts` should exist, containing the code from `inspect.ts`.
*   The shebang line in `src/index.ts` should be updated.
*   File paths within `src/index.ts` should be adjusted to use the `urllog-output` directory.