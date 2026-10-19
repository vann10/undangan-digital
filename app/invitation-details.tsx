"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { calendarUrl, displayValue, eventDate, wedding } from "./wedding-config";

type Wish = { id: string; name: string; message: string; createdAt: string };
type Attendance = "attending" | "not_attending";

const dateLabel = "14 November 2026";

function Ornament() {
  return <img className="section-ornament" src="/artwork/ornament-review.webp" width={2172} height={724} alt="" aria-hidden="true" loading="lazy" />;
}

function SectionHeading({ eyebrow, title, id }: { eyebrow: string; title: string; id: string }) {
  return <header className="section-heading"><p>{eyebrow}</p><h2 id={id}>{title}</h2><Ornament /></header>;
}

function Countdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const update = () => setNow(Date.now());
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);
  const target = eventDate();
  const remaining = target && now ? Math.max(0, Math.floor((target.getTime() - now) / 1000)) : null;
  const values = remaining === null ? ["--", "--", "--", "--"] : [
    Math.floor(remaining / 86400), Math.floor(remaining / 3600) % 24,
    Math.floor(remaining / 60) % 60, remaining % 60,
  ].map(value => String(value).padStart(2, "0"));
  return <section className="countdown-section paper" aria-labelledby="countdown-heading">
    <SectionHeading eyebrow="MENUJU HARI BAHAGIA" title="Countdown" id="countdown-heading" />
    <div className="countdown-grid" role="timer" aria-label={remaining === null ? "Jam acara belum ditentukan" : `Hitung mundur menuju ${dateLabel}`}>
      {values.map((value, index) => <div className="countdown-unit" key={index}><span>{value}</span><small>{["Hari", "Jam", "Menit", "Detik"][index]}</small></div>)}
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
      <div><dt>Mempelai pria</dt><dd>{displayValue(wedding.groomFullName)}</dd></div>
      <div><dt>Mempelai wanita</dt><dd>{displayValue(wedding.brideFullName)}</dd></div>
      <div><dt>Ayah mempelai pria</dt><dd>{displayValue(wedding.groomFather)}</dd></div>
      <div><dt>Ibu mempelai pria</dt><dd>{displayValue(wedding.groomMother)}</dd></div>
      <div><dt>Tanggal</dt><dd>{dateLabel}</dd></div>
      <div><dt>Waktu</dt><dd>{displayValue(wedding.time)}{wedding.timeZone ? ` ${wedding.timeZone}` : ""}</dd></div>
      <div><dt>Tempat</dt><dd>{displayValue(wedding.venueName)}</dd></div>
      <div><dt>Alamat</dt><dd>{mapUrl && wedding.venueAddress ? <a className="address-link" href={mapUrl} target="_blank" rel="noopener noreferrer">{wedding.venueAddress}</a> : displayValue(wedding.venueAddress)}</dd></div>
    </dl>
    <div className="event-actions">
      {saveUrl ? <a className="outline-link" href={saveUrl} target="_blank" rel="noopener noreferrer">Simpan ke Google Calendar</a> : <p className="pending-note">Tautan kalender tersedia setelah jam dan lokasi ditetapkan.</p>}
      {mapUrl && wedding.venueAddress ? <a className="outline-link" href={mapUrl} target="_blank" rel="noopener noreferrer">Buka Google Maps</a> : <p className="pending-note">Peta lokasi tersedia setelah alamat ditetapkan.</p>}
    </div>
  </section>;
}

function Venue() {
  const mapUrl = wedding.mapsUrl?.startsWith("https://www.google.com/maps/") || wedding.mapsUrl?.startsWith("https://maps.app.goo.gl/") ? wedding.mapsUrl : null;
  return <section className="venue-section paper" aria-labelledby="venue-heading">
    <SectionHeading eyebrow="LOKASI ACARA" title="Venue" id="venue-heading" />
    <div className="venue-panel">
      {wedding.venueAddress ? <p>{wedding.venueAddress}</p> : <p>Alamat lokasi: XXX</p>}
      {mapUrl && wedding.venueAddress ? <a className="venue-link" href={mapUrl} target="_blank" rel="noopener noreferrer">Buka petunjuk arah di Google Maps</a> : <span className="pending-note">Petunjuk arah tersedia setelah lokasi ditetapkan.</span>}
    </div>
  </section>;
}

