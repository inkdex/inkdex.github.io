<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import ExtensionCard from "./ExtensionCard.vue";
import ExtensionDetails from "./ExtensionDetails.vue";
import FilterPanel from "./FilterPanel.vue";
import NotificationPanel from "./NotificationPanel.vue";
import RepositoryManager from "./RepositoryManager.vue";
import "./ExtensionList.css";
import { useAvailableData } from "../composables/useAvailableData";
import { useFilters } from "../composables/useFilters";
import { useNotifications } from "../composables/useNotifications";
import { useUrlSync } from "../composables/useUrlSync";
import {
  buildBaseUrl,
  getLanguageEmoji,
  getLanguageName,
  saveCustomRepos as saveRepos,
  useExtensions,
  type Extension,
} from "../lib/extensions";
import { CONTENT_RATINGS, getBadgeColors } from "../lib/uiUtils";

// Core extensions management
const {
  extensions,
  loading,
  error,
  customRepos,
  loadRepos,
  fetchAllExtensions,
  addCustomRepo,
  removeCustomRepo,
} = useExtensions();

// Filters composable
const {
  searchQuery,
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
  availableRatings,
  availableServices,
  filteredExtensions,
  activeFilterCount,
  hasActiveFilters,
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
} = useFilters(extensions);

// Available data composable
const { availableLanguages, availableLabels, invalidateCache } =
  useAvailableData(extensions);

// Negated badges computed from labels
const negatedBadges = computed(() => {
  return availableBadges.value.filter((badge) =>
    Array.from(negatedLabels.value).some(
      (label) => label === (badge as any).label,
    ),
  );
});

// UI state
const selectedExtensions = ref<Set<string>>(new Set());
const selectedExtension = ref<Extension | null>(null);
const showDetails = ref(false);
const showRepoManager = ref(false);
const newRepoUrl = ref("");
const checkingRepo = ref(false);
const filtersExpanded = ref(false);
const showOnlySelected = ref(false);

// Notifications
const { notifications, showSuccess, showError, removeNotification } =
  useNotifications();

// Get all available badges from extensions
const availableBadges = computed(() => {
  const badges = new Set();
  extensions.value.forEach((ext) => {
    if (ext.metadata?.badges) {
      ext.metadata.badges.forEach((badge) => {
        badges.add(badge);
      });
    }
  });
  return Array.from(badges);
});

// Create a map of label names to badge objects for quick lookup
const badgeMap = computed(() => {
  const map = new Map<
    string,
    { textColor: string; backgroundColor: string; label: string }
  >();
  for (const ext of extensions.value) {
    if (ext.metadata?.badges) {
      for (const badge of ext.metadata.badges) {
        if (!map.has(badge.label)) {
          map.set(badge.label, {
            label: badge.label,
            textColor: badge.textColor,
            backgroundColor: badge.backgroundColor,
          });
        }
      }
    }
  }
  return map;
});

// URL synchronization
const { parseUrlParams } = useUrlSync(
  {
    searchQuery,
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
    selectedExtensions,
    showOnlySelected,
    selectedExtension,
    showDetails,
    badgeFilterMode,
    serviceFilterMode,
  },
  customRepos,
  availableLanguages,
  availableLabels,
);

// Computed properties
const showNSFW = computed(() => {
  return (
    selectedRatings.value.has("MATURE") || selectedRatings.value.has("ADULT")
  );
});

const visibleButtonCount = computed(() => {
  // Count is: always visible buttons (Filters, Repositories, Share) + conditionally visible button (Only Show Selected)
  let count = 3; // Filters, Repositories, Share are always shown
  if (selectedExtensions.value.size > 0) {
    count++; // Only Show Selected is visible
  }
  return count;
});

const hasAnyActiveFilters = computed(() => {
  return (
    hasActiveFilters.value ||
    selectedSources.value.size > 0 ||
    negatedSources.value.size > 0
  );
});

const totalButtonCount = computed(() => {
  // Count is: always visible buttons (Filters, Repositories, Share) + conditionally visible button (Only Show Selected)
  let count = 3; // Filters, Repositories, Share are always shown
  if (selectedExtensions.value.size > 0) {
    count++; // Only Show Selected is visible
  }
  return count;
});

