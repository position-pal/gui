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
.app-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-content {
  flex: 1; /* This will make the main content take up the remaining space */
  overflow: auto; /* This will make the main content scrollable */
}
</style>
