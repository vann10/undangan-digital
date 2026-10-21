"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { calendarUrl, dateLabel, eventDate, fullDateLabel, timeLabel, wedding } from "./wedding-config";

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
  const sequence = useRef(0);
  const [roll, setRoll] = useState<{ from: number; to: number; key: number } | null>(null);
  useEffect(() => {
    if (!active || previous.current === digit) return;
    const prior = previous.current;
    previous.current = digit;
    if (prior === null) return;
    sequence.current += 1;
    setRoll({
      from: 10 + prior,
      to: 10 + prior - ((prior - digit + 10) % 10),
      key: sequence.current,
    });
  }, [active, digit]);
  return <span className="odometer-digit" data-digit={digit}>
    {roll && !reducedMotion ? <span className="odometer-strip" key={roll.key} style={{ "--odometer-from": roll.from, "--odometer-to": roll.to } as CSSProperties}>
      {Array.from({ length: 30 }, (_, index) => <span key={index}>{index % 10}</span>)}
    </span> : digit}
  </span>;
}

function Countdown() {
  const [now, setNow] = useState<number | null>(null);
  const [active, setActive] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const [introNumbers, setIntroNumbers] = useState(["83", "47", "96", "58"]);
  const [introTick, setIntroTick] = useState(0);
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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setReducedMotion(true); setActive(true); setIntroVisible(false); return; }
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
  useEffect(() => {
    if (!active || reducedMotion || !introVisible) return;
    const interval = window.setInterval(() => {
      setIntroNumbers(previous => previous.map(old => {
        let next = old;
        while (next === old) next = String(10 + Math.floor(Math.random() * 90));
        return next;
      }));
      setIntroTick(tick => tick + 1);
    }, 10);
    const timeout = window.setTimeout(() => setIntroVisible(false), 2800);
    return () => { window.clearInterval(interval); window.clearTimeout(timeout); };
  }, [active, reducedMotion, introVisible]);
  const values = counts?.map(String) ?? ["--", "--", "--", "--"];
  const accessibleCountdown = counts ? `${counts[0]} hari, ${counts[1]} jam, ${counts[2]} menit, ${counts[3]} detik menuju ${dateLabel} pukul ${wedding.time.replace(":", ".")} WIB` : "Jam acara belum ditentukan";
  return <section className="countdown-section paper" aria-labelledby="countdown-heading">
    <SectionHeading eyebrow="MENUJU HARI BAHAGIA" title="Countdown" id="countdown-heading" />
    <div ref={grid} className="countdown-grid" role="timer" aria-label={accessibleCountdown}>
      {values.map((value, index) => <div className="countdown-unit" aria-hidden="true" key={index}><span className="countdown-number" data-value={value}>{value === "--" ? value : [...value].map((digit, position) => <OdometerDigit key={value.length - position - 1} digit={Number(digit)} active={active} reducedMotion={reducedMotion} />)}{introVisible && value !== "--" && <span className="countdown-intro" data-intro-value={introNumbers[index]}>{[...introNumbers[index]].map((digit, position) => <span className="countdown-intro-digit" key={`${introTick}-${position}`}>{digit}</span>)}</span>}</span><small>{["Hari", "Jam", "Menit", "Detik"][index]}</small></div>)}
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
    <div className="event-rule" aria-hidden="true" />
    <dl className="event-list">
      <div><dt>Mempelai pria</dt><dd>{wedding.groomFullName}</dd></div>
      <div><dt>Mempelai wanita</dt><dd>{wedding.brideFullName}</dd></div>
      <div><dt>Ayah mempelai pria</dt><dd>{wedding.groomFather}</dd></div>
      <div><dt>Ibu mempelai pria</dt><dd>{wedding.groomMother}</dd></div>
      <div><dt>Orang tua mempelai wanita</dt><dd>{wedding.brideParents}</dd></div>
      <div><dt>Tanggal</dt><dd>{fullDateLabel}</dd></div>
      <div><dt>Waktu</dt><dd>{timeLabel}</dd></div>
      <div><dt>Tempat</dt><dd>{wedding.venueName}</dd></div>
      <div><dt>Alamat</dt><dd>{mapUrl ? <a className="address-link" href={mapUrl} target="_blank" rel="noopener noreferrer">{wedding.venueAddress}</a> : wedding.venueAddress}</dd></div>
    </dl>
    <div className="event-actions">
      {saveUrl && <a className="outline-link" href={saveUrl} target="_blank" rel="noopener noreferrer">Simpan ke Google Calendar</a>}
      {mapUrl && <a className="outline-link" href={mapUrl} target="_blank" rel="noopener noreferrer">Buka Google Maps</a>}
    </div>
  </section>;
}

