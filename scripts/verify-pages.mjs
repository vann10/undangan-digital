import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const directory = 'artifacts/pages-review';
const baseUrl = process.argv[2] ?? 'http://127.0.0.1:3006';
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const report = { browser: await browser.version(), checks: [], errors: [] };
const pass = (name, details) => report.checks.push({ name, status: 'PASS', details });

try {
  for (const [label, width, height] of [['small', 320, 568], ['mobile', 390, 844], ['wide', 430, 932]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    page.on('pageerror', error => report.errors.push(error.message));
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('.cover').isVisible(), true);
    assert.equal(await page.locator('.opened-pages').isVisible(), false);
    await page.getByRole('button', { name: 'BUKA UNDANGAN', exact: true }).click();
    await page.locator('.stage-opening').waitFor({ state: 'visible' });
    assert.equal(await page.locator('.opening-sweep').count(), 1);
    assert.equal(await page.locator('.cover').isVisible(), true);
    await page.locator('#invitation-hero').waitFor({ state: 'visible' });
    if (label === 'mobile') {
      await page.waitForTimeout(200);
      const earlyInset = await page.locator('.cover').evaluate(el => getComputedStyle(el).clipPath);
      assert.notEqual(earlyInset, 'inset(0px)', 'Cover reveal must advance during the transition');
      await page.screenshot({ path: `${directory}/mobile-reveal-early.png` });
      await page.waitForTimeout(300);
      await page.screenshot({ path: `${directory}/mobile-reveal-mid.png` });
      await page.waitForTimeout(300);
      await page.screenshot({ path: `${directory}/mobile-reveal-late.png` });
    }
    await page.locator('.stage-hero').waitFor({ state: 'visible' });
    assert.equal(await page.locator('.opening-sweep').count(), 0);
    assert.equal(await page.locator('.hero-layout').evaluate(el => getComputedStyle(el).animationName), 'none', 'Hero must remain stable after the reveal');
    await page.waitForTimeout(250);
    assert.equal(await page.evaluate(() => window.scrollY), 0);
    assert.equal(await page.locator('#hero-heading').evaluate(el => el === document.activeElement), true);
    assert.equal(await page.locator('.portrait-ornament').getAttribute('src'), '/artwork/botanical_full_detail_hybrid.webp');
    assert.deepEqual(await page.locator('.profile-floral img').evaluateAll(images => images.map(image => image.getAttribute('src'))), ['/artwork/rd-peony-accent-v1.webp', '/artwork/botanical_ornament.svg']);
    assert.equal(await page.locator('.portrait-ornament').evaluate(el => getComputedStyle(el).animationName), 'none');
    assert.equal(await page.locator('.page-bridge-garland').getAttribute('src'), '/artwork/page-transition-garland.png');
    assert.equal(await page.locator('.page-bridge-spray').getAttribute('src'), '/artwork/botanical-spray-review.png');
    assert.equal(await page.locator('.page-bridge-spray').evaluate(el => getComputedStyle(el).animationName), 'bridge-botanical-rise');
    const floralStart = await page.locator('.page-bridge-spray').evaluate(el => getComputedStyle(el).translate);
    await page.waitForTimeout(380);
    const floralEnd = await page.locator('.page-bridge-spray').evaluate(el => getComputedStyle(el).translate);
    assert.notEqual(floralStart, floralEnd, 'Page bridge botanical must rise and fall');
    const floralBoxes = await page.locator('.profile-floral').evaluateAll(images => images.map(image => { const r = image.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; }));
    const portraitBoxes = await page.locator('.person-portrait').evaluateAll(images => images.map(image => { const r = image.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; }));
    const page2Box = await page.locator('.couple-page').boundingBox();
    assert(floralBoxes[0].x < portraitBoxes[0].x + portraitBoxes[0].width / 2 && floralBoxes[0].y > portraitBoxes[0].y + portraitBoxes[0].height / 2, 'Peony must sit at lower-left of bride frame');
    assert(floralBoxes[1].x + floralBoxes[1].width / 2 > portraitBoxes[1].x + portraitBoxes[1].width / 2 && floralBoxes[1].y + floralBoxes[1].height / 2 > portraitBoxes[1].y + portraitBoxes[1].height / 2, 'SVG must sit at lower-right of groom frame');
    assert.equal(await page.locator('.profile-floral-groom').evaluate(el => getComputedStyle(el).width), '130px');
    assert((await page.locator('.couple-page-background').evaluate(el => getComputedStyle(el, '::before').backgroundImage)).includes('page-two-botanical-background.png'));
    assert.deepEqual(await page.locator('.profile-floral').evaluateAll(ornaments => ornaments.map(ornament => [getComputedStyle(ornament).animationName, getComputedStyle(ornament.querySelector('img')).animationName])), [['none', 'none'], ['none', 'none']]);
    assert(page2Box.height < 1650, 'Page 2 must not have excessive empty height');
    const rotation = await page.locator('.profile-floral-groom').evaluate(el => new DOMMatrix(getComputedStyle(el).transform));
    assert(rotation.a < -0.9 && rotation.b < -0.2, 'Bottom ornament must rotate about 200 degrees clockwise');
    assert.equal(await page.locator('.wedding-date').textContent(), '14 November 2026');
    const layout = await page.evaluate(() => {
      const rect = selector => { const { top, bottom } = document.querySelector(selector).getBoundingClientRect(); return { top, bottom }; };
      return { photo: rect('.couple-portrait'), names: rect('#hero-heading'), date: rect('.wedding-date'), hero: rect('.hero'), page2: rect('.couple-page'), width: document.documentElement.scrollWidth, imageLoads: [...document.images].filter(img => img.loading !== 'lazy').every(img => img.complete && img.naturalWidth > 0), heroOpacity: getComputedStyle(document.querySelector('.hero-layout')).opacity };
    });
    assert(layout.photo.bottom <= layout.names.top && layout.names.bottom <= layout.date.top);
    assert.equal(layout.heroOpacity, '1', `${label}: hero must be fully visible after reveal`);
    assert(layout.width <= width, `${label}: horizontal overflow`);
    assert(layout.imageLoads, `${label}: image loading`);
    assert(layout.hero.bottom <= layout.page2.top + 1);
    assert.deepEqual(await page.locator('.person-profile h3').allTextContents(), ['Dewi', 'Rizal']);
    assert.equal(await page.locator('.person-profile').count(), 2);
    assert.equal(await page.locator('.person-profile a').count(), 0);
    await page.locator('#hero-heading').evaluate(el => el.blur());
    await page.locator('.hero').screenshot({ path: `${directory}/${label}-hero.png` });
    await page.locator('.couple-page').screenshot({ path: `${directory}/${label}-page2.png` });
    if (label === 'mobile') {
      await page.evaluate(() => window.scrollTo(0, document.querySelector('.hero').getBoundingClientRect().height - window.innerHeight / 2));
      await page.screenshot({ path: `${directory}/mobile-page-boundary.png` });
    }
    pass(`${label} hero and profile page`, { width, height, layout, transition: 'opening-paper-reveal' });
    await page.close();
  }
  const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await reduced.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await reduced.waitForTimeout(1500);
  await reduced.getByRole('button', { name: 'BUKA UNDANGAN', exact: true }).click();
  assert.equal(await reduced.locator('.hero').isVisible(), true);
  assert.equal(await reduced.evaluate(() => document.getAnimations().length), 0);
  pass('reduced motion', { activeAnimations: 0 });
  await reduced.close();
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await desktop.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await desktop.waitForTimeout(1500);
  await desktop.getByRole('button', { name: 'BUKA UNDANGAN', exact: true }).click();
  const panel = await desktop.locator('main').boundingBox();
  assert.equal(panel.width, 430);
  assert.equal(panel.x, 1010);
  pass('desktop panel geometry', { width: panel.width, x: panel.x, screenshots: 'mobile only' });
  await desktop.close();
  assert.deepEqual(report.errors, []);
  pass('runtime errors', { errors: [] });
} catch (error) {
  report.checks.push({ name: 'verification interrupted', status: 'FAIL', details: String(error) });
  process.exitCode = 1;
} finally {
  await writeFile(`${directory}/browser-results.json`, JSON.stringify(report, null, 2));
  await browser.close();
  console.log(JSON.stringify(report, null, 2));
}
