---
title: Management API Reference
---

# Management API Reference

Base path: `/api/v1`. Every request needs `Authorization: Bearer <access_token>` from a `client_credentials` token issued to a [Management API credential](../automating-your-tenant/management-api). Every action is scoped to that credential's own tenant — you can never read or change another tenant's data.

Request and response bodies are JSON with camelCase field names. `PATCH` endpoints only change the fields you send.

## Errors

Errors are returned as:

```json
{ "error": "insufficient_scope", "error_description": "This credential does not have the 'ManageUsers' capability." }
```

| Status | `error` | Meaning |
|---|---|---|
| `400` | `invalid_request` | Missing or invalid field, or the operation isn't allowed (the description says why) |
| `401` | `invalid_request` / `invalid_token` | No bearer token, or the token is malformed, expired, revoked or issued to a suspended credential |
| `403` | `insufficient_scope` | The credential lacks the capability this endpoint requires |
| `404` | `not_found` | No such resource in this tenant |

## Capabilities at a glance

Each endpoint group below names the capability it needs. Capabilities are ticked when you create the credential in **Console → API Access**.

| Capability | Console label | Covers |
|---|---|---|
| `ManageUsers` | Manage users | Users |
| `ManageRoles` | Manage roles | Roles, app roles, granting roles |
| `RegisterApps` | Manage apps | Apps |
| `ManageConnectors` | Manage app connectors | Per-app sign-in connectors |
| `ManageTenantAdmins` | Manage tenant admins | Tenant administrators |
| `ManageInvitations` | Manage invitations | Invitations |
| `ManageServiceAccounts` | Manage service accounts | Service accounts |
| `ReadAuditLog` | Read audit log | Audit events |
| `ReadSessions` / `ManageSessions` | Read / Manage sessions | User sessions |
| `ManageSessionPolicy` | Manage session/token policy | Session, token and act-as settings |
| `ReadRiskSignals` / `ManageRiskSignals` | Read / Manage risk signals | Risk, alerts, trusted devices |
| `ManageConnectedApps` | Manage connected apps | Which apps a user has authorized |
| `ManageMfaResets` | Manage MFA resets | MFA reset requests |
| `ManageSignInOptions` | Manage sign-in options | Passkeys, device flow, cross-device magic link |
| `ManageRelationshipTags` | Manage relationship tags | Tags and their policies |
| `ManageAccessRules` | Manage access rules | Country restriction and per-user, per-tag, per-app and organization access rules |
| `ManageRoleSync` | Manage role sync sources | Role sync sources |
| `ManageTenantConfig` | Manage tenant config | Name, branding, "Powered by" |
| `ManageCustomFields` | Manage custom fields | Custom field definitions |
| `ManageDomains` | Manage domains | Custom domain |
| `ManageDataExport` | Manage data export | Tenant data export |
| `ManageMigration` | Read migration status | Database migration status |
| `ManageWebhooks` | Manage webhooks | Webhook endpoints |
| `ManageNotificationSettings` | Manage notification settings | Notification channels |

Grant a credential only what it needs — a token can never do more than the capabilities ticked on its credential.

---

## Users — `ManageUsers`

### Create a user

```
POST /api/v1/users
{ "email": "jane@example.com", "name": "Jane Doe" }
```

```json
201
{ "userId": 42, "email": "jane@example.com", "status": "active" }
```

`email` is required. The user is created as a normal (end) user; the address is **not** marked verified until they prove it.

### List users

```
GET /api/v1/users?search=jane&status=active&limit=50&cursor=100
```

| Query | Meaning |
|---|---|
| `search` | Matches name or any identifier (substring) |
| `status` | Only users with this status, e.g. `active`, `suspended` |
| `limit` | Page size, 1–200 (default 50) |
| `cursor` | Return users after this `userId`; use the previous response's `nextCursor` |

