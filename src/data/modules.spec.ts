import { describe, it, expect } from 'vitest'
import { modules, getModuleBySlug } from './modules'

describe('modules data', () => {
  it('getModuleBySlug finds an existing module', () => {
    const mod = getModuleBySlug('scalability')
    expect(mod?.title).toBe('Scalability')
  })

  it('getModuleBySlug returns undefined for an unknown slug', () => {
    expect(getModuleBySlug('does-not-exist')).toBeUndefined()
  })

  it('every module has a unique slug and id', () => {
    const slugs = modules.map((m) => m.slug)
    const ids = modules.map((m) => m.id)
    expect(new Set(slugs).size).toBe(slugs.length)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every topic id and file is unique within its own module', () => {
    for (const mod of modules) {
      const topicIds = mod.topics.map((t) => t.id)
      const files = mod.topics.map((t) => t.file)
      expect(new Set(topicIds).size).toBe(topicIds.length)
      expect(new Set(files).size).toBe(files.length)
    }
  })

  it('every module marked available has at least one topic', () => {
    for (const mod of modules) {
      if (mod.status === 'available') {
        expect(mod.topics.length).toBeGreaterThan(0)
      }
    }
  })
})
