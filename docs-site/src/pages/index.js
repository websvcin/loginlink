import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import styles from './index.module.css';

function HomepageHero() {
  return (
    <header className={styles.hero}>
      <h1 className={styles.heroTitle}>Everything you need to run sign-in on LoginLink</h1>
      <p className={styles.heroSubtitle}>
        Guides, API references, and SDKs for adding authentication, provisioning, and account
        management to your product.
      </p>
      <div className={styles.heroActions}>
        <Link className="button button--lg" style={{ background: 'var(--ll-accent)', color: '#fff', border: 'none' }} to="/quickstart">
          Get started →
        </Link>
        <Link className="button button--lg button--outline" to="/api-reference/oauth-oidc-endpoints">
          API Reference
        </Link>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Guides, API references, and SDKs for adding authentication, provisioning, and account management to your product with LoginLink.">
      <HomepageHero />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
