import { HOTEL, NAV_LINKS } from '../data/content';
import { useBooking } from '../lib/booking';
import { scrollToTarget } from '../lib/motion';
import { Button, Logo, LogoMark } from './ui';

// 11 — Final CTA: the page settles into deep forest.
export function FinalCTA() {
  const { openBooking } = useBooking();
  return (
    <section className="final" aria-label="Come stay with us">
      <div className="final__panel" data-expand>
      <div className="grain" />
      <LogoMark className="final__mark" />
      <div className="container final__inner">
        <p className="final__eyebrow" data-fade>Casa De Grande · Boutique Hotel</p>
        <h2 className="display display--xxl final__title" data-split>
          Come stay <br />with <em>us.</em>
        </h2>
        <div data-fade>
          <Button variant="light" size="xl" onClick={() => openBooking()}>Book Now</Button>
        </div>
      </div>
      </div>
    </section>
  );
}

// 12 — Footer
export function Footer() {
  const { openBooking } = useBooking();
  const year = new Date().getFullYear();
  const social = Object.entries(HOTEL.social).filter(([, url]) => url);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Logo />
            <p>A boutique hotel in George Town, {HOTEL.city}.</p>
          </div>

          <nav className="footer__col" aria-label="Footer">
            <h3>Navigate</h3>
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-link text-link--light" onClick={(e) => { e.preventDefault(); scrollToTarget(l.href); }}>
                {l.label}
              </a>
            ))}
            <button type="button" className="text-link text-link--light" onClick={() => openBooking()}>Book Now</button>
          </nav>

          <div className="footer__col">
            <h3>Contact</h3>
            <a className="text-link text-link--light" href={HOTEL.phone.href}>Phone · {HOTEL.phone.display}</a>
            <a className="text-link text-link--light" href={`https://wa.me/${HOTEL.whatsapp.number}`} target="_blank" rel="noopener noreferrer">
              WhatsApp · {HOTEL.whatsapp.display}
            </a>
            {HOTEL.email && (
              <a className="text-link text-link--light" href={`mailto:${HOTEL.email}`}>{HOTEL.email}</a>
            )}
            <a className="text-link text-link--light footer__address" href={HOTEL.mapsUrl} target="_blank" rel="noopener noreferrer">
              {HOTEL.address.join(', ')}
            </a>
          </div>

          {social.length > 0 && (
            <div className="footer__col">
              <h3>Follow</h3>
              {social.map(([name, url]) => (
                <a key={name} className="text-link text-link--light" href={url} target="_blank" rel="noopener noreferrer">
                  {name[0].toUpperCase() + name.slice(1)}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="footer__base">
          <p>© {year} Casa De Grande Boutique Hotel. All rights reserved.</p>
          <p>{HOTEL.coords}</p>
          <button type="button" className="text-link text-link--light" onClick={() => scrollToTarget('#top')}>
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
