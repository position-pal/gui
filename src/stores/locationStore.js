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
  const retryCount = ref(0)
  const maxRetries = ref(10)
  const retryTimeout = ref(null)
  // Store the last used options so we can reuse them when retrying
  const lastOptions = ref(null);

  const DEFAULT_UPDATE_INTERVAL = 10_000 // 10 secs
  const MIN_UPDATE_INTERVAL = 1_000 // 1 sec
  const DEFAULT_DISTANCE_FILTER = 1 // 1 meter
  const RETRY_DELAY = 4_000 // 4 secs

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
    retryCount.value = 0
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
    const isLocationUnknownError =
      err.code === 2 || // Standard JS Geolocation error code for POSITION_UNAVAILABLE
      err.message.includes('kCLErrorLocationUnknown') || // macOS specific error message
      err.message.includes('location unknown'); // Generic check
    if (isLocationUnknownError && retryCount.value < maxRetries.value) {
      console.warn(`[Location] Temporary location error (${err.message}). Retrying... (${retryCount.value + 1}/${maxRetries.value})`);
      retryCount.value++;
      if (retryTimeout.value) {
        clearTimeout(retryTimeout.value);
      }
      retryTimeout.value = setTimeout(() => {
        if (isTracking.value) {
          stopTracking(false); // Don't reset isTracking flag
          startTracking(lastOptions.value);
        }
      }, RETRY_DELAY);
      error.value = `Your location could not be determined. Retrying... (${retryCount.value}/${maxRetries.value})`;
    } else {
      // For other errors or if we've exhausted retries
      console.error(`[Location] Error: ${err.message}`);
      error.value = err.message;
      isTracking.value = false;
    }
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
    lastOptions.value = {
      updateInterval: options.updateInterval || DEFAULT_UPDATE_INTERVAL,
      distanceFilter: options.distanceFilter || DEFAULT_DISTANCE_FILTER,
      enableHighAccuracy: options.enableHighAccuracy !== undefined ? options.enableHighAccuracy : true,
      timeout: options.timeout || 10_000
    };
    console.log("[Location] Start tracking with options: ", lastOptions.value)
    isTracking.value = true;
    watchId.value = navigator.geolocation.watchPosition(
      updatePosition,
      handleError,
      {
        enableHighAccuracy: lastOptions.value.enableHighAccuracy,
        timeout: lastOptions.value.timeout,
        distanceFilter: lastOptions.value.distanceFilter
      }
    )
    startUpdateInterval(lastOptions.value.updateInterval)
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

  const stopTracking = (resetTrackingState = true) => {
    if (watchId.value) {
      navigator.geolocation.clearWatch(watchId.value)
      watchId.value = null
    }
    if (updateInterval.value) {
      clearInterval(updateInterval.value)
      updateInterval.value = null
    }
    if (retryTimeout.value) {
      clearTimeout(retryTimeout.value)
      retryTimeout.value = null
    }
    if (resetTrackingState) {
      isTracking.value = false
      retryCount.value = 0
    }
  }

  const calculateDistance = (targetCoords) => {
    if (!currentPosition.value || !targetCoords.longitude || !targetCoords.latitude) {
      console.error("[Location] Cannot calculate distance, missing data")
      return null
    }
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
