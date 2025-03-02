const MAPBOX_ACCESS_TOKEN = '';

/**
 * Fetch coordinates from an address query using Mapbox Geocoding API
 * @param {string} query - The address to search for
 * @param {Object} options - Additional options for the request
 * @returns {Promise<Array>} - Array of matching locations with coordinates
 */
export const fetchCoordinates = async (query, options = {}) => {
  try {
    const {
      limit = 5,
      language = 'en',
      country = '',
      types = '',
    } = options;
    const params = new URLSearchParams({
      access_token: MAPBOX_ACCESS_TOKEN,
      limit,
      language
    });
    // Add optional filters if provided
    if (country) params.append('country', country);
    if (types) params.append('types', types);
    // Mapbox Geocoding API endpoint
    const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?${params.toString()}`;
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Geocoding error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.features || [];
  } catch (error) {
    console.error('Failed to fetch coordinates:', error);
    return [];
  }
};

/**
 * Get address from coordinates using Mapbox Reverse Geocoding API
 * @param {number} latitude - The latitude coordinate
 * @param {number} longitude - The longitude coordinate
 * @param {Object} options - Additional options for the request
 * @returns {Promise<Object>} - Location data for the coordinates
 */
export const getAddressFromCoordinates = async (latitude, longitude, options = {}) => {
  try {
    const {
      language = 'en',
      types = 'address,place,neighborhood,locality',
    } = options;
    // Build query parameters
    const params = new URLSearchParams({
      access_token: MAPBOX_ACCESS_TOKEN,
      language,
      types
    });
    // Mapbox Reverse Geocoding API endpoint
    const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?${params.toString()}`;
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Reverse geocoding error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    // Return the most relevant result, or null if no results
    return data.features && data.features.length > 0 ? data.features[0] : null;
  } catch (error) {
    console.error('Failed to fetch address from coordinates:', error);
    return null;
  }
};

/**
 * Format a Mapbox feature to a standardized address object
 * @param {Object} feature - Mapbox feature object
 * @returns {Object} - Standardized address object
 */
export const formatMapboxResult = (feature) => {
  if (!feature) return null;
  return {
    display_name: feature.place_name,
    lon: feature.center[0],
    lat: feature.center[1],
    place_type: feature.place_type,
    properties: feature.properties,
    address_components: feature.context || []
  };
};
