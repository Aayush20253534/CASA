const HOTEL = {
  name: 'Casa De Grande Boutique Hotel',
  shortName: 'Casa De Grande',
  phone: '+917007023861',
  phoneDisplay: '+91 70070 23861',
  phoneHref: 'tel:+917007023861',
  whatsapp: 'https://wa.me/919198903333',
  address: 'CY Chintamani Road, Darbhanga Colony, George Town, Prayagraj, Uttar Pradesh 211002, India',
  postalAddress: {
    streetAddress: 'CY Chintamani Road, Darbhanga Colony, George Town',
    addressLocality: 'Prayagraj',
    addressRegion: 'Uttar Pradesh',
    postalCode: '211002',
    addressCountry: 'IN',
  },
  latitude: 25.4512832,
  longitude: 81.8564075,
  maps: 'https://maps.app.goo.gl/AM9mCR7o5t4ZwwGUA',
};

const HOTEL_AMENITIES = [
  '24/7 Service',
  'High-Speed Wi-Fi',
  'Daily Housekeeping',
  'Breakfast',
  'Air Conditioning',
  'Banquet and Event Facilities',
];

export const SEO_ROUTES = [
  '/rooms/',
  '/banquet-events/',
  '/location/',
  '/nearby/',
  '/nearby/triveni-sangam/',
  '/nearby/anand-bhawan/',
  '/nearby/prayagraj-junction/',
];

const NAV = [
  ['Rooms', '/rooms/'],
  ['Banquet & Events', '/banquet-events/'],
  ['Location', '/location/'],
  ['Nearby', '/nearby/'],
];

const rooms = [
  {
    id: 'deluxe',
    name: 'Deluxe Room',
    image: '/images/room-classic-1447.webp',
    alt: 'Deluxe room at Casa De Grande Boutique Hotel in Prayagraj',
    description: 'A calm, light-filled room with an upholstered bed, lounge seating, a walnut wardrobe and ensuite bathroom.',
    features: ['Upholstered bed', 'Lounge seating', 'Walnut wardrobe', 'Ensuite bathroom'],
  },
  {
    id: 'premium',
    name: 'Premium Room',
    image: '/images/room-garden-1600.webp',
    alt: 'Premium room at Casa De Grande Boutique Hotel in George Town, Prayagraj',
    description: 'A generous room with a wide picture window, bistro table, media wall and polished marble floors.',
    features: ['Picture window', 'Bistro table for two', 'Media wall', 'Marble floors'],
  },
  {
    id: 'suite',
    name: 'Suite',
    image: '/images/room-grand-1447.webp',
    alt: 'Suite at Casa De Grande Boutique Hotel in Prayagraj',
    description: 'The hotel’s most generous room, with a king bed, sitting area, tray ceiling and blackout blinds.',
    features: ['King bed', 'Sitting area', 'Tray ceiling', 'Blackout blinds'],
  },
];

const nearby = [
  {
    name: 'Triveni Sangam',
    path: '/nearby/triveni-sangam/',
    summary: 'Plan a stay in George Town with convenient access to Prayagraj’s Triveni Sangam.',
  },
  {
    name: 'Anand Bhawan',
    path: '/nearby/anand-bhawan/',
    summary: 'Stay in George Town with Anand Bhawan and the surrounding central Prayagraj area within easy reach.',
  },
  {
    name: 'Prayagraj Junction',
    path: '/nearby/prayagraj-junction/',
    summary: 'A central Prayagraj stay with convenient road access to Prayagraj Junction.',
  },
];

