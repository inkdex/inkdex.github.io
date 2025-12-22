/* SPDX-License-Identifier: GPL-3.0-or-later */
/* Copyright © 2025 Inkdex */

import { computed, ref, watch, type Ref } from "vue";
import type { Extension } from "../lib/extensions";
import {
  hasChapterProviding,
  hasCloudflareBypassProviding,
  hasMangaProgressProviding,
} from "../lib/extensions";
import { CONTENT_RATINGS } from "../lib/uiUtils";

export interface FilterState {
  searchQuery: Ref<string>;
  selectedRatings: Ref<Set<string>>;
  negatedRatings: Ref<Set<string>>;
  selectedLanguages: Ref<Set<string>>;
  negatedLanguages: Ref<Set<string>>;
  selectedLabels: Ref<Set<string>>;
  negatedLabels: Ref<Set<string>>;
  selectedServices: Ref<Set<string>>;
  negatedServices: Ref<Set<string>>;
  selectedSources: Ref<Set<string>>;
  negatedSources: Ref<Set<string>>;
  badgeFilterMode: Ref<"or" | "and">;
  serviceFilterMode: Ref<"or" | "and">;
}

// Simple debounce function for search performance
const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const useFilters = (extensions: Ref<Extension[]>) => {
  // Filter state
  const searchQuery = ref("");
  const debouncedSearchQuery = ref("");

  // Debounced search update (300ms delay)
  const updateDebouncedSearch = debounce((query: string) => {
    debouncedSearchQuery.value = query;
  }, 300);
  const selectedRatings = ref<Set<string>>(new Set());
  const negatedRatings = ref<Set<string>>(new Set());
  const selectedLanguages = ref<Set<string>>(new Set());
  const negatedLanguages = ref<Set<string>>(new Set());
  const selectedLabels = ref<Set<string>>(new Set());
  const negatedLabels = ref<Set<string>>(new Set());
  const selectedServices = ref<Set<string>>(new Set());
  const negatedServices = ref<Set<string>>(new Set());
  const selectedSources = ref<Set<string>>(new Set());
  const negatedSources = ref<Set<string>>(new Set());
  const badgeFilterMode = ref<"or" | "and">("or");
  const serviceFilterMode = ref<"or" | "and">("or");

  // Available options computed from extensions
  const availableRatings = [...CONTENT_RATINGS];
  const availableServices = [
    "Content Service",
    "Tracker Service",
    "Cloudflare",
  ];

  // Memoized filter criteria for performance
  const matchesSearch = computed(() => {
    const query = debouncedSearchQuery.value.toLowerCase();
    return (extension: Extension) => {
      if (!query) return true;
      return (
        extension.name.toLowerCase().includes(query) ||
        extension.source.toLowerCase().includes(query) ||
        (extension.metadata?.description &&
          extension.metadata.description.toLowerCase().includes(query)) ||
        (extension.metadata?.badges &&
          extension.metadata.badges.some((badge) =>
            badge.label.toLowerCase().includes(query),
          ))
      );
    };
  });

  const matchesRating = computed(() => {
    return (extension: Extension) => {
      return (
        (selectedRatings.value.size === 0 ||
          (extension.metadata?.contentRating &&
            selectedRatings.value.has(extension.metadata.contentRating))) &&
        !(
          extension.metadata?.contentRating &&
          negatedRatings.value.has(extension.metadata.contentRating)
        )
      );
    };
  });

  const matchesSource = computed(() => {
    return (extension: Extension) => {
      return (
        (selectedSources.value.size === 0 ||
          selectedSources.value.has(extension.source)) &&
        !negatedSources.value.has(extension.source)
      );
    };
  });

  const matchesLanguage = computed(() => {
    return (extension: Extension) => {
      return (
        (selectedLanguages.value.size === 0 ||
          (extension.metadata?.language &&
            selectedLanguages.value.has(extension.metadata.language))) &&
        !(
          extension.metadata?.language &&
          negatedLanguages.value.has(extension.metadata.language)
        )
      );
    };
  });

  const matchesLabel = computed(() => {
    return (extension: Extension) => {
      return (
        (selectedLabels.value.size === 0 ||
          (extension.metadata?.badges &&
            (badgeFilterMode.value === "or"
              ? extension.metadata.badges.some((badge) =>
                  selectedLabels.value.has(badge.label),
                )
              : Array.from(selectedLabels.value).every((label) =>
                  extension.metadata?.badges?.some(
                    (badge) => badge.label === label,
                  ),
                )))) &&
        !Array.from(negatedLabels.value).some(
          (label) =>
            extension.metadata?.badges &&
            extension.metadata.badges.some((badge) => badge.label === label),
        )
      );
    };
  });

  const matchesService = computed(() => {
    return (extension: Extension) => {
      return (
        (selectedServices.value.size === 0 ||
          (extension.metadata?.capabilities &&
            (serviceFilterMode.value === "and"
              ? Array.from(selectedServices.value).every((service) => {
                  if (!extension.metadata?.capabilities) return false;
                  if (service === "Content Service")
                    return hasChapterProviding(extension.metadata.capabilities);
                  if (service === "Tracker Service")
                    return hasMangaProgressProviding(
                      extension.metadata.capabilities,
                    );
                  if (service === "Cloudflare")
                    return hasCloudflareBypassProviding(
                      extension.metadata.capabilities,
                    );
                  return false;
                })
              : Array.from(selectedServices.value).some((service) => {
                  if (!extension.metadata?.capabilities) return false;
                  if (service === "Content Service")
                    return hasChapterProviding(extension.metadata.capabilities);
                  if (service === "Tracker Service")
                    return hasMangaProgressProviding(
                      extension.metadata.capabilities,
                    );
                  if (service === "Cloudflare")
                    return hasCloudflareBypassProviding(
                      extension.metadata.capabilities,
                    );
                  return false;
                })))) &&
        !Array.from(negatedServices.value).some((service) => {
          if (!extension.metadata?.capabilities) return false;
          if (service === "Content Service")
            return hasChapterProviding(extension.metadata.capabilities);
          if (service === "Tracker Service")
            return hasMangaProgressProviding(extension.metadata.capabilities);
          if (service === "Cloudflare")
            return hasCloudflareBypassProviding(
              extension.metadata.capabilities,
            );
          return false;
        })
      );
    };
  });

  // Main filtered extensions computed property
  const filteredExtensions = computed(() => {
    return extensions.value.filter((extension) => {
      return (
        matchesSearch.value(extension) &&
        matchesRating.value(extension) &&
        matchesSource.value(extension) &&
        matchesLanguage.value(extension) &&
        matchesLabel.value(extension) &&
        matchesService.value(extension)
      );
    });
  });

  // Three-state toggle functions
  const createToggleFunction = (
    selected: Ref<Set<string>>,
    negated: Ref<Set<string>>,
  ) => {
    return (value: string) => {
      if (selected.value.has(value)) {
        selected.value.delete(value);
        negated.value.add(value);
      } else if (negated.value.has(value)) {
        negated.value.delete(value);
      } else {
        selected.value.add(value);
      }
      // Force reactivity
      selected.value = new Set(selected.value);
      negated.value = new Set(negated.value);
    };
  };

  const toggleRating = createToggleFunction(selectedRatings, negatedRatings);
  const toggleLanguage = createToggleFunction(
    selectedLanguages,
    negatedLanguages,
  );
  const toggleLabel = createToggleFunction(selectedLabels, negatedLabels);
  const toggleService = createToggleFunction(selectedServices, negatedServices);
  const toggleSource = createToggleFunction(selectedSources, negatedSources);

  // Clear all filters
  const clearAllFilters = () => {
    selectedLanguages.value = new Set();
    negatedLanguages.value = new Set();
    selectedLabels.value = new Set();
    negatedLabels.value = new Set();
    selectedRatings.value = new Set();
    negatedRatings.value = new Set();
    selectedServices.value = new Set();
    negatedServices.value = new Set();
    selectedSources.value = new Set();
    negatedSources.value = new Set();
  };

  // Clear content filters only (not repository source filters)
  const clearContentFilters = () => {
    selectedLanguages.value = new Set();
    negatedLanguages.value = new Set();
    selectedLabels.value = new Set();
    negatedLabels.value = new Set();
    selectedRatings.value = new Set();
    negatedRatings.value = new Set();
    selectedServices.value = new Set();
    negatedServices.value = new Set();
  };

  // Watch for search query changes and update debounced value
  watch(searchQuery, (newQuery) => {
    updateDebouncedSearch(newQuery);
  });

  // Clear search and all filters
  const clearSearch = () => {
    searchQuery.value = "";
    debouncedSearchQuery.value = "";
    clearAllFilters();
  };

  const toggleBadgeMode = () => {
    badgeFilterMode.value = badgeFilterMode.value === "or" ? "and" : "or";
  };

  const toggleServiceMode = () => {
    serviceFilterMode.value = serviceFilterMode.value === "or" ? "and" : "or";
  };

  // Computed property for active filter count (excluding repository/source filters)
  const activeFilterCount = computed(() => {
    return (
      selectedRatings.value.size +
      negatedRatings.value.size +
      selectedLanguages.value.size +
      negatedLanguages.value.size +
      selectedLabels.value.size +
      negatedLabels.value.size +
      selectedServices.value.size +
      negatedServices.value.size
    );
  });

  // Check if any filters are active
  const hasActiveFilters = computed(() => {
    return (
      activeFilterCount.value > 0 || debouncedSearchQuery.value.trim() !== ""
    );
  });

  return {
    // State
    searchQuery,
    debouncedSearchQuery,
    selectedRatings,
    negatedRatings,
    selectedLanguages,
    negatedLanguages,
    selectedLabels,
    negatedLabels,
    selectedServices,
    negatedServices,
    selectedSources,
    negatedSources,
    badgeFilterMode,
    serviceFilterMode,

    // Computed
    availableRatings,
    availableServices,
    filteredExtensions,
    activeFilterCount,
    hasActiveFilters,

    // Methods
    toggleRating,
    toggleLanguage,
    toggleLabel,
    toggleService,
    toggleSource,
    toggleBadgeMode,
    toggleServiceMode,
    clearAllFilters,
    clearContentFilters,
    clearSearch,
  };
};
