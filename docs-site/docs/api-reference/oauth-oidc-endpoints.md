---
title: OAuth / OIDC Endpoints
---

# OAuth / OIDC Endpoints

Every endpoint below is relative to your tenant's issuer, e.g. `https://auth.yourtenant.com`.

## Discovery

| Method | Path | Description |
|---|---|---|
| `GET` | `/.well-known/openid-configuration` | Standard OIDC discovery document |
| `GET` | `/.well-known/jwks.json` | Public signing keys, for verifying access/ID tokens yourself |

## Authorization Code flow

| Method | Path | Description |
|---|---|---|
| `GET` | `/authorize` | Starts the sign-in flow. Params: `client_id`, `redirect_uri`, `response_type=code`, `scope`, `state`, optional `code_challenge`/`code_challenge_method=S256` for PKCE |
| `POST` | `/token` | Exchanges a grant for tokens — see grant types below |
| `POST` | `/revoke` | Revokes a refresh or access token |
| `POST` | `/introspect` | Checks whether a token is currently active, per RFC 7662 |
| `GET` | `/userinfo` | Returns the signed-in user's claims, given a valid access token |

## Grant types accepted by `/token`

| `grant_type` | Use case |
|---|---|
| `authorization_code` | Standard web/mobile sign-in flow, following `/authorize` |
| `client_credentials` | Machine-to-machine — see [Management API](../automating-your-tenant/management-api) |
| `refresh_token` | Exchange a refresh token for a new access token without re-prompting the user |
| `urn:ietf:params:oauth:grant-type:device_code` | Device Authorization Grant (RFC 8628) — see below |

## Device Authorization Grant

For CLIs, TVs, and other input-constrained devices:

| Method | Path | Description |
|---|---|---|
| `POST` | `/device_authorization` | Starts the flow — returns a `device_code`, `user_code`, and a verification URL for the user to visit on a second device |
| `POST` | `/token` | Poll with `grant_type=urn:ietf:params:oauth:grant-type:device_code` until the user approves on the second device |

## Social / Enterprise connector endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/auth/{providerName}/start` | Redirects to the named social/OAuth provider (e.g. `/auth/google/start`) |
| `GET`, `POST` | `/auth/{providerName}/callback` | The provider's redirect back to LoginLink |
| `GET` | `/auth/Saml/start` | Starts an SP-initiated SAML sign-in |
| `POST` | `/auth/Saml/acs` | SAML Assertion Consumer Service — where your IdP posts the signed assertion |

See [Authentication Methods](../authentication/password-mfa) for how to enable each of these per tenant.
