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
                Save
              </button>
            </div>
            <ul class="list-group mt-3">
              <li
                v-for="(member, index) in members"
                :key="index"
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                {{ member }}
                <button
                  class="btn btn-danger btn-sm rounded-circle"
                  @click="removeMember(index)"
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
                @click="addMember"
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

<script>
import GradientBackground from '@/components/GradientBackground.vue'

export default {
  name: 'UpdateGroup',
  components: { GradientBackground },
  data() {
    return {
      groupName: 'Group Name', // Replace with actual group name
      members: ['Member 1', 'Member 2', 'Member 3'], // Replace with actual members
      newMember: '',
    }
  },
  methods: {
    addMember() {
      if (this.newMember.trim() !== '') {
        this.members.push(this.newMember.trim())
        this.newMember = ''
      }
    },
    removeMember(index) {
      this.members.splice(index, 1)
    },
    updateGroupName() {
      // Logic to update the group name
      console.log('Group name updated to:', this.groupName)
    },
    goBack() {
      this.$router.go(-1)
    },
  },
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
