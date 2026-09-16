import { expect, test, type Page } from "@playwright/test";

const ROUTES = [
  "/",
  "/about",
  "/services",
  "/academy",
  "/stories",
  "/resources",
  "/resources/tracker",
  "/calculators",
  "/planner",
  "/contact",
];

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    return Math.max(0, Math.ceil(doc.scrollWidth - doc.clientWidth));
  });
}

test.describe("production pages stay on canvas", () => {
  for (const route of ROUTES) {
    test(`${route} loads without horizontal overflow`, async ({ page }) => {
      const res = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(res?.ok() ?? false).toBeTruthy();
      await page.waitForTimeout(400);
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(8);
    });
  }
});

test.describe("tracker lot form", () => {
  test("strips leading zeros on qty and shows symbol field", async ({ page }) => {
    await page.goto("/resources/tracker", { waitUntil: "networkidle" });
    const qty = page.getByRole("textbox", { name: "Qty" });
    await expect(qty).toBeVisible();
    await qty.click();
    await qty.fill("");
    await qty.pressSequentially("0999", { delay: 20 });
    await expect(qty).toHaveValue("999");

    const symbol = page.getByRole("textbox", { name: "NSE symbol" });
    await expect(symbol).toBeVisible();
    await symbol.fill("INF");
    await expect(page.getByRole("listbox")).toBeVisible({ timeout: 12_000 });
  });

  test("primary nav is reachable", async ({ page }) => {
    await page.goto("/resources/tracker", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  });
});
