<template>
  <div class="person-item">
    <div class="avatar"></div>
    <div class="info">
      <h3>{{ person.name }}</h3>
      <p>{{ person.location }} • {{ person.time }}</p>
    </div>
    <div class="distance">{{ person.distance }}</div>
  </div>
</template>

<script>
export default {
  props: ["person"]
};
</script>

<style scoped>
.person-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}
.avatar {
  width: 40px;
  height: 40px;
  background-color: gray;
  border-radius: 50%;
  margin-right: 10px;
}
.info {
  flex: 1;
}
.distance {
  color: gray;
}
</style>
