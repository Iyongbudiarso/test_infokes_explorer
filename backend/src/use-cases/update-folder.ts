// update folder.ts
import { FolderRepository } from '../domain/repositories/folder.repository'
import { Folder } from '../domain/entities/folder'

export class UpdateFolder {
  constructor(
    private folderRepo: FolderRepository
  ) { }

  async execute(id: number, name: string, userId: number): Promise<Folder | null> {
    // get parent folder id
    const findFolder = await this.folderRepo.findById(id)
    if (!findFolder) {
      throw new Error('Folder not found')
    }
    const parentFolderId = findFolder.parentId
    // Validate folder name
    const isExistFolder = await this.folderRepo.existFolderName(name, userId, parentFolderId ?? undefined)
    if (isExistFolder) {
      throw new Error('Folder name already exists in this directory')
    }
    const folder = await this.folderRepo.update(id, name)
    return folder
  }
}