function Venue() {
  const mapUrl = wedding.mapsUrl?.startsWith("https://www.google.com/maps/") || wedding.mapsUrl?.startsWith("https://maps.app.goo.gl/") ? wedding.mapsUrl : null;
  return <section className="venue-section paper" aria-labelledby="venue-heading">
    <img className="venue-architecture" src="/artwork/section-venue-generated.webp" width={1024} height={1536} alt="" aria-hidden="true" loading="lazy" />
    <SectionHeading eyebrow="LOKASI ACARA" title="Venue" id="venue-heading" />
    <div className="venue-panel">
      <p>{wedding.venueAddress}</p>
      {mapUrl && <a className="venue-link" href={mapUrl} target="_blank" rel="noopener noreferrer">Buka petunjuk arah di Google Maps</a>}
    </div>
  </section>;
}

function Gallery() {
  const photos = [
    { src: "/artwork/couple-user-upload.jpg", alt: "Rizal dan Dewi berfoto bersama dengan buket bunga", width: 735, height: 987 },
    { src: "/artwork/brides-user-upload.jpg", alt: "Potret Dewi mengenakan gaun dan veil putih", width: 736, height: 1308 },
    { src: "/artwork/bridesgroom-user-upload.jpg", alt: "Potret Rizal mengenakan setelan hitam", width: 736, height: 1308 },
  ];
  return <section className="gallery-section paper" aria-labelledby="gallery-heading">
    <SectionHeading eyebrow="MOMEN KAMI" title="Gallery" id="gallery-heading" />
    <div className="gallery-grid">{photos.map((photo, index) => <figure className={`gallery-photo gallery-photo-${index + 1}`} key={photo.src}>
      <img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" />
    </figure>)}</div>
  </section>;
}

