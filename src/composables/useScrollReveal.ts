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
 * `options` is passed to IntersectionObserver (default `threshold: 0.4`); use a
 * positive `rootMargin` to fire before the target is actually visible (lazy render).
 */
export function useScrollReveal(
  target: Ref<Element | null>,
  active: boolean,
  options: IntersectionObserverInit = { threshold: 0.4 },
): UseScrollReveal {
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
      options,
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
