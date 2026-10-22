"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { Botanical } from "./botanical";
import InvitationDetails from "./invitation-details";
import { LoadingScreen } from "./loading-screen";
import { useAssetPreloader } from "./use-asset-preloader";
import { dateLabel, wedding } from "./wedding-config";

function Monogram({ light = false }: { light?: boolean }) {
  return <div className={`monogram${light ? " monogram-light" : ""}`} aria-hidden="true"><img src="/artwork/monogram_RD_exact_illustration.svg" width={2048} height={1365} alt="" /></div>;
}

function Butterfly({ className }: { className: string }) {
  return <div className={`flutter ${className}`} aria-hidden="true"><div className="butterfly-wings"><span className="wing wing-left"/><span className="wing wing-right"/><span className="butterfly-body"/></div></div>;
}

function MusicControl({ audio, playing, error, toggle, onPlaying, onPause, onError }: {
  audio: RefObject<HTMLAudioElement | null>; playing: boolean; error: string;
  toggle: () => void; onPlaying: () => void; onPause: () => void; onError: () => void;
}) {
  return <>
    <audio ref={audio} src="/audio/reverie-scott-buckley.mp3" preload="none" loop onPlay={onPlaying} onPause={onPause} onError={onError} />
    <button className="music-control" type="button" onClick={toggle} aria-label={playing ? "Hentikan musik" : "Putar musik"} aria-pressed={playing} title={playing ? "Hentikan musik" : "Putar musik"}>
      {playing ? <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="1" /></svg> : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5 19 12 8 18.5Z" /></svg>}
    </button>
    <span className="music-error" role="status">{error}</span>
  </>;
}

function PersonProfile({ person, fullName, image, alt }: { person: "Dewi" | "Rizal"; fullName: string; image: string; alt: string }) {
  const dove = person === "Dewi" ? "bride-turn" : "groom";
  const remainingName = fullName.slice(person.length).trim();
  return <article className="person-profile">
    <figure className="person-portrait">
      <img className="person-photo" src={image} alt={alt} width={1000} height={1333} loading="lazy" decoding="async" />
      <span className={`profile-dove profile-dove-${person === "Dewi" ? "bride" : "groom"}`} aria-hidden="true">
        <img src={`/artwork/perched-dove-${dove}.webp`} width={700} height={560} alt="" loading="lazy" />
      </span>
    </figure>
    <div className="person-copy">
      <h3>{person}</h3>
      <p className="person-surname">{remainingName}</p>
      <div className="person-rule" aria-hidden="true" />
      {/* Jika bio dan akun sosial diberikan, aktifkan kembali elemen ini dengan nilai dari wedding-config.ts.
          <p className="person-bio">...</p>
          <p className="person-social">...</p>
      */}
    </div>
  </article>;
}

export default function Invitation({ invitationId, accessCode }: { invitationId?: string; accessCode?: string }) {
  const assets = useAssetPreloader();
  const [loadingVisible, setLoadingVisible] = useState(true);
  const [stage, setStage] = useState<"cover" | "opening" | "hero">("cover");
  const [hydrated, setHydrated] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [musicError, setMusicError] = useState("");
  const [guestName, setGuestName] = useState("Tamu Undangan");
  const [invitationToken, setInvitationToken] = useState<string | null>(null);
  const [attendance, setAttendance] = useState<"attending" | "not_attending" | null>(null);
  const [guestCount, setGuestCount] = useState<number | null>(null);
  const [guestError, setGuestError] = useState("");
  const audio = useRef<HTMLAudioElement>(null);
  const musicStopped = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const opening = useRef(false);
  useEffect(() => { setHydrated(true); }, []);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => {
    if (assets.phase !== "ready") return;
    const timeout = window.setTimeout(() => setLoadingVisible(false), 650);
    return () => window.clearTimeout(timeout);
  }, [assets.phase]);
  useEffect(() => {
    if (!loadingVisible) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [loadingVisible]);
  useEffect(() => {
    if (!invitationId) return;
    const token = accessCode ?? window.location.hash.slice(1);
    if (!/^(?:[A-Za-z0-9_-]{43}|\d{4})$/.test(token)) { setGuestError("Tautan undangan tidak valid."); return; }
    const controller = new AbortController();
    void fetch("/api/invitation", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invitationId, invitationToken: token }), signal: controller.signal,
    }).then(async response => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Undangan belum dapat dibuka.");
      setGuestName(data.name);
      setAttendance(data.attendance);
      setGuestCount(data.guestCount);
      setInvitationToken(token);
      setGuestError("");
    }).catch(cause => { if (!controller.signal.aborted) setGuestError(cause instanceof Error ? cause.message : "Undangan belum dapat dibuka."); });
    return () => controller.abort();
  }, [invitationId, accessCode]);
  useEffect(() => { if (stage === "hero") heading.current?.focus({ preventScroll: true }); }, [stage]);

  async function startMusic(showError: boolean) {
    const player = audio.current;
    if (!player || musicStopped.current || !player.paused) return;
    try {
      player.volume = 0.45;
      await player.play();
      setMusicError("");
    } catch {
      if (showError) setMusicError("Musik tidak dapat diputar pada perangkat ini.");
    }
  }
  function toggleMusic() {
    const player = audio.current;
    if (!player) return;
    if (!player.paused) {
      musicStopped.current = true;
      player.pause();
      player.currentTime = 0;
      return;
    }
    musicStopped.current = false;
    void startMusic(true);
  }

  function openInvitation() {
    if (stage !== "cover" || opening.current || loadingVisible) return;
    opening.current = true;
    void startMusic(false);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setStage("hero"); window.scrollTo({ top: 0, behavior: "instant" }); return; }
    setStage("opening");
    timer.current = setTimeout(() => { setStage("hero"); window.scrollTo({ top: 0, behavior: "instant" }); }, 1250);
  }

  return <>
    {loadingVisible && <LoadingScreen {...assets} onRetry={assets.retry} onContinue={assets.continueAnyway} />}
    <div className="invitation-shell" inert={loadingVisible} aria-hidden={loadingVisible}>
    <aside className="desktop-artwork" aria-hidden="true" />
    <MusicControl audio={audio} playing={playing} error={musicError} toggle={toggleMusic} onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => { setPlaying(false); setMusicError("Musik tidak dapat dimuat."); }} />
    <main className={`invitation stage-${stage}`}>
    {stage !== "hero" && <section className="cover paper" aria-label="Sampul undangan">
      <div className="cover-border" aria-hidden="true" />
      <div className="cover-corner cover-corner-left" aria-hidden="true"><img src="/artwork/monogram_RD_exact_illustration.svg" width={48} height={32} alt="" /></div>
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
        <div className="fine-ornament gold-divider" aria-hidden="true" />
        <p className="guest-greeting">Yth. <span>{guestName}</span></p>
        {guestError && <p className="form-status" role="alert">{guestError}</p>}
        <button className="open-button" onClick={openInvitation} disabled={!hydrated || loadingVisible || stage === "opening"} aria-controls="invitation-hero">
          <span>{stage === "opening" ? "MEMBUKA UNDANGAN" : "BUKA UNDANGAN"}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-5-5 5 5-5 5"/></svg>
        </button>
      </div>
    </section>}

    {stage === "opening" && <div className="opening-sweep" aria-hidden="true"><img src="/artwork/page-transition-garland.webp" width={1100} height={367} alt="" /></div>}

    {stage !== "cover" && <div className="opened-pages">
    <section id="invitation-hero" className="hero paper" aria-labelledby="hero-heading">
      <div className="hero-atmosphere" aria-hidden="true" />
      <div className="hero-landscape" aria-hidden="true"><img src="/artwork/lake-landscape-review.webp" width={900} height={1350} alt="" /></div>
      <img className="hero-tree-branch hero-tree-left" src="/artwork/hero-tree-left-v1.webp" width={700} height={632} alt="" aria-hidden="true" />
      <img className="hero-tree-branch hero-tree-right" src="/artwork/hero-tree-right-v1.webp" width={700} height={700} alt="" aria-hidden="true" />
      <div className="hero-layout">
        <figure className="couple-portrait">
          <img className="portrait-photo" src="/artwork/couple-user-upload.webp" width={1000} height={1501} alt="Potret Rizal dan Dewi bersama" decoding="async" />
            <img className="portrait-ornament" src="/artwork/botanical-full-detail-display.webp" width={400} height={420} alt="" aria-hidden="true" />
        </figure>
        <div className="hero-content">
          <p className="hero-kicker">THE WEDDING OF</p>
          <h1 id="hero-heading" ref={heading} tabIndex={-1}>Rizal<br/><em>&</em> Dewi</h1>
          <div className="hero-details"><p className="wedding-date">{dateLabel}</p><div className="hero-divider gold-divider" aria-hidden="true" /></div>
        </div>
      </div>
    </section>
    <div className="page-bridge" aria-hidden="true">
      <img className="page-bridge-garland" src="/artwork/page-transition-garland.webp" width={1100} height={367} alt="" />
    </div>
    <section className="couple-page" aria-labelledby="couple-heading">
      <div className="couple-page-background" aria-hidden="true" />
      <img className="couple-floating-branch couple-floating-branch-top" src="/artwork/rd-connecting-branch-v1.webp" width={640} height={960} alt="" aria-hidden="true" loading="lazy" />
      <img className="couple-floating-branch couple-floating-branch-bottom" src="/artwork/rd-connecting-branch-v1.webp" width={640} height={960} alt="" aria-hidden="true" loading="lazy" />
      <header className="couple-page-header"><h2 id="couple-heading">Mempelai</h2><span className="gold-divider" aria-hidden="true" /></header>
      <PersonProfile person="Dewi" fullName={wedding.brideFullName} image="/artwork/brides-user-upload.webp" alt="Potret Dewi" />
      <PersonProfile person="Rizal" fullName={wedding.groomFullName} image="/artwork/bridesgroom-user-upload.webp" alt="Potret Rizal" />
    </section>
    <div className="page-bridge page-bridge-after-couple" aria-hidden="true">
      <img className="page-bridge-garland" src="/artwork/page-transition-garland.webp" width={1100} height={367} alt="" loading="lazy" />
    </div>
    <InvitationDetails identity={invitationId && invitationToken ? { invitationId, invitationToken } : null} initialAttendance={attendance} initialGuestCount={guestCount} />
    </div>}
    </main>
    </div>
  </>;
}
