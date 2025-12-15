<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import ExtensionDetails from "./ExtensionDetails.vue";
import "./ExtensionList.css";
import {
  buildBaseUrl,
  getContentRatingBg,
  getContentRatingColor,
  getLanguageEmoji,
  getLanguageName,
  hasChapterProviding,
  hasCloudflareBypassProviding,
  hasMangaProgressProviding,
  normalizeLanguageTag,
  saveCustomRepos as saveRepos,
  useExtensions,
  type Extension,
} from "../lib/extensions";

const {
  extensions,
  loading,
  error,
  customRepos,
  loadRepos,
  fetchAllExtensions,
  addCustomRepo: addRepo,
  removeCustomRepo: removeRepo,
} = useExtensions();

const searchQuery = ref("");
const selectedRatings = ref<Set<string>>(new Set());
const negatedRatings = ref<Set<string>>(new Set());
const selectedExtensions = ref<Set<string>>(new Set());
const selectedExtension = ref<Extension | null>(null);
const showDetails = ref(false);
const showRepoManager = ref(false);
const newRepoUrl = ref("");
const selectedSources = ref<Set<string>>(new Set());
const negatedSources = ref<Set<string>>(new Set());
const checkingRepo = ref(false);
const selectedLanguages = ref<Set<string>>(new Set());
const negatedLanguages = ref<Set<string>>(new Set());
const selectedLabels = ref<Set<string>>(new Set());
const negatedLabels = ref<Set<string>>(new Set());
const badgeFilterMode = ref<"any" | "all">("any");
const selectedServices = ref<Set<string>>(new Set());
const negatedServices = ref<Set<string>>(new Set());
const filtersExpanded = ref(false);

const availableRatings = ["SAFE", "MATURE", "ADULT"];
const availableServices = ["Content Service", "Tracker Service", "Cloudflare"];

const formatRating = (rating: string) => {
  return rating.charAt(0) + rating.slice(1).toLowerCase();
};

const isValidRepoUrl = computed(() => {
  const url = newRepoUrl.value.trim();
  if (!url) return false;

  // Match github.com URLs only
  if (
    /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+/.test(url)
  )
    return true;

  return false;
});

// Set SAFE as default on mount
onMounted(async () => {
  selectedRatings.value = new Set(["SAFE"]);
  loadRepos();
  await fetchAllExtensions();

  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get("search");
  if (searchParam) {
    searchQuery.value = searchParam;
  }

  await handleAddRepoFromUrl();
});

const showNSFW = computed(() => {
  return (
    selectedRatings.value.has("MATURE") || selectedRatings.value.has("ADULT")
  );
});

const availableSources = computed(() => {
  const sources = ["inkdex"];
  customRepos.value.forEach((repo) => {
    sources.push(repo.id);
  });
  return sources;
});

const getSourceDisplayName = (sourceId: string) => {
  if (sourceId === "inkdex") return "Inkdex";
  const repo = customRepos.value.find((r) => r.id === sourceId);
  return repo?.displayName || sourceId;
};

const availableLanguages = computed(() => {
  const languages = new Set<string>();
  extensions.value.forEach((ext) => {
    if (ext.metadata?.language) {
      languages.add(ext.metadata.language);
    }
  });

  const validTags = new Set([
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
  ]);

  return Array.from(languages).sort((a, b) => {
    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();

    // Multi always first
    if (aLower === "multi") return -1;
    if (bLower === "multi") return 1;

    // Valid IETF tags come before invalid ones
    const aNormalized = normalizeLanguageTag(a);
    const bNormalized = normalizeLanguageTag(b);
    const aValid = validTags.has(aNormalized);
    const bValid = validTags.has(bNormalized);

    if (aValid && !bValid) return -1;
    if (!aValid && bValid) return 1;

    // Both valid or both invalid - sort alphabetically
    return a.localeCompare(b);
  });
});

const availableLabels = computed(() => {
  const labels = new Set<string>();
  extensions.value.forEach((ext) => {
    if (ext.metadata?.badges) {
      ext.metadata.badges.forEach((badge) => {
        labels.add(badge.label);
      });
    }
  });
  return Array.from(labels).sort();
});

