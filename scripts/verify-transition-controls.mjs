import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
  const page=await browser.newPage({viewport:{width:390,height:844}});
  page.setDefaultTimeout(15000);
  await page.goto('http://127.0.0.1:3000/?debug=1',{waitUntil:'networkidle'});
  await page.waitForSelector('.cin-stage[data-ready="true"]');
  await page.addStyleTag({content:'.cin-debug{visibility:hidden}'});
  await page.getByRole('button',{name:'Buka Undangan',exact:true}).click();
  await page.waitForTimeout(650);
  const before=await page.evaluate(()=>{
    const tl=window.__weddingTransition.timeline;tl.pause();
    return {time:tl.time(),pixels:document.querySelector('.cin-particles').toDataURL()};
  });
  await page.waitForTimeout(250);
  assert.deepEqual(await page.evaluate(()=>({time:window.__weddingTransition.timeline.time(),pixels:document.querySelector('.cin-particles').toDataURL()})),before);
  await page.evaluate(()=>window.__weddingTransition.timeline.resume());
  await page.waitForSelector('.cin-ended');
  await page.addStyleTag({content:'.cin-debug{visibility:visible}'});
  const scrub=async value=>page.getByRole('slider',{name:'Waktu timeline'}).evaluate((el,value)=>{
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,String(value));
    el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));
  },value);
  await scrub(1.75);
  assert.equal(await page.evaluate(()=>window.__weddingTransition.timeline.time()),1.75);
  assert.equal(await page.locator('.scroll-story').getAttribute('inert'),'');
  await scrub(3.8);
  assert.equal(await page.evaluate(()=>window.__weddingTransition.idle.paused()),true,'Scrub must not start idle');
  await scrub(0);
  assert.equal(await page.locator('.cin-page-bridge').evaluate(el=>getComputedStyle(el).opacity),'1');
  assert.equal(await page.locator('.cin-names').evaluate(el=>getComputedStyle(el).color),'rgb(23, 74, 74)');
  console.log('PASS: pause freezes particles, resume completes, scrub backwards restores opening, paused endpoint keeps idle paused.');
} finally {await browser.close();}
