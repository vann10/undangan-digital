import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const base = process.argv[2] || 'http://localhost:3000';
await mkdir('artifacts/rsvp-gallery', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const [width, height, reducedMotion] of [[360, 640, 'reduce'], [390, 844, 'no-preference'], [1440, 1000, 'reduce']]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/api/wishes**', route => route.fulfill({ json: { wishes: [] } }));
    await page.route('**/api/invitation', route => route.fulfill({ json: { name: 'Tamu Pengujian', attendance: null, guestCount: null } }));
    await page.route('**/api/rsvp', route => route.fulfill({ json: { ok: true, attendance: 'attending', guestCount: 1 } }));
    await page.goto(`${base}/invite/194-0042?view=hero`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.locator('.cin-ended').waitFor({ timeout: 60000 });
    await page.waitForFunction(() => getComputedStyle(document.querySelector('.loading-screen')).opacity === '0');
    await page.locator('.cin-guest p').filter({ hasText: 'Tamu Pengujian' }).waitFor({ state: 'attached' });
    const gallery = page.locator('.gallery-section');
    await gallery.scrollIntoViewIfNeeded();
    await gallery.locator('.chapter-background img').evaluate(image => image.decode());
    const bounds = await gallery.evaluate(section => {
      const sectionBox = section.getBoundingClientRect();
      const image = section.querySelector('.chapter-background img');
      const imageBox = image.getBoundingClientRect();
      return { height: sectionBox.height, width: sectionBox.width, imageHeight: imageBox.height, imageWidth: imageBox.width, topGap: imageBox.top - sectionBox.top, fit: getComputedStyle(image).objectFit, mask: getComputedStyle(image).maskImage };
    });
    assert(Math.abs(bounds.height - bounds.imageHeight) < 1, JSON.stringify(bounds));
    assert(Math.abs(bounds.width - bounds.imageWidth) < 1, JSON.stringify(bounds));
    assert(Math.abs(bounds.topGap) < 1, JSON.stringify(bounds));
    assert.equal(bounds.fit, 'cover');
    assert.equal(bounds.mask, 'none');
    await gallery.getByRole('button', { name: 'Lihat foto Rizal & Dewi', exact: true }).click();
    const dialog = page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible' });
    await page.keyboard.press('ArrowRight');
    assert.equal(await dialog.locator('figcaption').innerText(), 'Dewi Nur Alizzah');
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'hidden' });
    await gallery.screenshot({ path: `artifacts/rsvp-gallery/gallery-${width}.png` });
    const rsvp = page.locator('.rsvp-section');
    await rsvp.scrollIntoViewIfNeeded();
    await rsvp.getByRole('button', { name: 'Kirim RSVP' }).click();
    await rsvp.getByText('Terima kasih. Konfirmasi kehadiran Anda telah tersimpan dan bersifat final.').waitFor();
    await rsvp.screenshot({ path: `artifacts/rsvp-gallery/rsvp-${width}.png` });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.deepEqual(errors, []);
    console.log(`${width}px ${reducedMotion}: full Gallery backdrop, dialog navigation and RSVP pass.`);
    await page.close();
  }
} finally { await browser.close(); }
