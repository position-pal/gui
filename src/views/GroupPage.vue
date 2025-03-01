<template>
  <div class="h-100 group-container p-1">
    <div
      class="position-fixed fixed-top d-flex justify-content-between align-items-center"
      style="background-color: white"
    >
      <h1
        class="mt-3 p-1"
        style="margin-left: 3%"
      >
        Groups
      </h1>
      <button
        class="btn btn-primary rounded-circle mr-1 align-items-center"
        style="width: 40px; height: 40px; margin-right: 6%; margin-top: 3%"
        @click="showPopup = true"
      >
        <i class="bi bi-plus" />
      </button>
    </div>
    <ul
      class="list-group overflow-auto"
      style="margin-top: 10vh"
    >
      <li
        v-for="group in groups"
        :key="group.id"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div>
          <h5 class="mb-1">
            {{ group.name }}
          </h5>
          <small class="text-muted">{{ group.members.length }} members</small>
        </div>
        <div class="d-flex gap-2">
          <router-link
            class="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
            style="width: 40px; height: 40px"
            :to="`/map/${group.id}`"
          >
            <i class="bi bi-pin-map" />
          </router-link>
          <router-link
            class="btn btn-success rounded-circle d-flex align-items-center justify-content-center"
            style="width: 40px; height: 40px"
            :to="`/chat/${group.id}`"
          >
            <i class="bi bi-chat" />
          </router-link>
          <router-link
            class="btn btn-info rounded-circle d-flex align-items-center justify-content-center"
            style="width: 40px; height: 40px"
            :to="`/groups/${group.id}`"
          >
            <i class="bi bi-three-dots" />
          </router-link>
        </div>
      </li>
    </ul>

    <div
      v-if="showPopup"
      class="popup-overlay"
    >
      <div class="card popup-card">
        <div class="card-body text-center">
          <h5 class="card-title">
            Create new group
          </h5>
          <input
            v-model="newGroupName"
            type="text"
            class="form-control mb-3"
            placeholder="Group Name"
          >
          <div class="d-flex justify-content-between">
            <button
              class="btn btn-secondary"
              @click="showPopup = false"
            >
              Cancel
            </button>
            <button
              class="btn btn-primary"
              @click="createGroupByName"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserGroupsStore } from '@/stores/userGroupsStore.js';
import { storeToRefs } from 'pinia';
import { ref, onMounted } from 'vue';
import { createGroup } from '@/scripts/group.js'
import { getLoggedInUser } from '@/scripts/user.js'

const groupStore = useUserGroupsStore();
const { groups } = storeToRefs(groupStore);
const showPopup = ref(false);
const newGroupName = ref('');

onMounted(async () => {
  await groupStore.fetchUserGroups();
});

const createGroupByName = async () => {
  if (newGroupName.value.trim() === '') return;
  const myUser = getLoggedInUser();
  await createGroup({ name: newGroupName.value, createdBy: myUser, members: [myUser] });
  await groupStore.fetchUserGroups();
  newGroupName.value = '';
  showPopup.value = false;
};
</script>

<style scoped>

.list-group{
  max-height: 100%;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.popup-card {
  width: 90%;
  max-width: 400px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
