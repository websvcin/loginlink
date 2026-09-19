---
title: BYO-DB / Data Residency
---

# BYO-DB / Data Residency

By default, each tenant's data lives in its own isolated database file, managed entirely by LoginLink. For customers with stricter data-residency or compliance requirements, a tenant can instead **bring your own database** — pointing its own tenant data at a MySQL or PostgreSQL instance you control, in whichever region or environment your compliance requirements dictate.

## What stays where

- **Your tenant's own data** (users, identifiers, sessions, audit log, roles) — moves to your BYO database once configured.
- **Platform-level data** (which tenants exist, platform administrators and settings, cross-tenant routing) — lives in the platform's **control plane**, which the platform operator places (SQLite by default, or MySQL/PostgreSQL) — it is separate from, and never changed by, any one tenant's BYO-DB choice. This is intentional: a tenant's own data residency choice shouldn't require re-architecting how LoginLink finds and routes to tenants in the first place. See [Where Your Data Lives](../self-hosting/where-your-data-lives).

## Configuring BYO-DB

You can choose MySQL or PostgreSQL when you [create the organization](../getting-started/creating-an-organization), or later from **Console → Database & Migration** (platform-operator approval may be required, depending on how your LoginLink instance is configured) — supply connection details for your MySQL or PostgreSQL instance. The connection is tested first, and LoginLink provisions the required schema automatically on first connection, the same schema every SQLite-backed tenant already runs.

At signup, the database you point at must be **empty** — self-service signup won't attach to one that already has data. Platform operators can also let approved organizations have a database **created for them** on the operator's own hosting — see [Database Auto-Provisioning](../self-hosting/database-auto-provisioning).

## Supported backends

| Backend | Status |
|---|---|
| SQLite (default) | Built-in, zero configuration |
| MySQL | Supported |
| PostgreSQL | Supported |
| SQL Server | Not yet supported |

The same MySQL and PostgreSQL support applies to the platform's own control plane, which the operator can place on either — see [First-Run Setup](../self-hosting/first-run-setup).
