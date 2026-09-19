---
title: First-Run Setup
---

# First-Run Setup

A fresh LoginLink install has no administrator and no database choice made yet, so the first time you open it, every page redirects to **`/setup`** — a short wizard that gets you to a working platform. There is no built-in account or default password: you create your own administrator as part of it.

An install that already has a platform administrator (for example an existing data volume from a previous install) skips the wizard entirely and goes straight to the normal sign-in pages.

## The five steps

### 1. Data location

Shows where LoginLink will keep `bootstrap.db` — a small local SQLite file that records which database everything else runs on. It is **always** local SQLite (necessarily: it's what tells the instance where its real database lives), whatever database you choose for the rest.

- The detected path is normally already correct for your volume mount.
- To use a different location, set `LoginLink__Storage__Sqlite__DataRootPath` and restart — this can't be changed from the page.
- **On Plesk, IIS or other shared hosting, point it outside your deployed site folder**, so a routine publish can never overwrite your data.
- Already have a `bootstrap.db` from another install and no way to place the file on the server? You can upload it here. It's validated (SQLite header and expected tables) and rejected with a specific reason if it isn't a real LoginLink file.

### 2. Database hosting (optional)

Decide whether LoginLink should be able to **create MySQL/PostgreSQL databases for you on demand**, using a hosting panel or server you already have (Plesk, cPanel, or a standalone MySQL/PostgreSQL server).

- **Skip** — the default. You can set it up later from **Admin → Platform Settings → Database Provisioning**.
- **Configure it now** — enter the panel or server details and test them. See [Database Auto-Provisioning](./database-auto-provisioning) for what each field means.

You only need this if you want LoginLink to create databases itself — for the control plane in the next step, for a demo organization, or for organizations that sign up themselves.

### 3. Control-plane database

The **control plane** is the database that holds platform settings, signing keys, the tenant registry and platform administrators. Choose where it lives:

| Choice | What happens |
|---|---|
| **SQLite** (start fresh) | Nothing to configure. The file is created inside your data directory. You can migrate to MySQL/PostgreSQL later from **Admin → Platform Settings → Platform Database**. |
| **MySQL or PostgreSQL** (start fresh) | Either have LoginLink **create a new database for you** (if you configured hosting in step 2), or enter the details of a server you run. The connection is tested first; the schema is then created with live progress. |
| **Connect an existing database** | Point at a control-plane database from a previous install. LoginLink inspects it and, if it already has an administrator, attaches without provisioning anything. |

When a fresh MySQL/PostgreSQL database is ready, the page locks into a confirmation — you can't accidentally provision a second one by navigating back. Use the small "start over" link only if you genuinely chose the wrong database.

For what each layer holds and what to back up, see [Where Your Data Lives](./where-your-data-lives).

Only **your chosen database** is created. Picking MySQL or PostgreSQL does not also create a local SQLite copy of the control plane.

### 4. Platform administrator

Create your first platform administrator: an email, a name, and a password that meets the platform's password policy. If step 3 attached a database that already has an administrator, this step is replaced by a sign-in prompt instead.

### 5. Finish — optionally, a demo organization

The last screen offers to create a **demo organization** you can explore straight away, or to **skip** — which is what you'll want for production. A demo organization lets you choose:

- its **URL slug** (default `demo`), admin email and password (defaults are pre-filled and can be changed), and
- **where its database lives** — SQLite, or MySQL/PostgreSQL created automatically from the hosting you set up in step 2.

If you choose an auto-provisioned database, you'll see a live progress screen while it's created. If something fails, the page tells you what went wrong and lets you fix the input and retry; anything half-created is cleaned up.

Skipping is safe: your real organization can be created at any time at [`/signup-tenant`](../getting-started/creating-an-organization), and platform administrators can register organizations from the admin console.

## After setup

- **Platform administrators** sign in at `/admin/login`.
- **Organization administrators** sign in at `/console/login`.
- Settings for signup and database creation live under **Admin → Platform Settings** — see [Signup Security](./signup-security) and [Database Auto-Provisioning](./database-auto-provisioning).

## Troubleshooting

**I keep landing on `/setup` after finishing it.** Setup is only complete once you finish step 5. If it repeats after a restart, your data folder isn't persistent — a new, empty `bootstrap.db` is created each time. Mount a volume (Docker) or set `DataRootPath` (binary) so the folder survives restarts; see [Docker Images](./docker-images) and [Run from a GitHub Release](./binary-releases).

**The connection test to my MySQL/PostgreSQL server fails.** The test runs from the *LoginLink server*, not your laptop, so check that server can reach the database host and port (firewall, allow-lists). Managed providers almost always require SSL — leave SSL mode on. The account needs permission to create tables, and for a *fresh* control plane the database should be empty.

**I picked the wrong control-plane database.** Before you continue past step 3, use the small "start over with a different database" link on the confirmation. After setup is finished, migrate from **Admin → Platform Settings → Platform Database** instead.

**I want to reset a development install and run setup again.** See *Starting over* in [Backing Up & Moving Your Deployment](./backup-and-moving#starting-over) — including dropping any MySQL/PostgreSQL databases you'd created.
