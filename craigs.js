const puppeteer = require("puppeteer");
const fs = require("fs-extra");

(async () => {
  const browser = await puppeteer.launch({ headless: false, slowMo: 1000 });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);

  await page.goto(
    "https://newyork.craigslist.org/brk/trd/d/brooklyn-motorcycle-dealership-looking/7103404321.html"
  );

  await page.click("button");

  await page.waitForSelector("aside");

  const element = await page.$(".reply-email-address");
  console.log("element", element);

  const email = await page.evaluate((element) => element.textContent, element);
  await fs.appendFile("out.csv", `"${email}"\n`);

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

// for (const li of lis) {
//   const name = await li.$eval("h2", (h2) => h2.innerText);
//   console.log(name);
// }

// const fs = require('fs-extra')
// await fs.writeFile('out.csv', 'section, name\n')
// await fs.appendFile('out.csv', `"${buttonName}", "${name}"\n`)
