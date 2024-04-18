import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Helix Docs",
  tagline: "Helix Bridge",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://docs.helixbridge.app",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "helix-bridge", // Usually your GitHub org/user name.
  projectName: "helix-docs", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/helix-bridge/helix-docs/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    navbar: {
      title: "Helix Docs",
      logo: {
        alt: "Helix Docs Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          href: "https://github.com/helix-bridge",
          label: "GitHub",
          position: "right",
          logo: '/img/logo.svg'
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "App",
          items: [
            {
              label: "Helix Bridge",
              to: "https://helixbridge.app",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Discord",
              href: "https://discord.gg/6XyyNGugdE",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/helixbridges",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/helix-bridge",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Helix Bridge`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