const pageDefinitions = {
  '/rooms/': {
    title: 'Rooms & Suites in Prayagraj | Casa De Grande Boutique Hotel',
    description: 'Explore Deluxe, Premium and Suite rooms at Casa De Grande Boutique Hotel in George Town, Prayagraj, with Wi-Fi, housekeeping and climate control.',
    eyebrow: 'Rooms & Suites · George Town, Prayagraj',
    heading: 'Rooms designed for a quieter stay.',
    intro: 'Choose from Deluxe, Premium and Suite accommodation at Casa De Grande, a boutique hotel in George Town, Prayagraj. Each room is designed around comfortable sleep, warm interiors and practical everyday amenities.',
    image: '/images/room-grand-1447.webp',
    imageAlt: 'Suite at Casa De Grande Boutique Hotel in George Town, Prayagraj',
    body: () => `
      <section class="section" aria-labelledby="room-types-title">
        <div class="section-head">
          <p class="kicker">Accommodation</p>
          <h2 id="room-types-title">Three ways to stay</h2>
          <p>Room availability and rates are confirmed directly by the hotel. The descriptions below reflect the room types presented on the official Casa De Grande website.</p>
        </div>
        <div class="card-grid card-grid--rooms">
          ${rooms.map((room) => `
            <article class="card card--room">
              <img src="${room.image}" alt="${room.alt}" width="900" height="675" loading="lazy" decoding="async" />
              <div class="card-body">
                <h3>${room.name}</h3>
                <p>${room.description}</p>
                <ul class="feature-list">${room.features.map((feature) => `<li>${feature}</li>`).join('')}</ul>
              </div>
            </article>`).join('')}
        </div>
      </section>
      ${amenitiesSection()}
      ${locationCallout('Looking for a hotel room in central Prayagraj?', 'Casa De Grande is on CY Chintamani Road in Darbhanga Colony, George Town, with access to Anand Bhawan, Civil Lines, Prayagraj Junction and Triveni Sangam.', '/location/', 'Explore the location')}
    `,
  },
  '/banquet-events/': {
    title: 'Banquet Hall in Prayagraj | Casa De Grande Boutique Hotel',
    description: 'Discover the banquet and event spaces at Casa De Grande Boutique Hotel in George Town, Prayagraj for celebrations, gatherings and private events.',
    eyebrow: 'Banquet & Events · Prayagraj',
    heading: 'A refined setting for celebrations.',
    intro: 'Casa De Grande offers an elegant banquet setting in Prayagraj with crystal chandeliers, warm interiors and flexible hospitality for celebrations and gatherings. Contact the hotel directly for availability, event requirements and current arrangements.',
    image: '/images/hall-grand-1600.webp',
    imageAlt: 'Banquet hall with crystal chandeliers at Casa De Grande in Prayagraj',
    body: () => `
      <section class="section split">
        <div>
          <p class="kicker">The setting</p>
          <h2>Banquet and event space in George Town</h2>
          <p>The banquet hall is part of Casa De Grande Boutique Hotel in George Town, Prayagraj. Its chandelier-lit interiors provide a polished backdrop for social gatherings and private celebrations.</p>
          <p>Event capacity, décor, menus, packages and pricing can vary by requirement, so this page intentionally does not publish unverified numbers. The hotel team can confirm current options directly.</p>
          <div class="button-row">
            <a class="button" href="${HOTEL.phoneHref}">Call about an event</a>
            <a class="text-link" href="${HOTEL.whatsapp}" target="_blank" rel="noopener noreferrer">Message on WhatsApp</a>
          </div>
        </div>
        <figure class="media-card">
          <img src="/images/hall-soiree-1600.webp" alt="Casa De Grande banquet hall in Prayagraj set for an event" width="1200" height="675" loading="lazy" decoding="async" />
          <figcaption>Event-ready interiors at Casa De Grande</figcaption>
        </figure>
      </section>
      ${locationCallout('Stay and gather in one George Town address', 'Guests can combine accommodation with an event enquiry at the same boutique hotel location in Prayagraj.', '/rooms/', 'Explore rooms & suites')}
    `,
  },
  '/location/': {
    title: 'Hotel in George Town, Prayagraj | Casa De Grande Location',
    description: 'Find Casa De Grande Boutique Hotel on CY Chintamani Road, Darbhanga Colony, George Town, Prayagraj, near key city landmarks and transport links.',
    eyebrow: 'Location · George Town, Prayagraj',
    heading: 'A central base for discovering Prayagraj.',
    intro: 'Casa De Grande is located on CY Chintamani Road in Darbhanga Colony, George Town. The hotel’s central Prayagraj address places guests within practical reach of major city landmarks, Civil Lines and transport connections.',
    image: '/images/exterior-1455.webp',
    imageAlt: 'Casa De Grande Boutique Hotel exterior in George Town, Prayagraj',
    body: () => `
      <section class="section split">
        <div>
          <p class="kicker">Hotel address</p>
          <h2>Casa De Grande, George Town</h2>
          <address>${HOTEL.address}</address>
          <div class="button-row">
            <a class="button" href="${HOTEL.maps}" target="_blank" rel="noopener noreferrer">View on Google Maps</a>
            <a class="text-link" href="${HOTEL.phoneHref}">Call ${HOTEL.phoneDisplay}</a>
          </div>
        </div>
        <div class="info-panel">
          <h3>Nearby Prayagraj destinations</h3>
          <ul class="route-list">
            <li><a href="/nearby/anand-bhawan/"><span>Anand Bhawan</span><span>View stay guide</span></a></li>
            <li><a href="/nearby/prayagraj-junction/"><span>Prayagraj Junction</span><span>View stay guide</span></a></li>
            <li><a href="/nearby/triveni-sangam/"><span>Triveni Sangam</span><span>View stay guide</span></a></li>
            <li><a href="/nearby/"><span>Civil Lines & other landmarks</span><span>Explore nearby</span></a></li>
          </ul>
        </div>
      </section>
      ${locationCallout('Planning a stay in Prayagraj?', 'Explore the hotel’s Deluxe, Premium and Suite accommodation before contacting the team for current availability.', '/rooms/', 'View rooms & suites')}
    `,
  },
  '/nearby/': {
    title: 'Places Near Casa De Grande Hotel in Prayagraj | Nearby Guide',
    description: 'Explore key Prayagraj landmarks near Casa De Grande Boutique Hotel in George Town, including Anand Bhawan, Civil Lines, Prayagraj Junction and Triveni Sangam.',
    eyebrow: 'Nearby · Prayagraj',
    heading: 'Explore Prayagraj from George Town.',
    intro: 'Casa De Grande’s George Town location works as a practical base for city stays, with cultural landmarks, central neighbourhoods, the railway junction and Triveni Sangam accessible by road.',
    image: '/images/exterior-1455.webp',
    imageAlt: 'Casa De Grande Boutique Hotel in George Town, Prayagraj',
    body: () => `
      <section class="section">
        <div class="section-head">
          <p class="kicker">Stay guides</p>
          <h2>Useful nearby destinations</h2>
          <p>These pages are designed to help guests understand the hotel’s location relative to common Prayagraj destinations without pretending every journey takes the same amount of time in real city traffic.</p>
        </div>
        <div class="card-grid">
          ${nearby.map((place) => `
            <article class="card card--text">
              <div class="card-body">
                <p class="card-label">Prayagraj</p>
                <h3>${place.name}</h3>
                <p>${place.summary}</p>
                <a class="text-link" href="${place.path}">Read the stay guide</a>
              </div>
            </article>`).join('')}
        </div>
      </section>
      ${locationCallout('Need the hotel’s exact address?', HOTEL.address, '/location/', 'View location details')}
    `,
  },
  '/nearby/triveni-sangam/': nearbyPage({
    place: 'Triveni Sangam',
    title: 'Hotel Near Triveni Sangam, Prayagraj | Casa De Grande',
    description: 'Stay at Casa De Grande Boutique Hotel in George Town when visiting Triveni Sangam in Prayagraj, with rooms, Wi-Fi, breakfast and direct booking assistance.',
    heading: 'A George Town stay for your Sangam visit.',
    intro: 'Casa De Grande gives visitors a comfortable base in George Town for trips to Triveni Sangam and other central Prayagraj destinations. Return from the city to a quieter hotel setting with rooms, breakfast, Wi-Fi and 24/7 service.',
    detail: 'Triveni Sangam is one of the city destinations highlighted from Casa De Grande’s location. Journey time can vary with traffic, events and local road conditions, so guests should use live directions when planning a visit.',
  }),
  '/nearby/anand-bhawan/': nearbyPage({
    place: 'Anand Bhawan',
    title: 'Hotel Near Anand Bhawan, Prayagraj | Casa De Grande',
    description: 'Stay at Casa De Grande Boutique Hotel in George Town, Prayagraj when visiting Anand Bhawan, with comfortable rooms and direct booking assistance.',
    heading: 'Stay in George Town near Anand Bhawan.',
    intro: 'Casa De Grande is a boutique hotel in George Town, making it a convenient option for guests planning time around Anand Bhawan and central Prayagraj. The hotel combines comfortable rooms with Wi-Fi, breakfast, housekeeping and 24/7 service.',
    detail: 'Anand Bhawan is one of the key nearby landmarks featured by the hotel. For the most accurate journey planning, guests should check current road and traffic conditions from Casa De Grande before departure.',
  }),
  '/nearby/prayagraj-junction/': nearbyPage({
    place: 'Prayagraj Junction',
    title: 'Hotel Near Prayagraj Junction | Casa De Grande Boutique Hotel',
    description: 'Casa De Grande Boutique Hotel in George Town offers a central Prayagraj stay with road access to Prayagraj Junction and direct room booking assistance.',
    heading: 'A comfortable stay with access to Prayagraj Junction.',
    intro: 'For guests arriving or departing by rail, Casa De Grande offers a George Town base with comfortable rooms and direct access to central Prayagraj roads. The hotel is suited to short city stays as well as longer visits.',
    detail: 'Prayagraj Junction is included among the nearby transport points on the hotel website. Travel time varies by traffic and time of day, so live directions are the best source immediately before a journey.',
  }),
};

