---
title: Magic Link
---

# Magic Link

Magic Link is passwordless sign-in by email: a user enters their email address, LoginLink emails them a one-time sign-in link, and clicking it signs them in. It can be enabled as a **primary sign-in method** on the identifier-first `/login` and `/console/login` screens, or as an **MFA step-up factor** (see [Password & MFA](./password-mfa)) — these are configured independently.

## Cross-device sign-in

By default, whichever device opens the emailed link is the device that gets signed in — if a user requests the link on a laptop but opens their email on their phone, the phone signs in, not the laptop.

Tenants can opt into **cross-device sign-in**: the laptop (device A) shows a waiting screen with a live countdown after requesting the link; the phone (device B) opens the link and sees an approval screen naming the requesting device and approximate location; approving on device B automatically completes sign-in on device A, with no further action needed there. This is the same "approve on one device, complete on the original device" pattern used for Magic-Link-as-MFA step-up, applied to primary sign-in.

Cross-device sign-in is off by default and requires both:

1. A platform-level floor turned on (self-hosted instances only — ask your platform operator).
2. Your own tenant preference turned on in **Console → Settings → Magic Link → Cross-device sign-in**.

Once both are on, cross-device is live immediately for every user — no further per-user opt-in.

### Configurable timing

- **Link expiry** — how long an emailed link stays valid.
- **Poll interval** — how often the waiting device checks for approval.
- **Wait timeout** — how long the waiting device waits before giving up and offering to resend.
- **Resend cooldown** — the minimum time between resend requests, to prevent email flooding.

All four are tenant-configurable in **Console → Settings → Magic Link**.

## Enabling Magic Link

**Console → Connectors → Magic Link** — turn it on as a primary method, an MFA factor, or both. Email delivery uses your tenant's configured SMTP connector; a sending domain and reasonable rate limits are recommended before enabling it broadly.
