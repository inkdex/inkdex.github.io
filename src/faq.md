<!-- SPDX-License-Identifier: GPL-3.0-or-later -->
<!-- Copyright © 2025 Inkdex -->

# Frequently Asked Questions (FAQ)

## General

### I have blurred covers with a letter (eg U) on them

This is due to your Content Settings. See [Content Settings](guides/content-settings.md)

<p align= "center"><img src="/v0.9/content-settings-blurred-with-u-m.avif" alt="Blurred Covers" width="300"></p>

### How do I find what version of Paperback I'm using?

- At the top of the menu bar, Tap the cog to open Settings

<p align= "center"><img src="/v0.9/settings-cog.avif" alt="Settings Cog" width="300"></p>

- The version number can be found above the menus. The version number will be for example v0.9-r21

<p align= "center"><img src="/v0.9/paperback-version.avif" alt="Paperback Version" width="300"></p>

### How do I find the extension version?

- At the top of the menu bar, Tap the cog to open Settings

<p align= "center"><img src="/v0.9/settings-cog.avif" alt="Settings Cog" width="300"></p>

- Tap Extensions

<p align= "center"><img src="/v0.9/settings-extensions.avif" alt="Settings - Extensions" width="300"></p>

- **Loaded Extensions** will be displayed with the version number underneath the Extension name.

<p align= "center"><img src="/v0.9/settings-loaded-extensions.avif" alt="Settings - Loaded Extensions" width="300"></p>

### Are there any Western Comic extensions?

- Currently there are Batcave, ReadAllComics, ReadComicsOnlineRu
  Found here - https://karrot0.github.io/KakarotExtension/0.9/stable/

### Is there an extension for x site

link to come

### How do I filter other scans out on Aggregate sites (eg MangaDex)?

> [!NOTE]
> Some titles may have several scanlation groups translating them as well as an official version. Certain sites make all these available, leading there to be multiple versions of the same chapter. For example Chapter 1 may have an Official version, an asurascans version and a Flame Scans version.

- In the individual title (eg Solo Leveling), open it so the chapter list is displaying
- Tap on the _ellipsis (...)_

<p align= "center"><img src="/v0.9/ellipsis-within-chapter-listing.avif" alt="Chapter listing ellipsis" width="300"></p>

- Select _Manage Version Priority_

<p align= "center"><img src="/v0.9/ellipsis-menu-pop-up.avif" alt="ellipsis menu pop up" width="300"></p>

- A popup titled **Title Settings** will open

<p align= "center"><img src="/v0.9/title-settings.avif" alt="Title Settings popup" width="300"></p>

- In the section titled **AVAILABLE VERSIONS** tap one or more listings, which will move them up to the **PRIORITISED VERSIONS**

<p align= "center"><img src="/v0.9/prioritised-versions.avif" alt="Title Settings - PRIORITISED VERSIONS" width="300"></p>

- If you have more than one listing in **PRIORITISED VERSIONS**, hold press on the hamburger and drag to reorder, with highest priority first, second priority second etc

<p align= "center"><img src="/v0.9/prioritised-versions-sorted.avif" alt="Title Settings - PRIORITISED VERSIONS sorted" width="300"></p>

If you enable the setting **Hide Other Versions** it will only display those listed in **PRIORITISED VERSIONS**. It will display another group only if those in **PRIORITISED VERSIONS** do not have a chapter available. May need to exit out of the title & go back into it for the chapters to refresh.

<p align= "center"><img src="/v0.9/hide-other-versions-enabled.avif" alt="Hide Other Versions enabled" width="300"></p>

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
