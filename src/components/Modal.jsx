import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap, lockScroll, REDUCED } from '../lib/motion';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Shared overlay shell: curtain-wipe entrance, focus trap, Esc to close, scroll lock.
export default function Modal({ open, onClose, labelledBy, className = '', children }) {
  const [mounted, setMounted] = useState(open);
  const root = useRef(null);
  const returnFocus = useRef(null);
  const locked = useRef(false);

  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  useLayoutEffect(() => {
    if (!mounted) return;
    const el = root.current;
    const panel = el.querySelector('.modal__panel');
    const backdrop = el.querySelector('.modal__backdrop');
    const k = REDUCED ? 0.01 : 1;

    if (open) {
      returnFocus.current = document.activeElement;
      if (!locked.current) { lockScroll(true); locked.current = true; }
      const tl = gsap.timeline();
      tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.7 * k, ease: 'power2.out' })
        .fromTo(panel, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.15 * k, ease: 'expo.inOut' }, 0.05)
        .fromTo(el.querySelectorAll('[data-modal-media] img'), { scale: 1.25 }, { scale: 1, duration: 1.8 * k, ease: 'expo.out' }, 0.35)
        .fromTo(el.querySelectorAll('[data-modal-item]'), { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1 * k, stagger: 0.045 * k, ease: 'expo.out' }, 0.6 * k);
      const t = setTimeout(() => el.querySelector('[data-autofocus]')?.focus({ preventScroll: true }), 650 * k);
      return () => { tl.kill(); clearTimeout(t); };
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setMounted(false);
        if (locked.current) { lockScroll(false); locked.current = false; }
        returnFocus.current?.focus?.({ preventScroll: true });
      },
    });
    tl.to(panel, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.85 * k, ease: 'expo.inOut' })
      .to(backdrop, { opacity: 0, duration: 0.5 * k, ease: 'power2.inOut' }, 0.35 * k);
    return () => tl.kill();
  }, [open, mounted]);

  useEffect(() => () => { if (locked.current) lockScroll(false); }, []);

  useEffect(() => {
    if (!mounted || !open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
      if (e.key !== 'Tab') return;
      const items = [...root.current.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mounted, open, onClose]);

  if (!mounted) return null;

  return (
    <div ref={root} className={`modal ${className}`} role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
      <div className="modal__backdrop" onClick={onClose} />
      <div className="modal__panel" data-lenis-prevent>
        <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
          <span />
          <span />
        </button>
        {children}
      </div>
    </div>
  );
}
