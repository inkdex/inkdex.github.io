/* SPDX-License-Identifier: GPL-3.0-or-later */
/* Copyright © 2025 Inkdex */

import { watch, type Ref } from "vue";
import type { CustomRepository, Extension } from "../lib/extensions";
import { CONTENT_RATINGS } from "../lib/uiUtils";

export interface UrlSyncState {
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
  selectedExtensions: Ref<Set<string>>;
  showOnlySelected: Ref<boolean>;
  selectedExtension: Ref<Extension | null>;
  showDetails: Ref<boolean>;
  badgeFilterMode: Ref<"or" | "and">;
  serviceFilterMode: Ref<"or" | "and">;
}

export const useUrlSync = (
  state: UrlSyncState,
  customRepos: Ref<CustomRepository[]>,
  availableLanguages: Ref<string[]>,
  availableLabels: Ref<string[]>,
) => {
  // Parse URL parameters on mount
  const parseUrlParams = () => {
    if (typeof window === "undefined") return;

    const urlParams = new URLSearchParams(window.location.search);

    // Parse search query
    const searchParam = urlParams.get("s");
    if (searchParam) {
      state.searchQuery.value = searchParam.toLowerCase();
    }

    // Parse only show selected flag
    const ossParam = urlParams.get("oss");
    if (ossParam === "true") {
      state.showOnlySelected.value = true;
    }

    // Parse selected extensions
    const selectedParam = urlParams.get("sel");
    if (selectedParam) {
      const extensionIds = decodeURIComponent(selectedParam)
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id.length > 0);
      state.selectedExtensions.value = new Set(extensionIds);
    }

    // Parse content rating filters
    const ratingParam = urlParams.get("cr");
    if (ratingParam) {
      const validRatings = new Set(CONTENT_RATINGS);
      const providedRatings = ratingParam
        .split(",")
        .map((rating) => rating.toUpperCase())
        .filter((rating) =>
          validRatings.has(rating as (typeof CONTENT_RATINGS)[number]),
        );
      state.selectedRatings.value = new Set(providedRatings);
    }

    const notRatingParam = urlParams.get("ncr");
    if (notRatingParam) {
      const validRatings = new Set(CONTENT_RATINGS);
      const providedRatings = notRatingParam
        .split(",")
        .map((rating) => rating.toUpperCase())
        .filter((rating) =>
          validRatings.has(rating as (typeof CONTENT_RATINGS)[number]),
        );
      state.negatedRatings.value = new Set(providedRatings);
    }

    // Parse service filters
    const serviceParam = urlParams.get("svc");
    if (serviceParam) {
      const validServices = new Set([
        "Content Service",
        "Tracker Service",
        "Cloudflare",
      ]);
      const providedServices = serviceParam
        .split(",")
        .map((service) => {
          // Convert from lowercase-with-dashes to original format
          return service
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        })
        .filter((service) => validServices.has(service));
      state.selectedServices.value = new Set(providedServices);
    }

    const notServiceParam = urlParams.get("nsvc");
    if (notServiceParam) {
      const validServices = new Set([
        "Content Service",
        "Tracker Service",
        "Cloudflare",
      ]);
      const providedServices = notServiceParam
        .split(",")
        .map((service) => {
          // Convert from lowercase-with-dashes to original format
          return service
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        })
        .filter((service) => validServices.has(service));
      providedServices.forEach((service) => {
        if (!state.selectedServices.value.has(service)) {
          state.negatedServices.value.add(service);
        }
      });
    }

    // Parse language filters
    const langParam = urlParams.get("l");
    if (langParam) {
      const allAvailableLanguages = new Set(availableLanguages.value);
      const providedLanguages = langParam
        .split(",")
        .filter((lang) => allAvailableLanguages.has(lang));
      state.selectedLanguages.value = new Set(providedLanguages);
    }

    const notLangParam = urlParams.get("nl");
    if (notLangParam) {
      const allAvailableLanguages = new Set(availableLanguages.value);
      const providedLanguages = notLangParam
        .split(",")
        .filter((lang) => allAvailableLanguages.has(lang));
      providedLanguages.forEach((lang) => {
        if (!state.selectedLanguages.value.has(lang)) {
          state.negatedLanguages.value.add(lang);
        }
      });
    }

    // Parse badge filters
    const badgeParam = urlParams.get("b");
    if (badgeParam) {
      const allAvailableBadges = new Set(availableLabels.value);
      // Properly decode URL parameter to handle special characters
      const providedBadges = decodeURIComponent(badgeParam)
        .split(",")
        .map((badge) => badge.trim())
        .filter((badge) => badge.length > 0 && allAvailableBadges.has(badge));
      state.selectedLabels.value = new Set(providedBadges);
    }

    const notBadgeParam = urlParams.get("nb");
    if (notBadgeParam) {
      const allAvailableBadges = new Set(availableLabels.value);
      // Properly decode URL parameter to handle special characters
      const providedBadges = decodeURIComponent(notBadgeParam)
        .split(",")
        .map((badge) => badge.trim())
        .filter((badge) => badge.length > 0 && allAvailableBadges.has(badge));
      providedBadges.forEach((badge) => {
        if (!state.selectedLabels.value.has(badge)) {
          state.negatedLabels.value.add(badge);
        }
      });
    }

    // Parse source (repository) filters
    const sourceParam = urlParams.get("r");
    if (sourceParam) {
      const providedSources = sourceParam
        .split(",")
        .map((source) => source.trim())
        .filter((source) => source.length > 0);
      state.selectedSources.value = new Set(providedSources);
    }

    const notSourceParam = urlParams.get("nr");
    if (notSourceParam) {
      const providedSources = notSourceParam
        .split(",")
        .map((source) => source.trim())
        .filter((source) => source.length > 0);
      providedSources.forEach((source) => {
        if (!state.selectedSources.value.has(source)) {
          state.negatedSources.value.add(source);
        }
      });
    }

    // Conflict resolution: remove negated filters that conflict with selected ones
    const removeConflicts = (
      selected: Ref<Set<string>>,
      negated: Ref<Set<string>>,
    ) => {
      for (const item of selected.value) {
        negated.value.delete(item);
      }
    };

    removeConflicts(state.selectedRatings, state.negatedRatings);
    removeConflicts(state.selectedLanguages, state.negatedLanguages);
    removeConflicts(state.selectedLabels, state.negatedLabels);
    removeConflicts(state.selectedServices, state.negatedServices);
    removeConflicts(state.selectedSources, state.negatedSources);

    // Parse badge filter mode
    const badgeModeParam = urlParams.get("bm");
    if (badgeModeParam === "and" || badgeModeParam === "or") {
      state.badgeFilterMode.value = badgeModeParam;
    }

    // Parse service filter mode
    const serviceModeParam = urlParams.get("sm");
    if (serviceModeParam === "and" || serviceModeParam === "or") {
      state.serviceFilterMode.value = serviceModeParam;
    }
  };

  // Update URL parameters when state changes
  const updateUrlParams = () => {
    if (typeof window === "undefined") return;

    const urlParams = new URLSearchParams();

    // Add positive source filters (selected repositories) - use IDs only
    if (state.selectedSources.value.size > 0) {
      const repoIds = Array.from(state.selectedSources.value);
      urlParams.set("r", repoIds.join(","));
    }

    // Add negated source filters - use IDs only
    if (state.negatedSources.value.size > 0) {
      const repoIds = Array.from(state.negatedSources.value);
      urlParams.set("nr", repoIds.join(","));
    }

    // Add ar parameter with URLs for non-inkdex repos in r and nr
    const nonInkdexRepos = new Set(
      [...state.selectedSources.value, ...state.negatedSources.value].filter(
        (id) => id !== "inkdex",
      ),
    );

    if (nonInkdexRepos.size > 0) {
      const arUrls: string[] = [];
      for (const repoId of nonInkdexRepos) {
        const repo = customRepos.value.find((r) => r.id === repoId);
        if (
          repo &&
          repo.owner &&
          repo.name &&
          repo.owner.length > 0 &&
          repo.name.length > 0
        ) {
          arUrls.push(
            `https://github.com/${repo.owner}/${repo.name}${repo.branch !== "gh-pages" ? `/tree/${repo.branch}` : ""}`,
          );
        }
      }
      if (arUrls.length > 0) {
        urlParams.set("ar", arUrls.join(","));
      }
    }

    // Add search query
    if (state.searchQuery.value) {
      urlParams.set("s", state.searchQuery.value.toLowerCase());
    }

    // Add only show selected flag - maps to showOnlySelected toggle
    if (state.showOnlySelected.value) {
      urlParams.set("oss", "true");
    }

    // Add selected extensions
    if (state.selectedExtensions.value.size > 0) {
      const selectedExtensionIds = Array.from(state.selectedExtensions.value);
      urlParams.set("sel", encodeURIComponent(selectedExtensionIds.join(",")));
    }

    // Add content rating filters
    if (state.selectedRatings.value.size > 0) {
      const ratings = Array.from(state.selectedRatings.value).map((r) =>
        r.toLowerCase(),
      );
      urlParams.set("cr", ratings.join(","));
    }
    if (state.negatedRatings.value.size > 0) {
      const ratings = Array.from(state.negatedRatings.value).map((r) =>
        r.toLowerCase(),
      );
      urlParams.set("ncr", ratings.join(","));
    }

    // Add service filters
    if (state.selectedServices.value.size > 0) {
      const services = Array.from(state.selectedServices.value).map((s) =>
        s.toLowerCase().replace(" ", "-"),
      );
      urlParams.set("svc", services.join(","));
    }
    if (state.negatedServices.value.size > 0) {
      const services = Array.from(state.negatedServices.value).map((s) =>
        s.toLowerCase().replace(" ", "-"),
      );
      urlParams.set("nsvc", services.join(","));
    }

    // Add language filters
    if (state.selectedLanguages.value.size > 0) {
      const allAvailableLanguages = new Set(availableLanguages.value);
      const validLanguages = Array.from(state.selectedLanguages.value).filter(
        (lang) => allAvailableLanguages.has(lang),
      );
      if (validLanguages.length > 0) {
        urlParams.set("l", validLanguages.join(",").toLowerCase());
      }
    }
    if (state.negatedLanguages.value.size > 0) {
      const allAvailableLanguages = new Set(availableLanguages.value);
      const validLanguages = Array.from(state.negatedLanguages.value).filter(
        (lang) => allAvailableLanguages.has(lang),
      );
      if (validLanguages.length > 0) {
        urlParams.set("nl", validLanguages.join(",").toLowerCase());
      }
    }

    // Add badge filters
    if (state.selectedLabels.value.size > 0) {
      const allAvailableBadges = new Set(availableLabels.value);
      const validBadges = Array.from(state.selectedLabels.value).filter(
        (badge) => allAvailableBadges.has(badge),
      );
      if (validBadges.length > 0) {
        // Properly encode special characters for URL
        urlParams.set("b", encodeURIComponent(validBadges.join(",")));
      }
    }
    if (state.negatedLabels.value.size > 0) {
      const allAvailableBadges = new Set(availableLabels.value);
      const validBadges = Array.from(state.negatedLabels.value).filter(
        (badge) => allAvailableBadges.has(badge),
      );
      if (validBadges.length > 0) {
        // Properly encode special characters for URL
        urlParams.set("nb", encodeURIComponent(validBadges.join(",")));
      }
    }

    // Add badge and service filter modes to URL only when filters are present
    if (
      state.selectedLabels.value.size > 0 ||
      state.negatedLabels.value.size > 0
    ) {
      urlParams.set("bm", state.badgeFilterMode.value);
    } else {
      // Remove bm parameter if no badge filters are active
      urlParams.delete("bm");
    }

    if (
      state.selectedServices.value.size > 0 ||
      state.negatedServices.value.size > 0
    ) {
      urlParams.set("sm", state.serviceFilterMode.value);
    } else {
      // Remove sm parameter if no service filters are active
      urlParams.delete("sm");
    }

    // Add modal state to URL
    if (state.showDetails.value && state.selectedExtension.value) {
      const extensionId = `${state.selectedExtension.value.source}-${state.selectedExtension.value.name}`;
      urlParams.set("m", extensionId);
    }

    // Update the URL without reloading the page
    const currentUrl = new URL(window.location.href);
    const newUrl = `${currentUrl.pathname}${urlParams.size > 0 ? `?${urlParams.toString()}` : ""}`;

    // Only update if the URL actually changed
    if (
      currentUrl.search !== `?${urlParams.toString()}` ||
      (urlParams.size === 0 && currentUrl.search !== "")
    ) {
      window.history.replaceState({}, "", newUrl);
    }
  };

  // Watch for state changes to update URL
  watch(
    [
      state.searchQuery,
      state.selectedExtensions,
      state.selectedLanguages,
      state.negatedLanguages,
      state.selectedRatings,
      state.negatedRatings,
      state.selectedLabels,
      state.negatedLabels,
      state.selectedServices,
      state.negatedServices,
      state.selectedSources,
      state.negatedSources,
      state.showOnlySelected,
      state.selectedExtension,
      state.showDetails,
      state.badgeFilterMode,
      state.serviceFilterMode,
    ],
    () => {
      updateUrlParams();
    },
    { deep: true },
  );

  return {
    parseUrlParams,
    updateUrlParams,
  };
};
