<template>
  <div class="h-100 group-container p-1">
    <h1 class="mt-3 p-1">Groups</h1>
    <!-- Container scrollabile -->
    <ul class="list-group overflow-auto">
      <li
        v-for="group in groups"
        :key="group.id"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div>
          <h5 class="mb-1">{{ group.name }}</h5>
          <small class="text-muted">{{ group.members }} members</small>
        </div>
        <div class="d-flex gap-2">
          <!-- Pulsante per la localizzazione -->
          <router-link
            class="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
            style="width: 40px; height: 40px"
            to="/map"
          >
            <i class="bi bi-pin-map"></i>
          </router-link>
          <!-- Pulsante per la chat -->
          <router-link
            class="btn btn-success rounded-circle d-flex align-items-center justify-content-center"
            style="width: 40px; height: 40px"
            to="/chat"
          >
            <i class="bi bi-chat"></i>
          </router-link>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'GroupPage',
  data() {
    return {
      groups: [
        { id: 1, name: 'Astro', members: 10 },
        { id: 2, name: 'Star Wars Fans', members: 15 },
        { id: 2, name: 'Placeholder Group', members: 9 },
        { id: 1, name: 'Astro', members: 10 },
        { id: 2, name: 'Star Wars Fans', members: 15 },
        { id: 2, name: 'Placeholder Group', members: 9 },
        { id: 1, name: 'Astro', members: 10 },
        { id: 2, name: 'Star Wars Fans', members: 15 },
        { id: 2, name: 'Placeholder Group', members: 9 },
      ],
    }
  },
  methods: {
    goToLocation(group) {
      // Logica per la localizzazione
      console.log('Vai alla localizzazione di', group.name)
      // Esegui l'azione desiderata, ad es. un redirect o l'apertura di una mappa
    },
    openChat(group) {
      // Logica per la chat
      console.log('Apri la chat per', group.name)
      // Esegui l'azione desiderata, ad es. apri una finestra di chat o esegui un redirect
    },
  },
}
</script>

<style scoped></style>
