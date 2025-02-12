import { BrowserWorker, BrPage } from "../src";
const br = new BrowserWorker();

br.runTask(
  async (page: BrPage) => {
    await page.goto("https://manhuarock1.com");
    // await page.waitForLoadState("load")
    await page.waitForTimeout(90000);
  },
  { headless: false }
);
