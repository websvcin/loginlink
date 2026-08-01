// LOCK-71 — snippet content for the public, personalized Quickstart page.
// Each `code` field is a function of the current values (placeholder or, once
// personalized via query params, the visitor's real tenant/client ID) so
// personalization is a normal React re-render, not DOM text-node surgery.

export const PLACEHOLDER = {
  tenant: 'yourtenant',
  clientId: 'your_client_id',
  issuer: 'https://auth.yourtenant.com',
  redirectUri: 'https://yourapp.com/callback',
};

// A handful of standard languages/frameworks have both a branded-SDK path and
// a raw-standard-library path; the rest only have the raw path today (LOCK-71
// keeps that honestly labeled rather than pretending an SDK exists).
export const LANGUAGES = [
  {
    id: 'react',
    label: 'React',
    sdk: {
      install: 'npm install @loginlink/react',
      code: (v) => `import { LoginLinkProvider, SignInButton } from '@loginlink/react';

<LoginLinkProvider
  issuer="${v.issuer}"
  clientId="${v.clientId}"
  redirectUri="${v.redirectUri}"
>
  <App />
</LoginLinkProvider>

<SignInButton />`,
      note: 'Fewer lines, prebuilt <SignInButton/>, automatic token refresh handled internally.',
    },
    raw: {
      install: 'npm install react-oidc-context',
      code: (v) => `import { AuthProvider } from 'react-oidc-context';

const oidcConfig = {
  authority: '${v.issuer}',
  client_id: '${v.clientId}',
  redirect_uri: '${v.redirectUri}',
  scope: 'openid profile email',
};

<AuthProvider {...oidcConfig}><App /></AuthProvider>`,
      note: 'No LoginLink package at all — just the community-standard OIDC library. Full control, no vendor wrapper.',
    },
  },
  {
    id: 'node',
    label: 'Node',
    sdk: {
      install: 'npm install @loginlink/node',
      code: (v) => `const { loginlink } = require('@loginlink/node');

loginlink(app, {
  issuer: '${v.issuer}',
  clientId: '${v.clientId}',
  clientSecret: process.env.LOGINLINK_SECRET,
  redirectUri: '${v.redirectUri}',
});
// adds /login, /callback, /logout automatically`,
    },
    raw: {
      install: 'npm install openid-client',
      code: (v) => `const { Issuer } = require('openid-client');

const issuer = await Issuer.discover('${v.issuer}');
const client = new issuer.Client({
  client_id: '${v.clientId}',
  redirect_uris: ['${v.redirectUri}'],
});`,
    },
  },
  {
    id: 'dotnet',
    label: '.NET',
    sdk: {
      install: 'dotnet add package LoginLink.AspNetCore',
      code: (v) => `builder.Services.AddLoginLink(options =>
{
    options.Issuer = "${v.issuer}";
    options.ClientId = "${v.clientId}";
    options.ClientSecret = "your_client_secret";
});`,
    },
    raw: {
      install: 'dotnet add package Microsoft.AspNetCore.Authentication.OpenIdConnect',
      code: (v) => `builder.Services.AddAuthentication().AddOpenIdConnect("oidc", options =>
{
    options.Authority = "${v.issuer}";
    options.ClientId = "${v.clientId}";
});`,
    },
  },
  {
    id: 'python',
    label: 'Python',
    noSdkNote: 'No branded SDK yet for Python — the standard library covers it fully today.',
    raw: {
      install: 'pip install Authlib',
      code: (v) => `oauth.register(
    name='loginlink',
    server_metadata_url='${v.issuer}/.well-known/openid-configuration',
    client_id='${v.clientId}',
    client_kwargs={'scope': 'openid profile email'},
)`,
    },
  },
  {
    id: 'java',
    label: 'Java',
    noSdkNote: 'No branded SDK yet for Java/Kotlin — Spring Security auto-configures from the issuer URL.',
    raw: {
      install: '# application.yml',
      code: (v) => `spring:
  security:
    oauth2:
      client:
        provider:
          loginlink:
            issuer-uri: ${v.issuer}`,
    },
  },
  {
    id: 'go',
    label: 'Go',
    noSdkNote: 'No branded SDK yet for Go — coreos/go-oidc covers it directly.',
    raw: {
      install: 'go get github.com/coreos/go-oidc/v3/oidc',
      code: (v) => `provider, _ := oidc.NewProvider(ctx, "${v.issuer}")`,
    },
  },
  {
    id: 'php',
    label: 'PHP',
    noSdkNote: "No branded SDK yet for PHP — league/oauth2-client's generic provider covers it.",
    raw: {
      install: 'composer require league/oauth2-client',
      code: (v) => `$provider = new GenericProvider([
    'clientId' => '${v.clientId}',
    'urlAuthorize' => '${v.issuer}/authorize',
]);`,
    },
  },
  {
    id: 'ruby',
    label: 'Ruby',
    noSdkNote: 'No branded SDK yet for Ruby — omniauth-openid-connect is the standard Rails/Sinatra strategy.',
    raw: {
      install: "gem 'omniauth-openid-connect'",
      code: (v) => `Rails.application.config.middleware.use OmniAuth::Builder do
  provider :openid_connect, issuer: '${v.issuer}',
    client_options: { identifier: '${v.clientId}' }
end`,
    },
  },
];

