import { describe, it, expect } from 'bun:test'
import { folderRoutes } from '@/interfaces/http/routes/folder.routes'

describe('check folder routes', () => {
  it('should have the correct routes', () => {
    const routes = folderRoutes.routes
    expect(routes).toHaveLength(7)
    expect(routes[0].method).toBe('GET')
    expect(routes[0].path).toBe('/api/v1/folders/')
    expect(routes[1].method).toBe('POST')
    expect(routes[1].path).toBe('/api/v1/folders/')
    expect(routes[2].method).toBe('PUT')
    expect(routes[2].path).toBe('/api/v1/folders/:id')
    expect(routes[3].method).toBe('DELETE')
    expect(routes[3].path).toBe('/api/v1/folders/:id')
    expect(routes[4].method).toBe('GET')
    expect(routes[4].path).toBe('/api/v1/folders/:id')
    expect(routes[5].method).toBe('GET')
    expect(routes[5].path).toBe('/api/v1/folders/:id/children')
    expect(routes[6].method).toBe('GET')
    expect(routes[6].path).toBe('/api/v1/folders/search')
  })
})

describe('check auth middleware is use on folder routes', () => {
  it('should have auth hook transform derive middleware on routes', () => {
    const routes = folderRoutes.routes
    routes.forEach((route) => {
      try {
        route.hooks.transform[0].fn({ request: { headers: { get: () => { } } } })
      } catch (error) {
        expect((error as Error).message).toBe('Unauthorized - No token provided')
      }
    })
  })
})
