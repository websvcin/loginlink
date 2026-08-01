---
title: Social & OAuth
---

# Social & OAuth

LoginLink ships ten built-in social/OAuth connectors, plus a generic OIDC connector for anything not natively supported. Each is a self-contained plugin — enabling one doesn't require touching any other connector's configuration.

## Built-in connectors

| Provider | Notes |
|---|---|
| Google | |
| GitHub | |
| GitLab | |
| Bitbucket | |
| Slack | Sign in with a Slack workspace identity |
| Facebook | |
| LinkedIn | |
| Microsoft | Supports both personal Microsoft accounts and work/school (Azure AD/Entra) accounts via the `/common` endpoint |
| Apple | "Sign in with Apple" |
| Discord | |

## Enabling a connector

**Console → Connectors** — each provider needs its own OAuth app registered on the provider's side (a client ID/secret and a redirect URI pointed back at `/auth/{providerName}/callback`). Once configured, the connector appears as a sign-in tile on `/login`.

## Bring your own OIDC provider

If you use an identity provider that isn't in the list above — a company-internal IdP, or a provider LoginLink doesn't have a dedicated connector for — the **Generic OIDC connector** lets you register any standards-compliant OIDC provider by supplying its issuer URL, client ID/secret, and redirect URI, the same way as a built-in connector. This is also the path for Microsoft Entra ID tenants that want to bring their own existing app registration rather than use the built-in Microsoft connector's shared multi-tenant app.

## Just-in-time provisioning

The first time a user signs in through any social/OAuth connector, a LoginLink account is created for them automatically (just-in-time provisioning) — no separate signup step. If they later sign in through a different method using the same verified email, it resolves to the same account rather than creating a duplicate.

## Account linking

A signed-in user can link additional social/OAuth accounts to their existing LoginLink account from **Account → Connected Accounts**, so "Sign in with Google" and "Sign in with GitHub" both resolve to the same person once linked.
