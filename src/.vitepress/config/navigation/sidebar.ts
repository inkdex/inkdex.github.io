/* SPDX-License-Identifier: GPL-3.0-or-later */
/* Copyright © 2025 Inkdex */

export default [
  { text: "Installation", link: "/installation" },
  { text: "Extension List", link: "/extension-list" },
  {
    text: "Guides",
    link: "/guides",
    collapsed: false,
    items: [
      { text: "Content Settings", link: "/guides/content-settings" },
      {
        text: "Content Service Extensions",
        link: "/guides/content-service-extensions",
      },
      {
        text: "Tracker Service Extensions",
        link: "/guides/tracker-service-extensions",
      },
      { text: "Migration", link: "/guides/migration" },
    ],
  },
  { text: "FAQ", link: "/faq" },
  { text: "Support", link: "/support" },
  {
    text: "Development",
    link: "/development",
    collapsed: true,
    items: [
      {
        text: "Extensions",
        link: "/development/extensions",
      },
      {
        text: "Website",
        link: "/development/website",
      },
      {
        text: "Tooling",
        link: "/development/tooling",
      },
    ],
  },
];
