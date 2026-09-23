import { useLayoutEffect, useRef } from 'react';
import { GALLERY } from '../data/content';
import { gsap } from '../lib/motion';
import { Picture, SectionLabel } from './ui';

// 07 — Gallery: vertical scroll drives a horizontal film strip on larger screens;
// on phones it becomes a native, snap-scrolling strip.
export default function Gallery() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const el = root.current;
      const track = el.querySelector('.gallery__track');
      const distance = () => track.scrollWidth - window.innerWidth;

      const scroll = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub: 0.9,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => gsap.set(el.querySelector('.gallery__progress i'), { scaleX: self.progress }),
        },
      });

      gsap.utils.toArray('.shot', el).forEach((shot) => {
        const img = shot.querySelector('img');
        gsap.fromTo(img, { xPercent: -8, scale: 1.12 }, {
          xPercent: 8,
          scale: 1.02,
          ease: 'none',
          scrollTrigger: { trigger: shot, containerAnimation: scroll, start: 'left right', end: 'right left', scrub: true },
        });
        gsap.from(shot.querySelector('figcaption'), {
          autoAlpha: 0,
          y: 20,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: { trigger: shot, containerAnimation: scroll, start: 'left 80%' },
        });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="gallery" id="gallery" aria-label="Gallery">
      <div className="gallery__track">
        <div className="gallery__intro">
          <SectionLabel index="06">Gallery</SectionLabel>
          <h2 className="display display--lg" data-split>
            A closer <em>look.</em>
          </h2>
          <p data-fade>
            From the façade to the finishing touches: exterior, rooms, interiors, details
            and atmosphere.
          </p>
          <p className="gallery__hint" data-fade>
            <span className="gallery__progress"><i /></span>
            <span className="gallery__hint-desk">Scroll to wander</span>
            <span className="gallery__hint-touch">Swipe to wander →</span>
          </p>
        </div>
        {GALLERY.map((g, i) => (
          <figure key={g.image + i} className={`shot shot--${g.ratio}`} data-cursor="Casa">
            <div className="shot__media">
              <Picture name={g.image} alt={g.alt} sizes="(max-width: 900px) 85vw, 55vw" />
            </div>
            <figcaption>
              <span className="shot__index">{String(i + 1).padStart(2, '0')}</span>
              <span className="shot__cat">{g.category}</span>
              <span className="shot__cap">{g.caption}</span>
            </figcaption>
          </figure>
        ))}
        <div className="gallery__end" aria-hidden="true" />
      </div>
    </section>
  );
}
