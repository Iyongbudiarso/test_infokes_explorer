import { Folder } from '@/domain/entities/folder'
import { FolderRepository } from '@/domain/repositories/folder.repository'

export class CreateFolder {
  constructor(
    private folderRepo: FolderRepository
  ) { }

  async execute(name: string, userId: number, parentId?: number): Promise<Folder> {
    // Validate folder name
    const isExistFolder = await this.folderRepo.existFolderName(name, userId, parentId)
    if (isExistFolder) {
      throw new Error('Folder name already exists in this directory')
    }
    const folder = await this.folderRepo.create(name, userId, parentId)
    return folder
  }
}
