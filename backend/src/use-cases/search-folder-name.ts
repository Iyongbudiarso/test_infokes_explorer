// search folder name
import { FolderRepository } from '../domain/repositories/folder.repository'
import { Folder } from '../domain/entities/folder'

export class SearchFolderName {
  constructor(private folderRepository: FolderRepository) { }

  async execute(userId: number, name: string): Promise<Folder[]> {
    return await this.folderRepository.findAllByUserIdAndSearchName(userId, name)
  }
}
