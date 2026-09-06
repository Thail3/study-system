import { describe, it, expect, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { useProgress, topicKey } from './useProgress'

describe('useProgress', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('topicKey formats module:topic', () => {
    expect(topicKey('scalability', 'load-balancer-basics')).toBe('scalability:load-balancer-basics')
  })

  it('isRead is false for an untouched topic', () => {
    const { isRead } = useProgress()
    expect(isRead('test-module-a', 'topic-1')).toBe(false)
  })

  it('toggleRead flips read state back and forth', () => {
    const { isRead, toggleRead } = useProgress()
    expect(isRead('test-module-b', 'topic-1')).toBe(false)
    toggleRead('test-module-b', 'topic-1')
    expect(isRead('test-module-b', 'topic-1')).toBe(true)
    toggleRead('test-module-b', 'topic-1')
    expect(isRead('test-module-b', 'topic-1')).toBe(false)
  })

  it('setRead sets an explicit value', () => {
    const { isRead, setRead } = useProgress()
    setRead('test-module-c', 'topic-1', true)
    expect(isRead('test-module-c', 'topic-1')).toBe(true)
    setRead('test-module-c', 'topic-1', false)
    expect(isRead('test-module-c', 'topic-1')).toBe(false)
  })

  it('moduleReadCount counts only read topics among the given ids', () => {
    const { setRead, moduleReadCount } = useProgress()
    setRead('test-module-d', 'a', true)
    setRead('test-module-d', 'b', false)
    setRead('test-module-d', 'c', true)
    expect(moduleReadCount('test-module-d', ['a', 'b', 'c'])).toBe(2)
  })

  it('persists changes to localStorage', async () => {
    const { setRead } = useProgress()
    setRead('test-module-e', 'topic-1', true)
    await nextTick()
    const raw = localStorage.getItem('study-system:progress')
    expect(raw).toBeTruthy()
    const parsed = JSON.parse(raw as string)
    expect(parsed['test-module-e:topic-1']).toBe(true)
  })
})
