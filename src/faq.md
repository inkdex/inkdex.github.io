<!-- SPDX-License-Identifier: GPL-3.0-or-later -->
<!-- Copyright © 2025 Inkdex -->

# Frequently Asked Questions (FAQ)

## General

### How do I find what version of Paperback I am using?

<details>
  <summary>Answer</summary>

- Tap the _cog_ to open **_Settings_**.
  - iOS: <!-- TODO: Add image -->
  - macOS/iPadOS:

<div align="center">
    <img src="/v0.9/settings-cog.avif" alt="Settings Cog (macOS/iPadOS)" width="300" />
</div>

- The version number can be found under the Paperback logo and name (e.g. v0.9-r21).

<div align="center">
    <img src="/v0.9/paperback-version.avif" alt="Paperback Version" width="300" />
</div>

</details>

### How do I find an extension its version?

<details>
  <summary>Answer</summary>

- Tap the _cog_ to open **_Settings_**.
  - iOS: <!-- TODO: Add image -->
  - macOS/iPadOS:

<div align="center">
    <img src="/v0.9/settings-cog.avif" alt="Settings Cog (macOS/iPadOS)" width="300" />
</div>

- Tap **_Extensions_**.

<div align="center">
    <img src="/v0.9/settings-extensions.avif" alt="Settings - Extensions" width="300" />
</div>

- The extension their version number will be displayed underneath their name.

<div align="center">
    <img src="/v0.9/extension-version.avif" alt="Extension Version" width="300" />
</div>

</details>

### Why do I have blurred covers with a letter (U, M or A) on them?

<details>
  <summary>Answer</summary>

This is due to your content settings, check out the [content settings](guides/content-settings.md)
guide on how to change this.

<div align="center">
    <img src="/v0.9/content-settings-blurred-with-u-m.avif" alt="Blurred Covers" width="300" />
</div>

</details>

### Are there any Western Comic extensions?

<details>
  <summary>Answer</summary>