function nearbyPage({ place, title, description, heading, intro, detail }) {
  return {
    title,
    description,
    eyebrow: `Stay near ${place} · Prayagraj`,
    heading,
    intro,
    image: '/images/exterior-1455.webp',
    imageAlt: 'Casa De Grande Boutique Hotel exterior in George Town, Prayagraj',
    body: () => `
      <section class="section split">
        <div>
          <p class="kicker">From Casa De Grande</p>
          <h2>Visiting ${place}</h2>
          <p>${detail}</p>
          <p>Casa De Grande is at ${HOTEL.address}</p>
          <div class="button-row">
            <a class="button" href="${HOTEL.maps}" target="_blank" rel="noopener noreferrer">Open hotel on Maps</a>
            <a class="text-link" href="/rooms/">Explore hotel rooms</a>
          </div>
        </div>
        <div class="info-panel">
          <p class="kicker">At the hotel</p>
          <h3>For the stay around your plans</h3>
          <ul class="feature-list feature-list--large">
            <li>Deluxe, Premium and Suite room types</li>
            <li>High-speed Wi-Fi</li>
            <li>Breakfast</li>
            <li>24/7 service</li>
            <li>Daily housekeeping</li>
            <li>Air-conditioned rooms</li>
          </ul>
        </div>
      </section>
      ${nearbyLinks(place)}
    `,
  };
}

