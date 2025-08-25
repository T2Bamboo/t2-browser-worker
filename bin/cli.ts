#!/usr/bin/env node

import os from 'os'
import fs from 'fs'
import axios from 'axios'
import extract from 'extract-zip'
import { rootDirectory } from '../src/helper/utils'

const foxVersion = '135.0.1'
const betaVer = '24'

const platforms = [
	'lin.arm64',
	'lin.i686',
	'lin.x86_64',
	'mac.arm64',
	'mac.x86_64',
	'win.i686',
	'win.x86_64',
]

const assets = Object.fromEntries(
	platforms.map(platform => [
		platform,
		`camoufox-${foxVersion}-beta.${betaVer}-${platform}.zip`,
	])
)

const release = {
	path: `https://github.com/daijro/camoufox/releases/download/v${foxVersion}-beta.${betaVer}`,
	assets,
}



function getBrowserLink() {
	const basePath = release.path
	const assets: any = release.assets
	const system = os.platform()
	const arch = os.arch()
	let key
	if (system === 'linux') {
		key = arch.includes('arm')
			? 'lin.arm64'
			: arch.includes('64')
			? 'lin.x86_64'
			: 'lin.i686'
	} else if (system === 'darwin') {
		key = arch.includes('arm') ? 'mac.arm64' : 'mac.x86_64'
	} else if (system === 'win32') {
		key = arch.includes('64') ? 'win.x86_64' : 'win.i686'
	} else {
		throw new Error('Unsupported OS')
	}
	return `${basePath}/${assets[key]}`
}

async function downloadFile(url: string, dest: string) {
	const { data, headers } = await axios({
		url,
		method: 'GET',
		responseType: 'stream',
	})
	const totalLength = headers['content-length']
	if (!totalLength) {
		console.warn('⚠️ Unable to determine file size.')
	}

	let downloaded = 0
	const totalMB = (totalLength / 1024 / 1024).toFixed(2) // Convert bytes -> MB

	console.log(`📥 Starting download: ${url}`)
	console.log(`📦 File size: ${totalMB || '?'} MB`)

	const writer = fs.createWriteStream(dest)

	data.on('data', (chunk: any) => {
		downloaded += chunk.length
		const downloadedMB = (downloaded / 1024 / 1024).toFixed(2)
		const percent = totalLength
			? ((downloaded / totalLength) * 100).toFixed(2)
			: '?'
		process.stdout.write(
			`\r🚀 Downloading: ${downloadedMB} / ${totalMB || '?'} MB (${percent}%)`
		)
	})

	data.pipe(writer)

	return new Promise((resolve, reject) => {
		writer.on('finish', () => {
			console.log('\n✅ Download completed!')
			resolve(dest)
		})
		writer.on('error', reject)
	})
}

async function installBrowser() {
	const ROOT_PATH = rootDirectory()
	const ZIP_PATH = `${ROOT_PATH}/browser/camoufox.zip`
	const BROWSER_PATH = `${ROOT_PATH}/browser/camoufox`

	const link = getBrowserLink()

	if (!fs.existsSync(`${ROOT_PATH}/browser`)) {
		fs.mkdirSync(`${ROOT_PATH}/browser`, { recursive: true })
	}
	if (fs.existsSync(BROWSER_PATH)) {
		console.log('⚡ The browser is already installed.')
		return
	}

	await downloadFile(link, ZIP_PATH)

	console.log('📦 Extracting browser...')
	await extract(ZIP_PATH, { dir: BROWSER_PATH })

	console.log('✅ Installation complete!')
}


const command = process.argv[2]
if (command === 'install') {
	installBrowser().catch(err => console.error('❌ error:', err))
} else {
	console.log('❌ Invalid command. Use: yarn browser-worker install')
}
