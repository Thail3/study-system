<script setup lang="ts">
type Group = 'rose' | 'blue' | 'violet' | 'accent'

interface Node {
  x: number
  y: number
  label: string
  group: Group
}

const nodes: Node[] = [
  { x: 320, y: 60, label: 'Limits to\nGrowth', group: 'violet' },
  { x: 462, y: 112, label: 'Fixes That\nFail', group: 'rose' },
  { x: 537, y: 242, label: 'Shifting the\nBurden', group: 'rose' },
  { x: 511, y: 390, label: 'Tragedy of\nthe Commons', group: 'blue' },
  { x: 395, y: 487, label: 'Success to\nthe Successful', group: 'blue' },
  { x: 245, y: 487, label: 'Escalation', group: 'blue' },
  { x: 130, y: 390, label: 'Growth and\nUnderinvestment', group: 'violet' },
  { x: 103, y: 242, label: 'Accidental\nAdversaries', group: 'accent' },
  { x: 179, y: 112, label: 'Eroding\nGoals', group: 'rose' },
]

const hub = { x: 320, y: 280 }

function lines(label: string): string[] {
  return label.split('\n')
}
</script>

<template>
  <figure class="am-figure">
    <svg viewBox="0 0 640 590" xmlns="http://www.w3.org/2000/svg" class="am-svg">
      <line v-for="(n, i) in nodes" :key="'spoke' + i" :x1="hub.x" :y1="hub.y" :x2="n.x" :y2="n.y" stroke="var(--line-strong)" stroke-width="1" stroke-dasharray="3 3" />

      <g v-for="(n, i) in nodes" :key="'node' + i">
        <rect :x="n.x - 48" :y="n.y - 22" width="96" height="44" rx="6" :class="['am-node', n.group]" />
        <text
          v-for="(line, li) in lines(n.label)"
          :key="'line' + li"
          :x="n.x"
          :y="n.y - (lines(n.label).length - 1) * 6 + li * 12 + 4"
          text-anchor="middle"
          class="am-node-text"
        >
          {{ line }}
        </text>
      </g>

      <circle :cx="hub.x" :cy="hub.y" r="58" fill="var(--paper-raised)" stroke="var(--ink)" stroke-width="2.5" />
      <text :x="hub.x" :y="hub.y - 10" text-anchor="middle" class="am-hub-text strong">9</text>
      <text :x="hub.x" :y="hub.y + 8" text-anchor="middle" class="am-hub-text">Systems</text>
      <text :x="hub.x" :y="hub.y + 22" text-anchor="middle" class="am-hub-text">Archetypes</text>

      <!-- legend -->
      <g transform="translate(60, 545)">
        <rect x="0" y="-10" width="14" height="14" rx="2" class="am-node rose" />
        <text x="20" y="1" class="annotation-text">วนซ้ำทำร้ายตัวเอง</text>
        <rect x="180" y="-10" width="14" height="14" rx="2" class="am-node blue" />
        <text x="200" y="1" class="annotation-text">แย่งทรัพยากรร่วม</text>
        <rect x="360" y="-10" width="14" height="14" rx="2" class="am-node violet" />
        <text x="380" y="1" class="annotation-text">โตแล้วชนขีดจำกัด</text>
        <rect x="500" y="-10" width="14" height="14" rx="2" class="am-node accent" />
        <text x="520" y="1" class="annotation-text">ไม่มีใครตั้งใจ</text>
      </g>
    </svg>
    <figcaption class="annotation-label">Fig — แผนที่ 9 archetypes ที่เรียนมาตลอดโมดูลนี้ จัดกลุ่มตามธรรมชาติของปัญหา ไม่ใช่ลำดับที่สอน</figcaption>
  </figure>
</template>

<style scoped>
.am-figure {
  margin: var(--space-5) 0;
  padding: var(--space-5);
  background: var(--paper-raised);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
}
.am-svg {
  width: 100%;
  height: auto;
  display: block;
}
.am-node {
  stroke-width: 1.5;
}
.am-node.rose {
  fill: var(--mark-red-wash);
  stroke: var(--mark-red);
}
.am-node.blue {
  fill: var(--diagram-blue-wash);
  stroke: var(--diagram-blue);
}
.am-node.violet {
  fill: var(--diagram-violet-wash);
  stroke: var(--diagram-violet);
}
.am-node.accent {
  fill: var(--accent-wash);
  stroke: var(--accent-strong);
}
.am-node-text {
  font-family: var(--font-mono);
  font-size: 10px;
  fill: var(--ink);
}
.am-hub-text {
  font-family: var(--font-mono);
  font-size: 13px;
  fill: var(--ink);
}
.am-hub-text.strong {
  font-size: 22px;
  font-weight: 700;
}
.annotation-text {
  font-family: var(--font-mono);
  font-size: 10px;
  fill: var(--ink-faint);
}
figcaption {
  margin-top: var(--space-3);
  text-align: center;
}
</style>