```json
200
{
  "users": [{ "userId": 42, "email": "jane@example.com", "name": "Jane Doe", "status": "active", "createdAt": "2026-01-01T00:00:00Z" }],
  "nextCursor": 42
}
```

`nextCursor` is `null` on the last page.

### Get a user

```
GET /api/v1/users/{id}
```

Returns one user (`userId`, `email`, `name`, `status`, `createdAt`).

### Update a user

```
PATCH /api/v1/users/{id}
{ "name": "Jane R. Doe" }
```

Returns the updated user, same shape as **Get a user**.

### Deactivate / reactivate a user

```
DELETE /api/v1/users/{id}
POST   /api/v1/users/{id}/reactivate
```

```json
200
{ "userId": 42, "status": "suspended" }
```

Deactivation is a soft suspension — the same as suspending a user in Console — never a hard delete. Reactivate returns `"status": "active"`.

### Lock, unlock and risk

```
POST /api/v1/users/{id}/lock      — ManageUsers
POST /api/v1/users/{id}/unlock    — ManageUsers
GET  /api/v1/users/{id}/risk      — ReadRiskSignals
```

```json
POST /api/v1/users/42/lock
{ "durationMinutes": 60, "reason": "investigating", "endSessions": true }
→ 200 { "userId": 42, "locked": true, "lockedUntil": "2026-09-28T11:30:00Z", "indefinite": false }
```

Send `"indefinite": true` instead of `durationMinutes` (1 to 2,628,000) to lock until an unlock. A lock blocks new sign-ins; `endSessions` also ends the person's current sessions. It is separate from suspend and is audited like the Console action. `unlock` clears a manual or automatic lock and the failed-attempt counter. `risk` returns `{ "userId", "score", "tier", "locked" }` from the latest scored sign-in (`score` and `tier` are null before the first one).

### Sessions — `ReadSessions` / `ManageSessions`

```
GET    /api/v1/users/{id}/sessions                     (ReadSessions)
DELETE /api/v1/users/{id}/sessions                     (ManageSessions) — sign the user out everywhere
DELETE /api/v1/users/{id}/sessions/{sessionRowId}      (ManageSessions) — end one session
```

```json
200
[{ "sessionId": 9, "ip": "203.0.113.4", "createdAt": "…", "expiresAt": "…", "revokedAt": null, "isTrusted": false }]
```

Revoking all returns `{ "userId": 42, "revokedCount": 3 }`; revoking one returns `{ "userId": 42, "sessionId": 9, "revoked": true }`.

### Grant / revoke a role — `ManageRoles`

```
POST   /api/v1/users/{id}/roles        { "roleId": 1 }   → 201 { "userId": 42, "roleId": 1 }
DELETE /api/v1/users/{id}/roles/{roleId}                 → 200 { "userId": 42, "roleId": 1 }
```

---

## Roles — `ManageRoles`

Tenant-wide roles.

```
GET    /api/v1/roles                     → [{ "roleId": 1, "name": "Support", "description": "…" }]
GET    /api/v1/roles/{id}
POST   /api/v1/roles                     { "name": "Support", "description": "Support team" }  → 201
PATCH  /api/v1/roles/{id}                { "name": "…", "description": "…" }
DELETE /api/v1/roles/{id}                → { "roleId": 1, "deleted": true }
GET    /api/v1/roles/{id}/members        → [{ "userId": 42, "email": "…", "name": "…" }]
```

`name` is required on create and update.

### App-scoped roles

Roles that belong to one app rather than the whole tenant.

```
GET    /api/v1/apps/{appId}/roles
POST   /api/v1/apps/{appId}/roles                 { "name": "Editor", "description": "…" }  → 201
PATCH  /api/v1/apps/{appId}/roles/{roleId}        { "name": "…", "description": "…" }
DELETE /api/v1/apps/{appId}/roles/{roleId}
```

---

## Apps — `RegisterApps`

### Register a new app

```
POST /api/v1/apps
{ "name": "Internal Tool", "redirectUris": ["https://internal.yourapp.com/callback"] }
```

