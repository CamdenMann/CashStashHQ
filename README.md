# Cash Stash HQ Website

Upload these files to a GitHub repo root, then deploy with Cloudflare Pages.

## Easy editing
Most content is in `site-data.js`.

Change:
- stats
- city names
- Instagram links
- Formspree URLs
- sponsor spotlights

## Add a city
Add a new city object in `site-data.js`, then access it at:
`city.html?city=your-city-id`

## Forms
Replace the placeholder Formspree URLs like:
`https://formspree.io/f/REPLACE_MAIN_FORM`
with real Formspree URLs.