Currently Inkdex does not provide any Western Comic extensions. But the Batcave,
ReadAllComics, ReadComicsOnlineRu extnensions can be found in other repositories
not maintained by Inkdex. Head over to our [Discord server](https://discord.gg/inkdex)
for more information!

</details>

### What are the best extensions to install?

<details>
  <summary>Answer</summary>

This is a highly subjective question which we most often wont have an answer for.
What you can do is check other sites like [everythingmoe.com](https://everythingmoe.com)
which do try to answer this question as best as possible.

</details>

### Does site x have an extension?

<details>
  <summary>Answer</summary>

The easiest way to check this is through the [extension list page](/extension-list)
on this website.

</details>

### What extension has title x?

<details>
  <summary>Answer</summary>

We don't know this either. Just look around on the internet for your title and then
check if that site has an extension.

</details>

### How do I request an extension?

<details>
  <summary>Answer</summary>

Extension requests are done through the `/request-extension` [slash command](https://support-apps.discord.com/hc/en-us/articles/26501837786775-Slash-Commands-FAQ)
in our [Discord server](https://discord.gg/inkdex).

It will ask you for a valid URL (starts with "https://") of the site in question
and a reason as to why it should be turned into an extension.

</details>

### Why has my request for an extension not been added yet?

<details>
  <summary>Answer</summary>

Extension requests are never certain to be fulfilled. The requests are there to help
extension developers discover wanted extensions.

If you want your extension to be added, the best chance you have is:

- Request an extension that is original and qualitative.
- Do it yourself (check our [extension development guide](/development/extensions),
  coding experience is a good to have but not required).

Most of the titles are already available through existing extensions, making a whole
extension just because you don't want to wait 1 hour for another site to pick it
up is not worth it for most developers. Since there only are a few active extension
developers and most of them are English, foreign extensions are unlikely to get added.

</details>

### Are external repositories/extensions safe to use?

<details>
  <summary>Answer</summary>

All repositories/extensions provided by Inkdex are well maintained to make sure
that they are safe to use. Their code and its release method is open source, meaning
you can check what all of it does on [GitHub](https://github.com/inkdex).

In our [Discord server](https://discord.gg/inkdex) you will be able to find other
repositories which are not maintained by Inkdex and thus do not have the same guarantees.
But in general extensions cannot do any harm to your device. If you're doubtful about
a certain extension, don't use it. Or check its source code on its respective GitHub
repository.

</details>

### Is there any copyrighted material hosted?

<details>
  <summary>Answer</summary>

Inkdex does not host or distribute any content it does not have the rights of.

Extensions are just scripts to pull content from other sites that may do host these
items. Meaning that extensions themselves do not contain any content it does not
have rights of, but the websites they get it from may do.

The Inkdex project is in no way affiliated with any of the websites its extensions
may access.

</details>

### How do I filter out duplicate chapters?

<details>
  <summary>Answer</summary>

Some titles may have several chapter groups, resulting in duplicate versions of the
same chapter.

You can make it so Paperback limits it to one version per chapter:

- Open the title view, so that the chapter list is displaying.

<!-- TODO: Add image -->

- Tap the _ellipsis (...)_.

<div align="center">
    <img src="/v0.9/ellipsis-within-chapter-listing.avif" alt="Chapter List Ellipsis" width="300" />
</div>

- Select **_Manage Version Priority_**.

<div align="center">
    <img src="/v0.9/ellipsis-menu-pop-up.avif" alt="Ellipsis Menu Pop-Up - Manage Version Priority" width="300" />
</div>

- A page titled **Title Settings** will open.

<div align="center">
    <img src="/v0.9/title-settings.avif" alt="Title Settings" width="300" />
</div>

- In the section titled **AVAILABLE VERSIONS** tap one or more groups, this will
  move them up to the **PRIORITISED VERSIONS** section.

<div align="center">
    <img src="/v0.9/prioritised-versions.avif" alt="Title Settings - PRIORITISED VERSIONS" width="300" />
</div>

- If you have more than one group in the **PRIORITISED VERSIONS** section, you can
  hold press on the hamburger and drag to reorder them. The order is the priority
  which it will use for selecting chapter versions.

<div align="center">
    <img src="/v0.9/prioritised-versions-order.avif" alt="Title Settings - PRIORITISED VERSIONS Order" width="300" />
</div>

- If you enable the **Hide Other Versions** setting it will only display those listed
  in the **PRIORITISED VERSIONS** section. It will display another group only if
  those in **PRIORITISED VERSIONS** do not have a chapter available.

<div align="center">
    <img src="/v0.9/hide-other-versions-setting.avif" alt="Hide Other Versions Setting" width="300" />
</div>

</details>

## Specific Extensions

### Bato.To or MangaPlus - How do I remove titles in other languages?

<details>
  <summary>Answer</summary>

- Tap the _cog_ to open **_Settings_**.
  - iOS: <!-- TODO: Add image -->
  - macOS/iPadOS:

<div align="center">
    <img src="/v0.9/settings-cog.avif" alt="Settings Cog (macOS/iPadOS)" width="300" />
</div>

- Tap **_Extensions_**.

<div align="center">
    <img src="/v0.9/settings-extensions.avif" alt="Settings - Extensions" width="300" />
</div>

- Tap the extension whose language settings you wish to adjust.
- Select **_Settings_** → **_Languages_**.
- Choose the language(s) you want to read, a tick will appear next to them.

</details>

### MangaDex or MangaFire - How do I remove titles in other languages?

<details>
  <summary>Answer</summary>

- Tap the _cog_ to open **_Settings_**.
  - iOS: <!-- TODO: Add image -->
  - macOS/iPadOS:

<div align="center">
    <img src="/v0.9/settings-cog.avif" alt="Settings Cog (macOS/iPadOS)" width="300" />
</div>

- Tap **_Extensions_**.

<div align="center">
    <img src="/v0.9/settings-extensions.avif" alt="Settings - Extensions" width="300" />
</div>

- Tap the extension whose language settings you wish to adjust.
- Tap **_Settings_** → **_Content Settings_** → **_Languages_**.
- Choose the language(s) you want to read, a tick will appear next to them.

</details>

### MangaDex - Why are some titles/chapters available on the site are not showing in Paperback?

<details>
  <summary>Answer</summary>

There are two common reasons for this:

1. MangaDex itself is filtering content.

- Tap the _cog_ to open **_Settings_**.
  - iOS: <!-- TODO: Add image -->
  - macOS/iPadOS:

<div align="center">
    <img src="/v0.9/settings-cog.avif" alt="Settings Cog (macOS/iPadOS)" width="300" />
</div>

- Tap **_Extensions_**.

<div align="center">
    <img src="/v0.9/settings-extensions.avif" alt="Settings - Extensions" width="300" />
</div>

- Tap **_MangaDex_**.
- Tap **_Settings_** → **_Content Settings_** → **_Content Rating_**.

2. The chapters are not hosted on MangaDex, but instead link to external sites.

- Open the title in Paperback.
- If the title is hosted externally, you will see the following error:

::: danger An error occurred
A Javascript error occurred: Chapters are hosted externally outside MangaDex, you'll need to use another source or read it online.
:::

</details>

### MangaBox-themed sites - Why do pages have gaps or splits on the displayed pages?

<details>
  <summary>Answer</summary>

MangaBox-themed sites (e.g., Manganato, Mangakakalot, MangaBat) have switched from
paged chapters to long vertical strips, cropping images in irregular sizes.

Trying to reading titles from these extensions with the horizontal reader will cause
them to not display properly, this is not something which can get fixed at this moment.

The only available fix is to always use Paperback its vertical reader without page
padding when reading titles from these extensions.

<!-- TODO: Add image -->

</details>
