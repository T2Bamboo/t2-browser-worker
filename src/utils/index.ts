import fs from "fs";
import path from "path";
import os from "os";
import { execSync } from "child_process";
import { BlockResource, BrCookie } from "../models/types";
import { Cookie, Page } from "playwright";

export function rootDirectory() {
  let currentDir = process.cwd();
  while (!fs.existsSync(path.join(currentDir, "package.json"))) {
    const parentDir = path.dirname(currentDir);
    if (currentDir === parentDir) break;
    currentDir = parentDir;
  }
  return currentDir;
}

export function getScreenSize() {
  
  const platform = os.platform();

  try {
    if (platform === "win32") {
      // Windows: PowerShell
      const output = execSync(
        'powershell -command "Add-Type -TypeDefinition \\"using System;using System.Runtime.InteropServices;public class Screen{[DllImport(\'user32.dll\')]public static extern int GetSystemMetrics(int nIndex);public static int Width(){return GetSystemMetrics(0);}public static int Height(){return GetSystemMetrics(1);}}\\"; [Screen]::Width(), [Screen]::Height()"'
      )
        .toString()
        .trim();
      const [width, height] = output.split("\n").map(Number);
      return [width, height];
    }

    if (platform === "darwin") {
      // macOS: system_profiler
      const output = execSync(
        "system_profiler SPDisplaysDataType | grep Resolution"
      )
        .toString()
        .trim();
      const match = output.match(/(\d+) x (\d+)/);
      return match ? [parseInt(match[1]), parseInt(match[2])] : [1280, 720];
    }

    if (platform === "linux") {
      // Linux: xrandr or xdpyinfo
      try {
        const output = execSync("xrandr | grep '*' | awk '{print $1}'")
          .toString()
          .trim();
        const [width, height] = output.split("x").map(Number);
        return [width, height];
      } catch (err) {
        const output = execSync("xdpyinfo | grep dimensions").toString().trim();
        const match = output.match(/(\d+)x(\d+)/);
        return match ? [parseInt(match[1]), parseInt(match[2])] : [1280, 720];
      }
    }
  } catch (error) {
    console.error("Unable to get screen size:", error);
  }

  // default
  return [1280, 720];
}


export function formatCookie(cookieList: BrCookie[]): Cookie[] {
  const pwCookie: Cookie[] = [];
  cookieList.forEach((cookie) => {
    for (const key in cookie) {
      if (key === "sameSite") {
        if (["strict", "lax", "none"].includes(cookie[key].toLowerCase())) {
          cookie[key] =
            cookie[key].charAt(0).toUpperCase() + cookie[key].slice(1);
        } else cookie[key] = "None";
      }
      if (key === "expirationDate") cookie["expires"] = cookie[key];
    }
  });
  return pwCookie;
}

export async function useBlockResource(page: Page, blockList: BlockResource[]) {
  await page.route("**/*", (route) => {
    if (blockList.includes(route.request().resourceType() as BlockResource)) {
      route.abort();
    } else {
      route.continue();
    }
  });
}

export async function useScroll(page: Page, limit?: number) {
  let previousHeight = await page.evaluate(() => document.body.scrollHeight);
  let curCount = 0;
  while (true) {
    await page.mouse.wheel(0, 1000);
    await page.waitForTimeout(400);
    let newHeight = await page.evaluate(() => document.body.scrollHeight);
    if (newHeight === previousHeight) break;
    if (limit && curCount === limit) break;
    previousHeight = newHeight;
    curCount++;
  }
}

export async function useSleep(s: number) {
  return new Promise((resolve) => setTimeout(resolve, s * 1000));
}

export async function usePageFetch(
  page: Page,
  url: string,
  option?: Record<string, any>
) {
  const response = await page.context().request.fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    ...(option ?? {}),
  });
  return response.json();
}
