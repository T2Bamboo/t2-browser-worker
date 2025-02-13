import {
  Page,
  Browser,
  firefox,
  Cookie,
  LaunchOptions,
  BrowserContextOptions,
} from "playwright";
import { platform } from "os";
import { v4 as uuidv4 } from "uuid";
import { rootDirectory, getScreenSize } from "./utils";

export {
  Page,
  Browser,
  firefox,
  Cookie,
  BrowserContextOptions,
} from "playwright";
export interface TaskConfig {
  headless?: boolean;
  cookies?: Cookie[];
  blockResource?: BlockResource[];
  proxy?: ProxySettings;
  contextOptions?: BrowserContextOptions;
}
export type TaskHandle = (page: Page) => Promise<void>;
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
    const ROOT_PATH = rootDirectory();

    switch (platform()) {
      case "linux":
        return `${ROOT_PATH}/browser/camoufox/camoufox`;
      case "darwin":
        return `${ROOT_PATH}/browser/camoufox/Camoufox.app/Contents/MacOS/camoufox`;
      case "win32":
        return `${ROOT_PATH}\\browser\\camoufox\\Camoufox.exe`;
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
      const [width, height] = getScreenSize();
      const context = await browser.newContext({
        viewport: { width, height },
        ignoreHTTPSErrors: true,
        extraHTTPHeaders: {
          "Cross-Origin-Opener-Policy": "unsafe-none",
          "Cross-Origin-Embedder-Policy": "unsafe-none",
        },
        ...(config?.contextOptions ?? {}),
      });

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
