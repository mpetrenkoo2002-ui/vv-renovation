# VV Renovation — Google Ads tracking connected

Verified on 28 October 2026 (UTC). Service dashboards display their own reporting time zones.

## Existing components reused

- GA4 property 527605377; measurement ID G-0G7MC17H0V.
- Existing Google tag GT-PBKBBN5R, named VV renovation.
- Existing Google Ads account 971-771-4509, confirmed by the owner in this chat.
- Existing advertising destination AW-17683165064, previously on Untitled tag.
- Existing Meta Pixel 1789259645630228, owned by VV Renovation.

No new Google Analytics property, Meta Pixel, Tag Manager account, advertising account or website tracking script was created. No duplicate GA4 or Meta initializer was added. The pre-existing unused duplicate Google tag was not activated or deleted.

## Changes saved in the existing accounts

1. Linked GA4 VV Renovation to Google Ads 971-771-4509. Personalized advertising is enabled and auto-tagging is enabled. The option granting Google Ads users access to edit Analytics features was disabled.
2. Added the existing AW-17683165064 destination to the existing Google tag GT-PBKBBN5R. The GA4 destination remains present. Ignore duplicate instances of on-page configuration remains checked.
3. Imported generate_lead from GA4 as one new conversion action: VV Renovation (web) generate_lead, ID 7877577776. Before import, Ads contained three system conversion actions and no quote-form conversion.
4. Set this conversion to Primary, category Submit lead forms, count One per ad interaction, no monetary value. Set the Submit lead forms goal as an account-default goal. Existing system actions were preserved.

The website emits generate_lead only after Formspree accepts a quote request. Telephone and email clicks remain separate contact events and are not imported as primary leads. No second native Ads conversion was added for the same accepted form.

## Verification

- The GA4 link showed Link created successfully and Completed (1).
- Google tag settings showed both G-0G7MC17H0V and AW-17683165064 destinations saved.
- Google Ads showed the imported form conversion as Primary, One, with no conversion value, and the goal as Account-default / Active.
- On the public site, the observed resource inventory included one gtag.js loader with ID G-0G7MC17H0V and a Google Ads request to googleads.g.doubleclick.net/pagead/viewthroughconversion/17683165064/ with event gtag.config. Meta PageView was also observed. The test URL was labelled utm_source=tracking_test, utm_medium=internal, utm_campaign=VV-ADS-20261028-01.
- After restoring owner mode, the public page showed the owner banner and zero observed resources matching GA4, Google Ads/DoubleClick or Meta tracking hosts.
- Meta Events Manager showed PhoneClick / Active / Meta Pixel / 1 for the earlier controlled phone-click test. This confirms receipt of that earlier custom event. Meta's overview did not expose its individual parameters.
- No real call, email or quote submission was sent. No advertisement was launched, no budget was changed and no paid service or phone number was ordered.
- No new Ads-attributed quote conversion was generated or verified end to end. Ads reports currently show No recent conversions; a saved conversion configuration is not proof of a delivered customer lead.

## Remaining limits

- Actual completed calls, manually dialled calls, duration and answered/missed status are not captured by the website's phone-click event. They require a forwarding-number call tracking integration. The existing Ads setting Call reporting on does not by itself install website number substitution.
- The Meta business portfolio has no added advertising account. The existing Pixel receives events, but no ad account was created or connected. Conversions API remains pending and was not represented as active.
- Linking GA4 and Google Ads and installing the Ads destination does not mean a remarketing campaign is running or that audience-size/consent eligibility requirements have been met. No campaign was created or enabled.
- Google reporting and newly registered GA4 custom dimensions can take time to process. Historical missing attribution cannot be reconstructed from a new setup.

## Owner links

Enable: https://www.vvrenovation.ca/?vv_owner=on

Disable: https://www.vvrenovation.ca/?vv_owner=off

Open the enable link once per working browser/device. The setting persists across changing networks. New browsers, private sessions and cleared site data need activation again. Owner mode was left enabled in the checked Chrome browser.

## Evidence

- google-tag-ads-destination.png
- google-ads-lead-goal.png
- meta-phone-click-confirmed.png
- owner-mode-all-trackers-off.png

Official references: https://support.google.com/analytics/answer/9379420?hl=en and https://support.google.com/analytics/answer/10632359?hl=en
