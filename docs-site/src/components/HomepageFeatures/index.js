import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const Icon = ({ path, color }) => (
  <div className={styles.icon} style={{ background: color.soft, color: color.ink }}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  </div>
);

const blue = { soft: 'var(--ll-accent-soft)', ink: 'var(--ll-accent-ink)' };
const mint = { soft: 'var(--ll-mint-soft)', ink: 'var(--ll-mint)' };
const amber = { soft: 'rgba(180, 83, 9, 0.12)', ink: '#b45309' };

const FeatureList = [
  {
    title: 'Getting Started',
    color: blue,
    path: 'M13 10V3L4 14h7v7l9-11h-7z',
    description: 'Core concepts — tenants, users, apps, roles — and a 10-minute quickstart.',
    links: [
      { label: 'Overview', to: '/getting-started/overview' },
      { label: 'Quickstart', to: '/quickstart' },
    ],
  },
  {
    title: 'Authentication Methods',
    color: mint,
    path: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    description: 'Password, WebAuthn, Magic Link, MFA, 10 OAuth/social connectors, LDAP/AD, SAML.',
    links: [
      { label: 'Social & OAuth', to: '/authentication/social-oauth' },
      { label: 'Enterprise (LDAP, SAML)', to: '/authentication/saml' },
    ],
  },
  {
    title: 'Automating Your Tenant',
    color: amber,
    path: 'M5 12h14M5 12a2 2 0 01-2-2V8a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 01-2 2M5 12a2 2 0 00-2 2v2a2 2 0 002 2h14a2 2 0 002-2v-2a2 2 0 00-2-2',
    description: 'SCIM provisioning from your IdP, and a Management API for scripting users, roles, and apps.',
    links: [
      { label: 'SCIM Provisioning', to: '/automating-your-tenant/scim-provisioning' },
      { label: 'Management API', to: '/automating-your-tenant/management-api' },
    ],
  },
  {
    title: 'API Reference',
    color: blue,
    path: 'M10 20l4-16m4 4l4 4-4 4M6 8l-4 4 4 4',
    description: 'OAuth/OIDC endpoints, the Management API, and the SCIM API — full request/response shapes.',
    links: [{ label: 'Browse reference', to: '/api-reference/oauth-oidc-endpoints' }],
  },
  {
    title: 'SDKs & Integrations',
    color: mint,
    path: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    description: '.NET, JavaScript, and React samples. Mobile SDKs and an embeddable widget are on the roadmap.',
    links: [{ label: '.NET / JS / React', to: '/sdks-integrations/dotnet-js-react' }],
  },
  {
    title: 'Self-Hosting',
    color: amber,
    path: 'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z',
    description: 'Run LoginLink yourself with the published Docker images (Docker Hub & GHCR).',
    links: [{ label: 'Docker quickstart', to: '/self-hosting/docker-images' }],
  },
];

function Feature({ title, color, path, description, links }) {
  return (
    <div className={styles.card}>
      <Icon path={path} color={color} />
      <h3>{title}</h3>
      <p>{description}</p>
      <div className={styles.links}>
        {links.map((l) => (
          <Link key={l.to} to={l.to}>
            {l.label} →
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.grid}>
      {FeatureList.map((props) => (
        <Feature key={props.title} {...props} />
      ))}
    </section>
  );
}
