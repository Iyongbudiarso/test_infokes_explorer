// get folders children
import { Folder } from '@/domain/entities/folder'
import { FolderRepository } from '@/domain/repositories/folder.repository'

export class GetFoldersChildren {
  constructor(
    private folderRepo: FolderRepository
  ) { }

  async execute(parentId: number): Promise<Folder[]> {
    const folders = await this.folderRepo.findAllByParentId(parentId)
    return folders
  }
}
