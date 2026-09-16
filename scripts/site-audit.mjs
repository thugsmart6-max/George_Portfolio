/**
 * One-shot Playwright audit for scroll health + key marketing routes.
 * Usage: node scripts/site-audit.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3000";

const ROUTES = [
  "/",
  "/about",
  "/services",
  "/academy",
  "/stories",
  "/resources",
  "/resources/tracker",
  "/resources/analysis",
  "/calculators",
  "/planner",
  "/contact",
  "/gallery",
];

function collectMetrics() {
  const html = document.documentElement;
  const body = document.body;
  const footer = document.querySelector("footer");
  const loader = document.querySelector(".loader-screen");
  const htmlOverflow = getComputedStyle(html).overflow;
  const bodyOverflow = getComputedStyle(body).overflow;
  const bodyOverflowX = getComputedStyle(body).overflowX;
  const bodyOverflowY = getComputedStyle(body).overflowY;
  const footerRect = footer?.getBoundingClientRect();
  return {
    url: location.pathname,
    title: document.title,
    htmlOverflow,
    htmlOverflowY: getComputedStyle(html).overflowY,
    bodyOverflow,
    bodyOverflowX,
    bodyOverflowY,
    htmlScrollH: html.scrollHeight,
    bodyScrollH: body.scrollHeight,
    clientH: html.clientHeight,
    scrollY: window.scrollY,
    canScroll: html.scrollHeight > html.clientHeight + 40,
    overflowLocked:
      htmlOverflow.includes("hidden") || bodyOverflow === "hidden",
    loaderVisible: Boolean(loader),
    lenis: Boolean(window.__lenis),
    footerText: footer?.textContent?.replace(/\s+/g, " ").trim().slice(0, 180) ?? "",
    footerBottom: footerRect ? Math.round(footerRect.bottom) : null,
    thanithInFooter: /Thanith/i.test(footer?.textContent ?? ""),
  };
}

async function measureRoute(page, path, viewport) {
  const errors = [];
  const consoleErrors = [];
  page.on("pageerror", (err) => errors.push(String(err)));
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });

  const res = await page.goto(`${BASE}${path}`, {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });

  await page.waitForTimeout(2800);
  await page.locator(".loader-screen").waitFor({ state: "detached", timeout: 6000 }).catch(() => {});

  const before = await page.evaluate(collectMetrics);

  await page.mouse.wheel(0, 1800);
  await page.waitForTimeout(700);
  const afterWheel = await page.evaluate(collectMetrics);

  await page.evaluate(() => {
    window.__lenis?.scrollTo?.(document.body.scrollHeight, { immediate: true });
    window.scrollTo(0, document.documentElement.scrollHeight);
  });
  await page.waitForTimeout(500);
  const afterJump = await page.evaluate(collectMetrics);

  const footerVisible = await page
    .locator("footer")
    .evaluate((el) => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    })
    .catch(() => false);

  return {
    path,
    viewport,
    status: res?.status() ?? 0,
    before,
    afterWheel,
    afterJump,
    footerVisibleAfterJump: footerVisible,
    wheelMoved: afterWheel.scrollY > before.scrollY + 40,
    jumpMoved: afterJump.scrollY > before.scrollY + 80,
    overflowLockedAfter: afterJump.overflowLocked,
    pageErrors: errors,
    consoleErrors: consoleErrors.slice(0, 8),
  };
}

async function extraChecks(page) {
  const out = {};

  await page.goto(`${BASE}/resources/tracker`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2500);
  const trackerHasFields = await page.locator("text=buy").count().catch(() => 0);
  const trackerInputs = await page.locator("input").count();
  out.tracker = { inputs: trackerInputs, buyMention: trackerHasFields };

  await page.goto(`${BASE}/resources/analysis`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2500);
  const analysisHeadings = await page.locator("h1, h2, .display").allTextContents();
  out.analysis = {
    headingSample: analysisHeadings.slice(0, 6).map((t) => t.trim()).filter(Boolean),
  };

  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2500);
  const themeBtn = page.getByRole("button").filter({ hasText: /light|dark|theme/i }).first();
  const themeCount = await page.getByRole("button").count();
  out.themeButtons = themeCount;
  if (await themeBtn.count()) {
    const beforeTheme = await page.evaluate(() => document.documentElement.dataset.theme);
    await themeBtn.click();
    await page.waitForTimeout(300);
    const afterTheme = await page.evaluate(() => document.documentElement.dataset.theme);
    out.themeToggle = { beforeTheme, afterTheme, changed: beforeTheme !== afterTheme };
  } else {
    out.themeToggle = { found: false };
  }

  const navLabels = await page.locator("header a").allTextContents();
  out.nav = navLabels.map((t) => t.trim()).filter(Boolean);

  return out;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const report = { base: BASE, startedAt: new Date().toISOString(), routes: [] };

  for (const viewport of [
    { name: "desktop", width: 1440, height: 900 },
    { name: "mobile", width: 390, height: 844 },
  ]) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      reducedMotion: "no-preference",
    });
    const page = await context.newPage();

    for (const path of ROUTES) {
      try {
        const result = await measureRoute(page, path, viewport.name);
        report.routes.push(result);
        const mark =
          result.wheelMoved || result.jumpMoved
            ? "OK"
            : result.before.canScroll
              ? "STUCK"
              : "SHORT";
        console.log(
          `[${viewport.name}] ${path.padEnd(24)} ${mark}  wheel=${result.wheelMoved} jump=${result.jumpMoved} footer=${result.footerVisibleAfterJump} y=${result.afterJump.scrollY} locked=${result.overflowLockedAfter}`
        );
      } catch (err) {
        console.error(`[${viewport.name}] ${path} FAIL`, err.message);
        report.routes.push({ path, viewport: viewport.name, error: String(err) });
      }
    }

    if (viewport.name === "desktop") {
      report.extras = await extraChecks(page);
    }

    await context.close();
  }

  const stuck = report.routes.filter(
    (r) => r.before?.canScroll && !r.wheelMoved && !r.jumpMoved
  );
  const locked = report.routes.filter((r) => r.overflowLockedAfter);
  const missingFooter = report.routes.filter((r) => r.footerVisibleAfterJump === false);

  report.summary = {
    stuck: stuck.map((r) => `${r.viewport}:${r.path}`),
    overflowLocked: locked.map((r) => `${r.viewport}:${r.path}`),
    footerNotVisible: missingFooter.map((r) => `${r.viewport}:${r.path}`),
  };

  console.log("\nSUMMARY", JSON.stringify(report.summary, null, 2));
  if (report.extras) {
    console.log("EXTRAS", JSON.stringify(report.extras, null, 2));
  }

  await browser.close();

  const failed = stuck.length + locked.length;
  process.exitCode = failed ? 1 : 0;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
