<template>
  <div
    class="route-dialog-overlay"
    @click="$emit('close')"
  >
    <div
      class="route-dialog"
      @click.stop
    >
      <h3>Start a monitored journey</h3>
      <p class="route-description">
        Share your destination and arrival time to get monitored by other group members.
      </p>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="destination">Destination</label>
          <div class="autocomplete-container">
            <input
              id="destination"
              v-model="destinationQuery"
              type="text"
              placeholder="Where are you going?"
              class="form-control"
              required
              @input="searchAddresses"
            >
            <div
              v-if="suggestions.length > 0"
              class="suggestions-dropdown"
            >
              <div
                v-for="(suggestion, index) in suggestions"
                :key="index"
                class="suggestion-item"
                @click="selectAddress(suggestion)"
              >
                {{ suggestion.place_name }}
              </div>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label for="arrivalTime">Expected Arrival Time</label>
          <input
            id="arrivalTime"
            v-model="arrivalTime"
            type="datetime-local"
            required
          >
        </div>
        <div
          v-if="error"
          class="error"
        >
          {{ error }}
        </div>
        <div class="form-actions">
          <button
            type="button"
            class="btn-secondary"
            @click="$emit('close')"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="btn-primary"
          >
            Start Routing
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, ref } from 'vue'
import { useUserGroupsStore } from '@/stores/userGroupsStore.js'
import { useGroupMapStore } from '@/stores/groupMapStore.js'
import { formatToISO } from '@/scripts/utils.js'
import { useLocationStore } from '@/stores/locationStore.js'
import { fetchCoordinates } from '@/scripts/geo.js'
import { getLoggedInUser, isTestUser } from '@/scripts/user.js'
import { getMockedPosition } from '@/scripts/mocked-location.js'

const emit = defineEmits(['close', 'submit'])
const userGroupsStore = useUserGroupsStore()
const groupMapStore = useGroupMapStore()
const locationStore = useLocationStore()

const destinationQuery = ref('')
const arrivalTime = ref('')
const suggestions = ref([])
const selectedAddress = ref(null)
const error = ref('')
let searchTimeout = null
const userId = getLoggedInUser().id
const groupId = groupMapStore.groupId

function searchAddresses() {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  // don't search for less than 3 characters
  if (!destinationQuery.value || destinationQuery.value.length < 3) {
    suggestions.value = []
    return
  }
  // set a timeout to avoid making too many requests on every keystroke
  searchTimeout = setTimeout(() => fetchAddresses(), 300)
}

async function fetchAddresses() {
  try {
    suggestions.value = await fetchCoordinates(destinationQuery.value, { limit: 5 })
    console.debug("Fetched addresses", suggestions.value)
  } catch (error) {
    console.error('Failed to fetch addresses', error);
    suggestions.value = [];
  }
}

function selectAddress(address) {
  selectedAddress.value = {
    display_name: address.place_name,
    lon: address.center[0],
    lat: address.center[1],
    // Additional properties if needed
    properties: address.properties,
    place_type: address.place_type
  };
  destinationQuery.value = address.place_name;
  suggestions.value = [];
}

async function submitForm() {
  error.value = ''
  if (!selectedAddress.value || !selectedAddress.value.lat || !selectedAddress.value.lon) {
    error.value = "Please select a valid destination first"
    return
  }
  if (!arrivalTime.value) {
    error.value = "Please select an arrival time"
    return
  }
  const groupInfo = userGroupsStore.groups.find(g => g.id === groupId)
  if (!groupInfo.trackingEnabled) {
    await userGroupsStore.toggleGroupTracking(groupId)
  }
  const currentLocation = locationStore.currentPosition.coordinates
  if (!currentLocation) {
    error.value = "Current location not available"
    return
  }
  emit('submit', { destination: selectedAddress.value, arrivalTime: arrivalTime.value })
  const destination = {
    name: selectedAddress.value.display_name,
    position: {
      latitude: selectedAddress.value.lat,
      longitude: selectedAddress.value.lon
    }
  }
  const eta = formatToISO(arrivalTime.value)
  console.debug("Route towards", destination, " - ETA:", eta)
  const routingStartedEvent = {
    RoutingStarted: {
      timestamp: new Date().toISOString(),
      user: userId,
      group: groupId,
      position: isTestUser() ? getMockedPosition().coordinates : currentLocation,
      mode: "Walking",
      destination: destination,
      expectedArrival: eta
    }
  }
  console.log("Sending routing started event", routingStartedEvent)
  userGroupsStore.sendToGroup(groupMapStore.groupId, routingStartedEvent)
}
</script>

<style scoped>
.route-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.route-dialog {
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.route-description {
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
}

.btn-primary, .btn-secondary {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.btn-primary {
  background: #1AAB8A;
  color: white;
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
}

.btn-primary:hover {
  background: #168f73;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

.autocomplete-container {
  position: relative;
}

.suggestions-dropdown {
  position: absolute;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: white;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 4px 4px;
  z-index: 1000;
}

.suggestion-item {
  padding: 8px 12px;
  cursor: pointer;
}

.suggestion-item:hover {
  background-color: #f5f5f5;
}

.error {
  color: #e74c3c;
  font-size: 14px;
  margin-bottom: 12px;
  text-align: center;
}
</style>
