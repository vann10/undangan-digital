"use client";

import { useEffect, useRef, useState, type RefObject, type CSSProperties } from "react";
import InvitationDetails from "./invitation-details";
import CinematicOpening from "./cinematic-opening";
import ScrollStory from "./scroll-story";
import { transitionConfig, transitionVariables } from "../transition.config";
import { wedding } from "./wedding-config";

function MusicControl({ audio, playing, error, toggle, onPlaying, onPause, onError }: {
  audio: RefObject<HTMLAudioElement | null>; playing: boolean; error: string;
  toggle: () => void; onPlaying: () => void; onPause: () => void; onError: () => void;
}) {
  return <>
    <audio ref={audio} src={transitionConfig.audio.src} preload="none" loop onPlay={onPlaying} onPause={onPause} onError={onError} />
    <button className="music-control" type="button" onClick={toggle} aria-label={playing ? "Hentikan musik" : "Putar musik"} aria-pressed={playing} title={playing ? "Hentikan musik" : "Putar musik"}>
      {playing ? <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="1" /></svg> : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5 19 12 8 18.5Z" /></svg>}
    </button>
    <span className="music-error" role="status">{error}</span>
  </>;
}

function PersonProfile({ person, fullName, image, alt }: { person: "Dewi" | "Rizal"; fullName: string; image: string; alt: string }) {
  const dove = person === "Dewi" ? "bride-turn" : "groom";
  return <article className="person-profile">
    <figure className="person-portrait">
      <img className="person-photo" src={image} alt={alt} width={1000} height={1333} loading="lazy" decoding="async" />
      <span className={`profile-dove profile-dove-${person === "Dewi" ? "bride" : "groom"}`} aria-hidden="true">
        <img src={`/artwork/perched-dove-${dove}.webp`} width={700} height={560} alt="" loading="lazy" />
      </span>
    </figure>
    <div className="person-copy">
      <h3>{fullName}</h3>
      <div className="person-rule" aria-hidden="true" />
      {/* Jika bio dan akun sosial diberikan, aktifkan kembali elemen ini dengan nilai dari wedding-config.ts.
          <p className="person-bio">...</p>
          <p className="person-social">...</p>
      */}
    </div>
  </article>;
}

export default function Invitation({ invitationId, accessCode }: { invitationId?: string; accessCode?: string }) {
  const [stage, setStage] = useState<"cover" | "hero">("cover");
  const [playing, setPlaying] = useState(false);
  const [musicError, setMusicError] = useState("");
  const [guestName, setGuestName] = useState("Tamu Undangan");
  const [invitationToken, setInvitationToken] = useState<string | null>(null);
  const [attendance, setAttendance] = useState<"attending" | "not_attending" | null>(null);
  const [guestCount, setGuestCount] = useState<number | null>(null);
  const [guestError, setGuestError] = useState("");
  const audio = useRef<HTMLAudioElement>(null);
  const musicStopped = useRef(false);
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

  async function startMusic(showError: boolean) {
    const player = audio.current;
    if (!player || musicStopped.current || !player.paused) return;
    try { await player.play(); setMusicError(""); }
    catch { if (showError) setMusicError("Musik tidak dapat diputar pada perangkat ini."); }
  }
  function toggleMusic() {
    const player = audio.current;
    if (!player) return;
    if (!player.paused) { musicStopped.current = true; player.pause(); return; }
    musicStopped.current = false;
    player.volume = transitionConfig.audio.volume;
    void startMusic(true);
  }
  return <>
    <div className="invitation-shell cinematic-shell" style={transitionVariables() as CSSProperties}>
      <aside className="desktop-wedding-background" aria-hidden="true" />
      <MusicControl audio={audio} playing={playing} error={musicError} toggle={toggleMusic} onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => { setPlaying(false); setMusicError("Musik tidak dapat dimuat."); }} />
      <main className={`invitation stage-${stage}`}>
        <CinematicOpening guestName={guestName} guestError={guestError} audio={audio} onBegin={() => { void startMusic(true); }} onFinish={() => setStage("hero")} onReset={() => setStage("cover")} />
        <ScrollStory active={stage === "hero"}>
    <section className="couple-page" aria-labelledby="couple-heading">
      <div className="couple-page-background" aria-hidden="true" />
      <img className="couple-floating-branch couple-floating-branch-top" src="/artwork/rd-connecting-branch-v1.webp" width={640} height={960} alt="" aria-hidden="true" loading="lazy" />
      <img className="couple-floating-branch couple-floating-branch-bottom" src="/artwork/rd-connecting-branch-v1.webp" width={640} height={960} alt="" aria-hidden="true" loading="lazy" />
      <header className="couple-page-header"><h2 id="couple-heading">Mempelai</h2><span className="gold-divider" aria-hidden="true" /></header>
      <PersonProfile person="Dewi" fullName={wedding.brideFullName} image="/artwork/brides-user-upload.webp" alt="Potret Dewi" />
      <PersonProfile person="Rizal" fullName={wedding.groomFullName} image="/artwork/bridesgroom-user-upload.webp" alt="Potret Rizal" />
    </section>
    <div className="page-bridge page-bridge-after-couple" aria-hidden="true">
      <img className="page-bridge-garland" src="/artwork/page-transition-garland.webp" width={1100} height={367} alt="" loading="lazy" decoding="async" />
    </div>
    <InvitationDetails identity={invitationId && invitationToken ? { invitationId, invitationToken } : null} initialAttendance={attendance} initialGuestCount={guestCount} />
    </ScrollStory>
    </main>
    </div>
  </>;
}
