import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { HOTEL, ROOMS } from '../data/content';
import { BOOKING_GUESTS, BOOKING_LIMITS, addDays, buildWhatsAppMessage, toInputDate, whatsAppUrl } from '../lib/booking';
import { gsap, REDUCED } from '../lib/motion';
import Modal from './Modal';
import { Arrow, LogoMark, Picture } from './ui';


const blank = (room = '') => {
  const today = toInputDate(new Date());
  return {
    name: '',
    phone: '',
    email: '',
    checkIn: today,
    checkOut: addDays(today, 1),
    guests: '2',
    room,
    request: '',
  };
};

function validate(f) {
  const e = {};
  const today = toInputDate(new Date());
  if (f.name.trim().length < 2) e.name = 'Please enter your full name.';
  else if (f.name.length > BOOKING_LIMITS.name) e.name = `Keep your name under ${BOOKING_LIMITS.name} characters.`;
  const digits = f.phone.replace(/\D/g, '');
  if (!/^[+\d][\d\s()-]*$/.test(f.phone.trim()) || digits.length < 7 || digits.length > 15)
    e.phone = 'Please enter a valid phone number.';
  if (f.phone.length > BOOKING_LIMITS.phone) e.phone = 'This phone number is too long.';
  if (f.email.length > BOOKING_LIMITS.email) e.email = 'This email address is too long.';
  else if (f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim()))
    e.email = 'This email address looks incomplete.';
  if (!f.checkIn) e.checkIn = 'Choose your arrival date.';
  else if (f.checkIn < today) e.checkIn = 'Arrival can’t be in the past.';
  if (!f.checkOut) e.checkOut = 'Choose your departure date.';
  else if (f.checkIn && f.checkOut <= f.checkIn) e.checkOut = 'Departure must be after arrival.';
  if (!BOOKING_GUESTS.includes(f.guests)) e.guests = 'Choose a valid guest count.';
  if (f.room && !ROOMS.some((room) => room.name === f.room)) e.room = 'Choose a valid room preference.';
  if (f.request.length > BOOKING_LIMITS.request) e.request = `Keep requests under ${BOOKING_LIMITS.request} characters.`;
  return e;
}

function Field({ id, label, required, error, children, wide, half }) {
  return (
    <div className={`field${error ? ' has-error' : ''}${wide ? ' field--wide' : ''}${half ? ' field--half' : ''}`} data-modal-item>
      <label htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {children}
      <span className="field__error" id={`${id}-error`} role={error ? 'alert' : undefined}>{error}</span>
    </div>
  );
}

