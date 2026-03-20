/* SPDX-License-Identifier: GPL-3.0-or-later */
/* Copyright © 2025 Inkdex */

import { ref } from "vue";
import { LANGUAGE_EMOJI_MAP, LANGUAGE_NAMES_MAP } from "./languageData";

export interface ExtensionMetadata {
  id: string;
  name: string;
  description: string;
  version: string;
  icon: string;
  language: string | null;
  contentRating: "SAFE" | "MATURE" | "ADULT";
  badges: Array<{
    label: string;
    textColor: string;
    backgroundColor: string;
  }>;
  capabilities: number | number[];
  developers: Array<{
    name: string;
    website?: string | null;
    github?: string | null;
  }>;
}

export interface Extension {
  name: string;
  source: string;
  url: string;
  html_url: string;
  metadata?: ExtensionMetadata;
  iconUrl?: string;
  repoId?: string;
  sourceRepo?: string;
}

export interface CustomRepository {
  id: string;
  name: string;
  owner: string;
  branch: string;
  displayName: string;
}

const STORAGE_KEY = "inkdex-custom-repositories";
const DEFAULT_REPOS: Omit<CustomRepository, "displayName">[] = [
  { id: "inkdex", name: "extensions", owner: "inkdex", branch: "master" },
];

export const getContentRatingColor = (rating: string): string => {
  switch (rating) {
    case "ADULT":
      return "var(--vp-c-red-1)";
    case "MATURE":
      return "var(--vp-c-yellow-1)";
    case "SAFE":
      return "var(--vp-c-green-1)";
    default:
      return "var(--vp-c-text-2)";
  }
};

export const getContentRatingBg = (rating: string): string => {
  switch (rating) {
    case "ADULT":
      return "var(--vp-c-red-soft)";
    case "MATURE":
      return "var(--vp-c-yellow-soft)";
    case "SAFE":
      return "var(--vp-c-green-soft)";
    default:
      return "var(--vp-c-bg-soft)";
  }
};

// Map common language strings to valid IETF language tags
export const normalizeLanguageTag = (language: string | null): string => {
  if (!language) return "en";

  const langMap: Record<string, string> = {
    english: "en",
    en: "en",
    spanish: "es",
    es: "es",
    french: "fr",
    fr: "fr",
    german: "de",
    de: "de",
    italian: "it",
    it: "it",
    portuguese: "pt",
    pt: "pt",
    russian: "ru",
    ru: "ru",
    japanese: "ja",
    ja: "ja",
    chinese: "zh",
    zh: "zh",
    korean: "ko",
    ko: "ko",
    arabic: "ar",
    ar: "ar",
    turkish: "tr",
    tr: "tr",
    polish: "pl",
    pl: "pl",
    dutch: "nl",
    nl: "nl",
    indonesian: "id",
    id: "id",
    thai: "th",
    th: "th",
    vietnamese: "vi",
    vi: "vi",
    hindi: "hi",
    hi: "hi",
  };

  const normalized = language.toLowerCase().trim();
  return langMap[normalized] || normalized;
};

// Get full language name from language code
export const getLanguageName = (language: string | null): string => {
  if (!language) return "English";

  const normalized = normalizeLanguageTag(language);

  if (normalized.toLowerCase() === "multi") {
    return "Multi Language";
  }

  return (
    LANGUAGE_NAMES_MAP[normalized] ||
    normalized.charAt(0).toUpperCase() + normalized.slice(1)
  );
};

// Get flag emoji for language code
export const getLanguageEmoji = (language: string | null): string | null => {
  if (!language) return null;

  const normalized = normalizeLanguageTag(language);

  if (normalized.toLowerCase() === "multi") {
    return "🌐";
  }

  return LANGUAGE_EMOJI_MAP[normalized] || null;
};

export const buildIconUrl = (
  repo: { owner: string; name: string; branch: string },
  extensionId: string,
  iconPath: string,
): string => {
  return `https://${repo.owner}.github.io/${repo.name}/0.9/stable/${extensionId}/static/${iconPath}`;
};

export const buildBaseUrl = (repo: {
  owner: string;
  name: string;
  branch: string;
}): string => {
  return `https://raw.githubusercontent.com/${repo.owner}/${repo.name}/${repo.branch}/0.9/stable`;
};

const INKDEX_CATEGORY_TO_REPO: Record<string, string> = {
  "general-extensions": "inkdex/general-extensions",
  "madara-extensions": "inkdex/madara-extensions",
  "mangabox-extensions": "inkdex/mangabox-extensions",
  "mangastream-extensions": "inkdex/mangastream-extensions",
  "mangaworld-extensions": "inkdex/mangaworld-extensions",
  "liliana-extensions": "inkdex/liliana-extensions",
  "animace-extensions": "inkdex/animace-extensions",
  "tracker-extensions": "inkdex/tracker-extensions",
};

