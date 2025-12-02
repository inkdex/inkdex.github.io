/* SPDX-License-Identifier: GPL-3.0-or-later */
/* Copyright © 2025 Inkdex */

import { defineConfig } from "vitepress";
import headConfig from "./config/headConfig";
import navbarConfig from "./config/navigation/navbar";
import sidebarConfig from "./config/navigation/sidebar";
import socialLinks from "./config/navigation/socialLinks";

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

    nav: navbarConfig,

    socialLinks: socialLinks,

    sidebar: sidebarConfig,

    editLink: {
      pattern:
        "https://github.com/inkdex/inkdex.github.io/tree/master/src/:path",
    },

    footer: {
      copyright: "Copyright © 2025 Inkdex. GPLv3 or Later Licensed.",
    },
  },

  markdown: {
    image: {
      lazyLoading: true,
    },
  },
});
