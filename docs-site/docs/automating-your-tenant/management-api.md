---
title: Management API
---

# Management API

The Management API is a REST surface for scripting your own user, role, and app management — an HR sync job, an internal admin tool, or test automation — instead of clicking through Console by hand. It's authenticated the same way any machine-to-machine app already talks to LoginLink: the OAuth 2.0 `client_credentials` grant.

## Creating a credential

**Console → API Access → New credential**:

1. Name the credential (e.g. "HR sync script").
2. Check the capabilities it needs:
   - **Manage users** — create, read, update, deactivate via `/api/v1/users`.
   - **Manage roles** — list roles and grant/revoke them via `/api/v1/users/{id}/roles`.
   - **Register apps** — create new OAuth apps via `/api/v1/apps`.
3. Click **Create credential** — you get a `client_id` and `client_secret` shown exactly once. Store them now; the secret can't be revealed again.

Each credential can be rotated (issue a new secret, old one stops working immediately) or revoked (suspends the underlying service account, blocking further token issuance) independently, without affecting any other credential.

![The API Access page, showing the isolation explanation, the credentials list, and a "Get started with curl" walkthrough of the token-then-create-user-then-grant-role sequence](/img/screenshots/console-api-access.png)

## Getting a token

```
POST /token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id=...&client_secret=...
```

The returned access token is scoped to exactly the capabilities you checked when creating the credential — a token from a "Manage users" only credential gets a `403 insufficient_scope` from any roles or app-registration endpoint.

## Endpoints

See the full [Management API Reference](../api-reference/management-api-reference) for request/response shapes. In short:

| Capability | Endpoints |
|---|---|
| Manage users | `POST/GET/PATCH/DELETE /api/v1/users` (+ `/{id}`) |
| Manage roles | `GET /api/v1/roles`, `POST /api/v1/users/{id}/roles`, `DELETE /api/v1/users/{id}/roles/{roleId}` |
| Register apps | `POST /api/v1/apps` |

Every action is scoped to the calling credential's own tenant — a credential can never read or modify another tenant's data, no matter what ID you pass in.

## Tenant-owned, not platform-owned

Every Management API credential lives entirely within your own tenant. There's no platform-operator surface for this feature and no way to create a new tenant/organization through this API — organization creation happens once, through [normal signup](../getting-started/creating-an-organization), before any Management API credential can exist for it. (Platform operators who embed LoginLink in their own product have a separate, platform-scoped credential for creating organizations server-to-server — see the [Platform API](../api-reference/platform-api); it's managed at **Admin → Platform Settings → Platform API Access** and is not a tenant credential.)