const filteredExtensions = computed(() => {
  return extensions.value.filter((extension) => {
    const matchesSearch =
      searchQuery.value === "" ||
      extension.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      extension.source
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      (extension.metadata?.description &&
        extension.metadata.description
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())) ||
      (extension.metadata?.badges &&
        extension.metadata.badges.some((badge) =>
          badge.label.toLowerCase().includes(searchQuery.value.toLowerCase()),
        ));

    const matchesRating =
      (selectedRatings.value.size === 0 ||
        (extension.metadata?.contentRating &&
          selectedRatings.value.has(extension.metadata.contentRating))) &&
      !(
        extension.metadata?.contentRating &&
        negatedRatings.value.has(extension.metadata.contentRating)
      );

    const matchesSource =
      (selectedSources.value.size === 0 ||
        selectedSources.value.has(extension.source)) &&
      !negatedSources.value.has(extension.source);

    const matchesLanguage =
      (selectedLanguages.value.size === 0 ||
        (extension.metadata?.language &&
          selectedLanguages.value.has(extension.metadata.language))) &&
      !(
        extension.metadata?.language &&
        negatedLanguages.value.has(extension.metadata.language)
      );

    const matchesLabel =
      (selectedLabels.value.size === 0 ||
        (extension.metadata?.badges &&
          (badgeFilterMode.value === "any"
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
      );

    const matchesService =
      (selectedServices.value.size === 0 ||
        (extension.metadata?.capabilities &&
          Array.from(selectedServices.value).every((service) => {
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
          }))) &&
      !Array.from(negatedServices.value).some((service) => {
        if (!extension.metadata?.capabilities) return false;
        if (service === "Content Service")
          return hasChapterProviding(extension.metadata.capabilities);
        if (service === "Tracker Service")
          return hasMangaProgressProviding(extension.metadata.capabilities);
        if (service === "Cloudflare")
          return hasCloudflareBypassProviding(extension.metadata.capabilities);
        return false;
      });

    return (
      matchesSearch &&
      matchesRating &&
      matchesSource &&
      matchesLanguage &&
      matchesLabel &&
      matchesService
    );
  });
});

const toggleLanguage = (language: string) => {
  // Three-state: unselected → selected → negated → unselected
  if (selectedLanguages.value.has(language)) {
    selectedLanguages.value.delete(language);
    negatedLanguages.value.add(language);
  } else if (negatedLanguages.value.has(language)) {
    negatedLanguages.value.delete(language);
  } else {
    selectedLanguages.value.add(language);
  }
  selectedLanguages.value = new Set(selectedLanguages.value);
  negatedLanguages.value = new Set(negatedLanguages.value);
};

const toggleLabel = (label: string) => {
  // Three-state: unselected → selected → negated → unselected
  if (selectedLabels.value.has(label)) {
    selectedLabels.value.delete(label);
    negatedLabels.value.add(label);
  } else if (negatedLabels.value.has(label)) {
    negatedLabels.value.delete(label);
  } else {
    selectedLabels.value.add(label);
  }
  selectedLabels.value = new Set(selectedLabels.value);
  negatedLabels.value = new Set(negatedLabels.value);
};

const toggleBadgeFilterMode = () => {
  badgeFilterMode.value = badgeFilterMode.value === "any" ? "all" : "any";
};

const toggleSource = (source: string) => {
  // Three-state: unselected → selected → negated → unselected
  if (selectedSources.value.has(source)) {
    selectedSources.value.delete(source);
    negatedSources.value.add(source);
  } else if (negatedSources.value.has(source)) {
    negatedSources.value.delete(source);
  } else {
    selectedSources.value.add(source);
  }
  selectedSources.value = new Set(selectedSources.value);
  negatedSources.value = new Set(negatedSources.value);
};

const toggleService = (service: string) => {
  // Three-state: unselected → selected → negated → unselected
  if (selectedServices.value.has(service)) {
    selectedServices.value.delete(service);
    negatedServices.value.add(service);
  } else if (negatedServices.value.has(service)) {
    negatedServices.value.delete(service);
  } else {
    selectedServices.value.add(service);
  }
  selectedServices.value = new Set(selectedServices.value);
  negatedServices.value = new Set(negatedServices.value);
};

const toggleRating = (rating: string) => {
  // Three-state: unselected → selected → negated → unselected
  if (selectedRatings.value.has(rating)) {
    selectedRatings.value.delete(rating);
    negatedRatings.value.add(rating);
  } else if (negatedRatings.value.has(rating)) {
    negatedRatings.value.delete(rating);
  } else {
    selectedRatings.value.add(rating);
  }
  selectedRatings.value = new Set(selectedRatings.value);
  negatedRatings.value = new Set(negatedRatings.value);
};

const clearAllFilters = () => {
  selectedLanguages.value = new Set();
  negatedLanguages.value = new Set();
  selectedLabels.value = new Set();
  negatedLabels.value = new Set();
  selectedSources.value = new Set();
  negatedSources.value = new Set();
  selectedRatings.value = new Set();
  negatedRatings.value = new Set();
  selectedServices.value = new Set();
  negatedServices.value = new Set();
};

const clearSearch = () => {
  searchQuery.value = "";
  selectedRatings.value = new Set();
  negatedRatings.value = new Set();
  selectedSources.value = new Set();
  negatedSources.value = new Set();
  selectedLanguages.value = new Set();
  negatedLanguages.value = new Set();
  selectedLabels.value = new Set();
  negatedLabels.value = new Set();
  selectedServices.value = new Set();
  negatedServices.value = new Set();
};

const toggleExtension = (extension: Extension) => {
  const key = `${extension.source}-${extension.name}`;
  if (selectedExtensions.value.has(key)) {
    selectedExtensions.value.delete(key);
  } else {
    selectedExtensions.value.add(key);
  }
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

const installSelectedExtensions = () => {
  const extensionsToInstall =
    selectedExtensions.value.size === 0
      ? filteredExtensions.value.map((ext) => [
          ext.name,
          getBaseUrl(ext.source),
        ])
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
    alert("No extensions to install");
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

const showExtensionDetails = (extension: Extension) => {
  selectedExtension.value = extension;
  showDetails.value = true;
};

const hideExtensionDetails = () => {
  showDetails.value = false;
  selectedExtension.value = null;
};

const addCustomRepo = async () => {
  if (!newRepoUrl.value.trim()) {
    alert("Please enter a repository URL");
    return;
  }

  checkingRepo.value = true;

  try {
    const result = await addRepo(newRepoUrl.value);

    if (!result.success) {
      // Silently fail if repository is already added
      if (result.error?.includes("already added")) {
        newRepoUrl.value = "";
        checkingRepo.value = false;
        return;
      }
      alert(result.error);
      checkingRepo.value = false;
      return;
    }

    newRepoUrl.value = "";

    // Fetch extensions dynamically without showing loading spinner
    await fetchAllExtensions(true, false);
    checkingRepo.value = false;
  } catch (e) {
    alert("An error occurred while adding the repository");
    console.error(e);
    checkingRepo.value = false;
  }
};

const removeCustomRepo = async (repoId: string) => {
  // Remove from selected sources if it was selected
  if (selectedSources.value.has(repoId)) {
    selectedSources.value.delete(repoId);
  }
  removeRepo(repoId);
  // Fetch extensions dynamically without showing loading spinner
  await fetchAllExtensions(true, false);
};

const handleAddRepoFromUrl = async () => {
  if (typeof window === "undefined") return;

  const urlParams = new URLSearchParams(window.location.search);
  const repoParam = urlParams.get("add-repo");

  if (repoParam) {
    const repoUrl = decodeURIComponent(repoParam);

    checkingRepo.value = true;
    const result = await addRepo(repoUrl);
    checkingRepo.value = false;

    if (result.success) {
      await fetchAllExtensions();
    }

    urlParams.delete("add-repo");
    const newUrl = urlParams.toString()
      ? `${window.location.pathname}?${urlParams.toString()}`
      : window.location.pathname;
    window.history.replaceState({}, "", newUrl);
  }
};
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
              class="input-btn btn-secondary"
              title="Clear search"
              @click="searchQuery = ''"
            >
              Clear
            </button>
          </div>
        </div>

        <div class="filters-row">
          <div class="toggles-group">
            <button
              class="action-btn"
              :class="{
                active:
                  filtersExpanded ||
                  selectedRatings.size > 0 ||
                  negatedRatings.size > 0 ||
                  selectedLanguages.size > 0 ||
                  negatedLanguages.size > 0 ||
                  selectedLabels.size > 0 ||
                  negatedLabels.size > 0 ||
                  selectedServices.size > 0 ||
                  negatedServices.size > 0,
              }"
              @click="filtersExpanded = !filtersExpanded"
            >
              <span class="btn-text">Filters</span>
              <span
                v-if="
                  selectedRatings.size +
                    negatedRatings.size +
                    selectedLanguages.size +
                    negatedLanguages.size +
                    selectedLabels.size +
                    negatedLabels.size +
                    selectedServices.size +
                    negatedServices.size >
                  0
                "
                class="filter-count"
                >{{
                  selectedRatings.size +
                  negatedRatings.size +
                  selectedLanguages.size +
                  negatedLanguages.size +
                  selectedLabels.size +
                  negatedLabels.size +
                  selectedServices.size +
                  negatedServices.size
                }}</span
              >
              <span class="expand-icon" :class="{ expanded: filtersExpanded }"
                >▼</span
              >
            </button>

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
              <span class="btn-text">Repositories</span>
              <span
                v-if="selectedSources.size + negatedSources.size > 0"
                class="filter-count"
                >{{ selectedSources.size + negatedSources.size }}</span
              >
              <span class="expand-icon" :class="{ expanded: showRepoManager }"
                >▼</span
              >
            </button>
          </div>
        </div>

        <!-- Collapsible Filters Section -->
        <div class="advanced-filters" :class="{ expanded: filtersExpanded }">
          <div class="filters-header">
            <button
              v-if="
                selectedRatings.size > 0 ||
                negatedRatings.size > 0 ||
                selectedLanguages.size > 0 ||
                negatedLanguages.size > 0 ||
                selectedLabels.size > 0 ||
                negatedLabels.size > 0 ||
                selectedServices.size > 0 ||
                negatedServices.size > 0
              "
              class="btn-secondary clear-filters-btn"
              @click="clearAllFilters"
            >
              Clear Filters
            </button>
          </div>

          <div class="filter-group">
            <div class="filter-header">
              <span class="filter-label">Content Rating</span>
            </div>
            <div class="filter-chips">
              <button
                v-for="rating in availableRatings"
                :key="rating"
                class="filter-chip"
                :class="{
                  active: selectedRatings.has(rating),
                  negated: negatedRatings.has(rating),
                  'rating-safe': rating === 'SAFE',
                  'rating-mature': rating === 'MATURE',
                  'rating-adult': rating === 'ADULT',
                }"
                @click="toggleRating(rating)"
              >
                {{ formatRating(rating) }}
              </button>
            </div>
          </div>

          <div class="filter-group">
            <div class="filter-header">
              <span class="filter-label">Services</span>
            </div>
            <div class="filter-chips">
              <button
                v-for="service in availableServices"
                :key="service"
                class="filter-chip"
                :class="{
                  active: selectedServices.has(service),
                  negated: negatedServices.has(service),
                  'service-content': service === 'Content Service',
                  'service-tracker': service === 'Tracker Service',
                  'service-cloudflare': service === 'Cloudflare',
                }"
                @click="toggleService(service)"
              >
                {{ service }}
              </button>
            </div>
          </div>

          <div class="filter-group">
            <div class="filter-header">
              <span class="filter-label">Languages</span>
            </div>
            <div class="filter-chips">
              <button
                v-for="language in availableLanguages"
                :key="language"
                class="filter-chip filter-language"
                :class="{
                  active: selectedLanguages.has(language),
                  negated: negatedLanguages.has(language),
                }"
                @click="toggleLanguage(language)"
              >
                <template v-if="getLanguageEmoji(language)"
                  >{{ getLanguageEmoji(language) }}&nbsp;</template
                >{{ getLanguageName(language) }}
              </button>
            </div>
          </div>

          <div class="filter-group">
            <div class="filter-header">
              <span class="filter-label">Badges</span>
              <button
                class="badge-mode-toggle"
                :title="
                  badgeFilterMode === 'any'
                    ? 'Match ANY selected badge (OR)'
                    : 'Match ALL selected badges (AND)'
                "
                @click="toggleBadgeFilterMode"
              >
                <span v-if="badgeFilterMode === 'any'">OR</span>
                <span v-else>AND</span>
              </button>
            </div>
            <div class="filter-chips">
              <button
                v-for="label in availableLabels"
                :key="label"
                class="filter-chip filter-badge"
                :class="{
                  active: selectedLabels.has(label),
                  negated: negatedLabels.has(label),
                }"
                @click="toggleLabel(label)"
              >
                {{ label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Collapsible Repository Manager -->
        <div
          class="advanced-filters repos-section"
          :class="{ expanded: showRepoManager }"
        >
          <div class="filter-group">
            <div class="filter-header">
              <span class="filter-label">Add Repository</span>
            </div>
            <div class="search-input-container repo-input-container">
              <input
                v-model="newRepoUrl"
                type="text"
                placeholder="https://github.com/owner/repo"
                class="search-input repo-input"
                @keyup.enter="addCustomRepo"
              />
              <button
                class="input-btn btn-brand add-repo-btn"
                :disabled="checkingRepo || !isValidRepoUrl"
                @click="addCustomRepo"
              >
                {{ checkingRepo ? "Adding..." : "Add" }}
              </button>
            </div>
          </div>

          <div class="filter-group repos-filter-group">
            <div class="filter-header repos-filter-header">
              <span class="filter-label">Installed Repositories</span>
            </div>
            <button
              v-if="selectedSources.size > 0"
              class="btn-secondary clear-filters-btn repos-clear-btn"
              @click="selectedSources = new Set()"
            >
              Clear Filters
            </button>
            <div class="filter-chips">
              <div
                v-for="source in availableSources"
                :key="source"
                class="repo-chip"
                :class="{
                  active: selectedSources.has(source),
                  negated: negatedSources.has(source),
                }"
              >
                <button
                  class="repo-chip-name clickable"
                  @click="toggleSource(source)"
                >
                  {{ getSourceDisplayName(source) }}
                </button>
                <button
                  v-if="source !== 'inkdex'"
                  class="repo-chip-remove"
                  @click="removeCustomRepo(source)"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Results Summary -->
      <div class="results-summary">
        <span class="results-count">
          <template v-if="filteredExtensions.length === extensions.length">
            Showing {{ extensions.length }} extensions
          </template>
          <template v-else>
            Showing {{ filteredExtensions.length }} of
            {{ extensions.length }} extensions
            <span class="hidden-count">
              ({{ extensions.length - filteredExtensions.length }} hidden
              because of filters)
            </span>
          </template>
        </span>
        <span
          v-if="
            searchQuery ||
            selectedRatings.size > 0 ||
            negatedRatings.size > 0 ||
            selectedLanguages.size > 0 ||
            negatedLanguages.size > 0 ||
            selectedLabels.size > 0 ||
            negatedLabels.size > 0 ||
            selectedSources.size > 0 ||
            negatedSources.size > 0 ||
            selectedServices.size > 0 ||
            negatedServices.size > 0
          "
          class="active-filters"
        >
          <span v-if="searchQuery" class="filter-tag"
            >Search: "{{ searchQuery }}"</span
          >
          <span
            v-for="rating in selectedRatings"
            :key="`rating-${rating}`"
            class="filter-tag rating-tag"
            :class="`rating-${rating.toLowerCase()}`"
            >{{ formatRating(rating) }}</span
          >

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
          <span
            v-for="lang in selectedLanguages"
            :key="`lang-${lang}`"
            class="filter-tag language-tag"
            >{{ lang }}</span
          >
          <span
            v-for="label in selectedLabels"
            :key="`label-${label}`"
            class="filter-tag label-tag"
            >{{ label }}</span
          >
          <span
            v-for="source in selectedSources"
            :key="`source-${source}`"
            class="filter-tag source-tag repository-tag"
            >{{ getSourceDisplayName(source) }}</span
          >
          <span
            v-for="rating in negatedRatings"
            :key="`negated-rating-${rating}`"
            class="filter-tag rating-tag negated-tag"
            :class="`rating-${rating.toLowerCase()}`"
            >{{ formatRating(rating) }}</span
          >
          <span
            v-for="service in negatedServices"
            :key="`negated-service-${service}`"
            class="filter-tag service-tag negated-tag"
            :class="{
              'service-content': service === 'Content Service',
              'service-tracker': service === 'Tracker Service',
              'service-cloudflare': service === 'Cloudflare',
            }"
            >{{ service }}</span
          >
          <span
            v-for="lang in negatedLanguages"
            :key="`negated-lang-${lang}`"
            class="filter-tag language-tag negated-tag"
            >{{ lang }}</span
          >
          <span
            v-for="label in negatedLabels"
            :key="`negated-label-${label}`"
            class="filter-tag label-tag negated-tag"
            >{{ label }}</span
          >
          <span
            v-for="source in negatedSources"
            :key="`negated-source-${source}`"
            class="filter-tag source-tag repository-tag negated-tag"
            >{{ getSourceDisplayName(source) }}</span
          >
        </span>
      </div>

      <div class="extensions-grid">
        <div
          v-for="extension in filteredExtensions"
          :key="`${extension.source}-${extension.name}`"
          class="extension-card"
          :class="{
            selected: selectedExtensions.has(
              `${extension.source}-${extension.name}`,
            ),
          }"
          @click="toggleExtension(extension)"
        >
          <div class="extension-header">
            <img
              :src="extension.iconUrl"
              :alt="`${extension.name} icon`"
              class="extension-icon"
              loading="lazy"
              @error="
                (e) =>
                  ((e.target as HTMLImageElement).src =
                    'https://paperback.moe/pb-logo.png')
              "
            />
            <div class="extension-header-text">
              <h3 class="extension-name">
                {{ extension.name }}
              </h3>
              <div v-if="extension.metadata" class="card-badges">
                <span
                  class="rating-badge"
                  :style="{
                    color: getContentRatingColor(
                      extension.metadata.contentRating,
                    ),
                    backgroundColor: getContentRatingBg(
                      extension.metadata.contentRating,
                    ),
                  }"
                >
                  {{ formatRating(extension.metadata.contentRating) }}
                </span>
                <span class="version-badge"
                  >v{{ extension.metadata.version }}</span
                >
              </div>
            </div>
          </div>

          <div v-if="extension.metadata" class="extension-meta">
            <div
              v-if="extension.metadata.description"
              class="extension-description"
            >
              {{ extension.metadata.description }}
            </div>

            <div class="extension-tags-row">
              <span
                v-if="
                  extension.metadata.capabilities &&
                  hasChapterProviding(extension.metadata.capabilities)
                "
                class="service-badge service-content"
                >Content Service</span
              >
              <span
                v-if="
                  extension.metadata.capabilities &&
                  hasMangaProgressProviding(extension.metadata.capabilities)
                "
                class="service-badge service-tracker"
                >Tracker Service</span
              >
              <span
                v-if="
                  extension.metadata.capabilities &&
                  hasCloudflareBypassProviding(extension.metadata.capabilities)
                "
                class="service-badge service-cloudflare"
                >Cloudflare</span
              >
              <span v-if="extension.metadata.language" class="language-badge">
                <template v-if="getLanguageEmoji(extension.metadata.language)"
                  >{{
                    getLanguageEmoji(extension.metadata.language)
                  }}&nbsp;</template
                >{{ getLanguageName(extension.metadata.language) }}
              </span>
              <span
                v-for="badge in extension.metadata.badges?.slice(0, 3)"
                :key="badge.label"
                class="genre-badge"
                :style="{
                  color: badge.textColor,
                  backgroundColor: badge.backgroundColor,
                }"
              >
                {{ badge.label }}
              </span>
            </div>

            <div class="extension-repo">
              <span class="source-badge">
                {{ getSourceDisplayName(extension.source) }}
              </span>
            </div>
          </div>

          <div class="extension-footer">
            <span
              v-if="
                selectedExtensions.has(`${extension.source}-${extension.name}`)
              "
              class="selected-indicator"
            >
              ✓ Selected
            </span>
            <div class="extension-actions" @click.stop>
              <button
                class="btn-secondary details-btn"
                @click="showExtensionDetails(extension)"
              >
                Details
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Floating Install Button -->
      <div v-if="filteredExtensions.length > 0" class="floating-install-btn">
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

      <div v-if="filteredExtensions.length === 0" class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3>No extensions found</h3>
        <p>Try adjusting your search terms or filters.</p>
        <button class="clear-search-btn btn-brand" @click="clearSearch">
          Clear Search & Filters
        </button>
      </div>
    </div>

    <!-- Extension Details Component -->
    <ExtensionDetails
      :extension="selectedExtension"
      :show="showDetails"
      @hide="hideExtensionDetails"
      @install="installExtension"
    />
  </div>
</template>
