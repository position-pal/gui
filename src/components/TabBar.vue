<template>
  <nav>
    <router-link
      class="active tabbar-element"
      to="/"
    >
      <h3 class="bi bi-house" />
      <span> Home </span>
    </router-link>
    <router-link
      class="tabbar-element"
      to="/groups"
    >
      <h3 class="bi bi-people" />
      <span> Groups </span>
    </router-link>
    <router-link
      class="tabbar-element"
      to="/profile"
    >
      <h3 class="bi bi-person" />
      <span> Profile </span>
    </router-link>
    <div
      ref="sosContainer"
      class="sos-container"
    >
      <a
        class="tabbar-element sos"
        :class="{ 'active-sos': sosActive }"
        @click.stop.prevent="togglePopup"
      >
        <h3 class="bi bi-megaphone" />
        <span> SOS </span>
      </a>
      <transition name="popup">
        <div
          v-if="showPopup"
          class="sos-popup"
          @click.stop
        >
          <p v-if="!sosActive">
            You pressed the SOS button. <br>
            Confirm that you want to send an SOS alert?
          </p>
          <p v-else>
            Your SOS is currently active. <br>
            Confirm that you want to deactivate it?
          </p>
          <div class="popup-buttons">
            <button
              class="cancel"
              @click="hidePopup"
            >
              Cancel
            </button>
            <button
              class="confirm"
              @click="confirmSos"
            >
              {{ sosActive ? 'Deactivate' : 'Confirm' }}
            </button>
          </div>
        </div>
      </transition>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useUserGroupsStore } from '@/stores/userGroupsStore.js';

const userGroupsStore = useUserGroupsStore();

const showPopup = ref(false);
const navigationOptions = ref([
  { name: 'home', color: '#5B37B7' },
  { name: 'profile', color: '#C9379D' },
  { name: 'groups', color: '#1AAB8A' },
]);

const sosActive = computed(() => userGroupsStore.sosActive);

const togglePopup = () => {
  showPopup.value = !showPopup.value;
};

const hidePopup = () => {
  showPopup.value = false;
};

const confirmSos = () => {
  if (sosActive.value) {
    userGroupsStore.stopSOS()
  } else {
    userGroupsStore.broadcastSOS()
  }
  hidePopup();
};

const handleOutsideClick = (e) => {
  if (showPopup.value && sosContainerRef.value && !sosContainerRef.value.contains(e.target)) {
    hidePopup();
  }
};

const sosContainerRef = ref(null);

const handleClick = (e) => {
  e.preventDefault();
  const links = document.querySelectorAll('.tabbar-element:not(.sos)');
  links.forEach((link) => link.classList.remove('active'));
  const name = e.currentTarget.textContent.trim().toLowerCase();
  const option = navigationOptions.value.find((item) => item.name === name);
  if (option) {
    const { color } = option;
    const style = window.getComputedStyle(e.currentTarget);
    const hoverColor = style.getPropertyValue('--hover-c');
    if (color !== hoverColor) {
      e.currentTarget.style.setProperty('--hover-bg', `${color}20`);
      e.currentTarget.style.setProperty('--hover-c', color);
    }
  }
  e.currentTarget.classList.add('active');
};

onMounted(() => {
  const links = document.querySelectorAll('.tabbar-element:not(.sos)');
  links.forEach((link) => link.addEventListener('click', handleClick));
  document.addEventListener('click', handleOutsideClick);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick);
});
</script>

