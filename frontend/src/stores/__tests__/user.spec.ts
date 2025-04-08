import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { Mock } from 'vitest'

import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '../user'
import { authService } from '../../services/auth.service'

vi.mock('../../services/auth.service', () => ({
  authService: {
    login: vi.fn(),
  },
}))

describe('User Store', () => {
  const authServiceLogin = authService.login as Mock

  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should initialize with default values', () => {
    const store = useUserStore()
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
    expect(store.isLoading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('should load user from localStorage if available', () => {
    const mockUser = { email: 'test@example.com', token: '12345' }
    localStorage.setItem('user', JSON.stringify(mockUser))
    const store = useUserStore()
    expect(store.user).toEqual(mockUser)
    expect(store.isAuthenticated).toBe(true)
  })

  it('should login successfully and update user state', async () => {
    const store = useUserStore()
    authServiceLogin.mockResolvedValue({
      user: { email: 'test@example.com' },
      token: '12345',
    })

    await store.login('test@example.com', 'password123')

    expect(authServiceLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
    expect(store.user).toEqual({
      email: 'test@example.com',
      token: '12345',
    })
    expect(localStorage.getItem('user')).toEqual(
      JSON.stringify({
        email: 'test@example.com',
        token: '12345',
      }),
    )
    expect(store.isAuthenticated).toBe(true)
    expect(store.error).toBeNull()
  })

  it('should handle login failure and set error state', async () => {
    const store = useUserStore()
    const mockError = new Error('Invalid credentials')
    authServiceLogin.mockRejectedValue(mockError)

    await expect(store.login('test@example.com', 'wrongpassword')).rejects.toThrow(
      'Invalid credentials',
    )

    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
    expect(store.error).toBe('Invalid credentials')
  })

  it('should logout and clear user state', () => {
    const store = useUserStore()
    store.user = { email: 'test@example.com', token: '12345' }
    localStorage.setItem('user', JSON.stringify(store.user))

    store.logout()

    expect(store.user).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })
})