function RSVPAndWishes() {
  const [attendance, setAttendance] = useState<Attendance>("attending");
  const [guestCount, setGuestCount] = useState(1);
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [wishesError, setWishesError] = useState("");
  const [configured, setConfigured] = useState(true);
  const pendingSubmission = useRef<{ id: string; signature: string } | null>(null);
  const loadWishes = useCallback(async () => {
    try {
      const response = await fetch("/api/rsvp", { cache: "no-store" });
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

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending || !configured) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const name = String(values.get("name") || "").trim();
    const message = String(values.get("message") || "").trim();
    const count = attendance === "attending" ? guestCount : 0;
    const signature = JSON.stringify([name, attendance, count, message]);
    const submissionId = pendingSubmission.current?.signature === signature ? pendingSubmission.current.id : crypto.randomUUID();
    pendingSubmission.current = { id: submissionId, signature };
    setSending(true);
    setStatus("");
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId, name, attendance,
          guestCount: count, message,
          website: values.get("website") }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "RSVP belum terkirim.");
      setStatus("Terima kasih. Konfirmasi dan ucapan Anda telah tersimpan.");
      pendingSubmission.current = null;
      form.reset();
      setAttendance("attending");
      setGuestCount(1);
      await loadWishes();
    } catch (cause) { setStatus(cause instanceof Error ? cause.message : "RSVP belum terkirim. Coba lagi."); }
    finally { setSending(false); }
  }

  return <>
    <section className="rsvp-section paper" aria-labelledby="rsvp-heading">
      <SectionHeading eyebrow="KONFIRMASI KEHADIRAN" title="RSVP" id="rsvp-heading" />
      <form className="rsvp-form" onSubmit={submit}>
        <label>Nama lengkap<input name="name" type="text" autoComplete="name" minLength={2} maxLength={100} required disabled={!configured || sending} /></label>
        <fieldset><legend>Konfirmasi kehadiran</legend>
          <label className="radio-row"><input type="radio" name="attendance" value="attending" checked={attendance === "attending"} onChange={() => setAttendance("attending")} disabled={!configured || sending} /> Hadir</label>
          <label className="radio-row"><input type="radio" name="attendance" value="not_attending" checked={attendance === "not_attending"} onChange={() => setAttendance("not_attending")} disabled={!configured || sending} /> Tidak hadir</label>
        </fieldset>
        <label>Jumlah tamu yang hadir<input name="guestCount" type="number" min="1" max="10" value={attendance === "attending" ? guestCount : 0} onChange={event => setGuestCount(Number(event.target.value))} disabled={attendance !== "attending" || !configured || sending} required={attendance === "attending"} /></label>
        <label>Ucapan untuk Rizal & Dewi<textarea name="message" rows={5} minLength={2} maxLength={1000} required disabled={!configured || sending} /></label>
        <div className="honeypot" aria-hidden="true"><label>Website<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label></div>
        <button className="form-submit" type="submit" disabled={!configured || sending}>{sending ? "Mengirim…" : "Kirim RSVP"}</button>
        <p className="form-status" role="status" aria-live="polite">{status || (!configured ? "RSVP belum tersedia. Hubungkan Google Sheets sebelum membagikan undangan." : "")}</p>
      </form>
    </section>
    <section className="wishes-section" aria-labelledby="wishes-heading">
      <SectionHeading eyebrow="DARI PARA TAMU" title="Wedding Wishes" id="wishes-heading" />
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
    <div className="gift-card"><h3>Transfer bank</h3><p>{displayValue(wedding.bankName)}</p><strong>{displayValue(wedding.bankAccountNumber)}</strong><p>{displayValue(wedding.bankAccountName)}</p>{wedding.bankAccountNumber && <button type="button" onClick={copyAccount}>{copied ? "Tersalin" : "Salin nomor rekening"}</button>}</div>
    <div className="gift-card"><h3>Alamat pengiriman hadiah</h3><address>{displayValue(wedding.giftDeliveryAddress)}</address></div>
  </section>;
}

export default function InvitationDetails() {
  return <>
    <Countdown />
    <EventDetails />
    <Venue />
    <RSVPAndWishes />
    <Gifts />
    <footer className="closing-section" aria-label="Penutup undangan"><Ornament /><p>Terima kasih atas doa dan kehadiran Anda.</p><h2>Rizal <em>&</em> Dewi</h2><span>14 November 2026</span></footer>
  </>;
}
