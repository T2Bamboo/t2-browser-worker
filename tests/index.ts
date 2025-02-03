import { firefox } from "playwright";
import {BROWSER_PATH} from "../src/constants"

(async () => {
  console.log(BROWSER_PATH.MAC )
  const browser = await firefox.launch({
    headless: false,
    executablePath:BROWSER_PATH.MAC 
  });

  const page = await browser.newPage();
  await page.goto("https://www.booking.com/index.en-gb.html?label=gen173nr-1BCAEoggI46AdIM1gEaPQBiAEBmAEJuAEHyAEM2AEB6AEBiAIBqAIDuAKz_4K9BsACAdICJDA3NTBlNDg2LWQzYzktNDliOC05ZTg3LTg0MWNjOGI2ZDc5MdgCBeACAQ&sid=f8bac5071a56660d99518bad0a695e16&keep_landing=1&sb_price_type=total&");

  await page.screenshot({ path: "screenshot.png" });
//   await browser.close();
 
const userAgent = await page.evaluate(() => navigator.userAgent);
console.log("User-Agent:", userAgent);

  console.log("✅ Test đã hoàn thành!");
})();
