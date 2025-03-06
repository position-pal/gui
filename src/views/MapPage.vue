<template>
  <div
    class="container"
    @click.self="minimize"
  >
    <!-- Map component -->
    <div
      ref="mapContainer"
      class="map-wrapper"
    >
      <MapView />
    </div>
    <!-- Container for the buttons to (de)activate position sharing and routing mode -->
    <div class="fab-container">
      <div
        class="tracking-status"
        :class="{ 'active': isLocationSharingEnabled }"
      >
        <p v-if="isLocationSharingEnabled">
          You are sharing your location
        </p>
        <p v-else>
          Location sharing is OFF
        </p>
        <p v-if="isRoutingEnabled">
          , you are in routing mode!
        </p>
      </div>
      <button
        class="location-fab"
        :class="{ 'active': isLocationSharingEnabled }"
        :title="isLocationSharingEnabled ? 'Disable location sharing' : 'Enable location sharing'"
        @click="toggleLocationSharing"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle
            cx="12"
            cy="10"
            r="3"
          />
        </svg>
      </button>
      <button
        class="route-fab"
        :class="{ 'active': isRoutingEnabled }"
        :title="isRoutingEnabled ? 'Stop routing' : 'Plan your route'"
        @click="handleRoutingBtn"
      >
        <svg
          v-if="!isRoutingEnabled"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 .553-.894L9 2m0 18v-18m0 18l6-3m-6-15l6-3m-6 0v18m6-18v18m0 0l5.447-2.724A1 1 0 0 0 21 16.382V5.618a1 1 0 0 0-.553-.894L15 2" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M4 4v16" />
          <path d="M4 4c4 0 8 2 12 2v8c-4 0-8 2-12 2" />
        </svg>
      </button>
    </div>
    <!-- Route sharing dialog -->
    <RouteFormDialog
      v-if="showRouteForm"
      @close="closeRouteForm"
      @submit="handleRouteSubmit"
    />
    <!-- Routing confirmation dialog -->
    <div
      v-if="showStopRoutingDialog"
      class="dialog-overlay"
      @click="closeStopRoutingDialog"
    >
      <div
        class="dialog-content"
        @click.stop
      >
        <h3>Stop Routing</h3>
        <p>Are you sure you want to stop sharing your route?</p>
        <div class="dialog-actions">
          <button
            class="cancel-button"
            @click="closeStopRoutingDialog"
          >
            Cancel
          </button>
          <button
            class="confirm-button"
            @click="stopRouting"
          >
            Stop Routing
          </button>
        </div>
      </div>
    </div>
    <!-- Members list container -->
    <div
      ref="listContainer"
      class="list-container"
      :style="{ height: containerHeight + 'px' }"
      :class="{ minimized: isMinimized }"
      @click="maximize"
    >
      <div
        class="toggle-button"
        @click.stop="toggleContainer"
      >
        <div
          class="arrow"
          :class="{ 'arrow-down': !isMinimized }"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </div>
      </div>
      <div class="content-wrapper">
        <UsersList />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useGroupMapStore } from '@/stores/groupMapStore.js'
import { useUserGroupsStore } from '@/stores/userGroupsStore.js'
import { useRoute } from 'vue-router'
import MapView from '../components/map/MapView.vue';
import UsersList from '../components/map/UsersList.vue';
import RouteFormDialog from '../components/map/RouteFormDialog.vue';
import { getLoggedInUser } from '@/scripts/user.js'

const mapStore = useGroupMapStore();
const userGroupsStore = useUserGroupsStore();
const route = useRoute();

const userId = getLoggedInUser().id;
const groupId = route.params.groupId;

const minHeight = 80;
const containerHeight = ref(300);
const isMinimized = ref(false);
const defaultHeight = 300;
const showRouteForm = ref(false);
const showStopRoutingDialog = ref(false);
const mapContainer = ref(null);
const listContainer = ref(null);

const isLocationSharingEnabled = computed(() =>
  userGroupsStore.groupsWithConnection.find(g => g.id === groupId)?.trackingEnabled || false
)
const isRoutingEnabled = computed(() =>
  mapStore.usersInfo.find(u => u.id === userId)?.state === "ROUTING" ||
    mapStore.usersInfo.find(u => u.id === userId)?.state === "WARNING" || false
)

