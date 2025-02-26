<template>
  <div class="h-100 group-container p-1">
    <div class="position-fixed fixed-top d-flex justify-content-between align-items-center" style="background-color: white">
      <h1 class="mt-3 p-1" style="margin-left: 3%">Groups</h1>
      <button class="btn btn-primary rounded-circle mr-1 align-items-center" style="width: 40px; height: 40px; margin-right: 6%; margin-top: 3%">
        <i class="bi bi-plus"></i>
      </button>
    </div>
    <ul class="list-group overflow-auto" style="margin-top: 10vh">
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
            <i class="bi bi-pin-map" />
          </router-link>
          <!-- Pulsante per la chat -->
          <router-link
            class="btn btn-success rounded-circle d-flex align-items-center justify-content-center"
            style="width: 40px; height: 40px"
            to="/chat"
          >
            <i class="bi bi-chat"></i>
          </router-link>
          <router-link
            class="btn btn-info rounded-circle d-flex align-items-center justify-content-center"
            style="width: 40px; height: 40px"
            :to="`/groups/${group.id}`"
          >
            <i class="bi bi-three-dots"></i>
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
}
</script>

<style scoped></style>