const handleAddRepo = async () => {
  if (!newRepoUrl.value.trim()) {
    showError("Invalid URL", "Please enter a repository URL");
    return;
  }

  checkingRepo.value = true;

  try {
    const result = await addCustomRepo(newRepoUrl.value);

    if (!result.success) {
      // Silently fail if repository is already added
      if (result.error?.includes("already added")) {
        newRepoUrl.value = "";
        checkingRepo.value = false;
        return;
      }
      showError("Failed to Add Repository", result.error || "Unknown error");
      checkingRepo.value = false;
      return;
    }

    showSuccess(
      "Repository Added",
      `${newRepoUrl.value} has been added successfully`,
    );
    newRepoUrl.value = "";

    // Fetch extensions dynamically without showing loading spinner
    await fetchAllExtensions(false);

    // Invalidate cache to refresh available languages and labels after extensions are updated
    invalidateCache();
    checkingRepo.value = false;
  } catch (e) {
    showError("Error", "An error occurred while adding repository");
    console.error(e);
    checkingRepo.value = false;
  }
};

const handleToggleSource = (source: string) => {
  toggleSource(source);
};

const handleClearSourceFilters = () => {
  selectedSources.value = new Set();
  negatedSources.value = new Set();
};

const handleRemoveRepo = async (repoId: string) => {
  // Clean up any source filters for this repo
  selectedSources.value.delete(repoId);
  negatedSources.value.delete(repoId);

  await removeCustomRepo(repoId);

  // Clean up filters that depend on extensions from this repository
  // Get extensions that were from this repo before removal
  const removedExtensions = extensions.value.filter(
    (ext) => ext.source === repoId,
  );

  if (removedExtensions.length > 0) {
    // Clean up language filters that were only from this repo
    const languagesInRemovedExtensions = new Set<string>();
    const labelsInRemovedExtensions = new Set<string>();

    removedExtensions.forEach((ext) => {
      if (ext.metadata?.language) {
        languagesInRemovedExtensions.add(ext.metadata.language);
      }
      if (ext.metadata?.badges) {
        ext.metadata.badges.forEach((badge) => {
          if (badge.label) {
            labelsInRemovedExtensions.add(badge.label);
          }
        });
      }
    });

    // Check if any selected languages are no longer available
    const selectedLanguagesToRemove = Array.from(
      selectedLanguages.value,
    ).filter(
      (lang) =>
        languagesInRemovedExtensions.has(lang) &&
        !extensions.value.some(
          (ext) => ext.source !== repoId && ext.metadata?.language === lang,
        ),
    );

    const selectedLabelsToRemove = Array.from(selectedLabels.value).filter(
      (label) =>
        labelsInRemovedExtensions.has(label) &&
        !extensions.value.some(
          (ext) =>
            ext.source !== repoId &&
            ext.metadata?.badges?.some((badge) => badge.label === label),
        ),
    );

    // Check if any negated languages are no longer available
    const negatedLanguagesToRemove = Array.from(negatedLanguages.value).filter(
      (lang) =>
        languagesInRemovedExtensions.has(lang) &&
        !extensions.value.some(
          (ext) => ext.source !== repoId && ext.metadata?.language === lang,
        ),
    );

    const negatedLabelsToRemove = Array.from(negatedLabels.value).filter(
      (label) =>
        labelsInRemovedExtensions.has(label) &&
        !extensions.value.some(
          (ext) =>
            ext.source !== repoId &&
            ext.metadata?.badges?.some((badge) => badge.label === label),
        ),
    );

    // Remove obsolete filters
    selectedLanguagesToRemove.forEach((lang) =>
      selectedLanguages.value.delete(lang),
    );
    selectedLabelsToRemove.forEach((label) =>
      selectedLabels.value.delete(label),
    );
    negatedLanguagesToRemove.forEach((lang) =>
      negatedLanguages.value.delete(lang),
    );
    negatedLabelsToRemove.forEach((label) => negatedLabels.value.delete(label));
  }

  // Invalidate cache to refresh available languages and labels after extensions are updated
  invalidateCache();
};

const showInstallButton = computed(() => {
  return displayExtensions.value.length > 0;
});

