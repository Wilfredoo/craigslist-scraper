const puppeteer = require("puppeteer");
const fs = require("fs-extra");
const scrapeCategory = async (category) => {
  const browser = await puppeteer.launch({ headless: false, slowMo: 1000 });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto(`https://newyork.craigslist.org/search/${category}?`);
  let linkHandlers = await page.$x("(//a[@class='result-title hdrlnk'])");
  let i;
  for (i = 0; i < 120; i++) {
    await linkHandlers[i].click();
    await page.waitForNavigation();
    const button = await page.$("button");
    console.log("gimme that button", button);
    if (button !== null) {
      await page.click("button");
      await page.waitForSelector("aside");
      const element = await page.$(".reply-email-address");
      const email = await page.evaluate(
        (element) => element.textContent,
        element
      );
      await fs.appendFile("nyc.csv", `"${email}"\n`);
    }
    await page.goBack();
    linkHandlers = await page.$x("(//a[@class='result-title hdrlnk'])");
  }
  await browser.close();
};

(async () => {
  const nycA = "fbh";
  const nycB = "lab";
  const nycC = "trd";
  const nycX = "tch";

  // scrapeCategory(nycA);
  // scrapeCategory(nycB);
  // scrapeCategory(nycC);
  scrapeCategory(nycX);
})();
