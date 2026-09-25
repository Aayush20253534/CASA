# CASA — Final Client & Domain Handoff Checklist

This file contains the remaining work for the Casa De Grande website after completion of the technical SEO, crawlable page architecture, performance optimization, security hardening, and release-verification phases.

The current codebase is technically production-ready. The remaining items depend on **client-confirmed hotel information** and the **final production domain**.

---

## 1. Confirm the final hotel name and NAP details with the client

Use **Casa De Grande** as the canonical brand unless the client explicitly confirms otherwise.

Confirm these details with the hotel:

- Official business name
- Exact street address
- Locality / neighbourhood
- City
- State
- PIN code
- Main phone number
- WhatsApp booking number
- Google Maps / Google Business Profile URL
- Official website domain

Current website values:

```text
Casa De Grande
CY Chintamani Road, Darbhanga Colony
George Town, Prayagraj
Uttar Pradesh 211002, India

Phone:
+91 70070 23861

WhatsApp:
+91 91989 03333
```

### Important

Some external listings have shown variations such as:

```text
Casa De Grade
Casa De Grand
```

Do not add these spellings to the website or schema unless the client confirms that one is an official trading name.

The website, Google Business Profile, social profiles, directories and other listings should eventually use the **same Name, Address and Phone information**.

---

## 2. Verify room types and room details

The current source contains:

```js
// Room names and details are placeholders. Edit freely.
```

The website currently presents:

```text
Deluxe Room
Premium Room
Suite
```

Ask the client to confirm whether these are the actual room categories.

Also verify the features assigned to each room.

### Deluxe Room

Current features:

```text
Upholstered bed
Lounge seating
Walnut wardrobe
Ensuite bathroom
```

### Premium Room

Current features:

```text
Picture window
Bistro table for two
Media wall
Marble floors
```

### Suite

Current features:

```text
King bed
Sitting area
Tray ceiling
Blackout blinds
```

Also ask the client for:

- Correct room names
- Correct descriptions
- Bed type
- Occupancy
- Room size, if they want it published
- Included amenities
- Breakfast inclusion rules
- Extra-bed policy
- Check-in time
- Check-out time
- Whether rates should be displayed publicly

Do **not** invent any values.

### Files to update after confirmation

Primary content:

```text
src/data/content.js
```

Structured SEO data:

```text
scripts/seo-pages.mjs
index.html
```

If room names/features change, keep the visible website and structured data synchronized.

---

## 3. Verify nearby distances

The homepage currently contains approximate straight-line distances and the source explicitly says:

```js
// Straight-line distances from the hotel, rounded. Verify before publishing.
```

Current values:

```text
Anand Bhawan              ≈ 1 km
Chandra Shekhar Azad Park ≈ 1.5 km
Civil Lines               ≈ 2.5 km
Prayagraj Junction        ≈ 3 km
Triveni Sangam            ≈ 4.5 km
Prayagraj Airport         ≈ 13 km
```

Ask the client to confirm whether they want:

1. approximate straight-line distance,
2. approximate road distance, or
3. no numerical distance at all.

Road distance is usually more understandable to guests.

If the client cannot verify the numbers, prefer wording such as:

```text
Nearby
Easy road access
Within convenient reach
```

instead of publishing uncertain kilometre values.

### File to update

```text
src/data/content.js
```

---

## 4. Verify banquet and event information

The current banquet page intentionally avoids publishing unverified numbers.

Ask the client for:

- Maximum guest capacity
- Seating capacity
- Standing capacity
- Event types accepted
- Wedding / engagement availability
- Birthday / private-event availability
- Corporate-event availability
- Catering options
- Decoration options
- Parking availability
- Package pricing, only if they want it public

Only add data that the client confirms.

Potential files:

```text
scripts/seo-pages.mjs
src/data/content.js
```

Do not add fake ratings, prices, event capacities or packages to schema.

---

## 5. Confirm hotel amenities

Current site amenities include:

```text
24/7 Service
Comfortable Rooms
Premium Interiors
High-Speed Wi-Fi
Housekeeping
Dining & Breakfast
Banquet & Events
Climate Control
```

Ask the client to confirm all of them.

Also ask whether the hotel provides:

```text
Parking
Room service
Restaurant
Airport pickup
Railway-station pickup
Laundry
Elevator
Power backup
Hot water
Family rooms
Business facilities
Wheelchair accessibility
Pet policy
Smoking/non-smoking rooms
```

