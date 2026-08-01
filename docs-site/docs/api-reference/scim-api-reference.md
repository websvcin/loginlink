---
title: SCIM API Reference
---

# SCIM API Reference

Base path: `/scim/v2/{tenantSlug}`, where `{tenantSlug}` is your tenant's own slug (shown alongside your base URL in **Console → SCIM Provisioning**). This is a pragmatic, real-interop subset of [RFC 7643](https://datatracker.ietf.org/doc/html/rfc7643)/[RFC 7644](https://datatracker.ietf.org/doc/html/rfc7644) — scoped to what mainstream IdPs (Okta, Azure AD/Entra) actually send, not the full protocol surface.

Every endpoint except the three discovery endpoints requires `Authorization: Bearer <scim_token>` — the token generated in Console, not an OAuth access token.

## Discovery (unauthenticated)

Per RFC 7644 §4, these describe the protocol surface itself and don't require a bearer token — your IdP's setup wizard typically fetches them before you've even entered the token.

| Method | Path |
|---|---|
| `GET` | `/ServiceProviderConfig` |
| `GET` | `/ResourceTypes` |
| `GET` | `/Schemas` |

## Users

### User resource shape

```json
{
  "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
  "id": "42",
  "externalId": "okta-00u1a2b3c4",
  "userName": "jane@example.com",
  "name": { "givenName": "Jane", "familyName": "Doe" },
  "displayName": "Jane Doe",
  "emails": [{ "value": "jane@example.com", "primary": true, "type": "work" }],
  "active": true,
  "groups": [{ "value": "1", "display": "Engineer" }],
  "meta": { "resourceType": "User", "created": "...", "lastModified": "...", "location": "/scim/v2/{tenantSlug}/Users/42" }
}
```

`userName` maps to the tenant's primary email identifier for that user.

### Endpoints

| Method | Path | Notes |
|---|---|---|
| `GET` | `/Users` | List. Supports `?filter=userName eq "..."` or `?filter=externalId eq "..."`, plus `startIndex`/`count` |
| `GET` | `/Users/{id}` | Get one |
| `POST` | `/Users` | Create. Returns `409` (`scimType: "uniqueness"`) if the `userName`/email already exists in this tenant |
| `PUT` | `/Users/{id}` | Full replace of name/active |
| `PATCH` | `/Users/{id}` | Partial update — `active` (the deprovisioning signal) and display name are supported operations |
| `DELETE` | `/Users/{id}` | Soft-deactivates (same as `active: false`) — never a hard delete |

### Example: deactivating a user

```
PATCH /Users/42
{
  "schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
  "Operations": [{ "op": "replace", "path": "active", "value": false }]
}
```

## Groups

Groups map onto your tenant's own roles, restricted to whichever roles you've allowed in Console's governance section — a role not on that list is invisible here entirely (`404`, not just absent from a list), matching SCIM's own "can never touch unchecked roles" boundary.

### Group resource shape

```json
{
  "schemas": ["urn:ietf:params:scim:schemas:core:2.0:Group"],
  "id": "1",
  "displayName": "Engineer",
  "members": [{ "value": "42", "display": "jane@example.com" }],
  "meta": { "resourceType": "Group", "location": "/scim/v2/{tenantSlug}/Groups/1" }
}
```

### Endpoints

| Method | Path | Notes |
|---|---|---|
| `GET` | `/Groups` | List — only governed roles appear |
| `GET` | `/Groups/{id}` | Get one — `404` if not governed |
| `PATCH` | `/Groups/{id}` | `add`/`remove` operations on `members` grant/revoke the underlying role assignment |

### Example: assigning a role via group push

```
PATCH /Groups/1
{
  "Operations": [
    { "op": "add", "path": "members", "value": [{ "value": "42" }] }
  ]
}
```

This is the same mechanism Okta and Azure AD call "group push" — no separate SCIM-specific role model exists behind it.
