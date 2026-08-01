---
title: docker-compose Quickstart
---

# docker-compose Quickstart

:::caution Design-locked, not yet built
This page describes the planned shape once [Docker Images](./docker-images) (`LOCK-68`) are published. The compose file below is illustrative — it references image tags that don't exist yet.
:::

## Planned shape

A single `docker-compose.yml` bringing up LoginLink with a local database for evaluation or small-scale self-hosting:

```yaml
# Planned — not yet available
version: "3.8"
services:
  loginlink:
    image: ghcr.io/websvcin/loginlink:latest
    ports:
      - "8080:8080"
    environment:
      LOGINLINK__ISSUER: "https://auth.yourdomain.com"
    volumes:
      - loginlink-data:/app/App_Data

volumes:
  loginlink-data:
```

By default LoginLink's platform/host data uses an embedded SQLite file (mounted via the volume above); production deployments can point tenant storage at MySQL or PostgreSQL instead — see [BYO-DB / Data Residency](../security-compliance/byo-db-data-residency).

## Until then

Run the solution directly with `dotnet run` against a local clone — see the main repository README.
