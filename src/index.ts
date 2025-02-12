import { Page, Browser, firefox, Cookie, LaunchOptions } from "playwright";
import { BROWSER_PATH } from "./constants";
import { platform } from "os";
import { v4 as uuidv4 } from "uuid";

export interface TaskConfig {
  headless?: boolean;
  cookies?: Cookie[];
  blockResource?: BlockResource[];
  proxy?: ProxySettings;
}

export type TaskHandle = (page: Page) => Promise<void>;
export type BrCookie = Cookie;
export type BrPage = Page;
export type BlockResource =
  | "image"
  | "stylesheet"
  | "font"
  | "media"
  | "script"
  | "xhr"
  | "fetch"
  | "websocket";

export type ProxySettings = NonNullable<LaunchOptions["proxy"]>;
export class BrowserWorker {
  private browserList: Record<string, Browser> = {};
  private executablePath: string;
  private limitBrCount = 5;

  constructor() {
    this.executablePath = this.getExecutablePath();
  }

  private getExecutablePath(): string {
    switch (platform()) {
      case "linux":
        return BROWSER_PATH.LINUX;
      case "darwin":
        return BROWSER_PATH.MAC;
      case "win32":
        return BROWSER_PATH.WIN;
      default:
        return "";
    }
  }

  private checkLimitBrowser() {
    return Object.keys(this.browserList).length > this.limitBrCount;
  }

  private async useBlockResource(page: Page, blockList: BlockResource[]) {
    await page.route("**/*", (route) => {
      if (blockList.includes(route.request().resourceType() as BlockResource)) {
        route.abort();
      } else {
        route.continue();
      }
    });
  }

  async runTask(
    handle: TaskHandle,
    config?: TaskConfig
  ): Promise<void | unknown> {
    if (this.checkLimitBrowser()) return;

    console.time("Execution Time");
    const browserId = uuidv4();
    try {
      const browser = await firefox.launch({
        headless: config?.headless,
        executablePath: this.executablePath,
        proxy: config?.proxy,
      });
      this.browserList[browserId] = browser;

      const context = await browser.newContext();

      if (config?.cookies) await context.addCookies(config?.cookies);
      const page = await context.newPage();
      if (config?.blockResource)
        await this.useBlockResource(page, config.blockResource);

      const result = await handle(page);

      await Promise.all([page.close(), browser.close()]);
      delete this.browserList[browserId];

      console.timeEnd("Execution Time");
      return result;
    } catch (error) {
      console.error("Error in runTask:", error);
    }
  }
  setLimitBrowserStart(limitCount: number) {
    this.limitBrCount = limitCount;
  }
}
