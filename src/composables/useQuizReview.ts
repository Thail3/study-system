import { reactive, watch } from 'vue'

const STORAGE_KEY = 'study-system:quiz-sr'
const BOX_INTERVAL_DAYS = [0, 1, 3, 7, 14, 30]
const MAX_BOX = BOX_INTERVAL_DAYS.length - 1

interface QuestionState {
  box: number
  dueDate: string
}

function todayStr(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

function isValidState(value: unknown): value is QuestionState {
  if (typeof value !== 'object' || value === null) return false
  const v = value as QuestionState
  return Number.isInteger(v.box) && v.box >= 0 && v.box <= MAX_BOX && typeof v.dueDate === 'string' && DATE_RE.test(v.dueDate)
}

function loadInitial(): Record<string, QuestionState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {}
    const result: Record<string, QuestionState> = {}
    for (const [key, value] of Object.entries(parsed)) {
      if (isValidState(value)) result[key] = { box: value.box, dueDate: value.dueDate }
    }
    return result
  } catch {
    return {}
  }
}

const state = reactive<Record<string, QuestionState>>(loadInitial())

watch(state, (value) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    /* localStorage unavailable (private mode, quota) — progress just won't persist */
  }
})

export function useQuizReview() {
  function getState(id: string): QuestionState {
    return state[id] ?? { box: 0, dueDate: todayStr() }
  }

  function isDue(id: string): boolean {
    return getState(id).dueDate <= todayStr()
  }

  function recordResult(id: string, remembered: boolean): void {
    const nextBox = remembered ? Math.min(MAX_BOX, getState(id).box + 1) : 0
    state[id] = { box: nextBox, dueDate: addDays(todayStr(), BOX_INTERVAL_DAYS[nextBox]) }
  }

  function dueIds(ids: string[]): string[] {
    return ids.filter((id) => isDue(id))
  }

  function dueCount(ids: string[]): number {
    return dueIds(ids).length
  }

  return { getState, isDue, recordResult, dueIds, dueCount }
}
