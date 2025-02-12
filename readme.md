# t2-browser-worker

[![npm version](https://badge.fury.io/js/t2-browser-worker.svg)](https://badge.fury.io/js/t2-browser-worker)

## Description

## Installation

```bash
npm install t2-browser-worker
```

or using Yarn:

```bash
yarn add t2-browser-worker
```

### Usage with puppeteer-extra

```js
import { BrowserWorker, BrPage } from "t2-browser-worker";
const br = new BrowserWorker();

br.runTask(
  async (page: BrPage) => {
    await page.goto("https://example.com");
    await page.waitForTimeout(90000);
  },
  { headless: false }
);
```
