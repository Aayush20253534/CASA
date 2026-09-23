import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { HOTEL, NAV_LINKS } from '../data/content';
import { useBooking } from '../lib/booking';
import { gsap, lockScroll, REDUCED, ScrollTrigger, scrollToTarget } from '../lib/motion';
import { Arrow, Button, Logo } from './ui';

export default function Nav({ ready }) {
  const { openBooking } = useBooking();
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  const menuRef = useRef(null);
  const menuTl = useRef(null);
  const menuState = useRef(false);

  // Transparent over the film, ivory once the story covers it; tucks away on scroll down.
  useLayoutEffect(() => {
    const nav = navRef.current;
    const solid = ScrollTrigger.create({
      trigger: '.story',
      start: 'top 76px',
      end: 'max',
      refreshPriority: -1,
      onToggle: (self) => nav.classList.toggle('is-solid', self.isActive),
    });
    const hide = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const past = self.scroll() > window.innerHeight * 1.1;
        nav.classList.toggle('is-hidden', past && self.direction === 1 && !menuState.current);
      },
    });
    return () => { solid.kill(); hide.kill(); };
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (REDUCED) { gsap.set(navRef.current, { autoAlpha: 1 }); return; }
    gsap.fromTo(navRef.current, { yPercent: -60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1.4, ease: 'expo.out', delay: 0.9, clearProps: 'transform' });
  }, [ready]);

  // Full-screen mobile menu.
  useLayoutEffect(() => {
    const m = menuRef.current;
    const k = REDUCED ? 0.01 : 1;
    menuTl.current = gsap.timeline({ paused: true })
      .set(m, { visibility: 'visible' })
      .fromTo(m, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1 * k, ease: 'expo.inOut' })
      .fromTo(m.querySelectorAll('.menu__link span'), { yPercent: 110 }, { yPercent: 0, duration: 1.1 * k, stagger: 0.06 * k, ease: 'expo.out' }, 0.45 * k)
      .fromTo(m.querySelectorAll('.menu__foot > *'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.9 * k, stagger: 0.08 * k, ease: 'expo.out' }, 0.7 * k);
    return () => menuTl.current.kill();
  }, []);

  useEffect(() => {
    menuState.current = menuOpen;
    if (menuOpen) {
      lockScroll(true);
      menuTl.current.timeScale(1).play();
      document.documentElement.classList.add('menu-open');
      const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }
    if (menuTl.current.progress() > 0) {
      lockScroll(false);
      document.documentElement.classList.remove('menu-open');
      menuTl.current.timeScale(1.6).reverse();
    }
  }, [menuOpen]);

  const go = (href) => (e) => {
    e.preventDefault();
    const delay = menuOpen ? 550 : 0;
    setMenuOpen(false);
    setTimeout(() => scrollToTarget(href), delay);
  };

  const book = () => {
    setMenuOpen(false);
    openBooking();
  };

  return (
    <>
      <header ref={navRef} className="nav" style={{ visibility: 'hidden' }}>
        <div className="nav__inner">
          <a href="#top" className="nav__brand" onClick={go('#top')} aria-label="Casa De Grande Boutique Hotel — home">
            <Logo />
          </a>
          <nav className="nav__links" aria-label="Primary">
            {NAV_LINKS.slice(1).map((l) => (
              <a key={l.href} href={l.href} className="nav__link" onClick={go(l.href)}>
                {l.label}
              </a>
            ))}
          </nav>
          <div className="nav__actions">
            <Button variant="nav" onClick={book} arrow={false}>Book Now</Button>
            <button
              type="button"
              className={`nav__toggle${menuOpen ? ' is-open' : ''}`}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="nav__toggle-label">{menuOpen ? 'Close' : 'Menu'}</span>
              <span className="nav__toggle-lines"><i /><i /></span>
            </button>
          </div>
        </div>
      </header>

      <div ref={menuRef} id="site-menu" className="menu" aria-hidden={!menuOpen}>
        <nav className="menu__nav" aria-label="Mobile">
          {NAV_LINKS.map((l, i) => (
            <a key={l.href} href={l.href} className="menu__link" onClick={go(l.href)} tabIndex={menuOpen ? 0 : -1}>
              <span>
                <em>{String(i + 1).padStart(2, '0')}</em>
                {l.label}
              </span>
            </a>
          ))}
        </nav>
        <div className="menu__foot">
          <Button variant="light" size="lg" onClick={book} tabIndex={menuOpen ? 0 : -1}>Book Now</Button>
          <a href={HOTEL.phone.href} tabIndex={menuOpen ? 0 : -1}>{HOTEL.phone.display}</a>
          <p>{HOTEL.address[1]}</p>
        </div>
      </div>

      <BookBar />
    </>
  );
}

// Phones: a slim reservation bar appears once the film has played and
// steps aside during Moments and wherever a Book Now button is already on screen.
function BookBar() {
  const { openBooking } = useBooking();
  const bar = useRef(null);

  useLayoutEffect(() => {
    const el = bar.current;
    let pastHero = false;
    let inBookZone = false;
    const sync = () => el.classList.toggle('is-visible', pastHero && !inBookZone);
    const a = ScrollTrigger.create({
      trigger: '.story',
      start: 'top 40%',
      end: 'max',
      refreshPriority: -1,
      onToggle: (self) => { pastHero = self.isActive; sync(); },
    });
    const b = ScrollTrigger.create({
      trigger: '#book',
      start: 'top 85%',
      end: 'max',
      refreshPriority: -1,
      onToggle: (self) => { inBookZone = self.isActive; sync(); },
    });
    return () => { a.kill(); b.kill(); };
  }, []);

  return (
    <div ref={bar} className="book-bar">
      <button type="button" onClick={() => openBooking()}>
        <span>Book your stay</span>
        <span className="book-bar__cta">Book Now <Arrow /></span>
      </button>
    </div>
  );
}
