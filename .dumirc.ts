import { defineConfig } from 'dumi';

export default defineConfig({
  themeConfig: {
    footer: `<br>Copyright © ${(/* @__PURE__ */ new Date()).getFullYear()} | Powered by <a href="https://helixbridge.app" target="_blank" rel="noreferrer">helix</a>`,
    logo: "/logoLight.svg",
    nav: [],
    //hideHomeNav: true,
  },
  locales: [
    { id: 'en-US', name: 'EN' },
  ],
});
