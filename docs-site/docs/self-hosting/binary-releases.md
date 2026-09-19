---
title: Run from a GitHub Release
---

# Run from a GitHub Release

If you'd rather not run Docker — deploying to IIS, a systemd service, or a host like Plesk that manages the .NET process directly — every [GitHub Release](https://github.com/websvcin/loginlink/releases) also ships a ready-to-run build as a downloadable ZIP.

## What's in the release

Each release (e.g. `v1.0.57`) has:

- A **ZIP asset** (`loginlink-v1.0.57.zip`) — a `dotnet publish` output. It's framework-dependent, so the target machine needs the **.NET 8 runtime** installed (not the full SDK).
- Release notes with the matching Docker Hub and GHCR image tags for that exact build, if you'd rather run it as a container instead — see [Docker Images](./docker-images).

## Run it

```bash
# Download and unzip the release you want
curl -LO https://github.com/websvcin/loginlink/releases/download/v1.0.57/loginlink-v1.0.57.zip
unzip loginlink-v1.0.57.zip -d loginlink
cd loginlink

# Requires the .NET 8 runtime on this machine
dotnet LoginLink.dll
```

By default it listens on port `5000` (HTTP) and `5443` (HTTPS) — same as the Docker image. Point a reverse proxy (nginx, IIS, Plesk's own proxy) at it the same way you would any Kestrel app.

Data (`bootstrap.db` and the SQLite control-plane and tenant files) lands in `App_Data` next to the executable by default. On first start, open the site in a browser — a fresh install runs the [First-Run Setup](./first-run-setup) wizard.

## Upgrading without risking your data

The default `App_Data` location — next to the executable — is fine to start with, but it means an upgrade that involves unzipping a new release *into* (or over) the same folder can take your data with it if you're not careful. There's a cleaner way: point `App_Data` at a fixed folder **outside** wherever you unzip releases, once, and every future upgrade becomes unzip-and-restart with zero risk of touching it.

Set it via an environment variable:

```bash
export LoginLink__Storage__Sqlite__DataRootPath=/var/loginlink/App_Data
```

(or the equivalent `LoginLink:Storage:Sqlite:DataRootPath` key in `appsettings.json`, or on Windows/IIS as an App Setting). With that set, your upgrade routine is simply:

1. Unzip the new release into its own fresh folder (`loginlink-v1.0.58/`, alongside — not on top of — the old one).
2. Stop the old process, start `dotnet LoginLink.dll` from the new folder.
3. Delete the old release folder whenever you're confident — `App_Data` was never inside it, so there's nothing to lose either way.

If you're still using the default in-folder location, at minimum back it up before every upgrade and never `unzip -o` a new release directly over an existing install.

## Choosing a version

Pick an exact tag from the [Releases page](https://github.com/websvcin/loginlink/releases) rather than always grabbing the newest — same reasoning as pinning a Docker tag: know exactly what's running, and control when you move to the next one.
