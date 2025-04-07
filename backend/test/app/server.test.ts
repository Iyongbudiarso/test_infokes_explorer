import { describe, it, expect } from 'bun:test'
import { app } from '@/app/server'

describe('GET /', () => {
  it('should return OK', async () => {
    const response = await app.handle(
      new Request('http://localhost', { method: 'GET' })
    )

    expect(response.status).toBe(200)
    const text = await response.text()
    expect(text).toBe('OK')
  })

  it('should return 404 for non-existent route', async () => {
    const response = await app.handle(
      new Request('http://localhost/non-existent', { method: 'GET' })
    )

    expect(response.status).toBe(404)
    const text = await response.text()
    expect(text).toContain('NOT_FOUND')
  })

  it('check cors', async () => {
    const response = await app.handle(
      new Request('http://localhost', {
        method: 'OPTIONS',
        headers: {
          Origin: 'http://localhost',
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type',
        },
      })
    )
    expect(response.status).toBe(204)
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe(
      'http://localhost'
    )
    expect(response.headers.get('Access-Control-Allow-Methods')).toBe(
      'GET'
    )
    expect(response.headers.get('Access-Control-Allow-Headers')).toBe(
      'Content-Type'
    )
    expect(response.headers.get('Access-Control-Max-Age')).toBe('5')
  })
})

describe('GET /swagger', () => {
  it('should return Swagger UI', async () => {
    const response = await app.handle(
      new Request('http://localhost/swagger', { method: 'GET' })
    )

    expect(response.status).toBe(200)
    const text = await response.text()
    expect(text).toContain('<title>Elysia Documentation</title>')
  })
})
