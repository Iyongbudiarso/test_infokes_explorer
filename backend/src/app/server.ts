import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { cors } from '@elysiajs/cors'
import { userRoutes } from '@/interfaces/http/routes/user.routes'
import { folderRoutes } from '@/interfaces/http/routes/folder.routes'

export const app = new Elysia()
  .use(swagger())
  .use(cors())
  .use(userRoutes)
  .use(folderRoutes)
  .get('/', () => 'OK')
