# Task: Test Locally

This task involves testing the package locally using `npm link` to make it available as an NPX command.

## Steps

1.  Run `npm link` in the project directory (`/home/mstouffer/repos/urllog`). This creates a symbolic link in the global `node_modules` directory that points to the local project.
2.  Open a *new* terminal (outside the project directory).
3.  Run `npx @textnav/urllog`. This will execute the linked package.

## Expected Outcome

*   `npm link` should complete successfully, creating a symbolic link.
*   `npx @textnav/urllog` should execute the package. The command may fail initially due to the hardcoded URL, but this step confirms that the package is correctly linked and executable. We will address the URL configuration in a later task.