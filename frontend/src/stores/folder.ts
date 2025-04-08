import { defineStore } from 'pinia'
import { ref } from 'vue'
import { folderService } from '../services/folder.service'
import { useUserStore } from './user'

interface Folder {
  id: string
  name: string
  children?: Folder[]
  parentId?: string | null
}

export const useFolderStore = defineStore('folder', () => {
  const folders = ref<Folder[]>([])
  const searchQuery = ref<string>('')
  const searchResults = ref<Folder[]>([])
  const currentFolder = ref<Folder | undefined>()
  const expandedFolders = ref<Set<string>>(new Set())
  const isLoading = ref(false)
  const isSearching = ref(false)
  const error = ref<string | null>(null)

  const userStore = useUserStore()

  // Actions
  async function searchFolders(query: string) {
    searchQuery.value = query
    if (!query.trim() || !userStore.isAuthenticated) {
      searchResults.value = []
      return
    }

    isSearching.value = true
    error.value = null

    try {
      const results = await folderService.searchFolders(query)
      searchResults.value = results
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to search folders'
      console.error('Error searching folders:', err)
    } finally {
      isSearching.value = false
    }
  }

  async function fetchFolders() {
    if (!userStore.isAuthenticated) return

    isLoading.value = true
    error.value = null

    try {
      const data = await folderService.getAllFolders()
      folders.value = data
      selectRootFolder()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch folders'
      console.error('Error fetching folders:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchSubfolders(folderId: string) {
    error.value = null

    try {
      const data = await folderService.getSubfolders(folderId)
      // Find the folder with recursive search
      const findFolder = (folders: Folder[]): Folder | null => {
        for (const folder of folders) {
          if (folder.id === folderId) {
            return folder
          }
          if (folder.children) {
            const found = findFolder(folder.children)
            if (found) {
              return found
            }
          }
        }
        return null
      }
      const folder = findFolder(folders.value)
      if (folder) {
        folder.children = data
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch subfolders'
      console.error('Error fetching subfolders:', err)
    }
  }

  function selectRootFolder() {
    currentFolder.value = {
      id: 'root',
      name: 'Root',
      children: folders.value,
      parentId: null,
    }
  }

  function selectFolder(folder: Folder) {
    currentFolder.value = folder
    searchQuery.value = '' // Clear search query when selecting a folder
    searchResults.value = [] // Clear search results when selecting a folder

    // Fetch subfolders if the folder is not already expanded
    if (!expandedFolders.value.has(folder.id) && folder.id !== 'root') {
      expandedFolders.value.add(folder.id)
      fetchSubfolders(folder.id)
    }
  }

  function toggleFolder(folderId: string) {
    if (expandedFolders.value.has(folderId)) {
      expandedFolders.value.delete(folderId)
    } else {
      expandedFolders.value.add(folderId)
    }
  }

  async function createFolder(name: string) {
    error.value = null

    try {
      const parentId = currentFolder.value?.id !== 'root' ? currentFolder.value?.id : undefined
      const newFolder = await folderService.createFolder(name, parentId)

      console.log('New folder created:', newFolder)
      console.log('Current folder:', currentFolder.value)
      if (currentFolder.value) {
        if (!currentFolder.value.children) {
          currentFolder.value.children = []
        }
        currentFolder.value.children.push(newFolder)

        // update folders value children use recursive search
        const findFolder = (folders: Folder[]): Folder | null => {
          for (const folder of folders) {
            if (folder.id === currentFolder.value?.id) {
              return folder
            }
            if (folder.children) {
              const found = findFolder(folder.children)
              if (found) {
                return found
              }
            }
          }
          return null
        }
        const folder = findFolder(folders.value)
        if (folder) {
          if (!folder.children) {
            folder.children = []
          }
          if (folder.children.findIndex((v) => v.id === newFolder.id) === -1) {
            folder.children.push(newFolder)
          }
        }
      } else {
        folders.value.push(newFolder)
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create folder'
      console.error('Error creating folder:', err)
      alert(error.value)
      throw err
    }
  }

  async function deleteFolder(folderId: string) {
    error.value = null

    try {
      await folderService.deleteFolder(folderId)

      // Update local state after successful API call
      const removeFromParent = (parentFolders: Folder[], id: string): boolean => {
        const index = parentFolders.findIndex((f) => f.id === id)
        if (index !== -1) {
          parentFolders.splice(index, 1)
          return true
        }

        for (const folder of parentFolders) {
          if (folder.children && removeFromParent(folder.children, id)) {
            return true
          }
        }
        return false
      }

      const findParentFolder = (parentFolders: Folder[], id: string): Folder | null => {
        for (const folder of parentFolders) {
          if (folder.children) {
            if (folder.children.some((child) => child.id === id)) {
              return folder
            }
            const found = findParentFolder(folder.children, id)
            if (found) {
              return found
            }
          }
        }
        return null
      }

      const parentFolder = findParentFolder(folders.value, folderId)
      removeFromParent(folders.value, folderId)

      // Update current folder if needed
      if (currentFolder.value?.id === folderId) {
        if (parentFolder) {
          currentFolder.value = parentFolder || undefined
        } else {
          selectRootFolder()
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete folder'
      console.error('Error deleting folder:', err)
      throw err
    }
  }

  return {
    // State
    folders,
    searchQuery,
    searchResults,
    currentFolder,
    expandedFolders,
    isLoading,
    isSearching,
    error,

    // Actions
    searchFolders,
    fetchFolders,
    selectFolder,
    toggleFolder,
    createFolder,
    deleteFolder,
    selectRootFolder,
  }
})
