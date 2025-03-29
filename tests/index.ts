import { BrowserWorker, Page, BrCookie ,useSleep, useScroll} from "../src";
const br = new BrowserWorker();


br.runTask(
  async (page: Page) => {

    await page.goto("https://browserleaks.com/ip")
    await page.waitForTimeout(90000);
  },
  {
  
    headless: false,
    contextOptions: {
      viewport: {
        width: 1366, height: 768 
      },
    },
    proxy: {
      server: "38.154.227.167:5868",
      username: "uboxjlua",
      password: "bzvy6rwz3g3c",
    },
    // cookies: rawCookies as BrCookie[],
  }
);
