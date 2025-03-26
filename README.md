# urllog

This is an NPX package for inspecting web pages. It uses Playwright to capture screenshots, page content, console logs, and execute JavaScript.

## Installation

```bash
npx @textnav/urllog [options] <url>
```

## Usage

To inspect a web page, run the command with the URL as the argument:

```bash
npx @textnav/urllog <url>
```

For example:

```bash
npx @textnav/urllog http://localhost:5173/
```

To see the available options, use the `--help` or `-h` flag:

```bash
npx @textnav/urllog --help
```

## Development

To build the package:

1.  Install dependencies: `npm install`
2.  Build the project: `npm run build`

This will compile the TypeScript code to JavaScript in the `dist` directory.

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