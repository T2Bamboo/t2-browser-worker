import fs from "fs";
import path from "path";
import os from "os";
import { execSync } from "child_process";

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
