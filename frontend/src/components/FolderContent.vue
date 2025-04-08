<script setup lang="ts">
import { ref } from 'vue'
import { useFolderStore } from '../stores/folder'
import NewFolderModal from './modal/NewFolderModal.vue'
import ConfirmationModal from './modal/ConfirmationModal.vue'

interface Folder {
  id: string
  name: string
  children?: Folder[]
  parentId?: string | null
}

interface Props {
  currentFolder?: Folder
  contents: Folder[]
}

defineProps<Props>()
const store = useFolderStore()

const showNewFolderModal = ref(false)
const showDeleteModal = ref(false)

const handleCreateFolder = (name: string) => {
  store.createFolder(name)
  showNewFolderModal.value = false
}

const handleDeleteConfirm = () => {
  if (store.currentFolder) {
    store.deleteFolder(store.currentFolder.id)
  }
  showDeleteModal.value = false
}
</script>

<template>
  <div class="folder-content">
    <div class="folder-header">
      <h2 class="folder-title">{{ currentFolder?.name || 'Root' }}</h2>
      <div class="header-actions">
        <button
          v-if="currentFolder && currentFolder.id !== 'root'"
          class="delete-btn"
          @click="showDeleteModal = true"
        >
          <i class="folder-icon">🗑️</i> Delete Folder
        </button>
        <button class="new-folder-btn" @click="showNewFolderModal = true">
          <i class="folder-icon">📁</i> New Folder
        </button>
      </div>
    </div>
    <NewFolderModal
      v-if="showNewFolderModal"
      @create="handleCreateFolder"
      @close="showNewFolderModal = false"
    />
    <ConfirmationModal
      v-if="showDeleteModal"
      title="Delete Folder"
      :message="`Are you sure you want to delete '${currentFolder?.name}'? This action cannot be undone.`"
      @confirm="handleDeleteConfirm"
      @cancel="showDeleteModal = false"
    />
    <div class="content-list">
      <div
        v-for="item in contents"
        :key="item.id"
        class="content-item"
        @click="store.selectFolder(item)"
      >
        <span class="item-name">
          <i class="folder-icon">📁</i>
          {{ item.name }}
        </span>
      </div>
      <div v-if="contents.length === 0" class="empty-state">This folder is empty</div>
    </div>
  </div>
</template>

<style scoped>
.folder-content {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: white;
}

.folder-header {
  padding: 1rem;
  border-bottom: 1px solid #ddd;
  background-color: #f8f8f8;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.delete-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 8px 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.delete-btn:hover {
  background-color: #c82333;
}

.new-folder-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 8px 16px;
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.new-folder-btn:hover {
  background-color: #1557b0;
}

.folder-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 500;
}

.content-list {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

.content-item {
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 4px;
}

.content-item:hover {
  background-color: #f5f5f5;
}

.item-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.folder-icon {
  font-style: normal;
}

.empty-state {
  text-align: center;
  color: #666;
  padding: 2rem;
}
</style>
