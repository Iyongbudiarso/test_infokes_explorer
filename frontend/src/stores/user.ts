import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authService } from '../services/auth.service'

interface User {
  email: string
  token: string
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Load user from localStorage on init
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
    isAuthenticated.value = true
  }

  async function login(email: string, password: string) {
    isLoading.value = true
    error.value = null
    try {
      const response = await authService.login({ email, password })
      const dataUser = {
        email: response.user.email,
        token: response.token
      }
      user.value = dataUser
      isAuthenticated.value = true
      localStorage.setItem('user', JSON.stringify(dataUser))
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('user')
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout
  }
})
