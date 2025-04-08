import axios from 'axios'
import api from '../utils/axios'

interface LoginResponse {
  user: {
    id: string
    name: string
    email: string
  }
  token: string
}

interface LoginCredentials {
  email: string
  password: string
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/users/login', credentials)
      return response.data
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      throw new Error('Login failed. Please try again.')
    }
  }
}

export const authService = new AuthService()
