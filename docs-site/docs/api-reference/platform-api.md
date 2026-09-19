---
title: Platform API — Tenant Provisioning
---

# Platform API — Tenant Provisioning

The Platform API is for **platform operators** who embed LoginLink in their own product and need to create and manage organizations (tenants) server-to-server — for example, creating a workspace whenever a customer signs up to your SaaS.

It is separate from the [Management API](./management-api-reference), which is scoped to one existing organization. A Platform API credential belongs to the *platform*, not to any tenant, and can only be created by a platform administrator.

Base path: `/api/v1/tenants`.

## Creating a platform credential

**Admin → Platform Settings → Platform API Access → New credential.**

Name the credential and tick the capabilities it needs:

| Capability | Allows |
|---|---|
| `CreateTenants` | Create a tenant, and look up one tenant by id or slug |
| `SearchTenants` | Search tenants by slug fragment or id (bounded — see below) |
| `ManageTenants` | Suspend or reactivate one tenant |

The capabilities are separate on purpose: a credential that can provision tenants can't automatically suspend existing ones or search the registry. You receive a `client_id` and `client_secret` **once** — store them immediately. Credentials can be rotated (new secret, old one stops working at once) or revoked from the same page.

## Getting a token

Same as any machine-to-machine client:

```
POST /token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id=...&client_secret=...
```

Send the returned access token as `Authorization: Bearer <access_token>`. A token from a *tenant's* Management API credential is refused by these endpoints (`403 insufficient_scope`) — and a platform token can't be used against tenant data.

## Create a tenant — `CreateTenants`

```
POST /api/v1/tenants
{
  "tenantName": "Acme Corp",
  "adminEmail": "owner@acme.com",
  "adminName": "Alex Owner",
  "password": "a-strong-password",
  "app": { "name": "Acme Portal", "redirectUris": ["https://portal.acme.com/callback"] }
}
```

| Field | Required | Notes |
|---|---|---|
| `tenantName` | Yes | Display name of the organization |
| `adminEmail` | Yes | Becomes the tenant's first administrator (`owner`); marked verified |
| `password` | Yes | Must meet the platform password policy |
| `adminName` | No | |
| `app` | No | If present, an OAuth app is registered in the same call. `app.name` and at least one absolute `app.redirectUris` are then required |

```json
201
{
  "tenantId": 12,
  "slug": "acmecorp",
  "adminUserId": 34,
  "app": { "appId": 1, "clientId": "b3f1...", "clientSecret": "sK9x..." }
}
```

- The **slug** is generated from the name (lowercase letters and digits only). If it collides with an existing tenant or a reserved name, a short random suffix is appended — **read `slug` from the response** rather than assuming it.
- The tenant is created on **platform-managed SQLite** storage. It can be moved to MySQL/PostgreSQL later by the organization from **Console → Database & Migration**.
- `app.clientSecret` is shown exactly once. `app` is `null` when you didn't request one.
- If any step fails, the tenant that was being created is removed and a `400` explains why (for example the password doesn't meet policy).
- The creation is written to the platform audit log (`platform_api.tenant_created`).

## Look up one tenant — `CreateTenants`

```
GET /api/v1/tenants/{id}
GET /api/v1/tenants?slug=acmecorp
```

```json
200
{ "tenantId": 12, "slug": "acmecorp", "status": "active", "createdAt": "2026-09-01T10:00:00Z" }
```

`404 not_found` if there is no such tenant. This is deliberately **not a list endpoint** — you can only look up a tenant whose id or slug you already have, so a credential can't enumerate your customers. The response holds only what the platform registry knows; an organization's display name and branding live inside its own data.

## Search tenants — `SearchTenants`

```
GET /api/v1/tenants/search?q=acme
```

Returns up to **20** matches (same shape as above, as an array) where `q` is a substring of the slug or an exact tenant id. `q` must be at least 2 characters; shorter values return `400`. It matches — it doesn't page — and every search is audited (`platform_api.tenant_search`).

## Suspend or reactivate a tenant — `ManageTenants`

```
PATCH /api/v1/tenants/{id}
{ "status": "suspended" }
```

`status` must be `active` or `suspended`. Returns `{ "tenantId": 12, "status": "suspended" }`; `404` for an unknown id. Suspending stops that organization's sign-ins until it is reactivated. Recorded as `platform_api.tenant_status_changed`.

## Errors

Same shape as the Management API: `{ "error": "...", "error_description": "..." }`.

| Status | `error` | Meaning |
|---|---|---|
| `400` | `invalid_request` | Missing/invalid field |
| `401` | `invalid_request` / `invalid_token` | No, malformed, expired or revoked token, or a revoked credential |
| `403` | `insufficient_scope` | The credential lacks the capability, or isn't a platform credential |
| `404` | `not_found` | No such tenant |

## Related

- [Management API](../automating-your-tenant/management-api) — automate a single organization after it exists.
- [Creating an Organization](../getting-started/creating-an-organization) — the self-service, in-browser route.
