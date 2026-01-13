<!-- SPDX-License-Identifier: GPL-3.0-or-later -->
<!-- Copyright © 2026 Inkdex -->

<script setup lang="ts">
import { computed } from "vue";
import {
  getLanguageEmoji,
  getLanguageName,
  type Extension,
} from "../lib/extensions";
import { formatRating, getBadgeColors } from "../lib/uiUtils";

interface Props {
  filtersExpanded: boolean;
  availableRatings: string[];
  availableServices: string[];
  availableLanguages: string[];
  availableLabels: string[];
  selectedRatings: Set<string>;
  negatedRatings: Set<string>;
  selectedLanguages: Set<string>;
  negatedLanguages: Set<string>;
  selectedLabels: Set<string>;
  negatedLabels: Set<string>;
  selectedServices: Set<string>;
  negatedServices: Set<string>;
  badgeFilterMode: "and" | "or";
  serviceFilterMode: "and" | "or";
  extensions: Extension[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "toggle-rating": [rating: string];
  "toggle-language": [language: string];
  "toggle-label": [label: string];
  "toggle-service": [service: string];
  "toggle-badge-mode": [];
  "toggle-service-mode": [];
  "clear-filters": [];
}>();

// Computed properties
const hasActiveFilters = computed(() => {
  return (
    props.selectedRatings.size > 0 ||
    props.negatedRatings.size > 0 ||
    props.selectedLanguages.size > 0 ||
    props.negatedLanguages.size > 0 ||
    props.selectedLabels.size > 0 ||
    props.negatedLabels.size > 0 ||
    props.selectedServices.size > 0 ||
    props.negatedServices.size > 0
  );
});

const activeFilterCount = computed(() => {
  return (
    props.selectedRatings.size +
    props.negatedRatings.size +
    props.selectedLanguages.size +
    props.negatedLanguages.size +
    props.selectedLabels.size +
    props.negatedLabels.size +
    props.selectedServices.size +
    props.negatedServices.size
  );
});

// Create a map of label names to badge objects for quick lookup
const badgeMap = computed(() => {
  const map = new Map<
    string,
    { textColor: string; backgroundColor: string; label: string }
  >();
  for (const ext of props.extensions) {
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
</script>

<template>
  <!-- Collapsible Filters Section -->
  <div class="advanced-filters" :class="{ expanded: filtersExpanded }">
    <div class="filters-header">
      <button
        v-if="hasActiveFilters"
        class="btn-secondary clear-filters-btn"
        @click="$emit('clear-filters')"
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
          @click="$emit('toggle-rating', rating)"
        >
          {{ formatRating(rating) }}
        </button>
      </div>
    </div>

    <div class="filter-group">
      <div class="filter-header">
        <span class="filter-label">Services</span>
        <button
          class="badge-mode-toggle"
          :title="
            serviceFilterMode === 'or'
              ? 'Match ANY selected service (OR)'
              : 'Match ALL selected services (AND)'
          "
          @click="$emit('toggle-service-mode')"
        >
          <span v-if="serviceFilterMode === 'or'">OR</span>
          <span v-else>AND</span>
        </button>
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
          @click="$emit('toggle-service', service)"
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
          @click="$emit('toggle-language', language)"
        >
          <template v-if="getLanguageEmoji(language)"
            >{{ getLanguageEmoji(language) }}&nbsp;</template
          >{{ getLanguageName(language) }}
        </button>
        <div v-if="availableLanguages.length === 0" class="no-items">
          No languages found
        </div>
      </div>
    </div>

    <div class="filter-group">
      <div class="filter-header">
        <span class="filter-label">Badges</span>
        <button
          class="badge-mode-toggle"
          :title="
            badgeFilterMode === 'or'
              ? 'Match ANY selected badge (OR)'
              : 'Match ALL selected badges (AND)'
          "
          @click="$emit('toggle-badge-mode')"
        >
          <span v-if="badgeFilterMode === 'or'">OR</span>
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
          :style="
            selectedLabels.has(label)
              ? {
                  backgroundColor: getBadgeColors(badgeMap.get(label))
                    .backgroundColor,
                  color: getBadgeColors(badgeMap.get(label)).textColor,
                  borderColor: getBadgeColors(badgeMap.get(label)).textColor,
                }
              : {}
          "
          @click="$emit('toggle-label', label)"
        >
          {{ label }}
        </button>
        <div v-if="availableLabels.length === 0" class="no-items">
          No badges found
        </div>
      </div>
    </div>
  </div>
</template>
