<template>
  <div
    class="container"
    @click.self="minimize"
  >
    <MapView />
    <button
      class="route-fab"
      title="Plan your route"
      @click="openRouteForm"
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
        <path d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 .553-.894L9 2m0 18v-18m0 18l6-3m-6-15l6-3m-6 0v18m6-18v18m0 0l5.447-2.724A1 1 0 0 0 21 16.382V5.618a1 1 0 0 0-.553-.894L15 2" />
      </svg>
    </button>
    <RouteFormDialog
      v-if="showRouteForm"
      @close="closeRouteForm"
      @submit="handleRouteSubmit"
    />
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
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useGroupMapStore } from '@/stores/groupMapStore.js'
import { useRoute } from 'vue-router'
import MapView from '../components/map/MapView.vue';
import UsersList from '../components/map/UsersList.vue';
import RouteFormDialog from '../components/map/RouteFormDialog.vue';

const route = useRoute();
const store = useGroupMapStore();
store.setCurrentGroupId(route.params.groupId);

/**************************** Styling elements ****************************/

const containerHeight = ref(300);
const minHeight = 80;
const isMinimized = ref(false);
const defaultHeight = 300;
const showRouteForm = ref(false);
const listContainer = ref(null);

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
  console.log('Route submitted:', formData);
  closeRouteForm();
};

onMounted(() => document.addEventListener('click', handleOutsideClick));
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

.route-fab {
  position: absolute;
  top: 20px;
  right: 20px;
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
  transition: transform 0.2s, box-shadow 0.2s;
  z-index: 1000;
}

.route-fab:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.route-fab svg {
  color: #666;
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
