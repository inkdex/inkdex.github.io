<!-- SPDX-License-Identifier: GPL-3.0-or-later -->
<!-- Copyright © 2026 Inkdex -->

<script setup lang="ts">
import { computed } from "vue";
import type { Notification } from "../composables/useNotifications";

interface Props {
  notifications: Notification[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "remove-notification": [id: string];
}>();

const hasNotifications = computed(() => {
  return props.notifications.length > 0;
});

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "success":
      return "✓";
    case "error":
      return "✕";
    case "warning":
      return "⚠";
    case "info":
      return "ℹ";
    default:
      return "ℹ";
  }
};

const removeNotification = (id: string) => {
  emit("remove-notification", id);
};
</script>

<template>
  <Teleport to="body">
    <div v-if="hasNotifications" class="notification-container">
      <TransitionGroup name="notification" tag="div">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="notification"
          :class="`notification-${notification.type}`"
        >
          <div class="notification-content">
            <div class="notification-header">
              <span class="notification-icon">
                {{ getNotificationIcon(notification.type) }}
              </span>
              <span class="notification-title">{{ notification.title }}</span>
              <button
                class="notification-close"
                @click="removeNotification(notification.id)"
              >
                ✕
              </button>
            </div>
            <div v-if="notification.message" class="notification-message">
              {{ notification.message }}
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
  max-width: 400px;
}

.notification {
  pointer-events: auto;
  margin-bottom: 10px;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.notification-success {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-border);
}

.notification-error {
  background: var(--vp-c-danger-soft);
  color: var(--vp-c-danger);
  border-color: var(--vp-c-danger);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

.notification-warning {
  background: var(--vp-c-yellow-soft);
  color: var(--vp-c-yellow-1);
  border-color: var(--vp-c-yellow-1);
}

.notification-info {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-border);
}

.notification-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.notification-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.notification-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.notification-title {
  flex: 1;
}

.notification-close {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
  font-size: 16px;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.notification-close:hover {
  opacity: 1;
}

.notification-message {
  font-size: 14px;
  opacity: 0.9;
  line-height: 1.4;
}

/* Transition animations */
.notification-enter-active {
  transition: all 0.3s ease-out;
}

.notification-leave-active {
  transition: all 0.3s ease-in;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>
