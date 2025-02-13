<template>
  <main class="main-content">
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
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
