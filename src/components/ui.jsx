import { useEffect, useRef, useState } from 'react';
import manifest from '../data/images.json';
import { gsap, IS_FINE_POINTER, REDUCED, scrollToTarget } from '../lib/motion';

// Responsive AVIF/WebP picture that eases from soft focus to sharp once decoded.
export function Picture({ name, alt = '', sizes = '100vw', className = '', eager = false, position, ...rest }) {
  const m = manifest[name];
  const [loaded, setLoaded] = useState(false);
  const srcSet = (ext) => m.widths.map((w) => `/images/${name}-${w}.${ext} ${w}w`).join(', ');
  const fallback = `/images/${name}-${m.widths[Math.min(1, m.widths.length - 1)]}.webp`;
  const ref = (img) => {
    if (img?.complete && img.naturalWidth) setLoaded(true);
  };
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
      <img
        ref={ref}
        src={fallback}
        alt={alt}
        width={m.width}
        height={m.height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={eager ? 'high' : undefined}
        className={loaded ? 'is-loaded' : ''}
        onLoad={() => setLoaded(true)}
        style={position ? { objectPosition: position } : undefined}
        {...rest}
      />
    </picture>
  );
}

export function LogoMark({ className = '' }) {
  return <span className={`logo-mark ${className}`} aria-hidden="true" />;
}

export function Logo({ className = '' }) {
  return (
    <span className={`logo ${className}`}>
      <LogoMark />
      <span className="logo__type">
        <span className="logo__name">Casa De Grande</span>
        <span className="logo__desc">Boutique Hotel</span>
      </span>
    </span>
  );
}

export function Arrow({ className = '' }) {
  return (
    <svg className={`arrow ${className}`} viewBox="0 0 28 12" fill="none" aria-hidden="true">
      <path d="M0 6h26M21 1l5 5-5 5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

// Magnetic button: drifts toward the pointer, arrow nudges forward on hover.
export function Button({ children, variant = 'solid', href, onClick, arrow = true, className = '', size, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !IS_FINE_POINTER || REDUCED) return;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });
    const move = (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.22);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.32);
    };
    const leave = () => { xTo(0); yTo(0); };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, []);

  const cls = `btn btn--${variant}${size ? ` btn--${size}` : ''} ${className}`;
  const inner = (
    <>
      <span className="btn__label">{children}</span>
      {arrow && <Arrow className="btn__arrow" />}
    </>
  );

  if (href) {
    const internal = href.startsWith('#');
    return (
      <a
        ref={ref}
        className={cls}
        href={href}
        onClick={(e) => {
          if (internal) { e.preventDefault(); scrollToTarget(href); }
          onClick?.(e);
        }}
        {...(!internal && { target: '_blank', rel: 'noopener noreferrer' })}
        {...rest}
      >
        {inner}
      </a>
    );
  }
  return (
    <button ref={ref} type="button" className={cls} onClick={onClick} {...rest}>
      {inner}
    </button>
  );
}

export function SectionLabel({ index, children, light = false }) {
  return (
    <p className={`section-label${light ? ' section-label--light' : ''}`} data-fade>
      <span className="section-label__index">{index}</span>
      <span className="section-label__rule" />
      <span>{children}</span>
    </p>
  );
}

export function TextLink({ href, children, className = '', ...rest }) {
  const internal = href.startsWith('#');
  return (
    <a
      href={href}
      className={`text-link ${className}`}
      onClick={internal ? (e) => { e.preventDefault(); scrollToTarget(href); } : undefined}
      {...(!internal && !href.startsWith('tel:') && { target: '_blank', rel: 'noopener noreferrer' })}
      {...rest}
    >
      {children}
    </a>
  );
}
