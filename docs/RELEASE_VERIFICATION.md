# Casa De Grande release verification

Part 7 turns the SEO/security work into a release gate. A production deployment is considered ready only after the local build checks and the live deployment checks both pass.

## 1. Set the canonical production origin

Set `SITE_URL` to the final HTTPS origin in Vercel Production environment variables. Do not include a query string, fragment, username/password, or trailing slash.

Example:

```text
SITE_URL=https://example.com
```

All canonicals, Open Graph URLs, sitemap entries, structured-data IDs and live verification use this value.

## 2. Pre-deployment gate

Run from a clean working tree:

```powershell
npm ci
npm audit --audit-level=high
npm run release:verify
```

`release:verify` runs source security checks, the production build, built CSP/security checks and the Part 7 SEO/release checks.

The Part 7 checks fail on objective release defects including:

- missing generated route HTML;
- wrong, duplicate or unresolved canonicals;
- missing index/follow directives;
- missing Open Graph/Twitter metadata;
- malformed JSON-LD;
- broken Hotel/WebSite/WebPage/Breadcrumb entity relationships;
- sitemap omissions, extras or duplicates;
- robots.txt pointing at the wrong origin;
- broken same-origin document links or missing referenced build assets;
- production source maps or environment files.

Title/description length observations are warnings rather than hard failures.

## 3. Deploy, then verify the real origin

After the production deployment is live:

```powershell
$env:SITE_URL="https://example.com"
npm run release:check:live
```

The live check requests every indexed route plus `robots.txt` and `sitemap.xml`. It verifies HTTP success, distinct canonical metadata, schema consistency and deployed security headers including HSTS, CSP, clickjacking protection, COOP and permissions policy.

Do not treat a successful local build as proof that deployment headers or routing are correct. The live check exists specifically to catch that gap.

## 4. Search release checklist

After the live command passes:

1. Verify the production property/domain in Google Search Console.
2. Submit `/sitemap.xml`.
3. Use URL Inspection on the homepage, `/rooms/`, `/banquet-events/`, `/location/` and at least one `/nearby/` guide.
4. Confirm Google-selected canonical matches the declared canonical after indexing data becomes available.
5. Validate representative structured data with Google's Rich Results Test / Schema Markup Validator as applicable.
6. Check the final production domain in PageSpeed Insights on both mobile and desktop. Performance scores can vary by network/device, so investigate field Core Web Vitals when enough real-user data exists rather than chasing a single synthetic score.
7. Keep the hotel's name, phone, address and Maps/Google Business Profile details consistent with `docs/local-seo-entity-checklist.md`.

## Indexed routes

- `/`
- `/rooms/`
- `/banquet-events/`
- `/location/`
- `/nearby/`
- `/nearby/triveni-sangam/`
- `/nearby/anand-bhawan/`
- `/nearby/prayagraj-junction/`

Any intentional addition/removal should update `SEO_ROUTES`; sitemap generation and release verification derive from that source of truth.
