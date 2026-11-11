import { wedding } from "./wedding-config";
import "./invitation-notice.css";

type Props = {
  state?: "invalid" | "loading" | "unavailable";
  message?: string;
  onRetry?: () => void;
};

function Envelope() {
  return <div className="notice-envelope" aria-hidden="true">
    <img className="notice-envelope-sprig" src="/artwork/botanical-spray-review-560.webp" alt="" width="560" height="373" />
    <svg viewBox="0 0 360 260" fill="none" focusable="false">
      <path d="m60 73 233-13 9 145-233 13z" fill="#eee7d7" stroke="#b79a68" strokeWidth=".8" />
      <path d="m74 61 232 13-8 147-232-13z" fill="#faf6ed" stroke="#b79a68" strokeWidth=".8" />
      <path d="M48 85h264v146H48z" fill="#f1eadb" stroke="#a98e60" />
      <path d="m48 85 132 99L312 85" fill="#e7deca" />
      <path d="m48 231 99-85q33-24 66 0l99 85" fill="#f7f1e5" stroke="#c1ad88" strokeWidth=".8" />
      <path d="m48 85 121 95q11 9 22 0L312 85Z" fill="#fcf8ef" stroke="#b79a68" />
      <path d="m57 91 114 88q9 7 18 0l114-88M54 224l88-75m164 75-88-75" stroke="#d7c8a9" strokeWidth=".7" />
      <path d="M158 174c-8-12 2-30 14-28 14-9 28 0 29 11 11 12 3 30-10 31-15 10-32 0-33-14Z" fill="#b79a68" stroke="#90713e" />
      <circle cx="180" cy="167" r="19" fill="#c6ac79" stroke="#ead8af" strokeWidth=".8" />
      <circle cx="180" cy="167" r="15.5" stroke="#947444" strokeWidth=".6" />
      <text x="180" y="173" textAnchor="middle" fill="#695431" fontFamily="Cormorant Garamond, Georgia, serif" fontSize="18" fontStyle="italic">RD</text>
    </svg>
    <img className="notice-envelope-flower" src="/artwork/botanical-spray-review-560.webp" alt="" width="560" height="373" />
  </div>;
}

export default function InvitationNotice({ state = "invalid", message, onRetry }: Props) {
  const title = state === "loading" ? "Menyiapkan Undangan"
    : state === "unavailable" ? "Undangan Belum Dapat Dibuka" : "Tautan Undangan Tidak Valid";
  const description = state === "loading" ? "Mohon tunggu sejenak, kami sedang memeriksa tautan undangan Anda."
    : state === "unavailable" ? message : "Silakan buka kembali tautan undangan yang dikirimkan kepada Anda.";

  return <div className="invitation-notice" data-state={state}>
    <main className="notice-paper" aria-labelledby="notice-title" aria-busy={state === "loading"}>
      <div className="notice-frame" aria-hidden="true" />
      <img className="notice-botanical notice-botanical-top" src="/artwork/botanical-spray-review-560.webp" width="560" height="373" alt="" aria-hidden="true" />
      <img className="notice-botanical notice-botanical-bottom" src="/artwork/botanical-ascending-review-560.webp" width="560" height="840" alt="" aria-hidden="true" />
      <div className="notice-content">
        <p className="notice-eyebrow">Undangan Pernikahan</p>
        <Envelope />
        <h1 id="notice-title">{title}</h1>
        <div className="notice-divider" aria-hidden="true"><span /><svg viewBox="0 0 30 14" fill="none"><path d="M1 7h28M15 7q-8-11-12-3 5 7 12 3Zm0 0q8 11 12 3-5-7-12-3Z" stroke="currentColor" strokeWidth=".8" /></svg><span /></div>
        <p className="notice-description" role={state === "loading" ? "status" : undefined}>{description}</p>
        {state === "unavailable" && onRetry && <button className="notice-retry" type="button" onClick={onRetry}>Coba lagi</button>}
        <p className="notice-signature">{wedding.groom} <em>&amp;</em> {wedding.bride}</p>
      </div>
    </main>
  </div>;
}