export const MOBILE_PLATFORMS = [
  {
    id: 'iosSwift',
    label: 'iOS — Swift',
    sdk: {
      install: '// Package.swift — Swift Package Manager\n.package(url: "https://github.com/loginlink/loginlink-ios", from: "1.0.0")',
      code: (v) => `import LoginLinkAuth

LoginLink.configure(issuer: "${v.issuer}", clientId: "${v.clientId}")

LoginLink.signIn(from: self) { result in
    switch result {
    case .success(let user): print(user.email)
    case .failure(let error): print(error)
    }
}`,
      note: 'Tokens stored in the Keychain automatically — no manual secure-storage code to write.',
    },
    raw: {
      install: "pod 'AppAuth'",
      code: (v) => `let issuer = URL(string: "${v.issuer}")!
OIDAuthorizationService.discoverConfiguration(forIssuer: issuer) { config, error in
    let request = OIDAuthorizationRequest(
        configuration: config!,
        clientId: "${v.clientId}",
        scopes: ["openid", "profile", "email"],
        redirectURL: URL(string: "com.yourapp:/callback")!,
        responseType: OIDResponseTypeCode,
        additionalParameters: nil)
}`,
      note: 'You own token storage and refresh — recommended: Keychain, never UserDefaults.',
    },
  },
  {
    id: 'androidKotlin',
    label: 'Android — Kotlin',
    sdk: {
      install: '// build.gradle.kts — Maven Central\nimplementation("io.loginlink:auth:1.0.0")',
      code: (v) => `LoginLink.configure(issuer = "${v.issuer}", clientId = "${v.clientId}")

LoginLink.signIn(activity = this) { result ->
    result.onSuccess { user -> println(user.email) }
}`,
      note: 'Tokens stored via the Android Keystore automatically — no manual EncryptedSharedPreferences setup.',
    },
    raw: {
      install: 'implementation("net.openid:appauth:0.11.1")',
      code: (v) => `AuthorizationServiceConfiguration.fetchFromIssuer(
    Uri.parse("${v.issuer}")
) { config, ex ->
    val request = AuthorizationRequest.Builder(
        config!!, "${v.clientId}",
        ResponseTypeValues.CODE, Uri.parse("com.yourapp:/callback")
    ).setScopes("openid", "profile", "email").build()
    startActivityForResult(authService.getAuthorizationRequestIntent(request), RC_AUTH)
}`,
      note: 'You own token storage — recommended: Android Keystore-backed encryption, never plain SharedPreferences.',
    },
  },
];
