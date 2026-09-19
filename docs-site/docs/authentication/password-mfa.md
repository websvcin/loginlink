---
title: Password & MFA
---

# Password & MFA

## Password sign-in

Standard email/password (or any registered identifier + password) sign-in. Password policy — minimum length, character-class requirements, breach-list checking — is configured on the Password connector's own settings page, like any other connector: **Console → Sign-in Methods → Email & Password → Configure** (tenant-wide) or a specific app's own **Connectors → Configure** for a per-app override. See [Apps & Connectors](../console/apps-and-connectors#configuring-a-connector--floor-and-override) for how the Floor/Override model applies to connector settings fields, and [Credential Health](../console/risk-monitoring-and-alerts#credential-health) for password age tracking and breach-check.

## Multi-factor authentication

Once enabled for a tenant, MFA can be required at sign-in via:

- **TOTP** — any standard authenticator app (Google Authenticator, Authy, 1Password, etc.).
- **Magic Link as a step-up factor** — a "click the link we emailed you" second factor, distinct from Magic Link as a *primary* sign-in method (see [Magic Link](./magic-link)).
- **Recovery codes** — one-time backup codes generated at MFA setup, for when a user loses their authenticator device. LoginLink proactively warns a user in their account settings when their remaining recovery codes run low.

### Trusted devices

A user can mark a device as trusted after completing MFA once, skipping the second factor on that device for a configurable period. Trusted devices are visible and individually revocable from the user's own account settings and from Console for a tenant admin.

### Recovery flow

If a user loses access to their MFA method entirely, a self-service recovery flow (email-based, with a deliberate delay and clear audit trail) lets them regain access without a support ticket — configurable per tenant, since some organizations prefer to require admin-assisted recovery instead.

## Configuring MFA for your tenant

MFA configuration is split across a few dedicated Console pages rather than one settings screen — see [MFA & Recovery](../console/mfa-and-recovery) for the full walkthrough:

- **Which second factor applies to which sign-in method** — Console → MFA & Recovery → Method Rules, narrowed from whatever the platform allows.
- **Auto-send behavior** — Console → MFA Settings.
- **Recovery mode, exhaustion policy, and low-codes warnings** — Console → MFA Recovery, in three independently-saved sections.
- **Trusted-device duration** — Console → Session Settings (see [Session & Token Policy](../console/session-and-token-policy#trusted-devices)).

A platform-level ceiling can force MFA on, or restrict which recovery modes are even selectable, regardless of a tenant's own preference — ask your LoginLink platform operator if you're on a self-hosted instance and this applies to you.
