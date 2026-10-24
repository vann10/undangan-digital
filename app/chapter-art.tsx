export function ChapterBackground({name}:{name:string}) {
  return <picture className="chapter-background" aria-hidden="true"><source srcSet={`/chapter-art/${name}@1x.webp 1x, /chapter-art/${name}.webp 2x`} type="image/webp" />
    <img src={`/chapter-art/${name}.png`} width={800} height={1200} alt="" loading="lazy" decoding="async" />
  </picture>;
}
