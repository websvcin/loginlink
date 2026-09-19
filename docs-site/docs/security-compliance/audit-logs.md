---
title: Audit Logs
---

# Audit Logs

Every security-relevant action in your tenant — sign-ins, role changes, credential creation, SCIM/Management API activity, admin actions — is recorded to an audit log, queryable from **Console → Audit**.

## What's recorded

Each entry includes the action, the actor (user or credential), the target, IP address, user agent, a timestamp, and action-specific metadata (e.g. which role was granted, which fields changed). Entries are attributed to their real source — a user created via SCIM is recorded distinctly from one created via self-signup or the Management API, so you can always tell how an account came to exist.

## Querying and exporting

Console's audit view supports filtering by date range (quick presets from last 24 hours to last 90 days, or a custom range), action prefix, user ID, and IP address, with CSV export for anything you need to hand to a compliance review or a security investigation. Summary tiles above the table show total events, sign-ins, failures, and unique users for the selected range at a glance.

![The Audit Log page, showing summary tiles, date-range and filter controls, and a list of recent sign-in and risk-evaluation events](/img/screenshots/console-audit-log.png)

## Retention

Audit log retention is configurable per tenant. Entries older than the configured retention period are pruned automatically by a background worker — set retention long enough to satisfy your own compliance requirements before relying on historical audit data being available.
