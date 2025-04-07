import { Elysia } from 'elysia'
import jwt from 'jsonwebtoken'

export const auth = new Elysia({ name: 'Service.Auth' })
  .derive({ as: 'scoped' }, ({ request }) => {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Unauthorized - No token provided')
    }

    const token = authHeader.split(' ')[1]
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: string }
      return {
        user: {
          id: decoded.id
        }
      }
    } catch {
      throw new Error('Unauthorized - Invalid token')
    }
  })
