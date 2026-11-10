import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const base = process.argv[2] || 'http://localhost:3000';
const albumOrder = ['ARY_5268', 'ARY_4842', 'ARY_4885', 'ARY_5008', 'ARY_5341', 'ARY_5224', 'ARY_5096', 'ARY_5162'];
const albumFrames = [
  [33.5, 0, 32.8], [67.2, 41.4, 32.8], [0, 50, 32.8], [33.5, 50, 32.8],
  [60.4, 91.8, 39.6], [26.6, 92.8, 33], [10.9, 134.85, 48.6], [60.4, 152, 39.6],
];
const settlePhoto = frame => frame.evaluate(async element => {
  const animations = element.getAnimations();
  await Promise.allSettled(animations.map(animation => animation.finished));
  return animations.length > 0;
});
async function verifyRsvpSpacing(rsvp) {
  const spacing = await rsvp.locator('form').evaluate(form => {
    const frame = form.getBoundingClientRect();
    const rows = Array.from(form.children)
      .filter(control => control.getClientRects().length)
      .map(control => control.getBoundingClientRect());
    const [attending, absent] = Array.from(form.querySelectorAll('.radio-row'), option => option.getBoundingClientRect());
    return {
      inside: rows.every(row => row.left - frame.left >= 14 && frame.right - row.right >= 14 &&
        row.top - frame.top >= 14 && frame.bottom - row.bottom >= 14),
      separated: rows.slice(1).every((row, index) => row.top > rows[index].bottom),
      optionGap: absent.left - attending.right,
    };
  });
  assert(spacing.inside && spacing.separated && spacing.optionGap >= 8, JSON.stringify(spacing));
}
await mkdir('artifacts/rsvp-gallery', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const [width, height, reducedMotion] of [[320, 640, 'reduce'], [390, 844, 'no-preference'], [1440, 1000, 'reduce']]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/api/wishes**', route => route.fulfill({ json: { wishes: [] } }));
    await page.route('**/api/invitation', route => route.fulfill({ json: { name: 'Tamu Pengujian', attendance: null, guestCount: null, eventType: 'pria' } }));
    await page.route('**/api/rsvp', route => route.fulfill({ json: { ok: true, attendance: 'attending', guestCount: 1 } }));
    await page.goto(`${base}/invite/194-0042?view=hero`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.locator('.cin-ended').waitFor({ timeout: 60000 });
    await page.waitForFunction(() => getComputedStyle(document.querySelector('.loading-screen')).opacity === '0');
    await page.locator('.cin-guest p').filter({ hasText: 'Tamu Pengujian' }).waitFor({ state: 'attached' });
    const rsvp = page.locator('.rsvp-section');
    await verifyRsvpSpacing(rsvp);
    const heroZoom = await page.locator('.cin-photo').evaluate(photo =>
      photo.getBoundingClientRect().width / photo.parentElement.getBoundingClientRect().width);
    assert(Math.abs(heroZoom - 1.375) < .01, `Hero zoom: ${heroZoom}`);
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
    const mosaic = await gallery.evaluate(section => {
      const grid = section.querySelector('.gallery-grid');
      const album = grid.getBoundingClientRect();
      const sectionBox = section.getBoundingClientRect();
      const tiles = Array.from(grid.querySelectorAll('.gallery-photo'), tile => tile.getBoundingClientRect());
      return {
        fits: tiles.every(tile => tile.left >= sectionBox.left && tile.right <= sectionBox.right + .5),
        frames: tiles.map(tile => [(tile.left - album.left), (tile.top - album.top), tile.width]
          .map(value => value * 100 / album.width)),
      };
    });
    assert(mosaic.fits && mosaic.frames.length === albumFrames.length, JSON.stringify(mosaic));
    assert(mosaic.frames.every((frame, index) => frame.every((value, field) =>
      Math.abs(value - albumFrames[index][field]) < .05)), JSON.stringify(mosaic));
    const photos = gallery.locator('.gallery-photo img');
    assert.deepEqual(await photos.evaluateAll(images => images.map(image => image.getAttribute('src'))),
      albumOrder.map(id => `/artwork/photos/${id}-320.webp`));
    const portraitFrames = gallery.locator('.gallery-photo-portrait');
    assert.equal(await portraitFrames.count(), 2);
    assert(await portraitFrames.evaluateAll(images => images.every(image => {
      const { width, height } = image.getBoundingClientRect();
      return Math.abs(width / height - 2 / 3) < .01 && getComputedStyle(image).objectFit === 'contain';
    })));
    assert.equal(await gallery.locator('.gallery-quote').innerText(), 'One promise,\nmany stories\nfor the\ntwo of us.');
    const photoButtons = gallery.locator('.gallery-photo-open');
    const dialog = gallery.getByRole('dialog', { name: 'Pratinjau foto' });
    const frame = dialog.locator('.gallery-preview-frame');
    const initialMosaicHeight = (await gallery.locator('.gallery-mosaic').boundingBox()).height;
    for (const [index, id] of albumOrder.entries()) {
      const button = photoButtons.nth(index);
      const initialWidth = (await button.boundingBox()).width;
      await button.click();
      await dialog.waitFor({ state: 'visible' });
      assert(await dialog.evaluate(element => element.matches(':modal')));
      const animatedOpen = await settlePhoto(frame);
      if (index === 0) assert.equal(animatedOpen, reducedMotion !== 'reduce');
      const image = frame.locator('.gallery-preview-detail');
      assert.equal(await image.getAttribute('src'), `/artwork/photos/${id}-960.webp`);
      const geometry = await image.evaluate(img => {
        const {left, top, width, height} = img.getBoundingClientRect();
        return { width, ratio: width / height,
          expectedRatio: Number(img.getAttribute('width')) / Number(img.getAttribute('height')),
          centered: Math.abs(left + width / 2 - innerWidth / 2) < 1 && Math.abs(top + height / 2 - innerHeight / 2) < 1,
          fits: left >= 0 && top >= 0 && left + width <= innerWidth && top + height <= innerHeight };
      });
      assert(geometry.width > initialWidth && geometry.centered && geometry.fits, JSON.stringify(geometry));
      assert(Math.abs(geometry.ratio - geometry.expectedRatio) < .01);
      assert.equal((await gallery.locator('.gallery-mosaic').boundingBox()).height, initialMosaicHeight);
      await frame.click();
      await dialog.waitFor({ state: 'hidden' });
      assert(Math.abs((await button.boundingBox()).width - initialWidth) < 1);
      assert(await button.evaluate(element => document.activeElement === element));
    }
    await photoButtons.nth(2).press('Enter');
    await dialog.waitFor({ state: 'visible' });
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'hidden' });
    await photoButtons.nth(3).click();
    await dialog.waitFor({ state: 'visible' });
    await dialog.click({ position: { x: 2, y: 2 } });
    await dialog.waitFor({ state: 'hidden' });
    await gallery.screenshot({ path: `artifacts/rsvp-gallery/gallery-${width}.png` });
    await rsvp.scrollIntoViewIfNeeded();
    await rsvp.getByRole('radio', { name: 'Hadir', exact: true }).check();
    await rsvp.getByRole('spinbutton', { name: /Jumlah tamu/ }).waitFor();
    await verifyRsvpSpacing(rsvp);
    await rsvp.getByRole('radio', { name: 'Tidak hadir', exact: true }).check();
    assert.equal(await rsvp.getByRole('spinbutton').count(), 0);
    await verifyRsvpSpacing(rsvp);
    await rsvp.getByRole('button', { name: 'Kirim RSVP' }).click();
    await rsvp.getByText('Terima kasih. Konfirmasi kehadiran Anda telah tersimpan dan bersifat final.').waitFor();
    await verifyRsvpSpacing(rsvp);
    await rsvp.screenshot({ path: `artifacts/rsvp-gallery/rsvp-${width}.png` });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.deepEqual(errors, []);
    console.log(`${width}px ${reducedMotion}: fixed mosaic, centered previews and RSVP pass.`);
    await page.close();
  }
} finally { await browser.close(); }
