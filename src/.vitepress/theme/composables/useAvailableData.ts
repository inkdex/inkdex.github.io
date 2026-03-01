/* SPDX-License-Identifier: GPL-3.0-or-later */
/* Copyright © 2025 Inkdex */

import { computed, ref, type Ref } from "vue";
import { normalizeLanguageTag, type Extension } from "../lib/extensions";
import {
  LANGUAGE_EMOJI_MAP,
  VALID_IETF_LANGUAGE_TAGS,
} from "../lib/languageData";

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

        const validTags = new Set(Object.keys(LANGUAGE_EMOJI_MAP));
        validTags.add("multi");

        if (validTags.has(normalizedLanguage)) {
          languages.add(normalizedLanguage);
        } else {
          if (ext.metadata.language && ext.metadata.language.trim()) {
            languages.add(ext.metadata.language);
          }
        }
      }
    });

    const sortedLanguages = Array.from(languages).sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();

      if (aLower === "multi") return -1;
      if (bLower === "multi") return 1;

      const aIsIETF = VALID_IETF_LANGUAGE_TAGS.has(aLower);
      const bIsIETF = VALID_IETF_LANGUAGE_TAGS.has(bLower);

      if (aIsIETF && !bIsIETF) return -1;
      if (!aIsIETF && bIsIETF) return 1;

      return a.localeCompare(b);
    });

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
