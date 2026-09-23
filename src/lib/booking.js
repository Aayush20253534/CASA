import { createContext, useContext } from 'react';
import { HOTEL } from '../data/content';

export const BookingContext = createContext({
  openBooking: () => {},
  viewRoom: () => {},
});

export const useBooking = () => useContext(BookingContext);

const pad = (n) => String(n).padStart(2, '0');

export const toInputDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const addDays = (iso, days) => {
  const [y, m, d] = iso.split('-').map(Number);
  return toInputDate(new Date(y, m - 1, d + days));
};

export const nightsBetween = (a, b) => {
  const [y1, m1, d1] = a.split('-').map(Number);
  const [y2, m2, d2] = b.split('-').map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000);
};

export const prettyDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export function buildWhatsAppMessage(f) {
  const nights = nightsBetween(f.checkIn, f.checkOut);
  return [
    `Hello ${HOTEL.name} ${HOTEL.descriptor},`,
    '',
    'I would like to make a booking enquiry.',
    '',
    `Name: ${f.name.trim()}`,
    `Phone: ${f.phone.trim()}`,
    `Email: ${f.email.trim() || 'Not provided'}`,
    `Check-in: ${prettyDate(f.checkIn)}`,
    `Check-out: ${prettyDate(f.checkOut)} (${nights} night${nights === 1 ? '' : 's'})`,
    `Guests: ${f.guests}`,
    `Room Preference: ${f.room || 'No preference'}`,
    `Special Request: ${f.request.trim() || 'None'}`,
    '',
    'Please confirm availability and booking details.',
  ].join('\n');
}

export const whatsAppUrl = (message) =>
  `https://wa.me/${HOTEL.whatsapp.number}?text=${encodeURIComponent(message)}`;
