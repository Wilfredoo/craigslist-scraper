const puppeteer = require("puppeteer");
const fs = require("fs-extra");
const scrapeCategory = async () => {
  const browser = await puppeteer.launch({ headless: true, slowMo: 1000 });

  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);

  await page.goto("https://newyork.craigslist.org/search/trd?");
  let linkHandlers = await page.$x("(//a[@class='result-title hdrlnk'])");
  let i;
  for (i = 0; i < 120; i++) {
    console.log("loop number", i);
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
};

(async () => {
  scrapeCategory();
})();
