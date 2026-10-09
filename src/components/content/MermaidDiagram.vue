<script setup lang="ts">
import { ref, watch } from 'vue'
import { useScrollReveal } from '../../composables/useScrollReveal'
import { renderMermaid } from './renderMermaid'

const props = defineProps<{ code: string; caption?: string }>()

const container = ref<HTMLDivElement | null>(null)
let renderToken = 0

// flowchart/graph get a per-node/edge staggered reveal; other diagram kinds
// (sequence, state, xychart, ...) don't share mermaid's .node/.edgePaths
// structure, so they fall back to a single whole-figure fade.
const { revealed } = useScrollReveal(container, true)
watch(revealed, (isRevealed) => {
  if (isRevealed) container.value?.classList.add('is-revealed')
})

// Render lazily: only once the figure is within ~1.5 screens of the viewport.
// Rendering every diagram on mount blocked the main thread for seconds on
// long modules (architecture-case-studies has 64 diagrams).
const { revealed: near } = useScrollReveal(container, true, { rootMargin: '1500px 0px' })

function setupReveal(root: HTMLDivElement, code: string) {
  const stagger = /^\s*(flowchart|graph)\b/i.test(code)
  root.classList.remove('mode-stagger', 'mode-fade')
  root.classList.add(stagger ? 'mode-stagger' : 'mode-fade')
  if (!stagger) return
  const els = [
    ...root.querySelectorAll<SVGElement>('.node'),
    ...root.querySelectorAll<SVGElement>('.edgePaths path'),
  ]
  els.forEach((el, i) => el.style.setProperty('--reveal-delay', `${i * 80}ms`))
}

// Mermaid's default theme renders every node the same color regardless of
// role — cycle a small decorative palette across nodes/actors in document
// order so diagrams read as visually distinct without hand-editing each
// diagram's source (role labels vary too much per-diagram to color by
// keyword reliably).
// Own fill alpha (not the shared --*-wash tokens, which stay dim on purpose
// for card/badge backgrounds elsewhere) so diagram nodes read as clearly
// colored against the paper background instead of near-invisible tints.
const NODE_PALETTE = [
  { fill: 'rgba(31, 111, 139, 0.3)', stroke: 'var(--accent)' },
  { fill: 'rgba(107, 91, 149, 0.32)', stroke: 'var(--diagram-violet)' },
  { fill: 'rgba(61, 110, 165, 0.32)', stroke: 'var(--diagram-blue)' },
  { fill: 'rgba(168, 82, 122, 0.32)', stroke: 'var(--diagram-rose)' },
]

function paint(el: SVGElement, i: number) {
  // Don't clobber a diagram author's own mermaid `style`/`classDef` color —
  // only decorate shapes that are still using the theme default.
  if (el.style.fill || el.getAttribute('style')) return
  const c = NODE_PALETTE[i % NODE_PALETTE.length]
  el.style.fill = c.fill
  el.style.stroke = c.stroke
  el.style.strokeWidth = '1.5px'
}

function colorizeNodes(root: Element) {
  root
    .querySelectorAll<SVGElement>('.node rect, .node polygon, .node circle, .node ellipse, .node path')
    .forEach(paint)
  root.querySelectorAll<SVGElement>('.actor').forEach(paint)
}

async function render() {
  const token = ++renderToken
  try {
    const svg = await renderMermaid(props.code)
    if (token === renderToken && container.value) {
      container.value.innerHTML = svg
      container.value.classList.add('is-rendered')
      colorizeNodes(container.value)
      setupReveal(container.value, props.code)
    }
  } catch (err) {
    if (token === renderToken && container.value) {
      container.value.innerHTML = ''
      const pre = document.createElement('pre')
      pre.className = 'mermaid-error'
      pre.textContent = `diagram render error: ${(err as Error).message}`
      container.value.appendChild(pre)
    }
  }
}

watch(near, (isNear) => {
  if (isNear) render()
})
watch(
  () => props.code,
  () => {
    if (near.value) render()
  },
)
</script>

<template>
  <figure class="diagram-figure">
    <div ref="container" class="mermaid-mount" />
    <figcaption v-if="caption" class="annotation-label">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.diagram-figure {
  margin: var(--space-5) 0;
  padding: var(--space-5);
  background: var(--paper-raised);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  overflow-x: auto;
}
.mermaid-mount {
  display: flex;
  justify-content: center;
}
/* Reserve height until the lazy render lands, so off-screen diagrams don't
   all collapse to 0px and intersect the viewport at once. */
.mermaid-mount:not(.is-rendered) {
  min-height: 240px;
}
.mermaid-mount :deep(svg) {
  max-width: 100%;
  height: auto;
}
figcaption {
  margin-top: var(--space-3);
  text-align: center;
}
.mermaid-error {
  color: var(--mark-red);
  font-size: 0.8rem;
  white-space: pre-wrap;
}
.mermaid-mount.mode-stagger :deep(.node) {
  /* opacity-only: mermaid positions nodes via an SVG transform="translate(...)"
     ATTRIBUTE, and a CSS transform property here would override (not compose
     with) that attribute, collapsing every node to the same origin. */
  opacity: 0;
}
.mermaid-mount.mode-stagger.is-revealed :deep(.node) {
  animation: mermaid-node-in 0.4s ease forwards;
  animation-delay: var(--reveal-delay, 0ms);
}
.mermaid-mount.mode-stagger :deep(.edgePaths path) {
  opacity: 0;
}
.mermaid-mount.mode-stagger.is-revealed :deep(.edgePaths path) {
  animation: mermaid-edge-in 0.3s ease forwards;
  animation-delay: var(--reveal-delay, 0ms);
}
.mermaid-mount.mode-fade {
  opacity: 0;
  transition: opacity 0.5s ease;
}
.mermaid-mount.mode-fade.is-revealed {
  opacity: 1;
}
@keyframes mermaid-node-in {
  to {
    opacity: 1;
  }
}
@keyframes mermaid-edge-in {
  to {
    opacity: 1;
  }
}
@media (prefers-reduced-motion: reduce) {
  .mermaid-mount.mode-stagger :deep(.node),
  .mermaid-mount.mode-stagger :deep(.edgePaths path) {
    opacity: 1;
    animation: none !important;
  }
  .mermaid-mount.mode-fade {
    opacity: 1;
    transition: none;
  }
}
</style>
