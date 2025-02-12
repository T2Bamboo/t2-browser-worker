import { rootDirectory } from "../utils";

export const ROOT_PATH = rootDirectory();

export const BROWSER_PATH = {
  MAC: `${ROOT_PATH}/browser/camoufox/Camoufox.app/Contents/MacOS/camoufox`,
  WIN: `${ROOT_PATH}\\browser\\camoufox\\Camoufox.exe`,
  LINUX: `${ROOT_PATH}/browser/camoufox/camoufox`,
};
