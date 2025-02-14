<template>
  <div id="map"></div>
</template>

<script>
import { onMounted } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default {
  setup() {
    onMounted(() => {
      const map = L.map("map").setView([37.7749, -122.4194], 12); // San Francisco

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      const people = [
        { name: "Elton Lin", lat: 37.802, lng: -122.405 },
        { name: "Christine Huang", lat: 37.332, lng: -122.031 },
        { name: "Orkun Kucuksevim", lat: 37.779, lng: -122.419 },
      ];

      people.forEach(person => {
        L.marker([person.lat, person.lng]).addTo(map)
          .bindPopup(`<b>${person.name}</b>`);
      });
    });
  }
};
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
</style>
