<template>
  <div class="app-wrapper">
    <NotificationComponent ref="notificationBanner" />
    <main class="main-content">
      <router-view />
    </main>
    <TabBar />
  </div>
</template>

<script>
import TabBar from './components/TabBar.vue'
import NotificationComponent from './components/NotificationComponent.vue'
import { setupForegroundNotifications } from '@/scripts/firebase-notifications.js'

export default {
  name: 'App',
  components: { TabBar, NotificationComponent },
  mounted() {
    this.$nextTick(() => {
      setupForegroundNotifications(this.$refs.notificationBanner)
    })
  }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden; /* Avoid horizontal scrollbars */
  overflow-y: hidden; /* Avoid vertical scrollbars */
}

.app-wrapper {
  display: flex;
  flex-direction: column;
  height: 100dvh;
}

.main-content {
  flex: 1; /* This will make the main content take up the remaining space */
  overflow: auto; /* This will make the main content scrollable */
}
</style>
