import { reactive, watch } from 'vue'

const STORAGE_KEY = 'study-system:progress'

function loadInitial(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {}
    const result: Record<string, boolean> = {}
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === 'boolean') result[key] = value
    }
    return result
  } catch {
    return {}
  }
}

const state = reactive<Record<string, boolean>>(loadInitial())

watch(state, (value) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    /* localStorage unavailable (private mode, quota) — progress just won't persist */
  }
})

export function topicKey(moduleSlug: string, topicId: string): string {
  return `${moduleSlug}:${topicId}`
}

export interface UseProgress {
  state: Record<string, boolean>
  isRead: (moduleSlug: string, topicId: string) => boolean
  setRead: (moduleSlug: string, topicId: string, value: boolean) => void
  toggleRead: (moduleSlug: string, topicId: string) => void
  moduleReadCount: (moduleSlug: string, topicIds: string[]) => number
  resetProgress: () => void
}

export function useProgress(): UseProgress {
  function isRead(moduleSlug: string, topicId: string): boolean {
    return !!state[topicKey(moduleSlug, topicId)]
  }

  function setRead(moduleSlug: string, topicId: string, value: boolean): void {
    state[topicKey(moduleSlug, topicId)] = value
  }

  function toggleRead(moduleSlug: string, topicId: string): void {
    const key = topicKey(moduleSlug, topicId)
    state[key] = !state[key]
  }

  function moduleReadCount(moduleSlug: string, topicIds: string[]): number {
    return topicIds.filter((id) => isRead(moduleSlug, id)).length
  }

  function resetProgress(): void {
    for (const key of Object.keys(state)) {
      delete state[key]
    }
  }

  return { state, isRead, setRead, toggleRead, moduleReadCount, resetProgress }
}
