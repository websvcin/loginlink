---
title: Audit Logs
---

# Audit Logs

Every security-relevant action in your tenant — sign-ins, role changes, credential creation, SCIM/Management API activity, admin actions — is recorded to an audit log, queryable from **Console → Audit**.

## What's recorded

Each entry includes the action, the actor (user or credential), the target, IP address, user agent, a timestamp, and action-specific metadata (e.g. which role was granted, which fields changed). Entries are attributed to their real source — a user created via SCIM is recorded distinctly from one created via self-signup or the Management API, so you can always tell how an account came to exist.

## Querying and exporting

Console's audit view supports filtering by date range, action type, and actor, with CSV export for anything you need to hand to a compliance review or a security investigation.

## Retention

Audit log retention is configurable per tenant. Entries older than the configured retention period are pruned automatically by a background worker — set retention long enough to satisfy your own compliance requirements before relying on historical audit data being available.
