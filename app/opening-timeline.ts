import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { transitionConfig as C } from '../transition.config';
import type { RasterParticles } from './transition-particles';

gsap.registerPlugin(MotionPathPlugin);
type Options = { root: HTMLElement; reduced: boolean; particles: RasterParticles; audio: HTMLAudioElement | null; onUpdate: (time:number)=>void; onComplete: ()=>void; onStart: ()=>void };

// One master timeline owns every transition, including wing flaps and volume.
// Returned paused, so callers can play, pause, seek and inspect labels.
export function playOpenTransition({root,reduced,particles,audio,onUpdate,onComplete,onStart}:Options) {
  const q=gsap.utils.selector(root);
  const size=()=>root.getBoundingClientRect();
  const name=root.querySelector<HTMLElement>('.cin-names')!;
  const divider=root.querySelector<SVGSVGElement>('.cin-divider')!;
  const tl=gsap.timeline({paused:true, defaults:{ease:C.ease.reveal}, onStart, onUpdate(){
    particles.draw(tl.time(),false,!tl.paused()); onUpdate(tl.time());
  }, onComplete(){
    particles.clear(); q('[data-motion]').forEach((el:HTMLElement)=>el.style.removeProperty('will-change')); onComplete();
  }});
  const path=root.querySelector<SVGPathElement>('.cin-arch-path')!;
  const length=path.getTotalLength();
  gsap.set(path,{strokeDasharray:length,strokeDashoffset:length});
  gsap.set(q('.cin-hero-reveal'),{autoAlpha:0});
  gsap.set(q('.cin-photo-reveal'),{clipPath:'inset(100% 48% 0% 48%)'});
  gsap.set(q('.cin-photo'),{scale:1.18,filter:'blur(6px)'});
  gsap.set(q('.cin-bouquet-piece, .cin-hero-leaf'),{scale:0});
  gsap.set(q('.cin-branch-left'),{xPercent:-55,yPercent:-30,rotation:-12});
  gsap.set(q('.cin-branch-right'),{xPercent:55,yPercent:-30,rotation:12});
  gsap.set(q('.cin-date-word'),{y:0,yPercent:110});
  gsap.set(q('.cin-divider-diamond'),{svgOrigin:'65 8',rotation:45,scale:1});
  // Keep the same compositing mode across entrance, rest, and idle.
  gsap.set(q('.cin-names, .cin-landscape, .cin-photo, .cin-branch'),{force3D:true});
  gsap.set(q('.cin-fog'),{xPercent:C.motion.fogStart});
  const revealName = (duration:number,at:number) => {
    tl.to(name,{color:C.colors.heroText,duration},at)
      .to(q('.cin-hero-haze'),{autoAlpha:1,duration},at)
      .to(q('.cin-ampersand'),{'--amp-base':C.colors.heroText,'--amp-gold':C.colors.heroText,'--amp-sand':C.colors.heroText,webkitTextFillColor:C.colors.heroText,duration},at);
    if(!reduced) {
      // Blur the letters themselves during motion, without a shadow or glow.
      const blurredText = q('.cin-names, .cin-hero-kicker');
      tl.fromTo(blurredText,{filter:'blur(0px)'},
        {filter:'blur(3px)',duration:duration*.45,ease:'sine.inOut',immediateRender:false},at)
        .to(blurredText,{filter:'blur(0px)',duration:duration*.55,ease:'sine.inOut'},at+duration*.45)
        .set(blurredText,{filter:'none'},at+duration);
    }
  };
  const finalShared = (duration:number,at:number) => {
    revealName(duration,at);
    tl.to(name,{y:0,yPercent:C.layout.nameShift/C.layout.nameHeight*100,scale:C.motion.nameScale,duration,ease:C.ease.gates},at)
      .to(divider,{y:0,yPercent:C.layout.dividerShift/C.layout.dividerHeight*100,duration,ease:C.ease.gates},at)
      .to(q('.cin-landscape'),{yPercent:C.motion.landscapeY,scale:C.motion.landscapeScale,duration,ease:C.ease.gates},at);
  };
  if(reduced) {
    tl.addLabel('reduced',0)
      .to(q('.cin-sky'),{opacity:C.opacity.sky,duration:C.duration.reduced},0)
      .to(q('.cin-opening-only'),{autoAlpha:0,duration:C.duration.reduced},0)
      .to(q('.cin-hero-reveal'),{autoAlpha:1,duration:C.duration.reduced},0)
      .to(path,{strokeDashoffset:0,duration:C.duration.reduced},0)
      .to(q('.cin-photo-reveal'),{clipPath:'inset(0% 0% 0% 0%)',duration:C.duration.reduced},0)
      .to(q('.cin-photo'),{scale:1,filter:'blur(0px)',duration:C.duration.reduced},0)
      .to(q('.cin-bouquet-piece, .cin-hero-leaf'),{scale:1,duration:C.duration.reduced},0)
      .to(q('.cin-branch'),{xPercent:0,yPercent:0,rotation:0,duration:C.duration.reduced},0)
      .to(q('.cin-date-word'),{y:0,yPercent:0,duration:C.duration.reduced},0);
    finalShared(C.duration.reduced,0);
    if(audio) tl.to(audio,{volume:C.audio.volume,duration:C.duration.reduced},0);
    return tl;
  }
  Object.entries(C.at).forEach(([label,time])=>tl.addLabel(label,time));
  tl.to(q('.cin-open'),{scale:.96,duration:.10},0)
    .to(q('.cin-open'),{scale:1,duration:.22,ease:C.ease.spring},.10)
    .fromTo(q('.cin-ripple'),{scale:0,opacity:C.opacity.ripple},{scale:2.5,opacity:0,duration:C.duration.button},0)
    .to(q('.cin-arrow'),{x:18,duration:.3},0)
    .to(q('.cin-button-copy'),{opacity:0,duration:.18},.15)
    .to(q('.cin-open'),{width:52,padding:0,duration:.3,ease:C.ease.gates},.2)
    .to(q('.cin-open'),{autoAlpha:0,scale:.5,duration:.15},.5);
  for(const side of ['left','right']) {
    const sign=side==='left'?-1:1;
    for(const depth of ['back','front']) tl.to(q(`.cin-vine-${side}.cin-vine-${depth}`),{
      xPercent:sign*C.motion.vineExit*(depth==='front'?1.6:1),rotation:sign*3,scale:depth==='front'?C.motion.frontScale:C.motion.backScale,
      duration:C.duration.gates+(depth==='back'?.15:0),ease:C.ease.gates,
    },C.at.gates+(depth==='back'?.08:0));
    tl.to(q(`.cin-vine-${side} .cin-vine-segment`),{rotation:(i:number)=>sign*(i%2?2:-2),duration:.8,stagger:C.stagger.segments},C.at.gates)
      .to(q(`.cin-corner-${side}`),{xPercent:sign*65,yPercent:32,rotation:sign*8,duration:1.1,ease:C.ease.gates},.2);
  }
  tl.to(q('.cin-vine, .cin-corner'),{autoAlpha:0,duration:.38},1.05)
    .to(q('.cin-sky'),{opacity:C.opacity.sky,duration:C.duration.exit},C.at.exit)
    .to(q('.cin-garland'),{yPercent:-30,autoAlpha:0,duration:1.05,ease:C.ease.gates},C.at.gates)
    .to(q('.cin-loose-leaf'),{rotation:(i:number)=>i%2?6:-6,x:(i:number)=>i%2?45:-45,autoAlpha:0,duration:1,stagger:.025},.2)
    .to(q('.cin-monogram'),{scale:1.15,autoAlpha:0,duration:C.duration.exit},C.at.exit)
    .to(q('.cin-monogram-petal'),{x:(i:number)=>Math.cos(i*Math.PI/3)*95,y:(i:number)=>Math.sin(i*Math.PI/3)*80,rotation:(i:number)=>i*17,opacity:0,duration:.8,stagger:.035},.3)
    .to(q('.cin-exit-text'),{y:-18,clipPath:'inset(0 0 100% 0)',opacity:0,duration:C.duration.exit,stagger:C.stagger.text},C.at.exit);
  const width=size().width, height=size().height;
  tl.to(q('.cin-butterfly'),{motionPath:{path:[{x:0,y:0},{x:-width*.25,y:height*.06},{x:-width*.46,y:-height*.04},{x:-width*.35,y:-height*.13},{x:-width*.9,y:-height*.25}],curviness:1.4,autoRotate:180},scale:.55,duration:C.duration.butterfly,ease:'power2.inOut'},C.at.butterfly)
    .to(q('.cin-butterfly'),{autoAlpha:0,duration:.18},1.22)
    .to(q('.cin-wing-left'),{scaleX:C.motion.wingMin,skewY:7,duration:C.motion.wingDuration,repeat:8,yoyo:true,ease:'sine.inOut'},C.at.butterfly)
    .to(q('.cin-wing-right'),{scaleX:C.motion.wingMin,skewY:-7,duration:C.motion.wingDuration,repeat:8,yoyo:true,ease:'sine.inOut'},C.at.butterfly);
  tl.to(q('.cin-landscape'),{yPercent:C.motion.landscapeY,scale:C.motion.landscapeScale,duration:C.duration.landscape,ease:C.ease.gates},C.at.landscape)
    // One continuous camera move; no second landscape correction at settle.
    .to(q('.cin-fog'),{xPercent:C.motion.fogEnd,duration:C.at.settle-C.at.landscape,ease:'sine.inOut'},C.at.landscape)
    .to(q('.cin-water'),{opacity:C.opacity.water,duration:.45},.9)
    .to(q('.cin-water'),{x:15,opacity:0,duration:.75},1.35)
    .to(q('.cin-portrait'),{autoAlpha:1,duration:.01},C.at.arch)
    .to(path,{strokeDashoffset:0,duration:C.duration.arch,ease:C.ease.arch},C.at.arch)
    .to(q('.cin-photo-reveal'),{clipPath:'inset(0% 0% 0% 0%)',duration:C.duration.photo,ease:C.ease.gates},C.at.photo)
    .to(q('.cin-photo'),{scale:1,filter:'blur(0px)',duration:C.duration.photo,ease:C.ease.reveal},C.at.photo)
    .to(q('.cin-bouquet-piece'),{scale:1,rotation:0,duration:C.duration.bouquet,stagger:C.stagger.bouquet,ease:C.ease.bloom},C.at.bouquet)
    .to(q('.cin-branch'),{autoAlpha:1,xPercent:0,yPercent:0,rotation:0,duration:C.duration.branches,ease:C.ease.gates},C.at.branches)
    .to(q('.cin-hero-leaf'),{scale:1,duration:.5,stagger:C.stagger.leaves,ease:C.ease.bloom},1.8)
    .to(name,{y:0,yPercent:C.layout.nameShift/C.layout.nameHeight*100,scale:C.motion.nameScale,duration:C.duration.shared,ease:C.ease.gates},C.at.shared)
    .fromTo(q('.cin-ampersand'),{rotation:-15},{rotation:0,backgroundPosition:'200% 0',duration:C.duration.shared},C.at.shared)
    .fromTo(q('.cin-hero-kicker'),{letterSpacing:'.5em'},{autoAlpha:1,letterSpacing:'.25em',duration:.9},C.at.shared)
    .to(divider,{y:0,yPercent:C.layout.dividerShift/C.layout.dividerHeight*100,duration:C.duration.shared,ease:C.ease.gates},C.at.shared)
    .to(q('.cin-divider-line'),{scaleX:.03,duration:.35},1.6)
    .to(q('.cin-divider-line'),{scaleX:1,duration:.85,ease:C.ease.arch},1.95)
    .to(q('.cin-divider-diamond'),{svgOrigin:'65 8',rotation:225,scale:1.15,duration:.7,ease:C.ease.bloom},2)
    .to(q('.cin-date'),{autoAlpha:1,duration:.01},C.at.date)
    .to(q('.cin-date-word'),{y:0,yPercent:0,duration:C.duration.date,stagger:C.stagger.date},C.at.date)
    .to({}, {duration:C.duration.total-C.at.settle},C.at.settle);
  revealName(C.duration.shared,C.at.shared);
  if(audio) tl.to(audio,{volume:C.audio.volume,duration:C.duration.audio},0);
  return tl;
}
