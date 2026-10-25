"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { calendarUrl, dateLabel, eventDate, fullDateLabel, timeLabel, wedding } from "./wedding-config";
import { ChapterBackground } from './chapter-art';
import './chapter-art.css';
import WeddingGallery from './wedding-gallery';

type Wish = { id: string; name: string; message: string; createdAt: string };
type Attendance = "attending" | "not_attending";
type Identity = { invitationId: string; invitationToken: string };

function Ornament() {
  return <span className="section-ornament gold-divider" aria-hidden="true" />;
}

function SectionHeading({ eyebrow, title, id }: { eyebrow: string; title: string; id: string }) {
  return <header className="section-heading"><p>{eyebrow}</p><h2 id={id}>{title}</h2><Ornament /></header>;
}

function OdometerDigit({ digit, active, reducedMotion }: { digit: number; active: boolean; reducedMotion: boolean }) {
  const previous = useRef<number | null>(null);
  const latest = useRef(digit);
  const introEnds = useRef(0);
  const introTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sequence = useRef(0);
  const [roll, setRoll] = useState<{ from: number; to: number; key: number; duration: number } | null>(null);
  latest.current = digit;
  useEffect(() => () => { if (introTimer.current) clearTimeout(introTimer.current); }, []);
  useEffect(() => {
    if (!active || previous.current === digit) return;
    const prior = previous.current;
    if (prior !== null && Date.now() < introEnds.current) return;
    previous.current = digit;
    sequence.current += 1;
    setRoll({
      from: prior === null ? 0 : 10 + prior,
      to: prior === null ? 10 + digit : 10 + prior - ((prior - digit + 10) % 10),
      key: sequence.current,
      duration: prior === null ? 1500 : 600,
    });
    if (prior === null && !reducedMotion) {
      introEnds.current = Date.now() + 1500;
      introTimer.current = setTimeout(() => {
        const last = previous.current;
        const current = latest.current;
        introEnds.current = 0;
        if (last === null || last === current) return;
        previous.current = current;
        sequence.current += 1;
        setRoll({ from: 10 + last, to: 10 + last - ((last - current + 10) % 10), key: sequence.current, duration: 600 });
      }, 1500);
    }
  }, [active, digit, reducedMotion]);
  return <span className="odometer-digit" data-digit={digit}>
    {roll && !reducedMotion ? <span className="odometer-strip" key={roll.key} style={{ "--odometer-from": roll.from, "--odometer-to": roll.to, "--odometer-duration": `${roll.duration}ms` } as CSSProperties}>
      {Array.from({ length: 30 }, (_, index) => <span key={index}>{index % 10}</span>)}
    </span> : digit}
  </span>;
}

