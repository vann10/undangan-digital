import sharp from 'sharp';
import { mkdir, copyFile, writeFile } from 'node:fs/promises';

const sourceDir = 'C:/Users/vann/.codex/generated_images/01a16edd-dd03-7f33-b890-ccc1a44a2a14';
const files = {
  event: 'exec-6a637bbf-e0de-468e-8fc8-45100166c189.png',
  rsvp: 'exec-7dbe22a5-975a-4ff2-8f36-605160134802.png',
  wishes: 'exec-b9827ced-288a-44be-adbe-6b8adbe9c37a.png',
  footer: 'exec-280b41e0-0c5b-47d1-be46-5f050f9087a0.png',
};
await mkdir('public/chapter-art/boundaries', { recursive: true });
await mkdir('artifacts/page-boundaries/generated', { recursive: true });
const manifest = {};
for (const [theme, name] of Object.entries(files)) {
  const input = `${sourceDir}/${name}`;
  await copyFile(input, `artifacts/page-boundaries/generated/${theme}-v1.png`);
  const path = `public/chapter-art/boundaries/${theme}-v1.webp`;
  const meta = await sharp(input).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 86, alphaQuality: 100 }).toFile(path);
  const stats = await sharp(path).stats();
  manifest[theme] = { src: `/${path.slice(7)}`, width: meta.width, height: meta.height, bytes: meta.size, alphaMin: stats.channels[3]?.min };
  await sharp(path).flatten({ background: '#faf7f1' }).jpeg({ quality: 90 }).toFile(`artifacts/page-boundaries/generated/${theme}-on-paper.jpg`);
}
await writeFile('artifacts/page-boundaries/generated/manifest.json', JSON.stringify(manifest, null, 2));
console.log(JSON.stringify(manifest, null, 2));
