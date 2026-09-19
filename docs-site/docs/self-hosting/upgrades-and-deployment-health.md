---
title: Upgrades & Deployment Health
---

# Upgrades & Deployment Health

When you upgrade LoginLink (pull a newer image, replace the binary, redeploy), the new version starts up, checks that your databases have the structure it expects, and carries on. **Admin → Platform Settings → Deployment Health** (`/admin/deployment-health`) shows you what that check recorded — and it is where you act if a schema change is ever held for your review.

This page explains what happens at startup, what the Deployment Health page shows, and how it behaves when several instances share one deployment.

## What happens when a new version starts

On every start, LoginLink:

1. **Creates any missing tables and columns in the control-plane database**, then records the run — see [the ledger](#the-provisioning-ledger) below.
2. **Re-checks every existing organization's database the same way**, so an organization created on an older version picks up tables added since. One organization's database being unreachable is logged and skipped; it never stops the platform or the other organizations from starting.
3. **Checks for pending schema changes** that need your attention (see [Holding for review](#holding-for-review-pending-schema-changes)). Most releases have none.

These steps only ever *add* structure. Existing data isn't rewritten or removed by them.

:::tip Back up before you upgrade
This is standard practice for every upgrade, not a sign anything unusual is expected. See [Backing Up & Moving Your Deployment](./backup-and-moving).
:::

## The Deployment Health page

Open **Admin → Platform Settings → Deployment Health**. It is available to platform administrators only.

At the top, three figures:

| Figure | Meaning |
|---|---|
| **Running version** | The version this instance was built as (for example `1.0.0`). Build metadata after a `+` is stripped, so you see the plain release number. |
| **Active instances (this database)** | How many running LoginLink instances have checked in within the last 60 seconds. Each instance checks in every 20 seconds. |
| **Scopes tracked** | The control-plane database plus one row per tenant backend, described below. |

### The control-plane database

The control-plane card shows:

- the **database type** in use (SQLite, MySQL or PostgreSQL),
- a **tier badge** — *Tier 2 — additive-safe* when a future release that adds a column can reach this database automatically, or *Tier 3 — can't receive new columns* when it can't. All three supported database types are currently additive-safe,
- a **status badge**: *provisioned by running version* (the most recent recorded run succeeded and was made by the version now running), *provisioning in progress elsewhere* (another instance holds the startup lock right now), *last provisioning attempt failed*, or *unreachable* if LoginLink couldn't connect to check, and
- the **five most recent provisioning runs**: app version, time (UTC), and result — with the error text for a failed run.

If the control plane can't be reached, the page shows the connection error instead of failing; it never returns a raw server error just because the thing it checks is down.

### Tenant databases, by backend

Every organization has its own database, possibly on its own backend, so there is no single "tenant database" to inspect. This table shows **one row per backend type in use** — for example `sqlite: 12 tenants`, `mysql: 3 tenants` — with whether an additive schema change would reach that backend automatically. Deleted organizations aren't counted.

The page deliberately does not open every organization's database to summarize its history on each load. Each organization's own database does keep the same provisioning record (written each time it is checked at startup), so the history travels with the organization if you [migrate it to another database](../security-compliance/byo-db-data-residency).

### Risk tiers

The page ends with a reference table of how a future schema change would be treated:

| Tier | What it is | What happens |
|---|---|---|
| **1** | Code-only change; no schema touched | Automatic. Nothing on this page changes. |
| **2** | Add a column or table, and the backend supports it | Applied automatically; recorded in the ledger once it is. |
| **3** | Add a column, but the backend can't do it | Flagged on the page — never silently skipped or silently failed. |
| **4** | A change that could break an organization | Never applied automatically. |

Tier 4 is a category a change's author has to declare; LoginLink can't detect it by itself, so it isn't computed on the page.

## The provisioning ledger

Each time a database's structure is checked at startup, LoginLink writes a row into a table named `schema_provisioning_log` inside **that same database**: the app version, the time, and whether it succeeded (with the error message if not). It is the recorded answer to "which version last set up this database, and did it work?" — rather than an inference that "it's probably up to date".

Because it lives in the database itself, it moves with the database when you migrate between SQLite, MySQL and PostgreSQL.

It is an **audit trail, not a version-by-version migration system**: LoginLink doesn't replay numbered upgrade scripts. It makes sure the expected tables and columns exist.

## Holding for review: pending schema changes

Occasionally a release can include a schema change to the control-plane database that is registered for review. If one is detected at startup:

- The Deployment Health page shows a **Pending schema change detected** panel listing each change.
- The instance **holds** — it answers sign-in and app traffic with a `503` and a "completing a scheduled schema update" message (with `Retry-After: 10`) — until the change is applied. The **`/admin`** area, `/setup` and static assets stay reachable, so you can open Deployment Health and act.
- You can click **Apply now**, or do nothing: **after a 15-minute grace period the change is applied automatically.** The page shows the exact time this will happen. The start of the hold is recorded persistently, so restarting the instance doesn't reset the clock.

Applying uses one routine whether you click or the timer fires. Each applied change is logged with who or what triggered it, and a ledger row is written. Some changes are never applied automatically:

- a change **marked as breaking** stays pending until someone handles it deliberately, and
- a change that the database's backend **can't receive** (Tier 3) is reported as blocked, not skipped silently.

After **Apply now**, the page tells you how many were applied and how many remain blocked. When nothing is left pending, the hold is cleared and traffic resumes.

Most releases add nothing to this list — the common case is that you upgrade and see no pending panel at all. **Back up your database before applying**, as with any upgrade.

## Running more than one instance

You can run several LoginLink instances against the same databases (for example behind a load balancer). Some coordination is built in:

- **Startup provisioning lock.** Before creating or updating the control-plane structure, an instance takes a short-lived lock (it expires after two minutes if the holder dies). If another instance already holds it, the second instance **skips that step for this start** rather than doing it twice; it is safe because these changes only add structure. The Deployment Health page shows *provisioning in progress elsewhere* while the lock is held.
- **Applying changes.** "Apply now" and the automatic timer take their own lock, so two instances don't apply the same change at once. If you click while another instance is applying, you'll see *Nothing to apply — another instance may have already handled this.*
- **Active instances count.** This is the number of instances checking in to the same `bootstrap.db`.

:::caution Locks and the instance count follow `bootstrap.db`
These coordination records are kept in `bootstrap.db`, the small local file described in [Where Your Data Lives](./where-your-data-lives). They coordinate instances that **share that file** (the same data volume). Two instances each with their *own* `bootstrap.db` don't see each other, don't lock each other out, and each report an active-instance count of one. If you run multiple instances, give them the same data volume or ensure they're configured against the same bootstrap file.
:::

## What is not on this page

- There is no one-click "roll back to the previous version". To go back, restore your backups and redeploy the earlier version.
- There is no per-organization upgrade status on the page — only the per-backend summary above.

## Related

- [Backing Up & Moving Your Deployment](./backup-and-moving)
- [Where Your Data Lives](./where-your-data-lives)
- [Docker Images](./docker-images) and [Run from a GitHub Release](./binary-releases)
