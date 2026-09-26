// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/overview',
        'getting-started/who-loginlink-is-for',
        'getting-started/how-it-works',
        {
          type: 'link',
          label: 'Quickstart',
          // The canonical Quickstart is the public, personalized page at
          // /quickstart (LOCK-71), not a doc — kept as a sidebar link rather
          // than a duplicate markdown copy of the same content.
          href: '/quickstart',
        },
        'getting-started/core-concepts',
        'getting-started/creating-an-organization',
      ],
    },
    {
      type: 'category',
      label: 'Console',
      items: [
        'console/tenant-admin-guide',
        'console/user-management',
        'console/admin-actions-and-audit',
        'console/apps-and-connectors',
        'console/roles-and-relationships',
        'console/onboarding-and-membership',
        'console/mfa-and-recovery',
        'console/session-and-token-policy',
        'console/risk-and-anti-abuse',
        'console/access-rules',
        'console/identifiers-and-custom-fields',
        'console/delegated-access',
        'console/risk-monitoring-and-alerts',
        'console/webhooks-administration',
        'console/organization-settings',
        'console/advanced-signin-options',
        'console/walkthrough-first-app',
        'console/walkthrough-invite-co-admin',
      ],
    },
    {
      type: 'category',
      label: 'Authentication',
      items: [
        'authentication/password-mfa',
        'authentication/webauthn-passkeys',
        'authentication/magic-link',
        'authentication/social-oauth',
        'authentication/ldap-active-directory',
        'authentication/saml',
        'authentication/cross-surface-sign-in',
      ],
    },
    {
      type: 'category',
      label: 'Automating Your Tenant',
      items: [
        'automating-your-tenant/scim-provisioning',
        'automating-your-tenant/management-api',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api-reference/oauth-oidc-endpoints',
        'api-reference/management-api-reference',
        'api-reference/platform-api',
        'api-reference/scim-api-reference',
      ],
    },
    {
      type: 'category',
      label: 'SDKs & Integrations',
      items: [
        'sdks-integrations/dotnet-js-react',
        'sdks-integrations/mobile',
        'sdks-integrations/widget',
      ],
    },
    {
      type: 'category',
      label: 'Self-Hosting',
      items: [
        'self-hosting/platform-admin-guide',
        'self-hosting/first-run-setup',
        'self-hosting/docker-images',
        'self-hosting/docker-compose',
        'self-hosting/binary-releases',
        'self-hosting/where-your-data-lives',
        'self-hosting/backup-and-moving',
        'self-hosting/database-auto-provisioning',
        'self-hosting/signup-security',
        'self-hosting/issuer-and-reverse-proxy',
        'self-hosting/upgrades-and-deployment-health',
        'self-hosting/platform-identity-policy',
        'self-hosting/platform-risk-monitoring',
        'self-hosting/platform-settings',
        'self-hosting/platform-organizations',
      ],
    },
    {
      type: 'category',
      label: 'Webhooks',
      items: ['webhooks/overview'],
    },
    {
      type: 'category',
      label: 'Security & Compliance',
      items: [
        'security-compliance/audit-logs',
        'security-compliance/gdpr',
        'security-compliance/byo-db-data-residency',
      ],
    },
    {
      type: 'category',
      label: 'Changelog',
      items: ['changelog/index'],
    },
  ],
};

module.exports = sidebars;
