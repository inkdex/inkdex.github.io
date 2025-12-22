<script setup lang="ts">
import { computed, ref } from "vue";
import type { CustomRepository } from "../lib/extensions";

interface Props {
  showRepoManager: boolean;
  customRepos: CustomRepository[];
  selectedSources: Set<string>;
  negatedSources: Set<string>;
  checkingRepo: boolean;
  newRepoUrl?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "toggle-repo-manager": [];
  "update:new-repo-url": [value: string];
  "add-custom-repo": [];
  "remove-custom-repo": [repoId: string];
  "toggle-source": [source: string];
  "clear-source-filters": [];
}>();

// Computed properties
const availableSources = computed(() => {
  const sources = ["inkdex"];
  props.customRepos.forEach((repo) => {
    sources.push(repo.id);
  });
  return sources;
});

const hasActiveSourceFilters = computed(() => {
  return props.selectedSources.size > 0 || props.negatedSources.size > 0;
});

const activeSourceFilterCount = computed(() => {
  return props.selectedSources.size + props.negatedSources.size;
});

const isValidRepoUrl = computed(() => {
  const url = props.newRepoUrl?.trim() || "";
  if (!url) return false;

  // Match github.com URLs
  if (
    /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+/.test(
      url,
    )
  )
    return true;

  // Match owner/repo format
  if (/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(url)) return true;

  return false;
});

// Helper functions
const getSourceDisplayName = (sourceId: string) => {
  if (sourceId === "inkdex") return "Inkdex";
  const repo = props.customRepos.find((r) => r.id === sourceId);
  return repo?.displayName || sourceId;
};

const handleAddRepo = () => {
  emit("add-custom-repo");
};

const handleRemoveRepo = (repoId: string) => {
  emit("remove-custom-repo", repoId);
};

const handleToggleSource = (source: string) => {
  emit("toggle-source", source);
};

const handleClearSourceFilters = () => {
  emit("clear-source-filters");
};

const handleUrlKeyup = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    handleAddRepo();
  }
};
</script>

<template>
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
          :value="newRepoUrl"
          type="text"
          placeholder="https://github.com/owner/repo"
          class="search-input repo-input"
          @input="
            $emit(
              'update:new-repo-url',
              ($event.target as HTMLInputElement)?.value || '',
            )
          "
          @keyup="handleUrlKeyup"
        />
        <button
          class="input-btn btn-brand add-repo-btn"
          :disabled="checkingRepo || !isValidRepoUrl"
          @click="handleAddRepo"
        >
          {{ props.checkingRepo ? "Adding..." : "Add" }}
        </button>
      </div>
    </div>

    <div class="filter-group repos-filter-group">
      <div class="filter-header repos-filter-header">
        <span class="filter-label">Installed Repositories</span>
      </div>
      <button
        v-if="hasActiveSourceFilters"
        class="btn-secondary clear-filters-btn repos-clear-btn"
        @click="handleClearSourceFilters"
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
            @click="handleToggleSource(source)"
          >
            {{ getSourceDisplayName(source) }}
          </button>
          <button
            v-if="source !== 'inkdex'"
            class="repo-chip-remove"
            @click="handleRemoveRepo(source)"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
