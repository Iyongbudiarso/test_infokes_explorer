import { PrismaFolderRepository } from '@/infrastructure/db/folder.repo'
import { GetFoldersUser } from '@/use-cases/get-folders-user'
import { CreateFolder } from '@/use-cases/create-folder'
import { UpdateFolder } from '@/use-cases/update-folder'
import { DeleteFolder } from '@/use-cases/delete-folder'
import { GetFoldersChildren } from '@/use-cases/get-folders-children'
import { SearchFolderName } from '@/use-cases/search-folder-name'

const repo = new PrismaFolderRepository()

export const getFoldersUser = async ({ user }: { user: { id: string } }) => {
  const userId = parseInt(user.id)
  const useCase = new GetFoldersUser(repo)
  return await useCase.execute(userId)
}

export const createFolder = async ({ body, user }: { body: { name: string, parentId: number }, user: { id: string } }) => {
  const userId = parseInt(user.id)
  const useCase = new CreateFolder(repo)
  return await useCase.execute(body.name, userId, body.parentId)
}

export const updateFolder = async ({ body, params, user }: { body: { name: string }, params: { id: string }, user: { id: string } }) => {
  // check if folder user is the owner
  const userId = parseInt(user.id)
  const folder = await repo.findById(parseInt(params.id))
  if (!folder || folder.userId !== parseInt(user.id)) {
    throw new Error('Folder not found or you are not the owner')
  }
  const useCase = new UpdateFolder(repo)
  return await useCase.execute(parseInt(params.id), body.name, userId)
}

export const deleteFolder = async ({ params, user }: { params: { id: string }, user: { id: string } }) => {
  // check if folder user is the owner
  const userId = parseInt(user.id)
  const folder = await repo.findById(parseInt(params.id))
  if (!folder || folder.userId !== userId) {
    throw new Error('Folder not found or you are not the owner')
  }
  const useCase = new DeleteFolder(repo)
  await useCase.execute(parseInt(params.id))
  return { message: 'Folder deleted successfully' }
}

export const getFolderById = async ({ params, user }: { params: { id: string }, user: { id: string } }) => {
  const userId = parseInt(user.id)
  const folder = await repo.findById(parseInt(params.id))
  if (!folder || folder.userId !== userId) {
    throw new Error('Folder not found or you are not the owner')
  }
  return folder
}

export const getFoldersByParentId = async ({ params, user }: { params: { id: string }, user: { id: string } }) => {
  const userId = parseInt(user.id)
  const folder = await repo.findById(parseInt(params.id))
  if (!folder || folder.userId !== userId) {
    throw new Error('Folder not found or you are not the owner')
  }
  const useCase = new GetFoldersChildren(repo)
  return await useCase.execute(parseInt(params.id))
}

export const getFoldersByUserIdAndSearchName = async ({ query, user }: { query: { q: string }, user: { id: string } }) => {
  const userId = parseInt(user.id)
  const useCase = new SearchFolderName(repo)
  return await useCase.execute(userId, query.q)
}
