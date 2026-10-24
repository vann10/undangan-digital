import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const base=process.env.CINEMATIC_URL||'http://127.0.0.1:3000';
const dir='artifacts/cinematic/settle';
await mkdir(dir,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[];
const errors=[];
try {
  for(const [width,height] of [[360,640],[390,844],[430,932],[1440,1000]]) {
    const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:2});
    page.setDefaultTimeout(20000);
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(`${base}/?debug=1`,{waitUntil:'networkidle'});
    await page.waitForSelector('.cin-stage[data-ready="true"]',{timeout:45000});
    if(width<=430)assert.equal(await page.locator('.cin-stage').evaluate(el=>el.clientWidth),width,'Scrollbar gutter narrows mobile frame');
    await page.addStyleTag({content:'.cin-debug{visibility:hidden}'});
    await page.evaluate(()=>{
      window.__storyBefore=document.querySelector('.scroll-story');
      window.__tail=[];
      const start=performance.now();
      const sample=()=>{
        const {timeline}=window.__weddingTransition;
        const selectors=['.cin-stage','.cin-names','.cin-divider','.cin-landscape','.cin-landscape-mid','.cin-landscape-lake','.cin-branch-left','.cin-fog','.cin-page-bridge'];
        const state=Object.fromEntries(selectors.map(s=>{
          const el=document.querySelector(s), r=el.getBoundingClientRect(), style=getComputedStyle(el);
          return [s,{x:r.x,y:r.y,width:r.width,height:r.height,opacity:Number(style.opacity)}];
        }));
        const amp=getComputedStyle(document.querySelector('.cin-ampersand'));
        window.__tail.push({clock:performance.now()-start,time:timeline.time(),ended:document.querySelector('.cin-stage').classList.contains('cin-ended'),state,amp:amp.backgroundImage,shadow:getComputedStyle(document.querySelector('.cin-names')).textShadow});
        if(performance.now()-start<5500)requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
    });
    await page.getByRole('button',{name:'Buka Undangan',exact:true}).click();
    await page.waitForSelector('.cin-ended');
    await page.waitForTimeout(900);
    const frames=await page.evaluate(()=>window.__tail);
    const settled=frames.filter(f=>f.time>=3.25);
    assert(settled.length>5,'Missing final frames');
    const first=settled[0];
    for(const frame of settled)for(const selector of ['.cin-stage','.cin-names','.cin-divider','.cin-landscape','.cin-landscape-mid','.cin-landscape-lake','.cin-page-bridge']) {
      for(const key of ['x','y','width','height'])assert(Math.abs(frame.state[selector][key]-first.state[selector][key])<.12,`${width}: late drift ${selector}.${key}`);
      assert.equal(frame.amp,first.amp,'Ampersand changes at completion');
      assert.equal(frame.shadow,first.shadow,'Text shadow changes at completion');
    }
    const endIndex=frames.findIndex(f=>f.ended);
    assert(endIndex>0);
    for(const selector of ['.cin-branch-left','.cin-fog'])for(const key of ['x','y','width','height']){
      assert(Math.abs(frames[endIndex].state[selector][key]-frames[endIndex-1].state[selector][key])<.25,`${selector}: idle handoff jumps`);
    }
    assert.equal(await page.evaluate(()=>document.querySelector('.scroll-story')===window.__storyBefore),true,'Story remounted at completion');
    assert.equal(await page.evaluate(()=>document.activeElement.id),'hero-heading');
    assert.equal(await page.locator('.scroll-story').getAttribute('inert'),null);
    await page.screenshot({path:`${dir}/hero-${width}.png`});
    // Replay must restore the same opening and reach the same final layout.
    await page.addStyleTag({content:'.cin-debug{visibility:visible}'});
    await page.getByRole('button',{name:'Ulangi',exact:true}).click();
    await page.waitForSelector('.cin-stage:not(.cin-ended)');
    await page.waitForSelector('.cin-ended');
    const replay=await page.locator('.cin-names').boundingBox();
    assert(Math.abs(replay.y-first.state['.cin-names'].y)<.12);
    const cadence=frames.filter(f=>f.time>=.1&&f.time<3.8);
    const gaps=cadence.slice(1).map((f,i)=>f.clock-cadence[i].clock).sort((a,b)=>a-b);
    results.push({width,height,settledFrames:settled.length,tailDriftBelowPx:.12,idleHandoffBelowPx:.25,storyReused:true,replay:true,frameP95Ms:gaps[Math.floor(gaps.length*.95)]});
    await writeFile(`${dir}/frames-${width}.json`,JSON.stringify(frames));
    await page.close();
  }
  const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  reduced.setDefaultTimeout(20000);
  await reduced.goto(`${base}/?debug=1`,{waitUntil:'networkidle'});
  await reduced.waitForSelector('.cin-stage[data-ready="true"]');
  assert.equal(await reduced.evaluate(()=>window.__weddingTransition.timeline.duration()),.6);
  await reduced.getByRole('button',{name:'Buka Undangan',exact:true}).click();
  await reduced.waitForSelector('.cin-ended');
  assert.equal(await reduced.locator('.cin-page-bridge').evaluate(el=>getComputedStyle(el).opacity),'1');
  assert.equal(await reduced.evaluate(()=>window.__weddingTransition.idle.paused()),true);
  results.push({reducedMotion:true,duration:.6});
  assert.deepEqual(errors,[]);
} finally {
  await writeFile(`${dir}/verification.json`,JSON.stringify({results,errors},null,2));
  await browser.close();
}
console.log(JSON.stringify(results,null,2));
