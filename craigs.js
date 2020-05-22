const puppeteer = require("puppeteer");
const fs = require("fs-extra");
const fs2 = require("fs");

const truncateIt = async (area, category, csv) => {
	fs2.truncate("./nyc.csv", 0, function () {
		console.log("done");
	});
	fs2.truncate("./nj.csv", 0, function () {
		console.log("done");
	});
};

const scrapeIt = async (area, category, csv) => {
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();
	await page.setDefaultNavigationTimeout(0);
	await page.goto(`${area}${category}?`);
	let linkHandlers = await page.$x("(//a[@class='result-title hdrlnk'])");
	let i;
	for (i = 0; i < 50; i++) {
		console.log("loop: ", i, "area: ", area, " category: ", category);
		await linkHandlers[i].click();
		await page.waitForNavigation();
		const button = await page.$("button");
		if (button !== null) {
			await page.click("button");
			await page.setDefaultNavigationTimeout(0);

			await page.waitForSelector("aside");
			const element = await page.$(".reply-email-address");
			if (element !== null) {
				const email = await page.evaluate(
					element => element.textContent,
					element
				);
				console.log("email", email);
				console.log("csv", csv);
				await fs.appendFile(`${csv}`, `${email}\n`);
			}
		}
		await page.goBack();
		linkHandlers = await page.$x("(//a[@class='result-title hdrlnk'])");
	}
	await browser.close();
};

(async () => {
	// areas
	const newYork = "https://newyork.craigslist.org/search/";
	const newJersey = "https://newjersey.craigslist.org/search/";
	// categories
	const food = "fbh";
	const general = "lab";
	const skilled = "trd";
	// csv's
	const nyCSV = "nyc.csv";
	const njCSV = "nj.csv";

	await truncateIt();

	await scrapeIt(newYork, food, nyCSV);
	await scrapeIt(newYork, general, nyCSV);
	await scrapeIt(newYork, skilled, nyCSV);

	await scrapeIt(newJersey, food, njCSV);
	await scrapeIt(newJersey, general, njCSV);
	await scrapeIt(newJersey, skilled, njCSV);
})();
