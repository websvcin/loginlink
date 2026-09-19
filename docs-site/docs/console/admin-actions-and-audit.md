---
title: Investigating an Admin's Actions
---

# Investigating an Admin's Actions

When you need to answer "what did this specific tenant admin actually do" — a security review, an offboarding, or a report from another admin — **Admin Actions** on that person's own User Detail page is the fastest way in. This page covers what it shows, what it deliberately leaves out, and where to look for the rest.

## Where to find it

Open **Console → Users**, select the admin in question, go to their **Activity** tab, and switch the toggle at the top from **Account Activity** to **Admin Actions**. Each entry shows what happened, when, and who or what it was done to.

This view only appears for accounts that are themselves tenant admins — it has nothing to show for a regular end user.

## What's included

Everything shown here is attributed to the acting admin with confidence — LoginLink recorded *this specific person* did it, not just that it happened:

- **Granting or revoking Tenant Admin**, and admin invitations.
- The full **"Act As" family** — a request made, approved or denied, a session started or ended, and the individual actions taken while acting as another user.

## What's not included yet

Some admin actions are recorded in the audit log, but not yet with a reliable link to *which* admin did them, so they're deliberately left out here rather than risk showing the wrong name:

- Actions on a user's own record made by an admin — profile edits, data exports, GDPR erasure, a forced session revocation.
- Tenant-wide configuration changes — roles, apps, webhooks, connectors, and most settings pages.

These aren't hidden entirely: they exist in the full audit log with what happened and when, just not filtered into this per-admin view yet.

## Getting the full picture

For anything Admin Actions doesn't cover, or for an unfiltered record across your whole organization — filterable by date, action type and actor, with CSV export — use **Console → Audit**. See [Audit Logs](../security-compliance/audit-logs).
