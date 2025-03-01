import { firefox, BrowserContext } from "playwright";
import { platform } from "os";
import { v4 as uuidv4 } from "uuid";
import { rootDirectory, getScreenSize, formatCookie } from "./utils";
import { TaskConfig, TaskHandle } from "./models/types";

export class BrowserWorker {
  private listTask: Record<string, BrowserContext> = {};
  private executablePath: string;
  private limitBrCount = 5;
  private FLAG_TIME = "Execution Time";
  private deviceW: number;
  private deviceH: number;

  constructor() {
    this.executablePath = this.getExecutablePath();
    [this.deviceW, this.deviceH] = getScreenSize();
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
    return Object.keys(this.listTask).length > this.limitBrCount;
  }

  async runTask(
    handle: TaskHandle,
    config?: TaskConfig
  ): Promise<void | unknown> {
    if (this.checkLimitBrowser()) return;

    console.time(this.FLAG_TIME);
    const taskId = uuidv4();
    try {
      let browser, context;

      const configBrowser = {
        headless: config?.headless,
        executablePath: config?.executablePath ?? this.executablePath,
        proxy: config?.proxy,
      };
      const configContext = {
        viewport: { width: this.deviceW, height: this.deviceH },
        ignoreHTTPSErrors: true,
        extraHTTPHeaders: {
          "Cross-Origin-Opener-Policy": "unsafe-none",
          "Cross-Origin-Embedder-Policy": "unsafe-none",
        },
        ...(config?.contextOptions ?? {}),
      };

      if (config?.mode === "Persistent") {
        context = await firefox.launchPersistentContext(
          config?.userDataDir ?? "",
          {
            ...configBrowser,
            ...configContext,
          }
        );
        await Promise.all(context.pages().map((page) => page.close()));
      } else {
        browser = await firefox.launch(configBrowser);
        context = await browser.newContext(configContext);
        this.listTask[taskId] = context;
      }

      if (config?.cookies)
        await context.addCookies(formatCookie(config.cookies));

      const page = await context.newPage();
      const result = await handle(page);

      await Promise.all([page.close(), browser?.close(), context?.close()]);

      delete this.listTask[taskId];
      console.timeEnd(this.FLAG_TIME);

      return result;
    } catch (error) {
      console.error("Error in runTask:", error);
    }
  }

  setLimitBrowserStart(limitCount: number) {
    this.limitBrCount = limitCount;
  }
}

export { Page, Browser, BrowserContextOptions } from "playwright";

export {
  BlockResource,
  TaskConfig,
  TaskHandle,
  BrCookie,
} from "./models/types";

export { useBlockResource, useScroll, useSleep, usePageFetch } from "./utils";
