/** Generated review artwork; not approved production art. */
export function Botanical({ className = "", variant = "ascending" }: { className?: string; variant?: "ascending" | "spray" }) {
  const fullWidth = variant === "ascending" ? 1024 : 1536;
  return <img className={className} src={`/artwork/botanical-${variant}-review.webp`} srcSet={`/artwork/botanical-${variant}-review-560.webp 560w, /artwork/botanical-${variant}-review.webp ${fullWidth}w`} sizes="(max-width: 760px) 280px, 500px" width={fullWidth} height={variant === "ascending" ? 1536 : 1024} alt="" aria-hidden="true" draggable={false} />;
}
