<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import ExtensionDetails from './ExtensionDetails.vue'
import './ExtensionList.css'

interface GitHubFile {
  name: string
  path: string
  type: 'file' | 'dir'
  html_url: string
  download_url?: string
}

interface ExtensionMetadata {
  id: string
  name: string
  description: string
  version: string
  icon: string
  language: string | null
  contentRating: 'SAFE' | 'MATURE' | 'ADULT'
  badges: Array<{
    label: string
    textColor: string
    backgroundColor: string
  }>
  capabilities: number | number[]
  developers: Array<{
    name: string
    website?: string | null
    github?: string | null
  }>
}

interface Extension {
  name: string
  source: 'inkdex' | 'karrot'
  url: string
  html_url: string
  metadata?: ExtensionMetadata
  iconUrl?: string
}

const extensions = ref<Extension[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const searchQuery = ref('')
const selectedRating = ref<string>('all')
const selectedExtensions = ref<Set<string>>(new Set())
const selectedExtension = ref<Extension | null>(null)
const showDetails = ref(false)

const fetchExtensions = async () => {
  try {
    // Fetch directory listings
    const [inkdexResponse, karrotResponse] = await Promise.all([
      fetch('https://api.github.com/repos/inkdex/extensions/contents/0.9/stable'),
      fetch('https://api.github.com/repos/karrot0/KakarotExtension/contents/0.9/stable?ref=gh-pages')
    ])

    if (!inkdexResponse.ok || !karrotResponse.ok) {
      throw new Error('Failed to fetch extensions')
    }

    const [inkdexData, karrotData] = await Promise.all([
      inkdexResponse.json(),
      karrotResponse.json()
    ])

    // Fetch metadata
    const [inkdexMetadataResponse, karrotMetadataResponse] = await Promise.all([
      fetch('https://raw.githubusercontent.com/inkdex/extensions/master/0.9/stable/versioning.json'),
      fetch('https://raw.githubusercontent.com/karrot0/KakarotExtension/gh-pages/0.9/stable/versioning.json')
    ])

    const [inkdexMetadata, karrotMetadata] = await Promise.all([
      inkdexMetadataResponse.json(),
      karrotMetadataResponse.json()
    ])

    // Create metadata maps
    const inkdexMetadataMap = new Map(
      inkdexMetadata.sources.map((source: ExtensionMetadata) => [source.id, source])
    )
    const karrotMetadataMap = new Map(
      karrotMetadata.sources.map((source: ExtensionMetadata) => [source.id, source])
    )

    const inkdexExtensions: Extension[] = inkdexData
      .filter((item: GitHubFile) => item.type === 'dir')
      .map((item: GitHubFile) => {
        const metadata = inkdexMetadataMap.get(item.name)
        return {
          name: item.name,
          source: 'inkdex' as const,
          url: `https://raw.githubusercontent.com/inkdex/extensions/master/0.9/stable/${item.name}/index.js`,
          html_url: item.html_url,
          metadata,
          iconUrl: metadata?.icon 
            ? `https://inkdex.github.io/extensions/0.9/stable/${item.name}/static/${metadata.icon}`
            : 'https://paperback.moe/pb-placeholder.png'
        }
      })

    const karrotExtensions: Extension[] = karrotData
      .filter((item: GitHubFile) => item.type === 'dir')
      .map((item: GitHubFile) => {
        const metadata = karrotMetadataMap.get(item.name)
        return {
          name: item.name,
          source: 'karrot' as const,
          url: `https://raw.githubusercontent.com/karrot0/KakarotExtension/gh-pages/0.9/stable/${item.name}/index.js`,
          html_url: item.html_url,
          metadata,
          iconUrl: metadata?.icon
            ? `https://karrot0.github.io/KakarotExtension/0.9/stable/${item.name}/static/${metadata.icon}`
            : 'https://paperback.moe/pb-placeholder.png'
        }
      })

    extensions.value = [...inkdexExtensions, ...karrotExtensions]
      .sort((a, b) => a.name.localeCompare(b.name))

  } catch (e) {
    error.value = e instanceof Error ? e.message : 'An error occurred'
  } finally {
    loading.value = false
  }
}

const filteredExtensions = computed(() => {
  return extensions.value.filter(extension => {
    const matchesSearch = searchQuery.value === '' ||
      extension.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      extension.source.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (extension.metadata?.description && extension.metadata.description.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (extension.metadata?.badges && extension.metadata.badges.some(badge =>
        badge.label.toLowerCase().includes(searchQuery.value.toLowerCase())
      ))

    const matchesRating = selectedRating.value === 'all' ||
      extension.metadata?.contentRating === selectedRating.value

    return matchesSearch && matchesRating
  })
})

const getContentRatingColor = (rating: string) => {
  switch (rating) {
    case 'ADULT': return 'var(--vp-c-danger)'
    case 'MATURE': return 'var(--vp-c-warning)'
    case 'SAFE': return 'var(--vp-c-success)'
    default: return 'var(--vp-c-text-2)'
  }
}

const getContentRatingBg = (rating: string) => {
  switch (rating) {
    case 'ADULT': return 'var(--vp-c-danger-soft)'
    case 'MATURE': return 'var(--vp-c-warning-soft)'
    case 'SAFE': return 'var(--vp-c-success-soft)'
    default: return 'var(--vp-c-bg-soft)'
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  selectedRating.value = 'all'
}

const toggleExtension = (extension: Extension) => {
  const key = `${extension.source}-${extension.name}`
  if (selectedExtensions.value.has(key)) {
    selectedExtensions.value.delete(key)
  } else {
    selectedExtensions.value.add(key)
  }
}

const getBaseUrl = (source: 'inkdex' | 'karrot') => {
  if (source === 'inkdex') {
    return 'https://raw.githubusercontent.com/inkdex/extensions/master/0.9/stable'
  }
  return 'https://raw.githubusercontent.com/karrot0/KakarotExtension/gh-pages/0.9/stable'
}

const installSelectedExtensions = () => {
  if (selectedExtensions.value.size === 0) {
    alert('Please select at least one extension')
    return
  }
  
  const extensionsToInstall = Array.from(selectedExtensions.value).map(key => {
    const extension = extensions.value.find(ext => `${ext.source}-${ext.name}` === key)
    if (!extension) return null
    return [extension.name, getBaseUrl(extension.source)]
  }).filter(Boolean)
  
  const installUrl = `paperback://installExtensions?data=${btoa(JSON.stringify(extensionsToInstall))}`
  window.location.href = installUrl
}

const installExtension = (extension: Extension) => {
  const extensionToInstall = [extension.name, getBaseUrl(extension.source)]
  const installUrl = `paperback://installExtensions?data=${btoa(JSON.stringify([extensionToInstall]))}`
  window.location.href = installUrl
}

const showExtensionDetails = (extension: Extension) => {
  selectedExtension.value = extension
  showDetails.value = true
}

const hideExtensionDetails = () => {
  showDetails.value = false
  selectedExtension.value = null
}

onMounted(() => {
  fetchExtensions()
})
</script>

<template>
  <div class="extension-list">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      Loading extensions...
    </div>

    <div v-else-if="error" class="error">
      Error loading extensions: {{ error }}
    </div>

    <div v-else>
      <!-- Search and Filter Section -->
      <div class="search-section">
        <div class="search-input-wrapper">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search extensions by name, source, genre, or description..."
            class="search-input"
          />
          <button
            v-if="searchQuery || selectedRating !== 'all'"
            @click="clearSearch"
            class="clear-btn"
            title="Clear search"
          >
            ✕
          </button>
        </div>

        <div class="filter-section">
          <label class="filter-label">Content Rating:</label>
          <select v-model="selectedRating" class="rating-filter">
            <option value="all">All Ratings</option>
            <option value="SAFE">Safe</option>
            <option value="MATURE">Mature</option>
            <option value="ADULT">Adult</option>
          </select>
        </div>
      </div>

      <!-- Results Summary -->
      <div class="results-summary">
        <span class="results-count">
          Showing {{ filteredExtensions.length }} of {{ extensions.length }} extensions
        </span>
        <span v-if="searchQuery || selectedRating !== 'all'" class="active-filters">
          <span v-if="searchQuery" class="filter-tag">Search: "{{ searchQuery }}"</span>
          <span v-if="selectedRating !== 'all'" class="filter-tag">Rating: {{ selectedRating }}</span>
        </span>
      </div>

      <div class="extensions-grid">
        <div
          v-for="extension in filteredExtensions"
          :key="`${extension.source}-${extension.name}`"
          class="extension-card"
          :class="{ 'selected': selectedExtensions.has(`${extension.source}-${extension.name}`) }"
          @click="toggleExtension(extension)"
        >
          <div class="extension-header">
            <img 
              :src="extension.iconUrl" 
              :alt="`${extension.name} icon`"
              class="extension-icon"
              loading="lazy"
              @error="(e) => (e.target as HTMLImageElement).src = 'https://paperback.moe/pb-placeholder.png'"
            />
            <div class="extension-header-text">
              <h3 class="extension-name">{{ extension.name }}</h3>
              <span class="source-badge" :class="extension.source">
                {{ extension.source === 'inkdex' ? 'Inkdex' : 'Kakarot' }}
              </span>
            </div>
          </div>

          <div v-if="extension.metadata" class="extension-meta">
            <div class="content-rating">
              <span
                class="rating-badge"
                :style="{
                  color: getContentRatingColor(extension.metadata.contentRating),
                  backgroundColor: getContentRatingBg(extension.metadata.contentRating)
                }"
              >
                {{ extension.metadata.contentRating }}
              </span>
            </div>

            <div v-if="extension.metadata.badges && extension.metadata.badges.length > 0" class="extension-badges">
              <span
                v-for="badge in extension.metadata.badges.slice(0, 3)"
                :key="badge.label"
                class="genre-badge"
                :style="{
                  color: badge.textColor,
                  backgroundColor: badge.backgroundColor
                }"
              >
                {{ badge.label }}
              </span>
            </div>

            <div v-if="extension.metadata.language" class="extension-language">
              <span class="language-badge">{{ extension.metadata.language }}</span>
            </div>
          </div>

          <div class="extension-actions" @click.stop>
            <button
              @click="showExtensionDetails(extension)"
              class="details-btn"
            >
              Details
            </button>
          </div>
          
          <div v-if="selectedExtensions.has(`${extension.source}-${extension.name}`)" class="selected-indicator">
            <span class="selected-checkmark">✓ Selected</span>
          </div>
        </div>
      </div>
      
      <!-- Floating Install Button -->
      <div
        v-if="selectedExtensions.size > 0"
        class="floating-install-btn"
      >
        <button
          @click="installSelectedExtensions"
          class="install-selected-btn"
        >
          <span>Install Selected</span>
          <span class="selected-count">{{ selectedExtensions.size }}</span>
        </button>
      </div>

      <div v-if="filteredExtensions.length === 0" class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3>No extensions found</h3>
        <p>Try adjusting your search terms or filters.</p>
        <button @click="clearSearch" class="clear-search-btn">Clear Search</button>
      </div>

      <div v-if="!loading && !error" class="stats">
        Total extensions: {{ extensions.length }}
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