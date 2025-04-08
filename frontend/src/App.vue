<script setup lang="ts">
import { computed, watch } from 'vue'
import { useFolderStore } from './stores/folder'
import { useUserStore } from './stores/user'
import HeaderUser from './components/HeaderUser.vue'
import LeftSidebar from './components/LeftSidebar.vue'
import FolderContent from './components/FolderContent.vue'

const store = useFolderStore()
const userStore = useUserStore()

// Watch authentication state to fetch folders
watch(
  () => userStore.isAuthenticated,
  async (isAuthenticated) => {
    if (isAuthenticated) {
      await store.fetchFolders()
    } else {
      // Clear folders when logged out
      store.folders = []
      store.currentFolder = undefined
    }
  },
  { immediate: true },
)

const currentContents = computed(() => store.currentFolder?.children || [])
</script>

<template>
  <div class="app-container">
    <HeaderUser />
    <div class="app-folder" :class="{ 'app-folder--blur': !userStore.isAuthenticated }">
      <template v-if="store.isLoading">
        <div class="loading-overlay">Loading folders...</div>
      </template>
      <LeftSidebar :folders="store.folders" @select-folder="store.selectFolder" />
      <FolderContent
        :current-folder="store.currentFolder"
        :contents="currentContents"
        @create-folder="store.createFolder"
        @delete-folder="store.deleteFolder"
      />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  max-height: 100%;
}

.app-folder {
  display: flex;
  flex: 1;
  width: 100%;
  overflow: hidden;
  position: relative;
}

.app-folder--blur {
  filter: blur(4px);
  user-select: none;
  pointer-events: none;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  font-size: 1.2rem;
  color: #1a73e8;
}
</style>
