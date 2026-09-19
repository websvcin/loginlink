---
title: Where Your Data Lives
---

# Where Your Data Lives

LoginLink keeps its data in three layers. Knowing which is which tells you what to back up, what you can move to MySQL/PostgreSQL, and what to do when something looks wrong.

```
bootstrap.db        always a small local SQLite file — "where is everything else?"
      │
      ▼
control plane       one database: SQLite (platform.db) or MySQL/PostgreSQL
      │             — the tenant registry, platform admins, platform settings, keys
      ▼
tenant databases    one per organization: SQLite (tenant_<id>.db) or MySQL/PostgreSQL
```

## 1. `bootstrap.db` — always local SQLite

A small file in your data folder (`App_Data` by default). It is local SQLite **necessarily, not by policy**: it's what tells a starting instance which database the control plane lives in, and it can't ask a database it hasn't found yet.

It holds:

- which database the control plane uses, and the (encrypted) credentials to connect to it,
- your first-run setup progress,
- the (encrypted) credentials of the [auto-provisioning hosting environment](./database-auto-provisioning), if you configured one, and
- coordination details used when more than one instance shares a database.

## 2. The control plane

The **control plane** is one database that holds everything about the platform itself:

- the registry of organizations (tenants) and how to reach each one's database,
- platform administrators and platform-wide settings (including [signup security](./signup-security)),
- the platform's token-signing keys,
- the key used to encrypt each organization's external-database credentials, and
- the routing index that finds which organization an identifier (such as an email) belongs to.

You choose where it lives during [first-run setup](./first-run-setup):

| Choice | Where the data is |
|---|---|
| **SQLite** (default) | A file, `platform.db`, in your data folder. |
| **MySQL or PostgreSQL** | A database on a server you run or one LoginLink created for you. Nothing control-plane-related is kept in a local `platform.db`. |

You can also move an SQLite control plane to MySQL/PostgreSQL later from **Admin → Platform Settings → Platform Database**.

:::note Upgrading an older install
Older versions kept platform settings and keys in a separate `host.db`. Current versions use a single control-plane database: on the first start after upgrading, the contents of `host.db` are merged into it and the startup log says so. After that message, `host.db` is no longer used and can be archived.
:::

## 3. Tenant databases

Every organization has its own database, so one organization's data is never in another's:

- **SQLite (default)** — a file per organization, `tenant_<id>.db`, in your data folder.
- **MySQL or PostgreSQL** — chosen by the organization when it [signs up](../getting-started/creating-an-organization) or later from **Console → Database & Migration**. Either a server the organization operates, or one created automatically through [Database Auto-Provisioning](./database-auto-provisioning). See [BYO-DB / Data Residency](../security-compliance/byo-db-data-residency).

## What to back up

| Your setup | Back up |
|---|---|
| Everything on SQLite (the default) | The whole `App_Data` folder, as one unit. |
| Control plane on MySQL/PostgreSQL | `bootstrap.db` from your data folder **and** the control-plane database. |
| Any organization on MySQL/PostgreSQL | That organization's database, on whatever schedule you back up any production database. LoginLink stores only the *connection* for it, not the data. |

If you lose `bootstrap.db` while the control plane is on MySQL/PostgreSQL, the control-plane database itself is intact. You can run first-run setup again and choose **Connect an existing database** to reattach — but keep a backup so you never need to.

See [Backing Up & Moving Your Deployment](./backup-and-moving) for the step-by-step.
