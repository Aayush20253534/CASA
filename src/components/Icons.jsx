// Fine-line amenity icons, drawn on a 48px grid with a 1.2px stroke.
const paths = {
  bell: (
    <>
      <path d="M8 36h32" />
      <path d="M11 36c0-8 5.8-14 13-14s13 6 13 14" />
      <path d="M24 22v-4" />
      <path d="M21 18h6" />
      <path d="M6 40h36" />
    </>
  ),
  bed: (
    <>
      <path d="M6 36V14" />
      <path d="M42 36V26" />
      <path d="M6 30h36" />
      <path d="M6 26h36" />
      <rect x="10" y="19" width="10" height="7" rx="3" />
      <path d="M24 26v-5a2 2 0 0 1 2-2h12a4 4 0 0 1 4 4v3" />
    </>
  ),
  arch: (
    <>
      <path d="M12 40V20a12 12 0 0 1 24 0v20" />
      <path d="M17 40V21a7 7 0 0 1 14 0v19" />
      <path d="M8 40h32" />
      <path d="M17 30h14" />
    </>
  ),
  wifi: (
    <>
      <path d="M6 19a26 26 0 0 1 36 0" />
      <path d="M12 25.5a17 17 0 0 1 24 0" />
      <path d="M18 32a8.5 8.5 0 0 1 12 0" />
      <circle cx="24" cy="37.5" r="1.4" />
    </>
  ),
  sparkle: (
    <>
      <path d="M24 8c1.2 8.4 4.6 11.8 13 13-8.4 1.2-11.8 4.6-13 13-1.2-8.4-4.6-11.8-13-13 8.4-1.2 11.8-4.6 13-13Z" />
      <path d="M37 31c.5 3.4 1.8 4.7 5 5-3.2.5-4.5 1.8-5 5-.5-3.2-1.8-4.5-5-5 3.2-.3 4.5-1.6 5-5Z" />
    </>
  ),
  cup: (
    <>
      <path d="M10 20h24v8a12 12 0 0 1-24 0v-8Z" />
      <path d="M34 23h2.5a4.5 4.5 0 0 1 0 9H33" />
      <path d="M8 42h28" />
      <path d="M17 9c-1.5 2 1.5 3.5 0 6M23 8c-1.5 2 1.5 3.5 0 6M29 9c-1.5 2 1.5 3.5 0 6" />
    </>
  ),
  chandelier: (
    <>
      <path d="M24 5v9" />
      <path d="M11 20h26" />
      <path d="M13 20l3 10h16l3-10" />
      <path d="M16 30l4 7h8l4-7" />
      <path d="M18 20v4M24 20v6M30 20v4" />
      <path d="M24 37v5" />
      <circle cx="24" cy="16" r="2" />
    </>
  ),
  climate: (
    <>
      <path d="M24 6v36" />
      <path d="M8.4 15l31.2 18" />
      <path d="M8.4 33l31.2-18" />
      <path d="M19 9l5 4 5-4M19 39l5-4 5 4" />
      <path d="M8 21l6-1-2-6M40 27l-6 1 2 6" />
    </>
  ),
};

export default function Icon({ name, className = '' }) {
  return (
    <svg
      className={`icon ${className}`}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
