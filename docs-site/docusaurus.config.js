// @ts-check
// LOCK-69 — public /docs site. Standalone Docusaurus project, not wired into
// LoginLink.csproj or the main solution — same "real code, not built into the
// app" pattern as /samples (LOCK-74). Requires Node.js to install/build/serve
// (`npm install && npm start`), which this dev environment does not have —
// written to match Docusaurus's real, documented config schema, syntax
// checked, but not npm-install/build-verified here.

const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'LoginLink Docs',
  tagline: 'Guides, API references, and SDKs for adding sign-in to your product.',
  favicon: 'img/favicon.ico',

  // Feedback (2026-08-01) — resolved: docs deploy to GitHub Pages
  // (websvcin.github.io/loginlink/), not a custom domain. If a custom domain
  // is ever set up later, this needs to change back to that domain's own
  // url/baseUrl pair.
  url: 'https://websvcin.github.io',
  baseUrl: '/loginlink/',

  organizationName: 'websvcin',
  projectName: 'loginlink',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/websvcin/loginlink/edit/main/docs-site/',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/social-card.png',
      colorMode: {
        defaultMode: 'light',
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'LoginLink Docs',
        logo: {
          alt: 'LoginLink',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            to: '/api-reference/oauth-oidc-endpoints',
            position: 'left',
            label: 'API Reference',
          },
          {
            to: '/changelog',
            position: 'left',
            label: 'Changelog',
          },
          {
            href: 'https://github.com/websvcin/loginlink',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              { label: 'Quickstart', to: '/quickstart' },
              { label: 'API Reference', to: '/api-reference/oauth-oidc-endpoints' },
              { label: 'SCIM Provisioning', to: '/automating-your-tenant/scim-provisioning' },
            ],
          },
          {
            title: 'More',
            items: [
              { label: 'Changelog', to: '/changelog' },
              { label: 'Self-Hosting', to: '/self-hosting/docker-images' },
              { label: 'GitHub', href: 'https://github.com/websvcin/loginlink' },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} LoginLink.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['csharp', 'bash', 'json', 'yaml'],
      },
    }),
};

module.exports = config;
