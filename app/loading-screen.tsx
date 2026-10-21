type Props = {
  progress: number;
  phase: "loading" | "ready" | "error";
  onRetry: () => void;
  onContinue: () => void;
};

export function LoadingScreen({ progress, phase, onRetry, onContinue }: Props) {
  return <div className={`loading-screen${phase === "ready" ? " loading-screen-ready" : ""}`} role="status" aria-live="polite" aria-label="Memuat undangan">
    <div className="loading-screen-frame" aria-hidden="true" />
    <div className="loading-screen-inner">
      <div className="loading-bloom" aria-hidden="true">
        <span className="loading-bloom-orbit" />
        <img src="/artwork/loading-petals-lineart.svg" width={256} height={256} alt="" />
      </div>
      <h2>Loading...</h2>
      <div className="loading-progress" role="progressbar" aria-label="Aset undangan dimuat" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <span style={{ width: `${progress}%` }} />
      </div>
      {phase === "error" ? <>
        <p className="loading-status">Aset gagal dimuat.</p>
        <div className="loading-actions">
          <button type="button" onClick={onRetry}>Coba lagi</button>
          <button type="button" onClick={onContinue}>Lanjutkan</button>
        </div>
      </> : null}
    </div>
  </div>;
}
