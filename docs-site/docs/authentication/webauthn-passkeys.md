---
title: WebAuthn / Passkeys
---

# WebAuthn / Passkeys

LoginLink supports WebAuthn — the standard behind **passkeys** — as both a primary sign-in method and an MFA factor. A passkey is bound to a physical authenticator (a phone, a security key, or the platform authenticator built into most modern laptops/phones), and can't be phished the way a password or even a TOTP code can.

## Enabling passkeys for your tenant

**Console → Settings → WebAuthn** has two independent toggles:

- **Allow as a primary sign-in method** — users can register a passkey and use it instead of a password entirely.
- **Allow as an MFA factor** — users can register a passkey as their second factor alongside (or instead of) TOTP.

A platform-level floor can force either toggle off across every tenant on a self-hosted instance; a tenant can only narrow what the platform allows, never widen it.

## What users see

Registering a passkey is a standard browser WebAuthn ceremony — "Use Face ID", "Use your security key", etc., depending on the device. Once registered, sign-in is a single tap/prompt with no password or code to type. A user can register multiple passkeys (e.g. one per device) and manage them from their own account settings, including naming and revoking individual passkeys.

## Platform support

WebAuthn works in every modern browser (Chrome, Safari, Firefox, Edge) on desktop and mobile. Cross-device sign-in — starting on a desktop browser and completing with a phone's passkey — is supported via the standard hybrid transport (QR code) flow built into the browser itself, not something LoginLink implements separately.
