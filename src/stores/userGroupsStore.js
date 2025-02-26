import { defineStore } from 'pinia'
import { ref, computed, reactive, watch } from 'vue'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useLocationStore } from '@/stores/locationStore.js'
import { getLoggedInUser, getToken } from '@/scripts/user.js'
import router from '@/router/index.js'
import axios from 'axios'

export const useUserGroupsStore = defineStore('userGroups', () => {
  const locationStore = useLocationStore()
  let locationUnsubscribe = null

  const groups = ref([])
  const websockets = reactive({})
  const messageListeners = reactive({})

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

  const hasActiveTracking = computed(() => {
    return groups.value.some(g => g.trackingEnabled)
  })

  watch(hasActiveTracking,  (hasTracking) => {
    if (hasTracking && !locationUnsubscribe) {
      locationStore.startTracking()
      locationUnsubscribe = locationStore.addLocationListener(broadcastLocation)
    } else if (!hasTracking && locationUnsubscribe) {
      locationStore.stopTracking()
      locationUnsubscribe()
      locationUnsubscribe = null
    }
  })

  function broadcastLocation(position) {
    console.log("Broadcasting location to enabled groups")
    groups.value.forEach(group => {
      if (group.trackingEnabled && websockets[group.id]?.isConnected) {
        const ws = websockets[group.id].connection
        console.log("Sending update with websocket: ", ws, " and position: ", position)
        const message = {
          SampledLocation: {
            timestamp: position.timestamp,
            user: getLoggedInUser().id,
            group: group.id,
            position: position.coordinates
          }
        }
        console.log(`Broadcasting message:`, message, " to group", group.id)
        ws.send(JSON.stringify(message))
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
    } finally {
      console.log("Tracking state saved into localStorage: ", localStorage.getItem('trackingState'))
    }
  }

  async function fetchUserGroups() {
    isLoading.value = true
    error.value = null
    try {
      const user = getLoggedInUser()
      const response2 = await axios.get('/api/groups/'+user.id)
      console.log(">> Response2:", response2)
      const response = {
        data: [
          {
            id: "a4b1093a-43b9-4a7b-88bc-8f84fcb967e0",
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
        trackingEnabled: trackingState[group.id] === true
      }))
      groups.value.forEach(g => {
        if (trackingState[g.id] === undefined) {
          saveTrackingState(g.id, false)
        }
      })
      initializeWebSockets()
    } catch (e) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  function initializeWebSockets() {
    groups.value.forEach(group => {
      if (!websockets[group.id]) {
        openWebSocket(group.id)
      }
    })
  }

  function openWebSocket(groupId) {
    if (websockets[groupId]) return
    const userData = getLoggedInUser()
    console.log(`[WS] Opening WebSocket for group ${groupId}`)
    console.log(`[WS] Already present websockets:`, websockets)
    const ws = new WebSocket(
      `ws://localhost:3000/ws/location/${groupId}/${userData.id}`
    )
    ws.onopen = async () => {
      console.log(`[WS] WebSocket connected for group ${groupId}`)
      console.log("[WS] Authenticating WebSocket")
      ws.send(JSON.stringify({ Authorization: `Bearer ${getToken()}` }))
    }
    ws.onclose = () => {
      console.log(`[WS] WebSocket disconnected for group ${groupId}`)
      if (websockets[groupId]) {
        closeWebSocket(groupId)
      }
    }
    ws.onmessage = (message) => {
      console.log(`[WS] WebSocket message for group ${groupId}:`, message.data)
      if (message.data === "OK") {
        websockets[groupId] = { connection: ws, isConnected: true }
      } else if (message.data === "Unauthorized") {
        console.error("[WS] WebSocket unauthorized")
        closeWebSocket(groupId)
        router.push({ name: 'login' }).then(() => console.log("Redirected to login"))
      } else {
        try {
          if (typeof  message.data === 'string') {
            handleMessage(JSON.parse(message.data), groupId)
          } else if (message.data instanceof Blob) {
            message.data.text().then(text => handleMessage(JSON.parse(text), groupId))
          } else {
            console.error("[WS] Unexpected message type:", message.data)
          }
        } catch (e) {
          console.error("[WS] Error parsing message:", e)
        }
      }
    }
    ws.onerror = (error) => console.error(`WebSocket for (${groupId}, ${userData.id}):`, error)
    console.log(`[WS] All websockets: `, websockets)
  }

  function handleMessage(data, groupId) {
    console.log("[WS] Received message:", data)
    if (messageListeners[groupId]) {
      messageListeners[groupId].forEach(listener => {
        try {
          listener(data)
        } catch (e) {
          console.error("[WS] Error notifying listener:", e)
        }
      })
    }
  }

  function closeWebSocket(groupId) {
    if (websockets[groupId]) {
      websockets[groupId].connection.close()
      delete websockets[groupId]
      delete messageListeners[groupId]
    }
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
      if (!websockets[groupId]) {
        openWebSocket(groupId)
      }
    } catch (e) {
      error.value = e.message
    }
  }

  function addGroupMessageListener(groupId, listener) {
    if (!messageListeners[groupId]) {
      messageListeners[groupId] = []
    }
    messageListeners[groupId].push(listener)
    if (!websockets[groupId]) {
      openWebSocket(groupId)
    }
    return () => {
      if (messageListeners[groupId]) {
        const index = messageListeners[groupId].indexOf(listener)
        if (index > -1) {
          messageListeners[groupId].splice(index, 1)
        }
      }
    }
  }

  function cleanup() {
    Object.keys(websockets).forEach(closeWebSocket)
    Object.keys(messageListeners).forEach(groupId => delete messageListeners[groupId])
    if (locationUnsubscribe) {
      locationStore.stopTracking()
      locationUnsubscribe()
      locationUnsubscribe = null
    }
  }

  return {
    groups,
    groupsWithConnection,
    isLoading,
    error,
    fetchUserGroups,
    addGroupMessageListener,
    toggleGroupTracking,
    cleanup
  }
})
