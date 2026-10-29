import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const baseUrl = process.argv[2] || 'http://127.0.0.1:3030';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
await mkdir('artifacts/event-types', { recursive: true });
try {
  for (const type of ['pria', 'wanita', 'legacy']) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    let release;
    const ready = new Promise(resolve => { release = resolve; });
    await page.route('**/api/invitation', async route => {
      await ready;
      await route.fulfill({ json: { name: 'Tamu Pengujian', ...(type === 'legacy' ? {} : { eventType: type }), attendance: null, guestCount: null } });
    });
    await page.route('**/api/wishes', route => route.fulfill({ json: { wishes: [] } }));
    let rsvp;
    await page.route('**/api/rsvp', route => {
      rsvp = route.request().postDataJSON();
      return route.fulfill({ json: { ok: true, attendance: 'attending', guestCount: 2 } });
    });
    await page.goto(`${baseUrl}/invite/1-0042`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.querySelector('.cin-date')?.getAttribute('aria-label')?.includes('Memuat tanggal'));
    assert.equal(await page.locator('.event-actions a').count(), 0, 'no wrong calendar while identity loads');
    assert.equal(await page.locator('.venue-map').count(), 0, 'no wrong map while identity loads');
    release();
    await page.locator('.cin-guest p').filter({ hasText: 'Tamu Pengujian' }).waitFor({ timeout: 60000 });
    await page.getByRole('button', { name: 'Buka Undangan', exact: true }).click({ timeout: 60000 });
    await page.locator('.stage-hero').waitFor();
    const schedule = (await page.locator('.wedding-schedule').allTextContents()).join('\n');
    assert.equal(await page.locator('.person-profile h3').first().textContent(), 'Rizal Nur Ikhsani');
    assert.match(await page.locator('.wedding-family').last().textContent(), /Muhammad Bahrodin/);
    if (type === 'wanita') {
      assert.match(schedule, /Jumat, 20 November 2026/);
      assert.match(schedule, /Akad Nikah/);
      assert.match(schedule, /08.00 WIB s\/d Selesai/);
      assert.match(schedule, /Resepsi/);
      assert.match(schedule, /14.00 WIB s\/d Selesai/);
      assert.match(schedule, /Setail, Genteng, Banyuwangi/);
      assert.match(schedule, /Kediaman mempelai wanita/);
      assert.doesNotMatch(schedule, /28 November|Manyar/);
      assert.equal(await page.locator('.event-actions a').count(), 0);
      assert.match(await page.locator('.venue-map').getAttribute('src'), /-8.3622471%2C114.1318747/);
      assert.equal(await page.locator('.wedding-schedule .address-link').first().getAttribute('href'), 'https://maps.app.goo.gl/z6gegTTCZxpLcWF9A?g_st=ic');
      assert.notEqual(await page.locator('.countdown-number').first().getAttribute('data-value'), '--');
      assert.equal(await page.locator('.cin-date').getAttribute('aria-label'), '20 November 2026');
      assert.match(await page.locator('.countdown-grid').getAttribute('aria-label'), /20 November 2026 pukul 08.00 WIB/);
    } else {
      assert.match(schedule, /Sabtu, 28 November 2026/);
      assert.match(schedule, /10.00–13.00 WIB/);
      assert.match(schedule, /Manyar/);
      const calendar = new URL(await page.locator('.event-actions a').getAttribute('href'));
      assert.equal(calendar.searchParams.get('dates'), '20261128T030000Z/20261128T060000Z');
      assert.match(await page.locator('.venue-map').getAttribute('src'), /-7.42037/);
      assert.notEqual(await page.locator('.countdown-number').first().getAttribute('data-value'), '--');
      assert.equal((await page.locator('.cin-date').textContent()).replaceAll(' ', ''), '28November2026');
    }
    await page.locator('.event-section').screenshot({ path: `artifacts/event-types/${type}.png` });
    await page.getByLabel('Jumlah tamu yang hadir (termasuk Anda)').fill('2');
    await page.getByRole('button', { name: 'Kirim RSVP', exact: true }).click();
    await page.getByText('Terima kasih. Konfirmasi kehadiran Anda telah tersimpan dan bersifat final.').waitFor();
    assert.deepEqual(rsvp, { invitationId: '1', invitationToken: '0042', attendance: 'attending', guestCount: 2 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    assert.deepEqual(errors, []);
    await context.close();
    console.log(`Invitation event ${type}: PASS (loading, hero, schedule, map, calendar, countdown, RSVP)`);
  }
  for (const type of ['pria', 'wanita']) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    let guestLookups = 0;
    await page.route('**/api/invitation', route => { guestLookups++; return route.abort(); });
    await page.route('**/api/wishes', route => route.fulfill({ json: { wishes: [] } }));
    const response = await page.goto(`${baseUrl}/preview/${type}`, { waitUntil: 'domcontentloaded' });
    assert.equal(response.status(), 200);
    await page.getByRole('button', { name: 'Buka Undangan', exact: true }).click({ timeout: 60000 });
    await page.locator('.stage-hero').waitFor();
    assert.equal(await page.locator('.cin-date').getAttribute('aria-label'), type === 'pria' ? '28 November 2026' : '20 November 2026');
    assert.equal(guestLookups, 0);
    assert.equal(await page.getByRole('button', { name: 'Kirim RSVP', exact: true }).isDisabled(), true);
    assert.equal(await page.getByRole('button', { name: 'Kirim ucapan', exact: true }).isDisabled(), true);
    await page.close();
    console.log(`Manual preview ${type}: PASS (no guest lookup, correct date, writes disabled)`);
  }
} finally { await browser.close(); }