```json
201
{ "appId": 7, "clientId": "b3f1...", "clientSecret": "sK9x..." }
```

`name` and at least one absolute `redirectUris` entry are required. The `clientSecret` is shown exactly once — store it immediately.

### List, get, update, delete

```
GET    /api/v1/apps
GET    /api/v1/apps/{id}
PATCH  /api/v1/apps/{id}
DELETE /api/v1/apps/{id}                 → { "appId": 7, "deleted": true }
```

```json
200
{ "appId": 7, "name": "Internal Tool", "clientId": "b3f1...", "redirectUri": "https://…/callback",
  "clientType": "confidential", "requirePkce": true, "allowDeviceFlow": false, "createdAt": "…" }
```

`PATCH` accepts any of:

| Field | Meaning |
|---|---|
| `name` | Display name |
| `redirectUri` | The primary redirect URI |
| `additionalRedirectUris` | Extra allowed redirect URIs (replaces the list) |
| `requirePkce` | Require PKCE for the authorization-code flow |
| `allowEndUserSignIn` | Whether ordinary users may sign in to this app |
| `allowTenantAdminSignIn` | Whether organization administrators may sign in to this app |

At least one of `allowEndUserSignIn` / `allowTenantAdminSignIn` must stay `true`, otherwise the request is rejected with `400`.

### App access — `RegisterApps`

```
GET    /api/v1/apps/{id}/access
PUT    /api/v1/apps/{id}/access                       { "restricted": true }
POST   /api/v1/apps/{id}/access/users/{userId}        add to the guest list
DELETE /api/v1/apps/{id}/access/users/{userId}
POST   /api/v1/apps/{id}/access/tags/{tagId}          let in everyone with a Relationship Tag
DELETE /api/v1/apps/{id}/access/tags/{tagId}
POST   /api/v1/apps/{id}/access/exclusions/{userId}   keep one person out of the group access
DELETE /api/v1/apps/{id}/access/exclusions/{userId}
```

`GET` returns `{ "appId", "restricted", "grantedUserIds", "grantedTagIds", "excludedUserIds" }`. With `restricted` false everyone in the tenant can sign in and the lists are ignored; with true only the guest list and granted tags can. Removing access (revoke, remove a group, exclude, restrict) ends the affected people's app tokens immediately: refresh tokens are revoked and introspection reports their access tokens inactive.

### Rotate a client secret

```
POST /api/v1/apps/{id}/secret/rotate
```

```json
200
{ "appId": 7, "clientSecret": "new-secret..." }
```

The old secret stops working immediately; the new one is shown once.

### Per-app sign-in connectors — `ManageConnectors`

```
GET   /api/v1/apps/{id}/connectors                       → [{ "name": "EmailOtp", "enabled": true }]
PATCH /api/v1/apps/{id}/connectors                       { "name": "EmailOtp", "enabled": false }
```

A connector can only be switched on for an app once it has been approved for that app under **Sign-in Methods** in Console; otherwise the API returns `400`.

---

## Tenant administrators — `ManageTenantAdmins`

```
GET    /api/v1/admins        → [{ "userId": 3, "email": "…", "name": "…", "role": "owner", "grantedAt": "…" }]
POST   /api/v1/admins        { "userId": 42, "role": "admin" }   → 201 { "userId": 42, "role": "admin" }
DELETE /api/v1/admins/{userId}                                   → { "userId": 42, "revoked": true }
```

`role` is `owner` or `admin` (default `admin`). The `owner` role can't be revoked, and the last remaining administrator can't be removed; a refused change returns `400` with the reason.

## Invitations — `ManageInvitations`

```
GET    /api/v1/invitations?includeCompleted=false
POST   /api/v1/invitations   { "email": "new@example.com", "name": "New Person", "userKind": "end_user" }
DELETE /api/v1/invitations/{id}
```

