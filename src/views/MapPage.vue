<template>
  <div class="container" @click.self="minimize">
    <!-- Map component -->
    <div class="map-wrapper">
      <MapView />
    </div>
    <!-- Container for the buttons to (de)activate position sharing and routing mode -->
    <div class="fab-container">
      <div class="location-status new-position" :class="{ 'active': isLocationSharingEnabled }">
        <p v-if="isLocationSharingEnabled">You are sharing your location</p>
        <p v-else>Location sharing is OFF</p>
      </div>
      <button
        class="location-fab"
        @click="toggleLocationSharing"
        :class="{ 'active': isLocationSharingEnabled }"
        :title="isLocationSharingEnabled ? 'Disable location sharing' : 'Enable location sharing'"
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
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </button>
      <button class="route-fab" @click="openRouteForm" title="Plan your route">
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
          <path d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 .553-.894L9 2m0 18v-18m0 18l6-3m-6-15l6-3m-6 0v18m6-18v18m0 0l5.447-2.724A1 1 0 0 0 21 16.382V5.618a1 1 0 0 0-.553-.894L15 2"/>
        </svg>
      </button>
    </div>
    <!-- Route sharing dialog -->
    <RouteFormDialog v-if="showRouteForm" @close="closeRouteForm" @submit="handleRouteSubmit" />
    <!-- Members list container -->
    <div
      class="list-container"
      :style="{ height: containerHeight + 'px' }"
      :class="{ minimized: isMinimized }"
      ref="listContainer"
      @click="maximize"
    >
      <div class="toggle-button" @click.stop="toggleContainer">
        <div class="arrow" :class="{ 'arrow-down': !isMinimized }">
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
            <path d="M18 15l-6-6-6 6"/>
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
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useGroupMapStore } from '@/stores/groupMapStore.js'
import { useUserGroupsStore } from '@/stores/userGroupsStore.js'
import { useRoute } from 'vue-router'
import MapView from '../components/map/MapView.vue';
import UsersList from '../components/map/UsersList.vue';
import RouteFormDialog from '../components/map/RouteFormDialog.vue';

const mapStore = useGroupMapStore();
const userGroupsStore = useUserGroupsStore();
const route = useRoute();

const groupId = route.params.groupId;

const minHeight = 80;
const containerHeight = ref(300);
const isMinimized = ref(false);
const defaultHeight = 300;
const showRouteForm = ref(false);
const listContainer = ref(null);

const isLocationSharingEnabled = computed(() =>
  userGroupsStore.groupsWithConnection.find(g => g.id === groupId)?.isConnected || false
)

const minimize = () => {
  isMinimized.value = true;
  containerHeight.value = minHeight;
};

const maximize = (event) => {
  event.stopPropagation();
  if (isMinimized.value) {
    isMinimized.value = false;
    containerHeight.value = defaultHeight;
  }
};

const toggleContainer = (event) => {
  event.stopPropagation();
  isMinimized.value ? maximize(event) : minimize();
};

const handleOutsideClick = (event) => {
  if (listContainer.value && !listContainer.value.contains(event.target)) {
    minimize();
  }
};

const openRouteForm = () => {
  showRouteForm.value = true;
};

const closeRouteForm = () => {
  showRouteForm.value = false;
};

const handleRouteSubmit = (formData) => {
  console.log('Route submitted:', formData); // TODO: Implement route sharing
  closeRouteForm();
};

async function toggleLocationSharing() {
  console.log("TOGGLE LOCATION SHARING");
  await userGroupsStore.toggleGroupTracking(groupId)
}

onMounted(async () => {
  document.addEventListener('click', handleOutsideClick);
  mapStore.setCurrentGroupId(groupId);
  await userGroupsStore.fetchUserGroups();
});

onBeforeUnmount(() => document.removeEventListener('click', handleOutsideClick));
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
  position: relative; /* Importante per l'effetto pulse */
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

.location-status.new-position {
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

.location-status.active {
  background: #4CAF50;
}

.location-status p {
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
