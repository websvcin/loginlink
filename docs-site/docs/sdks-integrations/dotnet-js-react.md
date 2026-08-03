---
title: .NET / JS / React
---

# .NET / JS / React

LoginLink doesn't (yet) publish branded SDK packages for .NET, JavaScript, or React — see [Mobile SDKs](./mobile) for that story on iOS/Android, or the [Embeddable Widget](./widget) if you want a zero-code drop-in instead. Today, integrating from .NET, JavaScript, or React means using each ecosystem's own standard, widely-trusted OIDC library pointed at your tenant — no LoginLink-specific package to install or trust.

Real, runnable sample projects for each are in the main repository under [`/samples`](https://github.com/websvcin/loginlink/tree/main/samples), alongside samples for Python, Java, Go, PHP, Ruby, and iOS/Android.

## .NET

Sample: `samples/dotnet-raw` — an ASP.NET Core app using `Microsoft.AspNetCore.Authentication.OpenIdConnect`, Microsoft's own first-party OIDC handler:

```csharp
builder.Services.AddAuthentication(options =>
    {
        options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
    })
    .AddCookie()
    .AddOpenIdConnect(options =>
    {
        options.Authority = "https://auth.yourtenant.com";
        options.ClientId = "your_client_id";
        options.ClientSecret = "your_client_secret";
        options.ResponseType = "code";
        options.SaveTokens = true;
    });
```

## Node.js

Sample: `samples/node-raw` — an Express app using [`openid-client`](https://www.npmjs.com/package/openid-client), the most widely used certified OIDC client for Node:

```js
const { Issuer } = require('openid-client');

const issuer = await Issuer.discover('https://auth.yourtenant.com');
const client = new issuer.Client({
  client_id: 'your_client_id',
  client_secret: 'your_client_secret',
  redirect_uris: ['https://yourapp.com/callback'],
  response_types: ['code'],
});
```

## React

Sample: `samples/react-raw` — a single-page app using [`react-oidc-context`](https://www.npmjs.com/package/react-oidc-context), built on the well-established `oidc-client-ts`:

```jsx
import { AuthProvider } from 'react-oidc-context';

const oidcConfig = {
  authority: 'https://auth.yourtenant.com',
  client_id: 'your_client_id',
  redirect_uri: 'https://yourapp.com/callback',
};

function App() {
  return (
    <AuthProvider {...oidcConfig}>
      <YourApp />
    </AuthProvider>
  );
}
```

Since a React SPA is a public client, register it in Console without a client secret and use Authorization Code + PKCE — `react-oidc-context`/`oidc-client-ts` handle PKCE automatically.

## Other languages

The same `/samples` directory also has real, runnable examples for **Python** (Authlib), **Java** (Spring Security OAuth2), **Go**, **PHP**, and **Ruby**, plus native **iOS** and **Android** samples using AppAuth — every one of them a standard, independently-published library pointed at your tenant's discovery document, not a LoginLink-specific dependency.
