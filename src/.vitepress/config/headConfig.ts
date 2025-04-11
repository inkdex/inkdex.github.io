import type { HeadConfig } from "vitepress";

const headConfig: HeadConfig[] = [
    ["meta", { name: "darkreader-lock" }],

    ["meta", { name: "theme-color", content: "#e72323" }],
    ["meta", { name: "msapplication-TileColor", content: "#e72323" }],

    ["meta", { name: "charset", content: "utf-8" }],
    [
        "meta",
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
    ],
    ["meta", { name: "referrer", content: "no-referrer-when-downgrade" }],

    [
        "link",
        {
            rel: "icon",
            href: "/logo-rounded.svg",
        },
    ],
    // [
    //   "link",
    //   {
    //     rel: "icon",
    //     type: "image/png",
    //     sizes: "32x32",
    //     href: "/favicon-32x32.png",
    //   },
    // ],
    // [
    //   "link",
    //   {
    //     rel: "icon",
    //     type: "image/png",
    //     sizes: "16x16",
    //     href: "/favicon-16x16.png",
    //   },
    // ],
    // [
    //   "link",
    //   {
    //     rel: "apple-touch-icon",
    //     type: "image/png",
    //     sizes: "180x180",
    //     href: "/apple-touch-icon.png",
    //   },
    // ],

    // ["link", { rel: "manifest", href: "/site.webmanifest" }],
];

export default headConfig;
