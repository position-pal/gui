import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import * as turf from '@turf/turf'
import { isTestUser } from '@/scripts/user.js'
import { getMockedPosition } from '@/scripts/mocked-location.js'

export const useLocationStore = defineStore('location', () => {
  const currentPosition = ref(null)
  const watchId = ref(null)
  const isTracking = ref(false)
  const updateInterval = ref(null)
  const listeners = ref([])
  const error = ref(null)

  const DEFAULT_UPDATE_INTERVAL = 10_000 // 10 secs
  const MIN_UPDATE_INTERVAL = 1_000 // 1 sec
  const DEFAULT_DISTANCE_FILTER = 0 // 1 meter

  const hasLocation = computed(() => !!currentPosition.value)

  const updatePosition = (position) => {
    console.debug("[Location] Updating position to: ", position)
    const newPosition = {
      coordinates: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      timestamp: new Date().toISOString()
    }
    currentPosition.value = newPosition
    notifyListeners(newPosition)
  }

  const notifyListeners = (position) => {
    listeners.value.forEach(listener => {
      try {
        /*
         * Just for the sake of testing and demoing the app, we add a random offset to the
         * position of the test user. This way, we can simulate the movement of the test user
         * on the map without actually moving. This is not a real-world use case and should
         * be removed in a production app, it's simply the easiest way! Hurrah for the test user!
         */
        if (isTestUser()) {
          listener(getMockedPosition())
        } else {
          listener(position)
        }
      } catch (err) {
        console.error('Error notifying listener:', err)
      }
    })
  }

  const addLocationListener = (callback) => {
    listeners.value.push(callback)
    if (currentPosition.value) {
      callback(currentPosition.value)
    }
    // cleanup function
    return () => {
      const index = listeners.value.indexOf(callback)
      if (index > -1) {
        listeners.value.splice(index, 1)
      }
    }
  }

  const handleError = (err) => {
    error.value = err.message
    isTracking.value = false
  }

  const startTracking = (options = {}) => {
    if (watchId.value) {
      console.log('[Location] Already tracking')
      return
    } else if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser")
      error.value = "Geolocation is not supported by your browser"
      return
    }
    const {
      updateInterval: intervalTime = DEFAULT_UPDATE_INTERVAL,
      distanceFilter = DEFAULT_DISTANCE_FILTER,
      enableHighAccuracy = true,
      timeout = 8_000
    } = options
    console.log("[Location] Start tracking with options: ", options)
    isTracking.value = true
    watchId.value = navigator.geolocation.watchPosition(
      updatePosition,
      handleError,
      {
        enableHighAccuracy,
        timeout,
        distanceFilter
      }
    )
    startUpdateInterval(intervalTime)
  }

  const startUpdateInterval = (interval = DEFAULT_UPDATE_INTERVAL) => {
    stopUpdateInterval()
    const safeInterval = Math.max(interval, MIN_UPDATE_INTERVAL)
    updateInterval.value = setInterval(() => {
      if (currentPosition.value) {
        notifyListeners(currentPosition.value)
      }
    }, safeInterval)
  }

  const stopUpdateInterval = () => {
    if (updateInterval.value) {
      clearInterval(updateInterval.value)
      updateInterval.value = null
    }
  }

  const stopTracking = () => {
    if (watchId.value) {
      navigator.geolocation.clearWatch(watchId.value)
      watchId.value = null
    }
    if (updateInterval.value) {
      clearInterval(updateInterval.value)
      updateInterval.value = null
    }
    isTracking.value = false
  }

  const calculateDistance = (targetCoords) => {
    if (!currentPosition.value || !targetCoords.longitude || !targetCoords.latitude) return null
    const from = turf.point(
      [
        currentPosition.value.coordinates.longitude,
        currentPosition.value.coordinates.latitude,
      ]
    )
    const to = turf.point(
      [
        targetCoords.longitude,
        targetCoords.latitude,
      ]
    )
    return turf.distance(from, to, { units: 'kilometers' })
  }

  return {
    currentPosition,
    error,
    isTracking,
    hasLocation,
    startTracking,
    stopTracking,
    calculateDistance,
    addLocationListener
  }
})
