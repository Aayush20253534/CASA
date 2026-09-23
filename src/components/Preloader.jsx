import { useLayoutEffect, useRef } from 'react';
import { gsap, lockScroll } from '../lib/motion';
import { LogoMark } from './ui';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// Waits for fonts + the first pass of hero film frames (or a short ceiling),
// then lifts away like a curtain.
export default function Preloader({ onDone }) {
  const root = useRef(null);

  useLayoutEffect(() => {
    const el = root.current;
    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      lockScroll(false);
    };
    lockScroll(true);
    const count = { v: 0 };
    const counter = el.querySelector('.preloader__count');
    const intro = gsap.timeline();
    intro
      .from(el.querySelector('.logo-mark'), { scale: 0.6, autoAlpha: 0, duration: 1.6, ease: 'expo.out' })
      .from(el.querySelectorAll('.preloader__word span'), { yPercent: 110, duration: 1.3, stagger: 0.035, ease: 'expo.out' }, 0.2)
      .from(el.querySelector('.preloader__desc'), { autoAlpha: 0, letterSpacing: '0.9em', duration: 1.6, ease: 'expo.out' }, 0.5);

    // The counter follows the real frame download, eased so it never jumps.
    const bar = el.querySelector('.preloader__bar i');
    const paint = () => {
      counter.textContent = String(Math.round(count.v)).padStart(3, '0');
      gsap.set(bar, { scaleX: count.v / 100 });
    };
    let target = 8;
    const onProgress = (e) => { target = Math.max(target, Math.min(96, 8 + e.detail * 88)); };
    window.addEventListener('hero:progress', onProgress);
    const creep = () => {
      target = Math.min(96, target + 0.04);
      count.v += (target - count.v) * 0.08;
      paint();
    };
    gsap.ticker.add(creep);
    const progress = { kill: () => { gsap.ticker.remove(creep); window.removeEventListener('hero:progress', onProgress); } };

    const heroReady = new Promise((resolve) => {
      if (window.__heroReady) resolve();
      window.addEventListener('hero:ready', resolve, { once: true });
    });

    let cancelled = false;
    Promise.all([
      Promise.race([Promise.all([document.fonts.ready, heroReady]), wait(7000)]),
      wait(1800),
    ]).then(() => {
      if (cancelled) return;
      progress.kill();
      gsap.timeline({
        onComplete: () => { release(); onDone(); },
      })
        .to(count, {
          v: 100,
          duration: 0.5,
          ease: 'power2.inOut',
          onUpdate: paint,
        })
        .to(el.querySelector('.preloader__inner'), { yPercent: -30, autoAlpha: 0, duration: 1, ease: 'expo.in' }, 0.35)
        .to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.3, ease: 'expo.inOut' }, 0.75);
    });

    return () => { cancelled = true; intro.kill(); progress.kill(); release(); };
  }, [onDone]);

  const word = 'Casa De Grande';
  return (
    <div ref={root} className="preloader" aria-hidden="true">
      <div className="preloader__inner">
        <LogoMark className="preloader__mark" />
        <p className="preloader__word">
          {[...word].map((c, i) => (
            <span key={i}>{c === ' ' ? ' ' : c}</span>
          ))}
        </p>
        <p className="preloader__desc">Boutique Hotel · Prayagraj</p>
      </div>
      <div className="preloader__foot">
        <span className="preloader__bar"><i /></span>
        <span className="preloader__count">000</span>
      </div>
    </div>
  );
}
