---
title: Platform Admin Guide
---

# Platform Admin Guide

This is the map for running a LoginLink instance — the journey from nothing installed to a healthy, policy-configured platform hosting one or more organizations. It links out to the detailed guide for each area, and is explicit about what's covered in depth today versus what exists in the product but isn't fully written up yet, so you're never guessing whether a gap is missing documentation or a missing feature.

## The journey, in order

1. **[Who LoginLink Is For](../getting-started/who-loginlink-is-for)** — confirm this is the right tool before installing.
2. **[How LoginLink Works](../getting-started/how-it-works)** — the actors and data model, so the admin screens make sense once you're in them.
3. **Install it** — [Docker Images](./docker-images), [Docker Compose](./docker-compose), or [Binary Releases](./binary-releases).
4. **[First-Run Setup](./first-run-setup)** — the one-time wizard: platform admin account, control-plane database choice, host/branding.
5. **[Where Your Data Lives](./where-your-data-lives)** and **[Backing Up & Moving Your Deployment](./backup-and-moving)** — know this before you have real organizations depending on the instance, not after.
6. **Decide your signup posture** — **[Signup Security](./signup-security)** (email verification policy) and, if you want to grant specific customers instant database provisioning, **[Database Auto-Provisioning](./database-auto-provisioning)**.
7. **[Creating an Organization](../getting-started/creating-an-organization)** — your first tenant, or hand this step to a customer.
8. **[Issuer & Reverse Proxy](./issuer-and-reverse-proxy)** — get the public-facing URL/TLS story right before real traffic arrives.
9. **Ongoing operation** — **[Upgrades & Deployment Health](./upgrades-and-deployment-health)**, plus the policy areas in the coverage map below.
10. **If you're offering LoginLink as sign-in infrastructure inside your own product** — automate step 7 with the **[Platform API](../api-reference/platform-api)** instead of doing it by hand per customer.

## Platform admin console — full coverage map

The platform admin console (`/admin`) is organized into a few groups. Here is every screen in it today, and whether it has a written guide yet — stated plainly rather than left to discover by clicking around.

### Identity Policy — documented

See [Platform Identity Policy](./platform-identity-policy): the MFA Pairings floor matrix and instance-wide forced method, MFA Recovery's mode floor, Session Settings' four ceilings, and the Device Flow floor.

### Risk & Monitoring — documented

See [Platform Risk & Monitoring](./platform-risk-monitoring): cross-tenant Security Alerts (per-tenant and platform-wide), the raw IP Activity feed, live Blocked Traffic buckets, the Login Risk block-threshold ceiling, and Rate Limit rule management. [Audit Logs](../security-compliance/audit-logs) covers the underlying concept from the organization side; the platform-wide view surfaces the same data across every organization.

### Platform Settings — documented

See [Platform Settings](./platform-settings) for all of: Host & Branding (issuer, token/MFA/session floors, platform Terms & Privacy), the Audit Retention ceiling, platform-tier Notifications, the Migration grace-period floor, broadcast Messages, Webhook Settings/Endpoints floors, Platform API Access, the Act As floor, the per-surface Powered By floor (including the two surfaces — Login pages and the API response header — that have no organization-level override at all), and Platform Admins. [Database Auto-Provisioning](./database-auto-provisioning), [Signup Security](./signup-security), and [Upgrades & Deployment Health](./upgrades-and-deployment-health) remain their own dedicated pages, linked from here rather than folded in.

### Organizations — documented

See [Platform Organizations](./platform-organizations): the organizations list (status filters, soft-delete vs. permanent Purge Now), registering one directly, Configure's platform-only identity-mode switch (None / Subdomain / Custom domain), and the rich per-organization Detail page with its AOB-aware Access on Behalf button — the platform-side counterpart to tenant-side [Act As](../console/delegated-access), covered in full there including its 15-minute-to-8-hour duration range.

**What's still genuinely unverified:** every page above was written from source (the real `.cshtml.cs` page models), not screenshotted — this session never obtained platform-admin credentials for the running instance, only the seeded tenant-admin account used throughout the rest of this documentation effort. Treat this section as accurate-per-source rather than visually confirmed, unlike the Console-side guides, most of which now have a live screenshot alongside the prose.

## Related reading

- [Where Your Data Lives](./where-your-data-lives)
- [BYO-DB / Data Residency](../security-compliance/byo-db-data-residency) — for organizations with their own database requirements
- [GDPR](../security-compliance/gdpr)
- [Tenant/Console Admin Guide](../console/tenant-admin-guide) — the equivalent map for an organization's own admin