`userKind` is `end_user` (default) or `tenant_admin`. Creating returns `201` with `{ "email", "userKind", "token" }`; the token is the invitation credential. Only one pending invitation per email is allowed (`400` otherwise). Listing returns `invitationId`, `email`, `name`, `userKind`, `expiresAt`, `acceptedAt`, `revokedAt`, `createdAt`. Revoking returns `{ "id": 5, "revoked": true }`.

## Service accounts — `ManageServiceAccounts`

Machine identities (each Management API credential and machine-to-machine app has one).

```
GET    /api/v1/service-accounts                    → [{ "userId": 8, "name": "HR sync", "status": "active", "createdAt": "…" }]
POST   /api/v1/service-accounts                    { "name": "Nightly job" }   → 201
POST   /api/v1/service-accounts/{userId}/suspend   → { "userId": 8, "status": "suspended" }
DELETE /api/v1/service-accounts/{userId}           → { "userId": 8, "removed": true, "appsUnlinked": 1 }
```

## Audit events — `ReadAuditLog`

```
GET /api/v1/audit-events?since=2026-01-01T00:00:00Z&action=management_api.&userId=42&page=1&limit=50
```

| Query | Meaning |
|---|---|
| `since` | Only events at or after this UTC time |
| `action` | Action **prefix** filter, e.g. `management_api.` |
| `userId` | Only events about this user |
| `page`, `limit` | Page number (from 1) and size (1–200, default 50) |

```json
200
{
  "events": [{ "id": 1001, "action": "management_api.user_created", "target": "user:42", "userId": 42,
               "userEmail": "jane@example.com", "appId": 7, "ip": "203.0.113.4", "at": "2026-01-01T00:00:00Z" }],
  "totalCount": 120, "page": 1, "pageSize": 50, "totalPages": 3
}
```

Every write made through this API is itself recorded in the audit log (`management_api.*`), attributed to the calling credential.

---

## Sessions, tokens and act-as — `ManageSessionPolicy`

Each has a `GET` and a `PATCH`; `PATCH` returns the updated settings.

```
GET|PATCH /api/v1/session-policy
{ "defaultDurationHours": 8, "rememberMeAllowed": true, "rememberMeMaxDurationDays": 30 }

GET|PATCH /api/v1/token-policy
{ "accessTokenLifetimeSeconds": 900, "refreshTokenLifetimeDays": 30, "alwaysRequireConsent": false }

GET|PATCH /api/v1/act-as-settings
{ "enabled": true, "requireApproval": true }
```

`token-policy` also returns `platformFloorAccessTokenSeconds` and `platformFloorRefreshTokenDays` — the maximums your platform administrator allows. `accessTokenLifetimeSeconds` must be between 300 and that maximum, and `refreshTokenLifetimeDays` between 1 and its maximum; out-of-range values return `400`.

## Risk signals — `ReadRiskSignals` / `ManageRiskSignals`

```
GET    /api/v1/risk-events?days=14                       (Read)  summary of risky sign-in events
GET    /api/v1/credential-health                         (Read)
GET    /api/v1/session-intelligence                      (Read)  concurrent sessions, multi-country sessions
GET    /api/v1/security-alerts?limit=50                  (Read)  up to 200
POST   /api/v1/security-alerts/{id}/acknowledge          (Manage)
GET    /api/v1/device-trust                              (Read)  trusted devices
DELETE /api/v1/device-trust/{sessionId}                  (Manage) stop trusting a device
```

Alerts look like `{ "alertId", "alertType", "severity", "summary", "affectedUserCount", "detectedAt", "acknowledgedAt" }`. Acknowledging an already-acknowledged or unknown alert returns `404`.

## Connected apps — `ManageConnectedApps`

```
GET    /api/v1/connected-apps                              → apps with distinctUserCount, activeNowCount, lastTokenIssuedAt
GET    /api/v1/users/{userId}/connected-apps               → the apps this user has authorized
DELETE /api/v1/users/{userId}/connected-apps/{appId}       → { "userId": 42, "appId": 7, "revoked": true }
```

