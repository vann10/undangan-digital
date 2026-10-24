import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const base=process.env.CINEMATIC_URL||'http://127.0.0.1:3012';
const dir='artifacts/cinematic';await mkdir(dir,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const results={baseUrl:base,browser:await browser.version(),checks:[],errors:[],requests:[]};
const check=(name,details)=>results.checks.push({name,status:'PASS',details});
async function create(width,height,reducedMotion='no-preference',query='?debug=1'){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:2,reducedMotion});
  page.on('pageerror',e=>results.errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400 && r.url().startsWith(base))results.requests.push({status:r.status(),url:r.url()});});
  await page.goto(base+query,{waitUntil:'networkidle'});
  await page.waitForSelector('.cin-stage[data-ready="true"]',{timeout:45000});
  return page;
}
const seek=async(page,t)=>page.locator('input[aria-label="Waktu timeline"]').evaluate((e,t)=>{
  const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;setter.call(e,String(t));e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));
},t);
const geometry=page=>page.evaluate(()=>Object.fromEntries(['.cin-names','.cin-divider','.cin-landscape','.cin-photo-mask','.cin-date'].map(s=>{
  const r=document.querySelector(s).getBoundingClientRect();return[s,{x:r.x,y:r.y,width:r.width,height:r.height}];
})));
try{
  for(const [w,h] of [[360,640],[390,844],[430,932]]){
    const page=await create(w,h);
    await page.addStyleTag({content:'.cin-debug{visibility:hidden}'});
    assert(await page.getByRole('button',{name:'Buka Undangan',exact:true}).isEnabled());
    assert(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth));
    const button=await page.locator('.cin-open').boundingBox();assert(button.y+button.height<h);
    const initial=await geometry(page);
    await page.evaluate(()=>{window.__sharedNodes=[document.querySelector('.cin-names'),document.querySelector('.cin-divider'),document.querySelector('.cin-landscape'),document.querySelector('audio')];});
    await page.screenshot({path:`${dir}/opening-${w}.png`});
    await page.getByRole('button',{name:'Buka Undangan',exact:true}).click();
    await page.waitForTimeout(550);
    await page.evaluate(()=>window.__weddingTransition.timeline.pause());
    const paused=await page.evaluate(()=>({time:window.__weddingTransition.timeline.time(),canvas:document.querySelector('canvas').toDataURL()}));
    await page.waitForTimeout(250);
    const after=await page.evaluate(()=>({time:window.__weddingTransition.timeline.time(),canvas:document.querySelector('canvas').toDataURL()}));
    assert.equal(paused.time,after.time);assert.equal(paused.canvas,after.canvas);
    await page.evaluate(()=>window.__weddingTransition.timeline.resume());
    await page.waitForSelector('.cin-ended');
    assert.equal(await page.evaluate(()=>document.activeElement?.id),'hero-heading');
    assert(await page.evaluate(()=>window.__sharedNodes.every((node,i)=>node===document.querySelector(['.cin-names','.cin-divider','.cin-landscape','audio'][i]))));
    assert.equal(await page.locator('.cin-date').innerText(),'28\nNovember\n2026');
    assert(await page.locator('.cin-date-word').evaluateAll(elements=>elements.every(e=>Math.abs(e.getBoundingClientRect().top-e.parentElement.getBoundingClientRect().top)<1)));
    assert.equal(await page.evaluate(()=>getComputedStyle(document.body).overflow),'visible');
    const final=await geometry(page);assert(final['.cin-names'].y>initial['.cin-names'].y);
    await page.screenshot({path:`${dir}/hero-${w}.png`});
    const staticPage=await create(w,h,'no-preference','?view=hero');
    await staticPage.waitForSelector('.cin-ended');
    const staticGeometry=await geometry(staticPage);
    for(const s of Object.keys(final))for(const prop of Object.keys(final[s]))assert(Math.abs(final[s][prop]-staticGeometry[s][prop])<1,`${s} ${prop}: static layout mismatch`);
    await staticPage.close();
    // Use the real slider, including a backwards seek after completion.
    await page.addStyleTag({content:'.cin-debug{visibility:visible}'});
    await seek(page,1.75);
    assert(Math.abs(await page.evaluate(()=>window.__weddingTransition.timeline.time())-1.75)<.02);
    await page.addStyleTag({content:'.cin-debug{visibility:hidden}'});
    await page.screenshot({path:`${dir}/transition-${w}.png`});
    await seek(page,0);
    const reset=await geometry(page);assert(Math.abs(reset['.cin-names'].y-initial['.cin-names'].y)<1);
    check(`${w}×${h}`,{decoded:true,sharedNodes:true,pauseCanvas:true,seekBackwards:true,staticHeroMatch:true,date:'28 November 2026'});
    await page.close();
  }
  const reduced=await create(390,844,'reduce');
  assert.equal(await reduced.evaluate(()=>window.__weddingTransition.timeline.duration()),.6);
  await reduced.getByRole('button',{name:'Buka Undangan',exact:true}).click();
  await reduced.waitForSelector('.cin-ended');
  assert.equal(await reduced.evaluate(()=>document.activeElement?.id),'hero-heading');
  assert.equal(await reduced.locator('canvas').evaluate(e=>getComputedStyle(e).visibility),'hidden');
  check('Reduced motion',{duration:.6,focusTransferred:true,particlesHidden:true});await reduced.close();
  const desktop=await create(1440,1000);
  const frame=await desktop.locator('.cin-stage').boundingBox();assert.equal(frame.width,430);assert.equal(frame.x,505);
  check('Centered desktop frame',{width:frame.width,x:frame.x});await desktop.close();
  const failure=await browser.newPage({viewport:{width:390,height:844}});
  await failure.route('**/transition/monogram*',r=>r.abort());
  await failure.goto(base);await failure.getByRole('button',{name:'Coba lagi',exact:true}).waitFor();
  assert(await failure.locator('.cin-open').isDisabled());
  await failure.unroute('**/transition/monogram*');
  await failure.getByRole('button',{name:'Coba lagi',exact:true}).click();
  await failure.waitForSelector('.cin-stage[data-ready="true"]');
  check('Decode failure and recovery',{buttonLocked:true,retrySucceeded:true});await failure.close();
  assert.equal(results.errors.length,0,JSON.stringify(results.errors));
  assert.equal(results.requests.length,0,JSON.stringify(results.requests));
}finally{await writeFile(`${dir}/verification.json`,JSON.stringify(results,null,2));await browser.close();}
console.log(JSON.stringify(results,null,2));
