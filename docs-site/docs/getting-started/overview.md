---
title: Overview
---

# Overview

LoginLink is a multi-tenant identity and authentication platform. You point your application at LoginLink, and it handles sign-up, sign-in, multi-factor authentication, session management, and account administration — so your own codebase never has to store a password or verify a TOTP code.

## The core model

Every account on LoginLink is scoped to a **tenant** — your organization's isolated space. Within a tenant:

- **Users** are the people who sign in — your customers, employees, or both.
- **Apps** are the OAuth 2.0 / OIDC clients you register — typically one per application or environment (e.g. a web app and a mobile app might be two separate apps, or share one, depending on how you want tokens scoped).
- **Roles** are named permissions you define (e.g. `admin`, `editor`, `viewer`) and assign to users. LoginLink stores role names and assignments; your application decides what each role is allowed to do.

A tenant's data — its users, its apps, its roles, its audit trail — is fully isolated from every other tenant's. See [Core Concepts](./core-concepts) for the full picture, including how identifiers, sessions, and multi-tenant membership work.

## How authentication works

LoginLink is an OAuth 2.0 / OpenID Connect provider. Your application redirects a user to LoginLink's `/authorize` endpoint; LoginLink handles the actual sign-in (whichever methods you've enabled — password, passkey, magic link, social login, enterprise SSO); and your application receives an authorization code it exchanges for tokens. If you've used Auth0, Okta, or Azure AD B2C before, the flow will feel familiar.

See the [Quickstart](/quickstart) for the exact request/response shapes, or jump straight to [Authentication Methods](../authentication/password-mfa) to see what's available and how to turn each one on.

## Beyond sign-in

Once users exist in your tenant, LoginLink gives you a few ways to manage them without hand-rolling admin UI:

- **[SCIM Provisioning](../automating-your-tenant/scim-provisioning)** — let your own identity provider (Okta, Azure AD/Entra) create, update, and deactivate users automatically.
- **[Management API](../automating-your-tenant/management-api)** — a REST API for scripting user/role/app management yourself (an HR sync job, an internal tool, test automation).
- **[Webhooks](../webhooks/overview)** — get notified in real time when a user signs up, a role changes, or a session is revoked.
- **[Audit logs](../security-compliance/audit-logs)** — every security-relevant action in your tenant, queryable and exportable.

## Where to go next

- New to LoginLink? Start with the **[Quickstart](/quickstart)** — a working sign-in flow in about 10 minutes.
- Rolling out for an existing user base? See **[Authentication Methods](../authentication/password-mfa)** to plan which sign-in methods to enable.
- Need users provisioned from Okta/Azure AD instead of self-signup? See **[SCIM Provisioning](../automating-your-tenant/scim-provisioning)**.
