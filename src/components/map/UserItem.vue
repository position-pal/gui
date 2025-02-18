<template>
  <div class="person-item">
    <div class="icon">
      <i class="bi bi-person-circle"></i>
    </div>
    <div class="info">
      <h4>
        {{ user.name }}
        <span class="info-badge" :style="{ background: colorForStatus(user.state) }">{{ user.state }}</span>
      </h4>
      <p>{{ user.location }} • {{ user.lastSeen }}</p>
    </div>
    <div class="distance info-badge">{{ distance }} km</div>
  </div>
</template>

<script setup>
import { useLocationStore } from '@/stores/locationStore.js'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const store = useLocationStore()
const { currentPosition } = storeToRefs(store)
const distance = ref("N/A")

const updateDistance = async () => {
  if (currentPosition.value && props.user.location) {
    distance.value = Math.trunc(store.calculateDistance(props.user.location)) || "N/A"
  }
}

watch(currentPosition, updateDistance)
watch(() => props.user.location, updateDistance, { deep: true })

onMounted(() => {
  store.startTracking()
  updateDistance()
})

onUnmounted(() => store.stopTracking())

// Styling utility functions

const colorForStatus = (status) => {
  switch (status) {
    case 'ACTIVE': return '#1AAB8A';
    case 'SOS': return '#FF0000';
    case 'WARNING': return '#ff8800';
    case 'ROUTING': return '#8063d2';
    default: return '#887776';
  }
}
</script>

<style scoped>
.icon {
  font-size: 22px;
  color: #1d93c8;
  margin-right: 10px;
}
.person-item {
  display: flex;
  align-items: center;
  padding: 5px;
  border-radius: 10px;
  border-bottom: 1px solid #ddd;
}
.person-item:hover {
  background: #D6F5EE;
  border-radius: 10px;
  transition: background 0.6s ease-in-out;
}
.person-item h4 {
  color: #1d93c8;
  font-size: 16px;
  margin: 0;
}
.info {
  flex: 1;
  padding: 5px;
  font-size: 14px;
}
.info h4 {
  margin-bottom: 3px;
}
.info p {
  margin: 0;
}
.info-badge {
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
  color: white;
}
.distance {
  background: #1d93c8;
}
</style>
