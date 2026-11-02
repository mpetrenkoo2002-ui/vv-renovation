# VV Renovation tracking — 27 October 2026

Published commit: fc6c5d4. All 14 public tracked pages and both tracking scripts were checked against production. Automated checks: 21 passed.

## Owner browsing

Enable: https://www.vvrenovation.ca/?vv_owner=on

Disable: https://www.vvrenovation.ca/?vv_owner=off

Open the enable link once in each browser/device used for work. The setting survives changing networks, navigation and page reloads. A visible owner banner confirms it is on. New browsers, private sessions or cleared website data need activation again. Do not use this link in public social profiles or ads. Ordinary site links remain unchanged.

The mode prevents the GA4 and Meta libraries from loading. Public page navigation and forms still work. A real form submitted in owner mode still reaches Formspree, with traffic_type=internal; analytics conversions are suppressed. JavaScript is required for this mode.

## Separate contact intent from actual leads

| Action | GA4 | Meta | Meaning |
|---|---|---|---|
| Phone link click | phone_call_click | PhoneClick (custom) | Phone app/number selected; call completion unknown |
| Email link click | email_click | EmailClick (custom) | Email app selected; email delivery unknown |
| Formspree accepts quote | generate_lead | Lead | Server accepted a quote request |

Contact events include source, medium, campaign, first touch, destination business number/address, page location, UTC timestamp, Vancouver hour and weekday. No submitted visitor name, phone, email or message is sent as an event parameter. Repeated clicks are counted as repeated interactions; event count is not unique people or answered calls.

GA4 property: 527605377, measurement ID G-0G7MC17H0V. Meta Pixel: 1789259645630228, owned by VV Renovation. No duplicate GA4 or Meta initializers were introduced.

## Viewing the data

GA4 Reports → View user engagement & retention → Events → phone_call_click shows click counts and users when processed. Realtime can show recently received events, subject to active traffic filters.

For source/hour analysis, use Explore → Free form. Add Event name, Contact source, Contact medium, Contact campaign, Contact destination, Contact location, Business hour Vancouver, Business weekday Vancouver; metrics Event count and Total users. Filter Event name exactly phone_call_click. Choose a date range. Use source as rows and hour as columns, or separate tables. These custom dimensions were registered today; Google says new custom dimensions can take 24–48 hours to become reportable and do not recover historical parameter data.

Definitions also registered for accepted-form Lead source, Lead medium and Lead campaign. Unique interaction IDs and exact timestamps were deliberately not registered as high-cardinality dimensions.

## Source links for public profiles

Instagram bio: https://www.vvrenovation.ca/?utm_source=instagram&utm_medium=organic_social&utm_campaign=profile

Facebook profile: https://www.vvrenovation.ca/?utm_source=facebook&utm_medium=organic_social&utm_campaign=profile

Google Business Profile website: https://www.vvrenovation.ca/?utm_source=google&utm_medium=organic&utm_campaign=business_profile

These links are prepared, but external profiles were not edited. Use campaign-specific tags for ads. Untagged links in apps or private messages may have no referrer and appear direct/unattributed; attribution cannot reconstruct information the browser never receives.

## Verification and remaining dependencies

- Production phone-click request observed with event phone_call_click, source tracking_test, campaign VV-CONTACT-20261027-01, location hero, Vancouver hour 15. No actual call or quote submission was made. GA4 report receipt of that new event was not confirmed during this session.
- Public page loaded one GA4 library and one Meta Pixel library, with PageView requests observed. A Meta endpoint request followed the phone click; receipt of the new custom PhoneClick event in Events Manager was not confirmed during this session.
- Production owner mode and reload loaded zero GA4/Meta resources. Screenshot: owner-mode-live.png.
- Meta Events Manager shows existing website activity. vvrenovation.ca and all subdomains were added to its traffic allow list. The default Netlify preview domain is outside that allow list.
- Meta Business showed no connected ad account on the dataset and zero eligible ad accounts in the asset picker. Linking an existing ad account needs its availability/access. No new ad account was created.
- Meta Conversions API connection is pending, not verified or installed. No new access tokens were created.
- Google Ads, TikTok and LinkedIn advertising tags were not installed: verified account/tag IDs were not supplied. These require the respective business accounts and tag setup. Existing GA4 alone is not Google Ads remarketing.
- Actual call time, duration and answered/missed status require a call tracking integration with forwarding numbers. Google Ads offers website call conversions for eligible ad traffic; attributing calls across other sources requires a suitable broader call tracking service. No numbers, subscriptions or paid services were ordered.

References: https://support.google.com/analytics/answer/14240153?hl=en and https://support.google.com/google-ads/answer/6095883/track-calls-to-a-phone-number-on-a-website
