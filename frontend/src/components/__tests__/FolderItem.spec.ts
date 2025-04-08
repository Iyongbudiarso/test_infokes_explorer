import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import FolderItem from '../FolderItem.vue'

describe('FolderItem', () => {
  it('renders properly level 0', () => {
    const wrapper = mount(FolderItem, {
      props: {
        folder: { id: 'root', name: 'Root' },
        level: 0,
        expandedFolders: <Set<string>>new Set(),
      },
    })
    expect(wrapper.text()).toContain('Root')
  })

  it('renders properly with children', () => {
    const wrapper = mount(FolderItem, {
      props: {
        folder: {
          id: 'root',
          name: 'Root',
          children: [{ id: 'child1', name: 'Child 1' }],
        },
        level: 1,
        expandedFolders: <Set<string>>new Set([]),
      },
    })
    expect(wrapper.text()).toContain('▶')
    expect(wrapper.text()).toContain('Root')
  })

  it('renders properly expanded children', () => {
    const wrapper = mount(FolderItem, {
      props: {
        folder: {
          id: 'root',
          name: 'Root',
          children: [{ id: 'child1', name: 'Child 1' }],
        },
        level: 1,
        expandedFolders: <Set<string>>new Set(['root']),
      },
    })
    expect(wrapper.text()).toContain('▼')
    expect(wrapper.text()).toContain('Root')
    expect(wrapper.text()).toContain('Child 1')
  })
})
