import { describe, it, expect } from 'vitest'
import { modules } from './modules'
import { getAllQuizItems, getQuizForTopic, getRawQuizKeys } from './quizzes'

describe('quizzes data', () => {
  it('every topic in modules.ts has a matching quiz entry with at least one question', () => {
    for (const mod of modules) {
      for (const topic of mod.topics) {
        const qas = getQuizForTopic(mod.slug, topic.id)
        expect(qas.length, `${mod.slug}:${topic.id} has no quiz questions`).toBeGreaterThan(0)
      }
    }
  })

  it('every RAW_QUIZZES key maps to a real module:topic pair (no stale/typo keys)', () => {
    const realKeys = new Set(modules.flatMap((mod) => mod.topics.map((topic) => `${mod.slug}:${topic.id}`)))
    for (const key of getRawQuizKeys()) {
      expect(realKeys.has(key), `RAW_QUIZZES has a key with no matching topic: ${key}`).toBe(true)
    }
  })

  it('getAllQuizItems produces unique ids', () => {
    const ids = getAllQuizItems().map((item) => item.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('getAllQuizItems count matches the sum of per-topic quiz questions', () => {
    const expectedCount = modules.reduce(
      (sum, mod) => sum + mod.topics.reduce((s, topic) => s + getQuizForTopic(mod.slug, topic.id).length, 0),
      0,
    )
    expect(getAllQuizItems().length).toBe(expectedCount)
  })
})
