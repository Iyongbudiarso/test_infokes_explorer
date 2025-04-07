import { Elysia, t } from 'elysia'
import { auth } from '../middlewares/auth.middleware'
import {
  getFoldersUser,
  createFolder,
  updateFolder,
  deleteFolder,
  getFolderById,
  getFoldersByParentId,
  getFoldersByUserIdAndSearchName,
} from '../controllers/folder.controller'

export const folderRoutes = new Elysia({ prefix: '/api/v1/folders' })
  .use(auth)
  .get('/', getFoldersUser)
  .post('/', createFolder)
  .put('/:id', updateFolder)
  .delete('/:id', deleteFolder)
  .get('/:id', getFolderById)
  .get('/:id/children', getFoldersByParentId)
  .get('/search', getFoldersByUserIdAndSearchName)