function RSVPAndWishes({ identity, initialAttendance }: { identity: Identity | null; initialAttendance: Attendance | null }) {
  const [attendance, setAttendance] = useState<Attendance>("attending");
  const [rsvpStatus, setRsvpStatus] = useState("");
  const [wishStatus, setWishStatus] = useState("");
  const [sendingRsvp, setSendingRsvp] = useState(false);
  const [sendingWish, setSendingWish] = useState(false);
  const [recordedAttendance, setRecordedAttendance] = useState<Attendance | null>(initialAttendance);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [wishesError, setWishesError] = useState("");
  const [configured, setConfigured] = useState(true);
  const pendingWish = useRef<{ id: string; message: string } | null>(null);
  useEffect(() => {
    setRecordedAttendance(initialAttendance);
    if (initialAttendance) setAttendance(initialAttendance);
  }, [initialAttendance]);
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
    setSendingRsvp(true);
    setRsvpStatus("");
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...identity, attendance }),
      });
      const data = await response.json();
      if (response.status === 409 && data.attendance) setRecordedAttendance(data.attendance);
      if (!response.ok || !data.ok) throw new Error(data.error || "RSVP belum terkirim.");
      setRecordedAttendance(attendance);
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
      <SectionHeading eyebrow="KONFIRMASI KEHADIRAN" title="RSVP" id="rsvp-heading" />
      <form className="rsvp-form" onSubmit={submitRsvp}>
        <fieldset><legend>Konfirmasi kehadiran</legend>
          <label className="radio-row"><input type="radio" name="attendance" value="attending" checked={attendance === "attending"} onChange={() => setAttendance("attending")} disabled={!configured || sendingRsvp || !identity || !!recordedAttendance} /> Hadir</label>
          <label className="radio-row"><input type="radio" name="attendance" value="not_attending" checked={attendance === "not_attending"} onChange={() => setAttendance("not_attending")} disabled={!configured || sendingRsvp || !identity || !!recordedAttendance} /> Tidak hadir</label>
        </fieldset>
        <button className="form-submit" type="submit" disabled={!configured || sendingRsvp || !identity || !!recordedAttendance}>{sendingRsvp ? "Mengirim…" : "Kirim RSVP"}</button>
        <p className="form-status" role="status" aria-live="polite">{rsvpStatus || (recordedAttendance ? `Konfirmasi Anda sudah tercatat: ${recordedAttendance === "attending" ? "Hadir" : "Tidak hadir"}. Respons ini bersifat final.` : !identity ? "Buka tautan undangan pribadi yang valid untuk mengirim RSVP." : !configured ? "RSVP belum tersedia. Hubungkan Google Sheets sebelum membagikan undangan." : "")}</p>
      </form>
    </section>
    <Gallery />
    <section className="wishes-section" aria-labelledby="wishes-heading">
      <SectionHeading eyebrow="DARI PARA TAMU" title="Wedding Wishes" id="wishes-heading" />
      <form className="rsvp-form" onSubmit={submitWish}>
        <label>Ucapan untuk Rizal & Dewi<textarea name="message" rows={5} minLength={2} maxLength={1000} required disabled={!configured || sendingWish || !identity} /></label>
        <button className="form-submit" type="submit" disabled={!configured || sendingWish || !identity}>{sendingWish ? "Mengirim…" : "Kirim ucapan"}</button>
        <p className="form-status" role="status" aria-live="polite">{wishStatus || (!identity ? "Buka tautan undangan pribadi yang valid untuk mengirim ucapan." : "Setiap tamu dapat mengirim satu ucapan. Ucapan langsung tampil setelah tersimpan.")}</p>
      </form>
      {wishesError && <p className="pending-note" role="status">{wishesError}</p>}
      {!wishesError && wishes.length === 0 && <p className="pending-note">Ucapan para tamu akan tampil di sini.</p>}
      <div className="wishes-list" aria-live="polite">{wishes.map(wish => <blockquote className="wish-card" key={wish.id}><p>“{wish.message}”</p><cite>{wish.name}</cite></blockquote>)}</div>
    </section>
  </>;
}

function Gifts() {
  const [copied, setCopied] = useState(false);
  async function copyAccount() {
    if (!wedding.bankAccountNumber) return;
    try { await navigator.clipboard.writeText(wedding.bankAccountNumber); setCopied(true); }
    catch { setCopied(false); }
  }
  return <section className="gift-section paper" aria-labelledby="gift-heading">
    <SectionHeading eyebrow="TANDA KASIH" title="Wanna give us some gifts?" id="gift-heading" />
    <div className="gift-card bank-transfer-card">
      <h3>Transfer bank</h3>
      <div className="bri-debit-card" aria-label={`Rekening ${wedding.bankName} atas nama ${wedding.bankAccountName}`}>
        <div className="bri-card-top"><span className="bri-brand">BRI</span><span className="bri-card-type">DEBIT</span></div>
        <div className="bri-card-middle">
          <span className="bri-chip" aria-hidden="true"><span /></span>
          <svg className="bri-contactless" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 9a5 5 0 0 1 0 6M10 6a9 9 0 0 1 0 12M14 3a13 13 0 0 1 0 18" /></svg>
        </div>
        <div className="bri-card-details"><span>NO. REKENING</span><strong>{wedding.bankAccountNumber}</strong><p>{wedding.bankAccountName}</p></div>
      </div>
      <button type="button" onClick={copyAccount}>{copied ? "Tersalin" : "Salin nomor rekening"}</button>
    </div>
    <div className="gift-card"><h3>Alamat pengiriman hadiah</h3><address>{wedding.giftDeliveryAddress}</address></div>
  </section>;
}

export default function InvitationDetails({ identity, initialAttendance }: { identity: Identity | null; initialAttendance: Attendance | null }) {
  return <>
    <Countdown />
    <EventDetails />
    <Venue />
    <RSVPAndWishes identity={identity} initialAttendance={initialAttendance} />
    <Gifts />
    <footer className="closing-section" aria-label="Penutup undangan"><Ornament /><p>Terima kasih atas doa dan kehadiran Anda.</p><h2>Rizal <em>&</em> Dewi</h2><span>{dateLabel}</span></footer>
  </>;
}
