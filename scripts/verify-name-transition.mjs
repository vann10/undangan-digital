import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const base = process.argv[2] || 'http://localhost:3000';
await mkdir('artifacts/name-transition', { recursive: true });
try {
  for (const reducedMotion of ['no-preference', 'reduce']) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion });
    await page.route('**/api/wishes**', route => route.fulfill({ json: { wishes: [] } }));
    await page.goto(`${base}/?debug=1`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.__weddingTransition && document.querySelector('.cin-stage')?.dataset.ready === 'true', null, { timeout: 60000 });
    await page.waitForFunction(() => getComputedStyle(document.querySelector('.loading-screen')).opacity === '0');
    const styles = await page.evaluate(motion => {
      const { timeline, config } = window.__weddingTransition;
      const name = document.querySelector('.cin-names');
      const kicker = document.querySelector('.cin-hero-kicker');
      const initial = getComputedStyle(name).filter;
      const middleTime = motion === 'reduce' ? timeline.duration() / 2 : config.at.shared + config.duration.shared * .45;
      const result = [];
      for (let replay = 0; replay < 2; replay++) {
        timeline.pause(0).time(middleTime, false);
        const middle = getComputedStyle(name).filter;
        const kickerMiddle = getComputedStyle(kicker).filter;
        const shadow = getComputedStyle(name).textShadow;
        timeline.progress(1, false).pause();
        result.push({ middle, kickerMiddle, shadow, final: getComputedStyle(name).filter, kickerFinal: getComputedStyle(kicker).filter });
      }
      return { initial, result };
    }, reducedMotion);
    assert.equal(styles.initial, 'none');
    for (const result of styles.result) {
      assert.equal(result.final, 'none');
      assert.equal(result.kickerFinal, 'none');
      assert.equal(result.kickerMiddle, result.middle);
      assert.equal(result.shadow, 'none');
      if (reducedMotion === 'reduce') assert.equal(result.middle, 'none');
      else assert.equal(result.middle, 'blur(3px)');
    }
    await page.screenshot({ path: `artifacts/name-transition/settled-${reducedMotion}.png` });
    console.log(`${reducedMotion}: ${JSON.stringify(styles)}`);
    await page.close();
  }
} finally { await browser.close(); }
