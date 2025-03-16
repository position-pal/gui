<template>
  <div
    v-if="notification"
    class="notification-container"
  >
    <div
      class="notification-banner"
      :class="{ show: showNotification }"
    >
      <div class="notification-content">
        <span class="notification-title">{{ notification.title }}</span>
        <p class="notification-body">
          {{ notification.body }}
        </p>
      </div>
      <button
        class="close-button"
        @click="hideNotification"
      >
        ×
      </button>
    </div>
  </div>
</template>

<script>
import { useGroupMapStore } from '@/stores/groupMapStore.js'

export default {
  data() {
    return {
      notification: null,
      showNotification: false,
      timeoutId: null,
      reloadOnClose: false,
      mapStore: null,
    }
  },
  created() {
    this.mapStore = useGroupMapStore()
  },
  methods: {
    show(notification, options = {}) {
      this.notification = notification
      this.showNotification = true
      this.reloadOnClose = options.reloadOnClose || false
      if (this.timeoutId) {
        clearTimeout(this.timeoutId)
      }
      this.timeoutId = setTimeout(() => {
        this.hideNotification()
      }, options.timeout || 8_000)
    },
    hideNotification() {
      this.showNotification = false
      setTimeout(() => {
        this.notification = null
        if (this.reloadOnClose) {
          console.debug("Reloading group sessions")
          this.mapStore.fetchGroupSessions()
        }
      }, 300)
    }
  }
}
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.notification-banner {
  background: #ffffff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 1rem;
  margin: 1rem;
  border-radius: 8px;
  transform: translateY(-150%);
  transition: transform 0.3s ease-out;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-banner.show {
  transform: translateY(0);
}

.notification-content {
  flex-grow: 1;
}

.notification-title {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0 0.5rem;
}
</style>