<!--<script>-->
<!--import { useUserGroupsStore } from '@/stores/userGroupsStore.js'-->
<!--const userGroupsStore = useUserGroupsStore()-->
<!--export default {-->
<!--  name: 'BottomBar',-->
<!--  data() {-->
<!--    return {-->
<!--      showPopup: false,-->
<!--      navigationOptions: [-->
<!--        { name: 'home', color: '#5B37B7' },-->
<!--        { name: 'profile', color: '#C9379D' },-->
<!--        { name: 'groups', color: '#1AAB8A' },-->
<!--      ],-->
<!--    }-->
<!--  },-->
<!--  computed: {-->
<!--    sosActive() {-->
<!--      return userGroupsStore.sosActive-->
<!--    }-->
<!--  },-->
<!--  mounted() {-->
<!--    const links = document.querySelectorAll('.tabbar-element:not(.sos)')-->
<!--    const navigationOptions = this.navigationOptions-->
<!--    function handleClick(e) {-->
<!--      e.preventDefault()-->
<!--      links.forEach((link) => link.classList.remove('active'))-->
<!--      const name = e.currentTarget.textContent.trim().toLowerCase()-->
<!--      const option = navigationOptions.find((item) => item.name === name)-->
<!--      if (option) {-->
<!--        const { color } = option-->
<!--        const style = window.getComputedStyle(e.currentTarget)-->
<!--        const hoverColor = style.getPropertyValue('&#45;&#45;hover-c')-->
<!--        if (color !== hoverColor) {-->
<!--          e.currentTarget.style.setProperty('&#45;&#45;hover-bg', `${color}20`)-->
<!--          e.currentTarget.style.setProperty('&#45;&#45;hover-c', color)-->
<!--        }-->
<!--      }-->
<!--      e.currentTarget.classList.add('active')-->
<!--    }-->
<!--    links.forEach((link) => link.addEventListener('click', handleClick))-->

<!--    document.addEventListener('click', this.handleOutsideClick)-->
<!--  },-->
<!--  beforeUnmount() {-->
<!--    document.removeEventListener('click', this.handleOutsideClick)-->
<!--  },-->
<!--  methods: {-->
<!--    togglePopup() {-->
<!--      this.showPopup = !this.showPopup-->
<!--    },-->
<!--    hidePopup() {-->
<!--      this.showPopup = false-->
<!--    },-->
<!--    confirmSos() {-->
<!--      this.hidePopup()-->
<!--    },-->
<!--    handleOutsideClick(e) {-->
<!--      if (-->
<!--        this.showPopup &&-->
<!--        this.$refs.sosContainer &&-->
<!--        !this.$refs.sosContainer.contains(e.target)-->
<!--      ) {-->
<!--        this.hidePopup()-->
<!--      }-->
<!--    },-->
<!--  },-->
<!--}-->
<!--</script>-->

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Open+Sans:700');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

nav {
  position: relative;
  z-index: 1000 !important;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: #fff;
  padding: 1.5rem 2rem;
  box-shadow: 0 1px 15px rgba(0, 0, 0, 0.1);
}

.tabbar-element {
  color: inherit;
  text-decoration: none;
  margin: 0 0.2rem;
  display: flex;
  align-items: center;
  padding: 0.75rem 1.25rem;
  border-radius: 30px;
  position: relative;
  --hover-bg: #5b37b720;
  --hover-c: #5b37b7;
}

.tabbar-element h3 {
  margin-right: -2.5rem;
  width: 28px;
  height: 28px;
  pointer-events: none;
  transition: margin-right 0.3s ease-in-out;
}

.tabbar-element span {
  opacity: 0;
  visibility: hidden;
  font-size: 0.9rem;
  margin-left: -2rem;
}

.tabbar-element.active span {
  visibility: visible;
  opacity: 1;
  margin-left: 0.9rem;
}

.tabbar-element.active h3 {
  margin-right: 0;
}

.tabbar-element.active {
  background: var(--hover-bg);
  color: var(--hover-c);
  transition: background 0.3s ease-in-out;
}

.tabbar-element.active h3 {
  color: var(--hover-c);
}

.tabbar-element.active span {
  color: var(--hover-c);
}

.tabbar-element:not(.active) span {
  opacity: 0;
  visibility: hidden;
  margin-left: 0;
}

.tabbar-element:not(.active) {
  background: transparent;
  transition: none;
}

.tabbar-element.sos {
  width: 50px;
  height: 50px;
  border: 2px solid #ff0000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 !important;
  background: rgba(255, 0, 0, 0.7);
}

.tabbar-element.sos h3 {
  margin-right: 0 !important;
  color: white;
}

.tabbar-element.sos span {
  display: none;
}

.sos-container {
  position: relative;
}

.sos-popup {
  position: fixed;
  bottom: 11vh;
  left: 0;
  right: 0;
  width: 100%;
  background: #fff;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  padding: 1rem;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.1);
  transform-origin: bottom center;
  z-index: 2000;
}

.popup-enter-active,
.popup-leave-active {
  transition: all 0.3s ease;
}
.popup-enter-from,
.popup-leave-to {
  transform: scale(0);
  opacity: 0;
}
.popup-enter-to,
.popup-leave-from {
  transform: scale(1);
  opacity: 1;
}

.popup-buttons {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
  margin-top: 1rem;
}

.popup-buttons button {
  flex: 1;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.popup-buttons .confirm {
  background-color: #ff0000;
  color: #fff;
}

.popup-buttons .cancel {
  background-color: #ccc;
  color: #333;
}
</style>
