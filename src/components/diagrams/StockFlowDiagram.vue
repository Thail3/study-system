<script setup lang="ts">
interface StockNode {
  id: string
  label: string
  x: number
  y: number
  note?: string
}

interface FlowPipe {
  id: string
  label: string
  x1: number
  y1: number
  x2: number
  y2: number
  rateLabel?: string
}

interface CloudNode {
  x: number
  y: number
}

withDefaults(
  defineProps<{
    stocks: StockNode[]
    flows?: FlowPipe[]
    clouds?: CloudNode[]
    infoLinks?: { x1: number; y1: number; x2: number; y2: number }[]
    viewBox?: string
    caption?: string
    stockWidth?: number
    stockHeight?: number
  }>(),
  {
    flows: () => [],
    clouds: () => [],
    infoLinks: () => [],
    viewBox: '0 0 640 300',
    stockWidth: 120,
    stockHeight: 64,
  },
)

function midpoint(x1: number, y1: number, x2: number, y2: number) {
  return { x: (x1 + x2) / 2, y: (y1 + y2) / 2 }
}

function angle(x1: number, y1: number, x2: number, y2: number) {
  return (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI
}
</script>

<template>
  <figure class="sf-figure">
    <svg :viewBox="viewBox" xmlns="http://www.w3.org/2000/svg" class="sf-svg" role="img" :aria-label="caption || 'stock and flow diagram'">
      <defs>
        <marker id="sf-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
          <path d="M0,0 L10,5 L0,10 Z" fill="var(--ink-soft)" />
        </marker>
        <marker id="sf-info-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="var(--accent)" />
        </marker>
      </defs>

      <g v-for="link in infoLinks" :key="`info-${link.x1}-${link.y1}-${link.x2}-${link.y2}`">
        <line
          :x1="link.x1"
          :y1="link.y1"
          :x2="link.x2"
          :y2="link.y2"
          stroke="var(--accent)"
          stroke-width="1.2"
          stroke-dasharray="3 3"
          marker-end="url(#sf-info-arrow)"
        />
      </g>

      <g v-for="cloud in clouds" :key="`cloud-${cloud.x}-${cloud.y}`">
        <path
          :d="`M${cloud.x - 20},${cloud.y + 6}
               a10,10 0 0 1 4,-19
               a12,12 0 0 1 23,-4
               a9,9 0 0 1 11,12
               a9,9 0 0 1 -3,17
               h-28
               a8,8 0 0 1 -7,-6 z`"
          class="sf-cloud"
        />
      </g>

      <g v-for="flow in flows" :key="flow.id">
        <line :x1="flow.x1" :y1="flow.y1" :x2="flow.x2" :y2="flow.y2" class="sf-pipe" marker-end="url(#sf-arrow)" />
        <g
          :transform="`translate(${midpoint(flow.x1, flow.y1, flow.x2, flow.y2).x}, ${midpoint(flow.x1, flow.y1, flow.x2, flow.y2).y}) rotate(${angle(flow.x1, flow.y1, flow.x2, flow.y2)})`"
        >
          <path d="M-9,-9 L0,0 L-9,9 Z M9,-9 L0,0 9,9 Z" class="sf-valve" />
        </g>
        <text
          :x="midpoint(flow.x1, flow.y1, flow.x2, flow.y2).x"
          :y="midpoint(flow.x1, flow.y1, flow.x2, flow.y2).y - 16"
          text-anchor="middle"
          class="sf-flow-label"
        >
          {{ flow.label }}
        </text>
        <text
          v-if="flow.rateLabel"
          :x="midpoint(flow.x1, flow.y1, flow.x2, flow.y2).x"
          :y="midpoint(flow.x1, flow.y1, flow.x2, flow.y2).y + 24"
          text-anchor="middle"
          class="sf-rate-label"
        >
          {{ flow.rateLabel }}
        </text>
      </g>

      <g v-for="s in stocks" :key="s.id">
        <rect :x="s.x - stockWidth / 2" :y="s.y - stockHeight / 2" :width="stockWidth" :height="stockHeight" class="sf-stock" />
        <line
          :x1="s.x - stockWidth / 2"
          :y1="s.y - stockHeight / 2 + 14"
          :x2="s.x + stockWidth / 2"
          :y2="s.y - stockHeight / 2 + 14"
          class="sf-stock-rule"
        />
        <text :x="s.x" :y="s.y + 6" text-anchor="middle" class="sf-stock-label">{{ s.label }}</text>
        <text v-if="s.note" :x="s.x" :y="s.y + stockHeight / 2 + 18" text-anchor="middle" class="sf-stock-note">{{ s.note }}</text>
      </g>
    </svg>
    <figcaption v-if="caption" class="annotation-label">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.sf-figure {
  margin: var(--space-5) 0;
  padding: var(--space-5);
  background: var(--paper-raised);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  overflow-x: auto;
}
.sf-svg {
  width: 100%;
  height: auto;
  display: block;
}
.sf-stock {
  fill: var(--paper-raised);
  stroke: var(--ink);
  stroke-width: 2;
}
.sf-stock-rule {
  stroke: var(--accent);
  stroke-width: 1.5;
}
.sf-stock-label {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 600;
  fill: var(--ink);
}
.sf-stock-note {
  font-family: var(--font-mono);
  font-size: 10px;
  fill: var(--ink-faint);
}
.sf-pipe {
  stroke: var(--ink-soft);
  stroke-width: 5;
}
.sf-valve {
  fill: var(--paper-raised);
  stroke: var(--ink);
  stroke-width: 1.5;
}
.sf-flow-label {
  font-family: var(--font-mono);
  font-size: 11px;
  fill: var(--ink);
}
.sf-rate-label {
  font-family: var(--font-mono);
  font-size: 10px;
  fill: var(--ink-faint);
}
.sf-cloud {
  fill: var(--paper);
  stroke: var(--ink-faint);
  stroke-width: 1.5;
}
figcaption {
  margin-top: var(--space-3);
  text-align: center;
}
</style>
