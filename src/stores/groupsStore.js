import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import axios from 'axios'

export const useGroupStore = defineStore('group', () => {
  const groupId = ref(null)
  const users = ref([])
  const sessions = ref({})
  const isLoading = ref(false)
  const error = ref(null)

  const usersInfo = computed(() =>
    users.value.map(user => ({
      id: user.id,
      name: `${user.name} ${user.surname}`,
      email: user.email,
      ...sessions.value[user.id]
    }))
  )

  watch(groupId, async (newId) => {
    if (newId) {
      isLoading.value = true;
      try {
        await Promise.all([fetchGroupUsers()]);
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
      const res = await fetch(`/api/session/session/${groupId.value}`).then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch group sessions')
        }
        return res.json()
      });
      const sessionsList = res.data.sessions
      sessions.value = sessionsList.reduce((acc, session) => {
        const userId = session.scope?.user?.value
        if (!userId) return acc
        acc[userId] = {
          lastSeen: new Date(
            parseInt(session.lastSampledLocation.timestamp.seconds) * 1_000
          ).toLocaleString(),
          location: {
            lat: session.lastSampledLocation.location.latitude,
            lng: session.lastSampledLocation.location.longitude
          },
          status: session.state
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
    error.value = `Failed to ${context}: ${error.message}`
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
