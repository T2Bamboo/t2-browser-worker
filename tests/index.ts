import { BrowserWorker, Page } from "../src";
const br = new BrowserWorker();

br.runTask(
  async (page: Page) => {
    await page.goto("https://example.com");
    await page.waitForTimeout(90000);
  },
  { headless: false }
);
