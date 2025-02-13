import { BrowserWorker, Page } from "../src";
const br = new BrowserWorker();

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