Revoking withdraws that user's access to the app.

## MFA resets — `ManageMfaResets`

```
GET  /api/v1/mfa-resets
POST /api/v1/mfa-resets/{id}/approve     { "note": "verified by phone" }
POST /api/v1/mfa-resets/{id}/deny        { "note": "…" }
```

Requests include `requestId`, `userId`, `userName`, `email`, `status`, `requestedAt`, `expiresAt` and `riskTier`. Approve/deny return `{ "requestId", "userId", "status": "approved" | "denied" }`; `note` is optional.

---

## Sign-in options — `ManageSignInOptions`

```
GET|PATCH /api/v1/signin-options
{
  "webAuthnEnabled": true,
  "webAuthnAllowAsAuthentication": true,
  "webAuthnAllowAsMfa": true,
  "deviceFlowEnabled": false,
  "magicLinkCrossDeviceEnabled": true
}
```

Passkeys (WebAuthn) usage, the device-code flow, and cross-device magic links. These are still limited by what your platform administrator allows.

## Access rules — `ManageAccessRules`

```
GET  /api/v1/geo-restriction
PUT  /api/v1/geo-restriction        { "mode": "allow", "countries": ["IN", "US"] }     (mode: disabled | allow | deny)
GET  /api/v1/geo-rules?userId=&appId=
POST /api/v1/geo-rules              → 201 { "id" }
DELETE /api/v1/geo-rules/{ruleId}   → 204
```

`geo-restriction` is the organization's country setting. `geo-rules` are the other rules (see [Access Rules](../console/access-rules) for behaviour and precedence). A rule has a `scope` (`user`, `tag`, `app`, `org`), a `type` and the fields for that type:

| type | Fields |
|---|---|
| `country` (default) | `effect` (`allow`/`deny`), `countries` (two-letter codes) |
| `region` | `effect`, `regions` (`"IN:Karnataka"`) |
| `ip` | `effect`, `cidrs` (addresses or ranges) |
| `hours` | `days` (0 = Sunday), `startTime`, `endTime` (`"HH:mm"`), `timeZoneId` |
| `method` | `methods`: `password`, `webauthn`, `EmailOtp`, `SmsOtp`, `MagicLink`, `Ldap`, `Saml`, `Social` |
| `anonymizer` | none (blocks VPN, proxy and Tor) |
| `sessions` | `maxSessions` (1 to 50), for user, tag or org scope |
| `sessionlength` | `maxSessionMinutes` (1 to 43200), for user, tag or org scope |
| `devices` | `maxDevices` (1 to 20), for user, tag or org scope |

Plus `userId` / `tagId` / `appId` for the scope, and optional `reason` and `expiresAt`. An invalid rule returns `400 invalid_request` with a description.

### Registered devices — `ManageAccessRules`

```
GET    /api/v1/users/{id}/devices
POST   /api/v1/users/{id}/devices/{deviceId}/approve
POST   /api/v1/users/{id}/devices/{deviceId}/deny
DELETE /api/v1/users/{id}/devices/{deviceId}
```

For the `devices` rule type. `GET` returns `{ "devices": [{ "deviceId", "label", "status", "firstSeen", "lastUsed", "ip", "place" }] }` with `status` one of `registered`, `pending` or `denied`.

## Relationship tags — `ManageRelationshipTags`

```
GET   /api/v1/relationship-tags
POST  /api/v1/relationship-tags              { "name": "Contractor" }        → 201 { "tagId", "name" }
PATCH /api/v1/relationship-tags/{id}/policy  { "policyKey": "…", "value": true }
```

Listing returns each tag with `isDefaultForSignup`, `isDefaultForInvites` and its `policies` (`key`/`value` pairs).

## Role sync sources — `ManageRoleSync`

