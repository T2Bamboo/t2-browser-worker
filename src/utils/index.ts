import fs from "fs";
import path from "path";
import os from "os";



export function rootDirectory() {
  let currentDir = path.resolve(__dirname);
  while (!fs.existsSync(path.join(currentDir, "package.json"))) {
    const parentDir = path.dirname(currentDir);
    if (currentDir === parentDir) break;
    currentDir = parentDir;
  }
  return currentDir;
}


export function getPlatform(){
  const platform=os.platform()


}







