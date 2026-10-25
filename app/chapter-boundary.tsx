import './chapter-boundary.css';

type ChapterTheme = 'event' | 'rsvp' | 'wishes' | 'footer';

const artwork: Record<ChapterTheme, { src: string; width: number; height: number }> = {
  event: { src: '/chapter-art/boundaries/event-v1.webp', width: 1200, height: 800 },
  rsvp: { src: '/chapter-art/boundaries/rsvp-v1.webp', width: 1200, height: 400 },
  wishes: { src: '/chapter-art/boundaries/wishes-v1.webp', width: 1200, height: 400 },
  footer: { src: '/chapter-art/boundaries/footer-v1.webp', width: 1200, height: 401 },
};

/** Each even chapter owns both edges; the final edge stays within the footer. */
export function ChapterBoundary({ theme, edge, terminal = false }: {
  theme: ChapterTheme;
  edge: 'top' | 'bottom';
  terminal?: boolean;
}) {
  const asset = artwork[theme];
  return <div className={`chapter-boundary chapter-boundary-${theme} chapter-boundary-${edge}${terminal ? ' chapter-boundary-terminal' : ''}`} aria-hidden="true" data-chapter={theme} data-edge={edge}>
    <span className="chapter-boundary-art" style={{ aspectRatio: `${asset.width} / ${asset.height / 2}` }}>
      <img src={asset.src} width={asset.width} height={asset.height} alt="" loading="lazy" decoding="async" />
    </span>
  </div>;
}
