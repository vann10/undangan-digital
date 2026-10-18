"use client";

import { useEffect, useRef, useState } from "react";
import { Botanical } from "./botanical";

function Monogram({ light = false }: { light?: boolean }) {
  return <div className={`monogram${light ? " monogram-light" : ""}`} aria-hidden="true"><img src="/artwork/monogram_RD_exact_illustration.svg" width={2048} height={1365} alt="" /></div>;
}

function Butterfly({ className }: { className: string }) {
  return <div className={`flutter ${className}`} aria-hidden="true"><div className="butterfly-wings"><span className="wing wing-left"/><span className="wing wing-right"/><span className="butterfly-body"/></div></div>;
}

export default function Invitation() {
  const [stage, setStage] = useState<"cover" | "opening" | "hero">("cover");
  const [motionPaused, setMotionPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => { if (stage === "hero") heading.current?.focus({ preventScroll: true }); }, [stage]);

  function openInvitation() {
    if (stage !== "cover") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setStage("opening");
    timer.current = setTimeout(() => { setStage("hero"); window.scrollTo({ top: 0, behavior: "instant" }); }, reduced ? 50 : 850);
  }

  return <div className="invitation-shell">
    <aside className="desktop-artwork" aria-hidden="true" />
    <main className={`invitation stage-${stage}${motionPaused ? " motion-paused" : ""}`}>
    {stage !== "hero" && <section className="cover paper" aria-label="Sampul undangan">
      <div className="cover-border" aria-hidden="true" />
      <div className="cover-corner cover-corner-left" aria-hidden="true"><img src="/artwork/monogram_RD_exact_illustration.svg" width={48} height={32} alt="" /></div>
      <span className="edition">PROTOTIPE · PHASE 02</span>
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
        <p className="guest-greeting">Yth. <span>[nama tamu]</span></p>
        <button className="open-button" onClick={openInvitation} disabled={stage === "opening"} aria-controls="invitation-hero">
          <span>{stage === "opening" ? "MEMBUKA UNDANGAN" : "BUKA UNDANGAN"}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-5-5 5 5-5 5"/></svg>
        </button>
        <button className="motion-toggle" type="button" aria-pressed={motionPaused} onClick={() => setMotionPaused(!motionPaused)}>{motionPaused ? "Lanjutkan animasi" : "Jeda animasi"}</button>
      </div>
      <p className="artwork-note">Nama tamu placeholder · Ilustrasi usulan, belum final</p>
    </section>}

    <section id="invitation-hero" className="hero paper" hidden={stage !== "hero"} aria-labelledby="hero-heading">
      <header className="hero-header"><span>RIZAL & DEWI</span><span>14 / 11 / 2026</span></header>
      <div className="hero-layout">
        <aside className="hero-art" aria-hidden="true"><div className="art-inset"/><Monogram light/><Botanical className="botanical hero-botanical"/></aside>
        <div className="hero-content">
          <p className="eyebrow">THE WEDDING</p>
          <h1 id="hero-heading" ref={heading} tabIndex={-1}>Rizal<br/><em>&</em> Dewi</h1>
          <div className="hero-details"><p className="wedding-date">14 November 2026</p><span className="detail-rule" aria-hidden="true"/><p className="location-pending">Lokasi menunggu konfirmasi</p></div>
          <p className="content-note">Informasi lokasi belum final.</p>
        </div>
      </div>
      <footer className="hero-footer"><span>PROTOTIPE · OPENING & HERO</span><p>Nama tamu placeholder · Ilustrasi usulan, belum final</p></footer>
    </section>
    </main>
  </div>;
}
