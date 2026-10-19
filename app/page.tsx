"use client";

import { useEffect, useRef, useState } from "react";
import { Botanical } from "./botanical";
import InvitationDetails from "./invitation-details";

function Monogram({ light = false }: { light?: boolean }) {
  return <div className={`monogram${light ? " monogram-light" : ""}`} aria-hidden="true"><img src="/artwork/monogram_RD_exact_illustration.svg" width={2048} height={1365} alt="" /></div>;
}

function Butterfly({ className }: { className: string }) {
  return <div className={`flutter ${className}`} aria-hidden="true"><div className="butterfly-wings"><span className="wing wing-left"/><span className="wing wing-right"/><span className="butterfly-body"/></div></div>;
}

function PersonProfile({ person, image, alt }: { person: "Dewi" | "Rizal"; image: string; alt: string }) {
  const floral = person === "Dewi" ? "/artwork/rd-peony-accent-v1.webp" : "/artwork/botanical_ornament.svg";
  const floralWidth = person === "Dewi" ? 640 : 1024;
  const floralHeight = person === "Dewi" ? 640 : 1536;
  return <article className="person-profile">
    <figure className="person-portrait">
      <img className="person-photo" src={image} alt={alt} width={736} height={1308} />
      <span className={`profile-floral profile-floral-${person === "Dewi" ? "bride" : "groom"}`} aria-hidden="true">
        <img src={floral} width={floralWidth} height={floralHeight} alt="" />
      </span>
    </figure>
    <div className="person-copy">
      <h3>{person}</h3>
      <p className="person-pending">Nama lengkap {person} akan ditambahkan</p>
      <div className="person-rule" aria-hidden="true" />
      <p className="person-bio">Profil {person} akan ditambahkan.</p>
      <p className="person-social">Akun media sosial {person} akan ditambahkan.</p>
    </div>
  </article>;
}

