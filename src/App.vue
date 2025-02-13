<template>
  <!-- Dynamic Content -->
  <main class="row">
    <router-view />
  </main>

  <div class="row">
    <TabBar />
  </div>
</template>

<script>
import TabBar from './components/TabBar.vue'

export default {
  name: 'App',
  components: {
    TabBar,
  },
}
</script>

<style>
/* Optional custom style */
</style>
