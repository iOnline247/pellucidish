/* eslint-disable no-console */
import puppeteer from "puppeteer";
// import { getPage } from "./utils";

// TODO:
// https://github.com/GoogleChrome/puppeteer/blob/master/examples/block-images.js

(async function main() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 250
  });
  const ctx = await browser.createIncognitoBrowserContext();
  const page = await ctx.newPage();

  await page.setRequestInterception(true);

  page.on("request", request => {
    if (request.resourceType() === "script") {
      request.abort();
    } else {
      request.continue();
    }
  });
  page.on("console", msg => console.log("PAGE LOG:", msg.text()));

  // TODO:
  // Slice after the "?"
  await page.goto(
    "https://www.nytimes.com/2019/11/18/us/muncie-mayor-dennis-tyler.html",
    { waitUntil: "domcontentloaded" } // "networkidle2"
  );

  // const elsToRemove = await page.$$(
  //   "body"
  //   // `#gateway-content, #top-wrapper, main > div:first-child > div:first-child, iframe, button, nav, [data-testid="recirculation"], [id^="story-ad"]`
  // );
  // const allEls = await page.$$("*");

  try {
    await page.evaluate(
      () =>
        new Promise(resolve => {
          const elsToRemove = document.querySelectorAll(
            // "body"
            `#gateway-content, #top-wrapper, main > div:first-child > div:first-child, iframe, button, nav, [data-testid="recirculation"], [id^="story-ad"]`
          );

          console.log(`# of els to remove: ${elsToRemove.length}`);
          elsToRemove.forEach(el => el.remove());

          // TODO:
          // Scroll viewport, take screenshot.
          window.scroll(0, 100);

          resolve();
          // window.addEventListener("DOMContentLoaded", () => {

          // });
        })
    );
  } catch (err) {
    debugger;
  }

  try {
    await page.hover("footer:last-child");
  } catch (err) {
    debugger;
  }

  // document.querySelectorAll("*").forEach(el => {
  //   el.classList = "";
  // el.height = "0px";
  // el.width = "0px";
  // });

  console.log(await page.content());

  await page.screenshot({ path: "screenshot.png", fullPage: true });

  await browser.close();
})();