export default function Invitation() {
  const [stage, setStage] = useState<"cover" | "opening" | "hero">("cover");
  const [motionPaused, setMotionPaused] = useState(false);
  const [guestName, setGuestName] = useState("Tamu Undangan");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const opening = useRef(false);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => {
    const name = new URLSearchParams(window.location.search).get("to")?.trim().slice(0, 80);
    if (name) setGuestName(name);
  }, []);
  useEffect(() => {
    void Promise.all([
      "/artwork/couple-user-upload.jpg",
      "/artwork/botanical_full_detail_hybrid.webp",
    ].map(src => {
      const image = new Image();
      image.src = src;
      return image.decode().catch(() => {});
    }));
  }, []);
  useEffect(() => { if (stage === "hero") heading.current?.focus({ preventScroll: true }); }, [stage]);

  function openInvitation() {
    if (stage !== "cover" || opening.current) return;
    opening.current = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setStage("hero"); window.scrollTo({ top: 0, behavior: "instant" }); return; }
    setStage("opening");
    timer.current = setTimeout(() => { setStage("hero"); window.scrollTo({ top: 0, behavior: "instant" }); }, 1250);
  }

  return <div className="invitation-shell">
    <aside className="desktop-artwork" aria-hidden="true" />
    <main className={`invitation stage-${stage}${motionPaused ? " motion-paused" : ""}`}>
    {stage !== "hero" && <section className="cover paper" aria-label="Sampul undangan">
      <div className="cover-border" aria-hidden="true" />
      <div className="cover-corner cover-corner-left" aria-hidden="true"><img src="/artwork/monogram_RD_exact_illustration.svg" width={48} height={32} alt="" /></div>
      <span className="edition">UNDANGAN PERNIKAHAN</span>
      <div className="cover-landscape" aria-hidden="true"><img src="/artwork/lake-landscape-review.webp" width={900} height={1350} alt="" /></div>
      <div className="cover-sky" aria-hidden="true"><img src="/artwork/cloud-canopy-review.webp" width={900} height={600} alt="" /></div>
      <div className="vine-frame" aria-hidden="true"><span className="vine-side vine-left"/><span className="vine-side vine-right"/><span className="vine-cross vine-top"><img src="/artwork/edge-vine-review.webp" width={467} height={1400} alt="" /></span><span className="vine-cross vine-bottom"><img src="/artwork/edge-vine-review.webp" width={467} height={1400} alt="" /></span></div>
      <Botanical className="botanical cover-botanical-left" />
      <Butterfly className="butterfly-upper" />
      <Butterfly className="butterfly-lower" />
      <Botanical className="botanical cover-top-spray" variant="spray" />
      <Botanical className="botanical cover-right-bloom" />
      <Botanical className="botanical cover-top-right" variant="spray" />
      <div className="cover-content">
        <Monogram />
        <p className="eyebrow cover-eyebrow">YOU’RE INVITED TO THE WEDDING OF</p>
        <h1 className="cover-names">Rizal <em>&</em> Dewi</h1>
        <div className="fine-ornament" aria-hidden="true"><img src="/artwork/ornament-review.webp" alt="" width={2172} height={724}/></div>
        <p className="guest-greeting">Yth. <span>{guestName}</span></p>
        <button className="open-button" onClick={openInvitation} disabled={stage === "opening"} aria-controls="invitation-hero">
          <span>{stage === "opening" ? "MEMBUKA UNDANGAN" : "BUKA UNDANGAN"}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-5-5 5 5-5 5"/></svg>
        </button>
        <button className="motion-toggle" type="button" aria-pressed={motionPaused} onClick={() => setMotionPaused(!motionPaused)}>{motionPaused ? "Lanjutkan animasi" : "Jeda animasi"}</button>
      </div>
    </section>}

    {stage === "opening" && <div className="opening-sweep" aria-hidden="true"><img src="/artwork/page-transition-garland.png" width={2172} height={724} alt="" /></div>}

    <div className="opened-pages" hidden={stage === "cover"}>
    <section id="invitation-hero" className="hero paper" aria-labelledby="hero-heading">
      <div className="hero-atmosphere" aria-hidden="true" />
      <div className="hero-landscape" aria-hidden="true"><img src="/artwork/lake-landscape-review.webp" width={900} height={1350} alt="" /></div>
      <div className="hero-layout">
        <figure className="couple-portrait">
          <img className="portrait-photo" src="/artwork/couple-user-upload.jpg" width={735} height={987} alt="Potret dua orang berdiri bersama dengan buket bunga" />
            <img className="portrait-ornament" src="/artwork/botanical_full_detail_hybrid.webp" width={1224} height={1285} alt="" aria-hidden="true" />
        </figure>
        <div className="hero-content">
          <p className="hero-kicker">THE WEDDING OF</p>
          <h1 id="hero-heading" ref={heading} tabIndex={-1}>Rizal<br/><em>&</em> Dewi</h1>
          <div className="hero-details"><p className="wedding-date">14 November 2026</p><div className="hero-divider" aria-hidden="true"><img src="/artwork/ornament-review.webp" width={2172} height={724} alt="" /></div></div>
        </div>
      </div>
    </section>
    <div className="page-bridge" aria-hidden="true">
      <img className="page-bridge-garland" src="/artwork/page-transition-garland.png" width={2172} height={724} alt="" />
      <img className="page-bridge-spray" src="/artwork/botanical-spray-review.png" width={1536} height={1024} alt="" />
    </div>
    <section className="couple-page" aria-labelledby="couple-heading">
      <div className="couple-page-background" aria-hidden="true" />
      <header className="couple-page-header"><p>RIZAL & DEWI</p><h2 id="couple-heading">Mempelai</h2><img src="/artwork/ornament-review.webp" width={2172} height={724} alt="" aria-hidden="true" /></header>
      <PersonProfile person="Dewi" image="/artwork/brides-user-upload.jpg" alt="Potret seorang wanita mengenakan gaun dan veil putih" />
      <PersonProfile person="Rizal" image="/artwork/bridesgroom-user-upload.jpg" alt="Potret seorang pria mengenakan setelan hitam" />
    </section>
    <InvitationDetails />
    </div>
    </main>
  </div>;
}
