---
title: LDAP / Active Directory
---

# LDAP / Active Directory

LoginLink can authenticate users directly against an on-premises LDAP or Active Directory server — useful for enterprise tenants that want employees signing in with their existing corporate credentials without standing up a separate SAML/OIDC identity provider.

## How it works

When a tenant enables LDAP sign-in, a dedicated `/console/ldap-login` (or `/ldap-login` for end-user-facing tenants) screen accepts a username and password, which LoginLink forwards as an LDAP bind request to your configured directory server. A successful bind signs the user in; LoginLink never stores the LDAP password itself.

## Configuring an LDAP connection

**Console → Connectors → LDAP** requires:

- **Server host/port** and whether to use LDAPS (TLS).
- **Bind DN template** or a service account for directory search, depending on your directory's structure.
- **Base DN** to search under.
- **Attribute mapping** — which LDAP attributes map to email, display name, and any custom fields you want carried over.

A connection test is available directly on the configuration page before enabling it for real users.

## User provisioning

The first successful LDAP bind for a given directory account creates the corresponding LoginLink user (just-in-time provisioning), matching the same pattern used by social/OAuth connectors. If you'd prefer to provision accounts ahead of time from your directory instead of on first sign-in, see [SCIM Provisioning](../automating-your-tenant/scim-provisioning) — Azure AD/Entra environments in particular often already have a SCIM connector configured for exactly this.
