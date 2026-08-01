---
title: Core Concepts
---

# Core Concepts

## Tenants

A **tenant** is your organization's isolated space on LoginLink — its own users, apps, roles, connectors, and audit trail. Nothing in one tenant is visible to another. Most integrations only ever deal with a single tenant; larger platforms sometimes provision one tenant per customer (see [BYO-DB / Data Residency](../security-compliance/byo-db-data-residency) if you need a customer's data to live in its own database for compliance reasons).

Every tenant has a **slug** — a URL-safe identifier used to route sign-in traffic and, for server-to-server surfaces like [SCIM](../automating-your-tenant/scim-provisioning), to address the tenant directly (`/scim/v2/{tenantSlug}/...`).

## Users

A user is anyone who can sign in to your tenant — an end user of your product, or a tenant admin managing your Console. Users are identified by one or more **identifiers**:

| Type | Example | Notes |
|---|---|---|
| `email` | `jane@example.com` | The default, always available |
| `mobile` | `+14155551234` | E.164 format |
| `username` | `jane_doe` | Opt-in per tenant |
| custom | `employee_id`, etc. | Any type your tenant registers |

A user can have several identifiers of different types, and a given identifier can be the sign-in target for password, magic link, MFA delivery, or SCIM's `userName` mapping — see [SCIM Provisioning](../automating-your-tenant/scim-provisioning) for exactly how that mapping works.

## Apps

An **app** is an OAuth 2.0 / OIDC client registration: a `client_id`, a redirect URI (or several), and a client type:

- **Confidential** — has a `client_secret`, used for server-side apps and the `client_credentials` grant (machine-to-machine).
- **Public** — no secret; used for single-page apps and native/mobile apps via Authorization Code + PKCE.

Each app gets its own signing/token scoping, so a token minted for App A is never valid for App B, even within the same tenant.

## Roles

A **role** is just a name your tenant defines (`admin`, `support`, `billing-viewer` — whatever fits your product) and assigns to users. Two independent layers exist:

- **Tenant-wide roles** — defined once, usable across every app in the tenant.
- **App-specific roles** — a private vocabulary for a single app.

LoginLink stores role **names and assignments only** — it never interprets what a role is allowed to do. A user's effective roles for a given app (tenant-wide ∪ that app's own roles) are included in the access token's `roles` claim; your application reads that claim and decides what it means.

Roles can be managed by hand in Console, granted/revoked via the [Management API](../automating-your-tenant/management-api), or pushed automatically from your IdP via [SCIM Groups](../automating-your-tenant/scim-provisioning).

## Sessions

A signed-in user gets a session cookie (for browser-based Console/end-user surfaces) and, for your integrated application, a token set (access token, ID token, refresh token) from the OAuth flow. Sessions can be revoked individually, and every session's device/location metadata is visible to both the user (in their own account settings) and a tenant admin (in Console).

## Where each concept lives in the API

| Concept | Console | REST surface |
|---|---|---|
| Users | Console → Users | [Management API](../automating-your-tenant/management-api) `/api/v1/users`, [SCIM](../automating-your-tenant/scim-provisioning) `/scim/v2/{tenantSlug}/Users` |
| Roles | Console → Roles | Management API `/api/v1/roles`, SCIM `/scim/v2/{tenantSlug}/Groups` |
| Apps | Console → Apps | Management API `/api/v1/apps` |
