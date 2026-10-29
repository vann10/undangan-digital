import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';

await mkdir('artifacts/footer', { recursive: true });
const baseUrl = process.argv[2] || 'http://127.0.0.1:3016';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const [width, height, motion] of [[320, 640, 'reduce'], [390, 844, 'no-preference'], [1440, 1000, 'reduce']]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: motion });
    page.on('pageerror', error => console.log('Runtime error:', error.message));
    await page.route('**/api/wishes**', route => route.fulfill({ json: { wishes: [] } }));
    await page.goto(`${baseUrl}/?view=hero`, { waitUntil: 'domcontentloaded' });
    await page.locator('.cin-ended').waitFor({ timeout: 60000 });
    await page.waitForFunction(() => getComputedStyle(document.querySelector('.loading-screen')).opacity === '0');
    const footer = page.locator('.closing-section');
    await footer.scrollIntoViewIfNeeded();
    if (motion === 'no-preference') await page.waitForFunction(() => document.querySelector('.closing-section').dataset.scrollState === 'settled');
    await footer.locator('img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
    await footer.screenshot({ path: `artifacts/footer/footer-${width}.png` });
    const visibility = await footer.evaluate(section => {
      const boundary = section.getBoundingClientRect();
      return ['.closing-thanks', '.closing-monogram'].map(selector => {
        const element = section.querySelector(selector);
        const box = element.getBoundingClientRect();
        return { selector, opacity: getComputedStyle(element).opacity, inside: box.top >= boundary.top && box.bottom <= boundary.bottom && box.left >= boundary.left && box.right <= boundary.right };
      });
    });
    assert(visibility.every(element => element.inside && Number(element.opacity) > 0), JSON.stringify(visibility));
    if (motion === 'no-preference') {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForFunction(() => document.querySelector('.closing-section').getBoundingClientRect().top > innerHeight);
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      assert.equal(await footer.getAttribute('data-scroll-state'), 'settled');
      assert.equal(await footer.locator('.closing-thanks').evaluate(el => getComputedStyle(el).opacity), '1');
      assert.equal(await footer.locator('.closing-monogram').evaluate(el => getComputedStyle(el).opacity), '0.32');
      await footer.scrollIntoViewIfNeeded();
      assert.equal(await footer.getAttribute('data-scroll-state'), 'settled');
      console.log('Footer remains visible after scrolling away and returning.');
    }
    console.log(JSON.stringify(await footer.evaluate(section => {
      const footer = section.getBoundingClientRect();
      const names = section.querySelector('.closing-names').getBoundingClientRect();
      const monogram = section.querySelector('.closing-monogram').getBoundingClientRect();
      return { width: innerWidth, overflow: document.documentElement.scrollWidth > innerWidth, namesInside: names.left >= footer.left && names.right <= footer.right, monogramInside: monogram.bottom <= footer.bottom, heading: section.querySelector('h2').getAttribute('aria-label') };
    })));
    await page.close();
  }
} finally { await browser.close(); }
