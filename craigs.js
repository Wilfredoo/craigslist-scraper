const puppeteer = require("puppeteer");
const fs = require("fs-extra");

(async () => {
  const browser = await puppeteer.launch({ headless: false, slowMo: 1000 });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto("https://newyork.craigslist.org/search/trd?");
  let linkHandlers = await page.$x("(//a[@class='result-title hdrlnk'])");
  let i;
  for (i = 0; i < 3; i++) {
    console.log("linhand", linkHandlers.length);
    await linkHandlers[i].click();
    await page.waitForNavigation(), await page.click("button");
    await page.waitForSelector("aside");
    const element = await page.$(".reply-email-address");
    const email = await page.evaluate(
      (element) => element.textContent,
      element
    );
    await fs.appendFile("nyc.csv", `"${email}"\n`);
    await page.goBack();
    linkHandlers = await page.$x("(//a[@class='result-title hdrlnk'])");
  }
  await browser.close();
})();
