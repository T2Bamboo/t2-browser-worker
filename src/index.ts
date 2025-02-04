import { Page, Browser, firefox } from "playwright";
import { BROWSER_PATH } from "./constants";
import { platform } from "os";
import { v4 as uuidv4 } from "uuid";

export interface TaskConfig {}

export type TaskHandle = (page: Page) => Promise<void>;

export class BrowserWorker {
  private browserList: Record<string, Browser> = {};
  private executablePath: string;

  constructor() {
    this.executablePath = this.getExecutablePath();
  }
  private getExecutablePath(): string {
    const system = platform();
    if (system === "linux") return BROWSER_PATH.LINUX;
    if (system === "darwin") return BROWSER_PATH.MAC;
    if (system === "win32") return BROWSER_PATH.WIN;
    return "";
  }

  async runTask(handle: TaskHandle, config?: TaskConfig) {
    console.time("Execution Time");
    const browser = await firefox.launch({
      headless: false,
      executablePath: this.executablePath,
    });
    const brId = uuidv4();
    this.browserList[brId] = browser;
    const page = await browser.newPage();

    // await page.route("**/*", (route) => {
    //   const request = route.request();
    //   if (["image", "stylesheet"].includes(request.resourceType())) {
    //     route.abort();
    //   } else {
    //     route.continue();
    //   }
    // });
    const result = await handle(page);
    await page.close();
    await browser.close();
    delete this.browserList[brId];
    console.timeEnd("Execution Time");
    return result;
  }

  async runWorkFollow() {}
}
