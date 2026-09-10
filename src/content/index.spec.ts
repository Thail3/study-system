import { describe, it, expect } from 'vitest'
import { getTopicSource } from './index'

describe('getTopicSource', () => {
  it('loads existing topic markdown content', async () => {
    const src = await getTopicSource(2, '01-vertical-vs-horizontal')
    expect(src).toContain('Scale Up')
  })

  it('returns a placeholder for content that does not exist', async () => {
    const src = await getTopicSource(999, 'does-not-exist')
    expect(src).toContain('เนื้อหายังไม่ถูกเขียน')
  })
})
