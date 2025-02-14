<template>
  <div class="container" @click.self="minimize">
    <MapView />
    <div
      class="list-container"
      :style="{ height: containerHeight + 'px' }"
      :class="{ 'minimized': isMinimized }"
      ref="listContainer"
      @click="maximize"
    >
      <div
        class="handle"
        @mousedown="startResize"
        @touchstart="startResize"
      ></div>
      <div class="content-wrapper">
        <PeopleList />
      </div>
    </div>
  </div>
</template>

<script>
import MapView from "../components/MapView.vue";
import PeopleList from "../components/PeopleList.vue";

export default {
  components: { MapView, PeopleList },
  data() {
    return {
      containerHeight: 300,
      minHeight: 80,
      maxHeight: window.innerHeight * 0.8,
      startY: 0,
      startHeight: 0,
      isResizing: false,
      isMinimized: false,
      defaultHeight: 300
    };
  },
  mounted() {
    window.addEventListener('mousemove', this.onResize);
    window.addEventListener('mouseup', this.stopResize);
    window.addEventListener('touchmove', this.onResize);
    window.addEventListener('touchend', this.stopResize);
    document.addEventListener('click', this.handleOutsideClick);
  },
  beforeDestroy() {
    window.removeEventListener('mousemove', this.onResize);
    window.removeEventListener('mouseup', this.stopResize);
    window.removeEventListener('touchmove', this.onResize);
    window.removeEventListener('touchend', this.stopResize);
    document.removeEventListener('click', this.handleOutsideClick);
  },
  methods: {
    startResize(event) {
      this.isResizing = true;
      this.startY = event.type === 'mousedown' ? event.clientY : event.touches[0].clientY;
      this.startHeight = this.containerHeight;
      this.isMinimized = false;

      if (event.type === 'touchstart') {
        event.preventDefault();
      }
    },
    onResize(event) {
      if (!this.isResizing) return;
      const currentY = event.type === 'mousemove' ? event.clientY : event.touches[0].clientY;
      const deltaY = this.startY - currentY;
      let newHeight = this.startHeight + deltaY;
      newHeight = Math.max(this.minHeight, Math.min(this.maxHeight, newHeight));
      this.containerHeight = newHeight;
      event.preventDefault();
    },
    stopResize() {
      this.isResizing = false;
    },
    minimize() {
      this.isMinimized = true;
      this.containerHeight = this.minHeight;
    },
    maximize(event) {
      event.stopPropagation();
      if (this.isMinimized) {
        this.isMinimized = false;
        this.containerHeight = this.defaultHeight;
      }
    },
    handleOutsideClick(event) {
      const container = this.$refs.listContainer;
      if (container && !container.contains(event.target)) {
        this.minimize();
      }
    }
  }
};
</script>

<style scoped>
.container {
  position: relative;
  height: 89vh;
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
  touch-action: none;
}

.content-wrapper {
  height: calc(100% - 25px);
  overflow-y: auto;
}

.handle {
  width: 50px;
  height: 5px;
  background: #ccc;
  border-radius: 3px;
  margin: 0 auto 10px auto;
  cursor: ns-resize;
  touch-action: none;
}

.list-container:active .handle {
  cursor: grabbing;
}

.minimized {
  cursor: pointer;
}

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
