<template>
  <!-- Dynamic Content -->
  <main>
    <router-view />
  </main>

  <TabBar />
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
