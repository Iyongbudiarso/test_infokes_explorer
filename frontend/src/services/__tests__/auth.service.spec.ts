import { describe, it, expect, vi } from 'vitest'
import { authService } from '../auth.service'
import api from '../../utils/axios'

vi.mock('../../utils/axios')

describe('AuthService', () => {
  describe('login', () => {
    it('should return user data and token on successful login', async () => {
      const mockCredentials = { email: 'test@example.com', password: 'password123' }
      const mockResponse = {
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
        },
        token: 'mockToken123',
      }

      vi.mocked(api.post).mockResolvedValueOnce({ data: mockResponse })

      const result = await authService.login(mockCredentials)

      expect(api.post).toHaveBeenCalledWith('/users/login', mockCredentials)
      expect(result).toEqual(mockResponse)
    })

    it('should throw an error with a specific message if the server responds with an error message', async () => {
      const mockCredentials = { email: 'test@example.com', password: 'wrongpassword' }
      const mockError = {
        response: {
          data: {
            message: 'Invalid credentials',
          },
        },
      }

      vi.mocked(api.post).mockRejectedValueOnce(mockError)

      await expect(authService.login(mockCredentials)).rejects.toThrow('Invalid credentials')
    })

    it('should throw a generic error if no specific error message is provided', async () => {
      const mockCredentials = { email: 'test@example.com', password: 'password123' }
      const mockError = {}

      vi.mocked(api.post).mockRejectedValueOnce(mockError)

      await expect(authService.login(mockCredentials)).rejects.toThrow(
        'Login failed. Please try again.',
      )
    })
  })
})
