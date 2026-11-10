'use client';

import {useLayoutEffect,useRef,useState,type CSSProperties} from 'react';
import {ChapterBackground} from './chapter-art';
import {photoSrcSet,photoUrl} from './wedding-photos';

// Tile geometry is measured as a percentage of the album width.
const photos=[
  {id:'ARY_5268',alt:'Detail tangan Rizal merapikan jas',height:1441,portrait:true,left:33.5,top:0,width:32.8,ratio:2/3},
  {id:'ARY_4842',alt:'Rizal dan Dewi berdiri berdampingan',height:1200,left:67.2,top:41.4,width:32.8,ratio:2/3},
  {id:'ARY_4885',alt:'Rizal dan Dewi saling menatap',height:1200,left:0,top:50,width:32.8,ratio:4/5},
  {id:'ARY_5008',alt:'Rizal dan Dewi dalam cahaya dari samping',height:1200,left:33.5,top:50,width:32.8,ratio:4/5},
  {id:'ARY_5341',alt:'Detail Dewi dengan buket putih dan veil',height:1441,portrait:true,left:60.4,top:91.8,width:39.6,ratio:2/3},
  {id:'ARY_5224',alt:'Rizal dan Dewi di tengah kelopak yang berjatuhan',height:1200,left:26.6,top:92.8,width:33,ratio:4/5},
  {id:'ARY_5096',alt:'Siluet Rizal melintas di depan Dewi',height:1200,left:10.9,top:134.85,width:48.6,ratio:4/5},
  {id:'ARY_5162',alt:'Rizal dan Dewi duduk bersama',height:1200,left:60.4,top:152,width:39.6,ratio:4/5},
];

function tileTransform(tile:DOMRect,frame:DOMRect){
  const x=tile.left+tile.width/2-frame.left-frame.width/2;
  const y=tile.top+tile.height/2-frame.top-frame.height/2;
  const scale=Math.min(tile.width/frame.width,tile.height/frame.height);
  return `translate(${x}px, ${y}px) scale(${scale})`;
}

export default function WeddingGallery(){
  const [active,setActive]=useState<{index:number;thumbnail:string}|null>(null);
  const opener=useRef<HTMLButtonElement>(null);
  const preview=useRef<HTMLDialogElement>(null);
  const frame=useRef<HTMLButtonElement>(null);
  const motion=useRef<Animation[]>([]);
  const closing=useRef(false);
  const photo=active?photos[active.index]:null;

  useLayoutEffect(()=>{
    const node=preview.current;
    const image=frame.current;
    const button=opener.current;
    if(!active||!node||!image||!button)return;

    const overflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    closing.current=false;
    node.showModal();
    if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      const start=tileTransform(button.getBoundingClientRect(),image.getBoundingClientRect());
      const timing={duration:420,easing:'cubic-bezier(.2,.8,.2,1)',fill:'both'} as const;
      motion.current=[
        image.animate([{transform:start},{transform:'none'}],timing),
        node.animate([{backgroundColor:'transparent'},{backgroundColor:getComputedStyle(node).backgroundColor}],timing),
      ];
    }

    return()=>{
      motion.current.forEach(animation=>animation.cancel());
      motion.current=[];
      if(node.open)node.close();
      document.body.style.overflow=overflow;
      button.focus({preventScroll:true});
    };
  },[active]);

  function closePreview(){
    const node=preview.current;
    const image=frame.current;
    const button=opener.current;
    if(!node?.open||!image||!button||closing.current)return;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      setActive(null);
      return;
    }

    closing.current=true;
    const currentTransform=getComputedStyle(image).transform;
    const currentShade=getComputedStyle(node).backgroundColor;
    motion.current.forEach(animation=>animation.cancel());
    const destination=tileTransform(button.getBoundingClientRect(),image.getBoundingClientRect());
    const timing={duration:340,easing:'cubic-bezier(.4,0,.2,1)',fill:'both'} as const;
    const zoom=image.animate([{transform:currentTransform},{transform:destination}],timing);
    motion.current=[zoom,node.animate([{backgroundColor:currentShade},{backgroundColor:'transparent'}],timing)];
    void zoom.finished.then(()=>setActive(null),()=>{});
  }

  return <section className="gallery-section paper" aria-labelledby="gallery-heading">
    <ChapterBackground name="gallery-conservatory" />
    <header className="section-heading"><p>MOMEN KAMI</p><h2 id="gallery-heading">Gallery</h2><span className="section-ornament gold-divider" aria-hidden="true" /></header>
    <div className="gallery-grid">
      <div className="gallery-mosaic">
        {photos.map((item,index)=>{
          const frame={
            left:`${item.left}%`,top:`${item.top}cqw`,width:`${item.width}%`,aspectRatio:item.ratio,
          } as CSSProperties;
          return <figure className="gallery-photo" key={item.id} style={frame} data-previewing={active?.index===index?true:undefined}>
            <button type="button" className="gallery-photo-open" aria-haspopup="dialog"
              aria-label={`Perbesar foto ${index+1}: ${item.alt}`}
              onClick={event=>{
                opener.current=event.currentTarget;
                const thumbnail=event.currentTarget.querySelector('img')?.currentSrc||photoUrl(item.id,320);
                setActive({index,thumbnail});
              }}>
              <img src={photoUrl(item.id,320)} srcSet={photoSrcSet(item.id,[160,320])} sizes="(max-width: 430px) 47vw, 202px"
                className={item.portrait?'gallery-photo-portrait':undefined} alt={item.alt}
                width={320} height={Math.round(item.height/3)} loading="lazy" decoding="async" />
            </button>
          </figure>;
        })}
        <p className="gallery-quote" lang="en">
          One promise,<br />many stories<br />for the<br /><strong>two of us.</strong>
        </p>
      </div>
    </div>
    <dialog ref={preview} className="gallery-preview" aria-label="Pratinjau foto"
      onClose={event=>{if(!event.currentTarget.open)setActive(null);}}
      onCancel={event=>{event.preventDefault();closePreview();}}
      onClick={event=>{if(event.target===event.currentTarget)closePreview();}}>
      {active&&photo&&<>
        <button ref={frame} type="button" className="gallery-preview-frame" onClick={closePreview}
          aria-label={`Tutup pratinjau: ${photo.alt}`} style={{'--preview-ratio':960/photo.height} as CSSProperties}>
          <img src={active.thumbnail} alt={photo.alt} width={960} height={photo.height} />
          <img className="gallery-preview-detail" src={photoUrl(photo.id,960)} alt="" width={960} height={photo.height}
            decoding="async" onLoad={event=>{event.currentTarget.dataset.loaded='';}} />
        </button>
        <button type="button" className="gallery-preview-close" onClick={closePreview}>Tutup</button>
      </>}
    </dialog>
  </section>;
}
