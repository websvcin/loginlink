---
title: SAML
---

# SAML

LoginLink supports SAML 2.0 as a service provider (SP), letting an enterprise tenant's own identity provider (Okta, OneLogin, Azure AD/Entra, ADFS, PingFederate, or any standards-compliant SAML IdP) authenticate its users directly.

## Endpoints

- **SP-initiated sign-in:** `GET /auth/Saml/start` — redirects the user to your configured IdP's SSO endpoint.
- **Assertion Consumer Service (ACS):** `POST /auth/Saml/acs` — where the IdP posts back the signed SAML assertion after the user authenticates.

## Configuring a SAML connection

**Console → Connectors → SAML** requires the standard SP/IdP metadata exchange:

- Your IdP's **SSO URL** and **signing certificate** (or a metadata URL LoginLink can fetch both from automatically).
- **Attribute mapping** — which SAML assertion attributes map to email, display name, and any custom fields.
- LoginLink's own **SP metadata** (entity ID, ACS URL, signing certificate) to hand to your IdP administrator when setting up the connection on their side.

## User provisioning

Like the social/OAuth connectors, the first successful SAML assertion for a given identity creates the corresponding LoginLink user (just-in-time provisioning). If your organization provisions users ahead of time rather than on first sign-in, pair SAML for authentication with [SCIM Provisioning](../automating-your-tenant/scim-provisioning) for account lifecycle — this is the standard Okta/Azure AD pattern: SAML handles "who is this," SCIM handles "does this account exist and is it still active."
