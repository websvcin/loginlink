---
title: Cross-Surface Sign-In (Tenant Admins in Your Apps)
---

# Cross-Surface Sign-In

LoginLink has separate sign-in surfaces on purpose:

| Surface | Who signs in there |
|---|---|
| `/login` | End users of your product — the OAuth sign-in your apps redirect to |
| `/console/login` | Tenant admins, managing their organization in the Console |
| `/admin/login` | Platform administrators, managing the whole instance |

By default the boundaries are strict. A tenant admin who types their email at `/login` isn't signed in to your app — they're told to use the Console sign-in instead (with their email pre-filled). This keeps a powerful account from being handed to an application by accident.

**Cross-surface sign-in** is a per-app opt-in that lets a tenant admin sign in to a *specific* app through the normal OAuth flow — for example an internal operations tool that only the people who administer the organization should use.

## Turning it on

In **Console → Apps →** *(your app)* **→ Edit**, find **Who can sign in to this app?**:

- **End users** — regular members of your organization. This is how every app behaves by default.
- **Tenant admins** — owners and admins of your organization. **Off by default.** Tick it to let them sign in to this app at `/login`.

Save the app. The change applies to that app only; every other app keeps rejecting tenant admins at `/login`, and every app that existed before you touched this setting behaves exactly as before.

You can also set it from the Management API when updating an app, with `allowEndUserSignIn` and `allowTenantAdminSignIn`. At least one of them must stay `true`, and the Console likewise refuses to save with neither ticked.

## What changes for a tenant admin who signs in

When the app has opted in, a tenant admin signing in to it goes through the same steps as anyone else — identifier, then whichever sign-in methods your tenant allows — and receives tokens for that app.

Their tokens carry a `user_kind` claim set to `tenant_admin` (end users' tokens carry `end_user`). Your application can read it to treat administrators differently, for example to show admin-only screens.

:::caution Broad access — turn it on deliberately
A tenant admin's session isn't limited to your app: the same account can manage everything in the Console. If an admin's session is compromised inside an app you've opted in, that is also a compromise of the Console. Only enable this for apps that are genuinely meant for administrators, and consider requiring MFA for those accounts.
:::

## What never changes

- **Platform administrators can never sign in to a tenant's app**, whatever you configure. Their reach spans every organization, so there is no app-level opt-in for them; they're always sent to `/admin/login`.
- A tenant admin still can't use `/login` to reach the Console. Cross-surface sign-in is about signing in *to an app*; the Console keeps its own sign-in at `/console/login`.
- Signing in bare at `/login` with no app involved (no OAuth request in flight) behaves as it always did: tenant admins are pointed to the Console.

## Troubleshooting

**A tenant admin still sees "sign in at the Console" for my app.** Check that **Tenant admins** is ticked on *that* app, that you saved, and that the sign-in started from that app's OAuth request — opening `/login` directly has no app attached, so it never applies the opt-in.

**I can't save — "Pick at least one kind of account".** Leave at least one of **End users** or **Tenant admins** ticked.