const hasAnyExtensions = computed(() => {
  return extensions.value.length > 0;
});

// Computed property for extensions filtered by both criteria
const displayExtensions = computed(() => {
  let extensionsToDisplay = filteredExtensions.value;

  // Apply "Only Show Selected" filter if active
  if (showOnlySelected.value && selectedExtensions.value.size > 0) {
    extensionsToDisplay = extensionsToDisplay.filter((extension) =>
      selectedExtensions.value.has(`${extension.source}-${extension.name}`),
    );
  }

  return extensionsToDisplay;
});

// Helper functions
const getSourceDisplayName = (sourceId: string) => {
  if (sourceId === "inkdex") return "Inkdex";
  const repo = customRepos.value.find((r) => r.id === sourceId);
  return repo?.displayName || sourceId;
};

const getBaseUrl = (source: string) => {
  if (source === "inkdex") {
    return "https://raw.githubusercontent.com/inkdex/extensions/master/0.9/stable";
  }
  const repo = customRepos.value.find((r) => r.id === source);
  if (repo) {
    return buildBaseUrl(repo);
  }
  return "";
};

// Extension management
const toggleExtension = (extension: Extension) => {
  const key = `${extension.source}-${extension.name}`;
  if (selectedExtensions.value.has(key)) {
    selectedExtensions.value.delete(key);
    if (selectedExtensions.value.size === 0) {
      showOnlySelected.value = false;
    }
  } else {
    selectedExtensions.value.add(key);
  }
};

const showExtensionDetails = (extension: Extension) => {
  selectedExtension.value = extension;
  showDetails.value = true;
};

const hideExtensionDetails = () => {
  showDetails.value = false;
  selectedExtension.value = null;
};

const clearSelectedExtensions = () => {
  selectedExtensions.value = new Set();
  showOnlySelected.value = false;
};

const installSelectedExtensions = () => {
  const extensionsToInstall =
    selectedExtensions.value.size === 0
      ? displayExtensions.value.map((ext) => [ext.name, getBaseUrl(ext.source)])
      : Array.from(selectedExtensions.value)
          .map((key) => {
            const extension = extensions.value.find(
              (ext) => `${ext.source}-${ext.name}` === key,
            );
            if (!extension) return null;
            return [extension.name, getBaseUrl(extension.source)];
          })
          .filter(Boolean);

  if (extensionsToInstall.length === 0) {
    showError("No Extensions", "No extensions available to install");
    return;
  }

  const installUrl = `paperback://installExtensions?data=${btoa(JSON.stringify(extensionsToInstall))}`;
  window.location.href = installUrl;
};

const installExtension = (extension: Extension) => {
  const extensionToInstall = [extension.name, getBaseUrl(extension.source)];
  const installUrl = `paperback://installExtensions?data=${btoa(JSON.stringify([extensionToInstall]))}`;
  window.location.href = installUrl;
};

// Share functionality
const shareFilters = () => {
  const currentUrl = window.location.href;

  navigator.clipboard
    .writeText(currentUrl)
    .then(() => {
      showSuccess("URL Copied", "Share URL copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy URL: ", err);
      // Fallback: Open share dialog if clipboard is not available
      if (navigator.share) {
        navigator.share({
          title: "Inkdex Extension Filters",
          url: currentUrl,
        });
      } else {
        // If both clipboard and web share fail, at least show the URL
        prompt("Copy this URL to share your filters:", currentUrl);
      }
    });
};

