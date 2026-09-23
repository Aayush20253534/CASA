// ─────────────────────────────────────────────────────────────
//  Casa De Grande — editable site content
//  Everything a hotel manager may want to change lives here.
// ─────────────────────────────────────────────────────────────

export const HOTEL = {
  name: 'Casa De Grande',
  descriptor: 'Boutique Hotel',
  city: 'Prayagraj',
  address: [
    'CY Chintamani Road, Darbhanga Colony',
    'George Town, Prayagraj',
    'Uttar Pradesh 211002, India',
  ],
  phone: { display: '+91 70070 23861', href: 'tel:+917007023861' },
  // Booking requests are sent here (country code + number, digits only).
  whatsapp: { number: '919198903333', display: '+91 91989 03333' },
  // Add an address such as 'stay@yourdomain.com' to show it in the footer.
  email: '',
  mapsUrl: 'https://maps.app.goo.gl/AM9mCR7o5t4ZwwGUA',
  directionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=25.4512832,81.8564075',
  coords: '25.45° N · 81.86° E',
  // Paste full profile URLs to show them in the footer.
  social: { instagram: '', facebook: '' },
};

export const NAV_LINKS = [
  { label: 'Home', href: '#top' },
  { label: 'Rooms', href: '#rooms' },
  { label: 'Experience', href: '#experience' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Location', href: '#location' },
];

export const EXPERIENCE = [
  {
    title: 'The Rooms',
    text: 'Thoughtfully designed spaces created for comfort and calm.',
    image: 'bath-detail',
    alt: 'Rain shower against veined grey marble with a potted plant and amenities',
    href: '#rooms',
    position: '64% 50%',
  },
  {
    title: 'The Experience',
    text: 'A boutique hospitality experience shaped around detail.',
    image: 'corridor',
    alt: 'Guest corridor with crystal chandelier and walnut doors',
    href: '#amenities',
  },
  {
    title: 'The Atmosphere',
    text: 'Quiet luxury, warm interiors and timeless character.',
    image: 'hall-grand',
    alt: 'Banquet hall lit by tiered crystal chandeliers',
    href: '#gallery',
  },
  {
    title: 'The Location',
    text: 'A convenient base for discovering the destination.',
    image: 'exterior',
    alt: 'Casa De Grande façade at dusk',
    href: '#location',
    position: '50% 70%',
  },
];

// Room names and details are placeholders. Edit freely.
export const ROOMS = [
  {
    id: 'deluxe',
    name: 'Deluxe Room',
    image: 'room-classic',
    alt: 'Deluxe room with navy upholstered bed, walnut wardrobe and lounge chairs',
    short: 'A calm, light-filled retreat with a reading corner and a softly glowing ceiling.',
    long:
      'Our Deluxe Room is a calm, light-filled space: an upholstered bed dressed in crisp linen, a walnut wardrobe, a pair of lounge chairs for morning tea, and warm cove lighting that makes evenings slow and easy.',
    features: ['Upholstered bed', 'Lounge seating', 'Walnut wardrobe', 'Ensuite bathroom'],
  },
  {
    id: 'premium',
    name: 'Premium Room',
    image: 'room-garden',
    position: '74% 50%',
    alt: 'Premium room with a wide window onto the trees and a bistro table',
    short: 'Generous proportions and a wide window onto the trees for slow mornings.',
    long:
      'The Premium Room opens onto the trees through a wide picture window. A bistro table for two, polished marble underfoot and a dedicated media wall make it an easy place to settle in for a longer stay.',
    features: ['Picture window', 'Bistro table for two', 'Media wall', 'Marble floors'],
  },
  {
    id: 'suite',
    name: 'Suite',
    image: 'room-grand',
    alt: 'Suite with king bed beneath a glowing tray ceiling',
    short: 'Our most generous space, with a king bed beneath a glowing tray ceiling.',
    long:
      'Our most generous room. A king bed with a tall upholstered headboard sits beneath a glowing tray ceiling, with a sitting area, a bench for unpacking and plenty of space to spread out and unwind.',
    features: ['King bed', 'Sitting area', 'Tray ceiling', 'Blackout blinds'],
  },
];

export const MOMENTS = [
  { phrase: 'Slow mornings.', caption: 'Morning light through the trees', image: 'room-garden', position: '80% 50%', alt: 'Sunlit room with a view of trees' },
  { phrase: 'Quiet evenings.', caption: 'Soft light, turned down', image: 'room-grand', position: '64% 50%', alt: 'Warmly lit suite in the evening' },
  { phrase: 'Time well spent.', caption: 'Gatherings under crystal', image: 'hall-grand', position: '58% 35%', alt: 'Banquet hall under crystal chandeliers' },
];

// icon keys map to the line icons in components/Icons.jsx
export const AMENITIES = [
  { icon: 'bell', title: '24/7 Service', text: 'A front desk that never sleeps and a team always within reach.' },
  { icon: 'bed', title: 'Comfortable Rooms', text: 'Upholstered beds, crisp linen and blackout blinds for unhurried sleep.' },
  { icon: 'arch', title: 'Premium Interiors', text: 'Marble floors, warm cove lighting and timeless furnishings.' },
  { icon: 'wifi', title: 'High-Speed Wi-Fi', text: 'Reliable connectivity across rooms and common spaces.' },
  { icon: 'sparkle', title: 'Housekeeping', text: 'Daily, discreet housekeeping that keeps every space immaculate.' },
  { icon: 'cup', title: 'Dining & Breakfast', text: 'Freshly prepared breakfast to begin the day well.' },
  { icon: 'chandelier', title: 'Banquet & Events', text: 'An elegant hall beneath crystal chandeliers for celebrations.' },
  { icon: 'climate', title: 'Climate Control', text: 'Individually air-conditioned rooms for year-round comfort.' },
];

export const GALLERY = [
  { image: 'exterior', category: 'Exterior', caption: 'The façade at blue hour', ratio: 'wide', alt: 'Casa De Grande façade with three arched windows at dusk' },
  { image: 'room-grand', category: 'Rooms', caption: 'The Suite', ratio: 'wide', alt: 'Suite with king bed and tray ceiling' },
  { image: 'bath-detail', category: 'Details', caption: 'Stone, chrome and rain showers', ratio: 'wide', alt: 'Rain shower against veined grey marble' },
  { image: 'corridor', category: 'Interiors', caption: 'Crystal-lit corridors', ratio: 'wide', alt: 'Corridor with chandelier and walnut doors' },
  { image: 'room-classic', category: 'Rooms', caption: 'The Deluxe Room', ratio: 'wide', alt: 'Deluxe room with lounge chairs' },
  { image: 'hall-soiree', category: 'Atmosphere', caption: 'Dressed for an occasion', ratio: 'wide', alt: 'Banquet tables set for an event' },
  { image: 'room-garden', category: 'Atmosphere', caption: 'Green outlooks', ratio: 'wide', alt: 'Room overlooking trees' },
];

// Straight-line distances from the hotel, rounded. Verify before publishing.
export const NEARBY = [
  { name: 'Anand Bhawan', distance: '≈ 1 km' },
  { name: 'Chandra Shekhar Azad Park', distance: '≈ 1.5 km' },
  { name: 'Civil Lines', distance: '≈ 2.5 km' },
  { name: 'Prayagraj Junction', distance: '≈ 3 km' },
  { name: 'Triveni Sangam', distance: '≈ 4.5 km' },
  { name: 'Prayagraj Airport', distance: '≈ 13 km' },
];
