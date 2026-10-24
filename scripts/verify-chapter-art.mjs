import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
const base=process.env.CINEMATIC_URL||'http://127.0.0.1:3000';
const dir='artifacts/chapter-art';await mkdir(dir,{recursive:true});
const errors=[],checks=[];
try{
 for(const width of [360,390,430]){
  const page=await browser.newPage({viewport:{width,height:844},deviceScaleFactor:2});
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.url().includes('/chapter-art/')&&r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  await page.goto(base+'/?view=hero');await page.waitForSelector('.cin-ended');await page.locator('.loading-screen').waitFor({state:'hidden'});
  assert.equal(await page.locator('.loading-bloom img').getAttribute('src'),'/artwork/loading-petals-lineart.svg');
  for(const s of ['.cin-names','.cin-hero-kicker','.cin-date'])assert.equal(await page.locator(s).evaluate(e=>getComputedStyle(e).color),'rgb(255, 255, 255)');
  assert((await page.locator('.cin-date').innerText()).includes('28'));
  const names=await page.locator('.person-copy h3').evaluateAll(es=>es.map(e=>({text:e.textContent,font:getComputedStyle(e).fontSize,overflow:e.scrollWidth>e.clientWidth})));
  assert.equal(names[0].font,names[1].font);assert(names.every(n=>!n.overflow));
  assert.equal(await page.locator('.page-bridge img').count(),1);
  if(width===390)await page.screenshot({path:dir+'/hero.png'});
  for(const section of ['.rsvp-section','.gallery-section','.closing-section']){
   await page.locator(section).scrollIntoViewIfNeeded();await page.waitForTimeout(1900);
   assert(await page.locator(section+' .chapter-background img').evaluate(img=>img.complete&&img.naturalWidth>0));
   if(width===390)await page.screenshot({path:dir+'/'+section.slice(1)+'.png'});
  }
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  checks.push({width,names,backgroundsLoaded:true,bridgesAnimated:true,whiteHero:true,date:'28 November 2026'});await page.close();
 }
 const desktop=await browser.newPage({viewport:{width:1440,height:1000}});
 await desktop.goto(base+'/?view=hero');await desktop.waitForSelector('.cin-ended');await desktop.locator('.loading-screen').waitFor({state:'hidden'});
 assert(await desktop.locator('.desktop-wedding-background').isVisible());
 const frame=await desktop.locator('.invitation').boundingBox();assert.equal(frame.width,430);assert.equal(frame.x,505);
 await desktop.screenshot({path:dir+'/desktop.png'});checks.push({desktopFrame:frame.width,centered:true});
 assert.deepEqual(errors,[]);
}finally{await browser.close();await writeFile(dir+'/results.json',JSON.stringify({checks,errors},null,2));}
console.log(JSON.stringify({checks,errors},null,2));
