import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const baseUrl = process.argv[2] || 'http://127.0.0.1:3016';
await mkdir('artifacts/full-review', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const [label, width, height] of [['small', 320, 568], ['mobile', 390, 844], ['wide', 430, 932]]) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/api/rsvp', async route => {
      if (route.request().method() === 'GET') await route.fulfill({ json: { wishes: [{ id: 'seed', name: 'Tamu Uji', message: 'Semoga bahagia selalu.', createdAt: '2026-10-19T00:00:00.000Z' }] } });
      else await route.fulfill({ json: { ok: true, id: 'saved' } });
    });
    await page.goto(`${baseUrl}/?to=Nama%20Tamu`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(1500);
    await page.getByRole('button', { name: 'BUKA UNDANGAN', exact: true }).click();
    await page.locator('.stage-hero').waitFor();
    assert.equal(await page.locator('.guest-greeting').count(), 0);
    for (const heading of ['Countdown', 'The Wedding', 'Venue', 'RSVP', 'Wedding Wishes', 'Wanna give us some gifts?']) {
      assert.equal(await page.getByRole('heading', { name: heading }).count(), 1, `${label}: ${heading}`);
    }
    assert.equal(await page.locator('.countdown-unit').count(), 4);
    assert.equal(await page.getByText('Semoga bahagia selalu.').count(), 1);
    assert.equal(await page.locator('.event-section a[href*="calendar.google.com"]').count(), 0);
    assert.equal(await page.locator('.venue-section a[href*="maps"]').count(), 0);
    await page.getByLabel('Nama lengkap').fill('Ade Fitriyani');
    await page.getByLabel('Ucapan untuk Rizal & Dewi').fill('Selamat menempuh hidup baru.');
    await page.getByRole('button', { name: 'Kirim RSVP' }).click();
    await page.getByText('Terima kasih. Konfirmasi dan ucapan Anda telah tersimpan.').waitFor();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${label}: horizontal overflow`);
    assert.deepEqual(errors, [], `${label}: runtime errors`);
    if (label === 'mobile') {
      const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      assert.deepEqual(audit.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) })), [], 'accessibility audit');
      await page.screenshot({ path: 'artifacts/full-review/mobile-full.png', fullPage: true });
    }
    console.log(`${label}: PASS`);
    await page.close();
    await context.close();
  }
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(1500);
  await page.getByRole('button', { name: 'BUKA UNDANGAN', exact: true }).click();
  await page.getByText('RSVP belum tersedia. Hubungkan Google Sheets sebelum membagikan undangan.').waitFor();
  assert.equal(await page.getByRole('button', { name: 'Kirim RSVP' }).isDisabled(), true);
  console.log('unconfigured RSVP: PASS');
  await page.close();
} finally { await browser.close(); }