export default function BookingModal({ open, room, onClose }) {
  const [form, setForm] = useState(() => blank(room));
  const [errors, setErrors] = useState({});
  const [sentUrl, setSentUrl] = useState(null);
  const successRef = useRef(null);
  const formRef = useRef(null);

  // Fresh form each time the modal opens (keeping any preselected room).
  useEffect(() => {
    if (open) {
      setForm(blank(room));
      setErrors({});
      setSentUrl(null);
    }
  }, [open, room]);

  useLayoutEffect(() => {
    if (!sentUrl || REDUCED || !successRef.current) return;
    const s = successRef.current;
    gsap.timeline()
      .fromTo(s.querySelector('.success__ring'), { strokeDashoffset: 190 }, { strokeDashoffset: 0, duration: 1.4, ease: 'expo.inOut' })
      .fromTo(s.querySelector('.success__tick'), { strokeDashoffset: 40 }, { strokeDashoffset: 0, duration: 0.8, ease: 'expo.out' }, 0.8)
      .from(s.querySelectorAll('[data-success-item]'), { y: 22, autoAlpha: 0, duration: 1, stagger: 0.08, ease: 'expo.out' }, 0.5);
  }, [sentUrl]);

  const set = (key) => (e) => {
    const value = e.target.value;
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (key === 'checkIn' && value && (!f.checkOut || f.checkOut <= value)) next.checkOut = addDays(value, 1);
      return next;
    });
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const submit = (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    const firstBad = Object.keys(found)[0];
    if (firstBad) {
      formRef.current.querySelector(`#bk-${firstBad}`)?.focus();
      return;
    }
    const url = whatsAppUrl(buildWhatsAppMessage(form));
    window.open(url, '_blank', 'noopener,noreferrer');
    setSentUrl(url);
  };

  const today = toInputDate(new Date());
  const described = (k) => (errors[k] ? `bk-${k}-error` : undefined);

  return (
    <Modal open={open} onClose={onClose} labelledBy="booking-title" className="modal--booking">
      <div className="booking">
        <aside className="booking__aside" data-modal-media>
          <Picture name="room-grand" alt="" sizes="(max-width: 900px) 0px, 36vw" position="62% 50%" />
          <div className="booking__aside-copy">
            <LogoMark />
            <p>Casa De Grande<br /><span>Boutique Hotel · {HOTEL.city}</span></p>
          </div>
        </aside>

        <div className="booking__main">
          {!sentUrl ? (
            <form ref={formRef} className="booking__form" onSubmit={submit} noValidate>
              <header className="booking__head">
                <p className="eyebrow" data-modal-item>Reservations</p>
                <h2 id="booking-title" className="booking__title" data-modal-item>
                  Request your <em>stay</em>
                </h2>
                <p className="booking__sub" data-modal-item>
                  Share your dates and we’ll confirm availability personally on WhatsApp.
                </p>
              </header>

              <div className="booking__fields">
                <Field id="bk-name" label="Full Name" required error={errors.name}>
                  <input id="bk-name" data-autofocus type="text" autoComplete="name" maxLength={BOOKING_LIMITS.name} value={form.name} onChange={set('name')} aria-invalid={!!errors.name} aria-describedby={described('name')} required />
                </Field>
                <Field id="bk-phone" label="Phone Number" required error={errors.phone}>
                  <input id="bk-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+91" maxLength={BOOKING_LIMITS.phone} value={form.phone} onChange={set('phone')} aria-invalid={!!errors.phone} aria-describedby={described('phone')} required />
                </Field>
                <Field id="bk-email" label="Email Address" error={errors.email} wide>
                  <input id="bk-email" type="email" autoComplete="email" maxLength={BOOKING_LIMITS.email} value={form.email} onChange={set('email')} aria-invalid={!!errors.email} aria-describedby={described('email')} />
                </Field>
                <Field id="bk-checkIn" label="Check-in Date" half required error={errors.checkIn}>
                  <input id="bk-checkIn" type="date" min={today} value={form.checkIn} onChange={set('checkIn')} aria-invalid={!!errors.checkIn} aria-describedby={described('checkIn')} required />
                </Field>
                <Field id="bk-checkOut" label="Check-out Date" half required error={errors.checkOut}>
                  <input id="bk-checkOut" type="date" min={form.checkIn ? addDays(form.checkIn, 1) : today} value={form.checkOut} onChange={set('checkOut')} aria-invalid={!!errors.checkOut} aria-describedby={described('checkOut')} required />
                </Field>
                <Field id="bk-guests" label="Number of Guests" half required error={errors.guests}>
                  <select id="bk-guests" value={form.guests} onChange={set('guests')} aria-invalid={!!errors.guests} required>
                    {BOOKING_GUESTS.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </Field>
                <Field id="bk-room" label="Room Preference" half error={errors.room}>
                  <select id="bk-room" value={form.room} onChange={set('room')} aria-invalid={!!errors.room} aria-describedby={described('room')}>
                    <option value="">No preference</option>
                    {ROOMS.map((r) => <option key={r.id} value={r.name}>{r.name}</option>)}
                  </select>
                </Field>
                <Field id="bk-request" label="Special Request" error={errors.request} wide>
                  <textarea id="bk-request" rows={3} maxLength={BOOKING_LIMITS.request} value={form.request} onChange={set('request')} aria-invalid={!!errors.request} aria-describedby={described('request')} placeholder="Early check-in, airport pickup, a celebration…" />
                </Field>
              </div>

              <div className="booking__submit" data-modal-item>
                <button type="submit" className="btn btn--solid btn--lg btn--block">
                  <span className="btn__label">Submit Booking Request</span>
                  <Arrow className="btn__arrow" />
                </button>
                <p className="booking__note">
                  <WhatsAppGlyph /> Opens WhatsApp with your details, ready to send to {HOTEL.whatsapp.display}.
                </p>
              </div>
            </form>
          ) : (
            <div ref={successRef} className="success" role="status" aria-live="polite">
              <svg className="success__icon" viewBox="0 0 64 64" aria-hidden="true">
                <circle className="success__ring" cx="32" cy="32" r="30" />
                <path className="success__tick" d="M21 33l7 7 15-16" />
              </svg>
              <p className="eyebrow" data-success-item>Request prepared</p>
              <h2 id="booking-title" className="booking__title" data-success-item>
                WhatsApp is <em>open.</em>
              </h2>
              <p className="booking__sub" data-success-item>
                Thank you, {form.name.trim().split(' ')[0]}. Your booking details are waiting in
                WhatsApp. Just press send and our team will confirm availability shortly.
              </p>
              <div className="success__actions" data-success-item>
                <a className="btn btn--solid" href={sentUrl} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">
                  <span className="btn__label">Open WhatsApp again</span>
                  <Arrow className="btn__arrow" />
                </a>
                <button type="button" className="text-link" onClick={onClose}>Return to the hotel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M4.5 19.5l1.1-3.6A8 8 0 1 1 8.4 18.6Z" strokeLinejoin="round" />
      <path d="M9.2 8.6c.2-.5.6-.5.9-.5.3 0 .5.4.8 1 .2.5-.4 1-.4 1.2 0 .3.6 1.3 1.5 2 .8.6 1.4.8 1.6.7.3-.1.6-.8 1-.8s1.4.6 1.5.9c.1.4-.3 1.3-1.1 1.5-.9.2-2.4-.3-3.9-1.6-1.4-1.3-2.2-2.9-2.1-3.5 0-.4.1-.7.2-.9Z" />
    </svg>
  );
}
