---
title: APIs (Resource Servers)
---

# APIs (Resource Servers)

An **API** is a resource server your apps can get tokens for — separate from the apps themselves. Without this, every LoginLink access token is addressed to the app that signed the user in (`aud` = that app's client ID), so a service like a shared data API can only ever trust one app per organization. Registering it as an API instead lets LoginLink issue tokens addressed to *it*, requestable by any app you grant — the standard OAuth 2.0 model (the same shape as Auth0 "APIs" or Microsoft Entra "Expose an API").

## Registering an API

**Console → Apps → APIs → Register an API**: a name, an identifier, and an optional description.

The **identifier** is an absolute URI (e.g. `https://crud.webapis.in`) with no `#` fragment (RFC 8707) — this is what an app sends as `resource=`, and what shows up as `aud` on a token addressed to it. It must be unique within your organization; the same identifier can be registered in a different organization without conflict, since a token also names which organization it's for (the `tenant_id`/`org` claims below).

Changing an identifier later changes what every app must send and what the resource server should expect — tokens already issued keep whatever value they were minted with.

## Granting an app access

Registering an API grants nothing by itself. On each app's own **API access** page, toggle which registered APIs that app may request a token for. An app with no grant for an API is refused for it with `invalid_target`, even if the API exists — this is deliberate: "no such API" and "exists but not granted to you" look identical from the outside.

Deleting an API removes every app's grant for it in the same step.

## Requesting a token for an API

Add `resource=<identifier>` to `/authorize` or `/token`. Supported on the authorization code flow (`/authorize`, then the `authorization_code` grant), `refresh_token`, and `client_credentials`.

```
POST /token
grant_type=refresh_token
refresh_token=...
client_id=...
resource=https://crud.webapis.in
```

The same refresh token works with or without `resource` — an app signs in once and can redeem its refresh token for its own audience, or for any API it's granted, as needed. An invalid or ungranted `resource` is refused with `invalid_target`, checked both at `/authorize` (before the person even signs in) and again at `/token` (in case access changed in between).

### What's on the token

| Claim | Value |
|---|---|
| `aud` | The API's identifier |
| `client_id`, `azp` | The app that requested the token (not the API) |
| `tenant_id` | The organization's id |
| `org` | The organization's slug |
| `sub`, `scope`, `user_kind` | Same as the app's own token |
| `roles` | **Not narrowed** — identical to what the app's own token would carry (tenant-wide ∪ the app's own app-scoped roles) |

No ID token is issued alongside an API-audience access token — an API token has no sign-in event of its own to describe. A request made *without* `resource` is completely unaffected: `aud` stays the app's client ID, exactly as before.

## Management API

See [Management API Reference](../api-reference/management-api-reference#apis--manageapis) — `GET/POST /api/v1/apis`, `PATCH/DELETE /api/v1/apis/{id}`, `GET/PUT /api/v1/apps/{id}/apis`, gated on the **Manage APIs** (`ManageApis`) capability.

## Background

Full design record: `docs/decisions/ADR-2026-10-17-crudapi-as-loginlink-api.md` in this repo.
