export interface Folder {
  id: number
  name: string
  parentId: number | null
  createdAt: Date
  updatedAt: Date
  userId: number
}
