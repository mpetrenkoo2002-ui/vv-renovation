# VV Renovation SEO Progress

Last updated: 2026-09-16

## Current baseline

### Google Search Console

Window: 2026-08-18 through 2026-09-14 (last 28 days)

- Clicks: 10
- Impressions: 845
- CTR: 1.2%
- Average position: 29.4
- Indexed pages: 6
- Not indexed: 4 (3 redirects, 1 alternate `/index.html` URL with a proper canonical)

Top non-brand opportunities:

| Query | Clicks | Impressions |
| --- | ---: | ---: |
| accent wall renovation cost | 0 | 52 |
| bathroom renovation richmond | 0 | 44 |
| home renovation richmond | 0 | 43 |
| renovation contractor richmond | 0 | 39 |
| kitchen renovation richmond | 0 | 35 |
| general contractor | 0 | 30 |
| vancouver renovation | 0 | 29 |
| faux concrete vancouver | 0 | 27 |

Top pages:

| Page | Clicks | Impressions |
| --- | ---: | ---: |
| https://www.vvrenovation.ca/ | 8 | 168 |
| https://vvrenovation.ca/ | 1 | 504 |
| https://www.vvrenovation.ca/accent-walls.html | 1 | 148 |

The apex domain redirects to `www`, while the prior canonical tags and sitemap declared the apex domain. This created conflicting consolidation signals and split Search Console reporting.

### GA4

Window: 2026-08-19 through 2026-09-15 (last 28 days)

- Total sessions: 118
- Organic Search sessions: 43 (36.44%)
- Organic engaged sessions: 17
- Organic engagement rate: 39.53%
- Organic average engagement time: 14 seconds
- Organic key events before correction: 0
- The property received `generate_lead`, but it was not marked as a key event.

Notable landing-page signal:

- `/concrete-scanning-core-drilling.html`: 8 sessions, 2 active users, 4m 56s average engagement time per session.

## Changes made on 2026-09-16

- Marked `generate_lead` as a GA4 key event.
- Updated analytics so quote-form submissions, phone clicks and email clicks roll up to `generate_lead`, while their detailed interaction events remain available.
- Standardized canonicals, Open Graph URLs, structured-data URLs, sitemap URLs and the robots sitemap directive on `https://www.vvrenovation.ca`.
- Added `richmond-home-renovation.html`, targeting the Richmond renovation queries already receiving impressions.
- Added the Richmond page to the service menu, homepage copy, services page and sitemap.
- Fixed the homepage's broken `drywall.html` link.
- Validated sitemap XML, JSON-LD, canonical tags, local links and JavaScript syntax.
- Verified the new Richmond page at desktop and mobile breakpoints.

## Changes made on 2026-09-16 — accent-wall cost opportunity

- Expanded the existing accent-wall service page around the highest-impression clickless query, `accent wall renovation cost`.
- Added a visible Vancouver planning-cost section covering painted, panelled/slat, hand-finished plaster, microcement and marble-effect walls.
- Clearly labelled the ranges as market references rather than fixed VV Renovation prices.
- Added cost drivers, a project-specific estimate CTA and a more qualified quote form field for finish type and wall size.
- Added a matching FAQ answer and structured-data entry.
- Added the cost content to the CMS data model so future admin edits do not remove the optimization.
- Updated the page title and description to include cost intent without creating a competing URL.

## Search Console query-to-page mapping — 2026-09-16

Window: 2026-06-15 through 2026-09-14 (last 3 months)

| Query | Clicks | Impressions | CTR | Avg. position | Ranking page before deployment |
| --- | ---: | ---: | ---: | ---: | --- |
| bathroom renovation richmond | 1 | 55 | 1.8% | 2.7 | `https://vvrenovation.ca/` |
| home renovation richmond | 1 | 52 | 1.9% | 1.1 | `https://vvrenovation.ca/` |
| kitchen renovation richmond | 0 | 48 | 0% | 6.0 | `https://vvrenovation.ca/` |
| richmond renovation | 0 | 118 | 0% | 1.8 | `https://vvrenovation.ca/` |
| renovation contractor richmond | 0 | 39 | 0% | 1.0 | `https://vvrenovation.ca/` |
| faux concrete vancouver | 0 | 49 | 0% | 75.8 | `https://www.vvrenovation.ca/accent-walls.html` |

Interpretation:

- Richmond demand is already visible at strong average positions, but the legacy apex homepage receives the impressions and CTR remains weak. The new Richmond page is intended to give Google a more relevant canonical destination and a more specific search snippet after deployment and indexing.
- Google already assigns `faux concrete vancouver` to the accent-wall page, so improving that page is preferable to creating a competing URL.

## Changes made on 2026-09-16 — faux concrete opportunity

- Added a dedicated `Faux Concrete Walls in Vancouver` section to the existing accent-wall page.
- Explained the difference between a decorative concrete-look coating and poured, structural or polished concrete to qualify enquiries accurately.
- Added finish options, sample-approval guidance and a concrete-look quote CTA.
- Added a matching FAQ and structured-data entry.
- Updated the meta description, hero copy and microcement service card with the exact search language.
- Added the new section to the CMS data model so future edits preserve the optimization.

## Competitor/content observations

Richmond competitors consistently use dedicated city pages with:

- Richmond-specific service headings and neighbourhood relevance
- kitchen, bathroom and whole-home scope summaries
- cost or estimate guidance
- strata, permit and scheduling information
- project proof, reviews and prominent call/quote actions

Representative pages reviewed:

- https://www.reno-stars.com/en/areas/richmond/
- https://www.pccrenovations.ca/serves-in/richmond
- https://quayconstruction.ca/richmond/bathroom-renovation-richmond/
- https://renewco.ca/renovation-contractors-richmond/
- https://yz-painting.ca/services/accent-walls-panelling
- https://dixoncustomcarpentry.com/wood-slat-accent-walls-ontario/
- https://hometailors.ca/services/feature-accent-walls
- https://shapeofpaint.com/vancouver/custom-millwork-feature-walls

## Follow-up checkpoints

After deployment:

1. Confirm the live Richmond page returns 200 and declares its `www` canonical.
2. Submit or refresh the `www` sitemap in Search Console and inspect the new Richmond URL.
3. Check GA4 Realtime/DebugView for `generate_lead` with `lead_type` values for form, phone and email.
4. After 7–14 days, compare indexing and query-to-page assignment for the Richmond page.
5. After 28 days, compare organic clicks, impressions, CTR, engagement and key events with this baseline.
6. Compare accent-wall impressions, CTR and average position after the cost section is deployed and indexed.
7. Compare `faux concrete vancouver` impressions and average position after the new section is indexed.

Deployment status: local changes are ready but not yet verified on the production site.
