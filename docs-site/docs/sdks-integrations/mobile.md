---
title: Mobile SDKs
---

# Mobile SDKs

:::caution Written, not published
`LoginLinkAuth` (iOS) and `io.loginlink:auth` (Android) have real source at [`sdks/loginlink-ios`](https://github.com/websvcin/loginlink/tree/main/sdks/loginlink-ios) and [`sdks/loginlink-android`](https://github.com/websvcin/loginlink/tree/main/sdks/loginlink-android) in the main repository — written against each platform's real AppAuth API, but not compiled (this project's build environment has no Xcode or Android/JVM toolchain) and not yet published to Swift Package Manager / Maven Central. Installing either package today will fail.
:::

Both wrap [AppAuth](https://appauth.io/) — the same underlying library the [`/samples`](./dotnet-js-react) mobile examples (`samples/mobile-ios-raw`, `samples/mobile-android-raw`) already use directly. Each SDK adds one concrete win over raw AppAuth: **automatic secure token storage** (Keychain on iOS, Android Keystore-backed `EncryptedSharedPreferences` on Android) — with raw AppAuth, secure storage is left entirely to your app, a common footgun if skipped or implemented incorrectly. Both also fetch `/userinfo` for you, handing back a ready-to-use user profile instead of just raw tokens.

## iOS — Swift

```swift
import LoginLinkAuth

LoginLink.configure(issuer: "https://auth.yourtenant.com", clientId: "your_client_id", redirectUri: "https://yourapp.com/ios/callback")

LoginLink.signIn(from: self) { result in
    switch result {
    case .success(let user): print(user.email ?? user.sub)
    case .failure(let error): print(error)
    }
}
```

## Android — Kotlin

```kotlin
LoginLink.configure(context = this, issuer = "https://auth.yourtenant.com", clientId = "your_client_id", redirectUri = "https://yourapp.com/android/callback")

LoginLink.signIn(activity = this) { result ->
    result.onSuccess { user -> println(user.email ?: user.sub) }
}
```

## Production redirect URI

Both platforms document **Universal Links (iOS)** / **App Links (Android)** as the production-recommended redirect URI, rather than a custom URL scheme (`com.yourapp:/callback`) — a custom scheme can be claimed by another app on the same device, letting it intercept the redirect.

## What your end users actually see

Both platforms present the sign-in flow in the **system browser** — `ASWebAuthenticationSession` on iOS, Chrome Custom Tabs on Android — never an embeddable WebView. The domain stays visible in native OS chrome throughout, which is the concrete trust signal a WebView-based flow can't provide: your user can see they're really talking to `auth.yourtenant.com`, not a page your app's own code could have spoofed.

A typical flow, on either platform:

1. **Tap "Sign in"** in your app. The system browser sheet slides up, still showing your app underneath.
2. **Your tenant's real sign-in page loads** in that sheet — the exact same identifier-first page a web user would see, with your tenant's branding.
3. **The user signs in** (password, passkey, whatever your tenant has enabled) — this is a real page load in the system browser component, not anything your app's code touches.
4. **The sheet dismisses automatically** once the redirect fires, returning the user straight to your app, already signed in.

Nothing in this flow is mobile-specific from the user's perspective beyond the container — it's the same sign-in experience your web users get, just presented in the OS's own secure browser surface instead of a full tab.

## Using LoginLink from mobile today

Until these SDKs are published, use AppAuth directly — see `samples/mobile-ios-raw` and `samples/mobile-android-raw` in the main repository for complete, working examples pointed at a configurable OIDC authority URL.
