<template>
  <div class="app-wrapper">
    <main class="main-content">
      <router-view />
    </main>
    <TabBar />
  </div>
</template>

<script>
import TabBar from './components/TabBar.vue'

export default {
  name: 'App',
  components: { TabBar },
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