function Countdown() {
  const [now, setNow] = useState<number | null>(null);
  const [active, setActive] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const grid = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const update = () => setNow(Date.now());
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);
  useEffect(() => {
    const element = grid.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setReducedMotion(true); setActive(true); return; }
    const observer = new IntersectionObserver(entries => {
      if (!entries[0]?.isIntersecting) return;
      setActive(true);
      observer.disconnect();
    }, { threshold: 0.35 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const target = eventDate();
  const remaining = target && now ? Math.max(0, Math.floor((target.getTime() - now) / 1000)) : null;
  const counts = remaining === null ? null : [
    Math.floor(remaining / 86400), Math.floor(remaining / 3600) % 24,
    Math.floor(remaining / 60) % 60, remaining % 60,
  ];
  const values = counts?.map(String) ?? ["--", "--", "--", "--"];
  const accessibleCountdown = counts ? `${counts[0]} hari, ${counts[1]} jam, ${counts[2]} menit, ${counts[3]} detik menuju ${dateLabel} pukul ${wedding.time.replace(":", ".")} WIB` : "Jam acara belum ditentukan";
  return <section className="countdown-section paper" aria-labelledby="countdown-heading">
    <SectionHeading eyebrow="MENUJU HARI BAHAGIA" title="Countdown" id="countdown-heading" />
    <div ref={grid} className="countdown-grid" role="timer" aria-label={accessibleCountdown}>
      {values.map((value, index) => <div className="countdown-unit" aria-hidden="true" key={index}><span className="countdown-number" data-value={value}>{value === "--" ? value : [...value].map((digit, position) => <OdometerDigit key={value.length - position - 1} digit={Number(digit)} active={active} reducedMotion={reducedMotion} />)}</span><small>{["Hari", "Jam", "Menit", "Detik"][index]}</small></div>)}
    </div>
    {remaining === null && <p className="pending-note">Jam acara akan diumumkan. Hitung mundur aktif setelah jam ditetapkan.</p>}
    {remaining === 0 && <p className="pending-note">Hari yang dinantikan telah tiba.</p>}
  </section>;
}

function EventDetails() {
  const saveUrl = calendarUrl();
  const mapUrl = wedding.mapsUrl?.startsWith("https://www.google.com/maps/") || wedding.mapsUrl?.startsWith("https://maps.app.goo.gl/") ? wedding.mapsUrl : null;
  return <section className="event-section" aria-labelledby="event-heading">
    <SectionHeading eyebrow="INFORMASI PERNIKAHAN" title="The Wedding" id="event-heading" />
    <div className="event-list event-prose">
      <div className="wedding-family">
        <p className="family-role">Mempelai Pria</p>
        <h3>{wedding.groomFullName}</h3>
        <p>Putra dari Bapak {wedding.groomFather} dan Ibu {wedding.groomMother}</p>
      </div>
      <div className="wedding-family">
        <p className="family-role">Mempelai Wanita</p>
        <h3>{wedding.brideFullName}</h3>
        <p>Putri dari Bapak {wedding.brideFather} dan Ibu {wedding.brideMother}</p>
      </div>
      <div className="wedding-schedule">
        <p>{fullDateLabel}</p><p>{timeLabel}</p>
        <p>{wedding.venueName}</p>
        <p>{mapUrl ? <a className="address-link" href={mapUrl} target="_blank" rel="noopener noreferrer">{wedding.venueAddress}</a> : wedding.venueAddress}</p>
      </div>
    </div>
    <div className="event-actions">
      {saveUrl && <a className="outline-link" href={saveUrl} target="_blank" rel="noopener noreferrer">Simpan ke Google Calendar</a>}
    </div>
  </section>;
}

function Venue() {
  return <section className="venue-section paper" aria-labelledby="venue-heading">
    <img className="venue-architecture" src="/artwork/section-venue-generated.webp" width={1024} height={1536} alt="" aria-hidden="true" loading="lazy" />
    <SectionHeading eyebrow="LOKASI ACARA" title="Venue" id="venue-heading" />
    <div className="venue-panel">
      <p>{wedding.venueAddress}</p>
      <iframe className="venue-map" src={wedding.mapsEmbedUrl} title={`Peta lokasi ${wedding.venueName}, ${wedding.venueAddress}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
    </div>
  </section>;
}

function RSVPAndWishes({ identity, initialAttendance, initialGuestCount }: { identity: Identity | null; initialAttendance: Attendance | null; initialGuestCount: number | null }) {
  const [attendance, setAttendance] = useState<Attendance>("attending");
  const [guestCount, setGuestCount] = useState("1");
  const [rsvpStatus, setRsvpStatus] = useState("");
  const [wishStatus, setWishStatus] = useState("");
  const [sendingRsvp, setSendingRsvp] = useState(false);
  const [sendingWish, setSendingWish] = useState(false);
  const [recordedAttendance, setRecordedAttendance] = useState<Attendance | null>(initialAttendance);
  const [recordedGuestCount, setRecordedGuestCount] = useState<number | null>(initialGuestCount);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [wishesError, setWishesError] = useState("");
  const [configured, setConfigured] = useState(true);
  const pendingWish = useRef<{ id: string; message: string } | null>(null);
  useEffect(() => {
    setRecordedAttendance(initialAttendance);
    setRecordedGuestCount(initialGuestCount);
    if (initialAttendance) setAttendance(initialAttendance);
    if (initialGuestCount && initialGuestCount > 0) setGuestCount(String(initialGuestCount));
  }, [initialAttendance, initialGuestCount]);
  const loadWishes = useCallback(async () => {
    try {
      const response = await fetch("/api/wishes", { cache: "no-store" });
      if (response.status === 503) { setConfigured(false); setWishesError("RSVP belum dihubungkan ke Google Sheets."); return; }
      if (!response.ok) throw new Error("Request failed");
      const data = await response.json();
      setWishes(data.wishes);
      setWishesError("");
      setConfigured(true);
    } catch { setWishesError("Ucapan belum dapat dimuat. Coba lagi nanti."); }
  }, []);
  useEffect(() => {
    void loadWishes();
    const interval = window.setInterval(() => { if (!document.hidden) void loadWishes(); }, 20000);
    return () => window.clearInterval(interval);
  }, [loadWishes]);

  async function submitRsvp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sendingRsvp || !configured || !identity || recordedAttendance) return;
    if (!event.currentTarget.reportValidity()) return;
    const count = attendance === "attending" ? Number(guestCount) : 0;
    setSendingRsvp(true);
    setRsvpStatus("");
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...identity, attendance, guestCount: count }),
      });
      const data = await response.json();
      if (response.status === 409 && data.attendance) {
        setRecordedAttendance(data.attendance);
        setRecordedGuestCount(data.guestCount ?? null);
      }
      if (!response.ok || !data.ok) throw new Error(data.error || "RSVP belum terkirim.");
      setRecordedAttendance(attendance);
      setRecordedGuestCount(count);
      setRsvpStatus("Terima kasih. Konfirmasi kehadiran Anda telah tersimpan dan bersifat final.");
    } catch (cause) { setRsvpStatus(cause instanceof Error ? cause.message : "RSVP belum terkirim. Coba lagi."); }
    finally { setSendingRsvp(false); }
  }

  async function submitWish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sendingWish || !configured || !identity) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const message = String(new FormData(form).get("message") || "").trim();
    const wishId = pendingWish.current?.message === message ? pendingWish.current.id : crypto.randomUUID();
    pendingWish.current = { id: wishId, message };
    setSendingWish(true);
    setWishStatus("");
    try {
      const response = await fetch("/api/wishes", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...identity, wishId, message }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Ucapan belum terkirim.");
      setWishStatus("Terima kasih. Ucapan Anda telah ditampilkan.");
      pendingWish.current = null;
      form.reset();
      await loadWishes();
    } catch (cause) { setWishStatus(cause instanceof Error ? cause.message : "Ucapan belum terkirim. Coba lagi."); }
    finally { setSendingWish(false); }
  }

  return <>
    <section className="rsvp-section paper" aria-labelledby="rsvp-heading">
      <ChapterBackground name="rsvp-correspondence" />
      <SectionHeading eyebrow="KONFIRMASI KEHADIRAN" title="RSVP" id="rsvp-heading" />
      <form className="rsvp-form" onSubmit={submitRsvp}>
        <fieldset><legend>Konfirmasi kehadiran</legend>
          <label className="radio-row"><input type="radio" name="attendance" value="attending" checked={attendance === "attending"} onChange={() => setAttendance("attending")} disabled={!configured || sendingRsvp || !identity || !!recordedAttendance} /> Hadir</label>
          <label className="radio-row"><input type="radio" name="attendance" value="not_attending" checked={attendance === "not_attending"} onChange={() => setAttendance("not_attending")} disabled={!configured || sendingRsvp || !identity || !!recordedAttendance} /> Tidak hadir</label>
        </fieldset>
        {attendance === "attending" && <label>Jumlah tamu yang hadir (termasuk Anda)
          <input type="number" name="guestCount" min={1} max={20} step={1} inputMode="numeric" value={guestCount} onChange={event => setGuestCount(event.target.value)} required disabled={!configured || sendingRsvp || !identity || !!recordedAttendance} />
        </label>}
        <button className="form-submit" type="submit" disabled={!configured || sendingRsvp || !identity || !!recordedAttendance}>{sendingRsvp ? "Mengirim…" : "Kirim RSVP"}</button>
        <p className="form-status" role="status" aria-live="polite">{rsvpStatus || (recordedAttendance ? `Konfirmasi Anda sudah tercatat: ${recordedAttendance === "attending" ? `Hadir${recordedGuestCount ? ` (${recordedGuestCount} tamu)` : ""}` : "Tidak hadir"}. Respons ini bersifat final.` : !identity ? "Buka tautan undangan pribadi yang valid untuk mengirim RSVP." : !configured ? "RSVP belum tersedia. Hubungkan Google Sheets sebelum membagikan undangan." : "")}</p>
      </form>
    </section>
    <WeddingGallery />
    <section className="wishes-section" aria-labelledby="wishes-heading">
      <SectionHeading eyebrow="DARI PARA TAMU" title="Wedding Wishes" id="wishes-heading" />
      <form className="rsvp-form" onSubmit={submitWish}>
        <label>Ucapan untuk Rizal & Dewi<textarea name="message" rows={5} minLength={2} maxLength={1000} placeholder="Tulis doa dan ucapan untuk Rizal & Dewi…" required disabled={!configured || sendingWish || !identity} /></label>
        <button className="form-submit" type="submit" disabled={!configured || sendingWish || !identity}>{sendingWish ? "Mengirim…" : "Kirim ucapan"}</button>
        <p className="form-status" role="status" aria-live="polite">{wishStatus || (identity ? "Setiap tamu dapat mengirim satu ucapan. Ucapan langsung tampil setelah tersimpan." : "")}</p>
      </form>
      {wishesError && <p className="pending-note" role="status">{wishesError}</p>}
      {!wishesError && wishes.length === 0 && <p className="pending-note">Ucapan para tamu akan tampil di sini.</p>}
      <div className="wishes-list" aria-live="polite">{wishes.map(wish => <blockquote className="wish-card" key={wish.id}><p>“{wish.message}”</p><cite>{wish.name}</cite></blockquote>)}</div>
    </section>
  </>;
}

function Gifts() {
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [activeAccount, setActiveAccount] = useState(0);
  const carousel = useRef<HTMLDivElement>(null);
  async function copyAccount(number: string) {
    try { await navigator.clipboard.writeText(number); setCopiedAccount(number); }
    catch { setCopiedAccount(null); }
  }
  function goToAccount(index: number) {
    const track = carousel.current;
    const slide = track?.children[index] as HTMLElement | undefined;
    if (!track || !slide) return;
    const trackBox = track.getBoundingClientRect();
    const slideBox = slide.getBoundingClientRect();
    const left = track.scrollLeft + slideBox.left - trackBox.left - (trackBox.width - slideBox.width) / 2;
    track.scrollTo({ left, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    setActiveAccount(index);
  }
  function updateActiveAccount() {
    const track = carousel.current;
    if (!track) return;
    const middle = track.getBoundingClientRect().left + track.clientWidth / 2;
    const slides = Array.from(track.children) as HTMLElement[];
    const closest = slides.reduce((best, slide, index) =>
      Math.abs(slide.getBoundingClientRect().left + slide.clientWidth / 2 - middle) <
      Math.abs(slides[best].getBoundingClientRect().left + slides[best].clientWidth / 2 - middle) ? index : best, 0);
    setActiveAccount(closest);
  }
  return <section className="gift-section paper" aria-labelledby="gift-heading">
    <SectionHeading eyebrow="TANDA KASIH" title="Wanna give us some gifts?" id="gift-heading" />
    <h3 className="gift-carousel-heading">Transfer bank</h3>
    <div className="bank-carousel" ref={carousel} onScroll={updateActiveAccount} role="region" aria-roledescription="carousel" aria-label="Pilihan rekening transfer">
    {wedding.bankAccounts.map((account, index) => <div className={`bank-slide${activeAccount === index ? " bank-slide-active" : ""}`} key={account.number} role="group" aria-roledescription="slide" aria-label={`${index + 1} dari ${wedding.bankAccounts.length}: ${account.bank}`}>
      <div className="bank-debit-card" aria-label={`Rekening ${account.bank} atas nama ${account.holder}`}>
        <div className="bank-card-top"><span className="bank-brand">{account.bank}</span><span className="bank-card-type">DEBIT</span></div>
        <div className="bank-card-middle">
          <span className="bank-chip" aria-hidden="true"><span /></span>
          <svg className="bank-contactless" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 9a5 5 0 0 1 0 6M10 6a9 9 0 0 1 0 12M14 3a13 13 0 0 1 0 18" /></svg>
        </div>
        <div className="bank-card-details"><span>NO. REKENING</span><strong>{account.number}</strong><p>{account.holder}</p></div>
      </div>
      <button className="bank-copy" type="button" onClick={() => void copyAccount(account.number)}>{copiedAccount === account.number ? "Tersalin" : "Salin nomor rekening"}</button>
    </div>)}
    </div>
    <div className="bank-carousel-controls" aria-label="Navigasi rekening">
      <button type="button" onClick={() => goToAccount(activeAccount - 1)} disabled={activeAccount === 0} aria-label="Rekening sebelumnya">‹</button>
      <span aria-live="polite">{activeAccount + 1} / {wedding.bankAccounts.length}</span>
      <button type="button" onClick={() => goToAccount(activeAccount + 1)} disabled={activeAccount === wedding.bankAccounts.length - 1} aria-label="Rekening berikutnya">›</button>
    </div>
    <div className="gift-card"><h3>Alamat pengiriman hadiah</h3><address>{wedding.giftDeliveryAddress}</address></div>
  </section>;
}

export default function InvitationDetails({ identity, initialAttendance, initialGuestCount }: { identity: Identity | null; initialAttendance: Attendance | null; initialGuestCount: number | null }) {
  return <>
    <Countdown />
    <EventDetails />
    <Venue />
    <RSVPAndWishes identity={identity} initialAttendance={initialAttendance} initialGuestCount={initialGuestCount} />
    <Gifts />
    <footer className="closing-section" aria-label="Penutup undangan">
      <ChapterBackground name="footer-wedding-arch" />
      <picture className="closing-monogram" aria-hidden="true"><source srcSet="/transition/monogram@1x.webp 1x, /transition/monogram.webp 2x" type="image/webp" /><img src="/transition/monogram.png" width={400} height={400} alt="" loading="lazy" decoding="async" /></picture>
      <div className="closing-copy"><Ornament /><p className="closing-thanks">Terima kasih atas doa<br />dan kehadiran Anda.</p>
        <h2 className="closing-names" aria-label={`${wedding.groom} dan ${wedding.bride}`}>
          <span className="closing-name closing-name-groom" aria-hidden="true">{wedding.groom}</span>
          <em className="closing-name-ampersand" aria-hidden="true">&amp;</em>
          <span className="closing-name closing-name-bride" aria-hidden="true">{wedding.bride}</span>
        </h2>
      </div>
    </footer>
  </>;
}
