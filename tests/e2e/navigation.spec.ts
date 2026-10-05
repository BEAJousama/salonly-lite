import { expect, test, type Page } from "@playwright/test";

// Crawls every internal link reachable from the dashboard and fails on
// 404s, uncaught exceptions, console errors, or hydration warnings.
function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error" || /hydrat/i.test(m.text()))
      errors.push(`console.${m.type()}: ${m.text()}`);
  });
  return errors;
}

test("every reachable route renders without errors", async ({ page }) => {
  test.setTimeout(300_000);
  const errors = watchErrors(page);
  const queue = ["/dashboard", "/sign-in", "/forgot-password", "/reset-password"];
  const seen = new Set(queue);
  const broken: string[] = [];
  while (queue.length) {
    const path = queue.shift()!;
    const before = errors.length;
    const response = await page.goto(path);
    if (!response || response.status() >= 400)
      broken.push(`${path} → HTTP ${response?.status()}`);
    await page.waitForLoadState("networkidle");
    if (await page.getByText("A little off the beaten path").isVisible())
      broken.push(`${path} → not found page`);
    for (const e of errors.slice(before)) broken.push(`${path} → ${e}`);
    const hrefs = await page
      .locator("a[href^='/']")
      .evaluateAll((links) =>
        links.map((l) => new URL((l as HTMLAnchorElement).href).pathname),
      );
    for (const href of hrefs) {
      if (!seen.has(href)) {
        seen.add(href);
        queue.push(href);
      }
    }
  }
  expect(seen.size).toBeGreaterThan(40);
  expect(broken).toEqual([]);
});
