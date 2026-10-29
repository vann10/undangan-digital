import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';

const baseUrl = process.argv[2] || 'http://127.0.0.1:3016';
const browser = await chromium.launch({channel:'chrome',headless:true});
const assets = new Set();
const failures = [];
try {
  for (const [route,width,height] of [['/preview/pria',390,844],['/preview/wanita',1440,1000]]) {
    const page = await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
    await page.route('**/api/wishes', r=>r.fulfill({json:{wishes:[]}}));
    page.on('response', response=>{if(response.status()>=400 && /\/(artwork|transition|chapter-art|audio)\//.test(response.url())) failures.push(response.url()+': '+response.status());});
    await page.goto(baseUrl+route,{waitUntil:'domcontentloaded'});
    await page.getByRole('button',{name:'Buka Undangan',exact:true}).click({timeout:60000});
    await page.locator('.stage-hero').waitFor({timeout:60000});
    const urls = await page.evaluate(()=>[
      ...Array.from(document.images, image=>image.src),
      ...Array.from(document.querySelectorAll('source[srcset],img[srcset]')).flatMap(source=>(source.getAttribute('srcset')||'').split(',').map(value=>value.trim().split(/\s/)[0])),
    ]);
    for(const url of urls) if(url && !url.startsWith('data:')) assets.add(new URL(url,page.url()).href);
    // Force img fallbacks, independent of the browser selecting a picture source.
    await page.evaluate(async()=>{
      document.querySelectorAll('source').forEach(source=>source.removeAttribute('srcset'));
      await Promise.all(Array.from(document.images, async image=>{image.loading='eager';await image.decode();}));
    });
    await page.close();
  }
  const context = await browser.newContext();
  for (const url of assets) {
    const response = await context.request.get(url);
    assert.equal(response.status(),200,url);
  }
  assert.deepEqual(failures,[]);
  console.log(`PASS: ${assets.size} image URLs (including dynamic names, 1x/2x variants and img fallbacks), two event previews, mobile and desktop, no asset HTTP errors.`);
} finally {await browser.close();}
