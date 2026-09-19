---
title: Overview
---

# Webhooks

Subscribe to real-time notifications when something happens in your tenant — a user signs up, a role is granted or revoked, a session is created or revoked — instead of polling the [Management API](../automating-your-tenant/management-api) for changes.

## Setting up a webhook

**Console → Webhooks → New Webhook**:

1. Enter the HTTPS endpoint you want events delivered to.
2. Choose which events to subscribe to.
3. Save — LoginLink generates a signing secret for this webhook, used to verify delivered payloads actually came from LoginLink.

## Verifying a delivery

Every delivery includes a signature header computed over the raw request body using your webhook's secret. Recompute the signature on your end and compare before trusting the payload — never process a webhook body without verifying it first.

## Delivery and retries

Deliveries are attempted with automatic retry and backoff on failure, both tunable per organization within a platform-set ceiling — see [Webhooks Administration](../console/webhooks-administration) for the exact settings. A failing webhook keeps retrying on that schedule rather than being paused automatically; if you want to stop deliveries to a broken endpoint, disable it directly in Console. Console shows recent delivery status (including response codes) per webhook, and lets you fire a test event or manually retry a specific failed delivery.

## Full event catalog

| Event | Fires when |
|---|---|
| `user.created` / `user.updated` / `user.deleted` | A user is provisioned, changed, or removed — regardless of source (self-signup, SCIM, Management API, social login, etc.) |
| `signin.success` / `signin.failed` | A sign-in attempt succeeds or fails |
| `session.revoked` | A session is revoked |
| `consent.granted` / `consent.withdrawn` | A user grants or withdraws OAuth consent for an app |
| `role.assigned` / `role.revoked` | A tenant-wide role is granted to or removed from a user |
| `app_access.granted` / `app_access.revoked` | Per-app access is granted or revoked (see [Apps & Connectors](../console/apps-and-connectors#per-app-access-restriction)) |
| `tenant_admin.granted` / `tenant_admin.revoked` | A user is made, or stops being, a tenant admin |
| `device.trust.granted` / `device.trust.revoked` | A device is marked trusted, or has that trust removed |
| `tenant_join.requested` / `tenant_join.approved` / `tenant_join.denied` / `tenant_join.expired` | A [join request](../console/onboarding-and-membership#reviewing-join-requests) is submitted, decided, or lapses |

The exact event catalog (with sample payloads) is also shown when creating a webhook in Console, since it's added to as new features ship.
