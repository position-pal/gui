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
import { nextTick, onMounted, ref, watch } from 'vue'
import { useGroupMapStore } from '@/stores/groupMapStore.js'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { storeToRefs } from 'pinia'
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

const groupStore = useGroupMapStore()
const { selection, usersInfo } = storeToRefs(groupStore)
const map = ref(null)
const markers = ref({})
const routes = ref({})
const isLoading = ref(false)
const userInteracted = ref(false)
const zoomChanged = ref(false)

onMounted(() => {
  groupStore.clearSelection()
  map.value = L.map("map").setView([0, 0], 2)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map.value)
  updateMarkers()
  map.value.on('movestart', () => { userInteracted.value = true })
  map.value.on('zoomstart', () => {
    userInteracted.value = true
    zoomChanged.value = true
  })
})
watch(selection, () => {
  nextTick(() => {
    userInteracted.value = false
    updateMarkers()
  })
}, { deep: true })
watch(usersInfo, updateMarkers, { deep: true })
watch(selection, updateMarkers)

function updateMarkers() {
  // Remove all route point circle markers
  map.value.eachLayer(layer => {
    if (layer.options && layer.options.className === 'route-point') {
      map.value.removeLayer(layer)
    }
  })
  // Remove old polylines
  Object.values(routes.value).forEach(route => map.value.removeLayer(route))
  routes.value = {}
  const users = usersInfo.value
  users.forEach(user => {
    if (!user.location?.latitude || !user.location?.longitude) return
    if (markers.value[user.id]) {
      markers.value[user.id].setLatLng([user.location.latitude, user.location.longitude])
      markers.value[user.id].setPopupContent(createPopupContent(user))
    } else {
      markers.value[user.id] = L.marker([user.location.latitude, user.location.longitude], {
        icon: L.icon({
          iconUrl: markerIconPng,
          shadowUrl: markerShadowPng,
          iconSize: [25, 41],
          iconAnchor: [12, 41]
        })
      }).bindPopup(createPopupContent(user)).addTo(map.value)
    }
    if (selection.value?.userId === user.id && user.tracking?.length > 1) {
      const coordinates = user.tracking.map(p => [p.location.latitude, p.location.longitude])
      const polyline = L.polyline(coordinates, {
        color: '#1a7fab', weight: 4, opacity: 0.7, className: 'user-route'
      }).addTo(map.value)
      routes.value[user.id] = polyline
      coordinates.forEach((coord, index) => {
        L.circleMarker(coord, {
          radius: 6, fillColor: '#f31f77', color: '#fff', weight: 2,
          opacity: 1, fillOpacity: 0.9, className: 'route-point'
        }).bindTooltip(user.tracking[index].timestamp, { permanent: false, direction: 'top' })
          .addTo(map.value)
      })
    }
  })
  // Remove markers for users that are no longer in the list
  Object.keys(markers.value).forEach(markerId => {
    if (!users.find(user => user.id === markerId)) {
      map.value.removeLayer(markers.value[markerId])
      delete markers.value[markerId]
    }
  })
  const selectedUser = users.find(u => u.id === selection.value?.userId)
  if (selectedUser && selectedUser.location) {
    const userLatLng = [selectedUser.location.latitude, selectedUser.location.longitude]
    if (!userInteracted.value) {
      // If the user has NOT interacted, center on them and update the zoom
      const newZoom = 15
      map.value.flyTo(userLatLng, newZoom, { animate: true, duration: 1 })
    } else {
      // If the user has interacted, follow the position without changing the zoom
      map.value.panTo(userLatLng, { animate: true, duration: 1 })
    }
  } else {
    // If the selected user has no location, center on all markers
    const markerPositions = Object.values(markers.value).map(marker => marker.getLatLng())
    if (markerPositions.length > 0 && !userInteracted.value) {
      map.value.flyToBounds(L.latLngBounds(markerPositions).pad(0.1), { animate: true, duration: 1 })
    }
  }
}

function createPopupContent(user) {
  return `
    <div class="user-popup">
      <p><strong>${user.name}</strong></p>
      <p>Status: ${user.state}</p>
      ${user.lastSeen ? `<p>Last seen: ${user.lastSeen}</p>` : ''}
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
