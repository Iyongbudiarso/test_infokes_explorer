import api from '../utils/axios'

interface Folder {
  id: string
  name: string
  children?: Folder[]
  parentId?: string | null
}

class FolderService {
  async searchFolders(query: string): Promise<Folder[]> {
    try {
      const response = await api.get<Folder[]>(`/folders/search?q=${encodeURIComponent(query)}`)
      return response.data
    } catch (error: any) {
      if (error?.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      throw new Error('Failed to search folders')
    }
  }

  async getAllFolders(): Promise<Folder[]> {
    try {
      const response = await api.get<Folder[]>('/folders')
      return response.data
    } catch (error: any) {
      if (error?.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      throw new Error('Failed to fetch folders')
    }
  }

  async createFolder(name: string, parentId?: string): Promise<Folder> {
    try {
      const response = await api.post<Folder>('/folders', {
        name,
        parentId
      })
      return response.data
    } catch (error: any) {
      if (error?.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      throw new Error('Failed to create folder')
    }
  }

  async deleteFolder(id: string): Promise<void> {
    try {
      await api.delete(`/folders/${id}`)
    } catch (error: any) {
      if (error?.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      throw new Error('Failed to delete folder')
    }
  }

  async getSubfolders(id: string): Promise<Folder[]> {
    try {
      const response = await api.get<Folder[]>(`/folders/${id}/children`)
      return response.data
    } catch (error: any) {
      if (error?.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      throw new Error('Failed to fetch subfolders')
    }
  }
}

export const folderService = new FolderService()
