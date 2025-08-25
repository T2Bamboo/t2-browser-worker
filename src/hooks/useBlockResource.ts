import { Page } from "playwright-core"
import { BlockResource } from "../types/browserWorker"

export  async function useBlockResource(page: Page, blockList: BlockResource[]) {
    await page.route('**/*', route => {
        if (blockList.includes(route.request().resourceType() as BlockResource)) {
            route.abort()
        } else {
            route.continue()
        }
    })
}