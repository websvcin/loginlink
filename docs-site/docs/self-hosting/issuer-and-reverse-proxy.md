---
title: Issuer URL & Reverse Proxy
---

# Issuer URL & Reverse Proxy

Two settings decide whether the URLs LoginLink hands out — in tokens, discovery documents, emails and setup pages — are the ones your users and applications can actually reach:

1. the **issuer URL** — the public address of your LoginLink instance, and
2. the **reverse-proxy settings** — whether LoginLink trusts the client IP and protocol your proxy reports.

Get both right before you point real applications at the instance.

## The issuer URL

The issuer is the public base URL of your deployment, for example `https://auth.acme.com` (no trailing path). OIDC clients compare it to the `iss` claim in every token, so it must match the address applications use to reach LoginLink exactly.

### Set it in your deployment configuration

Set the `LoginLink:Issuer` configuration key — as an environment variable in Docker or compose:

```yaml
    environment:
      - LoginLink__Issuer=https://auth.acme.com
```

or as `"LoginLink": { "Issuer": "https://auth.acme.com" }` in `appsettings.json`, or an App Setting on Windows/IIS. Restart LoginLink after changing it.

This is a property of *your deployment* — which domain points at this server — not a preference, which is why configuration is authoritative:

- **If `LoginLink:Issuer` is set, it always wins.** **Admin → Platform Settings → Host & Branding** then shows the issuer read-only, with a note saying it's set by the deployment. Change it at the deployment level and restart.
- **If it isn't set**, LoginLink falls back to the value saved on the Host & Branding page. That fallback exists so older installs keep working after an upgrade; it defaults to `http://localhost:5000` until someone sets it.

### What the issuer drives

One value is used consistently for:

- the `iss` claim in every signed access and ID token,
- the OIDC discovery document at `/.well-known/openid-configuration`,
- the OAuth endpoint URLs shown on each app's **Quickstart** and **Edit** pages in the Console,
- each organization's SCIM base URL, and
- validation of Management API tokens.

Several other places build absolute links from the **`LoginLink:Issuer` configuration key directly**, without the saved fallback — the links in invitation, password-reset and platform-admin emails, the embed-widget snippet, `robots.txt` and the sitemap. If you only ever set the issuer on the Host & Branding page, those still say `http://localhost:5000`. **Always set `LoginLink:Issuer` in configuration on any real deployment.**

### Checking it

Open `https://your-domain/.well-known/openid-configuration` — the `issuer` field must be exactly the URL applications use. Then decode any token from a test sign-in and confirm its `iss` matches. A mismatch shows up as "invalid issuer" errors in client libraries.

## Running behind a reverse proxy

Anything that puts a proxy or load balancer in front of LoginLink — nginx, IIS, Plesk's proxy, a cloud load balancer, Docker's own networking — hides the real client address and protocol from the application. LoginLink relies on the real client IP for rate limiting, sign-in risk scoring, geo restrictions and audit trails, so it must be told which proxies it can trust.

The relevant settings live under `LoginLink:ReverseProxy`:

| Key | Meaning |
|---|---|
| `Enabled` | When `true`, LoginLink reads the standard `X-Forwarded-For` (client IP) and `X-Forwarded-Proto` (http/https) headers — but **only** from the addresses listed below. |
| `TrustedProxies` | A list of proxy IP addresses whose forwarded headers are honored. |
| `TrustedNetworks` | A list of networks in CIDR form (for example `10.0.0.0/8`) whose forwarded headers are honored. |

The shipped defaults have this enabled and trust `172.17.0.1` — the address Docker's default bridge network presents for traffic arriving from the host. That works for a plain `docker run` with the host in front; if your proxy is somewhere else (another container, another machine, a cloud load balancer), **replace the list with your proxy's address or network**. As environment variables:

```yaml
    environment:
      - LoginLink__ReverseProxy__Enabled=true
      - LoginLink__ReverseProxy__TrustedProxies__0=10.0.0.5
      - LoginLink__ReverseProxy__TrustedNetworks__0=10.1.0.0/16
```

Only addresses you list are trusted — a request from anywhere else can't spoof its client IP by adding its own `X-Forwarded-For` header. If you turn `Enabled` off, LoginLink sees only the proxy's address for every visitor.

:::caution Trust only your own proxies
Listing a broad network, or an address that untrusted clients can also reach, lets them forge the client IP that rate limits and risk scoring depend on. List the specific proxy addresses or the smallest network that covers them.
:::

### Checklist behind a proxy

1. Terminate TLS at the proxy (or forward to port `5443`), and make sure it sends `X-Forwarded-For` and `X-Forwarded-Proto`.
2. Set `LoginLink__Issuer` to the public `https://` URL.
3. Set `TrustedProxies` / `TrustedNetworks` to your proxy.
4. Restart, then check `/.well-known/openid-configuration` and, after a test sign-in, the client IP recorded in **Admin → Audit Log**.

For the ports LoginLink listens on and running without Docker, see [Run from a GitHub Release](./binary-releases); for containers, see [Docker Images](./docker-images) and the [docker-compose Quickstart](./docker-compose).
