---
title: Platform Organizations
---

# Platform Organizations

**Admin → Organizations** is the platform owner's own view of every organization on the instance — separate from the [signup path](../getting-started/creating-an-organization) an organization's own first admin goes through, and from that organization's later self-service in [Organization Settings](../console/organization-settings).

## The organizations list

**Admin → Organizations** filters by status — **active**, **suspended**, or **deleted** — with counts for each. Deleting an organization here is a soft-delete (`status = 'deleted'`): its database file and audit trail are preserved, not destroyed. A separate, explicit **Purge Now** action performs real, permanent deletion — gated behind typing the organization's own slug to confirm, since it can't be undone.

## Registering an organization directly

**Admin → Organizations → Register** lets a platform admin create an organization on someone's behalf, bypassing the public signup wizard entirely — validating slug uniqueness, provisioning its database, and seeding its initial branding, the same underlying steps signup performs, just triggered by the platform admin instead of the organization's own first admin. (Automating this from outside Console entirely is what the [Platform API](../api-reference/platform-api) is for.)

## Configuring an organization

**Admin → Organizations → (select one) → Configure** edits an organization's registry identity and branding — its slug, name, and brand colors/logo. The one field here that an organization's own admin can never touch themselves is **identity mode**, platform-admin-set only:

| Mode | Effect |
|---|---|
| **None** (default) | Path-based routing only (`/your-org/login`) — what [Domain Settings](../console/organization-settings#domain-settings) shows a tenant admin by default. |
| **Subdomain** | The organization gets its own subdomain under the platform's base domain. |
| **Custom domain** | The organization can bring its own domain, verified via DNS TXT record and its own uploaded TLS certificate — see [Domain Settings](../console/organization-settings#domain-settings) for the tenant-side half of this flow, which only appears once you've set this mode here. |

## Organization detail & Access on Behalf

**Admin → Organizations → (select one) → Detail** is a rich, Auth0-style dashboard of at-a-glance metrics and health signals for one organization — deliberately showing **no user PII** (no email addresses) on this page itself; actually seeing that organization's real data requires starting an Access on Behalf session.

**Access on Behalf ("AOB")** is the platform-side counterpart to the tenant-side [Act As](../console/delegated-access) feature — a platform admin acting on an organization's own behalf, rather than a tenant admin acting as one of their end users:

- Starting a session requires a **reason** (at least 10 characters) and a **duration** (15 minutes to 8 hours — a much wider range than tenant-side Act As's 5–60 minutes, reflecting that platform-admin support work on an organization's behalf is often a longer task than impersonating one end user).
- An option to **notify the organization's own admin** that an AOB session has started on their behalf.
- The detail page's own buttons are AOB-state-aware — if you already have an active AOB session on a *different* organization, it offers to switch rather than silently stacking sessions.
- Ending a session works the same way as tenant-side Act As, via `Pages/Aob/End.cshtml`.

Two organization settings are deliberately gated behind an active AOB session rather than being tenant self-service at all — see [Organization Settings](../console/organization-settings#two-settings-that-are-platform-governed-not-tenant-self-service) for **Migration Settings** and **Data Export**.

## Related reading

- [Creating an Organization](../getting-started/creating-an-organization) — the public signup path this page's Register action bypasses.
- [Delegated Access ("Act As")](../console/delegated-access) — the tenant-side equivalent of Access on Behalf.
- [Platform Admins](./platform-settings#platform-admins) — who is allowed to do any of this.
