<!-- SPDX-License-Identifier: GPL-3.0-or-later -->
<!-- Copyright © 2025 Inkdex -->

# Frequently Asked Questions (FAQ)

## General

### How do I find what version of Paperback I am using?

<details>
  <summary>Answer</summary>

- Tap the _cog icon_ to open **_Settings_**.
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

### How do I find an extension's version?

<details>
  <summary>Answer</summary>

- Tap the _cog icon_ → **_Settings_** → **_Extensions_**.
  - iOS: <!-- TODO: Add image -->
  - macOS/iPadOS:

<div align="center">
    <img src="/v0.9/settings-cog.avif" alt="Settings Cog (macOS/iPadOS)" width="300" />
</div>

<div align="center">
    <img src="/v0.9/settings-extensions.avif" alt="Settings - Extensions" width="300" />
</div>

- The extension's version number will be displayed underneath its name.

<div align="center">
    <img src="/v0.9/extension-version.avif" alt="Extension Version" width="300" />
</div>

</details>

### Why do I have blurred covers with a letter (U, M or A) on them?

<details>
  <summary>Answer</summary>

This is due to your content settings. Check out the [Content Settings Guide](guides/content-settings.md)
for instructions on how to change this.

<div align="center">
    <img src="/v0.9/content-settings-blurred-with-u-m.avif" alt="Blurred Covers" width="300" />
</div>

</details>

### What are the best extensions to install?

<details>
  <summary>Answer</summary>