// Initialize component
onMounted(async () => {
  if (typeof window === "undefined") return;

  const urlParams = new URLSearchParams(window.location.search);

  // Check if we have any URL filters to determine if we should set default SAFE rating
  const hasAnyUrlFilters =
    urlParams.has("s") ||
    urlParams.has("cr") ||
    urlParams.has("ncr") ||
    urlParams.has("svc") ||
    urlParams.has("nsvc") ||
    urlParams.has("l") ||
    urlParams.has("nl") ||
    urlParams.has("b") ||
    urlParams.has("nb") ||
    urlParams.has("r") ||
    urlParams.has("nr") ||
    urlParams.has("ar") ||
    urlParams.has("sel") ||
    urlParams.has("oss") ||
    urlParams.has("m") ||
    // Note: bm and sm are only relevant when b/nb or svc/nsvc are present
    (urlParams.has("bm") && (urlParams.has("b") || urlParams.has("nb"))) ||
    (urlParams.has("sm") && (urlParams.has("svc") || urlParams.has("nsvc")));

  // Step 1: Load repos and process repositories from URL
  loadRepos();

  // Helper function to add repository from URL
  const addRepoFromUrl = async (repoUrl: string): Promise<boolean> => {
    const trimmedUrl = repoUrl.trim();
    // Skip inkdex as it's always available
    if (trimmedUrl === "inkdex") return true;
    if (trimmedUrl.toLowerCase().includes("inkdex/extensions")) return true;

    const result = await addCustomRepo(trimmedUrl);
    return result.success;
  };

  // Process ar parameter (additional repositories)
  const arParam = urlParams.get("ar");
  if (arParam) {
    try {
      const repoUrls = decodeURIComponent(arParam).split(",");
      for (const repoUrl of repoUrls) {
        const trimmedUrl = repoUrl.trim();
        // Validate URL format before processing
        if (
          trimmedUrl &&
          (trimmedUrl.startsWith("https://github.com/") ||
            /^[^/]+\/[^/]+$/.test(trimmedUrl))
        ) {
          await addRepoFromUrl(trimmedUrl);
        }
      }
    } catch (error) {
      console.warn("Failed to parse ar parameter:", error);
    }
  }

  // Step 2: Parse basic URL parameters that don't depend on extensions
  // Note: Search query, selected extensions, and only show selected flag
  // are now handled by useUrlSync.ts parseUrlParams() function

  // Step 2: Fetch extensions after repositories are set up
  await fetchAllExtensions();

  // Wait for computed properties to update after extensions are loaded
  // Use double nextTick to ensure computed properties fully update with new extension data
  await nextTick();
  await nextTick();

  // Step 3: Use centralized URL parsing from useUrlSync (already instantiated above)

  // Parse all URL parameters using centralized logic
  parseUrlParams();

  // Step 4: Auto-select repositories from ar parameter if no explicit r/nr filters
  const additionalReposParam = urlParams.get("ar");
  if (additionalReposParam && !urlParams.has("r") && !urlParams.has("nr")) {
    const repoUrls = decodeURIComponent(additionalReposParam).split(",");
    const autoSelectRepoIds: string[] = [];

    for (const repoUrl of repoUrls) {
      const trimmedUrl = repoUrl.trim();
      // Skip inkdex as it's always available and shouldn't be auto-selected
      if (trimmedUrl.toLowerCase().includes("inkdex/extensions")) continue;

      // Extract repo ID from URL to match with customRepos
      const match = trimmedUrl.match(/github\.com\/([^/]+)\/([^/?]+)/);
      if (match) {
        const [, owner, name] = match;
        const repoId = `${owner}-${name}`;

        // Check if this repo exists in our custom repos
        if (customRepos.value.some((r) => r.id === repoId)) {
          autoSelectRepoIds.push(repoId);
        }
      }
    }

    // Auto-select repositories from ar parameter
    autoSelectRepoIds.forEach((repoId) => {
      selectedSources.value.add(repoId);
    });

    // Update URL to include auto-selected repositories for consistency
    if (autoSelectRepoIds.length > 0) {
      urlParams.set("r", autoSelectRepoIds.join(","));
    }
  }

  // Step 3: Fetch extensions after repositories are set up
  await fetchAllExtensions();

  // Wait for computed properties to update after extensions are loaded
  await nextTick();

  // Step 4: Parse remaining URL parameters that depend on extensions data
  // Note: Content ratings, services, languages, and badges parsing
  // are now handled by useUrlSync.ts parseUrlParams() function

  // Step 5: Parse filter modes from URL (only when relevant filters are present)
  // Note: Filter modes parsing and conflict resolution are now handled
  // by useUrlSync.ts parseUrlParams() function

  // Step 6: Set default SAFE rating if no filters were present
  if (!hasAnyUrlFilters) {
    selectedRatings.value = new Set([CONTENT_RATINGS[0]]); // SAFE is first rating
  }

  // Step 7: Validate and clean URL parameters after extensions are loaded
  let urlNeedsCleaning = false;

  // Validate selected extensions - remove ones that don't exist
  const validExtensionIds = new Set(
    extensions.value.map((ext) => `${ext.source}-${ext.name}`),
  );
  const invalidSelectedExtensions = Array.from(selectedExtensions.value).filter(
    (id) => !validExtensionIds.has(id),
  );

  if (invalidSelectedExtensions.length > 0) {
    invalidSelectedExtensions.forEach((id) =>
      selectedExtensions.value.delete(id),
    );
    urlNeedsCleaning = true;

    // Clean sel parameter
    const validSelectedIds = Array.from(selectedExtensions.value);
    if (validSelectedIds.length > 0) {
      urlParams.set("sel", encodeURIComponent(validSelectedIds.join(",")));
    } else {
      urlParams.delete("sel");
    }
  }

  // Validate language filters - remove ones that don't exist in available extensions
  const validLanguages = new Set(availableLanguages.value);
  const invalidSelectedLanguages = Array.from(selectedLanguages.value).filter(
    (lang) => !validLanguages.has(lang),
  );
  const invalidNegatedLanguages = Array.from(negatedLanguages.value).filter(
    (lang) => !validLanguages.has(lang),
  );

  if (
    invalidSelectedLanguages.length > 0 ||
    invalidNegatedLanguages.length > 0
  ) {
    invalidSelectedLanguages.forEach((lang) =>
      selectedLanguages.value.delete(lang),
    );
    invalidNegatedLanguages.forEach((lang) =>
      negatedLanguages.value.delete(lang),
    );
    urlNeedsCleaning = true;

    // Clean l parameter
    const validSelectedLangs = Array.from(selectedLanguages.value);
    if (validSelectedLangs.length > 0) {
      urlParams.set("l", validSelectedLangs.join(","));
    } else {
      urlParams.delete("l");
    }

    // Clean nl parameter
    const validNegatedLangs = Array.from(negatedLanguages.value);
    if (validNegatedLangs.length > 0) {
      urlParams.set("nl", validNegatedLangs.join(","));
    } else {
      urlParams.delete("nl");
    }
  }

  // Validate badge filters - remove ones that don't exist in available extensions
  const validBadges = new Set(availableLabels.value);
  const invalidSelectedBadges = Array.from(selectedLabels.value).filter(
    (badge) => !validBadges.has(badge),
  );
  const invalidNegatedBadges = Array.from(negatedLabels.value).filter(
    (badge) => !validBadges.has(badge),
  );

  if (invalidSelectedBadges.length > 0 || invalidNegatedBadges.length > 0) {
    invalidSelectedBadges.forEach((badge) =>
      selectedLabels.value.delete(badge),
    );
    invalidNegatedBadges.forEach((badge) => negatedLabels.value.delete(badge));
    urlNeedsCleaning = true;

    // Clean b parameter
    const validSelectedBadgesList = Array.from(selectedLabels.value);
    if (validSelectedBadgesList.length > 0) {
      urlParams.set("b", validSelectedBadgesList.join(","));
    } else {
      urlParams.delete("b");
    }

    // Clean nb parameter
    const validNegatedBadgesList = Array.from(negatedLabels.value);
    if (validNegatedBadgesList.length > 0) {
      urlParams.set("nb", validNegatedBadgesList.join(","));
    } else {
      urlParams.delete("nb");
    }
  }

  // Validate repository filters - remove ones that don't exist
  const validRepoIds = new Set([
    "inkdex",
    ...customRepos.value.map((r) => r.id),
  ]);
  const invalidSelectedRepos = Array.from(selectedSources.value).filter(
    (id) => !validRepoIds.has(id),
  );
  const invalidNegatedRepos = Array.from(negatedSources.value).filter(
    (id) => !validRepoIds.has(id),
  );

  if (invalidSelectedRepos.length > 0 || invalidNegatedRepos.length > 0) {
    invalidSelectedRepos.forEach((id) => selectedSources.value.delete(id));
    invalidNegatedRepos.forEach((id) => negatedSources.value.delete(id));
    urlNeedsCleaning = true;

    // Clean r parameter
    const validSelectedReposList = Array.from(selectedSources.value);
    if (validSelectedReposList.length > 0) {
      urlParams.set("r", validSelectedReposList.join(","));
    } else {
      urlParams.delete("r");
    }

    // Clean nr parameter
    const validNegatedReposList = Array.from(negatedSources.value);
    if (validNegatedReposList.length > 0) {
      urlParams.set("nr", validNegatedReposList.join(","));
    } else {
      urlParams.delete("nr");
    }
  }

  // Update URL if any invalid parameters were removed
  if (urlNeedsCleaning) {
    const cleanedUrl = urlParams.toString()
      ? `${window.location.pathname}?${urlParams.toString()}`
      : window.location.pathname;
    window.history.replaceState({}, "", cleanedUrl);
  }

  // Step 8: Handle modal parameter after all data is loaded and validated
  const mParam = urlParams.get("m");
  if (mParam && extensions.value.length > 0) {
    const cleanModalId = mParam.trim();
    if (cleanModalId && cleanModalId.includes("-")) {
      const extension = extensions.value.find(
        (ext) => `${ext.source}-${ext.name}` === cleanModalId,
      );

      if (extension) {
        selectedExtension.value = extension;
        showDetails.value = true;
      } else {
        console.warn(`Extension not found for m parameter: ${cleanModalId}`);
        urlParams.delete("m");
        const finalUrl = urlParams.toString()
          ? `${window.location.pathname}?${urlParams.toString()}`
          : window.location.pathname;
        window.history.replaceState({}, "", finalUrl);
      }
    } else {
      console.warn(`Invalid m parameter format: ${mParam}`);
      urlParams.delete("m");
      const finalUrl = urlParams.toString()
        ? `${window.location.pathname}?${urlParams.toString()}`
        : window.location.pathname;
      window.history.replaceState({}, "", finalUrl);
    }
  }
});
</script>