```
GET    /api/v1/role-sync-sources
POST   /api/v1/role-sync-sources             { "name": "Directory", "connectorName": "<installed role-sync connector>", "targetAppId": 7 }  → 201
PATCH  /api/v1/role-sync-sources/{id}/enabled    true | false        (raw JSON boolean body)
DELETE /api/v1/role-sync-sources/{id}
```

`name` and `connectorName` are required; `targetAppId` is optional. Listing returns `sourceId`, `name`, `connectorName`, `targetAppId`, `enabled`, `lastSyncedAt`.

## Tenant configuration — `ManageTenantConfig`

```
GET|PATCH /api/v1/tenant-config
{ "name": "Acme", "brandName": "Acme", "brandColor": "#0f766e", "brandLogoUrl": "https://…/logo.png",
  "tagline": "…", "aboutDescription": "…", "termsUrl": "https://…", "privacyUrl": "https://…" }

GET|PATCH /api/v1/tenant-config/powered-by
{ "email": true, "error": true, "consent": true, "account": true, "apiHeader": true, "webhook": true }
```

`GET tenant-config` returns the branding fields; `PATCH` also accepts `termsUrl` and `privacyUrl`. Send only the fields to change. The `powered-by` `PATCH` sets **all six** surfaces — send the full object.

## Custom fields — `ManageCustomFields`

```
GET    /api/v1/custom-fields?entity=user
POST   /api/v1/custom-fields
DELETE /api/v1/custom-fields/{fieldName}
```

```json
{ "fieldName": "employee_id", "displayLabel": "Employee ID", "fieldType": "text", "entity": "user",
  "isMandatory": false, "isPii": false, "visibility": "user_private", "description": "…" }
```

`POST` creates the field, or updates it if `fieldName` already exists. Delete returns `{ "fieldName", "deleted": true }`.

## Custom domain — `ManageDomains`

```
GET  /api/v1/domains          → { "identityMode", "slug", "customDomain", "verifyToken", "verifiedAt", "hasTlsCertificate" }
POST /api/v1/domains          { "domain": "login.acme.com" }  → 201
POST /api/v1/domains/verify   → { "verified": true }
```

Set the domain, publish the DNS record using `verifyToken`, then call `verify`.

## Data export — `ManageDataExport`

```
GET /api/v1/data-export/preview   → { "userCount", "appCount", "customFieldValueCount", "isLarge" }
GET /api/v1/data-export           → the full tenant export as JSON
```

Each download is recorded in the audit log. Check `preview` first — large tenants produce large files.

## Migration status — `ManageMigration`

```
GET /api/v1/migration-status
{ "storageProvider": "sqlite", "migrationStatus": "idle", "migrationTargetProvider": null }
```

Read-only. Starting a migration is done from **Console → Database & Migration**.

## Webhooks — `ManageWebhooks`

```
GET    /api/v1/webhooks
POST   /api/v1/webhooks               { "url": "https://…", "events": "*", "enabled": true, "description": "…", "appId": 7 }
PATCH  /api/v1/webhooks/{id}
DELETE /api/v1/webhooks/{id}
GET    /api/v1/webhooks/{id}/deliveries    (latest 100)
```

Create returns `201` with `{ "webhookId", "url", "secret" }` — the **signing secret is shown once**. `events` is a comma-separated list or `*` for all; `appId` optionally limits the endpoint to one app. Deliveries return `deliveryId`, `eventType`, `status`, `httpStatus`, `attemptCount`, `errorMessage`, `createdAt`, `deliveredAt`. For event formats and verifying signatures, see [Webhooks](../webhooks/overview).

## Notification settings — `ManageNotificationSettings`

```
GET|PATCH /api/v1/notification-settings
{ "enabledChannels": ["email", "sms"], "allowUserOverride": true }
```

`GET` returns `channelStates` (each channel's state for the tenant) and `allowUserOverride`.

---

## Creating organizations

Creating a new organization is **not** part of this tenant-scoped API. Platform operators who embed LoginLink in their own product use a separate credential — see the [Platform API](./platform-api).
