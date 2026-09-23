// Stylised monochrome map of central Prayagraj, drawn to scale (≈55px per km)
// around the hotel. Rivers and roads are simplified; landmark positions come
// from their coordinates relative to the hotel.
const LANDMARKS = [
  { name: 'Anand Bhawan', x: 300, y: 249, anchor: 'middle', dy: -12 },
  { name: 'Azad Park', x: 247, y: 262, anchor: 'end', dx: -10 },
  { name: 'Civil Lines', x: 175, y: 293, anchor: 'middle', dy: -12 },
  { name: 'Prayagraj Jn.', x: 136, y: 332, anchor: 'middle', dy: 20 },
  { name: 'Triveni Sangam', x: 463, y: 474, anchor: 'end', dx: -12, dy: 4 },
];

export default function LocationMap() {
  return (
    <svg className="map" viewBox="0 0 600 600" role="img" aria-label="Stylised map showing Casa De Grande in George Town, Prayagraj, near Anand Bhawan, Civil Lines, Prayagraj Junction and Triveni Sangam">
      <defs>
        <pattern id="map-grid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M30 0H0V30" fill="none" className="map__grid" />
        </pattern>
        <radialGradient id="map-vignette" cx="50%" cy="50%" r="62%">
          <stop offset="60%" stopColor="var(--cream)" stopOpacity="0" />
          <stop offset="100%" stopColor="var(--cream)" stopOpacity="0.95" />
        </radialGradient>
      </defs>

      <rect width="600" height="600" className="map__ground" />
      <rect width="600" height="600" fill="url(#map-grid)" />

      {/* Ganga (from the north) and Yamuna (from the west) meet at the Sangam */}
      <g className="map__river">
        <path d="M395 -10C430 90 525 170 507 290S470 420 463 474" />
        <path d="M-10 440C90 420 200 472 300 452S420 470 463 474" />
        <path d="M463 474C520 500 560 540 612 566" />
      </g>
      <g className="map__river-line">
        <path d="M395 -10C430 90 525 170 507 290S470 420 463 474" />
        <path d="M-10 440C90 420 200 472 300 452S420 470 463 474" />
        <path d="M463 474C520 500 560 540 612 566" />
      </g>

      <g className="map__roads">
        <path d="M-10 296C120 300 220 292 300 300S470 318 610 296" />
        <path d="M296 -10C302 110 294 220 300 300S312 400 300 452" />
        <path d="M60 120C150 190 230 250 300 300S420 400 463 474" />
        <path d="M-10 210C120 240 200 250 247 262S330 250 420 190 560 120 610 110" />
        <path d="M120 -10C140 120 160 220 175 293S160 400 150 460" />
        <path d="M-10 380C80 360 100 345 136 332S240 320 300 300" />
        <path d="M380 -10C380 90 360 200 340 300S330 380 340 460" />
      </g>
      <path className="map__rail" d="M-10 350C60 340 100 336 136 332S260 318 330 330 470 360 560 330" />

      <rect width="600" height="600" fill="url(#map-vignette)" />

      {LANDMARKS.map((l) => (
        <g key={l.name} className="map__landmark">
          <circle cx={l.x} cy={l.y} r="4" />
          <text x={l.x + (l.dx || 0)} y={l.y + (l.dy || 4)} textAnchor={l.anchor}>{l.name}</text>
        </g>
      ))}

      <g className="map__airport">
        <path d="M44 372H14M22 364l-8 8 8 8" />
        <text x="16" y="396">Airport · 13 km</text>
      </g>

      <g className="map__pin" transform="translate(300 300)">
        <circle className="map__pulse" r="12" />
        <circle className="map__pulse map__pulse--late" r="12" />
        <circle className="map__dot" r="7" />
        <text className="map__pin-label" x="16" y="30">Casa De Grande</text>
        <text className="map__pin-sub" x="16" y="46">George Town</text>
      </g>

      <g className="map__compass" transform="translate(556 44)">
        <circle r="16" />
        <path d="M0 -10L4 3H-4Z" />
        <text y="-22" textAnchor="middle">N</text>
      </g>
      <g className="map__scale" transform="translate(28 556)">
        <path d="M0 0H55M0 -4V4M55 -4V4" />
        <text x="66" y="4">1 km</text>
      </g>
    </svg>
  );
}
