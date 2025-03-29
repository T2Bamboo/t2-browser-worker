import { firefox, BrowserContext } from "playwright";
import { platform } from "os";
import { v4 as uuidv4 } from "uuid";
import { rootDirectory, getScreenSize, formatCookie } from "./utils";
import { TaskConfig, TaskHandle, BrCookie } from "./models/types";

export class BrowserWorker {
  private listTask: Record<string, BrowserContext> = {};
  private executablePath: string;
  private limitBrCount = 5;
  private FLAG_TIME = "Execution Time";
  private deviceW: number;
  private deviceH: number;

  constructor(options?: { limitBrowsers?: number }) {
    this.executablePath = this.getExecutablePath();
    [this.deviceW, this.deviceH] = getScreenSize();
    if (options?.limitBrowsers) {
      this.limitBrCount = options.limitBrowsers;
    }
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
    return Object.keys(this.listTask).length >= this.limitBrCount;
  }

  private async addCookies(context: BrowserContext, cookies?: BrCookie[]) {
    if (!cookies || cookies.length === 0) return;
    await context.addCookies(formatCookie(cookies));
  }

  private async intInstance(config?: TaskConfig) {
    let browser, context;

    const configBrowser = {
      headless: config?.headless ?? false,
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
    
    try {
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
      }

      await this.addCookies(context, config?.cookies);
      return { browser, context };
    } catch (error) {
      console.error("Error initializing browser instance:", error);
      throw error;
    }
  }

  async runTask(
    handle: TaskHandle,
    config?: TaskConfig
  ): Promise<void | unknown> {
    if (this.checkLimitBrowser()) {
      console.warn(`Browser limit reached (${this.limitBrCount}). Task skipped.`);
      return;
    }

    console.time(this.FLAG_TIME);
    const taskId = uuidv4();
    let browser, context;
    
    try {
      const instance = await this.intInstance(config);
      browser = instance.browser;
      context = instance.context;
      this.listTask[taskId] = context;
      
      const page = await context.newPage();
      const result = await handle(page);

      return result;
    } catch (error) {
      console.error("Error in runTask:", error);
      throw error;
    } finally {
      try {
        if (this.listTask[taskId]) {
          const pages = this.listTask[taskId].pages();
          await Promise.all(pages.map(page => page.close()));
          await browser?.close();
          await context?.close();
          delete this.listTask[taskId];
        }
      } catch (cleanupError) {
        console.error("Error during cleanup:", cleanupError);
      }
      console.timeEnd(this.FLAG_TIME);
    }
  }

  async runMultipleTasks(
    handles: TaskHandle[],
    configs?: TaskConfig[]
  ): Promise<(void | unknown)[]> {
    const results = [];
    for (let i = 0; i < handles.length; i++) {
      const config = configs?.[i] || undefined;
      const result = await this.runTask(handles[i], config);
      results.push(result);
    }
    return results;
  }

  setLimitBrowserStart(limitCount: number) {
    this.limitBrCount = limitCount;
  }
  
  getActiveBrowserCount(): number {
    return Object.keys(this.listTask).length;
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