Only add amenities that actually exist.

---

# DOMAIN ACTIVATION

## 6. Connect the final domain

Once the client provides the final domain, connect it to the Vercel project.

Examples:

```text
casadegrande.in
www.casadegrande.in
```

Choose one canonical hostname.

Recommended pattern:

```text
https://casadegrande.in
```

and redirect:

```text
https://www.casadegrande.in
```

to the canonical domain.

Or use the reverse if the client prefers `www`.

Do not allow both hostnames to behave as separate indexable websites.

---

## 7. Change SITE_URL in Vercel

The project currently uses:

```text
https://casa-mauve-three.vercel.app
```

Once the final domain is active, set:

```text
SITE_URL=https://YOUR-DOMAIN.com
```

Example:

```text
SITE_URL=https://casadegrande.in
```

### Important

Do not include:

```text
/
?query
#fragment
```

at the end.

Correct:

```text
https://casadegrande.in
```

Incorrect:

```text
https://casadegrande.in/
https://casadegrande.in?x=1
```

After changing `SITE_URL`, redeploy the production website.

The following are automatically regenerated from this value:

- canonical URLs
- Open Graph URLs
- sitemap URLs
- robots sitemap URL
- structured-data entity IDs
- WebPage IDs
- Hotel entity references
- release-verification expectations

---

## 8. Verify production after domain change

On your computer:

```powershell
$env:SITE_URL="https://YOUR-DOMAIN.com"
```

Example:

```powershell
$env:SITE_URL="https://casadegrande.in"
```

Then run:

```powershell
npm ci
npm audit --audit-level=high
npm run release:verify
```

Expected results include:

```text
[security] Source checks passed.
[security] Production build checks passed.
[release] Production build verification passed for 8 routes.
```

After Vercel deployment finishes:

```powershell
npm run release:check:live
```

Expected:

```text
[release] Live deployment verification passed for 8 routes.
```

---

# ROUTES TO VERIFY

Open every route manually after the final deployment:

```text
/
 /rooms/
 /banquet-events/
 /location/
 /nearby/
 /nearby/triveni-sangam/
 /nearby/anand-bhawan/
 /nearby/prayagraj-junction/
```

Also verify:

```text
/robots.txt
/sitemap.xml
```

The SEO pages must show their own content and **must not fall back to the homepage**.

---

# GOOGLE SEARCH CONSOLE

## 9. Add the final domain to Google Search Console

Prefer a Domain Property when possible:

```text
casadegrande.in
```

Complete DNS verification.

---

## 10. Submit sitemap

Submit:

```text
https://YOUR-DOMAIN.com/sitemap.xml
```

Example:

```text
https://casadegrande.in/sitemap.xml
```

---

## 11. Request indexing

Use URL Inspection for:

```text
https://YOUR-DOMAIN.com/
https://YOUR-DOMAIN.com/rooms/
https://YOUR-DOMAIN.com/banquet-events/
https://YOUR-DOMAIN.com/location/
https://YOUR-DOMAIN.com/nearby/
https://YOUR-DOMAIN.com/nearby/triveni-sangam/
https://YOUR-DOMAIN.com/nearby/anand-bhawan/
https://YOUR-DOMAIN.com/nearby/prayagraj-junction/
```

The homepage, rooms, banquet, location and at least one nearby page should be inspected immediately after launch.

---

# GOOGLE BUSINESS PROFILE

## 12. Normalize the hotel listing

Make sure Google Business Profile uses the same:

```text
Business name
Address
Phone
Website
```

as the website.

Add the new website URL to the Google Business Profile.

Remove or correct inconsistent spellings such as:

```text
Casa De Grade
Casa De Grand
```

if those listings refer to the same hotel and the client confirms `Casa De Grande` is the correct name.

Do not modify unrelated businesses with similar names.

---

## 13. Update important third-party listings

Where accessible, update high-value listings such as:

- Google Business Profile
- Google Maps
- Facebook
- Instagram
- Booking platforms
- Hotel directories
- Local business directories
- Travel directories

Use consistent NAP information.

Avoid creating dozens of low-quality directory listings merely for backlinks.

---

# STRUCTURED DATA VERIFICATION

## 14. Validate schema

Check representative pages using:

```text
Google Rich Results Test
Schema Markup Validator
```

Recommended pages:

```text
/
 /rooms/
 /banquet-events/
 /location/
 /nearby/triveni-sangam/
```

Verify the entity graph contains:

