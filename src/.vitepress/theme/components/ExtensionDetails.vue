<script setup lang="ts">
import { watch } from "vue";
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
  extension: Extension | null;
  show: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  hide: [];
  install: [extension: Extension];
}>();

const handleInstall = () => {
  if (props.extension) {
    emit("install", props.extension);
  }
};

// Disable scrolling when modal is open
watch(
  () => props.show,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  },
);
</script>

<template>
  <div v-if="show && extension" class="details-overlay" @click="$emit('hide')">
    <div ref="detailsContainer" class="details-modal" @click.stop>
      <button class="details-close-btn" @click="$emit('hide')">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div class="details-content">
        <div class="details-header">
          <img
            :src="extension.iconUrl"
            :alt="`${extension.name} icon`"
            class="details-icon"
            @error="
              (e) =>
                ((e.target as HTMLImageElement).src =
                  'https://paperback.moe/pb-logo.png')
            "
          />
          <div class="details-header-text">
            <h2 class="details-title">
              {{ extension.name }}
            </h2>
            <div v-if="extension.metadata" class="details-header-badges">
              <span
                class="details-rating-badge"
                :style="{
                  color: getContentRatingColor(
                    extension.metadata.contentRating,
                  ),
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
              <span
                v-if="extension.metadata.version"
                class="details-version-badge"
              >
                v{{ extension.metadata.version }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="extension.metadata?.description" class="details-description">
          <h3>Description</h3>
          <p>{{ extension.metadata.description }}</p>
        </div>

        <div v-if="extension.metadata?.capabilities" class="details-section">
          <h3>Services</h3>
          <div class="details-services">
            <span
              v-if="hasChapterProviding(extension.metadata.capabilities)"
              class="service-badge service-content"
              >Content Service</span
            >
            <span
              v-if="hasMangaProgressProviding(extension.metadata.capabilities)"
              class="service-badge service-tracker"
              >Tracker Service</span
            >
            <span
              v-if="
                hasCloudflareBypassProviding(extension.metadata.capabilities)
              "
              class="service-badge service-cloudflare"
              >Cloudflare</span
            >
          </div>
        </div>

        <div v-if="extension.metadata?.language" class="details-section">
          <h3>Language</h3>
          <span class="language-badge">
            <template v-if="getLanguageEmoji(extension.metadata.language)"
              >{{
                getLanguageEmoji(extension.metadata.language)
              }}&nbsp;</template
            >{{ getLanguageName(extension.metadata.language) }}
          </span>
        </div>

        <div
          v-if="
            extension.metadata?.badges && extension.metadata.badges.length > 0
          "
          class="details-section"
        >
          <h3>Badges</h3>
          <div class="details-badges">
            <span
              v-for="badge in extension.metadata.badges"
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
        </div>

        <div class="details-section">
          <h3>Repository</h3>
          <span class="source-badge">
            {{
              extension.source === "inkdex"
                ? "Inkdex"
                : extension.repoId || extension.source
            }}
          </span>
        </div>

        <div
          v-if="
            extension.metadata?.developers &&
            extension.metadata.developers.length > 0
          "
          class="details-section"
        >
          <h3>Developers</h3>
          <div class="details-developers">
            <div
              v-for="dev in extension.metadata.developers"
              :key="dev.name"
              class="details-developer"
            >
              <div class="dev-name">{{ dev.name }}</div>
              <div v-if="dev.github || dev.website" class="dev-links">
                <a
                  v-if="dev.github"
                  :href="dev.github"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="dev-link"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                    />
                  </svg>
                  GitHub
                </a>
                <a
                  v-if="dev.website"
                  :href="dev.website"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="dev-link"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path
                      d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
                    ></path>
                  </svg>
                  Website
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="details-actions">
          <button class="details-install-btn btn-brand" @click="handleInstall">
            Install Extension
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