function amenitiesSection() {
  return `
    <section class="section section--soft">
      <div class="section-head">
        <p class="kicker">Hotel amenities</p>
        <h2>Comforts for a Prayagraj stay</h2>
      </div>
      <div class="mini-grid">
        <div><strong>24/7 Service</strong><span>A team within reach throughout your stay.</span></div>
        <div><strong>High-Speed Wi-Fi</strong><span>Connectivity across rooms and common spaces.</span></div>
        <div><strong>Breakfast</strong><span>A freshly prepared start to the day.</span></div>
        <div><strong>Housekeeping</strong><span>Daily care for guest rooms.</span></div>
        <div><strong>Climate Control</strong><span>Individually air-conditioned rooms.</span></div>
        <div><strong>Banquet & Events</strong><span>Event space within the hotel.</span></div>
      </div>
    </section>`;
}

function locationCallout(title, text, href, label) {
  return `
    <section class="callout">
      <div>
        <p class="kicker">Casa De Grande · Prayagraj</p>
        <h2>${title}</h2>
        <p>${text}</p>
      </div>
      <a class="button button--light" href="${href}">${label}</a>
    </section>`;
}

function nearbyLinks(current) {
  return `
    <section class="section section--compact">
      <div class="section-head">
        <p class="kicker">Explore more</p>
        <h2>Other nearby stay guides</h2>
      </div>
      <div class="link-grid">
        ${nearby.filter((place) => place.name !== current).map((place) => `<a href="${place.path}"><strong>${place.name}</strong><span>${place.summary}</span></a>`).join('')}
        <a href="/location/"><strong>Hotel location</strong><span>See Casa De Grande’s George Town address and map details.</span></a>
      </div>
    </section>`;
}

function breadcrumbs(path, page) {
  const items = [{ name: 'Home', url: '/' }];
  if (path.startsWith('/nearby/') && path !== '/nearby/') items.push({ name: 'Nearby', url: '/nearby/' });
  items.push({ name: page.eyebrow.split(' · ')[0].replace('Stay near ', ''), url: path });
  return items;
}

function absolute(siteUrl, path) {
  return `${siteUrl}${path === '/' ? '/' : path}`;
}

