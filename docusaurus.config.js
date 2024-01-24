// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "DIAL Knowledge Base",
  favicon: "img/favicon.svg",

  // Set the production url of your site here
  url: "https://docs.epam-rail.com",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "epam", // Usually your GitHub org/user name.
  projectName: "ai-dial", // Usually your repo name.
  deploymentBranch: "gh-pages",

  onBrokenLinks: "throw", //'throw', for exeptions
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  plugins: [
    "docusaurus-plugin-image-zoom", // can also just be 'image-zoom'
  ],
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.js",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          //editUrl:
          //  'https://github.com/epam/ai-dial/tree/main/',
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
        },
        gtag: {
          trackingID: 'G-GVY5VWYV1E',
        },
      }),
    ],
  ],

  scripts: [
    {
      src: "https://cookie-cdn.cookiepro.com/consent/3a34bbfa-93e4-4ba6-9383-7da88d67ed18/OtAutoBlock.js",
      type: "text/javascript",
    },
    {
      src: "https://cookie-cdn.cookiepro.com/scripttemplates/otSDKStub.js",
      type: "text/javascript",
      charset: "UTF-8",
      "data-domain-script": "3a34bbfa-93e4-4ba6-9383-7da88d67ed18",
    },
    {
      src: "src/scripts/optanonWrapper.js",
      type: "text/javascript",
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "", // 'EPAM DIAL',
        logo: {
          alt: "EPAM DIAL",
          src: "img/logo_light.svg",
          srcDark: "img/logo_dark.svg",
        },
        items: [
          // {
          //   type: 'docSidebar',
          //   sidebarId: 'tutorialSidebar',
          //   position: 'left',
          //   label: 'Tutorial',
          // },
          {
            href: "https://github.com/search?q=org%3Aepam++DIAL&type=repositories",
            label: "GitHub",
            position: "right",
          },
          {
            href: "https://discord.gg/3TPc4zV4gS",
            label: "Discord",
            position: "right",
          },
        ],
      },
      footer: {
        copyright: `Copyright © ${new Date().getFullYear()} EPAM Systems, Inc. All Rights Reserved`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      colorMode: {
        defaultMode: "dark",
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 4,
      },
      zoom: {
        selector: ".markdown img",
        background: {
          light: "rgb(255, 255, 255)",
          dark: "rgb(50, 50, 50)",
        },
        config: {
          scrollOffset: 1100,
          margin: 10,
        },
      },
      algolia: {
        appId: '8ZBWD7ULLD',
        apiKey: 'ac2f650541ceb44057cb625556f5e70a',
        indexName: 'epam-rail',
        contextualSearch: true,
        algoliaOptions: {
          // facets: [ "language" ]
        },
      },
    }),
};

export default config;
