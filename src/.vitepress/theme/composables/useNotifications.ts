/* SPDX-License-Identifier: GPL-3.0-or-later */
/* Copyright © 2025 Inkdex */

import { ref } from "vue";

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
}

export const useNotifications = () => {
  const notifications = ref<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, "id">) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 11);
    const fullNotification: Notification = {
      id,
      duration: 5000, // 5 seconds default
      ...notification,
    };

    notifications.value.push(fullNotification);

    // Auto-remove notification after duration (unless persistent)
    if (!fullNotification.persistent && fullNotification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, fullNotification.duration);
    }

    return id;
  };

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex((n) => n.id === id);
    if (index !== -1) {
      notifications.value.splice(index, 1);
    }
  };

  const clearNotifications = () => {
    notifications.value = [];
  };

  // Convenience methods
  const showSuccess = (title: string, message?: string) => {
    return addNotification({ type: "success", title, message });
  };

  const showError = (title: string, message?: string) => {
    return addNotification({
      type: "error",
      title,
      message,
      duration: 8000, // Longer duration for errors
      persistent: title.includes("Failed to add repository"), // Make repo errors persistent
    });
  };

  const showWarning = (title: string, message?: string) => {
    return addNotification({ type: "warning", title, message });
  };

  const showInfo = (title: string, message?: string) => {
    return addNotification({ type: "info", title, message });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
