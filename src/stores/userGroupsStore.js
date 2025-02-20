import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import AsyncStorage from '@react-native-async-storage/async-storage' // Per Vue Native

export const useUserGroupsStore = defineStore('userGroups', () => {
  const groups = ref([])
  const websockets = ref(new Map())
  const isLoading = ref(false)
  const error = ref(null)

  const groupsWithConnection = computed(() => {
    return groups.value.map(group => ({
      ...group,
      isConnected: websockets.value.has(group.id) && websockets.value.get(group.id).isConnected
    }))
  })

  async function saveTrackingState(groupId, enabled) {
    const trackingState = JSON.parse(localStorage.getItem('trackingState')) || {}
    trackingState[groupId] = enabled
    localStorage.setItem('trackingState', JSON.stringify(trackingState))
    try {
      await AsyncStorage.setItem('trackingState', JSON.stringify(trackingState))
    } catch (e) {
      console.warn(`AsyncStorage not available, falling back to localStorage (${e})`)
    }
  }

  async function fetchUserGroups() {
    console.log("FETCHING GROUPS")
    isLoading.value = true
    error.value = null
    try {
      // TODO: @valerio please take care of this
      // const response = await axios.get('api/user/groups')
      const response = {
        data: [
          {
            id: "bb1b250a-e7fb-4bd3-a623-04b88d5055bb",
            name: "Pimpa",
            // + other info I don't care
          }
        ]
      }
      console.log(">> Response:")
      console.log(response)
      const trackingState = JSON.parse(localStorage.getItem('trackingState')) || {}
      groups.value = response.data.map(group => ({
        ...group,
        trackingEnabled: trackingState[group.id] !== undefined ? trackingState[group.id] : false
      }))
      initializeWebSockets()
      console.log(websockets)
    } catch (e) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  function initializeWebSockets() {
    groups.value.forEach(group => {
      if (group?.trackingEnabled && !websockets.value.has(group.id)) {
        openWebSocket(group.id)
      }
    })
  }

  function openWebSocket(groupId) {
    if (websockets.value.has(groupId)) return
    const userData = sessionStorage.getItem("userData")
    console.log(`Opening ws for ${groupId} by ${userData}`)
    const ws = new WebSocket(
      `ws://localhost:3000/ws/location/${groupId}/${userData.id}`
    )
    ws.onopen = () => {
      console.log(`WebSocket connected for group ${groupId}`)
      websockets.value.set(groupId, { connection: ws, isConnected: true })
    }
    ws.onclose = () => {
      console.log(`WebSocket disconnected for group ${groupId}`)
      if (websockets.value.has(groupId)) {
        websockets.value.get(groupId).isConnected = false
      }
    }
    ws.onerror = (error) => {
      console.error(`WebSocket error for group ${groupId}:`, error)
    }
  }

  function closeWebSocket(groupId) {
    if (websockets.value.has(groupId)) {
      websockets.value.get(groupId).connection.close()
      websockets.value.delete(groupId)
    }
  }

  function closeAllWebSockets() {
    websockets.value.forEach((_, groupId) => closeWebSocket(groupId))
  }

  async function toggleGroupTracking(groupId) {
    const group = groups.value.find(g => g.id === groupId)
    if (!group) return
    try {
      group.trackingEnabled = !group.trackingEnabled
      await saveTrackingState(groupId, group.trackingEnabled)
      if (group.trackingEnabled) {
        openWebSocket(groupId)
      } else {
        closeWebSocket(groupId)
      }
    } catch (e) {
      error.value = e.message
    }
  }

  return {
    groups,
    groupsWithConnection,
    isLoading,
    error,
    fetchUserGroups,
    toggleGroupTracking,
    closeAllWebSockets
  }
})
