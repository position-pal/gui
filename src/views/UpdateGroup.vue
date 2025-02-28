<template>
  <div class="update-group-container">
    <div class="row justify-content-center w-100">
      <div class="col-12 col-md-8 col-lg-6">
        <button
          class="btn btn-light back-button rounded-circle"
          @click="goBack"
        >
          <i class="bi bi-arrow-left" />
        </button>
        <div class="card update-group-card mt-2">
          <div class="card-body text-center">
            <div class="input-group mb-3">
              <input
                v-model="groupName"
                type="text"
                class="form-control"
                placeholder="Group Name"
              >
              <button
                class="btn btn-primary"
                @click="updateGroupName"
              >
                <template v-if="isSaving">
                  <span
                    class="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Saving...
                </template>
                <template v-else-if="saveSuccess">
                  <i class="bi bi-check-lg" /> Saved
                </template>
                <template v-else>
                  Save
                </template>
              </button>
            </div>
            <ul class="list-group mt-3">
              <li
                v-for="(member, index) in members"
                :key="index"
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                {{ member.name + " " + member.surname + "\n" + member.email }}
                <button
                  class="btn btn-danger btn-sm rounded-circle"
                  @click="removeMemberByMemberID(member.id)"
                >
                  <i class="bi bi-person-dash" />
                </button>
              </li>
            </ul>
            <div class="input-group mt-3">
              <input
                v-model="newMember"
                type="text"
                class="form-control"
                placeholder="Add new member"
              >
              <button
                class="btn btn-success"
                @click="addMemberByMemberEmail"
              >
                <i class="bi bi-person-add" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <GradientBackground />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import GradientBackground from '@/components/GradientBackground.vue'
import { useUserGroupsStore } from '@/stores/userGroupsStore.js'
import { storeToRefs } from 'pinia'
import { updateGroup, addMember, removeMember } from '@/scripts/group.js'
import { getUserByEmail } from '@/scripts/user.js'

const groupStore = useUserGroupsStore();
const { groups } = storeToRefs(groupStore)

const groupName = ref('')
const newMember = ref('')
const members = ref([])

const route = useRoute();
const groupId = route.params.groupId;
let selectedGroup = {}

const isSaving = ref(false)
const saveSuccess = ref(false)

onMounted(async () => {
  await groupStore.fetchUserGroups();
  selectedGroup = groups.value.find(group => group.id === groupId)
  groupName.value = selectedGroup?.name || ''
  members.value = selectedGroup?.members || []
})

const router = useRouter()

function goBack() {
  router.back()
}

async function updateGroupName() {
  isSaving.value = true
  saveSuccess.value = false

  if (await updateGroup(groupId, { "name": groupName.value })) {
    isSaving.value = false
    saveSuccess.value = true
    // Reset dello stato di successo dopo 2 secondi
    setTimeout(() => {
      saveSuccess.value = false
    }, 2000)
    return
  }

  isSaving.value = false
  alert("Error Updating Group")
}

async function removeMemberByMemberID(memberId) {
  const memberIndex = members.value.findIndex(member => member.id === memberId);
  if (memberIndex !== -1) {
    if(await removeMember(groupId, members.value[memberIndex])){
      members.value.splice(memberIndex, 1);
    }
  }
}

async function addMemberByMemberEmail() {
  const member = newMember.value.trim()
  if (member !== '') {
    const user = await getUserByEmail(member)
    if(await addMember(groupId, user)){
      members.value.push(user)
    }
  }
}
</script>

<style>
.update-group-container {
  z-index: 100;
  width: 100vw !important;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  user-select: none;
}

.update-group-card {
  border: none;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.list-group {
  max-height: 200px;
  overflow-y: auto;
}

.btn-sm.rounded-circle {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  margin-bottom: auto;
}
</style>
