/* SPDX-License-Identifier: GPL-3.0-or-later */
/* Copyright © 2025 Inkdex */

export default [
    { text: "Installation", link: "/installation" },
    { text: "Extension List", link: "/extension-list" },
    { text: "FAQ", link: "/faq" },
    { text: "Support", link: "/support" },
    {
        text: "Guides",
        link: "/guides",
        collapsed: false,
        items: [
            {
                text: "Content Providing Extensions",
                link: "/guides/content-providing",
            },
            { text: "Tracking Extensions", link: "/guides/tracking" },
            {
                text: "Collection Management Extensions",
                link: "/guides/collection-management",
            },
            { text: "Content Settings", link: "/guides/content-settings" },
            { text: "Migration", link: "/guides/migration" },
        ],
    },
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
