<template>
  <div>
    <div id="map" />
    <div
      v-if="isLoading"
      class="loading-overlay"
    >
      <span>Loading map data...</span>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useGroupMapStore } from '@/stores/groupMapStore.js'
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { storeToRefs } from 'pinia'

const groupStore = useGroupMapStore()
const { selection } = storeToRefs(groupStore)
const map = ref(null)
const markers = ref({})

onMounted(() => {
  map.value = L.map("map").setView([0, 0], 2); // Start with world view
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map.value);
  updateMarkers()
});

watch(() => groupStore.usersInfo, updateMarkers, { deep: true })

watch(selection, (selection) => {
  if (selection.location && map.value) {
    map.value.setView(
      [selection.location.latitude, selection.location.longitude],
      20, // zoom level
      { animate: false }
    )
  }
})

function updateMarkers() {
  const users = groupStore.usersInfo
  users.forEach(user => {
    const location = user.location
    if (!location || !location.latitude || !location.longitude) {
      return
    }
    if (markers.value[user.id]) {
      markers.value[user.id].setLatLng([location.latitude, location.longitude])
      markers.value[user.id].setPopupContent(createPopupContent(user))
    } else {
      markers.value[user.id] = L.marker([location.latitude, location.longitude])
        .bindPopup(createPopupContent(user))
        .addTo(map.value)
    }
  })
  // Remove markers for users no longer in the group
  Object.keys(markers.value).forEach(markerId => {
    if (!users.find(user => user.id === markerId)) {
      map.value.removeLayer(markers.value[markerId])
      delete markers.value[markerId]
    }
  })
  // Fit bounds if we have markers
  if (Object.keys(markers.value).length > 0) {
    const markerPositions = Object.values(markers.value).map(marker => marker.getLatLng())
    map.value.fitBounds(L.latLngBounds(markerPositions).pad(0.1))
  }
}

function createPopupContent(user) {
  return `
    <div class="user-popup">
      <p><strong>${user.name}</strong></p>
      <p>Status: ${user.state}</p>
      <p v-if="${user.lastSeen}">Last seen: ${user.lastSeen}</p>
    </div>
  `
}
</script>

<style scoped>
#map {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 90vh;
  z-index: 0;
}

.loading-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.8);
  padding: 1rem;
  border-radius: 5px;
  z-index: 1;
}

:deep(.user-popup) {
  padding: 10px;
  min-width: 200px;
}

:deep(.user-popup p) {
  margin: 0;
}
</style>
