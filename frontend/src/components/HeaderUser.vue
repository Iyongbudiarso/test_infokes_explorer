<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '../stores/user'
import LoginModal from './modal/LoginModal.vue'

const store = useUserStore()
const showLoginModal = ref(false)

const handleLogout = () => {
  store.logout()
}
</script>

<template>
  <div class="header-user">
    <div class="user-info">
      <template v-if="store.isAuthenticated">
        <span class="user-email">{{ store.user?.email }}</span>
        <button class="logout-btn" @click="handleLogout">Logout</button>
      </template>
      <template v-else>
        <span class="user-email">Please login first</span>
        <button class="login-btn" @click="showLoginModal = true">Login</button>
      </template>
    </div>

    <LoginModal v-if="showLoginModal" @close="showLoginModal = false" />
  </div>
</template>

<style scoped>
.header-user {
  background-color: #f0f0f0;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 8px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  justify-content: space-between;
}

.user-email {
  font-size: 0.875rem;
  color: #333;
}

button {
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  border: none;
}

.login-btn {
  background-color: #1a73e8;
  color: white;
}

.login-btn:hover {
  background-color: #1557b0;
}

.logout-btn {
  background-color: #f1f3f4;
  color: #3c4043;
}

.logout-btn:hover {
  background-color: #e8eaed;
}
</style>
