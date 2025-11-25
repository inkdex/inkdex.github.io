<!-- SPDX-License-Identifier: GPL-3.0-or-later -->
<!-- Copyright © 2025 Inkdex -->

# Frequently Asked Questions (FAQ)

## General

### How do I find what version of Paperback I am using?

- Tap the _cog_ to open **Settings**.
    - iOS:
        <!-- TODO: Add image -->
    - macOS/iPadOS:

<div align= "center"><img src="/v0.9/settings-cog.avif" alt="Settings Cog (macOS/iPadOS)" width="300" /></div>

- The version number can be found under the Paperback logo and name (e.g. v0.9-r21).

<div align= "center"><img src="/v0.9/paperback-version.avif" alt="Paperback Version" width="300" /></div>

### How do I find an extension its version?

- Tap the _cog_ to open **Settings**.
    - iOS:
        <!-- TODO: Add image -->
    - macOS/iPadOS:

<div align= "center"><img src="/v0.9/settings-cog.avif" alt="Settings Cog (macOS/iPadOS)" width="300" /></div>

- Tap _**Extensions**_.

<div align= "center"><img src="/v0.9/settings-extensions.avif" alt="Settings - Extensions" width="300" /></div>

- The extension their version number will be displayed underneath their name.

<div align= "center"><img src="/v0.9/extension-version.avif" alt="Extension Version" width="300" /></div>

### Why do I have blurred covers with a letter (U, M or A) on them?

This is due to your content settings, check out the [content settings](guides/content-settings.md)
guide on how to change this.

<div align= "center"><img src="/v0.9/content-settings-blurred-with-u-m.avif" alt="Blurred Covers" width="300" /></div>

### Are there any Western Comic extensions?

Currently Inkdex does not provide any Western Comic extensions. But the Batcave,
ReadAllComics, ReadComicsOnlineRu extnensions can be found in other repositories
not maintained by Inkdex. Head over to our [Discord server](https://discord.gg/inkdex)
for more information!

### Does site x have an extension?

The easiest way to check this is through the [extension list page](/extension-list)
on this website.

<!-- TODO: Finish the extension-list page-->

### How do I filter out duplicate chapters?

Some titles may have several chapter groups, resulting in duplicate versions of the
same chapter.

You can make it so Paperback limits it to one version per chapter:

- Open the title view, so that the chapter list is displaying.

<!-- TODO: Add image -->

- Tap the _ellipsis (...)_.

<div align= "center"><img src="/v0.9/ellipsis-within-chapter-listing.avif" alt="Chapter List Ellipsis" width="300" /></div>

- Select _Manage Version Priority_.

<div align= "center"><img src="/v0.9/ellipsis-menu-pop-up.avif" alt="Ellipsis Menu Pop-Up - Manage Version Priority" width="300" /></div>

- A page titled **Title Settings** will open.

<div align= "center"><img src="/v0.9/title-settings.avif" alt="Title Settings" width="300" /></div>

- In the section titled **AVAILABLE VERSIONS** tap one or more groups, this will
  move them up to the **PRIORITISED VERSIONS** section.

<div align= "center"><img src="/v0.9/prioritised-versions.avif" alt="Title Settings - PRIORITISED VERSIONS" width="300" /></div>

- If you have more than one group in the **PRIORITISED VERSIONS** section, you can
  hold press on the hamburger and drag to reorder them. The order is the priority which
  it will use for selecting chapter versions.

<div align= "center"><img src="/v0.9/prioritised-versions-order.avif" alt="Title Settings - PRIORITISED VERSIONS Order" width="300" /></div>

- If you enable the **Hide Other Versions** setting it will only display those listed
  in the **PRIORITISED VERSIONS** section. It will display another group only if those
  in **PRIORITISED VERSIONS** do not have a chapter available.

<div align= "center"><img src="/v0.9/hide-other-versions-setting.avif" alt="Hide Other Versions Setting" width="300" /></div>

<!-- TODO: Continue review -->

### Are external repos/sources safe?

All sources and repos here are safe to use and their code is open source, meaning you can check what they do and how they work on GitHub.

All the sources/repos posted on InkDex have to be open source!  
In general sources cannot do any harm to your device, if you're doubtful about a certain source, don't use it. Or check it's code on it's respective GitHub repository.

### What are the best source(s) to install? / What source has x manga?

Please don't ask this question, It's highly subjective.  
Just look around on the internet for your manga, see if that site is a source, install that source.

If the source does not exist, you can request it in ⁠requests-v08, no guarantee it'll be made.

Be independent and do some research yourself.

### Is there any copyrighted material hosted?

Yes and no. We ourselves do not host anything!

Sources are just scripts to pull information from sites that do host these items. Sources themselves do not have any copyrighted material, the websites they access may do.

This site & the discord server are in no way affiliated with any of those websites, the discord server serves as a central point to get these "scripts" aka sources.

### Why has my request for a source not been added yet?

Source requests are never certain to be added or created.

The channel is there for a source developer to see which source the community wants. It's purely an indication for source developers.

If you want your source to be added, the best chance you have is:

- Do it yourself.
- Know someone who knows web scraping and JS/TS, ask them to do it.
- Request a site/source that is original, not a generic manga/manhua site.

\*Most manga/manhwa or alike are already available on other sources, making a whole source just because you don't want to wait 1 hour for another site to pick it up is not worth it for most developers.

Since we have only a few source developers and most of them are English, foreign sources are unlikely to be added.

## Individual Extensions

### How do I remove scans in other languages? - Bato.To or MangaPlus

- At the top of the menu bar, Tap the cog to open Settings

<p align= "center"><img src="/v0.9/settings-cog.avif" alt="Settings Cog" width="300"></p>

- Tap Extensions

<p align= "center"><img src="/v0.9/settings-extensions.avif" alt="Settings - Extensions" width="300"></p>

- Tap the extension whose language settings you wish to adjust
- Settings
- Languages
- Then select the language/s you wish to read. A tick will appear next to them.

### How do I remove scans in other languages? - MangaDex or MangaFire

<p align= "center"><img src="/v0.9/settings-cog.avif" alt="Settings Cog" width="300"></p>

- Tap Extensions

<p align= "center"><img src="/v0.9/settings-extensions.avif" alt="Settings - Extensions" width="300"></p>

- Tap the extension whose language settings you wish to adjust
- Settings
- Content Settings
- Languages

### MangaDex - Some titles/chapters that are available on the site are not showing in paperback

There are two common reasons for this -

1. MangaDex extension Content Filtering
2. The chapters of a title are not hosted on MangaDex, just linked

To change MangaDex Content Filtering

- Tap Cog to open Settings > Extensions > MangaDex > Settings > Content Settings > Content Rating

How to tell if the
title is not hosted on MangaDex

- Open the title in Paperback
- There will be an error msg stating

> An error occurred  
> A Javascript error occurred: Chapters are hosted externally outside MangaDex, you'll need to use another source or read it online.

### MangaBox themed sites (eg Manganato, Mangakakalot, MangaBat) have gaps or splits on the displayed pages

- The site owners switched from paged chapters to now just long strips and because of this they are now cropping images in random sizes.
- The only available fix currently is just to read chapters Vertically with no page padding.
- Reading horizontal manga horizontally will not work properly for these sites. It is not something that can be resolved at an extension level.
