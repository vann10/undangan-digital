import { chromium } from '@playwright/test';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'no-preference' });
  await page.route('**/api/wishes**', route => route.fulfill({ json: { wishes: [] } }));
  await page.goto('http://localhost:3000/?view=hero');
  await page.locator('.cin-ended').waitFor();
  const el = page.locator('.chapter-boundary-rsvp.chapter-boundary-bottom');
  const pos = await el.evaluate(el => el.getBoundingClientRect().top + scrollY);
  await page.evaluate(y => scrollTo(0, y - innerHeight/2), pos);
  await el.locator('img').evaluate(img => img.decode());
  await page.waitForTimeout(2000);
  console.log(JSON.stringify(await el.evaluate(el => {
    return [el, ...el.querySelectorAll('*')].map(node => {
      const css = getComputedStyle(node), rect = node.getBoundingClientRect();
      return { tag: node.tagName, src: node.src, rect: rect.toJSON(), top: css.top, height: css.height, opacity: css.opacity, visibility: css.visibility, display: css.display, zIndex: css.zIndex };
    });
  }), null, 2));
  await page.screenshot({ path: 'artifacts/page-boundaries/rsvp-inspected.png' });
} finally { await browser.close(); }
