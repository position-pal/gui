<template>
  <div class="profile-container">
    <div class="row justify-content-center w-100">
      <div class="col-12 col-md-8 col-lg-6">
        <div class="card profile-card" :class="{ destroy: isLoggingOut }">
          <div class="card-body text-center">
            <div class="d-flex justify-content-center">
              <img
                src="https://ui-avatars.com/api/?name=Luke+Skywalker&background=random"
                alt="Avatar"
                class="profile-avatar"
              />
            </div>
            <transition name="slide-fade" mode="out-in" appear>
              <div v-if="!isEditingName" key="display-name">
                <h3 class="mt-3">{{ fullName }}</h3>
              </div>
              <div v-else key="edit-name" class="mt-3">
                <input v-model="firstName" placeholder="Name" class="form-control mb-2" />
                <input v-model="lastName" placeholder="Surname" class="form-control mb-2" />
                <div class="d-grid gap-2">
                  <button @click="saveName" class="btn btn-success btn-pill">Save</button>
                  <button @click="cancelEditName" class="btn btn-secondary btn-pill">Cancel</button>
                </div>
              </div>
            </transition>
            <div class="mt-3">
              <div class="info-item">luke.skywalker@jedi.com</div>
            </div>
            <transition name="slide-fade" mode="out-in" appear>
              <div v-if="isChangingPassword" key="change-password" class="mt-3">
                <input
                  type="password"
                  v-model="oldPassword"
                  placeholder="Old password"
                  class="form-control mb-2"
                />
                <input
                  type="password"
                  v-model="newPassword"
                  placeholder="New password"
                  class="form-control mb-2"
                />
                <input
                  type="password"
                  v-model="confirmPassword"
                  placeholder="Confirm password"
                  class="form-control mb-2"
                />
                <div class="d-grid gap-2">
                  <button @click="updatePassword" class="btn btn-success btn-pill">
                    Update Password
                  </button>
                  <button @click="cancelChangePassword" class="btn btn-secondary btn-pill">
                    Cancel
                  </button>
                </div>
              </div>
            </transition>
            <transition name="fade" mode="out-in" appear>
              <div v-if="!isEditingName && !isChangingPassword" key="action-buttons" class="mt-4">
                <div class="d-grid gap-2">
                  <button @click="editName" class="btn btn-primary btn-pill">Update User</button>
                  <button @click="changePassword" class="btn btn-warning btn-pill">
                    Change Password
                  </button>
                  <button @click="logout" class="btn btn-danger btn-pill">Logout</button>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>

  <GradientBackground />
</template>

<script>
import GradientBackground from '@/components/GradientBackground.vue'

export default {
  name: 'ProfilePage',
  components: {
    GradientBackground,
  },
  data() {
    return {
      isEditingName: false,
      isChangingPassword: false,
      isLoggingOut: false,
      firstName: 'Luke',
      lastName: 'Skywalker',
      newPassword: '',
      confirmPassword: '',
      oldPassword: '',
    }
  },
  computed: {
    fullName() {
      return `${this.firstName} ${this.lastName}`
    },
  },
  methods: {
    editName() {
      this.isEditingName = true
    },
    cancelEditName() {
      this.isEditingName = false
    },
    saveName() {
      // Logica per salvare le modifiche
      this.isEditingName = false
    },
    changePassword() {
      this.isChangingPassword = true
    },
    cancelChangePassword() {
      this.isChangingPassword = false
      this.newPassword = ''
      this.confirmPassword = ''
      this.oldPassword = ''
    },
    updatePassword() {
      if (this.newPassword !== this.confirmPassword) {
        alert('Passwords do not match')
        return
      }
      // Logica per aggiornare la password
      this.isChangingPassword = false
      this.newPassword = ''
      this.confirmPassword = ''
      this.oldPassword = ''
    },
    logout() {
      this.isLoggingOut = true
      setTimeout(() => {
        this.$router.push('/')
      }, 1000)
    },
  },
}
</script>

<style>
.profile-container {
  z-index: 100;
  width: 100vw !important;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  user-select: none;
}

/* Stile base della card */
.profile-card {
  border: none;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Animazione di distruzione della card */
.profile-card.destroy {
  animation: breakCard 1s forwards;
}
@keyframes breakCard {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0) rotate(15deg);
    opacity: 0;
  }
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid #fff;
  object-fit: cover;
  background: #fff;
}

.info-item:last-child {
  border-bottom: none;
}
.btn-pill {
  border-radius: 30px !important;
  width: 100%;
}

/* Animazione di fade-in e slide */
.slide-fade-enter-active,
.slide-fade-leave-active,
.slide-fade-appear-active {
  transition: all 0.5s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to,
.slide-fade-appear-from {
  opacity: 0;
  transform: translateY(10px);
}

.slide-fade-enter-to,
.slide-fade-leave-from,
.slide-fade-appear-to {
  opacity: 1;
  transform: translateY(0);
}

/* Animazione di fade */
.fade-enter-active,
.fade-leave-active,
.fade-appear-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to,
.fade-appear-from {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from,
.fade-appear-to {
  opacity: 1;
}
</style>
