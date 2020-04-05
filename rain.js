const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://newyork.craigslist.org/search/trd?");

  await page.screenshot({ path: "craigslist.png" });

  await browser.close();
})();
