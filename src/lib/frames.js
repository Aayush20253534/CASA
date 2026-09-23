// Scroll-scrubbed image sequence.
// Compressed frames are fetched once (by priority, so scrubbing works early);
// only a window of frames around the playhead is kept decoded as ImageBitmaps,
// which keeps memory modest on phones.

const AVIF_PROBE =
  'data:image/avif;base64,AAAAHGZ0eXBhdmlmAAAAAG1pZjFhdmlmbWlhZgAAANZtZXRhAAAAAAAAACFoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAAAAAACJpbG9jAAAAAERAAAEAAQAAAAAA+gABAAAAAAAAAB0AAAAjaWluZgAAAAAAAQAAABVpbmZlAgAAAAABAABhdjAxAAAAAA5waXRtAAAAAAABAAAAVmlwcnAAAAA4aXBjbwAAAAxhdjFDgSACAAAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAABZpcG1hAAAAAAAAAAEAAQOBAgMAAAAlbWRhdBIACgc4ADaQENBpMhAcQmLk4AAWAACQNY48fohQ';

let avifSupport;
export function supportsAvif() {
  avifSupport ??= new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img.width > 0);
    img.onerror = () => resolve(false);
    img.src = AVIF_PROBE;
  });
  return avifSupport;
}

// 0, then every 16th, 8th, 4th, 2nd, then the rest: coarse-to-fine.
function priorityOrder(count) {
  const seen = new Set();
  const order = [];
  const push = (i) => { if (i < count && !seen.has(i)) { seen.add(i); order.push(i); } };
  push(0);
  push(count - 1);
  for (const step of [16, 8, 4, 2, 1]) for (let i = 0; i < count; i += step) push(i);
  return order;
}

async function decode(blob) {
  if ('createImageBitmap' in window) {
    try { return await createImageBitmap(blob); } catch { /* fall through */ }
  }
  const img = new Image();
  img.src = URL.createObjectURL(blob);
  await img.decode();
  return img;
}

export class FrameSequence {
  constructor({ count, dir, ext, onUpdate }) {
    this.count = count;
    this.dir = dir;
    this.ext = ext;
    this.onUpdate = onUpdate;
    this.blobs = new Array(count);
    this.bitmaps = new Map();
    this.pending = new Set();
    this.center = 0;
    this.direction = 1;
    this.destroyed = false;
    this.loaded = 0;
  }

  url(i) {
    return `${this.dir}/${String(i + 1).padStart(3, '0')}.${this.ext}`;
  }

  // Resolves once the coarse pass (every 8th frame) is in, so the film is scrubbable.
  load(onProgress) {
    const order = priorityOrder(this.count);
    const essential = new Set(order.filter((i) => i % 8 === 0 || i === this.count - 1));
    let essentialLeft = essential.size;
    let resolveEssential;
    const essentialReady = new Promise((r) => { resolveEssential = r; });
    let cursor = 0;

    const worker = async () => {
      while (cursor < order.length && !this.destroyed) {
        const i = order[cursor++];
        try {
          const res = await fetch(this.url(i));
          if (!res.ok) throw new Error(res.status);
          this.blobs[i] = await res.blob();
        } catch {
          // A missing frame is bridged by its neighbours.
        }
        this.loaded++;
        onProgress?.(this.loaded / this.count, essentialLeft === 0 ? 1 : 1 - essentialLeft / essential.size);
        if (essential.has(i) && --essentialLeft === 0) resolveEssential();
        this.refresh();
      }
    };
    for (let k = 0; k < 6; k++) worker();
    return essentialReady;
  }

  setPlayhead(frame, direction) {
    this.center = Math.round(frame);
    if (direction) this.direction = direction;
    this.refresh();
  }

  // Keep a decoded window around the playhead, biased in the scroll direction.
  refresh() {
    if (this.destroyed) return;
    const ahead = 16;
    const behind = 8;
    const lo = this.center - (this.direction > 0 ? behind : ahead);
    const hi = this.center + (this.direction > 0 ? ahead : behind);

    for (const [i, bmp] of this.bitmaps) {
      if (i !== 0 && (i < lo - 6 || i > hi + 6)) {
        bmp.close?.();
        this.bitmaps.delete(i);
      }
    }

    const wanted = [0];
    for (let d = 0; d <= Math.max(ahead, behind); d++) {
      const a = this.center + d * this.direction;
      const b = this.center - d * this.direction;
      if (a >= lo && a <= hi) wanted.push(a);
      if (d && b >= lo && b <= hi) wanted.push(b);
    }
    for (const i of wanted) {
      if (i < 0 || i >= this.count || this.bitmaps.has(i) || this.pending.has(i) || !this.blobs[i]) continue;
      if (this.pending.size >= 4) break;
      this.pending.add(i);
      decode(this.blobs[i])
        .then((bmp) => {
          this.pending.delete(i);
          if (this.destroyed) { bmp.close?.(); return; }
          this.bitmaps.set(i, bmp);
          this.onUpdate?.(i);
          this.refresh();
        })
        .catch(() => this.pending.delete(i));
    }
  }

  // Nearest decoded frame to i (exact match preferred).
  get(i) {
    if (this.bitmaps.has(i)) return this.bitmaps.get(i);
    for (let d = 1; d < this.count; d++) {
      if (this.bitmaps.has(i - d)) return this.bitmaps.get(i - d);
      if (this.bitmaps.has(i + d)) return this.bitmaps.get(i + d);
    }
    return null;
  }

  has(i) {
    return this.bitmaps.has(i);
  }

  destroy() {
    this.destroyed = true;
    for (const bmp of this.bitmaps.values()) bmp.close?.();
    this.bitmaps.clear();
  }
}
