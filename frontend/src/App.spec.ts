import { describe, it, expect, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { useUserStore } from '@/stores/user'
import { mount } from '@vue/test-utils'
import App from './App.vue'

describe('App.vue', () => {
  const pinia = createTestingPinia({
    createSpy: vi.fn,
  })

  it('renders the component correctly', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [pinia],
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders a specific element', () => {
    const wrapper = mount(App)
    expect(wrapper.find('.app-container').exists()).toBe(true)
  })

  it('renders blur class', () => {
    const userStore = useUserStore(pinia)
    userStore.user = null

    const wrapper = mount(App, {
      global: {
        plugins: [pinia],
      },
    })
    expect(wrapper.find('.app-folder--blur').exists()).toBe(true)
  })

  it('renders properly with user', () => {
    const userStore = useUserStore(pinia)
    userStore.user = { email: 'User 1', token: '123' }

    const wrapper = mount(App, {
      global: {
        plugins: [pinia],
      },
    })
    expect(wrapper.text()).toContain('User 1')
  })
})
