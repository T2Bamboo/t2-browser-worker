import { Page, Browser, firefox, Cookie } from "playwright";
import { BROWSER_PATH } from "./constants";
import { platform } from "os";
import { v4 as uuidv4 } from "uuid";

export interface TaskConfig {
  headless?: boolean;
  cookies?: Cookie[];
}

export type TaskHandle = (page: Page) => Promise<void>;

export class BrowserWorker {
  private browserList: Record<string, Browser> = {};
  private executablePath: string;

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

  async runTask(handle: TaskHandle, config?: TaskConfig): Promise<void | unknown> {
    console.time("Execution Time");
    const browserId = uuidv4();

    try {
      const browser = await firefox.launch({
        headless: config?.headless??true,
        executablePath: this.executablePath,
      });
      this.browserList[browserId] = browser;

      const context = await browser.newContext();
      if (config?.cookies) {
        await context.addCookies(config.cookies);
      }
      const page = await context.newPage();
      const result = await handle(page);

      await Promise.all([page.close(), browser.close()]);

      delete this.browserList[browserId];

      console.timeEnd("Execution Time");
      return result;
    } catch (error) {
      console.error("Error in runTask:", error);
    }
  }
}
