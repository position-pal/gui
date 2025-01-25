<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <!-- Navbar sempre visibile -->
    <Navbar />

    <!-- Contenuto dinamico delle pagine -->
    <main class="flex-grow-1">
      <router-view />
    </main>

    <!-- Footer opzionale -->
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'App',
  components: {
    Navbar,
  },
}
</script>

<style>
/* Stile personalizzato globale */
</style>
