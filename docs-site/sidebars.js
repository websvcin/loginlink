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
        {
          type: 'link',
          label: 'Quickstart',
          // The canonical Quickstart is the public, personalized page at
          // /quickstart (LOCK-71), not a doc — kept as a sidebar link rather
          // than a duplicate markdown copy of the same content.
          href: '/quickstart',
        },
        'getting-started/core-concepts',
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
        'self-hosting/docker-images',
        'self-hosting/docker-compose',
        'self-hosting/binary-releases',
        'self-hosting/backup-and-moving',
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
