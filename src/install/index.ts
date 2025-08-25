import { getBrowserLink } from './helper'
import fs from 'fs'
import axios from 'axios'
import extract from 'extract-zip'
import { rootDirectory } from '../utils'

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

export async function installBrowser() {
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
