import { firefox, BrowserContext } from 'playwright-core'
import { BrCookie, TaskConfig, Task } from './types/browserWorker'
import { formatCookie, getScreenSize, randomId } from './helper/utils'
import { BROWSER_EXEC_PATH } from './__path__'

export class BrowserWorker {
	private listTask: Record<string, BrowserContext> = {}
	private limitBrCount = 5
	private FLAG_TIME = 'Execution Time'
	private deviceW: number
	private deviceH: number

	constructor(options?: { limitBrowsers?: number }) {
		;[this.deviceW, this.deviceH] = getScreenSize()
		if (options?.limitBrowsers) {
			this.limitBrCount = options.limitBrowsers
		}
	}

	private checkLimitBrowser() {
		return Object.keys(this.listTask).length >= this.limitBrCount
	}

	private async addCookies(context: BrowserContext, cookies?: BrCookie[]) {
		if (!cookies || cookies.length === 0) return
		await context.addCookies(formatCookie(cookies))
	}

	private async intInstance(taskConfig?: TaskConfig) {
		let browser, context

		const configBrowser = {
			headless: taskConfig?.headless ?? false,
			executablePath: taskConfig?.executablePath ?? BROWSER_EXEC_PATH,
			proxy: taskConfig?.proxy,
		}

		const configContext = {
			viewport: { width: this.deviceW, height: this.deviceH },
			ignoreHTTPSErrors: true,
			extraHTTPHeaders: {
				'Cross-Origin-Opener-Policy': 'unsafe-none',
				'Cross-Origin-Embedder-Policy': 'unsafe-none',
			},
			...(taskConfig?.contextOptions ?? {}),
		}

		try {
			if (taskConfig?.mode === 'Persistent') {
				context = await firefox.launchPersistentContext(
					taskConfig?.userDataDir ?? '',
					{
						...configBrowser,
						...configContext,
					}
				)
				await Promise.all(context.pages().map(page => page.close()))
			} else {
				browser = await firefox.launch(configBrowser)
				context = await browser.newContext(configContext)
			}
			return { browser, context }
		} catch (error) {
			console.error('Error initializing browser instance:', error)
			throw error
		}
	}

	async runTask(task: Task, config?: TaskConfig): Promise<void | unknown> {
		if (this.checkLimitBrowser()) {
			console.warn(
				`Browser limit reached (${this.limitBrCount}). Task skipped.`
			)
			return
		}

		console.time(this.FLAG_TIME)
		const taskId = randomId()
		let browser, context

		try {
			const instance = await this.intInstance(config)
			browser = instance.browser
			context = instance.context
			this.listTask[taskId] = context

			const page = await context.newPage()
			try {
				const result = await task(page)
				return result
			} catch (error) {
				console.error('Error in handle:', error)
				throw error
			}
		} catch (error) {
			console.error('Error in runTask:', error)
			throw error
		} finally {
			try {
				if (this.listTask[taskId]) {
					await context?.close()
					await browser?.close()
					delete this.listTask[taskId]
				}
			} catch (cleanupError) {
				console.error('Error during cleanup:', cleanupError)
			}
			console.timeEnd(this.FLAG_TIME)
		}
	}

	setLimitBrowserStart(limitCount: number) {
		this.limitBrCount = limitCount
	}

	getActiveBrowserCount(): number {
		return Object.keys(this.listTask).length
	}
}
