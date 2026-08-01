import React, { useMemo, useState } from 'react';
import { useLocation } from '@docusaurus/router';
import Layout from '@theme/Layout';
import styles from './styles.module.css';
import { LANGUAGES, MOBILE_PLATFORMS, PLACEHOLDER } from './_languageData';

// LOCK-71 — personalization is query-string-driven (?client_id=...&tenant=...
// &issuer=...&redirect_uri=...), populated by Console's own "View Quickstart
// →" deep link (see AppEdit.cshtml.cs). A same-origin-session auto-detected
// version (the mockup's "sign in to personalize" framing) needs the real
// production domain topology decided first — same class of deferred item as
// LOCK-68's own open placeholder — so this is the reliable mechanism that
// works today rather than one that depends on an undecided deployment shape.
function usePersonalization() {
  const location = useLocation();
  return useMemo(() => {
    const params = new URLSearchParams(location.search);
    const clientId = params.get('client_id');
    if (!clientId) return { isPersonalized: false, values: PLACEHOLDER, appName: null };

    const tenant = params.get('tenant') || PLACEHOLDER.tenant;
    return {
      isPersonalized: true,
      appName: params.get('app_name'),
      values: {
        tenant,
        clientId,
        issuer: params.get('issuer') || `https://auth.${tenant}.com`,
        redirectUri: params.get('redirect_uri') || PLACEHOLDER.redirectUri,
      },
    };
  }, [location.search]);
}

function CodeBlock({ install, code, personalized }) {
  return (
    <div className={styles.codeBlock}>
      {install && <span className={styles.installLine}>{install}</span>}
      <HighlightedPlaceholders text={code} personalized={personalized} />
    </div>
  );
}

