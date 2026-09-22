<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { useScrollReveal } from '../../composables/useScrollReveal'

interface CLDNode {
  id: string
  label: string
  x: number
  y: number
}

interface CLDLink {
  from: string
  to: string
  polarity: '+' | '-'
  /** perpendicular bend offset in px — use when two links share the same pair of nodes */
  bend?: number
}

interface CLDLoop {
  label: 'R' | 'B'
  x: number
  y: number
  note?: string
}

interface CLDDelay {
  from: string
  to: string
}

const props = withDefaults(
  defineProps<{
    nodes: CLDNode[]
    links: CLDLink[]
    loops?: CLDLoop[]
    delays?: CLDDelay[]
    /** subset of `links` (matched by from+to) to trace with a colored reveal animation on scroll */
    highlightLinks?: { from: string; to: string }[]
    viewBox?: string
    caption?: string
    nodeWidth?: number
    nodeHeight?: number
  }>(),
  {
    loops: () => [],
    delays: () => [],
    highlightLinks: () => [],
    viewBox: '0 0 640 380',
    nodeWidth: 128,
    nodeHeight: 46,
  },
)

const target = useTemplateRef<SVGSVGElement>('target')
const { revealed, replayToken, replay } = useScrollReveal(target, props.highlightLinks.length > 0)

const highlightNodeOrder = computed<string[]>(() => {
  const seen: string[] = []
  for (const l of props.highlightLinks) {
    if (!seen.includes(l.from)) seen.push(l.from)
    if (!seen.includes(l.to)) seen.push(l.to)
  }
  return seen
})

const nodeById = computed(() => new Map(props.nodes.map((n) => [n.id, n])))

function trimToRect(cx: number, cy: number, dx: number, dy: number, halfW: number, halfH: number) {
  if (dx === 0 && dy === 0) return { x: cx, y: cy }
  const tx = dx !== 0 ? halfW / Math.abs(dx) : Infinity
  const ty = dy !== 0 ? halfH / Math.abs(dy) : Infinity
  const t = Math.min(tx, ty)
  return { x: cx + dx * t, y: cy + dy * t }
}

interface RenderedLink {
  key: string
  path: string
  labelX: number
  labelY: number
  polarity: '+' | '-'
  start?: { x: number; y: number }
  end?: { x: number; y: number }
}

const renderedLinks = computed<RenderedLink[]>(() => {
  const halfW = props.nodeWidth / 2
  const halfH = props.nodeHeight / 2
  return props.links.flatMap((link, i) => {
    const a = nodeById.value.get(link.from)
    const b = nodeById.value.get(link.to)
    if (!a || !b) {
      if (import.meta.env.DEV) {
        console.warn(`[CausalLoopDiagram] link references missing node: ${link.from} -> ${link.to}`)
      }
      return []
    }

    const dx = b.x - a.x
    const dy = b.y - a.y
    const len = Math.hypot(dx, dy) || 1
    const ux = dx / len
    const uy = dy / len
    const bend = link.bend ?? 0

    const start = trimToRect(a.x, a.y, dx, dy, halfW, halfH)
    const end = trimToRect(b.x, b.y, -dx, -dy, halfW, halfH)

    const midX = (start.x + end.x) / 2 - uy * bend
    const midY = (start.y + end.y) / 2 + ux * bend

    const path =
      bend === 0
        ? `M${start.x},${start.y} L${end.x},${end.y}`
        : `M${start.x},${start.y} Q${midX},${midY} ${end.x},${end.y}`

    return [{
      key: `${link.from}-${link.to}-${i}`,
      path,
      labelX: midX - uy * 14,
      labelY: midY + ux * 14,
      polarity: link.polarity,
      start,
      end,
    }]
  })
})

interface DelayMark {
  key: string
  tick1: string
  tick2: string
}

const delayMarks = computed<DelayMark[]>(() => {
  const out: DelayMark[] = []
  for (const d of props.delays) {
    const link = renderedLinks.value.find((l) => l.key.startsWith(`${d.from}-${d.to}-`))
    if (!link || !link.start || !link.end) continue
    const dx = link.end.x - link.start.x
    const dy = link.end.y - link.start.y
    const len = Math.hypot(dx, dy) || 1
    const ux = dx / len
    const uy = dy / len
    const cx = link.start.x + dx * 0.55
    const cy = link.start.y + dy * 0.55
    const tickLen = 9
    const gap = 5
    const p1a = { x: cx - uy * tickLen - ux * gap, y: cy + ux * tickLen - uy * gap }
    const p1b = { x: cx + uy * tickLen - ux * gap, y: cy - ux * tickLen - uy * gap }
    const p2a = { x: cx - uy * tickLen + ux * gap, y: cy + ux * tickLen + uy * gap }
    const p2b = { x: cx + uy * tickLen + ux * gap, y: cy - ux * tickLen + uy * gap }
    out.push({
      key: `${d.from}-${d.to}`,
      tick1: `M${p1a.x},${p1a.y} L${p1b.x},${p1b.y}`,
      tick2: `M${p2a.x},${p2a.y} L${p2b.x},${p2b.y}`,
    })
  }
  return out
})

