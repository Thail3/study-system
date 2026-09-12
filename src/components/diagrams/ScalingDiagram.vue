<script setup lang="ts">
interface Box {
  x: number
  y: number
  size: number
  label: string
}

const baseline = 280

const upBoxes: Box[] = [
  { x: 70, y: baseline - 60, size: 60, label: '1×' },
  { x: 220, y: baseline - 90, size: 90, label: '2×' },
  { x: 390, y: baseline - 130, size: 130, label: '4×' },
]

const outBoxes: Box[] = [
  { x: 520, y: baseline - 60, size: 60, label: '1×' },
  { x: 630, y: baseline - 60, size: 60, label: '' },
  { x: 690, y: baseline - 60, size: 60, label: '' },
  { x: 750, y: baseline - 60, size: 60, label: '' },
  { x: 810, y: baseline - 60, size: 60, label: '' },
]

function ticks(box: Box) {
  const t = 6
  const { x, y, size } = box
  return [
    `M${x},${y + t} L${x},${y} L${x + t},${y}`,
    `M${x + size - t},${y} L${x + size},${y} L${x + size},${y + t}`,
    `M${x},${y + size - t} L${x},${y + size} L${x + t},${y + size}`,
    `M${x + size - t},${y + size} L${x + size},${y + size} L${x + size},${y + size - t}`,
  ].join(' ')
}

function slats(box: Box) {
  const { x, y, size } = box
  const count = Math.max(2, Math.round(size / 28))
  const lines: string[] = []
  for (let i = 1; i <= count; i++) {
    const ly = y + (size / (count + 1)) * i
    lines.push(`M${x + size * 0.18},${ly} L${x + size * 0.82},${ly}`)
  }
  return lines.join(' ')
}
</script>

<template>
  <figure class="scaling-figure">
    <svg viewBox="0 0 920 340" xmlns="http://www.w3.org/2000/svg" class="scaling-svg">
      <line x1="460" y1="20" x2="460" y2="320" stroke="var(--line-strong)" stroke-width="1.5" stroke-dasharray="4 5" />

      <text x="250" y="46" text-anchor="middle" class="panel-title">SCALE UP — VERTICAL</text>
      <text x="690" y="46" text-anchor="middle" class="panel-title">SCALE OUT — HORIZONTAL</text>

      <line x1="40" :y1="baseline" x2="430" :y2="baseline" stroke="var(--ink-faint)" stroke-width="1" />
      <line x1="490" :y1="baseline" x2="880" :y2="baseline" stroke="var(--ink-faint)" stroke-width="1" />

      <g v-for="(b, i) in upBoxes" :key="'up' + i">
        <rect
          :x="b.x"
          :y="b.y"
          :width="b.size"
          :height="b.size"
          fill="var(--diagram-violet-wash)"
          stroke="var(--diagram-violet)"
          stroke-width="1.75"
        />
        <path :d="ticks(b)" stroke="var(--diagram-violet)" stroke-width="2" fill="none" />
        <path :d="slats(b)" stroke="var(--ink-soft)" stroke-width="1" />
        <text :x="b.x + b.size / 2" :y="b.y + b.size + 20" text-anchor="middle" class="box-label">{{ b.label }}</text>
      </g>

      <g v-for="i in [0, 1]" :key="'arrow-up' + i">
        <line
          :x1="upBoxes[i].x + upBoxes[i].size + 10"
          :y1="baseline - (upBoxes[i].size + upBoxes[i + 1].size) / 4 - 20"
          :x2="upBoxes[i + 1].x - 10"
          :y2="baseline - (upBoxes[i].size + upBoxes[i + 1].size) / 4 - 20"
          stroke="var(--mark-red)"
          stroke-width="1.5"
          marker-end="url(#arrowhead)"
        />
      </g>

      <g v-for="(b, i) in outBoxes" :key="'out' + i">
        <rect
          :x="b.x"
          :y="b.y"
          :width="b.size"
          :height="b.size"
          fill="var(--diagram-blue-wash)"
          stroke="var(--diagram-blue)"
          stroke-width="1.75"
        />
        <path :d="ticks(b)" stroke="var(--diagram-blue)" stroke-width="2" fill="none" />
        <path :d="slats(b)" stroke="var(--ink-soft)" stroke-width="1" />
        <text v-if="b.label" :x="b.x + b.size / 2" :y="b.y + b.size + 20" text-anchor="middle" class="box-label">{{ b.label }}</text>
      </g>
      <line
        :x1="outBoxes[0].x + outBoxes[0].size + 10"
        :y1="baseline - 90"
        :x2="outBoxes[1].x - 10"
        :y2="baseline - 90"
        stroke="var(--mark-red)"
        stroke-width="1.5"
        marker-end="url(#arrowhead)"
      />
      <line
        x1="630"
        :y1="baseline + 12"
        x2="870"
        :y2="baseline + 12"
        stroke="var(--accent)"
        stroke-width="1.5"
        stroke-dasharray="3 4"
      />
      <text x="750" :y="baseline + 30" text-anchor="middle" class="box-label small">identical nodes, same size</text>

      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="var(--mark-red)" />
        </marker>
      </defs>
    </svg>
    <figcaption class="annotation-label">Fig — vertical scaling grows one node; horizontal scaling adds equal nodes</figcaption>
  </figure>
</template>

<style scoped>
.scaling-figure {
  margin: var(--space-5) 0;
  padding: var(--space-5);
  background: var(--paper-raised);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
}
.scaling-svg {
  width: 100%;
  height: auto;
  display: block;
}
.panel-title {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.08em;
  fill: var(--ink-soft);
}
.box-label {
  font-family: var(--font-mono);
  font-size: 13px;
  fill: var(--ink);
}
.box-label.small {
  font-size: 10px;
  fill: var(--ink-faint);
  letter-spacing: 0.04em;
}
figcaption {
  margin-top: var(--space-3);
  text-align: center;
}
</style>
