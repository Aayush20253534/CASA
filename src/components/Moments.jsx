import { useLayoutEffect, useRef } from 'react';
import { MOMENTS } from '../data/content';
import { gsap } from '../lib/motion';
import { Picture, SectionLabel } from './ui';

// 05 — Luxury Moments: a pinned, scroll-scrubbed sequence of three frames.
// The frame opens out of the ivory page, dissolves between moments, then closes again.
export default function Moments() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const el = root.current;
      const stage = el.querySelector('.moments__stage');
      const slides = gsap.utils.toArray('.moment', el);
      const phrases = gsap.utils.toArray('.moment__phrase', el);
      const captions = gsap.utils.toArray('.moment__caption', el);
      const counter = el.querySelector('.moments__count b');
      const small = window.innerWidth < 768;
      const closed = small ? 'inset(6% 5% 6% 5% round 14px)' : 'inset(9% 12% 9% 12% round 28px)';

      gsap.set(slides.slice(1), { clipPath: 'inset(100% 0% 0% 0%)' });
      gsap.set(phrases.slice(1), { autoAlpha: 0, yPercent: 40, filter: 'blur(10px)' });
      gsap.set(captions.slice(1), { autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: () => `+=${window.innerHeight * 3.6}`,
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          // Lets the phone booking bar step aside while the sequence has the screen.
          onToggle: (self) => document.documentElement.classList.toggle('in-moments', self.isActive),
          onUpdate: (self) => {
            const i = Math.min(slides.length, Math.floor(self.progress * slides.length * 0.999) + 1);
            counter.textContent = String(i).padStart(2, '0');
          },
        },
      });

      tl.fromTo(stage, { clipPath: closed }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1 }, 0)
        .fromTo(slides[0].querySelector('img'), { scale: 1.2 }, { scale: 1, duration: 1.6 }, 0)
        .from(phrases[0], { yPercent: 40, autoAlpha: 0, filter: 'blur(10px)', duration: 0.7 }, 0.45);

      slides.slice(1).forEach((slide, n) => {
        const at = 2 + n * 2; // each moment holds before the next wipes in
        tl.to(phrases[n], { yPercent: -40, autoAlpha: 0, filter: 'blur(10px)', duration: 0.6 }, at)
          .to(captions[n], { autoAlpha: 0, duration: 0.4 }, at)
          .to(slides[n].querySelector('img'), { scale: 1.12, duration: 1 }, at)
          .to(slide, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power2.inOut' }, at)
          .fromTo(slide.querySelector('img'), { scale: 1.3 }, { scale: 1, duration: 1.4 }, at)
          .to(phrases[n + 1], { yPercent: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.7 }, at + 0.55)
          .to(captions[n + 1], { autoAlpha: 1, duration: 0.5 }, at + 0.7);
      });

      tl.to({}, { duration: 1.2 })
        .to(stage, { clipPath: closed, duration: 1 })
        .to(el.querySelector('.moments__overlay'), { autoAlpha: 0, duration: 0.5 }, '<');
    });
    return () => {
      mm.revert();
      document.documentElement.classList.remove('in-moments');
    };
  }, []);

  return (
    <section ref={root} className="moments" id="moments" aria-label="Luxury moments">
      <div className="moments__stage">
        {MOMENTS.map((m, i) => (
          <div key={m.phrase} className="moment" style={{ zIndex: i + 1 }}>
            <Picture name={m.image} alt={m.alt} sizes="100vw" position={m.position} />
          </div>
        ))}
        <div className="moments__shade" />
        <div className="grain grain--soft" />
        <div className="moments__overlay">
          <SectionLabel index="04" light>Moments</SectionLabel>
          <div className="moments__phrases">
            {MOMENTS.map((m) => (
              <p key={m.phrase} className="moment__phrase">{m.phrase}</p>
            ))}
          </div>
          <div className="moments__foot">
            <div className="moments__captions">
              {MOMENTS.map((m) => (
                <span key={m.caption} className="moment__caption">{m.caption}</span>
              ))}
            </div>
            <p className="moments__count"><b>01</b> / {String(MOMENTS.length).padStart(2, '0')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
