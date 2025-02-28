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
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { storeToRefs } from 'pinia'

const groupStore = useGroupMapStore()
const { selection, usersInfo } = storeToRefs(groupStore)
const map = ref(null)
const markers = ref({})
const routes = ref({})
const isLoading = ref(false)

onMounted(() => {
  map.value = L.map("map").setView([0, 0], 2)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map.value)
  updateMarkers()
})

// Aggiorna marker e percorso ad ogni modifica dei dati
watch(usersInfo, updateMarkers, { deep: true })

// Quando viene aggiornata la selezione, centra la mappa sulla posizione dell'utente selezionato
watch(selection, (newSelection) => {
  if (newSelection) {
    if(newSelection.userId) {
      const selectedUser = usersInfo.value.find(u => u.id === newSelection.userId)
      if (selectedUser && selectedUser.location && selectedUser.location.latitude && selectedUser.location.longitude) {
        if(selectedUser.tracking && selectedUser.tracking.length > 1) {
          const coordinates = selectedUser.tracking.map(p => [p.location.latitude, p.location.longitude])
          const polyline = L.polyline(coordinates)
          map.value.fitBounds(polyline.getBounds(), { padding: [50, 50] })
        } else {
          map.value.setView(
            [selectedUser.location.latitude, selectedUser.location.longitude],
            16,
            { animate: true }
          )
        }
      }
    } else if (newSelection.location) {
      map.value.setView(
        [newSelection.location.latitude, newSelection.location.longitude],
        16,
        { animate: true }
      )
    }
  }
})

function updateMarkers() {
  // Rimuove tutti i circle marker dei punti di tracking dalla mappa
  map.value.eachLayer(layer => {
    if (layer.options && layer.options.className === 'route-point') {
      map.value.removeLayer(layer)
    }
  })

  // Rimuove le vecchie linee dei percorsi
  Object.values(routes.value).forEach(route => {
    map.value.removeLayer(route)
  })
  routes.value = {}

  const users = usersInfo.value
  users.forEach(user => {
    const location = user.location
    if (!location || !location.latitude || !location.longitude) return

    // Aggiorna o crea il marker utente
    if (markers.value[user.id]) {
      markers.value[user.id].setLatLng([location.latitude, location.longitude])
      markers.value[user.id].setPopupContent(createPopupContent(user))
    } else {
      markers.value[user.id] = L.marker([location.latitude, location.longitude])
        .bindPopup(createPopupContent(user))
        .addTo(map.value)
    }

    // Disegna il percorso solo per l'utente selezionato
    if (
      selection.value &&
      selection.value.userId === user.id &&
      user.tracking &&
      user.tracking.length > 1
    ) {
      const coordinates = user.tracking.map(p => [p.location.latitude, p.location.longitude])
      const polyline = L.polyline(coordinates, {
        color: '#1a7fab',
        weight: 4,
        opacity: 0.7,
        className: 'user-route'
      }).addTo(map.value)
      routes.value[user.id] = polyline

      // Aggiunge i punti del percorso con tooltip che mostrano il timestamp
      coordinates.forEach((coord, index) => {
        const timestamp = user.tracking[index].timestamp
        L.circleMarker(coord, {
          radius: 6,
          fillColor: '#f31f77',
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9,
          className: 'route-point'
        })
          .bindTooltip(timestamp, { permanent: false, direction: 'top' })
          .addTo(map.value)
      })
    }
  })

  // Rimuove i marker degli utenti non più presenti
  Object.keys(markers.value).forEach(markerId => {
    if (!users.find(user => user.id === markerId)) {
      map.value.removeLayer(markers.value[markerId])
      delete markers.value[markerId]
    }
  })

  // Se nessun utente è selezionato, centra la mappa su tutti i marker
  if (!selection.value) {
    const markerKeys = Object.keys(markers.value)
    if (markerKeys.length > 0) {
      const markerPositions = markerKeys.map(key => markers.value[key].getLatLng())
      map.value.fitBounds(L.latLngBounds(markerPositions).pad(0.1))
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
