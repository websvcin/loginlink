---
title: GDPR
---

# GDPR

LoginLink supports the two most common GDPR obligations directly, so you don't need to build them into your own application.

## Data export

A user (or a tenant admin on their behalf) can request a full export of everything LoginLink holds about that account — profile data, identifiers, sessions, connected accounts, and their own audit trail — as a structured file, from **Account → Privacy** or **Console → Users → (select a user) → Export data**.

## Right to be forgotten

A tenant admin can permanently and irreversibly delete a user's account and all associated data from **Console → Users → (select a user) → Delete permanently**. This is distinct from suspending an account (which is reversible and preserves data) — deletion is a hard delete, intended specifically to satisfy a right-to-erasure request.

:::caution Irreversible
Unlike suspending a user, permanent deletion cannot be undone. LoginLink requires explicit confirmation before processing it.
:::

## Data residency

If your compliance requirements go further than export/erasure — for example, a specific customer's data must physically live in its own database, possibly in a specific region — see [BYO-DB / Data Residency](./byo-db-data-residency).
