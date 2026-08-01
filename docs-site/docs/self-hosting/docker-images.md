---
title: Docker Images
---

# Docker Images

:::caution Design-locked, not yet built
Published Docker images are **designed but not yet implemented** (see `LOCK-68`). This page describes the planned shape; the images below aren't published yet — don't expect `docker pull` to succeed against these names today.
:::

## Planned shape

On every version tag (`v*.*.*`) pushed to the source repository, a build pipeline will:

1. Build and test the full solution.
2. Build a Docker image for that version.
3. Publish it to **both** Docker Hub and GitHub Container Registry (GHCR), so you're never locked into pulling from one specific registry.
4. Cut a GitHub Release with the image tags and a changelog — mirrored on the [Changelog](../changelog) page of these docs.

```bash
# Planned — not yet available
docker pull loginlink/loginlink:1.4.0
# or
docker pull ghcr.io/websvcin/loginlink:1.4.0
```

Only tagged releases get an image — not every commit — so "which image is production-ready" always has an unambiguous answer.

## Until then

Build from source: clone the repository, `dotnet build` the solution, and run it directly. See the main repository's own README for local development setup — this docs site doesn't duplicate that content since it changes independently of the public-facing integration surface these docs cover.
