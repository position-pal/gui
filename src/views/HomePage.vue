<template>
  <div class="home-view">
    <div class="text-container">
      <div class="d-flex justify-content-center align-items-center">
        <img
          src="@/assets/home_logo.png"
          alt="Position Pal Logo"
          class="img-fluid"
          style="background: none; width: 27vh; height: auto"
        >
      </div>
      <h1 class="pb-4 display-1">
        Position Pal
      </h1>
      <h5>Share your location</h5>
      <h5>Chat with friends</h5>
      <h5>Feel safe</h5>
      <template v-if="!isAuthenticated">
        <router-link
          to="/login"
          class="btn btn-lg primary-bg text-white mt-5"
          style="box-shadow: 0 2px 25px #38b6ff"
        >
          Login
        </router-link>
      </template>
      <template v-else>
        <h5>Welcome back!</h5>
        <h5>{{ firstName }} {{ lastName }}</h5>
        <router-link
          to="/groups"
          class="btn btn-lg primary-bg text-white mt-5"
          style="box-shadow: 0 2px 25px #38b6ff"
        >
          Groups
        </router-link>
      </template>
    </div>
  </div>
  <GradientBackground />
</template>

<script>
import GradientBackground from '@/components/GradientBackground.vue'
import { getLoggedInUser, isUserLoggedIn } from '@/scripts/user.js'

export default {
  name: 'HomePage',
  components: {
    GradientBackground,
  },
  data() {
    return {
      isAuthenticated: false,
      firstName: '',
      lastName: '',
    };
  },
  async mounted() {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      this.isAuthenticated = isUserLoggedIn();
    }
    const user = getLoggedInUser()
    if (user) {
      this.firstName = user.name
      this.lastName = user.surname
    }
  },
}
</script>

<style>
@font-face {
  font-family: 'Playlist Script';
  src: url('@/assets/fonts/PlaylistScript.otf');
}

.home-view {
  display: flex;
  flex-direction: column;
}

.text-container {
  z-index: 100;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  justify-content: center;
  align-items: center;
  font-size: 96px;
  color: white;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  text-shadow: 1px 1px rgba(0, 0, 0, 0.1);
}

.text-container h1 {
  font-family: 'Playlist Script';
}

@media (max-width: 768px) {
  .text-container {
    font-size: 48px;
  }

  .text-container h1 {
    font-size: 48px;
  }

  .text-container h5 {
    font-size: 24px;
  }

  .btn {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .text-container {
    font-size: 32px;
  }

  .text-container h1 {
    font-size: 32px;
  }

  .text-container h5 {
    font-size: 18px;
  }

  .btn {
    font-size: 16px;
  }
}
</style>
