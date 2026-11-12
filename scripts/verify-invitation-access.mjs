import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const base = process.argv[2] || 'http://127.0.0.1:3030';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
await mkdir('artifacts/invitation-access', { recursive: true });

async function invalidNotice(page) {
  await page.getByRole('heading', { name: 'Tautan Undangan Tidak Valid', exact: true }).waitFor();
  assert.equal(await page.locator('.cin-stage, .rsvp-section, .music-control').count(), 0);
  assert.doesNotMatch(await page.locator('main').innerText(), /404/);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
}

try {
  for (const [width, height] of [[320, 640], [390, 844], [1440, 1000]]) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const path of ['/', '/alamat-tidak-dikenal', '/invite/bukan-tamu', '/preview/tidak-valid']) {
      const response = await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 404, path);
      await invalidNotice(page);
    }
    await page.screenshot({ path: `artifacts/invitation-access/notice-${width}.png`, fullPage: true });
    const a11y = await new AxeBuilder({ page }).analyze();
    assert.deepEqual(a11y.violations.map(item => `${item.id}: ${item.description}`), []);
    assert.deepEqual(errors, []);
    await context.close();
    console.log(`Missing routes at ${width}px: PASS (404 status, botanical notice, no overflow, accessibility)`);
  }

  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  let lookups = 0;
  let releaseInvalid;
  const invalidResponse = new Promise(resolve => { releaseInvalid = resolve; });
  await page.route('**/api/invitation', async route => {
    lookups++;
    await invalidResponse;
    return route.fulfill({ status: 404, json: { error: 'Tautan undangan tidak valid atau tidak aktif.' } });
  });
  for (const path of ['/invite/1', '/invite/1#salah', '/invite/1#12345']) {
    await page.goto(`${base}${path}`, { waitUntil: 'domcontentloaded' });
    await invalidNotice(page);
  }
  assert.equal(lookups, 0, 'missing or malformed tokens never reach backend');
  for (const path of ['/invite/1-0042', `/invite/1#${'a'.repeat(43)}`]) {
    const before = lookups;
    await page.goto(`${base}${path}`, { waitUntil: 'domcontentloaded' });
    if (path === '/invite/1-0042') {
      await page.getByRole('progressbar', { name: 'Pemeriksaan akses undangan' }).waitFor();
      assert.equal(await page.locator('.invitation-notice').count(), 0, 'restriction only appears after invalid access is confirmed');
      await page.screenshot({ path: 'artifacts/invitation-access/guest-validation.png' });
      releaseInvalid();
    }
    await invalidNotice(page);
    assert.equal(lookups, before + 1, 'inactive credentials are not retried');
  }
  await page.unroute('**/api/invitation');
  let calls = 0;
  await page.route('**/api/invitation', route => {
    calls++;
    return route.fulfill(calls <= 3
      ? { status: 503, json: { error: 'Undangan belum tersedia.' } }
      : { json: { name: 'Tamu Pengujian', eventType: 'pria' } });
  });
  await page.route('**/api/wishes', route => route.fulfill({ json: { wishes: [] } }));
  await page.goto(`${base}/invite/1-0042`);
  await page.locator('.loading-screen').getByText('Undangan belum tersedia.', { exact: true }).waitFor();
  assert.equal(calls, 3, 'temporary failures use existing retries');
  assert.equal(await page.locator('.cin-stage').count(), 0);
  assert.equal(await page.locator('.invitation-notice').count(), 0, 'temporary errors stay on the loading screen');
  assert.equal(await page.getByRole('button', { name: 'Lanjutkan', exact: true }).count(), 0, 'guest validation cannot be skipped');
  await page.getByRole('button', { name: 'Coba lagi', exact: true }).click();
  await page.locator('.cin-guest p').filter({ hasText: 'Tamu Pengujian' }).waitFor({ timeout: 60000 });
  assert.equal(calls, 4);
  assert.equal(await page.locator('.invitation-notice').count(), 0);
  await page.unroute('**/api/invitation');
  const tokens = [];
  await page.route('**/api/invitation', route => {
    tokens.push(route.request().postDataJSON().invitationToken);
    return route.fulfill({ json: { name: 'Tamu Kode Pendek', eventType: 'pria' } });
  });
  for (const code of ['1', '9', '10', '99', '100', '999', '1000', '9999', '0042']) {
    await page.goto(`${base}/invite/1-${code}`);
    await page.locator('.cin-guest p').filter({ hasText: 'Tamu Kode Pendek' }).waitFor({ timeout: 60000 });
    assert.equal(tokens.at(-1), code.padStart(4, '0'));
    assert.equal(await page.locator('.invitation-notice').count(), 0);
  }
  await page.goto(`${base}/invite/1#42`);
  await page.locator('.cin-guest p').filter({ hasText: 'Tamu Kode Pendek' }).waitFor({ timeout: 60000 });
  assert.equal(tokens.at(-1), '0042');
  assert.equal(tokens.length, 10, 'each short or padded code triggers one normalized lookup');
  await page.close();
  console.log('Guest access: PASS (short and padded codes, missing/malformed/inactive tokens, temporary error, retry recovery)');
} finally {
  await browser.close();
}
