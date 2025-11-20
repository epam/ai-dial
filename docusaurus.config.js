// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';
import fauxRemarkEmbedder from '@remark-embedder/core';
import { readFileSync } from 'fs';
import oembedTransformer from './src/transformers/oembed.js';
import jupyterTransformer from './src/transformers/jupyter.js';

const footerLink = (href, path) => {
  return `<a class="footer__link-item" target="_blank" rel="noopener noreferrer" href="${href}">${readFileSync(
    path,
    {
      encoding: 'utf-8',
    },
  )}</a>`;
};

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'DIALX Knowledge Base',
  favicon: 'img/favicon.svg',

  // Set the production url of your site here
  url: 'https://docs.dialx.ai',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: process.env.BASE_URL ? process.env.BASE_URL : '/',
  trailingSlash: false,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'epam', // Usually your GitHub org/user name.
  projectName: 'ai-dial', // Usually your repo name.
  deploymentBranch: 'gh-pages',
  onBrokenLinks: 'throw', //'throw', for exceptions
  onBrokenAnchors: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },
  onDuplicateRoutes: 'throw',
  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  plugins: [
    'docusaurus-plugin-image-zoom', // can also just be 'image-zoom'
  ],
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          //editUrl:
          //  'https://github.com/epam/ai-dial/tree/main/',
          remarkPlugins: [
            [
              fauxRemarkEmbedder,
              { transformers: [oembedTransformer, jupyterTransformer] },
            ],
          ],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
        },
        gtag: {
          trackingID: 'GTM-NQKQWGFJ',
        },
      }),
    ],
  ],

  // scripts:
  //   process.env.NODE_ENV === 'development'
  //     ? []
  //     : [
  //         {
  //           src: 'https://cookie-cdn.cookiepro.com/consent/3a34bbfa-93e4-4ba6-9383-7da88d67ed18/OtAutoBlock.js',
  //           type: 'text/javascript',
  //         },
  //         {
  //           src: 'https://cookie-cdn.cookiepro.com/scripttemplates/otSDKStub.js',
  //           type: 'text/javascript',
  //           charset: 'UTF-8',
  //           'data-domain-script': '3a34bbfa-93e4-4ba6-9383-7da88d67ed18',
  //         },
  //         {
  //           src: 'src/scripts/optanonWrapper.js',
  //           type: 'text/javascript',
  //         },
  //       ],

  scripts: [
    {
      src: 'https://app.termly.io/resource-blocker/98fb745b-9467-48d1-8f4f-b993d54a5a27?autoBlock=on',
      type: 'text/javascript',
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: '', // 'DIALX',
        logo: {
          alt: 'DIALX',
          src: 'img/logo-lt.svg',
          srcDark: 'img/logo-dk.svg',
        },
        items: [
          // {
          //   type: 'docSidebar',
          //   sidebarId: 'tutorialSidebar',
          //   position: 'left',
          //   label: 'Tutorial',
          // },
        ],
      },
      footer: {
        links: [
          {
            items: [
              {
                label: 'Privacy policy',
                to: 'https://www.epam.com/privacy-policy',
              },
              {
                label: 'Cookie policy',
                to: 'https://www.epam.com/cookie-policy',
              },
            ],
          },
          {
            items: [
              {
                html: `© ${new Date().getFullYear()} All Rights Reserved`,
              },
            ],
          },
          {
            items: [
              {
                html: footerLink(
                  'https://discord.gg/hgqEAbEwZ9',
                  './static/discord.svg',
                ),
              },
              {
                html: footerLink(
                  'https://www.youtube.com/@TeamDIALX',
                  './static/youtube.svg',
                ),
              },
              {
                html: footerLink(
                  'https://github.com/search?q=org%3Aepam++DIAL&type=repositories',
                  './static/github.svg',
                ),
              },
            ],
          },
        ],
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      colorMode: {
        defaultMode: 'light',
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 4,
      },
      zoom: {
        selector: '.markdown img:not(.no-zoom)',
        background: {
          light: 'rgb(255, 255, 255)',
          dark: 'rgb(50, 50, 50)',
        },
        config: {
          scrollOffset: 1100,
          margin: 10,
        },
      },
      algolia: {
        appId: 'J29WSHFXXA',
        apiKey: '7301647acc03a2265992a18254db34c6',
        indexName: 'docs_dialx_ai_j29wshfxxa_pages',
        contextualSearch: true,
        algoliaOptions: {
          // facets: [ "language" ]
        },
      },
      metadata: [
        { name: 'description', content: 'AI DIAL knowledge base portal.' },
        {
          name: 'keywords',
          content: 'AI DIAL, DIALX, RAG, GenAI, AI platform',
        },
        {
          name: 'summary',
          content:
            'AI DIAL is a secure, enterprise-grade and open-source platform. It has an API-first, cloud and model-agnostic design that makes it suitable for a wide variety of use cases. ',
        },
      ],
    }),
};

export default config;
