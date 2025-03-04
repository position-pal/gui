import { defineStore } from 'pinia'
import { ref, computed, reactive, watch } from 'vue'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useLocationStore } from '@/stores/locationStore.js'
import { useChatStore } from '@/stores/chatStore';
import { getLoggedInUser, getToken, isTestUser } from '@/scripts/user.js'
import router from '@/router/index.js'
import axios from 'axios'
import { getMockedPosition } from '@/scripts/mocked-location.js'

export const useUserGroupsStore = defineStore('userGroups', () => {
  const locationStore = useLocationStore()
  const chatStore = useChatStore();

  let locationUnsubscribe = null

  const groups = ref([])
  const trackingWebsockets = reactive({})
  const chatWebsockets = reactive({})

  const messageListeners = reactive({})

  const sosActive = ref(false)
  const pendingSosGroups = ref([])

  const isLoading = ref(false)
  const error = ref(null)

  const groupsWithConnection = computed(() => {
    return groups.value.map(group => {
      const hasWebSocket = !!trackingWebsockets[group.id]
      const isConnected = hasWebSocket ? trackingWebsockets[group.id].isConnected : false
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
    console.debug("Broadcasting location to enabled groups")
    groups.value.forEach(group => {
      if (group.trackingEnabled && trackingWebsockets[group.id]?.isConnected) {
        const ws = trackingWebsockets[group.id].connection
        const message = {
          SampledLocation: {
            timestamp: position.timestamp,
            user: getLoggedInUser().id,
            group: group.id,
            position: position.coordinates
          }
        }
        console.debug(`Broadcasting message:`, message, " to group", group.id)
        ws.send(JSON.stringify(message))
      }
    })
  }

  function sendChatMessage(text, groupId) {
    console.log("Sending a message in the chat");
    const ws = chatWebsockets[groupId].connection;
    ws.send(JSON.stringify(text));
  }


  function broadcastSOS() {
    if (sosActive.value) {
      console.debug("SOS already active, not starting again")
      return
    }
    console.debug("Broadcasting SOS to all groups")
    sosActive.value = true
    pendingSosGroups.value = []
    groups.value.forEach(async group => {
      pendingSosGroups.value.push(group.id)
      if (!group.trackingEnabled) {
        group.trackingEnabled = true
        await saveTrackingState(group.id, true)
      }
      if (!trackingWebsockets[group.id]) {
        openTrackingWebSocket(group.id)
      } else if (trackingWebsockets[group.id].isConnected) {
        sendSosToGroup(group.id)
      }
    })
    if (!locationUnsubscribe) {
      locationStore.startTracking({
        updateInterval: 5_000, // More frequent updates during SOS
        enableHighAccuracy: true
      })
      locationUnsubscribe = locationStore.addLocationListener(broadcastLocation)
    }
  }

  function sendSosToGroup(groupId) {
    if (!trackingWebsockets[groupId]?.isConnected) return
    let currentPosition;
    if (isTestUser()) {
      currentPosition = getMockedPosition()
    } else {
      currentPosition = locationStore.currentPosition
    }
    const ws = trackingWebsockets[groupId].connection
    if (!currentPosition.coordinates) {
      console.error("No current position available")
      return
    }
    const message = {
      SOSAlertTriggered: {
        timestamp: currentPosition.timestamp,
        user: getLoggedInUser().id,
        group: groupId,
        position: currentPosition.coordinates
      }
    }
    console.debug(`Broadcasting SOS message:`, message, " to group", groupId)
    ws.send(JSON.stringify(message))
  }

  function stopSOS() {
    if (!sosActive.value) {
      console.debug("No active SOS to stop")
      return
    }
    console.debug("Stopping SOS broadcast")
    // Send final message to notify all groups that SOS is no longer active
    groups.value.forEach(group => {
      if (trackingWebsockets[group.id]?.isConnected) {
        const ws = trackingWebsockets[group.id].connection
        const message = {
          SOSAlertStopped: {
            timestamp: new Date().toISOString(),
            user: getLoggedInUser().id,
            group: group.id,
          }
        }
        console.debug(`Broadcasting SOS deactivation:`, message, " to group", group.id)
        ws.send(JSON.stringify(message))
      }
    })
    sosActive.value = false
    pendingSosGroups.value = []
    // We don't disable tracking automatically - leave that to user preference
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
      const response = await axios.get('api/groups/user/' + user.id)
      const trackingState = JSON.parse(localStorage.getItem('trackingState')) || {}
      groups.value = response.data.data.map(group => ({
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
      if (!trackingWebsockets[group.id]) {
        openTrackingWebSocket(group.id)
        openChatWebSocket(group.id)
      }
    })
  }

  async function getGroupInformation(groupId) {
    isLoading.value = true
    error.value = null
    try {
      const response = await axios.get(`api/groups/${groupId}`);
      return response.data.data;
    } catch (e) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  function openTrackingWebSocket(groupId) {
    if (trackingWebsockets[groupId]) return
    const userData = getLoggedInUser()
    console.debug(`[WS] Opening WebSocket for group ${groupId}`)
    console.debug(`[WS] Already present websockets:`, trackingWebsockets)
    const ws = new WebSocket(
      `ws://localhost:3000/ws/location/${groupId}/${userData.id}`
    )
    ws.onopen = async () => {
      console.debug(`[WS] WebSocket connected for group ${groupId}`)
      console.debug("[WS] Authenticating WebSocket")
      ws.send(JSON.stringify({ Authorization: `Bearer ${getToken()}` }))
    }
    ws.onclose = () => {
      console.debug(`[WS] WebSocket disconnected for group ${groupId}`)
      if (trackingWebsockets[groupId]) {
        closeTrackingWebSocket(groupId)
      }
    }
    ws.onmessage = (message) => {
      console.debug(`[WS] WebSocket message for group ${groupId}:`, message.data)
      if (message.data === "OK") {
        console.debug("[WS] WebSocket authorized")
        trackingWebsockets[groupId] = { connection: ws, isConnected: true }
        if (sosActive.value && pendingSosGroups.value.includes(groupId)) {
          sendSosToGroup(groupId)
          pendingSosGroups.value = pendingSosGroups.value.filter(g => g !== groupId)
        }
      } else if (message.data === "Unauthorized") {
        console.error("[WS] WebSocket unauthorized")
        closeTrackingWebSocket(groupId)
        router.push({ name: 'login' })
          .then(() => console.warn("Redirected to login caused 'unauthorized'"))
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
    console.debug(`[WS] All websockets: `, trackingWebsockets)
  }

  function openChatWebSocket(groupId) {
    if (chatWebsockets[groupId]) return
    const userData = getLoggedInUser()
    console.debug(`[WS] Opening WebSocket for group ${groupId}`)
    console.debug(`[WS] Already present websockets:`, chatWebsockets)
    const ws = new WebSocket(
      `ws://localhost:3000/ws/chat/${groupId}/${userData.id}`
    )

    ws.onopen = async () => {
      console.debug(`[WS] WebSocket connected for group ${groupId}`)
      console.debug("[WS] Authenticating WebSocket")
      ws.send(JSON.stringify({ Authorization: `Bearer ${getToken()}` }))
    }

    ws.onclose = () => {
      console.debug(`[WS] WebSocket disconnected for group ${groupId}`)
      if (chatWebsockets[groupId]) {
        closeTrackingWebSocket(groupId)
      }
    }

    ws.onmessage = (message) => {
      console.debug(`[WS] WebSocket message for group ${groupId}:`, message.data)
      if (message.data === "OK") {
        console.debug("[WS] WebSocket authorized")
        chatWebsockets[groupId] = { connection: ws, isConnected: true }
      } else if (message.data === "Unauthorized") {
        console.error("[WS] WebSocket unauthorized")
        closeChatWebSocket(groupId)
        router.push({ name: 'login' })
          .then(() => console.warn("Redirected to login caused 'unauthorized'"))
      } else {
        message.data.text().then(text => handleChatMessage(JSON.parse(text)));
      }
    }
    ws.onerror = (error) => console.error(`WebSocket for (${groupId}, ${userData.id}):`, error)
    console.debug(`[WS] All websockets: `, chatWebsockets)
  }

  function handleChatMessage(data) {
    const [type, msg] = data;
    console.log(type);
    if(type === "Information") {
      chatStore.addInformationMessage(msg);
    } else {
      chatStore.addUserMessage(msg);
    }
  }

  function handleMessage(data, groupId) {
    console.debug("[WS] Received message:", data)
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

  function closeTrackingWebSocket(groupId) {
    if (chatWebsockets[groupId]) {
      chatWebsockets[groupId].connection.close()
      delete chatWebsockets[groupId]
    }
  }

  function closeChatWebSocket(groupId) {
    if (trackingWebsockets[groupId]) {
      trackingWebsockets[groupId].connection.close()
      delete trackingWebsockets[groupId]
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
      if (!trackingWebsockets[groupId]) {
        openTrackingWebSocket(groupId)
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
    if (!trackingWebsockets[groupId]) {
      openTrackingWebSocket(groupId)
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
    sosActive.value = false
    pendingSosGroups.value = []
    Object.keys(trackingWebsockets).forEach(closeTrackingWebSocket)
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
    sosActive,
    broadcastSOS,
    stopSOS,
    fetchUserGroups,
    getGroupInformation,
    addGroupMessageListener,
    toggleGroupTracking,
    sendChatMessage,
    cleanup
  }
})
