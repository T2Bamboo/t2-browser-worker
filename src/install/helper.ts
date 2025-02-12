import os from 'os'
import release from "./camoufoxRelease"


export function getBrowserLink() {
  const basePath = release.path;
  const assets:any =release.assets
  const system = os.platform();
  const arch = os.arch();

  let key;
  if (system === "linux") {
    key = arch.includes("arm") ? "lin.arm64" : arch.includes("64") ? "lin.x86_64" : "lin.i686";
  } else if (system === "darwin") {
    key = arch.includes("arm") ? "mac.arm64" : "mac.x86_64";
  } else if (system === "win32") {
    key = arch.includes("64") ? "win.x86_64" : "win.i686";
  } else {
    throw new Error("Unsupported OS");
  }
  return `${basePath}/${assets[key]}`;

}
