import path from 'path'
import fs from 'fs'
import { platform } from './__systemInfo__'

let ROOT_PATH = process.cwd()
let BROWSER_EXEC_PATH = ''

while (!fs.existsSync(path.join(ROOT_PATH, 'package.json'))) {
	const parentDir = path.dirname(ROOT_PATH)
	if (ROOT_PATH === parentDir) break
	ROOT_PATH = parentDir
}

const BROWSER_DIR = path.join(ROOT_PATH, 'browser')

switch (platform) {
	case 'linux':
		BROWSER_EXEC_PATH = `${BROWSER_DIR}/camoufox/camoufox`
		break
	case 'darwin':
		BROWSER_EXEC_PATH = `${BROWSER_DIR}/camoufox/Camoufox.app/Contents/MacOS/camoufox`
		break
	case 'win32':
		BROWSER_EXEC_PATH = `${BROWSER_DIR}\\camoufox\\Camoufox.exe`
		break
	default:
		BROWSER_EXEC_PATH = platform
		break
}

export { ROOT_PATH, BROWSER_EXEC_PATH, BROWSER_DIR }
