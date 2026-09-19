---
title: Platform Risk & Monitoring
---

# Platform Risk & Monitoring

**Admin → Risk & Monitoring** gives the platform owner a cross-tenant view of security-relevant activity — patterns no single organization's own [Risk Monitoring & Alerts](../console/risk-monitoring-and-alerts) view could see, since it only ever looks at that one organization's data.

## Security Alerts

**Admin → Security Alerts** covers two genuinely different things on one page:

- **Per-tenant alerts** — the same mass-anomaly alerts each organization sees on its own Security Alerts page, surfaced here read-only so you don't have to open every organization's console individually to check. Acknowledging one of these stays a tenant-admin action on their own console; this platform view is for visibility, not action, consistent with tenant-scoped data staying tenant-owned everywhere else in the product. Because these alerts live inside each organization's own database rather than one shared table, this section paginates and searches the *tenant list* first (by slug or ID) and only opens a connection to the organizations on the current page — an intentional tradeoff stated in the UI: this is "alerts for the organizations on this page," not "the most recent N alerts across every organization," since there's no cheap way to get the latter without touching every tenant database on every request.
- **Cross-tenant alerts** — patterns that belong to the platform itself, not any one organization: the same IP address triggering signals across three or more organizations, for example. These live in one shared table and are a genuine platform-admin action to acknowledge, filterable by needs-review / acknowledged / critical.

## IP Activity

**Admin → IP Activity** is the raw feed the cross-tenant alerts above are generated from — every IP address that's triggered a failed-login signal in any organization in the last 24 hours, how many distinct organizations it's hit, how many signals total, and (best-effort) whether it's a known TOR exit node, VPN, or proxy. Read-only, no acknowledge/dismiss workflow, since it's an activity view rather than an alert queue — the point is spotting a pattern developing *before* it's big enough to cross the cross-tenant alert threshold. Pruned automatically after 24 hours by the same background worker that writes to it.

## Blocked Traffic

**Admin → Blocked Traffic** shows the rate limiter's real, in-memory state — every tracked bucket (an IP, a form field value, or whatever the matching rule keys on), sorted by how many requests it's actually blocked, with its current count against the limit. **Reset** clears one bucket immediately, letting a legitimately-blocked user or IP back in without waiting out the window. This is live process state, not persisted history — it resets to empty on every app restart.

## Login Risk Policy (the ceiling)

**Admin → Login Risk Policy** is deliberately minimal: a single **block threshold ceiling** (1–100, defaults to 100 — no ceiling) that bounds how loose any organization can set their own [login risk block threshold](../console/risk-and-anti-abuse#login-risk-scoring). No organization can configure their own threshold above this value, enforced both when they try to save it and again every time the risk scorer actually runs — so lowering the ceiling here takes effect immediately even for an organization that already saved a looser value. The individual signal weights and the other risk tunables are deliberately left as an organization's own decision, with no platform floor — the block threshold ceiling is the one lever that actually matters for "can an organization accidentally turn off blocking entirely."

## Rate Limits

**Admin → Rate Limits** manages the actual rules the limiter enforces — each one a **name**, a **route pattern** and **HTTP method** it applies to, a **key type** (e.g. per-IP, or a specific form field like an email address), a **permit limit** within a **window** (seconds), and an enabled flag. The list page also shows real-time totals — how many requests have been allowed versus blocked since the process started (in-memory, not persisted). Deleting a rule is logged with its name and route pattern for the audit trail, since removing a rate limit is itself a security-relevant policy change.

## Related reading

- [Risk Monitoring & Alerts](../console/risk-monitoring-and-alerts) and [Risk & Anti-Abuse](../console/risk-and-anti-abuse) — the tenant-side equivalents these platform pages sit above.
- [Platform Identity Policy](./platform-identity-policy) — the other major category of platform-set ceilings.
