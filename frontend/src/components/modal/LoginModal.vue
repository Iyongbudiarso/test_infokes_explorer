<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '../../stores/user'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const store = useUserStore()
const email = ref('')
const password = ref('')

const handleSubmit = async () => {
  if (!email.value || !password.value) {
    store.error = 'Please fill in all fields'
    return
  }

  try {
    await store.login(email.value, password.value)
    emit('close')
  } catch (err) {
    // Error is already handled in store
    console.error('Login failed:', err)
  }
}
</script>

<template>
  <div class="modal-backdrop" @click="emit('close')">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h3>Login</h3>
        <button class="close-button" @click="emit('close')">&times;</button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="email">Email:</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              placeholder="Enter your email"
              autofocus
              :disabled="store.isLoading"
            />
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              placeholder="Enter your password"
              :disabled="store.isLoading"
            />
          </div>
          <p v-if="store.error" class="error-message">{{ store.error }}</p>
          <p v-if="store.isLoading" class="loading-message">Logging in...</p>
          <div class="modal-footer">
            <button
              type="button"
              class="btn-secondary"
              :disabled="store.isLoading"
              @click="emit('close')"
            >
              Cancel
            </button>
            <button type="submit" class="btn-primary" :disabled="store.isLoading">
              {{ store.isLoading ? 'Logging in...' : 'Login' }}
            </button>
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

.form-group input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.loading-message {
  color: #1a73e8;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

button {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #1a73e8;
  color: white;
  border: none;
}

.btn-primary:hover:not(:disabled) {
  background-color: #1557b0;
}

.btn-secondary {
  background-color: #f1f3f4;
  border: none;
  color: #3c4043;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #e8eaed;
}
</style>
