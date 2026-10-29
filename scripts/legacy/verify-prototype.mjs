import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const directory = 'artifacts/hero-morph';
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = { testedAt: new Date().toISOString(), browser: await browser.version(), checks: [], errors: [] };
const record = (name, details) => results.checks.push({ name, status: 'PASS', details });
try {
  for (const [name, width, height] of [['mobile',390,844],['small-mobile',320,568],['mobile-wide',430,932]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    page.on('pageerror', error => results.errors.push(error.message));
    await page.goto('http://127.0.0.1:3006', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    assert(await page.locator('img').evaluateAll(images => images.every(img => img.complete && img.naturalWidth > 0)), `${name}: decorative image load`);
    assert(await page.locator('img:not(.portrait-photo)').evaluateAll(images => images.every(img => img.alt === '')), `${name}: decorative alternatives`);
    assert(await page.locator('.portrait-photo').getAttribute('alt'), 'Meaningful photo has alternative text');
    const button = page.getByRole('button', { name: 'BUKA UNDANGAN', exact: true });
    const bounds = await button.boundingBox();
    assert.equal(await page.locator('.guest-greeting').textContent(), 'Yth. [nama tamu]');
    const greeting = await page.locator('.guest-greeting').boundingBox();
    assert(greeting.y + greeting.height <= bounds.y, 'Greeting above button');
    assert.equal(await page.locator('.cover-date').count(), 0);
    assert.equal(await page.locator('.guest-greeting').evaluate(el => getComputedStyle(el).backgroundColor), 'rgba(0, 0, 0, 0)');
    assert.equal(await page.locator('.cover-content .monogram img').getAttribute('src'), '/artwork/monogram_RD_exact_illustration.svg');
    await page.waitForTimeout(4100);
    const looping = await page.evaluate(() => document.getAnimations().filter(a => a.effect.getTiming().iterations === Infinity).length);
    assert(looping >= 12, 'Opening decorations loop continuously');
    const wing = page.locator('.butterfly-upper .wing-left');
    const firstWing = await wing.evaluate(el => getComputedStyle(el).transform);
    await page.waitForTimeout(220);
    assert.notEqual(await wing.evaluate(el => getComputedStyle(el).transform), firstWing);
    assert.equal(await wing.evaluate(el => getComputedStyle(el).animationDuration), '0.9s');
    await page.getByRole('button', { name: 'Jeda animasi', exact: true }).click();
    assert(await page.evaluate(() => document.getAnimations().every(a => a.playState === 'paused')));
    await page.getByRole('button', { name: 'Lanjutkan animasi', exact: true }).click();
    record(`${name} continuous motion and pause`, { looping, pauseAndResume: true });
    assert(bounds && bounds.y >= 0 && bounds.y + bounds.height <= height, `${name}: CTA must be visible`);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${name}: cover overflow`);
    assert.equal(await page.locator('#invitation-hero').isVisible(), false);
    await page.screenshot({ path: `${directory}/${name}-cover.png`, fullPage: true });
    if (name === 'mobile') {
      const style = await page.addStyleTag({ content: '.cover > * { visibility: hidden !important; }' });
      await page.screenshot({ path: `${directory}/texture-background.png`, fullPage: true });
      await style.evaluate(el => el.remove());
    }
    const resources = await page.evaluate(() => ({
      fontsLoaded: document.fonts.check('16px "DM Sans"') && document.fonts.check('16px "Cormorant Garamond"'),
      transferredBytes: performance.getEntriesByType('resource').reduce((sum, entry) => sum + entry.transferSize, 0),
      firstContentfulPaintMs: performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? null,
    }));
    assert.equal(resources.fontsLoaded, true);
    const start = Date.now();
    await button.click();
    await page.locator('#invitation-hero').waitFor({ state: 'visible' });
    if (name === 'mobile') { await page.waitForTimeout(200); await page.screenshot({ path: `${directory}/mobile-morph.png`, fullPage: true }); }
    await page.waitForFunction(() => !document.documentElement.classList.contains('morphing') && document.getAnimations().every(a => a.playState === 'finished'));
    assert.equal(await page.locator('.couple-portrait').count(), 1);
    const photoBox = await page.locator('.couple-portrait').boundingBox();
    const nameBox = await page.locator('#hero-heading').boundingBox();
    const dateBox = await page.locator('.wedding-date').boundingBox();
    assert(photoBox.y + photoBox.height <= nameBox.y && nameBox.y + nameBox.height <= dateBox.y, 'Photo > names > date hierarchy');
    const duration = Date.now() - start;
    assert.equal(await page.evaluate(() => window.scrollY), 0);
    assert.equal(await page.locator('.cover').count(), 0);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${name}: hero overflow`);
    assert.equal(await page.locator('#hero-heading').evaluate(el => el === document.activeElement), true);
    assert.equal(await page.locator('.wedding-date').textContent(), '14 November 2026');
    assert.equal(await page.locator('.art-date').count(), 0);
    assert.equal(await page.locator('.hero .vine-frame').count(), 0);
    await page.locator('#hero-heading').evaluate(el => el.blur());
    await page.screenshot({ path: `${directory}/${name}-hero.png`, fullPage: true });
    const scroll = await page.evaluate(() => {
      const overflows = document.documentElement.scrollHeight > innerHeight;
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
      return { overflows, scrollY: window.scrollY };
    });
    assert(!scroll.overflows || scroll.scrollY > 0, `${name}: scrolling must remain available`);
    record(`${name} layout and direct transition`, { width, height, button: bounds, measuredTransitionMs: duration, heroVisibleWithoutScroll: true, horizontalOverflow: false, scroll, resources });
    await page.close();
  }
  // Desktop geometry only; screenshots remain mobile-only per user preference.
  for (const width of [768, 1440]) {
    const pc = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const phone = await browser.newPage({ viewport: { width: 430, height: 900 }, reducedMotion: 'reduce' });
    await Promise.all([pc.goto('http://127.0.0.1:3006', { waitUntil: 'networkidle' }), phone.goto('http://127.0.0.1:3006', { waitUntil: 'networkidle' })]);
    const metrics = page => page.evaluate(() => ({ width: document.querySelector('main').getBoundingClientRect().width, x: document.querySelector('main').getBoundingClientRect().x, names: getComputedStyle(document.querySelector('.cover-names')).fontSize, columns: getComputedStyle(document.querySelector('.hero-layout')).gridTemplateColumns }));
    const desktop = await metrics(pc), mobile = await metrics(phone);
    assert.equal(desktop.width, 430); assert.equal(desktop.x, width - 430);
    assert.equal(desktop.names, mobile.names);
    assert(await pc.locator('.desktop-artwork').isVisible());
    assert.equal(await phone.locator('.desktop-artwork').isVisible(), false);
    for (const page of [pc, phone]) await page.getByRole('button', { name: 'BUKA UNDANGAN', exact: true }).click();
    for (const page of [pc, phone]) await page.locator('#invitation-hero').waitFor({ state: 'visible' });
    const heroMetric = page => page.locator('.hero-layout').evaluate(el => ({ columns: getComputedStyle(el).gridTemplateColumns, height: el.getBoundingClientRect().height }));
    assert.deepEqual(await heroMetric(pc), await heroMetric(phone));
    assert(await pc.evaluate(() => document.documentElement.scrollWidth <= innerWidth && scrollY === 0));
    record(`desktop ${width}: shared mobile layout`, { desktop, mobile, heroMatches: true, screenshots: 'not captured by request' });
    await pc.close(); await phone.close();
  }
  for (const key of ['Enter', 'Space']) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto('http://127.0.0.1:3006');
    await page.keyboard.press('Tab');
    assert.equal(await page.getByRole('button', { name: 'BUKA UNDANGAN', exact: true }).evaluate(el => el === document.activeElement), true);
    const focus = await page.locator('.open-button').evaluate(el => ({ style: getComputedStyle(el).outlineStyle, width: getComputedStyle(el).outlineWidth }));
    assert.equal(focus.style, 'solid');
    assert.equal(focus.width, '2px');
    if (key === 'Enter') await page.screenshot({ path: `${directory}/keyboard-focus.png`, fullPage: true });
    await page.keyboard.press(key);
    await page.locator('#invitation-hero').waitFor({ state: 'visible' });
    assert.equal(await page.locator('#hero-heading').evaluate(el => el === document.activeElement), true);
    record(`keyboard ${key}`, { visibleFocus: focus, focusTransferredToHero: true });
    await page.close();
  }
  const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await reduced.goto('http://127.0.0.1:3006');
  assert.equal(await reduced.evaluate(() => document.getAnimations().length), 0);
  const start = Date.now();
  await reduced.getByRole('button', { name: 'BUKA UNDANGAN', exact: true }).click();
  await reduced.locator('#invitation-hero').waitFor({ state: 'visible' });
  assert.equal(await reduced.evaluate(() => document.getAnimations().length), 0);
  record('reduced motion', { measuredHandoffMs: Date.now() - start, activeAnimations: 0, staticImageSelected: true });
  assert.equal(results.errors.length, 0);
  record('runtime page errors', { errors: results.errors });
} catch (error) {
  results.checks.push({ name: 'verification interrupted', status: 'FAIL', details: String(error) });
  process.exitCode = 1;
} finally {
  await writeFile(`${directory}/browser-results.json`, JSON.stringify(results, null, 2));
  await browser.close();
  console.log(JSON.stringify(results, null, 2));
}
