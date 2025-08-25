import { BrowserWorker, Page } from '../src'

const worker = new BrowserWorker()

const task = async (page: Page) => {
	await page.goto('https://example.com')
	return await page.title()
}
worker.runTask(task, { headless: false }).then(result => {
	console.log(result)
})

// console.log(ROOT_PATH_M)