export const fetchInkdexMetadata = async (): Promise<Record<
  string,
  string
> | null> => {
  const url =
    "https://raw.githubusercontent.com/inkdex/extensions/refs/heads/master/0.9/stable/metadata.json";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();

    const extensionToRepo: Record<string, string> = {};

    for (const [category, extensions] of Object.entries(data)) {
      const repo = INKDEX_CATEGORY_TO_REPO[category];
      if (!repo) continue;

      for (const extName of Object.keys(extensions as object)) {
        extensionToRepo[extName] = repo;
      }
    }

    return extensionToRepo;
  } catch (error) {
    console.error("Failed to fetch Inkdex metadata:", error);
    return null;
  }
};

export const getInkdexSourceRepo = (
  extensionName: string,
  inkdexMetadata: Record<string, string> | null,
): string | null => {
  return inkdexMetadata?.[extensionName] || null;
};

export const fetchVersioningJson = async (repo: {
  owner: string;
  name: string;
  branch: string;
}): Promise<{ sources: ExtensionMetadata[] } | null> => {
  const url = `https://raw.githubusercontent.com/${repo.owner}/${repo.name}/${repo.branch}/0.9/stable/versioning.json`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(
      `Failed to fetch metadata from ${repo.owner}/${repo.name}:`,
      errorMessage,
    );

    return null;
  }
};

// Capability flags (SourceIntents)
const CAPABILITY_CHAPTER_PROVIDING = 1 << 0; // 1
const CAPABILITY_MANGA_PROGRESS_PROVIDING = 1 << 1; // 2
const CAPABILITY_CLOUDFLARE_BYPASS_PROVIDING = 1 << 4; // 16

const hasCapability = (
  capabilities: number | number[],
  flag: number,
): boolean => {
  if (Array.isArray(capabilities)) {
    return capabilities.indexOf(flag) !== -1;
  }
  return (capabilities & flag) === flag;
};

export const hasChapterProviding = (capabilities: number | number[]): boolean =>
  hasCapability(capabilities, CAPABILITY_CHAPTER_PROVIDING);

export const hasMangaProgressProviding = (
  capabilities: number | number[],
): boolean => hasCapability(capabilities, CAPABILITY_MANGA_PROGRESS_PROVIDING);

export const hasCloudflareBypassProviding = (
  capabilities: number | number[],
): boolean =>
  hasCapability(capabilities, CAPABILITY_CLOUDFLARE_BYPASS_PROVIDING);

// Local Storage
export const loadCustomRepos = (): CustomRepository[] => {
  if (typeof localStorage === "undefined") return [];

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const repos = JSON.parse(stored);
      // Filter out any malformed repositories
      return repos.filter(
        (repo: CustomRepository) =>
          repo &&
          repo.owner &&
          repo.name &&
          repo.owner.length > 0 &&
          repo.name.length > 0,
      );
    } catch (e) {
      console.error("Failed to parse custom repos from localStorage:", e);
      // Clear corrupted data
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
  }
  return [];
};

export const saveCustomRepos = (repos: CustomRepository[]): void => {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(repos));
};

export const checkBranchExists = async (
  owner: string,
  name: string,
  branch: string,
): Promise<boolean> => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${name}/branches/${branch}`,
    );
    return response.ok;
  } catch {
    return false;
  }
};

export const getDefaultBranch = async (
  owner: string,
  name: string,
): Promise<string> => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${name}`,
    );
    if (response.ok) {
      const data = await response.json();
      return data.default_branch;
    }
  } catch {
    // Fall through to default
  }
  return "main";
};

