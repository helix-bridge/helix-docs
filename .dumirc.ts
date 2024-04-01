import { defineConfig } from 'dumi';
import { defineThemeConfig } from 'dumi-theme-chakra';

export default defineConfig({
  themeConfig: {
    name: 'Helix Bridge',
    footer: `<span style="padding-bottom: 10px;">Copyright © ${new Date().getFullYear()} | Helix Bridge</span>`,
    logo: '/logoLight.svg',
    nav: [],
    //hideHomeNav: true,
    ...defineThemeConfig({
      social: {
        github: { name: 'Github', link: 'https://github.com/helix-bridge' },
        discord: { name: 'Discord', link: 'https://discord.gg/6XyyNGugdE' },
      },
      helmetIcon: '-',
    }),
  },
  locales: [{ id: 'en-US', name: 'EN' }],
});
