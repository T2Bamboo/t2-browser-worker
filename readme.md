# t2-browser-worker

[![npm version](https://badge.fury.io/js/t2-browser-worker.svg)](https://badge.fury.io/js/t2-browser-worker)

## Description
"This is a library for running browser tasks and managing them easily, with Playwright as the core."
## Installation

```bash
npm install t2-browser-worker
```

or using Yarn:

```bash
yarn add t2-browser-worker
```

install browser

```bash
browser-worker install
```

### Usage

```js
import { BrowserWorker, BrPage } from "t2-browser-worker";
const br = new BrowserWorker();

br.runTask(
  async (page: BrPage) => {
    await page.goto("https://example.com");
  },
  { headless: false }
);
```


### Api Reference

- [Playwright API Documentation](https://playwright.dev/docs/api/class-playwright)

