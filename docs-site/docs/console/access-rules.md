---
title: Access Rules
---

# Access Rules

Access rules decide **who may sign in, from where, when, and how**. They are stricter than the risk score: a risk score is a judgement that can step someone up to MFA, while a rule is a fixed policy you set on purpose, and a sign-in that breaks it is refused with a plain explanation.

Rules apply to **every** way of signing in: password, email or SMS code, magic link, passkey, LDAP, SAML and social sign-in.

## Where you manage them

| Where | What you see there |
|---|---|
| **Console → Sign-in Policy → Country Restriction** | The organization's country setting, plus every other rule in one list, and the form to add any kind of rule. |
| **A user → Access rules tab** | Rules for that person, plus (read-only) the rules that reach them through their tag or the organization. |
| **An app → Access** | Rules for everyone signing in to that app. |
| **Console → Relationship Tags** | Rules for everyone carrying a tag. Give a sensitive group (for example "Privileged" or "Finance") a tag, and anyone tagged later gets the rules automatically. |

## Who a rule applies to

- **One person**, optionally limited to one app.
- **Everyone with a tag**, optionally limited to one app.
- **Everyone signing in to an app.**
- **The whole organization.**

## Rule types

| Type | What it does |
|---|---|
| **Country** | Block, or allow, sign-in from chosen countries. Pick from a searchable list. |
| **State / region** | Block, or allow, sign-in from chosen states. Pick a country, then a state from its list, or type one. Lists are built in for India, the US, Canada, Australia, the UK and Germany; other countries work by typing the name. |
| **IP address or range** | Block, or allow only, single addresses or ranges such as `203.0.113.0/24` (IPv4 and IPv6). The most precise rule available, and the right one for "only from our offices". |
| **Allowed hours** | Sign-in is allowed only on chosen days between two times, in a time zone you choose. |
| **Sign-in methods** | Only the chosen methods may be used: password, passkey, email code, SMS code, magic link, LDAP, SAML, social sign-in. |
| **Block VPN / proxy / Tor** | Refuses sign-ins the risk engine identifies as coming through an anonymizer. |
| **Device limit** | At most N devices signed in at once. A further sign-in is refused until one of them ends. Applies to people (a person, a tag or the organization), not to an app. |
| **Session length** | A sign-in may last at most N minutes, hours or days (1 minute to 30 days), counted from the moment the person signed in, however active they are. It also ends sessions that were already running when you add the rule: at their next click the person is sent to sign-in with "Your session ended because of your organization's security policy." Applies to people, not to an app. It ends LoginLink's own session; tokens already issued to your apps keep the lifetimes set on **Token Settings**. |
| **Registered devices only** | Each person may sign in only from a registered device, up to a number you set. See below. |

Every rule can carry a **reason** (shown in the list) and an optional **end date**, after which it lapses by itself.

## Registered devices

With a **Registered devices only** rule, a device is a browser, recognised by a secure cookie. The first time the person signs in, that browser registers itself, so turning the rule on never locks anyone out. Any other browser is refused with "This device isn't registered for your account. Your administrator has been asked to approve it," and appears as **Waiting** on the person's **Access rules** tab, under **Registered devices**, with the browser, system, IP and approximate place. The admin clicks **Approve** or **Deny**. Once approved, the same browser signs in normally. A person cannot register more devices than the number on the rule: to add another, remove one first. A **Deny** keeps that browser out. A device waiting for approval shows as a chip in the person's header.

- It protects against a stolen password (or one-time code) used from a device you have never seen. It does not protect against someone who has the person's actual browser: recognition is by cookie, not hardware. For hardware-bound sign-in, combine a **Sign-in methods** rule with passkeys.
- Clearing cookies, a private window or another browser counts as a new device and needs approval.
- This is separate from "remember this device", which only lets someone skip MFA.
- Recommended for a small group of sensitive accounts (put the rule on a tag such as "Privileged"), not for everyone: approval queues do not scale.

## Order of checks

Rules are checked from the most specific to the most general: the person, then their tag, then the app, then the organization. Within that:

1. Any **block** on country, state or IP wins.
2. Allowed hours, allowed methods, the VPN/Tor block, the device limit, registered devices and IP allow-lists all narrow access. Every one that applies must be satisfied. (A session length is applied separately, on every request, not at sign-in.)
3. **Country and state allow rules** work in two ways. A **person's or tag's** allow is an *exception* that beats the app and organization rules, which is how a travel allowance works ("allow Priya in Germany until October 4"). An **app's or the organization's** allow means *only these places*.

## What the person sees

A blocked sign-in shows a plain message that names the kind of rule ("Sign-in isn't permitted from this network for this account", "This sign-in method isn't allowed for this account"). It never reveals the exact list. Each block is written to the audit log with the rule that caused it, and shows on the user's Activity tab as **Sign-in blocked by an access rule**.

## Good to know

- **Country and state come from the sign-in IP address**, so they can be wrong behind a VPN, and are least reliable for mobile networks. For a hard "only from this place" rule, use an **IP range**. City-level rules are deliberately not offered, because IP-to-city lookups are too unreliable.
- If the location can't be worked out, location rules **fail open** (the sign-in is not blocked) rather than locking out someone because of a lookup gap.
- The **device limit** counts sessions that are currently active for that person.
- Rules are also available through the [Management API](../api-reference/management-api-reference#access-rules--manageaccessrules).

## Related reading

- [Risk & Anti-Abuse](./risk-and-anti-abuse) for the risk score and the organization country setting.
- [Roles & Relationships](./roles-and-relationships) for tags.
- [Managing Users](./user-management) for locking an account.
