---
title: Embeddable Widget
---

# Embeddable Widget

:::caution Design-locked, not yet built
The embeddable `widget.js` is **designed but not yet implemented.** This page describes the planned shape; the script isn't published yet.
:::

## Planned shape

A single `<script>` tag you drop into any page — a zero-build static site, a WordPress page, a page-builder landing page — with no npm install and no framework required:

```html
<script src="https://cdn.loginlink.io/widget.js" data-client-id="your_client_id"></script>
<div id="loginlink-widget"></div>
```

The widget renders sign-in as an **iframe on LoginLink's own origin** — credentials are typed entirely inside that frame, so the host page's own JavaScript never has access to the input fields. This means an unrelated XSS bug on your own site can't read anything a user types into the widget, the same security boundary the [mobile SDKs](./mobile) get from never using an embedded WebView, and the same one the SPA sample gets from using Authorization Code + PKCE with no secret in the browser.

## Who this is for

The widget targets a different audience than the [.NET/JS/React samples](./dotnet-js-react) or the future mobile/branded SDKs: sites with no build step at all, where installing a package isn't an option.
