<template>
  <div class="home-view">
    <div class="text-container">
      <h1 class="pb-4 display-1">Position Pal</h1>
      <h5>Share your location</h5>
      <h5>Chat with friends</h5>
      <h5>Feel safe</h5>
      <button class="btn btn-lg primary-bg text-white mt-5" style="box-shadow: 0 2px 25px #38b6ff">
        Login
      </button>
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
      <div class="d-flex justify-content-center align-items-center pt-5">
        <img
          src="@/assets/home_logo.png"
          alt="Position Pal Logo"
          class="img-fluid"
          style="background: none; width: 27vh; height: auto"
        />
      </div>
      <div class="gradients-container">
        <div class="g1"></div>
        <div class="g2"></div>
        <div class="g3"></div>
        <div class="g4"></div>
        <div class="g5"></div>
        <div class="interactive"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
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
  height: 100%;
}

.text-container {
  z-index: 100;
  width: 100vw;
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
  height: 100%;
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
