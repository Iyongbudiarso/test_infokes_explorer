<script setup lang="ts">
import { computed } from 'vue'

interface Folder {
  id: string
  name: string
  children?: Folder[]
  parentId?: string | null
}

interface Props {
  folder: Folder
  level: number
  expandedFolders: Set<string>
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'select', folder: Folder): void
  (e: 'toggle', folderId: string): void
}>()

const paddingLeft = computed(() => `${(props.level + 1) * 0.5}rem`)
const isExpanded = computed(() => props.expandedFolders.has(props.folder.id))
const hasChildren = computed(() => props.folder.children && props.folder.children.length > 0)
</script>

<template>
  <div class="folder-tree">
    <div class="folder-item" :style="{ paddingLeft }">
      <span class="folder-name" @click="emit('select', folder)">
        <i v-if="hasChildren" class="expand-icon" @click.stop="emit('toggle', folder.id)">
          {{ isExpanded ? '▼' : '▶' }}
        </i>
        <i v-else class="expand-icon-placeholder"></i>
        <i class="folder-icon">📁</i>
        {{ folder.name }}
      </span>
    </div>

    <template v-if="isExpanded && folder.children">
      <FolderItem v-for="child in folder.children" :key="child.id" :folder="child" :level="level + 1"
        :expanded-folders="expandedFolders" @select="emit('select', $event)" @toggle="emit('toggle', $event)" />
    </template>
  </div>
</template>

<style scoped>
.folder-tree {
  width: 100%;
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
  white-space: nowrap;
  text-overflow: ellipsis;
}

.folder-icon {
  font-style: normal;
}

.expand-icon {
  font-style: normal;
  cursor: pointer;
  font-size: 0.8rem;
  width: 1rem;
  display: inline-block;
}

.expand-icon-placeholder {
  width: 1rem;
  display: inline-block;
}
</style>
