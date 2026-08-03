# LoginLink

> **Self-hosted OAuth 2.0 + OpenID Connect identity platform for multi-tenant SaaS.**
>
> A ship-yourself alternative to Auth0 / Okta / Clerk that you fully own — every tenant's data
> kept fully separate, no shared database, no vendor lock-in.

📖 **[Documentation](https://websvcin.github.io/loginlink/)** · 🐳 [Docker Hub](https://hub.docker.com/r/websvcin/loginlink) · 📦 [GHCR](https://github.com/websvcin/loginlink/pkgs/container/loginlink) · 🚀 [Releases](https://github.com/websvcin/loginlink/releases)

---

## What you get

- **OAuth 2.0 + OpenID Connect** — Authorization Code + PKCE, Client Credentials, Device Flow, per-tenant signing keys
- **True multi-tenancy** — every tenant's data isolated in its own database (SQLite, Postgres, or MySQL)
- **Passwordless & MFA** — WebAuthn passkeys, magic links, email/SMS OTP, TOTP
- **18 sign-in methods built in** — Google, Microsoft, GitHub, GitLab, Facebook, LinkedIn, Apple, Discord, Slack, Bitbucket, plus SAML, generic OIDC, and LDAP/AD for enterprise
- **SCIM provisioning & a Management API** — automate users, roles, and apps from your own tooling
- **GDPR built in** — data export and right-to-be-forgotten, ready before your first customer asks

See the [full documentation](https://websvcin.github.io/loginlink/) for guides, API references, and SDKs.

## Run it

```bash
docker run -d \
  -p 5000:5000 -p 5443:5443 \
  -v $(pwd)/App_Data:/app/App_Data \
  --name loginlink \
  websvcin/loginlink:latest
```

Then open `http://localhost:5000` and create your first organization.

Prefer not to use Docker? See [Run from a GitHub Release](https://websvcin.github.io/loginlink/self-hosting/binary-releases) instead.

See the [self-hosting guide](https://websvcin.github.io/loginlink/self-hosting/docker-images) for production configuration, reverse proxy setup, and BYO-database options.

## Support

This is a self-hosted product — for questions or issues, reach out to whoever operates your LoginLink deployment.
