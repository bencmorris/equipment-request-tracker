/* Automated acceptance tests for the priority-filter feature.
 *
 * Added in Exercise 7 in response to the requirements-review finding that
 * AC6 (empty state without data loss) was not demonstrated by shipped data or
 * any test. Covers AC1-AC7 from docs/priority-filter-spec.md.
 *
 * Run:
 *   npm install playwright      # one time
 *   node tests/priority-filter.test.js
 *
 * Exits 0 if all assertions pass, 1 otherwise.
 */

const { chromium } = require("playwright");
const path = require("path");

const FILE_URL =
  "file://" + path.resolve(__dirname, "..", "index.html");

let passed = 0;
let failed = 0;

function check(name, condition) {
  if (condition) {
    passed++;
    console.log("PASS  " + name);
  } else {
    failed++;
    console.log("FAIL  " + name);
  }
}

async function seed(page, requests) {
  await page.evaluate((data) => {
    if (data === null) {
      localStorage.removeItem("equipment-requests");
    } else {
      localStorage.setItem("equipment-requests", JSON.stringify(data));
    }
  }, requests);
  await page.reload();
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(FILE_URL);

  const items = () =>
    page.$$eval(".request-item .item-name", (els) =>
      els.map((e) => e.textContent)
    );
  const activeChip = () =>
    page.$eval(".chip.is-active", (e) => e.textContent.trim());
  const activeCount = () => page.$$eval(".chip.is-active", (e) => e.length);
  const countText = () => page.textContent("#result-count");
  const emptyHidden = () => page.$eval("#empty-state", (e) => e.hidden);

  // Default seed: 2 High, 2 Medium, 2 Low.
  await seed(page, null);

  // AC1 - Default view
  check("AC1 default view: All active and all 6 shown",
    (await activeChip()) === "All" && (await items()).length === 6);

  // AC2 - Filter to one priority
  await page.click('.chip[data-priority="High"]');
  const high = await items();
  check("AC2 filter High shows only High requests",
    high.length === 2 &&
    high.every((t) => ["Projector bulb", "Safety goggles (x12)"].includes(t)));

  // AC4 - Active indicator (exactly one)
  check("AC4 exactly one active chip, matching view",
    (await activeChip()) === "High" && (await activeCount()) === 1);

  // AC5 - Accurate count
  check("AC5 count text is accurate",
    (await countText()).trim() === "Showing 2 of 6 requests (High)");

  // AC3 - Reversible
  await page.click('.chip[data-priority="All"]');
  check("AC3 All restores every request",
    (await items()).length === 6);

  // AC6 - Empty state without data loss (the top finding).
  // Seed a single Low request, filter to High (no matches), expect empty state,
  // then All must still show the request (nothing deleted).
  await seed(page, [{ id: 1, item: "Only low", requester: "Test", priority: "Low" }]);
  await page.click('.chip[data-priority="High"]');
  const emptyShown = !(await emptyHidden());
  await page.click('.chip[data-priority="All"]');
  const restored = (await items()).length === 1;
  check("AC6 empty state shows and no data is lost", emptyShown && restored);

  // AC7 - Non-destructive add while filtered
  await seed(page, null);
  await page.click('.chip[data-priority="High"]');
  await page.fill("#item", "New high item");
  await page.fill("#requester", "Adder");
  await page.selectOption("#priority", "High");
  await page.click('button[type="submit"]');
  const afterAddHigh = await items();
  await page.click('.chip[data-priority="All"]');
  const afterAddAll = await items();
  check("AC7 add while filtered is saved and visible under All",
    afterAddHigh.includes("New high item") &&
    afterAddAll.includes("New high item") &&
    afterAddAll.length === 7);

  // Clean up storage so the app returns to seed data next run.
  await seed(page, null);

  await browser.close();
  console.log("\n" + passed + " passed, " + failed + " failed");
  process.exit(failed === 0 ? 0 : 1);
})();
