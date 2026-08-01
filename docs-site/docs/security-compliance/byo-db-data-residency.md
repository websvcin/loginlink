---
title: BYO-DB / Data Residency
---

# BYO-DB / Data Residency

By default, each tenant's data lives in its own isolated database file, managed entirely by LoginLink. For customers with stricter data-residency or compliance requirements, a tenant can instead **bring your own database** — pointing its own tenant data at a MySQL or PostgreSQL instance you control, in whichever region or environment your compliance requirements dictate.

## What stays where

- **Your tenant's own data** (users, identifiers, sessions, audit log, roles) — moves to your BYO database once configured.
- **Platform-level data** (which tenants exist, cross-tenant routing) — always managed by LoginLink itself, regardless of any tenant's BYO-DB configuration. This is intentional: a tenant's own data residency choice shouldn't require re-architecting how LoginLink finds and routes to tenants in the first place.

## Configuring BYO-DB

**Console → Settings → Database** (platform-operator approval may be required, depending on how your LoginLink instance is configured) — supply connection details for your MySQL or PostgreSQL instance. LoginLink provisions the required schema automatically on first connection, the same schema every SQLite-backed tenant already runs.

## Supported backends

| Backend | Status |
|---|---|
| SQLite (default) | Built-in, zero configuration |
| MySQL | Supported |
| PostgreSQL | Supported |
| SQL Server | Not yet supported |
