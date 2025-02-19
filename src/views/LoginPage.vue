<template>
  <div class="login-container">
    <div class="card p-4" ref="cardContainer" :style="{ height: cardHeight + 'px' }">
      <div class="form-container">
        <transition name="slide" mode="out-in" @after-enter="updateHeight">
          <div v-if="isLogin" key="login" class="form-slide">
            <h3 class="text-center">Login</h3>
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="login-email" class="form-label">Email</label>
                <input v-model="loginData.email" type="email" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="login-password" class="form-label">Password</label>
                <input v-model="loginData.password" type="password" class="form-control" required />
              </div>
              <button type="submit" class="btn btn-primary w-100">Login</button>
            </form>
          </div>

          <div v-else key="register" class="form-slide">
            <h3 class="text-center">Sign In</h3>
            <form @submit.prevent="handleRegister">
              <div class="row mb-3 g-2">
                <div class="col-6">
                  <label for="register-name" class="form-label">Name</label>
                  <input v-model="registerData.name" type="text" class="form-control" required />
                </div>
                <div class="col-6">
                  <label for="register-surname" class="form-label">Surname</label>
                  <input v-model="registerData.surname" type="text" class="form-control" required />
                </div>
              </div>
              <div class="mb-3">
                <label for="register-email" class="form-label">Email</label>
                <input v-model="registerData.email" type="email" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="register-password" class="form-label">Password</label>
                <input
                  v-model="registerData.password"
                  type="password"
                  class="form-control"
                  required
                />
              </div>
              <button type="submit" class="btn btn-success w-100">Sign In</button>
            </form>
          </div>
        </transition>
      </div>

      <div class="toggle-container">
        <button @click="toggleForm(true)" :class="{ active: isLogin }" class="toggle-btn">
          Login
        </button>
        <button @click="toggleForm(false)" :class="{ active: !isLogin }" class="toggle-btn">
          Sign In
        </button>
      </div>
    </div>
  </div>

  <GradientBackground />
</template>

<script>
import GradientBackground from '@/components/GradientBackground.vue'
import { login, registerAndLogin } from '@/scripts/user.js'
import { ref, nextTick, onMounted } from 'vue'

export default {
  components: {
    GradientBackground,
  },
  setup() {
    const isLogin = ref(true)
    const loginData = ref({
      email: '',
      password: '',
    })
    const registerData = ref({
      name: '',
      surname: '',
      email: '',
      password: '',
    })

    const cardContainer = ref(null)
    const cardHeight = ref(0)

    const updateHeight = () => {
      nextTick(() => {
        if (cardContainer.value) {
          const formContainer = cardContainer.value.querySelector('.form-container')
          if (formContainer) {
            cardHeight.value = formContainer.scrollHeight * 1.5
          }
        }
      })
    }

    onMounted(() => {
      updateHeight()
    })

    const toggleForm = (login) => {
      isLogin.value = login
      nextTick(() => {
        updateHeight()
      })
    }

    const handleLogin = async () => {
      if (await login(loginData.value.email, loginData.value.password)) {
        window.location.href = '/'
      } else {
        alert('Login failed')
      }
    }

    const handleRegister = async () => {
     if(await registerAndLogin(registerData.value.name, registerData.value.surname, registerData.value.email, registerData.value.password)){
       window.location.href = '/'
     } else {
       alert('Registration failed')
     }
    }

    return {
      isLogin,
      loginData,
      registerData,
      handleLogin,
      handleRegister,
      cardContainer,
      cardHeight,
      toggleForm,
      updateHeight,
    }
  },
}
</script>

<style>
.card {
  height: calc(100vh - 1vh);
  width: calc(98%);
  transition: height 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  border-radius: 50px;
  overflow: hidden;
  padding: 20px;
  background: white;
}

.toggle-container {
  display: flex;
  justify-content: center;
  background-color: #f8f9fa;
  border-radius: 50px;
  padding: 5px;
  margin-top: 20px;
  width: 100%;
}

.toggle-btn {
  flex: 1;
  cursor: pointer;
  padding: 10px 0;
  border: none;
  background: none;
  text-align: center;
  font-weight: bold;
  border-radius: 50px;
  transition: background 0.3s ease-in-out;
}

.toggle-btn.active {
  background-color: #007bff;
  color: white;
}

.form-control,
.btn {
  border-radius: 50px;
}

.slide-enter-active,
.slide-leave-active {
  transition:
    transform 0.3s ease-in-out,
    opacity 0.3s ease-in-out;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.slide-enter-active,
.slide-leave-active {
  transition:
    transform 0.3s ease-in-out,
    opacity 0.3s ease-in-out;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

html,
body {
  margin: 0;
  padding: 0;
}

.login-container {
  z-index: 100;
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  padding: 1vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
