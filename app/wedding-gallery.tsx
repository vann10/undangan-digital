'use client';

import {useEffect,useRef,useState} from 'react';
import {ChapterBackground} from './chapter-art';

const photos=[
  {src:'/artwork/couple-user-upload.webp',alt:'Potret Rizal dan Dewi bersama',caption:'Rizal & Dewi',width:1000,height:1501},
  {src:'/artwork/brides-user-upload.webp',alt:'Potret Dewi',caption:'Dewi Nur Alizzah',width:1000,height:1333},
  {src:'/artwork/bridesgroom-user-upload.webp',alt:'Potret Rizal',caption:'Rizal Nur Ikhsani',width:1000,height:1333},
];

export default function WeddingGallery(){
  const [active,setActive]=useState<number|null>(null);
  const dialog=useRef<HTMLDialogElement>(null);
  const open=active!==null;
  const photo=photos[active??0];
  useEffect(()=>{
    if(!open)return;
    const node=dialog.current!;
    const previousOverflow=document.body.style.overflow;
    node.showModal();
    document.body.style.overflow='hidden';
    return()=>{node.close();document.body.style.overflow=previousOverflow;};
  },[open]);
  function move(direction:number){setActive(value=>((value??0)+direction+photos.length)%photos.length);}
  return <section className="gallery-section paper" aria-labelledby="gallery-heading">
    <ChapterBackground name="gallery-conservatory" />
    <header className="section-heading"><p>MOMEN KAMI</p><h2 id="gallery-heading">Gallery</h2><span className="section-ornament gold-divider" aria-hidden="true" /></header>
    <div className="gallery-grid">{photos.map((item,index)=><figure className={`gallery-photo gallery-photo-${index+1}`} key={item.src}>
      <button type="button" className="gallery-photo-open" onClick={()=>setActive(index)} aria-label={`Lihat foto ${item.caption}`} aria-haspopup="dialog">
        <img src={item.src} alt={item.alt} width={item.width} height={item.height} loading="lazy" decoding="async" />
        <span className="gallery-view-label" aria-hidden="true">Lihat foto</span>
      </button>
      <figcaption>{item.caption}</figcaption>
    </figure>)}</div>
    <dialog ref={dialog} className="gallery-dialog" aria-label="Galeri foto Rizal dan Dewi" onClose={()=>setActive(null)} onClick={event=>{if(event.target===event.currentTarget)setActive(null);}} onKeyDown={event=>{
      if(event.key==='ArrowRight'){event.preventDefault();move(1);}
      if(event.key==='ArrowLeft'){event.preventDefault();move(-1);}
    }}>
      <div className="gallery-dialog-top"><span>Rizal &amp; Dewi</span><button type="button" onClick={()=>setActive(null)} autoFocus>Tutup</button></div>
      <figure className="gallery-dialog-photo">
        <img key={photo.src} src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} decoding="async" />
        <figcaption aria-live="polite">{photo.caption}</figcaption>
      </figure>
      <nav className="gallery-dialog-controls" aria-label="Navigasi foto">
        <button type="button" onClick={()=>move(-1)}>Sebelumnya</button><span>{(active??0)+1} / {photos.length}</span><button type="button" onClick={()=>move(1)}>Berikutnya</button>
      </nav>
    </dialog>
  </section>;
}
