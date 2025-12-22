/* SPDX-License-Identifier: GPL-3.0-or-later */
/* Copyright © 2025 Inkdex */

/**
 * Shared UI utility functions to eliminate code duplication across components
 */

/**
 * Formats content rating from "SAFE" -> "Safe", "MATURE" -> "Mature", etc.
 * Consolidated duplicate implementations from ExtensionCard, ExtensionDetails, and FilterPanel
 */
export const formatRating = (rating: string): string => {
  return rating.charAt(0) + rating.slice(1).toLowerCase();
};

/**
 * Pre-computed Map for O(1) badge color lookups
 * Optimizes performance for 500+ badge renders per cycle
 */
const DEFAULT_BADGE_COLORS = new Map([
  ["Action", { textColor: "#ffffff", backgroundColor: "rgb(239, 68, 68)" }],
  ["Romance", { textColor: "#ffffff", backgroundColor: "rgb(236, 72, 153)" }],
  ["Comedy", { textColor: "#ffffff", backgroundColor: "rgb(245, 158, 11)" }],
  ["Drama", { textColor: "#ffffff", backgroundColor: "rgb(59, 130, 246)" }],
  ["Fantasy", { textColor: "#ffffff", backgroundColor: "rgb(168, 85, 247)" }],
  ["Horror", { textColor: "#ffffff", backgroundColor: "rgb(239, 68, 68)" }],
  ["Mystery", { textColor: "#ffffff", backgroundColor: "rgb(107, 114, 128)" }],
  [
    "Psychological",
    { textColor: "#ffffff", backgroundColor: "rgb(139, 92, 246)" },
  ],
  ["Sci-Fi", { textColor: "#ffffff", backgroundColor: "rgb(14, 165, 233)" }],
  [
    "Slice of Life",
    { textColor: "#ffffff", backgroundColor: "rgb(34, 197, 94)" },
  ],
  ["Sports", { textColor: "#ffffff", backgroundColor: "rgb(251, 146, 60)" }],
  ["Thriller", { textColor: "#ffffff", backgroundColor: "rgb(220, 38, 38)" }],
  ["Adventure", { textColor: "#ffffff", backgroundColor: "rgb(16, 185, 129)" }],
  ["Historical", { textColor: "#ffffff", backgroundColor: "rgb(120, 53, 15)" }],
  [
    "Martial Arts",
    { textColor: "#ffffff", backgroundColor: "rgb(217, 70, 239)" },
  ],
  ["Mecha", { textColor: "#ffffff", backgroundColor: "rgb(6, 182, 212)" }],
  ["Military", { textColor: "#ffffff", backgroundColor: "rgb(75, 85, 99)" }],
  ["Music", { textColor: "#ffffff", backgroundColor: "rgb(236, 72, 153)" }],
  ["School", { textColor: "#ffffff", backgroundColor: "rgb(34, 197, 94)" }],
  [
    "Supernatural",
    { textColor: "#ffffff", backgroundColor: "rgb(168, 85, 247)" },
  ],
]);

/**
 * Get badge colors from pre-computed Map with fallback to dynamic badge data
 * Optimized for O(1) lookup instead of O(n) object traversal
 */
export const getBadgeColors = (
  badge:
    | { textColor: string; backgroundColor: string; label?: string }
    | undefined,
): { textColor: string; backgroundColor: string } => {
  // First try pre-computed colors for common labels
  if (badge?.label && DEFAULT_BADGE_COLORS.has(badge.label)) {
    return DEFAULT_BADGE_COLORS.get(badge.label)!;
  }

  // Fall back to the actual badge colors or default
  return (
    badge || {
      textColor: "#ffffff",
      backgroundColor: "#808080",
    }
  );
};

/**
 * Validate content rating against allowed values
 * Consolidated validation logic used across multiple components
 */
export const CONTENT_RATINGS = ["SAFE", "MATURE", "ADULT"] as const;
export type ContentRating = (typeof CONTENT_RATINGS)[number];

export const isValidContentRating = (
  rating: string,
): rating is ContentRating => {
  return CONTENT_RATINGS.includes(rating as ContentRating);
};