This is a highly subjective question which we often won't have an answer for. You
can check other sites like [everythingmoe.com](https://everythingmoe.com) which
try to answer this question as best as possible.

</details>

### Does site X have an extension?

<details>
  <summary>Answer</summary>

The easiest way to check this is through the [Extension List page](/extension-list)
on this website.

</details>

### Are there any Western Comic extensions?

<details>
  <summary>Answer</summary>

Currently, Inkdex does not provide any Western Comic extensions. However, the Batcave,
ReadAllComics, and ReadComicsOnlineRu extensions can be found in other repositories
not maintained by Inkdex. Head over to our [Discord server](https://discord.gg/inkdex)
for more information!

</details>

### What extension has title X?

<details>
  <summary>Answer</summary>

We don't know this either. You can check other sites like [kuroiru.co](https://kuroiru.co/manga/explore)
which try to answer this question as best as possible. Alternatively you can search
for your title on the internet to find which site hosts it, and then checking if
that site has an extension.

</details>

### How do I request an extension?

<details>
  <summary>Answer</summary>

Extension requests are submitted through the `/request-extension` [slash command](https://support-apps.discord.com/hc/en-us/articles/26501837786775-Slash-Commands-FAQ) in our [Discord server](https://discord.gg/inkdex).

It will ask you for a valid URL (starts with "https://") of the site in question
and a reason as to why it should be turned into an extension.

</details>

### Are extension requests guaranteed to be fulfilled?

<details>
  <summary>Answer</summary>

No. Requests and their upvotes serve only as a guide to help developers discover
which extensions the community wants most.

</details>

### How can I improve the chances of my request being picked up?

<details>
  <summary>Answer</summary>

Your request is much more likely to be selected if it meets the following criteria:

- **Uniqueness:** The website offers content not available elsewhere.
- **Quality:** The website is reliable, fast, and has good image quality.
- **Justification:** The description clearly states why the website should be implemented.

</details>

### Why hasn't my request been picked up yet?

<details>
  <summary>Answer</summary>

Common reasons for a request being overlooked or ignored include:

- **Redundancy:** Most titles are already available via existing extensions. Developers
  rarely build new extensions for websites which have little new to offer.
- **Language Barriers:** We have a small team of active developers who primarily
  speak English, so non-English websites are less likely to be implemented.
- **Justification:** The request description did not provide a clear reason why
  the website should be added.

</details>

### Can I build the extension myself?

<details>
  <summary>Answer</summary>

Yes! The fastest way to get an extension added is to create it yourself. Check out
our [extension development guide](https://inkdex.github.io/development/extensions) to get started.

</details>

### Are external repositories/extensions safe to use?

<details>
  <summary>Answer</summary>

All repositories/extensions provided by Inkdex are well maintained to ensure they
are safe to use. Their code and release methods are open source, meaning you can
inspect them on [GitHub](https://github.com/inkdex).

In our [Discord server](https://discord.gg/inkdex), you will be able to find other
repositories which are not maintained by Inkdex and thus do not have the same guarantees;
however, in general, extensions cannot do harm to your device. If you are doubtful
about a certain extension, don't use it, or check its source code on its respective
GitHub repository.

</details>

### Is there any copyrighted material hosted?

<details>
  <summary>Answer</summary>

Inkdex does not host or distribute any content for which it does not hold the rights.

Extensions are simply scripts that pull content from other sites that may host these
items. This means that extensions themselves do not contain copyrighted content,
but the websites they access might.

The Inkdex project is in no way affiliated with any of the websites its extensions
may access.

</details>

### How do I filter out duplicate chapters?

<details>
  <summary>Answer</summary>

Some titles may have several chapter groups, resulting in duplicate versions of
the same chapter.

You can configure Paperback to limit this to one version per chapter:

- Open the title view so that the chapter list is displayed.

<!-- TODO: Add image -->

- Tap the _ellipsis icon (...)_ → **_Manage Version Priority_**.

<div align="center">
    <img src="/v0.9/ellipsis-within-chapter-listing.avif" alt="Chapter List Ellipsis" width="300" />
</div>

<div align="center">
    <img src="/v0.9/ellipsis-menu-pop-up.avif" alt="Ellipsis Menu Pop-Up - Manage Version Priority" width="300" />
</div>

- A page titled **Title Settings** will open.

<div align="center">
    <img src="/v0.9/title-settings.avif" alt="Title Settings" width="300" />
</div>

- In the section titled **Available Versions**, tap one or more groups to move them
  up to the **Prioritised Versions** section.

<div align="center">
    <img src="/v0.9/prioritised-versions.avif" alt="Title Settings - PRIORITISED VERSIONS" width="300" />
</div>

- If you have more than one group in the **Prioritised Versions** section, you can
  long-press the hamburger icon and drag to reorder them. The order determines the
  priority used for selecting chapter versions.

<div align="center">
    <img src="/v0.9/prioritised-versions-order.avif" alt="Title Settings - PRIORITISED VERSIONS Order" width="300" />
</div>

- If you enable the **Hide Other Versions** setting, it will only display those
  listed in the **Prioritised Versions** section. It will display another group
  only if those in **Prioritised Versions** do not have that specific chapter available.

<div align="center">
    <img src="/v0.9/hide-other-versions-setting.avif" alt="Hide Other Versions Setting" width="300" />
</div>

</details>

## Specific Extensions

### Bato.To or MangaPlus - How do I remove titles in other languages?

<details>
  <summary>Answer</summary>

- Tap the _cog icon_ → **_Settings_** → **_Extensions_**.
  - iOS: <!-- TODO: Add image -->
  - macOS/iPadOS:

<div align="center">
    <img src="/v0.9/settings-cog.avif" alt="Settings Cog (macOS/iPadOS)" width="300" />
</div>

<div align="center">
    <img src="/v0.9/settings-extensions.avif" alt="Settings - Extensions" width="300" />
</div>

- Tap the extension whose language settings you wish to adjust.
- Tap **_Settings_** → **_Languages_**.
- Select the language(s) you want to read; a tick will appear next to them.

</details>

### MangaDex or MangaFire - How do I remove titles in other languages?

<details>
  <summary>Answer</summary>

- Tap the _cog icon_ → **_Settings_** → **_Extensions_**.
  - iOS: <!-- TODO: Add image -->
  - macOS/iPadOS:

<div align="center">
    <img src="/v0.9/settings-cog.avif" alt="Settings Cog (macOS/iPadOS)" width="300" />
</div>

<div align="center">
    <img src="/v0.9/settings-extensions.avif" alt="Settings - Extensions" width="300" />
</div>

- Tap the extension whose language settings you wish to adjust.
- Tap **_Settings_** → **_Content Settings_** → **_Languages_**.
- Select the language(s) you want to read; a tick will appear next to them.

</details>

### MangaDex - Why are some titles/chapters available on the site not showing in Paperback?

<details>
  <summary>Answer</summary>

There are two common reasons for this:

1. **MangaDex itself is filtering content.**

- Tap the _cog icon_ → **_Settings_** → **_Extensions_**.
  - iOS: <!-- TODO: Add image -->
  - macOS/iPadOS:

<div align="center">
    <img src="/v0.9/settings-cog.avif" alt="Settings Cog (macOS/iPadOS)" width="300" />
</div>

<div align="center">
    <img src="/v0.9/settings-extensions.avif" alt="Settings - Extensions" width="300" />
</div>

- Tap **_MangaDex_**.
- Tap **_Settings_** → **_Content Settings_** → **_Content Rating_**.

2. **The chapters are not hosted on MangaDex, but instead link to external sites.**

- Open the title in Paperback.
- If the title is hosted externally, you will see the following error:

::: danger An error occurred
A Javascript error occurred: Chapters are hosted externally outside MangaDex, you
will need to use another source or read it online.
:::

</details>

### MangaBox-themed sites - Why do pages have gaps or splits on the displayed pages?

<details>
  <summary>Answer</summary>

MangaBox-themed sites (e.g., Manganato, Mangakakalot, MangaBat) have switched from
paged chapters to long vertical strips, cropping images in irregular sizes.

Trying to read titles from these extensions with the horizontal reader will cause
them to display improperly; this is not something that can be fixed at this moment.

The only available fix is to always use Paperback's vertical reader without page
padding when reading titles from these extensions.

<!-- TODO: Add image -->

</details>
