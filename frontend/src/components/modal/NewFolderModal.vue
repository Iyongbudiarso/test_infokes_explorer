<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'create', name: string): void
  (e: 'close'): void
}>()

const folderName = ref('')

const handleSubmit = () => {
  if (folderName.value.trim()) {
    emit('create', folderName.value.trim())
    folderName.value = ''
  }
}

const handleClose = () => {
  folderName.value = ''
  emit('close')
}
</script>

<template>
  <div class="modal-backdrop" @click="handleClose">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h3>Create New Folder</h3>
        <button class="close-button" @click="handleClose">&times;</button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="folderName">Folder Name:</label>
            <input
              id="folderName"
              v-model="folderName"
              type="text"
              placeholder="Enter folder name"
              required
              autofocus
            />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-secondary" @click="handleClose">Cancel</button>
            <button type="submit" class="btn-primary">Create</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  color: #666;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

button {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.btn-primary {
  background-color: #1a73e8;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #1557b0;
}

.btn-secondary {
  background-color: #f1f3f4;
  border: none;
  color: #3c4043;
}

.btn-secondary:hover {
  background-color: #e8eaed;
}
</style>
