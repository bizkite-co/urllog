# Task: Configure TypeScript (tsconfig.json)

This task involves ensuring the `tsconfig.json` file is configured correctly for a Node.js environment, with appropriate module resolution and output settings.

## Steps

1.  Open `tsconfig.json`.
2.  Verify and, if necessary, adjust the `compilerOptions` to match the following:

    ```json
    {
      "compilerOptions": {
        "target": "ES2020", // Or a suitable Node.js version (ES2018, ES2019, etc.)
        "module": "CommonJS",
        "moduleResolution": "node",
        "esModuleInterop": true,
        "forceConsistentCasingInFileNames": true,
        "strict": true,
        "skipLibCheck": true,
        "outDir": "dist", // Output directory
        "rootDir": "src",  // Root directory of source files
        "declaration": true // Generate declaration files
      },
      "include": ["src/**/*"],
      "exclude": ["node_modules"]
    }
    ```

## Expected Outcome

The `tsconfig.json` file should be configured with compiler options suitable for a Node.js environment, targeting CommonJS modules and generating declaration files.