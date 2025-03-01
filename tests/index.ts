import { BrowserWorker, Page, BrCookie } from "../src";
const br = new BrowserWorker();
import rawCookies from "./cookie.json";


br.runTask(
  async (page: Page) => {
    await page.goto("https://truyenqqto.com");
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
    mode:'Persistent',
    userDataDir:"/Users/2noscript/workspace/t2data/t2-browser-worker/profile"
    // cookies: rawCookies as BrCookie[],
  }
);
