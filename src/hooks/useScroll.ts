import { Page } from 'playwright-core'

export  async function useScroll(page: Page, limit?: number) {
    let previousHeight = await page.evaluate(() => document.body.scrollHeight)
    let curCount = 0
    while (true) {
        await page.mouse.wheel(0, 1000)
        await page.waitForTimeout(400)
        let newHeight = await page.evaluate(() => document.body.scrollHeight)
        if (newHeight === previousHeight) break
        if (limit && curCount === limit) break
        previousHeight = newHeight
        curCount++
    }
}