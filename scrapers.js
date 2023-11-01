import puppeteer from "puppeteer";

export const scrap = async () => {
  const browser = await puppeteer.launch({
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--headless",
      "--disable-gpu",
      "--no-zygote",
      "--window-size=1920x1080",
    ],
  });
  const page = await browser.newPage();

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

  await page.screenshot({ path: "./screenshot.png", fullPage: true });

  const carTitles = await page.$$eval("a.damage-info", (titles) =>
    titles.map((title) => title.textContent)
  );

  const carTitleHrefs = await page.$$eval("a.damage-info", (titles) =>
    titles.map((title) => title.href)
  );

  const carVinCodes = carTitleHrefs.map((titleHref) => {
    const vinCodeStartIndex = titleHref.indexOf("Civic-") + 6;
    const vinCodeEndIndex = titleHref.indexOf("Civic-") + 23;
    return titleHref.slice(vinCodeStartIndex, vinCodeEndIndex);
  });

  const carPrices = await page.$$eval("div.price-box", (prices) =>
    prices.map((price) => price.textContent.slice(16))
  );

  const carImages = await page.$$eval(".carousel-item.active", (images) =>
    images.map((image) => {
      const imageURL = image.style.backgroundImage;
      return imageURL.slice(
        imageURL.indexOf('"') + 1,
        imageURL.lastIndexOf('"')
      );
    })
  );

  const keywords = ["ex", "ex-t", "ex-l", "touring"];

  const data = carTitles.map((title, index) => {
    return {
      carTitle: title,
      carPrice: carPrices[index],
      carImage: carImages[index],
      carVin: carVinCodes[index],
    };
  });

  const filteredData = data.filter((car) =>
    keywords.some((keyword) =>
      car.carTitle.toLowerCase().includes(keyword.toLowerCase())
    )
  );

  await browser.close();

  return filteredData;
};
