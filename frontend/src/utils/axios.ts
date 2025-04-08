import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add interceptor for authentication
api.interceptors.request.use((config) => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    const user = JSON.parse(userStr)
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
  }
  return config
})

export default api
