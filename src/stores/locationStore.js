import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import * as turf from '@turf/turf'

export const useLocationStore = defineStore('location', () => {
  const currentPosition = ref(null)
  const watchId = ref(null)
  const error = ref(null)
  const isTracking = ref(false)

  const hasLocation = computed(() => !!currentPosition.value)

  const updatePosition = (position) => {
    currentPosition.value = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      timestamp: position.timestamp
    }
  }

  const handleError = (err) => {
    error.value = err.message
    isTracking.value = false
  }

  const startTracking = async () => {
    if (!navigator.geolocation) {
      error.value = "Geolocation is not supported by your browser"
      return
    }
    isTracking.value = true
    watchId.value = navigator.geolocation.watchPosition(
      updatePosition,
      handleError,
      {
        enableHighAccuracy: true,
        timeout: 5000, // 5 seconds timeout for the request to complete successfully before it is considered an error
        distanceFilter: 1 // Update only if the position changes by 1 meter
      }
    )
  }

  const stopTracking = () => {
    if (watchId.value) {
      navigator.geolocation.clearWatch(watchId.value)
      watchId.value = null
    }
    isTracking.value = false
  }

  const calculateDistance = (targetCoords) => {
    if (!currentPosition.value || !targetCoords.longitude || !targetCoords.latitude) return null
    const from = turf.point([
      currentPosition.value.longitude,
      currentPosition.value.latitude
    ])
    const to = turf.point([
      targetCoords.longitude,
      targetCoords.latitude
    ])
    return turf.distance(from, to, { units: 'kilometers' })
  }

  return {
    currentPosition,
    error,
    isTracking,
    hasLocation,
    startTracking,
    stopTracking,
    calculateDistance
  }
})
