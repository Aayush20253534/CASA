import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);
gsap.defaults({ ease: 'power3.out', duration: 1.2 });

export { gsap, ScrollTrigger, SplitText };

export const REDUCED = typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const IS_FINE_POINTER = typeof window !== 'undefined'
  && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// ── Smooth scroll ────────────────────────────────────────────
let lenis = null;
let locks = 0;

export function initSmoothScroll() {
  if (REDUCED) return () => {};
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (time) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  if (locks > 0) lenis.stop();
  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
}

export function scrollToTarget(target, options = {}) {
  if (target === '#top') target = 0;
  if (lenis) {
    lenis.scrollTo(target, {
      duration: 1.9,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      ...options,
    });
    return;
  }
  if (typeof target === 'number') window.scrollTo({ top: target, behavior: REDUCED ? 'auto' : 'smooth' });
  else document.querySelector(target)?.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' });
}

// Reference-counted so overlapping modals never unlock early.
export function lockScroll(on) {
  locks = Math.max(0, locks + (on ? 1 : -1));
  const locked = locks > 0;
  document.documentElement.classList.toggle('is-locked', locked);
  if (lenis) locked ? lenis.stop() : lenis.start();
}

// ── Scroll reveals, driven by data attributes ────────────────
//  data-split           serif headline, lines rise out of a mask
//  data-fade            fade + rise (optional data-delay)
//  data-stagger         children fade + rise in sequence
//  data-clip            image frame wipes open, image settles from scale
//  data-parallax="12"   inner <img> drifts ±12% while in view
//  data-speed="0.8"     element drifts at a different rate (depth)
//  data-expand          dark panel widens to full bleed as it arrives
export function setupReveals() {
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const splits = gsap.utils.toArray('[data-split]').map((el) =>
      SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'split-line',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 112,
            duration: 1.5,
            ease: 'expo.out',
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }),
      }),
    );

    gsap.utils.toArray('[data-fade]').forEach((el) => {
      gsap.from(el, {
        y: 36,
        autoAlpha: 0,
        duration: 1.3,
        ease: 'expo.out',
        delay: parseFloat(el.dataset.delay || 0),
        clearProps: 'transform',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      });
    });

    gsap.utils.toArray('[data-stagger]').forEach((el) => {
      gsap.from(el.children, {
        y: 48,
        autoAlpha: 0,
        duration: 1.4,
        ease: 'expo.out',
        stagger: 0.12,
        clearProps: 'transform',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    });

    gsap.utils.toArray('[data-clip]').forEach((el) => {
      const img = el.querySelector('img');
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 86%', once: true } });
      tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.7, ease: 'expo.inOut' });
      if (img) tl.from(img, { scale: 1.32, duration: 2.4, ease: 'expo.out' }, 0.15);
    });

    gsap.utils.toArray('[data-parallax]').forEach((el) => {
      const img = el.querySelector('img');
      const amount = parseFloat(el.dataset.parallax || 10);
      if (!img) return;
      gsap.fromTo(img, { yPercent: -amount }, {
        yPercent: amount,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });

    gsap.utils.toArray('[data-speed]').forEach((el) => {
      const s = parseFloat(el.dataset.speed);
      gsap.fromTo(el, { y: s * 80 }, {
        y: -s * 80,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });

    gsap.utils.toArray('[data-expand]').forEach((el) => {
      const small = window.innerWidth < 768;
      gsap.fromTo(el, { clipPath: small ? 'inset(0% 4% 0% 4% round 16px)' : 'inset(0% 6% 0% 6% round 32px)' }, {
        clipPath: 'inset(0% 0% 0% 0% round 0px)',
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 15%', scrub: true },
      });
    });

    return () => splits.forEach((s) => s.revert());
  });

  return () => mm.revert();
}
