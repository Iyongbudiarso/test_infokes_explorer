// delete folder
import { FolderRepository } from '../domain/repositories/folder.repository'

export class DeleteFolder {
  constructor(
    private folderRepo: FolderRepository
  ) { }

  async execute(id: number): Promise<void> {
    // Validate folder name
    const folder = await this.folderRepo.findById(id)
    if (!folder) {
      throw new Error('Folder not found')
    }
    await this.folderRepo.delete(id)
  }
}