interface HighlightLink {
  key: string
  path: string
  delayMs: number
}

const highlightedLinks = computed<HighlightLink[]>(() =>
  props.highlightLinks.flatMap((h, i) => {
    const link = renderedLinks.value.find((l) => l.key.startsWith(`${h.from}-${h.to}-`))
    if (!link) return []
    return [{ key: link.key, path: link.path, delayMs: i * 350 }]
  }),
)

interface HighlightNode {
  id: string
  x: number
  y: number
  delayMs: number
}

const highlightedNodes = computed<HighlightNode[]>(() =>
  highlightNodeOrder.value.flatMap((id, i) => {
    const n = nodeById.value.get(id)
    if (!n) return []
    return [{ id, x: n.x, y: n.y, delayMs: i * 350 }]
  }),
)
</script>

<template>
  <figure class="cld-figure">
    <button v-if="highlightedLinks.length && revealed" class="diagram-replay-btn" title="เล่นอนิเมชั่นอีกครั้ง" @click="replay">↻</button>
    <svg ref="target" :viewBox="viewBox" xmlns="http://www.w3.org/2000/svg" class="cld-svg" role="img" :aria-label="caption || 'causal loop diagram'">
      <defs>
        <marker id="cld-arrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
          <path d="M0,0 L9,4.5 L0,9 Z" fill="var(--ink)" />
        </marker>
      </defs>

      <g v-for="l in renderedLinks" :key="l.key">
        <path :d="l.path" fill="none" stroke="var(--ink)" stroke-width="1.5" marker-end="url(#cld-arrow)" />
        <circle :cx="l.labelX" :cy="l.labelY" r="9" class="polarity-badge" />
        <text :x="l.labelX" :y="l.labelY + 4" text-anchor="middle" class="polarity-text">{{ l.polarity }}</text>
      </g>

      <g v-for="d in delayMarks" :key="'delay-' + d.key">
        <path :d="d.tick1" class="delay-tick" />
        <path :d="d.tick2" class="delay-tick" />
      </g>

      <g v-for="n in nodes" :key="n.id">
        <rect :x="n.x - nodeWidth / 2" :y="n.y - nodeHeight / 2" :width="nodeWidth" :height="nodeHeight" rx="4" class="cld-node" />
        <text :x="n.x" :y="n.y + 4" text-anchor="middle" class="cld-node-label">{{ n.label }}</text>
      </g>

      <g :key="replayToken" class="diagram-reveal-layer" :class="{ revealed }">
        <path
          v-for="hl in highlightedLinks"
          :key="hl.key"
          :d="hl.path"
          class="diagram-reveal-link"
          path-length="1"
          :style="{ animationDelay: hl.delayMs + 'ms' }"
        />
        <rect
          v-for="hn in highlightedNodes"
          :key="hn.id"
          :x="hn.x - nodeWidth / 2"
          :y="hn.y - nodeHeight / 2"
          :width="nodeWidth"
          :height="nodeHeight"
          rx="4"
          class="diagram-reveal-node"
          :style="{ animationDelay: hn.delayMs + 'ms' }"
        />
      </g>

      <g v-for="(loop, i) in loops" :key="'loop-' + i">
        <circle :cx="loop.x" :cy="loop.y" r="17" class="loop-badge" :class="loop.label === 'R' ? 'loop-r' : 'loop-b'" />
        <text :x="loop.x" :y="loop.y + 5" text-anchor="middle" class="loop-badge-text">{{ loop.label }}</text>
        <text v-if="loop.note" :x="loop.x" :y="loop.y + 34" text-anchor="middle" class="loop-note">{{ loop.note }}</text>
      </g>
    </svg>
    <figcaption v-if="caption" class="annotation-label">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.cld-figure {
  position: relative;
  margin: var(--space-5) 0;
  padding: var(--space-5);
  background: var(--paper-raised);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  overflow-x: auto;
}
.cld-svg {
  width: 100%;
  height: auto;
  display: block;
}
.cld-node {
  fill: var(--paper-raised);
  stroke: var(--ink);
  stroke-width: 1.5;
}
.cld-node-label {
  font-family: var(--font-mono);
  font-size: 12px;
  fill: var(--ink);
}
.polarity-badge {
  fill: var(--paper-raised);
  stroke: var(--ink-soft);
  stroke-width: 1;
}
.polarity-text {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  fill: var(--ink);
}
.loop-badge {
  stroke-width: 2;
}
.loop-badge.loop-r {
  fill: var(--mark-red-wash);
  stroke: var(--mark-red);
}
.loop-badge.loop-b {
  fill: var(--accent-wash);
  stroke: var(--accent-strong);
}
.loop-badge-text {
  font-family: var(--font-mono);
  font-size: 16px;
  font-weight: 700;
  fill: var(--ink);
}
.loop-note {
  font-family: var(--font-mono);
  font-size: 10px;
  fill: var(--ink-faint);
}
.delay-tick {
  stroke: var(--ink);
  stroke-width: 2;
}
figcaption {
  margin-top: var(--space-3);
  text-align: center;
}
</style>
