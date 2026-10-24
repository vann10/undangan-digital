'use client';

import {useLayoutEffect,useRef,type ReactNode} from 'react';
import {gsap} from 'gsap';
import './scroll-story.css';

type Entry={element:HTMLElement; timeline:gsap.core.Timeline; visible:boolean};

/** Each scene is measured on an untransformed wrapper. No scroll interception. */
export default function ScrollStory({children,active=true}:{children:ReactNode;active?:boolean}) {
  const root=useRef<HTMLDivElement>(null);
  const entries=useRef<Entry[]>([]);
  const paused=useRef(false);
  const enabled=useRef(active);
  useLayoutEffect(()=>{
    enabled.current=active;
    for(const entry of entries.current){
      if(active && entry.visible && !paused.current)entry.timeline.play();
      else if(!active)entry.timeline.pause(0);
    }
  },[active]);
  useLayoutEffect(()=>{
    const host=root.current!;
    const media=gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)',()=>{
      const records:Entry[]=[];
      entries.current=records;
      const seen=new WeakSet<HTMLElement>();
      const observer=new IntersectionObserver(changes=>{
        for(const change of changes){
          const entry=records.find(r=>r.element===change.target);if(!entry)continue;
          entry.visible=change.isIntersecting;
          if(!enabled.current)continue;
          if(change.isIntersecting){
            if(paused.current||entry.element.contains(document.activeElement))entry.timeline.progress(1).pause();
            else entry.timeline.play();
          } else if(!entry.element.contains(document.activeElement)) {
            entry.timeline.pause(0);entry.element.dataset.scrollState='ready';
          }
        }
      },{rootMargin:'0px 0px -8% 0px',threshold:0});
      const q=(el:Element,s:string)=>Array.from(el.querySelectorAll<HTMLElement>(s));
      function scene(element:HTMLElement,name:string,build:(tl:gsap.core.Timeline)=>void){
        if(seen.has(element))return;seen.add(element);
        element.dataset.scrollScene=name;element.dataset.scrollState='ready';
        const tl=gsap.timeline({paused:true,defaults:{duration:1,ease:'power3.out'},onStart(){element.dataset.scrollState='entering';},onComplete(){element.dataset.scrollState='settled';}});
        build(tl);records.push({element,timeline:tl,visible:false});observer.observe(element);
      }
      q(host,'.section-heading,.couple-page-header').forEach((el,i)=>scene(el,`heading-${i}`,tl=>{
        tl.from(q(el,'p'),{y:18,opacity:0,duration:.65},0)
          .from(q(el,'h2'),{y:42,clipPath:'inset(0 0 100% 0)'},.1)
          .from(q(el,'.gold-divider'),{scaleX:0,opacity:0,duration:1.1},.25);
      }));
      q(host,'.person-profile').forEach((el,i)=>scene(el,`portrait-${i}`,tl=>{
        const direction=i%2?1:-1;
        tl.from(q(el,'.person-portrait'),{x:()=>direction*(host.clientWidth+40),rotation:direction*8,opacity:0,duration:1.4},0)
          .from(q(el,'.person-photo'),{scale:1.12,duration:1.6},.1)
          .from(q(el,'.profile-dove img'),{x:-direction*85,y:35,scale:.7,opacity:0,duration:1.2},.3)
          .from(q(el,'.person-copy h3,.person-surname'),{x:-direction*100,y:20,opacity:0,stagger:.13},.35)
          .from(q(el,'.person-rule'),{scaleX:0},.6);
      }));
      q(host,'.countdown-grid').forEach(el=>scene(el,'countdown',tl=>{
        tl.from(q(el,'.countdown-unit'),{y:100,rotation:(i:number)=>i%2?9:-9,scale:.85,opacity:0,stagger:.12,ease:'back.out(1.2)'},0)
          .from(q(el,'small'),{y:15,opacity:0,stagger:.1,duration:.6},.35);
      }));
      q(host,'.chapter-background').forEach((el,i)=>scene(el,`chapter-background-${i}`,tl=>{
        tl.from(q(el,'img'),{y:30,scale:1.04,opacity:0,duration:1.5,ease:'power3.out'});
      }));
      q(host,'.event-list').forEach(el=>scene(el,'event-details',tl=>{
        tl.from(q(el,':scope>div'),{x:(i:number)=>(i%2?1:-1)*host.clientWidth,opacity:0,stagger:.09,duration:.95});
      }));
      q(host,'.venue-section').forEach(el=>scene(el,'venue',tl=>{
        tl.from(q(el,'.venue-architecture'),{x:-120,y:30,opacity:0,duration:1.6},0)
          .from(q(el,'.venue-panel'),{y:75,scale:.93,opacity:0,duration:1.2},.2)
          .from(q(el,'iframe'),{clipPath:'inset(50% 0 50% 0)',duration:1.2,ease:'power3.inOut'},.4);
      }));
      q(host,'.gallery-grid').forEach(el=>scene(el,'gallery',tl=>{
        tl.from(q(el,'.gallery-photo-1'),{y:70,rotation:-4,clipPath:'inset(0 0 85% 0)',duration:1.3,ease:'power3.inOut'},0)
          .from(q(el,'.gallery-photo-2'),{x:()=>-host.clientWidth,rotation:-8,opacity:0,duration:1.2},.2)
          .from(q(el,'.gallery-photo-3'),{x:()=>host.clientWidth,rotation:8,opacity:0,duration:1.2},.35)
          .from(q(el,'img'),{scale:1.12,stagger:.1,duration:1.5},.1);
      }));
      q(host,'.rsvp-form').forEach((el,i)=>scene(el,`form-${i}`,tl=>{
        tl.from(q(el,':scope>label,:scope>fieldset'),{x:()=>host.clientWidth*(i?-.8:.8),opacity:0,stagger:.12},0)
          .from(q(el,'.form-submit'),{y:35,scale:.94,opacity:0,ease:'back.out(1.2)'},.25);
      }));
      q(host,'.gift-section').forEach(el=>scene(el,'gifts',tl=>{
        tl.from(q(el,'.bank-carousel'),{y:90,rotation:4,scale:.9,opacity:0,duration:1.2,ease:'back.out(1.2)'},.15)
          .from(q(el,'.gift-card'),{x:()=>host.clientWidth,opacity:0,duration:1.2},.4)
          .from(q(el,'.bank-carousel-controls'),{y:20,opacity:0},.6);
      }));
      q(host,'.closing-section').forEach(el=>scene(el,'closing',tl=>{
        tl.from(q(el,'.gold-divider'),{scaleX:0,opacity:0,duration:1.1},0)
          .from(q(el,'p'),{y:35,opacity:0},.15)
          .from(q(el,'h2'),{y:80,rotation:3,scale:.8,clipPath:'inset(0 0 100% 0)',duration:1.5},.3)
          .from(q(el,'.closing-monogram'),{y:20,scale:.85,opacity:0},.6);
      }));
      const addCards=()=>q(host,'.wish-card').forEach((el,i)=>scene(el,`wish-${i}`,tl=>{
        tl.from(q(el,'p,cite'),{x:i%2?70:-70,y:15,opacity:0,stagger:.15});
      }));
      const context=gsap.context(()=>addCards(),host);
      const mutation=new MutationObserver(()=>context.add(()=>addCards()));
      q(host,'.wishes-list').forEach(el=>mutation.observe(el,{childList:true}));
      const focus=(event:FocusEvent)=>{if(event.target instanceof Node)records.filter(r=>r.element.contains(event.target as Node)).forEach(r=>r.timeline.progress(1).pause());};
      host.addEventListener('focusin',focus);
      return ()=>{observer.disconnect();mutation.disconnect();context.revert();host.removeEventListener('focusin',focus);entries.current=[];};
    },host);
    return ()=>media.revert();
  },[]);
  return <div className="opened-pages scroll-story" ref={root} inert={!active} aria-hidden={!active} data-active={active}>{children}</div>;
}
