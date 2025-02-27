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
  height: 100vh; /* L'intera altezza del viewport */
}

.main-content {
  flex: 1;       /* Occupa lo spazio rimanente */
  overflow: auto; /* Permette lo scroll se necessario */
}
</style>
