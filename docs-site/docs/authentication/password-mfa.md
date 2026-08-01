---
title: Password & MFA
---

# Password & MFA

## Password sign-in

Standard email/password (or any registered identifier + password) sign-in. Password policy — minimum length, character-class requirements, breach-list checking — is configurable per tenant in **Console → Settings → Password Policy**.

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

**Console → Settings → Multi-Factor Authentication** controls:

- Whether MFA is required, optional, or off, tenant-wide.
- Which factors are available (TOTP, Magic Link step-up).
- Trusted-device duration.
- Self-service recovery on/off.

A platform-level floor can force MFA on for every tenant regardless of a tenant's own preference — ask your LoginLink platform operator if you're on a self-hosted instance and this applies to you.
