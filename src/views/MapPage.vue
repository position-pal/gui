<template>
  <div class="container">
    <MapView />
    <div class="list-container">
      <PeopleList />
    </div>
  </div>
</template>

<script>
import MapView from "../components/MapView.vue";
import PeopleList from "../components/PeopleList.vue";

export default {
  components: { MapView, PeopleList }
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
  max-height: 35vh;
  background: white;
  padding: 15px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  overflow-y: auto;
  box-shadow: 0px -4px 10px rgba(0, 0, 0, 0.2); /* Effetto ombra */
  transition: transform 0.3s ease-in-out;
}

.list-container:hover {
  transform: translateY(-5px);
}
</style>
