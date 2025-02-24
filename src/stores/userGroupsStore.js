import { defineStore } from 'pinia'
import { ref, computed, reactive, watch } from 'vue'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useLocationStore } from '@/stores/locationStore.js'
import { getLoggedInUser, getToken } from '@/scripts/user.js'

export const useUserGroupsStore = defineStore('userGroups', () => {
  const locationStore = useLocationStore()
  let locationUnsubscribe = null

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

  const hasActiveWebSockets = computed(() => Object.keys(websockets).length > 0)

  watch(hasActiveWebSockets,  (hasWebSockets) => {
    if (hasWebSockets && !locationUnsubscribe) {
      locationStore.startTracking()
      locationUnsubscribe = locationStore.addLocationListener(broadcastLocation)
    } else if (!hasWebSockets && locationUnsubscribe) {
      locationStore.stopTracking()
      locationUnsubscribe()
      locationUnsubscribe = null
    }
  })

  function broadcastLocation(position) {
    console.log("Websockets are: ", websockets.value)
    Object.entries(websockets).forEach(([groupId, ws]) => {
      console.log(ws.isConnected)
      if (ws.isConnected) {
        const message = {
          SampledLocation: {
            timestamp: position.timestamp,
            user: getLoggedInUser().id,
            group: groupId,
            position: position.coordinates
          }
        }
        console.log(`Broadcasting message:`, message, " to group", groupId)
        ws.connection.send(JSON.stringify(message))
      }
    })
  }

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
            id: "b2f14782-01c7-4104-8deb-fad50c1a8399",
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
    const userData = getLoggedInUser()
    const ws = new WebSocket(
      `ws://localhost:3000/ws/location/${groupId}/${userData.id}`
    )
    ws.onopen = async () => {
      console.log(`WebSocket connected for group ${groupId} and uid ${userData.id}`)
      websockets[groupId] = { connection: ws, isConnected: true }
      console.log("Authenticating WebSocket with: ", getToken())
      ws.send(JSON.stringify({ Authorization: `Bearer ${getToken()}` }))
    }
    ws.onclose = () => {
      console.log(`WebSocket disconnected for group ${groupId} and uid ${userData.id}`)
      if (websockets[groupId]) {
        closeWebSocket(groupId)
      }
    }
    ws.onmessage = (event) => {
      console.log(`WebSocket message for group ${groupId} and uid ${userData.id}:`, event.data)
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
    if (!group) {
      console.error("No group found")
      return
    }
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
