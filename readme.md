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


<!-- 
## 🔽 🔥 Important Updates

<details>
  <summary>Bypass Cloudflare Turnstile</summary>
  
  ```js
  br.runTask(
  async (page: Page) => {
    await page.goto("https://nopecha.com/demo/cloudflare");
    const title = await page.title();
    console.log("Page title:", title);

    if (title.includes("Just a moment...")) {
      await page.waitForLoadState("domcontentloaded");
      await page.waitForLoadState("networkidle");
      await page.mouse.click(210, 290);
    }

    await page.waitForTimeout(90000);
  },
  {
    headless: false,
    contextOptions: {
      viewport: {
        width: 1280,
        height: 720,
      },
    },
  }
);
  ```
</details> -->


### Api Reference

- [Playwright API Documentation](https://playwright.dev/docs/api/class-playwright)

