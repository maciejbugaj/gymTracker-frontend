import axios from 'axios'
import { useAuthStore } from '../stores/StoreAuth'
import { userManager } from '../auth/oidcConfig'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

client.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      userManager.signinRedirect()
    }
    return Promise.reject(error)
  }
)

export default client