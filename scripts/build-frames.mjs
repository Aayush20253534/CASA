// Builds the scroll-scrubbed hero film from extracted, graded frames.
//
// 1) ffmpeg -i source-video/hero-upscaled.mp4 -vf "select='not(mod(n\,3))',<grade>" -fps_mode vfr -q:v 2 <RAW>/%04d.jpg
// 2) node scripts/build-frames.mjs <RAW>
//
// Desktop: full 4:3 frames at 1440px (AVIF, WebP fallback). Mobile: a 3:4 portrait crop whose centre
// follows the camera (façade → entrance → doorway → room) so nothing important
// is cropped away on phones.
import sharp from 'sharp';
import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const raw = process.argv[2];
const limit = process.argv[3] && process.argv[3] !== '-' ? Number(process.argv[3]) : Infinity;
const mobileOnly = process.argv[4] === 'mobile';
const outD = path.join(root, 'public', 'frames', 'd');
const outM = path.join(root, 'public', 'frames', 'm');
await mkdir(outD, { recursive: true });
await mkdir(outM, { recursive: true });

const FPS = 24;
const STEP = 3; // every third source frame (blended on playback)

// Horizontal focus of the action over time (fraction of frame width).
const FOCUS = [[0, 0.47], [5.5, 0.47], [7.5, 0.58], [8.5, 0.62], [9.5, 0.66], [10.5, 0.56], [11.5, 0.53], [12.5, 0.58], [15.1, 0.63]];
const smooth = (u) => u * u * (3 - 2 * u);
function focusAt(t) {
  for (let i = 0; i < FOCUS.length - 1; i++) {
    const [t0, f0] = FOCUS[i];
    const [t1, f1] = FOCUS[i + 1];
    if (t <= t1) return f0 + (f1 - f0) * smooth(Math.min(1, Math.max(0, (t - t0) / (t1 - t0))));
  }
  return FOCUS[FOCUS.length - 1][1];
}

const files = (await readdir(raw)).filter((f) => f.endsWith('.jpg')).sort().slice(0, limit);
let bytesD = 0;
let bytesM = 0;

for (let i = 0; i < files.length; i++) {
  const src = path.join(raw, files[i]);
  const t = (i * STEP) / FPS;
  const { width: W, height: H } = await sharp(src).metadata();
  const name = String(i + 1).padStart(3, '0');

  const d = path.join(outD, `${name}.avif`);
  if (!mobileOnly) await sharp(src).resize({ width: 1440 }).avif({ quality: 42, effort: 4 }).toFile(d);
  if (!mobileOnly) await sharp(src).resize({ width: 1280 }).webp({ quality: 55, effort: 5 }).toFile(path.join(outD, `${name}.webp`));

  const cw = Math.round(H * 0.75);
  const left = Math.round(Math.min(W - cw, Math.max(0, focusAt(t) * W - cw / 2)));
  const m = path.join(outM, `${name}.avif`);
  const crop = () => sharp(src).extract({ left, top: 0, width: cw, height: H });
  await crop().resize({ width: 810 }).avif({ quality: 40, effort: 4 }).toFile(m);
  await crop().resize({ width: 720 }).webp({ quality: 55, effort: 5 }).toFile(path.join(outM, `${name}.webp`));

  bytesD += (await stat(d)).size;
  bytesM += (await stat(m)).size;
  if (i % 20 === 0) process.stdout.write(`${name} `);
}

const mb = (b) => (b / 1048576).toFixed(1);
console.log(`\n${files.length} frames · desktop ${mb(bytesD)} MB · mobile ${mb(bytesM)} MB`);
await writeFile(path.join(root, 'src', 'data', 'frames.json'), JSON.stringify({ count: files.length }, null, 2));
