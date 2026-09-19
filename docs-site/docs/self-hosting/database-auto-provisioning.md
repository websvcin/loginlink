---
title: Database Auto-Provisioning
---

# Database Auto-Provisioning

LoginLink can create a real **MySQL or PostgreSQL database on demand** instead of requiring one to already exist. You give it one hosting environment to work with; it uses that to create a small, dedicated database (and a dedicated database user with a generated password) whenever one is needed:

- for the **control plane** during [first-run setup](./first-run-setup),
- for the **demo organization** at the end of setup, and
- for **organizations that sign up themselves** at `/signup-tenant`, if you allow it.

Nothing is created until someone asks for it, and a database that was created for an attempt that then fails is removed again.

## Configuring the environment

Go to **Admin → Platform Settings → Database Provisioning → Environment** (or configure it inline in step 2 of first-run setup). Only **one** environment is active at a time; saving another makes it the active one.

The page shows whether an environment is active, a summary of what's configured, and which credentials are already saved. Saved passwords and keys are stored encrypted and are **never sent back to the browser** — leave a secret field blank to keep the stored value.

Use **Test & verify** to confirm LoginLink can reach the server and create a database before you save.

### Plesk

| Field | What to enter |
|---|---|
| Plesk panel host or IP | The address you use to log into Plesk — just the domain or IP, no `https://` or port. |
| Subscription (webspace id) | The subscription the databases should belong to. The ID is in your browser's address bar when you open it in Plesk. |
| Port | Optional; the panel's port (Plesk's default is 8443). |
| Sign-in method | **Admin login & password** — the same login you use for Plesk itself, nothing to generate. Or a **secret key** — a narrower, revocable credential; it can only be generated over SSH. |
| Connection host override | Optional, under *Advanced*. Only needed if your application must reach the database at a different host name than the panel. |

### cPanel

| Field | What to enter |
|---|---|
| cPanel host or IP | The address you use to log into cPanel. |
| Port | cPanel's secure control-panel port. `2083` is the default — change it only if your host told you to. |
| cPanel account username | The cPanel account the databases should belong to. |
| API token | A cPanel API token for that account. |
| Connection host override | Optional, under *Advanced*. |

### Standalone server

For a MySQL and/or PostgreSQL server you run yourself. Fill in the MySQL section, the PostgreSQL section, or both — leave a section blank to not offer that engine.

| Field | What to enter |
|---|---|
| MySQL host / port | Where the MySQL server listens (default port 3306). |
| MySQL admin username / password | An account that can **create databases and users** (often `root`). Not the credential your app uses day to day — a separate, limited one is created for every new database. |
| PostgreSQL host / port | Same idea (default port 5432). |
| PostgreSQL admin username / password | An account that can create databases and roles (often `postgres`). |

## What gets created

Every auto-provisioned database follows one naming pattern, so it's obvious on your hosting provider's own dashboard what it belongs to:

| For | Name |
|---|---|
| Control plane | `loginlink_platform_<random>` |
| An organization or demo organization | `loginlink_<organization-url>_<random>` |

The random suffix keeps a retry from colliding with an earlier attempt. Each database gets its own generated user and password, saved encrypted, and used only for that organization.

## Letting organizations use it at signup

Auto-provisioning at `/signup-tenant` is **off by default** and, once on, is **pre-approval only**. On the **Access** tab:

1. Turn on **Allow at self-service /signup-tenant**. While this is off, the option doesn't exist for any visitor.
2. Add the email addresses that are approved in **Allowed emails** — exact addresses only, comma-separated. There are no domain wildcards, on purpose: this option creates real infrastructure on your server.

A visitor whose email is on the list sees **Auto-provision it** on the database step; anyone else sees it greyed out with a note to contact the platform administrator. Adding someone to the list *before* they sign up is the whole workflow — there is no request queue.

:::caution Verify email ownership if you use the allowlist
Approval is matched against the email exactly as typed. Unless you also turn on **email verification** in [Signup Security](./signup-security), nothing proves the person typing an approved address actually owns it. If you use the allowlist on a public signup page, enabling verification is what closes that gap.
:::

## Good to know

- Auto-provisioning creates databases on your hosting environment, with your hosting account's limits and billing — review what a new database costs there before opening it to visitors.
- If the environment is unreachable or misconfigured, signup fails with a clear message and nothing is left behind; the visitor can retry or choose another database option.
- Auto-provisioned databases are ordinary MySQL/PostgreSQL databases. See [Bring Your Own Database](../security-compliance/byo-db-data-residency) for how organizations relate to their database, and [Backup and Moving](./backup-and-moving) for backing up what LoginLink stores.

## Troubleshooting

**Test & verify fails.** The message says which step failed. Common causes: the panel host is wrong or unreachable *from the LoginLink server*, the port is blocked, the credentials lack permission to create databases and users, or (Plesk) the subscription ID doesn't exist. Fix the field and test again — nothing is saved until you press **Save settings**.

**An approved visitor sees "Auto-provision it" greyed out.**
1. **Allow at self-service /signup-tenant** must be on (Access tab).
2. Their email must be in **Allowed emails** *exactly* — same address, comma-separated; domain patterns aren't supported. Capitalization is ignored.
3. An environment must be saved and active (Environment tab shows "is your active hosting environment").
4. If they had the signup page open while you changed these, they should reload it.

**Signup fails while creating the database.** The visitor sees the reason from your hosting environment (for example a quota or permission limit) and can retry or pick another option. Nothing is left half-created.

**I can't find the database on my hosting panel.** Look for the `loginlink_…` prefix (see *What gets created*). Databases from an attempt that failed are removed again.
