import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';

const output = 'artifacts/page-boundaries';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const [width, height, reducedMotion] of [[320, 640, 'reduce'], [390, 844, 'no-preference'], [1440, 1000, 'reduce']]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/api/wishes**', route => route.fulfill({ json: { wishes: [] } }));
    await page.route('**/api/invitation', route => route.fulfill({ json: { name: 'Tamu Pengujian', attendance: null, guestCount: null } }));
    await page.goto('http://localhost:3000/invite/194-0042?view=hero', { waitUntil: 'domcontentloaded' });
    await page.locator('.cin-ended').waitFor({ timeout: 60000 });
    await page.waitForFunction(() => getComputedStyle(document.querySelector('.loading-screen')).opacity === '0');
    assert.equal(await page.locator('.chapter-boundary').count(), 8);
    assert.equal(await page.locator('.page-bridge-after-couple').count(), 1);
    for (const theme of ['event', 'rsvp', 'wishes', 'footer']) {
      for (const edge of ['top', 'bottom']) {
        const ornament = page.locator(`.chapter-boundary-${theme}.chapter-boundary-${edge}`);
        const position = await ornament.evaluate(el => el.getBoundingClientRect().top + scrollY);
        await page.evaluate(y => window.scrollTo(0, y - innerHeight / 2), position);
        await ornament.locator('img').evaluate(image => image.decode());
        const geometry = await ornament.evaluate(el => {
          const boundary = el.getBoundingClientRect();
          const art = el.querySelector('.chapter-boundary-art').getBoundingClientRect();
          return { crossesBoundary: art.top < boundary.top && art.bottom > boundary.top, decorative: el.getAttribute('aria-hidden'), pointerEvents: getComputedStyle(el).pointerEvents };
        });
        assert.equal(geometry.crossesBoundary, true);
        assert.equal(geometry.decorative, 'true');
        assert.equal(geometry.pointerEvents, 'none');
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        if (width === 390) {
          await page.waitForTimeout(1900);
          await page.screenshot({ path: `${output}/${theme}-${edge}-390.png` });
        }
      }
    }
    const form = page.locator('.rsvp-section');
    await form.scrollIntoViewIfNeeded();
    await form.getByLabel('Jumlah tamu yang hadir (termasuk Anda)').fill('2');
    assert.equal(await form.getByRole('button', { name: 'Kirim RSVP' }).isEnabled(), true);
    assert.deepEqual(errors, []);
    console.log(`${width}px: eight decorative edges cross the correct boundaries; no overflow; RSVP remains usable.`);
    await page.close();
  }
} finally { await browser.close(); }
