import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import axios from 'axios'

export const useGroupStore = defineStore('group', () => {
  const groupId = ref(null)
  const users = ref([])
  const sessions = ref({})
  const isLoading = ref(false)
  const error = ref(null)

  const usersInfo = computed(() => {
    return users.value.map(user => {
      const userInfo = sessions.value[user.id]
      const info = {
        id: user.id,
        name: `${user.name} ${user.surname}`,
        email: user.email,
        state: userInfo?.state || "INACTIVE",
        lastSeen: userInfo?.lastSeen || "Never updated, yet",
        location: userInfo?.location || "Unknown position",
        tracking: userInfo?.tracking,
      }
      console.log(info);
      return info;
    })
  })

  watch(groupId, async (newId) => {
    if (newId) {
      isLoading.value = true;
      try {
        await Promise.all([fetchGroupUsers(), fetchGroupSessions()]);
      } catch (e) {
        handleError(e, 'loading group data');
      } finally {
        isLoading.value = false;
      }
    } else {
      resetStore();
    }
  })

  function setCurrentGroupId(id) {
    resetStore()
    groupId.value = id
  }

  async function fetchGroupUsers() {
    if (!groupId.value) return;
    isLoading.value = true;
    try {
      const response = await axios.get(`api/groups/${groupId.value}`);
      console.log(response);
      users.value = response.data.data.members;
      console.log(users.value);
    } catch (e) {
      handleError(e, 'fetch group users');
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchGroupSessions() {
    if (!groupId.value) return;
    try {
      const res = await axios.get(`api/session/session/${groupId.value}`);
      const sessionsList = res.data.data.sessions;
      console.log("Session data", sessionsList);
      sessions.value = sessionsList.reduce((acc, session) => {
        const userId = session.scope?.user?.value
        if (!userId) return acc
        acc[userId] = {
          lastSeen: new Date(
            parseInt(session.lastSampledLocation.timestamp.seconds) * 1_000
          ).toLocaleString(),
          location: {
            latitude: session.lastSampledLocation.location.latitude,
            longitude: session.lastSampledLocation.location.longitude
          },
          state: session.state,
          tracking: session.tracking,
        }
        return acc
      }, {})
    } catch (e) {
      error.value = e.message
    }
  }

  function updateUserSession(userId, sessionData) {
    if (!sessions.value[userId]) return;
    sessions.value[userId] = {
      ...sessions.value[userId],
      ...sessionData,
      lastSeen: new Date().toLocaleString()
    }
  }

  function handleError(error, context) {
    console.error(`Error in ${context}:`, error)
    error.value = `Failed to ${context}: ${error}`
  }

  function resetStore() {
    groupId.value = null
    users.value = []
    sessions.value = {}
    error.value = null
  }

  return {
    groupId,
    usersInfo,
    isLoading,
    error,
    setCurrentGroupId,
    fetchGroupUsers,
    fetchGroupSessions,
    updateUserSession,
    resetStore,
  }
})
