---
title: How LoginLink Works
---

# How LoginLink Works

This page explains LoginLink the way you'd explain it to a colleague on a whiteboard — the actors, the layers, and the flow — before you touch any code or admin screen. If you want the API-level vocabulary (users, apps, roles, sessions) instead, see [Core Concepts](./core-concepts).

## Three actors

| Actor | Runs | Analogy |
|---|---|---|
| **Platform Owner** | The LoginLink instance itself — one install, on your infrastructure | The company that would operate Auth0 or Okta, except it's you |
| **Organization (Tenant) Admin** | One organization inside that instance | A customer workspace/team inside a SaaS product |
| **End User** | Nothing — signs in to an application | A customer of the organization |

A single instance can host one organization or thousands. Nothing about the platform assumes a particular number — a solo developer running LoginLink for their own SaaS product is a platform owner *and* the sole tenant admin of their one organization, at the same time. A company offering "sign-in as a service" to its own customers is a platform owner with one tenant per customer, provisioned automatically (see [Platform API](../api-reference/platform-api)).

## The three-layer data model

Every organization's data is isolated from every other organization's — not by a `tenant_id` column in a shared table, but by literally separate databases:

```
bootstrap.db        tells a starting instance where everything else lives
      │
      ▼
control plane       one database: the registry of organizations, platform
      │             admins, platform-wide settings, signing keys
      ▼
tenant databases     one per organization: its users, apps, roles, sessions,
                     audit trail — never visible to another organization
```

This is *why* an organization can choose to keep its own database on its own MySQL/PostgreSQL server (for data-residency or compliance reasons) without the platform owner needing to change anything about how the platform runs — see [BYO-DB / Data Residency](../security-compliance/byo-db-data-residency). Full detail on this model, including what to back up, is in [Where Your Data Lives](../self-hosting/where-your-data-lives).

## What happens when someone signs in

At a conceptual level, ignoring endpoint names and query parameters:

1. **Your application redirects the user to LoginLink** with the OAuth 2.0 Authorization Code flow (PKCE for browser/mobile apps), naming which app (`client_id`) is asking.
2. **LoginLink figures out which organization the user belongs to.** For most integrations this is fixed per app; a few flows resolve it from what the user types (their email's domain, or a tenant-specific sign-in URL).
3. **The user proves who they are**, using whatever sign-in method that organization has enabled — password, a passkey, a magic link, a one-time code, an external identity provider via SAML/OIDC/LDAP, or a second factor on top of any of those. See [Authentication Methods](../authentication/password-mfa).
4. **LoginLink checks platform- and organization-level policy** before issuing anything — is the platform paused, is this organization within its user/rate limits, does this sign-in need to be re-verified under the organization's session rules.
5. **LoginLink redirects back to your application** with an authorization code, which your backend exchanges for an ID token, an access token, and (if requested) a refresh token — standard OIDC, nothing proprietary.
6. **Your application reads the tokens' claims** (who the user is, their roles for this app) and decides what the user can do. LoginLink never tells your app *what a role means* — only which roles a user has.

Every step in this flow, and everyone who touched it, is recorded in that organization's audit trail — see [Audit Logs](../security-compliance/audit-logs).

## The "Floor and Override" policy model

Because one instance can host many organizations with different risk tolerances, most safety-relevant settings work in two layers:

- The **platform owner sets a floor** — the strictest a setting is allowed to be relaxed to, instance-wide (for example, a maximum session lifetime).
- **Each organization can tighten further**, but never loosen past the platform's floor.

This means a platform owner can guarantee a minimum bar across every organization on their instance, while still letting individual organizations be stricter where their own policies demand it. You'll see this pattern named explicitly in places like session and token lifetime settings.

## What LoginLink deliberately does not do

Being precise about the boundary, since it shapes how you integrate:

- It does not store or interpret what a role, permission, or app-specific claim *means* to your business logic — only names and assignments.
- It does not host your application's own data — only identity data (who someone is, how they signed in, what roles they hold).
- It does not manage your infrastructure for you — see [Who LoginLink Is For](./who-loginlink-is-for) for what self-hosting means in practice.

## Where to go next

- **Deciding whether this fits your situation?** Back to [Who LoginLink Is For](./who-loginlink-is-for).
- **Ready to install an instance?** [First-Run Setup](../self-hosting/first-run-setup).
- **Running an instance and want to create your organization?** [Creating an Organization](./creating-an-organization).
- **Already have an organization and integrating an app?** [Quickstart](/quickstart).
- **Want the API-level entities (users, apps, roles) in detail?** [Core Concepts](./core-concepts).
