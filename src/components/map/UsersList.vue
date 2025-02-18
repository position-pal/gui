<template>
  <div class="users-list">
    <h2>Users</h2>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <p v-else-if="usersInfo.length === 0">No users found</p>
    <UserItem v-for="userInfo in usersInfo" :key="userInfo.id" :user="userInfo" />
  </div>
</template>

<script setup>
import { useGroupStore } from '@/stores/groupsStore.js'
import UserItem from './UserItem.vue'
import { storeToRefs } from 'pinia'

const store = useGroupStore()
const { usersInfo, isLoading, error } = storeToRefs(store)
</script>

<style scoped>
.users-list {
  max-height: 100%;
  overflow-y: auto;
  border-radius: 10px;
  border: 1px solid #ddd;
  background: white;
  padding: 10px;
}
</style>
