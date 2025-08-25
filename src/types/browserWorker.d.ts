import { Page, Cookie, BrowserContextOptions, LaunchOptions } from "playwright-core";
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

export interface TaskConfig {
  headless?: boolean;
  cookies?: BrCookie[];
  proxy?: ProxySettings;
  contextOptions?: BrowserContextOptions;
  executablePath?: string;
  mode?:"Default"|"Persistent"
  userDataDir?:string
}
export type TaskHandle = (page: Page) => Promise<void|unknown>;

export interface BrCookie extends Omit<Cookie, "expires" | "sameSite"> {
  [key: string]: any;
  sameSite: any;
  expires?: number;
}
