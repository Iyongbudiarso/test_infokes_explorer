import { describe, it, expect, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { useUserStore } from '@/stores/user'

import { mount } from '@vue/test-utils'
import HeaderUser from '../HeaderUser.vue'

describe('HeaderUser', () => {
  const pinia = createTestingPinia({
    createSpy: vi.fn,
  })

  it('renders properly', () => {
    const wrapper = mount(HeaderUser, {
      global: {
        plugins: [pinia],
      },
    })
    expect(wrapper.text()).toContain('Login')
  })

  it('renders properly with user', () => {
    const userStore = useUserStore(pinia)
    userStore.user = { email: 'User 1', token: '123' }

    const wrapper = mount(HeaderUser, {
      global: {
        plugins: [pinia],
      },
    })
    expect(wrapper.text()).toContain('User 1')
  })
})
