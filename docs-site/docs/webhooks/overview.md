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

Deliveries are attempted with automatic retry and backoff on failure. A webhook that fails repeatedly over an extended period is automatically paused rather than retried forever; Console shows recent delivery status (including response codes) per webhook, and lets you manually redeliver a specific failed event.

## Common events

| Event | Fires when |
|---|---|
| `user.created` | A new user is provisioned, regardless of source (self-signup, SCIM, Management API, social login, etc.) |
| `role.assigned` / `role.revoked` | A role is granted to or removed from a user |
| Session and security events | Sign-in, session revocation, and other security-relevant activity |

The exact event catalog is visible when creating a webhook in Console, since it's added to as new features ship.
