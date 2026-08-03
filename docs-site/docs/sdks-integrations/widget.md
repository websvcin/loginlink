---
title: Embeddable Widget
---

# Embeddable Widget

A single `<script>` tag you drop into any page — a zero-build static site, a WordPress page, a page-builder landing page — with no npm install and no framework required. It's served directly from your own LoginLink instance, not a shared CDN.

## Inline widget

```html
<div id="loginlink-widget" data-tenant="acme"></div>
<script src="https://auth.acme.com/widget.js"></script>
```

## Button trigger

Mount nothing until a user clicks — good for a "Sign in" button in a nav bar:

```html
<button data-loginlink-trigger data-tenant="acme">Sign in</button>
<script src="https://auth.acme.com/widget.js"></script>
```

## Configuring where sign-in lands

```html
<script>
  LoginLink.configure({ tenant: 'acme', redirectUrl: 'https://acmebudget.com/dashboard' });
</script>
```

`data-tenant` on the element is enough on its own; `LoginLink.configure` is only needed to set a shared default (so you don't repeat `data-tenant` everywhere) or to control the post-sign-in redirect.

## Allow-listing your domain

Before the widget will render on a page, add that page's origin to your tenant's allow-list at **Console → Embed Widget** — this is the same origin check the iframe's `postMessage` handshake verifies against, so an unlisted domain can embed the script but the sign-in frame won't complete.

## Security model

The widget renders sign-in as an **iframe on your own LoginLink origin** — credentials are typed entirely inside that frame, so the host page's own JavaScript never has access to the input fields. This means an unrelated XSS bug on your own site can't read anything a user types into the widget, the same security boundary the [mobile SDKs](./mobile) get from never using an embedded WebView, and the same one the SPA sample gets from using Authorization Code + PKCE with no secret in the browser. Sign-in completion arrives as a `postMessage` from the iframe, checked against the iframe's own origin before being trusted.

## Who this is for

The widget targets a different audience than the [.NET/JS/React samples](./dotnet-js-react) or the [mobile SDKs](./mobile): sites with no build step at all, where installing a package isn't an option.
