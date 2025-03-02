<template>
  <div
    class="user-item"
    @click="handleUserClick"
  >
    <div class="icon">
      <img
        :src="`https://ui-avatars.com/api/?background=random&name=${name}+${surname}`"
        alt="Avatar"
        class="profile-avatar"
      >
    </div>
    <div class="info">
      <h4>
        {{ localUser.name }} {{ localUser.surname }}
        <span
          class="info-badge"
          :style="{ background: colorForStatus(localUser.state) }"
        >{{ localUser.state }}</span>
      </h4>
      <p v-if="localUser.lastSeen">
        {{ address }} • {{ localUser.location }} • {{ localUser.lastSeen }}
      </p>
    </div>
    <div class="distance info-badge">
      {{ distance }} km
    </div>
  </div>
</template>

<script setup>
import { useLocationStore } from '@/stores/locationStore.js'
import { useGroupMapStore } from '@/stores/groupMapStore.js'
import { useUserGroupsStore } from '@/stores/userGroupsStore.js'
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { getAddressFromCoordinates } from '@/scripts/geo.js'
import * as turf from '@turf/turf'

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
})

const locationStore = useLocationStore()
const groupMapStore = useGroupMapStore()
const userGroupsStore = useUserGroupsStore()
const { currentPosition } = storeToRefs(locationStore)

const distance = ref("N/A")
const localUser = reactive({ ...props.user })
const address = ref('')
let websocketUnsubscribe = null
const { name, surname } = localUser
const groupId = groupMapStore.groupId;

const hasLocation = computed(() => {
  return localUser.location &&
    typeof localUser.location.latitude === 'number' &&
    typeof localUser.location.longitude === 'number';
})

watch(() => props.user, (newUser) => Object.assign(localUser, newUser), { deep: true })
watch(currentPosition, updateDistance)
watch(() => localUser.location, updateDistance, { deep: true })
watch(() => localUser.location, updateAddress, { deep: true })

onMounted(() => {
  locationStore.startTracking()
  updateDistance()
  updateAddress()
  websocketUnsubscribe = userGroupsStore.addGroupMessageListener(groupId, handleWebsocketMessage)
  console.debug(`Subscribed to group messages of ${groupId}::${localUser.id}`)
})

onUnmounted(() => {
  if (websocketUnsubscribe) {
    websocketUnsubscribe()
    console.debug(`Unsubscribed from group messages of ${groupId}::${localUser.id}`)
  }
})

const handleUserClick = () => {
  const success = groupMapStore.selectUser(localUser.id)
  if (!success && hasLocation.value) {
    console.warn('User location not available')
  }
}

async function updateDistance() {
  if (currentPosition.value && localUser.location) {
    const dist = locationStore.calculateDistance(localUser.location);
    distance.value = dist != null ? Math.round(dist) : "N/A";
  }
}

async function updateAddress() {
  try {
    if (hasLocation.value) {
      if (turf.distance(
        turf.point([
          currentPosition.value.coordinates.longitude,
          currentPosition.value.coordinates.latitude
        ]),
        turf.point([localUser.location.longitude, localUser.location.latitude]),
        { units: 'meters' }
      ) > 20) {
        const addrInfo = await getAddressFromCoordinates(localUser.location.latitude, localUser.location.longitude);
        console.log(addrInfo)
        address.value = JSON.stringify(addrInfo);
      }
    }
  } catch (error) {
    console.error('Failed to get address:', error)
  }
}

function handleWebsocketMessage(message) {
  if (message && message.UserUpdate) {
    const { user, group, position, status, timestamp } = message.UserUpdate
    if (user === localUser.id && group === groupId) {
      const sessionData = {
        state: status.toUpperCase(),
        location: position?.[0],
        lastSeen: timestamp,
      }
      console.debug('Updating user session:', sessionData)
      groupMapStore.updateUserSession(localUser.id, sessionData)
      updateDistance()
    }
  }
}

function colorForStatus(status) {
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
.user-item {
  display: flex;
  align-items: center;
  padding: 5px;
  border-radius: 10px;
  border-bottom: 1px solid #ddd;
}
.user-item:hover {
  background: #D6F5EE;
  border-radius: 10px;
  transition: background 0.6s ease-in-out;
}
.user-item h4 {
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
.profile-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 3px solid #fff;
  object-fit: cover;
  background: #fff;
}
</style>