// Wraps the substituted placeholder/real values in a span so they're visibly
// callout-colored in the code block, matching the mockup's own treatment —
// blue while showing placeholders, amber once personalized with real values.
function HighlightedPlaceholders({ text, personalized }) {
  const needles = [PLACEHOLDER.tenant, PLACEHOLDER.clientId, PLACEHOLDER.issuer, PLACEHOLDER.redirectUri];
  const pattern = new RegExp(`(${needles.map(escapeRegExp).join('|')})`, 'g');

  // When personalized, the real values won't match the placeholder needles
  // above (they're different strings), so nothing gets the placeholder
  // treatment — instead, highlight anything that looks like the visitor's
  // own substituted value by diffing against known placeholder positions is
  // unnecessary complexity; simplest correct approach: highlight known
  // placeholder text when NOT personalized, and skip highlighting entirely
  // once real values are substituted in (the values themselves are the
  // signal — no highlighting needed once they're real).
  if (personalized) return <>{text}</>;

  const parts = text.split(pattern);
  return (
    <>
      {parts.map((part, i) =>
        needles.includes(part) ? (
          <span key={i} className={styles.placeholderVal}>
            {part}
          </span>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function MethodPanel({ entry, values, personalized }) {
  if (!entry) return null;
  return (
    <>
      <CodeBlock install={entry.install} code={entry.code(values)} personalized={personalized} />
      {entry.note && <p className={styles.note}>{entry.note}</p>}
    </>
  );
}

function SdkRawToggle({ lang, method, setMethod }) {
  if (!lang.sdk) return null;
  return (
    <div className={styles.methodToggle}>
      <button
        type="button"
        className={method === 'sdk' ? styles.methodBtnActive : styles.methodBtn}
        onClick={() => setMethod('sdk')}
      >
        Using the SDK
      </button>
      <button
        type="button"
        className={method === 'raw' ? styles.methodBtnActive : styles.methodBtn}
        onClick={() => setMethod('raw')}
      >
        Using the standard library directly
      </button>
    </div>
  );
}

function LanguagePanel({ lang, values, personalized }) {
  const [method, setMethod] = useState('sdk');
  const showSdk = lang.sdk && method === 'sdk';

  if (!lang.sdk) {
    return (
      <div>
        {lang.noSdkNote && <p className={styles.note} style={{ marginBottom: 14 }}>{lang.noSdkNote}</p>}
        <MethodPanel entry={lang.raw} values={values} personalized={personalized} />
      </div>
    );
  }

  return (
    <div>
      <SdkRawToggle lang={lang} method={method} setMethod={setMethod} />
      <MethodPanel entry={showSdk ? lang.sdk : lang.raw} values={values} personalized={personalized} />
    </div>
  );
}

function MobilePlatform({ platform, values, personalized }) {
  const [method, setMethod] = useState('sdk');
  return (
    <div>
      <h3 className={styles.mobileHeading}>{platform.label}</h3>
      <SdkRawToggle lang={platform} method={method} setMethod={setMethod} />
      <MethodPanel entry={method === 'sdk' ? platform.sdk : platform.raw} values={values} personalized={personalized} />
    </div>
  );
}

function MobilePanel({ values, personalized }) {
  return (
    <div>
      <p className={styles.note} style={{ marginBottom: 16 }}>
        Both platforms enforce the system browser (<code>ASWebAuthenticationSession</code> / Custom Tabs), never an
        embeddable WebView — closing the classic mobile phishing vector by construction.
      </p>
      <div className={styles.mobileGrid}>
        {MOBILE_PLATFORMS.map((platform) => (
          <MobilePlatform key={platform.id} platform={platform} values={values} personalized={personalized} />
        ))}
      </div>
      <p className={styles.note} style={{ marginTop: 16 }}>
        <b>Production redirect URI:</b> prefer Universal Links (iOS) / App Links (Android) over a custom URL scheme
        like <code>com.yourapp:/callback</code> — a custom scheme can be claimed by another app on the same device,
        letting it intercept the redirect. Both SDKs support either; only the raw AppAuth samples above default to
        the simpler custom-scheme form for brevity.
      </p>
    </div>
  );
}

export default function Quickstart() {
  const { isPersonalized, values, appName } = usePersonalization();
  const [activeLangId, setActiveLangId] = useState('react');
  const allTabs = [...LANGUAGES, { id: 'mobile', label: 'Mobile (iOS/Android)' }];
  const activeLang = LANGUAGES.find((l) => l.id === activeLangId);

  return (
    <Layout
      title="Quickstart"
      description="Public, personalized quickstart for integrating LoginLink — pick a language, pick SDK or raw standard library, copy the code.">
      <div className={styles.page}>
        <div className={styles.heroStrip}>
          <div className={styles.heroInner}>
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowDot} />
              Getting Started
            </div>
            <h1 className={styles.pageH1}>Quickstart</h1>
            <p className={styles.pageSub}>
              Public, no account required to read. Pick a language, pick SDK or raw standard library, copy the code.
            </p>
          </div>
        </div>

        <div className={styles.content}>
          {isPersonalized ? (
            <div className={styles.bannerPersonalized}>
              <div className={styles.iconChipMint}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>
                Personalized{appName ? <> for <b>{appName}</b></> : null} — every snippet below now uses your real
                client ID.
              </span>
            </div>
          ) : (
            <div className={styles.bannerSignedOut}>
              <div className={styles.iconChipAmber}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span>
                Showing placeholder values. Open this page from your app's <b>Console → Apps → View Quickstart</b>{' '}
                link to see it with your own real client ID substituted in.
              </span>
            </div>
          )}

          <div className={styles.langTabs}>
            {allTabs.map((lang) => (
              <div
                key={lang.id}
                className={activeLangId === lang.id ? styles.langTabActive : styles.langTab}
                onClick={() => setActiveLangId(lang.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setActiveLangId(lang.id)}>
                {lang.label}
              </div>
            ))}
          </div>

          {activeLangId === 'mobile' ? (
            <MobilePanel values={values} personalized={isPersonalized} />
          ) : (
            activeLang && <LanguagePanel lang={activeLang} values={values} personalized={isPersonalized} />
          )}

          <div className={styles.calloutNote}>
            <div className={styles.iconChipMint}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <b>Console's role shrinks to a deep link, not a duplicate page.</b> <code>/console/app-edit</code> gets
              a "View Quickstart →" link that opens this same public page with your app's real client ID already
              filled in — no separate content to maintain in two places.
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
