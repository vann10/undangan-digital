import { chromium } from '@playwright/test';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage();
  page.on('pageerror', error => console.log('runtime:', error.message));
  page.on('requestfailed', request => console.log('failed:', new URL(request.url()).pathname, request.failure()?.errorText));
  page.on('response', response => { if (response.status() >= 400) console.log('http:', response.status(), new URL(response.url()).pathname); });
  await page.goto(process.argv[2] || 'http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(8000);
  console.log(JSON.stringify(await page.evaluate(() => ({
    stage: document.querySelector('.cin-stage')?.getAttribute('data-ready'),
    progress: document.querySelector('.loading-progress')?.getAttribute('aria-valuenow'),
    loading: document.querySelector('.loading-screen') && getComputedStyle(document.querySelector('.loading-screen')).opacity,
    error: document.querySelector('.loading-status')?.textContent,
    fonts: document.fonts.status,
    incomplete: [...document.querySelectorAll('.cin-stage img')].filter(image => !image.complete || !image.naturalWidth).map(image => new URL(image.currentSrc || image.src).pathname),
  })), null, 2));
} finally { await browser.close(); }
