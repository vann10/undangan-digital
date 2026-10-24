import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[];const errors=[];
const base=process.env.CINEMATIC_URL||'http://127.0.0.1:3015';
await mkdir('artifacts/scroll-story',{recursive:true});
try{
  for(const width of [360,390,430]){
    const page=await browser.newPage({viewport:{width,height:844},deviceScaleFactor:2});
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(base+'/?view=hero');
    await page.waitForSelector('.scroll-story');
    await page.waitForTimeout(200);
    const scenes=page.locator('[data-scroll-scene]');
    assert(await scenes.count()>18);
    for(const selector of ['.person-profile','.countdown-grid','.event-list','.venue-section','.gallery-grid','.gift-section','.closing-section']){
      await page.locator(selector).first().scrollIntoViewIfNeeded();
      await page.waitForTimeout(2100);
      assert.equal(await page.locator(selector).first().getAttribute('data-scroll-state'),'settled',selector);
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      if(width===390)await page.screenshot({path:`artifacts/scroll-story/${selector.slice(1)}.png`});
    }
    assert.equal(await page.getByRole('button',{name:/Jeda animasi/}).count(),0);
    await page.locator('.rsvp-form').first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(1400);
    assert.equal(await page.locator('.rsvp-form').first().evaluate(el=>getComputedStyle(el.querySelector('fieldset')).opacity),'1');
    assert(await page.locator('.cin-vine-segment img').evaluateAll(imgs=>imgs.every(img=>getComputedStyle(img).objectFit!=='fill')));
    const vineUrls=await page.locator('.cin-vine img').evaluateAll(imgs=>[...new Set(imgs.map(img=>img.currentSrc))]);
    assert.equal(vineUrls.length,1);
    results.push({width,scenes:await scenes.count(),settled:true,vineResources:vineUrls.length});
    await page.close();
  }
  const page=await browser.newPage({reducedMotion:'reduce'});
  await page.goto(base+'/?view=hero');await page.waitForSelector('.scroll-story');
  assert.equal(await page.locator('[data-scroll-scene]').count(),0);
  assert.equal(await page.locator('.person-portrait').first().evaluate(el=>getComputedStyle(el).opacity),'1');
  results.push({reducedMotion:'content visible, scroll animation disabled'});
  assert.deepEqual(errors,[]);
}finally{await browser.close();await writeFile('artifacts/scroll-story/results.json',JSON.stringify({results,errors},null,2));}
console.log(JSON.stringify({results,errors},null,2));
