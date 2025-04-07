import { Folder } from '../entities/folder'

export interface FolderRepository {
  findAllByUserId(userId: number): Promise<Folder[]>
  create(name: string, userId: number, parentId?: number): Promise<Folder>
  existFolderName(name: string, userId: number, parentId?: number): Promise<boolean>
  update(id: number, name: string): Promise<Folder | null>
  delete(id: number): Promise<void>
  findById(id: number): Promise<Folder | null>
  findAllByParentId(parentId: number): Promise<Folder[]>
  findAllByUserIdAndSearchName(userId: number, name: string): Promise<Folder[]>
}