<template>
  <div class="extension-list">
    <div v-if="loading" class="loading">
      <div class="spinner" />
      Loading extensions...
    </div>

    <div v-else-if="error" class="error">
      Error loading extensions: {{ error }}
    </div>

    <div v-else-if="!hasAnyExtensions" class="no-results">
      <div class="no-results-icon">📦</div>
      <h3>No Extensions Found</h3>
      <p>No extensions are available from configured repositories.</p>
    </div>

    <div v-else>
      <!-- Search and Filter Section -->
      <div class="search-section">
        <div class="search-bar">
          <div class="search-input-container">
            <svg
              class="search-icon"
              width="14"
              height="14"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search extensions..."
              class="search-input"
            />
            <button
              v-if="searchQuery"
              class="input-btn btn-secondary clear-search-input-btn"
              title="Clear search"
              @click="searchQuery = ''"
            >
              Clear
            </button>
          </div>
        </div>

        <!-- Unified Action Buttons Row -->
        <div class="filters-row">
          <div class="toggles-group" :class="`btn-count-${totalButtonCount}`">
            <!-- Filters Button -->
            <button
              class="action-btn"
              :class="{ active: filtersExpanded || hasActiveFilters }"
              @click="filtersExpanded = !filtersExpanded"
            >
              <div class="action-btn-content">
                <span class="btn-text">Filters</span>
                <span v-if="activeFilterCount > 0" class="filter-count">{{
                  activeFilterCount
                }}</span>
              </div>
              <span class="expand-icon" :class="{ expanded: filtersExpanded }"
                >▲</span
              >
            </button>

            <!-- Repositories Button -->
            <button
              class="action-btn"
              :class="{
                active:
                  showRepoManager ||
                  selectedSources.size > 0 ||
                  negatedSources.size > 0,
              }"
              @click="showRepoManager = !showRepoManager"
            >
              <div class="action-btn-content">
                <span class="btn-text">Repositories</span>
                <span
                  v-if="selectedSources.size + negatedSources.size > 0"
                  class="filter-count"
                  >{{ selectedSources.size + negatedSources.size }}</span
                >
              </div>
              <span class="expand-icon" :class="{ expanded: showRepoManager }"
                >▲</span
              >
            </button>

            <!-- Only Show Selected Button -->
            <button
              v-if="selectedExtensions.size > 0"
              class="action-btn"
              :class="{ active: showOnlySelected }"
              @click="showOnlySelected = !showOnlySelected"
            >
              <span class="btn-text">Only Show Selected</span>
              <span class="filter-count">{{ selectedExtensions.size }}</span>
            </button>

            <!-- Clear Selected Button -->
            <button
              v-if="selectedExtensions.size > 0"
              class="action-btn"
              @click="clearSelectedExtensions"
            >
              <span class="btn-text">Clear Selected</span>
            </button>

            <!-- Share Button -->
            <button class="action-btn" @click="shareFilters">
              <div class="action-btn-content">
                <span class="btn-text">Share</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Expandable Sections Below Buttons -->
        <FilterPanel
          :filters-expanded="filtersExpanded"
          :available-ratings="availableRatings"
          :available-services="availableServices"
          :available-languages="availableLanguages"
          :available-labels="availableLabels"
          :selected-ratings="selectedRatings"
          :negated-ratings="negatedRatings"
          :selected-languages="selectedLanguages"
          :negated-languages="negatedLanguages"
          :selected-labels="selectedLabels"
          :negated-labels="negatedLabels"
          :selected-services="selectedServices"
          :negated-services="negatedServices"
          :badge-filter-mode="badgeFilterMode"
          :service-filter-mode="serviceFilterMode"
          :extensions="extensions"
          @toggle-filters="filtersExpanded = !filtersExpanded"
          @toggle-rating="toggleRating"
          @toggle-language="toggleLanguage"
          @toggle-label="toggleLabel"
          @toggle-service="toggleService"
          @toggle-badge-mode="toggleBadgeMode"
          @toggle-service-mode="toggleServiceMode"
          @clear-filters="clearContentFilters"
        />

        <!-- Repository Manager Component -->
        <RepositoryManager
          :show-repo-manager="showRepoManager"
          :custom-repos="customRepos"
          :selected-sources="selectedSources"
          :negated-sources="negatedSources"
          :checking-repo="checkingRepo"
          v-model:new-repo-url="newRepoUrl"
          @toggle-repo-manager="showRepoManager = !showRepoManager"
          @add-custom-repo="handleAddRepo"
          @remove-custom-repo="handleRemoveRepo"
          @toggle-source="handleToggleSource"
          @clear-source-filters="handleClearSourceFilters"
        />
      </div>

      <!-- Results Summary -->
      <div class="results-summary">
        <span class="results-count">
          <template v-if="displayExtensions.length === extensions.length">
            Showing {{ extensions.length }} extensions&nbsp;
          </template>
          <template v-else>
            Showing {{ displayExtensions.length }} of
            {{ extensions.length }} extensions&nbsp;
            <span class="hidden-count">
              ({{ extensions.length - displayExtensions.length }} hidden because
              of filters)
            </span>
          </template>
        </span>
        <span v-if="hasAnyActiveFilters" class="active-filters">
          <span v-if="searchQuery" class="filter-tag"
            >Search: "{{ searchQuery }}"</span
          >
          <!-- Selected Filters -->
          <!-- Content Rating -->
          <span
            v-for="rating in selectedRatings"
            :key="`rating-${rating}`"
            class="filter-tag rating-tag"
            :class="`rating-${rating.toLowerCase()}`"
            >{{ rating.charAt(0) + rating.slice(1).toLowerCase() }}</span
          >

          <!-- Services -->
          <span
            v-for="service in selectedServices"
            :key="`service-${service}`"
            class="filter-tag service-tag"
            :class="{
              'service-content': service === 'Content Service',
              'service-tracker': service === 'Tracker Service',
              'service-cloudflare': service === 'Cloudflare',
            }"
            >{{ service }}</span
          >

          <!-- Languages -->
          <span
            v-for="lang in selectedLanguages"
            :key="`lang-${lang}`"
            class="filter-tag language-tag"
          >
            <template v-if="getLanguageEmoji(lang)"
              >{{ getLanguageEmoji(lang) }}&nbsp;</template
            >{{ getLanguageName(lang) }}
          </span>

          <!-- Labels (Badges) -->
          <span
            v-for="label in selectedLabels"
            :key="`label-${label}`"
            class="filter-tag"
            :style="{
              backgroundColor: getBadgeColors(badgeMap.get(label))
                .backgroundColor,
              color: getBadgeColors(badgeMap.get(label)).textColor,
              borderColor: getBadgeColors(badgeMap.get(label)).textColor,
            }"
          >
            {{ label }}
          </span>

          <!-- Repository Filters -->
          <span
            v-for="source in selectedSources"
            :key="`source-${source}`"
            class="filter-tag repository-tag"
          >
            {{ getSourceDisplayName(source) }}
          </span>

          <!-- Negated Filters -->
          <!-- Content Rating -->
          <span
            v-for="rating in negatedRatings"
            :key="`negated-rating-${rating}`"
            class="filter-tag rating-tag negated-tag"
            :class="`rating-${rating.toLowerCase()}`"
          >
            {{ rating.charAt(0) + rating.slice(1).toLowerCase() }}
          </span>

          <!-- Services -->
          <span
            v-for="service in negatedServices"
            :key="`negated-service-${service}`"
            class="filter-tag service-tag negated-tag"
            :class="{
              'service-content': service === 'Content Service',
              'service-tracker': service === 'Tracker Service',
              'service-cloudflare': service === 'Cloudflare',
            }"
          >
            {{ service }}
          </span>

          <!-- Languages -->
          <span
            v-for="lang in negatedLanguages"
            :key="`negated-lang-${lang}`"
            class="filter-tag language-tag negated-tag"
          >
            <template v-if="getLanguageEmoji(lang)"
              >{{ getLanguageEmoji(lang) }}&nbsp;</template
            >{{ getLanguageName(lang) }}
          </span>

          <!-- Labels (Badges) -->
          <span
            v-for="label in negatedLabels"
            :key="`negated-label-${label}`"
            class="filter-tag negated-tag"
            :style="{
              backgroundColor: getBadgeColors(badgeMap.get(label))
                .backgroundColor,
              color: getBadgeColors(badgeMap.get(label)).textColor,
              borderColor: getBadgeColors(badgeMap.get(label)).textColor,
            }"
          >
            {{ label }}
          </span>

          <!-- Repository Filters -->
          <span
            v-for="source in negatedSources"
            :key="`negated-source-${source}`"
            class="filter-tag repository-tag negated-tag"
          >
            {{ getSourceDisplayName(source) }}
          </span>
        </span>
      </div>

      <!-- Extensions Grid -->
      <div class="extensions-grid">
        <ExtensionCard
          v-for="extension in displayExtensions"
          :key="`${extension.source}-${extension.name}`"
          :extension="extension"
          :selected="
            selectedExtensions.has(`${extension.source}-${extension.name}`)
          "
          :get-source-display-name="getSourceDisplayName"
          @toggle-extension="toggleExtension"
          @show-details="showExtensionDetails"
        />
      </div>

      <!-- No Results -->
      <div v-if="displayExtensions.length === 0" class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3>No extensions found</h3>
        <p>Try adjusting your search terms or filters.</p>
        <button class="clear-search-btn btn-secondary" @click="clearSearch">
          Clear Search & Filters
        </button>
      </div>
    </div>

    <!-- Floating Install Button -->
    <Teleport to="body">
      <div v-if="showInstallButton" class="floating-install-btn">
        <button
          class="install-selected-btn btn-brand"
          @click="installSelectedExtensions"
        >
          <span v-if="selectedExtensions.size === 0">Install All</span>
          <span v-else>Install Selected</span>
          <span v-if="selectedExtensions.size > 0" class="selected-count">{{
            selectedExtensions.size
          }}</span>
        </button>
      </div>
    </Teleport>

    <!-- Notification Panel -->
    <NotificationPanel
      :notifications="notifications"
      @remove-notification="removeNotification"
    />

    <!-- Extension Details Component -->
    <Teleport to="body">
      <ExtensionDetails
        :extension="selectedExtension"
        :show="showDetails"
        @hide="hideExtensionDetails"
        @install="installExtension"
      />
    </Teleport>
  </div>
</template>
