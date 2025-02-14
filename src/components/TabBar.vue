<template>
  <nav>
    <router-link class="active tabbar-element" to="/">
      <h3 class="bi bi-house"></h3>
    </router-link>

    <router-link class="tabbar-element" to="/map">
      <h3 class="bi bi-pin-map"></h3>
    </router-link>

    <router-link class="active sos-button" to="/sos">
       <h3 class="bi bi-exclamation-triangle"></h3>
       <span> SOS </span>
    </router-link>

    <router-link class="tabbar-element" to="/chat">
      <h3 class="bi bi-chat-dots"></h3>
    </router-link>

    <router-link class="tabbar-element" to="/profile">
      <h3 class="bi bi-person"></h3>
    </router-link>
  </nav>
</template>

<script>
export default {
  name: 'BottomBar',
  mounted() {
    const navigationOptions = [
      { name: 'home', color: '#5B37B7' },
      { name: 'profile', color: '#C9379D' },
      { name: 'map', color: '#1AAB8A' },
      { name: 'chat', color: '#E6A919' },
    ];
    const links = document.querySelectorAll('.tabbar-element');

    function handleClick(e) {
      e.preventDefault();
      links.forEach(link => link.classList.remove('active'));
      const name = this.querySelector('h3').classList[1].split('-')[2];
      const { color } = navigationOptions.find(item => item.name === name) || {};
      if (color) {
        this.style.setProperty('--hover-bg', `${color}20`);
        this.style.setProperty('--hover-c', color);
      }
      this.classList.add('active');
    }

    links.forEach(link => link.addEventListener('click', handleClick));
  }
}
</script>

<style scoped>
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
  --hover-bg: #5b37b720;
  --hover-c: #5b37b7;
}

.tabbar-element h3 {
  width: 28px;
  height: 28px;
  pointer-events: none;
  transition: color 0.3s ease-in-out;
}

.tabbar-element.active {
  background: var(--hover-bg);
  color: var(--hover-c);
  transition: background 0.3s ease-in-out;
}

.sos-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ff3b30;
  color: white;
  text-decoration: none;
  padding: 1rem 2rem;
  border-radius: 40px;
  box-shadow: 0 4px 12px rgba(255, 59, 48, 0.5);
  height: 60px;
  width: auto;
  min-width: 100px;
  font-size: 1.1rem;
  font-weight: bold;
}

.sos-button span {
  visibility: visible;
  font-size: 1rem;
  margin-left: 0.7rem;
}
</style>
