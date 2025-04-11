import { defineConfig } from "vitepress";
import headConfig from "./config/headConfig";
import navConfig from "./config/navigation/nav";
import sidebarConfig from "./config/navigation/sidebar";

const hostname = "https://inkdex.github.io";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Inkdex",
  description: "Community-Made Extensions for Paperback",

  head: headConfig,

  cleanUrls: true,

  lastUpdated: true,

  sitemap: {
    hostname,
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/logo-rounded.svg",

    search: {
      provider: "local",
    },

    nav: navConfig,

    sidebar: sidebarConfig,

    editLink: {
      pattern:
        "https://github.com/inkdex/inkdex.github.io/tree/master/src/:path",
    },

    footer: {
      copyright: "Copyright © 2025 Inkdex. GPLv3 Licensed.",
    },
  },
});
