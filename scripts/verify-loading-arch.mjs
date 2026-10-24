import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
const base=process.env.CINEMATIC_URL||'http://127.0.0.1:3000';
const results=[];const errors=[];
await mkdir('artifacts/loading-arch',{recursive:true});
try{
  for(const [w,h] of [[360,640],[390,844],[430,932]]){
    const page=await browser.newPage({viewport:{width:w,height:h},deviceScaleFactor:2});
    page.on('pageerror',e=>errors.push(e.message));
    let release;const gate=new Promise(r=>release=r);
    await page.route('**/transition/monogram*.webp',async route=>{await gate;await route.continue();});
    await page.goto(base,{waitUntil:'domcontentloaded'});
    await page.locator('.loading-screen:not(.loading-screen-ready)').waitFor();
    assert(await page.locator('.cin-stage').getAttribute('inert')!==null);
    if(w===390)await page.screenshot({path:'artifacts/loading-arch/loading.png'});
    release();await page.waitForSelector('.cin-stage[data-ready="true"]',{timeout:45000});
    await page.locator('.loading-screen').waitFor({state:'hidden'});
    assert.equal(await page.getByRole('button',{name:/Jeda animasi/}).count(),0);
    const open=page.getByRole('button',{name:'Buka Undangan',exact:true});assert(await open.isEnabled());
    await open.click();await page.waitForSelector('.cin-ended');
    assert.equal(await page.getByRole('button',{name:/Jeda animasi/}).count(),0);
    const mask=await page.locator('.cin-photo-mask').evaluate(el=>getComputedStyle(el).clipPath);
    assert(mask.includes('url('));
    const paths=await page.locator('.cin-portrait svg path').evaluateAll(ps=>ps.map(p=>p.getAttribute('d')));
    assert.equal(paths[1],paths[0]);
    assert(paths[0].endsWith(' Z'));
    assert.equal(await page.locator('.scroll-story').evaluate(el=>getComputedStyle(el).overflowY),'visible');
    assert.equal(await page.locator('.cin-hero-botanicals').evaluate(el=>getComputedStyle(el).zIndex),'24');
    assert(Number(await page.locator('.cin-sky').evaluate(el=>getComputedStyle(el).opacity))>0);
    if(w===390){
      await page.screenshot({path:'artifacts/loading-arch/hero.png'});
      await page.locator('.couple-page-header').scrollIntoViewIfNeeded();await page.waitForTimeout(1600);
      await page.screenshot({path:'artifacts/loading-arch/join.png'});
    }
    results.push({viewport:`${w}x${h}`,loadingWaitsForDecode:true,noPauseControls:true,sharedArchGeometry:true,botanicalsAbove:true});
    await page.close();
  }
  assert.deepEqual(errors,[]);
}finally{await browser.close();await writeFile('artifacts/loading-arch/results.json',JSON.stringify({results,errors},null,2));}
console.log(JSON.stringify({results,errors},null,2));
