import puppeteer from "puppeteer";

export const scrap = async () => {
  console.log("Started scraping...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-gpu"],
  });
  console.log("Browser launched...");
  const page = await browser.newPage();
  console.log("On the page...");

  page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36WAIT_UNTIL=load"
  );

  await page.goto(
    "https://bid.cars/en/search/archived/results?search-type=filters&type=Automobile&year-from=2018&year-to=2021&make=Honda&model=Civic&auction-type=All",
    {
      waitUntil: "networkidle0",
      timeout: 0,
    }
  );

  console.log("Page is loaded");

  const carTitles = await page.$$eval("a.damage-info", (titles) =>
    titles.map((title) => title.textContent)
  );

  console.log("car titles here:");
  console.log(carTitles);

  const carTitleHrefs = await page.$$eval("a.damage-info", (titles) =>
    titles.map((title) => title.href)
  );

  console.log("hrefs here:");
  console.log(carTitleHrefs);

  const carVinCodes = carTitleHrefs.map((titleHref) => {
    const vinCodeStartIndex = titleHref.indexOf("Civic-") + 6;
    const vinCodeEndIndex = titleHref.indexOf("Civic-") + 23;
    return titleHref.slice(vinCodeStartIndex, vinCodeEndIndex);
  });

  console.log("vin codes here:");
  console.log(carVinCodes);

  const carPrices = await page.$$eval("div.price-box", (prices) =>
    prices.map((price) => price.textContent.slice(12))
  );

  console.log("car prices here:");
  console.log(carPrices);

  const carImages = await page.$$eval(".carousel-item.active", (images) =>
    images.map((image) => {
      const imageURL = image.style.backgroundImage;
      return imageURL.slice(
        imageURL.indexOf('"') + 1,
        imageURL.lastIndexOf('"')
      );
    })
  );

  console.log("car images here:");
  console.log(carImages);

  const keywords = ["ex", "ex-t", "ex-l", "touring"];

  const data = carTitles.map((title, index) => {
    return {
      carTitle: title,
      carPrice: carPrices[index],
      carImage: carImages[index],
      carVin: carVinCodes[index],
    };
  });

  console.log("Data prepared");
  console.log(data);

  const filteredData = data.filter((car) =>
    keywords.some((keyword) =>
      car.carTitle.toLowerCase().includes(keyword.toLowerCase())
    )
  );

  console.log("Data filtered");
  console.log(filteredData);

  await browser.close();

  console.log("Browser closed");

  return filteredData;
};
