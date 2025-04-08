<script setup lang="ts">
import { ref, watch } from 'vue'
import FolderItem from './FolderItem.vue'
import { useFolderStore } from '../stores/folder'

const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(
  func: F,
  waitFor: number,
) => {
  let timeout: NodeJS.Timeout

  const debounced = (...args: Parameters<F>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), waitFor)
  }

  return debounced
}

interface Folder {
  id: string
  name: string
  children?: Folder[]
  parentId?: string | null
}

interface Props {
  folders: Folder[]
}

defineProps<Props>()
const store = useFolderStore()
const searchQuery = ref('')

const debouncedSearch = debounce((query: string) => {
  store.searchFolders(query)
}, 300)

watch(searchQuery, (newQuery) => {
  if (newQuery) {
    debouncedSearch(newQuery)
  } else {
    store.searchQuery = ''
    store.searchResults = []
  }
})
</script>

<template>
  <aside class="sidebar">
    <div class="search-box">
      <input v-model="searchQuery" type="text" placeholder="Search folders..." :disabled="store.isLoading" />
      <div v-if="store.isSearching" class="search-loading">Searching...</div>
    </div>

    <div class="folder-container" v-if="store.searchResults.length > 0 || store.searchQuery">
      <div class="search-results-header">Search Results</div>
      <FolderItem v-for="folder in store.searchResults" :key="folder.id" :folder="folder" :level="0"
        :expanded-folders="store.expandedFolders" @select="store.selectFolder" @toggle="store.toggleFolder" />

      <div v-if="store.searchResults.length === 0 && store.searchQuery" class="search-loading">
        No results found for "{{ store.searchQuery }}"
      </div>
    </div>

    <div class="folder-container" v-else-if="!store.searchQuery">
      <div class="folder-item">
        <span class="folder-name" @click="store.selectRootFolder()"> # Root </span>
      </div>

      <FolderItem v-for="folder in folders" :key="folder.id" :folder="folder" :level="0"
        :expanded-folders="store.expandedFolders" @select="store.selectFolder" @toggle="store.toggleFolder" />
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 250px;
  height: 100%;
  background-color: #f0f0f0;
  border-right: 1px solid #ddd;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.search-box {
  padding: 1rem;
  border-bottom: 1px solid #ddd;
  background-color: #fff;
}

.search-box input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
}

.search-box input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.search-loading {
  font-size: 0.75rem;
  color: #666;
  margin-top: 0.5rem;
}

.search-results-header {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: #666;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
}

.folder-container {
  padding: 1rem;
  flex: 1;
}

.folder-item {
  padding: 0.5rem;
  cursor: pointer;
}

.folder-item:hover {
  background-color: #e0e0e0;
}

.folder-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
