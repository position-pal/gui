/**
 * The endpoint of the backend server to communicate with. By default, `localhost:3000`.
 * @type {string}
 */
const BACKEND_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT || 'http://localhost:3000';

/**
 * The API key for Mapbox services.
 * @type {string}
 */
const MAPBOX_API_KEY = import.meta.env.VITE_MAPBOX_API_KEY;

export { BACKEND_ENDPOINT, MAPBOX_API_KEY };
