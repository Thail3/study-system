import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

export interface UseScrollReveal {
  revealed: Ref<boolean>
  replayToken: Ref<number>
  replay: () => void
}

/**
 * Fires `revealed` once when `target` scrolls into view, then disconnects.
 * `replay()` bumps `replayToken` — pair it with `:key="replayToken"` on the
 * animated subtree so Vue remounts fresh elements and CSS animations restart.
 */
export function useScrollReveal(target: Ref<Element | null>, active: boolean): UseScrollReveal {
  const revealed = ref(false)
  const replayToken = ref(0)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!active) return
    if (typeof IntersectionObserver === 'undefined' || !target.value) {
      revealed.value = true
      return
    }
    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          revealed.value = true
          observer?.disconnect()
          observer = null
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(target.value)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
  })

  function replay() {
    replayToken.value++
  }

  return { revealed, replayToken, replay }
}
