---
title: Token Attributes
---

# Token Attributes

Token attributes let a **confidential app's own backend** add a few extra, app-chosen values onto the access token LoginLink issues for a signed-in user — for example which tenant record or which databases this session belongs to. LoginLink has no opinion about this data and never stores it; it only carries it, under claim names your tenant admin chooses in advance.

This is for data your app's own logic decides, per request — not for anything about the person's LoginLink identity or permissions. For that, use the token's existing `sub`, `roles`, `email` and other standard claims, or [Custom Fields](../console/identifiers-and-custom-fields) for profile data LoginLink itself should store.

## Why this is confidential-apps only

A **public** client — a browser single-page app, or a mobile app with no secure place to keep a secret — has no way to prove to LoginLink that a given request genuinely comes from it. Its `client_id` isn't secret, and its code is inspectable. Letting a public client hand LoginLink data to embed in a token it signs would let anyone who can call the endpoint assert whatever they want, in a token LoginLink is vouching for.

This is the standard OAuth position, not a LoginLink-specific restriction — see [OAuth 2.0 for Browser-Based Apps](https://www.ietf.org/archive/id/draft-ietf-oauth-browser-based-apps-24.html) and OAuth 2.1's guidance away from giving browser code elevated trust. PKCE protects a different thing (that only whoever started a given login can redeem its code) — it doesn't prove a request's *data* is trustworthy.

**If your app is public:** give it a thin confidential backend — the **backend-for-frontend (BFF)** pattern. Register that backend as its own confidential app in Console, with its own `client_secret`, and configure token attributes there. The browser or mobile app keeps working exactly as it does today; it just talks to your backend, which talks to LoginLink.

## Setting it up

**Console → Apps → (your app) → Token attributes** (confidential apps only — a public app shows an explanation instead of the form). List the claim names your app's backend may set, for example `tenant_ref, dbs`. This is the complete list — an attempt to set any other name, or one of the [reserved names](#reserved-claim-names) below, is rejected.

Or via the Management API, with the `ManageTokenAttributes` capability:

```bash
curl -X PUT https://auth.yourtenant.com/api/v1/apps/{id}/token-attributes \
  -H "Authorization: Bearer $MGMT_TOKEN" -H "Content-Type: application/json" \
  -d '{"claimNames": ["tenant_ref", "dbs"]}'
```

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/apps/{id}/token-attributes` | The app's current allow-list, whether it's usable, and why not if it isn't. |
| `PUT` | `/api/v1/apps/{id}/token-attributes` | Replaces the whole allow-list. `{"claimNames": [...]}`. Up to 10 names, each lowercase letters/digits/underscores starting with a letter. Refused for a public app. |

## Using it, at `/token`

Your app's backend sends `token_attributes` alongside whichever grant it's using, **and its `client_secret`** — required here independently of what that grant type otherwise needs (an `authorization_code` exchange doesn't otherwise require a secret):

```
POST /token
grant_type=authorization_code
code=...
client_id=...
client_secret=...                 ← required to use token_attributes
code_verifier=...
token_attributes={"tenant_ref":"demo","dbs":["demo-main","demo-reports"]}
```

Supported on the `authorization_code` and `client_credentials` grants. A value may be a string, number, boolean, or array of strings (up to 20 items, 200 characters each). An array value appears in the issued token as a real JSON array, the same way the existing `roles` claim does.

**Reject, don't guess:** if any claim name in the request isn't on the app's allow-list, or is a reserved name, the whole request is rejected with `invalid_request` and the names that were rejected — nothing is silently dropped, and nothing silently overwrites what LoginLink itself would have set.

```json
{
  "error": "invalid_request",
  "error_description": "Not allowed for this app: roles. Configure allowed names in Console under Token attributes, or via PATCH /api/v1/apps/{id}/token-attributes."
}
```

## Collisions with Custom Fields

[Custom Fields](../console/identifiers-and-custom-fields) are a different mechanism: user profile data LoginLink stores, surfaced at `/userinfo` under the field's own name once the user has consented. Token attributes are different in every way that matters — supplied fresh by the app's backend at `/token`, never stored by LoginLink, landing on the access token itself.

Because they're different mechanisms writing to different places, there's no "precedence" between them — nothing merges or overrides between a token attribute and a custom field. Instead, **the name itself is reserved for whichever one claims it first**: creating a custom field named `org` when an app already has a token attribute named `org` is rejected (and the reverse), so you can never end up with two unrelated values under the same name across the token and `/userinfo`. The error names which one got there first.

## Reserved claim names

LoginLink sets these itself; no app can ever allow-list them:

`sub`, `jti`, `scope`, `user_kind`, `roles`, `aud`, `iss`, `exp`, `iat`, `nbf`, `azp`, `at_hash`, `token_type`, `client_id`, `email`, `name`, `email_verified`, `nonce`

## Error reference

| `error` | Meaning |
|---|---|
| `unauthorized_client` | The app is public, or has no `client_secret` configured. Register it as confidential, or use a BFF. |
| `invalid_client` | `client_secret` missing or doesn't match. |
| `invalid_request` | A claim name wasn't allow-listed (or was reserved), or a value was the wrong shape or too large. `error_description` says which. |

## An app that already does its own token exchange

If your resource server already mints its own tokens from a verified LoginLink identity (RFC 8693-style token exchange, with its own server-side ceiling on what it will mint), token attributes isn't needed — that pattern already gives the same guarantees, built into your own service instead of LoginLink.
