'use client';

import { useEffect, useId, useRef, useState, type CSSProperties, type RefObject, type MouseEvent } from 'react';
import { gsap } from 'gsap';
import { transitionConfig as C, transitionVariables } from '../transition.config';
import { RasterParticles } from './transition-particles';
import { playOpenTransition } from './opening-timeline';
import { dateLabel } from './wedding-config';
import { LoadingScreen } from './loading-screen';
import './cinematic-opening.css';

function Art({name,className='',style}: {name:string;className?:string;style?:CSSProperties}) {
  // Reuse identical specimens and decode the same resource once across layers.
  if(name.startsWith('vine-')) name='vine-left-front';
  if(name.startsWith('leaf-sprite-')) name=`leaf-sprite-0${(Number(name.slice(-2))-1)%4+1}`;
  if(name.startsWith('bouquet-leaf-')) name=name.replace('bouquet-leaf-','leaf-sprite-');
  if(name.startsWith('bouquet-flower-') && !name.endsWith('05')) name=name.replace('bouquet-flower-','flower-sprite-');
  if(name.startsWith('monogram-petals-')) name=name.replace('monogram-petals-','petal-');
  return <picture className={className} style={style}>
    <source type="image/webp" srcSet={/^(leaf-sprite|flower-sprite|petal|bouquet)/.test(name) ? `/transition/${name}@1x.webp` : `/transition/${name}@1x.webp 1x, /transition/${name}.webp 2x`} />
    <img src={`/transition/${name}.png`} alt="" decoding="async" draggable={false} />
  </picture>;
}
function Vine({side,depth}:{side:'left'|'right';depth:'back'|'front'}) {
  return <div className={`cin-vine cin-vine-${side} cin-vine-${depth}`} data-motion>
    {[0,1,2,3].map(i=><div className="cin-vine-segment" key={i} style={{'--segment':i} as CSSProperties}>
      <Art name={`vine-${side}-${depth}`} />
    </div>)}
  </div>;
}

