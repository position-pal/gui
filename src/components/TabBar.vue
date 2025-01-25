<template>
  <nav class="fixed-bottom">
    <router-link class="active tabbar-element" to="/">
      <h3 class="bi bi-house"></h3>
      <span> Home </span>
    </router-link>

    <router-link class="tabbar-element" to="/map">
      <h3 class="bi bi-pin-map"></h3>
      <span> Map </span>
    </router-link>

    <router-link class="tabbar-element" to="/chat">
      <h3 class="bi bi-chat-dots"></h3>
      <span> Chat </span>
    </router-link>

    <router-link class="tabbar-element" to="/profile">
      <h3 class="bi bi-person"></h3>
      <span> Profile </span>
    </router-link>
  </nav>
</template>

<script>
export default {
  name: 'BottomBar',
  mounted() {
    const navigationOptions = [
      {
        name: 'home',
        color: '#5B37B7',
      },
      {
        name: 'profile',
        color: '#C9379D',
      },
      {
        name: 'map',
        color: '#1AAB8A',
      },
      {
        name: 'chat',
        color: '#E6A919',
      },
    ]
    const links = document.querySelectorAll('.tabbar-element')
    // function called in response to a click event on the anchor link
    function handleClick(e) {
      // prevent the default behavior, but most importantly remove the class of .active from those elements with it
      e.preventDefault()
      links.forEach((link) => {
        if (link.classList.contains('active')) {
          link.classList.remove('active')
        }
      })

      // retrieve the option described the link element
      const name = this.textContent.trim().toLowerCase()
      // find in the array the object with the matching name
      // store a reference to its color
      const { color } = navigationOptions.find((item) => item.name === name)

      // retrieve the custom property for the --hover-c property, to make it so that the properties are updated only when necessary
      const style = window.getComputedStyle(this)
      const hoverColor = style.getPropertyValue('--hover-c')
      // if the two don't match, update the custom property to show the hue with the text and the semi transparent background
      if (color !== hoverColor) {
        this.style.setProperty('--hover-bg', `${color}20`)
        this.style.setProperty('--hover-c', color)
      }

      // apply the class of active to animate the svg an show the span element
      this.classList.add('active')
    }

    // listen for a click event on each and every anchor link
    links.forEach((link) => link.addEventListener('click', handleClick))
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Open+Sans:700');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: #fff;
  padding: 1.5rem 2rem;
  border-radius: 0 0 30px 30px;
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
</style>
