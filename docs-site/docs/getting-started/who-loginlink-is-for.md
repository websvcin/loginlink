---
title: Who LoginLink Is For
---

# Who LoginLink Is For

LoginLink is a **self-hosted** identity platform: OAuth 2.0 and OpenID Connect sign-in, multi-tenant from the ground up, that you run on your own infrastructure instead of a vendor's cloud. It occupies the same role as Auth0, Okta, or a managed Azure AD B2C/Entra External ID tenant — the difference is who operates it and where your users' data lives.

This page is for someone deciding *whether* to use LoginLink, before installing anything. If you already know you're integrating with an existing LoginLink instance, skip to the [Quickstart](/quickstart) instead.

## Four kinds of people use LoginLink, differently

| Persona | What they do | Where their guide starts |
|---|---|---|
| **Platform Owner / Admin** | Runs the LoginLink instance itself — installs it, decides where its data lives, sets platform-wide policy, watches it stay healthy across upgrades. | [Platform Admin Guide](../self-hosting/platform-admin-guide) |
| **Organization (Tenant) Admin** | Runs *one organization* inside a LoginLink instance someone else operates — invites their team, configures sign-in methods, manages roles and apps for their own users. | [Tenant Admin Guide](../console/tenant-admin-guide) |
| **Developer / Integrator** | Wires an application to LoginLink for sign-in — usually the same person as one of the above on a small team, a separate role on a larger one. | [Quickstart](/quickstart) |
| **End user** | Signs in to an application that uses LoginLink. Never sees LoginLink's own admin surfaces. | — |

A one-person team is often all four at once: install it, create your organization, register your app, and your own customers sign in through it.

## What "self-hosted" actually means here

- **You run the process.** A Docker image, a GitHub Release binary, or built from source — see [Self-Hosting](../self-hosting/first-run-setup). There's no LoginLink-operated cloud service to sign up for.
- **Your data stays on your infrastructure.** Every organization gets its own database — embedded SQLite by default, or MySQL/PostgreSQL you point it at. See [Where Your Data Lives](../self-hosting/where-your-data-lives).
- **You control upgrades.** New versions are pulled and deployed on your schedule; see [Upgrades & Deployment Health](../self-hosting/upgrades-and-deployment-health) for exactly what happens when you do.
- **You're also responsible for what a managed vendor would otherwise handle** — uptime, backups, patching the host OS, and reviewing security advisories for the version you run. Nothing here manages that for you.

## What's actually built in

Rather than a marketing list, here's what exists in the product today, grouped the way you'd evaluate it:

**Sign-in methods** — password (Argon2id hashing), WebAuthn/passkeys, Magic Link (including cross-device), Email and SMS one-time codes, TOTP authenticator apps, 10 social/OAuth providers (Google, Microsoft, GitHub, GitLab, Facebook, LinkedIn, Apple, Bitbucket, Slack, Discord), LDAP/Active Directory, SAML, and generic OIDC federation. See [Authentication Methods](../authentication/password-mfa).

**Multi-tenancy** — every organization's users, apps, sessions and audit trail live in their own database, never mixed with another organization's. An organization can move to MySQL/PostgreSQL for its own compliance reasons without affecting anyone else. See [BYO-DB / Data Residency](../security-compliance/byo-db-data-residency).

**Admin & governance** — a platform-wide console for the instance owner, a separate console per organization, role-based access (tenant-wide and per-app), delegated "Act As" support access with audit trail, and a platform/tenant "Floor and Override" model so the instance owner can cap what an organization is allowed to loosen (session lifetime, token lifetime, and more).

**Provisioning & automation** — SCIM 2.0 for syncing users from an external IdP, a Management REST API for scripting an organization from the outside, and a separate platform-scoped API for creating organizations programmatically (see [Platform API](../api-reference/platform-api)) — the same mechanism a SaaS product would use to spin up a workspace per customer.

**Operational safety** — per-IP/per-form rate limiting, exponential lockout on repeated failed sign-ins, audit logging with configurable retention, GDPR data export and right-to-erasure, and a versioned schema-provisioning ledger so an upgrade's database changes are a recorded fact, not a guess (see [Upgrades & Deployment Health](../self-hosting/upgrades-and-deployment-health)).

## What to check before you commit

Being direct about the trade-offs of self-hosting anything:

- **You are the operations team.** If that's not something you or your organization wants to own, a managed vendor may suit you better.
- **Newer areas are marked as such.** A few capabilities in the product are early or connector-specific (for example, not every trusted-device or role-sync integration is equally mature) — the relevant guide for each feature says so plainly rather than listing it as uniformly "done."
- **Check the repository's license terms** directly before adopting it for a commercial product; this documentation doesn't substitute for reading them yourself.

## Where to go next

- **Deciding, or just curious how it fits together?** Read [How LoginLink Works](./how-it-works) next — the mental model, not the API.
- **Ready to run it?** Start at [First-Run Setup](../self-hosting/first-run-setup).
- **Already have an instance and want to create your organization?** See [Creating an Organization](./creating-an-organization).
- **Wiring up an app against an existing instance?** Jump to the [Quickstart](/quickstart).
