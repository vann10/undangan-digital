export function photoUrl(id: string, width: number) {
  return `/artwork/photos/${id}-${width}.webp`;
}

export function photoSrcSet(id: string, widths: readonly number[]) {
  return widths.map(width => `${photoUrl(id, width)} ${width}w`).join(', ');
}