const minimize = () => {
  if (!isMinimized.value) {
    isMinimized.value = true;
    containerHeight.value = minHeight;
  }
};

const maximize = () => {
  if (isMinimized.value) {
    isMinimized.value = false;
    containerHeight.value = defaultHeight;
  }
};

const toggleContainer = () => {
  isMinimized.value ? maximize() : minimize();
};

const handleRoutingBtn = () => {
  maximize()
  console.log("Handle routing button, isRoutingEnabled", isRoutingEnabled.value)
  if (isRoutingEnabled.value) {
    showStopRoutingDialog.value = true;
  } else {
    openRouteForm();
  }
};

const openRouteForm = () => {
  showRouteForm.value = true;
};

const closeRouteForm = () => {
  maximize();
  showRouteForm.value = false;
};

const closeStopRoutingDialog = () => {
  showStopRoutingDialog.value = false;
};

const stopRouting = async () => {
  const routingStoppedEvent = {
    RoutingStopped: {
      timestamp: new Date().toISOString(),
      user: userId,
      group: groupId,
    }
  }
  console.log("Sending routing stopped event", routingStoppedEvent)
  userGroupsStore.sendToGroup(mapStore.groupId, routingStoppedEvent)
  closeStopRoutingDialog();
};

const handleRouteSubmit = () => {
  closeRouteForm();
};

async function toggleLocationSharing() {
  maximize()
  await userGroupsStore.toggleGroupTracking(groupId)
}

onMounted(async () => {
  await mapStore.setCurrentGroupId(groupId);
  await userGroupsStore.fetchUserGroups();
});
</script>

<style scoped>
.container {
  position: relative;
  height: 100%;
  width: 100%;
}

.list-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: white;
  padding: 15px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  overflow: hidden;
  box-shadow: 0px -4px 10px rgba(0, 0, 0, 0.2);
  transition: height 0.3s ease;
}

.toggle-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 30px;
  cursor: pointer;
  margin-bottom: 10px;
}

.arrow {
  transition: transform 0.3s ease;
  color: #666;
}

.arrow-down {
  transform: rotate(180deg);
}

.content-wrapper {
  overflow-y: auto;
  height: calc(100% - 50px);
}

.minimized {
  cursor: pointer;
}

/* Map */
.map-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

/* Fab */
.fab-container {
  position: absolute;
  top: 95px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 1000;
  align-items: flex-end;
  transform: translateY(-50%);
}

.route-fab, .location-fab {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: white;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.route-fab:hover, .location-fab:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.route-fab svg, .location-fab svg {
  color: #666;
  transition: color 0.3s ease;
}

.location-fab.active {
  background: #4CAF50;
  position: relative; /* Important for pulse effect */
}

.location-fab.active::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #4CAF50;
  animation: pulseAnim 2s ease-out infinite;
  z-index: -1;
}

.location-fab.active svg {
  color: white;
}

.route-fab.active {
  background-color: #8063d2;
  position: relative; /* Important for pulse effect */
}

.route-fab.active::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #8063d2;
  animation: wave 0.5s infinite ease-in-out;
  z-index: -1;
}

.route-fab.active svg {
  color: white;
}

.tracking-status {
  position: relative;
  font-size: 12px;
  padding: 5px 10px;
  background: gray;
  color: white;
  border-radius: 10px;
  transition: all 0.3s ease;
  z-index: 1000;
  align-self: center;
}

.tracking-status.active {
  background: #4CAF50;
}

.tracking-status p {
  margin: 0;
}

@keyframes pulseAnim {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.4;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

@keyframes wave {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(2px) rotate(2deg); }
}

/* Dialog styles */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.dialog-content {
  background: white;
  border-radius: 10px;
  padding: 20px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.dialog-content h3 {
  margin-top: 0;
  color: #333;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-button {
  padding: 8px 16px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* Scrollbar Styles */
.content-wrapper {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.content-wrapper::-webkit-scrollbar {
  width: 6px;
}

.content-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.content-wrapper::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
</style>
