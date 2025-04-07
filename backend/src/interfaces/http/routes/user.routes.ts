import { Elysia } from 'elysia'
import {
  loginUser,
} from '../controllers/user.controller'

export const userRoutes = new Elysia({ prefix: '/api/v1/users' })
  .post('/login', loginUser)
