---
title: Backing Up & Moving Your Deployment
---

# Backing Up & Moving Your Deployment

Whether you're on Docker, Docker Compose/Portainer, or a [GitHub Release binary](./binary-releases), everything that makes your deployment *yours* — every tenant, every user, every BYO-DB connection — lives in one place: the `App_Data` folder.

## What's actually in there

- `bootstrap.db`, `host.db`, `platform.db` — the platform's own registry: which tenants exist, their settings, and (for any tenant on MySQL or PostgreSQL) their **encrypted** connection credentials.
- `tenant_*.db` — every tenant using the default embedded SQLite storage, one file each.
- The encryption keys that decrypt those BYO-DB credentials — both live *inside* `App_Data` itself (`bootstrap.db` and `host.db` respectively), not in an environment variable or external secret store.

That last point matters: it means `App_Data` is **fully self-contained**. A tenant's Postgres or MySQL connection string, and the key needed to decrypt it, always travel together in the same folder. You never have to separately track or re-enter secrets when backing up or moving.

## Backing up

Back up the whole `App_Data` folder as a unit, on whatever schedule and tooling you'd use for any other application data — there's nothing LoginLink-specific about how you snapshot or copy it.

- **Docker / Docker Compose / Portainer** — back up the host directory your volume points at. If you followed the [Portainer guidance](./docker-compose#deploying-via-portainer-plesk-or-any-other-docker-host) and used a fixed absolute path, that's the one directory to back up — it doesn't move just because a stack gets recreated.
- **GitHub Release binary** — back up whatever you set `DataRootPath` to (see [Run from a GitHub Release](./binary-releases#upgrading-without-risking-your-data)), or the in-folder `App_Data` if you haven't relocated it.

If a tenant is on external MySQL/Postgres, back up that database server too, the same way you'd back up any other production database — `App_Data` holds the *connection*, not the data itself, for those tenants.

## Moving to a new server (same domain)

This is the common case: your current host is being retired, or you're moving to new infrastructure, but you're keeping the same domain (e.g. `auth.acme.com` stays `auth.acme.com`, just served from a different machine).

1. Copy the entire `App_Data` folder (or your chosen `DataRootPath`) to the new server.
2. Start the new deployment pointed at that same folder — same Docker volume path, or same `DataRootPath` setting.
3. If any tenant is on external MySQL/Postgres, make sure the new server can reach that same database server (network/firewall rules) — the connection details themselves came along with `App_Data`.

That's it. No data migration step, no reconfiguration, no secrets to re-enter. On boot, LoginLink reconnects to every tenant's real, existing database exactly as it did before — the same idempotent schema check described in the [BYO-DB / Data Residency](../security-compliance/byo-db-data-residency) guide runs and finds everything already in place.

## Moving to a new domain

If the new deployment is also served from a **different** domain (not just different infrastructure — an actual new hostname), your data still moves over fine, but there's one thing outside LoginLink's control: any of your tenants' own downstream apps that already registered a redirect URI or cached a discovery document against the *old* domain will need updating on their end. This is standard OIDC/OAuth behavior — the same thing would happen moving off any identity provider's domain, LoginLink included — not something a data migration can paper over.

## How you'll know if something went wrong

If a deployment ever boots up with zero tenants when you expected existing ones, the startup log will say so loudly, immediately, before anything else happens — including before a fresh Demo tenant would otherwise get seeded, which would otherwise look like a perfectly normal, working platform and mask the fact that your real data isn't there. If you see that warning and weren't expecting a brand-new install, stop and check your volume path or `DataRootPath` before doing anything else.
