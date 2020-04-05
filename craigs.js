const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: false, slowMo: 1000 });
  const page = await browser.newPage();
  await page.goto(
    "https://newyork.craigslist.org/brk/trd/d/brooklyn-motorcycle-dealership-looking/7103404321.html"
  );
  await page.click("  button");

  await page.waitForSelector("//aside");

  // await page.goto("https://newyork.craigslist.org/search/trd?");

  // const linkHandlers = await page.$x("(//a[@class='result-title hdrlnk'])");

  // if (linkHandlers.length > 0) {
  //   await linkHandlers[0].click();
  // } else {
  //   throw new Error("Link not found");
  // }

  // await Promise.all([
  //   page.waitForNavigation(),
  //   page.click("//button[@class='reply-button js-only']"),
  // ]);

  await browser.close();
})();