type Props = {guestName:string; guestError:string; audio:RefObject<HTMLAudioElement|null>; onBegin:()=>void; onFinish:()=>void; onReset:()=>void};
export default function CinematicOpening({guestName,guestError,audio,onBegin,onFinish,onReset}:Props) {
  const photoClip=useId().replace(/:/g,'');
  const root=useRef<HTMLDivElement>(null);
  const bridge=useRef<HTMLDivElement>(null);
  const canvas=useRef<HTMLCanvasElement>(null);
  const timeline=useRef<gsap.core.Timeline|null>(null);
  const idle=useRef<gsap.core.Timeline|null>(null);
  const callbacks=useRef({onBegin,onFinish,onReset});
  callbacks.current={onBegin,onFinish,onReset};
  const [ready,setReady]=useState(false);
  const [progress,setProgress]=useState(0);
  const [failed,setFailed]=useState(false);
  const [attempt,setAttempt]=useState(0);
  const [paused,setPaused]=useState(false);
  const [started,setStarted]=useState(false);
  const [ended,setEnded]=useState(false);
  const [debug,setDebug]=useState(false);
  const [time,setTime]=useState(0);
  const [duration,setDuration]=useState(C.duration.total);
  const runtime=useRef({started:false, ended:false, paused:false, reduced:false});

  useEffect(()=>{
    const el=root.current!;
    const params=new URLSearchParams(location.search);
    const debugging=params.get('debug')==='1'; setDebug(debugging);
    let disposed=false;
    const previousOverflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    const media=matchMedia('(prefers-reduced-motion: reduce)');
    runtime.current.reduced=media.matches;
    const particles=new RasterParticles(canvas.current!);
    let idleTime=0;
    let lastDebugUpdate=0;
    let ctx:gsap.Context|undefined;
    const tick=(_time:number,delta:number)=>{
      if(runtime.current.ended && !runtime.current.paused && !runtime.current.reduced && !document.hidden){idleTime+=delta/1000; particles.draw(idleTime,true);}
    };
    const complete=()=>{
      runtime.current.ended=true; setEnded(true);
      document.body.style.overflow=previousOverflow;
      callbacks.current.onFinish();
      el.querySelector<HTMLHeadingElement>('.cin-names')?.focus({preventScroll:true});
      if(!runtime.current.reduced && !runtime.current.paused) idle.current?.restart();
    };
    async function prepare() {
      setReady(false);setFailed(false);setProgress(0);
      try {
        const imgs=Array.from(el.querySelectorAll('img')).concat(Array.from(bridge.current!.querySelectorAll('img')));
        if(attempt>0) for(const img of imgs) {
          if(!img.naturalWidth) {
            const url=new URL(img.currentSrc||img.src);url.searchParams.set('retry',String(attempt));
            img.parentElement?.querySelector('source')?.removeAttribute('srcset');
            img.src=url.href;
          }
        }
        const atlas=new Image(); atlas.src='/transition/particle-atlas.webp';
        const clouds=new Image();clouds.src='/artwork/cloud-canopy-review.webp';
        let timeout:ReturnType<typeof setTimeout>|undefined;
        try {
          await Promise.race([
            Promise.all([...imgs,atlas,clouds].map(async img=>{await img.decode();if(!disposed)setProgress(n=>Math.min(95,n+95/(imgs.length+2)));})).then(()=>document.fonts.ready),
            new Promise((_,reject)=>{timeout=setTimeout(()=>reject(new Error('Asset timeout')),30000);}),
          ]);
        } finally { if(timeout) clearTimeout(timeout); }
        if(disposed) return;
        ctx=gsap.context(()=>{
          // Explicit endpoints prevent idle/replay from capturing an entrance pose.
          // Each loop has its own period, so neither layer pauses at the other's turn.
          idle.current=gsap.timeline({paused:true})
            .fromTo('.cin-branch',{rotation:0},{rotation:(i:number)=>i%2?C.motion.idleSway:-C.motion.idleSway,duration:C.duration.idleSway,ease:'sine.inOut',repeat:-1,yoyo:true,immediateRender:false},0)
            .fromTo('.cin-fog',{xPercent:C.motion.fogEnd},{xPercent:C.motion.fogStart,duration:C.duration.idleFog,ease:'sine.inOut',repeat:-1,yoyo:true,immediateRender:false},0);
          timeline.current=playOpenTransition({root:el,reduced:media.matches,particles,audio:audio.current,
            onStart(){idleTime=0;runtime.current.started=true;setStarted(true);document.body.style.overflow='hidden';idle.current?.pause();},
            onUpdate(t){
              // React need not reconcile every illustration on every debug frame.
              const now=performance.now();
              const master=timeline.current;
              if(debugging && master && (master.paused() || t>=master.duration() || now-lastDebugUpdate>=50)){
                lastDebugUpdate=now;setTime(t);
              }
            },onComplete:complete,
          });
        },el);
        setDuration(timeline.current!.duration());
        await new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())));
        if(disposed)return;
        setProgress(100);setReady(true);
        if(params.get('view')==='hero') {timeline.current!.progress(1).pause();}
        if(debugging) {
          (window as Window & {__weddingTransition?:unknown}).__weddingTransition={timeline:timeline.current,idle:idle.current,particles,config:C};
        }
      } catch {if(!disposed)setFailed(true);}
    }
    void prepare(); gsap.ticker.add(tick);
    const resize=new ResizeObserver(()=>{
      particles.resize();
    });
    resize.observe(el);
    let resumeOnVisible=false;
    const onVisibility=()=>{
      if(document.hidden && runtime.current.started && !runtime.current.ended && !timeline.current?.paused()) {
        timeline.current?.pause();resumeOnVisible=true;
      } else if(!document.hidden && resumeOnVisible){timeline.current?.resume();resumeOnVisible=false;}
    };
    const onMotionChange=()=>{
      runtime.current.reduced=media.matches;
      if(!runtime.current.started){setAttempt(n=>n+1);return;}
      if(media.matches){idle.current?.pause();particles.clear();timeline.current?.progress(1);}
      else if(runtime.current.ended && !runtime.current.paused)idle.current?.play();
    };
    document.addEventListener('visibilitychange',onVisibility);
    media.addEventListener('change',onMotionChange);
    return ()=>{
      disposed=true;resize.disconnect();gsap.ticker.remove(tick);ctx?.revert();particles.clear();
      document.body.style.overflow=previousOverflow;
      document.removeEventListener('visibilitychange',onVisibility);media.removeEventListener('change',onMotionChange);
      delete (window as Window & {__weddingTransition?:unknown}).__weddingTransition;
    };
  },[attempt,audio]);

  function open(event:MouseEvent<HTMLButtonElement>) {
    if(!ready || runtime.current.started)return;
    const rect=event.currentTarget.getBoundingClientRect();
    const ripple=root.current!.querySelector<HTMLElement>('.cin-ripple')!;
    gsap.set(ripple,{left:event.detail ? event.clientX-rect.left : rect.width/2,top:event.detail ? event.clientY-rect.top : rect.height/2});
    root.current!.querySelectorAll<HTMLElement>('[data-motion]').forEach(el=>el.style.willChange='transform, opacity');
    if(audio.current) audio.current.volume=0;
    callbacks.current.onBegin(); // Synchronously invoked inside the trusted click for autoplay.
    runtime.current.paused=false;setPaused(false);timeline.current?.restart();
  }
  function toggleMotion(){
    const next=!runtime.current.paused;runtime.current.paused=next;setPaused(next);
    if(runtime.current.started && !runtime.current.ended)timeline.current?.paused(next);
    if(runtime.current.ended)idle.current?.paused(next || runtime.current.reduced);
  }
  function seek(value:number){
    idle.current?.pause();runtime.current.paused=true;setPaused(true);
    runtime.current.started=true;setStarted(true);
    runtime.current.ended=value>=duration;setEnded(value>=duration);
    if(value<duration){callbacks.current.onReset();document.body.style.overflow='hidden';}
    timeline.current?.pause().time(value,false);
  }
  function replay(){
    idle.current?.pause(0);callbacks.current.onReset();setEnded(false);runtime.current.ended=false;
    runtime.current.started=true;setStarted(true);runtime.current.paused=false;setPaused(false);
    timeline.current?.restart();document.body.style.overflow='hidden';
  }
  return <>
    <LoadingScreen progress={Math.round(progress)} phase={failed?'error':ready?'ready':'loading'} onRetry={()=>setAttempt(n=>n+1)} />
    <div ref={root} inert={!ready} aria-busy={!ready} className={`cin-stage ${ended?'cin-ended':''} ${started?'cin-started':''}`} data-paused={paused} data-ready={ready} style={transitionVariables() as CSSProperties}>
    <div className="cin-paper" aria-hidden="true"><Art name="paper-texture" /></div>
    <div className="cin-sky" aria-hidden="true"><Art name="landscape-far" /></div>
    <div className="cin-landscape" aria-hidden="true" data-motion>
      {['far','mid','lake','foreground'].map(layer=><Art name={`landscape-${layer}`} className={`cin-landscape-${layer}`} key={layer} />)}
      <Art name="water-glimmer" className="cin-water" />
    </div>
    <Art name="fog-layer" className="cin-fog" />
    <section id="opening" className="cin-opening" aria-label="Sampul undangan" aria-hidden={ended} inert={ended}>
      <div className="cin-opening-only cin-gates" aria-hidden="true">
        {(['left','right'] as const).flatMap(side=>(['back','front'] as const).map(depth=><Vine side={side} depth={depth} key={side+depth}/>))}
        <Art name="garland-top" className="cin-garland" />
        <Art name="corner-left" className="cin-corner cin-corner-left" />
        <Art name="corner-right" className="cin-corner cin-corner-right" />
        {Array.from({length:10},(_,i)=><Art key={i} name={`leaf-sprite-${String(i%8+1).padStart(2,'0')}`} className={`cin-loose-leaf cin-loose-leaf-${i%2?'right':'left'}`} style={{top:`${12+i*6.3}%`,rotate:`${i%2?25:-25}deg`}} />)}
      </div>
      <div className="cin-butterfly cin-opening-only" aria-hidden="true" data-motion>
        <Art name="butterfly-wing-left" className="cin-wing-left" />
        <Art name="butterfly-wing-right" className="cin-wing-right" />
        <Art name="butterfly-body" className="cin-butterfly-body" />
      </div>
      <div className="cin-monogram-wrap cin-opening-only" aria-hidden="true">
        <Art name="monogram" className="cin-monogram" />
        {Array.from({length:6},(_,i)=><Art key={i} name={`monogram-petals-0${i+1}`} className="cin-monogram-petal" style={{left:`${35+Math.cos(i)*28}%`,top:`${40+Math.sin(i)*30}%`}}/>)}
      </div>
      <p className="cin-invited cin-exit-text cin-opening-only">YOU’RE INVITED TO THE WEDDING OF</p>
      <div className="cin-guest cin-exit-text cin-opening-only"><span>Yth.</span><p>{guestName}</p></div>
      {guestError && <p className="cin-guest-error" role="alert">{guestError}</p>}
      <div className="cin-button-anchor cin-opening-only">
        <button type="button" className="cin-open" onClick={open} disabled={!ready||started} aria-label="Buka Undangan" aria-controls="hero">
          <span className="cin-ripple" aria-hidden="true" />
          <span className="cin-button-copy">{ready?'Buka Undangan':failed?'ASET BELUM TERMUAT':'MENYIAPKAN UNDANGAN'}</span><span className="cin-arrow" aria-hidden="true">→</span>
        </button>
        {failed && <button className="cin-retry" onClick={()=>setAttempt(n=>n+1)}>Coba muat ulang</button>}
        <span role="status" className="cin-sr">{ready?'Undangan siap dibuka':failed?'Aset gagal dimuat. Silakan coba lagi.':'Sedang memuat ilustrasi'}</span>
      </div>
    </section>
    <section id="hero" className="cin-hero" aria-label="Undangan pernikahan" aria-hidden={!ended}>
      <div className="cin-portrait cin-hero-reveal" data-motion>
        <svg className="cin-arch" viewBox="0 0 280 354" preserveAspectRatio="none" aria-hidden="true"><path className="cin-arch-path" d="M3 351 L3 141 A137 137 0 0 1 277 141 L277 351 Z" /></svg>
        <svg width="0" height="0" className="cin-clip-defs" aria-hidden="true"><defs><clipPath id={photoClip} clipPathUnits="objectBoundingBox"><path transform="scale(.003571428571 .002824858757)" d="M3 351 L3 141 A137 137 0 0 1 277 141 L277 351 Z" /></clipPath></defs></svg>
        <div className="cin-photo-reveal"><div className="cin-photo-mask" style={{clipPath:`url(#${photoClip})`}}><img className="cin-photo" src="/artwork/couple-user-upload.webp" width={1000} height={1501} alt="Rizal dan Dewi bersama" decoding="async" /></div></div>
        <div className="cin-bouquet" aria-hidden="true">
          {Array.from({length:4},(_,i)=><Art name={`bouquet-leaf-0${i+1}`} key={`leaf${i}`} className={`cin-bouquet-piece cin-bouquet-leaf cin-bouquet-piece-${i}`} />)}
          {Array.from({length:5},(_,i)=><Art name={`bouquet-flower-0${i+1}`} key={`flower${i}`} className={`cin-bouquet-piece cin-bouquet-flower cin-bouquet-piece-${i+4}`} />)}
        </div>
      </div>
      <p className="cin-hero-kicker cin-hero-reveal">THE WEDDING OF</p>
      <p className="cin-date cin-hero-reveal" aria-label={dateLabel}>{dateLabel.split(' ').map((word,i)=><span className="cin-word-mask" key={i}><span className="cin-date-word">{word}</span></span>)}</p>
    </section>
    <div className="cin-hero-botanicals" aria-hidden="true">
      <Art name="branch-hero-left" className="cin-branch cin-branch-left cin-hero-reveal" />
      <Art name="branch-hero-right" className="cin-branch cin-branch-right cin-hero-reveal" />
      <div className="cin-hero-leaves">{Array.from({length:6},(_,i)=><Art key={i} name={`leaf-sprite-0${i+1}`} className="cin-hero-leaf" style={{left:i%2?`${85-i}%`:`${i*2}%`,top:`${4+i*2}%`,rotate:`${i%2?45:-45}deg`}} />)}</div>
    </div>
    <h1 className="cin-names" id="hero-heading" tabIndex={-1} data-motion>Rizal <em className="cin-ampersand">&amp;</em> Dewi</h1>
    <svg className="cin-divider" viewBox="0 0 130 16" aria-hidden="true" data-motion>
      <path className="cin-divider-line cin-divider-line-left" d="M2 8H56"/><path className="cin-divider-line cin-divider-line-right" d="M74 8H128"/>
      <rect className="cin-divider-diamond" x="61" y="4" width="8" height="8" />
    </svg>
    <canvas ref={canvas} className="cin-particles" aria-hidden="true" />
    {debug && <div className="cin-debug" role="group" aria-label="Debug timeline GSAP">
      <div><strong>GSAP · {time.toFixed(2)} / {duration.toFixed(2)} s</strong><button onClick={replay} disabled={!ready}>Ulangi</button><button onClick={toggleMotion}>{paused?'Putar':'Jeda'}</button></div>
      <input type="range" min="0" max={duration} step="0.01" value={time} aria-label="Waktu timeline" onChange={e=>seek(Number(e.target.value))} disabled={!ready}/>
      <span>{Object.entries(C.at).filter(([,t])=>t<=time).at(-1)?.[0]??'ready'}</span>
    </div>}
  </div>
  <div ref={bridge} className="page-bridge page-bridge-before-couple cin-page-bridge" aria-hidden="true">
    <img className="page-bridge-garland" src="/artwork/page-transition-garland.webp" width={1100} height={367} alt="" decoding="async" />
  </div></>;
}
