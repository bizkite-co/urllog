# Task: Initialize Project with Vite

This task involves setting up the basic project structure using Vite with the `vanilla-ts` template.

## Steps

1.  Run the following command in the terminal:

    ```bash
    npm create vite@latest . -- --template vanilla-ts
    ```

    This command will:

    *   Use the latest version of the `create-vite` package.
    *   Initialize the project in the current directory (`.`).
    *   Use the `vanilla-ts` template for a basic TypeScript setup.

## Expected Outcome

After running the command, the following files and directories should be created:

*   `package.json`
*   `tsconfig.json`
*   `vite.config.ts`
*   `index.html`
*   `src/`
    *   `main.ts`
    *   `style.css`
    *   `typescript.svg`
*   `public/`
    *    `vite.svg`

The command may also prompt for a project name. If so, enter "." to use the current directory name.