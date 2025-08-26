// #!/usr/bin/env node

// import fs from 'fs'
// import axios from 'axios'
// import extract from 'extract-zip'
// import { BROWSER_DIR } from './__path__'
// import { downloadLink } from './__camoufox__'



// async function downloadFile(url: string, dest: string) {
// 	const { data, headers } = await axios({
// 		url,
// 		method: 'GET',
// 		responseType: 'stream',
// 	})
// 	const totalLength = headers['content-length']
// 	if (!totalLength) {
// 		console.warn('⚠️ Unable to determine file size.')
// 	}

// 	let downloaded = 0
// 	const totalMB = (totalLength / 1024 / 1024).toFixed(2) // Convert bytes -> MB

// 	console.log(`📥 Starting download: ${url}`)
// 	console.log(`📦 File size: ${totalMB || '?'} MB`)

// 	const writer = fs.createWriteStream(dest)

// 	data.on('data', (chunk: any) => {
// 		downloaded += chunk.length
// 		const downloadedMB = (downloaded / 1024 / 1024).toFixed(2)
// 		const percent = totalLength
// 			? ((downloaded / totalLength) * 100).toFixed(2)
// 			: '?'
// 		process.stdout.write(
// 			`\r🚀 Downloading: ${downloadedMB} / ${totalMB || '?'} MB (${percent}%)`
// 		)
// 	})

// 	data.pipe(writer)

// 	return new Promise((resolve, reject) => {
// 		writer.on('finish', () => {
// 			console.log('\n✅ Download completed!')
// 			resolve(dest)
// 		})
// 		writer.on('error', reject)
// 	})
// }

// async function installBrowser() {
// 	const ZIP_PATH = `${BROWSER_DIR}/camoufox.zip`
// 	const BROWSER_PATH = `${BROWSER_DIR}/camoufox`


// 	if (!fs.existsSync(`${BROWSER_DIR}/browser`)) {
// 		fs.mkdirSync(`${BROWSER_DIR}/browser`, { recursive: true })
// 	}
// 	if (fs.existsSync(BROWSER_PATH)) {
// 		console.log('⚡ The browser is already installed.')
// 		return
// 	}

// 	await downloadFile(downloadLink, ZIP_PATH)

// 	console.log('📦 Extracting browser...')
// 	await extract(ZIP_PATH, { dir: BROWSER_PATH })

// 	console.log('✅ Installation complete!')
// }


// const command = process.argv[2]
// if (command === 'install') {
// 	installBrowser().catch(err => console.error('❌ error:', err))
// } else {
// 	console.log('❌ Invalid command. Use: yarn browser-worker install')
// }
