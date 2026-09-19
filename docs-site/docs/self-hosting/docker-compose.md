---
title: docker-compose Quickstart
---

# docker-compose Quickstart

A single `docker-compose.yml` bringing up LoginLink for evaluation or small-scale self-hosting, using the embedded SQLite storage:

```yaml
services:
  loginlink:
    image: websvcin/loginlink:latest
    container_name: loginlink
    ports:
      - "5000:5000"
      - "5443:5443"
    volumes:
      - ./App_Data:/app/App_Data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/healthz"]
      interval: 30s
      timeout: 5s
      start_period: 30s
      retries: 3
```

```bash
docker compose up -d
```

Then open `http://localhost:5000` — a fresh install redirects to a short setup wizard where you choose your database and create your own administrator. See [First-Run Setup](./first-run-setup).

Swap `latest` for an exact `vX.Y.Z` tag (see [Docker Images](./docker-images)) once you're past evaluation and want a pinned, reproducible version.

By default LoginLink keeps its control plane and every organization's data in embedded SQLite files (mounted via the `App_Data` volume above). Production deployments can put the control plane and/or individual organizations on MySQL or PostgreSQL instead — choose during [First-Run Setup](./first-run-setup), and see [Where Your Data Lives](./where-your-data-lives) and [BYO-DB / Data Residency](../security-compliance/byo-db-data-residency).

## Deploying via Portainer (Plesk, or any other Docker host)

This same compose file works unchanged as a Portainer **Stack** — paste it in, deploy, done. Portainer, Plesk's Docker extension, Synology's Container Manager, and plain `docker compose` on any Linux box are all just running the same standard compose format underneath; nothing here is Docker-Hub- or LoginLink-specific.

One thing to get right up front, specifically for Portainer's **Stacks** feature: the `./App_Data` path above is *relative* to wherever Portainer happens to store that stack's files, which is a path Portainer generates per-stack — if you ever delete the stack and recreate it (rather than just updating the existing one), you get a **new** stack folder, and `./App_Data` silently starts empty again. Your old data isn't gone, it's just sitting in the old stack's folder, disconnected from the new container.

Avoid this by pointing the volume at a fixed, absolute path you choose yourself, instead of the relative one:

```yaml
    volumes:
      - /var/loginlink/App_Data:/app/App_Data
```

Pick any path outside Portainer's own managed directories (in Plesk, somewhere under your subscription's own storage is fine). As long as every future stack — recreated or not — mounts that *same* absolute path, your data survives regardless of what Portainer does with the stack itself. This is also the one path you need to back up — see [Backing up & moving your deployment](./backup-and-moving).
