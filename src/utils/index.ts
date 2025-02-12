import fs from "fs";
import path from "path";



export function rootDirectory() {
  let currentDir = process.cwd();
  while (!fs.existsSync(path.join(currentDir, "package.json"))) {
    const parentDir = path.dirname(currentDir);
    if (currentDir === parentDir) break;
    currentDir = parentDir;
  }
  return currentDir;
}