function hotelSchema(siteUrl) {
  return {
    '@type': 'Hotel',
    '@id': `${siteUrl}/#hotel`,
    name: HOTEL.name,
    alternateName: HOTEL.shortName,
    description: 'A boutique hotel in George Town, Prayagraj offering comfortable rooms, breakfast, Wi-Fi, 24/7 service and banquet facilities.',
    url: `${siteUrl}/`,
    telephone: HOTEL.phone,
    logo: {
      '@type': 'ImageObject',
      '@id': `${siteUrl}/#logo`,
      url: `${siteUrl}/images/logo-mark.png`,
    },
    image: [
      `${siteUrl}/images/exterior-1455.webp`,
      `${siteUrl}/images/room-grand-1447.webp`,
      `${siteUrl}/images/hall-grand-1600.webp`,
    ],
    address: { '@type': 'PostalAddress', ...HOTEL.postalAddress },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: HOTEL.latitude,
      longitude: HOTEL.longitude,
    },
    hasMap: HOTEL.maps,
    sameAs: [HOTEL.maps],
    amenityFeature: HOTEL_AMENITIES.map((name) => ({
      '@type': 'LocationFeatureSpecification',
      name,
      value: true,
    })),
    containsPlace: [
      ...rooms.map((room) => ({ '@id': `${siteUrl}/#room-${room.id}` })),
      { '@id': `${siteUrl}/#banquet-event-space` },
    ],
    mainEntityOfPage: { '@id': `${siteUrl}/#webpage` },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: HOTEL.phone,
      contactType: 'reservations',
      url: `${siteUrl}/#book`,
    },
  };
}

function websiteSchema(siteUrl) {
  return {
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: `${siteUrl}/`,
    name: HOTEL.name,
    alternateName: HOTEL.shortName,
    inLanguage: 'en-IN',
    publisher: { '@id': `${siteUrl}/#hotel` },
  };
}

function roomSchemas(siteUrl) {
  return rooms.map((room) => ({
    '@type': 'HotelRoom',
    '@id': `${siteUrl}/#room-${room.id}`,
    name: room.name,
    description: room.description,
    image: `${siteUrl}${room.image}`,
    containedInPlace: { '@id': `${siteUrl}/#hotel` },
    amenityFeature: room.features.map((name) => ({
      '@type': 'LocationFeatureSpecification',
      name,
      value: true,
    })),
  }));
}

function banquetVenueSchema(siteUrl) {
  return {
    '@type': 'EventVenue',
    '@id': `${siteUrl}/#banquet-event-space`,
    name: 'Casa De Grande Banquet & Event Space',
    description: 'An elegant banquet and event space within Casa De Grande Boutique Hotel in George Town, Prayagraj.',
    image: `${siteUrl}/images/hall-grand-1600.webp`,
    address: { '@type': 'PostalAddress', ...HOTEL.postalAddress },
    containedInPlace: { '@id': `${siteUrl}/#hotel` },
  };
}

function routeEntityNodes(path, siteUrl, canonical) {
  if (path === '/rooms/') {
    return [
      ...roomSchemas(siteUrl),
      {
        '@type': 'ItemList',
        '@id': `${canonical}#room-types`,
        name: 'Casa De Grande room types',
        numberOfItems: rooms.length,
        itemListElement: rooms.map((room, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: { '@id': `${siteUrl}/#room-${room.id}` },
        })),
      },
    ];
  }

  if (path === '/banquet-events/') return [banquetVenueSchema(siteUrl)];

  const landmarks = {
    '/nearby/triveni-sangam/': 'Triveni Sangam',
    '/nearby/anand-bhawan/': 'Anand Bhawan',
    '/nearby/prayagraj-junction/': 'Prayagraj Junction',
  };

  if (landmarks[path]) {
    return [{
      '@type': 'Place',
      '@id': `${canonical}#landmark`,
      name: landmarks[path],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Prayagraj',
        addressRegion: 'Uttar Pradesh',
        addressCountry: 'IN',
      },
    }];
  }

  return [];
}

function routeMainEntity(path, siteUrl, canonical) {
  if (path === '/rooms/') return `${canonical}#room-types`;
  if (path === '/banquet-events/') return `${siteUrl}/#banquet-event-space`;
  return `${siteUrl}/#hotel`;
}

function routeMentions(path, canonical) {
  if (path.startsWith('/nearby/') && path !== '/nearby/') return [{ '@id': `${canonical}#landmark` }];
  return undefined;
}

