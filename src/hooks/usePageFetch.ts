import { Page } from "playwright-core"

export async function usePageFetch(
    page: Page,
    url: string,
    option?: Record<string, any>
) {
    const response = await page.context().request.fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        ...(option ?? {}),
    })
    return response.json()
}