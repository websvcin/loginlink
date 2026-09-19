---
title: Risk & Anti-Abuse
---

# Risk & Anti-Abuse

Three independent, mostly-set-and-forget controls: a weighted login risk score, a limiter against email/username enumeration, and country-based sign-in restriction. Most organizations never touch these — the defaults are deliberately sensible — but they're fully tunable when you need to.

## Login risk scoring

**Console → Sign-in Policy → Sign-in Risk Policy** scores every sign-in attempt against eight weighted signals. The page opens with a live diagram of what every sign-in currently goes through at your settings — scored 0–100, then routed to allowed/challenged/blocked based on where it lands — so the effect of the thresholds below is never left abstract:

| Signal | What it detects |
|---|---|
| New device | Browser/OS fingerprint never seen for this user in the last 90 days |
| New location | First sign-in from this country within the configured window |
| Impossible travel | Country changed since the last sign-in faster than plausible travel allows |
| TOR / VPN exit node | Sign-in IP matches a known anonymizer network |
| Off-hours activity | Sign-in outside the user's typical hours |
| Recent failed logins | 3+ failed attempts for this user in the last hour |
| Recent MFA failures | 3+ failed MFA challenges for this user in the last hour |
| New account | Account is newer than a configured age threshold |

Each signal's weight (0–25) is independently tunable and resettable to its default. The summed score sorts into three tiers — **LOW**, **MEDIUM**, **HIGH** — via two boundaries you set (the MEDIUM ceiling must stay below the block threshold), and a top **block threshold** (0–100) above which a sign-in is refused outright rather than just flagged. The block threshold itself is capped at a platform-set ceiling, enforced both when you save it and again at scoring time — so a platform owner who later lowers the ceiling doesn't leave an organization that saved a looser value grandfathered in.

Supporting tunables: the minimum hours between two sign-ins for a country change to be considered plausible (impossible-travel), the window for "new location," and the age threshold for "new account."

![The Sign-in Risk Policy page's live diagram, showing scored sign-ins routed to allowed/MFA-challenged/blocked outcomes at the current thresholds](/img/screenshots/console-login-risk-settings.png)

The platform's own default weights sum to more than 100 (110, in the current defaults) — the total is shown on the page for transparency, and the applied score itself is capped at 100 regardless of how the individual weights add up.

## Account lookup limits (anti-enumeration)

**Console → Sign-in Policy → Account Lookup Limits** governs the rate limiter behind identifier-first sign-in (typing an email before a password field even appears) — the anti-enumeration control that stops someone from mass-probing which addresses have accounts:

- **Threshold count** and **window (seconds)** — how many lookups from the same source within the window before it's throttled, capped at a platform floor.
- **VPN mode** — how the limiter treats traffic from known VPN ranges (a stricter or more lenient counting mode, since VPN traffic often shares exit IPs across unrelated real users).

The platform's own ceiling is enforced defensively in two places — at save time here, and again inside the limiter itself — so a platform-side tightening after the fact still takes effect immediately.

## Country restriction

**Console → Sign-in Policy → Country Restriction** is a simpler country-based gate on sign-in itself, independent of the risk score above:

- **Disabled** (default) — no restriction.
- **Allow** mode — only listed countries may sign in.
- **Deny** mode — listed countries are blocked, everyone else may sign in.

Requires the geolocation database to be available on your instance; the page tells you if it isn't.

## Related reading

- [MFA & Recovery](./mfa-and-recovery) — MFA reset requests show a risk badge derived from the same kind of signals as login risk scoring above.
- [Session & Token Policy](./session-and-token-policy) — trusted devices interact with "new device" risk scoring.
