<template>
  <div class="person-item">
    <div class="icon">
      <i class="bi bi-person-circle"></i>
    </div>
    <div class="info">
      <h4>{{ person.name }}</h4>
      <span>{{ person.location }} • {{ person.time }}</span>
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
.icon {
  font-size: 22px;
  color: #1AAB8A;
  margin-right: 10px;
}
.person-item {
  display: flex;
  align-items: center;
  padding: 5px;
  border-bottom: 1px solid #ddd;
}
.person-item:hover {
  background: #D6F5EE;
  border-radius: 10px;
  transition: background 0.6s ease-in-out;
}
.person-item h4 {
  color: #1AAB8A;
  font-size: 16px;
  margin: 0;
}
.info {
  flex: 1;
  padding: 5px;
  font-size: 14px;
}
.distance {
  background: #1AAB8A;
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
}
</style>
