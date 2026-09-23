// Converts the source photography in /image into graded, responsive AVIF + WebP
// files under /public/images, extracts the logo mark as a tintable alpha mask,
// and writes src/data/images.json (widths + intrinsic size per image).
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const srcDir = path.join(root, 'image');
const outDir = path.join(root, 'public', 'images');
const LOGO = path.join(root, 'source-assets', 'logo.png');

const sources = {
  exterior: 'ChatGPT Image Sep 24, 2026, 12_50_28 AM.png',
  'room-classic': 'ChatGPT Image Sep 24, 2026, 12_25_47 AM.png',
  'room-grand': 'ChatGPT Image Sep 24, 2026, 12_51_46 AM.png',
  'room-garden': 'ChatGPT Image Sep 24, 2026, 01_03_25 AM.png',
  'hall-soiree': 'ChatGPT Image Sep 24, 2026, 01_03_30 AM.png',
  'hall-grand': 'ChatGPT Image Sep 24, 2026, 12_51_53 AM.png',
  // Upper part of the bathroom photo: rain shower, marble and the amenity shelf.
  'bath-detail': { file: 'ChatGPT Image Sep 24, 2026, 01_14_46 AM.png', extract: { left: 0, top: 0, width: 1086, height: 660 } },
  corridor: 'ChatGPT Image Sep 24, 2026, 01_14_52 AM.png',
};

const TARGET_WIDTHS = [640, 1080, 1600];

await mkdir(outDir, { recursive: true });
const manifest = {};

for (const [name, src] of Object.entries(sources)) {
  const { file, extract } = typeof src === 'string' ? { file: src } : src;
  const input = path.join(srcDir, file);
  const meta = extract ? { width: extract.width, height: extract.height } : await sharp(input).metadata();
  const widths = [...new Set(TARGET_WIDTHS.map((w) => Math.min(w, meta.width)))];

  // Quiet-luxury grade: pull saturation back, lift warmth very slightly.
  const graded = () =>
    (extract ? sharp(input).extract(extract) : sharp(input))
      .modulate({ saturation: 0.84, brightness: 1.01 })
      .linear([1.02, 1.0, 0.96], [2, 1, -2]);

  for (const w of widths) {
    const base = path.join(outDir, `${name}-${w}`);
    await graded().resize({ width: w }).avif({ quality: 52, effort: 5 }).toFile(`${base}.avif`);
    await graded().resize({ width: w }).webp({ quality: 74, effort: 5 }).toFile(`${base}.webp`);
  }
  manifest[name] = { widths, width: meta.width, height: meta.height };
  console.log(`✓ ${name} ${meta.width}×${meta.height} → ${widths.join(', ')}`);
}

// Logo → white alpha mask (the coloured strokes become opaque, black/white ground drops out).
const { data, info } = await sharp(LOGO).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const px = Buffer.alloc(info.width * info.height * 4);
for (let i = 0; i < info.width * info.height; i++) {
  const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
  const sat = Math.max(r, g, b) - Math.min(r, g, b);
  const a = Math.max(0, Math.min(255, (sat - 70) * 2.4));
  px[i * 4] = 255; px[i * 4 + 1] = 255; px[i * 4 + 2] = 255; px[i * 4 + 3] = a;
}
const mask = await sharp(px, { raw: { width: info.width, height: info.height, channels: 4 } })
  .trim()
  .resize({ width: 256 })
  .png({ compressionLevel: 9 })
  .toBuffer();
await writeFile(path.join(outDir, 'logo-mark.png'), mask);

// Favicons: ivory mark on deep forest.
const tint = async (hex, size) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const { data: m, info: mi } = await sharp(mask).resize({ width: size }).raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < mi.width * mi.height; i++) { m[i * 4] = r; m[i * 4 + 1] = g; m[i * 4 + 2] = b; }
  return sharp(m, { raw: { width: mi.width, height: mi.height, channels: 4 } }).png().toBuffer();
};
for (const [size, file] of [[64, 'favicon.png'], [180, 'apple-touch-icon.png']]) {
  const inner = Math.round(size * 0.72);
  await sharp({ create: { width: size, height: size, channels: 4, background: '#243B32' } })
    .composite([{ input: await tint('#F8F6F1', inner), gravity: 'center' }])
    .png()
    .toFile(path.join(root, 'public', file));
}

await writeFile(path.join(root, 'src', 'data', 'images.json'), JSON.stringify(manifest, null, 2));
console.log('✓ logo mask, favicons, manifest');
