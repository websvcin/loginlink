---
title: Management API Reference
---

# Management API Reference

Base path: `/api/v1`. Every request needs `Authorization: Bearer <access_token>` from a `client_credentials` token issued to a [Management API credential](../automating-your-tenant/management-api). Every action is scoped to that credential's own tenant.

## Errors

Errors are returned as:

```json
{ "error": "insufficient_scope", "error_description": "This credential does not have the 'ManageUsers' capability." }
```

| Status | `error` | Meaning |
|---|---|---|
| `400` | `invalid_request` | Missing/invalid field in the request body |
| `401` | `invalid_token` | Missing, malformed, or expired bearer token |
| `403` | `insufficient_scope` | The credential lacks the capability this endpoint requires |
| `404` | `not_found` | No such resource in this tenant |

## Users — requires `ManageUsers`

### Create a user

```
POST /api/v1/users
{ "email": "jane@example.com", "name": "Jane Doe" }
```

```json
201
{ "userId": 42, "email": "jane@example.com", "status": "active" }
```

### Get a user

```
GET /api/v1/users/{id}
```

```json
200
{ "userId": 42, "email": "jane@example.com", "name": "Jane Doe", "status": "active", "createdAt": "2026-01-01T00:00:00Z" }
```

### Update a user

```
PATCH /api/v1/users/{id}
{ "name": "Jane R. Doe" }
```

Returns the updated user object, same shape as **Get a user**.

### Deactivate a user

```
DELETE /api/v1/users/{id}
```

```json
200
{ "userId": 42, "status": "suspended" }
```

This is a soft deactivation — the same as suspending a user from Console — never a hard delete.

## Roles — requires `ManageRoles`

### List roles

```
GET /api/v1/roles
```

```json
200
[{ "roleId": 1, "name": "Support", "description": "Support team" }]
```

### Grant a role

```
POST /api/v1/users/{id}/roles
{ "roleId": 1 }
```

```json
201
{ "userId": 42, "roleId": 1 }
```

### Revoke a role

```
DELETE /api/v1/users/{id}/roles/{roleId}
```

```json
200
{ "userId": 42, "roleId": 1 }
```

## Apps — requires `RegisterApps`

### Register a new app

```
POST /api/v1/apps
{ "name": "Internal Tool", "redirectUris": ["https://internal.yourapp.com/callback"] }
```

```json
201
{ "appId": 7, "clientId": "b3f1...", "clientSecret": "sK9x..." }
```

The `clientSecret` is shown exactly once in the response — store it immediately, it can't be retrieved again.
