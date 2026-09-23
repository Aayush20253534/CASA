import { useEffect, useRef } from 'react';
import { gsap, IS_FINE_POINTER, REDUCED } from '../lib/motion';

// Desktop-only cursor: a precise dot and a trailing ring that opens on interactive elements.
export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const label = useRef(null);
  const enabled = IS_FINE_POINTER && !REDUCED;

  useEffect(() => {
    if (!enabled) return;
    const html = document.documentElement;
    html.classList.add('has-cursor');
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.1, ease: 'power3' });
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.1, ease: 'power3' });
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.55, ease: 'power3' });
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.55, ease: 'power3' });
    let shown = false;

    const move = (e) => {
      if (!shown) {
        shown = true;
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY });
        html.classList.add('cursor-visible');
      }
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    };
    const over = (e) => {
      const t = e.target.closest('a, button, select, label, [data-cursor]');
      const text = t?.closest('[data-cursor]')?.dataset.cursor || '';
      ring.current.classList.toggle('is-hover', !!t);
      ring.current.classList.toggle('has-label', !!text);
      label.current.textContent = text;
    };
    const leave = () => { shown = false; html.classList.remove('cursor-visible'); };
    const down = () => ring.current.classList.add('is-down');
    const up = () => ring.current.classList.remove('is-down');

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    return () => {
      html.classList.remove('has-cursor', 'cursor-visible');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true"><span ref={label} /></div>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
