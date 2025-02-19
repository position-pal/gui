import axios from "axios";
import router from '@/router/index.js'
import { BACKEND_ENDPOINT } from '@/config.js'

export function axiosSetup() {
  /* Intercepts the axios request and add Authorization header if user logged int */
  axios.interceptors.request.use(
    (config) => {
      config.headers["Content-Type"] = "application/json";
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJpby5naXRodWIucG9zaXRpb25wYWwiLCJhdWQiOiJwb3NpdGlvbnBhbC5pbyIsImVtYWlsIjoibWFyaW8ucm9zc2lAZ21haWwuY29tIiwiZXhwIjoxNzM5OTc5NDM2fQ.1AnJReimEx7G3ggXmSw5Kd9Xfnu972XggHyFsLiCAbc"
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
      console.error(error)
      if (error.response.data.code === 401) {
        await sessionStorage.removeItem("authToken");
        await router.push({ name: "Login" });
      }
      return Promise.reject(error);
    }
  )
}
