import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import axios from 'axios'

export const useGroupMapStore = defineStore('groupMap', () => {
  const groupId = ref(null)
  const users = ref([])
  const sessions = ref({})
  const selection = ref({ userId: null, location: null })
  const isLoading = ref(false)
  const error = ref(null)

  const usersInfo = computed(() => {
    return users.value.map((user) => {
      const userInfo = sessions.value[user.id]
      return {
        id: user.id,
        name: `${user.name} ${user.surname}`,
        state: userInfo?.state || 'INACTIVE',
        lastSeen: userInfo?.lastSeen,
        location: userInfo?.location,
        tracking: userInfo?.tracking,
      }
    })
  })

  watch(groupId, async (newId) => {
    if (newId) {
      isLoading.value = true
      try {
        await Promise.all([fetchGroupUsers(), fetchGroupSessions()])
      } catch (e) {
        handleError(e, 'loading group data')
      } finally {
        isLoading.value = false
      }
    } else {
      resetStore()
    }
  })

  function setCurrentGroupId(id) {
    resetStore()
    groupId.value = id
  }

  async function fetchGroupUsers() {
    if (!groupId.value) return
    isLoading.value = true
    try {
      const response = await axios.get(`api/groups/${groupId.value}`)
      users.value = response.data.data.members
    } catch (e) {
      handleError(e, 'fetch group users')
    } finally {
      isLoading.value = false
    }
  }

  async function fetchGroupSessions() {
    if (!groupId.value) return
    try {
      const res = await axios.get(`api/session/session/${groupId.value}`)
      const sessionsList = res.data.data.sessions
      sessions.value = sessionsList.reduce((acc, session) => {
        const userId = session.scope?.user?.value
        if (!userId) return acc
        acc[userId] = {
          lastSeen: new Date(
            parseInt(session.lastSampledLocation.timestamp.seconds) * 1_000,
          ).toLocaleString(),
          location: {
            latitude: session.lastSampledLocation.location.latitude,
            longitude: session.lastSampledLocation.location.longitude,
          },
          state: session.state,
          tracking: (session.activeTracking?.route?.locations ?? []).map(loc => ({
            location: loc.location,
            timestamp: new Date(parseInt(loc.timestamp.seconds) * 1_000).toLocaleString()
          })),
        }
        return acc
      }, {})
    } catch (e) {
      error.value = e.message
    }
  }

  function updateUserSession(userId, sessionData) {
    const oldSession = sessions.value[userId];
    let trackedLocations = [];
    if (sessionData.state === 'SOS' || sessionData.state === 'ROUTING') {
      trackedLocations = oldSession.tracking;
      trackedLocations.push({ location: sessionData.location, timestamp: sessionData.lastSeen });
    }
    sessions.value[userId] = {
      // Note: if no updates were provided the `id` and `name` are undefined and cannot
      //       be recovered by the current `oldSession`.
      id: userId,
      name: users.value.find((user) => user.id === userId).name,
      ...oldSession,
      ...sessionData,
      tracking: trackedLocations,
      lastSeen: new Date().toLocaleString(),
    };
    console.log(sessions.value[userId]);
  }

  function selectUser(userId) {
    const userSession = sessions.value[userId]
    if (userSession?.location) {
      selection.value = {
        userId,
        location: userSession.location,
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
