---
title: Tenant Admin Guide
---

# Tenant Admin Guide

This is the map for running your organization's own space in LoginLink — Console (`/console`), the admin surface a tenant admin sees after signing in. It's the equivalent of the [Platform Admin Guide](../self-hosting/platform-admin-guide), scoped to one organization instead of the whole instance.

Console has roughly 80 individual screens. Most areas now have a full written guide; this page names every one plainly — including what's still genuinely undocumented — so a gap in the docs never reads as a gap in the product.

## Getting started as a tenant admin

1. Your organization already exists — either you [created it](../getting-started/creating-an-organization) yourself, or a platform admin/another admin invited you.
2. Sign in at **Console → Login** — identifier-first: type your email/phone/username, then choose how to continue from whichever methods your organization has enabled for admins (password, an emailed code, a sign-in link).

   ![The Console sign-in page's identifier step, with a "Sign up" link for a new organization and separate links to end-user and platform-admin sign-in](/img/screenshots/console-login-identifier.png)

   ![The method-choice step after entering an identifier, showing password and two passwordless options](/img/screenshots/console-login-methods.png)

   If your organization uses LDAP or an external identity provider for admin sign-in, that's configured under Authentication (see below).
3. Once signed in, the tenant dashboard shows a **Getting started** checklist (register your first app, invite a co-admin, add a logo, add more sign-in options) alongside at-a-glance counts for apps, users, sign-ins and audit events.

   ![The Console dashboard for a newly created organization, showing the Getting Started checklist and quick-action tiles](/img/screenshots/console-dashboard.png)

4. **[User Management](./user-management)** is the natural first stop — inviting your team, understanding identifiers, and the consolidated User Detail page.
5. **[Investigating an Admin's Actions](./admin-actions-and-audit)** — once you have more than one admin, know how to review what they did.
6. Register your first app (Console → Apps) and connect it using the [Quickstart](/quickstart) or [Management API](../automating-your-tenant/management-api) — or follow the [Your First App walkthrough](./walkthrough-first-app) for a click-by-click version of exactly this step.
7. Bring in a second admin? See the [Inviting a Co-Admin walkthrough](./walkthrough-invite-co-admin).

## Full coverage map, by area

### Users & Access — documented

| Area | Guide |
|---|---|
| Users, invitations, roles, sessions, suspension, activity | [User Management](./user-management) |
| Reviewing what an admin did | [Investigating an Admin's Actions](./admin-actions-and-audit) |
| Bulk/automated user sync from an external IdP | [SCIM Provisioning](../automating-your-tenant/scim-provisioning) |
| Scripted user/role/app management | [Management API](../automating-your-tenant/management-api) |

### Apps & Connectors — documented

| Area | Guide |
|---|---|
| Apps (register, edit, access, roles, sign-up settings), the three-layer connector model, per-app MFA pairing, machine-to-machine | [Apps & Connectors](./apps-and-connectors) |
| Connected Apps, Providers (tenant-wide read-only view) | [Apps & Connectors](./apps-and-connectors#tenant-wide-views) |
| Embeddable sign-in widget, including its Console allow-list screen | [Embeddable Widget](../sdks-integrations/widget) |
| *Which* sign-in methods exist and how each works | [Authentication Methods](../authentication/password-mfa) and its sibling pages |

### Roles & Relationships — documented

See [Roles & Relationships](./roles-and-relationships): tenant-wide roles and their Members view, Role Sync (Generic REST / CSV import), and Relationship Tags (the self-service data-export/account-deletion policy toggles applied to whoever holds a tag).

### Onboarding & Membership — documented

See [Onboarding & Membership](./onboarding-and-membership): the three onboarding modes, reviewing join requests, and managing direct invitations.

### Identity & Session Policy — documented, split by concern

| Area | Guide |
|---|---|
| MFA behavior, pairings, recovery mode, exhaustion policy, low-codes warnings, reset request review | [MFA & Recovery](./mfa-and-recovery) |
| Session duration, Remember Me, trusted devices, token lifetimes, device authorization grant | [Session & Token Policy](./session-and-token-policy) |
| Login risk scoring, account lookup (anti-enumeration) limits, geo-restriction | [Risk & Anti-Abuse](./risk-and-anti-abuse) |
| Identifier types, custom profile/organization fields | [Identifiers & Custom Fields](./identifiers-and-custom-fields) |
| WebAuthn/passkey behavior, device flow, magic-link cross-device | [Advanced Sign-in Options](./advanced-signin-options) |

### Delegated Access ("Act As") — documented

See [Delegated Access ("Act As")](./delegated-access): turning it on, the optional target-approval flow, starting and ending a session, and what gets recorded.

### Risk & Security Monitoring — documented

See [Risk Monitoring & Alerts](./risk-monitoring-and-alerts): the Security Alerts review queue, the tenant-wide Risk Monitoring dashboard and per-user drill-down, MFA recovery anomaly tuning, and credential health (password age, breach-check).

### Webhooks — documented

[Webhooks Overview](../webhooks/overview) covers the concept, signature verification, and full event catalog; [Webhooks Administration](./webhooks-administration) covers the Console screens — managing endpoints, tuning retry/backoff/timeout/payload/retention, and reading the delivery log.

### Organization Settings — documented

See [Organization Settings](./organization-settings): branding, Tenant Info, custom domains, notifications, "Powered by" attribution, signing keys, co-admin management, standalone service accounts, and BYO-DB configuration — plus the two settings (Migration grace period, whole-tenant Data Export) that are deliberately platform-governed rather than tenant self-service.

### Click-by-click walkthroughs — started

Two exist so far, covering the two most common early tasks: [Your First App](./walkthrough-first-app) and [Inviting a Co-Admin](./walkthrough-invite-co-admin). Every other guide on this page is reference documentation with an illustrative screenshot, not a step-by-step "click this, then this happens" narrative — these two are a starting pattern for that format, not full coverage of it.

### What's still genuinely undocumented

- **The sign-in surfaces themselves** (`/console/login` and its LDAP/password variants) — these are end-user-facing flows, not admin configuration; how each sign-in *method* works is covered under [Authentication Methods](../authentication/password-mfa) rather than as a Console screen walkthrough.
- **Further click-by-click walkthroughs** — beyond the two above, the highest-traffic remaining candidates are reviewing a join request, setting up SSO for the first time, and configuring MFA policy end to end.

**Why this list exists:** rather than leave a gap silent and undiscoverable, this map names it plainly. These are the leading candidates for the next documentation pass.

## Related reading

- [Platform Admin Guide](../self-hosting/platform-admin-guide) — the equivalent map one layer up, for whoever runs the LoginLink instance itself.
- [How LoginLink Works](../getting-started/how-it-works) — the actors and policy model referenced throughout this page.