export const useExtensions = () => {
  const extensions = ref<Extension[]>([]);
  const loading = ref(true);
  const error = ref<string | null>(null);
  const customRepos = ref<CustomRepository[]>([]);
  const inkdexMetadata = ref<Record<string, string> | null>(null);

  const loadRepos = () => {
    customRepos.value = loadCustomRepos();
  };

  const getAllRepos = (): CustomRepository[] => {
    const defaultWithDisplay = DEFAULT_REPOS.map((r) => ({
      ...r,
      displayName: `${r.owner}/${r.name}`,
    }));
    return [...defaultWithDisplay, ...customRepos.value];
  };

  const fetchAllExtensions = async (showLoading = true): Promise<void> => {
    if (showLoading) {
      loading.value = true;
    }
    error.value = null;

    try {
      const [inkdexMeta, ...metadataResultsRaw] = await Promise.all([
        fetchInkdexMetadata(),
        ...getAllRepos().map(async (repo) => {
          const data = await fetchVersioningJson(repo);
          return data ? { repo, data } : null;
        }),
      ]);

      inkdexMetadata.value = inkdexMeta;

      const metadataResults = metadataResultsRaw.filter((r) => r !== null);

      const allExtensions: Extension[] = [];

      for (const metaResult of metadataResults) {
        if (!metaResult) continue;
        const { repo, data } = metaResult;

        // Always use versioning.json data directly - no need to fetch contents separately
        for (const source of data.sources) {
          const sourceRepo =
            repo.id === "inkdex" && inkdexMeta
              ? inkdexMeta[source.id]
              : undefined;

          allExtensions.push({
            name: source.id,
            source: repo.id,
            url: `${buildBaseUrl(repo)}/${source.id}/index.js`,
            html_url: `https://github.com/${repo.owner}/${repo.name}/tree/${repo.branch}/0.9/stable/${source.id}`,
            metadata: source,
            repoId: repo.id,
            iconUrl: source.icon
              ? buildIconUrl(repo, source.id, source.icon)
              : "https://paperback.moe/pb-placeholder.png",
            sourceRepo,
          });
        }
      }

      extensions.value = allExtensions.sort((a, b) =>
        a.name.localeCompare(b.name),
      );
    } catch (e) {
      error.value = e instanceof Error ? e.message : "An error occurred";
    } finally {
      if (showLoading) {
        loading.value = false;
      }
    }
  };

  const fetchExtensionsForRepo = async (
    repo: CustomRepository,
  ): Promise<void> => {
    try {
      const data = await fetchVersioningJson(repo);
      if (!data) return;

      const inkdexMeta = await fetchInkdexMetadata();
      inkdexMetadata.value = inkdexMeta;

      const newExtensions: Extension[] = [];

      for (const source of data.sources) {
        const sourceRepo =
          repo.id === "inkdex" && inkdexMeta
            ? inkdexMeta[source.id]
            : undefined;

        newExtensions.push({
          name: source.id,
          source: repo.id,
          url: `${buildBaseUrl(repo)}/${source.id}/index.js`,
          html_url: `https://github.com/${repo.owner}/${repo.name}/tree/${repo.branch}/0.9/stable/${source.id}`,
          metadata: source,
          repoId: repo.id,
          iconUrl: source.icon
            ? buildIconUrl(repo, source.id, source.icon)
            : "https://paperback.moe/pb-placeholder.png",
          sourceRepo,
        });
      }

      const existingBySource = new Map(
        extensions.value
          .filter((e) => e.source !== repo.id)
          .map((e) => [e.name, e]),
      );

      for (const ext of newExtensions) {
        existingBySource.set(ext.name, ext);
      }

      extensions.value = Array.from(existingBySource.values()).sort((a, b) =>
        a.name.localeCompare(b.name),
      );
    } catch (e) {
      console.error(`Failed to fetch extensions for ${repo.id}:`, e);
    }
  };

  const addCustomRepo = async (
    repoUrl: string,
  ): Promise<{ success: boolean; error?: string }> => {
    let owner = "";
    let name = "";
    let branch = "";

    const url = repoUrl.trim();

    if (url.indexOf("github.com/") !== -1) {
      // Remove protocol prefix if present to avoid parsing issues
      const cleanUrl = url.replace(/^https?:\/\//, "");
      const match = cleanUrl.match(
        // eslint-disable-next-line
        /github\.com\/([^\/]+)\/([^\/]+)(?:\/tree\/([^\/]+))?/,
      );
      if (match) {
        owner = match[1] || "";
        name = match[2] || "";
        if (match[3]) branch = match[3];
      }
    } else if (url.indexOf("/") !== -1) {
      const parts = url.split("/");
      if (parts.length >= 2) {
        owner = parts[0] || "";
        name = parts[1] || "";
      }
    }

    if (!owner || !name) {
      return {
        success: false,
        error:
          "Invalid repository URL. Please use format: owner/repo or https://github.com/owner/repo",
      };
    }

    name = name.replace(/\.git$/, "");

    // Auto-detect branch
    if (!branch) {
      const hasGhPages = await checkBranchExists(owner, name, "gh-pages");
      branch = hasGhPages ? "gh-pages" : await getDefaultBranch(owner, name);
    }

    const id = `${owner}/${name}`;
    const existing = customRepos.value.find((r) => r.id === id);
    if (existing) {
      // Duplicate found, return success (treat as successful no-op)
      return { success: true };
    }

    const repo: CustomRepository = {
      id,
      name,
      owner,
      branch,
      displayName: `${owner}/${name}`,
    };

    customRepos.value.push(repo);
    saveCustomRepos(customRepos.value);

    return { success: true };
  };

  const removeCustomRepo = async (repoId: string): Promise<void> => {
    customRepos.value = customRepos.value.filter((r) => r.id !== repoId);
    saveCustomRepos(customRepos.value);

    // Re-fetch extensions to remove extensions from the removed repo
    await fetchAllExtensions(false);
  };

  return {
    extensions,
    loading,
    error,
    customRepos,
    inkdexMetadata,
    loadRepos,
    getAllRepos,
    fetchAllExtensions,
    fetchExtensionsForRepo,
    addCustomRepo,
    removeCustomRepo,
  };
};
