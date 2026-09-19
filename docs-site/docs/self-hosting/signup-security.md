---
title: Signup Security
---

# Signup Security

`/signup-tenant` is a public page: anyone who can reach your instance can start a new organization. **Admin → Platform Settings → Signup Security** controls what that page asks of a new organization's first administrator before anything is created.

## Email verification

When verification is on, a new administrator must prove they own the email address they typed — with a one-time code or a confirmation link sent to it — before their organization can be created. It is **off by default**, and it is the **only** thing that makes signup verify email ownership.

### Prerequisite: an email connector

Verification needs something to send the email with, so it can only be switched on once at least one of these connectors is both **enabled** and **configured**:

| Connector | What the visitor sees |
|---|---|
| **Email OTP** | A screen to type a short code from the email. |
| **Magic Link** | A "check your inbox" screen. Clicking the link — on any device — continues the signup automatically. |

Enable them under **Admin → Connectors**; their SMTP details are set in the connector's own platform settings. The status of each is shown at the top of the Signup Security page, and the toggle stays disabled until one is ready.

Only email connectors are offered. SMS and other channels are configured per organization, and no organization exists yet at signup.

:::caution Use SMTP in production
Email OTP has a development mode that prints codes to the server log instead of sending email. It counts as "configured", so make sure the connector is set to send real email before relying on verification.
:::

### Choosing the method

- **One connector ready** — it's used automatically; there's nothing to choose.
- **Both ready** — pick which one signup uses under **Verification method**. It's a single explicit choice: one code *or* one link, never both.

### What the visitor experiences

The **Verify** step only appears when verification is on; otherwise the signup goes straight from "about you" to the database choice. The proof is tied to the exact email address typed and to that browser session, is spent once the organization is created, and a resend is limited to once every 30 seconds.

The final confirmation screen only says the email was verified if verification actually ran.

## Signup and database auto-provisioning

Which visitors may use [Database Auto-Provisioning](./database-auto-provisioning) is decided separately, by its allowlist. Verification is independent of it: turning verification on makes every signup — including approved addresses — prove email ownership; leaving it off trusts an approved address as typed. The Signup Security page repeats this warning next to the toggle.

## Other signup settings

- **Terms and Privacy links** — optional by default; a platform administrator can require every new organization to provide them, under **Host & Branding**. LoginLink's own Terms and Privacy Policy, if set there, are shown in a popup on the signup page.
- **Rate limiting** — signup attempts are covered by the platform's rate-limit rules, under **Admin → Rate Limits**.

## Troubleshooting

**The verification toggle is greyed out.** No email connector is both enabled and configured. The panel at the top of the page shows each connector's state — enable it under **Admin → Connectors** and complete its SMTP settings.

**Visitors say the email never arrives.** Check the connector's SMTP settings and the sender's reputation (spam folders, SPF/DKIM for your sending domain). If Email OTP is in its development mode, the code is printed in the *server log*, not sent — switch it to SMTP for real use.

**A visitor is told the verification "expired".** Verification attempts are short-lived and held in the memory of the instance that sent them. They expire after a while, and a restart clears them. If you run several instances behind a load balancer *without* sticky sessions, a code or link handled by a different instance than the one that sent it is rejected — the visitor can simply request a new one, and it never lets an unverified address through.

**Verification is on but an approved visitor still isn't asked.** It applies to every signup when the toggle is on. Reload the signup page after changing the setting; it reads the setting each time a visitor continues past the "About you" step.
