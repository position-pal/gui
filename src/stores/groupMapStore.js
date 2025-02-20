import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import axios from 'axios'

export const useGroupMapStore = defineStore('groupMap', () => {
  const groupId = ref(null)
  const users = ref([])
  const sessions = ref({})
  const selection = ref({ userId: null, location: null })
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
        lastSeen: userInfo?.lastSeen,
        location: userInfo?.location,
        tracking: userInfo?.tracking,
      }
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
      users.value = response.data.data.members;
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

  function selectUser(userId) {
    const userSession = sessions.value[userId]
    if (userSession?.location) {
      selection.value = {
        userId,
        location: userSession.location
      }
      return true
    }
    return false
  }

  function clearSelection() {
    selection.value = { userId: null, location: null }
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
    selection,
    setCurrentGroupId,
    fetchGroupUsers,
    fetchGroupSessions,
    updateUserSession,
    selectUser,
    clearSelection,
    resetStore,
  }
})