function jsonLd(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function renderSeoPage(path, siteUrl) {
  const page = pageDefinitions[path];
  if (!page) throw new Error(`Unknown SEO route: ${path}`);

  const canonical = absolute(siteUrl, path);
  const crumbs = breadcrumbs(path, page);
  const primaryImageId = `${canonical}#primaryimage`;
  const entityNodes = routeEntityNodes(path, siteUrl, canonical);
  const mentions = routeMentions(path, canonical);
  const webPage = {
    '@type': 'WebPage',
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: page.title,
    description: page.description,
    inLanguage: 'en-IN',
    isPartOf: { '@id': `${siteUrl}/#website` },
    about: { '@id': `${siteUrl}/#hotel` },
    mainEntity: { '@id': routeMainEntity(path, siteUrl, canonical) },
    primaryImageOfPage: { '@id': primaryImageId },
    publisher: { '@id': `${siteUrl}/#hotel` },
    breadcrumb: { '@id': `${canonical}#breadcrumb` },
  };
  if (mentions) webPage.mentions = mentions;

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      hotelSchema(siteUrl),
      websiteSchema(siteUrl),
      ...entityNodes,
      {
        '@type': 'ImageObject',
        '@id': primaryImageId,
        url: `${siteUrl}${page.image}`,
        contentUrl: `${siteUrl}${page.image}`,
        caption: page.imageAlt,
      },
      webPage,
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumb`,
        itemListElement: crumbs.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: absolute(siteUrl, item.url),
        })),
      },
    ],
  };

  const nav = NAV.map(([label, href]) => `<a href="${href}"${path === href ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  const crumbHtml = crumbs.map((item, index) => index === crumbs.length - 1
    ? `<span aria-current="page">${item.name}</span>`
    : `<a href="${item.url}">${item.name}</a>`).join('<span aria-hidden="true">/</span>');

  return `<!doctype html>
<html lang="en-IN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>${page.title}</title>
  <meta name="description" content="${page.description}" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <meta name="theme-color" content="#18201D" />
  <link rel="canonical" href="${canonical}" />
  <link rel="icon" type="image/png" href="/favicon.png" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="preload" as="image" href="${page.image}" fetchpriority="high" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="en_IN" />
  <meta property="og:site_name" content="${HOTEL.name}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:title" content="${page.title}" />
  <meta property="og:description" content="${page.description}" />
  <meta property="og:image" content="${siteUrl}${page.image}" />
  <meta property="og:image:alt" content="${page.imageAlt}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${page.title}" />
  <meta name="twitter:description" content="${page.description}" />
  <meta name="twitter:image" content="${siteUrl}${page.image}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Manrope:wght@300;400;500;600&display=swap" />
  <link rel="stylesheet" href="/seo-pages.css" />
  <link rel="stylesheet" href="/seo-motion.css" />
  <script src="/seo-pages.js" defer></script>
  <script type="application/ld+json">${jsonLd(schema)}</script>
</head>
<body>
  <header class="site-header">
    <a class="brand" href="/" aria-label="Casa De Grande Boutique Hotel home">
      <img src="/images/logo-mark.png" alt="" width="42" height="42" />
      <span><strong>Casa De Grande</strong><small>Boutique Hotel · Prayagraj</small></span>
    </a>
    <nav aria-label="SEO pages">${nav}</nav>
    <a class="header-book" href="/#book">Book Now</a>
  </header>

  <main>
    <section class="hero-static">
      <div class="hero-copy">
        <nav class="breadcrumbs" aria-label="Breadcrumb">${crumbHtml}</nav>
        <p class="eyebrow">${page.eyebrow}</p>
        <h1>${page.heading}</h1>
        <p class="lead">${page.intro}</p>
        <div class="button-row">
          <a class="button" href="/#book">Book your stay</a>
          <a class="text-link" href="${HOTEL.phoneHref}">${HOTEL.phoneDisplay}</a>
        </div>
      </div>
      <figure class="hero-image">
        <img src="${page.image}" alt="${page.imageAlt}" width="1455" height="1081" loading="eager" fetchpriority="high" decoding="async" />
      </figure>
    </section>

    ${page.body()}
  </main>

  <footer class="seo-footer">
    <div>
      <strong>${HOTEL.name}</strong>
      <p>${HOTEL.address}</p>
    </div>
    <div class="footer-links">
      <a href="/">Main hotel experience</a>
      <a href="/rooms/">Rooms</a>
      <a href="/banquet-events/">Banquet & Events</a>
      <a href="/location/">Location</a>
      <a href="/nearby/">Nearby</a>
    </div>
    <div>
      <a href="${HOTEL.phoneHref}">${HOTEL.phoneDisplay}</a><br />
      <a href="${HOTEL.whatsapp}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
    </div>
  </footer>
</body>
</html>\n`;
}
