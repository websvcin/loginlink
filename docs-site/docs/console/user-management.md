---
title: Managing Users
---

# Managing Users

**Console → Users** lists everyone in your organization. Search and paging apply once you have more than a page of results, so the list stays fast at any size.

## Finding someone

- **Search** matches name and identifier (email, mobile, username, etc.).
- Filter by **status** and, if you use them, **tags**.
- Results are paged 24 at a time; the same search and filters carry across pages and across any action you take from the list.

The same search-and-page pattern is used on **Apps**, **Roles**, and **Tenant Admins** — each lists 24 at a time with a search box.

## The User Detail page

Selecting a user opens one page with several tabs, all scoped to that user:

| Tab | What's there |
|---|---|
| **Overview** | Profile fields, identifiers, and edit access. |
| **Roles & Access** | Tenant-wide and per-app role grants for this user. |
| **Sessions & Devices** | Active sessions, trusted devices, and the ability to revoke either. |
| **Security & MFA** | Enrolled MFA methods, recovery codes, and risk signals for this user. |
| **Connected Apps** | Which of your OAuth apps this user has authorized, and the ability to revoke access. |
| **Activity** | A timeline of what happened on this account — see below. |

Every tab shares the same header (name, status, quick actions), so switching tabs never loses context on who you're looking at.

## The Activity tab

The Activity tab has two views, switched with a toggle at the top:

- **Account Activity** — everything that happened *to* this account: sign-ins, profile changes, MFA changes, role grants, session revocations, and so on — regardless of whether the user did it themselves or an admin did it for them.
- **Admin Actions** — administrative actions taken *on* this account by a tenant admin, when the account itself is a tenant admin. See below for exactly what this includes.

Each entry shows what happened, when, and — where it's recorded — who did it and from where.

Admin Actions only appears for accounts that are themselves tenant admins, and only covers a specific set of actions with confirmed attribution — see [Investigating an Admin's Actions](./admin-actions-and-audit) for exactly what's included and why. For a full, unfiltered record of everything your organization has done, see [Audit Logs](../security-compliance/audit-logs).
