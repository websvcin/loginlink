---
title: Platform Identity Policy
---

# Platform Identity Policy

**Admin → Identity Policy** is where the platform owner sets the ceiling ("Floor") for MFA pairing, MFA recovery, session/token duration, and the device authorization grant — the same policies documented from the tenant side in [MFA & Recovery](../console/mfa-and-recovery) and [Session & Token Policy](../console/session-and-token-policy), but here you're setting the instance-wide maximum every organization is bounded by, not one organization's own preference.

## MFA Pairings (the Floor matrix)

**Admin → MFA Pairings** is a matrix, one row per authentication-capable connector (password, each social/OAuth provider, SAML, and so on), each row listing which MFA methods are allowed after signing in with it. A row with no methods checked means "no MFA after this login method, period" — and that's a hard floor: an organization can leave a populated row empty (relax it to "no MFA for us"), but can never check a box in a row you left empty, and can never add a method to a row that isn't in your list. Only MFA connectors you've enabled platform-wide even appear as checkable options; a connector installed but disabled shows as such, so you can't accidentally floor-populate a method that's actually inert everywhere.

A separate, instance-wide **forced method** setting exists independent of the matrix: set it and every organization's users are challenged with only that one method, full stop, overriding whatever the matrix or any organization's own preference would otherwise allow. Leaving it blank restores normal user choice among whatever's actually enrolled and allowed.

## MFA Recovery Mode (the Floor)

**Admin → MFA Recovery** sets the instance-wide ceiling for how a user is allowed to recover from a lost MFA device — the same three modes as the tenant side (Strict / Flexible / EmailLink), but here as a floor: setting it to **Strict** forces every organization on the instance to Strict as well (no organization can offer a more permissive fallback), while setting it to **EmailLink** — the most permissive — leaves every organization free to choose any of the three for themselves. The page also shows two instance-wide stats: how many users across every organization have MFA enrolled, and how many unused recovery codes exist in total. Recovery mode is deliberately the only piece of tenant-side MFA Recovery that has a platform floor at all — the exhaustion policy (Strict / Admin Reset / Self-Service) and the low-codes warning thresholds are each organization's own decision, with no platform ceiling on either.

## Session Settings (the Floor)

**Admin → Session Settings** sets four independent ceilings, sharing one page for the same reason its tenant-side counterpart does — they're all "how long does something last" questions:

- **Default session duration** (hours) and whether **Remember Me** is allowed at all, plus its own **max duration** (days) — the absolute ceiling every organization's own session settings are bounded by.
- **Session history retention ceiling** (7–3650 days) — the longest any organization may configure for how long session records are kept before a background worker prunes them.
- **Sign-in history window ceiling** (7–3650 days) — a separate ceiling bounding a live query over the audit log for what an organization can show on a user's own `/profile/security` page, independent of the retention setting above (one bounds row deletion, the other bounds a display window over rows that are still there).

## Device Flow Settings (the Floor)

**Admin → Device Flow Settings** is a single instance-wide switch for the OAuth Device Authorization Grant (RFC 8628) — off here means no organization's own toggle can ever turn it on, regardless of what any tenant admin or app has configured. See [Session & Token Policy](../console/session-and-token-policy#device-authorization-grant-device-flow) and [Advanced Sign-in Options](../console/advanced-signin-options#device-flow-settings) for what the grant actually does once an organization and an app have both opted in underneath this floor.

## Related reading

- [MFA & Recovery](../console/mfa-and-recovery) — the tenant-side Override half of MFA Pairings and Recovery Mode.
- [Session & Token Policy](../console/session-and-token-policy) — the tenant-side Override half of session/token duration.
- [How LoginLink Works](../getting-started/how-it-works#the-floor-and-override-policy-model) — the general Floor/Override model these pages implement.
