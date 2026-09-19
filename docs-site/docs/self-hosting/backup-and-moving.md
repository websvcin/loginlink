---
title: Backing Up & Moving Your Deployment
---

# Backing Up & Moving Your Deployment

Whether you're on Docker, Docker Compose/Portainer, or a [GitHub Release binary](./binary-releases), what makes your deployment *yours* — every tenant, every user, every connection — lives in your **data folder** (`App_Data` by default) and, if you chose MySQL or PostgreSQL for any part of it, in those databases. [Where Your Data Lives](./where-your-data-lives) explains the three layers; this page is the practical side.

## What's in the data folder

- `bootstrap.db` — always present. Records which database the control plane uses, the encrypted credentials to reach it, and your setup progress.
- `platform.db` — the **control plane**, *if* you left it on the default SQLite: the tenant registry, platform administrators, settings, signing keys, and the (encrypted) connection credentials of any organization on MySQL or PostgreSQL. If you put the control plane on MySQL/PostgreSQL, this file isn't created.
- `tenant_*.db` — every organization using the default embedded SQLite storage, one file each.

The keys that decrypt stored connection credentials live *inside* those databases (`bootstrap.db` for the control-plane and hosting-environment credentials; the control-plane database for each organization's credentials), not in an environment variable or external secret store. So with everything on SQLite, the data folder is **fully self-contained**: a connection string and the key that decrypts it always travel together, and you never re-enter secrets when backing up or moving.

## Backing up

Back up on whatever schedule and tooling you'd use for any other application data — there's nothing LoginLink-specific about snapshotting or copying it.

**Everything on SQLite (the default)** — back up the whole data folder as a unit.

- **Docker / Docker Compose / Portainer** — back up the host directory your volume points at. If you followed the [Portainer guidance](./docker-compose#deploying-via-portainer-plesk-or-any-other-docker-host) and used a fixed absolute path, that's the one directory to back up — it doesn't move just because a stack gets recreated.
- **GitHub Release binary** — back up whatever you set `DataRootPath` to (see [Run from a GitHub Release](./binary-releases#upgrading-without-risking-your-data)), or the in-folder `App_Data` if you haven't relocated it.

**Control plane on MySQL or PostgreSQL** — back up **two** things: `bootstrap.db` from the data folder, *and* the control-plane database. Take them together where you can. Without `bootstrap.db` a new instance doesn't know where the control plane is (you can recover by running [setup](./first-run-setup) again and choosing **Connect an existing database**, but don't rely on it).

**Organizations on MySQL or PostgreSQL** — back up each organization's database like any production database. The control plane holds the *connection*, not the data, for those organizations.

## Moving to a new server (same domain)

This is the common case: your current host is being retired, or you're moving to new infrastructure, but you're keeping the same domain (e.g. `auth.acme.com` stays `auth.acme.com`, just served from a different machine).

1. Copy the entire data folder (`App_Data`, or your chosen `DataRootPath`) to the new server.
2. Start the new deployment pointed at that same folder — same Docker volume path, or same `DataRootPath` setting.
3. If the control plane or any organization is on external MySQL/PostgreSQL, make sure the new server can reach those database servers (network/firewall rules). The connection details came along with your data.

That's it. No data migration step, no reconfiguration, no secrets to re-enter. On boot, LoginLink reconnects to every database exactly as before — the same idempotent schema check described in the [BYO-DB / Data Residency](../security-compliance/byo-db-data-residency) guide runs and finds everything already in place. An install that already has a platform administrator skips the setup wizard.

## Moving to a new domain

If the new deployment is also served from a **different** domain (not just different infrastructure — an actual new hostname), your data still moves over fine, but there's one thing outside LoginLink's control: any of your tenants' own downstream apps that already registered a redirect URI or cached a discovery document against the *old* domain will need updating on their end. This is standard OIDC/OAuth behavior — the same thing would happen moving off any identity provider's domain, LoginLink included — not something a data migration can paper over.

## Starting over

To wipe a **development** install and run first-run setup again:

1. Stop LoginLink.
2. Delete the contents of the data folder (`bootstrap.db`, `platform.db`, `tenant_*.db`).
3. If you had put the control plane or any organization on MySQL/PostgreSQL, **also drop those databases** — deleting local files does not touch them, and setup will offer to reconnect to what it finds there.
4. Start LoginLink and open it in your browser.

Never do this to an install with real data.

## How you'll know if something went wrong

If a deployment ever starts up with zero organizations when you expected existing ones, the startup log says so loudly, immediately — a warning headed **NO TENANTS FOUND**. If you see it and weren't expecting a brand-new install, stop and check your volume path or `DataRootPath` — and, if the control plane is on MySQL/PostgreSQL, that `bootstrap.db` is the right one and points at the right database — before doing anything else.
