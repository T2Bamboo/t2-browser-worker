# t2-browser-worker

[![npm version](https://badge.fury.io/js/t2-browser-worker.svg)](https://badge.fury.io/js/t2-browser-worker)

## Description

"This is a library for running browser tasks and managing them easily, with Playwright as the core."

## Installation

```bash
yarn add t2-browser-worker
```

install browser

```bash
yarn t2-browser-worker install
```

### Usage

```js
import { BrowserWorker, Page } from 't2-browser-worker'

const worker = new BrowserWorker()

const task = async (page: Page) => {
	await page.goto('https://example.com')
}

const result = await worker.runTask(
	task,
	{ headless: false }
)

```

### Api Reference

- [Playwright API Documentation](https://playwright.dev/docs/api/class-playwright)
