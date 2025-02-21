import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const useUserGroupsStore = defineStore('userGroups', () => {
  const groups = ref([])
  const websockets = reactive({})
  const isLoading = ref(false)
  const error = ref(null)

  const groupsWithConnection = computed(() => {
    return groups.value.map(group => {
      const hasWebSocket = !!websockets[group.id]
      const isConnected = hasWebSocket ? websockets[group.id].isConnected : false
      return {
        ...group,
        isConnected
      }
    })
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
            id: "a3dadff2-4669-434b-b58a-d0387fd05e9d",
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
      if (group?.trackingEnabled && !websockets[group.id]) {
        openWebSocket(group.id)
      }
    })
  }

  function openWebSocket(groupId) {
    if (websockets[groupId]) return
    const userData = JSON.parse(sessionStorage.getItem("userData"))
    const ws = new WebSocket(
      `ws://localhost:3000/ws/location/${groupId}/${userData.id}`
    )
    ws.onopen = async () => {
      console.log(`WebSocket connected for group ${groupId} and uid ${userData.id}`)
      websockets[groupId] = { connection: ws, isConnected: true }
    }
    ws.onclose = () => {
      console.log(`WebSocket disconnected for group ${groupId} and uid ${userData.id}`)
      if (websockets[groupId]) {
        websockets[groupId].isConnected = false
      }
    }
    ws.onerror = (error) => console.error(`WebSocket for (${groupId}, ${userData.id}):`, error)
  }

  function closeWebSocket(groupId) {
    if (websockets[groupId]) {
      websockets[groupId].connection.close()
      delete websockets[groupId]
    }
  }

  function closeAllWebSockets() {
    Object.keys(websockets).forEach(closeWebSocket)
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
