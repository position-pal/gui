<template>
  <div class="people-list">
    <h2>People</h2>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <PersonItem v-for="user in usersInfo" :key="user.id" :user="user" />
  </div>
</template>

<script setup>
import { useGroupStore } from '@/stores/groupsStore.js'
import PersonItem from './PersonItem.vue'
const store = useGroupStore()
const { usersInfo, isLoading, error } = store
</script>

<style scoped>
.people-list {
  max-height: 100%;
  overflow-y: auto;
  border-radius: 10px;
  border: 1px solid #ddd;
  background: white;
  padding: 10px;
}
</style>
