/* SPDX-License-Identifier: GPL-3.0-or-later */
/* Copyright © 2025 Inkdex */

import { computed, ref, type Ref } from "vue";
import { normalizeLanguageTag, type Extension } from "../lib/extensions";

export const useAvailableData = (extensions: Ref<Extension[]>) => {
  // Cache for computed values to avoid recalculation
  const cachedLanguages = ref<string[]>([]);
  const cachedLabels = ref<string[]>([]);
  const lastLanguagesHash = ref<string>("");
  const lastLabelsHash = ref<string>("");

  // Generate hash for extensions array to detect changes
  const generateExtensionsHash = (exts: Extension[]): string => {
    return exts
      .map((e) => `${e.source}-${e.name}`)
      .sort()
      .join("|");
  };

  // Pre-compute available languages with memoization
  const availableLanguages = computed(() => {
    const currentHash = generateExtensionsHash(extensions.value);

    // Return cached value if extensions haven't changed
    if (
      currentHash === lastLanguagesHash.value &&
      cachedLanguages.value.length > 0
    ) {
      return cachedLanguages.value;
    }

    const languages = new Set<string>();
    extensions.value.forEach((ext) => {
      if (ext.metadata?.language) {
        const normalizedLanguage = normalizeLanguageTag(ext.metadata.language);

        // Use the complete set of valid IETF language tags from the emoji map
        const languageEmojiMap = {
          en: "🇬🇧",
          zh: "🇨🇳",
          hi: "🇮🇳",
          es: "🇪🇸",
          fr: "🇫🇷",
          ar: "🇸🇦",
          bn: "🇧🇩",
          ru: "🇷🇺",
          pt: "🇵🇹",
          ur: "🇵🇰",
          id: "🇮🇩",
          de: "🇩🇪",
          ja: "🇯🇵",
          sw: "🇰🇪",
          mr: "🇮🇳",
          te: "🇮🇳",
          tr: "🇹🇷",
          ta: "🇮🇳",
          ko: "🇰🇷",
          vi: "🇻🇳",
          it: "🇮🇹",
          th: "🇹🇭",
          gu: "🇮🇳",
          fa: "🇮🇷",
          pl: "🇵🇱",
          uk: "🇺🇦",
          ml: "🇮🇳",
          kn: "🇮🇳",
          or: "🇮🇳",
          my: "🇲🇲",
          pa: "🇮🇳",
          nl: "🇳🇱",
          ro: "🇷🇴",
          hu: "🇭🇺",
          el: "🇬🇷",
          cs: "🇨🇿",
          sv: "🇸🇪",
          fi: "🇫🇮",
          da: "🇩🇰",
          no: "🇳🇴",
          he: "🇮🇱",
          sk: "🇸🇰",
          bg: "🇧🇬",
          hr: "🇭🇷",
          sr: "🇷🇸",
          lt: "🇱🇹",
          sl: "🇸🇮",
          et: "🇪🇪",
          lv: "🇱🇻",
        };

        const validTags = new Set(Object.keys(languageEmojiMap));
        validTags.add("multi"); // Add multi as a special case

        // Add valid IETF tags, but allow non-matches to show as-is
        if (validTags.has(normalizedLanguage)) {
          languages.add(normalizedLanguage);
        } else {
          // For non-matching tags, add the original language string as-is
          if (ext.metadata.language && ext.metadata.language.trim()) {
            languages.add(ext.metadata.language);
          }
        }
      }
    });

    const sortedLanguages = Array.from(languages).sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();

      // Multi always first
      if (aLower === "multi") return -1;
      if (bLower === "multi") return 1;

      // Define valid IETF language tags
      const validIETFTags = new Set([
        "en",
        "es",
        "fr",
        "de",
        "it",
        "pt",
        "ru",
        "ja",
        "zh",
        "ko",
        "ar",
        "tr",
        "pl",
        "nl",
        "id",
        "th",
        "vi",
        "hi",
        "bn",
        "ur",
        "sw",
        "mr",
        "te",
        "ta",
        "gu",
        "fa",
        "uk",
        "ml",
        "kn",
        "or",
        "my",
        "pa",
        "ro",
        "hu",
        "el",
        "cs",
        "sv",
        "fi",
        "da",
        "no",
        "he",
        "sk",
        "bg",
        "hr",
        "sr",
        "lt",
        "sl",
        "et",
        "lv",
      ]);

      // Check if A is valid IETF and B is not
      const aIsIETF = validIETFTags.has(aLower);
      const bIsIETF = validIETFTags.has(bLower);

      if (aIsIETF && !bIsIETF) return -1;
      if (!aIsIETF && bIsIETF) return 1;

      // If both are IETF or both are non-IETF, sort alphabetically
      return a.localeCompare(b);
    });

    // Cache the result
    cachedLanguages.value = sortedLanguages;
    lastLanguagesHash.value = currentHash;

    return sortedLanguages;
  });

  // Pre-compute available labels with memoization
  const availableLabels = computed(() => {
    const currentHash = generateExtensionsHash(extensions.value);

    // Return cached value if extensions haven't changed
    if (currentHash === lastLabelsHash.value && cachedLabels.value.length > 0) {
      return cachedLabels.value;
    }

    const labels = new Set<string>();
    extensions.value.forEach((ext) => {
      if (ext.metadata?.badges) {
        ext.metadata.badges.forEach((badge) => {
          if (badge.label && badge.label.trim()) {
            labels.add(badge.label);
          }
        });
      }
    });

    const sortedLabels = Array.from(labels).sort();

    // Cache the result
    cachedLabels.value = sortedLabels;
    lastLabelsHash.value = currentHash;

    return sortedLabels;
  });

  // Function to manually invalidate cache when needed
  const invalidateCache = () => {
    lastLanguagesHash.value = "";
    lastLabelsHash.value = "";
    cachedLanguages.value = [];
    cachedLabels.value = [];
  };

  return {
    availableLanguages,
    availableLabels,
    invalidateCache,
  };
};
