import { useEffect, useLayoutEffect, useRef } from 'react';
import { HOTEL } from '../data/content';
import film from '../data/frames.json';
import { useBooking } from '../lib/booking';
import { FrameSequence, supportsAvif } from '../lib/frames';
import { gsap, REDUCED, scrollToTarget, SplitText } from '../lib/motion';
import { Button, TextLink } from './ui';

// Scroll budget, in viewport heights. The film plays over FILM, holds on the
// room for HOLD, then the story slides over the stage during the last OVERLAY.
const FILM = 300;
const HOLD = 20;
const OVERLAY = 100;
const TOTAL = FILM + HOLD + OVERLAY;

const CHAPTERS = [
  {
    num: 'I',
    label: 'The Arrival',
    title: <>Arches, glass <em>&amp; warm light.</em></>,
    text: 'Three storeys of tall arched windows glow above a quiet George Town street.',
    at: [55, 120],
  },
  {
    num: 'II',
    label: 'The Threshold',
    title: <>Step <em>inside.</em></>,
    text: 'Soft light, polished marble and an easy calm from the moment you arrive.',
    at: [140, 205],
  },
  {
    num: 'III',
    label: 'The Room',
    title: <>Rest, <em>beautifully.</em></>,
    text: 'A king bed beneath a glowing tray ceiling. Crisp linen, deep quiet.',
    at: [248, 372],
    cta: true,
  },
];

const portraitViewport = () => window.innerWidth / window.innerHeight < 0.85 && window.innerWidth < 900;

