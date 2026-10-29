import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const baseUrl = process.argv[2] || 'http://127.0.0.1:3016';
const testToken = 'a'.repeat(43);
await mkdir('artifacts/full-review', { recursive: true });
async function saveScreenshot(target, options) {
  let lastError;
  for (let attempt = 0; attempt < 5; attempt++) {
    try { return await target.screenshot(options); }
    catch (error) {
      if (!/UNKNOWN|EPERM/.test(String(error))) throw error;
      lastError = error;
      await new Promise(resolve => setTimeout(resolve, 250 * (attempt + 1)));
    }
  }
  throw lastError;
}
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const [label, width, height] of [['small', 320, 568], ['mobile', 390, 844], ['wide', 430, 932]]) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/api/invitation', route => route.fulfill({ json: { name: 'Nama Tamu', attendance: null } }));
    await page.route('**/api/rsvp', route => route.fulfill({ json: { ok: true, attendance: 'attending' } }));
    await page.route('**/api/wishes', route => route.fulfill({ json: route.request().method() === 'GET'
      ? { wishes: [{ id: 'seed', name: 'Tamu Uji', message: 'Semoga bahagia selalu.', createdAt: '2026-10-19T00:00:00.000Z' }] }
      : { ok: true } }));
    if (label === 'mobile') await page.route('**/artwork/section-venue-generated.webp', async route => {
      await new Promise(resolve => setTimeout(resolve, 1200));
      await route.continue();
    });
    await page.goto(`${baseUrl}/invite/1#${testToken}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    if (label === 'mobile') {
      await page.locator('.loading-screen').waitFor({ state: 'visible' });
      assert.equal(await page.locator('.open-button').isDisabled(), true);
      await page.locator('.loading-bloom img').evaluate(image => image.decode());
      assert.equal(await page.locator('.loading-screen h2').textContent(), 'Loading...');
      await saveScreenshot(page, { path: 'artifacts/full-review/mobile-loading.png' });
    }
    await page.waitForFunction(() => document.querySelector('.loading-progress')?.getAttribute('aria-valuenow') === '100', null, { timeout: 60000 });
    await page.locator('.loading-screen').waitFor({ state: 'detached', timeout: 60000 });
    await page.getByText('Yth. Nama Tamu').waitFor();
    assert.equal(await page.locator('.cover .botanical').count(), 4);
    assert.equal(await page.locator('.cover .vine-frame').count(), 1);
    assert.equal(await page.locator('.cover .cover-sky').count(), 1);
    assert.equal(await page.locator('.cover .guest-greeting').textContent(), 'Yth. Nama Tamu');
    if (label === 'mobile') await saveScreenshot(page, { path: 'artifacts/full-review/mobile-opening.png' });
    await page.getByRole('button', { name: 'BUKA UNDANGAN', exact: true }).click();
    await page.locator('.stage-hero').waitFor();
    assert.equal(await page.locator('.guest-greeting').count(), 0);
    for (const heading of ['Countdown', 'The Wedding', 'Venue', 'RSVP', 'Gallery', 'Wedding Wishes', 'Wanna give us some gifts?']) {
      assert.equal(await page.getByRole('heading', { name: heading }).count(), 1, `${label}: ${heading}`);
    }
    assert.equal(await page.locator('.countdown-unit').count(), 4);
    assert.notEqual(await page.locator('.countdown-number').first().getAttribute('data-value'), '--');
    assert.equal(await page.locator('.page-bridge-garland').count(), 2);
    assert.equal(await page.locator('.venue-architecture').getAttribute('src'), '/artwork/section-venue-generated.webp');
    const venueLayers = await page.locator('.venue-section').evaluate(section => {
      const art = section.querySelector('.venue-architecture').getBoundingClientRect();
      const card = section.querySelector('.venue-panel').getBoundingClientRect();
      return { artTop: art.top, artBottom: art.bottom, cardTop: card.top, cardBottom: card.bottom };
    });
    assert(venueLayers.cardTop < venueLayers.artBottom && venueLayers.cardBottom > venueLayers.artTop, 'venue card must overlap the architectural drawing');
    assert.deepEqual(await page.locator('.gallery-photo img').evaluateAll(images => images.map(image => image.getAttribute('src'))), ['/artwork/couple-user-upload.jpg', '/artwork/brides-user-upload.jpg', '/artwork/bridesgroom-user-upload.jpg']);
    assert.equal(await page.locator('.hero-tree-branch').count(), 2);
    assert.equal(await page.locator('.page-bridge-spray').count(), 0);
    assert.equal(await page.locator('.couple-floating-branch').count(), 2);
    assert.equal(await page.locator('.couple-page-header p').count(), 0);
    assert.equal(await page.locator('img[src*="ornament-review"]').count(), 0);
    assert.equal(await page.locator('.music-control').evaluate(element => getComputedStyle(element).position), 'fixed');
    assert.equal(await page.getByText('Semoga bahagia selalu.').count(), 1);
    assert.equal(await page.locator('.event-section a[href*="calendar.google.com"]').count(), 1);
    assert.equal(await page.locator('.wedding-date').textContent(), '28 November 2026');
    assert.equal(await page.locator('.event-list').getByText('10.00–13.00 WIB').count(), 1);
    assert.equal(await page.locator('.event-list').getByText('Mohammad Bahrodin & Mariatul Qibtiyah').count(), 1);
    assert.equal(await page.locator('.gift-card strong').textContent(), '009001079530506');
    assert.equal(await page.getByText('14 November 2026').count(), 0);
    assert.equal(await page.getByText('XXX').count(), 0);
    assert.equal(await page.locator('.venue-section a[href="https://maps.app.goo.gl/rrxyNSaMfoAMDv3v5"]').count(), 1);
    assert.equal(await page.locator('.event-section a[href="https://maps.app.goo.gl/rrxyNSaMfoAMDv3v5"]').count(), 2);
    assert.equal(await page.getByText('Jeda animasi').count(), 0);
    assert.equal(await page.locator('.music-credit').count(), 0);
    await page.getByRole('button', { name: 'Kirim RSVP' }).click();
    await page.getByText('Terima kasih. Konfirmasi kehadiran Anda telah tersimpan dan bersifat final.').waitFor();
    await page.getByLabel('Ucapan untuk Rizal & Dewi').fill('Selamat menempuh hidup baru.');
    await page.getByRole('button', { name: 'Kirim ucapan' }).click();
    await page.getByText('Terima kasih. Ucapan Anda telah ditampilkan.').waitFor();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${label}: horizontal overflow`);
    assert.deepEqual(errors, [], `${label}: runtime errors`);
    if (label === 'mobile') {
      await page.getByRole('button', { name: 'Hentikan musik' }).waitFor({ timeout: 20000 });
      await page.getByRole('button', { name: 'Hentikan musik' }).click();
      await page.getByRole('button', { name: 'Putar musik' }).waitFor();
      await page.getByRole('button', { name: 'Putar musik' }).click();
      await page.getByRole('button', { name: 'Hentikan musik' }).waitFor({ timeout: 20000 });
      await page.getByRole('button', { name: 'Hentikan musik' }).click();
      const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      assert.deepEqual(audit.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) })), [], 'accessibility audit');
      await saveScreenshot(page.locator('.gallery-section'), { path: 'artifacts/full-review/mobile-gallery.png' });
      await saveScreenshot(page.locator('.venue-section'), { path: 'artifacts/full-review/mobile-venue.png' });
      await saveScreenshot(page.locator('.bank-transfer-card'), { path: 'artifacts/full-review/mobile-bank-transfer.png' });
      await saveScreenshot(page, { path: 'artifacts/full-review/mobile-full.png', fullPage: true });
    }
    console.log(`${label}: PASS`);
    await page.close();
    await context.close();
  }
  const failure = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await failure.route('**/artwork/section-venue-generated.webp', route => route.abort());
  await failure.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await failure.getByText('Aset gagal dimuat.').waitFor({ timeout: 60000 });
  await failure.getByRole('button', { name: 'Lanjutkan' }).click();
  await failure.locator('.loading-screen').waitFor({ state: 'detached' });
  assert.equal(await failure.getByRole('button', { name: 'BUKA UNDANGAN', exact: true }).isEnabled(), true);
  console.log('asset failure fallback: PASS');
  await failure.close();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.locator('.loading-screen').waitFor({ state: 'detached', timeout: 60000 });
  await page.getByRole('button', { name: 'BUKA UNDANGAN', exact: true }).click();
  await page.getByText('Buka tautan undangan pribadi yang valid untuk mengirim RSVP.').waitFor();
  assert.equal(await page.getByRole('button', { name: 'Kirim RSVP' }).isDisabled(), true);
  console.log('unconfigured RSVP: PASS');
  await page.close();
  const shortLink = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await shortLink.route('**/api/invitation', async route => {
    const identity = route.request().postDataJSON();
    assert.deepEqual(identity, { invitationId: '194', invitationToken: '0042' });
    await route.fulfill({ json: { name: 'Tamu Kode Pendek', attendance: null } });
  });
  await shortLink.route('**/api/wishes', route => route.fulfill({ json: { wishes: [] } }));
  await shortLink.goto(`${baseUrl}/invite/194-0042`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await shortLink.getByText('Yth. Tamu Kode Pendek').waitFor({ timeout: 60000 });
  assert.match(await shortLink.locator('meta[name="robots"]').getAttribute('content'), /noindex/);
  console.log('four-digit guest link: PASS');
  await shortLink.close();
  const animated = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await animated.route('**/artwork/section-venue-generated.webp', async route => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    await route.continue();
  });
  await animated.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await animated.locator('.loading-screen').waitFor({ state: 'visible' });
  assert.equal(await animated.locator('.loading-bloom img').evaluate(image => getComputedStyle(image).animationName), 'loading-flower-rotate');
  const flowerStart = await animated.locator('.loading-bloom img').evaluate(image => getComputedStyle(image).transform);
  await animated.waitForTimeout(180);
  assert.notEqual(await animated.locator('.loading-bloom img').evaluate(image => getComputedStyle(image).transform), flowerStart);
  console.log('rotating line art flower: PASS');
  await animated.locator('.loading-screen').waitFor({ state: 'detached', timeout: 60000 });
  await animated.getByRole('button', { name: 'BUKA UNDANGAN', exact: true }).click();
  await animated.locator('.stage-hero').waitFor();
  await animated.locator('.countdown-grid').scrollIntoViewIfNeeded();
  await animated.locator('.countdown-intro').first().waitFor();
  const initial = await animated.locator('.countdown-intro').allTextContents();
  assert(initial.every(value => /^[1-9][0-9]$/.test(value)), 'intro must use two-digit numbers without a leading zero');
  await saveScreenshot(animated.locator('.countdown-section'), { path: 'artifacts/full-review/mobile-countdown-start.png' });
  await animated.waitForTimeout(350);
  const advanced = await animated.locator('.countdown-intro').allTextContents();
  assert(advanced.every(value => /^[1-9][0-9]$/.test(value)));
  assert.notDeepEqual(initial, advanced, 'random two-digit intro must change');
  await animated.locator('.countdown-intro').first().waitFor({ state: 'detached', timeout: 5000 });
  await saveScreenshot(animated.locator('.countdown-section'), { path: 'artifacts/full-review/mobile-countdown.png' });
  assert.equal(await animated.locator('.countdown-number').count(), 4);
  assert((await animated.locator('.countdown-number').evaluateAll(elements => elements.map(element => element.getAttribute('data-value')))).every(value => value === String(Number(value))), 'settled countdown must not have leading zeros');
  await animated.locator('.odometer-strip').first().waitFor({ timeout: 3000 });
  assert.equal(await animated.locator('.odometer-strip').first().evaluate(element => getComputedStyle(element).animationName), 'odometer-roll');
  console.log('two-digit countdown intro and odometer ticks: PASS');
  await animated.close();
} finally { await browser.close(); }
