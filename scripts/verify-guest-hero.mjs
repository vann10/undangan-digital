import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const base = process.argv[2] || 'http://localhost:3000';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
await mkdir('artifacts/guest-hero-restored', { recursive: true });
async function newPage(width = 390, height = 844, reducedMotion = 'reduce') {
  const page = await browser.newPage({ viewport: { width, height }, reducedMotion });
  await page.route('**/api/wishes**', route => route.fulfill({ json: { wishes: [] } }));
  return page;
}
try {
  const slow = await newPage();
  let release;
  const held = new Promise(resolve => { release = resolve; });
  await slow.route('**/api/invitation', async route => {
    assert.deepEqual(route.request().postDataJSON(), { invitationId: '194', invitationToken: '0042' });
    await held;
    await route.fulfill({ json: { name: 'Tamu Pengujian', attendance: null, guestCount: null } });
  });
  await slow.goto(`${base}/invite/194-0042`);
  await slow.waitForFunction(() => document.querySelector('.loading-progress')?.getAttribute('aria-valuenow') === '95');
  assert.equal(await slow.locator('.loading-screen').isVisible(), true);
  assert.equal(await slow.locator('.cin-open').isDisabled(), true);
  assert.equal(await slow.locator('.cin-guest').textContent(), '');
  release();
  await slow.locator('.cin-stage[data-ready="true"]').waitFor();
  assert.equal(await slow.locator('.cin-guest').textContent(), 'Yth.Tamu Pengujian');
  await slow.locator('.cin-open').click();
  await slow.locator('.cin-ended').waitFor();
  await slow.close();
  console.log('Slow short link: waits for the verified guest name.');

  const recovery = await newPage();
  let fail = true, requests = 0;
  await recovery.route('**/api/invitation', route => {
    requests++;
    return route.fulfill(fail ? { status: 503, json: { error: 'Gangguan sementara.' } } : { json: { name: 'Tamu Pulih', attendance: null } });
  });
  await recovery.goto(`${base}/invite/1#${'a'.repeat(43)}`);
  await recovery.locator('.cin-guest-error').waitFor();
  assert(requests >= 3);
  assert.equal(await recovery.locator('.cin-guest').textContent(), '');
  assert.equal(await recovery.locator('.cin-open').isDisabled(), true);
  fail = false;
  await recovery.locator('.cin-guest-error button').click();
  await recovery.locator('.cin-guest p').filter({ hasText: 'Tamu Pulih' }).waitFor();
  await recovery.locator('.cin-stage[data-ready="true"]').waitFor();
  assert.equal(await recovery.locator('.cin-open').isEnabled(), true);
  await recovery.close();
  console.log('Legacy hash link: automatic retries and manual recovery pass.');

  for (const [width, height, motion] of [[360, 640, 'reduce'], [390, 844, 'no-preference'], [1440, 1000, 'reduce']]) {
    const page = await newPage(width, height, motion);
    await page.goto(`${base}/?view=hero`);
    await page.locator('.cin-ended').waitFor({ timeout: 60000 });
    await page.waitForFunction(() => getComputedStyle(document.querySelector('.loading-screen')).opacity === '0');
    const styles = await page.evaluate(() => {
      const names = getComputedStyle(document.querySelector('.cin-names'));
      const date = getComputedStyle(document.querySelector('.cin-date'));
      const kicker = getComputedStyle(document.querySelector('.cin-hero-kicker'));
      const haze = getComputedStyle(document.querySelector('.cin-hero-haze'));
      return { color: names.color, nameShadow: names.textShadow, dateShadow: date.textShadow, kickerShadow: kicker.textShadow, haze: haze.opacity };
    });
    assert.deepEqual(styles, { color: 'rgb(23, 74, 74)', nameShadow: 'none', dateShadow: 'none', kickerShadow: 'none', haze: '1' });
    assert.equal(await page.locator('.cin-guest p').textContent(), 'Tamu Undangan');
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({ path: `artifacts/guest-hero-restored/hero-${width}.png` });
    await page.close();
    console.log(`${width}px ${motion}: emerald Hero, ivory haze, no text highlights pass.`);
  }
} finally { await browser.close(); }
