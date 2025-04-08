import { BrowserWorker, Page, BrCookie ,useSleep, useScroll} from "../src";
const br = new BrowserWorker();


br.runTask(
  async (page: Page) => {

    await page.goto("https://browserleaks.com/ip")
  },
  {
  
    headless: false,
    contextOptions: {
      viewport: {
        width: 1366, height: 768 
      },
    },
 
    // cookies: rawCookies as BrCookie[],
  }
);
