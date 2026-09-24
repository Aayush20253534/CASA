# Casa De Grande local SEO entity checklist

This file records the canonical business identity used by the website and the manual listing work that should remain consistent with it. Structured data should reflect verified facts only.

## Canonical website identity

- Business name: **Casa De Grande Boutique Hotel**
- Short brand: **Casa De Grande**
- Phone: **+91 70070 23861**
- Address used on the website: **CY Chintamani Road, Darbhanga Colony, George Town, Prayagraj, Uttar Pradesh 211002, India**
- Map profile used by the website: **https://maps.app.goo.gl/AM9mCR7o5t4ZwwGUA**
- Coordinates: **25.4512832, 81.8564075**

## External listing cleanup

An external listing audit on 24 September 2026 found the same phone/address represented under **Casa De Grade Boutique Hotel**, while travel listings also use **Casa De Grande** and may show the street number as **2A**. Before changing the website address, confirm the official postal/Google Business Profile address with the hotel owner.

Recommended manual actions:

1. Rename the Google Business Profile to the intended canonical brand **Casa De Grande Boutique Hotel** if the current profile still says **Casa De Grade Boutique Hotel**.
2. Confirm whether **2A** is part of the official street address. If it is, update the website, Google Business Profile and major citations together rather than changing one source in isolation.
3. Keep the reservation phone number identical across the website, Google Business Profile, social profiles and directory listings.
4. Add official Instagram/Facebook URLs to the website only after they are confirmed, then include them in the `sameAs` array.
5. Do not add ratings, review counts, star ratings, prices, check-in times, capacities or event-package claims to schema unless the hotel has supplied and approved them.

## Structured-data model

The site uses one stable hotel entity ID (`/#hotel`) across the homepage and all generated SEO pages. Rooms use `HotelRoom` entities linked to the hotel through `containedInPlace`, and the banquet space uses an `EventVenue` entity linked the same way. Generated pages reference those same IDs instead of creating duplicate businesses.
