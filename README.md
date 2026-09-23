# Casa De Grande Boutique Hotel

Cinematic, frontend-only website for Casa De Grande Boutique Hotel, George Town, Prayagraj.

- **Scroll-driven hero film.** A Higgsfield drone shot travels from the real façade, through the entrance, into a guest room. It is played as a 121-frame image sequence on a `<canvas>`, scrubbed by scroll, with chapter captions (The Arrival, The Threshold, The Room).
- **Editorial sections:** introduction, experience, rooms and suites, a pinned "Moments" sequence, amenities, a horizontal gallery, location with a stylised map, booking and a closing call to action.
- **Booking without a backend.** Every **Book Now** opens a form. Submitting it opens WhatsApp (`+91 91989 03333`) with all the details pre-filled.
- **Built for phones.** On phones the film opens as a framed window on the whole façade and grows to full screen, following the camera. Phones also get a swipe gallery, a full-screen menu and a sticky booking bar.

Built with React 19, Vite, GSAP (ScrollTrigger + SplitText) and Lenis.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # serve the build locally
```

`dist/` is a static site and can be deployed to Netlify, Vercel, Cloudflare Pages, GitHub Pages or any static host.

## Editing content

All copy and contact details live in [`src/data/content.js`](src/data/content.js):

| What | Where |
| --- | --- |
| Phone, WhatsApp number, address, map links | `HOTEL` |
| Email address (hidden while empty) | `HOTEL.email` |
| Instagram / Facebook (hidden while empty) | `HOTEL.social` |
| Room names, descriptions, features | `ROOMS` (placeholders, edit freely) |
| Amenities | `AMENITIES` |
| Gallery order and captions | `GALLERY` |
| Nearby places and distances | `NEARBY` (approximate straight-line distances; please verify) |

The WhatsApp message format is built in [`src/lib/booking.js`](src/lib/booking.js).

## Assets

| Folder | Contents |
| --- | --- |
| `image/` | Original hotel photography (source). |
| `source-assets/logo.png` | Original logo (source). |
| `source-video/hero-upscaled.mp4` | Higgsfield hero film (Kling 3.0, 15 s, upscaled to 2K). |
| `public/images/` | Graded, responsive AVIF + WebP photos, logo mask, favicons (generated). |
| `public/frames/d`, `public/frames/m` | Hero film frames for desktop (4:3) and phones (portrait crop that follows the camera), AVIF + WebP (generated). |

Regenerate the photos after replacing anything in `image/`:

```bash
npm run assets
```

Regenerate the film frames from the master video (requires ffmpeg):

```bash
ffmpeg -i source-video/hero-upscaled.mp4 -vf "select='not(mod(n\,3))',hqdn3d=1:1:3:3,eq=saturation=0.88:contrast=1.03:brightness=0.005,colorbalance=rs=0.015:bs=-0.02:rm=0.01:bm=-0.015" -fps_mode vfr -q:v 2 <tmp>/%04d.jpg
node scripts/build-frames.mjs <tmp>
```

## Performance notes

- Hero frames load coarse-to-fine (every 16th, then 8th, then 4th…), so the film can be scrubbed almost immediately. Only a window of frames around the playhead is kept decoded, which keeps memory low on phones.
- Photos are lazy-loaded and served in AVIF with WebP fallback. The booking and room modals are code-split.
- `prefers-reduced-motion` turns off smooth scrolling, the film scrub and the reveals. The custom cursor is desktop-only.
