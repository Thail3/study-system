<script setup lang="ts">
const levels = [
  { y: 80, title: 'EVENTS', sub: 'สิ่งที่เกิดขึ้นตอนนี้', leaderY: 80, leaderX: 265 },
  { y: 177, title: 'PATTERNS / TRENDS', sub: 'พฤติกรรมซ้ำเมื่อเวลาผ่านไป', leaderY: 170, leaderX: 300 },
  { y: 282, title: 'SYSTEMIC STRUCTURES', sub: 'stock/flow/loop ที่ผลิตแพทเทิร์นนั้น', leaderY: 280, leaderX: 340 },
  { y: 400, title: 'MENTAL MODELS', sub: 'ความเชื่อที่ทำให้โครงสร้างถูกสร้างขึ้น', leaderY: 400, leaderX: 380 },
]
</script>

<template>
  <figure class="ib-figure">
    <svg viewBox="0 0 720 480" xmlns="http://www.w3.org/2000/svg" class="ib-svg">
      <rect x="0" y="120" width="720" height="360" fill="var(--diagram-blue-wash)" opacity="0.25" />
      <path
        d="M0,120 Q20,108 40,120 T80,120 T120,120 T160,120 T200,120 T240,120 T280,120 T320,120 T360,120 T400,120 T440,120"
        fill="none"
        stroke="var(--diagram-blue)"
        stroke-width="1.5"
      />

      <!-- iceberg tip, above water -->
      <path d="M250,40 L280,120 L220,120 Z" fill="var(--paper-raised)" stroke="var(--ink)" stroke-width="2" />
      <!-- layer 2: patterns -->
      <path d="M220,120 L280,120 L320,220 L180,220 Z" fill="var(--diagram-blue-wash)" stroke="var(--diagram-blue)" stroke-width="1.5" />
      <!-- layer 3: structures -->
      <path d="M180,220 L320,220 L360,340 L140,340 Z" fill="var(--diagram-blue-wash)" stroke="var(--diagram-blue)" stroke-width="2" opacity="0.85" />
      <!-- layer 4: mental models, deepest + widest -->
      <path d="M140,340 L360,340 L400,460 L100,460 Z" fill="var(--diagram-blue-wash)" stroke="var(--diagram-blue)" stroke-width="2.5" opacity="0.95" />

      <!-- leader lines -->
      <line v-for="(l, i) in levels" :key="'leader' + i" :x1="l.leaderX" :y1="l.leaderY" x2="460" :y2="l.y" stroke="var(--line-strong)" stroke-width="1" stroke-dasharray="3 3" />

      <!-- labels -->
      <g v-for="(l, i) in levels" :key="'label' + i">
        <rect x="460" :y="l.y - 24" width="240" height="48" rx="4" fill="var(--paper-raised)" stroke="var(--line)" stroke-width="1.2" />
        <text x="472" :y="l.y - 5" class="node-label strong">{{ l.title }}</text>
        <text x="472" :y="l.y + 13" class="annotation-text">{{ l.sub }}</text>
      </g>

      <!-- down arrows + "ทำไม?" between labels -->
      <g v-for="i in 3" :key="'arrow' + i">
        <line :x1="580" :y1="levels[i - 1].y + 26" :x2="580" :y2="levels[i].y - 26" stroke="var(--ink-faint)" stroke-width="1.3" marker-end="url(#ib-arrow)" />
        <text x="590" :y="(levels[i - 1].y + levels[i].y) / 2 + 4" class="annotation-text">ทำไม?</text>
      </g>

      <defs>
        <marker id="ib-arrow" markerWidth="8" markerHeight="8" refX="4" refY="6" orient="auto">
          <path d="M0,0 L4,6 L8,0 Z" fill="var(--ink-faint)" />
        </marker>
      </defs>

      <text x="250" y="30" text-anchor="middle" class="annotation-text">ผิวน้ำ</text>
    </svg>
    <figcaption class="annotation-label">Fig — ยิ่งลึกใต้ผิวน้ำ ยิ่งกว้างและยิ่งมี leverage มากขึ้น: จาก event ที่เห็นตรงหน้า ลงไปถึง mental model ที่ฝังลึกที่สุด</figcaption>
  </figure>
</template>

<style scoped>
.ib-figure {
  margin: var(--space-5) 0;
  padding: var(--space-5);
  background: var(--paper-raised);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
}
.ib-svg {
  width: 100%;
  height: auto;
  display: block;
}
.node-label {
  font-family: var(--font-mono);
  font-size: 12px;
  fill: var(--ink);
}
.node-label.strong {
  font-size: 13px;
  font-weight: 600;
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
