---
title: Platform Settings
---

# Platform Settings

**Admin → Platform Settings** groups the instance-wide configuration that doesn't fit under Identity Policy or Risk & Monitoring — host/branding, retention ceilings, platform-level notifications and webhooks, broadcast messages, attribution, and who else has platform-owner access.

## Connectors (the platform kill-switch)

**Admin → Connectors** is the top layer of the [three-layer connector model](../console/apps-and-connectors#the-three-layer-connector-model): a simple enable/disable toggle per installed connector, instance-wide. Disabled here means unavailable to every organization, with no exception — an organization's own approval and an app's own toggle both sit underneath this and can never override it. A built-in safety check blocks disabling the Password connector if no other login method is currently enabled platform-wide, since that would lock every user on the instance out of every organization at once. Connectors with their own platform-level configuration (rather than per-organization credentials) show a direct Configure link; ones with nothing to configure at the platform level state that plainly instead of just omitting the button.

## Host & Branding

**Admin → Platform Settings → Host & Branding** is the single largest settings page in the product, covering several genuinely different concerns that all happen to be "set once at first-run, rarely touched again":

- **Issuer URL** and **platform base domain** — what the JWT `iss` claim says, and the domain subdomain-mode organizations are routed under (see [Issuer & Reverse Proxy](./issuer-and-reverse-proxy)).
- **OAuth code lifetime**, and the **access/refresh token lifetime floors** every organization's own [Token Settings](../console/session-and-token-policy#token-lifetimes) are bounded by.
- **Rate limit loopback exemption** — whether `127.0.0.1` bypasses rate limits (useful for local health checks, off by default in spirit for anywhere that isn't strictly local).
- **MFA auto-send floor** — whether organizations are even allowed to enable [auto-send](../console/mfa-and-recovery#mfa-behavior-tuning), independent of the low-codes-warning floors below.
- **MFA recovery low-codes floors** — the least-permissive banner/interstitial/email warning thresholds every organization's own [low-codes warnings](../console/mfa-and-recovery#3-low-codes-warnings) are bounded by.
- **Max known accounts** — a ceiling related to the identifier-probe/anti-enumeration guard.
- **Platform Terms & Privacy** — a URL and full text for each, plus whether accepting them is required at signup instance-wide.

## Audit Retention (the ceiling)

**Admin → Platform Settings → Audit Retention** sets the floor every organization's own [audit log retention](../security-compliance/audit-logs#retention) is bounded by — a maximum number of days, no organization can configure a longer retention than this — plus two purely operational tunables: how often the cleanup background job runs (hours) and a safety cap on how many rows it deletes per organization per run, to avoid one giant `DELETE` locking a database.

## Notifications (platform tier)

**Admin → Platform Settings → Notifications** is the platform's own version of [Notification Settings](../console/organization-settings#notifications) — same shape, but scoped to notifications that have no organization context at all. Today that's just the platform-admin invitation email; there's no other platform-level notification yet.

## Migration (the ceiling)

**Admin → Platform Settings → Migration** sets the platform-wide *minimum* for the BYO-DB migration rollback grace period (1–90 days) — the shortest any organization's own grace period is allowed to be, paired with the tenant-side setting covered in [Organization Settings](../console/organization-settings#two-settings-that-are-platform-governed-not-tenant-self-service).

## Messages — broadcasting to organizations

**Admin → Platform Settings → Messages** authors announcements shown to organizations or their users:

- **Kind** — a dismissible informational **banner**, or a **blocking** policy-consent announcement a user can't get past without acknowledging.
- **Audience** — tenant admins, end users, or both.
- **Target scope** — every organization on the instance, or a specific list of organization slugs.
- **Severity**, **title**, **body**, whether it **requires consent** (for the blocking kind), whether it's **dismissible**, and an optional **expiry**.

## Webhook Settings & Endpoints (platform tier)

- **Admin → Platform Settings → Webhook Settings** sets the platform-wide floors for [Webhooks Administration](../console/webhooks-administration#tuning-delivery-behavior)'s five values (max retries, backoff schedule and its total window, delivery timeout, max payload size, retention days), plus two platform-only operational tunables: the delivery worker's poll interval and the cleanup job's run interval.
- **Admin → Platform Settings → Webhook Endpoints** is the platform's own equivalent of an organization's webhook subscriptions — for events that have no organization context at all (a platform admin signing in, an organization's lifecycle changing, a platform-level connector being toggled on or off). Organization-scoped events never appear here; they go to that organization's own webhooks only.

## Platform API Access

**Admin → Platform Settings → Platform API Access** manages credentials for the platform-scoped [Platform API](../api-reference/platform-api) (`/api/v1/tenants` — creating organizations programmatically), deliberately mirroring the tenant-side [API Access](../automating-your-tenant/management-api) page's shape and feel, but issuing credentials that can only call platform-level endpoints, never a specific organization's data. The page includes a live "Try it now" tester so you can confirm a freshly created credential actually works without leaving Console.

## Act As (the floor)

**Admin → Platform Settings → Act As** sets the two ceilings every organization's own [Act As settings](../console/delegated-access#turning-it-on) are bounded by: whether the feature exists at all on this instance, and whether the "require the target user's approval" mode is even allowed to exist as an option for an organization to pick.

## "Powered by LoginLink" (the floor)

**Admin → Platform Settings → Powered By** sets the instance-wide default for each attribution surface described in [Organization Settings](../console/organization-settings#powered-by-loginlink-attribution) — and for two of the seven surfaces, this is the *only* place attribution can be controlled at all:

| Surface | Organization can override? |
|---|---|
| Login pages (`/login`, `/console/login`) | No — platform-only; no billing tiers exist yet to gate this by an organization's plan. |
| Email templates | Yes |
| Error pages | Yes |
| OAuth consent screen | Yes (off by default) |
| Account & profile pages | Yes |
| API response header (`X-Powered-By`) | No — platform-only; some integrators reject unrecognized headers, so this stays a single instance-wide decision. |
| Webhook metadata | Yes |

## Platform Admins

**Admin → Platform Admins** manages who else has platform-owner access, via the same invitation-only pattern as an organization's own co-admins: an emailed secure link, the invitee sets their own password, no temporary passwords ever exist. One platform admin is the **root admin** — cannot be suspended by anyone, and no admin (including the root) can suspend their own account. Suspending and restoring are independent, audited actions.

## Related reading

- [Platform Identity Policy](./platform-identity-policy) and [Platform Risk & Monitoring](./platform-risk-monitoring) — the other two categories of platform-set ceilings.
- [Platform Organizations](./platform-organizations) — registering and managing the organizations themselves, and Access on Behalf.