```text
Hotel
WebSite
WebPage
HotelRoom
EventVenue
BreadcrumbList
ImageObject
```

where appropriate.

Do not add:

```text
aggregateRating
review
starRating
priceRange
numberOfRooms
checkinTime
checkoutTime
event capacity
```

unless the client provides verified information.

---

# PERFORMANCE

## 15. Run PageSpeed Insights after the custom domain is live

Test both:

```text
Mobile
Desktop
```

Test at minimum:

```text
/
 /rooms/
```

Pay attention to:

```text
LCP
INP
CLS
FCP
TBT
```

The homepage is deliberately animation-heavy, so do not remove the cinematic sequence merely to chase a synthetic score.

The current performance architecture already:

- delays non-critical hero frames,
- adapts frame concurrency,
- defers modal chunks,
- delays smooth-scroll/reveal initialization,
- caches static images and frames,
- preloads critical hero content.

Only optimize further if production measurements identify a real bottleneck.

---

# SECURITY

## 16. Run the final security commands

Before production handoff:

```powershell
npm audit --audit-level=high
npm run security:check
npm run build
npm run security:check:dist
npm run release:check
```

Or simply:

```powershell
npm run release:verify
```

Then after deployment:

```powershell
npm run release:check:live
```

---

## 17. Never put secrets in VITE variables

Anything named:

```text
VITE_*
```

is shipped to the browser.

Never place:

```text
API secrets
private keys
database passwords
service-account keys
payment secrets
private tokens
```

inside frontend environment variables.

This site currently does not need private server credentials.

---

# OPTIONAL FINAL IMPROVEMENTS

These are not required to launch but may be added later.

## Hotel policy pages

Consider adding:

```text
/privacy/
 /terms/
 /cancellation-policy/
 /hotel-policies/
```

especially if direct online payments or server-side bookings are introduced later.

## Real booking backend

Current booking enquiries are prepared in the browser and sent through WhatsApp.

If the client later wants:

```text
live availability
online payments
booking IDs
email confirmations
admin dashboard
booking history
room inventory
```

that should be implemented as a proper backend system rather than extending the current client-only WhatsApp flow.

## Reviews

Only add review schema when reviews are genuine, attributable and compliant with search-engine structured-data policies.

---

# FINAL CLIENT INFORMATION CHECKLIST

Before declaring the website completely finished, obtain confirmation for:

```text
[ ] Official hotel name
[ ] Exact address
[ ] PIN code
[ ] Main phone
[ ] WhatsApp number
[ ] Google Maps listing
[ ] Final domain
[ ] Room categories
[ ] Room descriptions
[ ] Room amenities
[ ] Check-in time
[ ] Check-out time
[ ] Nearby distances
[ ] Hotel amenities
[ ] Banquet capacity
[ ] Banquet/event services
[ ] Parking availability
[ ] Breakfast policy
[ ] Social-media URLs
```

---

# GIT WORKFLOW AFTER CLIENT CHANGES

After editing the client-confirmed information:

```powershell
git status
git diff
```

Run the full validation:

```powershell
npm run release:verify
```

Then:

```powershell
git add .
git commit -m "chore: finalize Casa De Grande production content"
git push origin main
git push upstream main
```

After the final domain configuration:

```powershell
git add .
git commit -m "chore: finalize production domain and SEO configuration"
git push origin main
git push upstream main
```

If everything is done in one change, use:

```powershell
git add .
git commit -m "chore: finalize Casa De Grande production handoff"
git push origin main
git push upstream main
```

---

# FINAL POST-DEPLOYMENT COMMAND

After the final production deployment:

```powershell
$env:SITE_URL="https://YOUR-DOMAIN.com"
npm run release:check:live
```

Do not consider the migration to the custom domain complete until this command returns:

```text
[release] Live deployment verification passed for 8 routes.
```

---

# Completion Definition

The CASA website is considered fully production-complete when:

```text
✓ Client-confirmed hotel data is published
✓ Room information is verified
✓ Nearby distances are verified or removed
✓ Google Business Profile NAP is consistent
✓ Final custom domain is connected
✓ SITE_URL uses the custom domain
✓ Production redeployment completes
✓ npm run release:verify passes
✓ npm run release:check:live passes
✓ sitemap.xml is submitted to Google Search Console
✓ priority pages are requested for indexing
✓ mobile and desktop PageSpeed tests are reviewed
```

At that point, further work becomes normal maintenance and SEO iteration rather than unfinished implementation.
