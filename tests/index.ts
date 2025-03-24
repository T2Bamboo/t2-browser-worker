import { BrowserWorker, Page, BrCookie ,useSleep, useScroll} from "../src";
const br = new BrowserWorker();


br.runTask(
  async (page: Page) => {
    // await page.goto("https://login.goethe.de/cas/login");
    await page.goto("https://www.goethe.de/ins/vn/vi/sta/han/prf/gzfit1.cfm")

    // const title = await page.title();
    // console.log("Page title:", title);

    await page.click("[data-testid='uc-accept-all-button']");
    await useSleep(2)
    await useScroll(page,8)
    await useSleep(2)
    await page.locator('button:has-text("Đăng ký")').nth(1).click();

    await useSleep(2)
    await page.locator('button:has-text("tiếp tục")').first().click();
    await useSleep(2)
 


    await page.type("#username", "ast35539@bcooq.com", { delay: 150 });
    await useSleep(2)

    await page.type("#password", "Cuong@1998", { delay: 150});
    await useSleep(2)

    await page.locator('input[value="Đăng nhập"]').click();

  
    await page.locator('button.cs-html-select__trigger[data-toggle="dropdown"]').click();

    await page.locator('span.cs-html-select__menu-item-text:has-text("Nguyen Sinh")').click();
    await useSleep(2)
    try{
      await page.locator('button:has-text("Hủy đăng kí giữ chỗ khác")').click();

    }


    catch{}
    await page.locator('button:has-text("tiếp tục")').first().click();
    await useSleep(2)
    

    try{
      await page.locator('button:has-text("Hủy đăng kí giữ chỗ khác")').click();

    }


    catch{}
    await page.locator('button:has-text("tiếp tục")').first().click();
    await useSleep(2)
    await page.locator('button:has-text("tiếp tục")').first().click();
    await useSleep(2)
    await page.locator('button:has-text("Đăng kí kèm thanh toán")').click();

    await page.waitForTimeout(90000);
  },
  {
    headless: false,
   
    // cookies: rawCookies as BrCookie[],
  }
);
