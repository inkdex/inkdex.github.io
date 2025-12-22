<script setup lang="ts">
import {
  getContentRatingBg,
  getContentRatingColor,
  getLanguageEmoji,
  getLanguageName,
  hasChapterProviding,
  hasCloudflareBypassProviding,
  hasMangaProgressProviding,
  type Extension,
} from "../lib/extensions";
import { formatRating } from "../lib/uiUtils";

interface Props {
  extension: Extension;
  selected: boolean;
  getSourceDisplayName: (sourceId: string) => string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "toggle-extension": [extension: Extension];
  "show-details": [extension: Extension];
}>();

const handleCardClick = () => {
  emit("toggle-extension", props.extension);
};

const handleDetailsClick = (event: Event) => {
  event.stopPropagation();
  emit("show-details", props.extension);
};

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = "https://paperback.moe/pb-logo.png";
};
</script>

<template>
  <div class="extension-card" :class="{ selected }" @click="handleCardClick">
    <div class="extension-header">
      <img
        :src="extension.iconUrl"
        :alt="`${extension.name} icon`"
        class="extension-icon"
        loading="lazy"
        @error="handleImageError"
      />
      <div class="extension-header-text">
        <h3 class="extension-name">
          {{ extension.name }}
        </h3>
        <div v-if="extension.metadata" class="card-badges">
          <span
            class="rating-badge"
            :style="{
              color: getContentRatingColor(extension.metadata.contentRating),
              backgroundColor: getContentRatingBg(
                extension.metadata.contentRating,
              ),
              borderColor: getContentRatingColor(
                extension.metadata.contentRating,
              ),
            }"
          >
            {{ formatRating(extension.metadata.contentRating) }}
          </span>
          <span class="version-badge">v{{ extension.metadata.version }}</span>
        </div>
      </div>
    </div>

    <div v-if="extension.metadata" class="extension-meta">
      <div v-if="extension.metadata.description" class="extension-description">
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
            >{{ getLanguageEmoji(extension.metadata.language) }}&nbsp;</template
          >{{ getLanguageName(extension.metadata.language) }}
        </span>
        <span
          v-for="badge in extension.metadata.badges?.slice(0, 3)"
          :key="badge.label"
          class="genre-badge"
          :style="{
            color: badge.textColor,
            backgroundColor: badge.backgroundColor,
            borderColor: badge.textColor,
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
      <span v-if="selected" class="selected-indicator"> ✓ Selected </span>
      <div class="extension-actions" @click.stop>
        <button class="btn-secondary details-btn" @click="handleDetailsClick">
          Details
        </button>
      </div>
    </div>
  </div>
</template>
