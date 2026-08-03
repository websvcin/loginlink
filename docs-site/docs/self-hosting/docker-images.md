---
title: Docker Images
---

# Docker Images

Every push to `main`, and every version tag (`vX.Y.Z`), builds and publishes a Docker image to **both** Docker Hub and GitHub Container Registry (GHCR) — you're never locked into pulling from one specific registry.

## Pull it

```bash
# Docker Hub
docker pull websvcin/loginlink:latest

# GHCR
docker pull ghcr.io/websvcin/loginlink:latest
```

Available tags on both registries:

| Tag | What it points to |
|---|---|
| `latest` | The most recent build on `main` |
| `1.0` (current minor series) | The most recent build in that minor series |
| `v1.0.57` (exact version) | An exact, immutable build — see the [Changelog](../changelog) or the [GitHub Releases page](https://github.com/websvcin/loginlink/releases) for what's in each one |

Pin to an exact `vX.Y.Z` tag for anything you'd call production; `latest` moves under you on every push to `main`.

## Run it

```bash
docker run -d \
  -p 5000:5000 -p 5443:5443 \
  -v $(pwd)/App_Data:/app/App_Data \
  --name loginlink \
  websvcin/loginlink:latest
```

- Port `5000` is HTTP, `5443` is HTTPS.
- `/app/App_Data` is where every SQLite file lives (host/platform/tenant databases) — mount it to a persistent volume or your data resets on every container recreation.
- The image exposes `/healthz` for liveness checks (already wired into the container's own `HEALTHCHECK`).

Then open `http://localhost:5000` and create your first organization.

For a multi-service setup (or if you'd rather declare this once instead of a long `docker run`), see the [docker-compose Quickstart](./docker-compose).

## Other ways to get it

- **[docker-compose Quickstart](./docker-compose)** — a single `docker-compose.yml` for local evaluation or small-scale hosting.
- **[Run from a GitHub Release](./binary-releases)** — download the published build directly and run it with the .NET runtime, no Docker required.
