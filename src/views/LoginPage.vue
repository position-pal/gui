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
        <!-- Abbiamo modificato i pulsanti per utilizzare il metodo toggleForm -->
        <button @click="toggleForm(true)" :class="{ active: isLogin }" class="toggle-btn">
          Login
        </button>
        <button @click="toggleForm(false)" :class="{ active: !isLogin }" class="toggle-btn">
          Registrati
        </button>
      </div>
    </div>
  </div>

  <div class="gradient-bg">
    <svg xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
    </svg>
    <div class="gradients-container">
      <div class="g1"></div>
      <div class="g2"></div>
      <div class="g3"></div>
      <div class="g4"></div>
      <div class="g5"></div>
      <div class="interactive"></div>
    </div>
  </div>
</template>

<script>
import { ref, nextTick, onMounted } from 'vue'

export default {
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

    // Ref per la card e proprietà per l'altezza
    const cardContainer = ref(null)
    const cardHeight = ref(0)

    const handleLogin = () => {
      console.log('Login:', loginData.value)
    }

    const handleRegister = () => {
      console.log('Registrazione:', registerData.value)
    }

    // Funzione per aggiornare l'altezza della card in base al contenuto
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

    // Metodo per cambiare forma e aggiornare l'altezza in modo fluido
    const toggleForm = (login) => {
      isLogin.value = login
      nextTick(() => {
        updateHeight()
      })
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
  height: calc(100vh - 1vh); /* Altezza dinamica dello schermo con margine verticale */
  width: calc(98%);
  transition: height 0.3s ease;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
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

/* Animazione slide per i form */
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

/* Animazione slide */
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
  display: flex; /* Aggiunto per abilitare Flexbox */
  justify-content: center; /* Centra orizzontalmente */
  align-items: center;
  color: white;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

:root {
  --color-bg1: rgb(108, 0, 162);
  --color-bg2: rgb(0, 17, 82);
  --color1: 18, 113, 255;
  --color2: 221, 74, 255;
  --color3: 100, 220, 255;
  --color4: 200, 50, 50;
  --color5: 180, 180, 50;
  --color-interactive: 140, 100, 255;
  --circle-size: 80%;
  --blending: hard-light;
}

@-webkit-keyframes moveInCircle {
  0% {
    transform: rotate(0deg);
  }

  50% {
    transform: rotate(180deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes moveInCircle {
  0% {
    transform: rotate(0deg);
  }

  50% {
    transform: rotate(180deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@-webkit-keyframes moveVertical {
  0% {
    transform: translateY(-50%);
  }

  50% {
    transform: translateY(50%);
  }

  100% {
    transform: translateY(-50%);
  }
}

@keyframes moveVertical {
  0% {
    transform: translateY(-50%);
  }

  50% {
    transform: translateY(50%);
  }

  100% {
    transform: translateY(-50%);
  }
}

@-webkit-keyframes moveHorizontal {
  0% {
    transform: translateX(-50%) translateY(-10%);
  }

  50% {
    transform: translateX(50%) translateY(10%);
  }

  100% {
    transform: translateX(-50%) translateY(-10%);
  }
}

@keyframes moveHorizontal {
  0% {
    transform: translateX(-50%) translateY(-10%);
  }

  50% {
    transform: translateX(50%) translateY(10%);
  }

  100% {
    transform: translateX(-50%) translateY(-10%);
  }
}

.gradient-bg {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(40deg, var(--color-bg1), var(--color-bg2));
  top: 0;
  left: 0;
}

.gradient-bg svg {
  position: fixed;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
}

.gradient-bg .gradients-container {
  filter: url(#goo) blur(40px);
  width: 100%;
  height: 100%;
}

.gradient-bg .g1 {
  position: absolute;
  background: radial-gradient(
      circle at center,
      rgba(var(--color1), 0.8) 0,
      rgba(var(--color1), 0) 50%
    )
    no-repeat;
  mix-blend-mode: var(--blending);
  width: var(--circle-size);
  height: var(--circle-size);
  top: calc(50% - var(--circle-size) / 2);
  left: calc(50% - var(--circle-size) / 2);
  transform-origin: center center;
  -webkit-animation: moveVertical 30s ease infinite;
  animation: moveVertical 30s ease infinite;
  opacity: 1;
}

.gradient-bg .g2 {
  position: absolute;
  background: radial-gradient(
      circle at center,
      rgba(var(--color2), 0.8) 0,
      rgba(var(--color2), 0) 50%
    )
    no-repeat;
  mix-blend-mode: var(--blending);
  width: var(--circle-size);
  height: var(--circle-size);
  top: calc(50% - var(--circle-size) / 2);
  left: calc(50% - var(--circle-size) / 2);
  transform-origin: calc(50% - 400px);
  animation: moveInCircle 20s reverse infinite;
  opacity: 1;
}

.gradient-bg .g3 {
  position: absolute;
  background: radial-gradient(
      circle at center,
      rgba(var(--color3), 0.8) 0,
      rgba(var(--color3), 0) 50%
    )
    no-repeat;
  mix-blend-mode: var(--blending);
  width: var(--circle-size);
  height: var(--circle-size);
  top: calc(50% - var(--circle-size) / 2 + 200px);
  left: calc(50% - var(--circle-size) / 2 - 500px);
  transform-origin: calc(50% + 400px);
  -webkit-animation: moveInCircle 40s linear infinite;
  animation: moveInCircle 40s linear infinite;
  opacity: 1;
}

.gradient-bg .g4 {
  position: absolute;
  background: radial-gradient(
      circle at center,
      rgba(var(--color4), 0.8) 0,
      rgba(var(--color4), 0) 50%
    )
    no-repeat;
  mix-blend-mode: var(--blending);
  width: var(--circle-size);
  height: var(--circle-size);
  top: calc(50% - var(--circle-size) / 2);
  left: calc(50% - var(--circle-size) / 2);
  transform-origin: calc(50% - 200px);
  -webkit-animation: moveHorizontal 40s ease infinite;
  animation: moveHorizontal 40s ease infinite;
  opacity: 0.7;
}

.gradient-bg .g5 {
  position: absolute;
  background: radial-gradient(
      circle at center,
      rgba(var(--color5), 0.8) 0,
      rgba(var(--color5), 0) 50%
    )
    no-repeat;
  mix-blend-mode: var(--blending);
  width: calc(var(--circle-size) * 2);
  height: calc(var(--circle-size) * 2);
  top: calc(50% - var(--circle-size));
  left: calc(50% - var(--circle-size));
  transform-origin: calc(50% - 800px) calc(50% + 200px);
  -webkit-animation: moveInCircle 20s ease infinite;
  animation: moveInCircle 20s ease infinite;
  opacity: 1;
}

.gradient-bg .interactive {
  position: absolute;
  background: radial-gradient(
      circle at center,
      rgba(var(--color-interactive), 0.8) 0,
      rgba(var(--color-interactive), 0) 50%
    )
    no-repeat;
  mix-blend-mode: var(--blending);
  width: 100%;
  height: 100%;
  top: -50%;
  left: -50%;
  opacity: 0.7;
}
</style>