export default function Hero({ ready }) {
  const { openBooking } = useBooking();
  const root = useRef(null);
  const canvas = useRef(null);
  const state = useRef({ frame: 0, reveal: 0, dirty: true, seq: null });

  // ── Frames: load (the preloader listens), keep a decoded window, draw on demand ──
  useEffect(() => {
    const s = state.current;
    const cvs = canvas.current;
    const ctx = cvs.getContext('2d', { alpha: false });
    const portrait = portraitViewport();
    let cancelled = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cvs.width = Math.round(cvs.clientWidth * dpr);
      cvs.height = Math.round(cvs.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      s.dirty = true;
    };

    const layout = (img, W, H) => {
      const ar = img.width / img.height;
      if (W / H >= 0.85 || ar > 1) {
        // Cover, anchored near the top so the façade and its sign stay whole.
        let dw = W;
        let dh = W / ar;
        if (dh < H) { dh = H; dw = H * ar; }
        return { x: (W - dw) / 2, y: (H - dh) * 0.06, dw, dh };
      }
      // Phones: open as a framed window on the whole façade, grow to full bleed.
      const r = s.reveal;
      const h0 = W / ar;
      const h1 = Math.max(H, h0);
      const dh = h0 + (h1 - h0) * r;
      const top0 = Math.max(0, Math.min(H * 0.075, (H - h0) * 0.22));
      return { x: (W - dh * ar) / 2, y: top0 * (1 - r), dw: dh * ar, dh };
    };

    const draw = () => {
      if (!s.dirty || !s.seq) return;
      const W = cvs.clientWidth;
      const H = cvs.clientHeight;
      const i = Math.floor(s.frame);
      const frac = s.frame - i;
      const a = s.seq.get(i);
      if (!a) return;
      s.dirty = false;
      const { x, y, dw, dh } = layout(a, W, H);
      ctx.fillStyle = '#18201D';
      ctx.fillRect(0, 0, W, H);
      ctx.drawImage(a, x, y, dw, dh);
      // Blend toward the next still so motion reads as continuous.
      if (frac > 0.02 && s.seq.has(i + 1)) {
        ctx.globalAlpha = frac;
        ctx.drawImage(s.seq.get(i + 1), x, y, dw, dh);
        ctx.globalAlpha = 1;
      }
      // Phone framing: feather the window into charcoal until it goes full bleed.
      const bottom = y + dh;
      if (bottom < H + 1 && s.reveal < 1) {
        const k = 1 - s.reveal;
        const fade = dh * 0.42;
        const g = ctx.createLinearGradient(0, bottom - fade, 0, bottom);
        g.addColorStop(0, 'rgba(24,32,29,0)');
        g.addColorStop(1, `rgba(24,32,29,${k})`);
        ctx.fillStyle = g;
        ctx.fillRect(0, bottom - fade, W, fade + 1);
        ctx.fillStyle = '#18201D';
        ctx.fillRect(0, bottom, W, H - bottom);
      }
      if (y > 0.5) {
        const t = ctx.createLinearGradient(0, y, 0, y + 90);
        t.addColorStop(0, 'rgba(24,32,29,1)');
        t.addColorStop(1, 'rgba(24,32,29,0)');
        ctx.fillStyle = t;
        ctx.fillRect(0, y, W, 90);
        ctx.fillStyle = '#18201D';
        ctx.fillRect(0, 0, W, y);
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cvs);
    gsap.ticker.add(draw);

    (async () => {
      const avif = await supportsAvif();
      if (cancelled) return;
      const seq = new FrameSequence({
        count: film.count,
        dir: portrait ? '/frames/m' : '/frames/d',
        ext: avif ? 'avif' : 'webp',
        onUpdate: () => { s.dirty = true; },
      });
      s.seq = seq;
      await seq.load((all, essential) => {
        window.dispatchEvent(new CustomEvent('hero:progress', { detail: essential }));
      });
      if (cancelled) return;
      window.__heroReady = true;
      window.dispatchEvent(new Event('hero:ready'));
    })();

    return () => {
      cancelled = true;
      ro.disconnect();
      gsap.ticker.remove(draw);
      s.seq?.destroy();
      s.seq = null;
    };
  }, []);

  // ── Entrance once the curtain lifts ──
  useLayoutEffect(() => {
    if (REDUCED) return;
    const el = root.current;
    gsap.set(el.querySelector('.hero__title'), { autoAlpha: 0 });
    gsap.set(el.querySelectorAll('[data-hero-fade]'), { autoAlpha: 0, y: 24 });
    gsap.set(el.querySelector('.hero__eyebrow-rule'), { scaleX: 0 });
    gsap.set(el.querySelector('.hero__media'), { scale: 1.14 });
  }, []);

  // Split only after the preloader confirmed the fonts, so line breaks are
  // measured in Cormorant; later re-splits (resize) simply stay in place.
  useLayoutEffect(() => {
    if (!ready || REDUCED) return;
    const el = root.current;
    const title = el.querySelector('.hero__title');
    let played = false;
    const tl = gsap.timeline({ delay: 0.15 });
    const split = SplitText.create(title, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit: (self) => {
        gsap.set(title, { autoAlpha: 1 });
        if (played) return;
        played = true;
        tl.fromTo(self.lines, { yPercent: 115 }, { yPercent: 0, duration: 1.7, stagger: 0.12, ease: 'expo.out' }, 0.45);
      },
    });
    tl.to(el.querySelector('.hero__media'), { scale: 1, duration: 3.2, ease: 'expo.out' }, 0)
      .to(el.querySelector('.hero__eyebrow-rule'), { scaleX: 1, duration: 1.4, ease: 'expo.inOut' }, 0.35)
      .to(el.querySelectorAll('[data-hero-fade]'), { autoAlpha: 1, y: 0, duration: 1.4, stagger: 0.1, ease: 'expo.out' }, 0.9);
    return () => { tl.kill(); split.revert(); };
  }, [ready]);

  // ── The film, scrubbed by scroll ──
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const el = root.current;
      const s = state.current;
      const last = film.count - 1;
      const playhead = { frame: 0, reveal: 0 };
      const u = (vh) => vh / TOTAL; // scroll distance (vh) → timeline time
      const q = (sel) => el.querySelector(sel);
      const navItems = el.querySelectorAll('.hero__chapters-nav li');

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.7,
        },
        // Runs as the scrub catches up, so the decoded window follows the real playhead.
        onUpdate: () => {
          if (playhead.frame !== s.frame || playhead.reveal !== s.reveal) {
            s.seq?.setPlayhead(playhead.frame, playhead.frame >= s.frame ? 1 : -1);
            s.frame = playhead.frame;
            s.reveal = playhead.reveal;
            s.dirty = true;
          }
        },
      });

      tl.to(playhead, { frame: last, duration: u(FILM) }, 0)
        .to(playhead, { reveal: 1, duration: u(FILM * 0.78), ease: 'power1.inOut' }, u(FILM * 0.14))
        .to(q('.hero__progress i'), { scaleX: 1, duration: u(FILM) }, 0)
        .to(q('.hero__content'), { yPercent: -12, autoAlpha: 0, duration: u(34), ease: 'power1.in' }, u(12))
        .to(q('.hero__aside'), { autoAlpha: 0, duration: u(18) }, u(4));

      gsap.utils.toArray('.chapter', el).forEach((ch, n) => {
        const [a, b] = CHAPTERS[n].at;
        const parts = ch.querySelectorAll('[data-chapter-part]');
        tl.fromTo(parts, { autoAlpha: 0, y: 44, filter: 'blur(8px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: u(22), stagger: u(4), ease: 'power2.out' }, u(a))
          .fromTo(ch.querySelector('.chapter__rule'), { scaleX: 0 }, { scaleX: 1, duration: u(26), ease: 'power2.inOut' }, u(a))
          .to(parts, { autoAlpha: 0, y: -36, filter: 'blur(8px)', duration: u(18), stagger: u(3), ease: 'power2.in' }, u(b))
          .fromTo(navItems[n], { opacity: 0.4 }, { opacity: 1, duration: u(10) }, u(a))
          .to(navItems[n], { opacity: 0.4, duration: u(10) }, u(b));
        gsap.set(ch, { pointerEvents: 'none' });
        tl.set(ch, { pointerEvents: 'auto' }, u(a + 10)).set(ch, { pointerEvents: 'none' }, u(b));
      });

      // The story arrives: the stage recedes beneath it.
      tl.to(q('.hero__stage-inner'), { scale: 0.92, duration: u(OVERLAY), ease: 'power1.in' }, u(FILM + HOLD))
        .to(q('.hero__dim'), { opacity: 0.78, duration: u(OVERLAY) }, u(FILM + HOLD))
        .to(q('.hero__chapters-nav'), { autoAlpha: 0, duration: u(24) }, u(FILM + HOLD - 10))
        .set({}, {}, 1);
    });
    return () => mm.revert();
  }, []);

  const jumpTo = (vh) => {
    const top = root.current.getBoundingClientRect().top + window.scrollY;
    scrollToTarget(top + (vh / 100) * window.innerHeight, { duration: 2.6 });
  };

  return (
    <section ref={root} className="hero" id="top" aria-label="Casa De Grande Boutique Hotel" style={{ '--hero-track': TOTAL }}>
      <div className="hero__stage">
        <div className="hero__stage-inner">
          <div className="hero__media">
            <canvas ref={canvas} className="hero__canvas" aria-hidden="true" />
          </div>
          <div className="hero__shade" />
          <div className="hero__dim" />
          <div className="grain grain--soft" />
        </div>

        <div className="hero__content container">
          <p className="hero__eyebrow" data-hero-fade>
            <span className="hero__eyebrow-rule" />
            An experience beyond stay
          </p>
          <h1 className="hero__title">
            Stay somewhere <br /><em>worth</em> remembering.
          </h1>
          <p className="hero__lede" data-hero-fade>
            A refined boutique escape where architecture, comfort and thoughtful hospitality come together.
          </p>
          <div className="hero__ctas" data-hero-fade>
            <Button variant="light" size="lg" onClick={() => openBooking()}>Book Now</Button>
            <TextLink href="#about" className="text-link--light">Explore the hotel</TextLink>
          </div>
        </div>

        <div className="hero__chapters container">
          {CHAPTERS.map((c) => (
            <div key={c.num} className="chapter">
              <p className="chapter__label" data-chapter-part>
                <span className="chapter__num">{c.num}</span>
                <span className="chapter__rule" />
                {c.label}
              </p>
              <h2 className="chapter__title" data-chapter-part>{c.title}</h2>
              <p className="chapter__text" data-chapter-part>{c.text}</p>
              {c.cta && (
                <div className="chapter__cta" data-chapter-part>
                  <Button variant="light" onClick={() => openBooking()}>Book Now</Button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="hero__aside">
          <button type="button" className="hero__scroll" data-hero-fade onClick={() => jumpTo(CHAPTERS[0].at[0] + 20)}>
            Scroll to explore
            <span className="hero__scroll-line"><i /></span>
          </button>
          <p className="hero__meta" data-hero-fade>
            <span className="hero__meta-name">Casa De Grande</span>
            <span>Boutique Hotel · {HOTEL.city}</span>
            <span>{HOTEL.coords}</span>
          </p>
        </div>

        <div className="hero__progress" aria-hidden="true"><i /></div>
        <ol className="hero__chapters-nav" data-hero-fade aria-label="Film chapters">
          {CHAPTERS.map((c) => (
            <li key={c.num}>
              <button type="button" onClick={() => jumpTo(c.at[0] + 20)}>
                <span>{c.num}</span>
                {c.label}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
