import { describe, it, expect } from 'bun:test'
import { userRoutes } from '@/interfaces/http/routes/user.routes'

describe('POST /login', () => {
  it('should have the correct routes', () => {
    const routes = userRoutes.routes
    expect(routes).toHaveLength(1)
    expect(routes[0].method).toBe('POST')
    expect(routes[0].path).toBe('/api/v1/users/login')
  })
})
