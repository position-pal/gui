import axios from "axios";
import router from '@/router/index.js'
import { BACKEND_ENDPOINT } from '@/config.js'

export function axiosSetup() {
  /* Intercepts the axios request and add Authorization header if user logged int */
  axios.interceptors.request.use(
    (config) => {
      config.headers["Content-Type"] = "application/json";
      const token = sessionStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      config.url = `${BACKEND_ENDPOINT}/${config.url}`
      console.log(config)
      return config
    },
    (error) => Promise.reject(error)
  )
  /* Intercepts the axios response and refresh access token if expired. */
  axios.interceptors.response.use(
    (response) => response,
    async function (error) {
      console.error(error);
      if (error.response.data.code === 401) {
        await sessionStorage.removeItem("authToken");
        return router.push({ name: "Login" });
      } else {
        return Promise.reject(error);
      }
    }
  )
}
