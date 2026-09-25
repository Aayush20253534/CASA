import { createContext, useContext } from 'react';
import { HOTEL, ROOMS } from '../data/content';

export const BookingContext = createContext({
  openBooking: () => {},
  viewRoom: () => {},
});

export const useBooking = () => useContext(BookingContext);

export const BOOKING_GUESTS = Object.freeze(['1', '2', '3', '4', '5', '6', 'More than 6']);
export const BOOKING_LIMITS = Object.freeze({
  name: 80,
  phone: 24,
  email: 254,
  request: 500,
  message: 1800,
});

const CONTROL_CHARS = /[\u0000-\u001F\u007F-\u009F\u202A-\u202E\u2066-\u2069]/g;
const MULTILINE_CONTROL_CHARS = /[\u0000-\u0009\u000B-\u001F\u007F-\u009F\u202A-\u202E\u2066-\u2069]/g;
const pad = (n) => String(n).padStart(2, '0');

const singleLine = (value, max) => String(value ?? '')
  .replace(CONTROL_CHARS, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, max);

const multiline = (value, max) => String(value ?? '')
  .replace(/\r\n?/g, '\n')
  .replace(MULTILINE_CONTROL_CHARS, ' ')
  .replace(/[ \t]+/g, ' ')
  .replace(/\n{3,}/g, '\n\n')
  .trim()
  .slice(0, max);

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
  const roomNames = new Set(ROOMS.map((room) => room.name));
  const name = singleLine(f.name, BOOKING_LIMITS.name);
  const phone = singleLine(f.phone, BOOKING_LIMITS.phone);
  const email = singleLine(f.email, BOOKING_LIMITS.email);
  const guests = BOOKING_GUESTS.includes(f.guests) ? f.guests : '2';
  const room = roomNames.has(f.room) ? f.room : '';
  const request = multiline(f.request, BOOKING_LIMITS.request);
  const nights = nightsBetween(f.checkIn, f.checkOut);

  return [
    `Hello ${HOTEL.name} ${HOTEL.descriptor},`,
    '',
    'I would like to make a booking enquiry.',
    '',
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email || 'Not provided'}`,
    `Check-in: ${prettyDate(f.checkIn)}`,
    `Check-out: ${prettyDate(f.checkOut)} (${nights} night${nights === 1 ? '' : 's'})`,
    `Guests: ${guests}`,
    `Room Preference: ${room || 'No preference'}`,
    `Special Request: ${request || 'None'}`,
    '',
    'Please confirm availability and booking details.',
  ].join('\n').slice(0, BOOKING_LIMITS.message);
}

export function whatsAppUrl(message) {
  const number = String(HOTEL.whatsapp.number ?? '').replace(/\D/g, '');
  if (!/^\d{8,15}$/.test(number)) throw new Error('Invalid WhatsApp booking number.');
  const url = new URL(`https://wa.me/${number}`);
  url.searchParams.set('text', String(message ?? '').slice(0, BOOKING_LIMITS.message));
  return url.toString();
}
