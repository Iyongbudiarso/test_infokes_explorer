import { Folder } from '@/domain/entities/folder'
import { FolderRepository } from '@/domain/repositories/folder.repository'

export class GetFoldersUser {
  constructor(
    private folderRepo: FolderRepository
  ) { }

  async execute(userId: number): Promise<Folder[]> {
    const folders = await this.folderRepo.findAllByUserId(userId)
    return folders
  }
}
